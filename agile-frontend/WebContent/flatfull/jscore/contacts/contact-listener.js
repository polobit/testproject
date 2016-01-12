var timer = undefined;
function contactListener()
{
	$('#contacts-table').off('mouseenter','tr');
		$('#contacts-table').on('mouseenter','tr',function(e){
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
							$('.popover').addClass("contact_popover fadeInLeft animated");
							$('.popover-content').html(template_ui);

							$('.popover').css('left', ($('.dta-contatiner').offset().left + 90+"px"));
							if (window.innerHeight - $(that).offset().top >= 400)
                            $('.popover').css('top', ($(that).offset().top  + "px"));
                        
                         else{
                         	if($(window).scrollTop()>($('#contacts-table .popover').offset().top-$('#contacts-table .popover').height()))
                         		$('#contacts-table .popover').offset({ top : $(that).offset().top+20 });
                         }
                        	
							 attachEvents(that,App_Contacts.contact_popover,true);
						contact_list_starify('.popover',true);
						
					});
		 		that.find('.data').attr('data');
		 	}
		 	catch(e){
		 		return false;
		 	}
		 	}
		 }, 1000);
});
		$('#contacts-table').off('mouseleave','tr');
	$('#contacts-table').on('mouseleave','tr',function(){
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

function attachEvents(tr,Contact_collection,listView,campaigns_view) {
	$('.popover').off('mouseenter');
	$('.popover').on('mouseenter', function() {
		insidePopover=true;
	});
	$('.popover').off('mouseleave');
	$('.popover').on('mouseleave', function() {
		insidePopover=false;
		$(tr).popover('hide');
	});
	
$('.popover').off('click', '#add-score')
$('.popover').on('click', '#add-score', function(e){
	    e.preventDefault();
	    var that=$(this);
	    // Convert string type to int
	    var add_score = parseInt($('#lead-score').text());
	    var temp_model;
	    add_score = add_score + 1;
	    
	    // Changes score in UI
	    $('#lead-score').text(add_score);
     if(listView!=undefined) 
     	temp_model= Contact_collection.set('lead_score', add_score);
   else {
   	temp_model= Contact_collection.set('lead_score', add_score,{silent: true});
   temp_model.trigger('popoverChange');
		}
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
	     var temp_model;
	    // Convert string type to int
	    var sub_score = parseInt($('#lead-score').text());
		
		if(sub_score <= 0)
			return;
		
		sub_score = sub_score - 1;
		
		// Changes score in UI
		$('#lead-score').text(sub_score);
		
       if(listView!=undefined) 
       	temp_model=Contact_collection.set('lead_score', sub_score);
       else{
       temp_model= Contact_collection.set('lead_score', sub_score,{silent:true});
       temp_model.trigger('popoverChange');
   }
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

$('.popover').off('click', '#add-tags-popover')
$('.popover').on('click', '#add-tags-popover', function(e){
	e.preventDefault();
		  var that=$(this);
		$(e.currentTarget).css("display", "none");
		$("#addTagsForm-popover").css("display", "table");
		$("#addTags-popover").focus();
			(function(e){
    				json = Contact_collection.toJSON();
    			
    			// Checks if tag already exists in contact
    			if($.inArray(e, json.tags) >= 0)
    				return;

    			json.tagsWithTime.push({"tag" : e});
    			
    			
    			saveEntity(json, 'core/api/contacts', function(data){
    				$("#addTagsForm-popover").css("display", "none");
        		    $("#add-tags-popover").css("display", "block");
        		   
        		    if(listView!=undefined) 
        		    	Contact_collection.set(data.toJSON());
        		    else 
        		    { Contact_collection.set(data.toJSON(),{silent:true});
      				 Contact_collection.trigger('popoverChange'); }
        		    	    var old_tags = [];
	       			$.each($('#added-tags-popover').children(), function(index, element){
       					
	       				old_tags.push($(element).html());
       				});
       				if ($.inArray(e, old_tags) == -1) 
		       				$('#added-tags-popover').append('<span class="label bg-light dk text-tiny">'+e+'</span>');
	    			
    	     		
	       			
    			});
    	        return;
		});
	});
$('.popover').off('click', '#contact-add-tags-popover')
$('.popover').on('click', '#contact-add-tags-popover', function(e){
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
		$('#add-tags-popover').css("display", "block");
		$("#addTagsForm-popover").css("display", "none");
		console.log(new_tags);
		
		if(new_tags) {
			var json = Contact_collection.toJSON();
	    		
	    	
	    	// Reset form
	    	$('#addTagsForm-popover input').each (function(){
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
		       			 if(listView!=undefined) 
		       			 	Contact_collection.set(data.toJSON());
		       			 	else
		       			 		{
		       			Contact_collection.set(data.toJSON(),{silent:true});
      				 Contact_collection.trigger('popoverChange');
      				}
		       				 var old_tags = [];
	       			$.each($('#added-tags-popover').children(), function(index, element){
       					
	       				old_tags.push($(element).html());
       				});
       				if ($.inArray(e, old_tags) == -1) 
		       				$('#added-tags-popover').append('<span class="label bg-light dk text-tiny">'+new_tags+'</span>');

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

	$('.popover').off('click', '#contact-owner-popover');
$('.popover').on('click', '#contact-owner-popover', function(e){
	var that=$(this);
	  e.preventDefault();
	  var optionsTemplate = "<li><a class='contact-owner-list-popover' data='{{id}}'>{{name}}</a></li>";
         fillSelect('contact-detail-owner-popover','/core/api/users', 'domainUsers', function()
			{
									$(that).css('display', 'none');
	    	$(that).parent().find('#change-owner-ul-popover').css('display', 'inline-block');
	    	if($(that).parent().find('#change-owner-ul-popover').css('display') == 'inline-block')
	             $(that).parent().find(".loading").remove();
		}, optionsTemplate, true);
	    
		//});
});
$('.popover').off('click', '.contact-owner-list-popover');
$('.popover').on('click', '.contact-owner-list-popover', function(e){
	e.preventDefault();
	var that=$(this);
    	var targetEl = $(e.currentTarget);
    	$('#change-owner-ul-popover').css('display', 'none');
		
		// Reads the owner id from the selected option
		var new_owner_id = $(targetEl).attr('data');
		var new_owner_name = $(targetEl).text();
		var current_owner_id = $('#contact-owner-popover').attr('data');
		
		// Returns, if same owner is selected again 
		if(new_owner_id == current_owner_id)
			{
			  // Showing updated owner
			  $('#contact-owner-popover').css('display', 'inline-block');
			  return;
			}
		
		  var contactModel = new BaseModel();
		    contactModel.url = '/core/api/contacts/change-owner/' + new_owner_id + "/" + Contact_collection.get('id');
		    contactModel.save( Contact_collection.toJSON(), {success: function(model){
		    	// Replaces old owner details with changed one
				$('#contact-owner-popover').text(new_owner_name);
				$('#contact-owner-popover').attr('data', new_owner_id);
				
				// Showing updated owner
				$('#contact-owner-popover').css('display', 'inline-block'); 
				 if(listView!=undefined) 
				 	Contact_collection.set(model.toJSON());
				 	else
				 	{
				Contact_collection.set(model.toJSON(),{silent:true});
      				 Contact_collection.trigger('popoverChange');
      				}
				
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


function contact_list_starify(el,listView) {
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
        	         		
           		if(listView!=undefined) 
        		App_Contacts.contact_popover.set({'star_value': score});
      				 else{
      				 	App_Contacts.contact_popover.set({'star_value': score},{silent:true});
      				 App_Contacts.contact_popover.trigger('popoverChange');
      				 }
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