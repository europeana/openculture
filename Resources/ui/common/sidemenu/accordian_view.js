exports.createView = function(obj) {
	
	var animated = false;
	if (obj.animated && obj.animated === true) animated = true;
	
	var content = null;
	if (obj.content) content = obj.content;
	
	
	var view = Ti.UI.createView({
		layout : "vertical",
//		borderColor : "#ff0000",
		height : Ti.UI.SIZE
	});
	var headerview = Ti.UI.createView({
		height : 50,
		backgroundColor : "#ccc"
	});

	if (obj && obj.headerview) {
		headerview = obj.headerview;	
	} else {
		var headertext = Ti.UI.createLabel({
			text : obj.headertext
		})
		headerview.add(headertext);
	}
	
	var mainview = Ti.UI.createView({
		height : 0,
		top : 0,
		width : Ti.UI.FILL,
		backgroundColor : "#333",
		xexpanded : 0
	})
	var open = function() {
		mainview.height = 200;
		mainview.xexpanded = 1;
		headerview.fireEvent("open",{});
		if (content != null) {
			if (typeof content == "string") {
				var lbl = Ti.UI.createLabel({
					text : content
				});
				mainview.add(lbl);
			} else if (typeof content == "object") {
				mainview.add(content);
			} else if (typeof content == "function") {
				mainview.add(content.call(this,(obj.parameters) ? obj.parameters : obj ));
			} else {
				alert(typeof content);
			}
		}
	};
	var close = function() {
		if (mainview.children.length > 0) mainview.remove(mainview.children[0]);
		mainview.height = 0;
		mainview.xexpanded = 0;
		headerview.fireEvent("close",{});
	};
	var slideopen = function() {
		open();
	};
	
	var slideclose = function() {
		close();
	};
	var isopen = function() {
		return (mainview.xexpanded == 1);
	}
	var isclosed = function() {
		return (mainview.xexpanded == 0);
	}
	
	var toggle = function(e) {
		if (isopen()) {
			if (animated == true) slideclose.call(); else close();
		} else {
			if (animated == true) slideopen(); else open();
		}
	}
	headerview.addEventListener('click',toggle);
	view.add(headerview);
	view.add(mainview);
	
	var self = {
		view : view,
		headerview : headerview,
		mainview : mainview,
		animated : animated,
		open : open,
		close : close,
		toggle : toggle
	};
	
	return self;
	
}
