import React, { Component } from 'react';

export default class AccountingView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      range: [
        new Date().getUTCFullYear().toString(), 
        (parseInt(new Date().getMonth()) < 10) ? ('0' + (parseInt(new Date().getMonth()) + 1)).slice(-2) : (new Date().getMonth() + 1).toString(), 
        new Date().getUTCFullYear().toString(), 
        (parseInt(new Date().getMonth()) < 10) ? ('0' + (parseInt(new Date().getMonth()) + 1)).slice(-2) : (new Date().getMonth() + 1).toString()
      ],
      totalPayments: 0,
      totalExpenses: 0,
      profitLoss: 0
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.classes === 'accounting accounting-show') {
      this.refs.accounting.scrollTop = 0;
    }
  }

  setRange = () => {
    const fromYear = this.refs.from.value.substring(0, 4);
    const toYear = this.refs.to.value.substring(0, 4);
    const fromMonth = this.refs.from.value.substring(this.refs.from.value.length - 2);
    const toMonth = this.refs.to.value.substring(this.refs.to.value.length - 2);
    this.setState({ range: [fromYear, fromMonth, toYear, toMonth] });
  }

  render = () => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let rangeRevenue = 0, rangeExpenses = 0;
    return (
      <div className={this.props.classes} ref="accounting">
        <div>
          <h1>{this.props.property.property}<br/>Accounting View</h1>
          <div className="inputs">
            <div>
              <label>Date from:</label>
              <input 
                ref="from" 
                type="month" 
                onChange={this.setRange}
                defaultValue={this.state.range[0] + "-" + this.state.range[1]} />
            </div>
            <div>
              <label>Date to:</label>
              <input 
                ref="to" 
                type="month" 
                onChange={this.setRange}
                defaultValue={this.state.range[2] + "-" + this.state.range[3]} />
            </div>
          </div>
            <div className="acc">
              <div className="income">
                <h3>Income:</h3>
                {
                  this.props.rentPayments.map((payment, i) => {
                    let date = new Date(payment.date),
                        day = date.getDate(),
                        year = date.getUTCFullYear();
                    if( date >= new Date( this.state.range[0] + "/" + parseInt(this.state.range[1]) + "/1") &&
                        date <= new Date(parseInt(this.state.range[2]), parseInt(this.state.range[3]), 0, 23, 59, 59) ) 
                      {  
                      rangeRevenue += parseFloat(payment.payment);
                      return (
                        <div key={i} className="table">
                          <h4>{(date.getMonth() + 1) + "/" + day + "/" + year.toString().substring(2, 4)}</h4>
                          <h4>Tenant</h4>
                          <h4>{parseFloat(payment.payment).toFixed(2)}</h4>
                        </div>
                      );
                    }
                  })
                }
                <div className="table">
                  <h4>Total:</h4>
                  <h4>${rangeRevenue.toFixed(2)}</h4>
                </div>
              </div>
              <div className="expenses">
                <h3>Expenses:</h3>
                {
                  this.props.issues.map((expense, i) => {
                    if(expense.solution.completed && expense.solution.spent !== 0) {
                      let date = new Date(expense.date),
                          day = date.getDate(),
                          year = date.getUTCFullYear();
                      if( date >= new Date(this.state.range[0] + "/" + parseInt(this.state.range[1]) + "/1") &&
                          date <= new Date(parseInt(this.state.range[2]), parseInt(this.state.range[3]), 0, 23, 59, 59)) 
                      {  
                        rangeExpenses += parseFloat(expense.solution.spent);
                        return (
                          <div key={i} className="table">
                            <h4>{(date.getMonth() + 1) + "/" + day + "/" + year.toString().substring(2, 4)}</h4>
                            <h4>{(expense.solution.products !== "") ? expense.solution.products : expense.issue}</h4>
                            <h4>{parseFloat(expense.solution.spent).toFixed(2)}</h4>
                          </div>
                        );
                      }
                    }
                  })
                }
                <div className="table">
                  <h4>Total:</h4>
                  <h4>${rangeExpenses.toFixed(2)}</h4>
                </div>
              </div>
              <div className="profit-loss">
                <h3>Profit-loss</h3>
                <div className="table">
                  <h4>{((rangeRevenue - rangeExpenses).toFixed(2) >= 0) ? "Profit:" : "Loss:"}</h4>
                  <h4 style={{
                    color: ((rangeRevenue - rangeExpenses).toFixed(2) >= 0) ? "#65B764" : "#F66463"
                  }}>${(rangeRevenue - rangeExpenses).toFixed(2)}</h4>
                </div>
              </div>
            </div>
        </div>
      </div>
    );
  }
}