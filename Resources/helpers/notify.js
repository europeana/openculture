exports.notifications = [];
exports.get = function() {
	return this.notifications;
}
exports.getrows = function() {

	function ago(ts) {
		var diff = Math.floor((now - ts)/1000);
		return diff+"s ago";
	}
	
	var now = new Date().getTime();
	var css = require('/ui/common/css');
	var globals = require('/ui/common/globals');
	var rows = [];
	var first = true;
	for (var i=(this.notifications.length-1) ; i >= 0; i--) {
		var row = Titanium.UI.createTableViewRow({
			height : 100,
			hasChild : true,
			selectionStyle : globals.globals.RowSelectionStyle,
			touchEnabled : true,
			className : 'control',
			leftImage : "/images/table/"+this.notifications[i].severity+".png"
		});
		var view = Titanium.UI.createView({
//			layout : 'vertical',
			left : 50,
			right : 0,
			height : 100
		});
		
		if (first == true) {
			row.height = 200;
			var view2 = Titanium.UI.createView({
	//			layout : 'vertical',
				left : 0,
				right : 0,
				height : 200
			});
			
			view.height = 200;
			view2.height = 200;
			view2.borderColor = "#f00";
			view2.borderRadius = 5;
			view2.borderWidth = 3;
			row.add(view2);
			first = false;
		}
		
		
		view.add(Titanium.UI.createLabel({
			left:0,
			top:0,
			height : 20,
			text : this.notifications[i].text,
			color : css.blue,
			font : {
				fontFamily : css.FONTFAMILY,
				fontSize : 15,
				fontWeight : "bold"
			}
		}));

		view.add(Titanium.UI.createLabel({
			left:0,
			top:20,
			height : 'auto',
			text : this.notifications[i].msg,
			color : '#000',
			font : {
				fontFamily : css.FONTFAMILY,
				fontSize : 15,
				fontWeight : "normal"
			}
		}));

		row.add(Titanium.UI.createLabel({
			right: 0,
			top: 0,
			width : 'auto',
			height:'auto',
			text : ago(this.notifications[i].ts),
			color : css.blue,
			font : {
				fontFamily : css.FONTFAMILY,
				fontSize : 15,
				fontWeight : "bold"
			}
		}));
		
		row.add(view);
		rows.push(row);
	}	
	return rows;
};

exports.add = function(SEVERITY,TXT,MSG) {
	this.notifications.push({
		ts : new Date().getTime(),
		text : TXT,
		msg : MSG,
		severity : SEVERITY,
		acknowledged : 0
	});
};

exports.clear = function() {
	this.notifications = [];
};

exports.notify = function(SEVERITY,TEXT,MSG) {
	
	try {
		
		this.add(SEVERITY,TEXT,MSG);
		Ti.App.fireEvent("cition_notify",{cition_text:TEXT})
		return;

	} catch (e) {
		Ti.API.debug(e);
	}
	
};
