exports.growl = function(TXT, FN) {
	var w = Ti.UI.createWindow({
	});
	// w.add(Ti.UI.createView({
		// backgroundColor : "#ff0000",
		// opacity : 0.7
	// }));
	var v = Ti.UI.createView({
		width : '300',
		height : '100',
		top : 200,
		backgroundColor : "#666666",
		borderRadius : 16,
		borderColor : "#666666",
		borderWidth : 4,
		opacity : 1
	});
	var l = Ti.UI.createLabel({
		text : TXT,
		font : {
			fontSize : 18
		},
		color : "#ffffff"
	});
	v.add(l);
	w.add(v);
	w.open();
	var growl_close = function() {
		w.close();
	};
	var growl_fade = function() {
		v.animate({opacity : 0.2, duration:2000}, growl_close);
		if (FN) FN.call(this,{});
	}
	setTimeout(growl_fade,2000);
}	
