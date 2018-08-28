const moment = require('moment');

const convertTimeZonesNonGuess=(date)=>{
    const dateToChange = moment(date)
    const changedDate = dateToChange.tz('America/Los_Angeles')
    return changedDate
}
export default convertTimeZonesNonGuess;