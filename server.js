var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));


io.on('connection', function(socket){
    console.log("a user connected");
    socket.on('chat message', function(msg,username){
        io.emit('chat message', msg, username);
    });
    socket.on('disconnect', function(){
        console.log('a user disconnected');
    });

});

http.listen(3000, function(){
    console.log('listening on port 3000 mafks');
});