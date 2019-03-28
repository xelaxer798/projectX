import axios from "axios";
const cropsApi = {
    getCrops:()=>axios.get(`/api/crops/getCrops`),
    getPlantings:(plantings) => axios.post(`/api/crops/getPlantings`, {plantings})
};
export {
    cropsApi as default
};

