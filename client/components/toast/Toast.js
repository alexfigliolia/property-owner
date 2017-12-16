import React, { Component } from 'react';

export default class Toast extends Component {
	render = () => {
		return (
	  	<div
	  		onClick={this.props.hideToast}
	  		onTouchStart={this.props.hideToast} 
	  		className={this.props.classes}>
	  		<div>
	  			<h3>{this.props.title}</h3>
	  			<p>{this.props.message}</p>
	  		</div>
	  	</div>   
	  );
	}
}

