// # History Resource #
// load the recent history into app via json
'use strict';

angular.module('MockAndRollApp')
  .factory('History', function($resource){
    return $resource('/ui/mock-service/history.json');
  });