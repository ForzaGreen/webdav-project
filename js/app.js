/**
 * Created by wael on 27/10/15.
 */

console.log("ok");
var davClient;

connectDav();


function connectDav() {
    //console.log("Connecting WebDAV...");
    var useHTTPS = true;
    //if(location.href.indexOf("https") === 0) {
    //    useHTTPS = true;
    //}
    //davClient = new nl.sara.webdav.Client(location.host, useHTTPS, location.port);
    // https://dav.box.com/dav
    davClient = new nl.sara.webdav.Client("dav.box.com/dav", useHTTPS);

}

filePath = "/owncloud/remote.php/webdav/ownCloudUserManual.pdf"; // dav://localhost
newFilePath = "/owncloud/remote.php/webdav/newFile.pdf";

var copyFile = function(filePath, newFilePath) {
    console.log("Copying file: " + filePath + " to: " + newFilePath);
    davClient.copy(
        filePath,
        function( status, data, headers ) {
            console.log("copied ? ");
            console.log(status);
            console.log(data);
            console.log(headers);
        },
        newFilePath
        //davClient.FAIL_ON_OVERWRITE
    );
};

//copyFile(filePath, newFilePath);


