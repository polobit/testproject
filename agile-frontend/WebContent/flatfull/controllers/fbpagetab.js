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
				
				accessUrlUsingAjax("fbpage?action=GET_DETAILS", function(data){

					var dataObj = data;
					accessUrlUsingAjax("core/api/forms", function(response){

							dataObj["forms"] = response;
							
							getTemplate('fbpagetab', dataObj, undefined, function(template_ui){
						 		if(!template_ui)
						    		return;
								$('#admin-prefs-tabs-content').html($(template_ui));
								$('#fbPageTab-listners').find('#AdminPrefsTab .select').removeClass('select');
								$('#fbPageTab-listners').find('.integrations-tab').addClass('select');
								$(".active").removeClass("active");
								initializeFbPageTabListners();
							}, "#admin-prefs-tabs-content");
					});
				});
			}, "#fbPageTab-listners");
		
	}
	
});


function accessUrlUsingAjax(url, callback, error_callback){
	$.ajax({ 
		url : url, 
		dataType : 'json',
		success : function(response){

		   try{
		   	  response = $.parseJSON(response);
		   }catch(err){}

			if(callback)
				 callback(response);
		}, error : function(response){

			if(error_callback)
					 error_callback(response);
		}
	});
}