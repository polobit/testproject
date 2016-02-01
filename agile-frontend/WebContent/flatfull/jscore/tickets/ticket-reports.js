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

		if ($('#frequency').length > 0){
			$('#frequency').change(function()
			{	
				frequency = $(this).find('option:selected').val();
				showBar('/core/api/tickets/reports/tickets?start_time=' + start_time + '&end_time=' 
						+ end_time + '&frequency=' + frequency, 'tickets-chart', '', 'Tickets count', false);
			});
		}

		// showDealsGrowthgraph('/core/api/tickets/reports/tickets?start_time=' + start_time + '&end_time=' 
		// 		+ end_time + '&frequency=' + frequency, 'tickets-chart', '', '', '');

		showBar('/core/api/tickets/reports/tickets?start_time=' + start_time + '&end_time=' 
				+ end_time + '&frequency=' + frequency, 'tickets-chart', '', 'Tickets count', false);
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
		
		pie('/core/api/tickets/reports/priority-report?start_time=' + start_time + '&end_time=' + end_time,
			'priority-report-chart', '');
	},

	statusReports: function(){

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
		
		pie('/core/api/tickets/reports/status-report?start_time=' + start_time + '&end_time=' + end_time,
			'status-report-chart', '');
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
		
		pie('/core/api/tickets/reports/sla-report?start_time=' + start_time + '&end_time=' + end_time,
			'sla-report-chart', '');
	}
};