$(function()
{
	console.log("in xero widget.js");
	Xero_PLUGIN_NAME = "Xero";
	XERO_PROFILE_LOAD_IMAGE = '<center><img id="xero_profile_load" src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';
	var a = agile_crm_get_widget(Xero_PLUGIN_NAME);
	Xero_PLUGIN_ID = a.id;
	console.log("plugin Id" + Xero_PLUGIN_ID);
	if (a.prefs == undefined)
	{
		setupXeroOAuth();
		return
	}
	Email = agile_crm_get_contact_property("email");
	var c = agile_crm_get_contact_property("first_name");
	var b = agile_crm_get_contact_property("last_name");
	showXeroClient();
	$("#xero_add_contact").die().live("click", function(d)
	{
		d.preventDefault();
		addContactToXero(c, b, Email)
	});
	$('.invoices').die().live('click', function(e)
			{
				e.preventDefault();
				var invoiceId = $(this).attr('value');
				if ($('#collapse-' + invoiceId).text().trim() === "")
				{
					console.log("no data present");
					$('#collapse-' + invoiceId).html(XERO_PROFILE_LOAD_IMAGE);
					$.get("/core/api/widgets/xero/lineItems/" + Xero_PLUGIN_ID + "/" + invoiceId, function(data)
					{
						if (data.Status = 'OK')
						{
							console.log("am in success call back")
							$('#collapse-' + invoiceId).html(getTemplate('xero-invoice-lineitems', (JSON.parse(data)).Invoices[0]));
						}
						else
						{
							xeroError(Xero_PLUGIN_NAME, data)
						}
					});
					$('#XERO_PROFILE_LOAD_IMAGE').remove();
				}

				if ($('#collapse-' + invoiceId).hasClass("collapse"))
				{
					$('#collapse-' + invoiceId).removeClass("collapse");
				}
				else
				{
					$('#collapse-' + invoiceId).addClass("collapse");
				}

			});

});
function showXeroClient()
{
	if (!Email)
	{
		xeroError(Xero_PLUGIN_NAME, "Please provide email for this contact");
		return
	}
	console.log("In show Xero Client" + Xero_PLUGIN_ID);
	queueGetRequest("widget_queue", "/core/api/widgets/xero/clients/" + Xero_PLUGIN_ID + "/" + Email, "json", function b(d)
	{
		console.log("In Xero clients");
		console.log(d);
		if (d)
		{
			var c = $("#Xero").html(getTemplate("xero-profile", d));
			console.log("libpath is" + LIB_PATH);
			console.log(c);
			head.js(LIB_PATH + "lib/jquery.timeago.js", function()
			{
				$(".time-ago", c).timeago()
			})
		}
		else
		{
			xeroError(Xero_PLUGIN_NAME, d.responseText)
		}
	}, function a(e)
	{
		console.log("In Xero error ");
		console.log(e);
		$("#XERO_PROFILE_LOAD_IMAGE").remove();
		var d = e.responseText;
		console.log(d);
		if (d.indexOf("No contact found with email address") != -1)
		{
			createContact(d)
		}
		else
		{
			if (d.indexOf("No invoices Exist for this contact") != -1)
			{
				var c = {};
				c.ContactID = e.Contact.ContactID;
				console.log("invoices screen  ");
				$("#" + Xero_PLUGIN_NAME).html(getTemplate("xero-profile-addinvoice", c))
			}
			else
			{
				xeroError("Xero", d)
			}
		}
	})
}
function xeroError(c, b)
{
	var a = {};
	a.message = b;
	console.log("error ");
	$("#" + c).html(getTemplate("xero-error", a))
}
function createContact(b)
{
	var a = {};
	a.message = b;
	console.log("error ");
	$("#" + Xero_PLUGIN_NAME).html(getTemplate("xero-profile-addcontact", a))
}
function addContactToXero(b, a)
{
	console.log("in xero ad contact");
	$("#xero_add_contact").attr("disabled", true);
	$.get("/core/api/widgets/xero/add/contact/" + Xero_PLUGIN_ID + "/" + b + "/" + a + "/" + Email, function(c)
	{
		console.log("In Xero add contact ");
		console.log(c);
		if (c.Status = "OK")
		{
			showXeroClient()
		}
		else
		{
			xeroError(Xero_PLUGIN_NAME, c)
		}
		$("#xero_add_contact").removeAttr("disabled")
	})
};