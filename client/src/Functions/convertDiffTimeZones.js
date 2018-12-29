const moment = require('moment');
// const theDate= "2018-08-25T04:41:30.000Z";
export const convertDiffTimeZones = (date) => {
    const zone = moment.tz.guess();
    const dateToChange = moment(date);
    const changedDate = dateToChange.tz(zone).format('hh:mm:ss YY-MM-DD z');
    return changedDate;
};

export function getLastUpdatedAndElapseTimeStrings(timezone, alert) {
    const now = moment(new Date()).tz(timezone);
    let lastUpdate = moment(alert.Node.lastUpdate).tz(timezone);
    let elapsedTime = moment.duration(lastUpdate.diff(now));
    let elapseTimeString = elapsedTime.humanize(true);
    return {lastUpdate, elapseTimeString};
}
