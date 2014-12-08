function displayTimeZone(results)
{
	console.log("In displayTimeZone");
	var latitude = results[0].geometry.location.B;
	var longitude = results[0].geometry.location.k;

	// Get scheduled updates count
	$.getJSON("/core/api/contacts/gettz/" + latitude + "/" + longitude, function(data)
	{
		console.log("data :");
		console.log(data);

		$(".contacts-time").html(data.timezone.localtime);
		$("#contacts-local-time").show();		
	}).error(function(jqXHR, textStatus, errorThrown)
	{
		console.log(textStatus);
		console.log(errorThrown);		
	});
}
