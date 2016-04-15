var portlet_graph_data_utility = {

	/**
	 * Generic function to fetch data for graphs and act accordingly on plan
	 * limit error
	 * 
	 * @param url
	 * @param successCallback
	 */
	fetchPortletsGraphData : function(url, successCallback) {
		// Hides error message
		$("#plan-limit-error").hide();

		// Fetches data
		$.getJSON(url, function(data) {
			// Sends data to callback
			if (successCallback && typeof (successCallback) === "function")
				successCallback(data);
		}).error(function(response) {
			// If error is not billing exception and forbidden exception then it
			// is returned
			if (response.status != 406 && response.status != 403)
				return;

			// If it is billing exception or forbidden exception, then empty set
			// is sent so page will not be showing loading on error message
			if (successCallback && typeof (successCallback) === "function")
				successCallback(response);
		});
	},

	/**
	 * To fetch deals by milestone portlet data to render as pie graph
	 */
	dealsByMilestoneGraphData : function(base_model, selector, url) {
		var milestonesList = [];
		var milestoneValuesList = [];
		var milestoneNumbersList = [];

		var milestoneMap = [];
		var sizey = parseInt($('#' + selector).parent().attr("data-sizey"));
		var topPos = 50 * sizey;
		if (sizey == 2 || sizey == 3)
			topPos += 50;
		$('#' + selector)
				.html(
						"<div class='text-center v-middle opa-half' style='margin-top:"
								+ topPos
								+ "px'><img src='"+updateImageS3Path("../flatfull/img/ajax-loader-cursor.gif")+"' style='width:12px;height:10px;opacity:0.5;' /></div>");
		this
				.fetchPortletsGraphData(
						url,
						function(data) {
							if (data.status == 403) {
								$('#' + selector)
										.html(
												"<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
								return;
							}
							milestonesList = data["milestonesList"];
							milestoneValuesList = data["milestoneValuesList"];
							milestoneNumbersList = data["milestoneNumbersList"];
							milestoneMap = data["milestoneMap"];
							portlet_graph_utility.dealsByMilestonePieGraph(
									selector, milestonesList,
									milestoneValuesList, milestoneNumbersList);

							portlet_utility.addWidgetToGridster(base_model);
						});
	},
/**
	 * To fetch Cmpaign contacts stats portlet data to render as pie graph
	 */
	campaignStatsGraphData : function(base_model, selector, url) {
		var campaignStatusList = [];
		var campaignValuesList = [];

		var sizey = parseInt($('#' + selector).parent().attr("data-sizey"));
		var topPos = 50 * sizey;
		if (sizey == 2 || sizey == 3)
			topPos += 50;
		$('#' + selector)
				.html(
						"<div class='text-center v-middle opa-half' style='margin-top:"
								+ topPos
								+ "px'><img src='"+updateImageS3Path("../flatfull/img/ajax-loader-cursor.gif")+"' style='width:12px;height:10px;opacity:0.5;' /></div>");
		this
				.fetchPortletsGraphData(
						url,
						function(data) {
							if (data.status == 403) {
								$('#' + selector)
										.html(
												"<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
								return;
							}
							campaignStatusList = data["campaignStatusList"];
							campaignValuesList = data["campaignValuesList"];

							portlet_graph_utility.campaignStatsPieGraph(
									selector, campaignStatusList,
									campaignValuesList);

							portlet_utility.addWidgetToGridster(base_model);
						});
	},
	/**
	 * To fetch closers per person portlet data to render as bar graph
	 */
	closuresPerPersonGraphData : function(base_model, selector, url) {
		var milestoneNumbersList = [];
		var milestoneValuesList = [];
		var domainUsersList = [];
		$('#' + selector).html(getRandomLoadingImg());
		this
				.fetchPortletsGraphData(
						url,
						function(data) {
							if (data.status == 403) {
								$('#' + selector)
										.html(
												"<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
								return;
							}
							milestoneNumbersList = data["milestoneNumbersList"];
							milestoneValuesList = data["milestoneValuesList"];
							domainUsersList = data["domainUsersList"];

							var catges = [];

							$.each(domainUsersList,
									function(index, domainUser) {
										catges.push(domainUser);
									});

							var data2 = [];
							var text = '';
							var name = '';

							if (base_model.get('settings')["group-by"] == "number-of-deals") {
								$.each(milestoneNumbersList, function(index,
										mNumber) {
									data2.push(mNumber);
								});
								text = "No. of Deals Won";
								name = "Deals Won";
							} else {
								$.each(milestoneValuesList, function(index,
										mValue) {
									data2.push(mValue);
								});
								text = "Deals Won Value";
								name = "Won Deal Value";
							}

							portlet_graph_utility.closuresPerPersonBarGraph(
									selector, catges, data2, text, name);

							portlet_utility.addWidgetToGridster(base_model);
						});
	},

	/**
	 * To fetch deals funnel portlet data to render as funnel graph
	 */
	dealsFunnelGraphData : function(base_model, selector, url) {
		var milestonesList = [];
		var milestoneValuesList = [];
		var milestoneMap = [];
		var sizey = parseInt($('#' + selector).parent().attr("data-sizey"));
		var topPos = 50 * sizey;
		if (sizey == 2 || sizey == 3)
			topPos += 50;
		$('#' + selector)
				.html(
						"<div class='text-center v-middle opa-half' style='margin-top:"
								+ topPos
								+ "px'><img src='"+updateImageS3Path('../flatfull/img/ajax-loader-cursor.gif')+"' style='width:12px;height:10px;opacity:0.5;' /></div>");
		this
				.fetchPortletsGraphData(
						url,
						function(data) {
							if (data.status == 403) {
								$('#' + selector)
										.html(
												"<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
								return;
							}
							milestonesList = data["milestonesList"];
							milestoneValuesList = data["milestoneValuesList"];
							milestoneMap = data["milestoneMap"];
							wonMilestone = data["wonMilestone"];
							lostMilestone = data["lostMilestone"];
							milestoneNumbersList = data["milestoneNumbersList"];

							var funnel_data = [];
							var temp;

							$.each(milestonesList, function(index, milestone) {
								var each_data = [];
								if (milestone != lostMilestone) {
									if (milestone != wonMilestone) {
										if (base_model.get("settings")["split-by"] && base_model.get("settings")["split-by"] == "count") {
											each_data.push(milestone,
												milestoneNumbersList[index]);
										}
										else {
											each_data.push(milestone,
												milestoneValuesList[index]);
										}
										
									}	
									else
										temp = index;
									if (each_data != "")
										funnel_data.push(each_data);
								}
							});

							var temp_data = [];
							if (temp != undefined) {
								if (base_model.get("settings")["split-by"] && base_model.get("settings")["split-by"] == "count") {
									temp_data.push(milestonesList[temp],
										milestoneNumbersList[temp]);
								}
								else {
									temp_data.push(milestonesList[temp],
										milestoneValuesList[temp]);
								}
								
								funnel_data.push(temp_data);
							}
							var falg = false;
							$.each(funnel_data, function(index, json1) {
								if (json1[1] > 0)
									falg = true;
							});
							if (falg)
								funnel_data = funnel_data;
							else
								funnel_data = [];
							portlet_graph_utility.dealsFunnelGraph(selector,
									funnel_data, base_model);

							portlet_utility.addWidgetToGridster(base_model);
						});
	},

	/**
	 * To fetch emails sent portlet data to render as bar graph
	 */
	emailsSentGrapgData : function(base_model, selector, url) {
		var domainUsersList = [];
		var mailsCountList = [];
		var mailsOpenedCountList = [];
		$('#' + selector).html(getRandomLoadingImg());
		this
				.fetchPortletsGraphData(
						url,
						function(data) {
							if (data.status == 403) {
								$('#' + selector)
										.html(
												"<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
								return;
							}
							domainUsersList = data["domainUsersList"];
							mailsCountList = data["mailsCountList"];
							mailsOpenedCountList = data["mailsOpenedCountList"];

							var series = [];
							var text = '';
							var colors;

							var tempData = {};
							tempData.name = "Emails Not Opened";
							tempData.data = mailsCountList;
							series[0] = tempData;
							tempData = {};
							tempData.name = "Emails Opened";
							tempData.data = mailsOpenedCountList;
							series[1] = tempData;
							text = "No. of Emails";
							colors = [ 'gray', 'green' ];

							portlet_graph_utility.emailsSentBarGraph(selector,
									domainUsersList, series, mailsCountList,
									mailsOpenedCountList, text, colors);

							portlet_utility.addWidgetToGridster(base_model);
						});
	},

	/**
	 * To fetch growth graph portlet data to render as area spline graph
	 */
	growthGraphData : function(base_model, selector, url) {

		var sizey = parseInt($('#' + selector).parent().attr("data-sizey"));
		var topPos = 50 * sizey;
		if (sizey == 2 || sizey == 3)
			topPos += 50;
		$('#' + selector)
				.html(
						"<div class='text-center v-middle opa-half' style='margin-top:"
								+ topPos
								+ "px'><img src='"+updateImageS3Path('../flatfull/img/ajax-loader-cursor.gif')+"' style='width:12px;height:10px;opacity:0.5;' /></div>");
		this
				.fetchPortletsGraphData(
						url,
						function(data) {
							if (data.status == 406) {
								// Show cause of error in saving
								$save_info = $('<div class="portlet-error-message inline-block"><small><p class="text-base" style="color:#B94A48;"><i>'
										+ data.responseText
										+ '</i></p></small></div>');

								$('#' + selector).html($save_info).show();

								return;
							}

							var categories = [];
							var tempcategories = [];
							var dataLength = 0;
							var min_tick_interval = 1;
							var frequency = base_model.get('settings').frequency;

							var sortedKeys = [];
							$.each(data, function(k, v) {
								sortedKeys.push(k);
							});
							sortedKeys.sort();
							var sortedData = {};
							$.each(sortedKeys, function(index, value) {
								sortedData['' + value] = data['' + value];
							});
							var series;
							// Iterates through data and adds keys into
							// categories
							$.each(sortedData, function(k, v) {
								// Initializes series with names with the first
								// data point
								if (series == undefined) {
									var index = 0;
									series = [];
									$.each(v, function(k1, v1) {
										var series_data = {};
										series_data.name = k1;
										series_data.data = [];
										series[index++] = series_data;
									});
								}
								// Fill Data Values with series data
								$.each(v, function(k1, v1) {
									// Find series with the name k1 and to that,
									// push v1
									var series_data = find_series_with_name(
											series, k1);
									var dt = new Date(k * 1000);
									series_data.data.push(v1);
								});
								tempcategories.push(k * 1000);
								dataLength++;

							});

							var cnt = 0;
							if (Math.ceil(dataLength / 10) > 0) {
								min_tick_interval = Math.ceil(dataLength / 10);
								if (min_tick_interval == 3) {
									min_tick_interval = 4;
								}
							}
							head
									.js(
											LIB_PATH
													+ 'lib/flot/highcharts-3.js',
											function() {
												$
														.each(
																sortedData,
																function(k, v) {
																	var dte = new Date(
																			tempcategories[cnt]);
																	if (frequency != undefined) {
																		if (frequency == "daily") {
																			categories
																					.push(Highcharts
																							.dateFormat(
																									'%e.%b',
																									Date
																											.UTC(
																													dte
																															.getUTCFullYear(),
																													dte
																															.getUTCMonth(),
																													dte
																															.getUTCDate()))
																							+ '');
																		} else if (frequency == "weekly") {
																			if (cnt != dataLength - 1) {
																				var next_dte = new Date(
																						tempcategories[cnt + 1]);
																				categories
																						.push(Highcharts
																								.dateFormat(
																										'%e.%b',
																										Date
																												.UTC(
																														dte
																																.getUTCFullYear(),
																														dte
																																.getUTCMonth(),
																														dte
																																.getUTCDate()))
																								+ ' - '
																								+ Highcharts
																										.dateFormat(
																												'%e.%b',
																												Date
																														.UTC(
																																next_dte
																																		.getUTCFullYear(),
																																next_dte
																																		.getUTCMonth(),
																																next_dte
																																		.getUTCDate() - 1)));
																			} else {
																				var end_date = new Date();
																				categories
																						.push(Highcharts
																								.dateFormat(
																										'%e.%b',
																										Date
																												.UTC(
																														dte
																																.getUTCFullYear(),
																														dte
																																.getUTCMonth(),
																														dte
																																.getUTCDate()))
																								+ ' - '
																								+ Highcharts
																										.dateFormat(
																												'%e.%b',
																												Date
																														.UTC(
																																end_date
																																		.getFullYear(),
																																end_date
																																		.getMonth(),
																																end_date
																																		.getDate())));
																			}
																		} else if (frequency == "monthly") {
																			if (cnt != dataLength - 1) {
																				var next_dte = new Date(
																						tempcategories[cnt + 1]);
																				var current_date = new Date();
																				var from_date = '';
																				var to_date = '';
																				if (cnt != 0) {
																					if (current_date
																							.getUTCFullYear() != dte
																							.getUTCFullYear()) {
																						from_date = Highcharts
																								.dateFormat(
																										'%b.%Y',
																										Date
																												.UTC(
																														dte
																																.getUTCFullYear(),
																														dte
																																.getUTCMonth(),
																														dte
																																.getUTCDate()));
																					} else {
																						from_date = Highcharts
																								.dateFormat(
																										'%b',
																										Date
																												.UTC(
																														dte
																																.getUTCFullYear(),
																														dte
																																.getUTCMonth(),
																														dte
																																.getUTCDate()));
																					}
																					categories
																							.push(from_date);
																				} else {
																					if (current_date
																							.getUTCFullYear() != dte
																							.getUTCFullYear()) {
																						from_date = Highcharts
																								.dateFormat(
																										'%e.%b.%Y',
																										Date
																												.UTC(
																														dte
																																.getUTCFullYear(),
																														dte
																																.getUTCMonth(),
																														dte
																																.getUTCDate()));
																					} else {
																						from_date = Highcharts
																								.dateFormat(
																										'%e.%b',
																										Date
																												.UTC(
																														dte
																																.getUTCFullYear(),
																														dte
																																.getUTCMonth(),
																														dte
																																.getUTCDate()));
																					}
																					if (current_date
																							.getUTCFullYear() != next_dte
																							.getUTCFullYear()) {
																						to_date = Highcharts
																								.dateFormat(
																										'%e.%b.%Y',
																										Date
																												.UTC(
																														next_dte
																																.getUTCFullYear(),
																														next_dte
																																.getUTCMonth(),
																														next_dte
																																.getUTCDate() - 1));
																					} else {
																						to_date = Highcharts
																								.dateFormat(
																										'%e.%b',
																										Date
																												.UTC(
																														next_dte
																																.getUTCFullYear(),
																														next_dte
																																.getUTCMonth(),
																														next_dte
																																.getUTCDate() - 1));
																					}
																					categories
																							.push(from_date
																									+ ' - '
																									+ to_date);
																				}
																			} else {
																				var current_date = new Date();
																				var from_date = '';
																				var to_date = '';
																				var end_date = new Date();
																				if (current_date
																						.getUTCFullYear() != dte
																						.getUTCFullYear()) {
																					from_date = Highcharts
																							.dateFormat(
																									'%e.%b.%Y',
																									Date
																											.UTC(
																													dte
																															.getUTCFullYear(),
																													dte
																															.getUTCMonth(),
																													dte
																															.getUTCDate()));
																					to_date = Highcharts
																							.dateFormat(
																									'%e.%b.%Y',
																									Date
																											.UTC(
																													end_date
																															.getFullYear(),
																													end_date
																															.getMonth(),
																													end_date
																															.getDate()));
																				} else {
																					from_date = Highcharts
																							.dateFormat(
																									'%e.%b',
																									Date
																											.UTC(
																													dte
																															.getUTCFullYear(),
																													dte
																															.getUTCMonth(),
																													dte
																															.getUTCDate()));
																					to_date = Highcharts
																							.dateFormat(
																									'%e.%b',
																									Date
																											.UTC(
																													end_date
																															.getFullYear(),
																													end_date
																															.getMonth(),
																													end_date
																															.getDate()));
																				}
																				categories
																						.push(from_date
																								+ ' - '
																								+ to_date);
																			}
																		}
																		cnt++;
																	}
																});
											});

							portlet_graph_utility.portletGrowthGraph(selector,
									series, base_model, categories,
									min_tick_interval);

							portlet_utility.addWidgetToGridster(base_model);
						});
	},

	/**
	 * To fetch deals assigned portlet data to render as bar graph
	 */
	dealsAssignedGraphData : function(base_model, selector, url) {
		var domainUsersList = [];
		var dealsAssignedCountList = [];
		$('#' + selector).html(getRandomLoadingImg());
		this
				.fetchPortletsGraphData(
						url,
						function(data) {
							if (data.status == 403) {
								$('#' + selector)
										.html(
												"<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
								return;
							}
							domainUsersList = data["domainUsersList"];
							dealsAssignedCountList = data["assignedOpportunitiesCountList"];

							portlet_graph_utility.dealsAssignedBarGraph(
									selector, domainUsersList,
									dealsAssignedCountList, base_model);

							portlet_utility.addWidgetToGridster(base_model);
						});
	},

	/**
	 * To fetch calls per person portlet data to render as bar graph
	 */
	callsPerPersonGraphData : function(base_model, selector, url) {
		var answeredCallsCountList = [];
		var busyCallsCountList = [];
		var failedCallsCountList = [];
		var voiceMailCallsCountList = [];
		var missedCallsCountList= [];
		var inquiryCallsCountList= [];
		var interestCallsCountList= [];
		var noInterestCallsCountList= [];
		var incorrectReferralCallsCountList= [];
		var newOpportunityCallsCountList= [];
		var meetingScheduledCallsCountList = [];
		var callsDurationList = [];
		var totalCallsCountList = [];
		var domainUsersList = [];
		var domainUserImgList = [];
		var sizey = parseInt($('#' + selector).parent().attr("data-sizey"));
		var topPos = 50 * sizey;
		if (sizey == 2 || sizey == 3)
			topPos += 50;
		$('#' + selector)
				.html(
						"<div class='text-center v-middle opa-half' style='margin-top:"
								+ topPos
								+ "px'><img src='"+updateImageS3Path("../flatfull/img/ajax-loader-cursor.gif")+"' style='width:12px;height:10px;opacity:0.5;' /></div>");
		this
				.fetchPortletsGraphData(
						url,
						function(data) {
							if (data.status == 403) {
								$('#' + selector)
										.html(
												"<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
								return;
							}
							answeredCallsCountList = data["answeredCallsCountList"];
							busyCallsCountList = data["busyCallsCountList"];
							failedCallsCountList = data["failedCallsCountList"];
							voiceMailCallsCountList = data["voiceMailCallsCountList"];
							missedCallsCountList = data["missedCallsCountList"];
							inquiryCallsCountList = data["inquiryCallsCountList"];
							interestCallsCountList = data["interestCallsCountList"];
							noInterestCallsCountList = data["noInterestCallsCountList"];
							incorrectReferralCallsCountList = data["incorrectReferralCallsCountList"];
							meetingScheduledCallsCountList = data["meetingScheduledCallsCountList"];
							newOpportunityCallsCountList = data["newOpportunityCallsCountList"];
							callsDurationList = data["callsDurationList"];
							totalCallsCountList = data["totalCallsCountList"];
							domainUsersList = data["domainUsersList"];
							domainUserImgList = data["domainUserImgList"];

							var series = [];
							var text = '';
							var colors;

							if (base_model.get('settings')["group-by"] == "number-of-calls") {
								var tempData = {};
								tempData.name = "Answered";
								tempData.data = answeredCallsCountList;
								series[0] = tempData;

								tempData = {};
								tempData.name = "Busy";
								tempData.data = busyCallsCountList;
								series[1] = tempData;

								tempData = {};
								tempData.name = "Failed";
								tempData.data = failedCallsCountList;
								series[2] = tempData;

								tempData = {};
								tempData.name = "Voicemail";
								tempData.data = voiceMailCallsCountList;
								series[3] = tempData;

								tempData = {};
								tempData.name = "Missed ";
								tempData.data = missedCallsCountList;
								series[4] = tempData;

								tempData = {};
								tempData.name = "Inquiry";
								tempData.data = inquiryCallsCountList;
								series[5] = tempData;

								tempData = {};
								tempData.name = "Interest";
								tempData.data = interestCallsCountList;
								series[6] = tempData;

								tempData = {};
								tempData.name = "No Interest";
								tempData.data = noInterestCallsCountList;
								series[7] = tempData;

								tempData = {};
								tempData.name = "Incorrect Referral";
								tempData.data = incorrectReferralCallsCountList;
								series[8] = tempData;

								tempData = {};
								tempData.name = "Meeting Scheduled";
								tempData.data = meetingScheduledCallsCountList;
								series[9] = tempData;

								tempData = {};
								tempData.name = "New Opportunity";
								tempData.data = newOpportunityCallsCountList;
								series[10] = tempData;
								text = "No. of Calls";
								colors = [ 'green', 'blue', 'red', 'violet' ];
							} else {
								var tempData = {};
								tempData.name = "Total Duration";
								var callsDurationInMinsList = [];
								$
										.each(
												callsDurationList,
												function(index, duration) {
													callsDurationInMinsList[index] = duration / 60;
												});
								tempData.data = callsDurationInMinsList;
								series[0] = tempData;
								text = "Calls Duration (Mins)";
								colors = [ 'green' ];
							}

							portlet_graph_utility.callsPerPersonBarGraph(
									selector, domainUsersList, series,
									totalCallsCountList, callsDurationList,
									text, colors, domainUserImgList,base_model);

							portlet_utility.addWidgetToGridster(base_model);
						});
	},

	/**
	 * To fetch task report portlet data to render as bar graph
	 */
	taskReportGraphData : function(base_model, selector, url) {
		var groupByList = [];
		var splitByList = [];
		var splitByNamesList = [];
		var domainUserNamesList = [];
		var sizey = parseInt($('#' + selector).parent().attr("data-sizey"));
		var topPos = 50 * sizey;
		if (sizey == 2 || sizey == 3)
			topPos += 50;
		$('#' + selector)
				.html(
						"<div class='text-center v-middle opa-half' style='margin-top:"
								+ topPos
								+ "px'><img src='"+updateImageS3Path('../flatfull/img/ajax-loader-cursor.gif')+"' style='width:12px;height:10px;opacity:0.5;' /></div>");
		this
				.fetchPortletsGraphData(
						url,
						function(data) {
							if (data.status == 403) {
								$('#' + selector)
										.html(
												"<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
								return;
							}
							groupByList = data["groupByList"];
							splitByList = data["splitByList"];
							domainUserNamesList = data["domainUserNamesList"];
							var series = [];
							var text = '';
							var colors;

							$.each(splitByList, function(index, splitByData) {
								if (splitByNamesList.length == 0)
									$.each(splitByData, function(key, value) {
										splitByNamesList.push(portlet_utility
												.getPortletNormalName(key));
									});
							});
							for ( var i = 0; i < splitByNamesList.length; i++) {
								var tempData = {};
								var splitByDataList = [];
								$
										.each(
												splitByList,
												function(index, splitByData) {
													$
															.each(
																	splitByData,
																	function(
																			key,
																			value) {
																		if (portlet_utility
																				.getPortletNormalName(key) == splitByNamesList[i])
																			splitByDataList
																					.push(value);
																	});
												});
								tempData.name = splitByNamesList[i];
								tempData.data = splitByDataList;
								series[i] = tempData;
							}
							text = "Task Report";

							var groupByNamesList = [];

							$.each(groupByList, function(index, name) {
								groupByNamesList[index] = portlet_utility
										.getPortletNormalName(name+'#'+index);
							});

							portlet_graph_utility.taskReportBarGraph(selector,
									groupByNamesList, series, text, base_model,
									domainUserNamesList,undefined,'');

							portlet_utility.addWidgetToGridster(base_model);
						});
	},

	/**
	 * To fetch revenue graph portlet data to render as area spline graph
	 */
	revenueGraphData : function(base_model, selector, url) {
		this
				.fetchPortletsGraphData(
						url,
						function(data) {
							if (data.status == 406) {
								// Show cause of error in saving
								$save_info = $('<div class="portlet-error-message inline-block"><small><p class="text-base" style="color:#B94A48;"><i>'
										+ data.responseText
										+ '</i></p></small></div>');

								$('#' + selector).html($save_info).show();

								return;
							}
							var sortedKeys = [];
							var categories = [];
							$.each(data, function(k, v) {
								sortedKeys.push(k);
							});
							sortedKeys.sort();
							var sortedData = {};
							$.each(sortedKeys, function(index, value) {
								sortedData['' + value] = data['' + value];
							});
							var series;
							// Iterates through data and adds keys into
							// categories
							$.each(sortedData, function(k, v) {
								// Initializes series with names with the first
								// data point
								if (series == undefined) {
									var index = 0;
									series = [];
									$.each(v, function(k1, v1) {
										var series_data = {};
										series_data.name = k1;
										series_data.data = [];
										series[index++] = series_data;
									});
								}
								// Fill Data Values with series data
								$.each(v, function(k1, v1) {
									// Find series with the name k1 and to that,
									// push v1
									var series_data = find_series_with_name(
											series, k1);
									series_data.data.push(v1);
								});
								var dt = new Date(k * 1000);
								categories.push(Date.UTC(dt.getFullYear(), dt
										.getMonth(), dt.getDate()));

							});

							portlet_graph_utility.portletDealRevenueGraph(
									selector, series, base_model, categories);

							portlet_utility.addWidgetToGridster(base_model);
						});
	},

	/**
	 * To fetch emails opened portlet data to render as pie graph
	 */
	emailsOpenedGraphData : function(base_model, selector, url) {
		var emailsSentCount = 0;
		var emailsOpenedCount = 0;
		var sizey = parseInt($('#' + selector).parent().attr("data-sizey"));
		var topPos = 50 * sizey;
		$('#' + selector)
				.html(
						"<div class='text-center v-middle opa-half' style='margin-top:"
								+ topPos
								+ "px'><img src='"+updateImageS3Path('../flatfull/img/ajax-loader-cursor.gif')+"' style='width:12px;height:10px;opacity:0.5;' /></div>");
		this
				.fetchPortletsGraphData(
						url,
						function(data) {
							if (data.status == 403) {
								$('#' + selector)
										.html(
												"<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
								return;
							}
							emailsSentCount = data["emailsSentCount"];
							emailsOpenedCount = data["emailsOpenedCount"];

							var series = [];
							series.push([ "Emails Sent",
									emailsSentCount - emailsOpenedCount ]);
							series.push([ "Emails Opened", emailsOpenedCount ]);

							portlet_graph_utility.emailsOpenedPieChart(
									selector, series, emailsSentCount,
									emailsOpenedCount);

							portlet_utility.addWidgetToGridster(base_model);
						});
	},
	dealGoalsGraphData : function(selector,data,column_position,row_position)
	{
					var colors1=[ '#ffffff', '#27C24C' ];
					var colors2= ['#ffffff','#fad733'];
			
					var deal_graph_el=$('#'+selector).find('.dealGraph');
					deal_graph_el.attr('id','dealGraph-'+column_position + '-' + row_position);
					var graphSelector1=$('#'+selector).find('.dealGraph').attr('id');
					var revenue_graph_el=$('#'+selector).find('.revenueGraph');
					revenue_graph_el.attr('id','revenueGraph-'+column_position + '-' + row_position);
						var graphSelector2=$('#'+selector).find('.revenueGraph').attr('id');
					if(data["goalCount"]==0)
					{
						$('#' + graphSelector1)
										.html(
												'<div class="portlet-error-message" style="padding:30px 15px">No Deals Goals set </div>');
								
					}
					else{
						if(data["dealcount"]>=data["goalCount"])
							$('#'+selector).find('.goal_count_success').show();
						portlet_graph_utility.dealGoalsPieGraph(graphSelector1,data["dealcount"],data["goalCount"],colors1);
					}
						

					if(data["goalAmount"]==0)
					{
						$('#' + graphSelector2)
										.html(
												'<div class="portlet-error-message" style="padding:30px 15px">No Revenue Goals set</div>');
								
					}
					 else{
					 	if(data["dealAmount"]>=data["goalAmount"])
							$('#'+selector).find('.goal_amount_success').show();
					portlet_graph_utility.dealGoalsPieGraph(graphSelector2,data["dealAmount"],data["goalAmount"],colors2);
					}
	},
	/**
	 * Fetch incoming deals portlet data to render as pie graph
	 */
	incomingDealsGraphData : function(base_model, selector, url) {
		var that = this;

		var sizey = parseInt($('#' + selector).parent().attr("data-sizey"));
		var topPos = 50 * sizey;
		if (sizey == 2 || sizey == 3)
			topPos += 50;
		$('#' + selector)
				.html(
						"<div class='text-center v-middle opa-half' style='margin-top:"
								+ topPos
								+ "px'><img src='"+updateImageS3Path('../flatfull/img/ajax-loader-cursor.gif')+"' style='width:12px;height:10px;opacity:0.5;' /></div>");
		setupCharts(function()
	    {
	    	that.fetchPortletsGraphData(url, function(data)
	        {

	            // Categories are created time
	            var categories = [];
	            var tempcategories=[];
	            var type = base_model.get("settings").type;
	            if(!type)
	            	type = 0;
	            var frequency= base_model.get("settings").frequency;
	            if(!frequency)
	            	frequency = 'daily';
	            // Data with deals
	            var series;
	            var AllData=[];
	            var sortedKeys = [];
	            $.each(data,function(k,v){
	                sortedKeys.push(k);
	            });
	            sortedKeys.sort();
	            var sortedData = {};
	            $.each(sortedKeys,function(index,value){
	                sortedData[''+value] = data[''+value];
	            });

	            var min_tick_interval = 1;
	            var dataLength = 0;
	            // Iterates through data and adds keys into
	            // categories
	            $.each(sortedData, function(k, v)
	            {
	            	var totalData=[];
	            	totalData.push(k);
	            	var total=0;
	                // Initializes series with names with the first
	                // data point
	                if (series == undefined)
	                {
	                    var index = 0;
	                    series = []; 
	                    $.each(v, function(k1, v1)
	                    {
	                    	
	                        var series_data = {};
	                        series_data.name = k1;
	                        series_data.data = [];
	                        series[index++] = series_data;
	                        //totalData.push(total);
	                    });
	                
	                }


	                // Fill Data Values with series data
	                $.each(v, function(k1, v1)
	                {
	                	total=total+v1;
	                    // Find series with the name k1 and to that,
	                    // push v1
	                    var series_data = find_series_with_name(series, k1);
	                    series_data.data.push(v1);
	                });
	                     totalData.push(total);
	                tempcategories.push(k*1000);
					dataLength++;
					AllData.push(totalData);
				});
					
					that.dateRangeonXaxis(sortedData,tempcategories,categories,frequency,dataLength);

	            if(Math.ceil((dataLength-1)/10)>0)
	            {
	                min_tick_interval = Math.ceil(dataLength/10);
	                if(min_tick_interval==3)
	                {
	                    min_tick_interval = 4;
	                }
	            }
	            if(series==undefined)
	            	 chartRenderforIncoming(selector,categories,name,'',min_tick_interval,type,series,AllData,0,30);
	            else
	            {
	            $.ajax({ type : 'GET', url : '/core/api/categories?entity_type=DEAL_SOURCE', dataType : 'json',
	            success: function(data){
	                $.each(data,function(index,deals){
	                    for(var i=0;i<series.length;i++){
	                        if(series[i].name=="0")
	                                series[i].name="Unknown";
	                        else if(deals.id==series[i].name){
	                            series[i].name=deals.label;
	                        }
	                            
	                    }
	                });
	                chartRenderforIncoming(selector,categories,name,'',min_tick_interval,type,series,AllData,0,30);
	                } 
	            });
	        	}


	            // After loading and processing all data, highcharts are initialized
	            // setting preferences and data to show
	            
	        });
	    });
	},
	dateRangeonXaxis : function(sortedData, tempcategories, categories, frequency, dataLength) {
		var cnt = 0;
		$
				.each(
						sortedData,
						function(k, v) {
							var dte = new Date(
									tempcategories[cnt]);
							if (frequency != undefined) {
								if (frequency == "daily") {
									categories
											.push(Highcharts
													.dateFormat(
															'%e.%b',
															Date
																	.UTC(
																			dte
																					.getFullYear(),
																			dte
																					.getMonth(),
																			dte
																					.getDate()))
													+ '');
								} else if (frequency == "weekly") {
									if (cnt != dataLength - 1) {
										var next_dte = new Date(
												tempcategories[cnt + 1]);
										categories
												.push(Highcharts
														.dateFormat(
																'%e.%b',
																Date
																		.UTC(
																				dte
																						.getFullYear(),
																				dte
																						.getMonth(),
																				dte
																						.getDate()))
														+ ' - '
														+ Highcharts
																.dateFormat(
																		'%e.%b',
																		Date
																				.UTC(
																						next_dte
																								.getFullYear(),
																						next_dte
																								.getMonth(),
																						next_dte
																								.getDate() - 1)));
									} else {
										var end_date = new Date();
										categories
												.push(Highcharts
														.dateFormat(
																'%e.%b',
																Date
																		.UTC(
																				dte
																						.getFullYear(),
																				dte
																						.getMonth(),
																				dte
																						.getDate()))
														+ ' - '
														+ Highcharts
																.dateFormat(
																		'%e.%b',
																		Date
																				.UTC(
																						end_date
																								.getFullYear(),
																						end_date
																								.getMonth(),
																						end_date
																								.getDate())));
									}
								} else if (frequency == "monthly") {
									if (cnt != dataLength - 1) {
										var next_dte = new Date(
												tempcategories[cnt + 1]);
										var current_date = new Date();
										var from_date = '';
										var to_date = '';
										if (cnt != 0) {
											if (current_date
													.getFullYear() != dte
													.getFullYear()) {
												from_date = Highcharts
														.dateFormat(
																'%b.%Y',
																Date
																		.UTC(
																				dte
																						.getFullYear(),
																				dte
																						.getMonth(),
																				dte
																						.getDate()));
											} else {
												from_date = Highcharts
														.dateFormat(
																'%b',
																Date
																		.UTC(
																				dte
																						.getFullYear(),
																				dte
																						.getMonth(),
																				dte
																						.getDate()));
											}
											categories
													.push(from_date);
										} else {
											if (current_date
													.getUTCFullYear() != dte
													.getUTCFullYear()) {
												from_date = Highcharts
														.dateFormat(
																'%e.%b.%Y',
																Date
																		.UTC(
																				dte
																						.getFullYear(),
																				dte
																						.getMonth(),
																				dte
																						.getDate()));
											} else {
												from_date = Highcharts
														.dateFormat(
																'%e.%b',
																Date
																		.UTC(
																				dte
																						.getFullYear(),
																				dte
																						.getMonth(),
																				dte
																						.getDate()));
											}
											if (current_date
													.getUTCFullYear() != next_dte
													.getUTCFullYear()) {
												to_date = Highcharts
														.dateFormat(
																'%e.%b.%Y',
																Date
																		.UTC(
																				next_dte
																						.getFullYear(),
																				next_dte
																						.getMonth(),
																				next_dte
																						.getDate() - 1));
											} else {
												to_date = Highcharts
														.dateFormat(
																'%e.%b',
																Date
																		.UTC(
																				next_dte
																						.getFullYear(),
																				next_dte
																						.getMonth(),
																				next_dte
																						.getDate() - 1));
											}
											categories
													.push(from_date
															+ ' - '
															+ to_date);
										}
									} else {
										var current_date = new Date();
										var from_date = '';
										var to_date = '';
										var end_date = new Date();
										if (current_date
												.getUTCFullYear() != dte
												.getUTCFullYear()) {
											from_date = Highcharts
													.dateFormat(
															'%e.%b.%Y',
															Date
																	.UTC(
																			dte
																					.getFullYear(),
																			dte
																					.getMonth(),
																			dte
																					.getDate()));
											to_date = Highcharts
													.dateFormat(
															'%e.%b.%Y',
															Date
																	.UTC(
																			end_date
																					.getFullYear(),
																			end_date
																					.getMonth(),
																			end_date
																					.getDate()));
										} else {
											from_date = Highcharts
													.dateFormat(
															'%e.%b',
															Date
																	.UTC(
																			dte
																					.getFullYear(),
																			dte
																					.getMonth(),
																			dte
																					.getDate()));
											to_date = Highcharts
													.dateFormat(
															'%e.%b',
															Date
																	.UTC(
																			end_date
																					.getFullYear(),
																			end_date
																					.getMonth(),
																			end_date
																					.getDate()));
										}
										categories
												.push(from_date
														+ ' - '
														+ to_date);
									}
								}
								cnt++;
							}
						});
	},
taskDeviationGraphData : function(base_model, selector, url) {
		var groupByList = [];
		var splitByList = [];
		var splitByNamesList = [];
		var domainUserNamesList = [];
var sizey = parseInt($('#' + selector).parent().attr("data-sizey"));
		var topPos = 50 * sizey;
		if (sizey == 2 || sizey == 3)
			topPos += 50;
		$('#' + selector)
				.html(
						"<div class='text-center v-middle opa-half' style='margin-top:"
								+ topPos
								+ "px'><img src='"+updateImageS3Path('../flatfull/img/ajax-loader-cursor.gif')+"' style='width:12px;height:10px;opacity:0.5;' /></div>");
		this
				.fetchPortletsGraphData(
						url,
						function(data) {
							if (data.status == 403) {
								$('#' + selector)
										.html(
												"<div class='portlet-error-message'><i class='icon-warning-sign icon-1x'></i>&nbsp;&nbsp;Sorry, you do not have the privileges to access this.</div>");
								return;
							}
							groupByList = data["groupByList"];
							splitByList = data["splitByList"];
							domainUserNamesList = data["domainUserNamesList"];
							var series = [];
							var CountData=[];
							var text = '';
							var colors;

							$.each(splitByList, function(index, splitByData) {
								if (splitByNamesList.length == 0)
									$.each(splitByData, function(key, value) {
										splitByNamesList.push(portlet_utility
												.getPortletNormalName(key));
									});
							});
							for ( var i = 0; i < splitByNamesList.length; i++) {
								var tempData = {};
								var splitByDataList = [];
								var splitByDataListCount = [];
								$
										.each(
												splitByList,
												function(index, splitByData) {
													$
															.each(
																	splitByData,
																	function(
																			key,
																			value) {
																		if (portlet_utility
																				.getPortletNormalName(key) == splitByNamesList[i]){
																			splitByDataListCount.push(value[0]);
																			
																			splitByDataList
																					.push(value[1]);
																				}
																	});
												});
								tempData.name = splitByNamesList[i];
								tempData.data = splitByDataList;
								series[i] = tempData;
								CountData[i]=splitByDataListCount;
							}
							text = "Average Deviation";

							var groupByNamesList = [];

							$.each(groupByList, function(index, name) {
								groupByNamesList[index] = portlet_utility
										.getPortletNormalName(name+'#'+index);
							});

							portlet_graph_utility.taskReportBarGraph(selector,
									groupByNamesList, series, text, base_model,
									domainUserNamesList,CountData,'In Seconds');

							portlet_utility.addWidgetToGridster(base_model);
						});
	},
};