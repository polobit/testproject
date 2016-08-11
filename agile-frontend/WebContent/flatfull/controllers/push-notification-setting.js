var PushNotificationRouter = Backbone.Router.extend({
	
	routes : { 
		"push-notification" : "pushNotificationSettings",
		"push-notification-add" : "pushNotificationAdd",
		"push-notification-edit/:id" : "pushNotificationEdit" 
	},

	pushNotificationSettings : function()
	{
		console.log("forms collection template");
		
		this.pushNotificationView = new Base_Collection_View({ url : '/core/api/push/notifications', restKey : "pushNotification", templateKey : "push-notification",
			individual_tag_name : 'tr', postRenderCallback : function(el){
				head.js(LIB_PATH + 'lib/jquery.timeago.js', function(el)
						{
							$("time.form-modified-time", el).timeago();
						});
			} })
		this.pushNotificationView.collection.fetch();
		$("#content").html(this.pushNotificationView.el);

		make_menu_item_active("push-notification-menu");
	},

	pushNotificationAdd : function()
	{
		var push_notification_add = new Push_Notification_Event_View({ url : '/core/api/push/notifications', template : "push-notification-add", window : "push-notification", isNew : true,
			
			postRenderCallback : function(el)
			{
			  $("#content").html(el);
			  head.js(LIB_PATH + 'lib/desktop-notify-min.js', function(el)
						{
							if(notify.permissionLevel() != notify.PERMISSION_DENIED)
                    		 $('#push-notification-content').hide();
                   });
				
			} 
		});

		$("#content").html(getRandomLoadingImg());
		push_notification_add.render();
        
        $(".active").removeClass("active");
	
	},

	pushNotificationEdit : function(id)
	{

		if(this.pushNotificationView == undefined){
          	this.navigate("push-notification", { trigger : true });
          	return;
		}

		var pushNotification = this.pushNotificationView.collection.get(id);

		var push_notification_add = new Push_Notification_Event_View({ url : '/core/api/push/notifications', model : pushNotification, template : "push-notification-add", window : "push-notification",
			
			postRenderCallback : function(el)
			{
				$("#content").html(el);
				  head.js(LIB_PATH + 'lib/desktop-notify-min.js', function(el)
						{
							if(notify.permissionLevel() != notify.PERMISSION_DENIED)
                    		 $('#push-notification-content').hide();
                   });

			} });

		$("#content").html(getRandomLoadingImg());
		push_notification_add.render();
		
		$("#notification-title").keyup();
		$("#notification-message").keyup();
		$("#notification-link").keyup();
		$("#notification-icon").change();
        $(".active").removeClass("active");
	
	} 


});
