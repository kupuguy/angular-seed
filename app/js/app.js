'use strict';
/*global angular google */

google.load('visualization', '1', {packages: ['geochart', 'table']});


// Declare app level module which depends on filters, and services
angular.module('geomapApp', ['geomapApp.filters', 'geomapApp.services', 'geomapApp.directives', 'geomapApp.controllers', 'ui.event', , 'ngSanitize']).
    constant('dataSourceKey', '0ApCHY-RAOQLadGdXaDIzb2ZCWGlLa0Z6bm55cVdNR1E').
    config(['$provide', '$routeProvider', 'dataSourceKey', function($provide, $routeProvider, key) {
        $provide.value('dataUrl', 'https://docs.google.com/spreadsheet/tq?key='+key+'&sheet=Offices&headers=1');
        $provide.value('colourUrl', 'https://docs.google.com/spreadsheet/tq?key='+key+'&sheet=Affiliates&headers=1');
        
        $routeProvider.when('/region', {templateUrl: 'partials/worldmap.html', controller: 'WorldMap'});
        $routeProvider.when('/region/:region', {templateUrl: 'partials/worldmap.html', controller: 'WorldMap'});
        $routeProvider.when('/table', {templateUrl: 'partials/tableoverview.html', controller: 'TableOverviewCtrl'});
        $routeProvider.otherwise({redirectTo: '/table'});
  }]);
