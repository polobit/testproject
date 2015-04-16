var _plan_restrictions = {};
$(function() {
	init_acl_restriction();
});

function init_acl_restriction()
{
	_plan_restrictions = {

			billing_restriction : _billing_restriction,
			plan : _billing_restriction.currentLimits,
			is_social_suite :  [ function(){
				return _plan_restrictions.plan.socialSuite;
			},
			function() {
				return {
					"message" : "Please <a href='#subscribe-plan'>upgrade</a> to Regular or Pro plan to use this feature."
				}
			}
			],

			// Emails tags
			is_email_gateway_allowed : [ function() {
				return _plan_restrictions.plan.emailGateway;
			}, function() {
				return {
					"message" : "Please <a href='#subscribe-plan'>upgrade</a> to Pro plan"
				}
			} ],
			
			// Emails tags
			is_sms_gateway_allowed : [ function() {
				return _plan_restrictions.plan.smsgateway;
			}, function() {
				return {
					"message" : "Please <a href='#subscribe-plan'>upgrade</a> to Regular or Pro plan"
				}
			} ],
			is_ecommerce_sync_allowed : [ function() {
				return _plan_restrictions.plan.ecommerceSync;
			},
			function()
			{
				return {
					"message" : "Please <a href='#subscribe-plan'>upgrade</a> to Regular or Pro plan"
				}
			}
			],
			
			is_accounting_sync_allowed : [function(){
				return _plan_restrictions.plan.accountingSync;
			},
			function() {
				return {
					"message" : "Please <a href='#subscribe-plan'>upgrade</a> to Regular or Pro plan"
				}
			}
			],

			// ACLs
			is_ACL_allowed : [ function() {
				return _plan_restrictions.plan.acl;
			}, function() {
				return {
					"message" : " Please <a href=\"#subscribe-plan\">upgrade</a> to Regular or Pro plan to use this feature. "
				}
			} ],
			is_calling_widget : [function(){
				return _plan_restrictions.plan.callingWidget;
			},
			function(){
				return {
					"message" : "Please <a href=\"#subscribe-plan\">upgrade</a> to Regular or Pro plan to use this feature. "
				}
			}
			],
			is_custom_widget : [function(){
				return _plan_restrictions.plan.customWidget;
			},
			function(){
				return {
					"message" : "Please <a href=\"#subscribe-plan\">upgrade</a> to Regular or Pro plan."
				}
			}
			],

			// Calendar
			online_appointment : [ function() {
				return _plan_restrictions.plan.onlineAppointment;

			}, function() {
				return 

			} ],

			// Mobile Integration
			is_mobile_integration : [function() {
				return _plan_restrictions.plan.mobileIntegration;
			},
			function () {
				
			}
			],

			/**
			 * Sync
			 * 
			 */
			// Google sync
			is_google_sync : function() {
				return this.plan.googleSync;
			},

			// Ecommerce Sync
			is_ecommerce_sync : function() {
				return this.plan.ecommerceSync;
			},

			// Payment Sync
			is_payment_sync : function() {
				return this.plan.paymentSync;
			},

			// Repoprts
			is_activity_reports_enabled : [ function() {
				return _plan_restrictions.plan.activityReports;
			}, function() {
				return {
					"message" : "Please <a href='#subscribe-plan'>upgrade</a> <br/> to Pro plan"
				}
			} ],
			is_cohort_reports_enabled : [ function() {
				return _plan_restrictions.plan.cohortReports;
			}, function() {
				return {
					"message" : "Regular/Pro plan only"
				}
			} ],
			process_widgets : function(data) {
				
				var collection = data.where({"is_added" : true});
				if(collection && collection.length >= _plan_restrictions.plan.widgetsLimit)
				{
					var collectionToBlock = data.where({"is_added" : false});
					
					for(var i= 0 ;i < collectionToBlock.length ; i++)
						{
						collectionToBlock[i].set("allowedToAdd", false);
						}
				}
				else if(collection && collection.length == 0)
				{
					var collectionToBlock = data.where({"allowedToAdd" : false});
					
					for(var i= 0 ;i < collectionToBlock.length ; i++)
						{
						collectionToBlock[i].set("allowedToAdd", true);
						}
				}
				console.log(data);
				
				if(!this.is_calling_widget[0]())
				{
					var call_widget_collection = data.where({"is_added" : false, "widget_type" : "CALL"});
					if(call_widget_collection && call_widget_collection.length)
					{
						for(var i = 0; i < call_widget_collection.length ; i++)
						{
							var widget_type= call_widget_collection[i].get("widget_type");
							if(widget_type == "CALL")
								{
									call_widget_collection[i].set("allowedToAdd", false);
								}
						}
					}
				}
			}
		}
		
		$("._upgrade").die().live('click', function(e){
			e.preventDefault();
			var id = $(this).attr('id');
			if(!id)
				return;
			var element = $("." + id);
			
			if(!element || element.length == 0)
				return;
			
			$(element).show().delay(3000).hide(1);;
		})
}

function getDomainUserFromDeserialize(user)
{
	var json = {};
	json["menu_scopes"] = {};
	json ["user_scopes"] = {};
	
	json.menu_scopes["checked"] = true;
	json.menu_scopes["disabled"] = false;
	
	json.user_scopes["checked"] = true;
	json.user_scopes["disabled"] = false;
	
	if(!_plan_restrictions.is_ACL_allowed[0]())
		{
			json.menu_scopes["disabled"] = true;
			json.user_scopes["disabled"] = true;
			return json;
		}
	
	
	if(user && user.id)
		{
			json.menu_scopes["checked"] = false;
			json.menu_scopes["disabled"] = false;
		
			json.user_scopes["checked"] = false;
			json.user_scopes["disabled"] = false;
		}
	
	// If it is new user
	if(user != null && user.id && user.is_admin)
		{
			json.user_scopes["disabled"] = true;
		}
	console.log(user);
	console.log(json);
	return json;
}