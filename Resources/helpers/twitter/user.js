function user(TYPE) {
	this.type = TYPE;
	this.name = "";
	this.username = "";
	this.picture = "";
	this.loggedin = false;
	this.connected = false;
}

module.exports = user;
