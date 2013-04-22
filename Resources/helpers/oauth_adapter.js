/*
 * ATTENTION: Some efforts has been put in order to produce this code.
 *            If you like and use it consider making a dontation in order
 *            to allow me to do more and provide you with more solutions.
 *
 *            Thanks,
 *            David Riccitelli
 *
 *            To donate, copy and paste this link in your browser:
 * https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=T5HUU4J5EQTJU&lc=IT&item_name=OAuth%20Adapter&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted
 *
 * Copyright 2010 David Riccitelli, Interact SpA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * This library currently works only with Twitter, although I'd like to
 * spend some more time to make it generally compatible with other services
 * too.
 *
 * Sample use with Twitter:

 // create a new OAuthAdapter instance by passing by your consumer data and signature method
 var oAuthAdapter = new OAuthAdapter(
 'your-consumer-secret',
 'your-consumer-key',
 'HMAC-SHA1');

 // load the access token for the service (if previously saved)
 oAuthAdapter.loadAccessToken('twitter');

 // consume a service API - in this case the status update by Twitter
 oAuthAdapter.send('https://api.twitter.com/1/statuses/update.json', [['status','Hey @ziodave, I managed to use the #oauth adapter for @titanium consuming @twitterapi']],'Twitter','Tweet published.','Tweet not published.');

 // if the client is not authorized, ask for authorization. the previous tweet will be sent automatically after authorization
 if (oAuthAdapter.isAuthorized() == false)
 {
	 // this function will be called as soon as the application is authorized
     var receivePin = function() {
		 // get the access token with the provided pin/oauth_verifier
         oAuthAdapter.getAccessToken('https://api.twitter.com/oauth/access_token');
		 // save the access token
         oAuthAdapter.saveAccessToken('twitter');
     };

	 // show the authorization UI and call back the receive PIN function
     oAuthAdapter.showAuthorizeUI('https://api.twitter.com/oauth/authorize?' + oAuthAdapter.getRequestToken('https://api.twitter.com/oauth/request_token'), receivePin);
 }

 */
/*
 * The Adapter needs 2 external libraries (oauth.js, sha1.js) hosted at
 *  http://oauth.googlecode.com/svn/code/javascript/
 *
 * Save them locally in a lib subfolder
 */
Ti.include('/helpers/sha1.js');
Ti.include('/helpers/oauth.js');

// create an OAuthAdapter instance
var OAuthAdapter = function(pConsumerSecret, pConsumerKey, pSignatureMethod)
 {
	
	Ti.API.info('*********************************************');
	Ti.API.info('If you like the OAuth Adapter, consider donating at');
	Ti.API.info('https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=T5HUU4J5EQTJU&lc=IT&item_name=OAuth%20Adapter&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted');
	Ti.API.info('*********************************************');	

    // will hold the consumer secret and consumer key as provided by the caller
    var consumerSecret = pConsumerSecret;
    var consumerKey = pConsumerKey;

    // will set the signature method as set by the caller
    var signatureMethod = pSignatureMethod;

    // the pin or oauth_verifier returned by the authorization process window
    var pin = null;

    // will hold the request token and access token returned by the service
    var requestToken = null;
    var requestTokenSecret = null;
    var accessToken = null;
    var accessTokenSecret = null;

    // the accessor is used when communicating with the OAuth libraries to sign the messages
    var accessor = {
        consumerSecret: consumerSecret,
        tokenSecret: ''
    };

    // holds actions to perform
    var actionsQueue = [];

    // will hold UI components
    var window = null;
    var view = null;
    var webView = null;
    var receivePinCallback = null;
    var receivePinCallbackThis = null;
    var service = null;
    
    this.loadAccessToken = function(pService)
    {
        Ti.API.debug('Loading access token for service [' + pService + '].');
        service = pService;

        var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, pService + '.config');
        if (file.exists == false) return;

        var contents = file.read();
        if (contents == null) return;

        try
        {
            var config = JSON.parse(contents.text);
        }
        catch(ex)
        {
            return;
        }
        if (config.accessToken) accessToken = config.accessToken;
        if (config.accessTokenSecret) accessTokenSecret = config.accessTokenSecret;

        Ti.API.debug('Loading access token: done [accessToken:' + accessToken + '][accessTokenSecret:' + accessTokenSecret + '].');
    };
    this.removeAccessToken = function(pService) {
        Ti.API.debug('Removing access token [' + pService + '].');
        accessToken = null;
    	accessTokenSecret = null;
    	this.saveAccessToken(pService);
        Ti.API.debug('Removing access token : done.');
    };    
    
    this.saveAccessToken = function(pService)
    {
        Ti.API.debug('Saving access token [' + pService + '].');
        var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, pService + '.config');
        if (file == null) file = Ti.Filesystem.createFile(Ti.Filesystem.applicationDataDirectory, pService + '.config');
        file.write(JSON.stringify(
        {
            accessToken: accessToken,
            accessTokenSecret: accessTokenSecret
        }
        ));
        Ti.API.debug('Saving access token: done.');
    };

    // will tell if the consumer is authorized
    this.isAuthorized = function()
    {
        return ! (accessToken == null || accessTokenSecret == null);
    };

    // creates a message to send to the service
    var createMessage = function(pUrl)
    {
        var message = {
            action: pUrl,
            method: 'POST',
            parameters: []
        };
        message.parameters.push(['oauth_consumer_key', consumerKey]);
        message.parameters.push(['oauth_signature_method', signatureMethod]);
        return message;
    };

    // returns the pin
    this.getPin = function() {
        return pin;
    };

    // requests a requet token with the given Url
    this.getRequestToken = function(pUrl)
    {
        accessor.tokenSecret = '';

        var message = createMessage(pUrl);
        OAuth.setTimestampAndNonce(message);
        OAuth.SignatureMethod.sign(message, accessor);

        var client = Ti.Network.createHTTPClient();
        client.open('POST', pUrl, false);
        client.send(OAuth.getParameterMap(message.parameters));

        var responseParams = OAuth.getParameterMap(client.responseText);
        requestToken = responseParams['oauth_token'];
        requestTokenSecret = responseParams['oauth_token_secret'];

        Ti.API.debug('request token got the following response: ' + client.responseText);

        return client.responseText;
    }

    // unloads the UI used to have the user authorize the application
    var destroyAuthorizeUI = function()
    {
        Ti.API.debug('destroyAuthorizeUI');
        // if the window doesn't exist, exit
        if (window == null) return;

        // remove the UI
        try
        {
	        Ti.API.debug('destroyAuthorizeUI:webView.removeEventListener');
            webView.removeEventListener('load', authorizeUICallback);

	        Ti.API.debug('destroyAuthorizeUI:window.close()');
//            window.hide();
            window.close();

	        Ti.API.debug('destroyAuthorizeUI:window.remove(view)');
			window.remove(view);
	        Ti.API.debug('destroyAuthorizeUI:view.remove(webView)');
	        view.remove(webView);
	        Ti.API.debug('destroyAuthorizeUI:nullifying');
	        webView = null;
	        view = null;
	        window = null;
        }
        catch(ex)
        {
            Ti.API.debug('Cannot destroy the authorize UI. Ignoring.');
        }
    };

    // looks for the PIN everytime the user clicks on the WebView to authorize the APP
    // currently works with TWITTER
    var authorizeUICallback = function(e)
    {
        Ti.API.debug('authorizeUILoaded');
        Ti.API.debug(e.source.html);

		var i = e.source.html.indexOf("<code>");
		var code = e.source.html.substring(i+6,i+30);
		code = code.substring(0,code.indexOf("</code>"));
		if (code && code.length > 0) {

            pin = code;

//          if (receivePinCallback) setTimeout(receivePinCallback, 100);
            if (receivePinCallback) setTimeout(function() {
            	if (receivePinCallbackThis) {
            		receivePinCallback.call(receivePinCallbackThis);
            	} else {
            		receivePinCallback();
            	}
            }, 100);

            id = null;
            node = null;

            destroyAuthorizeUI();
            
            return;
			
		}
		
		var xmlDocument = Ti.XML.parseString(e.source.html);
        var nodeList = xmlDocument.getElementsByTagName('div');

        for (var i = 0; i < nodeList.length; i++)
        {
            var node = nodeList.item(i);
            var id = node.attributes.getNamedItem('id');
            if (id && id.nodeValue == 'oauth_pin')
            {
                pin = node.text;

//                if (receivePinCallback) setTimeout(receivePinCallback, 100);
	            if (receivePinCallback) setTimeout(function() {
	            	if (receivePinCallbackThis) {
	            		receivePinCallback.call(receivePinCallbackThis);
	            	} else {
	            		receivePinCallback();
	            	}
	            }, 100);

                id = null;
                node = null;

                destroyAuthorizeUI();

                break;
            }
        }

        nodeList = null;
        xmlDocument = null;

    };

    // shows the authorization UI
    this.showAuthorizeUI = function(pUrl, pReceivePinCallback, pReceivePinCallbackThis)
    {
    	try {
	        receivePinCallback = pReceivePinCallback;
	        receivePinCallbackThis = pReceivePinCallbackThis;
	
	        window = Ti.UI.createWindow({
	//            modal: true,
	//            fullscreen: true
	        });
	        var transform = Ti.UI.create2DMatrix().scale(0);
	        view = Ti.UI.createView({
	            top: 5,
	            width: 310,
	            height: 350,
	            border: 10,
	            backgroundColor: 'white',
	            borderColor: '#aaa',
	            borderRadius: 20,
	            borderWidth: 5,
	            zIndex: -1,
	            transform: transform
	        });
	        closeLabel = Ti.UI.createLabel({
	            textAlign: 'right',
	            font: {
	                fontWeight: 'bold',
	                fontSize: '12pt'
	            },
	            text: '(X)',
	            top: 10,
	            right: 12,
	            height: 14
	        });
	        require("/ui/common/globals").openmodal(window);
			// window.open({
				// modal:true,
				// modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
				// modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
			// });
	//        window.open();
	
	        webView = Ti.UI.createWebView({
	        	top:20,
	            url: pUrl,
				autoDetect:[Ti.UI.AUTODETECT_NONE]
	        });
			Ti.API.debug('Setting:['+Ti.UI.AUTODETECT_NONE+']');
	        webView.addEventListener('load', authorizeUICallback);
	        view.add(webView);
	
	        closeLabel.addEventListener('click', destroyAuthorizeUI);
	        view.add(closeLabel);
	
	        window.add(view);
	
	        var animation = Ti.UI.createAnimation();
	        animation.transform = Ti.UI.create2DMatrix();
	        animation.duration = 500;
	        view.animate(animation);
		} catch (err) {
			Titanium.API.debug(err);
		}
    };

    this.getAccessToken = function(pUrl)
    {
        accessor.tokenSecret = requestTokenSecret;

        var message = createMessage(pUrl);
        message.parameters.push(['oauth_token', requestToken]);
        message.parameters.push(['oauth_verifier', pin]);

        OAuth.setTimestampAndNonce(message);
        OAuth.SignatureMethod.sign(message, accessor);

        var parameterMap = OAuth.getParameterMap(message.parameters);
        for (var p in parameterMap)
        Ti.API.debug(p + ': ' + parameterMap[p]);

        var client = Ti.Network.createHTTPClient();
        client.open('POST', pUrl, false);
        client.send(parameterMap);

        var responseParams = OAuth.getParameterMap(client.responseText);
        accessToken = responseParams['oauth_token'];
        accessTokenSecret = responseParams['oauth_token_secret'];

        Ti.API.debug('*** get access token, Response: ' + client.responseText);

        processQueue();

        return client.responseText;

    };

    var processQueue = function()
    {
        Ti.API.debug('Processing queue.');
        while ((q = actionsQueue.shift()) != null)
        send(q.url, q.parameters, q.title, q.successMessage, q.errorMessage);

        Ti.API.debug('Processing queue: done.');
    };

    // TODO: remove this on a separate Twitter library
    var send = function(pUrl, pParameters, pTitle, pSuccessMessage, pErrorMessage)
    {
        Ti.API.debug('Sending a message to the service at [' + pUrl + '] with the following params: ' + JSON.stringify(pParameters));

        if (accessToken == null || accessTokenSecret == null)
        {

            Ti.API.debug('The send status cannot be processed as the client doesn\'t have an access token. The status update will be sent as soon as the client has an access token.');

            actionsQueue.push({
                url: pUrl,
                parameters: pParameters,
                title: pTitle,
                successMessage: pSuccessMessage,
                errorMessage: pErrorMessage
            });
            return;
        }

        accessor.tokenSecret = accessTokenSecret;

        var message = createMessage(pUrl);
        message.parameters.push(['oauth_token', accessToken]);
        for (p in pParameters) message.parameters.push(pParameters[p]);
        OAuth.setTimestampAndNonce(message);
        OAuth.SignatureMethod.sign(message, accessor);

        var parameterMap = OAuth.getParameterMap(message.parameters);
        for (var p in parameterMap)
        Ti.API.debug(p + ': ' + parameterMap[p]);

        var client = Ti.Network.createHTTPClient();
        client.open('POST', pUrl, false);
        client.send(parameterMap);

        if (client.status == 200) {
        	if (pSuccessMessage == null) {
        		// do nothing
        	} else if (typeof pSuccessMessage === "function") {
        		pSuccessMessage.call(this,client.status,client.responseText);
        	} else {
	            Ti.UI.createAlertDialog({
	                title: pTitle,
	                message: pSuccessMessage
	            }).show();
	         }
        } else if (client.status == 401){
        	// not authorized
        	this.removeAccessToken(service);
        } else if (client.status == 403){
			// message understood but not posted e.c.
        	if (pErrorMessage == null) {
        		// do nothing
        	} else if (typeof pErrorMessage === "function") {
        		pErrorMessage.call(this,client.status,client.responseText);
        	} else {
	            Ti.UI.createAlertDialog({
	                title: pTitle,
	                message: pErrorMessage
	            }).show();
	         }
        } else {
			// message understood but not posted e.c.
        	if (pErrorMessage == null) {
        		// do nothing
        	} else if (typeof pErrorMessage === "function") {
        		pErrorMessage.call(this,client.status,client.responseText);
        	} else {
	            Ti.UI.createAlertDialog({
	                title: pTitle,
	                message: pErrorMessage
	            }).show();
	         }
        }

        Ti.API.debug('*** sendStatus, Response: [' + client.status + '] ' + client.responseText);

        return client.responseText;

    };
    this.send = send;
    
    // TODO: remove this on a separate Twitter library
    var sendraw = function(pUrl, pParameters) {
        if (accessToken == null || accessTokenSecret == null) {
            return null;
        }

        accessor.tokenSecret = accessTokenSecret;

        var message = createMessage(pUrl);
        message.parameters.push(['oauth_token', accessToken]);
        for (p in pParameters) message.parameters.push(pParameters[p]);
        OAuth.setTimestampAndNonce(message);
        OAuth.SignatureMethod.sign(message, accessor);

        var parameterMap = OAuth.getParameterMap(message.parameters);
        for (var p in parameterMap)
        Ti.API.debug(p + ': ' + parameterMap[p]);

        var client = Ti.Network.createHTTPClient();
        client.open('POST', pUrl, false);
        client.send(parameterMap);
        
        return {
        	status : client.status,
        	responseText : client.responseText
        }

    };
    this.sendraw = sendraw;
    

};
