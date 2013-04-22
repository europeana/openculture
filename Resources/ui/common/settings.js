var gwdb = require('/helpers/gwdb');
var globals = require('/ui/common/globals');
var css = require('/ui/common/css');


function settings() {
	
	//
	// create controls tab and root window
	//
	var self = Titanium.UI.createWindow({  
    	navBarHidden: true,
	    title:'Settings',
		backgroundGradient: css.WINGRAD2
	});
	/*var img = Titanium.UI.createWebView({
		width:1024,
		height:768,
		url:"http://mobilemuseum.eu"
	})*/
	var img = Titanium.UI.createImageView({
		width:1024,
		height:768,
		image:"images/splash.png"
	})
	self.add(img);
	return self;
	
	
	
	var Panel = Ti.UI.createView({
		width:'100%',
		height:'100%',
		backgroundColor:'transparent'
	});
	
	var topPanel = Ti.UI.createView({
		top:0, height:'0%',width:'100%'
	});
	
	var midPanel = Ti.UI.createView({
		top:'0%', height:'100%',width:'100%'
	});
	
	var botPanel = Ti.UI.createView({
		bottom:0, height:'0%',width:'100%'
	});
	
	var margin = 20;
	
	var formPanelWrapper = Ti.UI.createScrollView({
	    contentWidth:'auto',
	    contentHeight:'auto'
	});
	
	Panel.add(topPanel);
	Panel.add(midPanel);
	Panel.add(botPanel);
	
	self.add(Panel);
	
	var table = gwdb.newTable({},true);
	
	table.view.addEventListener('click',function(e) {
		Titanium.API.info("e");
		Titanium.API.info(e);
		Titanium.API.info("e.row");
		Titanium.API.info(e.row);
		
		if (!e.row.x_action) return;
		if (e.row.x_action == "facebook") {
			var _fbc = require("/ui/common/facebook_connect");
			var fbc = new _fbc();
			globals.open(fbc,{animated:true});
		}
		if (e.row.x_action == "twitter") {
			var _twc = require("/helpers/twitter/twitter_connect");
			var twc = new _twc();
			globals.open(twc,{animated:true});
		}
	});
	
	var rows = [];
	
	var sec = gwdb.section("  ",{backgroundColor:'transparent'},{backgroundColor:'transparent'},{backgroundColor:'transparent'});
	
	var row = gwdb.row({height:50,layout:'horizontal',title:'facebook',leftImage:"/images/glyphicons_390_facebook.png",x_action:'facebook'});
	sec.add(row);
	
	var row = gwdb.row({height:50,layout:'horizontal',title:'twitter',leftImage:"/images/glyphicons_392_twitter.png",x_action:'twitter'});
	sec.add(row);

	rows.push(sec);

	table.view.setData(rows);
	midPanel.add(table.view);
	
	return self;
}

module.exports = settings;

