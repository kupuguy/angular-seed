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
  
  
  .controller('WorldMap', ['$scope', '$q', 'googleData', 'dataUrl', 'colourUrl', '$log', function($scope, $q, googleData, dataUrl, colourUrl, $log) {
    var select = 'SELECT A,D,COUNT(B) GROUP BY A,D';
    $scope.error = null;
    $scope.dataTable = null;
    $scope.colourTable = null;
    $scope.mapOptions = {
        region:'world',
        showLegend:false,
        tooltip: { trigger: 'focus' }
    };
    $scope.$watch('colourTable', function() {
        if ($scope.colourTable) {
            var colours = [];
            var mapping = {};
            var table = $scope.colourTable;
            for (var rowNum=0; rowNum<table.getNumberOfRows(); rowNum++) {
                var name = table.getValue(rowNum, 0);
                var colour = parseInt(table.getValue(rowNum, 2), 16);
                colours.push(colour);
                mapping[name] = colour;
            }
            $scope.mapOptions['colors'] = colours;
            $scope.colourMapping = mapping;
        }
    })
    
    function calcColourIndex(dataTable, rowNum) {
        var affiliate = dataTable.getValue(rowNum, 1);
        return $scope.colourMapping[affiliate]||0;
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
    
    $scope.regionClick = function(e) {
        if(!e) { e = $scope.mapModel.event; }
        $log.info('region click:' + e.region);
    };
    $scope.select = function(e) {
        $log.info('select:' + $scope.mapModel.geomap.getSelection().toString());
    };

  }]);