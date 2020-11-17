import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import 'jquery/dist/jquery.js';

import * as serviceWorker from "./serviceWorker";
import { FPLCalculator } from "./FPLCalculator/FPLCalculator";

//ReactDOM.render(<FPLSearch />, document.getElementById("root"));
ReactDOM.render(<FPLCalculator />, document.getElementById("root"));

serviceWorker.unregister();
