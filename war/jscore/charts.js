function setupCharts(callback)
{
	// Download the lib
    	head.js('/lib/flot/highcharts.js', '/lib/flot/highcharts-exporting.js',
	       		function(){
    		 if (callback && typeof(callback) === "function") {
    			 // execute the callback, passing parameters as necessary
    			 callback();
    			}
    	});
}
    	

//Show Bars/Lines for Total and Pipeline
function pieDetails()
{
	    var chart;
	    setupCharts(function(){
		    		// Get JSON
		    		var max = 1543842319; // Set max to really big
		    		$.getJSON('/core/api/opportunity/stats/details', {min:0, max: max }, function(data){
		    			
		    			// Convert into labels and data as required by Highcharts
		    			var total = {}; total.data = [];
		    			var pipeline = {}; pipeline.data=[];
		    			
		    			// Push as data array for total and pipeline
		    			$.each(data, function(k,v)
		    					{
		    						total.data.push([k*1000, v.total]);
		    						pipeline.data.push([k*1000, v.pipeline]);
		    					})
				        chart = new Highcharts.Chart({
				            chart: {
				                renderTo: 'total-pipeline-chart',
				                type: 'line',
				                marginRight: 130,
				                marginBottom: 25
				            },
				            title: {
				                text: 'Monthly Deals',
				                x: -20 //center
				            },
				            xAxis: {
				            	type: 'datetime',
				                dateTimeLabelFormats: { // don't display the dummy year
				                    month: '%e. %b',
				                    year: '%b'
				                }
				            },
				            yAxis: {
				                plotLines: [{
				                    value: 0,
				                    width: 1,
				                    color: '#808080'
				                }],
				                min: 0
				            },
				            tooltip: {
				            	formatter: function() {
			                        return '<b>'+ this.series.name +'</b><br/>'+
			                        Highcharts.dateFormat('%e. %b', this.x) +': '+ this.y ;
			                      }
				            },
				            legend: {
				                layout: 'vertical',
				                align: 'right',
				                verticalAlign: 'top',
				                x: -10,
				                y: 100,
				                borderWidth: 0
				            },
				            series: [{
				                name: 'Total',
				                data: total.data
				            }, {
				                name: 'Pipeline',
				                data: pipeline.data
				            }]
				        });
		        });
	   });
}


//pie chart for milestones
function pieMilestones()
{
    var chart;
    setupCharts(function(){
    	// Get JSON
		var max = 1543842319; // Set max to really big
		$.getJSON('/core/api/opportunity/stats/milestones', {min:0, max: max }, function(data){
			// Convert into labels and data as required by highcharts
			    var pieData = [];
			    var total_milestones = 0;
			
			    $.each(data, function(k,v)
						{
			    			total_milestones = total_milestones + v;
						});
			    
				$.each(data, function(k,v)
						{
							var item = [];
							item.push(k);
							item.push(v / total_milestones * 100);
							pieData.push(item);
						});
		        chart = new Highcharts.Chart({
		            chart: {
		                renderTo: 'pie-deals-chart',
		                plotBackgroundColor: null,
		                plotBorderWidth: null,
		                plotShadow: false
		            },
		            title: {
		                text: 'Milestones',
		                align: 'left',
		                x: 20
		            },
		            tooltip: {
		        	    pointFormat: '{series.name}: <b>{point.percentage}%</b>',
		            	percentageDecimals: 1
		            },
		            plotOptions: {
		                pie: {
		                    allowPointSelect: true,
		                    cursor: 'pointer',
		                    dataLabels: {
		                        enabled: false
		                    },
		                    showInLegend: true
		                }
		            },
		            series: [{
		                type: 'pie',
		                name: 'Milestone',
		                data: pieData
		                   }]
		        	});
		       });
       });
}

//Show Pie for Tags
function pieTags()
{
	 var chart;
	 setupCharts(function(){	
	    		// Get JSON
	    		$.getJSON('/core/api/tags/stats', function(data){
	    			// Convert into labels and data as required by Highcharts
	    				var pieData = [];
	    				var total_tags = 0;
	    				$.each(data, function(k,v)
	    						{
	    			    			total_tags = total_tags + v;
	    						});
		    			$.each(data, function(k,v)
		    					{
		    						var item = [];
		    						item.push(k);
		    						item.push(v / total_tags * 100);
		    						pieData.push(item);
		    					})
						 chart = new Highcharts.Chart({
					            chart: {
					                renderTo: 'pie-tags-chart',
					                plotBackgroundColor: null,
					                plotBorderWidth: null,
					                plotShadow: false
					            },
					            title: {
					                text: 'Tags '
					            },
					            tooltip: {
					        	    pointFormat: '{series.name}: <b>{point.percentage}%</b>',
					            	percentageDecimals: 1
					            },
					            plotOptions: {
					                pie: {
					                    allowPointSelect: true,
					                    cursor: 'pointer',
					                    dataLabels: {
					                        enabled: false
					                    },
					                    showInLegend: true
					                }
					            },
					            series: [{
					                type: 'pie',
					                name: 'Tag',
					                data: pieData
					            }]
				        });
	   		     });
	    });
}