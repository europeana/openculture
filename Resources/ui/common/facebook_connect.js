var css = require("/ui/common/css");

function facebook_connect() {
	//
	// create controls tab and root window
	//
	var self = Titanium.UI.createWindow({  
	    title:'Facebook',
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
	
	Titanium.Facebook.appid = _config.Facebook.appid;
	Titanium.Facebook.permissions = _config.Facebook.permissions;
	
	
	var view = Titanium.UI.createView({
		layout : 'vertical'
	});
	var but = Titanium.Facebook.createLoginButton({  style: 'wide' });
//	css.addButBackground(but);
	

	var fb_user_view = Titanium.UI.createView({
		height : 150,
		left:20, right:20,
		layout : 'vertical'
	});
	
	var fb_user_view_label = Ti.UI.createLabel({
		text : '',
		top:10,
		color : "#fff",
	});

	var fb_user_view_img = Ti.UI.createImageView({
		width:80,height:80,top:10,image:""
	});
	fb_user_view.add(fb_user_view_img);
	fb_user_view.add(fb_user_view_label);

	view.add(fb_user_view);
	view.add(but);
	
	midPanel.add(view);
	
	/**
	 * my details if i am logged in
	 * 
	 */

	var refreshlogindetails_view = function(e) {
	    if (e.success) {
	    	var result = JSON.parse(e.result);
	    	fb_user_view_label.text = " "+result.name;
	    	fb_user_view_img.image = "http://profile.ak.fbcdn.net/hprofile-ak-snc4/186112_"+result.id+"_4419532_q.jpg"
	    	
			$ef.load_application_state();
			$ef.application_state.facebook_id = result.id;
			$ef.application_state.facebook_name = result.name;
			$ef.save_application_state();

	    } else if (e.error) {
	    	fb_user_view_label.text = "Not connected to Facebook";
	    	fb_user_view_img.image = "";
	    	
			$ef.load_application_state();
			$ef.application_state.facebook_id = null;
			$ef.application_state.facebook_name = "";
			$ef.save_application_state();
	    	
	    } else {
	    	fb_user_view_label.text = "Not connected to Facebook";
	    	fb_user_view_img.image = "";
	    	
			$ef.load_application_state();
			$ef.application_state.facebook_id = null;
			$ef.application_state.facebook_name = "";
			$ef.save_application_state();
	    	
	    }
	};
	
	var refreshlogindetails = function() {
		Ti.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
			refreshlogindetails_view(e);
		});
	}

	var fblistener = function(e) {
		refreshlogindetails_view.call(this,e)
	};
	
	
//	refreshlogindetails();
	
	self.addEventListener('open', function(e) {
		Ti.Facebook.addEventListener('login', refreshlogindetails);
		Ti.Facebook.addEventListener('logout', refreshlogindetails);
		Titanium.App.addEventListener(_config.events.facebooklogin, fblistener);
		refreshlogindetails();
	});

	self.addEventListener('close', function(e) {
		Ti.Facebook.removeEventListener('login', refreshlogindetails);
		Ti.Facebook.removeEventListener('logout', refreshlogindetails);
		Titanium.App.removeEventListener(_config.events.facebooklogin,fblistener);
	});
	
	return self;
	
}

module.exports = facebook_connect;

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

module.exports.postdialog = function(TEXT,LINK,DESC,PIC) {
	var _config = require("/ui/common/config");
	Titanium.Facebook.appid = _config.Facebook.appid;
	Titanium.Facebook.permissions = _config.Facebook.permissions;
	
	// First make sure this permission exists
	Ti.Facebook.permissions = ['publish_stream'];
	Ti.Facebook.authorize();
	
	var data = {
	    link : LINK,
	    name : "Vistory - the Interactive Historical Video App",
	    message : "Checkout this cool app bringing history to life",
	    caption : TEXT,
//	    picture : "http://www.vistory.nl/_site1504/images/vistory.gif",
	    picture : PIC,
	    description : DESC
	};
	Titanium.Facebook.dialog("feed", data, function(e) {
	    if(e.success && e.result) {
	        alert("Posted");
	    } else {
	        if(e.error) {
//	            alert(e.error);
	        } else {
//	            alert("User canceled dialog.");
	        }
	    }
	});	
	
	
}	
module.exports.postpic = function(dir,pic) {
	var _config = require("/ui/common/config");
	Titanium.Facebook.appid = _config.Facebook.appid;
	Titanium.Facebook.permissions = _config.Facebook.permissions;
	
	// First make sure this permission exists
	Ti.Facebook.permissions = ['publish_stream'];
	Ti.Facebook.authorize();


	// Now post the photo after you've confirmed that authorize() succeeded
	var f = Ti.Filesystem.getFile(dir,pic);
	var blob = f.read();
	var data = {
	    message: 'This is a pumpkin',
	    picture: blob
	};
	Ti.Facebook.requestWithGraphPath('me/photos', data, 'POST', function(e){
	    if (e.success) {
	        alert("Success!  From FB: " + e.result);
	    } else {
	        if (e.error) {
	            alert(e.error);
	        } else {
	            alert("Unkown result");
	        }
	    }
	});	
}
