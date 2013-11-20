function initialize()
		{
			console.log("Map API has been loaded.");
			var mapProp = {
				center:new google.maps.LatLng(39.0000, 22.0000),
				zoom:7,
				mapTypeId:google.maps.MapTypeId.ROADMAP
			};
			
			window.map=new google.maps.Map(document.getElementById("google_map"),mapProp);
			
//			if(window.map != undefined){
//				document.getElementById("add_marker").disabled = false;
//			}
		}
		
		// DOM listener to call initialize function after window load.
		//google.maps.event.addDomListener(window, 'load', initialize);
		
		// another way of calling initialize function and loading Google Maps API script.
		function loadScript()
		{
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = "https://maps.google.com/maps/api/js?sensor=false&callback=initialize";
			document.body.appendChild(script);
		}
	
		window.onload = loadScript;