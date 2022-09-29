import request from '../http/http';
import axios from 'axios';
import storageHelper from '../helpers/storageHelper';

const registerOnWorkshop = data => {
    return request({
        method: 'POST',
        url: '/registration/add',
        data: data
    });
}

const getAllRegistrations = () => {
    return request({
        method: 'GET',
        url: '/registration/getAll',
    });
}

const getUserWorkshops = userId => {
    return request({
        method: 'GET',
        url: `/registration/${userId}`,
    });
}

const deleteRegistrations = id => {
    return request({
        method: 'POST',
        url: `/registration/delete/${id}`,
    });
}

const checkoutUsers = data => {
    return axios.post("https://localhost:8443/registration/checkout-users", data, 
    {headers: {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*",'Authorization': `Bearer ${storageHelper.getToken()}`} 
});}


const getUserVisitedWorkshops = userId => {
    return request({
        method: 'GET',
        url: `/registration/visited/${userId}`
    });
}

const removeFromDesired = (userId, workshopId) => {
    return request({
        method: 'POST',
        url: `/registration/remove-desired/${userId}/${workshopId}`
    });
}

const RegistrationService = {
    registerOnWorkshop,
    getAllRegistrations,
    getUserWorkshops,
    deleteRegistrations,
    checkoutUsers,
    getUserVisitedWorkshops,
    removeFromDesired,
}

export default RegistrationService;