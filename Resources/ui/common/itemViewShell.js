var globals = require('/ui/common/globals');
var css = require('/ui/common/css');

function fn(type,cnt) {
	
	var preview = function(identifier,cnt) {
//		var winClass = require("/ui/common/PreviewWindow");
		var winClass = require("/ui/common/PlayWindow");
		var preview_win = new winClass(identifier,cnt);
	}

	var click = function(e) {
		preview.call(this,e.source.xindent,e.source.xcnt);
	}
	
	if (type == 2) {
		var self = Titanium.UI.createView({
			left:20,top:20,
			width:350, height:190,backgroundColor : "transparent", borderColor : "#fff", borderWidth:0
		})
		function clearthisA(e) {
			try {
				self.remove(self.children[0]);
			} catch (e) {}
		}

		function loadthisA(e) {
			var item = e.item;
			try {
				self.remove(self.children[0]);
			} catch (e) {}

			var img = Titanium.UI.createImageView({
				left:0,top:0,
				width:350,
				height:250,
				image: item.enclosure,
				xcnt : cnt,
				xguid : item.guid,
				xindent: item.id
			})
			var img = Titanium.UI.createWebView({
				left:0,top:0,
				width:350,
				height:350,
				html : "<html><head></head><body TOPMARGIN='0' LEFTMARGIN='0' MARGINHEIGHT='0' MARGINWIDTH='0'><img src='"+item.enclosure+"' style='border:0;padding:0;margin:0;' width='350'></body></html>",
				xcnt : cnt,
				xguid : item.guid,
				xindent: item.id
			})

			img.addEventListener("click",click);
			
			var rt = Titanium.UI.createView({
				right:0,top:0,
				width:100, height:200,
				backgroundColor : "#666"
			})
		
			
			var txt = Titanium.UI.createScrollView({
				left:0,bottom:0,
			    contentWidth:'auto',
			    contentHeight:'auto',
				width:350, height:50,
				backgroundColor:"#000",
				opacity:0.7
			})
		
			var txt1 = Titanium.UI.createLabel({
				height:Ti.UI.SIZE,
				width : 300,
				left:20,
				color : "#fff",
				//text : "A"+item.title,
				text : item.title,
				font : {
					fontFamily : "STHeitiTC-Medium"
				}
			});
			
			var self2 = Titanium.UI.createView({
				left:0,right:0,width:350, height:190,backgroundColor : "#ffffff"
			})			
			self2.add(img);
//			self2.add(rt);
			self2.add(txt);
			txt.add(txt1);
			self.add(self2);
			
		}
		Titanium.App.addEventListener("load-"+cnt,loadthisA);
		Titanium.App.addEventListener("clearall",clearthisA);
		
		return self;
	} else {
		var self = Titanium.UI.createView({
			left:20,top:20,
			width:250, height:120,backgroundColor : "transparent", borderColor : "#00f", borderWidth:0
		})
		function clearthisB(e) {
			try {
				self.remove(self.children[0]);
			} catch (e) {}
		}
		function loadthisB(e) {
			var item = e.item;
			try {
				self.remove(self.children[0]);
			} catch (e) {}
			
			var img = Titanium.UI.createImageView({
				left:0,top:0,
				width:250,
				height:250,
				image: item.enclosure,
				xcnt : cnt,
				xguid : item.guid
			})
			var img = Titanium.UI.createWebView({
				left:0,top:0,
				width:250,
				height:250,
				html : "<html><head></head><body TOPMARGIN='0' LEFTMARGIN='0' MARGINHEIGHT='0' MARGINWIDTH='0'><img src='"+item.enclosure+"' style='border:0;padding:0;margin:0;' width='250'></body></html>",
				xcnt : cnt,
				xguid : item.guid
			})
			
			
			img.addEventListener("click",click);
			
			var txt = Titanium.UI.createScrollView({
				left:0,bottom:0,
			    contentWidth:'auto',
			    contentHeight:'auto',
				width:250, height:50,
				backgroundColor:"#000",
				opacity:0.7
			})
		
			var txt1 = Titanium.UI.createLabel({
				height:Ti.UI.SIZE,
				width : 200,
				color : "#fff",
				//text : "B"+item.title,
				text : item.title,
				font : {
					fontFamily : "STHeitiTC-Medium"
				}
			});
			
			var self2 = Titanium.UI.createView({
				left:0,right:0,top:0,bottom:0,backgroundColor : "#ffffff", opacity:0
			})			
			self2.add(img);
			self2.add(txt);
			txt.add(txt1);
			self.add(self2);
			self2.animate({opacity:1,duration:1500}, function() {});
		}
		Titanium.App.addEventListener("load-"+cnt,loadthisB);
		Titanium.App.addEventListener("clearall",clearthisB);

		return self;
		
	}
	
}

module.exports = fn;


