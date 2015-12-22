function contactListener()
{
	$('#contacts-custom-view-model-list').off('mouseenter','tr');
		$('#contacts-custom-view-model-list').on('mouseenter','tr',function(e){
			var that=$(this);
			//var top=e.pageY-40;
			var left=e.pageX-30;
			var html=""
			$(this).popover(
        {
            "rel": "popover",
            "trigger": "manual",
            "placement": "top",
            "html": "true",
            "content": "hello",
            });
			setTimeout(function() {
				if (!insidePopover)	{
		 $(that).popover('show');
		 $('.popover').css('left',left);
		var id=that.find('.data').attr('data');
		 var contact=App_Contacts.contact_custom_view.collection.get(id).toJSON();
		 		getTemplate("contacts-custom-view-popover", contact, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$('.popover').html($(template_ui));	
						attachEvents(that,App_Contacts.contact_custom_view.collection);
					});
		 		that.find('.data').attr('data');
		 	}
		 }, 1000);
});
		$('#contacts-custom-view-model-list').off('mouseleave','tr');
	$('#contacts-custom-view-model-list').on('mouseleave','tr',function(){
		var that=$(this);
	setTimeout(function() {
		if (!insidePopover)
				$(that).popover('hide');	
	}, 1000);
		
	});
}

var insidePopover=false;

function attachEvents(tr,Contact_collection) {
	$('.popover').on('mouseenter', function() {
		insidePopover=true;
	});
	$('.popover').on('mouseleave', function() {
		insidePopover=false;
		$(tr).popover('hide');
	});
	$('.popover').off('click', '.contact-list-add-deal')
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


			json = Contact_collection.get($(that).parents('.data').attr('data')).toJSON();
		var contact_name = getContactName(json);
		$('.tags', el).append('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="' + json.id + '">' + contact_name + '</li>');

	});

	$('.popover').off('click', '.contact-list-add-note');
	$('.popover').on('click', '.contact-list-add-note', function(e){ 
    	e.preventDefault();
        console.log("execution");
    	var	el = $("#noteForm");
    	var that=$(this);
    	
    	// Displays contact name, to indicate the note is related to the contact
    	//fill_relation(el);
    		var json = null;

		json = Contact_collection.get($(that).parents('.data').attr('data')).toJSON();
 	var contact_name = getContactName(json);//getPropertyValue(json.properties, "first_name")+ " " + getPropertyValue(json.properties, "last_name");
 	
 	// Adds contact name to tags ul as li element
 	$('.tags',el).html('').html('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="'+ json.id +'">'+contact_name+'</li>');


        if(!$(this).attr("data-toggle"))
             $('#noteModal').modal('show');
         
    	agile_type_ahead("note_related_to", el, contacts_typeahead);
     });

$('.popover').off('click', '#add-score')
$('.popover').on('click', '#add-score', function(e){
	    e.preventDefault();
	    var that=$(this);
	    // Convert string type to int
	    var add_score = parseInt($('#lead-score').text());
	    
	    add_score = add_score + 1;
	    
	    // Changes score in UI
	    $('#lead-score').text(add_score);
       
   var temp_model= Contact_collection.get($(that).parents('.data').attr('data')).set('lead_score', add_score);
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
		
       
       var temp_model= Contact_collection.get($(that).parents('.data').attr('data')).set('lead_score', sub_score);
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
		$("#addTagsForm").css("display", "block");
		$("#addTags").focus();
		setup_tags_typeahead(function(e){
    				json = Contact_collection.get($(that).parents('.data').attr('data')).toJSON();
    			
    			// Checks if tag already exists in contact
    			if($.inArray(e, json.tags) >= 0)
    				return;

    			json.tagsWithTime.push({"tag" : e});
    			
    			
    			saveEntity(json, 'core/api/contacts', function(data){
    				$("#addTagsForm").css("display", "none");
        		    $("#add-tags").css("display", "block");
        		    
        		    Contact_collection.get($(that).parents('.data').attr('data')).set(data.toJSON());
    	     		
	       			
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
			var json = Contact_collection.get($(that).parents('.data').attr('data')).toJSON();
	    		
	    	
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
		       			Contact_collection.get($(that).parents('.data').attr('data')).set(data.toJSON());
		       			

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

}

function agile_crm_get_List_contact_properties_list(propertyName,id)
{
	// Reads current contact model form the contactDetailView
	var contact_model = App_Contacts.contact_custom_view.collection.get(id);

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
