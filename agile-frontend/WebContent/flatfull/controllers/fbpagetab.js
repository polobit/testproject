var FacebookPageTabRouter = Backbone.Router.extend({

	routes : {
	"fbpagetab" : "fbPageTab"
	},

	fbPageTab : function(){

			$('#content').html("<div id='fbPageTab-listners'>&nbsp;</div>");
			getTemplate("admin-settings", {}, undefined, function(template_ui){
				if(!template_ui)
					  return;

				$('#fbPageTab-listners').html($(template_ui));	
				
				fb_get_ajax_success_cb("fbpage?action=GET_DETAILS", function(data){

					var dataObj = data;
					fb_get_ajax_success_cb("core/api/forms", function(response){

							dataObj["forms"] = response;
							$("#admin-prefs-tabs-content").html(getTemplate("fbpagetab", dataObj));
							$('#fbPageTab-listners').find('#AdminPrefsTab .select').removeClass('select');
							$('#fbPageTab-listners').find('.integrations-tab').addClass('select');
							$(".active").removeClass("active");
							initializeFbPageTabListners();
					});
				});
			}, "#fbPageTab-listners");
		
	}
	
});


function fb_get_ajax_success_cb(url, callback){
	$.ajax({ 
		url : url, 
		dataType : 'json',
		success : function(response){
				if(callback)
					  callback($.parseJSON(response));
		}
	});
}