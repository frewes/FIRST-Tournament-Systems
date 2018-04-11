import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App version="3.0.0a"/>, document.getElementById('root'));
registerServiceWorker();
