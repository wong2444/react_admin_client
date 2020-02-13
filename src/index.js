import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import memoryUtils from './utils/memoryUtils'
import userUtils from './utils/storageUtils'

//讀取local storage中的user保存到內存中
const user = userUtils.getUser()
memoryUtils.user = user

ReactDOM.render(<App/>, document.getElementById('root'));

