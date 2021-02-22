/*!
 **********************************************************************
 
 **********************************************************************
 */

import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { BASE_URL } from '../evampsaanga_appConfigurations/configuration';
import checkLoginStatus from './../evampsaanga_services/checkLoginStatus';
import comingsoon from '../evampsaanga_media/images/coming_soon.png';

class ComingSoon extends Component {
    state = {}
    render() {
        if (!checkLoginStatus()) return <Redirect to={BASE_URL + "/login"} />;
        return (
            <div className="page-comingsoon d-flex flex-column align-items-center justify-content-center">
                <div className="pageContent d-flex flex-column">
                    <img src={comingsoon} alt="Comming Soon" />
                    <Link to={BASE_URL} className="btn btn-secondary btn-round btn-wide mt-5">Back to Home</Link>
                </div>
            </div>
        );
    }
}

export default ComingSoon;