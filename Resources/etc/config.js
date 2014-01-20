exports.server = "http://jon651.glimworm.com/bootStrap/";
//exports.api = "http://europeanaapp.glimworm.com/europeana/euv2.php";
exports.api = "http://jon632.glimworm.com/europeana/euv2.php";
exports.timthumb = "http://jon632.glimworm.com/europeana/timthumb.php";
exports.format = "tablet";	//"phone";

exports.setformat = function (format) {
	this.format = format;
};

exports.error = function(err) {
	Ti.API.error(err);
	var ajax = require("/helpers/ajax");
	ajax.getdata({
		url : this.api+"?action=error",
		method : "POST",
		type : "text",
		data : {
			err : err
		},
		fn : function(e) {
			alert("error sent to the developer");
		}
	});
};

