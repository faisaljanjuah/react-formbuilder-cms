/*!
 **********************************************************************
 
 **********************************************************************
 */

import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { BASE_URL } from "../evampsaanga_appConfigurations/configuration";
import ProtectedRoute from "./protectedRoute";

import Login from './../evampsaanga_pages/Login';
import Index from './../evampsaanga_pages/Index';
import Page404 from "../evampsaanga_pages/404";
import ListFormPage from './../evampsaanga_pages/ListFormPage';

class AppRouter extends Component {
  render() {
    return (
      <Switch>

        <Route path={BASE_URL + "/login"} component={Login} exact />
        <ProtectedRoute path={BASE_URL} component={Index} exact /> {/* Default/Home page */}
        <ProtectedRoute path={BASE_URL + '/list-form'} component={ListFormPage} exact />

        <Route path={BASE_URL + "/404"} component={Page404} exact />
        <Redirect to={BASE_URL + "/404"} />
        <Redirect to={BASE_URL} exact />
      </Switch>
    );
  }
}

export default AppRouter;
