var TaskDetailsRouter = Backbone.Router.extend({ routes : {
'task/id':'taskDetails'
},


taskDetails:function(){
				document.write("hello");
				
/*				
				contactDetails : function(id, contact)
				{

					var contact_collection;

					if (!contact && this.contactDetailView && this.contactDetailView.model != null)
					{
						//contact_collection = this.contactDetailView;

						if (id == this.contactDetailView.model.toJSON()['id'])
						{
							App_Contacts.contactDetails(id, this.contactDetailView.model);
							return;
						}
					}

					// If user refreshes the contacts detail view page directly - we
					// should load from the model
					if (!contact)
						if (!this.contactsListView || this.contactsListView.collection.length == 0 || this.contactsListView.collection.get(id) == null)
						{

							console.log("Downloading contact");

							// Download
							var contact_details_model = Backbone.Model.extend({ url : function()
							{
								return '/core/api/contacts/' + this.id;
							} });

							var model = new contact_details_model();
							model.id = id;
							model.fetch({ success : function(data)
							{
								
								// Call Contact Details again
								App_Contacts.contactDetails(id, model);

							}, 
							error: function(data, response)
							{
								if(response && response.status == '403')
									$("#content").html(response.responseText);
							}
							});

							return;
						}

					// If not downloaded fresh during refresh - read from collection
					if (!contact)
					{
						// Set url to core/api/contacts (If filters are loaded
						// contacts url is changed so set it back)

						this.contactsListView.collection.url = "core/api/contacts";
						contact = this.contactsListView.collection.get(id);
						//contact_collection = this.contactsListView.collection;
					}
					
					// Assigning contact collection
					if(this.contactsListView && this.contactsListView.collection)
						contact_collection = this.contactsListView.collection;

					add_recent_view(contact);

					// If contact is of type company , go to company details page
					if (contact.get('type') == 'COMPANY')
					{
						this.contactDetailView = new Base_Model_View({ model : contact, isNew : true, template : "company-detail",
							postRenderCallback : function(el)
							{
								fill_company_related_contacts(id, 'company-contacts');
								// Clone contact model, to avoid render and
								// post-render fell in to
								// loop while changing attributes of contact
								var recentViewedTime = new Backbone.Model();
								recentViewedTime.url = "core/api/contacts/viewed-at/" + contact.get('id');
								recentViewedTime.save();

								if (App_Contacts.contactsListView && App_Contacts.contactsListView.collection && App_Contacts.contactsListView.collection.get(id))
									App_Contacts.contactsListView.collection.get(id).attributes = contact.attributes;

								starify(el);
								show_map(el);
								//fill_owners(el, contact.toJSON());
								// loadWidgets(el, contact.toJSON());
							} });

						var el = this.contactDetailView.render(true).el;
						$('#content').html(el);
						fill_company_related_contacts(id, 'company-contacts');
						return;
					}

					this.contactDetailView = new Base_Model_View({ model : contact, isNew : true, template : "contact-detail", postRenderCallback : function(el)
					{

						
						// Clone contact model, to avoid render and post-render fell
						// in to
						// loop while changing attributes of contact
						if(canEditCurrentContact())
						{
							var recentViewedTime = new Backbone.Model();
							recentViewedTime.url = "core/api/contacts/viewed-at/" + contact.get('id');
							recentViewedTime.save();
						}

						if (App_Contacts.contactsListView && App_Contacts.contactsListView.collection && App_Contacts.contactsListView.collection.get(id))
							App_Contacts.contactsListView.collection.get(id).attributes = contact.attributes;


						load_contact_tab(el, contact.toJSON());

						loadWidgets(el, contact.toJSON());
						
						
						 * // To get QR code and download Vcard
						 * $.get('/core/api/VCard/' + contact.toJSON().id,
						 * function(data){ console.log("Vcard string");
						 * console.log(data); var url =
						 * 'https://chart.googleapis.com/chart?cht=qr&chs=180x180&chld=0&choe=UTF-8&chl=' +
						 * encodeURIComponent(data); $("#qrcode", el).html('<img
						 * src="' + url + '" id="qr_code" alt="QR Code"/>');
						 * //$("#qrcode", el).html('<img
						 * style="display:inline-block!important;" src="' + url + '"
						 * id="qr_code" alt="QR Code" data="' + data + '"
						 * onload="qr_load();"/>'); $("#qrcode", el).prepend('<span
						 * style="padding: 8% 0%;margin-right: 2px;float:right;"
						 * id="downloadify"></span>'); });
						 

						starify(el);

						show_map(el);

						// To navigate between contacts details
						if (contact_collection != null)
							contact_detail_view_navigation(id, contact_collection, el);

						//fill_owners(el, contact.toJSON());
						start_tour("contact-details", el);
						
						// For sip
						if (Sip_Stack != undefined && Sip_Register_Session != undefined && Sip_Start == true)
						{
							$(".contact-make-sip-call").show();
							$(".contact-make-twilio-call").hide();
							$(".contact-make-call").hide();
						}
						else if(Twilio_Start == true)
						//else if (Twilio.Device.status() == "ready" || Twilio.Device.status() == "busy")			
						{
							$(".contact-make-sip-call").hide();
							$(".contact-make-twilio-call").show();
							$(".contact-make-call").hide();
						}	
						} });

					var el = this.contactDetailView.render(true).el;

					$('#content').html(el);
					
					// Check updates in the contact.
					checkContactUpdated();
					
					// For sip
					if (Sip_Stack != undefined && Sip_Register_Session != undefined && Sip_Start == true)
					{
						$(".contact-make-sip-call").show();
						$(".contact-make-twilio-call").hide();
						$(".contact-make-call").hide();
					}
					//else if (Twilio.Device.status() == "ready" || Twilio.Device.status() == "busy")
					else if(Twilio_Start == true)
					{
						$(".contact-make-sip-call").hide();
						$(".contact-make-twilio-call").show();
						$(".contact-make-call").hide();
					}
				},*/
}




});
