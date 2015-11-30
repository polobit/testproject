var LandingPageRouter = Backbone.Router.extend({

	routes : {
	"landing-pages" : "getListOfLandingPages",
	"landing-page-add" : "showLandingPageBuilder",
	"landing-page-templates" : "getListOfTemplates",
	"landing-page-add/:id" : "loadSelectedTemplate",
	"landing-page/:id" : "loadSavedLandingPage",
    "landing-page-settings/:id" : "pageSettings"
	},

	getListOfLandingPages : function(){

        $('#content').html("<div id='landingpages-listeners'></div>");
        
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
        $('#content').html("<div id='landingpages-listeners'></div>");
        initializeLandingPageListeners();

        getTemplate("landingpages-add", {}, undefined, function(ui){
            $("#landingpages-listeners").html($(ui));
        }, "#landingpages-listeners");
        
        hideTransitionBar();
	},

	getListOfTemplates : function() {
        $('#content').html("<link rel='stylesheet' type='text/css' href='flatfull/css/jquery.fancybox.css'><div id='landingpages-listeners'></div>");
        
        head.js('flatfull/lib/jquery.fancybox.js',function() {
            $.getJSON("misc/landingpage/templates/templates.json", function(data) {

                getTemplate("landingpages-categories", data.templates[0], undefined, function(ui){
                    $("#landingpages-listeners").html($(ui));
                }, "#landingpages-listeners");
                
                $(".lpt_fancybox").fancybox({
                    'autoDimensions': false,
                    'padding'       : 0,
                    'autoScale'     : true,
                    'width'         : "600px",
                    'transitionIn'  : 'none',
                    'transitionOut' : 'none',
                    'type'          : 'iframe'
                 });

                hideTransitionBar();
            });
        });

	},

	loadSelectedTemplate : function(defaultTemplateId) {
		$('#content').html("<div id='landingpages-listeners'></div>");
        initializeLandingPageListeners();

        var data = {
            "templateId" : defaultTemplateId,
            "action" : "new"
        };

        getTemplate("landingpages-add", data, undefined, function(ui){
            $("#landingpages-listeners").html($(ui));
        }, "#landingpages-listeners");
	
	$('html, body').animate({scrollTop: $('body').offset().top}, 500);
        hideTransitionBar();

	},

    loadSavedLandingPage : function(pageId) {
        $('#content').html("<div id='landingpages-listeners'></div>");
        initializeLandingPageListeners();

        var data = {
            "templateId" : pageId,
            "action" : "edit"
        };        

        getTemplate("landingpages-add", data, undefined, function(ui){
            $("#landingpages-listeners").html($(ui));
        }, "#landingpages-listeners");
	
	$('html, body').animate({scrollTop: $('body').offset().top}, 500);
        hideTransitionBar();

    },

    pageSettings : function(pageId) {
        if (!this.LandingPageCollectionView || !this.LandingPageCollectionView.collection || this.LandingPageCollectionView.collection.get(pageId) == null) {
           this.navigate("landing-pages", { trigger : true });
           return;
        }

        var model = this.LandingPageCollectionView.collection.get(pageId);

        $('#content').html("<div id='landingpages-listeners'></div>");
        initializeLandingPageListeners();

        getTemplate("landingpages-settings", model.toJSON(), undefined, function(ui){
            $("#landingpages-listeners").html($(ui));
            var cnameEL = document.getElementById("cname");
            if($("#cname").attr("href") != "") {
                var parts = cnameEL.hostname.split('.');
                $("#sub_domain").val(parts.shift());
                $("#domain").val(parts.join('.'));

                var dirPath = cnameEL.pathname;
                if(dirPath.charAt(0) === '/'){
                    dirPath = dirPath.substr(1);
                }
                $("#directory_path").val(dirPath);
            }
        }, "#landingpages-listeners");
        
        hideTransitionBar();
    }
	
});
