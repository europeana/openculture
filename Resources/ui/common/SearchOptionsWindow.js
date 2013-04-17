var globals = require('/ui/common/globals');
var css = require('/ui/common/css');

function fn(identifier) {

	var self = Titanium.UI.createWindow({
    	navBarHidden: true,
    	backgroundColor:"#999"
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
	
	globals.openmodal(self);
	
}

module.exports = fn;
