exports.config = {
	Flurry : null
}

exports.log = function (event, obj) {
	/*
	 *  example usage
	 * 
	 * 	require("/helpers/flurry").log("ApplicationStart",{ "osname": Ti.Platform.osname });
	 */

	if (this.config.Flurry == null) {
		this.config.Flurry = require('ti.flurry');
		this.config.Flurry.debugLogEnabled = true;
		this.config.Flurry.eventLoggingEnabled = true;
		this.config.Flurry.initialize("BHYJ6HRTFND3F9NKXYDJ");
		this.config.Flurry.reportOnClose = true;
		this.config.Flurry.sessionReportsOnPauseEnabled = true;
		this.config.Flurry.secureTransportEnabled = false;
	}
    this.config.Flurry.logEvent(event, obj);
}
