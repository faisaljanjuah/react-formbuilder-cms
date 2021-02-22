/*!
 **********************************************************************
 
 **********************************************************************
 */

import axios from 'axios';
import { toast } from 'react-toastify';
import { getLocalStorage } from '../../evampsaanga_jsFiles/localStorage';

// Getting Language from session.
const appLanguage = localStorage.getItem("language") === '2' ? '2' : '1';

/* Setting default request headers*/
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["language"] = appLanguage;
// axios.defaults.headers.common["channel"] = "web";
// axios.defaults.headers.common["authorization"] = 'Bearer 4acfba95-6a60-3610-aa27-9950e17c8213';


axios.interceptors.request.use(function (config) {
    // Do something before sending every request
    config.headers.Authorization = getLocalStorage('authorization');

    // Fix of 415 error
    if (config.method === 'get' || config.method === 'delete') config.data = true;
    return config;
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    // Do something after getting every response
    const sameUser = response.data.responseCode === '1007' ? true : false;
    if (sameUser) {
        toast.warning(response.data.message);
        // clearLocalStorage();
        // window.location.replace(BASE_URL + '/login');
    }
    return response;
}, function (error) {
    /* ==========Only Enable if this handling is not implemented in pages.========== */
    // const unExpectedError = error.response && error.response.status >= 400 && error.response.status < 500;
    // if (!unExpectedError) {
    //     console.log('Unexpected error occured: ', error);
    //     toast.error(error.message);
    // }
    return Promise.reject(error);
});

const httpObj = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
}
export default httpObj;