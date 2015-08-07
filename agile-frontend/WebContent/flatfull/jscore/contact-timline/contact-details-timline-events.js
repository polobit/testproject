/**
 * Handles the events (click and mouseenter) of mail and log entities of 
 * tiemline 
 */
$(function () {
	
	
});


function contactsTimelineListners(el){
	/*
	 * Shows the mail details in detail on a popup modal, when '+'
	 * symbol is clicked 
	 */ 
	$('#contact-detail-listners').on('click', '#tl-mail-popover', function(e){
		e.preventDefault();
		
		var htmlstring = $(this).closest('div').attr("data");
		// var htmlstring = $(this).closest('div.text').html();
		// htmlstring = htmlstring.replace("icon-plus", "");

		$("#mail-in-detail").html("<div style='background:none;border:none;'>" + htmlstring + "</div>");
		
		$("#timelineMailModal").modal("show");
        
    });
	
	/*
	 * Shows the campaign log details on a popup modal
	 */
	$('#contact-detail-listners').on('click', '#tl-log-popover', function(e){
		e.preventDefault();
		
		var string = $(this).closest('div').attr("data");

		// Add div tag to the string to consider white spaces
		$("#log-in-detail").html("<div style='background:none;border:none;'>" + string + "</div>");
		
		$("#timelineLogModal").modal("show");
    });
	
	/**
	 * Shows analytics popup modal with full details.
	 **/
	$('#contact-detail-listners').on('click', '#tl-analytics-popover', function(e){
		e.preventDefault();
		
		var string = $(this).closest('div.body').html();
		var pageViews = $(string).find('div.ellipsis-multi-line');

		$("#analytics-in-detail").html("<div'>" + $(pageViews).html() + "</div>");
		
		$("#timelineAnalyticsModal").modal("show");
	});
	
	/*
	 * Shows the list of mails(mail sent to) as popover, when mouse is entered on
	 * to address of the email
	 */ 
	$('#contact-detail-listners').on('mouseenter', '#tl-mail-to-popover', function(e){
		
		$(this).popover({
        	template:'<div class="popover"><div class="arrow"></div><div class="popover-inner" style="padding:1px;width:340px;border-radius:2px"><div class="popover-content"><p></p></div></div></div>'
        });
		
		var string = $(this).text();
		//var html = new Handlebars.SafeString(string.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/,/g, ",</br>").replace("To:","To:</br>").replace("read more", ""));
		$(this).attr("data-content", string);
        $(this).popover('show');
    });
	
	// Resizes the item height and open close effect for timeline elements
	$('#contact-detail-listners').on('click', '#timeline .item a.open-close', function(e){
		$(this).siblings('.body').slideToggle(function(){
			$('#timeline').isotope('reLayout');
		});
		$(this).parents('.post').toggleClass('closed');
		$('#expand-collapse-buttons a').removeClass('active');
		e.preventDefault();
	});



	//notes actions

	$('#contact-detail-listners').on('click', '.edit-note', function(e)
	{
		e.preventDefault();
		console.log($(this).attr('data'));
		var note = notesView.collection.get($(this).attr('data'));
		console.log(note);

		// Clone modal, so we dont have to create a update modal.
		// we can clone add change ids and use it as different modal

		$('#noteUpdateModal').remove();

		var noteModal = $("#noteModal").clone();

		$("#noteForm > fieldset", noteModal).prepend('<input name="id" type="hidden"/>');
		$("#noteForm > fieldset", noteModal).prepend('<input name="created_time" type="hidden"/>');
		$("#noteForm", noteModal).parent().parent().find(".modal-header > h3").html('<i class="icon-edit"></i>&nbsp;Edit Note');
		$("#noteForm", noteModal).attr('id', "noteUpdateForm");
		noteModal.attr('id', "noteUpdateModal");
		agile_type_ahead("note_related_to", $("#noteUpdateForm", noteModal), contacts_typeahead);
		$("#note_validate", noteModal).attr("id", "note_update");
		deserializeForm(note.toJSON(), $("#noteUpdateForm", noteModal));

		noteModal.modal('show');
		// noteModal.modal('show');
	});

    $('#contact-detail-listners').on('click', '#note_update', function(e)
	{
		e.preventDefault();

		// Returns, if the save button has disabled attribute
		if ($(this).attr('disabled'))
			return;

		// Disables save button to prevent multiple click event issues
		disable_save_button($(this));//$(this).attr('disabled', 'disabled');

		if (!isValidForm('#noteUpdateForm'))
		{

			// Removes disabled attribute of save button
			enable_save_button($(this));
			return;
		}

		// Shows loading symbol until model get saved
		//$('#noteUpdateModal').find('span.save-status').html(getRandomLoadingImg());

		var json = serializeForm("noteUpdateForm");
		
		
/*		if(json.id)
			{
				if(notesView && notesView.collection && notesView.collection.get(json.id))
					{
						notesView.collection.get(json.id).set(json, {silent:true});
					}
			}*/

		saveNote($("#noteUpdateForm"), $("#noteUpdateModal"), this, json);
	});
	/**
	 * Saves note model using "Bcakbone.Model" object, and adds saved data to
	 * time-line if necessary.
	 */
	$('#contact-detail-listners').on('click', '#note_validate', function(e)
	{
		e.preventDefault();

		// Returns, if the save button has disabled attribute
		if ($(this).attr('disabled'))
			return;
		
		if (!isValidForm('#noteForm'))
		{
			return;
		}

		disable_save_button($(this));
		
		// Shows loading symbol until model get saved
		//$('#noteModal').find('span.save-status').html(getRandomLoadingImg());

		var json = serializeForm("noteForm");

		console.log(json.from_task);
		
		if(json.from_task == "true")
			saveNoteOfTask($("#noteForm"), $("#noteModal"), this, json);
		else		
		    saveNote($("#noteForm"), $("#noteModal"), this, json);
	});

	/**
	 * Shows note modal and activates contacts typeahead to its related to field
	 */
	$('#contact-detail-listners').on('click', '#show-note', function(e)
	{
		e.preventDefault();
		$("#noteModal").modal('show');

		var el = $("#noteForm");
		agile_type_ahead("note_related_to", el, contacts_typeahead);
	});


   	// Deletes a contact from database
	$('#contact-detail-listners').on('click', '#contact-actions-delete', function(e){
		
		e.preventDefault();
		if(!confirm("Do you want to delete the contact?"))
    		return;
		
		App_Contacts.contactDetailView.model.url = "core/api/contacts/" + App_Contacts.contactDetailView.model.id;
		App_Contacts.contactDetailView.model.destroy({success: function(model, response) {
			  Backbone.history.navigate("contacts",{trigger: true});
		}});

		
		/* Removing from collection did not work - to do later
		console.log("Deleting");
		
		var model =  App_Contacts.contactDetailView.model;
		console.log(model);
		App_Contacts.contactsListView.collection.remove(model);
		
		Backbone.history.navigate("contacts", {trigger: true});
		*/
	});
	
	/**
	 * Deletes a tag of a contact (removes the tag from the contact and saves the contact)
	 */ 
	$('#contact-detail-listners').on('click', '.remove-tags', function(e){
		e.preventDefault();
		
		var tag = $(this).attr("tag");
		removeItemFromTimeline($("#" +  tag.replace(/ +/g, '') + '-tag-timeline-element', $('#timeline')).parent('.inner'))
		console.log($(this).closest("li").parent('ul').append(getRandomLoadingImg()));
		
     	var json = App_Contacts.contactDetailView.model.toJSON();
     	
     	// Returns contact with deleted tag value
     	json = delete_contact_tag(json, tag);
     	var that = this;
     	
     	// Unbinds click so user cannot select delete again
     	$(this).unbind("click");
     	
        var contact = new Backbone.Model();
        contact.url = 'core/api/contacts';
        contact.save(json, {
       		success: function(data)
       			{ 	      		
       				$(that).closest("li").parent('ul').find('.loading').remove();
       				$(that).closest("li").remove();
       				
       			// Updates to both model and collection
	       			App_Contacts.contactDetailView.model.set(data.toJSON(), {silent : true});
	       			
	       		//	App_Contacts.contactDetailView.model.set({'tags' : data.get('tags')}, {silent : true}, {merge:false});
       				
       				// Also deletes from Tag class if no more contacts are found with this tag
       				$.ajax({
       					url: 'core/api/tags/' + tag,
       					type: 'DELETE',
       					success: function()
       					{
       						if(tagsCollection)
       							tagsCollection.remove(tagsCollection.where({'tag': tag})[0]);
       					}
       				});
       			}
        });
	});
	
	/**
	 * Shows a form to add tags with typeahead option
	 */ 
	$('#contact-detail-listners').on('click', '#add-tags', function(e){
		e.preventDefault();
		$(this).css("display", "none");
		$("#addTagsForm").css("display", "block");
		$("#addTags").focus();
		setup_tags_typeahead();
	});
	
	/**
	 * "click" event of add button of tags form in contact detail view
	 * Pushes the added tags into tags array attribute of the contact and saves it
	 */ 
	$('#contact-detail-listners').on('click', '#contact-add-tags', function(e){
		e.preventDefault();
		
	    // Add Tags
		var new_tags = get_new_tags('addTags');
		if(new_tags)new_tags=new_tags.trim();
		
		if(!new_tags || new_tags.length<=0 || (/^\s*$/).test(new_tags))
		{
			console.log(new_tags);
			return;
		}
		if (!isValidTag(new_tags, true)) {
			return;
		}
		$('#add-tags').css("display", "block");
		$("#addTagsForm").css("display", "none");
		console.log(new_tags);
		
		if(new_tags) {
			var json = App_Contacts.contactDetailView.model.toJSON();
	    		
	    	
	    	// Reset form
	    	$('#addTagsForm input').each (function(){
   		  	  	$(this).val("");
   		  	});
	    	
	    	// Checks if tag already exists in contact
			if($.inArray(new_tags, json.tags) >= 0)
				return;
	    	
	    	json.tagsWithTime.push({"tag" : new_tags.toString()});
   			
	    	// Save the contact with added tags
	    	var contact = new Backbone.Model();
	        contact.url = 'core/api/contacts';
	        contact.save(json,{
	       		success: function(data){
	       			
	       			addTagToTimelineDynamically(new_tags, data.get("tagsWithTime"));
	       			
	       			// Get all existing tags of the contact to compare with the added tags
	       			var old_tags = [];
	       			$.each($('#added-tags-ul').children(), function(index, element){
	       				old_tags.push($(element).attr('data'));
       				});
	       			
	       			// Updates to both model and collection
	       			App_Contacts.contactDetailView.model.set(data.toJSON(), {silent : true});
	       			
	       			// Append to the list, when no match is found 
	       			if ($.inArray(new_tags, old_tags) == -1) 
	       				$('#added-tags-ul').append('<li  class="tag inline-block btn btn-xs btn-default m-r-xs m-b-xs" style="color:#363f44" data="' + new_tags + '"><span><a class="anchor m-r-xs custom-color" style="color:#363f44" href="#tags/'+ new_tags + '" >'+ new_tags + '</a><a class="close remove-tags" id="' + new_tags + '" tag="'+new_tags+'">&times</a></span></li>');
	       			
	       			console.log(new_tags);
	       			// Adds the added tags (if new) to tags collection
	       			tagsCollection.add(new BaseModel({"tag" : new_tags}));
	       		}
	        });
		}
	});
	
	/**
	 * Changes, owner of the contact, when an option of change owner drop down
	 * is selected.   
	 */
	$('#contact-detail-listners').on('click', '.contact-owner-list', function(e){
	
		$('#change-owner-ul').css('display', 'none');
		
		// Reads the owner id from the selected option
		var new_owner_id = $(this).attr('data');
		var new_owner_name = $(this).text();
		var current_owner_id = $('#contact-owner').attr('data');
		
		// Returns, if same owner is selected again 
		if(new_owner_id == current_owner_id)
			{
			  // Showing updated owner
			  show_owner();
			  return;
			}
		
		  var contactModel = new BaseModel();
		    contactModel.url = '/core/api/contacts/change-owner/' + new_owner_id + "/" + App_Contacts.contactDetailView.model.get('id');
		    contactModel.save(App_Contacts.contactDetailView.model.toJSON(), {success: function(model){

		    	// Replaces old owner details with changed one
				$('#contact-owner').text(new_owner_name);
				$('#contact-owner').attr('data', new_owner_id);
				
				// Showing updated owner
				show_owner(); 
				App_Contacts.contactDetailView.model = model;
				
		    }});
   	});
	
	/**
	 * Get the updated details of the contact and update the model.
	 */
	$('#contact-detail-listners').on('click', '#action_refresh_contact', function(e){
			var id =  App_Contacts.contactDetailView.model.id;
		var contact_details_model = Backbone.Model.extend({ url : function()
			{
				return '/core/api/contacts/' + this.id;
			} });

			var model = new contact_details_model();
			model.id = id;
			model.fetch({ success : function(data)
			{
				
				// Call Contact Details again
				App_Contacts.contactDetails(id, model);
				$('#refresh_contact').hide();

			} });
	});



	// Popover for help in contacts,tasks etc
	$('#contact-detail-listners').on('mouseenter', '#element', function(e){
    	e.preventDefault();
        $(this).popover({
        	template:'<div class="popover" style="width:400px"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>'
        });
        $(this).popover('show');
    });
	$('#contact-detail-listners').on('mouseenter', '#element-title', function(e){
    	e.preventDefault();
        $(this).popover('show');
    });
/*	   
    $('.change-owner-element').live('mouseenter',function(e){
    	e.preventDefault();
    	$('#change-owner-ul').css('display', 'none');
        $(this).popover({
        	template:'<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>'
        });
        $(this).popover('show');
    });*/
    
	$('#contact-detail-listners').on('click', '#change-owner-element > #contact-owner', function(e){
    	e.preventDefault();
    	
    	fill_owners(undefined, undefined, function(){

        	$('#contact-owner').css('display', 'none');

        	$('#change-owner-ul').css('display', 'inline-block');
        	
        	 if($('#change-owner-element > #change-owner-ul').css('display') == 'inline-block')
                 $("#change-owner-element").find(".loading").remove();
    	});
    });
    
	$('#contact-detail-listners').on('click', '#change-owner-element > .contact-owner-add', function(e){
    	e.preventDefault();
    	
    	fill_owners(undefined, undefined, function(){

        	$('.contact-owner-add').css('display', 'none');

        	$('#change-owner-ul').css('display', 'inline-block');
        	$('#change-owner-ul').addClass("open");
        	
        	 if($('#change-owner-element > #change-owner-ul').css('display') == 'inline-block')
        		 $("#change-owner-element").find(".loading").remove();
    	});
    });
    
	$('#contact-detail-listners').on('click', '#disable_map_view', function(e){
		e.preventDefault();
		if(islocalStorageHasSpace()){
			localStorage.setItem('MAP_VIEW','disabled');
		}
		$("#map").css('display', 'none');
		$("#contacts-local-time").hide();
		$("#map_view_action").html("<i class='icon-plus text-sm c-p' title='Show map' id='enable_map_view'></i>");
		
    });
	$('#contact-detail-listners').on('click', '#enable_map_view', function(e){
		e.preventDefault();
		if(islocalStorageHasSpace()){
			localStorage.setItem('MAP_VIEW','enabled');
		}
		show_map();
		
		
	});


	$('#contact-detail-listners').on('mouseenter', '.tooltip_info', function(e){
		 $(this).tooltip({
			 html : true
		 });
		 $(this).tooltip('show');
	});
	
	/**
	 * Adds score to a contact (both in UI and back end)
	 * When '+' symbol is clicked in contact detail view score section, the score
	 * gets increased by one, both in UI and back end
	 * 
	 */  
	$('#contact-detail-listners').on('mouseenter', '#add', function(e){
	    e.preventDefault();
	    
	    // Convert string type to int
	    var add_score = parseInt($('#lead-score').text());
	    
	    add_score = add_score + 1;
	    
	    // Changes score in UI
	    $('#lead-score').text(add_score);
       
	    App_Contacts.contactDetailView.model.set({'lead_score': add_score}, {silent: true});
		var contact_model =  App_Contacts.contactDetailView.model.toJSON();
	    
	  /* // Refreshing the view ({silent: true} not working)
	    contact_model.url = 'core/api/contacts';
	    contact_model.set('lead_score', add_score, {silent: true});
	
	    // Save model
	    contact_model.save();*/
	    
		var new_model = new Backbone.Model();
		new_model.url = 'core/api/contacts';
		new_model.save(contact_model,{
			success: function(model){

			}
		});
		          
	});
	
	   
	/**
	 * Subtracts score of a contact (both in UI and back end)
	 * When '-' symbol is clicked in contact detail view score section, the score
	 * gets decreased by one, both in UI and back end
	 * 
	 */
	$('#contact-detail-listners').on('click', '#minus', function(e){
		e.preventDefault();
		
		// Converts string type to Int
		var sub_score = parseInt($('#lead-score').text());
		
		if(sub_score <= 0)
			return;
		
		sub_score = sub_score - 1;
		
		// Changes score in UI
		$('#lead-score').text(sub_score);
		
		// Changes lead_score of the contact and save it.
		App_Contacts.contactDetailView.model.set({'lead_score': sub_score}, {silent: true});
		var contact_model =  App_Contacts.contactDetailView.model.toJSON();
		
		var new_model = new Backbone.Model();
		new_model.url = 'core/api/contacts';
		new_model.save(contact_model,{
			success: function(model){

			}
		});
	});
	



		var id;

	/**
	 * Activates the Timeline tab-content to show the time-line with all
	 * details, which are already added to time-line, when the contact is
	 * getting to its detail view.
	 */
	$('#contact-detail-listners').on('click', '#contactDetailsTab a[href="#timeline"]', function(e)
	{
		e.preventDefault();

		save_contact_tab_position_in_cookie("timeline");

		contact_details_tab.load_timeline();
	});

	$('#contact-detail-listners').on('click', '.email-subject', function(e)
	{
		e.preventDefault();
		var href = $(this).attr("href");
		var id = $(this).attr('id');
		$(".collapse-" + id).hide();
		$(href).collapse('toggle');

		$(href).on("hidden.bs.collapse", function()
		{
			$(".collapse-" + id).show();
		})

	});

	// Hide More link and truncated webstats and show complete web stats.
	/*
	 * $('#more-page-urls').die().live('click', function(e) {
	 * e.preventDefault();
	 * 
	 * $(this).css('display', 'none');
	 * $(this).parent().parent().find('#truncated-webstats').css('display',
	 * 'none');
	 * 
	 * $(this).parent().parent().find('#complete-webstats').removeAttr('style');
	 * });
	 */

	$('#contact-detail-listners').on('click', '#show-page-views', function(e)
	{
		e.preventDefault();

		$(this).closest('.activity-text-block').find('#complete-webstats').toggle();
	});

	// to remove contact from active campaign.
	$('#contact-detail-listners').on('click', '.remove-active-campaign', function(e)
	{
		e.preventDefault();

		if (!confirm("Are you sure to remove " + $(this).attr("contact_name") + " from " + $(this).attr("campaign_name") + " campaign?"))
			return;

		var $active_campaign = $(this).closest('span#active-campaign');
		var campaign_id = $active_campaign.attr('data');
		var contact_id;

		// Fetch contact id from model
		if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
			contact_id = App_Contacts.contactDetailView.model.get('id');

		// Url to delete
		var deleteUrl = 'core/api/workflows/remove-active-subscriber/' + campaign_id + '/' + contact_id;

		$.ajax({ url : deleteUrl, type : 'DELETE', success : function(data)
		{

			var contact_json = App_Contacts.contactDetailView.model.toJSON();
			var campaign_status = contact_json.campaignStatus;

			// On success callback, remove from both UI and backbone contact
			// model.
			if (campaign_status !== undefined)
			{
				for (var i = 0, len = campaign_status.length; i < len; i++)
				{
					if (campaign_id === campaign_status[i].campaign_id)
					{
						// Remove from campaignStatus array of contact model
						campaign_status.splice(i, 1);
						break;
					}
				}
			}

			// Remove li
			$active_campaign.remove();

		} });

	});
	/*
	 * $('.ativity-block-ul > li') .live('mouseenter',function(){
	 * console.log("hover"); }) .live('mouseleave',function(){
	 * console.log("hout"); });
	 */

	/**
	 * Fetches all the notes related to the contact and shows the notes
	 * collection as a table in its tab-content, when "Notes" tab is clicked.
	 */
	$('#contact-detail-listners').on('click', '#contactDetailsTab a[href="#notes"]', function(e)
	{
		e.preventDefault();
		save_contact_tab_position_in_cookie("notes");
		contact_details_tab.load_notes();
	});

	/**
	 * Fetches all the events related to the contact and shows the events
	 * collection as a table in its tab-content, when "Events" tab is clicked.
	 */
	$('#contact-detail-listners').on('click', '#contactDetailsTab a[href="#events"]', function(e)
	{
		e.preventDefault();
		save_contact_tab_position_in_cookie("events");
		contact_details_tab.load_events();
	});

	/**
	 * Fetches all the documents related to the contact and shows the documents
	 * collection as a table in its tab-content, when "Documents" tab is
	 * clicked.
	 */
	$('#contact-detail-listners').on('click', '#contactDetailsTab a[href="#documents"]', function(e)
	{
		e.preventDefault();
		save_contact_tab_position_in_cookie("documents");
		contact_details_tab.load_documents();
	});

	/**
	 * Fetches all the notes related to the contact and shows the tasks
	 * collection as a table in its tab-content, when "Tasks" tab is clicked.
	 */
	$('#contact-detail-listners').on('click', '#contactDetailsTab a[href="#tasks"]', function(e)
	{
		e.preventDefault();
		save_contact_tab_position_in_cookie("tasks");
		contact_details_tab.load_tasks();
	});

	/**
	 * Fetches all the deals related to the contact and shows the deals
	 * collection as a table in its tab-content, when "Deals" tab is clicked.
	 */
	$('#contact-detail-listners').on('click', '#contactDetailsTab a[href="#deals"]', function(e)
	{
		e.preventDefault();
		save_contact_tab_position_in_cookie("deals");
		contact_details_tab.load_deals();
	});

	/**
	 * Fetches all the cases related to the contact and shows the collection.
	 */
	$('#contact-detail-listners').on('click', '#contactDetailsTab a[href="#cases"]', function(e)
	{
		e.preventDefault();
		save_contact_tab_position_in_cookie("cases");

		contact_details_tab.load_cases();
	});

	/**
	 * Gets every conversation of the contact (if it has email) with the
	 * associated email (gmail or imap) in Email-preferences of this CRM, when
	 * "Mail" tab is clicked.
	 */
	$('#contact-detail-listners').on('click', '#contactDetailsTab a[href="#mail"]', function(e)
	{
		e.preventDefault();
		email_server_type = "agilecrm"
		save_contact_tab_position_in_cookie("mail");
		contact_details_tab.load_mail();
	});

	/**
	 * Gets the activities of a contact from browsing history, using its email.
	 * To do so the email should be run in analytics script provided by
	 * agileCRM.
	 */
	 $('#contact-detail-listners').on('click', '#contactDetailsTab a[href="#stats"]', function(e)
	{
		e.preventDefault();
		save_contact_tab_position_in_cookie("stats");
		contact_details_tab.load_stats();

	});

	/**
	 * Fetches all the logs of the campaigns that the contact is subscribed to
	 * and shows them in a table. Also shows a campaigns drop down list to
	 * subscribe the contact to the selected campaign.
	 */
	$('#contact-detail-listners').on('click', '#contactDetailsTab a[href="#campaigns"]', function(e)
	{
		e.preventDefault();
		save_contact_tab_position_in_cookie("campaigns");
		contact_details_tab.load_campaigns();
	});

    $('#contact-detail-listners').on('click', '#contactDetailsTab a[href="#company-contacts"]', function(e)
	{
		e.preventDefault();
		fill_company_related_contacts(App_Contacts.contactDetailView.model.id, 'company-contacts');
	});

	/**
	 * Sets cookie when user changes email dropdown under mail tab. Cookie
	 * contains email server, email name from next time application loads from
	 * emails from this email server and email
	 */
	$('#contact-detail-listners').on('click', '.agile-emails', function(e)
	{
		e.preventDefault();
		var email_server = $(this).attr('email-server');
		var url = $(this).attr('data-url');
		$('#email-type-select', App_Contacts.contactDetailView.el).html($(this).html());
		// Here email_server_type means email/username of mail account
		email_server_type = $(this).attr('email-server-type');
		if (email_server && url && (email_server != 'agile'))
			url = url.concat(email_server_type);
		var cookie_value = email_server_type + '|' + email_server;
		save_email_server_type_in_cookie(cookie_value);
		contact_details_tab.load_mail(url, email_server);
	});

	

    $('#contact-detail-listners').on('click', '#email-reply', function(e)
			{
				e.preventDefault();

				var from = $(this).data('from');

				var $parent_element = $(this).closest('#email-reply-div');

				var to_emails = $parent_element.find('.to-emails').data('to');
				var cc_emails = $parent_element.find('.cc-emails').data('cc');
				var bcc_emails = $parent_element.find('.bcc-emails').data('bcc');

				var email_sync_configured = contact_details_tab.configured_sync_email;

				var configured_email;

				if (email_sync_configured)
				{
					configured_email = email_sync_configured;
				}

				if (configured_email && to_emails)
				{
					// Merge both from and to removing configured email
					to_emails = get_emails_to_reply(from + ', ' + to_emails, configured_email);
				}

				if (configured_email && cc_emails)
				{

					cc_emails = get_emails_to_reply(cc_emails, configured_email);
				}

				if (configured_email && bcc_emails)
				{

					bcc_emails = get_emails_to_reply(bcc_emails, configured_email);
				}

				// Change url only without triggerring function
				App_Contacts.navigate('send-email');

				// Reply all emails
				reply_email = to_emails;

				// Removes leading and trailing commas
				reply_email = reply_email.replace(/(, $)/g, "");

				if (cc_emails)
					cc_emails = cc_emails.replace(/(, $)/g, "");

				if (bcc_emails)
					bcc_emails = bcc_emails.replace(/(, $)/g, "");

				// Trigger route callback
				App_Contacts.sendEmail(reply_email, "Re: " + $parent_element.find('.email-subject').text(),
						'<p></p><blockquote style="margin:0 0 0 .8ex;border-left:1px #ccc solid;padding-left:1ex;">' + $parent_element.find('.email-body')
								.html() + '</blockquote>', cc_emails, bcc_emails);

			});

	$('#contact-detail-listners').on('hover', '#email-reply-div', function(e)
	{
		e.preventDefault();

		$(this).find('#email-reply').toggle();
	});

	/**
	 * Delete functionality for activity blocks in contact details
	 */
	$('#contact-detail-listners').on('click', '.activity-delete', function(e)
	{
		e.preventDefault();

		var model = $(this).parents('li').data();

		if (model && model.toJSON().type != "WEB_APPOINTMENT")
		{
			if (!confirm("Are you sure you want to delete?"))
				return;
		}
		else if (model && model.toJSON().type == "WEB_APPOINTMENT" && parseInt(model.toJSON().start) < parseInt(new Date().getTime() / 1000))
		{
			if (!confirm("Are you sure you want to delete?"))
				return;
		}

		if (model && model.collection)
		{
			model.collection.remove(model);
		}

		// Gets the id of the entity
		var entity_id = $(this).attr('id');

		if (model && model.toJSON().type == "WEB_APPOINTMENT" && parseInt(model.toJSON().start) > parseInt(new Date().getTime() / 1000))
		{
			web_event_title = model.toJSON().title;
			if (model.toJSON().contacts.length > 0)
			{
				var firstname = getPropertyValue(model.toJSON().contacts[0].properties, "first_name");
				if (firstname == undefined)
					firstname = "";
				var lastname = getPropertyValue(model.toJSON().contacts[0].properties, "last_name");
				if (lastname == undefined)
					lastname = "";
				web_event_contact_name = firstname + " " + lastname;
			}
			$("#webEventCancelModel").modal('show');
			$("#cancel_event_title").html("Delete event &#39" + web_event_title + "&#39");
			$("#event_id_hidden").html("<input type='hidden' name='event_id' id='event_id' value='" + entity_id + "'/>");
			return;
		}

		// Gets the url to which delete request is to be sent
		var entity_url = $(this).attr('url');

		if (!entity_url)
			return;

		var id_array = [];
		var id_json = {};

		// Create array with entity id.
		id_array.push(entity_id);

		// Set entity id array in to json object with key ids,
		// where ids are read using form param
		id_json.ids = JSON.stringify(id_array);
		var that = this;

		// Add loading. Adds loading only if there is no loaded image added
		// already i.e.,
		// to avoid multiple loading images on hitting delete multiple times
		if ($(this).find('.loading').length == 0)
			$(this).prepend($(LOADING_HTML).addClass('pull-left').css('width', "20px"));

		$.ajax({ url : entity_url, type : 'POST', data : id_json, success : function()
		{
			// Removes activity from list
			$(that).parents(".activity").fadeOut(400, function()
			{
				$(this).remove();
			});
			removeItemFromTimeline($("#" + entity_id, $("#timeline")));
		} });
	});



/**
	 * Displays activity modal with all task features,  to add a task 
	 * related to the contact in contact detail view. Also prepends the 
	 * contact name to related to field of activity modal.
	 */ 
	$('#contact-detail-listners').on('click', '.contact-add-task', function(e){ 
    	e.preventDefault();

    	var	el = $("#taskForm");
		$('#activityTaskModal').modal('show');
		highlight_task();
		// Displays contact name, to indicate the task is related to the contact
		fill_relation(el);
		agile_type_ahead("task_related_to", el, contacts_typeahead);

		// Fills owner select element
		populateUsers("owners-list", $("#taskForm"), undefined, undefined,
				function(data) {
					$("#taskForm").find("#owners-list").html(data);
					$("#owners-list", el).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
					$("#owners-list", $("#taskForm")).closest('div').find('.loading-img').hide();					
		});
    });
	
	/**
	 * Displays activity modal with all event features,  to add a event 
	 * related to the contact in contact detail view. Also prepends the 
	 * contact name to related to field of activity modal.
	 */ 
    $('#contact-detail-listners').on('click', '.contact-add-event', function(e){ 
    	e.preventDefault();

    	var	el = $("#activityForm");
		$('#activityModal').modal('show');
		highlight_event();
		// Displays contact name, to indicate the task is related to the contact
		fill_relation(el);
		agile_type_ahead("event_related_to", el, contacts_typeahead);

    });
    
    /**
     * Displays note modal, to add a note related to the contact in contact 
     * detail view. Also prepends the contact name to related to field of 
     * activity modal.  
     */ 
    $('#contact-detail-listners').on('click', '.contact-add-note', function(e){ 
    	e.preventDefault();
    	var	el = $("#noteForm");
    	
    	// Displays contact name, to indicate the note is related to the contact
    	fill_relation(el);
    	$('#noteModal').modal('show');
    	agile_type_ahead("note_related_to", el, contacts_typeahead);
     });



    $('#contact-detail-listners').on('click', '.task-edit-contact-tab', function(e)
	{
		e.preventDefault();
		var id = $(this).attr('data');
		var value = tasksView.collection.get(id).toJSON();
		deserializeForm(value, $("#updateTaskForm"));

		$("#updateTaskModal").modal('show');

		$('.update-task-timepicker').val(fillTimePicker(value.due));
		// Fills owner select element
		populateUsers("owners-list", $("#updateTaskForm"), value, 'taskOwner', function(data)
		{
			$("#updateTaskForm").find("#owners-list").html(data);
			if (value.taskOwner)
				$("#owners-list", $("#updateTaskForm")).find('option[value=' + value['taskOwner'].id + ']').attr("selected", "selected");

			$("#owners-list", $("#updateTaskForm")).closest('div').find('.loading-img').hide();
		});

		// Add notes in task modal
		showNoteOnForm("updateTaskForm", value.notes);
	});

	// Event edit in contact details tab
	$('#contact-detail-listners').on('click', '.event-edit-contact-tab', function(e)
					{
						e.preventDefault();
						var id = $(this).attr('data');
						var value = eventsView.collection.get(id).toJSON();
						deserializeForm(value, $("#updateActivityForm"));
						$("#updateActivityModal").modal('show');

						$('.update-start-timepicker').val(fillTimePicker(value.start));

						$('.update-end-timepicker').val(fillTimePicker(value.end));

						if (value.type == "WEB_APPOINTMENT" && parseInt(value.start) > parseInt(new Date().getTime() / 1000))
						{
							$("[id='event_delete']").attr("id", "delete_web_event");
							web_event_title = value.title;
							if (value.contacts.length > 0)
							{
								var firstname = getPropertyValue(value.contacts[0].properties, "first_name");
								if (firstname == undefined)
									firstname = "";
								var lastname = getPropertyValue(value.contacts[0].properties, "last_name");
								if (lastname == undefined)
									lastname = "";
								web_event_contact_name = firstname + " " + lastname;
							}
						}
						else
						{
							$("[id='delete_web_event']").attr("id", "event_delete");
						}
						if (value.description)
						{
							var description = '<label class="control-label"><b>Description </b></label><div class="controls"><textarea id="description" name="description" rows="3" class="input form-control" placeholder="Add Description"></textarea></div>'
							$("#event_desc").html(description);
							$("textarea#description").val(value.description);
						}
						else
						{
							var desc = '<div class="row-fluid">' + '<div class="control-group form-group m-b-none">' + '<a href="#" id="add_event_desctiption"><i class="icon-plus"></i> Add Description </a>' + '<div class="controls event_discription hide">' + '<textarea id="description" name="description" rows="3" class="input form-control w-full col-md-8" placeholder="Add Description"></textarea>' + '</div></div></div>'
							$("#event_desc").html(desc);
						}
						// Fills owner select element
						populateUsersInUpdateActivityModal(value);
					});
	
	$('#contact-detail-listners').on('click', '.complete-task', function(e)
	{
		e.preventDefault();
		if ($(this).is(':checked'))
		{
			var id = $(this).attr('data');
			var that = this;
			complete_task(id, tasksView.collection, undefined, function(data)
			{
				$(that).parent().siblings(".task-subject").css("text-decoration", "line-through");
				console.log($(that).parents('.activity-text-block').css("background-color", "#FFFAFA"));
				$(that).parent().replaceWith('<span style="margin-right:9px;"><i class="fa fa-check"></i></span>');
				tasksView.collection.add(data, { silent : true });
			});
		}
	});

	// For adding new deal from contact-details
	$('#contact-detail-listners').on('click', '.contact-add-deal', function(e)
	{
		e.preventDefault();
		var el = $("#opportunityForm");
		$("#opportunityModal").modal('show');

		add_custom_fields_to_form({}, function(data)
		{
			var el_custom_fields = show_custom_fields_helper(data["custom_fields"], [
				"modal"
			]);
			$("#custom-field-deals", $("#opportunityModal")).html($(el_custom_fields));

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

		// Enable the datepicker
		$('#close_date', el).datepicker({ format : 'mm/dd/yyyy', weekStart : CALENDAR_WEEK_START_DAY });

		var json = App_Contacts.contactDetailView.model.toJSON();
		var contact_name = getContactName(json);
		$('.tags', el).append('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="' + json.id + '">' + contact_name + '</li>');

	});

	// For updating a deal from contact-details
	$('#contact-detail-listners').on('click', '.deal-edit-contact-tab', function(e)
	{
		e.preventDefault();
		var id = $(this).attr('data');
		updateDeal(dealsView.collection.get(id));
	});

	// For Adding new case from contacts/cases
	$('#contact-detail-listners').on('click', '.contact-add-case', function(e)
	{
		e.preventDefault();
		var el = $("#casesForm");

		// Fills owner select element
		populateUsers("owners-list", el, undefined, undefined, function(data)
		{

			$("#casesForm").find("#owners-list").html(data);
			$("#owners-list", $("#casesForm")).find('option[value=' + CURRENT_DOMAIN_USER.id + ']').attr("selected", "selected");
			// Contacts type-ahead
			agile_type_ahead("contacts-typeahead-input", el, contacts_typeahead);

			// Enable the datepicker
			$('#close_date', el).datepicker({ format : 'mm/dd/yyyy', weekStart : CALENDAR_WEEK_START_DAY });

			var json = App_Contacts.contactDetailView.model.toJSON();
			var contact_name = getContactName(json);
			$('.tags', el).append('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="' + json.id + '">' + contact_name + '</li>');

			$("#casesModal").modal('show');
		});
	});

	// For updating a case from contact-details
	$('#contact-detail-listners').on('click', '.cases-edit-contact-tab', function(e)
	{
		e.preventDefault();
		var id = $(this).attr('data');
		updatecases(casesView.collection.get(id));
	});

	// Adding contact when user clicks Add contact button under Contacts tab in
	// Company Page
	$('#contact-detail-listners').on('click', '.contact-add-contact', function(e)
	{
		e.preventDefault();

		// This is a hacky method. ( See jscore/contact-management/modals.js for
		// its use )
		// 'forceCompany' is a global variable. It is used to enforce Company
		// name on Add Contact modal.
		// Prevents user from removing this company from the modal that is
		// shown.
		// Disables typeahead, as it won't be needed as there will be no Company
		// input text box.
		var json = App_Contacts.contactDetailView.model.toJSON();
		forceCompany.name = getContactName(json); // name of Company
		forceCompany.id = json.id; // id of Company
		forceCompany.doit = true; // yes force it. If this is false the
		// Company won't be forced.
		// Also after showing modal, it is set to false internally, so
		// Company is not forced otherwise.
		$('#personModal').modal('show');
	});

	// For adding new document from contact-details
	$('#contact-detail-listners').on('click', '.contact-add-document', function(e)
	{
		e.preventDefault();
		var el = $("#uploadDocumentForm");
		$("#uploadDocumentModal").modal('show');

		// Contacts type-ahead
		agile_type_ahead("document_relates_to_contacts", el, contacts_typeahead);

		// Deals type-ahead
		agile_type_ahead("document_relates_to_deals", el, deals_typeahead, false, null, null, "core/api/search/deals", false, true);

		var json = App_Contacts.contactDetailView.model.toJSON();
		var contact_name = getContactName(json);
		$('.tags', el).append('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="' + json.id + '">' + contact_name + '</li>');
	});

	// For updating document from contact-details
	$('#contact-detail-listners').on('click', '.document-edit-contact-tab', function(e)
	{
		e.preventDefault();
		var id = $(this).attr('data');
		updateDocument(documentsView.collection.get(id));
	});

	// For unlinking document from contact-details
	$('#contact-detail-listners').on('click', '.document-unlink-contact-tab', function(e)
	{
		e.preventDefault();
		var id = $(this).attr('data');
		var json = documentsView.collection.get(id).toJSON();

		// To get the contact id and converting into string
		var contact_id = App_Contacts.contactDetailView.model.id + "";

		// Removes the contact id from related to contacts
		json.contact_ids.splice(json.contact_ids.indexOf(contact_id), 1);

		// Updates the document object and hides
		var newDocument = new Backbone.Model();
		newDocument.url = 'core/api/documents';
		newDocument.save(json, { success : function(data)
		{
			documentsView.collection.remove(json);
			documentsView.render(true);
		} });
	});

	/**
	 * For showing new/existing documents
	 */
	$('#contact-detail-listners').on('click', '.add-document-select', function(e)
	{
		e.preventDefault();
		var el = $(this).closest("div");
		$(this).css("display", "none");
		el.find(".contact-document-select").css("display", "inline");
		var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
		fillSelect('document-select', 'core/api/documents', 'documents', function fillNew()
		{
			el.find("#document-select").append("<option value='new'>Add New Doc</option>");

		}, optionsTemplate, false, el);
	});

	/**
	 * To cancel the add documents request
	 */
	$('#contact-detail-listners').on('click', '.add-document-cancel', function(e)
	{
		e.preventDefault();
		var el = $("#documents");
		el.find(".contact-document-select").css("display", "none");
		el.find(".add-document-select").css("display", "inline-block");
	});

	/**
	 * For adding existing document to current contact
	 */
	$('#contact-detail-listners').on('click', '.add-document-confirm', function(e)
	{
		e.preventDefault();

		var document_id = $(this).closest(".contact-document-select").find("#document-select").val();

		var saveBtn = $(this);

		// To check whether the document is selected or not
		if (document_id == "")
		{
			saveBtn.closest("span").find(".save-status").html("<span style='color:red;margin-left:10px;'>This field is required.</span>");
			saveBtn.closest("span").find('span.save-status').find("span").fadeOut(5000);
			return;
		}
		else if (document_id == "new")
		{
			var el = $("#uploadDocumentForm");
			$("#uploadDocumentModal").modal('show');

			// Contacts type-ahead
			agile_type_ahead("document_relates_to_contacts", el, contacts_typeahead);

			// Deals type-ahead
			agile_type_ahead("document_relates_to_deals", el, deals_typeahead, false, null, null, "core/api/search/deals", false, true);

			var json = App_Contacts.contactDetailView.model.toJSON();
			var contact_name = getContactName(json);
			$('.tags', el).append('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="' + json.id + '">' + contact_name + '</li>');
		}
		else if (document_id != undefined && document_id != null)
		{
			if (!existingDocumentsView)
			{
				existingDocumentsView = new Base_Collection_View({ url : 'core/api/documents', restKey : "documents", });
				existingDocumentsView.collection.fetch({ success : function(data)
				{
					existing_document_attach(document_id, saveBtn);
				} });
			}
			else
				existing_document_attach(document_id, saveBtn);
		}

	});


	$('#contact-detail-listners').on('click', '.task-edit-contact-tab', function(e)
	{
		e.preventDefault();
		var id = $(this).attr('data');
		var value = tasksView.collection.get(id).toJSON();
		deserializeForm(value, $("#updateTaskForm"));

		$("#updateTaskModal").modal('show');

		$('.update-task-timepicker').val(fillTimePicker(value.due));
		// Fills owner select element
		populateUsers("owners-list", $("#updateTaskForm"), value, 'taskOwner', function(data)
		{
			$("#updateTaskForm").find("#owners-list").html(data);
			if (value.taskOwner)
				$("#owners-list", $("#updateTaskForm")).find('option[value=' + value['taskOwner'].id + ']').attr("selected", "selected");

			$("#owners-list", $("#updateTaskForm")).closest('div').find('.loading-img').hide();
		});

		// Add notes in task modal
		showNoteOnForm("updateTaskForm", value.notes);
	});

	// Event edit in contact details tab
	$('#contact-detail-listners').on('click', '.event-edit-contact-tab', function(e)
					{
						e.preventDefault();
						var id = $(this).attr('data');
						var value = eventsView.collection.get(id).toJSON();
						deserializeForm(value, $("#updateActivityForm"));
						$("#updateActivityModal").modal('show');

						$('.update-start-timepicker').val(fillTimePicker(value.start));

						$('.update-end-timepicker').val(fillTimePicker(value.end));

						if (value.type == "WEB_APPOINTMENT" && parseInt(value.start) > parseInt(new Date().getTime() / 1000))
						{
							$("[id='event_delete']").attr("id", "delete_web_event");
							web_event_title = value.title;
							if (value.contacts.length > 0)
							{
								var firstname = getPropertyValue(value.contacts[0].properties, "first_name");
								if (firstname == undefined)
									firstname = "";
								var lastname = getPropertyValue(value.contacts[0].properties, "last_name");
								if (lastname == undefined)
									lastname = "";
								web_event_contact_name = firstname + " " + lastname;
							}
						}
						else
						{
							$("[id='delete_web_event']").attr("id", "event_delete");
						}
						if (value.description)
						{
							var description = '<label class="control-label"><b>Description </b></label><div class="controls"><textarea id="description" name="description" rows="3" class="input form-control" placeholder="Add Description"></textarea></div>'
							$("#event_desc").html(description);
							$("textarea#description").val(value.description);
						}
						else
						{
							var desc = '<div class="row-fluid">' + '<div class="control-group form-group m-b-none">' + '<a href="#" id="add_event_desctiption"><i class="icon-plus"></i> Add Description </a>' + '<div class="controls event_discription hide">' + '<textarea id="description" name="description" rows="3" class="input form-control w-full col-md-8" placeholder="Add Description"></textarea>' + '</div></div></div>'
							$("#event_desc").html(desc);
						}
						// Fills owner select element
						populateUsersInUpdateActivityModal(value);
					});
	
	$('#contact-detail-listners').on('click', '.complete-task', function(e)
	{
		e.preventDefault();
		if ($(this).is(':checked'))
		{
			var id = $(this).attr('data');
			var that = this;
			complete_task(id, tasksView.collection, undefined, function(data)
			{
				$(that).parent().siblings(".task-subject").css("text-decoration", "line-through");
				console.log($(that).parents('.activity-text-block').css("background-color", "#FFFAFA"));
				$(that).parent().replaceWith('<span style="margin-right:9px;"><i class="fa fa-check"></i></span>');
				tasksView.collection.add(data, { silent : true });
			});
		}
	});

	// For adding new deal from contact-details
	$('#contact-detail-listners').on('click', '.contact-add-deal', function(e)
	{
		e.preventDefault();
		var el = $("#opportunityForm");
		$("#opportunityModal").modal('show');

		add_custom_fields_to_form({}, function(data)
		{
			var el_custom_fields = show_custom_fields_helper(data["custom_fields"], [
				"modal"
			]);
			$("#custom-field-deals", $("#opportunityModal")).html($(el_custom_fields));

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

		// Enable the datepicker
		$('#close_date', el).datepicker({ format : 'mm/dd/yyyy', weekStart : CALENDAR_WEEK_START_DAY });

		var json = App_Contacts.contactDetailView.model.toJSON();
		var contact_name = getContactName(json);
		$('.tags', el).append('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="' + json.id + '">' + contact_name + '</li>');

	});

	// For updating a deal from contact-details
	$('#contact-detail-listners').on('click', '.deal-edit-contact-tab', function(e)
	{
		e.preventDefault();
		var id = $(this).attr('data');
		updateDeal(dealsView.collection.get(id));
	});

	// For Adding new case from contacts/cases
	$('#contact-detail-listners').on('click', '.contact-add-case', function(e)
	{
		e.preventDefault();
		var el = $("#casesForm");

		// Fills owner select element
		populateUsers("owners-list", el, undefined, undefined, function(data)
		{

			$("#casesForm").find("#owners-list").html(data);
			$("#owners-list", $("#casesForm")).find('option[value=' + CURRENT_DOMAIN_USER.id + ']').attr("selected", "selected");
			// Contacts type-ahead
			agile_type_ahead("contacts-typeahead-input", el, contacts_typeahead);

			// Enable the datepicker
			$('#close_date', el).datepicker({ format : 'mm/dd/yyyy', weekStart : CALENDAR_WEEK_START_DAY });

			var json = App_Contacts.contactDetailView.model.toJSON();
			var contact_name = getContactName(json);
			$('.tags', el).append('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="' + json.id + '">' + contact_name + '</li>');

			$("#casesModal").modal('show');
		});
	});

	// For updating a case from contact-details
	$('#contact-detail-listners').on('click', '.cases-edit-contact-tab', function(e)
	{
		e.preventDefault();
		var id = $(this).attr('data');
		updatecases(casesView.collection.get(id));
	});

	// Adding contact when user clicks Add contact button under Contacts tab in
	// Company Page
	$('#contact-detail-listners').on('click', '.contact-add-contact', function(e)
	{
		e.preventDefault();

		// This is a hacky method. ( See jscore/contact-management/modals.js for
		// its use )
		// 'forceCompany' is a global variable. It is used to enforce Company
		// name on Add Contact modal.
		// Prevents user from removing this company from the modal that is
		// shown.
		// Disables typeahead, as it won't be needed as there will be no Company
		// input text box.
		var json = App_Contacts.contactDetailView.model.toJSON();
		forceCompany.name = getContactName(json); // name of Company
		forceCompany.id = json.id; // id of Company
		forceCompany.doit = true; // yes force it. If this is false the
		// Company won't be forced.
		// Also after showing modal, it is set to false internally, so
		// Company is not forced otherwise.
		$('#personModal').modal('show');
	});

	// For adding new document from contact-details
	$('#contact-detail-listners').on('click', '.contact-add-document', function(e)
	{
		e.preventDefault();
		var el = $("#uploadDocumentForm");
		$("#uploadDocumentModal").modal('show');

		// Contacts type-ahead
		agile_type_ahead("document_relates_to_contacts", el, contacts_typeahead);

		// Deals type-ahead
		agile_type_ahead("document_relates_to_deals", el, deals_typeahead, false, null, null, "core/api/search/deals", false, true);

		var json = App_Contacts.contactDetailView.model.toJSON();
		var contact_name = getContactName(json);
		$('.tags', el).append('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="' + json.id + '">' + contact_name + '</li>');
	});

	// For updating document from contact-details
	$('#contact-detail-listners').on('click', '.document-edit-contact-tab', function(e)
	{
		e.preventDefault();
		var id = $(this).attr('data');
		updateDocument(documentsView.collection.get(id));
	});

	// For unlinking document from contact-details
	$('#contact-detail-listners').on('click', '.document-unlink-contact-tab', function(e)
	{
		e.preventDefault();
		var id = $(this).attr('data');
		var json = documentsView.collection.get(id).toJSON();

		// To get the contact id and converting into string
		var contact_id = App_Contacts.contactDetailView.model.id + "";

		// Removes the contact id from related to contacts
		json.contact_ids.splice(json.contact_ids.indexOf(contact_id), 1);

		// Updates the document object and hides
		var newDocument = new Backbone.Model();
		newDocument.url = 'core/api/documents';
		newDocument.save(json, { success : function(data)
		{
			documentsView.collection.remove(json);
			documentsView.render(true);
		} });
	});

	/**
	 * For showing new/existing documents
	 */
	$('#contact-detail-listners').on('click', '.add-document-select', function(e)
	{
		e.preventDefault();
		var el = $(this).closest("div");
		$(this).css("display", "none");
		el.find(".contact-document-select").css("display", "inline");
		var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
		fillSelect('document-select', 'core/api/documents', 'documents', function fillNew()
		{
			el.find("#document-select").append("<option value='new'>Add New Doc</option>");

		}, optionsTemplate, false, el);
	});

	/**
	 * To cancel the add documents request
	 */
	$('#contact-detail-listners').on('click', '.add-document-cancel', function(e)
	{
		e.preventDefault();
		var el = $("#documents");
		el.find(".contact-document-select").css("display", "none");
		el.find(".add-document-select").css("display", "inline-block");
	});

	/**
	 * For adding existing document to current contact
	 */
	$('#contact-detail-listners').on('click', '.add-document-confirm', function(e)
	{
		e.preventDefault();

		var document_id = $(this).closest(".contact-document-select").find("#document-select").val();

		var saveBtn = $(this);

		// To check whether the document is selected or not
		if (document_id == "")
		{
			saveBtn.closest("span").find(".save-status").html("<span style='color:red;margin-left:10px;'>This field is required.</span>");
			saveBtn.closest("span").find('span.save-status').find("span").fadeOut(5000);
			return;
		}
		else if (document_id == "new")
		{
			var el = $("#uploadDocumentForm");
			$("#uploadDocumentModal").modal('show');

			// Contacts type-ahead
			agile_type_ahead("document_relates_to_contacts", el, contacts_typeahead);

			// Deals type-ahead
			agile_type_ahead("document_relates_to_deals", el, deals_typeahead, false, null, null, "core/api/search/deals", false, true);

			var json = App_Contacts.contactDetailView.model.toJSON();
			var contact_name = getContactName(json);
			$('.tags', el).append('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="' + json.id + '">' + contact_name + '</li>');
		}
		else if (document_id != undefined && document_id != null)
		{
			if (!existingDocumentsView)
			{
				existingDocumentsView = new Base_Collection_View({ url : 'core/api/documents', restKey : "documents", });
				existingDocumentsView.collection.fetch({ success : function(data)
				{
					existing_document_attach(document_id, saveBtn);
				} });
			}
			else
				existing_document_attach(document_id, saveBtn);
		}

	});


	//Upload contact image
	$('#contact-detail-listners').on('click', '.upload_pic', function (e) {
		e.preventDefault();
		uploadImage("contact-container");
	});
	
	//Upload personal prefs
	$('#contact-detail-listners').on('click', '.upload_prefs_s3', function (e) {
		e.preventDefault();
		uploadImage("upload-in-modal");
	});


}