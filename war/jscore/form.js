function serializeForm(form_id) {
	
	var arr = $('#' + form_id).serializeArray(),
        obj = {};
    // Checkboxes are not serialized
    arr = arr.concat(
    $('#' + form_id + ' input[type=checkbox]:not(:checked)').map(
    function () {
        return {
            "name": this.name,
            "value": false	
        }
    }).get());
    
    // Change the dates properly from human readable strings to epoch
    arr = arr.concat($('#' + form_id + ' input[type=date]').map(
   	    function () {
    	     return {
    	            "name" : this.name,
    	            "value": new Date(this.value).getTime() / 1000.0	
    	        };
    	    }).get());
    
    // Serialize tags
    arr = arr.concat( $('#' + form_id + ' ul').map(
    		 function () {
    			 var values = [];
    			 
    			 $.each($(this).children(), function(index, data) { 
 	            	values.push(($(data).val()).toString())
 	            	
 	            });
    			 
        	     return {
        	            "name" : $(this).attr('name'),
        	            "value":values
        	        };
        	    }).get() );
    
    
    // Multiple select
    arr = arr.concat({"name": $('#' + form_id + ' select').attr('name'), "value": $('#' + form_id + ' select').val()})

    
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
		                	  if(el == "true")
		                		  fel.attr("checked", "checked"); 
		                  
		                	  // Set all values as true by default for serialization to work
		                	  fel.val("true");
		                  }
	               }
	               else if (type == "radio") {
	                   fel.filter('[value="'+el+'"]').attr("checked", "checked"); 
	               }
	               
	           }
	           
	           // Deserailize contact tags
	           else if(fel.attr('id') && tag == "ul")
	           {
	        	   var tag_value;
	        	   var tag_name;
	        	   if(isArray(el)) 
	        	   {
	        		   $.each(el, function(index, element) {
	        			  id=element.id;
	        			   $.each(element.properties, function(index, element){
	        				  if(element.name == "first_name")
	        					  {
	        					  	tag_name = element.value;
	        					  }
	        			   });
	        			  $('#' + fel.attr('id'),form).append('<li class="contact_tags label label-warning" value='+tag_value+' >'+tag_name+'<a class="icon-remove" id="remove_tag"></a></li>');
	        		   });
	        	   }
	        	   else
	        	   {
	        		   var tag_value = el.id;
	        		   $.each(el.properties, function(index, element){
	        			   if(element.name == "first_name")
     					  {
     					  	tag_name = element.value;
     					  }
	        		   })
	        		   $('#' + fel.attr('id'),form).append('<li class="contact_tags label label-warning" value='+tag_value+' >'+tag_name+'<a class="icon-remove" id="remove_tag"></a></li>');
	        	   }
	           }
	         }

	});
}


function isValidForm(form) {
    
	 //console.log($(form).html());
    
	    /*$(form).validate({
	        debug: true,
	        errorElement: 'span',
	        errorClass: 'help-inline',
	        highlight: function (element, errorClass) {
	
	            console.log($(element).html());
	            $(element).parent().parent().addClass('error');
	        },
	        unhighlight: function (element, errorClass) {
	            $(element).parent().parent().removeClass('error');
	        },
	        invalidHandler: function (form, validator) {
	            var errors = validator.numberOfInvalids();
	            // alert("errors " + errors);
	        }
	    })*/
	
	$('form').validate({
	    errorClass:'error',
	    validClass:'success',
	    errorElement:'span',
	    highlight: function (element, errorClass, validClass) { 
	        $(element).parents("div[class='clearfix']").addClass(errorClass).removeClass(validClass); 
	    }, 
	    unhighlight: function (element, errorClass, validClass) { 
	        $(element).parents(".error").removeClass(errorClass).addClass(validClass); 
	    }
	});	

    return $(form).valid();
}

