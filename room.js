/*
 * Copyright (C) George Ober - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  Written by George Ober <george.a.ober@gmail.com>,
 *  on 5/9/2020 (DD/MM/YY).
 */

module.exports = {
    Room:
    class Room {
        constructor(p1, p1GUID, p1Name){
            this.id = Math.floor(Math.random() * Math.floor(999999));
            this.p1 = {socket : p1, GUID : p1GUID, pawns:{white:2, black:2}, name:p1Name === "" ? "Light" : p1Name, turn: false, area:"bottom"};
            this.pawnReserve = {white:10,black:10};
            this.gameBoard = [
                null,null,null,null,null,null,null,null,null,"blackBot",null,"whiteBot","redBot",null,null,null,null,null,null,null,null,null,null,null
            ];
            this.ended = false;
        }
        addSecondPlayer(p2, p2GUID, p2Name){
            this.p2 = {socket : p2, GUID : p2GUID, pawns:{white:2, black:2}, name:p2Name === "" ? "Dark" : p2Name, turn: false, area:"top"};
        }
        generateGameState(player){
            let r = {};
            if (player === "p1") {
                r = {
                    id: this.id,
                    ended: this.ended,
                    p1: {pawns: this.p1.pawns, name: this.p1.name, you: true, turn: this.p1.turn, connected: this.p1.socket.connected, area: this.p1.area},
                    p2: {pawns: this.p2.pawns, name: this.p2.name, you: false, turn: this.p2.turn, connected: this.p2.socket.connected, area: this.p2.area},
                    gameBoard: this.gameBoard,
                    pawnReserve: this.pawnReserve
                };
            }else if (player === "p2"){
                r = {
                    id: this.id,
                    ended: this.ended,
                    p1: {pawns: this.p1.pawns, name: this.p1.name, you: false, turn: this.p1.turn, connected: this.p1.socket.connected, area: this.p1.area},
                    p2: {pawns: this.p2.pawns, name: this.p2.name, you: true, turn: this.p2.turn, connected: this.p2.socket.connected, area: this.p2.area},
                    gameBoard: this.gameBoard,
                    pawnReserve: this.pawnReserve
                };
            }else if (player === "spect"){
                r = {
                    id: this.id,
                    p1: {pawns: this.p1.pawns, name: this.p1.name, you: false, connected: this.p1.socket.connected},
                    p2: {pawns: this.p2.pawns, name: this.p2.name, you: false, connected: this.p2.socket.connected},
                    gameBoard: this.gameBoard,
                    pawnReserve: this.pawnReserve
                };
            }
            return r;
        }
        findWinner(){
            let p1Count = 0, p2Count = 0;
            for (let i = 0; i < this.gameBoard.length; i++) {
                if(this.gameBoard[i] === "blackBot" || this.gameBoard[i] === "whiteBot" || this.gameBoard[i] === "redBot"){
                    if(i <= 9 || i === 13 || i === 11){
                        p2Count++;
                    }else{
                        p1Count++;
                    }
                }
            }
            //True is p1, false is p2
            return p1Count > p2Count;
        }
        isNeighbour(id1,id2){
            let neighbours = [
                [1, 2, 4],
                [3, 6, 4, 0],
                [0, 4, 7, 5],
                [1, 6, 8],
                [0, 1, 2, 6, 7, 9],
                [2, 7, 10],
                [1, 3, 4, 8, 9, 11],
                [2, 4, 5, 9, 10, 12],
                [3, 6, 11, 13],
                [4, 6, 7, 11, 12, 14],
                [5, 7, 12, 15],
                [6, 8, 9, 13, 14, 16],
                [7, 9, 10, 14, 15, 17],
                [8, 11, 16, 18],
                [9, 11, 12, 16, 17, 19],
                [10, 12, 17, 20],
                [11, 13, 14, 18, 19, 21],
                [12, 14, 15,19,20,22],
                [13, 16, 21],
                [14, 16, 17, 21, 22, 23],
                [15, 17, 22],
                [16, 18, 19,23],
                [17, 19, 20,23],
                [19, 21, 22]
            ];
            for (let i = 0; i < neighbours[id1].length; i++) {
                if(neighbours[id1][i] === id2) return true;
            }
            return false;
        }
    }
};