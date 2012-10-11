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
    arr = arr.concat($('#' + form_id + ' input.date').map(
   	    function () {
    	     return {
    	            "name" : this.name,
    	            "value": new Date(this.value).getTime()/1000
    	        };
    	    }).get());
    
    // Serialize tags
    arr = arr.concat(getTags(form_id));
    
    
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
    
    // Serialize Filters chained select
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
	              
	              if(fel.hasClass('date'))
	               {
	            	  fel.val(new Date(el*1000).format('mm-dd-yyyy'));
	            	  
	            	  	fel.datepicker({
	            	  		format: 'mm-dd-yyyy',
	                        });
	               } 
	              else if (type == "text" || type == "password" || type == "hidden") {
	            	   fel.val(el);
	               }
	              else if(tag =="select")
	              {
	            	  console.log("test");
	            	  fel.val(el).trigger('change');
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
	           else if(fel.hasClass('tagsinput') && tag == "ul")
	          {
	        	   if(!isArray(el))
	        		   {
	        		   		el = [el];
	        		   }
	        	  
	        	  $.each(el, function(index, contact){
	                   var tag_name;
	                   var tag_id = contact.id;
	                   tag_name = getPropertyValue(contact.properties, "first_name") + " " + getPropertyValue(contact.properties, "last_name");
	                   $('.tagsinput', form).append('<li class="tag" value="'+tag_id+'" class="tag"  style="display: inline-block; ">'+tag_name+'<a class="close" id="remove_tag">&times</a></li>');
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
	        					head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function(){
	        						
	        						// Chaining dependencies of input fields with jquery.chained.js
	        						$('#condition', rule_element).chained($('#LHS', rule_element));
	        						$("#RHS", rule_element).chained($('#LHS', rule_element));
	        						$('#RHS-NEW', rule_element).chained($('#condition', rule_element));
	        				
	        						$(parent_element).append(rule_element);
	        					});
	        				}
	        		   
	        		   $.each(JSON.parse(data), function(i, value) {
	        			
	        			   var input_element = ($(rule_element).find('*[name="' + i + '"]').children())[0];
	        			
	        			   // If input field set value for input field
	        			   if(input_element.tagName.toLowerCase() == "input")
	        			   {
	        				
	        				   if($(input_element).hasClass('date'))
	        					  {
	        					   $(input_element).val(new Date(value).format('mm-dd-yyyy'));
	        					   $(input_element).datepicker({
	        					   		format: 'mm-dd-yyyy',
	        					   	});
	        					   	return;
	        					  }
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

// To deserialize multiple forms in content
function deserializeMultipleForms(data, form)
{
	$.each(form, function(index, form_element){
		var key = $(form_element).attr('name');

		// If form have attribute name deserialize with particular object
		if(key && data[key])
			{
				deserializeForm(data[key], $(form_element));
			}
		
		else
			deserializeForm(data, $(form_element));
	});
}

function isValidForm(form) {
	
	 // Credit card validation to check card is valid for next 3 months
	 jQuery.validator.addMethod("atleastThreeMonths", function(value, element) {
		 
		 var month = $(element).siblings('select.exp_month').val(),
				year = value;
		 	
		 	// date selected
		 	var date = new Date().setFullYear(year, month-1);
		 	
		 	var one_day = 1000*60*60*24;
		 	
		    return this.optional(element) || (((date - new Date().getTime())/one_day) > 90);
		}, "*Card should be atleast 3 months valid");
	
	
	
	
	    $(form).validate({
	    	 rules : {
	    		 atleastThreeMonths : true
	    	    },
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