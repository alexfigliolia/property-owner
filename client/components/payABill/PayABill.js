import React, { Component } from 'react';

export default class PayABill extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		number: '',
      text: '',
  		classes: 'pb-button'
  	}
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.classes === 'pay-bill pay-bill-show' &&
       nextProps.property !== this.props.property)
    {
      this.refs.payABill.scrollTop = 0;
      this.setState({number: '', text: '', classes: 'pb-button'});
    }
  }

  submit = () => {
  	if(this.state.number !== '' && this.state.text !== '') {
  		this.setState({ classes: 'pb-button pb-complete' });
      const bill = {
        propId: this.props.property._id,
        property: this.props.property.property,
        issue: this.state.text,
        date: new Date(),
        images: [],
        postedBy: Meteor.user().name,
        solved: true,
        solution: {
          completed: true,
          description: this.state.text,
          products: this.state.text,
          budget: this.state.number,
          spent: this.state.number,
          postedBy: Meteor.user().name
        }
      }
  		Meteor.call('issues.create', this.props.property._id, this.props.property.property, bill, (err, res) => {
  			if(err) {
  				// console.log(err);
          this.props.haveAToast('Error:', 'Please check your inputs and try again.');
  			} else {
          this.props.haveAToast(`${this.props.property.property}:`, `You paid the "${bill.issue}" bill!`)
  				setTimeout(() => {
  					this.setState({ classes: 'pb-button', number: '', text: '' }, this.props.handleCloser);
  				}, 800)
  			}
  		});
  	} else {
      this.props.haveAToast('Error:', 'The name of the bill and the amount are required');
    }
  }

  render = () => {
    return (
    	<section className={this.props.classes} ref="payABill">
    		<div>
    			<h2>Pay a bill:</h2>
          <p>Use this for fixed expenses such as your mortgage or utility bills</p>
    			<div className="input">
    				<label>Expense:</label>
            <input 
              value={this.state.text}
              onChange={(e) => this.setState({text: e.target.value})}
              type="text"
              placeholder="Ex: Electricity Company" />
    				<input 
              value={this.state.number}
    					onChange={(e) => this.setState({number: e.target.value})}
    					type="number"
    					placeholder="Dollar amount" />
    			</div>
    			<button onClick={this.submit} className={this.state.classes}>
    				Pay a Bill
    				<img src="check.svg" alt="payed a bill" />
    			</button>
    		</div>
    	</section>
    );
  }
}
