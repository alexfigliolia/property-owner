import React, { Component } from 'react';

export default class PostSolution extends Component {
	constructor(props) {
  	super(props);
  	this.state = {
  		solution: '',
  		products: '',
  		checked: false
  	}
  }

  handleCheck = (e) => this.setState({ checked: e.target.dataset.answer });

  render = () => {
    return (
    	<section className={this.props.classes}>
    		<div>
    			<h2><div></div>Post Solution:</h2>
    			<p>Issue you just clicked on</p>
    			<div>
    				<label htmlFor="dos">Description of solution:</label>
    				<textarea
    					onChange={(e) => this.setState({solution: e.target.value})}
    					id='dos' 
    					placeholder="Ex: Call Joe's Plumbing service and get a quote"
    					value={this.state.solution}></textarea>
    			</div>
    			<div>
    				<label htmlFor="pr">Products required:</label>
    				<textarea
    					onChange={(e) => this.setState({products: e.target.value})}
    					id='pr' 
    					placeholder="Ex: Kholer Toilet"
    					value={this.state.products}></textarea>
    			</div>
    			<div>
    				<fieldset>Will this solution require spending?</fieldset>
            <div className="checkboxes">
              <label>Yes</label>
              <input 
              	type="checkbox" 
              	checked={this.state.checked} 
              	onChange={(e) => this.setState({ checked: true })} />
              <label>No</label>
              <input 
              	type="checkbox" 
              	checked={!this.state.checked} 
              	onChange={(e) => this.setState({ checked: false })} />
            </div>
    			</div>
    			<button
    				onClick={this.postSolution}>Post Solution</button>
    		</div>
    	</section>
    );
  }
}
