/*!
 **********************************************************************
 
 **********************************************************************
 */

// Language based text provider
import ReactHtmlParser from 'react-html-parser';
export function GetText(field) {
    let language = localStorage.getItem("language");
    let translate = 'en';
    // language === '1' ? translate = 'en' : language === '2' ? translate = 'ur' : translate = 'en';
    language === '2' ? translate = 'ur' : translate = 'en';
    return ReactHtmlParser(field[translate]);
}
export default GetText;