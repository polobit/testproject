/** Activity and contact report add edit functionality * */
var report_utility = {

/** Loads add report for activity email report* */
load_activities : function(el)
{
	// Fills owner select element
	fillSelect("users-list", '/core/api/users', 'domainUser', function()
	{
		loadActivityReportLibs(function()
		{

			$('#activity-type-list, #users-list', el).multiSelect();
			$('#ms-activity-type-list .ms-selection', el).children('ul').addClass('multiSelect').attr("name", "activity").attr("id", "activity_type");
			$('#ms-users-list .ms-selection', el).children('ul').addClass('multiSelect').attr("name", "user_ids").attr("id", "user_ids");
			++count;
			if (count > 0)
				$("#reports-listerners-container").html(el);

			$('.activity_time_timepicker', el).timepicker({ 'timeFormat' : 'H:i ', 'step' : 30 });
			$(".activity_time_timepicker", el).val("09:00");
			$("#report_timezone", el).val(ACCOUNT_PREFS.timezone);

		});

	}, '<option value="{{id}}">{{name}}</option>', true, el);
},

/** Editing the condition for an existing activity email report* */
edit_activities : function(el, json)
{
	var frequency=json.frequency;
	$('#activity-type-list, #users-list', el).multiSelect();
	$('#ms-activity-type-list .ms-selection', el).children('ul').addClass('multiSelect').attr("name", "activity").attr("id", "activity_type");
	$('#ms-users-list .ms-selection', el).children('ul').addClass('multiSelect').attr("name", "user_ids").attr("id", "user_ids");

	$("#reports-listerners-container").html(el)
	$.each(json.user_ids, function(i, user_id)
	{
		$('#users-list').multiSelect('select', user_id);
		console.log('select user---', user_id);
	});
	$.each(json.activity, function(i, activity)
	{
		$('#activity-type-list').multiSelect('select', activity);
		console.log('select activity-------', activity);
	});
	$('#ms-activity-type-list .ms-selection').children('ul').addClass('multiSelect').attr("name", "activity").attr("id", "activity_type");
	$('#ms-users-list .ms-selection').children('ul').addClass('multiSelect').attr("name", "user_ids").attr("id", "user_ids");

	if (json.report_timezone == null)
	{
		$("#report_timezone").val(ACCOUNT_PREFS.timezone);
	}
	// based on frequency we are showing and hiding the time and date and
	// month fields
	updateWeekDayReportVisibility(frequency, "activity");
	$('.activity_time_timepicker').timepicker({ 'timeFormat' : 'H:i ', 'step' : 30 });
},

/** Loads add report for contact email report* */
load_contacts : function(el)
{

	fillSelect("custom-fields-optgroup", "core/api/custom-fields/scope?scope=CONTACT", undefined, function()
	{
		loadActivityReportLibs(function()
		{

			$('#multipleSelect', el).multiSelect({ selectableOptgroup : true });

			$('.ms-selection', el).children('ul').addClass('multiSelect').attr("name", "fields_set").attr("id", "fields_set").sortable();

			++count;
			if (count > 1)
				$("#reports-listerners-container").html(el);

			$('.report_time_timepicker', el).timepicker({ 'timeFormat' : 'H:i ', 'step' : 30 });
			$(".report_time_timepicker", el).val("09:00");
			$("#report_timezone", el).val(ACCOUNT_PREFS.timezone);

		});

	}, '<option value="custom_{{field_label}}">{{field_label}}</option>', true, el);

	head.js(LIB_PATH + 'lib/jquery-ui.min.js', LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
	{
		scramble_input_names($(el).find('div#report-settings'));
		chainFiltersForContact(el, undefined, function()
		{
			++count;
			if (count > 1)
				$("#reports-listerners-container").html(el)
		});
	});
},

/** Editing the condition for an existing contacts email report* */
edit_contacts : function(el, report)
{
	console.log(el);
	console.log(report.toJSON());
	$('#multipleSelect', el).multiSelect({ selectableOptgroup : true });
	++count;
	if (count > 1)
		deserialize_multiselect(report.toJSON(), el);

	setTimeout(function()
	{
		$('.report_time_timepicker').timepicker({ 'timeFormat' : 'H:i ', 'step' : 30 });

		var frequency = report.toJSON().duration;
		updateWeekDayReportVisibility(frequency,"contact");

		if (report.toJSON().report_timezone == null)
		{
			$("#report_timezone").val(ACCOUNT_PREFS.timezone);
		}
	}, 1000);
}, 
/**Function block to be executed for every call back for Call Reports*/
call_reports : function(url,reportType,graphOn){
	var selector="calls-chart";

	var answeredCallsCountList=[];
	var busyCallsCountList=[];
	var failedCallsCountList=[];
	var voiceMailCallsCountList=[];
	var callsDurationList=[];
	var totalCallsCountList=[];
	var domainUsersList=[];
	var domainUserImgList=[];
	var averageCallList=[];
	var sizey = parseInt($('#'+selector).parent().attr("data-sizey"));
	var topPos = 50*sizey;
	if(sizey==2 || sizey==3)
		topPos += 50;
	$('#'+selector).html("<div class='text-center v-middle opa-half' style='margin-top:"+topPos+"px'><img src='../flatfull/img/ajax-loader-cursor.gif' style='width:12px;height:10px;opacity:0.5;' /></div>");

	portlet_graph_data_utility.fetchPortletsGraphData(url,function(data){
		if(data.status==403){
			$('#'+selector).html("<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
			return;
		}
		answeredCallsCountList=data["answeredCallsCountList"];
		busyCallsCountList=data["busyCallsCountList"];
		failedCallsCountList=data["failedCallsCountList"];
		voiceMailCallsCountList=data["voiceMailCallsCountList"];
		callsDurationList=data["callsDurationList"];
		totalCallsCountList=data["totalCallsCountList"];
		domainUsersList=data["domainUsersList"];
		domainUserImgList=data["domainUserImgList"];
		pieGraphRegions=['Answered Calls','Busy Calls','Failed Calls','Voice Mail Calls'];
		
		var series=[];
		var text='';
		var colors;
		
		/**This executes for plotting pie chart*/
		
		if(reportType == 'pie-graph'){ /**When it is a pie graph and dropdown is Number of calls */
			
			var answeredCallCount=0;
			var CompleteCallsCount=[];
			$.each(answeredCallsCountList,function(index,answeredCall){
				answeredCallCount +=answeredCall;
			});
			CompleteCallsCount.push(answeredCallCount);
			var busyCallCount=0;
			$.each(busyCallsCountList,function(index,busyCall){
				busyCallCount +=busyCall;
			});
			CompleteCallsCount.push(busyCallCount);
			var failedCallCount=0;
			$.each(failedCallsCountList,function(index,failedCall){
				failedCallCount +=failedCall;
			});
			CompleteCallsCount.push(failedCallCount);
			var voicemailCallCount=0;
			$.each(voiceMailCallsCountList,function(index,voicemailCall){
				voicemailCallCount +=voicemailCall;
			});
			CompleteCallsCount.push(voicemailCallCount);
			
			
			portlet_graph_utility.callsByPersonPieGraph(selector,pieGraphRegions,CompleteCallsCount);
			return;
			
		}
		
		/**This executes for plotting the Bar graph*/ 
		if(graphOn == "number-of-calls"){
			var tempData={};
			tempData.name="Answered";
			tempData.data=answeredCallsCountList;
			series[0]=tempData;
			
			tempData={};
			tempData.name="Busy";
			tempData.data=busyCallsCountList;
			series[1]=tempData;
			
			tempData={};
			tempData.name="Failed";
			tempData.data=failedCallsCountList;
			series[2]=tempData;
			
			tempData={};
			tempData.name="Voicemail";
			tempData.data=voiceMailCallsCountList;
			series[3]=tempData;
			text="Total Calls";
			colors=['green','blue','red','violet'];
		}
		else if(graphOn == "average-calls"){
			
				var tempData={};
				tempData.name="Average Call Duration";
			    $.each(callsDurationList,function(index,duration){
			    if(duration > 0){
			    	
					var callsDurationAvg=duration/answeredCallsCountList[index];
					averageCallList.push(callsDurationAvg);
			    	
			    }else{
			    	averageCallList.push(0);
			    }
				
			    });
			    tempData.data=averageCallList;
			    tempData.showInLegend=false;
			    series[0]=tempData;
			    text="Average Call Duration (Mins)";
			    colors=['green'];
		}
		else
		{
			var tempData={};
			tempData.name="Total Call Duration";
			var callsDurationInMinsList = [];
			$.each(callsDurationList,function(index,duration){
				if(duration > 0){
					callsDurationInMinsList[index] = duration;
				}else{
					callsDurationInMinsList[index] = 0;
				}
				
			});
			tempData.data=callsDurationInMinsList;
			tempData.showInLegend=false;
			series[0]=tempData;
			text="Calls Duration (Mins)";
			colors=['green'];
		}
		
		portlet_graph_utility.callsPerPersonBarGraph(selector,domainUsersList,series,totalCallsCountList,callsDurationList,text,colors,domainUserImgList);
	});

	return;

},

/**Function block to be executed on every call back for User Reports*/
user_reports :function(callReportUrl){
	
	
	   var selector="calls-chart-user";
		
		var answeredCallsCountList=[];
		var busyCallsCountList=[];
		var failedCallsCountList=[];
		var voiceMailCallsCountList=[];
		var callsDurationList=[];
		var totalCallsCountList=[];
		var domainUsersList=[];
		var domainUserImgList=[];
		var averageCallList=[];
		var sizey = parseInt($('#'+selector).parent().attr("data-sizey"));
		var topPos = 50*sizey;
		if(sizey==2 || sizey==3)
			topPos += 50;
		$('#'+selector).html("<div class='text-center v-middle opa-half' style='margin-top:"+topPos+"px'><img src='../flatfull/img/ajax-loader-cursor.gif' style='width:12px;height:10px;opacity:0.5;' /></div>");
		
		portlet_graph_data_utility.fetchPortletsGraphData(callReportUrl,function(data){
			if(data.status==403){
				$('#'+selector).html("<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
				return;
			}
			answeredCallsCountList=data["answeredCallsCountList"];
			busyCallsCountList=data["busyCallsCountList"];
			failedCallsCountList=data["failedCallsCountList"];
			voiceMailCallsCountList=data["voiceMailCallsCountList"];
			callsDurationList=data["callsDurationList"];
			totalCallsCountList=data["totalCallsCountList"];
			domainUsersList=data["domainUsersList"];
			domainUserImgList=data["domainUserImgList"];
			pieGraphRegions=['Answered Calls','Busy Calls','Failed Calls','Voice Mail Calls'];
			
			var series=[];
			var text='';
			var colors;
			
			/**This executes for plotting pie chart*/
				
				var answeredCallCount=0;
				var CompleteCallsCount=[];
				$.each(answeredCallsCountList,function(index,answeredCall){
					answeredCallCount +=answeredCall;
				});
				CompleteCallsCount.push(answeredCallCount);
				var busyCallCount=0;
				$.each(busyCallsCountList,function(index,busyCall){
					busyCallCount +=busyCall;
				});
				CompleteCallsCount.push(busyCallCount);
				var failedCallCount=0;
				$.each(failedCallsCountList,function(index,failedCall){
					failedCallCount +=failedCall;
				});
				CompleteCallsCount.push(failedCallCount);
				var voicemailCallCount=0;
				$.each(voiceMailCallsCountList,function(index,voicemailCall){
					voicemailCallCount +=voicemailCall;
				});
				CompleteCallsCount.push(voicemailCallCount);
				
				
				portlet_graph_utility.callsByPersonPieGraph(selector,pieGraphRegions,CompleteCallsCount);
			
		});
	
	
}


 };


/* Loads libraries needed for reporting * */
function initReportLibs(callback)
{

	head.load(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js'+'?_=' + _AGILE_VERSION, function()
	{
		callback();

	});
}

/* Loads libraries needed for activity reporting * */
function loadActivityReportLibs(callback)
{

	head.js(LIB_PATH + 'lib/jquery.multi-select.js', CSS_PATH + 'css/businesshours/jquerytimepicker.css', LIB_PATH + 'lib/businesshours/jquerytimepicker.js',
			function()
			{
				callback();
			});

}
/* format the selected start and end dates  as an url * */
function getSelectedDates(){
	var options = "?";

	var range = $('#range').html().split("-");
	var start_time=new Date(range[0]).getTime() / 1000;

	var end_value = $.trim(range[1]);

	
	if (end_value)
		end_value = end_value + " 23:59:59";

	var end_time=new Date(end_value).getTime() / 1000;
	options += ("start-date=" + start_time + "&end-date=" + end_time);
return options;
}
