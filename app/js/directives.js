'use strict';
/*global angular google */
/* Directives */


(function() {
// inspired by angular-ui's directive for google maps
function bindEvents(scope, modeldata, prefix, eventsStr, googleObject, element) {
    angular.forEach(eventsStr.split(' '), function (eventName) {
      var $event = { type: prefix + '-' + eventName };
    
      google.visualization.events.addListener(googleObject, eventName, function (evt) {
        modeldata.event = evt;
        element.triggerHandler($event.type, angular.extend({}, $event, evt));
    
        //We create an $apply if it isn't happening. we need better support for this
        //We don't want to use timeout because tons of these events fire at once,
        //and we only need one $apply
        if (!scope.$$phase) 
          scope.$apply();
        
      });
    });
}

angular.module('geomapApp.directives', ['ui.event']).
  directive('googleTable', ['$parse', function($parse) {
    var tableEvents = 'select page sort ready';
 
    return function(scope, element, attrs) {
      scope.$watch(attrs.table, function(value) {
        if(!value)
          return;
 
        var options = angular.extend({}, scope.$eval(attrs.options));
        var columns = scope.$eval(attrs.columns);
 
        var data = value;
        var view = new google.visualization.DataView(data);
        if (columns) {
            view.setColumns(columns);
        }
        var table = new google.visualization.Table(element[0]);
        table.draw(view, options);
 
        var model = $parse(attrs.model);
        var modeldata = {
          'table' : table,
          'data' : data,
          'view' : view,
        };
        //Set scope variable for the map
        model.assign(scope, modeldata);
        
        bindEvents(scope, modeldata, 'table', tableEvents, table, element);
      });
    };
  }]).
  directive('geoMap', ['$parse', function($parse) {
    var events = 'error select regionClick ready';
 
    return function(scope, element, attrs) {
      scope.$watch(attrs.table, function(value) {
        if(!value)
          return;
 
        var options = angular.extend({}, scope.$eval(attrs.options));
        var columns = scope.$eval(attrs.columns);
 
        var data = value;
        var view = new google.visualization.DataView(data);
        if (columns) {
            view.setColumns(columns);
        }
        var geomap = new google.visualization.GeoChart(element[0]);
        geomap.draw(view, options);
 
        var model = $parse(attrs.model);
        var modeldata = {
          'map' : geomap,
          'data' : data,
          'view' : view,
        };
        //Set scope variable for the map
        model.assign(scope, modeldata);
        
        bindEvents(scope, modeldata, 'map', events, geomap, element);
      });
    };
  }]);
 
})();
