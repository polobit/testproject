
var Ticket_Canned_Response = {

	cannedResponseCollection : undefined,

	fetchCollection: function(callback){

		if(this.cannedResponseCollection){
			if(callback)
				callback(this.cannedResponseCollection);

			return;

		}

		var cannedResponses = Backbone.Collection.extend({
		  url: '/core/api/tickets/canned-messages'
		});

		new cannedResponses().fetch({success: function(collection){

			console.log('cannedResponses collection length: ' + collection.length);
			Ticket_Canned_Response.cannedResponseCollection = collection;

			if(callback)
				callback(collection);
		}});
	},

	getCannedResponses: function(){

		if(!this.cannedResponseCollection || $.isEmptyObject(this.cannedResponseCollection))
			this.fetchCollection();

			return;
	}
};



function initTicketCannedResponseEvents(el){

	$('#canned-response-merge-fields', el).on("click", "li > a", function(e){

		var mergeField = $(this).attr('data-field-val');

		var refEle = $("#canned-response-message", el)

		refEle.val(refEle.val() + "{{" + mergeField +"}}");
	})

}