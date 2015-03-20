// # History Resource #
// prepare to load history into app via json
'use strict';

angular.module('MockAndRollApp')
  .factory('History', function($resource){
    return $resource('/__log/history', {}, {
    	// reset the list of groups a user is affiliated with for a particular organization
        clearHistory:
          {method: 'DELETE', isArray: true}
    });
  });