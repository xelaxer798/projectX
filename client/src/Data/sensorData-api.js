import axios from "axios";
const sensorDataApi = {

    getAll: (id, timePeriod)=> axios.get(`/api/sensorData/findBySensorId/${id}/${timePeriod}`),
    findByDateRange: (id, startDate, endDate) => axios.post('/api/sensorData/findByDateRange', {id, startDate, endDate})
};
export {
    sensorDataApi as default
};
