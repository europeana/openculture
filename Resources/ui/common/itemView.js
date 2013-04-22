var globals = require('/ui/common/globals');
var css = require('/ui/common/css');

function fn(type,item) {
	
	if (type == 2) {
		var self = Titanium.UI.createView({
			left:20,top:20,
			width:350, height:190,backgroundColor : "#ffffff"
		})
		
		var img = Titanium.UI.createImageView({
			left:0,top:0,
			width:250,
			height:250,
			image: item.enclosure
		})
		var img = Titanium.UI.createWebView({
			left:0,top:0,
			width:350,
			height:350,
			html : "<html><head></head><body TOPMARGIN='0' LEFTMARGIN='0' MARGINHEIGHT='0' MARGINWIDTH='0'><img src='"+item.enclosure+"' style='border:0;padding:0;margin:0;' width='350'></body></html>",
			xcnt : cnt,
			xguid : item.guid
		})
		
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
			text : "C"+item.title,
			font : {
				fontFamily : "STHeitiTC-Medium"
			}
		});
		
		self.add(img);
		self.add(rt);
		self.add(txt);
		txt.add(txt1);
		return self;
	} else {
		var self = Titanium.UI.createView({
			left:20,top:20,
			width:250, height:120,backgroundColor : "#ffffff"
		})
		
		var img = Titanium.UI.createImageView({
			left:0,top:0,
			width:250,
			height:250,
			image: item.enclosure
		})
			var img = Titanium.UI.createWebView({
				left:0,top:0,
				width:250,
				height:250,
				html : "<html><head></head><body TOPMARGIN='0' LEFTMARGIN='0' MARGINHEIGHT='0' MARGINWIDTH='0'><img src='"+item.enclosure+"' style='border:0;padding:0;margin:0;' width='250'></body></html>",
				xcnt : cnt,
				xguid : item.guid
			})
		
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
		
		self.add(img);
		self.add(txt);
		txt.add(txt1);
		return self;
		
	}
	
}

module.exports = fn;


