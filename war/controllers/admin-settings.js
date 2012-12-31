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
		"milestones" : "milestones"
	},

	/**
	 * Shows admin activities options. Checks internally if the user has admin
	 * access
	 * 
	 */
	adminSettings : function() {
		this.adminView = new Base_Model_View({
			url : "/core/api/current-user",
			template : "admin-settings"
		});

		this.adminView.model.fetch();
		$('#content').html(this.adminView.render().el);

	},

	/**
	 * Loads a template to show account preferences, with "subscription" option
	 * to change the plan
	 */
	accountPrefs : function() {
		var view = new Base_Model_View({
			url : '/core/api/account-prefs',
			template : "admin-settings-account-prefs"
		});

		$('#content').html(view.render().el);
	},

	/**
	 * Shows list of all the users with an option to add new user
	 */
	users : function() {
		this.usersListView = new Base_Collection_View({
			url : '/core/api/users',
			restKey : "domainUser",
			templateKey : "admin-settings-users",
			individual_tag_name : 'tr'
		});

		this.usersListView.collection.fetch();
		$('#content').html(this.usersListView.el);
	},

	/**
	 * Loads a template to add new user, navigates to users list on adding a
	 * user
	 */
	usersAdd : function() {
		var view = new Base_Model_View({
			url : 'core/api/users',
			template : "admin-settings-user-add",
			isNew : true,
			window : 'users'
		});

		$('#content').html(view.render().el);

	},

	/**
	 * Edits the existing user by verifying whether the users list view is
	 * defined or not
	 */
	userEdit : function(id) {

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

		$('#content').html(view.render().el);
	},

	/**
	 * Shows list of custom fields with an option to add new custom field of
	 * desired type
	 * 
	 */
	customFields : function() {
		this.customFieldsListView = new Base_Collection_View({
			url : '/core/api/custom-fields',
			restKey : "customFieldDefs",
			templateKey : "admin-settings-customfields",
			individual_tag_name : 'tr'
		});

		this.customFieldsListView.collection.fetch();
		$('#content').html(this.customFieldsListView.el);
	},

	/**
	 * Loads java-script API to make the user able to track page views on users
	 * site, add/delete contacts from users website or blog directly. Loads
	 * minified prettify.js to prettify analytics code.
	 */
	analyticsCode : function() {
		head.js('lib/prettify-min.js', function() {
			var view = new Base_Model_View({
				url : '/core/api/api-key',
				template : "admin-settings-api-key-model",
				postRenderCallback : function(el) {
					prettyPrint();
				}
			});
			$('#content').html(view.el);
		});
	},

	/**
	 * Shows API-KEY. Loads minified prettify.js to prettify the view
	 */
	api : function() {
		head.js('lib/prettify-min.js', function() {
			var view = new Base_Model_View({
				url : '/core/api/api-key',
				template : "admin-settings-api-model",
				postRenderCallback : function(el) {
					prettyPrint();
				}
			});
			$('#content').html(view.el);
		});
	},

	/**
	 * Creates a Model to show and edit milestones, reloads the page on save
	 * success
	 */
	milestones : function() {
		var view = new Base_Model_View({
			url : '/core/api/milestone',
			template : "admin-settings-milestones",
			reload : true
		});

		$('#content').html(view.render().el);
	},
});
