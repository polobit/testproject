BLOB_KEY = undefined;
function initializeImportEvents(id){

if(!id)
	  id = "content";

$('#' + id  + " .upload").off('click');
$('#' + id).on('click', '.upload', function(e)
	{

		// get hidden value file type
		var type = $(this).parents('form').children("#type").val();

		e.preventDefault();
		var newwindow = window.open("upload-contacts.jsp?type=" + type + "", 'name', 'height=310,width=500');

		if (window.focus)
		{
			newwindow.focus();
		}
		return false;
	});


// Cancels import, removes the contacts uploaded in to
	// table, still calls
	// fileUploadInit,
	// so user can uploadimport-comp again if required
	$('#' + id  + " #import-cancel").off('click');
	$('#' + id).on('click', '#import-cancel', function(e){

		// Sends empty JSON to remove
		// contact uploaded
		var $firstDiv = $('#content').children().first();
		getTemplate('import-contacts', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$firstDiv.html($(template_ui));	
					initializeImportEvents($firstDiv.attr('id'));

				}, $firstDiv);
		
	});
	
	// cancel option for deals import
	$('#' + id  + " #deal-cancel").off('click');
	$('#' + id).on('click', '#deal-cancel', function(e){

				// Sends empty JSON to remove
				// contact uploaded
				var $firstDiv = $('#content').children().first();

				getTemplate('import-deals', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$firstDiv.html($(template_ui));	
					initializeImportEvents($firstDiv.attr('id'));

				}, $firstDiv);				
			});

$('#' + id  + " #import-contacts").off('click');
$('#' + id).on('change', '.import-select', function(e) {
    
    importContactsValidate();

});
$('#' + id).on('click', '#import-contacts', function(e)
					{

						if ($(this).attr('disabled'))
							return;
						if(!importContactsValidate())
						      return false;
						 else		
							$(this).attr('disabled', true);

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
						console.log(tags);
						var tags_valid = true;
						if (tags != undefined)
						{
							$.each(tags[0].value, function(index, value)
							{
								if(!isValidTag(value, false)) {
									tags_valid = false;
									return false;
								}
								if (!model.tags)
									model.tags = [];

								console.log(model);

								model.tags.push(value);
							});
						}
						if(!tags_valid) {
							getTemplate("import-contacts-validation-message", upload_valudation_errors.invalid_tag, undefined, function(template_ui){
								if(!template_ui)
									  return;
								$('#import-validation-error').html($(template_ui));	
							}, "#import-validation-error");

							return false;
						}
						
						$(this).attr('disabled', true);

						/*
						 * After validation checks are passed then loading is
						 * shown
						 */
						$waiting = $('<div style="display:inline-block;padding-left:5px"><small><p class="text-success"><i><span id="status-message">Please wait</span></i></p></small></div>');
						$waiting.insertAfter($('#import-cancel'));

						$('td.import-contact-fields').each(function(index, element)
						{

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
							var type = $(select).find(":selected").attr('class') == 'CUSTOM' ? 'CUSTOM' : 'SYSTEM';
							console.log("name :" + name + ", type" + type);

							if (name.indexOf("properties_") != -1)
							{
								name = name.split("properties_")[1];
								property["type"] = type;
								if (name.indexOf('address-') != -1)
								{
									var splits = name.split("-");
									name = "address";
									property["subtype"] = "home";
									property["type"] = type;
									console.log(splits);
									// Set the value and name fields
									property["value"] = splits[1];
								}

								// Reads the sub type of the fields
								else if (name.indexOf("-") != -1)
								{
									var splits = name.split("-");
									name = splits[1];
									var subType = splits[0];
									if(subType=="GOOGLE"){
										property["subtype"] = "GOOGLE-PLUS";
									}else{
									property["subtype"] = subType;
									console.log($(select).attr('class'));
									property["type"] = type;
									}
								}

								// Set the value and name fields
								if (!property["value"])
									property["value"] = name;

								property["name"] = name;
								console.log(property);
								if (name.indexOf("_ignore_") != -1)
									property = {};
							}
							else
							{
								property["name"] = name;
							}

							// Push in to properties array (represents
							// ContactField array)
							properties.push(property);

						});

						model.properties = properties;
						model.type = "PERSON";

						// Shows Updating
						/*$waiting.find('#status-message').html(getRandomLoadingImg());*/

						// Represents prototype of contact, which specifies the
						// order of properties
						var contact = model;

						console.log(contact);

						// Sends request to save the contacts uploaded from csv,
						// present in the blobstore. Contact is sent to save
						// each row in csv file in to a contact
						$.ajax({ type : 'POST', url : "/core/api/contacts/import/"+ BLOB_KEY + "/CONTACTS", data : JSON.stringify(contact),
							contentType : "application/json", success : function(data)
							{
								// Navigate to contacts page
								// Sends empty JSON to remove
								// contact uploaded
								var $firstDiv = $('#content').first();

								getTemplate("import-contacts", {}, undefined, function(template_ui){
									if(!template_ui)
										  return;
									$firstDiv.html($(template_ui));

									initializeImportEvents($firstDiv.attr('id'));
									showNotyPopUp('information', "Contacts are now being imported. You will be notified on email when it is done", "top", 5000);
									addTagAgile(IMPORT_TAG);

								}, $firstDiv);

								
							}, });

					})


/**
 * validation for csv import companies
 */
$('#' + id  + " #import-comp").off('click');
$('#' + id).on('click', '#import-comp', function(e)
				{

					if ($(this).attr('disabled'))
						return;

					var upload_valudation_errors = { "company_name_missing" : { "error_message" : "Company Name is mandatory. Please select Company name." },
						"company_name_duplicated" : { "error_message" : "Company Name is Duplicated." }

					}
					var models = [];

					// Hide the alerts
					$(".import_contact_error").hide();

					// Headings validation jitendra: 28-08-14
					/*
					 * Reads all the table heading set after importing contacts
					 * list from CSV and ensures that company_name which are
					 * mandatory fields. Checks if duplicate table headings are
					 * set. If validations failed the error alerts a explaining
					 * the cause are shown
					 */
					company_count = 0;
					$(".import-select").each(function(index, element)
					{
						var value = $(element).val()
						if (value == "properties_name")
							company_count += 1;

					})

					if (company_count == 0)
					{
						getTemplate("import-company-validation-message", upload_valudation_errors.company_name_missing, undefined, function(template_ui){
								if(!template_ui)
									  return;
								$("#import-validation-error").html($(template_ui));
						}, "#import-validation-error");						
						return false;
					}

					else if (company_count > 1)
					{
						getTemplate("import-company-validation-message", upload_valudation_errors.company_name_duplicated, undefined, function(template_ui){
								if(!template_ui)
									  return;
								$("#import-validation-error").html($(template_ui));
						}, "#import-validation-error");	

						return false;
					}

					$(this).attr('disabled', true);

					/*
					 * After validation checks are passed then loading is shown
					 */
					$waiting = $('<div style="display:inline-block;padding-left:5px"><small><p class="text-success"><i><span id="status-message">Please wait</span></i></p></small></div>');
					$waiting.insertAfter($('#import-cancel'));

					var properties = [];

					/*
					 * Iterates through all tbody tr's and reads the table
					 * heading from the table, push the table name as property
					 * name and value as property value as ContactField
					 * properties.
					 */
					var model = {};

					// Add Tags

					$('td.import-contact-fields').each(function(index, element)
					{

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
						var type = $(select).find(":selected").attr('class') == 'CUSTOM' ? 'CUSTOM' : 'SYSTEM';
						console.log("name :" + name + ", type" + type);

						if (name.indexOf("properties_") != -1)
						{
							name = name.split("properties_")[1];
							property["type"] = type;
							if (name.indexOf('address-') != -1)
							{
								var splits = name.split("-");
								name = "address";
								property["subtype"] = "office";
								property["type"] = type;
								console.log(splits);
								// Set the value and name fields
								property["value"] = splits[1];
							}

							// Reads the sub type of the fields
							else if (name.indexOf("-") != -1)
							{
								var splits = name.split("-");
								
								name = splits[1];
								var subType = splits[0];
								if(subType=="GOOGLE"){
									property["subtype"] = "GOOGLE-PLUS";
								}else{
								property["subtype"] = subType;
								console.log($(select).attr('class'));
								property["type"] = type;
								}
							}

							// Set the value and name fields
							if (!property["value"])
								property["value"] = name;

							property["name"] = name;
							console.log(property);
							if (name.indexOf("_ignore_") != -1)
								property = {};
						}
						else
						{
							property["name"] = name;
						}

						// Push in to properties array (represents
						// ContactField array)
						properties.push(property);

					});

					model.properties = properties;
					model.type = "COMPANY";

					// Shows Updating
					/*$waiting.find('#status-message').html(getRandomLoadingImg());*/

					// Represents prototype of contact, which specifies the
					// order of properties
					var contact = model;

					console.log(contact);

					// Sends request to save the contacts uploaded from csv,
					// present in the blobstore. Contact is sent to save
					// each row in csv file in to a contact
					$.ajax({ type : 'POST', url : "/core/api/upload/save?type=Companies&key=" + BLOB_KEY, data : JSON.stringify(contact),
						contentType : "application/json", success : function(data)
						{
							// Navigate to contacts page
							// Sends empty JSON to remove
							// contact uploaded
							var $firstDiv = $('#content').first();

							getTemplate("import-contacts", {}, undefined, function(template_ui){
									if(!template_ui)
										  return;
									$firstDiv.html($(template_ui));
									initializeImportEvents($firstDiv.attr('id'));
									showNotyPopUp('information', "Companies are now being imported. You will be notified on email when it is done", "top", 5000);
							}, $firstDiv);	

						}, });

				});

/**
 * import deals validations
 */
$('#' + id  + " #import-deals").off('click');
$('#' + id).on('click', '#import-deals', function(e)
				{

					if ($(this).attr('disabled'))
						return;

					var upload_valudation_errors = {
							"deal_name_missing" : { "error_message" : "Deal Name is mandatory. Please select deal name." },
							"deal_duplicated" : { "error_message" : "Deal Name field is duplicated" },
							"deal_value_duplicated" : { "error_message" : "Deal value field is duplicated" },
							"deal_track_duplicated" : { "error_message" : "Deal track field is duplicated" },
							"deal_milestone_duplicated" : {"error_message" : "Milestone field is duplicated."},
							"deal_related_contact_duplicated" : {"error_message" : "Deal relatsTo field duplicated" },
							"deal_probability_duplicated" : {"error_message" : "Deal probability field is duplicated"},
							"deal_close_date_duplicated" : {"error_message" : "Deal close date field is duplicated"},
							"deal_note_duplicated" : {"error_message" : "Deal Note field duplicated"},
							"deal_description_duplicated" : {"error_message":"Deal descriptions field is duplicated"},
					}
					var models = [];

					// Hide the alerts
					$(".import_contact_error").hide();

					// Headings validation jitendra: 28-08-14
					/*
					 * Reads all the table heading set after importing contacts
					 * list from CSV and ensures that company_name which are
					 * mandatory fields. Checks if duplicate table headings are
					 * set. If validations failed the error alerts a explaining
					 * the cause are shown
					 */
					deal_count = 0, value_count = 0, probability_count = 0, milestone_count = 0, track_count = 0,	close_date_count=0,related_count=0,note_count=0,description_count = 0;
					$(".import-select").each(function(index, element)
					{
						var value = $(element).val();
						if (value == "properties_name")
							deal_count += 1;
						if (value == "properties_value")
							value_count += 1;
						if (value == "properties_probability")
							probability_count += 1;
						if (value == "properties_milestone")
							milestone_count += 1;
						if (value == "properties_track")
							track_count += 1;
						if(value == "properties_closeDate")
										close_date_count +=1;
						if(value == "properties_relatedTo")
										related_count +=1;
						if(value == "properties_note")
										note_count +=1;
						if(value == "properties_description")
										description_count +=1;
										

					});

					if (deal_count == 0)
					{
						getTemplate("import-deal-validation-message", upload_valudation_errors.deal_name_missing, undefined, function(template_ui){
								if(!template_ui)
									  return;
								$("#import-validation-error").html($(template_ui));
						}, "#import-validation-error");

						return false;
					}
			

					else if (deal_count > 1)
					{
						getTemplate("import-deal-validation-message", upload_valudation_errors.deal_duplicated, undefined, function(template_ui){
								if(!template_ui)
									  return;
						$("#import-validation-error").html($(template_ui));
						}, "#import-validation-error");
						return false;
					}

					else if (value_count > 1)
					{
						getTemplate("import-deal-validation-message", upload_valudation_errors.deal_value_duplicated, undefined, function(template_ui){
								if(!template_ui)
									  return;
								$("#import-validation-error").html($(template_ui));
						}, "#import-validation-error");

						return false;
					}

					else if (track_count > 1)
					{
						getTemplate("import-deal-validation-message", upload_valudation_errors.deal_track_duplicated, undefined, function(template_ui){
								if(!template_ui)
									  return;
								$("#import-validation-error").html($(template_ui));
						}, "#import-validation-error");

						return false;
					}

					else if (milestone_count > 1)
					{
						getTemplate("import-deal-validation-message", upload_valudation_errors.deal_milestone_duplicated, undefined, function(template_ui){
								if(!template_ui)
									  return;
								$("#import-validation-error").html($(template_ui));
						}, "#import-validation-error");

						return false;
					}
					
					else if (related_count > 1)
					{
						getTemplate("import-deal-validation-message", upload_valudation_errors.deal_related_contact_duplicated, undefined, function(template_ui){
								if(!template_ui)
									  return;
								$("#import-validation-error").html($(template_ui));
						}, "#import-validation-error");

						return false;
					}

					else if (probability_count > 1)
					{
						getTemplate("import-deal-validation-message", upload_valudation_errors.deal_probability_duplicated, undefined, function(template_ui){
								if(!template_ui)
									  return;
								$("#import-validation-error").html($(template_ui));
						}, "#import-validation-error");

						return false;
					}
					
					else if (close_date_count > 1)
					{
						getTemplate("import-deal-validation-message", upload_valudation_errors.deal_close_date_duplicated, undefined, function(template_ui){
								if(!template_ui)
									  return;
								$("#import-validation-error").html($(template_ui));
						}, "#import-validation-error");

						return false;
					}
					
					else if (note_count > 1)
					{
						getTemplate("import-deal-validation-message", upload_valudation_errors.deal_note_duplicated, undefined, function(template_ui){
								if(!template_ui)
									  return;
								$("#import-validation-error").html($(template_ui));
						}, "#import-validation-error");

						return false;
					}
					
					else if (description_count > 1)
					{
						getTemplate("import-deal-validation-message", upload_valudation_errors.deal_description_duplicated, undefined, function(template_ui){
								if(!template_ui)
									  return;
								$("#import-validation-error").html($(template_ui));
						}, "#import-validation-error");

						return false;
					}

					$(this).attr('disabled', true);

					/*
					 * After validation checks are passed then loading is shown
					 */
					$waiting = $('<div style="display:inline-block;padding-left:5px"><small><p class="text-success"><i><span id="status-message">Please wait</span></i></p></small></div>');
					$waiting.insertAfter($('#import-cancel'));

					var properties = [];

					/*
					 * Iterates through all tbody tr's and reads the table
					 * heading from the table, push the table name as property
					 * name and value as property value as ContactField
					 * properties.
					 */
					var model = {};

					// Add Tags

					$('td.import-contact-fields').each(function(index, element)
					{

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
						var type = $(select).find(":selected").attr('class') == 'CUSTOM' ? 'CUSTOM' : 'SYSTEM';
						console.log("name :" + name + ", type" + type);

						if (name.indexOf("properties_") != -1)
						{
							name = name.split("properties_")[1];
							property["type"] = type;

							// Set the value and name fields
							if (!property["value"])
								property["value"] = name;

							property["name"] = name;
							console.log(property);
							if (name.indexOf("_ignore_") != -1)
								property = {};
						}
						else
						{
							property["name"] = name;
						}

						// Push in to properties array (represents
						// ContactField array)
						properties.push(property);

					});

					model.properties = properties;

					// Shows Updating
					$waiting.find('#status-message').html(getRandomLoadingImg());

					// Represents prototype of contact, which specifies the
					// order of properties
					var Opportunity = model;

					console.log(Opportunity);

					// Sends request to save the contacts uploaded from csv,
					// present in the blobstore. Contact is sent to save
					// each row in csv file in to a contact
					$.ajax({ type : 'POST', url : "/core/api/upload/save?type=Deals&key=" + BLOB_KEY, data : JSON.stringify(Opportunity),
						contentType : "application/json", success : function(data)
						{
							// Navigate to contacts page
							// Sends empty JSON to remove
							// contact uploaded

							showNotyPopUp('information', "Deals are now being imported. You will be notified on email when it is done", "top", 5000);
							location.href = agileWindowOrigin() + "#deals";
							// Calls vefiryUploadStatus with data returned
							// from the url i.e., key of the memcache
							// verifyUploadStatus(data);
						}, });

				});

}
// Validation function for import contacts.
function importContactsValidate() 
                    {

						var upload_valudation_errors = {
							"first_name_missing" : { "error_message" : "First Name is mandatory. Please select first name." },
							"last_name_missing" : { "error_message" : "Last Name is mandatory. Please select last name." },
							"email_missing" : { "error_message" : "Email is mandatory. Please select Email." },
							"first_name_duplicate" : { "error_message" : " You have assigned First Name to more than one element. Please ensure that first name is assigned to only one element. " },
							"last_name_duplicate" : { "error_message" : "You have assigned Last Name to more than one element. Please ensure that last name is assigned to only one element." },
							"company_duplicate" : { "error_message" : "You have assigned Company to more than one element. Please ensure that company is assigned to only one element." },
							"job_title_duplicate" : { "error_message" : "You have assigned job description to more than one element. Please ensure that job description is assigned to only one element." },
							"invalid_tag" : { "error_message" : "Tag name should start with an alphabet and can not contain special characters other than underscore and space." },
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

						var fist_name_count = 0, last_name_count = 0, emails_count = 0, company_count = 0, job_title_count = 0;
						$(".import-select").each(function(index, element)
						{
							var value = $(element).val()
							if (value == "properties_first_name")
								fist_name_count += 1;
							else if (value == "properties_last_name")
								last_name_count += 1;
							else if (value == "properties_company")
								company_count += 0;
							else if (value.indexOf("-email") != -1)
								emails_count += 1;
							else if (value == "properties_title")
								job_title_count += 1;
						})

						if (fist_name_count == 0)
						{
							getTemplate("import-contacts-validation-message", upload_valudation_errors.first_name_missing, undefined, function(template_ui){
								if(!template_ui)
									  return;
								$(".contacts-import-outbox #import-validation-error").html($(template_ui));	
								initializeImportEvents($firstDiv.attr('id'));

							}, ".contacts-import-outbox #import-validation-error");
							
							return false;
						}
						else if (emails_count == 0)
						{
							getTemplate("import-contacts-validation-message", upload_valudation_errors.email_missing, undefined, function(template_ui){
								if(!template_ui)
									  return;

								$('.contacts-import-outbox #import-validation-error').html($(template_ui));	
							}, ".contacts-import-outbox #import-validation-error");

							return false;
						}
						/*
						 * else if(lastNameCount.length == 0) {
						 * $("#import-validation-error").html(getTemplate("import-contacts-validation-message",
						 * upload_valudation_errors.last_name_missing)); return
						 * false; }
						 */
						else if (fist_name_count > 1)
						{
							getTemplate("import-contacts-validation-message", upload_valudation_errors.first_name_duplicate, undefined, function(template_ui){
								if(!template_ui)
									  return;
									
								$('.contacts-import-outbox #import-validation-error').html($(template_ui));	
							}, ".contacts-import-outbox #import-validation-error");

							return false;
						}
						else if (last_name_count > 1)
						{
							getTemplate("import-contacts-validation-message", upload_valudation_errors.last_name_duplicate, undefined, function(template_ui){
								if(!template_ui)
									  return;
									
								$('.contacts-import-outbox #import-validation-error').html($(template_ui));	
							}, ".contacts-import-outbox #import-validation-error");

							return false;
						}
						else if (company_count > 1)
						{
							getTemplate("import-contacts-validation-message", upload_valudation_errors.company_duplicate, undefined, function(template_ui){
								if(!template_ui)
									  return;
									
								$('.contacts-import-outbox #import-validation-error').html($(template_ui));	
							}, ".contacts-import-outbox #import-validation-error");

							return false;
						}
						else if (job_title_count > 1)
						{
							getTemplate("import-contacts-validation-message", upload_valudation_errors.job_title_duplicate, undefined, function(template_ui){
								if(!template_ui)
									  return;
									
								$('.contacts-import-outbox #import-validation-error').html($(template_ui));	
							}, ".contacts-import-outbox #import-validation-error");

							return false;
						}

						

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
						var tags_valid = true;
						if (tags != undefined)
						{
							$.each(tags[0].value, function(index, value)
							{
								if(!isValidTag(value, false)) {
									tags_valid = false;
									return false;
								}
								if (!model.tags)
									model.tags = [];

								console.log(model);

								model.tags.push(value);
							});
						}
						if(!tags_valid) {
							getTemplate("import-contacts-validation-message", upload_valudation_errors.invalid_tag, undefined, function(template_ui){
								if(!template_ui)
									  return;
								$('.contacts-import-outbox #import-validation-error').html($(template_ui));	
							}, ".contacts-import-outbox #import-validation-error");

							return false;
						}
						return true;

					}


/**
 * Receives blobkey from the CSV upload popup after storing in blobstore, and
 * request is set to process the CSV and return first 10 contacts where user can
 * set the fields
 * 
 * @param key
 */
function parseCSV(key, type)
{

	BLOB_KEY = key;
	$("#upload_contacts").after(getRandomLoadingImg());

	$.getJSON('core/api/upload/process?blob-key=' + key, function(data)
			{
				var template;
				console.log(data);
				if (data == undefined)
					return;
				constructCustomfieldOptions(type, function(fields, el)
				{
					/*
					 * $('#custom_fields', template).each(function(index,
					 * element) { $(element).html(el); });
					 */
					data["custom_fields"] = fields.toJSON();
					var template_name = "";

					if (type == "contacts")
						  template_name = "import-contacts-2";
					else if(type == "company")
					  	  template_name = "import-companies";
					else if(type == "deals")
					  	  template_name = "import-deals2";

					
					var $firstDiv = $('#content').children().first();
					getTemplate(template_name, data, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$firstDiv.html($(template_ui));
						initializeImportEvents($firstDiv.attr('id'));
						setup_tags_typeahead();

					}, $firstDiv);					
				})

			})
			.error(
					function(response)
					{
						// Show cause of error in saving
						$save_info = $('<div style="display:inline-block;margin-left:5px"><small><p style="color:#B94A48; font-size:14px"><i>' + response.responseText + '</i></p></small></div>');

						$(".loading").remove();
						// block.
						$("#upload_contacts").after($save_info);

						// Hides the error message after 3
						// seconds
						$save_info.show().delay(3500).hide(1);
					})
}

/**
 * Loads custom fields available and creates options
 * 
 * @param callback
 */
function constructCustomfieldOptions(type, callback)
{

	var custom_fields;
	if (type == "contacts")
	{
		custom_fields = Backbone.Collection.extend({ url : 'core/api/custom-fields/byscope?scope=CONTACT' });
	}
	else if (type == "company")
	{
		custom_fields = Backbone.Collection.extend({ url : 'core/api/custom-fields/byscope?scope=COMPANY' });
	}
	else if (type == "deals")
	{
		custom_fields = Backbone.Collection.extend({ url : 'core/api/custom-fields/byscope?scope=DEAL' });
	}

	new custom_fields().fetch({ success : function(data)
	{
		var el = "";
		$.each(data.toJSON(), function(index, field)
		{
			el = el + '<option value ="' + field.field_label + '" id="' + field.field_type + '">' + field.field_label + '</option>'
		})
		if (callback && typeof (callback) === "function")
			callback(data, el);
	} });

}
