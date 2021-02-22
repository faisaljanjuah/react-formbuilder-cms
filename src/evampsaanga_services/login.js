/*!
 **********************************************************************
 
 **********************************************************************
 */

import http from "./http/httpService";
import { API_URL } from './../evampsaanga_appConfigurations/configuration';

/*
==============================================
Will Enable below code after integrating API
==============================================
*/

/*Request for login */
async function login(request) {
    // axios.defaults.headers.common["requestType"] = "anonymous";
    const { data } = await http.post(API_URL + '/authenticateUser', request);
    return data;
}

/*Request for checkLogin */
async function checkLogin() {
    // const { data } = await http.get(API_URL + '/checkLogin.php');
    // return data;
}

/*Request for checkLogin */
async function logout(request) {
    const { data } = await http.post(API_URL + '/logout', request);
    return data;
}

/*Request for Generate Code for forgot password  */
async function generateCode(request) {
    const { data } = await http.post(API_URL + '/generateCode', request);
    return data;
}

/*Request for setting new password  */
async function resetPasswordWithOtp(request) {
    const { data } = await http.post(API_URL + '/resetPasswordWithOtp', request);
    return data;
}

/*Request for change password  */
async function resetPassword(request) {
    const { data } = await http.post(API_URL + '/resetPassword', request);
    return data;
}


const loginObj = { login, checkLogin, logout, generateCode, resetPasswordWithOtp, resetPassword };

export default loginObj;