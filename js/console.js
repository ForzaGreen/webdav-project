



var myFish = ["angel", "clown", "mandarin", "surgeon"];
myFish.splice(myFish.length-1); //removes last element
myFish
    ["angel", "clown", "mandarin"]

a = "aer/qsdsdf/dere"
temp = a.split("/");         //["aer", "qsdsdf", "dere"]
temp.splice(temp.length-1);  //["dere"] && temp == ["aer", "qsdsdf"]
a = temp.join("/");          // "aer/qsdsdf"



var x = "..."; //un string échapé: http://www.freeformatter.com/javascript-escape.html
xmlDoc = new DOMParser().parseFromString(x, "text/xml")
var nodes = xmlDoc.childNodes[0].childNodes;
var n1 = nodes[1]; //n1 is a collection
n1.childNodes[1].childNodes[0]; // => href = “/”
n1.childNodes[3].childNodes[1].childNodes[17].childNodes[0].tagName;
//propstat -> prop -> resourcetype -> collection = “D:collection”
var n3 = nodes[3]; //n3 is a file (/sample.txt)
n3.childNodes[1].childNodes[0]; // href = “/sample.txt
n3.childNodes[3].childNodes[1].childNodes[17].childNodes; //resourcetype empty= []

var files = [];
if(nodes.length > 2) {
    //i=3: don't incule parent directory
    for (var i=3; i<nodes.length-1; i+=2) {
        var file = {"name": "", "type": ""};
        file.name = nodes[i].childNodes[1].childNodes[0].data;
        if(nodes[i].childNodes[3].childNodes[1].childNodes[17].childNodes.length == 0) {
            file.type = "file";
        } else {
            file.type = "collection";
        }
        files.push(file);
    }
} else {
    console.log("empty directory");
}


















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


















/**
 * Created by wael on 04/11/15.
 */

c =  new nl.sara.webdav.Client("localhost/webdav", 0);

c.copy("sample.txt", function(status, data, headers){
}, "http://localhost/webdav/sample3.txt");

c.get("sample.txt", function (status, data, headers) {
    console.log(status);
    console.log(data);
    console.log(headers);
});

c.propfind("sample.txt", function (status, data, headers) {
    console.log(status);
    console.log(data);
    console.log(headers);
});
