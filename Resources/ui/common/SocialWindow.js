var globals = require('/ui/common/globals');
var css = require('/ui/common/css');

function fn(img) {

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
	
	
	var b2 = Titanium.UI.createButton({
		image : "/images/glyphicons_349_fullscreen.png"
	})
	var preview = function() {
		var winClass = require("/ui/common/PlayWindow");
		var preview_win = new winClass(identifier);
	}
	b2.addEventListener("click", preview);
	
	var botbar = Titanium.UI.iOS.createToolbar({
		bottom:0,right:0,left:0,height:40,
		items : [b2],
		barColor : "#000000",
		borderTop:true,
	    borderBottom:false
	})	
	self.add(botbar);	
	
	
	
	var img = Titanium.UI.createImageView({
		left:0,top:40,height:200,right:0,
		backgroundColor:"#fff",
		image : img
	});

	self.add(img);
	img.addEventListener("click", winclose);

	
	globals.openmodal(self);
	
}

module.exports = fn;
