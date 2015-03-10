// # History Resource #
'use strict';

angular.module('MockAndRollApp')
  .factory('History', function($resource){
    return $resource('/ui/mock-service/history.json');
  });