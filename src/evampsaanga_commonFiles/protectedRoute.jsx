/*!
 **********************************************************************
 
 **********************************************************************
 */

import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { BASE_URL } from '../evampsaanga_appConfigurations/configuration';
// import auth from '../services/login';
// import checkLoginStatus from "../services/checkLoginStatus";

import Header from './header';
import { allowUrl } from './../evampsaanga_jsFiles/roleReader';
// import { getLocalStorage } from "../evampsaanga_jsFiles/localStorage";
// import Footer from "./footer";

class ProtectedRoute extends Component {
  constructor(props) {
    super(props);
    this.mounted = true;
  }
  state = {
    isLoading: true,
    isLoggedIn: false
  };
  async componentDidMount() {

    // const useCaseList = getLocalStorage('useCaseList');
    // console.log(useCaseList);

    // // When auth implemented, remove Line below and uncomment this block
    this.setState({ isLoading: false, isLoggedIn: true }); // this should be removed after auth implementation
    // try {
    //   const data = await auth.checkLogin();
    //   if (this.mounted) {
    //     if (data && data.resCode === 200) {
    //       this.setState({ isLoading: false, isLoggedIn: true });
    //     } else {
    //       this.setState({ isLoading: false, isLoggedIn: false });
    //     }
    //   }
    // } catch (er) { console.log(er.message); }
  }
  // async componentDidMount() {
  //   let user = await checkLoginStatus();
  //   if (this.mounted) {
  //     if (user) {
  //       this.setState({ isLoading: false, isLoggedIn: true });
  //     } else {
  //       this.setState({ isLoading: false, isLoggedIn: false });
  //     }
  //   }
  // }
  componentDidUpdate(prevProps, prevState) {
    window.scrollTo(0, 0); // scroll to top
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  render() {
    const { path, component, exact } = this.props;
    const { isLoggedIn } = this.state;
    return this.state.isLoading ? null : isLoggedIn ? (allowUrl(path, isLoggedIn) ?
      <React.Fragment>
        <Header />
        <div className="container-fluid py-40">
          <Route path={path} component={component} exact={exact} />
        </div>
      </React.Fragment> : <Redirect to={BASE_URL + "/404"} exact />
    ) : (
        <Redirect to={BASE_URL + "/login"} exact />
      );
  }
}

export default ProtectedRoute;
