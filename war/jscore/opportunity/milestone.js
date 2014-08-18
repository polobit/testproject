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
	/**
	 * If Pipelined View is selected, deals are loaded with pipelined view and 
	 * creates the pipelined view cookie
	 */
	$('.deals-export-csv').die().live('click', function(e) {
		e.preventDefault();

		console.log('Exporting ...');
		var deals_csv_modal = $(getTemplate('deals-export-csv-modal'),{});
		deals_csv_modal.modal('show');
		
		// If Yes clicked
		$('#deals-export-csv-confirm').die().live('click',function(e){
			e.preventDefault();
			if($(this).attr('disabled'))
		   	     return;
			
			$(this).attr('disabled', 'disabled');
			
			 // Shows message
		    $save_info = $('<img src="img/1-0.gif" height="18px" width="18px"></img>&nbsp;&nbsp;<span><small class="text-success" style="font-size:15px; display:inline-block"><i>Email will be sent shortly.</i></small></span>');
		    $(this).parent('.modal-footer').find('.deals-export-csv-message').append($save_info);
			$save_info.show();
			// Export Deals.
			$.ajax({
				url: '/core/api/opportunity/export',
				type: 'GET',
				success: function() {
					console.log('Exported!');
					deals_csv_modal.modal('hide');
				}
			});
		});
		

	});
	
	/**
	 * Full screen view
	 */
	$('#deals-full-screen').live('click', function(e){
		e.preventDefault();
		
		// Creates the cookie
		createCookie("agile_full_view", "full_view");
		
		// Loads the deals
		App_Deals.deals();

    });
	
	/**
	 * Small screen view
	 */
	$('#deals-small-screen').die().live('click', function(e) {
		e.preventDefault();

		// Erases the cookie
		eraseCookie("agile_full_view");

		// Loads the deals
		App_Deals.deals();

	});

	// Admin Settings milestone list
	/**
	 * To remove the milestone from list.
	 */
	$(".milestone-delete").die().live('click', function(e){
		e.preventDefault();
		$(this).closest('li').css("display", "none");
		fill_ordered_milestone();
	});
	
	/**
	 * Shows input field to add new milestone.
	 */
    $("#show_milestone_field").die().live('click', function(e){
    	e.preventDefault();
    	$(this).css("display","none");
    	$('.show_field').css("display","block");
    	$("#add_new_milestone").focus();
    });
    
	/**
	 * Adds new milestone to the sortable list.
	 */
    $("#add_milestone").die().live('click', function(e){
    	
    	e.preventDefault();
    	$('.show_field').css("display","none");
    	$("#show_milestone_field").css("display","block");
    	
    	var new_milestone = $("#add_new_milestone").val().trim();
    	
    	if(!new_milestone || new_milestone.length <= 0 || (/^\s*$/).test(new_milestone))
		{
			return;
		}

    	// To add a milestone when input is not empty
    	if(new_milestone != "")
    	{
    		e.preventDefault();
    	
    		// Prevents comma (",") as an argument to the input field
    		$("#add_new_milestone").val("");
        	
    		var milestone_list = $(this).closest(".control-group").find('ul.milestone-value-list');
    		var add_milestone = true;
    		
    		// Iterate over already present milestones, to check if this is a new milestone
    		milestone_list.find('li').each(function(index, elem){
    			if($(elem).is( ":visible") && elem.getAttribute('data').toLowerCase() == new_milestone.toLowerCase())
    			{
    				add_milestone = false; // milestone exists, don't add
    				return false;
    			}
    		});
    		
    		if(add_milestone)
    		{
    			milestone_list.append("<li data='" + new_milestone + "'><div><span>" + new_milestone + "</span><a class='milestone-delete right' href='#'>&times</a></div></li>");
    			fill_ordered_milestone();
    		}
    	}
    });
    
});


/** 
 * To perform actions on deals arranged in milestones 
 * using sortable.js when it is dropped in middle or dragged over.
 */
function setup_deals_in_milestones(id){
	head.js(LIB_PATH + 'lib/jquery-ui.min.js', function() {
		$('ul.milestones').sortable({
		      connectWith : "ul",
		      cursor : "move",
		      containment : "#" + id ,
		      scroll : false,
		      // When deal is dragged to adjust the horizontal scroll
		      change : function(event, ui){
		    	  var width = $('#' + id + ' > div').width();
		    	  var scrollX = $('#' + id + ' > div').scrollLeft();
		    	  if(event.pageX > (width * 0.9))
		    		  $('#' + id + ' > div').scrollLeft(scrollX + 10);
		    	  else if(event.pageX < (width * 0.1))
		    		  $('#' + id + ' > div').scrollLeft(scrollX - 15);
		      },
		      // When deal is dropped its milestone is changed 
		      update : function(event, ui) {
		    	  console.log(">>>>>>>>>>>>>>>>>> deals id");
		    	  console.log(ui);
		    	  console.log(ui.item[0]);
		    	  console.log(ui.item[0].id);
					var id = ui.item[0].id;
					
					var modelJSON = App_Deals.opportunityMilestoneCollectionView.collection.models[0];
			
					for(var j in modelJSON.attributes)
					{
						var milestone = modelJSON.attributes[j];
						for(var i in milestone)
						{
							if(milestone[i].id == id)
							{
								var DealJSON = milestone[i];
								var newMilestone = ($(this).closest('ul').attr("milestone")).trim();

								var oldMilestone = DealJSON.milestone;
								// Checks current milestone is different from previous
								if(newMilestone != oldMilestone)
									update_milestone(modelJSON, id, newMilestone, oldMilestone);
								return;
							}
						}
					}
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
			// App_Deals.opportunityMilestoneCollectionView.render(true);
		}
	});

}

/**
 * Sets milestones as sortable list.
 */
function setup_milestones(){
	head.js(LIB_PATH + 'lib/jquery-ui.min.js', function() {
		$('ul.milestone-value-list').sortable({
		      containment : "#milestone-values",
		      // When milestone is dropped its input value is changed 
		      update : function(event, ui) {
		    	  fill_ordered_milestone();
		        }
	    });
	});
}

/**
 * To capitalize and trim the given string 
 */
function capitalize_string(str){
	str = str.trim().replace(/\b[a-z]/g, function(x) {
  		    return x.toUpperCase();
  		});
	return str;
}

/**
 * Edits the value of milestone when sorted or added new or removes milestone.
 */
function fill_ordered_milestone(){
   	var values;
   	$.each($("ul.milestone-value-list").children(), function(index, data) { 
   		if($(data).is( ":visible"))
   		{
   			// To capitalize the string
   	   		if(values != undefined)
   	   			values = values + "," + capitalize_string(($(data).attr("data")).toString());
   	   		else 
   	   			values = capitalize_string(($(data).attr("data")).toString());
   		}
	});
   	
   	// To remove the ending "," if present
   	if(values && values.charAt((values.length)-1) == ",")
   		values = values.slice(0, -1);

   	$("#milestonesForm").find( 'input[name="milestones"]' ).val(values); 
}
