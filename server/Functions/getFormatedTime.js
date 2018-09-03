import functions from './index';
const moment = require('moment');
require('moment-timezone');

const getFormateTime = (date) => {
        const month = functions.getMonth(date);
        const time = moment(date).tz("America/Los_Angeles").format('YYYY-MM-DD hh:mm:ss a').split(' ');
        const splitDate = time[0].split('-');
        const timeString = `${month} ${splitDate[2]} ${splitDate[0]}. ${time[1]} ${time[2]}`;
        return timeString;
}

export default getFormateTime;
