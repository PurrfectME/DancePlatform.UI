import request from '../http/http';

const createPlace = data => {
    return request({
        method: 'POST',
        url: '/place/add',
        data: data
    });
}

const getAllPlaces = (organizerId) => {
    return request({
        method: 'GET',
        url: `/place/getAll/${organizerId}`,
    });
}

const updatePlace = data => {
    return request({
        method: 'POST',
        url: '/place/update',
        data: data
    });
}

const deletePlace = id => {
    return request({
        method: 'POST',
        url: `/place/delete/${id}`,
    });
}


const PlaceService = {
    createPlace,
    getAllPlaces,
    updatePlace,
    deletePlace,
}

export default PlaceService;