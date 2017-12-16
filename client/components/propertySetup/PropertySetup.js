import React, { Component } from 'react';

export default class PropertySetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false,
      validated: true,
      mortgageyes: false,
      mortgageno: false,
      groundsyes: false,
      groundsno: false,
      payrollyes: false,
      payrollno: false,
      repairsyes: false,
      repairsno: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if(this.props.classes === 'property-setup' && nextProps.classes === 'property-setup property-setup-show') {
      this.refs.propSetup.scrollTop = 0;
    }
    if(nextProps.property !== this.props.property) {
      this.clear();
      this.refs.snp.classList.remove('action-complete');
    }
  }

  handleHasMortgage = (e) => {
    if(e.target.value === "yes") {
      this.setState({ mortgageyes: true, mortgageno: false });
    } else {
      this.setState({ mortgageyes: false, mortgageno: true });
    }
  }

  handleGrounds = (e) => {
    if(e.target.value === "yes") {
      this.setState({ groundsyes: true, groundsno: false });
    } else {
      this.setState({ groundsyes: false, groundsno: true });
    }
  }

  handlePayroll = (e) => {
    if(e.target.value === "yes") {
      this.setState({ payrollyes: true, payrollno: false });
    } else {
      this.setState({ payrollyes: false, payrollno: true });
    }
  }

  handleRepairs = (e) => {
    if(e.target.value === "yes") {
      this.setState({ repairsyes: true, repairsno: false });
    } else {
      this.setState({ repairsyes: false, repairsno: true });
    }
  }

  validate = (variable) => {
    if(parseFloat(variable) !== 0) {
      if(isNaN(parseFloat(variable)) === true || variable === '') {
        variable = "";
        this.setState({ validated: false });
      } else {
        this.setState({ validated: true });
      }
    } 
    return parseFloat(variable)
  }

  handleSetup = (e) => {
    const estRent = this.refs.er;
    const colRent = this.refs.cr;
    const mortgage = this.validate(this.refs.mortgage === undefined ? 0 : this.refs.mortgage.value);
    const payroll = this.validate(this.refs.payroll === undefined ? 0 : this.refs.payroll.value);
    const grounds = this.validate(this.refs.grounds === undefined ? 0 : this.refs.grounds.value);
    const repairs = this.validate(this.refs.repairs === undefined ? 0 : this.refs.repairs.value);
    const issues = [];
    let expectedRent;
    let collectedRent;
    const idx = this.props.idx;

    if( isNaN(estRent.value) || estRent.value === '' ) {
      estRent.placeholder = "Enter 0 if not applicable or $ amount";
      estRent.value === "";
      this.setState({ validated: false });
    } else {
      expectedRent = estRent.value;
      this.setState({ validated: true });
    }
    if( isNaN(colRent.value) === true || colRent.value === '') {
      colRent.placeholder = "Enter 0 if not applicable or $ amount";
      colRent.value === "";
      this.setState({ validated: false });
    } else {
      collectedRent = colRent.value;
      this.setState({ validated: true });
    }
    if(expectedRent !== undefined && 
       collectedRent !== undefined &&
       !isNaN(mortgage) &&
       !isNaN(payroll) &&
       !isNaN(grounds) &&
       !isNaN(repairs) ) 
    {
      if(parseFloat(mortgage) > 0) {
        issues.push(
          {
            issue: "Mortgage",
            date: new Date(),
            postedBy: this.props.user,
            images: [],
            solved: true,
            solution: {
              completed: true,
              description: "Mortgage",
              products: "Mortgage",
              budget: parseFloat(mortgage),
              spent: parseFloat(mortgage),
              postedBy: this.props.user
            }
          }
        );
      }
      if(parseFloat(payroll) > 0) {
        issues.push(
          {
            issue: "Payroll",
            date: new Date(),
            postedBy: this.props.user,
            images: [],
            solved: true,
            solution: {
              completed: true,
              description: "Payroll",
              products: "Payroll",
              budget: parseFloat(payroll),
              spent: parseFloat(payroll),
              postedBy: this.props.user
            }
          }
        );
      }
      if(parseFloat(grounds) > 0) {
        issues.push(
          {
            issue: "Grounds maintenace",
            date: new Date(),
            postedBy: this.props.user,
            images: [],
            solved: true,
            solution: {
              completed: true,
              description: "Grounds maintenace",
              products: "Grounds maintenace",
              budget: parseFloat(grounds),
              spent: parseFloat(grounds),
              postedBy: this.props.user
            }
          }
        );
      } 
      if(parseFloat(repairs) > 0) {
        issues.push(
          {
            issue: this.refs.desc.value,
            date: new Date(),
            postedBy: this.props.user,
            images: [],
            solved: true,
            solution: {
              completed: true,
              description: this.refs.desc.value,
              products: this.refs.desc.value,
              budget: parseFloat( this.refs.repairs.value),
              spent: parseFloat( this.refs.repairs.value),
              postedBy: this.props.user
            }
          }
        );
      } 
      const monthRentExpected = parseFloat(expectedRent);
      const mortgageMonthly = parseFloat(mortgage);
      e.target.classList.add('action-complete');
      setTimeout(() => {
        Meteor.call('properties.update', this.props.property._id, monthRentExpected, mortgageMonthly, (err, res) => {
          if(err) {
            console.log(err);
          } else {
            // this.props.toggleToast("You configured new property: " + this.props.property);
            this.clear();
            this.props.goHome();
            issues.forEach(issue => {
              Meteor.call('issues.create', this.props.property._id, this.props.property.property, issue, (err, res) => {
                if(err) console.log(err)
              });
            });
            if(parseFloat(collectedRent) > 0) {
              Meteor.call('payments.create', this.props.property._id, parseFloat(collectedRent), (err, res) => {
                if(err) console.log(err)
              });
            }
            this.props.haveAToast('Success:', `You configured your "${this.props.property.property}" property!`)
          }
        });
      }, 1000);
    } else {
      this.setState({ validated: false });
    }
  }

  clear = () => {
    this.refs.er.value = '';
    this.refs.cr.value = '';
    this.refs.er.placeholder = 'Expected Rent';
    this.refs.cr.placeholder = 'Rent collected this month';
    if( this.refs.mortgage !== undefined) {
      this.refs.mortgage.value = '';
      this.refs.mortgage.placeholder = 'Monthly mortgage';
    }
    if( this.refs.payroll !== undefined) {
      this.refs.payroll.value = '';
      this.refs.payroll.placeholder = 'Payroll this month';
    }
    if( this.refs.grounds !== undefined) {
      this.refs.grounds.value = '';
      this.refs.grounds.placeholder = 'Grounds expenses this month';
    }
    if( this.refs.repairs !== undefined) {
      this.refs.repairs.value = '';
      this.refs.repairs.placeholder = 'Cost of repairs';
      this.refs.desc.value = '';
    }
    this.setState({
      canSubmit: false,
      validated: true,
      mortgageyes: false,
      mortgageno: false,
      groundsyes: false,
      groundsno: false,
      payrollyes: false,
      payrollno: false,
      repairsyes: false,
      repairsno: false
    });
  }

  render = () => {
    return (
      <div 
        className={this.props.classes} 
        id='propertySetup'
        ref='propSetup'>
        <div>
          <h1>Please answer a few questions about your property</h1>
          <div className="questionaire">
            <h2 data-num="1">Rent Revenue</h2>
            <label>1) How much rent do you expect to collect each month across all units?</label>
            <input ref="er" type="number" placeholder="Expected Rent" />
            <label>2) How much rent have you collected this month?</label>
            <input ref="cr" type="number" placeholder="Rent collected this month" />
            <h2 data-num="2">Fixed & Variable Expenses</h2>
            <legend>1) Does this property have a payroll?</legend>
            <div className="checkboxes mcheck">
              <label htmlFor="yes">Yes</label>
              <input 
                ref="c1" 
                type="checkbox" 
                value="yes" 
                checked={this.state.payrollyes} 
                onChange={this.handlePayroll} />
              <label htmlFor="no">No</label>
              <input 
                ref="c2" 
                type="checkbox" 
                value="no" 
                checked={this.state.payrollno} 
                onChange={this.handlePayroll} />
            </div>
            {
              this.state.payrollyes &&
              <label>How much have you paid out this month in payroll? (Enter 0 if none)</label>
            }
            {
              this.state.payrollyes &&
              <input ref="payroll" type="number" placeholder="Payroll this month" />
            }
            <legend>2) Does this property require monthly grounds maintenace?</legend>
            <div className="checkboxes mcheck">
              <label htmlFor="yes">Yes</label>
              <input 
                ref="c3" 
                type="checkbox" 
                value="yes" 
                checked={this.state.groundsyes} 
                onChange={this.handleGrounds} />
              <label htmlFor="no">No</label>
              <input 
                ref="c4" 
                type="checkbox" 
                value="no" 
                checked={this.state.groundsno} 
                onChange={this.handleGrounds} />
            </div>
            {
              this.state.groundsyes && 
              <label>How much have you paid out in grounds maintenace? (Enter 0 if none)</label>
            }
            {
              this.state.groundsyes &&
              <input ref="grounds" type="number" placeholder="Grounds expenses this month" />
            }
            <legend>3) Were there any repairs to the property made this month?</legend>
            <div className="checkboxes mcheck">
              <label htmlFor="yes">Yes</label>
              <input 
                ref="c5" 
                type="checkbox" 
                value="yes" 
                checked={this.state.repairsyes} 
                onChange={this.handleRepairs} />
              <label htmlFor="no">No</label>
              <input 
                ref="c6" 
                type="checkbox" 
                value="no" 
                checked={this.state.repairsno} 
                onChange={this.handleRepairs} />
            </div>
            {
              this.state.repairsyes &&
              <label>How much did it cost?</label>
            }
            {
              this.state.repairsyes &&
              <input ref="repairs" type="number" placeholder="Cost of repairs" />
            }
            {
              this.state.repairsyes &&
              <label>Please describe the repair(s)</label>
            }
            {
              this.state.repairsyes &&
              <textarea ref="desc" placeholder="Please describe the repair(s)"></textarea>
            }
            <h2 data-num="3">Finance & Equity</h2>
            <legend>4) Does this property currently have a mortgage?</legend>
            <div className="checkboxes mcheck">
              <label htmlFor="yes">Yes</label>
              <input 
                ref="c7" 
                type="checkbox" 
                value="yes" 
                checked={this.state.mortgageyes} 
                onChange={this.handleHasMortgage} />
              <label htmlFor="no">No</label>
              <input 
                ref="c8" 
                type="checkbox" 
                value="no" 
                checked={this.state.mortgageno} 
                onChange={this.handleHasMortgage} />
            </div>
            {
              this.state.mortgageyes &&
              <label>4) How much is the monthly payment?</label>
            }
            {
              this.state.mortgageyes &&
              <input ref="mortgage" type="number" placeholder="Monthly mortgage" />
            }
            {
              !this.state.validated && 
                <h2 data-num="X">Please check your inputs and try again</h2>
            }
            <button 
              ref="snp"
              className="submit-new-property" 
              onClick={this.handleSetup}>
                Submit
                <img src="check.svg" alt="New property configured" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}