var fs = require('fs');
var parse = require('./parse');
var db = require('./db');
var Q = require('q');

var parseDir = function(dir) {
    return Q.nfcall(fs.readdir, dir).then(function(files) {
        var result = Q();
        files.forEach(function(file) {
            var filepath = dir + '/' + file;
            if (fs.lstatSync(filepath).isDirectory()) {
                result = result.then(function() {
                    return parseDir(filepath)
                })
            } else if (!file.endsWith('txt')) return;
            else {
                // is the file txt, so try parse
                console.log('read file', filepath)
                result = result.then(function() {
                    return Q.nfcall(fs.readFile, filepath, 'utf8')
                }).then(parse).then(db.save);
            }
        })
        return result;
    })
}

parseDir("/home/bo/Question Set").catch(console.error)
