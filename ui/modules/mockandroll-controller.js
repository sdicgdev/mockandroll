'use strict';

angular.module('MockAndRollApp')
  .controller('MockAndRollCtl', function ($scope, History) {
  	$scope.instructions	= true;
  	$scope.reset	= false;
    // ## load history data
    History.query()
      .$promise.then(function(data){
        //set history records in current scope to returned values
        $scope.history = data;
        //copy object to console
        console.warn(data);
      });
      // ### clear.History
      // clear out the history
      $scope.clearHistory = function() {
        $promise.then(function(data){
	        $scope.history = [ ];
	        $scope.reset = true;
	        $scope.details.method = false;
      	});
  			// $scope.reset = true;
	     	//$scope.details.method = false;
      };
      // ### showDetails

      $scope.displayDetails  = function(item, index){
        showDetails(item);
        select(index);
        $scope.instructions	= false;
      }

      /*** private methods ***/

      function showDetails(item) {
        console.log(item);
        $scope.details = item;
      };

      function select(index) {
        $scope.selected = index; 
      };
  });