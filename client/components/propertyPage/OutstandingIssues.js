import React, { Component } from 'react';

export default class OutstandingIssues extends Component {
	constructor(props) {
		super(props);
    this.flips = document.getElementsByClassName('work-progress-item-flip');
	}

	deleteIssue = (e) => {
    const issue = this.props.issues[e.target.dataset.idx];
    Meteor.call('issue.delete', issue._id, (err, res) => {
      if(err) {
        console.log(err);
      } else {
        this.undoFlips();
      }
    });
  }

  undoFlips = () => {
    for(let i = 0; i < this.flips.length; i++) {
      this.flips[i].classList.remove('work-progress-item-flip');
    }
  }

	render = () => {
    return (
    	<div className="has-outstanding card">
        <div>
          <h2>Service Items</h2>
          <div className="has-outstanding-items">
            {
              this.props.issues.map((issue, i) => {
                return (
                  <div key={i} className="has-outstanding-item">
                    <button 
                      data-idx={i} 
                      onClick={this.props.viewImages}
                      className="view-service-images"></button>
                    <div className="back">
                      <h3>Are you sure you want to delete this item?</h3>
                      <div>
                        <button data-selected="no" onClick={this.props.showMAC}>No</button>
                        <button data-idx={i} onClick={this.deleteIssue}>Yes</button>
                      </div>
                    </div>
                    <h3>{issue.issue}</h3>
                    {
                      !issue.solved &&
                      <div className="issue-buttons">
                        <button onClick={this.props.showMAC}>Delete</button>
                        <button 
                          data-idx={i} 
                          onClick={this.props.postSolution}>
                          Solve</button>
                      </div>
                    }
                    {
                      issue.solved &&
                      <div className="has-solution">
                        <button>
                          <div>
                            <h4>Solution Posted</h4>
                            <img src="check.svg" alt="issue solved"/>
                          </div>
                        </button>
                      </div>
                    }
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
