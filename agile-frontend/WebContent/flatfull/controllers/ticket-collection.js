/**
 * Ticket Router with callbacks
 */
var TicketCollectionRouter = Backbone.Router.extend({
	routes : {

		/* Tickets */
		"tickets" : "tickets",
	},

	/**
	 * Shows list of Tickets
	 */
	tickets : function() {

		this.ticketsCollection = new Base_Collection_View({
			url : '/core/api/tickets?status=NEW',
			// restKey : "workflow",
			//sort_collection : false,
			templateKey : "ticket",
			individual_tag_name : 'tr',
			cursor : true,
			page_size : 20,
			slateKey : "no-tickets",
			postRenderCallback : function(el) {
				
			}
		});

		this.ticketsCollection.collection.fetch();

		$("#content").html(this.ticketsCollection.el);
	},

});