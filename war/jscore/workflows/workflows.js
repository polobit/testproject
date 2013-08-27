/**
 * workflows.js is a script file to deal with common UI Handlers for
 * workflows from client side.
 * 
 * @module Campaigns  
 * 
 * 
 */
$(function(){

	// To stop propagation to edit page
	$(".workflow-results").die().live('click', function(e){
		e.stopPropagation();
	});

	/**
	 * Saves the content of workflow if the form is valid. Verifies for duplicate workflow names.
	 * Separate ids are given for buttons (as IDs are unique in html) but having same functionality, 
	 * so ids are separated by comma in click event.
	 * 
	 **/
	$('#save-workflow-top, #save-workflow-bottom').live('click', function (e) {
           e.preventDefault();
           
           // Temporary variable to hold clicked button, either top or bottom. $ is preceded, just to show 
           // it is holding jQuery object
           var $clicked_button = $(this);
           
           if($(this).attr('disabled'))
   			return;
           
    	// Check if the form is valid
    	if (!isValidForm('#workflowform')) {
    		$('#workflowform').find("input").focus();
    		return false;
    	}
    	
        // Gets Designer JSON
        var designerJSON = window.frames.designer.serializePhoneSystem();

        var name = $('#workflow-name').val();
        
        // Check for valid name
        if (isNotValid(name)) {
            alert("Name not valid");
            return;
        }

        // Disables save button to prevent multiple save on click event issues
        disable_save_button($(this));
        //$('#workflowform').find('#save-workflow').attr('disabled', 'disabled');
        
        // Load image while saving
		// $save_info = $('<div style="display:inline-block"><img src="img/1-0.gif" height="15px" width="15px"></img></div>');
		// $(".save-workflow-img").html($save_info);
		// $save_info.show();

        var workflowJSON = {};

        // When workflow is updated,set workflow model with name and rules
        if (App_Workflows.workflow_model != undefined) {
            workflowJSON = App_Workflows.workflow_model;
            App_Workflows.workflow_model.set("name", name);
            App_Workflows.workflow_model.set("rules", designerJSON);
            App_Workflows.workflow_model.save({}, {success: function(){
            	
            	enable_save_button($clicked_button);
            	//$('#workflowform').find('#save-workflow').removeAttr('disabled');
               
               //$(".save-workflow-img").remove();
  
            	Backbone.history.navigate("workflows", {
                    trigger: true
                });
            	
            },
            
            error: function(jqXHR, status, errorThrown){ 
              enable_save_button($clicked_button);
              
              // shows Exception message
              alert(status.responseText);
                }
            });        
            
        } 
        // When workflow is created
        else
        {

            workflowJSON.name = name;
            workflowJSON.rules = designerJSON;

            var workflow = new Backbone.Model(workflowJSON);
            App_Workflows.workflow_list_view.collection.create(workflow,{
            	    success:function(){  

            	    	// Removes disabled attribute of save button
            	    	enable_save_button($clicked_button);
            	    	// $('#workflowform').find('#save-workflow').removeAttr('disabled');
            	    	
            	    	// $(".save-workflow-img").remove();
            	    	            	    	
            	    	Backbone.history.navigate("workflows", {
                        trigger: true
            	    	
            	    	});
            	    },
                    
                    error: function(jqXHR, status, errorThrown){ 
                      enable_save_button($clicked_button); 
                      
                      // shows exception message
                      alert(status.responseText);
                        }
            });
        }

        /**/
        
        // Since we do save it back in collection, we are reloading the view
       // location.reload(true);

        
    });

    /**
     *  Deletes all logs of campaign
     *      
     **/
	$('#delete_campaign_logs').live('click', function (e) {
    	e.preventDefault();
    	
    	// Gets campaign id
    	var campaign_id = $("#logs-table").find("input.campaign").val();
    	
    	if(!campaign_id)
    		return;
    	
    	if(!confirm("Are you sure you want to delete all logs?"))
    		return;
    	
    	// Sends delete request to CampaignsAPI for deletion of logs
    	$.ajax({
    	    url: 'core/api/campaigns/logs/' + campaign_id,
    	    type: 'DELETE',
    	    success: function(){
    	    	location.reload(true);
    	    }
    	});
    });

	/**
	 * Script to show workflow video tutorial in bootstrap modal.
	 **/
	$('#workflow-designer-help').die().live('click', function(e){
		e.preventDefault();

		// Removes if previous modals exist.
		if ($('#workflow-designer-help-modal').size() != 0)
        {
        	$('#workflow-designer-help-modal').remove();
        }

		var workflow_help_modal = $(getTemplate('workflow-designer-help-modal'),{});
		workflow_help_modal.modal('show');

		// Plays video on modal shown
		$(workflow_help_modal).on("shown", function(){
			$(this).children('div.modal-body').find('div#workflow-help-detail').html('<h3 style="margin-left:165px">Easy. Peasy.</h3><iframe width="420" height="345" src="//www.youtube.com/embed/0Z-oqK6mWiE?enablejsapi=10&amp;autoplay=1" frameborder="0" allowfullscreen></iframe>');
		});

		// Stops video on modal hide
		$(workflow_help_modal).on("hide", function(){
			$(this).children('div.modal-body').find("iframe").removeAttr("src");
		});
	});

});