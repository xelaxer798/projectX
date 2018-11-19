import axios from "axios";
const alertsApi = {
    getAlerts:()=>axios.get('/api/alerts/getAll'),
    createAlert:(alert)=>axios.post('/api/alerts/create',{alert}),
    updateAlert:(alert)=>axios.post('/api/alerts/update',{alert}),
};
export {
    alertsApi as default
};

