$(function(){
	$(".report-chorts").die().live('click', function(e){
		e.preventDefault();
		var formelement = $(this).parents('form'); 
		if (!isValidForm($(formelement))) {
			return false;
		}
		
		var object = serializeForm($(formelement).attr('id'));
		
		
		var report_type = object["report_chart_type"];
		
		var tags = "";
		
		if(object["tags"] && isArray(object["tags"]))
			$.each(object["tags"], function(i, tag){
				if(i == 0)
					tags += tag;
				else
					tags += ", " +tag;
			});
		
		console.log(tags);
		
		if(report_type == 'GROWTH')
		{
			Backbone.history.navigate("report-growth/" + tags, { trigger : true });
		}
		else if(report_type == 'FUNNEL')
		{
			Backbone.history.navigate("report-funnel/" + tags, { trigger : true });
		}
		else if(report_type == 'RATIO')
		{
			var tag1 = object["tag1"];
			var tag2 = object["tag2"];
			Backbone.history.navigate("report-ratio/" + tag1 + "/" + tag2, { trigger : true });
		}
		else if(report_type == 'COHORTS')
		{
			var tag1 = object["tag1"];
			var tag2 = object["tag2"];
			
			Backbone.history.navigate("report-cohorts/" + tag1 + "/" + tag2, { trigger : true });
		}
		
		
		
	});
});