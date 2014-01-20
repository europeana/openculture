var globals = require('/ui/common/globals');
function fn() {

//	var self = Ti.UI.createTabGroup();
// 	
	// var search = require('ui/common/SearchWindowV2');
	// var w1 = new search();
// 		
	// var t1 = Ti.UI.createTab({
		// title: 'Muse',
		// window:w1,
		// icon : "/images/glyphicons_020_home.png"
	// });
	// self.addTab(t1);
// 	
	// function gototab(e) {
		// self.setActiveTab(e.n);
	// }
	// Titanium.App.addEventListener("gototab",gototab);
// 
	// globals.set('tabgroup',self);
	
	var search = require('ui/common/SearchWindowV2');
	var self = new search();
	return self;
}

//make constructor function the public component interface
module.exports = fn;
