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
      if(this.props.conversations.length) {
        this.setState({ conversation: this.props.conversations[0] });
      }
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
      this.setState({ conversation: this.props.conversations[0], currentChat: 'Group', });
    }
    if(nextProps.classes === 'chat chat-show' &&
      nextProps.classes !== this.props.classes) {
      this.removeNoties();
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
  	}, this.removeNoties);
    setTimeout(() => {
      this.refs.messages.scrollTop = this.refs.messages.scrollHeight;
    }, 100); 
  }

  removeNoties = () => {
    if('_id' in this.state.conversation) {
      Meteor.call('user.removeNew', this.state.conversation._id, (err, res) => {
        if(err) console.log(err);
      });
    }
  }

  sendMessage = () => {
  	if(this.state.text !== '') {
  		Meteor.call('messages.send', {_id: Meteor.userId(), name: Meteor.user().name}, {}, this.state.text, this.state.conversation._id, (err, res) => {
	  		if(err) { console.log(err) } else { this.setState({ text: '' }, this.removeNoties) }
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

  getUnread = (id, type) => {
    let num = 0
    if(type === 'group') {
      const convo = this.props.conversations.filter(convo => convo.type === 'group');
      if(convo.length) {
        for(let i = 0; i<this.props.unread.length; i++) {
          if(this.props.unread[i] === convo[0]._id) num++;
        }
      }
    } else {
      const convo = this.props.conversations.filter(convo => convo.type !== 'group' && convo.owners.indexOf(id) !== -1);
      if(convo.length) {
        for(let i = 0; i<this.props.unread.length; i++) {
          if(this.props.unread[i] ===  convo[0]._id) num++
        }
      } 
    }
    return num;
  }

  render = () => {
    return (
    	<section className={this.props.classes}>
    		<div>
    			<header className="chat-header">
    				<div>
    					<button
    						onClick={this.toggleContacts}>
                {
                  this.props.unread.length > 0 &&
                  <div className='indic'>{this.props.unread.length}</div>
                }
              </button>
    					<h3>{this.state.currentChat}</h3>
    					<button
    						onClick={this.props.toggleChat}></button>
    				</div>
    			</header>
    			<div className="messages" ref="messages">
    				<div>
    					{
    						this.state.conversation &&
    						this.props.messages
                .filter(message => message.conversation === this.state.conversation._id)
                .map((message, i) => {
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
              onFocus={this.removeNoties}
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
    						onClick={this.changeChat}
                style={{
                  background: this.getUnread('farts', 'group') > 0 ? '#fff' : 'transparent' 
                }}>
                Group
                {
                  this.getUnread('farts', 'group') > 0 &&
                  <div className='indic'>{this.getUnread('farts', 'group')}</div>
                }
              </div>
    					{
    						this.state.managers.map((guy, i) => {
                  const num = this.getUnread(guy._id, 'private');
    							return (
    								<div 
    									key={i} 
                      data-id={guy._id}
    									data-chat={guy.name}
    									className='manager-contact'
    									onClick={this.changeChat}
                      style={{
                        background: num > 0 ? '#fff' : 'transparent'
                      }}>
    									{guy.name}
                      {
                        num > 0 && num !== '' &&
                        <div className='indic'>{num}</div>
                      }
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
