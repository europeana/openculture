//	http://code.google.com/p/oauth-adapter/wiki/UsageManualR4
Ti.include('/helpers/oauth_adapter.js');

function twitter() {
	this.oAuthAdapter = null;
	this.receivePin = null;
};

twitter.prototype.receivePin2 = function() {
	// get the access token with the provided pin/oauth_verifier
	this.oAuthAdapter.getAccessToken('http://twitter.com/oauth/access_token');
	// save the access token
	this.oAuthAdapter.saveAccessToken('twitter');
};

twitter.prototype.runQuery = function(FN,MESS) {
	if (this.oAuthAdapter == null) {
		this.oAuthAdapter = new OAuthAdapter(
	        'qxgCLOFD2OySaGi6ap0rQIsC9rPpxuSDPMQ24LIdIXA',
	        'CuILKyM75vt3yucQGyswOQ',
	        'HMAC-SHA1');
	}

	this.oAuthAdapter.loadAccessToken('twitter');

	if (FN == "me") {	
		var userClass = require("/helpers/twitter/user");
		var user = new userClass("twitter");
		
		var resp = this.oAuthAdapter.sendraw('https://api.twitter.com/1/account/settings.json', []);
		if (resp && resp != null) {
			var data = JSON.parse(resp.responseText);
			user.username = data.screen_name;
			user.loggedin = true;	
		}
		return user;
	} else if (FN == "logout") {	
		var userClass = require("/helpers/twitter/user");
		var user = new userClass("twitter");
		
		var resp = this.oAuthAdapter.sendraw('https://api.twitter.com/1/account/end_session.json', []);
		this.oAuthAdapter.removeAccessToken("twitter");
		
		return user;

	} else if (FN == "connect") {	
		this.oAuthAdapter.showAuthorizeUI('https://api.twitter.com/oauth/authorize?' + this.oAuthAdapter.getRequestToken('https://api.twitter.com/oauth/request_token'), this.receivePin2, this);
		return;
	} else if (FN == "post") {	
		this.oAuthAdapter.send('https://api.twitter.com/1/statuses/update.json', [['status', MESS]], 'Twitter', 'Published.', 'Not published.');
		
	} else {
//		this.oAuthAdapter.send('https://api.twitter.com/1/statuses/update.json', [['status', 'hey @ziodave, I successfully posted a link to vistory http://www.vistory.nl/index.jsp?USMID=1&movie=oai:openimages.eu:20424 @Vistory_app']], 'Twitter', 'Published.', 'Not published.');
	}
	// if the client is not authorized, ask for authorization. the previous tweet will be sent automatically after authorization
	if (this.oAuthAdapter.isAuthorized() == false) {
	    // show the authorization UI and call back the receive PIN function
		this.oAuthAdapter.showAuthorizeUI('https://api.twitter.com/oauth/authorize?' + this.oAuthAdapter.getRequestToken('https://api.twitter.com/oauth/request_token'), this.receivePin2, this);

	}
}	

module.exports = twitter;

