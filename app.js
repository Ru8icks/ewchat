var app=angular.module('myApp',['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl :"home.html",
        controller: "mainController"
    })
        .when('/privChat',{
            templateUrl: "privChat.html",
            controller: "privChatController"
        })
        .otherwise({redirectTo: "/"})
});

