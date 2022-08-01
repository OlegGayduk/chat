var PORT = process.env.PORT || 3000;

var express = require("express");

var mysql = require("mysql");

var app = express();

let path = require('path');
let fs = require('fs');

var cookieParser = require('cookie-parser');
var session = require('express-session');

var SessionStore = require('express-mysql-session');

var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
app.use(jsonParser);

const aws = require('aws-sdk');

const S3_BUCKET = process.env.S3_BUCKET;

aws.config.region = 'us-east-1';

app.use(cookieParser());

var db_config = {
    host: "host",
    user: "user",
    password: "pass",
    database: "db",
    acquireTimeout: 1000000
};

app.use(session({
    saveUnitialized: true,
    secret: "secret",
    key: "sid",
    store: new SessionStore(db_config),
}));

var { randomBytes } = require('crypto');

app.use(express.static("public/"));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept-Type');

    next();
});

var connection;

function handleDisconnect() {
    connection = mysql.createConnection(db_config); 
                                                    
    connection.connect(function(err) {              
      if(err) {                                     
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); 
      }                                     
    });                                     
                                            
    connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
        handleDisconnect();                         
      } else {                                      
        throw err;                                  
      }
    });
}

handleDisconnect();                                                                           

app.get("/", function(req, res) {

    //if(req.session.csrf === undefined) {
        //req.session.csrf = randomBytes(100).toString('base64');
    //}

    res.sendFile("index.html");
});

app.get("/login_check", function(req, res) {
    (req.session.username) ? res.send("1") : res.send("0");
});

app.post("/login", function(req, res) {
    connection.query("SELECT id,alias FROM users WHERE login='"+req.body.login+"' and pass='"+req.body.pass+"'", function (error, users) {
        if(users != "" && users != undefined) { 
            req.session.username = users[0].id;
            res.send("1");
        } else {
            res.send("0");
        }
    });
});

app.get("/check", function(req, res) {
    if(req.session.username) {
        connection.query("SELECT id,alias FROM users WHERE id='"+req.session.username+"'", function (error, users) {
            if(users != "" && users != undefined) { 
                res.send(users[0]);
            } else {
                res.send("0");
            }
        });
    } else {
        res.send("0");
    }
});

app.get("/logout", function(req, res) {
    req.session.username = "";
    res.sendFile("index.html");
});

app.get("/get_msgs", function (req, res) {
    connection.query("SELECT id,sender,text,date_min,alias FROM msgs ORDER BY id DESC LIMIT 30", function (error, msgs) {
        if(msgs != "" && msgs != undefined) { 
            res.send(JSON.stringify(msgs));
        } else {
            res.send("0");
        }
    });
});

app.post("/get_more_msgs", function (req, res) {
    connection.query("SELECT id,sender,text,date_min,alias FROM msgs WHERE (id < '" + req.body.lastId + "') ORDER BY id DESC LIMIT 30", function (error, msgs) {
        if(msgs != "" && msgs != undefined) { 
            res.send(JSON.stringify(msgs));
        } else {
            res.send("0");
        }
    });
});

app.get("/media_upload", function(req, res) {
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    };
  
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if(err){
        console.log(err);
        return res.end();
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      };
      res.write(JSON.stringify(returnData));
      res.end();
    });
});

var server = app.listen(PORT, ()=>console.log("Server started"));
var io = require("socket.io").listen(server);

io.on("connection", function (socket) {

    console.log("User connected", socket.id);

    socket.on("typing", function(id, alias) {
        io.emit("typing", id, alias);
    });

    socket.on("stop_typing", function() {
        io.emit("stop_typing");
    });

    socket.on("delete_message", function(data) {
        connection.query("DELETE FROM msgs WHERE id='" + data.id + "'", function(error, res) {
            io.emit("delete_message", data);
        });
    });

    socket.on("new_message", function (data) {
        console.log("Client says", data);

        connection.query("INSERT INTO msgs (sender, text, date_min, alias) VALUES ('" + data.id + "', '" + data.msg + "', '" + data.time + "', '" + data.alias + "')", function (error, res) {
            io.emit("new_message", {
                id: res.insertId,
                sender: data.id,
                msg: data.msg,
                alias: data.alias,
                time: data.time
            });
        });
    });

    socket.on("bot_msg", function(data) {
    	console.log("Bot says: " + data);
    	io.emit("bot_msg", data);
    });
});