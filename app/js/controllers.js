'use strict';

/*global angular*/
/* Controllers */

angular.module('geomapApp.controllers', []).
  controller('TableOverviewCtrl', ['$scope', '$log', 'dataUrl', 'googleData', function($scope, $log, dataUrl, googleData) {
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
        $scope.error = null;
        $scope.dataTable = null;
        googleData(dataUrl, q).then(function(result){
            $scope.dataTable = result;
        }, function(result) {
            $scope.error = result;
        });       
    };
    $scope.updateQuery(null);
    
  }])
  .controller('WorldMap', ['$scope', '$q', 'googleData', 'dataUrl', 'colourUrl', function($scope, $q, googleData, dataUrl, colourUrl) {
    var select = 'SELECT A,D,COUNT(B) GROUP BY A,D';
    $scope.error = null;
    $scope.dataTable = null;
    $scope.colourTable = null;
    
    function calcColourIndex(dataTable, rowNum) {
        var affiliate = dataTable.getValue(rowNum, 1);
        return affiliate=='OGB'?1:affiliate=='ONL'?2:3;
    }
    function calcDisplay(dataTable, rowNum) {
        var affiliate = dataTable.getValue(rowNum, 1);
        var country = dataTable.getValue(rowNum, 0);
        return country + '\nManaging Affiliate: '+affiliate;
    }
    $scope.countryMapColumns = [0,
        {calc:calcColourIndex, type:'number', label:'colour'},
        {calc:calcDisplay, type:'string', label:'Info'}
    ];

    // Use 'all' to combine promises so we can ensure that the colourTable is already available
    // when the dataTable completes.
    $q.all([googleData(dataUrl, select), googleData(colourUrl)])
    .then(function(result){
        $scope.colourTable = result[1];
        $scope.dataTable = result[0];
    }, function(result) {
        $scope.error = result;
    });
  }]);