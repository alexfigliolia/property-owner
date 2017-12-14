import React, { Component } from 'react';

export default class Manager extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		classes: "manager"
  	}
  }

  componentDidMount = () => {
    setTimeout(() => {
      this.setState({ classes: "manager manager-show" });
    }, 1000);
  }

  componentWillUnmount = () => {
    this.setState({ classes: "manager" });
  }

  deleteManager = () => {
    this.setState({ classes: 'manager manager-show manager-loading'});
    Meteor.call('groupAccounts.removeManager', this.props.name, (err, res) => {
      if(err) {
        console.log(err);
      } else {
        this.setState({ classes: "manager manager-show" });
      }
    });
  }

  render = () => {
    return (
    	<div className={this.state.classes}>
				<h3>{this.props.name}</h3>
				<button
          onClick={this.deleteManager}>
					<img className="x" src="close.svg" alt="delete manager" />
					<img className="ml" src="loader.gif" alt="loading" />
				</button>
			</div>
    );
  }
}

