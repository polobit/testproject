$(function(){
	// Filter Contacts- Clone Multiple
	$("i.filter-contacts-shopify-rule-multiple-add").die().live('click', function(e)
	{
		// To solve chaining issue when cloned
		var htmlContent = $(getTemplate("shopifyrules-add", {})).find('.shopify-rule-contact-condition-table tr').clone();
		scramble_input_names($(htmlContent));

		$(this).hide();
		
		chainFilters(htmlContent, undefined, undefined, true);

		// var htmlContent = $(this).closest("tr").clone();
		$(htmlContent).find("i.filter-contacts-multiple-remove").css("display", "inline-block");
		$(this).parents("tbody").append(htmlContent);
	});
});