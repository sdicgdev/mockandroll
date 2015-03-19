'use strict';

var qs = require('querystring');
var fs = require('q-io/fs');
var parseurl = require('parseurl');
var _ = require('underscore');
var bodyParser = require('body-parser');

function reporter(log_location){
  return function (req, res, next) {
    var url = parseurl(req)
      , query = qs.parse(url.query)
      , info = {}
      , timestamp = +(new Date())
      , log_to
      ;

    info.method       = req.method; 
    info.url          = url.pathname; 
    info.body         = req.body; 
    info.headers      = req.headers; 
    info.query_string = query;

    log_to = log_location + timestamp+'-'+info.method +'.json';
    
    // ignore __log entries
    if(info.url.match('__log')){
      next();
    }else{
      fs.write(log_to, JSON.stringify(info, null, "\t"))
        .fail(function(err){
        })
        .finally(function(info){
          next();
        })
    }
  }
}

module.exports = reporter;
