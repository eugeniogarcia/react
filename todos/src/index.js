import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import rootReducer from './reducers'

import devToolsEnhancer from 'remote-redux-devtools';

//const store = createStore(rootReducer)
const store = createStore(rootReducer, devToolsEnhancer());
// or const store = createStore(rootReducer, preloadedState, devToolsEnhancer());

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

