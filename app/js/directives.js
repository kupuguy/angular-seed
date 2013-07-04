'use strict';
/*global angular google */
/* Directives */


angular.module('geomapApp.directives', ['ui.event']).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('googleTable', ['$parse', function($parse) {
    var tableEvents = 'select page sort ready';
 
    return function(scope, element, attrs) {
      scope.$watch(attrs.table, function(value) {
        if(!value)
          return;
 
        var options = angular.extend({}, scope.$eval(attrs.options));
        var events = scope.$eval(attrs.tableEvents);
 
        var data = value;
        var view = new google.visualization.DataView(data);
        var table = new google.visualization.Table(element[0]);
        table.draw(view, options);
 
        var model = $parse(attrs.model);
 
        //Set scope variable for the map
        model.assign(scope, {
          'table' : table,
          'data' : data,
          'view' : view,
        });
        
        // inspired by angular-ui's directive for google maps
        function bindTableEvents(scope, eventsStr, googleObject, element) {
            angular.forEach(eventsStr.split(' '), function (eventName) {
              var $event = { type: 'table-' + eventName };
            
              google.visualization.events.addListener(googleObject, eventName, function (evt) {
                model.assign(scope, { 'event': evt});
                element.triggerHandler($event.type, angular.extend({}, $event, evt));
            
                //We create an $apply if it isn't happening. we need better support for this
                //We don't want to use timeout because tons of these events fire at once,
                //and we only need one $apply
                if (!scope.$$phase) 
                  scope.$apply();
                
              });
            });
        }
        bindTableEvents(scope, tableEvents, table, element);
      });
    };
  }]);
 

