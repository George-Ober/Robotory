module.exports = {save_board:save_board,load_board:load_board,print:print};
const MongoClient = require('mongodb').MongoClient;
//const game = require("./board");
//const dburl = "mongodb://195.220.53.35:2777/";
const dburl = "mongodb://localhost:27017/";
const dbname = "robotory";
const colname = "boards";

function createdb() {
    MongoClient.connect(dburl+dbname, function(err, db) {
        if (err) throw err;
        console.log("Database " + dbname + " created!");
        db.close();
    });
    MongoClient.connect(dburl, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbname);
        dbo.createCollection(colname, function(err, res) {
            if (err) throw err;
            console.log("Collection " + colname + " created!");
            db.close();
        });
    });
}

//createdb();

function createAccount(a){
    MongoClient.connect(dburl, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbname);
        var myobj = { name: a.name, discID: undefined, pswrd: a.password};

        dbo.collection(colname).insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
}

//createAccount({name:"Cazeip", email: "george.a.ober@gmail.com"});

function findAccount(query) {
    MongoClient.connect(dburl, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbname);
        dbo.collection(colname).find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
        });
    });
}
findAccount({name:"Cazeip"});
function deleteAccount(query) {
    MongoClient.connect(dburl, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbname);
        dbo.collection(colname).deleteOne(query, function(err, obj) {
            if (err) throw err;
            console.log("1 document deleted : "+obj);
            db.close();
        });
    });
}

function addDiscordCredentials(discID, name) {
    MongoClient.connect(dburl, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbname);
        var myquery = { name: name };
        var newvalues = { $set: {discID: discID} };
        dbo.collection(colname).updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
        });
    });
}
//addDiscordCredentials("742376018865553482","Cazeip");

//DON'TNEED BEGIN
function save_board(b) {
    MongoClient.connect(dburl, function(err, db) {
        if (err) throw err;
        sock = [];
        var dbo = db.db(dbname);
        //console.log();
        b.players.forEach( (p) => {sock.push(p.socket); p.socket=null; } );
        var myquery = { id: b.id };
        dbo.collection(colname).deleteOne(myquery, function(err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
        });

        dbo.collection(colname).insertOne(b, function(err, res) {
            if (err) throw err;
            console.log("board inserted");
            db.close();
        });
        b.players.forEach( (p) => {p.socket=sock.shift();});
    });
}

function print() {
    MongoClient.connect(dburl, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbname);
        dbo.collection(colname).find({}).toArray(function(err, res) {
            if (err) throw err;
            console.log(JSON.stringify(res));
            db.close();
        });
    });

}
//print();

async function load_board(id, boards) {
    console.log("loading "+id);
    const db = await MongoClient.connect(dburl);
    const dbo = db.db(dbname);
    const res = await dbo.collection(colname).find({id:id}).toArray();
    if(res[0] != undefined) {
        b = new game.Board(123, null, 'data');
        b.init(res[0]);
        console.log("loaded "+JSON.stringify(b));
        return boards[id] = b;
    } else
        return undefined;
}

function eraseBase(){
    MongoClient.connect(dburl, function(err, db) {
        var dbo = db.db(dbname);
        dbo.collection(colname).deleteMany({});
    });
}
//DON'T NEED END


//load_board("MYqh", {});

// async function load_board(id, boards) {
//     MongoClient.connect(dburl, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db(dbname);
//         const res = dbo.collection(colname).find({id:id}).toArray(function(err, res) {
//             if (err) throw err;
//             console.log(JSON.stringify(res));
//             db.close();
//         });
//         boards[id] = res;
//     });
// }
//addboard( new game.Board(123, 456, 'data') );


/*
function findone() {
    MongoClient.connect(dburl, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbname);
        dbo.collection(colname).findOne({}, function(err, res) {
            if (err) throw err;
            console.log(res);
            db.close();
        });
    });

}

findone();
*/

