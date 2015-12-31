(function() {

    'use strict';

    angular.module('main')
        .controller('QuestionCtrl', [
            '$scope', '$http', '$uibModal', 'Interview',
            function($scope, $http, $uibModal, Interview) {
                var self = this;
                self.getParams = function() {
                    var params = {
                        page: self.qPage,
                        psize: self.qSize,
                    }
                    if (!!self.qQuestion) {
                        params.qQuestion = self.qQuestion;
                    }
                    if (!!self.qCompany) {
                        params.qCompany = self.qCompany;
                    }
                    return params
                }

                self.loadQuestions = function() {
                    $http.get('/api/qs', {
                        params: self.getParams()
                    }).success(function(data) {
                        console.log(data);
                        self.qs = data.qs;
                        self.qCount = data.count;
                    }).catch(console.error)
                }

                self.newQuestions = function(interview, questions) {
                    $http.post('/api/qs', {
                        interview: interview,
                        questions: questions.trim().split('\n')
                    }).success(function(data) {
                        self.nq = data
                    }).catch(console.error)
                }

                self.showInterview = function(iid) {
                    self.showInterviewDetail = Interview.get({
                        id: iid
                    });
                    // $uibModal.open({
                    //     template: ""
                    // })
                }

                self.showTrend = function(key) {
                    $uibModal.open({
                        animation: $scope.animationsEnabled,
                        template: '<div id="iyk"></div>',
                        controller: function($http) {
                            $http.get('/api/stat/iq', {
                                params: {
                                    k: key
                                }
                            }).success(function(data) {
                                data.sort(function(a,b){return a._id.year - b._id.year })
                                console.log(data)
                                var xs = [],
                                    ss = {
                                        name: 'Question',
                                        data: []
                                    };
                                data.forEach(function(v){
                                    xs.push(v._id.year)
                                    ss.data.push(v.count)
                                })
                                $('#iyk').highcharts({
                                    xAxis: {categories:xs},
                                    series: [ss]
                                })
                            })
                        }
                    })
                }

                self.init = function() {
                    self.qPage = 1
                    self.qSize = 10
                    $scope.$watchGroup(
                        ['question.qQuestion', 'question.qCompany'],
                        function(n, o) {
                            console.log('watch', n, o)
                            if (n == o) return;
                            // if filter change, reset page to 1
                            self.qPage = 1;
                            self.loadQuestions()
                        })
                    self.loadQuestions()
                }

                self.init();
            }
        ])
        .controller('NewQuestionCtrl', function() {
            console.log('new question ctrl init')
        })
})();
