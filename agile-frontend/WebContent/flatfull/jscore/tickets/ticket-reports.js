var Ticket_Reports = {

	tickets: function(){

		var group = 0; 
		var assignee = 0; 

			if($('#group_names').find('option:selected').val()){

	    	group = $('#group_names').find('option:selected').val();

	    }

    	if($('#group_names').find('option:selected').data('assignee-id')){
    		
    		assignee = $('#group_names').find('option:selected').data('assignee-id');
    	}
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
	    	

	    var status = $('#status').find('option:selected').val();
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
					+ end_time + '&frequency=' + frequency+ '&status=' + status+'&group=' + group+'&assignee=' + assignee,'tickets-chart', '', '{{agile_lng_translate "tickets" "count"}}', false);
		});

		$('#status').off('change');
		$('#status').change(function()
		{	
			status = $(this).find('option:selected').val();
			showBar('/core/api/tickets/reports/daily?start_time=' + start_time + '&end_time=' 
					+ end_time + '&frequency=' + frequency + '&status=' + status+'&group=' + group+'&assignee=' + assignee, 'tickets-chart', '', '{{agile_lng_translate "tickets" "count"}}', false, ((status == 'NEW') ? ['#f0ad4e'] : ['#5cb85c']));
		});

		showBar('/core/api/tickets/reports/daily?start_time=' + start_time + '&end_time=' 
				+ end_time + '&frequency=' + frequency + '&status=' + status+'&group=' + group+'&assignee=' + assignee, 'tickets-chart', '', '{{agile_lng_translate "tickets" "count"}}', false, ((status == 'NEW') ? ['#f0ad4e'] : ['#5cb85c']));
		

	},

	priorityReports: function(group,assignee){

		var range = $('#range').html().split("-");
    	var group = 0; 
		var assignee = 0; 

			if($('#group_names').find('option:selected').val()){

	    	group = $('#group_names').find('option:selected').val();

	    }

    	if($('#group_names').find('option:selected').data('assignee-id')){
    		
    		assignee = $('#group_names').find('option:selected').data('assignee-id');
    	}

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
		
	    var report_type = $('#report_type').find('option:selected').val();

	    $('#report_type').off('change');
		$('#report_type').change(function()
		{	
			report_type = $(this).find('option:selected').val();

			var url = '/core/api/tickets/reports/priority?start_time=' + start_time + '&end_time=' + end_time+'&group=' + group+'&assignee=' + assignee,
			    report_title = '{{agile_lng_translate "tickets" "priority-report"}}';

			if(report_type == 'status'){
				url = '/core/api/tickets/reports/status?start_time=' + start_time + '&end_time=' + end_time+'&group=' + group+'&assignee=' + assignee;
			    report_title = '{{agile_lng_translate "tickets" "status-report"}}';
			}

			Ticket_Reports.pieforReports(url,'report-chart', '', true);
			$('.report_name').text(report_title);
		});

		//report_type = $(this).find('option:selected').val();

		var url = '/core/api/tickets/reports/priority?start_time=' + start_time + '&end_time=' + end_time+'&group=' + group+'&assignee=' + assignee,
		    report_title = '{{agile_lng_translate "tickets" "priority-report"}}';
		if(report_type == 'status'){
			url = '/core/api/tickets/reports/status?start_time=' + start_time + '&end_time=' + end_time + '&group=' + group+'&assignee=' + assignee;
		    report_title = '{{agile_lng_translate "tickets" "status-report"}}';
		}

		Ticket_Reports.pieforReports(url,'report-chart', '', true);
		$('.report_name').text(report_title);
	},


	feedbackReports: function(){
		var range = $('#range').html().split("-");

		var group = 0; 
		var assignee = 0; 

			if($('#group_names').find('option:selected').val()){

	    	group = $('#group_names').find('option:selected').val();

	    }

    	if($('#group_names').find('option:selected').data('assignee-id')){
    		
    		assignee = $('#group_names').find('option:selected').data('assignee-id');
    	}
    
	    var start_time = getUTCMidNightEpochFromDate(new Date(range[0]));
	    var d = new Date();
	    start_time=start_time+(d.getTimezoneOffset()*60*1000);
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
		
		Ticket_Reports.pieforfeedbackReport('/core/api/tickets/reports/feedback?start_time=' + start_time + '&end_time=' + end_time+'&group=' + group+'&assignee=' + assignee,
			'feedback', '', true);
		
	},
	getTicketFeedbackTitleFromValue: function(val) {

		if( val == "1")		return "{{agile_lng_translate 'tickets' 'unacceptable'}}";
		if( val == "2" )	return "{{agile_lng_translate 'tickets' 'can_improve'}}";
		if( val == "3" )	return "{{agile_lng_translate 'tickets' 'acceptable'}}";
		if( val == "4" )	return "{{agile_lng_translate 'tickets' 'meets_expectations'}}";
		if( val == "5" )	return "{{agile_lng_translate 'tickets' 'exceptional'}}";
	},

	pieforfeedbackReport: function(url, selector, name){


		$('#' + selector).html("<div class='text-center v-middle opa-half'>" +LOADING_HTML+
			"</div>");

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
				AllData.push(total);

				console.log(data,total);
				// Iterates through data, gets each tag, count and
				// calculate
				// percentage of each tag
				$.each(data, function(k, v)
				{
					var item = [];

					
					// Push tag name in to array
					item.push(Ticket_Reports.getTicketFeedbackTitleFromValue(k));

					item.push(v.count/ total * 100);
					item.push(total);
					pieData.push(item);
				});

				var animation = count > 20 ? false : true;

				Ticket_Reports.createAPieChartforFeedback(selector, name, animation, AllData, pieData);
			});
		});
	},
	
	avgFirstRespTime: function(){

		var group = 0; 
		var assignee = 0; 

		if($('#group_names').find('option:selected').val()){

    		group = $('#group_names').find('option:selected').val();

  		 }

		if($('#group_names').find('option:selected').data('assignee-id')){
		
			assignee = $('#group_names').find('option:selected').data('assignee-id');
		}

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
		
		Ticket_Reports.pieforReports('/core/api/tickets/reports/first-response-time?start_time=' + start_time + '&end_time=' + end_time+'&group=' + group+'&assignee=' + assignee,
			'avg-first-resp-time-chart', '', true);

		// pie('/core/api/tickets/reports/status-report?start_time=' + start_time + '&end_time=' + end_time,
		// 	'status-report-chart', '');
	},

	slaReport: function(){

		var range = $('#range').html().split("-");
    
	    var group = 0; 
		var assignee = 0; 

		if($('#group_names').find('option:selected').val()){

	    	group = $('#group_names').find('option:selected').val();

	    }

    	if($('#group_names').find('option:selected').data('assignee-id')){
    		
    		assignee = $('#group_names').find('option:selected').data('assignee-id');
    	}

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
		
		Ticket_Reports.pieforReports('/core/api/tickets/reports/sla?start_time=' + start_time + '&end_time=' + end_time+'&group=' + group+'&assignee=' + assignee,
			'sla-report-chart', '', true);

		// pie('/core/api/tickets/reports/sla-report?start_time=' + start_time + '&end_time=' + end_time,
		// 	'sla-report-chart', '');
	},
	createAPieChartforFeedback: function(selector, name, animation, AllData, pieData){

				console.log(AllData);
				chart = new Highcharts.Chart({
				chart : { renderTo : selector, 
							type : 'pie', 
							plotBackgroundColor : null, 
							plotBorderWidth : null, 
							plotShadow : false,
							marginBottom:30, 
							marginTop:20, 
							marginLeft: 70, 
							marginRight: 70
						},
				colors: ['#7266ba','#23b7e5','#27c24c','#fad733','#f05050','#FF9900','#7AF168','#167F80','#0560A2','#D3E6C7'],
				title : { text : name },
				tooltip: {
					formatter:  function(){
						return  '<div>' + 
	                        '<div class="p-n">'+this.series.name+': <b>'+ getNumberWithCommasForCharts(AllData[this.point.x][1]) + '</b></div>' +
	                        '</div>'+
	                        '<div class="p-n">{{agile_lng_translate "other" "total"}}: <b>' + AllData[5]+ '</b></div>';
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

				series : [{ type : 'pie', name : 'Feedback', data : pieData, startAngle : 90 }], 
				exporting : { enabled : false },
				lang: { noData: "{{agile_lng_translate 'tickets' 'no-data-found'}}"},
				noData: {
					style: {
						fontSize: '14px',
						fontWeight : 'normal',
						color : '#98A6AD'
					},
					position :{y: 5},
				}
		});
	},

	pieforReports: function(url, selector, name){


		$('#' + selector).html("<div class='text-center v-middle opa-half'>" +LOADING_HTML+
			"</div>");

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
				AllData.push(total);

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

				var animation = count > 20 ? false : true;

				Ticket_Reports.createAPieChart(selector, name, animation, AllData, pieData);
			});
		});
	},

	createAPieChart: function(selector, name, animation, AllData, pieData){

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
	                        '<div class="p-n">{{agile_lng_translate "other" "total"}}: <b>' + AllData[(AllData.length-1)]+ '</b></div>';
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

				series : [{ type : 'pie', name : '{{agile_lng_translate "report-view" "tickets"}}', data : pieData, startAngle : 90 }], 
				exporting : { enabled : false },
				lang: { noData: "{{agile_lng_translate 'tickets' 'no-data-found'}}"},
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