import React, { Component } from 'react';
import Welcome from '../welcome/Welcome';
import { commafy, round, getMonthTotal } from '../../../helpers/helpers';

export default class Graph extends Component {
  constructor(props) {
  	super(props);
  	this.state = { barClasses: "graph-bar" }
  	this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  }

  componentDidMount = () => {
    setTimeout(() => { this.setState({ barClasses: "graph-bar graph-bar-show" }) }, 1000);
  }

  render = () => {
    return (
    	<section 
        className={this.props.individualProp ? "graph-container pp-graph" : "graph-container"}
        style={{
          background: this.props.individualProp ? 'rgba(255,255,255, 0.9)' : '#202B3C'
        }}>
        {
          !this.props.individualProp && this.props.properties.length === 0 ? <Welcome /> :
      		<div>
            <h2 style={{color: this.props.individualProp ? this.props.property.color : '#fff'}}>Revenue Overview</h2>
            <div 
              className="graph"
              style={{
                borderLeft: this.props.individualProp ? `2px solid ${this.props.property.color}` : '2px solid #fff',
                borderBottom: this.props.individualProp ? `2px solid ${this.props.property.color}` : '2px solid #fff'
              }}>
            	{
  	            this.months.map((month, i) => {
  	              return (
  	                <div 
  	                	className='month' 
  	                	data-m={month.charAt(0)} 
  	                	data-mo={month.substring(0, 3)} 
  	                	data-num={i} 
  	                	key={i}
                      style={{
                        borderRight: this.props.individualProp ? '1px solid rgba(0,0,0, 0.05)' : '1px solid rgba(255,255,255, 0.05)'
                      }}>
  	                	<div 
                        key={i}
                        className={this.state.barClasses + " graph-bar-collected"}
                        style={{
                          background: "#91A7E0",
                          height: ( (this.props.monthTotal[i] / (round(this.props.graphMax, 1)*1000)) * 100) + "%"
                        }}>
                      </div>
                
                      {
                        i <= this.props.month &&
                        <div 
                          className={this.state.barClasses + " graph-bar-expected"}
                          style={{
                            background: "#51A549",
                            height: ( ((this.props.monthTotal[i] - this.props.monthlyExpenses[i]) / (round(this.props.graphMax, 1)*1000)) * 100) < 0 ? 0 :
                            ( ((this.props.monthTotal[i] - this.props.monthlyExpenses[i]) / (round(this.props.graphMax, 1)*1000)) * 100) + "%"
                          }}>
                        </div>
                      }
                    </div>
  	              );
  	            })
  	          }
  	          {
                [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1].map((num, i) => {
                  return (
                  	<span
  	                  className="notch"
  	                  key={i}
  	                  data-num={
  	                  	i % 2 === 0 ? 
  	                  	round((this.props.graphMax * num), 1).toString() + "K"
  	                  	: ''
  	                  }></span>
                  );
                })
              }
            </div>
            <div className="graph-key">
              <div>
                <div className="key-collected"></div>
                <h5 style={{color: this.props.individualProp ? '#263346' : '#fff'}}>Revenue</h5>
              </div>
              <div>
                <div className="key-expected"></div>
                <h5 style={{color: this.props.individualProp ? '#263346' : '#fff'}}>Profit</h5>
              </div>
            </div>
            <div className="graph-reads">
              <div className="g-read">
                <h3 style={{color: this.props.individualProp ? this.props.property.color : '#fff'}}>{`${this.months[this.props.month]}'s Profit`}</h3>
                <div className='month-calc'>
                  <div>
                    <h4 style={{color: this.props.individualProp ? '#263346' : '#fff'}}>{`${this.months[this.props.month]}'s Revenue:`}</h4>
                    <h4>${commafy(this.props.monthTotal[this.props.month].toFixed(2))}</h4>
                  </div>
                  <div className='expenses'>
                    <h4 style={{color: this.props.individualProp ? '#263346' : '#fff'}}>{`${this.months[this.props.month]}'s Expenses:`}</h4>
                    <h4>${commafy(this.props.monthlyExpenses[this.props.month].toFixed(2))}</h4>
                  </div>
                  <div>
                    <h4 style={{color: this.props.individualProp ? '#263346' : '#fff'}}>Profit:</h4>
                    <h4 
                      style={{
                        color: this.props.monthTotal[this.props.month].toFixed(2) - this.props.monthlyExpenses[this.props.month].toFixed(2) >= 0 ? '#51A549' : '#F66463'
                      }}>
                        ${commafy((this.props.monthTotal[this.props.month].toFixed(2) - this.props.monthlyExpenses[this.props.month].toFixed(2)).toFixed(2))}</h4>
                  </div>
                </div>
              </div>
              <div className="g-read">
                <h3 style={{color: this.props.individualProp ? this.props.property.color : '#fff'}}>Year Overview</h3>
                <div className="year-calc">
                  <div>
                    <h4 style={{color: this.props.individualProp ? '#263346' : '#fff'}}>Year's Revenue:</h4>
                    <h4>${commafy((this.props.monthTotal.reduce((acc, cur) => acc + parseFloat(cur), 0)).toFixed(2))}</h4>
                  </div>
                  <div className='expenses'>
                    <h4 style={{color: this.props.individualProp ? '#263346' : '#fff'}}>Year's Expenses:</h4>
                    <h4>${commafy((this.props.monthlyExpenses.reduce((acc, cur) => acc + parseFloat(cur), 0)).toFixed(2))}</h4>
                  </div>
                  <div>
                    <h4 style={{color: this.props.individualProp ? '#263346' : '#fff'}}>Year's Projected Revenue:</h4>
                    <h4>${commafy(this.props.yearsProjectedRevenue.toFixed(2))}</h4>
                  </div>
                </div>
              </div>
            </div>
            {
              this.props.individualProp &&
              <div className="utils">
                <button 
                  onClick={this.props.toggleAccounting} 
                  style={{color: this.props.property.color}}>
                    Accounting</button>
                <button 
                  onClick={this.props.togglePayABill} 
                  style={{color: this.props.property.color}}>
                    Pay a bill</button>
                <button 
                  onClick={this.props.toggleCollectRent} 
                  style={{color: this.props.property.color}} 
                  className="collect-rent">Collect Rent</button>
              </div>
            }
          </div>
        }
    	</section>
    );
  }
}
