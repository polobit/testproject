/**
 * workflows.js is a script file to deal with common UI Handlers for
 * workflows from client side.
 * 
 * @module Campaigns  
 * 
 * 
 */
 /**
*  Workflow event listeners
*/
var unsubscribe_fill_select = {};
var Workflow_Model_Events = Base_Model_View.extend({
   
    events: {
        'click #save-workflow-top,#save-workflow-bottom,#duplicate-workflow-top,#duplicate-workflow-bottom': 'saveCampaignClick',
        'click #workflow-unsubscribe-option': 'unsubscribeCampaign',
        'click #workflow-designer-help': 'helpCampaign',
        'change #unsubscribe-action': 'unsubscribeCampaignOptionSelect',
        'change #disable-workflow':'saveCampaignClick',
        'change .emailSelect,click .emailSelect' : 'fillDetails',
    },

    fillDetails : function(e)
    {
        console.log('fillDetails');
        var unsubscribe_subject = "";
        unsubscribe_fill_select.id = "";
        var model_id = $('.emailSelect option:selected').prop('value');
        if (!model_id)
        	return;
		var emailTemplatesModel = Backbone.Model.extend({ url : '/core/api/email/templates/' + model_id, restKey : "emailTemplates" });
		var templateModel = new emailTemplatesModel();
		
		templateModel.fetch({ success : (function(data)
		{
            var model = data.toJSON();
			unsubscribe_fill_select.id = model_id;
            unsubscribe_fill_select.text = model.text;
		})
    });
            

    },

    unsubscribeCampaignOptionSelect : function(e){
        e.preventDefault();
        var targetEl = $(e.currentTarget);
        
        var all_text = "Contact will not receive any further emails from any campaign (i.e., the 'Send Email' option will not work. However, other actions in" 
                       + " campaign will work as expected)";
        
        var this_text = "Contact will be removed from this campaign";
        
        var ask_text = "Prompts the user with options to either unsubscribe from this campaign or all communication";
        
        var $p_ele = $(this).closest('div.controls').parent().find('small');
        
        if($(targetEl).val() == "UNSUBSCRIBE_FROM_ALL")
            $p_ele.html(all_text);
        
        if($(targetEl).val() == "UNSUBSCRIBE_FROM_THIS_CAMPAIGN")
            $p_ele.html(this_text);
        
        if($(targetEl).val() == "ASK_USER")
            $p_ele.html(ask_text);
          
    },
    /**
     * Script to show workflow video tutorial in bootstrap modal.
     **/
    helpCampaign : function(e){
        e.preventDefault();

        getTemplate('workflow-designer-help-modal', {}, undefined, function(template_ui){
            if(!template_ui)
                  return;           

            $("#workflow-designer-help-modal").html($(template_ui)).modal('show');

            // Stops video on modal hide
            $("#workflow-designer-help-modal").on("hide.bs.modal", function(){
                $(this).html("");
            });

        }, null);
    },

    unsubscribeCampaign : function(e){
        e.preventDefault();
        $(e.currentTarget).find('i').toggleClass('icon-plus').toggleClass('icon-minus');
        $("#workflow-unsubscribe-block").slideToggle('fast');        
    },

        
   /**
     * Saves the content of workflow if the form is valid. Verifies for duplicate workflow names.
     * Separate ids are given for buttons (as IDs are unique in html) but having same functionality, 
     * so ids are separated by comma in click event.
     * 
     **/
    saveCampaignClick: function(e, trigger_data){
        e.preventDefault();
        var targetEl = $(e.currentTarget);

        try{
            var nodeLength = $('iframe[id=designer]').contents().find('#paintarea .contextMenuForNode').length;
            var currentLimits=_billing_restriction.currentLimits;
            var campaignNodeLimit=currentLimits.campaignNodesLimit;
            if(nodeLength-1 > campaignNodeLimit)
            {
                $("#workflow-edit-msg").hide();
                $("#nodes-limit-reached").show();
                campaignAlert("nodeLimit");
                return;
            }

        }
        catch(err){}

        // Temporary variable to hold clicked button, either top or bottom. $ is preceded, just to show 
       // it is holding jQuery object
       var $clicked_button = $(targetEl);
       
       if(!window.frames.designer.checkWorkflowSize())
           return;
       
       if($(targetEl).attr('disabled'))
        return;
           
        // Check if the form is valid
        if (!isValidForm('#workflowform')) {
            $('#workflowform').find("span.help-inline").not(':hidden').prev('input').focus();
            return false;
        }
        
        // Gets Designer JSON
        var designerJSON = window.frames.designer.serializePhoneSystem();
        /**
         * Checks if start node is connected to any other node.
         */      
        if(!is_start_active(designerJSON)){
            var $save_info = '<span style="color: red;">Please connect the \'Start\' node to another node in the campaign</span>';
            $("#workflow-msg").html($save_info).show().fadeOut(3000);
            return false;
        }

        var name = $('#workflow-name').val();
        
        var unsubscribe_tag = $('#unsubscribe-tag').val().trim();
        var unsubscribe_action = $('#unsubscribe-action').val();
        var unsubscribe_email = $('#unsubscribe-email').val().trim();
        var unsubscribe_name = $('#unsubscribe-name').val().trim();
        var unsubscribe_subject = "";
        if(unsubscribe_fill_select.id)
            unsubscribe_subject = unsubscribe_fill_select.id;
        var is_disabled = $('.is-disabled-top').attr("data");
        if(e.type == "change" && is_disabled)
            is_disabled = !JSON.parse(is_disabled);

        var unsubscribe_json ={
                                    "tag":unsubscribe_tag,
                                    "action":unsubscribe_action,
                                    "unsubscribe_email": unsubscribe_email,
                                    "unsubscribe_name": unsubscribe_name,
                                    "unsubscribe_subject": unsubscribe_subject
                               }

        
        // Check for valid name
        if (isNotValid(name)) {
            alert("Name not valid");
            return;
        }

        // Disables save button to prevent multiple save on click event issues
        disable_save_button($(targetEl));

                
        var workflowJSON = {};

        // New Workflow or Copy Workflow
        if (App_Workflows.workflow_model === undefined || $(targetEl).attr('id') === 'duplicate-workflow-top' || $(targetEl).attr('id') === 'duplicate-workflow-bottom') 
        {
            create_new_workflow(e,name, designerJSON, unsubscribe_json, $clicked_button, trigger_data, is_disabled);   

        }
        // Update workflow
        else
        {
            workflowJSON = App_Workflows.workflow_model;

            // To reset model on error
            var previousAttributes = App_Workflows.workflow_model.previousAttributes();

            App_Workflows.workflow_model.set("name", name);
            App_Workflows.workflow_model.set("rules", designerJSON);
            App_Workflows.workflow_model.set("unsubscribe", unsubscribe_json);
            App_Workflows.workflow_model.set("is_disabled", is_disabled);
            App_Workflows.workflow_model.save({}, {success: function(){
                
                enable_save_button($clicked_button);
                
                show_campaign_save(e);
                
                try{
                // Adds tag in our domain
                add_tag_our_domain(CAMPAIGN_TAG);
                }catch(err){
                }
                // Hide message
                $('#workflow-edit-msg').hide();

                if(e.type == "change"){
                     var disabled = $(".is-disabled-top");
                 var status = $('#disable-switch').bootstrapSwitch('status');
                if (is_disabled && status) {
                        disabled.attr("data", true);
                        $('#designer-tour').addClass("blur").removeClass("anti-blur");
                        window.frames[1].$('#paintarea').addClass("disable-iframe").removeClass("enable-iframe");
                        window.frames[1].$('#paintarea .nodeItem table>tbody').addClass("disable-iframe").removeClass("enable-iframe");
                        show_campaign_save(e,"Campaign has been disabled successfully.","red");
                    } else {
                        disabled.attr("data", false);
                        $('#designer-tour').addClass("anti-blur").removeClass("blur");
                        window.frames[1].$('#paintarea').addClass("enable-iframe").removeClass("disable-iframe");
                        window.frames[1].$('#toolbartabs').removeClass("disable-iframe");
                       // $('#designer-tour').css("pointer-events","none");
                        window.frames[1].$('#paintarea .nodeItem table>tbody').addClass("enable-iframe").removeClass("disable-iframe");
                        show_campaign_save(e,"Campaign has been enabled successfully.");
                    }
                }

                // Boolean data used on clicking on Done
                if(trigger_data && trigger_data["navigate"])
                {
                    Backbone.history.navigate("workflows", {
                      trigger: true
                  });
                }

                 // Adds tag in our domain
                add_tag_our_domain(CAMPAIGN_TAG);
                
            },
            
            error: function(jqXHR, status, errorThrown){ 
              enable_save_button($clicked_button);

              // Reset model with previous on error
              App_Workflows.workflow_model.set(previousAttributes);
              
              console.log(status);
                    // Show cause of error in saving
                    $save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>'
                            + status.responseText
                            + '</i></p></small></div>');

                    // Appends error info to form actions
                    // block.
                    $("#workflow-msg").html(
                            $save_info).show();
              //var json = JSON.parse(status.responseText);
              //workflow_alerts(json["title"], json["message"],"workflow-alert-modal");
              // shows Exception message
              //alert(status.responseText);
                }
            });        
            
        } 
        var unsubscribe_subject = "";
        unsubscribe_fill_select.id = "";
        var model_id = $('.emailSelect option:selected').prop('value');
        if (!model_id)
            return;
        
        var emailTemplatesModel = Backbone.Model.extend({ url : '/core/api/email/templates/' + model_id, restKey : "emailTemplates" });
        var templateModel = new emailTemplatesModel();
        
        templateModel.fetch({ success : (function(data)
            {
                var model = data.toJSON();
                unsubscribe_fill_select.id = model_id;
                unsubscribe_fill_select.text = model.text;
            }),
        error: (function () {
                unsubscribe_fill_select.id = model_id;
                unsubscribe_subject = unsubscribe_fill_select.id;
            })
        });
 
    },

});

function initializeLogReportHandlers(){

    // Show stats of selected campaign
    $("#campaign-reports-select").change(function(e){
      
       e.preventDefault();
        var targetEl = $(e.currentTarget);

        var active_tab = $('#campaign-tabs .select').data('campaign-tab-active');
        
        if(active_tab == "STATS")
            Backbone.history.navigate("email-reports/"+$(targetEl).val() , {
                trigger: true
            });
        
        if(active_tab == "SUBSCRIBERS")
            Backbone.history.navigate("workflow/all-subscribers/"+$(targetEl).val() , {
                trigger: true
            });
        
        if(active_tab == "LOGS")
            Backbone.history.navigate("workflows/logs/"+$(targetEl).val() , {
                trigger: true
            });
    });
}
/**
* Report Collection event handlers
*/
var Workflow_Reports_Events = Base_Collection_View.extend({
   
    events: {
        'click #delete_campaign_logs': 'onDeleteAllCampaignLogs',
        'click .log-filters': 'onChangeLogFilter',       
    },

     /**
     *  Deletes all logs of campaign
     *      
     **/
    onDeleteAllCampaignLogs : function(e){

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
                App_Workflows.logsToCampaign(campaign_id);
                //location.reload(true);
            }
        });
    },

    // Show logs of selected filter
    onChangeLogFilter : function(e){
        e.preventDefault();
        var targetEl = $(e.currentTarget);

        var log_type = $(targetEl).data('log-type');
        var id = $(targetEl).data('campaign-id');
        
        App_Workflows.logsToCampaign(id, log_type, $(targetEl).text());

    },

});

$(function(){

	// To stop propagation to edit page
	$('body').on('click', '.stop-propagation', function (e) {
        e.stopPropagation();
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
function create_new_workflow(e,name, designerJSON, unsubscribe_json, $clicked_button, trigger_data, is_disabled, was_disabled)
{
	var workflowJSON = {};
	
	workflowJSON.name = name;
    workflowJSON.rules = designerJSON;
    workflowJSON.unsubscribe = unsubscribe_json;
    workflowJSON.is_disabled = is_disabled;
    workflowJSON.was_disabled = was_disabled;
    
    var workflow = new Backbone.Model(workflowJSON);
    App_Workflows.workflow_list_view.collection.create(workflow,{
    	    success:function(){  

    	    	// Removes disabled attribute of save button
    	    	enable_save_button($clicked_button);
    	    	
    	    	// Shows Campaign save message
    	    	show_campaign_save(e);

    	    	// $('#workflowform').find('#save-workflow').removeAttr('disabled');
    	    	
    	    	// Hide edit message
    	    	$('#workflow-edit-msg').hide();
    	    	
    	    	// $(".save-workflow-img").remove();
    	    	        
    	    	// Boolean data used on clicking on Done
    	    	if(trigger_data && trigger_data["navigate"])
    	    	{
    	    		Backbone.history.navigate("workflows", {
                      trigger: true
                  });
    	    	}
    	    	
    	    	// Updates workflow model
    	    	App_Workflows.workflow_model = workflow;
                if(Current_Route.indexOf("share-campaign")!=-1)
                    App_Workflows.workflow_list_view = undefined;
    	    },
            
            error: function(jqXHR, status, errorThrown){ 
              enable_save_button($clicked_button); 
              App_Workflows.workflow_list_view.collection.remove(workflow);
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
					$("#workflow-msg").html(
							$save_info).show();
            	  }
                }
    });
}

/**
 * Fills pad-content for logs when empty json obtains.
 * 
 * @param id -
 *          slate div id.
 * @param type - 
 *          to match with LOGS_PAD_CONTENT json key
 **/
function fill_logs_slate(id, type)
{
	if(type == undefined)
		type="ALL";
	
	var LOGS_PAD_CONTENT = {
		    "ALL": {
		        "title": "No logs for this campaign yet",
				"image": updateImageS3Path("/img/clipboard.png")
		    },
		    "EMAIL_SENT": {
		    	"title": "No emails sent yet",
				"image": updateImageS3Path("/img/clipboard.png")
		    },
		    "EMAIL_OPENED": {
		    	"title": "No emails opened in this campaign",
				"image": updateImageS3Path("/img/clipboard.png")
		    },
		    "EMAIL_CLICKED": {
		    	"title": "No emails clicked in this campaign",
				"image": updateImageS3Path("/img/clipboard.png")
		    },
		    "UNSUBSCRIBED": {
		    	"title": "No one unsubscribed from this campaign",
				"image": updateImageS3Path("/img/clipboard.png")
		    },
		    "EMAIL_HARD_BOUNCED": {
		    	"title": "No hard bounces seen for  this campaign",
				"image": updateImageS3Path("/img/clipboard.png")
		    },
		    "EMAIL_SOFT_BOUNCED": {
		    	"title": "No soft bounces seen for this campaign",
				"image": updateImageS3Path("/img/clipboard.png")
		    },
		    "EMAIL_SPAM": {
		    	"title": "No spam reports seen for this campaign",
				"image": updateImageS3Path("/img/clipboard.png")
		    }
		}

	getTemplate("empty-collection-model", LOGS_PAD_CONTENT[type], undefined, function(template_ui){
        if(!template_ui)
              return;
            
        $("#" + id).html($(template_ui));
    }, "#" + id);


}

function show_campaign_save(e,message,color)
{
	// Campaign save message
    var save_info;
    if(message)
        save_info = '<span style="color: green;">'+message+'</span>';
    else
    {
	   save_info = '<span style="color: green;">Campaign saved.</span>';
       //Show popup modal for adding campaign in trigger or contac
        showCampaignPopup(e);
       
    }

    if(color)
        save_info = $(save_info).css("color", color);

   	$("#workflow-msg").html(save_info).show().fadeOut(3000);
}

function is_start_active(designerJSON){
    
    var nodes  = JSON.parse(designerJSON).nodes;
    var is_active = true;
    try{
    $.each(nodes,function(node_name,node_value){
        if(node_value.displayname == "Start"){
        var start_states= node_value.States;
        $.each(start_states,function(start_name,start_node){
        if(start_node.start == "hangup"){
            is_active = false;
            return true
        }
        });
        }
        });
    }
    catch(err){
        return is_active;
    }
    return is_active;
}

function populate_workflows_list(id, el, callback)
{
     if(callback == undefined)
        callback = 'no-callback';

     var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
     fillSelect(id, '/core/api/workflows', 'workflow', callback , optionsTemplate, undefined, el);
}

function shareCampaign()
{
    $("#shareCampaign").remove();
    getTemplate('share-campaign-modal', {}, undefined, function(template_ui){
                if(!template_ui)
                    return;
                var share_campaign_modal = $(template_ui);
                share_campaign_modal.modal('show');
               /* share_campaign_modal.on('shown.bs.modal', function(){
                    window.history.back();
                });*/
    }, null);

        
}
function createJSON() {
        var shareCampaign_json = {};
        // Getting the emailId entered by the user to share with
        var value = $("#emailId").val();
        if(!isValidForm('#verify-email'))
            return;
        var json = serializeForm("verify-email");
        if(!json)
            return;
        shareCampaign_json.receiverEmail = value;
        shareCampaign_json.campaignId = App_Workflows.workflow_model.id;

        $.ajax({ url : "/core/api/workflows/share?type=Workflow&id="+App_Workflows.workflow_model.id+"&recEmail="+shareCampaign_json.receiverEmail,
         type : "GET",
         data: shareCampaign_json,
         dataType: "json",
         contentType : "application/json",
         success : function()
            {
                $("#shareCampaign").modal('hide');
                showNotyPopUp("information", "Campaign has been shared successfully.", "top");
                //Backbone.history.navigate("workflows", { trigger : true });
            },error : function(){
                $("#shareCampaign").modal('hide');
            }
        });
}
$('body').on('mouseenter','#workflows-model-list tr', function(e){
         $(this).find('#camp_history').removeClass('hide');
         $(this).find('#camp_reports').removeClass('hide');
    });

$('body').on('mouseleave','#workflows-model-list tr', function(e){
         $(this).find('#camp_history').addClass('hide');
         $(this).find('#camp_reports').addClass('hide');
    });

   /**
     *Script to show Popup window. when user click on save campaign 
     *
     **/
   
     function showCampaignPopup(e)
     {
         e.preventDefault();

        var targetEl=$(e.currentTarget);
        var click_button= $(targetEl).attr('id');
        var popup_status=readData("campaign-save-popup");

        if(popup_status !=='true' && (click_button==='save-workflow-top' || click_button==='save-workflow-bottom' || click_button==='duplicate-workflow-top' || click_button==='duplicate-workflow-bottom'))
        {
            while($("#workflow-save-popup").length)
                  $("#workflow-save-popup").remove();

            workflow_alerts("Next Action ", "null" , "workflow-save-popup-modal", function(el){
               
                window.setTimeout(function () {   $(el).find("#popup-msg").fadeOut(8000); }, 500); 
            });
        }
     }

    function popupCampaignContact ()
    {
            $("#workflow-save-popup").modal("hide");
           
          // window.location.hash="#contacts";
           Backbone.history.navigate("#contacts" , {
                trigger: true
            });
           
       }
         
     function popupCampaignTrigger ()
     {  
            $("#workflow-save-popup").modal("hide");
             
             Backbone.history.navigate("#trigger-add" , {
                trigger: true
            });
            
     }


     function hideCampaignPopup()
     {
        if($("#campaign-save-popup").prop("checked"))
            storeData("campaign-save-popup", true,10);
        else
            storeData("campaign-save-popup", false,10);
      }


function initializeWorkflowsListeners() {}

