// To save map of key: first_name and value: contact id 
var TAGS = {};
function agile_type_ahead(id, el, callback, isSearch) {
	
	var CONTACTS = {};
	$('#' + id, el).typeahead({
		source : function(query, process) {
	
			// Get data on query
			$.getJSON("core/api/contacts/search/" + query,
				function(data) {
					
					var items_list = [] ;
					
					// Store query results to use them in updater and render functions
					CONTACTS = data;
					
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
		matcher : function(item)
		{
			if(~item.toLowerCase().indexOf(this.query.toLowerCase()) != 0)
				return ~item.toLowerCase().indexOf(this.query.toLowerCase());
			else
				return -1;
		},
		render: function()
		{	
			var that = this;
			items = $(CONTACTS).map(function (i, item) {
		
							var fullname = fullname = getPropertyValue(item.properties, "first_name") + " " + getPropertyValue(item.properties, "last_name");

							i = $(that.options.item).attr('data-value', fullname);
							i.find('a').append(getTemplate('typeahead-contacts',item));
							
							/* highlighter*/
							//i.find('a').append('<div><div style="display:inline;padding-right:10px;height:auto;"><img src="'+ pic +'"style="width:50px;height:50px;"></img></div><div style="height:auto;display:inline-block;vertical-align:-20px;">' + that.highlighter(fullname) + '<br/>'+ that.highlighter(email) +'<br/>'+ that.highlighter(company) +'</div></div>');
							
					return i[0];
				});

				
			
			// Set first li element as active
				items.first().addClass('active');
				
				// Set the width of typeahead dropdown
				this.$menu.css("width",300);
				
				// Calls show to show the dropdown
				this.$menu.html(items).show();
				this.shown = true;
				return this
		},
		updater: function (items) {
			var tag_not_exist = true;		
			
			// Customize data for type ahead
			if (isSearch && typeof(isSearch) === "function")
				{
					isSearch(TAGS[items]);							
				}
			
			
			// If tag already exists returns 
			$.each($('.tags', el).children('li'), function(index, tag) {
				
				if($(tag).attr('value') == TAGS[items])
					{
						tag_not_exist = false;
						return;
					}
			});

			//add tag 
			if(tag_not_exist)				
				$('.tags',el).append('<li class="tag"  style="display: inline-block;" value="'+ TAGS[items]+'">'+items+'<a class="close" id="remove_tag">&times</a></li>');
		},
		minLength : 2,
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

				contact_names_list.push(contact_name);
			});
			return contact_names_list;
	}
	
}

				