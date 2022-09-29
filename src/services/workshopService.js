import request from '../http/http';
import axios from 'axios';
import storageHelper from '../helpers/storageHelper';

const getAllWorkshops = organizerId => {
    return request({
        method: 'GET',
        url: `/workshop/getAll/${organizerId}`
    });
}

const getAllForUsersAccounting = (organizerId) => {
    return request({
        method: 'GET',
        url: `/workshop/getAll-users-accounting/${organizerId}`
    });
}

const getAvailableWorkshopsForUser = userId => {
    return request({
        method: 'GET',
        url: `/workshop/available/${userId}`
    });
};

const createWorkshop = data => {
    return axios.post("https://localhost:8443/workshop/add", data, 
    {headers: {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*",'Authorization': `Bearer ${storageHelper.getToken()}`} 
});}

const editWorkshop = data => {
    return axios.post("https://localhost:8443/workshop/update", data, 
    {headers: {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*",'Authorization': `Bearer ${storageHelper.getToken()}`} 
});}

const deleteWorkshop = id => {
    return request({
        method: 'POST',
        url: `/workshop/delete/${id}`
    });
}

const getRegisteredUsersOnWorkshop = id => {
    return request({
        method: 'GET',
        url: `/workshop/registered-users/${id}`
    });
};

const getById = id => {
    return request({
        method: 'GET',
        url: `/workshop/get/${id}`
    });
}

const getClosed = (organizerId) => {
    return request({
        method: 'GET',
        url: `/workshop/workshops-history/${organizerId}`
    });
}

const getDesiredWorkshops = userId => {
    return request({
        method: 'GET',
        url: `/workshop/desired/${userId}`
    });
}

const approveWorkshop = workshopId => {
    return request({
        method: 'POST',
        url: `/workshop/approve/${workshopId}`
    });
}

const declineWorkshop = (workshopId, comment) => {
    return request({
        method: 'POST',
        url: `/workshop/decline/${workshopId}/${comment}`
    });
}

const getWorkshopsForApproval = () => {
    return request({
        method: 'GET',
        url: `/workshop/awaiting-approval`
    });
}

const WorkshopService = {
    getAllWorkshops,
    getAvailableWorkshopsForUser,
    createWorkshop,
    editWorkshop,
    deleteWorkshop,
    getRegisteredUsersOnWorkshop,
    getById,
    getClosed,
    getDesiredWorkshops,
    approveWorkshop,
    declineWorkshop,
    getWorkshopsForApproval,
    getAllForUsersAccounting,
}

export default WorkshopService;