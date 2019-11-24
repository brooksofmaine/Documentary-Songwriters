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
 * For example, to create a recording for Bob Smith, who is already logged in:
 *   Post /api/recording/create
 *   With data:
 *   {
 *     startTime:   "Wed, 27 July 2016 07:45:00 GMT",
 *     endTime:     "Wed, 27 July 2016 07:51:00 GMT",
 *     instrument:  "piano",
 *     numPitches:  "100",
 *     description: "Moonlight Sonata"
 *   }
 */
router.post('/create', (req, res) => {
  let createObj = {
    username:    req.body.username, // TODO: change this to get current user
    start:       req.body.startTime,
    end:         req.body.endTime,
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





// TODO: implement meee
/*
 * To change a specific recording...
 */
router.post('/:username/:startTime/:key', (req, res) => {
});





// TODO: not really sure what the url should be
// TODO: add authentication
/*
 * To delete a recording, delete request to the endpoint /api/recording/delete
 * with the username and start time of the recording to delete.
 *
 * For example, to delete user Bobby Smith's recording at 9:45am October 20, 2019:
 * Delete /api/recording/delete
 *   With data:
 *   {
 *     username:  "bobbyS",
 *     startTime:  "Sun, 20 October 2019 09:45:00 GMT"
 *   }
 */
router.delete('/delete', (req, res) => {
  db.Recording.destroy({
    where: {
      username:  req.body.username,
      startTime: req.body.startTime
    }
  }).catch((err) => {
    console.log('Error while deleting recording.');
    console.log(err);
    res.status(500).json({ err: err });
    return;
  });
});






// Don't change this lol
module.exports = router;
module.exports.init = (database) => { db = database; };
