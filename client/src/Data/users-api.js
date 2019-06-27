import axios from "axios";

const usersApi = {
    findAllUsers: () => axios.get('/api/users/'),
    signIn: (email, password) => axios.post('/api/users/sign/in', {email, password}),
    Auth: userToken => axios.post('/api/users/auth', {userToken}),
    startRecover: email => axios.post(`/api/users/reset/pass`, {email}),
    checkPassJwt: jwt => axios.post(`/api/users/check/pass/jwt`, {jwt}),
    changePass: (userid, password, email, name) => axios.put(`/api/users/change/password`, {
        userid,
        password,
        email,
        name
    }),
    delete: userid => axios.delete(`/api/warnings/delete/${userid}`),

};
export {
    usersApi as default
};
