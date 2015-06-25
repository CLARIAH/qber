var React = require('react');
var QBer = require('./components/QBer.react');
var MessagePanel = require('./components/MessagePanel.react');
var DatasetActions = require('./actions/DatasetActions');


// TODO: Integrate a browse modal using react-bootstrap
DatasetActions.retrieveDataset('derived/utrecht_1829_clean_01.csv');

React.render(
  <QBer />,
  document.getElementById('qber')
);

React.render(
  <MessagePanel />,
  document.getElementById('status')
);
