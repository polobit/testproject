/**
 * invoice.js is a script file to navigates to invoice details template if
 * clicked on invoice list element client side.
 * 
 * @module Billing author: Yaswanth
 */
$(function()
{
	$("#invoice-model-list > tr").live('click', function(e)
	{
		e.preventDefault();

		// Reads the id of the invoice
		var invoice_id = $(this).find('.data').attr('data');

		if (invoice_id)
		{
			Backbone.history.navigate("invoice/" + invoice_id, {
				trigger : true
			});
		}
		// App_Subscription.invoiceDetails(data);
	});
	
	$("#charge-model-list > tr").live('click', function(e)
			{
				e.preventDefault();
				var invoice_id = $(this).find('.data').attr('data');
				if (invoice_id)
				{
					window.document.location = "#getInvoiceDetails/"+invoice_id;
				}	
								
	});
});