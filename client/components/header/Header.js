import React from 'react';
import Burger from './burger/Burger';

const Header = (props) => {
  return (
  	<header className={props.classes}>
  		<div>
  			<h1 onClick={props.goHome}>REACT</h1>
  			<a onClick={props.toggleManagers}>Managers</a>
        <a 
          className="to-home" 
          id="toDashboard" 
          onClick={props.goHome}>Dashboard</a>
  			<Burger 
  				classes={props.burgerClasses}
  				toggleBurger={props.toggleBurger} />
			  <nav className="header-links">
          {
            props.properties.map((property, i) => {
              return <a 
                      key={i} 
                      data-index={i}
                      id={"headerLink" + i}
                      className={(property.new) ? "new-property" : ""} 
                      onClick={props.propPage}
                      data-property={property.property}
                      data-manager={property.manager}>
                        {property.property}
                      </a>
            })
          }
        </nav>
        <button onClick={props.togglePropInput}>Add Property</button>
  		</div>
  	</header>
  );
}

export default Header;
