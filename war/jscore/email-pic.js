$(function(){ 
    	// Show picture if email is valid
		$('#email').live('focusout', function (e) {
			e.preventDefault();	
			var val = $("#email").val();
				var pic = getPicByEmail(val, 45);
				if(pic != undefined && pic != null)
				{
					var el = $('<img class="imgholder" style="padding-left:20px;" src="'+ pic +'"></img>');
					$('#pic').html(el).show();
				}
		});
});

function getPicByEmail(email, width)
{
	if (email) {
		console.log(email);
		return'https://secure.gravatar.com/avatar/' + MD5(email)
				+ '.jpg?s=' + width+'&d=404';
	}	
}