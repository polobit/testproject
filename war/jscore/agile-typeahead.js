// To save map of key: first_name and value: contact id 
var QUERY_RESULTS;
var TYPEHEAD_TAGS = {};
var RESULT_DROPDOWN_ELEMENT;
function agile_type_ahead(id, el, callback, isSearch) {
	
	// Turn off browser default auto complete
	$('#' + id, el).attr("autocomplete","off");
	
	var CONTACTS = {};
	
	$('#' + id, el).typeahead({
		source : function(query, process) {
			
			// Store typeahead object in temp variable
			var that = this;
			
			// Call render because menu needs to be initialized even before first result is fetched
			this.render();
			
			// Loading image is not avialable in menu then append it to menu
			if(!$(this.$menu.find('li').last()).hasClass('loading-results'))			
				this.$menu.append('<li class="divider"></li><li class="loading-results"><p align="center">'+LOADING_ON_CURSOR+'</p></li>');
			
			this.shown = true;
			
			// Reset the results before query
			CONTACTS = {};
			
			// Get data on query
			$.getJSON("core/api/search/" + query,
				function(data) {

				// Store query results to use them in updater and render functions
				CONTACTS = data;
				
				// Set results in global variable used to show results in different page
				QUERY_RESULTS = data;
				
				// If no result found based on query show info in type-ahead drop-down
				if(data.length == 0)
				{	
					// Call render to activate menu
					that.render();
					
					// Set css and html data to be displayed
					that.$menu.css("width",300);
					that.$menu.html('<p align="center"><b>No Results Found</b><p>').show();
					
					// Return further processing data not required 
					return;
				}
				
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
						TYPEHEAD_TAGS[tag_name] = item.id; 
						
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

			// If query results are not available activate the menu to show info and return
			if(!CONTACTS.length)
			{
				this.$menu.css("width",300);
				this.show();
				return;
			}
			
			items = $(CONTACTS).map(function (i, item) {

							// Check if item if of company type get company name instead of first name and last name of person
							if(item.type == "COMPANY")
								var fullname = getPropertyValue(item.properties, "name");
							else
								var fullname = getPropertyValue(item.properties, "first_name") +" "+ getPropertyValue(item.properties, "last_name");
							
							i = $(that.options.item).attr('data-value', fullname);
							
							// returns template can be contact or company compares in template
							i.find('a').append(getTemplate('typeahead-contacts',item));
							
							/* highlighter*/
							//i.find('a').append('<div><div style="display:inline;padding-right:10px;height:auto;"><img src="'+ pic +'"style="width:50px;height:50px;"></img></div><div style="height:auto;display:inline-block;vertical-align:-20px;">' + that.highlighter(fullname) + '<br/>'+ that.highlighter(email) +'<br/>'+ that.highlighter(company) +'</div></div>');
							
					return i[0];
				});
			
				RESULT_DROPDOWN_ELEMENT = items;
			
				// Set first li element as active
				//items.first().addClass('active');
				items.css("overflow", "hidden");
				// Set the width of typeahead dropdown
				this.$menu.css("width",300);
				
				// Calls show to show the dropdown
				this.$menu.html(items).show();
				this.shown = true;
				return this
		},
		updater: function (items) {
			var tag_not_exist = true;		

			
			// Store items in temp variable so to show first name lastname separated by space 
			var items_temp = items;
			
			// Trim spaces in names to retrieve contact id from JSON 
			if(items)
				items = items.split(" ").join("")
			
			// Customize data for type ahead
			if (isSearch && typeof(isSearch) === "function")
				{
				
					// If no item is selected then show results in different page
					if(!items)
					{
						showSearchResults();
						return;
					}
					isSearch(TYPEHEAD_TAGS[items]);
					return;
				}
			
			// Return if items are not defined and it is not search in nav bar
			if(!items)
				return;
				
			// If tag already exists returns 
			$.each($('.tags', el).children('li'), function(index, tag) {
				
				if($(tag).attr('value') == TYPEHEAD_TAGS[items])
					{
						tag_not_exist = false;
						return;
					}
			});
			
			//add tag 
			if(tag_not_exist)				
				$('.tags',el).append('<li class="tag"  style="display: inline-block;" data="'+ TYPEHEAD_TAGS[items]+'">'+items_temp+'<a class="close" id="remove_tag">&times</a></li>');
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
				
				// If contact type is company 
				if(contact.type == "COMPANY")
					{
						contact_name = getPropertyValue(contact.properties, "name");
						contact_names_list.push(contact_name);	
						return;
					}
				
				contact_name = getPropertyValue(contact.properties, "first_name") + getPropertyValue(contact.properties, "last_name");
				contact_names_list.push(contact_name.split(" ").join(""));
			});
			return contact_names_list;
	}
	
}
