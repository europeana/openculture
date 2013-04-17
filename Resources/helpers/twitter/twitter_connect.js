var css = require("/ui/common/css");


function twitter_connect() {
	//
	// create controls tab and root window
	//

	var self = Titanium.UI.createWindow({  
	    title:'Twitter',
	    barColor:css.BARCOLOUR,
	    backgroundGradient : css.WINGRAD2
	});
	
	
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

	
	
	/**
	 * facebook connect
	 */
	var _config = require("/ui/common/config");
	var twitterClass = require("/helpers/twitter/twitter");
	var twitter = new twitterClass();
	
	var view = Titanium.UI.createView({
		layout : 'vertical'
	});
	var but = Ti.UI.createButton({ left: 20, right: 20, height:50});
	css.addButBackground(but);
	
	but.addEventListener("click", function(e) {
		if (e.source.x_action == "logout") {
			e.source.title = "connect";
			e.source.x_action = "connect";
			logout();
			
		} else {
			e.source.title = "logout";
			e.source.x_action = "logout";
			connect();
			
		}
	})

	var user_view = Titanium.UI.createView({
		height : 100,
		left:20,right:20
	});
	
	var twitterState = require("helpers/twitter/twitter_state");
	twitterState.load();
	var h = "";
	if (twitterState.loggedin() == true) {
		h = "logged in as @"+twitterState.username();
	} else {
		h = "Not connected to Twitter";
	}
	
	var user_view_label = Ti.UI.createLabel({
		text : h,
		color : "#fff"
	});
	user_view.add(user_view_label);

	view.add(user_view);
	view.add(but);
	
	midPanel.add(view);
	
	/**
	 * my details if i am logged in
	 * 
	 */
	var refreshlogindetails_view = function(user) {
	    if (user && user != null && user.loggedin == true) {
	    	user_view_label.text = "logged in as @"+user.username;
	    	but.title = "logout";
	    	but.x_action = "logout";
			
			var twitterState = require("/helpers/twitter/twitter_state");
			twitterState.load();
			twitterState.set(user.username,user.username,true,true);
			twitterState.save();

	    } else {
	    	user_view_label.text = "Not connected to Twitter";
	    	but.title = "Connect";
	    	but.x_action = "connect";

			var twitterState = require("/helpers/twitter/twitter_state");
			twitterState.load();
			twitterState.set("","",false,false);
			twitterState.save();
	    	
	    }
		
	}

	var refreshlogindetails = function() {
		var me = twitter.runQuery("me");
		refreshlogindetails_view(me);
	}
	
	var logout = function() {
		var me = twitter.runQuery("logout");
		refreshlogindetails_view(me);
	}

	var connect = function() {
		var me = twitter.runQuery("connect");
	}
	

	
	self.addEventListener('open', function(e) {
		// Ti.Facebook.addEventListener('login', refreshlogindetails);
		// Ti.Facebook.addEventListener('logout', refreshlogindetails);
		// Titanium.App.addEventListener(_config.events.facebooklogin, fblistener);
		Titanium.App.addEventListener("twitter_state_change",refreshlogindetails);
		refreshlogindetails();
	});

	self.addEventListener('close', function(e) {
		// Ti.Facebook.removeEventListener('login', refreshlogindetails);
		// Ti.Facebook.removeEventListener('logout', refreshlogindetails);
		// Titanium.App.removeEventListener(_config.events.facebooklogin,fblistener);
		Titanium.App.removeEventListener("twitter_state_change",refreshlogindetails);
	});
	
	return self;
	
};

module.exports = twitter_connect;


module.exports.post = function() {
	var _config = require("/ui/common/config");
	Titanium.Facebook.appid = _config.Facebook.appid;
	Titanium.Facebook.permissions = _config.Facebook.permissions;
	
	// First make sure this permission exists
	Ti.Facebook.permissions = ['create_event'];
	Ti.Facebook.authorize();
	 
	// ...
	// ...
	 
	// Now create the event after you've confirmed authorize() was successful.
	var starttime = new Date(2012, 4, 31, 17, 0);
	var endtime = new Date(2012, 4, 31, 19, 0);
	var title = "Barry's Birthday Celebration";
	var description = "Barry will have a great party";
	var data = {
	    start_time: JSON.stringify(starttime), // API expects a JSON stringified date
	    end_time: JSON.stringify(endtime),
	    summary: description,
	    name: title
	};
	Ti.Facebook.requestWithGraphPath('me/events', data, 'POST', function(e) {
	    if (e.success) {
	        alert("Success! Returned from FB: " + e.result);
	    } else {
	        if (e.error) {
	            alert(e.error);
	        } else {
	            alert("Unknown result");
	        }
	    }
	});
	
}

module.exports.postdialog = function(text,link) {
	
	if (!link) link = "http://www.vistory.nl/clip.shtml?movie=oai:openimages.eu:20424";
	if (!text) text = "Check out this movie on @Vistory_app " ;
	
	var self = Ti.UI.createWindow({
		title : 'Share on Twitter'
	});
	css.addWinBackground(self);
	
	var view = Ti.UI.createView({
		layout : 'horizontal'
	});
	
	var textbox = Ti.UI.createTextArea({
		left : 0,
		right : 0,
		bottom:0,
		top : 0,
		backgroundColor : '#fff',
		font : {
			fontSize : 16
		},
		value : text
	});
	textbox.addEventListener('change', function(e){
	    if(e.value.length > 120) {
	        textbox.value = e.value.substr(0,120);
	    }
	});
	
	var but = Ti.UI.createButton({
		left : '10%',
		right : '10%',
		top : 8,
		bottom : 8,
		title : 'post'
	});
//	css.addButBackground(but);

	var close_but = Ti.UI.createButton({
		title : 'cancel'
	});
	
	but.addEventListener('click', function(){
		var txt = textbox.value+" "+link;
		textbox.blur();

		var _config = require("/ui/common/config");
		var twitterClass = require("/helpers/twitter/twitter");
		var twitter = new twitterClass();
		twitter.runQuery("post",txt);
		
		self.close();
	})
	close_but.addEventListener('click', function(){
		self.close();
	})
	

	// view.add(Titanium.UI.createLabel({
		// left : '10%',
		// right : '10%',
		// top : 8,
		// bottom : 8,
		// text : "Your Tweet",
	// }));
	view.add(textbox);
	self.add(view);
	self.leftNavButton = close_but;
	self.rightNavButton = but;
	
	require("/ui/common/globals").openmodal(self);
	// self.open({
		// modal:true,
		// modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
		// modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
	// });
	
	return self;
}
