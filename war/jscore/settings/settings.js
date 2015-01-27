function load_imap_folders()
{
	var el = $(".imap-folders-settings-click").closest("div");
	$(".imap-folders-settings-click").css("display", "none");
	el.find(".imap-folders-settings-txt").css("display","none");
	el.find(".imap-folders-select").css("display", "inline");
	var optionsTemplate = "<option {{selected}}>{{name}}</option>";
	fillSelect('#imap-folders-multi-select', 'core/api/imap/imap-folders', 'folders', function fillNew()
	{
		$("#imap-folders-multi-select .default-select").remove();
	}, optionsTemplate, false, el);
}