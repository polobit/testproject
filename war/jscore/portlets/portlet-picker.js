
var itemCollection;
var itemCollection1;
var tasksCollection;
function organize_portlets(base_model){
	var itemView = new Base_List_View({ model : base_model, template : this.options.templateKey + "-model", tagName : 'div', });

	// Get portlet type from model (portlet object)
	var portlet_type = base_model.get('portlet_type');
	var is_added = base_model.get('is_added');

	/*
	 * Appends the model (portlet) to its specific div, based on the portlet_type
	 * as div id (div defined in portlet-add.html)
	 */
	if (portlet_type == "CONTACTS")
		$('#contacts', this.el).append($(itemView.render().el).addClass('span6'));

	if (portlet_type == "DEALS")
		$('#deals', this.el).append($(itemView.render().el).addClass('span6'));
	
	if (portlet_type == "TASKSANDEVENTS")
		$('#taksAndEvents', this.el).append($(itemView.render().el).addClass('span6'));
}
function set_p_portlets(base_model){
	var itemView;
	if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Filter Based"){
		itemView = new Base_Model_View({ model : base_model, template : "portlets-contacts-filterbased-model", tagName : 'div' });
	}else if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Emails Opened"){
		itemView = new Base_Model_View({ model : base_model, template : "portlets-contacts-emails-opened-model", tagName : 'div' });
	}else if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Emails Sent"){
		itemView = new Base_Model_View({ model : base_model, template : "portlets-contacts-emails-sent-model", tagName : 'div' });
	}else if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Growth Graph"){
		itemView = new Base_Model_View({ model : base_model, template : "portlets-contacts-growth-graph-model", tagName : 'div' });
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Pending Deals"){
		itemView = new Base_Model_View({ model : base_model, template : "portlets-deals-pending-deals-model", tagName : 'div' });
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Deals By Milestone"){
		itemView = new Base_Model_View({ model : base_model, template : "portlets-deals-deals-by-milestone-model", tagName : 'div' });
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Closures Per Person"){
		itemView = new Base_Model_View({ model : base_model, template : "portlets-deals-closures-per-person-model", tagName : 'div' });
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Deals Won"){
		itemView = new Base_Model_View({ model : base_model, template : "portlets-deals-deals-won-model", tagName : 'div' });
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Deals Funnel"){
		itemView = new Base_Model_View({ model : base_model, template : "portlets-deals-deals-funnel-model", tagName : 'div' });
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Deals Assigned"){
		itemView = new Base_Model_View({ model : base_model, template : "portlets-deals-deals-assigned-model", tagName : 'div' });
	}else if(base_model.get('portlet_type')=="TASKSANDEVENTS" && base_model.get('name')=="Agenda"){
		itemView = new Base_Model_View({ model : base_model, template : "portlets-tasksandevents-agenda-model", tagName : 'div' });
	}else if(base_model.get('portlet_type')=="TASKSANDEVENTS" && base_model.get('name')=="Today Tasks"){
		itemView = new Base_Model_View({ model : base_model, template : "portlets-tasksandevents-today-tasks-model", tagName : 'div' });
	}else if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Calls Per Person"){
		itemView = new Base_Model_View({ model : base_model, template : "portlets-contacts-calls-per-person-model", tagName : 'div' });
	}
	//var itemView = new Base_Model_View({ model : base_model, template : "portlets-model", tagName : 'div', });

	// Get portlet type from model (portlet object)
	var column_position = base_model.get('column_position');
	var row_position = base_model.get('row_position');
	var portlet_settings=base_model.get('settings');
	
	/*if(column_position==1){
		if($('#col-0').children().length==0){
			$('#col-0',this.el).html(getRandomLoadingImg());
			$('#col-0',this.el).html($(itemView.render().el).attr('id','ui-id-'+column_position+'-'+row_position).addClass('portlet_container').css("z-index","0").css("opacity","1"));
		}else{
			$('#col-0',this.el).children(':last').after($(itemView.render().el).attr('id','ui-id-'+column_position+'-'+row_position).addClass('portlet_container').css("z-index","0").css("opacity","1"));
		}
	}else if(column_position==2){
		if($('#col-1').children().length==0){
			$('#col-1',this.el).html(getRandomLoadingImg());
			$('#col-1',this.el).html($(itemView.render().el).attr('id','ui-id-'+column_position+'-'+row_position).addClass('portlet_container').css("z-index","0").css("opacity","1"));
		}else{
			$('#col-1',this.el).children(':last').after($(itemView.render().el).attr('id','ui-id-'+column_position+'-'+row_position).addClass('portlet_container').css("z-index","0").css("opacity","1"));
		}
	}else if(column_position==3){
		if($('#col-2').children().length==0){
			$('#col-2',this.el).html(getRandomLoadingImg());
			$('#col-2',this.el).html($(itemView.render().el).attr('id','ui-id-'+column_position+'-'+row_position).addClass('portlet_container').css("z-index","0").css("opacity","1"));
		}else{
			$('#col-2',this.el).children(':last').after($(itemView.render().el).attr('id','ui-id-'+column_position+'-'+row_position).addClass('portlet_container').css("z-index","0").css("opacity","1"));
		}
	}*/
	if($('.gridster > div:visible > div',this.el).length==0)
		$('.gridster > div',this.el).html($(itemView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
	else
		$('.gridster > div > div:last',this.el).after($(itemView.render().el).attr("id","ui-id-"+base_model.get("column_position")+"-"+base_model.get("row_position")).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
	
	if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Filter Based"){
		if(base_model.get('settings').filter=="companies")
			itemCollection = new Base_Collection_View({ url : '/core/api/portlets/portletContacts?filter='+base_model.get('settings').filter, templateKey : "portlets-companies", individual_tag_name : 'tr' });
		else
			itemCollection = new Base_Collection_View({ url : '/core/api/portlets/portletContacts?filter='+base_model.get('settings').filter, templateKey : "portlets-contacts", individual_tag_name : 'tr' });
	}else if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Emails Opened"){
		itemCollection = new Base_Collection_View({ url : '/core/api/portlets/portletEmailsOpened?duration='+base_model.get('settings').duration, templateKey : 'portlets-contacts', individual_tag_name : 'tr' });
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Pending Deals"){
		itemCollection = new Base_Collection_View({ url : '/core/api/portlets/portletPendingDeals?deals='+base_model.get('settings').deals+'&due-date='+base_model.get('settings')["due-date"], templateKey : 'portlets-opportunities', individual_tag_name : 'tr' });
	}else if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Deals Won"){
		itemCollection = new Base_Collection_View({ url : '/core/api/portlets/portletDealsWon?duration='+base_model.get('settings').duration, templateKey : 'portlets-opportunities', individual_tag_name : 'tr' });
	}else if(base_model.get('portlet_type')=="TASKSANDEVENTS" && base_model.get('name')=="Agenda"){
		itemCollection = new Base_Collection_View({ url : '/core/api/portlets/portletAgenda', templateKey : 'portlets-events', individual_tag_name : 'tr' });
	}else if(base_model.get('portlet_type')=="TASKSANDEVENTS" && base_model.get('name')=="Today Tasks"){
		tasksCollection = new Base_Collection_View({ url : '/core/api/portlets/portletTodayTasks', templateKey : 'portlets-tasks', individual_tag_name : 'tr' });
		tasksCollection.collection.fetch();
	}
	if(itemCollection!=undefined)
		itemCollection.collection.fetch();
	$('.portlet_body',this.el).each(function(){
		if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')!="Deals By Milestone" 
			&& base_model.get('name')!="Closures Per Person" && base_model.get('name')!="Deals Funnel" && base_model.get('name')!="Emails Sent"
				&& base_model.get('name')!="Growth Graph" && base_model.get('name')!="Today Tasks" && base_model.get('name')!="Deals Assigned"
					&& base_model.get('name')!="Calls Per Person"){
			$(this).html(getRandomLoadingImg());
			$(this).html($(itemCollection.render().el));
			
			/*if(base_model.get('portlet_type')=="DEALS" && base_model.get('name')=="Deals Won"){
				var tempEl=$(this);
				setTimeout(function(){
					tempEl.find('.dealsWonValue').show();
					var totalVal=0;
					$.each(itemCollection.collection.models,function(index,model){
						totalVal += parseInt(model.get("expected_value"));
					});
					tempEl.find('.dealsWonValue').append("Total won value:"+totalVal);
				},2000);
			}*/
			
			if(base_model.get('is_minimized'))
				$(this).hide();
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Today Tasks"){
			$(this).html(getRandomLoadingImg());
			$(this).html($(tasksCollection.render().el));
			if(base_model.get('is_minimized'))
				$(this).hide();
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Deals By Milestone"){
			$(this).attr('id','p-body-'+column_position+'-'+row_position);

			var selector=$(this).attr('id');
			var url='/core/api/portlets/portletDealsByMilestone?deals='+base_model.get('settings').deals+'&track='+base_model.get('settings').track+'&due-date='+base_model.get('settings')["due-date"];
			var milestonesList=[];
			var milestoneValuesList=[];
			var milestoneNumbersList=[];
			
			var milestoneMap=[];
			
			fetchPortletsGraphData(url,function(data){
				milestonesList=data["milestonesList"];
				milestoneValuesList=data["milestoneValuesList"];
				milestoneNumbersList=data["milestoneNumbersList"];
				milestoneMap=data["milestoneMap"];
				dealsByMilestoneBarGraph(selector,milestonesList,milestoneValuesList,milestoneNumbersList);
				
				//Added track options
				var options='';
				$.each(milestoneMap,function(milestoneId,milestoneName){
					if(base_model.get('settings').track==0 && milestoneName=="Default")
						options+="<option value="+milestoneId+" selected='selected'>"+milestoneName+"</option>";
					else if(base_model.get('settings').track==milestoneId)
						options+="<option value="+milestoneId+" selected='selected'>"+milestoneName+"</option>";
					else
						options+="<option value="+milestoneId+">"+milestoneName+"</option>";
				});
				$('#'+base_model.get("id")+'-track-options').append(options);
			});
			
			
			if(base_model.get('is_minimized'))
				$(this).hide();
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Closures Per Person"){
			$(this).attr('id','p-body-'+column_position+'-'+row_position);
			
			var selector=$(this).attr('id');
			var url='/core/api/portlets/portletClosuresPerPerson?due-date='+base_model.get('settings')["due-date"];
			
			var milestoneNumbersList=[];
			var milestoneValuesList=[];
			var domainUsersList=[];
			
			fetchPortletsGraphData(url,function(data){
				milestoneNumbersList=data["milestoneNumbersList"];
				milestoneValuesList=data["milestoneValuesList"];
				domainUsersList=data["domainUsersList"];
				
				var catges=[];
				
				$.each(domainUsersList,function(index,domainUser){
					catges.push(domainUser);
				});
				
				var data2=[];
				var text='';
				var name='';
				
				if(base_model.get('settings')["group-by"]=="number-of-deals"){
					$.each(milestoneNumbersList,function(index,mNumber){
						data2.push(mNumber);
					});
					text="No. of Deals Won";
					name="Deals Won";
				}else{
					$.each(milestoneValuesList,function(index,mValue){
						data2.push(mValue);
					});
					text="Deals Won Value";
					name="Won Deal Value";
				}
				
				closuresPerPersonBarGraph(selector,catges,data2,text,name);
			});
			
			if(base_model.get('is_minimized'))
				$(this).hide();
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Deals Funnel"){
			$(this).attr('id','p-body-'+column_position+'-'+row_position);
			
			var selector=$(this).attr('id');
			var url='/core/api/portlets/portletDealsFunnel?deals='+base_model.get('settings').deals+'&track='+base_model.get('settings').track+'&due-date='+base_model.get('settings')["due-date"];
			
			var milestonesList=[];
			var milestoneValuesList=[];
			var milestoneMap=[];
			
			fetchPortletsGraphData(url,function(data){
				milestonesList=data["milestonesList"];
				milestoneValuesList=data["milestoneValuesList"];
				milestoneMap=data["milestoneMap"];
				
				var funnel_data=[];
				var temp=0;
				
				$.each(milestonesList,function(index,milestone){
					var each_data=[];
					
					if(milestone!='Won')
						each_data.push(milestone,milestoneValuesList[index]);
					else
						temp=index;
					if(each_data!="")
						funnel_data.push(each_data);
				});
				
				var temp_data=[];
				temp_data.push(milestonesList[temp],milestoneValuesList[temp]);
				funnel_data.push(temp_data);
				
				dealsFunnelGraph(selector,funnel_data);
				
				//Added track options
				var options='';
				$.each(milestoneMap,function(milestoneId,milestoneName){
					if(base_model.get('settings').track==0 && milestoneName=="Default")
						options+="<option value="+milestoneId+" selected='selected'>"+milestoneName+"</option>";
					else if(base_model.get('settings').track==milestoneId)
						options+="<option value="+milestoneId+" selected='selected'>"+milestoneName+"</option>";
					else
						options+="<option value="+milestoneId+">"+milestoneName+"</option>";
				});
				$('#'+base_model.get("id")+'-track-options').append(options);
			});
			
			if(base_model.get('is_minimized'))
				$(this).hide();
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Emails Sent"){
			$(this).attr('id','p-body-'+column_position+'-'+row_position);
			
			var selector=$(this).attr('id');
			var url='/core/api/portlets/portletEmailsSent?duration='+base_model.get('settings').duration;
			
			var domainUsersList=[];
			var mailsCountList=[];
			
			fetchPortletsGraphData(url,function(data){
				domainUsersList=data["domainUsersList"];
				mailsCountList=data["mailsCountList"];
				
				var catges=[];
				$.each(domainUsersList,function(index,domainUser){
					catges.push(domainUser);
				});
				
				emailsSentBarGraph(selector,catges,mailsCountList);
			});
			
			if(base_model.get('is_minimized'))
				$(this).hide();
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Growth Graph"){
			$(this).attr('id','p-body-'+column_position+'-'+row_position);
			
			var selector=$(this).attr('id');
			var url='/core/api/portlets/portletGrowthGraph?tags='+base_model.get('settings').tags+'&frequency='+base_model.get('settings').frequency+'&start-date='+base_model.get('settings')["start-date"]+'&end-date='+base_model.get('settings')["end-date"];
			
			fetchPortletsGraphData(url,function(data){
				if(data.status==406){
					// Show cause of error in saving
					$save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>'
							+ data.responseText
							+ '</i></p></small></div>');
					
					$("#plan-limit-error-"+base_model.get('id')).html($save_info).show();
					
					return;
				}
				
				var series;
				// Iterates through data and adds keys into
				// categories
				$.each(data, function(k, v){
					// Initializes series with names with the first
					// data point
					if (series == undefined){
						var index = 0;
						series = [];
						$.each(v, function(k1, v1){
							var series_data = {};
							series_data.name = k1;
							series_data.data = [];
							series[index++] = series_data;
						});
					}
					// Fill Data Values with series data
					$.each(v, function(k1, v1){
						// Find series with the name k1 and to that,
						// push v1
						var series_data = find_series_with_name(series, k1);
						series_data.data.push([
								k * 1000, v1
						]);
					});

				});
				
				portletGrowthGraph(selector,series,base_model);
			});
			
			if(base_model.get('is_minimized'))
				$(this).hide();
			
			//Saved tags are appended
			var p_settings=base_model.get('settings');
			var p_tags=p_settings.tags;
			var tags=p_tags.split(",");
			var li='';
			$.each(tags,function(index,tagName){
				if(tagName!="")
					li += "<li data='"+tagName+"' style='display: inline-block;' class='tag'>"+tagName+"<a id='remove_tag' class='close'>&times</a></li>";
			});
			$('#'+base_model.get("id")+'-portlet-ul-tags').append(li);
			
			//enable tags properties
			setup_tags_typeahead();
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Deals Assigned"){
			$(this).attr('id','p-body-'+column_position+'-'+row_position);
			
			var selector=$(this).attr('id');
			var url='/core/api/portlets/portletDealsAssigned?duration='+base_model.get('settings').duration;
			
			var domainUsersList=[];
			var dealsAssignedCountList=[];
			
			fetchPortletsGraphData(url,function(data){
				domainUsersList=data["domainUsersList"];
				dealsAssignedCountList=data["assignedOpportunitiesCountList"];
				
				dealsAssignedBarGraph(selector,domainUsersList,dealsAssignedCountList);
			});
			
			if(base_model.get('is_minimized'))
				$(this).hide();
		}else if($(this).parent().attr('id')=='ui-id-'+column_position+'-'+row_position && base_model.get('name')=="Calls Per Person"){
			$(this).attr('id','p-body-'+column_position+'-'+row_position);
			
			var selector=$(this).attr('id');
			var url='/core/api/portlets/portletCallsPerPerson?duration='+base_model.get('settings').duration;
			
			var incomingCompletedCallsCountList=[];
			var incomingFailedCallsCountList=[];
			var incomingCompletedCallsDurationList=[];
			var outgoingCompletedCallsCountList=[];
			var outgoingFailedCallsCountList=[];
			var outgoingCompletedCallsDurationList=[];
			var completedCallsCountList=[];
			var failedCallsCountList=[];
			var completedCallsDurationList=[];
			var domainUsersList=[];
			
			fetchPortletsGraphData(url,function(data){
				incomingCompletedCallsCountList=data["incomingCompletedCallsCountList"];
				incomingFailedCallsCountList=data["incomingFailedCallsCountList"];
				incomingCompletedCallsDurationList=data["incomingCompletedCallsDurationList"];
				outgoingCompletedCallsCountList=data["outgoingCompletedCallsCountList"];
				outgoingFailedCallsCountList=data["outgoingFailedCallsCountList"];
				outgoingCompletedCallsDurationList=data["outgoingCompletedCallsDurationList"];
				completedCallsCountList=data["completedCallsCountList"];
				failedCallsCountList=data["failedCallsCountList"];
				completedCallsDurationList=data["completedCallsDurationList"];
				domainUsersList=data["domainUsersList"];
				
				var series=[];
				var text='';
				var colors;
				
				if(base_model.get('settings')["group-by"]=="number-of-calls"){
					var tempData={};
					tempData.name="Completed Calls";
					tempData.data=completedCallsCountList;
					series[0]=tempData;
					tempData={};
					tempData.name="Failed Calls";
					tempData.data=failedCallsCountList;
					series[1]=tempData;
					text="No. of Calls";
					colors=['green','red'];
				}else{
					var tempData={};
					tempData.name="Calls Duration";
					tempData.data=completedCallsDurationList;
					series[0]=tempData;
					text="Call Duration";
					colors=['green'];
				}
				
				callsPerPersonBarGraph(selector,domainUsersList,series,text,colors);
			});
			
			if(base_model.get('is_minimized'))
				$(this).hide();
		}
	});
	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
		$(".task-due-time", this.el).timeago();
		$(".event-end-time", this.el).timeago();
	});
	enablePortletTimeAndDates(base_model);
}


function set_p_portlets1(base_model){
	var itemView;
	if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Filter Based"){
		itemView = new Base_Model_View({ model : base_model, template : "portlets-contacts-filterbased-model", tagName : 'li', id : base_model.get("id")+"-li" });
	}
	if($('.gridster > ul > li',this.el).length==0)
		$('.gridster > ul',this.el).html($(itemView.render().el).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
	else
		$('.gridster > ul > li:last',this.el).after($(itemView.render().el).attr("data-sizey",base_model.get("size_y")).attr("data-sizex",base_model.get("size_x")).attr("data-col",base_model.get("column_position")).attr("data-row",base_model.get("row_position")).addClass('gs-w'));
	if(base_model.get('portlet_type')=="CONTACTS" && base_model.get('name')=="Filter Based"){
		if(base_model.get('settings').filter=="companies")
			itemCollection = new Base_Collection_View({ url : '/core/api/portlets/portletContacts?filter='+base_model.get('settings').filter, templateKey : "portlets-companies", individual_tag_name : 'tr' });
		else
			itemCollection = new Base_Collection_View({ url : '/core/api/portlets/portletContacts?filter='+base_model.get('settings').filter, templateKey : "portlets-contacts", individual_tag_name : 'tr' });
	}
	if(itemCollection!=undefined)
		itemCollection.collection.fetch();
	$('#'+base_model.get("id")+'-li > .portlet_body').append($(itemCollection.render().el));
	//$('.gs-w',this.el).append($(itemCollection.render().el));
}




/**
 * Generic function to fetch data for graphs and act accordingly on plan limit error
 * @param url
 * @param successCallback
 */
function fetchPortletsGraphData(url, successCallback){
	// Hides error message
	$("#plan-limit-error").hide();
	
	// Fetches data
	$.getJSON(url, function(data){	
		// Sends data to callback
		if(successCallback && typeof (successCallback) === "function")
			successCallback(data);
	}).error(function(response){
		// If error is not billing exception then it is returned
		if(response.status != 406)
			return;
				
		// If it is billing exception, then empty set is sent so page will not be showing loading on error message
		if(successCallback && typeof (successCallback) === "function")
			successCallback(response);
	}); 
}
function dealsByMilestoneBarGraph(selector,milestonesList,milestoneValuesList,milestoneNumbersList){
	$('#'+selector).html(getRandomLoadingImg());
	
	head.js(LIB_PATH + 'lib/flot/highcharts-3.js', function(){
		$('#'+selector).highcharts({
	        chart: {
	            type: 'bar',
	            width: 325
	        },
	        title: {
	            text: ''
	        },
	        xAxis: {
	            categories: milestonesList
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: 'Deal Value ($)'
	            }
	        },
	        tooltip: {
	        	formatter: function(){
	        		return '<span style="font-size:10px">'+this.points[0].key+'</span>' + 
	        		        '<table>' + 
	        		        '<tr><td style="color:'+this.points[0].series.color+';padding:0">'+this.points[0].series.name+'s: </td>' + 
	        		        '<td style="padding:0"><b>'+milestoneNumbersList[this.points[0].point.x]+'</b></td></tr>' + 
	        		        '<tr><td style="color:'+this.points[0].series.color+';padding:0">Deal Value: </td>' + 
	        		        '<td style="padding:0"><b>'+milestoneValuesList[this.points[0].point.x]+' $</b></td></tr>' +
	        		        '</table>';
	        	},
	            shared: true,
	            useHTML: true
	        },
	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: [{
	            name: 'Milestone',
	            data: milestoneValuesList
	        }],
	        exporting: {
		        enabled: false
		    }
	    });
	});
}
function closuresPerPersonBarGraph(selector,catges,data,text,name){
	$('#'+selector).html(getRandomLoadingImg());
	head.js(LIB_PATH + 'lib/flot/highcharts-3.js', function(){
		$('#'+selector).highcharts({
	        chart: {
	            type: 'bar',
	            width: 325
	        },
	        title: {
	            text: ''
	        },
	        xAxis: {
	            categories: catges
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: text
	            }
	        },
	        tooltip: {
	        	formatter: function(){
	        		return '<span style="font-size:10px">'+this.points[0].key+'</span>' + 
        			'<table>' + 
    		        '<tr><td style="color:'+this.points[0].series.color+';padding:0">'+this.points[0].series.name+': </td>' + 
    		        '<td style="padding:0"><b>'+data[this.points[0].point.x]+'</b></td></tr>' + 
    		        '</table>';
	        	},
	            shared: true,
	            useHTML: true
	        },
	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: [{
	            name: name,
	            data: data
	        }],
	        exporting: {
		        enabled: false
		    }
	    });
	});
}
function dealsFunnelGraph(selector,funnel_data){
	$('#'+selector).html(getRandomLoadingImg());
	head.js(LIB_PATH + 'lib/flot/highcharts-3.js', LIB_PATH + 'lib/flot/funnel.js', function(){
		$('#'+selector).highcharts({
	        chart: {
	            type: 'funnel',
	            width: 325,
	            marginLeft: -90
	        },
	        title: {
	            text: ''
	        },
	        plotOptions: {
	        	series: {
	                dataLabels: {
	                    enabled: true,
	                    format: '<b>{point.name}</b> ({point.y:,.0f})',
	                    color: 'black',
	                    softConnector: true
	                },
	                neckWidth: '20%',
	                neckHeight: '20%',
	                
	                //-- Other available options
	                height: '80%',
	                width: '60%'
	            }
	        },
	        series: [{
	            name: 'Deals Won',
	            data: funnel_data
	        }],
	        exporting: {
		        enabled: false
		    }
	    });
	});
}
function emailsSentBarGraph(selector,catges,mailsCountList){
	$('#'+selector).html(getRandomLoadingImg());
	head.js(LIB_PATH + 'lib/flot/highcharts-3.js', function(){
		$('#'+selector).highcharts({
	        chart: {
	            type: 'bar',
	            width: 325
	        },
	        title: {
	            text: ''
	        },
	        xAxis: {
	            categories: catges
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: 'No. of emails sent'
	            }
	        },
	        tooltip: {
	        	formatter: function(){
	        		return '<span style="font-size:10px">'+this.points[0].key+'</span>' + 
	        		        '<table>' + 
	        		        '<tr><td style="color:'+this.points[0].series.color+';padding:0">'+this.points[0].series.name+': </td>' + 
	        		        '<td style="padding:0"><b>'+mailsCountList[this.points[0].point.x]+'</b></td></tr>' + 
	        		        '</table>';
	        	},
	            shared: true,
	            useHTML: true
	        },
	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: [{
	            name: 'Sent Emails',
	            data: mailsCountList
	        }],
	        exporting: {
		        enabled: false
		    }
	    });
	});
}
function portletGrowthGraph(selector,series,base_model){
	$('#'+selector).html(getRandomLoadingImg());
	var flag=true;
	
	/*if(base_model.get("settings").tags==""){
		$('#portletSettingsModal').modal('show');
		$('#portletSettingsModal > .modal-footer > .save-modal').attr('id',base_model.get("id")+'-save-modal');
		$("#portlet-type",$('#portletSettingsModal')).val(base_model.get('portlet_type'));
		$("#portlet-name",$('#portletSettingsModal')).val(base_model.get('name'));
		showPortletSettingsForm("portletsContactsGrowthGraphSettingsForm");
		
		$("#growth-graph-frequency", $('#portletsContactsGrowthGraphSettingsForm')).find('option[value='+ base_model.get("settings").frequency +']').attr("selected", "selected");
		var range=""+(new Date(base_model.get("settings")["start-date"]).format('mmmm d, yyyy'))+" - "+(new Date(base_model.get("settings")["end-date"]).format('mmmm d, yyyy'));
		$('#portlet-reportrange span').html(range);
		$('#start-date').val(base_model.get("settings")["start-date"]);
		$('#end-date').val(base_model.get("settings")["end-date"]);
		
		enablePortletTimeAndDates(base_model);
		$('#portletSettingsModal').removeData("modal").modal({backdrop: 'static', keyboard: false});
		$('#cancel-modal').attr('disabled',true);
		flag=false;
	}*/
	if(base_model.get("settings").tags==""){
		$('#'+selector).html("<div style='margin: 2%'>Please <a href='#' id='"+base_model.get("id")+"-settings' class='portlet-settings' dada-toggle='modal'>configure</a> the portlet and add the Tags.</div>");
		flag=false;
	}
	if(flag){
		head.js(LIB_PATH + 'lib/flot/highcharts-3.js', function(){
			$('#'+selector).highcharts({
		        chart: {
		            type: 'line',
		            width: 325
		        },
		        title: {
		            text: ''
		        },
		        xAxis: {
		        	type: 'datetime',
			        dateTimeLabelFormats: {
			            //don't display the dummy year  month: '%e.%b',
			        	day: '%e.%b'
			        },
			        minTickInterval: 24 * 3600 * 1000
		        },
		        yAxis: {
		            min: 0,
		            title: {
		                text: ''
		            }
		        },
		        ongraphtooltip: {
		        	formatter: function(){
			            return'<b>'+this.series.name+'</b><br/>'+Highcharts.dateFormat('%e.%b',
			            this.x)+': '+this.y.toFixed(2);
			        },
		            shared: true,
		            useHTML: true
		        },
		        plotOptions: {
		            column: {
		                pointPadding: 0.2,
		                borderWidth: 0
		            }
		        },
		        series: series,
		        exporting: {
			        enabled: false
			    }
		    });
		});
	}
}
function dealsAssignedBarGraph(selector,catges,dealsCountList){
	$('#'+selector).html(getRandomLoadingImg());
	head.js(LIB_PATH + 'lib/flot/highcharts-3.js', function(){
		$('#'+selector).highcharts({
	        chart: {
	            type: 'bar',
	            width: 325
	        },
	        title: {
	            text: ''
	        },
	        xAxis: {
	            categories: catges
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: 'No. of deals assigned'
	            }
	        },
	        tooltip: {
	        	formatter: function(){
	        		return '<span style="font-size:10px">'+this.points[0].key+'</span>' + 
	        		        '<table>' + 
	        		        '<tr><td style="color:'+this.points[0].series.color+';padding:0">'+this.points[0].series.name+': </td>' + 
	        		        '<td style="padding:0"><b>'+dealsCountList[this.points[0].point.x]+'</b></td></tr>' + 
	        		        '</table>';
	        	},
	            shared: true,
	            useHTML: true
	        },
	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: [{
	            name: 'Assigned Deals',
	            data: dealsCountList
	        }],
	        exporting: {
		        enabled: false
		    }
	    });
	});
}
function callsPerPersonBarGraph(selector,domainUsersList,series,text,colors){
	$('#'+selector).html(getRandomLoadingImg());
	head.js(LIB_PATH + 'lib/flot/highcharts-3.js', function(){
		$('#'+selector).highcharts({
	        chart: {
	            type: 'bar',
	            width: 325
	        },
	        title: {
	            text: ''
	        },
	        xAxis: {
	            categories: domainUsersList
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: text
	            }
	        },
	        tooltip: {
	            shared: true,
	            useHTML: true
	        },
	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: series,
	        exporting: {
		        enabled: false
		    },
		    colors: colors
	    });
	});
}
function enablePortletTimeAndDates(base_model){
	if(base_model.get('name')=="Growth Graph"){
		head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js', CSS_PATH + "css/misc/date-picker.css", function(){
			// Bootstrap date range picker.
			$('#portlet-reportrange').daterangepicker({ ranges : { 'Today' : [
					'today', 'today'
			], 'Yesterday' : [
					'yesterday', 'yesterday'
			], 'Last 7 Days' : [
					Date.today().add({ days : -6 }), 'today'
			], 'Last 30 Days' : [
					Date.today().add({ days : -29 }), 'today'
			], 'This Month' : [
					Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()
			], 'Last Month' : [
					Date.today().moveToFirstDayOfMonth().add({ months : -1 }), Date.today().moveToFirstDayOfMonth().add({ days : -1 })
			] } }, function(start, end){
				$('#portlet-reportrange span').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));
				$('#start-date').val(start.getTime());
				$('#end-date').val(end.getTime());
			});
		});
	}
}