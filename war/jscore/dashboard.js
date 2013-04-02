function setupDashboard(el)
{
	setupSubscriptionDetails(el);
	setupDashboardTimeline();
}

function setupSubscriptionDetails(el)
{
	$.getJSON('core/api/subscription', function(data){
		console.log(data);
		if(data)
			{
				head.js(LIB_PATH + 'lib/prettify-min.js', function() {
					var view = new Base_Model_View({
					url : '/core/api/api-key',
					template : "dashboard-api-key-model",
					postRenderCallback : function(el) {
						prettyPrint();
					}
					
					
				});

					$("#subscription-stats").html(view.el);
				});
				return;
			}
		$("#subscription-stats").html(getTemplate('user-billing', data));
	});
	
}

$(function(){
	$('.dashboard-timeline-filter').live('click', function(e){
		e.preventDefault();
		$("#my-timeline").empty();
		console.log($(this).attr('url'));
		setupDashboardTimeline($(this).attr('url'));
	});
});