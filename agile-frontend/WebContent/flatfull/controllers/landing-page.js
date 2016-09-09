var LandingPageRouter = Backbone.Router.extend({
	routes : {
	"landing-pages" : "getListOfLandingPages",
	"landing-page-add" : "showLandingPageBuilder",
	"landing-page-templates" : "getListOfTemplates",
	"landing-page-add/:id" : "loadSelectedTemplate",
	"landing-page/:id" : "loadSavedLandingPage",
    "landing-page-settings/:id" : "pageSettings",
    "landing-page-copy/:id" : "copySelectedLandingPage"
	},

	getListOfLandingPages : function()
    {
    $('#content').html("<div id='landingpages-listeners'></div>");

        getTemplate('landingpages-static-container', {}, undefined, function(template_ui) {
                    
                    $("#content").html(getTemplate("landingpages-static-container"));
                    // Add top view
                    var sortKey = _agile_get_prefs("landingpage_sort_menu");
                    if(sortKey == undefined || sortKey == null){
                        sortKey = "dummy_name";
                        _agile_set_prefs("landingpage_sort_menu", sortKey);
                    }

                    var that = this;
                    var landingpagesStaticModelview = new  LandingPages_Top_Header_Modal_Events({
                        template : 'landing-pages-top-header',
                        isNew : true,
                        model : new Backbone.Model({"sortKey" : sortKey}),
                        postRenderCallback : function(el){
                            // Add collection view
                            console.log("Load collection");
                            App_LandingPageRouter.loadLandingPagesCollection($("#content"));
                        }
                    });

                    $("#content").find("#Landingpages-top-view").html(landingpagesStaticModelview.render().el);

                }, $("#content"));
            },
    loadLandingPagesCollection : function(el){

        var sortKey = _agile_get_prefs("landingpage_sort_menu");
                if (this.LandingPageCollectionView && this.LandingPageCollectionView.options.global_sort_key == sortKey && this.LandingPageCollectionView.collection && this.LandingPageCollectionView.collection.length > 0)
                {
                    $(el).find("#landing-pages-collection-container").html(this.LandingPageCollectionView.render(true).el);
                    return;
                }
        this.LandingPageCollectionView = new landingpage_collection_events({ 
            url : 'core/api/landingpages',
            sort_collection : false,
            templateKey : "landingpages",
            cursor : true,
            page_size : 20,  
            individual_tag_name : 'tr',
            customLoaderTemplate : 'agile-app-collection-loader',
            customLoader : true,
            global_sort_key : sortKey,
            postRenderCallback : function(el)
            {
                includeTimeAgo(el);
               // updateSortKeyTemplate(sortKey, el);
               // $("#landingpages-list").html(collectiondata);
                $(".active").removeClass("active");
                $("#landing-pages-menu").addClass("active");
                
            },
            appendItemCallback : function(el)
            { 
                // To show time ago for models appended by infinite scroll
                includeTimeAgo(el);
            }});
        this.LandingPageCollectionView.collection.fetch();
       $("#content").find("#landing-pages-collection-container").html(App_LandingPageRouter.LandingPageCollectionView.el);
    },

	showLandingPageBuilder : function() {
        $('#content').html("<div id='landingpages-listeners'></div>");
        initializeLandingPageListeners();

        getTemplate("landingpages-add", {}, undefined, function(ui){
            $("#landingpages-listeners").html($(ui));
        }, "#landingpages-listeners");
        
        $(".active").removeClass("active");
	$("#landing-pages-menu").addClass("active");
	
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
        
        $(".active").removeClass("active");
	$("#landing-pages-menu").addClass("active");

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
	$(".active").removeClass("active");
	$("#landing-pages-menu").addClass("active");
        hideTransitionBar();

	},

    //remove pageId from here
    loadSavedLandingPage : function(pageId) {

        if (typeof this.LandingPageCollectionView == "undefined") {
            this.navigate("landing-pages", { trigger : true });
            return;
        }

        var lp = this.LandingPageCollectionView.collection.get(pageId).toJSON();
        if(lp.version >= 2) {
            window.location = "pagebuilder/"+pageId;
            return;
        }


        $('#content').html("<div id='landingpages-listeners'></div>");
        initializeLandingPageListeners(pageId);

        var data = {
            "templateId" : pageId,
            "action" : "edit"
        };        

        getTemplate("landingpages-add", data, undefined, function(ui){
            $("#landingpages-listeners").html($(ui));
        }, "#landingpages-listeners");
	
	$('html, body').animate({scrollTop: $('body').offset().top}, 500);
	$(".active").removeClass("active");
	$("#landing-pages-menu").addClass("active");

    /*
    *calling setInterval function for everey 5min 
    *for the autoSave of the landing page
    */
    var lpAutoSaveRec = setInterval(function(){
            if(Current_Route.indexOf("landing-page/") == -1) {
                clearInterval(lpAutoSaveRec);
            } else {
                saveLandingPageToDataStore(true,pageId);
            }              
        },5*60*1000);
    
    hideTransitionBar();

    },

    pageSettings : function(pageId) {

        $('#content').html("<div id='landingpages-listeners'></div>");
        initializeLandingPageListeners(pageId);

        $.getJSON("core/api/landingpages/custom-domain/"+pageId, function(data){
            data = data || {};
            data["pageid"] = pageId;
            getTemplate("landingpages-settings", data, undefined, function(ui){
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
        });
        
       $(".active").removeClass("active");
	   $("#landing-pages-menu").addClass("active");
       hideTransitionBar();
    },

    copySelectedLandingPage :function(defaultTemplateId) {
       $('#content').html("<div id='landingpages-listeners'></div>");
        initializeLandingPageListeners();

        var data = {
            "templateId" : defaultTemplateId,
            "action" : "copy"
        };

        getTemplate("landingpages-add", data, undefined, function(ui){
            $("#landingpages-listeners").html($(ui));
        }, "#landingpages-listeners");
    
    $('html, body').animate({scrollTop: $('body').offset().top}, 500);
    $(".active").removeClass("active");
    $("#landing-pages-menu").addClass("active");
        hideTransitionBar();
    }
	
});
