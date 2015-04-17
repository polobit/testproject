
function gmap_initialize(el)
		{
			console.log("Map API has been loaded.");
			// Enable the visual refresh
			google.maps.visualRefresh = true;
			
			var mapProp = {
				center:new google.maps.LatLng(39.0000, 22.0000),
				zoom:7,
				mapTypeId:google.maps.MapTypeId.ROADMAP
			};
			
			window.map=new google.maps.Map(document.getElementById("google_map"),mapProp);
			window.gmap_marker_list = [];
			
			gmap_date_range(el, function(){
				gmap_search_by_date($('#gmap_date_range span').text());
			});
//			if(window.map != undefined){
//				document.getElementById("add_marker").disabled = false;
//			}
		}
		
// DOM listener to call initialize function after window load.
//google.maps.event.addDomListener(window, 'load', initialize);

// another way of calling initialize function and loading Google Maps API script.
function gmap_load_script(el)
{
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "https://maps.google.com/maps/api/js?sensor=false&callback=gmap_initialize";
	document.body.appendChild(script);
}
	
		