'use strict';

/*global angular*/
/* Controllers */

angular.module('geomapApp.controllers', []).
  controller('TableOverviewCtrl', ['$scope', '$rootScope', '$routeParams', '$log', 'dataUrl', 'googleData',
    function($scope, $rootScope, $routeParams, $log, dataUrl, googleData) {
    $rootScope.key = $routeParams.key;
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
  
  
  .controller('WorldMap', ['$scope', '$q', '$routeParams', '$location', '$rootScope', 'googleData', 'dataUrl', 'colourUrl', '$log',
  'regionFromCountry', 'regionName',
  function($scope, $q, $routeParams, $location, $rootScope, googleData, dataUrl, colourUrl, $log, regionFromCountry, regionName) {
    var select = 'SELECT A,B,COUNT(C) GROUP BY A,B';
    $scope.error = null;
    $scope.dataTable = null;
    $scope.colourTable = null;
    $scope.colourMapping = null;
    $scope.currentSelection = null;
    $scope.country = $routeParams.region|| $routeParams.country ||'world';
    $rootScope.region = $routeParams.region||regionFromCountry($routeParams.country)||'world';
    $rootScope.regionName = regionName($rootScope.region);
    $rootScope.key = $routeParams.key;

    $scope.mapOptions = {
        region: $scope.country,
        legend: 'none',
        tooltip: {isHtml:true},
        keepAspectRatio: true,
        colorAxis: {minValue: 0},
        width: 800
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
    function countryDisplay(dataTable, rowNum) {
        var affiliate = dataTable.getValue(rowNum, 1);
        var staff = dataTable.getValue(rowNum, 7);
        var other = dataTable.getValue(rowNum, 8);
        var other_staff = dataTable.getValue(rowNum, 9);
        return affiliate + '(' + staff + '), ' + other + '(' + other_staff + ')'; 
    }
    $scope.countryMapColumns = [0,
        {calc:calcColourIndex, type:'number'},
        {calc:calcDisplay, type:'string', role:'tooltip', 'p': {'html':true}}
    ];
    function totalStaff(dataTable, rowNum) {
        return dataTable.getValue(rowNum, 7) + dataTable.getValue(rowNum, 9);
    }
    $rootScope.region = null;
    if ($routeParams.country) {
        $rootScope.region = regionFromCountry($routeParams.country);
        select = null;
        $scope.countryMapColumns = [4, 5, // lat/long
            2, // Title overrides lat/long for display.
            {calc:calcColourIndex, type:'number'}, // Colour
            {calc:totalStaff, type:'number'}, // Size
            {calc:countryDisplay, type:'string', role:'tooltip', 'p': {'html':true}}
        ];
    }

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
        if ($scope.country=='world' || /^[0-9]+$/.test(e.region)) {
            $location.path('/key/'+$rootScope.key+'/region/'+regionFromCountry(e.region));
        } else {
            $location.path('/key/'+$rootScope.key+'/country/'+e.region);
        }
    };
    $scope.select = function(e) {
        var map = $scope.mapModel.map;
        var data = $scope.mapModel.data;
        var selection = map.getSelection();
        var row = selection[0].row;
        var values = [];
        values.push({label: data.getColumnLabel(0), value: data.getValue(row, 0)});
        values.push({label: data.getColumnLabel(2), value: data.getValue(row, 2)});
        values.push({label: data.getColumnLabel(1), value: data.getValue(row, 1)});
        for(var col=6; col < data.getNumberOfColumns(); col++) {
            values.push({label: data.getColumnLabel(col), value: data.getValue(row, col)});        
        }
        $scope.currentSelection = values;
        $log.info('select:' + selection[0].row.toString());
    };

  }]);