function displayTimeZone(results)
{
	console.log("In displayTimeZone");
		
	var latitude;
	var longitude;
	var i = 0;
	$.each(results[0].geometry.location, function(idx, obj) {
		console.log(obj);
		if(i==0)
		  latitude = obj;
		else if(i==1) 
		  longitude = obj;
		i++;
	});

	if(!latitude || !longitude)
		return;
	
	$.ajax({ 
		url : "/core/api/contacts/gettz/" + latitude() + "/" + longitude(), 
		type : 'GET', 
		dataType : 'text', 
		success : function(data)
	   {
		if (data == null || data == "")
			return;

		$(".contacts-time").html(_agile_get_translated_val("misc-keys", "local-time") + " : " + data);
		$("#contacts-local-time").show();
		$("#map_view_action").html("<i class='icon-minus text-sm c-p' title='"+_agile_get_translated_val('contact-details','hide-map')+"' id='disable_map_view'></i>");

	   }, error : function(jqXHR, textStatus, errorThrown)
	   {
		console.log("jqXHR: " + jqXHR.status + "\ntextStatus: " + textStatus + "\nerrorThrown: " + errorThrown);
	   } 
	   });
}
