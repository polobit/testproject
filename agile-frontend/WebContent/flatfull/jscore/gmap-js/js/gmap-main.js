
function gmap_initialize(el)
		{
			console.log("Map API has been loaded.");
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = "https://jawj.github.io/OverlappingMarkerSpiderfier/bin/oms.min.js";
			document.body.appendChild(script);
			// Enable the visual refresh
			google.maps.visualRefresh = true;
			
			var mapProp = {
				center:new google.maps.LatLng(39.0000, 22.0000),
				zoom:7,
				mapTypeId:google.maps.MapTypeId.ROADMAP
			};
			
			window.map=new google.maps.Map(document.getElementById("google_map"),mapProp);
			window.map.setZoom(2);
			window.gmap_marker_list = [];
			
			gmap_date_range(el, function(){
				var $today = new Date();
				var $yesterday = new Date($today);
				$yesterday.setDate($today.getDate() - 1);
				var from_date = $yesterday;
				var to_date = $yesterday;
				if(window.toDate != undefined && window.toDate != '')
					to_date=window.toDate;
				else
					window.toDate=to_date;
				if(window.fromDate != undefined && window.fromDate != '')
					from_date=window.fromDate;
				else
				window.fromDate=from_date;
				
				$('#gmap_date_range span').html(to_date.toString('MMMM d, yyyy') + " - " + from_date.toString('MMMM d, yyyy'));
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
	script.src = "https://maps.googleapis.com/maps/api/js?v=3&sensor=false&callback=gmap_initialize";
	document.body.appendChild(script);
}
	
		
