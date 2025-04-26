import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import Home from './page';
import store from './store';
ReactDOM.render(
      <Router>
        <Provider store={store}>
          <Home />
        </Provider>
      </Router>,
  document.getElementById('root')
);