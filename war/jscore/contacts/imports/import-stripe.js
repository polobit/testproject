$(function(){
	$('#stripe-import').die().live('click',function(e)
			{
				e.preventDefault();
				var newwindow = window.open("import_stripe.jsp?id=stripe-import", 'name', 'height=420,width=500');
				if (window.focus)
				{
					newwindow.focus();
				}
				return false;
			})
	
});