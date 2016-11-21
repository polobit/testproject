var FormsRouter = Backbone.Router.extend({
	
	routes : { 
		"forms" : "formSettings",
		"form-builder-templates" : "getListOfTemplates",
		"formbuilder?template=:id" : "buildForm",
		"form-reports/:id":"formReports",
	},
	buildForm : function(){
       var loc = window.location.href.replace("#", "");
       window.location = loc;
       return;
	},
	formSettings : function()
	{
		console.log("forms collection template");
		var that = this;
		this.formsListView = new Form_Collection_Events({ url : '/core/api/forms', restKey : "forms", templateKey : "forms",
			individual_tag_name : 'tr', postRenderCallback : function(el){
				el.find('[data-toggle="tooltip"]').tooltip();
				if (that.formsListView.collection && that.formsListView.collection.length == 0)
				{
					window.location.href  = window.location.origin+"/#form-builder-templates";
				}
				
				agileTimeAgoWithLngConversion($("time.form-modified-time", el));
			} })
		this.formsListView.collection.fetch();
		$("#content").html(this.formsListView.el);

		make_menu_item_active("formsmenu");
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
        
        //$(".active").removeClass("active");
	
	},
	formReports : function(id)
			{
				showTransitionBar();


				render_form_reports_select_ui(id, function(){

					getTemplate("formbuilder-form-analysis-tabs", { "id" : id }, undefined, function(template_ui)
					{
						if (!template_ui)
							return;

						// Render tabs with id
						$('#formbuilder-form-analysis-tabs').html($(template_ui));
						
						initReportLibs(function()
						{
							// Load Reports Template
							getTemplate('formbuilder-form-reports', {}, undefined, function(template_ui1)
							{
								if (!template_ui1)
									return;
								
								$('#formbuilder-form-analysis-tabs-content').html($(template_ui1));

								if(id == "all") {
									var formreportId = $("#formbuilder-form-reports-select option")[1].value;
									$("#formbuilder-form-reports-select").val(formreportId);
									id = formreportId;

								}
								
								// Set the name
								// $('#reports-webrule-name').text(workflowName);
								initFormChartsUI(function()
								{
									// Updates table data
									get_form_table_reports(id);

									// shows graphs by default week date range.
									showFormGraphs(id);
								});

						

							}, "#formbuilder-form-analysis-tabs-content");

						});

						$(".active").removeClass("active");
						$("#formsmenu").addClass("active");

						$('#formbuilder-form-tabs .select').removeClass('select');
						$('.formbuilder-form-stats-tab').addClass('select');

						hideTransitionBar();

					}, "#formbuilder-form-analysis-tabs");
				
				});

			}


			
});
