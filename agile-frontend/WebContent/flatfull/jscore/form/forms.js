

var Form_Collection_Events = Base_Collection_View.extend({

	events: {
		'click .codeshare' : 'codePublish',
	},

	codePublish : function(e){
		e.preventDefault();
		$(".modal-backdrop").hide();

		//full source code
		var $codeShareModalEl = $("#codeShareModal");
		$codeShareModalEl.html(getTemplate("formbuilder-codeshare")).modal("show");
	 	var currentModel = App_Forms.formsListView.collection.get($(e.target).data("formid"));
	 	$codeShareModalEl.find("#fullsourceArea").text(currentModel.get("formHtml"));

	 	//permanent link
	 	var link = window.location.protocol + "//" +window.location.host+ "/form.jsp?id"+"=" +$(e.target).data("formid");
	 	$codeShareModalEl.find("#linkArea").text(link);

	 	//iframe code
	 	var iframe =  "<iframe width=\"560\" height=\"454\" src=\""+link+"\" frameborder=\"0\" </iframe>";
	 	$codeShareModalEl.find("#iframeArea").text(iframe);

	 	//embed code
	 	var embed = "<div id=\""+window.location.host+"_"+$(e.target).data("formid")+"\">Fill out my <a href=\""+link+"\">online form</a>.</div>";
	 	embed  = embed + "<script>loadAgileCRMForm(\""+window.location.host+"_"+$(e.target).data("formid")+"\");</script>";
		$codeShareModalEl.find("#embedCodeArea").text(embed);
	},

});
