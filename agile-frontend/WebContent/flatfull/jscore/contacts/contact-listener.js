var timer = undefined;
function contactListener(el)
{
	$('#contacts-custom-view-model-list , #contacts-custom-view-table-model-list').off('mouseenter','tr > td:not(":first-child")');
		$('#contacts-custom-view-model-list , #contacts-custom-view-table-model-list').on('mouseenter','tr > td:not(":first-child")',function(e){
			//e.stopPropagation();
				var left=e.pageX;
				left=left-100;
				var top=0;
            var that=$(this).parent();
             popoverEnter(that,left,top,true);

		
});
		$('#contacts-custom-view-model-list , #contacts-custom-view-table-model-list').off('mouseleave','tr > td:not(":first-child")');
	$('#contacts-custom-view-model-list , #contacts-custom-view-table-model-list').on('mouseleave','tr > td:not(":first-child")',function(){
		var that=$(this).parent();
		popout(that);
		
	});


	$(el).off('mouseenter','tr');
		$(el).on('mouseenter','tr',function(e){
			//e.stopPropagation();
			//var left=e.pageX;
            var that=$(this);
             popoverEnter(that,undefined,undefined,undefined);
});


		$(el).off('mouseleave','tr');
	$(el).on('mouseleave','tr',function(){
		var that=$(this);
		popout(that);
		
	});

	$('#company-contacts-model-list').off('mouseenter','tr > td');
		$('#company-contacts-model-list').on('mouseenter','tr > td',function(e){
			var left=e.pageX;
			left=left-400;
            var that=$(this).parent();
             popoverEnter(that,left,0,undefined);
});
		$('#company-contacts-model-list').off('mouseleave','tr > td');
	$('#company-contacts-model-list').on('mouseleave','tr > td',function(){
	var that=$(this).parent();
		popout(that);
		
	});
	$('#task-related-model-list').off('mouseenter','tr > td');
		$('#task-related-model-list').on('mouseenter','tr > td',function(e){
			var left=e.pageX;
			left=left-400;
            var that=$(this).parent();
             popoverEnter(that,left,0,undefined);
			
});
		$('#task-related-model-list').off('mouseleave','tr > td');
	$('#task-related-model-list').on('mouseleave','tr > td',function(){
		var that=$(this).parent();
		popout(that);
		
	});
	
	$('#deal-related-model-list').off('mouseenter','tr > td');
		$('#deal-related-model-list').on('mouseenter','tr > td',function(e){
			var left=e.pageX;
			left=left-400;
            var that=$(this).parent();
             popoverEnter(that,left,0,undefined);
});
		$('#deal-related-model-list').off('mouseleave','tr > td');
	$('#deal-related-model-list').on('mouseleave','tr > td',function(){
	var that=$(this).parent();
		popout(that);
		
	});

	
	$('#workflow-other-subscribers-model-list').off('mouseenter','td.data .table-resp');
		$('#workflow-other-subscribers-model-list').on('mouseenter','td.data .table-resp',function(e){
			var left=e.pageX;
            var that=$(this).parents('tr');
            left=left-350;
            if(insidePopover==true){
 			insidePopover=false;
 			$("time.campaign-started-time").timeago();
				$("time.campaign-completed-time").timeago();

 		}
             popoverEnter(that,left,0,undefined,true);
		
			});
		$('#workflow-other-subscribers-model-list').off('mouseleave','td.data .table-resp');
	$('#workflow-other-subscribers-model-list').on('mouseleave','td.data .table-resp',function(){
		var that=$(this).parents('tr');
		popout(that);
		
	});

	$('body').off('mouseover','.popover_contact');
		$('body').on('mouseover','.popover_contact',function(e){

			//e.stopPropagation();
			var left=e.pageX;
            var that=$(this);

     // clearTimeout(timer);

			timer=setTimeout(function() {
						 		
		
					var contact_id=$(that).attr('data')
		 //App_Contacts.contact_popover=$(that).attr('data');
		  $.ajax({
				type : 'GET',
				url :  '/core/api/contacts/' + contact_id,
				dataType : 'json',
				success : function(data) {
					App_Contacts.contact_popover=new Backbone.Model(data);
		 		getTemplate("contacts-custom-view-popover", data, undefined, function(template_ui){

						if(!template_ui)
							  return;
								$(that).popover(
        {
            "rel": "popover",
            "trigger": "manual",
            "placement": "auto top",
            "html": "true",
            "content": template_ui,
            });
								$(that).popover('show');
								
						$('.popover').addClass("contact_popover fadeInLeft animated");
							

						contact_list_starify('.popover',undefined);
						
					});
		 		//that.find('.data').attr('data');
		 	}
		 	});
		 	
		 }, 1000);
});

	$('body').off('mouseout','.popover_contact');
		$('body').on('mouseout','.popover_contact',function(e){
				var that=$(this);
			if($('.popover').length!=0){
			$(that).popover('hide');
			$('.popover').remove();
		}
		clearTimeout(timer);
			});
}

var insidePopover=false;

function attachEvents(tr,Contact_collection,listView,campaigns_view) {

	$('.popover').off('mouseenter','.popover-content');
	$('.popover').on('mouseenter', '.popover-content',function() {

		insidePopover=true;
	
	});
	$('.popover').off('mouseleave','.popover-content');
	$('.popover').on('mouseleave','.popover-content', function() {
		insidePopover=false;
		$(tr).popover('hide');
		$('.popover').remove();
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
			setup_tags_typeahead(function(e){
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
				$('#contact-owner-popover').attr('title' , new_owner_name);
				
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

function popoverEnter(that,left,top,listView,campaigns_view)
{


 
     

			timer=setTimeout(function() {
						 	
						  	
				if (!insidePopover)	{
		
					 $('.popover').remove();	

		 App_Contacts.contact_popover=$(that).data();
		 try{
		 		getTemplate("contacts-custom-view-popover",  App_Contacts.contact_popover.toJSON(), undefined, function(template_ui){
						if(!template_ui)
							  return;
								$(that).popover(
        {
            "rel": "popover",
            "trigger": "manual",
            "placement": "auto top",
            "html": "true",
            "content": template_ui,
            });
								$(that).popover('show');
															$('.popover').addClass("contact_popover fadeInLeft animated");
							$('.popover-content').html(template_ui);
							if(left!=undefined)
							$('.popover').css('left', left + "px");
						if(top!=undefined){
						if (window.innerHeight - $(that).offset().top + $(window).scrollTop()>= 250)
       	  top = $(that).offset().top + 20 + 'px';
        else
         top = $(that).offset().top-$('.popover').height() + 'px';
     $('.popover').css('top',top);}
                        	
							 attachEvents(that,App_Contacts.contact_popover,listView,campaigns_view);
						contact_list_starify('.popover',listView);
						
					});
		 		that.find('.data').attr('data');
		 	}
		 	catch(e){
		 		return false;
		 	}
		 	}
		 }, 1000);
}

function popout(that)
{
		
	setTimeout(function() {
		if (!insidePopover){
			if($('.popover',that.parent()).length!=0)
			{
			$(that).popover('hide');
			$('.popover').remove();
			}
		}
					
	}, 200);
	 clearTimeout(timer);
}
