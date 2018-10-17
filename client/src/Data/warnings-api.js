import axios from "axios";
const warningsApi = {
 
  getWarnings:  id => axios.get(`/api/warnings/${id}`),

  delete: userid => axios.delete(`/api/warnings/delete/${userid}`),
  
};
export {
    warningsApi as default
};
