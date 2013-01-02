/**
 * Reads the file and sends request to to URL given, using fileuploader.js.
 * Element is required to be specified, on clicking on the element file selector
 * window is opened, after selecting the file to be uploaded request is sent to
 * the URL specified as action attribute. This function using file uploader
 * sends request to "core/api/contacts/upload" which processes the request and
 * returns data as a map, is shown in a template using handlebars.
 */
/*
 * function fileUploadInit() { var uploader = new qq.FileUploader({ element :
 * document.getElementById('file-upload-div'), action :
 * '/core/api/upload/process', debug : true, onComplete : function(id, fileName,
 * data) { url = data["url"]; // import-contacts template is populated with the
 * processed data $('#content').html(getTemplate("import-contacts-2", data)); //
 * Sets up typeahead for tags setup_tags_typeahead(); } }); }
 */

var blob_key;

/**
 * Calls method to process data uploaded, which returns first 10 contacts in
 * tabular form to set table headings. It requests url
 * "/core/api/upload/csv/process" with blobkey/memcache key as post data
 * 
 * @param key
 */
function processBlobData(key) {

	// If key is not defined, no data is to process since no blob key so returns
	if (!key)	
		return;

	// Sets blob key to global value, so it can be used while saveing uploaded
	// contacts
	blob_key = key;

	// Post the blobkey, which internally process the csv file and return data
	// as a json object
	$.ajax({
		type : 'POST',
		url : '/core/api/upload/csv/process',
		data : key,
		success : function(data) {

			// Processed contacts in csv are shown in the template
			$('#content').html(getTemplate("import-contacts-2", data));
		}
	});
}

/**
 * Verifies whether blob data is saved.
 * <p>
 * Requests 'core/api/contact/upload/status/', repeatedly with specified
 * interval time until the data returned is true i.e., uploaded contacts are
 * saved, then navigates to contacts route
 * </p>
 * 
 * @param key
 *            Blob/memcache key
 */
function verifyUploadStatus(key) {
	$.ajax({
		type : 'POST',
		url : '/core/api/upload/save/status',
		data : key,
		success : function(data) {

			// If response data is true, then navigate to contact,
			// since all contacts in the file are saved
			if (data) {

				// Navigates back to contacts
				Backbone.history.navigate('contacts', {
					trigger : true
				});
				return;
			}

			// If data is not true, uploaded contacts are not saved yet,
			// so calls to send request after 15 seconds
			setTimeout(function() {
				verifyUploadStatus(key);
			}, 15000);
		}
	});
}

/**
 * Defines actions on events on imports contacts element, which does validation
 * on the import template, whether contact have first_name last_name which are
 * mandatory fields. If first name and last name are not specified or specified
 * same label for different fields then error message is shown and will not send
 * a request to save contacts.
 */
$(function() {

	// When upload button is selected upload jsp is initialized and show in the
	// jsp to import files
	$(".upload-contacts-csv").live(
			'click',
			function(e) {
				e.preventDefault();
				var newwindow = window.open("upload-contacts.jsp?import=true",
						'name', 'height=310,width=500');
				if (window.focus) {
					newwindow.focus();
				}
				return false;

			})

	/*
	 * On clicking on import contacts it checks whether all mandatory field are
	 * set and ensure no duplicate field names are set. If all the validation
	 * checks are passed, the request the backend to save the contacts
	 */
	$('#import-contacts')
			.die()
			.live(
					'click',
					function(e) {

						if (!blob_key)
							return;
						var models = [];

						// Hide the alerts
						$(".fname-not-found-error").hide();
						$(".lname-not-found-error").hide();
						$(".fname-duplicate-error").hide();
						$(".lname-duplicate-error").hide();

						// Headings validation Rammohan: 10-09-12
						/*
						 * Reads all the table heading set after importing
						 * contacts list from CSV and ensures that first_name
						 * and last_name fields are set, which are mandatory
						 * fields. Checks if duplicate table headings are set.
						 * If validations failed the error alerts a explaining
						 * the cause are shown
						 */
						var firstNameCount = $(".import-select").filter(
								function() {
									return $(this).val() == "first_name";
								});

						var lastNameCount = $(".import-select").filter(
								function() {
									return $(this).val() == "last_name";
								});

						if (firstNameCount.length == 0) {
							$(".fname-not-found-error").show();
							return false;
						} else if (lastNameCount.length == 0) {
							$(".lname-not-found-error").show();
							return false;
						} else if (firstNameCount.length > 1) {
							$(".fname-duplicate-error").show();
							return false;
						} else if (lastNameCount.length > 1) {
							$(".lname-duplicate-error").show();
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
						$('#import-header tr th').each(function() {

							console.log(this);
							// Empty property map (Represents
							// ContactField in contact.java)
							var property = {};

							// Read the name of the property from
							// table heading
							var name = $(this).find('select').val();

							// Reads the sub type of the fields
							if (name.indexOf("-") != -1) {
								var splits = name.split("-");
								name = splits[1];
								var type = splits[0];
								property["subtype"] = type;
							}

							// Set the value and name fields
							property["value"] = name;
							property["name"] = name;

							// Push in to properties array (represents
							// ContactField array)
							properties.push(property);

						});

						var model = {};
						model.properties = properties;
						model.type = "PERSON";

						// Add Tags
						var tags = get_tags('import-contact-tags');
						if (tags != undefined)
							model.tags = tags[0].value;

						// Shows Updating
						$waiting.find('#status-message').html(
								'Uploading to server');

						// Represents prototype of contact, which specifies the
						// order of properties
						var contact = model;

						// Sends request to save the contacts uploaded from csv,
						// present in the blobstore. Contact is sent to save
						// each row in csv file in to a contact
						$.ajax({
							type : 'POST',
							url : "/core/api/upload/contacts/save/?key="
									+ blob_key,
							data : JSON.stringify(contact),
							contentType : "application/json; charset=utf-8",
							success : function(data) {

								// Calls vefiryUploadStatus with data returned
								// from the url i.e., key of the memcache
								verifyUploadStatus(data);
							},
						});

					});

	// Cancels import, removes the contacts uploaded in to table, still calls
	// fileUploadInit,
	// so user can upload again if required
	$('#import-cancel').die().live('click', function(e) {

		// Sends empty JSON to remove contact uploaded
		$('#content').html(getTemplate("import-contacts", {}));
	});
});