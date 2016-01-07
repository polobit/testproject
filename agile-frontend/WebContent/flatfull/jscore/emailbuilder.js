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
        $('#attachment_id').val("0");
        $('#attachment_text').html("");
    });

    $('#emailbuilder-listeners').on("change", "#attachmentSelectBox", function(e){
        if($(this).val() == ""){
            $('#attachmentSelectBoxRequired').show();
        } else {
            $('#attachmentSelectBoxRequired').hide();
        }
    });
	
}

function saveEmailTemplateFromBuilder(fullSource,builderSource) {
    
    var template = {
    "name": $("#nameoftemplate").val(),
    "subject": $("#subject").val(),
    "text": fullSource,
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
        type: 'post', 
        url: 'core/api/email/templates',       
        data: JSON.stringify(template),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $("#nameoftemplate-msg",parent.document).html('<br><span style="color: green; margin-left: 85px;">'+message+'</span>').show().fadeOut(3000);
            $(".saveEmailBuilderButton",parent.document).prop("disabled",false);
            $(".saveEmailBuilderButton",parent.document).html("Save");
            window.location.hash = "email-templates";
        },
    });
}

function redirectToOldEditor(templateId) {
    window.location.hash = "email-template/"+templateId;
}

function onEmailBuilderLoad() {
    $("#emailBuilderTopOptionsHolder").show();
}