
var ContactsRouter = Backbone.Router.extend({

    routes: {
        "": "dashboard",

        /* Contacts */
        "contacts": "contacts",
        "contact/:id": "contactDetails",
        "import": "importContacts",
        "add-widget": "addWidget",
        "contact-edit":"editContact",
        "contact-duplicate":"duplicateContact",
        "tags/:tag": "contacts",
        "contacts-filter": "filterContacts",
        "send-email": "sendEmail",

         
        /* Views */
        "contact-view-add": "contactViewAdd",
        "contact-views": "contactViews",
          
        /* New Contact/Company - Full mode */
        "continue-contact": "continueContact",
        "continue-company": "continueCompany",

        /* Return back from Scribe after oauth authorization */
        "gmail": "email",
        "twitter": "socialPrefs",
        "linkedin": "socialPrefs"
    },
    initialize: function () {

    	 
    	    
    },

    dashboard: function () {

    },
    contacts: function (tag_id) {
    		
    	var max_contacts_count = 20;
    	 
    	// Tags, Search & default browse comes to the same function
    	var url = '/core/api/contacts/cursor/' + max_contacts_count;
    	var restKey = 'contacts';
    	if(tag_id)
    	{
    		url = '/core/api/tags/' + tag_id;
    		restKey = 'contact';
    	}
    	 
    	console.log("Fetching from " + url);
    	
          this.contactsListView = new Base_Collection_View({
              url: url,
              restKey: restKey,
              templateKey: "contacts",
              individual_tag_name: 'tr',
              cursor: true
          });

          // Contacts are fetched when the app loads in the initialize
          var cel = this.contactsListView.el;
          var collection = this.contactsListView.collection;
          this.contactsListView.collection.fetch({
              success: function (collection, response) {
                  setupTags(cel);

                  // Set the cursor
                  //console.log("Cursor " + response.cursor);
                  collection.cursor = response.cursor;
              }
          });

          // Show the views collection on the actions dropdown 	
          var customView = new Base_Collection_View({
              url: 'core/api/contact-view',
              restKey: "contactView",
              templateKey: "contact-view",
              individual_tag_name: 'li',
          });


          $('#content').html(this.contactsListView.render().el);
         
    },

    contactDetails: function (id, contact) {

    	// If hte user refreshes the contacts list view page directly - we should load from the model
        if(!contact)
    	if (!this.contactsListView || this.contactsListView.collection.length == 0 || this.contactsListView.collection.get(id) == null) {
        	
    		
    		console.log("Downloading contact");
    		
        	// Download 
        	var contact_details_model = Backbone.Model.extend({
        		  url: function() {
        		    return '/core/api/contacts/'+this.id;
        		  }
        		});
        	
        	var model = new contact_details_model();
        	model.id = id;
        	model.fetch({ success: function(data) { 
        		
        			// Call Contact Details again
        			App_Contacts.contactDetails(id, model);
        	}});
        	
        	
        	return;
        }

        // If not downloaded fresh during refresh - read from collection
        if(!contact)
        	contact = this.contactsListView.collection.get(id);
        
        this.contactDetailView = new Base_Model_View({
            model: contact,
            template: "contact-detail"
        });
        
       
        var el = this.contactDetailView.render().el;
       
        //$('#contact-details-list').html(el);
        $('#content').html(el);
       
        var socialEl = this.el;
        //addSocial(socialEl);

        // Add Widgets (RHS)
        //alert("Loading widgets");
        loadWidgets(el, contact.toJSON());
    },
    editContact: function () {
    	
    	 // Takes back to contacts if contacts list view is not defined
   	 if (!this.contactDetailView || !this.contactDetailView.model.id || !this.contactsListView || this.contactsListView.collection.length == 0) {
            this.navigate("contacts", {
                trigger: true
            });
            return;
        }
   	 	
    	// Contact Edit - take him to continue-contact form
    	var contact = this.contactsListView.collection.get(this.contactDetailView.model.id);
     	//$('#content').html(getTemplate('continue-contact', contact.toJSON()));
     	deserializeContact(contact.toJSON())
     	
    },
    
    duplicateContact: function () {
    	
      	 // Takes back to contacts if contacts list view is not defined
     	 if (!this.contactDetailView || !this.contactDetailView.model.id || !this.contactsListView || this.contactsListView.collection.length == 0) {
              this.navigate("contacts", {
                  trigger: true
              });
              return;
         }
     	 	
      	// Contact Duplicate
      	var contact = this.contactsListView.collection.get(this.contactDetailView.model.id);
      	var json = contact.toJSON();
      	delete json.id;
        var contactDuplicate = new Backbone.Model();
        contactDuplicate.url = 'core/api/contacts';
        contactDuplicate.save(json,{
        	success: function(data)
        	{
        		console.log("dulicate created");
        	}
        });
    },
    continueContact: function () {
        $('#content').html(getTemplate('continue-contact', {}));
    },

    continueCompany: function () {
        $('#content').html(getTemplate('continue-company', {}));
    },
    importContacts: function () {
        $('#content').html(getTemplate("import-contacts", {}));
        head.js('lib/fileuploader-min.js', function(){
        	fileUploadInit();
        });
    },
   
    addWidget: function () {

        pickWidget();

    },
    
    contactViewAdd: function(){
    	var view = new Base_Model_View({
    		url: 'core/api/contact-view',
    		window: "contact-views",
    		 template: "contact-view",
    	});
    	$('#content').html(view.render().el);
    },
    contactViews: function() {
    	   var contactViewListView = new Base_Collection_View({
               url: '/core/api/contact-view',
               restKey: "contactView",
               templateKey: "contact-list-view",
               individual_tag_name: 'tr'
           });
    	   contactViewListView.collection.fetch();
    	   console.log(contactViewListView.el);
    	   $('#content').html(contactViewListView.el);
    },
    sendEmail: function(){
    	
    	// Show the email form with the email prefilled from the curtrent contact
    	var model =  this.contactDetailView.model;
    	var sendEmailView = new Base_Model_View({
            model: model,
            template: "send-email"
        });
    	$("#content").html(sendEmailView.render().el);
    	
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
    },  
    
    filterContacts: function()
    {
    	head.js('lib/jquery.chained.min.js', function()
    	{
    		$('#content').html(getTemplate('filter-contacts', {}));
    		$("#secondSelect").chained("#firstSelect"); 
    		$("#thirdSelect").chained("#secondSelect");
    		$("#fourthSelect").remoteChained("#secondSelect","/core/api/filter-tags");
    	})
    },
    
});


function setupTags(cel) {
    // Add Tags
    var TagsCollection = Backbone.Collection.extend({
        url: '/core/api/tags',
        sortKey: 'tag',
        parse: function (response) {
            return response.tag;
        }
    });
    var tagsCollection = new TagsCollection();
    tagsCollection.fetch({
        success: function () {
            var tagsHTML = getTemplate('tagslist', tagsCollection.toJSON());
            var len = $('#tagslist', cel).length;
            $('#tagslist', cel).html(tagsHTML);

            setupTagsTypeAhead(tagsCollection.models);
        }
    });

}