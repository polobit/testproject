/**Global variable holds the time interval to make rest call */
var INTERVAL=2000;
/** Global variable holds the latitudes and longitudes,used by the marker to plot a location */
var myLatlng = [];

/**Global variable to hold markers */
var marker = [];

/** It holds the unique sid's : just to have a unique visits as mysql query doesnot group sid's*/
var markerStore={};

var offSet=0; 
var limit=200;

/** Global variable to hold REST API call url*/
var url;
/**Global variable to hold clusterer object */
var markerCluster;
/**Single instance will be used for all the marker infowindow's
*/
var infowindow;


 /**spiderifier object */
var oms;
 
 
/** Function to retrieve visitors data with offset: called on every 5 seconds */
function getMarkers() {
	console.log(window.pauseMap);
	if(! window.pauseMap){
		
	$.getJSON( url+'&cursor='+offSet+'&page_size='+limit, function( res ) {
			
			if(res != ""){
				/** Call a function to plot the markers with recieved marker data*/
				plotMarkers(res);
				offSet=offSet+limit;
		        setTimeout(getMarkers,INTERVAL);
			}else
				$("#map-tab-waiting").fadeOut();
			
		});
		
	}else
		$("#map-tab-waiting").fadeOut();
	
		
	}

/** Function which takes response from server and create a marker,infowindow adds it to Clusterer and Spiderifier */
function plotMarkers(Locations){

	                  for (var i=0;i < Locations.length;i++)
	                  {   
	                	  
	                	  /**Check if we have duplicate markers : markers with same sid is pretend to be a duplicate marker here */
	                	  if(! markerStore.hasOwnProperty(Locations[i].sid)) {
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
	                        	     url: markerImageUrl
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
	                         strVar += "    <div class=\"emailLink\" emailAttr="+email+" style=\"";
	                         strVar += "    margin: 7px 0px 0;";
	                         strVar += "    font-size: 14px;";
	                         strVar += "    white-space: nowrap;";
	                         strVar += "    text-overflow: ellipsis;";
	                         strVar += "    width: 100%;";
	                         strVar += "    overflow: hidden;";
	                         strVar += "    color: #363f44;";
	                         strVar += "\"><a>"+email+"</a><br>"+timeSince(Locations[i].visit_time)+"<br>"+capitalizeFirstLetter(Locations[i].city)+" , "+Locations[i].country+"<\/div>";
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
	                              draggable:false,
	                              icon:icon,
	                              content:strVar
	                          });
	                         
	                         markerStore[Locations[i].sid] = marker[i];
	                         
	                         oms.addMarker(marker[i]);
	                          
	                          /**Marker click event*/ 
	                          google.maps.event.addListener(marker[i], 'click', function() {
	                        	    infowindow.setContent(this.content);
	                        	    infowindow.open(map,this);
	                        	});

	                  }
	                  }
	                  
	                  /**If the marker cluster is not  yet initialized then do it once with existing markers */
	                  if(markerCluster == undefined){
	                	  
	                	  
	                      /**Initializing marker clusterer*/ 
	  	      		    markerCluster = new MarkerClusterer(map,marker,{maxZoom:15});
	  	      		    
	  	      		    
	  	      		    /**Listener to show the spiderify markers on clicking the clusterer count directly*/ 
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
	                	  
	                  }else{
	                	  markerCluster.addMarkers(marker,false);
	                	  
	                  }
	              
	                  
	                  /**Listener to close the infowindow if opened on clicking a map*/ 
	                  google.maps.event.addListener(map, 'click', function(){
	                	  if(infowindow){
	                		  infowindow.close();
	                	  }
	                  });
	
	
	
}

$(document).on('click','div.emailLink',function(){
	var emailToSend=$(this).attr('emailAttr');
	if(emailToSend != '' && emailToSend != undefined){
		var visitorBySessionUrl="core/api/contacts/search/email/"+emailToSend;
		$.getJSON(visitorBySessionUrl,function(res){
			if(res != '' && res != undefined){
				var contactId=res.id;
				window.location.href='#contact/'+contactId;
			}else{
				console.log("Response is empty");
				$('#noContactMessage').fadeIn();
				setTimeout(function(){
					$('#noContactMessage').fadeOut();
		            },5000)
			}
		});
	}
	
	
});

/**
 This method is being called from gmap-date-sort.js as soon as map object created
*/   
function gmap_add_marker(DateRangeUrl){
	
	
	google.maps.visualRefresh = true;
	
	var mapProp = {
		center:new google.maps.LatLng(39.0000, 22.0000),
		zoom:2,
		mapTypeId:google.maps.MapTypeId.ROADMAP
	};
	
	
	/**Creating a new instance everytime the date were modified ,this is required to reresh the markers and clusters*/
	window.map=new google.maps.Map(document.getElementById("google_map"),mapProp);
	map.setOptions({ minZoom: 2});
	
	/**Reset all the global variables */
	offSet=0;
	myLatlng = [];
	marker = [];
	markerStore={};
	markerCluster=undefined;
	infowindow=undefined;
	oms=undefined;
	
	
	
	/**Single instance will be used for all the marker infowindow's
	*/
	infowindow = new google.maps.InfoWindow({maxWidth: 230});
	
    /** Spiderify intialization*/
	oms= new OverlappingMarkerSpiderfier(map, {keepSpiderfied:true,nearbyDistance:40,legWeight:0});
	url=DateRangeUrl;
	
	
	/**Initiate the Rest call to get the data from server */
	getMarkers(url);
	
	
}


$(document).on('click','.agile-row > tr > td', function(e) {
	if($(this).hasClass('referer')){
		var refererUrl=$(this).find('a').attr('href');
		window.open(refererUrl);
		
	}else{
		var route = $('.agile-edit-row').attr('route');
		// Newly added code for displaying contacts and companies in same table with different routes.
		if($(this).closest('tr').find('[route]').length != 0)
		route = $(this).closest('tr').find('[route]').attr('route');
		var data = $(this).closest('tr').find('.data-contact').attr('data');
		if(route == "contact/" || route == "company/")
		SCROLL_POSITION = window.pageYOffset;
		console.log(data);
		if (data) {
		Backbone.history.navigate(route + data, {
		trigger : true
		});
		}
	}

	}); 

/**It just formats the first letter of a string with capital letter ,Only used here for city.*/ 
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**Function which returns either a default image or an SVG image based on the email*/
function gmap_set_icons(email,width){
	
	if (email == undefined || email == "")
		return LIB_PATH_FLATFULL + 'images/flatfull/anonymous_visitor.png';
	return prepareLettergravatar(email);
	
}

/**Formats the device,OS and Browser to a required format*/ 
function normalize_os(data){
	
	if (data === undefined || data.indexOf('_') === -1)
		return data;

	// if '_' exists splits
	return data.split('_')[0];
}


/**This is a slight modification to the existing "initial" plugin used in the application ,could not reuse that but had to use as an another function*/
function prepareLettergravatar(email){

	var colors = ["#1abc9c", "#16a085", "#f1c40f", "#f39c12", "#2ecc71", "#27ae60", "#e67e22", "#d35400", "#3498db", "#2980b9", "#e74c3c", "#c0392b", "#9b59b6", "#8e44ad", "#bdc3c7", "#34495e", "#2c3e50", "#95a5a6", "#7f8c8d", "#ec87bf", "#d870ad", "#f69785", "#9ba37e", "#b49255", "#b49255", "#a94136"];
	try{
		 var settings = {
			        // Default settings
			        "name":email,
			        "charCount": 1,
			        "textColor": "#ffffff",
			        "height": 32,
			        "width": 32,
			        "fontSize": 18,
			        "fontWeight": 170,
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

/**Formats the given  date to "time Ago"*/
function timeSince(dateStr) {
	var date=new Date();
	 try
		{
		 var find = '-';
		 var re = new RegExp(find, 'g');
		 dateStr = dateStr.replace(re, '/');
		 dateStr = dateStr.match(/[^:]+(\:[^:]+)?/g);
		 date = new Date(dateStr[0]+' UTC');
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


		
