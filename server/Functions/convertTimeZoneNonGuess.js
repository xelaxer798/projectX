const moment = require('moment');

const convertTimeZonesNonGuess=(date)=>{
    const dateToChange = moment(date)
    const changedDate = dateToChange.tz('America/Los_Angeles').format('hh:mm:ss YY-MM-DD z');
    return changedDate
}
export default convertTimeZonesNonGuess;