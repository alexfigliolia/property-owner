import React, { Component } from 'react';
import { CloudConfig, AxiosConfig } from './CloudConfig';
import axios from 'axios';

export default class IssueImages extends Component {
  
  focusUpload = (e) => this.refs.upload.focus();

	handleImage = () => {
    const imgs = this.refs.upload.files;
    const img = imgs[imgs.length - 1];
    const fd = new FormData();
    fd.append('upload_preset', CloudConfig.preset);
	  fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
	  fd.append('file', img);
    axios.post(CloudConfig.url, fd, AxiosConfig)
	  .then(res => {
	    let url = res.data.secure_url.split('/');
      url.splice(-2, 0, 'q_auto/f_auto/w_800,c_fill');
      url = url.join('/');
	    Meteor.call('issue.addImage', this.props.id, url, (err, res) => {
	    	if(err) console.log(err);
	    });
	  }).catch(err => console.log(err) );
  }

  render = () => {
    return (
    	<section className={this.props.classes}>
    		<div>
    			<h2>Service Item:</h2>
    			<p>{this.props.issue.length > 0 ? this.props.issue[0].issue : ''}</p>
    			<div className="images">
    				{
    					this.props.issue.length > 0 &&
    					this.props.issue[0].images.map((img, i) => {
    						return (
    							<img 
    								key={i} 
    								src={img} 
    								alt="image of item needing service" />
    						);
    					})
    				}
    			</div>
    			<div 
    				className="upload"
    				onClick={this.focusUpload}>
    				<input 
							ref="upload"
							type="file" 
							name="myImage" 
							accept="image/*" 
							onChange={this.handleImage} />
    			</div>
    		</div>
    	</section>
    );
  }
}
