/*!
 **********************************************************************
 
 **********************************************************************
 */

function formatInputDate(d) {
    let date = new Date(d);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day;
}
function convertIntoDate(d) {
    if (d) {
        let date = new Date(d).toString().split(' ');
        return date[2] + '-' + date[1] + '-' + date[3];
    }
}
function getSelectName(list, id) {
    if (list.length && id) {
        let i = list.findIndex(i => parseInt(i.value) === parseInt(id));
        return list[i].text;
    }
    return '';
}

export { formatInputDate, convertIntoDate, getSelectName };