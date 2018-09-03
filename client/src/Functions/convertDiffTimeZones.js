const moment = require('moment');
// const theDate= "2018-08-25T04:41:30.000Z";
const convertDiffTimeZones = (date) => {
    const zone = moment.tz.guess();
    const dateToChange = moment(date);
    const changedDate = dateToChange.tz(zone).format('hh:mm:ss YY-MM-DD z');
    return changedDate;
}
export default convertDiffTimeZones;