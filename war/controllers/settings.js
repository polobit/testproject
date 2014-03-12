/**
 * Creates backbone router to access preferences of the user (email templates,
 * email (gmail/IMAP), notifications and etc..).
 */
var SettingsRouter = Backbone.Router.extend({

	routes : {
		
			/* Settings */
			"settings" : "settings",

			/* User preferences */
			"user-prefs" : "userPrefs",

			/* Change Password */
			"change-password" : "changePassword",

			/* Email (Gmail / IMAP) */
			"email" : "email",

			/* Social preferences */
			"social-prefs" : "socialPrefs",

			/* Email templates */
			"email-templates" : "emailTemplates", "email-template-add" : "emailTemplateAdd", "email-template/:id" : "emailTemplateEdit",

			/* Notifications */
			"notification-prefs" : "notificationPrefs",
			
			/* contact-us help email */
			"contact-us" : "contactUsEmail",
	},

	/**
	 * Shows all the options to access user's Preferences
	 */
	/*
	 * settings : function() { var html = getTemplate("settings", {});
	 * $('#content').html(html); // Update Menu
	 * $(".active").removeClass("active");
	 * $("#settingsmenu").addClass("active"); },
	 */

	/**
	 * Creates a Model to show and edit Personal Preferences, and sets
	 * HTML Editor. Reloads the page on save success.
	 */
	userPrefs : function()
	{
		$("#content").html(getTemplate("settings"), {});
		var view = new Base_Model_View({ url : '/core/api/user-prefs', template : "settings-user-prefs", reload : true,
			postRenderCallback : function(el)
			{
				// Setup HTML Editor
				setupHTMLEditor($('#WYSItextarea'));
			} });
		$('#prefs-tabs-content').html(view.render().el);
		$('#PrefsTab .active').removeClass('active');
		$('.user-prefs-tab').addClass('active');
		// $('#content').html(view.render().el);
	},

	/**
	 * Creates a Model to show and edit Personal Preferences, and sets
	 * HTML Editor. Reloads the page on save success.
	 */
	changePassword : function()
	{
		$("#content").html(getTemplate("settings"), {});

		$('#prefs-tabs-content').html(getTemplate("settings-change-password"), {});
		$('#PrefsTab .active').removeClass('active');
		$('.user-prefs-tab').addClass('active');

		// Save button action of change password form, If it is out of
		// this router wont navigate properly
		$("#saveNewPassword").on(
				"click",
				function(e)
				{

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
					// Returns if same password is given
					if ($("#current_pswd").val() == $("#new_pswd").val())
					{
						$('#changePasswordForm').find('span.save-status').html(
								"<span style='color:red;margin-left:10px;'>Current and New Password can not be the same</span>");
						$('#changePasswordForm').find('span.save-status').find("span").fadeOut(5000);
						enable_save_button($(saveBtn));
						return false;
					}

					// Show loading symbol until model get saved
					$('#changePasswordForm').find('span.save-status').html(LOADING_HTML);

					var json = serializeForm(form_id);

					$.ajax({
						url : '/core/api/user-prefs/changePassword',
						type : 'PUT',
						data : json,
						success : function()
						{
							$('#changePasswordForm').find('span.save-status').html(
									"<span style='color:green;margin-left:10px;'>Password changed successfully</span>").fadeOut(5000);
							enable_save_button($(saveBtn));
							$('#' + form_id).each(function()
							{
								this.reset();
							});
							history.back(-1);
						},
						error : function(response)
						{
							$('#changePasswordForm').find('span.save-status').html("");
							$('#changePasswordForm').find('input[name="current_pswd"]').closest(".controls").append(
									"<span style='color:red;margin-left:10px;'>Incorrect Password</span>");
							$('#changePasswordForm').find('input[name="current_pswd"]').closest(".controls").find("span").fadeOut(5000);
							$('#changePasswordForm').find('input[name="current_pswd"]').focus();
							enable_save_button($(saveBtn));
						} });

				});
	},

	/**
	 * Shows social preferences (LinkedIn and Twitter) to get access.
	 * Loads linkedIn and then appends Twitter to the view
	 */
	socialPrefs : function()
	{
		$("#content").html(getTemplate("settings"), {});
		var data = { "service" : "linkedin" };
		var itemView = new Base_Model_View({ url : '/core/api/social-prefs/LINKEDIN', template : "settings-social-prefs", data : data });

		$('#prefs-tabs-content').html(itemView.render().el);

		data = { "service" : "twitter" };
		var itemView2 = new Base_Model_View({ url : '/core/api/social-prefs/TWITTER', template : "settings-social-prefs", data : data });

		$('#prefs-tabs-content').append(itemView2.render().el);
		$('#PrefsTab .active').removeClass('active');
		$('.social-prefs-tab').addClass('active');
	},

	/**
	 * Shows Gmail and IMAP preferences to get access. Allows to get the
	 * communicated mails between contact and logged in preference.
	 */
	email : function()
	{
		$("#content").html(getTemplate("settings"), {});
		// Gets Social Prefs (Same as Linkedin/Twitter) for Gmail
		var data = { "service" : "Gmail", "return_url" : encodeURIComponent(window.location.href) };
		var itemView = new Base_Model_View({ url : '/core/api/social-prefs/GMAIL', template : "settings-social-prefs", data : data });
		itemView.model.fetch();

		// Adds header
		$('#prefs-tabs-content').html("<div><h3><strong>Link your Email Account</strong></h3><br/></div>");

		// Adds Gmail Prefs
		$('#prefs-tabs-content').append(itemView.render().el);

		// Gets IMAP Prefs
		var itemView2 = new Base_Model_View({ url : '/core/api/imap', template : "settings-imap-prefs" });

		// Appends IMAP
		$('#prefs-tabs-content').append(itemView2.render().el);
		$('#PrefsTab .active').removeClass('active');
		$('.email-tab').addClass('active');
	},

	/**
	 * Shows list of email templates, with an option to add new template
	 */
	emailTemplates : function()
	{
		$("#content").html(getTemplate("settings"), {});
		this.emailTemplatesListView = new Base_Collection_View({ url : '/core/api/email/templates', restKey : "emailTemplates",
			templateKey : "settings-email-templates", individual_tag_name : 'tr' });

		this.emailTemplatesListView.collection.fetch();
		$('#prefs-tabs-content').html(this.emailTemplatesListView.el);
		$('#PrefsTab .active').removeClass('active');
		$('.email-templates-tab').addClass('active');
		// $('#content').html(this.emailTemplatesListView.el);
	},

	/**
	 * Loads a form to add new email-template. Sets HTMLEditor for the
	 * form. Navigates to list of email templates on save success.
	 */
	emailTemplateAdd : function()
	{
		$("#content").html(getTemplate("settings"), {});
		var view = new Base_Model_View({ url : '/core/api/email/templates', template : "settings-email-template-add", window : 'email-templates',
			postRenderCallback : function(el)
			{

				// Setup HTML Editor
				setupHTMLEditor($('#email-template-html', el));
			} });
		$('#prefs-tabs-content').html(view.render().el);
		$('#PrefsTab .active').removeClass('active');
		$('.email-templates-tab').addClass('active');
		// $('#content').html(view.render().el);
	},

	/**
	 * Updates existing email-template. On updation navigates the page
	 * to email-templates list
	 * 
	 * @param id
	 *            EmailTemplate Id
	 */
	emailTemplateEdit : function(id)
	{
		$("#content").html(getTemplate("settings"), {});
		// Navigates to list of email templates, if it is not defined
		if (!this.emailTemplatesListView || this.emailTemplatesListView.collection.length == 0)
		{
			this.navigate("email-templates", { trigger : true });
			return;
		}

		// Gets the template form its collection
		var currentTemplate = this.emailTemplatesListView.collection.get(id);

		var view = new Base_Model_View({ url : '/core/api/email/templates', model : currentTemplate, template : "settings-email-template-add",
			window : 'email-templates', postRenderCallback : function(el)
			{
				// Setup HTML Editor
				setupHTMLEditor($('#email-template-html', el));
			} });

		var view = view.render();
		$('#prefs-tabs-content').html(view.el);
		$('#PrefsTab .active').removeClass('active');
		$('.email-templates-tab').addClass('active');
		// $("#content").html(view.el);
	},

	/**
	 * Creates a Model to show and edit notification preferences.
	 * Reloads the page on save success.
	 */
	notificationPrefs : function()
	{
		$("#content").html(getTemplate("settings"), {});
		var view = new Base_Model_View({ url : 'core/api/notifications', template : 'settings-notification-prefs', reload : true,
			postRenderCallback : function(el)
			{
				head.load(CSS_PATH + 'css/bootstrap_switch.css', LIB_PATH + 'lib/bootstrapSwitch.js', function()
				{
					showSwitchChanges(el);
					check_browser_notification_settings(el);
				});
				try
				{
					$('#notification-switch', el).bootstrapSwitch();
				}
				catch (err)
				{
					console.log(err);
				}

				// plays notification sounds
				notification_play_button()

				// to show notification-switch in safari properly
				if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1)
					$('#notification-switch').parent().css('margin-top', '-32px');
			} });
		$('#prefs-tabs-content').html(view.render().el);
		$('#PrefsTab .active').removeClass('active');
		$('.notification-prefs-tab').addClass('active');
		// $('#content').html(view.render().el);
	},

	/**
	 * Contact us email
	 */
	contactUsEmail : function()
	{
		$("#content").html(getTemplate("help-mail-form", CURRENT_DOMAIN_USER));
	}

});
