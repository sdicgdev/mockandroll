'use strict';

angular.module('MockAndRollApp')
  .controller('MockAndRollCtl', function ($scope, History) {
  	History.query()
      .$promise.then(function(data){
      	$scope.history = data;
        console.warn(data);
      });
      $scope.clearHistory = function() {
      		//stub for clearing out the history
      };
  })
