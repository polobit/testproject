
function contactsTypeAhead(id, el) {
	
	// To save map of key: first_name and value: contact id 
	var CONTACT = [];
	
	$('#' + id, el).typeahead({
		source : function(query, process) {
			
			// Get data on query
			$.getJSON( "core/api/contacts/search/" + query,
				function(data) {
				// If not null process data to show	
				if(data != null)
					{
						var contact_list = [];
						
						// If result is multiple contacts (Array)
						if(isArray(data.contact))
						{
							$.each(data.contact, function(index, contact ){
								$.each(contact.properties, function (index, property) {
									if (property.name == "first_name")
									{
										contact_list.push(property.value);
										CONTACT[property.value] = contact;
									}
								});
							});
						}
						else
						{
							$.each(data.contact.properties, function (index, property) {
								if (property.name == "first_name")
								{
									contact_list.push(property.value);
									CONTACT[property.value] = data.contact;
								}
							});
						}
						
						// Call Process on list of names(Strings)
						process(contact_list)
					}
				});
		},
		updater: function (items) {
			// If contact tag already exists returns 
			if($('#contact-tags',el).find('li').attr('value') == CONTACT[items].id)
				return;
			
			// Else add tag 
			else
			 $('#contact-tags',el).append('<li class="contact_tags label label-warning" value='+CONTACT[items].id+' >'+items+'<a class="icon-remove" id="remove_tag"></a></li>');
		},
		minLength : 2
	})
}



// Remove tags 
$('#remove_tag').die().live('click', function(event){
	event.preventDefault();
	$(this).parent().remove();
})

