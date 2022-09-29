import request from '../http/http';

const login = data => {
    return request({
        method: 'POST',
        url: '/auth/login',
        data: data
    });
}


const register = data => {
    return request({
        method: 'POST',
        url: '/auth/register',
        data: data
    })
};

const AuthService = {
    login,
    register,
}

export default AuthService;