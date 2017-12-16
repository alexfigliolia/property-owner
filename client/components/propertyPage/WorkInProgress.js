import React, { Component } from 'react';
import { getFirstWord } from '../../../helpers/helpers';

export default class WorkInProgress extends Component {
	constructor(props) {
		super(props);
	}

	handleCheck = (e) => {
    e.persist();
    if(e.target.className === "mac") {
      e.target.parentNode.parentNode.childNodes[1].placeholder = "Dollar amount";
      const issueIdx = e.target.dataset.idx;
      const propIdx = this.props.propIndex;
      const currentProperty = this.props.property;
      let spent = e.target.parentNode.parentNode.childNodes[1].value;
      if(spent !== "" & isNaN(spent) === false) {
        (spent === "") ? spent = 0 : spent = spent;
        e.target.parentNode.parentNode.parentNode.parentNode.classList.remove('work-progress-item-flip');
        setTimeout(() => {
          this.props.markAsComplete(propIdx, issueIdx, spent);
          e.target.parentNode.parentNode.childNodes[1].value = "";
        }, 200);
      } else {
        e.target.parentNode.parentNode.childNodes[1].value = "";
        e.target.parentNode.parentNode.childNodes[1].placeholder = "Enter a number";
      }
    } else {
      const issueIdx = e.target.dataset.idx;
      const propIdx = this.props.propIndex;
      const currentProperty = this.props.property;
      let spent = 0;
      e.target.parentNode.parentNode.parentNode.classList.remove('work-progress-item-flip');
      setTimeout(() => {
        this.props.markAsComplete(propIdx, issueIdx, spent);
      }, 200);
    }
  }

  showSpent = (e) => {
    e.persist();
    if(e.target.dataset.budget === "true") {
      e.target.parentNode.parentNode.childNodes[2].classList.add('show-spent');
    } else {
      this.handleCheck(e);
    }
  }

	render = () => {
    return (
    	<div className="has-outstanding card is-fixing">
	      <div>
	        <h2>Work in Progress</h2>
	        <div className="has-outstanding-items">
	          {
	            this.props.issues.map((issue, i) => {
                return (
                  <div key={i} className="has-outstanding-item work-progress-item">
                    <div className="back">
                      <h3>Mark as complete?</h3>
                      <div>
                        <button data-selected="no" onClick={this.props.showMAC}>No</button>
                        <button 
                          data-budget={(issue.solution.budget !== 0 && issue.solution.budget !== "0") ? "true" : "false" }
                          data-selected="yes"
                          data-idx={i} 
                          onClick={this.showSpent}>Yes</button>
                      </div>
                      {
                        issue.solution.budget !== 0 &&
                        <div className="total-spent">
                          <h3>Total spent fixing this issue:</h3>
                          <input type="number" placeholder="Dollar amount"/>
                          <div>
                            <button onClick={this.props.cancelMAC}>Cancel</button>
                            <button data-idx={i} onClick={this.handleCheck} className="mac">Mark complete</button>
                          </div>
                        </div>
                      }
                    </div>
                    <h3>Fixing: {issue.issue}</h3>
                    {
                      (!issue.solution.completed) ?
                      <h4>Status: <span onClick={this.props.showMAC}>In progress</span></h4>
                      : <h4>Status: <span>Complete</span></h4>
                    }
                    <div className="has-solution">
                      <p><strong>Solution: </strong>{issue.solution.description}</p>
                      {
                        (issue.solution.products !== "None" && issue.solution.products !== "none" && issue.solution.products !== "") ?
                          <p><strong>Products: </strong>{issue.solution.products}</p>
                          : ""
                      }
                      {
                        (issue.solution.budget !== 0 && issue.solution.budget !== "0") ?
                          <div>
                            <h4 onClick={this.props.openChat}>{getFirstWord(issue.solution.postedBy)}</h4>
                            <h4>Budget: ${issue.solution.budget}</h4>
                          </div>
                        : <div>
                            <h4 
                              onClick={this.props.openChat} 
                              style={{
                                  background: "#F66463",
                                  width: "100%",
                                  borderBottomLeftRadius: "5px",
                                  cursor: "pointer"
                              }}>{issue.solution.postedBy.name}</h4>
                          </div>
                      }
                    </div>
                    <button 
                      data-idx={i} 
                      onClick={this.props.togglePostSolution}
                      className="solution-edit"></button>
                    <button 
                      data-idx={i} 
                      onClick={this.props.viewImages}
                      className="view-service-images"></button>
                  </div>
                );
	            })
	          }
	        </div>
	      </div>
	    </div>
    );
	}
}
