const moment = require('moment');

const convertTimeZonesNonGuess=(date,timeZone)=>{
    const dateToChange = moment(date)
    const changedDate = dateToChange.tz(timeZone).format('hh:mm:ss YY-MM-DD z');
    return changedDate
}
export default convertTimeZonesNonGuess;