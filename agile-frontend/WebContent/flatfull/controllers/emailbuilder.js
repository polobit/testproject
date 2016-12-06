var EmailBuilderRouter = Backbone.Router.extend({

	routes : {
	"emailbuilder-add" : "showEmailBuilder",
    "emailbuilder-templates" : "getListOfTemplates",
	"emailbuilder-add/:id" : "loadSelectedTemplate",
	"emailbuilder/:id" : "loadSavedTemplate",
    "emailbuilder-copy/:id" : "copyEmailTemplate"
	},

	showEmailBuilder : function() {
        $('#content').html("<div id='emailbuilder-listeners'></div>");
        initializeEmailBuilderListeners();

        getTemplate("emailbuilder-add", {}, undefined, function(ui){
            $("#emailbuilder-listeners").html($(ui));
            //fetch template categories
            _agile_set_prefs('emailTempCtg_id', "");
            if(typeof Selected_Email_Template_Category != "undefined" && Selected_Email_Template_Category != ""){
                getEmailTemplateCategories(Selected_Email_Template_Category);
            }else{
                getEmailTemplateCategories();
            }
        }, "#emailbuilder-listeners");
	
        //hide sidebar
        collapseLeftMenuInBuilder();
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
            //fetch template categories
            _agile_set_prefs('emailTempCtg_id', "");
            if(typeof Selected_Email_Template_Category != "undefined" && Selected_Email_Template_Category != ""){
                getEmailTemplateCategories(Selected_Email_Template_Category);
            }else{
                getEmailTemplateCategories();
            }
        }, "#emailbuilder-listeners");
	
	   $('html, body').animate({scrollTop: $('body').offset().top}, 500);
        
        //hide sidebar
        collapseLeftMenuInBuilder();
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
            //fetch template categories
            _agile_set_prefs('emailTempCtg_id', "");
            getEmailTemplateCategories();            
        }, "#emailbuilder-listeners");

        //hide sidebar
        collapseLeftMenuInBuilder();
        
       $('html, body').animate({scrollTop: $('body').offset().top}, 500);
       hideTransitionBar();

    },

    copyEmailTemplate : function(templateId) {
        $('#content').html("<div id='emailbuilder-listeners'></div>");
        initializeEmailBuilderListeners();

        var data = {
            "templateId" : templateId,
            "action" : "copy"
        };

        getTemplate("emailbuilder-add", data, undefined, function(ui){
            $("#emailbuilder-listeners").html($(ui)); 
            //fetch template categories
            _agile_set_prefs('emailTempCtg_id', "");
            getEmailTemplateCategories();           
        }, "#emailbuilder-listeners");

        //hide sidebar
        collapseLeftMenuInBuilder();
        
       $('html, body').animate({scrollTop: $('body').offset().top}, 500);
       hideTransitionBar();

    }
	
});

function collapseLeftMenuInBuilder() {
    $wrapElement = $("#wrap");
    if(!$wrapElement.hasClass("app-aside-dock")) {
        if(!$wrapElement.hasClass("app-aside-folded")) {
            $wrapElement.addClass("app-aside-folded");
        }
    }
}

function getEmailTemplateCategories(selected_ctg) {
    var el = $("#emailbuilder-listeners").closest("div");
    var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
    fillSelect('emailTemplate-category-select','core/api/emailTemplate-category', 'emailTemplateCategory',  
        function fillCategory(){
            el.find("#emailTemplate-category-select option:last").after("<option value='CREATE_NEW_CATEGORY'>"+_agile_get_translated_val('others','add-new')+"</option>");
            if(selected_ctg){
                $('select#emailTemplate-category-select').find('option[value='+selected_ctg+']').attr("selected","selected");
                _agile_set_prefs('emailTempCtg_id', selected_ctg);
            }
        }, optionsTemplate, false, el);
}
    