const express = require('express');
const utils = require('./utils');
const anyValuesUndefined = utils.anyValuesUndefined;
let router = express.Router();
let db;


/*
 * To create a recording, post to the endpoint /api/recording/create
 * with the username, start time, end time, instrument, number of pitches, 
 * and descriptionin the body of the request
 *
 * For example, to create a recording for Bob Smith:
 *   Post /api/recording/create
 *   With data:
 *   {
 *     username:    "bobbyS",
 *     startTime:   "Wed, 27 July 2016 07:45:00 GMT",
 *     endTime:     "Wed, 27 July 2016 07:51:00 GMT",
 *     instrument:  "piano",
 *     numPitches:  "100",
 *     description: "Moonlight Sonata"
 *   }
 */
router.post('/create', (req, res) => {
  let createObj = {
    username:    req.body.username,
    startTime:   req.body.startTime,
    endTime:     req.body.endTime,
    instrument:  req.body.instrument,
    numPitches:  req.body.numPitches,
    description: req.body.description
  };

  if (anyValuesUndefined(createObj)) {
    res.status(400).json({ err: 'undefined fields' });
    return;
  }

  db.Recording.create(createObj).then((newRecordingInstance) => {
    res.json(newRecordingInstance.get({ plain: true }));
    return;
  }).catch((err) => {
    console.log('Error while creating recording.');
    console.log(err);
    res.status(500).json({ err: err });
    return;
  });
});




// Don't change this lol
module.exports = router;
module.exports.init = (database) => { db = database; };
