var globals = require('/ui/common/globals');
var css = require('/ui/common/css');

function fn(identifier) {

	var self = Titanium.UI.createWindow({
    	navBarHidden: true,
    	backgroundColor:"#000"
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
	


	var ajax = require("/helpers/ajax");
	var _data = {};
	_data.identifier = identifier;
	_data.action = "json-get";
	
	ajax.getdata({
		url : "http://aws2.glimworm.com/api.php",
		data : _data,
		fn : function(e) {
			Titanium.API.info(e);
			var img = Titanium.UI.createImageView({
				left:0,top:40,height:200,right:0,
				backgroundColor:"#000",
				image : e.data.thumbsrc
			});

			var txt = Titanium.UI.createLabel({
				top:220,
				height : 150,
				text : e.data.description
			})			
			
			self.add(img);
			img.addEventListener("click", winclose);
			
			self.add(txt);
			
			for (var i=0; i < e.data.suggestions.length; i++) {
				var s = e.data.suggestions[i];
				if (s.indexOf("FOUND NODE ") == 0) {
					Titanium.API.info(s);
					var node = s.substring(11);
					var nodenum = s.substring(54);
					Titanium.API.info(nodenum);
					Titanium.API.info(s);
					var txt = Titanium.UI.createLabel({
						bottom:10,
						height : 300,
						text : node + " / " + nodenum
					})
					self.add(txt);
					
					
					ajax.getdata({
						url : "http://aws2.glimworm.com/api.php?action=json-path&from=37777&to="+nodenum,
						fn : function(e1) {
							Titanium.API.info(e1);
							var txt1 = Titanium.UI.createLabel({
								bottom:40,
								height : 150,
								text : e1.data.txt
							})
							self.add(txt1);

							// for (var i=0; i < e1.data; i++) {
								// var path = e1.data[i];
								// var length = path.length;
								// for (var j=0; j < path.relationships.length; j++) {
// 									
								// }
							// }
							
						}
					});
				}
			}
			
		}
	})
	
	globals.openmodal(self);
	
}

module.exports = fn;
