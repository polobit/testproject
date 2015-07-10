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
	 map.setZoom(2);

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
	                        var machine;
	                        try
	                		{
	                        	machine=JSON.parse(parsedString);
	                		}
	                		catch (err)
	                		{
	                			console.log("Error parsing");
	                			continue;
	                		}
	                        var parsedOS=normalize_os(machine.os);
	                        var email=Locations[i].email;
	                        var markerImageUrl=gmap_set_icons(email,30);
	                        
	                        var icon = {
	                        	     url: markerImageUrl, // url
	                        	     size: new google.maps.Size(40, 40),
	                        	     origin: new google.maps.Point(0,0),
	                        	     scaledSize: new google.maps.Size(30,30),
	                        	     anchor: new google.maps.Point(0, 32)
	                        	 };
	                        
	                         marker[i] = new google.maps.Marker({
	                              position: myLatlng[i],
	                              map: map,
	                              path:markerImageUrl,
	                              icon:icon
	                          });
	                         
	                         
	                         var strVar="";
	                         strVar += "<div style=\"width:230px;min-height: 61px;box-shadow: 0 0 5px 0px #eee;background-color: #fff;\">";
	                         strVar += "  <div style=\"float:left;\">";
	                         strVar += "    ";
	                         strVar += "  <img alt=\"null\" class=\"photo\" src='"+markerImageUrl+"' style=\"width: 61px;\">";
	                         strVar += "  <\/div>";
	                         strVar += "  <div style=\"width: 230px;padding-left: 70px;\">";
	                         strVar += "    <div style=\"";
	                         strVar += "    margin: 7px 0px 0;";
	                         strVar += "    font-size: 16px;";
	                         strVar += "    white-space: nowrap;";
	                         strVar += "    text-overflow: ellipsis;";
	                         strVar += "    width: 100%;";
	                         strVar += "    overflow: hidden;";
	                         strVar += "    color: #363f44;";
	                         strVar += "\">"+parseDateString(Locations[i].visit_time)+"<\/div>";
	                         strVar += "    <p style=\"";
	                         strVar += "    margin: 3px 0 0px;";
	                         strVar += "\"><a href=\"#\" style=\"";
	                         strVar += "    text-decoration: none;";
	                         strVar += "    color: #23b7e5;";
	                         strVar += "\"><img class='inline m-r-xs r r-2x' src='../../../img/web-stats/devices/"+machine.device_type+".png'><img class='inline m-r-xs r r-2x' src='../../../img/web-stats/os/"+parsedOS+".png'><img class='inline m-r-xs r r-2x' src='../../../img/web-stats/browsers/"+machine.browser_name+".png'><\/a><br>"+Locations[i].email+"";
	                         strVar += "    <\/p>";
	                         strVar += "  <\/div>";
	                         strVar += "  <\/div>";

	                         
	                        
		                        infowindow[i] = new google.maps.InfoWindow({
		                                 content: strVar
		                             });

	                           google.maps.event.addListener(marker[i], 'click', MakeInfoWindowEvent(map, infowindow[i], marker[i]))

	                  }
	                  var mcOptions = {gridSize: 50, maxZoom: 15};
	                  var markerCluster = new MarkerClusterer(map, marker,mcOptions);
	                

}

function gmap_set_icons(email,width){
	
	// Default image
	var img = DEFAULT_GRAVATAR_url;
	var default_image="https://secure.gravatar.com/avatar/83e524be3136955aeeb4272bd5a3adff.jpg?s=10&d=https://dpm72z3r2fvl4.cloudfront.net/css/images/user-default.png";
	var backup_image = "&d=404\" ";
	// backup_image="";
	var initials = '';

	if (email == undefined || email == "")
		return default_image;

	return prepareLettergravatar(email);
	
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

function parseDateString(dateString){
	 try
		{
		 var parsedDate = dateString.match(/[^:]+(\:[^:]+)?/g);
		 return parsedDate[0];
		}
		catch (err)
		{
			console.log("Error in parsing date");
			return dateString;
		}
	
}

function prepareLettergravatar(email){

	var colors = ["#1abc9c", "#16a085", "#f1c40f", "#f39c12", "#2ecc71", "#27ae60", "#e67e22", "#d35400", "#3498db", "#2980b9", "#e74c3c", "#c0392b", "#9b59b6", "#8e44ad", "#bdc3c7", "#34495e", "#2c3e50", "#95a5a6", "#7f8c8d", "#ec87bf", "#d870ad", "#f69785", "#9ba37e", "#b49255", "#b49255", "#a94136"];
	try{
		 var settings = {
			        // Default settings
			        "name":email,
			        "charCount": 1,
			        "textColor": "#ffffff",
			        "height": 100,
			        "width": 100,
			        "fontSize": 60,
			        "fontWeight": 400,
			        "fontFamily": "HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica, Arial,Lucida Grande, sans-serif"
			    };

			    settings.name = "" + settings.name;
			    var c = settings.name.substr(0, settings.charCount).toUpperCase();
			    var cobj = $('<text text-anchor="middle"></text>').attr({
			        'y': '50%',
			        'x': '50%',
			        'dy' : '0.35em',
			        'pointer-events':'auto',
			        'fill': settings.textColor,
			        'font-family': settings.fontFamily
			    }).html(c).css({
			        'font-weight': settings.fontWeight,
			        'font-size': settings.fontSize+'px',
			    });

			    var colorIndex = null;
			    if(c.length > 1)
			    	colorIndex = Math.abs(Math.floor((((c.charCodeAt(0) - 65) + (c.charCodeAt(1) - 65))/2)  % colors.length));
			    else
			    	colorIndex = Math.abs(Math.floor((c.charCodeAt(0) - 65) % colors.length));

			    var svg = $('<svg></svg>').attr({
			        'xmlns': 'http://www.w3.org/2000/svg',
			        'pointer-events':'none',
			        'width': settings.width,
			        'height': settings.height
			    }).css({
			        'background-color': colors[colorIndex],
			        'width': settings.width+'px',
			        'height': settings.height+'px'
			    });

			    svg.append(cobj);
			   // svg.append(group);
			    var svgHtml = window.btoa(unescape(encodeURIComponent($('<div>').append(svg.clone()).html())));
			    return 'data:image/svg+xml;base64,' + svgHtml;
		
	}catch(e){
		
		console.log("Error in letter gravatar function"+e);
	}
}


		
