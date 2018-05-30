import React from 'react';
import ReactDOM from 'react-dom';
import Demo from './Demo';
import './style.scss';

/* eslint-disable react/jsx-filename-extension */
ReactDOM.render(<Demo />, document.getElementById('app'));

module.hot.accept();
