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

	mainview.addEventListener('scrollEnd', function(e) {
		Ti.App.fireEvent("app-endscroll",{
			x : mainview.getContentOffset().x,
			y : mainview.getContentOffset().y,
			w : mainview.getSize().width,
			h : mainview.getSize().height
		})
	});
	mainview.addEventListener('dragEnd', function(e) {
		if (e.decelerate == true) return;
		Ti.API.debug("scroll");
		Ti.API.debug(e);
		Ti.API.debug(mainview.getContentOffset());
		Ti.API.debug(mainview.getContentOffset().x);
		Ti.API.debug(mainview.getContentOffset().y);
		Ti.App.fireEvent("app-endscroll",{
			x : mainview.getContentOffset().x,
			y : mainview.getContentOffset().y,
			w : mainview.getSize().width,
			h : mainview.getSize().height
		})
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
					// fontFamily : "arial"
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
					fontFamily : "arial"
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
		top:40,left:-500,width:400,height:710,backgroundColor:"#000"
	});
	var tabR = Titanium.UI.createTableView({
		height : 'auto',
		left:0, right:0,top:0,
		color : "#777",
		backgroundColor : "#fff",
		separatorColor :"#777",
		borderColor:'#777',
		borderWidth:1
	});
	mainviewR.add(tabR);
	tabR.addEventListener("click", function(e) {
		if (e.row.xlink == "remove-searchterm") {
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
	var refreshplaces = function(places) {
		var rows = [];
		var section = null;
		
		
		
		var type = require("/helpers/LocalStorage").getString("type-string");
		var type_parts = type.split("|");
		for (var i=0; i < type_parts.length; i++) {
			var row = Titanium.UI.createTableViewRow({
				xlink : "remove-searchterm",
				xindex : i,
				xvisible : 1,
				backgroundColor:"#000",
				color : "#777",
				height : 64,
			})
			var lbl = Titanium.UI.createLabel({
				text : type_parts[i],
				xlink : "remove-searchterm",
				xindex : i,
				color : "#777",
				height : 'auto',
				font : {
					fontSize : 16,
					fontFamily : "arial"
				}
			});
			row.add(lbl);
			rows.push(row);
		}

		
		for (var i=0; i < places.length; i++) {
			if (places[i].indexOf("#") == 0) {
				if (section != null) rows.push(section);
				var secv = Ti.UI.createView({
					height : 30,
					backgroundColor : "#333"
				});
				secv.add(Ti.UI.createLabel({
					color : "#777",
					height : Ti.UI.SIZE,
					textAlign: "left",
					width:425,
					left:5,
					top:7,
					font : {
						fontSize : 16,
						fontFamily : "arial"
					},
					color : "#fff",
					text : L(places[i].toUpperCase())
				}));
				section = Ti.UI.createTableViewSection({
					headerView : secv
				});
				secv.addEventListener("click", function(e) {
					Ti.API.debug(e);
					Ti.API.debug(e.source);
					Ti.API.debug(e.source.parent);
					Ti.API.debug(e.source.parent.parent);
				});
			} else {
				var place = places[i].split("|");
				var row = Titanium.UI.createTableViewRow({
					xlink : place[0],
					xvisible : 1,
					backgroundColor:"#000",
					color : "#777",
					height : 64,
				})
				var lbl = Titanium.UI.createLabel({
					text : place[1],
					xlink : place[0],
					color : "#777",
					height : 'auto',
					font : {
						fontSize : 16,
						fontFamily : "arial"
					}
				});
				row.add(lbl);

				if (section == null) {
					rows.push(row);
				} else {
					section.add(row);
				}
			}
		}
		if (section != null) rows.push(section);
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
			mainviewR.animate({left:-500,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
			
		}
		
	}
	
	b1.addEventListener("click", click);
	
	var b1emp = Titanium.UI.createButton({
		image : '',
		width:15
	})
	var b2emp = Titanium.UI.createButton({
		image : '',
		width:145
	})
	var b1muse = Titanium.UI.createButton({
		image : 'images/small-logo.png'
	})
	
	var bb1 = Titanium.UI.createButtonBar({
	    labels:['Home','Search results', 'Your Favourites', 'Help'],
	    backgroundColor:'#000000',
	    top:50,
	    style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
	    height:30,
	    width:400
	});
	var bbselect = function(e) {
		var tab = e.index;
		if (tab == 0) {
			Titanium.App.fireEvent("display-search-force",{});			
		}
		if (tab == 1) {
			Titanium.App.fireEvent("redisplay-search",{});			
		}
		if (tab == 2) {
			Titanium.App.fireEvent("redisplay-personal",{});			
		}
		if (tab == 3) {
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
		backgroundColor : "#fff",
		borderColor : "#777777",
		borderWidth : 1,
		color : "#777",
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
		
		var type_parts = type.split("|");
		type = "";
		for (var i=0; i < type_parts.length; i++) {
			type += type_parts[i];	
		}

		search.setValue(srch);
		
		var ajax = require("/helpers/ajax");
		ajax.getdata({
			url : "http://jon651.glimworm.com/europeana/eu.php?action=json-srch&srch="+srch+"&type="+Ti.Network.encodeURIComponent(type),
//			url : "http://jon651.glimworm.com/europeana/eu.php?action=json-srch-rijksmuseum&srch="+srch+"&type="+type,
			fn : function(e) {
				require("/helpers/LocalStorage").setObject("search",e.data.items);
				require("/helpers/LocalStorage").setObject("types",e.data.types);
				/*require("/helpers/LocalStorage").setObject("creators",e.data.creators);
				require("/helpers/LocalStorage").setObject("dats",e.data.dats);*/
				Ti.API.debug(e.data.url);
				
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
			mainviewR.animate({left:-500,duration:500,curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT},function(e){});
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
		mainview.scrollTo(0,0);
	}
	function redisplaySearch2(e) {
		if (!e.xfrom || e.xfrom != "search2") {
//			if (curr_event == "search") {
//				Titanium.App.fireEvent("display-search-force",{});
//				return;
//			}
		}
		curr_event = "search";
		close_displaySearchForce();
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
		Ti.App.fireEvent("app-endscroll",{
			x : 0,
			y : 0,
			w : mainview.getSize().width,
			h : mainview.getSize().height
		});


		refreshplaces2();
		refreshleftlist2();
		if (items.length == 0 || items.length == null) {
			require("/helpers/LocalStorage").setObject("search-message","This search gives no results, please try another search term");
			Titanium.App.fireEvent("display-search-force",{});
		} else {
			require("/helpers/LocalStorage").setObject("search-message","");
			
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
		close_displaySearchForce();
		
		done();
	
		var itemClass = require("/ui/common/itemView");
		
		for (var i=0; i <items.length; i++) {
			
			Titanium.App.fireEvent("load-"+i,{item:items[i]});

		}
		Ti.App.fireEvent("app-endscroll",{
			x : 0,
			y : 0,
			w : mainview.getSize().width,
			h : mainview.getSize().height
		});

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
			top:0,left:0,height:Ti.UI.FILL,width:Ti.UI.FILL,backgroundColor:"#777"
		});
		x.add(xview);
		var ximg = Ti.UI.createImageView({
			top:10,
			left:300,
			image:'/images/eu/europeana-logo-white.png',
			width:300
		});
		xview.add(ximg);
		
		
		var xsearch = Titanium.UI.createTextField({
			top : 246,
			height : 54,
			autocorrect : false,
			autocapitalization : false,
			width : 860,
			borderRadius : 5,
			backgroundColor : "#ffffff",
			borderColor : "#777777",
			paddingLeft : 20,
			borderWidth : 1,
			hintText : "search in over 25 million images, texts and videos",
			color : "#676767",
			value : "",
			font : {
				fontFamily : "arial",
				fontSize : 24
			}
		});
		xview.add(xsearch);
		// var ximg1 = Ti.UI.createImageView({
			 // top:228,
			 // right:24,
			 // image:'/images/srch-but.png'
		// });
		// xview.add(ximg1);
		var ximg_left = Ti.UI.createImageView({
			 top:428,
			 left:10,
			 width : 50,
			 zIndex : 99,
			 image:'/images/eu/arrow-left.png'
		});
		xview.add(ximg_left);
		var ximg_right = Ti.UI.createImageView({
			 top:428,
			 right:10,
			 width : 50,
			 zIndex : 99,
			 image:'/images/eu/arrow-right.png'
		});
		xview.add(ximg_right);		
		xview.add(Ti.UI.createLabel({
			text : require("/helpers/LocalStorage").getObject("search-message"),
			top:320,
			color : "#ffffff"
		}));
		
		var perform_pre_determined_search = function() {
			x.close();
			lock_displaySearchForce = false;
			var idx = 0;
			require("/helpers/LocalStorage").setString("search-string","*:*");
			require("/helpers/LocalStorage").setString("yr-string","");
			require("/helpers/LocalStorage").setString("place-string","");
			require("/helpers/LocalStorage").setString("type-string",featured_items[idx].query);
			search2.call(this);
			
		}

		var perform_search = function() {
			x.close();
			lock_displaySearchForce = false;
			require("/helpers/LocalStorage").setString("search-string",xsearch.value);
			require("/helpers/LocalStorage").setString("yr-string","");
			require("/helpers/LocalStorage").setString("place-string","");
			require("/helpers/LocalStorage").setString("type-string","");
			search2.call(this);
		}
		
		
		
		var search_views = [];
		var featured_items = [{ 
				img : "featured-maps.jpg", 
				txt : "Maps and Plans",
				query : '&qf=DATA_PROVIDER:"Cat%C3%A1logo+Colectivo+de+la+Red+de+Bibliotecas+de+los+Archivos+Estatales"|&qf=DATA_PROVIDER:"Biblioteca+Virtual+del+Patrimonio+Bibliogr%C3%A1fico"|&qf=TYPE:IMAGE|&qf=DATA_PROVIDER:"Biblioteca+Virtual+del+Ministerio+de+Defensa" '
			}, { 
				img : "featured-art.jpg", txt : "Treasures of Art"},{ img : "featured-past.jpg", txt: "Treasures of the Past"},{ img :"featured-nature.jpg", txt : "Treasures of Nature"}]
		
		var num_items = featured_items.length;
		var search_square_x3 = null;
		
		for (var i=0; i < num_items; i++) {

			if (search_square_x3 != null && (i%3) == 0) {
				search_views.push(search_square_x3);
				search_square_x3 = null;
			}
			if (search_square_x3 == null) {
				search_square_x3 = Ti.UI.createView({
					width:870,
					height:300,
					layout : 'horizontal'
				});
			} 
			var search_square = Ti.UI.createView({
				width:280,
				height:280,
				right : 5,
				left : 5
			});
			var ximg2 = Ti.UI.createImageView({
				 image:"http://jon651.glimworm.com/europeana/featured_items/"+featured_items[i].img
			});
			search_square.add(ximg2);
			
			var square_underlay = Ti.UI.createView({
				bottom : 0, height : 50, backgroundColor : "#333", opacity : 0.75,
				width : Ti.UI.FILL
			});
			
			var square_text = Ti.UI.createLabel({
				text : featured_items[i].txt,
				color : "#fff",
				bottom : 0, height : 50
			});
			search_square.add(square_underlay);
			search_square.add(square_text);
			search_square.addEventListener('click',perform_pre_determined_search);
			search_square_x3.add(search_square);
		}
		if (search_square_x3 != null) {
			search_views.push(search_square_x3);
		}
		

		var normal_searches_view = Ti.UI.createScrollableView({
			views : search_views,
			pagingControlColor : "#777",
			backgroundColor : "#777",
			pagingControlHeight : 20,
			top:350,
			showPagingControl:true,
			height : 320
		});
		
		xview.add(normal_searches_view);
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
		}
		var hide_correct_navigation_arrows = function() {
			ximg_right.visible = false;
			ximg_left.visible = false;
		}
		show_correct_navigation_arrows();
		normal_searches_view.addEventListener('scrollEnd',show_correct_navigation_arrows);
		normal_searches_view.addEventListener('scroll',hide_correct_navigation_arrows);
		
		navigation_arrow_right = function() {
			ximg_right.visible = false;
			normal_searches_view.scrollToView(normal_searches_view.currentPage+1);
		}
		ximg_right.addEventListener('click',navigation_arrow_right);
		navigation_arrow_left = function() {
			ximg_left.visible = false;
			normal_searches_view.scrollToView(normal_searches_view.currentPage-1);
		}
		ximg_left.addEventListener('click',navigation_arrow_left);
		
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
	};
//	self.addEventListener('click', displayhelp);
	Titanium.App.addEventListener("display-search-force",displaySearchForce);
	
	return self;
	
}

module.exports = fn;
