var _agile_library_loader = {
	load_fullcalendar_libs : function(callback){
        head.js(LIB_PATH + 'lib/jquery-ui.min.js', LIB_PATH + 'lib/fullcalendar.min.js', function()
		{
			// LIB_PATH + 'lib/fullcalendar-locales/' + _LANGUAGE +'.js', 
			if(callback)
				 callback();
		});
	},

	localize_highcharts : function(){
		Highcharts.setOptions({"lang" : 
		{
		    contextButtonTitle: "{{agile_lng_translate 'highcharts' 'context-menu'}}",
		    printChart: "{{agile_lng_translate 'highcharts' 'print-chart'}}",
		    downloadJPEG: "{{agile_lng_translate 'highcharts' 'download-jpeg'}}",
		    downloadPDF: "{{agile_lng_translate 'highcharts' 'download-pdf'}}",
		    downloadPNG: "{{agile_lng_translate 'highcharts' 'download-png'}}",
		    downloadSVG: "{{agile_lng_translate 'highcharts' 'download-svg'}}",
		    downloadXLS: "{{agile_lng_translate 'highcharts' 'download-xls}}",
		    downloadCSV: "{{agile_lng_translate 'highcharts' 'download-csv'}}",
		    months: $.fn.datepicker.dates['en'].months,
		    shortMonths: $.fn.datepicker.dates['en'].monthsShort,
		    shortWeekdays: $.fn.datepicker.dates['en'].daysExactMin,
		    weekdays: $.fn.datepicker.dates['en'].days,
		    
		    noData: "No data to display",
		    numericSymbols: [
		        "k",
		        "M",
		        "G",
		        "T",
		        "P",
		        "E"
		    ],
		    resetZoom: "Reset zoom",
		    resetZoomTitle: "Reset zoom"
		}
		})
	},
};