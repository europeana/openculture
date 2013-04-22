exports.data = {
	username : "",
	displayname : "",
	loggedin : false,
	connected : false
}
exports.loaded = false;

exports.set = function(pUsername,pDisplayname,pLoggedin,pConnected) {
	this.data.username = pUsername;
	this.data.displayname = pDisplayname;
	this.data.loggedin = pLoggedin;
	this.data.connected = pConnected;
}
exports.get = function(N) {
	this.populate();
	return this.data;
}
exports.username = function() {
	this.populate();
	return this.data.username;
}
exports.displayname = function() {
	this.populate();
	return this.data.displayname;
}
exports.loggedin = function() {
	this.populate();
	return this.data.loggedin;
}
exports.connected = function() {
	this.populate();
	return this.data.connected;
}

exports.save = function() {
	var ls = require("/helpers/LocalStorage");
	ls.setObject("twitter_state",this.data);
}
exports.load = function() {
	var ls = require("/helpers/LocalStorage");
	var obj = ls.getObject("twitter_state");
	if (obj != null && obj != {}) {
		this.data = obj;		
	}
}
exports.populate = function() {
	if (this.loaded == false) {
		this.load();
	}
}
