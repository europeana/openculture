exports.config = {
	Flurry : null
}

exports.log = function (event, obj) {
	/*
	 *  example usage
	 * 
	 * 	require("/helpers/flurry").log("ApplicationStart",{ "osname": Ti.Platform.osname });
	 * 
	 *  	Flurry.logTimedEvent('timedClick');
	 *		Flurry.endTimedEvent('timedClick');
	 * 		Flurry.setAge(34);
	 * 		Flurry.setUserId('John Doe');
	 * 		Flurry.setGender('m');
	 *		Flurry.logAllPageViews();
	 *		// manually log a transition
	 * 		Flurry.logPageView();
	 */

	if (this.config.Flurry == null) {
		this.config.Flurry = require('com.onecowstanding.flurry');
		this.config.Flurry.appVersion = Ti.App.version;
		this.config.Flurry.debugLogEnabled = true;
		this.config.Flurry.eventLoggingEnabled = true;
		this.config.Flurry.sessionReportsOnCloseEnabled = true;
		this.config.Flurry.sessionReportsOnPauseEnabled = true;
		this.config.Flurry.sessionReportsOnActivityChangeEnabled = true;
		this.config.Flurry.secureTransportEnabled = false;
		this.config.Flurry.startSession('BHYJ6HRTFND3F9NKXYDJ');		/* <-- PUT YOUR API KEY HERE */
	}
    this.config.Flurry.logEvent(event, obj);
}
