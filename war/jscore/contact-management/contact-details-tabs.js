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
var tasksView;
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
	 * Fetches all the events related to the contact and shows the events collection 
	 * as a table in its tab-content, when "Events" tab is clicked.
	 * 
	 * "Events" tab is not there for now.
	 */
	$('#contactDetailsTab a[href="#events"]').live('click', function (e){
		e.preventDefault();
		var eventsView = new Base_Collection_View({
			url: 'core/api/events',
            restKey: "events",
            templateKey: "events",
            individual_tag_name: 'tr'
        });
        eventsView.collection.fetch();
        $('#events', this.el).html(eventsView.el);
		
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
			$('#mail', App_Contacts.contactDetailView.model.el).html('<div class="alert alert-error span4" style="margin-top:30px"><a class="close" data-dismiss="alert" href="#">×</a>Sorry! this contact has no email to get the mails.</div>').show().delay(3000).hide(1);
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
			$('#stats', App_Contacts.contactDetailView.model.el).html('<div class="alert alert-error span4" style="margin-top:30px"><a class="close" data-dismiss="alert" href="#">×</a>Sorry! this contact has no email to get the stats.</div>').show().delay(3000).hide(1);
			return;	
		}
		
		$.get('core/api/web-stats/JSAPI-status',function(data){
			if(data == 0){
				$('#stats', App_Contacts.contactDetailView.model.el).html('<h4><p>You have not yet setup the Javascrip API on your website.</p><p>Please <a href="#analytics-code">set it up</a> to see the contact\'s site visits here.</p></h4>');
				return;
			}
		});
		
		var statsView = new Base_Collection_View({
			url: 'core/api/web-stats?e=' + encodeURIComponent(email) ,
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
				
				// Get Current Contact
				var contact = App_Contacts.contactDetailView.model;
				var json = contact.toJSON();
				
				/*
				 * Get Contact properties json to fill the templates
				 * using handlebars
				 */  
				var json = get_property_JSON(json);
				
				// Templatize it
				var template = Handlebars.compile(model.subject);
				var subject =  template(json);
				
				template = Handlebars.compile(model.text);
				var text =  template(json);
						
				text = text.replace(/<br>/gi, "\n");
				text = text.replace(/<p.*>/gi, "\n");
				text = text.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ");
				text = text.replace(/<(?:.|\s)*?>/g, "");
				text = text.replace(/&nbsp;/g, " ");
				
				// Fill subject and body of send email form
				$("#emailForm").find( 'input[name="subject"]' ).val(subject);
				//var value = $("#emailForm").find( 'textarea[name="body"]' ).val(text);
				
				//Fill html editor with template body
				var wysihtml5 = $('#body').data('wysihtml5');
				
				if(wysihtml5){
					editor.focus();
					wysihtml5.editor.composer.commands.exec("insertHTML",text);
				}	
				
			}});
		    
	});
	
	/**
	 * Sends email to to the contact 
	 */ 
	$('#sendEmail').die().live('click',function(e){
		e.preventDefault();
		
		if(!isValidForm($('#emailForm')))
	      {	
	      	return;
	      }
		
		var json = serializeForm("emailForm");
		
		json.body = json.body.replace(/\r\n/g,"<br/>");
		
		var url =  'core/api/emails/contact/send-email?from=' + encodeURIComponent(json.from) + '&to=' + 
			 encodeURIComponent(json.to + "," + json.email_cc) + '&subject=' + encodeURIComponent(json.subject) + '&body=' + 
				 encodeURIComponent(json.body) + '<br/><div><br/><br/>' + encodeURIComponent(json.signature) + '</div>';
		
		// Shows message 
	    $save_info = $('<img src="img/1-0.gif" height="18px" width="18px"></img>&nbsp;&nbsp;<span><p class="text-success" style="color:#008000; font-size:15px; display:inline-block"> <i>Sending mail...</i></p></span>');
	    $("#msg", this.el).append($save_info);
		$save_info.show().delay(2000).fadeOut("slow");
		
		// Navigates to previous page on sending email
		$.post(url, function(){
			window.history.back();
		});

	});
	
	/**
	 * Close button click event of send email form. Navigates to contact
	 * detail view.
	 */
	$('#send-email-close').die().live('click',function(e){
		e.preventDefault();
		Backbone.history.navigate("contact/" + App_Contacts.contactDetailView.model.id, {
            trigger: true
        });
	});	

//	/**
//	 * Subscribes the contact to the selected campaign on clicking "Add"
//	 * button and activates the "Timeline" tab to inserts the campaign 
//	 * related logs into time-line.  
//	 */   
//	$('#campaignSelect').die().live('change',function(e){
//		e.preventDefault();
//		
//		var workflow_id = $('#campaignSelect option:selected').attr('value');
//		
//		if(!workflow_id){
//			return;
//		}
//		
//		$('.add-campaign').find('span.save-status').html(LOADING_HTML);
//		
//		var contact_id = App_Contacts.contactDetailView.model.id;
//		var url = '/core/api/campaigns/enroll/' + contact_id + '/' + workflow_id;
//
//		if(!confirm("Are you sure to run selected campaign?"))
//			return;
//		
//		// Gets logs related to a campaign
//		$.get(url, function(data){
//			$('.add-campaign').find('span.save-status img').remove();
//			
//			// Fetches logs and adds to timeline
//			var LogsCollection = Backbone.Collection.extend({
//				url: '/core/api/campaigns/logs/contact/' + contact_id + '/' + workflow_id,
//			});
//			var logsCollection = new LogsCollection();
//			logsCollection .fetch({
//				success: function(){
//					
//					// Activates timeline in contact detail tab and tab content
//					activate_timeline_tab();
//					
//					// If timeline is not defined yet, calls setup_timeline for the first time
//					if(timelineView.collection.length == 0){
//						
//						$.each(logsCollection.toJSON(), function(index, model) {
//							timelineView.collection.add(model);
//						});	
//						
//						setup_timeline(timelineView.collection.toJSON(), App_Contacts.contactDetailView.el, undefined);
//					} else{
//					
//						// Inserts logs into time-line
//						$.each(logsCollection.toJSON(), function(index, model) {
//								var newItem = $(getTemplate("timeline", model));
//								newItem.find('.inner').append('<a href="#" class="open-close"></a>');
//								$('#timeline').isotope( 'insert', newItem);
//						});
//					}
//				}
//			});
//	   });
//	});
	
	/**
	 * Delete functionality for activity blocks in contact details
	 */
	$('.activity-delete').die().live('click', function(e){
		e.preventDefault();

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
			}
		});
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
	 // Add From address to the form (FROM - current user email)
	 var CurrentuserModel = Backbone.Model.extend({
	     //url: '/core/api/imap',
	     url: '/core/api/current-user',
	     restKey: "domainUser"
	});
	var currentuserModel = new CurrentuserModel();
	currentuserModel.fetch({success: function(data){
			var model = data.toJSON();
			$("#emailForm").find( 'input[name="from"]' ).val(model.email);
	}});

	// Fill hidden signature field using userprefs 
	//$("#emailForm").find( 'input[name="signature"]' ).val(CURRENT_USER_PREFS.signature);
	
	// Prefill the templates
	var optionsTemplate = "<option value='{{id}}'> {{subject}}</option>";
	fillSelect('sendEmailSelect', '/core/api/email/templates', 'emailTemplates', undefined , optionsTemplate);
}

/**
 * Activates "Timeline" tab and its tab-content in contact details and
 * also deactivates the other activated tabs.
 * 
 * @method activate_timeline_tab
 */
function activate_timeline_tab(){
	$('#contactDetailsTab').find('li.active').removeClass('active');
	$('#contactDetailsTab li:first-child').addClass('active');
	
	$('div.tab-content').find('div.active').removeClass('active');
	$('#time-line').addClass('active');
}