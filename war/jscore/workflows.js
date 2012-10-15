$(function(){
	
	 // Save Workflow
    $('#saveWorkflow').live('click', function () {

    	// Check if the form is valid
    	if (!isValidForm('#workflowform')) {
    		$('#workflowform').find("input").focus();
    		return false;
    	}
    	
        // Get Designer JSON
        var designerJSON = window.frames.designer.serializePhoneSystem();

        var name = $('#workflow-name').val();
        if (isNotValid(name)) {
            alert("Name not validd");
            return;
        }

        var workflowJSON = {};

        if (App_Workflows.workflow_model != undefined) {
            workflowJSON = App_Workflows.workflow_model;
            App_Workflows.workflow_model.set("name", name);
            App_Workflows.workflow_model.set("rules", designerJSON);
            App_Workflows.workflow_model.save({}, {success: function(){
            	Backbone.history.navigate("workflows", {
                    trigger: true
                });
            	
            }});        
            
        } else {

            workflowJSON.name = name;
            workflowJSON.rules = designerJSON;

            var workflow = new Backbone.Model(workflowJSON);
            App_Workflows.workflowsListView.collection.create(workflow);
            
            Backbone.history.navigate("workflows", {
                trigger: true
            });
        }

        /**/
        
        // Since we do save it back in collection, we are reloading the view
       // location.reload(true);

        
    });

    $('#delete_campaign_logs').live('click', function (e) {
    	e.preventDefault();
    	var campaign_id = $("#logs-table").find("input").val();
    	if(!campaign_id)
    		return;
    	$.ajax({
    	    url: 'core/api/campaigns/logs' + campaign_id,
    	    type: 'DELETE',
    	});
    });
});