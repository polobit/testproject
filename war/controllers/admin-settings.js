/**
 * Creates a backbone router to perform admin activities (account preferences,
 * users management, custom fields, milestones and etc..).
 * 
 */
var AdminSettingsRouter = Backbone.Router.extend({

	routes : {
	/* Admin-Settings */
	"admin" : "adminSettings",

	/* Account preferences */
	"account-prefs" : "accountPrefs",

	/* Users */
	"users" : "users", "users-add" : "usersAdd", "user-edit/:id" : "userEdit",

	/* Custom fields */
	"custom-fields" : "customFields",

	/* Api & Analytics */
	"api" : "api", "analytics-code" : "analyticsCode", "analytics-code/:id" : "analyticsCode",

	/* Milestones */
	"milestones" : "milestones",

	/* All Domain Users */
	"all-domain-users" : "allDomainUsers",

	/* Menu settings - select modules on menu bar */
	"menu-settings" : "menu_settings",

	/* Mandrill Email Activity */
	"email-stats" : "emailStats",

	/* Web to Lead */
	"integrations" : "integrations"

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
			$('#content').html("You have no Admin Privileges");
			return;
		}
		$("#content").html(getTemplate("admin-settings"), {});
		var view = new Base_Model_View({ url : '/core/api/menusetting', template : "admin-settings-menu-settings", reload : true });

		$('#content').find('#admin-prefs-tabs-content').html(view.render().el);
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.menu-settings-tab').addClass('active');
	},

	/**
	 * Loads a template to show account preferences, with "subscription" option
	 * to change the plan
	 */
	accountPrefs : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html("You have no Admin Privileges");
			return;
		}
		$("#content").html(getTemplate("admin-settings"), {});
		var view = new Base_Model_View({ url : '/core/api/account-prefs', template : "admin-settings-account-prefs" });

		$('#content').find('#admin-prefs-tabs-content').html(view.render().el);
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.account-prefs-tab').addClass('active');
	},

	/**
	 * Shows list of all the users with an option to add new user
	 */
	users : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html("You have no Admin Privileges");
			return;
		}
		$("#content").html(getTemplate("admin-settings"), {});
		this.usersListView = new Base_Collection_View({ url : '/core/api/users', restKey : "domainUser", templateKey : "admin-settings-users",
			individual_tag_name : 'tr', postRenderCallback : function(el)
			{
				head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
				{
					$(".last-login-time", el).timeago();
				});
			} });
		this.usersListView.collection.fetch();

		$('#content').find('#admin-prefs-tabs-content').html(this.usersListView.el);
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.users-tab').addClass('active');
	},

	/**
	 * Loads a template to add new user, navigates to users list on adding a
	 * user
	 */
	usersAdd : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html("You have no Admin Privileges");
			return;
		}
		$("#content").html(getTemplate("admin-settings"), {});
		var view = new Base_Model_View({ url : 'core/api/users', template : "admin-settings-user-add", isNew : true, window : 'users', reload : true,
			postRenderCallback : function(el)
			{
				if (view.model.get("id"))
					addTagAgile("User invited");
				
				// Binds action 
				bindAdminChangeAction(el);
			} });

		$('#content').find('#admin-prefs-tabs-content').html(view.render().el);
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.users-tab').addClass('active');

	},

	/**
	 * Edits the existing user by verifying whether the users list view is
	 * defined or not
	 */
	userEdit : function(id)
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html("You have no Admin Privileges");
			return;
		}
		$("#content").html(getTemplate("admin-settings"), {});

		// If users list is not defined then take back to users template
		if (!this.usersListView || !this.usersListView.collection.get(id))
		{
			this.navigate("users", { trigger : true });
			return;
		}

		// Gets user from the collection based on id
		var user = this.usersListView.collection.get(id);

		/*
		 * Creates a Model for users edit, navigates back to 'user' window on
		 * save success
		 */
		var view = new Base_Model_View({ url : 'core/api/users', model : user, template : "admin-settings-user-add", window : 'users', reload : true, postRenderCallback: function(el){
			bindAdminChangeAction(el);
		} });

		$('#content').find('#admin-prefs-tabs-content').html(view.render().el);
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.users-tab').addClass('active');

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
			$('#content').html("You have no Admin Privileges");
			return;
		}
		$("#content").html(getTemplate("admin-settings"), {});
		this.customFieldsListView = new Base_Collection_View({ url : '/core/api/custom-fields', restKey : "customFieldDefs",
			templateKey : "admin-settings-customfields", individual_tag_name : 'tr' });

		this.customFieldsListView.collection.fetch();

		$('#content').find('#admin-prefs-tabs-content').html(this.customFieldsListView.el);
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.custom-fields-tab').addClass('active');
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
			$('#content').html("You have no Admin Privileges");
			return;
		}
		head.js(LIB_PATH + 'lib/prettify-min.js', LIB_PATH + 'lib/zeroclipboard/ZeroClipboard.js', function()
		{
			var view = new Base_Model_View({ url : '/core/api/api-key', template : "admin-settings-api-key-model", postRenderCallback : function(el)
			{
				prettyPrint();
				if(id)
				{
					$(el).find('#APITab a[href="#'+ id +'"]').trigger('click');
				}
				
				initZeroClipboard("api_track_webrules_code_icon", "api_track_webrules_code");
				initZeroClipboard("api_key_code_icon", "api_key_code");
				initZeroClipboard("api_track_code_icon", "api_track_code");

			} });
			$("#content").html(getTemplate("admin-settings"), {});
			$('#content').find('#admin-prefs-tabs-content').html(view.el);
			$('#content').find('#AdminPrefsTab .active').removeClass('active');
			$('#content').find('.analytics-code-tab').addClass('active');
			// $('#content').html(view.el);
		});
	},

	/**
	 * Shows API-KEY. Loads minified prettify.js to prettify the view
	 */
	api : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html("You have no Admin Privileges");
			return;
		}
		head.js(LIB_PATH + 'lib/prettify-min.js', function()
		{
			var view = new Base_Model_View({ url : '/core/api/api-key', template : "admin-settings-api-model", postRenderCallback : function(el)
			{
				prettyPrint();
			} });
			$("#content").html(getTemplate("admin-settings"), {});
			$('#content').find('#admin-prefs-tabs-content').html(view.el);
			$('#content').find('#AdminPrefsTab .active').removeClass('active');
			$('#content').find('.analytics-code-tab').addClass('active');
			// $('#content').html(view.el);
		});
	},

	/**
	 * Creates a Model to show and edit milestones, reloads the page on save
	 * success
	 */
	milestones : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html("You have no Admin Privileges");
			return;
		}
		$("#content").html(getTemplate("admin-settings"), {});
		var view = new Base_Model_View({ url : '/core/api/milestone', template : "admin-settings-milestones", reload : true, postRenderCallback : function(el)
		{
			setup_milestones();
		} });

		$('#content').find('#admin-prefs-tabs-content').html(view.render().el);
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.milestones-tab').addClass('active');
	},

	/**
	 * Fetches Mandrill subaccount usage info.
	 */
	emailStats : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html("You have no Admin Privileges");
			return;
		}
		$("#content").html(getTemplate("admin-settings"), {});
		var emailStatsModelView = new Base_Model_View({ url : 'core/api/emails/email-stats', template : 'admin-settings-email-stats', });

		$('#content').find('#admin-prefs-tabs-content').html(emailStatsModelView.render().el);
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.stats-tab').addClass('active');

	},

	/**
	 * Web to lead links to website pages
	 */
	integrations : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html("You have no Admin Privileges");
			return;
		}
		$("#content").html(getTemplate("admin-settings"), {});
		$('#content').find('#admin-prefs-tabs-content').html(getTemplate("admin-settings-web-to-lead"), {});
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.integrations-tab').addClass('active');
	},


	/**
	 * Creates a Model to show All Domain Users.
	 */
	allDomainUsers : function()
	{
		allDomainUsersCollectionView = new Base_Collection_View({ url : 'core/api/users/admin/domain-users', templateKey : "all-domain-users",
			individual_tag_name : 'tr', cursor : true, page_size : 25 });

		allDomainUsersCollectionView.collection.fetch();
		$('#content').html(allDomainUsersCollectionView.el);
	} });
