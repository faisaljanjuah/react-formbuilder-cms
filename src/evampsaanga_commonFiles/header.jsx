/*!
 **********************************************************************
 
 **********************************************************************
 */

import React, { Component } from 'react';
import { withRouter, Link } from "react-router-dom";
import { clearLocalStorage } from './../evampsaanga_jsFiles/localStorage';
import { BASE_URL } from '../evampsaanga_appConfigurations/configuration';

class Header extends Component {
    logout = async () => {
        clearLocalStorage();
        this.props.history.replace(BASE_URL);
    }
    render() {
        return (
            <React.Fragment>
                <header>
                    <div className="container-fluid">
                        <div className="headerContent d-flex justify-content-between flex-row-reverse">
                            <button className="btn btn-danger" onClick={this.logout}>Logout</button>
                            <Link to={BASE_URL + '/list-form'} className="btn-list-page">Forms Page</Link>
                            <Link to={BASE_URL} className="btn-list-page">Builder Page</Link>
                        </div>
                    </div>
                </header>
            </React.Fragment>
        );
    }
}

export default withRouter(Header);
