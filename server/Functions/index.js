import getDateIso from './dateFromISO';
import timeToDecimal from './timeToDecimal';
import timeToNumber from './timeToNumber';
import {convertDiffTimeZones, getLastUpdatedAndElapseTimeStrings} from './convertDiffTimeZones';
import determineISODST from './determineISODST';
import momentTimeZones from './momentTimeZones';
import convertTimeZonesNonGuess from './convertTimeZoneNonGuess';
import getMonth from './getMonth';
import getFormateTime from './getFormatedTime';
const functions = {
    getDateIso,
    timeToDecimal,
    timeToNumber,
    convertDiffTimeZones,
    determineISODST,
    momentTimeZones,
    convertTimeZonesNonGuess,
    getLastUpdatedAndElapseTimeStrings,
    getMonth,
    getFormateTime
}
export default functions;
