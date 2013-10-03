$(function()
{
	$("#import_salesforce").die().live('click', function(e)
			{
				e.preventDefault();
				var newwindow = window.open("import_salesforce.jsp?id=import_from_salesforce", 'name', 'height=310,width=500');
				if (window.focus)
				{
					newwindow.focus();
				}
				return false;
			})

});