(function() {

    'use strict'

    var loginCtrl = function($http, $scope) {
        $scope.login = function(usr, pwd) {
            $http.post('login', {
                usr: usr,
                pwd: pwd
            }).success(function(info) {
                $scope.usr = usr
            });
        };

        $scope.logout = function() {
            $scope.usr = undefined;
            $http.get('logout').success(function() {})
        }

        $scope.del = function() {
            $scope.usr = undefined;
            $http.delete('del').success(function() {})
        }

        $scope.check = function() {
            $http.get('check').success(function(info) {
                $scope.usr = info.usr;
            }).catch(function() {});
        }

        $scope.sign = function(usr, pwd) {
            $http.post('sign', {
                usr: usr,
                pwd: pwd
            }).success(function() {
                $scope.usr = usr
            })
        }

        $scope.check();
    }

    angular.module('login', [])
      .controller('LoginCtrl', function($uibModal, $scope, $log) {
        var self = this;
        self.open = function() {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/login/template.html',
                controller: loginCtrl,
                resolve: {
                    items: function() {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function() {
                $log.info('login success')
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
    });

})()
