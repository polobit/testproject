/**
 * Creates backbone router to access preferences of the user (email templates,
 * email (gmail/IMAP), notifications and etc..).
 */

var HAS_EMAIL_ACCOUNT_LIMIT_REACHED = false;

var EMAIL_PREFS_WIDGET_SIZE = 0;

var SettingsRouter = Backbone.Router
		.extend({

			routes : {

			/* Settings */
			"settings" : "settings",

			/* User preferences */
			"user-prefs/:id" : "userPrefs",

			/* Change Password */
			"change-password" : "changePassword",

			/* Email (Gmail / IMAP) */
			"email" : "email",

			/* IMAP add prefs */
			"imap" : "imapAdd",

			/* IMAP edit prefs */
			"imap/:id" : "imapEdit",

			/* Office add prefs */
			"office" : "officeAdd",

			/* Office edit prefs */
			"office/:id" : "officeEdit",

			/* Social preferences */
			"social-prefs" : "socialPrefs",

			/* Gmail share preferences */
			"gmail/:id" : "gmailShare",

			/* Email templates */
			"email-templates" : "emailTemplates", "email-template-add" : "emailTemplateAdd", "email-template/:id" : "emailTemplateEdit",

			/* Notifications */
			"notification-prefs" : "notificationPrefs",

			/* scheduling */
			"scheduler-prefs" : "scheduler",

			/* support page */
			"help" : "support",

			/* contact-us help email */
			"contact-us" : "contactUsEmail",

			/* Theme & Layout page */
			"themeandlayout" : "themeandlayout" },

			/**
			 * Shows all the options to access user's Preferences
			 */
			/*
			 * settings : function() { var html = getTemplate("settings", {});
			 * $('#content').html(html); // Update Menu
			 * $(".select").removeClass("select");
			 * $("#settingsmenu").addClass("select"); },
			 */

			/**
			 * Creates a Model to show and edit Personal Preferences, and sets
			 * HTML Editor. Reloads the page on save success.
			 */
			userPrefs : function(type)
			{
				var template_name = "settings-user-prefs";
				var tab_class = "profile";
				if(type == "reminders")
				{
					template_name = "settings-reminders";
					tab_class = "reminders";
				}
				else if(type == "advanced")
				{
					template_name = "settings-advanced";
					tab_class = "advanced";

				}


				getTemplate("settings", {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	

					var view = new Base_Model_View({ url : '/core/api/user-prefs', template : "settings-user-prefs", el : $('#prefs-tabs-content'), change : false,
					reload : true, postRenderCallback : function(el)
					{
						initializeSettingsListeners();
						// setup TinyMCE
						setupTinyMCEEditor('textarea#WYSItextarea', true, [
							"textcolor link image preview code"
						], function()
						{

							// Register focus
							register_focus_on_tinymce('WYSItextarea');
						});
					} });

				$('#PrefsTab .select').removeClass('select');
				$('.user-prefs-tab').addClass('select');
				$(".active").removeClass("active");
				$("#prefs-tabs-content .prefs-"+tab_class).addClass("active");
				// $('#content').html(view.render().el);
				}, "#content");
			},

			/**
			 * Creates a Model to show and edit Personal Preferences, and sets
			 * HTML Editor. Reloads the page on save success.
			 */
			changePassword : function()
			{

				getTemplate("settings", {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	
					getTemplate('settings-change-password', {}, undefined, function(template_ui1){
						if(!template_ui1)
							  return;

						$('#prefs-tabs-content').html($(template_ui1));	
						$('#PrefsTab .select').removeClass('select');
						$('.user-prefs-tab').addClass('select');
						$(".active").removeClass("active");

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

					}, "#prefs-tabs-content");

				}, "#content");
			},

			/**
			 * Shows social preferences (LinkedIn and Twitter) to get access.
			 * Loads linkedIn and then appends Twitter to the view
			 */
			socialPrefs : function()
			{
				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));

					var data = { "service" : "linkedin" };
					var itemView = new Base_Model_View({ url : '/core/api/social-prefs/LINKEDIN', template : "settings-social-prefs", data : data, postRenderCallback : function(el){
						initializeSettingsListeners();
					} });

					$('#prefs-tabs-content').html(itemView.render().el);

					data = { "service" : "twitter" };
					var itemView2 = new Base_Model_View({ url : '/core/api/social-prefs/TWITTER', template : "settings-social-prefs", data : data , postRenderCallback : function(el){
						initializeSettingsListeners();
					} });

					$('#prefs-tabs-content').append(itemView2.render().el);
					$('#PrefsTab .select').removeClass('select');
					$('.social-prefs-tab').addClass('select');
					$(".active").removeClass("active");

				}, "#content");
			},

			/**
			 * Shows Gmail and IMAP preferences to get access. Allows to get the
			 * communicated mails between contact and logged in preference.
			 */
			/**
			 * Shows Gmail and IMAP preferences to get access. Allows to get the
			 * communicated mails between contact and logged in preference.
			 */
			email : function()
			{
				var that = this;
				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
						
					$('#content').html($(template_ui));	

					getTemplate('settings-email-prefs', {}, undefined, function(template_ui1){
							if(!template_ui1)
								  return;
							$('#prefs-tabs-content').html($(template_ui1));	
							that.imapListView = {};
							that.officeListView = {};
							that.gmailListView = {};

					}, "#prefs-tabs-content");

					var socialHeight = 0;
					$.getJSON("/core/api/emails/synced-accounts", function(data)
					{
						initializeSettingsListeners();
						if (typeof data !== undefined && data.hasOwnProperty('emailAccountsLimitReached') && data.emailAccountsLimitReached)
							HAS_EMAIL_ACCOUNT_LIMIT_REACHED = true;
						else
							HAS_EMAIL_ACCOUNT_LIMIT_REACHED = false;

						var limit = data.emailAccountsLimit;

						load_gmail_widgets(limit);
						load_imap_widgets(limit);
						load_office365_widgets(limit);

						$('#PrefsTab .select').removeClass('select');
						$('.email-tab').addClass('select');
						$(".active").removeClass("active");
					});

				}, "#content");
			},

			/**
			 * Imap Update settings
			 */
			imapEdit : function(imap_id)
			{
				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));
					if (App_Settings.imapListView === undefined)
					{
						App_Settings.navigate("email", { trigger : true });
						return;
					}

					var imapmodel = App_Settings.imapListView.collection.get(imap_id);
					// Gets IMAP Prefs
					var itemView2 = new Base_Model_View({ url : '/core/api/imap/', model : imapmodel, template : "settings-imap-prefs", change : false,
						postRenderCallback : function(el)
						{
							initializeSettingsListeners();
							var model = itemView2.model;
							var id = model.id;
							itemView2.model.set("password", "");
							load_imap_properties(model, el);
						}, saveCallback : function()
						{
							App_Settings.navigate("email", { trigger : true });
							return;
						} });
					// Appends IMAP
					$('#prefs-tabs-content').html(itemView2.render().el);
					$('#PrefsTab .select').removeClass('select');
					$('.email-tab').addClass('select');
					$(".active").removeClass("active");

				}, "#content");
			},

			/**
			 * Imap Add settings
			 */
			imapAdd : function()
			{
				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	
					// Gets IMAP Prefs
					var itemView2 = new Base_Model_View({ url : '/core/api/imap/', template : "settings-imap-prefs", change : false, isNew : true,
						postRenderCallback : function(el)
						{
							initializeSettingsListeners();
						}, saveCallback : function()
						{
							var model = itemView2.model;
							var json = model.toJSON();
							if (typeof json.isUpdated !== 'undefined' && json.hasOwnProperty('isUpdated') && json.isUpdated)
								App_Settings.navigate("email", { trigger : true });
							else
							{
								itemView2.render(true);
								var el = itemView2.el;
								var model = itemView2.model;
								load_imap_folders(el, model);
							}
						} });
					// Appends IMAP
					$('#prefs-tabs-content').html(itemView2.render().el);
					$('#PrefsTab .select').removeClass('select');
					$('.email-tab').addClass('select');
					$(".active").removeClass("active");

				}, "#content");
			},

			/**
			 * Office Add settings
			 */
			officeAdd : function()
			{
				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	

					// Gets Office Prefs
					var itemView3 = new Base_Model_View({ url : '/core/api/office', template : "settings-office-prefs", isNew : true, change : false,
						postRenderCallback : function(el)
						{
							initializeSettingsListeners();
							itemView3.model.set("password", "");
						}, saveCallback : function()
						{
							// $("#office-prefs-form").find("#office-password").val("");
							App_Settings.navigate("email", { trigger : true });
							return;
						} });
					// Appends Office
					$('#prefs-tabs-content').html(itemView3.render().el);
					$('#PrefsTab .select').removeClass('select');
					$('.email-tab').addClass('select');
					$(".active").removeClass("active");

				}, "#content");
			},

			/**
			 * Office Update settings
			 */
			officeEdit : function(id)
			{
				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	

					if (App_Settings.officeListView === undefined)
					{
						App_Settings.navigate("email", { trigger : true });
						return;
					}

					var office_model = App_Settings.officeListView.collection.get(id);

					// Gets Office Prefs
					var itemView3 = new Base_Model_View({ url : '/core/api/office/', model : office_model, template : "settings-office-prefs",
						postRenderCallback : function(el)
						{
							initializeSettingsListeners();
							itemView3.model.set("password", "");
						}, saveCallback : function()
						{
							// $("#office-prefs-form").find("#office-password").val("");
							App_Settings.navigate("email", { trigger : true });
							return;
						} });

					// Appends Office
					$('#prefs-tabs-content').html(itemView3.render().el);
					$('#PrefsTab .active').removeClass('select');
					$('.email-tab').addClass('select');
					$(".active").removeClass("active");

				}, "#content");
			},

			/**
			 * Gmail sharing settings
			 */
			gmailShare : function(id)
			{
				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	

					if (App_Settings.gmailListView === undefined)
					{
						App_Settings.navigate("email", { trigger : true });
						return;
					}
					var gmail_model = App_Settings.gmailListView.collection.get(id);
					// Gets GMAIL Prefs
					var gmailShareView = new Base_Model_View({ url : 'core/api/social-prefs/share/' + id, model : gmail_model,
						template : "settings-gmail-prefs-share", postRenderCallback : function(el)
						{
							initializeSettingsListeners();

						}, saveCallback : function()
						{
							App_Settings.navigate("email", { trigger : true });
							return;
						} });

					// Appends Gmail
					$('#prefs-tabs-content').html(gmailShareView.render().el);
					$('#PrefsTab .select').removeClass('select');
					$('.email-tab').addClass('select');
					$(".active").removeClass("active");

				}, "#content");
			},

			/**
			 * Shows list of email templates, with an option to add new template
			 */
			emailTemplates : function()
			{
				var that = this;
				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	
					that.emailTemplatesListView = new Base_Collection_View({ url : '/core/api/email/templates', restKey : "emailTemplates",
					templateKey : "settings-email-templates", individual_tag_name : 'tr', postRenderCallback : function(el)
					{
						initializeSettingsListeners();
						head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
						{
							console.log("In email tmplt postrender");
							$(".created_time", el).timeago();
						});
					} });

					that.emailTemplatesListView.collection.fetch();
					$('#prefs-tabs-content').html(that.emailTemplatesListView.el);
					$('#PrefsTab .select').removeClass('select');
					$('.email-templates-tab').addClass('select');
					$(".active").removeClass("active");

				}, "#content");

			},

			/**
			 * Loads a form to add new email-template. Sets HTMLEditor for the
			 * form. Navigates to list of email templates on save success.
			 */
			emailTemplateAdd : function()
			{

				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));
					var view = new Base_Model_View({ url : '/core/api/email/templates', isNew : true, template : "settings-email-template-add",
					window : 'email-templates', postRenderCallback : function()
					{
						initializeEmailTemplateAddListeners();
					} });

					$('#prefs-tabs-content').html(view.render().el);

					// set up TinyMCE Editor
					setupTinyMCEEditor('textarea#email-template-html', false, undefined, function()
					{

						// Reset tinymce
						set_tinymce_content('email-template-html', '');

						// Register focus
						register_focus_on_tinymce('email-template-html');
					});

					$('#PrefsTab .select').removeClass('select');
					$('.email-templates-tab').addClass('select');
					$(".active").removeClass("active");

				}, "#content");
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
				var that = this;
				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	

					// Navigates to list of email templates, if it is not defined
					if (!that.emailTemplatesListView || that.emailTemplatesListView.collection.length == 0)
					{
						that.navigate("email-templates", { trigger : true });
						return;
					}

					// Gets the template form its collection
					var currentTemplate = that.emailTemplatesListView.collection.get(id);

					var view = new Base_Model_View({ url : '/core/api/email/templates', model : currentTemplate, template : "settings-email-template-add",
						window : 'email-templates', postRenderCallback : function()
						{
							initializeEmailTemplateAddListeners();
						} });

					$('#prefs-tabs-content').html(view.render().el);

					/** TinyMCE * */

					// set up TinyMCE Editor
					setupTinyMCEEditor('textarea#email-template-html', false, undefined, function()
					{

						// Insert content into tinymce
						set_tinymce_content('email-template-html', currentTemplate.toJSON().text);

						// Register focus
						register_focus_on_tinymce('email-template-html');
					});

					/** End of TinyMCE* */

					$('#PrefsTab .select').removeClass('select');
					$('.email-templates-tab').addClass('select');
					$(".active").removeClass("active");

				}, "#content");
				if ($('#attachment_id').val())
				{
					var el = $('#tpl-attachment-select').closest("div");
					$('#tpl-attachment-select').hide();
					el.find(".attachment-document-select").css("display", "inline");
					var optionsTemplate = "<option value='{{id}}' network_type='{{titleFromEnums network_type}}' size='{{size}}' url='{{url}}'>{{name}}</option>";
        			fillSelect('attachment-select','core/api/documents', 'documents',  function fillNew()
					{
						el.find("#attachment-select option:first").after("<option value='new'>Upload new doc</option>");
						$('#attachment-select').find('option[value='+$('#attachment_id').val()+']').attr("selected","selected");
						$('.add-tpl-attachment-confirm').trigger("click");
						$('#tpl-attachment-select').hide();
						$('#tpl-attachment-name').show();
					}, optionsTemplate, false, el);
				}
			},

			/**
			 * Creates a Model to show and edit notification preferences.
			 * Reloads the page on save success.
			 */
			notificationPrefs : function()
			{

				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	

					var view = new Base_Model_View({
					url : 'core/api/notifications',
					template : 'settings-notification-prefs',
					reload : true,
					postRenderCallback : function(el)
					{
						initializeSettingsListeners();

						// Update Notification prefs
						notification_prefs = view.model.toJSON();

						console.log("updated notification prefs are...");
						console.log(notification_prefs);

						head.load(CSS_PATH + 'css/bootstrap_switch.css', LIB_PATH + 'lib/bootstrapSwitch.js', LIB_PATH + 'lib/desktop-notify-min.js',
								function()
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
					$('#PrefsTab .select').removeClass('select');
					$('.notification-prefs-tab').addClass('select');
					$(".active").removeClass("active");

				}, "#content");
			},

			/**
			 * Support page
			 */
			support : function()
			{
				load_clickdesk_code();

				getTemplate('support-form', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	
					$(".active").removeClass("active");
					$("#helpView").addClass("active");

					try
					{
						CLICKDESK_Live_Chat
								.onStatus(function(status)
								{

									if (status == "online")
										$("#clickdesk_status")
												.html(
														'Chat with our support representative.<br/> <a class="text-info c-p" onclick="CLICKDESK_LIVECHAT.show();">Start chat</a>.');
									else
										$("#clickdesk_status")
												.html(
														'No chat support representative is available at the moment. Please<br/> <a href="#contact-us" id="show_support">leave a message</a>.');
								});

					}
					catch (e)
					{

						setTimeout(
								function()
								{

									CLICKDESK_Live_Chat
											.onStatus(function(status)
											{

												if (status == "online")
													$("#clickdesk_status")
															.html(
																	'Chat with our support representative.<br/> <a class="text-info c-p" onclick="CLICKDESK_LIVECHAT.show();">Start chat</a>.');
												else
													$("#clickdesk_status")
															.html(
																	'No chat support representative is available at the moment. Please<br/> <a href="#contact-us" id="show_support">leave a message</a>.');
											});

								}, 5000);

					}

					hideTransitionBar();


				}, "#content");
			},

			scheduler : function()
			{
				$('#content').html("<div id='online-cal-listners'>&nbsp;</div>");
				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#online-cal-listners').html($(template_ui));

					var view = new Base_Model_View({
					url : 'core/api/scheduleprefs',
					type : 'GET',
					template : 'settings-business-prefs',
					postRenderCallback : function(el)
					{
						var onlineschedulingURL = "https://" + CURRENT_DOMAIN_USER.domain + ".agilecrm.com/calendar/" + view.model.get('schedule_id');

						$("#scheduleurl").attr("href", onlineschedulingURL);
						$("#scheduleurl").text(onlineschedulingURL);

						$("#scheduleurl").removeClass("nounderline");

						head.js(CSS_PATH + 'css/businesshours/businesshours.css', CSS_PATH + 'css/businesshours/jquerytimepicker.css',
								LIB_PATH + 'lib/businesshours/businesshours.js', LIB_PATH + 'lib/businesshours/jquerytimepicker.js', function()
								{
									var json = JSON.parse(view.model.get('business_hours'));
									console.log();
									businessHoursManager = $("#define-business-hours").businessHours({ operationTime : json,

									postInit : function()
									{
										$('.operationTimeFrom, .operationTimeTill').timepicker({ 'timeFormat' : 'H:i', 'step' : 30 });
									}, });

									$(".mini-time").keydown(false).addClass("form-control");

								});
						
						initializeOnlineCalendarListners(el);

					} });
				$('#prefs-tabs-content').html(view.render().el);
				$('#PrefsTab .select').removeClass('select');
				$('.scheduler-prefs-tab').addClass('select');
				$(".active").removeClass("active");

				}, "#online-cal-listners");
			},

			/**
			 * Contact us email
			 */
			contactUsEmail : function()
			{
				getTemplate('help-mail-form', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	
					$(".active").removeClass("active");
					$("#helpView").addClass("active");

				}, "#content");
			},

			/* theme and layout */

			themeandlayout : function()
			{
				// $("#content").html(getTemplate("theme-layout-form"), {});
				showTransitionBar();
				$
						.ajax({
							url : '/core/api/user-prefs',
							type : 'GET',
							dataType : "json",
							success : function(data)
							{
								getTemplate('theme-layout-form', {}, undefined, function(template_ui){
									if(!template_ui)
										  return;
									$('#content').html($(template_ui));	
									initializeThemeSettingsListeners();
									$("#menuPosition").val(CURRENT_USER_PREFS.menuPosition);
									$("#layout").val(CURRENT_USER_PREFS.layout);
									if (CURRENT_USER_PREFS.animations == true)
										$("#animations").attr('checked', true);
									$('.magicMenu  input:radio[name="theme"]').filter('[value=' + CURRENT_USER_PREFS.theme + ']').attr('checked', true);
									if (data.menuPosition != CURRENT_USER_PREFS.menuPosition || data.layout != CURRENT_USER_PREFS.layout || data.theme != CURRENT_USER_PREFS.theme || data.animations != CURRENT_USER_PREFS.animations)
										$(".theme-save-status").css("display", "inline");
									hideTransitionBar();

								}, "#content");

								
							}, error : function()
							{
								hideTransitionBar();
								showNotyPopUp("information", "error occured please try again", "top");
							} });
				
			}

		});
