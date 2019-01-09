import pluralize from "pluralize";

const moment = require('moment');
// const theDate= "2018-08-25T04:41:30.000Z";
export const convertDiffTimeZones = (date) => {
    const zone = moment.tz.guess();
    const dateToChange = moment(date);
    const changedDate = dateToChange.tz(zone).format('hh:mm:ss YY-MM-DD z');
    return changedDate;
};

export function getLastUpdatedAndElapseTimeStrings(timezone, lastUpdate) {
    const now = moment(new Date()).tz(timezone);
    let _lastUpdate = moment(lastUpdate).tz(timezone);
    let elapsedTime = moment.duration(_lastUpdate.diff(now));
    let elapseTimeString = elapsedTime.humanize(elapsedTime);
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