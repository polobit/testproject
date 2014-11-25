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
				// Reads the id of the invoice
				var invoice_id = $(this).find('.data').attr('data');
				var invoicedata;
				var companydata;
				var obj;
				
				if (invoice_id)
				{
					$.ajax({
						url: 'core/api/admin_panel/getinvoice?d=' +invoice_id, 
						type : 'GET',
						async : false,
						success : function(data)
						{	
							console.log("Invoice object");
							console.log(data);
							invoicedata = data;
							
						},
						error : function(response)
						{
							showNotyPopUp("information", "error occured please try again", "top");
						}
					}).responseText;
					
					$.ajax({
						url : '/core/api/account-prefs', 
						type : 'GET',
						async : false,
						 dataType: 'json',
						success : function(data)
						{	
							console.log("Account prefs");
							console.log(data);
							companydata = data;
							
						},
						error : function(response)
						{
							showNotyPopUp("information", "error occured please try again", "top");
						}
					}).responseText;
					
					obj = {"invoice" : invoicedata,	"company" : companydata}
					console.log("xxxxxxxxxxxxxxx");
					console.log(obj);
					
					$('#content').html(getTemplate('invoice-detail',obj));
					
				}

				
			});
});