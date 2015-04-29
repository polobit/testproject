var dealrelatedView;
var dealNotesView;
var dealActivitiesView;
var existingDealDocumentsView;

var deal_details_tab = {
		
		
		
		loadDealRelatedContactsView : function()
		{
			 var id = App_Deal_Details.dealDetailView.model.id;
			 if(id){
			dealrelatedView = new Base_Collection_View({
	            url: '/core/api/opportunity/' + id + "/related_to",
	            templateKey: "deal-related",
	            individual_tag_name: 'tr',
	            sortKey:"created_time",
	            cursor : true,
	            descending: true,
	            postRenderCallback: function(el) {
	            	
	            }
	        });
			dealrelatedView.collection.fetch();
	        $('#dealrelated').html(dealrelatedView.el);
			 }
		},
		load_deal_notes : function()
		{
		    var id = App_Deal_Details.dealDetailView.model.id;
		    if(id){
		    dealNotesView = new Base_Collection_View({
	            url: '/core/api/opportunity/' + id + "/notes",
	            restKey: "note",
	            templateKey: "deal-notes",
	            individual_tag_name: 'li',
	            sortKey:"created_time",
	            descending: true,
	            postRenderCallback: function(el) {
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	            		 $(".note-created-time", el).timeago();
	              	})
	            }
	        });
		    dealNotesView.collection.fetch();
	        $('#dealnotes').html(dealNotesView.el);
		    }
		},
		
		load_deal_docs : function()
		{
			 var id = App_Deal_Details.dealDetailView.model.id;
			 if(id){
			 dealDocsView = new Base_Collection_View({
		            url: '/core/api/documents/opportunity/' + id + "/docs",
		            restKey: "document",
		            templateKey: "deal-docs",
		            individual_tag_name: 'li',
		            sortKey:"uploaded_time",
		            descending: true,
		            postRenderCallback: function(el) {
		            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
		            		 $(".document-created-time", el).timeago();
		              	})
		            }
		        });
			 dealDocsView.collection.fetch();
		        $('#dealdocs').html(dealDocsView.el);
			 }
		},
		
		load_deal_activities : function()
		{
		    var id = App_Deal_Details.dealDetailView.model.id;
		    if(id){
		    dealActivitiesView = new Base_Collection_View({
	            url: '/core/api/opportunity/' + id + "/activities",
	            templateKey: "deal-detail-activities",
	            individual_tag_name: 'li',
	            scroll_symbol:'scroll',
	            sortKey:"time",
	            descending: true,
	            cursor : true,
	            page_size : 20,
	            postRenderCallback: function(el) {
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	            		 $(".note-created-time", el).timeago();
	              	})
	            }
	        });
		    dealActivitiesView.collection.fetch();
	        $('#dealactivities').html(dealActivitiesView.el);
		    }
		    }
		
};

//For updating document from contact-details
$(".document-edit-deal-tab").die().live('click', function(e){
	e.preventDefault();
	var id = $(this).attr('data');
	updateDocument(dealDocsView.collection.get(id));
});

// For unlinking document from contact-details
$(".document-unlink-deal-tab").die().live('click', function(e){
	e.preventDefault();
	var id = $(this).attr('data');
	var json = dealDocsView.collection.get(id).toJSON();
	
	// To get the contact id and converting into string
	var deal_id = App_Deal_Details.dealDetailView.model.id + "";
	
    // Removes the contact id from related to contacts
	json.deal_ids.splice(json.deal_ids.indexOf(deal_id),1);
	
	// Updates the document object and hides 
	var newDocument = new Backbone.Model();
	newDocument.url = 'core/api/documents';
	newDocument.save(json, {
		success : function(data) {
			dealDocsView.collection.remove(json);
			dealDocsView.render(true);
		}
	});
});

/**
 * For showing new/existing documents
 */
$(".add-deal-document-select").die().live('click', function(e){
	e.preventDefault();
	var el = $(this).closest("div");
	$(this).css("display", "none");
	el.find(".deal-document-select").css("display", "inline");
	var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
    fillSelect('document-select','core/api/documents', 'documents',  function fillNew()
	{
		el.find("#document-select").append("<option value='new'>Add New Doc</option>");

	}, optionsTemplate, false, el); 
});

/**
 * For adding existing document to current contact
 */
$(".add-deal-document-confirm").die().live('click', function(e){
	e.preventDefault();
	
    var document_id = $(this).closest(".deal-document-select").find("#document-select").val();

    var saveBtn = $(this);
	
		// To check whether the document is selected or not
    if(document_id == "")
    {
    	saveBtn.closest("span").find(".save-status").html("<span style='color:red;margin-left:10px;'>This field is required.</span>");
    	saveBtn.closest("span").find('span.save-status').find("span").fadeOut(5000);
    	return;
    }	    	
    else if(document_id == "new")
    {
    	var el = $("#uploadDocumentForm");
		$("#uploadDocumentModal").modal('show');
		
		// Contacts type-ahead
		agile_type_ahead("document_relates_to_contacts", el, contacts_typeahead);
		
		// Deals type-ahead
		agile_type_ahead("document_relates_to_deals", el, deals_typeahead, false,null,null,"core/api/search/deals",false, true);

    	var deal_json = App_Deal_Details.dealDetailView.model.toJSON();
    	var deal_name = deal_json.name;
    	$('.deal_tags',el).append('<li class="tag"  style="display: inline-block; vertical-align: middle; margin-right:3px;" data="'+ deal_json.id +'">'+deal_name+'</li>');
    }
    else if(document_id != undefined && document_id != null)
    {
		if(!existingDealDocumentsView)
		{
			existingDealDocumentsView = new Base_Collection_View({ 
				url : 'core/api/documents',
				restKey : "documents",
			});
			existingDealDocumentsView.collection.fetch({
			    success: function(data){
			    		existing_deal_document_attach(document_id, saveBtn);
			    	}
		        });
		}
		else
			existing_deal_document_attach(document_id, saveBtn);
    }

});

/**
 * To cancel the add documents request
 */
$(".add-deal-document-cancel").die().live('click', function(e){
	e.preventDefault();
	var el = $(this).closest("div");
	el.find(".deal-document-select").css("display", "none");
	el.find(".add-deal-document-select").css("display", "inline");
});

/** 
 * To attach the document to a contact
 * @param document_id
 * @param saveBtn
 */
function existing_deal_document_attach(document_id, saveBtn)
{
    var json = existingDealDocumentsView.collection.get(document_id).toJSON();
	
	// To get the contact id and converting into string
	var deal_id = App_Deal_Details.dealDetailView.model.id + "";
    
    // Checks whether the selected document is already attached to that contact
    if((json.deal_ids).indexOf(deal_id) < 0)
    {
    	json.deal_ids.push(deal_id);
    	saveDocument(null, null, saveBtn, false, json);
    }
    else
    {
    	saveBtn.closest("span").find(".save-status").html("<span style='color:red;margin-left:10px;'>Linked Already</span>");
    	saveBtn.closest("span").find('span.save-status').find("span").fadeOut(5000);
    	return;
    }
}
