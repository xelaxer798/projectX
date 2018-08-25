const moment = require('moment')
// use if you have date and time in an ISO Format to tell if the date is in Daylight SavingsTime
const determineISODST = (date) => {
    const splitChangedDate = date.split(' ');
    const splitDate = splitChangedDate[1].split('-');
    return moment([splitDate[0], splitDate[1], splitDate[2]]).isDST();
}
export default determineISODST;