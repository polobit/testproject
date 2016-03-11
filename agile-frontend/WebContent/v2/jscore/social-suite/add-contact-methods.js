/**
 * Calls from onload of Profile image on add contact form to fill account
 * holder's name in Form.
 */
function onloadProfileImg()
{
	// Save button for twitter on addStreamModal is shown.
	$('#add_twitter_stream').show();

	getTemplate('twitter-stream-type', {}, undefined, function(template_ui){
		if(!template_ui)
			  return;

		// Add twitter stream types template.
		$("#streamDetails").html($(template_ui));

		// Add profile image to account description.
		$('#twitter_profile_img').attr("src", document.getElementById("twitter_profile_img_url").src);

		// Add screen name to label.
		document.getElementById('account_description_label').innerHTML = '<b>' + $('#twitter_account').val() + '</b>';

	}, "#streamDetails");
	
}

// Add website and select network on continue form in add contact form flow for update page.
function socialsuite_add_website()
{
	if (Tweet_Owner_For_Add_Contact != null)
	{
		// Add values in continue form after add contact form.
		// Add website / handle of twitter of tweet owner.
		$("#website", $('#continueform')).attr("value", Tweet_Owner_For_Add_Contact);

		// Select network type.
		$("div.website select").val("TWITTER");

		Tweet_Owner_For_Add_Contact = null;
	}
}

/*
 * Change property of website and select network in add contact form. When email
 * id is entered, pic is related to that. When email id is not there so twitter
 * profile image is selected. There is some error already, so to adjust size of
 * image and twitter handle text size as per that.
 */
function changeProperty()
{
	try{
		var display = $('#network_handle', $('#personModal')).css("display");
		var picDisplay = $("#pic", $('#personModal')).css("display");
		var picValue = $("#pic", $('#personModal')).html();

		var $networkEle = $("#network_handle");
		var $handle = $("#handle");;

		if ((picDisplay == 'inline' || picDisplay == 'block') && picValue != '')
		{
			if (display == 'none')
				$networkEle.removeAttr('class').addClass('after-img-load-hide');
			else if (display == 'block')
				$networkEle.removeAttr('class').addClass('after-img-load-show');

			$handle.removeAttr('class').addClass('add-form-input');
		}
		else if ((picDisplay == 'none' || picDisplay == null || picDisplay == '') || (picValue == null || picValue == ''))
		{
			if (display == 'none')
				$networkEle.removeAttr('class').addClass('network-handle');
			else if (display == 'block')
				$networkEle.removeAttr('class').addClass('socialsuite-network-handle');

			$handle.removeAttr('class');
		}

	}catch(e){}
}
