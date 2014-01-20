var globals = require('/ui/common/globals');
function fn() {

	var search = require('ui/common/SearchWindowV2');
	var self = new search();
	self.exitOnClose = true;
	// self.addEventListener("click", function() {
		// Ti.API.info("jcjc click");
	// });
	return self;
}

//make constructor function the public component interface
module.exports = fn;
