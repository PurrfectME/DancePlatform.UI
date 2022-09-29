import request from '../http/http';
import storageHelper from '../helpers/storageHelper';

const uploadImage = data => {
    return request({
        method: 'POST',
        url: `/user/upload-image/${storageHelper.getCurrentUserId()}`,
        data: data
    });
}

const deleteImage = () => {
    return request({
        method: 'POST',
        url: `/user/delete-photo/${storageHelper.getCurrentUserId()}`,
    });
}

const getImage = () => {
    return request({
        method: 'GET',
        url: `/user/get-photo/${storageHelper.getCurrentUserId()}`,
    });
}

const updateUser = data => {
    return request({
        method: 'POST',
        url: `/user/update-user`,
        data: data
    });
}

const ProfileService = {
    uploadImage,
    getImage,
    deleteImage,
    updateUser
}

export default ProfileService;