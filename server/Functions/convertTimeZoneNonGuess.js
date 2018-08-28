const moment = require('moment');
require('moment-timezone');
//  const theDate= "2018-08-28T05:22:15.000Z";
const convertTimeZonesNonGuess=(date)=>{
    const dateToChange = moment(date)
    const changedDate = dateToChange.tz('America/Los_Angeles');
    console.log(changedDate);
    return changedDate;
}

// convertTimeZonesNonGuess(theDate)
 export default convertTimeZonesNonGuess;