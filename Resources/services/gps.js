exports.updatedlocation = {};
exports.updatedlocationrunning = false;

exports.setLocation = function(e) {
	this.updatedlocation.longitude = e.coords.longitude;
	this.updatedlocation.latitude = e.coords.latitude;
	this.updatedlocation.latitudeDelta = 0.01;
	this.updatedlocation.longitudeDelta = 0.01;
	this.updatedlocation.heading = e.coords.heading;
	this.updatedlocation.altitude = e.coords.altitude;
	this.updatedlocation.accuracy = e.coords.accuracy;
	this.updatedlocation.speed = e.coords.speed;
	this.updatedlocation.timestamp = e.coords.timestamp;
	this.updatedlocation.altitudeAccuracy = e.coords.altitudeAccuracy;
};

exports.setHeading = function(e) {
	this.updatedlocation.hx = e.heading.x;
	this.updatedlocation.hy = e.heading.y;
	this.updatedlocation.hz = e.heading.z;
	this.updatedlocation.magneticHeading = e.heading.magneticHeading;
	this.updatedlocation.trueHeading = e.heading.trueHeading;
};

exports.setHeadingFromAccelerometer = function(e) {
	this.updatedlocation.timestamp = e.timestamp;
	this.updatedlocation.x = e.x;
	this.updatedlocation.y = e.y;
	this.updatedlocation.z = e.z;
};

exports.start = function() {
	this.getLocation(function() {});
};

exports.getLocation = function(fn) {

	var versions = require('/services/versions');

	if (this.updatedlocationrunning == true) {
		fn(this.updatedlocation);
		return;
	}
	
	Ti.Geolocation.preferredProvider = "gps";
	
	

	if (versions.isIPhone3_2_Plus()) {
		//NOTE: starting in 3.2+, you'll need to set the applications
		//purpose property for using Location services on iPhone
		Ti.Geolocation.purpose = "Europeana Open Culture";
	}
	
	if (Titanium.Geolocation.locationServicesEnabled==false) {
		// cannot get locaiton
	} else {
		if (Titanium.Platform.name != 'android') {
			var authorization = Titanium.Geolocation.locationServicesAuthorization;
			Ti.API.info('Authorization: '+authorization);
			if (authorization == Titanium.Geolocation.AUTHORIZATION_DENIED) {
				// must allow geo
				Titanium.UI.createAlertDialog({title:'Kitchen Sink', message:'Your device has geo turned off - turn it on.'}).show();
			} else if (authorization == Titanium.Geolocation.AUTHORIZATION_RESTRICTED) {
				// must allow geo
				Titanium.UI.createAlertDialog({title:'Kitchen Sink', message:'Your device has geo turned off - turn it on.'}).show();
			}
		} else {
			Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
//			Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_NETWORK;
		}
		//
		//  SET ACCURACY - THE FOLLOWING VALUES ARE SUPPORTED
		//
		Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;

		//
		//  SET DISTANCE FILTER.  THIS DICTATES HOW OFTEN AN EVENT FIRES BASED ON THE DISTANCE THE DEVICE MOVES
		//  THIS VALUE IS IN METERS
		//
		Titanium.Geolocation.distanceFilter = 10;

		//
		// GET CURRENT POSITION - THIS FIRES ONCE
		//
		Titanium.Geolocation.getCurrentPosition(function(e) {

			try {
				if (!e.success || e.error) {
					this.updatedlocation.text = 'error: ' + JSON.stringify(e.error);
					Ti.API.info("Code translation: "+(e.code));
					alert('geo error ' + JSON.stringify(e.error));
					return;
				}
			} catch (err) {
				alert(JSON.stringify(e));
				alert(JSON.stringify(err));
				return;
			}
			var gps = require('/services/gps');
			gps.setLocation(e);
			fn(gps.updatedlocation);
		});

		var locationCallbackH = function(e) {
			if (!e.success || e.error) return;
			Ti.API.info("locationcallbackH");
			var gps = require('/services/gps');
			gps.setHeading(e);
			fn(gps.updatedlocation);
			Ti.App.fireEvent("gps_headingchange",gps.updatedlocation);
		}
		
		var accelerometerCallback = function(e) {
			Ti.API.info("locationCallbackAccelerometer");
			var gps = require('/services/gps');
			gps.setHeadingFromAccelerometer(e);
			fn(gps.updatedlocation);
			Ti.App.fireEvent("gps_accelerometerchange",gps.updatedlocation);
		}

		var locationCallback = function(e) {
			if (!e.success || e.error) return;
			Ti.API.info("locationcallback");
			var gps = require('/services/gps');
			gps.setLocation(e);
			gps.updatedlocationrunning = true;
			Ti.App.fireEvent("gps_locationchange",gps.updatedlocation);
		};
		
		Titanium.Geolocation.addEventListener('location', locationCallback);
		//Titanium.Geolocation.addEventListener('heading', locationCallbackH);	/* not necessary in this app */
		//Ti.Accelerometer.addEventListener('update', accelerometerCallback);	/* not necessary in this app */
		
	}
};

exports.RadToDeg = function (radians) {
	return radians * (180 / Math.PI);
}
exports.DegToRad = function (degrees) {
	return degrees * (Math.PI / 180);
}

exports.distance = function(loc1, loc2) {
    var lat1 = this.DegToRad(loc1.latitude);
    var lon1 = this.DegToRad(loc1.longitude);
    var lat2 = this.DegToRad(loc2.latitude);
    var lon2 = this.DegToRad(loc2.longitude);

    var R = 6371000000; // m (change this constant to get miles)
    var dLat = (lat2-lat1) * Math.PI / 180;
    var dLon = (lon2-lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return Math.round(d/2);
};

/**
 * Get the screen boundaries as latitude and longitude values 
 */
exports.getMapBounds = function(region) {
    var b = {};
    b.northWest = {}; b.northEast = {};
    b.southWest = {}; b.southEast = {};

	b.loc = {}
    b.loc.latitude = region.latitude;
    b.loc.latitudeDelta = region.latitudeDelta;
    b.loc.longitude = region.longitude;
    b.loc.longitudeDelta = region.longitudeDelta;
 
    b.northWest.lat = parseFloat(region.latitude) + parseFloat(region.latitudeDelta) / 2.0;
    b.northWest.lng = parseFloat(region.longitude) - parseFloat(region.longitudeDelta) / 2.0;
 
    b.southWest.lat = parseFloat(region.latitude) - parseFloat(region.latitudeDelta) / 2.0;
    b.southWest.lng = parseFloat(region.longitude) - parseFloat(region.longitudeDelta) / 2.0;
 
    b.northEast.lat = parseFloat(region.latitude) + parseFloat(region.latitudeDelta) / 2.0;
    b.northEast.lng = parseFloat(region.longitude) + parseFloat(region.longitudeDelta) / 2.0;
 
    b.southEast.lat = parseFloat(region.latitude) - parseFloat(region.latitudeDelta) / 2.0;
    b.southEast.lng = parseFloat(region.longitude) + parseFloat(region.longitudeDelta) / 2.0;

    b.north = parseFloat(region.latitude) + parseFloat(region.latitudeDelta) / 2.0;
    b.east = parseFloat(region.longitude) + parseFloat(region.longitudeDelta) / 2.0;
    b.south = parseFloat(region.latitude) - parseFloat(region.latitudeDelta) / 2.0;
    b.west = parseFloat(region.longitude) - parseFloat(region.longitudeDelta) / 2.0;

 
    return b;
}


exports.formatDistance = function(num) {
    num = isNaN(num) || num === '' || num === null ? 0.00 : num;
    return parseFloat(num/10000).toFixed(2)+"km";
}
