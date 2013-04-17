/**
 * this is a background service and this code will run *every* time the 
 * application goes into the foreground
 */
Ti.API.info("hello from a background service");

// var notification = Ti.App.iOS.scheduleLocalNotification({
	// alertBody:"Kitchen Sink was put in background",
	// alertAction:"Re-Launch!",
	// userInfo:{"hello":"world"},
	// sound:"pop.caf",
	// date:new Date(new Date().getTime() + 3000) // 3 seconds after backgrounding
// });

// we cancel our notification if we don't want it to continue
// notification.cancel(); 
var $bg = {};

Ti.App.fireEvent("state_bg",{});

var notifications = [];
var notificationcnt = 0;
var cition_notify = function(e) {
	try {
//		Titanium.App.iOS.cancelAllLocalNotifications();

		if (notificationcnt > 0) {
//LocalNotification(notifications[notificationcnt-1]);
			if (notifications[notificationcnt-1] != null) {
				notifications[notificationcnt-1].cancel();
				notifications[notificationcnt-1] = null;
			}
		}		
		notifications[notificationcnt] = Ti.App.iOS.scheduleLocalNotification({
			alertBody:"Uw parkeertijd vervalt in "+e.cition_text+" minuten",
			alertAction:"Re-Launch text (cnt:"+notificationcnt+")",
			userInfo:{},
			sound : 'Cell Phone Ringing.caf',
//			sound:"pop.caf",
			date:new Date(new Date().getTime() + 2000) // 3 seconds after backgrounding
		});
		notificationcnt++;
	} catch (err) {
		Ti.API.debug({from:'bg notify', err:err, e:e});
	}
}
Ti.App.addEventListener("cition_notify", cition_notify);



// Ti.App.iOS.addEventListener('notification',function(){
// 	
	// Ti.API.debug("[BG_SERVICE] local notification received via NOTIFICATION: ");
	// Ti.API.info('C background event received = '+$bg.notification);
	// // var player = Ti.Media.createSound({url:"cars012.wav"});
	// // player.play();
	// // Ti.App.currentService.stop();
	// // Ti.App.currentService.unregister();
// });

Ti.App.currentService.addEventListener('stop',function()
{
	Ti.API.info("background service is stopped");
	Ti.App.removeEventListener("cition_notify", cition_notify);
	Titanium.App.iOS.cancelAllLocalNotifications();
	// notifications = [];
	// notificationcnt = 0;
	Ti.App.fireEvent("state_fg",{});
});

// we need to explicitly stop the service or it will continue to run
// you should only stop it if you aren't listening for notifications in the background
// to conserve system resources. you can stop like this:

//Ti.App.currentService.stop();


// you can unregister the service by calling 
// Ti.App.currentService.unregister() 
// and this service will be unregistered and never invoked again