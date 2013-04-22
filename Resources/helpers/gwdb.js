var ti = require("/helpers/Component_wrapper");

exports.gwdb = function(name) {
    Ti.API.info('Hello '+name+'!');
};

/* private functions */
function jsonConcat(o1, o2) {
	for (var key in o2) {
		o1[key] = o2[key];
	}
	return o1;
};

function gwdb_window(obj,title,backbutton,dontcreateview) {
	
	//all the colors go here 
	var BLUE2 = "#00347d";
	var BARCOLOUR = BLUE2;
	var ROWBGC = "#ffffff";
	var WINGRAD =  {
		type:'linear',
		colors:['#24364C','#000000'],
		startPoint:{x:'0dp',y:'0dp'},
		endPoint:{x:'0dp',y:'1dp'},
		backFillStart:false
	}

//	this.win = ti.Window(jsonConcat({
	this.win = Titanium.UI.createWindow(jsonConcat({
		title:title,
		touchEnabled:true,
		tabBarHidden:true,
		backgroundColor:ROWBGC,
		navBarHidden : false,
		backgroundGradient: WINGRAD,
		barColor: BARCOLOUR
	},obj));
	
	this.view = null;
	
	if (dontcreateview != true) {
		view1 = Ti.UI.createScrollView({
		    contentWidth:'auto',
		    contentHeight:'auto'
		});
		this.win.add(view1);
		
		this.view = Ti.UI.createView({
			height:'auto',
			layout:'vertical',
			left:'0dp',
			top:'0dp',
			right:'0dp'
		});
		view1.add(this.view);
		// view = Ti.UI.createView({
			// height:'auto',
			// layout:'vertical',
			// left:'0dp',
			// top:'0dp',
			// right:'0dp'
		// });
		// win.add(view);
		
	}

	if (backbutton) {
		var closebut = Titanium.UI.createButton({
			height:'30dp',
			title:'close',
		    zindex:2
		});
		closebut.addEventListener('click', function() {
			this.win.close();
			if (this.fns.closefunction) {
				this.win.addEventListener("close", function() {
					this.fns.closefunction();
				})	
			}
			// var t = Titanium.UI.createAnimation();
			// t.transition = Ti.UI.iPhone.AnimationStyle.CURL_UP;
			// t.duration = 1000;
			// t.addEventListener('complete',function() {
				// $ef.tmpwin.close();
			// });
			// $ef.tmpwin = win;
			// view.animate(t);
			// win.close({
				// transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
			// });
		});
		
		this.win.set("leftNavButton", closebut);
	}
	
	this.fns = {};
}
gwdb_window.prototype.setCloseFunction = function(fn) {
	this.fns.closefunction = fn;	
};

gwdb_window.prototype.open = function(obj) {
	if (obj) {
		obj.open(this.win,{animated:true});
//		tabGroup.activeTab.open(this.win.proxyView,{animated:true});
	} else {
		this.win.open({animated:true});
	}
};

gwdb_window.prototype.close = function(fn) {
	this.win.on("close",function() {
		if (fn) fn.call(this);
	})
	this.win.close();
};

gwdb_window.prototype.openleft = function(fn) {
	var t = Ti.UI.iPhone.AnimationStyle.CURL_UP;			
	tabGroup.activeTab.open(this.win,{animated:true,transition:t});
};

gwdb_window.prototype.openmodal = function(fn) {
	this.win.open({
		modal:true,
		modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
		modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
	});
};


// public interface
exports.gwdb_window = gwdb_window;
exports.newWindow = function(obj,title,backbutton,dontcreateview) {	/* create new window */
	return new gwdb_window(obj,title,backbutton,dontcreateview);
};

exports.newTable = function(xob,grouped) {
	var ob = (xob) ? xob : {};
	var fnt = {fontSize:12,fontWeight:'bold', fontFamily:'Arial'};

	
	Titanium.API.debug("FFF1");
	var tableView = Titanium.UI.createTableView(jsonConcat({
		backgroundColor:'transparent',
		rowBackgroundColor:"#000000",
		borderColor:"#000000",
		font : fnt,
		top:'0dp',
		separatorColor:"#000000",
		scrollable : true
	},ob));
	
	if (Ti.Platform.osname === 'iphone') {
		tableView.style = (grouped) ? Titanium.UI.iPhone.TableViewStyle.GROUPED : Titanium.UI.iPhone.TableViewStyle.PLAIN;
	}
	
	return {
		view : tableView,
		set : function(data) {
			view.setData(data);
		}
	}

};


exports.row = function(xob) {
	var ob = (xob) ? xob : {};

	var ROWBGC = "";
	
	var selstyle = "";
	if (Ti.Platform.osname === 'iphone') {
		selstyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	}
	
	
	var row = Ti.UI.createTableViewRow(jsonConcat({
//		backgroundColor : ROWBGC,
		hasChild : true, height:'auto',
		selectionStyle : selstyle,
		touchEnabled : true,
		className : 'control'
	},ob));
	return row;
}

exports.section = function(name,xob,xob1,xob2) {
	var ob = (xob) ? xob : {};
	var ob1 = (xob1) ? xob1 : {};
	var ob2 = (xob2) ? xob2 : {};
	var TOPBGC = "#333333";
	var TOPFONT = {};
	var TOPFGC = "";
	var TOPBGC = "";
	
	var section2 = Ti.UI.createTableViewSection(ob);
	var customView2 = Ti.UI.createView(jsonConcat({ backgroundColor:TOPBGC,height:'auto'},ob1));
	var customLabel2 = Ti.UI.createLabel(jsonConcat({
	    top:'12dp', bottom:'2dp', left:'15dp',
	    height:'auto', width:'auto',
	    text:name,
	    // font:TOPFONT,
	    // color:TOPFGC,
	    // backgroundColor:TOPBGC
	},ob2));
	customView2.add(customLabel2);
	section2.headerView = customView2;
	return section2;	
};

exports.btn = function(title,top,left,right,color,width,height,brdradius,fnt,xob) {
	var ob = (xob) ? xob : {};
	if (top != null) ob.top = top;
	if (left != null) ob.left = left;
	if (right != null) ob.right = right;
	if (width != null) ob.width = width;
	if (height != null) ob.height = height;
	
	var style = "";
	if (Ti.Platform.osname === 'iphone') {
		style = Titanium.UI.iPhone.SystemButtonStyle.PLAIN;
	}
	
	
	var but = Titanium.UI.createButton(jsonConcat({
		borderColor:"#000000",
		style:style,
		borderRadius: brdradius,
		backgroundImage:"bgct.jpg",
		color: color,
		font: fnt,
		title: title,
	    zindex:2
	},ob));
	but.addEventListener('click', function(e) {
		
	});
	return but;
};

exports.version = 1.0;
exports.author = 'Jonathan Carter';