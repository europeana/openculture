var globals = require('/ui/common/globals');
var css = require('/ui/common/css');
var ajax = require('/helpers/ajax');

function fn(from,TYPE) {

	var self = Titanium.UI.createWindow({
    	navBarHidden: true,
    	backgroundColor:"#fff"
	});
	var b1 = Titanium.UI.createButton({
		image : "/images/glyphicons_212_down_arrow.png"
	})
	var winclose = function(e) {
		self.close();
	}
	b1.addEventListener("click", winclose);

	var topbar = Titanium.UI.iOS.createToolbar({
		top:0,right:0,left:0,height:40,
		items : [b1],
		barColor : "#000000",
		borderTop:false,
	    borderBottom:true
	})	
	self.add(topbar);
	
	var view = Titanium.UI.createView({
		top:40,bottom:0,left:0,right:0,
		layout:'vertical'
	});
	self.add(view);
	
	view.add(Titanium.UI.createLabel({left:5,right:5,height:20,font : {fontFamily : "STHeitiTC-Medium"},text:"to:"}));
	var _to = Titanium.UI.createTextField({
		left:5,right:5,top:5,bottom:5,
		height : 20,
		autocorrect : false,
		autocapitalization : false,
		backgroundColor : "#eeeeee"
	});
	view.add(_to);
	var _fld2b = Titanium.UI.createButton({
		left:5,right:5,top:5,bottom:5,
		height:20,
		title : 'ok'
	})
	view.add(_fld2b);
	var browseNodes = function() {
		var TO = _to.getValue();
		if (TO.indexOf("http") == 0) {
			fld2c.url = TO;
		} else {
			ajax.getdata({
				url : "http://aws2.glimworm.com/api.php",
				data : {action:"console-get-node",title:TO},
				fn : function(e) {
					Titanium.API.info(e);
					if (e.data && e.data.self) {
						fld2c.url = e.data.self;
					} else {
						
					}
				}
			});
		}

	}
	_fld2b.addEventListener("click",browseNodes);
	_to.addEventListener("enter",browseNodes);	
	

	view.add(Titanium.UI.createLabel({left:5,right:5,height:20,font : {fontFamily : "STHeitiTC-Medium"},text:"Type:"}));
	var _type = Titanium.UI.createTextField({
		left:5,right:5,top:5,bottom:5,
		height : 20,
		autocorrect : false,
		autocapitalization : false,
		backgroundColor : "#eeeeee"
	});
	view.add(_type);

	view.add(Titanium.UI.createLabel({left:5,right:5,height:20,font : {fontFamily : "STHeitiTC-Medium"},text:"Label:"}));
	var _label = Titanium.UI.createTextField({
		left:5,right:5,top:5,bottom:5,
		height : 20,
		autocorrect : false,
		autocapitalization : false,
		backgroundColor : "#eeeeee"
	});
	view.add(_label);

	view.add(Titanium.UI.createLabel({left:5,right:5,height:20,font : {fontFamily : "STHeitiTC-Medium"},text:"URL:"}));

	var fld2 = Titanium.UI.createTextField({
		left:5,right:5,top:5,bottom:5,
		height : 20,
		autocorrect : false,
		autocapitalization : false,
		backgroundColor : "#eeeeee"
	})
	var fld2b = Titanium.UI.createButton({
		left:5,right:5,top:5,bottom:5,
		height:20,
		title : 'ADD'
	})
	var fld2c = Titanium.UI.createWebView({
		left:5,right:5,top:5,bottom:5
	})
	var browse = function() {
		var TO = fld2.getValue();
		if (TO.indexOf("http://aws2.glimworm.com") == 0) {
			// add link
			ajax.getdata({
				url : "http://aws2.glimworm.com/api.php",
				data : {action:"console-add-link",from:from, to:TO, type: _type.getValue()},
				fn : function(e) {
					winclose();
				}
			});
			
		} else {
			// add item
			//console-add-node
			ajax.getdata({
				url : "http://aws2.glimworm.com/api.php",
				data : {action:"console-add-node",title:TO, lnk:TO, type: _type.getValue()},
				fn : function(e) {
					Titanium.API.info(e);
					if (e.data && e.data.self) {
						fld2c.url = e.data.self;
					}
				}
			});
		}
	}
	var browseback = function() {
		fld2.setValue(fld2c.getUrl());
	}
	fld2b.addEventListener("click",browse);
//	fld2.addEventListener("enter",browse);
	fld2c.addEventListener("load",browseback);
	view.add(fld2);
	view.add(fld2b);	
	view.add(fld2c);		
	
	if (TYPE == 1) {
		globals.openmodal(self);
	} else {
		var transform3 = Titanium.UI.create2DMatrix();
		self.transform = transform3.rotate(-90);
		self.top = 130;
		self.left = 130;
		self.bottom = 130;
		self.right = 130;
		self.fullscreen = true;
		self.open();
	}
	
}

module.exports = fn;
