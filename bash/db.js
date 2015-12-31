var ObjectID = require('mongodb').ObjectID;
var Q = require('q');
var dbCfg = require('../db');

var saveDB = function(iInfos) {
    return dbCfg.connect
        .then(function(db) {
            return Q.all(iInfos.map(function(iInfo) {
                    var qs = iInfo.qs;
                    iInfo.Date = new Date(iInfo.Date)
                    console.log('insert interview', iInfo)
                    delete iInfo.qs;
                    return db.collection('interview').insertOne(iInfo)
                        .then(function(iResult) {
                            return Q.all(qs.map(function(question) {
                                return db.collection('question').insertOne({
                                    interview: iInfo,
                                    question: question
                                })
                            }))
                        })
                }))
        })
        .catch(console.log.bind(console))
}

module.exports = {
    save: saveDB
};
