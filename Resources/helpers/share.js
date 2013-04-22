/**
 * V1.0
 * 
 */

exports.iosversion = function(){
    if (Titanium.Platform.name == 'iPhone OS'){
        var version = Titanium.Platform.version.split(".");
        var major = parseInt(version[0]);
        return major;
    }
    return 0;
}

exports.facebook = function(message, image, url, onlytest) {

	/**
	 * usage : 
	 * 
	 * include : dk.napp.social v1.1 upwards
	 * 
	 * require("/helpers/social/share").facebook(twitconf.default_text,"",twitconf.default_link);
	 * 
	 */
	

	if (Ti.Platform.osname === 'android') {
		if (onlytest) return false;

		var intent = Ti.Android.createIntent({
			action: Ti.Android.ACTION_SEND,
			type: "text/plain" 
		});
	
		intent.putExtra(Ti.Android.EXTRA_TEXT, message);
		intent.addCategory(Ti.Android.CATEGORY_DEFAULT);
		Ti.Android.currentActivity.startActivity(intent);	

	} else {
		var version = this.iosversion();
		
		if (version > 5) {
			Ti.Contacts.requestAuthorization(function(callback) {
				var Social = require("dk.napp.social");
				Ti.API.info("ios6 : isFacebookSupported " + Social.isFacebookSupported());
				if(Social.isFacebookSupported()){ //min iOS6 required
				if (onlytest) return true;
		            Social.facebook({
		                text: message,
		                image:image,
		                url:url
		            });
	            }
	        });
		}
		if (onlytest) return false;
	}
}

exports.tweet = function(message, image, url, onlytest) {
	
	/**
	 * usage : 
	 * 
	 * include : dk.napp.social v1.1 upwards
	 * include : com.glimworm.gyro213 v0.6 upwards
	 * 
	 * require("/helpers/social/share").tweet(twitconf.default_text,"",twitconf.default_link);
	 * 
	 */

	if (Ti.Platform.osname === 'android') {
		if (onlytest) return false;
		
		var intent = Ti.Android.createIntent({
			action: Ti.Android.ACTION_SEND,
			type: "text/plain" 
		});
	
		intent.putExtra(Ti.Android.EXTRA_TEXT, message);
		intent.addCategory(Ti.Android.CATEGORY_DEFAULT);
		Ti.Android.currentActivity.startActivity(intent);	

	} else {
		var version = this.iosversion();
		
		if (version > 5) {
			Ti.Contacts.requestAuthorization(function(callback) {
				var Social = require("dk.napp.social");
				Ti.API.info("ios6 : istwittersupported " + Social.isTwitterSupported());
				if(Social.isTwitterSupported()){ //min iOS6 required
					if (onlytest) return true;
		            Social.twitter({
		                text: message,
		                image:image,
		                url:url
		            });
	            }
            });
		} else if (version > 4) {
		
			Ti.Contacts.requestAuthorization(function(callback) {
				Ti.API.debug("callback from authorize contacts");
				Ti.API.debug(callback);
				
				// var module	= require('de.marcelpociot.twitter');
				// module.tweet({
					// message: 	message,
					// urls: 		[],
					// images:		[],
					// succes:		function(){
						// alert("Tweet successfully sent");
					// },
					// cancel:		function(){
						// alert("User canceled tweet");
					// },
					// error:		function(){
						// alert("Unable to send tweet");
					// }
				// });
				// return;

				
				
				var Social5 = require("com.glimworm.gyro213");
				Ti.API.info("social - share - tweet - Which twitter : "+Social5.whichTwitterSupported());
				Ti.API.info("social - share - tweet - Which twitter : continue1");
				
				if (onlytest) return true;
				Ti.API.info("social - share - tweet - Which twitter : continue2");
				Social5.isTwitterSupportedTest8({
				    message: message,
				    images:(image && image != "") ? [image] : [],
				    urls:(url && url != "") ? [url] : []
				});
				Ti.API.info("social - share - tweet - Which twitter : continue3");
			});
		} else {
			if (onlytest) return false;
			
		}
		if (onlytest) return false;
	}
}

exports.ShareButton = function( message, image, url) {
	
	/**
	 * usage : 
	 * 
	 * include : dk.napp.social v1.1 upwards
	 * include : com.glimworm.gyro213 v0.6 upwards
	 * 
	 * require("/helpers/social/share").ShareButton(twitconf.default_text,"",twitconf.default_link).show();
	 * 
	 */
	

	var cantweet = this.tweet(message, image, url,true);
	var canfacebook = this.facebook(message, image, url,true);
	
	var options_label = [];
	var options_type = [];
	if (cantweet == true) {
		options_label.push('Share on Twitter');
		options_type.push('twitter');
	}
	if (canfacebook == true) {
		options_label.push('Share on Facebook');
		options_type.push('facebook');
	}
	options_label.push('Cancel');
	options_type.push('cancel');
	
	var self = Titanium.UI.createOptionDialog({
		cancel: (options_label.length - 1),
		options: options_label,
		message: '',
		title: ''
	});
	
	self.addEventListener('click',function(e) {
		var typ = options_type[e.index];
		
		if (typ == "twitter") {
			require("/helpers/share").tweet(message, image, url);
		}
		if (typ == "facebook") {
			require("/helpers/share").facebook(message, image, url);
			// var _fbc = require("/ui/common/facebook_connect");
			// _fbc.postdialog();
		}
		if (e.index == 2) {
			return;
		}
	});
	
	return self;
	
}