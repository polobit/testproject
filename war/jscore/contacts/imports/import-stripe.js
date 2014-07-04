$(function()
{
	$('#stripe_import').die().live('click', function(e)
	{
		var callbackURL = window.location.href + "/stripeImport";
		console.log(callbackURL);

		// For every request of import, it will ask to grant access
		window.location = "/scribe?service=stripe_import&return_url=" + encodeURIComponent(callbackURL);
		return false;
	});
	
	$('#stripe-import-prefs-delete').die().live('click',function(e){
		e.preventDefault();
		var disable = $(this).attr("disabled");
		if(disable)
			return;
        $(this).attr("disabled", "disabled");
		$(this).after(getRandomLoadingImg());
		console.log(App_Widgets.stripe_sync.model.destroy({success : function(){
			App_Widgets.stripe_sync.model.clear();
			App_Widgets.stripe_sync.render(true);
		}}));
		
	
	
});
	

		


});
