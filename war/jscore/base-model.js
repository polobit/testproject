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
        	 	this.model.fetch();
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
        
        // Validate Form
        if(!isValidForm($form))
        {	
        	return;
        }
        
        // Clear all the values first
        this.model.clear({
            silent: true
        });
        
        // Convert Date String to Epoch
        var json = serializeForm(formId);
     
        this.model.set(json);
        
        var window = this.options.window;
        var reload = this.options.reload;
        
        // Store Modal Id
        var modal = this.options.modal;
        
        this.model.save([],{
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
            }
        });
    },
    render: function () {
    	if(!this.model.isNew() || this.options.isNew || !$.isEmptyObject(this.model.toJSON()))
    	{
    		$(this.el).html(getTemplate(this.options.template, this.model.toJSON()));
    	
        	// Let's try to deserialize too if it is not empty
    		if(this.options.isNew != true)
    			deserializeForm(this.model.toJSON(), $(this.el).find('form'));
        
        	// Call postRenderCallback after rendering if available
        	var callback = this.options.postRenderCallback;
        	if (callback && typeof(callback) === "function") {
        		
        		// execute the callback, passing parameters as necessary
        		callback($(this.el));
        	}
    	}
    	else
    	{
    		$(this.el).html('<img src= "img/21-0.gif"></img>');
    	}
    	return this;
    }
});