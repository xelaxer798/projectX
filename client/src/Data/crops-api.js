import axios from "axios";
const cropsApi = {
    getCrops:()=>axios.get(`/api/crops/getCrops`),
    getPlantings:(plantings) => axios.post(`/api/crops/getPlantings`, {plantings}),
    getCropPrices:(status) => axios.post(`/api/crops/getCropPrices`, {status}),
    getPricingReport:() => axios.get(`/api/crops/getPricingReport`)
};
export {
    cropsApi as default
};

