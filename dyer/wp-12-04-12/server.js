var http = require('http');
var url = require('url');
var fs = require('fs');

var wall = [{
  name:'Wall Master',
  comment:'Welcome to the wall'
}];

var server = http.createServer(function(req,res) {
  var urlObj = url.parse(req.url,true);

  if (urlObj.pathname == '/') {
    console.log('yes');
    fs.readFile('wall.html','utf8',function(err,theFile) {
      res.end(theFile);
    });
  }

  if (urlObj.pathname == '/wall') {
    if (urlObj.query.name) {
      wall.push(urlObj.query);
    }
    res.end(JSON.stringify(wall));
  }

  
}).listen(5000);

console.log('Server running on port 5000');