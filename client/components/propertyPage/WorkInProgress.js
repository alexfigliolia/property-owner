import React, { Component } from 'react';
import { getFirstWord } from '../../../helpers/helpers';

export default class WorkInProgress extends Component {

	handleCheck = (e) => {
    e.persist();
    const id = e.target.dataset.id;
    const targetParent = e.target.parentNode;
    if(e.target.className === "mac") {
      targetParent.parentNode.childNodes[1].placeholder = "Dollar amount";
      let spent = parseFloat(targetParent.parentNode.childNodes[1].value);
      if( !isNaN(spent) ) {
        targetParent.parentNode.parentNode.parentNode.classList.remove('work-progress-item-flip');
        setTimeout(() => {
          Meteor.call('issue.markComplete', id, spent, (err, res) => {
            if(err) {
              // console.log(err);
              this.props.haveAToast("Error:", 'There was a problem with our connection. Please try again.');
            } else {
              targetParent.parentNode.childNodes[1].value = "";
              this.props.haveAToast("Success:", "You marked an in-progress item as complete");
            } 
          });
        }, 250);
      } else {
        this.props.haveAToast("Error:", 'The total spent fixing this issue is required. You can use 0 if no money was spent.');
        targetParent.parentNode.childNodes[1].value = "";
        targetParent.parentNode.childNodes[1].placeholder = "Enter a number";
      }
    } else {
      targetParent.parentNode.parentNode.classList.remove('work-progress-item-flip');
      setTimeout(() => {
        Meteor.call('issue.markComplete', id, 0, (err, res) => {
          if(err) {
            // console.log(err);
            this.props.haveAToast("Error:", 'There was a problem with our connection. Please try again.');
          } else {
            this.props.haveAToast("Success:", `You marked the "${this.props.issue[e.target.dataset.idx].issue}" as complete`);
          }
        });
      }, 250);
    }
  }

  showSpent = (e) => {
    e.persist();
    if(e.target.dataset.budget == 0) {
      this.handleCheck(e);
    } else {
      e.target.parentNode.parentNode.childNodes[2].classList.add('show-spent'); 
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
                          data-budget={parseFloat(issue.solution.budget)}
                          data-selected="yes"
                          data-id={issue._id} 
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
                            <button 
                              data-idx={i}
                              data-id={issue._id} 
                              onClick={this.handleCheck} 
                              className="mac">Mark complete</button>
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
                              }}>{issue.solution.postedBy}</h4>
                          </div>
                      }
                    </div>
                    <button 
                      data-id={issue._id} 
                      onClick={this.props.togglePostSolution}
                      className="solution-edit"></button>
                    <button 
                      data-idx={i}
                      data-id={issue._id} 
                      onClick={this.props.toggleIssueImages}
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
