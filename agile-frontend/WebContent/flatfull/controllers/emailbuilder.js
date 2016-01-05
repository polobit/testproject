var EmailBuilderRouter = Backbone.Router.extend({

	routes : {
	"emailbuilder-add" : "showEmailBuilder",
	"emailbuilder-add/:id" : "loadSelectedTemplate",
	"emailbuilder/:id" : "loadSavedTemplate"
	},

	showEmailBuilder : function() {
        $('#content').html("<div id='emailbuilder-listeners'></div>");
        initializeEmailBuilderListeners();

        getTemplate("emailbuilder-add", {}, undefined, function(ui){
            $("#emailbuilder-listeners").html($(ui));
        }, "#emailbuilder-listeners");
	
        hideTransitionBar();
	},

	loadSelectedTemplate : function(defaultTemplateId) {
		$('#content').html("<div id='emailbuilder-listeners'></div>");
        initializeEmailBuilderListeners();

        var data = {
            "templateId" : defaultTemplateId,
            "action" : "new"
        };

        getTemplate("emailbuilder-add", data, undefined, function(ui){
            $("#emailbuilder-listeners").html($(ui));
        }, "#emailbuilder-listeners");
	
	   $('html, body').animate({scrollTop: $('body').offset().top}, 500);
       hideTransitionBar();

	},

    loadSavedTemplate : function(templateId) {
        $('#content').html("<div id='emailbuilder-listeners'></div>");
        initializeEmailBuilderListeners();

        var data = {
            "templateId" : templateId,
            "action" : "edit"
        };

        getTemplate("emailbuilder-add", data, undefined, function(ui){
            $("#emailbuilder-listeners").html($(ui));
            $(".addAttachmentLink","#emailbuilder-listeners").trigger("click");
            $("#attachmentSelectBoxHolder","#emailbuilder-listeners").hide();
            $(".addAttachmentLink","#emailbuilder-listeners").show();
            
        }, "#emailbuilder-listeners");
    
       $('html, body').animate({scrollTop: $('body').offset().top}, 500);
       hideTransitionBar();

    }
	
});
