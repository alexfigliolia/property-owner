import React, { Component } from 'react';

export default class ManagerPassword extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		text: "",
      classes: "add-manager manager-password"
  	}
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.classes === 'managers managers-show') {
      this.setState({text: "", classes: "add-manager manager-password"});
    }
  }

  submit = () => {
    const { text } = this.state;
    if(text !== '') {
      this.setState({ classes: 'add-manager manager-password manager-password-loading' });
      Meteor.call('groupAccount.setPassword', text, (err, res) => {
        if(err) {
          // console.log(err);
          this.props.haveAToast('Error:', 'There was a network connection problem. Please try again.');
        } else {
          this.props.haveAToast('Success:', 'You set the password for your managers. Make sure to give it to them to use when they are signing up for REACT for managers');
          this.onSuccess();
        }
      });
    } else {
      this.props.haveAToast('Error:', 'A new password is required in order to update the current one.');
    }
  }

  onSuccess = () => {
    setTimeout(() => {
     this.setState({ classes: 'add-manager manager-password manager-password-complete' });
    }, 1000);
    setTimeout(() => {
     this.setState({ classes: "add-manager manager-password", text: "" });
    }, 2000);
  }

  render = () => {
    return (
    	<div className={this.state.classes}>
    		<div>
          <h3>Set Manager Password</h3>
    			<input 
    				onChange={(e) => this.setState({text: e.target.value})}
    				type="text" 
    				placeholder={this.props.code === "" ? 'Manager password' : this.props.code} 
    				value={this.state.text} />
    			<button
            onClick={this.submit}>
    				<img src="edit-white.svg" alt="edit password" />
    				<img src="loader.gif" alt="password loading" />
            <img src="check.svg" alt="password added" />
    			</button>
    		</div>
    	</div>
    );
  }
}