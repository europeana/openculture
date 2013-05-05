/*
 * Single Window Application Template:
 * A basic starting point for your application.  Mostly a blank canvas.
 * 
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 *  
 */
var globals = require('/ui/common/globals');
//bootstrap and check dependencies
if (Ti.Platform.osname === 'ipad') {
	var ApplicationWindow = require('/ui/ios/ApplicationWindow');
	new ApplicationWindow().open();

	require("/ui/common/globals").set("deviceToken","");
	
	var push = Ti.Network.registerForPushNotifications({
	    types: [
	        Titanium.Network.NOTIFICATION_TYPE_BADGE,
	        Titanium.Network.NOTIFICATION_TYPE_ALERT,
	        Titanium.Network.NOTIFICATION_TYPE_SOUND
	    ],
		callback : function(e) {
	        // alert("Received a push notification\n\nPayload:\n\n"+JSON.stringify(e.data));
		},
		error : function(e) {
			// alert(e)
		},
		success : function(e) {
			// alert(e);
			
			try {
				var deviceToken = e.deviceToken;
				require("/ui/common/globals").set("deviceToken",deviceToken);
	
				var Cloud = require('ti.cloud');
				
				Cloud.Users.login({
				    login: 'acs1',
				    password: 'acs1'
				}, function (e) {
				    if (e.success) {
				        var user = e.users[0];
				        // alert('Success:\\n' +
				            // 'id: ' + user.id + '\\n' +
				            // 'first name: ' + user.first_name + '\\n' +
				            // 'last name: ' + user.last_name);
				            
				            
						Cloud.PushNotifications.subscribe({
					    	channel: 'general',
					    	device_token: deviceToken
					    }, function (e) {
						    if (e.success) {
//						        alert('Success for global channel');
						    } else {
						        // alert('Error global:\\n' + ((e.error && e.message) || JSON.stringify(e)));
						    }
						
							Cloud.PushNotifications.subscribe({
						    	channel: "uuid-"+require("/ui/common/globals").getuuid(),
						    	device_token: deviceToken
						    }, function (e) {
							    if (e.success) {
							        // alert('Success for uuid');
							    } else {
							        // alert('Error uuid:\\n' + ((e.error && e.message) || JSON.stringify(e)));
							    }
							});				            
						});	
				    } else {
				        // alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
				    }
				});	
			} catch (err) {
				// alert('Error in Cloud:\\n' + (JSON.stringify(err)));
			}
			
			
			
		}
	});

} else if (Ti.Platform.osname === 'mobileweb') {
	var ApplicationWindow = require('/ui/ios/ApplicationWindow');
	new ApplicationWindow().open();

} else {

	alert(Ti.Platform.osname + ' is not yet supported by this template');
}

var gps = require("/services/gps");
gps.start();
Titanium.App.fireEvent("redisplay-search",{});