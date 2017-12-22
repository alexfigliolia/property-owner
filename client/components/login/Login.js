import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { validateEmail, validatePassword, validateName } from '../../../helpers/helpers';

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newUser: false,
			loginErrors: "",
			height: window.innerHeight,
			buttonClasses: ""
		}
	}

	newUser = () => {
		if(!this.state.newUser) {
			this.setState({ newUser: true, loginErrors: "" });
		} else {
			this.setState({ newUser: false, loginErrors: "" });
			this.refs.name.value = "";
			this.refs.name.placeholder = "Full Name";
		}
		this.refs.email.value = "";
		this.refs.password.value = "";
		this.refs.email.placeholder = "Email";
		this.refs.password.placeholder = "Password";
	}

	validateLogin = (e) => {
		this.setState({buttonClasses: 'button-loading'});
		const email = this.handleEmail();
		const password = this.handlePassword();
		if(!this.state.newUser) {
			if(email && password) this.login(email, password);
		} else {
			const name = this.handleName();
			if(email && password && name) this.signUp(name, email, password);
		}
	}

	handleEmail = () => {
		if (validateEmail(this.refs.email.value)) {
			return this.refs.email.value;
		} else {
			this.refs.email.placeholder = "Email must be valid";
			this.refs.email.value = "";
			this.setState({buttonClasses: ''});
			return false;
		}
	}

	handlePassword = () => {
		if(!validatePassword(this.refs.password.value)) {
			this.refs.password.placeholder = "Must be 4 or more letters";
			this.refs.password.value = "";
			this.setState({buttonClasses: ''});
			return false;
		} else {
			return this.refs.password.value;
		}
	}

	handleName = () => {
		if(validateName(this.refs.name.value)){
			return this.refs.name.value;
		} else {
			this.refs.name.placeholder = "Full name required";
			this.refs.name.value = "";
			this.setState({buttonClasses: ''});
			return false;
		}
	}

	login = (e, p) => {
    const email = e.toLowerCase();
    Meteor.loginWithPassword(email, p, (err) => {
      if(err){
        // console.log(err.reason);
        this.setState({ buttonClasses: '', loginErrors: err.reason });
      } else {
        if(Meteor.user().roll === 'manager') {
        	this.setState({
        		loginErrors: 'This software is for property owners!',
        		buttonClasses: ''
        	}, () => {
        		Meteor.logout();
        	});
        } else {
        	this.setState({
	          loginErrors: "",
	          buttonClasses: 'button-loading good-to-go'
	        }, () => {
	        	this.resetState();
        	});
        	document.body.scrollTop = 0;
        }
      }
    });
  }

  signUp = (n, e, p) => {
    Accounts.createUser({name: n, email: e.toLowerCase(), password: p}, (err) => {
      if(err){
        // console.log(err.reason);
        this.setState({buttonClasses: '', loginErrors: err.reason});
      } else {
        // console.log('creating new user');
        Meteor.loginWithPassword(e, p, (err) => {
          if(err) {
            // console.log(err.reason);
            this.setState({ loginErrors: err.reason, buttonClasses: '' });
          } else {
            // console.log('logging in new user');
            this.setState({ loginErrors: '', buttonClasses: 'button-loading good-to-go' });
            Meteor.call('groupAccount.create', (error, result) => {
              if(error) {
                // console.log(error);
              } else {
                Meteor.call('groupConvo.create', 'Group Chat', (error, result) => {
                  document.body.scrollTop = 0;
                  this.resetState();
                });
              }
            });
          }
        });
      }
    });
  }

  resetState = () => {
  	setTimeout(() => {
  		this.setState({
  			buttonClasses: '',
  			newUser: false
  		});
  		this.refs.email.value = "";
			this.refs.password.value = "";
			this.refs.email.placeholder = "Email";
			this.refs.password.placeholder = "Password";
  	}, 1500)
  }

	render = () => {
		return (
			<div 
				className={this.props.classes} 
				id="login" 
				style={{height: this.state.height}}>
				<div>
					<h1>
						{
							'REACT'.split('').map((char, i) => <div key={i}>{char}</div>)
						}
					</h1>
					<div className='login-forms'>
						{
							this.state.loginErrors !== "" &&
							<h2>{this.state.loginErrors}</h2>
						}
						{
							this.state.newUser &&
							<div className="input">
								<input ref="name" type="text" name="name" placeholder="Full Name" />
								<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
								    <path className="stroke-me" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
								    <path d="M0 0h24v24H0z" fill="none"/>
								</svg>
							</div>
						}
						<div className="input">
							<input ref="email" type="email" name="email" placeholder="Email" />
							<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
							    <path className="stroke-me" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
							    <path d="M0 0h24v24H0z" fill="none"/>
							</svg>
						</div>
						<div className="input">
							<input ref="password" type="password" name="password" placeholder="Password" />
							<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
							    <path d="M0 0h24v24H0z" fill="none"/>
							    <path className="stroke-me" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
							</svg>
						</div>
						<div>
							<button
								className={this.state.buttonClasses} 
								id="signInSignUp" 
								onClick={this.validateLogin}>
								{(this.state.newUser) ? "Sign up" : "Login"}
								<img className="loading-user" src="loader.gif" alt="loading" />
								<img className="loaded-user" src="check.svg" alt="authenticated" />
							</button>
						</div>
					</div>
					<div className="sign-up">
						<h3>{(this.state.newUser)? "Already Signed up?" : "Are you a new user?"}</h3>
						<a onClick={this.newUser}>{(this.state.newUser)? "Login" : "Sign up"}</a>
					</div>
				</div>
			</div>
		);
	}
}	