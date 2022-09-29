import request from '../http/http';
import axios from 'axios';
import storageHelper from '../helpers/storageHelper';

const createOrder = () => {
    return request({
        method: 'POST',
        url: `/payment/createOrder`,
    });
}

const PaymentService = {
    createOrder,
}

export default PaymentService;