/**
 * workflows.js is a script file to deal with common UI Handlers for
 * workflows from client side.
 * 
 * @module Campaigns  
 * 
 * 
 */
$(function(){
	
	 // Save Workflow
    
	/**
	 * Saves the content of workflow if the form is valid
	 * 
	 **/
	$('#save-workflow').live('click', function (e) {
           e.preventDefault();
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

        var workflowJSON = {};

        // When workflow is updated,set workflow model with name and rules
        if (App_Workflows.workflow_model != undefined) {
            workflowJSON = App_Workflows.workflow_model;
            App_Workflows.workflow_model.set("name", name);
            App_Workflows.workflow_model.set("rules", designerJSON);
            App_Workflows.workflow_model.save({}, {success: function(){
            	Backbone.history.navigate("workflows", {
                    trigger: true
                });
            	
            }});        
            
        } 
        // When workflow is created
        else
        {

            workflowJSON.name = name;
            workflowJSON.rules = designerJSON;

            var workflow = new Backbone.Model(workflowJSON);
            App_Workflows.workflowsListView.collection.create(workflow,{
            	    success:function(){  
            	    	
            	    	Backbone.history.navigate("workflows", {
                        trigger: true
            	    	
            	    	});
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
});