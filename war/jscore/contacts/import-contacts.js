BLOB_KEY = undefined;
$(function() {
	
	// Cancels import, removes the contacts uploaded in to
	// table, still calls
	// fileUploadInit,
	// so user can upload again if required
	$('#import-cancel').die()
			.live(
					'click',
					function(e) {

						// Sends empty JSON to remove
						// contact uploaded
						$('#content').html(
								getTemplate(
										"import-contacts",
										{}));
					});
	
	$("#upload_contacts").die().live(
			'click',
			function(e) {
				e.preventDefault();
				var newwindow = window.open(
						"upload-contacts.jsp?id=upload_contacts", 'name',
						'height=310,width=500');
				if (window.focus) {
					newwindow.focus();
				}
				return false;
			})

	$('#import-contacts')
			.die()
			.live(
					'click',
					function(e) {
						var upload_valudation_errors = {
							"first_name_missing" : {
								"error_message" : "First Name is mandatory. Please select first name."
							},
							"last_name_missing" : {
								"error_message" : "Last Name is mandatory. Please select lname."
							},
							"first_name_duplicate" : {
								"error_message" : " You have assigned First Name to more than one element. Please ensure that first name is assigned to only one element. "
							},
							"last_name_duplicate" : {
								"error_message" : "You have assigned Last Name to more than one element. Please ensure that last name is assigned to only one element."
							},
							"company_duplicate" : {
								"error_message" : "You have assigned Company to more than one element. Please ensure that last name is assigned to only one element."
							},
							"job_title_duplicate" : {
								"error_message" : "You have assigned job description to more than one element. Please ensure that last name is assigned to only one element."
							}
						}

						var models = [];

						// Hide the alerts
						$(".import_contact_error").hide();

						// Headings validation Rammohan: 10-09-12
						/*
						 * Reads all the table heading set after importing
						 * contacts list from CSV and ensures that first_name
						 * and last_name fields are set, which are mandatory
						 * fields. Checks if duplicate table headings are set.
						 * If validations failed the error alerts a explaining
						 * the cause are shown
						 */
						var firstNameCount = $(".import-select")
								.filter(
										function() {
											return $(this).val() == "properties_first_name";
										});

						var lastNameCount = $(".import-select")
								.filter(
										function() {
											return $(this).val() == "properties_last_name";
										});

						var company = $(".import-select").filter(function() {
							return $(this).val() == "properties_company";
						});

						var job_title = $(".import-select").filter(function() {
							return $(this).val() == "properties_title";
						});

						if (firstNameCount.length == 0) {
							$("#import-validation-error")
									.html(
											getTemplate(
													"import-contacts-validation-message",
													upload_valudation_errors.first_name_missing));
							return false;
						}
						/*
						 * else if(lastNameCount.length == 0) {
						 * $("#import-validation-error").html(getTemplate("import-contacts-validation-message",
						 * upload_valudation_errors.last_name_missing)); return
						 * false; }
						 */
						else if (firstNameCount.length > 1) {
							$("#import-validation-error")
									.html(
											getTemplate(
													"import-contacts-validation-message",
													upload_valudation_errors.first_name_duplicate));
							return false;
						} else if (lastNameCount.length > 1) {
							$("#import-validation-error")
									.html(
											getTemplate(
													"import-contacts-validation-message",
													upload_valudation_errors.last_name_duplicate));
							return false;
						} else if (company.length > 1) {
							$("#import-validation-error")
									.html(
											getTemplate(
													"import-contacts-validation-message",
													upload_valudation_errors.company_duplicate));
							return false;
						} else if (job_title.length > 1) {
							$("#import-validation-error")
									.html(
											getTemplate(
													"import-contacts-validation-message",
													upload_valudation_errors.job_title_duplicate));
							return false;
						}

						/*
						 * After validation checks are passed then loading is
						 * shown
						 */
						$waiting = $('<div style="display:inline-block;padding-left:5px"><small><p class="text-success"><i><span id="status-message">Please wait</span></i></p></small></div>');
						$waiting.insertAfter($('#import-contacts'));

						var properties = [];

						/*
						 * Iterates through all tbody tr's and reads the table
						 * heading from the table, push the table name as
						 * property name and value as property value as
						 * ContactField properties.
						 */
						var model = {};
						
						// Add Tags
						var tags = get_tags('import-contact-tags');
						console.log(tags)
						if (tags != undefined) {
							$.each(tags[0].value, function(index, value) {
								if (!model.tags)
									model.tags = [];
								
								console.log(model);
								
								model.tags.push(value);
							});
						}
						
						$('#import-header tr th').each(
								function(index, element) {

									console.log(this);
									console.log(index);
									// Empty property map (Represents
									// ContactField in contact.java)

									var property = {};

									// Read the name of the property from
									// table heading
									var select = $(this).find('select');
									console.log(select);
									var name = $(select).val();
									console.log($(select).find(":selected").length);
									console.log($(select).find(":selected"));
									console.log($(select).find(":selected").attr('class'));
									console.log($(select).find(":selected").html());
									var type = $(select).find(":selected").attr('class') == 'CUSTOM' ? 'CUSTOM': 'SYSTEM';
									
									if (name.indexOf("properties_") != -1) {
										name = name.split("properties_")[1];									
										// Reads the sub type of the fields
										if (name.indexOf("-") != -1) {
											var splits = name.split("-");
											name = splits[1];
											var subType = splits[0];
											property["subtype"] = subType;
											console.log($(select).attr('class'));
											property["type"] = type;
										}
										
										// Set the value and name fields
										property["value"] = name;
										property["name"] = name;
										if(name.indexOf("_ignore_") != -1)
											property = {};	
									} else
									{
										if(name == 'tags')
										property["name"] = name;
									}

									// Push in to properties array (represents
									// ContactField array)
									properties.push(property);

								});

						model.properties = properties;
						model.type = "PERSON";

				
						// Shows Updating
						$waiting.find('#status-message').html(LOADING_HTML);

						

						// Represents prototype of contact, which specifies the
						// order of properties
						var contact = model;

						console.log(contact);	

						// Sends request to save the contacts uploaded from csv,
						// present in the blobstore. Contact is sent to save
						// each row in csv file in to a contact
						$.ajax({
							type : 'POST',
							url : "/core/api/upload/save?key=" + BLOB_KEY,
							data : JSON.stringify(contact),
							contentType : "application/json",
							success : function(data) {
								
								$waiting.find('#status-message').html('Contacts import task scheduled ').show().delay(3000).hide(1, function(){
									// Navigate to contacts page
									Backbone.history.navigate("contacts", {
							            trigger: true
							        });
								});
	
								// Calls vefiryUploadStatus with data returned
								// from the url i.e., key of the memcache
								// verifyUploadStatus(data);
							},
						});

		

					})
});

/**
 * Receives blobkey from the CSV upload popup after storing in blobstore, and
 * request is set to process the CSV and return first 10 contacts where user can
 * set the fields
 * 
 * @param key
 */
function parseCSV(key) {
	
	BLOB_KEY = key;
	$("#upload_contacts").after(LOADING_HTML);
	$.getJSON('core/api/upload/process?blob-key=' + key, function(data) {
		console.log(data);
		constructCustomfieldOptions(function(fields, el) {
			
			/*
			 * $('#custom_fields', template).each(function(index, element) {
			 * $(element).html(el); });
			 */
			data["custom_fields"] = fields.toJSON();
			console.log(data);
			var template = $(getTemplate("import-contacts-2", data));
			
			$('#content').html(template);
			setup_tags_typeahead();
		})

	})
}

/**
 * Loads custom fields available and creates options
 * 
 * @param callback
 */
function constructCustomfieldOptions(callback) {

	var custom_fields = Backbone.Collection.extend({
		url : 'core/api/custom-fields'
	});

	new custom_fields().fetch({
		success : function(data) {
			var el = "";
			$.each(data.toJSON(), function(index, field) {
				el = el + '<option value ="' + field.field_label + '" id="'
						+ field.field_type + '">' + field.field_label
						+ '</option>'
			})
			if (callback && typeof (callback) === "function")
				callback(data, el);
		}
	});

}