$(function()
{


	/**
	 * To avoid showing previous errors of the modal.
	 */
	$('#opportunityModal, #opportunityUpdateModal').on('show.bs.modal', function()
	{

		// Removes alert message of error related date and time.
		$('#' + this.id).find('.alert').css('display', 'none');

		// Removes error class of input fields
		$('#' + this.id).find('.error').removeClass('error');
	});

	$('#opportunityModal, #opportunityUpdateModal').on("shown.bs.modal", function()
	{

		// Add placeholder and date picker to date custom fields
		$('.date_input').attr("placeholder","Select Date");
    
		$('.date_input').datepicker({
			format: CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY
		}).datepicker('update');

		$("input.date").each(function(index, ele){$(ele).datepicker('update');});
	})

	/**
	 * "Hide" event of note modal to remove contacts appended to related to
	 * field and validation errors
	 */
	$('#opportunityModal').on('hidden.bs.modal', function()
	{

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
	 * "Hide" event of note modal to remove contacts appended to related to
	 * field and validation errors
	 */
	$('#opportunityUpdateModal').on('hide.bs.modal', function()
	{

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
	 * Dash board edit
	 */
	$('body').on('click', '#dashboard-opportunities-model-list > tr', function(e){
		e.preventDefault();
		var currentdeal = $(this).closest('tr').data();
		Backbone.history.navigate("deal/" + currentdeal.id, { trigger : true });
		// updateDeal($(this).closest('tr').data());
	});
  
	$('body').on('click', '#deal-quick-archive', function(e)
					{
						e.preventDefault();

						// Returns, if the save button has disabled attribute
						if ($(this).attr('disabled'))
							return;

						// Disables save button to prevent multiple click event
						// issues
						disable_save_button($(this));

						var id = $("#archived-deal-id", $("#deal_archive_confirm_modal")).val();
						var milestone = $("#archived-deal-milestone", $("#deal_archive_confirm_modal")).val();
						var currentDeal;
						var dealPipelineModel;

						// Get the current deal model from the collection.
						if (Current_Route != 'deals')
						{
							currentDeal = App_Deal_Details.dealDetailView.model.toJSON();
						}
						else
						{
							dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : milestone });
							if (!dealPipelineModel)
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
						if (currentDeal.note_description)
							delete currentDeal.note_description;

						if (!currentDeal.close_date || currentDeal.close_date == 0)
							currentDeal.close_date = null;

						if(currentDeal && currentDeal.owner)
						{
							currentDeal.owner_id = currentDeal.owner.id;
						}

						var arch_deal = new Backbone.Model();
						arch_deal.url = '/core/api/opportunity';
						arch_deal
								.save(
										currentDeal,
										{
										// If the milestone is changed, to show
										// that change in edit popup if opened
										// without reloading the app.
										success : function(model, response)
										{
											// For deal details page.
											if (Current_Route != 'deals')
											{
												$("#deal_archive_confirm_modal").modal('hide');
												App_Deal_Details.dealDetailView.model = model;
												App_Deal_Details.dealDetailView.render(true)
												$('body').removeClass("modal-open");
												Backbone.history.navigate("deal/" + model.toJSON().id, { trigger : true });
												return;
											}

											// Remove the deal from the
											// collection and remove the UI
											// element.
											if (removeArchive(response))
											{
												dealPipelineModel[0].get('dealCollection').remove(dealPipelineModel[0].get('dealCollection').get(id));
												$('#' + id).parent().remove();
											}
											else
											{
												$('#' + id + ' .deal-options').find('.deal-archive').remove();
												$('#' + id + ' .deal-options').find('.deal-edit').remove();
												$('#' + id + ' .deal-options')
														.prepend(
																'<a title="Restore" class="deal-restore" style="cursor:pointer;text-decoration:none;"> <i style="width: 0.9em!important;" class="icon-mail-reply"></i> </a>');
											}
											console.log('archived deal----', model);
											// Shows Milestones Pie
											pieMilestones();
											enable_save_button(that);
											$("#deal_archive_confirm_modal").modal('hide');
											var arch_deal_value = model.attributes.expected_value;
											var oldMilestone = model.attributes.milestone;
											try
						                    {

                        					    var olddealvalue = parseFloat($('#'+oldMilestone.replace(/ +/g, '')+'_totalvalue').text().replace(/\,/g,''))-parseFloat(arch_deal_value); 
                         			            $('#'+oldMilestone.replace(/ +/g, '')+'_totalvalue').text(portlet_utility.getNumberWithCommasAndDecimalsForPortlets(olddealvalue));
                        
											 	$('#' + oldMilestone.replace(/ +/g, '') + '_count').text(parseInt($('#' + oldMilestone.replace(/ +/g, '') + '_count').text()) - 1);
												/* average of new deal total */
										     	var avg_deal_size = 0;
										     	var deal_count = parseInt($('#' + oldMilestone.replace(/ +/g, '') + '_count').text()) ; 
										     	if(deal_count == 0)
										     		avg_old_deal_size = 0;
										     	else
										     		avg_old_deal_size = olddealvalue / deal_count;

										     	olddealvalue = portlet_utility.getNumberWithCommasAndDecimalsForPortlets(olddealvalue) ;
										        avg_old_deal_size =  portlet_utility.getNumberWithCommasAndDecimalsForPortlets(avg_old_deal_size);
										        var dealTrack = $("#pipeline-tour-step").children('.filter-dropdown').text();
										     	var oldheading = oldMilestone.replace(/ +/g, '');
										     	var symbol = getCurrencySymbolForCharts();
												var dealdata = {"dealTrack":dealTrack ,"heading": oldheading ,"dealcount":olddealvalue ,"avgDeal" : avg_old_deal_size,"symbol":symbol,"dealNumber":deal_count};
												var dealDataString = JSON.stringify(dealdata) ; 
												$("#"+oldheading+" .dealtitle-angular").removeAttr("data");
												$("#"+oldheading+" .dealtitle-angular").attr("data" , dealDataString ); 

											}
											catch (err)
											{
											console.log(err);
											}
											// Shows deals chart
											dealsLineChart();
											update_deal_collection(model.toJSON(), id, milestone, milestone);

										},error : function(model, err)
										{
											enable_save_button(that);
											$("#deal_archive_confirm_modal").find('span.error-status').html('<div class="inline-block"><p class="text-base" style="color:#B94A48;"><i>'+err.responseText+'</i></p></div>');
											setTimeout(function()
											{
												$("#deal_archive_confirm_modal").find('span.error-status').html('');
											}, 2000);
											console.log('-----------------', err.responseText);
										} });
					});

	$('body').on('click', '#deal-quick-restore', function(e)
					{
						e.preventDefault();

						var id = $("#restored-deal-id", $("#deal_restore_confirm_modal")).val();
						var milestone = $("#restored-deal-milestone", $("#deal_restore_confirm_modal")).val();
						var currentDeal;
						var dealPipelineModel;

						// Returns, if the save button has disabled attribute
						if ($(this).attr('disabled'))
							return;

						// Disables save button to prevent multiple click event
						// issues
						disable_save_button($(this));

						// Get the current deal model from the collection.
						if (Current_Route != 'deals')
						{
							currentDeal = App_Deal_Details.dealDetailView.model.toJSON();
						}
						else
						{
							dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : milestone });
							if (!dealPipelineModel)
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
						if (currentDeal.note_description)
							delete currentDeal.note_description;

						if (!currentDeal.close_date || currentDeal.close_date == 0)
							currentDeal.close_date = null;
						if(currentDeal && currentDeal.owner)
						{
							currentDeal.owner_id = currentDeal.owner.id;
						}
						var arch_deal = new Backbone.Model();
						arch_deal.url = '/core/api/opportunity';
						arch_deal
								.save(
										currentDeal,
										{
										// If the milestone is changed, to show
										// that change in edit popup if opened
										// without reloading the app.
										success : function(model, response)
										{
											if (Current_Route != 'deals')
											{
												$("#deal_restore_confirm_modal").modal('hide');
												App_Deal_Details.dealDetailView.model = model;
												App_Deal_Details.dealDetailView.render(true)
												$('body').removeClass("modal-open");
												Backbone.history.navigate("deal/" + model.toJSON().id, { trigger : true });
												return;
											}

											// Remove the deal from the
											// collection and remove the UI
											// element.
											if (removeArchive(response))
											{
												dealPipelineModel[0].get('dealCollection').remove(dealPipelineModel[0].get('dealCollection').get(id));
												$('#' + id).parent().remove();
											}
											else
											{
												$('#' + id + ' .deal-options').find('.deal-restore').remove();
												var htmllinks = '<a title="Archive" class="deal-archive" style="cursor:pointer;text-decoration:none;"> <i style="width: 0.9em!important;" class="icon-archive"></i> </a>';
												htmllinks += '<a title="Edit" class="deal-edit" style="cursor:pointer;text-decoration:none;"> <i style="width: 0.9em!important;" class="icon-pencil"></i> </a>';
												$('#' + id + ' .deal-options').prepend(htmllinks);
											}
											console.log('archived deal----', model);
											// Shows Milestones Pie
											pieMilestones();
											enable_save_button(that);
											$("#deal_restore_confirm_modal").modal('hide');
											// Shows deals chart
											dealsLineChart();
											update_deal_collection(model.toJSON(), id, milestone, milestone);

										},error : function(model, err)
										{
											enable_save_button(that);
											$("#deal_restore_confirm_modal").find('span.error-status').html('<div class="inline-block"><p class="text-base" style="color:#B94A48;"><i>'+err.responseText+'</i></p></div>');
											setTimeout(function()
											{
												$("#deal_restore_confirm_modal").find('span.error-status').html('');
											}, 2000);
											console.log('-----------------', err.responseText);
										} });

					});

	/**
	 * Milestone view deal delete
	 */
	$('#opportunity-listners').on('click', '.deal-archive', function(e)
	{
		e.preventDefault();

		var temp = {};
		temp.id = $(this).closest('.data').attr('id');
		temp.milestone = ($(this).closest('ul').attr("milestone")).trim();
		$("#archived-deal-id", $("#deal_archive_confirm_modal")).val(temp.id);
		$("#archived-deal-milestone", $("#deal_archive_confirm_modal")).val(temp.milestone);
		$("#deal_archive_confirm_modal").modal('show');
	});

	/**
	 * Milestone view deal delete
	 */
	$('body').on('click', '.deal-restore', function(e)
	{
		e.preventDefault();

		var temp = {};
		temp.id = $(this).closest('.data').attr('id');
		temp.milestone = ($(this).closest('ul').attr("milestone")).trim();
		$("#restored-deal-id", $("#deal_restore_confirm_modal")).val(temp.id);
		$("#restored-deal-milestone", $("#deal_restore_confirm_modal")).val(temp.milestone);
		$("#deal_restore_confirm_modal").modal('show');
	});

	$('body').on('change', '#pipeline_milestone', function(e)
	{
		var temp = $(this).val();
		var track = temp.substring(0, temp.indexOf('_'));
		var milestone = temp.substring(temp.indexOf('_') + 1, temp.length + 1);
		$(this).closest('form').find('#pipeline').val(track);
		$(this).closest('form').find('#milestone').val(milestone);
		console.log(track, '-----------', milestone);
		var lost_milestone_flag = false;
		$(this).find('option').each(function(){
			if($(this).css("display") == "none" && $(this).val() == temp){
				lost_milestone_flag = true;
			}
		});
		if(lost_milestone_flag && $('#lost_reason',$(this).closest('.modal')).find('option').length>1){
			$('#lost_reason',$(this).closest('.modal')).val("");
			$('#deal_lost_reason',$(this).closest('.modal')).removeClass("hidden");
		}else{
			$('#lost_reason',$(this).closest('.modal')).val("");
			$('#deal_lost_reason',$(this).closest('.modal')).addClass("hidden");
		}
	});

	$('body').on('click', '#deal_lost_reason_save', function(e){
		e.preventDefault();
		$(this).attr('disabled',true);
		$(this).text('Saving...');
		var dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : App_Deals.newMilestone });
		var dealModel = dealPipelineModel[0].get('dealCollection').get(App_Deals.lost_reason_milesone_id);
		dealModel.collection.get(App_Deals.lost_reason_milesone_id).set({ "lost_reason_id" : $(this).closest('.modal').find('form').find('#lost_reason').val() });
		update_milestone(App_Deals.dealModel, App_Deals.lost_reason_milesone_id, App_Deals.newMilestone, App_Deals.old_milestone, false, $(this).closest('.modal').find('form').find('#lost_reason').val());
		$('#dealLostReasonModal').modal('hide');
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

   if($('#color1' , dealForm).is(':hidden')){
   	$('.colorPicker-picker', dealForm).remove();
    $('#color1' , dealForm).colorPicker();
	} 
    // Disable color input field
    $('.colorPicker-palette').find('input').attr('disabled', 'disabled');


 var color = {"VIOLET":"#ee82ee","INDIGO":"#4b0082","BLUE":"#0000ff","GREEN":"#00ff00","YELLOW":"#ffff00"
		               ,"ORANGE":"#ff6600","RED":"#ff0000","BLACK":"#000000","WHITE":"#ffffff","GREY":"#808080"};

    var colorcode = color[value.colorName];
      if(!colorcode)
      	  colorcode = "#808080";
      $('#color1' , dealForm).attr('value', colorcode);
      $('.colorPicker-picker', dealForm).css("background-color", colorcode);



    $("#opportunityUpdateModal").modal('show');

	// Hide archive button, if the is already archived.
	if (value.archived)
	{
		$('#opportunity_archive').hide();
		$('#opportunity_unarchive').show();
	}
	else
	{
		$('#opportunity_unarchive').hide();
		$('#opportunity_archive').show();
	}

	// Call setupTypeAhead to get contacts
	agile_type_ahead("relates_to", dealForm, contacts_typeahead);

	// Fills owner select element
	populateUsers("owners-list", dealForm, value, 'owner', function(data)
	{
		dealForm.find("#owners-list").html(data);
		if (value.owner)
		{
			$("#owners-list", dealForm).find('option[value=' + value['owner'].id + ']').attr("selected", "selected");
			$("#owners-list", $("#opportunityUpdateForm")).closest('div').find('.loading-img').hide();
		}
	});

	// Fills the pipelines list in the select menu.
	populateTrackMilestones(dealForm, undefined, value, function(pipelinesList)
	{

	});

	// Enable the datepicker
	$('#close_date', dealForm).datepicker({
		format : CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY
	});
	
	// Add notes in deal modal
	showNoteOnForm("opportunityUpdateForm", value.notes);

	add_custom_fields_to_form(value, function(data)
	{
		var el = show_custom_fields_helper(data["custom_fields"], [
			"modal"
		]);
		// if(!value["custom_data"]) value["custom_data"] = [];
		$("#custom-field-deals", dealForm).html(fill_custom_fields_values_generic($(el), value["custom_data"]));

		$('.contact_input', dealForm).each(function(){
			agile_type_ahead($(this).attr("id"), $('#custom_contact_'+$(this).attr("id"), dealForm), contacts_typeahead, undefined, 'type=PERSON');
		});

		$('.contact_input', dealForm).each(function(){
			var name = $(this).attr("name");
			for (var i = 0; i < value.custom_data.length; ++i)
			{
				if (value.custom_data[i].name == name)
				{
					var valJSON = $.parseJSON(value.custom_data[i].value);
					var referenceContactIds = "";
					$.each(valJSON, function(index, value){
						if(index != valJSON.length-1){
							referenceContactIds += value + ",";
						}else{
							referenceContactIds += value;
						}
					});
					setReferenceContacts(name, dealForm, valJSON, referenceContactIds);
				}
			}
		});

		$('.company_input', dealForm).each(function(){
			agile_type_ahead($(this).attr("id"), $('#custom_company_'+$(this).attr("id"), dealForm), contacts_typeahead, undefined, 'type=COMPANY');
		});

		$('.company_input', dealForm).each(function(){
			var name = $(this).attr("name");
			for (var i = 0; i < value.custom_data.length; ++i)
			{
				if (value.custom_data[i].name == name)
				{
					var valJSON = $.parseJSON(value.custom_data[i].value);
					var referenceContactIds = "";
					$.each(valJSON, function(index, value){
						if(index != valJSON.length-1){
							referenceContactIds += value + ",";
						}else{
							referenceContactIds += value;
						}
					});
					setReferenceContacts(name, dealForm, valJSON, referenceContactIds);
				}
			}
		});

	}, "DEAL")

	populateLostReasons(dealForm, value);

	populateDealSources(dealForm, value);
}

/**
 * Show new deal popup
 */
function show_deal()
{
   $( "#opportunityForm" )[ 0 ].reset();
   
   var el = $("#opportunityForm");

    if($('#color1', el).is(':hidden')){

    $('.colorPicker-picker', el).remove();

    $('#color1', el).colorPicker();
	} 
    // Disable color input field
    $('.colorPicker-palette').find('input').attr('disabled', 'disabled');


    $("#opportunityModal").modal('show');

	add_custom_fields_to_form({}, function(data)
	{
		var el_custom_fields = show_custom_fields_helper(data["custom_fields"], [
			"modal"
		]);
		$("#custom-field-deals", $("#opportunityModal")).html($(el_custom_fields));

		$('.contact_input', el).each(function(){
			agile_type_ahead($(this).attr("id"), $('#custom_contact_'+$(this).attr("id"), el), contacts_typeahead, undefined, 'type=PERSON');
		});

		$('.company_input', el).each(function(){
			agile_type_ahead($(this).attr("id"), $('#custom_company_'+$(this).attr("id"), el), contacts_typeahead, undefined, 'type=COMPANY');
		});

	}, "DEAL");

	// Fills owner select element
	populateUsers("owners-list", el, undefined, undefined, function(data)
	{

		$("#opportunityForm").find("#owners-list").html(data);
		$("#owners-list", $("#opportunityForm")).find('option[value=' + CURRENT_DOMAIN_USER.id + ']').attr("selected", "selected");
		$("#owners-list", $("#opportunityForm")).closest('div').find('.loading-img').hide();
	});
	// Contacts type-ahead
	agile_type_ahead("relates_to", el, contacts_typeahead);

	// Fills the pipelines list in select box.
	populateTrackMilestones(el, undefined, undefined, function(pipelinesList)
	{
		console.log(pipelinesList);
		$.each(pipelinesList, function(index, pipe)
		{
			if (pipe.isDefault)
			{
				var val = pipe.id + '_';
				if (pipe.milestones.length > 0)
				{
					val += pipe.milestones.split(',')[0];
					$('#pipeline_milestone', el).val(val);
					$('#pipeline', el).val(pipe.id);
					$('#milestone', el).val(pipe.milestones.split(',')[0]);
				}

			}
		});
	});

	populateLostReasons(el, undefined);

	populateDealSources(el, undefined);

	// Enable the datepicker
	$('#close_date', el).datepicker({
		format : CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY
	});
}

function checkPipeline(pipeId)
{
	var presentPipe = 0;
	if (_agile_get_prefs("agile_deal_track"))
		presentPipe = _agile_get_prefs("agile_deal_track");

	if (presentPipe == pipeId)
		return true;
	return false;
}

function removeArchive(deal)
{
	var result = false;
	if (_agile_get_prefs('deal-filters'))
	{
		var arch = $.parseJSON(_agile_get_prefs('deal-filters')).archived;
		if (arch == 'false' && deal.archived == true)
			return true;
		else if (arch == 'true' && deal.archived == false)
			return true;
		else
			return false;

	}
	else
		return result;
}

/**
 * Updates or Saves a deal
 */
function saveDeal(formId, modalId, saveBtn, json, isUpdate)
{
	// Returns, if the save button has disabled attribute
	if ($(saveBtn).attr('disabled'))
		return;

	// Disables save button to prevent multiple click event issues
	disable_save_button($(saveBtn));// $(saveBtn).attr('disabled', 'disabled');

	if (!isValidForm('#' + formId))
	{
		var container = $('#' + formId).closest('.modal');
		var ele = $('#' + formId).find('.single-error').first();
		container.scrollTop(ele.offset().top - container.offset().top + container.scrollTop());
		// Removes disabled attribute of save button
		enable_save_button($(saveBtn));// $(saveBtn).removeAttr('disabled');
		return false;
	}

	// Shows loading symbol until model get saved
	// $('#' + modalId).find('span.save-status').html(getRandomLoadingImg());
	if (json.close_date == 0)
		json.close_date = null;
	var newDeal = new Backbone.Model();
	newDeal.url = 'core/api/opportunity';
	newDeal.save(json, { success : function(data)
	{

		// Removes disabled attribute of save button
		enable_save_button($(saveBtn));// $(saveBtn).removeAttr('disabled');

		// $('#' + modalId).find('span.save-status img').remove();
		$('#' + modalId).modal('hide');

		$('#' + formId).each(function()
		{
			this.reset();
		});

		var deal = data.toJSON();

		add_recent_view(new BaseModel(deal));

		// Updates data to timeline
		if (App_Contacts.contactDetailView && Current_Route == "contact/" + App_Contacts.contactDetailView.model.get('id'))
		{

			// Add model to collection. Disabled sort while adding and called
			// sort explicitly, as sort is not working when it is called by add
			// function

			/*
			 * Verifies whether the added deal is related to the contact in
			 * contact detail view or not
			 */
			$.each(deal.contacts, function(index, contact)
			{

				if (contact.id == App_Contacts.contactDetailView.model.get('id'))
				{

					if (dealsView && dealsView.collection)
					{
						var owner = deal.owner_id;

					  	if(!owner){
					  		owner = deal.owner.id;
					  	}
					  	if(hasScope("VIEW_DEALS") || CURRENT_DOMAIN_USER.id == owner){
					  		if (deal.archived == true)
							{
								dealsView.collection.remove(deal.id);
								dealsView.collection.sort();
							}
							else if (dealsView.collection.get(deal.id))
							{
								dealsView.collection.get(deal.id).set(new BaseModel(deal));
								$("#"+deal.id).closest("li").removeAttr("class");
								$("#"+deal.id).closest("li").addClass("deal-color");
								$("#"+deal.id).closest("li").addClass(deal.colorName);
							}
							else
							{
								dealsView.collection.add(new BaseModel(deal), { sort : false });
								dealsView.collection.sort();
							}
					  	}
					  	if(!hasScope("VIEW_DEALS") && CURRENT_DOMAIN_USER.id != owner && isUpdate){
					  		dealsView.collection.remove(deal.id);
							dealsView.collection.sort();
					  	}
					}

					// Activates "Timeline" tab and its tab content in
					// contact detail view
					// activate_timeline_tab();
					add_entity_to_timeline(data);
					/*
					 * If timeline is not defined yet, initiates with the data
					 * else inserts
					 */
					return false;
				}
			});
		} else if(App_Companies.companyDetailView
				&& Current_Route == "company/"
					+ App_Companies.companyDetailView.model.get('id')){
			company_util.updateDealsList(deal,true, isUpdate);
		}
		// When deal is added or updated from Deals route
		else if (Current_Route == 'deals')
		{

			if (!_agile_get_prefs("agile_deal_view"))
			{

				var newMilestone = deal.milestone;

				if (isUpdate)
				{

					var id = deal.id;
					var oldMilestone = $('#' + id).attr('data');
					$("#"+deal.id).parent().removeClass();
					$("#"+deal.id).parent().addClass(deal.colorName);
		            $("#"+deal.id).parent().addClass("deal-color");
					// update_deal_collection(deal, id, newMilestone,
					// oldMilestone);

					var dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : oldMilestone });
					if (!dealPipelineModel)
						return;
					var deal_pre_modified_value = dealPipelineModel[0].get('dealCollection').get(id).attributes.expected_value;
					dealPipelineModel[0].get('dealCollection').remove(dealPipelineModel[0].get('dealCollection').get(id));

					if (!checkPipeline(deal.pipeline_id))
					{
						console.log('removing the deal');
						$("#" + oldMilestone.replace(/ +/g, '')).find("#" + id).parent().remove();
						try
						{
							var olddealvalue = parseFloat($('#'+oldMilestone.replace(/ +/g, '')+'_totalvalue').text().replace(/\,/g,''))-parseFloat(deal_pre_modified_value);
						    $('#'+oldMilestone.replace(/ +/g, '')+'_totalvalue').text(portlet_utility.getNumberWithCommasAndDecimalsForPortlets(olddealvalue));
						    $('#' + oldMilestone.replace(/ +/g, '') + '_count').text(parseInt($('#' + oldMilestone.replace(/ +/g, '') + '_count').text()) - 1);
						
							/* average of new deal total */
					     	var avg_deal_size = 0;
					     	var old_deal_count = parseInt($('#' + oldMilestone.replace(/ +/g, '') + '_count').text())  ; 
					     	if(old_deal_count == 0)
					     		avg_deal_size = 0;
					     	else
					     		avg_deal_size = olddealvalue / old_deal_count;


					     	olddealvalue = portlet_utility.getNumberWithCommasAndDecimalsForPortlets(olddealvalue) ;
					        avg_deal_size =  portlet_utility.getNumberWithCommasAndDecimalsForPortlets(avg_deal_size);
					        var dealTrack = $("#pipeline-tour-step").children('.filter-dropdown').text();
					     	var symbol = getCurrencySymbolForCharts();
					     	var heading = oldMilestone.replace(/ +/g, '');
					     	var dealdata = {"dealTrack":dealTrack ,"heading": heading ,"dealcount":olddealvalue ,"avgDeal" : avg_deal_size,"symbol":symbol,"dealNumber":old_deal_count};
							var dealDataString = JSON.stringify(dealdata) ; 
							$("#"+heading+" .dealtitle-angular").removeAttr("data");
							$("#"+heading+" .dealtitle-angular").attr("data" , dealDataString ); 
							 
						}
						catch (err)
						{
							console.log(err);
						}
					}
					else if (newMilestone != oldMilestone)
					{

						dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : newMilestone });
						if (!dealPipelineModel)
							return;

						dealPipelineModel[0].get('dealCollection').add(copyCursor(dealPipelineModel, deal));
						$("#" + oldMilestone.replace(/ +/g, '')).find("#" + id).parent().remove();

						try
						{

                            var dealchangevalue = deal.expected_value;
                            var olddealvalue = parseFloat($('#'+oldMilestone.replace(/ +/g, '')+'_totalvalue').text().replace(/\,/g,''))-parseFloat(deal_pre_modified_value); 
                            var newdealvalue = parseFloat($('#'+newMilestone.replace(/ +/g, '')+'_totalvalue').text().replace(/\,/g,''))+parseFloat(dealchangevalue);


		                    $('#'+newMilestone.replace(/ +/g, '')+'_totalvalue').text(portlet_utility.getNumberWithCommasAndDecimalsForPortlets(newdealvalue));
		                    $('#'+oldMilestone.replace(/ +/g, '')+'_totalvalue').text(portlet_utility.getNumberWithCommasAndDecimalsForPortlets(olddealvalue));


						    $('#' + newMilestone.replace(/ +/g, '') + '_count').text(parseInt($('#' + newMilestone.replace(/ +/g, '') + '_count').text()) + 1);
						    $('#' + oldMilestone.replace(/ +/g, '') + '_count').text(parseInt($('#' + oldMilestone.replace(/ +/g, '') + '_count').text()) - 1);
							/* average of new deal total */
					     	var avg_old_deal_size = 0;
					     	var old_deal_count = parseInt($('#' + oldMilestone.replace(/ +/g, '') + '_count').text()) ; 
					     	if(old_deal_count == 0)
					     		avg_old_deal_size = 0;
					     	else
					     		avg_old_deal_size = olddealvalue / old_deal_count;
							 /* average of new deal total */
					      	var avg_new_deal_size = 0;
					     	var new_deal_count = parseInt($('#' + newMilestone.replace(/ +/g, '') + '_count').text()); 
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
					       
					        var dealolddata = {"dealTrack":dealTrack ,"heading": oldheading ,"dealcount":olddealvalue ,"avgDeal" : avg_old_deal_size,"symbol":symbol,"dealNumber":old_deal_count};
							var dealOldDataString = JSON.stringify(dealolddata); 
							$("#"+oldheading+" .dealtitle-angular").attr("data" , dealOldDataString); 

					        var dealnewdata = {"dealTrack":dealTrack ,"heading": newheading ,"dealcount":newdealvalue ,"avgDeal" : avg_new_deal_size,"symbol":symbol,"dealNumber":new_deal_count};
							var dealNewDataString = JSON.stringify(dealnewdata); 
							$("#"+newheading+" .dealtitle-angular").attr("data" , dealNewDataString);

						}
						catch (err)
						{
							console.log(err);
						}
					}
					else
					{
						dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : newMilestone });
						if (!dealPipelineModel)
							return;

						dealPipelineModel[0].get('dealCollection').add(copyCursor(dealPipelineModel, deal), { silent : true });
						console.log('Updating html - ', deal);
						var dealsTemplate = 'deals-by-paging-model';

						if (!_agile_get_prefs('deal-milestone-view'))
						{
							dealsTemplate = 'deals-by-paging-relax-model';
						}
						$("#" + newMilestone.replace(/ +/g, '')).find("#" + id).parent().html(getTemplate(dealsTemplate, deal));
						try
						{

                           var dealchangevalue = deal.expected_value;
                           var prenewdealvalue = parseFloat($('#'+oldMilestone.replace(/ +/g, '')+'_totalvalue').text().replace(/\,/g,''))-parseFloat(deal_pre_modified_value); 
                           var newdealvalue = parseFloat(prenewdealvalue)+parseFloat(dealchangevalue);


		                  $('#'+newMilestone.replace(/ +/g, '')+'_totalvalue').text(portlet_utility.getNumberWithCommasAndDecimalsForPortlets(newdealvalue));
		                  
						    /* average of new deal total */
					      	var avg_new_deal_size = 0;
					     	var new_deal_count = parseInt($('#' + newMilestone.replace(/ +/g, '') + '_count').text()); 
					     	if(new_deal_count == 0)
					     		avg_new_deal_size = 0;
					     	else
					     		avg_new_deal_size = newdealvalue / new_deal_count;

					     	newdealvalue = portlet_utility.getNumberWithCommasAndDecimalsForPortlets(newdealvalue) ;
					        avg_new_deal_size =  portlet_utility.getNumberWithCommasAndDecimalsForPortlets(avg_new_deal_size);

					     	var newheading = newMilestone.replace(/ +/g, '');
					        var symbol = getCurrencySymbolForCharts();
				            var dealTrack = $("#pipeline-tour-step").children('.filter-dropdown').text();
				            var dealdata = {"dealTrack":dealTrack ,"heading": newheading ,"dealcount":newdealvalue ,"avgDeal" : avg_new_deal_size,"symbol":symbol,"dealNumber":new_deal_count};
							var dealDataString = JSON.stringify(dealdata) ; 
							$("#"+newheading+" .dealtitle-angular").removeAttr("data"); 
							$("#"+newheading+" .dealtitle-angular").attr("data" , dealDataString ); 
						
						}
						catch (err)
						{
							console.log(err);
						}
					}

					if (removeArchive(deal))
					{

						console.log('removing the deal when archived');
						$("#" + oldMilestone.replace(/ +/g, '')).find("#" + id).parent().remove();
						try
						{
							$('#' + oldMilestone.replace(/ +/g, '') + '_count').text(parseInt($('#' + oldMilestone.replace(/ +/g, '') + '_count').text()) - 1);

	                        var dealchangevalue = deal.expected_value;
	                        var newdealvalue = parseFloat($('#'+oldMilestone.replace(/ +/g, '')+'_totalvalue').text().replace(/\,/g,''))-parseFloat(dealchangevalue); 
	                        $('#'+oldMilestone.replace(/ +/g, '')+'_totalvalue').text(portlet_utility.getNumberWithCommasAndDecimalsForPortlets(newdealvalue));
		                  
						    /* average of new deal total */
					      	var avg_new_deal_size = 0;
					     	var new_deal_count = parseInt($('#' + oldMilestone.replace(/ +/g, '') + '_count').text()); 
					     	if(new_deal_count == 0)
					     		avg_new_deal_size = 0;
					     	else
					     		avg_new_deal_size = newdealvalue / new_deal_count;

					     	newdealvalue = portlet_utility.getNumberWithCommasAndDecimalsForPortlets(newdealvalue) ;
					        avg_new_deal_size =  portlet_utility.getNumberWithCommasAndDecimalsForPortlets(avg_new_deal_size);

					     	var newheading = oldMilestone.replace(/ +/g, '');
					        var symbol = getCurrencySymbolForCharts();
				            var dealTrack = $("#pipeline-tour-step").children('.filter-dropdown').text();
				            var dealdata = {"dealTrack":dealTrack ,"heading": newheading ,"dealcount":newdealvalue ,"avgDeal" : avg_new_deal_size,"symbol":symbol,"dealNumber":new_deal_count};
							var dealDataString = JSON.stringify(dealdata) ; 
							$("#"+newheading+" .dealtitle-angular").removeAttr("data"); 
							$("#"+newheading+" .dealtitle-angular").attr("data" , dealDataString ); 
						
						}
						
						catch (err)
						{
							console.log(err);
						}
					}

				}
				else if (checkPipeline(deal.pipeline_id))
				{
					var owner = deal.owner_id;

				  	if(!owner){
				  		owner = deal.owner.id;
				  	}
				  	if(!hasScope("VIEW_DEALS") && CURRENT_DOMAIN_USER.id != owner){
				  		return;
				  	}
					var dealPipelineModel = DEALS_LIST_COLLECTION.collection.where({ heading : newMilestone });
					if (!dealPipelineModel)
						return;
					var filterJSON = $.parseJSON(_agile_get_prefs('deal-filters'));
					console.log(deal.owner.id.toString() != filterJSON.owner_id, deal.owner.id.toString(), filterJSON.owner_id);
					if (filterJSON.owner_id.length > 0 && deal.owner.id.toString() != filterJSON.owner_id)
						return;
					console.log(filterJSON.archived != 'all' && deal.archived != filterJSON.archived, deal.archived);
					if (filterJSON.archived)
					{
						console.log(filterJSON.archived);
						if (filterJSON.archived != 'all' && deal.archived.toString() != filterJSON.archived)
							return;
					}

					dealPipelineModel[0].get('dealCollection').add(copyCursor(dealPipelineModel, deal));
					try
					{    
						var newdealvairable = deal.expected_value;

                        var newdealeditvalue = parseFloat($('#'+newMilestone.replace(/ +/g, '')+'_totalvalue').text().replace(/\,/g,''))+parseFloat(newdealvairable);
                        
                        $('#'+newMilestone.replace(/ +/g, '')+'_totalvalue').text(portlet_utility.getNumberWithCommasAndDecimalsForPortlets(newdealeditvalue));

						$('#' + newMilestone.replace(/ +/g, '') + '_count').text(parseInt($('#' + newMilestone.replace(/ +/g, '') + '_count').text()) + 1);
					    /* average of new deal total */
				      	var avg_new_deal_size = 0;
				     	var new_deal_count = parseInt($('#' + newMilestone.replace(/ +/g, '') + '_count').text()) ;  
				     	if(new_deal_count == 0)
				     		avg_new_deal_size = 0;
				     	else
				     		avg_new_deal_size = newdealeditvalue / new_deal_count;

                        
				        newdealeditvalue = portlet_utility.getNumberWithCommasAndDecimalsForPortlets(newdealeditvalue) ;
				        avg_new_deal_size =  portlet_utility.getNumberWithCommasAndDecimalsForPortlets(avg_new_deal_size);

				     	var newheading = newMilestone.replace(/ +/g, '');
				        $("#"+newheading+" .dealtitle-angular").removeAttr("data");  
				        var symbol = getCurrencySymbolForCharts();
				        var dealTrack = $("#pipeline-tour-step").children('.filter-dropdown').text();
			            var dealdata = {"dealTrack":dealTrack ,"heading": newheading ,"dealcount":newdealeditvalue ,"avgDeal" : avg_new_deal_size,"symbol":symbol,"dealNumber":new_deal_count};
						var dealDataString = JSON.stringify(dealdata) ; 
						$("#"+newheading+" .dealtitle-angular").attr("data" , dealDataString ); 

				        

				        }
					catch (err)
					{
						console.log(err);
					}
				}
				includeTimeAgo($("#" + newMilestone.replace(/ +/g, '')));
				$('a.deal-notes').tooltip();
				$("#"+deal.id).parent().addClass(deal.colorName);
		        $("#"+deal.id).parent().addClass("deal-color");
			}
			else
			{
				var owner = deal.owner_id;

			  	if(!owner){
			  		owner = deal.owner.id;
			  	}
			  	if(!hasScope("VIEW_DEALS") && CURRENT_DOMAIN_USER.id != owner){
			  		return;
			  	}
			  	
				if (isUpdate)
					App_Deals.opportunityCollectionView.collection.remove(json);
				if (App_Deals.opportunityCollectionView.collection.length > 0)
					data.attributes.cursor = App_Deals.opportunityCollectionView.collection.last().toJSON().cursor;
				App_Deals.opportunityCollectionView.collection.add(data);
				App_Deals.opportunityCollectionView.render(true);
			}

		}
		else if (Current_Route == undefined || Current_Route == 'dashboard')
		{
			if (App_Portlets.currentPosition && App_Portlets.pendingDeals && App_Portlets.pendingDeals[parseInt(App_Portlets.currentPosition)])
			{
				if (isUpdate)
					App_Portlets.pendingDeals[parseInt(App_Portlets.currentPosition)].collection.remove(json);

				// Updates task list view
				if (json.milestone != "Won" && json.milestone != "Lost")
					App_Portlets.pendingDeals[parseInt(App_Portlets.currentPosition)].collection.add(data);

				App_Portlets.pendingDeals[parseInt(App_Portlets.currentPosition)].render(true);
			}
			if (App_Portlets.currentPosition && App_Portlets.dealsWon && App_Portlets.dealsWon[parseInt(App_Portlets.currentPosition)])
			{
				if (isUpdate)
					App_Portlets.dealsWon[parseInt(App_Portlets.currentPosition)].collection.remove(json);

				// Updates task list view
				App_Portlets.dealsWon[parseInt(App_Portlets.currentPosition)].collection.add(data);

				App_Portlets.dealsWon[parseInt(App_Portlets.currentPosition)].render(true);
			}

		}
		else
		{
			App_Deal_Details.dealDetailView.model = data;
			App_Deal_Details.dealDetailView.render(true)
			Backbone.history.navigate("deal/" + data.toJSON().id, { trigger : true });
			/*
			 * App_Deals.navigate("deals", { trigger : true });
			 */

		}
	}, error : function(model, err)
	{
		enable_save_button($(saveBtn));
		$('#' + modalId).find('span.error-status').html("<i style='color:#B94A48;'>"+err.responseText+"</i>");
		setTimeout(function()
		{
			$('#' + modalId).find('span.error-status').html('');
		}, 2000);
		console.log('-----------------', err.responseText);
	} });
}