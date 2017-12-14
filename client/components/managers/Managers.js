import React from 'react';
import AddManager from './AddManager';
import Manager from './Manager';
import ManagerPassword from './ManagerPassword';

const Managers = (props) => {
  return (
  	<section className={props.classes} id="managers">
  		<div>
  			<h2>Managers</h2>
  			<p>Here, you can add and remove managers from your group</p>
  			<AddManager classes={props.classes} />
  			<div className="list">
  				{
            props.managers !== undefined &&
            props.managers.map((manager, i) => {
              return(
                <Manager 
                  key={i}
                  name={manager} />
              );
            })
          }
  			</div>
        <ManagerPassword 
          code={props.code}
          classes={props.classes} />
  		</div>
  	</section> 
  );
}

export default Managers;