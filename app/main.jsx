'use strict';

import React from 'react';
import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import ReactDOM from 'react-dom';
import { createHashHistory } from 'history';
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });


import Main from './views/Main';
import ActivityPage from './views/activity';

var routes = (
  <Router history={appHistory}>
      <Route component={Main} name="main" path="/" >
          <IndexRoute component={ActivityPage} />
      </Route>
  </Router>
);

ReactDOM.render(routes, document.getElementById('app-root'));
