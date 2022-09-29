import request from '../http/http';

const getAll = (organizerId) => {
    return request({
        method: 'GET',
        url: `/choreographer/getAll/${organizerId}`,
    });
}

const create = data => {
    return request({
        method: 'POST',
        url: '/choreographer/add',
        data: data
    });
}

const deleteChoreographer = id => {
    return request({
        method: 'POST',
        url: `/choreographer/delete/${id}`,
    });
}

const update = data => {
    return request({
        method: 'POST',
        url: `/choreographer/update`,
        data: data
    });
}

const ChoreographerService = {
    getAll,
    create,
    deleteChoreographer,
    update
}

export default ChoreographerService;