import functions from './index';
const moment = require('moment');
require('moment-timezone');

const getFormateTime = (date,format) => {
        if(format==='checkNodes'){
                const month = functions.getMonth(date);
                const time = moment(date).tz("America/Los_Angeles").format('YYYY-MM-DD hh:mm a').split(' ');
                const splitDate = time[0].split('-');
                const timeString = `${month} ${splitDate[2]} ${splitDate[0]} At ${time[1]} ${time[2]}`;
                return timeString;
        }
        else if(format==='split'){
                const month = functions.getMonth(date);
        const time = moment(date).tz("America/Los_Angeles").format('YYYY-MM-DD hh:mm a').split(' ');
        const splitDate = time[0].split('-');
        const Date = `${month} ${splitDate[2]} ${splitDate[0]}`
        const Time= `${time[1]} ${time[2]}`;
        const timeDate={
        Date,
        Time
        }

        return timeDate;  
        }
        else{
                const month = functions.getMonth(date);
                const time = moment(date).tz("America/Los_Angeles").format('YYYY-MM-DD hh:mm a').split(' ');
                const splitDate = time[0].split('-');
                const timeString = `${month} ${splitDate[2]} ${splitDate[0]}. ${time[1]} ${time[2]}`;
                return timeString;
        }
       
        const month = functions.getMonth(date);
        const time = moment(date).tz("America/Los_Angeles").format('YYYY-MM-DD hh:mm a').split(' ');
        const splitDate = time[0].split('-');
        const Date = `${month} ${splitDate[2]} ${splitDate[0]}`
        const Time= `${time[1]} ${time[2]}`;
        const timeDate={
        Date,
        Time
        }

        return timeDate;   
}

export default getFormateTime;
