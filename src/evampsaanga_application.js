/*!
 **********************************************************************
 
 **********************************************************************
 */

import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import IdleTimer from "react-idle-timer";
import AppRouter from './evampsaanga_commonFiles/appRouter';
import { GetText } from './evampsaanga_jsFiles/getText';
import Texts from './evampsaanga_appConfigurations/textCollection.json';
import { lsName, BASE_URL, sessionTimeOut } from "./evampsaanga_appConfigurations/configuration";
import { ToastContainer, toast } from "react-toastify";
import { clearLocalStorage, getLocalStorage, setLocalStorage } from './evampsaanga_jsFiles/localStorage';
import checkLoginStatus from "./evampsaanga_services/checkLoginStatus";


import 'react-toastify/dist/ReactToastify.css';
// Adding SCSS file directly (node-sass is installed)
import './evampsaanga_stylesheets/scss/style.scss';
import './evampsaanga_formbuilder/formbuilder.scss';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.idleTimer = null;
    this.onAction = this._onAction.bind(this);
    this.onActive = this._onActive.bind(this);
    this.onIdle = this._onIdle.bind(this);
  }
  _isMounted = true;
  state = {
    checkActivity: true,
    redirect: false
  };

  componentDidMount() {
    this.checkLastActiveTime();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // Check Last activity time (used for logout in-case of no activity)
  checkLastActiveTime = () => {
    let timeNow = new Date().getTime();
    let lastActiveTime = new Date(getLocalStorage('lastActiveTime')).getTime();
    let timeDiff = Math.floor((timeNow - lastActiveTime) / 1000);
    if (checkLoginStatus()) {
      if (timeDiff >= sessionTimeOut) {
        clearLocalStorage();
      }
    }
  }

  // Reset Activity Time
  _onAction = (e) => {
    // console.log("user did something", e);
    setLocalStorage('lastActiveTime', new Date()); // get current time and update time in session
  }

  _onActive = (e) => {
    console.log("user is active", e);
    console.log("time remaining", this.idleTimer.getRemainingTime());
  }

  // Actions after logout in-case of no activity
  _onIdle = (e) => {
    // add functionality of isLoggedIn variable after implementing login via API
    if (checkLoginStatus()) {
      // Logout API here
      clearLocalStorage(); // clear all except language
      let sessionExpired = GetText(Texts.sessionExpired);
      // alert(sessionExpired);
      toast.info(sessionExpired[0]);
      this.setState({ redirect: true, checkActivity: false }, () => {
        this.setState({ redirect: false, checkActivity: true })
      });
    }
    console.log("user is idle", e);
    console.log("last active", new Date(this.idleTimer.getLastActiveTime()));
  }

  render() {

    // setting variable globally
    (!localStorage.getItem(lsName)) && localStorage.setItem(lsName, "");

    // Setting variable for last active time
    if (getLocalStorage('lastActiveTime') === null || getLocalStorage('lastActiveTime') === '') {
      setLocalStorage('lastActiveTime', new Date());
    }

    // Setting Language if not set
    if (localStorage.getItem("language") === "2") {
      localStorage.setItem("language", "2");
      document.body.classList.add("rtl");
      document.body.classList.remove("ltr");
      // require("./stylesheets/urdu.css"); // add language stylesheet
    } else {
      localStorage.setItem("language", "1");
      document.body.classList.add("ltr");
      document.body.classList.remove("rtl");
    }

    const timeout = sessionTimeOut * 1000; // Converting Seconds into Miliseconds

    const { checkActivity, redirect } = this.state;
    // console.log('Activity:', checkActivity);
    // console.log('Redirect:', redirect);
    // console.log('LocalStorage: ', getLocalStorage());
    return (
      <div className="siteWrapper">
        <ToastContainer />
        {checkActivity &&
          <IdleTimer
            ref={ref => {
              this.idleTimer = ref;
            }}
            element={document}
            onAction={this._onAction}
            onActive={this._onActive}
            onIdle={this._onIdle}
            timeout={timeout}
          // debounce={250}
          />
        }
        {redirect && <Redirect to={BASE_URL} />}
        {/* App will be here */}
        <AppRouter />
      </div>
    );
  }
}