exports.WINGRAD2 =  {//this is the gradient
	type:'linear',
	colors:["#00a5df","#003a83"],
	startPoint:{x:0,y:0},
	endPoint:{x:0,y:'100%'},
	backFillStart:true
}
exports.TABGRAD =  {//this is the gradient
	type:'linear',
//	colors:["#A4B1C4","#788DAA"],
	colors:[{color:'#333333',offset:0},{color:'#666666',offset:0.02},{color:'#A4B1C4',offset:0.04},{color:'#788DAA',offset:0.98},{color:"#000000",offset:0.99}],
	startPoint:{x:0,y:0},
	endPoint:{x:0,y:'100%'},
	backFillStart:true
}

exports.BUTGRAD =  {//this is the gradient
	type:'linear',
//	colors:["788DAA","#A4B1C4"],
	colors:["#89A2C1","#486A9A"],
	startPoint:{x:0,y:'2%'},
	endPoint:{x:0,y:'98%'},
	backFillStart:true
}

exports.BLUEBUTTON_BG_GRADIENT =  {//this is the gradient
	type:'linear',
	colors:["#00a5df","#003a83"],
	startPoint:{x:0,y:'2%'},
	endPoint:{x:0,y:'98%'},
	backFillStart:true
}

exports.BARCOLOUR = "#00347D";
exports.blue = "#033181";
exports.lightblue = "#71A0B3";
exports.border = "#043282";

//exports.FONTFAMILY = "Helvetica Neue";

exports.FONTFAMILYPLAIN = "STHeitiTC-Light";
exports.FONTFAMILY = "STHeitiTC-Medium";
exports.fnt = {fontSize:12,fontWeight:'bold', fontFamily: this.FONTFAMILY};
exports.FONTFAMILY_NARROW = "Futura-CondensedMedium";

//"HelveticaNeue-CondensedBold";

exports.DARKBACKGROUND = "#000000";
exports.LIGHTCOLOUR = "#777777";
exports.VERYLIGHTCOLOUR = "#ffffff";
exports.POPUPBACKGROUND = "#ffffff";


exports.addWinBackground = function(obj) {
	obj.barColor = "#333";
	obj.backgroundImage = "/images/wallpaper_1_2560x1440.jpg";
};

exports.addViewBackground_sel = function(obj) {
	obj.backgroundColor = "#ccc";
//	obj.backgroundImage = "/images/wallpaper_1_2560x1440.jpg";
};
exports.addTabBackground_sel = function(obj) {
	obj.backgroundColor = null;
	obj.style = Titanium.UI.iPhone.SystemButtonStyle.PLAIN;
	obj.backgroundGradient = this.TABGRAD;	
	obj.borderWidth = 0;
	obj.borderColor = "#333333";
};

exports.addButBackground_sel = function(obj) {
	obj.backgroundColor = null;
	obj.height = 20;
//	obj.style = Titanium.UI.iPhone.SystemButtonStyle.BORDERED;
//	obj.color = "#6F839C";
	
	obj.style = Titanium.UI.iPhone.SystemButtonStyle.PLAIN;
	obj.backgroundGradient = this.BUTGRAD;	
	obj.borderColor = "#6F839C";
	obj.borderWidth = 1;
	obj.borderRadius = 2;
	obj.color = "#ffffff";
	obj.font = {fontFamily:'Arial',fontWeight:'bold',fontSize:14};

}

exports.addButBackground = function(obj) {
	obj.backgroundColor = null;
	obj.style = Titanium.UI.iPhone.SystemButtonStyle.PLAIN;
	obj.backgroundGradient = this.BUTGRAD;	
	obj.borderColor = "#666666";
	obj.borderWidth = 1;
	obj.borderRadius = 5;
	obj.height = 30;
}