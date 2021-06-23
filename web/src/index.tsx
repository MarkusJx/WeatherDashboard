import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import reportWebVitals from './js/test/reportWebVitals';
import Webpages from "./js/webpages/Webpages";

ReactDOM.render(
    <React.StrictMode>
        <Webpages/>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
