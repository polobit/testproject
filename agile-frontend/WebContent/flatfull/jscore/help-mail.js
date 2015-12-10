/**
 * help-mail.js deals with functions like building url by parsing form data,
 * showing message while sending mail, resetting form data after sending mail.
 * 
 * @module jscore
 */

/**
 * Serialize form data, build url, show message, reset form fields.
 * 
 * @param #helpmailForm
 */
$(function() {
	
/*	// To toggle the contact us email
	$("#show_support").live("click", function(e){
		  e.preventDefault();
		  $("#content").html(getTemplate("help-mail-form"), {});
		 // $("#helpmailForm").toggle();
		 // $('html, body').animate({ scrollTop : 360  },1000);
	});*/

	// Prevent default on click
	$("body").on('click', '#helpMail', function(e){
		e.preventDefault();

		if($(this).attr('disabled'))
	   	     return;
		
		// If not a valid form return else serialize form data to parse
		if(!isValidForm($("#helpmailForm")))
			return;
		
		// Disables send button and change text to Sending...
		disable_send_button($(this));
		
		var json = serializeForm("helpmailForm");

		json.from = CURRENT_DOMAIN_USER.email;
		
		// Replace \r\n with <br> tags as email is sent as text/html
		json.body = json.body.replace(/\r\n/g,"<br/>");
        

        $.ajax({
		
				type : 'POST',
				data : json,
				url : 'core/api/emails/contact-us',
				success : function()
						{

							// Reset form fields after sending email
							$("#helpmailForm").each(function () {
								this.reset();
							});
			
							// Show message and gif while sending mail and fadeout
							$save_info = $('<span class="text-success" style="color:#008000; font-size:15px; display:inline-block"><i> Email Sent</i></span>');
							$('#msg').append($save_info);
							$save_info.show().delay(1000).fadeOut("slow", function(){
				
								// Enables Send Email button.
			    				enable_send_button($('#helpMail'));
				
								//$("#helpmailForm").hide();
								
								window.history.back();
								});
						},
						error : function(response)
								{
									enable_send_button($('#helpMail'));

									// Show cause of error in saving
									$save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>' + response.responseText + '</i></p></small></div>');

									// Appends error info to form actions
									// block.
									$($('#helpMail')).closest(".form-actions", this.el).append($save_info);

									// Hides the error message after 3
									// seconds
									if (response.status != 406)
										$save_info.show().delay(10000).hide(1);
								}
				});
	});
});