/**
 * contact-details-tabs.js fetches the contact (which is in contact detail view) 
 * related details (notes, tasks, deals, campaigns and mails etc..) and presents 
 * in tab content as specified, when the corresponding tab is clicked. 
 * Timeline tab is activated by default to show all the details as vertical time-line.
 * 
 * @module Contact management
 * @author Rammohan
 */
var notesView;
var dealsView; 
var eventsView;
var tasksView;
var casesView;
var documentsView;

var CONTACT_ASSIGNED_TO_CAMPAIGN = false;

var NO_WEB_STATS_SETUP = true;

function fill_company_related_contacts(companyId, htmlId)
{
	$('#'+htmlId).html(LOADING_HTML);
	
	var companyContactsView = new Base_Collection_View({
		url : 'core/api/contacts/related/' + companyId,
		templateKey : 'company-contacts',
		individual_tag_name : 'tr',
		cursor : true,
		page_size : 25,
		sort_collection : false,
		postRenderCallback : function(el) {
			// var cel = App_Contacts.contactsListView.el;
			// var collection = App_Contacts.contactsListView.collection;
		}
	});

	companyContactsView.collection.fetch();

	$('#' + htmlId).html(companyContactsView.render().el);
}
$(function(){ 

	var id;
	
	/**
	 * Activates the Timeline tab-content to show the time-line with all details,
	 * which are already added to time-line, when the contact is getting to its
	 * detail view.  
	 */
	$('#contactDetailsTab a[href="#timeline"]').live('click', function (e){
		e.preventDefault();
		$('div.tab-content').find('div.active').removeClass('active');
		
		$('#time-line').addClass('active');
		$("#timeline").isotope( 'reLayout', function(){
		} )
	});
	
	$('.email-subject').die().live('click', function(e) {
		e.preventDefault();
		var href = $(this).attr("href");
		var id = $(this).attr('id');
		$(".collapse-" + id).hide();
		$(href).collapse('toggle');
		
		$(href).on("hidden", function(){
			$(".collapse-" + id).show();
		})
		
	});	
	
	// Hide More link and truncated webstats and show complete web stats.
	$('#more-page-urls').die().live('click',function(e){
		e.preventDefault();
		
		$(this).css('display','none');
		$(this).parent().parent().find('#truncated-webstats').css('display','none');
		
		$(this).parent().parent().find('#complete-webstats').removeAttr('style');
	});
	
	//to remove contact from active campaign.
	$('.remove-active-campaign').die().live('click',function(e){
		e.preventDefault();
		
		if(!confirm("Are you sure to remove "+$(this).attr("contact_name")+" from "+$(this).attr("campaign_name")+" campaign?"))
			return;
		
		var campaign_id = $(this).closest('li').attr('data');
		var contact_id;
		
		// Fetch contact id from model
		if(App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
			contact_id = App_Contacts.contactDetailView.model.get('id');
		
	    // Url to delete
		var deleteUrl = 'core/api/workflows/remove-active-subscriber/'+campaign_id+'/'+contact_id;
	    
	    var $removeActiveCampaign = $(this);
	    
	    $.ajax({
	    	url: deleteUrl,
	    	type: 'DELETE',
	    	success: function(data){
	    	
	    	var contact_json = App_Contacts.contactDetailView.model.toJSON();
	    	var campaign_status = contact_json.campaignStatus;
	    	
	    	// On success callback, remove from both UI and backbone contact model.
	    	if(campaign_status !== undefined)
	    		{
	    			for(var i = 0,len = campaign_status.length;i<len;i++)
	    			{
	    				if(campaign_id === campaign_status[i].campaign_id)
	    				{
	    					// Remove from campaignStatus array of contact model
	    					campaign_status.splice(i,1);
	    					break;
	    				}
	    			}
	    		}
	    	
	    	// Remove li 
	    	$removeActiveCampaign.closest('li').remove();
	    	
	    	}
	    });
		
	});
/*	
	$('.ativity-block-ul > li')
	.live('mouseenter',function(){
		console.log("hover");
	})
	.live('mouseleave',function(){
		console.log("hout");
	}); */
	
	
	/**
	 * Fetches all the notes related to the contact and shows the notes collection 
	 * as a table in its tab-content, when "Notes" tab is clicked.
	 */ 
	$('#contactDetailsTab a[href="#notes"]').live('click', function (e){
		e.preventDefault();
	    id = App_Contacts.contactDetailView.model.id;
	    notesView = new Base_Collection_View({
            url: '/core/api/contacts/' + id + "/notes",
            restKey: "note",
            templateKey: "notes",
            individual_tag_name: 'li',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
            		 $(".note-created-time", el).timeago();
              	})
            }
        });
        notesView.collection.fetch();
        $('#notes', App_Contacts.contactDetailView.model.el).html(notesView.el);
	});
	
	/**
	 * Fetches all the events related to the contact and shows the events collection 
	 * as a table in its tab-content, when "Events" tab is clicked.
	 */
	$('#contactDetailsTab a[href="#events"]').live('click', function (e){
		e.preventDefault();
	    id = App_Contacts.contactDetailView.model.id;
		eventsView = new Base_Collection_View({
            url: '/core/api/contacts/' + id + "/events",
            restKey: "event",
            templateKey: "contact-events",
            individual_tag_name: 'li',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
            		 $(".event-created-time", el).timeago();
              	})
            }
        });
		eventsView.collection.fetch();
        $('#events', this.el).html(eventsView.el);
	});
	
	/**
	 * Fetches all the documents related to the contact and shows the documents collection 
	 * as a table in its tab-content, when "Documents" tab is clicked.
	 */
	$('#contactDetailsTab a[href="#documents"]').live('click', function (e){
		e.preventDefault();
	    id = App_Contacts.contactDetailView.model.id;
	    documentsView = new Base_Collection_View({
            url: '/core/api/documents/' + id + "/docs",
            restKey: "document",
            templateKey: "contact-documents",
            individual_tag_name: 'li',
            sortKey:"uploaded_time",
            descending: true,
            postRenderCallback: function(el) {
            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
            		 $(".document-created-time", el).timeago();
              	})
            }
        });
	    documentsView.collection.fetch();
        $('#documents', this.el).html(documentsView.el);
	});
	
	/**
	 * Fetches all the notes related to the contact and shows the tasks collection 
	 * as a table in its tab-content, when "Tasks" tab is clicked.
	 */
	$('#contactDetailsTab a[href="#tasks"]').live('click', function (e){
		e.preventDefault();
	    id = App_Contacts.contactDetailView.model.id;
		tasksView = new Base_Collection_View({
            url: '/core/api/contacts/' + id + "/tasks",
            restKey: "task",
            templateKey: "contact-tasks",
            individual_tag_name: 'li',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
            		 $(".task-created-time", el).timeago();
              	})
            }
        });
		tasksView.collection.fetch();
        $('#tasks', this.el).html(tasksView.el);
	});
	
	/**
	 * Fetches all the deals related to the contact and shows the deals collection 
	 * as a table in its tab-content, when "Deals" tab is clicked.
	 */
	$('#contactDetailsTab a[href="#deals"]').live('click', function (e){
		e.preventDefault();
		id = App_Contacts.contactDetailView.model.id;
		dealsView = new Base_Collection_View({
			url: 'core/api/contacts/'+ id + "/deals" ,
            restKey: "opportunity",
            templateKey: "deals",
            individual_tag_name: 'li',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
            		 $(".deal-created-time", el).timeago();
            	})
            }
        });
        dealsView.collection.fetch();
        $('#deals').html(dealsView.el);
		
	});

	/**
	 * Fetches all the cases related to the contact and shows the collection.
	 */
	$('#contactDetailsTab a[href="#cases"]').live('click', function (e){
		e.preventDefault();
		id = App_Contacts.contactDetailView.model.id;
		casesView = new Base_Collection_View({
			url: 'core/api/contacts/'+ id + "/cases" ,
            restKey: "cases",
            templateKey: "cases-contact",
            individual_tag_name: 'li',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
            		 $(".deal-created-time", el).timeago();
            	})
            }
        });
		casesView.collection.fetch();
        $('#cases').html(casesView.el);
		
	});
	
	/**
	 * Gets every conversation of the contact (if it has email) with the associated 
	 * email (gmail or imap) in Email-preferences of this CRM, when "Mail" tab is 
	 * clicked.  
	 */
	$('#contactDetailsTab a[href="#mail"]').live('click', function (e){
		e.preventDefault();
		
		var contact = App_Contacts.contactDetailView.model;
		var json = contact.toJSON();
		 
		// Get email of the contact in contact detail
		var email = getPropertyValue(json.properties, "email");
		
		// Shows an error alert, when there is no email to the contact 
		if(!email){
			$('#mail', App_Contacts.contactDetailView.model.el).html('<div class="alert alert-error span4" style="margin-top:30px"><a class="close" data-dismiss="alert" href="#">&times;</a>Sorry! this contact has no email to get the mails.</div>').show();
			return;	
		}	
		
		// Fetches mails collection
		var mailsView = new Base_Collection_View({
			url: 'core/api/emails/imap-email?e=' + encodeURIComponent(email) + '&c=10&o=0',
            templateKey: "email-social",
            restKey: "emails",
            sortKey:"date_secs",
            descending: true,
            individual_tag_name: 'li',
            postRenderCallback: function(el) {
        	
          	head.js(LIB_PATH + 'lib/jquery.timeago.js', function() { 
    			$(".email-sent-time", el).each(function(index, element) {
    				
    				//console.log("before :" + $(element).html())
    				//console.log("converted manually" + jQuery.timeago($(element).html()));
    				$(element).timeago();
    				//console.log($(element).html())
    			});
			});
          	
          	 var imap;
          	 queueGetRequest('email_prefs_queue','/core/api/imap','json', 
          			 function(data){
          		     imap = data;
          	 });

          	 queueGetRequest('email_prefs_queue','/core/api/social-prefs/GMAIL', 'json',
          			 function(gmail){
          		 if(!imap && !gmail)
              		 $('#email-prefs-verification',el).css('display','block');
             });
            }
		});
        mailsView.collection.fetch();
        $('#mail', App_Contacts.contactDetailView.model.el).html(mailsView.el);
	});
	
	/**
	 * Gets the activities of a contact from browsing history, using its
	 * email. To do so the email should be run in analytics script provided by 
	 * agileCRM.
	 */ 
	$('#contactDetailsTab a[href="#stats"]').live('click', function (e){
		e.preventDefault();
		
		var contact = App_Contacts.contactDetailView.model;
		var json = contact.toJSON();
		 
		// Get email of the contact in contact detail
		var email = getPropertyValue(json.properties, "email");
		
		// Shows an error alert, when there is no email to the contact 
		if(!email){
			$('#stats', App_Contacts.contactDetailView.model.el).html('<div class="alert alert-error span4" style="margin-top:30px"><a class="close" data-dismiss="alert" href="#">&times;</a>Sorry! this contact has no email to get the stats.</div>').show();
			return;	
		}
		
		// To avoid unnecessary JSAPI count, first verify in cookie
		if(!(readCookie('_agile_jsapi') != null && readCookie('_agile_jsapi') == "true") && (NO_WEB_STATS_SETUP && get_web_stats_count_for_domain() == '0'))
		{
			$('#stats', App_Contacts.contactDetailView.model.el).html('<h4><p>You have not yet setup the Javascript API on your website.</p><p>Please <a href="#analytics-code">set it up</a> to see the contact\'s site visits here.</p></h4>');
			return;
		}
			
		// Add tag if data is not 0
        addTagAgile(CODE_SETUP_TAG);

			var statsView = new Base_Collection_View({
			url: 'core/api/web-stats?e=' + encodeURIComponent(email),
			data: statsCollection.toJSON(),
			templateKey: "stats",
            individual_tag_name: 'li',
            postRenderCallback: function(el)
            {
            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function() { 
        			$(".stats-created-time", el).each(function(index, element) {
        				$(element).timeago();
        			});
    			});
            }
        });
		
        statsView.collection.fetch();
        
        // Organises collection based on created_time in decreasing order
        statsView.collection.comparator = function(model)
        {
        	if (model.get('created_time'))
	            return -model.get('created_time');
	                                      
        }
        
        $('#stats',this.el).html(statsView.el);
        
	});
	
	/**
	 * Fetches all the logs of the campaigns that the contact is subscribed to and
	 * shows them in a table. Also shows a campaigns drop down list to subscribe
	 * the contact to the selected campaign.  
	 */
	$('#contactDetailsTab a[href="#campaigns"]').live('click', function (e){
		e.preventDefault();
		var campaignsView = new Base_Collection_View({
			url: '/core/api/campaigns/logs/contact/' + App_Contacts.contactDetailView.model.id,
            restKey: "logs",
            templateKey: "campaigns",
            individual_tag_name: 'li',
            sortKey:'time',
			descending:true,
            postRenderCallback: function(el) {
            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
              		 $("time.log-created-time", el).timeago();
              	});
              // var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
             // fillSelect('campaignSelect','/core/api/workflows', 'workflow', 'no-callback ', optionsTemplate);
            }
        });
		campaignsView.collection.fetch();	
        $('#campaigns', this.el).html(campaignsView.el);
	});
	
	$('#contactDetailsTab a[href="#company-contacts"]').live('click',function(e)
	{
		e.preventDefault();
		fill_company_related_contacts(App_Contacts.contactDetailView.model.id,'company-contacts');       
	});
	    
	 
	/**
	 * Populates subject and description using email templates, on select option 
	 * change of "Fill From Templates" field.
	 */
	$('.emailSelect').die().live('change',function(e){
		e.preventDefault();
		
		// To remove previous errors
		$('#emailForm').find('.error').removeClass('error');
		$('#emailForm').find('.help-inline').css('display','none');

		var model_id = $('.emailSelect option:selected').attr('value');
	
		// When default option selected make subject and body empty
		if(!model_id)
			{
			// Fill subject and body of send email form
			$("#emailForm").find( 'input[name="subject"]' ).val("");
			
			set_tinymce_content('email-body', '');
			
			$("#emailForm").find( 'textarea[name="body"]' ).val("");
			return;
			}
		
		var emailTemplatesModel = Backbone.Model.extend({
		     url: '/core/api/email/templates/' + model_id,
		     restKey: "emailTemplates"
		});
		var templateModel = new emailTemplatesModel();
			templateModel.fetch({success: function(data){
				var model = data.toJSON();
				
				var subject = model.subject;
				var text = model.text;
				
				// Apply handlebars template on send-email route 
				if(Current_Route !== 'bulk-email')
				{
				
				// Get Current Contact
/*				var contact = App_Contacts.contactDetailView.model;
				var json = contact.toJSON();*/
				
				/*
				 * Get Contact properties json to fill the templates
				 * using handlebars
				 */  
				var json = get_contact_json_for_merge_fields();
				var template;
					
					// Templatize it
					try
					{
						template = Handlebars.compile(subject);
						subject =  template(json);
					}
					catch(err)
					{
						subject = add_square_brackets_to_merge_fields(subject);
						
						template = Handlebars.compile(subject);
						subject =  template(json);
					}
				    
					try
					{
						template = Handlebars.compile(text);
						text =  template(json);
					}
					catch(err)
					{
						text = add_square_brackets_to_merge_fields(text);
						
						template = Handlebars.compile(text);
						text =  template(json);
					}
				}
				
				// Fill subject and body of send email form
				$("#emailForm").find( 'input[name="subject"]' ).val(subject);
				
				// Insert content into tinymce
				set_tinymce_content('email-body', text);
			}});
		    
	});
	
	/**
	 * Sends email to the target email. Before sending, validates and serializes email form. 
	 */ 
	$('#sendEmail').die().live('click',function(e){
		e.preventDefault();
		
		 if($(this).attr('disabled'))
	   	     return;
		 
		// Is valid
		if(!isValidForm($('#emailForm')))
	      	return;
		
		// Disables send button and change text to Sending...
		disable_send_button($(this));
		
		// Saves tinymce content to textarea
		save_content_to_textarea('email-body');
		
		// serialize form.
		var json = serializeForm("emailForm");
		
		// Navigates to previous page on sending email
		$.ajax({
				type:'POST',
				data: json,
				url: 'core/api/emails/contact/send-email',
				success:function(){
					
					    // Enables Send Email button.
					    enable_send_button($('#sendEmail'));
					    
					    var route = Current_Route + "";
					   
			            if(route.match("send-email") != null && App_Contacts.contactDetailView)
			            	App_Contacts.navigate("contact/" + App_Contacts.contactDetailView.model.id, {trigger:true});
			            else
			            	window.history.back();
			            
		                 },
		        error: function()
		               {
		        	      enable_send_button($('#sendEmail'));
		        	      
		        	      console.log("Error occured while sending email");
		               }
		});

	});
	
	/**
	 * Close button click event of send email form. Navigates to contact
	 * detail view.
	 */
	$('#send-email-close').die().live('click',function(e){
		e.preventDefault();
		
		if(App_Contacts.contactDetailView)
			Backbone.history.navigate("contact/" + App_Contacts.contactDetailView.model.id, {
				trigger: true
			});
		else
			window.history.back();
	});	

	/**
	 * Delete functionality for activity blocks in contact details
	 */
	$('.activity-delete').die().live('click', function(e){
		e.preventDefault();
		
		var model = $(this).parents('li').data();
		
		if(model && model.collection)
		{
			model.collection.remove(model);
		}

		// Gets the id of the entity
		var entity_id = $(this).attr('id');

		// Gets the url to which delete request is to be sent
		var entity_url = $(this).attr('url');

		if(!entity_url)
			return;
		
		var id_array = [];
		var id_json = {};
		
		// Create array with entity id.
		id_array.push(entity_id);
		
		// Set entity id array in to json object with key ids, 
		// where ids are read using form param
		id_json.ids = JSON.stringify(id_array);
		var that = this;

		// Add loading. Adds loading only if there is no loaded image added already i.e., 
		// to avoid multiple loading images on hitting delete multiple times
		if($(this).find('.loading').length == 0)
			$(this).prepend($(LOADING_HTML).addClass('pull-left').css('width', "20px"));
		
		$.ajax({
			url: entity_url,
			type: 'POST',
			data: id_json,
			success: function() {
				// Removes activity from list
				$(that).parents(".activity").fadeOut(400, function(){ $(this).remove(); });
				removeItemFromTimeline($("#" + entity_id, $("#timeline")));
			}
		});
	});
	
	$('#cc-link, #bcc-link').die().live('click', function(e){
		e.preventDefault();
		
		// Hide link
		$(this).hide();
		
		if($(this).attr('id') === 'cc-link')
		{
			$('#email_cc').closest('.control-group').show();
			
			// Hide div.control-group to reduce space between subject
			if($(this).parent().find('#bcc-link').css('display') === 'none')
				$(this).closest('.control-group').hide();
			
			return;
		}
		
		if($(this).parent().find('#cc-link').css('display') === 'none')
			$(this).closest('.control-group').hide();
		
		$('#email_bcc').closest('.control-group').show();
	});
	
});

/**
 * Returns contact properties in a json
 * 
 * @method get_property_JSON
 * @param {Object} contactJSON
 * 			contact as json object
 */  
function get_property_JSON(contactJSON)
{	
	var properties = contactJSON.properties;
    var json = {};
	$.each(properties, function(i, val)
			{
				json[this.name] = this.value;
			});
	console.log(json);
	return json;
}

/**
 * Populates send email details (from address, to address, signature and
 * email templates) 
 * 
 * @method populate_send_email_details
 * @param {Object} el
 * 			html object of send email form
 */
function populate_send_email_details(el){

	$("#emailForm",el).find('input[name="from_name"]').val(CURRENT_DOMAIN_USER.name);
	$("#emailForm", el).find( 'input[name="from_email"]' ).val(CURRENT_DOMAIN_USER.email);
	
	// Fill hidden signature field using userprefs 
	//$("#emailForm").find( 'input[name="signature"]' ).val(CURRENT_USER_PREFS.signature);

	// Prefill the templates
	var optionsTemplate = "<option value='{{id}}'> {{subject}}</option>";
	fillSelect('sendEmailSelect', '/core/api/email/templates', 'emailTemplates', undefined , optionsTemplate, false, el, '- Fill from Template -');
}

/**
 * Activates "Timeline" tab and its tab-content in contact details and
 * also deactivates the other activated tabs.
 * 
 * @method activate_timeline_tab
 * 
 * Changed to activate first tab in the list ( on contact-details page , works even on company-details page
 * @modified Chandan
 */
function activate_timeline_tab(){
	$('#contactDetailsTab').find('li.active').removeClass('active');
	$('#contactDetailsTab li:first-child').addClass('active');
	
	$('div.tab-content').find('div.active').removeClass('active');
	$('div.tab-content > div:first-child').addClass('active');
	
	//	$('#time-line').addClass('active');  //old original code for flicking timeline
	
	if(App_Contacts.contactDetailView.model.get('type')=='COMPANY')
	{
		fill_company_related_contacts(App_Contacts.contactDetailView.model.id,'company-contacts'); 
	}
}

/**
 * Disables Send button of SendEmail and change text from Send to Sending...
 * 
 * @param elem - element to be disabled.
 * 
 **/
function disable_send_button(elem)
{
	elem.css('min-width',elem.width()+'px')
		.attr('disabled', 'disabled')
		.attr('data-send-text',elem.text())
		.text('Sending...');
}

/**
 * Enables disabled Send button and keep old text
 * 
 * @param elem - element to be enabled.
 * 
 **/
function enable_send_button(elem)
{
	elem.text(elem.attr('data-send-text')).removeAttr('disabled data-send-text');
}

/**
 * Returns webstats count w.r.t domain
 **/
function get_web_stats_count_for_domain()
{
	// Returns web-stats count
	return $.ajax({type: "GET", url: 'core/api/web-stats/JSAPI-status', async: false}).responseText;
}