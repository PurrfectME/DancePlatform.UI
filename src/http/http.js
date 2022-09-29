import axios from 'axios';
import {AUTH} from '../constants/auth';
import storageHelper from '../helpers/storageHelper';

const request = async (options) => {
  const client = axios.create({
    baseURL: AUTH.BASE_URL,
    headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-type": "application/json;charset=utf-8",
    'Authorization': `Bearer ${storageHelper.getToken()}`
    }
});
    const onSuccess = (response) => {
        console.log('Request Successful!', response);
        return response.data;
    }

    const onError = (error) => {
        console.error('Request Failed:', error.config);
    
        if (error.response) {
          // Request was made but server responded with something
          // other than 2xx
          console.error('Status:',  error.response.status);
          console.error('Data:',    error.response.data);
          console.error('Headers:', error.response.headers);
    
        } else {
          // Something else happened while setting up the request
          // triggered the error
          console.error('Error Message:', error.message);
        }
    
        return Promise.reject(error.response || error.message);
      }
    
      try {
    const response = await client(options);
    return onSuccess(response);
  } catch (error) {
    return onError(error);
  }
};

export default request;