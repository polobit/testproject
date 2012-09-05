function setupCharts(callback)
{
	// Download the lib 
	head.js('lib/flot/jquery.flot.min.js', 'lib/flot/jquery.flot.pie.min.js',
	       		function(){
		 if (callback && typeof(callback) === "function") {
			 // execute the callback, passing parameters as necessary
			 callback();
			}
		});
}


// Pie
function _pie(data, selector)
{
	$.plot(
	   selector, data,  
	   {
	     series: {
	       pie: {
	         show: true,
	         label: {
	           show: true
	         }
	     }
	    },
	    legend: {
	      show: true
	    }
	  }
	);
}

// Show Pie for Milestones
function pieMilestones()
{

	setupCharts(function(){
		
		// Get JSON
		var max = 1543842319; // Set max to really big
		$.getJSON('/core/api/opportunity/stats/milestones', {min:0, max: max }, function(data){
			// Convert into labels and data as required by Flot
			var pieData = [];
			$.each(data, function(k,v)
					{
						var item = {};
						item.label = k;
						item.data = v;
						pieData.push(item);
					})
				_pie(pieData, $("#pie-deals-chart"));	
			});
		});
}

// Show Bars/Lines for Total and Pipeline
function pieDetails()
{
	setupCharts(function(){
		
		// Get JSON
		var max = 1543842319; // Set max to really big
		$.getJSON('/core/api/opportunity/stats/details', {min:0, max: max }, function(data){
			
			// Convert into labels and data as required by Flot
			var total = {}; total.data = [];
			var pipeline = {}; pipeline.data=[];
			
			// Push as data array for total and pipeline
			$.each(data, function(k,v)
					{
						total.data.push([k*1000, v.total]);
						pipeline.data.push([k*1000, v.pipeline]);
					})
					
			var plotData = [];
			plotData.push(total);
			plotData.push(pipeline);
			
			//console.log(plotData);
			//console.log(JSON.stringify(plotData));
			
			// Line Graph
			/*plotData = [
			            {
			                label: "Total",
			                data: total.data,
			                lines: {show: true},
			                points: {show: true}
			              },
			              {
			                label: "Pipeline",
			                data: pipeline.data,
			                lines: {show: true},
			                points: {show: true}   
			              }
			            ];*/
			
			// Bar Graph
			plotData = [
            {
                label: "Total",
                data: total.data,
                bars: {
                    show: true,
                    barWidth: 1000000000,
                    align: "center"
                  }   
              },
              {
                label: "Pipeline (Total * Probability)",
                data: pipeline.data,
                bars: {
                    show: true,
                    barWidth: 1000000000,
                    align: "center"
                  } ,
                  grid: { hoverable: true, clickable: true }
              }
            ];
			
			// Plot it
			$.plot($("#total-pipeline-chart"), plotData,
				    {xaxis: {mode:"time", timeformat: "%b %y"}}
			);
			
		});
			
	});
}

//Show Pie for Tags
function pieTags()
{
setupCharts(function(){
		
		// Get JSON
		$.getJSON('/core/api/tags/stats', function(data){
			// Convert into labels and data as required by Flot
			var pieData = [];
			$.each(data, function(k,v)
					{
						var item = {};
						item.label = k;
						item.data = v;
						pieData.push(item);
					})
					_pie(pieData, $("#pie-tags-chart"));	
			});
		});
}