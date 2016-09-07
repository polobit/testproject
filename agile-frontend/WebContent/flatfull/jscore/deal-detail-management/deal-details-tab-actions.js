var dealrelatedView;
var dealNotesView;
var dealActivitiesView;
var existingDealDocumentsView;
var dealTasksView;
var dealEventsView;
var dealDetailMode = 'activity' ;

var deal_details_tab = {
		
		
		
		loadDealRelatedContactsView : function()
		{	
			$('#deal-tab-content').find('.change-deal-activity').remove();
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
	            	contactListener();
	            	
	            }
	        });
			dealrelatedView.collection.fetch();
	        $('#dealrelated').html(dealrelatedView.el);
			 }
		},
		load_deal_notes : function()
		{	
			$('#deal-tab-content').find('.change-deal-activity').remove();
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
	            	agileTimeAgoWithLngConversion($(".note-created-time", el));
	            	
	            }
	        });
		    dealNotesView.collection.fetch();
	        $('#dealnotes').html(dealNotesView.el);
		    }
		},
		
		load_deal_docs : function()
		{	
			$('#deal-tab-content').find('.change-deal-activity').remove();
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
		            	agileTimeAgoWithLngConversion($(".document-created-time", el));
		            	
		            }
		        });
			 dealDocsView.collection.fetch();
		        $('#dealdocs').html(dealDocsView.el);
			 }
		},
		
		load_deal_activities : function()
		{
			
			if(dealDetailMode && dealDetailMode == 'timeline'){
				$('#deal-tab-content').find('.change-deal-activity').remove();
				$('#dealactivities').empty();
				$('#deal-tab-content').prepend('<a class="btn btn-default btn-sm change-deal-activity" data="activity" style="float:right;margin-right:20px;">Activity Mode</a>');
				$('#dealactivities').append('<div class="m-auto"><div id="timeline" style="float:left; z-index:1;"><div id="line-container"><div id="line"></div></div></div></div>');
				$('#dealactivities').addClass('active');
				var id = App_Deal_Details.dealDetailView.model.id;
				if(id){
				    if($("#timeline", App_Deal_Details.dealDetailView.el).hasClass('isotope'))
				    {
				    	$("#timeline", App_Deal_Details.dealDetailView.el).isotope('reloadItems');
				    	return;
				    }				    	
					var builder = new GetTimelineBuilder("deal-timeline", App_Deal_Details.dealDetailView, App_Deal_Details.dealDetailView.model, "#timeline")
					builder.timeline(id, function(){
						$.getJSON('/core/api/opportunity/' + id + '/activities?page_size=100', function(data){
							builder.addEntities(data);
						})
					});	
				}
			}
			else{
			    var id = App_Deal_Details.dealDetailView.model.id;
			    $('#deal-tab-content').find('.change-deal-activity').remove();
			    $('#deal-tab-content').prepend('<a class="btn btn-default btn-sm change-deal-activity" data="timeline" style="float:right;margin-right:20px;">Timeline Mode</a>');
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
		},

		load_deal_tasks : function()
		{	
			$('#deal-tab-content').find('.change-deal-activity').remove();
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
		            	agileTimeAgoWithLngConversion($(".task-created-time", el));
		            	
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
			$('#deal-tab-content').find('.change-deal-activity').remove();
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
	            	agileTimeAgoWithLngConversion($(".event-created-time", el));
	            	
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
    	var linkedtext = _agile_get_translated_val("misc-keys", "link-already");
    	saveBtn.closest("span").find(".save-status").html("<span style='color:red;margin-left:10px;'>" + linkedtext + "</span>");
    	saveBtn.closest("span").find('span.save-status').find("span").fadeOut(5000);
    	return;
    }
}
