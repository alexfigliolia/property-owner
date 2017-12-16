import React, { Component } from 'react';

export default class AddManager extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		text: "",
      classes: "add-manager"
  	}
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.classes === 'managers managers-show') {
      this.setState({text: "", classes: "add-manager"});
    }
  }

  submit = () => {
    const { text } = this.state;
    if(text !== "") {
      this.setState({ classes: 'add-manager add-manager-loading' });
      Meteor.call('groupAccount.inviteManager', text, (err, res) => {
        if(err) {
          // console.log(err);
          this.props.haveAToast('Error:', 'There was a network connection problem. Please try again.');
        } else {
          this.props.haveAToast('Success:', `You added ${text} to your list of invited managers`);
          setTimeout(() => {
            this.setState({ text: "", classes: "add-manager" });
          }, 1000);
        }
      });
    } else {
      this.props.haveAToast('Error:', "The manager's name is required");
    }
  }

  render = () => {
    return (
    	<div className={this.state.classes}>
    		<div>
    			<input 
    				onChange={(e) => this.setState({text: e.target.value})}
    				type="text" 
    				placeholder="Add manager" 
    				value={this.state.text} />
    			<button
            onClick={this.submit}>
    				<img src="person-add.svg" alt="add manager" />
    				<img src="loader.gif" alt="manager loading" />
    			</button>
    		</div>
    	</div>
    );
  }
}
