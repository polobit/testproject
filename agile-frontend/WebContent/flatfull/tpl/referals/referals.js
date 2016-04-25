

Referals_HARD_RELOAD = true;
var REFER_DATA;

var ReferalsRouter = Backbone.Router.extend({		
	/* Referrals */
		"refer" : "refer",
		"refer-friends" : "referFriends",
		"users-refered" : "userrefered",
},
initialize : function()
	{
		
	},
	 refer : function()
	{
		Agile_GA_Event_Tracker.track_event("Refer");
		load_facebook_lib_for_referrals();
		$.ajax({
			url : 'core/api/refer',
			type : 'GET',
			dataType : 'json',
			success : function(data){
				REFER_DATA = data;
				getTemplate("refer-modal", {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#referModal').html($(template_ui));
					getTemplate("refer-modal-body", data, undefined, function(template_ui1){
						if(!template_ui1)
							  return;
						$('#referModal').find(".modal-body").html($(template_ui1));
						$('#referModal').modal("show");
					}, null);
				}, null);
			}
		});

	},

	referFriends : function()
	{
		var subject = "I am using Agile CRM and I really love it! Try it now.";
		var body = "Hi,<br><br>I am using Agile CRM and I really love it!<br><br>It is a combination of important features like email marketing, call campaign, online scheduling, landing pages, Web rules and many others. This service is true value for money!<br><br>What to try it? Let's start by signing up with below link:<br>http://www.agilecrm.com/pricing?utm_source=affiliates&utm_medium=web&utm_campaign="+CURRENT_DOMAIN_USER.domain+"<br><br>Best Regards";
		sendMail(undefined,subject,body,undefined,undefined,this);
	},

	/**
	 * Fetches all the Users refered by the current domain user and show the plan 
	 * the new users subscribed to and dispaly the time when they had created
	 */
	userrefered : function()
	{
		console.log("userrefered");
		var Subscribers = new Base_Collection_View({ url :'/core/api/refer/refered_domains',  templateKey : "users-refered"
			});
		$('#content').html(Subscribers.render().el);
	}
	