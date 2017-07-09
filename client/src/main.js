import React from 'react';
import theme from './theme.css';
import $ from 'jquery';

import MyDialog from './dialog.js';

import Button from 'react-toolbox/lib/button';
import AppBar from 'react-toolbox/lib/app_bar';
import {Card, CardMedia, CardTitle, CardText, CardActions}  from 'react-toolbox/lib/card';
import Input from 'react-toolbox/lib/input';
import Dialog from 'react-toolbox/lib/dialog';

import Tooltip from 'react-toolbox/lib/tooltip';
import Link from 'react-toolbox/lib/link';

const TooltipLink = Tooltip(Link);
const TooltipButton = Tooltip(Button);



export default class Main extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			name: '',
			message: '', 
			secretMsg: '',
			expiration: '',
			passphrase: '',
			isOpen: false
		};

		this.handlePassphrase = this.handlePassphrase.bind(this);
		this.getData = this.getData.bind(this);

		this.hash = window.location.hash;

	}

	componentWillMount() {
		this.handlePassphrase();
  };

	handleChange(name, value) {
		this.setState({
			[name]:value
		});
	};
	
	handlePassphrase(e) {
		let url = 'https://makemeapassword.org/api/v1/passphrase/plain?pc=1&wc=1&sp=n&minCh=7&ups=4&whenUp=Anywhere';

		
		// this.state.passphrase == 'blabla' ? this.setState({passphrase: 'changed'}) : this.setState({passphrase: 'blabla'})


		$.get(url, (pass) => {
			this.setState({
				passphrase: pass
			})
		})
		.done(function(pass) {
	    console.log( "Successfully retrieved passphrase" );
	  })
	  .fail(function() {
	    console.log( "Unable to retrieve passphrase." );
	  })
	};

	handleEncrypt(mode) {		
		if (this.state.name.length > 0) {
			if(this.state.message.length > 0) {
				$.post('/encrypt', {name: this.state.name,
														message: this.state.message, 
														passphrase: this.hash, 
														expiration: this.state.expiration,
														mode: mode}, 
					(pass) => {
							this.setState({secretMsg: pass, 
														 isOpen: true,
														 name: '', 
														 message: '',
														 expiration: '' 
														})
					})		
			} else {
				alert('Please enter a MESSAGE that has at least one character.')
			}
		} else {
			alert('Please enter a NAME that has at least one character.')
		}
	};


	handleDecrypt() {
		this.setState({isOpen: true})
	};

	getData(val) {
		this.setState({	name: val.name, 
							      message: val.message, 
										expiration: val.expiration,
										isOpen: false
									})
	}

	copyText(text) {
		document.querySelector('#samePass').select();
		document.execCommand('copy');
	}


	render() {
		var isOpen = this.state.isOpen;
		var secretMsg = this.state.secretMsg;
		var message = this.state.message;
		var passphrase = this.state.passphrase;


		return(
			<div>
			  <Card className={theme.Card} theme={theme}>
				  <CardTitle 
			      avatar="https://placeimg.com/80/80/animals"
			      title="Tovia's Enigma"
			    />


					<Input type='text' label='Name' value={this.state.name} onChange={this.handleChange.bind(this, 'name')} required></Input>
					
					<Input type='text' label='Message' value={this.state.message} onChange={this.handleChange.bind(this, 'message')} maxLength={120} required></Input>
					
					<Input type='date' label='Expiration Date' value={this.state.expiration} onChange={this.handleChange.bind(this, 'expiration')}></Input>


        
				  <CardActions>
			      <Button raised label="Encrypt" onClick={this.handleEncrypt.bind(this, 'encrypt')}/>
			      <Button primary label="Decrypt" onClick={this.handleDecrypt.bind(this, 'decrypt')}/>
			    </CardActions>

			  </Card>




			  <p>Your Passphrase :</p>
			  <Input id={'samePass'} value={this.state.passphrase} className={theme.pass} theme={theme} style={{textAlign: 'center'}}>
			  </Input>

			  <TooltipButton className={theme.tooltipButton} theme={theme}  onClick={this.copyText} href={'#'+passphrase} label='Copy' primary raised tooltip tooltipPosition='bottom' tooltip='Click to Copy Passphrase'/>

				<br/>
				<br/>

			  <p id='getPass' onClick={this.handlePassphrase}>Get New Passphrase</p>

				<MyDialog 
					triggerParentUpdate={this.getData} 
					secretMsg={secretMsg} 
					isOpen={isOpen} 
					passphrase={this.hash} 
				/>

			</div>
		);
	};
};
			  

