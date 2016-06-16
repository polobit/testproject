/** 
 * To perform actions on deals arranged in milestones 
 * using sortable.js when it is dropped in middle or dragged over.
 */
var IS_DEAL_ARCHIVED = false;
var IS_DEAL_RESTORED = false;
var IS_DEAL_DELETED = false;
var DEAL_DRAG_EVENT = "";
var DEAL_DRAG_UI = "";
function setup_deals_in_milestones(id){
	var is_deal_drop_to_delete = false;
	var is_deal_drop_to_archive = false;
	var is_deal_drop_to_track = false;
	var is_deal_drop_to_restore = false;
	head.js(LIB_PATH + 'lib/jquery-ui.min.js', function() {
		$('ul.milestones').sortable({
		      connectWith : "ul",
		      cursor : "move",
		      containment : "#content" ,
		      scroll : false,
		      tolerance: "intersect",
		      start : function(event, ui) {
		      	$("#dealActions").css("top", (($(window).height() + window.scrollY) - $("#dealActions").height() - 70) + "px");
		      	if($("#deals-tracks").is(":visible"))
		      	{
		      		$(".move-deal-action").show();
		      	}
		      	else
		      	{
		      		$(".move-deal-action").hide();
		      	}
		      	if($(ui.item).find(".archived-deal").attr("data-archive") == "true")
		      	{
		      		$(".restore-deal-action", $('#dealActions')).show();
		      		$(".archive-deal-action", $('#dealActions')).hide();
		      	}
		      	else
		      	{
		      		$(".restore-deal-action", $('#dealActions')).hide();
		      		$(".archive-deal-action", $('#dealActions')).show();
		      	}
		      	$(".delete-deal-action", $('#dealActions')).show();
		      	$('#dealActions').show();
		      	is_deal_drop_to_delete = false;
		      	is_deal_drop_to_archive = false;
		      	is_deal_drop_to_track = false;
		      	$("#moving-deal").attr("data-heading", $(ui.item).closest("ul").attr("milestone"));
		      	$("#moving-deal").attr("data-pos", $(ui.item).attr("data-pos"));
		      	IS_DEAL_ARCHIVED = false;
				IS_DEAL_RESTORED = false;
				IS_DEAL_DELETED = false;
		      },
		      stop : function(event, ui) {
		      	if($("#deals-tracks").is(":visible"))
		      	{
		      		$(".move-deal-action").show();
		      	}
		      	else
		      	{
		      		$(".move-deal-action").hide();
		      	}
		      	$('#dealActions').hide();
		      },
		      // When deal is dragged to adjust the horizontal scroll
		      change : function(event, ui){
		      	  $(ui.item).attr("z-index", "-1");
		      	  var width = $('#' + id + ' > div').width();
		    	  var scrollX = $('#' + id + ' > div').scrollLeft();
		    	  if(event.pageX > (width * 0.9))
		    		  $('#' + id + ' > div').scrollLeft(scrollX + 10);
		    	  else if(event.pageX < (width * 0.1))
		    		  $('#' + id + ' > div').scrollLeft(scrollX - 15);
		      },
		      // When deal is dropped its milestone is changed 
		      update : function(event, ui) {
		      	  if(is_deal_drop_to_delete || is_deal_drop_to_archive || is_deal_drop_to_track || is_deal_drop_to_restore)
		      	  {
		      	  	return;
		      	  }
		      	  $('ul.milestones').sortable("disable");
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
		
		$('li.delete-deal-action').droppable({
			accept: ".deal-color",
			drop: function( event, ui ) {
				$("li.ui-sortable-placeholder").hide();
				$(ui.draggable).hide();
				is_deal_drop_to_delete = true;
				
				var id = $(ui.draggable).find('.data').attr('id');
				var milestone = ($(ui.draggable).closest('ul').attr("milestone")).trim();
				var dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : milestone });
				var id_array = [];
				var id_json = {};

				// Create array with entity id.
				id_array.push(id);

				// Set entity id array in to json object with key ids,
				// where ids are read using form param
				id_json.ids = JSON.stringify(id_array);

				var pos = $("#moving-deal").attr("data-pos");

				var that = this;

				if(dealPipelineModel)
		        {
		            if(!hasScope("MANAGE_DEALS"))
		            {
		                if(dealPipelineModel[0].get('dealCollection').get(id).get('owner').id != CURRENT_DOMAIN_USER.id)
		                {
		                    $('#deal_delete_privileges_error_modal').html(getTemplate("deal-delete-privileges-error-modal")).modal('show');
		                    return;
		                }
		                else
		                {
		                    showAlertModal("delete", "confirm", function(){
		                        deleteDeal(id, milestone, dealPipelineModel, that);
		                    }, function(){
		                    	if(!IS_DEAL_DELETED)
								{
									revertDeal(event, ui, pos);
								}
		                    });
		                    return;
		                }
		            }
		            else
		            {
		                showAlertModal("delete", "confirm", function(){
		                    deleteDeal(id, milestone, dealPipelineModel, that);
		                }, function(){
		                	if(!IS_DEAL_DELETED)
							{
								revertDeal(event, ui, pos);
							}
		                });
		                return;
		            }
		        }
		        else
		        {
		            showAlertModal("delete", "confirm", function(){
		                deleteDeal(id, milestone, dealPipelineModel, that);
		            }, function(){
		            	if(!IS_DEAL_DELETED)
						{
							revertDeal(event, ui, pos);
						}
		            });
		            return;
		        }
			}
		});
		$('li.archive-deal-action').droppable({
			accept: ".deal-color",
			drop: function( event, ui ) {
				$("li.ui-sortable-placeholder", $("#opportunity-listners")).hide();
				$(ui.draggable).hide();

				is_deal_drop_to_archive = true;
				var temp = {};
				temp.id = $(ui.draggable).find('.data').attr('id');
				temp.milestone = ($(ui.draggable).closest('ul').attr("milestone")).trim();
				$("#deal_archive_confirm_modal").html(getTemplate('archive-deal'));
				$("#archived-deal-id", $("#deal_archive_confirm_modal")).val(temp.id);
				$("#archived-deal-milestone", $("#deal_archive_confirm_modal")).val(temp.milestone);
				$("#deal_archive_confirm_modal").modal('show');

				var pos = $("#moving-deal").attr("data-pos");

				$('#deal_archive_confirm_modal').off('hidden.bs.modal');
				$('#deal_archive_confirm_modal').on('hidden.bs.modal', function(){
					if(!IS_DEAL_ARCHIVED)
					{
						revertDeal(event, ui, pos);
					}
				});
			}
		});

		$('li.restore-deal-action').droppable({
			accept: ".deal-color",
			drop: function( event, ui ) {
				$("li.ui-sortable-placeholder", $("#opportunity-listners")).hide();
				$(ui.draggable).hide();

				is_deal_drop_to_restore = true;
				var temp = {};
				temp.id = $(ui.draggable).find('.data').attr('id');
				temp.milestone = ($(ui.draggable).closest('ul').attr("milestone")).trim();
				$("#deal_restore_confirm_modal").html(getTemplate('restore-deal'));
				$("#restored-deal-id", $("#deal_restore_confirm_modal")).val(temp.id);
				$("#restored-deal-milestone", $("#deal_restore_confirm_modal")).val(temp.milestone);
				$("#deal_restore_confirm_modal").modal('show');

				var pos = $("#moving-deal").attr("data-pos");

				$('#deal_restore_confirm_modal').off('hidden.bs.modal');
				$('#deal_restore_confirm_modal').on('hidden.bs.modal', function(){
					if(!IS_DEAL_RESTORED)
					{
						revertDeal(event, ui, pos);
					}
				});
			}
		});

		$('li.move-deal-action').droppable({
			accept: ".deal-color",
			drop: function( event, ui ) {
				is_deal_drop_to_track = true;
				DEAL_DRAG_EVENT = event;
				DEAL_DRAG_UI = ui;
				$("#new-track-list-paging", $("#opportunity-listners")).show();
				$("#new-opportunity-list-paging", $("#opportunity-listners")).hide();
				$("#opportunities-header", $("#opportunity-listners")).hide();
				$("#moving-deal", $("#opportunity-listners")).html("<li>"+$(ui.draggable).html()+"</li>");
				var heading = $("#moving-deal").attr("data-heading").replace(/ +/g, '');
				var deal_id = $(ui.draggable).find("div:first").attr("id");
				var dealsCollection = DEALS_LIST_COLLECTION.collection.where({ heading : heading });
				if(dealsCollection)
				{
					var dealModel = dealsCollection[0].get("dealCollection").get(deal_id);
					$("#moved-deal").html("<li>Deal:</li><li><div class='text-ellipsis'>"+dealModel.get('name')+"</div></li>");
				}
				$(ui.draggable).remove();
				$("li.ui-sortable-placeholder").remove();
				if($("#deals-tracks").is(":visible"))
		      	{
		      		$(".move-deal-action").show();
		      	}
		      	else
		      	{
		      		$(".move-deal-action").hide();
		      	}
		      	$('#dealActions').hide();
			}
		});

	});
}

/** 
 * To change the milestone of the deal when it is 
 * dropped in other milestone columns and saves or updates deal object.
 */
function update_milestone(data, id, newMilestone, oldMilestone, updateCollectionFlag, lost_reason_id, update_count){
	
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
	if(DealJSON && DealJSON.owner)
	{
		DealJSON.owner_id = DealJSON.owner.id;
	}
   // Saving that deal object
	var up_deal = new Backbone.Model();
	up_deal.url = '/core/api/opportunity';
	up_deal.save(DealJSON, {
		// If the milestone is changed, to show that change in edit popup if opened without reloading the app.
		success : function(model, response) {
			console.log('moved deal----',model);
			if (updateCollectionFlag) {
				update_deal_collection(model.toJSON(), id, newMilestone, oldMilestone, update_count);
			}
			$('ul.milestones').sortable("enable");
		},
		error : function(model, response) {
			$('ul.milestones').sortable("enable");
			if(response && (response.responseText == "Deal not saved properly." || response.responseText == "Deal not updated properly." || response && response.status == 403)) {
				showModalConfirmation("Deals", response.responseText, function(element){
					App_Deals.deals();	
				},
				"",
				"", "Cancel", "");
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
function update_deal_collection(dealModel, id, newMilestone, oldMilestone, update_count) {
	
	// Remove the deal from the old milestone collection.
	var dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : oldMilestone });
	if(!dealPipelineModel)
		return;
	try{


        if(oldMilestone != newMilestone && update_count != false){
	    var dealchangevalue = dealModel.expected_value;
        var olddealvalue = parseFloat($('#'+oldMilestone.replace(/ +/g, '')+'_totalvalue').text().replace(/\,/g,''))-parseFloat(dealchangevalue); 
        var newdealvalue = parseFloat($('#'+newMilestone.replace(/ +/g, '')+'_totalvalue').text().replace(/\,/g,''))+parseFloat(dealchangevalue);

        if($('#'+newMilestone.replace(/ +/g, '')+'_count').text() != "1000+")
        {
        	if(parseInt($('#'+newMilestone.replace(/ +/g, '')+'_count').text())+1 > 1000)
        	{
        		$('#'+newMilestone.replace(/ +/g, '')+'_count').text(parseInt($('#'+newMilestone.replace(/ +/g, '')+'_count').text())+"+");
        	}
        	else
        	{
        		$('#'+newMilestone.replace(/ +/g, '')+'_count').text(parseInt($('#'+newMilestone.replace(/ +/g, '')+'_count').text())+1);
        	}
        }
   		if($('#'+oldMilestone.replace(/ +/g, '')+'_count').text() != "1000+")
   		{
   			$('#'+oldMilestone.replace(/ +/g, '')+'_count').text(parseInt($('#'+oldMilestone.replace(/ +/g, '')+'_count').text())-1);
   		}

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

        var dealTrack = $("#pipeline-tour-step").children('.filter-dropdown').text();
        $("#"+oldheading+" .dealtitle-angular").removeAttr("data");  
        $("#"+newheading+" .dealtitle-angular").removeAttr("data"); 
       
        var dealolddata = {"dealTrack": dealTrack,"heading": oldheading ,"dealcount":olddealvalue ,"avgDeal" : avg_old_deal_size,"symbol":symbol,"dealNumber":old_deal_count};
		var dealOldDataString = JSON.stringify(dealolddata); 
		$("#"+oldheading+" .dealtitle-angular").attr("data" , dealOldDataString); 

        var dealnewdata = {"dealTrack": dealTrack,"heading": newheading ,"dealcount":newdealvalue ,"avgDeal" : avg_new_deal_size,"symbol":symbol,"dealNumber":new_deal_count};
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

function revertDeal(event, ui, pos)
{
	var milestone_name = $(ui.draggable).find("div:first").attr("data");
	if(milestone_name)
	{
		var $visibleLiEle = $("#"+milestone_name.replace(/ +/g, '')+"-list-container").find("ul").find("li:visible");
		if($visibleLiEle.length > 0)
		{
			if($visibleLiEle.length == parseInt(pos))
			{
				$visibleLiEle.eq(parseInt(pos) - 1).after($(ui.draggable));
			}
			else
			{
				$visibleLiEle.eq(parseInt(pos)).before($(ui.draggable));
			}
		}
		else
		{
			$("#"+milestone_name.replace(/ +/g, '')+"-list-container").find("ul").append($(ui.draggable));
		}
		$("#"+milestone_name.replace(/ +/g, '')+"-list-container").find("ul").find("li").show();
	}
}
