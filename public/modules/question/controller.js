(function() {

    'use strict'

    angular.module('main')
        .controller('QuestionCtrl', function($scope, $http, $uibModal, Interview) {
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

            self.init = function() {
                self.qPage = 1
                self.qSize = 20
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
        })
})()
