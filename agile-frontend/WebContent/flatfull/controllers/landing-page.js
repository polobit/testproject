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
        
        $(".active").removeClass("active");
	$("#landing-pages-menu").addClass("active");

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
