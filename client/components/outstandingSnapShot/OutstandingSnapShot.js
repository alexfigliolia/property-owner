import React, { Component } from 'react';
import { toTitleCase } from '../../../helpers/helpers';

export default class OutstandingSnapShot extends Component {
  render = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return (
      <div className="outstanding-snap-shot card" id='outstandingSnapShot' >
        <div>
        	<h2>Service Requests</h2>
        	{
        		this.props.issues.map((issue, i) => {
              if(!issue.solution.completed) {
                let date = issue.date.toString(),
                    d = new Date(issue.date),
                    day = d.getDay(),
                    month = d.getMonth(),
                    monthDay = d.getDate(),
                    year = d.getUTCFullYear(),
                    hours = d.getHours(),
                    hf = (hours > 12) ? hours - 12 : hours,
                    minutes = d.getMinutes(), 
                    amPm = (hours < 11) ? "am" :  "pm";
                return (
                  <div
                    onClick={this.props.navigate}
                    data-index={i}
                    key={i} 
                    className="outstanding-item notification">
                    <h3
                      onClick={this.props.navigate}
                      data-index={i}>
                      <strong>{issue.issue}</strong> - {toTitleCase(issue.property)}
                    </h3>
                    <p 
                      onClick={this.props.navigate}
                      data-index={i}>
                        {days[day] + ", " + months[month] + " " + monthDay + ", " + year + " at " + hf + ":" + minutes + amPm}
                    </p>
                  </div>
                );
              }
            })
        	}
        </div>
      </div>
    );
  }
}