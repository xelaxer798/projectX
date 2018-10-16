import axios from "axios";
const sensorApi = {

    getAll: ()=> axios.get(`/api/sensors/getSensors/`),
};
export {
    sensorApi as default
};
