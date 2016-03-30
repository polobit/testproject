$(function(){
    head.js("https://cdn.jsdelivr.net/fingerprintjs2/1.1.2/fingerprint2.min.js", function(){
    	// Send hash to server
    	new Fingerprint2().get(function(result, components){
		  console.log(result); //a hash, representing your device fingerprint
		  console.log(components); // an array of FP components
		  var obj = {}
		  obj.user_agent = components.user_agent;
		  obj.session_storage = components.session_storage;
		  obj.navigator_platform = components.navigator_platform;
		   $.ajax({
		   	type : 'POST',
		   	url : '/core/api/users/fingerprintscanner?result='+result,
		   	data : obj,

		    
		    success : function(response)
			{
				console.log("success");
			},
			error: function(response)
			{

			}


		   });


		});
    });
});