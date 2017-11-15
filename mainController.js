
app.controller('mainController',['$scope', '$http', "$location",function($scope, $http,$location){
    var messages = document.getElementById("messages");
    var modalContent = document.getElementById('modalContent');
    var modal = document.getElementById('myModal');
    var main = document.getElementById("main");
    var username = document.getElementById("username");
    var wisperValue = document.getElementById("select");
    var nick;
    var socket = io.connect();


    if (localStorage.getItem("username") !== null)  {
        $scope.userNick = localStorage.getItem("username")

    }

    var refreshUsers = function(){
        $http.get('/chat').then(function (response) {
            console.log("got requested dadta");
            console.log(response.data);
            $scope.activeUsers = response.data;


        });
    };
    $scope.wisper = function(){
        socket.emit('wisper', wisperValue.options[wisperValue.selectedIndex].value , username.value+" wispers: "+$scope.message);
        var li=document.createElement("li");
        li.appendChild(document.createTextNode(username.value+" wispers: "+$scope.message));
        messages.appendChild(li);
        $scope.message="";
    };
    $scope.chatWith = function(socID){
        console.log(socID);
        console.log(socket.id);
        socket.emit('newChat', socID, socket.id);
        $location.path('/privChat');

    };

    $scope.send = function(){

        var msgString = nick + ": "+$scope.message ;
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
        localStorage.setItem("username", user)

        var config = {params: {userId : socket.id}}
        $http.get('/nick', config ).then(function (response) {
            console.log("got requested hurra");
            console.log(response.data.name);
            nick = response.data.name;
        });
        refreshUsers();
    });
    socket.on('chat message', function(msg){
        var li=document.createElement("li");
        li.appendChild(document.createTextNode(msg));
        messages.appendChild(li);
    });
    socket.on('refresh', function(){
        refreshUsers();
    });
    socket.on('newChat', function(ID, ID2){
        console.log("does this work work work");
        var r = confirm(ID+ " wants to talk");
        if (r == true) {
            socket.emit('joinRoom',ID+ID2);
            $location.path('/privChat');
        } else {

        }

    });
}]);