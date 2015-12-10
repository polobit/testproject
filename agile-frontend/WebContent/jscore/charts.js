/**
 * Loads highcharts.js and highcharts-exporting.js plugins used to show graphs,
 * after loading graphs callback function sent is called i.e., actions to be
 * performed after loading plugin scripts
 * 
 * @param callback
 *            Function to be called after loading highcharts.js and
 *            exporting.js, it gives functionalities to
 */
function setupCharts(callback)
{

	head.js(LIB_PATH + 'lib/flot/highcharts-3.js', LIB_PATH + 'lib/flot/highcharts-exporting.js', LIB_PATH + 'lib/flot/funnel.js', function()
	{

		// Checks if callback is available, if available calls the callback
		if (callback && typeof (callback) === "function")
		{

			// Execute the callback
			callback();
		}
	});
}

/**
 * Sets pie chart with the data obtained by accessing url in the selector
 * element with given name as title of the chart.
 * 
 * @param url -
 *            to fetch json data inorder to render graph. 
 * @param selector -
 *            id or class of an element where charts render.
 * @param name - 
 *            title of the chart.
 */
function pie(url, selector, name)
{

	// Show loading
	// $('#' + selector).html(getRandomLoadingImg());

	var chart;
	setupCharts(function()
	{
		// Fetches data from to get tags informations
		// i.e., {"tags1" :" number of contacts with 'tags1', "tags2" : "number
		// of contacts with tags2"}
		fetchReportData(
						url,
						function(data)
						{
							// Convert into labels and data as required by
							// Highcharts
							var pieData = [];
							var total = 0;
							var count = 0;

							// Iterates through data and calculate total number
							$.each(data, function(k, v)
							{
								total += v;
								count ++;
							});

							console.log(data,total);
							// Iterates through data, gets each tag, count and
							// calculate
							// percentage of each tag
							$.each(data, function(k, v)
							{
								var item = [];

								
								// Push tag name in to array
								item.push(k);

								// Push percentage of current tag in to array
								item.push(v / total * 100);
								pieData.push(item);
							})
							console.log(pieData);
							var animation = count > 20 ? false : true;
							
							// Initializes Highcharts,
							chart = new Highcharts.Chart(
									{
										chart : { renderTo : selector, type : 'pie', plotBackgroundColor : null, plotBorderWidth : null, plotShadow : false,
											marginTop : 50 },
										title : { text : name },
										tooltip : {
											backgroundColor : null,
											borderWidth : 0,
											borderRadius : 0,
											headerFormat : '',
											useHTML : true,
											enabled : true,
											shadow : false,
											formatter : function()
											{
												var s = '<div class="highcharts-tool-tip"><div class="tooltip-title">' + this.point.name + '</div><div style="text-align:center;margin-top:7px;margin-left:-3px"><b>' + (this.point.percentage)
														.toFixed(2) + '%<b></div></div>';
												return s;
											}, message : "Hover over chart slices<br>for more information.", positioner : function()
											{
												return { x : 15, y : 23 };
											}, },
										legend : { itemWidth : 75, },
										plotOptions : {
											pie : {
												 animation: animation,
												allowPointSelect : true,
												cursor : 'pointer',
												borderWidth : 0,
												dataLabels : { enabled : true, color : '#000000', connectorColor : '#000000', connectorWidth : 0,
													formatter : function()
													{
														return "";
														if (this.percentage <= 2)
															return "";
														return (this.percentage).toFixed(2) + ' %';
													}, distance : 2 }, showInLegend : false, innerSize : '30%', size : '75%', shadow : true, borderWidth : 0 },
											series : { events : { mouseOver : function()
											{
												$('.tooltip-default-message').hide();
											}, mouseOut : function(e)
											{
												$('.tooltip-default-message').show();
											} } } },

										series : [
											{ type : 'pie', name : 'Tag', data : pieData, startAngle : 90 }
										], exporting : { enabled : false } }, function(chart)
									{ // on complete

										chart.renderer.image('img/donut-tooltip-frame.png', 14, 5, 200, 80).add();
										chart.renderer.text(this.options.tooltip.message, 50, 40).attr("class", 'tooltip-default-message').add();

									});
						});
	});
}

/**
 * Function to build either stacked graph or bar graph using highcharts. Inorder
 * to show bar graph, initialize stacked parameter as null.
 * <p>
 * Data of categories in the bar graph should be as follows: categories: ['Aug
 * 1', 'Aug 2', 'Aug 3', 'Aug 4', 'Aug 5']
 * </p>
 * 
 * <p>
 * Data of series in the bar graph should be as follows: series: [{ name: 'Email
 * Sent', data: [5, 3, 4, 7, 2] }, { name: 'Email Opened', data: [2, 2, 3, 2, 1] }, {
 * name: 'Email Clicked', data: [3, 4, 4, 2, 5] }, { name: 'Total Clicks', data:
 * [3, 4, 4, 2, 5] }]
 * </p>
 * 
 * @param url -
 *            to fetch json data inorder to render graph.
 * @param selector -
 *            id or class of an element where charts should render.
 * @param name -
 *            title of the chart.
 * @param yaxis_name -
 *            name for y-axis.
 * @param stacked -
 *            is stacked graph or bar graph? If bar graph, stacked is null.
 */
function showBar(url, selector, name, yaxis_name, stacked)
{
	var chart;

	// Shows loading image
	$('#' + selector).html(getRandomLoadingImg());

	// Builds graph with the obtained json data.
	setupCharts(function()
	{

		// Loads statistics details from backend
		fetchReportData(url, function(data)
		{

			// Names on X-axis
			var categories = [];

			// Data to map with X-axis and Y-axis.
			var series;

			// Iterates through data and add all keys as categories
			$.each(data, function(k, v)
			{
				categories.push(k);

				// Initializes series with names with the first
				// data point
				if (series == undefined)
				{
					var index = 0;
					series = [];
					$.each(v, function(k1, v1)
					{
						var series_data = {};
						series_data.name = k1;
						series_data.data = [];
						series[index++] = series_data;
					});
				}

				// Fill Data Values with series data
				$.each(v, function(k1, v1)
				{

					// Find series with the name k1 and to that,
					// push v1
					var series_data = find_series_with_name(series, k1);
					series_data.data.push(v1);
				});

			});

			// Draw the graph
			chart = new Highcharts.Chart({
			    chart: {
			        renderTo: selector,
			        type: 'column'
			    },
			    colors: [
			        '#4365AD',
			        '#D52A3E',
			        'gray',
			        '#1E995C'
			    ],
			    title: {
			        text: name
			    },
			    xAxis: {
			        categories: categories,
			        tickPositioner:function()
		            {
		                // to overcome x-axis labels overlapping
			        	if(this.options.categories.length > 30)
		                {
		                    this.options.minTickInterval = 5;
		                }
		            },
			        labels:
			        {
			        	overflow:'justify'
			        }
			    },
			    yAxis: {
			        min: 0,
			        title: {
			            text: yaxis_name
			        },
			        stackLabels: {
			            enabled: true,
			            style: {
			                fontWeight: 'bold',
			                color: (Highcharts.theme&&Highcharts.theme.textColor)||'gray'
			            }
			        }
			    },
			    legend: {
			        align: 'right',
			        x: -100,
			        verticalAlign: 'top',
			        y: 20,
			        floating: true,
			        backgroundColor: (Highcharts.theme&&Highcharts.theme.legendBackgroundColorSolid)||'white',
			        borderColor: '#CCC',
			        borderWidth: 1,
			        shadow: false
			    },
			    tooltip: {
			        formatter: function(){
			            return'<b>'+this.x+'</b><br/>'+this.series.name+': '+this.y;
			        }
			    },
			    plotOptions: {
			        column: {
			            stacking: stacked,
			            dataLabels: {
			                enabled: true,
			                color: (Highcharts.theme&&Highcharts.theme.dataLabelsColor)||'white'
			            }
			        }
			    },
			    series: series
			});
			});
	});
}

/**
 * Small utility function to search series with a given name. Returns series
 * with index if given name matches. It provides way to enter values within
 * the data array of given name.
 * 
 * @param series -
 *              chart series data.
 * @param name - 
 *              series name.
 */
function find_series_with_name(series, name)
{
	for ( var i = 0; i < series.length; i++)
	{
		if (series[i].name == name)
			return series[i];
	}
}

/**
 * Function to build deal's line chart to compare total value and pipeline value.
 * <p>
 * Data obtained to render deal's line chart will be:
 * [{closed-date:{total:value, pipeline: value},...]
 * </p>
 * 
 * @param url - 
 *            to fetch json data inorder to render graph.
 * @param selector - 
 *            id or class of an element where charts should render.
 * @param name - 
 *            title of the chart.
 * @param yaxis_name - 
 *            name for y-axis
 * @param show_loading
 * 				shows loading image
 */
function showLine(url, selector, name, yaxis_name, show_loading)
{
	
	// Show loading image if required
	if(typeof show_loading === 'undefined')
	{
		// Old calls were not showing loading image..
	}
	else
		$('#' + selector).html(getRandomLoadingImg());
	
	
	var chart;

	// Loads Highcharts plugin using setupCharts and sets up line chart in the
	// callback
	setupCharts(function()
	{

		// Loads statistics details from backend i.e.,[{closed
		// date:{total:value, pipeline: value},...]
		fetchReportData(url, function(data)
		{

			// Categories are closed dates
			var categories = [];
			
			// Data with total and pipeline values
			var series;

			// Iterates through data and adds keys into
			// categories
			$.each(data, function(k, v)
			{

				// Initializes series with names with the first
				// data point
				if (series == undefined)
				{
					var index = 0;
					series = [];
					$.each(v, function(k1, v1)
					{
						var series_data = {};
						series_data.name = k1;
						series_data.data = [];
						series[index++] = series_data;
					});
				}

				// Fill Data Values with series data
				$.each(v, function(k1, v1)
				{

					// Find series with the name k1 and to that,
					// push v1
					var series_data = find_series_with_name(series, k1);
					series_data.data.push([
							k * 1000, v1
					]);
				});

			});

			// After loading and processing all data, highcharts are initialized
			// setting preferences and data to show
			chart = new Highcharts.Chart({
			    chart: {
			        renderTo: selector,
			        type: 'line',
			        marginRight: 130,
			        marginBottom: 25
			    },
			    title: {
			        text: name,
			        x: -20//center
			    },
			    xAxis: {
			        type: 'datetime',
			        dateTimeLabelFormats: {
			            //don't display the dummy year  month: '%e.%b',
			            year: '%b'
			        },
			        minTickInterval: 24 * 3600 * 1000
			    },
			    yAxis: {
			        title: {
			            text: yaxis_name
			        },
			        plotLines: [
			            {
			                value: 0,
			                width: 1,
			                color: '#808080'
			            }
			        ],
			        min: 0
			    },
			    //Tooltip to show details,
			    ongraphtooltip: {
			        formatter: function(){
			            return'<b>'+this.series.name+'</b><br/>'+Highcharts.dateFormat('%e.%b',
			            this.x)+': '+this.y.toFixed(2);
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
			    //Sets the series of data to be shown in the graph,shows total 
			    //and pipeline
			    series: series,
			    exporting: {
			        enabled: false
			    }
			});
		});
	});
}

/**
 * Function to show funnel bsed on the data
 * <p>
 * Shows funnel
 * </p>
 * 
 * @param url - 
 *            to fetch json data inorder to render graph.
 * @param selector - 
 *            id or class of an element where charts should render.
 * @param name - 
 *            title of the chart.
 * @param show_loading
 * 				shows loading image
 */
function showFunnel(url, selector, name, show_loading)
{
	// Show loading image if required
	if(typeof show_loading === 'undefined')
	{
		// Old calls were not showing loading image..
	}
	else
		$('#' + selector).html(getRandomLoadingImg());

	var chart;

	// Loads Highcharts plugin using setupCharts and sets up line chart in the
	// callback
	setupCharts(function()
	{

		// Loads statistics details from backend i.e.,[{closed
		// date:{total:value, pipeline: value},...]
		fetchReportData(url, function(data)
		{
			
			var funnel_data = [];
			
			$.each(data, function(i,v){
				
				// iterate through each data
				$.each(v, function(k1,v1){
					var each_data = [];
					each_data.push(k1, v1);
					funnel_data.push(each_data);
				});
				
			});
			
			console.log(funnel_data);
			
			chart = new Highcharts.Chart({
		        chart: {
		            type: 'funnel',
		            marginRight: 100,
		            renderTo: selector
		        },
		        title: {
		            text: name,
		            x: -50
		        },
		        plotOptions: {
		            series: {
		                dataLabels: {
		                    enabled: true,
		                    format: '<b>{point.name}</b> ({point.y:,.0f})',
		                    color: 'black',
		                    softConnector: true
		                },
		                neckWidth: '30%',
		                neckHeight: '25%'
		                
		                //-- Other available options
		                // height: pixels or percent
		                // width: pixels or percent
		            }
		        },
		        legend: {
		            enabled: false
		        },
		        series: [{
		            name: 'Contacts',
		            data: funnel_data
		        }]
		    });
			
		});
	});
}


/**
 * Function to build Cohorts
 * <p>
 * The data is not manipulated and the server sends it the required format. We do not use showBar code to decode as some of the data in the cohorts are not sent back 
 * </p>
 * 
 * @param url - 
 *            to fetch json data inorder to render graph.
 * @param selector - 
 *            id or class of an element where charts should render.
 * @param name - 
 *            title of the chart.
 * @param yaxis_name - 
 *            name for y-axis
 * @param show_loading
 * 				shows loading image
 */
function showCohorts(url, selector, name, yaxis_name, show_loading)
{
	
	// Show loading image if required
	if(typeof show_loading === 'undefined')
	{
		// Old calls were not showing loading image..
	}
	else
		$('#' + selector).html(getRandomLoadingImg());
	
	
	var chart;

	// Loads Highcharts plugin using setupCharts and sets up line chart in the
	// callback
	setupCharts(function()
	{

		// Loads statistics details from backend i.e.,[{closed
		// date:{total:value, pipeline: value},...]
		fetchReportData(url, function(data)
		{

			// Categories are closed dates
			var categories = data.categories;
			
			// Data with total and pipeline values
			var series = data.series;

			// After loading and processing all data, highcharts are initialized
			// setting preferences and data to show
			chart = new Highcharts.Chart({
			    chart: {
			        renderTo: selector,
			        type: 'line',
			        marginRight: 130,
			        marginBottom: 25,
			        zoomType: 'x'
			    },
			    title: {
			        text: name,
			        x: -20//center
			    },
			    xAxis: {
			       categories: categories
			    },
			    yAxis: {
			        title: {
			            text: yaxis_name
			        },
			        plotLines: [
			            {
			                value: 0,
			                width: 1,
			                color: '#808080'
			            }
			        ],
			        min: 0
			    },
			    //Tooltip to show details,
			    ongraphtooltip: {
			        formatter: function(){
			            return'<b>'+this.series.name+'</b><br/>'+Highcharts.dateFormat('%e.%b',
			            this.x)+': '+this.y.toFixed(2);
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
			    //Sets the series of data to be shown in the graph,shows total 
			    //and pipeline
			    series: series,
			    exporting: {
			        enabled: false
			    }
			});
		});
	});
}


/**
 * Shows Pie chart for tags of contacts,
 */
function pieTags(el, force_reload)
{
	var url = '/core/api/tags/stats';
	if(force_reload)
		url = url + '?reload=true';
	
	$("#pie-tags-chart", el).html(getRandomLoadingImg());
	
	pie(url, 'pie-tags-chart', '');
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
 * Shows pie chart of milestones using high charts, called from deals controller
 * when deals collection is loaded.
 */
function pieMilestonesByPipeline(pipeline_id)
{
	pie('/core/api/opportunity/stats/milestones/'+pipeline_id+'?min=0&max=1543842319', 'pie-deals-chart', '');
}

/**
 * Shows pie chart of tasks split by Type
 * @param params - params e.g. owner=<owner-id>, directly sent with url as GET request
 */
function pieTasks(params)
{
	pie('core/api/tasks/stats'+params,'pie-tasks-chart','');
}

/**
 * Shows line chart for deal statistics. Compares deal totals and pipeline with respect to 
 * time
 */
function dealsLineChart()
{
	showLine('core/api/opportunity/stats/details?min=0&max=1543842319', 'total-pipeline-chart', 'Monthly Deals', 'Total Value');
}

/**
 * Shows line chart for deal statistics. Compares deal totals and pipeline with respect to 
 * time
 */
function dealsLineChartByPipeline(pipeline_id)
{
	showLine('core/api/opportunity/stats/details/'+pipeline_id+'?min=0&max=1543842319', 'total-pipeline-chart', 'Monthly Deals', 'Total Value');
}

/**
 * Generic function to fetch data for graphs and act accordingly on plan limit error
 * @param url
 * @param successCallback
 */
function fetchReportData(url, successCallback)
{
	// Hides error message
	$("#plan-limit-error").hide();
	
	// Fetches data
	$.getJSON(url, function(data)
			{	
				// Sends data to callback
				if(successCallback && typeof (successCallback) === "function")
					successCallback(data);
			}).error(function(response){
				
				// If error is not billing exception then it is returned
				if(response.status != 406)
					return;
				
				// If it is billing exception, then empty set is sent so page will not be showing loading on error message
				if(successCallback && typeof (successCallback) === "function")
					successCallback([]);
				
				// Show cause of error in saving
				$save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>'
						+ response.responseText
						+ '</i></p></small></div>');
				
				$("#plan-limit-error").html($save_info).show();
			}); 
}