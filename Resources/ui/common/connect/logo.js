var globals = require('/ui/common/globals');
var css = require('/ui/common/css');

function fn() {
	var self = Ti.UI.createImageView({
		left:4,
		top:0,
		image : '/images/buttons/logo-connect.png',
		height : 16,
		width : 16
	});
	return self;
	
}

module.exports = fn;
