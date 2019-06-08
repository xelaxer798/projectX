const moment = require('moment');
require('moment-timezone');
//  const theDate= "2018-08-28T05:22:15.000Z";
export const convertTimeZonesNonGuess=(date)=>{
    const dateToChange = moment(date)
    const changedDate = dateToChange.tz('America/Los_Angeles').format();
    // console.log(changedDate);
    return changedDate;
}

export const convertTimeZonesAndFormat=(date, timeZone)=>{
    const dateToChange = moment(date)
    const changedDate = dateToChange.tz(timeZone).format('M/D/YY h:mm:ss A z');
    // console.log(changedDate);
    return changedDate;
}
