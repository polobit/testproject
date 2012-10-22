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
	
	
    
    //Show message 
    $save_info = $('<img src="img/1-0.gif" height="18px" width="18px"></img>&nbsp;&nbsp;<span><p class="text-success" style="color:#008000; font-size:15px; display:inline-block"> <i>Sending mail...</i></p></span>');
    $("#msg", this.el).append($save_info);
	$save_info.show().delay(2000).fadeOut("slow");
	
	$.post(url,function(){
		
		// Reset form after sending email
        $("#helpmailForm").each(function () {
            this.reset();
        });
        
	});
  
});
});