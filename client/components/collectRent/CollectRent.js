import React, { Component } from 'react';
import { commafy } from '../../../helpers/helpers';

export default class CollectRent extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		number: '',
      label: '',
  		classes: 'cr-button'
  	}
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.classes === 'collect-rent collect-rent-show' &&
       nextProps.property.property !== this.props.property.property)
    {
      this.setState({number: '', classes: 'cr-button'});
    }
  }

  submit = () => {
    const { number, label } = this.state;
    const payer = label === '' || label === ' ' ? 'Tenant' : label;
  	if( number !== '' && !isNaN(parseFloat(number)) ) {
  		this.setState({ classes: 'cr-button cr-complete' });
  		Meteor.call('payments.create', this.props.property._id, parseFloat(number), payer, (err, res) => {
  			if(err) {
  				// console.log(err);
          this.props.haveAToast('Error:', "Please check your inputs and try again.");
  			} else {
          this.props.haveAToast(`${this.props.property.property}:`, `You collected $${commafy(parseFloat(this.state.number))} from your tenant`);
  				setTimeout(() => {
  					this.setState({ classes: 'cr-button', number: '', label: '' }, this.props.handleCloser);
  				}, 800)
  			}
  		});
  	} else {
      this.props.haveAToast('Error:', "The dollar amount is required");
    }
  }

  render = () => {
    return (
    	<section className={this.props.classes}>
    		<div>
    			<h2>Collect Rent</h2>
          <div className="input">
            <label>Label</label>
            <input
              value={this.state.label} 
              onChange={(e) => this.setState({label: e.target.value})}
              type="text"
              placeholder="Ex: Tenant's name or Unit #" />
          </div>
    			<div className="input">
    				<label>Total payment amount</label>
    				<input
              value={this.state.number} 
    					onChange={(e) => this.setState({number: e.target.value})}
    					type="number"
    					placeholder="Dollar amount" />
    			</div>
    			<button onClick={this.submit} className={this.state.classes}>
    				Collect Rent
    				<img src="check.svg" alt="collected rent" />
    			</button>
    		</div>
    	</section>
    );
  }
}
