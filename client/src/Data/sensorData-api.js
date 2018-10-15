import axios from "axios";
const sensorDataApi = {

    getAll: (id)=> axios.get(`/api/sensorData/findBySensorId/${id}/`),
};
export {
    sensorDataApi as default
};
