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
		"Update Data",
		"This will update your data. Do you want to continue?",
		function()
		{		
	 	var domain = CURRENT_DOMAIN_USER.domain ; 
	 	$.ajax({
			url : 'core/api/custom-fields/syncappdata?domain='+domain,
			type : 'GET',
			success : function(data) {
				console.log(data);
				var yes = "";
				var no = "Ok"
				if(data == "success"){
					showModalConfirmation(
						"Update Data",
						"Update request is successfully scheduled.",
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
						"Update Data",
						"Update is allowed only once a month. Please try later.",
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
						"Update Data",
						"There seems to be an issue. Please try again later.",
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
			}, "Ok", "Cancel");
}
function syncAppDatatoDeals(){
	 showModalConfirmation(
		"Update Data",
		"This will update your data. Do you want to continue?",
		function()
		{		
	 	var domain = CURRENT_DOMAIN_USER.domain ; 
	 	$.ajax({
			url : 'core/api/custom-fields/syncappdataforDeals?domain='+domain,
			type : 'GET',
			success : function(data) {
				console.log(data);
				var yes = "";
				var no = "Ok"
				if(data == "success"){
					showModalConfirmation(
						"Update Data",
						"Update request is successfully scheduled.",
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
						"Update Data",
						"Update is allowed only once a month. Please try later.",
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
						"Update Data",
						"There seems to be an issue. Please try again later.",
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
			}, "Ok", "Cancel");
}