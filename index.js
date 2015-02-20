var fs         = require('q-io/fs');
var http       = require('http');
var connect    = require('connect');
var bodyParser = require('body-parser');
var apimock    = require('apimock-middleware');
var requestlog = require('./lib/apiReporter-middleware');

module.exports = function(yml_file, port, log_loc){
  var app = connect();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(requestlog(log_loc));
  app.use(apimock(yml_file));
  app.use('/__log/reset/', function(req, response, next){
    fs.list(log_loc)
      .catch(function(err){
        console.log(err);
      })
      .then(function(files){
        deleteThese(log_loc, files)
          .then(function(message){
            response.end(message);
            next();
          })
          .catch(function(err){
            response.end('there has been an error');
            console.log(err.stack);
            next();
          })
      })
  });

  app.use('/__log/history/', function(req, response, next){
    fs.list(log_loc)
      .catch(function(err){
        console.log(err);
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
  })

  app.use('/__log/', function(req, response, next){
    fs.read('lib/log-history.html')
      .then(function(file){
        response.end(file);
        next();
      });
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
               return 'the log has been cleared';
             })
  }
}
