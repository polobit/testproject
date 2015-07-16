/**
 Creates a new marker and info window.
 Applies a click listener on marker.
*/   
function gmap_add_marker(Locations){
  
	var markerCluster;
	if(markerCluster)
	markerCluster.setMap(null);
	//Single instance will be used for all the marker infowindow's
	var infowindow = new google.maps.InfoWindow();
	
	 var myLatlng = [];
	 var marker = [];
	 for (var i=0; i<marker.length; i++) {
	        marker[i].setMap(null);
	    }
	 var oms = new OverlappingMarkerSpiderfier(map, {keepSpiderfied:true});

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
	                			console.log("Error in parsing json");
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
	                        
	                         if(email == undefined || email == "")
	                        	 email="Unknown Visitor";
	                         var strVar="";
	                         strVar += "<div style=\"width:230px;min-height: 61px;background-color: #fff;\">";
	                         strVar += "  <div style=\"float:left;\">";
	                         strVar += "    ";
	                         strVar += "  <img alt=\"null\" class=\"photo\" src='"+markerImageUrl+"' style=\"width: 61px;border-radius:8px\">";
	                         strVar += "  <\/div>";
	                         strVar += "  <div style=\"width: 230px;padding-left: 70px;\">";
	                         strVar += "    <div style=\"";
	                         strVar += "    margin: 7px 0px 0;";
	                         strVar += "    font-size: 14px;";
	                         strVar += "    white-space: nowrap;";
	                         strVar += "    text-overflow: ellipsis;";
	                         strVar += "    width: 100%;";
	                         strVar += "    overflow: hidden;";
	                         strVar += "    color: #363f44;";
	                         strVar += "\">"+email+"<br>"+timeSince(Locations[i].visit_time)+"<br>"+Locations[i].city+","+Locations[i].country+"<\/div>";
	                         strVar += "    <p style=\"";
	                         strVar += "    margin: 3px 0 0px;float:right"; 
	                         strVar += "\"><a href=\"#\" style=\"";
	                         strVar += "    text-decoration: none;";
	                         strVar += "    color: #23b7e5;";
	                         strVar += "\"><img class='inline m-r-xs r r-2x' style='width:12px;' src='../../../img/web-stats/devices/"+machine.device_type+".png'><img class='inline m-r-xs r r-2x' style='width:12px;' src='../../../img/web-stats/os/"+parsedOS+".png'><img class='inline m-r-xs r r-2x' style='width:12px;' src='../../../img/web-stats/browsers/"+machine.browser_name+".png'><\/a>";
	                         strVar += "    <\/p>";
	                         strVar += "  <\/div>";
	                         strVar += "  <\/div>";
	                         
	                         marker[i] = new google.maps.Marker({
	                              position: myLatlng[i],
	                              map: map,
	                              icon:icon,
	                              content:strVar
	                          });
	                         
	                          oms.addMarker(marker[i]);
	                          google.maps.event.addListener(marker[i], 'click', function() {
	                        	    infowindow.setContent(this.content);
	                        	    infowindow.open(map,this); // or this instead of marker
	                        	});

	                  }
	                  //var mcOptions = {gridSize: 50, maxZoom: 15};
	                  markerCluster = new MarkerClusterer(map, marker, {clusterClass: 'poiCluster', maxZoom:15});
	                  
	                  //Listener to show the spiderify markers on clicking the clusterer count directly 
	                  google.maps.event.addListener(markerCluster, 'click', function(cluster) {

	                      var markers = cluster.getMarkers();

	                      if(prepareMarkers(markers)){
	                           //to wait for map update
	                          setTimeout(function(){
	                              google.maps.event.trigger(markers[markers.length-1], 'click');
	                          },1000)
	                      }
	                      return true;
	                  });

	                  function prepareMarkers(markers){
	                  var cont=0;
	                  var latitudMaster=markers[0].getPosition().lat();
	                  var longitudMaster=markers[0].getPosition().lng();
	                  for(var i=0;i<markers.length;i++){
	                      if(markers[i].getPosition().lat() === latitudMaster & markers[i].getPosition().lng() === longitudMaster ){
	                          cont++;
	                      }else{
	                          return false;
	                      }
	                  }
	                  if(cont==markers.length){
	                      return true;
	                  }else if(cont<markers.length){
	                      return false;
	                  }
	              }
}

function gmap_set_icons(email,width){
	
	var DEFAULT_GRAVATAR_url_gmap = window.location.origin.indexOf("localhost:") >= 0 ? "https://dpm72z3r2fvl4.cloudfront.net/css/images/user-default.png" : (window.location.origin + "/" + LIB_PATH_FLATFULL + "images/flatfull/anonymous_visitor.png");
	var backup_image = "&d=" + DEFAULT_GRAVATAR_url_gmap + "\" ";
	var data_name = '';

	if (email == undefined || email == "")
		return 'https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=' + width + '' + backup_image + data_name;

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

function timeSince(dateStr) {
	var date=new Date();
	 try
		{
		 var find = '-';
		 var re = new RegExp(find, 'g');
		 dateStr = dateStr.replace(re, '/');
		 dateStr = dateStr.match(/[^:]+(\:[^:]+)?/g);
		 date=new Date(dateStr[0]);
		}
		catch (err)
		{
			console.log("Error in parsing date");
		}

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}


		
