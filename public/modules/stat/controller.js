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
                })
            })
        }

    ]);
})();
