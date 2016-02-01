/**
 * Creates backbone router for Documents create, read and update operations
 */
var eDocTemplate_Select_View
var DocumentsRouter = Backbone.Router.extend({

	routes : {
	"documents" : "documents", 
	"documents/:idtype" : "editdocument",
	"documents/:idtype/:templateid" : "editdocument",
	"documents/:contactcompanydealtype/:contactcompanydealtid/:edocattachtype" : "addcontactcompanydealtypedocument",
	"documents/:contactcompanydealtype/:contactcompanydealtid/:edocattachtype/:templateid" : "adddocument"	
	},
	addcontactcompanydealtypedocument:function(contactcompanydealtype,contactcompanydealid,edocattachtype)
	{
		if(edocattachtype=="edoc")
			this.procdoctemplate(edocattachtype,contactcompanydealtype,contactcompanydealid);		
		else
			this.adddocument(contactcompanydealtype,contactcompanydealid,edocattachtype)	
	},
	adddocument : function(contactcompanydealtype,contactcompanydealid,edocattachtype,templateid)
	{
		var model_json = {};
		var id=null
		
		
		// Takes back to contacts if contacts detail view is not defined
		
		if(contactcompanydealtype=="contact" && App_Contacts.contactDetailView)
		{
				model_json=App_Contacts.contactDetailView.model.toJSON();
				if(model_json)
					id=model_json.id;
		}			
		else if(contactcompanydealtype=="company" &&  App_Companies.companyDetailView){
			//var compIdTemp = getPropertyValue(App_Companies.companyDetailView.model.toJSON().properties,'id');
			//if(id && id == compIdTemp){
				model_json = App_Companies.companyDetailView.model.toJSON();
			//}
		}
		else if(contactcompanydealtype=="deal" &&  App_Deal_Details.dealDetailView){
			//var compIdTemp = getPropertyValue(App_Companies.companyDetailView.model.toJSON().properties,'id');
			//if(id && id == compIdTemp){
				model_json = App_Deal_Details.dealDetailView.model.toJSON();
			//}
		}

		$("#content").html('<div id="documents-listener-container"></div>');
		var that = this;
		getTemplate("upload-document-modal", model_json, undefined, function(template_ui){
			if(!template_ui)
				  return;

			var el = $("#documents-listener-container").html($(template_ui));

			var el_form	= $("#uploadDocumentModalForm")

			if(model_json && model_json.id)
			{	
				if(contactcompanydealtype=="deal")
				{
					var deal_name = model_json.name;
			    	$('.deal_tags',el).append('<li class="tag"  style="display: inline-block; vertical-align: middle; margin-right:3px;" data="'+ model_json.id +'">'+deal_name+'</li>');
				}
				else
				{
					var contact_name = getContactName(model_json);
					$('.contacts', "#uploadDocumentModalForm").append('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="' + model_json.id + '">' + contact_name + '</li>');
				}
			}
			// Contacts type-ahead
			agile_type_ahead("document_relates_to_contacts", el_form, contacts_typeahead);
	
			// Deals type-ahead
			agile_type_ahead("document_relates_to_deals", el_form, deals_typeahead, false, null, null, "core/api/search/deals", false, true);	

			initializeDocumentsListeners();	
	
				
				if(edocattachtype=="edoc")
				{

						$("#network_type",'#uploadDocumentModalForm,#uploadDocumentUpdateForm').val("NONE");
						$("#doc_type",'#uploadDocumentModalForm,#uploadDocumentUpdateForm').val("SENDDOC");
					
						var optionsTemplate = "<option doc_type='SENDDOC' value='{{id}}'>{{name}}</option>";
						fillSelect('template_type', '/core/api/document/templates', 'documents', function fillNew(coll)
						{
						
						$('#template_type','#uploadDocumentModalForm,#uploadDocumentUpdateForm').get(0).document_templates=coll;
						
						
						//console.log(coll);

						}, optionsTemplate, false, el);
						setupTinyMCEEditor('textarea#signdoc-template-html', false, undefined, function()
						{
							
							// Register focus
							register_focus_on_tinymce('signdoc-template-html');
							var sTemplateText="";
							if(templateid)
							{
								$('#template_type option[value=' + templateid + ']','#uploadDocumentModalForm,#uploadDocumentUpdateForm').attr('selected','selected')
								var model=eDocTemplate_Select_View.collection.get(templateid)	
								if(model)
								{
									model=model.toJSON();
									var template;
									sTemplateText=model.text;
									var json = get_contact_json_for_merge_fields();

									json= merge_jsons({}, {"pricing_table":"<b>test</b>"}, json);
									try
									{
										template = Handlebars.compile(sTemplateText);
										sTemplateText = template(json);
									}
									catch (err)
									{
										sTemplateText = add_square_brackets_to_merge_fields(sTemplateText);

										template = Handlebars.compile(sTemplateText);
										sTemplateText = template(json);
									}
								}
							
							}
							// Reset tinymce
							set_tinymce_content('signdoc-template-html', sTemplateText);
						});		

					$(".senddoc",'#uploadDocumentModalForm,#uploadDocumentUpdateForm').removeClass("hide ");
					$(".send-doc-button",'#uploadDocumentModalForm,#uploadDocumentUpdateForm').removeClass("hide ");
					$(".attachment",'#uploadDocumentModalForm,#uploadDocumentUpdateForm').addClass("hide");
				}	
				else
				{
					$("#doc_type",'#uploadDocumentModalForm,#uploadDocumentUpdateForm').val("ATTACHMENT");	
					$(".senddoc",'#uploadDocumentModalForm,#uploadDocumentUpdateForm').addClass("hide ");
					$(".send-doc-button",'#uploadDocumentModalForm,#uploadDocumentUpdateForm').addClass("hide ");
					$(".attachment",'#uploadDocumentModalForm,#uploadDocumentUpdateForm').removeClass("hide");	
				}
			
			
			
		}, "#documents-listener-container"); 
	
	},
	procdoctemplate:function(edocattachtype,contactcompanydealtype,contactcompanydealid)
	{
		$("#content").html('<div contactcompanydealid='+ contactcompanydealid+' contactcompanydealtype='+ contactcompanydealtype +' id="edocument-type-select-container"></div>');
		var that = this;
		eDocTemplate_Select_View = new Base_Collection_View(
		{
			url : '/core/api/document/templates',
			templateKey : "document-etype-select",
			sort_collection : false,
			individual_tag_name : 'div',
			postRenderCallback : function(el) {

			}
		});
		eDocTemplate_Select_View.appendItem = process_edoctemplates_model;
		eDocTemplate_Select_View.collection.fetch();

		$('#edocument-type-select-container').html(eDocTemplate_Select_View.render().el);

	},
	editdocument:function(id,templateid)
	{
	
	//var value = ele.toJSON();
		if(id=="edoc" && templateid!=null)
		{
			return this.adddocument(null,null,id,templateid);
		}
		else if(id=="attachment" )
			return this.adddocument(null,null,id);
		else
			return this.procdoctemplate("","","")
		var model={};
		
		if(App_Documents && App_Documents.DocumentCollectionView && App_Documents.DocumentCollectionView.collection && App_Documents.DocumentCollectionView.collection.get(id))
		{
			model =App_Documents.DocumentCollectionView.collection.get(id).toJSON()	
		}
		else if(documentsView && documentsView.collection && documentsView.collection.get(id))
		{
			model =documentsView.collection.get(id).toJSON()
		}	

	/*	var uploadModal = $('#uploadDocumentUpdateForm');
		uploadModal.html(getTemplate("upload-document-update-modal", {}));
		uploadModal.modal('show');*/
		
		$("#content").html('<div id="documents-listener-container"></div>');
		var that = this;
		getTemplate("upload-document-update-modal", model, undefined, function(template_ui){
				if(!template_ui)
					  return;

				var el = $("#documents-listener-container").html($(template_ui));

				var documentUpdateForm = $("#uploadDocumentUpdateForm");
				deserializeForm(model, $("#uploadDocumentUpdateForm"));
				var 	template_type=model.template_type;
				if($("#doc_type",'#uploadDocumentModalForm,#uploadDocumentUpdateForm').val()=="SENDDOC")
				{
						$(".senddoc",'#uploadDocumentModalForm,#uploadDocumentUpdateForm').removeClass("hide ");
						$(".send-doc-button",'#uploadDocumentModalForm,#uploadDocumentUpdateForm').removeClass("hide ");
						$(".attachment",'#uploadDocumentModalForm,#uploadDocumentUpdateForm').addClass("hide ");
				}
				else
				{
						$(".senddoc",'#uploadDocumentModalForm,"#uploadDocumentUpdateForm').addClass("hide ");
						$(".send-doc-button",'#uploadDocumentModalForm,#uploadDocumentUpdateForm').addClass("hide ");
						$(".attachment",'#uploadDocumentModalForm,#uploadDocumentUpdateForm').removeClass("hide ");				
				}

				setupTinyMCEEditor('textarea#signdoc-template-html', false, undefined, function()
				{
					set_tinymce_content('signdoc-template-html', model.text);
					// Register focus
					register_focus_on_tinymce('signdoc-template-html');
					// Reset tinymce
				});		
				var optionsTemplate = "<option doc_type='SENDDOC' value='{{id}}'>{{name}}</option>";
				fillSelect('template_type', '/core/api/document/templates', 'documents', function fillNew(coll)
				{
				
				$('#template_type','#uploadDocumentModalForm,#uploadDocumentUpdateForm').get(0).document_templates=coll;

				$('#template_type', "#uploadDocumentUpdateForm").find('option[value=' + 	template_type + ']').attr('selected', 'selected');
				//console.log(coll);

				}, optionsTemplate, false, el);

				$('#uploadDocumentUpdateForm').find("#" + model.network_type).closest(".link").find(".icon-ok").css("display", "inline");
				$('#uploadDocumentUpdateForm').find("#" + model.network_type).closest(".link").css("background-color", "#EDEDED");
		}, "#documents-listener-container");		
		/*var documentUpdateForm = $("#uploadDocumentUpdateForm");
		deserializeForm(value, $("#uploadDocumentUpdateForm"));
		$('#uploadDocumentUpdateForm').find("#" + value.network_type).closest(".link").find(".icon-ok").css("display", "inline");
		$('#uploadDocumentUpdateForm').find("#" + value.network_type).closest(".link").css("background-color", "#EDEDED");
		*/
		// Call setupTypeAhead to get contacts
		agile_type_ahead("document_relates_to_contacts", uploadDocumentUpdateForm, contacts_typeahead);
		
		// Deals type-ahead
		agile_type_ahead("document_relates_to_deals", uploadDocumentUpdateForm, deals_typeahead, false,null,null,"core/api/search/deals",false, true);
		initializeDocumentsListeners();	

	},
	

	/**
	 * Fetches all the documents as list. Fetching makes easy to add/get
	 * document to the list.
	 */
	documents : function()
	{
		 // Fetches documents as list
		this.DocumentCollectionView = new Document_Collection_Events({ url : 'core/api/documents', templateKey : "documents", cursor : true, page_size : 20,
			individual_tag_name : 'tr', postRenderCallback : function(el)
			{
				includeTimeAgo(el);
				
			}, appendItemCallback : function(el)
			{
				// To show timeago for models appended by infini scroll
				includeTimeAgo(el);
			} });

		this.DocumentCollectionView.collection.fetch();

		// Shows deals as list view
		$('#content').html(this.DocumentCollectionView.render().el);

		$(".active").removeClass("active");
		$("#documentsmenu").addClass("active");
	} });

function initializeDocumentsListeners()
{
	$('#uploadDocumentUpdateForm,#uploadDocumentModalForm').on('click', '#document_validate, #document_update_validate', function(e)
	{
 		e.preventDefault();

 		var modal_id = $(this).closest('.upload-document-modal').attr("id");
    	var form_id = $(this).closest('#documents-listener-container').find('form').attr("id");
    	
    	save_content_to_textarea('signdoc-template-html');

    	// serialize form.
    	var json = serializeForm(form_id);
    	console.log(json);

    	if(form_id == "uploadDocumentForm")
    		saveDocument(form_id, modal_id, this, false, json);
    	else
    		saveDocument(form_id, modal_id, this, true, json);
	});

	$('#uploadDocumentModalForm,#uploadDocumentUpdateForm').on('change', '#template_type', function(e)
	{
		var template_id = $("#template_type option:selected").val();
		var sTemplateText="";
		$.each($(this).get(0).document_templates.toJSON(), function(index, model)
		{
			if(model.id==template_id)
			{
				var template;
				sTemplateText=model.text;
				var json = get_contact_json_for_merge_fields();
				try
				{
					template = Handlebars.compile(sTemplateText);
					sTemplateText = template(json);
				}
				catch (err)
				{
					sTemplateText = add_square_brackets_to_merge_fields(sTemplateText);

					template = Handlebars.compile(sTemplateText);
					sTemplateText = template(json);
				}
				return false;
			}
		});
		set_tinymce_content('signdoc-template-html', sTemplateText);
	});	
}

function process_edoctemplates_model(base_model) {

	base_model.set("contactcompanydealtype",$("#edocument-type-select-container").attr("contactcompanydealtype"))
	base_model.set("contactcompanydealid",$("#edocument-type-select-container").attr("contactcompanydealid"))
	
	var itemView = new Base_List_View({
		model : base_model,
		template : 'document-etype-select-model',
		tagName : 'div',
		className : 'col-md-3 col-sm-6 col-xs'
	});
	$('#document-etype-select-list', this.el).append(
			$(itemView.render().el));
}