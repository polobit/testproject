function load_imap_folders(el,model)
{	
	var id = model.id;
	var optionsTemplate = "<option {{selected}}>{{name}}</option>";
	fillSelect('imap-folders-multi-select', '/core/api/imap/'+id+'/imap-folders', 'folders', function fillNew()
	{
		$("#imap-folders-multi-select .default-select",el).remove();					    	
		
	}, optionsTemplate, false, el);	
	var el2 = $(".imap-folders-settings-click",el).closest("div");
	$(".imap-folders-settings-click", el).css("display", "none");
	el2.find(".imap-folders-settings-txt").css("display", "none");
	el2.find(".imap-folders-select").css("display", "inline");
}

function load_imap_properties(model,el)
{
	var id = model.id;
	var optionsTemplate1 = "<option value='{{id}}' {{selected}}>{{name}}</option>";
	var el1 = $('.imap-share-settings-select',el).closest("div");
	fillSelect('imap-share-user-select', 'core/api/imap/shared-to-users?id='+id, 'users', function fillNew()
	{
		$("#imap-share-user-select .default-select",el).remove();	
	    $(".imap-share-select .loading",el).hide();
	}, optionsTemplate1, false, el1);
	
	var el2 = $('.imap-folders-settings-click',el).closest("div");
	var optionsTemplate2 = "<option {{selected}}>{{name}}</option>";
	fillSelect('imap-folders-multi-select', 'core/api/imap/'+id+'/imap-folders', 'folders', function fillNew()
	{
		$("#imap-folders-multi-select .default-select",el).remove();					    	
		
	}, optionsTemplate2, false, el2);			
}

$(function()
{
	/**
	 * Share gmail settings
	 */
	$(".gmail-share-settings-select").die().live('click', function(e)
	{
		e.preventDefault();
		var id = $(this).attr("oid");
		var el = $(this).closest("div");
		$(this).css("display", "none");
		el.find(".gmail-share-select").css("display", "inline");
		el.find(".gmail-share-settings-txt").css("display","none");
		var optionsTemplate = "<option value='{{id}}' {{selected}}>{{name}}</option>";
		fillSelect('#gmail-share-user-select', 'core/api/social-prefs/shared-to-users?id='+id, 'users', function fillNew()
		{
			$("#gmail-share-user-select .default-select",el).remove();
		}, optionsTemplate, false, el);
	});

	/**
	 * To cancel the imap share settings event
	 */
	$(".gmail-share-settings-cancel").die().live('click', function(e)
	{
		e.preventDefault();
		var el = $(this).closest("div");
		var name = $(this).attr('name');
		el.find(".gmail-share-select").css("display", "none");
		el.find(".gmail-share-settings-select").css("display", "inline");
		el.find(".gmail-share-settings-txt").css("display","inline");
	});
	
	/**
	 * Share imap settings with othe users
	 */
	$(".imap-share-settings-select").die().live('click', function(e)
	{
		e.preventDefault();
		var id = $(this).attr("oid");
		var el = $(this).closest("div");
		$(this).css("display", "none");
		el.find(".imap-share-settings-txt").css("display", "none");
		el.find(".imap-share-select").css("display", "inline");
		var optionsTemplate = "<option value='{{id}}' {{selected}}>{{name}}</option>";
		fillSelect('imap-share-user-select', 'core/api/imap/shared-to-users?id='+id, 'users', function fillNew()
		{
			$("#imap-share-user-select .default-select",el).remove();
		}, optionsTemplate, false, el);
	});

	/**
	 * To cancel the imap share settings event
	 */
	$(".imap-share-settings-cancel").die().live('click', function(e)
	{
		e.preventDefault();
		var el = $(this).closest("div");
		var name = $(this).attr('name');
		el.find("#imap-share-user-select").empty();
		el.find(".imap-share-select").css("display", "none");
		el.find(".imap-share-settings-select").css("display", "inline");
		el.find(".imap-share-settings-txt").css("display", "inline");
	});

	/**
	 * Select imap server folder, will fetch mails from these folders
	 */
	$(".imap-folders-settings-click").die().live('click', function(e)
	{
		e.preventDefault();
		var el = $(this).closest("div");
		var id = $(this).attr("oid");
		$(this).css("display", "none");
		el.find(".imap-folders-select").css("display", "inline");
		var optionsTemplate = "<option {{selected}}>{{name}}</option>";
		fillSelect('imap-folders-multi-select', 'core/api/imap/' + id + '/imap-folders', 'folders', function fillNew()
		{
			$("#imap-folders-multi-select .default-select",el).remove();
		}, optionsTemplate, false, el);
	});

	/**
	 * To cancel the imap folder settings
	 */
	$(".imap-folders-settings-cancel").die().live('click', function(e)
	{
		e.preventDefault();
		var el = $(this).closest("div");
		el.find('#imap-folders-multi-select').empty();
		el.find(".imap-folders-select").css("display", "none");
		el.find(".imap-folders-settings-click").css("display", "inline");
	});
	
	/**
	 * Share office settings with other users
	 */
	$(".office-share-settings-select").die().live('click', function(e)
	{
		e.preventDefault();
		var el = $(this).closest("div");
		$(this).css("display", "none");
		var id = $(this).attr("oid");
		el.find(".office-share-settings-txt").css("display","none");
		el.find(".office-share-select").css("display", "inline");
		var optionsTemplate = "<option value='{{id}}' {{selected}}>{{name}}</option>";
		fillSelect('#office-share-user-select', 'core/api/office/shared-to-users?id='+id, 'users', function fillNew()
		{
			$("#office-share-user-select .default-select",el).remove();
		}, optionsTemplate, false, el);
	});

	/**
	 * To cancel the imap share settings event
	 */
	$(".office-share-settings-cancel").die().live('click', function(e)
	{
		e.preventDefault();
		var el = $(this).closest("div");
		var name = $(this).attr('name');
		el.find(".office-share-select").css("display", "none");
		el.find(".office-share-settings-select").css("display", "inline");
		el.find(".office-share-settings-txt").css("display","inline");
	});
});
