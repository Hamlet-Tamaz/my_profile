import React from 'react'
import theme from './theme.css';
import $ from 'jquery';

import Button from 'react-toolbox/lib/button';
import {Card, CardMedia, CardTitle, CardText, CardActions}  from 'react-toolbox/lib/card';
import Input from 'react-toolbox/lib/input';
import Dialog from 'react-toolbox/lib/dialog';


export default class MyDialog extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			secretMsg: this.props.secretMsg,
	    active: this.props.isOpen,
	    passphrase: this.props.passphrase,
	    message: '',
	    expiration: ''
	  };		
	  
	  this.handleToggle = this.handleToggle.bind(this);
	  this.handleDecrypt = this.handleDecrypt.bind(this);

	  this.actions = [
	    { label: "Close", onClick: this.handleToggle },
	    { label: "Decrypt", onClick: this.handleDecrypt }
	  ];

	  this.hash = window.location.hash;
	};

	componentWillReceiveProps(newProps) {
		this.setState({secretMsg: newProps.secretMsg, active: newProps.isOpen})
	}
	
	handleChange(name, value) {
		this.setState({
			[name]:value
		});
	};

  handleToggle(){
    this.setState({active: !this.state.active});
  }

  handleDecrypt() {
		$.post('/encrypt', {secretMsg: this.state.secretMsg, 
												passphrase: this.hash}, 
			(dec) => {

					if(dec.error) {
						alert(dec.error);
					} else {
						this.setState({name: dec.name, 
												 message: dec.message, 
												 expiration: dec.expiration,
												 secretMsg: dec.secretMsg,
												})
					}
					
			this.props.triggerParentUpdate(this.state);

		}, 'json')
  }


  render () {

    return (
      <div>
        <Dialog
          actions={this.actions}
          active={this.state.active}
          onEscKeyDown={this.handleToggle}
          onOverlayClick={this.handleToggle}
          title='De/Encryption'>
					
					<Input type='text' label='Message' value={this.state.secretMsg} onChange={this.handleChange.bind(this, 'secretMsg')} multiline={true} rows={5} required></Input>

        </Dialog>
    	</div>
    )
  }
}
        
