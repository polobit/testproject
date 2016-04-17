/**
 * Ticket Router with callbacks
 */
var TicketMacroRouter = Backbone.Router.extend({
	routes : {

		/* Macros */
		"macros" : "macros",
		"macro-add" : "macroAdd",
		"macro-edit/:id" : "macroEdit"

	},

	/**
	 * Shows all the macros list
	 */
	macros : function() {

		this.macrosCollection = new Base_Collection_View({
			url : '/core/api/ticket/macros',
			// restKey : "workflow",
			sort_collection : false,
			templateKey : "ticket-macros",
			individual_tag_name : 'tr',
			cursor : true,
			page_size : 20,
			slateKey : "ticket-macros",
			postRenderCallback : function(el) {
				head.js(LIB_PATH + 'lib/jquery.timeago.js', function() {
					$("time.macro-created-time", el).timeago();

				});

			}
		});

		this.macrosCollection.collection.fetch();

		$("#content").html(this.macrosCollection.el);

	},

	/**
	 * To add new macro
	 */
	macroAdd : function() {

		// Get macro default model Data
		var macro_template_model = Backbone.Model.extend({
			url : 'misc/ticket-templates/macro_template.jsp'
		});

		var model = new macro_template_model();

		model.fetch({
			success : function(data) {
				App_Ticket_Macros.constructMacroAddEditTemplate(model);
			}
		});

	},

	/**
	 * Edit macro
	 */
	macroEdit : function(id) {

		try {

			// Get model
			var macroModel = this.macrosCollection.collection.get(id);

			// Convert actions String to object
			macroModel.set("actions", JSON.parse(macroModel.toJSON().actions))

			this.constructMacroAddEditTemplate(macroModel);

		} catch (e) {

			this.navigate("macros", {
				trigger : true
			});
			return;
		}

	},

	constructMacroAddEditTemplate : function(macroModel) {

		this.macroModelview = new Base_Model_View({
			url : '/core/api/ticket/macros',
			template : "ticket-macro-add-edit",
			isNew : true,
			model : macroModel,
			window : "macros",
			errorCallback : function(response) {
				alert(response.responseText);
			},
			postRenderCallback : function(el) {

				initializeTicketMacroListeners(el);

			}

		});

		$("#content").html(this.macroModelview.render().el);

	}

});