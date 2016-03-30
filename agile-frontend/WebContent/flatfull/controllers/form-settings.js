var FormsRouter = Backbone.Router.extend({
	
	routes : { 
		"forms" : "formSettings",
		"form-builder-templates" : "getListOfTemplates" 
	},

	formSettings : function()
	{
		console.log("forms collection template");
		
		this.formsListView = new Base_Collection_View({ url : '/core/api/forms', restKey : "forms", templateKey : "forms",
			individual_tag_name : 'tr', postRenderCallback : function(el){
				head.js(LIB_PATH + 'lib/jquery.timeago.js', function(el)
						{
							$("time.form-modified-time", el).timeago();
						});
			} })
		this.formsListView.collection.fetch();
		$("#content").html(this.formsListView.el);
	},

	getListOfTemplates : function()
	{
		$('#content').html("<link rel='stylesheet' type='text/css' href='flatfull/css/jquery.fancybox.css'><div id='formbuilder-listeners'></div>");
        
        head.js('flatfull/lib/jquery.fancybox.js',function() {
            $.getJSON("misc/formbuilder/templates/templates.json", function(data) {

               getTemplate("formbuilder-categories", data.templates[0], undefined, function(ui){
                    $("#formbuilder-listeners").html($(ui));
                }, "#formbuilder-listeners");
                
                $(".form_fancybox").fancybox({
                    'autoDimensions': true,
                    'padding'       : 0,
                    'autoScale'     : true,
                    'overflow'		: 'visible'
                 });

                hideTransitionBar();
            });
        });
        
        $(".active").removeClass("active");
	
	} 



});
