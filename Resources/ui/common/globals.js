exports.globals = {
	cnt : 0,
	rootwin : null,
	tabgroup : null,
	alertwin : null,
	modalwin : null,
	ef : {},
	gw : {},
	service : null,
	app_in : 'fg',
	uuid : null,
	platform : {
		iphone : (Ti.Platform.osname == 'iphone'),
		android : (Ti.Platform.osname == 'android'),
		ipad : (Ti.Platform.osname == 'ipad'),
		iphone5 : (Ti.Platform.displayCaps.platformHeight > 500)
	},
	RowSelectionStyle : (Ti.Platform.osname == 'iphone') ? Ti.UI.iPhone.TableViewCellSelectionStyle.NONE : "NONE"
};

exports.isAndroid = function() {
	return (Ti.Platform.osname == 'android');
};
exports.isIOS= function() {
	return (Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad');
};
exports.isIPHONE5= function() {
	return this.globals.platform.iphone5;
};
exports.isIPHONE= function() {
	return (Ti.Platform.osname == 'iphone');
};
exports.isIPAD= function() {
	return (Ti.Platform.osname == 'ipad');
};
exports.ios7 = function() {
	// iOS-specific test
	if (Titanium.Platform.name == 'iPhone OS') {
		var version = Titanium.Platform.version.split(".");
		var major = parseInt(version[0],10);
		// Can only test this support on a 3.2+ device
		if (major >= 7)	return true;
	}
	return false;
};

Titanium.App.addEventListener('state_bg', function(e) {
	var globals = require('/ui/common/globals');
	globals.set("app_in","bg");
	Titanium.API.info("fired to bg from globals");
})

Titanium.App.addEventListener('state_fg', function(e) {
	var globals = require('/ui/common/globals');
	globals.set("app_in","fg");
	Titanium.API.info("fired to bg from globals");
})

exports.getuuid = function() {
	if (this.globals.uuid == null) {
		this.globals.uuid = require("/helpers/LocalStorage").getString("uuid");
	}
	if (this.globals.uuid == "") {
		this.globals.uuid = Ti.Platform.createUUID();
		require("/helpers/LocalStorage").setString("uuid",this.globals.uuid);
	}
	return this.globals.uuid;
}


exports.set = function(key,value) {
	this.globals[key] = value;
}

exports.get = function(key) {
	return this.globals[key];
}

exports.dpi = function(num) {
//	alert ("dpi is "+Ti.Platform.displayCaps.getDpi()+", density is "+Ti.Platform.displayCaps.getDensity()+",width is "+Ti.Platform.displayCaps.getPlatformWidth()+"");
	var factor = (Ti.Platform.displayCaps.getPlatformWidth() / 320);
	return Math.floor(num * factor);
}

exports.tg = function(win, args) {
	alert(this.globals.tabgroup);
}
exports.inc = function() {
	this.globals.cnt++;
}
exports.getcnt = function() {
	return this.globals.cnt;
}
exports.gototab = function(n) {
	if (this.globals.tabgroup && this.globals.tabgroup != null) {
		this.globals.tabgroup.setActiveTab(n);
	}
}
exports.closemodal = function() {
	if (this.modal != null) {
		try {	this.modal.close({duration:1});	} catch (e) {	Titanium.API.debug(e); }
		try {	this.modal = null;	} catch (e) {	Titanium.API.debug(e); }
	}
}
exports.openmodalfull = function(win) {
	win.open({
		modal:true,
		modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
		modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FULLSCREEN
	});

}
exports.openmodal = function(win) {
	if (this.modal != null) {
		try {	this.modal.close({duration:1});	} catch (e) {	Titanium.API.debug(e); }
//		try {	this.modal = null;	} catch (e) {	Titanium.API.debug(e); }
	}
	(function(){
		try {
			this.modal = win;
			this.modal.title;
			this.modal.open({
				modal:true,
				modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
				modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
			});
		} catch (e) {	Titanium.API.debug(e); }
	}).call(this);
}
Titanium.App.addEventListener("close_all_windows",function() {
	require('/ui/common/globals').closemodal();
})
exports.open = function(win, args) {
	if (this.globals.tabgroup && this.globals.tabgroup != null) {
		this.globals.tabgroup.activeTab.open(win,{animated:true});
	} else {
		var menu = require('ui/android/menu');
		menu.add(win);
		
		var xargs = args||{animated:false};
		xargs.fullscreen = false;
		win.open(xargs);
	}
}
