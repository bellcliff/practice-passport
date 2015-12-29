var fs = require("fs");
var dbConf = JSON.parse(fs.readFileSync('cfg/db.json', 'utf-8'));

module.exports = dbConf;
