
function LocalStorage() {
	
}

LocalStorage.prototype.setObject = function(key,ob){
	try{
		Titanium.App.Properties.setString(key,JSON.stringify(ob));
	} catch (e) {
	}
};

LocalStorage.prototype.getObject = function(key){
	try{
		return JSON.parse(Titanium.App.Properties.getString(key));
	} catch (e) {
	}
	return {};
};
LocalStorage.prototype.setString = function(key,ob){
	try{
		Titanium.App.Properties.setString(key,ob);
	} catch (e) {
	}
};

LocalStorage.prototype.getString = function(key){
	try{
		return Titanium.App.Properties.getString(key);
	} catch (e) {
	}
	return "";
};


module.exports = LocalStorage;
module.exports.setObject = function(key,ob){
	try{
		Titanium.App.Properties.setString(key,JSON.stringify(ob));
	} catch (e) {
	}
};

module.exports.getObject = function(key){
	try{
		return JSON.parse(Titanium.App.Properties.getString(key));
	} catch (e) {
	}
	return {};
};
module.exports.setString = function(key,ob){
	try{
		Titanium.App.Properties.setString(key,ob);
	} catch (e) {
	}
};

module.exports.getString = function(key){
	try{
		return Titanium.App.Properties.getString(key);
	} catch (e) {
	}
	return "";
};
