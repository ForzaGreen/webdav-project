/**
 * Created by wael on 04/11/15.
 */

c =  new nl.sara.webdav.Client("localhost/webdav", 0);

c.copy("sample.txt", function(status, data, headers){
}, "http://localhost/webdavsample3.txt");

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
