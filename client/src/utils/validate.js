function validateEmail(email) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
  {
    return (true)
  }
    return (false)
}

function validatePitches(pitches) {
    if (pitches > 999999 || pitches < 10) {
        return false
    } 
    return true
}

exports.validateEmail = validateEmail
exports.validatePitches = validatePitches