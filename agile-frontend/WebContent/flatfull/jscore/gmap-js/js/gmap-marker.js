/**
 Creates a new marker and info window.
 Applies a click listener on marker.
*/   

function gmap_add_marker(Locations){
  

	gmap_delete_marker();
	var infowindow = new google.maps.InfoWindow({
    });
	
	
	
	 var myLatlng = [];
	 var infowindow = [];
	 var marker = [];

	                  function MakeInfoWindowEvent(map, infowindow, marker) {  
	                     return function() {  
	                        infowindow.open(map, marker);
	                     };  
	                  }

	                  for (var i=0;i < Locations.length;i++)
	                  {   
	                	    var User_Location = (Locations[i].city_lat_long).split(",");
	                        myLatlng[i] = new google.maps.LatLng(User_Location[0],User_Location[1]);
	                        var parsedString = Locations[i].parsedUserAgent.replace(/\\/g, '');
	                        console.log(parsedString);
	                        var machine;
	                        try
	                		{
	                        	machine=JSON.parse(parsedString);
	                		}
	                		catch (err)
	                		{
	                			console.log("Error in parsing json");
	                			continue;
	                		}
	                        var parsedOS=normalize_os(machine.os);
	                         marker[i] = new google.maps.Marker({
	                              position: myLatlng[i],
	                              map: map
	                          });
	                         marker[i].setIcon(gmap_set_icons(Locations[i].email,30));
	                         
	                         if(Locations[i].email != ""){
	                        	 var content = '<div>'+Locations[i].visit_time+'<br><img class="inline m-r-xs r r-2x" src="../../../img/web-stats/devices/'+machine.device_type+'.png"><img class="inline m-r-xs r r-2x" src="../../../img/web-stats/os/'+parsedOS+'.png"><img class="inline m-r-xs r r-2x" src="../../../img/web-stats/browsers/'+machine.browser_name+'.png"><br>'+Locations[i].email+'</div>'; 
	                         }else{
	                        	 var content = '<div>'+Locations[i].visit_time+'<br><img class="inline m-r-xs r r-2x" src="../../../img/web-stats/devices/'+machine.device_type+'.png"><img class="inline m-r-xs r r-2x" src="../../../img/web-stats/os/'+parsedOS+'.png"><img class="inline m-r-xs r r-2x" src="../../../img/web-stats/browsers/'+machine.browser_name+'.png"><br><div>';
	                         }
		                        infowindow[i] = new google.maps.InfoWindow({
		                                 content: content
		                             });
	                         /*if(Locations[i].email == undefined || Locations[i].email == "")
	                        	 marker[i].setIcon('http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_gray.png');
	                	     else
	                	    	 marker[i].setIcon(gmap_set_icons(Locations[i].email,50));*/

	                           google.maps.event.addListener(marker[i], 'click', MakeInfoWindowEvent(map, infowindow[i], marker[i]))

	                  }
	                  map.setZoom(2);
	                  var mcOptions = {gridSize: 50, maxZoom: 15};
	                  var markerCluster = new MarkerClusterer(map, marker,mcOptions);
	                

}

function gmap_set_icons(email,width){
	
	// Default image
	var img = DEFAULT_GRAVATAR_url;
	var backup_image = "&d=404\" ";
	// backup_image="";
	var initials = '';

	if (initials.length == 0)
		backup_image = "&d=" + DEFAULT_GRAVATAR_url + "\" ";
	var data_name = '';
	//var email = getPropertyValue(items, "email");
	if (email != undefined || email != "")
	{
		return 'https://secure.gravatar.com/avatar/' + Agile_MD5(email) + '.jpg?s=' + width;
	}

	return 'https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=' + width + "&d=" + escape(img);


	
}

function normalize_os(data){
	
	if (data === undefined || data.indexOf('_') === -1)
		return data;

	// if '_' exists splits
	return data.split('_')[0];
}

function gmap_set_map(map){
	for(var Loop=0; Loop < window.gmap_marker_list.length; Loop++){
		window.gmap_marker_list[Loop].setMap(map);
	}
}

function gmap_delete_marker(){
	gmap_set_map(null);
	window.gmap_marker_list = [];
}
		