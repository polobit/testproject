$(function()
{
	console.log("in quickbooks widget.js");
	QUICKBOOKS_PLUGIN_NAME = "QuickBooks";
	QUICKBOOKS_PROFILE_LOAD_IMAGE = '<center><img id="quickbooks_profile_load" src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';
	var c = agile_crm_get_widget(QUICKBOOKS_PLUGIN_NAME);
	QUICKBOOKS_PLUGIN_ID = c.id;
	console.log("plugin Id" + QUICKBOOKS_PLUGIN_ID);
	Email = agile_crm_get_contact_property("email");
	var b = agile_crm_get_contact_property("first_name");
	var a = agile_crm_get_contact_property("last_name");
	console.log("Email is" + Email);
	showQuickbooksContacts();
	$("#quickbooks_add_contact").die().live("click", function(d)
	{
		d.preventDefault();
		addContactToQuickbooks(b, a, Email)
	})
});
function showQuickbooksContacts()
{
	if (!Email)
	{
		quickBooksError("Please provide email for this contact");
		return
	}
	console.log("In show Quickbooks Client" + QUICKBOOKS_PLUGIN_ID);
	queueGetRequest("widget_queue", "/core/api/widgets/quickbooks/contacts/" + QUICKBOOKS_PLUGIN_ID + "/" + Email, "json", function b(d)
	{
		console.log("QuickBooks");
		console.log(d);
		if (d)
		{
			var c = $("#" + QUICKBOOKS_PLUGIN_NAME).html(getTemplate("quickbooks-profile", d));
			console.log("libpath is" + LIB_PATH);
			console.log(c);
			head.js(LIB_PATH + "lib/jquery.timeago.js", function()
			{
				$(".time-ago", c).timeago()
			})
		}
		else
		{
			quickBooksError(d.responseText)
		}
	}, function a(c)
	{
		console.log("In Quickbooks error ");
		console.log(c.responseText);
		if (c.responseText == "Contact not Found")
		{
			$("#" + QUICKBOOKS_PLUGIN_NAME).html(getTemplate("quickbooks-profile-addcontact", {}))
		}
		else
		{
			quickBooksError(c.responseText)
		}
	})
}
function quickBooksError(b)
{
	var a = {};
	a.message = b;
	console.log("error ");
	$("#" + QUICKBOOKS_PLUGIN_NAME).html(getTemplate("quickbooks-error", a))
}
function addContactToQuickbooks(b, a)
{
	console.log("in quickbooks add contact");
	$("#quickbooks_add_contact").attr("disabled", true);
	$.get("/core/api/widgets/quickbooks/add/contact/" + QUICKBOOKS_PLUGIN_ID + "/" + b + "/" + a + "/" + Email, function(c)
	{
		console.log("In Quickbooks add contact ");
		console.log(c);
		if (c.Status = "OK")
		{
			showQuickbooksContacts()
		}
		else
		{
			quickBooksError(c)
		}
		$("#quickbooks_add_contact").removeAttr("disabled")
	})
};