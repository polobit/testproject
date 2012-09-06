
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
        "add-opportunity": "addOpportunityToContact",
         
        /* Views */
        "contact-view-add": "contactViewAdd",
        "contact-views": "contactViews",
        "contact-custom-view-edit/:id": "editContactView",
          
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
                  pieTags(cel);
            	  setupViews(cel);
                  
                  
                		  
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
          
          $(".active").removeClass("active");
          $("#contactsmenu").addClass("active");    
         
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
            template: "contact-detail",
            postRenderCallback: function(el) {
                loadWidgets(el, contact.toJSON());
               }
        });
        
       
        var el = this.contactDetailView.render().el;
      
        $('#content').html(el);
       
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
      
      	
      	// Delete email as well as it has to be unique
      	json = delete_contact_property(json, 'email');
        delete json.id;	
        
        var contactDuplicate = new Backbone.Model();
        contactDuplicate.url = 'core/api/contacts';
        contactDuplicate.save(json,{
        	success: function(data)
        	{
				deserializeContact(data.toJSON());
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
    addOpportunityToContact: function() {
    	this.opportunityView = new Base_Model_View({
            url: 'core/api/opportunity',
            template: "opportunity-add",
            isNew: true,
            window: 'deals',
            postRenderCallback: function(el){
            	populateUsers("owner", el);
            	var json = App_Contacts.contactDetailView.model.toJSON();
            	var contact_name = json.properties[0].value + " " + json.properties[1].value;
            	$('.tags',el).append('<li class="label label-warning"  style="display: inline-block; vertical-align: middle; margin-right:3px;" value="'+ json.id +'">'+contact_name+'</li>');

            	// Enable the datepicker
                $('#close_date', el).datepicker({
                    format: 'mm-dd-yyyy'
                });
            }
        });

    	var view = this.opportunityView.render();
     	
        $('#content').html(view.el);
    },
         
    contactViewAdd: function(){
    	var view = new Base_Model_View({
    		url: 'core/api/contact-view',
    		isNew: true,
    		window: "contact-views",
    		 template: "contact-view",
    		postRenderCallback: function(el) {
    			
    			head.js(LIB_PATH + 'lib/jquery.multi-select.js', function(){
    			
    				$('#multipleSelect', el).multiSelect();
    				$('.ms-selection', el).children('ul').addClass('multiSelect').attr("name", "fields_set").sortable();
    			});
    		}
    		 
    	});
    	$('#content').html(view.render().el);
    },
    contactViews: function() {
    	   this.contactViewListView = new Base_Collection_View({
               url: '/core/api/contact-view',
               restKey: "contactView",
               templateKey: "contact-custom-view",
               individual_tag_name: 'tr'
           });
    	   this.contactViewListView.collection.fetch();
    	   $('#content').html(this.contactViewListView.el);
    },
    editContactView: function(id) {    	
    	
    	if (!App_Contacts.contactViewListView || App_Contacts.contactViewListView.collection.length == 0 || App_Contacts.contactViewListView.collection.get(id) == null)
    	{
    		this.navigate("contact-views", {
                trigger: true
            });
    	}
    	var contact_view_model = App_Contacts.contactViewListView.collection.get(id);
    	
    	
    	var contactView = new Base_Model_View({
    		url: 'core/api/contact-view/' + id,
    		model: contact_view_model,
    		template: "contact-view",
    		restKey: "contactView",
            window: 'contact-views',
            postRenderCallback: function(el) {
       			head.js('lib/jquery.multi-select.js', function(){
       					$('#multipleSelect', el).multiSelect();
       					$('.ms-selection', el).children('ul').addClass('multiSelect').attr("name", "fields_set").attr("id","fields_set").sortable();
       				});
       			}

    	});
    	
    	$("#content").html(contactView.render().el);
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
    		$("#fourthSelect").remoteChained("#secondSelect","/core/api/tags/filter-tags");
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