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
  
  
  .controller('WorldMap', ['$scope', '$q', '$routeParams', '$location', 'googleData', 'dataUrl', 'colourUrl', '$log',
  'regionFromCountry',
  function($scope, $q, $routeParams, $location, googleData, dataUrl, colourUrl, $log, regionFromCountry) {
    var select = 'SELECT A,D,COUNT(B) GROUP BY A,D';
    $scope.error = null;
    $scope.dataTable = null;
    $scope.colourTable = null;
    $scope.colourMapping = null;
    $scope.region = $routeParams.region||'world';
    
    $scope.mapOptions = {
        region: $scope.region,
        legend: 'none',
        tooltip: {isHtml:true},
        keepAspectRatio: true,
        colorAxis: {minValue: 0}
    };
    $scope.$watch('colourTable', function() {
        if ($scope.colourTable) {
            var colours = [];
            var values = [];
            var mapping = {};
            var table = $scope.colourTable;
            for (var rowNum=0; rowNum<table.getNumberOfRows(); rowNum++) {
                var name = table.getValue(rowNum, 0);
                var colour = table.getValue(rowNum, 2);
                colours.push(colour);
                values.push(rowNum);
                mapping[name] = {index: rowNum, colour:colour};
            }
            $scope.mapOptions.colorAxis.colors = colours;
            $scope.mapOptions.colorAxis.values = values;
            $scope.mapOptions.colorAxis.maxValue = colours.length;
            $scope.colourMapping = mapping;
        }
    });
    
    function calcColourIndex(dataTable, rowNum) {
        var affiliate = dataTable.getValue(rowNum, 1);
        var colour = $scope.colourMapping[affiliate];
        return colour?colour.index:0;
    }
    function calcDisplay(dataTable, rowNum) {
        var affiliate = dataTable.getValue(rowNum, 1);
        return affiliate;
    }
    $scope.countryMapColumns = [0,
        {calc:calcColourIndex, type:'number'},
        {calc:calcDisplay, type:'string', role:'tooltip', 'p': {'html':true}}
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
        if ($scope.region=='world') {
            $location.path('/region/'+regionFromCountry(e.region));
        } else {
            $location.path('/region/'+e.region);
        }
    };
    $scope.select = function(e) {
        var selection = $scope.mapModel.map.getSelection();
        $log.info('select:' + selection[0].row.toString());
    };

  }]);