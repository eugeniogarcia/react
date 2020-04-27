import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import Root from './containers/Root'

import './index.css';
import * as serviceWorker from './serviceWorker';

render(<Root />,document.getElementById('root'));

serviceWorker.unregister();