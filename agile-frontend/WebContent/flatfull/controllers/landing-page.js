var LandingPageRouter = Backbone.Router.extend({

	routes : {
	"landing-pages" : "getListOfLandingPages",
	"landing-page-add" : "showLandingPageBuilder",
	"landing-page-templates" : "getListOfTemplates",
	"landing-page-add/:id" : "loadSelectedTemplate",
	"landing-page/:id" : "loadSavedLandingPage"
	},

	getListOfLandingPages : function(){

        $('#content').html("<div id='landingpages-listeners'>&nbsp;</div>");
        
        this.LandingPageCollectionView = new Base_Collection_View({ url : 'core/api/landingpages', templateKey : "landingpages", cursor : true, page_size : 20,
            individual_tag_name : 'tr', postRenderCallback : function(el)
            {
                includeTimeAgo(el);
            },
            appendItemCallback : function(el)
            { 
                // To show time ago for models appended by infinite scroll
                includeTimeAgo(el);
            } });
        
        this.LandingPageCollectionView.collection.fetch();

        $("#landingpages-listeners").html(this.LandingPageCollectionView.render().el);

	},

	showLandingPageBuilder : function() {
        $('#content').html("<div id='landingpages-listeners'>&nbsp;</div>");
        initializeLandingPageListeners();
        
		$("#landingpages-listeners").html(getTemplate("landingpages-add"), {});
        hideTransitionBar();
	},

	getListOfTemplates : function() {
        $('#content').html("<div id='landingpages-listeners'>&nbsp;</div>");

        $.getJSON("misc/landingpage/templates/templates.json", function(data) {
            $("#landingpages-listeners").html(getTemplate("landingpages-categories",data.templates[0]),{});
            hideTransitionBar();
        });

	},

	loadSelectedTemplate : function(defaultTemplateId) {
		$('#content').html("<div id='landingpages-listeners'>&nbsp;</div>");
        initializeLandingPageListeners();

        var data = {
            "templateId" : defaultTemplateId,
            "action" : "new"
        };

		$("#landingpages-listeners").html(getTemplate("landingpages-add",data), {});
        hideTransitionBar();

	},

    loadSavedLandingPage : function(pageId) {
        $('#content').html("<div id='landingpages-listeners'>&nbsp;</div>");
        initializeLandingPageListeners();

        var data = {
            "templateId" : pageId,
            "action" : "edit"
        };        

        $("#landingpages-listeners").html(getTemplate("landingpages-add",data), {});
        hideTransitionBar();

    }
	
});
