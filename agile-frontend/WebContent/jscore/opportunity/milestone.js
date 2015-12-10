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
	
	$('#opportunity-track-list-model-list a.pipeline').live('click',function(e){
		e.preventDefault();
		createCookie("agile_deal_track", $(this).attr('id'));
		if(readCookie('deal-filters')){
			var json = $.parseJSON(readCookie('deal-filters'));
			var track = $(this).attr('id');
			if(track == '1')
				json.pipeline_id = '';
			else
				json.pipeline_id = $(this).attr('id');
			createCookie('deal-filters',JSON.stringify(json));
		}
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
		    $save_info = $('<img src="img/1-0.gif" height="18px" width="18px" style="opacity:0.5;"></img>&nbsp;&nbsp;<span><small class="text-success" style="font-size:15px; display:inline-block"><i>Email will be sent shortly.</i></small></span>');
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
	
	$('.add-pipeline').die().live('click',function(e){
		$('#pipelineForm input').val('');
		$('#pipelineForm input#milestones').val('New,Prospect,Proposal,Won,Lost');
		$('#pipelineModal').find('.save-status').html('');
	});
	
	
	$('.pipeline-edit').die().live('click',function(e){
		var id = $(this).attr('id');
		var json = App_Admin_Settings.pipelineGridView.collection.get(id).toJSON();
		deserializeForm(json,$('#pipelineForm'));
		
	});
	
	/**
	 * If Pipelined View is selected, deals are loaded with pipelined view and 
	 * creates the pipelined view cookie
	 */
	$('.pipeline-delete').die().live('click', function(e) {
		e.preventDefault();
		var id = $(this).attr('id');
		var name = $(this).attr('data');
		$('#track-name').text(name);
		// If Yes clicked
		$('#pipeline-delete-confirm').die().live('click',function(e){
			e.preventDefault();
			if($(this).attr('disabled'))
		   	     return;
			
			$(this).attr('disabled', 'disabled');
			var that = $(this);
			 // Shows message
		    $save_info = $('<img src="img/1-0.gif" height="18px" width="18px" style="opacity:0.5;"></img>&nbsp;&nbsp;<span><small class="text-success" style="font-size:15px; display:inline-block"><i>Deleting track.</i></small></span>');
		    $(this).parent('.modal-footer').find('.pipeline-delete-message').append($save_info);
			$save_info.show();
			// Export Deals.
			$.ajax({
				url: '/core/api/milestone/pipelines/'+id,
				type: 'DELETE',
				success: function() {
					console.log('Deleted!');
					$('#pipeline-delete-modal').modal('hide');
					if(readCookie("agile_deal_track") && readCookie("agile_deal_track") == id)
						eraseCookie("agile_deal_track");
					if(readCookie("deal-filters")){
						var json = $.parseJSON(readCookie("deal-filters"));
						if(json.pipeline_id = id)
							eraseCookie("deal-filters");
					}
					
					App_Admin_Settings.milestones();
				},
				error : function(jqXHR, status, errorThrown){
					console.log(jqXHR);
					$('#pipeline-delete-modal').find('.pipeline-delete-message').text(jqXHR.responseText);
					that.removeAttr('disabled');
				}
			});
		});
		

	});

	// Admin Settings milestone list
	/**
	 * To remove the milestone from list.
	 */
	$(".milestone-delete").die().live('click', function(e){
		e.preventDefault();
		if (!confirm("Are you sure you want to delete ?" ))
			return;
		$(this).closest('tr').css("display", "none");
		fill_ordered_milestone($(this).closest('form').attr('id'));
	});
	
	/**
	 * Shows input field to add new milestone.
	 */
    $(".show_milestone_field").die().live('click', function(e){
    	e.preventDefault();
    	var form = $(this).closest('form');
    	console.log('New Milestone to - ',form.attr('id'));
    	$(this).closest("div").css("display","none");
    	form.find('.show_field').css("display","block");
    	form.find(".add_new_milestone").focus();
    });
    
    /**
	 * Adds new milestone to the sortable list.
	 */
    $(".add_milestone").die().live('click', function(e){
    	
    	e.preventDefault();
    	var form = $(this).closest('form');
    	var new_milestone = form.find(".add_new_milestone").val().trim();

    	if(!new_milestone || new_milestone.length <= 0 || !(/^[a-zA-Z0-9-_ ]*$/).test(new_milestone))
		{
    		$('#milestone-error-modal').modal('show');
			return;
		}
    	form.find('.show_field').css("display","none");
    	form.find(".show_milestone_field").closest("div").css("display","inline-block");
    	
    	if(!new_milestone || new_milestone.length <= 0 || (/^\s*$/).test(new_milestone))
		{
			return;
		}
    	
    	// To add a milestone when input is not empty
    	if(new_milestone != "")
    	{
    		e.preventDefault();
    	
    		// Prevents comma (",") as an argument to the input field
    		form.find(".add_new_milestone").val("");
        	
    		var milestone_list = form.find('tbody');
    		var add_milestone = true;
    		
    		// Iterate over already present milestones, to check if this is a new milestone
    		milestone_list.find('tr').each(function(index, elem){
    			if($(elem).is( ":visible") && elem.getAttribute('data').toLowerCase() == new_milestone.toLowerCase())
    			{
    				add_milestone = false; // milestone exists, don't add
    				return false;
    			}
    		});
    		
    		if(add_milestone)
    		{
    			milestone_list.append("<tr data='"+new_milestone+"' style='display: table-row;'><td><div class='p-l-sm' style='display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:80%'>"+new_milestone+"</div></td><td><div class='m-b-n-xs' style='display:none;'><a class='text-l-none-hover c-p'><i title='Drag' class='icon-move'></i></a><a class='milestone-delete' style='cursor: pointer;margin-left:10px; text-decoration: none;' data-toggle='modal' role='button' href='#'><i title='Delete Milestone' class='task-action icon icon-trash'></i></a></div></td></tr>");
    	//		milestone_list.append("<li data='" + new_milestone + "'><div><span>" + new_milestone + "</span><a class='milestone-delete right' href='#'>&times</a></div></li>");
    			fill_ordered_milestone(form.attr('id'));
    		}
    	}
    });
    $(".add_new_milestone").die().live("keypress",function(e){
    	if(e.keyCode == 13)
    	{
    		var form = $(this).closest("form");
    		form.find(".add_milestone").click();
    	}
    });
    
    $(".save-pipelines").die().live('click', function(e){
    	e.preventDefault();
    	
    	$('#admin-settings-milestones-model-list').find('form').each(function(index){
    		var mile = serializeForm($(this).attr('id'));
        	console.log('---------',mile);
        	// Saving that pipeline object
        	var pipeline = new Backbone.Model();
        	pipeline.url = '/core/api/milestone';
        	pipeline.save(mile, {
        		// If the milestone is changed, to show that change in edit popup if opened without reloading the app.
        		success : function(model, response) {
        			App_Admin_Settings.milestones();
        		},
				error: function(data,response){
					console.log(response);
				}
        	});
    	});
    	
    });
    
    $("#pipeline_validate").die().live('click', function(e){
    	e.preventDefault();
    	
    	// Returns, if the save button has disabled attribute
    	if ($(this).attr('disabled'))
    		return;

    	// Disables save button to prevent multiple click event issues
    	disable_save_button($(this));//$(saveBtn).attr('disabled', 'disabled');
    	
    	if (!isValidForm('#pipelineForm')) {
    		// Removes disabled attribute of save button
    		enable_save_button($(this));//$(saveBtn).removeAttr('disabled');
    		return false;
    	}
    	
    	var mile = serializeForm('pipelineForm');
    	console.log(mile);
    	// Saving that pipeline object
    	var pipeline = new Backbone.Model();
    	pipeline.url = '/core/api/milestone/pipelines';
    	pipeline.save(mile, {
    		// If the milestone is changed, to show that change in edit popup if opened without reloading the app.
    		success : function(model, response) {
    			// Removes disabled attribute of save button
    			enable_save_button($(this));
    			$('#pipelineModal').modal('hide');
    			App_Admin_Settings.milestones();
    	    	
    		},
			error: function(data,response){
				console.log(response,data);
				$('#pipelineModal').find('.save-status').html('<span style="color:red;">'+response.responseText+'</span>');
				setTimeout(function(){$('#pipelineModal').find('.save-status').html('');}, 5000);
				enable_save_button($("#pipeline_validate"));
			}
    	});
    	
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
					var id = ui.item[0].children[0].id;
						console.log('paging...',id);
						var old_milestone = $('#'+id).attr('data');
						console.log('old...',old_milestone);
						var dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : old_milestone });
						if(!dealPipelineModel)
							return;
						var dealModel = dealPipelineModel[0].get('dealCollection').get(id);
						var newMilestone = ($('#'+id).closest('ul').attr("milestone")).trim();
						console.log('new...',newMilestone);
						update_milestone(dealModel, id, newMilestone, old_milestone);
						$('#'+id).attr('data',newMilestone);
					
		        }
	    });

	});
}

/** 
 * To change the milestone of the deal when it is 
 * dropped in other milestone columns and saves or updates deal object.
 */
function update_milestone(data, id, newMilestone, oldMilestone){
	
	var DealJSON = data.toJSON();
	
	console.log(DealJSON);
	DealJSON.milestone = newMilestone;
	// Replace notes object with note ids
	var notes = [];
	$.each(DealJSON.notes, function(index, note)
	{
		notes.push(note.id);
	});
	
	console.log(notes);
	
	DealJSON.notes = notes;
	if(DealJSON.note_description)
		delete DealJSON.note_description;
	
	 if(!DealJSON.close_date || DealJSON.close_date==0)
		 DealJSON.close_date = null;
	 DealJSON.owner_id = DealJSON.owner.id;
   // Saving that deal object
	var up_deal = new Backbone.Model();
	up_deal.url = '/core/api/opportunity';
	up_deal.save(DealJSON, {
		// If the milestone is changed, to show that change in edit popup if opened without reloading the app.
		success : function(model, response) {
			console.log('moved deal----',model);
			update_deal_collection(model.toJSON(), id, newMilestone, oldMilestone);
		}
	});

}

/**
 * Update the deals in the collection when user drag and drops.
 * @param dealModel 
 * 			updated deal model.
 * @param id 
 * 			id of the updated deal.
 * @param newMilestone
 * 			milestone where user drop the deal.
 * @param oldMilestone 
 * 			milestone from user drag the deal.
 */
function update_deal_collection(dealModel, id, newMilestone, oldMilestone) {
	
	// Remove the deal from the old milestone collection.
	var dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : oldMilestone });
	if(!dealPipelineModel)
		return;
	try{
		$('#'+newMilestone.replace(/ +/g, '')+'_count').text(parseInt($('#'+newMilestone.replace(/ +/g, '')+'_count').text())+1);
		$('#'+oldMilestone.replace(/ +/g, '')+'_count').text(parseInt($('#'+oldMilestone.replace(/ +/g, '')+'_count').text())-1);
	} catch(err){
		console.log(err);
	}
	
	dealPipelineModel[0].get('dealCollection').remove(dealPipelineModel[0].get('dealCollection').get(id));

	// Add the deal in to new milestone collection.
	dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : newMilestone });
	if(!dealPipelineModel)
		return;

	dealPipelineModel[0].get('dealCollection').add(copyCursor(dealPipelineModel, dealModel), { silent : true });
}

/**
 * Sets milestones as sortable list.
 */
function setup_milestones(el){
	head.js(LIB_PATH + 'lib/jquery-ui.min.js', function() {
		$(el).find('tbody').each(function(index){
			var id = $(this).closest('form').find('input[name="id"]').val();
			$(this).sortable({
			      containment : "#milestone-values-"+id,
			      items:'tr',
			      helper: function(e, tr){
			          var $originals = tr.children();
			          var $helper = tr.clone();
			          $helper.children().each(function(index)
			          {
			            // Set helper cell sizes to match the original sizes
			            $(this).width($originals.eq(index).width());
			            $(this).css("background","#f5f5f5");
			            $(this).css("border-bottom","1px solid #ddd");
			          });
			          return $helper;
			      },
			      forceHelperSize:true,
			      placeholder:'<tr><td></td></tr>',
			      forcePlaceholderSize:true,
			      handle: ".icon-move",
			      cursor: "move",
			      tolerance: "intersect",
			      
			      // When milestone is dropped its input value is changed 
			      update : function(event, ui) {
			    	  console.log($(ui.item).attr('data'));
			    	  fill_ordered_milestone($(ui.item).closest('form').attr('id'));
			        }
		    });
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
function fill_ordered_milestone(formId){
   	var values;
   	$('#'+formId).find("tbody").find("tr").each(function(index, data) { 
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

   	$("#"+formId).find( 'input[name="milestones"]' ).val(values); 
   	$('#admin-settings-milestones-model-list').find('form').each(function(index){
		var mile = serializeForm($(this).attr('id'));
    	console.log('---------',mile);
    	App_Admin_Settings.pipelineGridView.collection.get(mile.id).set('milestones',mile.milestones, {silent:true});
    	// Saving that pipeline object
    	var pipeline = new Backbone.Model();
    	pipeline.url = '/core/api/milestone';
    	pipeline.save(mile);
	});
}
