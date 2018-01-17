import React, { Component } from 'react';
import Graph from '../graph/Graph';
import OutstandingIssues from './OutstandingIssues';
import WorkInProgress from './WorkInProgress';
import { getTotal } from '../../../helpers/helpers';

export default class PropertyPage extends Component {
  
  componentWillReceiveProps = (nextProps) => {
    if(nextProps.classes === 'property-page property-page-show' &&
       nextProps.property !== this.props.property) {
      this.refs.propertyPage.scrollTop = 0;
    }
  }

  //DISPLAY MARK ISSUE AS COMPLETE UI
  showMAC = (e) => {
    (e.target.dataset.selected === 'no') ?
      e.target.parentNode.parentNode.parentNode.classList.toggle('work-progress-item-flip')
      : e.target.parentNode.parentNode.classList.toggle('work-progress-item-flip');
  }

  cancelMAC = (e) => {
    e.persist();
    e.target.parentNode.parentNode.classList.remove('show-spent');
    setTimeout(() => {
      e.target.parentNode.parentNode.parentNode.parentNode.classList.toggle('work-progress-item-flip');
    }, 400);
  }

  render = () => {
  	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const color = this.props.property !== undefined ? this.props.property.color : "#815475";
    const inProgress = this.props.issues.filter(issue => issue.solved && issue.solution.completed === false);
    const outstanding = this.props.issues.filter(issue => !issue.solution.completed);
    return (
    	<div className={this.props.classes} ref="propertyPage" style={{background: color}}>
        <div>
          <h1>{this.props.property.property}</h1>
          <h2>Manager: {this.props.property.manager}</h2>
          <div className="pp-buttons">
            <button onClick={this.props.toggleEditProperty}><img src="create.svg" alt="create icon" />Edit Property</button>
            <button onClick={this.props.toggleAddServiceItem}><img src="add.svg" alt="add icon" />Add Service Item</button>
          </div>
          <Graph
            individualProp={true}
            property={this.props.property}
            rentPayments={this.props.rentPayments}
            graphMax={ Math.ceil(this.props.property.monthRentExpected / 1000) }
            month={this.props.month}
            year={this.props.year}
            yearsProjectedRevenue={12 * this.props.property.monthRentExpected}
            monthTotal={getTotal(this.props.rentPayments, 'payment', undefined)}
            monthlyExpenses={getTotal(this.props.issues, 'solution', 'spent')}
            toggleCollectRent={this.props.toggleCollectRent}
            togglePayABill={this.props.togglePayABill}
            toggleAccounting={this.props.toggleAccounting} /> 
          {
            outstanding.length > 0 &&
            <OutstandingIssues 
            	property={this.props.property}
            	showMAC={this.showMAC}
            	cancelMAC={this.cancelMAC}
              issues={outstanding}
              togglePostSolution={this.props.togglePostSolution}
              toggleIssueImages={this.props.toggleIssueImages}
              haveAToast={this.props.haveAToast} />
          }
          {
            inProgress.length > 0 &&
            <WorkInProgress
            	property={this.props.property}
            	showMAC={this.showMAC}
            	cancelMAC={this.cancelMAC}
              issues={inProgress}
              togglePostSolution={this.props.togglePostSolution}
              toggleIssueImages={this.props.toggleIssueImages}
              haveAToast={this.props.haveAToast} />
          }
        </div>
      </div>
    );
  }
}
