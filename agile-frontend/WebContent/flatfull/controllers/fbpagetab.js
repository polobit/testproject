var FacebookPageTabRouter = Backbone.Router.extend({

	routes : {
	"fbpagetab" : "fbPageTab"
	},

	fbPageTab : function(){
		 $('#content').html("<div id='fbPageTab-listners'>&nbsp;</div>");
		$("#fbPageTab-listners").html(getTemplate("admin-settings"), {});
		head.js(LIB_PATH + 'jscore/handlebars/handlebars-helpers.js',function() {
			var dataObj = $.parseJSON($.ajax({ url : "fbpage?action=GET_DETAILS", async : false, dataType : 'json' }).responseText);
			dataObj["forms"] = $.parseJSON($.ajax({ url : "core/api/forms", async : false, dataType : 'json' }).responseText);		
			$("#admin-prefs-tabs-content").html(getTemplate("fbpagetab", dataObj));
			$('#fbPageTab-listners').find('#AdminPrefsTab .select').removeClass('select');
			$('#fbPageTab-listners').find('.integrations-tab').addClass('select');
			$(".active").removeClass("active");
			initializeFbPageTabListners();
		});
	}
	
});
