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
	"integrations" : "integrations",  "change-password-admin/:id" : "changePasswordadmin",
	
	"getDomainUserDetails/:query" : "getDomainUserDetails"
	

	},
	
	
	get_email_count_for_domain_from_adminpanel:  function(domainname)
	{ 
		
		
		$.ajax({
			url: 'core/api/emails/email-stats/adminpanel/'+domainname, 
			type : 'GET',
			success : function(data)
			{
				
				 $("#content").find('#emailscount').html(getTemplate("email-stats", data));
					
				// $("#content").find('#emailscount').html(data.sent_total);
			},
			error : function(response)
			{
				
			} });
		
	},
	
	get_web_rule_count_for_domain_from_adminpanel:  function(domainname)
	{
		
		$.ajax({
			url : '/core/api/webrule/adminpanel/domain/'+domainname,
			type : 'GET',
			success : function(data)
			{
				 $("#content").find('#webrulecount').html(data);
			},
			error : function(response)
			{
				
			} });
		
	},
	
	get_web_stats_count_for_domain_from_adminpanel: function (domainname)
	{
		
		$.ajax({
			url: 'core/api/web-stats/JSAPI-status/adminpanel/'+domainname,
			type : 'GET',
			success : function(data)
			{
				 $("#content").find('#webstats').html(data);
			},
			error : function(response)
			{
				
			} });
	
	},
	
	get_compaigns_count_for_domain_from_adminpanel: function (domainname)
	{
		// Returns web-stats count
		$.ajax({
			 url : '/core/api/workflows/adminpanel/'+domainname,
			type : 'GET',
			success : function(data)
			{
				 $("#content").find('#comapignscount').html(data);
			},
			error : function(response)
			{
				
			} });
	
	},
	
	get_collection_of_invoices_for_domain_from_adminpanel: function (el,domainname)
	{ 
		$.ajax({
			url: 'core/api/subscription/adminpanel/subscription/'+domainname,
			type: 'GET',
			success: function(data) { 
				var that=this;
				console.log(data);
				 $("#content").find('#planinfo').html(getTemplate("plan-info", data));
				
				 $("#domainhref").attr("href", "/#domainSubscribe/"+domainname);
				 this.invoicecollection = new Base_Collection_View({ url :"core/api/subscription/adminpanel/invoices/"+domainname, templateKey : "admin-invoice",
					 
						individual_tag_name : 'tr',postRenderCallback : function(el)
						{
							var arr=that.invoicecollection.collection; 
							var amount=arr.models;
							if(amount.length!=0){
							var total_amount=amount[0].get('total')
							 $("#content").find('#totalamount').html("<h3>Total Amount:"+total_amount+"");
							}
						} });

					// Fetches the invoice payments
				this.invoicecollection.collection.fetch();
			
				console.log(this.invoicecollection.collection.fetch());
				 $("#content").find('.past-invoicecollection').html(this.invoicecollection.el);
				
			}
		});
	
	},
	
	getDomainUserDetails: function(query){
	
		 var domainname="",ownername="";var ar=[];
		this.usersListViewCollection = new Base_Collection_View({ url : '/core/api/users/admin/domain/'+query,  templateKey : "all-domain",
			individual_tag_name : 'tr', postRenderCallback : function(el)
			{
				head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
				{
					$(".last-login-time", el).timeago();
				});
				
				ar=App_Admin_Settings.usersListViewCollection.collection.models; 
				for(var i=0;i<ar.length;i++){
					var mod=ar[i];
			
					if(mod.get('is_account_owner')){
						ownername=mod.get('name');
						domainname=mod.get('domain');
					
						// 
					}
					$("#content").find('#ownername').html(ownername);
					if(domainname==undefined){
						var dom=ar[0];
						domainname=dom.get('domain');
					}
					console.log(domainname+"----------------------------------"+ownername);
					if(domainname!=undefined)
						$("#content").find('.domainname').html("<h3>Domain Name:"+domainname);
				}	
				 $(".delete-namespace").attr("data", domainname);
				 App_Admin_Settings.get_email_count_for_domain_from_adminpanel(domainname);
				 App_Admin_Settings.get_compaigns_count_for_domain_from_adminpanel(domainname);
				 App_Admin_Settings.get_web_rule_count_for_domain_from_adminpanel(domainname);
				 App_Admin_Settings.get_web_stats_count_for_domain_from_adminpanel(domainname);
				App_Admin_Settings.get_collection_of_invoices_for_domain_from_adminpanel(el,domainname);
				
			} });
	this.usersListViewCollection.collection.fetch();
	
	$('#content').html(this.usersListViewCollection.el);
		
	},
	
	
	changePasswordadmin : function(id)
	{
		$("#content").html(getTemplate("settings"), {});

		$('#content').html(getTemplate("settings-change-password-adminpanel"), {});
		
		// Save button action of change password form, If it is out of
		// this router wont navigate properly
		$("#saveNewPasswordFromAdmin").on(
				"click",
				function(e)
				{

					e.preventDefault();
					var saveBtn = $(this);

					// Returns, if the save button has disabled
					// attribute
					if ($(saveBtn).attr('disabled'))
						return;

					// Disables save button to prevent multiple click
					// event issues
					disable_save_button($(saveBtn));

					var form_id = $(this).closest('form').attr("id");

					if (!isValidForm('#' + form_id))
					{

						// Removes disabled attribute of save button
						enable_save_button($(saveBtn));
						return false;
					}
					
					// Show loading symbol until model get saved
					$('#changePasswordForm').find('span.save-status').html(getRandomLoadingImg());

					var json = serializeForm(form_id);

					$.ajax({
						url : '/core/api/user-prefs/admin/changePassword/'+id,
						type : 'PUT',
						data : json,
						success : function()
						{
							$('#changePasswordForm').find('span.save-status').html(
									"<span style='color:green;margin-left:10px;'>Password changed successfully</span>").fadeOut(5000);
							enable_save_button($(saveBtn));
							$('#' + form_id).each(function()
							{
								this.reset();
							});
							history.back(-1);
						},
						error : function(response)
						{
							$('#changePasswordForm').find('span.save-status').html("");
							$('#changePasswordForm').find('input[name="current_pswd"]').closest(".controls").append(
									"<span style='color:red;margin-left:10px;'>Incorrect Password</span>");
							$('#changePasswordForm').find('input[name="current_pswd"]').closest(".controls").find("span").fadeOut(5000);
							$('#changePasswordForm').find('input[name="current_pswd"]').focus();
							enable_save_button($(saveBtn));
						} });

				});
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
	 * Loads a template to add new user, to a particular domain
	 * user
	 */
	
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
		
		var needLogout = false;
		if(CURRENT_DOMAIN_USER.email == user.attributes.email){
			needLogout = true;
		}

		/*
		 * Creates a Model for users edit, navigates back to 'user' window on
		 * save success
		 */
		var view = new Base_Model_View({ url : 'core/api/users', model : user, template : "admin-settings-user-add", saveCallback: function(response){
				// If user changed his own email, redirect it to the login page.
				if(needLogout && CURRENT_DOMAIN_USER.email != response.email){
					console.log('Logging out...');
					showNotyPopUp("information", "You Email has been updated successfully. Logging out...", "top");
					var hash = window.location.hash;
					setTimeout(function(){window.location.href = window.location.protocol + "//" + window.location.host + "/login" + hash;},5000);
				} else {
					Backbone.history.navigate('users', { trigger : true });
				}
					
			}, postRenderCallback: function(el){
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
		$("#content").html(getTemplate("admin-settings"), {});
		head.js(LIB_PATH + 'lib/prettify-min.js', function()
		{
			var view = new Base_Model_View({ url : '/core/api/api-key', template : "admin-settings-api-key-model", postRenderCallback : function(el)
			{
				prettyPrint();
				if(id)
				{
					$(el).find('#APITab a[href="#'+ id +'"]').trigger('click');
				}
				
				//initZeroClipboard("api_track_webrules_code_icon", "api_track_webrules_code");
				//initZeroClipboard("api_key_code_icon", "api_key_code");
				//initZeroClipboard("api_track_code_icon", "api_track_code");

			} });

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
