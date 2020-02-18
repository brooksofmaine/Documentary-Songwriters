const express = require('express');
const utils = require('./utils');
const anyValuesUndefined = utils.anyValuesUndefined;
let router = express.Router();
let db;


/*
 * TODO: need to standardize timestamp
 * TODO: can we grab the username from the login session?
 *       instead of putting it into the body
 *
 * To create a recording, post to the endpoint /api/recording/create
 * with the username, start time, end time, instrument, number of pitches, 
 * and description in the body of the request
 *
 * For example, to create a recording for John Smith, who is already logged in:
 *   Post /api/recording/create
 *   With data:
 *   {
 *     username:    "johnS",
 *     startTime:   "2016-04-23T18:25:43.511Z",
 *     endTime:     "2016-04-23T19:25:43.511Z",
 *     instrument:  "piano",
 *     numPitches:  100,
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

  db.Recording.create(createObj)
  .then((newRecordingInstance) => {
    res.json(newRecordingInstance.get({ plain: true }));
    return;
  }).catch((err) => {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ err: 'already recorded' });
      return;
    }

    console.log('Error while creating recording.');
    console.log(err);
    res.status(500).json({ err: err });
    return;
  });
});



/*
 * To edit something about a recording as the creator of a recording, 
 * POST to /api/recording/edit. In the body of the request, include 
 * the start time of the recording to edit, the name of the attribute to edit,
 * and the new value for that attribute.
 *
 * For example, to edit description of a recording made on July 27, 2016:
 * Post /api/recording/edit
 *   With data:
 *   {
 *     username:  johnS
 *     startTime: "Wed, 27 July 2016 07:45:00 GMT",
 *     key:       "description" 
 *     val:       "Adagio for Strings - take 2"
 *   }
 * 
 */
router.post('/edit', (req, res) => {
  let username   = req.body.username;
  let startTime  = req.body.startTime;
  let key        = req.body.key;
  let val        = req.body.val;
  let updateObj  = {};
  updateObj[key] = val;

  if (!recordingKeyCheck(key)) {
    res.status(400).json({ err: 'key not recognized' });
    return;
  }

  if (anyValuesUndefined(updateObj)) {
    res.status(400).json({ err: 'undefined fields' });
    return;
  }

  db.Recording.update(updateObj, {
    where: { username: username },
    returning: true
  }).then(([numRows, rowsAffected]) => {
    if (numRows === 0) {
      res.status(404).json({ err: 'recording not found' });
      return;
    }
    res.json(rowsAffected[0]);
    return;
  }).catch((err) => {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ err: 'description taken' });
      return;
    }

    console.log(`Error while changing ${key}`);
    console.log(err);
    res.status(500).json({ err: err });
    return;
  });
});



/*
 * To delete a recording, post request to the endpoint /api/recording/delete
 * with the start time of the recording to delete, for the logged-in user.
 *
 * For example, to delete logged-in user Bobby Smith's recording at 
 * 9:45am October 20, 2019:
 * Delete /api/recording/delete
 *   With data:
 *   {
 *     startTime:  "Sun, 20 October 2019 09:45:00 GMT"
 *   }
 */
router.post('/delete', (req, res) => {
  let deleteObj = {
    username:    req.body.username,
    startTime:   req.body.startTime,
    endTime:     req.body.endTime,
    instrument:  req.body.instrument,
    numPitches:  req.body.numPitches,
    description: req.body.description
  };
  if (anyValuesUndefined(deleteObj)) {
    res.status(400).json({ err: 'undefined fields' });
    return;
  }
  db.Recording.destroy({
    where: {
      username:    deleteObj.username,
      startTime:   deleteObj.startTime
    }
  })
  .catch((err) => {
    console.log('Error while deleting recording.');
    console.log(err);
    res.status(500).json({ err: err });
    return;
  });
});






// Don't change this lol
module.exports = router;
module.exports.init = (database) => { db = database; };
