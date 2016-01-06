var timer = undefined;
function contactListener()
{
	$('#contacts-custom-view-model-list').off('mouseenter','tr');
		$('#contacts-custom-view-model-list').on('mouseenter','tr',function(e){
			//e.stopPropagation();
			var left=e.pageX;
            var that=$(this);


 
      clearTimeout(timer);

			timer=setTimeout(function() {
						 		
				if (!insidePopover)	{
		
					 //$(that).popover('show');
		 App_Contacts.contact_popover=$(that).data();
		 try{
		 		getTemplate("contacts-custom-view-popover",  App_Contacts.contact_popover.toJSON(), undefined, function(template_ui){
						if(!template_ui)
							  return;
								$(that).popover(
        {
            "rel": "popover",
            "trigger": "manual",
            "placement": "top",
            "html": "true",
            "content": template_ui,
            });
								$(that).popover('show');
							$('.popover').addClass("contact_popover");
							$('.popover').css('left', ($('.dta-contatiner').offset().left + 90+"px"));
							if (window.innerHeight - $(that).offset().top >= 400)
                            $('.popover').css('top', ($(that).offset().top  + "px"));
                        /*else{
                        	$('.popover').css('top',($(that).offset().top+$('.dta-contatiner').offset().top+"px"));
                        }*/
                         //if( $('#contacts-table').offset().top > $('#contacts-table .popover').offset().top ) { $('#contacts-table .popover').offset({ top : $('#contacts-table').offset().top }); }

                         else{
                         	if($(window).scrollTop()>($('#contacts-table .popover').offset().top-$('#contacts-table .popover').height()))
                         		$('#contacts-table .popover').offset({ top : $(that).offset().top+20 });
                         }
                        	
							 attachEvents(that,App_Contacts.contact_popover);
						contact_list_starify('.popover');
						
					});
		 		that.find('.data').attr('data');
		 	}
		 	catch(e){
		 		return false;
		 	}
		 	}
		 }, 1000);
});
		$('#contacts-custom-view-model-list').off('mouseleave','tr');
	$('#contacts-custom-view-model-list').on('mouseleave','tr',function(){
		var that=$(this);
	setTimeout(function() {
		if (!insidePopover){
			if($('.popover').length!=0)
			$(that).popover('hide');
		}
					
	}, 1000);
		
	});


	$('#portlets-contacts-model-list').off('mouseenter','tr');
		$('#portlets-contacts-model-list').on('mouseenter','tr',function(e){
			//e.stopPropagation();
			var left=e.pageX;
            var that=$(this);


 
      clearTimeout(timer);

			timer=setTimeout(function() {
						 		
				if (!insidePopover)	{
		
					 //$(that).popover('show');
		 App_Contacts.contact_popover=$(that).data();
		 try{
		 		getTemplate("contacts-custom-view-popover",  App_Contacts.contact_popover.toJSON(), undefined, function(template_ui){
						if(!template_ui)
							  return;
								$(that).popover(
        {
            "rel": "popover",
            "trigger": "manual",
            "placement": "top",
            "html": "true",
            "content": template_ui,
            });
								$(that).popover('show');
						$('.popover').addClass("contact_popover");
							//$('.popover').css('left', ($('.dta-contatiner').offset().left + 90+"px"));
							// if (window.innerHeight - $(that).offset().top >= 400)
       //                      $('.popover').css('top', ($(that).offset().top  + "px"));
       //                  /*else{
       //                  	$('.popover').css('top',($(that).offset().top+$('.dta-contatiner').offset().top+"px"));
       //                  }*/
       //                   //if( $('#contacts-table').offset().top > $('#contacts-table .popover').offset().top ) { $('#contacts-table .popover').offset({ top : $('#contacts-table').offset().top }); }

       //                   else{
       //                   	if($(window).scrollTop()>($('#contacts-table .popover').offset().top-$('#contacts-table .popover').height()))
       //                   		$('#contacts-table .popover').offset({ top : $(that).offset().top+20 });
       //                   }
                        	
							 attachEvents(that,App_Contacts.contact_popover);
						contact_list_starify('.popover');
						
					});
		 		that.find('.data').attr('data');
		 	}
		 	catch(e){
		 		return false;
		 	}
		 	}
		 }, 1000);
});
		$('#portlets-contacts-model-list').off('mouseleave','tr');
	$('#portlets-contacts-model-list').on('mouseleave','tr',function(){
		var that=$(this);
	setTimeout(function() {
		if (!insidePopover){
			if($('.popover').length!=0)
			$(that).popover('hide');
		}
					
	}, 1000);
		
	});
}

var insidePopover=false;

function attachEvents(tr,Contact_collection) {
	$('.popover').off('mouseenter');
	$('.popover').on('mouseenter', function() {
		insidePopover=true;
	});
	$('.popover').off('mouseleave');
	$('.popover').on('mouseleave', function() {
		insidePopover=false;
		$(tr).popover('hide');
	});
	/*$('.popover').off('click', '.contact-list-add-deal')
	$('.popover').on('click', '.contact-list-add-deal', function(e)
	{
		var that=$(this);
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

		populateLostReasons(el, undefined);

		populateDealSources(el, undefined);

		// Enable the datepicker

		$('#close_date', el).datepicker({ format : CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY});


		var json = null;


			json = Contact_collection.toJSON();
		var contact_name = getContactName(json);
		$('.tags', el).append('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="' + json.id + '">' + contact_name + '</li>');

	});
*/
	/*$('.popover').off('click', '.contact-list-add-note');
	$('.popover').on('click', '.contact-list-add-note', function(e){ 
    	e.preventDefault();
        console.log("execution");
    	var	el = $("#noteForm");
    	var that=$(this);
    	
    	// Displays contact name, to indicate the note is related to the contact
    	//fill_relation(el);
    		var json = null;

		json = Contact_collection.toJSON();
 	var contact_name = getContactName(json);//getPropertyValue(json.properties, "first_name")+ " " + getPropertyValue(json.properties, "last_name");
 	
 	// Adds contact name to tags ul as li element
 	$('.tags',el).html('').html('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="'+ json.id +'">'+contact_name+'</li>');


        if(!$(this).attr("data-toggle"))
             $('#noteModal').modal('show');
         
    	agile_type_ahead("note_related_to", el, contacts_typeahead);
     });
*/
$('.popover').off('click', '#add-score')
$('.popover').on('click', '#add-score', function(e){
	    e.preventDefault();
	    var that=$(this);
	    // Convert string type to int
	    var add_score = parseInt($('#lead-score').text());
	    
	    add_score = add_score + 1;
	    
	    // Changes score in UI
	    $('#lead-score').text(add_score);
       
   var temp_model= Contact_collection.set('lead_score', add_score);
		var contact_model =  temp_model.toJSON();

	    
	  /* // Refreshing the view ({silent: true} not working)
	    contact_model.url = 'core/api/contacts';
	    contact_model.set('lead_score', add_score, {silent: true});
	
	    */// Save model
	   //contact_model.save();
	    
		var new_model = new Backbone.Model();
		new_model.url = 'core/api/contacts';
		new_model.save(contact_model,{
			success: function(model){
			}
		});
		          
	});

$('.popover').off('click', '#minus-score')
$('.popover').on('click', '#minus-score', function(e){
	    e.preventDefault();
	    var that=$(this);
	    // Convert string type to int
	    var sub_score = parseInt($('#lead-score').text());
		
		if(sub_score <= 0)
			return;
		
		sub_score = sub_score - 1;
		
		// Changes score in UI
		$('#lead-score').text(sub_score);
		
       
       var temp_model= Contact_collection.set('lead_score', sub_score);
		var contact_model =  temp_model.toJSON();

	    
	  /* // Refreshing the view ({silent: true} not working)
	    contact_model.url = 'core/api/contacts';
	    contact_model.set('lead_score', add_score, {silent: true});
	
	    */// Save model
	   //contact_model.save();
	    
		var new_model = new Backbone.Model();
		new_model.url = 'core/api/contacts';
		new_model.save(contact_model,{
			success: function(model){
			}
		});
		          
	});

$('.popover').off('click', '#add-tags')
$('.popover').on('click', '#add-tags', function(e){
	e.preventDefault();
		  var that=$(this);
		$(e.currentTarget).css("display", "none");
		$("#addTagsForm").css("display", "table");
		$("#addTags").focus();
		setup_tags_typeahead(function(e){
    				json = Contact_collection.toJSON();
    			
    			// Checks if tag already exists in contact
    			if($.inArray(e, json.tags) >= 0)
    				return;

    			json.tagsWithTime.push({"tag" : e});
    			
    			
    			saveEntity(json, 'core/api/contacts', function(data){
    				$("#addTagsForm").css("display", "none");
        		    $("#add-tags").css("display", "block");
        		    
        		    Contact_collection.set(data.toJSON());
        		    	    var old_tags = [];
	       			$.each($('#added-tags').children(), function(index, element){
       					
	       				old_tags.push($(element).html());
       				});
       				if ($.inArray(e, old_tags) == -1) 
		       				$('#added-tags').append('<span class="label bg-light dk text-tiny">'+e+'</span>');
	    			
    	     		
	       			
    			});
    	        return;
		});
	});
$('.popover').off('click', '#contact-add-tags')
$('.popover').on('click', '#contact-add-tags', function(e){
e.preventDefault();
		
		var that=$(this);
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
			var json = Contact_collection.toJSON();
	    		
	    	
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
		       			
		       			// Updates to both model and collection
		       			Contact_collection.set(data.toJSON());
		       				 var old_tags = [];
	       			$.each($('#added-tags').children(), function(index, element){
       					
	       				old_tags.push($(element).html());
       				});
       				if ($.inArray(e, old_tags) == -1) 
		       				$('#added-tags').append('<span class="label bg-light dk text-tiny">'+new_tags+'</span>');

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

	$('.popover').off('click', '#contact-owner');
$('.popover').on('click', '#contact-owner', function(e){
	  e.preventDefault();
         fill_owners(undefined, undefined, function(){
	    	$('#contact-owner').css('display', 'none');
	    	$('#change-owner-ul').css('display', 'inline-block');
	    	if($('#change-owner-element > #change-owner-ul').css('display') == 'inline-block')
	             $("#change-owner-element").find(".loading").remove();
		});
});
$('.popover').off('click', '.contact-owner-list');
$('.popover').on('click', '.contact-owner-list', function(e){
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
		    contactModel.url = '/core/api/contacts/change-owner/' + new_owner_id + "/" + Contact_collection.get('id');
		    contactModel.save( Contact_collection.toJSON(), {success: function(model){
		    	// Replaces old owner details with changed one
				$('#contact-owner').text(new_owner_name);
				$('#contact-owner').attr('data', new_owner_id);
				
				// Showing updated owner
				show_owner(); 
				Contact_collection.set(model.toJSON());
				
		    }});
});

}

function agile_crm_get_List_contact_properties_list(propertyName)
{
	// Reads current contact model form the contactDetailView
	var contact_model = App_Contacts.contact_popover;

	// Gets properties list field from contact
	var properties = contact_model.get('properties');
	var property_list = [];

	/*
	 * Iterates through each property in contact properties and checks for the
	 * match in it for the given property name and retrieves value of the
	 * property if it matches
	 */
	$.each(properties, function(index, property)
	{
		if (property.name == propertyName)
		{
			property_list.push(property);
		}
	});

	// If property is defined then return property value list
	return property_list;
}


function contact_list_starify(el) {
    head.js(LIB_PATH + 'lib/jquery.raty.min.js', function(){
    	
    	var contact_model  =  App_Contacts.contact_popover;
    	
    	// If contact update is not allowed then start rating does not allow user to change it
    	if(App_Contacts.contact_popover.get('owner') && !canEditContact(App_Contacts.contact_popover.get('owner').id))
    	{
    			$('#star', el).raty({
    			 'readOnly': true,
    			  score: App_Contacts.contact_popover.get('star_value')
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
        	         		
           		
        		App_Contacts.contact_popover.set({'star_value': score});
        		contact_model =  App_Contacts.contact_popover.toJSON();
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

