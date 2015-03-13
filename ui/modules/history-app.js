'use strict';

angular
  .module('MockAndRollApp', ['ngResource', 'mm.foundation', 'jsonFormatter'])
  .config(function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
  })
  ;

