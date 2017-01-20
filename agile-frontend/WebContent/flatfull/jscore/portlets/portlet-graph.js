var callschart=new Array();
var taskReport=new Array();
var lightColors = ['#FFCCCC','#E8E4E3','#F5E7A3','#C2D6C2','#00FF00','#B8BAAB','#C3E619','#5ea1d4','#1d104a','#19A1E6','#0066CC','#E566FF','#FFFF99','#D98026','#FFAA00','#E6FFCC','#BBFF33','#FFFF33','#FF2A00','#66FFE6','#FF0080'];
var portlet_graph_utility = {

	/**
	 * To display deals by milestone portlet as pie graph
	 */
	dealsByMilestonePieGraph : function(selector, milestonesList,
			milestoneValuesList, milestoneNumbersList) {
		setupCharts(function(){
							var emptyFlag = true;
							$.each(milestoneValuesList, function(index, value) {
								if (value > 0)
									emptyFlag = false;
							});
							if (milestonesList.length == 0 || emptyFlag) {
								$('#' + selector)
										.html(
												'<div class="portlet-error-message">{{agile_lng_translate "portlets" "no-deals-found"}}</div>');
							} else {
								var data = [];
								$.each(milestonesList, function(index, value) {
									data.push([ value,
											milestoneValuesList[index] ]);
								});
								$('#' + selector)
										.highcharts(
												{
													chart : {
														type : 'pie',
														marginRight : 20
													},
													colors : [ '#7266ba',
															'#23b7e5',
															'#fad733',
															'#27c24c',
															'#f05050',
															"#aaeeee",
															"#ff0066",
															"#eeaaee",
															"#55BF3B",
															"#DF5353",
															"#7798BF",
															"#aaeeee" ],
													title : {
														text : ''
													},
													tooltip : {
														formatter : function() {
															return '<table>'
																	+ '<tr><td class="p-n">'
																	+ this.series.name
																	+ 's: </td>'
																	+ '<td class="p-n"><b>'
																	+ milestoneNumbersList[this.point.x]
																	+ '</b></td></tr>'
																	+ '<tr><td style="padding-right:1px">Total Value:'+' '+'</td>'
																	+ '<td class="p-n"><b>'
																	+ portlet_utility
																			.getPortletsCurrencySymbol()
																	+ ''
																	+ milestoneValuesList[this.point.x]
																			.toLocaleString()
																	+ '</b></td></tr>'
																	+ '</table>';
														},
														shared : true,
														useHTML : true,
														borderWidth : 1,
														backgroundColor : '#313030',
														shadow : false,
														borderColor : '#000',
														borderRadius : 3,
														style : {
															color : '#EFEFEF'
														}
													},
													plotOptions : {
														series : {
															borderWidth : 0
														},
														pie : {
															borderWidth : 0,
															innerSize : '35%',
															size:'45%',
															dataLabels : {
																enabled : true,
																useHTML : true,
																/*
																 * connectorWidth:
																 * 0,
																 */
																softConnector : true,
																formatter : function() {
																	return '<div class="text-center"><span style="color:'
																			+ this.point.color
																			+ '"><b>'
																			+ this.point.name
																			+ '</b></span><br/>'
																			+ '<span style="color:'
																			+ this.point.color
																			+ '"><b>'
																			+ Math
																					.round(this.point.percentage)
																			+ '%</b></span></div>';
																},
																/*
																 * format: '<b>{point.name}</b>:
																 * {point.percentage:.1f}',
																 */
																distance : 30,
																x : 2,
																y : -10
															},
															showInLegend : false
														}
													},
													series : [ {
														name : 'Deal',
														data : data
													} ],
											                 exporting : {
														buttons: {
											   			 contextButton: {
								       					    menuItems: buttons.slice(0,8)
								       					  },
								       					}
											       	},	
																									});
							}
						});
	},

	/**
	 * To display contacts count by campaigns stats portlet as pie graph
	 */
	campaignStatsPieGraph : function(selector, campaignStatusList,
			campaignValuesList) {
		setupCharts(function(){
							var emptyFlag = true;
							$.each(campaignValuesList, function(index, value) {
								if (value > 0)
									emptyFlag = false;
							});
							if (campaignStatusList.length == 0) {
								$('#' + selector)
										.html(
												'<div class="portlet-error-message">{{agile_lng_translate "campaigns" "no-subscribers-found"}}</div>');
							} else {
								var data = [];
								$.each(campaignStatusList, function(index, value) {
									data.push([ value,
											campaignValuesList[index] ]);
								});
								//pass dummy data for creating graph
								if(emptyFlag)
									data[0][1]=1;
								$('#' + selector)
										.highcharts(
												{
													chart : {
														type : 'pie',
														marginRight : 20
													},
													colors : [ '#55BF3B',
															'#23b7e5',
															'#ff0000',
															'#27c24c',
															'#f05050',
															"#aaeeee",
															"#ff0066",
															"#eeaaee",
															"#7266ba",
															"#DF5353",
															"#7798BF",
															"#aaeeee" ],
													title : {
														text : ''
													},
													tooltip : {
														formatter : function() {
															return '<table>'
																	+ '<tr> <td class="p-n">'
																	+ '<b>'
																	+ campaignStatusList[this.point.x]
																	+ '</b> {{agile_lng_translate "report-view" "subscribers"}}</td></tr>'
																	+ '<tr><td class="p-n">{{agile_lng_translate "campaigns" "total-count"}}: '
																	+ '<b> '
																	+ campaignValuesList[this.point.x].toLocaleString()
																	+ '</b></td></tr>'
																	+ '</table>';
														},
														shared : true,
														useHTML : true,
														borderWidth : 1,
														backgroundColor : '#313030',
														shadow : false,
														borderColor : '#000',
														borderRadius : 3,
														style : {
															color : '#EFEFEF'
														}
													},
													plotOptions : {
														series : {
															borderWidth : 0
														},
														pie : {
															borderWidth : 0,
															innerSize : '35%',
															size:'45%',
															dataLabels : {
																enabled : true,
																useHTML : true,
																/*
																 * connectorWidth:
																 * 0,
																 */
																softConnector : true,
																formatter : function() {
																	return '<div class="text-center"><span style="color:'
																			+ this.point.color
																			+ '"><b>'
																			+ this.point.name
																			+ '</b></span><br/>'
																			+ '<span style="color:'
																			+ this.point.color
																			+ '"><b>'
																			+ Math
																					.round(this.point.percentage)
																			+ '%</b></span></div>';
																},
																/*
																 * format: '<b>{point.name}</b>:
																 * {point.percentage:.1f}',
																 */
																distance : 30,
																x : 2,
																y : -10
															},
															showInLegend : false
														}
													},
													series : [ {
														name : 'Contact',
														data : data
													} ],
									                 exporting : {
													buttons: {
										   			 contextButton: {
							       					    menuItems: buttons.slice(0,8)
							       					  },
							       					}
										       	},	
																									});
							}
						});
	},


	/**
	 * To display closers per person portlet as bar graph
	 */
	closuresPerPersonBarGraph : function(selector, catges, data, text, name, base_model) {
		setupCharts(function(){
			$('#' + selector).highcharts(
					{
						chart : {
							type : 'bar',
							marginRight : 20
						},
						title : {
							text : ''
						},
						xAxis : {
							categories : catges
						},
						yAxis : {
							min : 0,
							title : {
								text : text
							},
							allowDecimals : false
						},
						legend : {
							enabled : portlet_utility.is_legend_enable(base_model),
						},
						tooltip : {
							formatter : function() {
								return '<span class="text-xxs">'
										+ this.points[0].key + '</span>'
										+ '<table>'
										+ '<tr><td class="p-n" style="color:'
										+ this.points[0].series.color + ';">'
										+ this.points[0].series.name
										+ ': </td>' + '<td class="p-n"><b>'
										+ data[this.points[0].point.x]
										+ '</b></td></tr>' + '</table>';
							},
							shared : true,
							useHTML : true
						},
						plotOptions : {
							column : {
								pointPadding : 0.2,
								borderWidth : 0
							}
						},
						series : [ {
							name : name,
							data : data
						} ],
		                 exporting : {
						buttons: {
			   			 contextButton: {
       					    menuItems: buttons.slice(0,8)
       					  },
       					}
			       	},	
					});
		});
	},

	/**
	 * To display deals funnel portlet as funnel graph
	 */
	dealsFunnelGraph : function(selector, funnel_data, base_model) {
		var currency = '';
		var series_name = "Revenue";
		if (base_model && base_model.get("settings")["split-by"] && base_model.get("settings")["split-by"] == "count") {
			series_name = "Deals";
		}
		else {
			currency = portlet_utility.getPortletsCurrencySymbol();
		}
		setupCharts(function(){
						
							if (funnel_data == undefined
									|| (funnel_data != undefined && funnel_data.length == 0)) {
								$('#' + selector)
										.html(
												'<div class="portlet-error-message">{{agile_lng_translate "portlets" "no-deals-found"}}</div>');
								return;
							}
							$('#' + selector)
									.highcharts(
											{
												chart : {
													type : 'funnel',
													marginLeft:-85,
													marginBottom: 20,
													className : 'deals-funnel-portlet'
												},
												colors : [ "#23b7e5",
														"#27c24c", "#7266ba",
														"#fad733", "#f05050",
														"#aaeeee", "#ff0066",
														"#eeaaee", "#55BF3B",
														"#DF5353" ],
												title : {
													text : ''
												},
												plotOptions : {
													series : {
														dataLabels : {
															enabled : true,
															useHTML : true,
															format : '<div class="text-center"><span style="color:{point.color}">{point.name}</span><br>'
																	+ '<span style="color:{point.color}">('
																	+ currency
																	+ '{point.y:,.0f})</span></div>',
															softConnector : true
														},
														neckWidth : '20%',
														neckHeight : '25%',

														// -- Other available
														// options
														height : '100%',
														width : '50%',
														borderWidth : 1,
														borderColor : 'white'
													}
												},
												tooltip : {
													pointFormat : '<span>{series.name}: <b>'
															+ currency
															+ '{point.y:,.0f}</b></span>',
													shared : true,
													useHTML : true,
													borderWidth : 1,
													backgroundColor : '#313030',
													shadow : false,
													borderColor : '#000',
													borderRadius : 3,
													style : {
														color : '#EFEFEF'
													}
												},
												series : [ {
													name : series_name,
													data : funnel_data
												} ],
								                 exporting : {
														buttons: {
											   			 contextButton: {
								       					    menuItems: buttons.slice(0,8)
								       					  },
								       					}
											       	},										
											
											});
						});
	},

	/**
	 * To display emails sent portlet as bar graph
	 */
	emailsSentBarGraph : function(selector, domainUsersList, series,
			mailsCountList, mailsOpenedCountList, text, colors) {
		setupCharts(function(){
							$('#' + selector)
									.highcharts(
											{
												chart : {
													type : 'bar',
													marginRight : 20
												},
												title : {
													text : ''
												},
												xAxis : {
													categories : domainUsersList
												},
												yAxis : {
													min : 0,
													title : {
														text : text
													},
													allowDecimals : false
												},
												tooltip : {
													formatter : function() {
														return '<table>'
																+ '<tr><td class="p-n" style="color:'
																+ this.points[0].series.color
																+ ';">'
																+ this.points[0].series.name
																+ ': </td>'
																+ '<td class="p-n"><b>'
																+ mailsCountList[this.points[0].point.x]
																+ '</b></td></tr>'
																+ '<tr><td class="p-n" style="color:'
																+ this.points[1].series.color
																+ ';">'
																+ this.points[1].series.name
																+ ': </td>'
																+ '<td class="p-n"><b>'
																+ mailsOpenedCountList[this.points[1].point.x]
																+ '</b></td></tr>'
																+ '</table>';
													},
													shared : true,
													useHTML : true
												},
												plotOptions : {
													series : {
														stacking : 'normal'
													},
													column : {
														pointPadding : 0.2,
														borderWidth : 0
													}
												},
												series : series,

								                 exporting : {
														buttons: {
											   			 contextButton: {
								       					    menuItems: buttons.slice(0,8)
								       					  },
								       					}
											       	},										
												colors : colors
											});
						});
	},

	/**
	 * To display growth graph portlet as area spline graph
	 */
	portletGrowthGraph : function(selector, series, base_model, categories,
			min_tick_interval) {
		var flag = true;
		if (base_model.get("settings").tags == "") {
			$('#' + selector)
					.html(
							"<div class='portlet-error-message'>{{agile_lng_translate 'contact-details' 'please'}} <a href='#' id='"
									+ base_model.get("id")
									+ "-settings' class='portlet-settings text-info' dada-toggle='modal'>{{agile_lng_translate 'portlets' 'configure'}}</a> {{agile_lng_translate 'portlets' 'configure-dashlet-tags'}}</div>");
			flag = false;
		}
		if (flag) {
			setupCharts(function(){
				$('#' + selector).highcharts(
						{
							chart : {
								type : 'areaspline',
								marginRight : 20,
							// plotBorderWidth: 1,
							// plotBorderColor: '#F4F4F5'
							   events: {
							   		load: function(){
							   			console.log("load");
							   			portlet_utility.toggle_chart_legends(this, base_model);
							   		}, redraw : function(){
							   			console.log("redraw");
							   			portlet_utility.toggle_chart_legends(this, base_model);
							   		}
							   },
							},
							title : {
								text : ''
							},
							xAxis : {
								categories : categories,
								tickmarkPlacement : 'on',
								minTickInterval : min_tick_interval,
								gridLineWidth : 1,
								gridLineColor : '#F4F4F5',
								labels : {
									style : {
										color : '#98a6ad',
										fontSize : '11px'
									}
								},
								lineWidth : 0,
								tickWidth : 0
							},
							yAxis : {
								min : 0,
								title : {
									text : ''
								},
								gridLineWidth : 1,
								gridLineColor : '#F4F4F5',
								labels : {
									style : {
										color : '#98a6ad',
										fontSize : '11px'
									}
								}
							},
							plotOptions : {
								series : {
									borderWidth : 2,
									borderColor : '#23b7e5',
									marker : {
										symbol : 'circle'
									}
								},
								areaspline : {
									marker : {
										lineWidth : 1,
										lineColor : null, // inherit from
										// series
										radius : 2
									}
								}
							},
							series : series,
				
							tooltip : {
								borderWidth : 1,
								backgroundColor : '#313030',
								shadow : false,
								borderColor : '#000',
								borderRadius : 3,
								style : {
									color : '#EFEFEF'
								}
							},
							legend : {
								itemStyle : {
									fontSize : '10px',
									color : '#98a6ad'
								},
								borderWidth : 0,
								layout : 'vertical',
								floating : true,
								align : 'right',
								enabled:portlet_utility.is_legend_enable(base_model),
								verticalAlign : 'top',
								y: 30
							},
							colors : [ "#23b7e5", "#27c24c", "#7266ba",
									"#fad733", "#f05050", "#aaeeee", "#ff0066",
									"#eeaaee", "#55BF3B", "#DF5353" ],
			                 exporting : {
								buttons: {
					   			 contextButton: {
		       					    menuItems: buttons.slice(0,8)
		       					  },
		       					}
					       	},	
						});
			});
		}
	},

	/**
	 * To display deals assigned portlet as bar graph
	 */
	dealsAssignedBarGraph : function(selector, catges, dealsCountList, base_model) {
		setupCharts(function(){
							$('#' + selector)
									.highcharts(
											{
												chart : {
													type : 'bar',
													marginRight : 20,
													events: {
												   		load: function(){
												   			console.log("load");
												   			portlet_utility.toggle_chart_legends(this, base_model);
												   		}, redraw : function(){
												   			console.log("redraw");
												   			portlet_utility.toggle_chart_legends(this, base_model);
												   		}
												   },
												},
												title : {
													text : ''
												},
												xAxis : {
													categories : catges
												},
												yAxis : {
													min : 0,
													title : {
														text : 'No. of deals assigned'
													},
													allowDecimals : false
												},
												legend : {
													enabled : portlet_utility.is_legend_enable(base_model),
												},
												tooltip : {
													formatter : function() {
														return '<span class="text-xxs">'
																+ this.points[0].key
																+ '</span>'
																+ '<table>'
																+ '<tr><td class="p-n" style="color:'
																+ this.points[0].series.color
																+ ';">'
																+ this.points[0].series.name
																+ ': </td>'
																+ '<td class="p-n"><b>'
																+ dealsCountList[this.points[0].point.x]
																+ '</b></td></tr>'
																+ '</table>';
													},
													shared : true,
													useHTML : true
												},
												plotOptions : {
													column : {
														pointPadding : 0.2,
														borderWidth : 0
													}
												},
												series : [ {
													name : 'Assigned Deals',
													data : dealsCountList
												} ],
								                 exporting : {
												buttons: {
									   			 contextButton: {
						       					    menuItems: buttons.slice(0,8)
						       					  },
						       					}
									       	},	
									
											});
						});
	},

	/**
	 * To display calls per person portlet as bar graph
	 */
	callsPerPersonBarGraph : function(selector, domainUsersList, series,
			totalCallsCountList, callsDurationList, text, colors,
			domainUserImgList,base_model,averageCallList_temp) {
			var column_position = $('#'+selector).parent().attr('data-col'), row_position = $('#'+selector).parent().attr('data-row');
		var pos = '' + column_position + '' + row_position;
		/*var	height=domainUsersList.length*30+($('#'+selector).height()-30);
		if(selector=='calls-chart')
			height=domainUsersList.length*30+120;*/
		var colorsToShow = [];
		var colorForStatus = {"Failed" : "#f05050", "Busy" :"#23b7e5" , "Voicemail" : "#7266ba", "Answered" : "#27c24c", "Missed" : "#fad733","Others": "#ff8080"};
		var addedColor = {};  // this is temp variable to check whether the color is alread added or not
		var lc = 0;
		$.each(series, function(index,value){
			if(colorForStatus[value.name]){
				colorsToShow.push(colorForStatus[value.name]);
				addedColor[colorForStatus[value.name]] = colorForStatus[value.name];
			}else{
				var colorCode;
				var loop = 0;
				while(true){
					if(lc >= lightColors.length-1 || loop > 1){
						colorCode = '#'+Math.floor(Math.random()*16777215 + Math.random()*7777).toString(16);
					}else{
						loop = loop + 1;
						colorCode = lightColors[lc];
					}
					
					if(!addedColor[colorCode]){
						loop = 0;
						lc = lc+1;
						break;
					}
				}
				addedColor[colorCode] = colorCode;
				colorsToShow.push(colorCode);
			}
		});
		colorsToShow = colors || colorsToShow;
		setupCharts(function(){
							
							callschart[parseInt(pos)]=new Highcharts.Chart({
								chart: {
									renderTo : selector,
						            type: 'bar',
						            marginRight: 100,
						            plotBorderWidth: 1,
						            plotBorderColor: '#F4F4F5',
						           // height:height,
						            events: {
								   		load: function(){
								   			console.log("load");
								   			if(base_model!=undefined)
								   			portlet_utility.toggle_chart_legends(this, base_model);
								   		}, redraw : function(){
								   			console.log("redraw");
								   			if(base_model!=undefined)
								   			portlet_utility.toggle_chart_legends(this, base_model);
								   		}
								   },
						        },
						        title: {
						            text: ''
						        },
						        xAxis: {
						            categories: domainUserImgList,
						            labels: {
						                formatter: function() {
						                	var userIndex=0;
						                	for(var i=0;i<domainUserImgList.length;i++){
						                		if(this.value==domainUserImgList[i] && domainUserImgList[i].substring(0,8)!="no image")
						                			userIndex=i;
						                		else if(this.value==domainUserImgList[i] && domainUserImgList[i].substring(0,8)=="no image")
							                			userIndex=parseInt(domainUserImgList[i].substring(9,10));
						                	}
						                	if(this.value!=undefined && this.value!="" && this.value.substring(0,8)!="no image")
						                		return '<img src="'+this.value+'" alt="" style="vertical-align: middle; width: 25px; height: 25px;border-radius:15px;" title="'+domainUsersList[userIndex]+'"/>';
						                	else
						                		return '<img src="'+gravatarImgForPortlets(25)+'" alt="" style="vertical-align: middle; width: 25px; height: 25px;border-radius:15px;" title="'+domainUsersList[userIndex]+'"/>';
						                },
						                style : {
						    				color : '#98a6ad',
						    				fontSize : '11px'
						    			},
						                useHTML: true,
						            },
						            gridLineWidth : 0,
						    		gridLineColor : '#F4F4F5',
						    		lineWidth : 0,
						    		tickWidth : 0,
						    		tickPixelInterval: 50
						        },
						        yAxis: {
						            min: 0,
						            title: {
						                text: text
						            },
						            allowDecimals: false,
						            gridLineWidth : 1,
						    		gridLineColor : '#F4F4F5',
						    		labels : {
						    			style : {
						    				color : '#98a6ad',
						    				fontSize : '11px'
						    			}
						    		}
						        },
						       tooltip: {
						        	formatter: function(){
						        		var tt = '';
						        		if(text=="{{agile_lng_translate 'calls' 'duration-secs-new'}}")
						        			tt = '<table>' + 
						        					'<tr><td  class="b-b-none"><u style="text-decoration:none;border-bottom:1px solid">'+domainUsersList[this.points[0].point.x]+'</u></td></tr>'+	
					        		              '<tr><td style="color:'+this.points[0].series.color+';padding:0">'+					        		              
					        		              this.points[0].series.name
					        		              +':&nbsp; </td>' +
					        		              '<td style="padding:0"><b>'+portlet_utility.getPortletsTimeConversion(callsDurationList[this.points[0].point.x])+'</b></td></tr>' +
					        		              '<tr><td style="color:'+this.points[0].series.color+';padding:0">Calls:&nbsp; </td>' + 
					        		        	  '<td style="padding:0"><b>'+totalCallsCountList[this.points[0].point.x]+'</b></td></tr>' +
					        		        	  '</table>';
					        		        	  
						        		else if(text=="{{agile_lng_translate 'calls' 'avg-duration-secs-new'}}"){
						        			
						        			tt += '<table>';
						        			if(this.points[0]!=undefined && this.points[0].series!=undefined){
						        				tt += 	'<tr><td class="b-b-none"><u style="text-decoration:none;border-bottom:1px solid">'+domainUsersList[this.points[0].point.x]+'</u></td></tr>'+	
						        							'<tr><td style="color:'+this.points[0].series.color+';padding:0">'+this.points[0].series.name+':&nbsp; </td>' +
							                      		'<td style="padding:0"><b>'+portlet_utility.getPortletsTimeConversion(Math.round(averageCallList_temp[this.points[0].point.x]))+'</b></td></tr>';
						        			}
						        			tt += '</table>';
						        			
						        		}else{
						        			tt += '<table><tr><td class="b-b-none"><u style="text-decoration:none;border-bottom:1px solid">'+domainUsersList[this.points[0].point.x]+'</u></td></tr>';
						        			for(var k=0; k<series.length; k++){
							        			if(this.points[k]!=undefined && this.points[k].series!=undefined){
							        				var tooltipLabel="";
														tooltipLabel = this.points[k].series.name;
													
							        				tt += 	'<tr><td style="color:'+this.points[k].series.color+';padding:0">'+tooltipLabel+':&nbsp; </td>' +
								                      		'<td style="padding:0"><b>'+this.points[k].point.y+'</b></td></tr>';
							        			}
						        			}
						        			tt += '<tr><td>{{agile_lng_translate "other" "total"}}:&nbsp; </td><td class="b-b-none">'+totalCallsCountList[this.points[0].point.x]+'</td></tr></table>';
						        		}
						        		return tt;
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
						        plotOptions: {
						        	series: {
						        		pointWidth: 10,
						                stacking: 'normal',
						                borderWidth : 0
						            },
						            column: {
						                pointPadding: 0.5,
						                borderWidth: 0
						            },
						            bar : {
						    			shadow : false
						    		}
						        },
						        series: series,
				                 exporting : {
									buttons: {
						   			 contextButton: {
			       					    menuItems: buttons.slice(0,8)
			       					  },
			       					}
						       	},	
							    //colors : [ "#27c24c", "#23b7e5", "#f05050", "#7266ba", '#fad733','#FF9900','#7AF168','#167F80','#0560A2','#D3E6C7','#7798BF'],
						        colors : colorsToShow,
							    legend : {
									itemStyle : {
										fontSize : '10px',
										color : '#98a6ad'
									},
									borderWidth : 0,
									labelFormatter : function() {
										if (this.name.length > 12) {
											return this.name
													.slice(0,
															12)
													+ '...';
										} else {
											return this.name;
										}
									},
									layout : 'vertical',
									floating : true,
									align : 'right',
									enabled:portlet_utility.is_legend_enable(base_model),
									verticalAlign : 'top',
									y:30
								}
						    },function(chart){
						    	if(selector=='calls-chart')
								chart.setSize(chart.chartWidth, domainUsersList.length*30+120);
								else{
                                    var max = chart.xAxis[0].max,
                                        min = chart.xAxis[0].min,
                                        height = chart.xAxis[0].height;
                                      if (height - (max - min) * 27 <= 0) {
                                        chart.setSize(chart.chartWidth, chart.chartHeight + (max - min) * 20)
                                      }
                                     }
                                                    });
							
						});
	},
	
	
	/**
	 * To plot calls per person data  as a pie graph
	 */
	callsByPersonPieGraph :function(selector,categoryList,valueList){

	setupCharts(function(){
		if(selector == "calls-chart-user")
			buttons.pop();
		var emptyFlag = true;
		$.each(valueList,function(index,value){
			if(value>0)
				emptyFlag = false;
		});
		if(categoryList.length==0 || emptyFlag){
			if(selector == 'calls-chart-user'){
				$('#'+selector).html('<div class="portlet-error-message" style="font-size: 14px;font-style: normal;padding-top: 174px">{{agile_lng_translate "report-add" "no-calls-found"}}</div>');	
			}
			else if(selector === 'calls-chart'){
				$('#'+selector).html('<div class="portlet-error-message" style="padding: 190px;font-style: normal">{{agile_lng_translate "report-add" "no-calls-found"}}</div>');	
			}
			else{
				$('#'+selector).html('<div class="portlet-error-message">{{agile_lng_translate "report-add" "no-calls-found"}}</div>');
			}
			
		}else{
			var data = [];
			var colors = [];
			var colorForStatus = {"Failed" : "#f05050", "Busy" :"#23b7e5" , "Voicemail" : "#7266ba", "Answered" : "#27c24c", "Missed" : "#fad733","Others": "#ff8080"};
			var addedColor = {};  // this is temp variable to check whether the color is alread added or not
			var lc = 0;
			$.each(categoryList,function(index,value){
				data.push([value,valueList[index]]);
				if(colorForStatus[value]){
					colors.push(colorForStatus[value]);
					addedColor[colorForStatus[value]] = colorForStatus[value];
				}else{
					var colorCode;
					var loop = 0;
					while(true){
						if(lc >= lightColors.length-1 || loop > 1 ){
							colorCode = '#'+Math.floor(Math.random()*16777215 + Math.random()*7777).toString(16);
						}else{
							loop = loop + 1;
							colorCode = lightColors[lc];
						}
						if(!addedColor[colorCode]){
							loop = 0;
							lc = lc+1;
							break;
						}
					}
					addedColor[colorCode] = colorCode;
					colors.push(colorCode);
				}
			});
			$('#'+selector).highcharts({
		        chart: {
		            type: 'pie',
		            marginRight: 20
		        },
		       // colors : ["#27c24c", "#23b7e5", "#f05050", "#7266ba", '#fad733','#FF9900','#7AF168','#167F80','#0560A2','#D3E6C7','#7798BF'],
		        colors :colors,
		        title: {
		            text: ''
		        },
		        tooltip: {
		        	formatter: function(){
		        		return '<table>' + 
		        		        '<tr><td class="p-n">Total '+categoryList[this.point.x]+':&nbsp; </td>' + 
		        		        '<td class="p-n"><b>'+ valueList[this.point.x]+'</b></td></tr>' +
		        		        '</table>';
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
		        plotOptions: {
		        	series: {

		                borderWidth : 0
		            },
		            pie: {
		            	size:'50%',
		            	borderWidth: 0,
		            	innerSize :'65%',
		            	dataLabels: {
		            		enabled: true,
		            		useHTML: true,
		            		/*connectorWidth: 0,*/
		            		softConnector: true,
		    	            formatter: function () {
		    	            	var tooltipLabel="";
				        		if (this.point.name.length > 12) {
				        			tooltipLabel =  this.point.name
											.slice(0,
													12)
											+ '...';
								} else {
									tooltipLabel = this.point.name;
								}
		    	            	return 	'<div class="text-center"><span style="color:'+this.point.color+'"><b>'+tooltipLabel+'</b></span><br/>' +
		    	            			'<span style="color:'+this.point.color+'"><b>'+Math.round(this.point.percentage)+'%</b></span></div>';
		    	            },
		            		/*format: '<b>{point.name}</b>: {point.percentage:.1f}',*/
		                    distance: 30,
		                },
		                showInLegend: false
		            }
		        },
		        series: [{
		            name: "",
		            data: data
		        }],
                 exporting : {
						buttons: {
			   			 contextButton: {
       					    menuItems: buttons.slice(0,8)
       					  },
       					}
			       	},			        

		    });
		}
	});
	},
	
	/**
	 * To display task report portlet as bar graph
	 */
	taskReportBarGraph : function(selector, groupByList, series, text,
			base_model, domainUserNamesList,CountData,yaxistitle) {
			var column_position = $('#'+selector).parent().attr('data-col'), row_position = $('#'+selector).parent().attr('data-row');
		var pos = '' + column_position + '' + row_position;

		setupCharts(function(){
							taskReport[parseInt(pos)]=new Highcharts.Chart({
												colors : [ "#23b7e5",
														"#27c24c", "#7266ba",
														"#fad733", "#f05050",
														"#aaeeee", "#f4a460",
														"#eeaaee", "#55BF3B",
														"#DF5353" ],
												chart : {
													renderTo:selector,
													type : 'bar',
													marginRight : 80,
													height:groupByList.length*30+($('#'+selector).height()-30),
													events: {
												   		load: function(){
												   			console.log("load");
												   			portlet_utility.toggle_chart_legends(this, base_model);
												   		}, redraw : function(){
												   			console.log("redraw");
												   			portlet_utility.toggle_chart_legends(this, base_model);
												   		}
												   },
												},
												title : {
													text : ''
												},
												
												xAxis : {
													categories : groupByList,
													labels : {
														formatter : function() {
															if(base_model.get('name')=='Average Deviation')
															{
																var userIndex = 0;
																for ( var i = 0; i < groupByList.length; i++) {
																	if (this.value == groupByList[i]
																			&& groupByList[i]
																					.substring(
																							0,
																							8) != "no image")
																		userIndex = i;
																	else if (this.value == groupByList[i]
																			&& groupByList[i]
																					.substring(
																							0,
																							8) == "no image")
																		userIndex = parseInt(groupByList[i]
																				.substring(
																						9,
																						10));
																}
																if (this.value != undefined
																		&& this.value != ""
																		&& this.value
																				.substring(
																						0,
																						8) != "no image")
																	return '<img src="'
																			+ this.value.split('#')[0]
																			+ '" alt="" style="vertical-align: middle; width: 25px; height: 25px;border-radius:15px;" title="'
																			+ domainUserNamesList[userIndex]
																			+ '"/>';
																else
																	return '<img src="'
																			+ gravatarImgForPortlets(25)
																			+ '" alt="" style="vertical-align: middle; width: 25px; height: 25px;border-radius:15px;" title="'
																			+ domainUserNamesList[userIndex]
																			+ '"/>';
															}
																else{
															if (base_model
																	.get('settings')["group-by"] == "user") {
																var userIndex = 0;
																for ( var i = 0; i < groupByList.length; i++) {
																	if (this.value == groupByList[i]
																			&& groupByList[i]
																					.substring(
																							0,
																							8) != "no image")
																		userIndex = i;
																	else if (this.value == groupByList[i]
																			&& groupByList[i]
																					.substring(
																							0,
																							8) == "no image")
																		userIndex = parseInt(groupByList[i]
																				.substring(
																						9,
																						10));
																}
																if (this.value != undefined
																		&& this.value != ""
																		&& this.value
																				.substring(
																						0,
																						8) != "no image")
																	return '<img src="'
																			+ this.value.split('#')[0]
																			+ '" alt="" style="vertical-align: middle; width: 25px; height: 25px;border-radius:15px;" title="'
																			+ domainUserNamesList[userIndex]
																			+ '"/>';
																else
																	return '<img src="'
																			+ gravatarImgForPortlets(25)
																			+ '" alt="" style="vertical-align: middle; width: 25px; height: 25px;border-radius:15px;" title="'
																			+ domainUserNamesList[userIndex]
																			+ '"/>';
															} else {
																if (this.value.length > 12) {
																	return this.value
																			.slice(
																					0,
																					12)
																			+ '...';
																} else {
																	return this.value;
																}
															}
														}
														},
														style : {
															color : '#98a6ad',
															fontSize : '11px'
														},
														useHTML : true
													},
													gridLineWidth : 1,
													gridLineColor : '#F4F4F5',
													lineWidth : 0,
													tickWidth : 0
												},
												yAxis : {
													min : 0,
													title : {
														text : yaxistitle
													},
													allowDecimals : false,
													gridLineWidth : 1,
													gridLineColor : '#F4F4F5',
													labels : {
														style : {
															color : '#98a6ad',
															fontSize : '11px'
														}
													}
												},
												plotOptions : {
													series : {
														stacking : 'normal',
														borderWidth : 0
													},
													column : {
														pointPadding : 0.2,
														borderWidth : 0
													},
													bar : {
														shadow : false
													}
												},
												series : series,
										
												tooltip : {
													borderWidth : 1,
													backgroundColor : '#313030',
													shadow : false,
													borderColor : '#000',
													borderRadius : 3,
													style : {
														color : '#EFEFEF'
													},
													formatter : function() {
														if( base_model.get('name')=='Average Deviation'){
															var userIndex = 0;
															for ( var i = 0; i < groupByList.length; i++) {
																if (this.key == groupByList[i])
																	userIndex = i;
															}
															return '<div>'
																	+ '<div class="p-n">'
																	+ domainUserNamesList[userIndex]
																	+ ' </div>'
																	+ '<div class="p-n" style="color:'
																	+ this.series.color
																	+ ';">'
																	+ 'Deviation Time'
																	+ ':'
																	+ portlet_utility.getPortletsTimeConversion(Math.round(this.y))
																	+ ' </div>'
																	+ '<div class="p-n" style="color:'
																	+ this.series.color
																	+ ';">'
																	+ this.series.name
																	+ ': '
																	+ portlet_utility.getNumberWithCommasForPortlets(CountData[this.series.index][this.point.x])
																	+ ' </div>'
																	+ '</div>';
															
														}
														
													else	if (base_model
																.get('settings')["group-by"] == "user") {
															var userIndex = 0;
															for ( var i = 0; i < groupByList.length; i++) {
																if (this.key == groupByList[i])
																	userIndex = i;
															}
															return '<div>'
																	+ '<div class="p-n">'
																	+ domainUserNamesList[userIndex]
																	+ ' </div>'
																	+ '<div class="p-n" style="color:'
																	+ this.series.color
																	+ ';">'
																	+ this.series.name
																	+ ':'
																	+ this.y
																	+ ' </div>'
																	+ '</div>';
														} else
															return '<div>'
																	+ '<div class="p-n" style="color:'
																	+ this.series.color
																	+ ';">'
																	+ this.x
																	+ ' </div>'
																	+ '<div class="p-n" style="color:'
																	+ this.series.color
																	+ ';">'
																	+ this.series.name
																	+ ':'
																	+ this.y
																	+ ' </div>'
																	+ '</div>';
													},
													useHTML : true
												},
												legend : {
													itemStyle : {
														fontSize : '10px',
														color : '#98a6ad'
													},
													borderWidth : 0,
													layout : 'vertical',
													floating : true,
													align : 'right',
													verticalAlign : 'top',
													y:30,
													enabled:portlet_utility.is_legend_enable(base_model),
													labelFormatter : function() {
														if (this.name.length > 12) {
															return this.name
																	.slice(0,
																			12)
																	+ '...';
														} else {
															return this.name;
														}
													}
												},
								                 exporting : {
													buttons: {
										   			 contextButton: {
							       					    menuItems: buttons.slice(0,8)
							       					  },
							       					}
										       	},					
											});
						});
	},

	/**
	 * To display revenue graph portlet as area spline graph
	 */
	portletDealRevenueGraph : function(selector, series, base_model, categories) {
		setupCharts(function(){
							if (series == undefined && categories != undefined
									&& categories.length == 0) {
								$('#' + selector)
										.html(
												'<div class="portlet-error-message">{{agile_lng_translate "portlets" "no-deals-found"}}</div>');
								return;
							}
							$('#' + selector)
									.highcharts(
											{
												chart : {
													type : 'areaspline',
													marginRight : 20,
													events: {
												   		load: function(){
												   			console.log("load");
												   			portlet_utility.toggle_chart_legends(this, base_model);
												   		}, redraw : function(){
												   			console.log("redraw");
												   			portlet_utility.toggle_chart_legends(this, base_model);
												   		}
												   },

												},
												title : {
													text : ''
												},
												xAxis : {
													categories : categories,
													gridLineWidth : 1,
													gridLineColor : '#F4F4F5',
													labels : {
														style : {
															color : '#98a6ad',
															fontSize : '11px'
														},
														formatter : function() {
															return Highcharts
																	.dateFormat(
																			'%b',
																			this.value);
														},
													},
													lineWidth : 0,
													tickWidth : 0,
													tickmarkPlacement : 'on'
												},
												yAxis : {
													min : 0,
													title : {
														text : ''
													},
													gridLineWidth : 1,
													gridLineColor : '#F4F4F5',
													labels : {
														style : {
															color : '#98a6ad',
															fontSize : '11px'
														}
													}
												},
												plotOptions : {
													series : {
														borderWidth : 2,
														borderColor : '#23b7e5',
														marker : {
															symbol : 'circle'
														}
													},
													areaspline : {
														marker : {
															lineWidth : 1,
															lineColor : null, // inherit
															// from
															// series
															radius : 2
														}
													}
												},
												series : series,
										
												tooltip : {
													borderWidth : 1,
													backgroundColor : '#313030',
													shadow : false,
													borderColor : '#000',
													borderRadius : 3,
													style : {
														color : '#EFEFEF'
													},
													formatter : function() {
														return '<div>'
																+ '<div class="p-n">'
																+ Highcharts
																		.dateFormat(
																				'%b',
																				this.x)
																+ '</div>'
																+ '<div class="p-n"><font color='
																+ this.series.color
																+ '>'
																+ this.series.name
																+ '</font>: '
																+ portlet_utility
																		.getPortletsCurrencySymbol()
																+ ''
																+ portlet_utility
																		.getNumberWithCommasForPortlets(this.y)
																+ '</div>'
																+ '</div>';
													},
													useHTML : true
												},
												legend : {
													itemStyle : {
														fontSize : '10px',
														color : '#98a6ad'
													},
													borderWidth : 0,
													layout : 'vertical',
													floating : true,
													align : 'right',
													enabled:portlet_utility.is_legend_enable(base_model),
													verticalAlign : 'top',
													y : 30,
												},
												colors : [ "#23b7e5",
														"#27c24c", "#7266ba",
														"#fad733", "#f05050",
														"#aaeeee", "#ff0066",
														"#eeaaee", "#55BF3B",
														"#DF5353" ],
								                 exporting : {
													buttons: {
										   			 contextButton: {
							       					    menuItems: buttons.slice(0,8)
							       					  },
							       					}
										       	},				
											});
						});
	},

	/**
	 * To display emails opened portlet as pie graph
	 */
	emailsOpenedPieChart : function(selector, data, emailsSentCount,
			emailsOpenedCount) {
setupCharts(function(){
							/*if (emailsSentCount == 0 && emailsOpenedCount == 0) {
								$('#' + selector)
										.html(
												'<div class="portlet-error-message">{{agile_lng_translate "portlets" "no-email-activity"}}</div>');
								return;
							}*/

							$('#' + selector)
									.highcharts(
											{
												chart : {
													type : 'pie',
													marginLeft : -150,
													height : 150
												},
												colors : [ '#e8eff0', '#27C24C' ],
												title : {
													text : ''
												},
												tooltip : {
													enabled : false
												},
												legend : {
													layout : 'vertical',
													align : 'right',
													verticalAlign : 'top',
													x : -20,
													y : 40,
													labelFormatter : function() {
														if (this.name == "Emails Opened")
															return '<div><span>{{agile_lng_translate "campaigns" "opened"}}:'
																	+ emailsOpenedCount
																	+ '</span></div>';
														else if (this.name == "Emails Sent")
															return '<div><span>{{agile_lng_translate "social" "Sent"}}:'
																	+ emailsSentCount
																	+ '</span></div>';

													},
													itemStyle : {
														color : "#ccc",
														cursor : '',
														fontSize : "12px",
														fontWeight : "bold"
													},
													borderWidth : 0,
													floating : true,
												},
												plotOptions : {
													series : {
														borderWidth : 0,
														states : {
															hover : {
																enabled : false
															}
														}
													},
													pie : {
														borderWidth : 0,
														innerSize : 95,
														dataLabels : {
															enabled : true,
															useHTML : true,
															connectorWidth : 0,
															formatter : function() {
																var ff = '';
																if (this.point.name == "Emails Opened")
																	ff = '<div class="text-center"><span style="color:'
																			+ this.point.color
																			+ '"><b>'
																			+ Math
																					.round(
																							this.point.percentage)
																					.toString()
																			+ '%</b></span></div>';
																return ff;
															},
															/*format: '<b>{point.name}</b>: {point.percentage:.1f}',*/
															distance : -55
														},
														showInLegend : true,
														enableMouseTracking : false,
														point : {
															events : {
																legendItemClick : function() {
																	return false;
																}
															}
														}
													}
												},
												series : [ {
													name : 'Deal',
													data : data
												} ],
								                 exporting : {
												buttons: {
									   			 contextButton: {
						       					    menuItems: buttons.slice(0,8)
						       					  },
						       					}
									       	},											
											});
						});
	},

	/**
	 * To display campaigns stats portlet as pie graph 
	 */
	campstatsPieChart : function() {
	setupCharts(function(){
							var color;
							//var innersize='100%';
							var dis = 0;
							if (data[1][0] == 'Emails Opened')
								color = 'rgb(250, 215, 51)';
							if (data[1][0] == 'Emails Clicked')
								color = 'rgb(18, 209, 18)';
							if (data[1][0] == 'Emails Unsubscribed')
								color = 'rgb(240, 80, 80)';
							$(selector)
									.find('.graph')
									.highcharts(
											{
												chart : {
													type : 'pie',
													labelsEnabled : false,
													autoMargins : false,
													marginTop : 0,
													marginBottom : -6,
													marginLeft : 0,
													marginRight : 0,
													pullOutRadius : 0,
													events : {
														load : function(e) {
															console.log(this);
															this.options.plotOptions.series.dataLabels.distance = ((this.chartHeight + this.chartWidth) / 7.5)
																	* -1;
															this.series[0]
																	.update(this.options);
														},
														redraw : function(e) {
															console.log(this);
															var pos_left, pos_top;
															var chart = this;
															if ($(selector)
																	.parents(
																			'.portlet_body')
																	.height() <= 200) {
																pos_top = chart.chartHeight / 2.72;
															} else if ($(
																	selector)
																	.parents(
																			'.portlet_body')
																	.height() > 200
																	&& $(
																			selector)
																			.parents(
																					'.portlet_body')
																			.height() <= 450) {
																pos_top = chart.chartHeight / 2.16;
															}

															else {
																pos_top = chart.chartHeight / 2.04;
															}
															if ($(selector)
																	.parents(
																			'.portlet_body')
																	.width() <= 405)
																pos_left = chart.chartWidth / 2.00;
															else if ($(selector)
																	.parents(
																			'.portlet_body')
																	.width() > 405
																	&& $(
																			selector)
																			.parents(
																					'.portlet_body')
																			.width() <= 836) {
																pos_left = chart.chartWidth / 2.05;

															}

															else {
																pos_left = chart.chartWidth / 2.00;

															}

															chart.series[0].data[1].dataLabel
																	.attr({
																		x : pos_left,
																		y : pos_top
																	});
														}
													},

												},
												colors : [ '#e8eff0', color ],
												title : {
													text : ''
												},
												tooltip : {
													enabled : false
												},
												legend : {
													enabled : false,
												},
												plotOptions : {
													series : {
														dataLabels : {
															align : 'center',
															enabled : true,
															useHTML : true,
															connectorWidth : 0,
															formatter : function() {
																var ff = '';

																if (this.point.name == "Emails Opened")
																	ff = '<div class="text-center"><span style="color:'
																			+ this.point.color
																			+ '"><b>'
																			+ Math
																					.round(
																							this.point.percentage)
																					.toString()
																			+ '%</b></span></div>';

																if (this.point.name == "Emails Clicked")
																	ff = '<div class="text-center"><span style="color:'
																			+ this.point.color
																			+ '"><b>'
																			+ Math
																					.round(
																							this.point.percentage)
																					.toString()
																			+ '%</b></span></div>';
																if (this.point.name == "Emails Unsubscribed")
																	ff = '<div class="text-center"><span style="color:'
																			+ this.point.color
																			+ '"><b>'
																			+ Math
																					.round(
																							this.point.percentage)
																					.toString()
																			+ '%</b></span></div>';

																return ff;

															},
															/*format: '<b>{point.name}</b>: {point.percentage:.1f}',*/
															distance : 0,
														},
														borderWidth : 0,
														states : {
															hover : {
																enabled : false
															}
														}
													},
													pie : {
														borderWidth : 0,
														size : '100%',
														innerSize : '100%',
													},
													showInLegend : true,
													enableMouseTracking : false,
													point : {
														events : {
															legendItemClick : function() {
																return false;
															}
														}
													}
												},
												series : [ {
													// name: 'Deal',
													data : data
												} ],
								                 exporting : {
												buttons: {
									   			 contextButton: {
						       					    menuItems: buttons.slice(0,8)
						       					  },
						       					}
									       	},									
											});
						});
	},
	dealGoalsPieGraph : function(selector, data1,data2,colors)
	{
			var series = [];
							series.push([ "Goals Left",
									data2 - data1 ]);
							series.push([ "Won", data1 ]);
							//portlet_graph_utility.emailsOpenedPieChart(selector,series,data1,data2);
							setupCharts(function(){
							$('#' + selector)
									.highcharts(
											{
												chart : {
													type : 'pie',
													backgroundColor:'transparent',

												},
												colors : colors,
												title : {
													text : ''
												},
												tooltip : {
													backgroundColor : '#313030',
													borderColor : '#000',
													borderRadius : 3,
													/*style : {
														color : '#EFEFEF'
													},*/
													enabled : true,
													formatter:  function(){
														
													return  '<div class="p-n"><b><font color='+this.point.color+'>'+ this.point.name +' '+ Math.round(this.point.percentage).toString()+'%</font></b></div>';
					                        
												},
												useHTML : true,
												},
												legend : {
													itemStyle : {
														fontSize : '10px',
														color : '#98a6ad'
													},
													borderWidth : 0,
													layout : 'vertical',
													floating : true,
													align : 'right',
													verticalAlign : 'top',
													symbolHeight: 0,
													symbolWidth: 0,
													symbolRadius: 0,
																	labelFormatter : function()
											{
												if(this.name=="Won"){
												var s = '<div> ' + (this.percentage)
														.toFixed(2) + '%<b></div>';
												return s;
											}
											}, 
												},
												plotOptions : {
													series : {
														borderWidth : 0,
														states : {
															hover : {
																enabled : false
															}
														}
													},
													pie : {
														borderWidth : 0,
														//innerSize : 50,
														dataLabels : {
															enabled : false,
															
														},
														showInLegend : true,
														//enableMouseTracking : false,
														point : {
															events : {
																legendItemClick : function() {
																	return false;
																}
															}
														}
													}
												},
												exporting :
												{
													enabled : false,
												},
												series : [ {
													name : 'Goal',
													data : series
												} ],
								                 exporting : {
														buttons: {
											   			 contextButton: {
								       					    menuItems: buttons.slice(0,8)
								       					  },
								       					}
											       	},			
											
											});
						});
	},

	/**
	 * To display contacts count by Visitors portlet as pie graph
	 */
	webstatVisitsPieGraph : function(selector, known,
			anonymous) {
		var series = [];
							series.push([ "Known",
									known]);
							series.push([ "Unknown", anonymous ]);
        var totalVisits = known+anonymous;

		setupCharts(function(){
			if (known == 0 && anonymous == 0) {
								$('#' + selector)
										.html(
												'<div class="portlet-error-message">{{agile_lng_translate "visitors" "no-visits-found"}}</div>');
								return;
							}
								$('#' + selector)
										.highcharts(
												{
													chart : {
														type : 'pie',
														marginRight : 20
													},
													colors : [ '#55BF3B',
															'#23b7e5',
															'#ff0000',
															'#27c24c',
															'#f05050',
															"#aaeeee",
															"#ff0066",
															"#eeaaee",
															"#7266ba",
															"#DF5353",
															"#7798BF",
															"#aaeeee" ],
													title : {
														text : ''
													},
													tooltip : {
														formatter : function() {
															return '<table>'
																	+ '<tr> <td class="p-n">'
																	+ (this.point.name)
																	+ ' {{agile_lng_translate "tickets" "visits"}}:<b> '+(this.point.y)
																	+ '</b></td></tr>'
																	+ '<tr><td class="p-n">{{agile_lng_translate "visitors" "total-visits"}}: '
																	+ '<b> '
																	+ totalVisits
																	+ '</b></td></tr>'
																	+ '</table>';
														},
														shared : true,
														useHTML : true,
														borderWidth : 1,
														backgroundColor : '#313030',
														shadow : false,
														borderColor : '#000',
														borderRadius : 3,
														style : {
															color : '#EFEFEF'
														}
													},
													plotOptions : {
														series : {
															borderWidth : 0
														},
														pie : {
															borderWidth : 0,
															innerSize : '35%',
															size:'45%',
															dataLabels : {
																enabled : true,
																useHTML : true,
																/*
																 * connectorWidth:
																 * 0,
																 */
																softConnector : true,
																formatter : function() {
																	return '<div class="text-center"><span style="color:'
																			+ this.point.color
																			+ '"><b>'
																			+ this.point.name
																			+ '</b></span><br/>'
																			+ '<span style="color:'
																			+ this.point.color
																			+ '"><b>'
																			+ Math
																					.round(this.point.percentage)
																			+ '%</b></span></div>';
																},
																/*
																 * format: '<b>{point.name}</b>:
																 * {point.percentage:.1f}',
																 */
																distance : 30,
																x : 2,
																y : -10
															},
															showInLegend : false
														}
													},
													series : [ {
														name : 'Visits',
														data : series
													} ],
									                 exporting : {
														buttons: {
											   			 contextButton: {
								       					    menuItems: buttons.slice(0,8)
								       					  },
								       					}
											       	},	
																									});
						});
	},


};
