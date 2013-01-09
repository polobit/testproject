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

		/* Email (Gmail / IMAP) */
		"email" : "email",

		/* Social preferences */
		"social-prefs" : "socialPrefs",

		/* Email templates */
		"email-templates" : "emailTemplates",
		"email-template-add" : "emailTemplateAdd",
		"email-template/:id" : "emailTemplateEdit",

		/* Notifications */
		"notification-prefs" : "notificationPrefs",

		/* contact-us help email */
		"contact-us" : "contactUsEmail"
	},

	/**
	 * Shows all the options to access user's Preferences
	 */
	settings : function() {
		var html = getTemplate("settings", {});
		$('#content').html(html);

		// Update Menu
		$(".active").removeClass("active");
		$("#settingsmenu").addClass("active");
	},

	/**
	 * Creates a Model to show and edit Personal Preferences, and sets HTML
	 * Editor. Reloads the page on save success.
	 */
	userPrefs : function() {
		var view = new Base_Model_View({
			url : '/core/api/user-prefs',
			template : "settings-user-prefs",
			reload : true,
			postRenderCallback : function(el) {
				// Setup HTML Editor
				setupHTMLEditor($('#WYSItextarea'));
			}
		});

		$('#content').html(view.render().el);
	},
	
	/**
	 * Shows social preferences (LinkedIn and Twitter) to get access. Loads
	 * linkedIn and then appends Twitter to the view
	 */
	socialPrefs : function() {
		var data = {
			"service" : "linkedin"
		};
		var itemView = new Base_Model_View({
			url : '/core/api/social-prefs/LINKEDIN',
			template : "settings-social-prefs",
			data : data
		});

		$('#content').html(itemView.render().el);

		data = {
			"service" : "twitter"
		};
		var itemView2 = new Base_Model_View({
			url : '/core/api/social-prefs/TWITTER',
			template : "settings-social-prefs",
			data : data
		});

		$('#content').append(itemView2.render().el);
	},

	/**
	 * Shows Gmail and IMAP preferences to get access. Allows to get the
	 * communicated mails between contact and logged in preference.
	 */
	email : function() {
		
		// Gets Social Prefs (Same as Linkedin/Twitter) for Gmail
		var data = {
			"service" : "gmail",
			"return_url" : encodeURIComponent(window.location.href)
		};
		var itemView = new Base_Model_View({
			url : '/core/api/social-prefs/GMAIL',
			template : "settings-social-prefs",
			data : data
		});

		// Adds Gmail Prefs
		$('#content').html(itemView.render().el);

		// Gets IMAP Prefs
		var itemView2 = new Base_Model_View({
			url : '/core/api/imap',
			template : "settings-imap-prefs"
		});

		// Appends IMAP
		$('#content').append(itemView2.render().el);
	},
	
	/**
	 * Shows list of email templates, with an option to add new template
	 * 
	 */
	emailTemplates : function() {
		this.emailTemplatesListView = new Base_Collection_View({
			url : '/core/api/email/templates',
			restKey : "emailTemplates",
			templateKey : "settings-email-templates",
			individual_tag_name : 'tr'
		});

		this.emailTemplatesListView.collection.fetch();
		$('#content').html(this.emailTemplatesListView.el);
	},
	
	/**
	 * Loads a form to add new email-template. Sets HTMLEditor for the form.
	 * Navigates to list of email templates on save success.
	 */
	emailTemplateAdd : function() {
		var view = new Base_Model_View({
			url : '/core/api/email/templates',
			template : "settings-email-template-add",
			window : 'email-templates',
			postRenderCallback : function(el) {
				
				// Setup HTML Editor
				setupHTMLEditor($('#email-template-html', el));
			}
		});
		$('#content').html(view.render().el);
	},
	
	/**
	 * Updates existing email-template. On updation navigates the page to
	 * email-templates list
	 * 
	 * @param id
	 *            EmailTemplate Id
	 */
	emailTemplateEdit : function(id) {
		
		// Navigates to list of email templates, if it is not defined
		if (!this.emailTemplatesListView
				|| this.emailTemplatesListView.collection.length == 0) {
			    this.navigate("email-templates", {
				trigger : true
			});
			return;
		}
		
		// Gets the template form its collection
		var currentTemplate = this.emailTemplatesListView.collection.get(id);

		var view = new Base_Model_View({
			url : '/core/api/email/templates',
			model : currentTemplate,
			template : "settings-email-template-add",
			window : 'email-templates',
			postRenderCallback : function(el) {
				// Setup HTML Editor
				setupHTMLEditor($('#email-template-html', el));
			}
		});

		var view = view.render();
		$("#content").html(view.el);
	},
	
	/**
	 * Creates a Model to show and edit notification preferences. Reloads the
	 * page on save success.
	 */
	notificationPrefs : function() {

		var view = new Base_Model_View({
			url : 'core/api/notifications',
			template : 'settings-notification-prefs',
			reload : true
		});

		$('#content').html(view.render().el);
	},
	contactUsEmail : function() {
		$("#content").html(getTemplate("help-mail-form"), {});
	}
});
