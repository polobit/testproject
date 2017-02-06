var eventMethod;
var eventer;
var messageEvent;
if(!messageEvent){
	console.log("one more times");
	eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	eventer = window[eventMethod];
	messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
}
// Listen to message from child window
eventer(messageEvent,function(e) {
	e.preventDefault();
	e.stopPropagation();
	console.log(e.origin+"document URL ===");
    var key = e.message ? "message" : "data";
    var data = e[key];
    console.log(data.city+"========="+data.state+"========="+data.country+"========="+data.image_src+"received==="+data.p_link+"====="+data.p_phone+"===="+data.p_email+"===="+data.p_twitter);
    if(data == "loadsearchpage"){
    	var source = "https://www.linkedin.com/search/results/people/?keywords="+$("#contact_name").text().trim()+"&origin=GLOBAL_SEARCH_HEADER";
		$("#linkedin-iframe").get(0).contentWindow.location.replace(source);
    }else{
	    var contact_image = agile_crm_get_contact_property("image");
	    var propertiesArray = [{ "name" : "website", "value" : data.p_link, "subtype" : "LINKEDIN" ,"type" : "SYSTEM"}];
	    var website_url = data.p_url;
	    if(website_url){
	    	var w_urls = website_url.split(",");
	    	for(var i=0;i<w_urls.length;i++){
	    		if(!checkPropertyValue("website",w_urls[i].trim(),"URL")){
	    			propertiesArray.push({ "name" : "website", "value" : w_urls[i].trim(),"subtype" : "URL","type" : "SYSTEM"});
	    		}
	    	}
	    }
	    var twitter_profile = data.p_twitter;
	    if(twitter_profile){
	    	var t_profiles = twitter_profile.split(",");
	    	for(var i=0;i<t_profiles.length;i++){
	    		if(!checkPropertyValue("website","@"+t_profiles[i].trim(),"TWITTER")){
	    			propertiesArray.push({ "name" : "website", "value" : "@"+t_profiles[i].trim(),"subtype" : "TWITTER","type" : "SYSTEM"});
	    		}
	    	}
	    }
	    var l_email = data.p_email;
	    if(l_email){
	    	var c_email = l_email.split(",");
	    	for(var i=0;i<c_email.length;i++){
		    	if(!checkPropertyValueWithOutSubType("email",c_email[i].split(" (")[0].trim())){
					propertiesArray.push({ "name" : "email", "value" : c_email[i].split(" (")[0].trim(),"type" : "SYSTEM"});
				}
			}
		}
		var l_phone = data.p_phone;
		if(l_phone){
			var p_no = l_phone.split(",");
			for(var i=0;i<p_no.length;i++){
				if(!checkPropertyValueWithOutSubType("email",p_no[i].split(" (")[0].trim())){
					propertiesArray.push({ "name" : "phone", "value" : p_no[i].split(" (")[0].trim(),"type" : "SYSTEM"});
				}
			}
		}
		if (!contact_image && data.image_src){
			var linkedin_image = data.image_src;
			propertiesArray.push({ "name" : "image", "value" : linkedin_image});
		}
		if(data.title){
			if(!checkPropertyValueWithOutSubType("title",data.title)){
				propertiesArray.push({ "name" : "title", "value" : data.title,"type" : "SYSTEM"});
			}
		}
		var address = {};
		var contact_address = agile_crm_get_contact_property("address");
		//if(!contact_address){
		if(data.city){
			var l_city = data.city;
			address.city = l_city.trim();
		}
		if(data.state){
			var l_state = data.state;
			address.state = l_state.trim();
		}
		if(data.country_name){
			var l_country = data.country_name;
			var country_code;
			address.countryname = l_country.trim();
			$.ajax({
				url:"https://restcountries.eu/rest/v1/name/"+address.countryname+"?fullText=true",
				async: false,
				success:function(data){
					$.each(data,function(index,item){
						country_code = item.alpha2Code;
						if(address){
							address.country = country_code;
							if(agile_crm_is_model_property_changed("address",JSON.stringify(address))){
								propertiesArray.push({ "name" : "address", "value" : JSON.stringify(address),"type" : "SYSTEM"});
							}
						}
					});
				}
			});

		}else{
			if(address){
				if(agile_crm_is_model_property_changed("address",JSON.stringify(address))){
					propertiesArray.push({ "name" : "address", "value" : JSON.stringify(address),"type" : "SYSTEM"});
				}
			}

		}
		//}
		verifyUpdateImgPermission(function(can_update){
			if(can_update){
				agile_crm_update_contact_properties_linkedin(propertiesArray);
			}
		});
	}
},false);