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
						if(dealModel && dealModel.collection){
							App_Deals.dealModel = dealModel;
							App_Deals.newMilestone = newMilestone;
							App_Deals.old_milestone = old_milestone;
							App_Deals.lost_reason_milesone_id = id;
							var milestone_model_view = new Base_Model_View({ url : '/core/api/milestone/'+dealModel.collection.get(id).get('pipeline_id'), template : "" });
							milestone_model_view.model.fetch({
								success: function(data){
									var jsonModel = data.toJSON();
									console.log("jsonModel.lost_milestone----"+jsonModel.lost_milestone);
									console.log("newMilestone----"+newMilestone);
									console.log("old_milestone----"+old_milestone);
									if(jsonModel.lost_milestone == newMilestone && newMilestone != old_milestone){
										console.log("Success if block");
										App_Deals.deal_lost_reason_for_update = "";
										populateLostReasons($('#dealLostReasonModal'), undefined);
										$('#deal_lost_reason',$('#dealLostReasonModal')).removeClass("hidden");
										$('#dealLostReasonModal > .modal-dialog > .modal-content > .modal-footer > a#deal_lost_reason_save').text('Save');
										$('#dealLostReasonModal > .modal-dialog > .modal-content > .modal-footer > a#deal_lost_reason_save').attr('disabled',false);
										$('#'+id).attr('data',newMilestone);
									}
									if(jsonModel.won_milestone == newMilestone && newMilestone != old_milestone){
										$('#deal_won_date_' + id).find('small').text(getDateInFormatFromEpoc(new Date().getTime()/1000));
										$('#deal_won_date_' + id).removeClass("hide");
									}else if(jsonModel.won_milestone != newMilestone && newMilestone != old_milestone){
										$('#deal_won_date_' + id).addClass("hide");
									}
									hideTransitionBar();
								}
							});
						}
						if(dealModel){
							update_milestone(dealModel, id, newMilestone, old_milestone,true, "");
						}
						$('#'+id).attr('data',newMilestone);
					
		        }
	    });

	});
}

/** 
 * To change the milestone of the deal when it is 
 * dropped in other milestone columns and saves or updates deal object.
 */
function update_milestone(data, id, newMilestone, oldMilestone, updateCollectionFlag, lost_reason_id){
	
	var DealJSON = data.toJSON();
	
	console.log(DealJSON);
	DealJSON.milestone = newMilestone;
	DealJSON.lost_reason_id = lost_reason_id;
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
			if (updateCollectionFlag) {
				update_deal_collection(model.toJSON(), id, newMilestone, oldMilestone);
			}
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


        if(oldMilestone != newMilestone){
	    var dealchangevalue = dealModel.expected_value;
        var olddealvalue = parseFloat($('#'+oldMilestone.replace(/ +/g, '')+'_totalvalue').text().replace(/\,/g,''))-parseFloat(dealchangevalue); 
        var newdealvalue = parseFloat($('#'+newMilestone.replace(/ +/g, '')+'_totalvalue').text().replace(/\,/g,''))+parseFloat(dealchangevalue);

   		$('#'+newMilestone.replace(/ +/g, '')+'_count').text(parseInt($('#'+newMilestone.replace(/ +/g, '')+'_count').text())+1);
		$('#'+oldMilestone.replace(/ +/g, '')+'_count').text(parseInt($('#'+oldMilestone.replace(/ +/g, '')+'_count').text())-1);

		$('#'+newMilestone.replace(/ +/g, '')+'_totalvalue').text(portlet_utility.getNumberWithCommasAndDecimalsForPortlets(newdealvalue));
		$('#'+oldMilestone.replace(/ +/g, '')+'_totalvalue').text(portlet_utility.getNumberWithCommasAndDecimalsForPortlets(olddealvalue));
		/* average of new deal total */
     	var avg_old_deal_size = 0;
     	var old_deal_count = parseInt($('#'+oldMilestone.replace(/ +/g, '')+'_count').text()) ; 
     	if(old_deal_count == 0)
     		avg_old_deal_size = 0;
     	else
     		avg_old_deal_size = olddealvalue / old_deal_count;
		 /* average of new deal total */
      	var avg_new_deal_size = 0;
     	var new_deal_count = parseInt($('#'+newMilestone.replace(/ +/g, '')+'_count').text()) ; 
     	if(new_deal_count == 0)
     		avg_new_deal_size = 0;
     	else
     		avg_new_deal_size = newdealvalue / new_deal_count;

     	olddealvalue = portlet_utility.getNumberWithCommasAndDecimalsForPortlets(olddealvalue) ;
        avg_old_deal_size =  portlet_utility.getNumberWithCommasAndDecimalsForPortlets(avg_old_deal_size);
        newdealvalue = portlet_utility.getNumberWithCommasAndDecimalsForPortlets(newdealvalue) ;
        avg_new_deal_size =  portlet_utility.getNumberWithCommasAndDecimalsForPortlets(avg_new_deal_size);

     	var oldheading = oldMilestone.replace(/ +/g, '');
     	var newheading = newMilestone.replace(/ +/g, '');
     	var symbol = getCurrencySymbolForCharts();

       
        $("#"+oldheading+" .dealtitle-angular").removeAttr("data");  
        $("#"+newheading+" .dealtitle-angular").removeAttr("data"); 
       
        var dealolddata = {"heading": oldheading ,"dealcount":olddealvalue ,"avgDeal" : avg_old_deal_size,"symbol":symbol,"dealNumber":old_deal_count};
		var dealOldDataString = JSON.stringify(dealolddata); 
		$("#"+oldheading+" .dealtitle-angular").attr("data" , dealOldDataString); 

        var dealnewdata = {"heading": newheading ,"dealcount":newdealvalue ,"avgDeal" : avg_new_deal_size,"symbol":symbol,"dealNumber":new_deal_count};
		var dealNewDataString = JSON.stringify(dealnewdata); 
		$("#"+newheading+" .dealtitle-angular").attr("data" , dealNewDataString);
        
        }
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
			            console.log('-----------'+$originals.eq(index).width());
			            $(this).css("background","#f5f5f5");
			            $(this).css("border-bottom","1px solid #ddd");
			          });
			          return $helper;
			      },
			      start: function(event, ui){
			    	  $.each(ui.item.children(),function(index,ele){
			    		  ui.helper.children().eq(index).width(ui.helper.children().eq(index).width()-$(this).width());
			    	  });
			    	  ui.helper.width(ui.helper.width());
			      },
			      sort: function(event, ui){
			    	  ui.helper.css("top",(ui.helper.offset().top+ui.item.offset().top)+"px");
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
