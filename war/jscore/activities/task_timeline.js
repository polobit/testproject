var notesView;
var eventsView;
var documentsView;

var task_details_tab = {
		load_timeline : function()
		{
			$('div.tab-content', App_Tasks.taskDetailView.el).find('div.active').removeClass('active');
			
			$('#time-line', App_Tasks.taskDetailView.el).addClass('active');
			if($("#timeline", App_Tasks.taskDetailView.el).hasClass('isotope'))
			{
				$("#timeline", App_Task.taskDetailView.el).isotope( 'reLayout', function(){} )
				return;
			}
				load_timeline_details(App_Tasks.taskDetailView.el, App_Tasks.taskDetailView.model.get('id'));
		},
		
		// loades notes on time line
		load_notes : function()
		{
		    var id = App_Tasks.taskDetailView.model.id;
		    notesView = new Base_Collection_View({
	            url: '/core/api/contacts/' + id + "/notes",
	            restKey: "note",
	            templateKey: "notes",
	            individual_tag_name: 'li',
	            sortKey:"created_time",
	            descending: true,
	            postRenderCallback: function(el) {
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	            		 $(".note-created-time", el).timeago();
	              	})
	            }
	        });
	        notesView.collection.fetch();
	        $('#notes', App_Contacts.contactDetailView.el).html(notesView.el);
		},
		
		
		load_events : function()
		{
			var id = App_Contacts.contactDetailView.model.id;
			eventsView = new Base_Collection_View({
	            url: '/core/api/contacts/' + id + "/events",
	            restKey: "event",
	            templateKey: "contact-events",
	            individual_tag_name: 'li',
	            sortKey:"created_time",
	            descending: true,
	            postRenderCallback: function(el) {
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	            		 $(".event-created-time", el).timeago();
	              	})
	            }
	        });
			eventsView.collection.fetch();
	        $('#events', App_Contacts.contactDetailView.el).html(eventsView.el);
		},
		load_documents : function()
		{
			 id = App_Contacts.contactDetailView.model.id;
			 documentsView = new Base_Collection_View({
		            url: '/core/api/documents/' + id + "/docs",
		            restKey: "document",
		            templateKey: "contact-documents",
		            individual_tag_name: 'li',
		            sortKey:"uploaded_time",
		            descending: true,
		            postRenderCallback: function(el) {
		            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
		            		 $(".document-created-time", el).timeago();
		              	})
		            }
		        });
			    documentsView.collection.fetch();
		        $('#documents', App_Contacts.contactDetailView.el).html(documentsView.el);
		}
};
