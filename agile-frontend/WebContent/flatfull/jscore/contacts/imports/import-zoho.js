$(function(){
	
	$('body').on('click', '#zoho-import', function(e)
			{
				e.preventDefault();
				var newwindow = window.open("import_zoho.jsp", 'name', 'height=420,width=500');
				if (window.focus)
				{
					newwindow.focus();
				}
				return false;
			});
	

	

	$('body').on('click', '#zoho-prefs-delete', function(e)
	{
		e.preventDefault();
		var disable = $(this).attr("disabled");
		if (disable)
			return;
		$(this).attr("disabled", "disabled");
		$(this).after(getRandomLoadingImg());
		console.log(App_Widgets.zoho_sync.model.destroy({ success : function()
		{
			App_Widgets.stripe_sync.model.clear();
			App_Widgets.stripe_sync.render(true);
		} }));

	});
	

	
});