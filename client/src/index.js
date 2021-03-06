import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './Views/app';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
