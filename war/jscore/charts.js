/**
 * Loads highchars.js and highcharts-exporting.js plugins used to show graphs,
 * after loading graphs callback function sent is called i.e., actions to be
 * performed after loading plugin scripts
 * 
 * @param callback
 *            Function to be called after loading highcharts.js and
 *            exporting.js, it gives functionalities to
 */
function setupCharts(callback) {

	// Loads Highchars.js and highcharts-exportin.js, call back sent to this
	// function is called after loading plugin scripts
	head.js('/lib/flot/highcharts.js', '/lib/flot/highcharts-exporting.js',

	function() {

		// Checks if callback is available, if available calls the callback
		if (callback && typeof (callback) === "function") {

			// Execute the callback
			callback();
		}
	});
}

/**
 * Sets up pie chart for deal statistics. Deal totals and pipeline with respects
 * time
 */
function pieDetails() {
	var chart;

	// Loading Highcharts plugin using setupCharts, and sets up pie chart in the
	// callback
	setupCharts(function() {

		// Sets max to really big i.e., epoch time set very high to get all the
		// deal statistics till the set date
		var max = 1543842319;

		// Loads statistics details from backend i.e.,[{closed
		// date:{total:value, pipeline: value},...]
		$.getJSON('/core/api/opportunity/stats/details', {
			min : 0,
			max : max
		}, function(data) {

			// Convert into labels and data as required by Highcharts
			var total = {};
			total.data = [];
			var pipeline = {};
			pipeline.data = [];

			// Populates the total and pipeline objects, converting epochtime
			// into milliseconds and its respecitve total and pipelines
			$.each(data, function(k, v) {
				total.data.push([ k * 1000, v.total ]);
				pipeline.data.push([ k * 1000, v.pipeline ]);
			});

			// After loading and processing all data, highcharts are initialized
			// setting preferences and data to show
			chart = new Highcharts.Chart({
				chart : {
					renderTo : 'total-pipeline-chart', // Html element id to
					// show chart
					type : 'line',
					marginRight : 130,
					marginBottom : 25
				},
				title : {
					text : 'Monthly Deals', // Title
					x : -20
				// center
				},
				xAxis : {
					type : 'datetime',
					dateTimeLabelFormats : { // don't display the dummy year
						month : '%e. %b',
						year : '%b'
					}
				},
				yAxis : {
					plotLines : [ {
						value : 0,
						width : 1,
						color : '#808080'
					} ],
					min : 0
				},

				// Tool tip to show details, on graph
				tooltip : {
					formatter : function() {
						return '<b>' + this.series.name + '</b><br/>'
								+ Highcharts.dateFormat('%e. %b', this.x)
								+ ': ' + this.y;
					}
				},
				legend : {
					layout : 'vertical',
					align : 'right',
					verticalAlign : 'top',
					x : -10,
					y : 100,
					borderWidth : 0
				},

				// Sets the series of data to be shown in the graph, shows total
				// and pipeline
				series : [ {
					name : 'Total',
					data : total.data
				}, {
					name : 'Pipeline',
					data : pipeline.data
				} ],
				exporting : {
					enabled : false
				}
			});
		});
	});
}
// pie chart for milestones
/**
 * Shows pie chart of milestones using high charts, called from deals controller
 * when deals collection is loaded.
 */
function pieMilestones() {
	var chart;

	// Loads Highcharts then executes the functionality of showing milestone
	// details
	setupCharts(function() {

		var max = 1543842319; // Set max to really big

		// Gets milestone details, {"milestone name" : "number of deals with
		// milestone",...}
		$.getJSON('/core/api/opportunity/stats/milestones', {
			min : 0,
			max : max
		}, function(data) {

			// Convert into labels and data as required by highcharts
			var pieData = [];
			var total_milestones = 0;
			$.each(data, function(k, v) {

				// Gets total number of milestones, to calculate the percentage
				// of deals for each milestone
				total_milestones = total_milestones + v;
			});

			// Iterates though data and calculate the percentage of each
			// milestone and sets in to an array [["milestone name1",
			// %]["milestone name2", %]]
			$.each(data, function(k, v) {
				var item = [];
				item.push(k);
				item.push(v / total_milestones * 100);
				pieData.push(item);
			});

			// Initializes highchart with the data, which is processed above
			chart = new Highcharts.Chart({
				chart : {
					renderTo : 'pie-deals-chart',
					plotBackgroundColor : null,
					plotBorderWidth : null,
					plotShadow : false
				},
				title : {
					text : '',
					align : 'left',
					x : 20
				},
				tooltip : {
					pointFormat : '{series.name}: <b>{point.percentage}%</b>',
					percentageDecimals : 1
				},
				 plotOptions : {
				     pie : {
			    	 cumulative : -0.25,
				      allowPointSelect : true,
				      cursor : 'pointer',
				      borderWidth: 0,
				      dataLabels : {
				       enabled : true,
				       color : '#000000',
				       connectorColor : '#000000',
				       connectorWidth: 0,
				       formatter : function() {
				        if(this.percentage <= 2)
				         return "";
				        return (this.percentage).toFixed(2) + ' %';
				       },
				       distance: 2
				      },
				      showInLegend : true
				     }
				 },
				series : [ {
					type : 'pie',
					name : 'Milestone',
					data : pieData
				// Sets data to charts
				} ],
				exporting : {
					enabled : false
				}
			});
		});
	});
}

/**
 * Show Pie chart for tags of contacts,
 */
function pieTags() {
	var chart;
	setupCharts(function() {

		// Fetches data from to get tags informations
		// i.e., {"tags1" :" number of contacts with 'tags1', "tags2" : "number
		// of contacts with tags2"}
		$.getJSON('/core/api/tags/stats', function(data) {

			// Convert into labels and data as required by Highcharts
			var pieData = [];
			var total_tags = 0;

			// Iterates through data and calculate total number of tags, used to
			// calculate percentage of tags
			$.each(data, function(k, v) {
				total_tags = total_tags + v;
			});

			// Iterates through data, gets each tag, count and calculate
			// percentage of each tag
			$.each(data, function(k, v) {
				var item = [];

				// Push tag name in to array
				item.push(k);

				// Push percentage of current tag in to array
				item.push(v / total_tags * 100);
				pieData.push(item);
			})
			
			// Initializes Highcharts, 
			chart = new Highcharts.Chart({
				chart : {
					renderTo : 'pie-tags-chart',
					plotBackgroundColor : null,
					plotBorderWidth : null,
					plotShadow : false
				},
				title : {
					text : ''
				},
				tooltip : {
					pointFormat : '{series.name}: <b>{point.percentage}%</b>',
					percentageDecimals : 1
				},
			    legend: {
			        itemWidth: 75,
			    },
				 plotOptions : {
				     pie : {
				    cumulative : -0.25,
				      allowPointSelect : true,
				      cursor : 'pointer',
				      borderWidth: 0,
				      dataLabels : {
				       enabled : true,
				       color : '#000000',
				       connectorColor : '#000000',
				       connectorWidth: 0,
				       formatter : function() {
				        if(this.percentage <= 2)
				         return "";
				        return (this.percentage).toFixed(2) + ' %';
				       },
				       distance: 2
				      },
				      showInLegend : true
				     }
				 },
				series : [ {
					type : 'pie',
					name : 'Tag',
					data : pieData
				} ],
				exporting : {
					enabled : false
				}
			});
		});
	});
}