var gwdb = require('/helpers/gwdb');
var globals = require('/ui/common/globals');
var css = require('/ui/common/css');

function fn(TXT) {

	var _state = {
		state : 0
	}
	this.state = _state;
	this.cnt = 0;
	this.setstateOpen = function(from) {
		try {
			this.state.state = 1
		} catch (e) {
			Ti.API.debug({fn:'AlertWin',from:from,e:e});
		}
		try {
			this.cnt = 0;
		} catch (e) {
			Ti.API.debug({fn:'AlertWin',from:from,e:e});
		}
	};
	this.setstateClosed = function(from) {
		try {
			this.state.state = 0
		} catch (e) {
			Ti.API.debug({fn:'AlertWin',from:from,e:e});
		}
		try {
			this.cnt = 0;
		} catch (e) {
			Ti.API.debug({fn:'AlertWin',from:from,e:e});
		}
	};
	
	var self = Titanium.UI.createWindow({
    	navBarHidden: false,
    	backgroundColor:'transparent',
    	// backgroundColor:"#fff",
		// backgroundGradient: css.WINGRAD2,
		// opacity : 0.5,
    	barColor : css.BARCOLOUR,
    	top : 0,
    	bottom : 0,
    	left : 0,
    	right : 0,
    	title : TXT
	});

	var underlay = Titanium.UI.createView({
//    	backgroundColor:"#000",
    	backgroundImage : "/images/wallpapers/wallpaper_3_1280x800.jpg",
		opacity : 0.9,
    	top : 0,
    	bottom : 0,
    	left : 0,
    	right : 0
	});
	
	var BLUE = "#0F2597";
	var label = Titanium.UI.createLabel({left : 20, right : 20, top:20});
	var label0 = Titanium.UI.createLabel({backgroundColor : BLUE, color:"#fff", textAlign:"center", text : "ALERT",left:0,right:0,height:40});

	var table = Titanium.UI.createTableView({left:10,top:10,right:10,bottom:10, borderWidth:5, borderRadius:20, borderColor:css.blue});
	var view = Titanium.UI.createView({left:10,top:10,right:10,bottom:10, backgroundColor : "#fff", borderWidth:5, layout : 'vertical', borderRadius:20, borderColor:css.blue});
	
	var but1 = Titanium.UI.createButton({
		title : "Breng me naar de auto",
		left : 20, right : 20,
		top:40,
		height: 40,
		backgroundColor : BLUE,
		style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
		bottom : null,
		borderRadius : 10,
		borderWidth : 0
	});
	var gotomap = function(e) {
		Titanium.App.fireEvent("close_all_windows",{});
		Titanium.App.fireEvent("goto_map",{});
		self.close();
		_state.state = 0;
		globals.gototab(0);
	}
	but1.addEventListener("click", gotomap);
	
	var but2 = Titanium.UI.createButton({
		title : "Naar dichtstbijzijnde automaat om parkeertijd te verlengen",
		left : 20, right : 20,
		top:20,
		height: 40,
		backgroundColor : BLUE,
		style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
		bottom : null,
		borderRadius : 10,
		borderWidth : 0
	});
	but2.addEventListener("click", gotomap);

	var but3 = Titanium.UI.createButton({
		title : "Ignore",
		left : 20, right : 20,
		top:20,
		height: 40,
		backgroundColor : BLUE,
		style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
		bottom : null,
		borderRadius : 10,
		borderWidth : 0
	});
	var closewin = function(e) {
		Titanium.App.fireEvent("close_all_windows",{});
		self.close();
		_state.state = 0;
	}
	but3.addEventListener("click", closewin);
//	Titanium.App.addEventListener("close_all_windows",closewin);
	
	self.add(underlay);
	self.add(view);
	view.add(label0);
	view.add(label);
	view.add(but1);
	view.add(but2);
	view.add(but3);
//	self.add(table);
	
	var button = Titanium.UI.createButton({
		title : 'close'
	});
	button.addEventListener('click', closewin)

	var button_ok = Titanium.UI.createButton({
		title : 'close'
	});
	var okwin = function(e) {
		Titanium.App.fireEvent("close_all_windows",{});
		self.close();
		_state.state = 0;
		globals.gototab(0);
	}
	table.addEventListener('click', okwin)
	label.addEventListener('click', okwin)
	view.addEventListener('click', okwin)

	
	self.leftNavButton = button;
//	self.rightNavButton = button_ok;
//	self.addEventListener('close', this.setstateClosed);
//	self.addEventListener('open', this.setstateOpen);
	
	this.win = self;
	this.lbl = label;
	this.tbl = table;
	this._view = view;
	
	
}

module.exports = fn;
fn.prototype.getView = function() {
	return this._view;
}
fn.prototype.close = function() {
	if (this.state.state == 1) {
		this.win.close();
		this.setstateClosed()
	}
}
fn.prototype.open_nomessage = function() {

	require("/ui/common/globals").set("notifications","N");
	var notifyClass = require("/helpers/notify");

	var alerts = notifyClass.get();
	var txt = "";
	if (alerts && alerts.length > 0) {
		var alert = alerts[alerts.length-1];
		txt = alert.msg;
	}
	
	var rows = notifyClass.getrows();
	
	if (this.state.state == 0) {
		this.win.title = "Alarm!";
		this.lbl.text = txt;
		this.win.open({
			modal:false,
			modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
			modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
		});
		this.setstateOpen.call(this,"prototype open")
	} else {
		this.cnt++
		this.win.title = "Alarm!";		
		this.lbl.text = txt;
	}
}
fn.prototype.open = function(SEVERITY,TXT,MSG) {
	var notifyClass = require("/helpers/notify");
	notifyClass.notify(SEVERITY,TXT,MSG);
	
	if (globals.get("app_in") == "fg") {
		require("/ui/common/globals").set("notifications","N");
	
		var alerts = notifyClass.get();
		var txt = "";
		if (alerts && alerts.length > 0) {
			var alert = alerts[alerts.length-1];
			txt = alert.msg;
		}
		
		var rows = notifyClass.getrows();
		
		if (this.state.state == 0) {
			this.win.title = "Alarm!";
			this.lbl.text = txt;
			this.win.open({
				modal:false,
				modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
				modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
			});
			this.setstateOpen.call(this,"prototype open")
		} else {
			this.cnt++
			this.win.title = "Alarm!";		
			this.lbl.text = txt;
		}
	} else {
		require("/ui/common/globals").set("notifications","Y");
	}
}
