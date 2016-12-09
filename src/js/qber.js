var React = require('react');
var ReactDOM = require('react-dom');
var QBer = require('./components/QBer.react');
var MessagePanel = require('./components/MessagePanel.react');

var DatasetActions = require('./actions/DatasetActions');

DatasetActions.initializeStore();

ReactDOM.render(
  <QBer />,
  document.getElementById('qber')
);

ReactDOM.render(
  <MessagePanel />,
  document.getElementById('message_panel')
);
