// Initiliaze form validator
function initValidator(selector, callback) {
	
	var handlebar_regex = /{{[a-zA-Z0-9\s_.-]*[a-zA-Z0-9\s]}}/;
      
	// Multiple Emails validator separated by comma
	$.tools.validator.fn("[type=multipleEmails]", "Please enter valid email each separated by comma.", function(input, value) {
		
		if(value == '')
			return true;
		
        var emails = value.split(/[,]+/); // split element by , 
        valid = true;
        
        // Allow email or merge field. For e.g., Validates "abc@gmail.com, {{email}}" as true
        // var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var re = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        for (var i in emails) {
        	value = emails[i];
            valid = valid && (re.test($.trim(value)) || handlebar_regex.test($.trim(value)));
        }
        return valid;
        
	  });
	
	  // Tags Validation
	  $.tools.validator.fn("[name=tag_names]", "Tag name should start with an alphabet and can not contain special characters other than underscore and space", function(input, value){
		  
		  if(value == '')
				return true;
			
	        var tags = value.split(/[,]+/); // split element by , 
	        valid = true;
	        
	     for(var i in tags){
	    	 var tag = $.trim(tags[i]);
	    	 
	    	 if(tag)
	    		 valid = valid && (window.parent.isValidTag(tag) || handlebar_regex.test(tag));
	     }
	     
	     return valid;
		  
	  });
	  
	  // From email validation
	  $.tools.validator.fn("[type=verified_email]", "From email is not verified. Please verify it.", function(input, value){
		  
	     if(input && input.prop("tagName") == "SELECT")
	    	return input.find('option:selected').attr('unverified') ? false : true;
		  
	     return true;
	     
	  });

	  // Merge Fields validation
	  $.tools.validator.fn(function(){
	  		return ($(this).is('input') || $(this).is('textarea'))
	  }, 
	  function(input, value){

	     if(!value)
			value = "";

		 // match works only on strings
		 if(typeof value !== "string")
		 	value = String(value);
		        
        // Regex to identify merge fields
        var reg = /{{[a-zA-Z0-9\s_.,&/\\*-]*[a-zA-Z0-9\s]}(?!})|{{{[a-zA-Z0-9\s_.,&/\\*-]*[a-zA-Z0-9\s]}}(?!})/g;

         var merge_fields = value.match(reg);

        for (var i in merge_fields) {
           return "Parse error. Please correct " + merge_fields[i] + "}.";
        }

        return true;
	     
	  });
	
    // Adds wall effect to show the the first error
    $.tools.validator.addEffect("wall", function (errors, event) {

        //show single error message (Ramesh 06/09/2010)
        //check errors is array
        
        if(errors instanceof Array){
        
           //if errors are avilable ,display first one
           if(errors.length > 0 ){
           
              error = errors[0];
              // Adds ui-state-error class to show the user of the faulty element	
              error.input.addClass('ui-state-error');
              
               //get the name of the field
               var name = error.input.attr("name");
               var err_name = error.input.attr("name_on_error");
               
               // Changes name attribute e.g., dynamic-grid
               if(err_name)
                   name = err_name;

               if(name == "html_email" || name == "text_email")
                   name = name.replace('_email', '').toUpperCase();
               
               name = ucwords(name);
               
               console.log(name);
              // Show the error message in errorsdiv container
             //  selector.find("#errorsdiv").html("<p>" + error.messages[0] + " - <strong>" + name + "</strong> " + "</p>").addClass('ui-state-highlight');
			 // Dispaly field name and message(Ramesh(27 Sep 2010))
              selector.find("#errorsdiv").html("<p> <strong>" + name  + "</strong> - " + error.messages[0]+ "</p>").addClass('ui-state-highlight');
               
           
           }
          
        }
      else{
        // add new ones
        $.each(errors, function (index, error) {

 	    // Adds ui-state-error class to show the user of the faulty element	
            error.input.addClass('ui-state-error');

            // Show the error message in errorsdiv container
			// selector.find("#errorsdiv").html("<p>" + error.messages[0] + " - <strong>" + error.input.attr("name") + "</strong> " + "</p>").addClass('ui-state-highlight');

			// Dispaly field name and message(Ramesh(27 Sep 2010))
			selector.find("#errorsdiv").html("<p> <strong>" + name  + "</strong> - " + error.messages[0]+ "</p>").addClass('ui-state-highlight');
            return;
        });
          }

    }, function (inputs) {
	
	// Remove error and remove errorsdiv highlight
        selector.find("#errorsdiv").html("").removeClass('ui-state-highlight');
        selector.find(".ui-state-error").removeClass('ui-state-error');

    });

    // Create validator
    var inputs = selector.find("form").validator({
        effect: 'wall'
    }).submit(function(e){
           //  e.preventDefault();
            // verify the count of the table rows (Ramesh(23-09-10))
            var saveflag = true;
	        var keys = [];  
	        selector.find("table").each(function (tableIndex, eachTable) {
					if($(eachTable).find("tbody > tr").length == 0){

					          keys.push($(this).parents('div .ui-tabs-panel').attr('id'));
					          keys.push($(this).attr("id"));
            		   		  saveflag = false;
				
					}
  			});

  			
	        //special condition to skip the error message for and_key_grid-table
	        if(keys[1] == "and_key_grid-table" || keys[1] == "or_key_grid-table" )
	        {
	        	if($('#and_key_grid-table tr').length > 1  || $('#or_key_grid-table tr').length > 1)
	        	{
	        	saveflag = true;
	        	}
	        }

	    	var selector_ele = selector;
	    	var isValid =  isCheckFlagUpdateDeal();
	    
	    	if(!isValid){
        	    errorMessageUpdateDeal(selector_ele);
				return;
	    	}   

	    	//validate for call node
	    	var isValidCallNode =  isCheckFlagCallNode();
	    
	    	if(!isValidCallNode){
        	    errorMessageCallNode(selector_ele);
				return;
	    	} 
  	        //if errors show single message
	   		if(!saveflag){
				  
				   // Show Grid error  (Ramesh(27 Sep 2010))
	   			if(keys[1] == "and_key_grid-table" || keys[1] == "or_key_grid-table" )
		        {
	   				selector.find("#errorsdiv").html("<p> Please add atleast one condition </p>").addClass('ui-state-highlight');
	   			  
		        }
		             
	   			else
	   			{  
	   		     selector.find("#errorsdiv").html("<p> <strong>" + keys[1]  + "</strong> -Please add data inside <strong>"+ keys[0] +"</strong></p>").addClass('ui-state-highlight');
	   			}
	   		}
	   		//if no errors (i.e all table elements are filled)
	   		else{
	   		       
					// client-side validation OK.
					if (!e.isDefaultPrevented()) 
					callback(e, selector);    			    		
				
					// prevent default form submission logic
				    e.preventDefault();
   	    	
	        }
  	 

    	});    


}

function isCheckFlagUpdateDeal()
{
	var errorflag = true;

		if($('#expected_value') && $('#milestone') ){
	        
	        	if($('#expected_value').val()=="" && $('#milestone').val()=="")
		        	errorflag = false;

		    	else if(!isNaN($('#expected_value').val()) && $('#expected_value').val()<0)
					errorflag = false;				
		}	
		return errorflag;
}

function errorMessageUpdateDeal(selector)
{
	       
	        	if($('#expected_value').val() == "" && $('#milestone').val() == "")
	   				selector.find("#errorsdiv").html("<p> Please complete any one of the fields. </p>").addClass('ui-state-highlight');
		       
		        else if(!isNaN($('#expected_value').val()) && $('#expected_value').val()<0){

		        	$('#expected_value').css("border", "1px solid red");
		        	selector.find("#errorsdiv").html("<p> <strong> Value </strong> - Please enter a value greater than or equal to 0.</p>").addClass('ui-state-highlight');
				
				}			
			
		
}

function isCheckFlagCallNode()
{
	var errorflag = true;

		if($('#phonenumber2') && $('#message') ){
	        
	        	if($('#message').val()=="" && $('#phonenumber2').val()=="")
		        	errorflag = false;			
		}	
		return errorflag;
}
function errorMessageCallNode(selector)
{
	if($('#phonenumber2').val() == "" && $('#message').val() == "")
	   	selector.find("#errorsdiv").html("<p><strong>Message<strong> or <strong>Call Back Number<strong>-Please complete atleast one of this fields. </p>").addClass('ui-state-highlight');		       
	        	
}