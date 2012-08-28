// Get External JSON - YQL way
function getExternalJSON(url, callback, failurecallback) {
    
   if((url.indexOf(YQL_Filter) != -1) || (url.indexOf("/") == 0))
   {  
   	// Local URL, don't use YQL
   	$.getJSON(url, function (data) {	
		
		console.log(data);
   		callback(data);
   	});
   	
   	return;   	
   } 
    
   if(url.indexOf("?") != -1) 
   		url = url+"&timestamp=" + new Date().getTime();	

    // Query     
    var query = encodeURIComponent('select * from json where url="' + url + '"');    
    
    console.log(query);
    
    // All of them are hardcoded to JSON
    var yql = "http://query.yahooapis.com/v1/public/yql?q=" + query + "&format=json&callback=?";
    
    
    $.getJSON(yql, function (data) {

	
	console.log(data);
	
	// Check callback
	
	  if(data.query != undefined){
        if (data.query.results != undefined) {                   
            if (failurecallback) 
            	failurecallback(data.query.results.error);
        }

        if (data.query.results && data.query.results.json && typeof(data.query.results.json)) {
            if (callback) 
            	callback(data.query.results.json);
        }
        else if (data.query.results && typeof(data.query.results)) {
            if (callback) 
            	callback(data.query.results);
        }
        else {
            if (failurecallback) 
            failurecallback("Unknown error");
        }
     }
    });
}
