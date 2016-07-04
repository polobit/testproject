/**
 * Creates backbone router to access preferences of the user (email templates,
 * email (gmail/IMAP), notifications and etc..).
 */

 var templateUrl;
var WebreportsRouter = Backbone.Router.extend({

	routes : {
	/* Settings */
	"web-rules" : "webrules", "webrules-add" : "web_reports_add", "webrule-edit/:id" : "web_reports_edit", "webrules-templates" : "webrules_display", "webrules-add/*path" : "webrules_template_load", "webrules-custom" : "load_empty_editor"},
	webrules : function()
	{
		var that = this;
		this.webrules = new Base_Collection_View({ url : '/core/api/webrule', restKey : "webrule", templateKey : "webrule", individual_tag_name : 'tr',
			sortKey : 'position', postRenderCallback : function(el)
			{
				if (that.webrules.collection && that.webrules.collection.length == 0)
				{
					head.js(LIB_PATH + 'lib/prettify-min.js', function()
					{
						$.ajax({ url : 'core/api/api-key', type : 'GET', dataType : 'json', success : function(data)
						{
							getTemplate("webrule-collection", data, undefined, function(template_ui){
								if(!template_ui)
									  return;
								$('#content').html($(template_ui));	
								if(ACCOUNT_PREFS.plan.plan_type.split("_")[0] == "PRO")
								{
									$("#whitelist-disabled").addClass("hide");
									$("#whitelist-enabled").removeClass("hide");
								}
								prettyPrint();

							}, "#content");

							
						} });

					});
				}
				else
				{
					enableWebrulesSorting(el);
				}
			} });

		this.webrules.collection.fetch();
		$("#content").html(this.webrules.render().el);
		$(".active").removeClass("active");
		$("#web-rules-menu").addClass("active");

	},
	web_reports_add : function()
	{
		$('.fancybox-wrap').hide();

		if(!tight_acl.checkPermission('WEBRULE'))
			return;
		var web_reports_add = new Web_Rules_Event_View({ url : 'core/api/webrule', template : "webrules-add", window : "web-rules", isNew : true,
			
			postRenderCallback : function(el)
			{
				head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js?_='+_agile_get_file_hash("agile.jquery.chained.min.js"), function()
				{

					chainFilters(el, undefined, function()
					{
						chainWebRules(el, undefined, true);
						$("#content").html(el);
					}, true);

				})
			} });

		$("#content").html(getRandomLoadingImg());
		web_reports_add.render();
	},

	web_reports_edit : function(id)
	{
		$('.fancybox-wrap').hide();

		if(!tight_acl.checkPermission('WEBRULE'))
			return;

		// If reports view is not defined, navigates to reports
		if (!this.webrules || !this.webrules.collection || this.webrules.collection.length == 0 || this.webrules.collection.get(id) == null)
		{
			this.navigate("web-rules", { trigger : true });
			return;
		}

		var count = 0;

		// Gets a report to edit, from reports collection, based on id
		var webrule = this.webrules.collection.get(id);

		// Default template is webrule-add. If rule is of type shopify template is changed accordingly
		var template = "webrules-add";
		var web_reports_add = new Web_Rules_Event_View({ url : 'core/api/webrule', model : webrule, template : template, window : "web-rules",
			postRenderCallback : function(el)
			{
				if (count > 0)
					return;
				head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js?_='+_agile_get_file_hash("agile.jquery.chained.min.js"), function()
				{
					chainFilters(el, webrule.toJSON(), function()
					{
						chainWebRules(el, webrule.toJSON(), false, webrule.toJSON()["actions"]);
						$("#content").html(el);
					}, true);

				})
				count++;
			} });

		$("#content").html(getRandomLoadingImg());
		web_reports_add.render();
	},

	webrules_display : function(){

			$('.fancybox-overlay').hide();

		 $('#content').html("<link rel='stylesheet' type='text/css' href='flatfull/css/jquery.fancybox.css'><div id='webrule-listeners'></div>");
        
        head.js('flatfull/lib/jquery.fancybox.js',function() {

        $.getJSON("misc/modal-templates/webrule-templates.json", function(data) {

            getTemplate("webrule-categories", null, undefined, function(ui){
            	$("#webrule-listeners").append($(ui));
            },"#webrule-listeners");

            
            $(".web_fancybox").fancybox({
                    'autoDimensions': true,
                    'padding'       : 0,
                    'autoScale'     : true,
                    'overflow'		: 'visible'
                 });

                hideTransitionBar();
            });
        });

	},

	webrules_template_load : function(path){

			$('.fancybox-wrap').hide();

		if(!tight_acl.checkPermission('WEBRULE'))
			return;
		var web_reports_add = new Web_Rules_Event_View({ url : 'core/api/webrule', template : "webrules-add", window : "web-rules", isNew : true,
			postRenderCallback : function(el)
			{
				if(path.includes("callpopup.html"))
					el.find("#action select").val("CALL_POPUP");
				else if(path.includes("sitebar.html"))
					el.find("#action select").val("SITE_BAR");
				
				head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js?_='+_agile_get_file_hash("agile.jquery.chained.min.js"), function()
				{
					chainFilters(el, undefined, function()
					{
						chainWebRules(el, undefined, true);
						$("#content").html(el);
						loadSavedTemplate(path, function(data) {
							$("#tiny_mce_webrules_link").trigger('click');
						});
					}, true);
				})
				
			} });

		$("#content").html(getRandomLoadingImg());
		web_reports_add.render();
	},

	load_empty_editor : function(){

		$('.fancybox-wrap').hide();

		if(!tight_acl.checkPermission('WEBRULE'))
			return;
		var web_reports_add = new Web_Rules_Event_View({ url : 'core/api/webrule', template : "webrules-add", window : "web-rules", isNew : true,
			
			postRenderCallback : function(el)
			{
				head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js?_='+_agile_get_file_hash("agile.jquery.chained.min.js"), function()
				{

					chainFilters(el, undefined, function()
					{
						chainWebRules(el, undefined, true);
						$("#content").html(el);
						$("#tinyMCEhtml_email").text(" ");
						$("#tiny_mce_webrules_link").trigger('click');
					}, true);

				})
			} });

		$("#content").html(getRandomLoadingImg());
		web_reports_add.render();
	}

	 });

function show_fancy_box(content_array)
{
	var obj = {
		"href" 	: content_array.href,
		"link" 	: content_array.getAttribute("data-link"),
		"title"	: content_array.title
	};
	
	  // Shows content array in fancybox
    $.fancybox.open(obj,{

    	padding     : 10,
        margin      : [20, 60, 20, 60],
        width : 100,
        helpers : {
     	        overlay : {
     	            css : {
     	                'background' : 'rgba(58, 42, 45, 0.95)'
     	            }
     	        }
     	    },
     	    beforeLoad: function() {

            content_array.title = '<a data-link='+this.link+' style="color: white; text-decoration: underline;" href="#webrules-add/'+this.link+'" >Load in Editor</a>';
         },
         afterLoad: function()
         {
        	
        }

 	}); // End of fancybox
}

function loadSavedTemplate(templateURL, callback){
	
	templateUrl=templateURL;
	templateURL = "/misc/modal-templates/" + templateURL;

	 $.ajax({
            url: templateURL,
            data: {},
            success: function(data) {
            	data = data.trim();

            	if(isNotValid(data))
				{
					showError("Please enter a valid html message");
					return;
				}
				if(templateUrl.includes("callpopup.html"))
					$("#callwebrule-code").text(data);
				else if(templateUrl.includes("sitebar.html"))
					$("#agile-bar-code").text(data);
				else
                	$("#tinyMCEhtml_email").text(data);
				
				if( callback && typeof(callback) === 'function' )	callback(data);
            }
        });
}

function isNotValid(value)
{
	if(value == undefined)
		return true;
	
	if(value.length == 0)
		return true;
	
	return false;
}

