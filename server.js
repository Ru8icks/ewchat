var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongojs = require('mongojs');
var db = mongojs('chat', ['chat']);

app.use(express.static(__dirname));


io.on('connection', function(socket){
    console.log("a user connected");
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });

    socket.on('disconnect', function(){
        console.log('a user disconnected');
        db.chat.remove({name:user});
    });

    socket.on('check user', function(user){
    db.chat.count({name :user}, function (err, docs) {
        if (err) {
            console.warn(err.message);
        }
        else {
            console.log(docs);
            if (docs!==0){
                socket.emit('new nick', user);
            } else {
                db.chat.insert({name: user}, function (err, o) {
                    if (err) {
                        console.warn(err.message);
                    }
                    else {
                        console.log("user addded to db " + user);
                    }
                });
                socket.emit('logIn', user);
                }
            }
        });
    });

});

http.listen(3000, function(){
    console.log('listening on port 3000 mafks');
});
