var express = require('express');
var router = express.Router();
var dbConf = require('../db');
var Q = require('q');

// interview by year
router.get('/iy', function(req, res, next) {
    // var year = req.query.year || 2015;
    // var ds = new Date(year, 1, 1);
    // var de = new Date(year, 12, 31);
    // var match = {
    //     $match: {
    //     }
    // };
    var group = {
        $group: {
            _id: {
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
            return col.aggregate([group]).toArray()
        })
        .then(function(data) {
            var result = {};
            data.forEach(function(v) {
                result[v._id.year] = v.count
            })
            res.json(result);
        })
        .catch(function(err) {
            console.log('im fail', err);
            next(err);
        });
});

module.exports = router;
