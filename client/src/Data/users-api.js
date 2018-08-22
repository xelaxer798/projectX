import axios from "axios";
const usersApi = {
 
  startRecover:  email=> axios.post(`/api/users/reset/pass`,{email}),
checkPassJwt:jwt=>axios.post(`/api/users/check/pass/jwt`,{jwt}),
changePass:(userid,password,email,name)=>axios.put(`/api/users//change/password`,{userid,password,email,name}),
  delete: userid => axios.delete(`/api/warnings/delete/${userid}`),
  
};
export {
    usersApi as default
};
