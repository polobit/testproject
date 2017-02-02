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
        'click #campaign_access_level': 'accessLevelChange',
        'click #campaign-restore-alert': 'showRestoreAlert'
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
        
        var all_text = "{{agile_lng_translate 'campaigns' 'send-email-removed'}}";
        
        var this_text = "{{agile_lng_translate 'campaigns' 'remove-contacts'}}";
        
        var ask_text = "{{agile_lng_translate 'campaigns' 'prompt-to-unsubscribe'}}";
        
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
    saveCampaignClick: function(e, trigger_data, callback){
        e.preventDefault();
        var targetEl = $(e.currentTarget);

        try{
            var nodeLength = $('iframe[id=designer]').contents().find('#paintarea .contextMenuForNode').length;
            var currentLimits=_billing_restriction.currentLimits;
            var campaignNodeLimit=currentLimits.campaignNodesLimit;
            if(nodeLength-1 > campaignNodeLimit)
            {
                $("#workflow-edit-msg").hide();
                $("#unsubscribe-email_status-msg").html(""); 
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
            var $save_info = '<span style="color: red;">{{agile_lng_translate "campaigns" "connect-start-node"}}</span>';
            $("#workflow-msg").html($save_info).show().fadeOut(8000);
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

        var is_unsubscribe_email_disabled = false;
        var unsubscribe_email_status = $("[id^='unsubscribe-email-']:checked").val();
        if (unsubscribe_email_status != 'undefined' && unsubscribe_email_status == "true") {
            is_unsubscribe_email_disabled = true;
        }

        var unsubscribe_json ={
                                    "tag":unsubscribe_tag,
                                    "action":unsubscribe_action,
                                    "unsubscribe_email": unsubscribe_email,
                                    "unsubscribe_name": unsubscribe_name,
                                    "unsubscribe_subject": unsubscribe_subject,
                                    "is_unsubscribe_email_disabled": is_unsubscribe_email_disabled
                               }

        // Access Level
        var access_permission = $('#access_level').val();

        // Check for valid name
        if (isNotValid(name)) {
            showAlertModal("name_not_valid");
            return;
        }

        // Disables save button to prevent multiple save on click event issues
        disable_save_button($(targetEl));

        // Disable Campaign(unsave) exit popup if Campaign is save 
        IS_CAMPAIGN_EXIT_POPUP = false;

        track_with_save_success_model($(targetEl));

        // New Workflow or Copy Workflow
        if (App_Workflows.workflow_model === undefined || $(targetEl).attr('id') === 'duplicate-workflow-top' || $(targetEl).attr('id') === 'duplicate-workflow-bottom') 
        {
            //create_new_workflow(e,name, designerJSON, unsubscribe_json, $clicked_button, trigger_data, is_disabled, undefined, access_permission);
            // Verify for non connected nodes
            all_nodes_active(targetEl, designerJSON,function(callbackData){
                // if callbackData is true, then all nodes are connected
                var isdismissed = false;
                if(callbackData){
                    // creating new workflow
                    create_new_workflow(e,name, designerJSON, unsubscribe_json, $clicked_button, trigger_data, is_disabled, undefined, access_permission);
                }
                else
                {  
                    // showing a popup alert model for non connected nodes information
                    showModalConfirmation("Alert",
                        "It seems some nodes are not connected. Do you want to continue?",
                        function(){
                            // while click on continue button
                            // creating new workflow and show next action
                            create_new_workflow(e,name, designerJSON, unsubscribe_json, $clicked_button, trigger_data, is_disabled, undefined, access_permission);
                            isdismissed = true;
                        },  
                        function(){
                            // while click on cancel button
                            enable_save_button($clicked_button);
                            return;                           
                        }, 
                        function(){
                            if(!isdismissed){
                                enable_save_button($clicked_button); 
                                return;
                            }                        
                        },"Continue", "Cancel");
                }                
            });

        }
        else
        {  
            //Verifying any nodes are non-connected
            all_nodes_active(targetEl, designerJSON,function(callbackData){
                // if callbackData is true, then all nodes are connected
                var isdismissed = false;
                if(callbackData){
                    // Update workflow
                    update_workflow(e,name, designerJSON, unsubscribe_json, trigger_data, is_disabled, access_permission,callback);
                }
                else
                {   
                    var previousAttributes = App_Workflows.workflow_model.previousAttributes();
                    showModalConfirmation("Alert",
                        "It seems some nodes are not connected. Do you want to continue?",
                        function(){
                            // while click on continue button
                            // update previous workflow
                            update_workflow(e,name, designerJSON, unsubscribe_json, trigger_data, is_disabled, access_permission,callback);
                            isdismissed = true;

                        },  
                        function(){
                            // while click on cancel button
                            enable_save_button($clicked_button);
                            // Reset model with previous
                            App_Workflows.workflow_model.set(previousAttributes);
                            return;                           
                        }, 
                        function(){
                            if(!isdismissed){
                                enable_save_button($clicked_button);
                                // Reset model with previous
                                App_Workflows.workflow_model.set(previousAttributes);
                                return;
                            }                        
                        },"Continue", "Cancel");

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

    accessLevelChange : function(e){
        console.log("change");
        var level = $("#access_level", this.el).val();
        if(level == "1"){
            level = CURRENT_DOMAIN_USER.id;
        } else {
            level = "1";
        }

        $("#access_level", this.el).val(level);
        var that = this;

        // Resave if it is not a new campaign
        if(App_Workflows.workflow_model && App_Workflows.workflow_model.get("id")){
            this.saveCampaignClick(e, undefined, function(){
                // Change ui text
                change_access_level(level, that.el);
            });
            return;
        }

        // Change ui text
        change_access_level(level, this.el);

    },

    showRestoreAlert: function(e){
        e.preventDefault();

        showAlertModal("Are you sure you want to restore the campaign to earlier version?", "confirm",
         function confirm(modal)
         {

            $.ajax({
                url: 'core/api/workflows/restore?workflow_id=' + App_Workflows.workflow_model.get("id"),
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                success: function(workflow_model_json)
                {
                    App_Workflows.workflow_model.set("rules", workflow_model_json.rules);
                   
                    App_Workflows.workflow_json = App_Workflows.workflow_model.get("rules");
                    App_Workflows.is_disabled = App_Workflows.workflow_model.get("is_disabled");

                   // Reload iframe
                   var iframe = document.getElementById("designer");
                   iframe.src = iframe.src;

                   show_campaign_save(e, "Restored workflow successfully.");
                }, 
                error: function() {
                   show_campaign_save(e, "Backup of earlier version is not available.", "red");
                 }
             })
         }, function decline(modal){

         }, "Restore Workflow");  
    }

});

/**
 * Update existing workflow with new data and add to workflows collection
 * 
 * @param name - workflow name
 * @param designerJSON - campaign workflow in json
 * @param unsubscribe_json - unsubscribe data of workflow
 **/
function update_workflow(e,name, designerJSON, unsubscribe_json, trigger_data, is_disabled, access_permission,callback){
    var targetEl = $(e.currentTarget);
    var $clicked_button = $(targetEl);

    var workflowJSON = {};

    workflowJSON = App_Workflows.workflow_model;

    // To reset model on error
    var previousAttributes = App_Workflows.workflow_model.previousAttributes();

    App_Workflows.workflow_model.set("name", name);
    App_Workflows.workflow_model.set("rules", designerJSON);
    App_Workflows.workflow_model.set("unsubscribe", unsubscribe_json);
    App_Workflows.workflow_model.set("is_disabled", is_disabled);
    App_Workflows.workflow_model.set("access_level", access_permission);
    App_Workflows.workflow_model.save({}, {
            success: function(){

                enable_save_button($clicked_button);
                show_campaign_save(e);

                if(callback)
                    callback();
                
                try{
                // Adds tag in our domain
                add_tag_our_domain(CAMPAIGN_TAG);
                }catch(err){
                }
                // Hide message
                $('#workflow-edit-msg').hide();
                $("#unsubscribe-email_status-msg").html(""); 

                if(e.type == "change"){
                     var disabled = $(".is-disabled-top");
                 var status = $('#disable-switch').bootstrapSwitch('status');
                if (is_disabled && status) {
                        disabled.attr("data", true);
                        $('#designer-tour').addClass("blur").removeClass("anti-blur");
                        window.frames[1].$('#paintarea').addClass("disable-iframe").removeClass("enable-iframe");
                        window.frames[1].$('#paintarea .nodeItem table>tbody').addClass("disable-iframe").removeClass("enable-iframe");
                        show_campaign_save(e,"{{agile_lng_translate 'campaigns' 'campaign-has-been-disabled-successfully'}}","red");
                    } else {
                        disabled.attr("data", false);
                        $('#designer-tour').addClass("anti-blur").removeClass("blur");
                        window.frames[1].$('#paintarea').addClass("enable-iframe").removeClass("disable-iframe");
                        window.frames[1].$('#toolbartabs').removeClass("disable-iframe");
                       // $('#designer-tour').css("pointer-events","none");
                        window.frames[1].$('#paintarea .nodeItem table>tbody').addClass("enable-iframe").removeClass("disable-iframe");
                        show_campaign_save(e,"{{agile_lng_translate 'campaigns' 'enabled-campaign'}}");
                    }
                }

                // Show success message of access level property
                if($(targetEl).attr('id') === 'campaign_access_level'){
                    if(access_permission == "1")
                        show_campaign_save(e,"{{agile_lng_translate 'campaigns' 'made-public'}}");
                       //show_campaign_save(e,"The Campaign is now Public.");

                    else 
                        show_campaign_save(e,"{{agile_lng_translate 'campaigns' 'made-private'}}");
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
        
        showAlertModal("delete_campaign_logs", "confirm", function(){
            // Sends delete request to CampaignsAPI for deletion of logs
            $.ajax({
                url: 'core/api/campaigns/logs/' + campaign_id,
                type: 'DELETE',
                success: function(){
                    App_Workflows.logsToCampaign(campaign_id);
                    //location.reload(true);
                }
            });
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
function create_new_workflow(e,name, designerJSON, unsubscribe_json, $clicked_button, trigger_data, is_disabled, was_disabled, access_level)
{
    var workflowJSON = {};
    
    workflowJSON.name = name;
    workflowJSON.rules = designerJSON;
    workflowJSON.unsubscribe = unsubscribe_json;
    workflowJSON.is_disabled = is_disabled;
    workflowJSON.was_disabled = was_disabled;
    workflowJSON.access_level = access_level; 

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
                $("#unsubscribe-email_status-msg").html(""); 
                
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
                          showAlertModal("duplicate_workflow");
                          return;
                      }
                  }
                  
                  showAlertModal(status.responseText, undefined, undefined, undefined, "Error");
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
                "title": "{{agile_lng_translate 'campaigns' 'logs-pad-content-title'}}",
                "image": updateImageS3Path("/img/clipboard.png")
            },
            "EMAIL_SENT": {
                "title": "{{agile_lng_translate 'campaigns' 'logs-pad-content-emails-sent-title'}}",
                "image": updateImageS3Path("/img/clipboard.png")
            },
            "EMAIL_SENDING_SKIPPED": {
                "title": "{{agile_lng_translate 'campaigns' 'logs-pad-content-emails-sending-skipped-title'}}",
                "image": updateImageS3Path("/img/clipboard.png")
            },
            "EMAIL_OPENED": {
                "title": "{{agile_lng_translate 'campaigns' 'logs-pad-content-email-opened-title'}}",
                "image": updateImageS3Path("/img/clipboard.png")
            },
            "EMAIL_CLICKED": {
                "title": "{{agile_lng_translate 'campaigns' 'logs-pad-content-email-clicked-title'}}",
                "image": updateImageS3Path("/img/clipboard.png")
            },
            "UNSUBSCRIBED": {
                "title": "{{agile_lng_translate 'campaigns' 'logs-pad-content-unsubscribed-title'}}",
                "image": updateImageS3Path("/img/clipboard.png")
            },
            "EMAIL_HARD_BOUNCED": {
                "title": "{{agile_lng_translate 'campaigns' 'logs-pad-content-email-hard-bounced-title'}}",
                "image": updateImageS3Path("/img/clipboard.png")
            },
            "EMAIL_SOFT_BOUNCED": {
                "title": "{{agile_lng_translate 'campaigns' 'logs-pad-content-email-soft-bounced-title'}}",
                "image": updateImageS3Path("/img/clipboard.png")
            },
            "EMAIL_SPAM": {
                "title": "{{agile_lng_translate 'campaigns' 'logs-pad-content-email-spam-bounced-title'}}",
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
        save_info = '<span style="color: green;">{{agile_lng_translate "campaigns" "saved"}}</span>';
       
       //Show popup modal for adding campaign in trigger or contac
        showCampaignPopup(e);
       
    }

    if(color)
        save_info = $(save_info).css("color", color);

    $("#workflow-msg").html(save_info).show().fadeOut(5000);
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
     fillSelect(id, '/core/api/workflows/partial', 'workflow', callback , optionsTemplate, undefined, el);
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
                showNotyPopUp("information", "{{agile_lng_translate 'campaigns' 'shared-succcess'}}", "top");
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

            workflow_alerts("{{agile_lng_translate 'landingpages' 'next-action'}} ", "null" , "workflow-save-popup-modal", function(el){
               
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

function change_access_level(level, el){
    if(level == "1"){
        $("#campaign_access_level span", el).text('{{agile_lng_translate "campaigns" "make-private"}}');
        $("#campaign_access_level i", el).removeClass("icon-unlock");
        $("#campaign_access_level i", el).addClass("fa fa-lock");
    }
    else {
        $("#campaign_access_level span", el).text('{{agile_lng_translate "campaigns" "make-public"}}');
        $("#campaign_access_level i", el).removeClass("fa fa-lock");
        $("#campaign_access_level i", el).addClass("icon-unlock");
    }
}

var Workflow_Top_Header_Model_Events = Base_Model_View.extend({
    events: {
        'click #sort_menu > li': 'sortCollectionView'
    },

    sortCollectionView : function(e)
    {
        e.preventDefault();

        var targetEl = $(e.currentTarget);
        var sortkey = "", $sort_menu = $("#sort_menu");
        if($(targetEl).find("a").hasClass("sort-field"))
        {
            $sort_menu.find("li").not(targetEl).find("a.sort-field i").addClass("display-none");
            $(targetEl).find("a.sort-field i").removeClass("display-none");
        } else {
            $sort_menu.find("li").not(targetEl).find("a.order-by i").addClass("display-none");
            $(targetEl).find("a.order-by i").removeClass("display-none");
        }

        sortkey = $sort_menu.find(".order-by i:not(.display-none)").closest(".order-by").attr("data");
        sortkey += $sort_menu.find(".sort-field i:not(.display-none)").closest(".sort-field").attr("data");
        
        _agile_set_prefs("workflow_sort_key", sortkey);
        this.model.set({"sortKey" : sortkey});
    },  
});

function showHide_UnsubscribeEmail_Status(alertMsg){
    var is_email_status = $("[id^='unsubscribe-email-']:checked").val();
    if (is_email_status != 'undefined' && is_email_status == "true") {
        $("#unsubscribe-email").attr('disabled',true);
        $("#unsubscribe-email").parent().parent().attr("style","pointerEvents:none; opacity: 0.4;");
        $("#sendEmailSelect").attr('disabled',true);
        $("#sendEmailSelect").parent().parent().attr("style","pointerEvents:none; opacity: 0.4;");
    }else{
        $("#unsubscribe-email").removeAttr('disabled');
        $("#unsubscribe-email").parent().parent().removeAttr("style");
        $("#sendEmailSelect").removeAttr('disabled');
        $("#sendEmailSelect").parent().parent().removeAttr("style");
    }
    if(alertMsg){
        var msg = "You have unsaved changes. Click on ‘Save Campaign’ to save.";
        msg = '<span style="color: red;">'+msg+'</span>';
        $("#unsubscribe-email_status-msg").html(msg).show();  
    }
    
}

/**
* Returns campaign modify changes. Please refer workflow rules json accordingly
*
* @param updated_workflow_json - updated workflow rules json
* @param old_workflow_json - old workflow rules json
**/
function get_campaign_changes(updated_workflow_json, old_workflow_json, callback)
{
    // If any workflow is undefined
    if(!updated_workflow_json || !old_workflow_json)
        return;

    var update_nodes = JSON.parse(updated_workflow_json).nodes;
    var old_nodes = JSON.parse(old_workflow_json).nodes;

    var map = {"ADDED":[], "MODIFIED":[], "DELETED": []};

    // var modified_table = {NodeName, Action, FieldName, Previous Value, New Value};

    head.js(LIB_PATH + 'lib/underscore-min.1.8.3.js', function(){
        
        for(var i=0; i < update_nodes.length; i++){ // nodes iterator
        
            var update_node = update_nodes[i];

            // If Start node
            if(update_node.id == "PBXNODE1")
                continue;

            // Finding in Old workflow json
            var old_node = _.findWhere(old_nodes, {id: update_node.id});
            
            if(old_node)
            {
                // Check both nodes are same or not?
                var is_equal = _.isEqual(old_node.JsonValues, update_node.JsonValues);

                if(is_equal)
                {
                    // Do Nothing
                }
                else
                {
                    console.log("Node Modified...");
                    
                    // Modified Field Values
                    var modified_field_values = [];
                    for(var j=0; j< update_node.JsonValues.length; j++) // Fields Iterator
                    {

                        var updated_node_field = update_node.JsonValues[j];
                        var search_obj = search_for_old_field(updated_node_field, old_node.JsonValues);
                        var old_node_field = search_obj["field"];
                        var key_identity = search_obj["key_identity"];
                       
                        // If any of the fields is undefined
                        if(!updated_node_field || !old_node_field)
                            continue;

                        // Compare update field and old field
                        var field_equal = _.isEqual(updated_node_field, old_node_field);

                        console.log(field_equal);
                        console.log("Node.................." +  updated_node_field.name);

                        if(!field_equal)
                        {
                            try
                            {        
                                var modified_data = {};
                                modified_data.node_name = update_node.displayname;

                                // If Node name is changed, it doesn't comes under ui
                                if(updated_node_field.name == "nodename" && key_identity == "nodename")
                                {
                                    modified_data.name = "Node Name";
                                    modified_data.old_value = old_node_field.value;
                                    modified_data.new_value = updated_node_field.value;
                                }
                                else
                                {
                                    var modified_field_ui_obj = search_ui_obj(old_node.NodeDefinition.ui, key_identity);

                                    modified_data.name = get_modified_name(modified_field_ui_obj);
                                    modified_data.old_value = get_modified_value(modified_field_ui_obj, updated_node_field.name
                                                                , old_node_field.value);
                                    modified_data.new_value = get_modified_value(modified_field_ui_obj, updated_node_field.name
                                                                , updated_node_field.value);
                                }


                                modified_field_values.push(modified_data);
                            }
                            catch(err)
                            {
                                console.debug("Error occured while pushing modified fields..." + err);
                            }

                        }

                    }

                    if(modified_field_values && modified_field_values.length > 0)
                    map["MODIFIED"].push(modified_field_values);
                }

                // Remove existing node from old_nodes
                old_nodes = _.without(old_nodes, old_node);

            }
            else
            {
                console.log("Newly Added....");
                map["ADDED"].push(update_node.displayname);
            }
        }

         // If still nodes exists, those are deleted nodes in updated workflow
        for(var i=0; i< old_nodes.length; i++){

            if(old_nodes[i].id == "PBXNODE1")
                continue;

            console.log("Node deleted..." + old_nodes[i].displayname);

            map["DELETED"].push(old_nodes[i].displayname);
        }


        if(callback && typeof callback == "function"){
            callback(map);
        }

    });
}

function search_for_old_field(updated_node_field, old_node_json_values)
{
    var search_obj = {};
    var old_field;

    // Search in Old JSONValues and pick that JSONValue
    if(updated_node_field.hasOwnProperty("name"))
    {
        old_field  = _.findWhere(old_node_json_values, 
                                    {name: updated_node_field.name});
        key_identity = updated_node_field.name;
    }
    else
    {
        for(var key in updated_node_field)
        {
            old_field = _.find(old_node_json_values, function(obj){
                if(obj.hasOwnProperty(key)){
                 key_identity = key;
                 return obj;
             }
            });
        }
    }

    search_obj["field"] = old_field;
    search_obj["key_identity"] = key_identity;

    return search_obj;
}

function search_ui_obj(node_ui, key_identity)
{
     var ui_obj = _.find(node_ui, function(obj)
        {
            if(obj.name == key_identity)
            {
                return obj; 
            }
        });

     return ui_obj;
}

function get_modified_name(modified_field_ui_obj)
{
    var name = "";

    if(modified_field_ui_obj)
        name = modified_field_ui_obj.label;

    // If Modified field undefined
    if(!name)                            
        name = modified_field_ui_obj.name;

    name = name.replace(/:+$/, "");

    return name;
}

function get_modified_value(modified_field_ui_obj, field_name, field_value)
{
    var value = "-";
    var restricted_fields = ["text_email", "html_email", "unsubscribe", "description", "campaign_id", "milestone"];
    var allow_select_values = ["from_email"];

    if(restricted_fields.indexOf(field_name) != -1)
        return "-";

    if(modified_field_ui_obj.options) // For select fields having options, return key's text
    {

       if(allow_select_values.indexOf(field_name) != -1)
       {
            // Removed * if occurs in first character
            if(field_value.charAt(0) === '*')
            {
                field_value = field_value.substr(1);
            }

            return field_value;
       }

       value = _.findKey(modified_field_ui_obj.options, function(value)
        {
            if(value == field_value)
            {
                // Removed * if occurs in first character
                if(value.charAt(0) === '*')
                {
                    value = value.substr(1);
                }

                return value;
            }

        });
    }
    else
    {
       value = field_value;
    }
    
    if(!value)
        value = "-";

    // Removed * if occurs in first character
    if(value.charAt(0) === '*')
        value = value.substr(1);

    return value;
}
function workflowVideoPopup(){
    var data={};
    data.title="Workflows Tutorial";
    data.videourl="//www.youtube.com/embed/fPFS3w0GSyw?enablejsapi=10&amp;autoplay=1";
    showHelpVideoModal(data);
}

function showHelpVideoModal(data){
    getTemplate('help_video_tutorial_modal', data, undefined, function(template_ui){
                if(!template_ui)
                      return;           

                $("#help_video_tutorial_modal").html($(template_ui)).modal('show');

                // Stops video on modal hide
                $("#help_video_tutorial_modal").on("hide.bs.modal", function(){
                    $(this).html("");
                });

    }, null);
}

// Verify all nodes are connnected or not wit another node
function all_nodes_active(el, designerJSON,callback){
    
    
    try{
        if ($(el).attr('id') && $(el).attr('id') =='disable-workflow') {
            callback(true);
            return;
        }
        // getting all nodes of the Campaign
        var nodes  = JSON.parse(designerJSON).nodes;
        var is_active = true;
        var hangup_nodes = 0;
        var possible_hangup_nodes_count = 1;
        var multiNodes_States_HangUp = 0;

        $.each(nodes,function(node_name,node_value){
            
            var node_states= node_value.States;
            var node_value_length = node_states.length;
            // checking for "start" node
            if(node_value.displayname == "Start"){
                if(node_states[0].start == "hangup"){
                    is_active = false;
                    hangup_nodes++;
                }                    
            }
            else {
                // This is for the nodes which have 1 outgoing path like "wait" node    
                if(node_value_length == 1){
                    $.each(node_states[0], function(key, value) {
                         // "hangup" means not connected to any node
                        if(value == "hangup")
                            hangup_nodes++;
                        
                        return;
                    });
                }
                // This is for the nodes which have 2 outgoing path like "Opened?" node
                else{
                    multiNodes_States_HangUp = 0 ;
                    $.each(node_states, function(key, value) {
                        $.each(value,function(key,value){
                            // "hangup" means not connected to any node
                            if(value == "hangup")
                                multiNodes_States_HangUp++;

                            return;
                        });                                    
                    });
                    // If both outgoing path not connected with other node 
                    if(multiNodes_States_HangUp == 2)
                        hangup_nodes++;

                    // If both outgoing path are connected with other node
                    if(multiNodes_States_HangUp == 0)
                        possible_hangup_nodes_count++;                    
                }                        
            }        
        });
        if(hangup_nodes > possible_hangup_nodes_count)
            is_active = false;        
    }
    catch(err){
        callback(is_active);
    }
    callback(is_active);
}
