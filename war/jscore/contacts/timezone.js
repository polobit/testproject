function displayTimeZone(results)
{
	console.log("In displayTimeZone");
	var latitude = results[0].geometry.location.B;
	var longitude = results[0].geometry.location.k;

	$.ajax({ 
		url : "/core/api/contacts/gettz/" + latitude + "/" + longitude, 
		type : 'GET', 
		dataType : 'text', 
		success : function(data)
	   {
		if (data == null)
			return;

		$(".contacts-time").html(data);
		$("#contacts-local-time").show();

	   }, error : function(jqXHR, textStatus, errorThrown)
	   {
		console.log("jqXHR: " + jqXHR.status + "\ntextStatus: " + textStatus + "\nerrorThrown: " + errorThrown);
	   } 
	   });
}
