var EmailBuilderRouter = Backbone.Router.extend({

	routes : {
	"emailbuilder-add" : "showEmailBuilder",
    "emailbuilder-templates" : "getListOfTemplates",
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

    getListOfTemplates : function() {
        $('#content').html("<link rel='stylesheet' type='text/css' href='flatfull/css/jquery.fancybox.css'><div id='emailbuilder-listeners'></div>");
        initializeEmailBuilderListeners();
        $.getJSON("misc/emailbuilder/templates/templates.json", function(data) {

            getTemplate("emailbuilder-categories", data.templates[0], undefined, function(ui){
                $("#emailbuilder-listeners").html($(ui));
            }, "#emailbuilder-listeners");
            
            hideTransitionBar();
        });
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
        }, "#emailbuilder-listeners");
    
       $('html, body').animate({scrollTop: $('body').offset().top}, 500);
       hideTransitionBar();

    }
	
});
