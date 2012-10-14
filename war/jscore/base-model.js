/*!JSCore*/
var Base_Model_View = Backbone.View.extend({
    events: {
        "click .save": "save",
        "click .delete": "deleteItem"   	        	
    },
    initialize: function () {
        _.bindAll(this, 'render', 'save', 'deleteItem'); // every function that uses 'this' as the current object should be in here 
        
        
           if (this.options.data != undefined) 
        	   this.model = new Backbone.Model(this.options.data);
           else if(this.options.model)
           		this.model = this.options.model; 
           else
        	   this.model = new Backbone.Model({});
        
        
        this.model.bind("change", this.render, this); // Change is triggered after modal is downloaded	  
       
        if (this.options.url) {
            this.model.url = this.options.url;
        }
        
        if(!this.options.isNew)
        	{
        		var that = this;
        	 	this.model.fetch({
        	 		success: function(data){
        	 				that.render(true);
        	 		}
        	 	});
        	}
    },

    deleteItem: function (e) {
        this.model.destroy({
            success: function (model, response) {
                location.reload(true);
            }
        });
        e.preventDefault();
    },
    save: function (e) {

    	e.preventDefault();
    
    	// Valid & Serialize Form
        var formId = $(this.el).find('form').attr('id');
        var $form = $('#' + formId);
        
        var isValid;
        var json;

        // If el have multiple forms
        if($(this.el).find('form').length > 1)
        {
        	json = {};
        	$.each($(this.el).find('form'), function(index, formelement) { 
        		
        		// Validate Form
        		if(!isValidForm($(formelement)))
        		{
        			isValid = false;
        			return;
        		}
            
        		var form_id = $(formelement).attr('id');
        		var name = $(formelement).attr('name');

        		if(name)
        			{
        				json[name] = serializeForm(form_id);
        			}
        		else
        			{
        				$.each(serializeForm(form_id), function(key, value){
        					json[key] = value; 
        				});
        			}
        		});
        }

        	if(isValid == false || !isValidForm($form))
    		{
        		return;
    		}
        
        // Clear all the values first
        this.model.clear({
            silent: true
        });
        
        if(!json)
        	json = serializeForm(formId);

        this.model.set(json,{silent:true});
        
        var window = this.options.window;
        var reload = this.options.reload;
        
        // Store Modal Id
        var modal = this.options.modal;
        
        //Loading while saving
       $save_info = $('<div style="display:inline-block"><img src="img/1-0.gif" height="15px" width="15px"></img></div>');
       $(".form-actions", this.el).append($save_info);
       $save_info.show();
		
        this.model.save([],{
        	wait:true,
        	success: function (model, response) {
        		
        		if(reload)
            		location.reload(true);
            	else if (window)
            		{
            		  Backbone.history.navigate(window, {
                          trigger: true
                      });
            		  
            		  // Reset each element
            		  $form.each (function(){
	    	          	  this.reset();
	    	          	});
            		 
            		  // Hide modal if enabled
            		  if(modal)
          			  {
          				$(modal).modal('hide');
          			  } 
            		}
            	else
            	{
            		// Hide loading on error
                	$save_info.hide();
                	
            		$save_info = $('<div style="display:inline-block"><small><p class="text-success"><i>Saved Successfully</i></p></small></div>');
            		$(".form-actions", this.el).append($save_info);
                	$save_info.show().delay(3000).hide(1);
            	}
            },
            error : function (model, response)
            {
            	// Hide loading on error
            	$save_info.hide();
            	
            	// Show cause of error in saving
            	$save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>'+response.responseText+'</i></p></small></div>');
            	$(".form-actions", this.el).append($save_info);
            	$save_info.show().delay(3000).hide(1);
            }
        });
    },
    render: function (isFetched) {
    	
    	if(!this.model.isNew() || this.options.isNew || !$.isEmptyObject(this.model.toJSON()) || isFetched)
    	{
   
    		$(this.el).html(getTemplate(this.options.template, this.model.toJSON()));
    			
    		// Call postRenderCallback after rendering if available
        	var callback = this.options.postRenderCallback;
        	if (callback && typeof(callback) === "function") {
        		
        		// execute the callback, passing parameters as necessary
        		callback($(this.el));
        	}

        	// Deserialization
    		if(this.options.isNew != true )
    			{
    				//If el have more than 1 form deserialize all forms
    				 if($(this.el).find('form').length > 1)
    					deserializeMultipleForms(this.model.toJSON(), $(this.el).find('form'));
    				
    				//If el have one form
    				else if($(this.el).find('form').length == 1)
    					deserializeForm(this.model.toJSON(), $(this.el).find('form'));	
    			}
    	}
    	else
    	{
    		$(this.el).html(LOADING_HTML);
    	}
    	return this;
    }
});