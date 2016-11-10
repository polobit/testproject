/**
 * Creates backbone router for Case create, read and update operations
 */
var AFFILIATE_DETAILS;
var AffiliateRouter = Backbone.Router.extend({

	routes : {
		"affiliate-overview" : "showCommissionDetails",
		"affiliate-referrals" : "listAffiliates" ,
	 	"affiliate-register" : "showaffiliateDetails",
	 	"affiliate-creatives" : "creatives",
	 	"affiliate-deals" : "registeredDeals",
	 	"admin-affiliate" : "listAffiliateDetails",
	 	"admin-affiliate-referrals" : "adminListAffiliates"
	},

	showCommissionDetails : function(){
		var that = this;
		$("#prefsDropdownModal").modal("hide")
		checkForAffiliateDetails(function(){
			getTemplate('affiliate', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));
				that.commissionDetailsView = new Base_Model_View({ url : 'core/api/affiliate/total?userId='+CURRENT_DOMAIN_USER.id, template : "affiliate-commission-details",
				    postRenderCallback : function(el){
				    }
				});
				$('#affiliate-tabs-content').html(that.commissionDetailsView.render().el);
				$('#affiliate-tabs .select').removeClass('select');
				$('.commission-details-tab').addClass('select');
			}, "#content");
		}, function(){
			window.location.href="#affiliate-register";
		});
	},

	/**
	 * Fetches all the affiliates and shows them as a list.
	 * If get exception with message 'Affiliate details not found' then 
	 * redirect to affiliateDetails route.
	 * 
	 */
	listAffiliates : function()
	{
		var that = this;
		checkForAffiliateDetails(function(){
			getTemplate('affiliate', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));
				head.js(LIB_PATH + 'lib/date-charts-en.js', LIB_PATH + 'lib/date-range-picker.js' + '?_=' + _agile_get_file_hash('date-range-picker.js'), function() {
					that.showDateRangePicker();
				});
				$('#affiliate-tabs .select').removeClass('select');
				$('.referrals-tab').addClass('select');
			}, "#content");
		}, function(){
			window.location.href="#affiliate-register";
		});
	},

	showDateRangePicker : function()
	{
		var that = this;
		getTemplate('affiliate-datepicker', {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#affiliate-datepicker').html($(template_ui));
			
			initDateRange(that.showAffiliateCollection);
			that.showAffiliateCollection();

		}, null);
	},
	showaffiliateDetails : function()
	{
		$("#prefsDropdownModal").modal("hide")
		this.affiliateDetailsView = new Base_Model_View({ url : 'core/api/affiliate_details', template : "affiliate-details",
		    postRenderCallback : function(el){
		    	if(!$("input[name='phone']", el).val()){
		    		$("input[name='phone']", el).val(CURRENT_DOMAIN_USER.phone);
		    	}
		    },
			saveCallback : function(data){
				AFFILIATE_DETAILS = data;
				App_Affiliate.showCommissionDetails();
			},prePersist : function(model){
				var addressJSON = {};
				$.each($(".address").find('input'), function(index, data) {
					addressJSON[$(data).attr('name')] = $(data).val();
				});
				addressJSON['country'] = $(".address").find("#country").val();
			    model.set({ 
			       'address' : JSON.stringify(addressJSON)
			      }, 
			      { 
			       silent : true 
			      });
			   }
			});
		$('#content').html(this.affiliateDetailsView.render().el);
	},

	showAffiliateCollection : function()
	{
		var time = getTimeFromDatePicker();
		var url = 'core/api/affiliate?startTime='+time.start+'&endTime='+time.end
		var userId = CURRENT_DOMAIN_USER.id;
		if(CURRENT_DOMAIN_USER.domain == "admin"){
			userId = admin_affiliate_id;
			url = url+"&domain="+admin_affiliate_domain;
		}
		url = url+"&userId="+userId;
		this.affiliateCollectionView = new Base_Collection_View({ url : url, sort_collection : false, templateKey : "affiliate",
			cursor : true, page_size : 25, individual_tag_name : 'tr', postRenderCallback : function(el){
				head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
				{
					$("time", el).timeago();
				});
				showCommission(userId, time, el);
			}
		});
		this.affiliateCollectionView.collection.fetch();
		$('#affiliate-tabs-content').html(this.affiliateCollectionView.render().el);
	},
	creatives : function(){
		var that = this;
		checkForAffiliateDetails(function(){
			getTemplate('affiliate', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));
				_agile_library_loader.load_zeroclipboard(function(){
					hideTransitionBar();
					getTemplate('affiliate-tools', {}, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$('#affiliate-tabs-content').html($(template_ui));
						for(var i=1; i<=21; i++){
							initZeroClipboard("url_clip_button"+i, "referral_url"+i);
						}
						$('#affiliate-tabs .select').removeClass('select');
						$('.tools-tab').addClass('select');
					},null);
				});
			}, "#content");
		}, function(){
			window.location.href="#affiliate-register";
		});
	},
	registeredDeals : function(){
		var that = this;
		checkForAffiliateDetails(function(){
			getTemplate('affiliate', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));
				$("#affiliate-register-deal").off("click");
				$("#affiliate-container").on("click", "#affiliate-register-deal", function(e){
					e.preventDefault();
					getTemplate('deal-register-modal', {}, undefined, function(template_ui1){
						if(!template_ui1)
							  return;
						$("#register_deal_modal").html($(template_ui1));
						$("#register_deal_modal").modal("show");
					}, "#content");
				});
				that.registeredDealsCollectionView = new Base_Collection_View({ url : 'core/api/affiliate/deals?userId='+CURRENT_DOMAIN_USER.id, sort_collection : false, templateKey : "deal-registration",
					cursor : true, individual_tag_name : 'tr', postRenderCallback : function(el){
						head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
						{
							$("time", el).timeago();
						});
						$("#affiliate-register-deal").show();
						$("#affiliate-register-deal2").off("click");
						$("#affiliate-tabs-content").on("click", "#affiliate-register-deal2", function(e){
							e.preventDefault();
							getTemplate('deal-register-modal', {}, undefined, function(template_ui1){
								if(!template_ui1)
									  return;
								$("#register_deal_modal").html($(template_ui1));
								$("#register_deal_modal").modal("show");
							}, "#content");
						});
					}
				});
				that.registeredDealsCollectionView.collection.fetch();
				$('#affiliate-tabs-content').html(that.registeredDealsCollectionView.render().el);
				$('#affiliate-tabs .select').removeClass('select');
				$('.deal-registration-tab').addClass('select');
			}, "#content");
		}, function(){
			window.location.href="#affiliate-register";
		});
	},

	// Routs related to admin panel

	listAffiliateDetails : function()
	{
		if(CURRENT_DOMAIN_USER.adminPanelAccessScopes.indexOf("AFFILIATES") ==-1)
		{
			 return showNotyPopUp("information", 'You donot have the Privileges to Access this page ', "top", 6000);
		}
		var that = this;
			getTemplate('admin-affiliate-details', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));
				setAffiliateDetailsFilter();
				loadAdminAffiliateDetailListeners();
				head.js(LIB_PATH + 'lib/date-charts-en.js', LIB_PATH + 'lib/date-range-picker.js' + '?_=' + _agile_get_file_hash('date-range-picker.js'), function() {
					that.showDateRangePickerInAdminPanel();
				});
			}, "#content");
	},

	showDateRangePickerInAdminPanel : function()
	{
		var that = this;
		getTemplate('affiliate-datepicker', {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#admin-affiliate-detail-datepicker').html($(template_ui));
			
			initDateRange(function(){
				var data = getAdminAffiliateFilterParameters();
				that.showAffiliateDetailCollection(data);
			});
			var data = getAdminAffiliateFilterParameters();
			that.showAffiliateDetailCollection(data);
		}, null);
	},

	showAffiliateDetailCollection : function(data)
	{
		this.affiliateDetailCollectionView = new Admin_Affiliate_Detail_Collection_View({ url : 'core/api/affiliate_details/list', sort_collection : false, templateKey : "admin-affiliate-detail",
			cursor : true, sort_collection : false, request_method : 'POST', post_data: data, individual_tag_name : 'tr', postRenderCallback : function(el){
				head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
				{
					$("time", el).timeago();
				});
			}
		});
		this.affiliateDetailCollectionView.collection.fetch();
		$('#admin-affiliate-detail-tabs-content').html(this.affiliateDetailCollectionView.render().el);
	},

	adminListAffiliates : function()
	{
		var that = this;
		getTemplate('affiliate', {"isAdminPanel":"true"}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#content').html($(template_ui));
			head.js(LIB_PATH + 'lib/date-charts-en.js', LIB_PATH + 'lib/date-range-picker.js' + '?_=' + _agile_get_file_hash('date-range-picker.js'), function() {
				that.showDateRangePicker();
			});
		}, "#content");
	},

});
