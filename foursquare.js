var express = require('express');
var app = express.createServer();

var redis = require('redis');
var redis_client = redis.createClient();

var config = require('./config');

app.use("/foursquare/flat/", express.static(__dirname + '/flat'));

app.use(express.cookieParser());
var RedisStore = require('connect-redis')(express);
app.use(express.session({secret:"password", 
                         store: new RedisStore({
                                    host: "localhost",
                                    post: "6379", 
                                    db: "mydb"
                          })
                         }));

var https = require('https');
var fs = require('fs');
var key = fs.readFileSync(__dirname + '/keys/server.key');
var cert = fs.readFileSync(__dirname + '/keys/server.crt');

var https_app = express.createServer({key:key, cert:cert});
https_app.listen(443);

//https_app.configure(function(){
//  app.use(express.bodyParser());
//});

var qs = require('querystring');

https_app.post('/foursquare/push', function(req, res) {
  var data = '';
  req.on('data', function(d){
    data = data + d;
  });
  req.on('end', function(){
    //console.log(unescape(qs.parse(data).checkin));
    res.send("ok");
  });
});


var Foursquare = require("node-foursquare-2")(config);

var access_token;

app.listen(8010);

app.get('/foursquare/login', function(req, res) {
  //req.session.name = req.params.access_token;
  res.writeHead(303, {"location": Foursquare.getAuthClientRedirectUrl() });
  res.end();
});

app.get('/foursquare/callback', function(req, res) {
  var code = req.query["code"];
  https.get({host: 'foursquare.com', path: '/oauth2/access_token?client_id=' + config.secrets.clientId + '&client_secret=' + config.secrets.clientSecret + '&grant_type=authorization_code&redirect_uri=http://www.jamesjn.com:8010/foursquare/callback&code='+code}, function(client_res){
    client_res.on('data', function(d){
      access_token = JSON.parse(d).access_token;
      req.session.access_token = access_token;
      res.writeHead(303, {"location": '/foursquare/'});
      res.end();
    });
  });
});

app.get('/foursquare/explorer', function(req, res) {
  if (req.session) {
    access_token = req.session.access_token;
  }
  if(access_token===undefined || access_token === null){
    res.send(JSON.stringify({"error": "please login at /foursquare/login"}));
  }
  else{
    request = https.get({host: 'api.foursquare.com', path: '/v2/users/self?oauth_token='+access_token+'&v=20120630'});
      request.on('response', function(client_res){
        var data = '';
        client_res.on('data', function(d){
          data = data + d;
        });
        client_res.on('end', function(d){
        res.contentType('application/json');
          res.send(data);
        });
      });
    };
});

app.get('/foursquare/checkins', function(req, res) {
  if (req.session) {
    access_token = req.session.access_token;
  }
  if(access_token===undefined || access_token === null){
    res.send(JSON.stringify({"error": "please login at /foursquare/login"}));
  }
  else{
    request = https.get({host: 'api.foursquare.com', path: '/v2/checkins/recent?oauth_token='+access_token+'&v=20120630'});
      request.on('response', function(client_res){
        var data = '';
        client_res.on('data', function(d){
          data = data + d;
        });
        client_res.on('end', function(d){
        res.contentType('application/json');
          res.send(data);
        });
      });
    };
});

app.get('/foursquare/self_checkins', function(req, res) {
  if (req.session) {
    access_token = req.session.access_token;
  }
  if(access_token===undefined || access_token === null){
    res.send(JSON.stringify({"error": "please login at /foursquare/login"}));
  }
  else{
    request = https.get({host: 'api.foursquare.com', path: '/v2/users/self/checkins?oauth_token='+access_token+'&v=20120630'});
      request.on('response', function(client_res){
        var data = '';
        client_res.on('data', function(d){
          data = data + d;
        });
        client_res.on('end', function(d){
        res.contentType('application/json');
          res.send(data);
        });
      });
    };
});


app.get('/foursquare', function(req, res) {
  res.sendfile(__dirname + '/index.html');  
});

app.get('/foursquare/api', function(req, res) {
  res.sendfile(__dirname + '/test_api.html');  
});

app.get('/libraries/jquery.min.js', function(req, res) {
  res.sendfile(__dirname + '/libraries/jquery-1.7.2.min.js');  
});

app.get('/libraries/jquery.ba-bbq.js', function(req, res) {
  res.sendfile(__dirname + '/libraries/jquery.ba-bbq.js');  
});


