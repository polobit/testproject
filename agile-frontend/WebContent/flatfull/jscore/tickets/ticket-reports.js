var Ticket_Reports = {
	dailyTickets: function(){

		// Loads Highcharts plugin using setupCharts and sets up line chart in the
	    // callback
	    setupCharts(function()
	    {
			// Loads statistics details from backend 
	        fetchReportData('', function(data)
	        {	
	        	var categories = [];

	        	chartRenderforIncoming('daily-tickets-chart', categories,'Daily Tickets',
	        			'','','', new Array(),new Array())
	        });
	    });
	}
};