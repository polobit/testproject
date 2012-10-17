var filter_name;
$(function(){
	
	
    // Filter Contacts- Clone Multiple 
    $("i.filter-contacts-multiple-add").die().live('click', function (e) {
    	
    // To solve chaining issue when cloned
   	var htmlContent = $(getTemplate("filter-contacts", {})).find('tr').clone()
    	
    	var LHS = $('#LHS', htmlContent);
    	var condition = $('#condition', htmlContent);
    	var RHS_NEW = $('#RHS-NEW', htmlContent);
    	var RHS = $("#RHS", htmlContent);
    	
    	// Chaining dependencies of input fields with jquery.chained.js
		condition.chained(LHS);
		RHS_NEW.chained(condition);
    	RHS.chained(LHS);
   
    	//var htmlContent = $(this).closest("tr").clone();
    	$(htmlContent).find("i.filter-contacts-multiple-remove").css("display", "inline-block");
    	$(this).parents("tbody").append(htmlContent);
    });
   
    // Filter Contacts- Remove Multiple
    $("i.filter-contacts-multiple-remove").die().live('click', function (e) {
    		$(this).closest("tr").remove();
    });
    
	$('#contact-filter-model-list > tr').live('click', function(e){
		
		e.preventDefault();
		console.log("clicked on filters list");
		var data = $(this).find('.filter-edit').attr('filter');
		if(data)
			{
			 Backbone.history.navigate("contact-filter-edit/" + data, {
		            trigger: true
		        });
			}
		
	});
	
	// Fetch filter result without changing route
	$('.filter').live('click',function(e){
		e.preventDefault();
		var filter_id = $(this).attr('id');
		
		// Save Filter in cookie
		createCookie('contact_filter', filter_id)
		
		filter_name = $(this).attr('data');
		
		// If custom view is set then load filter results in custom view
		if(readCookie("contact_view"))
			{
				// Set url to custom view to load filter results
				App_Contacts.contact_custom_view.collection.url = "core/api/filters/query/" + filter_id;
				App_Contacts.contact_custom_view.collection.fetch();	
				return;
			}
		
		// If contactsListView is defined (default view) then load filter results in default view 
		if(App_Contacts.contactsListView && App_Contacts.contactsListView.collection)
		{	
			// Set url to default view to load filter results
			App_Contacts.contactsListView.collection.url = "core/api/filters/query/" + filter_id;
			App_Contacts.contactsListView.collection.fetch();
		}
	});
	
	$('.default_filter').live('click', function(e){
		e.preventDefault();
		eraseCookie('contact_filter');
		App_Contacts.contacts();
		
	})
	
	$('#companies-filter').live('click', function(e){
		e.preventDefault();
		console.log("click triggered");
		// If contactsListView is defined (default view) then load filter results in default view 
		if(App_Contacts.contactsListView && App_Contacts.contactsListView.collection)
		{	
			// Set url to default view to load filter results
			App_Contacts.contactsListView.collection.url = "core/api/contacts/companies";
			App_Contacts.contactsListView.collection.fetch();
		}
	});
    
});

// Set up filters list drop-down in contacts list
function setupContactFilterList(cel, filter_id)
{
	var contactFiltersListView = new Base_Collection_View({
        url: '/core/api/filters',
        restKey: "ContactFilter",
        templateKey: "contact-filter-list",
        individual_tag_name: 'li',
        postRenderCallback: function(el) {
        	if(filter_id = readCookie('contact_filter'))
        		{
        			var filter_name = contactFiltersListView.collection.get(filter_id).toJSON().name;
        			console.log(el.find('.filter-dropdown').append(filter_name));
        		}
        }
    });
	
	contactFiltersListView.collection.fetch();
	
	var filter_dropdown_element = contactFiltersListView.render().el;
	
	$('#filter-list', cel).html(contactFiltersListView.render().el);
}


