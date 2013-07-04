'use strict';

/*global angular*/
/* Controllers */

angular.module('geomapApp.controllers', []).
  controller('MyCtrl1', ['$scope', '$log', 'dataUrl', 'googleData', function($scope, $log, dataUrl, googleData) {
    $scope.url = dataUrl;

    
    $scope.tableSelect = function(e) {
        $log.info('table select');
    };
    $scope.tableSort = function(e) {
        if(!e) { e = $scope.tableModel.event; }
        $log.info('table sort:' + e.ascending + ', ' + e.column.toString() + ',' + e.sortedIndexes.toString());
    };
    $scope.updateQuery = function(q) {
        $scope.query = q;
        $scope.data = null;
        $scope.error = null;
        $scope.dataTable = null;
        googleData(dataUrl, q).then(function(result){
            $scope.data = angular.fromJson(result.toJSON());
            $scope.dataTable = result;
        }, function(result) {
            $scope.error = result;
        });       
    };
    $scope.updateQuery(null);
    
  }])
  .controller('MyCtrl2', [function() {

  }]);