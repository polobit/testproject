/**
 * When Admin settings are triggered to check whether the current user has admin privilege. 
 */
var isAdmintemplate;
$(function() {
	this.adminView = new Base_Model_View({
		url : "/core/api/users/current-user",
		data : CURRENT_DOMAIN_USER,
		template : "admin-settings"
	});
	isAdmintemplate = this.adminView.render(true).el;
});

/**
 * Appends Admin tabs to the page even when refreshed the page.
 * @param callback
 */
function getAdminSettings(callback){
	App_Admin_Settings.adminViewTemp = new Base_Model_View({
		url : "/core/api/users/current-user",
		data : CURRENT_DOMAIN_USER,
		template : "admin-settings"
	});

	if (callback && typeof (callback) === "function") {
		// execute the callback, passing parameters as
		// necessary
		$('#content').html(App_Admin_Settings.adminViewTemp.render(true).el);
		callback();
	}
}


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
		"users" : "users",
		"users-add" : "usersAdd",
		"user-edit/:id" : "userEdit",

		/* Custom fields */
		"custom-fields" : "customFields",

		/* Api & Analytics */
		"api" : "api",
		"analytics-code" : "analyticsCode",

		/* Milestones */
		"milestones" : "milestones",
		
		/* All Domain Users */
		"all-domain-users" : "allDomainUsers",
		
		/* Menu settings - select modules on menu bar*/
		"menu-settings":"menu_settings",
			
		/* Mandrill Email Activity*/
		"email-stats" : "emailStats",
		"contact-sync" : "contactSync"
	},
	
	/**
		Show menu-settings modules selection ( calendar, cases, deals, campaign ) & saving option
		@author Chandan
	**/
	menu_settings : function()
	{
		$('#content').html(isAdmintemplate);
		var view = new Base_Model_View({
			url : '/core/api/navbarsets',
			template : "admin-settings-menu-settings",
			reload : true
		});

        if(($('#content').find('#admin-prefs-tabs-content').html()) == null){
        	console.log("nooooooooooooo ele accountPrefs");
        	getAdminSettings(function(){
        		App_Admin_Settings.menu_settings();
        	});
        }
		$('#content').find('#admin-prefs-tabs-content').html(view.render().el);
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.menu-settings-tab').addClass('active');
	},

	/**
	 * Shows admin activities options. Checks internally if the user has admin
	 * access
	 * 
	 */
/*	adminSettings : function() {
		
		this.adminView = new Base_Model_View({
			url : "/core/api/users/current-user",
			template : "admin-settings"
		});

		this.adminView.model.fetch();
		$('#content').html(this.adminView.render().el);

	},*/

	/**
	 * Loads a template to show account preferences, with "subscription" option
	 * to change the plan
	 */
	accountPrefs : function() {
		$('#content').html(isAdmintemplate);
		var view = new Base_Model_View({
			url : '/core/api/account-prefs',
			template : "admin-settings-account-prefs"
		});

		//$('#content').html(view.render().el);
        if(($('#content').find('#admin-prefs-tabs-content').html()) == null){
        	console.log("nooooooooooooo ele accountPrefs");
        	getAdminSettings(function(){
        		App_Admin_Settings.accountPrefs();
        	});
        }
		$('#content').find('#admin-prefs-tabs-content').html(view.render().el);
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.account-prefs-tab').addClass('active');
	},

	/**
	 * Shows list of all the users with an option to add new user
	 */
	users : function() {
		$('#content').html(isAdmintemplate);
		this.usersListView = new Base_Collection_View({
			url : '/core/api/users',
			restKey : "domainUser",
			templateKey : "admin-settings-users",
			individual_tag_name : 'tr',
			postRenderCallback : function(el) {
            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
           		 $(".last-login-time", el).timeago();
             	});
			}
		});
		this.usersListView.collection.fetch();
		
		//$('#content').html(this.usersListView.el);
        if(($('#content').find('#admin-prefs-tabs-content').html()) == null){
        	console.log("nooooooooooooo ele users");
        	getAdminSettings(function(){
        		App_Admin_Settings.users();
        	});
        }
		$('#content').find('#admin-prefs-tabs-content').html(this.usersListView.el);
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.users-tab').addClass('active');
	},

	/**
	 * Loads a template to add new user, navigates to users list on adding a
	 * user
	 */
	usersAdd : function() {
		$('#content').html(isAdmintemplate);
		var view = new Base_Model_View({
			url : 'core/api/users',
			template : "admin-settings-user-add",
			isNew : true,
			window : 'users',
			postRenderCallback: function(el) {
				if(view.model.get("id"))
					addTagAgile("User invited");
			}
		});

		//$('#content').html(view.render().el);
        if(($('#content').find('#admin-prefs-tabs-content').html()) == null){
        	console.log("nooooooooooooo ele usersAdd");
        	getAdminSettings(function(){
        		App_Admin_Settings.usersAdd();
        	});
        }
		$('#content').find('#admin-prefs-tabs-content').html(view.render().el);
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.users-tab').addClass('active');

	},

	/**
	 * Edits the existing user by verifying whether the users list view is
	 * defined or not
	 */
	userEdit : function(id) {
		$('#content').html(isAdmintemplate);
		// If users list is not defined then take back to users template
		if (!this.usersListView || !this.usersListView.collection.get(id)) {
			this.navigate("users", {
				trigger : true
			});
			return;
		}

		// Gets user from the collection based on id
		var user = this.usersListView.collection.get(id);

		/*
		 * Creates a Model for users edit, navigates back to 'user' window on
		 * save success
		 */
		var view = new Base_Model_View({
			url : 'core/api/users',
			model : user,
			template : "admin-settings-user-add",
			window : 'users'
		});

		//$('#content').html(view.render().el);
        if(($('#content').find('#admin-prefs-tabs-content').html()) == null){
        	console.log("nooooooooooooo ele userEdit");
        	getAdminSettings(function(){
        		App_Admin_Settings.userEdit(id);
        	});
        }
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
	customFields : function() {
		$('#content').html(isAdmintemplate);
		this.customFieldsListView = new Base_Collection_View({
			url : '/core/api/custom-fields',
			restKey : "customFieldDefs",
			templateKey : "admin-settings-customfields",
			individual_tag_name : 'tr'
		});

		this.customFieldsListView.collection.fetch();
		//$('#content').html(this.customFieldsListView.el);
        if(($('#content').find('#admin-prefs-tabs-content').html()) == null){
        	console.log("nooooooooooooo ele customFields");
        	getAdminSettings(function(){
        		App_Admin_Settings.customFields();
        	});
        }
		$('#content').find('#admin-prefs-tabs-content').html(this.customFieldsListView.el);
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.custom-fields-tab').addClass('active');
	},

	/**
	 * Loads java-script API to make the user able to track page views on users
	 * site, add/delete contacts from users website or blog directly. Loads
	 * minified prettify.js to prettify analytics code.
	 */
	analyticsCode : function() {
		head.js(LIB_PATH + 'lib/prettify-min.js', function() {
			var view = new Base_Model_View({
				url : '/core/api/api-key',
				template : "admin-settings-api-key-model",
				postRenderCallback : function(el) {
					prettyPrint();
				}
			});
			$('#content').html(isAdmintemplate);
	        $('#admin-prefs-tabs-content').html(view.el);
	        $('#AdminPrefsTab .active').removeClass('active');
	        $('.analytics-code-tab').addClass('active');
			//$('#content').html(view.el);
		});
	},

	/**
	 * Shows API-KEY. Loads minified prettify.js to prettify the view
	 */
	api : function() {
		head.js(LIB_PATH + 'lib/prettify-min.js', function() {
			var view = new Base_Model_View({
				url : '/core/api/api-key',
				template : "admin-settings-api-model",
				postRenderCallback : function(el) {
					prettyPrint();
				}
			});
			$('#content').html(isAdmintemplate);
	        $('#admin-prefs-tabs-content').html(view.el);
	        $('#AdminPrefsTab .active').removeClass('active');
	        $('.analytics-code-tab').addClass('active');
			//$('#content').html(view.el);
		});
	},

	/**
	 * Creates a Model to show and edit milestones, reloads the page on save
	 * success
	 */
	milestones : function() {
		$('#content').html(isAdmintemplate);
		var view = new Base_Model_View({
			url : '/core/api/milestone',
			template : "admin-settings-milestones",
			reload : true,
			postRenderCallback : function(el) {
				setup_milestones();
			}
		});
		//$('#content').html(view.render().el);
        if(($('#content').find('#admin-prefs-tabs-content').html()) == null){
        	console.log("nooooooooooooo ele milestones");
        	getAdminSettings(function(){
        		App_Admin_Settings.milestones();
        	});
        }
		$('#content').find('#admin-prefs-tabs-content').html(view.render().el);
        $('#content').find('#AdminPrefsTab .active').removeClass('active');
        $('#content').find('.milestones-tab').addClass('active');
	},
	
	/**
	 * Creates a Model to show All Domain Users.
	 **/
	allDomainUsers : function(){
		allDomainUsersCollectionView = new Base_Collection_View({
			url : 'core/api/users/admin/domain-users',
			templateKey : "all-domain-users",
			individual_tag_name : 'tr',
			cursor : true,
			page_size : 25
		});
		
	allDomainUsersCollectionView.collection.fetch();
    $('#content').html(allDomainUsersCollectionView.el);
	},
	
	/**
	 * Fetches Mandrill subaccount usage info.
	 **/
	emailStats: function(){
		var emailStatsModelView = new Base_Model_View({
			url: 'core/api/emails/email-stats',
			template : 'admin-settings-email-stats',
		});
		
		$('#content').find('#admin-prefs-tabs-content').html(emailStatsModelView.render().el);
        $('#content').find('#AdminPrefsTab .active').removeClass('active');
        $('#content').find('.stats-tab').addClass('active');
		
	},
	contactSync : function() {
		this.contact_sync_google = new Base_Model_View({
			url: 'core/api/contactprefs/google',
			template : 'import-google-contacts',
		});
		
		$('#content').html(isAdmintemplate);
		$('#content').find('#admin-prefs-tabs-content').html(this.contact_sync_google .render().el);
        $('#content').find('#AdminPrefsTab .active').removeClass('active');
        $('#content').find('.sync-tab').addClass('active');
	}
});