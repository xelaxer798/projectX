import axios from "axios";

const webCamsApi = {
    getLatestImage: id => axios.get(`/api/webCamImages/getLatestImage/${id}`),
};
export {
    webCamsApi as default
};
