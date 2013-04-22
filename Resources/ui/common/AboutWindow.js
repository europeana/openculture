var globals = require('/ui/common/globals');
var css = require('/ui/common/css');
var ajax = require('/helpers/ajax');

function fn() {

	var self = Titanium.UI.createWindow({
    	navBarHidden: true,
    	backgroundColor:"#000"
	});

	var addlink = function() {
		var addWinClass = require("/ui/common/AddLinkWindow");
		var addWin = new addWinClass(require("/helpers/LocalStorage").getString("myself"),1)
	}

	var b1 = Titanium.UI.createButton({
		image : "/images/glyphicons_050_link.png"
	})
	b1.addEventListener("click", addlink);
	
	var topbar = Titanium.UI.iOS.createToolbar({
		top:0,right:0,left:0,height:40,
		items : [b1],
		barColor : "#000000",
		borderTop:false,
	    borderBottom:true
	})	
	self.add(topbar);

	
	
	var leftView = Titanium.UI.createView({
		width : 300,
		top:40,
		left : 0,
		height : '100%',
		borderWidth:0,
		borderColor : "#f00",
		layout : 'vertical'
	});
	
	var midView = Titanium.UI.createScrollView({
		contentHeight:'auto',
		contentWidth : 'auto',
		width : 600,
		top:40,
		left : 300,
		height : '100%',
		borderWidth:0,
		borderColor : "#0f0",
		layout : 'vertical'
	});
	var rightView = Titanium.UI.createView({
		left : 600,
		right : 0,
		height : '100%',
		borderWidth:1,
		borderColor : "#00f",
		layout : 'vertical'
	});
	
	var fld = Titanium.UI.createTextField({
		left:5,right:5,top:5,bottom:5,
		height : 20,
		autocorrect : false,
		autocapitalization : false,
		font : {
			fontFamily : "STHeitiTC-Medium"
		},
		value : require("/helpers/LocalStorage").getString("myusername"),
		backgroundColor : "#eeeeee"
	})
	var fldc = Titanium.UI.createLabel({
		left:5,right:5,top:5,height:'auto',color :"#fff",
		font : {
			fontFamily : "STHeitiTC-Medium"
		}
	});
	var getNodeByTitle = function(title,fn) {
		ajax.getdata({
			url : "http://aws2.glimworm.com/api.php",
			data : {action:"console-add-node",title:title,link:title,type:"person"},
			fn : function(e) {
				fn.call(this,e.data);
			}
		});
		
	}
	var getRelationships = function() {
		ajax.getdata({
			url : "http://aws2.glimworm.com/api.php",
			data : {
				action:"json-get-rel-out",
				from:require("/helpers/LocalStorage").getString("myself")
			},
			fn : function(e) {
				require("/helpers/LocalStorage").setObject("myrels",e.data.items);
				require("/helpers/LocalStorage").setObject("myrels1",e.data.items2);
				refreshrels.call(this);
			}
		});
		
	}
	var refreshme2 = function(node) {
		refreshme.call(this,node);
		getRelationships();
	}
	var refreshme = function(node) {
		if (node && node.self) {
			fldc.text = "Your ID is "+node.self;
			require("/helpers/LocalStorage").setString("myself",node.self);
			require("/helpers/LocalStorage").setObject("myselfobj",node);
		} else {
			fldc.text = "There is no node for "+require("/helpers/LocalStorage").getString("myusername")+node;
		}
	}

	var refreshrels = function() {
//		var rels = require("/helpers/LocalStorage").getObject("myrels");
		var rels = require("/helpers/LocalStorage").getObject("myrels1");
		var txt = "";
		var rows = [];
		for (var i=0; i < rels.length; i++) {
			txt += "Relationship to :"+rels[i].data.title;
			txt += "\n";
			var row = Titanium.UI.createTableViewRow({
				xlink : rels[i].data.lnk,
				backgroundColor:"#000",
				color : "#fff",
				height : 40,
				font : {
					fontFamily : "STHeitiTC-Medium"
				}
			})
			var lbl = Titanium.UI.createLabel({
				text : "Relationship to :"+rels[i].data.title,
				xlink : rels[i].data.lnk,
				color : "#fff",
				height : 'auto',
				font : {
					fontFamily : "STHeitiTC-Medium"
				}
			})
			row.add(lbl);
			
			rows.push(row);
		}
		midtab.setData(rows);
	}
	
	var getme = function() {
		require("/helpers/LocalStorage").setString("myusername",fld.getValue())
		var data = getNodeByTitle(fld.getValue(),refreshme2);
	}
	fld.addEventListener("return",getme);
	
	leftView.add(fld);
	leftView.add(fldc);
	refreshme(require("/helpers/LocalStorage").getObject("myselfobj"));
	
	// var fld1 = Titanium.UI.createTextField({
		// left:5,right:5,top:5,bottom:5,
		// autocorrect : false,
		// autocapitalization : false,
		// height : 20,
		// backgroundColor : "#eeeeee"
	// })
	// var fld1b = Titanium.UI.createButton({
		// left:5,right:5,top:5,bottom:5,
		// height:20,
		// title : 'ok'
	// })
	// var addlink = function() {
		// var addWinClass = require("/ui/common/AddLinkWindow");
		// var addWin = new addWinClass(require("/helpers/LocalStorage").getString("myself"),1)
	// }
	// fld1b.addEventListener("click",addlink);

	var midtxt = Titanium.UI.createLabel({
		height : 'auto',
		left:0, right:0,top:0,
		color : "#fff",
		font : {
			fontFamily : "STHeitiTC-Medium"
		}
	});
	midView.add(midtxt);

	var midtab = Titanium.UI.createTableView({
		height : 'auto',
		left:0, right:0,top:0,
		color : "#fff",
		backgroundColor : "#000",
		separatorColor :"#000",
		font : {
			fontFamily : "STHeitiTC-Medium"
		}
	});
	midView.add(midtab);

	// midView.add(fld1b);	

	// var fld2 = Titanium.UI.createTextField({
		// left:5,right:5,top:5,bottom:5,
		// height : 20,
		// autocorrect : false,
		// autocapitalization : false,
		// backgroundColor : "#eeeeee"
	// })
	// var fld2b = Titanium.UI.createButton({
		// left:5,right:5,top:5,bottom:5,
		// height:20,
		// title : 'ok'
	// })
	// var fld2c = Titanium.UI.createWebView({
		// left:5,right:5,top:5,bottom:5
	// })
	// var browse = function() {
		// fld2c.url = fld2.getValue();
	// }
	// var browseback = function() {
		// fld2.setValue(fld2c.getUrl());
	// }
	// fld2b.addEventListener("click",browse);
	// fld2.addEventListener("enter",browse);
	// fld2c.addEventListener("load",browseback);
	// rightView.add(fld2);
	// rightView.add(fld2b);	
	// rightView.add(fld2c);	


	
	self.add(leftView);
	self.add(midView);
//	self.add(rightView);
	return self;
	
}

module.exports = fn;
