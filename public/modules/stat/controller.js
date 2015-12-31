(function() {
    'use strict';
    angular.module('main').controller('StatCtrl', [
        '$scope', '$http',
        function($scope, $http) {
            $http.get('/api/stat/iy').success(function(data) {
                var xAxis = [],
                    series = {
                        name: 'Interview',
                        data: []
                    };
                for (var y in data) {
                    xAxis.push(y);
                    series.data.push(data[y]);
                }
                $('#iy').highcharts({
                    title: {
                        text: 'Year Interview trend',
                        x: -20
                    },
                    xAxis: {
                        categories: xAxis
                    },
                    series: [series]
                });
            });

            $http.get('/api/stat/im').success(function(data){
                var xAxis = [],
                    series = {
                        name: 'Interview in 2015',
                        data: []
                    };
                data.forEach(function(v) {
                    if (!v) return;
                    xAxis.push(v.m);
                    series.data.push(v.v);
                });
                $('#im').highcharts({
                    title: {
                        text: 'Monthly Interview trend',
                        x: -20
                    },
                    xAxis: {
                        categories: xAxis
                    },
                    series: [series]
                });
                
            })
        }

    ]);
})();
