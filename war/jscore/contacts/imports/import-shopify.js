$(function()
{
	$("#import_shopify").die().live('click', function(e)
			{
				e.preventDefault();
				var newwindow = window.open("import_shopify.jsp?id=import_shopify", 'name', 'height=420,width=500');
				if (window.focus)
				{
					newwindow.focus();
				}
				return false;
			})

});