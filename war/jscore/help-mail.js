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
	
	 $("#show_support").die().live("click", function(e){
		  e.preventDefault();
		  $("#helpmailForm").toggle();
		 });

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
		var url =  'core/api/emails/send-email?from=' + encodeURIComponent(json.from) + '&to=' + 
		encodeURIComponent(json.to) + '&subject=' + encodeURIComponent(json.subject) + '&body=' + 
		encodeURIComponent(json.body);

    	// Show message and gif while sending mail and fadeout
//		$save_info = $('<img src="img/1-0.gif" height="18px" width="18px"></img>&nbsp;&nbsp;<span><p class="text-success" style="color:#008000; font-size:15px; display:inline-block"> <i>Sending mail...</i></p></span>');
//		$("#msg", this.el).append($save_info);
//		$save_info.show().delay(2000).fadeOut("slow");

		$.post(url,function(){

			// Reset form fields after sending email
			$("#helpmailForm").each(function () {
				this.reset();
			});
			
			// Enables Send Email button.
		    enable_send_button($('#helpMail'));
		    window.history.back();
		});
	});
});