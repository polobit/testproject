var milestoneTemplate;
var milestoneCollection;

function setup_milestones(el){
	if(!milestoneCollection)
		{
			var MilestoneCollection = Backbone.Collection.extend({
				url : '/core/api/milestone',
				sortKey: 'milestone'
			});
			milestoneCollection = new MilestoneCollection();
			milestoneCollection.fetch({
		        success: function () {
		        	milestoneTemplate = getTemplate('Milestonelist', milestoneCollection.toJSON());
		        	
		            $(el).html(milestoneTemplate);
		        }
		    });
		    return;
		
		}
	$(el).html(milestoneTemplate);
}

/*    	var deals_by_milestones_collection = new Backbone.Collection();
deals_by_milestones_collection.url = "core/api/opportunity/byMilestone"

// Fetches the deals by milestones
	deals_by_milestones_collection.fetch({

	success : function(data) {
		 console.log(data.toJSON());
		this.dealByMilestonesCollection = data.toJSON();
	}
});*/

//setup_milestones($("#milestonelist"));
/*<script id="Milestonelist-template" type="text/html">
{{#milestone_element this}}{{/milestone_element}}
</script>*/


$(function(){
	
	// If default view is selected, deals are loaded with default view and
	// removes the view cookie set when view is selected
	$('.deals-default-view').die().live('click', function(e) {
		e.preventDefault();

		// Erases the cookie
		eraseCookie("agile_deal_view");
		
		// Loads the deals
		App_Deals.deals();

	});
	
	// If Pipelined View is selected, deals are loaded with pipelined view and
	// creates the pipelined view cookie 
	$('.deals-pipelined-view').die().live('click', function(e) {
		e.preventDefault();

		// Creates the cookie
		createCookie("agile_deal_view", "pipelined_view");

		// Loads the deals
		App_Deals.deals();

	});
});

function setup_deals_in_milestones(){
	head.js(LIB_PATH + 'lib/jquery-ui.min.js', function() {
		$('ul.milestones').sortable({
		      connectWith: "ul",
		      cursor: "move",
		      containment: "#opportunities-by-milestones-model-list > div",
		      scrollSensitivity : 10,
		      scroll:true,
		      change:function(event, ui){
		      	$('#opportunities-by-milestones-model-list > div').scrollLeft($(this).position().left);
		      },
		      update: function(event, ui) {
					var id = ui.item[0].id;
					var DealJSON = App_Deals.opportunityCollectionView.collection.get(id).toJSON();
					var oldMilestone = DealJSON.milestone;
					var newMilestone = ($(this).closest('ul').attr("milestone")).trim();
						if(newMilestone != oldMilestone)
							update_milestone(App_Deals.opportunityMilestoneCollectionView.collection.models[0], id, newMilestone, oldMilestone);
		        }
	    });

	});
}

function update_milestone(data, id, newMilestone, oldMilestone){
	//App_Deals.opportunityMilestoneCollectionView.collection.remove(data);
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

	var up_deal = new Backbone.Model();
	up_deal.url = '/core/api/opportunity';
	up_deal.save(DealJSON, {
		success : function(model, response) {
			App_Deals.opportunityCollectionView.collection.remove(DealJSON);
			App_Deals.opportunityCollectionView.collection.add(model);
			App_Deals.opportunityCollectionView.render();
		}
	});

}
