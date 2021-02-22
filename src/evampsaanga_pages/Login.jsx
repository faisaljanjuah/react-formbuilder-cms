/*!
 **********************************************************************
 
 **********************************************************************
 */

import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { setLocalStorage } from './../evampsaanga_jsFiles/localStorage';
import checkLoginStatus from './../evampsaanga_services/checkLoginStatus';
import { BASE_URL } from '../evampsaanga_appConfigurations/configuration';

class Login extends Component {
    state = { }

    doLogin = () => {
        setLocalStorage('authorization', 'tHiSiSsOmEtOkEn');
        this.props.history.replace(BASE_URL);
        // if not using withRouter un-comment below line
        // this.setState({ loggedIn: true }); // useless... just to re-render the page to run line # 15 ;)
    }

    render() {
        if (checkLoginStatus()) return <Redirect to={BASE_URL} />;
        return (
            <div className="loginPage text-center py-5">
                <h1>Login page</h1>
                <button className="btn btn-primary btn-wide" onClick={this.doLogin}>Login</button>
            </div>
        );
    }
}

export default withRouter(Login);