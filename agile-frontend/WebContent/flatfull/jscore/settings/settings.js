function load_imap_folders(html)
{
	var el = $(".imap-folders-settings-click",html).closest("div");
	$(".imap-folders-settings-click",html).css("display", "none");
	el.find(".imap-folders-settings-txt").css("display","none");
	el.find(".imap-folders-select").css("display", "inline");
}



$(function()
		{
			$("#saveTheme").die().live("click", function(e){
				e.preventDefault();
				var saveBtn = $(this);

				// Returns, if the save button has disabled
				// attribute
				if ($(saveBtn).attr('disabled'))
					return;

				// Disables save button to prevent multiple click
				// event issues
				disable_save_button($(saveBtn));
				var form_id = $(this).closest('form').attr("id");

				if (!isValidForm('#' + form_id))
				{
					// Removes disabled attribute of save button
					enable_save_button($(saveBtn));
					return false;
				}
				var json = serializeForm(form_id);
				console.log("theme_info"+json);
				$.ajax({
					url: '/core/api/user-prefs/saveTheme',
					type: 'PUT',
					data: json,
					success: function(){
						enable_save_button($(saveBtn));
					},
					error: function(){
						enable_save_button($(saveBtn));
					}
				});
			});
});