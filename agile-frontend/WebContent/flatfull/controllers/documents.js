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
		var model_json={};

		if(contactcompanydealtype==null)
			contactcompanydealtype="document"
		var id=null
		$("#content").html('<div templateid=' + templateid + ' edocattachtype='+ edocattachtype +' contactcompanydealid='+ contactcompanydealid +' contactcompanydealtype='+ contactcompanydealtype +' id="documents-listener-container"></div>');	
		
		// Takes back to contacts if contacts detail view is not defined
		
		if(contactcompanydealtype=="contact" )
		{
				if(App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
				model_json=App_Contacts.contactDetailView.model.toJSON();

				if(model_json.id!=contactcompanydealid)
				{
					var url = '/core/api/contacts/'+ contactcompanydealid;
					$.ajax({
						url : url,
						type: 'GET',
						dataType: 'json',
						success: function(data){
							model_json=data;
							$("#documents-listener-container").data("contact_model_json",model_json)
							
							proc_add_document(model_json);	
						}
					});
				}
				else
				{
					contact_model_json=model_json;
					proc_add_document(model_json);	
					$("#documents-listener-container").data("contact_model_json",model_json)
				}	
				if(model_json)
					id=model_json.id;
		}			
		else if(contactcompanydealtype=="company" ){
			//var compIdTemp = getPropertyValue(App_Companies.companyDetailView.model.toJSON().properties,'id');
			//if(id && id == compIdTemp){
				if(App_Companies.companyDetailView && App_Companies.companyDetailView.model)
					model_json = App_Companies.companyDetailView.model.toJSON();
				if(model_json.id!=contactcompanydealid)
				{
					var url = '/core/api/contacts/'+ contactcompanydealid;
					$.ajax({
						url : url,
						type: 'GET',
						dataType: 'json',
						success: function(data){
							model_json=data;
							$("#documents-listener-container").data("contact_model_json",model_json)
							proc_add_document(model_json);	
						}
					});	
				}
				else
				{
					$("#documents-listener-container").data("contact_model_json",model_json)
					proc_add_document(model_json);	

				}	
			//}
		}
		else if(contactcompanydealtype=="deal"){
			//var compIdTemp = getPropertyValue(App_Companies.companyDetailView.model.toJSON().properties,'id');
			//if(id && id == compIdTemp){
				if( App_Deal_Details && App_Deal_Details.dealDetailView)
					model_json = App_Deal_Details.dealDetailView.model.toJSON();
				if(model_json.id!=contactcompanydealid)
				{

					var url = '/core/api/opportunity/'+ contactcompanydealid;
					$.ajax({
						url : url,
						type: 'GET',
						dataType: 'json',
						success: function(data){
							model_json=data;
							$("#documents-listener-container").data("deal_model_json",model_json)
							proc_add_document(model_json);	
						}
					});
				}
				else
				{
					$("#documents-listener-container").data("deal_model_json",model_json)
					proc_add_document(model_json);		
				}	
			//}
		}
		else
		{
					proc_add_document(model_json);		
		}
	
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

		var el=eDocTemplate_Select_View.render().el;
		$('#edocument-type-select-container').html(el);
		initialize_add_document_template_listeners(el);

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
		else if(id=="edoc" )
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
		else
		{
			var url = '/core/api/documents/'+ id;
					$.ajax({
						url : url,
						type: 'GET',
						dataType: 'json',
						success: function(data){
							load_document_from_edit_model(data)
							
						}
					});
			return;		
		}
		load_document_from_edit_model(model)
	/*	var uploadModal = $('#uploadDocumentUpdateForm');
		uploadModal.html(getTemplate("upload-document-update-modal", {}));
		uploadModal.modal('show');*/
		
		
		/*var documentUpdateForm = $("#uploadDocumentUpdateForm");
		deserializeForm(value, $("#uploadDocumentUpdateForm"));
		$('#uploadDocumentUpdateForm').find("#" + value.network_type).closest(".link").find(".icon-ok").css("display", "inline");
		$('#uploadDocumentUpdateForm').find("#" + value.network_type).closest(".link").css("background-color", "#EDEDED");
		*/
		

	},
	

	/**
	 * Fetches all the documents as list. Fetching makes easy to add/get
	 * document to the list.
	 */
	load_documents : function()
	{	
		var that = this;
		getTemplate("documents-load", {}, undefined, function(template_ui){
		if(!template_ui)
		 return;
		$('#content').html($(template_ui));
		that.DocumentCollectionView = new Document_Collection_Events({ url : 'core/api/documents', templateKey : "documents", cursor : true, page_size : 20,
		individual_tag_name : 'tr', postRenderCallback : function(el)
		{
			includeTimeAgo(el);
				 
		}, appendItemCallback : function(el)
		{
		// To show timeago for models appended by infini scroll
		includeTimeAgo(el);
		} });

		that.DocumentCollectionView.collection.fetch();

		// Shows deals as list view
		$('.documents-list').html(that.DocumentCollectionView.render().el);

		$(".active").removeClass("active");
		$("#documentsmenu").addClass("active");

		head.js(LIB_PATH + 'lib/date-charts.js', function() {
		renderDocumentsActivityView();
				
		});
		}, "#content");
	}, 
	documents : function()
	{
		getTemplate('documents-static-container', {}, undefined, function(template_ui) {
					$("#content").html(getTemplate("documents-static-container"));

					// Add top view
					var sortKey = _agile_get_prefs("Documentssort_Key");
					if(sortKey == undefined || sortKey == null){
						sortKey = "dummy_name";
						_agile_set_prefs("Documentssort_Key", sortKey);
					}

					var that = this;
					var documentsStaticModelview = new Document_Model_Events({
						template : 'documents-top-header',
						isNew : true,
						model : new Backbone.Model({"sortKey" : sortKey}),
						postRenderCallback : function(el){
							// Add collection view
							console.log("Load collection");
							App_Documents.loadDocuments($("#content"));
						}
					});

					$("#content").find("#documents-top-view").html(documentsStaticModelview.render().el);

				}, $("#content"));
		head.js(LIB_PATH + 'lib/date-charts.js', function() {
		renderDocumentsActivityView();
				
		});

	},

	loadDocuments : function(el)
	{
		var that  = this ;
		var sortKey = _agile_get_prefs("Documentssort_Key");
				if (App_Documents.DocumentCollectionView && App_Documents.DocumentCollectionView.options.global_sort_key == sortKey && App_Documents.DocumentCollectionView.collection && App_Documents.DocumentCollectionView.collection.length > 0)
				{
					$(el).find("#documents_collection_container").html(App_Documents.DocumentCollectionView.render(true).el);
					return;
				}

				// Loading icon
				$("#content").find("#documents_collection_container").html(LOADING_HTML);

				

				App_Documents.DocumentCollectionView = new Document_Collection_Events({ 
					url : 'core/api/documents', 
					sort_collection : false,
					templateKey : "documents", 
					individual_tag_name : 'tr', 
					cursor : true, 
					customLoader : true,
					customLoaderTemplate : 'agile-app-collection-loader',
					page_size : 20, 
					global_sort_key : sortKey, 
					postRenderCallback : function(col_el)
					{
						//includeTimeAgo(el);
						//updateSortKeyTemplate(sortField, el);
						includeTimeAgo(el);
						$(".active").removeClass("active");
						$("#documentsmenu").addClass("active");
						$(".documents-collection").on('click', '.document-url', function(e)
						{
						var source = e.target || e.srcElement;
						var id =$(source).attr("data");
						Backbone.history.navigate('documents/' + id, { trigger : true });
						});	 
					}, appendItemCallback : function(el)
					{
					// To show timeago for models appended by infini scroll
					includeTimeAgo(el);
					}
					});
					App_Documents.DocumentCollectionView.collection.fetch();
					// Shows deals as list view
					$("#content").find("#documents_collection_container").html(App_Documents.DocumentCollectionView.el);

	
	}
});

function renderEachDocumentActivityView(id)
{
	// Creates backbone collection view
	this.eachdocumentactivitiesview = new Base_Collection_View({ url : '/core/api/documentviewer/documents/' + id , sortKey : 'time',
		descending : true, templateKey : "document-notes", sort_collection : false, cursor : true, scroll_symbol : 'scroll', page_size : 10,
		individual_tag_name : 'li', postRenderCallback : function(el)
		{
			deal_infi_scroll($('.document-comments-history'), this.eachdocumentactivitiesview);
			includeTimeAgo(el);
			
		}, appendItemCallback : function(el)
		{
			includeTimeAgo(el);
		}

	});
	this.eachdocumentactivitiesview.appendItem = append_document_notes;
	// Fetches data from server
	this.eachdocumentactivitiesview.collection.fetch();

	// Renders data to activity list page.
	$('.documents-activities').html(this.eachdocumentactivitiesview.render().el);

}
function renderDocumentsActivityView(id)
{
	// Creates backbone collection view
	var sURLQuery="",sTemplateName="documents-notes";
	if(id)
	{
		sURLQuery="?documentid=" +id;
		sTemplateName="document-notes"
	}

	this.activitiesview = new Base_Collection_View({ url : '/core/api/documentviewer/documents' + sURLQuery , sortKey : 'time',
		descending : true, templateKey : sTemplateName, sort_collection : false, cursor : true, scroll_symbol : 'scroll', page_size : 10,
		individual_tag_name : 'li', postRenderCallback : function(el)
		{
			deal_infi_scroll($('#documents-comments-history'), this.activitiesview);
			includeTimeAgo(el);
			
		}, appendItemCallback : function(el)
		{
			includeTimeAgo(el);
		}

	});
	activitiesview.appendItem = append_document_notes;
	// Fetches data from server
	this.activitiesview.collection.fetch();

	// Renders data to activity list page.
	$('.documents-activities').html(this.activitiesview.render().el);

}

function append_document_notes(base_model)
{

	var itemView = new Base_List_View({ model : base_model, "view" : "inline", template : this.options.templateKey + "-model", tagName : 'li', });

	// add to the right box - overdue, today, tomorrow etc.
	var createdtime = get_activity_created_time(base_model.get('created_time'));

	// Today
	if (createdtime == 0)
	{
		$('#earllier').show();
		$('#next-week-heading').addClass("ref-head");

		var heading = $('#today-heading', this.el);

		$('#today-activity', this.el).append(itemView.render().el);
		$('#today-activity', this.el).parent('table').css("display", "block");
		$('#today-activity', this.el).show();
		$('#today-heading', this.el).show();
	}

	if (createdtime == -1)
	{
		$('#earllier').show();
		$('#next-week-heading').addClass("ref-head");

		var heading = $('#tomorrow-heading', this.el);

		$('#tomorrow-activity', this.el).append(itemView.render().el);
		$('#tomorrow-activity', this.el).parent('table').css("display", "block");
		$('#tomorrow-activity', this.el).show();
		$('#tomorrow-heading', this.el).show();
	}
	if (createdtime < -1)
	{

		var heading = $('#next-week-heading', this.el);

		$('#next-week-activity', this.el).append(itemView.render().el);
		$('#next-week-activity', this.el).parent('table').css("display", "block");
		$('#next-week-activity', this.el).show();
		$('#next-week-heading', this.el).show();
	}

}
function process_add_document_templatemodel(template_model)
{
	var template;
	var contactcompanydealtype =$("#documents-listener-container").attr("contactcompanydealtype")
	sTemplateText=template_model.text;
	var sPricingTable="";
	if($("#documents-listener-container").data("deal_model_json"))
	{
		sPricingTable=get_pricingtable_from_deal($("#documents-listener-container").data("deal_model_json"));
	}	
	
	var json={};
	if($("#documents-listener-container").data("contact_model_json"))
	{
		json = get_contact_json_for_merge_fields($("#documents-listener-container").data("contact_model_json"));	
	}
	
	json= merge_jsons({}, {"pricing_table":sPricingTable}, json);	
	
	
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
	set_tinymce_content('signdoc-template-html', sTemplateText);
}

function initializeDocumentsListeners()
{
	$('#uploadDocumentUpdateForm,#uploadDocumentForm').on('click', '#document-send-comments', function(e)
	{
		e.preventDefault();
		var source = event.target || event.srcElement;
		var sId="";
		if($(source).attr("data"))						
			sId=$(source).attr("data");
		if(sId=="")
			return;
						var sCommentsVal=$("#comments",'#uploadDocumentUpdateForm,#uploadDocumentForm').val();
						if(!sCommentsVal.trim())
						{
							$(".doc-comment-error-status",'#uploadDocumentUpdateForm,#uploadDocumentForm').html("Comments is required.")
  							return;
						}
						else
							$(".doc-comment-error-status",'#uploadDocumentUpdateForm,#uploadDocumentForm').html("")
						var doc_json={"description":sCommentsVal,
							"contact_id": "",
							"commenter_id": CURRENT_DOMAIN_USER.id,
							"commenter_name": CURRENT_DOMAIN_USER.name,
							"document_id":sId,
							"owner_id" : CURRENT_DOMAIN_USER.id,
							"agileUserId" : CURRENT_AGILE_USER.id,
							"d_name" : CURRENT_DOMAIN_USER.domain,
							"domainname" : CURRENT_DOMAIN_USER.domain,
							};
						
						$.ajax({
							url : '/core/api/documentviewer',
							type : 'PUT',
							contentType : 'application/json; charset=utf-8',
							data : JSON.stringify(doc_json),
							dataType : '',
							complete : function(res, status)
							{

							},
							success:function(res){
								var sComments=$("#comments").val();
								$(".latestactivitypanel").removeClass("hide");
								$(".noactivitypanel").addClass("hide");
								if($("#today-activity"))
								{
									var sHTML='<li><li class="wrapper-sm b-b"><div title="'+ sComments + '" class="m-b-none text-flow-ellipsis line-clamp" style="display:-moz-box;">' + sComments +'</div><small class="block text-muted"> <div class="m-b-none text-flow-ellipsis line-clamp">by ' + CURRENT_DOMAIN_USER.name + '</div><small class="block text-muted"><i class="fa fa-fw fa-clock-o"></i>&nbsp;<time class="text-sm" datetime="" title="">less than a minute ago</time></small></small></li><small class="block text-muted"></small></li>'
									$("#today-activity").prepend(sHTML)
								}
								else
								{
									var sHTML='<li><li class="wrapper-sm b-b"><div title="'+ sComments + '" class="m-b-none text-flow-ellipsis line-clamp" style="display:-moz-box;">' + sComments +'</div><small class="block text-muted"> <div class="m-b-none text-flow-ellipsis line-clamp">by ' + CURRENT_DOMAIN_USER.name + '</div><small class="block text-muted"><i class="fa fa-fw fa-clock-o"></i>&nbsp;<time class="text-sm" datetime="" title="">less than a minute ago</time></small></small></li><small class="block text-muted"></small></li>'	
									$("#documents-comments-history").append(sHTML)
								}		

								//var sHTML='<ul class="list-group"><li class="list-group-item document-notes"><p class="line-clamp line-clamp-3 activity-tag" style="display:-moz-box;word-wrap: break-word;overflow:hidden;">'+ sComments +'</p><small class="block text-muted"><i class="fa fa-fw fa-clock-o"></i> <time class="timeago" datetime="Feb 19 2016 19:02:53" title="1455888773">less than a minute ago</time></small></li></ul>'
								
								$("#comments").val("")
								$('#comments').focus();
							}
							, error : function(response)
							{

								console.log(response);
							}	
						});			

	});
	$('#uploadDocumentUpdateForm,#uploadDocumentForm').on('click', '.generate-send-doc', function(e)
	{	

		$(".generate-send-doc",'#uploadDocumentForm,#uploadDocumentUpdateForm').addClass("hide");			
		$(".senddoc",'#uploadDocumentForm,#uploadDocumentUpdateForm').removeClass("hide");			
		
		setupTinyMCEEditor('textarea#signdoc-template-html', false, undefined, function()
		{

			// Register focus
			register_focus_on_tinymce('signdoc-template-html');
			var sTemplateText="";
			var templateid =$("#documents-listener-container").attr("templateid");	
			if(templateid)
			{
				
				var tempate_model=null;
				if(eDocTemplate_Select_View && eDocTemplate_Select_View.collection)
					tempate_model=eDocTemplate_Select_View.collection.get(templateid)	
				if(!tempate_model)
				{
					//$("#documents-listener-container").data({"pricing_table":sPricingTable})
					//$("#documents-listener-container").attr("pricingtable",sPricingTable)
					var url = '/core/api/document/templates/'+ templateid;
					$.ajax({
						url : url,
						type: 'GET',
						dataType: 'json',
						success: function(data){
							process_add_document_templatemodel(data)
							//console.log(sPricingTable)
							
						}
					});										
				}
				else
				{
					process_add_document_templatemodel(tempate_model.toJSON());
				}
			
			}
			// Reset tinymce
			
		},
		function(contact_json)
		{
			if($("#documents-listener-container").data("contact_model_json"))
			{
				contact_json=get_contact_json_for_merge_fields($("#documents-listener-container").data("contact_model_json"));
			}
			else
				contact_json={}										
			if($("#documents-listener-container").data("deal_model_json"))
			{
				contact_json["pricing_table"]=get_pricingtable_from_deal($("#documents-listener-container").data("deal_model_json"));
			}										
			return contact_json;
		});		

		$(".generate-send-doc",'#uploadDocumentForm,#uploadDocumentUpdateForm').addClass("hide");
		$("#document_validate",'#uploadDocumentForm,#uploadDocumentUpdateForm').removeClass("hide");
		
		
	});
	$('#uploadDocumentUpdateForm,#uploadDocumentForm').on('click', '.cancel-document', function(e)
	{
 		e.preventDefault();
 		cancel_document();
 		
	});
	$('#uploadDocumentUpdateForm,#uploadDocumentForm').on('click', '.email-send-doc', function(e)
	{
 		e.preventDefault();

 		var sURL="#send-email/documents/" + $('#uploadDocumentUpdateForm,#uploadDocumentForm').find("#id").val();
		Backbone.history.navigate(sURL, { trigger : true });
 		return;
 		
	});
	$('#uploadDocumentUpdateForm,#uploadDocumentForm').on('click', '#document_validate, #document_update_validate', function(e)
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
	$('#uploadDocumentUpdateModalForm,#uploadDocumentForm').on('click', '.link', function(e)
	{
		e.preventDefault();
		$(this).closest('form').find('#error').html("");
		var form_id = $(this).closest('form').attr("id");
		var id = $(this).find("a").attr("id");
		
		if(id && id == "GOOGLE")
			var newwindow = window.open("upload-google-document.jsp?id="+ form_id, 'name','height=510,width=800');
		else if(id && id == "S3")
			var newwindow = window.open("upload-custom-document.jsp?id="+ form_id +"&t=" + CURRENT_USER_PREFS.template +"&d=" + CURRENT_DOMAIN_USER.domain, 'name','height=310,width=500');
		
		if (window.focus)
		{
			newwindow.focus();
		}
		return false;
	});
	$('#uploadDocumentForm').on('hidden.bs.modal', function(e){
		$('#GOOGLE',$('#uploadDocumentForm')).parent().show();
	});	
}
function proc_add_document(model_json)
{
		var contactcompanydealtype =$("#documents-listener-container").attr("contactcompanydealtype");
		var contactcompanydealid =$("#documents-listener-container").attr("contactcompanydealid");
		var templateid =$("#documents-listener-container").attr("templateid");	
		var edocattachtype =$("#documents-listener-container").attr("edocattachtype");	
		$("#documents-listener-container").data("context_model",model_json);
		var that = this;
		getTemplate("upload-document-modal", model_json, undefined, function(template_ui){
			if(!template_ui)
				  return;

			var el = $("#documents-listener-container").html($(template_ui));

			var el_form	= $("#uploadDocumentForm")
			var sPricingTable="";	
			if(model_json && model_json.id)
			{	
				if(contactcompanydealtype=="deal")
				{
					//sPricingTable= get_pricingtable_from_deal(model_json)	
					$('.deal_tags',el).append('<li class="tag  btn btn-xs btn-primary m-r-xs m-b-xs inline-block"  style="display: inline-block; vertical-align: middle; margin-right:3px;" data="'+ model_json.id +'">'+model_json.name+'</li>');
				}
				else 
				{
					var contact_name = getContactName(model_json);
					$('.contacts', "#uploadDocumentForm").append('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="' + model_json.id + '">' + contact_name + '</li>');
				}
			}
			
			
			
	
				
				if(edocattachtype=="edoc")
				{
						var fxn_process_added_contact = function(data, item)
					     {
					      $("#content [name='contact_ids']")
					        .html(
					          '<li class="inline-block tag btn btn-xs btn-primary m-r-xs m-b-xs" data="' + data + '"><span><a class="text-white m-r-xs" href="#contact/' + data + '">' + item + '</a><a class="close" id="remove_tag">&times</a></span></li>');
					      		var url = '/core/api/contacts/'+ data;
								$.ajax({
									url : url,
									type: 'GET',
									dataType: 'json',
									success: function(data)
									{
										$("#documents-listener-container").data("contact_model_json",data)
										
									}
								});
					     }
						// Contacts type-ahead
						agile_type_ahead("document_relates_to_contacts", el_form, contacts_typeahead,fxn_process_added_contact);
					     
						var fxn_process_added_deal = function(data, item)
					     {
					      $("#content [name='deal_ids']")
					        .html(
					          '<li class="inline-block tag btn btn-xs btn-primary m-r-xs m-b-xs" data="' + data + '"><span><a class="text-white m-r-xs" href="#deal/' + data + '">' + item + '</a><a class="close" id="remove_tag">&times</a></span></li>');
					      		var url = '/core/api/opportunity/'+ data;
								$.ajax({
									url : url,
									type: 'GET',
									dataType: 'json',
									success: function(data){
										$("#documents-listener-container").data("deal_model_json",data)
										
									}
								});
					     }

						// Deals type-ahead
						agile_type_ahead("document_relates_to_deals", el_form, deals_typeahead, fxn_process_added_deal, null, null, "core/api/search/deals", false, true);	


						$("#network_type",'#uploadDocumentForm,#uploadDocumentUpdateForm').val("NONE");
						$("#doc_type",'#uploadDocumentForm,#uploadDocumentUpdateForm').val("SENDDOC");
					
						
						
					
					$(".generate-send-doc",'#uploadDocumentForm,#uploadDocumentUpdateForm').removeClass("hide ");
					$("#document_validate",'#uploadDocumentForm,#uploadDocumentUpdateForm').addClass("hide ");
					$(".email-send-doc",'#uploadDocumentForm,#uploadDocumentUpdateForm').addClass("hide ");
					
					$(".attachment",'#uploadDocumentForm,#uploadDocumentUpdateForm').addClass("hide");
				}	
				else
				{
						agile_type_ahead("document_relates_to_contacts", el_form, contacts_typeahead);

						// Deals type-ahead
						agile_type_ahead("document_relates_to_deals", el_form, deals_typeahead, false, null, null, "core/api/search/deals", false, true);

					$("#doc_type",'#uploadDocumentForm,#uploadDocumentUpdateForm').val("ATTACHMENT");	
					$(".senddoc",'#uploadDocumentForm,#uploadDocumentUpdateForm').addClass("hide ");
					$(".send-doc-button",'#uploadDocumentForm,#uploadDocumentUpdateForm').addClass("hide ");
					$(".attachment",'#uploadDocumentForm,#uploadDocumentUpdateForm').removeClass("hide");	
				}
			
				initializeDocumentsListeners();	
			
			
		}, "#documents-listener-container"); 
	}
	


function process_edoctemplates_model(base_model) {

	base_model.set("contactcompanydealtype",$("#edocument-type-select-container").attr("contactcompanydealtype"))
	base_model.set("contactcompanydealid",$("#edocument-type-select-container").attr("contactcompanydealid"))
	
	var itemView = new Base_List_View({
		model : base_model,
		template : 'document-etype-select-model',
		tagName : 'div',
		className : 'col-md-3 col-sm-6 col-xs document-template-etype'
	});

	var el=itemView.render().el
	$(el).data("template_html",base_model.text)
	$(el).attr("position" ,$(".document-template-etype").length)
	$('#document-etype-select-list', "#edocument-type-select-container").append(el);


}

function get_pricingtable_from_deal(model_json)
{
	var deal_name = model_json.name;
	
	var sCurrency = ((CURRENT_USER_PREFS.currency != null) ? CURRENT_USER_PREFS.currency : "USD-$");
		sCurrency = ((sCurrency.length < 4) ? "$" : sCurrency.substring(4, sCurrency.length))
	
	var iDealAmt=model_json.currency_conversion_value;
	if(!$.isNumeric(iDealAmt))
		iDealAmt=model_json.expected_value;
	
	var sProductsTR="",sProductsHead="";
	var sPricingTable="<table widht='100%'>"
	if(model_json.products && model_json.products.length)
	{

		var iTotal=0
		$.each(model_json.products, function(nr, data)
		{	
			var sImage="";
			if(data.image)
			{
				sImage="<td style='border:none;' rowspan='2'><img src='" + data.image	+"' style='width:85px;'></img></td>";	
			}
			sProductsTR+="<tr><td><table style='border:none;' border='0' cellpadding='0' cellspacing='0'><tr><td style='border:none;'>" + data.name	+"</td>" + sImage + "</tr>" + "<tr><td style='border:none;'>"+ data.description + "</td></tr></table></td><td  align='center' style='align:center;'>" + sCurrency + data.price.toFixed(2)+"</td><td  align='center'  style='align:right;'>"+data.qty+ "</td><td  align='right' style='align:right;'>" + sCurrency + data.total.toFixed(2) + "</tr>"
			iTotal+=data.total;
		});			
		if(sProductsTR!="")
		{
			sProductsHead="<thead><tr><th style='background:#dedede;'><b>Name</b></th><th style='background:#dedede;'><b>Price</b></th><th style='background:#dedede;'><b>QTY</b></th><th align='right' style='background:#dedede;'><b>Subtotal</b></th></tr></thead>"
			if(model_json.apply_discount)	
			sProductsTR+= "<tr><td colspan='3' align='right'><b>Current Subtotal</b></td><td  align='right' style='align:right;'>" + sCurrency + iTotal.toFixed(2) + "</tr></tbody>"
			else
			sProductsTR+= "<tr><td colspan='3' align='right'><b>Grand Total</b></td><td  align='right' style='align:right;'>" + sCurrency + iTotal.toFixed(2) + "</tr></tbody>"	
		}
		if(model_json.apply_discount)
		{
			var iDiscountAmt=0	
    		sProductsTR+= "<tr><td colspan='3' align='right'><b>Discount</b></td><td align='right'  style='align:right;'>" + sCurrency + model_json.discount_amt.toFixed(2) + "</tr>"
    		sProductsTR+= "<tr><td colspan='3' align='right'><b>Grand Total</b></td><td  align='right' style='align:right;'>" + sCurrency + iDealAmt.toFixed(2) + "</tr>"
		}
	}	
	else
	{
		if(model_json.apply_discount)
		{
    		sProductsTR+= "<tr><td><b>Discount</b></td><td  align='right' style='align:right;'>" + sCurrency +  model_json.discount_amt.toFixed(2) + "</tr>"
    		sProductsTR+= "<tr><td><b>Grand Total</b></td><td  align='right' style='align:right;'>" + sCurrency + iDealAmt.toFixed(2) + "</tr>"
		}	
	}
	
	sPricingTable="<table widht='100%' border='1' style='width:100%;border-collapse: collapse;border-color: #dfdfdf;border: none;'>"+ sProductsHead+"<tbody>" +sProductsTR+"</tbody></table>"
	return sPricingTable;
}
function initialize_add_document_template_listeners(elContainer) {

	$('[data-toggle=popover]').on('shown.bs.popover', function () {
	  $('.popover').css('top',parseInt($('.popover').css('top')) + 22 + 'px')
	})
	$("#edocument-type-select-container")
		.on(
		"mouseenter",
		".document-template-etype",
		function(e) {
		var index=$(e.target).closest(".document-template-etype").attr("position");
		if(index>3)
		{
			while(index>3)
			{
				index-=4;
			}
		}
		var placement="right";
		function wheretoplace(context,source){
			   var $win, $source, winWidth, popoverWidth, popoverHeight, offset, toRight, toLeft, placement, scrollTop;

		    $win = $(window);
		    $source = $(source);
		    placement = "right"//$source.attr('data-placement');
		    popoverWidth = 400;
		    popoverHeight = 110;
		    offset = $source.offset();

		    // Check for horizontal positioning and try to use it.
		    if (placement.match(/^right|left$/)) {
		      winWidth = $win.width();
		      toRight = winWidth - offset.left - source.offsetWidth;
		      toLeft = offset.left;

		      if (placement === 'left') {
		        if (toLeft > popoverWidth) {
		          return 'left';
		        }
		        else if (toRight > popoverWidth) {
		          return 'right';
		        }
		      }
		      else {
		        if (toRight > popoverWidth) {
		          return 'right';
		        }
		        else if (toLeft > popoverWidth) {
		          return 'left';
		        }
		      }
		    }

		    // Handle vertical positioning.
		    scrollTop = $win.scrollTop();
		    if (placement === 'bottom') {
		      if (($win.height() + scrollTop) - (offset.top + source.offsetHeight) > popoverHeight) {
		        return 'bottom';
		      }
		      return 'top';
		    }
		    else {
		      if (offset.top - scrollTop > popoverHeight) {
		        return 'top';
		      }
		      return 'bottom';
		    }
	    }
		if(index==2 || index==3)
			placement="left";
		$(this).popover({
				"trigger": "hover", 
            	"placement": wheretoplace,
            	"max-width":"100%",
            	"toggle" : "popover",
		        "template":'<div style="overflow-x:hidden;max-width:640px;height:90vh;overflow-y:hidden;box-sizing:content-box;background:rgb(239,241,242);" class="popover m-l-xs m-r-xs"><div class="arrow"></div><div class="popover-inner" style="padding:1px;width:640px;border-radius:2px"><div class="popover-content" style="background:rgb(239,241,242)"><p></p></div></div></div>',
		        "container": 'body',
		        "html":"true"
		       	});

		
		console.log($(".document-template-go-popover",this).attr("pos"));
		//$(this).attr("data-content", "test");
		$(this).attr("data-content", $(".document-template-go-popover",this).html());
		$(".document-template-go-popover",this).remove();
		$(".document-template-go-popover",this).css("max-width","600px");
		$(".document-template-go-popover",this).css("min-width","600px");
		$(".popover",this).css("min-width","600px");
		$(".popover",this).css("max-width","600px");
		//$(this).attr("data-content", $(".document-template-go-popover",this).html());
		       
		$(this).popover('show');
		$(this).off('shown.bs.popover')

		$(this).on('shown.bs.popover', function () {
		  $('.popover').css('top',parseInt($('.popover').css('top')) + 22 + 'px')
		})
		});
}
function cancel_document()
{
	if (App_Contacts.contactDetailView)
		{
				if(Current_Route.indexOf( "contact")>-1)	
				{
					var sURL="contact/" + App_Contacts.contactDetailView.model.get('id');
					Backbone.history.navigate(sURL, { trigger : true });
					return;			
				}
				else if( Current_Route.indexOf( App_Contacts.contactDetailView.model.get('id'))>-1)
				{
					var sURL="contact/" + App_Contacts.contactDetailView.model.get('id');
					Backbone.history.navigate(sURL, { trigger : true });
					return;
				}
		}
		if (App_Companies.companyDetailView)
		{
			if(Current_Route.indexOf( "company")>-1)	
			{
				var sURL="company/" + App_Companies.companyDetailView.model.get('id');
				Backbone.history.navigate(sURL, { trigger : true });
				return;	
			}
			else if( Current_Route.indexOf( App_Companies.companyDetailView.model.get('id'))>-1)
			{
				company_util.updateDocumentsList(document,true);
				var sURL="company/" + App_Companies.companyDetailView.model.get('id');
				Backbone.history.navigate(sURL, { trigger : true });
				return;
			}		
		}
		if (App_Deal_Details.dealDetailView)
		{
				if((Current_Route.indexOf( "deal" + "/" +App_Deal_Details.dealDetailView.model.id)>-1) ||	( Current_Route.indexOf( App_Deal_Details.dealDetailView.model.get('id'))>-1))
				{
					var sURL="deal/" + App_Deal_Details.dealDetailView.model.id ;
					Backbone.history.navigate(sURL, { trigger : true });
					return;			
				}
		}		
		if (Current_Route == 'documents') 
		{
			App_Documents.navigate("documents", {trigger : true});
				return;
		}	
		if (Current_Route == "email-template-add" || Current_Route.indexOf("email-template") == 0) 
		{
			App_Settings.navigate(Current_Route, {
					trigger : true
				});
		}
		else 
		{
			App_Documents.navigate("documents", {
				trigger : true
			});
		}
}
function load_document_from_edit_model(model)
{
		$("#content").html('<div id="documents-listener-container"></div>');
		var that = this;
		getTemplate("upload-document-update-modal", model, undefined, function(template_ui){
				if(!template_ui)
					  return;

				var el = $("#documents-listener-container").html($(template_ui));

				var documentUpdateForm = $("#uploadDocumentUpdateForm");
				deserializeForm(model, $("#uploadDocumentUpdateForm"));
				var 	template_type=model.template_type;
				if($("#doc_type",'#uploadDocumentForm,#uploadDocumentUpdateForm').val()=="SENDDOC")
				{

						$(".email-send-doc",'#uploadDocumentForm,#uploadDocumentUpdateForm').removeClass("hide ");
						$(".senddoc",'#uploadDocumentForm,#uploadDocumentUpdateForm').removeClass("hide ");
						$(".send-doc-button",'#uploadDocumentForm,#uploadDocumentUpdateForm').removeClass("hide ");
						$(".attachment",'#uploadDocumentForm,#uploadDocumentUpdateForm').addClass("hide ");
						setupTinyMCEEditor('textarea#signdoc-template-html', false, undefined, function()
						{
							set_tinymce_content('signdoc-template-html', model.text);
							// Register focus
							register_focus_on_tinymce('signdoc-template-html');
							// Reset tinymce
						},
						function(contact_json)
						{
							if($("#documents-listener-container").data("contact_model_json"))
							{
								contact_json=get_contact_json_for_merge_fields($("#documents-listener-container").data("contact_model_json"));
							}
							else
								contact_json={}										
							if($("#documents-listener-container").data("deal_model_json"))
							{
								contact_json["pricing_table"]=get_pricingtable_from_deal($("#documents-listener-container").data("deal_model_json"));
							}										
							return contact_json;
						});

						if(model.contact_ids && model.contact_ids.length >0)
						{
							var url = '/core/api/contacts/'+ model.contact_ids[0];
							$.ajax({
								url : url,
								type: 'GET',
								dataType: 'json',
								success: function(data)
								{
									$("#documents-listener-container").data("contact_model_json",data)
									
								}
							});			
						}
						if(model.deal_ids && model.deal_ids.length >0)
						{
								var url = '/core/api/opportunity/'+ model.deal_ids[0];
								$.ajax({
									url : url,
									type: 'GET',
									dataType: 'json',
									success: function(data){
										$("#documents-listener-container").data("deal_model_json",data)
										
									}
								});
						}
						$(".documents-activities-container",'#uploadDocumentForm,#uploadDocumentUpdateForm').removeClass("hide")
						renderDocumentsActivityView(model.id)
						
						var fxn_process_added_contact = function(data, item)
					     {
					      $("#content [name='contact_ids']")
					        .html(
					          '<li class="inline-block tag btn btn-xs btn-primary m-r-xs m-b-xs" data="' + data + '"><span><a class="text-white m-r-xs" href="#contact/' + data + '">' + item + '</a><a class="close" id="remove_tag">&times</a></span></li>');
					      		var url = '/core/api/contacts/'+ data;
								$.ajax({
									url : url,
									type: 'GET',
									dataType: 'json',
									success: function(data)
									{
										$("#documents-listener-container").data("contact_model_json",data)
										
									}
								});
					     }
						
						// Contacts type-ahead
						agile_type_ahead("document_relates_to_contacts", uploadDocumentUpdateForm, contacts_typeahead,fxn_process_added_contact);
					     
						var fxn_process_added_deal = function(data, item)
					     {
					      $("#content [name='deal_ids']")
					        .html(
					          '<li class="inline-block tag btn btn-xs btn-primary m-r-xs m-b-xs" data="' + data + '"><span><a class="text-white m-r-xs" href="#deal/' + data + '">' + item + '</a><a class="close" id="remove_tag">&times</a></span></li>');
					      		var url = '/core/api/opportunity/'+ data;
								$.ajax({
									url : url,
									type: 'GET',
									dataType: 'json',
									success: function(data){
										$("#documents-listener-container").data("deal_model_json",data)
										
									}
								});
					     }

							// Deals type-ahead
						agile_type_ahead("document_relates_to_deals", uploadDocumentUpdateForm, deals_typeahead, fxn_process_added_deal, null, null, "core/api/search/deals", false, true);	
				}
				else
				{
						if(model.network_type)
						{
							$('#uploadDocumentUpdateForm').find("#" + model.network_type).closest(".link").find(".icon-ok").css("display", "inline");
							$('#uploadDocumentUpdateForm').find("#" + model.network_type).closest(".link").css("background-color", "#EDEDED");
						}
						$(".senddoc",'#uploadDocumentForm,#uploadDocumentUpdateForm').addClass("hide ");
						$(".send-doc-button",'#uploadDocumentForm,#uploadDocumentUpdateForm').addClass("hide ");
						$(".attachment",'#uploadDocumentForm,#uploadDocumentUpdateForm').removeClass("hide ");				

						agile_type_ahead("document_relates_to_contacts", uploadDocumentUpdateForm, contacts_typeahead);

						// Deals type-ahead
						agile_type_ahead("document_relates_to_deals", uploadDocumentUpdateForm, deals_typeahead, false, null, null, "core/api/search/deals", false, true);

						//agile_type_ahead("document_relates_to_contacts", uploadDocumentUpdateForm, contacts_typeahead,fxn_process_added_contact);
						//agile_type_ahead("document_relates_to_deals", uploadDocumentUpdateForm, deals_typeahead, fxn_process_added_deal, null, null, "core/api/search/deals", false, true);	
				}
			
			

			initializeDocumentsListeners();	
		}, "#documents-listener-container");		


}