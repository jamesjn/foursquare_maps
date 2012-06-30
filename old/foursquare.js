var express = require('express');
var app = express.createServer();

var redis = require('redis');
var redis_client = redis.createClient();

app.use("/foursquare/flat/", express.static(__dirname + '/flat'));

app.listen(8080);

app.get('/foursquare', function(req, res) {
  res.sendfile(__dirname + '/index.html');  
});

app.configure(function(){
  app.use(express.static(__dirname + '/flat'));
});

/*app.get('/libraries/jquery.min.js', function(req, res) {
  res.sendfile(__dirname + '/libraries/jquery-1.7.2.min.js');  
});*/

app.get('/test_json/:item_id', function(req, res) {
  res.contentType('application/json');
  redis_client.get(req.params.item_id, function(err, value){
    res.send(JSON.stringify({'foo':value}));
  }); 
});

