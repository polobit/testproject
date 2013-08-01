/**
 * Reads the file and sends request to to URL given, using fileuploader.js.
 * Element is required to be specified, on clicking on the element file selector
 * window is opened, after selecting the file to be uploaded request is sent to
 * the URL specified as action attribute. This function using file uploader
 * sends request to "core/api/contacts/upload" which processes the request and
 * returns data as a map, is shown in a template using handlebars.
 */
function fileUploadInit()
{
	var uploader = new qq.FileUploader({ element : document.getElementById('file-upload-div'), action : '/core/api/contacts/upload', debug : true,
		allowedExtensions : [
			"csv"
		], onComplete : function(id, fileName, data)
		{

			// import-contacts template is populated with the processed data
			$('#content').html(getTemplate("import-contacts-2", data));

			// Sets up typeahead for tags
			setup_tags_typeahead();
		} });

}

/**
 * Defines actions on events on imports contacts element, which does validation
 * on the import template, whether contact have first_name last_name which are
 * mandatory fields. If first naRme and last name are not specified or specified
 * same label for different fields then error message is shown and will not send
 * request to save.
 */
$(function()
{

	/*
	 * On clicking on import contacts it checks whether all mandatory field are
	 * set and ensure no duplicate field names are set. If all the validation
	 * checks are passed, the request the backend to save the contacts
	 */
	$('#import-contacts')
			.die()
			.live(
					'click',
					function(e)
					{
						e.preventDefault();

						var upload_valudation_errors = {
							"first_name_missing" : { "error_message" : "First Name is mandatory. Please select first name." },
							"last_name_missing" : { "error_message" : "Last Name is mandatory. Please select lname." },
							"first_name_duplicate" : { "error_message" : " You have assigned First Name to more than one element. Please ensure that first name is assigned to only one element. " },
							"last_name_duplicate" : { "error_message" : "You have assigned Last Name to more than one element. Please ensure that last name is assigned to only one element." },
							"company_duplicate" : { "error_message" : "You have assigned Company to more than one element. Please ensure that last name is assigned to only one element." },
							"job_title_duplicate" : { "error_message" : "You have assigned job description to more than one element. Please ensure that last name is assigned to only one element." } }

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
						var firstNameCount = $(".import-select").filter(function()
						{
							return $(this).val() == "properties_first_name";
						});

						var lastNameCount = $(".import-select").filter(function()
						{
							return $(this).val() == "properties_last_name";
						});

						var company = $(".import-select").filter(function()
						{
							return $(this).val() == "properties_company";
						});

						var job_title = $(".import-select").filter(function()
						{
							return $(this).val() == "properties_title";
						});

						if (firstNameCount.length == 0)
						{
							$("#import-validation-error").html(getTemplate("import-contacts-validation-message", upload_valudation_errors.first_name_missing));
							return false;
						}
						else if (lastNameCount.length == 0)
						{
							$("#import-validation-error").html(getTemplate("import-contacts-validation-message", upload_valudation_errors.last_name_missing));
							return false;
						}
						else if (firstNameCount.length > 1)
						{
							$("#import-validation-error")
									.html(getTemplate("import-contacts-validation-message", upload_valudation_errors.first_name_duplicate));
							return false;
						}
						else if (lastNameCount.length > 1)
						{
							$("#import-validation-error").html(getTemplate("import-contacts-validation-message", upload_valudation_errors.last_name_duplicate));
							return false;
						}
						else if (company.length > 1)
						{
							$("#import-validation-error").html(getTemplate("import-contacts-validation-message", upload_valudation_errors.company_duplicate));
							return false;
						}
						else if (job_title.length > 1)
						{
							$("#import-validation-error").html(getTemplate("import-contacts-validation-message", upload_valudation_errors.job_title_duplicate));
							return false;
						}

						/*
						 * After validation checks are passed then loading is
						 * shown
						 */
						$waiting = $('<div style="display:inline-block;padding-left:5px"><small><p class="text-success"><i><span id="status-message">Please wait</span></i></p></small></div>');
						$waiting.insertAfter($('#import-contacts'));

						/*
						 * Iterates through all tbody tr's and reads the table
						 * heading from the table, push the table name as
						 * property name and value as property value as
						 * ContactField properties.
						 */
						$('#import-tbody tr').each(function()
						{
							var model = {};
							var properties = [];

							$(this).find("td").each(function(i)
							{

								// Empty property map (Represents ContactField
								// in contact.java)
								var property = {};
								var property_address = {};

								// Read the name of the property from table
								// heading
								var name = $(this).parents('table').find('th').eq(i).find('select').val();

								if (name.indexOf("properties_address_") != -1)
								{
									name = name.split("properties_address_")[1];
								}

								if (name.indexOf("properties_") != -1)
								{
									name = name.split("properties_")[1];
									console.log(name);
									// Reads the sub type of the fields
									if (name.indexOf("-") != -1)
									{
										var splits = name.split("-");
										name = splits[1];
										var type = splits[0];
										property["subtype"] = type;
									}

									var value = $(this).html();
									// console.log("Column value is " + value);

									// Set the value and name fields
									property["value"] = value;
									property["name"] = name;

									// Push in to properties array (represents
									// ContactField array)
									properties.push(property);

								}

								else
								{
									if (name.indexOf("tags") != -1)
									{
										var tags = [];
										tags.push($(this).html());

										if (isArray(model.tags))
										{
											$.each(tags, function(index, value)
											{
												model.tags.push(value);
											});
										}
										else
										{
											model.tags = tags;
										}

									}
									else
									{
										model[name] = $(this).html();
									}
								}

							});

							model.properties = properties;
							model.type = "PERSON";
							model.first_name = "uploaded";
							model.last_name = "uploaded";

							console.log(model);

							// Add Tags
							var tags = get_tags('import-contact-tags');
							if (tags != undefined)
							{
								$.each(tags[0].value, function(index, value)
								{
									if (!model.tags)
										model.tags = [];

									model.tags.push(value);
								});
							}

							// Pushes model (represents contact) in to an array
							// of models
							models.push(model);

						});

						if (models.length > 1000)
						{
							$waiting.find('#status-message').html('Sorry, Cannot upload more than 1000 contacts');
							return;
						}

						// Shows Updating
						$waiting.find('#status-message').html('Uploading to server');

						var contact = models;
						// contact.contact = models;

						console.log(contact);

						// List of contacts built out of csv, post request is
						// sent to
						// 'core/api/contacts/multi/upload' with list of
						// contacts
						$.ajax({ type : 'POST', url : '/core/api/contacts/multi/upload', data : JSON.stringify(contact),
							contentType : "application/json; charset=utf-8", success : function(data)
							{

								// After saving the contacts, loading is removed
								$waiting.find('#status-message').html('Uploaded successfully');

								// Navigates back to contacts
								Backbone.history.navigate('contacts', { trigger : true });

								// console.log(data);
								// App_Contacts.contactsListView.collection.add(data.contact);
							}, error : function(response)
							{
								console.log(response.responseText);
							}, dataType : 'json' });

					});

	// Cancels import, removes the contacts uploaded in to table, still calls
	// fileUploadInit,
	// so user can upload again if required
	$('#import-cancel').die().live('click', function(e)
	{

		// Sends empty JSON to remove contact uploaded
		$('#content').html(getTemplate("import-contacts", {}));
		head.js(LIB_PATH + 'lib/fileuploader-min.js', function()
		{
			fileUploadInit();
		});
	});

	$('#google-import').die().live('click', function(e)
	{

		// URL to return, after fetching token and secret key from LinkedIn
		var callbackURL = window.location.href;
		console.log(callbackURL);

		// For every request of import, it will ask to grant access
		window.location = "/scribe?service=google&return_url=" + encodeURIComponent(callbackURL);

		// this code is used, if once permission is granted, we refresh the
		// tokens and import without asking for permission again and again
		
		// $.getJSON("/core/api/contactprefs/google", function(data)
		// {
		//		
		// console.log(data);
		// if (!data)
		// {
		// $("#google-delete-import").hide();
		// window.location = "/scribe?service=google&return_url=" +
		// encodeURIComponent(callbackURL);
		// return;
		// }
		//					
		// var url = '/scribe?service_type=google';
		// $("#google-delete-import").show();
		//		
		// $.post(url, function(data)
		// {
		// console.log("in success");
		// }).error(function(data)
		// {
		// console.log(data.responseText);
		// });
		//		
		// }).error(function(data)
		// {
		//					
		// });

	});

});
