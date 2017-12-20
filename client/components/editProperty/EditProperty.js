import React, { Component } from 'react';

export default class EditProperty extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		name: "",
  		manager: "",
  		expRent: "",
  		classes: "save-btn"
  	}
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.classes === 'edit-property edit-property-show' &&
       nextProps.property !== this.props.property)
    {
      this.refs.editProperty.scrollTop = 0;
      this.setState({name: "", manager: "", expRent: "", classes: "save-btn"});
    }
  }

  save = () => {
  	this.setState({ classes: "save-btn save-complete" });
  	let { name, manager, expRent } = this.state;
  	name = name === "" ? this.props.name : name;
  	manager = manager === "" ? this.props.manager : manager;
  	expRent = expRent === "" ? this.props.expectedRent : parseFloat(expRent);
  	Meteor.call('properties.edit', this.props.id, name, manager, expRent, (err, res) => {
  		if(err) {
  			// console.log(err);
        this.props.haveAToast('Error:', "There is a network connection error. Please try again soon.");
  		} else {
        this.props.haveAToast(`${this.state.name === '' ? this.props.name : this.state.name} Updated:`, 'You successfully edited your property. Most changes should exibit immediately in your graphs');
  			setTimeout(() => {
  				this.props.handleCloser();
  				this.setState({
  					name: "",
			  		manager: "",
			  		expRent: "",
			  		classes: "save-btn"
  				});
  			}, 800);
  		}
  	})
  }

  render = () => {
    return (
    	<section className={this.props.classes} ref="editProperty">
    		<div>
    			<h2>Edit Property</h2>
    			<p>Leave items that you do not wish to change blank</p>
    			<div>
    				<div className="circ">1</div>
    				<h3>Name & Manager</h3>
    				<div className="input">
    					<label>Name:</label>
    					<input
    						onChange={(e) => this.setState({name: e.target.value})} 
    						type="text" 
    						placeholder={this.props.name} 
    						value={this.state.name} />
    				</div>
    				<div className="input">
    					<label>Manager:</label>
    					<input
    						onChange={(e) => this.setState({manager: e.target.value})} 
    						type="text" 
    						placeholder={this.props.manager} 
    						value={this.state.manager} />
    				</div>
    				<div className="circ">2</div>
    				<h3>Changes to Rent</h3>
    				<div className="input">
    					<label>Expected Rent:</label>
    					<input
    						onChange={(e) => this.setState({expRent: e.target.value})} 
    						type="number" 
    						placeholder={this.props.expectedRent} 
    						value={this.state.expRent} />
    				</div>
    			</div>
    			<button
    				className={this.state.classes}
    				onClick={this.save}>Save
    				<img src="check.svg" alt="save complete" />
    			</button>
    		</div>
    	</section> 
    );
  }
}
