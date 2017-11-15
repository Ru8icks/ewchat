var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongojs = require('mongojs');
var db = mongojs('chat', ['chat']);

app.use(express.static(__dirname));

app.get('/chat', function(req,res){
    console.log("received get request")
    db.chat.find(function(err, docs){
        console.log(docs);
        res.json(docs);
    });

});
app.get('/nick' ,function(req,res){
    console.log(req.query.userId +"hai hai hai");
    db.chat.findOne({socketID : req.query.userId }, function(err,result){
        res.json(result);
    })


});

io.on('connection', function(socket){
    console.log("a user connected");
    socket.on('wisper',function(socID, msg){
        socket.to(socID).emit('chat message',msg);
        console.log("whisper"+socID+msg);
        socket.to(socket.id).emit('chat message',msg);


    });

    socket.on('newChat',function(ID, ID2){
        console.log(ID+"   "+ID2);
        socket.join(ID+ID2);
        socket.to(ID).emit('newChat',ID,ID2);

    });
    socket.on('joinRoom', function(ID){
        console.log(ID);
        socket.join(ID);
    })

    socket.on('chat message', function(msg){
        io.emit('chat message', msg);

    });

    socket.on('disconnect', function(){
        console.log('a user disconnected '+socket.id);
        db.chat.remove({socketID: socket.id}, function(err,doc){
            if (err) {
                console.warn(err.message);
            }
            else {
                console.log("user removed from db" + doc);
            }
            socket.broadcast.emit('refresh');

        });
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
                db.chat.insert({name: user, socketID : socket.id}, function (err, o) {
                    if (err) {
                        console.warn(err.message);
                    }
                    else {
                        console.log("user addded to db " + user);
                    }
                });
                socket.emit('logIn', user);
                socket.broadcast.emit('refresh');

                }
            }
        });

    });

});

http.listen(3000, function(){
    console.log('listening on port 3000 mafks');
});
