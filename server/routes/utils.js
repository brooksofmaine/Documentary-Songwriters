
module.exports.anyValuesUndefined = (obj) => {
  return Object.values(obj).some((x) => x === undefined || x === null);
};

module.exports.userKeyCheck = (key) => {
  return (key === 'username' ||
          key === 'email' ||
          key === 'firstName' || 
          key === 'lastName');
};

module.exports.groupKeyCheck = (key) => {
  return (key === 'groupName' ||
          key === 'description' ||
          key === 'visible');
};
