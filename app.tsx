declare var require: any

import 'jquery/dist/jquery.js';
import 'popper.js/dist/umd/popper.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

require('./styles/main.css')
require('utf8')

var React = require('react');
var ReactDOM = require('react-dom');
var BrowserRouter = require('react-router-dom').BrowserRouter;
var Provider = require('react-redux').Provider;
var Dashboard = require('./components/Dashboard/Dashboard').default;
var Store = require('./Conf/store').default;

const app = (
    <Provider store={Store}>
        <BrowserRouter>
            <Dashboard />
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));