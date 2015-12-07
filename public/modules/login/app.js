(function() {

    'use strict'

    var loginCtrl = function($http, $scope, $uibModalInstance) {
        $scope.login = function(usr, pwd) {
            $http.post('/login/login', {
                usr: usr,
                pwd: pwd
            }).success(function(info) {
                $scope.usr = usr
                $uibModalInstance.close(usr)
            });
        };

        $scope.logout = function() {
            $scope.usr = undefined;
            $http.get('/login/logout').success(function() {})
        }

        $scope.del = function() {
            $scope.usr = undefined;
            $http.delete('del').success(function() {})
        }

        $scope.check = function() {
            $http.get('/login/check').success(function(info) {
                $scope.usr = info.usr;
            }).catch(function() {});
        }

        $scope.sign = function(usr, pwd) {
            $http.post('/login/sign', {
                usr: usr,
                pwd: pwd
            }).success(function() {
                $scope.usr = usr
                $uibModalInstance.close(usr);
            })
        }

        $scope.check();
    }

    angular.module('login', [])
        .factory('LoginService', function($http) {
            var self = this;
            return {
                logout: function() {
                    $http.get('/login/logout').success(function() {})
                },
                check: function() {
                    return $http.get('/login/check')
                }
            };
        })
        .controller('LoginCtrl', function($uibModal, $scope, $log, LoginService) {
            var self = this;

            self.check = function(){
                LoginService.check().then(function(info){
                    self.usr = info.usr;
                })
            }

            self.check();

            self.open = function() {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'modules/login/template.html',
                    controller: loginCtrl,
                    resolve: {}
                });

                modalInstance.result.then(function(usr) {
                    $log.info('login success', usr)
                    self.usr = usr;
                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            }

            self.signout = function() {
                self.usr = undefined
                LoginService.logout()
            }
        })
})()
