function ShareButton(LINK) {

	var self = Titanium.UI.createOptionDialog({
		cancel: 1,
		options: ['Share on Twitter', 'Share on Facebook', 'Cancel'],
		message: '',
		title: ''
	});
	self.addEventListener('click',function(e) {
		if (e.index == 0) {
			var _twc = require("/helpers/twitter/twitter_connect");
			_twc.postdialog();
		}
		if (e.index == 1) {
			var _fbc = require("/ui/common/facebook_connect");
			_fbc.postdialog();
		}
		if (e.index == 2) {
			return;
		}
	});
	
	return self;
	
}

module.exports = ShareButton;
