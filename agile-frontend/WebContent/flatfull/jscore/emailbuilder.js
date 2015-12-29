function initializeEmailBuilderListeners() {

	$('#emailbuilder-listeners').off();
	
	$('#emailbuilder-listeners').on('click', '.saveEmailBuilderButton', function(e){
		e.preventDefault();
    	if (isValidForm('#emailBuilderForm')) {
    		$(".saveEmailBuilderButton").prop("disabled",true);
			$(".saveEmailBuilderButton").html("Saving...");
    		document.getElementById('emailBuilderFrame').contentWindow.$('#save').trigger("click");
    	} else {
    		// if(!$("#landingpagename").val().trim()) {
    		// 	$('html, body').animate({scrollTop: $('body').offset().top}, 500);
    		// }
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
	
}

function saveEmailTemplateFromBuilder(fullSource,builderSource) {
    // console.log(fullSource);
    // console.log(builderSource);
    
    var template = {
    "name": $("#nameoftemplate").val(),
    "subject": $("#subject").val(),
    "text": fullSource,
    "html_for_builder": builderSource,
    "attachment_id": ""
    };

    $.ajax({
        type: 'post', 
        url: 'core/api/email/templates',       
        data: JSON.stringify(template),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $("#nameoftemplate-msg",parent.document).html('<span style="color: green; margin-left: 85px;">Template saved.</span>').show().fadeOut(3000);
            $(".saveEmailBuilderButton",parent.document).prop("disabled",false);
            $(".saveEmailBuilderButton",parent.document).html("Save");
        },
    });
}

