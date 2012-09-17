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
		var data = $(this).find('.filter').attr('filter');
		if(data)
			{
			 Backbone.history.navigate("contacts-filter-edit/" + data, {
		            trigger: true
		        });
			}
		
	});
    
});

// Set up filters list drop-down in contacts list
function setupContactFilterList(cel)
{
	contactFiltersListView = new Base_Collection_View({
        url: '/core/api/contacts/filters',
        restKey: "ContactFilter",
        templateKey: "contact-filter",
        individual_tag_name: 'li'
    });
	
	contactFiltersListView.collection.fetch();
	$('#filter-list', cel).html(contactFiltersListView.render().el);
}