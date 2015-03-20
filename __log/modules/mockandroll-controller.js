'use strict';

angular.module('MockAndRollApp')
  .controller('MockAndRollCtl', function ($scope, History) {
    $scope.instructions = true;
    $scope.reset  = false;
    // ## load history data
    History.query()
      .$promise.then(function(data){
        console.log(data);
        //set history records in current scope to returned values
        $scope.history = data;
        //copy object to console
        console.warn(data);
      });

      // ### clear.History
      // clear out the history
      $scope.clearHistory = function() {
        // hide instructions if showing
        $scope.instructions = false;
        // show reset message
        $scope.reset = true;
        History.clearHistory()
          .$promise.then(function(data){
            //set history records in current scope to returned values
            $scope.history = data;
          });
          // hide details if showing
          $scope.details = false;
      };

      // ### showDetails
      $scope.displayDetails  = function(item, index){
        showDetails(item);
        select(index);
        // hide instructions once an item is selected
        $scope.instructions = false;
      }

      // ## private methods
      function showDetails(item) {
        // copy object to console
        console.log(item);
        // copy selected item into details object for display
        $scope.details = item;
      };

      function select(index) {
        // highlight selected item
        $scope.selected = index; 
      };
  });