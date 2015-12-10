email = null;
/**
 * Creates a backbone router to perform admin activities (account preferences,
 * users management, custom fields, milestones and etc..).
 * 
 */
var AdminPanelRouter = Backbone.Router.extend({

	routes : {

	// from adminpanel these routers will be effected
	"domainSubscribe" : "domainSubscribeDetails",

	"domainSubscribe/:id" : "domainSubscribeDetails",

	// from admin panel subscription for particular domain will be
	// done
	"purchase-plan-formAdminPanel" : "purchasePlanFromAdminpanel",

	/* All Domain Users */
	"all-domain-users" : "allDomainUsers",

	// change password
	"change-password-admin/:id" : "changePasswordadmin",

	// get domain details

	"getDomainUserDetails/:id" : "getDomainUserDetails",
		
	
	
	

	},

	// function will be called from getDomainDetails Navigation
	// todisplay get domain stats object for particular domain

	get_account_stats_for_domain_from_adminpanel : function(el, domainname)
	{
		console.log("in accountstats object");
		console.log(domainname);
		$.ajax({ url : 'core/api/admin_panel/getdomainstats?d=' + domainname, type : 'GET', success : function(data)
		{
			console.log(data);
			
			var emails = data.emailcount;
			data.emailcount = JSON.parse(data.emailcount);
			$(el).find('#account').html(getTemplate("domain-info", data));
			$(el).find('#emailcount').html(getTemplate("email-stats", JSON.parse(emails)));
			$(".delete-namespace").attr("data", domainname);
		}, error : function(response)
		{

			console.log(response);
		} });

	},
	
	
	

	// function will be called from getDomainDetails Navigation
	// todisplay get subscription object for particular domain
	get_customerobject_for_domain_from_adminpanel : function(el, domainname)
	{
		var that = this;

		$.ajax({ url : 'core/api/admin_panel/getcustomer?d=' + domainname, type : 'GET', success : function(data)
		{
			console.log("ssssssssssssssssssssssss");
			console.log(data);
			$(el).find('#planinfo').html(getTemplate("plan-info", data));
			
			if (data == null || data == "" || data == undefined)
			{

				$("#login_id").attr("href", "https://" + domainname + ".agilecrm.com/login");
			}
			
			else
				that.get_collection_of_charges_for_customer_from_adminpanel(el, data.id);
		} });

	},

	// function will be called from getDomainDetails Navigation
	// to display get collection of invoices for particular domain

	get_collection_of_invoices_for_domain_from_adminpanel : function(el, domainname)
	{
		this.invoicecollection = new Base_Collection_View({ url : "core/api/admin_panel/getinvoices?d=" + domainname, templateKey : "admin-invoice",

		individual_tag_name : 'tr' });
		this.invoicecollection.collection.fetch();

		$('.past-invoicecollection', el).html(this.invoicecollection.render().el);
	},

	// gets collection of charges of aa paricular customer based on
	get_collection_of_charges_for_customer_from_adminpanel : function(el, customerid)
	{
		this.chargecollection = new Base_Collection_View({ url : "core/api/admin_panel/getcharges?d=" + customerid, templateKey : "admin-charge",

		individual_tag_name : 'tr',sortKey : 'createdtime', descending : true });
		this.chargecollection.collection.fetch();

		$('.past-chargecollection', el).html(this.chargecollection.render().el);
	},

	// router to fill domain details template from admin panel
	getDomainUserDetails : function(id)
	{

		var self = this;
		var domainname;
		this.usersListViewCollection = new Base_Collection_View({ url : 'core/api/admin_panel/getParticularDomainUsers?d=' + id, templateKey : "all-domain",
			individual_tag_name : 'tr', postRenderCallback : function(el)
			{
				head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
				{
					$(".last-login-time", el).timeago();
				});

				var mod_collection = self.usersListViewCollection.collection.models;
			
				
				domainname = mod_collection[0].get('domain');
				email = mod_collection[0].get('email');
				self.get_customerobject_for_domain_from_adminpanel(el, domainname);
				$('#account').html("<img src='img/21-0.gif'>");
				self.get_account_stats_for_domain_from_adminpanel(el, domainname);

			},

		});
		this.usersListViewCollection.collection.fetch();

		$('#content').html(this.usersListViewCollection.el);

	},

	// used to change password for particular user from admin panel
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

					// Disables save button to prevent multiple
					// click
					// event issues
					disable_save_button($(saveBtn));

					var form_id = $(this).closest('form').attr("id");

					if (!isValidForm('#' + form_id))
					{

						// Removes disabled attribute of save
						// button
						enable_save_button($(saveBtn));
						return false;
					}

					// Show loading symbol until model get saved
					$('#changePasswordForm').find('span.save-status').html(getRandomLoadingImg());

					var json = serializeForm(form_id);

					$.ajax({
						url : '/core/api/admin_panel/changepassword/' + id,
						type : 'PUT',
						data : json,
						success : function()
						{
							add_password_change_info_as_note_to_owner(email);
							Backbone.history.navigate("all-domain-users", { trigger : true });
							showNotyPopUp("information", "password changed successfully", "top");
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
	 * Creates a Model to show All Domain Users.
	 */
	allDomainUsers : function()
	{
		allDomainUsersCollectionView = new Base_Collection_View({ url : 'core/api/admin_panel/getAllDomainUsers', templateKey : "all-domain-users",
			individual_tag_name : 'tr', cursor : true, page_size : 25 });

		allDomainUsersCollectionView.collection.fetch();
		$('#content').html(allDomainUsersCollectionView.el);
	},

	// subscription
	domainSubscribeDetails : function(id)
	{

		var subscribe_plan = new Base_Model_View({ url : "core/api/admin_panel/subscriptionofparticulardomain?d=" + id,
			template : "all-domain-admin-subscribe-new", window : 'domainSubscribe',
			/*
			 * postRenderCallback : function(el) { // Setup account statistics
			 * set_up_account_stats(el); // Load date and year for card expiry
			 * card_expiry(el); // Load countries and respective states
			 * head.js(LIB_PATH + 'lib/countries.js', function() {
			 * print_country($("#country", el)); }); },
			 */
			postRenderCallback : function(el)
			{
				var data = subscribe_plan.model.toJSON();

				// console.log(data.get('billing_data_json_string'));

				// Setup account statistics
				set_up_account_stats(el);

				if (!$.isEmptyObject(data))
				{
					USER_BILLING_PREFS = data;
					USER_CREDIRCARD_DETAILS = subscribe_plan.model.toJSON().billingData;
					console.log(USER_CREDIRCARD_DETAILS);
					element = setPriceTemplete(data.plan.plan_type, el);
				}

				else
					element = setPriceTemplete("free", el);

				// Show Coupon code input field
				id = (id && id == "coupon") ? id : "";
				showCouponCodeContainer(id);

				head.load(CSS_PATH + "css/misc/agile-plan-upgrade.css", LIB_PATH + 'lib/jquery.slider.min.js', function()
				{
					if ($.isEmptyObject(data))
						setPlan("free");
					else
						setPlan(data);
					load_slider(el);
				});
			} });
		$('#content').html(subscribe_plan.render().el);
	},

	purchasePlanFromAdminpanel : function()
	{
		// If plan is not defined i.e., reloaded, or plan not chosen
		// properly,
		// then page is navigated back to subcription/ choose plan page
		if (!plan_json.plan)
		{
			this.navigate("all-domain-users", { trigger : true });

			return;
		}

		var window = this;
		// Plan json is posted along with credit card details
		var plan = plan_json

		var upgrade_plan = new Base_Model_View({ url : "core/api/admin_panel/upgradesubscription", template : "admin-purchase-plan", isNew : true, data : plan,
			postRenderCallback : function(el)
			{
				// Discount
				showCouponDiscountAmount(plan_json, el);

				card_expiry(el);
				head.js(LIB_PATH + 'lib/countries.js', function()
				{
					print_country($("#country", el));
				});
			}, saveCallback : function(data)
			{
				window.navigate("domainSubscribe/" + plan.domain_name, { trigger : true });
				add_plan_change_info_as_note_to_owner(email,plan.plan_type,plan.plan_id,plan.quantity);
				showNotyPopUp("information", "You have been upgraded successfully. Please logout and login again for the new changes to apply.", "top");
			}

		});

		// Prepend Loading
		$('#content').html(upgrade_plan.render().el);
		$(".active").removeClass("active");
		// $("#fat-menu").addClass("active");
	}

});
