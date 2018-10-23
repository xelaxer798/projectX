import axios from "axios";
const alertsApi = {
    getAlerts:()=>axios.get('/api/alerts/getAll'),
    createAlert:(alertName)=>axios.post('/api/alerts/create',{alertName}),
};
export {
    alertsApi as default
};

