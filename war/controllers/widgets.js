/**
 * Creates backbone router to access preferences of the user widgets
 */
var WidgetsRouter = Backbone.Router.extend({
	
	routes : {
		
			"add-widget" : "addWidget",
			
			"Linkedin" : "Linkedin",
			"Linkedin/:id" : "Linkedin",
			
			"Twitter" : "Twitter",
			"Twitter/:id" : "Twitter", 
			
			"Rapleaf" : "Rapleaf",
			"Rapleaf/:id" : "Rapleaf", 
			
			"ClickDesk" : "ClickDesk",
			"ClickDesk/:id" : "ClickDesk", 
			
			"Zendesk" : "Zendesk", 
			"Zendesk/:id" : "Zendesk",
			
			"Sip" : "Sip",
			"Sip/:id" : "Sip",
			
			"Twilio" : "Twilio",
			"Twilio/:id" : "Twilio",
			
			"FreshBooks" : "FreshBooks", 
			"FreshBooks/:id" : "FreshBooks",

			"Stripe" : "Stripe", 
			"Stripe/:id" : "Stripe",

			"Custom-widget" : "Custom",
			"Custom-widget/:id" : "Custom",
			
			"google-apps" : "contactSync",
			"google-apps/contacts" : "google_apps_contacts",
			"google-apps/calendar" : "google_apps_calendar"
	},

	/**
	 * Adds social widgets (twitter, linkedIn and RapLeaf) to a contact
	 */
	addWidget : function()
	{
		$("#content").html(getTemplate("settings"), {});
		pickWidget();
	},

	/**
	 * Manages Linked in widget
	 */
	Linkedin : function(id)
	{
		if (!id)
		{
			show_set_up_widget("Linkedin", 'linkedin-login',
					'/scribe?service=linkedin&return_url=' + encodeURIComponent(window.location.href) + "/linkedin");
		}
		else
		{
			if (!isNaN(parseInt(id)))
			{
				$.getJSON("core/api/widgets/social/profile/" + id, function(data)
				{
					set_up_access(
							"Linkedin",
							'linkedin-login',
							data,
							'/scribe?service=linkedin&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Linkedin/linkedin"));

				}).error(function(data)
				{
					console.log(data);
					setUpError("Linkedin", "widget-settings-error", data.responseText,
							window.location.protocol + "//" + window.location.host + "/#Linkedin/linkedin1");

				});
				return;

			}

			$.getJSON("core/api/widgets/Linkedin", function(data1)
			{
				console.log(data1);

				if (data1)
				{
					$.getJSON("core/api/widgets/social/profile/" + data1.id, function(data)
					{
						set_up_access(
								"Linkedin",
								'linkedin-login',
								data,
								'/scribe?service=linkedin&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Linkedin/linkedin"),
								data1);

					}).error(function(data)
					{

						console.log(data);
						setUpError("Linkedin", "widget-settings-error", data.responseText,
								window.location.protocol + "//" + window.location.host + "/#Linkedin/linkedin1", data1);

					});
					return;
				}
				else
				{
					show_set_up_widget("Linkedin", 'linkedin-login',
							'/scribe?service=linkedin&return_url=' + encodeURIComponent(window.location.href));
				}
		   });

		}

	},

	/**
	 * Manages Twitter widget
	 */
	Twitter : function(id)
	{

		if (!id)
		{
			show_set_up_widget("Twitter", 'twitter-login',
					'/scribe?service=twitter&return_url=' + encodeURIComponent(window.location.href) + "/twitter");
		}
		else
		{
			if (!isNaN(parseInt(id)))
			{
				$.getJSON("core/api/widgets/social/profile/" + id, function(data)
				{
					set_up_access(
							"Twitter",
							'twitter-login',
							data,
							'/scribe?service=twitter&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Twitter/twitter"));

				}).error(function(data)
				{

					console.log(data);
					setUpError("Twitter", "widget-settings-error", data.responseText,
							window.location.protocol + "//" + window.location.host + "/#Twitter/twitter1");

				});
				return;

			}

			$.getJSON("core/api/widgets/Twitter", function(data1)
			{
				console.log(data1);

				if (data1)
				{
					$.getJSON("core/api/widgets/social/profile/" + data1.id, function(data)
					{
						set_up_access(
								"Twitter",
								'twitter-login',
								data,
								'/scribe?service=twitter&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Twitter/twitter"),
								data1);

					}).error(
					function(data)
					{
						setUpError("Twitter", "widget-settings-error", data.responseText,
								window.location.protocol + "//" + window.location.host + "/#Twitter/twitter1", data1);
					});

					return;

				}
				else
				{
					show_set_up_widget("Twitter", 'twitter-login',
							'/scribe?service=twitter&return_url=' + encodeURIComponent(window.location.href));
				}
			});

		}

	},

	/**
	 * Manages Rapleaf widget
	 */
	Rapleaf : function(id)
	{
		if (!id)
			show_set_up_widget("Rapleaf", 'rapleaf-login');
		else
			fill_form(id, "Rapleaf", 'rapleaf-login');
	},

	/**
	 * Manages Clickdesk widget
	 */
	ClickDesk : function(id)
	{
		if (!id)
			show_set_up_widget("ClickDesk", 'clickdesk-login');
		else
			fill_form(id, "ClickDesk", 'clickdesk-login');

	},

	/**
	 * Manages Zendesk widget
	 */
	Zendesk : function(id)
	{
		if (!id)
			show_set_up_widget("Zendesk", 'zendesk-login');
		else
			fill_form(id, "Zendesk", 'zendesk-login');

	},

	/**
	 * Manages Sip widget
	 */
	Sip : function(id)
	{
		if (!id)
			show_set_up_widget("Sip", 'sip-login');
		else
			fill_form(id, "Sip", 'sip-login');

	},

	/**
	 * Manages Twilio widget
	 */
	Twilio : function(id)
	{

		if (!id)
		{
			show_set_up_widget("Twilio", 'twilio-login', encodeURIComponent(window.location.href) + "/twilio");
		}

		else
		{

			if (!isNaN(parseInt(id)))
			{
				$.getJSON("/core/api/widgets/twilio/numbers/" + id, function(data)
				{
					// If data is not defined return
					if (!data)
						return;

					set_up_access("Twilio", 'twilio-login', data,
							encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Twilio/twilio"));

				}).error(
				function(data)
				{
					setUpError("Twilio", "widget-settings-error", data.responseText,
							window.location.protocol + "//" + window.location.host + "/#Twilio/twilio1");
				});

				return;

			}

			$.getJSON("core/api/widgets/Twilio", function(data)
			{
				console.log(data);

				if (data)
				{
					console.log(data);
					$.getJSON("/core/api/widgets/twilio/numbers/" + data.id, function(data1)
					{
						if (!data1)
							return;

						set_up_access("Twilio", 'twilio-login', data1, encodeURIComponent(window.location.href), data);

					}).error(function(data)
					{
						setUpError("Twilio", "widget-settings-error", data.responseText,
								window.location.protocol + "//" + window.location.host + "/#Twilio/twilio1", data);
					});

					return;

				}
				else
				{
					show_set_up_widget("Twilio", 'twilio-login', encodeURIComponent(window.location.href) + "/twilio");
				}
			});

			// window.location.href = "/#add-widget";
		}

	},

	/**
	 * Manages FreshBooks widget
	 */
	FreshBooks : function(id)
	{
		if (!id)
			show_set_up_widget("FreshBooks", 'freshbooks-login');
		else
			fill_form(id, "FreshBooks", 'freshbooks-login');

	},

	/**
	 * Manages Stripe widget
	 */
	Stripe : function(id)
	{

		if (!id)
		{
			show_set_up_widget("Stripe", 'stripe-login', '/scribe?service=stripe&return_url=' + encodeURIComponent(window.location.href) + "/stripe");
		}
		else
		{
			{
				$.getJSON("core/api/custom-fields", function(data)
				{
					set_up_access(
							"Stripe",
							'stripe-login',
							data,
							'/scribe?service=stripe&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Stripe/stripe"));
				});
				return;

			}

			$.getJSON("core/api/widgets/Stripe", function(data1)
			{
				console.log(data1);

				if (data1)
				{
					$.getJSON("core/api/custom-fields", function(data)
					{
						set_up_access(
								"stripe",
								'stripe-login',
								data,
								'/scribe?service=stripe&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Stripe/stripe"),
								data1);
					});
					return;

				}
				else
				{
					show_set_up_widget("Stripe", 'stripe-login',
							'/scribe?service=stripe&return_url=' + encodeURIComponent(window.location.href));
				}
			});
		}
	},
	
	/**
	 * Manages widget added by user
	 */
	Custom : function(id)
	{

	},

	/**
	 * Contact synchronization with Google
	 */
	contactSync : function()
	{

		$("#content").html(getTemplate("settings"), {});

		$('#PrefsTab .active').removeClass('active');
		$('.contact-sync-tab').addClass('active');
		// Gets Social Prefs (Same as Linkedin/Twitter) for Gmail

		this.contact_sync_google = new Base_Model_View({ url : 'core/api/contactprefs/google', template : 'admin-settings-import-google-contacts', });

		// Adds header
		$('#prefs-tabs-content').html(
				'<div id="contact-prefs" class="span4"></div><div id="calendar-prefs" class="span4"></div><div id="email-prefs" class="span3"></div>');

		// Adds Gmail Prefs
		$('#contact-prefs').append(this.contact_sync_google.render().el);

		this.calendar_sync_google = new Base_Model_View({ url : 'core/api/calendar-prefs/get', template : 'import-google-calendar', });

		// console.log(getTemplate("import-google-contacts", {}));
		$('#calendar-prefs').append(this.calendar_sync_google.render().el);

		var data = { "service" : "Gmail", "return_url" : encodeURIComponent(window.location.href) };
		var itemView = new Base_Model_View({ url : '/core/api/social-prefs/GMAIL', template : "settings-social-prefs", data : data });
		itemView.model.fetch();

		// Adds Gmail Prefs
		$('#email-prefs').html(itemView.render().el);

		// Gets IMAP Prefs
		/*
		 * var itemView2 = new Base_Model_View({ url : '/core/api/imap',
		 * template : "settings-imap-prefs" }); // Appends IMAP
		 * $('#prefs-tabs-content').append(itemView2.render().el);
		 * $('#PrefsTab .active').removeClass('active');
		 * $('.email-tab').addClass('active');
		 */
	},

	google_apps_contacts : function()
	{

		$("#content").html(getTemplate("settings"), {});

		$('#PrefsTab .active').removeClass('active');
		$('.contact-sync-tab').addClass('active');

		var options = { url : "core/api/contactprefs/GOOGLE", template : "admin-settings-import-google-contacts-setup", postRenderCallback : function(el)
		{
			console.log(el);
			// App_Settings.setup_google_contacts.model =
			// App_Settings.contact_sync_google.model;
		} };

		var fetch_prefs = true;
		if (this.contact_sync_google && this.contact_sync_google.model)
		{
			options["model"] = this.contact_sync_google.model;
			fetch_prefs = false;
		}
		else
		{
			this.contact_sync_google = new Base_Model_View({ url : 'core/api/contactprefs/google', template : 'import-google-contacts', });
		}

		this.setup_google_contacts = new Base_Model_View(options);

		if (fetch_prefs)
		{
			$("#prefs-tabs-content").html(this.setup_google_contacts.render().el);
			return;
		}
		$("#prefs-tabs-content").html(this.setup_google_contacts.render(true).el);
	},

	google_apps_calendar : function()
	{
		$("#content").html(getTemplate("settings"), {});

		$('#PrefsTab .active').removeClass('active');
		$('.contact-sync-tab').addClass('active');

		var options = {

		url : "core/api/calendar-prefs/get", template : "import-google-calendar-setup" };

		var fetch_prefs = true;
		if (this.calendar_sync_google && this.calendar_sync_google.model)
		{
			options["model"] = this.calendar_sync_google.model;
			fetch_prefs = false;
		}

		this.setup_google_calendar = new Base_Model_View(options);

		if (fetch_prefs)
		{
			$("#prefs-tabs-content").html(this.setup_google_calendar.render().el);
			return;
		}
		$("#prefs-tabs-content").html(this.setup_google_calendar.render(true).el);
	}
	
});
