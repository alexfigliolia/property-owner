import React, { Component } from 'react';

export default class CollectRent extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		number: '',
  		classes: 'cr-button'
  	}
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.classes === 'collect-rent collect-rent-show' &&
       nextProps.property !== this.props.property)
    {
      this.setState({number: '', classes: 'cr-button'});
    }
  }

  submit = () => {
  	if(this.state.number !== '') {
  		this.setState({ classes: 'cr-button cr-complete' });
  		Meteor.call('payments.create', this.props.property._id, parseFloat(this.state.number), (err, res) => {
  			if(err) {
  				console.log(err);
  			} else {
  				setTimeout(() => {
  					this.setState({ classes: 'cr-button', number: '' }, this.props.handleCloser);
  				}, 800)
  			}
  		});
  	}
  }

  render = () => {
    return (
    	<section className={this.props.classes}>
    		<div>
    			<h2>Collect Rent</h2>
    			<div className="input">
    				<label>Total payment amount</label>
    				<input 
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
