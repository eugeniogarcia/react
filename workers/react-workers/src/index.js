import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Form from './Form';
import App from './App';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(
  <React.StrictMode>
    <Form />
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();