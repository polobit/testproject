/**
 * Creates a backbone router to perform admin activities (account preferences,
 * users management, custom fields, milestones and etc..).
 * 
 */
var view = {};
var SHOW_SSO_FORM = false;
var AdminSettingsRouter = Backbone.Router.extend({
	routes : {
	/* Admin-Settings */
	"admin" : "adminSettings",

	/* Account preferences */
	"account-prefs" : "accountPrefs",

	"account-ipaccess" : "ipaccess",

	/* Users */
	"users" : "users", "users-add" : "usersAdd", "user-edit/:id" : "userEdit",

	/* Custom fields */
	"custom-fields" : "customFields",

	/* Api & Analytics */
	"analytics-code" : "analyticsCode", "analytics-code/:id" : "analyticsCode",

	/* Milestones */
	"milestones" : "milestones",
	
	/* Products */
	"products" : "products", "product-add" : "productsAdd", "product-edit/:id" : "productEdit",

	/* telepnony */
	"telephony" : "telephony",
	
	/* Categories */
	"categories" : "categories",

	/* Menu settings - select modules on menu bar */
	"menu-settings" : "menu_settings",

	/* Mandrill Email Activity */
	/* "email-stats" : "emailStats", */

	/* Integrations Stats */
	"integrations-stats" : "integrationsStats",

	/* Web to Lead */
	"integrations" : "integrations",

	"tag-management" : "tagManagement",

	"email-gateways/:id" : "emailGateways",

	"sms-gateways/:id" : "smsGateways",

	"recaptcha-gateways/:id" : "recaptchaGateway",

	"lost-reasons" : "lostReasons",

	"deal-sources" : "dealSources",
	
	"goals": "dealGoal",
	
	/* Webhook */
	"webhook" : "webhookSettings",

	"change-domain" : "changeDomain",

	/* Java Script API Permission*/
	"js-security" : "jsSecuritySettings",

	/* SSO Login */
	"sso-login" : "ssoLoginSettings",

	"api-analytics" : "apiAnalyticsCode","api-analytics/:id" : "apiAnalyticsCode",


	},

	/**
	 * Show menu-settings modules selection ( calendar, cases, deals, campaign ) &
	 * saving option
	 * 
	 * @author Chandan
	 */
	menu_settings : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			getTemplate('others-not-allowed', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
			}, "#content");

			return;
		}

		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;

			$('#content').html($(template_ui));	

			var view = new Base_Model_View({ url : '/core/api/menusetting', template : "admin-settings-menu-settings", reload : true });
			$('#content').find('#admin-prefs-tabs-content').html(view.render().el);
			$('#content').find('#AdminPrefsTab .select').removeClass('select');
			$('#content').find('.menu-settings-tab').addClass('select');

		}, "#content");

		$(".active").removeClass("active");
	},

	/**
	 * Loads a template to show account preferences, with "subscription" option
	 * to change the plan
	 */
	accountPrefs : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			getTemplate('others-not-allowed', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
			}, "#content");

			return;
		}
		var that=this;
		$('#content').html("<div id='account-pref'>&nbsp;</div>");
		
		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#account-pref').html($(template_ui));
			$('#account-pref').find('#admin-prefs-tabs-content').html(getTemplate("settings-account-tab"), {});	
			var view = new AccountPrefs_Events_Model_View({ url : '/core/api/account-prefs', template : "admin-settings-account-prefs",
			prePersist : function(model){
				/*console.log(model);
				var accountCurrency = ACCOUNT_PREFS.currency.substring(0, 3);
				var changedCurrency = model.get('currency').substring(0, 3);
				if(accountCurrency && changedCurrency && accountCurrency != changedCurrency){
					showModalConfirmation(
						"Admin Settings",
						"Changing currency will affect deal reporting. Do you want to change the currency?",
						function()
						{
							model.get('currency') = ACCOUNT_PREFS.currency ; 
						},function()
						{
							return;
						}, function()
						{
							return;
						}, "Yes", "No");
				}*/
			},
			postRenderCallback : function()
			{
				ACCOUNT_DELETE_REASON_JSON = undefined;
				if(ACCOUNT_PREFS.plan.plan_type.split("_")[0] == "PRO" || ACCOUNT_PREFS.plan.plan_type.split("_")[0] == "ENTERPRISE")
					$('#account-pref').find('#accountPrefs').find('#multi-currency-deals').removeClass('hidden');
				
			},saveCallback : function(){
				location.reload(true);
			} });

			

			$('#account-pref').find('#admin-prefs-tabs-content').find('#settings-account-tab-content').html(view.render().el);
			$('#account-pref').find('#AdminPrefsTab .select').removeClass('select');
			$('#account-pref').find('.account-prefs-tab').addClass('select');
			$(".active").removeClass("active");
			$('.settings-account-prefs').addClass('active');
			$('#account-pref').find('#admin-prefs-tabs-content').parent().removeClass('bg-white');


		}, "#account-pref");

		$('.settings-account-prefs').addClass('active');
		$('#account-pref').find('#admin-prefs-tabs-content').parent().removeClass('bg-white');
		
	},


	ipaccess : function()
	{

		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html(getTemplate('others-not-allowed',{}));
			return;
		}
		var that = this;
		$('#content').html("<div id='account-pref'>&nbsp;</div>");
		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
				
			$('#account-pref').html($(template_ui));
			$('#account-pref').find('#admin-prefs-tabs-content').html(getTemplate("settings-account-tab"), {});
			var view = new Base_Model_View({ url : '/core/api/allowedips', template : "admin-settings-ip-prefs",
				postRenderCallback : function(el)
				{
					loadip_access_events();
					
				}, saveCallback : function(){
				console.log("saveCallback");
				showNotyPopUp("information", _agile_get_translated_val('security','ip-added'), "top", 4000);
				App_Admin_Settings.ipaccess();
			},errorCallback : function(data){
				showNotyPopUp("warning", data.responseText, "top");
			}

				 });
			
			$('#content').find('#admin-prefs-tabs-content').find('#settings-account-tab-content').html(view.render().el);
			$('#content').find('#AdminPrefsTab .select').removeClass('select');
			$('#content').find('.account-prefs-tab').addClass('select');
			$(".active").removeClass("active");
			$('.settings-account-ips').addClass('active');
			$('#account-pref').find('#admin-prefs-tabs-content').parent().removeClass('bg-white');
			//$('.settings-account-ips').parent().removeClass('b-b-none');

		}, "#account-pref");
	},

	
	webhookSettings : function()
	{
		
		
			var view = new Base_Model_View({ url : '/core/api/webhooksregister', template : "admin-settings-webhook", 
			no_reload_on_delete : true,
			postRenderCallback : function()
			{
				
			}, 
			form_custom_validate : function(){
				$(".checkedMultiCheckbox").find(".help-inline").remove();
                if($(".checkedMultiCheckbox").find('input:checked').length > 0)
                      return true;
                else{
                    $(".checkedMultiCheckbox").append("<span generated='true' class='help-inline col-sm-offset-4 col-xs-offset-4 controls col-sm-8 col-xs-8' style='display: block;'>" +_agile_get_translated_val('validation-msgs', 'select-atleast-one')+ "</span>"); 
                }
                
                 return false;
			}, saveCallback : function(){
				console.log("saveCallback");
				App_Admin_Settings.webhookSettings();
				showNotyPopUp("information", _agile_get_translated_val('others', 'prefs-saved-success'), "top", 1000);
			},
			errorCallback : function(data){
				showNotyPopUp("warning", data.responseText, "top",2000);
			},
			deleteCallback : function(){
				console.log("deleteCallback");
				App_Admin_Settings.webhookSettings();
			} });

			$('#content').find('#webhook-accordian-template').html(view.render().el);
	
	},


	jsSecuritySettings : function()
	{
		
		
			var view = new Base_Model_View({ url : '/core/api/jspermission/', template : "admin-settings-js-security", 
			no_reload_on_delete : true,
			postRenderCallback : function()
			{
				
			}, 
			form_custom_validate : function(){
				$(".checkedMultiCheckbox").find(".help-inline").remove();
                if($(".checkedMultiCheckbox").find('input:checked').length > 0)
                      return true;
                else{
                    $(".checkedMultiCheckbox").append("<span generated='true' class='help-inline col-sm-offset-4 col-xs-offset-4 controls col-sm-8 col-xs-8' style='display: block;'>" +_agile_get_translated_val('validation-msgs', 'select-atleast-one')+ "</span>"); 
                }
                
                 return false;
			}, saveCallback : function(){
				console.log("saveCallback");
				App_Admin_Settings.jsSecuritySettings();
				showNotyPopUp("information", _agile_get_translated_val('others', 'prefs-saved-success'), "top", 1000);
			} });

			$('#content').find('#js-security-accordian-template').html(view.render().el);
	
	},

	ssoLoginSettings : function()
	{
			
			if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html(getTemplate('others-not-allowed',{}));
			return;
		}
		var that = this;
		$('#content').html("<div id='account-pref'>&nbsp;</div>");
		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
				
			$('#account-pref').html($(template_ui));
			$('#account-pref').find('#admin-prefs-tabs-content').html(getTemplate("settings-account-tab"), {});
			//var show_sso_form = _agile_get_prefs("show-sso-form");

			that.view = new Base_Model_View({ url : '/core/api/sso/jwt', template : "admin-settings-sso-login",
			postRenderCallback : function(data)
			{
				var resp = that.view.model.toJSON();
				showSSO();
				if(resp.url != undefined && resp.url != null){
					$(".showsso").removeClass("hide");
					$(".sso-btn").addClass("hide");
				
				}
				else{
					if(SHOW_SSO_FORM){
						$(".showsso").removeClass("hide");
						$(".sso-btn").addClass("hide");
					}
				}
				
			},saveCallback : function(data){
				console.log("saveCallback");
				App_Admin_Settings.ssoLoginSettings();
				showNotyPopUp("information", _agile_get_translated_val('others', 'prefs-saved-success'), "top", 1000);
			},
			deleteCallback : function(){
				console.log("deleteCallback");
				SHOW_SSO_FORM = false;
				App_Admin_Settings.ssoLoginSettings();
			} });
			
			$('#content').find('#admin-prefs-tabs-content').find('#settings-account-tab-content').html(that.view.render().el);
			$('#content').find('#AdminPrefsTab .select').removeClass('select');
			$('#content').find('.account-prefs-tab').addClass('select');
			$(".active").removeClass("active");
			$('.settings-sso-login').addClass('active');
			$('#account-pref').find('#admin-prefs-tabs-content').parent().removeClass('bg-white');
			//$('.settings-sso-login').parent().removeClass('b-b-none');

		}, "#account-pref");

	},
	
	/**
	 * Shows list of all the users with an option to add new user
	 */
	users : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			getTemplate('others-not-allowed', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
			}, "#content");

			return;
		} 

		var that = this;
		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#content').html($(template_ui));	

			that.usersListView = new Base_Collection_View({ url : '/core/api/users', restKey : "domainUser", templateKey : "admin-settings-users",
			individual_tag_name : "tr", sortKey : "name", postRenderCallback : function(el)
			{
				$('i').tooltip();
				agileTimeAgoWithLngConversion($(".last-login-time", el));
				
			} });
			that.usersListView.collection.fetch();

			$('#content').find('#admin-prefs-tabs-content').html(that.usersListView.el);
			$('#content').find('#AdminPrefsTab .select').removeClass('select');
			$('#content').find('.users-tab').addClass('select');
			$(".active").removeClass("active");

		}, "#content");

	},

	/**
	 * Loads a template to add new user, navigates to users list on adding a
	 * user
	 */
	usersAdd : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			if(CURRENT_DOMAIN_USER.domain == "admin" && CURRENT_DOMAIN_USER.adminPanelAccessScopes.indexOf("VIEW_LOGS") == -1)
            return  showNotyPopUp("information", 'You donot have the Privileges to Access this page ', "top", 6000);
        
			getTemplate('others-not-allowed', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
			}, "#content");

			return;
		}

		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#content').html($(template_ui));	

			var view = new Base_Model_View({ url : 'core/api/users', template : "admin-settings-user-add", isNew : true, window : 'users', reload : false,
			postRenderCallback : function(el)
			{

				if (view.model.get("id"))
					addTagAgile("User invited");

				// Binds action
				bindAdminChangeAction(el, view.model.toJSON());
				setTimeout(function(){
				$('a[href="#sales-previlages"]').tab("show");
				},100)
				
					
				
			},prePersist : function(model){
				//Chage deals from newscopes to newMenuScopes
				if(!model.toJSON() || !model.toJSON().newscopes)
					return;
				if(!model.toJSON().newMenuScopes){
					return;		
				}

			    var newscopes = model.toJSON().newscopes;
			    $.each(newscopes, function(index, data) {
					if(newscopes[index] == "DEALS"){model.toJSON().newMenuScopes.push("DEALS");}
					if(newscopes[index] == "CALENDAR"){model.toJSON().newMenuScopes.push("CALENDAR");}
				});
				var new_newscopes = _.without(newscopes,"DEALS","CALENDAR");
				model.toJSON().newscopes =  new_newscopes;
				model.set({ 
			       'newscopes' : new_newscopes
			      }, 
			      { 
			       silent : true 
			      });

				
			      
			}, saveCallback : function(response)
			{
				$.getJSON("core/api/users/current-owner", function(data)
				{
					if (data)
					{
						console.log("data of current-owner = "+data);
						data["created_user_email"] = response.email;

						add_created_user_info_as_note_to_owner(data);
					}
					location.reload(true);
				});
			}, saveAuth : function(el){
				if(CURRENT_DOMAIN_USER.is_account_owner && $("#userForm", el).find("#owner:checked").length == 1 && $("#userForm", el).find("#eaddress").val() != CURRENT_DOMAIN_USER.email)
				{
					$("#saveUserAuthentication", el).html(getTemplate("conform-owner-change-model",{}));
					$("#saveUserAuthentication", el).modal("show");
					return true;
				}
				else{
					return false;
				}
			}  });

			$('#content').find('#admin-prefs-tabs-content').html(view.render().el);
			$('#content').find('#AdminPrefsTab .select').removeClass('select');
			$('#content').find('.users-tab').addClass('select');
			$(".active").removeClass("active");

		}, "#content");

		

	},

	/**
	 * Loads a template to add new user, to a particular domain user
	 */

	/**
	 * Edits the existing user by verifying whether the users list view is
	 * defined or not
	 */
	userEdit : function(id)
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			getTemplate('others-not-allowed', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
			}, "#content");

			return;
		}
		var that = this;
		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#content').html($(template_ui));	

			// If users list is not defined then take back to users template
			if (!that.usersListView || !that.usersListView.collection.get(id))
			{
				that.navigate("users", { trigger : true });
				return;
			}

			// Gets user from the collection based on id
			var user = that.usersListView.collection.get(id);

			var userEmail = user.attributes.email;

			var needLogout = false;
			if (CURRENT_DOMAIN_USER.email == user.attributes.email)
			{
				needLogout = true;
			}

			/*
			 * Creates a Model for users edit, navigates back to 'user' window on
			 * save success
			 */
			var view = new Base_Model_View({ url : 'core/api/users', model : user, template : "admin-settings-user-add", change : false, saveCallback : function(response)
			{

				update_contact_in_our_domain(userEmail, response, function(){

					// If user changed his own email, redirect it to the login page.
					if (needLogout && CURRENT_DOMAIN_USER.email != response.email)
					{
						console.log('Logging out...');
						showNotyPopUp("information", _agile_get_translated_val('domain-user', 'email-edited'), "top");
						var hash = window.location.hash;

						setTimeout(function()
						{
							window.location.href = window.location.protocol + "//" + window.location.host + "/login" + hash;
						}, 5000);
					}
					else
					{
						//Backbone.history.navigate('users', { trigger : true });
						location.reload(true);
					}
				

				});
				

			}, postRenderCallback : function(el)
			{

				bindAdminChangeAction(el, view.model.toJSON());
				setTimeout(function(){
					$('#deals-privilege', el).trigger('change');
					$('#calendar-privilege', el).trigger('change');
					$('a[href="#sales-previlages"]',el).tab('show');
					$('a[href="#sales-previlages"]',el).trigger('click');
				},500);
			}, prePersist : function(model){
				
			   if(!model.toJSON() || !model.toJSON().newscopes)
					return;
				if(!model.toJSON().newMenuScopes){
					return;		
				}

			   var newscopes = model.toJSON().newscopes;
			    $.each(newscopes, function(index, data) {
					if(newscopes[index] == "DEALS"){model.toJSON().newMenuScopes.push("DEALS");}
					if(newscopes[index] == "CALENDAR"){model.toJSON().newMenuScopes.push("CALENDAR");}
				});
				var new_newscopes = _.without(newscopes,"DEALS","CALENDAR");
				model.toJSON().newscopes =  new_newscopes;
				model.set({ 
			       'newscopes' : new_newscopes
			      }, 
			      { 
			       silent : true 
			      });
			      
			   },saveAuth : function(el){
				if(CURRENT_DOMAIN_USER.is_account_owner && $("#userForm", el).find("#owner:checked").length == 1 && $("#userForm", el).find("#eaddress").val() != CURRENT_DOMAIN_USER.email)
				{
					$("#saveUserAuthentication", el).html(getTemplate("conform-owner-change-model",{}));
					$("#saveUserAuthentication", el).modal("show");
					return true;
				}
				else{
					return false;
				}
			} });

			$('#content').find('#admin-prefs-tabs-content').html(view.render().el);
			$('#content').find('#AdminPrefsTab .select').removeClass('select');
			$('#content').find('.users-tab').addClass('select');
			$(".active").removeClass("active");

		}, "#content");

		

	},

	/**
	 * Shows list of custom fields with an option to add new custom field of
	 * desired type
	 * 
	 */
	/**
	 * Shows list of custom fields with an option to add new custom field of
	 * desired type
	 * 
	 */
	customFields : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			getTemplate('others-not-allowed', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
			}, "#content");

			return;
		}
		var that = this;
		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#content').html($(template_ui));	

			that.customFieldsListView = new Base_Collection_View({ url : '/core/api/custom-fields/allScopes', restKey : "customFieldDefs",
			templateKey : "admin-settings-customfields", individual_tag_name : 'tr', postRenderCallback : function(el)
			{
				initializeCustomFieldsListeners();

			} });

			that.customFieldsListView.appendItem = groupingCustomFields;

			that.customFieldsListView.collection.fetch();

			$('#content').find('#admin-prefs-tabs-content').html(that.customFieldsListView.el);
			$('#content').find('#AdminPrefsTab .select').removeClass('select');
			$('#content').find('.custom-fields-tab').addClass('select');
			$(".active").removeClass("active");

		}, "#content");

		
	},

	/**
	 * Loads java-script API to make the user able to track page views on users
	 * site, add/delete contacts from users website or blog directly. Loads
	 * minified prettify.js to prettify analytics code.
	 */
	analyticsCode : function(id)
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			getTemplate('others-not-allowed', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
			}, "#content");

			return;
		}

		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#content').html($(template_ui));	

			head.js(LIB_PATH + 'lib/prettify-min.js', function()
			{
				var view = new Base_Model_View({ url : '/core/api/api-key', template : "admin-settings-api-key-model", postRenderCallback : function(el)
				{

					
					$('#content').find('#admin-prefs-tabs-content').html(view.el);

					$('#content').find('#AdminPrefsTab .select').removeClass('select');
					$('#content').find('.analytics-code-tab').addClass('select');
					// prettyPrint();
					if (id)
					{
						$(el).find('#APITab a[href="#' + id + '"]').trigger('click');
					}

					// initZeroClipboard("api_track_webrules_code_icon",
					// "api_track_webrules_code");
					// initZeroClipboard("api_key_code_icon", "api_key_code");
					// initZeroClipboard("api_track_code_icon", "api_track_code");

					try
					{
						if (ACCOUNT_PREFS.plan.plan_type.split("_")[0] == "PRO" || ACCOUNT_PREFS.plan.plan_type.split("_")[0] == "ENTERPRISE")
							$("#tracking-webrules, .tracking-webrules-tab").hide();
						else
							$("#tracking-webrules-whitelist, .tracking-webrules-whitelist-tab").hide();
					}
					catch (e)
					{
						$("#tracking-webrules-whitelist, .tracking-webrules-whitelist-tab").hide();
					}

					prettify_api_add_events();
					// initializeRegenerateKeysListeners();

				} });
			});

		}, "#content");

		
	},

	apiAnalyticsCode : function(id)
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			getTemplate('others-not-allowed', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
			}, "#content");

			return;
		}

		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#content').html($(template_ui));	

			head.js(LIB_PATH + 'lib/prettify-min.js', function()
			{
				var view = new Base_Model_View({ url : '/core/api/api-key', template : "admin-settings-analytics-model", postRenderCallback : function(el)
				{

					
					$('#content').find('#admin-prefs-tabs-content').html(view.el);

					$('#content').find('#AdminPrefsTab .select').removeClass('select');
					$('#content').find('.api-analytics-code-tab').addClass('select');
					// prettyPrint();
					if (id)
					{
						$(el).find('#APITab a[href="#' + id + '"]').trigger('click');
					}

					// initZeroClipboard("api_track_webrules_code_icon",
					// "api_track_webrules_code");
					// initZeroClipboard("api_key_code_icon", "api_key_code");
					// initZeroClipboard("api_track_code_icon", "api_track_code");

					try
					{
						if (ACCOUNT_PREFS.plan.plan_type.split("_")[0] == "PRO" || ACCOUNT_PREFS.plan.plan_type.split("_")[0] == "ENTERPRISE")
							$("#tracking-webrules, .tracking-webrules-tab").hide();
						else
							$("#tracking-webrules-whitelist, .tracking-webrules-whitelist-tab").hide();
					}
					catch (e)
					{
						$("#tracking-webrules-whitelist, .tracking-webrules-whitelist-tab").hide();
					}

					prettify_api_add_events();
					// initializeRegenerateKeysListeners();
					loadZeroclipboard2(function()
	 						{	
	 							initZeroClipboard2($('.grp-clipboard-track-code'), $('.clipboard-track-code-text'));
	 							initZeroClipboard2($('.grp-clipboard-webrule-code'), $('.clipboard-webrule-text'));
	 							initZeroClipboard2($('.grp-clipboard-webrule-whitelist-code'), $('.clipboard-webrule-whitelist-text'));
	 						});
					

				} });
			});

		}, "#content");

		
	},

	/**
	 * Shows API-KEY. Loads minified prettify.js to prettify the view
	 */
	api : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			getTemplate('others-not-allowed', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
			}, "#content");
			return;
		}

		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#content').html($(template_ui));	

			head.js(LIB_PATH + 'lib/prettify-min.js', function()
			{
				var view = new Base_Model_View({ url : '/core/api/api-key', template : "admin-settings-api-model", postRenderCallback : function(el)
				{

					initializeRegenerateKeysListeners();
					prettyPrint();
				} });
				$('#content').find('#admin-prefs-tabs-content').html(view.el);
				$('#content').find('#AdminPrefsTab .select').removeClass('select');
				$('#content').find('.api-analytics-code-tab').addClass('select');
				$(".active").removeClass("active");
			});
		}, "#content");

		
	},

	/**
	 * Creates a Model to show and edit milestones, reloads the page on save
	 * success
	 */
	milestones : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			getTemplate('others-not-allowed', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
			}, "#content");

			return;
		}
		
		var that = this;
		$('#content').html("<div id='milestone-listner'>&nbsp;</div>");
		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#milestone-listner').html($(template_ui));
			$('#milestone-listner').find('#admin-prefs-tabs-content').html(getTemplate("settings-milestones-tab"), {});

			that.pipelineGridView = new Track_And_Milestone_Events_Collection_View({ url : '/core/api/milestone/pipelines', templateKey : "admin-settings-milestones",
			individual_tag_name : 'div', sortKey : "name", postRenderCallback : function(el)
			{
				setup_milestones(el);
				var tracks_length = App_Admin_Settings.pipelineGridView.collection.length;
				if (tracks_length == 1)
					$('#milestone-listner').find('#deal-tracks-accordion').find('.collapse').addClass('in');
				initializeMilestoneListners(el);
				milestone_util.init(el);
				//that.lostReasons();
				//that.dealSources();
			} });
			that.pipelineGridView.collection.fetch();

			$('#milestone-listner').find('#admin-prefs-tabs-content').find('#settings-milestones-tab-content').html(that.pipelineGridView.render().el);
			$('#milestone-listner').find('#AdminPrefsTab .select').removeClass('select');
			$('#milestone-listner').find('.milestones-tab').addClass('select');
			$(".active").removeClass("active");
			$('.settings-milestones').addClass('active');
			$('#milestone-listner').find('#admin-prefs-tabs-content').parent().removeClass('bg-white');

		}, "#milestone-listner");
	
		$('.settings-milestones').addClass('active');
		$('#milestone-listner').find('#admin-prefs-tabs-content').parent().removeClass('bg-white');
	},
	
	/**
	 * Creates a Model to show and edit products, reloads the page on save
	 * success
	 */

	products : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			getTemplate('others-not-allowed', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
			}, "#content");

			return;
		} 
		var that = this;
		$('#content').html("<div id='milestone-listner'>&nbsp;</div>");
		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#milestone-listner').html($(template_ui));
			$('#milestone-listner').find('#admin-prefs-tabs-content').html(getTemplate("settings-milestones-tab"), {});
	
			

			App_Admin_Settings.productsGridView = new Base_Collection_View({ url : '/core/api/products', 
			templateKey : "admin-settings-products", sort_collection:true,sortKey : 'name',
			individual_tag_name : 'tr', postRenderCallback : function(el)
			{
				console.log("loaded products : ", el);
						head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
						{
							
							$(".created_time", el).timeago();
						});
				initializeAdminProductsListners();		
				
			} });
			App_Admin_Settings.productsGridView.collection.fetch();

			$('#content').find('#admin-prefs-tabs-content').find('#settings-milestones-tab-content').html(App_Admin_Settings.productsGridView.render().el);
			$('#content').find('#AdminPrefsTab .select').removeClass('select');
			$('#content').find('.milestones-tab').addClass('select');
			$(".active").removeClass("active");
			$('.settings-deal-products').addClass('active');
			$('#milestone-listner').find('#admin-prefs-tabs-content').parent().removeClass('bg-white');
			$('.settings-deal-products').parent().removeClass('b-b-none');

		}, "#milestone-listner");

		
		
	},

	/**
	 * Loads a template to add new user, navigates to users list on adding a
	 * user
	 */
	productsAdd : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			getTemplate('others-not-allowed', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
			}, "#content");

			return;
		}
		console.log('product add...');
		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			console.log('product add1...');
			$('#content').html($(template_ui));	

			var view = new Base_Model_View({ url : 'core/api/products', template : "admin-settings-product-add", isNew : true,  reload : false,
			postRenderCallback : function(el)
			{

				
			}, saveCallback : function(response)
			{
				Backbone.history.navigate('products', { trigger : true });
			} });

			$('#content').find('#admin-prefs-tabs-content').html(view.render().el);
			$('#content').find('#AdminPrefsTab .select').removeClass('select');
			$('#content').find('.products-tab').addClass('select');
			$(".active").removeClass("active");

		}, "#content");

		

	},

	/**
	 * Loads a template to add new user, to a particular domain user
	 */

	/**
	 * Edits the existing user by verifying whether the users list view is
	 * defined or not
	 */
	productEdit : function(id)
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			getTemplate('others-not-allowed', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
			}, "#content");

			return;
		}
		var that = this;
		console.log("Product Edit");
			getTemplate("admin-settings", {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	

				// If products list is not defined then take back to products template
				if (!App_Admin_Settings.productsGridView || !App_Admin_Settings.productsGridView.collection.get(id))
				{
					that.navigate("products", { trigger : true });
					return;
				}

				// Gets product from the collection based on id
				var product = App_Admin_Settings.productsGridView.collection.get(id);
			
			
				/*
				 * Creates a Model for products edit, navigates back to 'product' window on
				 * save success
				 */
				var view = new Base_Model_View({ url : 'core/api/products',
					model : product, template : "admin-settings-product-add", 				
				saveCallback : function(response)
				{
						Backbone.history.navigate('products', { trigger : true });
				}, 
				postRenderCallback : function(el)
				{
					initializeAdminProductsListners("settings-milestones-tab-content");
								
				}
			 });

			$('#content').find('#admin-prefs-tabs-content').html(view.render().el);
			$('#content').find('#AdminPrefsTab .select').removeClass('select');
			$('#content').find('.products-tab').addClass('select');
			$(".active").removeClass("active");
		
		}, "#content");

		

	},

	/**
	 * Creates a Model to show and edit milestones, reloads the page on save
	 * success
	 */
	categories : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html(getTemplate('others-not-allowed',{}));
			return;
		}

		$("#content").html(getTemplate("admin-settings"), {});
		this.categoryGridView = new Base_Collection_View({ url : '/core/api/categories?entity_type=TASK', templateKey : "admin-settings-categories",
			individual_tag_name : 'tr', sortKey : "order", postRenderCallback : function(el)
			{
				console.log("loaded categories : ", el);
				categories.setup_categories(el);
				categories.init();
			} });
		this.categoryGridView.collection.fetch();
		$('#content').find('#admin-prefs-tabs-content').html(this.categoryGridView.render().el);
		$('#content').find('#AdminPrefsTab .select').removeClass('select');
		$('#content').find('.categories-tab').addClass('select');
		$(".active").removeClass("active");
	},

	/**
	 * Fetches Stats of integrations - usage info.
	 */
	integrationsStats : function()
	{
		/*
		 * if (!CURRENT_DOMAIN_USER.is_admin) { $('#content').html("You have no
		 * Admin Privileges"); return; }
		 * $("#content").html(getTemplate("admin-settings"), {}); var
		 * emailStatsModelView = new Base_Model_View({ url :
		 * 'core/api/emails/email-stats', template :
		 * 'admin-settings-email-stats', });
		 * 
		 * $('#content').find('#admin-prefs-tabs-content').html(emailStatsModelView.render().el);
		 * $('#content').find('#AdminPrefsTab .select').removeClass('select');
		 * $('#content').find('.stats-tab').addClass('select');
		 */

		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			getTemplate('others-not-allowed', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
			}, "#content");

			return;
		}

		$("#content").html("<div id='email-stats-listners'></div>");
		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#email-stats-listners').html($(template_ui));

			$('#email-stats-listners').find('#AdminPrefsTab .select').removeClass('select');
			$('#email-stats-listners').find('.stats-tab').addClass('select');
			$(".active").removeClass("active");
			$('#email-stats-listners').find('#admin-prefs-tabs-content').html(getRandomLoadingImg());

			getTemplate('admin-settings-integrations-stats-new',{}, undefined, function(template_ui){
				if(!template_ui)
					  return;

				$('#email-stats-listners').find('#admin-prefs-tabs-content').html($(template_ui));
				$('#integration-stats a[href="#account-stats-new"]', $("#email-stats-listners")).tab('show');
				$('#email-stats-listners').find('#account-stats-new').html(LOADING_ON_CURSOR);
				account_stats_integrations.loadAccountStats($("#email-stats-listners"));
				initializeStatsListners($("#email-stats-listners"));
				hideTransitionBar();

			}, $('#email-stats-listners').find('#admin-prefs-tabs-content'));
		}, "#email-stats-listners");

	},

	/**
	 * Web to lead links to website pages
	 */
	integrations : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			getTemplate('others-not-allowed', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
			}, "#content");
			return;
		}
		var that = this;
		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;

			$('#content').html($(template_ui));	

			that.integrations = new Base_Collection_View({ url : 'core/api/widgets/integrations', templateKey : 'admin-settings-web-to-lead-new',
			postRenderCallback : function(el)
			{
				var integrationsTab = _agile_get_prefs("integrations_tab");
				if(!integrationsTab || integrationsTab == null) {
					_agile_set_prefs('integrations_tab', "web-to-lead-tab");
					integrationsTab = "web-to-lead-tab";
				}
				$('#admin-prefs-tabs-content a[href="#'+integrationsTab+'"]').tab('show');
				$("#admin-prefs-tabs-content .tab-container ul li").off("click");
				$("#admin-prefs-tabs-content").on("click",".tab-container ul li",function(){
					var temp = $(this).find("a").attr("href").split("#");
					_agile_set_prefs('integrations_tab', temp[1]);
				});

			} });

			that.integrations.collection.fetch();

			$('#content').find('#admin-prefs-tabs-content').html(that.integrations.render().el);
			$('#content').find('#AdminPrefsTab .select').removeClass('select');
			$('#content').find('.integrations-tab').addClass('select');
			$(".active").removeClass("active");

		}, "#content");
		
	},

	tagManagement : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			getTemplate('others-not-allowed', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
			}, "#content");

			return;
		}
		var that = this;
		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;

			$('#content').html($(template_ui));	

			that.tagsview1 = new Base_Collection_View({ url : 'core/api/tags/stats1', templateKey : "tag-management", individual_tag_name : 'li',
			sort_collection : true, sortKey : 'tag', postRenderCallback : function(el)
			{
				acl_util.initTagACL(el);
				initializeTagManagementListeners();
				$(".allow_users_switch").tooltip({
			        title: "<p>" +_agile_get_translated_val('tag-manage','allow-users-to-add')+ "</p><p>" +_agile_get_translated_val('tag-manage', 'allow-tooltip')+ "</p>",  
			        html: true,
			        placement : 'bottom'
			    }); 
			} });
			that.tagsview1.appendItem = append_tag_management;

			// var tagsView = new Base_Model_View({ url : 'core/api/tags', template
			// : 'admin-settings-tags-model', });
			console.log(that.tagsview1);
			that.tagsview1.collection.fetch();

			$('#content').find('#admin-prefs-tabs-content').html(that.tagsview1.render().el);
		
			$('#content').find('#AdminPrefsTab .select').removeClass('select');
			$('#content').find('.tag-management-tab').addClass('select');
			$(".active").removeClass("active");

		}, "#admin-prefs-tabs-content");
		
	},

	emailGateways : function(id)
	{
		console.log(App_Admin_Settings.integrations.collection);
		var that = this;
		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#content').html($(template_ui));	
			getTemplate("web-to-lead-settings", {}, undefined, function(template_ui1){
				if(!template_ui1)
					return;
				$('#admin-prefs-tabs-content').html($(template_ui1));
				var integrationsTab = _agile_get_prefs("integrations_tab");
				$("#admin-prefs-tabs-content").find('a[href="#'+integrationsTab+'"]').closest("li").addClass("active");	
				// On Reload, navigate to integrations
				if (!that.integrations || that.integrations.collection == undefined)
				{
					that.navigate("integrations", { trigger : true });
					return;
				}

				var value = 'SEND_GRID';

				if (id == 'mandrill')
					value = 'MANDRILL';
				else if (id == 'ses')
	                value = 'SES';
	            else if(id=='mailgun')
	            	value='MAILGUN';

				var emailGateway;
				$.each(that.integrations.collection.where({name:"EmailGateway"}),function(key,value){
				
					emailGateway = JSON.parse(value.attributes.prefs);
				
				});
				
				// Allow only one Email gateway configured
				if(emailGateway && emailGateway["email_api"])//check if email gateway exist
				{
					if(emailGateway["email_api"].toUpperCase() != value)//checks if the current email gateway is the same as the clicked one
					{
					modalAlert("sms-integration-alert-modal", _agile_get_translated_val('emailgateway','already-exists'), _agile_get_translated_val('emailgateway', 'configured'));
					that.navigate("integrations", { trigger : true });
					return;	
					}
				}	

				// To show template according to api. Note: Widget and EmailGateway model is different
				if(!emailGateway)
					emailGateway = {"email_api":value, "api_user": "", "api_key":""}; 
						
				that.email_gateway = new Base_Model_View({ 
					data : emailGateway,
					url : 'core/api/email-gateway',
					template : 'settings-email-gateway', postRenderCallback : function(el)
					{
						initializeIntegrationsTabListeners("integrations_tab", "integrations");
						if(id=="mandrill"){
							$("#integrations-image",el).attr("src","img/crm-plugins/mandrill_logo.png");
						}
						
						if(id=="sendgrid"){
							$("#integrations-image",el).attr("src","img/crm-plugins/sendgrid_logo.png");
						}

						if(id=="ses"){
							$("#integrations-image",el).attr("src","img/crm-plugins/ses_logo.png");
					    }
					    if(id=="mailgun"){
							$("#integrations-image",el).attr("src","img/crm-plugins/mailgun.png");
					    }
						
					}, saveCallback : function()
					{
						$('.ses-success-msg').show();
						
						// On saved, navigate to integrations
						Backbone.history.navigate("integrations", { trigger : true });

						if(value == 'SES')
	 						return;

						data = App_Admin_Settings.email_gateway.model.toJSON();

						// Add webhook
						$.getJSON("core/api/email-gateway/add-webhook?api_user="+data.api_user+"&api_key=" + data.api_key + "&type=" + data.email_api, function(data)
						{
							console.log(data);
						});
					},
					errorCallback : function(response)
					{
						var $save = $('.save', '#email-gateway-integration-form');

						disable_save_button($save);

						var msg = response.responseText;

						if(msg.indexOf('SignatureDoesNotMatch') != -1)
	                        msg = msg.replace('SignatureDoesNotMatch', _agile_get_translated_val('emailgateway','sign-mis-match'));

	                    if(msg.indexOf('InvalidClientTokenId') != -1)
	                    	msg = msg.replace('InvalidClientTokenId', _agile_get_translated_val('emailgateway','invalid-acceess-key'));

						// Show cause of error in saving
						var $save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>'
													+ msg
													+ '</i></p></small></div>');

						// Appends error info to form actions
						// block.
						$save.closest(".form-actions", this.el).append(
								$save_info);

						// Hides the error message after 3
						// seconds
						if(response.status != 406)
							$save_info.show().delay(3000).hide(1, function(){

								enable_save_button($save);
							});
					}

				});

				$('#content').find('#admin-settings-integrations-tab-content').html(that.email_gateway.render().el);
				$('#content').find('.integrations-tab').addClass('select');
				//$(".active").removeClass("active");
			}, "#admin-settings-integrations-tab-content");
		}, null);

		
	},

	recaptchaGateway : function(id)
	{
		console.log(App_Admin_Settings.integrations.collection);
		var that = this;
		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#content').html($(template_ui));	
			getTemplate("web-to-lead-settings", {}, undefined, function(template_ui1){
				if(!template_ui1)
					return;
				$('#admin-prefs-tabs-content').html($(template_ui1));
				var integrationsTab = _agile_get_prefs("integrations_tab");
				$("#admin-prefs-tabs-content").find('a[href="#'+integrationsTab+'"]').closest("li").addClass("active");	
				// On Reload, navigate to integrations
				if (!that.integrations || that.integrations.collection == undefined)
				{
					that.navigate("integrations", { trigger : true });
					return;
				}

				var value = 'RECAPTCHA';

				var recaptchaGateway;
				$.each(that.integrations.collection.where({name:"RecaptchaGateway"}),function(key,value){
				
					recaptchaGateway = JSON.parse(value.attributes.prefs);
				
				});
				
				
				// To show template according to api. Note: Widget and EmailGateway model is different
				if(!recaptchaGateway)
					recaptchaGateway = {"recaptcha_api":value, "api_key": "", "site_key":""}; 
						
				that.recaptcha_gateway = new Base_Model_View({ 
					data : recaptchaGateway,
					url : 'core/api/recaptcha-gateway',
					template : 'settings-recaptcha-gateway', postRenderCallback : function(el)
					{
						initializeIntegrationsTabListeners("integrations_tab", "integrations");
							$("#integrations-image",el).attr("src","img/crm-plugins/grecaptcha.png");						
						
					}, saveCallback : function()
					{
						$('.ses-success-msg').show();
						
						// On saved, navigate to integrations
						Backbone.history.navigate("integrations", { trigger : true });

					},
					errorCallback : function(response)
					{
						var $save = $('.save', '#recaptcha-gateway-integration-form');

						disable_save_button($save);

						var msg = response.responseText;
						// Show cause of error in saving
						var $save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>'
													+ msg
													+ '</i></p></small></div>');

						// Appends error info to form actions
						// block.
						$save.closest(".form-actions", this.el).append(
								$save_info);

						// Hides the error message after 3
						// seconds
						if(response.status != 406)
							$save_info.show().delay(3000).hide(1, function(){

								enable_save_button($save);
							});
					}

				});

				$('#content').find('#admin-settings-integrations-tab-content').html(that.recaptcha_gateway.render().el);
				$('#content').find('.integrations-tab').addClass('select');
				//$(".active").removeClass("active");
			}, "#admin-settings-integrations-tab-content");
		}, null);

		
	},

	smsGateways : function(id)
	{
		console.log("inside sms gateways");
		var that = this;
		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#content').html($(template_ui));	
			getTemplate("web-to-lead-settings", {}, undefined, function(template_ui1){
				if(!template_ui1)
					return;
				$('#admin-prefs-tabs-content').html($(template_ui1));
				var integrationsTab = _agile_get_prefs("integrations_tab");
				$("#admin-prefs-tabs-content").find('a[href="#'+integrationsTab+'"]').closest("li").addClass("active");

				// On Reload, navigate to integrations
				if (!that.integrations || that.integrations.collection == undefined)
				{
					that.navigate("integrations", { trigger : true });
					return;
				}

				var value, accountID;
				if (id == "plivo")
				{
					value = 'PLIVO';
					accountID = "account_id";
				}
				if (id == "twilio")
				{
					value = 'TWILIO';
					accountID = "account_sid";
				}

				var smsGateway;
				$.each(that.integrations.collection.models, function(key, value)
				{
					var prefJSON = JSON.parse(value.attributes.prefs);
					if (prefJSON["sms_api"])
						smsGateway = prefJSON["sms_api"];
				});

				// allow one sms gateway configured at a time
				if (smsGateway != undefined)// check if sms gateway exist
				{
					if (smsGateway.toUpperCase() != value)// checks if the current sms
					// gateway is the same as
					// the clicked one
					{
						modalAlert("sms-integration-alert-modal", _agile_get_translated_val('smsgateway', 'already-exists'),
								_agile_get_translated_val('smsgateway','configured'));
						that.navigate("integrations", { trigger : true });
						return;
					}
				}

				view = new Base_Model_View({
					model : App_Admin_Settings.integrations.collection.where({ name : "SMS-Gateway" })[0],
					url : 'core/api/sms-gateway',
					template : 'settings-sms-gateway',
					prePersist : function(model)
					{
						if (id == "plivo")
							var prefJSON = { account_id : model.attributes.account_id, auth_token : model.attributes.auth_token, endpoint : model.attributes.endpoint,
								sms_api : value };
						if (id == "twilio")
							var prefJSON = { account_sid : model.attributes.account_sid, auth_token : model.attributes.auth_token,
								endpoint : model.attributes.endpoint, sms_api : value };
						model.set({ prefs : JSON.stringify(prefJSON) }, { silent : true });
					}, postRenderCallback : function(el)
					{
						initializeIntegrationsTabListeners("integrations_tab", "integrations");
						if (id == "plivo")
						{
							$("#integrations-image", el).attr("src", "/img/plugins/plivo.png");
							$("#accoundID", el).attr("name", "account_id");
							$("#accoundID", el).attr("placeholder", _agile_get_translated_val("integrations", "auth-id"));
							$("#integrations-label", el).text(_agile_get_translated_val('integrations', 'you-need-a-paid-plivo-account'));
						}
						if (id == "twilio")
						{
							$("#integrations-image", el).attr("src", "/img/plugins/twilio.png");
							$("#accoundID", el).attr("name", "account_sid");
							$("#accoundID", el).attr("placeholder", _agile_get_translated_val("integrations", "account-sid"));
							$("#integrations-label", el).text(_agile_get_translated_val('integrations', 'account-details'));
						}
					}, saveCallback : function(data)
					{
						// On saved, navigate to integrations
						Backbone.history.navigate("integrations", { trigger : true });
					}, errorCallback : function(data)
					{
						if ($("#sms-gateway-error").is(":visible"))
							$("#sms-gateway-error").remove();

						$responceText = "<div style='color:#B94A48; font-size:14px' id='sms-gateway-error'><i>" + data.responseText + "</i></div>";
						$("#sms-integration-error", that.el).append($responceText);
					} });

				$('#content').find('#admin-settings-integrations-tab-content').html(view.render().el);
				$('#content').find('#AdminPrefsTab .select').removeClass('select');
				$('#content').find('.integrations-tab').addClass('select');
				//$(".active").removeClass("active");

			}, "#admin-settings-integrations-tab-content");
		}, null);
	},
	
	/**
	 * Fetch all lost reasons
	 */
	lostReasons : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html(getTemplate('others-not-allowed',{}));
			return;
		}
		var that = this;
		$('#content').html("<div id='milestone-listner'>&nbsp;</div>");
		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#milestone-listner').html($(template_ui));
			$('#milestone-listner').find('#admin-prefs-tabs-content').html(getTemplate("settings-milestones-tab"), {});
			that.dealLostReasons = new Sources_Loss_Reasons_Events_Collection_View({ url : '/core/api/categories?entity_type=DEAL_LOST_REASON', templateKey : "admin-settings-lost-reasons",
				individual_tag_name : 'tr', sortKey : "name", postRenderCallback : function(el)
				{
					initializeMilestoneListners(el);
				} });
			that.dealLostReasons.collection.fetch();
			$('#content').find('#admin-prefs-tabs-content').find('#settings-milestones-tab-content').html(that.dealLostReasons.render().el);
			$('#content').find('#AdminPrefsTab .select').removeClass('select');
			$('#content').find('.milestones-tab').addClass('select');
			$(".active").removeClass("active");
			$('.settings-lost-reasons').addClass('active');
			$('#milestone-listner').find('#admin-prefs-tabs-content').parent().removeClass('bg-white');
			//$('.settings-lost-reasons').parent().removeClass('b-b-none');

		}, "#milestone-listner");
	},

	/**
	 * Fetch all deal sources
	 */
	dealSources : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html(getTemplate('others-not-allowed',{}));
			return;
		}
		var that = this;
		$('#content').html("<div id='milestone-listner'>&nbsp;</div>");
		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#milestone-listner').html($(template_ui));
			$('#milestone-listner').find('#admin-prefs-tabs-content').html(getTemplate("settings-milestones-tab"), {});
			that.dealSourcesView = new Sources_Loss_Reasons_Events_Collection_View({ url : '/core/api/categories?entity_type=DEAL_SOURCE', templateKey : "admin-settings-deal-sources",
				individual_tag_name : 'tr', sort_collection : false, postRenderCallback : function(el)
				{
					initializeMilestoneListners(el);

					//Enable sorting for sources
					dealSourcesSorting();
				} });
			that.dealSourcesView.collection.fetch();
			$('#content').find('#admin-prefs-tabs-content').find('#settings-milestones-tab-content').html(that.dealSourcesView.render().el);
			$('#content').find('#AdminPrefsTab .select').removeClass('select');
			$('#content').find('.milestones-tab').addClass('select');
			$(".active").removeClass("active");
			$('.settings-deal-sources').addClass('active');
			$('#milestone-listner').find('#admin-prefs-tabs-content').parent().removeClass('bg-white');
			//$('.settings-deal-sources').parent().removeClass('b-b-none'); 

		}, "#milestone-listner");
	},

	dealGoal : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html(getTemplate('others-not-allowed',{}));
			return;
		}
		var that1 = this;
		$('#content').html("<div id='milestone-listner'>&nbsp;</div>");
		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#milestone-listner').html($(template_ui));
			$('#milestone-listner').find('#admin-prefs-tabs-content').html(getTemplate("settings-milestones-tab"), {});

			that1.dealGoalsView = new Sources_Loss_Reasons_Events_Collection_View({ url : '/core/api/users', templateKey : "admin-settings-deal-goals",
				individual_tag_name : 'tr', sortKey : "name", postRenderCallback : function(el)
				{
					initQuota(function(){
					initializeMilestoneListners(el);
					

							var d=$('#goal_duration span').html();
						if(window.navigator.userAgent.indexOf("Mozilla") != -1 && window.navigator.userAgent.indexOf("Chrome")==-1)
							d="01 "+d;
					d=new Date(d);
					var start=getUTCMidNightEpochFromDate(d);

						$.ajax({ type : 'GET', url : '/core/api/goals?start_time='+start/1000, 
						contentType : "application/json; charset=utf-8", dataType : 'json' ,
							success:function(data)
							{
								console.log(data);
								var count=0,amount=0;
								$("#deal-sources-table").find("tr").not(':first').each(function(index){
									var that=$(this);
									that.find('.count').val("");
											that.find('.amount').val("");
									$.each(data,function(index,jsond){
										console.log(jsond);
										if(jsond.domain_user_id==that.find(".goalid").attr("id")){
											that.find('.count').val(jsond.count);
											that.find('.amount').val(jsond.amount);
											that.attr('id',jsond.id);
											that.attr('data',jsond.start_time);
											//flag=true;
										}

								});
									if(that.find('.count').val()!="")
									count=count+parseInt(that.find('.count').val());
									if(that.find('.amount').val()!="")
										amount=amount+parseFloat(that.find('.amount').val());
								});

								
								percentCountAndAmount(count,amount);
							}
					});
					});
					
				}  });	
			that1.dealGoalsView.collection.fetch();
			$('#content').find('#admin-prefs-tabs-content').find('#settings-milestones-tab-content').html(that1.dealGoalsView.render().el);
			$('#content').find('#AdminPrefsTab .select').removeClass('select');
			$('#content').find('.milestones-tab').addClass('select');
			$(".active").removeClass("active");
			$('.settings-deal-goal').addClass('active');
			$('#milestone-listner').find('#admin-prefs-tabs-content').parent().removeClass('bg-white');
			//$('.settings-deal-goal').parent().removeClass('b-b-none');

		}, "#milestone-listner");
	},

	changeDomain : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			getTemplate('others-not-allowed', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
			}, "#content");

			return;
		}
		
		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#content').html($(template_ui));	
			var view = new Base_Model_View({ url : '/core/api/alias', template : "admin-settings-domain-alias", postRenderCallback : function(el){},
			prePersist : function(model){
				var aliasJSON = [];
				$.each($("#alias_domain").find('input[name="alias"]'), function(index, data) {
					aliasJSON.push(($(data).val().toLowerCase()));
				});
			    model.set({ 
			       'alias' : aliasJSON
			      }, 
			      { 
			       silent : true 
			      });
			   }, saveAuth : function(el){
			   	var form_id = $("#alias", el).closest('form').attr("id");
				if (!isValidForm('#' + form_id))
				{
					return false;
				}
				if(getDomainFromURL() != $("#alias", el).val())
				{
					$("#saveAliasAuthentication", el).html(getTemplate("conform-domain-change-model",{}));
					$("#saveAliasAuthentication", el).modal("show");
					return true;
				}
				else{
					return false;
				}
			}, saveCallback : function(response){
				console.log("saveCallback");
				
				var domain = getDomainFromURL();
				if(domain == null)
					window.location.href = "/login";
				if(domain != response.alias[0]){
					showNotyPopUp("information", _agile_get_translated_val('domain-user','domain-edited'), "top");
					setTimeout(function()
					{
						window.location.href = window.location.protocol + "//" + response.alias[0] + ".agilecrm.com/login" + window.location.hash;
					}, 5000);
				}
			},errorCallback : function(data){
				showNotyPopUp("warning", data.responseText, "top");
			} });

			$('#content').find('#admin-prefs-tabs-content').html(view.render().el);
			$('#content').find('#AdminPrefsTab .select').removeClass('select');
			$('#content').find('.account-prefs-tab').addClass('select');
			$(".active").removeClass("active");

		}, "#content");	
	},
	contactsLimitreachedview : function(e){

		if(readCookie("contactslimit"))
		{
			return ;
		}
	console.log("contactsLimitreachedview");
		// Creata a global view
		this.contactsLimitview = new Base_Model_View({ 
			url : '/core/api/contacts/list/count/jsonformat', 
			template : "contactslimitouter", 
			postRenderCallback : function(el){
					var template = "";
					var maxContactLimit = App_Admin_Settings.contactsLimitview.model.toJSON().count;
					var planLimit = parseInt(USER_BILLING_PREFS.planLimits.contactLimit);
					if (maxContactLimit > planLimit*0.8 &&  maxContactLimit<planLimit)
					{
						template = "contactslimitwarning";
							$("#contacts_limit_alert_info").removeClass("hide");
					}
					else if (maxContactLimit > planLimit)
					{
						template = "contactslimitalert";
							$("#contacts_limit_alert_info").removeClass("hide");
					}
						getTemplate(template, {}, undefined, function(template_ui)
							{
								if(!template_ui)
									return;
								$("#contactlimitouterdiv",el).html($(template_ui));
							});
			},});
		$('#contacts_limit_alert_info').html(this.contactsLimitview.render().el);	
	},
	
	telephony : function(){
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			getTemplate('others-not-allowed', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
			}, "#content");

			return;
		}
		
		var that = this;
		$('#content').html("<div id='telephony-listner'>&nbsp;</div>");
		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#telephony-listner').html($(template_ui));
			
			that.telephonyGridView = new Telephony_Status_Collection_View({ url : '/core/api/categories?entity_type=TELEPHONY_STATUS', templateKey : "admin-settings-telephony",
				individual_tag_name : 'tr', sortKey : "order", postRenderCallback : function(el)
				{
					
					console.log("loaded telephony : ", el);
					
					initializeTelephonyListners(el);
					//categories.setup_categories(el);
					//categories.init();
				
				} });
			that.telephonyGridView.collection.fetch();
			$('#content').find('#admin-prefs-tabs-content').html(that.telephonyGridView.render().el);
			$('#content').find('#AdminPrefsTab .select').removeClass('select');
			$('#content').find('.telephony-tab').addClass('select');
			$(".active").removeClass("active");
			
		}, "#telephony-listner");
	}

});


function initQuota(callback)
{
	$("#goal_duration span.date").datepicker({ format :"MM yyyy", minViewMode:"months",weekStart : CALENDAR_WEEK_START_DAY, autoclose : true})
		.on('changeMonth',function(e) {
       						$("#goal_duration span").html( e.date.format("mmmm yyyy"));
       						 callback();

       						}).datepicker("setDate", new Date());

				callback();
}

function toggle_admin_user_bulk_actions_delete(clicked_ele, isBulk, isCampaign)
{
	$("#bulk-action-btns button").addClass("disabled");
	if ($(clicked_ele).is(':checked'))
	{
		$("#bulk-action-btns button").removeClass("disabled");

	}
	else
	{
		if (isBulk)
		{
			$("#bulk-action-btns button").addClass("disabled");

			return;
		}

		var check_count = 0
		$.each($('.tbody_check'), function(index, element)
		{
			if ($(element).is(':checked'))
			{
				check_count++;
				return false;
			}
			// return;
		});

		if (check_count == 0)
		{
			$("#bulk-action-btns button").addClass("disabled");
		}
	}
}

function getDomainFromURL(){
	var temp = window.location.host.split("-dot");
	if(temp.length == 1)
		temp = window.location.host.split(".");
	if(temp.length == 1)
		return "my";
	return temp[0];
}

var AccountPrefs_Events_Model_View = Base_Model_View.extend({
    events: {
    	
    	'click .invoice_option' : 'toggleInvoiceOption',
    	'click .saveAdminSettings' : 'saveadminsettings' ,
    	'change #target_list' : 'changeCurrencyPopUp'

    },
 	//  event to save admin settings 
	saveadminsettings : function(el){
		console.log(el);
		var json = serializeForm("accountPrefs");
		console.log(json);
	},

	toggleInvoiceOption :  function(e)
	{
		e.preventDefault();
		var target_el = $(e.currentTarget);
		$(target_el).toggleClass("fa-toggle-off fa-toggle-on");
		var checkbox_el = $("#sendInvoiceBeforeCharge");
		if(checkbox_el.is(':checked'))
			checkbox_el.removeAttr("checked");
		else
			checkbox_el.attr("checked","checked");

	},
	changeCurrencyPopUp : function(e){
		e.preventDefault();
		console.log($(e));
		showModalConfirmation(
					"Admin Settings",
					"Changing currency will affect deal reporting. Do you want to change the currency?",
					function()
					{
					
					},function()
					{
						var currency = ACCOUNT_PREFS.currency ;
						$('#target_list').val(currency) ;
						return;
					}, function()
					{
						return;
					}, "Yes", "No");
	}
});

function showSSO(){
	$(".enale-sso").on("click",function(){
		$(".showsso").removeClass("hide");
		$(".sso-btn").addClass("hide");
		SHOW_SSO_FORM = true;
	});
}
