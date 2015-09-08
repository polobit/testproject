/**
 * workflows.js is a script file having routes for CRU operations of workflows
 * and triggers.
 * 
 * @module Webpages
 * 
 */
var WebpagesRouter = Backbone.Router
		.extend({
			routes : {

				/* webpages */
				"webpages" : "webpages",
				"webpage-add" : "webpageAdd",
				"webpage/:id" : "webpageEdit",

			},

			/**
			 * 
			 * Gets workflows list.Sets page-size to 10, so that initially
			 * workflows are 10. Cursor is true, when scrolls down , the
			 * workflows list increases.
			 */
			webpages : function() {

				this.webpages_list_view = new Base_Collection_View({
					url : '/core/api/webpages',
					restKey : "webpage",
					sort_collection : false,
					templateKey : "webpages",
					individual_tag_name : 'tr',
					cursor : true,
					page_size : 20,
					postRenderCallback : function(el) {
						head.js(LIB_PATH + 'lib/jquery.timeago.js', function() {
							$("time.webpage-created-time", el).timeago();

						});

						start_tour(undefined, el);

					},
					appendItemCallback : function(el) {
						$("time.webpage-created-time", el).timeago();

					}
				});

				this.webpages_list_view.collection.fetch();

				$('#content').html(this.webpages_list_view.el);

				$(".active").removeClass("active");
				$("#webpagesmenu").addClass("active");
			},

			/**
			 * Saves new workflow.After workflow saved,the page should navigate
			 * to workflows list.
			 */
			webpageAdd : function() {
				if (!this.webpages_list_view
						|| !this.webpages_list_view.collection) {
					this.navigate("webpages", {
						trigger : true
					});
					return;
				}

				/* Reset the designer JSON */
				this.webpage_json = undefined;
				this.webpage_model = undefined;

				getTemplate('webpage-add', {"is_new" : true}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	
					initiate_tour("webpages-add", $('#content'));
				}, "#content");
			},

			/**
			 * Updates existing workflow. After workflow updated, the page
			 * navigates to workflows list
			 * 
			 * @param id
			 *            Workflow Id
			 */
			webpageEdit : function(id, webpage) {

				if (!this.webpages_list_view
						|| this.webpages_list_view.collection.length == 0) {
					this.navigate("webpages", {
						trigger : true
					});
					return;
				}

				/* Set the designer JSON. This will be deserialized */
				if (webpage)
					this.webpage_model = webpage;
				else
					this.webpage_model = this.webpages_list_view.collection
							.get(id);

				// Download new one if undefined
				if (this.webpage_model === undefined) {
					console.log("Downloading webpage.");

					// get count value from first attribute count
					var total_count = this.webpages_list_view.collection.at(0).attributes.count;

					if (this.webpages_list_view.collection.length !== total_count) {
						// if not in the collection, download new one.
						var new_webpage_model = Backbone.Model.extend({
							url : '/core/api/webpages/' + id
						});

						var model = new new_webpage_model();
						model.id = id;

						model.fetch({
							success : function(data) {
								// Call workflowEdit again if not Empty
								if (!$.isEmptyObject(data.toJSON())) {
									App_Webpages.webpageEdit(id, model);
									return;
								}
							}
						});
					}
				}

				if (this.webpage_model === undefined)
					return;

				this.webpage_json = this.webpage_model.get("rules");
				var that = this;
				getTemplate('webpage-add', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					var el = $('#content').html($(template_ui));	
					// Set the name
					$('#name').val(that.webpage_model.get("name"));
				}, "#content");
			},

		});
