var AdminSettingsRouter = Backbone.Router.extend({

    routes: {        
        /* Settings */
    	"account-prefs": "accountPrefs",
        "users": "users",
        "users-add": "usersAdd",
        "user-edit/:id" : "userEdit",
        "custom-fields": "customFields",
        "analytics-code": "analyticsCode",
        "api": "api",
        "admin": "adminSettings", // Yaswanth - 08/03/12,
        "milestones": "milestones"
    },
    
    adminSettings: function()
    {
    	console.log("Admin Settings");
    	
    	// Show admin - checks internally if the user has admin access
    	this.adminView = new Base_Model_View({
    		url: "/core/api/current-user",
    		template: "admin-settings"
    	}); 
    	
    	 this.adminView.model.fetch();
    	$('#content').html(this.adminView.render().el);
    	
    },
    accountPrefs: function () {
        var view = new Base_Model_View({
            url: '/core/api/account-prefs',
            template: "admin-settings-account-prefs"
        });

        $('#content').html(view.render().el);
    },
    users: function () {
    	
    	// Send edit
    	// var data = {'edit_template': 'user-add'};
    	
        this.usersListView = new Base_Collection_View({
            url: '/core/api/users',
            restKey: "domainUser",
            templateKey: "admin-settings-users",
            individual_tag_name: 'tr'
        });

        this.usersListView.collection.fetch();
        $('#content').html(this.usersListView.el);
    },
    usersAdd: function () {
    	
    	var view = new Base_Model_View({
            url: 'core/api/users',
            template: "admin-settings-user-add",
            isNew: true,
            window: 'users'
        });

        $('#content').html(view.render().el);
    	
    },
    userEdit: function (id) {
    	
    	// If users list is not defined then take back to users template
    	if(!this.usersListView || !this.usersListView.collection.get(id))
    		{
    		  this.navigate("users", {
                  trigger: true
              });
              return;
    		}
    	
    	// Get user from the collection based on id
    	var user = this.usersListView.collection.get(id);
    	
    	// Create a Model for users edit for navigate back to 'user' windown an save success 
    	var view = new Base_Model_View({
            url: 'core/api/users',
            model: user,
            template: "admin-settings-user-add",
            window: 'users'
        });

        $('#content').html(view.render().el);
    },
    customFields: function () {
    	
    	this.customFieldsListView = new Base_Collection_View({
            url: '/core/api/custom-fields',
            restKey: "customFieldDefs",
            templateKey: "admin-settings-customfields",
            individual_tag_name: 'tr'
        });

    	this.customFieldsListView.collection.fetch();
        $('#content').html(this.customFieldsListView.el);
    },
    analyticsCode: function () {
    	
    	  head.js('lib/prettify-min.js', function()
    	  {
            var view = new Base_Model_View({
             url: '/core/api/api-key',
                   template: "admin-settings-api-key-model",
                   postRenderCallback: function(el){
                    prettyPrint();
                     }
                }); 
            $('#content').html(view.el);
    	  });
          
    },
    api: function (){
    	head.js('lib/prettify-min.js', function()
    	    	  {
    	             var view = new Base_Model_View({
    	             url: '/core/api/api-key',
    	             template: "admin-settings-api-model",
    	             postRenderCallback: function(el){
    	                    prettyPrint();
    	                     }
    	                }); 
    	            $('#content').html(view.el);
    	    	  });
    },
    milestones: function () {
        var view = new Base_Model_View({
        	url: '/core/api/milestone',
        	template: "admin-settings-milestones",
        	reload: true
        });
        
        $('#content').html(view.render().el);
        },
});
