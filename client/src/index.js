import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './Views/app';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
