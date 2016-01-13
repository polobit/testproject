var callschart=new Array();
var taskReport=new Array();
var portlet_graph_utility = {

	/**
	 * To display deals by milestone portlet as pie graph
	 */
	dealsByMilestonePieGraph : function(selector, milestonesList,
			milestoneValuesList, milestoneNumbersList) {
		head
				.js(
						LIB_PATH + 'lib/flot/highcharts-3.js',
						LIB_PATH + 'lib/flot/no-data-to-display.js',
						function() {
							var emptyFlag = true;
							$.each(milestoneValuesList, function(index, value) {
								if (value > 0)
									emptyFlag = false;
							});
							if (milestonesList.length == 0 || emptyFlag) {
								$('#' + selector)
										.html(
												'<div class="portlet-error-message">No deals found</div>');
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
																	+ '<tr><td class="p-n">Total Value: </td>'
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
														enabled : false
													}
												});
							}
						});
	},

	/**
	 * To display closers per person portlet as bar graph
	 */
	closuresPerPersonBarGraph : function(selector, catges, data, text, name) {
		head.js(LIB_PATH + 'lib/flot/highcharts-3.js', function() {
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
							enabled : false
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
							enabled : false
						}
					});
		});
	},

	/**
	 * To display deals funnel portlet as funnel graph
	 */
	dealsFunnelGraph : function(selector, funnel_data) {
		head
				.js(
						LIB_PATH + 'lib/flot/highcharts-3.js',
						LIB_PATH + 'lib/flot/funnel.js',
						LIB_PATH + 'lib/flot/no-data-to-display.js',
						function() {
							if (funnel_data == undefined
									|| (funnel_data != undefined && funnel_data.length == 0)) {
								$('#' + selector)
										.html(
												'<div class="portlet-error-message">No deals found</div>');
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
																	+ portlet_utility
																			.getPortletsCurrencySymbol()
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
													pointFormat : '<span>{series.name}:<b>'
															+ portlet_utility
																	.getPortletsCurrencySymbol()
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
													name : 'Value',
													data : funnel_data
												} ],
												exporting : {
													enabled : false
												}
											});
						});
	},

	/**
	 * To display emails sent portlet as bar graph
	 */
	emailsSentBarGraph : function(selector, domainUsersList, series,
			mailsCountList, mailsOpenedCountList, text, colors) {
		head
				.js(
						LIB_PATH + 'lib/flot/highcharts-3.js',
						function() {
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
													enabled : false
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
							"<div class='portlet-error-message'>Please <a href='#' id='"
									+ base_model.get("id")
									+ "-settings' class='portlet-settings text-info' dada-toggle='modal'>configure</a> the dashlet and add the Tags.</div>");
			flag = false;
		}
		if (flag) {
			head.js(LIB_PATH + 'lib/flot/highcharts-3.js', function() {
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
							exporting : {
								enabled : false
							},
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
								enabled:false,
								verticalAlign : 'top'
							},
							colors : [ "#23b7e5", "#27c24c", "#7266ba",
									"#fad733", "#f05050", "#aaeeee", "#ff0066",
									"#eeaaee", "#55BF3B", "#DF5353" ],
						});
			});
		}
	},

	/**
	 * To display deals assigned portlet as bar graph
	 */
	dealsAssignedBarGraph : function(selector, catges, dealsCountList) {
		head
				.js(
						LIB_PATH + 'lib/flot/highcharts-3.js',
						function() {
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
													enabled : false
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
													enabled : false
												}
											});
						});
	},

	/**
	 * To display calls per person portlet as bar graph
	 */
	callsPerPersonBarGraph : function(selector, domainUsersList, series,
			totalCallsCountList, callsDurationList, text, colors,
			domainUserImgList) {
			var column_position = $('#'+selector).parent().attr('data-col'), row_position = $('#'+selector).parent().attr('data-row');
		var pos = '' + column_position + '' + row_position;
		var	height=domainUsersList.length*30+($('#'+selector).height()-30);
		if(selector=='calls-chart')
			height=domainUsersList.length*30+120;
		
		head
				.js(
						LIB_PATH + 'lib/flot/highcharts-3.js',
						function() {
							
							callschart[parseInt(pos)]=new Highcharts.Chart({
								chart: {
									renderTo : selector,
						            type: 'bar',
						            marginRight: 100,
						            plotBorderWidth: 1,
						            plotBorderColor: '#F4F4F5',
						            height:height,
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
						    		tickWidth : 0
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
						        		if(text=="Calls Duration (Mins)")
						        			tt = '<table>' + 
						        					'<tr><td  class="b-b-none"><u style="text-decoration:none;border-bottom:1px solid">'+domainUsersList[this.points[0].point.x]+'</u></td></tr>'+	
					        		              '<tr><td style="color:'+this.points[0].series.color+';padding:0">'+this.points[0].series.name+':&nbsp; </td>' +
					        		              '<td style="padding:0"><b>'+portlet_utility.getPortletsTimeConversion(callsDurationList[this.points[0].point.x])+'</b></td></tr>' +
					        		              '<tr><td style="color:'+this.points[0].series.color+';padding:0">Calls:&nbsp; </td>' + 
					        		        	  '<td style="padding:0"><b>'+totalCallsCountList[this.points[0].point.x]+'</b></td></tr>' +
					        		        	  '</table>';
						        		else if(text=="Average Call Duration (Mins)"){
						        			
						        			tt += '<table>';
						        			if(this.points[0]!=undefined && this.points[0].series!=undefined){
						        				tt += 	'<tr><td class="b-b-none"><u style="text-decoration:none;border-bottom:1px solid">'+domainUsersList[this.points[0].point.x]+'</u></td></tr>'+	
						        							'<tr><td style="color:'+this.points[0].series.color+';padding:0">'+this.points[0].series.name+':&nbsp; </td>' +
							                      		'<td style="padding:0"><b>'+portlet_utility.getPortletsTimeConversion(Math.round(this.points[0].point.y))+'</b></td></tr>';
						        			}
						        			tt += '</table>';
						        			
						        		}else{
						        			tt += '<table><tr><td class="b-b-none"><u style="text-decoration:none;border-bottom:1px solid">'+domainUsersList[this.points[0].point.x]+'</u></td></tr>';
						        			if(this.points[0]!=undefined && this.points[0].series!=undefined){
						        				tt += 	'<tr><td style="color:'+this.points[0].series.color+';padding:0">'+this.points[0].series.name+':&nbsp; </td>' +
							                      		'<td style="padding:0"><b>'+this.points[0].point.y+'</b></td></tr>';
						        			}
						        			if(this.points[1]!=undefined && this.points[1].series!=undefined){
						        				tt += 	'<tr><td style="color:'+this.points[1].series.color+';padding:0">'+this.points[1].series.name+':&nbsp; </td>' +
							                      		'<td style="padding:0"><b>'+this.points[1].point.y+'</b></td></tr>';
						        			}
						        			if(this.points[2]!=undefined && this.points[2].series!=undefined){
						        				tt += 	'<tr><td style="color:'+this.points[2].series.color+';padding:0">'+this.points[2].series.name+':&nbsp; </td>' +
							                      		'<td style="padding:0"><b>'+this.points[2].point.y+'</b></td></tr>';
						        			}
						        			if(this.points[3]!=undefined && this.points[3].series!=undefined){
						        				tt += 	'<tr><td style="color:'+this.points[3].series.color+';padding:0">'+this.points[3].series.name+':&nbsp; </td>' +
							                      		'<td style="padding:0"><b>'+this.points[3].point.y+'</b></td></tr>';
						        			}
						        			tt += '<tr><td>Total:&nbsp; </td><td class="b-b-none">'+totalCallsCountList[this.points[0].point.x]+'</td></tr></table>';
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
						        exporting: {
							        enabled: false
							    },
							    colors : [ "#27c24c", "#23b7e5", "#f05050", "#7266ba", "#fad733","#aaeeee", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353" ],
							    legend : {
									itemStyle : {
										fontSize : '10px',
										color : '#98a6ad'
									},
									borderWidth : 0,
									layout : 'vertical',
									floating : true,
									align : 'right',
									enabled:false,
									verticalAlign : 'top'
								}
						    });
							
						});
	},
	
	
	/**
	 * To plot calls per person data  as a pie graph
	 */
	callsByPersonPieGraph :function(selector,categoryList,valueList){

	head.js(LIB_PATH + 'lib/flot/highcharts-3.js',LIB_PATH + 'lib/flot/no-data-to-display.js', function(){
		var emptyFlag = true;
		$.each(valueList,function(index,value){
			if(value>0)
				emptyFlag = false;
		});
		if(categoryList.length==0 || emptyFlag){
			if(selector == 'calls-chart-user'){
				$('#'+selector).html('<div class="portlet-error-message" style="font-size: 14px;font-style: normal;padding-top: 174px">No Calls Found</div>');	
			}
			else if(selector === 'calls-chart'){
				$('#'+selector).html('<div class="portlet-error-message" style="padding: 190px;font-style: normal">No Calls Found</div>');	
			}
			else{
				$('#'+selector).html('<div class="portlet-error-message">No Calls Found</div>');
			}
			
		}else{
			var data = [];
			$.each(categoryList,function(index,value){
				data.push([value,valueList[index]]);
			});
			$('#'+selector).highcharts({
		        chart: {
		            type: 'pie',
		            marginRight: 20
		        },
		        colors : ['#7266ba','#23b7e5','#fad733','#27c24c','#f05050',"#aaeeee", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF","#aaeeee"],
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
		    	            	return 	'<div class="text-center"><span style="color:'+this.point.color+'"><b>'+this.point.name+'</b></span><br/>' +
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
		        exporting: {
			        enabled: false
			    }
		    });
		}
	});
	},
	

	/**
	 * To display task report portlet as bar graph
	 */
	taskReportBarGraph : function(selector, groupByList, series, text,
			base_model, domainUserNamesList) {
			var column_position = $('#'+selector).parent().attr('data-col'), row_position = $('#'+selector).parent().attr('data-row');
		var pos = '' + column_position + '' + row_position;

		head
				.js(
						LIB_PATH + 'lib/flot/highcharts-3.js',
						function() {
							taskReport[parseInt(pos)]=new Highcharts.Chart({
												colors : [ "#23b7e5",
														"#27c24c", "#7266ba",
														"#fad733", "#f05050",
														"#aaeeee", "#ff0066",
														"#eeaaee", "#55BF3B",
														"#DF5353" ],
												chart : {
													renderTo:selector,
													type : 'bar',
													marginRight : 20,
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
																			+ this.value
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
														text : ''
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
												exporting : {
													enabled : false
												},
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
														if (base_model
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
													enabled:false,
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
												}
											});
						});
	},

	/**
	 * To display revenue graph portlet as area spline graph
	 */
	portletDealRevenueGraph : function(selector, series, base_model, categories) {
		head
				.js(
						LIB_PATH + 'lib/flot/highcharts-3.js',
						function() {
							if (series == undefined && categories != undefined
									&& categories.length == 0) {
								$('#' + selector)
										.html(
												'<div class="portlet-error-message">No deals found</div>');
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
												exporting : {
													enabled : false
												},
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
																+ '</font> : '
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
													enabled:false,
													verticalAlign : 'top'
												},
												colors : [ "#23b7e5",
														"#27c24c", "#7266ba",
														"#fad733", "#f05050",
														"#aaeeee", "#ff0066",
														"#eeaaee", "#55BF3B",
														"#DF5353" ],
											});
						});
	},

	/**
	 * To display emails opened portlet as pie graph
	 */
	emailsOpenedPieChart : function(selector, data, emailsSentCount,
			emailsOpenedCount) {
		head
				.js(
						LIB_PATH + 'lib/flot/highcharts-3.js',
						LIB_PATH + 'lib/flot/no-data-to-display.js',
						function() {
							if (emailsSentCount == 0 && emailsOpenedCount == 0) {
								$('#' + selector)
										.html(
												'<div class="portlet-error-message">No email activity</div>');
								return;
							}

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
															return '<div><span>Opened:'
																	+ emailsOpenedCount
																	+ '</span></div>';
														else if (this.name == "Emails Sent")
															return '<div><span>Sent:'
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
													enabled : false
												}
											});
						});
	},

	/**
	 * To display campaigns stats portlet as pie graph 
	 */
	campstatsPieChart : function() {
		head
				.js(
						LIB_PATH + 'lib/flot/highcharts-3.js',
						LIB_PATH + 'lib/flot/no-data-to-display.js',
						function() {
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
													enabled : false
												}
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
							head
				.js(
						LIB_PATH + 'lib/flot/highcharts-3.js',
						LIB_PATH + 'lib/flot/no-data-to-display.js',
						function() {

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
												series : [ {
													name : 'Goal',
													data : series
												} ],
												exporting : {
													enabled : false
												}
											});
						});
	},

};
