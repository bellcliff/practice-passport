var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId
var Q = require('q');
var _ = require('lodash');
var dbConf = require('../db')

// interview, quest
router.get('/qs', function(req, res, next) {
    var page = req.query.page || 1;
    var pageSize = req.query.psize || 10;

    // default sort by date desc
    var psort = req.query.psort || 'interview.Date';
    var psortd = req.query.psort || -1;
    var findOption = {
        'skip': (page - 1) * pageSize,
        'limit': pageSize
    }
    var filter = {};
    if (!!req.query.qQuestion) filter.question = new RegExp(req.query.qQuestion, 'i');
    if (!!req.query.qCompany) filter['interview.Client'] = new RegExp(req.query.qCompany, 'i');
    dbConf.connect.then(function(db) {
        return Q.all([
            db.collection('question').find(filter).count(),
            db.collection('question').find(filter, findOption).sort({
                psort: psortd
            }).toArray()
        ]).spread(function(count, qs) {
            res.json({
                count: count,
                qs: qs
            })
        })
    }).catch(function(err) {
        next(err)
    })
});

// post questions with interview
router.post('/qs', function(req, res, next) {
    if (!req.body.questions || !req.body.questions.length || !req.body.interview) {
        res.json({
            msg: 'need questions and interview',
            body: req.body
        })
        return
    }
    var interview = req.body.interview
    var questions = req.body.questions
    console.log('insert many', interview, questions)
    dbConf.connect.then(function(db) {
        return db.collection('interview1').insertOne(interview).then(function(iResult) {
            var qInfo = []
            questions.forEach(function(q) {
                qInfo.push({
                    question: q,
                    interview: interview
                })
            })
            console.log('after insert interview', interview)
            return db.collection('question1').insertMany(qInfo).then(function() {
                return qInfo
            })
        })
    }).then(function(qInfo) {
        res.json(qInfo)
    }).catch(console.error)
})

router.get('/it', function(req, res, next) {
    dbConf.connect.then(function(db) {
        return db.collection('interview').find().toArray()
    }).then(res.json.bind(res)).catch(console.error)
});

router.get('/it/:id', function(req, res, next) {
    dbConf.connect.then(function(db) {
        return db.collection('interview').find({
            _id: new ObjectId(req.params.id)
        }).toArray()
    }).then(res.json.bind(res)).catch(console.error)
})

module.exports = router;
