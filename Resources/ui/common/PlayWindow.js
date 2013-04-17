var globals = require('/ui/common/globals');
var css = require('/ui/common/css');

function fn(identifier,cnt) {
	
	var self = Titanium.UI.createWindow({
    	navBarHidden: true,
    	backgroundColor:"#fff"
	});
	
	var table;
	var searchtitle = "";
	var Currenttitle = "";
	var Currenttitle1 = "";
	var Currenttitle2 = "";
	var ExtraButtons = [];
	var docTitle = "";
	var b1 = Titanium.UI.createButton({
		image : "/images/glyphicons_212_down_arrow.png"
	})
	var b99 = Titanium.UI.createButtonBar({
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
			winclose();			
		}
		if (tab == 1) {
			winclose();	
			Titanium.App.fireEvent("redisplay-personal",{});			
		}
		if (tab == 2) {
			//require("/helpers/LocalStorage").setObject("personal",[]);
			//Titanium.App.fireEvent("redisplay-personal",{});	
			//winclose();	
			Titanium.App.fireEvent("display1-main-help",{});
			//Titanium.App.fireEvent("display-search-force",{});
		}
		// if (tab == 3) {
			// mainview2.asImage();
		// }
	}
	b99.addEventListener("click",bbselect);
	
	var b99emp = Titanium.UI.createButton({
		image : '',
		width:15
	})
	var b9emp = Titanium.UI.createButton({
		image : '',
		width:230
	})
	var blogo = Titanium.UI.createButton({
		image : "/images/small-logo.png"
	})
	
	var winclose = function(e) {
		self.close();
	}
	b1.addEventListener("click", winclose);
	
	var bbb1 = Ti.UI.createButton({
		image:'images/glyphicons_027_searcht.png'
	});
	
	var topbar = Titanium.UI.iOS.createToolbar({
		top:0,right:0,left:0,height:40,
		items : [b1,b99,b99emp,blogo,b9emp,bbb1],
		barColor : "#000000",
		borderTop:false,
	    borderBottom:true
	})	
	self.add(topbar);
	
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

	search.addEventListener("return", function() {
		winclose();
		require("/helpers/LocalStorage").setString("search-string",search.getValue());
        require("/helpers/LocalStorage").setString("yr-string","");
        require("/helpers/LocalStorage").setString("place-string","");
        require("/helpers/LocalStorage").setString("type-string","");
        Titanium.App.fireEvent("app:search2",{});
	});
	
	var b2 = Titanium.UI.createButton({
		image : "/images/glyphicons_012_heart.png",
		left:20
	})
	var isfav = function(identifier) {
		var personal = require("/helpers/LocalStorage").getObject("personal");
		if (!personal || personal == null) return false;
		for (var i=0; i < personal.length; i++) {
			if (personal[i].identifier == identifier) {
				return true;
			}
		}
		return false;
	}
	
	var like = function() {
		if (isfav(identifier) == false) {
			var newitem = require("/helpers/LocalStorage").getObject("search")[cnt];
			var personal = require("/helpers/LocalStorage").getObject("personal");
			if (!personal || personal == null) personal = [];
			personal.push(newitem);
			require("/helpers/LocalStorage").setObject("personal",personal);
			alert("Added to your personal Museum");
		}
	}
	b2.addEventListener("click",like);
	
	var currentlink = "";
	var addcomment = function(e) {
		var v = Ti.UI.createWindow({
		});
		var v1 = Ti.UI.createView({
			width : '80%',
			height : '80%'
		});
		var v2 = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			backgroundColor : "#000000"
		});
		v2.add(Ti.UI.createLabel({
			text : 'Post a comment',
			top:15,left:25,height:50,width:300,
			font : {
				fontSize : 32,
				fontFamily : "STHeitiTC-Medium"
			},
			color : "#ffffff"
		}))
		var srch = Ti.UI.createTextArea({
			top:60,left:25,height:200,width:500,
			font : {
				fontSize : 32,
				fontFamily : "STHeitiTC-Medium"
			},
			backgroundColor : '#ffffff'
		});
		v2.add(srch);
		var addlink_btn = Ti.UI.createButton({
			top:60,right:25,height:50,width:250,
			font : {
				fontSize : 32,
				fontFamily : "STHeitiTC-Medium"
			},
			color : "#000000",
			title : 'Post Comment',
			backgroundColor : '#000000'
		});
		v2.add(addlink_btn);
		var addlinkfn = function() {
			var _data = {
				action : "json-addlink-rijksmuseum",
				a : identifier,
				b : "",
				type : "comment",
				comment : srch.value
			};
			ajax.getdata({
				url : "http://jon651.glimworm.com/europeana/eu.php",
				data : _data,
				fn : function(e1) {
					Titanium.API.info(e1);
					alert("post added");
					table.fireEvent("updateLinks",{links:e1.links});
					showfront();
				},
				err : function(e1) {
					Titanium.API.info(e1);
					alert("There was an error adding the link");
				}
			});
			
			
		};
		addlink_btn.addEventListener('click',addlinkfn);
		var bgc = Ti.UI.createButton({
			title : 'X'
		});
		bgc.addEventListener('click',function(e){
			v.close();
		})
		
		
		var bar = Titanium.UI.iOS.createToolbar({
			top:0,right:0,left:0,height:40,
			items : [bgc],
			barColor : "#000000",
			borderTop:true,
		    borderBottom:false
		});
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


	};
	
	var currentlink = "";
	var POPWEBSMALL = function(URI) {
		
		var URL = URI;
		
		var vminus1 = Ti.UI.createWindow({
			width : '100%',
			height : '1000%',
			backgroundColor: "#000",
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
			backgroundColor : '#ffffff'
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
					search.value = "http://"+search.value
				}
				showfront();
				web.setUrl(search.value);
			}
		};
		bgo.addEventListener('click',bgo_fn);
		search.addEventListener('enter',bgo_fn);
		search.addEventListener('return',bgo_fn);

		var bgf = Ti.UI.createButton({
			image : 'images/glyphicons_212_right_arrow.png'
		});
		bgf.addEventListener('click',function(e){
			showfront();
			web.goForward();
		})

		var bgb = Ti.UI.createButton({
			image : 'images/glyphicons_212_left_arrow.png'
		});
		bgb.addEventListener('click',function(e){
			showfront();
			web.goBack();
		})
		var bgc = Ti.UI.createButton({
			image:'/images/close1.png'
		});
		bgc.addEventListener('click',function(e){
			v.close();
			vminus1.close();
		})
		
		var bgemp11 = Ti.UI.createButton({
			image : '',
			width:800
		});
		
		var bar = Titanium.UI.iOS.createToolbar({
			top:0,right:0,left:0,height:Ti.UI.SIZE,
			items : [bgb,bgf,bgemp11,bgc],
			barColor : "#000000",
			borderTop:true,
		    borderBottom:false
		    
		});
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
		
		
	}
	
	var addlink = function(e) {
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
		
		//alert(searchtitlez);
		
		var URL = e.url;
		if (!URL || URL == "") URL = fullthingy;
		
		var vminus1 = Ti.UI.createWindow({
			width : '100%',
			height : '1000%',
			backgroundColor: "#000",
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
			backgroundColor : '#ffffff'
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
					search.value = "http://"+search.value
				}
				showfront();
				web.setUrl(search.value);
			}
		};
		bgo.addEventListener('click',bgo_fn);
		search.addEventListener('enter',bgo_fn);
		search.addEventListener('return',bgo_fn);

		var bgf = Ti.UI.createButton({
			image : 'images/glyphicons_212_right_arrow.png'
		});
		bgf.addEventListener('click',function(e){
			showfront();
			web.goForward();
		})

		var bgb = Ti.UI.createButton({
			image : 'images/glyphicons_212_left_arrow.png'
		});
		bgb.addEventListener('click',function(e){
			showfront();
			web.goBack();
		})
		/*var bgl = Ti.UI.createImageView({
			image : 'images/glyphicons_050_link.png',
			top:15,left:40
		});*/
		var bgemp = Ti.UI.createButton({
			image : '',
			width:2
		});
		var bgyu = Ti.UI.createButton({
			image : 'images/glyphicons_382_youtube1.png'
		});
		
		var bgfli = Ti.UI.createButton({
			image : 'images/glyphicons_395_flickr.png'
		});
		
		var bgpin = Ti.UI.createButton({
			image : 'images/glyphicons_360_pinterest1.png'
		});
		
		var bggoo = Ti.UI.createButton({
			image : 'images/glyphicons_362_google1.png'
		});
		
		/* the search part */
		var lnk = (search.value);
		var v2 = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			backgroundColor : "#000000"
		});
		v2.add(Ti.UI.createLabel({
			text : 'Describe this link',
			top:15,left:25,height:50,width:300,
			font : {
				fontSize : 32,
				fontFamily : "STHeitiTC-Medium"
			},
			color : "#ffffff"
		}));
		
		var srch = Ti.UI.createTextField({
			top:57,left:26,height:50,width:490,
			font : {
				fontSize : 32,
				fontFamily : "STHeitiTC-Medium"
			},
			backgroundColor : '#ffffff'
		});
		v2.add(srch);
		v2.add(Ti.UI.createLabel({
			text : 'What does it describe?',
			top:140,left:25,height:50,width:600,
			font : {
				fontSize : 32,
				fontFamily : "STHeitiTC-Medium"
			},
			color : "#ffffff"
		}));
		
		var vals = ['What','Where','When','Who','General link'];
		var valarray = [];
		var TYP = "";		
		var selectlabel2 = function(xval) {
			TYP = xval;
			for (var i=0; i < valarray.length; i++) {
				if (valarray[i].xval == xval) {
					valarray[i].color = "#000000"
					valarray[i].backgroundColor = "#ffffff"
					
				} else {
					valarray[i].color = "#ffffff"
					valarray[i].backgroundColor = "#000000"
				}
			}
		}
		
		bggoo.addEventListener('click',function(e){
			//alert("a");
			search.value = "http://www.google.nl";
			web.setUrl(search.value);
		});
		bgyu.addEventListener('click',function(e){
			//alert("a");
			search.value = "http://www.youtube.com/?nomobile=1";
			web.setUrl(search.value);
		});
		bgfli.addEventListener('click',function(e){
			//alert("a");
			search.value = "http://www.flickr.com";
			web.setUrl(search.value);
		});
		bgpin.addEventListener('click',function(e){
			//alert("a");
			search.value = "http://www.pinterest.com";
			web.setUrl(search.value);
		});
		
		var selectlabel = function(e) {
			selectlabel2(e.source.xval);
			
		}
		for (var i=0; i < vals.length; i++) {
			var lbl = Ti.UI.createLabel({
				top:0,left:(i*150+13),height:50, width : 145,
				textAlign:'center',
				color : "#cccccc",
				borderRadius : 10,
				borderColor : "#333333",
				borderWidth : 1,
				font : {
					fontSize : 24,
					fontFamily : "STHeitiTC-Medium"
				},
				text : " "+vals[i]+" ",
				xi : i,
				xval : vals[i]
			});
			lbl.addEventListener('click',selectlabel);
			valarray.push(lbl);
		}
		
		var sel = Ti.UI.createView({
			top:190,left:15,height:100,width:810
		});
		
		for (var i=0; i < valarray.length; i++) {
			sel.add(valarray[i]);
		}
		v2.add(sel);
		var addlink_btn = Ti.UI.createButton({
			top:57,right:40,height:50,width:227,
			font : {
				fontSize : 32,
				fontFamily : "STHeitiTC-Medium"
			},
			color : "#000000",
			title : 'Add Link',
			backgroundColor : '#000000'
		});
		v2.add(addlink_btn);
		var addlinkfn = function() {
			if (TYP == null || TYP == "" || search.value == "") {
				alert("You need to write a description and also indicate what it describes (WHAT,WHERE,WHEN,WHO,GENERAL) before adding the link");
				return;
			}
			var _data = {
				action : "json-addlink-rijksmuseum",
				a : identifier,
				b : search.value,
				type : TYP,
				comment : srch.value
			};
			ajax.getdata({
				url : "http://jon651.glimworm.com/europeana/eu.php",
				data : _data,
				fn : function(e1) {
					Titanium.API.info(e1);
					table.fireEvent("updateLinks",{links:e1.links});
					alert("link added");
					showfront();
				},
				err : function(e1) {
					Titanium.API.info(e1);
					alert("There was an error adding the link");
				}
			});
			
			
		};
		addlink_btn.addEventListener('click',addlinkfn);
		
		var current = "v1";
		var showfront = function() {
			if (current == "v2") {
				vb.animate({view:web,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
				current = "v1";
			}
		}

		var bgc = Ti.UI.createButton({
			image:'/images/close1.png'
		});
		bgc.addEventListener('click',function(e){
			v.close();
			vminus1.close();
		})
		
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
			width:11
		});
		var bgemp3 = Ti.UI.createButton({
			image : '',
			width:12
		});
		var bgemp4 = Ti.UI.createButton({
			image : '',
			width:20
		});
		
		var bar = Titanium.UI.iOS.createToolbar({
			top:0,right:0,left:0,height:Ti.UI.SIZE,
			items : [bgb,bgf,search,bgo,bgemp11,bgyu,bgemp1,bgpin,bgemp2,bggoo,bgemp3,bgfli,bgemp4,bgc],
			barColor : "#000000",
			borderTop:true,
		    borderBottom:false
		    
		});
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
		
		var webover = Ti.UI.createImageView({
			right:10,bottom:10,image:'/images/button_connect_large.png'
		});
		
		webover.addEventListener('click',function(e){
			if (current == "v1") {
				vb.animate({view:v2,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
				docTitle = web.evalJS('document.title');
				srch.value = docTitle;
				current = "v2";
			} else {
				vb.animate({view:web,transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
				current = "v1";
			}
		});
		
		
		web.addEventListener('load',function(e){
			search.value = e.url;
		})
		
		v1.add(bar);
		v1.add(vb);
		vb.add(web);
		vb.add(webover);
		v0.add(v1);
		v.add(v0);
		vminus1.open();
		v.open();
		
		
	}
	var b3 = Titanium.UI.createButton({
		image : "/images/glyphicons_050_link.png"
	})
	b3.addEventListener("click",addlink);
	var b3a = Titanium.UI.createButton({
		image : "/images/glyphicons_151_edit.png"
	})
	b3a.addEventListener("click",addcomment);

	var b31 = Titanium.UI.createButton({
		image : "/images/glyphicons_377_linked_in.png"
	})
	
	var botbar = Titanium.UI.iOS.createToolbar({
		bottom:0,right:0,height:40,
		items : [],
		barColor : "#000000",
		borderTop:true,
	    borderBottom:false
	})	
	self.add(botbar);

	var path = null;
	var endlabel = "";
	
	var ajax = require("/helpers/ajax");
	var _data = {};
	_data.identifier = identifier;
	_data.action = "json-get";
	
	
	ajax.getdata({
		url : "http://jon651.glimworm.com/europeana/eu.php?action=json-get&identifier="+identifier,
		fn : function(e) {
			Ti.API.info(e);
			searchtitle = e.data["title"];
			Ti.API.debug(e);
			var img = Titanium.UI.createImageView({
				left:0,top:40,height:200,right:0,
				backgroundColor:"#fff",
				image : e.data["image"]	//.thumbsrc
			});

			var txt = Titanium.UI.createLabel({
				top:20,
				height : 'auto',
				font : {
					fontSize : 16,
					fontFamily : "STHeitiTC-Medium"
				},
				text : e.data["title"]+"\n"+e.data["description"],	//.description
				enableZoomControls :true
			});		
			
			botbar.title = e.data.provider;
			var view = Titanium.UI.createView({
				top:44,left:0,bottom:40,width:600
			});
			var view2 = Titanium.UI.createView({
				top:160,left:600,bottom:40,right:0,height:400
			});
			var view3 = Titanium.UI.createView({
				top:44,left:600,bottom:40,right:0,backgroundColor:"#000000"
			});
			var view4 = Titanium.UI.createView({
				top:620,left:600,bottom:40,right:0,backgroundColor:"#000000"
			});
			
			table = Ti.UI.createTableView({
				backgroundColor : "#000000",
				separatorColor : "#000000"
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
			})
						
			var vals = ['what','where','when','who','general link','comment'];

			var updateLinks = function(links) {
				var vals = ['what','where','when','who','general link','comment'];
				var rows = [];
				
				var secv1 = Ti.UI.createView({
						height : 30,
						backgroundColor : "#333333"
				});
				secv1.add(Ti.UI.createLabel({
					color : "#ffffff",
					height : Ti.UI.SIZE,
					textAlign: "left",
					width:425,
					left:5,
					top:7,
					font : {
						fontSize : 16,
						fontFamily : "STHeitiTC-Medium"
					},
					color : "#ffffff",
					text : 'ABOUT'
				}));
				var sec1 = Ti.UI.createTableViewSection({
					headerView : secv1
				});
				var row1 = Ti.UI.createTableViewRow({
					height:Ti.UI.SIZE,
					layout:'vertical'
				});
				var rowv1 = Ti.UI.createView({
					backgroundColor : "#000000",
					height : Ti.UI.SIZE,
					top:10, bottom:10,
					width:425,
					layout: 'vertical'
				});
				var lblrow1=Ti.UI.createLabel({
					text:Currenttitle,
					color:"#fff",
					font : {
						fontSize : 20,
						fontFamily : "STHeitiTC-Medium",
						fontStyle : 'bold'
					},
					height:Ti.UI.SIZE,
					left:20,right:10,top:0
				});
				
				var lblrow2=Ti.UI.createLabel({
					text:Currenttitle1,
					color:"#fff",
					font : {
						fontSize : 16,
						fontFamily : "STHeitiTC-Medium"
					},
					height:Ti.UI.SIZE,
					left:20,right:15,top:5
				});
				
				var lblrow3=Ti.UI.createLabel({
					text:Currenttitle2,
					color:"#fff",
					font : {
						fontSize : 16,
						fontFamily : "STHeitiTC-Medium"
					},
					height:Ti.UI.SIZE,
					left:17,right:15,top:5
				});
				rowv1.add(lblrow1);
				rowv1.add(lblrow2);
				rowv1.add(lblrow3);
				row1.add(rowv1);
				sec1.add(row1);
				rows.push(sec1);
				
				for (var i=0; i < ExtraButtons.length; i++) {
					var button = ExtraButtons[i];
					//button.title
					//button.url
					var row1 = Ti.UI.createTableViewRow({
						height:Ti.UI.SIZE,
						xsurl : button.url,
						layout:'vertical'
					});
					var rowv1 = Ti.UI.createView({
						backgroundColor : "#000000",
						height : Ti.UI.SIZE,
						top:10, bottom:10,
						width:425,
						layout: 'vertical'
					});
					
					var lblrow14 = Ti.UI.createView({
						backgroundImage:'/images/butbg.png',
						borderRadius : 5,
						height:32,
						left:17,right:20,top:0
					});
					var lblrow4 = Ti.UI.createLabel({
						text:button.title,
						color:"#fff",
						font : {
							fontSize : 16,
							fontFamily : "STHeitiTC-Medium"
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
				
				for (var i=0; i < vals.length; i++) {
					var secv = Ti.UI.createView({
						height : 30,
						backgroundColor : "#333333"
					});
					secv.add(Ti.UI.createLabel({
						color : "#ffffff",
						height : Ti.UI.SIZE,
						textAlign: "left",
						width:425,
						left:5,
						top:7,
						font : {
							fontSize : 16,
							fontFamily : "STHeitiTC-Medium"
						},
						color : "#ffffff",
						text : vals[i].toUpperCase()
					}));
					var sec = Ti.UI.createTableViewSection({
						headerView : secv
					});
					var cnt = 0;
					for (var l=0; l < links.length; l++) {
						if (links[l].type == vals[i]) {
							cnt++;
							var row = Ti.UI.createTableViewRow({
								xurl : links[l].url
							});
							var rv = Ti.UI.createView({
								backgroundColor : "#000000",
								height : Ti.UI.SIZE,
								top:10, bottom:10,
								width:425
							});
							row.add(rv);
							rv.add(Ti.UI.createLabel({
								color : "#ffffff",
								height : Ti.UI.SIZE,
								textAlign: "left",
								width:425,
								left:50,
								font : {
									fontSize : 16,
									fontWeight: "bold",
									fontFamily : "STHeitiTC-Medium"
								},
								text : (links[l].comment != "") ? links[l].comment : links[l].url								
							}));
							rv.add(Ti.UI.createImageView({
								left:20,
								top:0,
								height:15,width:15,
								image: "/images/button_connect_small.png" 
							}));
							sec.add(row);
						}
					}
					if (cnt > 0) {
						rows.push(sec);
					}
				}
				table.setData(rows);
			}
			Currenttitle=e.data["title"];
			Currenttitle1=e.data["description"];
			Currenttitle2=e.data["creator"];
			ExtraButtons = e.data1.buts;
			updateLinks(e.data1.links);
			var updateLinksFn = function(e) {
				updateLinks(e.links);
			}
			table.addEventListener("updateLinks",updateLinksFn);

			self.add(view);
			self.add(view3);
			self.add(view4);
			var btn121 = Ti.UI.createImageView({
				width:24,
				left:60,
				top:10,
				height:24,
				image: "images/glyphicons_012_heart.png"
			});
			var btn122 = Ti.UI.createImageView({
				width:24,
				left:157,
				top:10,
				height:24,
				image: "images/glyphicons_050_link.png"				
			});
			var btn123 = Ti.UI.createImageView({
				width:24,
				left:240,
				top:10,
				height:24,
				image: "images/glyphicons_151_edit.png"
				
			});
			
			var btn124 = Ti.UI.createImageView({
				left:344,
				top:12,
				image: "images/glyphicons_326_sharet.png"
			});
			
			var lbl121 = Ti.UI.createLabel({
				color : "#ffffff",
				height : Ti.UI.SIZE,
				textAlign: "left",
				width:300,
				left:30,
				top:55,
				font : {
					fontSize : 16,
					fontWeight: "bold",
					fontFamily : "STHeitiTC-Medium"
				},
				text : "FAVOURITE"
				
			});
			var lbl122 = Ti.UI.createLabel({
				color : "#ffffff",
				height : Ti.UI.SIZE,
				textAlign: "left",
				width:300,
				left:145,
				top:55,
				font : {
					fontSize : 16,
					fontWeight: "bold",
					fontFamily : "STHeitiTC-Medium"
				},
				text : "WWW"
				
			});
			var lbl123 = Ti.UI.createLabel({
				color : "#ffffff",
				height : Ti.UI.SIZE,
				textAlign: "left",
				width:300,
				left:210,
				top:55,
				font : {
					fontSize : 16,
					fontWeight: "bold",
					fontFamily : "STHeitiTC-Medium"
				},
				text : "COMMENT"
				
			});
			var lbl124 = Ti.UI.createLabel({
				color : "#ffffff",
				height : Ti.UI.SIZE,
				textAlign: "center",
				width:100,
				left:305,
				top:55,
				font : {
					fontSize : 16,
					fontWeight: "bold",
					fontFamily : "STHeitiTC-Medium"
				},
				text : "SHARE"
				
			});
			view4.add(lbl121);
			view4.add(lbl122);
			view4.add(lbl123);
			view4.add(lbl124);
			view4.add(btn121);
			view4.add(btn122);
			view4.add(btn123);
			view4.add(btn124);
			
			var poper = function(){
				var self = Titanium.UI.createOptionDialog({
			        cancel: 2,
			        options: ['share on Facebook', 'share on Twitter', 'cancel',''],
			        message: 'testing version no. ',
			        title: 'Options',
			    });
			    //alert("b");
			   self.addEventListener('click',function(e) {
			        if (e.index == 0) {
			            require("/helpers/share").facebook("","","");
			        }
			        else if (e.index == 1) {
				        require("/helpers/share").tweet("","","");
			        }
			        else if (e.index == 2) {
			        }
			    });
			    self.show();
			    return self;
			};
			
			btn121.addEventListener("click",like);
			btn122.addEventListener("click",addlink);
			btn123.addEventListener("click",addcomment);
			btn124.addEventListener("click",function(e){
				//winclose();
				//Titanium.App.fireEvent("redisplay-personal",{});
				poper();
			});
			
			var secthing = Ti.UI.createView({
					height : 30,
					backgroundColor : "#333333",
					top:0,left:0,width:425
			});
			secthing.add(Ti.UI.createLabel({
					font : {
						fontSize : 16,
						fontFamily : "STHeitiTC-Medium"
					},
					color : "#ffffff",
					text : "INSTRUCTIONS",
					left:10
			}));
			view3.add(Ti.UI.createLabel({
					font : {
						fontSize : 16,
						fontFamily : "STHeitiTC-Medium"
					},
					color : "#ffffff",
					//text : "Weclome to the Muse- Your Personal Mobile Museurm powered by the Rijksmuseum API and Glimworm IT Search and browse the Rijksmuseum collection quickly. Collect related links from Wikipedia and the web. Post comments about the art for others to read. Add art works to your personal museum.",
					text : "* Search and browse the Rijksmuseum collection.\n* Collect related links from Wikipedia and the web.\n* Post comments about the art for others to read.\n* Add art works to your personal museum.",
					top:40, left:10, right:10, width:425, textAlign:"left"
			}));
			
			var popDemo = function(KEY){
				var xhtml = "<html><head><style type='text/css'>body{background-color:black;margin:0;}iframe{margin:0;}</style></head><body><iframe width='100%' height='100%' src='"+KEY+"' frameborder='0' allowfullscreen></iframe></body></html>";
				
				var xview = Titanium.UI.createWindow({
					width : '80%',
					height : '80%',
					top: '10%',
					left: '10%',
					backgroundColor: 'transparent'
				});
				
				var xhtmlview = Titanium.UI.createWebView({
					width:'95%',
					height:'95%',
					html: xhtml
				});
				
				var ximg = Titanium.UI.createImageView({
					width:25,
					height:25,
					top:5,
					left:10,
					image:'/images/close.png'
				});
				
				xview.add(xhtmlview);
				xview.add(ximg);
				xview.open();
				
				ximg.addEventListener('click',function(){
					xview.close();
				});
			};
			
			var demobut = Ti.UI.createButton({
					title: 'View Demo',
					right:10, width:100, height:20, backgroundColor: "#333333", color:"#000000", borderRadius: 0
			});
			secthing.add(demobut);
			demobut.addEventListener('click',function(e){
				popDemo("http://www.youtube.com/embed/hjHdBTDzlrI");
				//Titanium.Platform.openURL('http://mobilemuseum.eu');
			});
			view3.add(secthing);
			
			self.add(view2);
			
			var html = "";
			html += "<html><head></head><body TOPMARGIN='0' LEFTMARGIN='0' MARGINHEIGHT='0' MARGINWIDTH='0' style='background-color:#000;'>";
//			html += "<img src='"+ e.data["image"]+"' style='border:0;padding:0;margin:0;' width='100%'>";
			html += "<img src='"+ e.data["image"]+"' style='border:0;padding:0;margin:0;'>";
			html += "</body></html>";
			
			html = "<img src='"+ e.data["image"]+"' style='border:0;padding:0;margin:0;' width='100%'>";
			

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

			var wv = Titanium.UI.createWebView({
				left:0,top:0, 
				width:  Ti.UI.FILL,
				height : Ti.UI.FILL,
				scalesPageToFit:true,
				touchEnabled : true,
				html : html
			});
			view.add(wv);
			
			var optpush = function(arr,item) {
				for (var i=0; i < arr.length; i++) {
					if (arr[i] == item) return arr;
				}
				arr.push(item);
				return arr;
			}
			var displayPath = function(ARR) {
				var view0 = Titanium.UI.createView({
					top:00,bottom:200,left:0,right:0, layout : 'vertical',
					borderColor:'#333'
//					borderRadius:20
				});
				var matched = [];
				for (var i=0; i < path.length; i++) { matched.push(true) }
				
				
				var lbl0h = Titanium.UI.createLabel({text:" How You Are Connected to "+e.data.title ,backgroundColor:"#333",color:"#fff",left:0,right:0,height:50,top:0,font : {fontFamily : "STHeitiTC-Medium"}});
				view0.add(lbl0h);
				
				var lbl0 = Titanium.UI.createLabel({text:"You",height:40,top:5,font : {fontSize:20, fontFamily : "STHeitiTC-Medium"}});
				lbl0.addEventListener("click",function(e) {
					ARR = [];
					displayPath(ARR);
				})
				view0.add(lbl0);
				
				
				
				for (var i=0; i < ARR.length; i++) {
					view0.add(Titanium.UI.createLabel({text:ARR[i],height:20,top:5,font : {fontFamily : "STHeitiTC-Medium"}}));
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
					var lbl = Titanium.UI.createLabel({color : "#00f",text:list[i],height:20,top:5,font : {fontFamily : "STHeitiTC-Medium"}});
					lbl.addEventListener("click",function(e) {
						ARR.push(e.source.text);
						displayPath(ARR);
					})
					view0.add(lbl);
				}
				view0.add(Titanium.UI.createImageView({image:"/images/icon_arrow_green_down_15x18.gif",height:20,width:20}));
				view0.add(Titanium.UI.createLabel({text:"("+(shortest - ARR.length)+")"}));
				view0.add(Titanium.UI.createLabel({text:e.data.title,height:20,top:5,font : {fontFamily : "STHeitiTC-Medium"}}));
				if (view2.children && view2.children.length > 0) {
					view2.remove(view2.children[0]);
				}
				view2.add(view0);
			}			
			
			
			// var txt = Titanium.UI.createLabel({
				// bottom:10,
				// height : 20,
				// text : "AUTO SUGGESTIONS FROM METADATA",
				// color : "#00f",
				// font : {fontFamily : "STHeitiTC-Medium"}
			// })
			// view.add(txt);
			
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
						font : {fontFamily : "STHeitiTC-Medium"}
					})
					view.add(txt);
					
					
					var s = require("/helpers/LocalStorage").getString("myself");
					var ss = s.split("/");
					var myid = ss[ss.length-1];
					ajax.getdata({
						url : "http://aws2.glimworm.com/api.php?action=json-path&from="+myid+"&to="+nodenum,
						fn : function(e1) {
							Titanium.API.info(e1);
							var txt1 = Titanium.UI.createLabel({
								bottom:40,
								height : 150,
								text : e1.data.txt,
								font : {fontFamily : "STHeitiTC-Medium"}
							})
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
						font : {fontFamily : "STHeitiTC-Medium"}
					})
					view.add(txt);
					
				} else if (s.indexOf("CON") == 0) {
					var txt = Titanium.UI.createLabel({
						bottom:10,
						height : 20,
						text : s,
						font : {fontFamily : "STHeitiTC-Medium"}
					})
					view.add(txt);
					
				}
			}
			
		}
	})
	var displayhelp1 = function() {
		var x = Ti.UI.createWindow({
		});
		x.add(Ti.UI.createView({
			top:0,left:0,height:Ti.UI.FILL,width:Ti.UI.FILL,backgroundColor:"#333333",opacity:0.4
		}));
		x.add(Ti.UI.createImageView({
			top:0,left:0,height:Ti.UI.FILL,width:Ti.UI.FILL,
			image : '/images/item-big.png'
		}));
		x.addEventListener('click',function(e) {
			x.close();
		});
		x.open();
//		alert(Titanium.Platform.osname+"\n"+Titanium.Platform.version+"\n"+Titanium.Platform.getModel());
		
	};
//	self.addEventListener('click', displayhelp);
	Titanium.App.addEventListener("display1-main-help",displayhelp1);
	//setTimeout(displayhelp1,1000);
	
	var uuid = require("/ui/common/globals").getuuid();
	
	globals.openmodalfull(self);		
	
}

module.exports = fn;
