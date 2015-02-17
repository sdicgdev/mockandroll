var fs         = require('q-io/fs');
var http       = require('http');
var connect    = require('connect');
var bodyParser = require('body-parser');
var apimock    = require('apimock-middleware');
var requestlog = require('../index');

var app = connect();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(apimock('apimock.yml'));
app.use(requestlog('requestlog'));

app.use('/__log/reset', function(req, response, next){
  fs.list('requestlog')
    .catch(function(err){
      response.end('there has been an error');
      console.log(err.stack);
    })
    .then(function(files){
      response.end('log has been reset');
      console.log(files);
    })
    .finally(function(){
      next();
    })
});

http.createServer(app).listen(3000);
console.log("mock app has been created");
