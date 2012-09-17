
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
        "send-email": "sendEmail",
        "add-opportunity": "addOpportunityToContact",
         
        /* Views */
        "contact-view-add": "contactViewAdd",
        "contact-views": "contactViews",
        "contact-custom-view-edit/:id": "editContactView",
          
        /*Contact-Filters*/
        "contact-filter-add": "contactFilterAdd",
        "contact-filter-edit/:id" : "contactFilterEdit",
        "contact-filter/:id" : "showFilterContacts",
        
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
    contacts: function (tag_id, filter_id) {
    		
    	var max_contacts_count = 20;
    	
    	var url = '/core/api/contacts';
    	// Tags, Search & default browse comes to the same function
    	
    	if(tag_id)
    	{
    		url = '/core/api/tags/' + tag_id;
    	}
    	
    	// Search based on filter
    	if(filter_id)
    	{
    		url = "core/api/contacts/filters/query/" + filter_id;
    	}
    	 
    	console.log("Fetching from " + url);
    	
        this.contactsListView = new Base_Collection_View({
              url: url,
              templateKey: "contacts",
              individual_tag_name: 'tr',
              cursor: true,
              page_size: 4 
          });

          // Contacts are fetched when the app loads in the initialize
          var cel = this.contactsListView.el;
          var collection = this.contactsListView.collection;
          this.contactsListView.collection.fetch({
              success: function (collection, response) {
            	  setupTags(cel);
                  pieTags(cel);
            	  setupViews(cel);
            	  
            	  // show list of filters dropdown in contacts list
            	  setupContactFilterList(cel);
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
    showFilterContacts: function(filter_id)
    {
    	if(App_Contacts)
    		App_Contacts.contacts(undefined, filter_id);
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
            	
                loadTimelineDetails(el, id);
                
                starify(el);
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
       			head.js(LIB_PATH + 'lib/jquery.multi-select.js', function(){
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
    contactFilterAdd: function()
    {
    	var contacts_filter = new Base_Model_View({
    				url:'core/api/contacts/filters',
    	            template: "filter-contacts",
    	            isNew: true,
    	            postRenderCallback: function(el) {
       					
    	            	head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
    	           		    	{	
    	           					var LHS, condition, RHS, RHS_NEW;
    	           					
    	           					LHS = $("#LHS", el);
    	           					condition = $("#condition", el)
    	           					RHS = $("#RHS", el)
    	           					
    	           					// Extra field required for (Between values condition)
    	           					RHS_NEW = $("#RHS-NEW", el)
    	           					
    	           					// Chaining dependencies of input fields with jquery.chained.js
    	           					condition.chained(LHS);
    	           					RHS_NEW.chained(condition);
    	           					RHS.chained(LHS);
    	            			        	            			    
    	           		    	})
    	               }
    	        });
    	
        $('#content').html(contacts_filter.render().el);
    },
    contactFilterEdit : function(id)
    {
    	if (!App_Contacts.contactFiltersListView || App_Contacts.contactFiltersListView.collection.length == 0 || App_Contacts.contactFiltersListView.collection.get(id) == null)
    	{
    		this.navigate("contact-filters", {
                trigger: true
            });
    	}
    	
    	var contact_filter = App_Contacts.contactFiltersListView.collection.get(id);
    	  var ContactFilter = new Base_Model_View({
    	        url: 'core/api/contacts/filters',
    	        model: contact_filter,
    	        template: "filter-contacts",
    	        window: 'contact-filters',
	            postRenderCallback: function(el) {  
	            	head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
	           		    	{	
	           					var LHS, condition, RHS, RHS_NEW;
	           					
	           					LHS = $("#LHS", el);
	           					condition = $("#condition", el);
	           					RHS = $("#RHS", el);
	           					RHS_NEW = $("#RHS_NEW", el);
	           					
	           					// Chaining dependencies of input fields with jquery.chained.js
	           					condition.chained(LHS);
	           					fourth_select.chained(LHS);
	           					RHS_NEW.chained(condition);
	            			        	            			    
	           		    	})
	               }
    	    	});
    	    
    	    	var ContactFilter = ContactFilter.render();
    	    	$("#content").html(ContactFilter.el); 
    	
    }
    
});