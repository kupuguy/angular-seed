'use strict';
/*global angular google */
/* Services */



// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('geomapApp.services', []).
    value('version', '0.1').
    factory('googleData', ['$q', '$rootScope', function($q, $scope) {
        return function(dataSourceUrl, select) {
            // Specify that we want to use the XmlHttpRequest object to make the query.
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
            // Send the query with a callback function.
            query.send(function (response) {
                if (response.isError()) {
                    $scope.$apply(function() {
                        deferred.reject('Error in query: ' + response.getMessage() + '<br>' + response.getDetailedMessage());
                    });
                    return;
                }
                var table = response.getDataTable();
                $scope.$apply(function() {
                    deferred.resolve(table);
                });
            });
            return deferred.promise;
        };
    }]);

