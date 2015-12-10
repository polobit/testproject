

$(function(){
	
	/**
	 * Shows deal popup  
	 */
	$('.deals-add').live('click', function(e) {
		e.preventDefault();
		show_deal();
	});
	
	/**
	 * Validates deal and saves
	 */
	$("#opportunity_validate").live('click', function(e){
		e.preventDefault();

    	// To know updated or added deal form names
    	var modal_id = $(this).closest('.opportunity-modal').attr("id");
    	var form_id = $(this).closest('.opportunity-modal').find('form').attr("id");
    	
       	var json = serializeForm(form_id);
       	json["custom_data"] = serialize_custom_fields(form_id);
       	
       	console.log(json);
       	if(form_id == "opportunityForm")
       		saveDeal(form_id, modal_id, this, json, false);
       	else
       		saveDeal(form_id, modal_id, this, json, true);
	});
	
	
	
	
	
	
	
	/**
	 * To avoid showing previous errors of the modal.
	 */
	$('#opportunityModal, #opportunityUpdateModal').on('show', function() {

		// Removes alert message of error related date and time.
		$('#' + this.id).find('.alert').css('display', 'none');

		// Removes error class of input fields
		$('#' + this.id).find('.error').removeClass('error');
	});
	
	$('#opportunityModal, #opportunityUpdateModal').on("shown", function(){
		
		
		// Add placeholder and date picker to date custom fields
		$('.date_input').attr("placeholder","MM/DD/YYYY");
    
		$('.date_input').datepicker({
			format: 'mm/dd/yyyy'
		});
	})
    
    
    /**
     * "Hide" event of note modal to remove contacts appended to related to field
     * and validation errors
     */ 
    $('#opportunityModal').on('hidden', function () {
    	
		// Removes appended contacts from related-to field
		$("#opportunityForm").find("li").remove();
		
		// Removes validation error messages
		remove_validation_errors('opportunityModal');
		
		// Removes note from deal form
		$('#opportunityModal #forNoteForm').html("");
		// Hide + Add note link
		$(".deal-add-note", $("#opportunityModal")).show();
		// Hide the Note label.
		$(".deal-note-label").hide();

    });
    
    /**
     * "Hide" event of note modal to remove contacts appended to related to field
     * and validation errors
     */ 
    $('#opportunityUpdateModal').on('hidden', function () {
		
    	// Removes appended contacts from related-to field
		$("#opportunityUpdateForm").find("li").remove();
		
		// Removes validation error messages
		remove_validation_errors('opportunityUpdateModal');
		
		// Removes note from deal form
		$('#opportunityUpdateModal #forNoteForm').html("");
		
		// Hide + Add note link
		$(".deal-add-note", $("#opportunityUpdateModal")).show();
		// Hide the Note label.
		$("#deal-note-label").hide();

    });
    
   /** 
    * Deal list view edit
    */
    $('#opportunities-model-list > tr > td:not(":first-child")').live('click', function(e) {
		e.preventDefault();
		$('.popover').remove();
		var currentdeal=$(this).closest('tr').data();
		Backbone.history.navigate("deal/"+currentdeal.id , {
            trigger: true
        });
	//	updateDeal($(this).closest('tr').data());
	});
    
    /**
     * Dash board edit
     */
	$('#dashboard-opportunities-model-list > tr').live('click', function(e) {
		e.preventDefault();
		var currentdeal=$(this).closest('tr').data();
		Backbone.history.navigate("deal/"+currentdeal.id , {
            trigger: true
        });
	});
	
	$('.milestones > li').live('mouseenter', function () {
		$(this).find('.deal-options').css("visibility","visible");
	});
	
	$('.milestones > li').live('mouseleave', function () {
		$(this).find('.deal-options').css("visibility","hidden");
	});
	
	/**
	 * Milestone view deal edit
	 */
	$('.deal-edit').live('click', function(e) {
		e.preventDefault();
        var id = $(this).closest('.data').attr('id');
        var milestone = ($(this).closest('ul').attr("milestone")).trim();
        var currentDeal;
        
        // Get the current deal model from the collection.
        var dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : milestone });
    	if(!dealPipelineModel)
    		return;
    	currentDeal = dealPipelineModel[0].get('dealCollection').get(id).toJSON();
        
		if(currentDeal)
        	updateDeal(currentDeal, true);
	});

	/**
	 * Milestone view deal delete
	 */
	$('.deal-delete').live('click', function(e) {
		e.preventDefault();
        if(!confirm("Are you sure you want to delete?"))
			return;
        
        var id = $(this).closest('.data').attr('id');
        var milestone = ($(this).closest('ul').attr("milestone")).trim();
        var id_array = [];
		var id_json = {};
		
		// Create array with entity id.
		id_array.push(id);
		
		// Set entity id array in to json object with key ids, 
		// where ids are read using form param
		id_json.ids = JSON.stringify(id_array);

        var that = this;
		$.ajax({
			url: 'core/api/opportunity/'+id,
			type: 'DELETE',
			success: function() {
				// Remove the deal from the collection and remove the UI element.
				var dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : milestone });
				if(!dealPipelineModel)
					return;
				dealPipelineModel[0].get('dealCollection').remove(dealPipelineModel[0].get('dealCollection').get(id));
				
				// Removes deal from list
				$(that).closest('li').css("display","none");
				
				// Shows Milestones Pie
				pieMilestones();
	
				// Shows deals chart
				dealsLineChart();
			}
		});
	});
	
	/**
	 * Update the milestones list when the pipeline is changed in the modal.
	 */
	$("#pipeline").live("change",function(e){
		var el = $(this).closest('form');
		$('#milestone',el).closest('div').find('.loading-img').show();
		// Fills milestone select element
		populateMilestones(el, undefined,$(this).val(), undefined, function(data){
			$("#milestone", el).html(data);
			$("#milestone", el).closest('div').find('.loading-img').hide();
		});
	});
	
	$("#opportunity_archive").die().live('click',function(e){
		e.preventDefault();
		$('#archived',$('#opportunityUpdateForm')).attr('checked','checked');
		$("#opportunityUpdateModal #opportunity_validate").trigger('click');
	});
	$("#opportunity_unarchive").die().live('click',function(e){
		e.preventDefault();
		$('#archived',$('#opportunityUpdateForm')).removeAttr('checked');
		$('#opportunityUpdateModal #opportunity_validate').trigger('click');
	});
	
	$('#deal-quick-archive').live('click', function(e) {
		e.preventDefault();
		
		// Returns, if the save button has disabled attribute
		if ($(this).attr('disabled'))
			return;

		// Disables save button to prevent multiple click event issues
		disable_save_button($(this));
		
		 var id = $("#archived-deal-id",$("#deal_archive_confirm_modal")).val();
	     var milestone = $("#archived-deal-milestone",$("#deal_archive_confirm_modal")).val();
	     var currentDeal;
	     var dealPipelineModel;
	        
	     // Get the current deal model from the collection.
	     if(Current_Route != 'deals'){
				currentDeal=App_Deal_Details.dealDetailView.model.toJSON();
			}else {
				dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : milestone });
			     if(!dealPipelineModel)
			    	return;
			    currentDeal = dealPipelineModel[0].get('dealCollection').get(id).toJSON();
			}

	     currentDeal.archived = true;
	    var that = $(this);
	        
	    var notes = [];
	    $.each(currentDeal.notes, function(index, note)
	    	{
	    		notes.push(note.id);
	    	});
	    currentDeal.notes = notes;
	    if(currentDeal.note_description)
	    	delete currentDeal.note_description;

	    if(!currentDeal.close_date || currentDeal.close_date==0)
	        currentDeal.close_date = null;
	        
	    currentDeal.owner_id = currentDeal.owner.id;
	        
	        var arch_deal = new Backbone.Model();
			arch_deal.url = '/core/api/opportunity';
			arch_deal.save(currentDeal, {
				// If the milestone is changed, to show that change in edit popup if opened without reloading the app.
				success : function(model, response) {
					//For deal details page.
					if(Current_Route != 'deals'){
						$("#deal_archive_confirm_modal").modal('hide');
						App_Deal_Details.dealDetailView.model = model;
						App_Deal_Details.dealDetailView.render(true)
						Backbone.history.navigate("deal/"+model.toJSON().id , {
				            trigger: true
				        });
						return;
					}
					
					// Remove the deal from the collection and remove the UI element.
					if(removeArchive(response)){
						dealPipelineModel[0].get('dealCollection').remove(dealPipelineModel[0].get('dealCollection').get(id));
						$('#'+id).parent().remove();
					}
					else{
						$('#'+id+' .deal-options').find('.deal-archive').remove();
						$('#'+id+' .deal-options').find('.deal-edit').remove();
						$('#'+id+' .deal-options').prepend('<a title="Restore" class="deal-restore" style="cursor:pointer;text-decoration:none;"> <i style="width: 0.9em!important;" class="icon-mail-reply"></i> </a>');
					}
					console.log('archived deal----',model);
					// Shows Milestones Pie
					pieMilestones();
					enable_save_button(that);
					$("#deal_archive_confirm_modal").modal('hide');
					// Shows deals chart
					dealsLineChart();
					update_deal_collection(model.toJSON(), id, milestone, milestone);
					
				}
			});
	});
	
	$('#deal-quick-restore').live('click', function(e) {
		e.preventDefault();
		
		 var id = $("#restored-deal-id",$("#deal_restore_confirm_modal")).val();
	     var milestone = $("#restored-deal-milestone",$("#deal_restore_confirm_modal")).val();
	     var currentDeal;
	     var dealPipelineModel;
	     
	     // Returns, if the save button has disabled attribute
		if ($(this).attr('disabled'))
			return;

		// Disables save button to prevent multiple click event issues
		disable_save_button($(this));
	        
		// Get the current deal model from the collection.
		if(Current_Route != 'deals'){
			currentDeal=App_Deal_Details.dealDetailView.model.toJSON();
		}else {
			dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : milestone });
			if(!dealPipelineModel)
				return;
			currentDeal = dealPipelineModel[0].get('dealCollection').get(id).toJSON();
		}
		
		currentDeal.archived = false;
		var that = $(this);
		
		var notes = [];
		$.each(currentDeal.notes, function(index, note)
		{
			notes.push(note.id);
		});
		currentDeal.notes = notes;
	    if(currentDeal.note_description)
			delete currentDeal.note_description;
	
	    if(!currentDeal.close_date || currentDeal.close_date==0)
	    	currentDeal.close_date = null;
	    currentDeal.owner_id = currentDeal.owner.id;
	    var arch_deal = new Backbone.Model();
		arch_deal.url = '/core/api/opportunity';
		arch_deal.save(currentDeal, {
			// If the milestone is changed, to show that change in edit popup if opened without reloading the app.
			success : function(model, response) {
				if(Current_Route != 'deals'){
					$("#deal_restore_confirm_modal").modal('hide');
					App_Deal_Details.dealDetailView.model = model;
					App_Deal_Details.dealDetailView.render(true)
					Backbone.history.navigate("deal/"+model.toJSON().id , {
			            trigger: true
			        });
					return;
				}
				
				// Remove the deal from the collection and remove the UI element.
				if(removeArchive(response)){
					dealPipelineModel[0].get('dealCollection').remove(dealPipelineModel[0].get('dealCollection').get(id));
					$('#'+id).parent().remove();
				}
				else{
					$('#'+id+' .deal-options').find('.deal-restore').remove();
					var htmllinks ='<a title="Archive" class="deal-archive" style="cursor:pointer;text-decoration:none;"> <i style="width: 0.9em!important;" class="icon-archive"></i> </a>';
					htmllinks += '<a title="Edit" class="deal-edit" style="cursor:pointer;text-decoration:none;"> <i style="width: 0.9em!important;" class="icon-pencil"></i> </a>';
					$('#'+id+' .deal-options').prepend(htmllinks);
				}
				console.log('archived deal----',model);
				// Shows Milestones Pie
				pieMilestones();
				enable_save_button(that);
				$("#deal_restore_confirm_modal").modal('hide');
				// Shows deals chart
				dealsLineChart();
				update_deal_collection(model.toJSON(), id, milestone, milestone);
				
			}
		});
		
		
	});
	
	
	/**
	 * Milestone view deal delete
	 */
	$('.deal-archive').live('click', function(e) {
		e.preventDefault();
		
		var temp = {};
		temp.id = $(this).closest('.data').attr('id');
		temp.milestone = ($(this).closest('ul').attr("milestone")).trim();
		$("#archived-deal-id",$("#deal_archive_confirm_modal")).val(temp.id);
		$("#archived-deal-milestone",$("#deal_archive_confirm_modal")).val(temp.milestone);
		$("#deal_archive_confirm_modal").modal('show');
	});
	
	/**
	 * Milestone view deal delete
	 */
	$('.deal-restore').live('click', function(e) {
		e.preventDefault();
		
		var temp = {};
		temp.id = $(this).closest('.data').attr('id');
		temp.milestone = ($(this).closest('ul').attr("milestone")).trim();
		$("#restored-deal-id",$("#deal_restore_confirm_modal")).val(temp.id);
		$("#restored-deal-milestone",$("#deal_restore_confirm_modal")).val(temp.milestone);
		$("#deal_restore_confirm_modal").modal('show');
	});
	
	$('#pipeline_milestone').live('change',function(e){
		var temp = $(this).val();
		var track = temp.substring(0,temp.indexOf('_'));
		var milestone = temp.substring(temp.indexOf('_')+1,temp.length+1);
		$(this).closest('form').find('#pipeline').val(track);
		$(this).closest('form').find('#milestone').val(milestone);
		console.log(track,'-----------',milestone);
	});
	
});

/**
 * Show deal popup for editing
 */ 
function updateDeal(ele, editFromMilestoneView)
{
	
	// Checking Whether the edit is from milestone view,
	// if it is we are passing JSON object so no need to convert
	var value = (editFromMilestoneView ? ele : ele.toJSON());

	add_recent_view(new BaseModel(value));
	
	var dealForm = $("#opportunityUpdateForm");
	
	$("#opportunityUpdateForm")[0].reset();
	
	deserializeForm(value, $("#opportunityUpdateForm"));
	
	$("#opportunityUpdateModal").modal('show');
	
	// Hide archive button, if the is already archived.
	if(value.archived){
		$('#opportunity_archive').hide();
		$('#opportunity_unarchive').show();
	}
	else{
		$('#opportunity_unarchive').hide();
		$('#opportunity_archive').show();
	}
	
	// Call setupTypeAhead to get contacts
	agile_type_ahead("relates_to", dealForm, contacts_typeahead);
	
	// Fills owner select element
	populateUsers("owners-list", dealForm, value, 'owner', function(data) {
				dealForm.find("#owners-list").html(data);
				if (value.owner) {
					$("#owners-list", dealForm).find('option[value=' + value['owner'].id + ']')
							.attr("selected", "selected");
					$("#owners-list", $("#opportunityUpdateForm")).closest('div').find('.loading-img').hide();
				}
	});
	
	// Fills the pipelines list in the select menu.
	populateTrackMilestones(dealForm, undefined, value, function(pipelinesList){

	});
	
	// Enable the datepicker
	$('#close_date', dealForm).datepicker({
		format : 'mm/dd/yyyy',
	});
	
	// Add notes in deal modal
	showNoteOnForm("opportunityUpdateForm", value.notes);
	
	add_custom_fields_to_form(value, function(data){
		var el = show_custom_fields_helper(data["custom_fields"], []);
	//	if(!value["custom_data"])  value["custom_data"] = [];
		$("#custom-field-deals", dealForm).html(fill_custom_fields_values_generic($(el), value["custom_data"]));
		
	}, "DEAL")
}

/**
 * Show new deal popup
 */ 
function show_deal(){
	
	var el = $("#opportunityForm");

	$("#opportunityModal").modal('show');
	
	add_custom_fields_to_form({}, function(data){
		var el_custom_fields = show_custom_fields_helper(data["custom_fields"], []);
		$("#custom-field-deals", $("#opportunityModal")).html($(el_custom_fields));
		
	}, "DEAL");
	
	
	
	// Fills owner select element
	populateUsers("owners-list", el, undefined, undefined, function(data){
		
		$("#opportunityForm").find("#owners-list").html(data);
		$("#owners-list", $("#opportunityForm")).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
		$("#owners-list", $("#opportunityForm")).closest('div').find('.loading-img').hide();
	});
	// Contacts type-ahead
	agile_type_ahead("relates_to", el, contacts_typeahead);

	// Fills the pipelines list in select box.
	populateTrackMilestones(el, undefined, undefined, function(pipelinesList){
		console.log(pipelinesList);
		$.each(pipelinesList,function(index,pipe){
			if(pipe.isDefault){
				var val = pipe.id+'_';
				if(pipe.milestones.length > 0)
				{
					val += pipe.milestones.split(',')[0];
					$('#pipeline_milestone',el).val(val);
					$('#pipeline',el).val(pipe.id);
					$('#milestone',el).val(pipe.milestones.split(',')[0]);
				}
					
			}
		});
	});
	
	

	// Enable the datepicker
	$('#close_date', el).datepicker({
		format : 'mm/dd/yyyy',
	});
}

function checkPipeline(pipeId){
	var presentPipe = 0;
	if(readCookie("agile_deal_track"))
		presentPipe = readCookie("agile_deal_track");
	
	if(presentPipe== pipeId)
		return true;
	return false;
}

function removeArchive(deal){
	var result = false;
	if(readCookie('deal-filters')){
		var arch = $.parseJSON(readCookie('deal-filters')).archived;
		if(arch == 'false' && deal.archived==true)
			return true;
		else if(arch=='true' && deal.archived==false)
			return true;
		else
			return false;
		
	}else 
	return result;
}

/**
 * Updates or Saves a deal
 */ 
function saveDeal(formId, modalId, saveBtn, json, isUpdate){
	// Returns, if the save button has disabled attribute
	if ($(saveBtn).attr('disabled'))
		return;

	// Disables save button to prevent multiple click event issues
	disable_save_button($(saveBtn));//$(saveBtn).attr('disabled', 'disabled');
	
	if (!isValidForm('#' + formId)) {
		var container = $('#' + formId).closest('.modal-body');
		var ele = $('#' + formId).find('.single-error').first();
		container.scrollTop(ele.offset().top - container.offset().top + container.scrollTop());
		// Removes disabled attribute of save button
		enable_save_button($(saveBtn));//$(saveBtn).removeAttr('disabled');
		return false;
	}

	// Shows loading symbol until model get saved
    // $('#' + modalId).find('span.save-status').html(getRandomLoadingImg());
if(json.close_date==0)
	json.close_date=null;
	var newDeal = new Backbone.Model();
	newDeal.url = 'core/api/opportunity';
	newDeal.save(json, {
		success : function(data) {

			// Removes disabled attribute of save button
			enable_save_button($(saveBtn));//$(saveBtn).removeAttr('disabled');

			//$('#' + modalId).find('span.save-status img').remove();
			$('#' + modalId).modal('hide');

			$('#' + formId).each(function() {
				this.reset();
			});
			
			var deal = data.toJSON();
			
			add_recent_view(new BaseModel(deal));
			
			// Updates data to timeline
			if (App_Contacts.contactDetailView
					&& Current_Route == "contact/"
							+ App_Contacts.contactDetailView.model.get('id')) {

				// Add model to collection. Disabled sort while adding and called
				// sort explicitly, as sort is not working when it is called by add
				// function
				
				
				/*
				 * Verifies whether the added deal is related to the contact in
				 * contact detail view or not
				 */
				$.each(deal.contacts, function(index, contact) {
					
					if (contact.id == App_Contacts.contactDetailView.model
							.get('id')) {
						
						

						if (dealsView && dealsView.collection)
						{
							if(deal.archived == true)
							{
								dealsView.collection.remove(deal.id);
								dealsView.collection.sort();
							}
							else if(dealsView.collection.get(deal.id))
							{
								dealsView.collection.get(deal.id).set(new BaseModel(deal));
							}
							else
							{
								dealsView.collection.add(new BaseModel(deal), { sort : false });
								dealsView.collection.sort();
							}
						}
						
							// Activates "Timeline" tab and its tab content in
							// contact detail view
							// activate_timeline_tab();
							add_entity_to_timeline(data);
							/*
							 * If timeline is not defined yet, initiates with the
							 * data else inserts
							 */
							return false;
					}
				});
			}
			// When deal is added or updated from Deals route
			else if (Current_Route == 'deals') {

				if(!readCookie("agile_deal_view")) {
					
					var newMilestone = deal.milestone;
					
					if (isUpdate)
					{
						
						var id = deal.id;
						var oldMilestone = $('#'+id).attr('data');
						//update_deal_collection(deal, id, newMilestone, oldMilestone);
						
						var dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : oldMilestone });
						if(!dealPipelineModel)
							return;
						dealPipelineModel[0].get('dealCollection').remove(dealPipelineModel[0].get('dealCollection').get(id));
						
						if(!checkPipeline(deal.pipeline_id)){
							console.log('removing the deal');
							$("#" + oldMilestone.replace(/ +/g, '')).find("#" + id).parent().remove();
							try{
								$('#'+oldMilestone.replace(/ +/g, '')+'_count').text(parseInt($('#'+oldMilestone.replace(/ +/g, '')+'_count').text())-1);
							} catch(err){
								console.log(err);
							}
						}else if(newMilestone != oldMilestone){
							
							dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : newMilestone });
							if(!dealPipelineModel)
								return;
							
							dealPipelineModel[0].get('dealCollection').add(copyCursor(dealPipelineModel,deal));
							$("#" + oldMilestone.replace(/ +/g, '')).find("#" + id).parent().remove();
							
							try{
								$('#'+newMilestone.replace(/ +/g, '')+'_count').text(parseInt($('#'+newMilestone.replace(/ +/g, '')+'_count').text())+1);
								$('#'+oldMilestone.replace(/ +/g, '')+'_count').text(parseInt($('#'+oldMilestone.replace(/ +/g, '')+'_count').text())-1);
							} catch(err){
								console.log(err);
							}
						}else {
							dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : newMilestone });
							if(!dealPipelineModel)
								return;
							
							dealPipelineModel[0].get('dealCollection').add(copyCursor(dealPipelineModel,deal), {silent:true});
							console.log('Updating html - ',deal);
							var dealsTemplate = 'deals-by-paging-model';
							
							if(!readCookie('deal-milestone-view')){
								dealsTemplate = 'deals-by-paging-relax-model';
							}
							$("#" + newMilestone.replace(/ +/g, '')).find("#" + id).parent().html(getTemplate(dealsTemplate, deal));
						}
						
						if(removeArchive(deal)){
							
							console.log('removing the deal when archived');
							$("#" + oldMilestone.replace(/ +/g, '')).find("#" + id).parent().remove();
							try{
								$('#'+oldMilestone.replace(/ +/g, '')+'_count').text(parseInt($('#'+oldMilestone.replace(/ +/g, '')+'_count').text())-1);
							} catch(err){
								console.log(err);
							}
						}
						
					} else if(checkPipeline(deal.pipeline_id)){
						var dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : newMilestone });
						if(!dealPipelineModel)
							return;
						var filterJSON = $.parseJSON(readCookie('deal-filters'));
						console.log(deal.owner.id.toString() != filterJSON.owner_id, deal.owner.id.toString(), filterJSON.owner_id);
						if(filterJSON.owner_id.length > 0 && deal.owner.id.toString() != filterJSON.owner_id)
							return;
						console.log(filterJSON.archived != 'all' && deal.archived != filterJSON.archived, deal.archived);
						if(filterJSON.archived){
							console.log(filterJSON.archived);
							if(filterJSON.archived != 'all' && deal.archived.toString() != filterJSON.archived)
								return;
						}
						
						dealPipelineModel[0].get('dealCollection').add(copyCursor(dealPipelineModel,deal));
						try{
							$('#'+newMilestone.replace(/ +/g, '')+'_count').text(parseInt($('#'+newMilestone.replace(/ +/g, '')+'_count').text())+1);
						} catch(err){
							console.log(err);
						}
					}
					includeTimeAgo($("#" + newMilestone.replace(/ +/g, '')));
					$('a.deal-notes').tooltip();
				}else 
				{
					if (isUpdate)
						 App_Deals.opportunityCollectionView.collection.remove(json);
					
						data.attributes.cursor = App_Deals.opportunityCollectionView.collection.last().toJSON().cursor;
						App_Deals.opportunityCollectionView.collection.add(data);
						App_Deals.opportunityCollectionView.render(true);
				}

			}
			else if (Current_Route==undefined || Current_Route=='dashboard') 
			{
				if(App_Portlets.currentPosition && App_Portlets.pendingDeals && App_Portlets.pendingDeals[parseInt(App_Portlets.currentPosition)]){
					if (isUpdate)
						App_Portlets.pendingDeals[parseInt(App_Portlets.currentPosition)].collection.remove(json);

					// Updates task list view
					if(json.milestone!="Won" && json.milestone!="Lost")
						App_Portlets.pendingDeals[parseInt(App_Portlets.currentPosition)].collection.add(data);

					App_Portlets.pendingDeals[parseInt(App_Portlets.currentPosition)].render(true);
				}
				if(App_Portlets.currentPosition && App_Portlets.dealsWon && App_Portlets.dealsWon[parseInt(App_Portlets.currentPosition)]){
					if (isUpdate)
						App_Portlets.dealsWon[parseInt(App_Portlets.currentPosition)].collection.remove(json);

					// Updates task list view
					App_Portlets.dealsWon[parseInt(App_Portlets.currentPosition)].collection.add(data);

					App_Portlets.dealsWon[parseInt(App_Portlets.currentPosition)].render(true);
				}

			}
			else {
				App_Deal_Details.dealDetailView.model = data;
				App_Deal_Details.dealDetailView.render(true)
				Backbone.history.navigate("deal/"+data.toJSON().id , {
		            trigger: true
		        });
					
					
					
			}
		},
		error : function(model,err){
			enable_save_button($(saveBtn));
			$('#' + modalId).find('span.error-status').html(err.responseText);
			setTimeout(function(){$('#' + modalId).find('span.error-status').html('');},2000);
			console.log('-----------------',err.responseText);
		}
	});
}