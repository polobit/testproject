var dealNotesView;
var dealComapanyView; 
var loadDealRelatedContactsView;
var load_deal_timeline;


var deal_details_tab = {
		
		
		load_deal_timeline : function()
		{
			
		    var id = App_Deal_Details.dealDetailView.model.id;
		    dealTimelineView = new Base_Collection_View({
	            url: '/core/api/opportunity/activities/' + id,
	            templateKey: "deal-notes",
	            individual_tag_name: 'li',
	            sortKey:"created_time",
	            descending: true,
	            cursor:true,
	            page_size : 20,
	            postRenderCallback: function(el) {
	            	
	            }
	        });
		    dealTimelineView.collection.fetch();
			
				load_deal_timeline_details(App_Deal_Details.dealDetailView.el, App_Deal_Details.dealDetailView.model.get('id'));
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
		loadDealRelatedContactsView : function()
		{
			 var id = App_Deal_Details.dealDetailView.model.id;
			dealrelatedView = new Base_Collection_View({
	            url: '/core/api/opportunity/' + id + "/related_to",
	            templateKey: "deal-related",
	            individual_tag_name: 'tr',
	            sortKey:"created_time",
	            descending: true,
	            postRenderCallback: function(el) {
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	            		 $(".note-created-time", el).timeago();
	              	})
	            }
	        });
			dealrelatedView.collection.fetch();
			console.log(dealrelatedView.collection.fetch());
	        $('#dealrelated').html(dealrelatedView.el);
		}
};
