(function(window) {

var ajax = {};

//sends GET request to the server
//Parameters: url (specifies the url you wish to request),
//callback (value function to be executed if the request is processed)
ajax.sendGetReq = function(url, myFunction) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			myFunction(xhttp);
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
};
	
//expose ajax variable to the global environment
window.$ajax = ajax;

})(window);