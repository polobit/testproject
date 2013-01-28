/**
 * Reads the file and sends request to to URL given, using fileuploader.js.
 * Element is required to be specified, on clicking on the element file selector
 * window is opened, after selecting the file to be uploaded request is sent to
 * the URL specified as action attribute. This function using file uploader
 * sends request to "core/api/contacts/upload" which processes the request and
 * returns data as a map, is shown in a template using handlebars.
 */
function fileUploadInit() {
	var uploader = new qq.FileUploader({
		element : document.getElementById('file-upload-div'),
		action : '/core/api/contacts/upload',
		debug : true,
		onComplete : function(id, fileName, data) {

			// import-contacts template is populated with the processed data
			$('#content').html(getTemplate("import-contacts-2", data));

			// Sets up typeahead for tags
			setup_tags_typeahead();
		}
	});

}


/**
 * Defines actions on events on imports contacts element, which does validation 
 * on the import template, whether contact have first_name last_name which are 
 * mandatory fields. If first naRme and last name are not specified or specified 
 * same label for different fields then error message is shown and will not send 
 * request to save.
 */
$(function(){
	
	/* On clicking on import contacts it checks whether all mandatory field are 
	 * set and ensure no duplicate field names are set. If all the validation 
	 * checks are passed, the request the backend to save the contacts
	 */
	 $('#import-contacts').die().live('click', function (e) {
		 
		 	var models = [];
		 
		 	// Hide the alerts
		 	$(".fname-not-found-error").hide();
		 	$(".lname-not-found-error").hide();
		 	$(".fname-duplicate-error").hide();
		 	$(".lname-duplicate-error").hide();
		 
		 	// Headings validation Rammohan: 10-09-12
		 	/*
		 	 * Reads all the table heading set after importing contacts list from 
		 	 * CSV and ensures that first_name and last_name fields are set, which
		 	 * are mandatory fields. Checks if duplicate table headings are set. If
		 	 * validations failed the error alerts a explaining the cause are shown
		 	 */
		 	var firstNameCount = $(".import-select").filter(function() {
				 return $(this).val() == "first_name";
			 });
	
		 	var lastNameCount = $(".import-select").filter(function() {
				 return $(this).val() == "last_name";
			 });
 
		 	if(firstNameCount.length == 0){ 
		 		$(".fname-not-found-error").show();
		 		return false;
		 	}
		 	else if(lastNameCount.length == 0){
		 		$(".lname-not-found-error").show();
		 		return false;
		 	}
		 	else if(firstNameCount.length > 1){
		 		$(".fname-duplicate-error").show();
		 		return false;
		 	}
		 	else if(lastNameCount.length > 1){
		 		$(".lname-duplicate-error").show();
		 		return false;
		 	}
		 	
		 	/*
		 	 * After validation checks are passed then loading is shown
		 	 */
		 	$waiting =  $('<div style="display:inline-block;padding-left:5px"><small><p class="text-success"><i><span id="status-message">Please wait</span></i></p></small></div>');
    		$waiting.insertAfter($('#import-contacts'));
    		
    		/*
    		 * Iterates through all tbody tr's and reads the table heading from the 
    		 * table, push the table name as property name and value as property 
    		 * value as ContactField properties.
    		 */
	        $('#import-tbody tr').each(function () {
	            var properties = [];
	            
	            $(this).find("td").each(function (i) {

	            	// Empty property map (Represents ContactField in contact.java)
	                var property = {};
	                
	                // Read the name of the property from table heading
	                var name = $(this).parents('table').find('th').eq(i).find('select').val();
	                
	                // Reads the sub type of the fields
	                if (name.indexOf("-") != -1) {
	                    var splits = name.split("-");
	                    name = splits[1];
	                    var type = splits[0];
	                    property["sub_type"] = type;
	                }

	                var value = $(this).html();
	                //console.log("Column value is " + value);

	                // Set the value and name fields
	                property["value"] = value;
	                property["name"] = name;

	                // Push in to properties array (represents ContactField array)
	                properties.push(property);

	            });

	            var model = {};
	            model.properties = properties;
	            model.type = "PERSON";
	            model.first_name = "uploaded";
	            model.last_name = "uploaded";

	            // Add Tags
	            var tags = get_tags('import-contact-tags');
	            if (tags != undefined) model.tags = tags[0].value;

	            // Pushes model (represents contact) in to an array of models 
	            models.push(model);

	        });

//	        if(models.length > 1000)
//	        	{
//	        		$waiting.find('#status-message').html('Sorry, Cannot upload more than 1000 contacts');
//	        		return;
//	        	}
//	        
//	        
	        
	        // Shows Updating
	        $waiting.find('#status-message').html('Uploading to server');

	        var contact = models;
	        //contact.contact = models;

	        // List of contacts built out of csv, post request is sent to 
	        // 'core/api/contacts/multi/upload' with list of contacts
	        $.ajax({
	            type: 'POST',
	            url: '/core/api/contacts/multi/upload',
	            data: JSON.stringify(contact),
	            contentType: "application/json; charset=utf-8",
	            success: function (data) {
	                
	            	// After saving the contacts, loading is removed
	            	$waiting.find('#status-message').html('Uploaded successfully');
	            	
	            	// Navigates back to contacts
	            	Backbone.history.navigate('contacts', {
                        trigger: true
                    });

	                //console.log(data);
	            	//App_Contacts.contactsListView.collection.add(data.contact);
	            },
	            error: function(response)
	            {
	            	console.log(response.responseText);
	            },
	            dataType: 'json'
	        });

	    });
	 
	 // Cancels import, removes the contacts uploaded in to table, still calls fileUploadInit, 
	 // so user can upload again if required 
	 $('#import-cancel').die().live('click', function (e) {
		 
		 // Sends empty JSON to remove contact uploaded
		 $('#content').html(getTemplate("import-contacts", {}));
	        head.js('lib/fileuploader-min.js', function(){
	        	fileUploadInit();
	        });
	 });
});