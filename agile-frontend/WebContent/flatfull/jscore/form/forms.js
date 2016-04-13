

var Form_Collection_Events = Base_Collection_View.extend({

	events: {
		'click .codeshare' : 'codePublish',
	},

	codePublish : function(e){
		
		$("#modal-backdrop").hide();
		e.preventDefault();

		//full source code
		var $codeShareModalEl = $("#codeShareModal");
		$codeShareModalEl.html(getTemplate("formbuilder-codeshare")).modal("show");
	 	var currentModel = App_Forms.formsListView.collection.get($(e.currentTarget).data("formid"));
	 	$codeShareModalEl.find("#fullsourceArea").text(currentModel.get("formHtml"));

	 	//permanent link
	 	var link = window.location.protocol + "//" +window.location.host+ "/form.jsp?id"+"=" +$(e.currentTarget).data("formid");
	 	$codeShareModalEl.find("#linkArea").text(link);

	 	//iframe code
	 	var iframe =  "<iframe width=\"560\" height=\"454\" src=\""+link+"\" frameborder=\"0\" </iframe>";
	 	$codeShareModalEl.find("#iframeArea").text(iframe);

	 	//embed code
	 	var embed = "<div id=\""+window.location.host+"_"+$(e.currentTarget).data("formid")+"\" class=\"agile_crm_form_embed\">Fill out my <a href=\""+link+"\">online form</a>.</div>";
		$codeShareModalEl.find("#embedCodeArea").text(embed);
	},
});

$('body').on('mouseenter','#forms-model-list tr', function(e){
         $(this).find('#formcode_manager').removeClass('hide');
    });

$('body').on('mouseleave','#forms-model-list tr', function(e){
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