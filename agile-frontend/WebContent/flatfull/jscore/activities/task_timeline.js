var notesView;
var contactRelatedView;
var taskActivitiesView;
var task_details_tab = {
				load_timeline : function()
				{
								$('div.tab-content', App_Tasks.taskDetailView.el).find('div.active').removeClass('active');

								$('#time-line', App_Tasks.taskDetailView.el).addClass('active');
								if ($("#timeline", App_Tasks.taskDetailView.el).hasClass('isotope'))
								{
												$("#timeline", App_Task.taskDetailView.el).isotope('reLayout', function()
												{
												})
												return;
								}
								load_timeline_details(App_Tasks.taskDetailView.el, App_Tasks.taskDetailView.model.get('id'));
				},

				// loades notes on time line
				load_notes : function()
				{
								var id = taskDetailView.id;
								notesView = new Base_Collection_View({ url : '/core/api/tasks/' + id + "/notes", restKey : "note", templateKey : "task_notes",
												individual_tag_name : 'li', sortKey : "created_time", descending : true, postRenderCallback : function(el)
												{
																head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
																{
																				$(".note-created-time", el).timeago();
																})
												} });
								notesView.collection.fetch();
								$('#task_tab_detail').find('#notes').html(notesView.el);
				},

				loadTaskRelatedContactsView : function()
				{
								var id = taskDetailView.id;
								contactRelatedView = new Base_Collection_View({ url : '/core/api/tasks/' + id + "/contacts", templateKey : "task-related", individual_tag_name : 'tr',
												sortKey : "created_time", descending : true, postRenderCallback : function(el)
												{

												} });
								contactRelatedView.collection.fetch();
								$('#task_tab_detail').find('#contacts').html(contactRelatedView.el);
				},

				loadActivitiesView : function()
				{
								var taskJSON = taskDetailView.toJSON();
								var domainUserId = taskJSON.domain
								taskActivitiesView = new Base_Collection_View({ url : '/core/api/activitylog/getActivityByEntityId?entity_id='+taskJSON.id+'', templateKey : "task-related-activity",
												individual_tag_name : 'li',sortKey : "time", descending : true,cursor : true, page_size : 25 });
								taskActivitiesView.collection.fetch();
								$('#task_tab_detail').find('#activity').html(taskActivitiesView.el);

				} };
