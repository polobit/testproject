$(function(){
	
	 $('#import-contacts').die().live('click', function (e) {
		 
		 	var models = [];
		 
		 	// Hide the alerts
		 	$(".fname-not-found-error").hide();
		 	$(".lname-not-found-error").hide();
		 	$(".fname-duplicate-error").hide();
		 	$(".lname-duplicate-error").hide();
		 
		 	// Headings validation Rammohan: 10-09-12
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
		   
	        // Iterate through all tbody tr
	        $('#import-tbody tr').each(function () {
	            var properties = [];
	            

	            $(this).find("td").each(function (i) {

	                var property = {};
	                var name = $(this).parents('table').find('th').eq(i).find('select').val();
	                console.log($(this));
	                console.log("Name is " + name);


	                if (name.indexOf("-") != -1) {
	                    var splits = name.split("-");
	                    name = splits[1];
	                    var type = splits[0];
	                    property["sub_type"] = type;
	                }

	                var value = $(this).html();
	                //console.log("Column value is " + value);

	                property["value"] = value;
	                property["name"] = name;

	                properties.push(property);

	            });

	            //console.log(properties);

	            var model = {};
	            model.properties = properties;
	            model.type = "PERSON";
	            model.first_name = "uploaded";
	            model.last_name = "uploaded";

	            // Add Tags
	            var tags = getTags('tags-import');
	            if (tags != undefined) model.tags = tags;

	            models.push(model);

	        });

	        //console.log(models);

	        var contact = {};
	        contact.contact = models;

	        $.ajax({
	            type: 'POST',
	            url: '/core/api/contacts/upload',
	            data: JSON.stringify(contact),
	            contentType: "application/json; charset=utf-8",
	            success: function (data) {
	                //console.log("Uploaded successfully");
	                //console.log(data);
	            	App_Contacts.contactsListView.collection.add(data.contact);
	            },
	            dataType: 'json'
	        });

	    });
});

function fileUploadInit() {
	var uploader = new qq.FileUploader({
        element: document.getElementById('file-upload-div'),
        action: '/core/api/contacts/upload',
        debug: true,
        onComplete: function (id, fileName, data) {

            console.log(data);
            $('#content').html(getTemplate("import-contacts-2", data));
           
            setupTagsTypeAhead(); // ??
        }
    });

}