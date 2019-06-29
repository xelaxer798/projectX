import getDateIso from './dateFromISO';
import timeToDecimal from './timeToDecimal';
import timeToNumber from './timeToNumber';
import {convertDiffTimeZones, getLastUpdatedAndElapseTimeStrings} from './convertDiffTimeZones';
import determineISODST from './determineISODST';
import momentTimeZones from './momentTimeZones';
import {convertTimeZonesNonGuess, convertTimeZonesAndFormat, convertTimeZonesAndFormatReversed} from './convertTimeZoneNonGuess';
import getMonth from './getMonth';
import getFormateTime from './getFormatedTime';
import compareValues from './compareValues'

const functions = {
    getDateIso,
    timeToDecimal,
    timeToNumber,
    convertDiffTimeZones,
    determineISODST,
    momentTimeZones,
    convertTimeZonesNonGuess,
    convertTimeZonesAndFormat,
    convertTimeZonesAndFormatReversed,
    getLastUpdatedAndElapseTimeStrings,
    getMonth,
    getFormateTime,
    compareValues
};

export default functions;
