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

	head.js(LIB_PATH + 'lib/flot/highcharts-3.js', LIB_PATH + 'lib/flot/highcharts-exporting.js', LIB_PATH + 'lib/flot/funnel.js',LIB_PATH + 'lib/flot/highcharts-grid.js',
	LIB_PATH + 'lib/flot/no-data-to-display.js', function()
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
										colors: ['#7266ba','#23b7e5','#27c24c','#fad733','#f05050'],
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
												var s = '<div class="highcharts-tool-tip"><div class="tooltip-title" style="color:#333333!important;">' + this.point.name + '</div><div style="text-align:center;margin-top:7px;margin-left:-3px;color:#333333!important;"><b>' + (this.point.percentage)
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
													}, distance : 2 }, showInLegend : false, innerSize : '60%', size : '90%', shadow : false, borderWidth : 0 },
											series : { events : { mouseOver : function()
											{
												$('.tooltip-default-message').hide();
											}, mouseOut : function(e)
											{
												$('.tooltip-default-message').show();
											} },
											borderWidth : 0 } },

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
			   /* colors: [
			        '#4365AD',
			        '#D52A3E',
			        'gray',
			        '#1E995C'
			    ],*/
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
			        x: -52,
			        verticalAlign: 'top',
			        y: 0,
			        floating: true,
			        layout: 'horizontal',
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
			        },
			        series : {
			        	borderWidth : 0
			        },
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
		if (reportDataRequest && reportDataRequest.readyState==1 && reportDataRequest.state()=="pending")
		{
			reportDataRequest.abort();
		}

		// Loads statistics details from backend i.e.,[{closed
		// date:{total:value, pipeline: value},...]
		fetchReportData(url, function(data)
		{

			// Categories are closed dates
			var categories = [];
			var tempcategories = [];
			var dataLength = 0;
			var min_tick_interval = 1;
			var frequency = $( "#frequency:visible").val();
			
			// Data with total and pipeline values
			var series;
			
			var sortedKeys = [];
			$.each(data,function(k,v){
				sortedKeys.push(k);
			});
			sortedKeys.sort();
			var sortedData = {};
			$.each(sortedKeys,function(index,value){
				sortedData[''+value] = data[''+value];
			});

			// Iterates through data and adds keys into
			// categories
			$.each(sortedData, function(k, v)
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
					series_data.data.push(v1);
				});
				tempcategories.push(k*1000);
				dataLength++;

			});

			var cnt = 0;
			if(Math.ceil(dataLength/10)>0)
			{
				min_tick_interval = Math.ceil(dataLength/10);
				if(min_tick_interval==3)
				{
					min_tick_interval = 4;
				}
			}
			$.each(sortedData, function(k, v)
			{
				var dte = new Date(tempcategories[cnt]);
				if(frequency!=undefined)
				{
					if(frequency=="daily")
					{
						categories.push(Highcharts.dateFormat('%e.%b', Date.UTC(dte.getUTCFullYear(), dte.getUTCMonth(), dte.getUTCDate()))+'');
					}
					else if(frequency=="weekly")
					{
						if(cnt!=dataLength-1)
						{
							var next_dte = new Date(tempcategories[cnt+1]);
							categories.push(Highcharts.dateFormat('%e.%b', Date.UTC(dte.getUTCFullYear(), dte.getUTCMonth(), dte.getUTCDate()))+' - '+Highcharts.dateFormat('%e.%b', Date.UTC(next_dte.getUTCFullYear(), next_dte.getUTCMonth(), next_dte.getUTCDate()-1)));
						}
						else
						{
							var end_date = new Date(Date.parse($.trim($('#range').html().split("-")[1])).valueOf());
							categories.push(Highcharts.dateFormat('%e.%b', Date.UTC(dte.getUTCFullYear(), dte.getUTCMonth(), dte.getUTCDate()))+' - '+Highcharts.dateFormat('%e.%b', Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate())));
						}
					}
					else if(frequency=="monthly")
					{
						if(cnt!=dataLength-1)
						{
							var next_dte = new Date(tempcategories[cnt+1]);
							var current_date = new Date();
							var from_date = '';
							var to_date = '';
							if(cnt!=0)
							{
								if(current_date.getUTCFullYear()!=dte.getUTCFullYear())
								{
									from_date = Highcharts.dateFormat('%b.%Y', Date.UTC(dte.getUTCFullYear(), dte.getUTCMonth(), dte.getUTCDate()));
								}
								else
								{
									from_date = Highcharts.dateFormat('%b', Date.UTC(dte.getUTCFullYear(), dte.getUTCMonth(), dte.getUTCDate()));
								
								}
								categories.push(from_date);
							}
							else
							{
								if(current_date.getUTCFullYear()!=dte.getUTCFullYear())
								{
									from_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(dte.getUTCFullYear(), dte.getUTCMonth(), dte.getUTCDate()));
								}
								else
								{
									from_date = Highcharts.dateFormat('%e.%b', Date.UTC(dte.getUTCFullYear(), dte.getUTCMonth(), dte.getUTCDate()));
								
								}
								if(current_date.getUTCFullYear()!=next_dte.getUTCFullYear())
								{
									to_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(next_dte.getUTCFullYear(), next_dte.getUTCMonth(), next_dte.getUTCDate()-1));
								}
								else
								{
									to_date = Highcharts.dateFormat('%e.%b', Date.UTC(next_dte.getUTCFullYear(), next_dte.getUTCMonth(), next_dte.getUTCDate()-1));
								}
								categories.push(from_date+' - '+to_date);
							}
						}
						else
						{
							var current_date = new Date();
							var from_date = '';
							var to_date = '';
							var end_date = new Date(Date.parse($.trim($('#range').html().split("-")[1])).valueOf());
							if(current_date.getUTCFullYear()!=dte.getUTCFullYear())
							{
								from_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(dte.getUTCFullYear(), dte.getUTCMonth(), dte.getUTCDate()));
								to_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate()));
							}
							else
							{
								from_date = Highcharts.dateFormat('%e.%b', Date.UTC(dte.getUTCFullYear(), dte.getUTCMonth(), dte.getUTCDate()));
								to_date = Highcharts.dateFormat('%e.%b', Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate()));
								
							}
							categories.push(from_date+' - '+to_date);
						}
					}
					cnt++;
				}

			});

			// After loading and processing all data, highcharts are initialized
			// setting preferences and data to show
			chart = new Highcharts.Chart({
			    chart: {
			        renderTo: selector,
			        type: 'line',
			        marginRight: 130,
			        marginBottom: 50
			    },
			    title: {
			        text: name,
			        x: -20//center
			    },
			    xAxis: {
			        /*type: 'datetime',
			        dateTimeLabelFormats: {
			            //don't display the dummy year  month: '%e.%b',
			            year: '%b',
			            month: '%e.%b \'%y',
			        },
			        minTickInterval: min_interval,
			        startOfWeek: startOfWeek*/
			        categories: categories,
			        tickmarkPlacement: 'on',
			        minTickInterval: min_tick_interval,
			        tickWidth: 1
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
			    /*ongraphtooltip: {
			        formatter: function(){
			            return'<b>'+this.series.name+'</b><br/>'+Highcharts.dateFormat('%e.%b',
			            this.x)+': '+this.y.toFixed(2);
			        }
			    },*/
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
		                    color: '#ccc',
		                    softConnector: true
		                },
		                neckWidth: '30%',
		                neckHeight: '25%',
		                
		                //-- Other available options
		                // height: pixels or percent
		                // width: pixels or percent
		                borderWidth: 0
		            }
		        },
		        tooltip : {
		        	 headerFormat: '<span style="font-size: 12px">{point.key}</span><br/>'
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
	var frequency=$( "#frequency:visible").val();
	showDealAreaSpline('core/api/opportunity/stats/details?min=0&max=1543842319', 'total-pipeline-chart', 'Monthly Deals', 'Total Value',frequency);
}

/**
 * Shows line chart for deal statistics. Compares deal totals and pipeline with respect to 
 * time
 */
function dealsLineChartByPipeline(pipeline_id)
{
	var frequency=$( "#frequency:visible").val();
	showDealAreaSpline('core/api/opportunity/stats/details/'+pipeline_id+'?min=0&max=1543842319', 'total-pipeline-chart', 'Monthly Revenue - All Deals', 'Total Value',frequency);
}

/**
 * Generic function to fetch data for graphs and act accordingly on plan limit error
 * @param url
 * @param successCallback
 */
 var reportDataRequest;
function fetchReportData(url, successCallback)
{
	// Hides error message
	$("#plan-limit-error").hide();
	
	// Fetches data
	reportDataRequest = $.getJSON(url, function(data)
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
function showAreaSpline(url, selector, name, yaxis_name, show_loading)
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
		if (reportDataRequest && reportDataRequest.readyState==1 && reportDataRequest.state()=="pending")
		{
			reportDataRequest.abort();
		}

		// Loads statistics details from backend i.e.,[{closed
		// date:{total:value, pipeline: value},...]
		fetchReportData(url, function(data)
		{

			// Categories are closed dates
			var categories = [];
			var tempcategories = [];
			var dataLength = 0;
			var min_tick_interval = 1;
			var frequency = $( "#frequency:visible").val();
			
			// Data with total and pipeline values
			var series;
			
			var sortedKeys = [];
			$.each(data,function(k,v){
				sortedKeys.push(k);
			});
			sortedKeys.sort();
			var sortedData = {};
			$.each(sortedKeys,function(index,value){
				sortedData[''+value] = data[''+value];
			});

			// Iterates through data and adds keys into
			// categories
			$.each(sortedData, function(k, v)
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
					series_data.data.push(v1);
				});
				tempcategories.push(k*1000);
				dataLength++;

			});

			var cnt = 0;
			if(Math.ceil(dataLength/10)>0)
			{
				min_tick_interval = Math.ceil(dataLength/10);
				if(min_tick_interval==3)
				{
					min_tick_interval = 4;
				}
			}
			$.each(sortedData, function(k, v)
			{
				var dte = new Date(tempcategories[cnt]);
				if(frequency!=undefined)
				{
					if(frequency=="daily")
					{
						categories.push(Highcharts.dateFormat('%e.%b', Date.UTC(dte.getUTCFullYear(), dte.getUTCMonth(), dte.getUTCDate()))+'');
					}
					else if(frequency=="weekly")
					{
						if(cnt!=dataLength-1)
						{
							var next_dte = new Date(tempcategories[cnt+1]);
							categories.push(Highcharts.dateFormat('%e.%b', Date.UTC(dte.getUTCFullYear(), dte.getUTCMonth(), dte.getUTCDate()))+' - '+Highcharts.dateFormat('%e.%b', Date.UTC(next_dte.getUTCFullYear(), next_dte.getUTCMonth(), next_dte.getUTCDate()-1)));
						}
						else
						{
							var end_date = new Date(Date.parse($.trim($('#range').html().split("-")[1])).valueOf());
							categories.push(Highcharts.dateFormat('%e.%b', Date.UTC(dte.getUTCFullYear(), dte.getUTCMonth(), dte.getUTCDate()))+' - '+Highcharts.dateFormat('%e.%b', Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate())));
						}
					}
					else if(frequency=="monthly")
					{
						if(cnt!=dataLength-1)
						{
							var next_dte = new Date(tempcategories[cnt+1]);
							var current_date = new Date();
							var from_date = '';
							var to_date = '';
							if(cnt!=0)
							{
								if(current_date.getUTCFullYear()!=dte.getUTCFullYear())
								{
									from_date = Highcharts.dateFormat('%b.%Y', Date.UTC(dte.getUTCFullYear(), dte.getUTCMonth(), dte.getUTCDate()));
								}
								else
								{
									from_date = Highcharts.dateFormat('%b', Date.UTC(dte.getUTCFullYear(), dte.getUTCMonth(), dte.getUTCDate()));
								
								}
								categories.push(from_date);
							}
							else
							{
								if(current_date.getUTCFullYear()!=dte.getUTCFullYear())
								{
									from_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(dte.getUTCFullYear(), dte.getUTCMonth(), dte.getUTCDate()));
								}
								else
								{
									from_date = Highcharts.dateFormat('%e.%b', Date.UTC(dte.getUTCFullYear(), dte.getUTCMonth(), dte.getUTCDate()));
								
								}
								if(current_date.getUTCFullYear()!=next_dte.getUTCFullYear())
								{
									to_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(next_dte.getUTCFullYear(), next_dte.getUTCMonth(), next_dte.getUTCDate()-1));
								}
								else
								{
									to_date = Highcharts.dateFormat('%e.%b', Date.UTC(next_dte.getUTCFullYear(), next_dte.getUTCMonth(), next_dte.getUTCDate()-1));
								}
								categories.push(from_date+' - '+to_date);
							}
						}
						else
						{
							var current_date = new Date();
							var from_date = '';
							var to_date = '';
							var end_date = new Date(Date.parse($.trim($('#range').html().split("-")[1])).valueOf());
							if(current_date.getUTCFullYear()!=dte.getUTCFullYear())
							{
								from_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(dte.getUTCFullYear(), dte.getUTCMonth(), dte.getUTCDate()));
								to_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate()));
							}
							else
							{
								from_date = Highcharts.dateFormat('%e.%b', Date.UTC(dte.getUTCFullYear(), dte.getUTCMonth(), dte.getUTCDate()));
								to_date = Highcharts.dateFormat('%e.%b', Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate()));
								
							}
							categories.push(from_date+' - '+to_date);
						}
					}
					cnt++;
				}

			});

			// After loading and processing all data, highcharts are initialized
			// setting preferences and data to show
			chart = new Highcharts.Chart({
			    chart: {
			        renderTo: selector,
			        type: 'areaspline',
			        marginRight: 130,
			        marginBottom: 50
			    },
			    title: {
			        text: name,
			        x: -20//center
			    },
			    xAxis: {
			        /*type: 'datetime',
			        dateTimeLabelFormats: {
			            //don't display the dummy year  month: '%e.%b',
			            year: '%b',
			            month: '%e.%b \'%y',
			        },
			        minTickInterval: min_interval,
			        startOfWeek: startOfWeek*/
			        categories: categories,
			        tickmarkPlacement: 'on',
			        minTickInterval: min_tick_interval,
			        tickWidth: 1
			    },
			    yAxis: {
			    	allowDecimals: false,
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
			    /*ongraphtooltip: {
			        formatter: function(){
			            return'<b>'+this.series.name+'</b><br/>'+Highcharts.dateFormat('%e.%b',
			            this.x)+': '+this.y.toFixed(2);
			        }
			    },*/
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
function showDealAreaSpline(url, selector, name, yaxis_name, show_loading,frequency)
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
			
			//The below code is commented as frequency is now sent as a parameter 
			//var frequency = $( "#frequency:visible").val();
			var tempcategories=[];
			// Data with total and pipeline values
			var series;
			
			var sortedKeys = [];
			$.each(data,function(k,v){
				sortedKeys.push(k);
			});
			sortedKeys.sort();
			var sortedData = {};
			$.each(sortedKeys,function(index,value){
				sortedData[''+value] = data[''+value];
			});

			var min_tick_interval = 1;
			var dataLength = 0;
			// Iterates through data and adds keys into
			// categories
			$.each(sortedData, function(k, v)
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
					series_data.data.push(v1);
				});
				tempcategories.push(k*1000);
				dataLength++;
			});
				//
				var cnt=0;
				$.each(sortedData, function(k, v)
			{
				var dt = new Date(k * 1000);
				var dte = new Date(tempcategories[cnt]);
				if(selector=="revenue-chart"){

						if(frequency!=undefined)
				{
					if(frequency=="daily")
					{
						categories.push(Highcharts.dateFormat('%e.%b',Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()))+'');
					}
					else if(frequency=="weekly")
					{
						if(cnt!=dataLength-1)
						{
							var next_dte = new Date(tempcategories[cnt+1]);
							categories.push(Highcharts.dateFormat('%e.%b', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()))+' - '+Highcharts.dateFormat('%e.%b', Date.UTC(next_dte.getFullYear(), next_dte.getMonth(), next_dte.getDate()-1)));
						}
						else
						{
							var end_date = new Date(Date.parse($.trim($('#range').html().split("-")[1])).valueOf());
							categories.push(Highcharts.dateFormat('%e.%b', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()))+' - '+Highcharts.dateFormat('%e.%b', Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate())));
						}
					}
					else if(frequency=="monthly" || frequency=="yearly")
					{
						if(cnt!=dataLength-1)
						{
							var next_dte = new Date(tempcategories[cnt+1]);
							var current_date = new Date();
							var from_date = '';
							var to_date = '';
							if(cnt!=0)
							{
								if(frequency=="yearly")
									from_date = Highcharts.dateFormat('%Y', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()));
								else{
								if(current_date.getFullYear()!=dte.getFullYear())
								{
									from_date = Highcharts.dateFormat('%b.%Y', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()));
								}
								else
								{
									from_date = Highcharts.dateFormat('%b', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()));
								
								}
							}
								categories.push(from_date);
							}
							else
							{
								var start_date=new Date(Date.parse($.trim($('#range').html().split("-")[0])).valueOf());
								if(current_date.getFullYear()!=dte.getFullYear())
								{
									from_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(start_date.getFullYear(), start_date.getMonth(), start_date.getDate()));
								}
								else
								{
									from_date = Highcharts.dateFormat('%e.%b', Date.UTC(start_date.getFullYear(), start_date.getMonth(), start_date.getDate()));
								
								}
								//if(current_date.getFullYear()!=next_dte.getFullYear())
								
									to_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(next_dte.getFullYear(), next_dte.getMonth(), next_dte.getDate()-1));
								
								categories.push(from_date+' - '+to_date);
							}
						}
						else
						{
							var current_date = new Date();
							var from_date ='';
							var start_date=new Date(Date.parse($.trim($('#range').html().split("-")[0])).valueOf());
							var to_date = '';
							var end_date = new Date(Date.parse($.trim($('#range').html().split("-")[1])).valueOf());
							if(current_date.getFullYear()!=dte.getFullYear())
							{
								if(cnt==0)
									from_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(start_date.getFullYear(), start_date.getMonth(), start_date.getDate()));
								else
									from_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()));
							
								to_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate()));
							}
							else
							{
								if(cnt==0)
								  from_date = Highcharts.dateFormat('%e.%b', Date.UTC(start_date.getFullYear(), start_date.getMonth(), start_date.getDate()));
								else
									from_date = Highcharts.dateFormat('%e.%b', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()));
								
								to_date = Highcharts.dateFormat('%e.%b', Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate()));
								
							}
							categories.push(from_date+' - '+to_date);
						}
					}
					else if(frequency=="Quarterly")
					{
						if(cnt!=dataLength-1)
						{
							var next_dte = new Date(tempcategories[cnt+1]);
							var current_date = new Date();
							var from_date = '';
							var to_date = '';
							if(cnt!=0)
							{
								if(current_date.getFullYear()!=dte.getFullYear())
								{
									categories.push(Highcharts.dateFormat('%b.%y', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()))+' - '+Highcharts.dateFormat('%b.%y', Date.UTC(next_dte.getFullYear(), next_dte.getMonth()-1, next_dte.getDate())));
								}
								else
								{
									categories.push(Highcharts.dateFormat('%b', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()))+' - '+Highcharts.dateFormat('%b', Date.UTC(next_dte.getFullYear(), next_dte.getMonth()-1, next_dte.getDate())));
	
								}
								
							}
							else
							{
								var start_date=new Date(Date.parse($.trim($('#range').html().split("-")[0])).valueOf());
								if(current_date.getFullYear()!=dte.getFullYear())
								{
									from_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(start_date.getFullYear(), start_date.getMonth(), start_date.getDate()));
								}
								else
								{
									from_date = Highcharts.dateFormat('%e.%b', Date.UTC(start_date.getFullYear(), start_date.getMonth(), start_date.getDate()));
								
								}
								if(current_date.getFullYear()!=next_dte.getFullYear())
								{
									to_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(next_dte.getFullYear(), next_dte.getMonth(), next_dte.getDate()-1));
								}
								else
								{
									to_date = Highcharts.dateFormat('%e.%b', Date.UTC(next_dte.getFullYear(), next_dte.getMonth(), next_dte.getDate()-1));
								}
								categories.push(from_date+' - '+to_date);
							}
							
									}
						else
						{
							var current_date = new Date();
							var from_date ='';
							var start_date=new Date(Date.parse($.trim($('#range').html().split("-")[0])).valueOf());
							var to_date = '';
							var end_date = new Date(Date.parse($.trim($('#range').html().split("-")[1])).valueOf());
							if(current_date.getFullYear()!=dte.getFullYear())
							{
								if(cnt==0)
									from_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(start_date.getFullYear(), start_date.getMonth(), start_date.getDate()));
								else
									from_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()));
							
								to_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate()));
							}
							else
							{
								if(cnt==0)
								  from_date = Highcharts.dateFormat('%e.%b', Date.UTC(start_date.getFullYear(), start_date.getMonth(), start_date.getDate()));
								else
									from_date = Highcharts.dateFormat('%e.%b', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()));
								
								to_date = Highcharts.dateFormat('%e.%b', Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate()));
								
							}
							categories.push(from_date+' - '+to_date);
						}
					}

					cnt++;
				}
				}
					//categories.push(Highcharts.dateFormat('%e.%b',Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()))+'');
				else
					categories.push(Highcharts.dateFormat('%b.%Y',Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()))+'');
				//dataLength++;
			});

			if(Math.ceil((dataLength-1)/10)>0)
			{
				min_tick_interval = Math.ceil(dataLength/10);
				if(min_tick_interval==3)
				{
					min_tick_interval = 4;
				}
			}

			// After loading and processing all data, highcharts are initialized
			// setting preferences and data to show
			chart = new Highcharts.Chart({
			    chart: {
			        renderTo: selector,
			        type: 'areaspline',
			        marginRight: 130,
			        marginBottom: 50
			    },
			    title: {
			        text: name,
			        x: -20,//center
			        style : {
						textTransform : 'normal'
					}
			    },
			    xAxis: {
			        //type: 'datetime',
			        /*dateTimeLabelFormats: {
			            //don't display the dummy year  month: '%e.%b',
			            year: '%b'
			        },*/
			        //minTickInterval: 24 * 3600 * 1000
			        categories: categories,
			        tickmarkPlacement: 'on',
			        minTickInterval : min_tick_interval
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
			    tooltip: {
	    			formatter: function(){
		        		return '<div>' + 
		        		        '<div class="p-n">'+this.x+'</div>' + 
		        		        '<div class="p-n"><font color='+this.series.color+'>'+this.series.name+'</font> : '+getCurrencySymbolForCharts()+''+getNumberWithCommasForCharts(this.y)+'</div>' +
		        		        '</div>';
		        	},
		        	useHTML: true
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
			    },
			    lang: {
            				noData: "No Deals Found"
        				},
        					noData: {
           								style: {
             								
               									fontSize: '14px',
               									fontWeight : 'normal',
               									color : '#98A6AD'

      	     									 },
      	     							 position :{
               									 x : 60,
               									 y: 5
           									 },
       								 }
			});
		});
	});
}

/** get the symbol for currency to be used in various charts **/
function getCurrencySymbolForCharts(){
	var value = ((CURRENT_USER_PREFS.currency != null) ? CURRENT_USER_PREFS.currency : "USD-$");
	var symbol = ((value.length < 4) ? "$" : value.substring(4, value.length));
	return symbol;
}

/** get the comma separated number for charts **/
function getNumberWithCommasForCharts(value){
	value = parseFloat(value);
	value = Math.round(value);
	if(value==0)
		return value;

	if (value)
		return value.toFixed(2).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",").replace('.00', '');
}
function showDealsGrowthgraph(url, selector, name, yaxis_name, show_loading)
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

        // Loads statistics details from backend 
        fetchReportData(url, function(data)
        {

            // Categories are created time
            var categories = [];
            var tempcategories=[];
            var type = $( "#type:visible").val();
            var frequency= $("#frequency:visible").val();
            // Data with deals
            var series;
            var AllData=[];
            var sortedKeys = [];
            $.each(data,function(k,v){
                sortedKeys.push(k);
            });
            sortedKeys.sort();
            var sortedData = {};
            $.each(sortedKeys,function(index,value){
                sortedData[''+value] = data[''+value];
            });

            var min_tick_interval = 1;
            var dataLength = 0;
            // Iterates through data and adds keys into
            // categories
            $.each(sortedData, function(k, v)
            {
            	var totalData=[];
            	totalData.push(k);
            	var total=0;
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
                        //totalData.push(total);
                    });
                
                }


                // Fill Data Values with series data
                $.each(v, function(k1, v1)
                {
                	total=total+v1;
                    // Find series with the name k1 and to that,
                    // push v1
                    var series_data = find_series_with_name(series, k1);
                    series_data.data.push(v1);
                });
                     totalData.push(total);
                tempcategories.push(k*1000);
				dataLength++;
				AllData.push(totalData);
			});
				
				var cnt=0;
				$.each(sortedData, function(k, v)
			{
                var dt = new Date(k * 1000);
                var dte = new Date(tempcategories[cnt]);
                if(frequency=="daily")
					{
						categories.push(Highcharts.dateFormat('%e.%b',Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()))+'');
					}
				else if(frequency=="weekly")
					{
						if(cnt!=dataLength-1)
						{
							var next_dte = new Date(tempcategories[cnt+1]);
							categories.push(Highcharts.dateFormat('%e.%b', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()))+' - '+Highcharts.dateFormat('%e.%b', Date.UTC(next_dte.getFullYear(), next_dte.getMonth(), next_dte.getDate()-1)));
						}
						else
						{
							var end_date = new Date(Date.parse($.trim($('#range').html().split("-")[1])).valueOf());
							categories.push(Highcharts.dateFormat('%e.%b', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()))+' - '+Highcharts.dateFormat('%e.%b', Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate())));
						}
					}
				else if(frequency=="monthly")
					{
						if(cnt!=dataLength-1)
						{
							var next_dte = new Date(tempcategories[cnt+1]);
							var current_date = new Date();
							var from_date = '';
							var to_date = '';
							if(cnt!=0)
							{
								if(current_date.getFullYear()!=dte.getFullYear())
								{
									from_date = Highcharts.dateFormat('%b.%Y', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()));
								}
								else
								{
									from_date = Highcharts.dateFormat('%b', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()));
								
								}
							
								categories.push(from_date);
							}
							else
							{
								var start_date=new Date(Date.parse($.trim($('#range').html().split("-")[0])).valueOf());
								if(current_date.getFullYear()!=dte.getFullYear())
								{
									from_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(start_date.getFullYear(), start_date.getMonth(), start_date.getDate()));
								}
								else
								{
									from_date = Highcharts.dateFormat('%e.%b', Date.UTC(start_date.getFullYear(), start_date.getMonth(), start_date.getDate()));
								
								}
								//if(current_date.getFullYear()!=next_dte.getFullYear())
								
									to_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(next_dte.getFullYear(), next_dte.getMonth(), next_dte.getDate()-1));
								
								categories.push(from_date+' - '+to_date);
							}
						}
						else
						{
							var current_date = new Date();
							var from_date ='';
							var start_date=new Date(Date.parse($.trim($('#range').html().split("-")[0])).valueOf());
							var to_date = '';
							var end_date = new Date(Date.parse($.trim($('#range').html().split("-")[1])).valueOf());
							if(current_date.getFullYear()!=dte.getFullYear())
							{
								if(cnt==0)
									from_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(start_date.getFullYear(), start_date.getMonth(), start_date.getDate()));
								else
									from_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()));
							
								to_date = Highcharts.dateFormat('%e.%b.%Y', Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate()));
							}
							else
							{
								if(cnt==0)
								  from_date = Highcharts.dateFormat('%e.%b', Date.UTC(start_date.getFullYear(), start_date.getMonth(), start_date.getDate()));
								else
									from_date = Highcharts.dateFormat('%e.%b', Date.UTC(dte.getFullYear(), dte.getMonth(), dte.getDate()));
								
								to_date = Highcharts.dateFormat('%e.%b', Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate()));
								
							}
							categories.push(from_date+' - '+to_date);
						}
					}
                 cnt++;
            });

            if(Math.ceil((dataLength-1)/10)>0)
            {
                min_tick_interval = Math.ceil(dataLength/10);
                if(min_tick_interval==3)
                {
                    min_tick_interval = 4;
                }
            }
            if(series==undefined)
            	 chartRenderforIncoming(selector,categories,name,yaxis_name,min_tick_interval,type,series,AllData);
            else
            {
            $.ajax({ type : 'GET', url : '/core/api/categories?entity_type=DEAL_SOURCE', dataType : 'json',
            success: function(data){
                $.each(data,function(index,deals){
                    for(var i=0;i<series.length;i++){
                        if(series[i].name=="0")
                                series[i].name="Unknown";
                        else if(deals.id==series[i].name){
                            series[i].name=deals.label;
                        }
                            
                    }
                });
                chartRenderforIncoming(selector,categories,name,yaxis_name,min_tick_interval,type,series,AllData);
                } 
            });
        	}


            // After loading and processing all data, highcharts are initialized
            // setting preferences and data to show
            
        });
    });
}

function chartRenderforIncoming(selector,categories,name,yaxis_name,min_tick_interval,type,series,AllData){
	chart = new Highcharts.Chart({
                chart: {
                    renderTo: selector,
                    type: 'area',
                    marginRight: 130,
                    marginBottom: 50
                },
                colors: ['#7266ba','#23b7e5','#27c24c','#fad733','#f05050','#FF9900','#7AF168','#167F80','#0560A2','#D3E6C7'],
                title: {
                    text: name,
                    x: -20,//center
                    style : {
                        textTransform : 'normal'
                    }
                },
                xAxis: {
                    categories: categories,
                    tickmarkPlacement: 'on',
                    minTickInterval : min_tick_interval
                },
                yAxis: {
                	allowDecimals: false,
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
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -10,
                    y: 100,
                    borderWidth: 0
                },
                 plotOptions: {
                    area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#666666',
                    fillColor: null
                  }
                 }
                  },
                //Tooltip to show details,
                tooltip: {
                    formatter: function(){
                        if(type=="deals")
                                {
                        return '<div>' + 
                                '<div class="p-n">'+this.x+'</div>' + 
                                '<div class="p-n text-cap"><font color='+this.series.color+'>'+this.series.name+'</font> : '+getNumberWithCommasForCharts(this.y)+'</div>' +
                                '</div>'+
                                '<div class="p-n">Total : '+getNumberWithCommasForCharts(AllData[this.point.x][1])+'</div>';
                            }
                        else
                        {
                        return '<div>' + 
                                '<div class="p-n">'+this.x+'</div>' + 
                                '<div class="p-n"><font color='+this.series.color+'>'+this.series.name+'</font> : '+getCurrencySymbolForCharts()+''+getNumberWithCommasForCharts(this.y)+'</div>' +
                                '</div>'+
                                 '<div class="p-n">Total : '+getCurrencySymbolForCharts()+''+getNumberWithCommasForCharts(AllData[this.point.x][1])+'</div>';;
                            }
                    },
                    useHTML: true
                },
                  lang: {
            				noData: "No Deals Found"
        				},
        					noData: {
           								style: {
             								 
               									fontSize: '14px',
               									fontWeight : 'normal',
        										color : '#98A6AD'
      	     									 },
      	     							 position :{
               									 x : 60,
               									 y: 5
           									 },
       								 },
                //Sets the series of data to be shown in the graph,shows total 
                //and pipeline
                series: series,
                exporting: {
                    enabled: false
                }
            });
}
function pieforReports(url, selector, name,show_loading)
{

	    if(typeof show_loading === 'undefined')
    {
        // Old calls were not showing loading image..
    }
    else
        $('#' + selector).html(getRandomLoadingImg());

	var chart;
	var AllData=[];
	var frequency = $( "#frequency:visible").val();
	setupCharts(function()
	{

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
								var totalData=[];
								totalData.push(k);
								totalData.push(v.count);
								totalData.push(v.total);
								AllData.push(totalData);
								if(frequency=="Revenue")
								total+=v.total;	
								else
								total += v.count;
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
								if(frequency=="Revenue")
									item.push(v.total/ total * 100);
								else
								item.push(v.count/ total * 100);
								pieData.push(item);
							})
							console.log(pieData);
							var animation = count > 20 ? false : true;
							var url_path;
							if(selector=="lossreasonpie-chart" || selector == "lossreasonpie-chart-users")
								url_path='/core/api/categories?entity_type=DEAL_LOST_REASON';
							else
								url_path='/core/api/categories?entity_type=DEAL_SOURCE';
							if(pieData!=undefined && pieData.length==0){
								createAPieChart(selector, name, animation, AllData, pieData);
							}
							else{

							  $.ajax({ type : 'GET', url : url_path, dataType : 'json',
          				  success: function(data){
                			$.each(data,function(index,deals){
                   				 for(var i=0;i<pieData.length;i++){
                     			   if(pieData[i][0]=="0")
                        	      		 pieData[i][0]="Unknown";
                        		else if(deals.id==pieData[i][0]){
                            		pieData[i][0]=deals.label;
                        		}
                        		 createAPieChart(selector, name, animation, AllData, pieData);
                            
                  		  }
                			});

            	    }		
            	     });
					}
						});
	});
	}


	function createAPieChart(selector, name, animation, AllData, pieData){
		var pieSize='90%';
if(selector == 'lossreasonpie-chart-users'){
	pieSize='50%';
}
		// Initializes Highcharts,
	chart = new Highcharts.Chart(
			{
				chart : { renderTo : selector, type : 'pie', plotBackgroundColor : null, plotBorderWidth : null, plotShadow : false,
					marginBottom:50},
				colors: ['#7266ba','#23b7e5','#27c24c','#fad733','#f05050','#FF9900','#7AF168','#167F80','#0560A2','#D3E6C7'],
				title : { text : name },
				 tooltip: {
				formatter:  function(){
						return  '<div>' + 
                              
                                '<div class="p-n">'+this.series.name+'s: <b>'+getNumberWithCommasForCharts(AllData[this.point.x][1])+'</b></div>' +
                                '</div>'+
                                '<div class="p-n">Total Value: <b>'+getCurrencySymbolForCharts()+''+AllData[this.point.x][2].toLocaleString()+'</b></div>';
                        
						},
							  shared: true,
								  useHTML: true,
							 borderWidth : 1,
						backgroundColor : '#313030',
							shadow : false,
						borderColor: '#000',
					borderRadius : 3,
					style : {
					color : '#EFEFEF'
				}
					 },
				legend : { itemWidth : 75, },
				plotOptions : {
					pie : {
						 animation: animation,
						allowPointSelect : true,
						cursor : 'pointer',
						borderWidth : 0,
						dataLabels : { enabled : true,useHTML: true,
							formatter : function()
							{
								return 	'<div class="text-center text-cap"><span style="color:'+this.point.color+';display:block"><b>'+this.point.name+'</b></span>' +
    			'<span style="color:'+this.point.color+'"><b>'+Math.round(this.point.percentage)+'%</b></span></div>';
							}, distance : 25 }, showInLegend : false,size:pieSize,innerSize :'65%',shadow : false, borderWidth : 0 },
					series : { events : { mouseOver : function()
					{
						$('.tooltip-default-message').hide();
					}, mouseOut : function(e)
					{
						$('.tooltip-default-message').show();
					} },
					borderWidth : 0 } },

				series : [
					{ type : 'pie', name : 'Deal', data : pieData, startAngle : 90 }
				], exporting : { enabled : false },

				 lang: {
					noData: "No Deals Found"
					},
					 noData: {
									 style: {
									   
										fontSize: '14px',
										fontWeight : 'normal',
										color : '#98A6AD'
											 },
											 position :{
               									 y: 5
           									 },
								 }
				 } );


	}
