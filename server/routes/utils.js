
module.exports.anyValuesUndefined = (obj) => {
  return Object.values(obj).some((x) => x === undefined || x === null);
};

module.exports.userKeyCheck = (key) => {
  return (key === 'username' ||
          key === 'email' ||
          key === 'firstName' || 
          key === 'lastName' ||
          key === 'password' ||
          key === 'LastPlayedInstrument' ||
          key === 'weeklyAchievement');
};

module.exports.groupKeyCheck = (key) => {
  return (key === 'groupName' ||
          key === 'description' ||
          key === 'visible');
};

module.exports.recordingKeyCheck = (key) => {
  return (key === 'description');
};

// function ensureAuthenticated
// ensures the user is logged in before it grants access to the api.
// input: req, the request; res, the response obj; next, the function to be called next

module.exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json( {"err": "you are not logged in"});
  }
};
