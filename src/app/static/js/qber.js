var React = require('react');
var Navbar = require('./components/Navbar.react');
var QBer = require('./components/QBer.react');
var MessagePanel = require('./components/MessagePanel.react');



// TODO: Integrate a browse modal using react-bootstrap
// DatasetActions.retrieveDataset('derived/utrecht_1829_clean_01.csv');

React.render(
  <Navbar />,
  document.getElementById('navbar')
);

React.render(
  <QBer />,
  document.getElementById('qber')
);

React.render(
  <MessagePanel />,
  document.getElementById('message_panel')
);
