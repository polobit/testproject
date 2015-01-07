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
			
			/* IMAP prefs */
			"imap" : "imap",
			
			/* Office prefs */
			"office" : "office",			

			/* Social preferences */
			"social-prefs" : "socialPrefs",

			/* Email templates */
			"email-templates" : "emailTemplates", "email-template-add" : "emailTemplateAdd", "email-template/:id" : "emailTemplateEdit",

			/* Notifications */
			"notification-prefs" : "notificationPrefs",
			
			/* scheduling */
			"scheduler-prefs" : "scheduler",
			
			/* support page */
			"help" : "support",
			
			/* contact-us help email */
			"contact-us" : "contactUsEmail"
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
		
		var view = new Base_Model_View({ 
						url : '/core/api/user-prefs', 
						template : "settings-user-prefs", 
						el: $('#prefs-tabs-content'), 
						change: false, 
						reload : true,
						postRenderCallback: function(el)
						{
							// setup TinyMCE
							setupTinyMCEEditor('textarea#WYSItextarea', true, [
								"textcolor link image preview code"
							], function(){
								
								// Register focus
								register_focus_on_tinymce('WYSItextarea');
							});
						}
			 		});
		
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
		$("#saveNewPassword").on("click", function(e) {

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
			$('#changePasswordForm').find('span.save-status').html(getRandomLoadingImg());

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

		$('#prefs-tabs-content').html(getTemplate("settings-email-prefs"), {});
		
		// Gets Social Prefs (Same as Linkedin/Twitter) for Gmail
		var data = { "service" : "Gmail", "return_url" : encodeURIComponent(window.location.href) };
		var itemView = new Base_Model_View({ url : '/core/api/social-prefs/GMAIL', template : "settings-social-prefs", data : data });
		itemView.model.fetch();
		
		// Adds Gmail Prefs
		$('#prefs-tabs-content').find("#social-prefs").html(itemView.render().el);
		
		$.getJSON("/core/api/imap",  function(data){
			$('#prefs-tabs-content').find("#imap-prefs").html($(getTemplate("settings-imap-access", data)));
		});
		
		$.getJSON("/core/api/office",  function(data){
			$('#prefs-tabs-content').find("#office-prefs").html($(getTemplate("settings-office-access", data)));
		});
		
		$('#PrefsTab .active').removeClass('active');
		$('.email-tab').addClass('active');
		
		$("#office-prefs-delete, #imap-prefs-delete").live("click", function(e) {

			e.preventDefault();
			
			var saveBtn = $(this);

			// Returns, if the save button has disabled attribute
			if ($(saveBtn).attr('disabled'))
				return;
			
			if(!confirm("Are you sure you want to delete?"))
	    		return false;
			
			// Disables save button to prevent multiple click event issues
			disable_save_button($(saveBtn));

			var button_id = $(saveBtn).attr("name");

			$.ajax({
				url : '/core/api/' + button_id,
				type : 'DELETE',
				success : function()
				{
					enable_save_button($(saveBtn));
					App_Settings.email();
					return;
				}
			});

		});
	},

	/**
	 * Imap settings
	 */
	imap : function()
	{
		$("#content").html(getTemplate("settings"), {});

		// Gets IMAP Prefs
		var itemView2 = new Base_Model_View({ url : '/core/api/imap', template : "settings-imap-prefs", postRenderCallback : function(el){
			itemView2.model.set("password","");
		}, saveCallback : function(){
/*			$save_info = $('<div style="display:inline-block"><small><p style="color:#2D8130; font-size:14px">Saved Successfully</p></small></div>');

			// Appends error info to form actions block.
			$("#imap-prefs-form").find(".form-actions").append($save_info);

			// Hides the error message after 3 seconds
			$save_info.show().delay(3000).hide(1);*/
			App_Settings.navigate("email", { trigger : true });
			return;
		} });
		
		// Appends IMAP
		$('#prefs-tabs-content').html(itemView2.render().el);
		$('#PrefsTab .active').removeClass('active');
		$('.email-tab').addClass('active');
		
	},
	
	/**
	 * Office settings
	 */
	office : function()
	{
		$("#content").html(getTemplate("settings"), {});
	
		// Gets Office Prefs
		var itemView3 = new Base_Model_View({ url : '/core/api/office', template : "settings-office-prefs", postRenderCallback : function(el){
			itemView3.model.set("password","");
		}, saveCallback : function(){
			$("#office-prefs-form").find("#office-password").val("");
/*			$save_info = $('<div style="display:inline-block"><small><p style="color:#2D8130; font-size:14px">Saved Successfully</p></small></div>');

			// Appends error info to form actions block.
			$("#office-prefs-form").find(".form-actions").append($save_info);

			// Hides the error message after 3 seconds
			$save_info.show().delay(3000).hide(1);*/
			App_Settings.navigate("email", { trigger : true });
			return;
			
		}  });
		
		// Appends Office
		$('#prefs-tabs-content').html(itemView3.render().el);
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
		var view = new Base_Model_View({
		    url: '/core/api/email/templates',
		    isNew: true,
		    template: "settings-email-template-add",
		    window: 'email-templates',
		});
		
		$('#prefs-tabs-content').html(view.render().el);
		
		// set up TinyMCE Editor
		setupTinyMCEEditor('textarea#email-template-html', false, undefined, function(){
			
			// Reset tinymce
			set_tinymce_content('email-template-html', '');		
			
			// Register focus
			register_focus_on_tinymce('email-template-html');
		});
		
		// Fills owner select element
		populateUsers("email-tmplt-owners-list", $("#templatePrefs"), undefined, undefined,
				function(data) {
					$("#templatePrefs").find("#email-tmplt-owners-list").html(data);
					$("#email-tmplt-owners-list", $("#templatePrefs")).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
					$("#email-tmplt-owners-list", $("#templatePrefs")).closest('div').find('.loading-img').hide();
		});
		
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

		var view = new Base_Model_View({
		    url: '/core/api/email/templates',
		    model: currentTemplate,
		    template: "settings-email-template-add",
		    window: 'email-templates'
		});

		$('#prefs-tabs-content').html(view.render().el);
		
		/** TinyMCE **/
		
		// set up TinyMCE Editor
		setupTinyMCEEditor('textarea#email-template-html', false, undefined, function(){
			
			// Insert content into tinymce
			set_tinymce_content('email-template-html', currentTemplate.toJSON().text);			
			
			// Register focus
			register_focus_on_tinymce('email-template-html');
		});
		
		/**End of TinyMCE**/
		
		var value = currentTemplate.toJSON();
		
		// Fills owner select element
		populateUsers("email-tmplt-owners-list", $("#templatePrefs"), value, 'emailTemplateOwner',
				function(data) {
					$("#templatePrefs").find("#email-tmplt-owners-list").html(data);
					if (value.emailTemplateOwner) {
						$("#email-tmplt-owners-list", $("#templatePrefs")).find(
								'option[value=' + value['emailTemplateOwner'].id + ']')
								.attr("selected", "selected");
					}
					$("#email-tmplt-owners-list", $("#templatePrefs")).closest('div').find('.loading-img').hide();
				});
		
		
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
				
				// Update Notification prefs
				notification_prefs = view.model.toJSON();
				
				console.log("updated notification prefs are...");
				console.log(notification_prefs);
				
				head.load(CSS_PATH + 'css/bootstrap_switch.css', LIB_PATH + 'lib/bootstrapSwitch.js', LIB_PATH + 'lib/desktop-notify-min.js', function()
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
	 * Support page
	 */
	support : function()
	{
		$("#content").html(getTemplate("support-form"), {});
	/*	var CLICKDESK_Live_Chat  = "offline";
		try {
				CLICKDESK_Live_Chat.onStatus(function(status) {

					if(status == "online")
						$("#clickdesk_status").html('Chat with our support representative.<br/> <a style="cursor:pointer" onclick="clickdesk_show_livechat_popup();">Start chat</a>.');
					else
						$("#clickdesk_status").html('No chat support representative is available at the moment. Please<br/> <a href="#contact-us" id="show_support">leave a message</a>.');
				});
			
		} catch (e) {
			
			setTimeout(function(){
				
				CLICKDESK_Live_Chat.onStatus(function(status) {

					if(status == "online")
						$("#clickdesk_status").html('Chat with our support representative.<br/> <a style="cursor:pointer" onclick="clickdesk_show_livechat_popup();">Start chat</a>.');
					else
						$("#clickdesk_status").html('No chat support representative is available at the moment. Please<br/> <a href="#contact-us" id="show_support">leave a message</a>.');
				});
				
			}, 5000);
			
			
		}*/
		$("#clickdesk_status").html('No chat support representative is available at the moment. Please<br/> <a href="#contact-us" id="show_support">leave a message</a>.');
	},
	
	scheduler : function()
	{
		$("#content").html(getTemplate("settings"), {});
		var view = new Base_Model_View({
			url : 'core/api/users/current-user',
			template : 'settings-business-prefs',
			postRenderCallback : function(el)
			{
				var onlineschedulingURL = "https://" + view.model.get('domain') + ".agilecrm.com/calendar/" + view.model.get('schedule_id');
				var hrefvalue="https://"+view.model.get('domain')+".agilecrm.com/calendar/";
				$("#scheduleurl").attr("href", onlineschedulingURL);
				$("#hrefvalue").html(hrefvalue);
				$("#schedule_id").html(view.model.get('schedule_id'));
				
				$("#scheduleurl").removeClass("nounderline");
				
				head.js(CSS_PATH + 'css/businesshours/businesshours.css',CSS_PATH + 'css/businesshours/jquerytimepicker.css', LIB_PATH + 'lib/businesshours/businesshours.js',LIB_PATH + 'lib/businesshours/jquerytimepicker.js', function()
						{
					var json=JSON.parse(view.model.get('business_hours'));
					console.log();
					 businessHoursManager = 
						 $("#define-business-hours").businessHours({
			                    operationTime:json,/* array of JSON objects */
			                    
			                    postInit:function(){
			                        $('.operationTimeFrom, .operationTimeTill').timepicker({
			                            'timeFormat': 'H:i',
			                            'step': 30
			                            });
			                    },
			                });
			            
			     
					 $(".mini-time").keydown(false);
					 
				});
				
                
			} });
		$('#prefs-tabs-content').html(view.render().el);
		$('#PrefsTab .active').removeClass('active');
		$('.scheduler-prefs-tab').addClass('active');

	},

	/**
	 * Contact us email
	 */
	contactUsEmail : function()
	{
		//$("#content").html(getTemplate("help-mail-form", CURRENT_DOMAIN_USER));
		$("#content").html(getTemplate("help-mail-form"), {});
	}

});