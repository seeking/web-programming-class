var http = require('http');
var url = require('url');
var fs = require('fs');

var wall = [{
  name:'Wall Master',
  comment:'Welcome to the wall'
}];

var server = http.createServer(function(req,res) {
  var urlObj = url.parse(req.url,true);
  
  var pathArr = urlObj.pathname.split('/');

  if (urlObj.pathname == '/') {
    fs.readFile(__dirname + '/public/wall.html','utf8', function(err,theFile) {
      if (err) { 
        res.end(JSON.stringify(err));
      } else res.end(theFile);
    });
  }
  
  if (pathArr[1] == 'public') {
    fs.readFile(__dirname + urlObj.pathname,'utf8',function(err, theFile) {
      if (err) { 
        res.end(JSON.stringify(err));
      } else res.end(theFile);
    });
  }

  if (urlObj.pathname == '/wall') {
    if (urlObj.query.name) {
      wall.push(urlObj.query);
    }
    res.end(JSON.stringify(wall));
  }

  
}).listen(process.env.PORT);

console.log('Server running on process.env.PORT');