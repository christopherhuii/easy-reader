import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import EasyReader from './easy-reader';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<EasyReader />, document.getElementById('root'));
registerServiceWorker();
