import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

var wrapper = document.getElementById('leadform-wrapper');
var widget_id = wrapper.getAttribute('data-widget-id');


ReactDOM.render(
  <App widgetId={widget_id} />,
  document.getElementById('leadform-wrapper')
);

