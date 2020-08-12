const roomHandler = require("./room.js");
const express = require('express');
const util = require('util');
let app = express();
const https = require('https');
const fs = require('fs');

var port = process.env.PORT || 8080;

app.use(express.static('public'));
app.get('/', function (req, res) {
    // nbroom
    res.sendFile("public/index.html");
});

/*https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: '1234'
}, app)*/

let server = app.listen(port, function (){
    console.log("Listening on http://127.0.0.1:"+port);
});
const io = require('socket.io').listen(server).sockets;

let waitingRooms = [];
let workingRooms = [];

function makeGUID() {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 25; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


io.on('connection', (socket) => {
    console.log("User connection");
    let game;
    socket.on("createroom",(data) => {
        if (data.GUID === undefined){
            game = new roomHandler.Room(socket, makeGUID(),data.name);
        }else{
            game = new roomHandler.Room(socket, data.GUID,data.name);
        }
        waitingRooms[game.id] = game;
        socket.emit("gotoroom", {id : game.id, GUID : game.p1.GUID});
    });
    socket.on("joinroom",(data) => {
        if (waitingRooms[data.roomId] !== undefined) {
            if (data.GUID === undefined || data.GUID === null){
                game = waitingRooms[data.roomId];
                game.addSecondPlayer(socket, makeGUID(),data.name);
            }else if(data.GUID === waitingRooms[data.roomId].p1.GUID){
                game = waitingRooms[data.roomId];
                game.p1.socket = socket;
                socket.emit("gotoroom",{id : game.id, GUID : game.p1.GUID});
                return;
            }else{
                game = waitingRooms[data.roomId];
                game.addSecondPlayer(socket, data.GUID,data.name);
            }
            workingRooms[game.id] = game;
            delete waitingRooms[game.id];

            game.p2.socket.emit("GUID", game.p2.GUID);
            game.p1.socket.emit("startgame", game.generateGameState("p1"));
            game.p2.socket.emit("startgame", game.generateGameState("p2"));
            game.p1.turn = true;
            game.p1.socket.emit("yourTurn");
            game.p2.socket.emit("ennemmyTurn");
        }else{
            if (workingRooms[data.roomId] !== undefined) {
                if(data.GUID == workingRooms[data.roomId].p1.GUID){
                    workingRooms[data.roomId].p1.socket = socket;
                    game = workingRooms[data.roomId];
                    game.p1.socket.emit("startgame", game.generateGameState("p1"));
                    game.p2.socket.emit("ennemyOnline");
                }else if(data.GUID == workingRooms[data.roomId].p2.GUID){
                    workingRooms[data.roomId].p2.socket = socket;
                    game = workingRooms[data.roomId];
                    game.p2.socket.emit("startgame", game.generateGameState("p2"));
                    game.p1.socket.emit("ennemyOnline");
                }else{
                    game = workingRooms[data.roomId];
                    socket.emit("spectator",game.generateGameState("spect"));
                }
            }else{
                socket.emit("wrongroom");
            }
        }
    });
    socket.on("placingPawn",(data) => {
        if(typeof game != "undefined"){
            if (socket == game.p1.socket){
                if(game.p1.turn){
                    if(data.color == "whitePawn" && game.p1.pawns.white >= 1){
                        if (game.gameBoard[data.pos] == null){
                            game.gameBoard[data.pos] = "whitePawn";
                            game.p1.pawns.white--;
                        }else return;
                    }else if(data.color == "blackPawn" && game.p1.pawns.black >= 1){
                        if (game.gameBoard[data.pos] == null){
                            game.gameBoard[data.pos] = "blackPawn";
                            game.p1.pawns.black--;
                        }else return;
                    }else return;
                    game.p1.turn = false;
                    game.p1.socket.emit("placedPawn",{pawn:{color:data.color,pos:data.pos}, state: game.generateGameState("p1")});
                    game.p2.socket.emit("placedPawn",{pawn:{color:data.color,pos:data.pos}, state: game.generateGameState("p2")});

                    game.p2.turn = true;
                    game.p2.socket.emit("yourTurn");
                    game.p1.socket.emit("ennemmyTurn");
                }
            }else if(socket == game.p2.socket){
                if(game.p2.turn){
                    if(data.color == "whitePawn" && game.p2.pawns.white >= 1){
                        if (game.gameBoard[data.pos] == null){
                            game.gameBoard[data.pos] = "whitePawn";
                            game.p2.pawns.white--;
                        }else return;
                    }else if(data.color == "blackPawn" && game.p2.pawns.black >= 1){
                        if (game.gameBoard[data.pos] == null){
                            game.gameBoard[data.pos] = "blackPawn";
                            game.p2.pawns.black--;
                        }else return;
                    }else return;
                    game.p2.turn = false;
                    game.p1.socket.emit("placedPawn",{pawn:{color:data.color,pos:data.pos}, state: game.generateGameState("p1")});
                    game.p2.socket.emit("placedPawn",{pawn:{color:data.color,pos:data.pos}, state: game.generateGameState("p2")});

                    game.p1.turn = true;
                    game.p1.socket.emit("yourTurn");
                    game.p2.socket.emit("ennemmyTurn");
                }
            }
        }
    });
    socket.on("reloadPawns",(data) => {
        if(typeof game != "undefined"){
            if (socket == game.p1.socket && game.p1.turn){
                if (game.p1.pawns.white + game.p1.pawns.black < 4){
                    if (data.white + data.black == 4 - game.p1.pawns.white - game.p1.pawns.black || game.pawnReserve.white - data.white === 0 || game.pawnReserve.black - data.black === 0){
                        if (data.white <= game.pawnReserve.white && data.black <= game.pawnReserve.black){
                            game.pawnReserve.white -= data.white;
                            game.pawnReserve.black -= data.black;

                            game.p1.pawns.white += data.white;
                            game.p1.pawns.black += data.black;

                            game.p1.turn = false;
                            game.p1.socket.emit("reloadedPawn", game.generateGameState("p1"));
                            game.p2.socket.emit("reloadedPawn", game.generateGameState("p2"));

                            if(game.pawnReserve.white === 0 || game.pawnReserve.black === 0){
                                if(game.findWinner()){
                                    game.p1.socket.emit("winner", {name:game.p1.name,you:true});
                                    game.p2.socket.emit("winner", {name:game.p1.name,you:false});
                                }else{
                                    game.p1.socket.emit("winner", {name:game.p2.name,you:false});
                                    game.p2.socket.emit("winner", {name:game.p2.name,you:true});
                                }
                                game.ended = true;
                            }else{
                                game.p2.turn = true;
                                game.p2.socket.emit("yourTurn");
                                game.p1.socket.emit("ennemmyTurn");
                            }
                        }
                    }
                }
            }else if(socket == game.p2.socket && game.p2.turn){
                if (game.p2.pawns.white + game.p2.pawns.black < 4){
                    if (data.white + data.black == 4 - game.p2.pawns.white - game.p2.pawns.black || game.pawnReserve.white - data.white === 0 || game.pawnReserve.black - data.black === 0){
                        if (data.white <= game.pawnReserve.white && data.black <= game.pawnReserve.black){
                            game.pawnReserve.white -= data.white;
                            game.pawnReserve.black -= data.black;

                            game.p2.pawns.white += data.white;
                            game.p2.pawns.black += data.black;

                            game.p2.turn = false;
                            game.p1.socket.emit("reloadedPawn", game.generateGameState("p1"));
                            game.p2.socket.emit("reloadedPawn", game.generateGameState("p2"));

                            if(game.pawnReserve.white === 0 || game.pawnReserve.black === 0){
                                if(game.findWinner()){
                                    game.p1.socket.emit("winner", {name:game.p1.name,you:true});
                                    game.p2.socket.emit("winner", {name:game.p1.name,you:false});
                                }else{
                                    game.p1.socket.emit("winner", {name:game.p2.name,you:false});
                                    game.p2.socket.emit("winner", {name:game.p2.name,you:true});
                                }
                                game.ended = true;
                            }else{
                                game.p1.turn = true;
                                game.p1.socket.emit("yourTurn");
                                game.p2.socket.emit("ennemmyTurn");
                            }
                        }
                    }
                }
            }else return;
        }
    });
    socket.on("moveRobot",(data) => {
        if(typeof game != "undefined"){
            if (socket == game.p1.socket && game.p1.turn){
                for (let i = 0; i < game.gameBoard.length; i++) {
                    if(game.gameBoard[i] === data.bot && data.path[0] === i){
                        for (let j = 0; j < data.path.length - 1; j++) {
                            if(!game.isNeighbour(data.path[j],data.path[j+1]))return;
                            if(!((game.gameBoard[data.path[j+1]]   === "blackPawn" && data.bot === "blackBot") ||
                                    (game.gameBoard[data.path[j+1]]  === "whitePawn" && data.bot === "whiteBot") ||
                                    ((game.gameBoard[data.path[j+1]] === "blackPawn" || game.gameBoard[data.path[j+1]] === "whitePawn") && data.bot === "redBot"))) {
                                return;
                            }
                        }
                        for (let j = 0; j < data.path.length; j++) {
                            game.gameBoard[data.path[j]] = null;
                        }

                        game.gameBoard[data.path[data.path.length - 1]] = data.bot;

                        game.p1.turn = false;
                        game.p2.turn = true;
                        game.p1.socket.emit("movedBot",{move:data, state:game.generateGameState("p1")});
                        game.p2.socket.emit("movedBot",{move:data, state:game.generateGameState("p2")});
                    }
                }
            }else if(socket == game.p2.socket && game.p2.turn){
                for (let i = 0; i < game.gameBoard.length; i++) {
                    if(game.gameBoard[i] === data.bot && data.path[0] === i){
                        for (let j = 0; j < data.path.length - 1; j++) {
                            if(!game.isNeighbour(data.path[j],data.path[j+1]))return;
                            if(!((game.gameBoard[data.path[j+1]]   === "blackPawn" && data.bot === "blackBot") ||
                                (game.gameBoard[data.path[j+1]]  === "whitePawn" && data.bot === "whiteBot") ||
                                ((game.gameBoard[data.path[j+1]] === "blackPawn" || game.gameBoard[data.path[j+1]] === "whitePawn") && data.bot === "redBot"))) {
                                return;
                            }
                        }
                        for (let j = 0; j < data.path.length; j++) {
                            game.gameBoard[data.path[j]] = null;
                        }
                        game.gameBoard[data.path[data.path.length - 1]] = data.bot;

                        game.p2.turn = false;
                        game.p1.turn = true;
                        game.p1.socket.emit("movedBot",{move:data, state:game.generateGameState("p1")});
                        game.p2.socket.emit("movedBot",{move:data, state:game.generateGameState("p2")});

                    }
                }
            }
        }
    });
    socket.on("updateName", (data) => {
        if(typeof game != "undefined") {
            if(data.length < 20){
                if(socket == game.p1.socket){
                    game.p1.name = data === "" ? "Light" : data;

                    game.p1.socket.emit("nameChanged", {id: game.id, name:game.p1.name, you: true});
                    game.p2.socket.emit("nameChanged", {id: game.id, name:game.p1.name, you: false});
                }else if(socket == game.p2.socket){
                    game.p2.name = data === "" ? "Dark" : data;

                    game.p1.socket.emit("nameChanged", {id: game.id, name:game.p2.name, you: false});
                    game.p2.socket.emit("nameChanged", {id: game.id, name:game.p2.name, you: true});
                }
            }
        }
    });
    /*socket.on("disconnect",() => {
        if(typeof game != "undefined"){
            for (let i = 0; i < waitingRooms.length; i++) {
                try{
                    if(waitingRooms[i].p1.socket == socket){
                        delete waitingRooms[i];
                    }
                }catch (e) {}
            }
            for (let i = 0; i < workingRooms.length; i++) {
                try{
                    if(workingRooms[i].p1.socket == socket){
                        workingRooms[i].p2.socket.emit("ennemyOffline");
                    }else if(workingRooms[i].p2.socket == socket){
                        workingRooms[i].p1.socket.emit("ennemyOffline");
                    }
                }catch (e) {}
            }
        }
    });*/
    function isInGame(s){
        for (let i = 0; i < workingRooms.length; i++) {
            if (workingRooms[i].p1.socket == s || workingRooms[i].p2.socket == s){
                return true;
            }
        }
        return false;
    }
});