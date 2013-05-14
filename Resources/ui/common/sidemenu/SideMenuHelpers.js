exports.config = {
	width : 400,
	tab1 : 20,
	tab2 : 40,
	tab3 : 70,
	tab4 : 340,
	tab5 : 360,
	tab6 : 380,
	bgc : "#333333",
	borderWidth : 0,	// make 1 for debug
	fontfamily : 'arial',
	fontfamilyicons : "icomoon",	//'icomoon',
	fontcolor : "#ffffff",
	fontcolor_filters : "#cccccc",
	fontcolor_normal : "#ffffff",
	fontsize : {
		h1 : 20,
		h2 : 16,
		normal : 16,
		iconplus : 20,
		iconminus : 20
	},
	colours : {
		spacer : "#666666"
	},
	textbox : {
		borderRadius : 5,
		height : 40,
		bgc : "#ffffff"
	}
}

exports.basicView = function() {	// basic view
	return Ti.UI.createView({
		backgroundColor : this.config.bgc,
		width : this.config.width,
		height : Ti.UI.SIZE,
		left : 0, 
		top: 0,
		borderWidth : this.config.borderWidth,
		borderColor : "#00cc00"
	});
}
exports.font = function(SIZE) {
	return {
		fontSize : SIZE,
		fontFamily : this.config.fontfamily
	}
}
exports.fonticons = function(SIZE) {
	return {
		fontSize : SIZE,
		fontFamily : this.config.fontfamilyicons
	}
}

exports.H1 = function(TEXT) {	// heading 1
	var self = this.basicView();
	self.top = 6;
	self.bottom = 6;

	self.add(Ti.UI.createLabel({
		text : TEXT,
		left : this.config.tab1,
//		top : 6,
//		bottom : 6,
		width : (this.config.tab6 - this.config.tab1),
		color : this.config.fontcolor,
		font : this.font(this.config.fontsize.h1)
	}));
	return self;
}

exports.H2 = function(TEXT) {	// heading 1
	var self = this.basicView();
	self.add(Ti.UI.createLabel({
		text : TEXT,
		left : this.config.tab1,
		width : (this.config.tab6 - this.config.tab1),
		color : this.config.fontcolor,
		font : this.font(this.config.fontsize.h2)
	}));
	return self;
}


exports.textbox = function(TEXTBOX) {	// textbox 1
	var self = this.basicView();
	TEXTBOX.left = this.config.tab2;
	TEXTBOX.width = (this.config.tab6 - this.config.tab2);
	TEXTBOX.font = this.font(this.config.fontsize.normal);
	TEXTBOX.borderRadius = this.config.textbox.borderRadius;
	TEXTBOX.backgroundColor = this.config.textbox.bgc;
	TEXTBOX.height = this.config.textbox.height;
	TEXTBOX.paddingLeft = 20;
	self.add(TEXTBOX);
	return self;
}


exports.spacer = function() {	// spacer line
	var self = this.basicView();
	self.top = 10;
	self.bottom = 10;
	self.add(Ti.UI.createView({
		left : this.config.tab1,
		width : (this.config.tab6 - this.config.tab1),
		backgroundColor : this.config.colours.spacer,
		height : 1
	}));
	return self;
}

exports.matchingLine = function(TEXT,XLINK,XINDEX) {	// heading 1
	var self = this.basicView();
	self.top = 6;
	self.bottom = 6;
	// the text
	self.add(Ti.UI.createLabel({
		text : TEXT,
		touchEnabled : false,
		top : 0,
		left : this.config.tab1,
		height : Ti.UI.SIZE,
		width : (this.config.tab4 - this.config.tab1),
		color : this.config.fontcolor_filters,
		font : this.font(this.config.fontsize.normal)
	}));

	// the (-) symbol
	self.add(Ti.UI.createLabel({
		text : "m",
		left : this.config.tab4,
		top : 0,
		xlink : XLINK,
		xindex : XINDEX,
		touchEnabled : true,
		textAlign : 'right',
		width : (this.config.tab6 - this.config.tab4),
		color : this.config.fontcolor_filters,
		font : this.fonticons(this.config.fontsize.iconminus)
	}));
	return self;
}

exports.sectionhead = function(TEXT) {	// heading 1
	var self = this.basicView();
	self.top = 6;
	self.bottom = 6;
	// the text
	self.add(Ti.UI.createLabel({
		text : TEXT,
		top : 0,
		xlink : 1,
		touchEnabled : true,
		left : this.config.tab2,
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		color : this.config.fontcolor_normal,
		font : this.font(this.config.fontsize.normal)
	}));

	// the (-) symbol
	var arrow = Ti.UI.createLabel({
		text : "i",
		top : 0,
		left : this.config.tab1,
		xlink : 1,
		touchEnabled : true,
		textAlign : 'left',
		width : (this.config.tab2 - this.config.tab1),
		color : this.config.fontcolor_normal,
		font : this.fonticons(this.config.fontsize.normal)
	});
	self.add(arrow);
	self.addEventListener("open",function() {	arrow.text = "j"; })
	self.addEventListener("close",function() {	arrow.text = "i"; })
	return self;
}


exports.option = function(TEXT,XLINK,XNAME) {	// heading 1
	var self = this.basicView();
	self.top = 6;
	self.bottom = 6;
	// the text
	self.add(Ti.UI.createLabel({
		text : TEXT,
		top : 0,
		touchEnabled : false,
		left : this.config.tab3,
		height : Ti.UI.SIZE,
		width : (this.config.tab6 - this.config.tab3),
		color : this.config.fontcolor_normal,
		font : this.font(this.config.fontsize.normal)
	}));

	// the (-) symbol
	self.add(Ti.UI.createLabel({
		text : "l",
		top : 0,
		left : this.config.tab2,
		xlink : XLINK,
		xname : XNAME,
		touchEnabled : true,
		textAlign : 'left',
		width : (this.config.tab3 - this.config.tab1),
		color : this.config.fontcolor_normal,
		font : this.fonticons(this.config.fontsize.iconplus)
	}));
	return self;
}

exports.pagination = function(PG,MAX) {
	var self = this.basicView();
	self.top = 6;
	self.bottom = 6;

	// the (-) symbol
	self.add(Ti.UI.createLabel({
		text : "<<",
		top : 0,
		left : this.config.tab1,
		xlink : "page-first",
		touchEnabled : true,
		width : (this.config.tab2 - this.config.tab1),
		color : this.config.fontcolor_normal,
		font : this.font(this.config.fontsize.normal)
	}));

	self.add(Ti.UI.createLabel({
		text : "<",
		top : 0,
		left : this.config.tab3,
		xlink : "page-prev",
		touchEnabled : true,
		width : 40,
		color : this.config.fontcolor_normal,
		font : this.font(this.config.fontsize.normal)
	}));

	self.add(Ti.UI.createLabel({
		text : "page "+PG+" of "+MAX,
		top : 0,
		left : this.config.tab3+42,
		xlink : "page-next",
		touchEnabled : true,
		width : (this.config.tab4 - this.config.tab3+42),
		color : this.config.fontcolor_normal,
		font : this.font(this.config.fontsize.normal)
	}));


	self.add(Ti.UI.createLabel({
		text : ">",
		top : 0,
		left : this.config.tab4,
		xlink : "page-next",
		touchEnabled : true,
		width : (this.config.tab5 - this.config.tab4),
		color : this.config.fontcolor_normal,
		font : this.font(this.config.fontsize.normal)
	}));
	self.add(Ti.UI.createLabel({
		text : ">>",
		top : 0,
		left : this.config.tab5,
		xlink : "page-last",
		touchEnabled : true,
		width : (this.config.tab6 - this.config.tab5),
		color : this.config.fontcolor_normal,
		font : this.font(this.config.fontsize.normal)
	}));

	return self;
	
}
