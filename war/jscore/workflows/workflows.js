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
	$(".stop-propagation").die().live('click', function(e){
		e.stopPropagation();
	});

	/**
	 * Saves the content of workflow if the form is valid. Verifies for duplicate workflow names.
	 * Separate ids are given for buttons (as IDs are unique in html) but having same functionality, 
	 * so ids are separated by comma in click event.
	 * 
	 **/
	$('#save-workflow-top, #save-workflow-bottom, #duplicate-workflow-top, #duplicate-workflow-bottom').live('click', function (e) {
           e.preventDefault();
           
           // Temporary variable to hold clicked button, either top or bottom. $ is preceded, just to show 
           // it is holding jQuery object
           var $clicked_button = $(this);
           
           if($(this).attr('disabled'))
   			return;
           
    	// Check if the form is valid
    	if (!isValidForm('#workflowform')) {
  		$('#workflowform').find("input.required").focus();
    		return false;
    	}
    	
        // Gets Designer JSON
        var designerJSON = window.frames.designer.serializePhoneSystem();

        var name = $('#workflow-name').val();
        
        var unsubscribe_tag = $('#unsubscribe-tag').val().trim();
        var unsubscribe_action = $('#unsubscribe-action').val();
        
        var unsubscribe_json ={
        		               		"tag":unsubscribe_tag,
        		               		"action":unsubscribe_action
        		               }
        
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

        // New Workflow or Copy Workflow
        if (App_Workflows.workflow_model === undefined || $(this).attr('id') === 'duplicate-workflow-top' || $(this).attr('id') === 'duplicate-workflow-bottom') 
        {
        	create_new_workflow(name, designerJSON, unsubscribe_json, $clicked_button)
        }
        // Update workflow
        else
        {
            workflowJSON = App_Workflows.workflow_model;
            App_Workflows.workflow_model.set("name", name);
            App_Workflows.workflow_model.set("rules", designerJSON);
            App_Workflows.workflow_model.set("unsubscribe", unsubscribe_json);
            App_Workflows.workflow_model.save({}, {success: function(){
            	
            	enable_save_button($clicked_button);
            	
            	// Adds tag in our domain
            	add_tag_our_domain(CAMPAIGN_TAG);
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
	
	$('#workflow-unsubscribe-option').die().live('click', function(e){
		e.preventDefault();
		//$(this).css('display','none');
		//$('#workflow-unsubscribe-block').show('slow');
	});
	
	$('#workflow-unsubscribe-block').live('shown', function(){
		$('#workflow-unsubscribe-option').html('<span><i class="icon-minus"></i></span> Manage Unsubscription');
	});
	
	$('#workflow-unsubscribe-block').live('hidden', function(){
		$('#workflow-unsubscribe-option').html('<span><i class="icon-plus"></i></span> Manage Unsubscription');
	});
	
	$('#unsubscribe-action').die().live('change', function(e){
		e.preventDefault();
		
		var all_text = "Contact will not receive any further emails from any campaign (i.e., the 'Send Email' option will not work. However, other actions in" 
			           + " campaign will work as expected)";
		
		var this_text = "Contact will be removed from this campaign";
		
		var ask_text = "Prompts the user with options to either unsubscribe from this campaign or all communication";
		
		var $p_ele = $(this).closest('div.controls').parent().find('small');
		
		if($(this).val() == "UNSUBSCRIBE_FROM_ALL")
			$p_ele.html(all_text);
		
		if($(this).val() == "UNSUBSCRIBE_FROM_THIS_CAMPAIGN")
			$p_ele.html(this_text);
		
		if($(this).val() == "ASK_USER")
			$p_ele.html(ask_text);
		
	});

});

/**
 * Creates a new workflow or Copy existing workflow and add to workflows collection
 * 
 * @param name - workflow name
 * @param designerJSON - campaign workflow in json
 * @param unsubscribe_json - unsubscribe data of workflow
 * @param $clicked_button - jquery object to know clicked button
 **/
function create_new_workflow(name, designerJSON, unsubscribe_json, $clicked_button)
{
	var workflowJSON = {};
	
	workflowJSON.name = name;
    workflowJSON.rules = designerJSON;
    workflowJSON.unsubscribe = unsubscribe_json;
    
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
              
              // shows Exception message
              if(status.status != 406)
              {
            	  // Show different message for Copy
            	  if($clicked_button.attr('id') === 'duplicate-workflow-bottom' || $clicked_button.attr('id') === 'duplicate-workflow-top')
            	  {
            		  if(status.responseText === "Please change the given name. Same kind of name already exists.")
            		  {
            			  alert("Please change the name and click on 'Create a Copy' again.");
            			  return;
            		  }
            	  }
            	  
            	  alert(status.responseText);
              }
              else
            	  {
            	  console.log(status);
            		// Show cause of error in saving
					$save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>'
							+ status.responseText
							+ '</i></p></small></div>');

					// Appends error info to form actions
					// block.
					$("#workflow-limit-reached-msg").html(
							$save_info).show();
            	  }
                }
    });
}