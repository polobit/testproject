// To save map of key: first_name and value: contact id 
var TAGS = [];
	
function agile_type_ahead(id, el, callback) {
	
	$('#' + id, el).typeahead({
		source : function(query, process) {
			
			// Get data on query
			$.getJSON("core/api/contacts/search/" + query,
				function(data) {
					var items_list = [] ;
				
					// Customize data for type ahead
					if (callback && typeof(callback) === "function")
						{
							items_list = callback(data);							
						}

					// For other tags we have to write else for processing data.. items_list = data...
					
					// To save map of key: tag_name and value: id 
					$.each(data, function(index, item){
						
						tag_name = items_list[index];
						
						TAGS[tag_name] = item.id; 
					});
					
					process(items_list);
		
				});
		},
		updater: function (items) {
			var tag_not_exist = true;		
			
			// If tag already exists returns 
			$.each($('#tags', el).children('li'), function(index, tag) {
				
				if($(tag).attr('value') == TAGS[items])
					{
						tag_not_exist = false;
						return;
					}
			});

			//add tag 
			if(tag_not_exist)				
				$('#tags',el).append('<li class="label label-warning"  style="display: inline-block; vertical-align: middle; margin-right:3px;" value="'+ TAGS[items]+'">'+items+'<a class="icon-remove" id="remove_tag"></a></li>');
		},
		minLength : 2
	})
}

// Remove tags 
$('#remove_tag').die().live('click', function(event){
	event.preventDefault();
	$(this).parent().remove();
});



/*
 * Customization of Type-Ahead data  
 */


// Returns list of contacts names for type ahead
function contacts_typeahead(data){
	if(data != null)
	{
		var contact_names_list = [];
		var CONTACT = [];
		
		// If result is multiple contacts (Array)
		if(!isArray(data))
			data = [data];
		
			$.each(data, function(index, contact ){
				var contact_name;
				
				$.each(contact.properties, function (index, property) {
					if (property.name == "first_name")
					{
						contact_name = property.value;
					}
					if(property.name == "last_name")
					{
						contact_name = contact_name.concat(" "+property.value);
						
					}
				});
				
				CONTACT[contact_name] = contact;
				contact_names_list.push(contact_name);
			});

			return contact_names_list;
	}
	
}

				