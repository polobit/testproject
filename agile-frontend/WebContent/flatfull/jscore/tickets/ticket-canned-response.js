//Ticket_Canned_Response allows you to fetch canned responses collection from DB.
var Ticket_Canned_Response = {

	cannedResponseCollection : undefined,

	//Fetches canned responses collection from DB. Returns same collection 
	//if collection already exists.
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

	//If canned responses collection. If collection don't exists then it fetches 
	//from server and returns.
	// getCannedResponses: function(){

	// 	if(!this.cannedResponseCollection || $.isEmptyObject(this.cannedResponseCollection))
	// 		this.fetchCollection();

	// 		return;
	// }
};

//Initializes click event on recommendations. When user click on canned response 
//textarea will be filled with selected canned message
function initTicketCannedResponseEvents(el){

	$('#canned-response-merge-fields', el).on("click", "li > a", function(e){

		var mergeField = $(this).attr('data-field-val');

		var refEle = $("#canned-response-message", el)

		refEle.val(refEle.val() + "{{" + mergeField +"}}");
	})
}