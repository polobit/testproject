$(function(){
	$('#zoho-import').die().live('click',function(e)
			{
				e.preventDefault();
				var newwindow = window.open("import_zoho.jsp?id=zoho-import", 'name', 'height=420,width=500');
				if (window.focus)
				{
					newwindow.focus();
				}
				return false;
			})
	
});