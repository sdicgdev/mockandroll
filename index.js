var fs         = require('q-io/fs');
var http       = require('http');
var connect    = require('connect');
var bodyParser = require('body-parser');
var apimock    = require('apimock-middleware');
var requestlog = require('./lib/apiReporter-middleware');
var serveStatic = require('serve-static')

module.exports = function(yml_file, port, log_loc){
  var app = connect();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(requestlog(log_loc));
  app.use(apimock(yml_file));

  function reset(req, response, next){
    fs.list(log_loc)
      .catch(function(err){
        console.log(err.stack);
      })
      .then(function(files){
        deleteThese(log_loc, files)
          .then(function(message){
            console.log(message);
            response.end(message);
            next();
          })
          .catch(function(err){
            response.end('there has been an error');
            console.log(err.stack);
            next();
          })
      })
  }

  function history(req, response, next){
    fs.list(log_loc)
      .catch(function(err){
        console.log(err);
        console.log(err.stack);
        next();
      })
      .then(function(files){
        readThese(log_loc, files)
          .catch(function(err){
            console.log(err.stack);
            next();
          })
          .then(function(result){
            response.end(JSON.stringify(result));
            next();
          });
      });
  }

  app.use('/__log/', function(req, response, next){
    if(req.url && req.url.match(/\/history\/?$/)){
      if(req.method == "GET"){
        history(req, response, next);
      }
      if(req.method == "DELETE"){
        reset(req, response, next);
      }
    }else{
      var url = req.originalUrl
        ;
      if(url.match(/__log\/?$/)){
        url = url.replace(/\/?$/, '/index.html');
      }
      if(url.match(/\.ico/)){
        response.setHeader('Content-Type', 'image/x-icon');
      }
      if(url.match(/\.js$/)){
        response.setHeader('Content-Type', 'text/javascript');
      }
      fs.read(__dirname+url.replace(/\?.*$/, ''))
        .then(function(file){
          response.end(file);
          next();
        })
        .catch(function(err){
          console.log(err);
          console.log(err.stack);
        });
    }
  })


  http.createServer(app).listen(port);
  console.log("mock app has been created");

  function readThese(loc, files, result){
    result = (result||[]);
    var file = files.shift();
    return fs.isFile(loc+file)
      .then(function(is_file){
        if(is_file){
          return fs.read(loc+file)
               .then(function(data){
                 try{
                   data = JSON.parse(data);
                 }catch(err){ }
                 result.push(data);
                 return readThese(loc, files, result)
               })
        }else{
          return result
        }
      })
  }

  function deleteThese(loc, files){
    var file = files.shift();
    return fs.remove(loc+file)
             .then(function(){
               return deleteThese(loc, files);
             })
             .catch(function(err){
               return '[]';
             })
  }
}
