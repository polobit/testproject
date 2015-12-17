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


		if(reportType == 'timebased'){
			showBar(url,selector,null,"","");
			//report_utility.call_timeBased(selector,data);
			return;
		}
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
	$('#'+selector).html("<div class='text-center v-middle opa-half' style='margin-top:"+topPos+"px'><img src='"+updateImageS3Path('../flatfull/img/ajax-loader-cursor.gif')+"' style='width:12px;height:10px;opacity:0.5;' /></div>");

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
		var callsDurationAvg=0;
		var sizey = parseInt($('#'+selector).parent().attr("data-sizey"));
		var topPos = 50*sizey;
		if(sizey==2 || sizey==3)
			topPos += 50;
		$('#'+selector).html("<div class='text-center v-middle opa-half' style='margin-top:"+topPos+"px'><img src='"+updateImageS3Path('../flatfull/img/ajax-loader-cursor.gif')+"' style='width:12px;height:10px;opacity:0.5;' /></div>");
		
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
				
				if(callsDurationList[0]!=0)
				   callsDurationAvg=callsDurationList[0]/answeredCallsCountList[0];

				$('.avg-duration').html("Average Time Spent on Call:"+portlet_utility.getPortletsTimeConversion(Math.round(callsDurationAvg)));
				
				portlet_graph_utility.callsByPersonPieGraph(selector,pieGraphRegions,CompleteCallsCount);
			
		});
},

	Goal_report : function(url)
	{
		var selector1="count_goals_chart";
		var selector2="amount_goals_chart";
		var colors1=[ '#ffffff', '#27C24C' ];
		var colors2= ['#ffffff','#fad733'];
		portlet_graph_data_utility.fetchPortletsGraphData(url,function(data){
					if(data["goalCount"]==0)
					{
						$('#' + selector1)
										.html(
												'<div class="portlet-error-message" style=" font-size: 14px;font-style: normal;padding-top: 174px;padding-bottom : 203px">No Deals Goals set </div>');
								
					}
					else{

					 showGuage(selector1,data["dealcount"],data["goalCount"],'Won Deals','',true);
					}
					if(data["goalAmount"]==0)
					{
						$('#' + selector2)
										.html(
												'<div class="portlet-error-message" style="font-size: 14px;font-style: normal;padding-top: 174px;padding-bottom : 203px">No Amount Goals set </div>');
								
					}
					else{

					 showGuage(selector2,data["dealAmount"],data["goalAmount"],'Revenue','',true);
					}
		});

	},
	
		conversion_report : function(url)
		{
			portlet_graph_data_utility.fetchPortletsGraphData(url,function(data){

				console.log(data);
				var div='';
				 $.each(data,function(k,v){
				 	div=div.concat('<div id='+k+' class="conversion_track col-sm-4 panel wrapper"><b>'+k+'</b>');
				 	//var innerdiv='';
				 	var index=0;

				 	var percent='';
				 	var value;
				 	var total=0;
				 	$.each(v,function(k1,v1){
				 		var percent='';
				 		total=total+v1;
				 		if(index==0){
				 				if(v1!=0)
				 				percent=100;
				 				else
				 					percent=0;
				 			}
				 			else
				 			{
				 				if(value!=0)
				 				percent=(v1*100)/value;
				 				else
				 					percent=0;
				 			}
				 				
				 			value=v1;
				 		index++;
				 			div=div.concat('<div class="">'+
              '<span class="pull-right text-primary">'+Math.round(percent)+'% ('+v1+')</span>'+
              '<span>'+k1+'</span>'+
           ' </div>'+
            '<div class="progress progress-xs m-t-sm bg-light">'+
              '<div class="progress-bar bg-primary" data-toggle="tooltip" data-original-title="'+Math.round(percent)+'%" style="width: '+Math.round(percent)+'%"></div>'+
            '</div>');
				 	});

				 	if(total==0)
				 		div=div.concat('<div class="hidden"></div>');
				 	div=div.concat('</div>');
				 	
				 		//$('.conversion_track').hide();
				 	
				 });
				 $(".converionsPipeline").html(div);
				 $('.hidden').parents('.conversion_track').hide();
			});
		},

getRepPerformanceLog : function(url) {
		fetchReportData(url, function(data)
		{
			if(data.length!=0){
				console.log("Inside RepPerform");
				getTemplate("report-user-data", data, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#rep-performance-reports').html($(template_ui));	
				
				showLossReasonGraphForUserReports();

								/*var callReportUrl='core/api/portlets/calls-per-person/' + getSelectedDates();
							
							if ($('#owner').length > 0)
							{
								if ($("#owner").val() != ""){
									var user=$("#owner").val();
								//var user=CURRENT_DOMAIN_USER.id;
								callReportUrl=callReportUrl+'&user=["'+user+'"]';
							}
							}
							
							report_utility.user_reports(callReportUrl);*/

							var goal_url = '/core/api/portlets/goals/';
							var user;
							if ($('#owner').length > 0)
							{
								if ($("#owner").val() != ""){
									user=$("#owner").val();
								//var user=CURRENT_DOMAIN_USER.id;
								goal_url=goal_url+user;
							}
							}
							goal_url=goal_url+ getSelectedDates();
							report_utility.Goal_report(goal_url);

							var conversion_url='/core/api/opportunity/conversionRate/'+user+getSelectedDates();
							report_utility.conversion_report(conversion_url);
							
			}, "#rep-performance-reports");
			}
			else
			{
				$('#rep-performance-reports').html('<div style="padding-left:50%;color:#98A6AD">No Data to display</div>');
			}
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
