/**
 * email-pic.js contains functions which fetch the picture
 * if its a valid email and get the picture by the email
 * 
 * @module jscore
 */
$(function()
{
	//prevent default focusout of email
	$('#email').live('focusout', function(e)
	{
		e.preventDefault();

		//if length of email is 0, do not display picture
		var val = $("#email").val();
		if (val.length == 0)
		{
			$('#pic').css("display", "none");
			return;
		}
		//if picture is not null and undefined, display it by given width, else display none
		var pic = getPicByEmail(val, 45);
		if (pic != undefined && pic != null)
		{
			var el = $('<img class="imgholder thumbnail person-img" style="display: inline;" src="' + pic + '"></img>');
			$('#pic').html(el).show();
			$("img").error(function()
			{
				$('#pic').css("display", "none");
			});
		}
	});
});

function getPicByEmail(email, width)
{
	//get picture by email from gravatar.com
	if (email)
	{
		return 'https://secure.gravatar.com/avatar/' + MD5(email) + '.jpg?s=' + width + '&d=404';
	}
}
