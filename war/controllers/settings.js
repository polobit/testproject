
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
    
    /** Gets Preferences*/
    settings: function () {
        var html = getTemplate("settings", {});
        $('#content').html(html);

        // Update Menu
        $(".active").removeClass("active");
        $("#settingsmenu").addClass("active");
    },
       
    /** Gets Personal Preferences form and sets HTML Editor.*/
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
    /** Gets LinkedIn and Twitter preferences to get access*/
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
    
    /** Gets Gmail and IMAP preferences to get access for user mails*/
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
    /** Gets list of email templates */
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
    /** Saves new email-template. Sets HTMLEditor for the form.*/
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
    /** Updates existing email-template. After email-template updated, the page 
     *  should navigate to email-templates list
     *  
     *  @param id EmailTemplates Id 
     *  */
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
    		reload: true
    	});
    	
    	$('#content').html(view.render().el);
    },
    contactUsEmail:function(){
    	$("#content").html(getTemplate("help-mail-form"),{});
    }
    
    
});
