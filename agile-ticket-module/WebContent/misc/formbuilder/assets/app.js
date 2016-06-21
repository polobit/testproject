define(
		[
				"jquery", "underscore", "backbone", "collections/snippets", "collections/my-form-snippets", "views/tab", "views/my-form",
				"text!data/input.json", "text!data/radio.json", "text!data/select.json", "text!data/buttons.json", "text!data/form.json",
				"text!templates/app/render.html", "helper/formload", "helper/formsave"
		],
		function($, _, Backbone, SnippetsCollection, MyFormSnippetsCollection, TabView, MyFormView, inputJSON, radioJSON, selectJSON, buttonsJSON, formJSON, renderTab, formLoad, formSave)
		{
			return { initialize : function()
			{
				var fields;
				var api;

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

					// Make the first tab active!
					$("#components .tab-pane").first().addClass("active");
					$("#formtabs li").first().addClass("active");

					// Bootstrap "My Form" with 'Form Name' snippet.
					getAgileApi(api, function(api)
					{
						addAgileApi(formJSON, api, function(json)
						{
							if(formNumber){
								formLoad.agile_form_load();
							}
							else{
								saveform = json;
								new MyFormView({ title : "Original", collection : new MyFormSnippetsCollection(json) });
							}
						});
					});
				});

				$('#form-save').click(function(){
					formSave.agile_form_save(event);
				});
			}}
		});
