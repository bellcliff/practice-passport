(function() {

    'use strict';

    angular.module('main', ['ui.bootstrap', 'ui.router', 'ngResource', 'login'])
        .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
            // remove hash
            $locationProvider.html5Mode(true);

            // set default router
            $urlRouterProvider
                .when('/question', '/question/list')
                .otherwise('/question/list')

            // provide router
            $stateProvider
                .state('question', {
                    url: '/question',
                    templateUrl: '/modules/question/main.html',
                    controller: 'QuestionCtrl as question'
                })
                .state('question.list', {
                    url: '/list',
                    templateUrl: '/modules/question/list.html'
                })
                .state('question.new', {
                    url: '/new',
                    templateUrl: '/modules/question/new.html',
                })
                .state('interview', {
                    url: '/interview',
                    templateUrl: 'modules/interview/list.html',
                    controller: 'InterviewCtrl as interview'
                })
                .state('stat', {
                    url: '/stat',
                    templateUrl: '/modules/stat/main.html',
                    controller: 'StatCtrl as stat'
                })
        })
        .factory('Interview', function($resource) {
            return $resource('/api/it/:id', {
                id: '@id'
            }, {
                get: {
                    method: 'GET',
                    params: {
                        id: '@id'
                    },
                    isArray: true
                }
            })
        })
        .directive('updateTitle', [
            '$rootScope', '$timeout',
            function($rootScope, $timeout) {
                return {
                    link: function(scope, element) {

                        var listener = function(event, toState) {

                            var title = 'Question Set System';
                            if (toState.data && toState.data.pageTitle) title = toState.data.pageTitle;

                            $timeout(function() {
                                element.text(title);
                            }, 0, false);
                        };

                        $rootScope.$on('$stateChangeSuccess', listener);
                    }
                };
            }
        ]);
})();
