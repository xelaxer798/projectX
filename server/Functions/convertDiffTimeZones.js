import pluralize from 'pluralize';


const moment = require('moment');
require('moment-timezone');
// const theDate= "2018-08-25T04:41:30.000Z";
export const convertDiffTimeZones = (date) => {
    const zone = moment.tz.guess()
    const dateToChange = moment(date)
    const changedDate = dateToChange.tz(zone).format('M/D/YY h:mm:ss A z');
    return {
        changedDate: changedDate,
        zone: zone
    }
}

export function getLastUpdatedAndElapseTimeStrings(timezone, lastUpdate) {
    const now = moment(new Date()).tz(timezone);
    let _lastUpdate = moment(lastUpdate).tz(timezone);
    let elapsedTime = moment.duration(now.diff(_lastUpdate));
    let elapseTimeString = humanize(elapsedTime);
    console.log("Last Update: " + lastUpdate + "->" + _lastUpdate);
    return {_lastUpdate, elapseTimeString};
}


export function humanize (duration) {
    console.log("Duration: " + duration);
    const durationComponents = [
        { value: duration.years(), unit: 'year' },
        { value: duration.months(), unit: 'month' },
        { value: duration.days(), unit: 'day' },
        { value: duration.hours(), unit: 'hour' },
        { value: duration.minutes(), unit: 'minute' },
        { value: duration.seconds(), unit: 'second' }
    ]
    console.log("Duration components: " + JSON.stringify(durationComponents));
    return durationComponents
        .filter(({ value }) => value !== 0)
        .slice(0, 2)
        .map(({ unit, value }) => pluralize(unit, value, true))
        .join(', ')
}