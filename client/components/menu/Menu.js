import React from 'react';

const Menu = (props) => {
  return (
  	<div className={props.classes}>
  		<div>
  			<a onClick={props.toggleChat}>Messages</a>
        <a onClick={props.toggleManagers}>Managers</a>
        <a onClick={props.goHome}>Dashboard</a>
        {
          props.properties.length > 0 &&
          <h2>My Properties</h2>
        }
        {
          props.properties.map((property, i) => {
            return <a 
              className={(property.new) ? "new-property" : ""} 
              key={i} 
              onClick={props.propPage}
              data-index={i}
              id={"mobileLink" + i}
              data-property={property.property}
              data-manager={property.manager}>
                {property.property}
              </a>
          })

        }
        <button onClick={props.togglePropInput}>Add Property</button>
        <a onClick={Meteor.logout}>Logout</a>
  		</div>
  	</div>
  );
}

export default Menu;
