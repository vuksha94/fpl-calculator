import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import 'jquery/dist/jquery.js';

import { HashRouter, Switch, Route } from "react-router-dom";


import * as serviceWorker from "./serviceWorker";
import { FPLCalculator } from "./FPLCalculator/FPLCalculator";
import {LoginComponent} from "./FPLCalculator/LogInComponent";
import { isLoggedIn } from "./api/api";
import LogOut from "./FPLCalculator/LogOutComponent";

interface AppState {
    userLoggedIn: boolean;
  }
  
  class App extends React.Component {
  
    state: AppState;
  
    constructor(props: Readonly<{}>) {
      super(props);
      this.state = {
        userLoggedIn: isLoggedIn()
      };
      this.isLoggedIn = this.isLoggedIn.bind(this);
    }

    isLoggedIn(loggedIn: boolean) {
      console.log("is Logged In: " + loggedIn);
      this.setState({
        userLoggedIn: loggedIn
      });
    }


    render() {
      return (
        <React.StrictMode>
          <HashRouter>
            <Switch>
              <Route
                exact path="/"
                render={() => (
                  <FPLCalculator userLoggedIn={this.state.userLoggedIn} />
                )}
              />
  
              <Route
                path="/login"
                render={() => (
                  <LoginComponent isLoggedInFunc={this.isLoggedIn} />
                )}
              />
              <Route path="/logout" component={LogOut}></Route>
            </Switch>
          </HashRouter>
        </React.StrictMode >
      )
    }
  }
  const app = <App />;

ReactDOM.render(app, document.getElementById("root"));

serviceWorker.unregister();
