import { Meteor } from 'meteor/meteor';
import { 
  Conversations, 
  GroupAccounts, 
  Messages, 
  Properties, 
  Issues, 
  Payments 
} from '../api/collections.js';
import { withTracker } from 'meteor/react-meteor-data';
import App from './App.js';

export default AppContainer = withTracker(() => {
  const userSub = Meteor.subscribe('userData');
  const id = Meteor.userId();
  const user = Meteor.user();
  const userConversations = Meteor.subscribe('conversations');
  const userGroup = Meteor.subscribe('groupAccounts');
  const userProperties = Meteor.subscribe('properties');
  const propIssues = Meteor.subscribe('issues');
  const propPayments = Meteor.subscribe('payments');
  const userMessages = Meteor.subscribe('messages');
  const convosReady = userConversations.ready();
  const groupReady = userGroup.ready();
  const propertiesReady = userProperties.ready();
  const issuesReady = propIssues.ready();
  const paymentsReady = propPayments.ready()
  const messagesReady = userMessages.ready();
  const properties = Properties.find().fetch();
  const groupAccount = GroupAccounts.find().fetch();
  const conversations = Conversations.find().fetch();
  const issues = Issues.find({}, {sort: {date: 1}}).fetch();
  const payments = Payments.find({}, {sort: {date: 1}}).fetch();
  const messages = Messages.find({}, {sort: {date: 1}}).fetch();
  const propertiesExist = propertiesReady && !!properties;
  const paymentsExist = propPayments && !!payments;
  const issuesExist = issuesReady && !!issues;
  const conversationsExist = convosReady && !!conversations;
  const messagesExists = messagesReady && !!messages;
  const groupExists = groupReady && !!groupAccount;
  return {
    id,
    user,
    convosReady,
    groupReady,
    propertiesReady,
    issuesReady,
    paymentsReady,
    messagesReady,
    userGroup,
    userProperties,
    userConversations,
    propIssues,
    propPayments,
    userMessages,
    propertiesExist,
    paymentsExist,
    issuesExist,
    conversationsExist,
    messagesExists,
    groupExists,
    properties,
    issues,
    payments,
    conversations,
    messages,
    groupAccount
  };
})(App);