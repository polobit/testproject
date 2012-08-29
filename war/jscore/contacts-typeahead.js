
// To save map of key: first_name and value: contact id 
var CONTACT = [];
	
function contactsTypeAhead(id, el) {
	
	
	$('#' + id, el).typeahead({
		source : function(query, process) {
			
			// Get data on query
			$.getJSON("core/api/contacts/search/" + query,
				function(data) {
				// If not null process data to show	
				if(data != null)
					{
						var contact_names_list = [];
						
						// If result is multiple contacts (Array)
						if(!isArray(data.contact))
							data.contact = [data.contact];
						
							$.each(data.contact, function(index, contact ){
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
							
							
						// Call Process on list of names(Strings)
						process(contact_names_list);
					}
				});
		},
		updater: function (items) {
			var tag_not_exist = true;
			
			// If contact tag already exists returns 
			$.each($('#contact-tags', el).children('li'), function(index, tag) {
				if($(tag).attr('value') == CONTACT[items].id)
					{
						tag_not_exist = false;
						return;
					}
			})
			
			//add tag 
			if(tag_not_exist)
				$('#contact-tags',el).append('<li class="contact_tags label label-warning" value='+CONTACT[items].id+' >'+items+'<a class="icon-remove" id="remove_tag"></a></li>');
		},
		minLength : 2
	})
}

// Remove tags 
$('#remove_tag').die().live('click', function(event){
	event.preventDefault();
	$(this).parent().remove();
});

