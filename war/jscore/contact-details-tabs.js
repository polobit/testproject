$(function(){ 

	// Notes
	var id;
	$('#contactDetailsTab a[href="#notes"]').live('click', function (e){
		e.preventDefault();
	    id = App_Contacts.contactDetailView.model.id;
		var notesView = new Base_Collection_View({
            url: '/core/api/contacts/' + id + "/notes",
            restKey: "note",
            templateKey: "notes",
            individual_tag_name: 'tr'
        });
        notesView.collection.fetch();
        $('#notes', this.el).html(notesView.el);
	});
	
	// Deals with id
	$('#contactDetailsTab a[href="#deals"]').live('click', function (e){
		e.preventDefault();
		id = App_Contacts.contactDetailView.model.id;
		var dealsView = new Base_Collection_View({
			url: 'core/api/contacts/'+ id + "/deals" ,
            restKey: "opportunity",
            templateKey: "deals",
            individual_tag_name: 'tr'
        });
        dealsView.collection.fetch();
        $('#deals', this.el).html(dealsView.el);
		
	});
	
	// Events
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
	
	// Mails
	$('#contactDetailsTab a[href="#mail"]').live('click', function (e){
		e.preventDefault();
		
		var contact = App_Contacts.contactDetailView.model;
		var json = contact.toJSON();
		 
		// Get email of the contact in contact detail
		var email = getPropertyValue(json.properties, "email");
		if(!email)
			return;	
				
		var mailsView = new Base_Collection_View({
			url: 'core/api/email?e=' + encodeURIComponent(email) + '&c=10&o=0',
            templateKey: "email-social",
            restKey: "emails",
            individual_tag_name: 'tr'
        });
        mailsView.collection.fetch();
        $('#mail', this.el).html(mailsView.el);
	});
	
	// Activities
	$('#contactDetailsTab a[href="#activities"]').live('click', function (e){
		e.preventDefault();
		var activitiesView = new Base_Collection_View({
			url: 'core/api/stats?e=' + encodeURIComponent("sam@invox.com") ,
			templateKey: "stats",
            individual_tag_name: 'tr'
        });
        activitiesView.collection.fetch();
        $('#activities', this.el).html(activitiesView.el);
	});
	
	// Campaigns
	$('#contactDetailsTab a[href="#campaigns"]').live('click', function (e){
		e.preventDefault();
		var campaignsView = new Base_Collection_View({
			url: '/core/api/campaigns/logs/contact/' + App_Contacts.contactDetailView.model.id,
            restKey: "logs",
            templateKey: "campaigns",
            individual_tag_name: 'tr'
        });
		campaignsView.collection.fetch();
        $('#campaigns', this.el).html(campaignsView.el);
        
        // var optionsTemplate = "<li> <a value='{{id}}'>{{name}}</a></li>";
        var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
        fillSelect('campaignSelect','/core/api/workflows', 'workflow', 'no-callback ', optionsTemplate);
	});
	    
	 
	// Populate subject and description on select option change
	$('.emailSelect').die().live('change',function(e){
		e.preventDefault();
		var model_id = $('.emailSelect option:selected').attr('value');
			
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
				console.log(contact);

				console.log(json);
				console.log(model);
				
				// Get Contact properties json
				var json = getPropertyJSON(json);
				
				// Templatize it
				var template = Handlebars.compile(model.subject);
				var subject =  template(json);
				
				template = Handlebars.compile(model.text);
				var text =  template(json);
						
				$("#emailForm").find( 'input[name="subject"]' ).val(subject);
				$("#emailForm").find( 'textarea[name="body"]' ).val(text);
			}});
		    
	});
	
	// Send email
	$('#sendEmail').die().live('click',function(e){
		e.preventDefault();
		var json = serializeForm("emailForm");
		var url =  'core/api/send-email?from=' + encodeURIComponent(json.from) + '&to=' + 
		   										 encodeURIComponent(json.to) + '&subject=' + encodeURIComponent(json.subject) + '&body=' + 
		   										 encodeURIComponent(json.body);
		$.post(url);

	});
	
	// Help mail
	$('#helpMail').die().live('click',function(e){
		        e.preventDefault();
				var json = serializeForm("helpmailForm");
				var url =  'core/api/send-email?from=' + encodeURIComponent(json.from) + '&to=' + 
				   										 encodeURIComponent(json.to) + '&subject=' + encodeURIComponent(json.subject) + '&body=' + 
				   										 encodeURIComponent(json.body);
				$.post(url);
			
	});
	
	// Campaign select 
	$('#campaignSelect').die().live('change',function(e){
		e.preventDefault();
		var workflow_id = $('#campaignSelect option:selected').attr('value');
		var contact_id = App_Contacts.contactDetailView.model.id;
		var url = '/core/api/campaigns/enroll/' + contact_id + '/' + workflow_id;

		$.get(url, function(data){
    		$(".enroll-success").html('<div class="alert alert-success"><a class="close" data-dismiss="alert" href="#">×</a>Enrolled successfully.</div>'); 
	   });
	});

});

// Return contact properties in a json
function getPropertyJSON(contactJSON)
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

// Populate send email details
function populateSendEmailDetails(el){
	 // Add From address to the form (FROM - current user email)
	 var CurrentuserModel = Backbone.Model.extend({
	     url: '/core/api/current-user',
	     restKey: "domainUser"
	});
	 
	var currentuserModel = new CurrentuserModel();
	currentuserModel.fetch({success: function(data){
			var model = data.toJSON();
			$("#emailForm").find( 'input[name="from"]' ).val(model.email);
	}});
	
	// Prefill the templates
	var optionsTemplate = "<option value='{{id}}'> {{subject}}</option>";
	fillSelect('sendEmailSelect', '/core/api/email/templates', 'emailTemplates', undefined , optionsTemplate);
}