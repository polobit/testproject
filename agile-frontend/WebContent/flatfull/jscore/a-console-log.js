// To Enable Console in IE - MC
$(function(){
	var alertFallback = false;
	
	if (typeof console === "undefined" || typeof console.log === "undefined") {
		console = {};
		if (alertFallback) {
			console.log = function(msg) {
            alert(msg);
         };
		} else {
         console.log = function() {};
		}
	}
	
	// Disable console.logging if disabled
	if(!IS_CONSOLE_ENABLED)
	{
		//console.log("disabling");		
		console.log = function(){};
		if(console.warn)
			console.warn = function(){};
	}
});   