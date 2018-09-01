import functions from './index';
const moment = require('moment');
require('moment-timezone');
const getDashboardFormateTime = (date) => {
        const month = functions.getMonth(date);
        const time = moment().tz("America/Los_Angeles").format('YYYY-MM-DD hh:mm:ss a').split(' ');
        const splitDate = time[0].split('-');
        const timeString = `Todays Date is ${month} ${splitDate[2]} ${splitDate[0]}. The Time is ${time[1]} ${time[2]}`;
        return timeString;
}
export default getDashboardFormateTime;
