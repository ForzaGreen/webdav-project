
var app = angular.module('loginApp', []);

app.controller('LoginController', ['$scope', '$http', function($scope, $http) {

    $scope.submit = function() {
        localStorage.setItem("proxyAddress", $scope.proxyAddress);

        $http({
            method: 'POST',
            url: $scope.proxyAddress + '/proxy/login',
            data: { "username": $scope.username, "password": $scope.password }
        }).then(function successCallback(response) {
            console.log("post sent :)");
            if(response.data == "login success") {
                window.location.href='home.html';
            } else {
                //show a module saying error loging
                $("#loginFailed").modal("show");
            }
        }, function errorCallback(response) {
            $("#loginFailed").modal("show");
        });
    };

}]);

app.controller('SignupController', ['$scope', '$http', function($scope, $http) {

    $scope.submit = function() {
        localStorage.setItem("proxyAddress", $scope.proxyAddress);

        $http({
            method: 'POST',
            url: $scope.proxyAddress + '/proxy/signup',
            data: {
                "username": $scope.username,
                "password": $scope.password,
                "token": $scope.token
            }
        }).then(function successCallback(response) {
            console.log("post sent :)");
            if(response.data == "signup success") {
                window.location.href='home.html';
            } else {
                //show a module saying error loging
                $("#signupFailed").modal("show");
            }
        }, function errorCallback(response) {
            $("#signupFailed").modal("show");
        });
    };

}]);

// jQuery context-menu:
// Right Click
$(function() {
    $.contextMenu({
        selector: '.context-menu-one',
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m);
        },
        items: {
            "edit": {name: "Edit", icon: "edit"},
            "cut": {name: "Cut", icon: "cut"},
            copy: {name: "Copy", icon: "copy"},
            "paste": {name: "Paste", icon: "paste"},
            "delete": {name: "Delete", icon: "delete"},
            "sep1": "---------",
            "quit": {name: "Quit", icon: function(){
                return 'context-menu-icon context-menu-icon-quit';
            }}
        }
    });

    $('.context-menu-one').on('click', function(e){
        console.log('clicked', this);
    })
});



