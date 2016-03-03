function initializeEmailBuilderListeners() {

	$('#emailbuilder-listeners').off();
	
	$('#emailbuilder-listeners').on('click', '.saveEmailBuilderButton', function(e){
		e.preventDefault();
    	if (isValidForm('#emailBuilderForm')) {
    		$(".saveEmailBuilderButton").prop("disabled",true);
			$(".saveEmailBuilderButton").html("Saving...");
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
            el.find("#attachmentSelectBox option:first").after("<option value='new'>Upload new doc</option>");

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
    var message = "Template saved.";
    //to check already template id exists or not
    var templateId = $("#templateid").val();
    if(templateId) {
        var requestType = "put";
        template["id"] = templateId;
        message = "Template updated.";
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
            $(".saveEmailBuilderButton",parent.document).html("Save");
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

    var requestType = "post";
    var message = "Test Email Sent.";

    $.ajax({
        type: requestType, 
        url: 'core/api/emails/send-test-email',    
        data: template,
        success: function (data) {
            $("#nameoftemplate-msg",parent.document).html('<br><span style="color: green;">'+message+'</span>').show().fadeOut(3000);
            
        },
    });
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