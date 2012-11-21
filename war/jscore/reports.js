$(function(){
	$('#report-model-list > tr').live('click', function(e){
		
		e.preventDefault();
		console.log("clicked on filters list");
		var data = $(this).find('.report-edit').attr('report');
		console.log(data);
		if(data)
			{
			 Backbone.history.navigate("report-edit/" + data, {
		            trigger: true
		        });
			}
		
	});
});