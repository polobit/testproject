$(function(){
	
	/**
	 * If default view is selected, deals are loaded with default view and 
	 * removes the view cookie set when view is selected
	 */ 
	$('.deals-list-view').die().live('click', function(e) {
		e.preventDefault();
		
		// Creates the cookie
		createCookie("agile_deal_view", "list_view");
		
		// Loads the deals
		App_Deals.deals();

	});
	
	/**
	 * If Pipelined View is selected, deals are loaded with pipelined view and 
	 * creates the pipelined view cookie
	 */
	$('.deals-pipelined-view').die().live('click', function(e) {
		e.preventDefault();

		// Erases the cookie
		eraseCookie("agile_deal_view");

		// Loads the deals
		App_Deals.deals();

	});
});

/** 
 * To perform actions on deals arranged in milestones 
 * using sortable.js when it is dropped in middle or dragged over.
 */
function setup_deals_in_milestones(){
	head.js(LIB_PATH + 'lib/jquery-ui.min.js', function() {
		$('ul.milestones').sortable({
		      connectWith : "ul",
		      cursor : "move",
		      containment : "#opportunities-by-milestones-model-list",
		      scroll : false,
		      // When deal is dragged to adjust the horizontal scroll
		      change : function(event, ui){
		    	  var width = $('#opportunities-by-milestones-model-list > div').width();
		    	  var scrollX = $('#opportunities-by-milestones-model-list > div').scrollLeft();
		    	  if(event.pageX > (width * 0.9))
		    		  $('#opportunities-by-milestones-model-list > div').scrollLeft(scrollX + 10);
		    	  else if(event.pageX < (width * 0.1))
		    		  $('#opportunities-by-milestones-model-list > div').scrollLeft(scrollX - 15);
		      },
		      // When deal is dropped its milestone is changed 
		      update : function(event, ui) {
					var id = ui.item[0].id;
					var DealJSON = App_Deals.opportunityCollectionView.collection.get(id).toJSON();
					var oldMilestone = DealJSON.milestone;
					var newMilestone = ($(this).closest('ul').attr("milestone")).trim();
						// Checks current milestone is different from previous
						if(newMilestone != oldMilestone)
							update_milestone(App_Deals.opportunityMilestoneCollectionView.collection.models[0], id, newMilestone, oldMilestone);
		        }
	    });

	});
}

/** 
 * To change the milestone of the deal when it is 
 * dropped in other milestone columns and saves or updates deal object.
 */
function update_milestone(data, id, newMilestone, oldMilestone){
	// Updates the collection without reloading
	var milestone = data.get(oldMilestone);
	var DealJSON;
	for(var i in milestone)
	{
		if(milestone[i].id == id)
		{
			milestone[i].owner_id = milestone[i].owner.id;
			milestone[i].milestone = newMilestone;
			data.get(newMilestone).push(milestone[i]);
			DealJSON = milestone[i];
			milestone.splice(i, 1);
		}
	}
   // Saving that deal object
	var up_deal = new Backbone.Model();
	up_deal.url = '/core/api/opportunity';
	up_deal.save(DealJSON, {
		// If the milestone is changed, to show that change in edit popup if opened without reloading the app.
		success : function(model, response) {
			App_Deals.opportunityCollectionView.collection.remove(DealJSON);
			App_Deals.opportunityCollectionView.collection.add(model);
			App_Deals.opportunityCollectionView.render(true);
		}
	});

}
