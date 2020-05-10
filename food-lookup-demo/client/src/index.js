import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import "./semantic/dist/semantic.min.css";

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <App />,
  document.getElementById("root") // eslint-disable-line no-undef
);

serviceWorker.register();