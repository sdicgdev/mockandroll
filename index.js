'use strict';

var qs = require('querystring');
var fs = require('q-io/fs');
var parseurl = require('parseurl');
var _ = require('underscore');


function reporter(log_location){
  return function (req, res, next) {
    var url = parseurl(req)
      , query = qs.parse(url.query)
      , info = {}
      , timestamp = +(new Date());
      ;

    info.method       = req.method; 
    info.url          = url.pathname; 
    info.body         = req.body; 
    info.query_string = query;

    log_location += '/'+timestamp+'-'+info.method+info.url.replace(/\//g, "\\") +'.json';
    
    // ignore __log entries
    if(info.url.match('__log')){
      next();
    }else{
      fs.write(log_location, JSON.stringify(info, null, "\t"))
        .fail(function(err){
          console.log(err);
        })
        .finally(function(info){
          next();
        })
    }
  }
}

module.exports = reporter;
