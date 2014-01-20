var globals = require('/ui/common/globals');
var css = require('/ui/common/css');
var smh = require('/ui/common/sidemenu/SideMenuHelpers');


function fn() {

	var LL = function(txt) {
		try {
			var rv = L(txt.replace(" ","_").replace(" ","_").replace(" ","_"));
			if (rv == "") return txt;
			return rv;
		} catch (E) {
			return txt;			
		}
	};
	var dbg = function (ob) {
		Ti.API.info(ob);
	};
	
	var callstack = {};
	var stopDoubleClear = function(object) {
//		Ti.API.debug("stopDoubleClear new object ("+object+")");
		callstack[object] = 0;
	};
	var stopDouble = function(object, miliseconds) {
		var currentTime = new Date().getTime();
		if (!callstack[object]) {
//			Ti.API.debug("stopDouble new object ("+object+") - tm("+currentTime+")");
			callstack[object] = currentTime;
			return false;
		}
		if ((currentTime - callstack[object]) > miliseconds) {
//			Ti.API.debug("stopDouble passed  ("+object+"="+callstack[object]+") - diff("+(currentTime - callstack[object])+") ms("+miliseconds+")");
			callstack[object] = currentTime;
			return false;
		}
//		Ti.API.debug("stopDouble STOPPED  ("+object+"="+callstack[object]+") - diff("+(currentTime - callstack[object])+") ms("+miliseconds+")");
		return true;
	};

	var curr_event = "";
	var MAXITEMS = 100;
	var TOPBARHEIGHT = 50;
	var SIDEWIDTH = (require("/etc/config").format == "phone") ? 320 : 400;
	
	var self = Titanium.UI.createWindow({
    	navBarHidden: true,
    	backgroundColor:css.VERYLIGHTCOLOUR,
		backgroundGradient: css.WINGRAD2,
		tabBarHidden:true,
		top:20
	});
//	experiment start

	/*
	 * the side menu
	 */
	
	var xb1L = Titanium.UI.createView({
		width : 250,
		left : 0,
		layout : 'vertical',
		color : css.LIGHTCOLOUR,
		backgroundColor : '#333333',
		height : Ti.UI.FILL
	});
	
	var xtabLOpt1 = smh.mainmenuitem(LL("sidemenu_Home"),"S");
	xtabLOpt1.top = 60;
	xtabLOpt1.addEventListener('click', function() {
		Titanium.App.fireEvent("display-search-force",{});
		setTimeout(function() {
			Titanium.App.fireEvent("closemainviewWrapper",{});
		},500);
	});

	var xtabLOpt2 = smh.mainmenuitem(LL("sidemenu_Results"),"O");
	xtabLOpt2.addEventListener('click', function() {
		close_displaySearchForce();
		Titanium.App.fireEvent("redisplay-search",{});			
		setTimeout(function() {
			Titanium.App.fireEvent("closemainviewWrapper",{});
		},500);
	});

	var xtabLOpt3 = smh.mainmenuitem(LL("sidemenu_Favourutes"),"F");
	xtabLOpt3.addEventListener('click', function() {
		close_displaySearchForce();
		Titanium.App.fireEvent("redisplay-personal",{});		
		setTimeout(function() {
			Titanium.App.fireEvent("closemainviewWrapper",{});
		},500);
	});

	var xtabLOpt4 = smh.mainmenuitem(LL("sidemenu_Help"),"V");
	xtabLOpt4.addEventListener('click', function() {
		Titanium.App.fireEvent("display-main-help",{});
		setTimeout(function() {
			Titanium.App.fireEvent("closemainviewWrapper",{});
		},500);
	});
//	var xtabLOptMultiLang_view = smh.basicView();

		
	var xtabLOptMultiLang_view = smh.mainmenuitem(LL("translate"),"?");
	
	var mls = require("/helpers/LocalStorage").getString("multilanguage_search");

//	xtabLOptMultiLang_view.add(smh.arrow("?"));
	
	var initial_value = false;
	if (mls && mls !== null && mls === "y") initial_value = true;
	
	if (Ti.Platform.osname !== 'android') {
		var xtabLOptMultiLang_view_switch = Ti.UI.createSwitch({
			top : 0,
			height : 20,
			left : smh.config.tab3a - 60,
			title : '',
			titleOff : 'no',
			titleOn : "yes",
			value : initial_value
		});
		
		
		xtabLOptMultiLang_view_switch.addEventListener('change', function() {
			var val = (xtabLOptMultiLang_view_switch.getValue() === true) ? "y" : "n"; 
			require("/helpers/LocalStorage").setString("multilanguage_search",val);
			Ti.App.fireEvent("app:checklocale",{});
		});
		xtabLOptMultiLang_view.add(xtabLOptMultiLang_view_switch);
	} else {
		xtabLOptMultiLang_view_switch_and = Ti.UI.createView({
			top : 0,
			height : 32,
			width : 54,
			_val : (initial_value == true) ? "y" : "n",
			left : smh.config.tab3a - 60,
			backgroundColor : (initial_value == true) ? "#7DCF63" : "transparen",
			borderColor : (initial_value == true) ? "#7DCF63" : "#eeeeee",
			borderWidth: 1,
			borderRadius : 16
		});
		
		xtabLOptMultiLang_view_switch_and.add(Ti.UI.createView({
			left : (initial_value == true) ? 22 : 1,
			top : 1,
			width : 30,
			height : 30,
			borderRadius : 15,
			touchEnabled : false,
			backgroundColor : "#eeeeee"
		}));
		xtabLOptMultiLang_view_switch_and.addEventListener('click', function() {
			if (xtabLOptMultiLang_view_switch_and._val == "n") {
				xtabLOptMultiLang_view_switch_and._val = "y";
				xtabLOptMultiLang_view_switch_and.backgroundColor = "#7DCF63";
				xtabLOptMultiLang_view_switch_and.borderColor = "#7DCF63";
				xtabLOptMultiLang_view_switch_and.children[0].left = 22;
			} else {
				xtabLOptMultiLang_view_switch_and._val = "n";
				xtabLOptMultiLang_view_switch_and.backgroundColor = "transparent";
				xtabLOptMultiLang_view_switch_and.borderColor = "#eeeeee";
				xtabLOptMultiLang_view_switch_and.children[0].left = 0;
			}
			var val = xtabLOptMultiLang_view_switch_and._val;
			require("/helpers/LocalStorage").setString("multilanguage_search",val);
			Ti.App.fireEvent("app:checklocale",{});
		});		
		xtabLOptMultiLang_view.add(xtabLOptMultiLang_view_switch_and);

	}
	
	var xtabLOptMultiLang_view_text = Ti.UI.createLabel({
		left : smh.config.tab1,
		width : (smh.config.tab3a - smh.config.tab1),
		font : smh.font(smh.config.fontsize.normal),
		color : smh.config.fontcolor,
		text : LL("translate_text"),
		top : 50
	});
	

	
	xtabLOptMultiLang_view.add(xtabLOptMultiLang_view_text);
	
	
	
	
	xb1L.add(xtabLOpt1);
	xb1L.add(smh.spacer());
	xb1L.add(xtabLOpt2);
	xb1L.add(smh.spacer());
	xb1L.add(xtabLOpt3);
	xb1L.add(smh.spacer());
	xb1L.add(xtabLOpt4);
	xb1L.add(smh.spacer());
	xb1L.add(xtabLOptMultiLang_view);
	self.add(xb1L);
	



//	experiment end	
	
	var setpage = function(P) {
		require("/helpers/LocalStorage").setString("page",P);
	};
	var getpage = function() {
		var page = require("/helpers/LocalStorage").getString("page");
		if (!page || page == null || page == "") return 0;
		try {
			return Number(page);
		} catch (E) {
			return 0;
		}
	};
	var PERPAGE = 100;
	var TOTALRESULTS = 0;
	
	var add_spinner = function(view,top,left) {
		
		var activityIndicator = Ti.UI.createActivityIndicator({
			color: css.VERYLIGHTCOLOUR,
			message: '',
//			style : Ti.UI.iPhone.ActivityIndicatorStyle.BIG,
			height:'auto',
			width:'auto'
 		});
 		if (Ti.Platform.osname !== 'android') activityIndicator.style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG;
 		
 		if (top) activityIndicator.top = top;
 		if (left) activityIndicator.left = left;
		
		view.add(activityIndicator);
		activityIndicator.show();
		var endActivity = function(e) {
//			Ti.API.debug(this);
//			Ti.API.debug(e);
//			Ti.API.debug(e.source);
			view.remove(activityIndicator);
			view.removeEventListener("done-spinning",endActivity);
		};
		view.addEventListener("done-spinning",endActivity);
	};
	
	var topview = Titanium.UI.createView({
		top:0,left:0,right:0,height:TOPBARHEIGHT,backgroundColor:"#ff0000"
	});
	
	
	var mainviewNonScrollingContainer = Titanium.UI.createView({
		top:0,left:0,width:'100%',height:Ti.UI.FILL,backgroundColor:css.DARKBACKGROUND
	});
	var mainview = Titanium.UI.createScrollView({
		contentHeight:'auto',
		contentWidth:'auto',
//		top:40,left:0,width:'100%',height:Ti.UI.FILL,backgroundColor:css.DARKBACKGROUND
		top:0,left:0,width:'100%',height:Ti.UI.FILL,backgroundColor:css.DARKBACKGROUND
	});
	mainviewNonScrollingContainer.add(mainview);
	

	var lazyLoadRunning = false;
	var lazycounty = 0;
	var lazyload_y = -100;
	var lazyLoad = function(e) {
		
		Ti.App.fireEvent("app:checklocale",{});

		var lazycount = lazycounty;
		lazycounty++;
		Ti.API.info("jcjc layyload start ["+lazycount+"]");
		if (e.force == 0 && Math.abs(e.y - lazyload_y) < 40) {
//			Ti.API.debug("jcjc layyload exit not needed ["+lazycount+"], diff = ("+e.y+" / "+lazyload_y+")");
			return;
		}
		if (e.force == 0) {
			if (stopDouble("lazyLoad",200) == true) {
//				Ti.API.debug("jcjc layyload exit not needed due to stopdouble");
				return;
			}
		} else {
			stopDoubleClear("lazyLoad");
		}
		
		
		lazyload_y = e.y;
		var params = {
			x : e.x,
			y : e.y,
			w : e.w,
			h : e.h,
			p : (Ti.Gesture.getOrientation() == Ti.UI.PORTRAIT || Ti.Gesture.getOrientation() == Ti.UI.UPSIDE_PORTRAIT)
		};
		workingView.show();
		for (var i=0 ; i < ActiveViews.length; i++) {
			ActiveViews[i].fireEvent("loadimage",params);
		}
		setTimeout(function() {
			workingView.hide();
			Ti.API.info("jcjc layyload end - hide working view ["+lazycount+"]");
		},500);
		Ti.API.info("jcjc layyload end ["+lazycount+"]");
	};
	Titanium.App.addEventListener("app-endscroll",lazyLoad);

	var mvcount = 0;
	var startTop_y = 0;
	var getTopPosition = function( Force) {
		var retval = {};
		try { retval.x =  mainview.getContentOffset().x; } catch (E) { retval.x = 0;}
		try { retval.y =  mainview.getContentOffset().y; } catch (E) {retval.y = 0;}
		try { retval.w =  mainview.getSize().width; } catch (E) {retval.w = 0;}
		try { retval.h =  mainview.getSize().height; } catch (E) {retval.h = 0;}
		retval.startTop_y = startTop_y;
		retval.force = Force;
		return retval;
	};
	var scrollingy = 0;
	var touching = false;
	var mainview2_top_close = function() {
		if (mainview2_top.xopen == "open" || mainview2_top.xopen == "closing") {
			mainview2_top.xopen = "closing";
			mainview2_top.animate({ top : -50, duration : 100,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e) {
				mainview2_top.xopen = "closed";
			});
		}
	};
	var mainview2_top_open = function() {
		if (mainview2_top.xopen == "closed" || mainview2_top.xopen == "opening") {
			mainview2_top.xopen = "opening";
			mainview2_top.animate({ top : 0, duration : 500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e) {
				mainview2_top.xopen = "open";
			});
		}
	};
	mainview.addEventListener('scroll', function(e) {
		if (touching == true && e.y > (scrollingy + 2) && e.y > 10) {
			// up
			mainview2_top_close();
			scrollingy = e.y;
		} else if (touching == true && e.y < (scrollingy - 10)) {
			mainview2_top_open();
			scrollingy = e.y;
		}
	});
	
	var mainview_preview = function(identifier,cnt,typ) {
		mainviewR_close();
		var winClass = require("/ui/common/PlayWindowV2");
		var preview_win = new winClass(identifier,cnt,typ);
		setTimeout(function() {
			Ti.App.fireEvent("app:rotate",{});
		},500);
		
	};

	var mainview_click = function(e) {
		if (e.source && e.source.xindent) {
			mainview_preview.call(this,e.source.xindent,e.source.xcnt,e.source.xtyp);
		}
	};
	mainview.addEventListener("click",mainview_click);
	
	

	mainview.addEventListener('scrollend', function(e) {
//		search.setValue("scrollend "+(mvcount++)+" w"+mainview.getSize().width);
		Ti.App.fireEvent("app-endscroll",getTopPosition(0));
	});
	mainview.addEventListener('touchstart', function(e) {
		touching = true;
	});
	mainview.addEventListener('touchend', function(e) {
		touching = false;
//		search.setValue("touchend "+(mvcount++)+" w"+mainview.getSize().width);
		setTimeout(function() {
			Ti.App.fireEvent("app-endscroll",getTopPosition(0));
		},500);
	});
	// mainview.addEventListener('postlayout', function(e) {
		// search.setValue("postlayout "+(mvcount++)+" w"+mainview.getSize().width);
// 
		// Ti.App.fireEvent("app-endscroll",{
			// x : mainview.getContentOffset().x,
			// y : mainview.getContentOffset().y,
			// w : mainview.getSize().width,
			// h : mainview.getSize().height
		// });
// 		
	// });
	mainview.addEventListener('dragend', function(e) {
//		search.setValue("dragend "+(mvcount++)+" w"+mainview.getSize().width);
		if (e.decelerate == true) return;
//		Ti.API.debug("scroll");
//		Ti.API.debug(e);
//		Ti.API.debug(mainview.getContentOffset());
//		Ti.API.debug(mainview.getContentOffset().x);
//		Ti.API.debug(mainview.getContentOffset().y);

		Ti.App.fireEvent("app-endscroll",getTopPosition(0));
	});
	
	Ti.Gesture.addEventListener('orientationchange', function(e) {
//		search.setValue("oc "+(mvcount++)+" w"+mainview.getSize().width);
		setTimeout(function() {
			Ti.App.fireEvent("app-endscroll",getTopPosition(1));
			Ti.App.fireEvent("app:rotate",{});
		},500);
	});
	
	var mainview2_top = Titanium.UI.createView({
		top:0,left:0,
		height : 40,
		xopen : 'open',
		backgroundColor : "#000000"
	});
	
	var mainview2 = Titanium.UI.createView({
		top:40,left:0,
//		width:3200,
		width:'100%',
//		height : (420 * (MAXITEMS / 25)) + 20,
//		layout:"horizontal"
		height : Ti.UI.SIZE,
		backgroundColor:"transparent", borderWidth:0, borderColor:css.VERYLIGHTCOLOUR
	});
	var mainviews = [];
	if (require("/etc/config").format == "phone") {
		mainviews.push(Titanium.UI.createView({
			top:0,left:0,
			width:'100%',
			_totheight : 0,
			_nextheight : 0,
			height : Ti.UI.SIZE,
			backgroundColor:"transparent", borderWidth:0, borderColor:css.VERYLIGHTCOLOUR,
			layout:"vertical"
		}));
		mainview2.add(mainviews[0]);
		
	} else {
		mainviews.push(Titanium.UI.createView({
			top:0,left:0,
			width:'30%',
			height : Ti.UI.SIZE,
			backgroundColor:"transparent", borderWidth:0, borderColor:css.VERYLIGHTCOLOUR,
			layout:"vertical"
		}));
		mainviews.push(Titanium.UI.createView({
			top:0,left:'35%',
			width:'30%',
			height : Ti.UI.SIZE,
			backgroundColor:"transparent", borderWidth:0, borderColor:css.VERYLIGHTCOLOUR,
			layout:"vertical"
		}));
		mainviews.push(Titanium.UI.createView({
			top:0,left:'70%',
			width:'30%',
			height : Ti.UI.SIZE,
			backgroundColor:"transparent", borderWidth:0, borderColor:css.VERYLIGHTCOLOUR,
			layout:"vertical"
		}));
		mainview2.add(mainviews[0]);
		mainview2.add(mainviews[1]);
		mainview2.add(mainviews[2]);
	}
	
	
	/* Help window that comes down from up top */

	var mainviewHELP = Titanium.UI.createView({
		layout : 'vertical',
		zIndex:999,
		xopen : false,
		top:-1000,left : 0, width : Ti.UI.FILL, height : '50%',backgroundColor:css.DARKBACKGROUND
	});
	var subviewWrapperHELP = Ti.UI.createScrollView({
		contentHeight : 'auto'
	});
	var subviewHELP = Ti.UI.createView({
		layout : 'vertical',
		backgroundColor:css.DARKBACKGROUND,
		top : 0,
		height : Ti.UI.FILL
	});
	mainviewHELP.add(subviewHELP);
	var mainviewHELP_closebutton = Ti.UI.createImageView({
		right : 10,
		top : 0,
		height : Ti.UI.SIZE,
		image:'/images/close1.png'
	});
	mainviewHELP_closebutton.addEventListener('click',function(e){
		mainviewHELP_close();
	});
	subviewHELP.add(mainviewHELP_closebutton);
	var mainviewHELP_textbox = Ti.UI.createWebView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		backgroundColor:css.DARKBACKGROUND,
		html : "Help text"
	});
	subviewHELP.add(mainviewHELP_textbox);
	
	var mainviewHELP_respondtohtmlcontent = function(e) {
		alert(e);
	};
	Ti.App.addEventListener("app:mainviewHELP_respondtohtmlcontent",mainviewHELP_respondtohtmlcontent);
	
	var mainviewHELP_close = function() {
		if (mainviewHELP.xopen == true) {
			mainviewHELP.xopen = false;
			mainviewHELP.animate({top:-1000,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
		}
	};
	var mainviewHELP_open = function() {
		if (mainviewHELP.xopen == false) {
			mainviewHELP.xopen = true;
			mainviewHELP.animate({top:0,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
		}
	};	
	var mainviewHELP_click = function(e) {
		if (mainviewHELP.xopen == false) {
			mainviewHELP.xopen = true;
			mainviewHELP.animate({top:0,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
		} else {
			mainviewHELP.xopen = false;
			mainviewHELP.animate({top:-1000,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
		}
	};
	
		


	
	var mainviewL = Titanium.UI.createView({
//		contentHeight:'auto',
//		contentWidth:'auto',
		layout : 'vertical',
		zIndex:999,
		xopen : false,
		top:40,right:-200,width:190,height:659,backgroundColor:css.DARKBACKGROUND
	});

	
	var refreshleftlist = function(places) {
	};
	refreshleftlist([]);
	refreshleftlist2 = function()  {
		var items = require("/helpers/LocalStorage").getObject("creators");
		var items = require("/helpers/LocalStorage").getObject("dats");
		if (!items || items == null) items = [];
		refreshleftlist(items);	
	};


	var search_bg = Titanium.UI.createTextField({
		right : 10,
		left : 10,
		borderRadius : 5,
		backgroundColor : css.VERYLIGHTCOLOUR,
		top : (Ti.Platform.osname === 'android') ? 0 : 5,
		height : (Ti.Platform.osname === 'android') ? 36 : 30,
		borderColor : css.LIGHTCOLOUR,
		borderWidth : 1
	});
	var search = Titanium.UI.createTextField({
		right : 40,
		left : 10,
		top : (Ti.Platform.osname === 'android') ? 0 : 5,
		height : (Ti.Platform.osname === 'android') ? 36 : 30,
		autocorrect : false,
		autocapitalization : false,
		clearButtonMode : 1,
		paddingLeft : 20,
//		width : (Ti.Platform.osname === 'iphone') ? 100 : 200,
		borderRadius : 5,
		backgroundColor : css.VERYLIGHTCOLOUR,
		backgroundColor : "transparent",
		borderColor : css.LIGHTCOLOUR,
		borderWidth : 0,
		color : css.LIGHTCOLOUR,
		value : require("/helpers/LocalStorage").getString("search-string"),
		font : {
			fontFamily : "arial",
			fontSize : (Ti.Platform.osname === 'android') ? 14 : 18
		}
	});
	search.addEventListener('focus', function f(e){
	    search.blur();
	    search.removeEventListener('focus', f);
	});
	mainview2_top.add(search_bg);
	mainview2_top.add(search);
	
	
	
	var mainviewR = Titanium.UI.createScrollView({
		contentHeight:'auto',
		contentWidth:'auto',
		zIndex:999,
		xopen : false,
//		top:40,left:-500,width:400,height:710,backgroundColor:"#333"
		top:40,right:-500,width:SIDEWIDTH,height:710,backgroundColor:"#333"
	});
	var subviewWrapperR = Ti.UI.createScrollView({
		contentHeight : 'auto',
		canCancelEvents : false
	});
	var subviewR = Ti.UI.createView({
		layout : 'vertical',
		top : 0,
		height : Ti.UI.SIZE
	});
	mainviewR.add(subviewR);

	var mainviewR_close = function() {
		if (mainviewR.xopen == true) {
			mainviewR.xopen = false;
			//mainviewL.animate({left:-200,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
			//mainviewR.animate({left:-500,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
			mainviewR.animate({right:-500,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
		}
	};
	var mainviewR_open = function() {
		if (mainviewR.xopen == false) {
			mainviewR.xopen = true;
			//mainviewL.animate({left:-200,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
			//mainviewR.animate({left:0,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
			mainviewR.animate({right:0,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
		}
	};	
	var tabR = Titanium.UI.createTableView({
		height : 'auto',
		left:0, right:0,top:600,
		color : css.LIGHTCOLOUR,
		backgroundColor : css.VERYLIGHTCOLOUR,
		separatorColor :css.DARKBACKGROUND,
		borderColor:css.LIGHTCOLOUR,
		borderWidth:1
	});
//	mainviewR.add(tabR);
	var mainviewL_close = function() {
		if (mainviewL.xopen == true) {
			mainviewL.xopen = false;
			//mainviewL.animate({left:-200,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
			mainviewL.animate({right:-500,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
		}
	};
	var mainviewL_open = function() {
		if (mainviewL.xopen == false) {
			mainviewL.xopen = true;
			//mainviewL.animate({left:-200,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
			mainviewL.animate({right:0,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
		}
	};
	
	var addSearchTerm = function(ST) {
		var type = require("/helpers/LocalStorage").getString("type-string");
		if (type == null) type = "";
		if (type != "") type += "|";
		type += ST;
		require("/helpers/LocalStorage").setString("type-string",type);
		mainviewR_close();
		mainview2_top_close();
		search2.call(this);
	};
	

	var tabRclickHandler = function(src) {
//		Ti.API.debug(src);
//		Ti.API.debug(src.xlink);
//		Ti.API.debug(src.xindex);
		if (src.xlink == "xignore") {
			return;
		} else if (src.xlink == "page-first") {
			pg = 0;
			//alert(pg);
			setpage(pg);
			mainviewR_close();
			search2.call(this);

		} else if (src.xlink == "page-next") {
			var pg = getpage();
			if (pg >= Math.floor(TOTALRESULTS/PERPAGE)) return;
			pg++;
			//alert(pg);
			setpage(pg);
			mainviewR_close();
			search2.call(this);

		} else if (src.xlink == "page-prev") {
			var pg = getpage();
//			Ti.API.debug(pg);
			if (pg < 1) return;
			pg--;
			Ti.API.debug(pg);
			//alert(pg);
			setpage(pg);
			mainviewR_close();
			search2.call(this);

		} else if (src.xlink == "page-last") {
			var pg = Math.floor(TOTALRESULTS/PERPAGE);
			//alert(pg);
			setpage(pg);
			mainviewR_close();
			search2.call(this);
			
		} else if (src.xlink == "remove-searchterm-main") {
			require("/helpers/LocalStorage").setString("search-string","");
			mainviewR_close();
			setpage(0);
			search2.call(this);
		} else if (src.xlink == "remove-searchterm") {
			var type = require("/helpers/LocalStorage").getString("type-string");
			var type_parts = type.split("|");
			var type = "";
			for (var i=0; i < type_parts.length; i++) {
				if (i == Number(src.xindex)) continue;
				if (type != "") type += "|";
				type += type_parts[i];
			}
			require("/helpers/LocalStorage").setString("type-string",type);
			mainviewR_close();
			setpage(0);
			search2.call(this);
		} else {
			var type = require("/helpers/LocalStorage").getString("type-string");
			if (type == null) type = "";
			if (type != "") type += "|";
			type += src.xlink;
			
			require("/helpers/LocalStorage").setString("type-string",type);
			mainviewR_close();
			setpage(0);
			search2.call(this);
		}
	};
	var tabRclick = function(e) {
		if (e && e.source && e.source.xlink) tabRclickHandler.call(this,e.source);
	};
	


	tabR.addEventListener("click", function(e) {
		if (e.row.xlink == "xignore") {
			return;
		} if (e.row.xlink == "remove-searchterm") {
			var type = require("/helpers/LocalStorage").getString("type-string");
			var type_parts = type.split("|");
			var type = "";
			for (var i=0; i < type_parts.length; i++) {
				if (i == Number(e.row.xindex)) continue;
				if (type != "") type += "|";
				type += type_parts[i];
			}
			require("/helpers/LocalStorage").setString("type-string",type);
			search2.call(this);
		} else {
			var type = require("/helpers/LocalStorage").getString("type-string");
			if (type == null) type = "";
			if (type != "") type += "|";
			type += e.row.xlink;
			
			require("/helpers/LocalStorage").setString("type-string",type);
			search2.call(this);
		}
	});
	var breadcrum_description = function(S) {
		if (S.indexOf("&qf=") == 0 && S.indexOf(":") == -1) {
			// &qf=searchterm
			return Ti.Network.decodeURIComponent(S.substring(4));
			
		}
		if (S.indexOf("&qf=") == 0) {
			// &qf=searchterm:value
			S_PARTS = S.substring(4).split(":",2);
			return L("sechead_"+S_PARTS[0])+" : "+Ti.Network.decodeURIComponent(S_PARTS[1]).replace(/\+/g," ") ;
		}
		return S;
	};
	
	
	var av = require('/ui/common/sidemenu/accordian_view');
	
	var refreshplacescnt = 0;
	var refreshplaces = function(places, totalResults, perpage, theme) {
		var _refreshplaces = refreshplacescnt;
		refreshplacescnt++;
		Ti.API.info("jcjc refreshplaces start ["+_refreshplaces+"]");


		
		TOTALRESULTS = totalResults;
		PERPAGE = perpage;

		subviewR.removeAllChildren();
		var subviewR2 = Ti.UI.createView({
			layout : 'vertical',
			top : 0,
			height : Ti.UI.SIZE
			
		});
		subviewR.add(subviewR2);
		
		subviewR2.add(smh.H1(totalResults + " " + LL("Matches for")+":"));
		if (theme != ""){
			subviewR2.add(smh.H1(LL("sechead_queryset") + " : " + theme));
		}


		var srch = require("/helpers/LocalStorage").getString("search-string");
		if (srch != "") {
			var v = smh.matchingLine(srch,"remove-searchterm-main",0);
			v.addEventListener('click',tabRclick);
			subviewR2.add(v);
		}



		var START = 1;
		
		var type = require("/helpers/LocalStorage").getString("type-string");
		if (!type || type == null) type = "";
//		Ti.API.debug("TYPE-STRING");
//		Ti.API.debug(type);
//		Ti.API.debug("TYPE-STRING");
		
		var type_parts = type.split("|");
		for (var i=0; i < type_parts.length; i++) {
			if (type_parts[i].indexOf("&start=") > -1) {
				START = Number(type_parts[i].substring(7));
			} else if (type_parts[i] != "") {
				var v = smh.matchingLine(breadcrum_description(type_parts[i]),"remove-searchterm",i);
				v.addEventListener('click',tabRclick);
				subviewR2.add(v);
			}
		}
		
		
		var PG = Number(getpage());
		var MAXPG = Math.floor(Number(totalResults) / Number(PERPAGE));
		//alert(Number(PERPAGE));
		//alert(Number(totalResults));
		//alert(MAXPG);

		// if (totalResults > 0) {
			// subviewR2.add(smh.spacer());
			// subviewR2.add(smh.H2("Results "+((PERPAGE * PG)+1)+" - "+Math.min(((PERPAGE * PG)+PERPAGE),totalResults)+" of "+totalResults));
// 	
			// var pagination = smh.pagination(getpage()+1,MAXPG+1);
			// pagination.addEventListener('click',tabRclick);
			// subviewR2.add(pagination);
		// }


		// refine		
		
		subviewR2.add(smh.spacer());
		subviewR2.add(smh.H1(LL("Refine_your_results")+":"));
		var addmorekeywords = smh.sectionhead(LL("Add_more_keywords"));
		addmorekeywords.fireEvent("open",{});
		subviewR2.add(addmorekeywords);
		

		var extrasearch = Ti.UI.createTextField({});
		
		subviewR2.add(smh.textbox(extrasearch));
		var addExtraSearchTerm = function() {
			var term = extrasearch.getValue();
			if (term != "") {
				term = "&qf="+Ti.Network.encodeURIComponent(term);
				addSearchTerm(term);
			}
		};
		extrasearch.addEventListener('return',addExtraSearchTerm);

		subviewR2.add(smh.spacer());

		// returned meta		
		
		var content = function(obj) {

			var xindex = Number(obj.xindex);

//			Ti.API.debug(sections[xindex]);
			
			var v0 = Ti.UI.createScrollView({
				contentHeight : 'auto',
				showVerticalScrollIndicator : true,
				scrollType : 'vertical'
			});

			var v = Ti.UI.createView({
				layout : 'vertical'
			});
			
			for (var i=0; i < sections[xindex].items.length; i++) {
				Ti.API.info("jcjc XXCONTENT-index-"+i);

				var lbl = smh.option(sections[xindex].items[i].xname,sections[xindex].items[i].xlink,sections[xindex].items[i].xname);
				
//				lbl.xlink = sections[xindex].items[i].xlink;
//				lbl.xname = sections[xindex].items[i].xname;
				lbl.addEventListener('click',tabRclick);
				v.add(lbl);
			}
			if (Ti.Platform.osname === 'android') return v;
			v0.add(v);
			return v0;
		};

		
		var sections = [];
		var section_index = -1;
		
		for (var i=0; i < places.length; i++) {
			Ti.API.info("jcjc XXCONTENT-place-"+i);
			if (!places[i] || places[i] == null) {
				//nothing
			} else if (places[i].indexOf("#") == 0) {
				section_index++;
				sections[section_index] = {
					items : []
				};
				var SECHEADTEXT = places[i];
				if (SECHEADTEXT != null) {
					if (SECHEADTEXT.indexOf("#") == 0) {
						SECHEADTEXT = LL("sechead_"+SECHEADTEXT.substring(1));
					} else {
						SECHEADTEXT = LL(SECHEADTEXT);
					}
				}
				if (SECHEADTEXT != null && SECHEADTEXT.indexOf("#") == 0 && SECHEADTEXT.length > 1) SECHEADTEXT = SECHEADTEXT.substring(1);
				var hv = smh.sectionhead(SECHEADTEXT);
				var v2 = av.createView({
					headerview : hv,
					xindex : section_index,
					xname : places[i],
					parameters : {
						xindex : section_index,
						xname : places[i]
					},
					content : content
//					content : "section for "+places[i]
				});
				subviewR2.add(v2.view);
				subviewR2.add(smh.spacer());
			} else {
				if (section_index > -1) {
					var place = places[i].split("|");
					var xlink = place[0];
					var xname = place[1];
					sections[section_index].items.push({
						xlink : xlink,
						xname : xname
					});
				}
			}
		}
		
		
		var rows = [];
		var section = null;
		
		Ti.API.info("jcjc refreshplaces end ["+_refreshplaces+"]");
		
	};


	refreshplaces("France Belgium".split(" "));	
	refreshplaces2 = function()  {
		var items = require("/helpers/LocalStorage").getObject("types");
		if (!items || items == null) items = [];

		var totalResults = require("/helpers/LocalStorage").getString("totalResults");
		if (!totalResults || totalResults == null || totalResults == "") totalResults = 0;

		var perpage = require("/helpers/LocalStorage").getString("perpage");
		if (!perpage || perpage == null || perpage == "") perpage = 0;

		var theme = require("/helpers/LocalStorage").getString("theme");
		if (!theme || theme == null || theme == "") theme = "";

		refreshplaces(items,Number(totalResults),Number(perpage),theme);	
	};
	
	
	self.add(mainviewL);
	self.add(mainviewR);
	self.add(mainviewHELP);

	mainview.add(mainview2);
//	mainview.add(mainview2_top);
	mainviewNonScrollingContainer.add(mainview2_top);
	
	var b1_sidemenu_toggle = Titanium.UI.createButton({
		title : "  "+LL("Refine")+"  ",
//		image : "/images/eu/icon-menu.png",
		backgroundColor:'#333333',
		color:'#ffffff',
		borderRadius : 5,
		width : 100,
		left : 10, 
		top : 0,
		height : (Ti.Platform.osname === 'android') ? 44 : 32,
//		height : 32,
		style : 0
	});
	var b1_slidemenu_toggle = Titanium.UI.createButton({
		image : "/images/eu/icon-menu.png",
		backgroundColor:'#333333',
		color:'#333333',
		height : (Ti.Platform.osname === 'android') ? 44 : 32,
		style : 0
	});
	var click = function(e) {
		Ti.API.info("jcjc click refince [mainviewR.xopen = "+mainviewR.xopen+"]");
		
		setTimeout(function(){
			if (mainviewR.xopen == false) {
				if (Ti.Platform.osname === 'android') {
					mainviewR.xopen = true;
					mainviewR.right = 0;
				} else {
					mainviewR.xopen = true;
					mainviewR.animate({right:0,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){
						mainviewR.right = 0;
					});
				}
			} else {
				mainviewR.xopen = false;
				//mainviewL.animate({left:-200,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
				//mainviewR.animate({left:-500,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
				mainviewR.animate({right:-500,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){
					mainviewR.right = -500;
				});
				
			}
		},0);
		
	};


/*
	var b1L = Titanium.UI.createView({
		width : 330,
		left : 10,
		height : Ti.UI.FILL
	});
	var tabLOpt1 = Ti.UI.createLabel({
		color : "#ffffff",
		backgroundColor : '#333333',
		text : "Home",
		textAlign : 'center',
		font : {
			fontFamily : "SinhalaSangamMN",
			fontSize : 14
		},
		height : 32,
		width : '30%',
		left : 0
	});
	tabLOpt1.addEventListener('click', function() {
		Titanium.App.fireEvent("display-search-force",{});
	});
	var tabLOpt2 = Ti.UI.createLabel({
		color : "#ffffff",
		backgroundColor : '#333333',
		text : "Search results",
		textAlign : 'center',
		font : {
			fontFamily : "SinhalaSangamMN",
			fontSize : 14
		},
		height : 32,
		width : '30%',
		left : '35%'
	});
	tabLOpt2.addEventListener('click', function() {
		close_displaySearchForce();
		Titanium.App.fireEvent("redisplay-search",{});			
	});
	var tabLOpt3 = Ti.UI.createLabel({
		color : "#ffffff",
		backgroundColor : '#333333',
		text : "Your favourites",
		textAlign : 'center',
		font : {
			fontFamily : "SinhalaSangamMN",
			fontSize : 14
		},
		height : 32,
		width : '30%',
		left : '70%'
	});
	tabLOpt3.addEventListener('click', function() {
		close_displaySearchForce();
		Titanium.App.fireEvent("redisplay-personal",{});		
	});
	b1L.add(tabLOpt1);
	b1L.add(tabLOpt2);
	b1L.add(tabLOpt3);
	
*/	
	
	var clickL = function(e) {
		
		if (mainviewL.xopen == false) {
			mainviewL.xopen = true;
			//mainviewL.animate({left:0,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
			mainviewL.animate({right:0,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
		} else {
			mainviewL.xopen = false;
			//mainviewL.animate({left:-200,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
			mainviewL.animate({right:-500,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
			
		}
		
	};
	
	var click_slidemenu = function() {
		Ti.App.fireEvent('togglemainviewWrapper',{});
	};
	
	
	b1_sidemenu_toggle.addEventListener("click", click);
	b1_slidemenu_toggle.addEventListener("click", click_slidemenu);
//	b1L.addEventListener("click", clickL);
	
	var b1emp = Titanium.UI.createButton({
		image : '',
		width:15
	});
	var b2emp = Titanium.UI.createButton({
		image : '',
		width:145
	});
	var b1muse = Titanium.UI.createImageView({
		image : 'images/small-logo.png'
	});
	
	var bb1 = {
		index : 0
	};

	var bb1help = Ti.UI.createLabel({
		color : "#ffffff",
		backgroundColor : '#333333',
		text : LL("Help"),
		textAlign : 'center',
		font : {
			fontFamily : "SinhalaSangamMN",
			fontSize : 14
		},
		height : 32,
	    width:50,
		left : 10
	});
	bb1help.addEventListener('click', function() {
		Titanium.App.fireEvent("display-main-help",{});
	});
	
	var topbar = Ti.UI.createView({
		top:0,right:0,left:0,height:TOPBARHEIGHT,
		backgroundColor : css.DARKBACKGROUND
	});
	var topbar_left = Ti.UI.createView({
		layout : 'horizontal',
		top:0,left:0,height:TOPBARHEIGHT,
		width : Ti.UI.SIZE,
		backgroundColor : css.DARKBACKGROUND
	});

	var topbar_right = Ti.UI.createView({
		layout : 'horizontal',
		top:0,right:0,height:TOPBARHEIGHT,
		width : Ti.UI.SIZE,
		backgroundColor : css.DARKBACKGROUND
	});

	topbar_left.add(b1_slidemenu_toggle);
//	topbar.add(b1L);// this was the 
//	topbar.add(bb1help);
	topbar.add(b1muse);
	
//	topbar_right.add(search);
    search.blur();

	topbar_right.add(b1_sidemenu_toggle);
	

	topview.add(topbar);
	topview.add(topbar_left);
	topview.add(topbar_right);
//	topview.add(b1_sidemenu_toggle);
	
	var search2 = function() {
		Ti.App.fireEvent("app:checklocale",{});
		
		workingView.show();
		var pg = getpage();
		if (Number(pg) == 0) {
			working();
		}
		
		var srch = require("/helpers/LocalStorage").getString("search-string");
		var yr = require("/helpers/LocalStorage").getString("yr-string");
		var place = require("/helpers/LocalStorage").getString("place-string");
		var type = require("/helpers/LocalStorage").getString("type-string");
		var query = require("/helpers/LocalStorage").getString("query-string");
		var mls = require("/helpers/LocalStorage").getString("multilanguage_search");
		if (!mls || mls == "") mls = "n";

		lock_displaySearchForce = false;
		
		var type_parts = type.split("|");
		type = "";
		for (var i=0; i < type_parts.length; i++) {
			type += type_parts[i];	
		}

		search.setValue(srch);

		require("/helpers/flurry").log("search",{ "srch": srch, "typelength" : type_parts.length, "query" : query });

		
		var ajax = require("/helpers/ajax");
		var __URL = require("/etc/config").api+"?action=json-srch&lang="+L("lang")+"&query="+query+"&mls="+mls+"&page="+pg+"&srch="+srch+"&type="+Ti.Network.encodeURIComponent(type);
		ajax.getdata({
			url : __URL,
			timeout : 60000,
			err : function(e) {
				Titanium.App.fireEvent("redisplay-search",{xfrom : 'search2'});
			},
			fn : function(e) {
//				Ti.API.info(e.data);
				try {

					if (Number(pg) == 0) {
						if (e.data && e.data.items && e.data.items != null && e.data.items.length > 0) {
							require("/helpers/LocalStorage").setObject("search",e.data.items);
							require("/helpers/LocalStorage").setObject("types",e.data.types);
							require("/helpers/LocalStorage").setString("totalResults",e.data.totalResults);
							require("/helpers/LocalStorage").setString("perpage",e.data.perpage);
							require("/helpers/LocalStorage").setString("theme",e.data.theme);
							require("/helpers/LocalStorage").setString("search-message",e.data.status_msg);
							
							bb1.index = 1;
			
							Ti.API.info("__URL");
							Ti.API.info(__URL);
							Ti.API.info("__URL");
						}
						Titanium.App.fireEvent("redisplay-search",{xfrom : 'search2'});
					} else {
						if (e.data && e.data.items && e.data.items != null && e.data.items.length > 0) {
							var current_items = require("/helpers/LocalStorage").getObject("search");
							var concattonated_array = current_items.concat(e.data.items);
							require("/helpers/LocalStorage").setObject("search",concattonated_array);
							addItemsToSearch(concattonated_array,current_items.length);
							current_items = null;
							concattonated_array = null;
						}
					}
				} catch (EX) {
					Ti.API.error(EX);
					Titanium.App.fireEvent("redisplay-search",{xfrom : 'search2'});
				}
			}
		});
	};
	Titanium.App.addEventListener("app:search2",search2);
	search.addEventListener("click", function() {
//		search.value='';
	});
	search.addEventListener("return", function() {
		var srchrealval = search.getValue();
		// srchrealval = srchrealval.replace(" ","_");
		// srchrealval = srchrealval.replace(" ","_");
		// srchrealval = srchrealval.replace(" ","_");
		// srchrealval = srchrealval.replace(" ","_");

		require("/helpers/LocalStorage").setString("search-string",srchrealval);
		require("/helpers/LocalStorage").setString("yr-string","");
		require("/helpers/LocalStorage").setString("place-string","");
		require("/helpers/LocalStorage").setString("type-string","");
		require("/helpers/LocalStorage").setString("query-string","");
		require("/helpers/LocalStorage").setString("page","0");
		if (mainviewL.xopen == true) {
			mainviewL.xopen = false;
			//mainviewL.animate({left:-200,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
			//mainviewR.animate({left:-500,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
			mainviewR.animate({right:-500,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
		}

		search2.call(this);
	});
	
	var callsearchfromotherplace = function(searchval){
		require("/helpers/LocalStorage").setString("search-string",searchval);
		require("/helpers/LocalStorage").setString("yr-string","");
		require("/helpers/LocalStorage").setString("place-string","");
		require("/helpers/LocalStorage").setString("type-string","");
		require("/helpers/LocalStorage").setString("query-string","");
		require("/helpers/LocalStorage").setString("page","0");
		search2.call(this);
	};
	
	var cnt = 0;
	var cntrow = 0;
	var amnt = 0;
	var vw = null;
	var type = 0;

	function redisplaySearchSetup() {
		return;
		// old stuff //
		var itemClass = require("/ui/common/itemViewShellV2");		
		for (var i=0; i <MAXITEMS; i++) {
			if (amnt == 0) {
				if (vw != null) {
					mainview2.add(vw);
				}
				if (cnt % 10 == 0) {
					cntrow = (cntrow == 0) ? 1 : 0;
				}
				if ((cnt+cntrow) % 2 == 0) {
					vw = Titanium.UI.createView({
						width:370,
						height:420,
						layout : 'vertical'
					});
					amnt = 2;
					type = 2;
				} else {
					vw = Titanium.UI.createView({
						width:270,
						height:420,
						layout : 'vertical'
					});
					amnt = 3;
					type = 3;
				}
				cnt++;
				// if (cnt == 11) cnt++;
				// if (cnt == 23) cnt++;
				// if (cnt == 34) cnt++;
				// if (cnt == 45) cnt++;
			}
			var view = new itemClass(type,i);
			vw.add(view);
			amnt--;
		}
		
	};

	function working() {
		var transform1 = Titanium.UI.create2DMatrix();
		transform1 = transform1.scale(0.8);
		var animation1 = Titanium.UI.createAnimation({
			transform: transform1,
			anchorPoint : {x : 0, y : 0},
			duration: 500,
			curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
		});
		mainview2.animate(animation1);
		add_spinner(mainview,100,300);
		
	}
	function done() {
		var transform1 = Titanium.UI.create2DMatrix();
		transform1 = transform1.scale(1);
		var animation1 = Titanium.UI.createAnimation({
			transform: transform1,
			anchorPoint : {x : 0, y : 0},
			duration: 500,
			curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
		});
		mainview2.animate(animation1);
		mainview.scrollTo(0,40);
		mainview.fireEvent("done-spinning");
	}
	var displaySearchForceView = function() {
		var xview = Ti.UI.createView({
			top:0,left:0,height:Ti.UI.FILL,width:Ti.UI.FILL,
			backgroundColor:"#000000"
		});
		var ximg = Ti.UI.createImageView({
			top:'5%',
			image:'/images/eu/europeana-logo-white.png',
			height : '20%'
		});
		xview.add(ximg);
		
		
		var xsearch = Titanium.UI.createTextField({
			top:'35%',
			height : 54,
			autocorrect : false,
			autocapitalization : false,
			clearButtonMode : 1,
			width : '90%',
			borderRadius : 5,
			backgroundColor : css.VERYLIGHTCOLOUR,
			borderColor : css.LIGHTCOLOUR,
			paddingLeft : 20,
			borderWidth : 1,
			hintText : LL("search_hint"),
			color : "#676767",
			value : "",
			font : {
				fontFamily : "arial",
				fontSize : 20
			}
		});
		xview.add(xsearch);
		var ximg1 = Ti.UI.createImageView({
 			top:'35%',
			 width : 60,
			 touchEnabled : false,
			 right:'5%',
			 image:'/images/srch-but-white-v2.png'
		});
		xview.add(ximg1);
		var ximg_left = Ti.UI.createImageView({
			 top:428,
			 left:10,
			 width : 50,
			 zIndex : 99,
			 image:'/images/eu/arrow-left.png'
		});
		var ximg_right = Ti.UI.createImageView({
			 top:428,
			 right:10,
			 width : 50,
			 zIndex : 99,
			 image:'/images/eu/arrow-right.png'
		});
		
		var perform_pre_determined_search = function(e) {
			if (!e.source.xindex) return;
			var idx = Number(e.source.xindex)-1;
			
//			x.close();
			lock_displaySearchForce = false;
			require("/helpers/LocalStorage").setString("search-string","");
			require("/helpers/LocalStorage").setString("yr-string","");
			require("/helpers/LocalStorage").setString("place-string","");
			require("/helpers/LocalStorage").setString("page","0");
			require("/helpers/LocalStorage").setString("type-string",require("/helpers/LocalStorage").getObject("featured-items").items[idx].query);
			require("/helpers/LocalStorage").setString("query-string",require("/helpers/LocalStorage").getObject("featured-items").items[idx].query2);
			search2.call(this);
			
		};

		var perform_search = function() {
//			x.close();
			lock_displaySearchForce = false;
			require("/helpers/LocalStorage").setString("search-string",xsearch.value);
			require("/helpers/LocalStorage").setString("yr-string","");
			require("/helpers/LocalStorage").setString("place-string","");
			require("/helpers/LocalStorage").setString("page","0");
			require("/helpers/LocalStorage").setString("type-string","");
			require("/helpers/LocalStorage").setString("query-string","");
			search2.call(this);
		};
		
		
		var feature_view = Ti.UI.createView({
			top:'50%',
			width : '90%',
			height : 320,
			backgroundColor : "#000000"
		});
		xview.add(feature_view);

		add_spinner(feature_view);
		
		var ajax = require("/helpers/ajax");
		ajax.getdata({
			url : require("/etc/config").api+"?action=get-featured&lang="+L("lang"),
			index : 2,
			err : function(e) {
//				Ti.API.debug(e);
			},
			fn : function(e) {
				//Ti.API.debug(e.data.items);
				require("/helpers/LocalStorage").setObject("featured-items",{ items : e.data.items});
				require("/helpers/LocalStorage").setString("help",e.data.help);
				feature_view.fireEvent("done-spinning");
				addFeaturedArticles.call(this,feature_view,perform_pre_determined_search,ximg_left,ximg_right);
			}
		});
		
		var srchval = search.value;
		xsearch.value = srchval;
		xsearch.addEventListener("return", perform_search);
		
		return xview;
		
	};	

	var ActiveViews = [];

	function redisplaySearch2(e) {

		// var preview = function(identifier,cnt,typ) {
			// mainviewR_close();
			// var winClass = require("/ui/common/PlayWindowV2");
			// var preview_win = new winClass(identifier,cnt,typ);
		// };
// 	
		// var click = function(e) {
			// preview.call(this,e.source.xindent,e.source.xcnt,e.source.xtyp);
		// };

		if (!e.xfrom || e.xfrom != "search2") {
//			if (curr_event == "search") {
//				Titanium.App.fireEvent("display-search-force",{});
//				return;
//			}
		}
		
		curr_event = "search";
		close_displaySearchForce();
//		Titanium.App.fireEvent("clearall",{});
		b1_sidemenu_toggle.setEnabled(true);
		b1_sidemenu_toggle.show();
		bb1.index = 1;
		done();


		workingView.show();
		
		require("/helpers/flurry").log("displayresults",{ "from": e.xfrom });


		var items = require("/helpers/LocalStorage").getObject("search");
		if (!items || items == null) items = [];
		
		ActiveViewsToRemove = [];

		if (items.length < ActiveViews.length) {
			// for (var i=items.length; i < ActiveViews.length; i++) {
				// ActiveViews[i].parent.remove(ActiveViews[i]);
			// }
			if (items.length == 0) {
				ActiveViews = [];
			} else {
				ActiveViewsToRemove = ActiveViews.slice(items.length);
				ActiveViews = ActiveViews.slice(0,items.length);
			}
		}

		// for (var i=0; i < mainviews.length; i++) {
			// mainviews[i].removeAllChildren();
			// ActiveViews = [];
		// }

		if (items.length  > 0)	mainviewWrapper.scrollToView(1);

		
		var itemClass = require("/ui/common/itemViewV2");
		for (var i=0; i <items.length; i++) {

			// vw = Titanium.UI.createView({
				// width:270,
				// height:420,
				// layout : 'vertical'
			// })
			if (i >= ActiveViews.length) {
				var type = (i%2)+1;
				var _view = new itemClass(type,items[i],i);
//				_view.addEventListener("click",click);
				_view.fireEvent("loadimage",{});
				ActiveViews.push(_view);
				mainviews[i%(mainviews.length)].add(_view);
			} else {
				ActiveViews[i].fireEvent("replace",{
					guid : items[i].guid,
					id : items[i].id,
					type : items[i].type,
					enclosure : items[i].enclosure,
					xcnt : items[i].xcnt
				});
			}
		}
		
		
		if (ActiveViewsToRemove.length > 0) {
			ActiveViewsToRemove = ActiveViewsToRemove.reverse();
			for (var i=0; i < ActiveViewsToRemove.length; i++) {
				ActiveViewsToRemove[i].parent.remove(ActiveViewsToRemove[i]);
			}
			ActiveViewsToRemove = [];
		}		
		
		Ti.App.fireEvent("app-endscroll",{
			x : 0,
			y : 0,
			force : 1,
			w : mainview.getSize().width,
			h : mainview.getSize().height
		});




		refreshplaces2();
		refreshleftlist2();
		alert("iems.length " + items.lengt + " / " +require("/helpers/LocalStorage").getString("type-string"));
		if (items.length == 0 || items.length == null) {
			if (require("/helpers/LocalStorage").getString("type-string") == "" || require("/helpers/LocalStorage").getString("type-string") == null) {
				Titanium.App.fireEvent("display-search-force",{});
			} else {
				require("/ui/common/growl/fn").growl(require("/helpers/LocalStorage").getString("search-message"),mainviewR_open);
				require("/helpers/LocalStorage").setString("search-message","");
			}
		} else {
//			require("/helpers/LocalStorage").getString("search-message","");
		}
	};


	var PAGE = 0;

	function addNextButton() {
		var btn = Ti.UI.createButton({
			title: LL('Load_More'),
			backgroundColor:'#333333',
			color:'#ffffff',
			top : 10,
			bottom : 10,
			borderRadius : 5,
			width : Ti.UI.FILL,
			height : (Ti.Platform.osname === 'android') ? 44 : 32,
			style : 0
		});
		var MV = (mainviews.length > 1) ? 1 : 0;
		mainviews[MV].add(btn);
		btn.addEventListener('click', function() {
			mainviews[MV].remove(btn);
			var pg = Number(getpage());
			pg++;
			setpage(pg);
			search2();
		});
		
	}
	function addItemsToSearch(items,start) {

		var itemClass = require("/ui/common/itemViewV2");
		for (var i=start; i <items.length; i++) {

			if (mainviews.length > 1 && i > start && ((i+3) % 18) == 0) {
				// the line 16,17,18 line which is index 15,16,17
				if (mainviews[0]._totheight > mainviews[1]._totheight && mainviews[0]._totheight > mainviews[2]._totheight) {
					mainviews[0]._nextheight = 140;
					mainviews[1]._nextheight = (mainviews[0]._totheight - mainviews[1]._totheight)+140;
					mainviews[2]._nextheight = (mainviews[0]._totheight - mainviews[2]._totheight)+140;
					
				} else if (mainviews[1]._totheight > mainviews[0]._totheight && mainviews[1]._totheight > mainviews[2]._totheight) {
					mainviews[1]._nextheight = 140;
					mainviews[0]._nextheight = (mainviews[1]._totheight - mainviews[0]._totheight)+140;
					mainviews[2]._nextheight = (mainviews[1]._totheight - mainviews[2]._totheight)+140;

				} else {
					mainviews[2]._nextheight = 140;
					mainviews[1]._nextheight = (mainviews[2]._totheight - mainviews[1]._totheight)+140;
					mainviews[0]._nextheight = (mainviews[2]._totheight - mainviews[0]._totheight)+140;
				}
				
				
			}



			if (i >= ActiveViews.length) {
				var type = (i%2)+1;
				var _view = new itemClass(type,items[i],i);
//				_view.addEventListener("click",click);
				_view.fireEvent("loadimage",{});
				ActiveViews.push(_view);
				mainviews[i%(mainviews.length)].add(_view);
			} else {
				ActiveViews[i].fireEvent("replace",{
					guid : items[i].guid,
					id : items[i].id,
					type : items[i].type,
					enclosure : items[i].enclosure,
					xcnt : items[i].xcnt
				});
			}
		}

		var totalResults = require("/helpers/LocalStorage").getString("totalResults");
		if (!totalResults || totalResults == null || totalResults == "") totalResults = 0;
		
		if (Number(totalResults) > ActiveViews.length) {
			addNextButton();
		}
		workingView.hide();
		
	}
	function redisplaySearch2_test(e) {
		Ti.App.fireEvent("app:checklocale",{});

		curr_event = "search";
		close_displaySearchForce();
		b1_sidemenu_toggle.setEnabled(true);
		b1_sidemenu_toggle.show();
		bb1.index = 1;
		done();


		workingView.show();
		
		require("/helpers/flurry").log("displayresults",{ "from": e.xfrom });


		var items = require("/helpers/LocalStorage").getObject("search");
		if (!items || items == null) items = [];
		if (items.length > 0) mainviewWrapper.scrollToView(1);	
		
		
		if (require("/etc/config").format == "phone") {
			mainview2.remove(mainviews[0]);
			mainviews[0] = (Titanium.UI.createView({
				top:0,left:0,
				width:'100%',
				_totheight : 0,
				_nextheight : 0,
				height : Ti.UI.SIZE,
				backgroundColor:"transparent", borderWidth:0, borderColor:css.VERYLIGHTCOLOUR,
				layout:"vertical"
			}));
			mainview2.add(mainviews[0]);
		} else {

	
			mainview2.remove(mainviews[0]);
			mainview2.remove(mainviews[1]);
			mainview2.remove(mainviews[2]);
			
			mainviews[0] = (Titanium.UI.createView({
				top:0,left:0,
				_totheight : 0,
				_nextheight : 0,
				width:'30%',
				height : Ti.UI.SIZE,
				zIndex:99,
				backgroundColor:"transparent", borderWidth:0, borderColor:css.VERYLIGHTCOLOUR,
				layout:"vertical"
			}));
			mainviews[1] = (Titanium.UI.createView({
				top:0,left:'35%',
				_totheight : 0,
				_nextheight : 0,
				width:'30%',
				height : Ti.UI.SIZE,
				zIndex:99,
				backgroundColor:"transparent", borderWidth:0, borderColor:css.VERYLIGHTCOLOUR,
				layout:"vertical"
			}));
			mainviews[2] = (Titanium.UI.createView({
				top:0,left:'70%',
				width:'30%',
				_totheight : 0,
				_nextheight : 0,
				zIndex:99,
				height : Ti.UI.SIZE,
				backgroundColor:"transparent", borderWidth:0, borderColor:css.VERYLIGHTCOLOUR,
				layout:"vertical"
			}));
			mainview2.add(mainviews[0]);
			mainview2.add(mainviews[1]);
			mainview2.add(mainviews[2]);
		}

		ActiveViews = [];
		
		var itemClass = require("/ui/common/itemViewV2");
		for (var i=0; i <items.length; i++) {

			// vw = Titanium.UI.createView({
				// width:270,
				// height:420,
				// layout : 'vertical'
			// })
			if (mainviews.length > 2 && i > 10 && ((i+3) % 18) == 0) {
				// the line 16,17,18 line which is index 15,16,17
				if (mainviews[0]._totheight > mainviews[1]._totheight && mainviews[0]._totheight > mainviews[2]._totheight) {
					mainviews[0]._nextheight = 140;
					mainviews[1]._nextheight = (mainviews[0]._totheight - mainviews[1]._totheight)+140;
					mainviews[2]._nextheight = (mainviews[0]._totheight - mainviews[2]._totheight)+140;
					
				} else if (mainviews[1]._totheight > mainviews[0]._totheight && mainviews[1]._totheight > mainviews[2]._totheight) {
					mainviews[1]._nextheight = 140;
					mainviews[0]._nextheight = (mainviews[1]._totheight - mainviews[0]._totheight)+140;
					mainviews[2]._nextheight = (mainviews[1]._totheight - mainviews[2]._totheight)+140;

				} else {
					mainviews[2]._nextheight = 140;
					mainviews[1]._nextheight = (mainviews[2]._totheight - mainviews[1]._totheight)+140;
					mainviews[0]._nextheight = (mainviews[2]._totheight - mainviews[0]._totheight)+140;
				}
				
				
			}
			if (i >= ActiveViews.length) {
				var type = (i%2)+1;
				var _view = new itemClass(type,items[i],i,mainviews[i%(mainviews.length)]._nextheight);
//				_view.addEventListener("click",click);
				_view.fireEvent("loadimage",{});
				ActiveViews.push(_view);
				mainviews[i%(mainviews.length)].add(_view);
				mainviews[i%(mainviews.length)]._totheight += _view.height;
				mainviews[i%(mainviews.length)]._nextheight = 0;
			} else {
				ActiveViews[i].fireEvent("replace",{
					guid : items[i].guid,
					id : items[i].id,
					type : items[i].type,
					enclosure : items[i].enclosure,
					xcnt : items[i].xcnt
				});
			}
		}
		var totalResults = require("/helpers/LocalStorage").getString("totalResults");
		if (!totalResults || totalResults == null || totalResults == "") totalResults = 0;
		
		if (Number(totalResults) > ActiveViews.length) {
			addNextButton();
		}

		setTimeout(function() {		
		Ti.App.fireEvent("app-endscroll",{
			x : 0,
			y : 0,
			force : 1,
			w : mainview.getSize().width,
			h : mainview.getSize().height
		}); 
		},100);

		// search box
		mainview2_top_open();




		refreshplaces2();
		refreshleftlist2();
//		alert("iems.length " + items.length + " / " +require("/helpers/LocalStorage").getString("type-string"));
		if (items.length == 0 || items.length == null) {
			if (require("/helpers/LocalStorage").getString("type-string") == "" || require("/helpers/LocalStorage").getString("type-string") == null) {
				Titanium.App.fireEvent("display-search-force",{});
			} else {
				require("/ui/common/growl/fn").growl(require("/helpers/LocalStorage").getString("search-message"),mainviewR_open);
				require("/helpers/LocalStorage").setString("search-message","");
			}
		} else {
//			require("/helpers/LocalStorage").getString("search-message","");
		}
	};



	function redisplayPersonal2_test(e) {
		Ti.App.fireEvent("app:checklocale",{});
		mainviewWrapper.scrollToView(1);	


		curr_event = "pers";
		var items = require("/helpers/LocalStorage").getObject("personal");
		if (!items || items == null) items = [];
		
		if (items == null || items == ""){
			alert('Your favourites will appear here');
			return;
		};

		mainviewR_close();
		mainview2_top_close();
		close_displaySearchForce();
		b1_sidemenu_toggle.setEnabled(false);
		b1_sidemenu_toggle.hide();
		require("/helpers/flurry").log("display_favourites",{ });
		bb1.index = 2;
		done();


		workingView.show();
		
		if (require("/etc/config").format == "phone") {
			mainview2.remove(mainviews[0]);
			mainviews.push(Titanium.UI.createView({
				top:0,left:0,
				width:'100%',
				_totheight : 0,
				_nextheight : 0,
				height : Ti.UI.SIZE,
				backgroundColor:"transparent", borderWidth:0, borderColor:css.VERYLIGHTCOLOUR,
				layout:"vertical"
			}));
			mainview2.add(mainviews[0]);
		} else {
	
			mainview2.remove(mainviews[0]);
			mainview2.remove(mainviews[1]);
			mainview2.remove(mainviews[2]);
			
			mainviews[0] = (Titanium.UI.createView({
				top:0,left:0,
				width:'30%',
				height : Ti.UI.SIZE,
				backgroundColor:"transparent", borderWidth:0, borderColor:css.VERYLIGHTCOLOUR,
				layout:"vertical"
			}));
			mainviews[1] = (Titanium.UI.createView({
				top:0,left:'35%',
				width:'30%',
				height : Ti.UI.SIZE,
				backgroundColor:"transparent", borderWidth:0, borderColor:css.VERYLIGHTCOLOUR,
				layout:"vertical"
			}));
			mainviews[2] = (Titanium.UI.createView({
				top:0,left:'70%',
				width:'30%',
				height : Ti.UI.SIZE,
				backgroundColor:"transparent", borderWidth:0, borderColor:css.VERYLIGHTCOLOUR,
				layout:"vertical"
			}));
			mainview2.add(mainviews[0]);
			mainview2.add(mainviews[1]);
			mainview2.add(mainviews[2]);
		}

		ActiveViews = [];
		
		var itemClass = require("/ui/common/itemViewV2");
		for (var i=0; i <items.length; i++) {

			// vw = Titanium.UI.createView({
				// width:270,
				// height:420,
				// layout : 'vertical'
			// })
			if (i >= ActiveViews.length) {
				var type = (i%2)+1;
				var _view = new itemClass(type,items[i],i);
//				_view.addEventListener("click",click);
				_view.fireEvent("loadimage",{});
				ActiveViews.push(_view);
				mainviews[i%(mainviews.length)].add(_view);
			} else {
				ActiveViews[i].fireEvent("replace",{
					guid : items[i].guid,
					id : items[i].id,
					type : items[i].type,
					enclosure : items[i].enclosure,
					xcnt : items[i].xcnt
				});
			}
		}
		
		Ti.App.fireEvent("app-endscroll",{
			x : 0,
			y : 0,
			force : 1,
			w : mainview.getSize().width,
			h : mainview.getSize().height
		});


		if (items.length == 0 || items.length == null) {
			Titanium.App.fireEvent("display-search-force",{});
		}

	};


	
	function redisplayPersonal2() {
//		if (curr_event == "pers") return;

		mainviewWrapper.scrollToView(1);	

		curr_event = "pers";
		var items = require("/helpers/LocalStorage").getObject("personal");
		if (!items || items == null) items = [];
		
		if (items == null || items == ""){
			alert('Your favourites will appear here');
			return;
		};
		
		mainviewR_close();
		mainview2_top_close();
		close_displaySearchForce();
		b1_sidemenu_toggle.setEnabled(false);
		b1_sidemenu_toggle.hide();
		require("/helpers/flurry").log("display_favourites",{ });
		bb1.index = 2;
		done();
	
		// NEW START

		workingView.show();

		ActiveViewsToRemove = [];
		
		if (items.length < ActiveViews.length) {
			// for (var i=items.length; i < ActiveViews.length; i++) {
				// ActiveViews[i].parent.remove(ActiveViews[i]);
			// }
			if (items.length == 0) {
				ActiveViews = [];
			} else {
				ActiveViewsToRemove = ActiveViews.slice(items.length);
				ActiveViews = ActiveViews.slice(0,items.length);
			}
		}
		// for (var i=0; i < mainviews.length; i++) {
			// mainviews[i].removeAllChildren();
			// ActiveViews = [];
		// }

		
		var itemClass = require("/ui/common/itemViewV2");
		for (var i=0; i <items.length; i++) {

			// vw = Titanium.UI.createView({
				// width:270,
				// height:420,
				// layout : 'vertical'
			// })
			if (i >= ActiveViews.length) {
				var type = (i%2)+1;
				var _view = new itemClass(type,items[i],i);
				_view.addEventListener("click",click);
				_view.fireEvent("loadimage",{});
				ActiveViews.push(_view);
				mainviews[i%(mainviews.length)].add(_view);
			} else {
				ActiveViews[i].fireEvent("replace",{
					guid : items[i].guid,
					id : items[i].id,
					type : items[i].type,
					enclosure : items[i].enclosure,
					xcnt : items[i].xcnt
				});
			}
		}
		
		
		if (ActiveViewsToRemove.length > 0) {
			ActiveViewsToRemove = ActiveViewsToRemove.reverse();
			for (var i=0; i < ActiveViewsToRemove.length; i++) {
				ActiveViewsToRemove[i].parent.remove(ActiveViewsToRemove[i]);
			}
			ActiveViewsToRemove = [];
		}
		


		Ti.App.fireEvent("app-endscroll",{
			x : 0,
			y : 0,
			force : 1,
			w : mainview.getSize().width,
			h : mainview.getSize().height
		});
		
		// NEW END





		// var itemClass = require("/ui/common/itemViewV2");
// 		
		// for (var i=0; i <items.length; i++) {
// 			
			// Titanium.App.fireEvent("load-"+i,{item:items[i]});
// 
		// }

		if (items.length == 0 || items.length == null) {
			Titanium.App.fireEvent("display-search-force",{});
		}
		
	};
	
	redisplaySearchSetup();
	Titanium.App.addEventListener("redisplay-search",redisplaySearch2_test);
	Titanium.App.addEventListener("redisplay-personal",redisplayPersonal2_test);


	self.add(topview);

	var homeView = displaySearchForceView();

	
	var mainviewWrapper = Ti.UI.createScrollableView({
		top:TOPBARHEIGHT,
		left:0,
		width:'100%',
		height:Ti.UI.FILL,
		currentPage : 1,
//		touchEnabled : false,
		scrollingEnabled : false,
		backgroundColor:css.DARKBACKGROUND,
		views : [homeView,mainviewNonScrollingContainer]
//		views : [homeView,mainview]
	});

	self.add(mainviewWrapper);

	mainviewWrapper.x_open = 0;
	var togglemainviewWrapper = function() {
		Ti.App.fireEvent("app:checklocale",{});

		mainviewR_close();
		if (mainviewWrapper.x_open == 0) {
			mainviewWrapper.x_open = 2;
//			mainview.width = mainview.getSize().width;
			mainviewWrapper.animate({left:200,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){
//				mainview.width = '100%';
				mainviewWrapper.x_open = 1;
			});
		}
		if (mainviewWrapper.x_open == 1) {
			mainviewWrapper.x_open = 2;
//			mainview.width = mainview.getSize().width;
			mainviewWrapper.animate({left:0,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){
//				mainview.width = '100%';
				mainviewWrapper.x_open = 0;
			});
			
		}
	};
	var closemainviewWrapper = function() {
		Ti.App.fireEvent("app:checklocale",{});
		mainviewR_close();
		mainview2_top_close();
		if (mainviewWrapper.x_open == 1) {
			mainviewWrapper.x_open = 2;
			mainviewWrapper.animate({left:0,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){
				mainviewWrapper.x_open = 0;
			});
			
		}
	};

	Ti.App.addEventListener('togglemainviewWrapper',togglemainviewWrapper);
	Ti.App.addEventListener('closemainviewWrapper',closemainviewWrapper);
	
	
	var displayhelp = function() {
		
		var helptext = require("/helpers/LocalStorage").getString("help");
		mainviewHELP_textbox.html = helptext;
		mainviewHELP_click();
		return;		
		

		var x = Ti.UI.createWindow({
		});
		x.add(Ti.UI.createView({
			top:0,left:0,height:Ti.UI.FILL,width:Ti.UI.FILL,backgroundColor:"#333333",opacity:0.2
		}));
		/*
		x.add(Ti.UI.createImageView({
			top:0,left:0,height:Ti.UI.FILL,width:Ti.UI.FILL,
			image : '/images/eu/help-header.png'
		}));
		*/
		x.add(Ti.UI.createLabel({
			text : helptext,
			color : "#fff"
		}));
		x.addEventListener('click',function(e) {
			x.close();
		});
		x.open();
	};
//	self.addEventListener('click', displayhelp);
	Titanium.App.addEventListener("display-main-help",displayhelp);
//	setTimeout(displayhelp,1000);
	var lock_displaySearchForce = false;
	var win_displaySearchForce = null;
	var close_displaySearchForce = function() {
		return;
		if (win_displaySearchForce != null) {
			win_displaySearchForce.close();
			lock_displaySearchForce = false;
		}
	};
	
	
	var displaySearchForce = function() {
		mainviewWrapper.scrollToView(0);	
		b1_sidemenu_toggle.setEnabled(false);
		b1_sidemenu_toggle.hide();
		return;
		
		if (lock_displaySearchForce == true) {
			if (win_displaySearchForce != null) {
				win_displaySearchForce.close();
				lock_displaySearchForce = false;
			}
			return;
		}
		lock_displaySearchForce = true;
		bb1.index = 0;
		mainviewR_close();
		mainview2_top_close();
		b1_sidemenu_toggle.setEnabled(false);
		b1_sidemenu_toggle.hide();
		
		var x = Ti.UI.createWindow({
			top:40,
			left : mainview.getSize().left,
			width : '100%'
		});
		win_displaySearchForce = x;
		
		var xview = Ti.UI.createView({
			top:0,left:0,height:Ti.UI.FILL,width:Ti.UI.FILL,backgroundColor:css.LIGHTCOLOUR
		});
		x.add(xview);
		var ximg = Ti.UI.createImageView({
			top:'5%',
			image:'/images/eu/europeana-logo-white.png',
			height : '20%'
		});
		xview.add(ximg);
		
		
		var xsearch = Titanium.UI.createTextField({
			top:'35%',
			height : 54,
			autocorrect : false,
			autocapitalization : false,
			clearButtonMode : 1,
			width : '90%',
			borderRadius : 5,
			backgroundColor : css.VERYLIGHTCOLOUR,
			borderColor : css.LIGHTCOLOUR,
			paddingLeft : 20,
			borderWidth : 1,
			hintText : LL("search_hint"),
			color : "#676767",
			value : "",
			font : {
				fontFamily : "arial",
				fontSize : 20
			}
		});
		xview.add(xsearch);
		var ximg1 = Ti.UI.createImageView({
 			top:'35%',
			 width : 60,
			 touchEnabled : false,
			 right:'5%',
			 image:'/images/srch-but-white.png'
		});
		xview.add(ximg1);
		var ximg_left = Ti.UI.createImageView({
			 top:428,
			 left:10,
			 width : 50,
			 zIndex : 99,
			 image:'/images/eu/arrow-left.png'
		});
//		xview.add(ximg_left);
		var ximg_right = Ti.UI.createImageView({
			 top:428,
			 right:10,
			 width : 50,
			 zIndex : 99,
			 image:'/images/eu/arrow-right.png'
		});
//		xview.add(ximg_right);		

		
		var perform_pre_determined_search = function(e) {
			if (!e.source.xindex) return;
			var idx = Number(e.source.xindex)-1;
			
			x.close();
			lock_displaySearchForce = false;
			require("/helpers/LocalStorage").setString("search-string","");
			require("/helpers/LocalStorage").setString("yr-string","");
			require("/helpers/LocalStorage").setString("place-string","");
			require("/helpers/LocalStorage").setString("page","0");
			require("/helpers/LocalStorage").setString("type-string",require("/helpers/LocalStorage").getObject("featured-items").items[idx].query);
			require("/helpers/LocalStorage").setString("query-string",require("/helpers/LocalStorage").getObject("featured-items").items[idx].query2);
			search2.call(this);
			
		};

		var perform_search = function() {
			x.close();
			lock_displaySearchForce = false;
			require("/helpers/LocalStorage").setString("search-string",xsearch.value);
			require("/helpers/LocalStorage").setString("yr-string","");
			require("/helpers/LocalStorage").setString("place-string","");
			require("/helpers/LocalStorage").setString("page","0");
			require("/helpers/LocalStorage").setString("type-string","");
			require("/helpers/LocalStorage").setString("query-string","");
			search2.call(this);
		};
		
		
		var feature_view = Ti.UI.createView({
			top:'50%',
			width : '90%',
			height : 320
		});
		xview.add(feature_view);

		add_spinner(feature_view);
		
		var ajax = require("/helpers/ajax");
		ajax.getdata({
			url : require("/etc/config").api+"?action=get-featured&lang="+L("lang"),
			index : 2,
			err : function(e) {
//				Ti.API.debug(e);
			},
			fn : function(e) {
//				Ti.API.debug(e.data.items);
				require("/helpers/LocalStorage").setObject("featured-items",{ items : e.data.items});
				require("/helpers/LocalStorage").setString("help",e.data.help);
				feature_view.fireEvent("done-spinning");
				addFeaturedArticles.call(this,feature_view,perform_pre_determined_search,ximg_left,ximg_right);
			}
		});



		// var featured_items = [{ 
				// img : "featured-maps.jpg", 
				// txt : "Maps and Plans",
				// query : '&qf=DATA_PROVIDER:"Cat%C3%A1logo+Colectivo+de+la+Red+de+Bibliotecas+de+los+Archivos+Estatales"|&qf=DATA_PROVIDER:"Biblioteca+Virtual+del+Patrimonio+Bibliogr%C3%A1fico"|&qf=TYPE:IMAGE|&qf=DATA_PROVIDER:"Biblioteca+Virtual+del+Ministerio+de+Defensa"'
			// }, { 
				// img : "featured-art.jpg", txt : "Treasures of Art"},{ img : "featured-past.jpg", txt: "Treasures of the Past"},{ img :"featured-nature.jpg", txt : "Treasures of Nature"}]
// 
// 
		// require("/helpers/LocalStorage").setObject("featured-items",{ items : featured_items});		
// 
		// addFeaturedArticles.call(this,feature_view,perform_pre_determined_search,ximg_left,ximg_right);
		
		var srchval = search.value;
		//alert(srchval);
		xsearch.value = srchval;
		
		// xsearch.addEventListener("click", function() {
			// x.close();
			// lock_displaySearchForce = false;
			// require("/helpers/LocalStorage").setString("search-string",xsearch.value);
			// require("/helpers/LocalStorage").setString("yr-string","");
			// require("/helpers/LocalStorage").setString("place-string","");
			// require("/helpers/LocalStorage").setString("type-string","");
			// search2.call(this);
		// });
		xsearch.addEventListener("return", perform_search);
//		ximg1.addEventListener("click", perform_search);
		
//		x.addEventListener('click', close_displaySearchForce);
		
		x.open();

		if (require("/helpers/LocalStorage").getString("search-message") != "") {
			require("/ui/common/growl/fn").growl(require("/helpers/LocalStorage").getString("search-message"),mainviewR_close);
		}
		
		
		
	};

	
	
	var addFeaturedArticles = function(feature_view,perform_pre_determined_search,ximg_left,ximg_right) {
		var search_views = [];
		var featured_items_object = require("/helpers/LocalStorage").getObject("featured-items");
		if (!featured_items_object || featured_items_object == null) featured_items_object = {items:[]};
		var featured_items = featured_items_object.items;

		
		var num_items = featured_items.length;
		var search_square_x3 = null;
		
		for (var i=0; i < num_items; i++) {

			if (search_square_x3 != null && (i%3) == 0) {
				search_views.push(search_square_x3);
				search_square_x3 = null;
			}
			if (search_square_x3 == null) {
				search_square_x3 = Ti.UI.createView({
					width:'90%',
//					height:300,
					layout : 'horizontal'
				});
			} 
			var search_square = Ti.UI.createView({
				width:'30%',
//				height:280,
				right : 5,
				left : 5
			});
			var ximg2 = Ti.UI.createImageView({
				xindex : i+1,
				image:"http://europeanaapp.glimworm.com/europeana/featured_items/"+featured_items[i].img
			});
			search_square.add(ximg2);
			
			var square_underlay = Ti.UI.createView({
				bottom : 0, height : 50, backgroundColor : "#333", opacity : 0.75,
				width : Ti.UI.FILL
			});
			
			var square_text = Ti.UI.createLabel({
				text : featured_items[i].txt,
				color : css.VERYLIGHTCOLOUR,
				xindex : i+1,
				bottom : 0, height : 50
			});
			search_square.add(square_underlay);
			search_square.add(square_text);
			ximg2.addEventListener('singletap',perform_pre_determined_search);
//			square_text.addEventListener('click',perform_pre_determined_search);
			search_square_x3.add(search_square);
		}
		if (search_square_x3 != null) {
			search_views.push(search_square_x3);
		}
		

		var normal_searches_view = Ti.UI.createScrollableView({
			views : search_views,
			pagingControlColor : "#000000",
			backgroundColor : "#000000",
			pagingControlHeight : 20,
			top:0,
			showPagingControl:true,
			height : 320
		});

		
		feature_view.add(normal_searches_view);


		var show_correct_navigation_arrows = function() {
			if (normal_searches_view.currentPage > 0) {
				ximg_left.visible = true;
			} else {
				ximg_left.visible = false;
			}
			if (normal_searches_view.currentPage < (normal_searches_view.views.length-1)) {
				ximg_right.visible = true;
			} else {
				ximg_right.visible = false;
			}
		};
		var hide_correct_navigation_arrows = function() {
			ximg_right.visible = false;
			ximg_left.visible = false;
		};
		show_correct_navigation_arrows();
		normal_searches_view.addEventListener('scrollend',show_correct_navigation_arrows);
		normal_searches_view.addEventListener('scroll',hide_correct_navigation_arrows);
		
		navigation_arrow_right = function() {
			ximg_right.visible = false;
			normal_searches_view.scrollToView(normal_searches_view.currentPage+1);
		};
		ximg_right.addEventListener('click',navigation_arrow_right);
		navigation_arrow_left = function() {
			ximg_left.visible = false;
			normal_searches_view.scrollToView(normal_searches_view.currentPage-1);
		};
		ximg_left.addEventListener('click',navigation_arrow_left);		
	};
//	self.addEventListener('click', displayhelp);
	Titanium.App.addEventListener("display-search-force",displaySearchForce);
	
	
	var workingView = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		top : 0,
		left : 0,
		backgroundColor : "transparent"
	});
	
	if (Ti.Platform.osname === 'android') {
		workingView.add(Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			top : 0,
			left : 0,
			opacity : 0.6,
			backgroundColor : "#333333"
		}));
	}

	// workingView.add(Ti.UI.createLabel({
		// text : "Working",
		// color : "#ffffff"
	// }));
	var style;
	if (Ti.Platform.name === 'iPhone OS'){
	  style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG;
	}
	else {
	  style = Ti.UI.ActivityIndicatorStyle.BIG;
	}
	var activityIndicator = Ti.UI.createActivityIndicator({
	  color: '#ffffff',
	  font: {fontFamily:'Helvetica Neue', fontSize:26, fontWeight:'bold'},
	  message: '',
	  style:style,
	  height:Ti.UI.SIZE,
	  width:Ti.UI.SIZE
	});
	workingView.add(activityIndicator);
	activityIndicator.show();
	
	self.add(workingView);
	workingView.hide();
	
    search.blur();
	
	return self;
	
}

module.exports = fn;
