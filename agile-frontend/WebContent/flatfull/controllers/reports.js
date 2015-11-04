/**
 * Creates a backbone router to create, read and update reports
 * 
 * @module Reports
 */
var ReportsRouter = Backbone.Router
		.extend({

			routes : {

			/* Reports */
			"reports" : "reports", "email-reports" : "emailReportTypes", "activity-reports" : "activityReports", "activity-report-add" : "activityReportAdd",
				"activity-report-edit/:id" : "activityReportEdit", "acivity-report-results/:id" : "activityReportInstantResults",
				"contact-reports" : "emailReports", "report-add" : "reportAdd", "report-edit/:id" : "reportEdit",
				"report-results/:id" : "reportInstantResults", "report-charts/:type" : "reportCharts", "report-funnel/:tags" : "showFunnelReport",
				"report-growth/:tags" : "showGrowthReport", "report-cohorts/:tag1/:tag2" : "showCohortsReport", "report-ratio/:tag1/:tag2" : "showRatioReport","report-sales":"showrevenuegraph","report-deals":"showIncomingDeals","report-calls/:type" : "showCallsReport","user-reports": "showUserReports",
				"report-lossReason":"showDealsLossReason","reports-wonDeals":"showDealsWonChart","rep-reports":"showRepPerformance"},
			/**
			 * Shows reports categories
			 */
			reports : function()
			{
				if (!tight_acl.checkPermission('REPORT'))
					return;

				$("#content").html("<div id='reports-listerners-container'></div>");
				getTemplate('report-categories', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#reports-listerners-container').html($(template_ui));

					initializeReportsListeners();
					hideTransitionBar();
					$(".active").removeClass("active");
					$("#reportsmenu").addClass("active");

					$('[data-toggle="tooltip"]').tooltip();	

				}, "#reports-listerners-container");
				
			},

	/**
	 * Shows email-reports categories
	 */
	emailReportTypes : function()
	{
		getTemplate('email-report-categories', {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#content').html($(template_ui));	

			$(".active").removeClass("active");
			$("#reportsmenu").addClass("active");

		}, "#content");

		
	},
	
	activityReports : function()
	{
		$("#content").html("<div id='reports-listerners-container'></div>");
		$("#reports-listerners-container").html(getRandomLoadingImg());
		this.activityReports = new Base_Collection_View({ url : '/core/api/activity-reports', restKey : "activityReports", templateKey : "activity-report", individual_tag_name : 'tr', 
			postRenderCallback: function(){
				initializeActivityReportsListeners();
			} });
		this.activityReports.collection.fetch();
		$("#reports-listerners-container").html(this.activityReports.render().el);

		$(".active").removeClass("active");
		$("#reportsmenu").addClass("active");
	},
	
	activityReportAdd : function(){
		
		if(!tight_acl.checkPermission('REPORT'))
			return;
		
		if(!tight_acl.checkPermission('ACTIVITY'))
			return;

		$("#content").html("<div id='reports-listerners-container'></div>");
		$("#reports-listerners-container").html(getRandomLoadingImg());
		
		var count = 0;
		var activity_report_add = new Base_Model_View({ url : 'core/api/activity-reports', template : "activity-reports-add", window : "activity-reports", isNew : true,
			postRenderCallback : function(el)
			{

				initializeActivityReportsListeners();
				initializeReportsListeners();
				if (count != 0)
					return;
								
				// Fills owner select element
				fillSelect("users-list", '/core/api/users', 'domainUser', function()
				{
					head.js(LIB_PATH + 'lib/jquery.multi-select.js',CSS_PATH + 'css/businesshours/jquerytimepicker.css', LIB_PATH + 'lib/businesshours/jquerytimepicker.js', function()
					{
						$('#activity-type-list, #users-list',el).multiSelect();
						$('#ms-activity-type-list .ms-selection', el).children('ul').addClass('multiSelect').attr("name", "activity").attr("id", "activity_type");
						$('#ms-users-list .ms-selection', el).children('ul').addClass('multiSelect').attr("name", "user_ids").attr("id", "user_ids");
						++count;
						if (count > 0)
							$("#reports-listerners-container").html(el);
							
							$('.activity_time_timepicker', el).timepicker({ 'timeFormat': 'H:i ' ,'step': 30});
							$(".activity_time_timepicker", el).val("09:00");
							$("#report_timezone", el).val(ACCOUNT_PREFS.timezone);
					});
				}, '<option value="{{id}}">{{name}}</option>', true, el);
				
				} });

		$("#reports-listerners-container").html(getRandomLoadingImg());
		activity_report_add.render();

	},
	
	/**
	 * Edits a report by de-serializing the existing report into its saving
	 * form, from there it can be edited and saved. Populates users and loads
	 * agile.jquery.chained.min.js to match the conditions with the values of
	 * input fields.
	 */
	activityReportEdit : function(id)
	{

		if(!tight_acl.checkPermission('REPORT'))
			return;
		
		if(!tight_acl.checkPermission('ACTIVITY'))
			return;
		$("#content").html("<div id='reports-listerners-container'></div>");
		$("#reports-listerners-container").html(getRandomLoadingImg());
		// Counter to set when script is loaded. Used to avoid flash in page
		var count = 0;

		// If reports view is not defined, navigates to reports
		if (!this.activityReports || !this.activityReports.collection || this.activityReports.collection.length == 0 || this.activityReports.collection.get(id) == null)
		{
			this.navigate("activity-reports", { trigger : true });
			return;
		}

		// Gets a report to edit, from reports collection, based on id
		var activityReport = this.activityReports.collection.get(id);
		var report_model = new Base_Model_View({ url : 'core/api/activity-reports', change : false, model : activityReport, template : "activity-reports-add", window : "activity-reports",
		postRenderCallback : function(el)
			{
				initializeActivityReportsListeners();
				initializeReportsListeners();
				if (count != 0)
					return;
				fillSelect("users-list", '/core/api/users', 'domainUser', function()
						{
							var json = activityReport.toJSON();
							var time=json.activity_start_time;
							
							var frequency=json.frequency;
							
							deserializeForm(json,$('#activityReportsForm',el));
							
							
							head.js(LIB_PATH + 'lib/jquery.multi-select.js',CSS_PATH + 'css/businesshours/jquerytimepicker.css', LIB_PATH + 'lib/businesshours/jquerytimepicker.js', function()
							{

								$('#activity-type-list, #users-list',el).multiSelect();
								$('#ms-activity-type-list .ms-selection', el).children('ul').addClass('multiSelect').attr("name", "activity").attr("id", "activity_type");
								$('#ms-users-list .ms-selection', el).children('ul').addClass('multiSelect').attr("name", "user_ids").attr("id", "user_ids");
								
								$("#reports-listerners-container").html(el)
								$.each(json.user_ids,function(i,user_id){
									$('#users-list').multiSelect('select',user_id);
									console.log('select user---',user_id);
								});
								$.each(json.activity,function(i,activity){
									$('#activity-type-list').multiSelect('select',activity);
									console.log('select activity-------',activity);
								});
								$('#ms-activity-type-list .ms-selection').children('ul').addClass('multiSelect').attr("name", "activity").attr("id", "activity_type");
								$('#ms-users-list .ms-selection').children('ul').addClass('multiSelect').attr("name", "user_ids").attr("id", "user_ids");
								
								if(json.report_timezone==null){
									$("#report_timezone").val(ACCOUNT_PREFS.timezone);
								}
								// based on frequency we are showing and hideing the time and date and month fields
								if (frequency == "DAILY")
								{
									$("#activity_report_weekday").css("display", "none");
									$("#activity_report_day").css("display", "none");
									$("#activity_report_time").css("display", "block");

								}
								else if (frequency == "WEEKLY")
								{
									$("#activity_report_day").css("display", "none");
									$("#activity_report_time").css("display", "block");
									$("#activity_report_weekday").css("display", "block");

								}
								else if (frequency == "MONTHLY")
								{
									$("#activity_report_weekday").css("display", "none");
									$("#activity_report_time").css("display", "block");
									$("#activity_report_day").css("display", "block");

								}
								$('.activity_time_timepicker').timepicker({ 'timeFormat': 'H:i ' ,'step': 30});
								
							});
						}, '<option value="{{id}}">{{name}}</option>', true, el);
				
			} });

		$("#reports-listerners-container").html(getRandomLoadingImg());
		report_model.render();


	},
	
	/**
	 * Shows list of reports, with an option to add new report
	 */
	emailReports : function()
	{
			$("#content").html("<div id='reports-listerners-container'></div>");
			this.reports = new Base_Collection_View({ url : '/core/api/reports', restKey : "reports", templateKey : "report", individual_tag_name : 'tr', 
				postRenderCallback: function(){
					initializeReportsListeners();
				}});

			this.reports.collection.fetch();
			$("#reports-listerners-container").html(this.reports.render().el);

	},

	/**
	 * Loads a template to add new report. Populates users drop down list and
	 * loads agile.jquery.chained.min.js to chain conditions and values of input
	 * fields, from postRenderCallback of its Base_Model_View.
	 */
	reportAdd : function()
	{
		var count = 0;
		$("#content").html("<div id='reports-listerners-container'></div>");
		$("#reports-listerners-container").html(getRandomLoadingImg());
		SEARCHABLE_CONTACT_CUSTOM_FIELDS = undefined;
		var report_add = new Base_Model_View({ url : 'core/api/reports', template : "reports-add", window : "contact-reports", isNew : true,
			postRenderCallback : function(el)
			{
				initializeContactFiltersListeners();
				initializeReportsListeners();
				// Counter to set when script is loaded. Used to avoid flash in
				// page
				if (count != 0)
					return;
				fillSelect("custom-fields-optgroup", "core/api/custom-fields/scope?scope=CONTACT", undefined, function()
				{

					head.js(LIB_PATH + 'lib/jquery.multi-select.js' ,CSS_PATH + 'css/businesshours/jquerytimepicker.css', LIB_PATH + 'lib/businesshours/jquerytimepicker.js', function()
					{

						$('#multipleSelect', el).multiSelect({ selectableOptgroup : true });

						$('.ms-selection', el).children('ul').addClass('multiSelect').attr("name", "fields_set").attr("id", "fields_set").sortable();

						++count;
						if (count > 1)
							$("#reports-listerners-container").html(el);

						$('.report_time_timepicker', el).timepicker({ 'timeFormat': 'H:i ' ,'step': 30});
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

			} });

		$("#reports-listerners-container").html(getRandomLoadingImg());
		report_add.render();
	},
				
	/**
	 * Edits a report by de-serializing the existing report into its saving
	 * form, from there it can be edited and saved. Populates users and loads
	 * agile.jquery.chained.min.js to match the conditions with the values of
	 * input fields.
	 */
	reportEdit : function(id)
	{
		$("#content").html("<div id='reports-listerners-container'></div>");
		$("#reports-listerners-container").html(getRandomLoadingImg());
		// Counter to set when script is loaded. Used to avoid flash in page
		var count = 0;

		// Gets a report to edit, from reports collection, based on id
		var report = this.reports.collection.get(id);
		var report_model = new Base_Model_View({ url : 'core/api/reports', change : false, model : report, template : "reports-add", window : "contact-reports", id : "reports-listerners-container",
			postRenderCallback : function(el)
			{
				initializeContactFiltersListeners();
				initializeReportsListeners();
				if (count != 0)
					return;
				
				// Gets a report to edit, from reports collection, based on id
				
					fillSelect("custom-fields-optgroup", "core/api/custom-fields/scope?scope=CONTACT", undefined, function()
						{

							head.js(LIB_PATH + 'lib/jquery.multi-select.js', CSS_PATH + 'css/businesshours/jquerytimepicker.css',
									LIB_PATH + 'lib/businesshours/jquerytimepicker.js', function()
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

											if (frequency == "DAILY")
											{
												$("#contact_report_weekday").css("display", "none");
												$("#contact_report_day").css("display", "none");
												$("#contact_report_time").css("display", "block");

											}
											else if (frequency == "WEEKLY")
											{
												$("#contact_report_day").css("display", "none");
												$("#contact_report_time").css("display", "block");
												$("#contact_report_weekday").css("display", "block");

											}
											else if (frequency == "MONTHLY")
											{
												$("#contact_report_weekday").css("display", "none");
												$("#contact_report_time").css("display", "block");
												$("#contact_report_day").css("display", "block");

											}

											if (report.toJSON().report_timezone == null)
											{
												$("#report_timezone").val(ACCOUNT_PREFS.timezone);
											}
										}, 1000);
									});

						}, '<option value="custom_{{field_label}}">{{field_label}}</option>', true, el);

						head.js(LIB_PATH + 'lib/jquery-ui.min.js', LIB_PATH + 'lib/agile.jquery.chained.min.js', LIB_PATH + 'lib/jquery.multi-select.js',
								function()
								{

									chainFiltersForContact(el, report.toJSON(), function()
									{
										++count
										if (count > 1)
											deserialize_multiselect(report.toJSON(), el);
									});
									scramble_input_names($(el).find('div#report-settings'));
								});

					} });

				$("#reports-listerners-container").html(getRandomLoadingImg());
				report_model.render();

			},

			/**
			 * Shows report results. It gets report object from reports list, if
			 * it is list is not available then it fetches report based on
			 * report id, send request to process results, and shows them
			 */
			reportInstantResults : function(id, report)
			{

				if (!report)
					// If reports view is not defined, navigates to reports
					if (!this.reports || !this.reports.collection || this.reports.collection.length == 0 || this.reports.collection.get(id) == null)
					{

						// Shows loading while report is being fetched
						$("#content").html(getRandomLoadingImg());
						var reportModel = new Backbone.Model();
						reportModel.url = "core/api/reports/" + id;
						reportModel.fetch({ success : function(data)
						{
							// Fetches reports and call to show instant results
							App_Reports.reportInstantResults(id, data.toJSON());
						} });
						return;

					}
					else
					{
						report = this.reports.collection.get(id).toJSON();
					}

				// Stores in global variable, as it is required to build custom
				// table
				// headings
				REPORT = report;

				var report_results_view = new Base_Collection_View({ url : "core/api/reports/show-results/" + id, modelData : report,
					templateKey : "report-search", individual_tag_name : 'tr', cursor : true, sort_collection : false, page_size : 15, });// Collection
				var _that = this;
				$.getJSON("core/api/custom-fields/type/scope?type=DATE&scope=CONTACT", function(customDatefields)
				{
					// Report built with custom table, as reports should be
					// shown with
					// custom order selected by user
					report_results_view.appendItem = function(base_model)
					{
						reportsContactTableView(base_model, customDatefields, this);
					};

					report_results_view.collection.fetch();
				});
				$("#content").html(report_results_view.render().el);
			},

			/**
			 * Returns Funnel reports based on tags
			 * 
			 * @param tags -
			 *            workflow id
			 */
			showFunnelReport : function(tags)
			{

				head.load(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js' + '?_=' + _AGILE_VERSION, CSS_PATH + "css/misc/date-picker.css", function()
				{
					getTemplate("report-funnel", {}, undefined, function(template_ui){
						if(!template_ui)
							  return;

						// Load Reports Template
						$('#content').html($(template_ui));
						// Set the name
						$('#reports-funnel-tags').text(tags);

						initFunnelCharts(function()
						{
							showFunnelGraphs(tags);
						});

						$(".active").removeClass("active");
						$("#reportsmenu").addClass("active");
						
						highlightDatepickerOption();

					}, "#content");

				});
			},

			/**
			 * Returns growth report based on the tags
			 * 
			 * @param tags -
			 *            comma separated tags
			 */
			showGrowthReport : function(tags)
			{

				head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js' + '?_=' + _AGILE_VERSION, CSS_PATH + "css/misc/date-picker.css", function()
				{

					// Load Reports Template
					getTemplate("report-growth", {}, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$('#content').html($(template_ui));	

						// Set the name
						$('#reports-growth-tags').text(tags);

						initFunnelCharts(function()
						{
							showGrowthGraphs(tags);
						});

					}, "#content");
					
				});

				$(".active").removeClass("active");
				$("#reportsmenu").addClass("active");
				highlightDatepickerOption();
			},
			
			
				
		/**
			 * Returns calls report
			 * 
			 * @param tags -
			 *            comma separated tags
			 */
			showCallsReport : function(reportType)
			{

				head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js', CSS_PATH + "css/misc/date-picker.css", function()
				{
					
					/** Default dropdown value to be considered*/ 
					var graphOn='number-of-calls';
					
					/**Default template id to be loaded*/
					var templateId="report-calls";
					
					/**when it is a call outcome selection*/
					if(reportType == 'pie-graph'){
						//templateId="report-calls-piechart";
						templateId=templateId+"-piechart";
						
					}
					
					getTemplate(templateId, {}, undefined, function(template_ui){
						if(!template_ui)
							  return;

						// Load Reports Template
						$('#content').html($(template_ui));
					
					/**Reinitialize the variable which holds the user preference abt report type*/
	               if(reportType == 'average-calls'){
						graphOn='average-calls';
						$('select[id="typeCall"]').find('option[value="average-calls"]').attr("selected",true);
						
					}else{
						$('select[id="typeCall"]').find('option[value="number-of-calls"]').attr("selected",true);
					}
	               
	               initReportsForCalls(function()
							{
	            	   
	            	   /** Get date range selected for every call back call */
	            	   
	            		var options = "?";

						var range = $('#range').html().split("-");
						var start_time=new Date(range[0]).getTime() / 1000;

						var end_value = $.trim(range[1]);

						
						if (end_value)
							end_value = end_value + " 23:59:59";

						var end_time=new Date(end_value).getTime() / 1000;
						options += ("start-date=" + start_time + "&end-date=" + end_time);
						
						var url='core/api/portlets/calls-per-person/' + options;
						
						graphOn=$("#typeCall option:selected").val();
					    
					    var userDropDown=$('#users option:selected').val();
					    
					    if(userDropDown != undefined){
					    	if(userDropDown != 'All' && userDropDown != ""){
								var usersUrl=url;
								url=url+'&user=["'+userDropDown+'"]';
							}
					    	
					    }
					    prepareNewReport(url);
					    
					    /**Function block to be executed for every call back*/
							
							function prepareNewReport(url){
							
								 
			                        var selector="email-reports";
									
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
										}else if(graphOn == "average-calls"){
											
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
										else{
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
						}
							
							});

					}, "#content");
				});
				
			},
			
			/**
			 * Shows User Reports
			 */
			showUserReports : function()

			{
				hideTransitionBar();
				initReportLibs(function()
						{
					getTemplate("report-revenue-user", {}, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$('#content').html($(template_ui));	

						initUserReports(function()
								{
							salesReportGraphForUserReports();
							showLossReasonGraphForUserReports();
								
							var callReportUrl='core/api/portlets/calls-per-person/' + getSelectedDates();
							
							if ($('#owner').length > 0)
							{
								if ($("#owner").val() != "" && $("#owner").val() != "All Owners"){
								var user=$("#owner").val();
								callReportUrl=callReportUrl+'&user=["'+user+'"]';
							}
							}
							
							report_utility.user_reports(callReportUrl);
							
								});
						
						
				}, "#content");

						});
			},


			/**
			 * Returns Cohorts Graphs with two tag1
			 * 
			 * @param id -
			 *            workflow id
			 */
			showCohortsReport : function(tag1, tag2)
			{

				head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js' + '?_=' + _AGILE_VERSION, CSS_PATH + "css/misc/date-picker.css", function()
				{

					// Load Reports Template
					getTemplate("report-cohorts", {}, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$('#content').html($(template_ui));	

						// Set the name
						$('#reports-cohorts-tags').text(tag1 + " versus " + tag2);

						initFunnelCharts(function()
						{
							showCohortsGraphs(tag1, tag2);
						});

					}, "#content");
					
					
				});

				$(".active").removeClass("active");
				$("#reportsmenu").addClass("active");
				highlightDatepickerOption();
			},
			/**
			 * Returns Cohorts Graphs with two tag1
			 * 
			 * @param id -
			 *            workflow id
			 */
			showRatioReport : function(tag1, tag2)
			{

				head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js' + '?_=' + _AGILE_VERSION, CSS_PATH + "css/misc/date-picker.css", function()
				{

					// Load Reports Template
					getTemplate("report-ratio", {}, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$('#content').html($(template_ui));	

						// Set the name
						$('#reports-ratio-tags').text(tag1 + " versus " + tag2);

						initFunnelCharts(function()
						{
							showRatioGraphs(tag1, tag2);
						});

						$(".active").removeClass("active");
						$("#reportsmenu").addClass("active");

						highlightDatepickerOption();

					}, "#content");
					
				});


			},

			/**
			 * Shows reports charts of growth or funnel
			 */
			reportCharts : function(type)
			{
				var template_name = "report-growth";

				if (type)
					template_name = "report-" + type + "-form";

				$("#content").html("<div id='reports-listerners-container'></div>");
				getTemplate(template_name, {}, undefined, function(template_ui){
					if(!template_ui)
						  return;

							var el = $(template_ui);
				$("#reports-listerners-container").html(el);
				initializeChartReportsListeners();

				if (type && (type == 'growth' || type == 'funnel'))
				{
					setup_tags_typeahead();
					return;
				}
				$.each($("[id=tags-reports]", el), function(i, element)
				{
					console.log(element);
					addTagsDefaultTypeahead(element);
				});


				}, "#reports-listerners-container");
			},

			showIncomingDeals : function(){
				hideTransitionBar();
				initReportLibs(function()
						{

							// Load Reports Template
						getTemplate("report-deals", {}, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$('#content').html($(template_ui));	


							initFunnelCharts(function()
							{
								showDealsGrowthReport();
							});
						}, "#content");
					});
			},

			showDealsLossReason : function()
			{
				headideTransitionBar();
				initReportLibs(function()
				{

					// Load Reports Template
				getTemplate("report-DealsLoss", {}, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$('#content').html($(template_ui));	

					initSalesCharts(function()
							{
						showLossReasonGraphs();
							});

					$(".active").removeClass("active");
					$("#reportsmenu").addClass("active");
				}, "#content");
			});
			},

			showDealsWonChart : function()
			{
				hideTransitionBar();
			initReportLibs(function()
				{

					// Load Reports Template
				getTemplate("report-DealsWon", {}, undefined, function(template_ui){

					if(!template_ui)
							  return;
						$('#content').html($(template_ui));	

					initSalesCharts(function()
							{
						showWonPieChart();
							});

				$(".active").removeClass("active");
				$("#reportsmenu").addClass("active");
				}, "#content");
			  });	
			},

			showrevenuegraph : function()
			{
						hideTransitionBar();
				initReportLibs(function()
				{
							// Load Reports Template
						getTemplate("report-sales", {}, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$('#content').html($(template_ui));	
							// Set the name

							initSalesCharts(function()
							{
								showsalesReportGraphs();
					});
						}, "#content");
					});
			},
			
			showRepPerformance : function()
			{
				hideTransitionBar();
				initReportLibs(function()
				{
							// Load Reports Template
						getTemplate("report-user-performance", {}, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$('#content').html($(template_ui));	
							// Set the name

						initUserReports(function()
							{
								showRepPerformanceReport();
								showLossReasonGraphForUserReports();

								var callReportUrl='core/api/portlets/calls-per-person/' + getSelectedDates();
							
							if ($('#owner').length > 0)
							{
								if ($("#owner").val() != "" && $("#owner").val() != "All Owners"){
								var user=$("#owner").val();
								callReportUrl=callReportUrl+'&user=["'+user+'"]';
							}
							}
							
							report_utility.user_reports(callReportUrl);
					});
						}, "#content");
					});
			},
			
	});
