import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'react-redux'
import store from './redux/store'


//讀取local storage中的user保存到內存中


ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('root'));

