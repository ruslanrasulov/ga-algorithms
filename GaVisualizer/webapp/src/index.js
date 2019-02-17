import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './components/app';
import configureStore from './store/configureStore';

const store = configureStore();

const Root = 
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>

ReactDOM.render(
    Root,
    document.getElementById('root'));