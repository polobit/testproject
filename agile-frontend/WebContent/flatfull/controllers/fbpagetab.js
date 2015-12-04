var FacebookPageTabRouter = Backbone.Router.extend({

	routes : {
	"facebook-integration" : "fbPageTab"
	},

	fbPageTab : function(){
		$('#content').html("<div id='fbPageTab-listners'>&nbsp;</div>");
		getTemplate("admin-settings", {}, undefined, function(template_ui){

			if(!template_ui)
				return;
			$('#fbPageTab-listners').html($(template_ui));

			getTemplate("web-to-lead-settings", {}, undefined, function(template_ui1){
				if(!template_ui1)
					return;

				$('#admin-prefs-tabs-content').html($(template_ui1));
				$("#admin-prefs-tabs-content").find('a[href="#web-to-lead-tab"]').closest("li").addClass("active");	
				

				accessUrlUsingAjax("fbpage?action=GET_DETAILS", function(data){
					var dataObj = data;
					accessUrlUsingAjax("core/api/forms", function(response){

							dataObj["forms"] = response;
							
							getTemplate('fbpagetab', dataObj, undefined, function(template_ui2){
						 		if(!template_ui2)
						    		return;
								$('#admin-settings-integrations-tab-content').html($(template_ui2));
								initializeFbPageTabListners();
							}, null);
					});
				});
				
				initializeIntegrationsTabListeners("integrations_tab", "integrations");
				$('#content').find('.integrations-tab').addClass('select');
			}, "#admin-settings-integrations-tab-content");

		},null);

		hideTransitionBar();		
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