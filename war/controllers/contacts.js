/**
 * Creates backbone router for contacts management and filter
 * (custom view) operations.
 * 
 * @module Contact management & filters
 */
var ContactsRouter = Backbone.Router.extend({

    routes: {
        "": "contacts",
        "dashboard": "contacts",

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
        "continue-company": "continueCompany",
        
        /* Contact bulk actions */
        "bulk-campaigns": "campaignsBulk",
        "bulk-tags": "tagsBulk",
        "bulk-email": "emailBulk",
        "bulk-owner": "ownerBulk",
        
        /* Return back from Scribe after oauth authorization */
        "gmail": "email",
        "twitter": "socialPrefs",
        "linkedin": "socialPrefs",
        	
        /*Search results*/
        "contacts/search/:query": "searchResults"
    },
    initialize: function () {

    /*	$(".active").removeClass("active");
        
      	 $("#content").html(getTemplate('dashboard-timline', {}));
      	 setupDashboardTimeline();
      	    */
      },

      dashboard: function () {
    	  
   	  $(".active").removeClass("active");
                  

      	var el = getTemplate('dashboard', {});
      	$("#content").html(el)
      	setupDashboard(el);
      },
    /**
     * Fetches all the contacts (persons) and shows as list, if tag_id and 
     * filter_id are not defined, if any one of them is defined then fetches 
     * the contacts related to that particular id (tag_id or filter_id) and
     * shows as list. 
     * Adds tags, charts for tags and filter views to the contacts list from
     * postRenderCallback of its Base_Collection_View.
     * Initiates infiniScroll to fetch contacts (25 in count) step by step on 
     * scrolling down instead of fetching all at once. 
     */
    contacts: function (tag_id, filter_id, grid_view) {
    	var max_contacts_count = 20;
    	var template_key = "contacts";
    	var individual_tag_name = "tr";
    	if(grid_view || readCookie("agile_contact_view")){
    		template_key = "contacts-grid";
        	individual_tag_name = "div";
    	}
    	// Default url for contacts route
    	var url = '/core/api/contacts';
    	var collection_is_reverse = true;
    	// Tags, Search & default browse comes to the same function
    	if(tag_id)
    	{
    		url = '/core/api/tags/' + tag_id;
    	}
    	
    	if(readCookie('company_filter'))
    		url = "core/api/contacts/companies";
    	
    	// If contact-filter cookie is defined set url to fetch respective filter results
    	if(filter_id || (filter_id = readCookie('contact_filter')))
    	{
    		collection_is_reverse = false;
    		url = "core/api/filters/query/" + filter_id;
    	}
    	 
        // If view is set to custom view, load the custom view
      	if(readCookie("contact_view"))
		{      		
      		// If there is a filter saved in cookie then show filter results in custom view saved
      		if(readCookie('contact_filter'))
      		{	
      			// Then call customview function with filter url
      			this.customView(readCookie("contact_view"), undefined, "core/api/filters/query/" + readCookie('contact_filter'));
      			return;
      		}
      		
      		if(readCookie('company_filter'))
      		{
      			this.customView(readCookie("contact_view"), undefined, "core/api/contacts/companies")
      			return;
      		}
      		
      		// Else call customView function fetches results from default url : "core/api/contacts"
			this.customView(readCookie("contact_view"), undefined);
			return;
		}
      	
    	//console.log("Fetching from " + url);

      	console.log("while creating new base collection view : " + collection_is_reverse);
      	
      	/*
      	 * cursor and page_size options are taken to activate infiniScroll
      	 */
        this.contactsListView = new Base_Collection_View({
              url: url,
              templateKey: template_key,
              individual_tag_name: individual_tag_name,
              cursor: true,
              page_size: 25,
              sort_collection : collection_is_reverse,
              postRenderCallback: function(el) {
            	  
            	  // To set chats and view when contacts are fetch by infiniscroll
            	  setup_tags(cel);
                  pieTags(cel);
            	  setupViews(cel);
            	  
            	  /* Show list of filters dropdown in contacts list, If filter is saved in cookie
            	   * then show the filter name on dropdown button
            	   */
            	  setupContactFilterList(cel);            	  
              }             
          });

          // Contacts are fetched when the app loads in the initialize
          var cel = this.contactsListView.el;
          var collection = this.contactsListView.collection;
          this.contactsListView.collection.fetch({success: function(data){
        	  console.log(JSON.stringify(data.toJSON()));
          }});

          $('#content').html(this.contactsListView.render().el);
          
          $(".active").removeClass("active");
          $("#contactsmenu").addClass("active");    
         
    },
    
    /**
     * Fetches contacts based on filter_id
     */
    showFilterContacts: function(filter_id)
    {
    	if(App_Contacts)
    		App_Contacts.contacts(undefined, filter_id);
    },
    
    /**
     * Shows a contact in its detail view by taking the contact from contacts list view,
     * if list view is defined and contains the contact, otherwise downloads the 
     * contact from server side based on its id.
     * Loads timeline, widgets, map and stars (to rate) from postRenderCallback
     * of its Base_Model_View.  
     * 
     */
    contactDetails: function (id, contact) {

    	// If hte user refreshes the contacts detail view page directly - we should load from the model
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
        	deserialize_contact(contact.toJSON(), 'continue-company');
        	return;
        }

        this.contactDetailView = new Base_Model_View({
            model: contact,
            isNew: true,
            template: "contact-detail",
            postRenderCallback: function(el) {
            	
            	loadWidgets(el, contact.toJSON());
            	
                load_timeline_details(el, id);
                
                starify(el);
                
                show_map(el);
                
                fill_owners(el, contact.toJSON());
               }
        });
        
       
        var el = this.contactDetailView.render().el;
      
        $('#content').html(el);
       
    },
    
    /**
     * Takes the contact to continue contact form to edit it. If attempts to edit
     * a contact without defining contact detail view, navigates to contacts page.
     * Gets the contact to edit, from its list view or its custom view, if not found
     * in both downloads from server side (Contact database).   
     */
    editContact: function (contact) {
    	
    	// Takes back to contacts if contacts detailview is not defined
    	if (!this.contactDetailView || !this.contactDetailView.model.id) {
            this.navigate("contacts", {
                trigger: true
            });
            return;
        }
    	
    	
    	
    	// If contact detail view is defined the get current contact model id
    	var id = this.contactDetailView.model.id;
    	
    	if(this.contactDetailView && this.contactDetailView.model.id)
    	{
    		contact = this.contactDetailView.model.toJSON();
    	}
    	// If contact list is defined the get contact to edit from the list
    	else if (this.contactsListView && this.contactsListView.collection && this.contactsListView.collection.get(id))
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
    	add_custom_fields_to_form(contact, function(contact){
    		deserialize_contact(contact, 'continue-contact');
    	});
    },
    
    /**
     * Creates a duplicate contact to the existing one. Deletes the email (as well as 
     * it has to be unique) and id (to create new one) of the existing contact and
     * saves it. Also takes the duplicate contact to continue contact form to edit it. 
     */
    duplicateContact: function () {
    	
      	 // Takes back to contacts if contacts detail view is not defined
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
        		add_custom_fields_to_form(data.toJSON(), function(contact){
                	
                    	deserialize_contact(contact, 'continue-contact');
                    	
                	});
        	}
        });
    },

    /**
     * Navigates the contact (of type company) to continue company form
     */
    continueCompany: function () {
    	
    	var model = serialize_and_save_continue_contact(undefined, 'companyForm', 'companyModal', true, false, '#continue-company');
    },
    
    /**
     * Imports contacts from a csv file and then uploads all the contacts
     * to database
     */
    importContacts: function () {
        $('#content').html(getTemplate("import-contacts", {}));
        head.js('lib/fileuploader-min.js', function(){
        	fileUploadInit();
        });
    },
   
    /**
     * Adds social widgets (twitter, linkedIn and RapLeaf) to a contact
     */
    addWidget: function () {

        pickWidget();

    },
    
    /**
     * Adds an opportunity to a contact, which is in contact detail view.
     * Populates users and milestones from postRenderCallback of its
     * Base_Model_View.   
     */
    addOpportunityToContact: function() {
    	var id = this.contactDetailView.model.id;
    	this.opportunityView = new Base_Model_View({
            url: 'core/api/opportunity',
            template: "opportunity-add",
            isNew: true,
            window: 'contact/' + id,
            postRenderCallback: function(el){
            	populateUsers("owners-list", el);
            	populateMilestones(el);
            	var json = App_Contacts.contactDetailView.model.toJSON();
            	var contact_name = getPropertyValue(json.properties, "first_name")+ " " + getPropertyValue(json.properties, "last_name");
            	$('.tags',el).append('<li class="tag"  style="display: inline-block; vertical-align: middle; margin-right:3px;" data="'+ json.id +'">'+contact_name+'</li>');

            	// Enables the date-picker
                $('#close_date', el).datepicker({
                    format: 'mm/dd/yyyy'
                });
            }
        });

    	var view = this.opportunityView.render();
     	
        $('#content').html(view.el);
    },
    
    /**
     * Subscribes a contact to a campaign. Loads the related template and
     * triggers the custom event "fill_campaigns_contact" to show the 
     * campaigns drop down list.
     */
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
    			
    			head.js(LIB_PATH + 'lib/jquery.multi-select.js',LIB_PATH + 'lib/jquery-ui.min.js', function(){
    			
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
    		return;
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
       					
       		
       					$("#content").html(el);
       					
       					$('#multipleSelect').multiSelect();
       					
       				    $('.ms-selection', el).children('ul').addClass('multiSelect').attr("name", "fields_set").attr("id","fields_set").sortable();
       					       					
       					$.each(contact_view_model.toJSON()['fields_set'], function(index, field){
       						$('#multipleSelect').multiSelect('select', field); 
       					});
       					
       				});
       			}

    	});
    	
    	contactView.render();
    	
    },
    
    /**
     * Shows a send email form with some prefilled values (email - from, to 
     * and templates etc..). To prefill the fields the function 
     * populate_send_email_details is called from the postRenderCallback.
     */
    sendEmail: function(){
    	
    	// Show the email form with the email prefilled from the curtrent contact
    	var model =  this.contactDetailView.model;
    	var sendEmailView = new Base_Model_View({
            model: model,
            template: "send-email",
            postRenderCallback: function(el) {

            	// Populate from address and templates
            	populate_send_email_details(el);
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
    	            isNew:"true",
    	            window: "contact-filters",
    	            postRenderCallback: function(el) {
       					
    	            	head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
    	           		    	{	
    	            				chainFilters(el);	            			    
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
    		return;
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
	            				chainFilters(el); 
	            				deserializeChainedSelect($(el).find('form'), contact_filter.toJSON().rules);
	           		    	})
	               }
    	    	});
    	    
    	    	var ContactFilter = ContactFilter.render();
    	    	$("#content").html(ContactFilter.el); 
    	
    },
    
    /**
     * Loads the owners template to subscribe the selected contacts to a campaign 
     * and triggers the custom event 'fill_owners' to fill the owners select drop down. This event is 
     */
    ownerBulk: function(){

    	$("#content").html(getTemplate("bulk-actions-owner", {}));
		
    	$('body').trigger('fill_owners');
    },
    
    /**
     * Loads the campaign template to subscribe the selected contacts to a campaign 
     * and triggers an event, which fills the campaigns select drop down. This event is 
     * binded to trigger on loading of the template
     */
    campaignsBulk: function(){
    
    	$("#content").html(getTemplate("bulk-actions-campaign", {}));
		
    	$('body').trigger('fill_campaigns');
    },
    
    /**
     * Loads the tags template to add tags to the selected contacts
     */
    tagsBulk: function(){
        
    	$("#content").html(getTemplate("bulk-actions-tags", {}));
    },
    
    /**
     * Loads the email template to send email to the selected contacts and triggers an event, 
     * which fills send email details. This event is binded to trigger 
     * on loading of the template
     */
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
					// If custom view object is empty i.e., custom view is deleted. 
					// custom view cookie is eraised and default view is shown
					if($.isEmptyObject(data.toJSON()))
						{
							// Erase custom_view cookie, since 
							// view object with given id is not available
							eraseCookie("contact_view");
							
							// Loads default contact view
							App_Contacts.contacts();
							return;
						}
						
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
            	setup_tags(el);
            	
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
    	
    },
    
    /*search results*/
    searchResults: function(query)
    {
    	var searchResultsView = new Base_Collection_View({
            url: "core/api/search/" + query,
            templateKey: "search",
            individual_tag_name: 'tr',
            cursor: true,
            data : QUERY_RESULTS,
            sort_collection : false,
            page_size: 15,
            postRenderCallback: function(el)
            {
            	// Shows the query string as heading of search results
            	$("#search-query-heading", el).html('Search results for "' + query + '"');
            }
      	});

     // If QUERY_RESULTS is defined which are set by agile_typeahead istead of fetching again
 /*     if(QUERY_RESULTS)
      {
    	  //Create collection with results
    	  searchResultsView.collection =  new BaseCollection(QUERY_RESULTS, {
				restKey : searchResultsView.options.restKey,
				sortKey : searchResultsView.options.sortKey
			});   	  

    	  $('#content').html(searchResultsView.render(true).el);
          $('body').trigger('agile_collection_loaded');
    	  return;
      }*/
      
      // If in case results in different page is clicked before typeahead fetch results, then results are fetched here
      searchResultsView.collection.fetch();
      
      $('#content').html(searchResultsView.render().el);

    }
});