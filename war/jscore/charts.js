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
	head.js(LIB_PATH + 'lib/flot/highcharts.js', LIB_PATH + 'lib/flot/highcharts-exporting.js',

	function() {

		// Checks if callback is available, if available calls the callback
		if (callback && typeof (callback) === "function") {

			// Execute the callback
			callback();
		}
	});
}

//Chat duration 0-10s, 10-30s etc.
//Chat lines < 10, 10-20 etc
function pie(url, selector, name) {

	// Show loading
	//$('#' + selector).html(LOADING_HTML);

	var chart;
	setupCharts(function() {

		// Fetches data from to get tags informations
		// i.e., {"tags1" :" number of contacts with 'tags1', "tags2" : "number
		// of contacts with tags2"}
		$.getJSON(url, function(data) {

			// Convert into labels and data as required by Highcharts
			var pieData = [];
			var total = 0;

			// Iterates through data and calculate total number
			$.each(data, function(k, v) {
				total += v;
			});

			// Iterates through data, gets each tag, count and calculate
			// percentage of each tag
			$.each(data, function(k, v) {
				var item = [];

				// Push tag name in to array
				item.push(k);

				// Push percentage of current tag in to array
				item.push(v / total * 100);
				pieData.push(item);
			})

			// Initializes Highcharts,
			chart = new Highcharts.Chart({
				chart : {
					renderTo : selector,
					type : 'pie',
					plotBackgroundColor : null,
					plotBorderWidth : null,
					plotShadow : false,
					marginTop: 50
				},
				title : {
					text : name
				},
				tooltip : {
					backgroundColor: null,
				    borderWidth: 0,
				    borderRadius: 0,
				    headerFormat: '',
				    useHTML:true,
				    enabled: true,
				    shadow: false,
				    formatter: function() {
				    	var s = '<div class="highcharts-tool-tip"><div class="tooltip-title">'+this.point.name+'</div><div style="text-align:center;margin-top:7px;margin-left:-3px"><b>'+(this.point.percentage).toFixed(2)+'%<b></div></div>';
				    	return s;
					},
				    message: "Hover over chart slices<br>for more information.",
				    positioner: function () {
				    		return { x: 15, y: 23 };        
				    	},
				    },
			    legend: {
			        itemWidth: 75,
			    },
				plotOptions : {
					 pie : {
					      allowPointSelect : true,
					      cursor : 'pointer',
					      borderWidth: 0,
					      dataLabels : {
					       enabled : true,
					       color : '#000000',
					       connectorColor : '#000000',
					       connectorWidth: 0,
					      formatter : function() {
					    	  return "";
					        if(this.percentage <= 2)
					         return "";
					        return  (this.percentage).toFixed(2) + ' %';
					       },
					       distance: 2
					      },
					        showInLegend: false,
		                    innerSize: '30%',
		                    size: '75%',
		                    shadow: true,
		                    borderWidth: 2
					     },
					     series : {
					    	events: {
				               mouseOver: function() {
				            	   $('.tooltip-default-message').hide();
				                 },
				               mouseOut: function(e) {
				            	   $('.tooltip-default-message').show();
				                 }
				              }
					     }
					 },

					 series : [ {
							type : 'pie',
							name : 'Tag',
							data : pieData,
							startAngle : 90
						} ],
						exporting : {
							enabled : false
						}
			}
			, function(chart) { // on complete
			     
		        chart.renderer.image('img/donut-tooltip-frame.png', 14, 5, 200, 80).add(); 
		        chart.renderer.text (this.options.tooltip.message, 50, 40).attr("class", 'tooltip-default-message').add(); 
		        
		    }
			);
		});
	});
}

/**
 * Sets up pie chart for deal statistics. Deal totals and pipeline with respects
 * time
 */
function showBar(url, selector, name, yaxis_name, stacked) {
	var chart;

	// Show loading
	$('#' + selector).html(LOADING_HTML);

	// Charts will be columned
	// http://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/highcharts/demo/column-stacked/

	// Loading Highcharts plugin using setupCharts
	setupCharts(function() {

		// Loads statistics details from backend - for line - daily, hourly,
		// weekly
		$
				.getJSON(
						url,
						function(data) {

							// Convert into labels and data as required by
							// Highcharts
							var categories = [];
							var series;

							// Iterates through data and adds the keys are
							// categories
							$.each(data, function(k, v) {
								categories.push(k);

								// Initializes series with names with the first
								// data point
								if (series == undefined) {
									var index = 0;
									series = [];
									$.each(v, function(k1, v1) {
										var series_data = {};
										series_data.name = k1;
										series_data.data = [];
										series[index++] = series_data;
									});
								}

								// console.log(series);

								// Fill Data Values with series data
								$.each(v, function(k1, v1) {

									// Find series with the name k1 and to that,
									// push v1
									var series_data = find_series_with_name(
											series, k1);
									series_data.data.push(v1);
								});

							});

							// Draw the graph
							chart = new Highcharts.Chart(
									{
										chart : {
											renderTo : selector,
											type : 'column'
										},
										colors : [ '#4365AD', '#D52A3E',
												'gray', '#1E995C' ],
										title : {
											text : name
										},
										xAxis : {
											categories : categories
										},
										yAxis : {
											min : 0,
											title : {
												text : yaxis_name
											},
											stackLabels : {
												enabled : true,
												style : {
													fontWeight : 'bold',
													color : (Highcharts.theme && Highcharts.theme.textColor)
															|| 'gray'
												}
											}
										},
										legend : {
											align : 'right',
											x : -100,
											verticalAlign : 'top',
											y : 20,
											floating : true,
											backgroundColor : (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid)
													|| 'white',
											borderColor : '#CCC',
											borderWidth : 1,
											shadow : false
										},
										tooltip : {
											formatter : function() {
												return '<b>' + this.x
														+ '</b><br/>'
														+ this.series.name
														+ ': ' + this.y
														;
											}
										},
										plotOptions : {
											column : {
												stacking : null,
												dataLabels : {
													enabled : true,
													color : (Highcharts.theme && Highcharts.theme.dataLabelsColor)
															|| 'white'
												}
											}
										},
										series : series
									});

						});
	});
}

// Small utility function to search series with a given name
function find_series_with_name(series, name) {
	for ( var i = 0; i < series.length; i++) {
		if (series[i].name == name)
			return series[i];
	}
}


/**
 * Sets up pie chart for deal statistics. Deal totals and pipeline with respects
 * time
 */
function showLine(url, selector, name, yaxis_name) {
	var chart;

	// Loading Highcharts plugin using setupCharts, and sets up pie chart in the
	// callback
	setupCharts(function() {

		// Loads statistics details from backend i.e.,[{closed
		// date:{total:value, pipeline: value},...]
		$.getJSON(url, function(data) {

			
			// Convert into labels and data as required by
			// Highcharts
			var categories = [];
			var series;

			// Iterates through data and adds the keys are
			// categories
			$.each(data, function(k, v) {
				
				// Initializes series with names with the first
				// data point
				if (series == undefined) {
					var index = 0;
					series = [];
					$.each(v, function(k1, v1) {
						var series_data = {};
						series_data.name = k1;
						series_data.data = [];
						series[index++] = series_data;
					});
				}

				// console.log(series);

				// Fill Data Values with series data
				$.each(v, function(k1, v1) {

					// Find series with the name k1 and to that,
					// push v1
					var series_data = find_series_with_name(
							series, k1);
					series_data.data.push([k*1000, v1]);
				});

			});
			

			// After loading and processing all data, highcharts are initialized
			// setting preferences and data to show
			chart = new Highcharts.Chart({
				chart : {
					renderTo : selector, // Html element id to
					// show chart
					type : 'line',
					marginRight : 130,
					marginBottom : 25
				},
				title : {
					text : name, // Title
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
					title: {
	                    text: yaxis_name
	                },
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
				series : series,
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
function pieTags()
{
	pie('/core/api/tags/stats', 'pie-tags-chart', '');
}

/**
 * Shows pie chart of milestones using high charts, called from deals controller
 * when deals collection is loaded.
 */
function pieMilestones()
{
	pie('/core/api/opportunity/stats/milestones?min=0&max=1543842319', 'pie-deals-chart', '');
}

/**
 * Sets up pie chart for deal statistics. Deal totals and pipeline with respects
 * time
 */
function pieDetails()
{
	showLine('core/api/opportunity/stats/details?min=0&max=1543842319', 'total-pipeline-chart', 'Monthly Deals', 'Total Value');	
}