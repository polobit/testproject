var dealrelatedView;
var dealNotesView;
var dealActivitiesView;


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
		},
		
		load_deal_activities : function()
		{
		    var id = App_Deal_Details.dealDetailView.model.id;
		    dealActivitiesView = new Base_Collection_View({
	            url: '/core/api/opportunity/' + id + "/activities",
	            templateKey: "deal-detail-activities",
	            individual_tag_name: 'li',
	            sortKey:"created_time",
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
		
};
