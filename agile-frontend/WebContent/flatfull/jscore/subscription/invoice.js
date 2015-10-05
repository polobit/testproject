/**
 * invoice.js is a script file to navigates to invoice details template if
 * clicked on invoice list element client side.
 * 
 * @module Billing author: Yaswanth
 */
function initializeInvoicesListeners()
{
	$('#invoice-details-holder').on('click', '#invoice-model-list > tr', function(e)
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
	
	/*$('#invoice-details-holder').on('click', '#charge-model-list > tr', function(e)
			{
				e.preventDefault();
				var invoice_id = $(this).find('.data').attr('data');
				if (invoice_id)
				{
					window.document.location = "#getInvoiceDetails/"+invoice_id;
				}	
								
	});*/
}