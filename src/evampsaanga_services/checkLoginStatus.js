/*!
 **********************************************************************
 
 **********************************************************************
 */

// Check Login Status
import { getLocalStorage } from '../evampsaanga_jsFiles/localStorage';

export default function checkLoginStatus() {
  if (getLocalStorage('authorization')) {
    return true;
  } else {
    return false;
  }
}
