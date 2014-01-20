var globals = require('/ui/common/globals');
var css = require('/ui/common/css');

function fn(type,item,cnt,H) {

	var isfav = function(identifier) {
		var personal = require("/helpers/LocalStorage").getObject("personal");
		if (!personal || personal == null) return false;
		var personal_clean = [];
		for (var i=0; i < personal.length; i++) {
			if (personal[i] != null) {
				personal_clean.push(personal[i]);
			}
		}
		if (personal_clean.length != personal.length) {
			require("/helpers/LocalStorage").setObject("personal",personal_clean);
			personal = personal_clean;
		}
		for (var i=0; i < personal.length; i++) {
			try {
			if (personal[i].identifier == identifier) {
				return true;
			}
			if (personal[i].id == identifier) {
				return true;
			}
			} catch (E) {
				console.log("--------------------");
				console.log(E);
				console.log(personal);
				console.log("--------------------");
				
			}
 		}
		return false;
	};

	var rnd = Math.floor(Math.random() * 250)	
	var h120 = 90+rnd;
	var h190 = 90+rnd;
	if (H && H != null && H > 0) {
		h120 = H;
		h190 = H;
	}
	
	var thumbQuality = "20";
	if (globals.isAndroid()) {
		thumbQuality = "40";
	}
	
	
	if (type == 2) {
		var self = Titanium.UI.createView({
			left:20,top:20,
//			width:350, height:190,backgroundColor : css.DARKBACKGROUND,
//			left:0, top:0,
			touchEnabled : true,
			width:Ti.UI.FILL, 
			height: (require("/etc/config").format == "phone") ? globals.dpi(h190) : h190,
			backgroundColor : css.DARKBACKGROUND,
			xguid : item.guid,
			xindent: item.id,
			xtyp: item.type,
			ximage : require("/etc/config").timthumb+"?w=350&h=250&a=t&q="+thumbQuality+"&src="+item.enclosure,
			ximage_backup : item.enclosure,
			xinview : 0,
			xcnt : cnt
		});
		if (require("/etc/config").format == "phone") {
			self.left = 0;
		}
		
		var img = Titanium.UI.createImageView({
			left:0,top:0,
			width:Ti.UI.FILL,
			height: (require("/etc/config").format == "phone") ? globals.dpi(500) : 500,
//			height:250,
//			image : require("/etc/config").timthumb+"?w=350&h=250&a=t&q=20&src="+item.enclosure,
//			image : item.enclosure,
			ximage_backup : item.enclosure,
			image : '/images/10x10.gif',
			defaultImage :  '/images/10x10.gif',
			touchEnabled : false,
			xcnt : cnt,
			xguid : item.guid
		});
		
		
		function lazyA(e) {
			try {
				if (!self.children || self.children.length == 0 ) return;
				
				var s = self.rect;
				var p = self.getParent().rect;
				
				var x1 = p.x+s.x;
				var y1 = p.y+s.y;

				var x2 = p.x+s.x+s.width;
				var y2 = p.y+s.y+s.height;
				
				var inview = true;
				if (x2 < e.x ) inview = false;
				if (x1 > e.x+e.w ) inview = false;
				if (y2 < e.y ) inview = false;
				if (y1 > e.y+e.h ) inview = false;
				
				if (inview == true) {
//					self.borderWidth = 2;
//					self.borderColor = "#ff0000";	
					self.fireEvent("onscreen",{});	
				} else {
//					self.borderWidth = 2;					
//					self.borderColor = "#00ff00";					
					self.fireEvent("offscreen",{});				
				}

				
			} catch (E) {}
		}
		
		
		var loadimage = function(e) {
			lazyA(e);
		};
		var onscreen = function() {
			var _w = self.getSize().width;
			var _h = self.getSize().height;
			var _image  = require("/etc/config").timthumb+"?w="+_w+"&h="+_h+"&a=t&q="+thumbQuality+"&src="+img.ximage_backup;
			if (img.image != _image) {
				img.width = _w;
				img.height = _h;
				img.image  = _image;
				
				if (isfav(self.xindent)) {
					txtfav.text = 'F';
				} else {
					txtfav.text = 'G';
				}

				console.log(img.ximage_backup);
			}
		};
		var offscreen = function() {
			img.width = self.getSize().width;
			img.height = self.getSize().height;
			img.image = img.defaultImage;
		};

		var replace = function(e) {
			self.xguid = e.guid;
			self.xindent = e.id;
			self.xtyp = e.type;
			self.ximage_backup = e.enclosure;
			self.xcnt = e.xcnt;
			
			img.ximage_backup = e.enclosure;
			img.xcnt = e.xcnt;
			img.xguid = e.guid;
			
			onscreen();
		};

		var rt = Titanium.UI.createView({
			right:0,top:0,
			width:100, height:200,
			touchEnabled : false,
			backgroundColor : "#666"
		});
	
		
		var txt = Titanium.UI.createScrollView({
			left:0,bottom:0,
		    contentWidth:'auto',
		    contentHeight:'auto',
			width:Ti.UI.FILL, 
			height: (require("/etc/config").format == "phone") ? globals.dpi(50) : 50,
			backgroundColor:css.DARKBACKGROUND,
			touchEnabled : false,
			opacity:0.7
		});
	
		var txt1 = Titanium.UI.createLabel({
			top : '5%',
			left : '5%',
			height:Ti.UI.SIZE,
			width:'80%',
			color : css.VERYLIGHTCOLOUR,
			text : item.title,
			touchEnabled : false,
			font : {
				fontSize : (require("/etc/config").format == "phone") ? globals.dpi(12) : 12,
				fontFamily : "arial"
			}
		});
		
		var txtfav = Titanium.UI.createLabel({
			right : '5%',
			height:Ti.UI.SIZE,
			width : '10%',
			color : '#cc0000',
			text : '',
			touchEnabled : false,
			font : {
				fontSize : 18,
				fontFamily : (globals.isAndroid()) ? "europeana": "icomoon"
			}
		});
		
		var self2 = Titanium.UI.createView({
			touchEnabled : false,
			left:0,right:0,width:Ti.UI.FILL, 
			height: (require("/etc/config").format == "phone") ? globals.dpi(h190) : h190,
			backgroundColor : css.DARKBACKGROUND
		});	

		self2.add(img);
		self2.add(txt);
		txt.add(txt1);
//		txt.add(txtfav);
		self.add(self2);
					
		self.addEventListener('onscreen',onscreen);
		self.addEventListener('offscreen',offscreen);
		self.addEventListener('loadimage',loadimage);
		self.addEventListener('replace',replace);
		
		return self;
	} else {
		var self = Titanium.UI.createView({
			left:20,top:20,
//			width:250, height:120,backgroundColor : css.DARKBACKGROUND,
//			left:0, top:0,
			width:Ti.UI.FILL, 
			height: (require("/etc/config").format == "phone") ? globals.dpi(h120) : h120,
			backgroundColor : css.DARKBACKGROUND,
			xguid : item.guid,
			xindent: item.id,
			xtyp: item.type,
			xcnt : cnt
		});
		if (require("/etc/config").format == "phone") {
			self.left = 0;
		}
		

		var img = Titanium.UI.createImageView({
			left:0,top:0,
			width:Ti.UI.FILL,
			height: (require("/etc/config").format == "phone") ? globals.dpi(500) : 500,
//			height:250,
//			image : require("/etc/config").timthumb+"?w=350&h=250&a=t&q=20&src="+item.enclosure,
//			image : item.enclosure,
			ximage_backup : item.enclosure,
			image : '/images/10x10.gif',
			defaultImage :  '/images/10x10.gif',
//			borderWidth : 2,
//			borderColor : "#00ff00",
			touchEnabled : false,
			xcnt : cnt,
			xguid : item.guid
		});
		
		
		function lazyA(e) {
			try {
				if (!self.children || self.children.length == 0 ) return;
				
				var s = self.rect;
				var p = self.getParent().rect;
				
				var x1 = p.x+s.x;
				var y1 = p.y+s.y;

				var x2 = p.x+s.x+s.width;
				var y2 = p.y+s.y+s.height;
				
				var inview = true;
				if (x2 < e.x ) inview = false;
				if (x1 > e.x+e.w ) inview = false;
				if (y2 < e.y ) inview = false;
				if (y1 > e.y+e.h ) inview = false;
				
				if (inview == true) {
					// self.borderWidth = 2;					
					// self.borderColor = "#ff0000";	
					self.fireEvent("onscreen",{});	
				} else {
					// self.borderWidth = 2;					
					// self.borderColor = "#00ff00";					
					self.fireEvent("offscreen",{});				
				}

				
//				Ti.API.debug("S ex"+e.x + " ey"+e.y + " eh"+e.h + " ew"+e.w + " sx"+ s.x + " sy"+s.y + " sh"+s.height + " sw"+s.width);
//				Ti.API.debug("P ex"+e.x + " ey"+e.y + " eh"+e.h + " ew"+e.w + " sx"+ s.x + " sy"+s.y + " sh"+s.height + " sw"+s.width);
			} catch (E) {}
		}
		
		
		var loadimage = function(e) {
			lazyA(e);
		};
		var onscreen = function() {
			var _w = self.getSize().width;
			var _h = self.getSize().height;
			var _image  = require("/etc/config").timthumb+"?w="+_w+"&h="+_h+"&a=t&q="+thumbQuality+"&src="+img.ximage_backup;
			if (img.image != _image) {
				img.width = _w;
				img.height = _h;
				img.image  = _image;
				console.log(img.ximage_backup);

				if (isfav(self.xindent)) {
					txtfav.text = 'F';
				} else {
					txtfav.text = 'G';
				}
			}
		};
		var offscreen = function() {
			img.image = img.defaultImage;
		};
		var replace = function(e) {
			self.xguid = e.guid;
			self.xindent = e.id;
			self.xtyp = e.type;
			self.ximage_backup = e.enclosure;
			self.xcnt = e.xcnt;

			img.ximage_backup = e.enclosure;
			img.xcnt = e.xcnt;
			img.xguid = e.guid;

			onscreen();
		};

		/*
		var img = Titanium.UI.createImageView({
			left:0,top:0,
			width:250,
			height:250,
			touchEnabled : false,
			image: item.enclosure
		})
		var img = Titanium.UI.createWebView({
			left:0,top:0,
			width:250,
			height:250,
			html : "<html><head></head><body TOPMARGIN='0' LEFTMARGIN='0' MARGINHEIGHT='0' MARGINWIDTH='0'><img src='"+item.enclosure+"' style='border:0;padding:0;margin:0;' width='250'></body></html>",
			xcnt : cnt,
			touchEnabled : false,
			xguid : item.guid
		})
		*/
		
		var txt = Titanium.UI.createScrollView({
			left:0,bottom:0,
		    contentWidth:'auto',
		    contentHeight:'auto',
			width:Ti.UI.FILL, 
			height: (require("/etc/config").format == "phone") ? globals.dpi(50) : 50,
			backgroundColor:css.DARKBACKGROUND,
			opacity:0.7
		});
	
		var txt1 = Titanium.UI.createLabel({
			top : '5%',
			height:Ti.UI.SIZE,
			left : '5%',
			width:'80%',
			color : css.VERYLIGHTCOLOUR,
			text : item.title,
			touchEnabled : false,
			font : {
				fontSize : (require("/etc/config").format == "phone") ? globals.dpi(12) : 12,
				fontFamily : "arial"
			}
		});
		var txtfav = Titanium.UI.createLabel({
			right : '5%',
			height:Ti.UI.SIZE,
			width:'10%',
			color : '#cc0000',
			text : '',
			touchEnabled : false,
			font : {
				fontSize : 18,
				fontFamily : (globals.isAndroid()) ? "europeana": "icomoon"
			}
		});
		

		var self2 = Titanium.UI.createView({
			touchEnabled : false,
			left:0,right:0, width:Ti.UI.FILL, 
			height: (require("/etc/config").format == "phone") ? globals.dpi(h120) : h120,
			backgroundColor : css.DARKBACKGROUND
		});		

		self2.add(img);
		self2.add(txt);
		txt.add(txt1);
//		txt.add(txtfav);
		self.add(self2);
					
		self.addEventListener('onscreen',onscreen);
		self.addEventListener('offscreen',offscreen);
		self.addEventListener('loadimage',loadimage);
		self.addEventListener('replace',replace);
		
		return self;
		
	}
	
}

module.exports = fn;


