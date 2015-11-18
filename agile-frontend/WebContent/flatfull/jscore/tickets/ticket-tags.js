
var Ticket_Tags = {

	/**
	 * Shows a form to add tags with typeahead option
	 */ 
	showTagsField: function(){

		$('.show-tags-field').hide();
		$(".add-tags-form").show();

		$(".ticket-tags-typeahead").focus();
		this.initTagsTypeahead();
	},

	initTagsTypeahead: function(){

		var tags_list = [], $ele = $('.ticket-tags-typeahead');

		// Fetches tags collection, if no tags are exist (in TAGS) 
	    if(!TAGS){
			init_tags_collection();
			return;
	    }
	    
	    TAGS = tagsCollection.models;
	    
	    // Iterate TAGS to create tags_list (only with tag values)   
	    _(TAGS).each(function (item) { 
	        var tag = item.get("tag");
	        if ($.inArray(tag, tags_list) == -1) tags_list.push(tag);
	    });

	    // Turn off browser default auto complete
	    $ele.attr("autocomplete","off");

	    /**
	     * typeahead is activated to the input field, having the class "tags-typeahead" 
	     */
	    $ele.typeahead({
			
			/**
	    	 * Shows a drop down list of matched elements to the key, entered in the 
	    	 * input field (having the class "tags-typeahead") from the list of elements
	    	 * (tags_list) passed to the source method of typeahead
	    	 */
	    	source: function(query, process){
	    		process(tags_list);
	       	},

	       	updater: function(tag){
	    		
	    		if(!tag || (/^\s*$/).test(tag)){
	    			return;
	    		}
	    	
	    		tag = tag.trim();

	    		var old_tags = [];
       			$.each($('#ticket-tags-ul').children(), function(index, element){
       				old_tags.push($(element).attr('data'));
   				});

   				if ($.inArray(tag, old_tags) != -1)
   					return;

   				if(Current_Ticket_ID){
					Ticket_Tags.updateTag(tag, 'add', function(){
						$('#ticket-tags-ul').append(getTemplate('ticket-tag', {tag: tag}));
					});
				}
				else{
					$('#ticket-tags-ul').append(getTemplate('ticket-tag', {tag: tag}));
				}					
	    	}	
	    });	
	},

	removeTag: function(e){
		Ticket_Tags.updateTag($(e.target).attr('tag'), 'remove', function(){
			$(e.target).closest('li').remove();
		});
	},

	hideTicketTagField: function(e){

		if(!Current_Route || Current_Route == null || Current_Route.indexOf('new-ticket') == -1)
			return;
	},

	updateTag: function(tag, command, callback){

		if(!tag || !Current_Ticket_ID){
			if(callback)
					callback();

			return;	
		}
				
		var ticketModel = App_Ticket_Module.ticketView.model.toJSON();

		if(ticketModel.tags)
			ticketModel.tags.push(tag);
		else
			ticketModel.tags = new Array('tag');

		var newTicketModel = new BaseModel();
		newTicketModel.url = "/core/api/tickets/update-tags?command="+ command +"&tag=" + tag + '&id=' + Current_Ticket_ID;
		newTicketModel.save(ticketModel, 
			{
				success: function(model){

				 App_Ticket_Module.ticketView.model.set(model, {silent: true});

				if(callback)
					callback();
			}
		});
	}
};