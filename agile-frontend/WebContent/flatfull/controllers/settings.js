/**
 * Creates backbone router to access preferences of the user (email templates,
 * email (gmail/IMAP and SMTP), notifications and etc..).
 */

var HAS_EMAIL_ACCOUNT_LIMIT_REACHED = false;

var EMAIL_PREFS_WIDGET_SIZE = 0;
var SMTP_ACCOUNT_LIMIT = 0;

var SettingsRouter = Backbone.Router
		.extend({
			routes : {

			/* Settings */
			"settings" : "settings",

			/* User preferences */
			"user-prefs" : "userPrefs",

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

			/* smtp add prefs */
			"smtp" : "smtpAdd",

			/* smtp edit prefs */
			"smtp/:id" : "smtpEdit",

			/* Social preferences */
			"social-prefs" : "socialPrefs",

			/* Gmail share preferences */
			"gmail/:id" : "gmailShare",

			/* Email templates */
			"email-templates" : "emailTemplates", "email-template-add" : "emailTemplateAdd", 
			"email-template/:id" : "emailTemplateEdit",

			"document-templates" : "documentTemplates", "document-template-add" : "documentTemplateAdd", "document-template/:id" : "documentTemplateEdit",

			/* Notifications */
			"notification-prefs" : "notificationPrefs",

			/* scheduling */
			"scheduler-prefs" : "scheduler",

			/* support page */
			"help" : "support",

			/* contact-us help email */
			"contact-us" : "contactUsEmail",

			/* Theme & Layout page */
			"themeandlayout" : "themeandlayout" ,

			/*"help-options" : "helpOptions"*/
		},

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
			userPrefs : function()
			{
				//var data;
				var that =this;
				getTemplate("settings", {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	
					getTemplate("settings-user-prefs-tab", {}, undefined, function(template_ui1){
						if(!template_ui1)
							  return;
						$('#prefs-tabs-content').html($(template_ui1));
					
						/* $('#prefs-tabs-content').html(getRandomLoadingImg()); */

						$.getJSON("/core/api/user-prefs", function(data){

							var prefsData = new BaseModel(data);
							that.userPrefsProfile(prefsData);
							$('#prefs-tabs-content a[href="#settings-user-prefs"]').on('click', function(e) {
								e.preventDefault();
								that.userPrefsProfile(prefsData);
								
							});

							$('#prefs-tabs-content a[href="#settings-reminders"]').on('click', function(e) {
								e.preventDefault();
								that.userPrefsReminders(prefsData);
								
							});
							$('#prefs-tabs-content a[href="#settings-advanced"]').on('click', function(e) {
								e.preventDefault();
								that.userPrefsAdvanced(prefsData);
								
							});

						}).done(function(){
							hideTransitionBar();
						}).fail(function(){
							hideTransitionBar();
						});
							
						$('#PrefsTab .select').removeClass('select');
						$('.user-prefs-tab').addClass('select');
						$(".active").removeClass("active");
						$("#prefs-tabs-content .prefs-profile").addClass("active");
						// $('#content').html(view.render().el);
					}, null);	
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
												"<span style='color:red;margin-left:10px;'>"+_agile_get_translated_val('others','pwds-in-correct')+"</span>");
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
													"<span style='color:green;margin-left:10px;'>" + _agile_get_translated_val('others', 'pwd-change-success') + "</span>").fadeOut(5000);
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
													"<span style='color:red;margin-left:10px;'>" + _agile_get_translated_val("others", "pwd-in-correct") + "</span>");
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
					var itemView = new Settings_Modal_Events({ url : '/core/api/social-prefs/LINKEDIN', template : "settings-social-prefs", data : data, postRenderCallback : function(el){
					} });

					$('#prefs-tabs-content').html(itemView.render().el);

					data = { "service" : "twitter" };
					var itemView2 = new Settings_Modal_Events({ url : '/core/api/social-prefs/TWITTER', template : "settings-social-prefs", data : data , postRenderCallback : function(el){
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
							that.smtpListView = {};

							$('#PrefsTab .select').removeClass('select');
							$('.email-tab').addClass('select');
							$(".active").removeClass("active");

							var emailPrefsTab = _agile_get_prefs("emailprefs_tab");
			                if(!emailPrefsTab || emailPrefsTab == null) {
			                    _agile_set_prefs('emailprefs_tab', "imap-tab");
			                    emailPrefsTab = "imap-tab";
			                }
			                $('#prefs-tabs-content a[href="#'+emailPrefsTab+'"]').tab('show');
			                $("#prefs-tabs-content .tab-container ul li").off("click");
			                $("#prefs-tabs-content").on("click",".tab-container ul li",function(){
								var temp = $(this).find("a").attr("href").split("#");
			                	_agile_set_prefs('emailprefs_tab', temp[1]);
			                });

					}, "#prefs-tabs-content");

					var socialHeight = 0;
					$.getJSON("/core/api/emails/synced-accounts", function(data)
					{
						if (typeof data !== undefined && data.hasOwnProperty('emailAccountsLimitReached') && data.emailAccountsLimitReached)
							HAS_EMAIL_ACCOUNT_LIMIT_REACHED = true;
						else
							HAS_EMAIL_ACCOUNT_LIMIT_REACHED = false;

						SMTP_ACCOUNT_LIMIT = 1;

						var limit = data.emailAccountsLimit;

						load_gmail_widgets(limit);
						load_imap_widgets(limit);
						load_office365_widgets(limit);

						load_smtp_widgets(limit);
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
					var itemView2 = new Settings_Modal_Events({ url : '/core/api/imap/', model : imapmodel, template : "settings-imap-prefs", change : false,
						postRenderCallback : function(el)
						{
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
					var itemView2 = new Settings_Modal_Events({ url : '/core/api/imap/', template : "settings-imap-prefs", change : false, isNew : true,
						postRenderCallback : function(el)
						{
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
					var itemView3 = new Settings_Modal_Events({ url : '/core/api/office', template : "settings-office-prefs", isNew : true, change : false,
						postRenderCallback : function(el)
						{
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
					var itemView3 = new Settings_Modal_Events({ url : '/core/api/office/', model : office_model, template : "settings-office-prefs",
						postRenderCallback : function(el)
						{
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
			 * smtp Add settings
			 */
			smtpAdd : function()
			{
				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	

					// Gets smtp Prefs
					var itemView3 = new Settings_Modal_Events({ url : '/core/api/smtp', template : "settings-smtp-prefs", isNew : true, change : false,
						postRenderCallback : function(el)
						{
							itemView3.model.set("password", "");
						}, saveCallback : function()
						{
							// $("#smtp-prefs-form").find("#smtp-password").val("");
							App_Settings.navigate("email", { trigger : true });
							return;
						} });
					// Appends smtp
					$('#prefs-tabs-content').html(itemView3.render().el);
					$('#PrefsTab .select').removeClass('select');
					$('.email-tab').addClass('select');
					$(".active").removeClass("active");
					$("#server_host").trigger('change');

				}, "#content");
			},

			/**
			 * smtp Update settings
			 */
			smtpEdit : function(id)
			{
				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	

					if (App_Settings.smtpListView === undefined)
					{
						App_Settings.navigate("email", { trigger : true });
						return;
					}

					var smtp_model = App_Settings.smtpListView.collection.get(id);

					// Gets smtp Prefs
					var itemView3 = new Settings_Modal_Events({ url : '/core/api/smtp/', model : smtp_model, template : "settings-smtp-prefs",
						postRenderCallback : function(el)
						{
							itemView3.model.set("password", "");
							$("#server_host").val(smtp_model.server_url);

							if(el.find("div [id = server_host]").val() == "smtp.live.com" || el.find("div [id = server_host]").val() == "smtp.office365.com"){
								el.find("div [id = useSSLCheckboxHolder]").hide();
							}else{
								el.find("div [id = useSSLCheckboxHolder]").show();
							}

						}, saveCallback : function()
						{
							// $("#smtp-prefs-form").find("#smtp-password").val("");
							App_Settings.navigate("email", { trigger : true });
							return;
						} });

					// Appends smtp
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
					var gmailShareView = new Settings_Modal_Events({ url : 'core/api/social-prefs/share/' + id, model : gmail_model,
						template : "settings-gmail-prefs-share", postRenderCallback : function(el)
						{
							
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
			emailTemplates : function(selectedEmailTempCtg, no_load)
			{	

				var that = this;
				// check emailTemplate count
            	$.getJSON(location.origin + '/core/api/email/templates/count', function(count){
					if(!count || count == 0){
						window.location.href  = window.location.origin+"/#emailbuilder-templates";
						return;
					}else{

						getTemplate('settings', {}, undefined, function(template_ui){
							if(!template_ui)
								  return;

							if(!no_load)
							{	
							$('#content').html($(template_ui));
							$("#content").find(".col").hide();
							$("#content").find(".prefs-title").html("Email Templates");
							$("#content").find("#add-new").removeClass("hide");
							}	

							getTemplate('setting-email-templates-header', {}, undefined, function(template_ui){

								if(!template_ui)
								  return;

								if(!no_load){

									$('#prefs-tabs-content').html($(template_ui));
									var el = $("#prefs-tabs-content");
									$(el.find(".col-md-9")).css("padding", "0");

									if(typeof Email_Template_Category != "undefined" && Email_Template_Category){

										$("#emailCtg-option").hide();
										$("#selected-emailTemplate-category").show();
										var defaultSelectOption = '{{agile_lng_translate "portlets" "all"}}';

										var size = Object.keys(Email_Template_Category).length;

										$('#selected-emailTemplate-category').empty().append('<option value="">' + defaultSelectOption + '</option>');
							            for(var i=0;i<size;i++){
							            	if(typeof Selected_Email_Template_Category != "undefined" && Selected_Email_Template_Category == Email_Template_Category[i].id){
							            		$('#selected-emailTemplate-category').append("<option value= "+Email_Template_Category[i].id +" selected = 'selected'>"+Email_Template_Category[i].name+"</option>");
							            	}else{
							            		$('#selected-emailTemplate-category').append("<option value= "+Email_Template_Category[i].id +">"+Email_Template_Category[i].name+"</option>");
							            	}
							            }

							            $('select#selected-emailTemplate-category').on('change',  function(e){
											e.preventDefault();
											var selectedCtg = $(this).val();
											Selected_Email_Template_Category = selectedCtg;
											that.emailTemplates(selectedCtg, true);
										});

									}else{

										el.on('click', '#emailCtgDiv', function(event){
											event.preventDefault();
											var isCtg = $(this).attr("data-id");
											if(isCtg != undefined && isCtg == "new"){
												$(this).removeAttr("data-id");
												$("#emailCtg-option").hide();
												$("#selected-emailTemplate-category").show();
												var defaultSelectOption = '{{agile_lng_translate "portlets" "all"}}';

												$.getJSON("core/api/emailTemplate-category", function(data){
													Email_Template_Category = {};
			               							$('#selected-emailTemplate-category').empty().append('<option value="">' + defaultSelectOption + '</option>');
										            for(var i=0;i<data.length;i++){
										                $('#selected-emailTemplate-category').append("<option value= "+data[i].id +">"+data[i].name+"</option>");
										                
										                var tempObj = {};
										                tempObj["id"] = data[i].id;
										                tempObj["name"] = data[i].name;

										                Email_Template_Category[i] = tempObj;  
										            }

									                $('select#selected-emailTemplate-category').on('change',  function(e){
														e.preventDefault();
														var selectedCtg = $(this).val();
														Selected_Email_Template_Category = selectedCtg;
														that.emailTemplates(selectedCtg, true);
													});
									            });

						        			}

										});
									}

								}
										
								var currUrl = "/core/api/email/templates";
								if(selectedEmailTempCtg && selectedEmailTempCtg != ""){
									currUrl = "/core/api/email/templates/category/"+selectedEmailTempCtg;
								}else if(typeof Email_Template_Category != "undefined" && Email_Template_Category){
									if(typeof Selected_Email_Template_Category != "undefined" && Selected_Email_Template_Category != ""){
										currUrl = "/core/api/email/templates/category/"+Selected_Email_Template_Category;
									}
								}

								that.emailTemplatesListView = new Base_Collection_View({ url : currUrl, restKey : "emailTemplates",
								templateKey : 'settings-email-templates', individual_tag_name : 'tr', postRenderCallback : function(el)
								{
									agileTimeAgoWithLngConversion($("time.campaign-created-time", el));

								},
                                appendItemCallback : function(el)
					            {
						               $("time.campaign-created-time", el).timeago();

					             }
								 });

								that.emailTemplatesListView.collection.fetch();
								$('#prefs-table-content').html(that.emailTemplatesListView.el);
								$('#PrefsTab .select').removeClass('select');
								$('.email-templates-tab').addClass('select');
								make_menu_item_active("email-templates-menu");
							});

						}, "#content");

					}
				});

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
					$("#content").find(".col").hide();
					$("#content").find(".prefs-title").html("Add Email Template");

					var view = new Email_Template_Events({ url : '/core/api/email/templates', isNew : true, template : "settings-email-template-add",
					window : 'email-templates', postRenderCallback : function()
					{
					} });

					$('#prefs-tabs-content').html(view.render().el);

					// set up TinyMCE Editor
					setupTinyMCEEditor('textarea#email-template-html', false, undefined, function()
					{

						// Reset tinymce
						set_tinymce_content('email-template-html', '');

						// Register focus
						register_focus_on_tinymce('email-template-html');

						//To open source code automatically when "Bring Your Code" button is clicked
						if(typeof BRING_YOUR_CODE_BTN != "undefined" && BRING_YOUR_CODE_BTN) {
							$('.mce-i-code').trigger('click');
							BRING_YOUR_CODE_BTN = false;
						}
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
					$("#content").find(".col").hide();
					$("#content").find(".prefs-title").html("Edit Email Template");	

					// Navigates to list of email templates, if it is not defined
					if (!that.emailTemplatesListView || that.emailTemplatesListView.collection.length == 0)
					{
						that.navigate("email-templates", { trigger : true });
						return;
					}

					// Gets the template form its collection
					var currentTemplate = that.emailTemplatesListView.collection.get(id);

					var view = new Email_Template_Events({ url : '/core/api/email/templates', model : currentTemplate, template : "settings-email-template-add",
						window : 'email-templates', postRenderCallback : function()
						{
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
						el.find("#attachment-select option:first").after("<option value='new'>"+_agile_get_translated_val('others','upload-new-doc')+"</option>");
						$('#attachment-select').find('option[value='+$('#attachment_id').val()+']').attr("selected","selected");
						$('.add-tpl-attachment-confirm').trigger("click");
						$('#tpl-attachment-select').hide();
						$('#tpl-attachment-name').show();
					}, optionsTemplate, false, el);
				}
			},

			documentTemplates : function()
			{
				

				var that = this;
				getTemplate("settings", {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	

					that.documentTemplatesListView = new Base_Collection_View({ url : '/core/api/document/templates', 
					templateKey : "settings-document-templates",
					individual_tag_name : 'tr', postRenderCallback : function(el)
					{
						console.log("loaded document template : ", el);
								head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
								{
									
									$(".created_time", el).timeago();
								});
						
					} });
					that.documentTemplatesListView.collection.fetch();

					$('#content').find('#prefs-tabs-content').html(that.documentTemplatesListView.render().el);
					$('#content').find('#PrefsTab .active').removeClass('select');
					$('#content').find('.document-templates-tab').addClass('select');
					
				}, "#content");
			},

			/**
			 * Loads a form to add new document-template. Sets HTMLEditor for the
			 * form. Navigates to list of document templates on save success.
			 */
			documentTemplateAdd : function()
			{

				var that = this;
				getTemplate("settings", {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	

					that.view = new Base_Model_View({url : '/core/api/document/templates', isNew : true, template : "settings-document-template-add",change:false,
					saveAuth:function (el)
					{
						trigger_tinymce_save('document-template-html')
						var sVal1=$("#document-template-html").val()
						if(sVal1.length<=61)
						{
							$(".doc-template-error-status","#userForm").html("This field is required.")
							return false;
						}	
						else
							$(".doc-template-error-status","#userForm").html("");
					},
					saveCallback:function(data){
						if($("#id","#userForm").length==0){
							$("#userForm").append('<input id="id" name="id" type="hidden" value="' + data.id + '" />')	
						}
						showNotyPopUp("information", "Document template saved successfully", "top", 1000);	
					},
					postRenderCallback : function(el)
					{
								// set up TinyMCE Editor
								setupTinyMCEEditor('textarea#document-template-html', false, undefined, function()
								{
									// Reset tinymce
									set_tinymce_content('document-template-html', '');

									// Register focus
									register_focus_on_tinymce('document-template-html');
									//$("#document-template-html_ifr").height("90vh");
								});
						
					} });
					$('#prefs-tabs-content').html(that.view.render().el);

					$('#PrefsTab .active').removeClass('select');
					$('.document-templates-tab').addClass('select');
					
				}, "#content");
			},

			/**
			 * Updates existing document-template. On updation navigates the page
			 * to document-templates list
			 * 
			 * @param id
			 *            DocumentTemplate Id
			 */
			documentTemplateEdit : function(id)
			{

				if (!this.documentTemplatesListView || this.documentTemplatesListView.collection.length == 0)
				{
					this.navigate("document-templates", { trigger : true });
					return;
				}
				var that = this;
				that.currentTemplate = that.documentTemplatesListView.collection.get(id);
				getTemplate("settings", {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	

					that.view = new Base_Model_View({url : '/core/api/document/templates', model : that.currentTemplate, template : "settings-document-template-add",reload : false,change:false,
					saveAuth:function (el)
					{
						
						var plain_content = '';

						try{
							plain_content = $(tinyMCE.activeEditor.getBody()).text();
						}
						catch(err){}

						if(plain_content.trim().length==0)
						{
							$(".doc-template-error-status","#userForm").html("This field is required.")
							return true;
						}	
						else
							$(".doc-template-error-status","#userForm").html("");
					},
					saveCallback:function(data){
						showNotyPopUp("information", "Document template saved successfully", "top", 1000);	
					},
					postRenderCallback : function(el)
					{
								// set up TinyMCE Editor
								setupTinyMCEEditor('textarea#document-template-html', false, undefined, function()
								{
									// Reset tinymce
									set_tinymce_content('document-template-html', that.currentTemplate.toJSON().text);

									// Register focus
									register_focus_on_tinymce('document-template-html');
									//$("#document-template-html_ifr").height("90vh");
								});

								$('.save-doc-template').on('click', function(e) {
									e.preventDefault();
									
								
								});
						
					} });
					$('#prefs-tabs-content').html(that.view.render().el);

					$('#PrefsTab .active').removeClass('select');
					$('.document-templates-tab').addClass('select');
					
				}, "#content");

				
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

					var view = new Settings_Modal_Events({
					url : 'core/api/notifications',
					template : 'settings-notification-prefs',
					reload : true,
					postRenderCallback : function(el)
					{
						// Update Notification prefs
						notification_prefs = view.model.toJSON();

						console.log("updated notification prefs are...");
						console.log(notification_prefs);

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
					template : 'settings-online-calendar-new',
					postRenderCallback : function(el)
					{
						$('#online-calendar a[href="#calendar-tab"]', el).tab('show');
						//online_calendar_tabs.loadScheduleUrlTab("#online-cal-listners");

						var currentDomain = getCurrentDomain();

						var onlineschedulingURL = "https://" + currentDomain + ".agilecrm.com/calendar/" + view.model.get('schedule_id');

						$("#scheduleurl").attr("href", onlineschedulingURL);
						$("#scheduleurl").text(onlineschedulingURL);

						$("#scheduleurl").removeClass("nounderline");

						head.js(CSS_PATH + 'css/businesshours/businesshours.css', CSS_PATH + 'css/businesshours/jquerytimepicker.css',
								LIB_PATH + 'lib/businesshours/businesshours.js', LIB_PATH + 'lib/businesshours/jquerytimepicker.js',LIB_PATH+'lib/summer-note/summernote.js',CSS_PATH+'css/summernote/summernote.css', function()
								{
									var json = JSON.parse(view.model.get('business_hours'));
									
									businessHoursManager = $("#define-business-hours").businessHours({ operationTime : json,
									weekdays : $.fn.datepicker.dates['en'].daysShortExactFromMon,
									postInit : function()
									{
										$('.operationTimeFrom, .operationTimeTill').timepicker({ 'timeFormat' : 'H:i', 'step' : 30 });
									}, });

									$(".mini-time").keydown(false).addClass("form-control");
									
									
									$(".online_summer_note")
								     .summernote({
	
									      toolbar : [
									        [
									          'style',
									          [ 'bold', 'italic', 'underline',
									            'clear' ] ],
									        [ 'fontsize', [ 'fontsize' ] ],
									        [ 'insert', [ 'link' ] ] ],
									        height:'100'
									     });
										 
										 $(".online_summer_note").code(view.model.get('user_calendar_title'));

								});
						
						initializeOnlineCalendarListners(el);

					} });
				$('#prefs-tabs-content').html(view.render().el);
				$('#PrefsTab .select').removeClass('select');
				$('.scheduler-prefs-tab').addClass('select');
				make_menu_item_active("schedulingmenu");
				
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
				getTemplate("settings", {}, undefined, function(template_ui){
										if(!template_ui)
											  return;
										$('#content').html($(template_ui));
									});
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
									$('#prefs-tabs-content').html($(template_ui));	
									initializeThemeSettingsListeners();
									$("#menuPosition").val(CURRENT_USER_PREFS.menuPosition);
									$("#page_size").val(CURRENT_USER_PREFS.page_size);
									$("#layout").val(CURRENT_USER_PREFS.layout);
									if (CURRENT_USER_PREFS.animations == true)
										$("#animations").attr('checked', true);
									$('.magicMenu  input:radio[name="theme"]').filter('[value=' + CURRENT_USER_PREFS.theme + ']').attr('checked', true);
									if (data.page_size != CURRENT_USER_PREFS.page_size || data.menuPosition != CURRENT_USER_PREFS.menuPosition || data.layout != CURRENT_USER_PREFS.layout || data.theme != CURRENT_USER_PREFS.theme || data.animations != CURRENT_USER_PREFS.animations)
										$(".theme-save-status").css("display", "inline");
									hideTransitionBar();
									$('#PrefsTab .select').removeClass('select');
									$('.theme-and-layout').addClass('select');

								}, "#content");

								
							}, error : function()
							{
								hideTransitionBar();
								showNotyPopUp("information", _agile_get_translated_val('billing','error-occured'), "top");
							} });

				/*
				 * var view = new Base_Model_View({ url :
				 * '/core/api/user-prefs', template : "theme-layout-form",
				 * postRenderCallback: function(el){} });
				 * $('#content').html(view.render().el); var data =
				 * view.model.toJSON();
				 * $("#menuPosition").val(CURRENT_USER_PREFS.menuPosition);
				 * $("#layout").val(CURRENT_USER_PREFS.layout); $('.magicMenu
				 * input:radio[name="theme"]').filter('[value='+CURRENT_USER_PREFS.theme+']').attr('checked',
				 * true); if(data.menuPosition !=
				 * CURRENT_USER_PREFS.menuPosition || data.layout !=
				 * CURRENT_USER_PREFS.layout || data.theme !=
				 * CURRENT_USER_PREFS.theme)
				 * $(".theme-save-status").css("display","inline");
				 */

				// $(".active").removeClass("active");
			},

			//preferences profile tab
			userPrefsProfile : function(data)
			{
				var prefs_profile_view = new Base_Model_View({ url : "core/api/user-prefs", model : data, template : "settings-user-prefs", change : false, reload : true,
					postRenderCallback : function(el)
					{	


						setupTinyMCEEditor('textarea#WYSItextarea', true, ["textcolor link image preview code"], function()
								{

									// Register focus
									register_focus_on_tinymce('WYSItextarea');
								});
						
					}});
					$("#settings-user-prefs-tab-content").html(prefs_profile_view.render(true).el);
				
			},

			//preferences reminders tab
			userPrefsReminders : function(data)
			{  var prefs_reminders_view = new Base_Model_View({ url : 'core/api/user-prefs', model : data, template : 'settings-reminders', change : false, reload : true,
				postRenderCallback : function(el, data){
					}
				});
				$("#settings-user-prefs-tab-content").html(prefs_reminders_view.render(true).el);
			},

			//preferences advanced tab
			userPrefsAdvanced : function(data)
			{
				var prefs_advanced_view = new Base_Model_View({ url : 'core/api/user-prefs', model : data, template : 'settings-advanced', change : false, reload : true, 

					postRenderCallback : function(el, data){
						$('[data-toggle="tooltip"]',el).tooltip();
					},saveCallback : function(response){
						console.log(response);
						// Save language cookie
						createCookie("user_lang", response.language, 360);

					}
				});
				$("#settings-user-prefs-tab-content").html(prefs_advanced_view.render(true).el);
			},
			/*helpOptions : function(){
				var that =this;
				getTemplate("prefs-dropdown-options", {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));
					loadLiveChat();
					hideTransitionBar();
				},"#content");
			
			}*/

		});


function getCurrentDomain(options){
	var url = window.location.host;
	var exp = /(\.)/;
	if (url.search(exp) >= 0){
		return url.split(exp)[0];
	}
	return " ";
}

/*function loadLiveChat(){
	$("#prefs-dropdown-options").on('click','#clickdesk_live_chat',function(e){
		e.preventDefault();
		$(this).closest(".dropdown").removeClass("open");
		CLICKDESK_LIVECHAT.show();
	});
}*/
