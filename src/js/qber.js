var React = require('react');
var QBer = require('./components/QBer.react');
var MessagePanel = require('./components/MessagePanel.react');

var DatasetActions = require('./actions/DatasetActions');

DatasetActions.initializeStore();

React.render(
  <QBer />,
  document.getElementById('qber')
);

React.render(
  <MessagePanel />,
  document.getElementById('message_panel')
);
