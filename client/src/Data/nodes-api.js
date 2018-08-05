import axios from "axios";
const orgApi = {
  getAll:  id=> axios.get(`/api/nodes/${id}`),
  getWarnings:  id=> axios.get(`/api/nodes/warnings/${id}`),
  getById: id => axios.get(`/api/nodes/the/room/${id}`),
  create: org => axios.post('/api/organization', org).then(results => results.data),
  update: org => axios.put(`/api/organization/${org.id}`, org),
  delete: id => axios.delete(`/api/nodes`),
  deleteById: id => axios.delete(`/api/nodes/die/${id}`)
};
export {
  orgApi as default
};
