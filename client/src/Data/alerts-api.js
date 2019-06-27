import axios from "axios";
const alertsApi = {
    getAlerts:(timezone)=>axios.get(`/api/alerts/getAll/${timezone}`),
    createAlert:(alert)=>axios.post('/api/alerts/create',{alert}),
    updateAlert:(alert)=>axios.post('/api/alerts/update',{alert}),
    updateAlertDeep:(alert)=>axios.post('/api/alerts/updateDeep',{alert}),
};
export {
    alertsApi as default
};

