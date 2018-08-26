import axios from "axios";
const orgApi = {
  getById:  id=> axios.get(`/api/nodes/${id}`),
  
  getAll: (id,graph)=> axios.get(`/api/nodes/the/room/${id}/${graph}`),
  create: org => axios.post('/api/organization', org).then(results => results.data),
  update: org => axios.put(`/api/organization/${org.id}`, org),
  delete: userid => axios.delete(`/api/nodes/${userid}`),
  deleteById: id => axios.delete(`/api/nodes/die/${id}`),
  verification: id => axios.put(`/api/users/verification/${id}`),
};
export {
  orgApi as default
};
