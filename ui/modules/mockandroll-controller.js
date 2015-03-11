'use strict';

angular.module('MockAndRollApp')
  .controller('MockAndRollCtl', function ($scope, History) {

  	$scope.details = {	}
  	// ## load history data
  	History.query()
      .$promise.then(function(data){
      	//set history records in current scope to returned values
      	$scope.history = data;
      	//copy object to console
        console.warn(data);
      });
      $scope.clearHistory = function() {
      		//stub for clearing out the history
      };

      $scope.showDetails = function(item) {
			  console.log(item);
			  $scope.detailsVisible = true;
			  $scope.details = item;
			};
  })
