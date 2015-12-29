var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;
var Q = require('q');
var dbConf = require('../db')

router.get('/check', function(req, res, next) {
    console.log(req.cookies)
    if (req.session && req.session.usr) {
        console.log('session check')
        res.json({
            usr: req.session.usr.usr
        })
    } else {
        res.json({})
    }
})

router.get('/logout', function(req, res) {
    if (req.session.usr)
        req.session.destroy(function() {
            res.json({})
        })
    else res.json({})
})

router.post('/login', function(req, res, next) {
    if (req.session.usr) {
        res.json({
            msg: 'session'
        })
        return
    }
    dbConf.connect
        .then(function(db) {
            return db.collection('user').find(req.body).toArray()
        })
        .then(function(usrs) {
            if (!usrs || usrs.length == 0)
                throw new Error('usr not found')
            req.session.usr = usrs[0];
            req.session.save(function(err) {
                if (err) {
                    next(err);
                    return;
                }
                res.json({
                    msg: 'db'
                })
            });
        })
        .catch(function(err) {
            console.log('login fail', req.body, err)
            next(err)
        });
});

router.post('/sign', function(req, res, next) {
    dbConf.connect.then(function(db) {
            return db.collection('user').insertOne(req.body)
        })
        .then(function(info) {
            console.log('after save', info)
            req.session.usr = req.body
            return Q.nfcall(req.session.save.bind(req.session))
                .then(function() {
                    return {}
                })
        })
        .then(res.json.bind(res))
        .catch(function(err) {
            console.log('sign up fail', req.body, err)
            next(err)
        });
});

router.delete('/del', function(req, res, next) {
    if (req.session.usr) {
        dbConf.connect.then(function(db) {
                return db.collection('user').deleteOne({
                    _id: new ObjectId(req.session.usr._id)
                })
            })
            .then(function(info) {
                return Q.nfcall(req.session.destroy.bind(req.session))
                    .then(function() {
                        return info
                    })
            })
            .then(res.json.bind(res))
            .catch(function(err) {
                next(err)
            });
    } else {
        res.json({
            msg: 'need login'
        });
    }
})

router.get('/user', function(req, res, next) {
    dbConf.connect.then(function(db) {
        return db.collection('user').find().toArray()
    }).then(res.json.bind(res)).catch(function(err) {
        next(err)
    });
});

module.exports = router;
