exports.xhr = [null,null,null];

function ajax(xhr_index) {
	
}

exports.ajax = ajax;
exports.getxhr = function(num) {
	return this.xhr[num];
};
exports.getxhr = function(num, xhr) {
	this.xhr[num] = num;
};
exports.destroyxhr = function(num) {
	this.xhr[num] = null;
};

exports.getdata = function(obj) {

	var ajx =  new ajax();


	if (Ti.Network.online == false) {
		alert(l.noconnectivity);
		return;
	}
	if (!obj.index) obj.index = 0;
	
	if (this.xhr[obj.index] != null) {
		this.xhr[obj.index].abort();
	}
	
	if (!obj.hideIndicator) Ti.App.fireEvent("show_indicator");
	
	var x_asynchronous = true;
	var x_method = (obj.method) ? obj.method : "GET";
	var x_timeout = (obj.timeout) ? obj.timeout : 30000;
	var x_type = (obj.type) ? obj.type : "json";
	var x_filename = (obj.filename) ? obj.filename : "";

	if (obj.image) {
		obj.win = Titanium.UI.currentWindow;
		x_asynchronous = false;
		x_method = "POST";
		var ind=Titanium.UI.createProgressBar({
			width:200,
			height:50,
			min:0,
			max:1,
			value:0,
			style:Titanium.UI.iPhone.ProgressBarStyle.PLAIN,
			top:10,
			message:'Uploading Image',
			font:{fontSize:12, fontWeight:'bold'},
			color:'#888'
		});
//		obj.win.add(ind);
//		ind.show();
		var f1 = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,obj.imageFileName);
		var i1 = f1.read();
		obj.data.media = i1;
	}
	
	
	var xhr = Ti.Network.createHTTPClient(); // returns an instance of HTTPClient
	this.xhr[obj.index] = xhr;
	
	xhr.onload = function(e) {
		var ajax = require("/helpers/ajax");
		ajax.destroyxhr(obj.index);
		
		if (obj.image) {
			obj.fn(this);
			if (!obj.hideIndicator) Ti.App.fireEvent("hide_indicator");
		} else {
			try {
				setActIndMsg(l.loaded);
			} catch (e) {}

			Titanium.API.debug("this.responseText");
			Titanium.API.debug(this.responseText);
			if (x_type == "text") {
				obj.fn.call(this,this.responseText);
			} else {
				var myData = {};
				try {
					myData = JSON.parse(this.responseText.trim());
				} catch (e) {
					myData = {};
				}
				obj.fn.call(this,myData);
			}
			if (!obj.hideIndicator) Ti.App.fireEvent("hide_indicator");
		}
	};
	
	xhr.setTimeout(x_timeout);
	xhr.onerror = function(e) {
		Titanium.API.debug("error");
		Titanium.API.debug(e);
		Titanium.API.debug(e.source);
		Titanium.API.debug(e.source.url);
		if (!obj.hideErrors) {
			alert(e.error);
			alert(obj.url);
		}
//		this.xhr[obj.index] = null;
		if (obj.err) obj.err(e);
//		if (obj.image) ind.destroy();
		if (!obj.hideIndicator) Ti.App.fireEvent("hide_indicator");
	};
	xhr.onreadystatechange = function(e) {
		//actIndMsg.text = "ready state change ("+(actIndMsgCnt++)+")";
	};
	xhr.onsendstream = function(e) {
//		if (obj.image) ind.value = e.progress ;
		//actIndMsg.text = "sendstream ("+(actIndMsgCnt++)+")";
	};
	xhr.ondatastream = function(e) {
		Titanium.API.debug(e);
		//actIndMsg.text = "datastream ("+(actIndMsgCnt++)+")";
	};
	xhr.open(x_method,obj.url,x_asynchronous);
	xhr.send(obj.data);
};
