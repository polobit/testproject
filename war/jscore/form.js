function serializeForm(form_id) {
	
	var arr = $('#' + form_id).serializeArray(),
        obj = {};
	
	 // Serialize Checkbox
    arr = arr.concat(
    $('#' + form_id + ' input[type=checkbox]').map(
    function () {
    	return {
            "name": this.name,
            "value": $(this).is(':checked')
        }
    }).get());
    
    // Change the dates properly from human readable strings to epoch
    arr = arr.concat($('#' + form_id + ' input[type=date_input]').map(
   	    function () {
    	     return {
    	            "name" : this.name,
    	            "value": new Date(this.value).getTime() / 1000.0	
    	        };
    	    }).get());
    
    // Serialize tags
    arr = arr.concat( $('#' + form_id + ' .tags').map(
    		 function () {
    			 var values = [];
    			 
    			 if(!isArray($(this).children()));
    			 	
    			 $.each($(this).children(), function(index, data) { 
    				 values.push(($(data).val()).toString())
 	            	
 	            });
    			 
        	     return {
        	            "name" : $(this).attr('name'),
        	            "value":values
        	        };
        	    }).get() );
    
    
    // Multiple select 
    arr = arr.concat( $('#' + form_id + ' .multiSelect').map( 
    		function() {
       			var fields_set = [];
       			
    			// Get list of options
    			$.each($(this).children('li'), function(index, data) { 
    				fields_set.push(($(data).attr('ms-value')))
	            });

    			return {
    			"name" : $(this).attr('name'),
    			"value" : fields_set
    			};
    		}).get() );
    
    // Serialize Filters
    var json_array = [];
    arr = arr.concat( $('#' + form_id + ' .chained').map(
    		function(){
    			
    			var json_object = {};
    			$.each($(this).find('div').children(), function(index, data) {
    				// Name of 'div'
    				var name = $(data).parent().attr('name');
    				
    				var value;
    				if($(data).hasClass("date"))
    					{
    						value = new Date($(data).val()).getTime();
    					}
    				// Value of input/select
    				else
    					var value = $(data).val();
    				
    				// Set if value of input/select is valid
    				if(value != null && value != "")
    					json_object[name] = value;
    			});
    			
    			json_array.push(JSON.stringify(json_object));
    			
    		return {
    			"name" : "rules",
    			"value" : json_array
    			};
    		
    	}).get() );
    
    
    // Convert array into JSON
    for (var i = 0; i < arr.length; ++i)  {
    	obj[arr[i].name] = arr[i].value;
    }

  //  obj[ $('#' + form_id + ' select').attr('name') ] = $('#' + form_id + ' select').val();
    return obj;
}

// Deserialize Form
function deserializeForm(data, form)
{
	$.each(data, function(i, el) {
	      var 
	          fel = form.find('*[name="' + i + '"]'),
	          type = "", tag = "";
	      
	      
	       if (fel.length > 0) {
	    	   
	           tag = fel[0].tagName.toLowerCase();
	           
	           if (tag == "select" || tag == "textarea") { //...
	        	   $(fel).val(el);
	           }
	           else if (tag == "input") 
	           {
	              type = $(fel[0]).attr("type");
	               if (type == "text" || type == "password" || type == "hidden") {
	            	   fel.val(el);
	               } 
	               else if (type == "checkbox") {
	            	   if (el)
		                  {  
		                	  if(el == true)
		                		  fel.attr("checked", "checked"); 
		                  
		                	  // Set all values as true by default for serialization to work
		                	  fel.val("true");
		                  }
	               }
	               else if (type == "radio") {
	                   fel.filter('[value="'+el+'"]').attr("checked", "checked"); 
	               }
	           }
	    
	           // Deserialize tags
	           else if(fel.hasClass('tags') && tag == "ul")
	          {
	        	   if(!isArray(el))
	        		   {
	        		   		el = [el];
	        		   }
	        	  
	        	  $.each(el, function(index, contact){
	                   var tag_name;
	                   var tag_id = contact.id;
	                   tag_name = getPropertyValue(contact.properties, "first_name") + getPropertyValue(contact.properties, "last_name");
	                   $('.' + fel.attr('class'), form).append('<li class="label label-warning" value="'+tag_id+'" style="display: inline-block; vertical-align: middle; margin-right:3px; ">'+tag_name+'<a class="icon-remove" id="remove_tag"></a></li>');
	                  });	        	    
	           }
	           
	           // Deserialize multiselect
	           else if(fel.hasClass('multiSelect') && tag == 'ul') 
	           {
	        		$.each(el, function(index, option){
	        			$('#multipleSelect', form).multiSelect('select', option);
	        	   }); 
	           }
	           
	           // Deserialize chained select
	           else if(fel.hasClass('chainedSelect'))
	           {
	        	   // Iterates through JSON array of rules
	        	   $.each(el, function(index, data){
	        		
	        		   // Finds the rule html element
	        		   var rule_element = ($(form).find('.chained'))[0];
	        		
	        		   // If more than one rule clone the fields and relate with jquery.chained.js
	        		   if(index > 0)
	        				{
	        					var parent_element = $(rule_element).parent();
	        					
	        					// Get the Template for input and select fields 
	        					rule_element = $(getTemplate("filter-contacts", {})).find('tr').clone();
	        					
	        					// Add remove icon for rule
	        					$(rule_element).find("i.filter-contacts-multiple-remove").css("display", "inline-block");
	        					
	        					// Load jquery chained plugin for chaining the input fields
	        					head.js('lib/jquery.chained.min.js', function(){
	        						
	        						// Chaining dependencies of input fields with jquery.chained.js
	        						$('#secondSelect', rule_element).chained($('#firstSelect', rule_element));
	        						$('#thirdSelect', rule_element).chained($('#secondSelect', rule_element));
	        						$("#fourthSelect", rule_element).chained($('#firstSelect', rule_element));
	        				
	        						$(parent_element).append(rule_element);
	        					});
	        				}
	        		   
	        		   $.each(JSON.parse(data), function(i, value) {
	        			
	        			   var input_element = ($(rule_element).find('*[name="' + i + '"]').children())[0];
	        			
	        			   // If input field set value for input field
	        			   if(input_element.tagName.toLowerCase() == "input")
	        			   {
	        				   $(input_element).val(value);
	        				   return;
	        			   }
	        			
	        			   // Get Related Select field
	        			   var option_element = $(input_element).children()
	        			
	        			   // Iterate through options in select field
	        			   $.each(option_element, function(index, element)
	        				{
	        				   // Select the option
	        				   if($(element).attr('value') == value)
	        						{
	        							$(element).attr("selected","selected");
	        							$(input_element).trigger("change");
	        							return;
	        						}
	        				});
	        		   });
	        	   })   
	           	}   
	        }

	});
}


function isValidForm(form) {
    
	 console.log($(form).html());
	 console.log("Validating form");
    
	 
	    $(form).validate({
	        debug: true,
	        errorElement: 'span',
	        errorClass: 'help-inline',
	        highlight: function (element, errorClass) {     
	  	      $(element).closest(".control-group").addClass('error'); 
	        },
	        unhighlight: function (element, errorClass) {
	        	 $(element).closest(".control-group").removeClass('error'); 
	        },
	        invalidHandler: function (form, validator) {
	            var errors = validator.numberOfInvalids();
	        }
	    })	
	
    return $(form).valid();
}