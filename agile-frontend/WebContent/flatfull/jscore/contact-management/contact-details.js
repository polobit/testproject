/**
 * Loads, minified jquery.raty plug-in to show stars to rate a contact in its  
 * detail view and highlights the (no.of) stars based on star_value of the contact.
 * 
 * @method starify 
 * @param {Object} el
 * 			html object of contact detail view
 */
function starify(el) {
    head.js(LIB_PATH + 'lib/jquery.raty.min.js', function(){
    	
    	var contact_model  =  App_Contacts.contactDetailView.model;
    	
    	// If contact update is not allowed then start rating does not allow user to change it
    	if(App_Contacts.contactDetailView.model.get('owner') && !canEditContact(App_Contacts.contactDetailView.model.get('owner').id))
    	{
    			$('#star', el).raty({
    			 'readOnly': true,
    			  score: App_Contacts.contactDetailView.model.get('star_value')
    			 });
    		 return;
    	}
    	
    	// Set URL - is this required?
    	// contact_model.url = 'core/api/contacts';    	
    	$('#star', el).raty({
    		
    		/**
    		 * When a star is clicked, the position of the star is set as star_value of
    		 * the contact and saved.    
    		 */
        	click: function(score, evt) {
        	         		
           		
        		App_Contacts.contactDetailView.model.set({'star_value': score}, {silent : true});
        		contact_model =  App_Contacts.contactDetailView.model.toJSON();
        		var new_model = new Backbone.Model();
        		new_model.url = 'core/api/contacts';
        		new_model.save(contact_model, {
        			success: function(model){
        			}
        		});

        	},
        	
        	/**
        	 * Highlights the stars based on star_value of the contact
        	 */
        	score: contact_model.get('star_value')
            
        });
    });
    
}

/**
 * Check whether there are any updates in the displaying contact.
 * If there are any updates, show the refresh contact button.
 */
function checkContactUpdated(){
	var contact_model  =  App_Contacts.contactDetailView.model;
	
	var contact_id = contact_model.id;
	var updated_time = contact_model.attributes.updated_time;

		queueGetRequest("contact_queue" + contact_id, "/core/api/contacts/" + contact_id + "/isUpdated?updated_time=" + updated_time, "", function success(data)
		{
			// If true show refresh contact button.
			if (data == 'true')
			{
				// Download
				var contact_details_model = Backbone.Model.extend({ 
					url : function(){
							return '/core/api/contacts/' + contact_id;
					}
				});
                
				var model = new contact_details_model();
				model.id = id;
				model.fetch({ success : function(data){
					
					var old_updated_time = contact_model.attributes.updated_time;
					
					var new_updated_time = model.attributes.updated_time;
					
					// Update Model
					if(old_updated_time != new_updated_time)
					{
						App_Contacts.contactDetailView.model.set(model);
//						$('#refresh_contact').hide();
					}

				    }
				});
				
				$('#refresh_contact').show();
			}
				
			
			
		}, function error(data)
		{
			// Error message is shown
			
		});
}

/**
 * Shows all the domain users names as ul drop down list 
 * to change the owner of a contact 
 */
function fill_owners(el, data, callback){
	var optionsTemplate = "<li><a class='contact-owner-list' data='{{id}}'>{{name}}</a></li>";
	if(company_util.isCompany())
		optionsTemplate = "<li><a class='company-owner-list' data='{{id}}'>{{name}}</a></li>";
	
    fillSelect('contact-detail-owner','/core/api/users', 'domainUsers', callback, optionsTemplate, true); 
}

/**
 * To show owner on change
 */
function show_owner(){
	$('.contact-owner-pic').css('visibility', 'visible');
	$('#contact-owner').css('display', 'inline-block');
}

/**
 * To download vcard
 */
function qr_load(){
	head.js(LIB_PATH + 'lib/downloadify.min.js', LIB_PATH + 'lib/swfobject.js',  function(){
		  Downloadify.create('downloadify',{
		    filename: function(){
		      return agile_crm_get_contact_property("first_name") + ".vcf";
		    },
		    data: function(){
		      return $('#qr_code').attr('data');
		    },
		    /*onComplete: function(){ 
		      alert('Your File Has Been Saved!'); 
		    },
		    onCancel: function(){ 
		      alert('You have cancelled the saving of this file.');
		    },*/
		    onError: function(){ 
		      alert('Error downloading a file!'); 
		    },
		    transparent: false,
		    swf: 'media/downloadify.swf',
		    downloadImage: 'img/download.png',
		    width: 36,
		    height: 30,
		    transparent: true,
		    append: false
		  });
		});
}

/**
 * To navigate from one contact detail view to other
 */
function contact_detail_view_navigation(id, contact_list_view, el){
	console.log("collection >>>>>>>>>>>>>>>>");
	console.log(contact_collection);
	var contact_collection = contact_list_view.collection;
	var collection_length = contact_collection.length;
    var current_index = contact_collection.indexOf(contact_collection.get(id));
    var previous_contact_id;
    var next_contact_id;
    //fetch next set so that next link will work further.
    if(collection_length <= current_index+5) {
    	contact_list_view.infiniScroll.fetchNext();
    }
    if (collection_length > 1 && current_index < collection_length && contact_collection.at(current_index + 1) && contact_collection.at(current_index + 1).has("id")) {
     
    	next_contact_id = contact_collection.at(current_index + 1).id
    }

    if (collection_length > 0 && current_index != 0 && contact_collection.at(current_index - 1) && contact_collection.at(current_index - 1).has("id")) {

    	previous_contact_id = contact_collection.at(current_index - 1).id
    }

    if(previous_contact_id != null)
    	$('.navigation', el).append('<a style="float:left;" href="#contact/' + previous_contact_id + '" class="" onclick="clearContactWidetQueues(' + id + ')"><i class="icon icon-chevron-left"></i></a>');
    if(next_contact_id != null)
    	$('.navigation', el).append('<a style="float:right;" href="#contact/'+ next_contact_id + '" class="" onclick="clearContactWidetQueues(' + id + ')"><i class="icon icon-chevron-right"></i></a>');
	
}


/**
* Clear all contact related widget queue requests
*/
function clearContactWidetQueues(contactId){

	if(!contactId || !document.ajaxq)
		  return;
		
	queueClear("_widgets_" + contactId);
	queueClear("widgets_" + contactId);
	queueClear("widget_queue_"+contactId);

}

$(function(){
   $('body').on('mouseenter', '.tooltip_info', function(e){
		 $(this).tooltip({
			 html : true
		 });
		 $(this).tooltip('show');
	});

   // Makes the score section unselectable, when clicked on it
	$('#score').children().attr('unselectable', 'on');
	
});

/**
*  Contact detailed view event listeners
*/
var Contact_Details_Model_Events = Base_Model_View.extend({
   
    events: {
    	'click #change-owner-element>#contact-owner' : 'onChangeOwner',
    	'click .contact-owner-list' : 'onChangeOwnerSelected',
    	'click #change-owner-element>.contact-owner-add' : 'onAddContactOwner',
    	'click #contact-actions-delete' : 'onContactDelete',
    	'click .remove-tags' : 'onRemoveContactTag',
    	'click #add-tags' : 'onAddContactTag',
    	'click #contact-add-tags' : 'onAddContactTags',
    	'click #disable_map_view' : 'onDisableMapView',
    	'click #enable_map_view' : 'onEnableMapView',
    	'click #add' : 'onAddScore',
    	'click #minus' : 'onRemoveScore',
    	
    	
    	'click .email-subject' : 'onEmailSubjectClick',
    	'click #show-page-views' : 'openPageViews',
    	'click .remove-active-campaign' : 'onRemoveCampaigns',
    	'click #contactDetailsTab a[href="#timeline"]' : 'onTimeLineOpen',
    	'click #contactDetailsTab a[href="#notes"]' : 'openNotes',
    	'click #contactDetailsTab a[href="#events"]' : 'openEvents',
    	'click #contactDetailsTab a[href="#documents"]' : 'openDocuments',
    	'click #contactDetailsTab a[href="#tasks"]' : 'openTasks',
    	'click #contactDetailsTab a[href="#deals"]' : 'openDeals',
    	'click #contactDetailsTab a[href="#cases"]' : 'openCases',
    	'click #contactDetailsTab a[href="#mail"]' : 'openMails',
    	'click #contactDetailsTab a[href="#stats"]' : 'openWebStats',
    	'click #contactDetailsTab a[href="#campaigns"]' : 'openCampaigns',
    	'click .agile-emails' : 'openEmails',
    	'click #email-reply' : 'repltToEmails',
    	'click .activity-delete' : 'deleteActivity',
    	'click #action_refresh_contact' : 'reloadContact',

    	'click .contact-add-task' : 'addTask',
    	'click .contact-add-event' : 'addEvent',
    	'click .contact-add-note' : 'addNote',
    	'click .contact-add-campaign,.add-to-campaign' : 'addToCampaign',

    	'click .task-edit-contact-tab' : 'editTask',
    	'click .event-edit-contact-tab' : 'editEvent',
    	'click .complete-task' : 'completeTask',
    	'click .contact-add-deal' : 'addDeal',
    	'click .deal-edit-contact-tab' : 'editDeal',
    	'click .contact-add-case' : 'addCase',
    	'click .cases-edit-contact-tab' : 'editCase',
    	'click .contact-add-contact' : 'addContact',
    	'click .contact-add-document' : 'addDocument',
    	'click .document-edit-contact-tab' : 'editDocument',
    	'click .document-unlink-contact-tab' : 'unlinkDocument',
    	'click .add-document-select' : 'listDocuments',
    	'click .add-document-cancel' : 'cancelDocuments',
    	'click .add-document-confirm' : 'addSelectedDocument',

    	'click #contacts-inner-tabs #next' : 'tabViewNext',
    	'click #contacts-inner-tabs #prev' : 'tabViewPrev',

    	/** Company events **/
    	'click #contactDetailsTab a[href="#company-contacts"]' : 'listCompanyContacts',
    	'click #contactDetailsTab a[href="#company-deals"]' : 'listCompanyDeals',
    	'click #contactDetailsTab a[href="#company-cases"]' : 'listCompanyCases',
    	'click #contactDetailsTab a[href="#company-notes"]' : 'listCompanyNotes',
    	'click #contactDetailsTab a[href="#company-documents"]' : 'listCompanyDocuments',
    	'click #company-add-tags' : 'addCompanytags',
    	'keydown #companyAddTags' : 'companyAddTags',
    	'click #company-actions-delete' : 'companyDelete',
    	'click .company-owner-list' : 'companyOwnerList',
    	'click .remove-company-tags' : 'removeCmpanyTags',

    	'click #contact-actions-grid-delete' : 'contactActionsGridDelete',
    },


	contactActionsGridDelete: function(e){
		
		e.preventDefault();
		var contact_id=$(e.currentTarget).attr('con_id');
    	var model=App_Contacts.contactsListView.collection.get(contact_id);
		$('#deleteGridContactModal').modal('show');

		$('#deleteGridContactModal').on("shown.bs.modal", function(){

				// If Yes clicked
		   $('#deleteGridContactModal').on('click', '#delete_grid_contact_yes', function(e) {
				e.preventDefault();
				// Delete Contact.
				$.ajax({
    					url: 'core/api/contacts/' + contact_id,
       					type: 'DELETE',
       					success: function()
       					{
       						$('#deleteGridContactModal').modal('hide');
       						App_Contacts.contactsListView.collection.remove(model);
       						if(App_Contacts.contact_custom_view)
       						App_Contacts.contact_custom_view.collection.remove(model);
       						CONTACTS_HARD_RELOAD=true;
       						App_Contacts.contacts();
       					}
       				});
			});


		   $('#deleteGridContactModal').on('click', '#delete_grid_contact_no', function(e) {
				e.preventDefault();
				if($(this).attr('disabled'))
			   	     return;
				$('#deleteGridContactModal').modal('hide');
			});

		});

    		
	},

	/**
	 * Get the updated details of the contact and update the model.
	 */
	reloadContact :  function(e){
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
	},

   	/**
	 * Sets cookie when user changes email dropdown under mail tab. Cookie
	 * contains email server, email name from next time application loads from
	 * emails from this email server and email
	 */
	openEmails :  function(e)
	{
		e.preventDefault();
		var targetEl = $(e.currentTarget);

		var email_server = $(targetEl).attr('email-server');
		var url = $(targetEl).attr('data-url');
		$('#email-type-select', App_Contacts.contactDetailView.el).html($(targetEl).html());
		// Here email_server_type means email/username of mail account
		email_server_type = $(targetEl).attr('email-server-type');
		if (email_server && url && (email_server != 'agile'))
			url = url.concat(email_server_type);

		var cookie_value = email_server_type + '|' + email_server;
		save_email_server_type_in_cookie(cookie_value);
		contact_details_tab.load_mail(url, email_server);
	},

	

    repltToEmails :  function(e)
			{
				e.preventDefault();
				Contact_Details_Tab_Actions.replyToEmail(e);
			},

	
	deleteActivity : function(e)
	{
		e.preventDefault();

		Contact_Details_Tab_Actions.deleteActivity(e);
	},


	/**
	 * Gets every conversation of the contact (if it has email) with the
	 * associated email (gmail or imap) in Email-preferences of this CRM, when
	 * "Mail" tab is clicked.
	 */
	openMails : function(e)
	{
		e.preventDefault();
		email_server_type = "agilecrm"
		save_contact_tab_position_in_cookie("mail");
		contact_details_tab.load_mail();
	},

	/**
	 * Gets the activities of a contact from browsing history, using its email.
	 * To do so the email should be run in analytics script provided by
	 * agileCRM.
	 */
	 openWebStats : function(e)
	{
		e.preventDefault();
		save_contact_tab_position_in_cookie("stats");
		contact_details_tab.load_stats();

	},

	/**
	 * Fetches all the logs of the campaigns that the contact is subscribed to
	 * and shows them in a table. Also shows a campaigns drop down list to
	 * subscribe the contact to the selected campaign.
	 */
	openCampaigns : function(e)
	{
		e.preventDefault();
		save_contact_tab_position_in_cookie("campaigns");
		contact_details_tab.load_campaigns();
	},


	/**
	 * Fetches all the deals related to the contact and shows the deals
	 * collection as a table in its tab-content, when "Deals" tab is clicked.
	 */
	openDeals : function(e)
	{
		e.preventDefault();
		save_contact_tab_position_in_cookie("deals");
		contact_details_tab.load_deals();
	},

	/**
	 * Fetches all the cases related to the contact and shows the collection.
	 */
	openCases :  function(e)
	{
		e.preventDefault();
		save_contact_tab_position_in_cookie("cases");

		contact_details_tab.load_cases();
	},

	/**
	 * Fetches all the notes related to the contact and shows the tasks
	 * collection as a table in its tab-content, when "Tasks" tab is clicked.
	 */
	openTasks :  function(e)
	{
		e.preventDefault();
		save_contact_tab_position_in_cookie("tasks");
		contact_details_tab.load_tasks();
	},


	/**
	 * Fetches all the documents related to the contact and shows the documents
	 * collection as a table in its tab-content, when "Documents" tab is
	 * clicked.
	 */
	openDocuments : function(e){
		e.preventDefault();
		save_contact_tab_position_in_cookie("documents");
		contact_details_tab.load_documents();
	},

	onTimeLineOpen : function(e){
		e.preventDefault();
		Contact_Details_Tab_Actions.openTimeLine(e);
	},
	onEmailSubjectClick : function(e){
		e.preventDefault();
		Contact_Details_Tab_Actions.onEmailSubjectClick(e);	
	},
	openPageViews : function(e){
		e.preventDefault();
		Contact_Details_Tab_Actions.showPageViews(e);	
	},
	onRemoveCampaigns : function(e){
		e.preventDefault();
		Contact_Details_Tab_Actions.removeActiveCampaigns(e);		

	},
	openNotes : function(e){
		e.preventDefault();
		Contact_Details_Tab_Actions.showNotes(e);	
	},
	openEvents : function(e){
		e.preventDefault();
		Contact_Details_Tab_Actions.showEvents(e);
	},

    // Change owner of the contact
    onChangeOwner : function(e){
         e.preventDefault();
         fill_owners(undefined, undefined, function(){

	    	$('#contact-owner').css('display', 'none');

	    	$('#change-owner-ul').css('display', 'inline-block');
	    	if($('#change-owner-element > #change-owner-ul').css('display') == 'inline-block')
	             $("#change-owner-element").find(".loading").remove();
		});
    },

    /**
	 * Changes, owner of the contact, when an option of change owner drop down
	 * is selected.   
	 */
    onChangeOwnerSelected : function(e){
      	e.preventDefault();
    	var targetEl = $(e.currentTarget);

    	$('#change-owner-ul').css('display', 'none');
		
		// Reads the owner id from the selected option
		var new_owner_id = $(targetEl).attr('data');
		var new_owner_name = $(targetEl).text();
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
    	   
    },

    // Deletes a contact from database
    onContactDelete : function(e){

    	e.preventDefault();
		if(!confirm("Do you want to delete the contact?"))
    		return;
		
		App_Contacts.contactDetailView.model.url = "core/api/contacts/" + App_Contacts.contactDetailView.model.id;
		App_Contacts.contactDetailView.model.destroy({success: function(model, response) {
			  Backbone.history.navigate("contacts",{trigger: true});
		}});
    },

    /**
	 * Deletes a tag of a contact (removes the tag from the contact and saves the contact)
	 */ 
    onRemoveContactTag : function(e){

    	e.preventDefault();
    	var targetEl = $(e.currentTarget);

		var tag = $(targetEl).attr("tag");
		removeItemFromTimeline($("#" +  tag.replace(/ +/g, '') + '-tag-timeline-element', $('#timeline')).parent('.inner'))
		console.log($(targetEl).closest("li").parent('ul').append(getRandomLoadingImg()));
		
     	var json = App_Contacts.contactDetailView.model.toJSON();
     	
     	// Returns contact with deleted tag value
     	json = delete_contact_tag(json, tag);
     	var that = targetEl;
     	
     	// Unbinds click so user cannot select delete again
     	$(targetEl).unbind("click");
     	
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
	
    },

    /**
	 * Shows a form to add tags with typeahead option
	 */ 
    onAddContactTag : function(e){
    	e.preventDefault();

		$(e.currentTarget).css("display", "none");
		$("#addTagsForm").css("display", "block");
		$("#addTags").focus();
		setup_tags_typeahead();
	
    },

    /**
	 * "click" event of add button of tags form in contact detail view
	 * Pushes the added tags into tags array attribute of the contact and saves it
	 */ 
	 onAddContactTags : function(e){
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
   		  	  	$(e.currentTarget).val("");
   		  	});
	    	
	    	// Checks if tag already exists in contact
			if($.inArray(new_tags, json.tags) >= 0)
				return;
			acl_util.canAddTag(new_tags.toString(),function(respnse){
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
		       		},
		       		error: function(model,response){
		       			console.log(response);
		       			alert(response.responseText);
		       		}
		        });
			});
		}
	 },

	 onAddContactOwner :  function(e){
         e.preventDefault();

    	fill_owners(undefined, undefined, function(){

        	$('.contact-owner-add').css('display', 'none');

        	$('#change-owner-ul').css('display', 'inline-block');
        	$('#change-owner-ul').addClass("open");
        	
        	if($('#change-owner-element > #change-owner-ul').css('display') == 'inline-block')
        		 $("#change-owner-element").find(".loading").remove();
    	});
    },

    onDisableMapView : function(e){
		e.preventDefault();
		_agile_set_prefs('MAP_VIEW','disabled');
		
		$("#map").css('display', 'none');
		$("#contacts-local-time").hide();
		$("#map_view_action").html("<i class='icon-plus text-sm c-p' title='Show map' id='enable_map_view'></i>");
		
    },

	onEnableMapView :  function(e){
		e.preventDefault();
		_agile_set_prefs('MAP_VIEW','enabled');
		
		if(company_util.isCompany())
			company_util.show_map();
		else
			show_map();
		
		
	},

	/**
	 * Adds score to a contact (both in UI and back end)
	 * When '+' symbol is clicked in contact detail view score section, the score
	 * gets increased by one, both in UI and back end
	 * 
	 */  
	onAddScore :  function(e){
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
		          
	},
	
	   
	/**
	 * Subtracts score of a contact (both in UI and back end)
	 * When '-' symbol is clicked in contact detail view score section, the score
	 * gets decreased by one, both in UI and back end
	 * 
	 */
	onRemoveScore :  function(e){
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
	},


    addTask : function(e){
    	e.preventDefault();
        contact_detail_tab_actions.add_task(e);
    },
    addEvent : function(e){
    	e.preventDefault();
        contact_detail_tab_actions.add_event(e);
    }, 
    addNote :  function(e){
    	e.preventDefault();
         contact_detail_tab_actions.add_note(e);       
    }, 
    addToCampaign :  function(e){
    	e.preventDefault();
         contact_detail_tab_actions.add_to_campaign(e);
    }, 

    editTask : function(e)
	{
		e.preventDefault();
		contact_details_documentandtasks_actions.edit_task(e);
	},

	editEvent : function(e)
	{
		e.preventDefault();
		contact_details_documentandtasks_actions.edit_event(e);
		
	},

	completeTask :  function(e)
	{
		e.preventDefault();
		contact_details_documentandtasks_actions.complete_task(e);
		
	},
	
	addDeal : function(e)
	{
		e.preventDefault();
		contact_details_documentandtasks_actions.add_deal(e);

	},

	// For updating a deal from contact-details
	editDeal :  function(e)
	{
		e.preventDefault();
		var id = $(e.currentTarget).attr('data');
		updateDeal(dealsView.collection.get(id));
	},

	// For Adding new case from contacts/cases
	addCase :  function(e)
	{
		e.preventDefault();
		contact_details_documentandtasks_actions.add_case(e);
	},

	// For updating a case from contact-details
	editCase : function(e)
	{
		e.preventDefault();
		var id = $(e.currentTarget).attr('data');
		updatecases(casesView.collection.get(id));
	},

	// Adding contact when user clicks Add contact button under Contacts tab in
	// Company Page
	addContact : function(e)
	{
		e.preventDefault();
		contact_details_documentandtasks_actions.add_contact(e);
		
	},

	// For adding new document from contact-details
	addDocument :  function(e)
	{
		e.preventDefault();
		contact_details_documentandtasks_actions.add_document(e);
	},

	// For updating document from contact-details
	editDocument : function(e)
	{
		e.preventDefault();
		var id = $(e.currentTarget).attr('data');
		updateDocument(documentsView.collection.get(id));
	},

	// For unlinking document from contact-details
	unlinkDocument :  function(e)
	{
		e.preventDefault();
		contact_details_documentandtasks_actions.document_unlink(e);
		
	},

	/**
	 * For showing new/existing documents
	 */
	listDocuments :  function(e)
	{
		e.preventDefault();
		contact_details_documentandtasks_actions.show_document_list(e);
	},

	/**
	 * To cancel the add documents request
	 */
	cancelDocuments :  function(e)
	{
		e.preventDefault();
		var el = $("#documents");
		el.find(".contact-document-select").css("display", "none");
		el.find(".add-document-select").css("display", "inline-block");
	},

	/**
	 * For adding existing document to current contact
	 */
	addSelectedDocument : function(e)
	{
		e.preventDefault();
		contact_details_documentandtasks_actions.add_selected_document(e);

	},

	tabViewNext :  function(e){
	  console.log("next clicked");
	    var target = $("#contactDetailsTab");
	    target.animate({ scrollLeft : (target.scrollLeft() + 270)},1000);
	  },
	  
	  tabViewPrev :  function(e){
		   console.log("prev clicked");
	    var target = $("#contactDetailsTab");
	    target.animate({ scrollLeft : (target.scrollLeft() - 270)},1000);
	  },

	  listCompanyContacts :  function(e)
	{
		e.preventDefault();
		fill_company_related_contacts(App_Companies.companyDetailView.model.id, 'company-contacts');
	},

	/**
	 * Fetches all the deals related to the contact and shows the deals
	 * collection as a table in its tab-content, when "Deals" tab is clicked.
	 */
	listCompanyDeals : function(e)
	{
		e.preventDefault();
		save_contact_tab_position_in_cookie("deals");
		company_detail_tab.load_company_deals();
	},

	/**
	 * Fetches all the cases related to the contact and shows the collection.
	 */
	listCompanyCases :  function(e)
	{
		e.preventDefault();
		save_contact_tab_position_in_cookie("cases");

		company_detail_tab.load_company_cases();
	},
		
	/**
	 * Fetches all the notes related to the contact and shows the notes
	 * collection as a table in its tab-content, when "Notes" tab is clicked.
	 */
	listCompanyNotes :  function(e)
	{
		e.preventDefault();
		save_contact_tab_position_in_cookie("notes");
		company_detail_tab.load_company_notes();
	},
	
	/**
	 * Fetches all the documents related to the contact and shows the documents
	 * collection as a table in its tab-content, when "Documents" tab is
	 * clicked.
	 */
	listCompanyDocuments : function(e)
	{
		e.preventDefault();
		save_contact_tab_position_in_cookie("documents");
		company_detail_tab.load_company_documents();
	},
	
	/**
	 * "click" event of add button of tags form in contact detail view
	 * Pushes the added tags into tags array attribute of the contact and saves it
	 */ 
	addCompanytags :  function(e)
	{	e.preventDefault();
		
	   company_detail_tab.addTagsToCompany();
	},
	
	companyAddTags : function(e) {
	 	if(e.which == 13 && !isTagsTypeaheadActive){
    		company_detail_tab.addTagsToCompany();
    		}
    	},
	
	// Deletes a contact from database
	companyDelete :  function(e)
	{	
		e.preventDefault();
		company_detail_tab.deleteCurrentCompany();
	},
	
	/**
	 * Changes, owner of the contact, when an option of change owner drop down
	 * is selected.   
	 */
	companyOwnerList :  function(e){
		var targetEl = $(e.currentTarget);

		$('#change-owner-ul').css('display', 'none');
		
		company_detail_tab.changeOwner($(targetEl));
	},
	
	/**
	 * Deletes a tag of a contact (removes the tag from the contact and saves the contact)
	 */ 
	removeCmpanyTags :  function(e){
		e.preventDefault();
		var targetEl = $(e.currentTarget);

		var tag = $(targetEl).attr("tag");
		//removeItemFromTimeline($("#" +  tag.replace(/ +/g, '') + '-tag-timeline-element', $('#timeline')).parent('.inner'))
		console.log($(targetEl).closest("li").parent('ul').append(getRandomLoadingImg()));
		
     	var json = App_Companies.companyDetailView.model.toJSON();
     	
     	// Returns contact with deleted tag value
     	json = delete_contact_tag(json, tag);
     	var that = targetEl;
     	
     	// Unbinds click so user cannot select delete again
     	$(targetEl).unbind("click");
     	
        var contact = new Backbone.Model();
        contact.url = 'core/api/contacts';
        contact.save(json, {
       		success: function(data)
       			{ 	      		
       				$(that).closest("li").parent('ul').find('.loading').remove();
       				$(that).closest("li").remove();
       				
       			// Updates to both model and collection
       				App_Companies.companyDetailView.model.set(data.toJSON(), {silent : true});
	       			
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
	},
});

$(function(){
	$("body").on("mouseenter", "#element", function(b) {
        b.preventDefault();
        $(this).popover({
            template: '<div class="popover" style="width:400px"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>'
        });
        $(this).popover("show")
    }
    );
    $("body").on("mouseenter", "#element-title", function(b) {
        b.preventDefault();
        $(this).popover("show")
    }
    );
});
