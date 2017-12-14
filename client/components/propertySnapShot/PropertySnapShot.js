import React from 'react';
import { toTitleCase, commafy, calcMonthCollected, calcMonthExpenses } from '../../../helpers/helpers';

const PropertySnapShot = (props) => {
  const rentCollected = calcMonthCollected(props.rentPayments, props.month, props.year);
  const monthExpense = calcMonthExpenses(props.issues, props.month, props.year);
  const rentExpected = parseFloat(props.rentExpected);
  const rRevenue = (rentCollected / rentExpected) * 100;
  const profit = ((rentCollected - monthExpense) / rentExpected) * 100;
  let hasOutstanding = false;
  props.issues.forEach(issue => { if(!issue.solution.completed) hasOutstanding = true });
  return (
    <div className="property-snapshot card" style={{background: props.color}}>
      <div>
        <h2>{props.name}</h2>
        <h3>Manager: { (props.manager === 'none' || props.manager === 'None') ? 'None listed' : toTitleCase(props.manager)}</h3>
        <div className="rent notification line-chart">
          <div className="lineholder">
            <h4>Expected Monthly Rent</h4>
            <div className="line">
              <div className="line-shadow">${commafy(rentExpected.toFixed(2))}</div>
            </div>
          </div>
          <div className="lineholder">
            <h4>Rent Received</h4>
            <div className="line">
              <div className="line-shadow" style={{
                boxShadow: "1px 1px 4px #29CA2C",
                background: "#29CA2C",
                width: (rRevenue > 0) ? `${rRevenue}%` : "0%"
              }}>{commafy( rentCollected > 0 ? `$${rentCollected.toFixed(2)}` : "" )}</div>
            </div>
          </div>
          <div className="lineholder">
            <h4>Month's Profit</h4>
            <div className="line">
              <div className="line-shadow" style={{
              boxShadow: "1px 1px 4px #29CFB5",
              background: "#29CFB5",
              width: (profit > 0) ? `${profit}%` : "0%"
            }}>{commafy((profit > 0) ? `$${(rentCollected - monthExpense).toFixed(2)}` : "")}</div>
            </div>
          </div>
        </div>
        {
          hasOutstanding &&
          <div className="outstanding-shot notification">
            <h3>Service Requests:</h3>
            {
              props.issues.map((issue, i) => {
                if(issue.solution.completed === false) {
                  return (
                    <div 
                      data-index={props.idx}
                      className="snap-issue" 
                      key={i}
                      onClick={props.propPage}>
                      <h4
                        onClick={props.propPage}
                        data-index={props.idx}>{issue.issue}</h4>
                    </div>
                  );
                }
              }) 
            }
          </div>
        }
      </div>
      {
        props.hasOutstanding &&
        <div className="dot"></div>
      }
    </div>
  );
}

export default PropertySnapShot;
