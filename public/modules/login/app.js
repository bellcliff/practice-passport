(function() {

    'use strict'

    angular.module('login', ['ui.bootstrap'])
        .factory('LoginService', function($http, $rootScope) {
            var EVENT_LOGIN = 'login success';
            var EVENT_LOGOUT = 'logout success';
            return {
                logout: function() {
                    console.log('log out')
                    $http.get('/login/logout').success(function(info) {
                        console.log('log out', info)
                        $rootScope.$broadcast(EVENT_LOGOUT, info)
                    })
                },
                check: function() {
                    return $http.get('/login/check').success(function(info) {
                        if (info && info.usr) $rootScope.$broadcast(EVENT_LOGIN, info)
                    })
                },
                login: function(usr, pwd) {
                    $http.post('/login/login', {
                        usr: usr,
                        pwd: pwd
                    }).success(function(info) {
                        $rootScope.$broadcast(EVENT_LOGIN, {
                            usr: usr
                        })
                    });
                },
                sign: function(usr, pwd) {
                    $http.post('/login/sign', {
                        usr: usr,
                        pwd: pwd
                    }).success(function() {
                        $rootScope.$broadcast(EVENT_LOGIN, {
                            usr: usr
                        })
                    })
                },
                EVENT_LOGIN: EVENT_LOGIN
            };
        })
})()