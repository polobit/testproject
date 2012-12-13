
var SettingsRouter = Backbone.Router.extend({

    routes: {        
        /* Settings */
    	"settings": "settings", 
        "user-prefs": "userPrefs",
        "social-prefs": "socialPrefs",
        "email-templates": "emailTemplates",
        "email-template-add": "emailTemplateAdd",
        "email-template/:id": "emailTemplateEdit",
        "email": "email",
        "notification-prefs":"notificationPrefs",
        
        /* contact-us help email */
        "contact-us":"contactUsEmail"
    },
    
    settings: function () {
        var html = getTemplate("settings", {});
        $('#content').html(html);

        // Update Menu
        $(".active").removeClass("active");
        $("#settingsmenu").addClass("active");
    },
       
    userPrefs: function () {
        var view = new Base_Model_View({
            url: '/core/api/user-prefs',
            template: "settings-user-prefs",
            reload: true,
            postRenderCallback: function(el){
            	 // Setup HTML Editor
                setupHTMLEditor($('#WYSItextarea'));
            }
        });

        $('#content').html(view.render().el);
        
       
    },
    socialPrefs: function () {
        var data = {
            "service": "linkedin"
        };
        var itemView = new Base_Model_View({
            url: '/core/api/social-prefs/LINKEDIN',
            template: "settings-social-prefs",
            data: data
        });

        $('#content').html(itemView.render().el);

        data = {
            "service": "twitter"
        };
        var itemView2 = new Base_Model_View({
            url: '/core/api/social-prefs/TWITTER',
            template: "settings-social-prefs",
            data: data
        });

        $('#content').append(itemView2.render().el);

    },
    
    email: function () {
        // Get Social Prefs (Same as Linkedin/Twitter) for Gmail
        var data = {
            "service": "gmail",
            "return_url": encodeURIComponent(window.location.href)
        };
        var itemView = new Base_Model_View({
            url: '/core/api/social-prefs/GMAIL',
            template: "settings-social-prefs",
            data: data
        });
        
        console.log(itemView.model.toJSON());

        // Add Gmail Prefs
        $('#content').html(itemView.render().el);

        // Get IMAP Prefs
        var itemView2 = new Base_Model_View({
            url: '/core/api/imap',
            template: "settings-imap-prefs"
        });

        // Add IMAP
        $('#content').append(itemView2.render().el);

    },
    emailTemplates: function () {
        this.emailTemplatesListView = new Base_Collection_View({
            url: '/core/api/email/templates',
            restKey: "emailTemplates",
            templateKey: "settings-email-templates",
            individual_tag_name: 'tr'
        });
        
        this.emailTemplatesListView.collection.fetch();
        $('#content').html(this.emailTemplatesListView.el);
     
    },
    emailTemplateAdd: function () {
    	var view = new Base_Model_View({
            url: '/core/api/email/templates',
            template: "settings-email-template-add", 
            window: 'email-templates',
            postRenderCallback: function(el){
           	 // Setup HTML Editor
               setupHTMLEditor($('#email-template-html'));
           }
         });
        $('#content').html(view.render().el);       
    },
    emailTemplateEdit: function(id){
 
    	if (!this.emailTemplatesListView || this.emailTemplatesListView.collection.length == 0) {
    		console.log("true");
            this.navigate("email-templates", {
                trigger: true
            });
    	}    
            var currentTemplate = this.emailTemplatesListView.collection.get(id);
  
               var view = new Base_Model_View({
                   url: '/core/api/email/templates',
                   model: currentTemplate,
                   template: "settings-email-template-add",
                   window: 'email-templates',
                   postRenderCallback: function(el){
                     	 // Setup HTML Editor
                         setupHTMLEditor($('#email-template-html'));
                     }
               });
               
                var view = view.render();
                $("#content").html(view.el);  
    	  
    },
    /**
     * Sends request to NotificationsAPI to get notification preferences and
     *  render with obtained notification preferences
     * **/
    notificationPrefs: function(){
    	
    	var view = new Base_Model_View({
    		url: 'core/api/notifications',
    		template: 'settings-notification-prefs',
    	});
    	
    	$('#content').html(view.render().el);
    },
    contactUsEmail:function(){
    	$("#content").html(getTemplate("help-mail-form"),{});
    }
    
    
});
