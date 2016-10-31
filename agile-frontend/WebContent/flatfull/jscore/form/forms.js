

var Form_Collection_Events = Base_Collection_View.extend({

	events: {
		'click .codeshare' : 'codePublish',
	},

	codePublish : function(e){
		
		$("#modal-backdrop").hide();
		e.preventDefault();

		//full source code
		var $codeShareModalEl = $("#codeShareModal");
		
		getTemplate("formbuilder-codeshare",{}, undefined, function(ui){
			$codeShareModalEl.html(ui).modal("show");
		 	
		 	var currentModel = App_Forms.formsListView.collection.get($(e.currentTarget).data("formid"));
		 	//addding form id in source code
		 	currentModel.attributes.formHtml=currentModel.get("formHtml").replace("name=\"_agile_form_id\" value=\"\">", "name=\"_agile_form_id\" value=\""+currentModel.id+"\">");
		 	$codeShareModalEl.find("#fullsourceArea").text(currentModel.get("formHtml"));

		 	//permanent link
		 	var link = window.location.protocol + "//" +window.location.host+ "/forms/"+$(e.currentTarget).data("formid");
		 	$codeShareModalEl.find("#linkArea").text(link);

		 	//iframe code
		 	var iframe =  "<iframe width=\"100%\" height=\"100%\" src=\""+link+"\" frameborder=\"0\"></iframe>";
		 	$codeShareModalEl.find("#iframeArea").text(iframe);

		 	//embed code
		 	var json = {};
		 	json.host = window.location.hostname.split(".")[0];
		 	json.formid = $(e.currentTarget).data("formid");
		 	json.link = link;
		 	$codeShareModalEl.find("#embedCodeArea").text(getTemplate("js-form-embed", json));
		});

	},
});

/*$('body').on('mouseenter','#forms-model-list tr', function(e){
		if(agile_is_mobile_browser())
			return;
         $(this).find('#formcode_manager').removeClass('hide');
    });

$('body').on('mouseleave','#forms-model-list tr', function(e){
		if(agile_is_mobile_browser())
			return;
         $(this).find('#formcode_manager').addClass('hide');
    });*/
$('body').on('mouseenter','#forms-model-list tr', function(e){
		if(agile_is_mobile_browser())
			return;
         $(this).find('#form_report').removeClass('hide');
    });

$('body').on('mouseleave','#forms-model-list tr', function(e){
		if(agile_is_mobile_browser())
			return;
         $(this).find('#form_report').addClass('hide');
    });

$('body').on('mouseenter','#forms-model-list tr', function(e){
		if(agile_is_mobile_browser())
			return;
         $(this).find('#formcode_manager').removeClass('hide');
    });

$('body').on('mouseleave','#forms-model-list tr', function(e){
		if(agile_is_mobile_browser())
			return;
         $(this).find('#formcode_manager').addClass('hide');
    });

$('#codeShareModal').on('focus','.form-control',function(){
	var $this = $(this);
    $this.select();

    // Work around Chrome's little problem
    $this.mouseup(function() {
        // Prevent further mouseup intervention
        $this.unbind("mouseup");
        return false;
    });
});
