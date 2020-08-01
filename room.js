module.exports = {
    Room:
    class Room {
        constructor(p1, p1GUID){
            this.id = Math.floor(Math.random() * Math.floor(999999));
            this.p1 = {socket : p1, GUID : p1GUID};
            this.p2 = undefined;
        }
    }
}