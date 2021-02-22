/*!
 **********************************************************************
 
 **********************************************************************
 */

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import checkLoginStatus from '../evampsaanga_services/checkLoginStatus';
import { BASE_URL } from '../evampsaanga_appConfigurations/configuration';
import ReactFormBuilder from '../evampsaanga_formbuilder/FormBuilder';

class Index extends Component {
    state = {}
    render() {
        if (!checkLoginStatus()) return <Redirect to={BASE_URL + "/login"} />;
        return (
            <ReactFormBuilder />
        );
    }
}

export default Index;