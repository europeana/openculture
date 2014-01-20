var globals = require('/ui/common/globals');
var css = require('/ui/common/css');

function fn() {

	var LL = function(txt) {
		try {
			var rv = L(txt.replace(" ","_"));
			if (rv == "") return txt;
			return rv;
		} catch (E) {
			return txt;			
		}
	};

	var self = Ti.UI.createView({
		right:55,
		top:1, 
		height : 38, 
		touchEnabled : true,
		width:100,
		backgroundColor : "#4C7ECF"
	});
	var image = Ti.UI.createImageView({
		right:0,
		top:0, 
		height : 38, 
		touchEnabled : false,
		width:100,
		image:'/images/button_connect_left.png'
	});
	self.add(image);
	
	var txt = Ti.UI.createLabel({
		text : LL("sidenav_connect"),
		top : 10,
		left : 40,
		font : {
			fontSize : 14,
			fontWeight:'bold'
		},
		textAlign : "left",
		touchEnabled : false,
		color : "#ffffff"
	});
	self.add(txt);
	
	return self;
	
}

module.exports = fn;
