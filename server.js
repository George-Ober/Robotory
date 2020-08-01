const roomHandler = require("./room.js");
const express = require('express');
const util = require('util');
let app = express();

var port = process.env.PORT || 8080;

app.use(express.static('public'));
app.get('/', function (req, res) {
    // nbroom
    res.sendFile("public/index.html");    
}); 
let server = app.listen(port, function (){
    console.log("Listening on http://127.0.0.1:"+port);
});
const io = require('socket.io').listen(server).sockets;

let rooms = [];

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

    socket.on("createroom",(GUID) => {
        if (GUID == undefined){
            game = new roomHandler.Room(socket, makeGUID());
        }else{
            game = new roomHandler.Room(socket, GUID);
        }
        rooms[game.id] = game;
        socket.emit("gotoroom", {id : game.id, GUID : game.p1.GUID});
    });
});