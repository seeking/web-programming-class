var http = require('http');
var url = require('url');
var fs = require('fs');
var _ = require('./public/underscore');

var wall = [{
  name:'Wall Master',
  comment:'Welcome to the wall'
}];

http.createServer(function(req,res) {
  
  var urlObj = url.parse(req.url,true);

  var pathArr = urlObj.pathname.split('/');

  // if path of request is the root, just pass it the wall.html file
  
  if (urlObj.pathname == '/') {
    fs.readFile(__dirname + '/public/wall.html','utf8', function(err,theFile) {
      if (err) { 
        res.end(JSON.stringify(err));
      } else res.end(theFile);
    });
  }
  
  // if the path starts with the public directory, pass any file inside it that is requested

  if (pathArr[1] == 'public') {
    fs.readFile(__dirname + urlObj.pathname,'utf8',function(err, theFile) {
      if (err) { 
        res.end(JSON.stringify(err));
      } else res.end(theFile);
    });
  }

  // if the pathname is simply '/wall', assume it is an API call
  // add comments to the call if requested
  // if a from time is indicated, send back only comments since that time
  // otherwise, send back the entire wall

  if (urlObj.pathname == '/wall') {
    if (urlObj.query.name) {
      wall.push(urlObj.query);
    }
    if (urlObj.query.from) {
      var recentWall = _.filter(wall, function(entry) {
        return entry.dt > urlObj.query.from;
      });
      res.end(JSON.stringify(recentWall));
    } else {
      res.end(JSON.stringify(wall));
    }
    
  }

  
}).listen(process.env.C9_PORT);

console.log('Server running');