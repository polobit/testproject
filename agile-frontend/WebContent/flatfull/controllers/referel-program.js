var ReferelRouter = Backbone.Router.extend({

	routes : {

	"referrals" : "referrelprogram"

	},

	referrelprogram : function()
	{

		head.js(LIB_PATH + '../lib/zeroclipboard/ZeroClipboard.js', function()
		{
			referelsview = new Base_Collection_View({ url : '/core/api/users/getreferedbyme?reference_domain=' + CURRENT_DOMAIN_USER.domain,
				templateKey : "referrals", individual_tag_name : 'tr', postRenderCallback : function(el)
				{

					initZeroClipboard("url_clip_button", "referral_url");

				} });

			referelsview.collection.fetch();

			$('#content').html(referelsview.render().el);
		});

	} });
