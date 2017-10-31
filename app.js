var app=angular.module('myApp',[]);
app.controller('mainController',['$scope',function($scope){
    var messages = document.getElementById("messages");
    var modalContent = document.getElementById('modalContent');
    var modal = document.getElementById('myModal');
    var main = document.getElementById("main");
    var username = document.getElementById("username");

    var socket = io.connect();
    $scope.send = function(){
        var msgString = localStorage.getItem("username") + " :"+$scope.message ;
        socket.emit('chat message',msgString );
        $scope.message="";

    };
    $scope.logIn = function(){
        socket.emit('check user', username.value);
    };
    socket.on('new nick',function(user){
       modalContent.appendChild(document.createElement("p").appendChild(document.createTextNode("the username "+user +" is taken")));
        console.log("sofarsogod")
    });
    socket.on('logIn',function(user){
        main.style.display = "block";
        modal.style.display = "none";
        localStorage.setItem("username", username.value)
    });
    socket.on('chat message', function(msg){
        var li=document.createElement("li");
        li.appendChild(document.createTextNode(msg));
        messages.appendChild(li);
    });
}]);