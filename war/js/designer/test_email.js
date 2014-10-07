$(function(){
	
$("#button_email").die().live("click", function(e){
    e.preventDefault();
    
    if($('#button_email').is(':disabled'))
    return;
   
    $('#button_email').attr('disabled', 'disabled');
    
    $("#button_email").before("<span id='confirmation-text'style='margin: 5px 2px 0px;display: inline-block;text-align: center;float: left;width: 75%; color: red;font-style: italic;'></span>");
	  
    var fromEmailValidator = $("#from_email").validator();  
    if(!fromEmailValidator.data("validator").checkValidity()){
    	$("#confirmation-text").text("From_email - Please complete this mandatory field.");
    	 $("#confirmation-text").fadeOut(5000,function(){
			  $(this).remove();
			  $('#button_email').removeAttr('disabled', 'disabled');
		  });
    	 $('#button_email').removeAttr('disabled', 'disabled');
    	return;
    }
    
    var subjectValidator = $("#subject").validator(); 
    if(!subjectValidator.data("validator").checkValidity()){
    	$("#confirmation-text").text("Subject - Please complete this mandatory field.");
    	$("#confirmation-text").fadeOut(5000,function(){
			  $(this).remove();
			  $('#button_email').removeAttr('disabled', 'disabled');
		  });
    	
    	return;
    }
    
    
    var texValidator = $("#text_email").validator(); 
    var htmlEmailValidator = $("#tinyMCEhtml_email").validator(); 
    
    if(!htmlEmailValidator.data("validator").checkValidity() || !texValidator.data("validator").checkValidity() ){
    	$("#confirmation-text").text("Text - Please complete this mandatory field.  ");
    	$("#confirmation-text").fadeOut(5000,function(){
			  $(this).remove();
			  $('#button_email').removeAttr('disabled', 'disabled');
		  });
    	
    	return;
    }
    $("#confirmation-text").remove();
    	
    
        var jsonValues = serializeNodeForm();
        
        $.ajax({
    		  url: 'core/api/emails/send-test-email',
    		  type: "POST",
    		  data:jsonValues,
    		  async:false,
    		  success: function (email) {
    			  $("#button_email").before("<span id='confirmation-text'style='margin: 5px 2px 0px;display: inline-block;text-align: center;float: left;width: 75%; color: red;font-style: italic;'>Email has been sent to "+email+"</span>");
    			  $("#confirmation-text").fadeOut(5000,function(){
    				  $("#confirmation-text").remove();
    				  $('#button_email').removeAttr('disabled', 'disabled');
    			  });
    		},
    		error: function(Error){
                console.log(Error);
            }
    	});
        
        });
});
