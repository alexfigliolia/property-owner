import { Mongo } from 'meteor/mongo';
 
export const Conversations = new Mongo.Collection('conversations');
export const GroupAccounts = new Mongo.Collection('groupAccounts');
export const Messages = new Mongo.Collection('messages');
export const Properties = new Mongo.Collection('properties');
export const Issues = new Mongo.Collection('issues');
export const Payments = new Mongo.Collection('payments');