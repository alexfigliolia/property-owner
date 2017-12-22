import React, { Component } from 'react';

export default class Chat extends Component {
  constructor(props) {
  	super(props);
  	this.state = { 
  		contactsClasses: "m-list",
  		currentChat: 'Group',
  		text: '',
  		conversation: this.props.conversations[0],
  		senderClasses: 's-button',
      managers: []
  	}
  }

  componentDidMount = () => {
  	setTimeout(() => {
  		this.setState({ conversation: this.props.conversations[0] });
  		setTimeout(() => {
	  		this.refs.messages.scrollTop = this.refs.messages.scrollHeight;
	  	}, 200);
  	}, 300);
  }

  componentWillReceiveProps = (nextProps) => {
  	setTimeout(() => {
  		this.refs.messages.scrollTop = this.refs.messages.scrollHeight;
  	}, 100);
    if(this.props.conversatons !== nextProps.conversations) {
      this.getGroup(nextProps.conversations);
    }
  }

  getGroup = (convos) => {
    const peops = [];
    convos.forEach(convo => {
      convo.owners.forEach(dude => {
        if(peops.indexOf(dude) === -1 && dude !== Meteor.userId()) {
          peops.push(dude);
        }
      });
    });
    Meteor.call('users.get', peops, (err, res) => {
      if(err) {
        console.log(err);
      } else {
        this.setState({ managers: res });
      }
    })
  }

  toggleContacts = () => {
  	this.setState(prevState => {
  		const ns = prevState.contactsClasses === 'm-list' ? 'm-list m-list-show' : 'm-list';
  		return { contactsClasses: ns }
  	});
  }

  changeChat = (e) => {
  	const cc = e.target.dataset.chat;
    const id = e.target.dataset.id;
  	let conversation;
  	if(cc === 'Group') {
  		conversation = this.props.conversations.filter(convo => convo.type === 'group');
  	} else {
  		conversation = this.props.conversations.filter(convo => {
  			return convo.type !== 'group' && 
  						 convo.owners.indexOf(Meteor.userId()) !== -1 &&
  						 convo.owners.indexOf(id) !== -1
  		});
  	}
  	this.setState({
  		currentChat: cc,
  		contactsClasses: 'm-list',
  		conversation: conversation[0]
  	});
    setTimeout(() => {
      this.refs.messages.scrollTop = this.refs.messages.scrollHeight;
    }, 100);
  }

  sendMessage = () => {
  	if(this.state.text !== '') {
  		Meteor.call('messages.send', Meteor.user(), {}, this.state.text, this.state.conversation._id, (err, res) => {
	  		if(err) { console.log(err) } else { this.setState({ text: '' }) }
	  	});
	  	this.fly();
  	}
  }

  fly = () => {
  	this.setState({senderClasses: 's-button fly1'});
  	setTimeout(() => {
  		this.setState({senderClasses: 's-button fly1 fly2'});
  	}, 300);
  	setTimeout(() => {
  		this.setState({senderClasses: 's-button fly1 fly2 fly3'});
  	}, 350);
  	setTimeout(() => {
  		this.setState({senderClasses: 's-button'});
  	}, 650);
  }

  render = () => {
    return (
    	<section className={this.props.classes}>
    		<div>
    			<header className="chat-header">
    				<div>
    					<button
    						onClick={this.toggleContacts}></button>
    					<h3>{this.state.currentChat}</h3>
    					<button
    						onClick={this.props.toggleChat}></button>
    				</div>
    			</header>
    			<div className="messages" ref="messages">
    				<div>
    					{
    						this.state.conversation &&
    						this.props.messages.filter(message => {
    							return message.conversation === this.state.conversation._id
    						}).map((message, i) => {
                  if(this.state.currentChat === 'Group') {
                    return(
                      <div 
                        key={i} 
                        className={message.from._id === Meteor.userId() ? "message mine" : "message"}>
                        {message.from.name}:<br/>{message.text}
                      </div>
                    );
                  } else {
                    return(
                      <div 
                        key={i} 
                        className={message.from._id === Meteor.userId() ? "message mine" : "message"}>
                        { message.text }
                      </div>
                    );
                  }
    						})
    					}
    				</div>
    			</div>
    			<div className="sender">
    				<textarea
    					onChange={(e) => {this.setState({ text: e.target.value})}} 
    					placeholder="Message"
    					value={this.state.text}></textarea>
    				<button onClick={this.sendMessage} className={this.state.senderClasses}>
    					<img src="send.svg" alt="send message" />
    				</button>
    			</div>
    			<div className={this.state.contactsClasses}>
    				<div>
    					<div className="contact-list-header">Contacts</div>
    					<div
    						data-chat='Group' 
    						className='manager-contact'
    						onClick={this.changeChat}>Group</div>
    					{
    						this.state.managers.map((guy, i) => {
    							return (
    								<div 
    									key={i} 
                      data-id={guy._id}
    									data-chat={guy.name}
    									className='manager-contact'
    									onClick={this.changeChat}>
    									{guy.name}
    								</div>
    							);
    						})
    					}
    				</div>
    			</div>
    		</div>
    	</section> 
    );
  }
}
