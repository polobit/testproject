var account_stats_integrations = {

	loadAccountStats : function(el) {

		$.ajax({
			url : 'core/api/namespace-stats/getdomainstats',
			type : 'GET',
			success : function(data) {
				console.log(data);

				getTemplate("account-stats-new", data, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$(el).find('#account-stats-new').html($(template_ui));	
				}, $(el).find('#account-stats-new'));
			},
			error : function(response) {
				console.log("error");
				console.log(response);
			}
		});
	},
	loadEmailStats : function(el) {

		$.ajax({
			url : 'core/api/emails/email-stats',
			type : 'GET',
			success : function(data) {
				console.log(data);
				getTemplate("email-stats-new", data, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$(el).find('#email-stats-new').html($(template_ui));	
				}, $(el).find('#email-stats-new'));
			},
			error : function(response) {
				console.log("error");
				console.log(response);
			}
		});
	},

	loadSMSStats : function(el) {
		$.ajax({
			url : 'core/api/sms-gateway/SMSlogs',
			type : 'GET',
			success : function(data) {
				console.log(data);
				if(data){
					data=JSON.parse(data);
				}
				getTemplate("sms-stats-new", data, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$(el).find('#sms-stats-new').html($(template_ui));	
				}, $(el).find('#sms-stats-new'));				
			},
			error : function(response) {
				console.log("error");
				console.log(response);
			}
			});

	},

	loadSyncTab : function(el) {
	
				getTemplate("sync-stats-new", {} , undefined, function(template_ui){
					if(!template_ui)
						  return;
					$(el).find('#sync-stats-new').html($(template_ui));	
				}, $(el).find('#sync-stats-new'));				
		
	}
};

function initializeStatsListners(el){
$('#email-stats-listners a[href="#account-stats-new"]').on('click', function(e) {
	e.preventDefault();
	$(el).find('#account-stats-new').html(LOADING_ON_CURSOR);
	account_stats_integrations.loadAccountStats(el);
});
$('#email-stats-listners a[href="#email-stats-new"]').on('click', function(e) {
	e.preventDefault();
	$(el).find('#email-stats-new').html(LOADING_ON_CURSOR);
	account_stats_integrations.loadEmailStats(el);
});
$('#email-stats-listners a[href="#sms-stats-new"]').on('click', function(e) {
	e.preventDefault();
	$(el).find('#sms-stats-new').html(LOADING_ON_CURSOR);
	account_stats_integrations.loadSMSStats(el);
});
$('#email-stats-listners a[href="#sync-stats-new"]').on('click', function(e) {
	e.preventDefault();
	$(el).find('#sync-stats-new').html(LOADING_ON_CURSOR);
	account_stats_integrations.loadSyncTab(el);
});
}
function syncAppData(){
	 showModalConfirmation(
		_agile_get_translated_val('datasync','update-data'),
		_agile_get_translated_val('datasync','update-data-confirm'),
		function()
		{		
	 	var domain = CURRENT_DOMAIN_USER.domain ; 
	 	$.ajax({
			url : 'core/api/custom-fields/syncappdata?domain='+domain,
			type : 'GET',
			success : function(data) {
				console.log(data);
				var yes = "";
				var no = _agile_get_translated_val('reputation','Ok');
				if(data == "success"){
					showModalConfirmation(
						_agile_get_translated_val('datasync','update-data'),
						_agile_get_translated_val('datasync','update-request-scheduled'),
						function()
						{
							// No callback
							return;
						},function()
						{
							return;
						}, yes, no);
                  }
                  else if (data == "limitReached"){
                  	showModalConfirmation(
						_agile_get_translated_val('datasync','update-data'),
						_agile_get_translated_val('datasync','update-request-scheduled-error'),
						function()
						{
							// No callback
							return;
						},function()
						{
							return;
						}, yes, no);
                  }
                  else{
                  	showModalConfirmation(
						_agile_get_translated_val('datasync','update-data'),
						_agile_get_translated_val('datasync','sync-error'),
						function()
						{
							// No callback
							return;
						},function()
						{
							return;
						}, yes, no);
                  }
			},
			error : function(response) {
				console.log("error");
				console.log(response);
			}
			});
	    }, function()
			{
				// No callback
				return;
			}, function()
			{
				return;
			}, _agile_get_translated_val('reputation','Ok'), _agile_get_translated_val('contact-details','cancel'));
}