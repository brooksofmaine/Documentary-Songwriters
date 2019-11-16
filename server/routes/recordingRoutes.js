const express = require('express');
const utils = require('./utils');
const anyValuesUndefined = utils.anyValuesUndefined;
const userKeyCheck = utils.userKeyCheck;
let router = express.Router();
let db;





// Don't change this lol
module.exports = router;
module.exports.init = (database) => { db = database; };
