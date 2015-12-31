(function() {
    'use strict';
    angular.module('main').controller('StatCtrl', [
        '$scope', '$http',
        function($scope, $http) {
            var show = function(id, xs, ss, title) {
                $(id).highcharts({
                    chart: {
                        height: 300
                    },
                    title: {
                        text: title || 'Interview Trend',
                        x: -20
                    },
                    xAxis: {
                        categories: xs
                    },
                    series: [ss]
                });
            };
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
                show('#iy', xAxis, series, 'Yearly Interview')
            });

            $http.get('/api/stat/im').success(function(data) {
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
                show('#im', xAxis, series, 'Monthly Interview of 2015')

            })
        }

    ]);
})();
