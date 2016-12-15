/**
 * Creates backbone model events view with 
 * leads bulk actions events like add tags, remove tags etc...
 */
var Leads_Bulk_Action_Events_View = Base_Model_View.extend({
    events: {
        'click #addTagsToLeadsBulk' : 'addTagsToLeadsBulk',
        'click #removeTagsToLeadsBulk' : 'removeTagsToLeadsBulk',
        'click #changeOwnerToLeadsBulk' : 'changeOwnerToLeadsBulk',
        'change .emailSelect' : 'onEmailSelect',
        'click #sendEmail' : 'sendEmail',
        'click #send-email-close' : 'closeSendEmail',
        'click #cc-link, click #bcc-link' : 'openCcOrBccLinks',
        'click #from_email_link' : 'fromEmailLink',
        'click .add-attachment-select' : 'addAttachmentSelect',
        'click .add-attachment-confirm' : 'addAttachmentConfirm',
        'click .add-attachment-cancel' : 'addAttachmentCancel',
        'click #bulk-send-email' : 'bulkEmailSend',
        'click #changeStatusToLeadsBulk' : 'changeStatusToLeadsBulk'
    },

    addTagsToLeadsBulk : function(e)
    {
        e.preventDefault();
        var tags = get_tags('tagsBulkForm');

        var tag_input = $('#addBulkTags').val().trim();
        $('#addBulkTags').val("");
        
        if(tag_input && tag_input.length>=0 && !(/^\s*$/).test(tag_input))
        {
            var template = Handlebars.compile('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="{{name}}">{{name}}<a class="close" id="remove_tag" tag="{{name}}">&times</a></li>');
            // Adds contact name to tags ul as li element
            $('#addBulkTags').closest(".control-group").find('ul.tags').append(template({name : tag_input}));
        }   
        
        if(tag_input != "")
            tags[0].value.push(tag_input);

        if (tags[0].value.length > 0)
        {
            var tags_valid = true;
            $.each(tags[0].value, function(index, value)
                {
                    if(!isValidTag(value, false)) {
                        tags_valid = false;
                        return false;
                    }
                });
            if(!tags_valid) {
                $('.invalid-tags').show().delay(6000).hide(1);
                return false;
            }
            // Show loading symbol until model get saved
            var saveButton=$(e.currentTarget);

            disable_save_button(saveButton);
            
            var url = '/core/api/bulk/update?action_type=ADD_TAG';
            var json = {};
            json.data = JSON.stringify(tags[0].value);
            json.contact_ids = App_Leads.idArray;

            acl_util.canAddTag(json.data,function(result){
                App_Leads.leadsBulkActions.postBulkOperationData(url, json, $('#tagsBulkForm'), undefined, function(data)
                {
                    enable_save_button(saveButton);
                    // Add the added tags to the collection of tags
                    $.each(tags[0].value, function(index, tag)
                    {
                        tagsCollection.add({ "tag" : tag });
                    });
                }, _agile_get_translated_val('contacts','add-tag-scheduled'));
            }, function(error){
                enable_save_button(saveButton);
            });
        }
        else 
        {
            $('#addBulkTags').focus();
            $('.error-tags').show().delay(3000).hide(1);
            return;
        }
    },

    removeTagsToLeadsBulk : function(e)
    {
        e.preventDefault();
        var tags = get_tags('tagsRemoveBulkForm');

        // To add input field value as tags
        var tag_input = $('#removeBulkTags').val().trim();
        $('#removeBulkTags').val("");

        if (tag_input && tag_input.length >= 0 && !(/^\s*$/).test(tag_input))
        {
            var template = Handlebars.compile('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="{{name}}">{{name}}<a class="close" id="remove_tag" tag="{{name}}">&times</a></li>');
            // Adds contact name to tags ul as li element
            $('#removeBulkTags').closest(".control-group").find('ul.tags').append(template({name : tag_input}));
            
        }

        if (tag_input != "")
            tags[0].value.push(tag_input);

        if (tags[0].value.length > 0)
        {
            // Show loading symbol until model get saved
            var saveButton = $(e.currentTarget);

            disable_save_button(saveButton);

            // $('#tagsBulkForm').find('span.save-status').html(getRandomLoadingImg());

            var url = '/core/api/bulk/update?action_type=REMOVE_TAG';
            var json = {};
            json.data = JSON.stringify(tags[0].value);
            json.contact_ids = App_Leads.idArray;

            App_Leads.leadsBulkActions.postBulkOperationData(url, json, $('#tagsRemoveBulkForm'), undefined, function(data)
            {
                enable_save_button(saveButton);
                // Add the added tags to the collection of
                // tags
                $.each(tags[0].value, function(index, tag)
                {
                    tagsCollection.add({ "tag" : tag });
                });
            }, _agile_get_translated_val('contacts','delete-tag-scheduled'));
        }
        else
        {
            $('#removeBulkTags').focus();
            $('.error-tags').show().delay(3000).hide(1);
            return;
        }
    },

    changeOwnerToLeadsBulk : function(e)
    {
        e.preventDefault();
        var $form = $('#ownerBulkForm');

        if ($(e.currentTarget).attr('disabled') == 'disabled' || !isValidForm($form))
        {
            return;
        }

        var saveButton = $(e.currentTarget);

        disable_save_button(saveButton);
        
        var new_owner = $('#ownerBulkSelect option:selected').prop('value');
        var url = '/core/api/bulk/update?action_type=CHANGE_OWNER&owner=' + new_owner;
        var json = {};
        json.contact_ids = App_Leads.idArray;
        App_Leads.leadsBulkActions.postBulkOperationData(url, json, $form, undefined, function(data)
        {
            enable_save_button(saveButton);
        }, Handlebars.compile("{{agile_lng_translate 'bulk-actions' 'leads-owner-change-scheduled'}}"));
    },

    /**
     * Populates subject and description using email templates, on select option
     * change of "Fill From Templates" field.
     */
    onEmailSelect : function(e)
    {
        e.preventDefault();

        // To remove previous errors
        $('#emailForm').find('.error').removeClass('error');
        $('#emailForm').find('.help-inline').css('display', 'none');

        var model_id = $('.emailSelect option:selected').prop('value');

        // When default option selected make subject and body empty
        if (!model_id)
        {
            // Fill subject and body of send email form
            $("#emailForm").find('input[name="subject"]').val("");

            set_tinymce_content('email-body', '');

            $("#emailForm").find('textarea[name="message"]').val("");
            
            $('.add-attachment-cancel').trigger("click");

            $('#eattachment_error').hide();
            return;
        }

        var emailTemplatesModel = Backbone.Model.extend({ url : '/core/api/email/templates/' + model_id, restKey : "emailTemplates" });
        var templateModel = new emailTemplatesModel();
        templateModel.fetch({ success : function(data)
        {
            var model = data.toJSON();

            var subject = model.subject;
            var text = model.text;

            // Apply handlebars template on send-email route
            if (Current_Route !== 'lead-bulk-email' && Current_Route !== 'send-email')
            {
                /*
                 * Get Contact properties json to fill the templates using
                 * handlebars
                 */
                var json = get_contact_json_for_merge_fields();
                var template;

                // Templatize it
                try
                {
                    template = Handlebars.compile(subject);
                    subject = template(json);
                }
                catch (err)
                {
                    subject = add_square_brackets_to_merge_fields(subject);

                    template = Handlebars.compile(subject);
                    subject = template(json);
                }

                try
                {
                    template = Handlebars.compile(text);
                    text = template(json);
                }
                catch (err)
                {
                    text = add_square_brackets_to_merge_fields(text);

                    template = Handlebars.compile(text);
                    text = template(json);
                }
            }

            // Fill subject and body of send email form
            $("#emailForm").find('input[name="subject"]').val(subject);

            // Insert content into tinymce
            set_tinymce_content('email-body', text);
            
            if (model.attachment_id && Current_Route != 'bulk-email' && Current_Route != 'company-bulk-email')
            {
                var el = $('.add-attachment-select').closest("div");
                $('.add-attachment-select').hide();
                el.find(".attachment-document-select").css("display", "inline");
                var optionsTemplate = "<option value='{{id}}' network_type='{{titleFromEnums network_type}}' size='{{size}}' url='{{url}}'>{{name}}</option>";
                fillSelect('attachment-select','core/api/documents', 'documents',  function fillNew()
                {
                    el.find("#attachment-select option:first").after("<option value='new'>"+_agile_get_translated_val('others','upload-new-doc')+"</option>");
                    $('#attachment-select').find('option[value='+model.attachment_id+']').attr("selected","selected");
                    $('.add-attachment-confirm').trigger("click");

                }, optionsTemplate, false, el);
            }
            else if (model.attachment_id && (Current_Route == 'bulk-email' || Current_Route == 'company-bulk-email'))
            {
                $('.add-attachment-select').hide();
                $('#eattachment_error').show();
            }
            else if(!model.attachment_id && (Current_Route == 'bulk-email' || Current_Route == 'company-bulk-email'))
            {
                $('.add-attachment-select').hide();
                $('#eattachment_error').hide();
            }
            else if(!model.attachment_id)
            {
                $('.add-attachment-cancel').trigger("click");
                $('#eattachment_error').hide();
            }
        } });
    },

    /**
     * Sends email to the target email. Before sending, validates and serializes
     * email form.
     */
    sendEmail : function(e)
    {
        e.preventDefault();

        if ($(e.currentTarget).attr('disabled'))
            return;
        var $form = $('#emailForm');
        // Is valid
        if (!isValidForm($form))
            return;

        var network_type = $('#attachment-select').find(":selected").attr('network_type');
        // checking email attachment type , email doesn't allow
        // google drive documents as attachments
        if (network_type)
        {
            if (network_type.toUpperCase() === 'GOOGLE')
                return;
        }

        // Saves tinymce content to textarea
        save_content_to_textarea('email-body');

        // serialize form.
        var json = serializeForm("emailForm");
        
        json.from = $(".email").find(":selected").val();
        if ((json.contact_to_ids).join())
            json.to += ((json.to != "") ? "," : "") + (json.contact_to_ids).join();

        if ((json.contact_cc_ids).join())
            json.cc += ((json.cc != "") ? "," : "") + (json.contact_cc_ids).join();

        if ((json.contact_bcc_ids).join())
            json.bcc += ((json.bcc != "") ? "," : "") + (json.contact_bcc_ids).join();

        if (json.to == "" || json.to == null || json.to == undefined)
        {
            // Appends error info to form actions block.
            $save_info = $('<span style="display:inline-block;color:#df382c;">'+_agile_get_translated_val('validation-msgs','required')+'</span>');
            $('#emailForm').find("#to").closest(".controls > div").append($save_info);
            $('#emailForm').find("#to").focus();
            // Hides the error message after 3 seconds
            $save_info.show().delay(3000).hide(1);

            enable_send_button($('#sendEmail'));
            return;
        }

        // Is valid
        if (!isValidForm($('#emailForm')))
            return;

        try
        {
            var emails_length = json.to.split(',').length;
            var MAX_EMAILS_LIMIT = 10;

            if(json.cc)
                emails_length = json.cc.split(',').length + emails_length;

            if(json.bcc)
                emails_length = json.bcc.split(',').length + emails_length;

            if(emails_length > MAX_EMAILS_LIMIT)
            {
                showAlertModal("Maximum limit of sending emails at once exceeded.", undefined, function(){},
                    function(){},
                    "Alert");
                return;
            }
        }
        catch(err)
        {
            
        }
        
        var that =$(e.currentTarget);

        if(hasScope("EDIT_CONTACT"))
        {
            emailSend(that,json);
        }
        else
        {
            showModalConfirmation(_agile_get_translated_val('contact-details','send-email'), 
                _agile_get_translated_val('campaigns','no-perm-send-emails') + "<br/><br/> " + _agile_get_translated_val('deal-view','do-you-want-to-proceed'),
                function (){
                    emailSend(that,json);
                },
                function(){
                    return;
                },
                function(){
    
                });
        }
    },

    /**
     * Close button click event of send email form. Navigates to contact detail
     * view.
     */
    closeSendEmail : function(e)
    {
        e.preventDefault();
        window.history.back();
    },

    openCcOrBccLinks : function(e)
    {
        e.preventDefault();

        // Hide link
        $(e.currentTarget).hide();

        if ($(e.currentTarget).attr('id') === 'cc-link')
        {
            $('#email_cc').closest('.control-group').show();

            // Hide div.control-group to reduce space between subject
            if ($(e.currentTarget).parent().find('#bcc-link').css('display') === 'none')
                $(e.currentTarget).closest('.control-group').hide();

            return;
        }

        if ($(e.currentTarget).parent().find('#cc-link').css('display') === 'none')
            $(e.currentTarget).closest('.control-group').hide();

        $('#email_bcc').closest('.control-group').show();
    },

    fromEmailLink : function(e)
    {
        e.preventDefault();
        $(e.currentTarget).closest('.control-group').hide();
        $('#from_email').closest('.control-group').show();
        $('#from_name').closest('.control-group').show();
        return;
    },

    /**
     * For showing existing documents and Add new doc option
     * to attach in send-email form 
     */
    addAttachmentSelect : function(e)
    {
        e.preventDefault();
        var el = $(e.currentTarget).closest("div");
        $(e.currentTarget).css("display", "none");
        el.find(".attachment-document-select").css("display", "inline");
        var optionsTemplate = "<option value='{{id}}' network_type='{{titleFromEnums network_type}}' size='{{size}}' url='{{url}}'>{{name}}</option>";
        fillSelect('attachment-select','core/api/documents', 'documents',  function fillNew()
        {
            el.find("#attachment-select option:first").after("<option value='new'>"+_agile_get_translated_val('others','upload-new-doc')+"</option>");

        }, optionsTemplate, false, el);
    },

    /**
     * For adding existing document to current contact
     */
    addAttachmentConfirm : function(e)
    {
        e.preventDefault();     
        var network_type = $('#attachment-select').find(":selected").attr('network_type');
        var document_size = $('#attachment-select').find(":selected").attr('size');
        if(typeof network_type !=='undefined' && network_type.toUpperCase() === 'GOOGLE')
        {
            $(e.currentTarget).closest("span").find(".attachment-status").html("<span style='color:#df382c;margin-top:10px; display:block'>"+_agile_get_translated_val('documents','gd-error')+"</span>");
            //$(e.currentTarget).css({'border': '1px solid #df382c','outline': 'none'   });                                            
        }
        else if(document_size >= 5242880){
            $(e.currentTarget).closest("span").find(".attachment-status").html("<span style='color:#df382c;margin-top:10px; display:block'>"+_agile_get_translated_val('documents','size-exceed-error')+"</span>");
            //$(e.currentTarget).css({'border': '1px solid #df382c','outline': 'none'   });
        }
        else
        {
            $('#attachment-select').closest("span").find('.attachment-status').find("span").fadeOut(0);
            $('#attachment-select').css({"border":"1px solid #bbb"});
            var document_id = $(e.currentTarget).closest(".attachment-document-select").find("#attachment-select").val();
            var saveBtn = $(e.currentTarget);
            
            // To check whether the document is selected or not
            if(document_id == "")
            {
                saveBtn.closest("span").find(".save-status").html("<span style='color:red;margin-left:10px;'>"+_agile_get_translated_val('validation-msgs','required')+"</span>");
                saveBtn.closest("span").find('span.save-status').find("span").fadeOut(5000);
                return;
            }           
            else if(document_id == "new")
            {   
                e.preventDefault();
                $(e.currentTarget).closest('form').find('#error').html("");
                var form_id = $(e.currentTarget).closest('form').attr("id");
                var id = $(e.currentTarget).find("a").attr("id");
                
                var newwindow = window.open("upload-attachment.jsp?id="+ form_id +"&t=" + CURRENT_USER_PREFS.template +"&d=" + CURRENT_DOMAIN_USER.domain, 'name','height=310,width=500');
                
                if (window.focus)
                {
                    newwindow.focus();
                }
            }
            else if(document_id != undefined && document_id != null)
            {
                var docName = $( "#attachment-select option:selected").text();
                $('#emailForm').find('#eattachment').css('display','block');
                $('#emailForm').find('#attachment_id').find("#attachment_fname").html('<a href='+$( "#attachment-select option:selected").attr('url')+'>'+docName+'</a>');
                $('#emailForm').find(".attachment-document-select").css('display','none');
                $('#emailForm').find('#eattachment_key').attr('name',"document_key");
                $('#emailForm').find('#eattachment_key').attr('value',document_id);
                $("#emailForm").find("#agile_attachment_name").attr("value", docName);
                $("#emailForm").find("#agile_attachment_url").attr("value", $("#attachment-select option:selected").attr("url"))
            }
        }
    },

    /**
     * To cancel the add attachment request in send-email form
     */
    addAttachmentCancel : function(e)
    {
        e.preventDefault();
        var blobKey = $('#emailForm').find('#attachment_id').attr('name');
        if(typeof blobKey !== typeof undefined)
        {
            if(blobKey.toLowerCase() === 'blob_key')
            {
                var blobKeyValue = $('#emailForm').find('#eattachment_key').attr("value");
                deleteBlob(blobKeyValue);
            }
        }
        $('#attachment-select').closest("span").find('.attachment-status').find("span").fadeOut(0);
        $('#attachment-select').css({"border":"1px solid #bbb"});    
        $('#attachment-select').find('option:first').attr('selected', 'selected');
        var el = $(e.currentTarget).closest("div");
        $('#emailForm').find('.attachment-document-select').css('display','none');
        $('#emailForm').find('#eattachment').css('display','none');
        $('#emailForm').find(".add-attachment-select").css("display", "inline");
        $('#emailForm').find('#eattachment_key').attr("name","name");
        $('#emailForm').find('#eattachment_key').attr("value","value");
        $("#emailForm").find("#agile_attachment_name").attr("value", "");
        $("#emailForm").find("#agile_attachment_url").attr("value", "")
        $('#enable_tracking').css("margin-top", "-7px");
    },

    bulkEmailSend : function(e)
    {
        e.preventDefault();

        if ($(e.currentTarget).attr('disabled'))
            return;

        var $form = $('#emailForm');

        // Is valid
        if (!isValidForm($form))
            return;

        // Disables send button and change text to Sending...
        disable_send_button($(e.currentTarget));

        // Saves tinymce content to textarea
        save_content_to_textarea('email-body');

        // serialize form.
        var form_json = serializeForm("emailForm");

        var url = '/core/api/bulk/update?action_type=SEND_EMAIL';

        var json = {};
        json.contact_ids = App_Leads.bulk_lead_ids_to_send_email;
        json.data = JSON.stringify(form_json);
        
        var msg = _agile_get_translated_val('campaigns','emails-queued') + " " + count + " " +_agile_get_translated_val('contact-details','contacts')+ ". " + _agile_get_translated_val('campaigns','emails-sent-shortly');
        if(company_util.isCompany())
            msg = _agile_get_translated_val('campaigns','emails-queued') + " " + count + " " +_agile_get_translated_val('contact-details','companies')+ ". "+ _agile_get_translated_val('campaigns','emails-sent-shortly');

        App_Leads.leadsBulkActions.postBulkOperationData(url, json, $form, null, function()
        {
            enable_send_button($('#bulk-send-email'));
        }, msg);
    },

    changeStatusToLeadsBulk : function(e)
    {
        e.preventDefault();
        var $form = $('#statusBulkForm');

        if ($(e.currentTarget).attr('disabled') == 'disabled' || !isValidForm($form))
        {
            return;
        }

        var saveButton = $(e.currentTarget);

        disable_save_button(saveButton);
        
        var new_status = $('#statusBulkSelect option:selected').prop('value');
        var url = '/core/api/bulk/update?action_type=CHANGE_STATUS&status=' + new_status;
        var json = {};
        json.contact_ids = App_Leads.idArray;
        App_Leads.leadsBulkActions.postBulkOperationData(url, json, $form, undefined, function(data)
        {
            enable_save_button(saveButton);
        }, Handlebars.compile("{{agile_lng_translate 'bulk-actions' 'leads-status-change-scheduled'}}"));
    },

});