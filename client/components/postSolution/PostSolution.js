import React, { Component } from 'react';

export default class PostSolution extends Component {
	constructor(props) {
  	super(props);
  	this.state = {
  		solution: '',
  		products: '',
  		checked: false,
      budget: '',
      classes: 'ps-button'
  	}
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.issue[0]) {
      if(nextProps.issue[0] !== this.props.issue[0]) {
        this.setState({
          solution: nextProps.issue[0].solution.description,
          products: nextProps.issue[0].solution.products,
          checked: nextProps.issue[0].solution.budget > 0 ? true : false,
          budget: nextProps.issue[0].solution.budget,
          classes: 'ps-button'
        });
      }
    }
  }

  handleCheck = (e) => this.setState({ checked: e.target.dataset.answer });

  postSolution = () => {
    this.setState({ classes: 'ps-button ps-button-loading' });
    const { solution, products, checked, budget } = this.state;
    const bValue = checked ? parseFloat(budget) : 0;
    if(solution !== '') {
      const obj = {
        completed: false,
        description: solution,
        products: products,
        budget: bValue
      }
      Meteor.call('issue.postSolution', this.props.id, obj, (err, res) => {
        if(err) {
          console.log(err);
          this.handleSubmitReset({ classes: 'ps-button ps-button-error' });
          this.props.haveAToast('Error:', 'Please check your inputs and try again.');
        } else {
          this.handleSubmitReset({ classes: 'ps-button ps-button-good' }, this.props.handleCloser);
          this.props.haveAToast('Solved:', `You posted a solution for the "${this.props.issue[0].issue}" service item`);
        }
      });
    } else {
      this.handleSubmitReset({ classes: 'ps-button ps-button-error' });
      this.props.haveAToast('Error:', 'Please check your inputs and try again.');
    }
  }

  handleSubmitReset = (obj, cb) => {
    this.setState(obj);
    setTimeout(() => { 
      this.setState({ classes: 'ps-button' }, () => {
        if(cb) cb(); 
      });
    }, 1000);
  }

  render = () => {
    return (
    	<section className={this.props.classes} ref="postSolution">
    		<div>
    			<h2><div></div>Post Solution:</h2>
    			<p>{this.props.issue.length > 0 ? this.props.issue[0].issue : ""}</p>
    			<div>
    				<label htmlFor="dos">Description of solution:</label>
    				<textarea
    					onChange={(e) => this.setState({solution: e.target.value})}
    					id='dos' 
    					placeholder="Ex: Call Joe's Plumbing service and get a quote - this field is required"
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
          {
            this.state.checked &&
            <div>
              <label>Set a budget:</label>
              <input
                type="number"
                placeholder="Dollar amount"
                value={this.state.budget}
                onChange={(e) => this.setState({budget: e.target.value})} />
            </div>
          }
    			<button
            className={this.state.classes}
    				onClick={this.postSolution}>
              Post Solution
              <img src="loader.gif" alt="posting solution" />
              <img src="check.svg" alt="posted solution" />
              <img src="close2.svg" alt="error posting solution" />
          </button>
    		</div>
    	</section>
    );
  }
}
