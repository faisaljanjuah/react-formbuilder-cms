/*!
 **********************************************************************
 
 **********************************************************************
 */

// Encoding Method
function encoder(key) {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = code => textToChars(key).reduce((a, b) => a ^ b, code);
    return text => text.split('').map(textToChars).map(applySaltToChar).map(byteHex).join('');
}
// Decoding Method
function decoder(key) {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const applySaltToChar = code => textToChars(key).reduce((a, b) => a ^ b, code);
    return encoded => encoded.match(/.{1,2}/g).map(hex => parseInt(hex, 16)).map(applySaltToChar).map(charCode => String.fromCharCode(charCode)).join('');
}

// Creating dynamic Password based on machine
function guid() {
    var os = "O".charCodeAt(0);
    if (navigator.appVersion.indexOf("Win") !== -1) { os = "W".charCodeAt(0); }
    else if (navigator.appVersion.indexOf("Mac") !== -1) { os = "M".charCodeAt(0); }
    else if (navigator.appVersion.indexOf("X11") !== -1) { os = "U".charCodeAt(0); }
    else if (navigator.appVersion.indexOf("Linux") !== -1) { os = "L".charCodeAt(0); }
    // making GUID
    var nav = window.navigator;
    var guid = nav.mimeTypes.length;
    guid += os;
    guid += nav.plugins.length || 0;
    guid += window.screen.width || 0;
    guid += window.screen.height || 0;
    guid += window.screen.pixelDepth || 0;
    guid += nav.userAgent.replace(/\D/g, "") || 0;
    guid += nav.appVersion.replace(/\D/g, "") || 0;
    return guid;
}

// Encoding String parser
export function encodeString(str) {
    const enc = encoder(guid());
    return enc(str);
}

// Decoding String parser
export function decodeString(str) {
    const dec = decoder(guid());
    return dec(str);
}
