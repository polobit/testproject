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
        	   
        		/*// (commented- reloading as silent:true is not effecting) 
        		  // alert('ID: ' + $(this).attr('id') + '\nscore: ' + score + '\nevent: ' + evt);
        		contact_model.set('star_value', score, {silent: true});
        	
        		// Save model
           		contact_model.save();*/
           		
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

		queueGetRequest("contact_queue_"+contact_id, "/core/api/contacts/" + contact_id + "/isUpdated?updated_time=" + updated_time, "", function success(data)
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
 * This script file (contact-details.js) performs some actions (delete contact, add 
 * and remove tags, change owner and change score etc...) on a contact when it is in 
 * its detail view.
 * 
 * @module Contact management
 * @author Rammohan
 */
$(function(){
	
	// Deletes a contact from database
	$('body').on('click', '#contact-actions-delete', function(e){
		
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


	$('body').on('click', '#contact-actions-grid-delete', function(e){
		
		e.preventDefault();
		var contact_id=$(this).attr('con_id');
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

    		
	});
	
	/**
	 * Deletes a tag of a contact (removes the tag from the contact and saves the contact)
	 */ 
	$('body').on('click', '.remove-tags', function(e){
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
	$('body').on('click', '#add-tags', function(e){
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
	$('body').on('click', '#contact-add-tags', function(e){
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
	});
	
	/**
	 * Changes, owner of the contact, when an option of change owner drop down
	 * is selected.   
	 */
	$('body').on('click', '.contact-owner-list', function(e){
	
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
	$('body').on('click', '#action_refresh_contact', function(e){
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
	
});
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
	console.log("collection >>>>>>>>>>>>>>>>" + id);
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
	
	/**
	 * Adds score to a contact (both in UI and back end)
	 * When '+' symbol is clicked in contact detail view score section, the score
	 * gets increased by one, both in UI and back end
	 * 
	 */  
	$('body').on('click', '#add', function(e){
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
	$('body').on('click', '#minus', function(e){
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
	
	// Makes the score section unselectable, when clicked on it
	$('#score').children().attr('unselectable', 'on');
	
	// Popover for help in contacts,tasks etc
	$('body').on('mouseenter', '#element', function(e){
    	e.preventDefault();
        $(this).popover({
        	template:'<div class="popover" style="width:400px"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>'
        });
        $(this).popover('show');
    });
	$('body').on('mouseenter', '#element-title', function(e){
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
    
	$('body').on('click', '#change-owner-element > #contact-owner', function(e){
    	e.preventDefault();
    	
    	fill_owners(undefined, undefined, function(){

        	$('#contact-owner').css('display', 'none');

        	$('#change-owner-ul').css('display', 'inline-block');
        	
        	 if($('#change-owner-element > #change-owner-ul').css('display') == 'inline-block')
                 $("#change-owner-element").find(".loading").remove();
    	});
    });
    
	$('body').on('click', '#change-owner-element > .contact-owner-add', function(e){
    	e.preventDefault();
    	
    	fill_owners(undefined, undefined, function(){

        	$('.contact-owner-add').css('display', 'none');

        	$('#change-owner-ul').css('display', 'inline-block');
        	$('#change-owner-ul').addClass("open");
        	
        	 if($('#change-owner-element > #change-owner-ul').css('display') == 'inline-block')
        		 $("#change-owner-element").find(".loading").remove();
    	});
    });
    
	$('body').on('click', '#disable_map_view', function(e){
		e.preventDefault();
		if(islocalStorageHasSpace()){
			localStorage.setItem('MAP_VIEW','disabled');
		}
		$("#map").css('display', 'none');
		$("#contacts-local-time").hide();
		$("#map_view_action").html("<i class='icon-plus text-sm c-p' title='Show map' id='enable_map_view'></i>");
		
    });
	$('body').on('click', '#enable_map_view', function(e){
		e.preventDefault();
		if(islocalStorageHasSpace()){
			localStorage.setItem('MAP_VIEW','enabled');
		}
		if(company_util.isCompany())
			company_util.show_map();
		else
			show_map();
		
		
	});
    
});