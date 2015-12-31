var mc = require('mongodb').MongoClient;
var conf = require(__dirname + '/conf')
var ObjectId = require('mongodb').ObjectId;
var dbLink = 'mongodb://' + conf.db.host + '/qs';
var dbCon = mc.connect(dbLink);
var dbCol = function(col){
    return dbCon.then(function(db){
        return db.collection(col)
    })
}

module.exports = {
    link: dbLink,
    connect: dbCon,
    collection: dbCol
}
