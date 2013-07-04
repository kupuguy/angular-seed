'use strict';
/*global angular google */

google.load('visualization', '1', {packages: ['geomap', 'table']});


// Declare app level module which depends on filters, and services
angular.module('geomapApp', ['geomapApp.filters', 'geomapApp.services', 'geomapApp.directives', 'geomapApp.controllers', 'ui.event', , 'ngSanitize']).
    constant('dataUrl', 'https://docs.google.com/spreadsheet/tq?key=0ApCHY-RAOQLadGdXaDIzb2ZCWGlLa0Z6bm55cVdNR1E&sheet=Offices=0&headers=1').
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/table', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
        $routeProvider.when('/map', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
        $routeProvider.otherwise({redirectTo: '/table'});
  }]);
