$(function(){
    
    // Filter Contacts- Clone Multiple 
    $("i.filter-contacts-multiple-add").die().live('click', function (e) {
    	var htmlContent = $(this).closest("tr").clone();
    	$(htmlContent).find("i.filter-contacts-multiple-remove").css("display", "block");
    	$(this).parents("tbody").append(htmlContent);
    });
   
    // Filter Contacts- Remove Multiple
    $("i.filter-contacts-multiple-remove").die().live('click', function (e) {
 
    		$(this).closest("tr").remove();
    });
});