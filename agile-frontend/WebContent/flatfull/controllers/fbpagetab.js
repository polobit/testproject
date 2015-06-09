var FacebookPageTabRouter = Backbone.Router.extend({

	routes : {
	"fbpagetab" : "fbPageTab"
	},

	fbPageTab : function(){
		$("#content").html(getTemplate("admin-settings"), {});
		head.js(LIB_PATH + 'jscore/handlebars/handlebars-helpers.js',function() {
			var dataObj = $.parseJSON($.ajax({ url : "fbpage?action=GET_DETAILS", async : false, dataType : 'json' }).responseText);
			dataObj["forms"] = $.parseJSON($.ajax({ url : "core/api/forms", async : false, dataType : 'json' }).responseText);		
			$("#admin-prefs-tabs-content").html(getTemplate("fbpagetab", dataObj));
			$('#content').find('#AdminPrefsTab .select').removeClass('select');
			$('#content').find('.integrations-tab').addClass('select');
			$(".active").removeClass("active");
		});
	}
	
});
