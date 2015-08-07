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

		queueGetRequest("contact_queue", "/core/api/contacts/" + contact_id + "/isUpdated?updated_time=" + updated_time, "", function success(data)
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
    	$('.navigation', el).append('<a style="float:left;" href="#contact/' + previous_contact_id + '" class=""><i class="icon icon-chevron-left"></i></a>');
    if(next_contact_id != null)
    	$('.navigation', el).append('<a style="float:right;" href="#contact/'+ next_contact_id + '" class=""><i class="icon icon-chevron-right"></i></a>');
	
}


$(function(){
	
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
	$('body').on('mouseenter', '#add', function(e){
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
		show_map();
		
		
	});
    
});
