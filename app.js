var app=angular.module('myApp',[]);
app.controller('mainController',['$scope', '$http',function($scope, $http){
    var messages = document.getElementById("messages");
    var modalContent = document.getElementById('modalContent');
    var modal = document.getElementById('myModal');
    var main = document.getElementById("main");
    var username = document.getElementById("username");

    var socket = io.connect();


    if (localStorage.getItem("username") !== null)  {
        $scope.userNick = localStorage.getItem("username")

    }

    var refreshUsers = function(){
        console.log("whygetnowork")
        $http.get('/chat').then(function (response) {
            console.log("got requested dadta");
            console.log(response.data);
            $scope.activeUsers = response.data;


        });
    };

    $scope.send = function(){
        var msgString = localStorage.getItem("username") + " :"+$scope.message ;
        socket.emit('chat message',msgString );
        //get request, use socket.id to get current username. fuck localstoragebug/feature.
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
        localStorage.setItem("username", user)
        refreshUsers();
    });
    socket.on('chat message', function(msg){
        var li=document.createElement("li");
        li.appendChild(document.createTextNode(msg));
        messages.appendChild(li);
    });
    socket.on('refresh', function(){
        refreshUsers();
    })
}]);