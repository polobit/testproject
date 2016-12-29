define(
		[
				"jquery", "underscore", "backbone", "collections/snippets", "collections/my-form-snippets", "views/tab", "views/my-form",
				"text!data/input.json", "text!data/radio.json", "text!data/select.json", "text!data/buttons.json", "text!data/form.json",
				"text!templates/app/render.html", "helper/formload", "helper/formsave", "helper/templateload"
		],
		function($, _, Backbone, SnippetsCollection, MyFormSnippetsCollection, TabView, MyFormView, inputJSON, radioJSON, selectJSON, buttonsJSON, formJSON, renderTab, formLoad, formSave, templateLoad)
		{
			return { initialize : function()
			{
				var fields;
				var api;
				
				//Loads form view in form.jsp page
				if($('#agileFormHolder').length != 0) {
					if(formNumber){
						formLoad.agile_form_load();
					}
					return;
				}

				getAgileFields(fields, function(fields)
				{
					addAgileFields([
							inputJSON, radioJSON, selectJSON
					], fields, function(json)
					{

						// Bootstrap tabs from json.
						new TabView({ title : "Input", collection : new SnippetsCollection(json[0]) });
						new TabView({ title : "Radios / Checkboxes", collection : new SnippetsCollection(json[1]) });
						new TabView({ title : "Select", collection : new SnippetsCollection(json[2]) });
					});

					new TabView({ title : "Buttons", collection : new SnippetsCollection(JSON.parse(buttonsJSON)) });

					new TabView({ title : "<b>Source code</b>", content : renderTab });

					if($("b").text()=="Source code"){
						$("b").parent().parent().css("display","none");
					}
					// Make the first tab active!
					$("#components .tab-pane").first().addClass("active");
					$("#formtabs li").first().addClass("active");

					// Bootstrap "My Form" with 'Form Name' snippet.
					getAgileApi(api, function(api)
					{
						addAgileApi(formJSON, api, function(json)
						{
							if(formNumber){
								formLoad.agile_form_load(fields);
							}
							else{
								if(typeof formTemplate != "undefined") {
									templateLoad.agile_template_load(api,fields);
								} else {
									saveform = json;
									new MyFormView({ title : "Original", collection : new MyFormSnippetsCollection(json) });
									$("#loader").fadeOut('fast');
									$("#header").css("display","block");
									$(".container").css("display","block");
								}	
							}
							chooseThemeFunc();
						});
					});
				});

				$('#form-save').click(function(event){
					formSave.agile_form_save(event);
				});
				$(document).keydown(function(e) {
                     // ESCAPE key pressed
                     if (e.keyCode == 27) {
                        $(".popover").remove();
                     }
                });
			}}
		});
