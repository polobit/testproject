var Ticket_Reports = {

	tickets: function(){

		var range = $('#range').html().split("-");
    
	    var start_time = getUTCMidNightEpochFromDate(new Date(range[0]));
	    var d = new Date();
	    start_time=start_time+(d.getTimezoneOffset()*60*1000);
	    start_time=start_time/1000;
	    var end_value = $.trim(range[1]);

	    // To make end value as end time of day
	    if (end_value)
	        end_value = end_value + " 23:59:59";

	    // Returns milliseconds from end date.
	    //var end_time = Date.parse(end_value).valueOf();
	    //Get the GMT end time
	    var end_time = getUTCMidNightEpochFromDate(new Date(end_value));

	    end_time += (((23*60*60)+(59*60)+59)*1000);
	    end_time=end_time+(d.getTimezoneOffset()*60*1000);
	    end_time=end_time/1000;
		
	    var frequency = $('#frequency').find('option:selected').val();

	    $('#frequency').off('change');
		$('#frequency').change(function()
		{	
			frequency = $(this).find('option:selected').val();
			showBar('/core/api/tickets/reports/daily?start_time=' + start_time + '&end_time=' 
					+ end_time + '&frequency=' + frequency, 'tickets-chart', '', 'Tickets count', false);
		});

		var status = $('#status').find('option:selected').val();
		$('#status').off('change');
		$('#status').change(function()
		{	
			status = $(this).find('option:selected').val();
			showBar('/core/api/tickets/reports/daily?start_time=' + start_time + '&end_time=' 
					+ end_time + '&frequency=' + frequency + '&status=' + status, 'tickets-chart', '', 'Tickets count', false, ((status == 'NEW') ? ['#f0ad4e'] : ['#5cb85c']));
		});

		showBar('/core/api/tickets/reports/daily?start_time=' + start_time + '&end_time=' 
				+ end_time + '&frequency=' + frequency + '&status=' + status, 'tickets-chart', '', 'Tickets count', false, ((status == 'NEW') ? ['#f0ad4e'] : ['#5cb85c']));
	},

	priorityReports: function(){

		var range = $('#range').html().split("-");
    
	    var start_time = getUTCMidNightEpochFromDate(new Date(range[0]));
	    var d = new Date();
	    start_time=start_time+(d.getTimezoneOffset()*60*1000);
	    start_time=start_time/1000;
	    var end_value = $.trim(range[1]);

	    // To make end value as end time of day
	    if (end_value)
	        end_value = end_value + " 23:59:59";

	    // Returns milliseconds from end date.
	    //var end_time = Date.parse(end_value).valueOf();
	    //Get the GMT end time
	    var end_time = getUTCMidNightEpochFromDate(new Date(end_value));

	    end_time += (((23*60*60)+(59*60)+59)*1000);
	    end_time=end_time+(d.getTimezoneOffset()*60*1000);
	    end_time=end_time/1000;
		
	    var report_type = $(this).find('option:selected').val();

	    $('#report_type').off('change');
		$('#report_type').change(function()
		{	
			report_type = $(this).find('option:selected').val();

			var url = '/core/api/tickets/reports/priority?start_time=' + start_time + '&end_time=' + end_time,
			    report_title = 'Priority report';

			if(report_type == 'status'){
				url = '/core/api/tickets/reports/status?start_time=' + start_time + '&end_time=' + end_time;
			    report_title = 'Status report';
			}

			Ticket_Reports.pieforReports(url,'report-chart', '', true);
			$('.report_name').text(report_title);
		});

		report_type = $(this).find('option:selected').val();

		var url = '/core/api/tickets/reports/priority?start_time=' + start_time + '&end_time=' + end_time,
		    report_title = 'Priority report';

		if(report_type == 'status'){
			url = '/core/api/tickets/reports/status?start_time=' + start_time + '&end_time=' + end_time;
		    report_title = 'Status report';
		}

		Ticket_Reports.pieforReports(url,'report-chart', '', true);
		$('.report_name').text(report_title);
	},

	avgFirstRespTime: function(){

		var range = $('#range').html().split("-");
    
	    var start_time = getUTCMidNightEpochFromDate(new Date(range[0]));
	    var d = new Date();
	    start_time=start_time+(d.getTimezoneOffset()*60*1000);
	    start_time=start_time/1000;
	    var end_value = $.trim(range[1]);

	    // To make end value as end time of day
	    if (end_value)
	        end_value = end_value + " 23:59:59";

	    // Returns milliseconds from end date.
	    //var end_time = Date.parse(end_value).valueOf();
	    //Get the GMT end time
	    var end_time = getUTCMidNightEpochFromDate(new Date(end_value));

	    end_time += (((23*60*60)+(59*60)+59)*1000);
	    end_time=end_time+(d.getTimezoneOffset()*60*1000);
	    end_time=end_time/1000;
		
		Ticket_Reports.pieforReports('/core/api/tickets/reports/first-response-time?start_time=' + start_time + '&end_time=' + end_time,
			'avg-first-resp-time-chart', '', true);

		// pie('/core/api/tickets/reports/status-report?start_time=' + start_time + '&end_time=' + end_time,
		// 	'status-report-chart', '');
	},

	slaReport: function(){

		var range = $('#range').html().split("-");
    
	    var start_time = getUTCMidNightEpochFromDate(new Date(range[0]));
	    var d = new Date();
	    start_time=start_time+(d.getTimezoneOffset()*60*1000);
	    start_time=start_time/1000;
	    var end_value = $.trim(range[1]);

	    // To make end value as end time of day
	    if (end_value)
	        end_value = end_value + " 23:59:59";

	    // Returns milliseconds from end date.
	    //var end_time = Date.parse(end_value).valueOf();
	    //Get the GMT end time
	    var end_time = getUTCMidNightEpochFromDate(new Date(end_value));

	    end_time += (((23*60*60)+(59*60)+59)*1000);
	    end_time=end_time+(d.getTimezoneOffset()*60*1000);
	    end_time=end_time/1000;
		
		Ticket_Reports.pieforReports('/core/api/tickets/reports/sla?start_time=' + start_time + '&end_time=' + end_time,
			'sla-report-chart', '', true);

		// pie('/core/api/tickets/reports/sla-report?start_time=' + start_time + '&end_time=' + end_time,
		// 	'sla-report-chart', '');
	},

	pieforReports: function(url, selector, name){


		$('#' + selector).html("<div class='text-center v-middle opa-half'>" + 
			"<img src='../flatfull/img/ajax-loader-cursor.gif' style='width:12px;height:10px;opacity:0.5;' /></div>");

		var chart;
		var AllData=[];

		setupCharts(function()
		{
			fetchReportData(url, function(data)
			{
				// Convert into labels and data as required by Highcharts
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

					item.push(v.count/ total * 100);
					item.push(total);
					pieData.push(item);
				});

				console.log(pieData);

				var animation = count > 20 ? false : true;

				Ticket_Reports.createAPieChart(selector, name, animation, AllData, pieData);
			});
		});
	},

	createAPieChart: function(selector, name, animation, AllData, pieData){

		console.log('All data');
		console.log(AllData);
		console.log('pieData');
		console.log(pieData);

		chart = new Highcharts.Chart({
				chart : { renderTo : selector, type : 'pie', plotBackgroundColor : null, plotBorderWidth : null, plotShadow : false,
					marginBottom:30, marginTop:20, marginLeft: 70, marginRight: 70},
				colors: ['#7266ba','#23b7e5','#27c24c','#fad733','#f05050','#FF9900','#7AF168','#167F80','#0560A2','#D3E6C7'],
				title : { text : name },
				tooltip: {
					formatter:  function(){
						return  '<div>' + 
	                        '<div class="p-n">'+this.series.name+': <b>'+ getNumberWithCommasForCharts(AllData[this.point.x][1]) + '</b></div>' +
	                        '</div>'+
	                        '<div class="p-n">Total: <b>' + pieData[this.point.x][2]+ '</b></div>';
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
				legend : { itemWidth : 75},
				plotOptions : {
					pie : {
						animation: animation,
						allowPointSelect : true,
						cursor : 'pointer',
						borderWidth : 0,
						dataLabels : { 
							enabled : true,
							useHTML: true,
							formatter : function()
							{
								return 	'<div class="text-center text-cap"><span style="color:'+this.point.color+';display:block"><b>'+this.point.name+'</b></span>' +
    							'<span style="color:'+this.point.color+'"><b>'+Math.round(this.point.percentage)+'%</b></span></div>';
							}, 
							distance : 25 
						}, 
						showInLegend : false,
						size: '90%',
						innerSize : '65%',
						shadow : false, 
						borderWidth : 0
					},
					series : { events : { mouseOver : function()
						{
							$('.tooltip-default-message').hide();
						}, mouseOut : function(e)
						{
							$('.tooltip-default-message').show();
						} },
						borderWidth : 0
					}
				},
				series : [{ type : 'pie', name : 'Tickets', data : pieData, startAngle : 90 }], 
				exporting : { enabled : false },
				lang: { noData: "No Data found"},
				noData: {
					style: {
						fontSize: '14px',
						fontWeight : 'normal',
						color : '#98A6AD'
					},
					position :{y: 5},
				}
		});
	}
};