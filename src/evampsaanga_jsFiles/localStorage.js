/*!
 **********************************************************************
 
 **********************************************************************
 */

import { encodeString, decodeString } from "./crypto";
import { lsName } from "../evampsaanga_appConfigurations/configuration"; // localstorage variable name

export function setLocalStorage(k, v) {
  let ls2 = localStorage.getItem(lsName) ? localStorage.getItem(lsName) : {};
  if (typeof ls2 === "object") {
    ls2[k] = v;
    localStorage.setItem(lsName, encodeString(JSON.stringify(ls2)));
  } else {
    ls2 = decodeString(ls2);
    try {
      // try block to avoid JSON.parse error on wrong JSON
      ls2 = JSON.parse(ls2);
      ls2[k] = v;
      localStorage.setItem(lsName, encodeString(JSON.stringify(ls2)));
    } catch (e) {
      console.log(e.message);
    }
  }
}
export function getLocalStorage(key) {
  let ls2 = localStorage.getItem(lsName) ? localStorage.getItem(lsName) : null;
  if (ls2) {
    ls2 = decodeString(ls2);
    try {
      // try block to avoid JSON.parse error on wrong JSON
      ls2 = JSON.parse(ls2);
      if (key) {
        if (ls2[key]) {
          return ls2[key];
        } else {
          return "";
        }
      } else {
        return ls2;
      }
    } catch (e) {
      console.log(e.message);
      clearLocalStorage();
      return null;
    }
  } else {
    return null;
  }
}
export function clearLocalStorage() {
  /* 
        dont use localStorage.clear()
        It will clear Language variable so that will create bug on session timeout
    */
  // Removing localStorage variables one by one
  localStorage.removeItem(lsName);
}

const lsObj = {
  setLocalStorage,
  getLocalStorage,
  clearLocalStorage,
};

export default lsObj;
