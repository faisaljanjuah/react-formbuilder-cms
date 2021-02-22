import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ESDatatable extends Component {
    configuration = {}
    componentDidMount() {
        this.setState(this.configuration, () => {
            this.initializeTable();
            if (typeof this.componentMounting === 'function') this.componentMounting();
        });
    }
    initializeTable = () => {
        let { currentPage, rowsPerPage, pagination, tableData, isLoading } = { ...this.state };
        let filteredData = tableData ? tableData : [];
        if (isLoading === undefined) isLoading = true;
        if (currentPage === undefined || isNaN(parseInt(currentPage))) currentPage = 1;
        if (rowsPerPage === undefined || isNaN(parseInt(rowsPerPage))) rowsPerPage = 10;
        if (pagination === undefined || pagination !== false) pagination = true;
        this.setState({ isLoading, filteredData, currentPage, rowsPerPage, pagination }, () => {
            // console.log(this.state);
        });
    }

    tableHeader = () => {
        const { tableData, header, addColumn } = this.state;
        let newNames = {}, thText = [];
        if (typeof header === 'object' && Object.keys(header).length > 0) newNames = header;
        Object.keys(tableData[0]).map(h => thText.push(h));
        addColumn && addColumn.map(c => thText.push(c.headerText));
        Object.keys(newNames).map(n => typeof newNames[n] === 'string' && (parseInt(n) - 1) <= thText.length ? thText[parseInt(n) - 1] = newNames[n] : null);
        return <thead><tr>{thText.map((heading, key) => <th key={key}>{heading}</th>)}</tr></thead>
    }
    tableBody = () => {
        let { filteredData, pagination, currentPage, rowsPerPage, addColumn, identifier } = this.state;
        let identifierValue = '';
        let paginatedItems = [];
        if (pagination) paginatedItems = this.paginate(filteredData, currentPage, rowsPerPage);
        return <tbody>
            {paginatedItems.map((row, r) => (
                <tr key={r}>{
                    Object.keys(row).map((cell, c) => {
                        if (c + 1 === identifier) identifierValue = row[cell];
                        return <td key={c}>{row[cell]}</td>
                    })}
                    {addColumn && addColumn.map((ac, kac) => <td key={kac} className={`btn-column actionBtn-${ac.addButtons.length}`}>{
                        ac.addButtons.map(
                            (ab, kab) => (ab.type === 'link') ? <Link to={{ pathname: ab.url && ab.url.indexOf(':id') === -1 ? ab.url : ab.url.replace(':id', identifierValue) }} key={kab} data-id={identifierValue} className={ab.class} title={ab.titleText}>{ab.buttonText}</Link> : <button key={kab} data-id={identifierValue} className={ab.class} title={ab.titleText} onClick={(e) => ab.onClick(e.target.getAttribute('data-id'))}>{ab.buttonText}</button>
                        )
                    }</td>)}
                </tr>
            ))}
        </tbody>
    }
    paginate = (totalItems, currentPage, itemsPerPage) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const currentRows = [];
        for (let i = startIndex; i < (startIndex + itemsPerPage); i++) {
            if (totalItems[i] !== undefined) {
                currentRows.push(totalItems[i]);
            }
        }
        return currentRows;
    }
    pagination = (name = '') => {
        let { rowsPerPage: itemsPerPage, currentPage } = this.state;
        const itemsLength = this.state.filteredData && this.state.filteredData.length;
        if (itemsPerPage === -1) itemsPerPage = itemsLength;
        const totalPages = Math.ceil(itemsLength / itemsPerPage);
        if (isNaN(totalPages) || totalPages < 2) return null; // isNaN is used to handle 0/0 situation
        const paginationCount = [...Array(totalPages)].map((h, i) => (i + 1)); // creates array like [1,2,3,4 ... n]
        const first_i = paginationCount[0];
        const last_i = paginationCount[paginationCount.length - 1];

        const pages = [];
        pages.push(first_i);

        // Left side of pagination
        if ((currentPage - 1) - (first_i + 1) > 1) {
            pages.push(0);
            currentPage === last_i && pages.push(currentPage - 2);
            pages.push(currentPage - 1);
            pages.push(currentPage);
        }
        else {
            for (let ls = 1; ls < currentPage; ls++) { // skipping 0 as it is already inserted above
                pages.push(paginationCount[ls]);
            }
        }
        // Right side of pagination
        if ((last_i - 1) - (currentPage + 1) > 1) {
            pages.push(currentPage + 1);
            currentPage === first_i && pages.push(currentPage + 2);
            pages.push(0);
            pages.push(last_i);
        }
        else {
            for (let rs = currentPage; rs < paginationCount.length; rs++) {
                pages.push(paginationCount[rs]);
            }
        }

        const zero = pages.indexOf(0); // find index of 0
        if (pages[zero + 1] - pages[zero - 1] === 2) pages[zero] = pages[zero + 1] - 1; // if ... has only 1 page remove ... and put number

        let prev = currentPage === first_i ? currentPage : currentPage - 1;
        let next = currentPage === last_i ? currentPage : currentPage + 1;

        const changePage = (number, currentPage) => {
            if (number !== currentPage) {
                let { currentPage } = { ...this.state, currentPage: number };
                this.setState({ currentPage });
            }
        }

        return (
            <ul className={`pagination table-pagination pagination-${name}`}>
                <li className="previous"><button disabled={currentPage === first_i ? true : false} onClick={() => changePage(prev)}>Previous</button></li>
                {
                    pages.map(
                        (page, k) => {
                            return page === 0
                                ? <li key={k}><span>...</span></li>
                                : <li key={k} className={(page === currentPage) ? 'active' : ''}>
                                    <button onClick={() => changePage(page, currentPage)}>{page}</button>
                                </li>
                        }
                    )
                }
                <li className="next"><button disabled={currentPage === last_i ? true : false} onClick={() => changePage(next)}>Next</button></li>
            </ul>
        );
    }

    searchInTable = (e) => {
        e.preventDefault();
        const search = e.target.value.toLowerCase();
        console.log(search);
        let searchedData = [];
        let filteredData = [...this.state.tableData];
        if (search.length > 0) {
            filteredData.map(row => {
                for (let col in row) {
                    let str = row[col].toString().toLowerCase();
                    if (str.indexOf(search) > -1) { searchedData.push(row); break; }
                }
                return null;
            });
            filteredData = searchedData;
        }
        else { filteredData = this.state.tableData; }
        this.setState({ filteredData });
    }

    // Search Method
    createSearchbar = (name) => {
        return <div className={`table-searchbar searchbar-${name}`}>
            <input type="text" placeholder="Search..." onChange={e => this.searchInTable(e)} />
        </div>
    }

    // Filters
    createFilters = (filters, name) => {
        const { tableData } = this.state;
        // get column names for filters, (removing case insenstive situation as well)
        const filterColumns = [];
        filters = filters.filter(n => {
            if (!n.columnName || !n.filterType) return null;
            if (tableData && tableData.length > 0) {
                const keys = Object.keys(tableData[0]);
                const p = keys.findIndex(f => f.toLowerCase() === n.columnName.toLowerCase());
                if (p > -1) {
                    n.columnName = keys[p];
                    n.filterType = n.filterType.toLowerCase();
                    !filterColumns.includes(keys[p]) && filterColumns.push(keys[p]);
                    return n;
                }
            }
            return null;
        });

        // getting distinct values
        const distinctValues = {};
        filterColumns.map(fc => {
            distinctValues[fc] = [];
            tableData.map(c => (!distinctValues[fc].includes(c[fc])) && distinctValues[fc].push(c[fc]));
            return null;
        });

        // Create Titles for Filter column
        const getTitle = (c) => {
            const keys = Object.keys(distinctValues);
            const p = keys.findIndex(f => f === c.columnName);
            if (p > -1) return keys[p];
        }

        // Creating Select Filter
        const createSelect = (t, k) => {
            return <div key={k} className="filterCell filter_select" id={`filter_${name}_${t.columnName}`}>
                <div className="filterTitle"><h4>{getTitle(t)}</h4></div>
                <div className="filterContent">
                    <select className="select-filter" onChange={e => this.searchInTable(e)}>
                        <option value="">--Select {getTitle(t)}--</option>
                        {distinctValues[t.columnName].map((o, i) => <option key={i} value={o}>{o}</option>)}
                    </select>
                </div>
            </div>
        }
        // Creating Checkbox Filter
        const createCheckbox = (t, k) => {
            return <div key={k} className="filterCell filter_checkbox" id={`filter_${name}_${t.columnName}`}>
                <div className="filterTitle"><h4>{getTitle(t)}</h4></div>
                <div className="filterContent">
                    {distinctValues[t.columnName].map((o, i) => <div key={i} className="defaultCheckbox checkbox-filter"><input type="checkbox" value={o} id={name + t.columnName + o} /><label htmlFor={name + t.columnName + o}>{o}</label></div>)}
                </div>
            </div>
        }
        return <div className={`table-filters filters-${name}`}>
            {
                filters.map((f, k) => {
                    if (f.filterType === 'select') {
                        return createSelect(f, k);
                    }
                    else if (f.filterType === 'checkbox') {
                        return createCheckbox(f, k);
                    }
                    return null;
                })
            }
        </div>
    }

    // changeLength = (totalRows, options, name) => {
    //     const { rowsPerPage, currentPage } = this.state;
    //     let value = rowsPerPage; // Rows Per page value
    //     if (rowsPerPage === totalRows) value = -1;
    //     if (options.length < 1) options = [10, 20, 50, 100];
    //     // options.map(o => {
    //     //     const index = options.indexOf(rowsPerPage);
    //     //     // console.log(index);
    //     //     // console.log(rowsPerPage);
    //     // });
    //     const changeRecordsPerPage = v => {
    //         const { rowsPerPage } = { ...this.state, rowsPerPage: parseInt(v.target.value) };
    //         this.setState({ rowsPerPage });
    //     };
    //     return (
    //         <div className={`table-changeLength changeLength-${name}`}>
    //             <select value={value} onChange={e => changeRecordsPerPage(e)}>
    //                 {options.map((o, k) => <option key={k} value={o}>{o}</option>)}
    //                 <option value="-1">All</option>
    //             </select>
    //             <label>Records per page</label>
    //         </div>
    //     );
    // }
    createTable = (args) => {
        const name = Object.keys(args)[0];
        const { header, tableData, isLoading, hideColumns, filters } = this.state;
        // const totalRows = tableData ? tableData.length : 0;

        /* =============State Properties============= */
        // let { pagination, searchbar, changeLength, recordInfo } = this.state;
        let { pagination, searchbar } = this.state;
        /* ========================================== */

        // Header Creation
        let createHeader = true;
        if (header === false) createHeader = false;

        // Pagination settings
        if (pagination !== false) pagination = true;
        // else pagination = { render: true, currentPage, rowsPerPage };

        // Searchbar
        if (searchbar === undefined || searchbar !== false) searchbar = true;

        // // Change Length
        // if (changeLength === undefined || typeof changeLength !== 'object') {
        //     changeLength = {};
        //     changeLength.render = true;
        // }
        // if (changeLength.render === undefined || changeLength.render !== false) changeLength.render = true;
        // let changeLengthOptions = [];
        // if (changeLength && changeLength.options && changeLength.options.length) changeLengthOptions = changeLength.options;

        // // Record Info
        // if (recordInfo === false)
        //     recordInfo = { render: false };
        // else recordInfo = { render: true, currentPage: currentPage, itemsPerPage: rowsPerPage };

        // hide filterable columns from view
        let hideWithCSS = '';
        hideColumns && hideColumns.map(hc => hideWithCSS += `.ESDatatable.table-${name} tr > :nth-child(${hc}){display:none;}`);

        return (
            <div className={`ESDatatableWrapper wrapper-${name}${isLoading ? ' tableLoading' : ''}`}>
                {
                    hideWithCSS.length > 0 && <style>{hideWithCSS}</style>
                }
                {
                    searchbar && <div className={`searchbarWrapper searchbar-wrapper-${name}`}>
                        {this.createSearchbar(name)}
                    </div>
                }
                {
                    filters && filters.length > 0 && <div className={`filtersWrapper filters-wrapper-${name}`}>
                        {tableData && tableData.length > 0 && this.createFilters(filters, name)}
                    </div>
                }
                {(!isLoading) && tableData && tableData.length < 1 && <table className="table ESDatatable noRecordFound"><tbody><tr><td>No record found</td></tr></tbody></table>}
                <table className={`table ESDatatable table-${name}`}>
                    {createHeader && tableData && tableData.length > 0 && this.tableHeader()}
                    {tableData && tableData.length > 0 && this.tableBody()}
                </table>
                {
                    pagination && <div className={`paginationWrapper pagination-wrapper-${name}`}>
                        {this.pagination(name)}
                    </div>
                }
                {/* {
                    (changeLength.render) && <div className={`changeLengthWrapper changeLength-wrapper-${name}`}>
                        {this.changeLength(totalRows, changeLengthOptions, name)}
                    </div>
                } */}
            </div>
        )
    }
}

export default ESDatatable;