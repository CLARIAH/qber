var React = require('react');
var QBer = require('./components/QBer.react');
var QBerAPI = require('./utils/QBerAPI');


// TODO: Integrate a browse modal using react-bootstrap
QBerAPI.retrieveDataset('derived/utrecht_1829_clean_01.csv');

React.render(
  <QBer />,
  document.getElementById('qber')
);
