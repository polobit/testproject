function load_imap_folders(html)
{
	var el = $(".imap-folders-settings-click",html).closest("div");
	$(".imap-folders-settings-click",html).css("display", "none");
	el.find(".imap-folders-settings-txt").css("display","none");
	el.find(".imap-folders-select").css("display", "inline");
}