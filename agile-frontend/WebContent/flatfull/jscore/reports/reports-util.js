/** Activity and contact report add edit functionality * */
var report_utility = {

/** Loads add report for activity email report* */
load_activities : function(el)
{
	// Fills owner select element
	fillSelect("users-list", '/core/api/users/partial', 'domainUser', function()
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
			$('.activity_time_timepicker').focus(function(){
 				$('#activityModal').css("overflow", "hidden");
 			});
 			
 			$('.activity_time_timepicker').blur(function(){
 				$('#activityModal').css("overflow", "auto");
 			});

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

	$('.activity_time_timepicker').focus(function(){
		$('#activityModal').addClass('overflow-hidden');
	});
	
	$('.activity_time_timepicker').blur(function(){
		$('#activityModal').removeClass('overflow-hidden');
	});
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
			$('.report_time_timepicker').focus(function(){
 				$('#activityModal').css("overflow", "hidden");
 			});
 			
 			$('.report_time_timepicker').blur(function(){
 				$('#activityModal').css("overflow", "auto");
 			});

			$(".report_time_timepicker", el).val("09:00");
			$("#report_timezone", el).val(ACCOUNT_PREFS.timezone);

		});

	}, '<option value="custom_{{field_label}}">{{field_label}}</option>', true, el);

	head.js(LIB_PATH + 'lib/jquery-ui.min.js', LIB_PATH + 'lib/agile.jquery.chained.min.js?_='+_agile_get_file_hash("agile.jquery.chained.min.js"), function()
	{
		scramble_input_names($(el).find('div#report-settings'));
		chainFiltersForContact(el, undefined, function()
		{
			++count;
			if (count > 1 )
				$("#reports-listerners-container").html(el)
		});
	});
},

/** Editing the condition for an existing contacts email report* */
edit_contacts : function(el, report, flag)
{
	console.log(el);
	console.log(report.toJSON());
	$('#multipleSelect', el).multiSelect({ selectableOptgroup : true });
	++count;
	if (count > 1 )
		deserialize_multiselect(report.toJSON(), el, flag);

	setTimeout(function()
	{
		$('.report_time_timepicker').timepicker({ 'timeFormat' : 'H:i ', 'step' : 30 });

		$('.report_time_timepicker').focus(function(){
			$('#activityModal').css("overflow", "hidden");
		});
		
		$('.report_time_timepicker').blur(function(){
			$('#activityModal').css("overflow", "auto");
		});

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

	var finalCallStatusCountMapList = []; // this contains the detail of status count in list where each entity is a map.
	var finalStatusCountMap = {}; // this map combines all the status from all the users to show in piechart.	
	var totalNonZeroDurationStatusCountList  = [];   
	var callsDurationList=[];
	var totalCallsCountList=[];
	var domainUsersList=[];
	var domainUserImgList=[];
	var averageCallList=[];
	var averageCallList_temp=[];
	var sizey = parseInt($('#'+selector).parent().attr("data-sizey"));
	var topPos = 50*sizey;
	if(sizey==2 || sizey==3)
		topPos += 50;
	$('#'+selector).html("<div class='text-center v-middle opa-half' style='margin-top:"+topPos+"px'>"+LOADING_HTML+"</div>");

	portlet_graph_data_utility.fetchPortletsGraphData(url,function(data){
		if(data.status==403){
			$('#'+selector).html("<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;{{agile_lng_translate 'report-add' 'sorry-you-do-not-have-privileges-access'}}</div>");
			return;
		}

		
		finalStatusCountMapList = data["finalCallStatusCountMapList"];
		callsDurationList=data["callsDurationList"];
		totalCallsCountList=data["totalCallsCountList"];    // this is total calls with zero duration
		domainUsersList=data["domainUsersList"];
		domainUserImgList=data["domainUserImgList"];
		totalNonZeroDurationStatusCountList= data["totalNonZeroDurationStatusCountList"];  // this is total calls with non zero duration
		
		$.each(finalStatusCountMapList,function(index,map){
			$.each(map,function(key,value){
				if(finalStatusCountMap[key]){
					finalStatusCountMap[key] = finalStatusCountMap[key] + value;
				}else{
					finalStatusCountMap[key] = value;
				}
			});
		});
		
		var series=[];
		var text='';
		
		/**This executes for plotting pie chart*/
		if(reportType == 'pie-graph'){ /**When it is a pie graph and dropdown is Number of calls */
			
					var pieGraphRegions = [];
					var CompleteCallsCount = [];
					
					$.each(finalStatusCountMap,function(key,value){
						pieGraphRegions.push(toTitleCase(key));
						CompleteCallsCount.push(value);
					});
					portlet_graph_utility.callsByPersonPieGraph(selector,pieGraphRegions,CompleteCallsCount);
			return;
		}
		
			/**This executes for plotting the Bar graph*/ 
			if(graphOn == "number-of-calls"){
					
					var tempData={};
					
					// Each map in list denotes one user at a time. We will keep the status count for each user in a single array..
					$.each(finalStatusCountMapList, function(index,map){
							$.each(map, function(key,value){
								var statuscountList = [];
								var tempInside ={};
								var statusName = toTitleCase(key);
								if(tempData[statusName]){
									statuscountList = tempData[statusName].data;
									statuscountList.push(value);
								}else{
									tempData[statusName] = tempInside;
									tempData[statusName].name=statusName;
									statuscountList.push(value);
								}
								tempData[statusName].data = statuscountList;
							});
					});
					// other data put the other option in last row of list
					var othersData = {};
					$.each(tempData, function(key,value){
						if(key == "Others"){
							othersData = value;
						}else{
							series.push(value);
						}
					});
					if(!jQuery.isEmptyObject(othersData)){
						series.push(othersData);
					}
					
				text="Total Calls";
				colors="";
			}
			else if(graphOn == "average-calls"){
					var tempData={};
					tempData.name="Average Call Duration";
				    $.each(callsDurationList,function(index,duration){
				    if(duration > 0){
				    	var totalNonZeroDurationCall = totalNonZeroDurationStatusCountList[index];
				    	var callsDurationAvg=0;
				    	if(totalNonZeroDurationCall){
				    		callsDurationAvg=duration/totalNonZeroDurationCall;
				    	}else{
				    		callsDurationAvg=0;
				    	}
						averageCallList_temp.push(callsDurationAvg);
						averageCallList.push(callsDurationAvg/60);
				    	
				    }else{
				    	averageCallList_temp.push(0);
				    	averageCallList.push(0);
				    }
				    });
				    tempData.data=averageCallList;
				    tempData.showInLegend=false;
				    series[0]=tempData;
				    text="{{agile_lng_translate 'calls' 'avg-duration-secs-new'}}";
				    colors=['green'];
			}
			else
			{
				var tempData={};
				tempData.name="Total Call Duration";
				var callsDurationInMinsList = [];
				$.each(callsDurationList,function(index,duration){
					if(duration > 0){
						callsDurationInMinsList[index] = duration/60;
					}else{
						callsDurationInMinsList[index] = 0;
					}
					
				});
				tempData.data=callsDurationInMinsList;
				tempData.showInLegend=false;
				series[0]=tempData;
				text="{{agile_lng_translate 'calls' 'duration-secs-new'}}";
				colors=['green'];
			}
			portlet_graph_utility.callsPerPersonBarGraph(selector,domainUsersList,series,totalCallsCountList,callsDurationList,text,colors,domainUserImgList,undefined,averageCallList_temp);
	});
	return;
},

/**Function block to be executed on every call back for User Reports*/
user_reports :function(callReportUrl){
	
	
		var selector="calls-chart-user";
		var finalCallStatusCountMapList = []; // this contains the detail of status count in list where each entity is a map.
		var finalStatusCountMap = {}; // this map combines all the status from all the users to show in piechart.	
		var totalNonZeroDurationStatusCountList  = [];   
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
		$('#'+selector).html("<div class='text-center v-middle opa-half' style='margin-top:"+topPos+"px'>"+LOADING_HTML+"</div>");
		
		portlet_graph_data_utility.fetchPortletsGraphData(callReportUrl,function(data){
			if(data.status==403){
				$('#'+selector).html("<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;{{agile_lng_translate 'report-add' 'sorry-you-do-not-have-privileges-access'}}</div>");
				return;
			}
			totalNonZeroDurationStatusCountList= data["totalNonZeroDurationStatusCountList"];  // this is total calls with non zero duration
			callsDurationList=data["callsDurationList"];
			totalCallsCountList=data["totalCallsCountList"];
			domainUsersList=data["domainUsersList"];
			domainUserImgList=data["domainUserImgList"];
			finalStatusCountMapList = data["finalCallStatusCountMapList"];
			$.each(finalStatusCountMapList,function(index,map){
				$.each(map,function(key,value){
					if(finalStatusCountMap[key]){
						finalStatusCountMap[key] = finalStatusCountMap[key] + value;
					}else{
						finalStatusCountMap[key] = value;
					}
				});
			});
				var series=[];
				var text='';
				var colors;
				
				var pieGraphRegions = [];
				var CompleteCallsCount = [];
				$.each(finalStatusCountMap,function(key,value){
					pieGraphRegions.push(toTitleCase(key));
					CompleteCallsCount.push(value);
				});
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
										'<div class="portlet-error-message" style=" font-size: 14px;font-style: normal;padding-top: 174px;padding-bottom : 203px">{{agile_lng_translate "portlets" "no-deals-goals-set"}} </div>');
								
					}
					else{

					 showGuage(selector1,data["dealcount"],data["goalCount"],'Won Deals','',true);
					}
					if(data["goalAmount"]==0)
					{
						$('#' + selector2)
										.html(
												'<div class="portlet-error-message" style="font-size: 14px;font-style: normal;padding-top: 174px;padding-bottom : 203px">{{agile_lng_translate "report-view" "no-amount-goals-set"}} </div>');
								
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
				//var div='';
				var pipeline_json=[];
				$.each(data,function(index,data1){
				$.each(data1,function(index,data2){
				 	 $.each(data2,function(k,v){
				 	 	var total=0;
				 	 	$.each(v,function(k1,v1){
				 	 		total=total+v1;
				 	 	});
				 	 	if(total>0){
				 	var div='<div id="'+k+'" class="conversion_track col-sm-4 panel wrapper"></div>';
				 	
				 	$(".converionsPipeline").append(div);

				 	
				 	showFunnelForConversion(k,k,true,v);
				 }
				 	/*//var innerdiv='';
				 	var index=0;
				 		$.ajax({ url : 'core/api/milestone/pipelinesbyName/'+k, type : 'GET', success : function(data)
					{
							console.log(data);
							pipeline_json.push(k,data[0].won_milestone);
							 $('.conversion_track ').each(function(index)
								 {
								 		var id=$(this).attr('id');
								 		var won_class=pipeline_json.pop(id);
								 		$(this).find('.'+won_class);

								 });
					}
				 });
				 	var percent='';
				 	var value;
				 	var total=0;
				 	var first_name;
				 		var first;
				 	$.each(v,function(k1,v1){
				 		var percent='';
				 		var percent_base='';
				 		
				 		total=total+v1;
				 		if(index==0){
				 				if(v1!=0)
				 				percent=100;
				 				else
				 					percent=0;
				 				first=v1;
				 				first_name=k1;
				 			}
				 			else
				 			{
				 				if(value!=0)
				 				percent=(v1*100)/value;
				 				else
				 					percent=0;
				 				if(first!=0)
				 					percent_base=(v1*100)/first;
				 			}
				 				
				 			value=v1;
				 		index++;
				 		if(first_name==k1)
				 			div=div.concat('<div class="'+k1+'">'+
				 				'<span class="pull-right text-primary">(' +v1+')</span>'+
				 				'<span>'+k1+'</span>'+
           				' </div>')
				 		else
				 			div=div.concat('<div class="'+k1+'">'+
              '<span class="pull-right text-primary">'+Math.round(percent)+'% ('+percent_base+'% of ' +first_name+')(' +v1+')</span>'+
              '<span>'+k1+'</span>'+
           ' </div>');
				 			div=div.concat(
            '<div class="progress progress-xs m-t-sm bg-light">'+
              '<div class="progress-bar bg-primary" data-toggle="tooltip" data-original-title="'+Math.round(percent)+'%" style="width: '+Math.round(percent)+'%"></div>'+
            '</div>');
				 	});

				 	if(total==0)
				 		div=div.concat('<div class="hidden"></div>');
				 	div=div.concat('</div>');
				 	
				 		//$('.conversion_track').hide();*/
				 	
				 });
});				
}); 
				 if($('.converionsPipeline').children().length!=0)
				 	$('.converionsPipeline').parents('.row').find('.bg-primary').show();

				
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
							goal_url=goal_url+ getSelectedDates()+'&time_zone=' + (new Date().getTimezoneOffset());;
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
	

},
 
 	loadReportsTemplate : function(callback){
 		if (!tight_acl.checkPermission('REPORT'))
					return;

				//$("#content").html("<div id='reports-listerners-container'></div>");
				getTemplate('report-categories', {}, undefined, function(template_ui)
				{
					if (!template_ui)
						return;
					$('#content').html($(template_ui));
						var dashboard_name = _agile_get_prefs("dashboard_"+CURRENT_DOMAIN_USER.id);
	                    var reports_list;
	                    if(!dashboard_name){
	                    	var role = CURRENT_DOMAIN_USER.role;
	                    	switch(role){
	                    		case "SERVICE":
	                    			dashboard_name = "dashboard";
	                    			break;
	                    		case "MARKETING":
	                    			dashboard_name = "MarketingDashboard";
	                    			break;
	                    		case "SALES":
	                    			dashboard_name = "SalesDashboard";
	                    			break;
	                    	}
	                    	
	                    }
	                    switch(dashboard_name){
	                         case "SalesDashboard" :
	                             reports_list = "salesdashboard-reports";
	                             break;
	                         case "MarketingDashboard" :
	                             reports_list = "marketing-reports";
	                             break;
	                         case "dashboard" :
	                             reports_list = "service-reports"
	                             break;
	                         case "Dashboard" :
	                             reports_list = "service-reports"
	                             break;
	                     }
	                     /*$(".appaside.dropdownnavbar ul li").removeClass("agile-menuactive");
                    	$("."+dashboard_name+"-reportsnavbar").addClass("agile-menuactive") */
                    	$("aside #reportsmenu").addClass("active");
	                     getTemplate(reports_list, {}, undefined, function(template) {
	                         if (!template)
	                             return;
	                         $(".dashboard-wise-reports").html(template);
                    	});

						preloadImages([
							'flatfull/img/reports_images/Growth-graph.png',
							'flatfull/img/reports_images/ratio.png',
							'flatfull/img/reports_images/funnel-graph.png',
							'flatfull/img/reports_images/Campaign-stats.png',
							'flatfull/img/reports_images/Calls-By-User.png',
							'flatfull/img/reports_images/averageofcall.png',
							'flatfull/img/reports_images/user-activities-call.png',
							'flatfull/img/reports_images/Incoming-Deals.png',
							'flatfull/img/reports_images/Lost-Deal-Analysis.png',
							'flatfull/img/reports_images/Revenue.png',
							'flatfull/img/reports_images/Sales-forecast.png',
							'flatfull/img/reports_images/User-reports.png',
							'flatfull/img/reports_images/Call-Outcomes.png',
							'flatfull/img/reports_images/contact.png',
							'flatfull/img/reports_images/user-activities.png',
							'flatfull/img/reports_images/Daily-reports.png',
							'flatfull/img/reports_images/Call_Report_Time.png',
							'flatfull/img/reports_images/Rep_Performance.png',
							'flatfull/img/reports_images/Comparison_Report.png',
							]);
				initializeReportsListeners();
				hideTransitionBar();
				$(".active").removeClass("active");
				
				var tab_id=$('a[href="'+window.location.hash+'"]').parents('.tab-pane').attr('id');
				if(tab_id!=undefined){
						tab_id=$('a[href="#'+tab_id+'"]').parents('.maintab').find('a').attr("href").substring(1);
						_agile_set_prefs('reports_tab', tab_id);
					}
				var reportsTab = _agile_get_prefs("reports_tab");
				$('.sub-nav-tab',$('#reports-tab-container a[href="#'+reportsTab+'"]').parent()).show();
				$('#reports-tab-container a[href="#'+reportsTab+'"]').parent().addClass('report-selected');
				

					$('[data-toggle="tooltip"]').tooltip();
					callback();

				}, "#content");
				
 	}
 };


/* Loads libraries needed for reporting * */
function initReportLibs(callback)
{

	head.load(LIB_PATH + 'lib/date-charts-en.js', LIB_PATH + 'lib/date-range-picker.js'+'?_=' + _agile_get_file_hash('date-range-picker.js'), function()
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
