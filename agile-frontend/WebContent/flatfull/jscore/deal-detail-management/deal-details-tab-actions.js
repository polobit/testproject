var dealrelatedView;
var dealNotesView;
var dealActivitiesView;
var existingDealDocumentsView;
var dealTasksView;
var dealEventsView;

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
		},

		load_deal_tasks : function()
		{
			 var id = App_Deal_Details.dealDetailView.model.id;
			 if(id){
			 dealTasksView = new Base_Collection_View({
		            url: '/core/api/opportunity/' + id + "/tasks",
		            restKey: "task",
		            templateKey: "deal-tasks",
		            individual_tag_name: 'li',
		            sortKey:"id",
		            descending: true,
		            postRenderCallback: function(el) {
		            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
		            		 $(".task-created-time", el).timeago();
		              	})
		              	$('li',el).each(function(){
		            		if($(this).find('.priority_type').text().trim()== "HIGH") {
		            			$(this).css("border-left","3px solid #f05050");
		            		}else if($(this).find('.priority_type').text().trim() == "NORMAL"){
		            			$(this).css("border-left","3px solid #7266ba");
		            		}else if($(this).find('.priority_type').text().trim() == "LOW") {
		            			$(this).css("border-left","3px solid #fad733");
		            		}
		            	});
		            }
		        });
			 dealTasksView.collection.fetch();
			 $('#dealtasks').html(dealTasksView.el);
			 }
		},

		load_deal_events : function()
		{
			var id = App_Deal_Details.dealDetailView.model.id;
			if(id){
			dealEventsView = new Base_Collection_View({
	            url: '/core/api/opportunity/' + id + "/events",
	            restKey: "event",
	            templateKey: "deal-events",
	            individual_tag_name: 'li',
	            sortKey:"created_time",
	            descending: true,
	            postRenderCallback: function(el) {
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	            		 $(".event-created-time", el).timeago();
	              	});
	            	$('li',el).each(function(){
	            	if($(this).find('.priority_type').text().trim() == "High") {
            			$(this).css("border-left","3px solid #f05050");
            		}else if($(this).find('.priority_type').text().trim() == "Normal"){
            			$(this).css("border-left","3px solid #7266ba");
            		}else if($(this).find('.priority_type').text().trim() == "Low") {
            			$(this).css("border-left","3px solid #fad733");
            		}
	            	});
	            }
	        });
			dealEventsView.collection.fetch();
	        $('#dealevents').html(dealEventsView.el);
			}
		},
		
};



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
