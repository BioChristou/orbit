/*
Copyright (C) 2015 Electronic Arts Inc.  All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

1.  Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.
2.  Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.
3.  Neither the name of Electronic Arts, Inc. ("EA") nor the names of
    its contributors may be used to endorse or promote products derived
    from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY ELECTRONIC ARTS AND ITS CONTRIBUTORS "AS IS" AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL ELECTRONIC ARTS OR ITS CONTRIBUTORS BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

'use strict';

// Get the main container
var Container =  $("#container")[0];

// Render page helper
var RenderPage = function(e)
{
	ReactDOM.render(e, Container);
};

// Chat Class
class ChatSystem
{
	constructor()
	{
		this.sessionInfo = {"username": null, "sessionId": null};
		this.socket = null;
	}

	createSession(username)
	{
		RenderPage(<StatusMessage message="Authenticating..." />);

		var loginRequest = {"username": username};

		$.ajax("./chat/user", {
    	data : JSON.stringify(loginRequest),
    	contentType : 'application/json',
    	type : 'POST',
		})
		.done((data) =>
		{
			this.sessionInfo.username = data.username;
			this.sessionInfo.sessionId = data.sessionId;
			this.connectWebSocket();
		})
		.fail((data) =>
		{
			RenderPage(<LoginForm errorMessage="Invalid username. It may be taken." />)
		});
	}

	connectWebSocket()
	{
		RenderPage(<StatusMessage message="Connecting..." />);

		var parser = document.createElement('a');
		parser.href = window.location.href;
		var serviceLocation = (parser.protocol == "https" ? "wss" : "ws") + "://" + parser.host + "/chat/ws";

		this.socket = new WebSocket(serviceLocation);

		this.socket.onopen = (event) => { this.onOpen(event); }
		this.socket.onmessage = (event) => { this.onMessage(event); }
		this.socket.onerror = (event) => { this.onError(event); }
		this.socket.onclose = (event) => { this.onClose(event); }

	}

	onOpen(event)
	{

	}

	onMessage(event)
	{

	}

	onError(event)
	{

	}

	onClose(event)
	{

	}
}

var Chat = new ChatSystem();

// Login Page
var LoginForm = React.createClass({
	getInitialState: function()
	{
	    return {username: ''};
	},

	render: function()
	{
		return <div id="loginForm">
			<form onSubmit={this.handleSubmit}>
				<p>Please enter your name to continue:</p>
				<label htmlFor="name">Username:</label>
				<input type="text" name="username" id="username" value={this.state.username} onChange={this.handleUsernameChange}/>
				<input type="submit" name="enter" id="enter" value="Enter" />
				<p className="errorRed">{this.props.errorMessage}</p>
			</form>
		</div>;
	},

	handleUsernameChange: function(e)
	{
		this.setState({username: e.target.value});
	},

	handleSubmit: function(e)
	{
		e.preventDefault();

		Chat.createSession(this.state.username);
	}
});

// Connecting
var StatusMessage = React.createClass({
	render: function()
	{
		return <p>{this.props.message}</p>;
	}
});

// Chat Page
var ChatMenu = React.createClass({
	render: function()
	{
		return <div id="menu">
				<p className="welcomeMessage">Welcome, <b>{this.props.username}</b>.</p>
				<p className="logoutMessage"><a id="exit" onClick={this.onExit}>Exit Chat</a></p>
				<div className="clearStyle"></div>
		</div>;
	},

	onExit: function(e)
	{
		e.preventDefault();

		alert('On Exit');
	}
});

var ChatBox = React.createClass({
	render: function()
	{
		return <div id="chatBox"></div>;
	}
});

var ChatInput = React.createClass({
	getInitialState: function()
	{
			return {chatMessage: ''};
	},

	render: function()
	{
		return <form onSubmit={this.handleSubmit}>
			<input name="chatMessage" type="text" id="chatMessage" size="63" onChange={this.handleMessageChange} />
			<input name="submitMessage" type="submit"  id="submitMessage" value="Send"/>
		</form>;
	},

	handleMessageChange: function(e)
	{
		this.setState({chatMessage: e.target.value});
	},

	handleSubmit: function(e)
	{
		e.preventDefault();

		alert('Send Message: ' + this.state.chatMessage);
	}
});


var ChatPage = React.createClass({
	render: function()
	{
		return <div>
			<ChatMenu username={this.props.username} />
			<ChatBox />
			<ChatInput />
		</div>;
	}
});

// Show Login Form on load
$(document).ready(function()
{
	RenderPage(<LoginForm/>);
});
