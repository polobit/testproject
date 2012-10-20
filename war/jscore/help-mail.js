$(function() {
// Help mail
$('#helpMail').die().live('click',function(e){
	e.preventDefault();
	
	  if(!isValidForm($("#helpmailForm")))
      {	
      	return;
      }
	var json = serializeForm("helpmailForm");
	var url =  'core/api/send-email?from=' + encodeURIComponent(json.from) + '&to=' + 
	   										 encodeURIComponent(json.to) + '&subject=' + encodeURIComponent(json.subject) + '&body=' + 
	   										 encodeURIComponent(json.body);
	
	$.post(url,function(){
		
		// Reset form after sending email
        $("#helpmailForm").each(function () {
            this.reset();
        });
        
        //Show success message 
        $save_info = $('<span style="display:inline-block"><small><p class="text-success" style="color:#008000; font-size:14px"><i>Your mail received successfully.Thank you for contacting us.</i></p></small></span>');
        $("#msg", this.el).append($save_info);
    	$save_info.show().delay(2000).fadeOut("slow");
    	
	});
  
});
});