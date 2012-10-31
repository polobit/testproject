function showMap(el){
	head.js(LIB_PATH + "lib/jquery.gmap-1.1.0.js", "https://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAAkAIKUSu8UvOdskLbwI2utBSe9wjzlejO5DP3VE8eCCVjGfTcZRTXsS_mn0J90_EacC3rSMPiTBwE2A", function(){
		var contact = App_Contacts.contactDetailView.model.toJSON();
		var address = getPropertyValue(contact.properties, "address");
		if(address){
			//alert('map');
			
			 /*$("#map", el).gMap({markers: [{ latitude: 47.651968,
                 longitude: 9.478485,
                 html: "_latlng" }],
                 zoom: 3
			 });*/
		}	
	});
}
