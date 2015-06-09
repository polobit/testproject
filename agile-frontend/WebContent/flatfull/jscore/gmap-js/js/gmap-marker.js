
/**
	Creates a new marker and info window.
	Applies a click listener on marker.
*/ 		

function gmap_add_marker(Locations){
  
	gmap_delete_marker();
	var infowindow = new google.maps.InfoWindow({
    });

	
	for (var Loop in Locations) {
	
		 var User_Location = (Locations[Loop].city_lat_long).split(",");
		 var position = new google.maps.LatLng(User_Location[0], User_Location[1]);
	     var content = Locations[Loop].email+","+Locations[Loop].city;
	     var email=Locations[Loop].email;
	     var marker = new google.maps.Marker({
	            position:position,
	            map:map,
	            content:content,
	            email:email
	        });
	    
	     if(email == undefined || email == "")
	    	 marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
	     
		window.gmap_marker_list.push(marker);
		google.maps.event.addListener(marker, 'click', function() {
			var $this=this;
			 if(this.email != undefined && this.email != ""){
					var contactURL="core/api/contacts/search/email/"+this.email;
					$.getJSON(contactURL, function( Response ) {
						var content="";
						var contactName="";
						if(Response != undefined){
							var index=0;
							while(Response.properties.length > 0 && index < Response.properties.length){
								
								if(Response.properties[index].type == 'SYSTEM' && Response.properties[index].name == 'first_name'){
									contactName=Response.properties[index].value;
								}
								if(Response.properties[index].type == 'CUSTOM' && Response.properties[index].name == 'image'){
									var imgUrl=Response.properties[index].value;
									content='<img width="80" src="'+imgUrl+'"><br><div>'+$this.email+'<br>'+contactName+'</div>';
								}
								index++;
							}
						}else{
							content='<div>'+$this.email+'<br>'+contactName+'</div>';
						}
						 infowindow.setContent(content);
						 infowindow.open(map, $this);
					});
		    	 
		     }

			  
			});
		
	}
	map.setZoom(2);
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
		