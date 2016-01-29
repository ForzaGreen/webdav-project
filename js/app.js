
var app = angular.module('loginApp', []);

app.controller('LoginController', ['$scope', '$http', function($scope, $http) {

    $scope.proxyAddress = "http://52.88.66.246:5000";
    $scope.username = "Wael";
    $scope.submit = function() {
        localStorage.setItem("proxyAddress", $scope.proxyAddress);
        localStorage.setItem("username", $scope.username.toLowerCase()); //

        $http({
            method: 'POST',
            url: $scope.proxyAddress + '/proxy/login',
            data: { "username": $scope.username, "password": $scope.password }
        }).then(function successCallback(response) {
            console.log("post sent :)");
            switch (response.data) {
                case 'login success':
                    window.location.href='home.html';
                    break;
                case 'wrong password':
                    $("#loginFailed").modal("show");
                    $("#loginError").text("Wrong Password");
                    break;
                case 'no such user':
                    $("#loginFailed").modal("show");
                    $("#loginError").text("No such user");
                    break;                    
            }
            /*if(response.data == "login success") {
                window.location.href='home.html';
            } else {
                //show a module saying error loging
                $("#loginFailed").modal("show");
            } */
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
                "token": $scope.token,
                "type" : $scope.userType,
                "webdavServer": $scope.webdavServer
            }
        }).then(function successCallback(response) {
            console.log("post sent :)");
            switch (response.data) {
                case "signup success":
                    window.location.href='home.html';
                    break;
                case "user already exists":
                    $("#signupFailed").modal("show");
                    $("#signUpError").text("User already exists");
                    break;
            }
            /*if(response.data == "signup success") {
                window.location.href='home.html';
            } else {
                //show a module saying error loging
                $("#signupFailed").modal("show");
            } */
        }, function errorCallback(response) {
            $("#signupFailed").modal("show");
        });
    };

}]);

// jQuery context-menu:
// Right Click
//$(function() {
//    $.contextMenu({
//        selector: '.context-menu-one',
//        callback: function(key, options) {
//            var m = "clicked: " + key;
//            window.console && console.log(m) || alert(m);
//        },
//        items: {
//            "edit": {name: "Edit", icon: "edit"},
//            "cut": {name: "Cut", icon: "cut"},
//            copy: {name: "Copy", icon: "copy"},
//            "paste": {name: "Paste", icon: "paste"},
//            "delete": {name: "Delete", icon: "delete"},
//            "sep1": "---------",
//            "quit": {name: "Quit", icon: function(){
//                return 'context-menu-icon context-menu-icon-quit';
//            }}
//        }
//    });
//
//    $('.context-menu-one').on('click', function(e){
//        console.log('clicked', this);
//    })
//});



