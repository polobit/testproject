$(function()
{
	/**
	 * After display of add contact form, Fills name with tweet owner's name in
	 * add-contact popup form.
	 */
	$('body').on('click', '.add-twitter-contact', function(e)
	{
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));

		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(streamId);

		// Get tweet from stream.
		var tweet = modelStream.get('tweetListView').get(tweetId).toJSON();

		// Tweet owner's full name.
		var fullName = tweet.user.name;

		// Tweet owner's description.
		var description = tweet.user.description;

		// Tweet owner's handle/Screen name.
		Tweet_Owner_For_Add_Contact = tweet.user.screen_name;

		// Separate full name.
		var firstName = fullName.substr(0, fullName.indexOf(' '));
		var lastName = fullName.substr(fullName.indexOf(' ') + 1);

		// Add values in add contact form.
		$("#fname", $('#personModal')).attr("value", firstName);
		$("#lname", $('#personModal')).attr("value", lastName);
		$("#job_title", $('#personModal')).attr("value", description);

		document.getElementById("network_handle").className = 'socialsuite-network-handle';
		$("#handle", $('#personModal')).attr("value", Tweet_Owner_For_Add_Contact);

		// Add website / handle of twitter of tweet owner.
		$("#website", $('#personModal')).attr("value", Tweet_Owner_For_Add_Contact);
		$("#image", $('#personModal')).attr("value", tweet.user.profile_image_url);

		// Select network type.
		$("div.website select").val("TWITTER");

		// If picture is not null and undefined, display it by given width, else
		// display none
		var pic = tweet.user.profile_image_url;
		if (pic != undefined && pic != null)
		{
			var el = $('<img class="imgholder thumbnail person-img" onload="changeProperty()" style="display: inline;"  src="' + pic + '"></img>');
			$('#pic').html(el).show();
			$("img").error(function()
			{
				$('#pic').css("display", "none");
			});
		}

		// As per pic property need to change social suites element property.
		changeProperty();
	});

	// Hide network handle from add contact form.
	$('#personModal').on('hidden.bs.modal', function()
	{
		document.getElementById("network_handle").className = 'network-handle';
		document.getElementById("handle").className = '';
		$('#pic').css("display", "none");
		$('#pic').empty();
		changeProperty();
	});

	// If img is shown then reduce size of network handle on add contact form.
	$('#personModal').on('shown.bs.modal', function()
	{
		changeProperty();
	});
	$('#personModal').on('show.bs.modal', function()
	{
		changeProperty();
	});
	$("#pic").change(function()
	{
		changeProperty();
	});
});
