var globals = require('/ui/common/globals');
var css = require('/ui/common/css');

function fn() {

	var curr_event = "";
	var MAXITEMS = 150;
	
	var self = Titanium.UI.createWindow({
    	navBarHidden: true,
    	backgroundColor:"#fff",
		backgroundGradient: css.WINGRAD2,
		tabBarHidden:true
	});
	
	var topview = Titanium.UI.createView({
		top:0,left:0,right:0,height:40,backgroundColor:"#ff0000"
	})
	var mainview = Titanium.UI.createScrollView({
		contentHeight:'auto',
		contentWidth:'auto',
		top:40,left:0,right:0,height:710,backgroundColor:"#000000"
	});

	var mainview2 = Titanium.UI.createView({
//		top:0,left:0,width:3200,height:3350,backgroundColor:"transparent", borderWidth:0, borderColor:"#fff",
		top:0,left:0,
		width:3200,
		height : (420 * (MAXITEMS / 25)) + 20,
//		height:Ti.UI.SIZE,
		backgroundColor:"transparent", borderWidth:0, borderColor:"#fff",
		layout:"horizontal"
	});
	var mainviewL = Titanium.UI.createScrollView({
		contentHeight:'auto',
		contentWidth:'auto',
		zIndex:999,
		xopen : false,
		top:40,left:-200,width:190,height:659,backgroundColor:"#000"
	});
	var tabL = Titanium.UI.createTableView({
		height : 'auto',
		left:0, right:0,top:0,
		color : "#fff",
		backgroundColor : "#000",
		separatorColor :"#000",
	});
	mainviewL.add(tabL);
	tabL.addEventListener("click", function(e) {
		require("/helpers/LocalStorage").setString("yr-string",e.row.xlink);
		search2.call(this);
	});

	// var refreshyears = function() {
		// var rows = [];
		// for (var i=1850; i < 1970; i++) {
			// var row = Titanium.UI.createTableViewRow({
				// xlink : i,
				// backgroundColor:"#000",
				// color : "#fff",
				// height : 32,
			// })
			// var lbl = Titanium.UI.createLabel({
				// text : i,
				// xlink : i,
				// color : "#fff",
				// height : 'auto',
				// font : {
					// fontSize : 16,
					// fontFamily : "STHeitiTC-Medium"
				// }
			// })
			// row.add(lbl);
			// rows.push(row);
		// }
		// tabL.setData(rows);	
	// }
	// refreshyears();
	
	var refreshleftlist = function(places) {
		var rows = [];
		
		for (var i=0; i < places.length; i++) {
			var row = Titanium.UI.createTableViewRow({
				xlink : places[i],
				backgroundColor:"#000",
				color : "#fff",
				height : 64,
			})
			var lbl = Titanium.UI.createLabel({
				text : places[i],
				xlink : places[i],
				color : "#fff",
				height : 'auto',
				font : {
					fontSize : 16,
					fontFamily : "STHeitiTC-Medium"
				}
			})
			row.add(lbl);
			rows.push(row);
		}
		tabL.setData(rows);	
	}
	refreshleftlist([]);
	refreshleftlist2 = function()  {
		var items = require("/helpers/LocalStorage").getObject("creators");
		var items = require("/helpers/LocalStorage").getObject("dats");
		if (!items || items == null) items = [];
		refreshleftlist(items);	
	}
	
	
	
	
	var mainviewR = Titanium.UI.createScrollView({
		contentHeight:'auto',
		contentWidth:'auto',
		zIndex:999,
		xopen : false,
		top:40,left:-200,width:190,height:710,backgroundColor:"#000"
	});
	var tabR = Titanium.UI.createTableView({
		height : 'auto',
		left:0, right:0,top:0,
		color : "#fff",
		backgroundColor : "#000",
		separatorColor :"#333",
		borderColor:'#333',
		borderWidth:1
	});
	mainviewR.add(tabR);
	tabR.addEventListener("click", function(e) {
		require("/helpers/LocalStorage").setString("type-string",e.row.xlink);
		search2.call(this);
	});
	var refreshplaces = function(places) {
		var rows = [];
		
		for (var i=0; i < places.length; i++) {
			var row = Titanium.UI.createTableViewRow({
				xlink : places[i],
				backgroundColor:"#000",
				color : "#fff",
				height : 64,
			})
			var lbl = Titanium.UI.createLabel({
				text : places[i],
				xlink : places[i],
				color : "#fff",
				height : 'auto',
				font : {
					fontSize : 16,
					fontFamily : "STHeitiTC-Medium"
				}
			})
			row.add(lbl);
			rows.push(row);
		}
		tabR.setData(rows);	
	}
	refreshplaces("France Belgium".split(" "));	
	refreshplaces2 = function()  {
		var items = require("/helpers/LocalStorage").getObject("types");
		if (!items || items == null) items = [];
		refreshplaces(items);	
	}
	
	
	self.add(mainviewL);
	self.add(mainviewR);

	mainview.add(mainview2)
	
	var b1 = Titanium.UI.createButton({
		image : "/images/glyphicons_155_show_thumbnails.png"
	})
	var click = function(e) {
		// var winClass = require("/ui/common/SearchOptionsWindow");
		// var win = new winClass();
		if (mainviewL.xopen == false) {
			mainviewL.xopen = true;
			//mainviewL.animate({left:0,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
			mainviewR.animate({left:0,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
		} else {
			mainviewL.xopen = false;
			//mainviewL.animate({left:-200,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
			mainviewR.animate({left:-200,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
			
		}
		
	}
	
	b1.addEventListener("click", click);
	
	var b1emp = Titanium.UI.createButton({
		image : '',
		width:15
	})
	var b2emp = Titanium.UI.createButton({
		image : '',
		width:230
	})
	var b1muse = Titanium.UI.createButton({
		image : 'images/small-logo.png'
	})
	
	var bb1 = Titanium.UI.createButtonBar({
//	    labels:['Search', 'Personal Museum','clear','me','pin'],
	    labels:['Search', 'Personal Museum', 'Help'],
	    backgroundColor:'#000000',
	    top:50,
	    style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
	    height:30,
	    width:400
	});
	var bbselect = function(e) {
		var tab = e.index;
		if (tab == 0) {
			Titanium.App.fireEvent("redisplay-search",{});			
		}
		if (tab == 1) {
			Titanium.App.fireEvent("redisplay-personal",{});			
		}
		if (tab == 2) {
			//require("/helpers/LocalStorage").setObject("personal",[]);
			//Titanium.App.fireEvent("redisplay-personal",{});	
			Titanium.App.fireEvent("display-main-help",{});
			//Titanium.App.fireEvent("display-search-force",{});
		}
		// if (tab == 3) {
			// mainview2.asImage();
		// }
	}
	bb1.addEventListener("click",bbselect);
	
	var bbb1 = Ti.UI.createButton({
		image:'images/glyphicons_027_searcht.png'
	});
	
	var topbar = Titanium.UI.iOS.createToolbar({
		top:0,right:0,left:0,height:50,
		items : [b1,bb1,b1emp,b1muse,b2emp,bbb1],
		barColor : "#000000",
		borderTop:false,
	    borderBottom:true
	})
	
	var search = Titanium.UI.createTextField({
		right : 10,
		top : 5,
		height : 30,
		autocorrect : false,
		autocapitalization : false,
		width : 200,
		borderRadius : 5,
		backgroundColor : "#333333",
		borderColor : "#777777",
		borderWidth : 1,
		color : "#fff",
		value : " Search",
		font : {
			fontFamily : "SinhalaSangamMN",
			fontSize : 18
		}
	})
	
	topbar.add(search);
	topview.add(topbar);
	
	var search2 = function() {
		working();
		
		var srch = require("/helpers/LocalStorage").getString("search-string");
		var yr = require("/helpers/LocalStorage").getString("yr-string");
		var place = require("/helpers/LocalStorage").getString("place-string");
		var type = require("/helpers/LocalStorage").getString("type-string");
		lock_displaySearchForce = false;


		search.setValue(srch);
		
		var ajax = require("/helpers/ajax");
		ajax.getdata({
			url : "http://jon651.glimworm.com/europeana/eu.php?action=json-srch&srch="+srch,
//			url : "http://jon651.glimworm.com/europeana/eu.php?action=json-srch-rijksmuseum&srch="+srch+"&type="+type,
			fn : function(e) {
				require("/helpers/LocalStorage").setObject("search",e.data.items);
				/*require("/helpers/LocalStorage").setObject("types",e.data.types);
				require("/helpers/LocalStorage").setObject("creators",e.data.creators);
				require("/helpers/LocalStorage").setObject("dats",e.data.dats);*/
				
				Titanium.App.fireEvent("redisplay-search",{xfrom : 'search2'});
			}
		})
	};
	Titanium.App.addEventListener("app:search2",search2);
	search.addEventListener("click", function() {
		search.value='';
	});
	search.addEventListener("return", function() {
		var srchrealval = search.getValue().replace(" ","_");
		srchrealval = srchrealval.replace(" ","_");
		srchrealval = srchrealval.replace(" ","_");
		srchrealval = srchrealval.replace(" ","_");
		srchrealval = srchrealval.replace(" ","_");

		require("/helpers/LocalStorage").setString("search-string",srchrealval);
		require("/helpers/LocalStorage").setString("yr-string","");
		require("/helpers/LocalStorage").setString("place-string","");
		require("/helpers/LocalStorage").setString("type-string","");
		if (mainviewL.xopen == true) {
			mainviewL.xopen = false;
			//mainviewL.animate({left:-200,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
			mainviewR.animate({left:-200,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
		}

		search2.call(this);
	});
	
	var callsearchfromotherplace = function(searchval){
		require("/helpers/LocalStorage").setString("search-string",searchval);
		require("/helpers/LocalStorage").setString("yr-string","");
		require("/helpers/LocalStorage").setString("place-string","");
		require("/helpers/LocalStorage").setString("type-string","");
		search2.call(this);
	};
	
	var cnt = 0;
	var cntrow = 0;
	var amnt = 0;
	var vw = null;
	var type = 0;

	function redisplaySearchSetup() {
		var itemClass = require("/ui/common/itemViewShell");		
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
					})
					amnt = 2;
					type = 2;
				} else {
					vw = Titanium.UI.createView({
						width:270,
						height:420,
						layout : 'vertical'
					})
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
	}
	function redisplaySearch2(e) {
		if (!e.xfrom || e.xfrom != "search2") {
			if (curr_event == "search") {
				Titanium.App.fireEvent("display-search-force",{});
				return;
			}
		}
		curr_event = "search";
		Titanium.App.fireEvent("clearall",{});
		
		done();

		var items = require("/helpers/LocalStorage").getObject("search");
		if (!items || items == null) items = [];
		
		var itemClass = require("/ui/common/itemView");
		
		for (var i=0; i <items.length; i++) {
			
			Titanium.App.fireEvent("load-"+i,{item:items[i]});
			if (i < 10) {
				Ti.API.info(items[i]);
			}

		}
		refreshplaces2();
		refreshleftlist2();
		if (items.length == 0 || items.length == null) {
			Titanium.App.fireEvent("display-search-force",{});
		}
	};
	
	function redisplayPersonal2() {
		if (curr_event == "pers") return;
		curr_event = "pers";
		var items = require("/helpers/LocalStorage").getObject("personal");
		if (!items || items == null) items = [];
		
		if (items == null || items == ""){
			alert('Your personal museum is empty');
			return
		};
		
		
		Titanium.App.fireEvent("clearall",{});
		
		done();
	
		var itemClass = require("/ui/common/itemView");
		
		for (var i=0; i <items.length; i++) {
			
			Titanium.App.fireEvent("load-"+i,{item:items[i]});

		}
		if (items.length == 0 || items.length == null) {
			Titanium.App.fireEvent("display-search-force",{});
		}
		
	};
	
	redisplaySearchSetup();
	Titanium.App.addEventListener("redisplay-search",redisplaySearch2);
	Titanium.App.addEventListener("redisplay-personal",redisplayPersonal2);


	self.add(topview);
	self.add(mainview);
	
	var displayhelp = function() {
		var x = Ti.UI.createWindow({
		});
		x.add(Ti.UI.createView({
			top:0,left:0,height:Ti.UI.FILL,width:Ti.UI.FILL,backgroundColor:"#333333",opacity:0.4
		}));
		x.add(Ti.UI.createImageView({
			top:0,left:0,height:Ti.UI.FILL,width:Ti.UI.FILL,
			image : '/images/Arrows-big.png'
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
		if (win_displaySearchForce != null) {
			win_displaySearchForce.close();
			lock_displaySearchForce = false;
		}
	}
	
	var displaySearchForce = function() {
		if (lock_displaySearchForce == true) {
			if (win_displaySearchForce != null) {
				win_displaySearchForce.close();
				lock_displaySearchForce = false;
			}
			return;
		}
		lock_displaySearchForce = true;
		
		var x = Ti.UI.createWindow({
			top:40
		});
		win_displaySearchForce = x;
		
		var xview = Ti.UI.createView({
			top:0,left:0,height:Ti.UI.FILL,width:Ti.UI.FILL,backgroundColor:"#676767"
		});
		x.add(xview);
		
		var xlbl = Ti.UI.createLabel({
			left:206,top:255,text:'SEARCH',color:'#ffffff',
			font : {
				fontFamily : "SinhalaSangamMN",
				fontSize : 50
			}
		});
		xview.add(xlbl);
		var xlbl1 = Ti.UI.createLabel({
			left:405,top:320,text:'Powered by the Rijksmuseum Api',color:'#333333',
			font : {
				fontFamily : "SinhalaSangamMN",
				fontSize : 24
			}
		});
		xview.add(xlbl1);
		
		var ximg = Ti.UI.createImageView({
			top:-10,
			left:281,
			image:'/images/logo.png',
			width:562,
			height : 236
		});
		xview.add(ximg);
		
		// var ximg = Ti.UI.createImageView({
			// top:400,
			// left:195,
			// image:'/images/logo.png',
			// width:562,
			// height : 236
		// });
		// xview.add(ximg);
		
		
		var xsearch = Titanium.UI.createTextField({
			right : 206,
			top : 260,
			height : 50,
			autocorrect : false,
			autocapitalization : false,
			width : 428,
			borderRadius : 5,
			backgroundColor : "#ffffff",
			borderColor : "#777777",
			borderWidth : 1,
			color : "#676767",
			value : "",
			font : {
				fontFamily : "SinhalaSangamMN",
				fontSize : 30
			}
		});
		xview.add(xsearch);
		var srchval = search.value;
		//alert(srchval);
		xsearch.value = srchval;
		xsearch.addEventListener("return", function() {
		//x.addEventListener('click',function(e) {
		//	x.close();
			//var valsrch = xsearch.value();
			x.close();
			lock_displaySearchForce = false;
			require("/helpers/LocalStorage").setString("search-string",xsearch.value);
			require("/helpers/LocalStorage").setString("yr-string","");
			require("/helpers/LocalStorage").setString("place-string","");
			require("/helpers/LocalStorage").setString("type-string","");
			search2.call(this);
		});
		x.addEventListener('click', close_displaySearchForce);
		
		x.open();
	};
//	self.addEventListener('click', displayhelp);
	Titanium.App.addEventListener("display-search-force",displaySearchForce);
	
	return self;
	
}

module.exports = fn;
