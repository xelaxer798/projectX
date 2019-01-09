import axios from "axios";
const sensorDataApi = {

    getAll: (id, timePeriod)=> axios.get(`/api/sensorData/findBySensorId/${id}/${timePeriod}`),
};
export {
    sensorDataApi as default
};
