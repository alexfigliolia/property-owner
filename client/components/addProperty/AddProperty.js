import React, { Component } from 'react';
import { generateColor2 } from '../../../helpers/helpers';

export default class AddProperty extends Component {

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.classes !== this.props.classes) {
      this.refs.propName.placeholder = "Property Name";
    }
  }
	
  addProperty = () => {
    const prop = this.refs.propName;
    const mname = this.refs.managerName;
    if(prop.value !== "") {
      if(mname.value === ""){
        mname.placeholder = "Enter 'none' if no manager";
      } else {
        const color = generateColor2(this.props.properties.length);
        Meteor.call('properties.create', prop.value, mname.value, color[0], color[1], (err, res) => {
          if(err) {
            console.log(err);
          } else {
            prop.value = ""; 
            mname.value = "";
            this.props.togglePropInput();
          }
        })
      }
    } else {
      prop.placeholder = "Enter a property name";
    }
  }

  render = () => {
    return (
    	<div className={this.props.classes}>
        <div>
          <h2>Add New Property</h2>
          <div className="n-p-form">
          	<input ref="propName" type="text" placeholder="Property Name" />
          	<input ref="managerName" type="text" placeholder="Manager Name" />
          	<div className="buttons">
              <button onClick={this.props.togglePropInput}>Cancel</button>
              <button onClick={this.addProperty}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
