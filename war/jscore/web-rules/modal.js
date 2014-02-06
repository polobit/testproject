// Global variables
var _agile_contact; // Agile contact object
var _agile_webrules; // Array of agile web rule objects

// Rules object with methods, to verify the conditions
var rules = {

	// To check if tags are equal
	tags_in : function(webrules, _agile_contact) {
		if (webrules.tags_in && _agile_contact) {
			var flag = 0;
			var i = webrules.tags_in.length;
			var j = _agile_contact.tags.length;
			if (i <= j) {
				for ( var k = 0; k < i; k++) {
					for ( var l = 0; l < j; l++) {

						// Check if tags from webrules match with contact tags
						if (webrules.tags_in[k] === _agile_contact.tags[l]) {
							flag++;
						}
					}
				}
			}
			if (flag == i && flag !== 0 && i !== 0)
				return true;
		}
	},

	// To check if tags are not equal
	tags_out : function(webrules, _agile_contact) {
		if (_agile_contact && webrules.tags_out) {
			var count = 0;
			var i = webrules.tags_out.length;
			var j = _agile_contact.tags.length;
			for ( var k = 0; k < i; k++) {
				for ( var l = 0; l < j; l++) {

					// Check if tags from webrules match contact tags
					if (_agile_contact.tags[l] !== webrules.tags_out[k]) {
						count++;
					}
				}
			}
			if (count == i * j && count !== 0 && i !== 0 && j !== 0)
				return true;
		}
	},

	// To check if tags match and verify time conditions like tags created
	// after, before, in the last specified days
	tags_time : function(webrules, _agile_contact) {
		if (webrules.tags_time && _agile_contact) {
			var f = 0;
			var i = webrules.tags_time.tags.length;
			var j = _agile_contact.tagsWithTime.length;
			var current_time = new Date().getTime();
			if (i <= j) {
				for ( var d = 0; d < i; d++) {
					for ( var h = 0; h < j; h++) {
						if (webrules.tags_time.tags[d] == _agile_contact.tagsWithTime[h].tag) {
							if ((webrules.tags_time.condition == "LAST" && (0 <= (current_time - _agile_contact.tagsWithTime[h].createdTime) && (current_time - _agile_contact.tagsWithTime[h].createdTime) <= (webrules.tags_time.time * 86400000)))
									|| (webrules.tags_time.condition == "BEFORE" && (webrules.tags_time.time >= _agile_contact.tagsWithTime[h].createdTime))
									|| (webrules.tags_time.condition == "AFTER" && (webrules.tags_time.time <= _agile_contact.tagsWithTime[h].createdTime))
									|| (webrules.tags_time.condition == "EQUALS" && (webrules.tags_time.time <= _agile_contact.tagsWithTime[h].createdTime && _agile_contact.tagsWithTime[h].createdTime <= (webrules.tags_time.time + 86400000)))
									|| (webrules.tags_time.condition == "BETWEEN" && (webrules.tags_time.time_min <= _agile_contact.tagsWithTime[h].createdTime && _agile_contact.tagsWithTime[h].createdTime <= webrules.tags_time.time_max))) {
								f++;
							}
						}
					}
				}
			}
			if (f == i && f !== 0 && i !== 0)
				return true;
		}
	},

	// To check if score greater than min_score
	min_score : function(webrules, _agile_contact) {
		if (_agile_contact && webrules.min_score
				&& _agile_contact.lead_score >= webrules.min_score)
			return true;
	},

	// To check if score less than max_score
	max_score : function(webrules, _agile_contact) {
		if (_agile_contact && webrules.max_score
				&& _agile_contact.lead_score <= webrules.max_score)
			return true;
	},

	// To check if referrer url matches with url in webrules
	referrer_is : function(anon_webrules) {
		if (anon_webrules.referrer_is === document.referrer)
			return true;
	},

	// To check if referrer url matches with specified string in webrules
	referrer_matches : function(anon_webrules) {
		var url = document.referrer;
		if (url.indexOf(anon_webrules.referrer_matches) !== -1)
			return true;
	},

	// To check current page matches with given url in webrules
	page_view_is : function(anon_webrules) {
		if (anon_webrules.page_view_is === document.location.href)
			return true;
	},

	// To check if current page url matches with given string in webrules
	page_view_matches : function(anon_webrules) {
		var url = document.location.href;
		if (url.indexOf(anon_webrules.page_view_matches) !== -1)
			return true;
	},

	// To check if session is new or ongoing
	session_type : function(anon_webrules) {
		if (anon_webrules.session_type === "first")
			return agile_session.new_session;
		if (anon_webrules.session_type === "ongoing")
			return !agile_session.new_session;
	},

	// To check if visit is first visit or repeat
	visit_type : function(anon_webrules) {
		if (anon_webrules.visit_type === "repeat")
			return !agile_guid.new_guid;
		if (anon_webrules.visit_type === "first")
			return agile_guid.new_guid;
	},

	// To check if contact properties match or not
	contact_properties_in : function(webrules, _agile_contact) {
		if (_agile_contact && webrules.contact_properties_in) {
			var flag = 0;
			var l = webrules.contact_properties_in.length;
			var k = _agile_contact.properties.length;
			for ( var r = 0; r < l; r++) {
				for ( var s = 0; s < k; s++) {

					// Check if contact properties from webrules match with
					// contact properties
					if (webrules.contact_properties_in[r].name === _agile_contact.properties[s].name
							&& webrules.contact_properties_in[r].value === _agile_contact.properties[s].value) {
						flag++;
					}
				}
			}
			if (flag == l && flag !== 0 && l !== 0)
				return true;
		}
	},

	// To check if contact properties do not match
	contact_properties_out : function(webrules, _agile_contact) {
		if (_agile_contact && webrules.contact_properties_out) {
			var count = 0;
			var l = webrules.contact_properties_out.length;
			var k = _agile_contact.properties.length;
			for ( var g = 0; g < l; g++) {
				for ( var h = 0; h < k; h++) {

					// Check if contact properties from webrules match with
					// contact properties
					if (webrules.contact_properties_out[g].name === _agile_contact.properties[h].name
							&& webrules.contact_properties_out[g].value !== _agile_contact.properties[h].value) {
						count++;
					}
				}
			}
			if (count == l && count !== 0 && l !== 0 && k !== 0)
				return true;
		}
	},

	// To check contact created time is after, before or in the last few days
	contact_time : function(webrules, _agile_contact) {
		if (_agile_contact && webrules.contact_time) {
			var current_time = new Date().getTime();
			var created_time = (_agile_contact.created_time * 1000);
			var dif = (current_time - created_time);
			if ((webrules.contact_time.condition == "LAST" && (0 <= dif && dif <= (webrules.contact_time.time * 86400000)))
					|| (webrules.contact_time.condition == "AFTER" && (webrules.contact_time.time <= created_time))
					|| (webrules.contact_time.condition == "BEFORE" && (webrules.contact_time.time >= created_time))
					|| (webrules.contact_time.condition == "ON" && (webrules.contact_time.time <= created_time && created_time <= (86400000 + webrules.contact_time.time)))
					|| (webrules.contact_time.condition == "BETWEEN" && (webrules.contact_time.time_min <= created_time && created_time <= webrules.contact_time.time_max)))
				return true;
		}
	}
};

// Modal API function to show modal

function show_modal(modal_data, modal_options, modal_callback) {

	var SM = new SimpleModal(modal_options);
	SM.addButton("Ok", "simple_modal_btn primary", function() {

		// Callback for confirm action of modal
		if (modal_options.form_id && (document.id(modal_options.form_id))) {
			var contact = {};
			var collection = document.id('modal-form');
			for ( var i = 0; i < collection.length; i++) {
				if (collection[i].name.toLowerCase() == "firstname"
						|| collection[i].name.toLowerCase() == "first_name"
						|| collection[i].name.toLowerCase() == "first name"
						|| collection[i].name.toLowerCase() == "name"
						|| collection[i].name.toLowerCase() == "first") {
					contact.first_name = collection[i].value;
				}
				if (collection[i].name.toLowerCase() == "lastname"
						|| collection[i].name.toLowerCase() == "last_name"
						|| collection[i].name.toLowerCase() == "last name"
						|| collection[i].name.toLowerCase() == "last") {
					contact.last_name = collection[i].value;
				}
				if (collection[i].name.toLowerCase().indexOf("email") != -1) {
					contact.email = collection[i].value;
				}
			}
			_agile.create_contact(contact, {
				success : function(data) {
					_agile.set_email(contact.email);
					_agile.add_tag('signup', {
						success : function() {
							console.log("tag added")
						},
						error : function() {
							console.log("error");
						}
					});
					console.log("success");
				},
				error : function(data) {
					console.log("error");
				}
			});
		}
		this.hide();
	});

	// If modal is type confirmation adding cancel button
	if (modal_options.show_btn_cancel) {
		SM.addButton("Cancel", "simple_modal_btn");
	}

	// Assign modal type, title, contents, callback

	SM.show({
		"model" : "modal",
		"title" : modal_data.title,
		"contents" : function() {
			if (modal_options.form_id && (document.id(modal_options.form_id)))
				return '<form id=modal-form>'
						+ document.id(modal_options.form_id).innerHTML
						+ '</form>';
			else
				return modal_data.contents;
		},
	});
}

// Noty API function to show noty

function show_noty(noty_data, noty_options, noty_callback) {
	head.js("lib/noty/jquery.noty.js", "/lib/noty/layouts/" + noty_options.position+".js",
			"lib/noty/themes/default-custom.js", function() {
					
				// Format noty_callback to noty API
				var call_back = {};
				if (noty_callback && typeof (noty_callback) === "function")
					call_back.onClose = noty_callback;

				// Assign noty text, type, theme, callback etc
				var n = noty({
					text : noty_data,
					
					type : noty_options.type,
					dismissQueue : noty_options.dismiss_queue,
					layout : noty_options.position,
					theme : noty_options.theme,
					callback : call_back,
					timeout : 2000
				});
			});
}

function execute_action(modal_data, modal_options, modal_callback, noty_data,
		noty_options, noty_callback, add_campaign_id, rm_campaign_id,
		add_score, rm_score, add_tags, rm_tags, email) {
	// If webrule action is modal
	if (modal_options.btn_ok) {
		show_modal(modal_data, modal_options, modal_callback);
	}

	// If webrule action is noty
	if (noty_options.type) {
		show_noty(noty_data, noty_options, noty_callback);
	}

	// If webrule action is add campaign
	if (add_campaign_id.length !== 0 && email) {
		for ( var u = 0; u < add_campaign_id.length; u++) {
			_agile.add_campaign({
				"id" : add_campaign_id[u]
			}, {
				success : function() {
					console.log("campaign assigned");
				},
				error : function() {
					console.log("error in assigning campaign");
				}
			}, email);
		}
	}

	// If webrule is to add tag
	if (add_tags.length !== 0 && email)
		_agile.add_tag(add_tags.toString(), {
			success : function() {
				console.log("tags added");
			},
			error : function() {
				console.log("failed to add tags");
			}
		}, email);

	// If webrule is to add score
	if (add_score && email)
		_agile.add_score(add_score, {
			success : function() {
				console.log("score added");
			},
			error : function() {
				console.log("failed to add score");
			}
		}, email);

	// If webrule action is unsubscribe campaign
	if (rm_campaign_id.length !== 0 && email) {
		for ( var v = 0; v < rm_campaign_id.length; v++) {
			_agile.unsubscribe_campaign({
				"id" : rm_campaign_id[v]
			}, {
				success : function() {
					console.log("unsubscribed");
				},
				error : function() {
					console.log("error in unsubscribing");
				}
			}, email);
		}
	}

	// If webrule is to remove score
	if (rm_score && email)
		_agile.add_score(rm_score, {
			success : function() {
				console.log("score");
			},
			error : function() {
				console.log("failed to subtract score");
			}
		}, email);

	// If webrule is to remove tags
	if (rm_tags.length !== 0 && email)
		_agile.remove_tag(rm_tags.toString(), {
			success : function() {
				console.log("tags removed");
			},
			error : function() {
				console.log("failed to remove tags");
			}
		}, email);
}

// Function to check if all conditions in a single webrule object are true,
// if yes call API (modal and/or noty and/or add-campaign)

function perform_action(anon_webrules, webrules, modal_data, modal_options,
		modal_callback, noty_data, noty_options, noty_callback,
		add_campaign_id, rm_campaign_id, add_score, rm_score, add_tags, rm_tags) {
	var len = 0; // Length of anon_webrules
	var _counter = 0; // Counter for satisfied anon_webrules
	var t = 0; // Webrules length

	// Get number of webrules
	for ( var j in webrules) {
		if (webrules.hasOwnProperty(j))
			t++;
	}

	// Check if all anonymous conditions are true
	for ( var anon_rule in anon_webrules) {
		len++;
		if (anon_webrules.hasOwnProperty(anon_rule)
				&& rules[anon_rule](anon_webrules)) {
			_counter++;
		}
	}
	var email; // Agile contact email

	// Get email from cookie
	agile_getEmail({
		success : function(data) {
			email = data.email;

			if (email == "null" || email == undefined) {
				if (t == 0) {
					if (len == _counter && len !== 0 && _counter !== 0) {
						execute_action(modal_data, modal_options,
								modal_callback, noty_data, noty_options,
								noty_callback, add_campaign_id, rm_campaign_id,
								add_score, rm_score, add_tags, rm_tags);
					}
				}
			} else if (email) {
				_agile
						.get_contact(
								email,
								{
									success : function(data) {
										_agile_contact = data;
										var counter = 0;
										for ( var rule in webrules) {
											if (webrules.hasOwnProperty(rule)
													&& rules[rule](webrules,
															_agile_contact)) {
												counter++;
											}
										}

										if ((t == 0 && len !== 0 && len == _counter)
												|| (t !== 0 && t == counter && len == 0)
												|| (t != 0 && t == counter
														&& len == _counter && len !== 0)) {
											execute_action(modal_data,
													modal_options,
													modal_callback, noty_data,
													noty_options,
													noty_callback,
													add_campaign_id,
													rm_campaign_id, add_score,
													rm_score, add_tags,
													rm_tags, email);
										}
									},
									error : function() {
										if (t == 0 && len !== 0
												&& len == _counter) {
											execute_action(modal_data,
													modal_options,
													modal_callback, noty_data,
													noty_options,
													noty_callback,
													add_campaign_id,
													rm_campaign_id, add_score,
													rm_score, add_tags, rm_tags);
										}
									}
								});
			}
		}
	});
}

// Webrule API to get array of webrule objects (if multiple webrules defined)
// from agile,
// iterate, and build webrule actions, condition

function execute_webrules() {

	setTimeout(
			function() {
				_agile
						.web_rules({
							success : function(data) {

								// Build webrules
								var r = _agile_webrules[i].rules.length;
								for ( var s = 0; s < r; s++) {

									if (_agile_webrules[i].rules[s].LHS == "tags") {
										if (_agile_webrules[i].rules[s].CONDITION == "EQUALS")
											webrules.tags_in = _agile_webrules[i].rules[s].RHS
													.replace(', ', ',').split(
															',');
										if (_agile_webrules[i].rules[s].CONDITION == "NOTEQUALS")
											webrules.tags_out = _agile_webrules[i].rules[s].RHS
													.replace(', ', ',').split(
															',');
									}
									if (_agile_webrules[i].rules[s].LHS == "page") {
										if (_agile_webrules[i].rules[s].CONDITION == "EQUALS")
											anon_webrules.page_view_is = _agile_webrules[i].rules[s].RHS;
										if (_agile_webrules[i].rules[s].CONDITION == "MATCHES")
											anon_webrules.page_view_matches = _agile_webrules[i].rules[s].RHS;
									}
									if (_agile_webrules[i].rules[s].LHS == "visit") {
										if (_agile_webrules[i].rules[s].CONDITION == "FIRST_TIME")
											anon_webrules.visit_type = "first";
										if (_agile_webrules[i].rules[s].CONDITION == "REPEAT")
											anon_webrules.visit_type = "repeat";
									}
									if (_agile_webrules[i].rules[s].LHS == "referrer") {
										if (_agile_webrules[i].rules[s].CONDITION == "EQUALS")
											anon_webrules.referrer_is = _agile_webrules[i].rules[s].RHS;
										if (_agile_webrules[i].rules[s].CONDITION == "MATCHES")
											anon_webrules.referrer_matches = _agile_webrules[i].rules[s].RHS;
									}
									if (_agile_webrules[i].rules[s].LHS == "tags_time"
											&& _agile_webrules[i].rules[s].CONDITION == "EQUALS") {
										webrules.tags_time = {};
										if (_agile_webrules[i].rules[s].nested_condition == "BETWEEN") {
											webrules.tags_time["tags"] = _agile_webrules[i].rules[s].RHS
													.replace(', ', ',').split(
															',');
											webrules.tags_time["time_min"] = _agile_webrules[i].rules[s].nested_lhs;
											webrules.tags_time["time_max"] = _agile_webrules[i].rules[s].nested_rhs;
											webrules.tags_time["condition"] = _agile_webrules[i].rules[s].nested_condition;
										}
										if (_agile_webrules[i].rules[s].nested_condition == "BEFORE"
												|| _agile_webrules[i].rules[s].nested_condition == "AFTER"
												|| _agile_webrules[i].rules[s].nested_condition == "EQUALS"
												|| _agile_webrules[i].rules[s].nested_condition == "NEXT"
												|| _agile_webrules[i].rules[s].nested_condition == "LAST") {
											webrules.tags_time["tags"] = _agile_webrules[i].rules[s].RHS
													.replace(', ', ',').split(
															',');
											webrules.tags_time["time"] = _agile_webrules[i].rules[s].nested_lhs;
											webrules.tags_time["condition"] = _agile_webrules[i].rules[s].nested_condition;
										}
									}
									if (_agile_webrules[i].rules[s].LHS == "created_time") {
										webrules.contact_time = {};
										if (_agile_webrules[i].rules[s].CONDITION == "BEFORE"
												|| _agile_webrules[i].rules[s].CONDITION == "AFTER"
												|| _agile_webrules[i].rules[s].CONDITION == "ON"
												|| _agile_webrules[i].rules[s].CONDITION == "LAST"
												|| _agile_webrules[i].rules[s].CONDITION == "NEXT") {
											webrules.contact_time["time"] = _agile_webrules[i].rules[s].RHS;
											webrules.contact_time["condition"] = _agile_webrules[i].rules[s].CONDITION;
										}
										if (_agile_webrules[i].rules[s].CONDITION == "BETWEEN") {
											webrules.contact_time["time_max"] = _agile_webrules[i].rules[s].RHS_NEW;
											webrules.contact_time["time_min"] = _agile_webrules[i].rules[s].RHS;
											webrules.contact_time["condition"] = _agile_webrules[i].rules[s].CONDITION;
										}
									}
									if (_agile_webrules[i].rules[s].LHS == "title"
											|| _agile_webrules[i].rules[s].LHS == "company"
											|| _agile_webrules[i].rules[s].LHS == "owner_id") {
										var property_json = {};
										property_json.name = _agile_webrules[i].rules[s].LHS;
										property_json.value = _agile_webrules[i].rules[s].RHS;
										if (_agile_webrules[i].rules[s].CONDITION == "EQUALS") {
											if (!webrules.contact_properties_in)
												webrules.contact_properties_in = [];
											webrules.contact_properties_in
													.push(property_json);
										}
										if (_agile_webrules[i].rules[s].CONDITION == "NOTEQUALS") {
											if (!webrules.contact_properties_out)
												webrules.contact_properties_out = [];
											webrules.contact_properties_out
													.push(property_json);
										}
									}
								}

								perform_actions(data);
							},
							error : function() {
								console.log("error");
							}
						});
			}, 150);
}

function perform_actions(data, validate) {

	// Agile API to get array of webrule objects from datastore
	_agile_webrules = data;
	console.log(_agile_webrules);
	var l = _agile_webrules.length;

	// Iterate array of webrule objects and build rules, options, modal/noty
	// content etc
	// Each webrule object has three main parts webrule conditions, webrule
	// actions, data (title / content)
	for ( var i = 0; i < l; i++) {

		var webrules = {}; // Webrule object
		var anon_webrules = {}; // Webrules object for anonymous visitor
		var modal_data = {}; // Modal data
		var modal_options = {}; // Modal options
		var modal_callback; // Modal callback
		var noty_callback; // Noty callback
		var noty_data = {}; // Noty data
		var noty_options = {}; // Noty options
		var add_campaign_id = []; // Workflow id
		var rm_campaign_id = []; // Workflow id
		var add_tags = []; // Tags array to add
		var rm_tags = []; // Tags array to remove
		var add_score; // Score to add
		var rm_score // Score to remove

		// Build webrule actions
		console.log(_agile_webrules[i]);
		var u = _agile_webrules[i].actions.length;
		console.log()
		console.log(u);
		console.log(data);
		for ( var t = 0; t < u; t++) {

			console.log(_agile_webrules[i].actions[t]);

			// If webrule action is modal
			if (_agile_webrules[i].actions[t].action == "MODAL_POPUP") {

				// If modal is of type confirmation
				if (_agile_webrules[i].actions[t].popup_pattern == "confirmation") {
					modal_options.show_btn_cancel = true;
					modal_data.title = _agile_webrules[i].actions[t].title;
					modal_data.contents = _agile_webrules[i].actions[t].popup_text;
				}

				// If modal is of type information
				if (_agile_webrules[i].actions[t].popup_pattern == "information") {
					modal_options.show_btn_cancel = false;
					modal_data.title = _agile_webrules[i].actions[t].title;
					modal_data.contents = _agile_webrules[i].actions[t].popup_text;
					modal_options.hideHeader = false;
				}

				// If modal is of type form
				if (_agile_webrules[i].actions[t].popup_pattern == "form") {
					modal_options.form_id = _agile_webrules[i].actions[t].title;
					modal_options.hideHeader = true;
					modal_options.show_btn_cancel = true;
				}

				// If modal is of type custom_html
				if (_agile_webrules[i].actions[t].popup_pattern == "custom_html") {
					var e = document.createElement('div');
		        	e.innerHTML = _agile_webrules[i].actions[t].popup_text;
		        	var data = e.childNodes[0].nodeValue;
		        	if(data)
		        	    modal_data.contents = data;
		        	else modal_data.contents = e.innerHTML;
		            modal_options.hideHeader = true;
		            modal_options.hideFooter = true;
				}

				// Build options for webrule action (modal) right now hardcoded
				// as no option from UI
				modal_options.btn_ok = 'Subscribe';
				modal_options.btn_cancel = 'Cancel';
				modal_options.width = 275;
				modal_options.overlayOpacity = 0.6;
				modal_options.onAppend = function() {
					document.id('simple-modal').fade('hide');
					setTimeout((function() {
						document.id('simple-modal').fade('show')
					}), 200);
					var tw = new Fx.Tween(document.id('simple-modal'), {
						duration : 0,
						//transition : 'bounce:out',
						link : 'cancel',
						property : 'top'
					}).start(-400, 150)
				};
				modal_callback = function() {
					test('this_is_modal_callback');
				}
			}

			console.log(_agile_webrules[i].actions[t].action);
			// If webrule action is noty and type is custom_html
			if (_agile_webrules[i].actions[t].action == "CORNER_NOTY"
					&& _agile_webrules[i].actions[t].popup_pattern == "information") {

				if (_agile_webrules[i].actions[t].position == "RIGHT_BOTTOM")
					noty_options.position = "bottomRight";
				if (_agile_webrules[i].actions[t].position == "RIGHT_TOP")
					noty_options.position = "topRight";
				if (_agile_webrules[i].actions[t].position == "LEFT_BOTTOM")
					noty_options.position = "bottomLeft";
				if (_agile_webrules[i].actions[t].position == "LEFT_TOP")
					noty_options.position = "topLeft";
				if (_agile_webrules[i].actions[t].position == "TOP")
					noty_options.position = "top";
				if (_agile_webrules[i].actions[t].position == "BOTTOM")
					noty_options.position = "bottom";

				noty_data = _agile_webrules[i].actions[t].popup_text;
				noty_options.theme = 'defaultTheme';
				noty_options.dismiss_queue = 'true';
				noty_options.type = "information";
				noty_callback = function() {
					test('this_is_noty_callback');
				}
			}

			// If webrule action is campaign
			if (_agile_webrules[i].actions[t].action == "ASSIGN_CAMPAIGN")
				add_campaign_id.push(_agile_webrules[i].actions[t].RHS);
			if (_agile_webrules[i].actions[t].action == "UNSUBSCRIBE_CAMPAIGN")
				rm_campaign_id.push(_agile_webrules[i].actions[t].RHS);

			// If webrule action is tag
			if (_agile_webrules[i].actions[t].action == "ADD_TAG")
				add_tags.push(_agile_webrules[i].actions[t].popup_pattern);
			if (_agile_webrules[i].actions[t].action == "REMOVE_TAG")
				rm_tags.push(_agile_webrules[i].actions[t].popup_pattern);

			// If webrule action is score
			if (_agile_webrules[i].actions[t].action == "ADD_SCORE")
				add_score = _agile_webrules[i].actions[t].popup_pattern;
			if (_agile_webrules[i].actions[t].action == "SUBTRACT_SCORE")
				rm_score = _agile_webrules[i].actions[t].popup_pattern;
		}

		if (!validate) {
			execute_action(modal_data, modal_options, modal_callback,
					noty_data, noty_options, noty_callback, add_campaign_id,
					rm_campaign_id, add_score, rm_score, add_tags, rm_tags)
			return;
		}
		// Call to method to check all conditions in a webrule are true and
		// perform action
		perform_action(anon_webrules, webrules, modal_data, modal_options,
				modal_callback, noty_data, noty_options, noty_callback,
				add_campaign_id, rm_campaign_id, add_score, rm_score, add_tags,
				rm_tags);
	}

}

// Test callback

function test(k) {
	console.log(k);
}
