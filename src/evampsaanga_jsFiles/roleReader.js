/*!
 **********************************************************************
 
 **********************************************************************
 */

import { getLocalStorage } from "./localStorage";
import { BASE_URL } from "../evampsaanga_appConfigurations/configuration";
import { setLocalStorage } from './localStorage';

export function allowUrl(url, isLoggedIn) {
    setLocalStorage('writeable', true); // default writeable role for all pages

    let whiteListPaths = false;
    const allowedURLs = [
        '', // homepage
        '/login', // logout case
        '/change-password',
        '/list-form'
    ];
    const extPath = url.replace(BASE_URL, '');
    whiteListPaths = allowedURLs.indexOf(extPath) > -1 ? true : false;
    if (whiteListPaths && isLoggedIn) { return true; } // whitelist check

    // const profileName = getLocalStorage('profileName');
    // if (profileName.toLowerCase() === 'read only') {
    //     if (extPath.indexOf('/new') > -1 || extPath.indexOf('/edit') > -1) return false;
    // }
    const useCaseList = getLocalStorage('useCaseList') ? getLocalStorage('useCaseList') : [];
    let pageIndex = useCaseList.findIndex(u => extPath.indexOf(u.url) > -1 ? true : false);
    if (pageIndex > -1 && useCaseList[pageIndex].write === false) {
        setLocalStorage('writeable', false);
        if (extPath.indexOf('/new') > -1 || extPath.indexOf('/edit') > -1) return false;
    }
    if (useCaseList.length) {
        let allowed = useCaseList.filter(r => {
            const regx = '^' + r.url;
            return extPath.match(regx);
        });
        if (allowed.length) return true;
    }
    return false;
}

export default allowUrl;