function initializeEmailBuilderListeners() {

    $('#emailbuilder-listeners').off();
    
    $('#emailbuilder-listeners').on('click', '.saveEmailBuilderButton', function(e){
        e.preventDefault();
        if (isValidForm('#emailBuilderForm')) {
            $(".saveEmailBuilderButton").prop("disabled",true);
            $(".saveEmailBuilderButtonText").html("{{agile_lng_translate 'others' 'saving'}}");
            document.getElementById('emailBuilderFrame').contentWindow.$('#save').trigger("click");
        }
    });

    $('#emailbuilder-listeners').on('click', '.sendTestEmailButton', function(e){
         e.preventDefault();
        if (isValidForm('#emailBuilderForm')) {
            document.getElementById('emailBuilderFrame').contentWindow.$('#sendTestEmail').trigger("click");          
        }
    });

    $('#emailbuilder-listeners').on('click', '#emailBuilderOptionsLink', function (e) {
        e.preventDefault();
        $(this).find('i').toggleClass('icon-plus').toggleClass('icon-minus');
        $("#emailBuilderOptions").slideToggle('fast');
    });

    $('#emailbuilder-listeners').on('click', '#mainsourcepreview', function (e) {
        e.preventDefault();
        document.getElementById('emailBuilderFrame').contentWindow.$('#sourcepreview').trigger("click");
    });

    $('#emailbuilder-listeners').on('click', '.addAttachmentLink', function(e){
        e.preventDefault();
        var el = $(this).closest("div");
        $(this).css("display", "none");
        el.find("#attachmentSelectBoxHolder").css("display", "inline");
        var optionsTemplate = "<option value='{{id}}' network_type='{{titleFromEnums network_type}}' size='{{size}}'>{{name}}</option>";
        fillSelect('attachmentSelectBox','core/api/documents', 'documents',  function fillNew()
        {
            el.find("#attachmentSelectBox option:first").after("<option value='new'>"+_agile_get_translated_val('others','upload-new-doc')+"</option>");

        }, optionsTemplate, false, el);
        $('#attachmentSelectBoxRequired').hide();
        $(this).hide();
    });

    $('#emailbuilder-listeners').on("click", ".attachmentAddBtn,.add-tpl-attachment-confirm", function(e){
        e.preventDefault();
        var selectedVal = $('#attachmentSelectBox').val();
        if(selectedVal == "new"){
            $('#uploadDocumentModal').html(getTemplate("upload-document-modal", {})).modal('show');
            $('#GOOGLE',$('#uploadDocumentModal')).parent().hide();
        }else if(selectedVal != ""){
            $('#attachmentSelectBoxHolder').hide();
            $('#attachmentHolder').show();
            $('#attachment_id').val(selectedVal);
            $('#attachment_text').html($('#attachmentSelectBox option:selected').text());
        }else if(selectedVal == ""){
            $('#attachmentSelectBoxRequired').show();
        }
    });

    $('#emailbuilder-listeners').on("click", ".attachmentCancelBtn", function(e){
        e.preventDefault();
        $('.addAttachmentLink').show();
        $('#attachmentHolder').hide();
        $('#attachmentSelectBoxHolder').hide();
        $('#attachment_id').val("");
        $('#attachment_text').html("");
    });

    $('#emailbuilder-listeners').on("change", "#attachmentSelectBox", function(e){
        if($(this).val() == ""){
            $('#attachmentSelectBoxRequired').show();
        } else {
            $('#attachmentSelectBoxRequired').hide();
        }
    });

    $('#emailbuilder-listeners').on('click', '#bringYourCodeBtn', function(e){
        e.preventDefault();
        BRING_YOUR_CODE_BTN = true;
        window.location.hash = "#email-template-add";
    });

    $('#emailbuilder-listeners').on('click', '.videoRecordHiddenBtn', function(e){
        e.preventDefault();

        $("#modal-backdrop").hide();
        var $videoRecordModalEl = $("#videoRecordModal");
        $.getJSON("core/api/video-record", function(data) {
           getTemplate("video-record-modal",data, undefined, function(ui){
            $videoRecordModalEl.html(ui).modal("show");
           });
        });

    });

    $('#videoRecordModal').on('submit','#videoRecordForm', function(e){
        e.preventDefault();
        var videoRecordType = $("#videoRecordType").val();
        if(videoRecordType === "new") {
            emailVideoRecord.uploadVideoToS3();
        } else {
            emailVideoRecord.buildVideoPageURL($("#video-record-select").val());
        }
    });

    $('#videoRecordModal').on('click','#newRecordBtn', function(e){
        e.preventDefault();
        $("#videoRecordSelectFields").hide();
        $("#videoRecordType").val("new");
        $("#videoRecordFields").show();
    });
    
}

function saveEmailTemplateFromBuilder(fullSource,builderSource) {
    
    var template = {
    "name": $("#nameoftemplate").val(),
    "subject": $("#subject").val(),
    "text": fullSource,
    "text_email": $("#text_email").val(),
    "html_for_builder": builderSource,
    "is_template_built_using_builder": true,
    "attachment_id": ($("#attachment_id").val()) ? $("#attachment_id").val() : ""
    };

    var requestType = "post";
    var message = "{{agile_lng_translate 'emailbuilder' 'saved'}}";
    //to check already template id exists or not
    var templateId = $("#templateid").val();
    if(templateId) {
        var requestType = "put";
        template["id"] = templateId;
        message = "{{agile_lng_translate 'emailbuilder' 'updated'}}";
    }

    $.ajax({
        type: requestType, 
        url: 'core/api/email/templates',       
        data: JSON.stringify(template),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $("#nameoftemplate-msg",parent.document).html('<br><span style="color: green;">'+message+'</span>').show().fadeOut(3000);
            $(".saveEmailBuilderButton",parent.document).prop("disabled",false);
            $(".saveEmailBuilderButtonText",parent.document).html("{{agile_lng_translate 'modals' 'save'}}");
            if(requestType == "post") {
                window.location.hash = "email-templates";
            }
        },
    });
}

function sendTestEmailTemplate(fullSource,builderSource) {
    
    var template = {
                "name": $("#nameoftemplate").val(),
                "from_name": CURRENT_DOMAIN_USER.name,
                "from_email":CURRENT_DOMAIN_USER.email,
                "to_email": CURRENT_DOMAIN_USER.email,
                "replyto_email":CURRENT_DOMAIN_USER.email,
                "subject": $("#subject").val(),
                "text_email": $("#text_email").val(),
                "html_email": fullSource
            };

    // Verifies merge fields and gives alert
    if ( check_merge_fields_and_send(template) ){
        var requestType = "post";
        var message = "{{agile_lng_translate 'emailbuilder' 'sent-testemail'}}";

        $.ajax({
            type: requestType, 
            url: 'core/api/emails/send-test-email',    
            data: template,
            success: function (data) {
                $("#nameoftemplate-msg",parent.document).html('<br><span style="color: green;">'+message+'</span>').show().fadeOut(3000);
            
            },
        });
    }
}


function redirectToOldEditor(templateId) {
    window.location.hash = "email-template/"+templateId;
}

function onEmailBuilderLoad() {
    $("#loadingImgHolder").hide();
    $("#emailBuilderTopOptionsHolder").show();
    $("#attachmentsHolderElement").show();
    $("#emailBuilderFrame").prop("height",680);
}

function setAttachmentInTemplateEdit(attachmentId) {
    $('.addAttachmentLink').hide();
    $('#attachmentSelectBoxHolder').hide();
    $('#attachmentHolder').show();

    $.getJSON("core/api/documents/"+attachmentId, function(data) {
        if(data) {
            $('#attachment_id').val(attachmentId);
            $('#attachment_text').html(data.name);
        } else {
            $('#attachmentHolder').hide();
            $('.addAttachmentLink').show();
        }
    });
}

function check_merge_fields_and_send(template)
 {
    
     var subject = $('#subject').val();
     var text_body = template.text_email;
     var html_body = template.html_email;
     if((subject && subject.indexOf('{{') != -1) || (text_body && text_body.indexOf('{{') != -1) || (html_body && html_body.indexOf('{{') != -1))
         {
             if ( show_test_email_alert(template))
             {
                return true;
             }else{
                return false;
             }
             
         }
      else
         {
             //send_test_email();
             return true;
         }
         
 
  }
  
 function show_test_email_alert(template){
     var title=_agile_get_translated_val('emailbuilder','send-testemail');
     var message=_agile_get_translated_val('emailbuilder','observe-merge-fields');
 
 
     window.parent.workflow_alerts(title, message , "workflow-alert-modal"
 
         ,function(modal){
 
         var $a = $(modal).find("a");
 
         $a.off("click");
         $a.on("click", function(e){
                     e.preventDefault();
                    
                     // Disable and change text
                     $(this).attr('disabled', 'disabled').text("{{agile_lng_translate 'other' 'sending'}}");
                     var requestType = "post";
                    var message = _agile_get_translated_val('emailbuilder','sent-testemail');

                    $.ajax({
                        type: requestType, 
                        url: 'core/api/emails/send-test-email',    
                        data: template,
                        success: function (data) {
                            $("#nameoftemplate-msg",parent.document).html('<br><span style="color: green;">'+message+'</span>').show().fadeOut(3000);
            
                        },
                    });
                     return true;
                    
                 });
 
         // On hidden
         modal.on('hidden.bs.modal', function (e) {
        
         });
     }); 
 }

var emailVideoRecord = {

    uploadVideoToS3 : function() {
        if(typeof emailVideoRecordRecordedData != "undefined") {

            var file = emailVideoRecordRecordedData.video;

            var uploadedFileName = file.name;
            var filename = uploadedFileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            filename = filename + "_" + new Date().getTime() + "." + uploadedFileName.split('.').pop();

            formData = new FormData();
            formData.append('key',  "videos/local/"+filename);
            formData.append('AWSAccessKeyId', 'AKIAIBK7MQYG5BPFHSRQ');
            formData.append('acl', 'public-read');
            formData.append('content-type', 'video/webm');
            formData.append('policy', 'ewogICJleHBpcmF0aW9uIjogIjIwMjUtMDEtMDFUMTI6MDA6MDAuMDAwWiIsCiAgImNvbmRpdGlvbnMiOiBbCiAgICB7ImJ1Y2tldCI6ICJhZ2lsZWNybSIgfSwKICAgIHsiYWNsIjogInB1YmxpYy1yZWFkIiB9LAogICAgWyJzdGFydHMtd2l0aCIsICIka2V5IiwgInZpZGVvcy8iXSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJENvbnRlbnQtVHlwZSIsICJ2aWRlby8iXSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJHN1Y2Nlc3NfYWN0aW9uX3N0YXR1cyIsICIyMDEiXSwKICBdCn0=');
            formData.append('signature', '/XP/Uq6l0iVo+uNWkwwhC8l4jVY=');
            formData.append('success_action_status', '201');
            formData.append('file', file);
            console.log(formData);
            
            $.ajax({
                data: formData,
                dataType: 'xml',
                type: "POST",
                cache: false,
                contentType: false,
                processData: false,
                url: "https://agilecrm.s3.amazonaws.com/",
                success: function(data) {
                  // getting the url of the file from amazon and insert it into the editor
                  var url = $(data).find('Location').text();
                  this.videoS3URL = decodeURIComponent(url);
                  this.saveVideoRecord();
                }
            });
        }
    },

    saveVideoRecord : function() {
        var videoMeta = {
            "name": $("#video-record-name").val(),
            "url": this.videoS3URL
        };

        var requestType = "post";

        $.ajax({
            type: requestType, 
            url: 'core/api/video-record',       
            data: JSON.stringify(videoMeta),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                this.buildVideoPageURL(data.id);
            },
        });
    },

    buildVideoPageURL : function(videoId) {
        var videoURL = window.location.protocol + "//" + window.location.host + "/video/" + videoId;
        document.getElementById('emailBuilderFrame').contentWindow.$("#image-link").val(videoURL);
        $("#videoRecordModal").modal("hide");
    }

};
