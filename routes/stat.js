var express = require('express');
var router = express.Router();
var dbConf = require('../db');
var Q = require('q');

// interview by month
router.get('/im', function(req, res, next) {
    var year = req.query.year || 2015;
    var ds = new Date(year, 1, 1);
    var de = new Date(year, 12, 31);
    var match = {
        $match: {
            Date: {
                $gte: ds,
                $lt: de
            }
        }
    };
    var group = {
        $group: {
            _id: {
                month: {
                    $month: "$Date"
                },
                year: {
                    $year: "$Date"
                }
            },
            count: {
                $sum: 1
            }
        }
    };
    // aggregate the count per month
    dbConf.collection('interview')
        .then(function(col) {
            var defer = Q.defer();
            col.aggregate(match, group)
                .next(function(err, doc) {
                    if (err) defer.reject(err)
                    else defer.resolve(doc)
                })
            return defer.promise;
        })
        .then(function(data) {
            console.log(arguments)
            res.send(data)
        })
        .catch(function(err) {
            console.log('im fail', err);
            next(err);
        });
});

module.exports = router;
