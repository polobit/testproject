/** Listener function for Event handling* */
function initializePortletsListeners() {

	$('.modal-footer')
			.off("click")
			.on(
					'click',
					'.portlet-settings-save-modal',
					function(e) {
						e.preventDefault();
						var scrollPosition = $(window).scrollTop();
						var form_id = $(this).parent().prev().find(
								'form:visible').attr('id');
						var modal_id = $(this).parent().parent().parent()
								.parent().attr('id');
						if (!isValidForm('#' + form_id))
							return false;
						$(this).attr('disabled', true);
						$(this).text('Saving...');

						var el = this.id;
						var flag = true;
						var json = {};
						var obj = {};
						var portletType = $('#portlet-type', $('#' + modal_id))
								.val();
						var portletName = $('#portlet-name', $('#' + modal_id))
								.val();
						json = serializeForm(form_id);
						if (portletType == "CONTACTS"
								&& portletName == "Growth Graph") {
							var tags = '';
							if ($('#addPortletBulkTags').val() != "") {
								var tag = $('#addPortletBulkTags').val();
								if ($('#portlet-ul-tags > li').length == 0)
									$('#portlet-ul-tags')
											.append(
													"<li data='"
															+ tag
															+ "' class='tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block'>'"
															+ tag
															+ "'<a tag='"
															+ tag
															+ "' id='remove_tag' class='close m-l-xs'>&time</a></li>");
								else
									$('#portlet-ul-tags > li:last')
											.after(
													"<li data='"
															+ tag
															+ "' class='tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block'>'"
															+ tag
															+ "'<a tag='"
															+ tag
															+ "' id='remove_tag' class='close m-l-xs'>&time</a></li>");
							}
							$('#portlet-ul-tags > li').each(function() {
								if ($(this).is(':last'))
									tags += $(this).attr('data');
								else
									tags += $(this).attr('data') + ',';
							});
							json['tags'] = tags;
						}

						if (portletType == "USERACTIVITY"
								&& portletName == "Leaderboard") {
							var tempJson = {};
							var tempJson1 = [];
							$('#category-list', $('#' + el).parent().parent())
									.find('option')
									.each(
											function() {
												if ($(this).is(':selected'))
													tempJson['' + $(this).val()] = true;
												else
													tempJson['' + $(this).val()] = false;
											});
							$('#user-list', $('#' + el).parent().parent())
									.find('option:selected').each(function() {
										tempJson1.push($(this).val());
									});
							json['duration'] = $('#duration',
									$('#' + el).parent().parent()).val();
							json['category'] = tempJson;
							json['user'] = tempJson1;
						}

						var idVal = $(
								'#'
										+ $(this).attr('id').split(
												"-save-modal")[0]).parent()
								.find('.portlet_body').attr('id');
						var portlet = Portlets_View.collection.get(el
								.split("-save-modal")[0]);
						var column_position = portlet.get('column_position');
						var row_position = portlet.get('row_position');
						portlet.set({
							"prefs" : JSON.stringify(json)
						}, {
							silent : true
						});

						portlet.url = "core/api/portlets";
						var model = new BaseModel();
						model.url = 'core/api/portlets';

						if (flag) {
							model
									.save(
											portlet.toJSON(),
											{
												success : function(data) {

													hidePortletSettingsAfterSave(modal_id);
													$(window).scrollTop(
															scrollPosition);
													scrollPosition = 0;
													var model = data.toJSON();
													Portlets_View.collection
															.get(model)
															.set(
																	new BaseModel(
																			model));
													var pos = ''
															+ data
																	.get("column_position")
															+ ''
															+ data
																	.get("row_position");
													portlet_utility
															.getInnerViewOfPortlet(
																	data,
																	$('#portlet-res'));

													setPortletContentHeight(data);
													$('#' + data.get('id'))
															.parent()
															.find('div:last')
															.after(
																	'<span class="gs-resize-handle gs-resize-handle-both"></span>');
												},
											});
						}
					});

	$('#portletsTaskReportSettingsModal')
			.off("change")
			.on(
					'change',
					'#group-by-task-report',
					function(e) {

						$('#tasks-task-report').trigger("change");

						$('#split-by-task-report > option')
								.each(
										function(e1) {
											if ($(this).val() == $(
													'#group-by-task-report')
													.val())
												$(this).hide();
											else {
												if ($('#tasks-task-report')
														.val() == "completed-tasks"
														&& $(this).val() != "status") {
													$(this).show();
													$(this).attr("selected",
															true);
												} else if ($(
														'#tasks-task-report')
														.val() == "all-tasks") {
													$(this).show();
													$(this).attr("selected",
															true);
												}
											}
										});
						if ($('#group-by-task-report').val() == "status") {
							$('#tasks-task-report > option#all-tasks').attr(
									"selected", true);
							$('#tasks-control-group').hide();
						} else
							$('#tasks-control-group').show();
					});

	$('.modal-content')
			.off("change")
			.on(
					'change',
					'#tasks-task-report',
					function(e) {
						var taskreportStatus = $('#split-by-task-report > option#status');
						if ($('#tasks-task-report').val() == "completed-tasks") {
							if (taskreportStatus.is(':selected'))
								taskreportStatus.attr("selected", false);
							taskreportStatus.hide();
						} else
							taskreportStatus.show();
					});

	$('.gridster-portlets').off("mouseover").on(
			'mouseover',
			'.stats_report_portlet_body',
			function(e) {
				if ($('.stats_report_portlet_body').parent().find(
						'.gs-resize-handle')) {
					$('.stats_report_portlet_body').parent().find(
							'.gs-resize-handle').remove();
				}
			});

	$('.portlet_body').off("change").on(
			'change',
			'.onboarding-check',
			function(e) {
				var that = $(this);
				var model_id = $(this).parent().parent().parent().find(
						'.portlets').attr('id');
				var model = Portlets_View.collection.get(model_id);
				var json1 = {};
				$(this).parent().parent().find('label').each(function() {
					var json2 = {};
					if ($(this).find('input:checkbox').is(':checked')) {
						json2["done"] = true;
						json2["skip"] = false;
					} else {
						json2["done"] = false;
						json2["skip"] = false;
					}
					json1["" + $(this).prop('value')] = json2;
				});
				model.set({
					'prefs' : JSON.stringify(json1)
				}, {
					silent : true
				});
				// Saves new width and height in server
				$.ajax({
					type : 'POST',
					url : '/core/api/portlets/saveOnboardingPrefs',
					data : JSON.stringify(model.toJSON()),
					contentType : "application/json; charset=utf-8",
					dataType : 'json',
					success : function() {
						if (that.find('input:checkbox').is(':checked')) {
							that.parent().find('span').css("text-decoration",
									"line-through");
						} else {
							that.parent().find('span').css("text-decoration",
									"none");
						}
					}
				});

			});

	$('.modal-body').off("click").on('click', '#category-select-all',
			function(e) {
				e.preventDefault();
				$('#category-list').multiSelect('select_all');
			});

	$('.modal-content').off("click").on('click', '#category-select-none',
			function(e) {
				e.preventDefault();
				$('#category-list').multiSelect('deselect_all');
			});

	$('.modal-body').on('click', '#user-select-all', function(e) {
		e.preventDefault();
		$('#user-list').multiSelect('select_all');
	});

	$('.modal-content').on('click', '#user-select-none', function(e) {
		e.preventDefault();
		$('#user-list').multiSelect('deselect_all');
	});

	$('.modal-body').on('click', '#calls-user-select-all', function(e) {
		e.preventDefault();
		$('#calls-user-list').multiSelect('select_all');
	});

	$('.modal-content').on('click', '#calls-user-select-none', function(e) {
		e.preventDefault();
		$('#calls-user-list').multiSelect('deselect_all');
	});

	$('.modal-body').on('click', '#task-report-user-select-all', function(e) {
		e.preventDefault();
		$('#task-report-user-list').multiSelect('select_all');
	});

	$('.modal-content').on('click', '#task-report-user-select-none',
			function(e) {
				e.preventDefault();
				$('#task-report-user-list').multiSelect('deselect_all');
			});

	$('.gridster-portlets').on('mouseover', '.portlet_body_calendar',
			function(e) {
				$(this).find('.portlet_header_icons').removeClass('vis-hide');
				$(this).find('.fc-button').css('visibility', 'visible');
			});

	$('.gridster-portlets').on('mouseout', '.portlet_body_calendar',
			function(e) {
				$(this).find('.portlet_header_icons').addClass('vis-hide');
				$(this).find('.fc-button').css('visibility', 'hidden');
			});

	$('.events_show')
			.on(
					'click',
					'.minical-portlet-event',
					function(e) {
						App_Portlets.currentPosition = ''
								+ $(this).parents('.gs-w').find(
										'.column_position').text().trim()
								+ ''
								+ $(this).parents('.gs-w')
										.find('.row_position').text().trim();
						App_Portlets.currentPortletName = 'Mini Calendar';

						$("#updateActivityModal").html(getTemplate("update-activity-modal"));
						var id = $(this).attr('id');
						if (id && !isNaN(id)) {
							var events_array = $(
									'#calendar_container',
									$(this)
											.parentsUntil('.mini-cal')
											.eq(
													$(this).parentsUntil(
															'.mini-cal').length - 1))
									.fullCalendar(
											'clientEvents',
											id,
											function(event) {
												return (event.start >= date && event.start < endDate);
											});
							// $('#'+id,$('#calendar_container')).trigger('click');
							var model = events_array[0];
							App_Portlets.currentEventObj = model;
							var eventsURL = '/core/api/events/'
									+ events_array[0].id;
							var event;
							$
									.getJSON(
											eventsURL,
											function(doc) {
												event = doc;
												var start = getDate(event.start);
												var end = getDate(event.end);
												if (!model)
													return;
												if (model.color == "#f05050"
														|| model.color == "red")
													model.color = "red";
												else if (model.color == "#7266ba"
														|| model.color == "#36C")
													model.color = "#36C";
												else
													model.color = "green";
												// Deserialize
												deserializeForm(
														model,
														$("#updateActivityForm"));

												$("#update-event-date-1").val(
														getDateInFormat(start));
												$("#update-event-date-2").val(
														getDateInFormat(end));
												// Set time for update Event
												$('#update-event-time-1')
														.val(
																(start
																		.getHours() < 10 ? "0"
																		: "")
																		+ start
																				.getHours()
																		+ ":"
																		+ (start
																				.getMinutes() < 10 ? "0"
																				: "")
																		+ start
																				.getMinutes());
												$('#update-event-time-2')
														.val(
																(end.getHours() < 10 ? "0"
																		: "")
																		+ end
																				.getHours()
																		+ ":"
																		+ (end
																				.getMinutes() < 10 ? "0"
																				: "")
																		+ end
																				.getMinutes());

												// hide end date & time for all
												// day events
												if (model.allDay) {
													$("#update-event-date-2")
															.closest('.row')
															.hide();
													$('#update-event-time-1')
															.closest(
																	'.control-group')
															.hide();
												} else {
													$('#update-event-time-1')
															.closest(
																	'.control-group')
															.show();
													$("#update-event-date-2")
															.closest('.row')
															.show();
												}

												if (model.type == "WEB_APPOINTMENT"
														&& (model.start
																.getTime() / 1000) > parseInt(new Date()
																.getTime() / 1000)) {
													$("[id='event_delete']")
															.attr("id",
																	"delete_web_event");
													web_event_title = model.title;
													if (model.contacts.length > 0) {
														var firstname = getPropertyValue(
																model.contacts[0].properties,
																"first_name");
														if (firstname == undefined)
															firstname = "";
														var lastname = getPropertyValue(
																model.contacts[0].properties,
																"last_name");
														if (lastname == undefined)
															lastname = "";
														web_event_contact_name = firstname
																+ " "
																+ lastname;
													}
												} else {
													$("[id='delete_web_event']")
															.attr("id",
																	"event_delete");
												}

												if (model.description) {
													var description = '<label class="control-label"><b>Description </b></label><div class="controls"><textarea id="description" name="description" rows="3" class="input form-control" placeholder="Add Description"></textarea></div>'
													$("#event_desc").html(
															description);
													$("textarea#description")
															.val(
																	model.description);
												} else {
													var desc = '<div class="row-fluid">'
															+ '<div class="control-group form-group m-b-none">'
															+ '<a href="#" id="add_event_desctiption"><i class="icon-plus"></i> Add Description </a>'
															+ '<div class="controls event_discription hide">'
															+ '<textarea id="description" name="description" rows="3" class="input form-control w-full col-md-8" placeholder="Add Description"></textarea>'
															+ '</div></div></div>'
													$("#event_desc").html(desc);
												}
												// Fills owner select element
												populateUsersInUpdateActivityModal(model);

												// Show edit modal for the event
												$("#updateActivityModal")
														.modal('show');
												$(
														'#' + id,
														$('#calendar_container'))
														.trigger('click');
												return false;

											});
						}
					});

	$('.events_show').on(
			'click',
			'.minical-portlet-event-add',
			function(e) {
				// Shows a new event
				App_Portlets.currentPosition = ''
						+ $(this).parents('.gs-w').find('.column_position')
								.text().trim()
						+ ''
						+ $(this).parents('.gs-w').find('.row_position').text()
								.trim();
				App_Portlets.currentPortletName = 'Mini Calendar';
				var start = new Date(parseInt($(this).attr('id')));
				
				$('#activityModal').getTemplate("new-event-modal").modal('show');
				highlight_event();

				// Set Date for Event
				// var dateFormat = 'mm/dd/yyyy';
				$('#task-date-1').val(getDateInFormat(start));
				$("#event-date-1").val(getDateInFormat(start));
				$("#event-date-2").val(getDateInFormat(start));

				// Set Time for Event
				// if ((start.getHours() == 00) && (start.getHours() == 00) &&
				// (start.getMinutes() == 00))
				$('#event-time-1').val('');
				$('#event-time-2').val('');
			});

	$('#portletDeleteModal').off("click").on(
			"click",
			'.portlet-delete-modal',
			function(e) {
				e.preventDefault();

				var portlet = Portlets_View.collection.get($(this).attr('id'));
				/*
				 * Sends Delete request with portlet name as path parameter, and
				 * on success fetches the portlets to reflect the changes
				 * is_added, to show add portlet in the view instead of delete
				 * option
				 */
				$.ajax({
					type : 'DELETE',
					url : '/core/api/portlets/' + portlet.get("id"),
					contentType : "application/json; charset=utf-8",

					success : function(data) {

						Portlets_View.collection.remove(portlet);

						gridster.remove_widget($('#' + portlet.get("id"))
								.parent(), false);

						setTimeout(function() {
							gridster.$changed.attr('id', 'ui-id-'
									+ gridster.$changed.attr('data-col') + '-'
									+ gridster.$changed.attr('data-row'));
						}, 500);

						$('#' + portlet.get("id")).parent().remove();

						if ($('.gridster-portlets > div').length == 0)
							$('#no-portlets').show();

						$('#portletDeleteModal').modal('hide');

					},
					dataType : 'json'
				});

			});

	$('#dashlet_heading #tutotial_modal').off('click');
	$('#dashlet_heading').on('click', '#tutotial_modal', function(e) {
		e.preventDefault();

		$('#tutorialModal').html(getTemplate("tutorial-modal"));
		$('#tutorialModal').modal("show");
	});

	$(
			'.portlet_body #portlets-contacts-model-list > tr, #portlets-companies-model-list > tr, #portlets-contacts-email-opens-model-list > tr')
			.off();
	$('.portlet_body')
			.on(
					"click",
					'#portlets-contacts-model-list > tr, #portlets-companies-model-list > tr, #portlets-contacts-email-opens-model-list > tr',
					function(e) {
						var id = $(this).find(".data").attr("data");
						App_Contacts.navigate("contact/" + id, {
							trigger : true
						});
					});

	$('.portlet_body .email-details').off();
	$('.portlet_body').on('click', '.email-details', function(e) {
		e.preventDefault();
		var data = $(this).closest('a').attr("data");

		portlet_utility.getActivityObject(data, function(resp) {

			console.log(resp);
			getTemplate("infoModal", resp, undefined, function(template_ui) {
				if (!template_ui)
					return;

				var emailinfo = $(template_ui);
				emailinfo.modal('show');
			}, null);
		});
	});

	$('.portlet_body .activity-event-edit').off();
	$('.portlet_body').on('click', '.activity-event-edit', function(e) {
		e.preventDefault();
		var data = $(this).closest('a').attr("data");

		getEventObject(data, function(resp) {
			update_event_activity(resp);
		});

	});

	$('.portlet_body').on(
			"click",
			'#portlets-opportunities-model-list > tr',
			function(e) {

				/*
				 * if(e.target.attributes[0].name!="href"){ e.preventDefault();
				 * App_Portlets.currentPosition =
				 * ''+$(this).parents('.gs-w').find('.column_position').text().trim()+''+$(this).parents('.gs-w').find('.row_position').text().trim();
				 * updateDeal($(this).data()); }
				 */
				var hrefFlag = false;
				if (e.target.attributes != undefined
						&& e.target.attributes != null
						&& e.target.attributes.length == 0)
					hrefFlag = true;
				$.each(e.target.attributes, function() {
					if (this.name == "href")
						hrefFlag = true;
				});

				if (!hrefFlag) {

					// code for navigating deal details page
					var id = $(this).find(".data").attr("data");
					App_Deal_Details.navigate("deal/" + id, {
						trigger : true
					});
				}
			});

	$('.portlet_body')
			.on(
					"click",
					'#portlets-events-model-list > tr',
					function(e) {

						var hrefFlag = false;
						if (e.target.attributes
								&& e.target.attributes.length == 0)
							hrefFlag = true;
						$.each(e.target.attributes, function() {
							if (this.name == "href")
								hrefFlag = true;
						});

						$("#updateActivityModal").html(getTemplate("update-activity-modal"));
						if (!hrefFlag) {

							App_Portlets.currentPosition = ''
									+ $(this).parents('.gs-w').find(
											'.column_position').text().trim()
									+ ''
									+ $(this).parents('.gs-w').find(
											'.row_position').text().trim();
							var id = $(this).find(".data").attr("data");
							var model = $(this).data().collection.get(id);
							if (isNaN(id))
								return;

							// Deserialize
							deserializeForm(model.toJSON(),
									$("#updateActivityForm"));

							var startDate = new Date(model.get('start') * 1000);
							var endDate = new Date(model.get('end') * 1000)
							// Set time for update Event
							$('#update-event-time-1')
									.val(
											(startDate.getHours() < 10 ? "0"
													: "")
													+ startDate.getHours()
													+ ":"
													+ (startDate.getMinutes() < 10 ? "0"
															: "")
													+ startDate.getMinutes());
							$('#update-event-time-2').val(
									(endDate.getHours() < 10 ? "0" : "")
											+ endDate.getHours()
											+ ":"
											+ (endDate.getMinutes() < 10 ? "0"
													: "")
											+ endDate.getMinutes());

							// Set date for update Event
							var dateFormat = CURRENT_USER_PREFS.dateFormat;
							$("#update-event-date-1").val(
									startDate.format(dateFormat));
							$("#update-event-date-2").val(
									endDate.format(dateFormat));

							// Hide end date & time for all day events
							if (model.toJSON().allDay) {
								$("#update-event-date-2").closest('.row')
										.hide();
								$('#update-event-time-1').closest(
										'.control-group').hide();
							} else {
								$('#update-event-time-1').closest(
										'.control-group').show();
								$("#update-event-date-2").closest('.row')
										.show();
							}

							if (model.toJSON().type == "WEB_APPOINTMENT"
									&& parseInt(model.toJSON().start) > parseInt(new Date()
											.getTime() / 1000)) {
								$("[id='event_delete']").attr("id",
										"delete_web_event");
								web_event_title = model.toJSON().title;
								if (model.toJSON().contacts.length > 0) {
									var firstname = getPropertyValue(model
											.toJSON().contacts[0].properties,
											"first_name");
									if (firstname == undefined)
										firstname = "";
									var lastname = getPropertyValue(model
											.toJSON().contacts[0].properties,
											"last_name");
									if (lastname == undefined)
										lastname = "";
									web_event_contact_name = firstname + " "
											+ lastname;
								}
							} else {
								$("[id='delete_web_event']").attr("id",
										"event_delete");
							}

							// Fills owner select element
							populateUsersInUpdateActivityModal(model.toJSON());
							if (model.toJSON().description) {
								var description = '<label class="control-label"><b>Description </b></label><div class="controls"><textarea id="description" name="description" rows="3" class="input form-control" placeholder="Add Description"></textarea></div>'
								$("#event_desc").html(description);
								$("textarea#description").val(
										model.toJSON().description);
							} else {
								var desc = '<div class="row-fluid">'
										+ '<div class="control-group form-group m-b-none">'
										+ '<a href="#" id="add_event_desctiption"><i class="icon-plus"></i> Add Description </a>'
										+ '<div class="controls event_discription hide">'
										+ '<textarea id="description" name="description" rows="3" class="input form-control w-full col-md-8" placeholder="Add Description"></textarea>'
										+ '</div></div></div>'
								$("#event_desc").html(desc);
							}

							// Show edit modal for the event
							$("#updateActivityModal").modal('show');
							return false;
						}
					});

	$('.portlet_body').on(
			"click",
			'#portlets-tasks-model-list > tr',
			function(e) {

				var hrefFlag = false;
				if (e.target.tagName.toLowerCase() == "a"
						|| e.target.tagName.toLowerCase() == "i"
						|| e.target.tagName.toLowerCase() == "input")
					hrefFlag = true;
				/*
				 * if(e.target.tagName.toLowerCase()=="a") hrefFlag = true;
				 */
				$.each(e.target.attributes, function() {
					if (this.name == "href")
						hrefFlag = true;
				});

				if (!hrefFlag) {
					var id = $(this).find(".data").attr("data");
					App_Tasks.navigate("task/" + id, {
						trigger : true
					});
				}
			});

	$('.gridster-portlets')
			.on(
					"click",
					'.portlets-tasks-select',
					function(e) {

						e.stopPropagation();
						if ($(this).is(':checked')) {

							// Complete
							var taskId = $(this).attr('data');

							var column_pos = $(this).parentsUntil('.gs-w')
									.last().parent().find('.column_position')
									.text().trim();
							var row_pos = $(this).parentsUntil('.gs-w').last()
									.parent().find('.row_position').text()
									.trim();
							var pos = column_pos + '' + row_pos;

							complete_task(
									taskId,
									App_Portlets.tasksCollection[parseInt(pos)].collection,
									$(this).closest('tr'));

							if ($(this).parentsUntil('table').last().find(
									'tr:visible').length == 1) {
								$(this)
										.parentsUntil('table')
										.parent()
										.parent()
										.html(
												'<div class="portlet-error-message">No tasks found.</div>');
							}
						}
					});

	$('.gridster-portlets').on("click", '.portlet-settings', function(e) {
		e.preventDefault();

		portlet_utility.showPortletSettings(this.id);
	});

}

/** 
 *Listener function for Event handling
 */
function initializeAddPortletsListeners() {

	$('.col-md-3')
			.on(
					"mouseenter",
					'.show_screeshot',
					function(e) {

						var p_name = $(this).attr('id');
						var image;
						var placement = "right";
						var image_url_json = {
							"FilterBased" : "img/dashboard_images/My-contacts.png",
							"EmailsOpened" : "img/dashboard_images/Email-opened.png",
							"GrowthGraph" : "img/dashboard_images/Tag-Graph.png",
							"PendingDeals" : "img/dashboard_images/Pending-Deals.png",
							"DealsByMilestone" : "img/dashboard_images/Milestone.png",
							"DealsFunnel" : "img/dashboard_images/Deals-Funnel.png",
							"Agenda" : "img/dashboard_images/Events.png",
							"TodayTasks" : "img/dashboard_images/Task.png",
							"CallsPerPerson" : "img/dashboard_images/Calls.png",
							"AgileCRMBlog" : "img/dashboard_images/Agile-Blog.png",
							"TaskReport" : "img/dashboard_images/Task-report.png",
							"StatsReport" : "img/dashboard_images/stats.png",
							"Leaderboard" : "img/dashboard_images/Leaderboard.png",
							"RevenueGraph" : "img/dashboard_images/Revenue-graph.png",
							"AccountDetails" : "img/dashboard_images/account-information.png",
							"MiniCalendar" : "img/dashboard_images/Mini-Calendar.jpg",
							"UserActivities" : "img/dashboard_images/User-Activities.png",
							"Campaignstats" : "img/dashboard_images/Campaign-stats.jpg"
						};
						var placements_json = {
							"GrowthGraph" : "left",
							"DealsFunnel" : "left",
							"CallsPerPerson" : "left",
							"TaskReport" : "left",
							"RevenueGraph" : "left",
							"MiniCalendar" : "left",
							"UserActivities" : "left",
							"Campaignstats" : ""
						};
						if (placements_json[p_name]) {
							placement = "left";
						}

						$(this).popover(
								{
									"rel" : "popover",
									"trigger" : "hover",
									"placement" : placement,
									"html" : "true",
									"content" : function() {
										return '<img src='
												+ image_url_json[p_name] + '>';

									}
								});
						$(this).popover('show');
					});

	$('#portlets-add-listener').on(
			"click",
			'.add-portlet',
			function() {

				var portlet_type = $(this).attr("portlet_type");
				var p_name = $(this).attr("portlet_name");

				var json = portlet_utility.getDefaultPortletSettings(
						portlet_type, p_name);

				var obj = {};
				obj.name = p_name;
				var curDate = new Date();
				obj.portlet_type = portlet_type;
				var max_row_position = 0;
				var next_position = gridster.next_position(1, 1);
				obj.column_position = next_position.col;
				obj.row_position = next_position.row;
				obj.size_x = next_position.size_x;
				obj.size_y = next_position.size_y;

				if (portlet_type == "RSS" && p_name == "Agile CRM Blog")
					obj.size_y = 2;

				else if (portlet_type == "USERACTIVITY"
						&& p_name == "Leaderboard") {
					obj.size_y = 2;
					obj.size_x = 2;
				}

				var portlet = new BaseModel();
				portlet.url = 'core/api/portlets/addPortlet';
				portlet.set({
					"prefs" : JSON.stringify(json)
				}, {
					silent : true
				});
				var model;
				var scrollPosition;
				portlet.save(obj, {
					success : function(data) {
						model = new BaseModel(data.toJSON());
						if ($('#zero-portlets').is(':visible'))
							$('#zero-portlets').hide();
						if ($('#no-portlets').is(':visible'))
							$('#no-portlets').hide();
						App_Portlets.navigate("dashboard", {
							trigger : true
						});
					},
					error : function(model, response) {
						alert("Failed to add.");
					}
				});
			});

}