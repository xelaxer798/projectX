import axios from "axios";

const nodesApi = {
    getById: id => axios.get(`/api/nodes/${id}`),

    getAll: (id, graph) => axios.get(`/api/nodes/the/room/${id}/${graph}`),
    getNodes: () => axios.get(`/api/nodes/config/getNodes/`),
    getAdmin: (id, number) => axios.get(`/api/nodes/data/${id}/${number}`),

    delete: userid => axios.delete(`/api/nodes/${userid}`),
    deleteById: id => axios.delete(`/api/nodes/die/${id}`),
    verification: id => axios.put(`/api/users/verification/${id}`),
    updateWeatherNodes: () => axios.get(`/api/nodes/config/updateWeatherNodes`)
};
export {
    nodesApi as default
};
