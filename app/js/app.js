'use strict';
/*global angular google */

google.load('visualization', '1', {packages: ['geochart', 'table']});


// Declare app level module which depends on filters, and services
angular.module('geomapApp', ['geomapApp.filters', 'geomapApp.services', 'geomapApp.directives', 'geomapApp.controllers', 'ui.event', , 'ngSanitize']).
    constant('defaultKey', '0ApCHY-RAOQLadGdXaDIzb2ZCWGlLa0Z6bm55cVdNR1E').
    config(['$routeProvider', 'defaultKey', function($routeProvider, defaultKey) {
        $routeProvider.when('/key/:key/region', {templateUrl: 'partials/worldmap.html', controller: 'WorldMap'});
        $routeProvider.when('/key/:key/region/:region', {templateUrl: 'partials/worldmap.html', controller: 'WorldMap'});
        $routeProvider.when('/key/:key/country/:country', {templateUrl: 'partials/worldmap.html', controller: 'WorldMap'});
        $routeProvider.when('/key/:key/table', {templateUrl: 'partials/tableoverview.html', controller: 'TableOverviewCtrl'});
        $routeProvider.otherwise({redirectTo: '/key/'+defaultKey+'/table'});
    }]).factory('key', ['$route', '$routeParams', 'defaultKey', function($route, $routeParams, defaultKey) {
        return $routeParams.key || defaultKey;
    }]).factory('dataUrl', ['key', function(key) {
        return 'https://docs.google.com/spreadsheet/tq?key='+key+'&sheet=Offices&headers=1';
    }]).factory('colourUrl', ['key', function(key) {
        return 'https://docs.google.com/spreadsheet/tq?key='+key+'&sheet=Affiliates&headers=1';
    }]);
