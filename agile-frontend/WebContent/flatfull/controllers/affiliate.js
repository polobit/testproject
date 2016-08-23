/**
 * Creates backbone router for Case create, read and update operations
 */
var AFFILIATE_DETAILS;
var AffiliateRouter = Backbone.Router.extend({

	routes : {
		"commission" : "showCommissionDetails",
		"affiliate" : "listAffiliates" ,
	 	"affiliateDetails" : "showaffiliateDetails",
	 	"tools" : "tools"
	},

	showCommissionDetails : function(){
		var that = this;
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
			that.showaffiliateDetails();
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
				App_Affiliate.listAffiliates();
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
	tools : function(){
		getTemplate('affiliate', {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#content').html($(template_ui));
			head.js(LIB_PATH + '../lib/zeroclipboard/ZeroClipboard.js', function()
			{
				hideTransitionBar();
				getTemplate('affiliate-tools', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#affiliate-tabs-content').html($(template_ui));
					for(var i=1; i<=6; i++){
						initZeroClipboard("url_clip_button"+i, "referral_url"+i);
					}
					$('#affiliate-tabs .select').removeClass('select');
					$('.tools-tab').addClass('select');
				},null);
			});
		}, "#content");
	}

});
