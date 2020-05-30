import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

//Optional
import * as serviceWorker from './serviceWorker';
//Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(<App />, document.getElementById('root'));

//Optional
serviceWorker.unregister();
