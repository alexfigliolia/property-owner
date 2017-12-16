import React, { Component } from 'react';
import { commafy } from '../../../helpers/helpers';
import jsPDF from 'jspdf';

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
      profitLoss: 0,
      saveClasses: 'save-button'
    }
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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

  savePDF = () => {
    this.setState({ saveClasses: 'save-button saved'}, () => {
      createAccountingPDF(this.props.rentPayments, this.props.issues, this.state.range, this.props.property, this.months)
        .then(() => {
          setTimeout(() => { this.setState({ saveClasses: 'save-button' }) }, 800);
        });
    });
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
                        <h4>{commafy(parseFloat(payment.payment).toFixed(2))}</h4>
                      </div>
                    );
                  }
                })
              }
              <div className="table">
                <h4>Total:</h4>
                <h4>${commafy(rangeRevenue.toFixed(2))}</h4>
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
                          <h4>{commafy(parseFloat(expense.solution.spent).toFixed(2))}</h4>
                        </div>
                      );
                    }
                  }
                })
              }
              <div className="table">
                <h4>Total:</h4>
                <h4>${commafy(rangeExpenses.toFixed(2))}</h4>
              </div>
            </div>
            <div className="profit-loss">
              <h3>Profit-loss</h3>
              <div className="table">
                <h4>{((rangeRevenue - rangeExpenses).toFixed(2) >= 0) ? "Profit:" : "Loss:"}</h4>
                <h4 style={{
                  color: ((rangeRevenue - rangeExpenses).toFixed(2) >= 0) ? "#65B764" : "#F66463"
                }}>${commafy((rangeRevenue - rangeExpenses).toFixed(2))}</h4>
              </div>
            </div>
          </div>
          <button
            className={this.state.saveClasses}
            onClick={this.savePDF}
            id="saveBTN">
            Save as PDF?
            <img src="check.svg" alt="saved" />
          </button>
        </div>
      </div>
    );
  }
}

const createAccountingPDF = async (rentPayments, issues, range, property, months) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  let x = 15, y = 15, pTotal = 0, eTotal = 0;
  doc.setFontType("bold");
  doc.setFontSize(22);
  doc.text(`${property.property} Accounting:`, x, y);
  y+=15;
  doc.text(`${months[parseInt(range[1]) - 1].substring(0, 3)}-${range[0]} to ${months[parseInt(range[3]) - 1].substring(0, 3)}-${range[2]}`, x, y);
  y+=30;
  doc.setTextColor(0, 225, 40);
  doc.setFontSize(18);
  doc.text('Income', x, y);
  doc.setFontType("normal");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  rentPayments.forEach(payment => {
    let date = new Date(payment.date),
        day = date.getDate(),
        year = date.getUTCFullYear();
    if( date >= new Date( range[0] + "/" + parseInt(range[1]) + "/1") &&
        date <= new Date(parseInt(range[2]), parseInt(range[3]), 0, 23, 59, 59) ) 
      {  
        pTotal += parseFloat(payment.payment);
        y+=10;
        if(y > pageHeight - 15) {
          doc.addPage();
          y = 15;
        }
        doc.text(`${(date.getMonth() + 1) + "/" + day + "/" + year.toString().substring(2, 4)}__________Tenant__________$${commafy(payment.payment.toFixed(2))}`, 15, y);
      }
  });
  y+=10;
  if(y > pageHeight - 15) {
    doc.addPage();
    y = 15;
  }
  doc.setFontType("bold");
  doc.setFontSize(18);
  doc.setTextColor(0, 225, 40);
  doc.text(`Total: $${commafy(pTotal.toFixed(2))}`, 15, y);
  y+=30;
  if(y > pageHeight -15) {
    doc.addPage();
    y = 15;
  }
  doc.setTextColor(255, 0, 75);
  doc.text('Expenses', 15, y);
  doc.setFontType("normal");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  issues.forEach(expense => {
    let date = new Date(expense.date),
        day = date.getDate(),
        year = date.getUTCFullYear();
    if( date >= new Date( range[0] + "/" + parseInt(range[1]) + "/1") &&
        date <= new Date(parseInt(range[2]), parseInt(range[3]), 0, 23, 59, 59) ) 
      {  
        eTotal += parseFloat(expense.solution.spent);
        y+=10;
        if(y > pageHeight -15) {
          doc.addPage();
          y = 15;
        }
        doc.text(`${(date.getMonth() + 1) + "/" + day + "/" + year.toString().substring(2, 4)}__________${expense.solution.products}_________$${commafy(parseFloat(expense.solution.spent).toFixed(2))}`, 15, y);
      }
  });
  y+=10;
  if(y > pageHeight -15) {
    doc.addPage();
    y = 15;
  }
  doc.setFontType("bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 0, 75);
  doc.text(`Total: $${commafy(eTotal.toFixed(2))}`, 15, y);
  y+=15;
  if(y > pageHeight -15) {
    doc.addPage();
    y = 15;
  }
  const pl = pTotal - eTotal;
  const indic = pl >= 0 ? 'Profit' : 'Loss'; 
  if(indic === 'Profit') {
    doc.setTextColor(0, 225, 40);
  } else {
    doc.setTextColor(255, 0, 75);
  }
  doc.text(`${indic}: $${commafy(pl.toFixed(2))}`, 15, y);
  const fileName = `${property.property} ${months[parseInt(range[1]) - 1].substring(0, 3)}-${range[0]} to ${months[parseInt(range[3]) - 1].substring(0, 3)}-${range[2]}.pdf`;
  doc.save(fileName);
}