var globals = require('/ui/common/globals');
var css = require('/ui/common/css');

function fn(identifier,cnt,typ) {
	
	
	require("/helpers/flurry").log("display_item",{identifier : identifier },identifier);
	var view4 = {};

	var LL = function(txt) {
		try {
			var rv = L(txt.replace(" ","_"));
			if (rv == "") return txt;
			return rv;
		} catch (E) {
			return txt;			
		}
	};
	
	function isfavourite (ident) {
	    var items = require("/helpers/LocalStorage").getObject("personal");
	    if (!items || items == null) return false;
	    for (var i=0; i <items.length; i++) {
	        if (ident == items[i].identifier) return true;
	    }
	    return false;
	}

	var self = Titanium.UI.createWindow({
    	navBarHidden: true,
    	backgroundColor:css.DARKBACKGROUND
	});
	var pb = Ti.UI.createProgressBar({
		min : 0,
		max : 1,
		width:'80%', height : Ti.UI.SIZE,
		width : 200,
		height : 20,
		top : 100,
		color : "#dddddd",
		borderColor : "#ffffff",
		borderWidth : 1,
		value : 0
	});
	// self.add(pb);
	// pb.show();

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
	self.add(activityIndicator);
	activityIndicator.show();
	
	var dbg = function(v) {
//		pb.value = v;
	};
	var dbg2 = function(v) {
//		Ti.API.debug("jcjc : playwindow : "+v);
	};
	
	
	var table;
	var lbl122 = "";
	var searchtitle = "";
	var wikipediasearch = "";
	var googlesearch = "";
	var Currenttitle = "";
	var Currenttitle1 = "";
	var Currenttitle2 = "";
	var ExtraButtons = [];
	var ExtraMeta = [];
	var docTitle = "";
	var twitter_image = "";
	var twitter_link = "";
	var twitter_text = "";
	var facebook_appid = "";
	var pintrest_image = "";

	var button2 = "";
	var button2_link = "";
	var button3 = "";
	var button3_link = "";
	
	var LL = function(txt) {
		return L(txt.replace(" ","_"));
	};


	/* TOP BAR */
	var status = Titanium.UI.createLabel({
		top:0, left:100,
		color : "#ffffff",
		text : 'status',
		height : 60,
		font : {
			fontSize : 24
		}
	});
	var b1 = Titanium.UI.createLabel({
		top:0, left:0,
		text : "g",
		//borderWidth : 2,
		//borderColor : "#00ff00",
		color : "#ffffff",
		width : 60,
		height : 60,
//		image : "/images/glyphicons_212_down_arrow.png",
		font : {
			fontFamily : (globals.isAndroid()) ? "europeana": "icomoon",
			fontSize : 48
		}
	});
	var winclose = function(e) {
		self.close();
	};
	b1.addEventListener("click", winclose);
	
	var topbar = Ti.UI.createView({
		layout : 'horizontal',
		top:0,right:0,left:0,height:50,
		backgroundColor : css.DARKBACKGROUND
	});

//	topbar.add(b1);
//	self.add(topbar);
	/* END TOP BAR */



	var b_like = Titanium.UI.createButton({
		image : "/images/glyphicons_012_heart.png",
		left:20
	});
	var isfav = function(identifier) {
		var personal = require("/helpers/LocalStorage").getObject("personal");
		if (!personal || personal == null) return false;
		for (var i=0; i < personal.length; i++) {
			if (personal[i].identifier == identifier) {
				return true;
			}
			if (personal[i].id == identifier) {
				return true;
			}
		}
		return false;
	};
	var removefav = function(identifier) {
		var personal = require("/helpers/LocalStorage").getObject("personal");
		if (!personal || personal == null) return;
		for (var i=personal.length; i > 0; i--) {
			var j= (i-1);
			if (personal[j].identifier == identifier || personal[j].id == identifier) {
				personal.splice(j,1);
			}
		}
		require("/helpers/LocalStorage").setObject("personal",personal);
	};

	var like = function() {
		if (isfav(identifier) == false) {
			var newitem = require("/helpers/LocalStorage").getObject("search")[cnt];
			var personal = require("/helpers/LocalStorage").getObject("personal");
			lbl122.children[0].image = '/images/buttons/menu-favourite-active.png';
			if (!personal || personal == null) personal = [];
			personal.push(newitem);
			require("/helpers/LocalStorage").setObject("personal",personal);
			require("/helpers/flurry").log("like",{identifier : identifier },identifier);
			
		} else {
			lbl122.children[0].image = '/images/buttons/menu-favourite.png';
			removefav(identifier);		
			require("/helpers/flurry").log("unlike",{identifier : identifier },identifier);
		}
	};
	b_like.addEventListener("click",like);
	
	dbg(0.1);
	
	function makebar(items,closebuts,txt) {
		var bar = Titanium.UI.createView({
			top:0,right:0,left:0,height:40,
			width : Ti.UI.FILL,
			backgroundColor : css.DARKBACKGROUND,
		});
		var barleft = Ti.UI.createView({
			top:0,left:0,width:Ti.UI.SIZE,
			layout : 'horizontal'
		});
		var barright = Ti.UI.createView({
			top:0,right:0,width:Ti.UI.SIZE,
			layout : 'horizontal'
		});
		if (txt) {
			var barcenter = Ti.UI.createLabel({
				text : txt,
				width : Ti.UI.SIZE,
				color : "#ffffff"
			});
			bar.add(barcenter);
		}
		
		for (var j=0; j < items.length; j++) {
//			items[j].borderWidth = 1;
//			items[j].borderColor = '#00cc00';
			barleft.add(items[j]);
		}
		for (var j=0; j < closebuts.length; j++) {
//			closebuts[j].borderWidth = 1;
//			closebuts[j].borderColor = '#0000cc';
			barright.add(closebuts[j]);
		}
		bar.add(barleft);
		bar.add(barright);
		
		return bar;
	}
	
	var currentlink = "";
	var addcomment = function(e) {
		require("/helpers/flurry").log("add_comment_openwindow",{identifier : identifier },identifier);

		var v = Ti.UI.createWindow({
		});
		v.add(Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			backgroundColor : css.DARKBACKGROUND,
			opacity : 0.5
		}));
		var v1 = Ti.UI.createView({
			width : '80%',
			height : '80%'
		});
		var v2 = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			backgroundColor : css.POPUPBACKGROUND
		});
		v2.add(Ti.UI.createLabel({
			text : L("post_a_comment"),
			top:15,left:66,height:50,width:300,
			font : {
				fontSize : 22,
				fontFamily : "arial"
			},
			color : "#222"
		}));
		
		var srch = Ti.UI.createTextArea({
			top:60,left:66,height:150,right:66,
			hintText : L("What_do_you_want_to_say"),
			borderRadius : 10,
			font : {
				fontSize : 22,
				fontFamily : "arial"
			},
			backgroundColor : css.VERYLIGHTCOLOUR,color:css.LIGHTCOLOUR,borderColor:'#ccc',borderWidth:1
		});
		v2.add(srch);
		var addlink_btn = Ti.UI.createLabel({
			top:220,right:66,height:50,width:150,
			font : {
				fontSize : 22,
				fontFamily : "arial"
			},
			color : css.VERYLIGHTCOLOUR,
			borderRadius : 10,
			textAlign : 'center',
			text : L('Send'),
			backgroundColor : '#5184CC'
		});
		v2.add(addlink_btn);
		var closecomentwindow = function() {
			v.close();
		};
		
		var addlinkfn = function() {
			var _data = {
				action : "json-addlink",
				a : identifier,
				b : "",
				type : "comment",
				comment : srch.value,
				lang : L("lang")
			};

			ajax.getdata({
				url : require("/etc/config").api,
				data : _data,
				fn : function(e1) {
					Titanium.API.info(e1);
					require("/ui/common/growl/fn").growl("post added",closecomentwindow);
					table.fireEvent("updateLinks",{links:e1.links});
//					showfront();
				},
				err : function(e1) {
					Titanium.API.info(e1);
					alert("There was an error adding the link");
				}
			});
			require("/helpers/flurry").log("add_comment_added",{identifier : identifier },identifier);
			
		};
		addlink_btn.addEventListener('click',addlinkfn);

		var bgc = Ti.UI.createImageView({
			image:'/images/close1.png'
		});
		bgc.addEventListener('click',function(e){
			v.close();
		});

		var bar = makebar([],[bgc],L("add_comment_window_head"));
		
		var vb = Ti.UI.createView({
			top:42,
			left:0,
			width : Ti.UI.FILL,
			height : Ti.UI.FILL
			// borderColor : "#ff0000",
			// borderWidth : 2
		});
		
		v.add(v1);
		v1.add(bar);
		v1.add(vb);
		vb.add(v2);
		v.open();
		srch.focus();


	};
//alert("h");	
	var currentlink = "";
	var POPWEBSMALL = function(URI) {
		
		var URL = URI;
		
		var vminus1 = Ti.UI.createWindow({
			width : '100%',
			height : '100%',
			backgroundColor: css.DARKBACKGROUND,
			opacity: 0.7
		});
		
		var v = Ti.UI.createWindow({
			width : '90%',
			height : '90%'
		});
		var v = Ti.UI.createWindow({
		});
		var v0 = Ti.UI.createView({
			width : '90%',
			height : '90%'
		});
		
		var v1 = Ti.UI.createView({
		});
		var search = Ti.UI.createTextField({
			width : 450,
			height: 30,
			autocapitalization : 0,
			autocorrect : false,
			backgroundColor : css.VERYLIGHTCOLOUR
		});
		var bgo = Ti.UI.createButton({
			image : 'images/glyphicons_212_right_go_arrow.png'
		});
		var bgo_fn = function(e){
			if (search.value && search.value != "") {
				/*if (search.value.toLowerCase().indexOf("www") != 0){
					search.value = "http://www.google.com/search?as_q="+search.value
				}*/
				if (search.value.toLowerCase().indexOf("http") != 0) {
					search.value = "http://"+search.value;
				}
				showfront();
				web.setUrl(search.value);
			}
		};
		bgo.addEventListener('click',bgo_fn);
		search.addEventListener('enter',bgo_fn);
		search.addEventListener('return',bgo_fn);

		var bgf = Ti.UI.createImageView({
			image : 'images/glyphicons_212_right_arrow.png'
		});
		bgf.addEventListener('click',function(e){
			showfront();
			web.goForward();
		});

		var bgb = Ti.UI.createImageView({
			image : 'images/glyphicons_212_left_arrow.png'
		});
		bgb.addEventListener('click',function(e){
			showfront();
			web.goBack();
		});
		var bgc = Ti.UI.createImageView({
			image:'/images/close1.png'
		});
		bgc.addEventListener('click',function(e){
			v.close();
			vminus1.close();
		});
		
		
		
		
		var bar = makebar([bgb,bgf],[bgc],"");
		
		var vb = Ti.UI.createView({
			top:42,
			left:0,
			width : Ti.UI.FILL,
			height : Ti.UI.FILL
		});
		var web = Ti.UI.createWebView({
			top:0,
			left:0,
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			url : URL
		});
		
		
		v1.add(bar);
		v1.add(vb);
		vb.add(web);
		v0.add(v1);
		v.add(v0);
		vminus1.open();
		v.open();
		
		
	};
	var v22 = {};
	
	var toggleInfoSwipe = function(e) {
		if (e.direction == "right") {
			toggleInfo.call(this,e);	
		}
	};
	var toggleInfo = function(e) {
//		Ti.API.info("toggleInfo");
//		Ti.API.info("v22.x_opened"+v22.x_opened);
		if (v22.x_opened == 1) {
			v22.x_opened = 2;
			view4.right = 0;
			v22.animate({right:Math.floor(Number(v22.x_width) * -1),duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){
				Ti.API.info("toggleInfo End");
				v22.x_opened = 0;
			});
		} else if (v22.x_opened == 0) {
			v22.x_opened = 2;
			if (v22.x_right == 0) view4.right = -200;	// this is only if it is full screen 
			v22.animate({right:Math.floor(Number(v22.x_right)),duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){
				Ti.API.info("toggleInfo End");
				v22.x_opened = 1;
			});
		}
	};
	
	dbg(0.2);
	
	var addlink = function(e) {

		require("/helpers/flurry").log("add_link_openwindow",{identifier : identifier },identifier);


		if (!searchtitle || searchtitle == null) searchtitle = "";
		var searchtitlea = searchtitle.replace(" ","_");
		var searchtitleb = searchtitlea.replace(" ","_");
		var searchtitlec = searchtitleb.replace(" ","_");
		var searchtitled = searchtitlec.replace(" ","_");
		var searchtitlee = searchtitled.replace(" ","_");
		var searchtitlef = searchtitlee.replace(" ","_");
		var searchtitleg = searchtitlef.replace(" ","_");
		var searchtitleh = searchtitleg.replace(" ","_");
		var searchtitlei = searchtitleh.replace(" ","_");
		var searchtitlej = searchtitlei.replace(" ","_");
		var searchtitlek = searchtitlej.replace(" ","_");
		var searchtitlel = searchtitlek.replace(" ","_");
		var searchtitlex = searchtitlel.replace(" ","_");
		var searchtitlez = searchtitlex.replace(" ","_");
		var fullthingy = "http://en.wikipedia.org/wiki/"+searchtitlez;
		
		
		var fullthingy = "http://nl.wikipedia.org/wiki/Special:Search?search="+Ti.Network.encodeURIComponent(searchtitle)+"&go=Go";
		var fullthingy = wikipediasearch;
		var fullthingy = googlesearch;
		
		//alert(searchtitlez);
//alert("i");		
		var URL = e.url;
		if (!URL || URL == "") URL = fullthingy;
		
		
		
		var vminus1 = Ti.UI.createWindow({
			width : '100%',
			height : '100%',
			backgroundColor: css.DARKBACKGROUND,
			opacity: 0.7
		});
		
		var v = Ti.UI.createWindow({
			width : '90%',
			height : '90%'
		});
		var v = Ti.UI.createWindow({
		});
		var v0 = Ti.UI.createView({
			width : '90%',
			height : '90%'
		});
		
		var v1 = Ti.UI.createView({
		});
		var search = Ti.UI.createTextField({
			width : '30%',
			height: 36,
			left : 10,
			autocapitalization : 0,
			autocorrect : false,
			backgroundColor : css.VERYLIGHTCOLOUR
		});
		var bgo = Ti.UI.createImageView({
			left : 10,
			image : 'images/glyphicons_212_right_arrow.png'
		});
		var bgo_fn = function(e){
			if (search.value && search.value != "") {
				/*if (search.value.toLowerCase().indexOf("www") != 0){
					search.value = "http://www.google.com/search?as_q="+search.value
				}*/
				if (search.value.toLowerCase().indexOf("http") != 0) {
					search.value = "http://"+search.value;
				}
				showfront();
				web.setUrl(search.value);
			}
		};
		bgo.addEventListener('click',bgo_fn);
		search.addEventListener('enter',bgo_fn);
		search.addEventListener('return',bgo_fn);

		var bgf = Ti.UI.createImageView({
			image : 'images/glyphicons_212_right_arrow.png'
		});
		bgf.addEventListener('click',function(e){
			showfront();
			web.goForward();
		});

		var bgb = Ti.UI.createImageView({
			image : 'images/glyphicons_212_left_arrow.png'
		});
		bgb.addEventListener('click',function(e){
			showfront();
			web.goBack();
		});
		/*var bgl = Ti.UI.createImageView({
			image : 'images/glyphicons_050_link.png',
			top:15,left:40
		});*/
		var bgemp = Ti.UI.createImageView({
			image : '',
			width:2
		});
		
		
		
		
		
		var bgyu = Ti.UI.createImageView({
			image : button2 	// 'images/glyphicons_382_youtube1.png'
		});
		
		var bgfli = Ti.UI.createImageView({
			image : button3		//	'images/glyphicons_395_flickr.png'
		});
		
		var bgpin = Ti.UI.createImageView({
			image : 'images/v2/glyphicons_360_pinterest1.png'
		});
		
		var bggoo = Ti.UI.createImageView({
			image : 'images/v2/glyphicons_362_google1.png'
		});
		
		/* the search part */
		var lnk = (search.value);
		var v2 = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			backgroundColor : css.VERYLIGHTCOLOUR,
			layout : 'vertical'
		});
		
		v2.add(Ti.UI.createLabel({
			text : LL('Almost there'),
			top:10,height:Ti.UI.SIZE,width:'80%',
			font : {
				fontSize : 22,
				fontFamily : "arial"
			},
			color : "#222"
		}));
		//////
		var vals = ['What','Where','When','Who','General link'];
		var valarray = [];
		var TYP = "";		
		var selectlabel2 = function(xval) {
			TYP = xval;
			for (var i=0; i < valarray.length; i++) {
				if (valarray[i].xval == xval) {
					valarray[i].color = css.VERYLIGHTCOLOUR;
					valarray[i].backgroundColor = "#5184CC";
					
				} else {
					valarray[i].color = css.VERYLIGHTCOLOUR;
					valarray[i].backgroundColor = "#eee";
				}
			}
		};
		var selectlabel = function(e) {
			selectlabel2(e.source.xval);
			
		};
		for (var i=0; i < vals.length; i++) {
			var lbl = Ti.UI.createLabel({
				top:0,left:'2%',height:50, width : '17%',
				textAlign:'center',
				color : "#222",
//				borderRadius : 10,
				borderColor : "#ccc",
				backgroundColor : "#eee",
				borderWidth : 1,
				font : {
					fontSize : 22,
					fontFamily : "arial"
				},
				text : " "+LL(vals[i])+" ",
				xi : i,
				xval : vals[i]
			});
			lbl.addEventListener('click',selectlabel);
			valarray.push(lbl);
		}
		
		var sel = Ti.UI.createView({
			top:10,height:100,width:'80%',
			layout : 'horizontal'
		});
		
		for (var i=0; i < valarray.length; i++) {
			sel.add(valarray[i]);
		}
		v2.add(sel);
				
		
		//////
		
		v2.add(Ti.UI.createLabel({
			text : LL("Final step"),
			top:10,height:Ti.UI.SIZE,width:'80%',
			font : {
				fontSize : 20,
				fontFamily : "arial"
			},
			color : "#222"
		}));
		
		var srch = Ti.UI.createTextField({
			top:10,left:'10%',height : 50,width:'60%',
			font : {
				fontSize : 24,
				fontFamily : "arial"
			},
			paddingLeft : 20,
			backgroundColor : css.VERYLIGHTCOLOUR,
			color:css.LIGHTCOLOUR,
			borderColor : "#ccc",
			borderWidth : 1
		});
		v2.add(srch);

		var addlink_btn = Ti.UI.createLabel({
			top:-50,right:'10%',height:50,width:'20%',
			font : {
				fontSize : 26,
				fontFamily : "arial"
			},
			borderRadius : 0,
			color : css.VERYLIGHTCOLOUR,
			text : '  '+LL('Add Link')+' ',
			backgroundColor : '#5184CC'
		});
		v2.add(addlink_btn);
		

//alert("j");		
		bggoo.addEventListener('click',function(e){
			//alert("a");
			search.value = googlesearch;
			//"http://www.google.nl";
			web.setUrl(search.value);
		});
		bgyu.addEventListener('click',function(e){
			//alert("a");
			search.value = button2_link;	//"http://www.youtube.com/?nomobile=1";
			web.setUrl(search.value);
		});
		bgfli.addEventListener('click',function(e){
			//alert("a");
			search.value = button3_link;	//"http://www.flickr.com";
			web.setUrl(search.value);
		});
		bgpin.addEventListener('click',function(e){
			//alert("a");
			search.value = "http://www.pinterest.com";
			web.setUrl(search.value);
		});
		

		var closelinkwindow = function() {
			v.close();
			vminus1.close();
		};
		var addlinkfn = function() {
			if (TYP == null || TYP == "" || search.value == "") {
				alert(LL("add link error"));
				return;
			}
			var _data = {
				action : "json-addlink",
				a : identifier,
				b : search.value,
				type : TYP,
				comment : srch.value,
				lang : L("lang")
			};
			
			ajax.getdata({
				url : require("/etc/config").api,
				data : _data,
				fn : function(e1) {
					Titanium.API.info(e1);
					table.fireEvent("updateLinks",{links:e1.links});
					require("/ui/common/growl/fn").growl("link added",closelinkwindow);
					showfront();
				},
				err : function(e1) {
					Titanium.API.info(e1);
					alert("There was an error adding the link");
				}
			});
			require("/helpers/flurry").log("add_link_added",{identifier : identifier }, identifier);
			
			
		};
		addlink_btn.addEventListener('click',addlinkfn);
		
		var current = "v1";
		var showfront = function() {
			if (current == "v2") {
				vb.scrollToView(0);
				// if (Ti.Platform.osname === 'android') {
					// vb.animate({view:web});
				// } else {
					// vb.animate({view:web,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
				// } 
				current = "v1";
			}
		};

		var bgc = Ti.UI.createImageView({
			image:'/images/close1.png'
		});
		bgc.addEventListener('click',function(e){
			v.close();
			vminus1.close();
		});
		
		var bgemp11 = Ti.UI.createButton({
			image : '',
			width:5
		});
		var bgemp1 = Ti.UI.createButton({
			image : '',
			width:12
		});
		var bgemp2 = Ti.UI.createButton({
			image : '',
			width:7
		});
		var bgemp3 = Ti.UI.createButton({
			image : '',
			width:7
		});
		var bgemp4 = Ti.UI.createButton({
			image : '',
			width:30
		});

		var spacer = Ti.UI.createButton({
			image : '',
			width:20
		});
		
		// var bar = Titanium.UI.iOS.createToolbar({
			// top:0,right:0,left:0,height:Ti.UI.SIZE,
// //			items : [bgb,bgf,search,bgo,bgemp11,bgyu,bgemp1,bgfli,bgemp2,bggoo,bgemp3,bgpin,bgemp4,bgc],
			// items : [bgb,bgf,search,bgo,bgemp11,bggoo,bgemp1,bgyu,bgemp2,bgfli,bgemp3,bgpin,bgemp4,bgc],
			// barColor : css.DARKBACKGROUND,
			// borderTop:true,
		    // borderBottom:false
// 		    
		// });
//		var bar = makebar([bgb,bgf,search,bgo,bgemp11,bggoo,bgemp1,bgyu,bgemp2,bgfli,bgemp3,bgpin,bgemp4],[bgc]);

		var connectButClass = require('/ui/common/connect/button');
		var webover = new connectButClass();
		
		webover.addEventListener('click',function(e){
			if (current == "v1") {
				vb.scrollToView(1);
				// if (Ti.Platform.osname === 'android') {
					// vb.animate({view:v2});
				// } else {
					// vb.animate({view:v2,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
				// }
				docTitle = web.evalJS('document.title');
				srch.value = docTitle;
				current = "v2";
			} else {
				vb.scrollToView(0);
				// if (Ti.Platform.osname === 'android') {
					// vb.animate({view:web});
				// } else {
					// vb.animate({view:web,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
				// }
				current = "v1";
			}
		});

		if (e.connect === false) {
			var bar = makebar([],[bgc],e.title);
		} else {
			// bgb,bgf	- back / forward
			// 
			var bar = makebar([bgb,bgf,search,bgo,bggoo,bgyu,bgfli,bgpin],[webover,bgc]);
		}
		
		
		var web = Ti.UI.createWebView({
			top:0,
			left:0,
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			url : URL
		});
		var vb = Ti.UI.createScrollableView({
			top:42,
			left:0,
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			scrollingEnabled : false,
			views : [web,v2]
		});
		
		
		
		web.addEventListener('load',function(e){
			search.value = e.url;
		});
		
		v1.add(bar);
		v1.add(vb);
//		vb.add(web);
		v0.add(v1);
//		v0.add(webover);
		v.add(v0);
		vminus1.open();
		v.open();
		
		
	};
	var b3 = Titanium.UI.createButton({
		image : "/images/glyphicons_050_link.png"
	});
	b3.addEventListener("click",addlink);
	var b3a = Titanium.UI.createButton({
		image : "/images/glyphicons_151_edit.png"
	});
	b3a.addEventListener("click",addcomment);

	var b31 = Titanium.UI.createButton({
		image : "/images/glyphicons_377_linked_in.png"
	});
	
	// var botbar = Titanium.UI.iOS.createToolbar({
		// bottom:0,right:0,height:40,
		// items : [],
		// barColor : css.DARKBACKGROUND,
		// borderTop:true,
	    // borderBottom:false
	// })	
	//self.add(botbar);

	var path = null;
	var endlabel = "";
	
	var ajax = require("/helpers/ajax");
	var _data = {};
	_data.identifier = identifier;
	_data.action = "json-get";
	
	
	dbg(0.3);
	
	
//alert("l");	
	Ti.API.info(require("/etc/config").api+"?action=json-get&lang="+L("lang")+"&identifier="+identifier);
	
	ajax.getdata({
		url : require("/etc/config").api+"?action=json-get&lang="+L("lang")+"&identifier="+identifier,
		err : function(e) {
			setTimeout(winclose,1000);
		},
		fn : function(e) {
			try {
				dbg(0.7);
//				Ti.API.debug("BBBBBB GOT DATA");
				
//				Ti.API.debug(e);
				searchtitle = e.data[0].ccsearchterm;
				twitter_image = e.data[0].twitter_image;
				twitter_link = e.data[0].twitter_link;
				twitter_text = e.data[0].twitter_text;
				pintrest_image = e.data[0].img;
				wikipediasearch = e.data[0].ccwikipediasearch;
				googlesearch = e.data[0].ccgooglesearch;
				facebook_appid = e.data[0].facebook_appid;
				button2 = e.data[0].button2;
				button2_link = e.data[0].button2_link;
				button3 = e.data[0].button3;
				button3_link = e.data[0].button3_link;
				
//				Ti.API.debug(e);
				var img = Titanium.UI.createImageView({
					left:0,top:40,height:200,right:0,
					backgroundColor:css.DARKBACKGROUND,
					image : e.data[0].img	//.thumbsrc
				});
				
				var txt = Titanium.UI.createLabel({
					top:20,
					height : 'auto',
					font : {
						fontSize : 16,
						fontFamily : "arial"
					},
					text : e.data[0].title+"\n"+e.data[0].description,	//.description
					enableZoomControls :true
				});		
	//			botbar.title = e.data.provider;
				/* IMAGE */
				var view = Titanium.UI.createView({
	//				top:44,left:0,bottom:0,width:Ti.UI.Fill
					top:0,left:0,bottom:0,width:Ti.UI.Fill
				});
				/* INFO */
				var view22 = Titanium.UI.createView({
					right:-420,
					width: (require("/etc/config").format == "phone") ? 320 : 420, 
					height: (require("/etc/config").format == 'phone') ? Ti.UI.FILL : 500,
//					borderColor:"#cc0000",borderRadius:5,borderWidth:1,
					zIndex : 98,
					x_opened : 0,
					x_width : (require("/etc/config").format == 'phone') ? 320 : 420,
					x_right : (require("/etc/config").format == 'phone') ? 0 : 80
				});
				v22 = view22;
				if (require("/etc/config").format == "phone") {
					v22.addEventListener("swipe", toggleInfoSwipe);
				}
				
				var view2 = Titanium.UI.createView({
					top:0,left:0,bottom:0,right:0,height:Ti.UI.FILL
				});
				/* LIKE, etc, */
				view4 = Titanium.UI.createView({
					width:80,height:500,right:0,backgroundColor:css.DARKBACKGROUND,
					zIndex : 99,
					x_opened : 1,
					x_width : 80,
					x_right : 0
				});
				
				table = Ti.UI.createTableView({
					backgroundColor : css.DARKBACKGROUND,
					separatorColor : css.DARKBACKGROUND
				});
				view2.add(table);
				
				table.addEventListener('click', function(e) {
					if (e.row.xurl && e.row.xurl != "") {
						addlink({
							url : e.row.xurl
						});
					}
					
					if (e.row.xsurl && e.row.xsurl != "") {
						POPWEBSMALL(e.row.xsurl);
					}
				});
							
				var vals = ['what','where','when','who','general link','comment'];
	
				var updateLinks = function(links) {
					var vals = ['what','where','when','who','general link','comment'];
					var rows = [];
					var indent1 = 27;
					var indent2 = 130;
					
					var secv1 = Ti.UI.createView({
							height : 30,
							backgroundColor : css.LIGHTCOLOUR
					});
					secv1.add(Ti.UI.createLabel({
						height : Ti.UI.SIZE,
						textAlign: "left",
						width:(require("/etc/config").format === 'phone') ? 285 : 425,
						left:5,
						top:7,
						font : {
							fontSize : 16,
							fontFamily : "arial"
						},
						color : css.VERYLIGHTCOLOUR,
						text : 'ABOUT'
					}));
					var sec1 = Ti.UI.createTableViewSection({
	//					headerView : secv1
					});
					var row1 = Ti.UI.createTableViewRow({
						height:Ti.UI.SIZE,
						selectionStyle : 0,
						layout:'vertical'
					});
					var rowv1 = Ti.UI.createView({
						backgroundColor : css.DARKBACKGROUND,
						height : Ti.UI.SIZE,
						top:10, bottom:10,
						width:(require("/etc/config").format == 'phone') ? 285 : 425,
						layout: 'vertical'
					});
					var lblrow1=Ti.UI.createLabel({
						text:Currenttitle,
						color:css.VERYLIGHTCOLOUR,
						font : {
							fontSize : 24,
							fontFamily : "arial",
							fontStyle : 'bold'
						},
						height:Ti.UI.SIZE,
						left:indent1,right:10,top:0
					});
					var mls = require("/helpers/LocalStorage").getString("multilanguage_search");
					if (!mls || mls == "") mls = "n";
					var GT = (mls == "y");
					GT = true;
					
					var lblrow2=Ti.UI.createLabel({
						text:Currenttitle1,
						color:css.VERYLIGHTCOLOUR,
						font : {
							fontSize : 14,
							fontFamily : "arial",
							fontWeight: "normal"
						},
						height:Ti.UI.SIZE,
						left:indent1,right:15,top:5
					});
					
					var lblrow3=Ti.UI.createLabel({
						text:Currenttitle2,
						color:css.VERYLIGHTCOLOUR,
						font : {
							fontSize : 14,
							fontFamily : "arial"
						},
						height:Ti.UI.SIZE,
						left:indent1,right:15,top:5
					});
					rowv1.add(lblrow1);
					if (GT == true) {
						var GTview = Ti.UI.createImageView({
							image : "/images/v2/GT.png",
							left:indent1,top:5
						});
						GTview.addEventListener('click',function(e){
							POPWEBSMALL("http://translate.google.com");
						});
						rowv1.add(GTview);
						
					}
					rowv1.add(lblrow2);
					rowv1.add(lblrow3);
					row1.add(rowv1);
					sec1.add(row1);
					rows.push(sec1);
					var BW = 0;
					for (var i=0; i<ExtraMeta.length; i++){
						var button = ExtraMeta[i];
						var row1 = Ti.UI.createTableViewRow({
							height:Ti.UI.SIZE,
							selectionStyle : 0,
							borderWidth : BW,
							layout:'vertical'
						});
						var rowv1 = Ti.UI.createView({
							backgroundColor : css.DARKBACKGROUND,
							height : Ti.UI.SIZE,
							borderWidth : BW,
							top:4, bottom:4,
							width:(require("/etc/config").format == 'phone') ? 285 : 425
	//						layout: 'vertical'
						});
						var lblrow5wrap = Ti.UI.createView({
							height : Ti.UI.SIZE,
							layout : 'horizontal',
							left:indent1,top:0, width : 110
						});
						var lblrow5 = Ti.UI.createLabel({
							text:button.label,
							height : Ti.UI.SIZE,
							color:css.VERYLIGHTCOLOUR,
							borderWidth : BW,
							font : {
								fontSize : 15,
								fontFamily : "arial",
								fontWeight: "bold"
							},
							width : Ti.UI.SIZE, 
							top: 0,
							left: 0
						});
						lblrow5wrap.add(lblrow5);
						var fam = "arial";
						var txt = button.value;
						var siz = 14;
						var xxlink = "";
						var connect = "n";
						if (txt.indexOf("|") > -1) {
							var txt2 = txt.split("|");
							if (txt2.length > 1) xxlink = txt2[1];						
							txt = txt2[0];
						}
						if (txt.indexOf("§") == 0) {
							txt = txt.substring(1);
							fam = (globals.isAndroid()) ? "europeana": "icomoon";
							siz = 18;
						}
						if (txt.indexOf("con:") == 0) {
							txt = txt.substring(4);
							connect = "y";
						}
						var lblrow4 = Ti.UI.createLabel({
							text: txt,
							//html:"<b>"+button.value+"</b>",
							height : Ti.UI.SIZE,
							color:css.VERYLIGHTCOLOUR,
							borderWidth : BW,
							font : {
								fontSize : siz,
								fontFamily : fam
							},
							left:indent2,top:0, 
							width:(require("/etc/config").format == 'phone') ? 150 : 270
	//						left:10,top:8
						});
						if (xxlink != "") row1.xurl = xxlink;
						rowv1.add(lblrow5wrap);
						rowv1.add(lblrow4);
						if (connect == "y") {
							var connectButClass = require('/ui/common/connect/logo');
							var connectBut = new connectButClass();
							lblrow5wrap.add(connectBut);
						}
						
						row1.add(rowv1);
						sec1.add(row1);
					}
					for (var i=0; i < ExtraButtons.length; i++) {
						var button = ExtraButtons[i];
						//button.title
						//button.url
						var row1 = Ti.UI.createTableViewRow({
							height:Ti.UI.SIZE,
							selectionStyle : 0,
							xsurl : button.url,
							layout:'vertical'
						});
						var rowv1 = Ti.UI.createView({
							backgroundColor : css.VERYLIGHTCOLOUR,
							height : Ti.UI.SIZE,
							top:10, bottom:10,
							width:(require("/etc/config").format == 'phone') ? 285 : 425,
							layout: 'vertical'
						});
						
						var lblrow14 = Ti.UI.createView({
							backgroundImage:'/images/butbg.png',
							borderRadius : 5,
							height:32,
							left:indent1,right:20,top:0
						});
						var lblrow4 = Ti.UI.createLabel({
							text:button.title,
							color:css.VERYLIGHTCOLOUR,
							font : {
								fontSize : 16,
								fontFamily : "arial"
							},
							left:10,top:8
						});
						rowv1.add(lblrow14);
						lblrow14.add(lblrow4);
	//					lblrow4.addEventListener('click',function(e){
							//alert(button.url);
	//						POPWEBSMALL(button.url);
	//					});
						row1.add(rowv1);
						sec1.add(row1);
					}
					
					// WHAT WHEN WHERE etc..
					
					for (var i=0; i < vals.length; i++) {
						var secv = Ti.UI.createView({
							height : 30,
							backgroundColor : css.LIGHTCOLOUR
						});
						secv.add(Ti.UI.createLabel({
							color : css.LIGHTCOLOUR,
							height : Ti.UI.SIZE,
							textAlign: "left",
							width:(require("/etc/config").format == 'phone') ? 285 : 425,
							left:5,
							top:7,
							font : {
								fontSize : 16,
								fontFamily : "arial"
							},
							color : css.VERYLIGHTCOLOUR,
							text : vals[i].toUpperCase()
						}));
						var sec = Ti.UI.createTableViewSection({
	//						headerView : secv
						});
						
						var seclabel = Ti.UI.createLabel({
							height : Ti.UI.SIZE,
							textAlign: "left",
							width:Ti.UI.SIZE,
							left: indent1,
							top:7,
							color:css.VERYLIGHTCOLOUR,
							borderWidth : BW,
							font : {
								fontSize : 15,
								fontFamily : "arial",
								fontWeight: "bold"
							},
							text : LL(vals[i])
						});
						
	 					var cnt = 0;
						for (var l=0; l < links.length; l++) {
							if (links[l].type == vals[i]) {
								cnt++;
								var row = Ti.UI.createTableViewRow({
									selectionStyle : 0,
									xurl : links[l].url
								});
								var rv = Ti.UI.createView({
									backgroundColor : css.DARKBACKGROUND,
									height : Ti.UI.SIZE,
									top:10, bottom:10,
									width:(require("/etc/config").format == 'phone') ? 285 : 425
								});
								row.add(rv);
								rv.add(Ti.UI.createLabel({
									color : css.VERYLIGHTCOLOUR,
									height : Ti.UI.SIZE,
									textAlign: "left",
									width:(require("/etc/config").format == 'phone') ? 285 : 425,
									left:indent2,
									font : {
										fontSize : 16,
										fontWeight: "bold",
										fontFamily : "arial"
									},
									text : (links[l].comment != "") ? links[l].comment : links[l].url								
								}));
								if (seclabel != null) {
									rv.add(seclabel);
									seclabel = null;
								}
								sec.add(row);
							}
						}
						if (cnt > 0) {
							rows.push(sec);
						}
					}
					table.setData(rows);
				};
	
				Currenttitle=e.data[0].title;
				Currenttitle1=e.data[0].description;
				Currenttitle2=e.data["creator"];
				ExtraButtons = e.data1.buts;
				ExtraMeta = e.data1.meta;
				updateLinks(e.data1.links);
				var updateLinksFn = function(e) {
					updateLinks(e.links);
				};
				table.addEventListener("updateLinks",updateLinksFn);
				
				self.add(view);
				self.add(view4);
				self.add(b1);
//				self.add(status);
//				Ti.API.debug("AAAAAA - 99");
				dbg(0.8);
				
				var addTextToImage = function(obj,text,top) {
					obj.add(Ti.UI.createLabel({
						text : ""+text+"",
						top : top,
						font : {
							fontSize : 16,
							fontWeight:'bold'
						},
						textAlign : "center",
						height:20,
						touchEnabled : false,
						width : 80,
						backgroundColor : "#000000",
						color : "#ffffff"
					}));
					
				};
				
				var lbl121_info = Ti.UI.createView({
					top : 10,
					height : Ti.UI.SIZE,
					left:0
				});

				lbl121_info.add(Ti.UI.createImageView({
					image : "/images/buttons/menu-info.png"
				}));
				
				addTextToImage(lbl121_info,LL("sidenav_info"),38);
				
				
				var lbl121 = Ti.UI.createView({
					height : Ti.UI.SIZE,
					top : 170,
					left:0
				});
				lbl121.add(Ti.UI.createImageView({
					image : "/images/buttons/menu-connect.png"
				}));
				addTextToImage(lbl121,LL("sidenav_connect"),38);

				lbl122 = Ti.UI.createView({
					height : Ti.UI.SIZE,
					top : 90,
					left:0
				});
				lbl122.add(Ti.UI.createImageView({
					image : "/images/buttons/menu-favourite.png",
				}));

				if (isfav(identifier) == true){
					lbl122.children[0].image = "/images/buttons/menu-favourite-active.png";
				}
				addTextToImage(lbl122,LL("sidenav_favourite"),38);
				
				var lbl123 = Ti.UI.createView({
					height : Ti.UI.SIZE,
					top : 255,
					left:0
				});
				lbl123.add(Ti.UI.createImageView({
					image : "/images/buttons/menu-comment.png",
				}));
				addTextToImage(lbl123,LL("sidenav_comment"),38);

				var lbl124 = Ti.UI.createView({
					height : Ti.UI.SIZE,
					top : 345,
					left:0
				});
				lbl124.add(Ti.UI.createImageView({
					image : "/images/buttons/menu-share.png",
				}));
				addTextToImage(lbl124,LL("sidenav_share"),38);


				var lbl125 = Ti.UI.createView({
					height : Ti.UI.SIZE,
					top : 430,
					left:0
				});
				lbl125.add(Ti.UI.createImageView({
					image : "/images/buttons/menu-download.png",
				}));
				addTextToImage(lbl125,LL("sidenav_download"),38);

				
				view4.add(lbl121_info);
				view4.add(lbl121);
				//view4.add(lbl122a);
				view4.add(lbl122);
				view4.add(lbl123);
				view4.add(lbl124);
				view4.add(lbl125);
					
				var poper = function(){
					var self = Titanium.UI.createOptionDialog({
				        cancel: 3,
				        options: [L("share_on_facebook"), L("share_on_twitter"), L("pin_on_pintrest"),L("share_option_cancel")],
				        title: L("share_option_title")
				    });
				    //alert("b");
				   self.addEventListener('click',function(e) {
				        if (e.index == 0) {
							require("/helpers/social/share").facebook(twitter_text, twitter_image, twitter_link,false,facebook_appid);
				        }
				        else if (e.index == 1) {
							require("/helpers/social/share").tweet(twitter_text, twitter_image, twitter_link, false);
				        }
				        else if (e.index == 2) {
				        	var __url = "//www.pinterest.com/pin/create/button/?url=http%3A%2F%2Fwww.flickr.com%2Fphotos%2Fkentbrew%2F6851755809%2F&media=http%3A%2F%2Ffarm8.staticflickr.com%2F7027%2F6851755809_df5b2051c9_z.jpg&description=Next%20stop%3A%20Pinterest";
	//			        	__url = "http://www.pintrest.com/pin";
	//			        	__url = "http://www.pinterest.com/pin/create/button/?url=http%3A%2F%2Fwww.flickr.com%2Fphotos%2Fkentbrew%2F6851755809%2F&media=http%3A%2F%2Ffarm8.staticflickr.com%2F7027%2F6851755809_df5b2051c9_z.jpg&description=Next%20stop%3A%20Pinterest";
				        	__url = "http://www.pinterest.com/pin/create/button/?url="+twitter_link+"&media="+pintrest_image+"&description="+twitter_text;
				        	addlink({
								url : __url,
								connect : false,
								navbar : false,
								title : L("pin_to_pintrest")
							});
	
				        }
				    });
				    self.show();
	//			    return self;
				};
				
				lbl121_info.addEventListener("click",toggleInfo);
				lbl121.addEventListener("click",addlink);
				lbl122.addEventListener("click",like);
				lbl123.addEventListener("click",addcomment);
				lbl124.addEventListener("click",function(e){
					poper();
				});
				lbl125.addEventListener("click",function(e){
					statusfnLP();
				});
				
				view22.add(view2);
				self.add(view22);
				
				var html = "";
				html += "<html><head></head><body onload='zoom()'>";
				html += "<div id='coords' style='color:#fff;'></div>";
				html += "<div id='touchzone'>";
				html += "<img id='touchimg' src='"+ e.data[0].img+"' style='background-color:black;border:0;padding:0;margin:0;'>";
				html += "</div>";
				html += "</body>";
				html += "<script>";
				html += "var pressTimer = null;";
				html += "var shorttouch = 0;";
				html += "function touchHandlerStart(event) {";
				html += "	Ti.App.fireEvent('app:status:start',{status : 'touchstart' });";
				html += "	pressTimer = window.setTimeout(touchHandlerLP,5000);";
				html += "	shorttouch = 0;";
				html += "}";
				html += "function touchHandlerEnd(event) {";
				html += "	clearTimeout(pressTimer);";
				html += "	Ti.App.fireEvent('app:status:end',{status : 'touchend', shorttouch : shorttouch });";
				html += "	shorttouch = 0;";
				html += "}";
				html += "function touchHandlerMove(event) {";
				html += "	clearTimeout(pressTimer);";
//				html += "	pressTimer = window.setTimeout(touchHandlerLP,5000);";
				html += "	shorttouch = 2;";
				html += "}";
				html += "function touchHandlerCancel(event) {";
				html += "	clearTimeout(pressTimer);";
				html += "}";
				html += "function touchHandlerLP(event) {";
				html += "	clearTimeout(pressTimer);";
				html += "	shorttouch = 0;";
				html += "}";
				html += "function zoom() {";
				html += "	var touchimg = document.getElementById('touchimg');";
				html += " 	var w = touchimg.width;";
				html += " 	var h = touchimg.height;";
				html += " 	var ww = window.innerWidth;";
				html += " 	var wh = window.innerHeight;";
//				html += "	alert('h:'+h+' w:'+w+' wh:'+wh+' ww:'+w);";
				html += "	if (wh > ww) {";
				html += "		touchimg.style.height = wh+'px';";
				html += "		touchimg.style.minHeight = ww+'px';";
				html += "		touchimg.style.minWidth = ww+'px';";
				html += " 		var w2 = touchimg.width;";
				html += "		window.scrollTo(((w2-ww)/2),1);";
				html += "	} else {";
				html += "		touchimg.style.width = ww+'px';";
				html += "		touchimg.style.minHeight = wh+'px';";
				html += "		touchimg.style.minWidth = wh+'px';";
				html += "		window.scrollTo(100,0);";
				html += " 		var h2 = touchimg.height;";
				html += "		window.scrollTo(1,((h2-wh)/2));";
				html += "	}";
				html += "}";
				html += "</script>";
				html += "<script>";
				html += "var touchzone = document.getElementById('touchzone');";
				html += "var touchimg = document.getElementById('touchimg');";
				html += "touchzone.addEventListener('touchstart', touchHandlerStart, false);";
				html += "touchzone.addEventListener('touchend', touchHandlerEnd, false);";
				html += "touchzone.addEventListener('touchmove', touchHandlerMove, false);";
				html += "touchzone.addEventListener('touchcancel', touchHandlerCancel, false);";
				html += "</script>";
				html += "<style>";
//				html += "img {min-width:50%;min-height:50%;}";
//				html += "img {min-width:100%;min-height:100%;}";
				html += "<style>";
				html += "</html>";
				
				dbg(0.9);
	
				// self.add(Titanium.UI.createWebView({
					// left:514,bottom:40,right:0, height:200, url : "http://www.wikipedia.com"
				// }));
				
				
				// view.add(img);
				// img.addEventListener("click", winclose);
	// 			
				// view.add(txt);
				
				// var wv0 = Ti.UI.createScrollView({
					// left:0,top:0, 
					// width:  Ti.UI.FILL,
					// height : Ti.UI.FILL,
				    // contentWidth:'auto',
				    // contentHeight:'auto'
				// });
	
				if (Ti.Platform.osname !== 'android') {
					var wv = Titanium.UI.createWebView({
						left:0,top:0,bottom:8,right:5,
						borderRadius:5,
						width:  Ti.UI.FILL,
						height:  Ti.UI.FILL,
						scalesPageToFit:true,
						touchEnabled : true,
						html : html,
						backgroundColor:css.DARKBACKGROUND
					});
					var t = null;
					wv.willHandleTouches = false;
				} else {
					
	
					var getCachedFileLazyLocal = function(obj, elementname, url) {
						var imageDirectoryName = "cache";
						var filename = "bigimage.png";
						var g = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, imageDirectoryName);
						if (g.exists() == false) g.createDirectory();
						var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, imageDirectoryName, filename);								
						
						var setfile = function(responseData) {
							file.write(responseData);
							obj[elementname] =  file.nativePath;
	
							dbg2("set image");
							
							var testFile = Ti.Filesystem.getFile(file.nativePath).read();
							var heightOfImage = testFile.height;
							dbg2("new image height "+heightOfImage);
							var widthOfImage = testFile.width;
							dbg2("new image width "+widthOfImage);
							
							// // Put it in a imageView, since It wont let me get height from a blob for some reason
							// var imageView1 = Titanium.UI.createImageView({
							    // image: file.nativePath,
							    // width: 'auto',
							    // height: 'auto'
							// });
							// dbg2("new image");
	// 						
							// // This is the important part, toImage this view and you get the height and width of this image
							// // For some reason we cant get this from a Blob in SDK 2.1.1.GA
							// var heightOfImage = imageView1.toImage().height;
							// dbg2("new image height "+heightOfImage);
							// var widthOfImage = imageView1.toImage().width;
							// dbg2("new image width "+widthOfImage);
							
							obj.width = widthOfImage;
							dbg2("new image set 1 ");
							obj.height = heightOfImage;
							dbg2("new image set 2 ");
							obj._width = widthOfImage;
							dbg2("new image set 3 ");
							obj._height = heightOfImage;
							dbg2("new image set 4 ");
							setInitialZoom.call(this,{});
							return;
						};
						
						var xhr = Ti.Network.createHTTPClient({
							onload :function() {
								setfile(this.responseData);
							}
						});
						xhr.open('GET', url, true);
						xhr.send();
					};
	
	
					
					var wv1 = Titanium.UI.createView({
						left:0,top:0,bottom:8,right:5,
						// borderColor : "#0000cc",
						// borderWidth : 10,
						_name : "wv1",
						width:  Ti.UI.FILL,
						height:  Ti.UI.FILL,
						backgroundColor:css.DARKBACKGROUND
					});
	
					var wv11 = Titanium.UI.createImageView({
						image: '',
						left:0,top:0,
						_name : "",
						// borderColor : "#00cc00",
						// borderWidth : 10,
						touchEnabled : false,
						width:  Ti.UI.SIZE,
						height : Ti.UI.SIZE,
						backgroundColor:css.DARKBACKGROUND
					});
					
					getCachedFileLazyLocal(wv11,"image",e.data[0].img);
					wv1.add(wv11);
					
					var wvtxt = Ti.UI.createLabel({
						top:0,
						left:0,
						height : 80,
						width: 300,
						color : "#00cc00"
					});
//					wv1.add(wvtxt);
					
					var scale = 1;
					var newscale = 1;
					
					wv1.addEventListener('pinch', function(e) { 
						dbg2("pinch scale:"+e.scale+" ");
						var ns = (e.scale * scale);
						if (ns < 0.25) ns = 0.25;
						if (ns > 2) ns = 2;
						wv11.width = wv11._width * (ns);
						wv11.height = wv11._height * (ns);
	//					var tr = Ti.UI.create2DMatrix().scale(e.scale * scale);
						newscale = e.scale; 
	//					wv11.transform = tr; 
					});
					var tmcount = 0;
					var ee = {
						x:0,
						y:0,
						ts : 0
					};
					var ee_start = {
						x:0,
						y:0
					};
					var eepos = {
						x : 0,
						y : 0
					};
					var pressTimer = null;
					var shorttouch = 0;
					var touchHandlerLP = function() {
						clearTimeout(pressTimer);
						Ti.App.fireEvent('app:status:LP',{status : 'LP' });
						shorttouch = 0;
					};
	
					
					wv1.addEventListener('touchstart', function(e){
						//wv11._x = wv11.left;
						//wv11._y = wv11.top;
						if (e.source._name != "wv1") return;
						
						wv11._x = eepos.x;
						wv11._y = eepos.y;
						
						wv11._sx = e.x;
						wv11._sy = e.y;
						wv11._boxwidth = wv1.getSize().width;
						wv11._boxheight = wv1.getSize().height;
						ee.x = Math.floor(e.x);
						ee.y = Math.floor(e.y);
						ee.ts = new Date().getTime();
						ee_start.x = Math.floor(e.x);
						ee_start.y = Math.floor(e.y);
						Ti.App.fireEvent('app:status:start',{status : 'touchstart' });					
						
	//					pressTimer = window.setTimeout(touchHandlerLP,5000);
						tmcount = 0;
						dbg2("touchstart x:"+e.x+" / y:"+e.y+" (wv11.x"+wv11.left+" / wv11.y:"+wv11.top+") eepos("+eepos.x+"/"+eepos.y+")");
						wvtxt.text = ("touchstart x:"+e.x+" / y:"+e.y+" (wv11.x"+wv11.left+" / wv11.y:"+wv11.top+") eepos("+eepos.x+"/"+eepos.y+") s("+scale+")");
					});
	
					var setInitialZoom = function() {
						var w = wv11._width;
						var h = wv11._height;
						var ww = wv1.getSize().width;
						var wh = wv1.getSize().height;
						if (wh > ww) {
							wv11.height = wh;
							scale = (wh/wv11._height);
							newscale = scale;
							var w2 = Math.floor(w * scale);
							wv11.width = w2;
							wv11.left = ((w2-ww)/2) * -1;
							wv11.top = 0;
						} else {
							wv11.width = ww;
							scale = (ww/wv11._width);
							newscale = scale;
							var h2 = Math.floor(h * scale);
							wv11.height = h2;
							wv11.top = ((h2-wh)/2) * -1;
							wv11.left = 0;
						}
						eepos.x = wv11.left;
						eepos.y = wv11.top;
						wvtxt.text = ("zoom x:"+e.x+" / y:"+e.y+" (ww:"+ww+",wv:"+wv+") (wv11.w"+wv11.width+" / wv11.h:"+wv11.height+") eepos("+eepos.x+"/"+eepos.y+")");
					};
	
					var setNewLocationForPicture = function() {
						var newx = wv11._x + (ee.x - ee_start.x);
						var makemove = false;
						
						if (newx < 0 && newx > (-1*(wv11.width - wv11._boxwidth)) ) {
//						if (newx < 0 && newx > (-1*(wv11.width)) ) {
							//wv11.left = newx;
							makemove = true;
						} else {
							newx = wv11.left;
						}
						var newy = wv11._y + (ee.y - ee_start.y);
						
						if ( newy < 0 && newy > (-1*(wv11.height - wv11._boxheight))) {
//						if ( newy < 0 && newy > (-1*(wv11.height))) {
							//wv11.top = newy;
							makemove = true;
						} else {
							newy = wv11.top;
						}
						if (makemove == true) {
	//						wv11.animate({left:newx, top:newy,duration:100,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){
								wv11.top = newy;
								wv11.left = newx;
								eepos.x = newx;
								eepos.y = newy;
								
	//						});
						}
					};
					
					// wv1.addEventListener('click', function(e){
						// Ti.App.fireEvent('app:status:end',{status : 'touchend', shorttouch : 0 });
					// });
					// wv1.addEventListener('longpress', function(e){
						// Ti.App.fireEvent('app:status:end',{status : 'touchend', shorttouch : 0 });
						// statusfnLP();
					// });
					wv1.addEventListener('touchmove', function(e){
						if (e.source._name != "wv1") return;
						if (Math.floor(e.x) == ee.x && Math.floor(e.y) == ee.y) return;
						ee.x = Math.floor(e.x);
						ee.y = Math.floor(e.y);
	//					tmcount++;
						dbg2("touchmove x:"+e.x+" / y:"+e.y+" ("+tmcount+") ");
	//					if (tmcount % 10 != 0) return;
						setNewLocationForPicture.call(this,e);
	//					dbg2("touchmove x:"+e.x+" / y:"+e.y+" (wv11._x"+wv11._x+" / wv11._y:"+wv11._y+") (wv11.sx"+wv11._sx+" / wv11.sy:"+wv11._sy+") ");
					});
					wv1.addEventListener('touchend', function(e){
						if (e.source._name != "wv1") return;
						var ts = new Date().getTime();
						dbg2("touchend x:"+e.x+" / y:"+e.y+" eets:"+ee.ts+" / diff:"+(ts - ee.ts));
						var st = ((ts - ee.ts) < 100) ? 0 : 2;
						
						ee.x = Math.floor(e.x);
						ee.y = Math.floor(e.y);
						setNewLocationForPicture.call(this,e);
						scale = (scale * newscale);
						if (scale < 0.25) scale = 0.25;
						if (scale > 2) scale = 2;
						
						
						Ti.App.fireEvent('app:status:end',{status : 'touchend', shorttouch : st });
	//					pressTimer = setTimeout(touchHandlerLP,5000);
	
					});
					wv1.addEventListener('touchcancel', function(e){
						dbg2("touchcancel x:"+e.x+" / y:"+e.y+"");
					});
					
				}	
					
				
				
				
				// wv.addEventListener('longpress', function() {
					// if (t) clearTimeout(t);
					// status.text = 'longpress';
					// t = setTimeout(function() {
						// status.text = '';
					// }, 200);
				// });
				
				
				var hideinfobuttons = function(e){
					view4.animate({opacity:0,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
					v22.animate({opacity:0,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
				};
				var showinfobuttons = function(e){
					var dur = 500;
					view4.animate({opacity:1,duration:dur,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){
						view4.opacity = 1;
					});
					v22.animate({opacity:1,duration:dur,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){
						v22.opacity = 1;
					});
					b1.animate({opacity:1,duration:dur,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){
						b1.opacity = 1;
					});
				};
				var infowindowhidden_due_to_orientation = false;
				var checkorientation = function() {
					// this is only appropriate for iphone layouts
					if (require("/etc/config").format == "phone") return;
					
					if (Ti.Gesture.getOrientation() == Ti.UI.PORTRAIT || Ti.Gesture.getOrientation() == Ti.UI.UPSIDE_PORTRAIT) {
						infowindowhidden_due_to_orientation = false;
						showinfobuttons();
					} else {
						infowindowhidden_due_to_orientation = true;
						hideinfobuttons();
					}
				};
				
				var statusfnstart = function(e){
					Ti.API.info("statusfnstart");
					if (t) clearTimeout(t);
					status.text = e.status;
					view4.animate({opacity:0,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
					b1.animate({opacity:0,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
					v22.animate({opacity:0,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
				};
				var statusfnend = function(e){
					Ti.API.info("statusfnend");
					if (t) clearTimeout(t);
					status.text = e.status;
					var tim = 4000;
					var dur = 1000;
					if (e.shorttouch == 0) {
						tim = 200;
						dur = 500;
					}
					t = setTimeout(function() {
						status.text = '';
						if (infowindowhidden_due_to_orientation == true) return;
						view4.animate({opacity:1,duration:dur,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){
							view4.opacity = 1;
						});
						v22.animate({opacity:1,duration:dur,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){
							v22.opacity = 1;
						});
						b1.animate({opacity:1,duration:dur,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){
							b1.opacity = 1;
						});
					}, tim);
				};
				var image_to_save = e.data[0].img;
				/**
				 * Download file
				 */
				var statusfnLP = function(e){
					var dialog = Ti.UI.createAlertDialog({
					    cancel: 1,
					    buttonNames: [LL('Confirm'), LL('Cancel')],
					    message: LL('download_message'),
						title: LL('download_title')
					});
					dialog.addEventListener('click', function(e){
						if (e.index === e.source.cancel){
							Ti.API.info('The cancel button was clicked');
						} else {
							require("/helpers/flurry").log("save_image",{identifier : identifier },identifier);
							var xhr = Titanium.Network.createHTTPClient({ 
								onload: function() { 
									// var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'tempimage.png'); 
// 
									// if (Ti.Filesystem.isExternalStoragePresent()) {
										// f = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory,'tempimage_'+Ti.Utils.sha1(identifier)+'.png');
									// }
									// f.write(this.responseData); 
									
									if (Ti.Platform.osname === 'android') {
										
										Titanium.Media.Android.saveToDownloads(this.responseData,'tempimage_'+Ti.Utils.sha1(identifier)+'.png',true, function(e){
											if (e && e.uri && e.uri != null) {
										        Titanium.UI.createAlertDialog({
										            title:LL('Photo_Gallery'),
										            message:LL('Image_saved')
										        }).show();      
										    } else {
										        Titanium.UI.createAlertDialog({
										            title:LL('Error_saving_image'),
										            message:e.error
										        }).show();
										    }
										});
										
										// var scanfiles = [];
										// scanfiles.push(f.nativePath);
										// Titanium.Media.Android.scanMediaFiles(scanfiles,null, function(e) {
											// if (e && e.uri && e.uri != null) {
										        // Titanium.UI.createAlertDialog({
										            // title:LL('Photo_Gallery'),
										            // message:LL('Image_saved')
										        // }).show();      
										    // } else {
										        // Titanium.UI.createAlertDialog({
										            // title:LL('Error_saving_image'),
										            // message:e.error
										        // }).show();
										    // }
										// });
									} else {
//										var x=f.read();
										Titanium.Media.saveToPhotoGallery(this.responseData,{
										    success: function(e) {
										        Titanium.UI.createAlertDialog({
										            title:LL('Photo_Gallery'),
										            message:LL('Image_saved')
										        }).show();      
										    },
										    error: function(e) {
										        Titanium.UI.createAlertDialog({
										            title:LL('Error_saving_image'),
										            message:e.error
										        }).show();
										    }
										});
									}
								},
							timeout: 10000 
							}); 
							xhr.open('GET',image_to_save); 
							xhr.send();							
 
						}
					});
					dialog.show();
				};
				Ti.App.addEventListener("app:status:start", statusfnstart);
				Ti.App.addEventListener("app:status:end", statusfnend);
				if (Ti.Platform.osname !== 'android') Ti.App.addEventListener("app:status:LP", statusfnLP);
				if (require("/etc/config").format == 'phone') Ti.App.addEventListener("app:rotate", checkorientation);
				
				self.addEventListener('close', function(e) {
					Ti.App.removeEventListener("app:status:start", statusfnstart);
					Ti.App.removeEventListener("app:status:end", statusfnend);
					if (Ti.Platform.osname !== 'android') Ti.App.removeEventListener("app:status:LP", statusfnLP);
					if (require("/etc/config").format == 'phone') Ti.App.removeEventListener("app:rotate", checkorientation);
				});

				if (wv) view.add(wv);
				if (wv1) view.add(wv1);
				
				var optpush = function(arr,item) {
					for (var i=0; i < arr.length; i++) {
						if (arr[i] == item) return arr;
					}
					arr.push(item);
					return arr;
				};
				var displayPath = function(ARR) {
					var view0 = Titanium.UI.createView({
						top:00,bottom:200,left:0,right:0, layout : 'vertical',
						borderColor:'#333'
	//					borderRadius:20
					});
					var matched = [];
					for (var i=0; i < path.length; i++) { matched.push(true); }
					
					
					var lbl0h = Titanium.UI.createLabel({text:" How You Are Connected to "+e.data.title ,backgroundColor:"#333",color:css.VERYLIGHTCOLOUR,left:0,right:0,height:50,top:0,font : {fontFamily : "arial"}});
					view0.add(lbl0h);
					
					var lbl0 = Titanium.UI.createLabel({text:"You",height:40,top:5,font : {fontSize:20, fontFamily : "arial"}});
					lbl0.addEventListener("click",function(e) {
						ARR = [];
						displayPath(ARR);
					});
					view0.add(lbl0);
					
					
					
					for (var i=0; i < ARR.length; i++) {
						view0.add(Titanium.UI.createLabel({text:ARR[i],height:20,top:5,font : {fontFamily : "arial"}}));
						for (var j=0; j < path.length; j++) { if (path[j][i] != ARR[i]) matched[j] = false; }
					}
			
					var list = [];		
					var shortest = 999999;
					for (var i=0; i < path.length; i++) {
						if (matched[i] == true) {
							if (path[i].length < shortest) shortest = path[i].length;
							list = optpush(list,path[i][ARR.length]);
						}
					}
					view0.add(Titanium.UI.createLabel({text:"("+(path.length)+")"}));
					
					view0.add(Titanium.UI.createImageView({image:"/images/icon_arrow_green_down_15x18.gif",height:20,width:20}));
					
					
					for (var i=0; i < list.length; i++) {
						var lbl = Titanium.UI.createLabel({color : "#00f",text:list[i],height:20,top:5,font : {fontFamily : "arial"}});
						lbl.addEventListener("click",function(e) {
							ARR.push(e.source.text);
							displayPath(ARR);
						});
						view0.add(lbl);
					}
					view0.add(Titanium.UI.createImageView({image:"/images/icon_arrow_green_down_15x18.gif",height:20,width:20}));
					view0.add(Titanium.UI.createLabel({text:"("+(shortest - ARR.length)+")"}));
					view0.add(Titanium.UI.createLabel({text:e.data.title,height:20,top:5,font : {fontFamily : "arial"}}));
					if (view2.children && view2.children.length > 0) {
						view2.remove(view2.children[0]);
					}
					view2.add(view0);
				};	
				
				
				// var txt = Titanium.UI.createLabel({
					// bottom:10,
					// height : 20,
					// text : "AUTO SUGGESTIONS FROM METADATA",
					// color : "#00f",
					// font : {fontFamily : "arial"}
				// })
				// view.add(txt);
				
//				Ti.API.debug("AAAAAA - 9999");
				if (e.data && e.data.susuggestions) {
				
					for (var i=0; i < e.data.suggestions.length; i++) {
						var s = e.data.suggestions[i];
						
						
						if (s.indexOf("FOUND NODE ") == 0) {
							Titanium.API.info(s);
							var node = s.substring(11);
							var nodenum = s.substring(54);
							currentlink = node;
							Titanium.API.info(nodenum);
							Titanium.API.info(s);
							var txt = Titanium.UI.createLabel({
								bottom:10,
								height : 20,
								text : node + " / " + nodenum,
								font : {fontFamily : "arial"}
							});
							view.add(txt);
							
							
							var s = require("/helpers/LocalStorage").getString("myself");
							var ss = s.split("/");
							var myid = ss[ss.length-1];
							ajax.getdata({
								url : require("/etc/config").api+"?action=json-path&lang="+L("lang")+"&from="+myid+"&to="+nodenum,
								fn : function(e1) {
									Titanium.API.info(e1);
									var txt1 = Titanium.UI.createLabel({
										bottom:40,
										height : 150,
										text : e1.data.txt,
										font : {fontFamily : "arial"}
									});
		//							view2.add(txt1);
									path = e1.data.arr1;
									
									displayPath([]);
		
									// for (var i=0; i < e1.data; i++) {
										// var path = e1.data[i];
										// var length = path.length;
										// for (var j=0; j < path.relationships.length; j++) {
		// 									
										// }
									// }
									
								}
							});
						} else if (s.indexOf("TERM") == 0) {
							var txt = Titanium.UI.createLabel({
								bottom:10,
								height : 20,
								text : s,
								font : {fontFamily : "arial"}
							});
							view.add(txt);
							
						} else if (s.indexOf("CON") == 0) {
							var txt = Titanium.UI.createLabel({
								bottom:10,
								height : 20,
								text : s,
								font : {fontFamily : "arial"}
							});
							view.add(txt);
							
						}
					}
				}
//				Ti.API.debug("AAAAAA - 99999-END");
			} catch (EE) {
		  		require("/etc/config").error(EE);
			}
			
		}
	});
	
	dbg(0.4);
	
	
	var displayhelp1 = function() {
		var x = Ti.UI.createWindow({
		});
		x.add(Ti.UI.createView({
			top:0,left:0,height:Ti.UI.FILL,width:Ti.UI.FILL,backgroundColor:"#333333",opacity:0.4
		}));
		x.add(Ti.UI.createImageView({
			top:0,left:0,height:Ti.UI.FILL,width:Ti.UI.FILL,
			image : '/images/eu/help-footer.png'
		}));
		x.addEventListener('click',function(e) {
			x.close();
		});
		x.open();
//		alert(Titanium.Platform.osname+"\n"+Titanium.Platform.version+"\n"+Titanium.Platform.getModel());
		
	};
//	self.addEventListener('click', displayhelp);
	Titanium.App.addEventListener("display1-main-help",displayhelp1);
	self.addEventListener('close', function() {
		Titanium.App.removeEventListener("display1-main-help",displayhelp1);
	});
	//setTimeout(displayhelp1,1000);
	
	var uuid = require("/ui/common/globals").getuuid();

	self.open({
//		transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
	});	
//	globals.openmodalfull(self);	
	
}

module.exports = fn;
