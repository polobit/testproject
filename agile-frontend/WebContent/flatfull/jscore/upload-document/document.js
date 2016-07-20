/**
*  Document collection event listeners
*/
var Document_Collection_Events = Base_Collection_View.extend({
	
	events: {
		
		'click #documents-model-list > tr > td:not(":first-child")': 'onDocumentListSelect',
		'click .documents-add': 'onAddDocument',	
	},
	 /** 
     * Document list view edit
     */
	onDocumentListSelect : function(e){
		if(e.target.parentElement.attributes[0].name!="href" && e.target.parentElement.attributes[1].name!="href"){
     		e.preventDefault();

     	 	updateDocument($(e.currentTarget).closest('tr').data());
     	 }
	},
	onAddDocument: function(e){
					e.preventDefault();

					// Show modal
					$('#uploadDocumentModal').html(getTemplate("upload-document-modal", {})).modal('show');
				
					// Add type a head actions
					var el = $("#uploadDocumentForm");
					// Contacts type-ahead
					agile_type_ahead("document_relates_to_contacts", el, contacts_typeahead);
					
					// Deals type-ahead
					agile_type_ahead("document_relates_to_deals", el, deals_typeahead, false,null,null,"core/api/search/deals",false, true);
				},

});


var Document_Model_Events = Base_Model_View.extend({
 			events: {
 						'click #sort_menu > li': 'documentsSort',
 						'click .documents-add': 'onAddDocument',		
					},
			documentsSort : function(e)
				{
					 e.preventDefault();

		        var targetEl = $(e.currentTarget);
		        var sortkey = "", $sort_menu = $("#sort_menu");
		        if($(targetEl).find("a").hasClass("sort-field"))
		        {
		            $sort_menu.find("li").not(targetEl).find("a.sort-field i").addClass("display-none");
		            $(targetEl).find("a.sort-field i").removeClass("display-none");
		        } 
		        else 
		        {
		            $sort_menu.find("li").not(targetEl).find("a.order-by i").addClass("display-none");
		            $(targetEl).find("a.order-by i").removeClass("display-none");
		        }

		        sortkey = $sort_menu.find(".order-by i:not(.display-none)").closest(".order-by").attr("data");
		        sortkey += $sort_menu.find(".sort-field i:not(.display-none)").closest(".sort-field").attr("data");
		        
		        _agile_set_prefs("Documentssort_Key", sortkey);
		        this.model.set({"sortKey" : sortkey});
				},
				/**
				 * For adding new document
				 */
				onAddDocument: function(e){
					e.preventDefault();

					// Show modal
					$('#uploadDocumentModal').html(getTemplate("upload-document-modal", {})).modal('show');
				
					// Add type a head actions
					var el = $("#uploadDocumentForm");
					// Contacts type-ahead
					agile_type_ahead("document_relates_to_contacts", el, contacts_typeahead);
					
					// Deals type-ahead
					agile_type_ahead("document_relates_to_deals", el, deals_typeahead, false,null,null,"core/api/search/deals",false, true);
				},
			});
  
/** Modal event initializer **/
$(function(){

    /** 
     * When clicked on choose network type
     */
    $('#uploadDocumentUpdateModal,#uploadDocumentModal').on('click', '.link', function(e)
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
	
	/**
	 * To validate the document add or edit forms
	 */
	$('#uploadDocumentUpdateModal,#uploadDocumentModal').on('click', '#document_validate, #document_update_validate', function(e){
 		e.preventDefault();

 		var modal_id = $(this).closest('.upload-document-modal').attr("id");
    	var form_id = $(this).closest('.upload-document-modal').find('form').attr("id");
    	
    	// serialize form.
    	var json = serializeForm(form_id);
    	console.log(json);

    	if(form_id == "uploadDocumentForm")
    		saveDocument(form_id, modal_id, this, false, json);
    	else
    		saveDocument(form_id, modal_id, this, true, json);
	});

	$('#uploadDocumentModal').on('hidden.bs.modal', function(e){
		$('#GOOGLE',$('#uploadDocumentModal')).parent().show();
	});

});


/**
 * Show document popup for updating
 */ 
function updateDocument(ele) {
	
	var value = ele.toJSON();
	
	add_recent_view(new BaseModel(value));

	var uploadModal = $('#uploadDocumentUpdateModal');
	uploadModal.html(getTemplate("upload-document-update-modal", {}));
	uploadModal.modal('show');
	
	var documentUpdateForm = $("#uploadDocumentUpdateForm");
	deserializeForm(value, $("#uploadDocumentUpdateForm"));
	$('#uploadDocumentUpdateForm').find("#" + value.network_type).closest(".link").find(".icon-ok").css("display", "inline");
	$('#uploadDocumentUpdateForm').find("#" + value.network_type).closest(".link").css("background-color", "#EDEDED");

	// Call setupTypeAhead to get contacts
	agile_type_ahead("document_relates_to_contacts", documentUpdateForm, contacts_typeahead);
	
	// Deals type-ahead
	agile_type_ahead("document_relates_to_deals", documentUpdateForm, deals_typeahead, false,null,null,"core/api/search/deals",false, true);
}

/**
 * Return url of document from JSP and appends to form
 * @param url
 * @param network
 */
function saveDocumentURL(url, network, id)
{
	id = id.split("?id=")[1];
	var form_id = id.split("&")[0];
	
	// Saving extension of document
	var extension = url.split("?");
	if(url.match("agilecrm/panel/uploaded-logo/"))
	{
		extension = extension[0];
		extension = extension.substring(extension.lastIndexOf("/")+1);
	}
	else 
		extension = "Google";
	
	$('#' + form_id).find("#extension").val(extension);
	$('#' + form_id).find("#network_type").val(network);
	$('#' + form_id).find('#network_type').closest(".controls").find("div.link").css("background-color", "#FFFFFF");
	$('#' + form_id).find('#network_type').closest(".controls").find(".icon-ok").css("display", "none");
	$('#' + form_id).find("#" + network).closest(".link").find(".icon-ok").css("display", "inline");
	$('#' + form_id).find('#' + network).closest(".link").css("background-color", "#EDEDED");
   	$('#' + form_id).find('#upload_url').val(url);
   	$('#' + form_id).find('#size').val(CUSTOM_DOCUMENT_SIZE);

    //$('#' + form_id).find('#url').html('<a href="'+ url +'" target="_blank">'+ url +'</a>');
}

/**
 *stores size of document
 */

/**
 * Saves document instance
 * @param form_id
 * @param modal_id
 * @param saveBtn
 * @param update
 * @returns {Boolean}
 */
function saveDocument(form_id, modal_id, saveBtn, isUpdate, json, contact_id)
{
	// Returns, if the save button has disabled attribute
	if ($(saveBtn).attr('disabled'))
		return;

	// Disables save button to prevent multiple click event issues
	disable_save_button($(saveBtn));
	
	// While attaching document is from existing documenst list, no need of form verification.
	if(form_id)
	{	
		
		if (!isValidForm('#' + form_id)) {

			// Removes disabled attribute of save button
			enable_save_button($(saveBtn));//$(saveBtn).removeAttr('disabled');
			
			return false;
		}
		
		var url = $('#' + form_id).find('#upload_url').val();
		if(url == "")
		{
			$('#' + form_id).find('#network_type').closest(".controls").find(".icon-ok").css("display", "none");
			$('#' + form_id).find('#network_type').closest(".controls").find("div.link").css("background-color", "#FFFFFF");
			$('#' + form_id).find('#error').html('<div class="alert alert-danger col-sm-offset-3 col-sm-7">Sorry! Document not attached properly.</div>');
			enable_save_button($(saveBtn));
			return;
		}
	}
	
	var newDocument = new Backbone.Model();
	newDocument.url = 'core/api/documents';
	newDocument.save(json, {
		success : function(data) {
			// reset document size 
			CUSTOM_DOCUMENT_SIZE = 0;

			// Removes disabled attribute of save button
			enable_save_button($(saveBtn));//$(saveBtn).removeAttr('disabled');
			
			// While attaching document is from existing documenst list, no need of form verification.
			if(form_id)
			{
				$('#' + form_id).find("#network_type").val("");
				$('#' + form_id).find('#network_type').closest(".controls").find(".icon-ok").css("display", "none");
				$('#' + form_id).find('#network_type').closest(".controls").find("div.link").css("background-color", "#FFFFFF");
				$('#' + form_id).find("#upload_url").val("");
				$('#' + form_id).find("#extension").val("");
				
				$('#' + form_id).each(function() {
					this.reset();
				});
			}
			
			//$('#' + modalId).find('span.save-status img').remove();
			if(form_id)
				$('#' + modal_id).modal('hide');
			
			var document = data.toJSON();
			add_recent_view(new BaseModel(document));
			
			// Updates data to timeline
			if (App_Contacts.contactDetailView
					&& Current_Route == "contact/"
							+ App_Contacts.contactDetailView.model.get('id')) {

				// Add model to collection. Disabled sort while adding and called
				// sort explicitly, as sort is not working when it is called by add
				// function
				
				
				/*
				 * Verifies whether the added document is related to the contact in
				 * contact detail view or not
				 */
				$.each(document.contacts, function(index, contact) {
					
					if (contact.id == App_Contacts.contactDetailView.model.get('id'))
					{
						if (documentsView && documentsView.collection)
						{
							if(documentsView.collection.get(document.id))
							{
								documentsView.collection.get(document.id).set(new BaseModel(document));
							}
							else
							{
								documentsView.collection.add(new BaseModel(document), { sort : false });
								documentsView.collection.sort();
							}
						}
						
							// Activates "Timeline" tab and its tab content in
							// contact detail view
							// activate_timeline_tab();
							//add_entity_to_timeline(data);
							/*
							 * If timeline is not defined yet, initiates with the
							 * data else inserts
							 */
							return false;
					}
				});
			} else if (company_util.isCompany()){
				company_util.updateDocumentsList(document,true);
			}
			else if (Current_Route == 'documents') {
				if (isUpdate)
					App_Documents.DocumentCollectionView.collection.remove(json);

				App_Documents.DocumentCollectionView.collection.add(data);

				App_Documents.DocumentCollectionView.render(true);

			}
			else if (App_Deal_Details.dealDetailView
					&& Current_Route == "deal/"
						+ App_Deal_Details.dealDetailView.model.id) {

			// Add model to collection. Disabled sort while adding and called
			// sort explicitly, as sort is not working when it is called by add
			// function
			
			
			/*
			 * Verifies whether the added document is related to the deal in
			 * deal detail view or not
			 */
			$.each(document.deals, function(index, deal) {
				
				if (deal.id == App_Deal_Details.dealDetailView.model.id)
				{
					if (dealDocsView && dealDocsView.collection)
					{
						if(dealDocsView.collection.get(document.id))
						{
							dealDocsView.collection.get(document.id).set(new BaseModel(document));
						}
						else
						{
							dealDocsView.collection.add(new BaseModel(document), { sort : false });
							dealDocsView.collection.sort();
						}
					}
					
						// Activates "Timeline" tab and its tab content in
						// contact detail view
						// activate_timeline_tab();
						//add_entity_to_timeline(data);
						/*
						 * If timeline is not defined yet, initiates with the
						 * data else inserts
						 */
						return false;
				}
			});
		}
		else if (Current_Route == "email-template-add" || Current_Route.indexOf("email-template") == 0 || Current_Route.indexOf("emailbuilder") == 0) {
			$('#tpl-attachment-select').find('select').find('option:last').after("<option value="+document.id+" selected='selected'>"+document.name+"</option>");
			$('.add-tpl-attachment-confirm').trigger("click");
			App_Settings.navigate(Current_Route, {
					trigger : true
				});
		}
			else {
				App_Documents.navigate("documents", {
					trigger : true
				});
			}
		},
		error : function(model, response)
		{
			if(!modal_id)
			{
				hideTransitionBar();
				enable_save_button($(saveBtn));
				if(!modal_id && json && json.contact_ids)
				{
					// Removes the contact id from related to contacts
					json.contact_ids.splice(json.contact_ids.indexOf(contact_id), 1);
				}
				var $ele = saveBtn.parent().find(".save-status");
				$ele.html("<i style='color:#B94A48;'>"+Handlebars.compile('{{name}}')({name : response.responseText})+"</i>");
				setTimeout(function()
				{
					$ele.html('');
				}, 2000);
				return;
			}
			enable_save_button($(saveBtn));
			var $ele = $(".save-status", $("#"+modal_id));
			$ele.html("<i style='color:#B94A48;'>"+Handlebars.compile('{{name}}')({name : response.responseText})+"</i>");
			setTimeout(function()
			{
				$ele.html('');
			}, 2000);
		}
	});
}


function saveAttachmentBlobKey(blobKey,fileName)
{
	var el = $("#uploadAttachmentForm");
	$("#uploadAttachmentModal").modal('hide');
	$('#emailForm').find('#eattachment').css('display','block');
	$('#emailForm').find('#attachment_id').find("#attachment_fname").text(fileName);
	$('#emailForm').find('#eattachment_key').attr('value',blobKey);
	$('#emailForm').find('#eattachment_key').attr('name',"blob_key");
	$('#emailForm').find('#attachment-select').find('option:first').attr('selected', 'selected');
	var el = $('#emailForm').find(".attachment-document-select");
	$('#emailForm').find(".attachment-document-select").css('display','none');
	$("#emailForm").find("#agile_attachment_name").val(fileName);
}

function documentsCollection(sortField)
{
	App_Documents.DocumentCollectionView = new Document_Collection_Events({ 
			url : 'core/api/documents',
			sort_collection : false ,
			templateKey : "documents",
			cursor : true,
			page_size : 20,
			individual_tag_name : 'tr',
			order_by : sortField,
			postRenderCallback : function(el)
			{
				includeTimeAgo(el);
				updateSortKeyTemplate(sortField, el);
				$('#documents_collection').html(documentscollection);
				$(".active").removeClass("active");
				$("#documentsmenu").addClass("active");
				
			}, appendItemCallback : function(el)
			{
				// To show timeago for models appended by infini scroll
				includeTimeAgo(el);
			} });

		App_Documents.DocumentCollectionView.collection.fetch();
		// Shows deals as list view
		var documentscollection = App_Documents.DocumentCollectionView.render().el;
}