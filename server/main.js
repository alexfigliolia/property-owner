import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import './PublishData';
import { Properties, Issues, Payments, Conversations, Messages, GroupAccounts } from '../api/collections.js';

Meteor.methods({

  'groupAccount.create'(){
    return GroupAccounts.insert({
      owner: Meteor.userId(),
      group: Meteor.user().name,
      password: "",
      managerIds: []
    });
  },

  'groupConvo.create'(){
    return Conversations.insert({
      owners: [ Meteor.userId() ],
      type: 'group'
    });
  },

  'properties.create'(name, manager, color1, color2){
    check(name, String);
    check(manager, String);
    check(color1, String);
    check(color2, String);
    const groups = GroupAccounts.find({owner: Meteor.userId()}).fetch();
    return Properties.insert({
      property: name,
      manager: manager,
      monthRentExpected: 0,
      mortgageMonthly: 0,
      new: true,
      color: color1,
      color2: color2,
      owner: Meteor.userId(),
      group: groups[0]._id
    });
  },

  'properties.update'( id, expectedRent, mortgage ){
    check(id, String);
    check(expectedRent, Number);
    check(mortgage, Number);
    return Properties.update({_id: id}, {
      $set: {
        monthRentExpected: expectedRent,
        mortgageMonthly: mortgage,
        new: false
      }
    });
  },

  'properties.edit'(id, name, manager, rent) {
    check(id, String);
    check(name, String);
    check(manager, String);
    check(rent, Number);
    return Properties.update({ _id: id }, {
      $set: {
        property: name,
        manager: manager,
        monthRentExpected: rent
      }
    });
  },

  'issues.create'(id, prop, obj){
    check(id, String);
    check(prop, String);
    check(obj, Object);
    return Issues.insert({
      propId: id,
      property: prop,
      issue: obj.issue,
      date: new Date(),
      images: obj.images,
      postedBy: Meteor.user().name,
      solved: obj.solved,
      solution: {
        completed: obj.solution.completed,
        description: obj.solution.description,
        products: obj.solution.products,
        budget: obj.solution.budget,
        spent: obj.solution.spent,
        postedBy: Meteor.user().name
      }
    });
  },

  'issue.delete'(id) {
    check(id, String);
    return Issues.remove({_id: id});
  },

  'payments.create'(id, amount) {
    check(id, String);
    check(amount, Number);
    return Payments.insert({
      propId: id, 
      payment: amount, 
      date: new Date()
    });
  },

  'groupAccount.setPassword'(pw){
    check(pw, String);
    return GroupAccounts.update({ owner: Meteor.userId() }, {
      $set: { password: pw }
    });
  },

  'groupAccount.inviteManager'(guy) {
    check(guy, String);
    return GroupAccounts.update({ owner: Meteor.userId() }, {
      $push: { managerNames: guy }
    });
  },

  'groupAccounts.removeManager'(guy) {
    check(guy, String);
    return GroupAccounts.update({ owner: Meteor.userId() }, {
      $pull: { managerNames: guy}
    })
  },

  'messages.send'(sentFrom, to, text, convoId) {
    check(sentFrom, Object);
    check(to, Object);
    check(text, String);
    check(convoId, String);
    let sentTo;
    if('name' in to) {
      sentTo = to;
    } else {
      sentTo = 'group'
    }
    return Messages.insert({
      from: sentFrom,
      to: sentTo,
      text: text,
      date: new Date(),
      conversation: convoId
    })
  },

  // 'convo.create'(id) {
  //   check(id, String);
  //   const them = Meteor.users.findOne({_id: id}, { _id: 1, name: 1, image: 1});
  //   const exists = Conversations.find({ owners: {$all: [them._id, Meteor.userId()]} }).fetch();
  //   if(exists.length === 0) {
  //     return Conversations.insert({
  //       owners: [them._id, Meteor.userId()]
  //     });
  //   }
  // },

});