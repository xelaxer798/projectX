import getDateIso from './dateFromISO';
import timeToDecimal from './timeToDecimal';
import timeToNumber from './timeToNumber';
import {convertDiffTimeZones, getLastUpdatedAndElapseTimeStrings} from './convertDiffTimeZones';
import determineISODST from './determineISODST';
import momentTimeZones from './momentTimeZones';
import convertTimeZonesNonGuess from './convertTimeZoneNonGuess';
import getMonth from './getMonth';
import getFormateTime from './getFormatedTime';
import getDashboardFormateTime from './getDashboardFormateTime';


const functions = {
    getDateIso,
    timeToDecimal,
    timeToNumber,
    convertDiffTimeZones,
    determineISODST,
    momentTimeZones,
    getLastUpdatedAndElapseTimeStrings,
    convertTimeZonesNonGuess,
    getMonth,
    getDashboardFormateTime,
    getFormateTime
};
export default functions;
