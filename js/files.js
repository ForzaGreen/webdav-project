/**
 * Created by wael on 17/01/16.
 */

var app = angular.module('filesApp', []);

app.controller('TokenController', ['$scope', '$http', function($scope, $http) {

    $scope.proxyAddress = localStorage.getItem("proxyAddress"); //address stored in login phase
    $scope.withoutServer = function() {
        $scope.type = "C";
        sendPostToken();
    };
    $scope.withServer = function() {
        $scope.type = "B";
        sendPostToken();
    };

    var sendPostToken = function() {
        $http({
            method: 'POST',
            url: $scope.proxyAddress + '/proxy/token',
            data: { "type": $scope.type }
        }).then(function successCallback(response) {
            console.log("post sent :)");
            $scope.token = response.data;
        }, function errorCallback(response) {
            //
        });
    };
}]);

app.controller('FilesController', ['$scope', '$http', function($scope, $http) {

    $scope.proxyAddress = localStorage.getItem("proxyAddress");
    //$scope.currentDirectory = 'wael';
    $scope.currentDirectory = localStorage.getItem("username");;

    $scope.files = [
        {"name": "Wael", "type": "collection", "glyphicon": "folder-close", "modified": "2 days ago", "size": "2 KB"},
        {"name": "file.txt", "type": "file", "glyphicon": "file", "modified": "2 days ago", "size": "2 KB"}
    ];

    $scope.refreshListFiles = function() {
        sendPostListFiles();
    };

    $scope.getPhotoOrChangeDir = function(f) {
        if(f.type == "file") {
            $http({
                method: 'GET',
                url: $scope.proxyAddress + '/proxy/dav/' + $scope.currentDirectory + '/' + f.name,
                responseType: "blob"
            }).then(function successCallback(response) {
                console.log(response);
                // show image in modal
                if ( response.data.type.includes("image") ) {
                    $("#imgModal").modal("show");
                    var reader  = new FileReader();
                    reader.addEventListener("load", function () {
                        $("#myImg").attr("src", reader.result);
                    }, false);
                    reader.readAsDataURL(response.data);
                }
                // show pdf in different modal
                if ( response.data.type.includes("pdf") ) {
                    console.log("-----------------------------");
                    $("#pdfModal").modal("show");
                    var reader  = new FileReader();
                    reader.addEventListener("load", function () {
                        $("#myPdf").attr("data", reader.result);
                    }, false);
                    reader.readAsDataURL(response.data);
                }
                if ( response.data.type.includes("text") ) {
                    //TODO: show text
                }


            }, function errorCallback(response) {
                //
            });
        } else if (f.type == "collection") {
            $scope.currentDirectory = $scope.currentDirectory + "/" + f.name;
            sendPostListFiles();
        }
    };

    $scope.deletePhotoOrDir = function(f) {
        $http({
            method: 'DELETE',
            url: $scope.proxyAddress + '/proxy/dav/' + $scope.currentDirectory + '/' + f.name + ((f.type == 'collection')? '/':'')
        }).then(function successCallback(response) {
            console.log(response);
            sendPostListFiles();
        }, function errorCallback(response) {
            //
        });
    };

    $scope.createDirectory = function() {
        console.log($scope.newDirName);
        $http({
            method: 'MKCOL',
            url: $scope.proxyAddress + '/proxy/dav/' + $scope.currentDirectory + '/' + $scope.newDirName + '/'
        }).then(function successCallback(response) {
            console.log(response);
            sendPostListFiles();
            $("#createDir").modal("hide");
        }, function errorCallback(response) {
            //
        });
    };


    //ok, ce n'est pas très propre de mélanger du jQuery avec du AngularJS, mais pas d'autre solution
    $('#input-1').on('fileloaded', function(event, file, previewId, index, reader) {
        $scope.newFile = file;
    });

    $scope.createFile = function() {
        $http({
            method: 'PUT',
            url: $scope.proxyAddress + '/proxy/dav/' + $scope.currentDirectory + '/' + $scope.newFile.name,
            //url: "http://localhost:6002/" + $scope.newFile.name,
            headers: { 'Content-Type': 'image/jpeg' },
            data: $scope.newFile
        }).then(function successCallback(response) {
            console.log(response);
            sendPostListFiles();
            $("#createFile").modal("hide");
        }, function errorCallback(response) {
            //
        });
    };

    $scope.getParentDir = function() {
        console.log($scope.currentDirectory);
        temp = $scope.currentDirectory.split("/");
        temp.splice(temp.length-1);
        $scope.currentDirectory = temp.join("/");
        sendPostListFiles();

    };

    var sendPostListFiles = function() {
        $http({
            method: 'PROPFIND',
            url: $scope.proxyAddress + '/proxy/dav/' + $scope.currentDirectory
        }).then(function successCallback(response) {
            xmlDoc = new DOMParser().parseFromString(response.data, "text/xml");
            var nodes = xmlDoc.childNodes[0].childNodes;
            var files = [];
            if(nodes.length > 2) {
                //i=3: don't incule parent directory
                for (var i=3; i<nodes.length-1; i+=2) {
                    var file = {"name": "", "type": ""};

                    //propstat(3) -> prop(1) -> displayName(3)
                    file.name = nodes[i].childNodes[3].childNodes[1].childNodes[3].childNodes[0].data;
                    //file.name = nodes[i].childNodes[1].childNodes[0].data.replace('/', ''); //href(1)

                    //propstat(3) -> prop(1) -> getlastmodified(13)
                    var date = nodes[i].childNodes[3].childNodes[1].childNodes[13].childNodes[0].data;
                    file.modified = moment(date).fromNow();

                    //propstat(3) -> prop(1) -> getcontentlength(7)
                    var contentLength = nodes[i].childNodes[3].childNodes[1].childNodes[7].childNodes[0].data;
                    file.size = filesize(contentLength);

                    //propstat(3) -> prop(1) -> resourcetype(17) -> collection = “D:collection”
                    if(nodes[i].childNodes[3].childNodes[1].childNodes[17].childNodes.length == 0) {
                        file.type = "file";
                        file.glyphicon = "file";
                    } else {
                        file.type = "collection";
                        file.glyphicon = "folder-close"
                    }
                    files.push(file);
                }
            } else {
                console.log("empty directory");
            }
            $scope.files = files;
            console.log($scope.files);

        }, function errorCallback(response) {
            //
        });
    };

    //first initialisation
    sendPostListFiles();


}]);


// jQuery context-menu:
// Right Click
// I'm not using it for the moment: to activate it
//      * add  class="context-menu-one" to <tr>
//      * uncomment <script src=""...> (jQuery contextMenu)
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