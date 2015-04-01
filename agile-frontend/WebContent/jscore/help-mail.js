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
	$("#show_support").die().live("click", function(e){
		  e.preventDefault();
		  $("#content").html(getTemplate("help-mail-form"), {});
		 // $("#helpmailForm").toggle();
		 // $('html, body').animate({ scrollTop : 360  },1000);
	});*/

	// Prevent default on click
	$('#helpMail').die().live('click', function(e){
		e.preventDefault();

		if($(this).attr('disabled'))
	   	     return;
		
		// If not a valid form return else serialize form data to parse
		if(!isValidForm($("#helpmailForm")))
			return;
		
		// Disables send button and change text to Sending...
		disable_send_button($(this));
		
		var json = serializeForm("helpmailForm");
		
		// Replace \r\n with <br> tags as email is sent as text/html
		json.body = json.body.replace(/\r\n/g,"<br/>");
        
		// Build url
		var url =  'core/api/emails/contact-us?from=' + encodeURIComponent(CURRENT_DOMAIN_USER.email) + '&to=' + 
		encodeURIComponent(json.to) + '&subject=' + encodeURIComponent(json.subject) + '&body=' + 
		encodeURIComponent(json.body);

		$.post(url,function(){

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
		    
		});
	});
});