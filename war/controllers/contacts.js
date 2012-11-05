
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
        "add-campaign": "addContactToCampaign",
         
        /* Views */
        "contact-view-add": "contactViewAdd",
        "contact-views": "contactViews",
        "contact-custom-view-edit/:id": "editContactView",
          
        /*Contact-Filters*/
        "contact-filter-add": "contactFilterAdd",
        "contact-filter-edit/:id" : "contactFilterEdit",
        "contact-filters": "contactfilters",
        "contact-filter/:id" : "showFilterContacts",
        
        /* New Contact/Company - Full mode */
        "continue-contact": "continueContact",
        "continue-company": "continueCompany",
        
        /* Contact bulk actions */
        "bulk-campaigns": "campaignsBulk",
        "bulk-tags": "tagsBulk",
        "bulk-email": "emailBulk",
        "bulk-owner": "ownerBulk",
        
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
    	
    	// Default url for contacts route
    	var url = '/core/api/contacts';
    	
    	// Tags, Search & default browse comes to the same function
    	if(tag_id)
    	{
    		url = '/core/api/tags/' + tag_id;
    	}
    	
    	// If contact-filter cookie is defined set url to fetch respective filter results
    	if(filter_id || (filter_id = readCookie('contact_filter')))
    	{
    		url = "core/api/filters/query/" + filter_id;
    	}
    	 console.log(url);
        // If view is set to custom view load the custom view
      	if(readCookie("contact_view"))
		{      		
      		// If there is a filter saved in cookie then show filter results in custom view saved
      		if(readCookie('contact_filter'))
      		{	
      			// Then call customview function with filter url
      			this.customView(readCookie("contact_view"), undefined, "core/api/filters/query/" + readCookie('contact_filter'));
      			return;
      		}
      		
      		// Else call customView function fetches results from default url : "core/api/contacts"
			this.customView(readCookie("contact_view"), undefined);
			return;
		}
      	
    	console.log("Fetching from " + url);
    	
        this.contactsListView = new Base_Collection_View({
              url: url,
              templateKey: "contacts",
              individual_tag_name: 'tr',
              cursor: true,
              page_size: 25,
              postRenderCallback: function(el) {
            	  
            	  // To set chats and view when contacts are fetch by infiniscroll
            	  setupTags(cel);
                  pieTags(cel);
            	  setupViews(cel);
            	  
            	  /* Show list of filters dropdown in contacts list, If filter is saved in cookie
            	  	 then show the filter name on dropdown button
            	  */
            	  setupContactFilterList(cel);            	  
            	  }             
          });

          // Contacts are fetched when the app loads in the initialize
          var cel = this.contactsListView.el;
          var collection = this.contactsListView.collection;
          this.contactsListView.collection.fetch();

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
        	{
        		// Set url to core/api/contacts (If filters are loaded contacts url is changed so set it back)
        		this.contactsListView.collection.url = "core/api/contacts";
        		contact = this.contactsListView.collection.get(id);
        	}
        
        // If contact is of type company just edit it.
        if(contact.get('type') == 'COMPANY'){
        	deserializeContact(contact.toJSON(), 'continue-company');
        	return;
        }

        this.contactDetailView = new Base_Model_View({
            model: contact,
            template: "contact-detail",
            postRenderCallback: function(el) {
            	
            	loadWidgets(el, contact.toJSON());
            	
                loadTimelineDetails(el, id);
                
                starify(el);
                
                showMap(el);
               }
        });
        
       
        var el = this.contactDetailView.el;
      
        $('#content').html(el);
       
    },
    editContact: function (contact) {
    	console.log("edit contact");
    	
    	// Takes back to contacts if contacts detailview is not defined
    	if (!this.contactDetailView || !this.contactDetailView.model.id) {
            this.navigate("contacts", {
                trigger: true
            });
            return;
        }
    	
    	// If contact detail view is defined the get current contact model id
    	var id = this.contactDetailView.model.id;

    	// If contact list is defined the get contact to edit from the list
    	if (this.contactsListView && this.contactsListView.collection && this.contactsListView.collection.get(id))
    	{
   		 	contact = this.contactsListView.collection.get(id).toJSON();
   		}
    	
    	// If contacts list view is not defined happens when in custom-view route or in filter 
    	// then get contact from contact custom view
    	else if(this.contact_custom_view && this.contact_custom_view.collection && this.contact_custom_view.collection.get(id))
    	{
    		contact = this.contact_custom_view.collection.get(id).toJSON();
    		console.log(contact);
    	}
    
    	// If contact list view and custom view list is not defined then download contact
   	 	else if(!contact)
   		 {
   		 	// Download contact for edit since list is not defined
   		 	var contact_details_model = Backbone.Model.extend({
   		 		url: function() {
   		 			return '/core/api/contacts/'+ id;
   		 		}
   		 	});
     	
   		 	var model = new contact_details_model();
   		 	
   		 	model.fetch({ success: function(contact) {
   		 		
   		 			// Call Contact edit again with downloaded contact details
   		 			App_Contacts.editContact(contact.toJSON());	
   		 		}
   		 	});
   		 	
   		 	return;
   		 }

   	 	// Contact Edit - take him to continue-contact form
    	addCustomFieldsToForm(contact, function(contact){
    		deserializeContact(contact, 'continue-contact');
    	});
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
				deserializeContact(data.toJSON(), 'continue-contact');
        	}
        });
    },
    continueContact: function () {
        $('#content').html(getTemplate('continue-contact', {}));
    },

    continueCompany: function () {
       // $('#content').html(getTemplate('continue-company', {}));
    	var model = serializeAndSaveContinueContact(undefined, 'companyForm', 'companyModal', true, false);
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
    	var id = this.contactDetailView.model.id;
    	this.opportunityView = new Base_Model_View({
            url: 'core/api/opportunity',
            template: "opportunity-add",
            isNew: true,
            window: 'contact/' + id,
            postRenderCallback: function(el){
            	populateUsers("owner", el);
            	populateMilestones(el);
            	var json = App_Contacts.contactDetailView.model.toJSON();
            	var contact_name = getPropertyValue(json.properties, "first_name")+ " " + getPropertyValue(json.properties, "last_name");
            	$('.tags',el).append('<li class="tag"  style="display: inline-block; vertical-align: middle; margin-right:3px;" data="'+ json.id +'">'+contact_name+'</li>');

            	// Enable the datepicker
                $('#close_date', el).datepicker({
                    format: 'mm-dd-yyyy'
                });
            }
        });

    	var view = this.opportunityView.render();
     	
        $('#content').html(view.el);
    },
    addContactToCampaign: function(){
    	$("#content").html(getTemplate("contact-detail-campaign", {}));
		
    	$('body').trigger('fill_campaigns_contact');
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
    		url: 'core/api/contact-view/',
    		model: contact_view_model,
    		template: "contact-view",
    		restKey: "contactView",
            window: 'contact-views',
            postRenderCallback: function(el) {
       			head.js(LIB_PATH + 'lib/jquery.multi-select.js', LIB_PATH + 'lib/jquery-ui.min.js', function(){
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
            template: "send-email",
            postRenderCallback: function(el) {

            	// Populate from address and templates
            	populateSendEmailDetails(el);
            }
        });
    	$("#content").html(sendEmailView.render().el);
    },
    contactfilters: function() {
    	this.contactFiltersList = new Base_Collection_View({
            url: '/core/api/filters',
            restKey: "ContactFilter",
            templateKey: "contact-filter",
            individual_tag_name: 'tr'
        });
    	
    	this.contactFiltersList.collection.fetch();
    	$("#content").html(this.contactFiltersList.render().el);
    },
    contactFilterAdd: function()
    {
    	var contacts_filter = new Base_Model_View({
    				url:'core/api/filters',
    	            template: "filter-contacts",
    	            window: "contact-filters",
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
    	if (!this.contactFiltersList || this.contactFiltersList.collection.length == 0 || this.contactFiltersList.collection.get(id) == null)
    	{
    		this.navigate("contact-filters", {
                trigger: true
            });
    	}
    	
    	var contact_filter = this.contactFiltersList.collection.get(id);
    	  var ContactFilter = new Base_Model_View({
    	        url: 'core/api/filters',
    	        model: contact_filter,
    	        template: "filter-contacts",
    	        window: 'contact-filters',
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
    	    
    	    	var ContactFilter = ContactFilter.render();
    	    	$("#content").html(ContactFilter.el); 
    	
    },
    ownerBulk: function(){

    	$("#content").html(getTemplate("bulk-actions-owner", {}));
		
    	$('body').trigger('fill_owners');
    },
    campaignsBulk: function(){
    
    	$("#content").html(getTemplate("bulk-actions-campaign", {}));
		
    	$('body').trigger('fill_campaigns');
    },
    tagsBulk: function(){
        
    	$("#content").html(getTemplate("bulk-actions-tags", {}));
    },
    emailBulk: function(){

    	$("#content").html(getTemplate("send-email", {}));
    	$('body').trigger('fill_emails');
    },
    
    // Id = custom-view-id, view_data = custom view data if already availabel, url = filter url if there is any filter
    customView : function(id, view_data, url) {
    	
    	// If id is defined get the respective custom view object 
    	if (id && !view_data) 
		{
			var view = new Backbone.Model();
			view.url = 'core/api/contact-view/' + id;
			view.fetch({
				success: function(data)
				{
					App_Contacts.contactViewModel = data.toJSON();
					
					App_Contacts.customView(undefined, App_Contacts.contactViewModel, url);

				}
			});
			return;
		}
    	
    	// If url is not defined set defult url to contacts
    	if(!url)
		{
			url = "core/api/contacts";
		}
    	
        this.contact_custom_view = new Base_Collection_View({
            url: url,
            restKey: "contact",
            modelData: view_data ,
            templateKey: "contacts-custom-view",
            individual_tag_name: 'tr',
            cursor: true,
            page_size: 25,
            postRenderCallback: function(el) {
          
            	// To set chats and view when contacts are fetch by infiniscroll
            	setupTags(el);
            	
                pieTags(el);
                setupViews(el, view_data.name);
                
          	  	// show list of filters dropdown in contacts list
          	  	setupContactFilterList(el);        
            }
        });
        
        // Defines appendItem for custom view 
        this.contact_custom_view.appendItem = contactTableView;
        
        // Fetch collection
        this.contact_custom_view.collection.fetch();
        $('#content').html(this.contact_custom_view.el);
    	
    }
});