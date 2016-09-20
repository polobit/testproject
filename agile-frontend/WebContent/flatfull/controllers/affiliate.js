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
	 	"affiliate-deals" : "registeredDeals"
	},

	showCommissionDetails : function(){
		var that = this;
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
		this.affiliateCollectionView = new Base_Collection_View({ url : 'core/api/affiliate?userId='+CURRENT_DOMAIN_USER.id+'&startTime='+time.start+'&endTime='+time.end, sort_collection : false, templateKey : "affiliate",
			cursor : true, page_size : 25, individual_tag_name : 'tr', postRenderCallback : function(el){
				head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
				{
					$("time", el).timeago();
				});
				showCommission(undefined, time, el);
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
				that.registeredDealsCollectionView = new Base_Collection_View({ url : 'core/api/affiliate/deals?userId='+CURRENT_DOMAIN_USER.id, sort_collection : false, templateKey : "deal-registration",
					cursor : true, individual_tag_name : 'tr', postRenderCallback : function(el){
						head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
						{
							$("time", el).timeago();
						});
						$("#affiliate-register-deal").show();
						$("#affiliate-container").on("click", "#affiliate-register-deal", function(e){
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
	}

});
