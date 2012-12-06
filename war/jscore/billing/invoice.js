$(function(){
	$("#invoice-model-list > tr").live('click',function(e){
		e.preventDefault();
		
		e.preventDefault();
		var invoice_id = $(this).find('.data').attr('data');
		
		if(invoice_id)
		{
		 Backbone.history.navigate("invoice/" + invoice_id, {
	            trigger: true
	        });
		}
		//App_Subscription.invoiceDetails(data);
	});
});