import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import AppContainer from './Container';
 
Meteor.startup(() => {
  render(<AppContainer />, document.getElementById('root'));
});