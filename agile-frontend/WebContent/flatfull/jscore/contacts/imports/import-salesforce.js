$(function()
{
	$('body').on('click', '#import_salesforce', function(e)
			{
				e.preventDefault();
				var newwindow = window.open("import_salesforce.jsp?id=import_from_salesforce", 'name', 'height=420,width=500');
				if (window.focus)
				{
					newwindow.focus();
				}
				return false;
			})

});