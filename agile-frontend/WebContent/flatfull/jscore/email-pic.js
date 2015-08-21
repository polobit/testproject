/**
 * email-pic.js contains functions which fetch the picture
 * if its a valid email and get the picture by the email
 * 
 * @module jscore
 */
$(function()
{
	
	/*// Using initials as image 
	$('body').live('agile_collection_loaded', function(event, element)
	{
		$(".img-inital").closest("img").error(function()
		{
			$(this).initial({charCount: 2});
		});

	});*/
	
	//prevent default focusout of email
	$("#content").on('focusout', '#email', function(e)
	{
		e.preventDefault();

		// If length of email is 0, do not display picture
		var val = $("#email").val();
		if (val.length == 0)
		{
			$('#pic').css("display", "none");
			changeProperty();
			return;
		}
		
		// If picture is not null and undefined, display it by given width, else display none
		var pic = getPicByEmail(val, 45);
		if (pic != undefined && pic != null)
		{
			var el = $('<img class="imgholder thumbnail person-img" onload="changeProperty()" style="display: inline;"  src="' + pic + '"></img>');
			$('#pic').html(el).show();
			$("img").error(function()
			{
				$('#pic').css("display", "none");
				changeProperty();
				
			});
		}
	});
});

function getPicByEmail(email, width)
{
	//get picture by email from gravatar.com
	if (email)
	{
		return 'https://secure.gravatar.com/avatar/' + Agile_MD5(email) + '.jpg?s=' + width + '&d=404';
	}
}
