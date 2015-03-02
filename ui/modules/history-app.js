'use strict';

angular
  .module('MockAndRollApp', ['ngResource', 'mm.foundation'])
  .config(function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
  })
  ;

