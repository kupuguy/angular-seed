'use strict';
/*global angular google */
/* Services */



// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('geomapApp.services', []).
    value('version', '0.1').
    factory('googleData', ['$q', '$rootScope', function($q, $scope) {
        return function(dataSourceUrl, select) {
            var opts = {sendMethod: 'auto'};
            // dataSourceUrl is something like:
            // https://docs.google.com/spreadsheet/tq?key=<key>&gid=0
            // where <key> is the key from a Google spreadsheet.
            var query = new google.visualization.Query(dataSourceUrl, opts);
  
            // select is a SQLish query such as 'select C, sum(B) group by C'
            if(select) {
                query.setQuery(select);
            }
            // Use angular's defer mechanism to handle the asynchronous response in a manner
            // consistent with the rest of the app.
            var deferred = $q.defer();
            // Send the query with a callback function that in turn uses $scope.$apply to force the callback
            // into a suitable context for angularjs (otherwise the promise won't complete correctly)
            query.send(function (response) {
                $scope.$apply(function() {
                    if (response.isError()) {
                        deferred.reject('Error in query: ' + response.getMessage() + '<br>' + response.getDetailedMessage());
                    }
                    deferred.resolve(response.getDataTable());
                });
            });
            return deferred.promise;
        };
    }]);

