import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import 'jquery/dist/jquery.js';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import * as serviceWorker from "./serviceWorker";
import { FPLCalculator } from "./FPLCalculator/FPLCalculator";
import { managerReducer } from "./redux/Manager/ManagerReducer";
import { Store } from "./redux/types";

const store: Store = createStore(managerReducer);
//ReactDOM.render(<FPLSearch />, document.getElementById("root"));
ReactDOM.render(
    <Provider store={store}>
        <FPLCalculator />
    </Provider>,
    document.getElementById("root")
);

serviceWorker.unregister();
