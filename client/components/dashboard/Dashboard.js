import React from 'react';
import Graph from '../graph/Graph';
import OutstandingSnapShot from '../outstandingSnapShot/OutstandingSnapShot';
import PropertySnapShot from '../propertySnapShot/PropertySnapShot';
import { getTotalForEachMonth } from '../../../helpers/helpers';

const Dashboard = (props) => {
  let hasOutstanding = false;
  props.issues.forEach(issue => { if(!issue.solution.completed) hasOutstanding = true });
  return (
  	<section className={props.classes}>
  		<div>

  			<Graph
          properties={props.properties}
          rentPayments={props.rentPayments}
          graphMax={Math.ceil(
            props.properties.reduce((acc, cur) => 
            acc + parseInt(cur.monthRentExpected), 0) / 1000
          )}
          month={props.month}
          year={props.year}
          yearsProjectedRevenue={12 * props.properties.reduce((acc, cur) => acc + parseInt(cur.monthRentExpected), 0)}
          monthTotal={getTotalForEachMonth(props.rentPayments, 'payment', undefined, props.year)}
          monthlyExpenses={getTotalForEachMonth(props.issues, 'solution', 'spent', props.year)} /> 


        {
          hasOutstanding &&
          <OutstandingSnapShot 
            properties={props.properties}
            issues={props.issues} />
        }

        {
          props.properties.map((property, i) => {
            return (
              <PropertySnapShot
                key={i}
                idx={i}
                name={property.property}
                manager={property.manager}
                rentExpected={property.monthRentExpected}
                issues={props.issues.filter(issue => issue.propId === property._id)}
                color={property.color}
                rentPayments={props.rentPayments.filter(item => item.propId === property._id)}
                propPage={props.propPage}
                month={props.month}
                year={props.year} />
            );
          })
        }

  		</div>
  	</section>
  );
}

export default Dashboard;
