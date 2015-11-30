/**
 * ical.js is a script file that runs when user clicks on subscribe iCal feed.
 * It fetches apikey and domain name of current user. It appends apikey and
 * domain name to url.
 * 
 * author: Naresh
 */
$("#content").on('click', '#subscribe-ical', function(event)
{
	event.preventDefault();
	set_api_key();
});

/**
 * Fetches APIKey of current user
 * 
 * @method set_api_key
 */
function set_api_key()
{
	var api_key_model = Backbone.Model.extend({ url : 'core/api/api-key' });

	var model = new api_key_model();
	var data = model.fetch({ success : function(data)
	{
		var api_key = data.get('api_key');
		set_url_domain(api_key);
	} });
}
/**
 * 
 * Gets domain of current user using Backbone.
 * 
 * @method set_url_domain
 * @param apiKey -
 *            apiKey of current user.
 */
function set_url_domain(apiKey)
{
	var domain = window.location.hostname.split(".")[0];
	set_url(apiKey, domain);
}

/**
 * 
 * Sets url with domain and apiKey
 * 
 * @method set_url
 * @param apiKey -
 *            apiKey of current user.
 * 
 * @param domain -
 *            domain of current user.
 */
function set_url(apiKey, domain)
{
	var url = "webcal://" + domain + ".agilecrm.com/ical/" + apiKey;
	$('#ical-feed').attr('href', url);
	$('#ical-feed').text(url);
	console.log(url);
}

/**
 * Sends email with ical data to current-user email.
 * 
 * @method send_ical_info_email
 * @param emailModal -
 *            ical-email-modal
 */
function send_ical_info_email(emailModal)
{
	// When Send Clicked, validate the form and send email.
	emailModal.on("shown.bs.modal", function(e){

	$("#share-ical-by-email")
			.on(
					'click',
					'#shareIcalMail',
					function(e)
					{
						e.preventDefault();

						// if not valid
						if (!isValidForm($('#shareIcalMailForm')))
							return;

						var json = serializeForm("shareIcalMailForm");
						json.body = json.body.replace(/\r\n/g, "<br/>");

						var url = 'core/api/emails/send-email?from=' + encodeURIComponent(json.from) + '&to=' + encodeURIComponent(json.to) + '&subject=' + encodeURIComponent(json.subject) + '&body=' + encodeURIComponent(json.body);

						// Shows message
						$save_info = $('<img src="'+updateImageS3Path("img/1-0.gif")+'" height="18px" width="18px"></img>&nbsp;&nbsp;<span><p class="text-success" style="color:#008000; font-size:15px; display:inline-block"> <i>Sending mail...</i></p></span>');
						$("#msg", this.el).append($save_info);
						$save_info.show().delay(2000).fadeOut("slow");

						// Navigates to previous page on sending email
						$.post(url, function()
						{
							emailModal.modal('hide');
						});

					});
		});
}

$(function()
{

	$('#scheduleModal').on('hidden.bs.modal', function(e)
	{
		$("#edit").show();
		$('#charlength').hide();
		$('#specialchar').hide();

	})

	/*
	 * $("body").on('click', '#show-schedule-url', function(e) {
	 * e.preventDefault(); $('#scheduleModal').modal('show'); });
	 */

	$('#scheduleModal').on('show.bs.modal', function()
	{

		var updatedCurrentUser = Backbone.Model.extend({ url : '/core/api/users/current-user', restKey : "domainUser" });

		var updateduserModel = new updatedCurrentUser();

		updateduserModel.fetch({ success : function(data)
		{
			var model = data.toJSON();

			if ($("#scheduleModal").size() > 1)
			{
				$('#scheduleModal').modal('hide').remove();

			}

			var onlineschedulingURL = "https://" + model.domain + ".agilecrm.com/calendar/" + model.schedule_id;
			var hrefvalue = "https://" + model.domain + ".agilecrm.com/calendar/";
			$("#scheduleurl").attr("href", onlineschedulingURL);
			$("#hrefvalue").html(hrefvalue);
			$("#schedule_id").html(model.schedule_id);

			$("#scheduleurl").removeClass("nounderline");

		} });
	});

});

/*
 * $("body").on('click', '#send-schedule-url-email', function(e) {
 * e.preventDefault();
 * 
 * $("#scheduleModal").modal('hide'); // Removes previous modals if exist. if
 * ($('#scheduleModal').size() != 0) $('#scheduleModal').remove();
 * 
 * var emailModal = $(getTemplate("share-schedule-url-by-email", {}));
 * 
 * var description = $(emailModal).find('textarea').val();
 * 
 * description = description.replace(/<br\/>/g, "\r\n");
 * 
 * $(emailModal).find('textarea').val(description);
 * 
 * emailModal.modal('show'); // Send schedule url by email //
 * send_schedule_url_email(emailModal);
 * 
 * });
 */

/**
 * Sends email with ical data to current-user email.
 * 
 * @method send_ical_info_email
 * @param emailModal -
 *            ical-email-modal
 */
/*
 * function send_schedule_url_email(emailModal) { // When Send Clicked, validate
 * the form and send email. $("#icalModal") .on( 'click', '#share-url-email',
 * function(e) { e.preventDefault();
 *  // if not valid if (!isValidForm($('#sharescheduleurlmailForm'))) return;
 * 
 * var json = serializeForm("sharescheduleurlmailForm"); json.body =
 * json.body.replace(/\r\n/g, "<br/>");
 * 
 * var url = 'core/api/emails/send-email?from=' + encodeURIComponent(json.from) +
 * '&to=' + encodeURIComponent(json.to) + '&subject=' +
 * encodeURIComponent(json.subject) + '&body=' + encodeURIComponent(json.body);
 *  // Shows message $save_info = $('<img src="img/1-0.gif" height="18px"
 * width="18px"></img>&nbsp;&nbsp;<span><p class="text-success" style="color:#008000; font-size:15px; display:inline-block">
 * <i>Sending mail...</i></p></span>'); $("#msg",
 * this.el).append($save_info); $save_info.show().delay(2000).fadeOut("slow");
 *  // Navigates to previous page on sending email $.post(url, function() {
 * emailModal.modal('hide'); });
 * 
 * }); }
 */
