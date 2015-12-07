(function() {

    'use strict'

    angular.module('main').controller('InterviewCtrl', function(Interview) {
        var self = this
        self.its = Interview.get()
    })

})()
