// To Enable Console in IE - MC
$(function(){
	var alertFallback = false;
	
	if (typeof console === "undefined" || typeof console.log === "undefined") {
		console = {};
		if (alertFallback) {
			console.log = function(msg) {
            alert(msg);
         };
		} else {
         console.log = function() {};
		}
	}
	
	// Disable console.logging if disabled
	if(!IS_CONSOLE_ENABLED)
	{
		//console.log("disabling");		
		console.log = function(){};
	}
});   

function gmap_date_range(el, callback){
	

		// Bootstrap date range picker.
		$('#gmap_date_range', el).daterangepicker({ ranges : { 'Today' : [
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
		] } }, function(start, end)
		{
			$('#gmap_date_range span').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));
			gmap_search_by_date($('#gmap_date_range span').text());
		});
		
		if(callback && typeof(callback) == "function"){
			callback();
		}
}

function gmap_search_by_date(DateRange){
	console.clear();
	console.log(DateRange);
	
//	var User_Domain = agile_id.getNamespace();
	var User_Domain = "our";
	var options = "&";
	
	// Get Date Range
	var range = DateRange.split("-");

	// Returns milliseconds from start date. For e.g., August 6, 2013 converts
	// to 1375727400000
	var start_date = Date.parse($.trim(range[0])).valueOf();

	// Returns milliseconds from end date.
	var end_date = Date.parse($.trim(range[1])).valueOf();
	
	// Adds start_time, end_time and timezone offset to params.
	options += ("start_date=" + start_date + "&end_date=" + end_date);

	// Add Timezone offset
	var d = new Date();
	options += ("&time_zone=" + d.getTimezoneOffset());

	var DateRangeUrl = "core/api/gmap/daterange?user_domain=" + encodeURIComponent(User_Domain) + options;
	
	console.log("url: " + DateRangeUrl);
	
	$("#map-tab-waiting").fadeIn();
	$.getJSON( DateRangeUrl, function( Response ) {
	    
		console.log("Response: ", Response);
		$("#map-tab-waiting").fadeOut();
		if(Response != null) {
			for(var Key in Response){
				Response[Key].z_index = parseInt(Key);
			}
			gmap_add_marker(Response);
			gmap_create_table_view("", Response);
		}
		
		else {
			console.log("No recent visitors available for this date range.")
		}
	});
}


/**
	Creates a new marker and info window.
	Applies a click listener on marker.
*/ 		

function gmap_add_marker(Locations){
  
	gmap_delete_marker();
	
	for (var Loop in Locations) {
	
		var User_Location = (Locations[Loop].city_lat_long).split(",");
	
		var My_Lat_Lng = new google.maps.LatLng(User_Location[0], User_Location[1]);
		var Gmap_Marker = new google.maps.Marker({
			position: My_Lat_Lng,
			map: window.map,
			zIndex: Locations[Loop].z_index
		});
		
		window.gmap_marker_list.push(Gmap_Marker);
	}
	map.setZoom(2);
  // apply marker to map object.
//  marker.setMap(map);
}

function gmap_set_map(map){
	for(var Loop=0; Loop < window.gmap_marker_list.length; Loop++){
		window.gmap_marker_list[Loop].setMap(map);
	}
}

function gmap_delete_marker(){
	gmap_set_map(null);
	window.gmap_marker_list = [];
}
		
function gmap_initialize(el)
		{
			console.log("Map API has been loaded.");
			// Enable the visual refresh
			google.maps.visualRefresh = true;
			
			var mapProp = {
				center:new google.maps.LatLng(39.0000, 22.0000),
				zoom:7,
				mapTypeId:google.maps.MapTypeId.ROADMAP
			};
			
			window.map=new google.maps.Map(document.getElementById("google_map"),mapProp);
			window.gmap_marker_list = [];
			
			gmap_date_range(el, function(){
				gmap_search_by_date($('#gmap_date_range span').text());
			});
//			if(window.map != undefined){
//				document.getElementById("add_marker").disabled = false;
//			}
		}
		
// DOM listener to call initialize function after window load.
//google.maps.event.addDomListener(window, 'load', initialize);

// another way of calling initialize function and loading Google Maps API script.
function gmap_load_script(el)
{
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "https://maps.google.com/maps/api/js?sensor=false&callback=gmap_initialize";
	document.body.appendChild(script);
}
	
		

function gmap_create_table_view(Search_Url, Searched_Data){
	
	this.gmapContactsListView = new Base_Collection_View({ 
		url : Search_Url,	// ""
		data : Searched_Data, // 
		templateKey : "gmap-table", 
		individual_tag_name : "tr",
		cursor : false, page_size : 25, 
		sort_collection : false, 
		postRenderCallback : function(el)
		{
			console.log("post callback");
		} });

	$('#gmap-table-view').html(this.gmapContactsListView.render(true).el);
}
function chainWebRules(el, data, isNew, actions)
{
	var element_clone = $(el).clone();
	
	$("#campaign-actions", el).chained($("#action", el), function(){
	});
	$("#action-details", el).chained($("#action", el),  function(){
	});
	$("#WEB_RULE_RHS", el).chained($("#action", el), function(el, self){

		var select = $('select', $(self));
		
		if(data)
			{
				$.each(data, function(index, action){
					if(action.action == "ASSIGN_CAMPAIGN")
					{
						$(select).find('option[value='+ action.RHS +']').attr("selected", "selected");
						return false;
					}
				});	
			}
		
		// Enable tags typeahead if tags field is available 
		var element = $(".tags", self);
		if(element.length > 0)
			addTagsDefaultTypeahead(self);
		
	});
	$("#campaign", el).chained($("#action", el));
	
	$("#possition", el).chained($("#action", el));

	
	$("#timer", el).chained($("#delay", el));
	$("#delay", el).chained($("#action", el));
	
	$("#noty-message", el).chained($("#action", el), function(select, self){
		var value = $("select", select).val();
		$(self).show();
		console.log(value);
	
		if(value == "MODAL_POPUP" || value == "CORNER_NOTY")
			{
				if(value == "MODAL_POPUP")
				$("#tiny_mce_webrules_link", self).show();
				self.find(".web-rule-preview").show();
			return;
			}
		self.find(".web-rule-preview").hide();
	});
	
	if(data && data.actions)
		deserializeChainedSelect1($(el).find('form'), data.actions, element_clone, data.actions[0]);
	
	scramble_input_names($(".reports-condition-table", element_clone))
}

function show_web_rule_action_preview(action)
{
	if(!action)
		return;
	head.js("lib/web-rule/lib/mootools-core-1.3.1.js", "lib/web-rule/lib/mootools-more-1.3.1.1.js", "lib/web-rule/simple-modal.js", function(){
		var modal_options = {};
		modal_options["show_btn_cancel"] = true;
		
		var actions = [];
		actions.push(action);
		var json = {};
		json["actions"] = actions;
		
		var actions_array = [];
		json.rules = [];
		console.log(json);
		actions_array.push(json);
		
		head.js("https://d2l6lw2yloivu1.cloudfront.net/web-grabbers/lib/head.load.min.js", "https://agilegrabbers.appspot.com/demo/appspotmodal.js", function(){
			webrules_execute(actions_array, Agile_Contact, "email", false);
		});
//		perform_actions(actions_array, false);
	});
	
	
	
	

}

$(function()
		{
			// Filter Contacts- Clone Multiple
			$(".web-rule-multiple-add").die().live('click', function(e)
			{
				e.preventDefault();
				// To solve chaining issue when cloned
				var htmlContent = $(getTemplate("webrules-add", {})).find('.webrule-actions > div').clone();
				
				//scramble_input_names($(htmlContent));

				
				chainWebRules($(htmlContent)[0], undefined, true);
				// var htmlContent = $(this).closest("tr").clone();
				$(htmlContent).find("i.webrule-multiple-remove").css("display", "inline-block");
				$(".webrule-actions").append(htmlContent);
				
			});
			
			// Filter Contacts- Remove Multiple
			$("i.webrule-multiple-remove").die().live('click', function(e)
			{
				$(this).closest(".chained-table > div").remove();
			});
			
			// Filter Contacts- Clone Multiple
			$("i.filter-contacts-web-rule-multiple-add").die().live('click', function(e)
			{
				// To solve chaining issue when cloned
				var htmlContent = $(getTemplate("webrules-add", {})).find('.web-rule-contact-condition-table tr').clone();
				scramble_input_names($(htmlContent));

				$(this).hide();
				
				chainFilters(htmlContent, undefined, undefined, true);

				// var htmlContent = $(this).closest("tr").clone();
				$(htmlContent).find("i.filter-contacts-multiple-remove").css("display", "inline-block");
				$(this).parents("tbody").append(htmlContent);
			});
			
			
			/*$("#noty-type > select").die().live('change', function(){
				console.log($(this).attr('class'));
				var isHtml = $(this).val() ? $(this).val() == 'custom_html' : false;
				if(isHtml)
					setupHTMLEditor($("#noty-message > textarea"));
			})*/
			
			
			$(".web-rule-preview").die().live('click', function(e){
				e.preventDefault();
				var that = this;
				_agile_require_js("https://agilegrabbers.appspot.com/demo/agile-webrules-min.js", function(){

					// Serializes webrule action to show preview
					var action = serializeChainedElement($(that).closest('table'));
					// Popup va'ue should be in a json object with key value, as it is returned that way from server text field
					var popup_text = {};
					popup_text["value"] = action.popup_text;
					action.popup_text = popup_text;
					action.delay = "IMMEDIATE";
					
						_agile_execute_action(action);
					});
			});
		});


function loadTinyMCE(name)
{
	var strWindowFeatures = "height=650, width=800,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes";
	var newwindow = window.open('cd_tiny_mce.jsp?id=' + name,'name',strWindowFeatures);
	if (window.focus)
	{
		newwindow.focus();
	}
	return false;
	
}

function load_modal_templates()
{
	// If not empty, redirect to tinymce
	if($('#tinyMCEhtml_email').val() !== "")
	{
		loadTinyMCE("tinyMCEhtml_email");
		return;
	}
	
	var strWindowFeatures = "height=650, width=800,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes";
	var new_window = window.open('templates.jsp?id=tinyMCEhtml_email&t=web_rules', 'name', strWindowFeatures);
	
	if(window.focus)
		{
			new_window.focus();
		}
	
	return false;
	Email}

$("#tiny_mce_webrules_link").die().live("click", function(e){
	e.preventDefault();
	load_modal_templates();
})

function tinyMCECallBack(name, htmlVal)
{
	$('#' + name).val(htmlVal);
}

/**
 * MergeFields function to fetch all available merge-fields.
 * 
 * @param type - to add specific fields for specific nodes
 *               like unsubscribe link to SendEmail node
 **/
function getMergeFields(type)
{
	var options=
	{
		"Select Merge Field": "",
		"First Name": "{{first_name}}",
		"Last Name": "{{last_name}}",
		"Email": "{{email}}",
		"Company":"{{company}}",
		"Title": "{{title}}",
		"Website": "{{website}}",
		"Phone": "{{phone}}",
		"City": "{{city}}",
		"State": "{{state}}",
		"Country": "{{country}}",
		"Zip": "{{zip}}",
		"Domain": "{{domain}}",
		"Address": "{{address}}",
		"Score": "{{score}}",
		"Created Time": "{{created_time}}",
		"Modified Time": "{{modified_time}}",
		"Owner Name": "{{owner_name}}",
		"Owner Email": "{{owner_email}}"
	};
	
	// Get Custom Fields in template format
	var custom_fields = get_webrules_custom_fields();
	
	console.log("Custom Fields are");
	console.log(custom_fields);
	
	// Merges options json and custom fields json
	var merged_json = merge_webrules_jsons({}, options, custom_fields);
	return merged_json;
}

/**
 * Returns custom fields in format required for merge fields. 
 * E.g., Nick Name:{{Nick Name}}
 */
function get_webrules_custom_fields()
{
    var url = window.location.protocol + '//' + window.location.host;
	
	// Sends GET request for customfields.
    var msg = $.ajax({type: "GET", url: url+'/core/api/custom-fields', async: false, dataType:'json'}).responseText;
	
	// Parse stringify json
	var data = JSON.parse(msg);
	
	var customfields = {};
	
	// Iterate over data and get field labels of each custom field
	$.each(data, function(index,obj)
			{
					// Iterate over single custom field to get field-label
		            $.each(obj, function(key, value){
						
						// Needed only field labels for merge fields
						if(key == 'field_label')
							customfields[value] = "{{[" + value+"]}}"
					});
			});	
	
	return customfields;
}

/**
 * Returns merged json of two json objects
 **/
function merge_webrules_jsons(target, object1, object2)
{
	return $.extend(target, object1, object2);
}
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
/**
 * sound.js plays sounds within the browser. It uses HTML5 Audio to play sounds.
 * @param sound - sound name.
 **/
function play_sound(sound, is_web_url)
{
	var sound_url;

	if(sound)
		sound_url = '../res/' + sound + '.mp3';
	else
		sound_url = '../res/sound.wav';
	
	if(is_web_url)
		sound_url = sound
	try
	{
		// If browser supports html5 audio
		var audio = new Audio(sound_url);
		audio.play();
	}
	catch (err)
	{
		console.log("Error occured while playing sound " + err);
	}
}


/**
 * notification.js is a script file to show notifications.pubnub is used to emit
 * data received from server. Notification preferences are fetched for current
 * user.Noty jquery plugin are used to show pop-up messages.
 * 
 * @module Notifications
 */
var notification_prefs;

/**
 * Sets timeout for registering notifications.Waits for 2secs after page loads
 * and calls downloadAndRegisterForNotifications function
 */
$(function()
{

	// wait for 2secs
	setTimeout(downloadAndRegisterForNotifications, 10000);

});

/**
 * Fetches notification preferences for current user
 */
function downloadAndRegisterForNotifications()
{

	// Download Notification Prefs
	var notification_model = Backbone.Model.extend({ url : 'core/api/notifications' });

	var model = new notification_model();
	model.fetch({ success : function(data)
	{

		// Notification Preferences with respect to current agile user
		notification_prefs = data.toJSON();
		console.log(notification_prefs);

		// Gets domain
		getDomainFromCurrentUser();
	} });
}

/**
 * Gets domain from current user using backbone model.
 */
function getDomainFromCurrentUser()
{
		var domain = CURRENT_DOMAIN_USER['domain'];
		subscribeToPubNub(domain, function(message)
		{

			_setupNotification(message);
		});
}

/**
 * Subscribes to Pubnub.
 * 
 * @param domain -
 *            Domain name.
 */
function subscribeToPubNub(domain)
{
	// Put http or https
	// var protocol = document.location.protocol;
	var protocol = 'https';
	head.js(protocol + '://pubnub.a.ssl.fastly.net/pubnub-3.4.min.js', function()
	{
		// CREATE A PUBNUB OBJECT
		var pubnub = PUBNUB.init({ 'publish_key' : 'pub-c-e4c8fdc2-40b1-443d-8bb0-2a9c8facd274',
			'subscribe_key' : 'sub-c-118f8482-92c3-11e2-9b69-12313f022c90', ssl : true, origin : 'pubsub.pubnub.com' });
		pubnub.ready();
		pubnub.subscribe({ channel : domain, callback : function(message)
		{

			// shows notification for bulk actions
			if (message.type == "BULK_ACTIONS")
			{
				bulkActivitiesNoty('information', message);
				return;
			}
			
			
			// shows call notification
			if(message.type == "CALL"){
				var html = getTemplate('call-notification', message);
				showNoty('information', html, 'bottomRight', "CALL");
				return;
			}

			// sets notification for notification preferences.
			_setupNotification(message);
		} });
	});
}

/**
 * Sets notification message
 * 
 * @param object
 *            object data such as contact
 */
function _setupNotification(object)
{

	// Inorder to avoid navigating to the contact
	if (object.notification == 'CONTACT_DELETED')
		object.id = "";

	// gets notification template.
	var html = getTemplate('notify-html', object);

	// Shows notification for link clicked, email opened and browsing.
	notification_for_email_and_browsing(object, html);

	// Verify whether current_user key exists. It doesn't exists when tag added
	// through campaign, or notification for email-clicked etc. since session
	// doesn't exist.
	if ('current_user_name' in object)
	{
		if (notification_prefs.prefs.currentDomainUserName == object.current_user_name)
			return;
	}

	// notification for tags, contact and deal actions.
	notification_for_contact_and_deal(object, html);
}

/**
 * Set up notification for link clicked, email opened and browsing.
 * 
 * @param object -
 *            contact object.
 * @param html -
 *            notification template
 * 
 */
function notification_for_email_and_browsing(object, html)
{

	if (object.notification == 'CLICKED_LINK' || object.notification == 'OPENED_EMAIL' || object.notification == 'IS_BROWSING')
	{
		var option = get_option(object.notification);

		notification_based_on_type_of_contact(option, object, html, object.notification);
		return;
	}
}

/**
 * Checks notification preferences and compare with notification type. If it is
 * set true then show notification. For e.g. If Deal created is true then
 * notification when 'deal is created' is shown.
 * 
 * @param object -
 *            contact or deal object.
 * 
 * @param html -
 *            notification template.
 */
function notification_for_contact_and_deal(object, html)
{
	$.each(notification_prefs, function(key, value)
	{

		if (key == object.notification.toLowerCase())
		{
			if (notification_prefs[key])
			{

				// Replace CONTACT with COMPANY for contact-type COMPANY
				if ((object.notification == "CONTACT_ADDED" || object.notification == "CONTACT_DELETED") && object.type == "COMPANY")
				{
					var company = object.notification.replace('CONTACT', 'COMPANY');
					object.notification = company;
				}

				showNoty('information', html, 'bottomRight', object.notification);
			}
		}

	});
}

/**
 * Verifies whether contact owner is same as notification prefs owner. It is
 * used for 'CONTACT_ASSIGNED' option.
 * 
 * @param contact -
 *            contact object.
 */
function is_assigned(contact)
{

	// Current user who logged_in
	var current_user = notification_prefs.prefs.currentDomainUserName;

	// User who created contact
	var contact_created_by = contact.owner_name;

	// checks for assigned contact
	if (current_user == contact_created_by)
		return true;

	return false;
}

/**
 * Verifies whether contact is assigned and starred (having star value).
 * 
 * @param contact -
 *            contact object.
 */
function is_assigned_and_starred(contact)
{

	// checks assigned and starred
	if (is_assigned(contact) && contact.star_value > 0)
		return true;

	return false;
}

/**
 * Returns notification_prefs value based on notification type for link clicked,
 * email_opened and browsing.
 * 
 * @param notification_type -
 *            CLICKED_LINK or OPENED_EMAIL or IS_BROWSING
 */
function get_option(notification_type)
{
	switch (notification_type) {
	case 'CLICKED_LINK':
		return notification_prefs.link_clicked;
	case 'OPENED_EMAIL':
		return notification_prefs.email_opened;
	case 'IS_BROWSING':
		return notification_prefs.browsing;
	}
}

/**
 * Shows notification for link clicked, email opened and browsing. It verifies
 * for option selected and shows notification accordingly.
 * 
 * @param option -
 *            ANY_CONTACT, CONTACT_ASSIGNED or CONTACT_ASSIGNED_AND_STARRED.
 * @param contact -
 *            contact object
 * @param message -
 *            notification html template.
 * @param notification_type -
 *            CLICKED_LINK or OPENED_EMAIL or IS_BROWSING
 */
function notification_based_on_type_of_contact(option, contact, message, notification_type)
{
	switch (option) {
	case 'CONTACT_ASSIGNED':
		if (is_assigned(contact))
			showNoty("information", message, "bottomRight", notification_type);
		break;
	case 'CONTACT_ASSIGNED_AND_STARRED':
		if (is_assigned_and_starred(contact))
			showNoty("information", message, "bottomRight", notification_type);
		break;
	case 'ANY_CONTACT':
		showNoty("information", message, "bottomRight", notification_type);
		break;
	}

}

/**
 * Checks html5 notifications browser settings. If desktop notifications are
 * enabled, shows enabled message and similarly for disabled.
 * 
 * @param el -
 *            backbone el element.
 */
function check_browser_notification_settings(el)
{

	// Verify desktop notification settings.
	// Check if browser support
	if (!window.webkitNotifications)
	{
		$('#set-desktop-notification').css('display', 'none');
	}

	// Allowed
	if (window.webkitNotifications && window.webkitNotifications.checkPermission() == 0)
	{
		$('#set-desktop-notification').css('display', 'none');
		$('#desktop-notification-content')
				.html(
						"<i>Desktop Notifications are now enabled. <a href=\"#\" id=\"disable-notification\" style=\"text-decoration:underline;\">Disable</a></i>");
	}

	// Denied
	if (window.webkitNotifications && window.webkitNotifications.checkPermission() == 2)
	{
		$('#set-desktop-notification').css('display', 'none');
		$('#desktop-notification-content')
				.html(
						"<i>Desktop Notifications are now disabled. <a href=\"#\" id=\"enable-notification\" style=\"text-decoration:underline;\">Enable</a></i>")
	}

	// notification enable help
	$('#enable-notification', el).die().live('click', function(e)
	{
		e.preventDefault();
		$('#notification-enable-help-modal').modal("show");
	});

	// notification disable help
	$('#disable-notification', el).die().live('click', function(e)
	{
		e.preventDefault();
		$('#notification-disable-help-modal').modal("show");
	});
}

/**
 * Shows bootstrap switch changes accordingly. It disables all the options when
 * off and enables when on.
 * 
 * @param el-
 *            backbone el element
 * 
 */
function showSwitchChanges(el)
{
	$('#notification-switch', el).die().live('switch-change', function()
	{
		var status = $('#notification-switch').bootstrapSwitch('status');

		// if ON - status is true
		if (status)
		{
			$(el).find('input[type=checkbox]').not('#control_notifications,#notification_sound').removeAttr('disabled');
			$(el).find('select').not('#control_notifications').removeAttr('disabled');
		}
		else
		{
			$(el).find('input[type=checkbox]').not('#control_notifications').attr('disabled', 'disabled');
			$(el).find('select').not('#control_notifications, #notification_sound').attr('disabled', 'disabled');
		}

	});
}

/**
 * Runs jquery noty plugin for notification pop-ups when desktop permission is
 * not given.
 * 
 * @param type -
 *            noty types like information, warning etc.
 * @param message -
 *            html content for notification
 * @param position -
 *            position of pop-up within the webpage.
 * @param notification_type -
 *            notification type - TAG_CREATED, TAG_DELETED etc.
 */
function showNoty(type, message, position, notification_type)
{
	// Don't show notifications when disabled by user
	if (!notification_prefs.control_notifications)
		return;

	// Check for html5 notification permission.
	if (window.webkitNotifications && window.webkitNotifications.checkPermission() == 0)
	{
		if(notification_type=="CALL"){
			show_desktop_notification($('span:eq(0)', message).attr('id'), $(message).find('#calling-contact-id').text(),
									  $(message).find('#call-notification-text').text(), $(message).find('#calling-contact-id').attr('href'),
									  $(message).find('#calling-contact-id').attr('href').split('/')[1] + '-' + "CALL");
			return;
		}
		
		show_desktop_notification(getImageUrl(message,notification_type), getNotificationType(notification_type), getTextMessage(message), getId(message), getId(message).split(
				'/')[1] + '-' + notification_type);
		return;
	}

	// Download the lib
	head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH + 'lib/noty/layouts/bottomRight.js', LIB_PATH + 'lib/noty/layouts/bottom.js',
			LIB_PATH + 'lib/noty/themes/default.js', function()
			{

				var n = noty({ text : message, layout : position, type : type, timeout : 30000 });

				// Play sounds for only user notifications
				if (n.options.type == 'information')
				{
					if (notification_prefs.notification_sound != 'no_sound')
						play_sound(notification_prefs.notification_sound);
				}

				// Set the handler for click
				$('.noty_bar').die().live('click', function()
				{

					// // warning type is used for upgrade. So when cliked on it
					// navigate to subscribe.
					// if(n.options.type == "warning")
					// {
					// // Send to upgrade page
					// Backbone.history.navigate('subscribe', {
					// trigger : true
					// });
					// }

					// information type is used for user notification. When
					// clicked
					// navigate to link.
					if (n.options.type == "information")
					{
						var link = $(this).find("a").attr("href");
						Backbone.history.navigate(link, { trigger : true });
					}

				});
			});
}

/** HTML5 Desktop Notification utility methods. Depends on notification template.*/
/**
 * Returns required text from notification template as html5 doesn't allow html.
 * 
 * @param {String}
 *            message - notification template.
 */
function getTextMessage(message)
{
	var name;
	var type = $(message).find('#notification-type').text();

	if ($(message).find('#notification-contact-id').text() != "")
	{
		name = $(message).find('#notification-contact-id').text();
		return name + " " + type;
	}

	name = $(message).find('#notification-deal-id').text();
	return name + " " + type;
}



/**
 * Returns converted notification-type. E.g., TAG_ADDED to New Tag
 */
function getNotificationType(notification_type)
{
	if (notification_type == "CONTACT_ADDED" || notification_type == "COMPANY_ADDED" || notification_type == "TAG_ADDED" || notification_type == "DEAL_CREATED")
		return "New " + ucfirst(notification_type.split('_')[0]);

	if (notification_type == "IS_BROWSING")
		return ucfirst(notification_type.split('_')[1]);
	return ucfirst(notification_type.split('_')[0]) + " " + ucfirst(notification_type.split('_')[1]);
}

/**
 * Returns required contact-id or deal-id from notification template. This
 * allows to return to respective page when clicked on notification.
 * 
 * @param {String}
 *            message - notification template.
 */
function getId(message)
{
	if ($(message).find('#notification-contact-id').text() != "")
	{
		return $(message).find('#notification-contact-id').attr('href');
	}
	return $(message).find('#notification-deal-id').attr('href');
}

/**
 * Returns image url from notification template to display image.
 * 
 * @param {String}
 *            message - notification template.
 *            
 * @param {String}
 *            notification_type - notification-type like COMPANY_ADDED, DEAL_ADDED etc.
 */
function getImageUrl(message, notification_type)
{
	if ($(message).find('#notification-contact-id').text() != "")
		{
		
		// if contact is company fetch company url
		if(notification_type === 'COMPANY_ADDED' || notification_type === 'COMPANY_DELETED')
			return $('span:eq(1)', message).attr('id');
		
		return $('span:eq(0)', message).attr('id');
		}

	return '/img/deal.png';
}
/** End of HTML5 Desktop Notification utility methods*/

/**
 * Plays notification sounds on clicking on play button.
 */
function notification_play_button()
{
	// Play notification sound when clicked on play icon.
	$('#notification-sound-play').live('click', function(e)
	{
		e.preventDefault();

		var sound = $('#notificationsForm #notification_sound').find(":selected").val();

		// silent
		if (sound == 'no_sound')
			return;

		// plays sound
		play_sound(sound);
	});

}
$(function() {
	
	// Request for html5 notification permission.
	request_notification_permission();

});

/**
 * Create the Notification if permissions allowed in the browser.
 * 
 * @method show_desktop_notification
 * 
 * @param {String}
 *            imageURL - image url to show image in popup.
 * @param {String}
 *            title - Notification type.
 * @param {String}
 *            message - Notification message.
 * @param {String}
 *            link - link to navigate when clicked on popup.
 * @param {String}
 *            tag - to set tag property of Notification. Here tag is contact-id + notification-type
 */
function show_desktop_notification(imageURL, title, message, link, tag) {

		var notification = new Notification(title, {
		    body : message,
		    tag :  tag,
		    icon : imageURL
		});

		notification.onclick = function(x) {
			window.focus();
			// Open respective block
			Backbone.history.navigate(link, {
				trigger : true
			});

			this.close();
		};
		
		setTimeout(function() {
			notification.close();
		}, '30000');
		
		// Show when tab is inactive
		if (!window.closed)
		{	
			if (notification_prefs.notification_sound != 'no_sound')
				play_sound(notification_prefs.notification_sound);
			
		}
}

/**
 * request_notification_permission request the notification request in case of
 * "0" permissions to allow or denied the notifications.
 * 
 * @method request_notification_permission
 */
function request_notification_permission() {
	if (window.webkitNotifications
			&& window.webkitNotifications.checkPermission() != 0) {

		$('#set-desktop-notification').live('click', function() {
			window.webkitNotifications.requestPermission(function() {
				if(window.webkitNotifications.checkPermission() == 0)
				{	
					$('#set-desktop-notification').css('display', 'none');
				    $('#desktop-notification-content')
						.html(
								"<i>Desktop Notifications are now enabled. <a href=\"#\" id=\"disable-notification\" style=\"text-decoration:underline;\">Disable</a></i>");
				}
				else
				{
					$('#set-desktop-notification').css('display', 'none');
		            $('#desktop-notification-content').html(
						"<i>Desktop Notifications are now disabled. <a href=\"#\" id=\"enable-notification\" style=\"text-decoration:underline;\">Enable</a></i>")
                 }	
			});
		});

	}
}
/**
 * 
 * event.js is a script file to deal with the actions like creation, update and
 * deletion of events from client side.
 * 
 * @module Activities
 * 
 * author: Rammohan
 */

$(function()
{
	/**
	 * Shows activity modal, and highlights the event form features (Shows event
	 * form and hides task form, changes color and font-weight)
	 * 
	 */
	$('#show-activity').live('click', function(e)
	{
		e.preventDefault();
		highlight_event();

		$("#activityModal").modal('show');
	});

	/**
	 * Shows the event form fields in activity modal
	 */
	$(".add-event").live('click', function(e)
	{
		e.preventDefault();

		$('#activityModal').modal('show');
		highlight_event();
		
		/*
		 * $('#task-date-1').val(new Date().format('mm/dd/yyyy'));
		 * $("#event-date-1").val(new Date().format('mm/dd/yyyy'));
		 * $("#event-date-2").val(new Date().format('mm/dd/yyyy'));
		 */

		
		return;
	});

	/**
	 * When clicked on update button of event-update-modal, the event will get
	 * updated by calling save_event function
	 * 
	 */
	$('#update_event_validate').die().live('click', function(e)
	{
		e.preventDefault();
		save_event('updateActivityForm', 'updateActivityModal', true, this);
	});

	/**
	 * Deletes an event from calendar by calling ajax DELETE request with an
	 * appropriate url
	 */
	$('#event_delete').die().live('click', function(e)
	{
		e.preventDefault();
		
		if($(this).attr('disabled')=='disabled')return;

		/**
		 * Confirmation alert to delete an event
		 */
		if (!confirm("Are you sure you want to delete?"))
			return;

		var event_id = $('#updateActivityForm input[name=id]').val()
		var save_button=$(this);
		
		disable_save_button(save_button);
		/**
		 * Shows loading symbol until model get saved
		 */
		//$('#updateActivityModal').find('span.save-status').html(LOADING_HTML);
		$.ajax({ url : 'core/api/events/' + event_id, type : 'DELETE', success : function()
		{

			//$('#updateActivityModal').find('span.save-status img').remove();
			enable_save_button(save_button);
			$("#updateActivityModal").modal('hide');

			$('#calendar').fullCalendar('removeEvents', event_id);
		} });
	});

	/**
	 * Activates the date picker to the corresponding fields in activity modal
	 * and activity-update modal
	 */
	var eventDate = $('#event-date-1').datepicker({ format : 'mm/dd/yyyy' });

	$('#event-date-2').datepicker({ format : 'mm/dd/yyyy' });
	$('#update-event-date-1').datepicker({ format : 'mm/dd/yyyy' });
	$('#update-event-date-2').datepicker({ format : 'mm/dd/yyyy' });

	/**
	 * Activates time picker for start time to the fields with class
	 * start-timepicker
	 */
	$('.start-timepicker').timepicker({ defaultTime : 'current', showMeridian : false, template : 'modal' })
						.on('hide.timepicker',function(e){
								
							if($('#activityModal #allDay').is(':checked'))
							{
								$('#event-time-1').closest('.control-group').hide();
								$('#event-date-2').closest('.row').hide();
							}	
							
								e.stopImmediatePropagation();
								return false;
							});

	/**
	 * Activates time picker for end time to the fields with class
	 * end-timepicker
	 */
	$('.end-timepicker').timepicker({ defaultTime : get_hh_mm(true), showMeridian : false, template : 'modal' });

	/**
	 * Activates time picker for start time to the fields with class
	 * update-start-timepicker
	 */
	$('.update-start-timepicker').timepicker({ defaultTime : 'current', showMeridian : false, template : 'modal' });

	/**
	 * Activates time picker for end time to the fields with class
	 * update-end-timepicker
	 */
	$('.update-end-timepicker').timepicker({ defaultTime : get_hh_mm(true), showMeridian : false, template : 'modal' });

	/**
	 * Sets the start time with current time and end time half an hour more than
	 * start time, when they have no values by the time the modal is shown.
	 */
	$('#activityModal').on('shown', function()
	{
        // Show related to contacts list
		var el = $("#activityForm");
		agile_type_ahead("event_related_to", el, contacts_typeahead);
		
		/**
		 * Fills current time only when there is no time in the fields
		 */
		if ($('.start-timepicker').val() == '')
			$('.start-timepicker').val(get_hh_mm());

		if ($('.end-timepicker').val() == '')
			$('.end-timepicker').val(get_hh_mm(true));

		// Update will highlight the date of in date picker
		$("input.date").datepicker('update');

	});

	/**
	 * To avoid showing previous errors of the modal.
	 */
	$('#updateActivityModal').on('show', function()
	{
        // Show related to contacts list
		var el = $("#updateActivityForm");
		agile_type_ahead("event_related_to", el, contacts_typeahead);
		
		// Removes alert message of error related date and time.
		$('#' + this.id).find('.alert').css('display', 'none');

		// Removes error class of input fields
		$('#' + this.id).find('.error').removeClass('error');

		$("input.date").datepicker('update');

	});

	/**
	 * To avoid showing previous errors of the modal.
	 */
	$('#activityModal').on('show', function(e)
	{

		// Removes alert message of error related date and time.
		$('#' + this.id).find('.alert').css('display', 'none');

		// Removes error class of input fields
		$('#' + this.id).find('.error').removeClass('error');
		
	});
	
	/**
	 * Hide event of update task modal. Removes the relatedTo field elements if
	 * any, when the modal is hidden in order to not to show them again when the
	 * modal is shown next
	 * 
	 */
	$('#updateActivityModal').on('hidden', function() {

		$("#updateActivityForm").find("li").remove();
	});
	$('#activityModal').on('hidden', function() {

		$("#activityForm").find("li").remove();
	});


	/**
	 * Highlights the event features (Shows event form and hides task form,
	 * changing color and font-weight)
	 */
	$("#event").click(function(e)
	{
		e.preventDefault();
		highlight_event();
	});

});

/**
 * Highlights the event portion of activity modal (Shows event form and hides
 * task form, changes color and font-weight)
 */
function highlight_event()
{
	$("#hiddentask").val("event");
	$("#event").css({ "color" : "black" });
	$("#task").css({ "color" : "red" });
	$("#relatedTask").css("display", "none");
	$("#relatedEvent").css("display", "block");

	// Date().format('mm/dd/yyyy'));
	$('input.date').val(new Date().format('mm/dd/yyyy'));
}

/**
 * 
 * Validates the start time and end time of an event (start time should be less
 * than end time)
 * 
 * @method is_valid_range
 * @param {Number}
 *            startDate start date of an event
 * @param {Number}
 *            endDate end date of an event
 * @param {Number}
 *            startTime start time of an event
 * @param {Number}
 *            endTime end time of an event
 * @param {String}
 *            modalId the unique id for the modal to identify it
 */
function is_valid_range(startDate, endDate, startTime, endTime, modalName)
{
	if (endDate - startDate >= 86400000)
	{
		return true;
	}
	else if (startDate > endDate)
	{
		$('#' + modalName)
				.find(".invalid-range")
				.html(
						'<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">&times</a>Start date should not be greater than end date. Please change.</div>');

		return false;
	}
	else if (startTime[0] > endTime[0])
	{
		$('#' + modalName)
				.find(".invalid-range")
				.html(
						'<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">&times</a>Start time should not be greater than end time. Please change.</div>');

		return false;
	}
	else if (startTime[0] == endTime[0] && startTime[1] >= endTime[1])
	{
		$('#' + modalName)
				.find(".invalid-range")
				.html(
						'<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">&times</a>Start time should not be greater or equal to end time. Please change.</div>');

		return false;
	}
	else
		return true;
}

// Save event

/**
 * Creates or updates an event and renders the saved object by verifying if the
 * event is updated or saved as new one.
 * 
 * @method save_event
 * @param {String}
 *            formId the unique id for the form to identify it
 * @param {String}
 *            modalId the unique id for the modal to identify it
 * @param {Boolean}
 *            isUpdate the boolean value to identify weather saving the new one
 *            or updating the existing one
 * 
 */
function save_event(formId, modalName, isUpdate, saveBtn)
{

	// Returns, if the save button has disabled attribute
	if ($(saveBtn).attr('disabled'))
		return;

	// Disables save button to prevent multiple click event issues
	disable_save_button($(saveBtn));

	// Save functionality for event
	if (!isValidForm('#' + formId))
	{

		// Removes disabled attribute of save button
		enable_save_button($(saveBtn));
		return false;
	}

	var json = serializeForm(formId);

	if(json.allDay){ json.end=json.start; json.start_time="00:00"; json.end_time="23:45"; }// for all day, assume ending in last of that day.
	
	// For validation
	if (!is_valid_range(json.start * 1000, json.end * 1000, (json.start_time).split(":"), (json.end_time).split(":"), modalName))
	{

		// Removes disabled attribute of save button
		enable_save_button($(saveBtn));
		return;
	}

	// Show loading symbol until model get saved
	//$('#' + modalName).find('span.save-status').html(LOADING_HTML);

	// Appending start time to start date
	var startarray = (json.start_time).split(":");
	json.start = new Date(json.start * 1000).setHours(startarray[0], startarray[1]) / 1000.0;

	// Appending end time to end date
	var endarray = (json.end_time).split(":");
	json.end = new Date(json.end * 1000).setHours(endarray[0], endarray[1]) / 1000.0;

	$('#' + modalName).modal('hide');

	$('#' + formId).each(function()
	{
		this.reset();
	});

	// Deleting start_time and end_time from json
	delete json.start_time;
	delete json.end_time;

	var eventModel = new Backbone.Model();
	eventModel.url = 'core/api/events';
	eventModel.save(json, { success : function(data)
	{

		// Removes disabled attribute of save button
		enable_save_button($(saveBtn));//$(saveBtn).removeAttr('disabled');

		$('#' + formId).each(function()
		{
			this.reset();
		});

		//$('#' + modalName).find('span.save-status img').remove();
		$('#' + modalName).modal('hide');

		// $('#calendar').fullCalendar( 'refetchEvents' );
		var event = data.toJSON();
		if (Current_Route == 'calendar') {
			
			// When updating an event remove the old event from fullCalendar
			if (isUpdate)
				$('#calendar').fullCalendar('removeEvents', json.id);

			$('#calendar').fullCalendar('renderEvent', data.toJSON());
		}
		// Updates data to temeline
		else if (App_Contacts.contactDetailView
				&& Current_Route == "contact/"
						+ App_Contacts.contactDetailView.model.get('id')) {

			/*
			 * Verifies whether the added task is related to the contact in
			 * contact detail view or not
			 */
			$.each(event.contacts, function(index, contact) {
				if (contact.id == App_Contacts.contactDetailView.model
						.get('id')) {

					// Add model to collection. Disabled sort while adding and called
					// sort explicitly, as sort is not working when it is called by add
					// function
					if (eventsView && eventsView.collection)
					{
						if(eventsView.collection.get(data.id))
						{
							eventsView.collection.get(data.id).set(new BaseModel(data));
						}
						else
						{
							eventsView.collection.add(new BaseModel(data), { sort : false });
							eventsView.collection.sort();
						}
					}
					
					// Activates "Timeline" tab and its tab content in
					// contact detail view
					// activate_timeline_tab();
					add_entity_to_timeline(data);

					return false;
				}
			});
		}
		else
			App_Calendar.navigate("calendar", { trigger : true });
	} });
}

/**
 * Get Hours and Minutes for the current time. It will be padded for 15 minutes
 * 
 * @method get_hh_mm
 * @param {Boolean}
 *            end_time to make end time 30 minutes more than start time
 * 
 */
function get_hh_mm(end_time)
{

	var hours = new Date().getHours();
	var minutes = new Date().getMinutes();

	if (minutes % 15 != 0)
		minutes = minutes - (minutes % 15);

	// Make end time 30 minutes more than start time
	if (end_time)
	{
		if (minutes == "30")
		{
			hours = hours + 1;
			minutes = 0;
		}
		else if (minutes == "45")
		{
			hours = hours + 1;
			minutes = 15;
		}
		else
			minutes = minutes + 30;
	}

	if (hours < 10)
	{
		hours = "0" + hours;
	}
	if (minutes < 10)
	{
		minutes = "0" + minutes;
	}

	return hours + ':' + minutes;
}
/*!
 * FullCalendar v1.6.4 Google Calendar Plugin
 * Docs & License: http://arshaw.com/fullcalendar/
 * (c) 2013 Adam Shaw
 */
 

// or better
function isDefined(x) {
    var undefined;
    return typeof x !== undefined;
}

function _init_gcal_options()
{
	var fc = $.fullCalendar;
	fc.sourceFetchers = [];
	// Transforms the event sources to Google Calendar Events
	fc.sourceFetchers.push(function(sourceOptions, start, end) {
		if (sourceOptions.dataType == 'agile-gcal') {
			
			// Fetches access token. Fetched here to avoid unnecessary loading of client.js and gapi helper without access token
			load_events_from_google(function(data) {
				if(!data)
					return;
				
				return agile_transform_options(data, start, end);	
			});
		}
	});
	
}

// Tranform agile
function agile_transform_options(sourceOptions, start, end)
{	
	// Setup GC for First time
	//console.log(gapi.client.calendar);
	
	if(typeof gapi != "undefined" && isDefined(gapi) && isDefined(gapi.client) && isDefined(gapi.client.calendar) ){ 
		_fetchGCAndAddEvents(sourceOptions, start, end);
		return;
	}
	
	head.js('https://apis.google.com/js/client.js', 'https://rawgithub.com/dr-skot/gapi-helper/master/gapi-helper.js', function() {
	setupGC(function(){
			_fetchGCAndAddEvents(sourceOptions, start, end);
			});
		return;
	});
}

// Setup Google Calendar
function setupGC(callback)
{
	console.log("Set up GC");
	
	// Configure Calendar
	gapi_helper.configure({
    	scopes: 'https://www.googleapis.com/auth/calendar',
    	services: {
        	calendar: 'v3'
    	}
	});

	gapi_helper.when('calendarLoaded', callback);
}

function _fetchGCAndAddEvents(sourceOptions, start, end)
{
	// Set the access token
	gapi.auth.setToken({access_token:sourceOptions.token, state: "https://www.googleapis.com/auth/calendar"});

	// Retrieve the events from primary
	var request = gapi.client.calendar.events.list({
      'calendarId': 'primary',
       timeMin: ts2googleDate(start),
        timeMax: ts2googleDate(end),
        maxResults: 10000, // max results causes problems: http://goo.gl/FqwIFh
        singleEvents: true
    });
    
	request.execute(function(resp) {
	console.log(resp);
		for (var i = 0; i < resp.items.length; i++) {	
			var fc_event = google2fcEvent(resp.items[i]);
			
			// Add event
			$('#calendar').fullCalendar( 'renderEvent', fc_event  )
		}
	});
}

// Convert a timestamp into google date format
function ts2googleDate(ts) {
    return $.fullCalendar.formatDate($.fullCalendar.parseDate(ts), 'u');
}
  
// Convert Google Event to Full Calendar Event  
function google2fcEvent(google) {
    var fc = {
      title: google.summary,
      start: google.start.date || google.start.dateTime,
      end: google.end.date || google.end.dateTime,
      allDay: google.start.date ? true : false,
      google: google, // keep a reference to the original,
      color: 'orange'
    };
    if (fc.allDay) {
      // subtract 1 from end date: Google all-day end dates are exclusive
      // FullCalendar's are inclusive
      var end = $.fullCalendar.parseDate(fc.end);
      end.setDate(end.getDate() - 1);
      fc.end = $.fullCalendar.formatDate(end, 'yyyy-MM-dd');
    }
    return fc;
}

//https://groups.google.com/forum/#!msg/google-api-javascript-client/ZFcvHvh3dJQ/-zKhUD5NtKgJ
/**
 * task.js is a script file to deal with all the actions (CRUD) of tasks from
 * client side.
 * 
 * @module Activities
 * 
 * author: Rammohan
 */

$(function()
{

	// Loads progress slider in add task / update modal.
	loadProgressSlider($("#taskForm"));
	loadProgressSlider($("#updateTaskForm"));
	
	/**
	 * To stop propagation to edit page
	 */
	$(".activate-link").die().live('click', function(e)
	{
		e.stopPropagation();
	});

	/**
	 * Activates all features of a task form (highlighting the task form,
	 * relatedTo field typeahead, changing color and font-weight) when we click
	 * on task link in activities modal.
	 */
	$("#task").click(function(e)
	{
		e.preventDefault();
		var el = $("#taskForm");
		highlight_task();
		agile_type_ahead("task_related_to", el, contacts_typeahead);
		// Fills owner select element
		populateUsers("owners-list", $("#taskForm"), undefined, undefined, function(data)
		{
			$("#taskForm").find("#owners-list").html(data);
			$("#owners-list", el).find('option[value=' + CURRENT_DOMAIN_USER.id + ']').attr("selected", "selected");
			$("#owners-list", $("#taskForm")).closest('div').find('.loading-img').hide();		
		});
	});

	/**
	 * Shows activity modal with all the task create fields.
	 */
	$(".add-task").live('click', function(e)
	{
		e.preventDefault();

		var el = $("#taskForm");

		agile_type_ahead("task_related_to", el, contacts_typeahead);
		$('#activityModal').modal('show');
		highlight_task();

		// Fills owner select element
		populateUsers("owners-list", $("#taskForm"), undefined, undefined, function(data)
		{
			$("#taskForm").find("#owners-list").html(data);
			$("#owners-list", el).find('option[value=' + CURRENT_DOMAIN_USER.id + ']').attr("selected", "selected");
			$("#owners-list", $("#taskForm")).closest('div').find('.loading-img').hide();
		});

	});

	/**
	 * Tasks are categorized into four types (overdue, today, tomorrow and
	 * next-week) while displaying them in client side.Each category has it's
	 * own table, so to edit tasks call update_task function for each category.
	 */
	$('#overdue > tr').live('click', function(e)
	{
		e.preventDefault();
		update_task(this);
	});
	$('#today > tr').live('click', function(e)
	{
		e.preventDefault();
		update_task(this);
	});
	$('#tomorrow > tr').live('click', function(e)
	{
		e.preventDefault();
		update_task(this);
	});
	$('#next-week > tr').live('click', function(e)
	{
		e.preventDefault();
		update_task(this);
	});

	/**
	 * Task list edit
	 */
	$('#tasks-list-model-list > tr > td:not(":first-child")').live('click', function(e)
	{
		e.preventDefault();
		update_task($(this).closest('tr'));
	});

	/**
	 * Dash board edit
	 */
	$('#dashboard1-tasks-model-list > tr').live('click', function(e)
	{
		e.preventDefault();
		update_task(this);
	});

	/**
	 * When clicked on update button of task-update-modal, the task will get
	 * updated by calling save_task function
	 */
	$('#update_task_validate').click(function(e)
	{
		e.preventDefault();
		save_task('updateTaskForm', 'updateTaskModal', true, this);
	});

	/**
	 * Hide event of update task modal. Removes the relatedTo field elements if
	 * any, when the modal is hidden in order to not to show them again when the
	 * modal is shown next
	 * 
	 */
	$('#updateTaskModal').on('hidden', function()
	{
		// Empty contact list and owner list
		$("#updateTaskForm").find("li").remove();

		resetForm($("#updateTaskForm"));
	});

	/**
	 * Show event of update task modal Activates typeahead for task-update-modal
	 */
	$('#updateTaskModal').on('shown', function()
	{
		var el = $("#updateTaskForm");
		agile_type_ahead("update_task_related_to", el, contacts_typeahead);	
		
		// Fill details in form
		setForm(el);
	});

	/**
	 * Date Picker Activates datepicker for task due element
	 */
	$('#task-date-1').datepicker({ format : 'mm/dd/yyyy' });

	/**
	 * Shows a pop-up modal with pre-filled values to update a task
	 * 
	 * @method updateTask
	 * @param {Object}
	 *            ele assembled html object
	 * 
	 */
	function update_task(ele)
	{
		var value = $(ele).data().toJSON();
		deserializeForm(value, $("#updateTaskForm"));
		$("#updateTaskModal").modal('show');
		
		// Fills owner select element
		populateUsers("owners-list", $("#updateTaskForm"), value, 'taskOwner', function(data)
		{
			$("#updateTaskForm").find("#owners-list").html(data);
			if (value.taskOwner)
			{
				$("#owners-list", $("#updateTaskForm")).find('option[value=' + value['taskOwner'].id + ']').attr("selected", "selected");
			}
			$("#owners-list", $("#updateTaskForm")).closest('div').find('.loading-img').hide();
		});
	}

	/**
	 * Makes the pending task as completed by calling complete_task function
	 */
	$('.tasks-select').live('click', function(e)
	{
		e.stopPropagation();
		if ($(this).is(':checked'))
		{
			// Complete
			var taskId = $(this).attr('data');
			// complete_task(taskId, $(this));
			complete_task(taskId, App_Calendar.tasksListView.collection, $(this).closest('tr'))
		}
	});
});

/**
 * Highlights the task portion of activity modal (Shows task form and hides
 * event form, changes color and font-weight)
 */
function highlight_task()
{
	$("#hiddentask").val("task");
	$("#task").css({ "color" : "black" });
	$("#event").css({ "color" : "red" });
	$("#relatedEvent").css("display", "none");
	$("#relatedTask").css("display", "block");

	// Date().format('mm/dd/yyyy'));
	$('input.date').val(new Date().format('mm/dd/yyyy')).datepicker('update');
}

/**
 * Creates or updates a task and adds the saved object to the suitable
 * collection by verifying the current window location.
 * 
 * @protected
 * @method save_task
 * @param {String}
 *            formId the unique id for the form to identify it
 * @param {String}
 *            modalId the unique id for the modal to identify it
 * @param {Boolean}
 *            isUpdate the boolean value to identify weather saving the new one
 *            or updating the existing one
 * 
 */
function save_task(formId, modalId, isUpdate, saveBtn)
{

	// Returns, if the save button has disabled attribute
	if ($(saveBtn).attr('disabled'))
		return;

	// Disables save button to prevent multiple click event issues
	disable_save_button($(saveBtn));// $(saveBtn).attr('disabled', 'disabled');

	if (!isValidForm('#' + formId))
	{

		// Removes disabled attribute of save button
		enable_save_button($(saveBtn));// $(saveBtn).removeAttr('disabled');
		return false;
	}
	
	var json = serializeForm(formId);
	console.log(json.due);
	if (!isUpdate)
		json.due = new Date(json.due).getTime();

	console.log(json.due);
	console.log(json);
	var newTask = new Backbone.Model();
	newTask.url = 'core/api/tasks';
	newTask.save(json, { success : function(data)
	{

		// Removes disabled attribute of save button
		enable_save_button($(saveBtn));// $(saveBtn).removeAttr('disabled');

		$('#' + formId).each(function()
		{
			this.reset();
		});

		// $('#' + modalId).find('span.save-status img').remove();
		$('#' + modalId).modal('hide');

		var task = data.toJSON();
		if (Current_Route == 'calendar')
		{
			if (isUpdate)
				App_Calendar.tasksListView.collection.remove(json);

			// Updates task list view
			if (!data.toJSON().is_complete && data.toJSON().owner_id == CURRENT_DOMAIN_USER.id)
				App_Calendar.tasksListView.collection.add(data);

			App_Calendar.tasksListView.render(true);

		}
		else if (Current_Route == 'tasks')
		{

			updateTask(isUpdate, data, json);
		}
		// Updates data to temeline
		else if (App_Contacts.contactDetailView && Current_Route == "contact/" + App_Contacts.contactDetailView.model.get('id'))
		{

			/*
			 * Verifies whether the added task is related to the contact in
			 * contact detail view or not
			 */
			$.each(task.contacts, function(index, contact)
			{
				if (contact.id == App_Contacts.contactDetailView.model.get('id'))
				{

					// Add model to collection. Disabled sort while adding and
					// called
					// sort explicitly, as sort is not working when it is called
					// by add
					// function
					if (tasksView && tasksView.collection)
					{
						if (tasksView.collection.get(data.id))
						{
							tasksView.collection.get(data.id).set(new BaseModel(data));
						}
						else
						{
							tasksView.collection.add(new BaseModel(data), { sort : false });
							tasksView.collection.sort();
						}
					}

					// Activates "Timeline" tab and its tab content in
					// contact detail view
					// activate_timeline_tab();
					add_entity_to_timeline(data);

					return false;
				}
			});
		}
		else
		{
			App_Calendar.navigate("calendar", { trigger : true });
		}
	} });
}

/**
 * Get due date of the task to categorize as overdue, today etc..
 * 
 * @method get_due
 * @param {Number}
 *            due of the task
 * 
 */
function get_due(due)
{
	// Get Todays Date
	var date = new Date();
	date.setHours(0, 0, 0, 0);

	date = date.getTime() / 1000;
	return Math.floor((due - date) / (24 * 3600));
}

function increaseCount(heading)
{
	var count = heading.find('.count').attr('count');

	count = count ? parseInt(count) + 1 : 1;
	heading.find('.count').attr('count', count);
	heading.find('.count').text("(" + count + ")");
	return count;
}
/**
 * Based on due date arranges the tasks UI
 * 
 * @method append_tasks
 * @param {Object}
 *            base_model task model
 * 
 */
function append_tasks(base_model)
{

	var itemView = new Base_List_View({ model : base_model, "view" : "inline", template : this.options.templateKey + "-model", tagName : 'tr', });

	// add to the right box - overdue, today, tomorrow etc.
	var due = get_due(base_model.get('due'));

	if (due < 0)
	{

		var heading = $('#overdue-heading', this.el);
		var count = increaseCount(heading)

		if (count > 5)
		{
			return;
		}
		$('#overdue', this.el).append(itemView.render().el);
		if (count == 5)
			$('#overdue', this.el).append('<div style="float:right;padding-bottom:10px"><a href="#tasks">more</a></div>');
		$('#overdue', this.el).find('tr:last').data(base_model);
		$('#overdue', this.el).parent('table').css("display", "block");
		heading.show();
		$('#overdue', this.el).show();
	}

	// Today
	if (due == 0)
	{

		var heading = $('#today-heading', this.el);
		var count = increaseCount(heading);
		if (count > 5)
		{
			return;
		}
		if ($('#today > tr', this.el).length > 4)
			return;

		$('#today', this.el).append(itemView.render().el);
		if (count == 5)
			$('#today', this.el).append('<div style="float:right;padding-bottom:10px"><a href="#tasks">more</a></div>');
		$('#today', this.el).find('tr:last').data(base_model);
		$('#today', this.el).parent('table').css("display", "block");
		$('#today', this.el).show();
		$('#today-heading', this.el).show();
	}

	// Tomorrow
	if (due == 1)
	{
		var heading = $('#tomorrow-heading', this.el);
		var count = increaseCount(heading);
		if (count > 5)
		{
			return;
		}

		$('#tomorrow', this.el).append(itemView.render().el);
		if (count == 5)
			$('#tomorrow', this.el).append('<div style="float:right;padding-bottom:10px"><a href="#tasks">more</a></div>');
		$('#tomorrow', this.el).find('tr:last').data(base_model);
		$('#tomorrow', this.el).parent('table').css("display", "block");
		$('#tomorrow', this.el).show();
		$('#tomorrow-heading', this.el).show();
	}

	// Next Week
	if (due > 1)
	{
		var heading = $('#next-week-heading', this.el);
		var count = increaseCount(heading);
		if (count > 5)
		{
			return;
		}

		$('#next-week', this.el).append(itemView.render().el);
		if (count == 5)
			$('#next-week', this.el).append('<div style="float:right;padding-bottom:10px"><a href="#tasks">more</a></div>');
		$('#next-week', this.el).find('tr:last').data(base_model);
		$('#next-week', this.el).parent('table').css("display", "block");
		$('#next-week', this.el).show();
		$('#next-week-heading', this.el).show();
	}

}

// dash board tasks based on conditions..
function append_tasks_dashboard(base_model)
{

	var itemView = new Base_List_View({ model : base_model, "view" : "inline", template : this.options.templateKey + "-model", tagName : 'tr',

	});

	var due = get_due(base_model.get('due'));

	var pendingTask = base_model.get("is_complete");

	if (pendingTask == false && due <= 0)
		$('#dashboard1-tasks-model-list', this.el).append(itemView.render().el);

}

/**
 * 
 * Turns the pending task as completed
 * 
 * @method complete_task
 * @param {Number}
 *            taskId to get the task from the collection
 * @param {Object}
 *            ui html Object to remove on success of the deletion
 * 
 */
function complete_task(taskId, collection, ui, callback)
{

	var taskJSON = collection.get(taskId).toJSON();
	// Replace contacts object with contact ids
	var contacts = [];
	$.each(taskJSON.contacts, function(index, contact)
	{
		contacts.push(contact.id);
	});

	taskJSON.contacts = contacts;
	taskJSON.is_complete = true;
	taskJSON.status = "COMPLETED";
	taskJSON.progress = 100;
	taskJSON.owner_id = taskJSON.taskOwner.id;

	var new_task = new Backbone.Model();
	new_task.url = '/core/api/tasks';
	new_task.save(taskJSON, { success : function(model, response)
	{
		collection.remove(model);

		if (ui)
			ui.fadeOut(2000);

		if (callback && typeof (callback) === "function")
		{
			// execute the callback, passing parameters as necessary
			callback(model);
		}
	} });
}
/**
 * To show the dates or time in words of time-ago plugin.
 * @param element
 */
function includeTimeAgo(element){
	head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$("time", element).timeago();
			});
}

/**
 * To fill the tasklist ordered by default 
 */
function initOwnerslist() {	
	// Click events to agents dropdown and department
	$("ul#owner-tasks li a, ul#type-tasks li a").die().live("click", function(e) {
				e.preventDefault();

				// Show selected name
				var name = $(this).html(), id = $(this).attr("href");

				$(this).closest("ul").data("selected_item", id);
				$(this).closest(".btn-group").find(".selected_name")
						.text(name);
				var url = getParams();
				updateData(url);
				
	});
	$("ul#owner-tasks li a").die().live("click", function() {
		
		$('.task-heading').html($(this).html() +'&nbsp<small class="tasks-count"></small>');
		//$('.task-heading').text($(this).html());
		pieTasks(getParams()); // Show tasks only when user changes My Tasks vs All Tasks
	});
	updateData(getParams() + "&owner=" + CURRENT_DOMAIN_USER.id + "&pending=" + true);
	pieTasks(getParams() + "&owner=" + CURRENT_DOMAIN_USER.id + "&pending=" + true);
}

var allTasksListView;

/**
 * updateData() method updates chat sessions on page for different query's from
 * user
 * 
 * @param params
 *            query string contains date, agentId & widgetId
 */
function updateData(params) {
	
	console.log(params);
	// Shows loading image untill data gets ready for displaying
	$('#task-list-based-condition').html(LOADING_HTML);
	
	// Creates backbone collection view
		this.App_Calendar.allTasksListView = new Base_Collection_View({
		url : '/core/api/tasks/based' + params,
		restKey : "task",
		sort_collection : false,
		//sortKey :'due',
		templateKey : "tasks-list",
		cursor : true, page_size : 25,
		individual_tag_name : 'tr',
		postRenderCallback : function(el) {
			$('.tasks-count').html(getCount(this.App_Calendar.allTasksListView.collection.toJSON()));
			includeTimeAgo(el);
		},
		appendItemCallback : function(el)
		{
			includeTimeAgo(el);
		}

	});

	// Fetches data from server
	this.App_Calendar.allTasksListView.collection.fetch();

	// Renders data to tasks list page.
	$('#task-list-based-condition').html(this.App_Calendar.allTasksListView.render().el);

}

/**
 * getParams() method returns a string(used as query param string) contains user
 * selected type and owners
 * 
 * @returns {String} query string
 */
function getParams() {

	var params = "?";

	// Get task type and append it to params
	var criteria = $('#type-tasks').data("selected_item");
	if (criteria)
		params += ("&criteria=" + criteria);
	// Get owner name and append it to params
	var owner = $('#owner-tasks').data("selected_item");
	if(owner == 'my-pending-tasks')
	{
		params += ("&pending=" + true);
		params += ("&owner=" + CURRENT_DOMAIN_USER.id);
		return params;
	}
	if(owner == 'all-pending-tasks')
	{
		params += ("&pending=" + true);
		owner = "";
	}
	if (owner)
		params += ("&owner=" + owner);
	else if(owner == undefined)
		params += ("&owner=" + CURRENT_DOMAIN_USER.id);
	
	return params;
}

/**
 * Completes the selected row related entities from the database based on the url 
 * attribute of the table and fades out the rows from the table
 * 
 * @module Bulk operation for completed task
 * ---------------------------------------------
 * 
 */

$(function(){	
   /**
    * Validates the checkbox status of each row in table body
    * Customizes the delete operation
    * Deletes the entities
    */	
	$('#bulk-complete').live('click', function(event){
		event.preventDefault();
		var index_array = [];
		var data_array = [];
		var checked = false;
		var table = $('body').find('.showCheckboxes');

		$(table).find('tr .tbody_check').each(function(index, element){
			
			// If element is checked store it's id in an array 
			if($(element).is(':checked')){
				
				// Disables mouseenter once checked for delete(To avoid popover in deals when model is checked)
				$(element).closest('tr').on("mouseenter", false);
				index_array.push(index);
				data_array.push($(element).closest('tr').data().toJSON());
				checked = true;
			}
		});
		if(checked){
			$(this).after('<img class="bulk-complete-loading" style="padding-right:5px;margin-bottom:15px" src= "img/21-0.gif"></img>');
			bulk_complete_operation('/core/api/tasks/bulk/complete', index_array, table, data_array);
		}	
		else
            $('body').find(".select-none").html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">&times;</a>You have not selected any records to complete. Please select at least one record to continue.</div>').show().delay(3000).hide(1);
		
	});
	
});

/**
 * Bulk operations - delete function
 * Deletes the entities by sending their ids as form data of ajax POST request 
 * and then fades out the rows from the table
 * @method bulk_delete_operation
 * @param {Steing} url to which the request has to be sent
 * @param {Array} id_array holds array of ids of the entities to be deleted
 * @param {Array} index_array holds array of row indexes to be faded out
 * @param {Object} table content as html object
 * @param {Array} data_array holds array of entities 
 */
function bulk_complete_operation(url, index_array, table, data_array){
	
	var tasks = [];
	$.each(data_array, function(index, task){
		var contacts = task.contacts;
		task.contacts = [];
		$.each(contacts, function(i, contact){
			task.contacts.push(contact.id);
			tasks.push(task);
		});
		task.is_complete = true;
		task.owner_id = task.taskOwner.id;
	});
	$.ajax({
		url: url,
		type: 'POST',
		data: JSON.stringify(tasks),
		contentType : 'application/json',
		success: function() {
			$(".bulk-complete-loading").remove();
			
			var tbody = $(table).find('tbody');
			// To remove table rows on delete 
			for(var i = 0; i < index_array.length; i++) 
				$(tbody).find('tr:eq(' + index_array[i] + ')').find("div:lt(3)").css("text-decoration","line-through");
		}
	});
}
		/**
 * 
 * Describes the given object is an array or not
 * 
 * @param {Object}
 *            a to verify array or not
 * @returns {Boolean} true if given param is array else false
 */
function isArray(a)
{
    return Object.prototype.toString.apply(a) === '[object Array]';
}

/**
 * Loads events from google calendar using tokens either from cookies or token
 * from backend when token in cookie is epired
 * 
 * @param callback
 */
function load_events_from_google(callback)
{
	// Name of the cookie to store/fetch calendar prefs. Current user id is set
	// in cookie name to avoid
	// showing tasks in different users calendar if logged in same browser
	var google_calendar_cookie_name = "_agile_google_calendar_prefs_" + CURRENT_DOMAIN_USER.id;
	
	// Reads existing cookie
	var _agile_calendar_prefs_cookie = readCookie(google_calendar_cookie_name);
	
	// If cookie is not null, then it check it token is still valid; checks
	// based on expiry time.
	if(_agile_calendar_prefs_cookie && _agile_calendar_prefs_cookie != "null")
	{
		var prefs = JSON.parse(_agile_calendar_prefs_cookie);

		// Checks if token expired. It considers expire before 2 minutes window
		// of actual expiry time.
		if(prefs.expires_at - (2 * 60 * 1000)  >= new Date().getTime())
		{
			// Returns token to the callback accoring to specification of gcal
			get_google_calendar_event_source(prefs, callback);
			return;
		}
		
		// Erases cookie if token is expired and sends request to backend to
		// acquire new token
		erase_google_calendar_prefs_cookie()
		
	}
	
	// Fetch new token from backen, saves in cookie, and token is returned to gcal  
	$.getJSON('/core/api/calendar-prefs/refresh-token', function (prefs) {
		if(!prefs)
			return;
		
		// Creates cookie
		createCookie(google_calendar_cookie_name, JSON.stringify(prefs));
		get_google_calendar_event_source(prefs, callback);
 	});
}

/**
 * Erases calendar cookie
 */
function erase_google_calendar_prefs_cookie()
{
	var google_calendar_cookie_name = "_agile_google_calendar_prefs_" + CURRENT_DOMAIN_USER.id;
	eraseCookie(google_calendar_cookie_name);
}

// Returns token in to gcal callback in specified format
function get_google_calendar_event_source(data, callback)
{
	
	if (callback && typeof (callback) === "function")
		callback({token:data.access_token, dataType:'agile-gcal', className:"agile-gcal"});
}



/**
 * Shows the calendar
 */
function showCalendar() {
	
	// Customized fetch options
	_init_gcal_options();
	
  $('#calendar').fullCalendar({
    	
       /**
		 * Renders the events displaying currently on fullCalendar
		 * 
		 * @method events
		 * @param {Object}
		 *            start fullCalendar current section start day date object
		 * @param {Object}
		 *            end fullCalendar current section end day date object
		 * @param {function}
		 *            callback displays the events on fullCalendar
		 * 
		 */
    	
        eventSources :[{events: function (start, end, callback) {
        
            $.getJSON('/core/api/events?start=' + start.getTime() / 1000 + "&end=" + end.getTime() / 1000, function (doc) {
                
            	if(doc)
            	{
            		  
            	    callback(doc);
            		
            	}
            });
        }},
        {
        	dataType : 'agile-gcal'
        }],
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        loading: function (bool) {
            if (bool) {
            	
            	  $("#loading_calendar_events").remove();
            	  $('.fc-header-left').append('<span id="loading_calendar_events" style="margin-left:5px;vertical-align:middle">loading...</span>').show();
                $('.fc-header-left').show();
                
            } else {
              // $('#loading').hide();
            	 $("#loading_calendar_events").hide();
                $('#subscribe-ical').css('display','block');
                start_tour('calendar');
            }
        },
        selectable: true,
		selectHelper: true,
		editable: true,
		theme: false,
	   /**
		 * Shows event pop-up modal with pre-filled date and time values, when
		 * we select a day or multiple days of the fullCalendar
		 * 
		 * @method select
		 * @param {Object}
		 *            start start-date of the event
		 * @param {Object}
		 *            end end-date of the event
		 * @param {Boolean}
		 *            allDay
		 */	
        select: function(start, end, allDay) {
        	// Show a new event
            $('#activityModal').modal('show');
            highlight_event();
            
            // Set Date for Event
            var dateFormat = 'mm/dd/yyyy';
            $('#task-date-1').val(start.format(dateFormat));
            $("#event-date-1").val(start.format(dateFormat));
            $("#event-date-2").val(end.format(dateFormat));

            
            // Set Time for Event
            if ((start.getHours() == 00) && (end.getHours() == 00) && (end.getMinutes() == 00)) {
                $('#event-time-1').val('');
                $('#event-time-2').val('');
            } else {
                $('#event-time-1').val((start.getHours() < 10 ? "0" : "") + start.getHours() + ":" + (start.getMinutes() < 10 ? "0" : "") + start.getMinutes());
                $('#event-time-2').val((end.getHours() < 10 ? "0" : "") + end.getHours() + ":" + (end.getMinutes() < 10 ? "0" : "") + end.getMinutes());
            }
            
		},
	   /**
		 * Updates the event by changing start and end date, when it is dragged
		 * to another location on fullCalendar.
		 * 
		 * @method eventDrop
		 * @param {Object}
		 *            event1 event with new start and end date
		 * @param {Number}
		 *            dayDelta holds the number of days the event was moved
		 *            forward
		 * @param {Number}
		 *            minuteDelta holds the number of minutes the event was
		 *            moved forward
		 * @param {Boolean}
		 *            allDay weather the event has been dropped on a day in
		 *            month view or not
		 * @param {Function}
		 *            revertFunc sets the event back to it's original position
		 */	
		eventDrop: function(event1, dayDelta, minuteDelta, allDay, revertFunc) {      
	    
			
			// Confirm from the user about the change
			if (!confirm("Are you sure about this change?")) {
	            revertFunc();
	            return;
	        }
			
			var event = $.extend(true, {}, event1);
			
			
			// Update event if the user changes it in the calendar
			event.start = new Date(event.start).getTime()/1000;
	        event.end = new Date(event.end).getTime()/1000;
	        if(event.end == null || event.end == 0)	        	
	        	event.end = event.start;
	        var eventModel = new Backbone.Model();
	        eventModel.url = 'core/api/events';
	        
	        eventModel.save(event);	        
   	    },
   	   /**
		 * Updates or deletes an event by clicking on it
		 * 
		 * @method eventClick
		 * @param {Object}
		 *            event to update or delete
		 */ 
   	    eventClick: function (event) {
   	    	if(isNaN(event.id))
   	    		return;
   	    	// Deserialize
   	    	deserializeForm(event, $("#updateActivityForm"));
   	    	
   	    	// Set time for update Event
            $('#update-event-time-1').val((event.start.getHours() < 10 ? "0" : "") + event.start.getHours() + ":" + (event.start.getMinutes() < 10 ? "0" : "") +event.start.getMinutes());
            $('#update-event-time-2').val((event.end.getHours() < 10 ? "0" : "") + event.end.getHours() + ":" + (event.end.getMinutes() < 10 ? "0" : "") + event.end.getMinutes());
           
         // Set date for update Event
            var dateFormat = 'mm/dd/yyyy';
            $("#update-event-date-1").val((event.start).format(dateFormat));
            $("#update-event-date-2").val((event.end).format(dateFormat));
            
   	    	// hide end date & time for all day events
            if(event.allDay)
            {
            	$("#update-event-date-2").closest('.row').hide();
            	$('#update-event-time-1').closest('.control-group').hide();
            }
            else 
            {
            	$('#update-event-time-1').closest('.control-group').show();
            	$("#update-event-date-2").closest('.row').show();
            }
   	    	
         // Show edit modal for the event
            $("#updateActivityModal").modal('show');
   	    	return false;
   	    }
   	    
    });
}

$(function(){
	$("#sync-google-calendar").die().live('click', function(e){
		e.preventDefault();
		
		// URL to return, after fetching token and secret key from LinkedIn
		var callbackURL = window.location.href;
		
		// For every request of import, it will ask to grant access
		window.location = "/scribe?service=google_calendar&return_url=" + encodeURIComponent(callbackURL);
	});
	
	$("#sync-google-calendar-delete").die().live('click', function(e){
		e.preventDefault();
		
		var disabled = $(this).attr("disabled");
		if(disabled)
			return;
		
		$(this).attr("disabled", "disabled");
		
		$(this).after(LOADING_HTML);
		App_Widgets.calendar_sync_google.model.url = "/core/api/calendar-prefs"
		console.log(App_Widgets.calendar_sync_google.model.destroy({success : function(){
			
			App_Widgets.calendar_sync_google.model.clear();
			App_Widgets.calendar_sync_google.model.url = "/core/api/calendar-prefs/get"
				App_Widgets.calendar_sync_google.render(true);
			erase_google_calendar_prefs_cookie();
			
		}}));
	});
});

// UI Handlers for activities - event & task
/**
 * activity-modal.js is a script file to deal with common UI Handlers for
 * activities - event & task from client side.
 * 
 * @module Activities  
 * 
 * author: Rammohan
 */
$(function() {

	/**
	 * Saves the content of activity modal by verifying whether it is a task or
	 * event
	 */
	$('#task_event_validate').die().live('click', function(e) {
		e.preventDefault();

		console.log(this);
		// Save functionality for task by checking task or not
		if ($("#hiddentask").val() == "task") {

			save_task('taskForm', 'activityModal', false, this);
		} else {

			// Save functionality for event
			save_event('activityForm', 'activityModal', false, this);
		}
	}); // End of Task and Event Validation function

	// Hide event of activity modal
	/**
	 * Removes appended contacts from related-to field of task form and
	 * validation error messages if any.
	 */
	$('#activityModal').on('hidden', function(e) {

		// Remove appended contacts from related-to
		$("#taskForm").find("li").remove();

		// Remove validation error messages
		remove_validation_errors('activityModal');		
		
		if(e.target.id=='activityModal')
		{
			$('#activityForm #allDay').removeAttr('checked');
			$('#activityForm #event-time-1').closest('.control-group').show();
			$('#activityForm #event-date-2').closest('.row').show(); // only of modal, no inside modal
		}
		
		resetForm($("#taskForm"));
	});
	
	/**
	 * Hide end-date & time for all day events.
	 */
	$('#activityForm #allDay').live('click',function(e){
		
		if($(this).is(':checked'))
		{	
			$('#activityForm #event-time-1').closest('.control-group').hide();
			$('#activityForm #event-date-2').closest('.row').hide();
		}
		else 
		{
			$('#activityForm #event-time-1').closest('.control-group').show();
			$('#activityForm #event-date-2').closest('.row').show();
		}
	});
	
	$('#updateActivityForm #allDay').live('click',function(e){
		
		if($(this).is(':checked'))
		{
			$('#updateActivityForm #update-event-time-1').closest('.control-group').hide();
			$('#updateActivityForm #update-event-date-2').closest('.row').hide();
		}
		else 
		{
			$('#updateActivityForm #update-event-time-1').closest('.control-group').show();
			$('#updateActivityForm #update-event-date-2').closest('.row').show();
		}
	});
});
/**
 * Loading spinner shown while loading
 */
var LOADING_HTML = '<img class="loading" style="padding-right:5px;" height="32px" width="32px" src= "img/21-0.gif"></img>';

/**
 * Loading images shown which contacts are being fetched on page scroll
 */
var LOADING_ON_CURSOR = '<img class="loading" style="padding-right:5px" src= "img/ajax-loader-cursor.gif"></img>';

/**
 * Default image shown for contacts if image is not available
 */
var DEFAULT_GRAVATAR_url = "https://dpm72z3r2fvl4.cloudfront.net/css/images/user-default.png";

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for ( var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}

	return vars;
}

/**
 * Creates a select fields with the options fetched from the url specified,
 * fetches the collection from the url and creates a select element and appends
 * to the selectId sent, it takes the template to fill the values and also takes
 * a callback to deserialize the select field if form is being edited
 * 
 * @param selectId
 *            to append the options
 * @param url
 *            To fetch collection
 * @param parseKey
 *            parses the collection
 * @param callback
 *            to process select field after being created
 * @param template
 *            Template to create options
 */
function fillSelect(selectId, url, parseKey, callback, template, isUlDropdown, el, defaultSelectOption)
{
	// Fetch Collection from URL
	var collection_def = Backbone.Collection.extend({ url : url,
	/*
	 * parse : function(response) {
	 * 
	 * if (response && response[parseKey]) return response[parseKey];
	 * 
	 * return response; }
	 */
	});

	// Prepend Loading
	$loading = $(LOADING_HTML);
	$("#" + selectId).after(LOADING_HTML);

	// Creates a collection and fetches the data from the url set in collection
	var collection = new collection_def();

	// On successful fetch of collection loading symbol is removed and options
	// template is populated and appended in the selectId sent to the function
	collection.fetch({ success : function()
	{

		// Remove loading
		$('.loading').remove();

		// Delete prev options if any by verifying whether ul drop down or
		// select drop down
		if (isUlDropdown)
			$("#" + selectId, el).empty();
		else
		{
			if (!defaultSelectOption)
				defaultSelectOption = "Select...";

			$("#" + selectId, el).empty().append('<option class="default-select" value="">' + defaultSelectOption + '</option>');
		}

		// Iterates though each model in the collection and
		// populates the template using handlebars
		$.each(collection.toJSON(), function(index, model)
		{
			// Convert template into HTML
			var modelTemplate = Handlebars.compile(template);
			var optionsHTML = modelTemplate(model);
			$("#" + selectId, el).append(optionsHTML);
		});

		// If callback is present, it is called to deserialize
		// the select field
		if (callback && typeof (callback) === "function")
		{
			// execute the callback, passing parameters as
			// necessary
			callback();
		}
	}

	});
}

// Fill selects with tokenized data
/**
 * fillTokenizedSelect if similar to fillSelect, but data is not fetched it is
 * sent to the function which creates options based on the array of values sent.
 * It also includes callback function to deseriazlie
 * 
 * @param selectId
 *            to To append options
 * @param array
 *            list of values to be used to create options
 * @param callback
 *            function to be called after select if created
 */
function fillTokenizedSelect(selectId, array, callback, defaultSelectOption)
{
	if (!defaultSelectOption)
		defaultSelectOption = "Select...";
	
	$("#" + selectId).empty().append('<option value="">'+defaultSelectOption+'</option>');

	// Iterates though each element in array and creates a options to select
	// field and
	// appends to the id sent
	$.each(array, function(index, element)
	{
		$("#" + selectId).append('<option value=' + '"' + element + '">' + element + '</option>');
	});

	// If callback exists it is called after select field is created
	if (callback && typeof (callback) === "function")
	{
		// execute the callback, passing parameters as necessary
		callback();
	}
}

/**
 * Fills milestore in to dorpdown
 * 
 * @param ulId
 * @param array
 */
function fillMilestones(ulId, array)
{
	$("#" + ulId).empty();
	$.each(array, function(index, element)
	{
		$("#" + ulId).append('<a href="#"><li value=' + '"' + element + '">' + element + '</li></a>');
	});
}
function btnDropDown(contact_id, workflow_id)
{

}

/**
 * Removes the specified property from the contact
 */
function delete_contact_property(contact, propertyName)
{

	// Iterates through the properties of the contact, finds the property with
	// the name specified and removes the property from the contact
	for ( var index = 0; index < contact.properties.length; index++)
	{
		if (contact.properties[index].name == propertyName)
		{
			contact.properties.splice(index, 1);
			--index;
		}
	}
	return contact;
}

// Delete contact tag
/**
 * Removes a tag from the contact, tag name is to be specified to remove the tag
 */
function delete_contact_tag(contact, tagName)
{

	// Iterates though tags in the contact and removes the tag which matches the
	// tag name parameter of the function
	$.each(contact.tagsWithTime, function(index, tagObject)
	{
		if (tagObject.tag == tagName)
		{
			// Tag should be removed from tags also,
			// or deleted tag will be added again
			contact.tags.splice(index, 1);
			contact.tagsWithTime.splice(index, 1);
			return false;
		}
		contact.tags.push(tagObject.tag);
	});

	return contact;
}

/**
 * Adds a new tag to contact
 */
function add_contact_tags(contact, newTags)
{
	for ( var index = 0; index < newTags.length; index++)
	{
		contact.tags.push(newTags[index])
	}
	return contact;
}

/**
 * Creates a property json object
 * 
 * @param name
 * @param id
 * @param type
 */
function property_JSON(name, id, type)
{
	var json = {};

	if (type == undefined)
		json.type = "SYSTEM";
	else
		json.type = type;

	json.name = name;

	var elem = $('#' + id), elem_type = elem.attr('type'), elem_value;

	if (elem_type == 'checkbox')
		elem_value = elem.is(':checked') ? 'on' : 'off';
	else
		elem_value = elem.val();

	json.value = elem_value;
	return json;
}

// Sends post request using backbone model to given url. It is a generic
// function, can be called to save entity to database
function saveEntity(object, url, callback)
{
	var model = new Backbone.Model();
	model.url = url;
	model.save(object, { success : function(data)
	{
		if (callback && typeof (callback) === "function")
		{
			// execute the callback, passing parameters as necessary
			callback(data);
		}
	} });
}

/**
 * Returns GMT time.
 * 
 * @param date
 * @returns
 */
function getGMTTimeFromDate(date)
{
	var current_sys_date = new Date();
	console.log(new Date().getHours());
	console.log(new Date().getMinutes());
	console.log(new Date().getSeconds());
	console.log(date.getYear() + "," + date.getMonth() + "," + date.getDate())
	date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

	// Adding offset to date returns GMT time
	return date.getTime();
}

/**
 * Returns local epoch time based form GMT time
 * 
 * @param time_in_milliseconds
 * @returns {Number}
 */
function getLocalTimeFromGMTMilliseconds(time_in_milliseconds)
{
	var date = new Date(parseInt(time_in_milliseconds));

	// Subtracting epoch offset from epoch time;
	return date.getTime() - date.getTimezoneOffset();
}

/**
 * ical.js is a script file that runs when user clicks on subscribe iCal feed.
 * It fetches apikey and domain name of current user. It appends apikey and
 * domain name to url.
 * 
 * author: Naresh
 */
$("#subscribe-ical").live('click', function(event)
{
	event.preventDefault();
	set_api_key();
});

/**
 * Fetches APIKey of current user
 * 
 * @method set_api_key
 */
function set_api_key()
{
	var api_key_model = Backbone.Model.extend({ url : 'core/api/api-key' });

	var model = new api_key_model();
	var data = model.fetch({ success : function(data)
	{
		var api_key = data.get('api_key');
		set_url_domain(api_key);
	} });
}
/**
 * 
 * Gets domain of current user using Backbone.
 * 
 * @method set_url_domain
 * @param apiKey -
 *            apiKey of current user.
 */
function set_url_domain(apiKey)
{
	var domain = window.location.hostname.split(".")[0];
	set_url(apiKey, domain);
}

/**
 * 
 * Sets url with domain and apiKey
 * 
 * @method set_url
 * @param apiKey -
 *            apiKey of current user.
 * 
 * @param domain -
 *            domain of current user.
 */
function set_url(apiKey, domain)
{
	var url = "webcal://" + domain + ".agilecrm.com/ical/" + apiKey;
	$('#ical-feed').attr('href', url);
	$('#ical-feed').text(url);
	console.log(url);
}

/**
 * When Send Mail is clicked from Ical Modal, it hides the ical modal and shows
 * the ical-send email modal.
 */
$('#send-ical-email').live('click', function(event)
{
	event.preventDefault();

	$("#icalModal").modal('hide');

	// Removes previous modals if exist.
	if ($('#share-ical-by-email').size() != 0)
		$('#share-ical-by-email').remove();

	// Gets current user
	var CurrentuserModel = Backbone.Model.extend({ url : '/core/api/users/current-user', restKey : "domainUser" });

	var currentuserModel = new CurrentuserModel();

	currentuserModel.fetch({ success : function(data)
	{

		var model = data.toJSON();

		// Insert ical-url into model
		var icalURL = $('#icalModal').find('#ical-feed').text();
		model.ical_url = icalURL;

		var emailModal = $(getTemplate("share-ical-by-email", model));
		
		var description = $(emailModal).find('textarea').val();
		
		description = description.replace(/<br\/>/g, "\r\n");

		$(emailModal).find('textarea').val(description);

		emailModal.modal('show');

		// Send ical info email
		send_ical_info_email(emailModal);
	} });
});

/**
 * Sends email with ical data to current-user email.
 * 
 * @method send_ical_info_email
 * @param emailModal -
 *            ical-email-modal
 */
function send_ical_info_email(emailModal)
{
	// When Send Clicked, validate the form and send email.
	$('#shareIcalMail')
			.die()
			.live(
					'click',
					function(e)
					{
						e.preventDefault();

						// if not valid
						if (!isValidForm($('#shareIcalMailForm')))
							return;

						var json = serializeForm("shareIcalMailForm");
						json.body = json.body.replace(/\r\n/g, "<br/>");

						var url = 'core/api/emails/send-email?from=' + encodeURIComponent(json.from) + '&to=' + encodeURIComponent(json.to) + '&subject=' + encodeURIComponent(json.subject) + '&body=' + encodeURIComponent(json.body);

						// Shows message
						$save_info = $('<img src="img/1-0.gif" height="18px" width="18px"></img>&nbsp;&nbsp;<span><p class="text-success" style="color:#008000; font-size:15px; display:inline-block"> <i>Sending mail...</i></p></span>');
						$("#msg", this.el).append($save_info);
						$save_info.show().delay(2000).fadeOut("slow");

						// Navigates to previous page on sending email
						$.post(url, function()
						{
							emailModal.modal('hide');
						});

					});
}
// We store one template compiled - if repetitive templates are called, we save time on compilations
var Handlebars_Compiled_Templates = {};

/**
 * Loads the template (script element with its id attribute as templateName
 * appended with "-template". For example if the templateName is "tasks", then
 * the script element id should be as "tasks-template") from html document body.
 * 
 * Compiles the loaded template using handlebars and replaces the context
 * related property names (which are under mustache like {{name}}) in the
 * template, with their associated values, on calling the context with the
 * compiled template.
 * 
 * @method getTemplate
 * @param {String}
 *            templateName name of the tempate to be loaded
 * @param {Object}
 *            context json object to call with the compiled template
 * @param {String}
 *            download verifies whether the template is found or not
 * 
 * @param {callback}
 *            To decide whether templates should be downloaded synchronously or
 *            asynchronously.
 * 
 * @returns compiled html with the context
 */
function getTemplate(templateName, context, download, callback)
{
	var is_async = callback && typeof (callback) == "function";

	// Check if it is (compiled template) present in templates
	if (Handlebars_Compiled_Templates[templateName])
		return Handlebars_Compiled_Templates[templateName](context);
	else
		Handlebars_Compiled_Templates = {};

	// Check if source is available in body
	if (HANDLEBARS_PRECOMPILATION)
	{
		var template = Handlebars.templates[templateName + "-template"];

		// If teplate is found
		if (template)
		{
			// If callback is sent then template is downloaded asynchronously
			// and content is sent in callback
			if (is_async)
			{
				callback(template(context));
				return;
			}

			// console.log("Template " + templateName + " found");
			return template(context);
		}
	}
	else
	{
		var source = $('#' + templateName + "-template").html();
		if (source)
		{
			var template = Handlebars.compile(source);
			Handlebars_Compiled_Templates[templateName] = template;

			// If callback is sent then template is downloaded asynchronously
			// and content is sent
			if (is_async)
			{
				callback(template(context));
				return;
			}
			return template(context);
		}
	}

	// Check if the download is explicitly set to no
	if (download == 'no')
	{
		console.log("Not found " + templateName);
		return;
	}

	// Stores urls of templates to be downloaded.
	var template_relative_urls = getTemplateUrls(templateName);

	if (is_async)
	{
		load_templates_async(templateName, context, template_relative_urls, callback);
		return;
	}

	load_templates_sync(template_relative_urls);

	return getTemplate(templateName, context, 'no');
}

/**
 * If the template is not found in document body, then template paths are built
 * based on template name and download requests are sent. if it is down-loaded
 * append it to the document body. And call the function (getTemplate) again by
 * setting the download parameter to "no"
 */
function getTemplateUrls(templateName)
{
	// Stores template URLS
	var template_relative_urls = [];

	if (templateName.indexOf("settings") == 0)
	{
		template_relative_urls.push("settings.js");
	}
	if (templateName.indexOf("admin-settings") == 0)
	{
		template_relative_urls.push("admin-settings.js");
	}
	if (templateName.indexOf("continue") == 0)
	{
		template_relative_urls.push("continue.js");
	}
	if (templateName.indexOf("all-domain") == 0)
	{
		template_relative_urls.push("admin.js");
	}
	if (templateName.indexOf("contact-detail") == 0 || templateName.indexOf("timeline") == 0 || templateName.indexOf("company-detail") == 0)
	{
		template_relative_urls.push("contact-detail.js");
		if (HANDLEBARS_PRECOMPILATION)
			template_relative_urls.push("contact-detail.html");
	}
	if (templateName.indexOf("contact-filter") == 0 || templateName.indexOf("filter-contacts") == 0)
	{
		template_relative_urls.push("contact-filter.js");
	}
	if (templateName.indexOf("contact-view") == 0 || templateName.indexOf("contact-custom") == 0 || templateName.indexOf("contacts-custom") == 0 || templateName
			.indexOf("contacts-grid") == 0)
	{
		template_relative_urls.push("contact-view.js");
	}
	if (templateName.indexOf("bulk-actions") == 0)
	{
		template_relative_urls.push("bulk-actions.js");
	}
	if (templateName.indexOf("case") == 0)
	{
		template_relative_urls.push("case.js");
	}
	if (templateName.indexOf("document") == 0)
	{
		template_relative_urls.push("document.js");
	}
	if (templateName.indexOf("gmap") == 0)
	{
		template_relative_urls.push("gmap.js");
	}
	if (templateName.indexOf("report") == 0)
	{
		template_relative_urls.push("report.js");
	}
	if (templateName.indexOf("webrule") == 0)
	{
		template_relative_urls.push("web-rules.js");
	}
	if (templateName.indexOf("workflow") == 0 || templateName.indexOf("campaign") == 0 || templateName.indexOf("trigger") == 0)
	{
		template_relative_urls.push("workflow.js");
	}
	if (templateName.indexOf("purchase") == 0 || templateName.indexOf("subscription") == 0 || templateName.indexOf("subscribe") == 0 || templateName
			.indexOf("invoice") == 0)
	{
		template_relative_urls.push("billing.js");
	}
	
	if (templateName.indexOf("widget") == 0)
	{
		template_relative_urls.push("widget.js");
	}
	if(templateName.indexOf("helpscout") == 0)
	{
		template_relative_urls.push("helpscout.js");
	}
	else if(templateName.indexOf("clickdesk") == 0)
	{
		template_relative_urls.push("clickdesk.js");
	}
	else if(templateName.indexOf("zendesk") == 0)
	{
		template_relative_urls.push("zendesk.js");
	}
	else if(templateName.indexOf("freshbooks") == 0)
	{
		template_relative_urls.push("freshbooks.js");
	}
	else if(templateName.indexOf("linkedin") == 0)
	{
		template_relative_urls.push("linkedin.js");
	}
	else if(templateName.indexOf("rapleaf") == 0)
	{
		template_relative_urls.push("rapleaf.js");
	}
	else if(templateName.indexOf("stripe") == 0)
	{
		template_relative_urls.push("stripe.js");
	}
	else if(templateName.indexOf("twilio") == 0)
	{
		template_relative_urls.push("twilio.js");
	}
	else if(templateName.indexOf("twitter") == 0)
	{
		template_relative_urls.push("twitter.js");
	}
	else if(templateName.indexOf("xero") == 0)
	{
		template_relative_urls.push("xero.js");
	}

	if (templateName.indexOf("socialsuite") == 0)
	{
		template_relative_urls.push("socialsuite.js");

		if (HANDLEBARS_PRECOMPILATION)
			template_relative_urls.push("socialsuite.html");
	}
	return template_relative_urls;
}

/**
 * Takes list of templates to downloaded and pops URL from list and sends
 * request to download asynchronously. After last URL in list is removed and
 * download request is sent, on callback of downloaded URL, new request is sent
 * to fetch next template URL in the list. Continues sending requests till list
 * is empty.
 * 
 * @param templateName
 * @param context
 * @param template_relative_urls
 * @param callback
 */
function load_templates_async(templateName, context, template_relative_urls, callback)
{
	// Removes last url from the list to fetch template.
	var url = template_relative_urls.pop();

	// URL is undefined when list is empty which means all templates specified
	// in array are downloaded. As list is empty get template is called with
	// download parameter 'no' which fills and sends template in callback
	if (!url)
	{
		getTemplate(templateName, context, 'no', callback);
		return;
	}

	// Fetches template and call current method in recursion to download other
	// templates in list
	downloadTemplate(url, function()
	{
		{
			// Recursion call to download other templates
			load_templates_async(templateName, context, template_relative_urls, callback);
		}
	});
}

/**
 * Sends request to download template synchronously
 * 
 * @param template_relative_urls
 */
function load_templates_sync(template_relative_urls)
{
	for ( var index in template_relative_urls)
		downloadTemplate(template_relative_urls[index]);
}

String.prototype.endsWith = function(suffix)
{
	return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

/**
 * Downloads the template synchronously (stops other browsing actions) from the
 * given url and returns it
 * 
 * @param {String}
 *            url location to download the template
 * @returns down-loaded template content
 */
function downloadTemplate(url, callback)
{

	var dataType = 'html';

	// If JS
	if (url.endsWith("js") && HANDLEBARS_PRECOMPILATION)
		dataType = 'script';

	// If Precompiled is enabled, we change the directory to precompiled. If
	// pre-compiled flat is set true then template path is sent accordingly
	if (HANDLEBARS_PRECOMPILATION)
	{
		url = "tpl/min/precompiled/" + url;
	}
	else
		url = "tpl/min/" + url;
	console.log(url + " " + dataType);

	// If callback is sent to this method then template is fetched synchronously
	var is_async = false;
	if (callback && typeof (callback) === "function")
		is_async = true;

	jQuery.ajax({ url : url, dataType : dataType, success : function(result)
	{
		// If HTMl, add to body
		if (dataType == 'html')
			$('body').append((result));

		if (is_async)
			callback(result);
	}, async : is_async });

	return "";
}

/**
 * Iterates the given "items", to find a match with the given "name", if found
 * returns the value of its value attribute
 * 
 * @param {Object}
 *            items array of json objects
 * @param {String}
 *            name to get the value (of value atribute)
 * @returns value of the matched object
 */
function getPropertyValue(items, name)
{
	if (items == undefined)
		return;

	for ( var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name)
			return items[i].value;
	}
}

/**
 * Returns contact property based on the name of the property
 * 
 * @param items :
 *            porperties in contact object
 * @param name :
 *            name of the property
 * @returns
 */
function getProperty(items, name)
{
	if (items == undefined)
		return;

	for ( var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name)
			return items[i];
	}
}

/**
 * Returns contact property based on its property name and subtype
 */
function getPropertyValueBySubtype(items, name, subtype)
{
	if (items == undefined)
		return;

	for ( var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name && items[i].subtype == subtype)
			return items[i].value;
	}
}

/**
 * Returns contact property based on the sub type (LINKEDIN, TWITTER, URL, SKYPE
 * etc..) of the property
 * 
 * @param items :
 *            properties list
 * @param name :
 *            name of the property
 * @param type :
 *            type of the property
 * @param subtype :
 *            subtype of property
 * @returns
 */
function getPropertyValueBytype(items, name, type, subtype)
{
	if (items == undefined)
		return;

	// Iterates though each property object and compares each property by name
	// and its type
	for ( var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name)
		{
			if (type && type == items[i].type)
			{
				if (subtype && subtype == items[i].subtype)
					return items[i].value;
			}

			if (subtype && subtype == items[i].subtype)
			{
				return items[i].value;
			}
		}
	}
}

/**
 * Returns list of custom properties. used to fill custom data in fields in
 * continue contact
 * 
 * @param items
 * @returns
 */
function getContactCustomProperties(items)
{
	if (items == undefined)
		return items;

	var fields = [];
	for ( var i = 0; i < items.length; i++)
	{
		if (items[i].type == "CUSTOM" && items[i].name != "image")
		{
			fields.push(items[i]);
		}
	}
	return fields;
}

/**
 * Turns the first letter of the given string to upper-case and the remaining to
 * lower-case (EMaiL to Email).
 * 
 * @param {String}
 *            value to convert as ucfirst
 * @returns converted string
 */
function ucfirst(value)
{
	return (value && typeof value === 'string') ? (value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) : '';

}

/**
 * Creates titles from strings. Replaces underscore with spaces and capitalize
 * first word of string.
 * 
 * @param value
 * @returns
 */
function titleFromEnums(value)
{
	if (!value)
		return;

	var str = value.replace(/_/g, ' ');

	return ucfirst(str.toLowerCase());
}

/**
 * Counts total number of attributes in a json object
 * 
 * @param obj
 * @returns {Number}
 */
function countJsonProperties(obj)
{
	var prop;
	var propCount = 0;

	for (prop in obj)
	{
		propCount++;
	}
	return propCount;
}

/**
 * Get the current contact property
 * 
 * @param value
 * @returns {String}
 */
function getCurrentContactProperty(value)
{
	if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
	{
		var contact_properties = App_Contacts.contactDetailView.model.get('properties')
		return getPropertyValue(contact_properties, value);
	}
}

function getCount(collection)
{
	if (collection[0] && collection[0].count && (collection[0].count != -1))
		return "(" + collection[0].count + " Total)";
	else
		return "(" + collection.length + " Total)";
}

/**
 * Returns id from hash. Id must be last in hash.
 */
function getIdFromHash()
{

	// Returns "workflows" from "#workflows"
	var hash = window.location.hash.substr(1);

	// remove trailing slash '/'
	if (hash.substr(-1) === "/")
	{
		hash = hash.replace(/\/$/, "");
	}

	// Returns campaign_id from "workflow/all-contacts/campaign_id".
	var id = hash.split('/').pop();

	return id;
}

function updateCustomData(el)
{
	$(".custom-data", App_Contacts.contactDetailView.el).html(el)
}
$(function()
{

    /**
     * Helper function to return the value of a property matched with the given
     * name from the array of properties
     * 
     * @method getPropertyValue
     * @param {Object}
     *                items array of objects
     * @param {String}
     *                name to get matched object value
     * @returns value of the matched object
     */
    Handlebars.registerHelper('getPropertyValue', function(items, name)
    {
	return getPropertyValue(items, name);
    });

    /**
     * Helper function to return the value of property based on sub-type of the
     * property
     */
    Handlebars.registerHelper('getPropertyValueBySubtype', function(items, name, subtype)
    {
	return getPropertyValueBySubtype(items, name, subtype);
    });

    /**
     * Helper function to return the value of property based on type of the
     * property
     */
    Handlebars.registerHelper('getPropertyValueBytype', function(items, name, type, subtype)
    {
	return getPropertyValueBytype(items, name, type, subtype);
    });

    /**
     * Returns twitter handle based on the twitter url of the profile. Accepts
     * string URL and splits at last "/" and returns handle.
     */
    Handlebars.registerHelper('getTwitterHandleByURL', function(value)
    {

	if (value.indexOf("https://twitter.com/") != -1)
	    return value;

	value = value.substring(value.lastIndexOf("/") + 1);
	console.log(value);

	return value;
    });

    /**
     * 
     */
    Handlebars.registerHelper('getContactCustomProperties', function(items, options)
    {
	var fields = getContactCustomProperties(items);
	if (fields.length == 0)
	    return options.inverse(fields);

	return options.fn(fields);

    });

    /**
     * Returns custom fields without few fields like LINKEDIN or TWITTER or
     * title fields
     */
    Handlebars.registerHelper('getContactCustomPropertiesExclusively', function(items, options)
    {

	var exclude_by_subtype = [
		"LINKEDIN", "TWITTER"
	];
	var exclude_by_name = [
	    "title"
	];

	var fields = getContactCustomProperties(items);

	var exclusive_fields = [];
	for ( var i = 0; i < fields.length; i++)
	{
	    if (jQuery.inArray(fields[i].name, exclude_by_name) != -1 || (fields[i].subtype && jQuery.inArray(fields[i].subtype, exclude_by_subtype) != -1))
	    {
		continue;
	    }

	    exclusive_fields.push(jQuery.extend(true, {}, fields[i]));
	}
	if (exclusive_fields.length == 0)
	    return options.inverse(exclusive_fields);

	$.getJSON("core/api/custom-fields/type/DATE", function(data)
	{

	    if (data.length == 0)
		return;

	    for ( var j = 0; j < data.length; j++)
	    {
		for ( var i = 0; i < exclusive_fields.length; i++)
		{
		    if (exclusive_fields[i].name == data[j].field_label)
			try
			{
			    var value = exclusive_fields[i].value * 1000;

			    if (!isNaN(value))
			    {
				exclusive_fields[i].value = value;
				exclusive_fields[i]["subtype"] = data[j].field_type;
			    }

			}
			catch (err)
			{
			    exclusive_fields[i].value = exclusive_fields[i].value;
			}
		}
	    }
	    updateCustomData(options.fn(exclusive_fields));
	});

	return options.fn(exclusive_fields)

    });

    Handlebars.registerHelper('urlEncode', function(url, key, data)
    {

	var startChar = "&";
	if (url.indexOf("?") != -1)
	    startChar = "&";

	var encodedUrl = url + startChar + key + "=" + escape(JSON.stringify(data));
	// console.log(encodedUrl.length + " " + encodedUrl);
	return encodedUrl;
    });

    Handlebars.registerHelper('encodeString', function(url)
    {
	return encodeURIComponent(url);
    });

    /**
     * Helper function to return image for an entity (contact). Checks for
     * existing image, if not found checks for an image using the email of the
     * entity, if again failed to found returns a default image link.
     * 
     * @method gravatarurl
     * @param {Object}
     *                items array of objects
     * @param {Number}
     *                width to specify the width of the image
     * @returns image link
     * 
     */
    Handlebars.registerHelper('gravatarurl', function(items, width)
    {

	if (items == undefined)
	    return;

	// Checks if properties already has an image, to return it
	var agent_image = getPropertyValue(items, "image");
	if (agent_image)
	    return agent_image;

	// Default image
	var img = DEFAULT_GRAVATAR_url;

	var email = getPropertyValue(items, "email");
	if (email)
	{
	    return 'https://secure.gravatar.com/avatar/' + Agile_MD5(email) + '.jpg?s=' + width + "&d=" + escape(img);
	}

	return 'https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=' + width + "&d=" + escape(img);

    });

    Handlebars.registerHelper('defaultGravatarurl', function(width)
    {
	// Default image
	var img = DEFAULT_GRAVATAR_url;

	return 'https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=' + width + "&d=" + escape(img);
    });

    Handlebars.registerHelper('emailGravatarurl', function(width, email)
    {
	// Default image
	var img = DEFAULT_GRAVATAR_url;

	if (email)
	{
	    return 'https://secure.gravatar.com/avatar/' + Agile_MD5(email) + '.jpg?s=' + width + "&d=" + escape(img);
	}

	return 'https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=' + width + "&d=" + escape(img);
    });

    /**
     * Helper function to return icons based on given name
     * 
     * @method icons
     * @param {String}
     *                item name to get icon
     * @returns icon name
     */
    Handlebars.registerHelper('icons', function(item)
    {
	item = item.toLowerCase();
	if (item == "email")
	    return "icon-envelope-alt";
	if (item == "phone")
	    return "icon-headphones";
	if (item == "url")
	    return "icon-home";
	if (item == "call")
	    return "icon-phone-sign";
	if (item == "follow_up")
	    return "icon-signout";
	if (item == "meeting")
	    return "icon-group";
	if (item == "milestone")
	    return "icon-cog";
	if (item == "send")
	    return "icon-reply";
	if (item == "tweet")
	    return "icon-share-alt";
	if (item == "other")
	    return "icon-tasks";

    });

    Handlebars.registerHelper('eachkeys', function(context, options)
    {
	var fn = options.fn, inverse = options.inverse;
	var ret = "";

	var empty = true;
	for (key in context)
	{
	    empty = false;
	    break;
	}

	if (!empty)
	{
	    for (key in context)
	    {
		ret = ret + fn({ 'key' : key, 'value' : context[key] });
	    }
	}
	else
	{
	    ret = inverse(this);
	}
	return ret;
    });

    /**
     * Turns the first letter of the given string to upper-case and the
     * remaining to lower-case (EMaiL to Email).
     * 
     * @method ucfirst
     * @param {String}
     *                value to convert as ucfirst
     * @returns converted string
     */
    Handlebars.registerHelper('ucfirst', function(value)
    {
	return (value && typeof value === 'string') ? (value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) : '';
    });

    /**
     * Returns Contact short name
     */
    Handlebars.registerHelper('contactShortName', function()
    {
	if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
	{

	    var contact_properties = App_Contacts.contactDetailView.model.get('properties');

	    if (App_Contacts.contactDetailView.model.get('type') == 'PERSON')
	    {
		for ( var i = 0; i < contact_properties.length; i++)
		{

		    if (contact_properties[i].name == "last_name")
			return contact_properties[i].value;
		    else if (contact_properties[i].name == "first_name")
			return contact_properties[i].value;
		}
		return "Contact";
	    }
	    else
	    {
		for ( var i = 0; i < contact_properties.length; i++)
		{
		    if (contact_properties[i].name == "name")
			return contact_properties[i].value;
		}
		return "Company";
	    }
	}
    });

    /**
     * Returns workflow name surrounded by quotations if exists, otherwise this
     */
    Handlebars.registerHelper('workflowName', function()
    {
	if (App_Workflows.workflow_model)
	{
	    var workflowName = App_Workflows.workflow_model.get("name");
	    return "\'" + workflowName + "\'";
	}

	return "this";
    });

    /**
     * 
     * @method task_property
     * @param {String}
     *                change property value in view
     * @returns converted string
     */
    Handlebars.registerHelper('task_property', function(value)
    {

	if (value == "FOLLOW_UP")
	    return "Follow Up";
	else
	    return ucfirst(value);

    });

    // Tip on using Gravar with JS:
    // http://www.deluxeblogtips.com/2010/04/get-gravatar-using-only-javascript.html
    /**
     * Helper function to generate a html string as desired to show-up the
     * tags-view
     * 
     * @method tagslist
     * @param {Object}
     *                tags array containing all tags
     */
    Handlebars.registerHelper('tagslist', function(tags)
    {

	console.log(tags);
	var json = {};

	// Store tags in a json, starting letter as key
	for ( var i = 0; i < tags.length; i++)
	{

	    var tag = tags[i].tag;
	    // console.log(tag);
	    var start = tag.charAt(0).toUpperCase();

	    var array = new Array();

	    // see if it is already present
	    if (json[start] != undefined)
	    {
		array = json[start];
	    }

	    array.push(tag);
	    json[start] = array;

	}

	// To sort tags in case-insensitive order i.e. keys in json object
	var keys = Object.keys(json);
	keys.sort();

	// Sorts it based on characters and then draws it
	var html = "";

	for ( var i in keys)
	{

	    var array = json[keys[i]];

	    html += "<div class='tag-element'><div class='tag-key'>" + keys[i] + "</div> ";

	    html += "<div class='tag-values'>";

	    for ( var i = 0; i < array.length; i++)
	    {
		console.log("************************");
		console.log(array[i]);
		var hrefTag = "#tags/" + encodeURIComponent(array[i]);

		html += ('<a href=\"' + hrefTag + '\" >' + array[i] + '</a> ');
	    }
	    html += "</div></div>";

	}

	return html;
    });

    Handlebars
	    .registerHelper(
		    'setupTags',
		    function(tags)
		    {

			console.log(tags);
			var json = {};

			var keys = [];
			// Store tags in a json, starting letter as key
			for ( var i = 0; i < tags.length; i++)
			{
			    var tag = tags[i].tag;
			    var key = tag.charAt(0).toUpperCase();
			    // console.log(tag);
			    if (jQuery.inArray(key, keys) == -1)
				keys.push(key);
			}

			// To sort tags in case-insensitive order i.e. keys in
			// json object
			keys.sort();
			console.log(keys);
			var html = "";
			for ( var i = 0; i < keys.length; i++)
			{
			    html += "<div class='tag-element' style='margin-right:10px'><div class='tag-key'>" + keys[i] + "</div><div class='tag-values' tag-alphabet=\"" + keys[i] + "\"></div></div>";
			}
			return new Handlebars.SafeString(html);
		    });

    // To show milestones as columns in deals
    Handlebars
	    .registerHelper(
		    'deals_by_milestones',
		    function(data)
		    {
			var html = "";
			var count = Object.keys(data).length;
			$
				.each(
					data,
					function(key, value)
					{
					    if (count == 1 && key == "")
					    {
						html += '<div class="slate" style="padding:5px 2px;"><div class="slate-content" style="text-align:center;"><h3>You have no milestones defined</h3></div></div>';
					    }
					    else
					    {
						html += "<div class='milestone-column'><p class='milestone-heading'><b>" + key + "</b></p><ul class='milestones' milestone='" + key + "'>";
						for ( var i in value)
						{
						    html += "<li id='" + value[i].id + "'>" + getTemplate("opportunities-grid-view", value[i]) + "</li>";
						}
						html += "</ul></div>";
					    }
					});
			return html;
		    });

    // To show milestones as sortable list
    Handlebars
	    .registerHelper(
		    'milestone_ul',
		    function(data)
		    {
			var html = "<ul class='milestone-value-list tagsinput' style='padding:1px;list-style:none;'>";
			if (data)
			{
			    var milestones = data.split(",");
			    for ( var i in milestones)
			    {
				html += "<li data='" + milestones[i] + "'><div><span>" + milestones[i] + "</span><a class='milestone-delete right' href='#'>&times</a></div></li>";
			    }
			}
			html += "</ul>";
			return html;
		    });

    /**
     * Helper function to return date string from epoch time
     */
    Handlebars.registerHelper('epochToHumanDate', function(format, date)
    {

	if (!format)
	    format = "mmm dd yyyy HH:MM:ss";

	if (!date)
	    return;

	if ((date / 100000000000) > 1)
	{
	    console.log(new Date(parseInt(date)).format(format));
	    return new Date(parseInt(date)).format(format, 0);
	}
	// date form milliseconds
	var d = new Date(parseInt(date) * 1000).format(format);

	return d

	// return $.datepicker.formatDate(format , new Date( parseInt(date) *
	// 1000));
    });

    /**
     * Helper function to return the date string converting to local timezone.
     */
    Handlebars.registerHelper('toLocalTimezone', function(dateString)
    {
	var date = new Date(dateString);

	return date.toDateString() + ' ' + date.toLocaleTimeString();
    });

    /**
     * Helper function to return the date string converting to local timezone
     * from UTC.
     */
    Handlebars.registerHelper('toLocalTimezoneFromUtc', function(dateString)
    {
	var date = new Date(dateString + ' GMT+0000');

	return date.toDateString() + ' ' + date.toLocaleTimeString();
    });

    /**
     * Helper function to return task date (MM dd, ex: Jan 10 ) from epoch time
     */
    Handlebars.registerHelper('epochToTaskDate', function(date)
    {

	var intMonth, intDay;

	// Verifies whether date is in milliseconds, then
	// no need to multiply with 1000
	if ((date / 100000000000) > 1)
	{
	    intMonth = new Date(date).getMonth();
	    intDay = new Date(date).getDate();
	}
	else
	{
	    intMonth = new Date(parseInt(date) * 1000).getMonth();
	    intDay = new Date(parseInt(date) * 1000).getDate();
	}
	var monthArray = [
		"Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"
	];

	return (monthArray[intMonth] + " " + intDay);
    });

    /**
     * Helper function to return task color based on it's priority
     */
    Handlebars.registerHelper('task_label_color', function(priority)
    {
	if (priority == 'HIGH' || priority == 'red')
	    return 'important';
	if (priority == 'NORMAL' || priority == '#36C')
	    return 'info';
	if (priority == 'LOW' || priority == 'green')
	    return 'success';
    });

    /**
     * Helper function to return event label based on it's priority
     */
    Handlebars.registerHelper('event_priority', function(priority)
    {
	if (priority == 'red')
	    return 'High';
	if (priority == '#36C')
	    return 'Normal';
	if (priority == 'green')
	    return 'Low';
    });

    /**
     * Helper function to return type based on it's network type
     */
    Handlebars.registerHelper('network', function(type)
    {
	if (type == 'GOOGLE')
	    return 'Google Drive';
	if (type == 'S3')
	    return 'Uploaded Doc';
    });

    /**
     * Helper function to return date (Jan 10, 2012) from epoch time (users
     * table)
     * 
     * @param {Object}
     *                info_json json object containing information about
     *                createdtime, last logged in time etc..
     * @param {String}
     *                date_type specifies the type of date to return (created or
     *                logged in)
     */
    Handlebars.registerHelper('epochToDate', function(info_json, date_type)
    {

	var obj = JSON.parse(info_json);

	if (!obj[date_type])
	    return "-"
	var intMonth = new Date(parseInt(obj[date_type]) * 1000).getMonth();
	var intDay = new Date(parseInt(obj[date_type]) * 1000).getDate();
	var intYear = new Date(parseInt(obj[date_type]) * 1000).getFullYear();

	var monthArray = [
		"Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"
	];

	return (monthArray[intMonth] + " " + intDay + ", " + intYear);
    });

    /**
     * Returns currency symbol based on the currency value (deals)
     */
    Handlebars.registerHelper('currencySymbol', function(value)
    {
	var symbol = ((value.length < 4) ? "$" : value.substring(4, value.length));
	return symbol;
    });

    /**
     * Calculates the "pipeline" for deals based on their value and probability
     * (value * probability)
     * 
     * @param {Number}
     *                value of the deal
     * @param {Number}
     *                probability of the deal
     */
    Handlebars.registerHelper('calculatePipeline', function(value, probability)
    {

	var pipeline = parseInt(value) * parseInt(probability) / 100;
	return pipeline;
    });

    /**
     * Returns required log (time or message) from logs (campaign logs)
     */
    Handlebars.registerHelper('getRequiredLog', function(log_array_string, name)
    {
	var logArray = JSON.parse(log_array_string);
	if (name == "t")
	{
	    var readableTime = new Date(logArray[0][name] * 1000);
	    return readableTime;
	}
	return logArray[0][name];
    });

    /**
     * Returns table headings for custom contacts list view
     */
    Handlebars.registerHelper('contactTableHeadings', function(item)
    {

	var el = "";
	$.each(App_Contacts.contactViewModel[item], function(index, element)
	{

	    element = element.replace("_", " ")

	    el = el.concat('<th>' + ucfirst(element) + '</th>');

	});

	return new Handlebars.SafeString(el);
    });

    /**
     * Returns table headings for reports custom contacts list view
     */
    Handlebars.registerHelper('reportsContactTableHeadings', function(item)
    {

	var el = "";
	$.each(REPORT[item], function(index, element)
	{

	    if (element.indexOf("properties_") != -1)
		element = element.split("properties_")[1];
	    if (element.indexOf("custom_") == 0)
		element = element.split("custom_")[1];

	    element = element.replace("_", " ")

	    el = el.concat('<th>' + ucfirst(element) + '</th>');

	});

	return new Handlebars.SafeString(el);
    });

    /**
     * Helper function, which executes different templates (entity related)
     * based on entity type. Here "this" reffers the current entity object.
     * (used in timeline)
     * 
     */
    Handlebars.registerHelper('if_entity', function(item, options)
    {

	if (this.entity_type == item)
	{
	    return options.fn(this);
	}
	if (!this.entity && this[item] != undefined)
	{
	    return options.fn(this);
	}
    });

    /**
     * Returns trigger type, by removing underscore and converting into
     * lowercase, excluding first letter.
     */
    Handlebars.registerHelper('titleFromEnums', function(value)
    {
	if (!value)
	    return;

	var str = value.replace(/_/g, ' ');
	return ucfirst(str.toLowerCase());

    });

    Handlebars.registerHelper('triggerType', function(value)
    {
	if (value == 'ADD_SCORE')
	    return value.replace('ADD_SCORE', 'Score (>=)');

	return titleFromEnums(value);
    });

    /**
     * Returns notification type,by replacing 'has been' with underscore and
     * converting into lowercase.
     */
    Handlebars.registerHelper('if_notification_type', function()
    {

	// Makes 'CONTACT CREATED' To 'COMPANY CREATED'
	if (this.type == "COMPANY")
	{
	    var arr = this.notification.split('_');
	    var temp = ucfirst(arr[0].replace('CONTACT', 'COMPANY')) + " " + ucfirst(arr[1]);
	    return " - " + temp;
	}

	// Replaces '_' with ' '
	var str = this.notification.replace(/_/, ' ');

	switch (str) {
	case "IS BROWSING":
	    return str.toLowerCase() + " " + this.custom_value;

	case "CLICKED LINK":
	    var customJSON = JSON.parse(this.custom_value);

	    if (customJSON["workflow_name"] == undefined)
		return str.toLowerCase() + " " + customJSON.url_clicked;

	    return str.toLowerCase() + " " + customJSON.url_clicked + " " + " of campaign " + "\"" + customJSON.workflow_name + "\""

	case "OPENED EMAIL":
	    var customJSON = JSON.parse(this.custom_value);

	    if (customJSON.hasOwnProperty("workflow_name"))
		return str.toLowerCase() + " " + " of campaign " + "\"" + customJSON.workflow_name + "\"";

	    return str.toLowerCase() + " with subject " + "\"" + customJSON.email_subject + "\"";

	case "CONTACT ADDED":
	    return " - " + ucfirst(str.split(' ')[0]) + " " + ucfirst(str.split(' ')[1]);

	case "CONTACT DELETED":
	    return " - " + ucfirst(str.split(' ')[0]) + " " + ucfirst(str.split(' ')[1]);

	case "DEAL CREATED":
	    return " - " + ucfirst(str.split(' ')[0]) + " " + ucfirst(str.split(' ')[1]);

	case "DEAL CLOSED":
	    return " - " + ucfirst(str.split(' ')[0]) + " " + ucfirst(str.split(' ')[1]);

	case "TAG ADDED":
	    return " - " + "\"" + this.custom_value + "\" " + str.toLowerCase().split(' ')[0] + " has been " + str.toLowerCase().split(' ')[1];

	case "TAG DELETED":
	    return " - " + "\"" + this.custom_value + "\" " + str.toLowerCase().split(' ')[0] + " has been " + str.toLowerCase().split(' ')[1];

	default:
	    return str.toLowerCase();
	}
    });

    /**
     * Converts Epoch Time to Human readable date of default format.Used for
     * campaign-logs.
     */
    Handlebars.registerHelper('epochToLogDate', function(logTime)
    {
	return new Date(logTime * 1000);
    });

    /**
     * Returns country name from country code.
     */
    Handlebars.registerHelper('getCountryName', function(countrycode)
    {
	// retrieves country name from code using country-from-code.js
	return getCode(countrycode);
    });

    /**
     * Replace '+' symbols with space.Used in notification.
     */
    Handlebars.registerHelper('replace_plus_symbol', function(name)
    {

	return name.replace(/\+/, ' ');
    });

    /**
     * Removes forward slash. Makes A/B to AB. Used in contact-detail-campaigns
     */
    Handlebars.registerHelper('removeSlash', function(value)
    {
	if (value == 'A/B')
	    return value.replace(/\//, '');

	return value;
    });

    /**
     * Displays all the properties of a contact in its detail view, excluding
     * the function parameters (fname, lname, company etc..)
     */
    Handlebars
	    .registerHelper(
		    'if_property',
		    function(fname, lname, company, title, image, email, phone, website, address, options)
		    {

			if (this.name != fname && this.name != lname && this.name != company && this.name != title && this.name != image && this.name != email && this.name != phone && this.name != website && this.name != address)
			    return options.fn(this);
		    });

    /**
     * Counts the existence of property name which occurred multiple times.
     */
    Handlebars.registerHelper('property_is_exists', function(name, properties, options)
    {

	if (getPropertyValue(properties, name))
	    return options.fn(this);
	return options.inverse(this);
    });

    /*
     * To add comma in between the elements.
     */
    Handlebars.registerHelper('comma_in_between_property', function(value1, value2, properties, options)
    {

	if (getPropertyValue(properties, value1) && getPropertyValue(properties, value2))
	    return ",";
    });

    Handlebars.registerHelper('property_subtype_is_exists', function(name, subtype, properties, options)
    {

	if (getPropertyValueBySubtype(properties, name, subtype))
	    return options.fn(this);
	return options.inverse(this);
    });

    /**
     * Displays multiple times occurred properties of a contact in its detail
     * view in single entity
     */
    Handlebars.registerHelper('multiple_Property_Element', function(name, properties, options)
    {

	var matching_properties_list = agile_crm_get_contact_properties_list(name)
	if (matching_properties_list.length > 0)
	    return options.fn(matching_properties_list);
    });

    /**
     * Converts address as comma seprated values and returns as handlebars safe
     * string.
     */
    Handlebars
	    .registerHelper(
		    'address_Element',
		    function(properties)
		    {
			var properties_count = 0;
			for ( var i = 0, l = properties.length; i < l; i++)
			{

			    if (properties[i].name == "address")
			    {
				var el = '<div style="display: inline-block; vertical-align: top;text-align:right;margin-top:0px" class="span4"><span><strong style="color:gray">Address</strong></span></div>';

				var address = {};
				try
				{
				    address = JSON.parse(properties[i].value);
				}
				catch (err)
				{
				    address['address'] = properties[i].value;
				}

				// Gets properties (keys) count of given json
				// object
				var count = countJsonProperties(address);

				if (properties_count != 0)

				    el = el
					    .concat('<div style="display:inline;padding-right: 0px!important;display: inline-block;padding-bottom: 2px; line-height: 20px;" class="span8 contact-detail-entity-list"><div style="padding-top:3px;"><span>');
				else
				    el = el
					    .concat('<div style="display:inline;display: inline-block;padding-bottom: 2px; line-height: 20px;" class="span8"><div><span>');

				$.each(address, function(key, val)
				{
				    if (--count == 0)
				    {
					el = el.concat(val + ".");
					return;
				    }
				    el = el.concat(val + ", ");
				});

				if (properties[i].subtype)
				    el = el.concat(" <span class='label'>" + properties[i].subtype + "</span>");
				el = el.concat('</span></div></div>');
				return new Handlebars.SafeString(el);
			    }
			    else if (properties[i].name == "phone" || properties[i].name == "email")
			    {
				++properties_count;
			    }
			}
		    });

    Handlebars.registerHelper('address_Template', function(properties)
    {

	for ( var i = 0, l = properties.length; i < l; i++)
	{

	    if (properties[i].name == "address")
	    {
		var el = '';

		var address = {};
		try
		{
		    address = JSON.parse(properties[i].value);
		}
		catch (err)
		{
		    address['address'] = properties[i].value;
		}

		// Gets properties (keys) count of given json
		// object
		var count = countJsonProperties(address);

		$.each(address, function(key, val)
		{
		    if (--count == 0)
		    {
			el = el.concat(val + ".");
			return;
		    }
		    el = el.concat(val + ", ");
		});
		/*
		 * if (properties[i].subtype) el = el.concat(" <span
		 * class='label'>" + properties[i].subtype + "</span>");
		 */

		return new Handlebars.SafeString(el);
	    }
	}
    });

    // To show related to contacts for contacts as well as companies
    Handlebars.registerHelper('related_to_contacts', function(data, options)
    {
	var el = "";
	var count = data.length;
	$.each(data, function(key, value)
	{
	    var html = getTemplate("related-to-contacts", value);
	    if (--count == 0)
	    {
		el = el.concat(html);
		return;
	    }
	    el = el.concat(html + ", ");
	});
	return new Handlebars.SafeString(el);
    });

    // To show only one related to contacts or companies in deals
    Handlebars.registerHelper('related_to_one', function(data, options)
    {
	// return "<span>" + getTemplate("related-to-contacts", data[0]) +
	// "</span>";
	var el = "";
	var count = data.length;
	$.each(data, function(key, value)
	{
	    if (key <= 3)
	    {
		var html = getTemplate("related-to-contacts", value);
		if (--count == 0 || key == 3)
		{
		    el = el.concat(html);
		    return;
		}
		el = el.concat(html + ", ");
	    }

	});
	return new Handlebars.SafeString(el);

    });

    /**
     * To represent a number with commas in deals
     */
    Handlebars.registerHelper('numberWithCommas', function(value)
    {
	if (value)
	    return value.toFixed(2).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",").replace('.00', '');
    });

    /**
     * Converts reports/view field element as comma seprated values and returns
     * as handlebars safe string.
     */
    Handlebars.registerHelper('field_Element', function(properties)
    {
	var el = "";
	var count = properties.length;

	$.each(properties, function(key, value)
	{

	    if (value.indexOf("properties_") != -1)
		value = value.split("properties_")[1];
	    else if (value.indexOf("custom_") != -1)
		value = value.split("custom_")[1];
	    else if (value.indexOf("CUSTOM_") != -1)
		value = value.split("CUSTOM_")[1];
	    else if (value == "created_time")
		value = "Created Date";
	    else if (value == "updated_time")
		value = "Updated Date";

	    value = value.replace("_", " ");

	    if (--count == 0)
	    {
		el = el.concat(value);
		return;
	    }
	    el = el.concat(value + ", ");
	});

	return new Handlebars.SafeString(el);
    });

    /**
     * Converts string to JSON
     */
    Handlebars.registerHelper('stringToJSON', function(object, key, options)
    {
	console.log(object);
	console.log(key);
	if (key)
	{
	    try
	    {

		object[key] = JSON.parse(object[key]);
	    }
	    finally
	    {
		return options.fn(object[key]);
	    }
	}

	try
	{
	    return options.fn(JSON.parse(object));
	}
	catch (err)
	{
	    return options.fn(object);
	}
    });

    /**
     * Checks the existence of property name and prints value
     */
    Handlebars.registerHelper('if_propertyName', function(pname, options)
    {
	for ( var i = 0; i < this.properties.length; i++)
	{
	    if (this.properties[i].name == pname)
		return options.fn(this.properties[i]);
	}
	return options.inverse(this);
    });

    /*
     * Gets company image from a contact object.
     * 
     * --If image uploaded, returns that ( the frame size requested ). --Else if
     * url present, fetch icon from the url via Google S2 service (frame
     * size=32x32) --Else return img/company.png ( the frame size requested ).
     * 
     * --CSS for frame is adjusted when fetching from url ( default padding =
     * 4px , now 4+adjust ). --'onError' is an attribute (js function) fired
     * when image fails to download, maybe due to remote servers being down It
     * defaults to img/company.png which should be present in server as static
     * file
     * 
     * Usage: e.g. <img {{getCompanyImage "40" "display:inline"}} class="..."
     * ... >
     * 
     * This helper sets src,onError & style attribute. "40" is full frame size
     * requested. Additional styles like "display:inline;" or "display:block;"
     * can be specified in 2nd param.
     * 
     * @author Chandan
     */
    Handlebars
	    .registerHelper(
		    'getCompanyImage',
		    function(frame_size, additional_style)
		    {

			var full_size = parseInt(frame_size); // size
			// requested,full
			// frame
			var size_diff = 4 + ((full_size - 32) / 2); // calculating
			// padding,
			// for small
			// favicon
			// 16x16 as
			// 32x32,
			// fill rest frame with padding

			// default when we can't find image uploaded or url to
			// fetch from
			var default_return = "src='img/company.png' style='width:" + full_size + "px; height=" + full_size + "px;" + additional_style + "'";

			// when the image from uploaded one or favicon can't be
			// fetched, then show company.png, adjust CSS ( if style
			// broken by favicon ).
			var error_fxn = "";

			for ( var i = 0; i < this.properties.length; i++)
			{
			    if (this.properties[i].name == "image")
			    {
				default_return = "src='" + this.properties[i].value + "' style='width:" + full_size + "px; height=" + full_size + "px;" + additional_style + ";'";
				// found uploaded image, break, no need to
				// lookup url

				error_fxn = "this.src='img/company.png'; this.onerror=null;";
				// no need to resize, company.png is of good
				// quality & can be scaled to this size

				break;
			    }
			    if (this.properties[i].name == "url")
			    {
				default_return = "src='https://www.google.com/s2/favicons?domain=" + this.properties[i].value + "' " + "style='width:32px; height:32px; padding:" + size_diff + "px; " + additional_style + " ;'";
				// favicon fetch -- Google S2 Service, 32x32,
				// rest padding added

				error_fxn = "this.src='img/company.png'; " + "$(this).css('width','" + frame_size + "px'); $(this).css('height','" + frame_size + "px');" + "$(this).css('padding','4px'); this.onerror=null;";
				// resize needed as favicon is 16x16 & scaled to
				// just 32x32, company.png is adjusted on error
			    }
			}
			// return safe string so that our html is not escaped
			return new Handlebars.SafeString(default_return + " onError=\"" + error_fxn + "\"");
		    });

    /**
     * Get appropriate link i.e. protocol://whatever.xxx. If no protocol
     * present, assume http
     */
    Handlebars.registerHelper('getHyperlinkFromURL', function(url)
    {

	if (url.match(/((http[s]|ftp|file):\/\/)/) != null)
	    return url;
	return 'http://' + url;
    });

    // Get Count
    Handlebars.registerHelper('count', function()
    {
	return getCount(this);
    });

    Handlebars.registerHelper('contacts_count', function()
    {
	if (this[0] && this[0].count && (this[0].count != -1))
	{
	    if (this[0].count > 9999 && readCookie('contact_filter'))
		return "(" + this[0].count + "+ Total)";

	    return "(" + this[0].count + " Total)";
	}
	else
	    return "(" + this.length + " Total)";
    });

    /**
     * 
     * Returns subscribers count without parenthesis
     * 
     */
    Handlebars.registerHelper('subscribers_count', function()
    {

	if (this[0] && this[0].count && (this[0].count != -1))
	    return this[0].count;

	return this.length;

    });

    /**
     * Convert string to lower case
     */
    Handlebars.registerHelper('toLowerCase', function(value)
    {
	if (!value)
	    return;
	return value.toLowerCase();
    });

    /**
     * Convert string to lower case
     */
    Handlebars.registerHelper('toUpperCase', function(value)
    {
	if (!value)
	    return;
	return value.toUpperCase();
    });

    /**
     * Executes template, based on contact type (person or company)
     */
    Handlebars.registerHelper('if_contact_type', function(ctype, options)
    {
	if (this.type == ctype)
	{
	    return options.fn(this);
	}
    });

    Handlebars.registerHelper('wrap_entity', function(item, options)
    {

	if (item)
	    return options.fn(item);
    });

    /**
     * Returns modified message for timeline logs
     */
    Handlebars.registerHelper('tl_log_string', function(string)
    {

	return string.replace("Sending email From:", "Email sent From:");
    });

    /**
     * Returns "Lead Score" of a contact, when it is greater than zero only
     */
    Handlebars.registerHelper('lead_score', function(value)
    {
	if (this.lead_score > 0)
	    return this.lead_score;
	else
	    return "";
    });

    /**
     * Returns task completion status (Since boolean false is not getting
     * printed, converted it into string and returned.)
     */
    Handlebars.registerHelper('task_status', function(status)
    {
	if (status)
	    return true;

	// Return false as string as the template can not print boolean false
	return "false";

    });

    /**
     * Compares the arguments (value and target) and executes the template based
     * on the result (used in contacts typeahead)
     */
    Handlebars.registerHelper('if_equals', function(value, target, options)
    {

	/*
	 * console.log("typeof target: " + typeof target + " target: " +
	 * target); console.log("typeof value: " + typeof value + " value: " +
	 * value);
	 */
	/*
	 * typeof is used beacuse !target returns true if it is empty string,
	 * when string is empty it should not go undefined
	 */
	if ((typeof target === "undefined") || (typeof value === "undefined"))
	    return options.inverse(this);

	if (value.toString().trim() == target.toString().trim())
	    return options.fn(this);
	else
	    return options.inverse(this);
    });

    /**
     * Compares the arguments (value and target) and executes the template based
     * on the result (used in contacts typeahead)
     */
    Handlebars.registerHelper('if_greater', function(value, target, options)
    {
	if (parseInt(target) > value)
	    return options.inverse(this);
	else
	    return options.fn(this);
    });

    /**
     * Compares the arguments (value and target) and executes the template based
     * on the result (used in contacts typeahead)
     */
    Handlebars.registerHelper('if_less_than', function(value, target, options)
    {
	if (target < value)
	    return options.inverse(this);
	else
	    return options.fn(this);
    });

    Handlebars.registerHelper('campaigns_heading', function(value, options)
    {
	var val = 0;
	if (value && value[0] && value[0].count)
	    val = value[0].count;

	if (val <= 20)
	    return "Workflows";

	return "(" + val + " Total)";
    });

    /**
     * Adds Custom Fields to forms, where this helper function is called
     */
    Handlebars.registerHelper('show_custom_fields', function(custom_fields, properties)
    {

	var el = show_custom_fields_helper(custom_fields, properties);
	return new Handlebars.SafeString(fill_custom_field_values($(el), properties));

    });

    Handlebars.registerHelper('is_link', function(value, options)
    {

	var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

	if (value.search(exp) != -1)
	    return options.fn(this);
	else
	    return options.inverse(this);
    });

    Handlebars.registerHelper('show_link_in_statement', function(value)
    {

	var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

	try
	{
	    value = value.replace(exp, "<a href='$1' target='_blank' class='cd_hyperlink'>$1</a>");
	    return new Handlebars.SafeString(value);
	}
	catch (err)
	{
	    return value;
	}

    });

    /**
     * Returns table headings for custom contacts list view
     */
    Handlebars.registerHelper('displayPlan', function(value)
    {

	return ucfirst(value).replaceAll("_", " ");

    });

    Handlebars.registerHelper('getCurrentContactProperty', function(value)
    {
	if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
	{
	    var contact_properties = App_Contacts.contactDetailView.model.get('properties')
	    console.log(App_Contacts.contactDetailView.model.toJSON());
	    return getPropertyValue(contact_properties, value);
	}
    });

    Handlebars.registerHelper('safe_string', function(data)
    {

	data = data.replace(/\n/, "<br/>");
	return new Handlebars.SafeString(data);
    });

    Handlebars.registerHelper('string_to_date', function(format, date)
    {

	return new Date(date).format(format);
    });

    Handlebars.registerHelper('isArray', function(data, options)
    {
	if (isArray(data))
	    return options.fn(this);
	return options.inverse(this);
    });

    Handlebars.registerHelper('is_string', function(data, options)
    {
	if (typeof data == "string")
	    return options.fn(this);
	return options.inverse(this);

    });

    Handlebars.registerHelper("bindData", function(data)
    {

	return JSON.stringify(data);
    });

    Handlebars.registerHelper("getCurrentUserPrefs", function(options)
    {
	if (CURRENT_USER_PREFS)
	    ;
	return options.fn(CURRENT_USER_PREFS);
    });

    Handlebars.registerHelper("getCurrentDomain", function(options)
    {
	var url = window.location.host;

	var exp = /(\.)/;

	if (url.search(exp) >= 0)
	    return url.split(exp)[0];

	return " ";
    });

    // Gets date in given range
    Handlebars.registerHelper('date-range', function(from_date_string, no_of_days, options)
    {
	var from_date = Date.parse(from_date_string);
	var to_date = Date.today().add({ days : parseInt(no_of_days) });
	return to_date.toString('MMMM d, yyyy') + " - " + from_date.toString('MMMM d, yyyy');

    });

    Handlebars.registerHelper("extractEmail", function(content, options)
    {

	console.log(content);

	return options.fn(content.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)[0]);
    });

    Handlebars.registerHelper('getCurrentContactPropertyBlock', function(value, options)
    {
	if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
	{
	    var contact_properties = App_Contacts.contactDetailView.model.get('properties')
	    console.log(App_Contacts.contactDetailView.model.toJSON());
	    return options.fn(getPropertyValue(contact_properties, value));
	}
    });

    Handlebars.registerHelper('isDuplicateContactProperty', function(properties, key, options)
    {
	if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
	{
	    var contact_properties = App_Contacts.contactDetailView.model.get('properties')
	    var currentContactEntity = getPropertyValue(contact_properties, key);
	    var contactEntity = getPropertyValue(properties, key);

	    if (!currentContactEntity || !contactEntity)
	    {
		currentContactEntity = getPropertyValue(contact_properties, "first_name") + " " + getPropertyValue(contact_properties, "last_name");
		contactEntity = getPropertyValue(properties, "first_name") + " " + getPropertyValue(properties, "last_name");
	    }

	    if (currentContactEntity == contactEntity)
		return options.fn(this);

	    return options.inverse(this)
	}
    });

    Handlebars.registerHelper('containString', function(value, target, options)
    {
	if (target.search(value) != -1)
	    return options.fn(this);

	return options.inverse(this);
    });

    Handlebars.registerHelper('numeric_operation', function(operand1, operand2, operator)
    {

	var operators = "/*-+";

	if (operators.indexOf(operator) == -1)
	    return "";

	if (operator == "+")
	    return operand1 + operand2;

	if (operator == "-")
	    return operand1 - operand2;

	if (operator == "*")
	    return operand1 * operand2;

	if (operator == "/")
	    return operand1 / operand2;
    });

    Handlebars.registerHelper('check_length', function(content, length, options)
    {

	if (parseInt(content.length) > parseInt(length))
	    return options.fn(this);

	return options.inverse(this);
    });

    Handlebars.registerHelper('check_json_length', function(content, length, options)
    {
	var json_length = 0;
	for ( var prop in content)
	{
	    json_length++;
	}

	if (json_length == parseInt(length))
	{
	    for ( var prop in content)
	    {
		return options.fn({ property : prop, value : content[prop], last : true });
	    }
	}

	return options.inverse(content);
    });

    Handlebars.registerHelper('iterate_json', function(context, options)
    {
	var result = "";
	var count = 0;
	var length = 0;
	for ( var prop in context)
	{
	    length++;
	}

	for ( var prop in context)
	{
	    count++;
	    if (count == length)
		result = result + options.fn({ property : prop, value : context[prop], last : true });
	    else
		result = result + options.fn({ property : prop, value : context[prop], last : false });

	}

	console.log(result);
	return result;
    });

    Handlebars.registerHelper('get_social_icon', function(name)
    {
	if (!name)
	    return;

	var icon_json = { "TWITTER" : "icon-twitter-sign", "LINKEDIN" : "icon-linkedin-sign", "URL" : "icon-globe", "GOOGLE-PLUS" : "icon-google-plus-sign",
	    "FACEBOOK" : "icon-facebook-sign", "GITHUB" : "icon-github", "FEED" : "icon-rss", "XING" : "icon-xing-sign", "SKYPE" : "icon-skype",
	    "YOUTUBE" : "icon-youtube", "FLICKR" : "icon-flickr" };

	name = name.trim();

	if (icon_json[name])
	    return icon_json[name];

	return "icon-globe";

    });

    Handlebars.registerHelper("each_with_index", function(array, options)
    {
	var buffer = "";
	for ( var i = 0, j = array.length; i < j; i++)
	{
	    var item = array[i];

	    // stick an index property onto the item, starting with 1, may make
	    // configurable later
	    item.index = i + 1;

	    console.log(item);
	    // show the inside of the block
	    buffer += options.fn(item);
	}

	// return the finished buffer
	return buffer;

    });

    Handlebars.registerHelper('if_json', function(context, options)
    {

	try
	{
	    var json = $.parseJSON(context);

	    if (typeof json === 'object')
		return options.fn(this);
	    return options.inverse(this);
	}
	catch (err)
	{
	    return options.inverse(this);
	}
    });

    Handlebars.registerHelper('add_tag', function(tag)
    {
	addTagAgile(tag);
    });

    Handlebars.registerHelper('set_up_dashboard_padcontent', function(key)
    {
	return new Handlebars.SafeString(getTemplate("empty-collection-model", CONTENT_JSON.dashboard[key]));
    });

    /**
     * Removes surrounded square brackets
     */
    Handlebars.registerHelper('removeSquareBrackets', function(value)
    {
	return value.replace(/[\[\]]+/, '');
    });

    /**
     * Shows list of triggers separated by comma
     */
    Handlebars.registerHelper('toLinkTrigger', function(context, options)
    {
	var ret = "";
	for ( var i = 0, j = context.length; i < j; i++)
	{
	    ret = ret + options.fn(context[i]);

	    // Avoid comma appending to last element
	    if (i < j - 1)
	    {
		ret = ret + ", ";
	    }
	    ;
	}
	return ret;
    });

    // Gets minutes from milli seconds
    Handlebars.registerHelper('millSecondsToMinutes', function(timeInMill)
    {
	if (isNaN(timeInMill))
	    return;
	var sec = timeInMill / 1000;
	var min = Math.floor(sec / 60);

	if (min < 1)
	    return Math.ceil(sec) + " secs";

	var remainingSec = Math.ceil(sec % 60);

	return min + " mins, " + remainingSec + " secs";
    });

    Handlebars.registerHelper('if_overflow', function(content, div_height, options)
    {

	if (!content)
	    return;

	console.log($('#Linkedin').width());
	content = content.trim();
	var element = $("<div style='width:" + $('#Linkedin').width() + "px;" + "word-break:normal;word-wrap:break-word;display:none;'>" + content + "</div>");

	$("#content").append(element);

	console.log(element.height() + " " + parseInt(div_height))
	if (element.height() > parseInt(div_height))
	    return options.fn(this);
	return options.inverse(this);
    });

    /**
     * To set up star rating in contacts listing
     */
    Handlebars.registerHelper('setupRating', function(value)
    {

	var element = "";
	for ( var i = 0; i < 5; i++)
	{
	    if (i < parseInt(value))
	    {
		element = element.concat('<li style="display: inline;"><img src="img/star-on.png" alt="' + i + '"></li>');
		continue;
	    }
	    element = element.concat('<li style="display: inline;"><img src="img/star-off.png" alt="' + i + '"></li>');
	}
	return new Handlebars.SafeString(element);
    });

    /**
     * Builds options to be shown in the table heading of CSV import. Also tries
     * to match headings in select field
     */
    Handlebars.registerHelper('setupCSVUploadOptions', function(key, context)
    {
	// console.log(context.toJSON());
	var template = $(getTemplate('csv_upload_options', context));

	// Replaces _ with spaces
	key = key.replace("_", " ");

	var isFound = false;

	// Iterates to create various combinations and check with the header
	for ( var i = 0; i < key.length - 3; i++)
	{
	    template.find('option').each(function(index, element)
	    {
		if ($(element).val().toLowerCase().indexOf(key) != -1)
		{
		    isFound = true;
		    $(element).attr("selected", true);
		    return false;
		}
		else if ($(element).val().toLowerCase().indexOf(key.substr(0, key.length - i).toLowerCase()) != -1)
		{
		    isFound = true;
		    $(element).attr("selected", true);
		    return false;
		}

	    });
	    if (isFound)
		break;
	}

	return new Handlebars.SafeString($('<div>').html(template).html());
    });

    /**
     * Converts total seconds into hours, minutes and seconds. For e.g. 3600
     * secs - 1hr 0 mins 0secs
     */
    Handlebars.registerHelper('convertSecondsToHour', function(totalSec)
    {
	var hours = parseInt(totalSec / 3600) % 24;
	var minutes = parseInt(totalSec / 60) % 60;
	var seconds = totalSec % 60;

	// show only seconds if hours and mins are zero
	if (hours == 0 && minutes == 0)
	    return (seconds + "s");

	// show mins and secs if hours are zero.
	if (hours == 0)
	    return (minutes + "m ") + (seconds + "s");

	var result = (hours + "h ") + (minutes + "m ") + (seconds + "s");
	return result;
    });

    /**
     * To check and return value of original referrer
     */
    Handlebars.registerHelper('checkOriginalRef', function(original_ref)
    {
	if (!getCurrentContactProperty(original_ref))
	    return "unknown";

	var url = getCurrentContactProperty(original_ref);

	url = url.split('/');
	url = (url[0] + '//' + url[2]);
	return new Handlebars.SafeString(
		'<a style="text-decoration: none" target="_blank" href="' + getCurrentContactProperty(original_ref) + '">' + url + '</a>');
    });

    /**
     * To check google url and key words
     */
    Handlebars.registerHelper('queryWords', function(original_ref)
    {
	// Check if original referrer exists
	if (getCurrentContactProperty(original_ref))
	{
	    // Get input url from contact properties and initialize reference
	    // url
	    var inputUrl = getCurrentContactProperty(original_ref);
	    var referenceUrl = 'www.google.';

	    // Get host from input url and compare with reference url if equal
	    var tempUrl = inputUrl.split('/');
	    tempUrl = tempUrl[2].slice(0, 11);
	    if (tempUrl === referenceUrl)
	    {
		// Get search term from input url
		var parser = document.createElement('a');
		parser.href = inputUrl;
		var search = parser.search;

		// If search term exists, check if 'q' parameter exists, and
		// return its value
		if (search.length > 1)
		{
		    search = search.split('&');
		    var length = search.length;
		    for ( var i = 0; i < length; i++)
		    {
			if (search[i].indexOf('q=') != -1)
			{
			    search = search[i].split('=');
			    return new Handlebars.SafeString('( Keyword : ' + search[1].split('+').join(" ") + ' )');
			}
		    }
		}
	    }
	    else
		return;
	}
    });

    /**
     * Returns contact full name if last-name exists, otherwise only first_name
     * for contact type PERSON. It returns company name for other contact type.
     * 
     */
    Handlebars.registerHelper('contact_name', function(properties, type)
    {

	if (type === 'PERSON')
	{
	    for ( var i = 0; i < properties.length; i++)
	    {

		// if last-name exists, return full name.
		if (properties[i].name === "last_name")
		    return (getPropertyValue(properties, "first_name") + " " + properties[i].value);

		else if (properties[i].name === "first_name")
		    return properties[i].value;
	    }

	    return "Contact";
	}

	// COMPANY type
	for ( var i = 0; i < properties.length; i++)
	{
	    if (properties[i].name === "name")
		return properties[i].value;
	}
	return "Company";
    });

    /**
     * Returns full name of contact. Use this when empty value is not
     * acceptable. Takes care that, even when no names are defined, returns
     * email(necessary for PERSON) or Company <id>. Calls function
     * getContactName defined in agile-typeahead.js. Also typeahead uses this
     * fxn to append values as tags.
     */
    Handlebars.registerHelper('contact_name_necessary', function(contact)
    {
	return getContactName(contact);
    });

    /**
     * To check if string is blank
     */
    Handlebars.registerHelper('is_blank', function(value, options)
    {
	value = value.trim();

	if (value == "")
	    return options.fn(value);
	else
	    return options.inverse(value);
    })

    /**
     * Iterate through list of values (not json)
     */
    Handlebars.registerHelper("each_with_index1", function(array, options)
    {
	console.log(array);
	var buffer = "";
	for ( var i = 0, j = array.length; i < j; i++)
	{
	    var item = {};
	    item["value"] = array[i];

	    console.log(item);
	    // stick an index property onto the item, starting with 1, may make
	    // configurable later
	    item["index"] = i + 1;

	    console.log(item);
	    // show the inside of the block
	    buffer += options.fn(item);
	}

	// return the finished buffer
	return buffer;

    });

    /**
     * Identifies EMAIL_SENT campaign-log string and splits the log string based
     * on '_aGiLeCrM' delimiter into To, From, Subject and Body.
     * 
     */
    Handlebars.registerHelper("if_email_sent", function(object, key, options)
    {

	// delimiter for campaign send-email log
	var _AGILE_CRM_DELIMITER = "_aGiLeCrM";

	// if log_type is EMAIL_SENT
	if (object[key] === "EMAIL_SENT")
	{
	    // Splits logs message
	    var email_fields = object["message"].split(_AGILE_CRM_DELIMITER, 4);

	    // Json to apply for handlebar template
	    var json = {};

	    if (email_fields === undefined)
		return options.inverse(object);

	    // Iterates inorder to insert each field into json
	    for ( var i = 0; i < email_fields.length; i++)
	    {
		// Splits based on colon. E.g "To: naresh@agilecrm.com"
		var arrcolon = email_fields[i].split(":");

		// Inserts LHS of colon as key. E.g., To
		var key = arrcolon[0];
		key = key.trim(); // if key starts with space, it can't
		// accessible

		// Inserts RHS of colon as value. E.g., naresh@agilecrm.com
		var value = arrcolon.slice(1).join(":"); // join the
		// remaining string
		// based on colon,
		// only first occurence of colon is needed
		value = value.trim();

		json[key] = value;
	    }

	    // inserts time into json
	    json.time = object["time"];

	    // apply customized json to template.
	    return options.fn(json);
	}

	// if not EMAIL_SENT log, goto else in the template
	return options.inverse(object);

    });

    Handlebars.registerHelper('remove_spaces', function(value)
    {
	return value.replace(/ +/g, '');

    });

    /***************************************************************************
     * Returns campaignStatus object from contact campaignStatus array having
     * same campaign-id. It is used to get start and completed time from array.
     **************************************************************************/
    Handlebars.registerHelper('if_same_campaign', function(object, data, options)
    {

	var campaignStatusArray = object[data];

	// if campaignStatus key doesn't exist return.
	if (data === undefined || campaignStatusArray === undefined)
	    return;

	// Get campaign-id from hash
	var current_campaign_id = getIdFromHash();

	for ( var i = 0, len = campaignStatusArray.length; i < len; i++)
	{

	    // compares campaign-id of each element of array with
	    // current campaign-id
	    if (campaignStatusArray[i].campaign_id === current_campaign_id)
	    {
		// if equal, execute template current json
		return options.fn(campaignStatusArray[i]);
	    }
	}

    });

    /**
     * Returns other active campaigns in campaign-active subscribers.
     */
    Handlebars.registerHelper('if_other_active_campaigns', function(object, data, options)
    {

	if (object === undefined || object[data] === undefined)
	    return;

	var other_campaigns = {};
	var other_active_campaigns = [];
	var other_completed_campaigns = [];
	var campaignStatusArray = object[data];

	var current_campaign_id = getIdFromHash();

	for ( var i = 0, len = campaignStatusArray.length; i < len; i++)
	{
	    // neglect same campaign
	    if (current_campaign_id === campaignStatusArray[i].campaign_id)
		continue;

	    // push all other active campaigns
	    if (campaignStatusArray[i].status.indexOf('ACTIVE') !== -1)
		other_active_campaigns.push(campaignStatusArray[i])

		// push all done campaigns
	    if (campaignStatusArray[i].status.indexOf('DONE') !== -1)
		other_completed_campaigns.push(campaignStatusArray[i]);
	}

	other_campaigns["active"] = other_active_campaigns;
	other_campaigns["done"] = other_completed_campaigns;

	return options.fn(other_campaigns);

    });

    /**
     * Returns Contact Model from contactDetailView collection.
     * 
     */
    Handlebars.registerHelper('contact_model', function(options)
    {

	if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
	{

	    // To show Active Campaigns list immediately after campaign
	    // assigned.
	    if (CONTACT_ASSIGNED_TO_CAMPAIGN)
	    {
		CONTACT_ASSIGNED_TO_CAMPAIGN = false;

		// fetches updated contact json
		var contact_json = $.ajax({ type : 'GET', url : '/core/api/contacts/' + App_Contacts.contactDetailView.model.get('id'), async : false,
		    dataType : 'json' }).responseText;

		// Updates Contact Detail model
		App_Contacts.contactDetailView.model.set(JSON.parse(contact_json));

		return options.fn(JSON.parse(contact_json));
	    }

	    // if simply Campaigns tab clicked, use current collection
	    return options.fn(App_Contacts.contactDetailView.model.toJSON());
	}
    });

    /**
     * Returns json object of active and done subscribers from contact object's
     * campaignStatus.
     */
    Handlebars.registerHelper('contact_campaigns', function(object, data, options)
    {

	// if campaignStatus is not defined, return
	if (object === undefined || object[data] === undefined)
	    return;

	// Temporary json to insert active and completed campaigns
	var campaigns = {};

	var active_campaigns = [];
	var completed_campaigns = [];

	// campaignStatus object of contact
	var campaignStatusArray = object[data];

	for ( var i = 0, len = campaignStatusArray.length; i < len; i++)
	{
	    // push all active campaigns
	    if (campaignStatusArray[i].status.indexOf('ACTIVE') !== -1)
		active_campaigns.push(campaignStatusArray[i])

		// push all done campaigns
	    if (campaignStatusArray[i].status.indexOf('DONE') !== -1)
		completed_campaigns.push(campaignStatusArray[i]);
	}

	campaigns["active"] = active_campaigns;
	campaigns["done"] = completed_campaigns;

	// apply obtained campaigns context within
	// contact_campaigns block
	return options.fn(campaigns);
    });

    /**
     * Verifies given urls length and returns options hash based on restricted
     * count value.
     * 
     */
    Handlebars.registerHelper("if_more_urls", function(url_json, url_json_length, options)
    {
	var RESTRICT_URLS_COUNT = 3;
	var temp_urls_array = [];
	var context_json = {};

	// If length is less than restricted, compile
	// else block with given url_json
	if (url_json_length < RESTRICT_URLS_COUNT)
	    return options.inverse(url_json);

	// Insert urls until restricted count reached
	for ( var i = 0; i < url_json.length; i++)
	{
	    if (i === RESTRICT_URLS_COUNT)
		break;

	    temp_urls_array.push(url_json[i]);
	}

	context_json.urls = temp_urls_array;

	// More remained
	context_json.more = url_json_length - RESTRICT_URLS_COUNT;

	return options.fn(context_json);

    });

    /**
     * Returns first occurence string from string having underscores E.g,
     * mac_os_x to mac
     */
    Handlebars.registerHelper('normalize_os', function(data)
    {
	if (data === undefined || data.indexOf('_') === -1)
	    return data;

	// if '_' exists splits
	return data.split('_')[0];
    });

    Handlebars.registerHelper('safe_tweet', function(data)
    {
	data = data.trim();
	return new Handlebars.SafeString(data);
    });
    /**
     * Get stream icon for social suite streams.
     */
    Handlebars.registerHelper('get_stream_icon', function(name)
    {
	if (!name)
	    return;

	var icon_json = { "Home" : "icon-home", "Retweets" : "icon-retweet", "DM_Inbox" : "icon-download-alt", "DM_Outbox" : "icon-upload-alt",
	    "Favorites" : "icon-star", "Sent" : "icon-share-alt", "Search" : "icon-search", "Scheduled" : "icon-time", "All_Updates" : "icon-home",
	    "My_Updates" : "icon-share-alt" };

	name = name.trim();

	if (icon_json[name])
	    return icon_json[name];

	return "icon-globe";

    });

    /**
     * Get task list name without underscore and caps, for new task UI.
     */
    Handlebars.registerHelper('get_normal_name', function(name)
    {
	if (!name)
	    return;

	var name_json = { "HIGH" : "High", "LOW" : "Low", "NORMAL" : "Normal", "EMAIL" : "Email", "CALL" : "Call", "SEND" : "Send", "TWEET" : "Tweet",
	    "FOLLOW_UP" : "Follow Up", "MEETING" : "Meeting", "MILESTONE" : "Milestone", "OTHER" : "Other", "YET_TO_START" : "Yet To Start",
	    "IN_PROGRESS" : "In Progress", "COMPLETED" : "Completed", "TODAY" : "Today", "TOMORROW" : "Tomorrow", "OVERDUE" : "Overdue", "LATER" : "Later" };

	name = name.trim();

	if (name_json[name])
	    return name_json[name];

	return name;

    });

    /**
     * put user address location togather separated by comma.
     */
    Handlebars.registerHelper('user_location', function()
    {

	var City = this.city == "?" ? "" : (this.city + ", ");
	var Region = this.region == "?" ? "" : (this.region + ", ");
	var Country = this.country;
	if (this.city == "?" && this.region == "?")
	    Country = this.country == "?" ? this.city_lat_long : (this.city_lat_long + " ( " + this.country + " )");

	return (City + Region + Country).trim();
    });

    /**
     * Trims trailing spaces
     */
    Handlebars.registerHelper('trim_space', function(value)
    {

	if (value === undefined)
	    return value;

	return value.trim();
    });

    /**
     * Returns reputation name based on value
     * 
     */
    Handlebars
	    .registerHelper(
		    'get_subaccount_reputation',
		    function(value)
		    {
			var type = "";
			var reputation = "Unknown";

			if (value > 1 && value < 40)
			{
			    type = "important";
			    reputation = "Poor";
			}
			else if (value >= 40 && value < 75)
			{
			    type = "";
			    reputation = "Ok";
			}
			else if (value >= 75 && value < 90)
			{
			    type = "success";
			    reputation = "Good";
			}
			else if (value >= 90)
			{
			    type = "success";
			    reputation = "Excellent";
			}

			return "<span style='font-size:13px;' class='label label-" + type + "'>" + reputation + "</span> <!--<span class='badge badge-" + type + "'>" + value + "</span>-->";

		    });

    /**
     * Returns id from hash. It returns id from hash iff id exists at last.
     * 
     */
    Handlebars.registerHelper('get_id_from_hash', function()
    {

	return getIdFromHash();

    });

    Handlebars.registerHelper('get_subscribers_type_from_hash', function()
    {

	// Returns "workflows" from "#workflows"
	var hash = window.location.hash.substr(1);

	if (hash.indexOf("all") != -1)
	    return "All";

	if (hash.indexOf("active") != -1)
	    return "Active";

	if (hash.indexOf("completed") != -1)
	    return "Completed";

	if (hash.indexOf("removed") != -1)
	    return "Removed";
    });

    Handlebars.registerHelper("check_plan", function(plan, options)
    {
	console.log(plan);

	if (!_billing_restriction)
	    return options.fn(this);

	if (_billing_restriction.currentLimits.planName == plan)
	    return options.fn(this);

	return options.inverse(this);

    });

    /**
     * Safari browser doesn't supporting few CSS properties like margin-top,
     * margin-bottom etc. So this helper is used to add compatible CSS
     * properties to Safari
     */
    Handlebars.registerHelper("isSafariBrowser", function(options)
    {

	if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1)
	    return options.fn(this);

	return options.inverse(this);
    });

    /**
     * give custome status base on xerotype
     */

    Handlebars.registerHelper('xeroType', function(type)
    {
	return (type == "ACCPAY") ? "Pay" : "Rec";
    });

    /**
     * give custom type to xero type
     */
    Handlebars.registerHelper('xeroTypeToolTip', function(type)
    {
	return (type == "ACCPAY") ? "Payable" : "Receivable";
    });

    /**
     * gives first latter capital for given input
     */
    Handlebars.registerHelper('capFirstLetter', function(data)
    {
	var temp = data.toLowerCase();
	return temp.charAt(0).toUpperCase() + temp.slice(1);
    });

    Handlebars.registerHelper('qbStatus', function(Balance)
    {
	console.log(this);
	console.log(this.TotalAmt);
	if (Balance == 0)
	{
	    return "Paid"
	}
	else
	{
	    return "Due"
	}
    });
    Handlebars.registerHelper('currencyFormat', function(data)
    {

	return Number(data).toLocaleString('en');
	// data.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    });
});
$(function(){
	$(".report-chorts").die().live('click', function(e){
		e.preventDefault();
		var formelement = $(this).parents('form'); 
		if (!isValidForm($(formelement))) {
			return false;
		}
		
		var object = serializeForm($(formelement).attr('id'));
		
		
		var report_type = object["report_chart_type"];
		
		var tags = "";
		
		if(object["tags"] && isArray(object["tags"]))
			$.each(object["tags"], function(i, tag){
				if(i == 0)
					tags += tag;
				else
					tags += ", " +tag;
			});
		
		console.log(tags);
		
		if(report_type == 'GROWTH')
		{
			Backbone.history.navigate("report-growth/" + tags, { trigger : true });
		}
		else if(report_type == 'FUNNEL')
		{
			Backbone.history.navigate("report-funnel/" + tags, { trigger : true });
		}
		else if(report_type == 'RATIO')
		{
			var tag1 = object["tag1"];
			var tag2 = object["tag2"];
			Backbone.history.navigate("report-ratio/" + tag1 + "/" + tag2, { trigger : true });
		}
		else if(report_type == 'COHORTS')
		{
			var tag1 = object["tag1"];
			var tag2 = object["tag2"];
			
			Backbone.history.navigate("report-cohorts/" + tag1 + "/" + tag2, { trigger : true });
		}
		
		
		
	});
});// Stores report object, so it can be used while creating report table headings
var REPORT;
$(function(){
	
	$("#reports-email-now").die().live('click', function(e){
		//e.preventDefault();
		e.stopPropagation();
	
		var id = $(this).attr('data');
	
		var confirmationModal = $('<div id="report-send-confirmation" class="modal fade in">' +
									'<div class="modal-header" >'+
										'<a href="#" data-dismiss="modal" class="close">&times;</a>' +
											'<h3>Send Report</h3></div>' +
												'<div class="modal-body">' +
													'<p>You are about to send report.</p>' +
													'<p>Do you want to proceed?</p>' +
												'</div>' +	
										'<div class="modal-footer">' +
											'<span class="report-message" style="margin-right:5px"></span>' +
											'<a href="#" id="report-send-confirm" class="btn btn-primary">Yes</a>' +
											'<a  href="#" class="btn close" data-dismiss="modal" >No</a>' +
										'</div>' +
									'</div>' + 
								'</div>')
		
		confirmationModal.modal('show');
		
		$("#report-send-confirm", confirmationModal).click(
				function(event)
				{
					event.preventDefault();
					
					if ($(this).attr("disabled")) return;
					
					$(this).attr("disabled", "disabled");
					
					
		
					$.get('core/api/reports/send/' + id, function(data){
				
						console.log("sending email");
							$save_info = $('<div style="display:inline-block"><small><p class="text-success"><i>Report will be sent shortly</i></p></small></div>');
				
							$('.report-message').html($save_info);
				
							$save_info.show();

							setTimeout(function ()
							            {
								   (confirmationModal).modal('hide');
							            }, 2000);

					});
				});
	});
	
	$("#report-instant-results").die().live('click', function(e){
		e.stopPropagation();
		var id = $(this).attr('data');
		console.log(id);
		/*Backbone.history.navigate("report-results/" + id, {
    		trigger: true
    	});*/
	});
})


function reportsContactTableView(base_model) 
{
/* Old Code :
 * Using this fails on firefox, works on Chrome though
 * 
	// Creates list view for
	var itemView = new Base_List_View({
		model : base_model,
		template : 'contacts-custom-view-model',
		tagName : this.options.individual_tag_name
	});

	// Reads the modelData (customView object)
	var modelData = this.options.modelData;

	// Reads fields_set from modelData
	var fields = modelData['fields_set'];

	// Converts base_model (contact) in to JSON
	var contact = base_model.toJSON();
	
	// Clears the template, because all the fields are appended, has to be reset
	// for each contact
	$('#contacts-custom-view-model-template').empty();

	// Iterates through, each field name and appends the field according to
	// order of the fields
	$.each(fields, function(index, field_name) {
		if(field_name.indexOf("properties_") != -1)
			field_name = field_name.split("properties_")[1];
		
		$('#contacts-custom-view-model-template').append(
				getTemplate('contacts-custom-view-' + field_name, contact));
	});

	// Appends model to model-list template in collection template
	$(("#" + this.options.templateKey + '-model-list'), this.el).append(
			itemView.render().el); // ----------- this line fails on Firefox
*/
	
	var modelData = this.options.modelData;	// Reads the modelData (customView object)
	var fields = modelData['fields_set']; // Reads fields_set from modelData
	var contact = base_model.toJSON(); // Converts base_model (contact) in to JSON
	var final_html_content="";
	var element_tag=this.options.individual_tag_name;
	
	// Iterates through, each field name and appends the field according to
	// order of the fields
	$.each(fields, function(index, field_name) {
		
		if(field_name.indexOf("custom_") != -1)
		{
			field_name = field_name.split("custom_")[1]; 	
			var property = getProperty(contact.properties, field_name);
			if(!property)
				property = {};

			final_html_content += getTemplate('contacts-custom-view-custom', property);
			return;
		}
		
		
		
		if(field_name.indexOf("properties_") != -1)
			field_name = field_name.split("properties_")[1];
		
		final_html_content+=getTemplate('contacts-custom-view-' + field_name, contact);
	});

	// Appends model to model-list template in collection template
	$(("#" + this.options.templateKey + '-model-list'), this.el).append(
			'<'+element_tag+'>'+final_html_content+'</'+element_tag+'>');	
	
	// Sets data to tr
	$(('#' + this.options.templateKey + '-model-list'), this.el).find('tr:last').data(
			base_model);
}

function deserialize_multiselect(data, el)
{
	$("#content").html(el);
	
	if(!data['fields_set'])
		return;
	$.each(data['fields_set'], function(index, field)
	{
		$('#multipleSelect', el).multiSelect('select', field);
	});

	$('.ms-selection', el).children('ul').addClass('multiSelect').attr("name", "fields_set").attr("id", "fields_set").sortable();
}    
function setup_dashboardTimeline(url)
{
	if(!url)
		url = "core/api/timeline/contact";
head.js(LIB_PATH + 'lib/storyjs-embed.js', function(){
createStoryJS({
       	type:       'default',
        width:      '1170',
        height:     '350',
      //  source:     'https://docs.google.com/spreadsheet/pub?key=0AqHV0BeH8amcdGxyS0cxS0NNandSaV9oTXRhWTdEbmc&output=html',
        source : url,
        embed_id:   'my-timeline' ,    // ID of the DIV you want to load the timeline into
        js :	'lib/timeline-min.js',
        css : 	'css/dashboard-timeline.css'
		});
	});
}
/**
 * Sets dashboard. call methods to fetch contact, deals, tasks, workflows and
 * subscription details
 * 
 * @param el
 */
function setup_dashboard(el)
{
	// Sets up subscription details
	show_dashboard_subscription_details(el);

	// Show recently view contacts by current user
	show_dashboard_contacts(el);

	// Shows deals, tasks, workflows
	show_dashboard_tasks(el);
	show_dashboard_deals(el);
	show_dashboard_workflows(el);
	initBlogSync();
}

/*
 * Gets the Blog posts
 */
function initBlogSync()
{
	head
			.js(
					LIB_PATH + 'lib/jquery.feeds.min.js',
					function()
					{

						$('#blog_sync_container')
								.feeds(
										{
											feeds : { blog : "https://www.agilecrm.com/blog/feed/" },
											max : 3,
											entryTemplate : function(entry)
											{
												return '<strong>' + '<a href="' + entry.link + '" title = "' + entry.title + '" target="_blank" >' + entry.title + '</a></strong><div style="color:#999;font-size:11px;line-height: 13px;margin-bottom:5px">' 
												+ new Date(entry.publishedDate).format('mmm d, yyyy') + '</div><p style="padding-top:5px;margin-bottom:15px">' 
												+ entry.contentSnippet.replace('<a', '<a target="_blank"') + '</p>';
											} });
					});

}

/**
 * Fetches recently viewed contacts bu current user. It fetches last viewed 5
 * contacts
 * 
 * @param el
 */
function show_dashboard_contacts(el)
{
	var my_recent_contacts = new Base_Collection_View({ url : 'core/api/contacts/recent?page_size=5', restKey : "contacts", templateKey : "dashboard-contacts",
		individual_tag_name : 'tr', sort_collection : false, });
	my_recent_contacts.collection.fetch();

	$('#recent-contacts', el).html(my_recent_contacts.render().el);
}

/**
 * Fetches tasks due tasks
 * 
 * @param el
 */
function show_dashboard_tasks(el)
{
	var task_dashboard_list_view = new Base_Collection_View({ url : '/core/api/tasks/my/dashboardtasks', restKey : "task", sortKey : "due",
		templateKey : "dashboard1-tasks", individual_tag_name : 'tr', postRenderCallback : function(el)
		{
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$(".task-due-time", el).timeago();
			});
		} });

	task_dashboard_list_view.appendItem = append_tasks_dashboard;
	task_dashboard_list_view.collection.fetch();
	$('#my-tasks').html(task_dashboard_list_view.el);
}

/**
 * Fetches upcomming deals related to current user
 * 
 * @param el
 */
function show_dashboard_deals(el)
{
	var my_deals = new Base_Collection_View({ url : 'core/api/opportunity/my/upcoming-deals', restKey : "opportunity", templateKey : "dashboard-opportunities",
		individual_tag_name : 'tr', page_size : 5, sortKey : "created_time", descending : true, postRenderCallback : function(el)
		{
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$(".deal-close-time", el).timeago();
			})
		} });
	my_deals.collection.fetch();
	$('#my-deals').html(my_deals.el);
}

/**
 * Fetches recent workflow logs
 * 
 * @param el
 */
function show_dashboard_workflows(el)
{
	var workflow_list_view = new Base_Collection_View({ url : '/core/api/campaigns/logs/recent?page_size=5', restKey : "workflow",
		templateKey : "dashboard-campaign-logs", individual_tag_name : 'tr', page_size : 10, sortKey : 'time', descending : true,
		postRenderCallback : function(el)
		{
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$("time.log-created-time", el).timeago();
			});
		} });

	workflow_list_view.collection.fetch();
	$('#my-logs').html(workflow_list_view.el);
}

/**
 * Shows subscription details. It fetches subscription object, checks number of
 * users registered and number of users allowed according to subscription and
 * shows message accordingly
 * 
 * @param el
 */

function show_dashboard_subscription_details(el)
{
	/**
	 * Fetches subscription object
	 */
	var view = new Base_Model_View({ url : 'core/api/subscription', template : "dashboard-account-info", });

	view.model.fetch({ success : function(data)
	{
		if (!$.isEmptyObject(data.toJSON()))
		{
			$("#subscription-stats").html(view.render(true).el);
			return;
		}

		/**
		 * Fetches number of users present in current domain
		 */
		$.get('core/api/users/count', function(count)
		{
			var plandata = {};
			plandata.users_count = count;
			plandata.plan = "free";

			console.log(plandata);

			$("#subscription-stats").html(getTemplate('user-billing', plandata));
		});
	} })
}

$(function()
{
	$('#dashboard-contacts-model-list > tr, #dashboard-campaign-logs-model-list > tr').live('click', function(e)
	{

		var id = $(this).find(".data").attr("data");

		App_Contacts.navigate("contact/" + id, { trigger : true });
	});

});
/**
 * Initializes the date-range-picker. Calls the callback when the date
 * range is selected.
 * 
 * @param campaign_id -
 *            to show charts w.r.t campaign-id.
 * @param callback -
 *            callback method if any.
 */
function initFunnelCharts(callback)
{
	head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js', CSS_PATH + "css/misc/date-picker.css", function()
	{

		// Bootstrap date range picker.
		$('#reportrange').daterangepicker({ ranges : { 'Today' : [
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
		] } }, function(start, end)
		{
			var months_diff = Math.abs(start.getMonth() - end.getMonth() + (12 * (start.getFullYear() - end.getFullYear())));
			$('#reportrange span').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));
			$("#week-range").html(end.add({ days : -6 }).toString('MMMM d, yyyy') + ' - ' + end.add({ days : 6 }).toString('MMMM d, yyyy'));

				callback();
		});
	});

	// Init the callback when the frequency selector changes too
	if($('#frequency').length > 0)
	{
		// Get Frequency
		callback();
		$('#frequency').change(function(){callback();});
	}
	
	
	fillSelect("filter", "core/api/filters", undefined, function(){
		$('#filter').change(function(){callback();});
		
	}, '<option class="default-select" value="{{id}}">{{name}}</option>', false, undefined, "All");
	
	callback();
}

/**
 * Shows Funnel Graphs based on the tags
 */
function showFunnelGraphs(tags)
{
	console.log("Showing funnel logs");
	showFunnel('core/api/reports/funnel/' + tags + getOptions(), 'funnel-chart', 'Funnel Reports', true);
}

/**
 * Shows Grwoth Graphs based on the tags
 */
function showGrowthGraphs(tags)
{
	showLine('core/api/reports/growth/' + tags + getOptions(), 'growth-chart', '', '', true);
}

/**
 * Shows Grwoth Graphs based on the tags
 */
function showCohortsGraphs(tag1, tag2)
{
	showCohorts('core/api/reports/cohorts/' + tag1 + "/" + tag2 + "/" + getOptions(), 'cohorts-chart', 'Cohort Analysis', tag1 + ' vs ' + tag2, true);
}

/**
 * Shows Ratio Graphs based on the tags
 */
function showRatioGraphs(tag1, tag2)
{
	showLine('core/api/reports/ratio/' + tag1 + "/" + tag2 + "/" + getOptions(), 'ratio-chart', 'Ratio Analysis', tag1 + ' vs ' + tag2, true);
}/**
 * Global variable 'Is_Profile_Guider_Closed' is used to check whether user has
 * closed noty bar.
 */
var Is_Profile_Guider_Closed = false;

/*
 * Global values of each step.
 */
var Profile_Settings = {
	"Email" : "",
// "User_invited" : "#users",
// "Widgets" : 10
// "Share" : "#",
}

/**
 * Holds messages to be shown on each step ex: welcome, configuring email,
 * inviting users, sharing
 */
var Profile_Setup_Messages = {};

Profile_Setup_Messages.Welcome = "Welcome to Agile - the next generation CRM. I will be your tour guide.<a href='#' id='noty-welcome-user' style='text-decoration: none;'> Let's get you started."
Profile_Setup_Messages.Email = "Shake Hands. <a href='#email' style='text-decoration: none;'> Let's sync your emails first</a>. It's simple and secure.";
Profile_Setup_Messages.User_invited = "Emails will show up in the awesome timeline. It's time to invite your colleague";
Profile_Setup_Messages.Share = "Are you liking Agile? Spread the love.";

// Initial percentage after first time login
var Initial_Total = 65;

var Profile_Info = {
	"Welcome" : false,
	"Email" : false,
	// "User_invited" : false,
	// "Widgets" : false,
	"total" : Initial_Total
};

// Calculate based on tags added in 'OUR' domain
function calculate_profile() {

	// Get tags from global contact fetched from 'OUR' domain.
	var tags = Agile_Contact.tags;

	// If tags are not empty then return profile_info with basic information
	if (!tags || tags.length == 0)
		return Profile_Info;

	// Gets the initial count to calculate completed percentage (Percentage is
	// not show now)
	var total = Initial_Total;

	// Check to show welcome message or not
	var is_first_time_user = true;

	// Iterates thought each field in Profile_Settings and finds whether tag is
	// available in contact
	$.each(Profile_Settings, function(key, value) {
		// Replaces "_" with space, that is how tag is saved in 'our' domain
		var temp_key = key.indexOf("_") != -1 ? key.replace("_", " ") : key;

		// Checks if tag is available in contact. Sets true in JSON object if
		// tag is available, which indicates that step can be excluded from
		// showing in noty.
		if (tags.indexOf(temp_key) != -1) {
			Profile_Info[key] = true;

			// Calculates complete percentage
			total = total + value;
			is_first_time_user = false;
			return;
		}
	});

	// If user has tags (email, user invited etc) then welcome message is not
	// shown
	if (!is_first_time_user)
		Profile_Info["Welcome"] = !is_first_time_user;

	// Assigns percentage completeness or profile
	Profile_Info["total"] = total;

	return Profile_Info

}

function set_profile_noty() {

}

/**
 * Sets up noty message to be shown. It iterates though profile stats calculated
 * in calculate_profile() method and creates noty template with appropriate
 * message
 */
function set_profile_noty1() {
	console.log(Agile_Contact);
	if (jQuery.isEmptyObject(Agile_Contact))
		return;

	// Gets profile stats
	var profile_stats = calculate_profile();

	// Removes noty before building
	remove_profile_noty();

	$.each(profile_stats, function(key, value) {
		console.log(profile_stats);
		// If value is false, then noty is built with that respective message
		if (value == false) {
			var json = {};
			json.message = Profile_Setup_Messages[key];
			json.route = Profile_Settings[key];
			show_noty_on_top_of_panel(json);
			return false;
		}
	});

}

/**
 * Show noty and arranges home dashbord to adjust accordingly
 * 
 * @param content
 */
function show_noty_on_top_of_panel(content) {
	if (Is_Profile_Guider_Closed)
		return;

	$('body').find('#wrap').find('#notify-container').remove();
	$('body').find('#wrap').find('.navbar-fixed-top').css('margin-top', '0px');
	$('body').find('#wrap').find('#agilecrm-container').css('padding-top',
			'60px');

	$('body').find('#wrap').find('#notify-container').remove();
	$('body').find('#wrap').prepend(getTemplate("sticky-noty", content));
	$('body').find('#wrap').find('.navbar-fixed-top').css('margin-top', '34px');
	$('body').find('#wrap').find('#agilecrm-container').css('padding-top',
			'96px');
}

/**
 * Removes noty and re-arranges the navbar layout by removing 60px padding which
 * is added to show naoty
 */
function remove_profile_noty() {
	$('body').find('#wrap').find('#notify-container').remove();
	$('body').find('#wrap').find('.navbar-fixed-top').css('margin-top', '0px');
	$('body').find('#wrap').find('#agilecrm-container').css('padding-top',
			'60px');
}

$(function() {
	/**
	 * User can exlicitly disable noty in current session. Along with removing
	 * the noty a flag is set, which is checked before showing noty
	 */
	$('span.notify-close').die().live(
			'click',
			function() {
				// Flat which indicates user has disables
				Is_Profile_Guider_Closed = true;
				$(this).parent().slideUp(
						"slow",
						function() {
							$('body').find('#wrap').find('.navbar-fixed-top')
									.css('margin-top', '0px');
							$('body').find('#wrap').find('#agilecrm-container')
									.css('padding-top', '60px');
						});
			});

	/**
	 * Removes welcome message and shows next step
	 */
	$('#noty-welcome-user').die().live('click', function(e) {
		e.preventDefault();
		delete Profile_Info["Welcome"];
		set_profile_noty();

	})
});
var existingDocumentsView;

$(function(){
	$(".task-edit-contact-tab").die().live('click', function(e){
		e.preventDefault();
		var id = $(this).attr('data');
		var value = tasksView.collection.get(id).toJSON();
		deserializeForm(value, $("#updateTaskForm"));
    	$("#updateTaskModal").modal('show');
		// Fills owner select element
		populateUsers("owners-list", $("#updateTaskForm"), value, 'taskOwner', function(data){
			$("#updateTaskForm").find("#owners-list").html(data);
			if(value.taskOwner)
				$("#owners-list", $("#updateTaskForm")).find('option[value='+value['taskOwner'].id+']').attr("selected", "selected");
			
			$("#owners-list", $("#updateTaskForm")).closest('div').find('.loading-img').hide();
		});
	});
	
	// Event edit in contact details tab
	$(".event-edit-contact-tab").die().live('click', function(e){
		e.preventDefault();
		var id = $(this).attr('data');
		var value = eventsView.collection.get(id).toJSON();
		deserializeForm(value, $("#updateActivityForm"));
    	$("#updateActivityModal").modal('show');
	});
	
	$(".complete-task").die().live('click', function(e){
		e.preventDefault();
		if ($(this).is(':checked')) {
		var id = $(this).attr('data');
		var that = this;
			complete_task(id, tasksView.collection, undefined, function(data) {
				$(that).fadeOut();
				$(that).siblings(".task-subject").css("text-decoration", "line-through");
				console.log($(that).parents('.activity-text-block').css("background-color", "#FFFAFA"));
			});
		}
	});
	
	// For adding new deal from contact-details
	$(".contact-add-deal").die().live('click', function(e){
		e.preventDefault();
		var el = $("#opportunityForm");
		$("#opportunityModal").modal('show');
		
		// Fills owner select element
		populateUsers("owners-list", el, undefined, undefined, function(data){
			
			$("#opportunityForm").find("#owners-list").html(data);
			$("#owners-list", $("#opportunityForm")).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
			$("#owners-list", $("#opportunityForm")).closest('div').find('.loading-img').hide();
		});
		// Contacts type-ahead
		agile_type_ahead("relates_to", el, contacts_typeahead);
		
		// Fills milestone select element
		populateMilestones(el, undefined, undefined, function(data){
			$("#milestone", el).html(data);
			$("#milestone", el).closest('div').find('.loading-img').hide();
		});

		// Enable the datepicker
		$('#close_date', el).datepicker({
			format : 'mm/dd/yyyy',
		});
		
    	var json = App_Contacts.contactDetailView.model.toJSON();
    	var contact_name = getContactName(json);
    	$('.tags',el).append('<li class="tag"  style="display: inline-block; vertical-align: middle; margin-right:3px;" data="'+ json.id +'">'+contact_name+'</li>');
		
	});
	
	// For updating a deal from contact-details
	$(".deal-edit-contact-tab").die().live('click', function(e){
		e.preventDefault();
		var id = $(this).attr('data');
		updateDeal(dealsView.collection.get(id));
	});
	
	
	//For Adding new case from contacts/cases
	
	$(".contact-add-case").die().live('click', function(e){
		e.preventDefault();
		var el = $("#casesForm");
		
		// Fills owner select element
		populateUsers("owners-list", el, undefined, undefined, function(data){
			
			$("#casesForm").find("#owners-list").html(data);
			$("#owners-list", $("#casesForm")).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
			// Contacts type-ahead
			agile_type_ahead("contacts-typeahead-input", el, contacts_typeahead);
			
			// Enable the datepicker
			$('#close_date', el).datepicker({
				format : 'mm/dd/yyyy',
			});
			
        	var json = App_Contacts.contactDetailView.model.toJSON();
        	var contact_name = getContactName(json);
        	$('.tags',el).append('<li class="tag"  style="display: inline-block; vertical-align: middle; margin-right:3px;" data="'+ json.id +'">'+contact_name+'</li>');
			
			$("#casesModal").modal('show');
		});
	});
	
	// For updating a case from contact-details
	$(".cases-edit-contact-tab").die().live('click', function(e){
		e.preventDefault();
		var id = $(this).attr('data');
		updatecases(casesView.collection.get(id));
	});
	
	//Adding contact when user clicks Add contact button under Contacts tab in Company Page
	$(".contact-add-contact").die().live('click',function(e)
	{
		e.preventDefault();
		
		//This is a hacky method. ( See jscore/contact-management/modals.js for its use )
		//'forceCompany' is a global variable. It is used to enforce Company name on Add Contact modal.
		//Prevents user from removing this company from the modal that is shown.
		//Disables typeahead, as it won't be needed as there will be no Company input text box.
		var json = App_Contacts.contactDetailView.model.toJSON();
		forceCompany.name=getContactName(json); //name of Company
		forceCompany.id=json.id;	// id of Company
		forceCompany.doit=true;		// yes force it. If this is false the Company won't be forced.
									// Also after showing modal, it is set to false internally, so 
									// Company is not forced otherwise.
		$('#personModal').modal('show');
	});
	
	// For adding new document from contact-details
	$(".contact-add-document").die().live('click', function(e){
		e.preventDefault();
		var el = $("#uploadDocumentForm");
		$("#uploadDocumentModal").modal('show');

		// Contacts type-ahead
		agile_type_ahead("document_relates_to_contacts", el, contacts_typeahead);

    	var json = App_Contacts.contactDetailView.model.toJSON();
    	var contact_name = getContactName(json);
    	$('.tags',el).append('<li class="tag"  style="display: inline-block; vertical-align: middle; margin-right:3px;" data="'+ json.id +'">'+contact_name+'</li>');
	});
	
	// For updating document from contact-details
	$(".document-edit-contact-tab").die().live('click', function(e){
		e.preventDefault();
		var id = $(this).attr('data');
		updateDocument(documentsView.collection.get(id));
	});
	
	// For unlinking document from contact-details
	$(".document-unlink-contact-tab").die().live('click', function(e){
		e.preventDefault();
		var id = $(this).attr('data');
		var json = documentsView.collection.get(id).toJSON();
		
		// To get the contact id and converting into string
		var contact_id = App_Contacts.contactDetailView.model.id + "";
		
	    // Removes the contact id from related to contacts
		json.contact_ids.splice(json.contact_ids.indexOf(contact_id),1);
		
		// Updates the document object and hides 
		var newDocument = new Backbone.Model();
		newDocument.url = 'core/api/documents';
		newDocument.save(json, {
			success : function(data) {
				documentsView.collection.remove(json);
				documentsView.render(true);
			}
		});
	});

	/**
	 * For showing new/existing documents
	 */
	$(".add-document-select").die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div");
		$(this).css("display", "none");
		el.find(".contact-document-select").css("display", "inline");
		var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
        fillSelect('document-select','core/api/documents', 'documents',  function fillNew()
		{
			el.find("#document-select").append("<option value='new'>Add New Doc</option>");

		}, optionsTemplate, false, el); 
	});
	
	/**
	 * To cancel the add documents request
	 */
	$(".add-document-cancel").die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div");
		el.find(".contact-document-select").css("display", "none");
		el.find(".add-document-select").css("display", "inline");
	});
	
	/**
	 * For adding existing document to current contact
	 */
	$(".add-document-confirm").die().live('click', function(e){
		e.preventDefault();
		
	    var document_id = $(this).closest(".contact-document-select").find("#document-select").val();

	    var saveBtn = $(this);
		
  		// To check whether the document is selected or not
	    if(document_id == "")
	    {
	    	saveBtn.closest("span").find(".save-status").html("<span style='color:red;margin-left:10px;'>This field is required.</span>");
	    	saveBtn.closest("span").find('span.save-status').find("span").fadeOut(5000);
	    	return;
	    }	    	
	    else if(document_id == "new")
	    {
	    	var el = $("#uploadDocumentForm");
			$("#uploadDocumentModal").modal('show');

			// Contacts type-ahead
			agile_type_ahead("document_relates_to_contacts", el, contacts_typeahead);

	    	var json = App_Contacts.contactDetailView.model.toJSON();
	    	var contact_name = getContactName(json);
	    	$('.tags',el).append('<li class="tag"  style="display: inline-block; vertical-align: middle; margin-right:3px;" data="'+ json.id +'">'+contact_name+'</li>');
	    }
	    else if(document_id != undefined && document_id != null)
	    {
			if(!existingDocumentsView)
			{
				existingDocumentsView = new Base_Collection_View({ 
					url : 'core/api/documents',
					restKey : "documents",
				});
				existingDocumentsView.collection.fetch({
				    success: function(data){
				    		existing_document_attach(document_id, saveBtn);
				    	}
			        });
			}
			else
				existing_document_attach(document_id, saveBtn);
	    }

	});
	
});

/** 
 * To attach the document to a contact
 * @param document_id
 * @param saveBtn
 */
function existing_document_attach(document_id, saveBtn)
{
    var json = existingDocumentsView.collection.get(document_id).toJSON();
	
	// To get the contact id and converting into string
	var contact_id = App_Contacts.contactDetailView.model.id + "";
    
    // Checks whether the selected document is already attached to that contact
    if((json.contact_ids).indexOf(contact_id) < 0)
    {
    	json.contact_ids.push(contact_id);
    	saveDocument(null, null, saveBtn, false, json);
    }
    else
    {
    	saveBtn.closest("span").find(".save-status").html("<span style='color:red;margin-left:10px;'>Linked Already</span>");
    	saveBtn.closest("span").find('span.save-status').find("span").fadeOut(5000);
    	return;
    }
}/**
 * note.js script file defines the functionality of saving a note in Note
 * database. If note is related to a contact, which is in contact detail view
 * then the note model is inserted into time-line.
 * 
 * @module Contact management
 * @author Rammohan
 */
$(function()
{

	$(".edit-note").die().live('click', function(e)
	{
		e.preventDefault();
		console.log($(this).attr('data'));
		var note = notesView.collection.get($(this).attr('data'));
		console.log(note);

		// Clone modal, so we dont have to create a update modal.
		// we can clone add change ids and use it as different modal

		$('#noteUpdateModal').remove();

		var noteModal = $("#noteModal").clone();

		$("#noteForm > fieldset", noteModal).prepend('<input name="id" type="hidden"/>')
		$("#noteForm", noteModal).attr('id', "noteUpdateForm");
		noteModal.attr('id', "noteUpdateModal");
		$("#note_validate", noteModal).attr("id", "note_update");
		deserializeForm(note.toJSON(), $("#noteUpdateForm", noteModal));

		noteModal.modal('show');
		// noteModal.modal('show');
	});

	$("#note_update").live('click', function(e)
	{
		e.preventDefault();

		// Returns, if the save button has disabled attribute
		if ($(this).attr('disabled'))
			return;

		// Disables save button to prevent multiple click event issues
		disable_save_button($(this));//$(this).attr('disabled', 'disabled');

		if (!isValidForm('#noteUpdateForm'))
		{

			// Removes disabled attribute of save button
			enable_save_button($(this));
			return;
		}

		// Shows loading symbol until model get saved
		//$('#noteUpdateModal').find('span.save-status').html(LOADING_HTML);

		var json = serializeForm("noteUpdateForm");
		
		
/*		if(json.id)
			{
				if(notesView && notesView.collection && notesView.collection.get(json.id))
					{
						notesView.collection.get(json.id).set(json, {silent:true});
					}
			}*/

		saveNote($("#noteUpdateForm"), $("#noteUpdateModal"), this, json);
	});
	/**
	 * Saves note model using "Bcakbone.Model" object, and adds saved data to
	 * time-line if necessary.
	 */
	$('#note_validate').live('click', function(e)
	{
		e.preventDefault();

		// Returns, if the save button has disabled attribute
		if ($(this).attr('disabled'))
			return;
		
		if (!isValidForm('#noteForm'))
		{
			return;
		}

		disable_save_button($(this));
		
		// Shows loading symbol until model get saved
		//$('#noteModal').find('span.save-status').html(LOADING_HTML);

		var json = serializeForm("noteForm");

		console.log(json.from_task);
		
		if(json.from_task == "true")
			saveNoteOfTask($("#noteForm"), $("#noteModal"), this, json);
		else		
		    saveNote($("#noteForm"), $("#noteModal"), this, json);
	});

	/**
	 * Shows note modal and activates contacts typeahead to its related to field
	 */
	$('#show-note').live('click', function(e)
	{
		e.preventDefault();
		$("#noteModal").modal('show');

		var el = $("#noteForm");
		agile_type_ahead("note_related_to", el, contacts_typeahead);
	});

	/**
	 * "Hide" event of note modal to remove contacts appended to related to
	 * field and validation errors
	 */
	$('#noteModal').on('hidden', function()
	{
		// Removes appended contacts from related-to field
		$("#noteForm").find("li").remove();

		// Remove value of input field
		$("#from_task", "#noteForm").val("");
		$("#task_form", "#noteForm").val("");
		
		// Removes validation error messages
		remove_validation_errors('noteModal');
	});

	function saveNote(form, modal, element, note)
	{

		console.log(note);
		var noteModel = new Backbone.Model();
		noteModel.url = 'core/api/notes';
		noteModel.save(note, { success : function(data)
		{

			// Removes disabled attribute of save button
			enable_save_button($(element));//$(element).removeAttr('disabled');

			form.each(function()
			{
				this.reset();
			});

			// Removes loading symbol and hides the modal
			//modal.find('span.save-status img').remove();
			modal.modal('hide');

			var note = data.toJSON();

			console.log(note);
			console.log(notesView.collection.toJSON());
			// Add model to collection. Disabled sort while adding and called
			// sort explicitly, as sort is not working when it is called by add
			// function
			if (notesView && notesView.collection)
			{
				if(notesView.collection.get(note.id))
				{
					notesView.collection.get(note.id).set(new BaseModel(note));
				}
				else
				{
					notesView.collection.add(new BaseModel(note), { sort : false });
					notesView.collection.sort();
				}
			}
			/*
			 * Updates data (saved note) to time-line, when contact detail view
			 * is defined and the note is related to the contact which is in
			 * detail view.
			 */
			if (App_Contacts.contactDetailView && Current_Route == "contact/" + App_Contacts.contactDetailView.model.get('id'))
			{
				$.each(note.contacts, function(index, contact)
				{
					if (contact.id == App_Contacts.contactDetailView.model.get('id'))
					{

						// Activates "Timeline" tab and its tab content in
						// contact detail view
						// activate_timeline_tab();
						add_entity_to_timeline(data);
						/*
						 * If timeline is not defined yet, initiates with the
						 * data else inserts
						 */
						return false;
					}

				});
			}
		} });
	}
});
/**
 * Fetches all the entities (notes, deals, tasks, logs and mails) simultaneously, 
 * which are related to a contact (in contactDetailView) and initiates isotope 
 * with the first fetched details (to show in time-line) and inserts the next 
 * fetched data into time-line.
 *  
 * @method load_timeline_details 
 * @param {Object} el
 * 				html object of contact detail view
 * @param contactId
 * 				id of a contact in contact detail view
 */

/*
 * Taken as global to verify whether timeline is defined or not while adding
 * entities (notes, tasks and etc..) related to a contact.
 */  
var timelineView;
function load_timeline_details(el, contactId, callback1)
{
	// Sets to true, if the associated entity is fetched 
	var is_logs_fetched = false, is_mails_fetched = false, is_array_urls_fetched = false;
	
		/**
		 * An empty collection (length zero) is created to add first fetched 
		 * details and then initializes isotope with this data 
		 */ 
		timelineView =  new Base_Collection_View({
			templateKey: 'timeline',
			individual_tag_name: 'li',
		});
	
		
		/**
		 * Another empty collection is created to add other data (apart from first fetched)
		 * which is fetched while the isotope is getting initialized with the first fetched 
		 * data, because it can not be inserted with out complete initialization of isotope.  
		 * 
		 */
		var timelineViewMore =  new Base_Collection_View({
			templateKey: 'timeline',
			individual_tag_name: 'li',
		});
		
		// Override comparator to sort models on time base
		timelineView.collection.comparator = function(item){
			if (item.get('created_time')) {
	            return item.get('created_time');
	        }
			if (item.get('createdTime')) {
				return item.get('createdTime')/1000;
		    }
	        if (item.get('time')) {
	        	return item.get('time')/1000;
	        }
	        if (item.get('date_secs')) {
	        	return item.get('date_secs')/1000;
	        }
	        return item.get('id');
		}
		
		var contact = App_Contacts.contactDetailView.model.toJSON();
		
		addTagsToTimeline(App_Contacts.contactDetailView.model, el);
		
		// Fetches logs related to the contact
		var LogsCollection = Backbone.Collection.extend({
			url: '/core/api/campaigns/logs/contact/' + contactId,
		});
		var logsCollection = new LogsCollection();
		logsCollection .fetch({
			success: function(){
				is_logs_fetched = true;
				show_timeline_padcontent(is_logs_fetched, is_mails_fetched, is_array_urls_fetched);
				
				// Remove logs related loading image
				$('#time-line', el).find('.loading-img-log').remove();
				if(logsCollection.length == 0)
					return;
	
				// If timeline is not defined yet, calls setup_timeline for the first time
				if(timelineView.collection.length == 0){
					$.each(logsCollection.toJSON(), function(index, model){
						
						// Add these log-types in timeline
						if(model.log_type == 'EMAIL_SENT' || model.log_type == 'EMAIL_OPENED' || model.log_type == 'EMAIL_CLICKED' 
							 || model.log_type == 'SET_OWNER' || model.log_type == 'SCORE'
								|| model.log_type == 'ADD_DEAL' || model.log_type == 'TWEET')
						{
							timelineView.collection.add(model, {silent : true});
						}
						
					});
								
					/*
					 * Calls setup_timeline with a callback function to insert other models 
					 * (fetched while initializing the isotope) if available.
					 */
					setup_timeline(timelineView.collection.toJSON(), el, function(el){
						$.each(timelineViewMore.collection.toJSON(), function(index,data){
							var newItem = $(getTemplate("timeline", data));
							newItem.find('.inner').append('<a href="#" class="open-close"></a>');
							$('#timeline', el).isotope( 'insert', newItem);
						});
					});
				}else{
					var logs_array = [];	
					/*
					 * Already setup_timeline is called with the first fetched data. Adds all the
					 * logs of each campaign to an array and then inserts the array values 
					 * (avoids calling insertion and month marker multiple times).
					 * Inserts the data into timeline or adds to other collection (timelineViewMore) 
					 * by validating the status of isotope initialization.
					 */   
					$.each(logsCollection.toJSON(), function(index, model) {						
						
						// Add these log-types in timeline.
						if(model.log_type == 'EMAIL_SENT' || model.log_type == 'EMAIL_OPENED' || model.log_type == 'EMAIL_CLICKED' 
							 || model.log_type == 'SET_OWNER' || model.log_type == 'SCORE'
									|| model.log_type == 'ADD_DEAL' || model.log_type == 'TWEET')
						{
							logs_array.push(model);			
						    timelineView.collection.add(model, {silent : true});
						}
						
						//validate_insertion(JSON.parse(model.logs), timelineViewMore);
					});
					validate_insertion(logs_array, timelineViewMore);
				}
			
			}
		});
		
		/** Emails Collection Starts**/
		var contact = App_Contacts.contactDetailView.model;
		var json = contact.toJSON();
		 
		// Get email of the contact in contact detail
		var email = getPropertyValue(json.properties, "email");
		
		// Go for mails when only the contact has an email
		if(email){
			
			var EmailsCollection = Backbone.Collection.extend({
				url: 'core/api/emails/imap-email?e=' + encodeURIComponent(email) + '&c=10&o=0',
			});
			var emailsCollection = new EmailsCollection();
			emailsCollection .fetch({
				success: function(){
					is_mails_fetched = true;
					show_timeline_padcontent(is_logs_fetched, is_mails_fetched, is_array_urls_fetched);
					
					$('#time-line', el).find('.loading-img-email').remove();
					
					
					
					if(emailsCollection.toJSON()[0] && emailsCollection.toJSON()[0]['emails'] && emailsCollection.toJSON()[0]['emails'].length > 0){
					
						// Adds Personal Email Opened Track Data to timeline.
						add_personal_email_opened_to_timeline(emailsCollection.toJSON()[0]['emails'],el);

						// If timeline is not defined yet, calls setup_timeline for the first time
						if(timelineView.collection.length == 0 && emailsCollection.toJSON()[0]){

							// No callback function is taken as the email takes more time to fetch
							setup_timeline(timelineView.collection.toJSON(), el, function(el) {

								$.each(timelineViewMore.collection.toJSON(), function(index,data){
									
									// if error occurs in imap (model is obtained with the error msg along with contact-email models),
									// ignore that model
									if(('errormssg' in data) || data.status === "error")
										return true;
									
									var newItem = $(getTemplate("timeline", data));
									newItem.find('.inner').append('<a href="#" class="open-close"></a>');
									$('#timeline', el).isotope( 'insert', newItem);
								});
							});
						}else{
							    var emailsArray = [];
							    
								$.each(emailsCollection.toJSON()[0]['emails'], function(index, model){
									
									// if error occurs in imap (model is obtained with the error msg along with contact-email models),
									// ignore that model
									if(('errormssg' in model) || model.status === "error")
										return true;
									
									emailsArray.push(model);
								});
								
							validate_insertion(emailsArray, timelineViewMore);
							}
					}
				},
				error: function(){
					is_mails_fetched = true;
					show_timeline_padcontent(is_logs_fetched, is_mails_fetched, is_array_urls_fetched);
					
					// Remove loading image of mails
					$('#time-line', el).find('.loading-img-email').remove();
				}
			});
			
			// Gets address of the contact from its browsing history
			var address = getPropertyValue(json.properties, "address");
           
			//if(!address)
				//get_address_from_browsing_history(email, json,el);
			
			// Gets address from stats and save to contact
			get_stats(email,json,el);
		}else{
			is_mails_fetched = true;
			
			// Removes loading image of mails, if there is no email to contact  
			$('#time-line', el).find('.loading-img-email').remove();
			$('#time-line',el).find('.loading-img-stats').remove();
		}
		/**End of Emails Collection**/
		
		/**
		 * Defines a collection to store the response of all the request urls (notes, deals 
		 * and tasks) in the array (fetchContactDetails).
		 */ 
		
		var entity_types = ["deals", "notes", "cases", "tasks"]
		$.getJSON('core/api/contacts/related-entities/' + contactId, function(data){
			var entities = [];
			
			for(var index in entity_types)
			{
				entities = entities.concat(data[entity_types[index]]);
				
			}
			
			remove_loading_img(el);
			
			
			timelineView.collection.add(entities , {silent : true});
			
		
				// If timeline is not defined yet, calls setup_timeline for the first time
				if(timelineView.collection.length == 0){

					/*
					 * Calls setup_timeline with a callback function to insert other models 
					 * (fetched while initializing the isotope) if available.
					 */
					setup_timeline(timelineView.collection.toJSON(), el, function(el) {
						
						$.each(timelineViewMore.collection.toJSON(), function(index,data){
							var newItem = $(getTemplate("timeline", data));
							newItem.find('.inner').append('<a href="#" class="open-close"></a>');
							$('#timeline', el).isotope( 'insert', newItem);
						});
					})
				}else{
					
					/*
					 * Already setup_timeline is called with the first fetched data.
					 * 
					 * Inserts the data into timeline or adds to other collection (timelineViewMore) 
					 * by validating the status of isotope initialization.
					 */							
					validate_insertion(entities, timelineViewMore);
				}
		})
}	

/**
 * Inserts the models into timeline, if isotope is defined (initialized 
 * completely) otherwise adds to a collection (timelineViewMore) to insert
 * them on complete initialization of isotope from setupTimelin callback
 * function.
 * 
 * @method validate_insertion
 * @param models
 * 			collection of models to add timeline
 * @param timelineViewMore
 * 			collection to add models
 * 			
 */
function validate_insertion(models, timelineViewMore){
	
	/*
	 * If isotope is not defined an exception will be raised, then
	 * it goes to catch block and adds the data to the collection
	 */
	try{
		head.load(LIB_PATH + "lib/jquery.isotope.min.js", LIB_PATH + "lib/jquery.event.resize.js", "css/misc/agile-timline.css", function(){
		

			if($('#timeline').isotope()) {
				var month_years = [];
				$.each(models, function(index, model){
					var month_year = entity_created_month_year(model);

					if (month_years.indexOf(month_year) < 0 && MONTH_YEARS.indexOf(month_year) < 0){
						month_years[month_years.length] = month_year;
						MONTH_YEARS[MONTH_YEARS.length] = month_year;
					}	
					var newItem = $(getTemplate("timeline", model));
					newItem.find('.inner').append('<a href="#" class="open-close"></a>');
					$('#timeline').isotope( 'insert', newItem);
				});

				// add a month marker for each month that has a post
				create_month_marker(month_years, true, App_Contacts.contactDetailView.el);
			}
		});
		
	}catch(err){
		console.log(err);
		timelineViewMore.collection.add(models);
	}
}

/**
 * Shows "no entities present" pad content for timeline by verifying
 * whether all the entities are fetched or not.
 *  
 * @param is_logs_fetched
 * @param is_mails_fetched
 * @param is_array_urls_fetched
 */
function show_timeline_padcontent(is_logs_fetched, is_mails_fetched, is_array_urls_fetched){
	if(!is_logs_fetched || !is_mails_fetched || !is_array_urls_fetched )
		return;
	
	if (timelineView.collection.length == 0)
		$("#timeline-slate").css('display', 'block');
}

// Stores month names with their maximum days to get time stamp (milliseconds)
var monthArray = ['January 31', 'February 28', 'March 31', 'April 30', 'May 31', 'June 30',
                  'July 31', 'August 31', 'September 30', 'October 31', 'November 30', 'December 31'];

// Stores "monthIndex-year" of timeline initiating entities
var MONTH_YEARS;

/**
 * Get the timestamp (milliseconds) given month of the year.
 */
function getTimestamp(month_index, year){
	if((year % 4) == 0)
		monthArray[1] = 'February 29';
	return Date.parse(monthArray[month_index] + ', ' + year) + 86400000 - 1; 
}

/**
 * Returns month index and full year of the given entity as "-" separated.
 * @param model
 * @returns {String}
 */
function entity_created_month_year(model){
	if(model.created_time)
		return month_year = new Date(model.created_time * 1000).getMonth() + '-' + new Date(model.created_time * 1000).getFullYear();
	if(model.createdTime)
		return month_year = new Date(model.createdTime).getMonth() + '-' + new Date(model.createdTime).getFullYear();
	else if(model.time)
		return month_year = new Date(model.time * 1000).getMonth() + '-' + new Date(model.time * 1000).getFullYear();
	else if(model.date_secs)
		return month_year = new Date(model.date_secs).getMonth() + '-' + new Date(model.date_secs).getFullYear();
}

/**
 * Inserts or appends month marker to the timeline
 * @param month_years
 * @param is_insert
 */
function create_month_marker(month_years, is_insert, el){
	// add a year marker for each year that has a post
	$.each(month_years, function(i, val){
		var monthYear = val.split('-');
		var timestamp = getTimestamp(monthYear[0], monthYear[1]) / 1000;
		var context = {year: monthArray[monthYear[0]].split(' ')[0], timestamp: timestamp};
		if(is_insert){
			$('#timeline', el).isotope( 'insert', $(getTemplate("year-marker", context)));
		}	
		else{
			$('#timeline', el).append(getTemplate("year-marker", context));
		}	
	});
	$("#timline").isotope('reloadItems');
}


function add_entity_to_timeline(model)
{
	var list = [];
	list.push(model.toJSON())

	// console.log(model.get('id'));

	if (!timelineView.collection.get(model.get('id')))
	{
		timelineView.collection.add(model,  {silent : true})
		validate_insertion(list);
		return;
	}


	update_entity_template(model);

}

function update_entity_template(model)
{
	$("#" + model.get("id"), $('#timeline', App_Contacts.contactDetailView.el)).html(getTemplate('timeline', model.toJSON()));
}


/**
 * Loads minified jquery.isotope plug-in and jquery.event.resize plug-in to 
 * initialize the isotope and appends the given models to the timeline, by 
 * loading their corresponding templates using handlebars
 * 
 * @method setup_timeline 
 * @param models
 * 			models to append timeline
 * @param el
 * 			html object of the contact detail view
 * @param callback
 * 			function to insert models into timeline on its initialization
 */
function setup_timeline(models, el, callback) {
	
	// Removes pad content of no data presents
	 $("#timeline-slate").css('display', 'none');
	 
	 MONTH_YEARS = [];
	
	// Load plugins for timeline	
	
		
	 head.load(LIB_PATH + "lib/jquery.isotope.min.js", LIB_PATH + "lib/jquery.event.resize.js", "css/misc/agile-timline.css", function(){
		
		 /*
		 * Defines the layout and its dimensions, container size and
		 * arrangement of data position added to timeline etc..
		 */ 
		customize_isotope();
		
		/*
		 * Appends each model to timeline, by loading their corresponding
		 * templates using handlebars
		 */
		$.each(models, function(index, model) {
			
			// saves the month and years so we can create month markers
			var month_year = entity_created_month_year(model);
			
					
			if (MONTH_YEARS.indexOf(month_year) < 0)
				MONTH_YEARS[MONTH_YEARS.length] = month_year;
			
			//console.log(MONTH_YEARS);
			
			// combine data & template
			$('#timeline', el).append(getTemplate("timeline", model));
		}); //each

		// add a month marker for each month that has a post
		create_month_marker(MONTH_YEARS, false, el);

		var $container = $("#timeline", el);
		
		// Initializes isotope with options (sorts the data based on created time)
		$('#timeline', el).imagesLoaded(function(){
			$container.isotope({
				itemSelector : '.item',
				transformsEnabled: true,
				layoutMode: 'spineAlign',
				spineAlign:{
					gutterWidth: 56
				},
				getSortData: {
					timestamp: function($elem){
						var time = parseFloat($elem.find('.timestamp').text());
						
						// If time is in milliseconds then return time in seconds
						if ((time / 100000000000) > 1)
							return time/1000;
						
						return time
					}
				},
				sortBy: 'timestamp',
				sortAscending: false,
				itemPositionDataEnabled: true
			});
		});
		
	/*	// Using autoellipsis for showing 3 lines of message
		head.js(LIB_PATH + 'lib/jquery.autoellipsis.min.js', function(){
			$('#timeline', el).find("#autoellipsis").ellipsis();
			$('#timeline', el).isotope('reLayout');
		});
		*/
		// add open/close buttons to each post
		$('#timeline .item.post', el).each(function(){
			$(this).find('.inner').append('<a href="#" class="open-close"></a>');
		});
		// Resizes the line height based on entities overall height
		$('#timeline', el).resize(function(){
			adjust_line();
		});
		
		/*
		 * Calls the callback function to insert the data into timeline, which
		 * is not inserted due to initialization issues. 
		 */ 
		if(callback && typeof(callback) === "function"){
			callback(el);
		}
		
	}); // head js
	
}

/*
 * Keep the actual line from extending beyond the last item's date tab
 */
function adjust_line(){
	var $lastItem = $('.item.last');
	var itemPosition = $lastItem.data('isotope-item-position');
	var dateHeight = $lastItem.find('.date').height();
	var dateOffset = $lastItem.find('.date').position();
	var innerMargin = parseInt($lastItem.find('.inner').css('marginTop'));
	var lineHeight = itemPosition.y + innerMargin + dateOffset.top + (dateHeight / 2);
	$('#line').height(lineHeight);
}

/**
 * Defines the layout and its dimensions, container size and
 * arrangement of data position added to timeline etc..
 * 
 * @method customize_isotope
 */
function customize_isotope()
{
	// Resets the layout based on items 
	$.Isotope.prototype._spineAlignReset = function() {
		this.spineAlign = {
			colA: 0,
			colB: 0,
			lastY: -60
		};
	};

	/*
	 * Defines the dimentions of layout, and alters the position of data.
	 * It executes every tiem, when a modal is added or deleted from timeline.
	 */ 
	$.Isotope.prototype._spineAlignLayout = function( $elems ) {
		var	instance = this,
			props = this.spineAlign,
			gutterWidth = Math.round( this.options.spineAlign && this.options.spineAlign.gutterWidth ) || 0,
			centerX = Math.round(this.element.width() / 2);

		$elems.each(function(i, val){
			var $this = $(this);
			$this.removeClass('last').removeClass('top');
			if (i == $elems.length - 1)
				$this.addClass('last');
			var x, y;
			if ($this.hasClass('year-marker')){
				var width = $this.width();
				x = centerX - (width / 2);
				if (props.colA >= props.colB){
					y = props.colA;
					if (y == 0) $this.addClass('top');
					props.colA += $this.outerHeight(true);
					props.colB = props.colA;
				}
				else{
					y = props.colB;
					if (y == 0) $this.addClass('top');
					props.colB += $this.outerHeight(true);
					props.colA = props.colB;
				}
			}
			else{
				$this.removeClass('left').removeClass('right');
				var isColA = props.colB >= props.colA;
				if (isColA)
					$this.addClass('left');
				else
					$this.addClass('right');
				x = isColA ?
						centerX - ( $this.outerWidth(true) + gutterWidth / 2 ) : // left side
						centerX + (gutterWidth / 2); // right side
				y = isColA ? props.colA : props.colB;
				if (y - props.lastY <= 60){
					var extraSpacing = 60 - Math.abs(y - props.lastY);
					$this.find('.inner').css('marginTop', extraSpacing);
					props.lastY = y + extraSpacing;
				}
				else{
					$this.find('.inner').css('marginTop', 0);
					props.lastY = y;
				}
				props[( isColA ? 'colA' : 'colB' )] += $this.outerHeight(true);
			}
			instance._pushPosition( $this, x, y );
		});
	};
	
	// Sets the container size based on spinAlignLayout function resulrs
	$.Isotope.prototype._spineAlignGetContainerSize = function() {
		var size = {};
		size.height = this.spineAlign[( this.spineAlign.colB > this.spineAlign.colA ? 'colB' : 'colA' )];
		return size;
	};
	$.Isotope.prototype._spineAlignResizeChanged = function() {
		return true;
	};
}	

/**
 * Removes loading image from timeline view
 * 
 * @param el
 * 			html object of contact detail view
 */
function remove_loading_img(el){
	$('#time-line', el).find('.loading-img').remove();
}

/**
 * When contact has no address, based on its email, traces address from its
 * browsing history and stores as address property of the contact.
 * 
 * To get address of a contact with its email, you should run the java script
 * api provided at api & analytics (admin settings) by pushing the email of the
 * contact
 * 
 * @param {String}
 *            email of the contact
 * @param {Object}
 *            contact present in contact detail view
 * @param {Object}
 *            backbone element.
 */function get_stats(email, contact, el)
{
	// If there are no web-stats - return
	if(!(readCookie('_agile_jsapi') != null && readCookie('_agile_jsapi') == "true") && (NO_WEB_STATS_SETUP && get_web_stats_count_for_domain() == '0'))
	{
		is_mails_fetched = true;
		is_logs_fetched = false;
		is_array_urls_fetched = false;
		show_timeline_padcontent(is_logs_fetched, is_mails_fetched, is_array_urls_fetched);
		
		// Remove loading image of mails
		$('#time-line', el).find('.loading-img-stats').remove();
		
		return;
	}
	
	// Made global variable false and set cookie
	NO_WEB_STATS_SETUP = false;
	createCookie('_agile_jsapi',true, 500);
	
	var StatsCollection = Backbone.Collection.extend({
		                        url:'core/api/web-stats?e='+ encodeURIComponent(email)
		                                             });
	
	this.statsCollection = new StatsCollection();
	statsCollection.fetch({
		success:function(data){
			
			is_mails_fetched = true;
			is_logs_fetched = false;
			is_array_urls_fetched = false;
			
			show_timeline_padcontent(is_logs_fetched, is_mails_fetched, is_array_urls_fetched);
			
         	$('#time-line', el).find('.loading-img-stats').remove();
			
			// Checks whether data is empty or not.
			if (data.toJSON() && data.toJSON().length > 0) {
				
				// Gets address of the contact from its browsing history
				var address = getPropertyValue(contact.properties, "address");
				
				if(!address)
				{
				var addressJSON = {};
				
				if(data.toJSON()[0].city != "")
				{
				    addressJSON.city = ucfirst(data.toJSON()[0].city);
				    addressJSON.state = ucfirst(data.toJSON()[0].region);
				    addressJSON.country = getCode(data.toJSON()[0].country);
				
					// If contact has no address property push the new one
					contact.properties.push({
					"name" : "address",
					"value" : JSON.stringify(addressJSON)
				                       });
					
					// Update contact with the browsing address
					var contactModel = new Backbone.Model();
					contactModel.url = 'core/api/contacts';
					contactModel.save(contact, {
						success : function(obj) {
						                        }
					                  });
				  }
				}
								
				// If timeline is not defined yet, calls setup_timeline for the first time
				if(timelineView.collection.length == 0)
				{					
					$.each(data.toJSON(),function(index,model){					
						timelineView.collection.add(model,  {silent : true});
					});					
					
					// No callback function is taken as the stats takes more time to fetch
					setup_timeline(timelineView.collection.toJSON(), el);							
				}
				else
				{					
						$.each(data.toJSON(),function(index,model){
						var newItem = $(getTemplate("timeline", model));
						newItem.find('.inner').append('<a href="#" class="open-close"></a>');
						
						/*
						 * Inserts mails to timeline with out validating the isotope status,
						 * as it takes more time to fetch.
						 */  
						$('#timeline', el).isotope( 'insert', newItem);
						});
				}
				
				addTagAgile(CODE_SETUP_TAG);	
			}
			
		},
		error: function(){
			is_mails_fetched = true;
			show_timeline_padcontent(is_logs_fetched, is_mails_fetched, is_array_urls_fetched);
			
			// Remove loading image of mails
			$('#time-line', el).find('.loading-img-stats').remove();
		}
	});
	}
 
 function addTagsToTimeline(contact, el)
 {
 	if (timelineView.collection.length == 0)
 	{
 		timelineView.collection.add(contact, {silent : true});

 		// Add tags in timeline
 		$.each(contact.get('tagsWithTime'), function(index, tag)
 		{
 			// console.log(tag);
 			timelineView.collection.add(tag, {silent : true});
 		})
 		setup_timeline(timelineView.collection.toJSON(), el);

 	}
 	else
 	{
 		var newItem = $(getTemplate("timeline", contact));
 		var newItem = $(getTemplate("timeline", contact));

 		newItem.find('.inner').append('<a href="#" class="open-close"></a>');
 		/*
 		 * Inserts mails to timeline with out validating the isotope status, as
 		 * it takes more time to fetch.
 		 */
 		$('#timeline', el).isotope('insert', newItem);
 	}
 }

 function addTagToTimelineDynamically(tags)
 {
 	if (timelineView.collection.length == 0)
 	{
 		$.each(tags, function(index, tag)
 		{
 			timelineView.collection.add(tag, {silent : true});
 		});

 		setup_timeline(timelineView.collection.toJSON(), el);
 		return;
 	}

 	var tags_to_add = [];
 	$.each(tags, function(index, tag)
 	{
 		if (!timelineView.collection.where(tag).length == 0)
 			return;

 		timelineView.collection.add(tag, {silent : true});
 		tags_to_add.push(tag);
 	});

 	validate_insertion(tags_to_add);

 	/*
 	 * var newItem = $(getTemplate("timeline", tag));
 	 * 
 	 * newItem.find('.inner').append('<a href="#" class="open-close"></a>');
 	 * 
 	 * Inserts mails to timeline with out validating the isotope status, as it
 	 * takes more time to fetch.
 	 * 
 	 * $('#timeline', el).isotope( 'insert', newItem);
 	 */

 }
 
 /**
  * Adds Email Opened data having email opened time to timeline.
  * 
  * @param emails - Emails JSON.
  * 
  * @param el - Backbone el.
  **/
 function add_personal_email_opened_to_timeline(emails,el)
 {
	// Temporary array to clone emails
	var emails_clone = [];
	
	// Clone emails Array to not affect original emails
	$.extend(true, emails_clone, emails);
	
	var emails_opened = [];
	 
	 if (timelineView.collection.length == 0)
	 	{
			 $.each(emails_clone,function(index, model){
				if(model.email_opened_at && model.email_opened_at !== 0)
			 	{
				 	// Need createdTime key to sort in timeline.
					model.createdTime = (model.email_opened_at) * 1000;
					
				 	// Temporary entity to identify timeline template
					model.agile_email = "agile_email";
				 	
					// To avoid merging with emails template having date entity
					model.date = undefined;
					
				 	timelineView.collection.add(model, {silent : true});
			 	}
			 });
			 
			 setup_timeline(timelineView.collection.toJSON(), el);
	 	}
	 else
		 {
		 $.each(emails_clone, function(index, model){
				if(model.email_opened_at && model.email_opened_at !== 0)
			 	{
					// Need createdTime key to sort in timeline.
					model.createdTime = (model.email_opened_at) * 1000;
				 	
					// Temporary entity to identify timeline template
					model.agile_email = "agile_email";
				 	
					// To avoid merging with emails template having date entity
					model.date = undefined;
				 	
					emails_opened.push(model);
			 	}
			 });
		 
		 validate_insertion(emails_opened);
		 }
 }

 /**
  * Removes an element from timeline
  * 
  * @param element
  */
 function removeItemFromTimeline(element)
 {
 	console.log(element);
 	$('#timeline').isotope('remove', element, function()
 	{
 		$("#timeline").isotope( 'reLayout')
 	});
 }

/**
 * Handles the events (click and mouseenter) of mail and log entities of 
 * tiemline 
 */
$(function () {
	/*
	 * Shows the mail details in detail on a popup modal, when '+'
	 * symbol is clicked 
	 */  
	$("#tl-mail-popover").live('click',function(e){
		e.preventDefault();
		
		var htmlstring = $(this).closest('div').attr("data");
		// var htmlstring = $(this).closest('div.text').html();
		// htmlstring = htmlstring.replace("icon-plus", "");

		$("#mail-in-detail").html("<div style='background:none;border:none;'>" + htmlstring + "</div>");
		
		$("#timelineMailModal").modal("show");
        
    });
	
	/*
	 * Shows the campaign log details on a popup modal
	 */ 
	$("#tl-log-popover").live('click',function(e){
		e.preventDefault();
		
		var string = $(this).closest('div').attr("data");

		// Add div tag to the string to consider white spaces
		$("#log-in-detail").html("<div style='background:none;border:none;'>" + string + "</div>");
		
		$("#timelineLogModal").modal("show");
    });
	
	/**
	 * Shows analytics popup modal with full details.
	 **/
	$("#tl-analytics-popover").live('click',function(e){
		e.preventDefault();
		
		var string = $(this).closest('div.body').html();
		var pageViews = $(string).find('div.ellipsis-multi-line');

		$("#analytics-in-detail").html("<div'>" + $(pageViews).html() + "</div>");
		
		$("#timelineAnalyticsModal").modal("show");
	});
	
	/*
	 * Shows the list of mails(mail sent to) as popover, when mouse is entered on
	 * to address of the email
	 */  
	$("#tl-mail-to-popover").live('mouseenter',function(e){
		
		$(this).popover({
        	template:'<div class="popover"><div class="arrow"></div><div class="popover-inner" style="padding:1px;width:340px;border-radius:2px"><div class="popover-content"><p></p></div></div></div>'
        });
		
		var string = $(this).text();
		var html = new Handlebars.SafeString(string.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/,/g, ",</br>").replace("To:","To:</br>").replace("read more", ""));
		$(this).attr("data-content", html);
        $(this).popover('show');
    });
	
	// Resizes the item height and open close effect for timeline elements
	$('#timeline .item a.open-close').live("click", function(e){
		$(this).siblings('.body').slideToggle(function(){
			$('#timeline').isotope('reLayout');
		});
		$(this).parents('.post').toggleClass('closed');
		$('#expand-collapse-buttons a').removeClass('active');
		e.preventDefault();
	});
	
});/**
 * contact-details-tabs.js fetches the contact (which is in contact detail view) 
 * related details (notes, tasks, deals, campaigns and mails etc..) and presents 
 * in tab content as specified, when the corresponding tab is clicked. 
 * Timeline tab is activated by default to show all the details as vertical time-line.
 * 
 * @module Contact management
 * @author Rammohan
 */

var contact_tab_position_cookie_name = "contact_tab_position_" + CURRENT_DOMAIN_USER.id;

var CONTACT_ASSIGNED_TO_CAMPAIGN = false;

var NO_WEB_STATS_SETUP = true;

function fill_company_related_contacts(companyId, htmlId)
{
	$('#'+htmlId).html(LOADING_HTML);
	
	var companyContactsView = new Base_Collection_View({
		url : 'core/api/contacts/related/' + companyId,
		templateKey : 'company-contacts',
		individual_tag_name : 'tr',
		cursor : true,
		page_size : 25,
		sort_collection : false,
		postRenderCallback : function(el) {
			// var cel = App_Contacts.contactsListView.el;
			// var collection = App_Contacts.contactsListView.collection;
		}
	});

	companyContactsView.collection.fetch();

	$('#' + htmlId).html(companyContactsView.render().el);
}
$(function(){ 

	var id;
	
	/**
	 * Activates the Timeline tab-content to show the time-line with all details,
	 * which are already added to time-line, when the contact is getting to its
	 * detail view.  
	 */
	$('#contactDetailsTab a[href="#timeline"]').live('click', function (e){
		e.preventDefault();
		
		save_contact_tab_position_in_cookie("timeline");
		
		contact_details_tab.load_timeline();
	});
	
	$('.email-subject').die().live('click', function(e) {
		e.preventDefault();
		var href = $(this).attr("href");
		var id = $(this).attr('id');
		$(".collapse-" + id).hide();
		$(href).collapse('toggle');
		
		$(href).on("hidden", function(){
			$(".collapse-" + id).show();
		})
		
	});	
	
	// Hide More link and truncated webstats and show complete web stats.
	$('#more-page-urls').die().live('click',function(e){
		e.preventDefault();
		
		$(this).css('display','none');
		$(this).parent().parent().find('#truncated-webstats').css('display','none');
		
		$(this).parent().parent().find('#complete-webstats').removeAttr('style');
	});
	
	//to remove contact from active campaign.
	$('.remove-active-campaign').die().live('click',function(e){
		e.preventDefault();
		
		if(!confirm("Are you sure to remove "+$(this).attr("contact_name")+" from "+$(this).attr("campaign_name")+" campaign?"))
			return;
		
		var campaign_id = $(this).closest('li').attr('data');
		var contact_id;
		
		// Fetch contact id from model
		if(App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
			contact_id = App_Contacts.contactDetailView.model.get('id');
		
	    // Url to delete
		var deleteUrl = 'core/api/workflows/remove-active-subscriber/'+campaign_id+'/'+contact_id;
	    
	    var $removeActiveCampaign = $(this);
	    
	    $.ajax({
	    	url: deleteUrl,
	    	type: 'DELETE',
	    	success: function(data){
	    	
	    	var contact_json = App_Contacts.contactDetailView.model.toJSON();
	    	var campaign_status = contact_json.campaignStatus;
	    	
	    	// On success callback, remove from both UI and backbone contact model.
	    	if(campaign_status !== undefined)
	    		{
	    			for(var i = 0,len = campaign_status.length;i<len;i++)
	    			{
	    				if(campaign_id === campaign_status[i].campaign_id)
	    				{
	    					// Remove from campaignStatus array of contact model
	    					campaign_status.splice(i,1);
	    					break;
	    				}
	    			}
	    		}
	    	
	    	// Remove li 
	    	$removeActiveCampaign.closest('li').remove();
	    	
	    	}
	    });
		
	});
/*	
	$('.ativity-block-ul > li')
	.live('mouseenter',function(){
		console.log("hover");
	})
	.live('mouseleave',function(){
		console.log("hout");
	}); */
	
	
	/**
	 * Fetches all the notes related to the contact and shows the notes collection 
	 * as a table in its tab-content, when "Notes" tab is clicked.
	 */ 
	$('#contactDetailsTab a[href="#notes"]').live('click', function (e){
		e.preventDefault();
		save_contact_tab_position_in_cookie("notes");
		contact_details_tab.load_notes();
	});
	
	/**
	 * Fetches all the events related to the contact and shows the events collection 
	 * as a table in its tab-content, when "Events" tab is clicked.
	 */
	$('#contactDetailsTab a[href="#events"]').live('click', function (e){
		e.preventDefault();
		save_contact_tab_position_in_cookie("events");
		contact_details_tab.load_events();
	});
	
	/**
	 * Fetches all the documents related to the contact and shows the documents collection 
	 * as a table in its tab-content, when "Documents" tab is clicked.
	 */
	$('#contactDetailsTab a[href="#documents"]').live('click', function (e){
		e.preventDefault();
		save_contact_tab_position_in_cookie("documents");
		contact_details_tab.load_documents();
	});
	
	/**
	 * Fetches all the notes related to the contact and shows the tasks collection 
	 * as a table in its tab-content, when "Tasks" tab is clicked.
	 */
	$('#contactDetailsTab a[href="#tasks"]').live('click', function (e){
		e.preventDefault();
		save_contact_tab_position_in_cookie("tasks");
		contact_details_tab.load_tasks();
	});
	
	/**
	 * Fetches all the deals related to the contact and shows the deals collection 
	 * as a table in its tab-content, when "Deals" tab is clicked.
	 */
	$('#contactDetailsTab a[href="#deals"]').live('click', function (e){
		e.preventDefault();
		save_contact_tab_position_in_cookie("deals");
		contact_details_tab.load_deals();
	});

	/**
	 * Fetches all the cases related to the contact and shows the collection.
	 */
	$('#contactDetailsTab a[href="#cases"]').live('click', function (e){
		e.preventDefault();
		save_contact_tab_position_in_cookie("cases");
		
		contact_details_tab.load_cases();
	});
	
	/**
	 * Gets every conversation of the contact (if it has email) with the associated 
	 * email (gmail or imap) in Email-preferences of this CRM, when "Mail" tab is 
	 * clicked.  
	 */
	$('#contactDetailsTab a[href="#mail"]').live('click', function (e){
		e.preventDefault();
		save_contact_tab_position_in_cookie("mail");
		contact_details_tab.load_mail();
	});
	
	/**
	 * Gets the activities of a contact from browsing history, using its
	 * email. To do so the email should be run in analytics script provided by 
	 * agileCRM.
	 */ 
	$('#contactDetailsTab a[href="#stats"]').live('click', function (e){
		e.preventDefault();
		save_contact_tab_position_in_cookie("stats");
		contact_details_tab.load_stats();
        
	});
	
	/**
	 * Fetches all the logs of the campaigns that the contact is subscribed to and
	 * shows them in a table. Also shows a campaigns drop down list to subscribe
	 * the contact to the selected campaign.  
	 */
	$('#contactDetailsTab a[href="#campaigns"]').live('click', function (e){
		e.preventDefault();
		save_contact_tab_position_in_cookie("campaigns");
		contact_details_tab.load_campaigns();
	});
	
	$('#contactDetailsTab a[href="#company-contacts"]').live('click',function(e)
	{
		e.preventDefault();
		fill_company_related_contacts(App_Contacts.contactDetailView.model.id,'company-contacts');       
	});
	    
	 
	/**
	 * Populates subject and description using email templates, on select option 
	 * change of "Fill From Templates" field.
	 */
	$('.emailSelect').die().live('change',function(e){
		e.preventDefault();
		
		// To remove previous errors
		$('#emailForm').find('.error').removeClass('error');
		$('#emailForm').find('.help-inline').css('display','none');

		var model_id = $('.emailSelect option:selected').attr('value');
	
		// When default option selected make subject and body empty
		if(!model_id)
			{
			// Fill subject and body of send email form
			$("#emailForm").find( 'input[name="subject"]' ).val("");
			
			set_tinymce_content('email-body', '');
			
			$("#emailForm").find( 'textarea[name="body"]' ).val("");
			return;
			}
		
		var emailTemplatesModel = Backbone.Model.extend({
		     url: '/core/api/email/templates/' + model_id,
		     restKey: "emailTemplates"
		});
		var templateModel = new emailTemplatesModel();
			templateModel.fetch({success: function(data){
				var model = data.toJSON();
				
				var subject = model.subject;
				var text = model.text;
				
				// Apply handlebars template on send-email route 
				if(Current_Route !== 'bulk-email')
				{
				
				// Get Current Contact
				var contact = App_Contacts.contactDetailView.model;
				var json = contact.toJSON();
				
				/*
				 * Get Contact properties json to fill the templates
				 * using handlebars
				 */  
				var json = get_contact_json_for_merge_fields();
				var template;
					
					// Templatize it
					try
					{
						template = Handlebars.compile(subject);
						subject =  template(json);
					}
					catch(err)
					{
						subject = add_square_brackets_to_merge_fields(subject);
						
						template = Handlebars.compile(subject);
						subject =  template(json);
					}
				    
					try
					{
						template = Handlebars.compile(text);
						text =  template(json);
					}
					catch(err)
					{
						text = add_square_brackets_to_merge_fields(text);
						
						template = Handlebars.compile(text);
						text =  template(json);
					}
				}
				
				// Fill subject and body of send email form
				$("#emailForm").find( 'input[name="subject"]' ).val(subject);
				
				// Insert content into tinymce
				set_tinymce_content('email-body', text);
			}});
		    
	});
	
	/**
	 * Sends email to the target email. Before sending, validates and serializes email form. 
	 */ 
	$('#sendEmail').die().live('click',function(e){
		e.preventDefault();
		
		 if($(this).attr('disabled'))
	   	     return;
		 
		// Is valid
		if(!isValidForm($('#emailForm')))
	      	return;
		
		// Disables send button and change text to Sending...
		disable_send_button($(this));
		
		// Saves tinymce content to textarea
		save_content_to_textarea('email-body');
		
		// serialize form.
		var json = serializeForm("emailForm");
		
		// Navigates to previous page on sending email
		$.ajax({
				type:'POST',
				data: json,
				url: 'core/api/emails/contact/send-email',
				success:function(){
					
					    // Enables Send Email button.
					    enable_send_button($('#sendEmail'));
					    
					    var route = Current_Route + "";
					   
			            if(route.match("send-email") != null)
			            	App_Contacts.navigate("contact/" + App_Contacts.contactDetailView.model.id, {trigger:true});
			            else
			            	window.history.back();
			            
		                 },
		        error: function()
		               {
		        	      enable_send_button($('#sendEmail'));
		        	      
		        	      console.log("Error occured while sending email");
		               }
		});

	});
	
	/**
	 * Close button click event of send email form. Navigates to contact
	 * detail view.
	 */
	$('#send-email-close').die().live('click',function(e){
		e.preventDefault();

		Backbone.history.navigate("contact/" + App_Contacts.contactDetailView.model.id, {
            trigger: true
        });
	});	

	/**
	 * Delete functionality for activity blocks in contact details
	 */
	$('.activity-delete').die().live('click', function(e){
		e.preventDefault();
		
		var model = $(this).parents('li').data();
		
		if(model && model.collection)
		{
			model.collection.remove(model);
		}

		// Gets the id of the entity
		var entity_id = $(this).attr('id');

		// Gets the url to which delete request is to be sent
		var entity_url = $(this).attr('url');

		if(!entity_url)
			return;
		
		var id_array = [];
		var id_json = {};
		
		// Create array with entity id.
		id_array.push(entity_id);
		
		// Set entity id array in to json object with key ids, 
		// where ids are read using form param
		id_json.ids = JSON.stringify(id_array);
		var that = this;

		// Add loading. Adds loading only if there is no loaded image added already i.e., 
		// to avoid multiple loading images on hitting delete multiple times
		if($(this).find('.loading').length == 0)
			$(this).prepend($(LOADING_HTML).addClass('pull-left').css('width', "20px"));
		
		$.ajax({
			url: entity_url,
			type: 'POST',
			data: id_json,
			success: function() {
				// Removes activity from list
				$(that).parents(".activity").fadeOut(400, function(){ $(this).remove(); });
				removeItemFromTimeline($("#" + entity_id, $("#timeline")));
			}
		});
	});
	
	$('#cc-link, #bcc-link').die().live('click', function(e){
		e.preventDefault();
		
		// Hide link
		$(this).hide();
		
		if($(this).attr('id') === 'cc-link')
		{
			$('#email_cc').closest('.control-group').show();
			
			// Hide div.control-group to reduce space between subject
			if($(this).parent().find('#bcc-link').css('display') === 'none')
				$(this).closest('.control-group').hide();
			
			return;
		}
		
		if($(this).parent().find('#cc-link').css('display') === 'none')
			$(this).closest('.control-group').hide();
		
		$('#email_bcc').closest('.control-group').show();
	});
	
});

/**
 * Returns contact properties in a json
 * 
 * @method get_property_JSON
 * @param {Object} contactJSON
 * 			contact as json object
 */  
function get_property_JSON(contactJSON)
{	
	var properties = contactJSON.properties;
    var json = {};
	$.each(properties, function(i, val)
			{
				json[this.name] = this.value;
			});
	console.log(json);
	return json;
}

/**
 * Populates send email details (from address, to address, signature and
 * email templates) 
 * 
 * @method populate_send_email_details
 * @param {Object} el
 * 			html object of send email form
 */
function populate_send_email_details(el){

	$("#emailForm",el).find('input[name="from_name"]').val(CURRENT_DOMAIN_USER.name);
	$("#emailForm", el).find( 'input[name="from_email"]' ).val(CURRENT_DOMAIN_USER.email);
	
	// Fill hidden signature field using userprefs 
	//$("#emailForm").find( 'input[name="signature"]' ).val(CURRENT_USER_PREFS.signature);

	// Prefill the templates
	var optionsTemplate = "<option value='{{id}}'> {{subject}}</option>";
	fillSelect('sendEmailSelect', '/core/api/email/templates', 'emailTemplates', undefined , optionsTemplate, false, el, '- Fill from Template -');
}

/**
 * Activates "Timeline" tab and its tab-content in contact details and
 * also deactivates the other activated tabs.
 * 
 * @method activate_timeline_tab
 * 
 * Changed to activate first tab in the list ( on contact-details page , works even on company-details page
 * @modified Chandan
 */
function activate_timeline_tab(){
	$('#contactDetailsTab').find('li.active').removeClass('active');
	$('#contactDetailsTab li:first-child').addClass('active');
	
	$('div.tab-content').find('div.active').removeClass('active');
	$('div.tab-content > div:first-child').addClass('active');
	
	//	$('#time-line').addClass('active');  //old original code for flicking timeline
	
	if(App_Contacts.contactDetailView.model.get('type')=='COMPANY')
	{
		fill_company_related_contacts(App_Contacts.contactDetailView.model.id,'company-contacts'); 
	}
}

/**
 * Disables Send button of SendEmail and change text from Send to Sending...
 * 
 * @param elem - element to be disabled.
 * 
 **/
function disable_send_button(elem)
{
	elem.css('min-width',elem.width()+'px')
		.attr('disabled', 'disabled')
		.attr('data-send-text',elem.text())
		.text('Sending...');
}

/**
 * Enables disabled Send button and keep old text
 * 
 * @param elem - element to be enabled.
 * 
 **/
function enable_send_button(elem)
{
	elem.text(elem.attr('data-send-text')).removeAttr('disabled data-send-text');
}

/**
 * Returns webstats count w.r.t domain
 **/
function get_web_stats_count_for_domain()
{
	// Returns web-stats count
	return $.ajax({type: "GET", url: 'core/api/web-stats/JSAPI-status', async: false}).responseText;
}

function save_contact_tab_position_in_cookie(tab_href)
{
	
	var position = readCookie(contact_tab_position_cookie_name);
	
	if(position == tab_href)
		return;
	
	createCookie(contact_tab_position_cookie_name, tab_href);
}

function load_contact_tab(el, contactJSON)
{
	var position = readCookie(contact_tab_position_cookie_name);
	
	$('#contactDetailsTab a[href="#'+position+'"]', el).tab('show');
	
	if(!position || position == "timeline")
	{
		contact_details_tab.load_timeline();
		return;
	}
	
	if(contact_details_tab["load_" + position])
	{
		
		
		// Should add active class, tab is not enough as content might not be shown in view.
		$(".tab-content", el).find("#" + position).addClass("active");
		contact_details_tab["load_" + position]();
	}
		
}

/**
 * Loads, minified jquery.raty plug-in to show stars to rate a contact in its  
 * detail view and highlights the (no.of) stars based on star_value of the contact.
 * 
 * @method starify 
 * @param {Object} el
 * 			html object of contact detail view
 */
function starify(el) {
    head.js(LIB_PATH + 'lib/jquery.raty.min.js', function(){
    	
    	var contact_model  =  App_Contacts.contactDetailView.model;
    	
    	// Set URL - is this required?
    	// contact_model.url = 'core/api/contacts';
    	
    	$('#star', el).raty({
    		
    		/**
    		 * When a star is clicked, the position of the star is set as star_value of
    		 * the contact and saved.    
    		 */
        	click: function(score, evt) {
        	   
        		/*// (commented- reloading as silent:true is not effecting) 
        		  // alert('ID: ' + $(this).attr('id') + '\nscore: ' + score + '\nevent: ' + evt);
        		contact_model.set('star_value', score, {silent: true});
        	
        		// Save model
           		contact_model.save();*/
           		
        		App_Contacts.contactDetailView.model.set({'star_value': score}, {silent : true});
        		contact_model =  App_Contacts.contactDetailView.model.toJSON();
        		var new_model = new Backbone.Model();
        		new_model.url = 'core/api/contacts';
        		new_model.save(contact_model, {
        			success: function(model){
        			}
        		});

        	},
        	
        	/**
        	 * Highlights the stars based on star_value of the contact
        	 */
        	score: contact_model.get('star_value')
            
        });
    });
    
}

/**
 * Shows all the domain users names as ul drop down list 
 * to change the owner of a contact 
 */
function fill_owners(el, data){
	var optionsTemplate = "<li><a class='contact-owner-list' data='{{id}}'>{{name}}</a></li>";
    fillSelect('contact-detail-owner','/core/api/users', 'domainUsers', undefined, optionsTemplate, true); 
}

/**
 * To show owner on change
 */
function show_owner(){
	$('#change-owner-element').css('display', 'inline-block');
	$('#contact-owner').css('display', 'inline-block');
}

/**
 * This script file (contact-details.js) performs some actions (delete contact, add 
 * and remove tags, change owner and change score etc...) on a contact when it is in 
 * its detail view.
 * 
 * @module Contact management
 * @author Rammohan
 */
$(function(){
	
	// Deletes a contact from database
	$('#contact-actions-delete').live('click', function(e){
		
		e.preventDefault();
		if(!confirm("Do you want to delete the contact?"))
    		return;
		
		App_Contacts.contactDetailView.model.url = "core/api/contacts/" + App_Contacts.contactDetailView.model.id;
		App_Contacts.contactDetailView.model.destroy({success: function(model, response) {
			  Backbone.history.navigate("contacts",{trigger: true});
		}});

		
		/* Removing from collection did not work - to do later
		console.log("Deleting");
		
		var model =  App_Contacts.contactDetailView.model;
		console.log(model);
		App_Contacts.contactsListView.collection.remove(model);
		
		Backbone.history.navigate("contacts", {trigger: true});
		*/
	});
	
	/**
	 * Deletes a tag of a contact (removes the tag from the contact and saves the contact)
	 */ 
	$('.remove-tags').live('click', function(e){
		e.preventDefault();
		
		var tag = $(this).attr("tag");
		removeItemFromTimeline($("#" + tag+ '-tag-timeline-element', $('#timeline')).parent('.inner'))
		console.log($(this).closest("li").parent('ul').append(LOADING_HTML));
		
     	var json = App_Contacts.contactDetailView.model.toJSON();
     	
     	// Returns contact with deleted tag value
     	json = delete_contact_tag(json, tag);
     	var that = this;
     	
     	// Unbinds click so user cannot select delete again
     	$(this).unbind("click");
     	
        var contact = new Backbone.Model();
        contact.url = 'core/api/contacts';
        contact.save(json, {
       		success: function(data)
       			{ 	      		
       				$(that).closest("li").parent('ul').find('.loading').remove();
       				$(that).closest("li").remove();
       				App_Contacts.contactDetailView.model.set({'tags' : data.get('tags')}, {silent : true}, {merge:false});
       				
       				// Also deletes from Tag class if no more contacts are found with this tag
       				$.ajax({
       					url: 'core/api/tags/' + tag,
       					type: 'DELETE',
       					success: function()
       					{
       						if(tagsCollection)
       							tagsCollection.remove(tagsCollection.where({'tag': tag})[0]);
       					}
       				});
       			}
        });
	});
	
	/**
	 * Shows a form to add tags with typeahead option
	 */ 
	$('#add-tags').live('click', function(e) {
		e.preventDefault();
		$(this).css("display", "none");
		$("#addTagsForm").css("display", "block");
		$("#addTags").focus();
		setup_tags_typeahead();
	});
	
	/**
	 * "click" event of add button of tags form in contact detail view
	 * Pushes the added tags into tags array attribute of the contact and saves it
	 */ 
	$('#contact-add-tags').live('click', function(e){
		e.preventDefault();
		
	    // Add Tags
		var new_tags = get_new_tags('addTags');
		if(new_tags)new_tags=new_tags.trim();
		$('#add-tags').css("display", "block");
		$("#addTagsForm").css("display", "none");
		
		if(!new_tags || new_tags.length<=0 || (/^\s*$/).test(new_tags))
		{
			console.log(new_tags);
			return;
		}
		console.log(new_tags);
		
		if(new_tags) {
			var json = App_Contacts.contactDetailView.model.toJSON();
	    		
	    	
	    	// Reset form
	    	$('#addTagsForm').each (function(){
   		  	  	this.reset();
   		  	});
	    	
	    	// Checks if tag already exists in contact
			if($.inArray(new_tags, json.tags) >= 0)
				return;
	    	
	    	json.tagsWithTime.push({"tag" : new_tags.toString()});
   			
	    	// Save the contact with added tags
	    	var contact = new Backbone.Model();
	        contact.url = 'core/api/contacts';
	        contact.save(json,{
	       		success: function(data){
	       			
	       			addTagToTimelineDynamically(data.get("tagsWithTime"));
	       			
	       			// Get all existing tags of the contact to compare with the added tags
	       			var old_tags = [];
	       			$.each($('#added-tags-ul').children(), function(index, element){
	       				old_tags.push($(element).attr('data'));
       				});
	       			
	       			// Updates to both model and collection
	       			App_Contacts.contactDetailView.model.set(data.toJSON(), {silent : true});
	       			
	       			// Append to the list, when no match is found 
	       			if ($.inArray(new_tags, old_tags) == -1) 
	       				$('#added-tags-ul').append('<li style="display:inline-block;" class="tag" data="' + new_tags + '"><span><a class="anchor" href="#tags/'+ new_tags + '" >'+ new_tags + '</a><a class="close remove-tags" id="' + new_tags + '" tag="'+new_tags+'">&times</a></span></li>');
	       			
	       			console.log(new_tags);
	       			// Adds the added tags (if new) to tags collection
	       			
	       				tagsCollection.add(new BaseModel({"tag" : new_tags}));
	       		}
	        });
		}
	});
	
	/**
	 * Changes, owner of the contact, when an option of change owner drop down
	 * is selected.   
	 */
	$('.contact-owner-list').live('click', function(){
	
		$('#change-owner-ul').css('display', 'none');
		
		// Reads the owner id from the selected option
		var new_owner_id = $(this).attr('data');
		var new_owner_name = $(this).text();
		var current_owner_id = $('#contact-owner').attr('data');
		
		// Returns, if same owner is selected again 
		if(new_owner_id == current_owner_id)
			{
			  // Showing updated owner
			  show_owner();
			  return;
			}
		
		  var contactModel = new BaseModel();
		    contactModel.url = '/core/api/contacts/change-owner/' + new_owner_id + "/" + App_Contacts.contactDetailView.model.get('id');
		    contactModel.save(App_Contacts.contactDetailView.model.toJSON(), {success: function(model){

		    	// Replaces old owner details with changed one
				$('#contact-owner').text(new_owner_name);
				$('#contact-owner').attr('data', new_owner_id);
				
				// Showing updated owner
				show_owner(); 
				App_Contacts.contactDetailView.model = model;
				
		    }});
   	});
});
/**
 * To download vcard
 */
function qr_load(){
	head.js(LIB_PATH + 'lib/downloadify.min.js', LIB_PATH + 'lib/swfobject.js',  function(){
		  Downloadify.create('downloadify',{
		    filename: function(){
		      return agile_crm_get_contact_property("first_name") + ".vcf";
		    },
		    data: function(){
		      return $('#qr_code').attr('data');
		    },
		    /*onComplete: function(){ 
		      alert('Your File Has Been Saved!'); 
		    },
		    onCancel: function(){ 
		      alert('You have cancelled the saving of this file.');
		    },*/
		    onError: function(){ 
		      alert('Error downloading a file!'); 
		    },
		    transparent: false,
		    swf: 'media/downloadify.swf',
		    downloadImage: 'img/download.png',
		    width: 36,
		    height: 30,
		    transparent: true,
		    append: false
		  });
		});
}

/**
 * To navigate from one contact detail view to other
 */
function contact_detail_view_navigation(id, contact_collection, el){
	console.log("collection >>>>>>>>>>>>>>>>");
	console.log(contact_collection);
	
	var collection_length = contact_collection.length;
    var current_index = contact_collection.indexOf(contact_collection.get(id));
    var previous_contact_id;
    var next_contact_id;

    if (collection_length > 1 && current_index < collection_length && contact_collection.at(current_index + 1) && contact_collection.at(current_index + 1).has("id")) {
     
    	next_contact_id = contact_collection.at(current_index + 1).id
    }

    if (collection_length > 0 && current_index != 0) {

    	previous_contact_id = contact_collection.at(current_index - 1).id
    }

    if(previous_contact_id != null)
    	$('.navigation', el).append('<a style="float:left;" href="#contact/' + previous_contact_id + '" class=""><i class="icon-caret-left"></i>&nbsp;Previous</a>');
    if(next_contact_id != null)
    	$('.navigation', el).append('<a style="float:right;" href="#contact/'+ next_contact_id + '" class="">Next&nbsp;<i class="icon-caret-right"></i></a>');
	
}


$(function(){
	
	$(".tooltip_info").die().live("hover", function() {
		 $(this).tooltip('show');
	});
	
	/**
	 * Adds score to a contact (both in UI and back end)
	 * When '+' symbol is clicked in contact detail view score section, the score
	 * gets increased by one, both in UI and back end
	 * 
	 */  
	$('#add').live('click', function(e){
	    e.preventDefault();
	    
	    // Convert string type to int
	    var add_score = parseInt($('#lead-score').text());
	    
	    add_score = add_score + 1;
	    
	    // Changes score in UI
	    $('#lead-score').text(add_score);
       
	    App_Contacts.contactDetailView.model.set({'lead_score': add_score}, {silent: true});
		var contact_model =  App_Contacts.contactDetailView.model.toJSON();
	    
	  /* // Refreshing the view ({silent: true} not working)
	    contact_model.url = 'core/api/contacts';
	    contact_model.set('lead_score', add_score, {silent: true});
	
	    // Save model
	    contact_model.save();*/
	    
		var new_model = new Backbone.Model();
		new_model.url = 'core/api/contacts';
		new_model.save(contact_model,{
			success: function(model){

			}
		});
		          
	});
	
	   
	/**
	 * Subtracts score of a contact (both in UI and back end)
	 * When '-' symbol is clicked in contact detail view score section, the score
	 * gets decreased by one, both in UI and back end
	 * 
	 */
	$('#minus').live('click', function(e){
		e.preventDefault();
		
		// Converts string type to Int
		var sub_score = parseInt($('#lead-score').text());
		
		if(sub_score <= 0)
			return;
		
		sub_score = sub_score - 1;
		
		// Changes score in UI
		$('#lead-score').text(sub_score);
		
		// Changes lead_score of the contact and save it.
		App_Contacts.contactDetailView.model.set({'lead_score': sub_score}, {silent: true});
		var contact_model =  App_Contacts.contactDetailView.model.toJSON();
		
		var new_model = new Backbone.Model();
		new_model.url = 'core/api/contacts';
		new_model.save(contact_model,{
			success: function(model){

			}
		});
	});
	
	// Makes the score section unselectable, when clicked on it
	$('#score').children().attr('unselectable', 'on');
	
	// Popover for help in contacts,tasks etc
    $('#element').live('mouseenter',function(e){
    	e.preventDefault();
        $(this).popover({
        	template:'<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>'
        });
        $(this).popover('show');
    });
    $('#element-title').live('mouseenter',function(e){
    	e.preventDefault();
        $(this).popover('show');
    });
	   
    $('#change-owner-element').live('mouseenter',function(e){
    	e.preventDefault();
    	$('#change-owner-ul').css('display', 'none');
        $(this).popover({
        	template:'<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>'
        });
        $(this).popover('show');
    });
    
    $('#change-owner-element').live('click',function(e){
    	e.preventDefault();
    	$('#change-owner-element').popover('hide');
    	
    	// Hiding the owner name
    	$('#change-owner-element').css('display', 'none');
    	$('#contact-owner').css('display', 'none');
    	
    	if($('#change-owner-ul').css('display') == 'inline-block')
    		$('#change-owner-ul').css('display', 'none');
    	
    	else
    		$('#change-owner-ul').css('display', 'inline-block');
    });
});
var noAnimationBruteForce = true; 
var timeline_view = Backbone.View
.extend({
	initialize : function()
	{
		// Binds functions to view
		_.bindAll(this, 'render', 'appendItem', 'addItems');
		
		this.options.data = App_Contacts.contactDetailView.model.toJSON().tagsWithTime;
		this.options.data.push(App_Contacts.contactDetailView.model.toJSON());
		this.options.data.push(App_Contacts.contactDetailView.model.toJSON().tagsWithTime);
		
		this.collection = new BaseCollection([], {});
		configure_timeline_comparator(this.collection);
		this.collection.add(this.options.data, {silent : true});
		load_other_timline_entities();
		this.queue = new Queue;
		this.collection.bind('add', this.appendItem);
		
	},
	appendItem : function(model)
	{
		this.collection.add(model, {silent: true});
		var elements = getTemplate("timeline", model);
		$('#timeline').isotope("addItems", elements);
	},
	addItems : function(models)
	{
		//this.collection.add(models, {silent: true});
		//	$("#timeline").append(getTemplate("timeline1", models));
		//	$("#timeline").append($(getTemplate("timeline1", models)));
		
		getTemplate("timeline1", models, undefined, function(result){
			$("#timeline").isotope('insert', $(result));	
		})
		
			
	},
	render: function() {
		remove_loading_img(App_Contacts.contactDetailView.el)
		
		configure_timeline();
		
		if(this.collection.length < 0)
		{
			var i = 0;
			var length = this.collection.length;
			while(i < length)	
			{
				
				var end = i + 20;
				
				end = end > length ? length - 1 : end;
				if(end == i)
					break;
				console.log(end + ", " + i);
				var _this = this;
				//console.log(getTemplate("timeline1", this.collection.toJSON()));
				getTemplate("timeline1", this.collection.toJSON().slice(i, end), undefined, function(result){
					alert("callback");
					if(i == 0)
					{
						//var _this = this;
						
						
						
						$("#timeline").isotope('insert', $(result));
					}
					else
						
					{
						alert("else");
							//$("#timeline").append($newEls).isotope( 'appended', $newEls);
							$("#timeline").isotope('insert', $(result));
					}
						
						
					
		/*			_this.queue.add_function(function(models){
						//alert(models);
			//			return true;
					}, _this.collection.toJSON().slice(i, end))*/
				
					
				});
				i += 20;
			}
		}
		
		getTemplate("timeline1", this.collection.toJSON(), undefined, function(result){
			$("#timeline").isotope('insert', $(result));
		});
		
	//	if(!noAnimationBruteForce)
		
		//	configure_timeline();
			
	//		$("#timeline").isotope('insert', $(getTemplate("timeline1", this.collection.toJSON())));
			create_month_marker(MONTH_YEARS, true, App_Contacts.contactDetailView.model.el);
		//$("#timeline").isotope('reLayout');

		// Resizes the line height based on entities overall height
	/*	$('#timeline').resize(function(){
			adjust_line();
			alert("test");
		});*/
	}
});



function load_timeline_details1(el, contactId, callback1, noAnimation)
{
	noAnimationBruteForce = true;
	init_timeline();
	
}

var timeline_collection_view
var MONTH_YEARS;
var month_years = [];
function init_timeline()
{
	MONTH_YEARS = [];
	// Load plugins for timeline	
	head.js("/lib/isotope.pkgd.js", LIB_PATH + "lib/jquery.event.resize.js", function(){
		//configure_timeline();
		timeline_collection_view = new timeline_view();
		timeline_collection_view.render();
	});

}

function configure_timeline_comparator(collection)
{
	
	//Override comparator to sort models on time base
	collection.comparator = function(item){
		var month_year = entity_created_month_year(item.toJSON());
		
		if (month_years.indexOf(month_year) < 0 && MONTH_YEARS.indexOf(month_year) < 0){
			month_years[month_years.length] = month_year;
			MONTH_YEARS[MONTH_YEARS.length] = month_year;
		}	
		
		if (item.get('created_time')) {
	        return item.get('created_time');
	    }
		if (item.get('createdTime')) {
			return item.get('createdTime')/1000;
	    }
	    if (item.get('time')) {
	    	return item.get('time')/1000;
	    }
	    if (item.get('date_secs')) {
	    	return item.get('date_secs')/1000;
	    }
	    return item.get('id');
	}
}

function configure_timeline()
{
	customize_isotope();
	
	var $container = $("#timeline", App_Contacts.contactDetailView.el);
	
	// Initializes isotope with options (sorts the data based on created time)
	$container.imagesLoaded(function(){
		$container.isotope({
			itemSelector : ".item",
			transformsEnabled: true,
			layoutMode: 'spineAlign',
			spineAlign:{
				gutterWidth: 56
			},
			getSortData: {
				timestamp: function($elem){
					var time = parseFloat($elem.find('.timestamp').text());
					
					// If time is in milliseconds then return time in seconds
					if ((time / 100000000000) > 1)
						return time/1000;
					
					return time
				}
			},
			sortBy: 'timestamp',
			sortAscending: false,
			itemPositionDataEnabled: true
		});
	});
}

function load_other_timline_entities()
{
	var contact = App_Contacts.contactDetailView.model.toJSON();
	var contactId = contact['id'];
	/* Stores all urls (notes, deals and tasks) in an array to fetch data using
	 * same collection by changing its url.
	 */ 
	
	var email = getPropertyValue(contact.properties, "email");
	
	var fetchContactDetails = ['core/api/contacts/' + contactId + '/notes', 
	                           'core/api/contacts/'+ contactId + '/deals',
	                           'core/api/contacts/'+ contactId + '/cases', //Added to also fetch cases
	                           'core/api/contacts/'+ contactId + '/tasks',
	                           '/core/api/campaigns/logs/contact/' + contactId];	
	
	
	// Go for mails when only the contact has an email
	if(email) {
		fetchContactDetails.push('core/api/emails/imap-email?e=' + encodeURIComponent(email) + '&c=10&o=0');
		
		get_stats(email, contact, App_Contacts.contactDetailView.el, function(stats){
			if(stats && stats.length > 0)
				timeline_collection_view.addItems(stats);
		})
	}
	
	$.each(fetchContactDetails, function(index, url)
	{
		$.getJSON(url, function(data){
			if(data && data.length > 0)
				timeline_collection_view.addItems(data);
		});
	})

}

function getTimlineTemplate(models)
{
	
}

/**
 * contact-details-actions.js defines some of the functionalities (add note, task and 
 * campaign to a contact) of actions drop down menu of a contact in its detail view.
 * The remaining functionalities are defined through controller.
 * 
 * @module Contact management
 * @author Rammohan
 */
$(function(){ 
	
	/**
	 * Displays activity modal with all task features,  to add a task 
	 * related to the contact in contact detail view. Also prepends the 
	 * contact name to related to field of activity modal.
	 */ 
    $('.contact-add-task').live('click', function(e){
    	e.preventDefault();

    	var	el = $("#taskForm");
		$('#activityModal').modal('show');
		highlight_task();
		// Displays contact name, to indicate the task is related to the contact
		fill_relation(el);
		agile_type_ahead("task_related_to", el, contacts_typeahead);

		// Fills owner select element
		populateUsers("owners-list", $("#taskForm"), undefined, undefined,
				function(data) {
					$("#taskForm").find("#owners-list").html(data);
					$("#owners-list", el).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
					$("#owners-list", $("#taskForm")).closest('div').find('.loading-img').hide();					
		});
    });
	
	/**
	 * Displays activity modal with all event features,  to add a event 
	 * related to the contact in contact detail view. Also prepends the 
	 * contact name to related to field of activity modal.
	 */ 
    $('.contact-add-event').live('click', function(e){
    	e.preventDefault();

    	var	el = $("#activityForm");
		$('#activityModal').modal('show');
		highlight_event();
		// Displays contact name, to indicate the task is related to the contact
		fill_relation(el);
		agile_type_ahead("event_related_to", el, contacts_typeahead);

    });
    
    /**
     * Displays note modal, to add a note related to the contact in contact 
     * detail view. Also prepends the contact name to related to field of 
     * activity modal.  
     */ 
    $('.contact-add-note').live('click', function(e){
    	e.preventDefault();
    	var	el = $("#noteForm");
    	
    	// Displays contact name, to indicate the note is related to the contact
    	fill_relation(el);
    	$('#noteModal').modal('show');
    	agile_type_ahead("note_related_to", el, contacts_typeahead);
     });
    
    /**
     * Subscribes contact to a campaign. First loads a form with campaigns select 
     * option and then fills the select drop down with all the campaigns by triggering
     * a custom event (fill_campaigns_contact).
     */ 
    $('.contact-add-campaign, .add-to-campaign').live('click', function(e){
    		e.preventDefault();
    	
    		var contact_id = App_Contacts.contactDetailView.model.id;
    		
    		// Navigate to Add Campaigns page
    		if($(this).attr('class') === 'contact-add-campaign')
    		{
   			
	    		/*
	    		 * Custom event to fill campaigns. This is triggered from the controller
	    		 * on loading of the form. 
	    		 * This event is died to avoid execution of its functionality multiple
	    		 * times, if it is clicked multiple times (when it is clicked first time 
	    		 * it executes once, if again it is clicked it executes twice and so on).  
	    		 */
    		
	    		$('body').die('fill_campaigns_contact').live('fill_campaigns_contact', function(event){
	    			var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
	    	        fillSelect('campaign-select','/core/api/workflows', 'workflow', 'no-callback ', optionsTemplate); 
	    		});
	    		
	    		// Navigate to controller to show the form and then to trigger the custom event
	    		Backbone.history.navigate("add-campaign", {
	                trigger: true
	            });
    			
    		}
    		
    		// If link clicked is within Campaigns tab, hide link and show form.
    		if($(this).attr('class') === 'add-to-campaign')
    		{
    			$(this).css('display','none');
    			
    			$('.show_campaigns_list').css('display','inline-block');
    			
    			var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
    			
    		    fillSelect('campaign-select','/core/api/workflows', 'workflow', 'no-callback ', optionsTemplate); 
    		}
    		
    		
    		/*
    		 * Subscribes the contact to selected campaign from the drop down, when
    		 * the Add button is clicked
    		 */
    		$('#subscribe-contact-campaign, #add-to-campaign').die().live('click',function(e){
    			e.preventDefault();

    			var $form;
    			
    			// Add Campaigns form in another page.
    			if($(this).attr('id') === 'subscribe-contact-campaign')
    				$form = $('#contactCampaignForm');
    			
    			// For within Campaigns tab, campaigns list form
    			if($(this).attr('id') === 'add-to-campaign')
    				$form = $('#add-to-campaign-form');
    			
    			// Verify form validation
    			if(!isValidForm($form))
    				return;

    			// Button disabled || Validate Form fails
    		    if($(this).attr('disabled') == 'disabled')
    		    	return;
    			
    		    var saveButton=$(this);
    		    disable_save_button(saveButton);
    		    
    		    // Temporary variable to hide Campaigns list form within
    		    // Campaigns tab.
    		    var $add_to_campaign = $(this).attr('id');
    		    
    			// Show loading symbol until model get saved
    		    //$('#contactCampaignForm').find('span.save-status').html(LOADING_HTML);
    		    
    			var workflow_id = $('#campaign-select option:selected').attr('value');
    						
    			var url = '/core/api/campaigns/enroll/' + contact_id + '/' + workflow_id;
    			
    			$.ajax({
    				url: url,
    				type: 'GET',
    				success: function(){
   				
    					// Remove loading image
    					//$('#contactCampaignForm').find('span.save-status img').remove();
    	    		    enable_save_button(saveButton);
    	    		    
    					// Hides form and shows link within Campaigns tab.
    	    		    if($add_to_campaign === 'add-to-campaign')
    					{
    	    		    	// Temp Flag inorder to show Active campaigns immediately.
        	    		    // if true, downloads contact rather than fetching from collection
        	    		    CONTACT_ASSIGNED_TO_CAMPAIGN = true;
    						
        	    		    $('.show_campaigns_list').css('display','none');
    						
    						$('.add-to-campaign').css('display','inline-block');
    						
    						// Triggers Campaigns tab click, to update contact model
    						$('#contactDetailsTab a[href="#campaigns"]').trigger('click');
    						
    						return;
    						
    					}
    					
    					// Navigate back to contact detail view
    					Backbone.history.navigate("contact/" + contact_id, {
    						trigger: true
    					});
    				}
    		   });
    		}); // End of Add button of form Event Handler
    		
    		// Click event of campaigns form close button
    		$('#contact-close-campaign, #cancel-to-add-campaign').live('click', function(e){
    			e.preventDefault();
    			
    			// Campaigns tab form
    			if($(this).attr('id') === 'cancel-to-add-campaign')
    			{
    				var $form = $('#add-to-campaign-form');
    				
    				// Reset form if any errors
    				var validator = $('form#add-to-campaign-form').validate();
    				validator.resetForm();
    				$form.find('div.controls').removeClass('single-error');
    				
    				// Hides form and show link
    				$('.show_campaigns_list').css('display','none');
    				$('.add-to-campaign').css('display','inline-block');
    				
    				return;
    			}
    			
    			// Navigate back to contact detail view
    			Backbone.history.navigate("contact/" + contact_id, {
       	            trigger: true
       	        });
    			
    	    }); // End of Close button of form Event Handler
            
    	}); // End of Add to Campaign Event Handler
    
});

/**
 * Prepends the name of the contact (which is in contact detail view),
 * to the pop-up modal's (task and note) related to field.
 * 
 * @method fill_relation
 * @param {Object} el
 * 			html object of the task or note form
 */
function fill_relation(el){
	var json = App_Contacts.contactDetailView.model.toJSON();
 	var contact_name = getContactName(json);//getPropertyValue(json.properties, "first_name")+ " " + getPropertyValue(json.properties, "last_name");
 	
 	// Adds contact name to tags ul as li element
 	$('.tags',el).html('<li class="tag"  style="display: inline-block; vertical-align: middle; margin-right:3px;" data="'+ json.id +'">'+contact_name+'</li>');

}/**
 * modals.js script file defines the functionality of click events of some
 * buttons and "show" and "hide" events of person and company modals
 * 
 * @module Contact management
 * @author Rammohan
 */


var forceCompany={}; /* to force company on personModal,
						Should contain - 
							doit - true to force
							name - name of company
							id - id of company
						*/
$(function(){
	   
		/**
		 * "show" event of modal - 
		 * To handle UI before its drawn on screen, even before rolling onto screen.
		 * Clean modal.
		 * If forceCompany - hide company input & show non-cancellable company name tag.
		 * Else - enable things by default
		 */
		$("#personModal").on('show',function(data)
		{
			if(forceCompany.doit==true)
			{
				$("#personForm [name='contact_company_id']")
					.html('<li class="tag"  style="display: inline-block;" data="' + forceCompany.id + 
						'"><a href="#contact/' + forceCompany.id +'" id="contact_company_autofilled">' + forceCompany.name + 
						'</a></li>');
				$("#personForm #contact_company").hide();
				//Force Company, disable input box so user can't enter a new Company.
				
				forceCompany.doit=false; // prevent forcing company next time
			}
			else
			{
				//default clean model
				$("#personForm [name='contact_company_id']").html('');
				$("#personForm #contact_company").show();
				$("#personForm #contact_company").val('');
				$("#personForm input").val('');
			}	
		});
		
		
		$("#companyModal").on('show', function(data) {
			var target = data.target;
			add_custom_fields_to_form({}, function(data){
				var el = show_custom_fields_helper(data["custom_fields"], []);
			//	if(!value["custom_data"])  value["custom_data"] = [];
				
				$("#custom-field-deals", $(target)).html(el);
				// Add placeholder and date picker to date custom fields
				$('.date_input', $(target)).attr("placeholder","MM/DD/YYYY");
		    
				$('.date_input', $(target)).datepicker({
					format: 'mm/dd/yyyy'
				});
				
			}, "COMPANY")
			
			

		});
	
		/**
		 * "Shown" event of person modal 
		 * Activates tags typeahead to tags field, company typeahead too
		 */
		$("#personModal").on('shown', function(data){
			setup_tags_typeahead();
			
			var stat=$("#personForm #contact_company").attr('display');
			if( stat!='none')
			{
				/**
				 * Activate company-typeahead only if required, i.e. there's a Company Input field
				 * Custom function for typeahead results, 
				 * show at contact_company_id, data=id-of-company-contact and data=company-name
				 */
				var fxn_display_company=function(data,item)
				{
					$("#personForm [name='contact_company_id']")
						.html('<li class="tag"  style="display: inline-block;" data="' + data + 
							'"><a href="#contact/' + data +'" id="contact_company_autofilled">' + item + 
							'</a><a class="close" id="remove_tag">&times</a></li>');
					$("#personForm #contact_company").hide();
				}
				agile_type_ahead("contact_company",$('#personForm'), contacts_typeahead,fxn_display_company,'type=COMPANY','<b>No Results</b> <br/> Will add a new one');
			}
		});
		
		/**
		 * Close clicked of company entered, this brings back text input field of company to fill again
		 */
		$("#personForm [name='contact_company_id'] a.close").live('click',function(e){
			$("#personForm #contact_company").show();
		});
	
		/**
		 * Click event of "Save Changes" button in person modal
		 * Saves the contact using the function "serialize_and_save_continue_contact"
		 */
	    $('#person_validate').live('click', function(e){
	    	serialize_and_save_continue_contact(e, 'personForm', 'personModal', false, true, this, 'tags_source_person_modal');
	    });
	    
	    /**
		 * Navigates to controller to import contacts from a file
		 */
	    $('#import-link').live('click', function (e) {
	    	Backbone.history.navigate("import",{trigger: true});	        
	    });
	    
	    /**
		 * Click event of "Save Changes" button in company modal
		 * Saves the contact using the function "serialize_and_save_continue_contact"
		 */
	    $('#company_validate').live('click', function (e) {
	    	serialize_and_save_continue_contact(e, 'companyForm', 'companyModal', false, false, this);
	    });
	    
	    /**
	     * "Hidden" event of person modal
	     * Hides email alert error and removes validation errors
	     */ 
	    $('#personModal').on('hidden', function () {
	    	
	    	// Hides email error message
	    	$('#personModal').find(".alert").hide();
	    	
	    	// Removes validation error messages
	    	remove_validation_errors('personModal');
	    	$('#personModal input').val('');
	    });
	    
	    /**
	     * "Hidden" event of company modal
	     * Removes validation errors
	     */
	    $('#companyModal').on('hidden', function () {
	    	remove_validation_errors('companyModal');
	    	$('#companyModal input').val('');
	    });
});

/**
 * Removes validation messages (error or success) from any modal 
 * based on its id attribute
 * 
 * @method remove_validation_errors
 * @param modalId
 * 			specifies a modal
 */
function remove_validation_errors(modalId){
	$('#' + modalId).find("div.control-group").removeClass("error");
	$('#' + modalId).find("div.control-group").removeClass("success");
	$('#' + modalId).find("span.help-inline").remove();
}
/**
 * Shows error text, providing support for custom validation.
 * Shows error message in .errorClass, filling it with htmlText
 * 
 * @param modalId - id of modal, won't be used if modal hidden
 * @param formId  - id of form, 
 * @param htmlText - error message to display
 * @param errorClass - class in which to fill error text, i.e. htmlText
 */
function show_error(modalId,formId,errorClass,htmlText)
{
	var modal_elem=$('#'+modalId);
	var form_elem=$('#'+formId);
	
	if(modal_elem.css('display')!=='none')
	{
		modal_elem.find('.'+errorClass).html('<div class="alert alert-error" ><a class="close" data-dismiss="alert" href="#">&times</a>'+htmlText+'</div>').show();
	}
	else if(form_elem.css('display')!=='none')
	{
		form_elem.find('.'+errorClass).html('<div class="alert alert-error" ><a class="close" data-dismiss="alert" href="#">&times</a>'+htmlText+'</div>').show();
	}
}

/**
 * Serializes both contact (person or company) modal form (with basic information) 
 * and its continue editing form (with detailed information) and saves the serialized
 * data into Contacts data base.
 * <p>
 * Each field (except tags field) value of the form is created as json object (with name,
 * type and value attributes) and pushed into "properties" array, if any tags are exist,
 * pushes them into tags array. Finally the object with properties and tags is sent to
 * save.
 * </p>
 * 
 * @method serialize_and_save_continue_contact
 * @param {Object} e
 * 			default event to prevent
 * @param {String} form_id
 * 			form to serialize the data
 * @param {String} modal_id
 * 			modal to hide on save
 * @param {Boolean} continueContact
 * 			verifies to show continue editing form
 * @param {Boolean} is_person
 * 			verifies whether person or company
 * @param {String}
 * 			id within which to search for tags, if ignored tags will be searched in form_id
 * @returns object get saved
 */
function serialize_and_save_continue_contact(e, form_id, modal_id, continueContact, is_person, saveBtn, tagsSourceId) {
	
	// Prevents the default event, if any 
	e.preventDefault();

    var $form = $('#' + form_id);
    
	// Returns, if the save button has disabled attribute, or form is invalid
	if($(saveBtn).attr('disabled') || !isValidForm($form))
		return;
	
	// Disables save button to prevent multiple click event issues
	disable_save_button($(saveBtn));
    
    // Read multiple values from contact form
    var properties = [];

    // Reads id, to update the contact 
    var id = $('#' + form_id + ' input[name=id]').val();
    
    // Makes created time constant
    var created_time=$('#' + form_id + ' input[name=created_time]').val();
    
    // Object to save
    var obj = {};
    
    // Stores all the property objects
    var properties = [];

    // Contact should be fetched based on id from any of the following views. It is required so other properties saved are not lost.
    if(id)
    	{

			// If user refreshes in contact details page, then none of the list views are defined so, contact will be fetched from detailed view
			if(App_Contacts.contactDetailView && App_Contacts.contactDetailView.model != null && App_Contacts.contactDetailView.model.get('id') == id)
				obj = App_Contacts.contactDetailView.model.toJSON();
		
    		// If contact list view is defined, then contact is fetched from list.
			else if(App_Contacts.contactsListView && App_Contacts.contactsListView.collection.get(id) != null)
    			obj = App_Contacts.contactsListView.collection.get(id).toJSON();
    			
    		// If contact list is under a selected custom view, then contact is fetched from the custom view list.
    		else if(App_Contacts.contact_custom_view && App_Contacts.contact_custom_view.collection.get(id) != null)
    			obj = App_Contacts.contact_custom_view.collection.get(id).toJSON();

    	}
    
    
    // Loads continue editing form
    var template;
    
    // Reads custom fields and pushes into properties
    var custom_field_elements =  $('#' + form_id).find('.custom_field');
    var custom_fields_in_template = [];
   
    $.each(custom_field_elements, function(index, element){
    	var id = $(element).attr('id'), name = $(element).attr('name');
    	custom_fields_in_template.push(name);
    	if (isValidField(id)) properties.push(custom_Property_JSON(name, 'CUSTOM', form_id));
    });
   
    if(is_person){
    
    	// Stores person's continue editing form template key
    	template = 'continue-contact';
    	obj.type = 'PERSON';
    	
    	// Creates properties of contact (person)
    	if (isValidField(form_id+' #fname'))properties.push(property_JSON('first_name', form_id+' #fname'));
   
    	if (isValidField(form_id+' #lname'))properties.push(property_JSON('last_name', form_id+' #lname'));
    	
    	// Add profile_img from both forms. 
        //if(form_id == "personForm")        	
           if (isValidField(form_id+' #image'))properties.push(property_JSON('image', form_id+' #image'));     	  	  
   
    	///give preference to autofilled company, ignore any text in textfield for filling company name
    	var company_el=$("#"+form_id+" [name='contact_company_id']").find('li');
    	if(company_el && company_el.length)	
    	{
    		var company_id=$(company_el.get(0)).attr('data');
    		var company_name=$(company_el.get(0)).find('a:first').html();
    		
    		obj.contact_company_id=company_id;
    		properties.push({type:"SYSTEM",name:"company",value:company_name});
    	}
    	else if (isValidField(form_id+' #contact_company'))
    	{
    		if($form.find('#contact_company').attr('value').length > 100)
    		{
            	show_error(modal_id,form_id,'duplicate-email','Company name too long. Please restrict upto 100 characters.');
            	enable_save_button($(saveBtn));// Remove loading image
            	return;
    		}	
    		obj.contact_company_id=null;
    		properties.push(property_JSON('company', form_id+' #contact_company'));
    	}
    	else obj.contact_company_id=null;

    	if (isValidField(form_id+' #email')) properties.push(property_JSON('email', form_id+' #email'));
    	
    	if (isValidField(form_id+' #phone')) properties.push(property_JSON('phone', form_id+' #phone'));

    	if (isValidField(form_id+' #job_title')) properties.push(property_JSON('title', form_id+' #job_title'));
    
   
    	if(tagsSourceId===undefined || !tagsSourceId || tagsSourceId.length<=0)	tagsSourceId=form_id;
    	
    	
    	var tags = get_tags(tagsSourceId);
    	
    	if (tags != undefined && tags.length != 0) 
    	{
    		obj.tags = [];
    		
    		if(!obj['tagsWithTime'] || obj['tagsWithTime'].length == 0)
    		{
    			obj['tagsWithTime'] = [];
    			$.each(tags[0].value, function(index, value) {
    				obj.tagsWithTime.push({"tag": value});
    			});
    		}
    		else
    		{
    			var tag_objects_temp = [];
    			$.each(tags[0].value, function(index, value) {
    				var is_new = true;
    				$.each(obj['tagsWithTime'], function(index, tagObject) {
    					if(value == tagObject.tag)
    					{
    						tag_objects_temp.push(tagObject);
    						is_new = false
    						return false;
    					}
    				});
    				
    				if(is_new)
    					tag_objects_temp.push({"tag": value});
    			});
    			obj['tagsWithTime']= tag_objects_temp; 
    		}
       	}
	
    }else{
    	
    	// Stores company's continue editing form template key
    	template = 'continue-company';
    	obj.type = 'COMPANY';
    	// Creates properties of contact (company)

    	if (isValidField('company_name'))
    	{	
    		if($form.find('#company_name').attr('value').length > 100)
    		{
    			// Company name too long, show error and return;
            	show_error(modal_id,form_id,'duplicate-email','Company name too long. Please restrict upto 100 characters.');
            	
            	enable_save_button($(saveBtn));// Remove loading image
            	return;
    		}	
    		properties.push(property_JSON('name', form_id+' #company_name'));
    	}
    	
    	if (isValidField(form_id+' #company_url')) properties.push(property_JSON('url', form_id+' #company_url'));
    }
    
    /*
     * Reads the values of multiple-template fields from continue editing form of
     * both person and company and pushes into properties
     */ 
    $('#' + form_id + ' div.multiple-template').each(function (index, element) {
       
    	/*
    	 * Reads each field (city, state, country and etc..) as a json object and
    	 * pushes into 'addressJSON' and then it is pushed into properties.
    	 */ 
    	if($(element).attr('data') == 'address'){
    		var addressJSON = {};
    		var subtype;
    		$.each($(element).children(":not(br)"), function (index, subelement){
    			
    			if($(subelement).val() == undefined || $(subelement).val().length == 0)
    				return;
    			
    			if($(subelement).attr('name') == 'address-type')
    				subtype = $(subelement).val();
    			else
    				addressJSON[$(subelement).attr('name')] = $(subelement).val();
    		});
    		
    		if($.isEmptyObject(addressJSON))
    			return;
    		
    		properties.push({
        		"name": $(element).attr('data'),
        		"value": JSON.stringify(addressJSON),
        		"subtype": subtype
        	})
    	}
    	else{
    		var inputElement = $(element).find('input');
    		var selectElement = $(element).find('select');

    		// If element has no value, don't push into properties 
    		if(inputElement.val() == undefined || inputElement.val().trim().length == 0)
    			return;
    		
    		// Checks whether fields for hidden fields (Used for clone do not save them)
    		if (!$(element).find('input').parents('div.controls').hasClass('hide'))
    			properties.push({
    				"name": $(element).attr('data'),
    				"value": inputElement.val(),
    				"subtype": selectElement.val()
    			})
    	} 	
    });

    
    /*
     * Check whether there are any properties in existing contact, which can get lost in contact update form.
     * There are chances user adds a property(may be stripe id..) using developers API, in order not to loose them 
     * following verification is done
     */
    
    if(obj.properties)
    	{
    	var properties_temp = properties;
    	$.each(obj.properties, function(contact_property_index, contact_property) {
    		$.each(properties_temp, function(new_property_index, new_property) {	
    			
    			// If property name exists in new property, no changes are made considering property is updated.
    			if(new_property.name == contact_property.name) {
    				
    				return false;
    			}
    		
    
    			// If property name is missing in new properties then preserving them.
    			else if(new_property_index == (properties_temp.length - 1) && custom_fields_in_template.indexOf(contact_property.name) == -1 && contact_property.type == "CUSTOM")
    			{
    				properties.push(contact_property);
    			}
    		});
    	});
    	}
    
    // Stores json object with "properties" as value
    var propertiesList = [];
    propertiesList.push({
        "name": "properties",
        "value": properties
    });
    
    // Convert array into JSON
    for (var i = 0; i < propertiesList.length; ++i) {
        obj[propertiesList[i].name] = propertiesList[i].value;
    }
    
    // Updates the old contact
    if (id != null) obj['id'] = id;
    
    obj["created_time"] = created_time;
       
    // Saves contact
    var contactModel = new BaseModel();
    contactModel.url = 'core/api/contacts';
    contactModel.save(obj, {
        success: function (data) {
        	
        	// Remove social search results from local storage after editing a contact
        	localStorage.removeItem("Agile_linkedin_matches_" + data.get('id'));
        	localStorage.removeItem("Agile_twitter_matches_" + data.get('id'));

        	// Removes disabled attribute of save button
        	enable_save_button($(saveBtn));
        	
            add_contact_to_view(App_Contacts.contactsListView,data,obj.id);
			
        	// Adds the tags to tags collection 
        	if (tags != undefined && tags.length != 0)
        		{
        			$.each(tags[0].value, function(index, tag){
        				console.log(tagsCollection);
        				tagsCollection.add(new BaseModel({"tag" : tag} ));
        			});
        		}
        	
        	// Removes person image form new-person-modal
        	$('#' + modal_id).find('img.person-img').remove();
        	            
        	// Loads continue editing form along with custom fields if any
        	if (continueContact) {
                
                add_custom_fields_to_form(data.toJSON(), function(contact){
                	console.log(contact);
                deserialize_contact(contact, template);
                	
                }, data.toJSON()["type"]);
                
            } 
        	else {
        
        		// update contacts-details view
        		if(App_Contacts.contactDetailView)
        			App_Contacts.contactDetailView.model = data;
        		
            	//App_Contacts.contactDetails(data.id,data);
            	//App_Contacts.navigate("contact/"+data.id);
        		App_Contacts.navigate("contact/" + data.id, {trigger: true});
            }
        	
        	
        	// Hides the modal
        	$('#' + modal_id).modal('hide');
            
        	// Resets each element
            $('#' + form_id).each(function () {
                this.reset();
            });
            
            // Removes tags list(remove them from new person modal)
            $('.tagsinput', $("#"+modal_id)).empty().append('<li class="tag" style="display: inline-block;" data="lead">lead<a class="close" id="remove_tag">&times</a></li>');
        },
        error: function (model, response) {
        	
        	// Removes disabled attribute of save button
        	enable_save_button($(saveBtn));
        	
            // Shows error alert of duplicate contacts        	
        	if(response.status==400)
        	{	
        		// 400 is our custom code, thrown when duplicate email detected.
        		var dupEmail=response.responseText.split('|')[1];
        		if(!dupEmail)dupEmail="";
        		// get the already existing email from response text.
        		show_error(modal_id,form_id,'duplicate-email', response.responseText);
        	}
        	else
        		show_error(modal_id,form_id,'duplicate-email','Server Error - '+response.status+' :<br/>'+response.responseText);
        }
    });

    return obj;
}

/**
 * Deserializes the contact to edit it. Loads the editing form using handlebars.
 * Fills the matched values, by iterating the properties. 
 *  
 * @param {Object} contact
 * 			contact object to edit
 * @param {String} template
 * 			template key to load the form
 */
function deserialize_contact(contact, template) {

    // Loads the form based on template value  
    var form = $("#content").html(getTemplate(template, contact));
    
    
    // Add placeholder and date picker to date custom fields
    $('.date_input').attr("placeholder","MM/DD/YYYY");
    
    $('.date_input').datepicker({
        format: 'mm/dd/yyyy'
    });
    
    // To set typeahead for tags
    setup_tags_typeahead();
    
    // Iterates through properties and ui clones
    $.each(contact.properties, function (index, element) {

        // Removes first input field
        $($('#' + form.attr('id') + ' div.multiple-template.' + element.name).closest('div.controls.second')).remove();
        var field_element = $('#' + form.attr('id') + ' div.multiple-template.' + element.name);

        // Generate and populate multiple fields
        fill_multi_options(field_element, element);
    });
    
    var fxn_display_company=function(data,item)
	{
		$("#content [name='contact_company_id']").html('<li class="tag"  style="display: inline-block;" data="' + data + '"><a href="#contact/' + data +'">' + item + '</a><a class="close" id="remove_tag">&times</a></li>');
		$("#content #contact_company").hide();
	}
	agile_type_ahead("contact_company",$('#content'), contacts_typeahead,fxn_display_company,'type=COMPANY','<b>No Results</b> <br/> Will add a new one');

	if(contact.contact_company_id && contact.contact_company_id.length>0)
	{
		for(var i=0;i<contact.properties.length;++i)
		{	
			if(contact.properties[i].name =='company')
			{	
				$("#content #contact_company").hide();
				$("#content [name='contact_company_id']")
					.html('<li class="tag"  style="display: inline-block;" data="' + contact.contact_company_id + '"><a href="#contact/' + contact.contact_company_id +'">' +contact.properties[i].value + '</a><a class="close" id="remove_tag">&times</a></li>');
			}
		}
	}
	
	// If contact is added from social suite, need to add website.
	//socialsuite_add_website();
}

/**
 * Generates new field for each value in properties (especially for email, phone and website)
 * 
 * @method fill_multi_options
 * @param {Object} field_element
 * 				Html element having property name as class name		
 * @param {Object} element
 * 				property object
 * 
 */
function fill_multi_options(field_element, element) {
	
	// Fills address fields
	if(element.name == 'address'){
		var json = JSON.parse(element.value);
		
		$.each($(field_element).children(":not(br)"), function (index, sub_field_element){
			var name = $(sub_field_element).attr('name');
			if(name == 'address-type')
				$(sub_field_element).val(element.subtype);
			else
				$(sub_field_element).val(json[name]);
		});
	}
	else{
		
		/*
		 * Fills other multiple-template fields (email, phone and website)
		 * Clones the fields into control-group and fills with associated values
		 */ 
		var append_to = $(field_element).parents('div.control-group');

		var html_element = append_to.children().siblings("div.controls:first").clone().removeClass('hide');

		$(html_element).find('input').val(element.value).attr('name', element.value);
		$(html_element).find('select').val(element.subtype);
    
		html_element.appendTo(append_to);
	}
}

/**
 * Creates json object for each custom field in contact form with name, type and 
 * value as attributes.
 * 
 * @method custom_Property_JSON
 * @param name
 * 			name of the field
 * @param form_id
 * 			id of the form
 * @param type
 * 			type of the element
 * @returns property json object
 */
function custom_Property_JSON(name, type, form_id) {
    var json = {};

    // assign value after checking type, its different for checkbox
    json.name = name;
    json.type = type;
    
    var elem=$('#' + form_id).find('*[name="' + name + '"]');
   
    var elem_type=elem.attr('type'), elem_value;
    
    console.log(elem_type);
    
    
    if(elem_type=='checkbox')elem_value=elem.is(':checked')?'on':'off';
    else if (elem.hasClass("date_input"))
    	elem_value=new Date(elem.val()).getTime() / 1000;
    else
    	elem_value=elem.val();
    
    json.value = elem_value;
    
    return json;
}

// UI Handlers for Continue-contact and continue-company
$(function () {

	
	$("#content [name='contact_company_id'] a.close").live('click',function(){
		$("#content #contact_company").show();
		$("#content [name='contact_company_id']").html('');
	})
	
    // Clones multiple fields
    $("a.multiple-add").die().live('click', function (e) {
    	e.preventDefault();
    	
        // Clone the template
        $(this).parents("div.control-group").append(
        $(this).parents().siblings("div.controls:first").clone().removeClass('hide'));
    });



    // Removes multiple fields
    $("a.multiple-remove").live('click', function (e) {
    	e.preventDefault();
    	
        // Get closest template and remove from the container
        $(this).closest("div.multiple-template").remove();
    });

    // Continue editing of new-person-modal 
    $('#continue-contact').click(function (e) {
          serialize_and_save_continue_contact(e, 'personForm','personModal', true, true, this,'tags_source_person_modal');
    });

    // Update button click event in continue-contact form
    $("#update").die().live('click', function (e) {
          serialize_and_save_continue_contact(e, 'continueform', 'personModal', false, true, this,"tags_source_continue_contact");
    });
    
    // Close button click event in continue-contact form
    $("#close").live('click', function (e) {
		e.preventDefault();
	    var id = $('#continueform input[name=id]').val();
	    if(id)
	    {
	    	Backbone.history.navigate("contact/" + id, {
	    		trigger: true
	    	});
	    }
    });

    // Continue editing in the new-company-modal (to avoid changing the route event to be prevented.)
    $('#continue-company').click(function (e) {
        serialize_and_save_continue_contact(e, 'companyForm', 'companyModal', true, false, this);
    });
    
    // Update button click event in continue-company
    $("#company-update").die().live('click', function (e) {
        serialize_and_save_continue_contact(e, 'continueCompanyForm', 'companyModal', false, false, this);
    });
});


/**
 * Adds conatct to view, takes care of if its a COMPANY or PERSON.
 * @param appView - view whose collection to update
 * @param model - the model contact to add
 * @param isUpdate - if undefined, implies that its new one, else an update
 */
function add_contact_to_view(appView,model,isUpdate)
{
	if(!appView)return;
	
	if(model.get('type')=='COMPANY')
	{
		if(appView.collection.get(model.id) != null) // update existing model
			appView.collection.get(model.id).set(model);
		else if(readCookie('company_filter')) // add model only if its in company view
			add_model_cursor(appView.collection,model);
		else if(isUpdate)
			CONTACTS_HARD_RELOAD = true; // reload contacts next time, because we may have updated Company, so reflect in Contact
	}	
	else
	{
		if(!readCookie('company_filter')) // check if in contacts view
		{
			if(!readCookie('contact_filter')) // add model only if its in plain contact view, otherwise always hard reload
			{
				if(appView.collection.get(model.id) != null) // update existing model
					appView.collection.get(model.id).set(model);
				else add_model_cursor(appView.collection,model);
			}	
			else CONTACTS_HARD_RELOAD = true; // custom filter active, make sure to reload from server
		}
	}	
}

/**
 * Adds model to collection at second last position, so cursor is preserved.
 * @param app_collection - the collection to add to, must exist
 * @param mdl - the new model to be added
 */
function add_model_cursor(app_collection,mdl)
{
	if(app_collection.models.length>=1)
		app_collection.add(mdl,{at:app_collection.models.length-1});
	else app_collection.add(mdl);
	
	if(app_collection.at(0).attributes.count)
		app_collection.at(0).attributes.count+=1;
}var notesView;
var dealsView; 
var eventsView;
var tasksView;
var casesView;
var documentsView;

var contact_details_tab = {
		load_timeline : function()
		{
			$('div.tab-content', App_Contacts.contactDetailView.el).find('div.active').removeClass('active');
			
			$('#time-line', App_Contacts.contactDetailView.el).addClass('active');
			if($("#timeline", App_Contacts.contactDetailView.el).hasClass('isotope'))
			{
				$("#timeline", App_Contacts.contactDetailView.el).isotope( 'reLayout', function(){} )
				return;
			}
				load_timeline_details(App_Contacts.contactDetailView.el, App_Contacts.contactDetailView.model.get('id'));
		},
		load_notes : function()
		{
		    var id = App_Contacts.contactDetailView.model.id;
		    notesView = new Base_Collection_View({
	            url: '/core/api/contacts/' + id + "/notes",
	            restKey: "note",
	            templateKey: "notes",
	            individual_tag_name: 'li',
	            sortKey:"created_time",
	            descending: true,
	            postRenderCallback: function(el) {
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	            		 $(".note-created-time", el).timeago();
	              	})
	            }
	        });
	        notesView.collection.fetch();
	        $('#notes', App_Contacts.contactDetailView.model.el).html(notesView.el);
		},
		load_events : function()
		{
			var id = App_Contacts.contactDetailView.model.id;
			eventsView = new Base_Collection_View({
	            url: '/core/api/contacts/' + id + "/events",
	            restKey: "event",
	            templateKey: "contact-events",
	            individual_tag_name: 'li',
	            sortKey:"created_time",
	            descending: true,
	            postRenderCallback: function(el) {
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	            		 $(".event-created-time", el).timeago();
	              	})
	            }
	        });
			eventsView.collection.fetch();
	        $('#events', App_Contacts.contactDetailView.el).html(eventsView.el);
		},
		load_documents : function()
		{
			 id = App_Contacts.contactDetailView.model.id;
			 documentsView = new Base_Collection_View({
		            url: '/core/api/documents/' + id + "/docs",
		            restKey: "document",
		            templateKey: "contact-documents",
		            individual_tag_name: 'li',
		            sortKey:"uploaded_time",
		            descending: true,
		            postRenderCallback: function(el) {
		            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
		            		 $(".document-created-time", el).timeago();
		              	})
		            }
		        });
			    documentsView.collection.fetch();
		        $('#documents', App_Contacts.contactDetailView.el).html(documentsView.el);
		},
		load_tasks : function()
		{
			   id = App_Contacts.contactDetailView.model.id;
				tasksView = new Base_Collection_View({
		            url: '/core/api/contacts/' + id + "/tasks",
		            restKey: "task",
		            templateKey: "contact-tasks",
		            individual_tag_name: 'li',
		            sortKey:"created_time",
		            descending: true,
		            postRenderCallback: function(el) {
		            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
		            		 $(".task-created-time", el).timeago();
		              	})
		            }
		        });
				tasksView.collection.fetch();
		        $('#tasks', App_Contacts.contactDetailView.el).html(tasksView.el);
		},
		load_deals : function ()
		{
			id = App_Contacts.contactDetailView.model.id;
			dealsView = new Base_Collection_View({
				url: 'core/api/contacts/'+ id + "/deals" ,
	            restKey: "opportunity",
	            templateKey: "deals",
	            individual_tag_name: 'li',
	            sortKey:"created_time",
	            descending: true,
	            postRenderCallback: function(el) {
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	            		 $(".deal-created-time", el).timeago();
	            	})
	            }
	        });
	        dealsView.collection.fetch();
	        $('#deals', App_Contacts.contactDetailView.el).html(dealsView.el);
		},
		load_cases : function()
		{
			id = App_Contacts.contactDetailView.model.id;
			casesView = new Base_Collection_View({
				url: 'core/api/contacts/'+ id + "/cases" ,
	            restKey: "cases",
	            templateKey: "cases-contact",
	            individual_tag_name: 'li',
	            sortKey:"created_time",
	            descending: true,
	            postRenderCallback: function(el) {
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	            		 $(".deal-created-time", el).timeago();
	            	})
	            }
	        });
			casesView.collection.fetch();
	        $('#cases', App_Contacts.contactDetailView.el).html(casesView.el);
		},
		load_mail : function()
		{
			var contact = App_Contacts.contactDetailView.model;
			var json = contact.toJSON();
			 
			// Get email of the contact in contact detail
			var email = getPropertyValue(json.properties, "email");
			
			// Shows an error alert, when there is no email to the contact 
			if(!email){
				$('#mail', App_Contacts.contactDetailView.model.el).html('<div class="alert alert-error span4" style="margin-top:30px"><a class="close" data-dismiss="alert" href="#">&times;</a>Sorry! this contact has no email to get the mails.</div>').show();
				return;	
			}	
			
			// Fetches mails collection
			var mailsView = new Base_Collection_View({
				url: 'core/api/emails/imap-email?e=' + encodeURIComponent(email) + '&c=10&o=0',
	            templateKey: "email-social",
	            restKey: "emails",
	            sortKey:"date_secs",
	            descending: true,
	            individual_tag_name: 'li',
	            postRenderCallback: function(el) {
	        	
	          	head.js(LIB_PATH + 'lib/jquery.timeago.js', function() { 
	    			$(".email-sent-time", el).each(function(index, element) {
	    				
	    				//console.log("before :" + $(element).html())
	    				//console.log("converted manually" + jQuery.timeago($(element).html()));
	    				$(element).timeago();
	    				//console.log($(element).html())
	    			});
				});
	          	
	          	 var imap;
	          	 queueGetRequest('email_prefs_queue','/core/api/imap','json', 
	          			 function(data){
	          		     imap = data;
	          	 });

	          	 queueGetRequest('email_prefs_queue','/core/api/social-prefs/GMAIL', 'json',
	          			 function(gmail){
	          		 if(!imap && !gmail)
	              		 $('#email-prefs-verification',el).css('display','block');
	             });
	            }
			});
	        mailsView.collection.fetch();
	        $('#mail', App_Contacts.contactDetailView.model.el).html(mailsView.el);
		},
		load_stats : function()
		{
			var contact = App_Contacts.contactDetailView.model;
			var json = contact.toJSON();
			 
			// Get email of the contact in contact detail
			var email = getPropertyValue(json.properties, "email");
			
			// Shows an error alert, when there is no email to the contact 
			if(!email){
				$('#stats', App_Contacts.contactDetailView.model.el).html('<div class="alert alert-error span4" style="margin-top:30px"><a class="close" data-dismiss="alert" href="#">&times;</a>Sorry! this contact has no email to get the stats.</div>').show();
				return;	
			}
			
			// To avoid unnecessary JSAPI count, first verify in cookie
			if(!(readCookie('_agile_jsapi') != null && readCookie('_agile_jsapi') == "true") && (NO_WEB_STATS_SETUP && get_web_stats_count_for_domain() == '0'))
			{
				$('#stats', App_Contacts.contactDetailView.model.el).html('<h4><p>You have not yet setup the Javascript API on your website.</p><p>Please <a href="#analytics-code">set it up</a> to see the contact\'s site visits here.</p></h4>');
				return;
			}
				
			// Add tag if data is not 0
	        addTagAgile(CODE_SETUP_TAG);

				var statsView = new Base_Collection_View({
				url: 'core/api/web-stats?e=' + encodeURIComponent(email),
				data: statsCollection.toJSON(),
				templateKey: "stats",
	            individual_tag_name: 'li',
	            postRenderCallback: function(el)
	            {
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function() { 
	        			$(".stats-created-time", el).each(function(index, element) {
	        				$(element).timeago();
	        			});
	    			});
	            }
	        });
			
	        statsView.collection.fetch();
	        
	        // Organises collection based on created_time in decreasing order
	        statsView.collection.comparator = function(model)
	        {
	        	if (model.get('created_time'))
		            return -model.get('created_time');
		                                      
	        }
	        
	        $('#stats', App_Contacts.contactDetailView.el).html(statsView.el);
		},
		load_campaigns : function()
		{
			var campaignsView = new Base_Collection_View({
				url: '/core/api/campaigns/logs/contact/' + App_Contacts.contactDetailView.model.id,
	            restKey: "logs",
	            templateKey: "campaigns",
	            individual_tag_name: 'li',
	            sortKey:'time',
				descending:true,
	            postRenderCallback: function(el) {
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	              		 $("time.log-created-time", el).timeago();
	              	});
	              // var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
	             // fillSelect('campaignSelect','/core/api/workflows', 'workflow', 'no-callback ', optionsTemplate);
	            }
	        });
			campaignsView.collection.fetch();	
	        $('#campaigns', App_Contacts.contactDetailView.el).html(campaignsView.el);
		}

}/**
 * account-setting.js is a script file to deal with account deletion, shows data
 * used by account and number of entities saved
 * 
 * @module Billing author: Yaswanth
 */

// Global variable to store statistics, to show details in confirmation of
// account delete
var ACCOUNT_STATS;

/**
 * Fetches account statistics for the current Namespace from
 * "core/api/namespace-stats", called when manage subscription details is loaded
 * 
 * @method setUpAccountStats
 * @param html
 *            element to show stats
 * @author Yaswanth
 */
function set_up_account_stats(el, callback)
{

	/**
	 * Creates base model for namespace stats, template is
	 * account-stats-template
	 */
	var account_stats = new Base_Model_View({
		url : "core/api/namespace-stats",
		template : "account-stats",
		postRenderCallback: function(el) {
			
			ACCOUNT_STATS = account_stats.model.toJSON();
			
			if (callback && typeof (callback) === "function")
			{
				callback(ACCOUNT_STATS);
			}
		}
	});

	// Shows account statistics in subscription page
	$('#account-stats', el).html(account_stats.render(true).el);

}

/**
 * Handles events on delete account at stats and confirmation, sends delete
 * request on confirmation
 */
$(function()
{
	ACCOUNT_DELETE_REASON_JSON = undefined;
	/**
	 * If user clicks on confirm delete the modal is hidden and
	 * delete request is sent to "core/api/delete/account"
	 */
	$("#confirm-delete-account").die().live('click',
			function(e)
			{
				e.preventDefault();

				// Hides modal
				$(".modal-body").html(LOADING_HTML);

				

				/**
				 * Sends delete request to delete account , on
				 * success send to login
				 */
				$.ajax({
					type : "DELETE",
					url : "core/api/delete/account",
					success : function()
					{
						
						add_account_canceled_info(ACCOUNT_DELETE_REASON_JSON, function(data){
							
							$("#warning-deletion-feedback").modal('hide');	
							// Show loading in content
							$("#content").html(LOADING_HTML);
							// Navigate to login page after delete
							window.location.href = window.location.href
									.split('#')[0]
									+ 'login';
						})
						
						
					}
				});
			});
	

	$("#cancel-account").die().live('click',
			function(e)
			{
				e.preventDefault();

				
				$("#warning-deletion-feedback").remove();
				// Shows account stats warning template with stats(data used)
				var el = getTemplate('warning-feedback', {});

				// Appends to content, warning is modal can call show if
				// appended in content
				$('#content').append(el);

				// Shows warning modal
				$("#warning-deletion-feedback").modal('show');

				// Undefines delete reason, if use chose not to delete account in delete process
				$("#warning-deletion-feedback").on('hidden', function(){
					ACCOUNT_DELETE_REASON_JSON = undefined;
				});
				

				
				
				
				$("#warning-feedback-save").die().live('click', function(e){
					e.preventDefault();
					
					var form = $("#cancelation-feedback-form");
					
					if(!isValidForm(form))
					{
						return;
					}
					
					var input =  $("input[name=cancellation_reason]:checked");
				
					
						
					
					ACCOUNT_DELETE_REASON_JSON = {};
					ACCOUNT_DELETE_REASON_JSON["reason"] = $(input).val();
					ACCOUNT_DELETE_REASON_JSON["reason_info"] = $("#account_delete_reason").val();
					$(".modal-body").html(LOADING_HTML);
					var delete_step1_el = "";
					if(ACCOUNT_STATS)
						delete_step1_el = $(getTemplate('warning', ACCOUNT_STATS));
					else
						{
							set_up_account_stats(el, function(data){
								delete_step1_el = $(getTemplate('warning', data));
								$(".modal-body").css("padding", 0 ).html($(".modal-body", $(delete_step1_el)));
								$(".modal-footer").html($(".modal-footer", $(delete_step1_el)).html());
							})
							return;
						}
						 
					$(".modal-body").css("padding", 0 ).html($(".modal-body", $(delete_step1_el)));
					$(".modal-footer").html($(".modal-footer", $(delete_step1_el)).html());
					
				});
				
			})
});/**
 * invoice.js is a script file to navigates to invoice details template if
 * clicked on invoice list element client side.
 * 
 * @module Billing author: Yaswanth
 */
$(function()
{
	$("#invoice-model-list > tr").live('click', function(e)
	{
		e.preventDefault();

		// Reads the id of the invoice
		var invoice_id = $(this).find('.data').attr('data');

		if (invoice_id)
		{
			Backbone.history.navigate("invoice/" + invoice_id, {
				trigger : true
			});
		}
		// App_Subscription.invoiceDetails(data);
	});
});
//Coupons array
var AGILE_COUPONS_JSON = {}, AGILE_COUPON_INVALID_MESSAGE = "Coupon is either expired or invalid for the selected plan.";
function showCouponCodeContainer(id) {

	/**
	 * Changes for coupon existence or not. In future if want, change this to
	 * hide coupon container
	 */
	if (id)
		$("#content").find("#coupon_code_container").show();

	id = (id) ? "payment_selection_container" : "payment_selection_container1";
	$("#" + id).remove();
}

/**
 * Get coupon code status and show to the user
 * 
 * @param selected_plan_json
 * @param el
 * @returns
 */
function showCouponDiscountAmount(selected_plan_json, el) {

	var element = $(".coupon_code_discount_amount", el);

	var original_cost = selected_plan_json.cost;
	if (!original_cost)
		return element.html("");

	// Rest call to get the amount to discount
	checkValidCoupon(selected_plan_json.coupon_code, function(status) {

		// Get coupon
		var data = (!status) ? {}
				: AGILE_COUPONS_JSON[selected_plan_json.coupon_code];

		// Load Element
		var element = $(".coupon_code_discount_amount", el);
		var discountPrice = "0%";

		// Check percent and amout to deduct from main amount
		if (!data || !(data.percentOff || data.amountOff)) {
			element.find("#total_cost_with_discount").html(original_cost);
			return element.find("#coupon_code_discount_percent").html(
					"$0 (" + discountPrice + ")");
		}

		// Check amount off param
		var amountOff = data.amountOff;
		if (amountOff) {
			original_cost = original_cost - (amountOff / 100);
			discountPrice = "$" + (amountOff / 100);
		}

		// Check percent Off param
		var percentOff = data.percentOff;
		if (!amountOff && percentOff) {

			// Discount amount
			var discountAmount = original_cost * (percentOff / 100);

			// Get original cost
			original_cost = original_cost - discountAmount;

			discountPrice = "$" + (discountAmount.toFixed(2)) + " ("
					+ percentOff + "%)";
		}

		element.find("#total_cost_with_discount")
				.html(original_cost.toFixed(2));
		element.find("#coupon_code_discount_percent").html(discountPrice);

	});

}

/** Get coupon json from stripe
* 
* @param couponId
* @param callback
* @returns {Boolean}
*/
function getCouponJSON(couponId, callback) {

	if (!couponId)
		return false;

	// Load image
	var $load_img = '<img src="img/1-0.gif" height="20px" width="20px" />';
	$("#coupon_code_container form i").before($load_img);

	// Rest call to get the amount to discount
	$.get("corea/subscription/coupon/" + couponId, {}, function(data) {
		// Remove loading
		$("#coupon_code_container form img").remove();

		// Set this coupon object
		if (!data.id)
			AGILE_COUPONS_JSON[couponId] = "null";
		else
			AGILE_COUPONS_JSON[data.id] = data;

		// Call callback
		if (callback)
			callback(couponId);
	});

}


/**
 * Validate coupon
 * 
 * @param couponId
 * @param callback
 * @returns
 */
function checkValidCoupon(couponId, callback) {

	if (!couponId)
		return callback(false);

	if (AGILE_COUPONS_JSON[couponId])
		return callback(AGILE_COUPONS_JSON[couponId] != "null")

	console.log(AGILE_COUPONS_JSON[couponId]);

	// Get coupon json from server
	getCouponJSON(couponId, function(id) {
		checkValidCoupon(id, callback);
	});
}

/*
 * Get coupon json from stripe
 * 
 * @param couponId
 * @param callback
 * @returns {Boolean}
 */
function getCouponJSON(couponId, callback) {

	if (!couponId)
		return false;

	// Load image
	var $load_img = '<img src="img/1-0.gif" height="20px" width="20px" />';
	$("#coupon_code_container form i").before($load_img);

	// Rest call to get the amount to discount
	$.getJSON("core/api/subscription/coupon/" + couponId, {}, function(data) {
		console.log(data);
		// Remove loading
		$("#coupon_code_container form img").remove();

		// Set this coupon object
		if (!data.id)
			AGILE_COUPONS_JSON[couponId] = "null";
		else
			AGILE_COUPONS_JSON[data.id] = data;

		// Call callback
		if (callback)
			callback(couponId);
	});

}


function showCouponStatus(couponId) {

	var $load_img = '<img src="img/1-0.gif" height="15px" width="15px" />';
	$("#check_valid_coupon").remove($load_img);

}var plan_json = [];
var INTERVALS = ["monthly", "yearly", "biennial"];
//Plans with costs
var PLANS_COSTS_JSON = {};
PLANS_COSTS_JSON.starter = "14.99";
PLANS_COSTS_JSON.regular = "49.99";
PLANS_COSTS_JSON.pro = "79.99";

// Plans intervals JSON
var PLANS_DISCOUNTS_JSON = {};
PLANS_DISCOUNTS_JSON.monthly = "0";
PLANS_DISCOUNTS_JSON.yearly = "20";
PLANS_DISCOUNTS_JSON.biennial = "40";

var PLANS_DISCOUNTS_JSON_NEW = {};

PLANS_DISCOUNTS_JSON_NEW.starter = {};
PLANS_DISCOUNTS_JSON_NEW.starter.monthly = "0";
PLANS_DISCOUNTS_JSON_NEW.starter.yearly = "33.355";
PLANS_DISCOUNTS_JSON_NEW.starter.biennial = "40";

PLANS_DISCOUNTS_JSON_NEW.regular = {};
PLANS_DISCOUNTS_JSON_NEW.regular.monthly = "0";
PLANS_DISCOUNTS_JSON_NEW.regular.yearly = "20";
PLANS_DISCOUNTS_JSON_NEW.regular.biennial = "40";

PLANS_DISCOUNTS_JSON_NEW.pro = {};
PLANS_DISCOUNTS_JSON_NEW.pro.monthly = "0";
PLANS_DISCOUNTS_JSON_NEW.pro.yearly = "18.75";
PLANS_DISCOUNTS_JSON_NEW.pro.biennial = "40";

var PLAN_DETAILS = {
		getPlanPrice : function(plan_name) {
			return PLANS_COSTS_JSON[plan_name];
		},
		getDiscountedPrice : function(plan_name, interval)
		{
			var price = this.getPlanPrice(plan_name);
			var discount = PLANS_DISCOUNTS_JSON_NEW[plan_name][interval];
			return price * (100 - discount)/100; 
		},
		getDiscount : function(plan_name, interval)
		{
			return PLANS_DISCOUNTS_JSON_NEW[plan_name][interval];
		}
}

// User existing plan name
var user_existing_plan_name = "";
var USER_CREDIRCARD_DETAILS = {};
var USER_BILLING_PREFS;

var USER_DETAILS = {
		getCurrentPlanName : function(userJSON){
			if(!userJSON)
				return "free";
			return userJSON.plan.PlanType;
		},
		getCurrentPlanId: function(userJSON)
		{
			if(!userJSON)
				return "free";
			return userJSON.plan.plan_id;
		},
		getPlanType : function(userJSON){
			if(!userJSON)
			return "free";
		
			if(userJSON.plan.plan_type)
			{			
				if(userJSON.plan.plan_type.split("_").length == 1) return plan;
	
				// Returns lite-yearly....
				return userJSON.plan.plan_type.split("_")[0];
			}
			return "LITE"
		},
		getPlanInterval : function(userJSON){
			
			if(!userJSON || !userJSON.plan.plan_type)
				return "MONTHLY";

			var plan = userJSON.plan.plan_type
			
			if(plan)
				return plan.split("_")[1];
			
		},
		getQuantity : function(userJSON){
			
			if(!userJSON)
				return 2;
			
			return userJSON.plan.quantity;
		}
}


function load_slider(el) 
{
		  	$("#users_select_slider", el).slider({ 
			     	  from: 1,
			     	     to: 20, 
			     	     step: 1,
			     	     skin: "plastic",
			     	     onstatechange: function( value ) 
			     	     {
			     	     	$( "#users_quantity", el).text(value);
			     	     	price = update_price();
			     	     	$("#users_total_cost", el).text((value * price).toFixed(2));
					     }	
			     });	
}

function setCost(price)
{
	return $("#users_total_cost").text(($( "#users_quantity" ).text() * price).toFixed(2)); 
}

function update_price()
{	
	// Get the selected plan cost
	var plan_name = $("[name='pro_vs_lite']:checked").val();
	return $("#" + plan_name + "_plan_price").text();	
}


function setPriceTemplete(user_plan, element)
{

		var interval = "yearly", plan_type = "pro", quantity = 1;
		
		if(user_plan != "free" && user_plan != "super")
		{
			plan_type = USER_DETAILS.getPlanType(USER_BILLING_PREFS);
			interval = USER_DETAILS.getPlanInterval(USER_BILLING_PREFS);
			quantity = USER_DETAILS.getQuantity(USER_BILLING_PREFS);
				
			plan_type = plan_type.toLowerCase();
			interval = interval.toLowerCase();
		}
		
		$(element).find('#' + plan_type + '_plan_select').attr('checked','checked');
		$(element).find('.'+ interval).addClass("plan-select");
		$(element).find('#users_select_slider').attr('value', quantity);
		
		return element;	
	
	
}

function setPlan(user_plan)
{
	try{
		var interval = "yearly", plan_type = "regular";
		if(user_plan != "free" && user_plan != "super")
		{
			plan_type = USER_DETAILS.getPlanType(USER_BILLING_PREFS);
			interval = USER_DETAILS.getPlanInterval(USER_BILLING_PREFS);
			
			plan_type = plan_type.toLowerCase();
			interval = interval.toLowerCase();
		}
	
		
		$("input[value='" + plan_type + "']").trigger("click");
		$("ul.tagsli a." + interval).trigger("click");
		
		
		
	}catch(err){
		console.log(err);
		// alert(err);
	}
}





$(function()
		{
		
		$('.plan-collection-in').die().live('click', function(e){
			 
			$(this).find("[name='pro_vs_lite']").attr('checked','checked');
			var plan_type = "";
	  		$('.plan-collection-in').each(function(index, element){
	  			
	  			// Get plan type
	  			plan_type = $(element).find("#plan_name").text().toLowerCase();
	  			$(element).find("span.plan-collection-icon").removeClass(plan_type + "_selected");
	  		});
	  		
	  		// Get plan type
	  		plan_type = $(this).find("#plan_name").text().toLowerCase();
	  		$(this).find("span.plan-collection-icon").addClass(plan_type + "_selected");
	
	  		// Set cost based on the selected plan type
	  		var selected_plan = $(this).find("[name='pro_vs_lite']").val();
	  			 
	      	// Cost
	  		setCost(update_price());
	  		
	  	});

		// Tags selection
		$("ul.tagsli a").die().live("click", function(e){
			
			e.preventDefault();
			
			$("ul.tagsli a").removeClass("plan-select");
			$(this).addClass("plan-select");
			
			// Get interval
			var plan_interval = $(this).attr("class");
			plan_interval = plan_interval.replace("plan-select", "");
			plan_interval = plan_interval.trim();

			
			
			for(var key in PLANS_COSTS_JSON) {
				var amount = PLANS_COSTS_JSON[key];
				var discount = 	PLAN_DETAILS.getDiscount(key, plan_interval);
				var discount_amount = amount - ((discount/100) * amount);
				$('#'+ key +'_plan_price').html(discount_amount.toFixed(2));
			}
			
			// Cost
	  		setCost(update_price());
		});
	    
      	$('#purchase-plan').die().live('click', function(e){
	          var quantity = $("#users_quantity").text();
	          var cost = $("#users_total_cost").text();
	          var plan = $("input[name='pro_vs_lite']:checked").val();
	          var discount = "", months = "";
	          
	          if(!plan)
	         {
	        	  alert("Please select a plan to proceed");
	        	  return false;
	         }
	       
	          if($('.monthly').hasClass("plan-select")){cycle = "Monthly";months = 1; discount = PLAN_DETAILS.getDiscount(plan, "monthly")}
	          else if($('.yearly').hasClass("plan-select")){cycle = "Yearly";months = 12;discount = PLAN_DETAILS.getDiscount(plan, "yearly")}
	          else if($('.biennial').hasClass("plan-select")){cycle = "biennial";months = 24;discount = PLAN_DETAILS.getDiscount(plan, "biennial")}
	          
	          var variable = [];
			  var amount = PLANS_COSTS_JSON[plan];
			  for(var interval in PLANS_DISCOUNTS_JSON_NEW[plan])
			    {
				  	var percent = PLAN_DETAILS.getDiscount(plan, interval);
					var discount_amount = PLAN_DETAILS.getDiscountedPrice(plan, interval);
					variable[interval] = discount_amount.toFixed(2);
				}
		
			  user_existing_plan_name = USER_DETAILS.getCurrentPlanId(USER_BILLING_PREFS);
			 
			  // Check the plan
	          var selected_plan_name = amount +"-"+ months;
	          
	          if(selected_plan_name.toLowerCase()+"-" + quantity == user_existing_plan_name+"-"+USER_DETAILS.getQuantity(USER_BILLING_PREFS))
	          {
	        	  alert("Please change your plan to proceed");
	        	  return false;
	          }
	          
	        var currentDate = new Date(); 
	        plan_json.date = currentDate.setMonth(currentDate.getMonth()+months) / 1000;
	        
	        plan_json.price = update_price();
	        plan_json.cost = (cost * months).toFixed(2);
	        plan_json.months = months;
	        plan_json.plan = plan;
	        plan_json.plan_type = plan.toUpperCase()+"_"+ cycle.toUpperCase();
	        plan_json.cycle = cycle;
	        
	    	// Set coupon Only for Pro users
			delete plan_json["coupon_code"];
			var couponCode = $("#coupon_code").val();
			 if (couponCode)
				plan_json.coupon_code = couponCode;
	        
	        if(cycle != "biennial")
	        	{
	        	 	plan_json.yearly_discount = ([cost * 12] - [variable.yearly * quantity * 12]).toFixed(2);
	        	 	plan_json.bi_yearly_discount = ([cost * 24] - [variable.biennial * quantity * 24]).toFixed(2);
	        	}
	        
	        if((USER_DETAILS.getPlanType(USER_BILLING_PREFS) + "-" + USER_DETAILS.getQuantity(USER_BILLING_PREFS) + "-" + USER_DETAILS.getPlanInterval(USER_BILLING_PREFS)) == (plan + "-" + quantity + "-" + cycle)){
	        	
	        	alert("Please change the plan to proceed");
	        	return false;
	        }
	        
	        
	        
	        var plan_id = (months > 1) ? PLANS_COSTS_JSON[plan] + "-" + months : PLANS_COSTS_JSON[plan];
	        
	        
	        plan_json.plan_id = plan_id;
	        plan_json.discount = discount;
		    plan_json.quantity = quantity;
		    plan_json.current_plan = USER_DETAILS.getCurrentPlanName(USER_BILLING_PREFS);
		    if(!$.isEmptyObject(USER_CREDIRCARD_DETAILS)){
		    	
		    	plan_json.customer = JSON.parse(USER_CREDIRCARD_DETAILS);
		    }
		    
      	});
      	
     // Check coupon functionality
    	$("#check_valid_coupon").die().live(
    			'click',
    			function() {

    				// Get coupon input value
    				var couponId = $("#coupon_code").val();
    				if (!couponId) {
    					$("#coupon_code_container").find(".error").html(
    							"Invalid Coupon");
    					return false;
    				}

    				$("#coupon_code_container i").removeAttr("class");
    				var iconClass = "icon-", that = $(this);

    				// Check coupon status
    				checkValidCoupon(couponId, function(response) {
    					iconClass += (response) ? "ok" : "remove";
    					$("#coupon_code_container i").removeAttr("class").addClass(
    							iconClass);
    				});

    			});
    	
});	   /**
 * agile_billing.js is a script file to manage form fields i.e., credit card
 * expiry date and deserialize credit card details client side.
 * 
 * @module Billing author: Yaswanth
 */

/**
 * Show months and years in billing section for credit card expiry date
 * 
 * @param el
 *            html element
 */
function card_expiry(el)
{
	var yearMonthsArray = {};
	yearMonthsArray[1] = "01 (Jan)";
	yearMonthsArray[2] = "02 (Feb)";
	yearMonthsArray[3] = "03 (Mar)";
	yearMonthsArray[4] = "04 (Apr)";
	yearMonthsArray[5] = "05 (May)";
	yearMonthsArray[6] = "06 (Jun)";
	yearMonthsArray[7] = "07 (Jul)";
	yearMonthsArray[8] = "08 (Aug)";
	yearMonthsArray[9] = "09 (Sep)";
	yearMonthsArray[10] = "10 (Oct)";
	yearMonthsArray[11] = "11 (Nov)";
	yearMonthsArray[12] = "12 (Dec)";

	var select = $("#exp_month", el), month = new Date().getMonth() + 1;
	for ( var i = 1; i <= 12; i++)
	{
		select.append($("<option value='" + i + "' "
				+ (month === i ? "selected" : "") + ">" + yearMonthsArray[i]
				+ "</option>"))
	}

	var select = $("#exp_year", el), year = new Date().getFullYear();

	for ( var i = 0; i < 22; i++)
	{

		select.append($("<option value='" + (i + year) + "' "
						+ (i === 0 ? "selected" : "") + ">" + (i + year)
						+ "</option>"))
	}
}

/**
 * Deserializes the credit card details in billing session, fills address
 * fields, derialization is to be done explicitly because data returned from the
 * stripe does not match with the fields to fields names.
 * 
 * @param data
 *            subscription object
 * @param form
 *            form html element
 */
function deserialize_card_details(data, form)
{
	/**
	 * Iterates through activeCard details in data, finds corresponding values
	 * for the fields and fills them
	 */
	$.each(data.activeCard, function(key, value)
	{
		/**
		 * Match all the fields according to value key and actual field name and
		 * fills the fields with appropriate values.
		 */

		var fel;
		if (key.indexOf("name") != -1)
			fel = form.find('*[name="name"]');

		else
			if (key == "addressCountry")
				fel = form.find('*[name="address_country"]');
			else
				if (key == "addressState")
					fel = form.find('*[name="address_state"]');

				else
					if (key == "addressState")
						fel = form.find('*[name="address_state"]');

					else
						if (key == "addressLine1")
							fel = form.find('*[name="address_line1"]');

						else
							if (key == "addressLine2")
								fel = form.find('*[name="address_line2"]');

							else
								if (key == "addressZip")
									fel = form.find('*[name="address_zip"]');

		// If fields are found matching the fill assign values to them
		if (fel && fel.length > 0)
		{
			// Get to tag name to check the type of the tag
			tag = fel[0].tagName.toLowerCase();

			// If type of the field is input assgins value to it
			if (tag == "input")
			{
				$(fel).val(value);
			}
			/**
			 * If tag type is select and key is related to country then select
			 * the country and trigger change, to get the values, since this
			 * field uses "countries.js"
			 */
			else
				if (tag == "select" && key == "addressCountry")
				{
					// console.log($('#country'));
					$("#country").val(value).prop('selected', true).trigger(
							'change');
					// $(fel).val(value).trigger('change');
					$("#state").val(data.activeCard.addressState).prop(
							'selected', true).trigger('change');
				}
		}

	});
}/**
 * Case is modelled along the lines of Deals. So functionality and coding style are very similar.
 * 
 * @author Chandan
 */

//handle popover
$(function () {
	
	/**
	 * When mouseover on any row of opportunities list, the pop-over of deal is shown
	 **/
	$('#cases-model-list > tr').live('mouseenter', function () {
        
        var data = $(this).find('.data').attr('data');
        var currentCase = App_Cases.casesCollectionView.collection.get(data);
        var ele = getTemplate("cases-detail-popover", currentCase.toJSON());
        
        $(this).attr({
        	"rel" : "popover",
        	"data-placement" : 'right',
        	"data-original-title" : currentCase.toJSON().title,
        	"data-content" :  ele
        });
       
        /**
         * Checks for last 'tr' and change placement of popover to 'top' inorder
         * to prevent scrolling on last row of list
         **/
        $('#cases-model-list > tr:last').attr({
        	"rel" : "popover",
        	"data-placement" : 'top',
        	"data-original-title" : currentCase.toJSON().name,
        	"data-content" :  ele
        });
        
        /**
         * make sure first popover is shown on the right
         */
        $('#cases-model-list > tr:first').attr({
        	"rel" : "popover",
        	"data-placement" : 'right',
        	"data-original-title" : currentCase.toJSON().name,
        	"data-content" :  ele
        });
        
        $(this).popover('show');
     });
    
	
    /**
     * On mouse out on the row hides the popover.
     **/
	$('#cases-model-list > tr').live('mouseleave', function(){
    	 $(this).popover('hide');
    });
    
   /**
    * Close button of Case popup is clicked.
    **/
	$('#close-case').live('click', function(e){
    	e.preventDefault();
    });

});

//show add case modal
$(function(){

	$('.cases-add').live('click', function(e) {
		e.preventDefault();
		showCases();
	});

	$("#cases_validate").live('click', function(e){
		e.preventDefault();

    	// To know updated or added cases form names
    	var modal_id = $(this).closest('.cases-modal').attr("id");
    	var form_id = $(this).closest('.cases-modal').find('form').attr("id");
       	var json = serializeForm(form_id);
       	savecases(form_id, modal_id, this, json);    	
	});
	
	/**
	 * To avoid showing previous errors of the modal.
	 */
	$('#casesModal, #casesUpdateModal').on('show', function(data) {

		// Removes alert message of error related date and time.
		$('#' + this.id).find('.alert').css('display', 'none');
		
		// Removes error class of input fields
		$('#' + this.id).find('.error').removeClass('error');
		var taget = $(data.target);
		add_custom_fields_to_form({}, function(data){
			var el_custom_fields = show_custom_fields_helper(data["custom_fields"], []);
			$("#custom-field-case", taget).html($(el_custom_fields));
		
			}, "CASE");
	
	});
	
	$('#casesModal, #casesUpdateModal').on("shown", function(){
		// Add placeholder and date picker to date custom fields
		$('.date_input').attr("placeholder","MM/DD/YYYY");
    
		$('.date_input').datepicker({
			format: 'mm/dd/yyyy'
		});
	})
	
    
    /**
     * "Hide" event of note modal to remove contacts appended to related to field
     * and validation errors
     */ 
    $('#casesModal').on('hidden', function () {
    	
		// Removes appended contacts from related-to field
		$("#casesForm").find("li").remove();
		
		// Removes validation error messages
		remove_validation_errors('casesModal');

    });
    
    /**
     * "Hide" event of note modal to remove contacts appended to related to field
     * and validation errors
     */ 
    $('#casesUpdateModal').on('hidden', function () {
		
    	// Removes appended contacts from related-to field
		$("#casesUpdateForm").find("li").remove();
		
		// Removes validation error messages
		remove_validation_errors('casesUpdateModal');
    });
    
	$('#cases-model-list > tr > td:not(":first-child")').live('click', function(e) {
		e.preventDefault();
		updatecases($(this).closest('tr').data());
	});
});

/**
 * Show cases popup for editing
 * 
 * @param ele
 */
function updatecases(ele) 
{
	var value = ele.toJSON();
	
	add_recent_view(new BaseModel(value));
	
	var casesForm = $("#casesUpdateForm");
	
	deserializeForm(value,$("#casesUpdateForm"));
	
	
	// Call setupTypeAhead to get contacts
	agile_type_ahead("contacts-typeahead-input", casesForm, contacts_typeahead);
	$("#casesUpdateModal").modal('show');
	
	add_custom_fields_to_form(value, function(data){
		var el_custom_fields = show_custom_fields_helper(data["custom_fields"], []);
		console.log(value);
		console.log(el_custom_fields);
		console.log(value["custom_data"]);
		fill_custom_fields_values_generic($(el_custom_fields), value["custom_data"])
		$("#custom-field-case", casesForm).html(fill_custom_fields_values_generic($(el_custom_fields), value["custom_data"]));
	
		}, "CASE");
	
	// Fills owner select element
	populateUsers("owners-list", casesForm, value, 'owner', function(data)
	{
		casesForm.find("#owners-list").html(data);
		if (value.owner)
		{
			$("#owners-list", casesForm).find('option[value=' + value['owner'].id + ']').attr("selected", "selected");
		}
		
	});
}

// Show new cases popup
function showCases()
{	
	var el = $("#casesForm");
	
	add_custom_fields_to_form({}, function(data){
		var el_custom_fields = show_custom_fields_helper(data["custom_fields"], []);
		$("#custom-field-case", $("#casesModal")).html($(el_custom_fields));
	
		}, "CASE");
	
	// Fills owner select element
	populateUsers("owners-list", el, undefined, undefined, function(data){

		$("#casesForm").find("#owners-list").html(data);
		$("#owners-list", $("#casesForm")).find('option[value=' + CURRENT_DOMAIN_USER.id + ']').attr("selected", "selected");
		// Contacts type-ahead
		agile_type_ahead("contacts-typeahead-input", el, contacts_typeahead);
	});
	


	// Enable the datepicker
	$('#close_date', el).datepicker({
		format : 'mm/dd/yyyy'
	});
		
	$("#casesModal").modal('show');
}

// Updates or Saves a cases
function savecases(formId, modalId, saveBtn, json)
{	
	// Returns, if the save button has disabled attribute
	if ($(saveBtn).attr('disabled'))return;

	// Disables save button to prevent multiple click event issues
	disable_save_button($(saveBtn));//$(saveBtn).attr('disabled', 'disabled');
	
	if (!isValidForm('#' + formId)){
		enable_save_button($(saveBtn));//$(saveBtn).removeAttr('disabled'); // Removes disabled attribute of save button
		return false;
	}
	
	// Shows loading symbol until model get saved
    //$('#' + modalId).find('span.save-status').html(LOADING_HTML);
	
	var newEntry=false; // test if this model is new, true => new model 
	if(json.id===undefined)newEntry=true;
	
	json["custom_data"] = serialize_custom_fields(formId);
	
	var newcases = new Backbone.Model();
	newcases.url = 'core/api/cases';
	newcases.save(json, 
	{
		success : function(data) 
		{		
			// Removes disabled attribute of save button
			enable_save_button($(saveBtn));//$(saveBtn).removeAttr('disabled');

			//$('#' + modalId).find('span.save-status img').remove();
			$('#' + modalId).modal('hide');

			$('#' + formId).each(function() {
				this.reset();
			});
			
			var cases = data.toJSON();
			
			add_recent_view(new BaseModel(cases));
			
			// Updates data to timeline
			/*If(Contact-Details) page - then adjust timeline*/			
			if (App_Contacts.contactDetailView
					&& Current_Route == "contact/" + App_Contacts.contactDetailView.model.get('id')) 
			{
				// Add model to collection. Disabled sort while adding and called
				// sort explicitly, as sort is not working when it is called by add
				// function
				if (casesView && casesView.collection)
				{
					if(casesView.collection.get(cases.id))
					{
						casesView.collection.get(cases.id).set(new BaseModel(cases));
					}
					else
					{
						casesView.collection.add(new BaseModel(cases), { sort : false });
						casesView.collection.sort();
					}
				}
				
				if(App_Contacts.contactDetailView.model.get('type')=='COMPANY')
				{
					activate_timeline_tab();  // if this contact is of type COMPANY, simply activate first tab & fill details
					fill_company_related_contacts(App_Contacts.contactDetailView.model.id,'company-contacts'); 
					return;
				}
				/// Now Only models which have type 'PERSON' will through below.
				
				// activate_timeline_tab(); // switch to first tab in Contact-Detail View
				
				// Verifies whether the added case is related to the contact in
				// contact detail view or not
				
				/**Code to add Info of Case to timeline
				 * Not Fully Done, it was directly copied from Deals module.
				 * 
				 *  If you wanna add Case to timeline, edit below
				 */
				$.each(cases.contacts, function(index, contact) {
					
					if (contact.id == App_Contacts.contactDetailView.model.get('id')) {
				
						// Activates "Timeline" tab and its tab content in
						// contact detail view
						// activate_timeline_tab();
						add_entity_to_timeline(data);
						/*
						 * If timeline is not defined yet, initiates with the
						 * data else inserts
						 */
						return false;
					}//end if
				}); //end each
				
				/*End of Adding data to timeline.
				*/
			}//end if
			/*end-if(Contact-Details) */
			else if(Current_Route == 'cases')
			{
				//On cases page.. adjust current model
				if(newEntry==true)App_Cases.casesCollectionView.collection.add(data);
				else
				{						
					App_Cases.casesCollectionView.collection.remove(json);
					App_Cases.casesCollectionView.collection.add(data);
				}
				App_Cases.casesCollectionView.render(true);
			}
			else App_Calendar.navigate("cases",{trigger:true}); 
		},
		error: function(data,response)
		{
			enable_save_button($(saveBtn));
		}
	});
}/**
 * md5.js deals with implementing the md5 cryptographic hash function 
 * which takes arbitrary-sized data and output a fixed-length (16) hash value.
 */
var Agile_MD5 = function (string) {

        function RotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }

        function AddUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        function F(x, y, z) {
            return (x & y) | ((~x) & z);
        }

        function G(x, y, z) {
            return (x & z) | (y & (~z));
        }

        function H(x, y, z) {
            return (x ^ y ^ z);
        }

        function I(x, y, z) {
            return (y ^ (x | (~z)));
        }

        function FF(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function GG(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function HH(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function II(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };

        function WordToHex(lValue) {
            var WordToHexValue = "",
                WordToHexValue_temp = "",
                lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        };

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        };

        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7,
            S12 = 12,
            S13 = 17,
            S14 = 22;
        var S21 = 5,
            S22 = 9,
            S23 = 14,
            S24 = 20;
        var S31 = 4,
            S32 = 11,
            S33 = 16,
            S34 = 23;
        var S41 = 6,
            S42 = 10,
            S43 = 15,
            S44 = 21;

        string = Utf8Encode(string);

        x = ConvertToWordArray(string);

        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;

        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = AddUnsigned(a, AA);
            b = AddUnsigned(b, BB);
            c = AddUnsigned(c, CC);
            d = AddUnsigned(d, DD);
        }

        var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

        return temp.toLowerCase();
    };/** 
 * Check if route is the current route of the app.
 * @param route
 * @returns {Boolean}
 */
function isRoute(route)
{
	if(!Current_Route)return false;
	return (Current_Route.indexOf(route)==0);
}

/**
 * Checks if any modal is visible.
 * @returns
 */
function isModalVisible()
{
	return $(".modal").is(":visible");
}

$(function(){
	
	/* To enable or disable the keyboard shortcuts	 */
	if(CURRENT_USER_PREFS.keyboard_shotcuts)
		enableKeyboardShotcuts();
	
	/* For toggling keyboard shortcuts modal popup */
	$('#keyboard-shortcuts').die().live('click', function(e){
		var keyShortModal = $(getTemplate("shortcut-keys"),{});
		keyShortModal.modal('show');
	});
});

/**
 * Enables keyboard shortcuts based on user prefs.
 */
function enableKeyboardShotcuts()
{
	head.js(LIB_PATH+'lib/mousetrap.min.js',function(){
	
		// Preferences
		Mousetrap.bind('shift+p',function(){
			if(isModalVisible())return;
			App_Settings.navigate("user-prefs",{trigger:true});
		});
		
		// New contact
		Mousetrap.bind('shift+n',function(){
			if(!isModalVisible())
				$('#personModal').modal('show'); 
		});
		
		// New Activity
		Mousetrap.bind('shift+t',function(){
			if(!isModalVisible())
				$('#activityModal').modal('show');
		});
		
		// Edit the current contact
		Mousetrap.bind('shift+e',function(){
			if(isRoute("contact/") && !isModalVisible())
				App_Contacts.navigate("contact-edit",{trigger:true});
		});
		
		// Send mail to current contact
		Mousetrap.bind('shift+m',function(){
			if(isRoute("contact/") && !isModalVisible())
				App_Contacts.navigate("send-email",{trigger:true});
		});
		
		// Focus on search box in main menu
		Mousetrap.bind('/',function(e){
			if(isModalVisible())return;
			document.getElementById('searchText').focus();
			
			if(e.preventDefault)
		        e.preventDefault();
		    else
		        e.returnValue = false; // internet explorer
		});
		
		// New of current entity type
		Mousetrap.bind('n',function(){
			
			if(isModalVisible())return;
			
			if(isRoute('contact'))
				$('#personModal').modal('show');
			else if(isRoute('cases'))
				showCases();
			else if(isRoute('deals'))
				show_deal();
			else if(isRoute('workflow'))
				App_Workflows.navigate("workflow-add",{trigger:true});
			else if(isRoute('report'))
				App_Reports.navigate("report-add",{trigger:true});
			else if(isRoute('task') || isRoute('calendar'))
				$('#activityModal').modal('show');
		});
	});
}

/** OLD CODE Below - Without any library, just native js.
 * 	Performance not tested, so don't know if this or the one with Mousetrap Library is faster.
 *

// keyCode value of keys used in shortcut.
var CodeASCII={
E:"E".charCodeAt(0),
M:"M".charCodeAt(0),
N:"N".charCodeAt(0),
P:"P".charCodeAt(0),
T:"T".charCodeAt(0),
Slash:191
};



/**
 * Check if tg is any input tag
 * @param tg - tag name to test.
 * @returns
 *
function isInputTag(tg)
{
	var tagList=[ "INPUT", "TEXTAREA" ];
	
	for(var i=0;i<tagList.length;++i)
		if(tg==tagList[i])return true;
	
	return false;
}

/**
 * Handler function fired when any key is pressed.
 * @param e
 *
function keyHandler(e)
{
	if((e.target && isInputTag(e.target.tagName)) || isModalVisible())return;
	// focussed on input, so return default, as user is typing text.
	
	if(e.shiftKey)
	{
		if(e.keyCode==CodeASCII.P)
			App_Settings.navigate("user-prefs",{trigger:true}); 	// Shift+P : preferences
		else if(e.keyCode==CodeASCII.N)
			$('#personModal').modal('show');                    	// Shift+N : new contact person
		else if(e.keyCode==CodeASCII.T)
			$('#activityModal').modal('show');						// Shift+T : new task
		else if(isRoute("contact/"))
		{
			if(e.keyCode==CodeASCII.E)
				App_Contacts.navigate("contact-edit",{trigger:true});	// Shift+E : edit current contact
			else if(e.keyCode==CodeASCII.M)	
				App_Contacts.navigate("send-email",{trigger:true});		// Shift+M : send mail to current contact
		}
		else return;												// Let default happen.
		
		e.preventDefault();
	}
	else
	{
		if(e.keyCode==CodeASCII.Slash)
		{
			document.getElementById('searchText').focus(); 			// / : search
			e.preventDefault();
		}
		else if(e.keyCode==CodeASCII.N)								// N : new current thing
		{
			if(isRoute('contact'))
				$('#personModal').modal('show');
			else if(isRoute('cases'))
				showCases();
			else if(isRoute('deals'))
				show_deal();
			else if(isRoute('workflow'))
				App_Workflows.navigate("workflow-add",{trigger:true});
			else if(isRoute('report'))
				App_Reports.navigate("report-add",{trigger:true});
			else if(isRoute('task') || isRoute('calendar'))
				$('#activityModal').modal('show');	
			e.preventDefault();
		}
	}	
}

window.onkeydown = keyHandler;
*/$(function(){ 

	$(".upload_s3").live('click', function(e){
		e.preventDefault();
		uploadImage("upload-container");
	});

	//Upload contact image
	$(".upload_pic").live('click', function(e){
		e.preventDefault();
		uploadImage("contact-container");
	});
	
});	

function uploadImage(id)
{
	var newwindow = window.open("upload.jsp?id=" + id,'name','height=310,width=500');
	if (window.focus)
	{
		newwindow.focus();
	}
	return false;
}

function setImageURL(url)
{
	var id = "upload-container";
	// Set the media stream
	$('#' + id).find('.imgholder').html('');
	$('#' + id).find('.imgholder').html('<img src="' + url + '" height="100" width="100"/>');
	
	// Set the value of selector for input
	$('#' + id).find('#upload_url').val(url);
}

//Saving contact image
function setContactImageURL(url)
{
	var id = "contact-container";
	// Set the media stream
	$('#' + id).find('.imgholder').html('');
	$('#' + id).find('.imgholder').html('<img src="' + url + '" height="50" width="50"/>');
	
	// Set the value of selector for input
	$('#' + id).find('#upload_url').val(url);
	agile_crm_update_contact("image", url);
}
(function($) {
	
    // To show top button at the bottom of page
	addScrollTopAnimation(); 
	
	// Starts scroll
	function addScrollTopAnimation() {

		var $scrolltop_link = $('#scroll-top');

		// When click event is fired scrolls the page to top
		$scrolltop_link.on('click', function(ev) {

			ev.preventDefault();

			$('html, body').animate({ scrollTop : 0	}, 700);

		})

		// Hides the link initially
		.data('hidden', 1).hide();

		var scroll_event_fired = false;

		$(window).on('scroll', function() {

			scroll_event_fired = true;

		});

		/*
		 * Checks every 300 ms if a scroll event has been fired.
		 */
		setInterval(function() {

			if (scroll_event_fired) {

				/*
				 * Stop code below from being executed until the next scroll
				 * event.
				 */
				scroll_event_fired = false;

				var is_hidden = $scrolltop_link.data('hidden');

				/*
				 * Display the scroll top link when the page is scrolled down
				 * the height of half a viewport from top, Hide it otherwise.
				 */
				if ($(this).scrollTop() > $(this).height() / 2) {
					if (is_hidden) {
						$scrolltop_link.fadeIn(600).data('hidden', 0);
					}
				}
				else {
					if (!is_hidden) {
						$scrolltop_link.slideUp().data('hidden', 1);
					}
				}
			}
		}, 300);
	}
	
	/* For toggling help modal popup */
	$('#help-page').die().live('click', function(e){
		
		var helpModal = $(getTemplate("show-help"),{});
		helpModal.modal('show');
	
		// Hides help only when clicked on close button.
	    $('.hide-modal', helpModal).click(function(){
	    		helpModal.modal('hide');
	    });
   
	});
	
	/* For opening the footer icons in seperate popup window */
	$('.email-share').die().live('click', function(e){
		e.preventDefault();
		var x = 500;
		var title = $(this).closest("a").attr('data');
		if(title == "Linkedin") x=700;
		var url = $(this).closest("a").attr('href');
		window.open(url, title, "width=" + x + ",height=500,left=200%,top=100%");
	});
	
	/* For sharing agile to friends */
	$('#share-email').die().live('click', function(e){
		e.preventDefault();
		
		// If modal is already present removing it to submit new form
        if ($('#share-by-email').size() != 0)
        {
        	$('#share-by-email').remove();
        }
				var emailModal = $(getTemplate("share-by-email", CURRENT_DOMAIN_USER));
				
				// Replacing text area break lines
				var description = $(emailModal).find('textarea').val();
				description = description.replace( /<br\/>/g,"\r\n");
				$(emailModal).find('textarea').val(description);
		
				emailModal.modal('show');
		
				// When send button is clicked form is validated
				$('#shareMail').die().live('click',function(e){
					e.preventDefault();
					
					if(!isValidForm($('#sharemailForm')))
				      {	
				      	return;
				      }
					
					var json = serializeForm("sharemailForm");
					
					json.body = json.body.replace(/\r\n/g,"<br/>");
					
					// Constructs URL to send mail
					var url =  'core/api/emails/send-email?from=' + encodeURIComponent(json.from) + '&to=' + 
					 encodeURIComponent(json.to) + '&subject=' + encodeURIComponent(json.subject) + '&body=' + 
						 encodeURIComponent(json.body);
					
					// Shows message 
				    $save_info = $('<img src="img/1-0.gif" height="18px" width="18px"></img>&nbsp;&nbsp;<span><p class="text-success" style="color:#008000; font-size:15px; display:inline-block"> <i>Sending mail...</i></p></span>');
				    $("#msg", this.el).append($save_info);
					$save_info.show().delay(2000).fadeOut("slow");
					
					// Navigates to previous page on sending email
					$.post(url, function(){
						emailModal.modal('hide');
					});
		
				});
		
	});
	
})(jQuery);/**
 * Shows and manages menu list of recently viewed items, on right side of main menu.
 * 
 * Non-static fxn : add_recent_view(model mdl)
 * 						This will add model mdl to the list. This function takes care of order of the list too, with most
 * 						recently viewed model being displayed first.
 * 
 * 						This is the only function necesary outside of this file/module.
 * 
 * @author Chandan
 */

var recent_view;
var recent_view_update_required=false;
var MAX_RECENT=6;

/**
 * Does actual work of populating menu from list.
 */
function populate_recent_menu()
{
	if(!recent_view)
	{	
		var arr = [];
		try{
			arr = JSON.parse(localStorage.recentItems);
		}
		catch(err)
		{
			
		}
		recent_view = new Base_Collection_View({
//			url: 'core/api/contacts/recent?page_size=5' ,
			restKey: "contacts",
			templateKey: "recent-menu",
			data : arr,
			individual_tag_name: 'li',
			sort_collection: false,
			postRenderCallback : function(el)
			{
				$('#recent-menu').append($(el).html())
			}
		});
		
		recent_view.render(true);

		
	
	
	if(recent_view.collection.length==0)	// default text, when list is empty.
		$('#recent-menu>ul').html('<li style="text-align:center;"><a class="disabled">No Recent Activity</a></li>');
	else {recent_view.render(true);
	}			// populate elements if filled from localStorage
}
}

/**
 * Add/Update model to recent contacts view.
 * Now non functional.
 * @param mdl - the model to add.
 */
function add_recent_view(mdl)
{
	
	if(recent_view==undefined)
		populate_recent_menu();
	
	// Add model to front of the collection, so most frequent ones are on top.
	
	if(!recent_view.collection.get(mdl.get('id'))){
		
		if(recent_view.collection.length>=MAX_RECENT)
			recent_view.collection.pop({silent:true});
		
		recent_view.collection.unshift(mdl);
	}	
	else {
			recent_view.collection.remove(mdl, { silent: true });
		
		recent_view.collection.unshift(mdl);
	}
	
	
	
	recent_view_update_required=true;

	var arr=[];
	
	for(var i=0;i<recent_view.collection.models.length;++i)
	{
		arr.push(recent_view.collection.models[i].attributes);
	}
	
	localStorage.recentItems = JSON.stringify(arr); // save current list to localStorage
}

/**
 * Appropriate action when an entry in drop down menu is clicked.
 * @param id
 */
function modelAction(elem)
{
	var id=elem.dataset['id'];
	var entity=recent_view.collection.get(id);
	var type=entity.attributes.entity_type;
	
	if(type=='contact_entity')
	{
		App_Contacts.navigate("contact/"+id,{trigger:true});
		$('#contactsmenu').parent().find('.active').removeClass('active');
		$('#contactsmenu').addClass('active');
	}	
	else if(type=='deal')
	{
		updateDeal(entity);
	}
	else if(type == 'case')
	{
		updatecases(entity);
	}
	else if(type == 'document' || entity.attributes.network_type)
	{
		updateDocument(entity);
	}
	
	recent_view_update_required=true;
}

$(function(){
	
	// when caret clicked, show the dropdown menu
	$('#recent-menu').on('click',function(e){ 
	
		if(recent_view==undefined)
			populate_recent_menu();
		else if(recent_view_update_required)
			{
			recent_view.render(true);
			}
		
		recent_view_update_required=false;
	});
	
	$('#recent-menu li:first').mouseenter(function(e){
		e.stopPropagation();
		e.preventDefault();
		$(this).css('background-color','white');
	});
	
	// when an entry clicked
	$('#recent-menu').on('click','ul>li',function(e) {
		e.stopPropagation();
		
		var selected_element=$(e.target).closest('[data-id]',$(this));
				// find the id of the element
		
		if(selected_element.length)
			modelAction(selected_element[0]);
		
		// close the drop down menu
		$('#recent-menu').removeClass('open');
		
		return false;
	});	
});

$(function()
{
		/**
		 * If user clicks on delete,
		 * delete request is sent to "core/api/admin/delete/namespace"
		 */
		$(".delete-namespace").die().live('click', function(e){
			
					e.preventDefault();
					
					/*// If modal already exists, removes to append new
                    if ($('#warning-deletion').size() != 0)
                    {
                    	$('#warning-deletion').remove();
                    }*/
					
					var namespace = $(this).closest('a').attr("data");
					
					if(namespace != "")
					{
							if (!confirm("Are you sure you want to delete ?" ))
								return;
							
							// Show loading in content
							$("#content").html(LOADING_HTML);
							/**
							 * Sends delete request to delete namespace 
							 */
							$.ajax({
								type : "DELETE",
								url : "core/api/users/admin/delete/" + namespace,
								success : function()
								{
									location.reload(true);
								}
							});
						
						/*						
						* // Shows account stats warning template with stats(data used)
						*//**
						 * Getting namespace stats for this domain
						 *//*
						var account_stats = new Base_Model_View({
							url : "core/api/users/admin/namespace-stats/" + namespace,
							template : "warning"
						});
	                    
						// Appends to content, warning is modal can call show if
						// appended in content
						$('#content').append(account_stats.render(true).el);
						
						// Shows warning modal
						$("#warning-deletion").modal('show');

						*//**
						 * If user clicks on confirm delete the modal is hidden and
						 * delete request is sent to "core/api/admin/delete/namespace"
						 *//*
						$("#confirm-delete-account").click(function(e){
							
								e.preventDefault();
		
								// Hides modal
								$("#warning-deletion").modal('hide');

					     });*/
				   }
		});
});/**
 * help-mail.js deals with functions like building url by parsing form data,
 * showing message while sending mail, resetting form data after sending mail.
 * 
 * @module jscore
 */

/**
 * Serialize form data, build url, show message, reset form fields.
 * 
 * @param #helpmailForm
 */
$(function() {

	// Prevent default on click
	$('#helpMail').die().live('click',function(e){
		e.preventDefault();

		if($(this).attr('disabled'))
	   	     return;
		
		// If not a valid form return else serialize form data to parse
		if(!isValidForm($("#helpmailForm")))
			return;
		
		// Disables send button and change text to Sending...
		disable_send_button($(this));
		
		var json = serializeForm("helpmailForm");
		
		// Replace \r\n with <br> tags as email is sent as text/html
		json.body = json.body.replace(/\r\n/g,"<br/>");
        
		// Build url
		var url =  'core/api/emails/send-email?from=' + encodeURIComponent(json.from) + '&to=' + 
		encodeURIComponent(json.to) + '&subject=' + encodeURIComponent(json.subject) + '&body=' + 
		encodeURIComponent(json.body);

    	// Show message and gif while sending mail and fadeout
//		$save_info = $('<img src="img/1-0.gif" height="18px" width="18px"></img>&nbsp;&nbsp;<span><p class="text-success" style="color:#008000; font-size:15px; display:inline-block"> <i>Sending mail...</i></p></span>');
//		$("#msg", this.el).append($save_info);
//		$save_info.show().delay(2000).fadeOut("slow");

		$.post(url,function(){

			// Reset form fields after sending email
			$("#helpmailForm").each(function () {
				this.reset();
			});
			
			// Enables Send Email button.
		    enable_send_button($('#helpMail'));
		});
	});
});/**
 * email-charts.js - It handles campaign's hourly, weekly or date email-charts. It
 * initializes the date-range-picker and HighChart's bar graphs. It also handles
 * to fetch timezone offset.
 */

/**
 * Initializes the date-range-picker. Calls showEmailGraphs based on the date
 * range seleted.
 * 
 * @param campaign_id -
 *            to show charts w.r.t campaign-id.
 * @param callback -
 *            callback method if any.
 */
function initChartsUI(campaign_id, callback)
{
	head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js', CSS_PATH + "css/misc/date-picker.css", function()
	{

		// Bootstrap date range picker.
		$('#reportrange').daterangepicker({ ranges : { 'Today' : [
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
		] } }, function(start, end)
		{
			var months_diff = Math.abs(start.getMonth() - end.getMonth() + (12 * (start.getFullYear() - end.getFullYear())));
			$('#reportrange span').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));
			$("#week-range").html(end.add({ days : -6 }).toString('MMMM d, yyyy') + ' - ' + end.add({ days : 6 }).toString('MMMM d, yyyy'));

			// Updates bar graphs on date change.
			showEmailGraphs(campaign_id);
		});
	});

	// shows graphs by default week date range.
	showEmailGraphs(campaign_id);
}

/**
 * Shows date-wise, hourly and weekly reports of a campaign. Calls showBar
 * function which uses HighCharts plugin to show bar charts.
 */
function showEmailGraphs(campaign_id)
{

	// Daily
	showBar('core/api/campaign-stats/email/reports/' + campaign_id + getOptions() + "&type=date", 'line-daily-chart', 'Daily Reports', 'Count', null);

	// Hourly
	showBar('core/api/campaign-stats/email/reports/' + campaign_id + getOptions() + "&type=hour", 'line-hourly-chart', 'Hourly Reports', 'Count', null);

	// Weekly
	showBar('core/api/campaign-stats/email/reports/' + campaign_id + getOptions() + "&type=day", 'line-weekly-chart', 'Weekly Reports', 'Count', null);
}

/**
 * Returns start_time, end_time and time_zone (timezone offset like -330) as
 * query params. Splits date range based on '-' to get start and end time in
 * milliseconds. Fetches timezone offset using Date function.
 */
function getOptions()
{
	// Options
	var options = "?";

	// Get Date Range
	var range = $('#range').html().split("-");

	// Returns milliseconds from start date. For e.g., August 6, 2013 converts
	// to 1375727400000
	var start_time = Date.parse($.trim(range[0])).valueOf();

	// Returns milliseconds from end date.
	var end_time = Date.parse($.trim(range[1])).valueOf();

	// Adds start_time, end_time and timezone offset to params.
	options += ("start_time=" + start_time + "&end_time=" + end_time);

	// Add Timezone offset
	var d = new Date();
	options += ("&time_zone=" + d.getTimezoneOffset());
	
	// If Frequency is present - send frequency too
	if($('#frequency').length > 0)
	{
		// Get Frequency
		var frequency = $( "#frequency").val();
		options += ("&frequency=" + frequency);
	}
	
	// If Frequency is present - send frequency too
	if($('#filter').length > 0)
	{
		// Get Frequency
		var filter_id = $( "#filter").val();
		if(filter_id !="" && filter_id != "ALL")
		options += ("&filter=" + filter_id);
	}
	
	// console.log("options " + options);
	return options;
}
var Agile_Tour = {};

/**
 * Returns Agile_tour steps JSON
 * 
 * @param el
 */
function create_tour_steps(el)
{

	Agile_Tour["contacts"] = [
			{ "element" : "#contacts", "title" : "Contact & Account Management",
				"content" : "View your contacts, leads and accounts (companies) all at one place.<br/>", "placement" : "bottom", "el" : el, "backdrop" : true },
			{ "element" : "#filters-tour-step", "title" : "Companies (Accounts)",
				"content" : "Accounts are stored as Companies in Agile.<br/><br/> You can switch between contacts and companies  here.<br/>",
				"placement" : "bottom", "el" : el, "backdrop" : true },
			{
				"element" : "#tags",
				"title" : "Tags",
				"content" : "Tags help you effectively manage your contacts and companies.<br/><br/> For eg: you can add a lead tag to your contacts for leads.<br/>",
				"placement" : "right", "el" : el, "backdrop" : true }
	]

	/**
	 * Contacts details
	 */
	Agile_Tour["contact-details"] = [
			{ "element" : "#contact-tab-content", "title" : "Facebook-Style Timeline",
				"content" : "Notice the awesome timeline with dates, emails exchanged, social messages & site visits.<br/>", "placement" : "right", "el" : el,
				"backdrop" : true },
			{
				"element" : "#score",
				"container" : "#score",
				"title" : "Score your leads",
				"content" : "Assign lead scores for every contact to keep high quality leads swimming on top. <br/><br/> Use workflows to automate the process based on user behavior.<br/>",
				"placement" : "bottom", "el" : el, "backdrop" : true },
			{ "element" : "#widgets", "title" : "Widgets & Integrations",
				"content" : "Get more information about the contact from social media, helpdesk tickets, chats, and from billing systems.<br/>",
				"placement" : "left", "el" : el, "backdrop" : true, },
	];

	/**
	 * Calendar
	 */
	Agile_Tour["calendar"] = [
			{ "element" : "#calendar", "title" : "Calendar Events", "content" : "Events are time based such as meetings.<br/> They show up in calendar.<br/>",
				"placement" : "left",
				// "el": el,
				"backdrop" : true, },
			{ "element" : ".todo-block", "title" : "To Do Tasks",
				"content" : "Tasks are like to-dos. Result oriented.<br/><br/> You can assign a category such as call, email.<br/>", "placement" : "right",
				// "el": el,
				"backdrop" : true, },
			{ "element" : "#subscribe-ical", "title" : "Calendar Sync",
				"content" : "You can sync your Agile calendar with  Outlook, Google calendar or your mobile phone.<br/>", "placement" : "top",
				// "el": el,
				"backdrop" : true, },

	];

	Agile_Tour["workflows"] = [
			{
				"element" : "#learn-workflows",
				"title" : "Learn about Campaigns",
				"content" : "Our customers love campaign workflows. You would too!<br/><br/>  <p class='text-error'><strong>Take a few mins and learn more about campaigns.</strong></p>",
				"placement" : "left", "el" : el, "backdrop" : true, },
			{
				"element" : "#add-trigger",
				"title" : "Triggers",
				"content" : "Create conditions to trigger your campaigns automatically. <br/><br/> <strong>Eg:</strong> when a tag is added or when a contact reaches a score.<br/>",
				"placement" : "bottom", "el" : el, "backdrop" : true, }
	]
/*	Agile_Tour["workflows-add"] = [
		{ "element" : "#workflowform", "title" : "Visual Campaigns",
			"content" : "Create your campaigns and workflows visually.<br/> Just drag and drop the nodes. Connect them to the workflow.<br/>",
			"placement" : "top", "el" : el, "backdrop" : true, }
	]*/

}

var tour;

/**
 * gets the key and initializes the tour with steps from the JSON Object
 * 
 * @param key
 * @param el
 */
function start_tour(key, el)
{
	if (!key)
		key = Current_Route;

	console.log(tour);

	// If tour is defined and tour name is not equal to current route/key, then
	// tour should be ended
	if (tour && tour._options)
	{
		var step = tour._current;
		console.log(step);
		console.log(tour._options.name);
		console.log(key + "-tour");

		if (tour._options.name != key + "-tour")
		{
			tour.end();
			tour = undefined;
		}
		else
		{
			// if user hits a button in the page, it reloads. On reload, current
			// tour is stoped and reinitialized
			tour.end();
			tour.setCurrentStep(step);
			tour.start(true);
			return;
		}
	}

	tour = undefined;
	var tour_flag = false;

	if (!el)
	{
		if (tour_flag)
			return;

		// Initializes the tour and sets tour flag to ensure tour won't load
		// again
		initiate_tour(key, el);
		tour_flag = true;
	}

	// Tour should be initialized only after page is loaded
	$('body').live('agile_collection_loaded', function(event, element)
	{
		if (tour_flag)
			return;

		// Initializes the tour and sets tour flag to ensure tour won't load
		// again
		initiate_tour(key, element);
		tour_flag = true;
	});
}

/**
 * Initializes the tour with based fetched from JSON object defined. key can
 * either be sent explicitly or it takes them from current route
 * 
 * @param key
 * @param el
 */
function initiate_tour(key, el)
{
	// Reads cookie which is set in Homeservlet when new user is created
	var tour_status_cookie = readCookie("agile_tour");

	// If cookies is not preset it returns back
	if (!tour_status_cookie)
		return;

	// If is undefined the current route is assigned to tour
	if (!key)
	{
		if (!Current_Route)
			return;

		key = Current_Route;
	}

	// Parses cookie. It is parsed 2 times or it is returing string instead of
	// JSON object
	tour_status_cookie = JSON.parse(JSON.parse(tour_status_cookie));

	// Reads whether tour is ended on current route
	tourStatus = tour_status_cookie[key];

	// If tour is not there on current page then it is returned back
	if (!tourStatus)
		return;

	// If JSON Object is empty, then creates new JSON Object
	if ($.isEmptyObject(Agile_Tour))
		create_tour_steps(el);

	if (Agile_Tour[key])
		head.load(CSS_PATH+'css/bootstrap-tour.min.css', 'lib/bootstrap-tour-agile.min.js', function()
		{
			// Uses bootstrap tour
			tour = new Tour({ name : key + "-tour", debug : true, useLocalStorage : true, endOnLast : true, onEnd : function(tour)
			{

				// Remove from cookie on ending tour
				$("." + key + "-tour").remove();
				delete tour_status_cookie[key];

				if ($.isEmptyObject(tour_status_cookie))
				{
					eraseCookie("agile_tour");
					return;
				}

				/*
				 * Stringified it twice to maintain consistency with the cookie
				 * set from backend. Creates JSON with current step removed.
				 */
				createCookie("agile_tour", JSON.stringify(JSON.stringify(tour_status_cookie)));
			} });

			tour.addSteps(Agile_Tour[key]);

			// Set current step to first step
			tour.setCurrentStep(0);
			tour.start(true);

		})

}

/**
 * Creates a tour cookie and initializes tour on current page.
 */
function reinitialize_tour_on_current_route()
{

	console.log(tour);

	// Return of tour is already enabled on that route
	var tour_status_cookie = readCookie("agile_tour");
	var key = Current_Route;

	// If current view is contact details page we cannot initialize
	// tour based on route name, so we should be changing it to
	// "contact-details"
	if (Current_Route.indexOf("contact/") != -1)
		key = "contact-details";

	// If cookie exists, checks the state of tour in curent route.
	if (tour_status_cookie)
	{
		tour_status_cookie = JSON.parse(JSON.parse(tour_status_cookie));

		if (tour_status_cookie[key] == true)
			return;
		localStorage.removeItem(key + "-tour_current_step");
	}

	else
		tour_status_cookie = {};

	// Set tour back to true and save in cookie.
	tour_status_cookie[key] = true;

	console.log(JSON.stringify(tour_status_cookie));

	// Removes the current step from localstorage, it is set by bootstrap tour
	localStorage.removeItem(key + "-tour_current_step");

	// Creates a new tour cookie
	createCookie("agile_tour", JSON.stringify(JSON.stringify(tour_status_cookie)));

	// Initialize tour
	initiate_tour(key);
}

$(function()
{
	/**
	 * Selecting tour enables tour again.
	 */
	$('#agile-page-tour').click(function(e)
	{
		e.preventDefault();
		reinitialize_tour_on_current_route();
	});
});
/**
 * Performs operations like changing owner, adding tags and etc.. on contacts
 * bulk
 * 
 * @module Bulk operations
 * 
 * author: Rammohan
 */
var _BULK_CONTACTS = undefined;
var current_view_contacts_count = 0;
var SELECT_ALL = false;
$(function()
{

	/**
	 * Bulk operations - Change owner Shows all the users as drop down list to
	 * select one of them as the owner for the selected contacts.
	 */
	$("#bulk-owner").live('click', function(e)
	{
		e.preventDefault();

		var filter, id_array = [];
		if (SELECT_ALL == true)
			filter = getSelectionCriteria();
		else
			id_array = get_contacts_bulk_ids();

		// Bind a custom event to trigger on loading the form
		$('body').die('fill_owners').live('fill_owners', function(event)
		{
			var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
			fillSelect('ownerBulkSelect', '/core/api/users', 'domainUsers', 'no-callback ', optionsTemplate);
		});

		// Navigate to show form
		Backbone.history.navigate("bulk-owner", { trigger : true });

		/**
		 * Changes the owner by sending the new owner name as path parameter and
		 * contact ids as form data of post request
		 */
		$('#changeOwnerToBulk').die().live('click', function(e)
		{
			e.preventDefault();

			var $form = $('#ownerBulkForm');

			// Button Disabled or Validate Form failed
			if ($(this).attr('disabled')=='disabled' || !isValidForm($form))
			{
				return;
			}
			
			var saveButton=$(this);
			
			disable_save_button(saveButton);
			// Show loading symbol until model get saved
			//$('#ownerBulkForm').find('span.save-status').html(LOADING_HTML);

			var url;

			var new_owner = $('#ownerBulkSelect option:selected').attr('value');
			url = '/core/api/bulk/update?action_type=CHANGE_OWNER&owner=' + new_owner;
			var json = {};
			json.contact_ids = id_array;
			postBulkOperationData(url, json, $form, undefined, function(data){
				enable_save_button(saveButton);
			}, 'Contacts owner change scheduled')
		});
	});

	/**
	 * Bulk operations - Adds to campaign Shows all the workflows as drop down
	 * list to select one of them to subscribe the selected contacts
	 */
	$("#bulk-campaigns").live('click', function(e)
	{
		e.preventDefault();

		var id_array = [];
		var filter;
		if (SELECT_ALL == true)
			filter = getSelectionCriteria();
		else
			id_array = get_contacts_bulk_ids();

		console.log(filter);

		$('body').die('fill_campaigns').live('fill_campaigns', function(event)
		{
			var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
			fillSelect('campaignBulkSelect', '/core/api/workflows', 'workflow', 'no-callback ', optionsTemplate);
		});

		// Navigate to show form
		Backbone.history.navigate("bulk-campaigns", { trigger : true });

		/**
		 * Subscribes the selected contacts to a campaign by sending the
		 * workflow id and selected contacts' ids.
		 */
		$('#addBulkTocampaign').die().live('click', function(e)
		{
			e.preventDefault();

			var $form = $('#campaignsBulkForm');

			// Button Disabled or Validate Form Failed
			if ($(this).attr('disabled')=='disabled' || !isValidForm($form))
			{
				return;
			}
			
			var saveButton=$(this);

			disable_save_button(saveButton);
			// Show loading symbol until model get saved
			//$('#campaignsBulkForm').find('span.save-status').html(LOADING_HTML);

			var workflow_id = $('#campaignBulkSelect option:selected').attr('value');
			var url = '/core/api/bulk/update?workflow_id=' + workflow_id + "&action_type=ASIGN_WORKFLOW";

			var json = {};
			json.contact_ids = id_array;
			postBulkOperationData(url, json, $form,undefined,function(data){
				enable_save_button(saveButton);
			}, 'Campaign assigning scheduled');
		});

	});

	/**
	 * Bulk operations - Adds tags' Shows the existing tags with help of
	 * typeahead to add tags to the selected contacts. Also we can add new tags.
	 */
	$("#bulk-tags").live('click', function(e)
	{
		e.preventDefault();

		var id_array = get_contacts_bulk_ids();

		// var tags = get_tags('tagsBulkForm');

		Backbone.history.navigate("bulk-tags", { trigger : true });

		setup_tags_typeahead();
		
		$('#addBulkTags').on( "focusout", function(e){
			e.preventDefault();
			var tag_input = $(this).val().trim();
			$(this).val("");
			if(tag_input && tag_input.length>=0 && !(/^\s*$/).test(tag_input))
			{
				$('#addBulkTags').closest(".control-group").find('ul.tags').append('<li class="tag" style="display: inline-block;" data="'+tag_input+'">'+tag_input+'<a class="close" id="remove_tag" tag="'+tag_input+'">&times</a></li>');
			}
			
		});
		/**
		 * Add the tags to the selected contacts by sending the contact ids and
		 * tags through post request to the appropriate url
		 */
		$('#addTagsToContactsBulk').die().live('click', function(e)
		{
			e.preventDefault();

			var tags = get_tags('tagsBulkForm');

			// To add input field value as tags
			var tag_input = $('#addBulkTags').val().trim();
			$('#addBulkTags').val("");
			
			if(tag_input && tag_input.length>=0 && !(/^\s*$/).test(tag_input))
			{
				$('#addBulkTags').closest(".control-group").find('ul.tags').append('<li class="tag" style="display: inline-block;" data="'+tag_input+'">'+tag_input+'<a class="close" id="remove_tag" tag="'+tag_input+'">&times</a></li>');
			}
			
		//	$('#addBulkTags').closest(".control-group").find('ul.tags').append('<li class="tag" style="display: inline-block;" data="'+tag_input+'">'+tag_input+'<a class="close" id="remove_tag" tag="'+tag_input+'">&times</a></li>');
			
			
			
			if(tag_input != "")
				tags[0].value.push(tag_input);

			if (tags[0].value.length > 0)
			{
				// Show loading symbol until model get saved
				var saveButton=$(this);

				disable_save_button(saveButton);
				
				//$('#tagsBulkForm').find('span.save-status').html(LOADING_HTML);

				var url = '/core/api/bulk/update?action_type=ADD_TAG';
				var json = {};
				json.data = JSON.stringify(tags[0].value);
				json.contact_ids = id_array;

				postBulkOperationData(url, json, $('#tagsBulkForm'), undefined, function(data)
				{
					enable_save_button(saveButton);
					// Add the added tags to the collection of tags
					$.each(tags[0].value, function(index, tag)
					{
						tagsCollection.add({ "tag" : tag });
					});
				}, 'Tags add scheduled');
			}
			else 
			{
				$('#addBulkTags').focus();
				$('.error-tags').show().delay(3000).hide(1);
				return;
			}
		});
	});
	
	
	/**
	 * Bulk operations - Adds tags' Shows the existing tags with help of
	 * typeahead to add tags to the selected contacts. Also we can add new tags.
	 */
	$("#bulk-tags-remove").live('click', function(e)
	{
		e.preventDefault();

		var id_array = get_contacts_bulk_ids();

		// var tags = get_tags('tagsBulkForm');

		Backbone.history.navigate("bulk-tags-remove", { trigger : true });

		setup_tags_typeahead();
		
		$('#removeBulkTags').on( "focusout", function(e){
			e.preventDefault();
			var tag_input = $(this).val().trim();
			$(this).val("");
			if(tag_input && tag_input.length>=0 && !(/^\s*$/).test(tag_input))
			{
				$(this).closest(".control-group").find('ul.tags').append('<li class="tag" style="display: inline-block;" data="'+tag_input+'">'+tag_input+'<a class="close" id="remove_tag" tag="'+tag_input+'">&times</a></li>');
			}
			
		});
		/**
		 * Add the tags to the selected contacts by sending the contact ids and
		 * tags through post request to the appropriate url
		 */
		$('#removeTagsToContactsBulk').die().live('click', function(e)
		{
			e.preventDefault();

			var tags = get_tags('tagsRemoveBulkForm');

			// To add input field value as tags
			var tag_input = $('#removeBulkTags').val().trim();
			$('#removeBulkTags').val("");
			
			if(tag_input && tag_input.length>=0 && !(/^\s*$/).test(tag_input))
			{
				$('#removeBulkTags').closest(".control-group").find('ul.tags').append('<li class="tag" style="display: inline-block;" data="'+tag_input+'">'+tag_input+'<a class="close" id="remove_tag" tag="'+tag_input+'">&times</a></li>');
			}
			
		//	$('#addBulkTags').closest(".control-group").find('ul.tags').append('<li class="tag" style="display: inline-block;" data="'+tag_input+'">'+tag_input+'<a class="close" id="remove_tag" tag="'+tag_input+'">&times</a></li>');
			
			
			
			if(tag_input != "")
				tags[0].value.push(tag_input);

			if (tags[0].value.length > 0)
			{
				// Show loading symbol until model get saved
				var saveButton=$(this);

				disable_save_button(saveButton);
				
				//$('#tagsBulkForm').find('span.save-status').html(LOADING_HTML);

				var url = '/core/api/bulk/update?action_type=REMOVE_TAG';
				var json = {};
				json.data = JSON.stringify(tags[0].value);
				json.contact_ids = id_array;

				postBulkOperationData(url, json, $('#tagsRemoveBulkForm'), undefined, function(data)
				{
					enable_save_button(saveButton);
					// Add the added tags to the collection of tags
					$.each(tags[0].value, function(index, tag)
					{
						tagsCollection.add({ "tag" : tag });
					});
				}, 'Tags delete scheduled');
			}
			else 
			{
				$('#removeBulkTags').focus();
				$('.error-tags').show().delay(3000).hide(1);
				return;
			}
		});
	});



	/**
	 * Bulk operations - Sends email to the bulk of contacts by
	 * filling up the send email details like from, subject and
	 * body.
	 */
	$("#bulk-email").live('click', function(e)
	{
		e.preventDefault();
		
		var count = 0;
		
		// Selected Contact ids
		var id_array = get_contacts_bulk_ids();
		
		$('body').die('fill_emails').live('fill_emails', function(event)
		{

			var $emailForm = $('#emailForm');
			
			// Populate from address and templates
			populate_send_email_details();
			
			// Setup HTML Editor
			setupTinyMCEEditor('textarea#email-body');
			
			// when SELECT_ALL is true i.e., all contacts are selected.
			if(id_array.length === 0)
			   count = getAvailableContacts();
			else
				count = id_array.length;
			
			// Shows selected contacts count in Send-email page.
			$emailForm.find('div#bulk-count').css('display','inline-block');
			$emailForm.find('div#bulk-count p').html("Selected <b>"+count+" contacts</b> for sending email.");				

			// Hide to,cc and bcc
			$emailForm.find('input[name="to"]').closest('.control-group').attr('class','hidden');
			$emailForm.find('a#cc-link').closest('.control-group').attr('class','hidden');
			
			// Change ids of Send and Close button, to avoid normal send-email actions.
			$emailForm.find('.form-actions a#sendEmail').removeAttr('id').attr('id','bulk-send-email');
			$emailForm.find('.form-actions a#send-email-close').removeAttr('id');

		});
		
		Backbone.history.navigate("bulk-email", { trigger : true });
		
		$('#bulk-send-email').die().live('click',function(e){
			e.preventDefault();
			
			if($(this).attr('disabled'))
		   	     return;
			
			 var $form = $('#emailForm');
			 
			// Is valid
			if(!isValidForm($form))
		      	return;
			
			// Disables send button and change text to Sending...
			disable_send_button($(this));
			
			// Saves tinymce content to textarea
			save_content_to_textarea('email-body');
			
			// serialize form.
			var form_json = serializeForm("emailForm");
			
			var url = '/core/api/bulk/update?action_type=SEND_EMAIL';
			
			var json = {};
			json.contact_ids = id_array;
			json.data = JSON.stringify(form_json);
			
			postBulkOperationData(url, json, $form, null, function(){ 
				enable_send_button($('#bulk-send-email'));}, "Emails have been queued for " + count +" contacts. They will be sent shortly.");
		});
		
	});

	/**
	 * Bulk Operations - Exports selected contacts in a CSV file as an attachment 
	 * to email of current domain user.
	 **/
	$("#bulk-contacts-export").live('click', function(e)
			{
				e.preventDefault();

				// Removes if previous modals exist.
				if ($('#contacts-export-csv-modal').size() != 0)
				{
					$('#contacts-export-csv-modal').remove();
				}
				
				// Selected Contact ids
				var id_array = get_contacts_bulk_ids();
				
				var count = 0;

				// when SELECT_ALL is true i.e., all contacts are selected.
				if(id_array.length === 0)
				   count = getAvailableContacts();
				else
					count = id_array.length;

				var contacts_csv_modal = $(getTemplate('contacts-export-csv-modal'),{});
				//$(contacts_csv_modal).find('.export-contacts-count').html("<b>"+count+" contacts</b>");
				contacts_csv_modal.modal('show');
				
				// If Yes clicked
				$('#contacts-export-csv-confirm').die().live('click',function(e){
					e.preventDefault();
					
					if($(this).attr('disabled'))
				   	     return;
					
					$(this).attr('disabled', 'disabled');
					
				  // Shows message
				    $save_info = $('<img src="img/1-0.gif" height="18px" width="18px"></img>&nbsp;&nbsp;<span><small class="text-success" style="font-size:15px; display:inline-block"><i>Email will be sent shortly.</i></small></span>');
				    $(this).parent('.modal-footer').find('.contacts-export-csv-message').append($save_info);
					$save_info.show();
					
					var url = '/core/api/bulk/update?action_type=EXPORT_CONTACTS_CSV';
					
					var json = {};
					json.contact_ids = id_array;
					json.data = JSON.stringify(CURRENT_DOMAIN_USER);
					postBulkOperationData(url, json, undefined, undefined, function(){

						// hide modal after 3 secs
						setTimeout(function(){contacts_csv_modal.modal('hide');}, 3000);
						
						// Uncheck contacts table and hide bulk actions button.
						$('body').find('#bulk-actions').css('display', 'none');
						$('body').find('#bulk-select').css('display', 'none');
						$('table#contacts').find('.thead_check').removeAttr('checked');
						$('table#contacts').find('.tbody_check').removeAttr('checked');
						
					}, "no_noty");
				});

			});
	

	$("#select-all-available-contacts").die().live('click', function(e)
	{
				e.preventDefault();
				SELECT_ALL = true;
				_BULK_CONTACTS = window.location.hash;
				$('body')
						.find('#bulk-select')
						.css('display', 'block')
						.html(
								'Selected All ' + getAvailableContacts() + ' contacts. <a hrer="#" id="select-all-revert" style="cursor:pointer">Select chosen contacts only</a>');

				// On choosing select all option, all the visible
				// checkboxes in the table should be checked
				$.each($('.tbody_check'), function(index, element)
				{
					$(element).attr('checked', "checked");
				});
	});

	$("#select-all-revert").die().live('click', function(e)
	{
						e.preventDefault();
						SELECT_ALL = false;
						_BULK_CONTACTS = undefined;

						$('body').find('#bulk-select').css('display', 'block').html(
										"Selected " + App_Contacts.contactsListView.collection.length + " contacts. <a href='#'  id='select-all-available-contacts' >Select all " + getAvailableContacts() + " contacts</a>");
	});
	
});

/**
 * Gets an array of contact ids to perform bulk operations
 * 
 * @method get_contacts_bulk_ids
 * @returns {Array} id_array of contact ids
 */
function get_contacts_bulk_ids()
{
	var id_array = [];
	if (SELECT_ALL == true)
		return id_array;

	var table = $('body').find('.showCheckboxes');

	if ($(".grid-view").length != 0)
	{
		$(table).find('.tbody_check').each(function(index, element)
		{
			// If element is checked add store it's id in an array
			if ($(element).is(':checked'))
			{
				id_array.push($(element).parent('div').attr('id'));
			}
		});

		return id_array;
	}

	$(table).find('tr .tbody_check').each(function(index, element)
	{

		// If element is checked add store it's id in an array
		if ($(element).is(':checked'))
		{
			id_array.push($(element).closest('tr').data().get('id'));
		}
	});
	return id_array;
}

/**
 * Shows bulk actions drop down menu (of contacts table) only when any of the
 * check box is enabled.
 * 
 * @method toggle_contacts_bulk_actions_dropdown
 * @param {Object}
 *            clicked_ele clicked check-box element
 */
function toggle_contacts_bulk_actions_dropdown(clicked_ele, isBulk, isCampaign)
{
	SELECT_ALL = false;
	_BULK_CONTACTS = undefined;
	
	// For Active Subscribers table
	if(isCampaign === "active-campaign")
	{
		toggle_active_contacts_bulk_actions_dropdown(clicked_ele,isBulk);
		return;
	}
	
	var total_available_contacts = getAvailableContacts();

	console.log(readCookie('contact_filter'));
	$('body').find('#bulk-select').css('display', 'none')
	if ($(clicked_ele).attr('checked') == 'checked')
	{
		$('body').find('#bulk-actions').css('display', 'block');

		if (isBulk && total_available_contacts != App_Contacts.contactsListView.collection.length)
			$('body')
					.find('#bulk-select')
					.css('display', 'block')
					.html(
							"Selected " + App_Contacts.contactsListView.collection.length + " contacts. <a id='select-all-available-contacts' href='#'>Select all " + total_available_contacts + " contacts</a>");
	}
	else
	{
		if (isBulk)
		{
			$('#bulk-actions').css('display', 'none');
			return;
		}

		var check_count = 0
		$.each($('.tbody_check'), function(index, element)
		{
			if ($(element).is(':checked'))
			{
				check_count++;
				return false;
			}
			// return;
		});

		if (check_count == 0)
		{
			$('#bulk-actions').css('display', 'none');
		}
	}
}

/**
 * Returns number of available contacts, which is read from count field in first
 * contact in the collection. If count variable in not available in first
 * contact then collection length is returned
 * 
 * @returns
 */
function getAvailableContacts()
{
	if (App_Contacts.contactsListView.collection.toJSON()[0] && App_Contacts.contactsListView.collection.toJSON()[0].count)
	{
		//
		current_view_contacts_count = App_Contacts.contactsListView.collection.toJSON()[0].count;
		return current_view_contacts_count;
	}

	return App_Contacts.contactsListView.collection.toJSON().length;
}

/**
 * Returns selection criteria. Reads filter cookie, if filter cookie is not
 * available, it returns window hash(to check whether tag filter is applied on
 * it)
 * 
 * @returns
 */
function getSelectionCriteria()
{
	// Reads filter cookie
	var filter_id = readCookie('contact_filter');

	if (filter_id)
	{
		return filter_id;
	}
	// If filter cookie is not available then it returns either '#contacts' of
	// '#tags/{tag}' according to current window hash
	if (_BULK_CONTACTS)
	{
		return _BULK_CONTACTS;
	}
}

/**
 * Posts filter id. It takes url to post, the data 
 * @param url
 * @param data
 * @param form
 * @param contentType
 * @param callback
 */
function postBulkOperationData(url, data, form, contentType, callback, error_message)
{
	if (data.contact_ids && data.contact_ids.length == 0)
	{
		console.log(data.contact_ids);
		console.log(getSelectionCriteria());
		url = url + "&filter=" + encodeURIComponent(getSelectionCriteria());
		console.log(url);
	}
	else
		data.contact_ids = JSON.stringify(data.contact_ids);

	contentType = contentType != undefined ? contentType : "application/x-www-form-urlencoded"

	// Ajax request to post data
	$.ajax({ url : url, type : 'POST', data : data, contentType : contentType, success : function(data)
	{

		$save_info = $('<div style="display:inline-block"><small><p class="text-success"><i>Task Scheduled.</i></p></small></div>');

		if(form !== undefined)
		{
			var save_msg=$(form).find('.form-actions');
		
			if(save_msg.find('.text-success'))
				save_msg.find('.text-success').parent().parent().remove(); // erase previous message.

			save_msg.append($save_info);
		}

		if (callback && typeof (callback) === "function")
			callback(data);

		// On save back to contacts list
		Backbone.history.navigate("contacts", { trigger : true });  
		
		// If no_noty is given as error message, neglect noty
		if(error_message === "no_noty")
			return;
		
		if(!error_message)
			{
				showNotyPopUp('information', "Task scheduled", "top", 5000);
				return;
			}
			showNotyPopUp('information', error_message, "top", 5000);
	} });
}
/**
 * table-checkboxes.js Prepends check-boxes to each row of desired tables (which are 
 * having showCheckboxes class), in order to perform bulk operations (Delete, Change owner etc..)
 * 
 * @module Bulk operations
 * ---------------------------------------------
 * author: Rammohan
 *  
 */
$(function(){	
	
   /**
    * Custom event to add check-boxes to specified tables
    * Prepends check-boxes to the tables which are having the class showCheckboxes, 
    * by triggering the event agile_collection_loaded from base-collection render event, while loading the collection.
    */ 	
	$('body').live('agile_collection_loaded', function(event, el) {
		
		var table_element = $('table', el);
		
		  // Adds class to tbody to edit the table by validating the route attribute 
		if($(table_element).find('tbody').attr('route'))
			$(table_element).find('tbody').addClass('agile-edit-row');
		
		if($(table_element).hasClass('onlySorting'))
		{	
		    sort_tables(table_element);
		    return;
		}
		
		if($('.grid-view', el).hasClass('showCheckboxes'))
		{
			if($(this).find('#delete-checked-grid').length == 0)
					var element = $('.showCheckboxes').after('<div class="row-fluid"><div class="span6 select-none"></div></div><a href="#" class="btn btn-danger left" id="delete-checked-grid" style="margin-bottom: 15px"> Delete</a>');		
			console.log(element);
			return;
		}
		
		
		var table = $(el).find('table.showCheckboxes');
		$(table).removeClass('table-bordered');
		$(table).closest('div.data-block').removeClass('data-block');
		
	
		//$(table).setAttribute('id', 'sort-table');

		var table_body_row = $(table).find('tbody tr');
		var table_header_row = $(table).find('thead tr');

		var table_headers = $(table_header_row).find('.thead_check');
		var table_cell = $(table_body_row).find('.tbody_check');

		
		// Remove, if rendere of a collection is called multiple times 
		if(table_headers.length == 0)
			$(table_header_row).prepend('<th><input class="thead_check" type="checkbox"/></th>');
		
		if(table_cell.length == 0)
			$(table_body_row).prepend('<td style="cursor:default;"><input class="tbody_check" type="checkbox"/></td>');	  
		
		$(el).find('#delete-checked').remove();
		
		$(table).after('<div class="row-fluid"><div class="span6  select-none"></div></div><a href="#" class="btn btn-danger left" id="delete-checked" style="margin-bottom: 15px"> Delete</a>');
			
		if($(table_element).hasClass('no-sorting'))
		{	
		    console.log(table_element);
		    return;
		}

		// Sorts the tables based on their column values
		sort_tables(table_element);
	});

   /**
    * Select all - Enables/Disables all check-boxes of table body when table head check-box is clicked 
    * Changes the checking status of table body check-boxes according to 
    * the status of table head check-box
    */	
	$('.thead_check').live('click', function(event){
		console.log( $(this).is(':checked'));
		if(!$(this).attr('checked'))
		{
			$('.tbody_check').removeAttr('checked');
			toggle_contacts_bulk_actions_dropdown(undefined, true,$(this).parents('table').attr('id'));
			
		}
		else
			$('.tbody_check').attr('checked', 'checked');
	
		console.log($(this).attr('checked'));
		
		// Show bulk operations only when thead check box is checked
		toggle_contacts_bulk_actions_dropdown(this, true,$(this).parents('table').attr('id'));
		
	});
	
   /**
    * Stops the propagation of default functionality (editing the entity) of parent to the check-box (tr)
    * and shows the bulk-actions drop down of contacts only when 
    * there is at least one check-box checked.
    */	
	$('.tbody_check').live('click', function(event){
		event.stopPropagation();
		
		toggle_contacts_bulk_actions_dropdown(this,false,$(this).parents('table').attr("id"));
	});
});

function append_checkboxes(el)
{
	var checkbox_element = $('tr:last > td.select_checkbox', el);
	if(checkbox_element.length != 0)
	{
		if(SELECT_ALL == true)
		$('.tbody_check', checkbox_element).attr('checked', 'checked');
		
		return;
	}

		
	// If select all is chosen then all the upcomming models with in table should have checked checkboxes
	if(SELECT_ALL == true)
		$('tr:last', el).prepend('<td><input class="tbody_check" type="checkbox" checked="checked"/></td>');
	else
		$('tr:last', el).prepend('<td><input class="tbody_check" type="checkbox"/></td>');	
}/**
 * Sorts the table based on its column values. For each table the sort_tables
 * function is called from the custom event 'agile_collection_loaded', which is
 * triggered form base-collection render function.
 * 
 * When the table is loaded, it is in its default order and no arrow marks
 * appeared at column headings. When the mouse is hovered on any heading of the
 * column an arrow mark (bright color) will be shown to indicate that the table
 * can be sorted on that column values. When the heading is clicked, the table
 * will get sorted on that particular column values and a permanent arrow mark
 * (shaded color) will be shown to indicate, the table is sorted on that
 * particular column values (up-arrow -> ascending order, down-arrow ->
 * descending order)
 * 
 * @method sort_tables
 * @param {Object}
 *            table as html object
 */
function sort_tables(table) {
	
	head.js(LIB_PATH + "lib/jquery.tablesorter.min.js", function() {

	    // add parser through the tablesorter addParser method to sort tasks based on priority
	    $.tablesorter.addParser({ 
	        // set a unique id 
	        id: 'priority', 
	        is: function(s) { 
	            // return false so this parser is not auto detected 
	            return false; 
	        }, 
	        format: function(s) { 
	            // format your data for normalization 
	            return s.toLowerCase().replace(/high/,2).replace(/normal/,1).replace(/low/,0); 
	        }, 
	        // set type, either numeric or text 
	        type: 'numeric' 
	    }); 
	    
	    // add parser through the tablesorter addParser method to sort based on date
	    $.tablesorter.addParser({ 
	        // set a unique id 
	        id: 'time-ago', 
	        is: function(s) { 
	            // return false so this parser is not auto detected 
	            return false; 
	        }, 
	        format: function(s, table, cell, cellIndex) { 
	        	// format your data for normalization
	        	var time = cell.getElementsByTagName("time");
	        	if(time)
	              return $(time).attr("value"); 
	        }, 
	        // set type, either numeric or text 
	        type: 'numeric' 
	    });
	    
	    // add parser through the tablesorter addParser method to sort deal based on value
	    $.tablesorter.addParser({ 
	        // set a unique id 
	        id: 'money', 
	        is: function(s) { 
	            // return false so this parser is not auto detected 
	            return false; 
	        }, 
	        format: function(s, table, cell) { 
	            // format your data for normalization 
	            return cell.getAttribute("value"); 
	        }, 
	        // set type, either numeric or text 
	        type: 'numeric' 
	    }); 
	 
		
	    var table_id = $(table).attr('id');
	    if(table_id == 'deal-list')
	    	{
	    		sort_deals(table);
	    		return;
	    	}
/*	    if(table_id == "task-list")
	    	{
	    		sort_tasks(table);
	    		return;
	    	}*/
	    if(table_id == "document-list")
    	{
    		sort_documents(table);
    		return;
    	}
	    if(table_id == "case-list")
    	{
    		sort_cases (table);
    		return;
    	}
	    if(table_id == "schedule-updates")
    	{
    		sort_schedule_updates(table);
    		return;
    	} 
	    
    	basic_table_sort(table);

	});
}

function basic_table_sort(table)
{
	   
	$(table).tablesorter({
		// Disable the sorting property to the first column of the table
		// (first colon contains check-boxes)
		// pass the headers argument and assign a object
		headers : {
			0 : {
				// disable it by setting the property sorter to false
				sorter : false
			}
		}
	});
}

function sort_tasks(table)
{
	$(table).tablesorter({ 
        headers: {
        	0 : {sorter : false},
        	1 : {sorter : false},
        	2 : {sorter : 'text'},
        	3 : {sorter : 'text'},
            4: {sorter:'priority'},
			5 : {sorter : 'time-ago'},
			6 : {sorter : false}
        } 
    }); 
}

function sort_deals(table)
{
	$(table).tablesorter({ 
        headers: { 
        	0 : {sorter : false	},
        	1 : {sorter : 'text'},
        	2 : {sorter : false},
        	3 : {sorter : 'money'},
        	4 : {sorter : 'text'},
			5 : {sorter : 'time-ago'},
        	6 : {sorter : false}
        }
    });
}

function sort_documents(table)
{
	$(table).tablesorter({ 
        headers: { 
        	0 : {sorter : false	},
        	1 : {sorter : 'text'},
        	2 : {sorter : false},
			3 : {sorter : 'time-ago'},
			4 : {sorter : false	}
        }
    });
}

function sort_cases(table)
{
	$(table).tablesorter({ 
        headers: { 
        	0 : {sorter : false	},
        	1 : {sorter : false},
        	2 : {sorter : 'text'},
			3 : {sorter : 'time-ago'},
			4 : {sorter : false	},
			5 : {sorter : 'text'}
        }
    });
}

function sort_schedule_updates(table)
{
	$(table).tablesorter({ 
        headers: {
        	0 : {sorter : false},
        	1 : {sorter : 'text'},
        	2 : {sorter : 'text'},
        	3 : {sorter : 'time-ago'},
            4 : {sorter:'text'}			
        } 
    }); 
}


/**
 * Handles the click event of any row of any table (whose 'tbody' has the class
 * 'agile-edit-row').
 * 
 * The class 'agile-edit-row' is added to the tbody (in the custom event
 * 'agile_collection_loaded', which is triggered while loading the collection),
 * when only the tbody has an attribute 'route' (specifies the path where to
 * navigate on clicking the row)
 * 
 */
$(function() {

	$('.agile-edit-row > tr > td:not(":first-child")').live('click', function(e) {
		e.preventDefault();
		
		var route = $('.agile-edit-row').attr('route')
		var data = $(this).closest('tr').find('.data').attr('data');

		console.log(data);
		if (data) {
			Backbone.history.navigate(route + data, {
				trigger : true
			});
		}
	});
});

/**
 * Deletes the selected row related entities from the database based on the url 
 * attribute of the table and fades out the rows from the table
 * 
 * @module Bulk operations
 * ---------------------------------------------
 * author: Rammohan 
 */

$(function(){	
   /**
    * Validates the checkbox status of each row in table body
    * Customizes the delete operation
    * Deletes the entities
    */	
	$('#delete-checked, .delete-checked-contacts').die().live('click', function(event){
		event.preventDefault();
		var id_array = [];
		var index_array = [];
		var data_array = [];
		var checked = false;
		var table = $('body').find('.showCheckboxes');

		$(table).find('tr .tbody_check').each(function(index, element){
			
			// If element is checked store it's id in an array 
			if($(element).is(':checked')){
				
				// Disables mouseenter once checked for delete(To avoid popover in deals when model is checked)
				$(element).closest('tr').on("mouseenter", false);
				index_array.push(index);
				id_array.push($(element).closest('tr').data().get('id'));
				data_array.push($(element).closest('tr').data().toJSON());
				checked = true;
			}
		});
		if(checked){
			
			// customize delete confirmation message
			if(!customize_delete_message(table))
				return;
			
			// Customize the bulk delete operations
			if(!customize_bulk_delete(id_array, data_array))
				return;
			
			
			$(this).after('<img class="bulk-delete-loading" style="padding-right:5px;margin-bottom:15px" src= "img/21-0.gif"></img>');
			
			var url = $(table).attr('url');
			if(SELECT_ALL == true)
			{
				if($(table).attr('id') == "contacts")
					url = url + "&filter=" + encodeURIComponent(getSelectionCriteria());
			}
			
			// For Active Subscribers table
			if(SUBSCRIBERS_SELECT_ALL == true){	
				if($(table).attr('id') == "active-campaign")
					url = url + "&filter=all-active-subscribers";
			}
			
			bulk_delete_operation(url, id_array, index_array, table, undefined, data_array);
		}	
		else
		{
			// if disabled return
			if($(this).attr('disabled') === "disabled")
				return;
			
			$('body').find(".select-none").html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">&times;</a>You have not selected any records to delete. Please select at least one record to continue.</div>').show().delay(3000).hide(1);
		}
			
	});
	
	
	
	/**
	    * Validates the checkbox status of each row in table body
	    * Customizes the delete operation
	    * Deletes the entities
	    */	
		$('#delete-checked-grid').die().live('click', function(event){
			event.preventDefault();
			var id_array = [];
			var index_array = [];
			var data_array = [];
			var checked = false;
			var table = $('body').find('.showCheckboxes');

			$(table).find('.tbody_check').each(function(index, element){
				
				// If element is checked store it's id in an array 
				if($(element).is(':checked')){
					
					console.log($(element).parent('div').attr('id'));
					index_array.push(index);
					console.log(index_array);
					id_array.push($(element).parent('div').attr('id'));
					//data_array.push($(element).parent('div').data().toJSON());
					checked = true;
				}
			});
			if(checked){
				
				if(!confirm("Are you sure you want to delete?"))
		    		return;
				// Customize the bulk delete operations
				if(!customize_bulk_delete(id_array, data_array))
					return;
				
				bulk_delete_operation($(table).attr('url'), id_array, index_array, table, true, data_array);
			}	
			else
	            $('body').find(".select-none").html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">&times;</a>You have not selected any records to delete. Please select at least one record to continue.</div>').show().delay(3000).hide(1);
				
		});
	
});

/**
 * Customizes the bulk delete operation of certain tables. For example,
 * in case of users table, this code verifies if each user is an admin or not before deleting them. 
 * Doesn't delete admins.
 * 
 * @method customize_bulk_delete
 * @param {Array} id_array holds the array of ids
 * @param {Array} data_array holds the array of entities
 * @returns {Boolean} 
 */
function customize_bulk_delete(id_array, data_array){
	if(Current_Route == 'users'){
		$.each(data_array, function(index, model){
			if(model.is_admin){
				id_array.splice(id_array.indexOf(model.id), 1);
			}	
		});
		if(id_array.length == 0){
			$('body').find(".select-none").html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">&times;</a>Sorry, can not delete user with <i>admin</i> privilege.</div>').show().delay(5000).hide(1);
			return false;
		}
	}
	return true;
}

/**
 * Bulk operations - delete function
 * Deletes the entities by sending their ids as form data of ajax POST request 
 * and then fades out the rows from the table
 * @method bulk_delete_operation
 * @param {Steing} url to which the request has to be sent
 * @param {Array} id_array holds array of ids of the entities to be deleted
 * @param {Array} index_array holds array of row indexes to be faded out
 * @param {Object} table content as html object
 * @param {Array} data_array holds array of entities 
 */
function bulk_delete_operation(url, id_array, index_array, table, is_grid_view, data_array){
	var json = {};
	json.ids = JSON.stringify(id_array);
		
	$.ajax({
		url: url,
		type: 'POST',
		data: json,
		success: function() {
			$(".bulk-delete-loading").remove();	
			
			if($(table).attr('id') == "contacts")
				showNotyPopUp('information', "Your contacts deletion will be processed shortly", "top", 5000);
			
			if(!is_grid_view)
			{
				var tbody = $(table).find('tbody');
				
				// To remove table rows on delete 
				for(var i = 0; i < index_array.length; i++) 
					$(tbody).find('tr:eq(' + index_array[i] + ')').fadeOut(300, function() { $(this).remove(); });				
			}
			else
			{
				// To remove table rows on delete 
				for(var i = 0; i < id_array.length; i++) 
					$("."+id_array[i]).fadeOut(300, function() { $(this).remove(); });				
			}
			
			$('.thead_check').attr("checked", false);
			
			// Show bulk operations only when thead check box is checked
			toggle_contacts_bulk_actions_dropdown(undefined, true,$('.thead_check').parents('table').attr('id'));
			
			// Tags re-fetching
			if(App_Contacts.contactsListView){
				setup_tags(App_Contacts.contactsListView.el);
			}
			
			// Removes the entities from timeline, if they are deleted from contact detail view
			if(App_Contacts.contactDetailView && Current_Route == "contact/"
				+ App_Contacts.contactDetailView.model.get('id')){
				
				// Activates "Timeline" tab and its tab content in contact detail view 
				activate_timeline_tab();
				
				$.each(data_array, function(index, data){
					var $removeItem = $( '#' + data.id );
					$('#timeline').isotope('remove', $removeItem);
				});
			}			
		}
	});
}

/**
 * Returns boolean value based on user action on confirmation message.
 * If OK is clicked returns true, otherwise false.
 * 
 * @param table - table object
 **/
function customize_delete_message(table)
{
	
	// Default message for all tables
	var confirm_msg = "Are you sure you want to delete?";
	
	// Appends campaign-name for active subscribers
	if($(table).attr('id') === "active-campaign")
		confirm_msg = "Delete selected contacts from " +$('#subscribers-campaign-name').text()+" Campaign?";

	// Shows confirm alert, if Cancel clicked, return false
	if(!confirm(confirm_msg))
		return false;
	
	// if OK clicked return true
	return true;
	
}/**
 * contact-filter.js defines functionalities to show filter in dropdown, events
 * on selecting filter, call to set cookie when filter is selected. Shows name
 * of the selected filter on dropdown button client side. This also defines
 * clone function, used while adding multiple filter conditions
 * 
 * @module Search author: Yaswanth
 */
var filter_name;

/**
 * Change name of input[name='temp'] to more random i.e. temp-<unique_number>.
 * This is necessary for showing correct validation errors when multiple entries with same field-name are on the page.
 * @param el
 */
var scrambled_index=0;
function scramble_input_names(el)
{
	el.find("input").each(function(){
		$(this).attr('name','temp-'+scrambled_index);
		$(this).addClass('required');
		scrambled_index+=1;
	});
}

$(function()
{
	CUSTOM_FIELDS = undefined;
	
	// Filter Contacts- Clone Multiple
	$(".filter-contacts-multiple-add").die().live('click', function(e)
	{
		e.preventDefault();
		// To solve chaining issue when cloned
		var htmlContent = $(getTemplate("filter-contacts", {})).find('tr').clone();
		
		scramble_input_names($(htmlContent));

		// boolean parameter to avoid contacts/not-contacts fields in form
		chainFilters(htmlContent, function(){
			
		}, false);

//		$(this).hide();
		// var htmlContent = $(this).closest("tr").clone();
		$(htmlContent).find("i.filter-contacts-multiple-remove").css("display", "inline-block");
		$(this).siblings("table").find("tbody").append(htmlContent);
	});
	
	
	

	// Filter Contacts- Remove Multiple
	$("i.filter-contacts-multiple-remove").die().live('click', function(e)
	{
		$(this).closest("tr").remove();
	});

	// Fetch filter result without changing route on click
	$('.filter').live('click', function(e)
	{

		e.preventDefault();
		eraseCookie('company_filter');

		var filter_id = $(this).attr('id');

		// Saves Filter in cookie
		createCookie('contact_filter', filter_id)

		// Gets name of the filter, which is set as data
		// attribute in filter
		filter_name = $(this).attr('data');

		CONTACTS_HARD_RELOAD=true;
		App_Contacts.contacts();
		return;
		// /removed old code from below,
		// now filters will work only on contact, not company
	});

	/*
	 * If default filter is selected, removes filter cookies an load contacts
	 * with out any query condition
	 */
	$('.default_filter').live('click', function(e)
	{
		e.preventDefault();
		revertToDefaultContacts();
	});

	$('.default_contact_remove_tag').die().live('click', function(e)
	{
		e.preventDefault();
		// Navigate to show form
		Backbone.history.navigate("contacts", { trigger : true });
	});

	$('#companies-filter').live('click', function(e)
	{

		e.preventDefault();
		eraseCookie('contact_filter');

		createCookie('company_filter', "Companies");
		CONTACTS_HARD_RELOAD = true;
		App_Contacts.contacts(); // /Show Companies list, explicitly hard
		// reload
		return;
		/*
		 * {{ OLD-CODE below }} if(readCookie('contact_view')) {
		 * App_Contacts.contact_custom_view.collection.url =
		 * "core/api/contacts/companies"
		 * App_Contacts.contact_custom_view.collection.fetch();
		 * //$('.filter-dropdown',
		 * App_Contacts.contact_custom_view.el).append(filter_name); } /* If
		 * contactsListView is defined (default view) then load filter results
		 * in default view
		 * 
		 * if(App_Contacts.contactsListView &&
		 * App_Contacts.contactsListView.collection) { // Set url to default
		 * view to load filter results
		 * App_Contacts.contactsListView.collection.url =
		 * "core/api/contacts/companies";
		 * App_Contacts.contactsListView.collection.fetch();
		 * //$('.filter-dropdown',
		 * App_Contacts.contactsListView.el).append(filter_name); }
		 */
	});

	$('.lhs_chanined_parent').die().live('change', function(e)
	{
		e.preventDefault();

		if (($(this).val()).indexOf('tags') != -1)
		{
			var element = $(this).closest('tr').find('div#RHS');
			addTagsDefaultTypeahead(element);
		}
	});
	
	$("#condition > select").die().live('change', function(e){
		e.preventDefault();

		if ($(this).find("option:selected").hasClass('tags'))
		{
			var element = $(this).parents().closest('tr').find('div#RHS');
			addTagsDefaultTypeahead(element);
		}
		
	})
	
	
});

/**
 * Sets up contact filters list in contacts list page, also whether cookie is
 * save with filter name to load filter results instead of all contacts
 * 
 * @method setupContactFilterList
 * @param cel
 *            Html form element to append filters list,
 */
var contactFiltersListView
function setupContactFilterList(cel, tag_id)
{
	if (tag_id)
		$('.filter-criteria', cel)
				.html(
						'<ul id="added-tags-ul" class="tagsinput" style="display: inline; vertical-align: top; margin-bottom: 10px"><li style="display: inline-block;" class="tag" data="developer"><span style="margin-left:5px">' + tag_id + '<a class="close default_contact_remove_tag" style="margin-left:5px">&times</a></span></li></ul>')

	contactFiltersListView = new Base_Collection_View(
			{
				url : '/core/api/filters',
				restKey : "ContactFilter",
				templateKey : "contact-filter-list",
				individual_tag_name : 'li',
				postRenderCallback : function(el)
				{
					var filter_name;
					// Set saved filter name on dropdown button
					if (filter_name = readCookie('contact_filter'))
					{
						/*
						 * Check whether filter contains recent of lead to set
						 * system filter names, to load results based on those
						 * filters
						 */
						if (filter_name.toLowerCase().indexOf('recent') >= 0)
							filter_name = "Recent";

						else if (filter_name.toLowerCase().indexOf('contacts') >= 0)
							filter_name = "My Contacts";

						else if (filter_name.toLowerCase().indexOf('leads') >= 0)
							filter_name = "Leads";

						// If is not system type get the name of the filter from
						// id(from cookie)
						else if (filter_name.indexOf("system") < 0)
							filter_name = contactFiltersListView.collection.get(filter_name).toJSON().name;

						el.find('.filter-dropdown').append(filter_name);
					}
					else if (filter_name = readCookie('company_filter'))
						el.find('.filter-dropdown').append(filter_name);

					if (!filter_name)
						return;

					$('.filter-criteria', cel)
							.html(
									'<ul id="added-tags-ul" class="tagsinput" style="display: inline; vertical-align: top; margin-bottom: 10px"><li style="display: inline-block;" class="tag" data="developer"><span style="margin-left:5px">' + filter_name + '<a class="close default_filter" style="margin-left:5px;">&times</a></span></li></ul>')
				} });

	// Fetchs filters
	contactFiltersListView.collection.fetch();

	var filter_dropdown_element = contactFiltersListView.render().el;

	// Shows in contacts list
	$('#filter-list', cel).html(contactFiltersListView.render().el);
}

/**
 * Removes filter from cookie and calls function to load default contacts
 * without filter
 */
function revertToDefaultContacts()
{
	// Erase filter cookie. Erases both contact and company filter
	eraseCookie('contact_filter');
	eraseCookie('company_filter');

	if (App_Contacts.contactsListView)
		App_Contacts.contactsListView = undefined;
	if (App_Contacts.contact_custom_view)
		App_Contacts.contact_custom_view = undefined;

	// Loads contacts
	App_Contacts.contacts();
}

/**
 * Chains fields using jquery.chained library. It deserialzed data into form
 * 
 * @param el
 */
function chainFilters(el, data, callback, is_webrules)
{
	if(!CUSTOM_FIELDS)
	{
		$("#content").html(LOADING_HTML);
		fillCustomFieldsInFilters(el, function(){
			show_chained_fields(el, data, true);
			if (callback && typeof (callback) === "function")
			{
				// execute the callback, passing parameters as necessary
				callback();
			}
		}, is_webrules)
		return;
	}
	
	fillCustomFields(CUSTOM_FIELDS, el)
	show_chained_fields(el, data);
	if (callback && typeof (callback) === "function")
	{
		// execute the callback, passing parameters as necessary
		callback();
	}
	
}

function show_chained_fields(el, data, forceShow)
{
	var el_self = $(el).clone();
	var LHS, condition, RHS, RHS_NEW, NESTED_CONDITION, NESTED_RHS, NESTED_LHS;

	// LHS, RHS, condition blocks are read from DOM
	LHS = $("#LHS", el);
	condition = $("#condition", el);
	RHS = $("#RHS", el);

	// Extra field required for (Between values condition)
	RHS_NEW = $("#RHS-NEW", el);

	NESTED_CONDITION = $("#nested_condition", el);
	NESTED_RHS = $("#nested_rhs", el);
	NESTED_LHS = $("#nested_lhs", el);
	
	// Chaining dependencies of input fields with jquery.chained.js
	RHS.chained(condition, function(chained_el, self){
		var selected_field = $(chained_el).find('option:selected');
		var placeholder = $(selected_field).attr("placeholder");
		var is_custom_field = $(selected_field).hasClass("custom_field");
		
		var field_type = $(selected_field).attr("field_type");
		
		// If there are any select fields without option elements they should be removed
		$("select", self).each(function(index, value){
			if($("option", value).length == 0)
				$(this).remove();
		})
		
		if(placeholder)
		{
			$("input", self).attr("placeholder", placeholder);
		}
		if(field_type && field_type == 'LIST')
		{
			var field_name = $(selected_field).attr("field_name");
			
			$("input", self).remove();
			$($('select[name="'+field_name+'"]', self)[0]).show();
		}
		
		
	});
	condition.chained(LHS);
	
	RHS_NEW.chained(condition);
	NESTED_CONDITION.chained(LHS);
	NESTED_LHS.chained(NESTED_CONDITION);
	NESTED_RHS.chained(NESTED_CONDITION);



	if(data && data.rules)
		deserializeChainedSelect($(el).find('form'), data.rules, el_self.find('form'));
	
	// If LHS selected is tags then typeahead is enabled on rhs field
	if ($(':selected', LHS).val() && ($(':selected', LHS).val()).indexOf('tags') != -1)
	{
		addTagsDefaultTypeahead(RHS)
	}

	// If there is a change in lhs field, and it has tags in it then tags are
	// loaded into its respective RHS block
	$('.lhs', el).die().live('change', function(e)
	{
		e.preventDefault();
		var value = $(this).val();

		if (value.indexOf('tags') != -1)
		{
			addTagsDefaultTypeahead($(this).closest('td').siblings('td.rhs-block'));
		}

	})
}

/**
 * Added tags typeahead on fields
 * 
 * @param element
 */
function addTagsDefaultTypeahead(element)
{
	var tags_array = [];

	// 'TAGS' are saved in global variable when they are fetched to show stats
	// in contacts page. If it is undefined, tags are fetched from DB an then type ahead is built
	if (!TAGS)
	{
		var TagsCollection = Backbone.Collection.extend({ url : '/core/api/tags', sortKey : 'tag' });

		tagsCollection = new TagsCollection();

		tagsCollection.fetch({ success : function(data)
		{
			TAGS = tagsCollection.models;
			addTagsArrayasTypeaheadSource(tagsCollection.toJSON(), element);

		} });
		return;
	}

	// Adds typeahead to given element
	addTagsArrayasTypeaheadSource(tagsCollection.toJSON(), element);
}

// With tags JSON sent type ahead is built on input fields
function addTagsArrayasTypeaheadSource(tagsJSON, element)
{
	var tags_array = [];

	$.each(tagsJSON, function(index, element)
	{
		tags_array.push(element.tag.toString());
	});

	// $("input", element).attr("data-provide","typeahead");
	$("input", element).typeahead({ "source" : tags_array }).attr('placeholder', "Enter Tag").width("92%");
}


function fillCustomFieldsInFilters(el, callback, is_webrules)
{

	$.getJSON("core/api/custom-fields/searchable/scope?scope=CONTACT", function(fields){
		console.log(fields);
		CUSTOM_FIELDS = fields;
		fillCustomFields(fields, el, callback, is_webrules)
	})
}

function fillCustomFields(fields, el, callback, is_webrules)
{
	var lhs_element = $("#LHS > select > #custom-fields", el);
	var rhs_element = $("#RHS", el);
	var condition = $("#condition > select", el);

	for(var i = 0; i < fields.length ; i++)
	{
		if(i == 0)
			lhs_element.show();
		var field = fields[i];

		if(field.field_type == "DATE")
		{
			lhs_element.append('<option value="'+field.field_label+'_time" field_type="'+field.field_type+'">'+field.field_label+'</option>');
			condition.find("option.created_time").addClass(field.field_label+'_time');
		}
		else
		{
			lhs_element.append('<option value="'+field.field_label+'" field_type="'+field.field_type+'" >'+field.field_label+'</option>');
		}
		condition.append('<option value="EQUALS" class="'+field.field_label+' custom_field" field_type="'+field.field_type+'" field_name="'+field.field_label+'">is</option>');
		condition.append('<option value="NOTEQUALS" class="'+field.field_label+' custom_field" field_type="'+field.field_type+'" field_name="'+field.field_label+'">isn\'t</option>');
		
		// Contacts and not contains should only be in webrules form
		if(is_webrules)
		{
			condition.append('<option value="MATCHES" class="'+field.field_label+' custom_field" field_name="'+field.field_label+'">contains</option>');
			condition.append('<option value="NOT_CONTAINS" class="'+field.field_label+' custom_field" field_name="'+field.field_label+'">doesn\'t contain</option>');
		}
		
		if(field.field_type == "LIST")
		{
			var custom_list_values = field.field_data.split(";");
			el = "<select style='display:none' name='"+field.field_label+"'>"
			for(var j = 0; j < custom_list_values.length; j++)
			{
				
				el = el + '<option value="'+custom_list_values[j]+'" class="EQUALS NOTEQUALS MATCHES NOT_CONTAINS" field_type="'+field.field_type+'">'+custom_list_values[j]+'</option>';
			}
			el = el +"</select>";
			rhs_element.append(el);
		}
		console.log(rhs_element[0]);
	}
	
	if (callback && typeof (callback) === "function")
	{
		// execute the callback, passing parameters as necessary
		callback();
	}
}/**
 * Search.js is a used to show typeahead results in different page and also
 * initialized typeahead on search field in navbar client side.
 * 
 * @module Search author: Yaswanth
 */

/**
 * showSearchResults method is used to show the simple search/ typeahead results
 * in a separate page
 * 
 * @method showSearchResults
 */
function showSearchResults()
{
	/*
	 * Reads query keyword from input field to send a query request and show in
	 * separate page.
	 */
	var query_text = $("#searchText").val();

	// If keyword/input field is empty returns with out querying
	if (query_text == "")
		return;

	/*
	 * If App_Contacts route is not initialized, initializes it because
	 * typeahead can be accessed without entering in to contacts list view
	 */
	if (!App_Contacts)
		App_Contacts = new ContactsRouter();

	// Initialize contacts search results view
	App_Contact_Search.navigate("contacts/search/" + query_text, { trigger : true });
}

function navigateToDetailsPage(data, name)
{
	var model;
	for ( var i = 0; i < QUERY_RESULTS.length; i++)
	{
		if (QUERY_RESULTS[i].id != data)
			continue;

		model = QUERY_RESULTS[i];
		break;
	}
	console.log(model);
	if (model.entity_type == "contact_entity")
	{
		App_Contacts.navigate("contact/" + data, { trigger : true });
		return;
	}
	if(model.entity_type == "deal")
	{
		console.log(model);
		updateDeal(new BaseModel(model));
		return;
	}
	if(model.entity_type == "document")
	{
		console.log(model);
		updateDocument(new BaseModel(model));
		return;
	}
		updatecases(new BaseModel(model));
}

/**
 * Initializes typeahead functionality on search field in top navbar, and
 * defines event action on the filed
 */
$(function()
{

	/*
	 * Enables typeahead in search field in top nav-bar, custom callback to
	 * redefine events on dropdown, which takes to contact details page
	 */
	agile_type_ahead("searchText", undefined, contacts_typeahead, navigateToDetailsPage, undefined, undefined, 'core/api/search/all/');

	/*
	 * Click on search icon in search field top nav-bar, shows simple search
	 * results in separate page
	 */
	$("#search-results").live('click', function(e)
	{
		e.preventDefault();
		showSearchResults();
	});
});
/* functions related to audio */

/**
 * Add audio tag in home.jsp after SIP registration is done successfully.
 * It is required for Voice in Call. It is SIP API requirement.
 */
function addAudio() {
	var audioElmt = document.getElementById("audio_remote");

	// Already added.
	if (audioElmt != undefined)
		return;
	else if (audioElmt == undefined) // not added.
	{
		// add audio
		$('body')
				.append(
						'<!-- Sip Audios --><audio id="audio_remote" autoplay="autoplay" />');
	}
}

/**
 * On incoming call it starts. On outgoing call after remote connect it will
 * starts.
 */
function startRingTone(sound) {
	try {
		Sip_Audio = new Audio("../res/" + sound + ".mp3");
		if (typeof Sip_Audio.loop == 'boolean') {
			Sip_Audio.loop = true;
		} else {
			var onEnded = function() {
				//console.log("play");
				this.play();
			};

			Sip_Audio.addEventListener('ended', onEnded, false);
		}

		Sip_Audio.play();
	} catch (e) {
		console.log("Error Sip_Audio can not play.");
	}
}

/**
 * Incoming call: After receive / missed / ignore from user and on error it
 * stops. Outgoing call: After received / missed / ignored from callee and on
 * error it stops.
 */
function stopRingTone() {
	try {
		Sip_Audio.pause();
	} catch (e) {
		console.log("Error Sip_Audio can not stop.");
	}
}
/**
 * Onclick of number buttons in dialpad, It send dtmf tone to SIP and will play
 * sound on success.
 * 
 * @param c
 */
function sipSendDTMF(digit)
{
	//console.log("sipSendDTMF: " + digit);

	// session for call is active and number is available.
	if (Sip_Session_Call && digit)
	{
		// play sound.
		play_sound("dtmf");
		
		// send dtmf on SIP
		if (Sip_Session_Call.dtmf(digit) == 0)
		{
			// Dtmf sent.
		}
	}
}
/**
 * Handles events related to telephony.
 */
$(function()
{
	/**
	 * On click of dialpad button on call noty, will display/remove keypad.
	 */
	$(".dialpad").die().live("click", function(e)
	{
		e.preventDefault();

		// If noty do not have dialpad then add
		if ($('.noty_message').find('.dialpad_btns').html() == null)
		{
			var dialpad = $(getTemplate("dialpad"), {});
			$(".noty_message").append(dialpad);
		}
		else
		{
			// If noty has dialpad then remove
			$("#dialpad_btns").remove();
		}
	});

	/**
	 * On click of call action on contact page from list, will make SIP call to
	 * hard coded number. For Testing purpose. Call action is not visible to
	 * user.
	 */
	$(".make-call").die().live("click", function(e)
	{
		e.preventDefault();

		// SIP
		/*
		 * if (makeCall('sip:+18004321000@proxy.ideasip.com')) { // Hard coded
		 * user details. User_Name = "Agile"; User_Number =
		 * "sip:+18004321000@proxy.ideasip.com";
		 */

		if (makeCall('sip:farah@sip2sip.info'))
		{
			User_Name = "farah";
			User_Number = "sip:farah@sip2sip.info";

			// Display
			showCallNotyPopup("outgoing", "confirm", '<i class="icon icon-phone"></i><b>Calling :</b><br> ' + User_Name + "  " + User_Number + "<br>", false);
		}
	});

	/**
	 * On click of telephone icon on contact page before phone number at top
	 * right panel, will make SIP call to same number.
	 */
	$(".contact-make-sip-call").die().live("click", function(e)
	{
		e.preventDefault();

		// Get details from UI
		var name = $(this).attr('fname') + " " + $(this).attr('lname');
		var image = $(this).attr('image');
		var phone = $(this).attr('phone');

		// Check number is available.
		if (phone == "" || phone == null)
		{
			alert(name + "'s contact number not added.");
			return;
		}

		// SIP outgoing call.
		if (makeCall(phone))
		{
			// Assign details to set in noty.
			User_Name = name;
			User_Number = phone;
			User_Img = image;

			// Display
			showCallNotyPopup("outgoing", "confirm", '<i class="icon icon-phone"></i><b>Calling : </b><br>' + User_Name + "   " + User_Number + "<br>", false);
		}
	});

	/**
	 * Onclick of hangup button in call noty, when call is connected.
	 */
	$(".hangup").die().live("click", function(e)
	{
		e.preventDefault();

		// Display
		showCallNotyPopup("hangup", "information", "<b>Call ended with : </b><br>" + User_Name + "   " + User_Number + "<br>", false);

		// SIP hangup call.
		hangupCall();
	});

	/**
	 * On incoming call noty, on ignore button click. It will cut the call.
	 */
	$('.ignore').die().live("click", function(e)
	{
		// Display
		showCallNotyPopup("ignored", "error", "<b>Ignored call : </b><br>" + User_Name + "   " + User_Number + "<br>", 5000);

		// SIP rehject call.
		Sip_Session_Call.reject(Config_Call);

		// Remove html5 notification.
		if (Notify_Call)
		{
			Notify_Call.cancel();
			Notify_Call = null;
		}
	});

	/**
	 * On incoming call noty, on answer button click. It will connect call.
	 */
	$('.answer').die().live("click", function(e)
	{
		// SIP accept call.
		Sip_Session_Call.accept(Config_Call);
	});

});
/**
 * On incoming call, It finds relevant contact user from added contacts with
 * same phone number.
 */
function findContact()
{	
	//console.log("FindContact. " + Sip_Session_Call.getRemoteUri());

	// Get contact details on phone number
	$.getJSON("/core/api/contacts/search/phonenumber/" + Sip_Session_Call.getRemoteUri(), function(caller)
	{
		//console.log(caller);

		// Contact added
		if (caller != null)
		{
			// Get details to update call noty.
			if (caller.properties[0].name == 'first_name' || caller.properties[1].name == 'last_name')
			{
				User_Name = caller.properties[0].value + " " + caller.properties[1].value;
				User_Number = Sip_Session_Call.getRemoteUri();
				User_Img = caller.properties[2].value;

				// Set details if call is still active.
				if (CALL != undefined)
					CALL.setText('<i class="icon icon-phone"></i><b>Incoming call : </b><br>' + User_Name + "   " + User_Number);
			}
		}
	}).error(function(data)
	{
		console.log("Find contact : " + data.responseText);
	});
}
/**
 * Makes a call (SIP INVITE). Outgoing call.
 * 
 * @param phoneNumber
 * @returns {Boolean}
 */
function makeCall(phoneNumber)
{
	// Check Stack is available, Session is empty and phone number is available.
	if (Sip_Stack && !Sip_Session_Call && !tsk_string_is_null_or_empty(phoneNumber))
	{
		// create call session
		Sip_Session_Call = Sip_Stack.newSession('call-audio', Config_Call);

		// make call
		if (Sip_Session_Call.call(phoneNumber) != 0)
		{
			// If failed.
			Sip_Session_Call = null;
			showCallNotyPopup("failed", "error", "Failed to make call.", false);

			return false;
		}
		return true;
	}
	else if (Sip_Stack != null && Sip_Session_Call != null)
	{
		showNotyPopUp('information', "You are already in call.", "top", 5000);
		return false;
	}
	else if (!Sip_Stack)
	{
		showNotyPopUp('information', "You are not register with SIP server, Please refresh the page.", "top", 5000);
		return false;
	}
}

/**
 * terminates the call (SIP BYE or CANCEL)
 */
function hangupCall()
{
	// Call session not null.
	if (Sip_Session_Call != null)
	{
		// stop ringtone.
		stopRingTone();
		
		//console.log("Terminating the call...");
		
		// Hangup call
		Sip_Session_Call.hangup({ events_listener : { events : '*', listener : sipSessionEventsListener } });
	}

	// Close notification.
	if (Notify_Call)
	{
		Notify_Call.cancel();
		Notify_Call = null;
	}
}
/**
 * On i_new_call event of sip stack, New session is created and noty displyed.
 */
function newIncomingCall(e)
{
	// Session for call is already created.
	if (Sip_Session_Call != null)
	{
		showNotyPopUp('information', "You are already in call.", "top", 5000);

		// do not accept the incoming call if we're already 'in call'
		e.newSession.hangup(); // comment this line for multi-line support
	}
	else
	{
		// Create new session for call.
		Sip_Session_Call = e.newSession;

		// start listening for events and set properties.
		Sip_Session_Call.setConfiguration(Config_Call);

		// Assign display name and number for noty.
		var sRemoteName = (Sip_Session_Call.getRemoteFriendlyName() || 'unknown');
		User_Name = sRemoteName;
		User_Number = Sip_Session_Call.getRemoteUri();

		// Show noty
		showIncomingCall();
	}
}

// show details in noty popup for incoming call.
function showIncomingCall()
{
	// return if call under notification prefs is disabled
	if(notification_prefs && notification_prefs["call"] === false)
		return;
	
	showCallNotyPopup("incoming", "confirm", '<i class="icon icon-phone"></i><b>Incoming call :</b><br> ' + User_Name + "   " + User_Number + "<br>", false);

	// Incoming call sound play.
	startRingTone("ringtone");

	// notification display permission already asked when we registered	
	show_desktop_notification("../img/plugins/sipIcon.png", "Incoming Call :", User_Name + " " + User_Number, undefined, "SipCall");
	
	// Find contact for incoming call and update display.
	findContact();
}
/* SIP event listeners */

/**
 * Callback function for SIP Stack or Events Listener for sip stack
 */
function sipStackEventsListener(e /* SIPml.Stack.Event */)
{	
	//console.log(e.type);
	//console.log(e.description);

	//tsk_utils_log_info('==agile stack event = ' + e.type);

	switch (e.type) {
	case 'started':
	{
		// Register on sip.
		sipLogin();
		break;
	}
	case 'failed_to_start':
	{
		showCallNotyPopup("disconnected", 'error', "SIP: There was an error registering your account. Please modify and try again.", false);
	}
	case 'failed_to_stop':
	case 'stopping':
	case 'stopped':
	{
		// Empty all data.
		Sip_Start = false;
		Sip_Stack = null;
		Sip_Register_Session = null;
		Sip_Session_Call = null;
		User_Name = null;
		User_Number = null;
		User_Img = null;

		// Stop sound.		
		stopRingTone();

		break;
	}
	case 'i_new_call':
	{
		// Incoming call.
		newIncomingCall(e);
		break;
	}
	case 'starting':
	{		
		break;
	}
	case 'm_permission_requested':
	{
		break;
	}
	case 'm_permission_accepted':
	{
		break;
	}
	case 'm_permission_refused':
	{
		// Stop sound.		
		stopRingTone();

		// Display
		showCallNotyPopup("mediaDeny", 'warning', "SIP: Media stream permission denied.", false);

		// SIP hangup call.
		hangupCall();
		break;
	}
	default:
	{
		console.log("In sipStack event Listner. " + e.type);
		break;
	}
	}
};

/**
 * Callback function for SIP sessions (INVITE, REGISTER, MESSAGE...)
 */
function sipSessionEventsListener(e /* SIPml.Session.Event */)
{	
	//console.log(e.type);
	//console.log(e.description);

	//tsk_utils_log_info('==agile session event = ' + e.type);

	switch (e.type) {
	case 'connecting':
	{
		break;
	}
	case 'sent_request':
	{
		break;
	}
	case 'connected':
	{
		if (e.session == Sip_Register_Session)
		{
			// Play sound on sip register.
			play_sound();

			// Display.
			showCallNotyPopup("register", 'information', "SIP: You are now registered to make and receive calls successfully.", 5000);

			// call action and telephone icon, Make visible.
			$(".contact-make-sip-call").show();
			
			// Contact with tel: is hidden
			$(".contact-make-call").hide();
			
			$(".make-call").show();

			// enable notifications if not already done
			if (window.webkitNotifications && window.webkitNotifications.checkPermission() != 0)
			{
				window.webkitNotifications.requestPermission();
			}
		}
		else if (e.session == Sip_Session_Call)
		{
			// Call received.
			stopRingTone();

			// Display.
			showCallNotyPopup("connected", "success", "<b>On call : </b><br>" + User_Name + "   " + User_Number + "<br>", false);

			// Close html5 notification.
			if (Notify_Call)
			{
				Notify_Call.cancel();
				Notify_Call = null;
			}
		}
		break;
	} // 'connecting' | 'connected'
	case 'terminating':
	case 'terminated':
	{
		if (e.session == Sip_Register_Session)
		{
			// Session terminated.
			Sip_Start = false;
			Sip_Session_Call = null;
			Sip_Register_Session = null;
			User_Name = null;
			User_Number = null;
			User_Img = null;

			if (Sip_Updated == true && e.description == "Disconnecting...")
			{
				Sip_Updated = false;
				showCallNotyPopup("disconnected", 'warning', "SIP : Terminated for modifications. Registering again...", 5000);
			}
			else if (No_Internet == true && e.description == "Disconnecting...")
			{
				No_Internet = false;
				showCallNotyPopup("disconnected", 'error', "SIP : Terminated because no internet connectivity.", 5000);
			}
			else
				showCallNotyPopup("disconnected", 'error', "SIP : Terminated because " + e.description, 5000);
		}
		else if (e.session == Sip_Session_Call)
		{
			// call terminated.
			stopRingTone();

			// Show state of call.
			if (e.description == "Request Cancelled")
				showCallNotyPopup("missedCall", "error", "<b>Missed call : </b><br>" + User_Name + "   " + User_Number + "<br>", false);
			else if (e.description == "PSTN calls are forbidden")
				showCallNotyPopup("forbidden", "error", "SIP: PSTN calls are forbidden.", false);
			else if (e.description == "Not acceptable here")
				showCallNotyPopup("noresponce", "error", "SIP: Not acceptable here.", false);
			else if (e.description == "Media stream permission denied")
				showCallNotyPopup("permissiondenied", "error", "SIP: Media stream permission denied.");
			else if (e.description == "Call terminated")
				showCallNotyPopup("hangup", "information", "<b>Call ended with : <b><br>" + User_Name + "   " + User_Number + "<br>", false);
			else if (e.description == "Decline")
				showCallNotyPopup("decline", "error", "Call Decline.", false);
			else if (e.description == "Request Timeout")
				showCallNotyPopup("requestTimeout", "error", "SIP: Request Timeout.", false);
			else if (e.description == "Hackers Forbidden")
				showCallNotyPopup("hackersForbidden", "error", "SIP: Hackers Forbidden.", false);
			else if (e.description == "User not found")
				showCallNotyPopup("userNotFound", "error", "SIP: User not found.", false);
			

			// Call terminated.
			Sip_Session_Call = null;
			User_Name = null;
			User_Number = null;
			User_Img = null;

			// Close html5 notification.
			if (Notify_Call)
			{
				Notify_Call.cancel();
				Notify_Call = null;
			}
		}
		break;
	} // 'terminating' | 'terminated'
	case 'i_ao_request':
	{
		if (e.session == Sip_Session_Call)
		{
			var iSipResponseCode = e.getSipResponseCode();
			if (iSipResponseCode == 180 || iSipResponseCode == 183)
			{
				// On outgoing call.
				startRingTone("ringbacktone");
				//console.log("Remote ringing....");
			}
		}

		break;
	}
	case 'media_added':
	{
		break;
	}
	case 'media_removed':
	{
		break;
	}
	case 'i_request':
	{
		break;
	}
	case 'o_request':
	{
		break;
	}
	case 'cancelled_request':
	{
		break;
	}
	case 'sent_request':
	{
		break;
	}
	case 'transport_error':
	{
		break;
	}
	case 'global_error':
	{
		break;
	}
	case 'message_error':
	{
		break;
	}
	case 'webrtc_error':
	{
		break;
	}

	case 'm_early_media':
	{
		// Call refused.
		stopRingTone();
		break;
	}
	case 'm_stream_audio_local_added':
	{
		break;
	}
	case 'm_stream_audio_local_removed':
	{
		break;
	}
	case 'm_stream_audio_remote_added':
	{
		break;
	}
	case 'm_stream_audio_remote_removed':
	{
		break;
	}
	case 'i_info':
	{
		break;
	}
	default:
	{
		console.log("Sip Session event Listner. " + e.type);
		break;
	}
	}
}
/* SIP related functions */

/**
 * SIPml initialization, stack creation and session regisration does after
 * adding sip widget / updating sip widget / re-login user.
 */
function sipStart()
{	
	// After 15 sec procedure will start.
	setTimeout(function()
	{		
		// after DOM ready.
		if (document.readyState === "complete")
		{	
			// If sip already register.
			if (Sip_Start == true)
				return;

			// If sip not register yet.
			// Get Sip widget
			$.getJSON("/core/api/widgets/Sip", function(sip_widget)
			{
				if (sip_widget == null)
					return;

				Sip_Widget_Object = sip_widget;

				if (sip_widget.prefs != undefined)
				{
					head.js(LIB_PATH + 'lib/telephony/SIPml-api.js', function()
					{
						SIPml.setDebugLevel("error");
						
						// initialize SIPML5
						if (SIPml.isInitialized()) // If already done.
							sipRegister();
						else
							SIPml.init(sipRegister);
					});
				}
			}).error(function(data)
			{
				console.log("Sip error");
				console.log(data);
			});

		}
	}, 15000); // 15 sec
}

/**
 * Create stack, to register a sip.
 */
function sipRegister()
{
	// Add audio tags in home page.
	addAudio();
	
	// Properties for session object.
	Config_Call = { audio_remote : document.getElementById('audio_remote'), events_listener : { events : '*', listener : sipSessionEventsListener } };

	// If sip is already started.
	if (Sip_Start == true)
		return;

	// If sip is not started yet.
	// Set flag to avoid recall.
	Sip_Start = true;

	var url = null;

	// Get widget details.
	var credentials = eval('(' + Sip_Widget_Object.prefs + ')');

	var message = null;

	try
	{
		// Check Sip Public Identity is valid.
		var o_impu = tsip_uri.prototype.Parse(credentials.sip_publicid);

		if (!o_impu || !o_impu.s_user_name || !o_impu.s_host)
		{
			Sip_Start = false;
			message = credentials.sip_publicid + " is not a valid Public identity. Please provide valid credentials.";
			showCallNotyPopup("failed", "error", message, 5000);
		}
		else
		{
			// Check websocket_proxy_url
			if (credentials.sip_wsenable == "true")
				url = "ws://54.83.12.176:10060";

			// Define sip stack
			Sip_Stack = new SIPml.Stack({ realm : credentials.sip_realm, impi : credentials.sip_privateid, impu : credentials.sip_publicid,
				password : credentials.sip_password, display_name : credentials.sip_username, websocket_proxy_url : url, enable_rtcweb_breaker : true,
				events_listener : { events : '*', listener : sipStackEventsListener } });

			// sip stack start
			if (Sip_Stack.start() != 0)
			{
				Sip_Start = false;
				message = 'Failed to start the SIP stack. Please provide valid credentials.';
				showCallNotyPopup("failed", "error", message, 5000);
			}
		} // else end
	}
	catch (e)
	{
		Sip_Start = false;
		message = e + " Please provide valid credentials.";
		showCallNotyPopup("failed", "error", message, 5000);
	}

}

/**
 * Register or login on sip server for session.
 */
function sipLogin()
{
	try
	{
		// LogIn (REGISTER) as soon as the stack finish starting
		Sip_Register_Session = Sip_Stack.newSession('register', { events_listener : { events : '*', listener : sipSessionEventsListener } });
		Sip_Register_Session.register();
	}
	catch (e)
	{
		Sip_Start = false;
	}
}

/**
 * sends SIP REGISTER (expires=0) to logout. Sip unregister stack and session,
 * On logout / window close / SIP details in Sip widget modified.
 */
function sipUnRegister()
{
	// Check stack available.
	if (Sip_Stack)
	{
		// shutdown all sessions
		var done = Sip_Stack.stop();

		console.log("Sip_Stack.stop() :" + done);

		// If not then recursive call.
		if (done != 0)
			sipUnRegister();
	}
}
// Sip stack.
var Sip_Stack;

// Sip register session.
var Sip_Register_Session;

// Sip call session.
var Sip_Session_Call;

/*
 * Sip call session properties. Used to create incoming call, outgoing call, and
 * sip registration. Even we need when user reject or accept call.
 */
var Config_Call;

// Sip widget.
var Sip_Widget_Object;

// User details of callee / contact user. We can not set fields in session. 
var User_Name;
var User_Img;
var User_Number;

// Call noty.
var CALL;

// HTML5 notification.
var Notify_Call;

// Sip flags.
var Sip_Start = false;
var Sip_Updated = false;
var No_Internet = false;

// Audio object
var Sip_Audio;

// If user get disconnect from internet.
window.addEventListener("offline", function(e)
{	
	No_Internet = true;

	// Unregister all sessions and stop sip stack.
	sipUnRegister();
}, false);

// If user get reconnect with internet.
window.addEventListener("online", function(e)
{
	No_Internet = false;

	// Re-register on sip.
	sipStart();
}, false);

// For telephony on SIP.
$(function()
{
	// Register SIP
	sipStart();
});
/**
 * Telephony noty functions.
 */

/**
 * Show noty popup at bottom right.
 * 
 * @param state :
 *            Event happen with SIP
 * @param type :
 *            noty type like error, default, information, warning, etc.
 * @param message :
 *            text to display eg. callee details, etc.
 * @param duration :
 *            false or sec.
 */
function showCallNotyPopup(state, type, message, duration)
{
	// return if call under notification prefs is disabled
	if(state === "incoming" || state === "missedCall")
	{
		if(notification_prefs && notification_prefs["call"] === false)
			return;
	}
	
	head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH + 'lib/noty/layouts/bottom.js', LIB_PATH + 'lib/noty/layouts/bottomRight.js',
			LIB_PATH + 'lib/noty/themes/default.js', LIB_PATH + 'lib/noty/packaged/jquery.noty.packaged.min.js', function()
			{
				if (state == "incoming") // confirm
					incomingCallNoty(message);
				else if (state == "connected") // success
					connectedCallNoty(message);
				else if (state == "outgoing") // confirm
					outgoingCallNoty(message);
				else
					showCallNoty(type, message, duration); // as per
				// requirement
			});
}

/**
 * Default noty without buttons.
 * 
 * @param type
 * @param message
 * @param duration
 */
function showCallNoty(type, message, duration)
{
	// Close event
	if (CALL != undefined)
		CALL.close();

	// Set properties
	CALL = noty({ text : message, type : type, layout : "bottomRight", timeout : duration,
	// delay for closing event. Set false for sticky notifications
	});
}

/**
 * Incoming call noty with buttons : Answer and Ignore
 * 
 * @param message
 */
function incomingCallNoty(message)
{
	// Close event
	if (CALL != undefined)
		CALL.close();

	// Set properties
	CALL = noty({ text : message, type : "confirm", layout : "bottomRight", buttons : [
			{ addClass : 'btn btn-primary answer', text : 'Answer' }, { addClass : 'btn btn-danger ignore', text : 'Ignore' }
	] });
}

/**
 * Connected noty displayed, After received call from callee or user with
 * Dialpad and Hangup buttons.
 * 
 * @param message
 */
function connectedCallNoty(message)
{
	// Close event
	if (CALL != undefined)
		CALL.close();

	// Set properties
	CALL = noty({ text : message, type : "success", layout : "bottomRight", buttons : [
			{ addClass : 'btn btn-primary dialpad', text : 'Dialpad' }, { addClass : 'btn btn-danger hangup', text : 'Hangup' }
	] });
}

/**
 * On Outgoing call, noty with cancel button shows.
 * 
 * @param message
 */
function outgoingCallNoty(message)
{
	// Close event
	if (CALL != undefined)
		CALL.close();

	// Set properties
	CALL = noty({ text : message, type : "confirm", layout : "bottomRight", buttons : [
		{ addClass : 'btn btn-danger hangup', text : 'Cancel' }
	] });
}
/**
 * TAGS and tagsCollection are taken as global variables.
 * 
 * TAGS --> Stores models of tagsCollection (to avoid fetching the data from server side, 
 * 			every time the tags typeahead is called)
 * tagsCollection --> To show up the added tags in tags view, by adding to this collection 
 */
var TAGS;
var tagsCollection;
var isTagsTypeaheadActive;
var tagsTemplate;
var tagsCollectionView;
/**
 * Creates a list (tags_list) only with tag values (i.e excludes the keys), 
 * by fetching the tags from server side, if they do not exist at client side (in TAGS). 
 * 
 * This tags_list is used as source for the typeahead, to show the matched items 
 * as drop down list, when a key is entered in the input box of typeahead 
 * 
 * @method setup_tags_typeahead
 * 
 */
function setup_tags_typeahead() {
	var tags_list = [];
	
	
	// Fetches tags collection, if no tags are exist (in TAGS) 
    if(!TAGS)
    	{
    		init_tags_collection();
    		return;
    	}
    
    TAGS = tagsCollection.models;
    
    // Iterate TAGS to create tags_list (only with tag values)   
    _(TAGS).each(function (item) { 
        var tag = item.get("tag");
        if ($.inArray(tag, tags_list) == -1) tags_list.push(tag);
    });

    if(!$('.tags-typeahead').attr('placeholder'))
    	$('.tags-typeahead').attr("placeholder", "Separate tags with commas");
    
    // Turn off browser default auto complete
    $('.tags-typeahead').attr("autocomplete","off");
 
    /**
     * typeahead is activated to the input field, having the class "tags-typeahead" 
     */
    $('.tags-typeahead').typeahead({
        
    	/**
    	 * Shows a drop down list of matched elements to the key, entered in the 
    	 * input field (having the class "tags-typeahead") from the list of elements
    	 * (tags_list) passed to the source method of typeahead
    	 */
    	source: function (query, process)
    	{
    		isTagsTypeaheadActive = false;
    		(this.$menu).empty();
    		
    		process(tags_list);
    		
    		if(this.$menu.find('.active').length > 0)
    			isTagsTypeaheadActive = true;
    	},
    	/**
    	 * Performs its operation (adds the tag as an li element to its nearest ul) on selecting 
    	 * a tag from the list of matched items provided by the source method   
    	 */
    	updater: function(tag) {
    		
    		if(!tag || (/^\s*$/).test(tag))
    			{
    				return;
    			}
    	
    		tag = tag.trim();
    	
    		// Saves the selected tag to the contact
    		if((this.$element).closest(".control-group").hasClass('save-tag')){
    			
    			var json = App_Contacts.contactDetailView.model.toJSON();
    			
    			// Checks if tag already exists in contact
    			if($.inArray(tag, json.tags) >= 0)
    				return;

    			json.tagsWithTime.push({"tag" : tag});
    			
    			
    			saveEntity(json, 'core/api/contacts', function(data){
    				$("#addTagsForm").css("display", "none");
        		    $("#add-tags").css("display", "block");
        		    
    	     		// Get all existing tags of the contact to compare with the added tags
	       			var old_tags = [];
	       			$.each($('#added-tags-ul').children(), function(index, element){
       					
	       				old_tags.push($(element).attr('data'));
       				});
	       			
	       			App_Contacts.contactDetailView.model.set(data.toJSON(), {silent : true});
	       			
	       			addTagToTimelineDynamically(data.get("tagsWithTime"));
	       			
	       			// Append to the list, when no match is found 
	       			if ($.inArray(tag, old_tags) == -1) 
	       				$('#added-tags-ul').append('<li style="display:inline-block;" class="tag" data="' + tag + '"><span><a class="anchor" href="#tags/'+ tag + '" >'+ tag + '</a><a class="close remove-tags" id="' + tag + '" tag="'+tag+'">&times</a></span></li>');
    				
    			});
    	        return;
    		}
    		
    		// To store existing tags in form.
    		var tags_temp = [];
    		
    	    // If tag already exists returns
            $.each((this.$element).closest(".control-group").find('ul.tags').children('li'), function (index, tag){
            	tags_temp.push($(tag).attr('data'));
            });

            // If tag is not added already, then add new tag.
    		if($.inArray(tag, tags_temp) == -1)
    			(this.$element).closest(".control-group").find('ul.tags').append('<li class="tag"  style="display: inline-block;" data="'+ tag+'">'+tag+'<a class="close" id="remove_tag">&times</a></li>');
        }
    });
    
    
    $("#addTags").bind("keydown",  function(e) {
    	if(e.which == 13 && !isTagsTypeaheadActive)
    		{
    			e.preventDefault();

    			var contact_json = App_Contacts.contactDetailView.model.toJSON();
    	
    			var tag = $(this).val().trim();

    			$("#addTags").val("");
    	
    			if(!tag || tag.length<=0 || (/^\s*$/).test(tag))
    			{
    				return;
    			}
    			
    			tag = tag.trim();
    			
    			// Get all existing tags of the contact to compare with the added tags
    			var old_tags = [];
    			$.each($('#added-tags-ul').children(), function(index, element){
				
    				old_tags.push($(element).attr('data'));
    			});
			
    			// Append to the list, when no match is found 
    			if ($.inArray(tag, old_tags) != -1) 
    				return;
   			
    			contact_json.tagsWithTime.push({"tag" : tag});
    	    	
    			saveEntity(contact_json, 'core/api/contacts',  function(data) {
    			
    				// Updates to both model and collection
    				App_Contacts.contactDetailView.model.set(data.toJSON(), {silent : true});
    				addTagToTimelineDynamically(data.get("tagsWithTime"));
    				tagsCollection.add(new BaseModel( {"tag" : tag} ));
    			$("#addTagsForm").css("display", "none");
    		    $("#add-tags").css("display", "block");

       				$('#added-tags-ul').append('<li style="display:inline-block;" class="tag" data="' + tag + '" ><span><a class="anchor" href="#tags/'+ tag + '">'+ tag + '</a><a class="close remove-tags" id="' + tag + '" tag="'+tag+'">&times</a></span></li>');
    			});
    		}
    });
    
    
    /**
     * If entered tag is not in typeahead source, create a new tag (enter "," at the end of new tag 
     * element, then it could be added as new tag)
     */
    $(".tags-typeahead").bind("keydown", function(e){
    	
    	// Adds no tags when the key down is "," in contact detail view tags 
    	if($(this).hasClass('ignore-comma-keydown'))
    	  return;
    	
    	var tag = $(this).val().trim();
    	
    	if(!tag || tag.length<=0 || (/^\s*$/).test(tag))
		{
			return;
		}
    	
    	// To make a tag when "," keydown and check input is not empty
    	if(e.which == 188 && tag != "")
    	{
    		e.preventDefault();
    	
    		// Prevents comma (",") as an argument to the input field
    		$(this).val("");
    		
    		var tags_list=$(this).closest(".control-group").find('ul.tags');
    		var add_tag=true;
    		
    		// Iterate over already present tags, to check if this is a new tag
    		tags_list.find('li').each(function(index,elem){
    			
    			if(elem.getAttribute('data')==tag)
    			{
    				add_tag=false; // tag exists, don't add
    				return false;
    			}
    		});
    		
    		if(add_tag)
    			tags_list.append('<li class="tag"  style="display: inline-block;" data="'+ tag+'">'+tag+'<a class="close" id="remove_tag" tag="'+tag+'">&times</a></li>');
    	}
    });
}

/**
 * Fetches the tags collection from server side and shows them in their 
 * separate section along  with contacts list.
 * Called from contacts router and customView router.
 * 
 * @method setup_tags
 * @param {Object} cel 
 * 			contacts list view page as html object
 */
function setup_tags(cel) {
	
	if(!tagsCollection || !tagsCollectionView)
	{
		
		init_tags_collection(cel, function(el){
			$('#tagslist', cel).html(el);
		});
		return;
	}
	  $('#tagslist', cel).html(tagsCollectionView.render(true).el);
}

/**
 * Reads the tag values from the elements having class "tags" and maps 
 * them as a json object to return.
 * 
 * @method get_tags
 * @param {String} form_id 
 * 			to read tags from the form
 * @returns json object of tags
 */
function get_tags(form_id) {
    var tags_json = $('#' + form_id + ' .tags').map(function () {
       	var values = [];

       	$.each($(this).children(), function(index, data) { 
       		values.push(($(data).attr("data")).toString())
    	});
        return {
        	"name" : $(this).attr('name'),
           	"value":values
        };
    }).get();
    
    return tags_json;
}

/**
 * Reads the values of a input field and splits based on comma
 * @param id
 * @returns
 */
function get_new_tags(id){
    // Add Tags
    if (isValidField(id)) {
        var tags = $('#' + id).val();
        
        // Replace multiple space with single space
        tags =  tags.replace(/ +(?= )/g,'');

        
        // Replace ,space with space
        tags = tags.replace(", ", " ");

        // Replace , with spaces
        tags = tags.replace(",", " ");

        return tags;
//        return tags.split(" ");
    }
}

function init_tags_collection(cel, callback, url)
{
	url = url ? url : '/core/api/tags'
	tagsCollectionView = new Base_Collection_View({ 
			url : url, 
			sortKey: 'tag',
			templateKey : 'tags', 
		});
	
	tagsCollectionView.appendItem = append_tag;
	

	tagsCollection = tagsCollectionView.collection;
	
	tagsCollectionView.collection.fetch({success: function(data){
		  TAGS = tagsCollection.models
		  
		// Called to initiate typeahead to the fields with class attribute "tags_typeahead"
        setup_tags_typeahead();
		  
		if(callback && typeof (callback) === "function")
			callback(tagsCollectionView.render(true).el);		  
	}});
}

function append_tag(base_model)
{
	var tag = base_model.get('tag');
	var key = tag.charAt(0).toUpperCase();
	tag_encoded = encodeURIComponent(tag);
	$( 'div[tag-alphabet="'+key+'"]', this.el).append('<a href="#tags/'+tag_encoded+'" id="'+tag_encoded.replace( / +/g, '' )+'-in-list">'+tag+'</a>&nbsp;');
}

function remove_tags(base_model)
{
	console.log("removed");	
}

$(function(){
	
	$("#refresh-tags").die().live('click', function(e){
		e.preventDefault();
		$('#tagslist', App_Contacts.contactsListView.el).html(LOADING_HTML);
		init_tags_collection(App_Contacts.contactsListView.el, function(tags){
			setup_tags(App_Contacts.contactsListView.el);
			pieTags(App_Contacts.contactsListView.el, true);
		}, 'core/api/tags?reload=true');
	})
});// Contacts on querying
var QUERY_RESULTS;

// Saves map of key: name and value: contact id
var TYPEHEAD_TAGS = {};

/**
 * This script file defines simple search keywords entered in input fields are 
 * sent to back end as query through bootstrap typeahead. Methods render, matcher 
 * and updater are overridden for custom functionality. Last 2 parameters were 
 * added later for Companies autofill. They can be left undefined and things 
 * will go to default, the way its normally used otherwise throughout the project.
 * 
 * @method agile_type_ahead
 * @param id
 *            Html element id of input field
 * @param el
 *            Html element of the view
 * @param callback
 *            To customer contacts to show in dropdown
 * @param isSearch
 *            Callback to override functionalities of updater function
 * @param urlParams
 * 			  [Added later] Additional parameters to be append, e.g. type=COMPANY
 * @param noResultText           
 * 			  [Added later] HTML text to display in case of no result
 * @module Search
 * @author Yaswanth
 * 
 */
function agile_type_ahead(id, el, callback, isSearch, urlParams, noResultText, url) {

    // Turn off browser default auto complete
    $('#' + id, el).attr("autocomplete", "off");
    if(!url)
    	url = "core/api/search/"
    	

    var CONTACTS = {};

    $('#' + id, el).typeahead({
    	
        source: function (query, process) {
        	
        	
        	/* Resets the results before query */
        	CONTACTS = {};

        	/* Stores type ahead object in temporary variable */
        	var that = this;

        	that.$menu.empty();
        	/* Sets css to html data to be displayed */
        	that.$menu.css("width", 300);

     		/*
        	 * Calls render because menu needs to be initialized
        	 * even before first result is fetched to show
        	 * loading 
        	 */
        

        	/*
        	 * If loading image is not available in menu then
        	 * appends it to menu
        	 */
        	if (!$(this.$menu.find('li').last()).hasClass('loading-results')){
        			that.$menu.html('<li class="divider"></li><li class="loading-results"><p align="center">' + LOADING_ON_CURSOR + '</p></li>');
        			that.render();
        	}

        	// Drop down with loading image is shown
        	//this.shown = true;

        	// Get data on query
        	
        	var type_url="";
        	
        	if(urlParams && urlParams.length)type_url='&'+urlParams;
        	
        	$.getJSON(url + query+"?page_size=10"+type_url, function (data){

        	    /*
        		 * Stores query results to use them in updater and render
        		 * functions
        		 */
        		CONTACTS = data;

        		/*
        		 * Sets results in global variable, used to show results 
        		 * in different page (when search symbol is clicked)
        		 */
        		QUERY_RESULTS = data;

        		/*
        		 * If no result found based on query, shows info in
        		 * type-ahead drop-down and return
        		 */
        		if (data.length == 0) {
        			var txt='<b>No Results Found</b>';
        			if(noResultText && noResultText.length)txt=noResultText;
        			that.$menu.html('<div style="margin-top:10px"><p align="center">'+txt+'<p></div>');
        			that.render();
        			return;
        		}

        		var items_list = [];

        		/*
        		 * Customizes data for type ahead, items_list contains list of  contact 
        		 * names (first_name + last_name without space). callback is contacts_typeahead
        		 */ 
        		if (callback && typeof (callback) === "function")
        			items_list = callback(data);

        		/*
        		 * Stores contacts in a map with first_name+last_name as key and id as value
        		 */
        		$.each(data, function (index, item){
        			tag_name = items_list[index];
        			TYPEHEAD_TAGS[tag_name] = item.id;
        		});

        		/*
        		 * Calls matcher and render methods by verifying the data
        		 */
        		process(items_list);
        	});
        },
        
        /**
         * Overridden to return always true (when contacts are fetched based on 
         * email or company name etc..)
         */
        matcher: function (item){
            if (~item.toLowerCase().indexOf(this.query.toLowerCase()) != 0)
            	return~item.toLowerCase().indexOf(this.query.toLowerCase());
            else return -1;
        },
        
        /**
         * Overridden to customize the view of matched drop down entities 
         * (i.e with image, email address etc..)  
         */
        render: function (){
        	var that = this;

            // If query results are not available activate the menu to show info and return
            if (!CONTACTS.length){
                this.show();
                return;
            }

            // Stores all the matched elements (<li> drop down) in items
            items = buildcategorizedResultDropdown (CONTACTS, that.options);
            	
            
            items.css("overflow", "hidden");

            //this.$menu.css("max-height", "400px");
            //this.$menu.css("overflow", "auto");
            
            // Keeps the list of items in menu (ul) and shows the drop down
            this.$menu.html(items).show();
            this.shown = true;
            return this
        },
        
        /**
         * Handles the select (clicking a drop down element) event of drop down elements.
         * If, it is search fiel navigates to detail view, related to field prepends the 
         * name as tag to the field. Also shows all the matched entities in other page 
         * when search symbol is clicked. 
         */
        updater: function (items) {
            // To verify whether the entity (task, deal etc..) related to same contact twice 
        	var tag_not_exist = true;

            /* Stores items in temp variable so that, shows first
             * name and last name separated by space
             */
        	if (items)
        		var items_temp = items.substr(0, items.lastIndexOf('-'));

            // Trims spaces in names to retrieve contact id from JSON (TYPEHEAD_TAGS)
            if (items) items = items.split(" ").join("")

            // Customizes data for type ahead
            if (isSearch && typeof (isSearch) === "function")
            {

                /* 
                 * If no item is selected (when clicked on search symbol or enter) then show
                 * results in different page
                 */ 
                if (!items)
                {
                    showSearchResults(); // fails automatically for non main search bar typeaheads.
                    return this.query; // return text of query to set in input field
                }
                
                
                // Navigates the item to its detail view
                isSearch(TYPEHEAD_TAGS[items], items_temp);
                return;
            }

            // Return if items are not defined and it is not search in nav bar
            if (!items) return;

            // If tag already exists returns
            $.each($('.tags', el).children('li'), function (index, tag){

                if ($(tag).attr('data') == TYPEHEAD_TAGS[items]){
                    tag_not_exist = false;
                    return;
                }
            });

            // add tag
            if (tag_not_exist)
            	{
            	
            		$('.tags', el).append('<li class="tag"  style="display: inline-block;" data="' + TYPEHEAD_TAGS[items] + '"><a href="#contact/' + TYPEHEAD_TAGS[items] +'">' + items_temp + '</a><a class="close" id="remove_tag">&times</a></li>');
            	}
        },
        
        // Hides the results list
        hide: function () {
        	this.$menu.hide();
            this.shown = false;
            return this;
        },
        
        // Handles cursor exiting the textbox
        blur: function (e) {
            var that = this;
            e.stopPropagation();
            e.preventDefault();
            setTimeout(function () {
                if (!that.$menu.is(':focus'))
                  that.hide();
            }, 150)
        },
        minLength: 2,
    })
}

// Removes tags ("Related to" field contacts)
$('#remove_tag').die().live('click', function (event)
{
    event.preventDefault();
    $(this).parent().remove();
});

/* Customization of Type-Ahead data */

/**
 * Returns list of contact names (with no space separation) for type ahead
 * 
 * @method contacts_typeahead
 * @param data
 *           contacts on querying, from type-ahead
 */
function contacts_typeahead(data)
{
    if (data == null)
    	return;
    
    // To store contact names list
    var contact_names_list = [];
       
    /*
     * Iterates through all the contacts and get name property
     */
    $.each(data, function (index, contact){
            
    	var contact_name;

        // Appends first and last name to push in to a list
        contact_name = getContactName(contact) +"-"+ contact.id;
            
        // Spaces are removed from the name, name should be used as a key in map "TYPEHEAD_TAGS"
        contact_names_list.push(contact_name.split(" ").join(""));
    });
        
    // Returns list of contact/company names
    return contact_names_list;
    
}


function getContactName(contact)
{
	var name="";
	if(!contact.type || contact.type == 'PERSON')
	{	
		var first_name = getPropertyValue(contact.properties, "first_name");
		var last_name = getPropertyValue(contact.properties, "last_name");
		last_name = last_name != undefined ? last_name.trim() : "";
		first_name = first_name != undefined ? first_name.trim() : "";
		name = (first_name + " " + last_name).trim();
	}	
	else if(contact.type == "COMPANY")
	{
		var company_name=getPropertyValue(contact.properties, "name");
		company_name = company_name !=undefined ? company_name.trim():"";
		name = company_name.trim();
	}
	
	if(name.length)return name;
	
	var email=getPropertyValue(contact.properties, "email");
	email = email!=undefined ? email.trim():"";
	
	if(email.length)return email;

	// if nothing found, assume Company and return with id.
	
	return 'Company '+contact.id;
}

function buildcategorizedResultDropdown(items, options)
{	
	var contact_custom_view = new Base_Collection_View({ 
		data : items,
		templateKey : "typeahead-contacts", 
		individual_tag_name : 'li' ,
		typeahead_options:options
	});
	
	contact_custom_view.appendItem = appendItemInResult;
	
	var el = contact_custom_view.render(true).el;
	return $(el);
		
	/*$(items).each(function (i, item){
		
		if()

    		 Check if item if of company type get
    		 * company name instead of first name
    		 * and last name of person
    		 
    			var fullname = getContactName(item) +  "-" +  item.id;

    			console.log(fullname);
    			
    		// Sets data-value to name
    		i = $(that.options.item).attr('data-value', fullname);

    		// To add border to all after li except to last one
    		i.addClass('typeahead-border');
    		
    		// Returns template, can be contact or company compares in template
    		i.find('a').html(getTemplate('typeahead-contacts', item));
    		return i[0];
		});*/
}

function appendItemInResult(item)
{

	var fullname = getContactName(item.toJSON()) +  "-" +  item.id;

	
	var itemView = new Base_List_View({
		model : item,
		"view" : "inline",
		template : this.options.templateKey + "-model",
		tagName : 'tr',
	});
	
	// Sets data-value to name
	i = $(this.options.typeahead_options.item).attr('data-value', fullname);

	// To add border to all after li except to last one
	i.addClass('typeahead-border');
	// Returns template, can be contact or company compares in template
	i.find('a').html(itemView.render(true).el);
	
	
	var type = item.toJSON().entity_type;
	if(type)
	{
		if(type == "contact_entity")
			{
			
				$("#contact-typeahead-heading", this.el).show();
				$("#contact-results", this.el).append(i);
			}
		if(type == "deal")
			{
				$("#deal-typeahead-heading",  this.el).show();
				$("#deals-results", this.el).append(i);
			}
		if(type == "case")
			{
				$("#case-typeahead-heading",  this.el).show();
				$("#case-results", this.el).append(i);
			}
		if(type == "document")
		{
			$("#document-typeahead-heading",  this.el).show();
			$("#document-results", this.el).append(i);
		}
	}

}$(function()
{
	/**
	 * Displays note modal. Also prepends the contact name to related to field
	 * of activity modal.
	 */
	$('.task-add-note').live('click', function(e)
	{
		e.preventDefault();
		var el = $("#noteForm");

		$('#noteModal').modal('show');

		$("#from_task", el).val(true);
		$("#task_form", el).val($(this).closest('form').attr("id"));
		
		agile_type_ahead("note_related_to", el, contacts_typeahead);
	});
});

function saveNoteOfTask(form, modal, element, note)
{

	console.log(note);
	var noteModel = new Backbone.Model();
	noteModel.url = 'core/api/notes';
	noteModel.save(note, { success : function(data)
	{
		// Removes disabled attribute of save button
		enable_save_button($(element));

		form.each(function()
		{
			this.reset();
		});

		// Removes loading symbol and hides the modal
		modal.modal('hide');

		var note = data.toJSON();

		console.log(note);
		
		$("#notes", "#"+note.task_form).val(note.id);
	} });
}
// Adds task to task list
function addTaskToTaskList(headingToSearch, tasksToAdd, conditionToCheck)
{
	var modelTaskList;

	// Get task list on basis of heading and id in case of owner criteria
	if (conditionToCheck == "OWNER") // new task
	{
		modelTaskList = getTaskList("OWNER", tasksToAdd.taskOwner.name, tasksToAdd.taskOwner.id);
	}
	else if ((conditionToCheck == "dragged" || conditionToCheck == true) && headingToSearch == "taskOwner.name")
	// dragged/edited task
	{
		modelTaskList = getTaskList("OWNER", tasksToAdd.get("taskOwner").name, tasksToAdd.get("taskOwner").id);
	}
	else
	// task other than owner criteria
	{
		modelTaskList = getTaskList(null, headingToSearch,null);
	}

	if (!modelTaskList)
		return;

	// Add task in sub collection means in Task List
	if (conditionToCheck == "dragged") // if dragged task then do not update UI
		modelTaskList[0].get('taskCollection').add(tasksToAdd, { silent : true });// sub-collection
	else
		modelTaskList[0].get('taskCollection').add(tasksToAdd);// sub-collection

	// Maintain changes in UI
	displaySettings();
}

// Delete Task
function deleteTask(taskId, taskListId, taskListOwnerId)
{
	var modelTaskList;

	// Get Task list
	if (taskListOwnerId)
		modelTaskList = getTaskList("OWNER", taskListId, taskListOwnerId);
	else
		modelTaskList = getTaskList(null, taskListId, null);

	if (!modelTaskList)
		return;

	// Destroy task
	modelTaskList[0].get('taskCollection').get(taskId).destroy();

	// Creates normal time.
	displayTimeAgo($(".list"));
}
// Shows and Fill Task Edit Modal
function editTask(taskId, taskListId, taskListOwnerId)
{
	var modelTaskList;

	if (taskListOwnerId)
		modelTaskList = getTaskList("OWNER", taskListId, taskListOwnerId);
	else
		modelTaskList = getTaskList(null, taskListId, null);

	if (!modelTaskList)
		return;

	var modelTask = modelTaskList[0].get('taskCollection').get(taskId);

	if (!modelTask)
		return;

	var taskJson = modelTask.toJSON();

	taskJson["taskListId"] = taskListId;
	taskJson["taskListOwnerId"] = taskListOwnerId;

	// Fill form
	deserializeForm(taskJson, $("#updateTaskForm"));

	// Show modal
	$("#updateTaskModal").modal('show');

	// Fills owner select element
	populateUsers("owners-list", $("#updateTaskForm"), taskJson, 'taskOwner', function(data)
	{
		$("#updateTaskForm").find("#owners-list").html(data);
		if (taskJson.taskOwner)
		{
			$("#owners-list", $("#updateTaskForm")).find('option[value=' + taskJson['taskOwner'].id + ']').attr("selected", "selected");
		}

		$("#owners-list", $("#updateTaskForm")).closest('div').find('.loading-img').hide();
	});

	// Creates normal time.
	displayTimeAgo($(".list"));
}

// Update edited task
function updateTask(isUpdate, data, json)
{
	// Get selected criteria
	var criteria = getCriteria();

	var headingToSearch = json[GroupingMap[criteria].searchKey];

	if (criteria == "DUE")
		headingToSearch = getHeadingForDueTask(json);

	// To update task with criteria owner, it will skip if of changeTaskList()
	// and will continue to update task
	if (criteria == "OWNER" && parseInt(json.taskListOwnerId) == data.get("taskOwner").id)
		headingToSearch = json.taskListId;

	// Task list change
	if (json.taskListId != undefined)
		if (headingToSearch != json.taskListId) // Not belongs to same task list
		{
			// Change task's list
			changeTaskList(data, json, criteria, headingToSearch, isUpdate);
			return;
		}

	// Task update(edit)
	if (isUpdate == true)
	{
		var modelTaskList;

		// Get Task List
		if (criteria == "OWNER")
			modelTaskList = getTaskList(criteria, json.taskListId, json.taskListOwnerId);
		else
			modelTaskList = getTaskList(null, headingToSearch, null);

		if (!modelTaskList)
			return;

		// Set new details in Task
		modelTaskList[0].get('taskCollection').get(json.id).set(data);

		// Maintain changes in UI
		displaySettings();

		return;
	}

	// Add new task
	if (criteria == "OWNER")
		addTaskToTaskList(headingToSearch, data.toJSON(), criteria);
	else
		addTaskToTaskList(headingToSearch, data, null);
}

// Removes task from old task list and add to new task list.
function changeTaskList(data, json, criteria, headingToSearch, isUpdate)
{
	var modelOldTaskList;

	// Get old task list
	if (criteria == "OWNER")
	{
		var ownerId;

		if (json.taskListOwnerId)
			ownerId = parseInt(json.taskListOwnerId);
		else
			ownerId = json.taskOwner.id;

		if (!ownerId)
			return;

		modelOldTaskList = getTaskList(criteria, json.taskListId, ownerId);

		headingToSearch = "taskOwner.name";

		// Find proper column with owner id and then dlt task in UI
		$(".list-header[ownerID=" + ownerId + "]").parent().find("#" + json.id).remove();
	}
	else
	{
		modelOldTaskList = getTaskList(null, json.taskListId, null);

		// Remove task from UI
		$("#" + json.taskListId).find("#" + json.id).remove();
	}

	if (!modelOldTaskList)
		return;

	// Remove from task from old task list
	modelOldTaskList[0].get('taskCollection').remove(modelOldTaskList[0].get('taskCollection').get(json.id));

	// Add in task in new task list
	addTaskToTaskList(headingToSearch, data, isUpdate);
}

// On click of task action , makes task completed
function completeTask(taskId, taskListId, taskListOwnerId)
{
	var modelTaskList;

	// Get task list
	if (taskListOwnerId)
		modelTaskList = getTaskList("OWNER",taskListId, taskListOwnerId);
	else
		modelTaskList = getTaskList(null, taskListId, null);

	if (!modelTaskList)
		return;

	// Get task
	var modelTsk = modelTaskList[0].get('taskCollection').get(taskId);

	var taskJson = modelTsk.toJSON();

	// Replace contacts object with contact ids
	var contacts = [];
	$.each(taskJson.contacts, function(index, contact)
	{
		contacts.push(contact.id);
	});

	taskJson.contacts = contacts;
	// taskJson.is_complete = true; field will b removed.
	taskJson.due = new Date(taskJson.due).getTime();
	taskJson.owner_id = taskJson.taskOwner.id;
	taskJson.status = COMPLETED;
	taskJson.progress = 100;

	if (taskListOwnerId)
	{
		taskJson.taskListId = taskListId;
		taskJson.taskListOwnerId = taskListOwnerId;
	}

	var newTask = new Backbone.Model();
	newTask.url = 'core/api/tasks';
	newTask.save(taskJson, { success : function(data)
	{
		updateTask(true, data, taskJson);

		// Maintain changes in UI
		displaySettings();
	} });
}
/**
 * Sets tasks as sortable list.
 */
function setup_sortable_tasks()
{
	head.js(LIB_PATH + 'lib/jquery-ui.min.js', function()
	{
		$(".task-model-list").sortable(
				{ connectWith : '.task-model-list', placeholder : "ui-sortable-placeholder", cursor : "move", containment : ".list-area-wrapper",
					scroll : false,
					// When task is dragged to adjust the horizontal scroll
					change : function(event, ui)
					{
						var width = $('.list-area-wrapper > div').width();
						var scrollX = $('.list-area-wrapper > div').scrollLeft();

						if (event.pageX > (width * 0.8)) // right 90%
							$('.list-area-wrapper > div').scrollLeft(scrollX + 30);
						else if (event.pageX < (width * 0.2)) // left 10%
							$('.list-area-wrapper > div').scrollLeft(scrollX - 35);

					},
					// When task is dropped its criteria is changed
					update : function(event, ui)
					{
						// Same task list
						if (ui.sender == null)
							return;

						// Make UI and DB changes after task dropped.
						changeAfterDrop(event, ui);

					} }).disableSelection();
	});
}

// Make changes after task dropped to other task list
function changeAfterDrop(event, ui)
{
	var item = ui.item[0];
	var sender = ui.sender[0];

	// Get heading of task list
	var oldTaskListId = getTaskListId(sender);
	var newTaskListId = getTaskListId(item);

	var oldTaskListOwnerId = getTaskListOwnerId(sender);
	var newTaskListOwnerId = getTaskListOwnerId(item);

	// Get selected criteria
	var criteria = getCriteria();

	var getUpdatedUI = false;

	// If criteria is owner and task is dragged to other task list
	if (criteria == "OWNER" && oldTaskListOwnerId != newTaskListOwnerId)
		getUpdatedUI = true;
	else if (oldTaskListId != newTaskListId) // Checks current task list is
		// different from previous
		getUpdatedUI = true;

	if (getUpdatedUI)
	{
		// Gets search key from map so we can change that field in task as per
		// new task list.
		var fieldToChange = GroupingMap[criteria].searchKey;

		// Get task id
		var taskId = $(item).find('.listed-task').attr('id');

		// Get old task list
		var modelOldTaskList = getTaskList(criteria, oldTaskListId, oldTaskListOwnerId);

		// Gets task from old sub collection (task list) to var type json
		var oldTask = modelOldTaskList[0].get('taskCollection').get(taskId).toJSON();

		// Make updation in task and save in DB as well as collection
		updateDraggedTask(oldTask, criteria, oldTaskListOwnerId, oldTaskListId, newTaskListId, newTaskListOwnerId, taskId, fieldToChange);
	}
}

// Make updation in task and save in DB as well as collection
function updateDraggedTask(oldTask, criteria, oldTaskListOwnerId, oldTaskListId, newTaskListId, newTaskListOwnerId, taskId, fieldToChange)
{
	// Changes field of task
	if (fieldToChange == "due")
	{
		// Criteria is due
		oldTask.owner_id = oldTask.taskOwner.id;
		oldTask["due"] = getNewDueDate(newTaskListId);
	}
	else if (fieldToChange == "taskOwner.name")
	{
		// Criteria is owner
		oldTask.owner_id = newTaskListOwnerId;
		oldTask["taskListOwnerId"] = oldTaskListOwnerId;
	}
	else
	{
		oldTask.owner_id = oldTask.taskOwner.id;
		oldTask[fieldToChange] = newTaskListId;

		// Criteria is status
		if (fieldToChange == "status")
			oldTask.progress = getProgressValue(newTaskListId); // send new
																// status
	}

	// To change task list in collection we need old task list id.
	oldTask["taskListId"] = oldTaskListId;

	// Replace contacts object with contact ids
	var contacts = [];
	$.each(oldTask.contacts, function(index, contact)
	{
		contacts.push(contact.id);
	});

	oldTask.contacts = contacts;
	oldTask.due = new Date(oldTask.due).getTime();

	// Save task after dropped to new task list
	saveAfterDrop(oldTask, criteria, newTaskListId, newTaskListOwnerId, taskId);
}

// Save task after dropped to new task list
function saveAfterDrop(oldTask, criteria, newTaskListId, newTaskListOwnerId, taskId)
{
	// Save task in DB
	var newTask = new Backbone.Model();
	newTask.url = 'core/api/tasks';
	newTask.save(oldTask, { success : function(data)
	{
		updateTask("dragged", data, oldTask);

		// Update task in UI
		if (criteria == "OWNER")
			$(".list-header[ownerID=" + newTaskListOwnerId + "]").parent().find("#" + taskId).parent().html(getTemplate('task-model', data.toJSON()));
		else
			$("#" + newTaskListId).find("#" + taskId).parent().html(getTemplate('task-model', data.toJSON()));

		// Maintain changes in UI
		displaySettings();
	} });
}
// Main Collection
var	TasksListCollection = null;

// Grouping Map After selection from filter/ drop down
var	GroupingMap = { 
		"PRIORITY" : { "type" : ["HIGH", "LOW", "NORMAL"], "searchKey" : "priority_type" }, 
		"CATEGORY" : { "type" : ["EMAIL", "CALL", "SEND", "TWEET", "FOLLOW_UP", "MEETING", "MILESTONE", "OTHER"], "searchKey" : "type" }, 
		"STATUS" : { "type" : ["YET_TO_START", "IN_PROGRESS", "COMPLETED"], "searchKey" : "status" }, 
		"DUE" : { "type" : ["TODAY", "TOMORROW", "OVERDUE", "LATER"], "searchKey" : "due" }, 
		"OWNER" : { "type" : [], "searchKey" : "taskOwner.name" } 
		};

// Status of Task
var YET_TO_START = "YET_TO_START";
var IN_PROGRESS = "IN_PROGRESS";
var COMPLETED = "COMPLETED";

$(function()
{	
	// Get user details and add into GroupingMap's owner array.
	getUserDetails();

	// Display task actions
	$('.listed-task .task-footer').live('mouseenter', function()
	{
		$(this).find(".task-actions").css("display", "block");
	});

	// Hide task actions
	$('.listed-task .task-footer').live('mouseleave', function()
	{
		$(this).find(".task-actions").css("display", "none");
	});

	/*
	 * Task Action: Delete task from UI as well as DB. Need to do this manually
	 * because nested collection can not perform default functions.
	 */
	$('.delete-task').die().live('click', function(event)
	{
		if (!confirm("Are you sure you want to delete?"))
			return;

		// Delete Task.
		deleteTask(getTaskId(this), getTaskListId(this), getTaskListOwnerId(this));
	});

	// Task Action: Mark task complete, make changes in DB.
	$('.is-task-complete').die().live('click', function(event)
	{
		event.preventDefault();

		// make task completed.
		completeTask(getTaskId(this), getTaskListId(this), getTaskListOwnerId(this));
	});

	// Task Action: Open Task Edit Modal and display details in it.
	$('.edit-task, .task-body, .task-due-time').die().live('click', function(event)
	{
		event.preventDefault();

		// Show and Fill details in Task Edit modal
		editTask(getTaskId(this), getTaskListId(this), parseInt(getTaskListOwnerId(this)));
	});

	// Click events to agents dropdown of Owner's list and Criteria's list
	$("ul#owner-tasks li a, ul#type-tasks li a").die().live("click", function(e)
	{
		e.preventDefault();

		// Show selected name
		var name = $(this).html(), id = $(this).attr("href");

		$(this).closest("ul").data("selected_item", id);
		$(this).closest(".btn-group").find(".selected_name").text(name);

		// Get selection from owner's dropdown
		var owner = $('#owner-tasks').data("selected_item");

		// Find array of type's related to criteria in Map
		findDetails(getCriteria(), owner);
	});

	// Change page heading as per owner selection
	$("ul#owner-tasks li a").die().live("click", function()
	{
		// Change page heading
		$('.task-heading').html($(this).html() + '&nbsp<small class="tasks-count"></small>');
	});

	/*
	 * In new/update task modal, on selection of status, show progress slider and change %
	 */
	$(".status").change(function()
	{		
		// Change status UI and input field
		changeStatus($(this).attr("value"), $(this).closest("form"));	
	});	
});
// Maintain changes in UI
function displaySettings()
{
	// Creates normal time.
	displayTimeAgo($(".list"));

	$(".listed-task").parent().css('padding-bottom', '5px');

	// Get selected criteria
	var criteria = getCriteria();

	// Change task UI as per group selection
	if (criteria == "CATEGORY")
	{
		// Remove type of task from UI when category filter selected
		$(".task-type").remove();

		// Assign new setting to Owner image
		$(".task-owner").addClass("shift-up");

		// Assign new min height to task
		$(".task-body").addClass("task-body-category");
	}

	if (criteria == "OWNER")
	{
		// Remove owner pic of task from UI when owner filter selected
		$(".task-owner").remove();

		// Assign new min height to task
		$(".task-body").addClass("task-body-owner");
	}
}

// Load and display slider in update task modal of task for progress.
function loadProgressSlider(el)
{	
	head.load(CSS_PATH + 'css/jslider.css', LIB_PATH + 'lib/jquery.slider.min.js', function()
	{
		$(".progress_slider", el).slider({ from : 0, to : 100, step : 1, skin : "round", onstatechange : function(value)
		{		
			changeProgress(value, $(".status", el).attr("value"), el);
		} });
	});
}

/*
 * Make changes in UI on status button and add new value to input field of
 * status in task edit modal.
 */
function changeStatus(status, parentForm)
{
	var value;

	if (status == YET_TO_START)
		value = 0;
	else if (status == COMPLETED)
		value = 100;
	else if (status == IN_PROGRESS)
		value = 1;

	changeProgress(value, status, parentForm);
}

/*
 * Make changes in UI in progress slider and add new value to input field of
 * progress in task edit modal.
 */
function changeProgress(value, status, parentForm)
{
	// Add progress % to input field
	$("#progress", parentForm).val(value);

	// Show slider for progress
	showProgressSlider(value, status, parentForm);
}

/*
 * Make changes in UI on status selection and display progress slider in task
 * update modal.
 */
function showProgressSlider(value, status, parentForm)
{
	if (value == 100 || status == COMPLETED)
	{		
		$(".status", parentForm).val(COMPLETED);
		$("#progress", parentForm).val(100);
		$("#is_complete", parentForm).val(true);
	}
	else
		$("#is_complete", parentForm).val(false);

	if (status == "IN_PROGRESS")
		$(parentForm).find(".progress-slider").css("display", "block");	
	else
		$(parentForm).find(".progress-slider").css("display", "none");
}

function resetForm(formToReset)
{
	$('#progress', formToReset).val(0);
	$('#is_complete', formToReset).val(false);
	$('#priority_type', formToReset).val("NORMAL");
	$('#status', formToReset).val(YET_TO_START);
	$(".progress_slider", formToReset).slider("value", 0);
}

/*
 * After loading update task modal check is_completed is true or false, is it is
 * true so change status and progress, make status completed and progress 100%.
 */
function setForm(formToSet)
{
	var isComplete = $("#is_complete", formToSet).val();

	if (isComplete == "true")
	{
		// Show slider for progress
		showProgressSlider(100, COMPLETED, formToSet);
	}
	else
	{
		// Show slider for progress
		showProgressSlider($('#progress', formToSet).val(), $('#status', formToSet).val(), formToSet);

		$(".progress_slider", formToSet).slider("value", $('#progress', formToSet).val());
	}
}
// Get user's name and id to add in GroupingMap for owner of task, user name can
// be redundant so we need user's id too.
function getUserDetails()
{
	$.getJSON('/core/api/users', function(users)
	{
		for ( var i in users)
		{
			GroupingMap.OWNER.type[i] = { "name" : users[i].name, "id" : users[i].id };
		}
	}).error(function(data)
	{
		console.log("get user err");
		console.log(data);
	});

}

// Gives heading of task list from due of task
function getHeadingForDueTask(task)
{
	var headingToSearch = null;

	// add to the right task list - overdue, today, tomorrow etc.
	var due = get_due(task.due);

	// OVERDUE
	if (due < 0)
		return headingToSearch = "OVERDUE";

	// Today
	if (due == 0)
		return headingToSearch = "TODAY";

	// Tomorrow
	if (due == 1)
		return headingToSearch = "TOMORROW";

	// Next Week
	if (due > 1)
		return headingToSearch = "LATER";
}

// As per new task list get new due date for task, after task drop
function getNewDueDate(newTaskListId)
{
	var d = new Date();

	// OVERDUE (yesterday)
	if (newTaskListId == "OVERDUE")
		d.setDate(d.getDate() - 1);

	// Today
	if (newTaskListId == "TODAY")
		console.log(getGMTTimeFromDate(d) / 1000);

	// Tomorrow
	if (newTaskListId == "TOMORROW")
		d.setDate(d.getDate() + 1);

	// Later Day after tomorrow
	if (newTaskListId == "LATER")
		d.setDate(d.getDate() + 2);

	return (getGMTTimeFromDate(d) / 1000);
}

// On basis of status return progress value, when criteria is status and task is
// dragged in task lists.
function getProgressValue(status)
{
	if (status == YET_TO_START)
		return 0;
	else if (status == COMPLETED)
		return 100;
	else if (status == IN_PROGRESS)
		return 1;
}

// Get Task id from UI
function getTaskId(element)
{
	if ($(element).hasClass('task-body'))
		return $(element).parent().attr('id');
	else
		return $(element).attr('data');
}

// Get heading of task list
function getTaskListId(element)
{
	return $(element).closest('.list').attr('id');
}

/*
 * Get owner's id when heading of task list is Owner's name, name can be
 * duplicate so get owner's Id.
 */
function getTaskListOwnerId(element)
{
	return $(element).closest('.list').find('.list-header').attr('ownerID');
}

// Get Criteria from dropdown
function getCriteria()
{
	// Get selection from criteria dropdown
	var criteria = $('#type-tasks').data("selected_item");

	// If criteria is not selected then make it default one
	if (!criteria)
		criteria = "CATEGORY";

	return criteria;
}

// Get task list from main-collection by ID
function getTaskList(criteria, taskListId, owner_id)
{
	// Get task list
	if (criteria == "OWNER")
		return TasksListCollection.collection.where({ heading : taskListId, owner_id : parseInt(owner_id) });
	else
		return TasksListCollection.collection.where({ heading : taskListId });
}
/**
 * Caller : Task controller (route) , event on drop down Details: Creates url to
 * fetch data and finds details from map, calls function to create nested
 * collection Input : criteria, owner
 */
function findDetails(criteria, owner)
{
	/*
	 * Creates nested collection 1. If my task or my pending task with owner
	 * criteria is selected so add only one column of current user. 2. If
	 * selected criteria is not owner so follow normal procedure
	 */
	if (criteria == "OWNER" && ($(".selected_name").html() == "My Tasks" || $(".selected_name").html() == "My Pending Tasks"))
		createNestedCollection(criteria, [
			{ "name" : CURRENT_DOMAIN_USER.name, "id" : CURRENT_DOMAIN_USER.id }
		]); // only current
	else
		createNestedCollection(criteria, GroupingMap[criteria].type); // all

	if (criteria == "DUE" || criteria == "OWNER")
	{
		// Url to call DB
		var initialURL = null;

		if (owner == "") // all task
			initialURL = '/core/api/tasks/all';
		else if (owner == "all-pending-tasks")
			initialURL = '/core/api/tasks/allpending';
		else if (owner == "my-pending-tasks")
			initialURL = '/core/api/tasks/my/pendingtasks';
		else
			// my task
			initialURL = '/core/api/tasks/my/tasks';

		createSubCollectionForDueAndOwner(GroupingMap[criteria].type, initialURL, GroupingMap[criteria].searchKey);
	}
	else
	{
		// Url to call DB
		var initialURL = '/core/api/tasks/based' + getParams() + "&type=";
		createSubCollection(GroupingMap[criteria].type, initialURL, GroupingMap[criteria].searchKey);
	}

	// Gives ability of dragging and dropping to tasks in task list.
	setup_sortable_tasks();
}

// Creates nested collection
function createNestedCollection(criteria, criteriaArray)
{
	// Shows loading image untill data gets ready for displaying
	$('#task-list-based-condition').html(LOADING_HTML);

	// Initialize nested collection
	initTaskListCollection();

	// Creates main collection with Task lists
	for ( var i in criteriaArray)
	{
		var newTaskList;

		// Add heading to task list in main collection
		if (criteria == "OWNER")
			newTaskList = { "heading" : criteriaArray[i].name, "owner_id" : criteriaArray[i].id };
		else
			newTaskList = { "heading" : criteriaArray[i] };

		if (!newTaskList)
			return;

		// Add task list in main collection
		TasksListCollection.collection.add(newTaskList);// main-collection
	}

	// Render it
	$('#task-list-based-condition').html(TasksListCollection.render(true).el);
}

// Creates sub collection
function createSubCollectionForDueAndOwner(criteriaArray, initialURL, searchKey)
{
	// Add get requests in queue
	queueGetRequest("task_queue", initialURL, 'json', function success(tasks)
	{
		if (tasks.length != 0)
		{
			for ( var i in tasks)
			{
				if (searchKey == "due") // Due
				{
					var headingToSearch = getHeadingForDueTask(tasks[i]);

					// Add task to relevant task list (sub collection)
					if (headingToSearch != null)
						addTaskToTaskList(headingToSearch, tasks[i], null);
				}
				else
					// Owner
					addTaskToTaskList(tasks[i].taskOwner.name, tasks[i], "OWNER");
			}

			// Creates normal time.
			displayTimeAgo($(".list"));
		}
	}, function error(data)
	{
		console.log("In tasksList error");
		console.log(data);
	});
}

// Creates sub collection
function createSubCollection(criteriaArray, initialURL, searchKey)
{
	// Creates sub collection with Tasks
	for ( var i in criteriaArray)
	{
		// Url to call DB
		var url = initialURL + criteriaArray[i];

		// Add get requests in queue
		queueGetRequest("task_queue", url, 'json', function success(tasks)
		{
			if (!tasks)
				return;

			if (tasks.length != 0)
			{
				// Add task to relevant task list (sub collection)
				addTaskToTaskList(tasks[0][searchKey], tasks, null)
			}
			;
		}, function error(data)
		{
			console.log("In tasksList error");
			console.log(data);
		});
	}
}

// Initialize nested collection
function initTaskListCollection()
{
	TasksListCollection = new Base_Collection_View({ restKey : "task", templateKey : "new-tasks-lists", individual_tag_name : 'div',
		className : "list-area-wrapper", sortKey : 'heading', sort_collection : true, descending : false, postRenderCallback : function(el)
		{
			// Creates normal time.
			displayTimeAgo($(".list"));
		} });

	// Over write append function
	TasksListCollection.appendItem = taskAppend;

	$('#task-list-based-condition').html(TasksListCollection.render().el);
}

// Append sub collection and model
function taskAppend(base_model)
{
	var tasksListModel = new Base_List_View({ model : base_model, "view" : "inline", template : "new-tasks-lists-model", tagName : 'div', className : "list",
		id : base_model.get("heading") });

	var taskCollection = new Base_Collection_View({ url : '/core/api/tasks', templateKey : 'task', individual_tag_name : 'div', sortKey : 'due',
		sort_collection : true, descending : false });

	base_model.set('taskCollection', taskCollection.collection);

	var el = tasksListModel.render().el;

	$('#list-tasks', el).html(taskCollection.render(true).el);
	$('#new-tasks-lists-model-list', this.el).append(el);
}
/**
 * TinyMCE is a platform independent web based Javascript HTML WYSIWYG editor.
 * TinyMCE has the ability to convert HTML TEXTAREA fields or other HTML
 * elements to editor instances.
 * 
 * @author Naresh
 */

/**
 * Sets up tinymce HTML Editor on given selector
 * 
 * @param selector -
 *            id of HTML element e.g., textarea#email-body
 * 
 */
function setupTinyMCEEditor(selector)
{
	// Id undefined
	if (selector === undefined)
	{
		console.log("selector is undefined...");
		return;
	}

	// Init tinymce first time
	if (typeof (tinymce) === "undefined")
	{
		head.js('/js/designer/tinymce/tinymce.min.js', function()
		{
			
			// If loading src script fails
			if(typeof (tinymce) === "undefined")
			{
				console.log("Reloading script...");
				
				// Show confirmation for reload
				if(confirm("Unable to load editor. Click OK to Reload."))
				  location.reload();
				
				return;
			}
			
			tinymce.init({ mode : "exact", selector : selector, plugins : [
				"textcolor link image"
			], menubar : false,
				toolbar1 : "bold italic underline | alignleft aligncenter alignright alignjustify | link image | formatselect | fontselect | fontsizeselect",
				toolbar2 : "bullist numlist | outdent indent blockquote | forecolor backcolor | merge_fields", valid_elements : "*[*]",
				toolbar_items_size: 'small',
				extended_valid_elements : "*[*]", setup : function(editor)
				{
					editor.addButton('merge_fields', { type : 'menubutton', text : 'Agile Contact Fields', icon : false, menu : set_up_merge_fields(editor) });
				} });
		});
		return;
	}

	// if tinymce instance exists, reinitialize tinymce on given selector
	if (selector.indexOf('#') !== -1)
		selector = selector.split('#')[1];

	// reinitialize tinymce
	reinitialize_tinymce_editor_instance(selector);
		
	// reset previous content
    set_tinymce_content(selector, '');
		
}

/**
 * Sets given content in tinymce.
 * 
 * @param selector -
 *            id of an element without '#' e.g., email-body
 * @param content -
 *            content to be inserted
 * 
 */
function set_tinymce_content(selector, content)
{
	try
	{
		if(typeof (tinymce) !== "undefined")
			tinymce.get(selector).setContent(content);
	}
	catch (err)
	{
		console.log("error occured while setting content...");
		console.log(err)
	}
}

/**
 * Saves tinymce content back to textarea.
 * 
 * @param selector -
 *            id of an element without '#'
 */
function save_content_to_textarea(selector)
{
	try
	{
		if(typeof (tinymce) !== "undefined")
			tinymce.get(selector).save();
	}
	catch (err)
	{
		console.log("error occured while saving content to textarea...");
		console.log(err)
	}
}

/**
 * 
 * Triggers all tinymce editors save. It is used in base-modal to save
 * content back to textarea before form serialization.
 * 
 **/
function trigger_tinymce_save()
{
	try
	{
		if(typeof (tinymce) !== "undefined")
			tinymce.triggerSave();
	}
	catch(err)
	{
		console.log("error occured while triggering tiny save...");
		console.log(err);
	}
}
/**
 * Re-initialize HTML Editor on given selector using existing tinymce.
 * 
 * @param selector -
 *            id of an element without '#'
 */
function reinitialize_tinymce_editor_instance(selector)
{
	try
	{
		// Calling duplicate instances won't setup tinymce. So remove previous
		// instance
		remove_tinymce_editor_instance(selector);

		// Adds tinymce
	    tinymce.EditorManager.execCommand('mceAddEditor', true, selector);
	
	}
	catch (err)
	{
		console.log("error occured while reinitializing tinymce...");
		console.log(err)
	}
}

/**
 * Removes tinymce instance on given selector
 * 
 * @param selector -
 *            id of an element without '#'
 */
function remove_tinymce_editor_instance(selector)
{
	try
	{
		tinymce.EditorManager.execCommand("mceRemoveEditor", false, selector);
	}
	catch (err)
	{
		console.log("error occured while removing tinymce editor instance...");
		console.log(err);
	}

}

/**
 * Set up merge fields as menu button in Editor
 * 
 * @param editor -
 *            editor instance
 */
function set_up_merge_fields(editor)
{
	var menu = [];

	var contact_json;

	// Get Current Contact json for merge fields
	if (App_Contacts.contactDetailView != undefined && App_Contacts.contactDetailView.model != undefined)
		contact_json = get_contact_json_for_merge_fields();

	// Iterates over merge fields and builds merge fields menu
	$.each(get_merge_fields(), function(key, value)
	{

		var menu_item = {};

		menu_item["text"] = key;
		menu_item["onclick"] = function()
		{

			// Insert value without compiling
			if (Current_Route === "bulk-email" || Current_Route.indexOf('email-template') != -1)
			{
				editor.insertContent(value);
			}
			else
			{
				var template = Handlebars.compile(value);
				var compiled_template;

				try
				{
					compiled_template = template(contact_json);
				}
				catch(err)
				{
					console.log("error.....");
					
					// Handlebars need [] if json keys have spaces
					value = '{{['+key+']}}';
					
					template = Handlebars.compile(value);
					compiled_template = template(contact_json);
				}
				
				editor.insertContent(compiled_template + '');
			}
		};

		menu.push(menu_item);

	});

	return menu;
}

/**
 * Returns merge fields that includes custom fields
 * 
 */
function get_merge_fields()
{
	var options = {
	"First Name": "{{first_name}}",
	"Last Name": "{{last_name}}",
	"Score": "{{score}}",
	"Email": "{{email}}",
	"Company": "{{company}}",
	"Title": "{{title}}",
	"Address": "{{location.address}}",
	"City": "{{location.city}}",
	"State":"{{location.state}}",
	"Country":"{{location.country}}",
	"Owner Name":"{{owner.name}}",
	"Owner Email":"{{owner.email}}"
	}

	// Get Custom Fields in template format
	var custom_fields = get_custom_merge_fields();

	// Merges options json and custom fields json
	var merged_json = merge_jsons({}, options, custom_fields);

	return merged_json;
}

/**
 * Returns custom fields data in JSON
 */
function get_custom_fields()
{
	// Sends GET request for customfields.
	var msg = $.ajax({ type : "GET", url : '/core/api/custom-fields', async : false, dataType : 'json' }).responseText;

	// Parse stringify json
	return JSON.parse(msg);
}

/**
 * Returns custom fields in format required for merge fields. E.g., Nick
 * Name:{{[Nick Name]}}. Handlebars need to have square brackets for json keys
 * having space
 */
function get_custom_merge_fields()
{
	var data = get_custom_fields();

	var customfields = {};

	// Iterate over data and get field labels of each custom field
	$.each(data, function(index, obj)
	{
		// Iterate over single custom field to get field-label
		$.each(obj, function(key, value)
		{

			// Needed only field labels for merge fields
			if (key == 'field_label')
				customfields[value] = "{{" + value + "}}"
		});
	});

	return customfields;
}
/**
 * Returns merged json of two json objects
 */
function merge_jsons(target, object1, object2)
{
	return $.extend(target, object1, object2);
}


/**
 * Returns json required for merge fields in Editor
 */
function get_contact_json_for_merge_fields()
{
	// Compile templates immediately in Send email but not for bulk contacts
	if (App_Contacts.contactDetailView != undefined && App_Contacts.contactDetailView.model != undefined)
	{
		// Get Current Contact
		var contact_json = App_Contacts.contactDetailView.model.toJSON();
		contact_property_json = get_property_JSON(contact_json);
		
		try
		{
			contact_property_json["score"]= contact_json["lead_score"];
			contact_property_json["location"] = JSON.parse(contact_property_json["address"]);
		}
		catch(err)
		{
			
		}
		
		return merge_jsons({}, {"owner":contact_json.owner}, contact_property_json);
		
	}  
}

function add_square_brackets_to_merge_fields(text)
{
	// Matches all strings within {{}}. e.g., {{first_name}}, {{New Note}}
	var t = text.match(/{{[a-zA-Z0-9 ]*[a-zA-Z0-9 ]}}/g);
	
	if(t)
	{
		// Change {{New Note}}  to {{[New Note]}}. 
		// Handlebars allow keys having spaces, 
		// within square brackets
		for(var i=0; i < t.length;i++)
		{
			text = text.replace(t[i], '{{['+t[i].match(/{{(.*?)}}/)[1]+']}}');
		}
	};
	
	return text;
}
/**
 * Loads widgets on a contact, creates a collection view
 */
var Widgets_View;

/**
 * Loads all the widgets for the current agile user
 * 
 * @param el
 * @param contact
 */
function loadWidgets(el, contact)
{

	// Create Data JSON
	var data = { contact : contact };

	/*
	 * If Widgets_View is not defined , creates collection view, collection is
	 * sorted based on position i.e., set when sorted using jquery ui sortable
	 */
	if (!Widgets_View)
	{
		Widgets_View = new Base_Collection_View({ url : '/core/api/widgets', restKey : "widget", templateKey : "widgets", individual_tag_name : 'li',
			sortKey : 'position', modelData : data, postRenderCallback : function(widgets_el)
			{
				head.load("css/misc/agile-widgets.css", function(){
					set_up_widgets(el, widgets_el);
				})
				
			} });

		/*
		 * Fetch widgets from collection and set_up_widgets (load their scripts)
		 */
		Widgets_View.collection.fetch();

		// show widgets
		var newEl = Widgets_View.render().el;
		$('#widgets', el).html(newEl);

	}
	else
	{
		/*
		 * Have a flag, which is used to check whether widgets are already
		 * loaded. This avoid unnecessary loading.
		 */
		var flag = false;

		$(el).live('view_loaded', function(e)
		{
			//alert("loaded");
			if (flag == false)
			{
				flag = true;

				// Sort needs to be called as there could be position change
				Widgets_View.collection.sort();

				$('#widgets', el).html(Widgets_View.render(true).el);

				// Sets up widget
				set_up_widgets(el, Widgets_View.el);

			}

		});
	}

	/*
	 * Called on click of icon-minus on widgets, collapsed class is added to it
	 * and sets "is_minimized" field of widget as true, we check this while
	 * loading widgets and skip loading widget if it is minimized
	 */
	$('.widget-minimize').die().live('click', function(e)
	{
		e.preventDefault();
		var widget_name = $(this).attr('widget');

		// content in widget is hidden
		$("#" + widget_name).collapse('hide');
		$(this).removeClass();

		$(this).addClass('collapsed');
		$(this).addClass('widget-maximize');
		$(this).addClass('icon-plus');

		// Get widget from collection by widget name
		var widget = Widgets_View.collection.where({ name : widget_name })[0]
		var widgetJSON = widget.toJSON();

		// set "is_minimized" field of widget as true
		widget.set({ 'is_minimized' : true }, { silent : true });
		widgetJSON['is_minimized'] = true;

		// Get model and save widget
		var model = new BaseModel();
		model.url = "core/api/widgets";
		model.save(widgetJSON, { silent : true });

	});

	/*
	 * Called on click of icon-plus on widgets, sets "is_minimized" field of
	 * widget as false, we check this while loading widgets and skip loading
	 * widget if it is minimized
	 */
	$('.widget-maximize').die().live('click', function(e)
	{
		e.preventDefault();
		var widget_name = $(this).attr('widget');

		// Get widget from collection by widget name
		var widget = Widgets_View.collection.where({ name : widget_name })[0];
		var widgetJSON = widget.toJSON();

		// set "is_minimized" field of widget as false
		widgetJSON['is_minimized'] = false;
		widget.set({ 'is_minimized' : false }, { silent : true })

		// Get model and save widget
		var model = new BaseModel();
		model.url = "core/api/widgets";
		model.save(widgetJSON, { silent : true });

		// Stores boolean whether widget has class collapsed
		var is_collapsed = $(this).hasClass('collapsed');
		$(this).removeClass();

		$(this).addClass('widget-minimize');
		$(this).addClass('icon-minus');

		/*
		 * If is collapsed, script is already loaded, show the content in widget
		 * and return
		 */
		if (is_collapsed)
		{
			$("#" + widget_name).collapse('show');
			return;
		}

		// else load the script
		$.get(widget.get('url'), 'script');

	});
}

/**
 * Loads the scripts of widgets which are not minimized and enables sorting
 * functionality on widgets
 * 
 * @param el
 * @param widgets_el
 */
function set_up_widgets(el, widgets_el)
{
	/*
	 * Iterates through all the models (widgets) in the collection, and scripts
	 * are loaded from the URL in the widget
	 */
	_(Widgets_View.collection.models).each(function(model)
	{
		// In case collection is not empty
		var id = model.get("id");
		var url = model.get("url");

		model.set('selector', model.get('name').replace( / +/g, ''));
		
		/*
		 * Set the data element in the div so that we can retrieve this in get
		 * plugin preferences
		 */
		$('#' + model.get('selector'), widgets_el).data('model', model);

		var contact_id = App_Contacts.contactDetailView.model.get("id");
		/*
		 * Checks if widget is minimized, if minimized script is not loaded
		 */
		if (!model.get("is_minimized") && model.get("widget_type") != "CUSTOM")
		{
			getTemplate(model.get('name').toLowerCase(),{}, "yes", function(){
				queueGetRequest("_widgets_"+contact_id , url, "script");
			});
		}

		/*
		 * For custom widgets we load the scripts using HTTP connections and
		 * store the script in script field of widget object, that is retrieved
		 * and appended in the body
		 */
		if (model.get("widget_type") == "CUSTOM")
		{
			
			if($('#' + model.get('selector') + '-container').length)
			{
				setup_custom_widget(model, widgets_el)
			}
			else
			$('#' + model.get('selector') + '-container', widgets_el).show('0', function(e) {
				setup_custom_widget(model, widgets_el)
			 });
		}
	}, this);

	enableWidgetSoring(widgets_el);

}

function setup_custom_widget(model, widgets_el)
{
	//$('form', this).focus_first();
	if (model.get('script'))
		$('#' + model.get('selector'), widgets_el).html(model.get('script'));
	else
		getScript(model, function(data)
		{
			console.log(data);
			$('#' + model.get('selector'), widgets_el).html(data);
		});
}

function getScript(model, callback)
{
	// Gets contact id, to save social results of a particular id
	var contact_id = agile_crm_get_contact()['id'];

	$.post("core/api/widgets/script/" + contact_id + "/" + model.get("name"), function(data)
	{

		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(data);
	}).error(function(data)
	{
		console.log(data);
		console.log(data.responseText);
	});
}

/**
 * Enables sorting on widgets by loading jquery-ui to get sortable functionality
 * on widgets. Whenever widget is sorted, it saves the new positions of widgets
 * 
 * @param el
 */
function enableWidgetSoring(el)
{
	// Loads jquery-ui to get sortable functionality on widgets
	head.js(LIB_PATH + 'lib/jquery-ui.min.js', function()
	{
		$('.widget-sortable', el).sortable();

		// Makes icon-move on widgets panel as handle for sorting
		$('.widget-sortable', el).sortable("option", "handle", ".icon-move");

		/*
		 * This event is called after sorting stops to save new positions of
		 * widgets
		 */
		$('.widget-sortable', el).on(
				"sortstop",
				function(event, ui)
				{
					var models = [];

					/*
					 * Iterate through each all the widgets and set each widget
					 * position and store it in array
					 */
					$('.widget-sortable > li', el).each(function(index, element)
					{
						var model_name = $(element).find('.widgets').attr('id');

						// Get Model, model is set as data to widget element
						var model = $('#' + model_name).data('model');

						model.set({ 'position' : index }, { silent : true });

						models.push({ id : model.get("id"), position : index });
					});

					// Saves new positions in server
					$.ajax({ type : 'POST', url : '/core/api/widgets/positions', data : JSON.stringify(models),
						contentType : "application/json; charset=utf-8", dataType : 'json' });
				});
	});
}

/**
 * Initializes an ajax queue with GET request for the given URL with the given
 * queue name
 * 
 * <p>
 * Requests with the same queue name are processes synchronously one after the
 * other. This method is used by widgets
 * </p>
 * 
 * @param queueName
 *            Name of the queue
 * @param url
 *            URL to make request
 * @param dataType
 *            Type of data to be retrieved
 * @param successcallback
 *            Function to be executed on success
 * @param errorCallback
 *            Function to be executed on error
 */
function queueGetRequest(queueName, url, dataType, successCallback, errorCallback)
{
	// Loads ajaxq to initialize queue
	head.js('/js/lib/ajaxm/ajaxq.js', function()
	{
		/*
		 * Initialize a queue, with GET request
		 */
		$.ajaxq(queueName, { url : url, cache : false, dataType : dataType,

		// function to be executed on success, if successCallback is defined
		success : function(data)
		{
			if (successCallback && typeof (successCallback) === "function")
				successCallback(data);
		},

		// function to be executed on success, if errorCallback is defined
		error : function(data)
		{
			if (errorCallback && typeof (errorCallback) === "function")
				errorCallback(data);
		},

		// function to be executed on completion of queue
		complete : function(data)
		{
			console.log('completed get');
		}, });
	});
}

/**
 * Initializes an ajax queue with POST request for the given URL with the given
 * queue name
 * 
 * <p>
 * Requests with the same queue name are processes synchronously one after the
 * other. This method is used by widgets
 * </p>
 * 
 * @param queueName
 *            Name of the queue
 * @param url
 *            URL to make request
 * @param dataType
 *            Type of data to be retrieved
 * @param successcallback
 *            Function to be executed on success
 * @param errorCallback
 *            Function to be executed on error
 */
function queuePostRequest(queueName, url, data, successcallback, errorCallback)
{
	// Loads ajaxq to initialize queue
	head.js('/js/lib/ajaxm/ajaxq.js', function()
	{
		/*
		 * Initialize a queue, with POST request
		 */
		$.ajaxq(queueName, { type : 'POST', url : url, cache : false, data : data,

		// function to be executed on success, if successCallback is defined
		success : function(data)
		{
			if (successcallback && typeof (successcallback) === "function")
				successcallback(data);
		},

		// function to be executed on success, if errorCallback is defined
		error : function(data)
		{
			if (errorCallback && typeof (errorCallback) === "function")
				errorCallback(data);
		},

		// function to be executed on completion of queue
		complete : function(data)
		{
			console.log('completed post');
		} });
	});
}

/**
 * Shrink the widget header name width
 * 
 * <p>
 * Shows the icons and decrease the width of widget header to avoid the widget
 * name overflow on mouse hover
 * 
 * @param el
 *            Element on which mouse entered (widget header)
 */
function showIcons(el)
{
	// Shows widget icons on hover
	$(el).find('div.widget_header_icons').show();

	// Changes width of widget name
	$(el).find('div.widget_header_name').css({ "width" : "40%" });
}

/**
 * Expand the widget header name width.
 * 
 * <p>
 * Hide the icons and use the remaining width in widget header name DIV on mouse
 * leave
 * </p>
 * 
 * @param el
 *            Element on which mouse left (widget header)
 */
function hideIcons(el)
{
	// Hide widget icons on hover
	$(el).find('div.widget_header_icons').hide();

	// Changes width of widget name
	$(el).find('div.widget_header_name').css({ "width" : "80%" });
}
/**
 * widget-model.js manages the widgets, adding/deleting widgets. When user
 * chooses to add/manage widgets from any contact detailed view, list of
 * available widgets are shown to add or delete if already added.
 */
var Catalog_Widgets_View = null;

// Show when Add widget is selected by user in contact view
/**
 * pickWidget method is called when add/manage widgets link in contact details
 * is clicked, it creates a view of widget collection showing add/delete based
 * on is_added variable in widget model, which is checked in template using
 * handle bars
 */
function pickWidget()
{
	Catalog_Widgets_View = new Base_Collection_View({ url : '/core/api/widgets/default', restKey : "widget", templateKey : "widgets-add",
		sort_collection : false, individual_tag_name : 'div', postRenderCallback : function(el)
		{
			build_custom_widget_form(el);

		} });

	// Append widgets into view by organizing them
	Catalog_Widgets_View.appendItem = organize_widgets;

	// Fetch the list of widgets
	Catalog_Widgets_View.collection.fetch();

	// Shows available widgets in the content
	$('#prefs-tabs-content').html(Catalog_Widgets_View.el);
	$('#PrefsTab .active').removeClass('active');
    $('.add-widget-prefs-tab').addClass('active');
}

/**
 * Organizes widgets into different categories like (SOCIAL, SUPPORT, EMAIL,
 * CALL, BILLING.. etc) to show in the add widget page, based on the widget_type
 * fetched from Widget object
 * 
 * @param base_model
 */
function organize_widgets(base_model)
{
	var itemView = new Base_List_View({ model : base_model, template : this.options.templateKey + "-model", tagName : 'div', });

	// Get widget type from model (widget object)
	var widget_type = base_model.get('widget_type');

	/*
	 * Appends the model (widget) to its specific div, based on the widget_type
	 * as div id (div defined in widget_add.html)
	 */
	if (widget_type == "SOCIAL")
		$('#social', this.el).append($(itemView.render().el).addClass('span4').css("margin-left", "0px"));

	if (widget_type == "SUPPORT")
		$('#support', this.el).append($(itemView.render().el).addClass('span4').css("margin-left", "0px"));

	if (widget_type == "EMAIL")
		$('#email', this.el).append($(itemView.render().el).addClass('span4').css("margin-left", "0px"));

	if (widget_type == "CALL")
		$('#call', this.el).append($(itemView.render().el).addClass('span4').css("margin-left", "0px"));

	if (widget_type == "BILLING")
		$('#billing', this.el).append($(itemView.render().el).addClass('span4').css("margin-left", "0px"));

	if (widget_type == "CUSTOM")
		$('#custom', this.el).append($(itemView.render().el).addClass('span4').css("margin-left", "0px"));
}

/**
 * Add/ Delete button are shown in the widget based on the attribute is_added in
 * widget model, Add and delete functionalities of the widgets are defined in
 * this init function
 */
$(function()
{
	// adding widget
	/**
	 * When user clicks on add-widget, gets the widget-name which is set to add
	 * anchor tag and gets the model from the collection with widget name and
	 * add widget then navigates back to the contact-details page
	 */
	$('.install-custom-widget').live('click', function(e)
	{

		e.preventDefault();
		console.log($(this));
		
		/* We make add button on a widget disabled on click of it. This is done
		 * to avoid continuous click in a short time, like double click on add
		 * button
		 */
		if ($(this).attr("disabled"))
			return;

		// set attribute disabled as disabled
		$(this).attr("disabled", "disabled");

		// Reads the name of the widget to be added
		var widget_name = $(this).attr('widget-name');

		console.log('In add widget');
		console.log(widget_name);

		if (Catalog_Widgets_View == null)
			return;

		
		 /* Get widget model from collection based on the name attribute of the
		 * widget model
		 */
		var models = Catalog_Widgets_View.collection.where({ name : widget_name });

		
		 /* Saves widget model and on success navigate back to contact detailed
		 * view
		 */
		var widgetModel = new Backbone.Model();

		console.log(widgetModel);

		// URL to connect with widgets
		widgetModel.url = '/core/api/widgets';

		widgetModel.save(models[0].toJSON(), { success : function(data)
		{
			// Checks if Widget_View is defined and adds widget to collection
			if (Widgets_View && Widgets_View.collection)
				Widgets_View.collection.add(new BaseModel(data.toJSON()));


			data.set('is_added', true);
			models[0].set(data);

		} });

	});

	// Deleting widget
	/**
	 * When user chooses to delete a widget, on confirmation sends delete
	 * request based on the name of the widget
	 */
	$('#delete-widget').die().live('click', function(e)
	{
		// Fetch widget name from the widget on which delete is clicked
		var widget_name = $(this).attr('widget-name');

		// If not confirmed to delete, return
		if (!confirm("Are you sure to delete " + widget_name))
			return;
		
		delete_widget(widget_name);
		if(widget_name == "Linkedin")
			$('#Linkedin-container').hide();

		});

	$('#remove-widget').die().live('click', function(e)
	{
		// Fetch widget name from the widget on which delete is clicked
		var widget_name = $(this).attr('widget-name');

		// If not confirmed to delete, return
		if (!confirm("Are you sure to remove " + widget_name))
			return;

		/*
		 * Sends Delete request with widget name as path parameter, and on
		 * success fetches the widgets to reflect the changes is_added, to show
		 * add widget in the view instead of delete option
		 */
		$.ajax({ type : 'DELETE', url : '/core/api/widgets/remove/' + widget_name, contentType : "application/json; charset=utf-8",

		success : function(data)
		{
			update_collection(widget_name);
			
			// Call fetch on collection to update widget models
			 Catalog_Widgets_View.collection.fetch();

		}, dataType : 'json' });
	});
	
	
	

});

function delete_widget(widget_name)
{
	/*
	 * Sends Delete request with widget name as path parameter, and on
	 * success fetches the widgets to reflect the changes is_added, to show
	 * add widget in the view instead of delete option
	 */
	$.ajax({ type : 'DELETE', url : '/core/api/widgets/' + widget_name, contentType : "application/json; charset=utf-8",

	success : function(data)
	{

		Catalog_Widgets_View.collection.where({ name : widget_name })[0].set('is_added', false);
		update_collection(widget_name);
		
	}, dataType : 'json' });

}

function update_collection(widget_name)
{
	/*
	 * If Widgets_View is defined, remove widgets from widget collection
	 */
	if (Widgets_View && Widgets_View.collection)
	{
		// Fetch widget from collection based on widget_name
		var model = Widgets_View.collection.where({ name : widget_name });
		Widgets_View.collection.remove(model);
	}

	
}

function build_custom_widget_form(el)
{
	var divClone;

	$('#add-custom-widget').die().live(
			'click',
			function(e)
			{
				divClone = $("#custom-widget").clone();
				var widget_custom_view = new Base_Model_View({ url : "/core/api/widgets/custom", template : "add-custom-widget", isNew : true,
					postRenderCallback : function(el)
					{
						console.log('In post render callback');
						console.log(el);

						$('#script_type').die().live('change', function(e)
						{
							var script_type = $('#script_type').val();
							if (script_type == "script")
							{
								$('#script').show();
								$('#url').hide();
								return;
							}

							if (script_type == "url")
							{
								$('#script').hide();
								$('#url').show();
							}
						});

					}, saveCallback : function(model)
					{
						console.log('In save callback');

						console.log(model);

						if (model == null)
							alert("A widget with this name exists already. Please choose a different name");

						Catalog_Widgets_View.collection.add(model);
						$("#custom-widget").replaceWith(divClone);
					} });

				$('#custom-widget', el).html(widget_custom_view.render(true).el);

				$('#cancel_custom_widget').die().live('click', function(e)
				{
					// Restore element back to original
					$("#custom-widget").replaceWith(divClone); 
				});
			});
}
/**
 * THIRD PARTY SCRIPTS - PLUGINS - INTEGRATION POINTS.
 * 
 * agile_widgets.js defines third party JavaScript API.
 * Functionalities provided by script API are
 * <pre>
 * -- Return widget object by widget name			 : agile_crm_get_widget(pluginName)
 * -- Return widget preferences by widget name	     : agile_crm_get_widget_prefs(pluginName)
 * -- Save widget preferences  by widget name		 : agile_crm_save_widget_prefs(pluginName, preferences)
 * -- Delete widget preferences by widget name       : agile_crm_delete_widget_prefs(pluginName, callback)
 * -- Saves widget property to contact               : agile_crm_save_widget_property_to_contact(propertyName, value)
 * -- Retrieves widget property from current contact : agile_crm_get_widget_property_from_contact(propertyName)
 * -- Delete widget property from current contact	 : agile_crm_delete_widget_property_from_contact(propertyName)
 * -- Retrieves current contact object				 : agile_crm_get_contact()
 * -- Retrieves property of current contact 	     : agile_crm_get_contact_property(propertyName)
 * -- Retrieves properties list of current contact   : agile_crm_get_contact_properties_list(propertyName)
 * -- Retrieves contact property value by subtype    : agile_crm_get_contact_property_by_subtype(propertyName, subtype)
 * -- Save property to contact for given subtype     : agile_crm_save_contact_property(propertyName, subtype, value, type)
 * -- Updating a contact by specifying property name : agile_crm_update_contact(propertyName, Value)
 * -- Updates contact properties with given values   : agile_crm_update_contact_properties(propertiesArray, callback)
 * -- Delete value given from contact by subtype     : agile_crm_delete_contact_property_by_subtype(propertyName, subtype, value)
 * -- Add Note to current contact					 : agile_crm_add_note(subject, description)
 * </pre>
 */

/**
 * Searches the property fields in current contact with given property name, if
 * property with given property name exists, then returns its value as string
 * 
 * @param propertyName
 *            name of the property
 */
function agile_crm_get_contact_property(propertyName)
{
	// Reads current contact model form the contactDetailView
	var contact_model = App_Contacts.contactDetailView.model;

	// Gets properties field list from contact
	var properties = contact_model.get('properties');
	var property_value;

	/*
	 * Iterates through each property in contact properties and checks for the
	 * match in it for the given property name and retrieves value of the
	 * property if it matches
	 */
	$.each(properties, function(index, property)
	{
		if (property.name == propertyName)
		{
			property_value = property.value;
			return false;
		}
	});

	// If property value is defined then return it
	if (property_value)
		return property_value;

}

/**
 * Searches the property fields in current contact with given property name, if
 * property with given property name exists, then returns its value in a array
 * 
 * <p>
 * This method is used when contact property has multiple values like email,
 * phone, website etc
 * </p>
 * 
 * @param propertyName
 *            name of the property
 * @returns {Array}
 */
function agile_crm_get_contact_properties_list(propertyName)
{
	// Reads current contact model form the contactDetailView
	var contact_model = App_Contacts.contactDetailView.model;

	// Gets properties list field from contact
	var properties = contact_model.get('properties');
	var property_list = [];

	/*
	 * Iterates through each property in contact properties and checks for the
	 * match in it for the given property name and retrieves value of the
	 * property if it matches
	 */
	$.each(properties, function(index, property)
	{
		if (property.name == propertyName)
		{
			property_list.push(property);
		}
	});

	// If property is defined then return property value list
	return property_list;

}

/**
 * Updates a contact based on the property name and its value specified. If
 * property name already exists with the given then replaces the value, if
 * property is new then creates a new field and saves it
 * 
 * @param propertyName:
 *            Name of the property to be created/updated
 * @param value :
 *            value for the property
 */
function agile_crm_update_contact(propertyName, value, callback)
{
	// Gets current contact model from the contactDetailView object
	var contact_model = App_Contacts.contactDetailView.model;

	// Reads properties fied from the contact
	var properties = contact_model.toJSON()['properties'];
	var flag = false;

	/*
	 * Iterates through each property in contact properties and checks for the
	 * match in it for the given property name and if match is found, updates
	 * the value of it with the given value
	 */
	$.each(properties, function(index, property)
	{
		if (property.name == propertyName)
		{
			// flag is set true to indicate property already exists in contact
			flag = true;
			property.value = value;
			return false;
		}
	});

	// If flag is false, given property is new then new field is created
	if (!flag)
		properties.push({ "name" : propertyName, "value" : value, "type" : "CUSTOM" });

	contact_model.set({ "properties" : properties }, { silent : true });
	contact_model.url = "core/api/contacts";

	// Save model
	contact_model.save({ success : function(model, response)
	{
		if (callback && typeof (callback) == "function")
			callback();
	} }, { silent : true });

}

/**
 * Updates a contact with the list of property name and its value specified in
 * propertiesArray. If property name already exists with the given then replaces
 * the value, if property is new then creates a new field and saves it
 * 
 * @param propertiesArray
 *            Array of the properties to be created/updated
 * @param callback
 */
function agile_crm_update_contact_properties(propertiesArray, callback)
{
	// Gets current contact model from the contactDetailView object
	var contact_model = App_Contacts.contactDetailView.model;

	// Reads properties field from the contact
	var properties = contact_model.toJSON()['properties'];

	// Iterates for each property in properties list
	for ( var i in propertiesArray)
	{
		var flag = false;

		// Iterates through each property in contact properties
		$.each(properties, function(index, property)
		{
			/*
			 * checks for the match with given property name in properties list
			 * and if match is found and if given properties has no subtype,
			 * updates the value of it with the given value
			 */
			if (property.name == propertiesArray[i].name)
			{
				// flag is set true to indicate property is not new
				flag = true;

				/*
				 * If given properties list has subtype, then update the value
				 * of it, else flag is set false to indicate it as new property
				 */
				if (propertiesArray[i].subtype)
				{
					if (propertiesArray[i].subtype == property.subtype)
						property.value = propertiesArray[i].value;
					else
						flag = false;
				}
				else
					property.value = propertiesArray[i].value;

				// break each if match is found
				return false;
			}
		});

		// If flag is false, given property is new then new field is created
		if (!flag)
			properties
					.push({ "name" : propertiesArray[i].name, "value" : propertiesArray[i].value, "subtype" : propertiesArray[i].subtype, "type" : "CUSTOM" });

	}

	// If property is new then new field is created
	contact_model.set({ "properties" : properties }, { silent : true });
	contact_model.url = "core/api/contacts";

	// Save model
	contact_model.save({ success : function(model, response)
	{
		console.log('contact saving ');
		if (callback && typeof (callback) == "function")
			callback();
	} }, { silent : true });
}

/**
 * Retrieves current contact from model
 * 
 * @returns
 */
function agile_crm_get_contact()
{
	return App_Contacts.contactDetailView.model.toJSON();
}

/**
 * Adds note to current contact
 * 
 * @param sub
 * @param description
 */
function agile_crm_add_note(subject, description)
{
	// Get Current Contact Model
	var contact_model = App_Contacts.contactDetailView.model;

	// Get ID
	var note = new Backbone.Model();
	var contactModel = new Backbone.Model();
	note.url = 'core/api/notes';

	note.set("subject", subject);
	note.set("description", description);

	note.set("contacts", [
		contact_model.id.toString()
	]);

	note.save();
	// Create Model and Save
}

/**
 * Retrieves plugin object based on the plugin name specified
 * 
 * @param pluginName :
 *            name of the plugin to fetch
 */
function agile_crm_get_widget(pluginName)
{
	pluginName = pluginName.replace(/ +/g, '');
	console.log('plugin name ' + pluginName);

	/*
	 * Retrieves plugin data from the model data which is set to plugin block
	 * while loading plugins
	 */
	console.log($('#' + pluginName));
	var model_data = $('#' + pluginName, App_Contacts.contactDetailView.el).data('model');

	console.log(model_data);

	return model_data.toJSON();
}

/**
 * Retrieves plugin preferences based on the name of the plugin
 * 
 * @param pluginName :
 *            name of the plugin to get preferences
 * @returns plugin preferences
 */
function agile_crm_get_widget_prefs(pluginName)
{
	pluginName = pluginName.replace(/ +/g, '');
	console.log("in get widget prefs " + pluginName);
	// Gets data attribute of from the plugin, and return prefs from that object
	return $('#' + pluginName, App_Contacts.contactDetailView.el).data('model').toJSON().prefs;
}

/**
 * Saves given widget preferences to current user based on given plugin name.
 * 
 * @param pluginName :
 *            name of the plugin specified, to associate preferences
 * @param prefs :
 *            preferences to be saved
 */
function agile_crm_save_widget_prefs(pluginName, prefs, callback)
{
	console.log(pluginName);
	pluginName = pluginName.replace(/ +/g, '');

	console.log(App_Contacts.contactDetailView.el);
	console.log($('#' + pluginName, App_Contacts.contactDetailView.el));

	// Get the model from the the element
	var widget = $('#' + pluginName, App_Contacts.contactDetailView.el).data('model');

	console.log(widget);
	// Set changed preferences to widget backbone model
	widget.set({ "prefs" : prefs }, { silent : true });

	// URL to connect with widgets
	widget.url = "core/api/widgets"

	console.log(widget);

	var model = new BaseModel();
	model.url = "core/api/widgets";
	model.save(widget.toJSON(), { success : function(data)
	{
		console.log(data);
		console.log("Saved widget: " + data.toJSON());
		
		// Set the changed model data to respective plugin div as data
		$('#' + pluginName, App_Contacts.contactDetailView.el).data('model', widget);
		
		if (callback && typeof (callback) === "function")
		{
			console.log("in save callback");
			console.log(data.toJSON());
			// Execute the callback, passing parameters as necessary
			callback(data.toJSON());
		}
	} }, { silent : true });

}

/**
 * Deletes widget preferences saved in widget under the field prefs in widget
 * object
 * 
 * @param pluginName
 *            name of the plugin specified
 */
function agile_crm_delete_widget_prefs(pluginName, callback)
{
	// saves prefs as undefined
	agile_crm_save_widget_prefs(pluginName, undefined, callback);
}

/**
 * Returns widget property value from widget_properties field in contact
 * 
 * @param propertyName :
 *            name(key) of the property value stored in widget_properties JSON
 * @Return widget property value
 * 
 */
function agile_crm_get_widget_property_from_contact(propertyName)
{

	// Gets Current Contact Model
	var contact_model = App_Contacts.contactDetailView.model;

	// Gets WidgetProperties from Contact Model
	var widget_properties = contact_model.get('widget_properties');

	// If widget-properties are null return
	if (!widget_properties)
		return;

	// Converts JSON string to JSON Object
	widget_properties = JSON.parse(widget_properties);

	// Returns value of property from widget_properties JSON
	return widget_properties[propertyName];
}

/**
 * Deletes widget property, the property key value pair from widget_properties
 * JSON string in contact based on given property name
 * 
 * @param propertyName :
 *            Name of the property to be deleted
 */
function agile_crm_delete_widget_property_from_contact(propertyName)
{

	// Gets Current Contact Model from contactDetailView object
	var contact_model = App_Contacts.contactDetailView.model;

	// Gets WidgetProperties from Contact Model
	var widget_properties = contact_model.get('widget_properties');

	// If widget-properties id null return
	if (!widget_properties)
		return;

	/*
	 * If widget_properties are not null, then convert widget_properties string
	 * in to JSON object
	 */
	widget_properties = JSON.parse(widget_properties);

	// deletes value from JSON
	delete widget_properties[propertyName];

	// set Updated widget_properties in to contact model
	contact_model.set("widget_properties", JSON.stringify(widget_properties));

	contact_model.url = "core/api/contacts";

	// Save updated contact model
	contact_model.save();
}

/**
 * Retrieves property value from current contact based on given property name
 * and sub type of the property
 * 
 * @param propertyName
 *            Name of the property
 * @param subtype
 *            Subtype of the property
 */
function agile_crm_get_contact_property_by_subtype(propertyName, subtype)
{

	// Reads current contact model form the contactDetailView
	var contact_model = App_Contacts.contactDetailView.model;

	// Gets properties list field from contact
	var properties = contact_model.get('properties');
	var property;

	// Iterates though each property and finds the value related to the property
	// name
	$.each(properties, function(key, value)
	{
		if (value.name == propertyName && value.subtype == subtype)
		{
			property = value;
		}
	});

	// If property is defined then return property value
	if (property)
		return property.value;

}

/**
 * Deletes contact property value from contact based on given property name and
 * sub type of the property and value of the property
 * 
 * @param propertyName
 *            Name of the property
 * @param subtype
 *            Subtype of the property
 * @param value
 *            Value of the property
 */
function agile_crm_delete_contact_property_by_subtype(propertyName, subtype, value, callback)
{

	// Reads current contact model form the contactDetailView
	var contact_model = App_Contacts.contactDetailView.model;

	// Gets properties list field from contact
	var properties = contact_model.get('properties');

	/*
	 * Iterates though each property and finds the value related to the property
	 * name and deletes it
	 */
	$.each(properties, function(index, property)
	{
		if (property.name == propertyName && property.subtype == subtype && property.value == value)
		{
			properties.splice(index, 1);
			contact_model.set({ "properties" : properties }, { silent : true });

			contact_model.url = "core/api/contacts";

			// Save updated contact model
			contact_model.save([], { silent : true, success : function(data)
			{
				console.log("in success");
				if (callback && typeof callback === "function")
					callback(data);

			} });

			return false;
		}
	});

}

/**
 * Saves contact property value to contact with the given property name and sub
 * type of the property and value of the property.
 * 
 * <p>
 * type should be given as "SYSTEM" if it already exists and "CUSTOM" if it is a
 * new field
 * </p>
 * 
 * 
 * @param propertyName
 * @param subtype
 * @param value
 * @param type
 */
function agile_crm_save_contact_property(propertyName, subtype, value, type)
{
	// Reads current contact model form the contactDetailView
	var contact_model = App_Contacts.contactDetailView.model;

	// Gets properties list field from contact
	var properties = contact_model.get('properties');

	var property = {};
	property["name"] = propertyName;
	property["value"] = value;
	property["subtype"] = subtype;
	property["type"] = type;

	properties.push(property);

	contact_model.set("properties", properties);

	console.log(properties);

	contact_model.url = "core/api/contacts"

	// Save updated contact model
	contact_model.save()

}

/**
 * Saves the given property to widget_properties field in contact as key value
 * pair, which is saved as JSON string object in field name widget_properties.
 * 
 * @param propertyName
 * @param value
 */
function agile_crm_save_widget_property_to_contact(propertyName, value, callback)
{

	// Gets Current Contact Model
	var contact_model = App_Contacts.contactDetailView.model;

	// Get WidgetProperties from Contact Model
	var widget_properties = contact_model.get('widget_properties');

	/*
	 * If widget_properties are null i.e, contact do not contain any widget
	 * properties yet, then create new JSON object to save widget properties
	 */
	if (!widget_properties)
		widget_properties = {};

	/*
	 * If widget properties already exists then convert Stringified JSON in to
	 * JSON object to add new properties
	 */
	else
		widget_properties = JSON.parse(widget_properties);

	/*
	 * Adds the new property name and key value pair, in widget_properties JSON
	 */
	widget_properties[propertyName] = value;

	// Stringifies widget_properties json in to string and set to contact model.
	contact_model.set({"widget_properties": JSON.stringify(widget_properties)}, {silent :true});

	contact_model.url = "core/api/contacts";

	// Saves updated model
	//contact_model.save(contact_model.toJSON);
	
	// Save updated contact model
	contact_model.save(contact_model.toJSON, { silent : true, success : function(data)
	{
		console.log("in success");
		if (callback && typeof callback === "function")
			callback(data);

	} });


}

function agile_crm_add_event_to_timeline(name, title, body, time)
{
	var model = {};
	model['id'] = name;
	model['body'] = body;
	model["title"] = title;
	
	if (time && (time / 100000000000) > 1)
		model["created_time"] = time;
	else
		model["created_time"] = time;
	
	model["entity_type"] = "custom";
	
	add_entity_to_timeline(new BaseModel(model));
}


$(function()
{
    $("#widget-prefs-save").die().live('click', function(e)
    {
	e.preventDefault();

	if ($(this).attr('disabled') == "disabled")
	    return;

	$(this).attr('disabled', 'disabled');

	// Read from from
	var form = $(this).parents('form');

	// Gets widget object
	var data = $(form).data('widget');

	var form_id = $(form).attr('id');

	if (!isValidForm($(form)))
	{
	    $(this).removeAttr('disabled')
	    return;
	}

	// Serializes form daa
	var form_data = serializeForm(form_id);

	try
	{

	    if (data.prefs)
		data["prefs"] = JSON.parse(data["prefs"]);
	    else
		data["prefs"] = {};

	    console.log(data["prefs"]);
	}
	catch (err)
	{
	}

	// Update prefs
	$.each(form_data, function(key, value)
	{
	    data["prefs"][key] = value;
	});

	if (data.prefs)
	{
	    data.prefs = JSON.stringify(data.prefs);

	    update_collection_with_prefs(data);
	}

	var that = this;

	// Save entity
	saveEntity(data, "core/api/widgets", function(result)
	{
	    $(form).data('widget', result.toJSON());
	    $(that).removeAttr('disabled');
	    Backbone.history.navigate("add-widget", { trigger : true });
	})
    });

});

function update_collection_with_prefs(data)
{
    console.log(data);
    if (Catalog_Widgets_View && Catalog_Widgets_View.collection)
    {
	var models = Catalog_Widgets_View.collection.where({ name : data["name"] });
	if (models && models[0])
	{
	    models[0].set({ 'prefs' : data.prefs });
	    console.log(Catalog_Widgets_View.collection.where({ name : data["name"] })[0]);
	}

    }

    if (Widgets_View && Widgets_View.collection)
    {
	var models = Widgets_View.collection.where({ name : data["name"] });
	if (models && models[0])
	{
	    models[0].set({ 'prefs' : data.prefs });
	    console.log(Widgets_View.collection.where({ name : data["name"] })[0]);
	}

    }
}

function clickdesk_save_widget_prefs()
{
    $('#save_clickdesk_prefs').unbind("click");

    // On click of save button, check input and save details
    $('#save_clickdesk_prefs').die().live('click', function(e)
    {
	e.preventDefault();

	// Checks whether all input fields are given
	if (!isValidForm($("#clickdesk_login_form")))
	    return;

	// Saves ClickDesk preferences in ClickDesk widget object
	saveClickDeskWidgetPrefs();
    });
}

/**
 * Calls method in script API (agile_widget.js) to save ClickDesk preferences in
 * ClickDesk widget object
 */
function saveClickDeskWidgetPrefs()
{
    // Retrieve and store the ClickDesk preferences entered by the user as JSON
    var ClickDesk_prefs = {};
    ClickDesk_prefs["clickdesk_username"] = $("#clickdesk_username").val();
    ClickDesk_prefs["clickdesk_api_key"] = $("#clickdesk_api_key").val();

    // Saves the preferences into widget with ClickDesk widget name
    save_widget_prefs("ClickDesk", JSON.stringify(ClickDesk_prefs), function(data)
    {
	console.log('In clickdesk save success');
	console.log(data);
    });
}

function helpscout_save_widget_prefs()
{
    $('#save_api_key').unbind("click");

    // Saves the API key
    $('#save_api_key').die().live('click', function(e)
    {
	e.preventDefault();

	// Checks whether all input fields are given
	if (!isValidForm($("#helpscout_login_form")))
	{
	    return;
	}

	// Saves HelpScout preferences in HelpScout widget object
	saveHelpScoutWidgetPrefs();
    });

}

/**
 * Calls method in script API (agile_widget.js) to save HelpScout preferences in
 * HelpScout widget object
 */
function saveHelpScoutWidgetPrefs()
{
    // Retrieve and store the HelpScout API key entered by the user
    var HelpScout_prefs = {};
    HelpScout_prefs["helpscout_api_key"] = $("#helpscout_api_key").val();

    // Saves the preferences into widget with Rapleaf widget name
    save_widget_prefs("HelpScout", JSON.stringify(HelpScout_prefs), function(data)
    {
	console.log('In HelpScout save success');
	console.log(data);
    });
}

function freshbook_save_widget_prefs()
{
    $('#freshbooks_save_token').unbind("click");

    // On click of save button, check input and save details
    $('#freshbooks_save_token').die().live('click', function(e)
    {
	e.preventDefault();

	// Checks whether all input fields are given
	if (!isValidForm($("#freshbooks_login_form")))
	{
	    return;
	}

	// Saves FreshBooks preferences in FreshBooks widget object
	savefreshBooksWidgetPrefs();
    });
}

/**
 * Calls method in script API (agile_widget.js) to save FreshBooks preferences
 * in FreshBooks widget object
 */
function savefreshBooksWidgetPrefs()
{
    // Store the data given by the user as JSON
    var freshbooks_prefs = {};
    freshbooks_prefs["freshbooks_apiKey"] = $("#freshbooks_apiKey").val();
    freshbooks_prefs["freshbooks_url"] = $("#freshbooks_url").val();

    // Saves the preferences into widget with FreshBooks widget name
    save_widget_prefs("FreshBooks", JSON.stringify(freshbooks_prefs), function(data)
    {
	console.log('In freshbooks save success');
	console.log(data);
    });
}

function rapleaf_save_widget_prefs()
{

    $('#save_api_key').unbind("click");

    // Saves the API key
    $('#save_api_key').die().live('click', function(e)
    {
	e.preventDefault();

	// Checks whether all input fields are given
	if (!isValidForm($("#rapleaf_login_form")))
	{
	    return;
	}

	// Saves Rapleaf preferences in Rapleaf widget object
	saveRaplefWidgetPrefs();
    });
}

/**
 * Calls method in script API (agile_widget.js) to save Rapleaf preferences in
 * Rapleaf widget object
 */
function saveRaplefWidgetPrefs()
{
    // Retrieve and store the Rapleaf API key entered by the user
    var Rapleaf_prefs = {};
    Rapleaf_prefs["rapleaf_api_key"] = $("#rapleaf_api_key").val();

    // Saves the preferences into widget with Rapleaf widget name
    save_widget_prefs("Rapleaf", JSON.stringify(Rapleaf_prefs), function(data)
    {
	console.log('In Rapleaf save success');
	console.log(data);
    });
}

/**
 * Shows setup if user adds Zendesk widget for the first time or clicks on reset
 * icon on Zendesk panel in the UI
 * 
 */
function zendesk_save_widget_prefs()
{

    $('#save_prefs').unbind("click");

    // On click of save button, check input and save details
    $('#save_prefs').die().live('click', function(e)
    {
	e.preventDefault();

	// Checks whether all input fields are given
	if (!isValidForm($("#zendesk_login_form")))
	{
	    return;
	}
	// Saves Zendesk preferences in ClickDesk widget object
	saveZendeskWidgetPrefs();

    });

}

/**
 * Calls method in script API (agile_widget.js) to save Zendesk preferences in
 * Zendesk widget object
 */
function saveZendeskWidgetPrefs()
{
    // Retrieve and store the Zendesk preferences entered by the user as JSON
    var zendesk_prefs = {};
    zendesk_prefs["zendesk_username"] = $("#zendesk_username").val();
    zendesk_prefs["zendesk_password"] = $("#zendesk_password").val();
    zendesk_prefs["zendesk_url"] = $("#zendesk_url").val();

    // Saves the preferences into widget with zendesk widget name
    save_widget_prefs("Zendesk", JSON.stringify(zendesk_prefs), function(data)
    {
	console.log('In zendesk save success');
	console.log(data);
    });
}

/**
 * Shows setup if user adds Sip widget for the first time or clicks on reset
 * icon on Sip panel in the UI
 * 
 */
function sip_save_widget_prefs()
{

    $('#save_prefs').unbind("click");

    // On click of save button, check input and save details
    $('#save_prefs').die().live('click', function(e)
    {
	e.preventDefault();

	// Checks whether all input fields are given
	if (!isValidForm($("#sip_login_form")))
	{
	    return;
	}
	// Saves Sip preferences in ClickDesk widget object
	saveSipWidgetPrefs();

    });

}

/**
 * Calls method in script API (agile_widget.js) to save Sip preferences in Sip
 * widget object
 */
function saveSipWidgetPrefs()
{
    // Retrieve and store the Sip preferences entered by the user as JSON
    var sip_prefs = {};
    sip_prefs["sip_username"] = $("#sip_username").val();
    sip_prefs["sip_privateid"] = $("#sip_privateid").val();
    sip_prefs["sip_realm"] = $("#sip_realm").val();
    sip_prefs["sip_password"] = $("#sip_password").val();

    sip_prefs["sip_publicid"] = "sip:" + $("#sip_privateid").val() + "@" + $("#sip_realm").val();

    if ($('#sip_wsenable').is(':checked'))
	sip_prefs["sip_wsenable"] = "true";
    else
	sip_prefs["sip_wsenable"] = "false";

    console.log(sip_prefs);

    // Saves the preferences into widget with sip widget name
    save_widget_prefs("Sip", JSON.stringify(sip_prefs), function(data)
    {
	console.log('In sip save success');
	console.log(data);
    });
}

function save_widget_prefs(pluginName, prefs, callback)
{
    console.log("In save_widget_prefs.");
    /*
     * Get widget model from collection based on the name attribute of the
     * widget model
     */
    var models = Catalog_Widgets_View.collection.where({ name : pluginName });

    /*
     * Saves widget model and on success navigate back to contact detailed view
     */
    var widgetModel = new Backbone.Model();

    console.log(widgetModel);

    // URL to connect with widgets
    widgetModel.url = '/core/api/widgets';
    models[0].set('prefs', prefs);

    widgetModel.save(models[0].toJSON(), { success : function(data)
    {
	// Checks if Widget_View is defined and adds widget to collection
	if (Widgets_View && Widgets_View.collection)
	    Widgets_View.collection.add(new BaseModel(data.toJSON()));

	data.set('is_added', true);
	models[0].set(data);
	window.location.href = "#add-widget";

	console.log(data);

	update_collection_with_prefs(data);

	// Stop old stack.
	if (Sip_Start == true)
	{
	    Sip_Updated = true;
	    sipUnRegister();
	}

	// Register on Sip.
	sipStart();
    } });

}

function show_set_up_widget(widget_name, template_id, url, model)
{
    $("#content").html(getTemplate("settings"), {});

    var el;
    var models;
    $('#prefs-tabs-content').html(LOADING_HTML);
    if (model)
	el = $(getTemplate("widget-settings", model));
    else
    {
	if (!Catalog_Widgets_View)
	{
	    $.getJSON('core/api/widgets/' + widget_name, function(data)
	    {
		show_set_up_widget(widget_name, template_id, url, data);
	    })
	    return;
	}

	models = Catalog_Widgets_View.collection.where({ name : widget_name });
	el = $(getTemplate("widget-settings", models[0].toJSON()));
    }

    console.log(el);

    if (widget_name == "Zendesk")
	zendesk_save_widget_prefs();

    else if (widget_name == "ClickDesk")
	clickdesk_save_widget_prefs();

    else if (widget_name == "HelpScout")
	helpscout_save_widget_prefs();

    else if (widget_name == "FreshBooks")
	freshbook_save_widget_prefs();

    else if (widget_name == "Rapleaf")
	rapleaf_save_widget_prefs();

    else if (widget_name == "Sip")
	sip_save_widget_prefs();
    
   /* else if(widget_name =="QuickBooks")
	quickBooks_save_widget_prefs();*/
    
    // Shows available widgets in the content
    if (url)
    {
	$('#widget-settings', el).html(getTemplate(template_id, { "url" : url }));
	console.log(el);
    }
    else
    {
	$('#widget-settings', el).html(getTemplate(template_id, {}));
	console.log(el);
    }

    $('#prefs-tabs-content').html(el);

    $('#PrefsTab .active').removeClass('active');
    $('.add-widget-prefs-tab').addClass('active');

}

function set_up_access(widget_name, template_id, data, url, model)
{
    $("#content").html(getTemplate("settings"), {});

    var el;
    var json;
    var models;

    $('#prefs-tabs-content').html(LOADING_HTML);
    $('#PrefsTab .active').removeClass('active');
    $('.add-widget-prefs-tab').addClass('active');

    if (model)
    {
	el = $(getTemplate("widget-settings", model));
	json = model;
    }
    else
    {
	if (!Catalog_Widgets_View)
	{
	    $.getJSON('core/api/widgets/' + widget_name, function(data1)
	    {
		set_up_access(widget_name, template_id, data, url, data1)
	    })
	    return;
	}

	models = Catalog_Widgets_View.collection.where({ name : widget_name });
	json = models[0].toJSON();
	el = $(getTemplate("widget-settings", json));
    }

    if (json.name == "Twilio")
	json['outgoing_numbers'] = data;

    else if (json.name == "Linkedin" || json.name == "Twitter")
	json['profile'] = data;

    else
	json['custom_data'] = data;

    console.log(json);

    // merged_json = $.extend(merged_json, model, data);

    $('#widget-settings', el).html(getTemplate(widget_name.toLowerCase() + "-revoke-access", json));

    $('#prefs-tabs-content').html(el);

    $('#prefs-tabs-content').find('form').data('widget', json);
    console.log(json);
    console.log($('#prefs-tabs-content').find('form').data('widget'));

    $('#PrefsTab .active').removeClass('active');
    $('.add-widget-prefs-tab').addClass('active');

    $(".revoke-widget").die().live('click', function(e)
    {

	console.log($(this).attr("widget-name"));
	delete_widget(widget_name);
	show_set_up_widget(widget_name, template_id, url, model);
    });

}

function fill_form(id, widget_name, template_id)
{
    console.log("In fill_form");
    console.log(id + " " + widget_name + " " + template_id);

    var model = Catalog_Widgets_View.collection.get(id);
    console.log(model.get("prefs"));

    show_set_up_widget(widget_name, template_id);

    if (model && model.get("prefs"))
    {
	var prefsJSON = JSON.parse(model.get("prefs"));
	fill_fields(prefsJSON);
    }
}

function fill_fields(fieldsJSON)
{
    for (i in fieldsJSON)
    {
	if (i == "sip_wsenable")
	{
	    if (fieldsJSON[i] == 'true')
		$("#" + i).attr('checked', 'checked');
	}
	else
	    $("#" + i).val(fieldsJSON[i]);

    }
}

function widgetError(id, template_id, error, disable_check)
{
    // build JSON with error message
    var error_json = {};
    error_json['message'] = error;
    error_json['disable_check'] = disable_check;

    /*
     * Get error template and fill it with error message and show it in the div
     * with given id
     */
    $('#' + id).html(getTemplate(template_id, error_json));

}

function setUpError(widget_name, template_id, error_data, error_url, model)
{

    $("#content").html(getTemplate("settings"), {});

    var el;
    var models;
    var json;

    $('#prefs-tabs-content').html(LOADING_HTML);
    $('#PrefsTab .active').removeClass('active');
    $('.add-widget-prefs-tab').addClass('active');

    if (model)
    {
	el = $(getTemplate("widget-settings", model));
	json = model;
    }
    else
    {
	if (!Catalog_Widgets_View)
	{
	    $.getJSON('core/api/widgets/' + widget_name, function(data1)
	    {
		setUpError(widget_name, template_id, error_data, error_url, data1)
	    })
	    return;
	}

	models = Catalog_Widgets_View.collection.where({ name : widget_name });
	json = models[0].toJSON();
	el = $(getTemplate("widget-settings", json));
    }

    json['error_message'] = error_data;
    json['error_url'] = error_url;

    // merged_json = $.extend(merged_json, model, data);

    $('#widget-settings', el).html(getTemplate(template_id, json));

    $('#prefs-tabs-content').html(el);

    $('#prefs-tabs-content').find('form').data('widget', json);

    $('#PrefsTab .active').removeClass('active');
    $('.add-widget-prefs-tab').addClass('active');

}

function xero_save_widget_prefs()
{
    $('#xero_save_token').unbind("click");
    alert("hello in xero save")
    // On click of save button, check input and save details
    $('#xero_save_token').die().live('click', function(e)
    {
	e.preventDefault();

	// Retrieve and store the ClickDesk preferences entered by the user as
	// JSON
	var Xero_prefs = {};

	// Saves the preferences into widget with ClickDesk widget name
	save_widget_prefs("Xero", JSON.stringify(Xero_prefs), function(data)
	{
	    console.log('In xero save success');
	    console.log(data);
	});
    });

    function quickBooks_save_widget_prefs(template_id,url)
    {
	  head.js('https://appcenter.intuit.com/Content/IA/intuit.ipp.anywhere.js', function()
		    {
	      $('#widget-settings', el).html(getTemplate(template_id, { "url" : url }));
		console.log(el);
	      intuit.ipp.anywhere.setup({    menuProxy: 'http://example.com/myapp/BlueDotMenu',    grantUrl: url});	
		    });
	
    }
}
$(function(){
	
	
	$('#twilio_verify_settings').die().live('click', function(e)
			{
				e.preventDefault();
				
				$('#widget-settings').html(getTemplate('twilio-initial', {}));
				
			});
	
		/*
		 * If Twilio account doesn't have numbers, we need to verify numbers in
		 * Twilio.On click of verify button in Twilio initial template,
		 * verifyNumberFromTwilio is called to verify a number in Twilio
		 */
		$('#twilio_verify').die().live('click', function(e)
		{
			e.preventDefault();

			// Checks whether all input fields are given
			if (!isValidForm($("#twilio_call_form")))
				return;

			// From number to make calls as entered by user
			var from_number = $('#twilio_from').val();
			console.log("Twilio verify from number: " + from_number);

			$.getJSON("core/api/widgets/Twilio", function(data)
					{
						console.log(data);
						
						if(data)
						{
							/*
							 * Verifies a number in Twilio and shows verification code in the Twilio
							 * template with a procced button
							 */
							verifyNumberFromTwilio(from_number, data.id, function(verified_data)
							{
								verified_data["settings"] = true;
								// Append the url with the random number in order to differentiate the same action performed more than once.
								verified_data["id"] = Math.floor((Math.random()*10)+1);
								
								console.log(verified_data);
								console.log(getTemplate('twilio-verify', verified_data));
								$('#widget-settings').html(getTemplate('twilio-verify', verified_data));
							});
						}
					});
		});


	
});


/**
 * Verifies a given number In Twilio and returns verification code to verify in
 * the Twilio Widget
 * 
 * @param from_number
 *            {@link String} Number to verify
 * @param callback
 *            Function to be executed on success
 */
function verifyNumberFromTwilio(from_number, id, callback)
{

	/*
	 * Sends GET request to the URL "/core/api/widgets/twilio/verify/numbers/"
	 * with Twilio_Plugin_Id and from_number as path parameters
	 */
	$.getJSON("/core/api/widgets/twilio/verify/numbers/" + id + "/" + from_number, function(verified_data)
	{
		console.log("Twilio verified_data " + verified_data);

		// If data is not defined return
		if (!verified_data)
			return;

		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(verified_data);

	}).error(function(data)
	{	
		// Append the url with the random number in order to differentiate the same action performed more than once.
		var flag = Math.floor((Math.random()*10)+1); 
		setUpError("Twilio", "widget-settings-error", data.responseText, window.location.protocol + "//" 
				+ window.location.host + "/#Twilio/twilio"+flag);
	});
	
	return;
}


// For Twilio inbound.
$(function()
{
	var Twilio_Plugin_Id;
	
	// After 15 sec procedure will start.
	setTimeout(function()
	{		
		
		// after DOM ready.
		if (document.readyState === "complete")
		{	
			// Get Sip widget
			$.getJSON("/core/api/widgets/Twilio", function(twilio_widget)
			{
				if (twilio_widget == null)
					return;

				Twilio_Widget_Object = twilio_widget;
				
				console.log(twilio_widget.prefs);
				
				// ID of the ClickDesk widget as global variable
				Twilio_Plugin_Id = twilio_widget.id;
				
				console.log(Twilio_Plugin_Id);
				if (twilio_widget.prefs != undefined)
				{		
					
					// Parse string preferences as JSON
					var twilio_prefs = JSON.parse(twilio_widget.prefs);
					console.log(twilio_prefs);

					/*
					 * Check if Twilio account has registered numbers and shows
					 * set up to verify if no numbers available, else generates
					 * token required to make calls
					 */
					checkTwilioNumbersAndGenerateToken(Twilio_Plugin_Id,twilio_prefs);
				}
			}).error(function(data)
			{
				console.log("In twilio error");
				console.log(data);
			});
		}
	}, 20000); // 20 sec
});


function checkTwilioNumbersAndGenerateToken(Twilio_Plugin_Id,twilio_prefs)
{
	// Retrieves outgoing numbers from Twilio
	getOutgoingNumbers(Twilio_Plugin_Id,function(data)
	{
		console.log("Twilio outgoing numbers: " + data[0].PhoneNumber);

		// If no numbers, show set up
		if (!data[0].PhoneNumber)
		{
			$('#Twilio').html(getTemplate('twilio-initial', {}));
			return;
		}

		if(twilio_prefs.verification_status && twilio_prefs.verification_status == "success" && twilio_prefs.verified_number)
		{
			console.log("in if");
			checkTwilioPrefsAndGenerateToken(Twilio_Plugin_Id,twilio_prefs, twilio_prefs.verified_number);
			return;
		}
			
		
		// Else generate Twilio token for calls
		checkTwilioPrefsAndGenerateToken(Twilio_Plugin_Id,twilio_prefs, data[0].PhoneNumber);
	});
}
	
function getOutgoingNumbers(Twilio_Plugin_Id,callback)
	{
		/*
		 * Calls queueGetRequest method in widget_loader.js, with queue name as
		 * "widget_queue" to retrieve numbers
		 */
		queueGetRequest("widget_queue", "/core/api/widgets/twilio/numbers/" + Twilio_Plugin_Id, 'json', function(data)
		{
			// If data is not defined return
			if (!data)
				return;
			
			console.log("In getting twilio numbers");
			console.log(data);

			// If defined, execute the callback function
			if (callback && typeof (callback) === "function")
				callback(data);

		}, function(data)
		{
			console.log("Error in getOutgoingNumbers: ");console.log( data);
		});

	}

function checkTwilioPrefsAndGenerateToken(Twilio_Plugin_Id,twilio_prefs, from_number)
{
	console.log("in checkTwilioPrefsAndGenerateToken");
	
	/*
	 * If Twilio preferences has account SID after OAuth, checks for application
	 * SID whether we have created an application in AgileUser Twilio account,
	 * if created continues to generate token, else creates an application and
	 * calls the same method saving application SID in Twilio prefrences
	 */
	if (twilio_prefs.account_sid)
	{
		console.log(twilio_prefs.account_sid +" "+ twilio_prefs.app_sid);
		// If no applicaiton SID
		if (!twilio_prefs.app_sid)
		{
			// Create application in Twilio and return
			createApplicationInTwilio(Twilio_Plugin_Id,function(appSid)
			{
				twilio_prefs['app_sid'] = appSid;

				// Save preferences with application SID set to Twilio
				agile_crm_save_widget_prefs("Twilio", JSON.stringify(twilio_prefs), function(data)
				{
					// Call same method after setting application SID
					checkTwilioPrefsAndGenerateToken(Twilio_Plugin_Id,twilio_prefs, from_number);
				});
			});
			return;
		}

		/*
		 * generates a token in Twilio and shows set up to make calls and shows
		 * details in Twilio panel
		 */
		generateTokenInTwilio(Twilio_Plugin_Id,from_number, function(token)
		{
			 setUpTwilio(token, from_number);
			return;
		});
	}
}

function createApplicationInTwilio(Twilio_Plugin_Id , callback)
{
	/*
	 * Sends GET request to the URL "/core/api/widgets/twilio/appsid/" with
	 * Twilio_Plugin_Id as path parameter
	 */
	$.get("/core/api/widgets/twilio/appsid/" + Twilio_Plugin_Id, function(data)
	{
		console.log('Twilio app_sid: ' + data);

		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(data);

	}).error(function(data)
	{
		// Shows error if error occurs in Twilio widget panel
		twilioError(Twilio_PLUGIN_NAME, data.responseText);
	});
}

function generateTokenInTwilio(Twilio_Plugin_Id, from_number, callback)
{
	/*
	 * Sends GET request to the URL "/core/api/widgets/twilio/token/" with
	 * Twilio_Plugin_Id as path parameter
	 */
	$.get("/core/api/widgets/twilio/token/" + Twilio_Plugin_Id, function(token)
	{
		console.log("Twilio generated token : " + token);

		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(token);

	}).error(function(data)
	{
		// Shows error if error occurs in Twilio widget panel
		twilioError(Twilio_PLUGIN_NAME, data.responseText);
	});
}

function setUpTwilio(token, from_number)
{
	var to_number = $('#contact_number').val();

	// Loads twilio min.js to intiliaze twilio call events
	head.js("https://static.twilio.com/libs/twiliojs/1.1/twilio.min.js", function()
	{
		// setup Twilio device
		Twilio.Device.setup(token, {debug: true});

		// When set up is ready this is called
		Twilio.Device.ready(function()
		{
			console.log("ready");
			$("#twilio_call").show();

		});

		// After call is connected
		Twilio.Device.connect(function(conn)
		{
			console.log("Twilio call is connected");
			// Called for all new connections
			console.log(conn);
			console.log(conn._status);

			// After call connects, show hang up buttton and hide call button
			if (conn._status == "open")
			{
				$("#twilio_hangup").show();
				$("#twilio_call").hide();
			}
		});

		// If call is ended or disconnected
		Twilio.Device.disconnect(function(conn)
		{
			console.log("Twilio call is disconnected");
			// Called for all disconnections
			console.log(conn);

			// On call end, hide hang up,show call and link to add note
			if (conn._status == "closed")
			{
				to_number = $('#contact_number').val();
				console.log("Twilio Number in disconect: " + to_number);
				getTwilioLogs(to_number);
				$('#twilio_note').show();
				$("#twilio_hangup").hide();
				$("#twilio_call").show();
			}

		});

		// If any network failure, show error
		Twilio.Device.offline(function()
		{
			// Called on network connection lost.
			console.log("Twilio went offline");
		});

		// When incoming call comes to Twilio
		Twilio.Device.incoming(function(conn)
		{
			// who is calling
			console.log(conn.parameters.From);
			// status before accepting call
			console.log(conn._status);
			conn.accept();

			// If connection is opened, hide call and show hang up
			if (conn._status == "open")
			{
				$("#twilio_hangup").show();
				$("#twilio_call").hide();
			}

		});

		// When call is cancelled, hide hang up and show call
		Twilio.Device.cancel(function(conn)
		{
			// who canceled the call
			console.log(conn.parameters.From);

			$("#twilio_hangup").hide();
			$("#twilio_call").show();

		});

		/*
		 * Called for each available client when this device becomes ready and
		 * every time another client's availability changes.
		 */
		Twilio.Device.presence(function(presenceEvent)
		{
			// name of client whose availablity changed
			console.log(presenceEvent.from);

			// true or false
			console.log(presenceEvent.available);
		});

		/*
		 * If error occurs while calling, hide hang up and show call
		 */
		Twilio.Device.error(function(e)
		{
			// 31205 error code
			console.log("Twilio error");
			console.log(e);

			$("#twilio_hangup").hide();
			$("#twilio_call").show();
		});

		//registerClickEvents(from_number);

	});
}
/**
 * Tags
 */
var CANCELED = "Canceled";
var SIGN_UP = "Signup";
var CAMPAIGN_TAG = "Campaigns";
var CODE_SETUP_TAG = "Code setup";
var IMPORT_TAG = "Import";
var SOCIAL_TAG = "Social";
var WIDGET_TAG = "Widgets";
var DOMAIN_COOKIE_FOR_WEBSITE = "_agile_login_domain"
	
// Subject for account cancellation note
var ACCOUNT_CANCELED_NOTE_SUBJECT = "Account Canceled";

// Account cancellation cusom field
var ACCOUNT_CANCELED_CUSTOM_FIELD_NAME = "Cancel Reason";

/**
 * Adds domain and loggedin date in contact in our domain
 */
function add_custom_fields_to_our_domain()
{
	// Gets domain property from contact
	var domain_custom_field = getProperty(Agile_Contact.properties, 'Domain');

	// If domain custom field doesn't exists or value of and its value is not
	// current domain
	if (!domain_custom_field || domain_custom_field.value != CURRENT_DOMAIN_USER["domain"])
	{
		// Add custom property to contact
		_agile.add_property(create_contact_custom_field("Domain", CURRENT_DOMAIN_USER["domain"], "CUSTOM"), function(data)
		{
			add_tag_our_domain(SIGN_UP, function() {
				add_current_loggedin_time();
			})
		
		});
		return;
	}

	add_tag_our_domain(SIGN_UP, function() {
		add_current_loggedin_time();
	})
}

/**
 * Checks if logged in time is added to contact in 'our' domain. If it is added
 * and not value is not equal to current loggedin date, then field is updated
 */
function add_current_loggedin_time()
{
	// Gets current time, and updates the last loggedin time.
	var current_date_object = new Date();
	var current_date_string = current_date_object.getUTCMonth() + 1 + "/" + current_date_object.getUTCDate() + "/" + current_date_object.getUTCFullYear();

	console.log(parseInt(current_date_object.getTime()/1000));
	
	// Gets logged in time property.
	var loggedin_time_property = getProperty(Agile_Contact.properties, 'Last login');
	
	var existing_date_string = "";
	if(loggedin_time_property)
		{
		var existing_date_object = new Date(loggedin_time_property.value);
		existing_date_string = existing_date_object.getUTCMonth() + 1 + "/" + existing_date_object.getUTCDate() + "/" + existing_date_object.getUTCFullYear();
		}
	

	// If loggedin time is defined and it is not equal to current date then it
	// is updated
	if (existing_date_string && existing_date_string == current_date_string)
		return;

	loggedin_time_property = create_contact_custom_field("Last login", parseInt(current_date_object.getTime()/1000), 'CUSTOM');

	_agile.add_property(loggedin_time_property);
}

function create_contact_custom_field(name, value, type, subtype)
{
	if (!name)
		return;

	var json = {};
	json["name"] = name;
	json["value"] = value;
	json["type"] = type;
	json["subtype"] = subtype;

	console.log(value);
	return json;

}

function add_account_canceled_info(info, callback)
{
	var custom_field = create_contact_custom_field(ACCOUNT_CANCELED_CUSTOM_FIELD_NAME, info["reason"], 'CUSTOM');
	_agile.add_property(custom_field, function(data) {
		add_tag_our_domain(CANCELED, function(data){

			if(info["reason_info"])
				{
				var note = {};
				note.subject = ACCOUNT_CANCELED_NOTE_SUBJECT;
				note.description = info["reason_info"];
				
				_agile.add_note(note, function (data) {
						console.log(data);
						Agile_Contact = data;
						
						if (callback && typeof (callback) === "function")
						{
							callback();
						}
						
			    });
				return;
				}
			
			if (callback && typeof (callback) === "function")
			{
				callback();
			}
			
			});
		});
}

function our_domain_sync()
{

	try
	{

		// If it is local server then add contacts to local domain instead of
		// our domain
		if (LOCAL_SERVER)
			_agile.set_account('7n7762stfek4hj61jnpce7uedi', 'local');

		else
			_agile.set_account('td2h2iv4njd4mbalruce18q7n4', 'our');

		_agile.set_email(CURRENT_DOMAIN_USER['email']);
		
		// Track page view code
		_agile.track_page_view();

		// Clicky code
		head.js('//static.getclicky.com/js', function() {
			
			try{ clicky.init(100729733); }catch(e){};
		});
		
		var domain = readCookie(DOMAIN_COOKIE_FOR_WEBSITE);
		
		// Sets different cookie if user logs into different domain
		if(!domain || domain != CURRENT_DOMAIN_USER["domain"])
			createCookieInAllAgileSubdomains(DOMAIN_COOKIE_FOR_WEBSITE, CURRENT_DOMAIN_USER["domain"]);
		
		get_contact_from_our_domain(function(data){
			// Shows noty
		//	set_profile_noty();
			Agile_Contact = data;
			
			// Adds signup tag, if it is not added previously.
			//set_profile_noty();
			add_custom_fields_to_our_domain();
			initWebrules();
			
		}, function(data){
			var name = CURRENT_DOMAIN_USER['name'];
			var first_name = name, last_name = name;
			// Creates a new contact and assigns it to global value
			_agile.create_contact({ "email" : CURRENT_DOMAIN_USER['email'], "first_name" : first_name, "last_name" : last_name },
					function(data)
					{
						Agile_Contact = data;
						// Shows noty
						//set_profile_noty();
						add_custom_fields_to_our_domain();
						initWebrules();
					});
			
		})
		// Gets contact based on the the email of the user logged in
	
	}
	catch (err)
	{

	}
}

function get_contact_from_our_domain(successCallback, errorCallback)
{

	// Gets contact based on the the email of the user logged in
	agile_getContact(CURRENT_DOMAIN_USER['email'], {
		success: function(data){
			Agile_Contact = data;
			if(successCallback && typeof (successCallback) === "function")
				successCallback(data);
		},
		error : function(data) {
			if(errorCallback && typeof (errorCallback) === "function")
				errorCallback(data);
		}
	})
	
}

function add_signup_tag(callback)
{
	if (!Agile_Contact.tags || Agile_Contact.tags.indexOf(SIGN_UP) < 0)
	{
		console.log("adding tags");
		add_tag_our_domain(SIGN_UP, function(data)
				{
						// Calling to add custom fields here so avoid data loss
						// due to asyn
						// requests
						add_custom_fields_to_our_domain();
						
						if (callback && typeof (callback) === "function")
						{
							callback();
						}
				})
		return;
	}

	// Calling to add custom fields here so avoid data loss due to asyn requests
	add_custom_fields_to_our_domain();
}
function hasTagInContact(tag)
{
	if(!tag)
		return false;
	
	if (Agile_Contact && (!Agile_Contact.tags || Agile_Contact.tags.indexOf(tag) < 0))
		return false;
	
	return true;
	
}
function add_tag_our_domain(tag, callback)
{
	if(hasTagInContact(tag))
	{
		if (callback && typeof (callback) === "function")
		{
			callback(Agile_Contact);
		}
		return;
	}
	
	_agile.add_tag(tag, function(data)
			{
				Agile_Contact = data;

				if (callback && typeof (callback) === "function")
				{
					callback(data);
				}
			});
}

function setup_our_domain_sync()
{
	our_domain_sync();
}

/**
 * Adds tag to 'OUR' domain.
 * 
 * @param tag
 */
function addTagAgile(tag)
{
	// Checks if tag is already available.
	if (checkTagAgile(tag))
		return;

	// Adds tag
	_agile.add_tag(tag, function(data)
	{
		Agile_Contact = data;
		if (!checkTagAgile(tag))
			Agile_Contact.tags.push(tag)
		//set_profile_noty();
	});
}

// Checks if tag exists
function checkTagAgile(tag)
{

	console.log(Agile_Contact);
	if (Agile_Contact && Agile_Contact.tags)
		return Agile_Contact.tags.indexOf(tag) > -1;

	return false;
}

var GLOBAL_WEBRULE_FLAG;
function initWebrules()
{
		_agile_execute_web_rules();
		GLOBAL_WEBRULE_FLAG = true;
}

function add_properties_from_popup(phone_number, company_size)
{
	_agile.add_property(create_contact_custom_field("Company Size", company_size, "CUSTOM"), function(data)
			{
			_agile.add_property(create_contact_custom_field("phone", phone_number, "SYSTEM", "home"), function(data)
				{
					
					console.log(data);
					_agile_contact = data;
					console.log(_agile_contact);
					window.setTimeout(initWebrules, 4000)
							
				});
			});
}
/**
 * This file contains all event related actions on tweet, Like delete tweet,
 * follow, unfollow, favorite, block, etc.
 */

$(function()
{
	/**
	 * Get stream and perform favorite action on selected tweet.
	 */
	$(".favorite-status").die().live("click", function(e)
	{
		// Get the id of the tweet on which retweet is clicked
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));

		performTweetAction(streamId, tweetId, null, "favorite");
	});

	/**
	 * Get stream and perform undo-favorite action on selected tweet.
	 */
	$(".undo-favorite-status").die().live("click", function(e)
	{
		// Get the id of the tweet on which retweet is clicked
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));

		performTweetAction(streamId, tweetId, null, "undofavorite");
	});

	/**
	 * Sends details of tweet and stream id. Method will check whether
	 * relashionship of stream owner and tweet owner, so more options will be
	 * displyed as per that.
	 * 
	 * @param stream_id
	 *            stream id to fetch stream details.
	 * @param tweetOwner
	 *            Twitter user's screen name.
	 */
	$(".more-options")
			.die()
			.live(
					"click",
					function(e)
					{
						var streamId = ($(this).closest('article').attr('stream-id'));
						var tweetId = ($(this).closest('article').attr('id'));
						var elementId = $(this).attr("id");

						// Get stream from collection.
						var modelStream = Streams_List_View.collection.get(streamId);

						// Get tweet from stream.
						var modelTweet = modelStream.get('tweetListView').get(tweetId);
						var tweet = modelTweet.toJSON();

						var tweetIdStr = tweet.id_str;
						var tweetOwner = tweet.user.screen_name;

						// Fetch stream from collection
						var stream = modelStream.toJSON();

						// Remove extra element from dropdown menu list.
						$('.list-clear').remove();

						// Close all dropdowns of other tweets.
						$('.more-options-list').toggle(false);

						// Open dropdown with slow speed.
						$('#' + elementId + '_list', $('#' + streamId)).toggle("slow");

						// Tweet belongs to stream owner so no extra options
						// required.
						if (stream.screen_name == tweetOwner)
							return;

						// Check stream owner relashionship tweet owner.
						$
								.get(
										"/core/social/checkrelationship/" + streamId + "/" + tweetOwner,
										function(data)
										{
											// Stream owner follows tweet owner
											// then add unfollow option
											if (data.follow == "true")
											{
												$('#' + elementId + '_list', $('#' + streamId))
														.append(
																'<li class="list-clear"><a href="#social" class="unfollow-user" tweet-owner=' + tweetOwner + '>Unfollow @' + tweetOwner + '</a></li>');
											}
											// Stream owner not following tweet
											// owner then add follow option
											else if (data.follow == "false")
											{
												$('#' + elementId + '_list', $('#' + streamId))
														.append(
																'<li class="list-clear"><a href="#social" class="follow-user" tweet-owner=' + tweetOwner + '>Follow @' + tweetOwner + '</a></li>');
											}

											// Tweet owner is stream owner's
											// follower then add send DM option
											if (data.follower == "true")
											{
												$('#' + elementId + '_list', $('#' + streamId)).append(
														'<li class="list-clear"><a href="#social" class="direct-message">Send Direct Message</a></li>');
											}

											// Check tweet owner is Block or
											// Unblock
											if (data.blocked == "true")
											{
												$('#' + elementId + '_list', $('#' + streamId))
														.append(
																'<li class="list-clear"><a href="#social" class="unblock-user" tweet-owner=' + tweetOwner + '>Unblock @' + tweetOwner + '</a></li>');
											}
											else if (data.blocked == "false")
											{
												$('#' + elementId + '_list', $('#' + streamId))
														.append(
																'<li class="list-clear"><a href="#social" class="block-user" tweet-owner=' + tweetOwner + '>Block @' + tweetOwner + '</a></li>');
											}
										}).error(function(data)
								{
									// Error message is shown when error occurs
									displayError(null, data);
								});
					});

	/**
	 * Sends follow request to Follow the contact's Twitter profile in Twitter
	 * based on stream id and Twitter user's screen name
	 * 
	 * @param stream_id
	 *            stream id to fetch stream details
	 * @param tweetOwner
	 *            Twitter user's screen name to send follow request
	 */
	$(".follow-user").die().live("click", function(e)
	{
		// Details to be pass on to method.
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetOwner = $(this).attr("tweet-owner");

		performTweetAction(streamId, null, tweetOwner, "followuser");
	});
	
	/**
	 * Sends unfollow request to unFollow the contact's Twitter profile in
	 * Twitter based on stream id and Twitter user's screen name
	 * 
	 * @param stream_id
	 *            stream id to fetch stream details
	 * @param tweetOwner
	 *            Twitter user's screen name to send unfollow request
	 */
	$(".unfollow-user").die().live("click", function(e)
	{
		// Details to be pass on to method.
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetOwner = $(this).attr("tweet-owner");

		performTweetAction(streamId, null, tweetOwner, "unfollowuser");
	});

	/**
	 * Sends block request to Block the contact's Twitter profile in Twitter
	 * based on stream id and Twitter user's screen name.
	 * 
	 * @param stream_id
	 *            stream id to fetch stream details
	 * @param tweetOwner
	 *            Twitter user's screen name to send block request
	 */
	$(".block-user").die().live("click", function(e)
	{
		// Details to be pass on to method.
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetOwner = $(this).attr("tweet-owner");

		performTweetAction(streamId, null, tweetOwner, "blockuser");
	});

	/**
	 * Sends unblocked request to unBlocked the contact's Twitter profile in
	 * Twitter based on stream id and Twitter user's screen name.
	 * 
	 * @param stream_id
	 *            stream id to fetch stream details
	 * @param tweetOwner
	 *            Twitter user's screen name to send unblock request
	 */
	$(".unblock-user").die().live("click", function(e)
	{
		// Details to be pass on to method.
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetOwner = $(this).attr("tweet-owner");

		performTweetAction(streamId, null, tweetOwner, "unblockuser");
	});

	/**
	 * Sends delete request to Twitter profile in Twitter based on stream id,
	 * Twitter user's screen name and tweet id.
	 */
	$(".delete-tweet").die().live("click", function(e)
	{
		// Ask confirmation to user.
		if (!confirm("Are you sure you want to delete this tweet?"))
			return;

		// Details to pass on to method.
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));

		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(streamId);

		// Get tweet from stream.
		var modelTweet = modelStream.get('tweetListView').get(tweetId);
		var tweet = modelTweet.toJSON();

		var tweetIdStr = tweet.id_str;
		var tweetOwner = tweet.user.screen_name;

		// Call method with details of tweet to be deleted.
		$.get("/core/social/deletetweet/" + streamId + "/" + tweetOwner + "/" + tweetIdStr, function(data)
		{
			if (data == "Successful")
			{
				modelTweet.set("deleted_msg", "deleted");

				// Add back to stream.
				modelStream.get('tweetListView').add(modelTweet);

				showNotyPopUp('information', "Your tweet has been deleted.", "top", 5000);

				// Remove tweet element from ui
				$('.deleted').remove();
			}
			else if (data == "Unsuccessful")
			{
				showNotyPopUp('information', "Retry after sometime.", "top", 5000);
			}
		}).error(function(data)
		{
			// Error message is shown if error occurs
			displayError(null, data);
		});
	});

	/**
	 * Get tweet, show tweet in modal with list of user with details, who
	 * retweeted that tweet.
	 */
	$(".show-retweet").die().live("click", function(e)
	{		
		// Close all dropdowns of all tweets.
		$('.more-options-list').toggle(false);

		// Details to be pass on to method.
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));

		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(streamId);

		// Get tweet from stream.
		var modelTweet = modelStream.get('tweetListView').get(tweetId);
		var tweet = modelTweet.toJSON();

		/*
		 * Suppose input json has id then modal will not be display. Before
		 * calling displayModal need to remove tweet id. Tweet id is not used
		 * here in future.
		 */
		delete tweet.id;

		// Display Modal
		displayModal("socialsuite_RT_userlistModal", "socialsuite-RT-userlist", tweet, null, null, "/core/social/tweet/" + streamId);

		$("#spinner-modal").show();
		
		// Collection for user's list.
		var RTUserListView = new Base_Collection_View({ url : function()
		{
			return '/core/social/getrtusers/' + streamId + "/" + tweet.id_str;
		}, restKey : "user", templateKey : "socialsuite-RT-userlist", individual_tag_name : 'li', });

		RTUserListView.collection.fetch({
		    success : function(data) {		        
		        $("#spinner-modal").hide();
		    },
		    error: function(response) {
		        console.log("ON ERROR");
		        console.log(response);
		        
		        var data = {}; data["responseText"] = "Sorry, that page does not exist";
		        
		        displayError("socialsuite_RT_userlistModal", data);
		    }
		});

		$('#RTuser_list').html(RTUserListView.render(true).el);

		// Create normal time.
		displayTimeAgo($("#socialsuite_RT_userlistModal"));		
	});
});
// Displays modal with filled details.
function displayFilledModal(streamId, tweetId, tweetOwner, messageType)
{
	var urlForPost = "/core/social/tweet/" + streamId;

	// Fetch stream from collection
	var modelStream = Streams_List_View.collection.get(streamId);
	var stream = modelStream.toJSON();

	if (tweetId != null)
	{
		// Get tweet from stream.
		var modelTweet = modelStream.get('tweetListView').get(tweetId);
		var tweet = modelTweet.toJSON();
	}

	// Store info in a json, to send it to the modal window when making send
	// tweet request
	var json = {};

	json["streamId"] = streamId;
	json["profileImg"] = $("#" + streamId + "-profile-img").prop("src");
	json["domain_user_id"] = CURRENT_DOMAIN_USER.id;
	json["screen_name"] = stream.screen_name;
	json["network_type"] = "TWITTER";
	json["token"] = stream.token;
	json["secret"] = stream.secret;
	json["schedule"] = "0";

	switch (messageType) {
	case "Tweet":
	{
		// Set headline of modal window as Send Message
		json["headline"] = "Tweet";

		// Information to be shown in the modal to the user while sending
		// message
		json["info"] = "Status from " + stream.screen_name;
		json["description"] = "What's happening?";
	}
		break;
	case "Reply Tweet":
	{
		if (messageType == "Reply Tweet" && tweetOwner == null)
		{
			// Set headline of modal window as Send Message
			json["headline"] = "Reply Tweet";

			// Information to be shown in the modal to the user while sending
			// message
			json["info"] = "Reply " + "@" + tweet.user.screen_name + " from " + stream.screen_name;
			json["description"] = "@" + tweet.user.screen_name;
			json["tweetId"] = tweet.id_str;
			json["tweetOwner"] = tweet.user.screen_name;
		}
		else if (messageType == "Reply Tweet" && tweetOwner != null)
		{
			// Set headline of modal window as Send Message
			json["headline"] = "Reply Tweet";

			// Information to be shown in the modal to the user while sending
			// message
			json["info"] = "Reply " + "@" + tweetOwner + " from " + stream.screen_name;

			json["description"] = "@" + tweetOwner;
			json["tweetOwner"] = tweetOwner;
			json["tweetId"] = null;
		}
	}
		break;
	case "Direct Message":
	{
		json["headline"] = "Direct Message";

		// Information to be shown in the modal to the user while sending
		// message
		json["info"] = "Direct message from " + stream.screen_name + " to " + tweet.user.screen_name;

		json["description"] = "Tip: you can send a message to anyone who follows you."
		json["tweetId"] = tweet.id_str;
		json["tweetOwner"] = tweet.user.screen_name;
	}
		break;
	case "Retweet":
	{
		// Set headline of modal window as Send Message
		json["headline"] = "Retweet";

		// Information to be shown in the modal to the user while sending
		// message
		json["info"] = "Status of " + "@" + tweet.user.screen_name;

		json["description"] = tweet.original_text;
		json["tweetId"] = tweet.id;
		json["tweetOwner"] = tweet.user.screen_name;

		urlForPost = "/core/social/retweet/" + streamId + "/" + tweet.id_str;
	}
		break;
	}

	console.log(json);

	// Display Modal
	displayModal("socialsuite_twitter_messageModal", "socialsuite-twitter-message", json, "twitter-counter", "twit-tweet", urlForPost);

	// In compose message text limit is crossed so disable send button.
	$('#twit-tweet').on('cross', function()
	{
		$('#send_tweet').attr("disabled", "disable");		
	});

	// In compose message text limit is uncrossed so enable send button.
	$('#twit-tweet').on('uncross', function()
	{
		// If scheduling is selected and schedule is in past time so do not enable schedule button.
		if(!Schedule_In_Future && $("#schedule_controls").css("display") == "block")
			return;
		
		/*
		 * 1. If scheduling is selected and selected schedule is in future time so enable schedule button.
		 * 2. If scheduling is not selected and its non schedule message so enable schedule button.
		 */
		$('#send_tweet').removeAttr('disabled');
		
	});
}

// Displays Modal.
function displayModal(modalToDisplay, templt, json, counterVar, focusElmnt, urlForPost)
{
	// If modal already exists remove to show a new one
	$('#' + modalToDisplay).remove();
	
	Schedule_In_Future = false;

	// Populate the modal template with the above json details in the form
	Message_Model = new Base_Model_View({ data : json, url : urlForPost, template : templt, modal : '#' + modalToDisplay, postRenderCallback : function(el)
	{
		$('.modal-backdrop').remove();
		
		if (Message_Model.model.get("id") || Message_Model.model.get("response") == "Successful")
			return;

		console.log("Message_Model postrender");

		$('#' + modalToDisplay, el).modal('show');
	}, saveCallback : function(data)
	{
		console.log('Message_Model save callback');
		console.log(data);

		// Display Noty on top.
		displayNoty(data);

		// Hide message modal.
		$('#' + modalToDisplay).modal('hide');
		$('#' + modalToDisplay).remove();
	} });

	$('#content').append(Message_Model.render().el);

	if (counterVar != null && focusElmnt != null)
	{
		// Display modal
		$('#' + modalToDisplay).on('shown', function()
		{
			head.js(LIB_PATH + 'lib/bootstrap-limit.js', function()
			{
				$(".twit-tweet-limit").limit({ maxChars : 140, counter : "#" + counterVar });
				$('#' + modalToDisplay).find('#' + focusElmnt).focus();
			});
		});
	}
}

function displayNoty(data)
{
	// data.response may be :Successful, UnSuccessful or Id of RT.
	
	if (data.response == "Successful")
	{
		if (Message_Model.model.get("headline") == "Tweet")
			showNotyPopUp('information', "Your Tweet was posted!", "top", 5000);
		else
			showNotyPopUp('information', "Your Tweet to @" + Message_Model.model.get("tweetOwner") + " has been sent!", "top", 5000);
	}
	else if (data.response == "Unsuccessful")
	{
		// On failure, shows the status as retry
		$('#socialsuite_twitter_messageModal').find('span.save-status').html("Retry");
		showNotyPopUp('information', "Retry after sometime.", "top", 5000);
	}
	else if (Message_Model.model.get("headline") == "Retweet" && data.response != undefined)
		showEffectOfRT(data);
	else if (data.id != undefined && data.schedule != undefined)
		{
    	  // Show clock icon in social suite, which is linked to shcedule update page.	
	      $("#show_scheduled_updates").show(); 
		}	
}

/*
 * Makes changes in UI, user click on RT of tweet actions, After RT it will
 * change RT icon in green color.
 */
function showEffectOfRT(data)
{
	// Fetch stream from collection
	var modelStream = Streams_List_View.collection.get(Message_Model.model.get("streamId"));

	// Get tweet from stream.
	var modelTweet = modelStream.get('tweetListView').get(Message_Model.model.get("tweetId"));

	console.log(modelStream);
	console.log(modelTweet);

	if (modelStream == undefined || modelTweet == undefined)
		return;

	// On success, the color of the retweet is shown green. Update
	// attribute in tweet.
	modelTweet.set("retweeted_by_user", "true");
	modelTweet.set("retweet_id", data.response);

	// Add back to stream.
	modelStream.get('tweetListView').add(modelTweet);

	// Create normal time.
	displayTimeAgo($(".chirp-container"));
}
/**
 * This file contains event of button which shows calendar and timer in message
 * modal and check selected schedules range.
 */

$(function()
{
	/* Show calender and time for selection on message modal. */
	$("#tweet_scheduling").die().live(
			"click",
			function(e)
			{
				// Message modal open for edit scheduled update.
				if ($("#schedule_controls").css("display") == "block" && Scheduled_Edit)
					return;

				// Toggle calendar and timer.
				$("#schedule_controls").toggle();

				if ($("#schedule_controls").css("display") == "block")
				{
					// Change send button's text.
					document.getElementById("send_tweet").innerHTML = "Schedule";
					$("#send_tweet").attr("disabled", "disable");

					this.className = "tweet-scheduling tweet-scheduling-active";

					// Set current date.
					$('input.date').val(new Date().format('mm/dd/yyyy'));
					$('#scheduled_date').datepicker({ startDate : "today", autoclose : true, todayHighlight : true, format : 'mm/dd/yyyy' }).on('changeDate',
							function(ev)
							{
								console.log(new Date(ev.date));

								// Check selected schedule
								isPastSchedule();
							});

					// Set current time.
					$('#scheduled_time').timepicker({ template : 'modal', showMeridian : false, defaultTime : 'current' }).on('changeTime.timepicker',
							function(e)
							{
								console.log(e.time.value);

								// Check selected schedule
								isPastSchedule();
							});

					// Save original URL from model.
					Previous_URL = Message_Model.model.url;

					// Update scheduled URL in model.
					Message_Model.model.url = '/core/scheduledupdate';
				}
				else
				{
					// Message modal open for scheduled update edit.
					if (Scheduled_Edit)
						return;

					this.className = "tweet-scheduling";
					// $('input.date').val()='';
					$('#scheduled_time').attr("value", '');

					// Set original URL back to model.
					Message_Model.model.url = Previous_URL;

					// Change send button's text.
					document.getElementById("send_tweet").innerHTML = "Send";
					$('#send_tweet').removeAttr("disabled");

					// Scheduling de-select
					Schedule_In_Future = false;

					// To check text limit after button text change.
					$('#twit-tweet').keypress();
				}
			});

	/**
	 * Calls function to check selected time after cloasing Time picker modal.
	 */
	/**$('.bootstrap-timepicker').die().live('hide', function()
	{
		isPastSchedule();
	});
	*/

	/**
	 * Calls function to open Message modal with selected scheduled update
	 * details and save into DB after modifications.
	 */
	$('.edit-scheduled-update').die().live('click', function()
	{
		var updateId = $(this).closest('tr').find('.data').attr('data');

		// Opens Message Modal and save modifications in DB, makes changes in
		// UI.
		scheduledmessagesEdit(updateId);
	});
});
/**
 * Calls updateNotification method to update or add new tweet notification with
 * count of new unread tweets in stream.
 * 
 * @param stream
 */
function showNotification(stream)
{
	console.log("showNotification");
	console.log(stream);

	if (stream)
		updateNotification(stream);
	else
	{
		var streamsJSON = Streams_List_View.collection.toJSON();

		// Streams not available.
		if (streamsJSON == null)
			return;

		// Get stream
		$.each(streamsJSON, function(i, stream)
		{
			updateNotification(stream);
		});
	}

	// Remove deleted tweet element from ui
	$('.deleted').remove();
}

/**
 * Check for new tweets when user was not in social tab. Show new tweet
 * notification on respective stream with number of new tweet.
 */
function updateNotification(stream)
{
	console.log("updateNotification");
	console.log(stream);

	// Get stream from collection.
	var modelStream = Streams_List_View.collection.get(stream.id);

	// Get all new unread tweet on basis of isNew field value true.
	var newAddedTweets = modelStream.get('tweetListView').where({ isNew : "true" });

	console.log(newAddedTweets.length);

	// If no new unread tweets are available but stream has some tweets so clear
	// no tweet notification from stream.
	if (newAddedTweets.length == 0 && modelStream.get('tweetListView').length >= 1)
	{
		// Remove no tweet notification.
		clearNoTweetNotification(Streams_List_View.collection.get(stream.id));

		return;
	}
	else if (newAddedTweets.length == 1)
	{
		// Add notification of new tweet on stream.
		document.getElementById('stream_notifications_' + stream.id).innerHTML = '<p>' + newAddedTweets.length + ' new Tweet </p>';
	}
	else if (newAddedTweets.length > 1)
	{
		// Add notification of new tweets on stream.
		document.getElementById('stream_notifications_' + stream.id).innerHTML = '<p>' + newAddedTweets.length + ' new Tweets </p>';
	}

	/*
	 * Add relation from <div> for notification. So on click of notification we
	 * can add new unread tweets to stream.
	 */
	$('#stream_notifications_' + stream.id).attr("rel", 'add-new-tweet');
}

/**
 * Remove no tweet notification. Search for that tweet in collection and makes
 * that tweets model hide.
 */
function clearNoTweetNotification(modelStream)
{
	console.log("In clearNoTweetNotification.");

	// Get tweet from stream.
	var modelTweet = modelStream.get('tweetListView').get('000');

	console.log(modelTweet);

	if (modelTweet != null || modelTweet != undefined)
	{
		// Set show false, so handlebar condition check will avoid to display.
		modelTweet.set("show", false);

		// Add back to stream.
		modelStream.get('tweetListView').add(modelTweet);
	}
}

/**
 * When request rate limit is exceeded so Twitter server send code 88, It will
 * not accept any more REST call. When Twitter service or network is unavailable
 * User have to wait for some time and retry again. We need to display
 * notification for that in relavant stream.
 */
function displayErrorInStream(errorMsg)
{
	console.log("errorMsg: ");
	console.log(errorMsg);
	var streamId = null;

	// Get stream id.
	if (errorMsg.id == "001") // from Tweet
		streamId = errorMsg.stream_id;
	else
		// from Stream
		streamId = errorMsg.id;

	// Hide waiting symbol.
	$("#stream-spinner-modal-" + streamId).hide();

	var modelStream = Streams_List_View.collection.get(streamId);

	if (modelStream.get('tweetListView').length == 0)
	{
		console.log("There is nothing to display");
		console.log(modelStream.get('tweetListView'));

		// Add notification of error on stream.
		document.getElementById('stream_notifications_' + streamId).innerHTML = '<p>Request rate limit exceeded, Retry after some time. <i class="icon icon-refresh" title="Retry again."></i></p>';

		// Add relation from <div> for notification.
		$('#stream_notifications_' + streamId).attr("rel", 'retry');
	}
}
/**
 * Creates Pubnub object and subscribe client channel as well as publish on
 * agile_CRM_Channel.
 * 
 */
function initToPubNub()
{
	console.log(Pubnub);
	// Pubnub already defined.
	if(Pubnub != undefined)
	 if (Pubnub != null)
	 	 return;

	// Pubnub not defined.
	var protocol = 'https';

	head.js(protocol + '://pubnub.a.ssl.fastly.net/pubnub-3.4.min.js', function()
	{
		// CREATE A PUBNUB OBJECT
		Pubnub = PUBNUB.init({ 'publish_key' : 'pub-c-e4c8fdc2-40b1-443d-8bb0-2a9c8facd274', 'subscribe_key' : 'sub-c-118f8482-92c3-11e2-9b69-12313f022c90',
			ssl : true, origin : 'pubsub.pubnub.com', });
		// Get compatibility with all browsers.
		// Pubnub.ready();

		// Subscribe to client channel. Receive tweet from social server.
		subscribeClientChannel();
	});
}

/**
 * Subscribe client channel.
 */
function subscribeClientChannel()
{
	Pubnub.subscribe({ channel : CURRENT_DOMAIN_USER.id + "_Channel", restore : true, message : function(message, env, channel)
	{
		console.log(message);

		// Display message in stream.
		handleMessage(message);

	}, // RECEIVED A MESSAGE.
	presence : function(message, env, channel)
	{
		console.log(message);
	}, // OTHER USERS JOIN/LEFT CHANNEL.
	connect : function()
	{
		console.log("Agile crm Connected");

		// Display added streams
		socialsuitecall.streams();
	}, // CONNECTION ESTABLISHED.
	disconnect : function(channel)
	{
		console.log(channel + " Disconnected");
	}, // LOST CONNECTION (OFFLINE).
	reconnect : function(channel)
	{
		console.log(channel + " Reconnected")
	}, // CONNECTION BACK ONLINE!
	error : function(channel)
	{
		console.log(channel + " Network Error")
	}, });
}

/**
 * Publish message (action of user) on agile_crm_Channel.
 */
function sendMessage(publishJSON)
{
	console.log("publish_message publishJSON: ");
	console.log(publishJSON);

	// Message to publish is empty.
	if (publishJSON == null)
		return;

	// Message has data.
	Pubnub.publish({ channel : "agile_crm_Channel", message : publishJSON, callback : function(info)
	{
		if (info[0])
			console.log("publish_message Successfully Sent!");
		else
		// The internet is gone. // TRY SENDING AGAIN!
		{
			console.log("publish_message unsuccessfull to Sent!");
			showNotyPopUp('information', "You are not connected with Twitter server or you have problem with connection!", "top", 5000);
			displayErrorInStream(publishJSON.stream);
			
			// How many streams are register.			
			Register_Counter++;
			
			// Register next stream.
			registerAll(Register_Counter);
			
			// sendMessage(publishJSON);
		}
	} });
}
/**
 * Calls from onload of Profile image on add contact form to fill account
 * holder's name in Form.
 */
function onloadProfileImg()
{
	// Save button for twitter on addStreamModal is shown.
	$('#add_twitter_stream').show();

	// Add twitter stream types template.
	$("#streamDetails").html(getTemplate('twitter-stream-type'), {});

	// Add profile image to account description.
	$('#twitter_profile_img').attr("src", document.getElementById("twitter_profile_img_url").src);

	// Add screen name to label.
	document.getElementById('account_description_label').innerHTML = '<b>' + $('#twitter_account').val() + '</b>';
}

// Add website and select network on continue form in add contact form flow for update page.
function socialsuite_add_website()
{
	if (Tweet_Owner_For_Add_Contact != null)
	{
		// Add values in continue form after add contact form.
		// Add website / handle of twitter of tweet owner.
		$("#website", $('#continueform')).attr("value", Tweet_Owner_For_Add_Contact);

		// Select network type.
		$("div.website select").val("TWITTER");

		Tweet_Owner_For_Add_Contact = null;
	}
}

/*
 * Change property of website and select network in add contact form. When email
 * id is entered, pic is related to that. When email id is not there so twitter
 * profile image is selected. There is some error already, so to adjust size of
 * image and twitter handle text size as per that.
 */
function changeProperty()
{
	var display = $('#network_handle', $('#personModal')).css("display");
	var picDisplay = $("#pic", $('#personModal')).css("display");
	var picValue = $("#pic", $('#personModal')).html();

	if ((picDisplay == 'inline' || picDisplay == 'block') && picValue != '')
	{
		if (display == 'none')
			document.getElementById("network_handle").className = 'after-img-load-hide';
		else if (display == 'block')
			document.getElementById("network_handle").className = 'after-img-load-show';

		document.getElementById("handle").className = 'add-form-input';
	}
	else if ((picDisplay == 'none' || picDisplay == null || picDisplay == '') || (picValue == null || picValue == ''))
	{
		if (display == 'none')
			document.getElementById("network_handle").className = 'network-handle';
		else if (display == 'block')
			document.getElementById("network_handle").className = 'socialsuite-network-handle';

		document.getElementById("handle").className = '';
	}
}
/**
 * AS per tweet data and type, It will perform actions like : display rate limit
 * exceed error, add tweet, show notification if user is not in social
 * tab/window.
 * if tweet id is 001 : Rate limit exceeded.
 * if tweet id is 000 : tweets not available for stream..
 * if tweet type is ACK : tweet is register on server and all REST tweets are sent.
 */
function handleMessage(tweet)
{
	// We need this messages to reflect actions in all added relevant streams.
	if (tweet["delete"] != null) // (tweet.delete != null)
	{
		console.log("delete tweet");
		return;
	}

	// Error message from server "Rate limit exceeded." or "server not connected."
	if (tweet.id == "001") // (tweet.delete != null)
	{
		displayErrorInStream(tweet);
		return;
	}

	// Get stream from collection.
	var modelStream = Streams_List_View.collection.get(tweet.stream_id);

	if (modelStream != undefined)
	{
		console.log("Current_Route: "+Current_Route+" Focused: "+Focused);

		// User on #social as well as window is active.
		if (Current_Route == "social" && Focused == true)
		{
			// New tweet notification not yet clicked in stream.
			if ($('#stream_notifications_' + tweet.stream_id).is(':empty') == false)
			{
				// console.log("not clicked");

				// User did not click on notification so mark tweet as new unread tweet.
				isNewUnreadTweet(tweet);

				// Change notification to show number of new tweets.
				showNotification(modelStream);
			}
			else
			{
				// User is in #social and there is no notification on stream.
				// Rebuild tweet and Add tweet to model in normal way.
				rebuildTweet(modelStream, tweet);
			}
		}
		else
		{			
			// Add tweet as new unread, because user is on another tab or window is inactive.
			isNewUnreadTweet(tweet);

			// User in #social but window is inactive.
			if (Current_Route == "social")
			{
				// Change notification to show number of new tweets.
				showNotification(modelStream);
			}
		}
	} // If End

	// Remove deleted tweet element from ui
	$('.deleted').remove();
}

/*
 * Convert normal text of tweet to tweet with links on @screen_name , #hashtags
 * and url.
 */
function convertTextToTweet(tweet)
{
	var linkableTweetArray = new Array();
	var tweetText = tweet.text;
	var regex = new RegExp();
	var temp;

	// Replace &amp; with &
	regex = new RegExp("&amp;", "g");
	tweetText = tweetText.replace(regex, '&');

	// Split text in array.
	linkableTweetArray = tweetText.split(/[\s,?&;.'":!)({}]+/);

	// Remove duplicate words.
	linkableTweetArray = _.uniq(linkableTweetArray);

	for ( var i = 0; i < linkableTweetArray.length; i++)
	{
		if (linkableTweetArray[i].charAt(0) == "@") // Mentions
		{
			regex = new RegExp(linkableTweetArray[i], "g");
			tweetText = tweetText
					.replace(
							regex,
							'&lt;a href=\'https://twitter.com/' + linkableTweetArray[i].substring(1) + '\' target=\'_blank\' class=\'cd_hyperlink\'>' + linkableTweetArray[i] + '&lt;/a>');
		}
		else if (linkableTweetArray[i].charAt(0) == "#") // Hashtags
		{
			regex = new RegExp(linkableTweetArray[i], "g");
			var url = "https://twitter.com/search?q=%23" + linkableTweetArray[i].substring(1) + "&src=hash";
			tweetText = tweetText.replace(regex, '&lt;a href=\'' + url + '\' target=\'_blank\' class=\'cd_hyperlink\'>' + linkableTweetArray[i] + '&lt;/a>');
		}
	}

	// URL
	linkableTweetArray = new Array();
	linkableTweetArray = tweetText.split(/\s/);
	var exp = "^(https?|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]";

	$.each(linkableTweetArray, function(index, word)
	{
		if (word.match(exp))
			tweetText = tweetText.replace(word, '&lt;a href=\'' + word + '\' target=\'_blank\' class=\'cd_hyperlink\'>' + word + '&lt;/a>');
	});

	regex = new RegExp("&lt;", "g");
	tweetText = tweetText.replace(regex, '<');
	return tweetText;
}
$(function()
{
	/**
	 * After display of add contact form, Fills name with tweet owner's name in
	 * add-contact popup form.
	 */
	$(".add-twitter-contact").die().live("click", function(e)
	{
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));

		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(streamId);

		// Get tweet from stream.
		var tweet = modelStream.get('tweetListView').get(tweetId).toJSON();

		// Tweet owner's full name.
		var fullName = tweet.user.name;

		// Tweet owner's description.
		var description = tweet.user.description;

		// Tweet owner's handle/Screen name.
		Tweet_Owner_For_Add_Contact = tweet.user.screen_name;

		// Separate full name.
		var firstName = fullName.substr(0, fullName.indexOf(' '));
		var lastName = fullName.substr(fullName.indexOf(' ') + 1);

		// Add values in add contact form.
		$("#fname", $('#personModal')).attr("value", firstName);
		$("#lname", $('#personModal')).attr("value", lastName);
		$("#job_title", $('#personModal')).attr("value", description);

		document.getElementById("network_handle").className = 'socialsuite-network-handle';
		$("#handle", $('#personModal')).attr("value", Tweet_Owner_For_Add_Contact);

		// Add website / handle of twitter of tweet owner.
		$("#website", $('#personModal')).attr("value", Tweet_Owner_For_Add_Contact);
		$("#image", $('#personModal')).attr("value", tweet.user.profile_image_url);

		// Select network type.
		$("div.website select").val("TWITTER");

		// If picture is not null and undefined, display it by given width, else
		// display none
		var pic = tweet.user.profile_image_url;
		if (pic != undefined && pic != null)
		{
			var el = $('<img class="imgholder thumbnail person-img" onload="changeProperty()" style="display: inline;"  src="' + pic + '"></img>');
			$('#pic').html(el).show();
			$("img").error(function()
			{
				$('#pic').css("display", "none");
			});
		}

		// As per pic property need to change social suites element property.
		changeProperty();
	});

	// Hide network handle from add contact form.
	$('#personModal').on('hidden.bs.modal', function()
	{
		document.getElementById("network_handle").className = 'network-handle';
		document.getElementById("handle").className = '';
		$('#pic').css("display", "none");
		$('#pic').empty();
		changeProperty();
	});

	// If img is shown then reduce size of network handle on add contact form.
	$('#personModal').on('shown.bs.modal', function()
	{
		changeProperty();
	});
	$('#personModal').on('show.bs.modal', function()
	{
		changeProperty();
	});
	$("#pic").change(function()
	{
		changeProperty();
	});
});
/** 
 * This file contains all event related actions on Stream, 
 * Like add stream, remove stream, select network type, select stream type, etc.
 */

/** On load of social suites page. */
$(function()
{
	// Default values
	Stream_Type = null;
	Network_Type = null;
	Register_All_Done = false;
	Tweet_Owner_For_Add_Contact = null;
	Focused = true;
	Scheduled_Edit = false;
	Register_Counter = null;
	Add_Img_Done = false;

	/*
	 * When user click on clock icon to schedule update so need to save original
	 * URL of model, in case of user de-select scheduling.
	 */
	Previous_URL = null;

	// If selected schedule is future time then it will be true.
	Schedule_In_Future = false;

	// Flag for Scroll down reached to end of stream.
	Scroll_Down_Call = false;

	// How many Tweets ready for display.
	Past_Tweets_Count = 0;
});

// To collect tweets in temp collection.
window.onfocus = function()
{
	Focused = true;
};
window.onblur = function()
{
	Focused = false;
};

function initializeSocialSuite()
{
	// On close tab/window unregister all streams on server.
	$(window).unload(function()
	{
		unregisterAll();
	});

	// After clicking on logout, unregister all streams on server.
	$('a').click(function(event)
	{
		var herfLogout = $(this).attr("href");
		if (herfLogout == "/login")
			unregisterAll();
	});

	/**
	 * Display popup form with stream details.
	 */
	$(".add-stream").die().live("click", function(e)
	{
		// Need to call openTwitter function in ui.js for Oauth.
		head.js('js/designer/ui.js', function()
		{
		});

		// Reset all fields
		$('#streamDetail').each(function()
		{
			this.reset();
		});

		// Enable button of add stream on form of stream detail
		// $('#addStreamModal').find('#add_twitter_stream').removeAttr('disabled');

		// Fill elements on form related to stream.
		fillStreamDetail();

		// Add social network types template
		$("#streamDetails").html(getTemplate('socialsuite-social-network'), {});

		// Show form modal
		$('#addStreamModal').modal('show');
	});

	/**
	 * On click of twitter icon, Calls Oauth for selected network type.
	 */
	$(".network-type").die().live("click", function(e)
	{
		// User select Twitter.
		if (this.id == "twitter_option")
		{
			// Oauth for twitter.
			openTwitter();

			/**
			 * Get network type from selected option of social networks. Icon
			 * can not store value attribute so need store on options.
			 */
			Network_Type = "TWITTER";
		}

		// Store network type on input element for form feild.
		$("#network_type", $('#addStreamModal')).attr("value", Network_Type);
	});

	/**
	 * Get stream name from selected option in list of streams.
	 */
	$(".stream-type")
			.die()
			.live(
					"click",
					function(e)
					{
						e.preventDefault();

						if (this.className == "stream-type stream-type-button-color")
						{
							// remove keyword input element
							$('.remove-keyword').remove();

							// Remove all selection.
							$('.stream-type').removeClass("stream-type-button-color");

							// Button deselected.
							this.className = "stream-type";

							// Empty stream type.
							Stream_Type = null;
							$("#stream_type", $('#addStreamModal')).attr("value", '');
						}
						else
						{
							// Remove all other selection.
							$('.stream-type').removeClass("stream-type-button-color");

							// Button selected.
							this.className = "stream-type stream-type-button-color";

							// Store stream type.
							Stream_Type = $(this).attr("value").trim();
							$("#stream_type", $('#addStreamModal')).attr("value", Stream_Type);

							// Display keyword field.
							if (Stream_Type == "Search")
							{
								document.getElementById('search_stream_keyword').innerHTML = '<div class="remove-keyword"><input id="keyword" name="keyword" type="text" class="required" required="required" autocapitalize="off" placeholder="Search Keyword..." value=""></div>';
							}
							else
							{
								// Remove keyword input element
								$('.remove-keyword').remove();
							}
						}

						// Removes bg color.
						$(this).css('background-color', '');
					});

	/**
	 * Get description of stream on mouse over and show at bottom of add stream
	 * form.
	 */
	$(document)
			.on(
					"mouseover",
					".stream-type",
					function(e)
					{
						// To show stream type description.
						document.getElementById("stream_description_label").className = 'txt-mute';

						// Gets value of selected stream type.
						mouseoverStream = $(this).attr("value");

						var theColorIs = $(this).css("background-color");

						if (theColorIs != 'rgb(187, 187, 187)')
						{
							// Changes bg color.
							$(this).css('background-color', '#EDEDED');
						}

						switch (mouseoverStream) {
						case "Search":
							document.getElementById('stream_description_label').innerHTML = '<i class="icon-search"></i> Relevant Tweets matching a specified Search Keyword.';
							break;
						case "Home":
							document.getElementById('stream_description_label').innerHTML = '<i class="icon-home"></i> Tweets and retweets of user and followers.';
							break;
						case "Mentions":
							document.getElementById('stream_description_label').innerHTML = '<img src="../img/socialsuite/mentions.png" style="width: 15px;height: 15px;"> Mentions (all tweets containing a users\'s @screen_name).';
							break;
						case "Retweets":
							document.getElementById('stream_description_label').innerHTML = '<i class="icon-retweet"></i> User\'s tweets retweeted by others.';
							break;
						case "DM_Inbox":
							document.getElementById('stream_description_label').innerHTML = '<i class="icon-download-alt"></i> Direct messages sent to the user.';
							break;
						case "DM_Outbox":
							document.getElementById('stream_description_label').innerHTML = '<i class="icon-upload-alt"></i> Direct messages sent by the user.';
							break;
						case "Favorites":
							document.getElementById('stream_description_label').innerHTML = '<i class="icon-star"></i> User\'s favorite tweets.';
							break;
						case "Sent":
							document.getElementById('stream_description_label').innerHTML = '<i class="icon-share-alt"></i> Tweets sent by the user.';
							break;
						case "Scheduled":
							document.getElementById('stream_description_label').innerHTML = '<i class="icon-time"></i> Tweets scheduled for sending later.';
							break;
						case "All_Updates":
							document.getElementById('stream_description_label').innerHTML = '<i class="icon-home"></i> Updates and shares from user\'s connections and groups.';
							break;
						case "My_Updates":
							document.getElementById('stream_description_label').innerHTML = '<i class="icon-share-alt"></i> Updates authored by the user.';
							break;
						}// switch end
					});

	/**
	 * Remove description of stream on mouse out and from bottom of form.
	 */
	$(document).on("mouseout", ".stream-type", function(e)
	{
		// Removes bg color.
		$(this).css('background-color', '');

		// To hide stream type description.
		document.getElementById("stream_description_label").className = 'description-hidden txt-mute';
	});

	/**
	 * Fetchs data from popup stream add form and save stream as well as add to
	 * the collection, publish register message to the server.
	 */
	$(".save-twitter-stream")
			.die()
			.live(
					"click",
					function(e)
					{
						// Check add-stream button is not enable
						if ($('#addStreamModal').find('#add_twitter_stream').attr('disabled'))
							return;

						// Check if Oauth is done.
						if ($('#twitter_account').val() == null || $('#twitter_account').val() == '')
						{
							alert("You have to give access to your social account.");
							$("#add-stream").click();
							return;
						}

						// Check if stream type is not selected.
						if (Stream_Type == null || Stream_Type == '')
						{
							// To show error description.
							document.getElementById("stream_description_label").className = 'txt-mute';
							document.getElementById('stream_description_label').innerHTML = '<span style="color: red;"><i class="icon-exclamation"></i> You have to select your favorite stream type.</span>';
							return;
						}

						// Check if the form is valid
						if (!isValidForm('#streamDetail'))
						{
							$('#streamDetail').find("input").focus();
							return false;
						}

						// Disables add button to prevent multiple add on click
						// event issues
						$('#addStreamModal').find('#add_twitter_stream').attr('disabled', 'disabled');

						// Show notification for adding stream.
						showNotyPopUp('information', "Adding Stream...", "top", 2500);

						// Get data from form elements
						var formData = jQuery(streamDetail).serializeArray();
						var json = {};

						// Convert into JSON
						jQuery.each(formData, function()
						{
							json[this.name] = this.value || '';
						});

						// Add collection's column index in stream.
						json["column_index"] = Streams_List_View.collection.length + 1;

						// Create new stream
						var newStream = new Backbone.Model();
						newStream.url = '/core/social';
						newStream.save(json, { success : function(stream)
						{
							// Append in collection,add new stream
							socialsuitecall.streams(stream);

							// Scroll down the page till end, so user can see
							// newly added stream.
							$("html, body").animate({ scrollTop : $(document).height() - $(window).height() });

							// Register on server
							var publishJSON = { "message_type" : "register", "stream" : stream.toJSON() };
							sendMessage(publishJSON);

							// Notification for stream added.
							showNotyPopUp('information', "Stream added. You can add another Stream now.", "top", 4000);

							setTimeout(function()
							{
								// Find selected stream id.
								var idOfStreamType = $('#addStreamModal').find("div[value='" + Stream_Type + "']").attr('id');
								$("#" + idOfStreamType).click();

								// Make send button enable
								$('#addStreamModal').find('#add_twitter_stream').removeAttr('disabled');

								Stream_Type = "";
							}, 4000);

							// Adds tag in 'our' domain to track usage
							addTagAgile(SOCIAL_TAG);

						}, error : function(data)
						{
							console.log(data);
						} });
					});

	/**
	 * Gets stream, Delete it from collection and dB and publish unregister
	 * stream.
	 */
	$(".stream-delete").die().live("click", function(e)
	{
		if (!confirm("Are you sure you want to delete?"))
			return;

		var id = $(this).attr('id');

		// Fetch stream from collection
		var stream = Streams_List_View.collection.get(id).toJSON();

		// Stream size is too big, can not handle by pubnub so remove list of
		// tweet.
		delete stream.tweetListView;

		// Unregister on server
		var publishJSON = { "message_type" : "unregister", "stream" : stream };
		sendMessage(publishJSON);

		// Delete stream from collection and DB
		Streams_List_View.collection.get(id).destroy();
	});

	/**
	 * In stream on click of notification, Gets relation and perform action as
	 * per that. like Retry : re-register stream on server. Add-new -tweet : Add
	 * new unread tweets on stream.
	 */
	$(".action-notify").die().live("click", function(e)
	{
		// Get relation for action.
		var relation = $(this).attr('rel');

		// Get stream id.
		var streamId = $(this).attr('data');

		// Remove notification of new tweets on stream.
		document.getElementById(this.id).innerHTML = '';

		if (relation == "add-new-tweet")
			mergeNewUnreadTweets(streamId);
		else if (relation == "retry")
			registerStreamAgain(streamId);

		// Remove relation from <div> for notification.
		$(this).attr("rel", '');

		// Remove deleted tweet element from ui
		$('.deleted').remove();
	});
}
/**
 * When social tab is not selected or user is in different tab, so add isNew
 * field with value true in tweet. so that will usefull to count unread tweets
 * and display that count in stream notification.
 */
function isNewUnreadTweet(tweet)
{
	var modelStream = null;

	// Newly register stream tweet or first tweet. So need to take stream from
	// original collection.
	if (tweet.id == "000" || tweet.type == "ACK")
	{
		console.log("got 000");
	}
	else
	{
		tweet["isNew"] = "true";
	}

	// Get stream from collection.
	modelStream = Streams_List_View.collection.get(tweet.stream_id);

	// Add tweet to stream model.
	rebuildTweet(modelStream, tweet);
}

/**
 * Calls method to Add Tweet in relevant stream (in sub-collection) with some extra tags as per
 * requirement are added. We were not having pubnub channel capacity so this solution
 * applied.
 */
function rebuildTweet(modelStream, tweet)
{
	// Hide waiting symbol.
	$("#stream-spinner-modal-" + tweet.stream_id).hide();

	// Add type of message
	if (tweet.text == "There is no tweets to show here." || tweet.text == "Dear you do not have any tweets.")
	{
		tweet["msg_type"] = "NoTweet";
		tweet["show"] = true;
		tweet.text = "No Tweets to show here.";
	}
	else if (tweet.type == "ACK")
	{
		// This ACK is from our social server to indicate current stream is
		// registered.
		tweet["msg_type"] = "ACK";
		tweet["text"] = "ACK";
	}
	else
	{
		console.log(tweet);
		if (tweet.text == null || tweet.user == null)
			return;

		tweet["msg_type"] = "Tweet";

		console.log(modelStream.get('tweetListView').length);

		// Remove no tweet notification.
		if (modelStream.get('tweetListView').length == 2)
			clearNoTweetNotification(modelStream);

		// If stream owner is tweet owner no need to show retweet icon.
		if (modelStream.get('screen_name') != tweet.user.screen_name)
			tweet["tweetowner_not_streamuser"] = true;

		// If stream is Sent or tweet owner is stream owner then show delete
		// option.
		if (tweet.stream_type == "Sent" || modelStream.get('screen_name') == tweet.user.screen_name)
			tweet["deletable_tweet"] = true;

		// If tweet is DM then show delete options and hide other options.
		if (tweet.stream_type == "DM_Inbox" || tweet.stream_type == "DM_Outbox")
		{
			tweet["direct_message"] = true;
			tweet["deletable_tweet"] = true;
		}

		// To set RT icon green, to show tweet is RT by user.
		var checkRT = modelStream.get('screen_name') + " retweeted";
		if (tweet.retweeted == checkRT)
			tweet["retweeted_by_user"] = true;

		// Save original text for other actions.
		tweet["original_text"] = tweet.text;

		// Converts normal text to tweet with link on url, # and @.
		tweet.text = convertTextToTweet(tweet);
	}

	// console.log("tweet : "+tweet.text);
	// console.log("add at "+modelStream.get('tweetListView').length);

	// On scroll down, To avoid freezing, collect 5 tweets in JSON Array and then add to stream.
	if (Scroll_Down_Call == true)
	{
		checkPastTweetAdd(tweet, modelStream);
		return;
	}

	/*
	 * Ack from server that shows current streams registration is done. So call
	 * register all with new counter to register next stream
	 */
	if (tweet.type == "ACK")
	{
		Register_Counter++;
		registerAll(Register_Counter);
	}

	// Add tweet to relevant stream.
	addTweetToStream(tweet, modelStream);
}

/**
 * Add given tweets in given stream model which is sub-collection.
 */
function addTweetToStream(tweet, modelStream)
{
	// Sort stream on tweet id basis which is unique and recent tweet has highest value.
	modelStream.get('tweetListView').comparator = function(model)
	{
		if (model.get('id'))
			return -model.get('id');
	};

	// Add tweet to stream.
	modelStream.get('tweetListView').add(tweet);

	// Sort stream on id. so recent tweet comes on top.
	modelStream.get('tweetListView').sort();

	// Create normal time.
	displayTimeAgo($(".chirp-container"));
}

/**
 * Removes isNew field from tweet so new unread tweet can be visible in stream. 
 */
function mergeNewUnreadTweets(streamId)
{
	// Get stream from collections.
	var stream = Streams_List_View.collection.get(streamId);

	var newAddedTweets = stream.get('tweetListView').where({ isNew : "true" });

	$.each(newAddedTweets, function(i, tweetModel)
	{
		tweetModel.unset("isNew");
	});

	// Create normal time.
	displayTimeAgo($(".chirp-container"));

	// Remove waiting symbol.
	removeWaiting();
}
/**
 * Fill details of stream in add-stream form and arrange elements as per
 * requirement.
 */
function fillStreamDetail()
{
	// Network Type not selected
	Network_Type = null;

	// Stream Type not selected
	Stream_Type = null;

	// Empty screen name means Oauth is not done.
	$("#twitter_account", $('#addStreamModal')).attr("value", '');

	// Empty stream type.
	$("#stream_type", $('#addStreamModal')).attr("value", '');

	// remove keyword input element
	$('.remove-keyword').remove();

	// Add value to hidden input element.
	$("#domain_user_id", $('#addStreamModal')).attr("value", CURRENT_DOMAIN_USER.id);
	$("#client_channel", $('#addStreamModal')).attr("value", CURRENT_DOMAIN_USER.id + "_Channel");

	// Add button for twitter is hidden.
	$('#add_twitter_stream').hide();

	// To hide stream type description.
	document.getElementById("stream_description_label").className = 'description-hidden txt-mute';

	// Empty hidden profile image on form.
	$('#twitter_profile_img_url').attr("src", "");
}


/**
 * Register all streams on social server.
 */
function registerAll(index)
{
	var streamsJSON = Streams_List_View.collection.toJSON();

	// Streams not available OR streams already registered OR pubnub not
	// initialized OR (index 0 stream is done and Register_Counter is increased.)
	if (streamsJSON == null || Register_All_Done == true || Pubnub == null || (Register_Counter != null && index == 0))
	{
		console.log("Register_All_Done : " + Register_All_Done);
		return;
	}

	// Get stream.
	var stream = Streams_List_View.collection.at(index);

	// Check stream is present or added in collection.
	if (stream == null || stream == undefined)
		return;

	// First stream from collection to register and assign value to RC.
	if (index == 0 && Register_Counter == null)
	{
		Register_Counter = 0;

		// Add user's profile img from twitter to stream header.
		if (Add_Img_Done == false)
			addUserImgToColumn();
	}

	// Publish data to register on server
	var publishJSON = { "message_type" : "register", "stream" : stream };
	sendMessage(publishJSON);

	// All added streams registered.
	if (Register_Counter == (Streams_List_View.collection.length - 1))
		Register_All_Done = true;
}

/**
 * On logout or browser/window clise, Unregister all streams on server.
 */
function unregisterAll()
{
	// Collection not defined.
	if (!Streams_List_View)
		return;

	// Streams not available OR pubnub not initialized.
	if (Streams_List_View == undefined || Pubnub == null)
		return;

	// Unregister on server
	var publishJSON = { "message_type" : "unregister_all", "client_channel" : CURRENT_DOMAIN_USER.id + "_Channel" };
	sendMessage(publishJSON);

	// Flush all data.
	Register_All_Done = false;
	Register_Counter = null;
	Add_Img_Done = false;
	Streams_List_View = undefined;
}

/**
 * Add relevant profile img from twitter to stream in column header.
 */
function addUserImgToColumn()
{
	var streamsJSON = Streams_List_View.collection.toJSON();

	// Get stream
	$.each(streamsJSON, function(i, stream)
	{
		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(stream.id);

		// Fetching profile image url from twitter server
		$.get("/core/social/getprofileimg/" + stream.id, function(url)
		{
			// Set url in stream model.
			modelStream.set("profile_img_url", url);

			// Append in collection
			socialsuitecall.streams(modelStream);
		});
	});
	Add_Img_Done = true;
}

/**
 * On click of retry button in stream notification,
 * Sends register message again to twitter server. 
 */
function registerStreamAgain(streamId)
{
	// Fetch stream from collection
	var stream = Streams_List_View.collection.get(streamId).toJSON();

	// Register on server
	var publishJSON = { "message_type" : "register", "stream" : stream };
	sendMessage(publishJSON);

	// Show waiting symbol.
	$("#stream-spinner-modal-" + streamId).show();
}

/**
 * Convert time in human readable format.
 */
function displayTimeAgo(elmnt)
{
	head.js('lib/jquery.timeago.js', function()
	{
		$(".time-ago", elmnt).timeago();
	});
}
/**
 * This file contains all event related messages in Twitter like Tweet, Direct
 * Message, RT, Edit RT, Reply Message, Tweet to user.
 */

$(function()
{
	/**
	 * get stream and create tweet for posting on Twitter.
	 */
	$(".compose-message").die().live("click", function(e)
	{
		// Close all dropdowns of all tweets.
		$('.more-options-list').toggle(false);

		$('#socialsuite_twitter_messageModal').remove();

		var streamId = $(this).attr("stream-id");

		// Display modal with JSON filled in that.
		displayFilledModal(streamId, null, null, "Tweet");
	});

	/**
	 * Get stream and create reply tweet and post it on Twitter to related
	 * tweet.
	 */
	$(".reply-message").die().live("click", function(e)
	{
		// Close all dropdowns of all tweets.
		$('.more-options-list').toggle(false);

		$('#socialsuite_twitter_messageModal').remove();

		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));

		// Display modal with JSON filled in that.
		displayFilledModal(streamId, tweetId, null, "Reply Tweet");
	});

	/**
	 * get stream and create tweet for posting on Twitter to user who RT owner's
	 * tweet.
	 */
	$(".tweet-to-user").die().live("click", function(e)
	{
		// Hide modal before showing message modal.
		$("#socialsuite_RT_userlistModal").modal("hide");

		$('#socialsuite_twitter_messageModal').remove();

		// Close all dropdowns of all tweets.
		$('.more-options-list').toggle(false);

		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetOwner = $(this).attr("tweet-owner");

		// Display modal with JSON filled in that.
		displayFilledModal(streamId, null, tweetOwner, "Reply Tweet");
	});

	/**
	 * Sends a direct message to the Twitter profile , who is tweet owner.
	 */
	$(".direct-message").die().live("click", function(e)
	{
		// Close all dropdowns of all tweets.
		$('.more-options-list').toggle(false);

		$('#socialsuite_twitter_messageModal').remove();

		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));

		// Display modal with JSON filled in that.
		displayFilledModal(streamId, tweetId, null, "Direct Message");
	});

	/**
	 * Get stream and perform retweet action on selected tweet.
	 */
	$(".retweet-status").die().live("click", function(e)
	{
		$('#socialsuite_twitter_messageModal').remove();

		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));

		// Display modal with JSON filled in that.
		displayFilledModal(streamId, tweetId, null, "Retweet");

		// On click of edit button in the modal, retweet edit.
		$('#edit_retweet').click(function(e)
		{
			e.preventDefault();
			// Check Send button is not enable
			if ($("#send_retweet").hasClass('disabled') && $("#edit_retweet").hasClass('disabled'))
				return;

			/*
			 * Need to remove this element because it has save class and it is
			 * not disabled but hidden so base-model accept action save on click
			 * of send, which is disabled.
			 */
			$('#send_retweet').remove();

			$('#edit_retweet').hide();
			$('#twit-retweet').hide();
			$('#send_tweet').show();
			$('#twit-tweet').show();
			$('#link-text').show();
			$('#tweet_scheduling').show();

			// Update edit RT URL in model.
			Message_Model.model.url = "/core/social/tweet/" + streamId;
		});
	});

	/**
	 * Get stream and perform undo-retweet action on selected tweet. If stream
	 * is "Sent" then remove tweet from stream and if stream is "Home" then
	 * remove RT icon only.
	 */
	$(".undo-retweet-status").die().live("click", function(e)
	{
		// Ask for confirmation from user.
		if (!confirm("Are you sure you want to undo retweet this status?"))
			return;

		// Get the id of the tweet on which undo-retweet is clicked
		var streamId = ($(this).closest('article').attr('stream-id'));
		var tweetId = ($(this).closest('article').attr('id'));
		var tweetIdStr = null;

		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(streamId);

		// Get tweet from stream.
		var modelTweet = modelStream.get('tweetListView').get(tweetId);
		var tweet = modelTweet.toJSON();

		// If stream type is "Sent" then "tweet-id-str" is tweet handle else
		// "retweet-id" to perform action.
		if (modelStream.toJSON().stream_type == "Sent")
			tweetIdStr = tweet.id_str;
		else if (modelStream.toJSON().stream_type == "Home")
			tweetIdStr = tweet.retweet_id;

		/*
		 * Sends get request to url "core/social/undoretweet/" and Calls
		 * StreamAPI with Stream id, tweet id and tweet idStr as path
		 * parameters.
		 */
		$.get("/core/social/undoretweet/" + streamId + "/" + tweetId + "/" + tweetIdStr,

		function(data)
		{
			// Undo-Retweet is Unsuccessful.
			if (data == "Unsuccessful")
			{
				showNotyPopUp('information', "Retry after sometime.", "top", 5000);
				return;
			}

			// On success, Change retweet icon to normal.
			// Delete tweet from stream
			if (tweet.stream_type == "Sent")
				modelTweet.set("deleted_msg", "deleted");
			else
				modelTweet.unset("retweeted_by_user");

			// Add back to stream.
			modelStream.get('tweetListView').add(modelTweet);

			// Remove tweet element from ui
			$('.deleted').remove();

			// Create normal time.
			displayTimeAgo($(".chirp-container"));

		}).error(function(data)
		{
			// Error message is shown when error occurs
			displayError(null, data);
		});
	});

	// On copy paste from mouse right click call key press to check cross limit.
	$('#twit-tweet').die().live("mouseleave", function(e)
	{
		$('#twit-tweet').keypress();
	});

	// On click of link in message modal, Add agile text to message text area in
	// message modal.
	$("#add_message").die().live("click", function(e)
	{
		var quote = " Sell & Market like Fortune 500 with @agilecrm";

		document.getElementById("twit-tweet").value += quote;

		$("#link-text").html("<b>Thank you.</b>");

		setTimeout(function()
		{
			$("#link-text").hide();
		}, 2000);
	});

	/*
	 * On modal close,Makes Scheduled_Edit flag false to show normal update
	 * flow, because scheduling div display is depend on that.
	 */
	$('#socialsuite_twitter_messageModal').die().live('hidden', function()
	{
		if (this.id != "#socialsuite_twitter_messageModal")
			return;

		$('.modal-backdrop').remove();
		Scheduled_Edit = false;
		$('#socialsuite_twitter_messageModal').remove();
	});
}); // init end
/*
 * Remove waiting symbol from stream's column header, 
 * when user return to social tab as well as after getting reply from social server.
 */
function removeWaiting()
{
	var streamsJSON = Streams_List_View.collection.toJSON();

	// Streams not available.
	if (streamsJSON == null)
		return;

	// Get stream
	$.each(streamsJSON, function(i, stream)
	{
		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(stream.id);

		if (modelStream != null || modelStream != undefined)
		{
			// If any collection have some tweets then remove waiting.
			if (modelStream.get('tweetListView').length >= 1)
			{
				// Hide waiting symbol.
				$("#stream-spinner-modal-" + stream.id).hide();
			}
		}
	});
}
/**
 * As per given action type it selects url to send get request and perfome
 * action on tweet. Tweet actions are Follow, un follow, Favorite, undo favorite
 * etc.
 * 
 * @param streamId
 * @param tweetId
 * @param tweetOwner
 * @param actionType
 */
function performTweetAction(streamId, tweetId, tweetOwner, actionType)
{
	// Get stream from collection.
	var modelStream = Streams_List_View.collection.get(streamId);

	if (tweetId)
	{
		// Get tweet from stream.
		var modelTweet = modelStream.get('tweetListView').get(tweetId);
		var tweet = modelTweet.toJSON();

		var tweetIdStr = tweet.id_str;
	}

	var urlForGet = null;

	switch (actionType) {
		case "favorite":
		{
			/*
			 * Sends get request to url "core/social/favorite/" and Calls
			 * StreamAPI with Stream id, tweet idStr as path parameters.
			 */
			urlForGet = "/core/social/favorite/" + streamId + "/" + tweetIdStr;
		}
			break;
		case "undofavorite":
		{
			/*
			 * Sends get request to url "core/social/undofavorite/" and Calls
			 * StreamAPI with Stream id, tweet idStr as path parameters.
			 */

			urlForGet = "/core/social/undofavorite/" + streamId + "/" + tweetIdStr;
		}
			break;
		case "followuser":
		{
			// Calls method to send request to follow user.
			urlForGet = "/core/social/followuser/" + streamId + "/" + tweetOwner;
		}
			break;
		case "unfollowuser":
		{
			// Calls method to send request to unfollow user.
			urlForGet = "/core/social/unfollowuser/" + streamId + "/" + tweetOwner;
		}
			break;
		case "blockuser":
		{
			// Calls method to send request to block user.
			urlForGet = "/core/social/blockuser/" + streamId + "/" + tweetOwner;
		}
			break;
		case "unblockuser":
		{
			// Calls method to send request to unblock user.
			urlForGet = "/core/social/unblockuser/" + streamId + "/" + tweetOwner;
		}
			break;
	}

	requestAction(urlForGet, actionType, modelStream, modelTweet, tweetOwner);
}

/**
 * Call REST api and perfome action as per reply from backend.
 */
function requestAction(urlForGet, actionType, modelStream, modelTweet, tweetOwner)
{
	$.get(urlForGet, function(data)
	{
		// Favorite is Unsuccessful.
		if (data == "Unsuccessful" || data == "false")
		{
			showNotyPopUp('information', "Retry after sometime.", "top", 5000);
			return;
		}

		// As per reply from get request reflect that in UI on tweet in stream.
		reflectActionOnTweet(data, actionType, modelStream, modelTweet, tweetOwner);

		// Create normal time.
		displayTimeAgo($(".chirp-container"));
		
	}).error(function(data)
	{
		// Error message is shown when error occurs
		displayError(null, data);
	});
}

/**
 * Accept data and reflect action in UI on tweet in stream. like On favorite :
 * change icon color to orange, Undo same action on undo favorite. On Block user ,
 * unfollow user and show noty... etc.
 * 
 * @param data
 * @param actionType
 * @param modelStream
 * @param modelTweet
 * @param tweetOwner
 */
function reflectActionOnTweet(data, actionType, modelStream, modelTweet, tweetOwner)
{
	if (modelTweet)
		var tweet = modelTweet.toJSON();

	console.log(tweet);

	switch (actionType) {
		case "favorite":
		{
			// On success, the color of the favorite is shown orange.
			// Update attribute in tweet.
			modelTweet.set("favorited_by_user", "true");

			// Add back to stream.
			modelStream.get('tweetListView').add(modelTweet);
		}
			break;

		case "undofavorite":
		{
			// On success, Change favorite icon to normal.
			// Delete tweet from stream
			modelTweet.unset("favorited_by_user");

			// Add back to stream.
			modelStream.get('tweetListView').add(modelTweet);
		}
			break;
		case "followuser":
		{
			if (data == "true")
				showNotyPopUp('information', "Now you are following @" + tweetOwner, "top", 5000);
		}
			break;
		case "unfollowuser":
		{
			if (data == "Unfollowed")
				showNotyPopUp('information', "Now you are not following @" + tweetOwner, "top", 5000);
		}
			break;
		case "blockuser":
		{
			if (data == "true")
				showNotyPopUp('information', "You just blocked @" + tweetOwner, "top", 5000);
		}
			break;
		case "unblockuser":
		{
			if (data == "Unblock")
				showNotyPopUp('information', "You just unblock @" + tweetOwner, "top", 5000);
		}
			break;

	}
}

// Displays Error notification.
function displayError(modalToDisplay, data)
{
	$("#spinner-modal").hide();

	if (modalToDisplay != null)
	{
		// If error occurs while posting modal is removed and error message is
		// shown
		$('#' + modalToDisplay).modal("hide");
	}
	
	var result = data.responseText;

	// Error message is shown if error occurs
	if (result.trim() == "Status is a duplicate.")
		showNotyPopUp('information', "Whoops! You already tweeted that...", "top", 5000);
	else if(result.trim() == "Sorry, that page does not exist")
		showNotyPopUp('information', "Sorry, that tweet does not exist.", "top", 5000);
	else
		showNotyPopUp('information', "Retry after sometime.", "top", 5000);

	console.log(data.responseText);
}
/*
 * Check valid scheduled. Selected schedule should be in future time. 
 * If it is past or current time then revert action and show alert.
 */
function isPastSchedule()
{
	// Get selected date and time.
	var scheduledDate = document.getElementById('scheduled_date').value;
	var scheduledTime = document.getElementById('scheduled_time').value;

	console.log(scheduledDate + " " + scheduledTime);

	// Current date and time.
	var today = new Date().format('mm/dd/yyyy');
	var now = new Date();

	var min = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();

	now = now.getHours() + ':' + min;

	console.log("current date is : " + today + " current time is : " + now);

	// Convert selected schedule in epoch time.

	// selected schedule.
	var schedulearray = (scheduledTime).split(":");
	var sdate = new Date(scheduledDate);
	var selectedSchedule = sdate.setHours(schedulearray[0], schedulearray[1]) / 1000.0;

	// current schedule.
	var currentSchedulearray = (now).split(":");
	var currentSdate = new Date(today);
	var currentSchedule = currentSdate.setHours(currentSchedulearray[0], currentSchedulearray[1]) / 1000.0;

	console.log("selectedSchedule : " + selectedSchedule + " currentSchedule : " + currentSchedule);

	if (selectedSchedule > currentSchedule) // Future Time
	{
		// Appending schedule.
		var schedulearray = (scheduledTime).split(":");
		var sdate = new Date(scheduledDate);
		sdate = sdate.setHours(schedulearray[0], schedulearray[1]) / 1000.0;
		document.getElementById('schedule').value = sdate;

		var myDate = new Date(sdate * 1000);
		console.log(myDate.toGMTString() + "   " + myDate.toLocaleString());

		// Changes in UI.
		$('#send_tweet').removeAttr("disabled");
		Schedule_In_Future = true;

		// To check text limit after button text change.
		$('#twit-tweet').keypress();
	}
	else
	// Past Time
	{
		alert("Please select Date/Time in future.");
		$("#send_tweet").attr("disabled", "disable");
		Schedule_In_Future = false;
	}
}

/**
 * Gets Scheduled Updates count fron DB and show or hide button which links to
 * scheduled updates page.
 */
function checkScheduledUpdates()
{	
	// Get scheduled updates count
	$.getJSON("/core/scheduledupdate/getscheduledupdatescount", function(data)
	{
		console.log("data after fetching scheduled updates from db");
		console.log(data);

		if (data > 0)
			$("#show_scheduled_updates").show();
		
	}).error(function(jqXHR, textStatus, errorThrown)
	{
		$("#show_scheduled_updates").hide();
		console.log("Error occured in scheduled updates search.");
	});
}

/**
 * On click of scheduled update it will open message modal. And on click of
 * schedule it will save modified scheduled update.
 */
function scheduledmessagesEdit(id)
{
	$('#socialsuite_twitter_messageModal').remove();

	console.log("scheduledmessages Edit: " + id);

	// Gets the update from its collection
	var selectedUpdate = Scheduled_Updates_View.collection.get(id);
	console.log(selectedUpdate);

	Scheduled_Edit = true;

	Message_Model = new Base_Model_View({ url : '/core/scheduledupdate', model : selectedUpdate, template : "socialsuite-twitter-message",
		modal : '#socialsuite_twitter_messageModal', window : 'scheduledmessages', postRenderCallback : function(el)
		{
			// Remove back drop, It remains there so need to remove.
			$('.modal-backdrop').remove();

			// Only once it will execute for same scheduled update on one click.
			if (!selectedUpdate.hasChanged())
			{
				// After displaying modal with details, need to show schedule from selected message.
				$("#socialsuite_twitter_messageModal", el).on('shown', function()
				{
					/*
					 * Shows scheduling clock icon on message modal with
					 * selected scheduled with disabled click event, so user
					 * only can schedule message.
					 */
					$("#tweet_scheduling", el).click();

					// Display date from selected message in message modal.
					$('input.date', $('#schedule_controls')).val((new Date(selectedUpdate.toJSON().scheduled_date * 1000)).toLocaleDateString());

					// For Testing: Enables schedule button if selected
					// scheduled update having future schedule.
					//isPastSchedule();
					// Changes in UI.
					$('#send_tweet').removeAttr("disabled");
				});

				// Show modal with details.
				$('#socialsuite_twitter_messageModal', el).modal('show');
			}
		}, saveCallback : function(data)
		{			
			// Hide message modal.
			$('#socialsuite_twitter_messageModal').modal('hide');
			$('#socialsuite_twitter_messageModal').remove();
			$('.modal-backdrop').remove();
			Scheduled_Edit = false;

			// Default check box is not added so need to add from handlebar so that will check this condition.
			data["checkbox"] = true;

			// Update changes in UI.
			selectedUpdate.set(data);
			
			// Creates normal time.
			displayTimeAgo($(".is-actionable"));
		} });

	// Add modal in "#schedule-edit-modal" Div on same page, to display modal with details.
	$('#schedule-edit-modal').html(Message_Model.render().el);

} // scheduledmessagesEdit end

/**
 * Checks scroll reached to end or not. Suppose it reached to end then call past
 * tweets and add to stream as well as maintain scrolls current position.
 * 
 * @param elementDiv -
 *            element where scrollDown performed
 */
function OnScrollDiv(elementDiv)
{
	// Check scroll bar is reached to end and function is not called before.
	if (($(elementDiv).scrollTop() + $(elementDiv).innerHeight() >= $(elementDiv)[0].scrollHeight) && ($(elementDiv).attr("data") == "0"))
	{

		// Function is alredy called for this stream.
		$(elementDiv).attr("data", "1");

		console.log("In OnScrollDiv.");

		// Get stream id.
		var streamId = ($(elementDiv).closest('li').attr('id'));

		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(streamId);

		// Stream not found.
		if (modelStream == undefined || modelStream == null)
			return;

		// model to json.
		var stream = modelStream.toJSON();
		console.log(stream);

		// Get tweet from stream.
		var modelTweet = modelStream.get('tweetListView').at(modelStream.get('tweetListView').length - 2);
		var tweet = modelTweet.toJSON();
		console.log(tweet);

		// Store reference to top message
		var currMsg = $("#" + tweet.id);

		// Store current scroll/offset
		var curOffset = currMsg.offset().top - $(elementDiv).scrollTop();

		// Append loading icon.
		$(elementDiv)
				.append(
						'<span id="stream-waiting-modal-' + streamId + '" class="span6" style="margin-top: 3px;"><img class="pull-right" style="width:20px;height:20px;" src="img/ajax-spinner.gif"></span>');

		/*
		 * Calls TwitterAPI class to request for 20 more updates tweeted before
		 * the tweet id of the last update
		 */
		$
				.getJSON(
						"/core/social/pasttweets/" + stream.id + "/" + tweet.id + "/" + tweet.id_str,
						function(data)
						{
							console.log("data");
							console.log(data);

							// If no more updates available, show message.
							if (data == null)
							{
								showNotyPopUp('information', "No more updates available for stream " + stream.stream_type + " of " + stream.screen_name, "top",
										5000);

								// Remove loading icon.
								$('#stream-waiting-modal-' + streamId).remove();

								// Do not call this function again once its
								// called on one scroll.
								$(elementDiv).attr("data", "1");

								// Twitter icon and up arrow appended in stream
								// to show no more tweets available.
								$(elementDiv)
										.append(
												'<span id="past-tweet-end-' + streamId + '" class="span6" style="margin-top: 3px;color: #888;"><i class="pull-right icon icon-long-arrow-up"></i><i class="pull-right icon icon-twitter"></i></span>');
								return;
							}
							if (data.length == 0)
							{
								showNotyPopUp('information', "No more updates available for stream " + stream.stream_type + " of " + stream.screen_name, "top",
										5000);
								$('#stream-waiting-modal-' + streamId).remove();
								$(elementDiv).attr("data", "1");
								$(elementDiv)
										.append(
												'<span id="past-tweet-end-' + streamId + '" class="span6" style="margin-top: 3px;color: #888;"><i class="pull-right icon icon-long-arrow-up"></i><i class="pull-right icon icon-twitter"></i></span>');
								return;
							}

							/*
							 * Populate the collection with update stream
							 * details and show
							 */
							var i;
							var myObject;

							// Global flag set.
							Scroll_Down_Call = true;

							for (i = 0; i < data.length; i++)
							{
								// String to json.
								myObject = eval('(' + data[i] + ')');
								console.log(myObject);

								// Add tweet to stram.
								handleMessage(myObject);

								// All tweets done.
								if (i + 1 == data.length)
									Scroll_Down_Call = false;
							}

							// Add remaining tweets.
							if (Scroll_Down_Call == false && Past_Tweets_Count != 0 && Past_Tweets.length != 0)
								addPastTweetsToStream(modelStream);

							// Set scroll to current position minus previous
							// offset/scroll
							var scrollOnDiv = $('#' + streamId).find('#Column-model-list');
							scrollOnDiv.scrollTop((currMsg.offset().top - curOffset) + 650);

							// Remove loading icon.
							$('#stream-waiting-modal-' + streamId).remove();

							// One function call for current stream is over.
							$(elementDiv).attr("data", "0");

						}).error(function(data)
				{
					// Loading icon remove.
					$('#stream-waiting-modal-' + streamId).remove();

					// One function call for current stream is over.
					$(elementDiv).attr("data", "0");

					var result = data.responseText;

					// Error message is shown to the user
					if (data.responseText == "")
						showNotyPopUp('information', "No more updates available for stream " + stream.stream_type + " of " + stream.screen_name, "top", 7000);
					else if (result.indexOf("rate") != -1)
						showNotyPopUp('information', "Request rate limit exceeded, Retry after some time.", "top", 5000);
					else if (result.indexOf("Could not fetch URL") != -1)
						showNotyPopUp('information', "Please, check your internet connection.", "top", 5000);
					else
						showNotyPopUp('information', data.responseText, "top", 5000);
					console.log(data);
				});
	}

	// Remove deleted tweet element from ui
	$('.deleted').remove();
}

// Checks counter and adds tweet in json array.
function checkPastTweetAdd(tweet, modelStream)
{
	// If collected tweets less than 5.
	if (Past_Tweets_Count < 5)
	{
		// Add tweet in json array.
		Past_Tweets[Past_Tweets_Count] = tweet;

		// Increment counter.
		Past_Tweets_Count++;
	}
	else if (Past_Tweets_Count == 5)
	{
		// If collected tweets are 5 then add them in to stream.
		addPastTweetsToStream(modelStream);
	}
}

/**
 * Fetches relavant stream model from collection and update that collection with
 * past tweets fetched on scroll down.
 */
function addPastTweetsToStream(modelStream)
{
	// If no tweets to add in collection.
	if (Past_Tweets.length == 0)
		return;

	console.log("In addPastTweetsToStream.");

	// Update collection.
	addTweetToStream(Past_Tweets, modelStream);

	// Reset json array and counter.
	Past_Tweets_Count = 0;
	Past_Tweets = [];
}
/**
 * Loads highcharts.js and highcharts-exporting.js plugins used to show graphs,
 * after loading graphs callback function sent is called i.e., actions to be
 * performed after loading plugin scripts
 * 
 * @param callback
 *            Function to be called after loading highcharts.js and
 *            exporting.js, it gives functionalities to
 */
function setupCharts(callback)
{

	head.js(LIB_PATH + 'lib/flot/highcharts-3.js', LIB_PATH + 'lib/flot/highcharts-exporting.js', LIB_PATH + 'lib/flot/funnel.js', function()
	{

		// Checks if callback is available, if available calls the callback
		if (callback && typeof (callback) === "function")
		{

			// Execute the callback
			callback();
		}
	});
}

/**
 * Sets pie chart with the data obtained by accessing url in the selector
 * element with given name as title of the chart.
 * 
 * @param url -
 *            to fetch json data inorder to render graph. 
 * @param selector -
 *            id or class of an element where charts render.
 * @param name - 
 *            title of the chart.
 */
function pie(url, selector, name)
{

	// Show loading
	// $('#' + selector).html(LOADING_HTML);

	var chart;
	setupCharts(function()
	{
		// Fetches data from to get tags informations
		// i.e., {"tags1" :" number of contacts with 'tags1', "tags2" : "number
		// of contacts with tags2"}
		fetchReportData(
						url,
						function(data)
						{

							// Convert into labels and data as required by
							// Highcharts
							var pieData = [];
							var total = 0;
							var count = 0;

							// Iterates through data and calculate total number
							$.each(data, function(k, v)
							{
								total += v;
								count ++;
							});

							console.log(data);
							// Iterates through data, gets each tag, count and
							// calculate
							// percentage of each tag
							$.each(data, function(k, v)
							{
								var item = [];

								
								// Push tag name in to array
								item.push(k);

								// Push percentage of current tag in to array
								item.push(v / total * 100);
								pieData.push(item);
							})
							
							var animation = count > 20 ? false : true;
							
							// Initializes Highcharts,
							chart = new Highcharts.Chart(
									{
										chart : { renderTo : selector, type : 'pie', plotBackgroundColor : null, plotBorderWidth : null, plotShadow : false,
											marginTop : 50 },
										title : { text : name },
										tooltip : {
											backgroundColor : null,
											borderWidth : 0,
											borderRadius : 0,
											headerFormat : '',
											useHTML : true,
											enabled : true,
											shadow : false,
											formatter : function()
											{
												var s = '<div class="highcharts-tool-tip"><div class="tooltip-title">' + this.point.name + '</div><div style="text-align:center;margin-top:7px;margin-left:-3px"><b>' + (this.point.percentage)
														.toFixed(2) + '%<b></div></div>';
												return s;
											}, message : "Hover over chart slices<br>for more information.", positioner : function()
											{
												return { x : 15, y : 23 };
											}, },
										legend : { itemWidth : 75, },
										plotOptions : {
											pie : {
												 animation: animation,
												allowPointSelect : true,
												cursor : 'pointer',
												borderWidth : 0,
												dataLabels : { enabled : true, color : '#000000', connectorColor : '#000000', connectorWidth : 0,
													formatter : function()
													{
														return "";
														if (this.percentage <= 2)
															return "";
														return (this.percentage).toFixed(2) + ' %';
													}, distance : 2 }, showInLegend : false, innerSize : '30%', size : '75%', shadow : true, borderWidth : 0 },
											series : { events : { mouseOver : function()
											{
												$('.tooltip-default-message').hide();
											}, mouseOut : function(e)
											{
												$('.tooltip-default-message').show();
											} } } },

										series : [
											{ type : 'pie', name : 'Tag', data : pieData, startAngle : 90 }
										], exporting : { enabled : false } }, function(chart)
									{ // on complete

										chart.renderer.image('img/donut-tooltip-frame.png', 14, 5, 200, 80).add();
										chart.renderer.text(this.options.tooltip.message, 50, 40).attr("class", 'tooltip-default-message').add();

									});
						});
	});
}

/**
 * Function to build either stacked graph or bar graph using highcharts. Inorder
 * to show bar graph, initialize stacked parameter as null.
 * <p>
 * Data of categories in the bar graph should be as follows: categories: ['Aug
 * 1', 'Aug 2', 'Aug 3', 'Aug 4', 'Aug 5']
 * </p>
 * 
 * <p>
 * Data of series in the bar graph should be as follows: series: [{ name: 'Email
 * Sent', data: [5, 3, 4, 7, 2] }, { name: 'Email Opened', data: [2, 2, 3, 2, 1] }, {
 * name: 'Email Clicked', data: [3, 4, 4, 2, 5] }, { name: 'Total Clicks', data:
 * [3, 4, 4, 2, 5] }]
 * </p>
 * 
 * @param url -
 *            to fetch json data inorder to render graph.
 * @param selector -
 *            id or class of an element where charts should render.
 * @param name -
 *            title of the chart.
 * @param yaxis_name -
 *            name for y-axis.
 * @param stacked -
 *            is stacked graph or bar graph? If bar graph, stacked is null.
 */
function showBar(url, selector, name, yaxis_name, stacked)
{
	var chart;

	// Shows loading image
	$('#' + selector).html(LOADING_HTML);

	// Builds graph with the obtained json data.
	setupCharts(function()
	{

		// Loads statistics details from backend
		fetchReportData(url, function(data)
		{

			// Names on X-axis
			var categories = [];

			// Data to map with X-axis and Y-axis.
			var series;

			// Iterates through data and add all keys as categories
			$.each(data, function(k, v)
			{
				categories.push(k);

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
					});
				}

				// Fill Data Values with series data
				$.each(v, function(k1, v1)
				{

					// Find series with the name k1 and to that,
					// push v1
					var series_data = find_series_with_name(series, k1);
					series_data.data.push(v1);
				});

			});

			// Draw the graph
			chart = new Highcharts.Chart({
			    chart: {
			        renderTo: selector,
			        type: 'column'
			    },
			    colors: [
			        '#4365AD',
			        '#D52A3E',
			        'gray',
			        '#1E995C'
			    ],
			    title: {
			        text: name
			    },
			    xAxis: {
			        categories: categories,
			        tickPositioner:function()
		            {
		                // to overcome x-axis labels overlapping
			        	if(this.options.categories.length > 30)
		                {
		                    this.options.minTickInterval = 5;
		                }
		            },
			        labels:
			        {
			        	overflow:'justify'
			        }
			    },
			    yAxis: {
			        min: 0,
			        title: {
			            text: yaxis_name
			        },
			        stackLabels: {
			            enabled: true,
			            style: {
			                fontWeight: 'bold',
			                color: (Highcharts.theme&&Highcharts.theme.textColor)||'gray'
			            }
			        }
			    },
			    legend: {
			        align: 'right',
			        x: -100,
			        verticalAlign: 'top',
			        y: 20,
			        floating: true,
			        backgroundColor: (Highcharts.theme&&Highcharts.theme.legendBackgroundColorSolid)||'white',
			        borderColor: '#CCC',
			        borderWidth: 1,
			        shadow: false
			    },
			    tooltip: {
			        formatter: function(){
			            return'<b>'+this.x+'</b><br/>'+this.series.name+': '+this.y;
			        }
			    },
			    plotOptions: {
			        column: {
			            stacking: stacked,
			            dataLabels: {
			                enabled: true,
			                color: (Highcharts.theme&&Highcharts.theme.dataLabelsColor)||'white'
			            }
			        }
			    },
			    series: series
			});
			});
	});
}

/**
 * Small utility function to search series with a given name. Returns series
 * with index if given name matches. It provides way to enter values within
 * the data array of given name.
 * 
 * @param series -
 *              chart series data.
 * @param name - 
 *              series name.
 */
function find_series_with_name(series, name)
{
	for ( var i = 0; i < series.length; i++)
	{
		if (series[i].name == name)
			return series[i];
	}
}

/**
 * Function to build deal's line chart to compare total value and pipeline value.
 * <p>
 * Data obtained to render deal's line chart will be:
 * [{closed-date:{total:value, pipeline: value},...]
 * </p>
 * 
 * @param url - 
 *            to fetch json data inorder to render graph.
 * @param selector - 
 *            id or class of an element where charts should render.
 * @param name - 
 *            title of the chart.
 * @param yaxis_name - 
 *            name for y-axis
 * @param show_loading
 * 				shows loading image
 */
function showLine(url, selector, name, yaxis_name, show_loading)
{
	
	// Show loading image if required
	if(typeof show_loading === 'undefined')
	{
		// Old calls were not showing loading image..
	}
	else
		$('#' + selector).html(LOADING_HTML);
	
	
	var chart;

	// Loads Highcharts plugin using setupCharts and sets up line chart in the
	// callback
	setupCharts(function()
	{

		// Loads statistics details from backend i.e.,[{closed
		// date:{total:value, pipeline: value},...]
		fetchReportData(url, function(data)
		{

			// Categories are closed dates
			var categories = [];
			
			// Data with total and pipeline values
			var series;

			// Iterates through data and adds keys into
			// categories
			$.each(data, function(k, v)
			{

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
					});
				}

				// Fill Data Values with series data
				$.each(v, function(k1, v1)
				{

					// Find series with the name k1 and to that,
					// push v1
					var series_data = find_series_with_name(series, k1);
					series_data.data.push([
							k * 1000, v1
					]);
				});

			});

			// After loading and processing all data, highcharts are initialized
			// setting preferences and data to show
			chart = new Highcharts.Chart({
			    chart: {
			        renderTo: selector,
			        type: 'line',
			        marginRight: 130,
			        marginBottom: 25
			    },
			    title: {
			        text: name,
			        x: -20//center
			    },
			    xAxis: {
			        type: 'datetime',
			        dateTimeLabelFormats: {
			            //don't display the dummy year  month: '%e.%b',
			            year: '%b'
			        },
			        minTickInterval: 24 * 3600 * 1000
			    },
			    yAxis: {
			        title: {
			            text: yaxis_name
			        },
			        plotLines: [
			            {
			                value: 0,
			                width: 1,
			                color: '#808080'
			            }
			        ],
			        min: 0
			    },
			    //Tooltip to show details,
			    ongraphtooltip: {
			        formatter: function(){
			            return'<b>'+this.series.name+'</b><br/>'+Highcharts.dateFormat('%e.%b',
			            this.x)+': '+this.y.toFixed(2);
			        }
			    },
			    legend: {
			        layout: 'vertical',
			        align: 'right',
			        verticalAlign: 'top',
			        x: -10,
			        y: 100,
			        borderWidth: 0
			    },
			    //Sets the series of data to be shown in the graph,shows total 
			    //and pipeline
			    series: series,
			    exporting: {
			        enabled: false
			    }
			});
		});
	});
}

/**
 * Function to show funnel bsed on the data
 * <p>
 * Shows funnel
 * </p>
 * 
 * @param url - 
 *            to fetch json data inorder to render graph.
 * @param selector - 
 *            id or class of an element where charts should render.
 * @param name - 
 *            title of the chart.
 * @param show_loading
 * 				shows loading image
 */
function showFunnel(url, selector, name, show_loading)
{
	// Show loading image if required
	if(typeof show_loading === 'undefined')
	{
		// Old calls were not showing loading image..
	}
	else
		$('#' + selector).html(LOADING_HTML);

	var chart;

	// Loads Highcharts plugin using setupCharts and sets up line chart in the
	// callback
	setupCharts(function()
	{

		// Loads statistics details from backend i.e.,[{closed
		// date:{total:value, pipeline: value},...]
		fetchReportData(url, function(data)
		{
			
			var funnel_data = [];
			
			$.each(data, function(i,v){
				
				// iterate through each data
				$.each(v, function(k1,v1){
					var each_data = [];
					each_data.push(k1, v1);
					funnel_data.push(each_data);
				});
				
			});
			
			console.log(funnel_data);
			
			chart = new Highcharts.Chart({
		        chart: {
		            type: 'funnel',
		            marginRight: 100,
		            renderTo: selector
		        },
		        title: {
		            text: name,
		            x: -50
		        },
		        plotOptions: {
		            series: {
		                dataLabels: {
		                    enabled: true,
		                    format: '<b>{point.name}</b> ({point.y:,.0f})',
		                    color: 'black',
		                    softConnector: true
		                },
		                neckWidth: '30%',
		                neckHeight: '25%'
		                
		                //-- Other available options
		                // height: pixels or percent
		                // width: pixels or percent
		            }
		        },
		        legend: {
		            enabled: false
		        },
		        series: [{
		            name: 'Contacts',
		            data: funnel_data
		        }]
		    });
			
		});
	});
}


/**
 * Function to build Cohorts
 * <p>
 * The data is not manipulated and the server sends it the required format. We do not use showBar code to decode as some of the data in the cohorts are not sent back 
 * </p>
 * 
 * @param url - 
 *            to fetch json data inorder to render graph.
 * @param selector - 
 *            id or class of an element where charts should render.
 * @param name - 
 *            title of the chart.
 * @param yaxis_name - 
 *            name for y-axis
 * @param show_loading
 * 				shows loading image
 */
function showCohorts(url, selector, name, yaxis_name, show_loading)
{
	
	// Show loading image if required
	if(typeof show_loading === 'undefined')
	{
		// Old calls were not showing loading image..
	}
	else
		$('#' + selector).html(LOADING_HTML);
	
	
	var chart;

	// Loads Highcharts plugin using setupCharts and sets up line chart in the
	// callback
	setupCharts(function()
	{

		// Loads statistics details from backend i.e.,[{closed
		// date:{total:value, pipeline: value},...]
		fetchReportData(url, function(data)
		{

			// Categories are closed dates
			var categories = data.categories;
			
			// Data with total and pipeline values
			var series = data.series;

			// After loading and processing all data, highcharts are initialized
			// setting preferences and data to show
			chart = new Highcharts.Chart({
			    chart: {
			        renderTo: selector,
			        type: 'line',
			        marginRight: 130,
			        marginBottom: 25,
			        zoomType: 'x'
			    },
			    title: {
			        text: name,
			        x: -20//center
			    },
			    xAxis: {
			       categories: categories
			    },
			    yAxis: {
			        title: {
			            text: yaxis_name
			        },
			        plotLines: [
			            {
			                value: 0,
			                width: 1,
			                color: '#808080'
			            }
			        ],
			        min: 0
			    },
			    //Tooltip to show details,
			    ongraphtooltip: {
			        formatter: function(){
			            return'<b>'+this.series.name+'</b><br/>'+Highcharts.dateFormat('%e.%b',
			            this.x)+': '+this.y.toFixed(2);
			        }
			    },
			    legend: {
			        layout: 'vertical',
			        align: 'right',
			        verticalAlign: 'top',
			        x: -10,
			        y: 100,
			        borderWidth: 0
			    },
			    //Sets the series of data to be shown in the graph,shows total 
			    //and pipeline
			    series: series,
			    exporting: {
			        enabled: false
			    }
			});
		});
	});
}


/**
 * Shows Pie chart for tags of contacts,
 */
function pieTags(el, force_reload)
{
	var url = '/core/api/tags/stats';
	if(force_reload)
		url = url + '?reload=true';
	
	$("#pie-tags-chart", el).html(LOADING_HTML);
	
	pie(url, 'pie-tags-chart', '');
}

/**
 * Shows pie chart of milestones using high charts, called from deals controller
 * when deals collection is loaded.
 */
function pieMilestones()
{
	pie('/core/api/opportunity/stats/milestones?min=0&max=1543842319', 'pie-deals-chart', '');
}

/**
 * Shows pie chart of tasks split by Type
 * @param params - params e.g. owner=<owner-id>, directly sent with url as GET request
 */
function pieTasks(params)
{
	pie('core/api/tasks/stats'+params,'pie-tasks-chart','');
}

/**
 * Shows line chart for deal statistics. Compares deal totals and pipeline with respect to 
 * time
 */
function dealsLineChart()
{
	showLine('core/api/opportunity/stats/details?min=0&max=1543842319', 'total-pipeline-chart', 'Monthly Deals', 'Total Value');
}

/**
 * Generic function to fetch data for graphs and act accordingly on plan limit error
 * @param url
 * @param successCallback
 */
function fetchReportData(url, successCallback)
{
	// Hides error message
	$("#plan-limit-error").hide();
	
	// Fetches data
	$.getJSON(url, function(data)
			{	
				// Sends data to callback
				if(successCallback && typeof (successCallback) === "function")
					successCallback(data);
			}).error(function(response){
				
				// If error is not billing exception then it is returned
				if(response.status != 406)
					return;
				
				// If it is billing exception, then empty set is sent so page will not be showing loading on error message
				if(successCallback && typeof (successCallback) === "function")
					successCallback([]);
				
				// Show cause of error in saving
				$save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>'
						+ response.responseText
						+ '</i></p></small></div>');
				
				$("#plan-limit-error").html($save_info).show();
			}); 
}/**
 * Cookie.js deals with functions used to create, read and erase a cookie.
 * @module jscore
 */

/**
 * Creates a cookie variable with the given name, value and expire time in days
 * 
 * @param name
 *            name of the variable example : agile-email etc.
 * @param value
 *            value of the variable example: agilecrm@example.com
 * @param days
 *            time in days before the variable expires example : 15*365
 * @returns cookie
 */
function createCookie(name, value, days)
{
	// If days is not equal to null, undefined or ""
	if (days)
	{
		var date = new Date();

		// Set cookie variable's updated expire time in milliseconds
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else
		// If days is null, undefined or "" set expires as ""
		var expires = "";
	document.cookie = name + "=" + escape(value) + expires + "; path=/";
}

function createCookieInAllAgileSubdomains(name, value, days)
{
	// If days is not equal to null, undefined or ""
	if (days)
	{
		var date = new Date();

		// Set cookie variable's updated expire time in milliseconds
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else
		// If days is null, undefined or "" set expires as ""
		var expires = "";
	document.cookie = name + "=" + escape(value) + expires + "; path=/; domain=agilecrm.com";
}

/**
 * Used to read a particular variable's value from document.cookie
 * 
 * @param name
 *            the name of the cookie variable to read example :
 *            agile-crm-session_start_time
 * @returns value of the cookie variable else it returns null
 */
function readCookie(name)
{
	var nameEQ = name + "=";

	// Split document.cookie into array at each ";" and iterate through it
	var ca = document.cookie.split(';');
	for ( var i = 0; i < ca.length; i++)
	{
		var c = ca[i];

		// Check for ' ' and remove to get string from c
		while (c.charAt(0) == ' ')
			c = c.substring(1, c.length);

		// check if nameEQ starts with c, if yes unescape and return its value
		if (c.indexOf(nameEQ) == 0)
			return unescape(c.substring(nameEQ.length, c.length));
	}
	return null;
}

/**
 * Used to delete a variable from document.cookie
 * 
 * @param name
 *            name of the variable to be removed from the cookie
 * @returns cookie without the variable
 */
function eraseCookie(name)
{
	createCookie(name, "", -1);
}
$(function(){ 
	
	/**
	 * For adding new document
	 */
	$(".documents-add").die().live('click', function(e){
		e.preventDefault();
		var el = $("#uploadDocumentForm");
		$("#uploadDocumentModal").modal('show');

		// Contacts type-ahead
		agile_type_ahead("document_relates_to_contacts", el, contacts_typeahead);
	});
	
	/**
	 * To avoid showing previous errors of the modal.
	 */
	$('#uploadDocumentModal, #uploadDocumentUpdateModal').on('show', function() {

		// Removes alert message of error related date and time.
		$('#' + this.id).find('.alert').css('display', 'none');
		
		// Removes error class of input fields
		$('#' + this.id).find('.error').removeClass('error');
	});
	
    /**
     * "Hide" event of document modal to remove contacts appended to related to field
     * and validation errors
     */ 
    $('#uploadDocumentModal').on('hidden', function () {
    	// Removes appended contacts from related-to field
    	$(this).find('form').find("li").remove();
    	$(this).find('form').find('#error').html("");
		
		// Removes validation error messages
		remove_validation_errors('uploadDocumentModal');

    });
    
    /**
     * "Hide" event of document modal to remove contacts appended to related to field
     * and validation errors
     */ 
    $('#uploadDocumentUpdateModal').on('hidden', function () {
    	// Removes appended contacts from related-to field
    	$(this).find('form').find("li").remove();
    	$(this).find('form').find('#network_type').closest(".controls").find(".icon-ok").css("display", "none");
    	$(this).find('form').find('#network_type').closest(".controls").find("div.link").css("background-color", "#FFFFFF");
    	$(this).find('form').find('#error').html("");
		
		// Removes validation error messages
		remove_validation_errors('uploadDocumentUpdateModal');

    });

    /** 
     * When clicked on choose network type
     */
	$(".link").live('click', function(e)
	{
		e.preventDefault();
		$(this).closest('form').find('#error').html("");
		var form_id = $(this).closest('form').attr("id");
		var id = $(this).find("a").attr("id");
		
		if(id && id == "GOOGLE")
			var newwindow = window.open("upload-google-document.jsp?id="+ form_id, 'name','height=510,width=800');
		else if(id && id == "S3")
			var newwindow = window.open("upload-custom-document.jsp?id="+ form_id +"&t=" + CURRENT_USER_PREFS.template +"&d=" + CURRENT_DOMAIN_USER.domain, 'name','height=310,width=500');
		
		if (window.focus)
		{
			newwindow.focus();
		}
		return false;
	});
	
	/**
	 * To validate the document add or edit forms
	 */
    $('#document_validate, #document_update_validate').on('click',function(e){
 		e.preventDefault();

 		var modal_id = $(this).closest('.upload-document-modal').attr("id");
    	var form_id = $(this).closest('.upload-document-modal').find('form').attr("id");
    	
    	// serialize form.
    	var json = serializeForm(form_id);
    
    	if(form_id == "uploadDocumentForm")
    		saveDocument(form_id, modal_id, this, false, json);
    	else
    		saveDocument(form_id, modal_id, this, true, json);
	});
    
    /** 
     * Document list view edit
     */
     $('#documents-model-list > tr > td:not(":first-child")').live('click', function(e) {
 		e.preventDefault();
 		updateDocument($(this).closest('tr').data());
 	});

});	

/**
 * Show document popup for updating
 */ 
function updateDocument(ele) {
	
	var value = ele.toJSON();
	
	add_recent_view(new BaseModel(value));

	var documentUpdateForm = $("#uploadDocumentUpdateForm");

	deserializeForm(value, $("#uploadDocumentUpdateForm"));
	$('#uploadDocumentUpdateForm').find("#" + value.network_type).closest(".link").find(".icon-ok").css("display", "inline");
	$('#uploadDocumentUpdateForm').find("#" + value.network_type).closest(".link").css("background-color", "#EDEDED");
	//$('#uploadDocumentUpdateForm').find('#url').html('<a href="'+ value.url +'" target="_blank">'+ value.url +'</a>');
	$('#uploadDocumentUpdateModal').modal('show');
	
	// Call setupTypeAhead to get contacts
	agile_type_ahead("document_relates_to_contacts", documentUpdateForm, contacts_typeahead);
}

/**
 * Return url of document from JSP and appends to form
 * @param url
 * @param network
 */
function saveDocumentURL(url, network, id)
{
	id = id.split("?id=")[1];
	var form_id = id.split("&")[0];
	
	// Saving extension of document
	var extension = url.split("?");
	if(url.match("agilecrm/panel/uploaded-logo/"))
	{
		extension = extension[0];
		extension = extension.substring(extension.lastIndexOf("/")+1);
	}
	else 
		extension = "Google";
	
	$('#' + form_id).find("#extension").val(extension);
	$('#' + form_id).find("#network_type").val(network);
	$('#' + form_id).find('#network_type').closest(".controls").find("div.link").css("background-color", "#FFFFFF");
	$('#' + form_id).find('#network_type').closest(".controls").find(".icon-ok").css("display", "none");
	$('#' + form_id).find("#" + network).closest(".link").find(".icon-ok").css("display", "inline");
	$('#' + form_id).find('#' + network).closest(".link").css("background-color", "#EDEDED");
   	$('#' + form_id).find('#upload_url').val(url);
    //$('#' + form_id).find('#url').html('<a href="'+ url +'" target="_blank">'+ url +'</a>');
}

/**
 * Saves document instance
 * @param form_id
 * @param modal_id
 * @param saveBtn
 * @param update
 * @returns {Boolean}
 */
function saveDocument(form_id, modal_id, saveBtn, isUpdate, json)
{
	// Returns, if the save button has disabled attribute
	if ($(saveBtn).attr('disabled'))
		return;

	// Disables save button to prevent multiple click event issues
	disable_save_button($(saveBtn));
	
	// While attaching document is from existing documenst list, no need of form verification.
	if(form_id)
	{
		if (!isValidForm('#' + form_id)) {

			// Removes disabled attribute of save button
			enable_save_button($(saveBtn));//$(saveBtn).removeAttr('disabled');
			
			return false;
		}
		
		var url = $('#' + form_id).find('#upload_url').val();
		if(url == "")
		{
			$('#' + form_id).find('#network_type').closest(".controls").find(".icon-ok").css("display", "none");
			$('#' + form_id).find('#network_type').closest(".controls").find("div.link").css("background-color", "#FFFFFF");
			$('#' + form_id).find('#error').html('<div class="alert alert-error">Sorry! Document not attached properly.</div>');
			enable_save_button($(saveBtn));
			return;
		}
	}
	
	var newDocument = new Backbone.Model();
	newDocument.url = 'core/api/documents';
	newDocument.save(json, {
		success : function(data) {

			// Removes disabled attribute of save button
			enable_save_button($(saveBtn));//$(saveBtn).removeAttr('disabled');
			
			// While attaching document is from existing documenst list, no need of form verification.
			if(form_id)
			{
				$('#' + form_id).find("#network_type").val("");
				$('#' + form_id).find('#network_type').closest(".controls").find(".icon-ok").css("display", "none");
				$('#' + form_id).find('#network_type').closest(".controls").find("div.link").css("background-color", "#FFFFFF");
				$('#' + form_id).find("#upload_url").val("");
				$('#' + form_id).find("#extension").val("");
				
				$('#' + form_id).each(function() {
					this.reset();
				});
			}
			
			//$('#' + modalId).find('span.save-status img').remove();
			if(form_id)
				$('#' + modal_id).modal('hide');
			
			var document = data.toJSON();
			add_recent_view(new BaseModel(document));
			
			// Updates data to timeline
			if (App_Contacts.contactDetailView
					&& Current_Route == "contact/"
							+ App_Contacts.contactDetailView.model.get('id')) {

				// Add model to collection. Disabled sort while adding and called
				// sort explicitly, as sort is not working when it is called by add
				// function
				
				
				/*
				 * Verifies whether the added document is related to the contact in
				 * contact detail view or not
				 */
				$.each(document.contacts, function(index, contact) {
					
					if (contact.id == App_Contacts.contactDetailView.model.get('id'))
					{
						if (documentsView && documentsView.collection)
						{
							if(documentsView.collection.get(document.id))
							{
								documentsView.collection.get(document.id).set(new BaseModel(document));
							}
							else
							{
								documentsView.collection.add(new BaseModel(document), { sort : false });
								documentsView.collection.sort();
							}
						}
						
							// Activates "Timeline" tab and its tab content in
							// contact detail view
							// activate_timeline_tab();
							add_entity_to_timeline(data);
							/*
							 * If timeline is not defined yet, initiates with the
							 * data else inserts
							 */
							return false;
					}
				});
			}
			else if (Current_Route == 'documents') {
				if (isUpdate)
					App_Documents.DocumentCollectionView.collection.remove(json);

				App_Documents.DocumentCollectionView.collection.add(data);

				App_Documents.DocumentCollectionView.render(true);

			}
			else {
				App_Documents.navigate("documents", {
					trigger : true
				});
			}
		}
	});
}/**
 * Creates a backbone router to perform admin activities (account preferences,
 * users management, custom fields, milestones and etc..).
 * 
 */
var AdminSettingsRouter = Backbone.Router.extend({

	routes : {
	/* Admin-Settings */
	"admin" : "adminSettings",

	/* Account preferences */
	"account-prefs" : "accountPrefs",

	/* Users */
	"users" : "users", "users-add" : "usersAdd", "user-edit/:id" : "userEdit",

	/* Custom fields */
	"custom-fields" : "customFields",

	/* Api & Analytics */
	"api" : "api", "analytics-code" : "analyticsCode",

	/* Milestones */
	"milestones" : "milestones",

	/* All Domain Users */
	"all-domain-users" : "allDomainUsers",

	/* Menu settings - select modules on menu bar */
	"menu-settings" : "menu_settings",

	/* Mandrill Email Activity */
	"email-stats" : "emailStats",

	/* Web to Lead */
	"integrations" : "integrations"

	},

	/**
	 * Show menu-settings modules selection ( calendar, cases, deals, campaign ) &
	 * saving option
	 * 
	 * @author Chandan
	 */
	menu_settings : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html("You have no Admin Privileges");
			return;
		}
		$("#content").html(getTemplate("admin-settings"), {});
		var view = new Base_Model_View({ url : '/core/api/menusetting', template : "admin-settings-menu-settings", reload : true });

		$('#content').find('#admin-prefs-tabs-content').html(view.render().el);
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.menu-settings-tab').addClass('active');
	},

	/**
	 * Loads a template to show account preferences, with "subscription" option
	 * to change the plan
	 */
	accountPrefs : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html("You have no Admin Privileges");
			return;
		}
		$("#content").html(getTemplate("admin-settings"), {});
		var view = new Base_Model_View({ url : '/core/api/account-prefs', template : "admin-settings-account-prefs" });

		$('#content').find('#admin-prefs-tabs-content').html(view.render().el);
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.account-prefs-tab').addClass('active');
	},

	/**
	 * Shows list of all the users with an option to add new user
	 */
	users : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html("You have no Admin Privileges");
			return;
		}
		$("#content").html(getTemplate("admin-settings"), {});
		this.usersListView = new Base_Collection_View({ url : '/core/api/users', restKey : "domainUser", templateKey : "admin-settings-users",
			individual_tag_name : 'tr', postRenderCallback : function(el)
			{
				head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
				{
					$(".last-login-time", el).timeago();
				});
			} });
		this.usersListView.collection.fetch();

		$('#content').find('#admin-prefs-tabs-content').html(this.usersListView.el);
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.users-tab').addClass('active');
	},

	/**
	 * Loads a template to add new user, navigates to users list on adding a
	 * user
	 */
	usersAdd : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html("You have no Admin Privileges");
			return;
		}
		$("#content").html(getTemplate("admin-settings"), {});
		var view = new Base_Model_View({ url : 'core/api/users', template : "admin-settings-user-add", isNew : true, window : 'users', reload : true,
			postRenderCallback : function(el)
			{
				if (view.model.get("id"))
					addTagAgile("User invited");
				
				// Binds action 
				bindAdminChangeAction(el);
			} });

		$('#content').find('#admin-prefs-tabs-content').html(view.render().el);
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.users-tab').addClass('active');

	},

	/**
	 * Edits the existing user by verifying whether the users list view is
	 * defined or not
	 */
	userEdit : function(id)
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html("You have no Admin Privileges");
			return;
		}
		$("#content").html(getTemplate("admin-settings"), {});

		// If users list is not defined then take back to users template
		if (!this.usersListView || !this.usersListView.collection.get(id))
		{
			this.navigate("users", { trigger : true });
			return;
		}

		// Gets user from the collection based on id
		var user = this.usersListView.collection.get(id);

		/*
		 * Creates a Model for users edit, navigates back to 'user' window on
		 * save success
		 */
		var view = new Base_Model_View({ url : 'core/api/users', model : user, template : "admin-settings-user-add", window : 'users', reload : true, postRenderCallback: function(el){
			bindAdminChangeAction(el);
		} });

		$('#content').find('#admin-prefs-tabs-content').html(view.render().el);
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.users-tab').addClass('active');

	},

	/**
	 * Shows list of custom fields with an option to add new custom field of
	 * desired type
	 * 
	 */
	/**
	 * Shows list of custom fields with an option to add new custom field of
	 * desired type
	 * 
	 */
	customFields : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html("You have no Admin Privileges");
			return;
		}
		$("#content").html(getTemplate("admin-settings"), {});
		this.customFieldsListView = new Base_Collection_View({ url : '/core/api/custom-fields', restKey : "customFieldDefs",
			templateKey : "admin-settings-customfields", individual_tag_name : 'tr' });

		this.customFieldsListView.collection.fetch();

		$('#content').find('#admin-prefs-tabs-content').html(this.customFieldsListView.el);
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.custom-fields-tab').addClass('active');
	},

	/**
	 * Loads java-script API to make the user able to track page views on users
	 * site, add/delete contacts from users website or blog directly. Loads
	 * minified prettify.js to prettify analytics code.
	 */
	analyticsCode : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html("You have no Admin Privileges");
			return;
		}
		head.js(LIB_PATH + 'lib/prettify-min.js', function()
		{
			var view = new Base_Model_View({ url : '/core/api/api-key', template : "admin-settings-api-key-model", postRenderCallback : function(el)
			{
				prettyPrint();
			} });
			$("#content").html(getTemplate("admin-settings"), {});
			$('#content').find('#admin-prefs-tabs-content').html(view.el);
			$('#content').find('#AdminPrefsTab .active').removeClass('active');
			$('#content').find('.analytics-code-tab').addClass('active');
			// $('#content').html(view.el);
		});
	},

	/**
	 * Shows API-KEY. Loads minified prettify.js to prettify the view
	 */
	api : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html("You have no Admin Privileges");
			return;
		}
		head.js(LIB_PATH + 'lib/prettify-min.js', function()
		{
			var view = new Base_Model_View({ url : '/core/api/api-key', template : "admin-settings-api-model", postRenderCallback : function(el)
			{
				prettyPrint();
			} });
			$("#content").html(getTemplate("admin-settings"), {});
			$('#content').find('#admin-prefs-tabs-content').html(view.el);
			$('#content').find('#AdminPrefsTab .active').removeClass('active');
			$('#content').find('.analytics-code-tab').addClass('active');
			// $('#content').html(view.el);
		});
	},

	/**
	 * Creates a Model to show and edit milestones, reloads the page on save
	 * success
	 */
	milestones : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html("You have no Admin Privileges");
			return;
		}
		$("#content").html(getTemplate("admin-settings"), {});
		var view = new Base_Model_View({ url : '/core/api/milestone', template : "admin-settings-milestones", reload : true, postRenderCallback : function(el)
		{
			setup_milestones();
		} });

		$('#content').find('#admin-prefs-tabs-content').html(view.render().el);
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.milestones-tab').addClass('active');
	},

	/**
	 * Fetches Mandrill subaccount usage info.
	 */
	emailStats : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html("You have no Admin Privileges");
			return;
		}
		$("#content").html(getTemplate("admin-settings"), {});
		var emailStatsModelView = new Base_Model_View({ url : 'core/api/emails/email-stats', template : 'admin-settings-email-stats', });

		$('#content').find('#admin-prefs-tabs-content').html(emailStatsModelView.render().el);
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.stats-tab').addClass('active');

	},

	/**
	 * Web to lead links to website pages
	 */
	integrations : function()
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html("You have no Admin Privileges");
			return;
		}
		$("#content").html(getTemplate("admin-settings"), {});
		$('#content').find('#admin-prefs-tabs-content').html(getTemplate("admin-settings-web-to-lead"), {});
		$('#content').find('#AdminPrefsTab .active').removeClass('active');
		$('#content').find('.integrations-tab').addClass('active');
	},


	/**
	 * Creates a Model to show All Domain Users.
	 */
	allDomainUsers : function()
	{
		allDomainUsersCollectionView = new Base_Collection_View({ url : 'core/api/users/admin/domain-users', templateKey : "all-domain-users",
			individual_tag_name : 'tr', cursor : true, page_size : 25 });

		allDomainUsersCollectionView.collection.fetch();
		$('#content').html(allDomainUsersCollectionView.el);
	} });
/**
 * Initiates all the routers and assigns to global variable to access the routes
 * from any where in the code.
 */

// All Routers are global
var App_Contacts, App_Contact_Search, App_Contact_Bulk_Actions, App_Contact_Filters, App_Contact_Views, App_Workflows, App_Deals, App_Admin_Settings, App_Calendar, App_Settings, App_Reports, App_Cases, App_Subscription, App_Visitors, App_WebReports, App_Documents, App_Widgets;
var Collection_View = {};
$(function()
{
	App_Contacts = new ContactsRouter();
	App_Contact_Views = new ContactViewsRouter();
	App_Contact_Filters = new ContactFiltersRouter();
	App_Contact_Bulk_Actions = new ContactBulkActionRouter();
	App_Contact_Search = new ContactSearchRouter();
	App_Workflows = new WorkflowsRouter();
	App_Deals = new DealsRouter();
	App_Admin_Settings = new AdminSettingsRouter();
	App_Settings = new SettingsRouter();
	App_Calendar = new CalendarRouter();
	App_Subscription = new SubscribeRouter();
	App_Reports = new ReportsRouter();
	App_Cases = new CasesRouter();
	App_Visitors = new VisitorsRouter();
	App_WebReports = new WebreportsRouter();
	App_Documents = new DocumentsRouter();
	App_Widgets = new WidgetsRouter();

	// Binds an event to activate infinite page scrolling
	Backbone.history.bind("all", currentRoute)

	// Backbone.history.bind("change", routeChange)

	/*
	 * Start Backbone history a necessary step to begin monitoring hashchange
	 * events, and dispatching routes
	 */
	Backbone.history.start();
	setup_our_domain_sync();
});

// Global variable to store current route
var Current_Route;

/**
 * Reads current route, from the url of the browser, splits at "#" ( current
 * route is after "#" ), and activates infinite scrolling
 * 
 * @param route
 */
function currentRoute(route)
{
	Current_Route = window.location.hash.split("#")[1];
	activateInfiniScroll();
//	set_profile_noty();
	// Reset it to uncheck checkboxes for bulk actions on route change
	SELECT_ALL = false;
	SUBSCRIBERS_SELECT_ALL = false;
	if (tour)
	{
		tour.end();
		tour = null;
	}
	if (GLOBAL_WEBRULE_FLAG)
	{
		_agile_execute_web_rules();
	}
	// disposeEvents();
}
/**
 * calendar.js is a script file having a route to show calendar
 * 
 * @module Activities
 */
var CalendarRouter = Backbone.Router.extend({

	routes : {
	/* Shows fullCalendar page */
	"calendar" : "calendar", "tasks" : "tasks" },
	/**
	 * Activates the calendar menu and loads minified fullcalendar and jquery-ui
	 * to show calendar view. Also shows tasks list in separate section.
	 */
	calendar : function()
	{

		$(".active").removeClass("active");
		$("#calendarmenu").addClass("active");

		$('#content').html(getTemplate("calendar", {}));

		// Typahead also uses jqueryui - if you are changing the version here,
		// change it there too
		head.js(LIB_PATH + 'lib/jquery-ui.min.js', 'lib/fullcalendar.min.js', function()
		{
			showCalendar()
		});

		this.tasksListView = new Base_Collection_View({ url : '/core/api/tasks', restKey : "task", templateKey : "tasks", individual_tag_name : 'tr',
			postRenderCallback : function(el)
			{
				head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
				{
					$(".task-due-time", el).timeago();
				});

			} });

		// Tasks has its own appendItem function to show the status (overdue,
		// today, tomorrow and next-week)
		this.tasksListView.appendItem = append_tasks;
		this.tasksListView.collection.fetch();

		$('#tasks').html(this.tasksListView.el);
	},

	/* Show tasks list when All Tasks clicked under calendar page. */
	tasks : function()
	{

		$('#content').html(getTemplate("tasks-list-header", {}));
		
		fillSelect("owner-tasks", '/core/api/users/current-user', 'domainUser', function fillOwner()
		{

			$('#content').find("#owner-tasks").prepend("<li><a href=''>All Tasks</a></li>");
			$('#content').find("#owner-tasks").append("<li><a href='all-pending-tasks'>All Pending Tasks</a></li>");
			$('#content').find("#owner-tasks").append("<li><a href='my-pending-tasks'>My Pending Tasks</a></li>");

			// To Updated task list based on user selection of type and owner
			//initOwnerslist();
			
			findDetails("CATEGORY","my-pending-tasks");
		}, "<li><a href='{{id}}'>My Tasks</a></li>", true);

		$(".active").removeClass("active");
		$("#calendarmenu").addClass("active");
	} });
/**
 * Creates backbone router for Case create, read and update operations
 */
var CasesRouter = Backbone.Router.extend({

	routes : { "cases" : "listCases", },

	/**
	 * Fetches all the case and shows them as a list.
	 * 
	 */
	listCases : function()
	{
		this.casesCollectionView = new Base_Collection_View({ url : 'core/api/cases', sort_collection : false, restKey : "case", templateKey : "cases", cursor : true, page_size : 25,
			individual_tag_name : 'tr',	postRenderCallback : function(el) {
				includeTimeAgo(el);
			},
			appendItemCallback : function(el)
			{
				includeTimeAgo(el);
			} });

		this.casesCollectionView.collection.fetch();

		$('#content').html(this.casesCollectionView.render().el);

		$(".active").removeClass("active");
		$("#casesmenu").addClass("active");
	}

});
/**
 * Creates backbone router for contacts bulk actions management operations.
 */
var ContactBulkActionRouter = Backbone.Router.extend({
	
	routes : {
		
		/* Contact bulk actions */
		
		"bulk-owner" : "ownerBulk",
		
		"bulk-campaigns" : "campaignsBulk",
		
		"bulk-tags" : "tagsBulk",
		
		"bulk-tags-remove" : "tagsRemoveBulk",
		
		"bulk-email" : "emailBulk", 
		
	},

	/**
	 * Loads the owners template to subscribe the selected contacts to a
	 * campaign and triggers the custom event 'fill_owners' to fill the
	 * owners select drop down. This event is
	 */
	ownerBulk : function()
	{

		// On reloading redirecting to contacts list
		if (!App_Contacts.contactsListView)
			Backbone.history.navigate("contacts", { trigger : true });
		else
		{
			$("#content").html(getTemplate("bulk-actions-owner", {}));
			$('body').trigger('fill_owners');
		}
	},

	/**
	 * Loads the campaign template to subscribe the selected contacts to
	 * a campaign and triggers an event, which fills the campaigns
	 * select drop down. This event is binded to trigger on loading of
	 * the template
	 */
	campaignsBulk : function()
	{

		// On reloading redirecting to contacts list
		if (!App_Contacts.contactsListView)
			Backbone.history.navigate("contacts", { trigger : true });
		else
		{
			$("#content").html(getTemplate("bulk-actions-campaign", {}));
			$('body').trigger('fill_campaigns');
		}

	},

	/**
	 * Loads the tags template to add tags to the selected contacts
	 */
	tagsBulk : function()
	{
		// On reloading redirecting to contacts list
		if (!App_Contacts.contactsListView)
			Backbone.history.navigate("contacts", { trigger : true });
		else
			$("#content").html(getTemplate("bulk-actions-tags", {}));
	},
	/**
	 * Loads the tags template to add tags to the selected contacts
	 */
	tagsRemoveBulk : function()
	{
		// On reloading redirecting to contacts list
		if (!App_Contacts.contactsListView)
			Backbone.history.navigate("contacts", { trigger : true });
		else
			$("#content").html(getTemplate("bulk-actions-tags-remove", {}));
	},

	/**
	 * Loads the email template to send email to the selected contacts
	 * and triggers an event, which fills send email details. This event
	 * is binded to trigger on loading of the template
	 */
	emailBulk : function()
	{

		// On reloading redirecting to contacts list
		if (!App_Contacts.contactsListView)
			Backbone.history.navigate("contacts", { trigger : true });
		else
		{
			$("#content").html(getTemplate("send-email", {}));
			$('body').trigger('fill_emails');
		}
	}
	
});/**
 * Creates backbone router for contacts filters management operations.
 */
var ContactFiltersRouter = Backbone.Router.extend({
	
	routes : {
		

		/* Contact-Filters */
		
		"contact-filters" : "contactfilters",
		
		"contact-filter-add" : "contactFilterAdd",
		
		"contact-filter-edit/:id" : "contactFilterEdit",
		
		"contact-filter/:id" : "showFilterContacts",
		
	},
	
	/**
	 * Shows contact filters list
	 */
	contactfilters : function()
	{
		this.contactFiltersList = new Base_Collection_View({ url : '/core/api/filters', restKey : "ContactFilter", templateKey : "contact-filter",
			individual_tag_name : 'tr' });

		this.contactFiltersList.collection.fetch();
		$("#content").html(this.contactFiltersList.render().el);
	},
	
	/**
	 * Adds new filter to get specific contacts
	 */
	contactFilterAdd : function()
	{

		var contacts_filter = new Base_Model_View({ url : 'core/api/filters', template : "filter-contacts", isNew : "true", window : "contact-filters",
			postRenderCallback : function(el)
			{

				head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
				{
					chainFilters(el, undefined, function()
					{
						$('#content').html(el);
					});

				})
			} });

		$("#content").html(LOADING_HTML);
		contacts_filter.render();
	},
	
	/**
	 * Edits filter created
	 */
	contactFilterEdit : function(id)
	{
		if (!this.contactFiltersList || this.contactFiltersList.collection.length == 0 || this.contactFiltersList.collection.get(id) == null)
		{
			this.navigate("contact-filters", { trigger : true });
			return;
		}

		var contact_filter = this.contactFiltersList.collection.get(id);
		var ContactFilter = new Base_Model_View({ url : 'core/api/filters', model : contact_filter, template : "filter-contacts",
			window : 'contact-filters', postRenderCallback : function(el)
			{

				$("#content").html(LOADING_HTML);
				head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
				{
					chainFilters(el, contact_filter.toJSON(), function()
					{
						$("#content").html(el);
					});
					scramble_input_names($(el).find('#filter-settings'));
				})
			}, saveCallback : function(data)
			{
				var filterValue = readCookie('contact_filter');
				if (filterValue && filterValue == data.id)
					CONTACTS_HARD_RELOAD = true;
			} });

		$("#content").html(LOADING_HTML);
		ContactFilter.render();

	},

	/**
	 * Fetches contacts based on filter_id
	 */
	showFilterContacts : function(filter_id)
	{
		if (App_Contacts)
			App_Contacts.contacts(undefined, filter_id);
	},
	
	
});/**
 * Creates backbone router for contacts search management operations.
 */
var ContactSearchRouter = Backbone.Router.extend({

	routes : {

	/* Search results */

	"contacts/search/:query" : "searchResults" 
		
	},

	/**
	 * search results
	 */
	searchResults : function(query)
	{
		var searchResultsView = new Base_Collection_View({ url : "core/api/search/" + query, templateKey : "search", individual_tag_name : 'tr', cursor : true,
			data : QUERY_RESULTS, sort_collection : false, page_size : 15, postRenderCallback : function(el)
			{
				// Shows the query string as heading of search results
				if (searchResultsView.collection.length == 0)
					$("#search-query-heading", el).html('No matches found for "' + query + '"');
				else
					$("#search-query-heading", el).html('Search results for "' + query + '"');
			} });

		// If QUERY_RESULTS is defined which are set by agile_typeahead
		// istead of fetching again
		/*
		 * if(QUERY_RESULTS) { //Create collection with results
		 * searchResultsView.collection = new BaseCollection(QUERY_RESULTS, {
		 * restKey : searchResultsView.options.restKey, sortKey :
		 * searchResultsView.options.sortKey });
		 * 
		 * $('#content').html(searchResultsView.render(true).el);
		 * $('body').trigger('agile_collection_loaded'); return; }
		 */

		// If in case results in different page is clicked before
		// typeahead fetch results, then results are fetched here
		searchResultsView.collection.fetch();

		$('#content').html(searchResultsView.render().el);

	}

});
/**
 * Creates backbone router for contacts views management operations.
 */
var ContactViewsRouter = Backbone.Router.extend({
	
	routes : {
		
		/* Views */

		"contact-views" : "contactViews", 
		
		"contact-view-add" : "contactViewAdd",
		
		"contact-custom-view-edit/:id" : "editContactView",
	},
	
	/**
	 * Shows contact view lists
	 */
	contactViews : function()
	{
		this.contactViewListView = new Base_Collection_View({ url : '/core/api/contact-view', restKey : "contactView",
			templateKey : "contact-custom-view", individual_tag_name : 'tr' });
		this.contactViewListView.collection.fetch();
		$('#content').html(this.contactViewListView.render().el);
	},
	
	/**
	 * Adds new view for contact list
	 */
	contactViewAdd : function()
	{
		var view = new Base_Model_View({ url : 'core/api/contact-view', isNew : true, window : "contact-views", template : "contact-view",
			postRenderCallback : function(el)
			{
				// Check if model is new or not. If it is not new then
				// there is no need to perform post render
				if (view.model && view.model.get('id'))
					return;
				fillSelect("custom-fields-optgroup", "core/api/custom-fields", undefined, function(data)
				{
					console.log(data);
					head.js(LIB_PATH + 'lib/jquery-ui.min.js', LIB_PATH + 'lib/jquery.multi-select.js', function()
					{
						$("#content").html(el);
						$('#multipleSelect', el).multiSelect();
						$('.ms-selection', el).children('ul').addClass('multiSelect').attr("name", "fields_set").sortable();

					});
				}, '<option value="CUSTOM_{{field_label}}">{{field_label}}</option>', true, el);

			} });
		$("#content").html(LOADING_HTML);
		view.render();
	},
	
	/**
	 * Edits contact view
	 */
	editContactView : function(id)
	{

		if (!App_Contact_Views.contactViewListView || App_Contact_Views.contactViewListView.collection.length == 0 || App_Contact_Views.contactViewListView.collection
				.get(id) == null)
		{
			this.navigate("contact-views", { trigger : true });
			return;
		}
		var contact_view_model = App_Contact_Views.contactViewListView.collection.get(id);

		var contactView = new Base_Model_View({ url : 'core/api/contact-view/', model : contact_view_model, template : "contact-view",
			restKey : "contactView", window : "contact-views", postRenderCallback : function(el)
			{
				fillSelect("custom-fields-optgroup", "core/api/custom-fields", undefined, function(data)
				{
					head.js(LIB_PATH + 'lib/jquery-ui.min.js', LIB_PATH + 'lib/jquery.multi-select.js', function()
					{

						$('#multipleSelect', el).multiSelect();

						$('.ms-selection', el).children('ul').addClass('multiSelect').attr("name", "fields_set").attr("id", "fields_set").sortable();

						$.each(contact_view_model.toJSON()['fields_set'], function(index, field)
						{
							$('#multipleSelect', el).multiSelect('select', field);
						});

					});

				}, '<option value="CUSTOM_{{field_label}}">{{field_label}}</option>', true, el);
			}, saveCallback : function(data)
			{
				var viewValue = readCookie('contact_view');
				if (viewValue && viewValue == data.id)
				{
					CONTACTS_HARD_RELOAD = true;
					App_Contacts.contactViewModel = undefined;
				}
			} });

		$("#content").html(contactView.render().el);

	},
	
});/**
 * Creates backbone router for contacts management and filter (custom view)
 * operations.
 * 
 * @module Contact management & filters
 */

CONTACTS_HARD_RELOAD = true;

var ContactsRouter = Backbone.Router.extend({

	routes : { 
		
		"" : "dashboard", 
		
		"dashboard" : "dashboard",
		
		// "dashboard-test": "dashboard",

		/* Contacts */
		"contacts" : "contacts",
		
		"contact/:id" : "contactDetails",
		
		"import" : "importContacts",
		
		"contact-edit" : "editContact",
		
		"contact-duplicate" : "duplicateContact",
		
		"tags/:tag" : "contacts", 
		
		"send-email" : "sendEmail",
		
		"send-email/:id" : "sendEmail",
		
		"add-campaign" : "addContactToCampaign",

		/* Return back from Scribe after oauth authorization */
		"gmail" : "email", "twitter" : "socialPrefs", "linkedin" : "socialPrefs",
	},

	initialize : function()
	{
		/*
		 * $(".active").removeClass("active");
		 * 
		 * $("#content").html(getTemplate('dashboard-timline', {}));
		 * setup_dashboardTimeline();
		 */
	},

	dashboard : function()
	{

		$(".active").removeClass("active");

		var time_int = parseInt($('meta[name="last-login-time"]').attr('content'));
		var time_date = new Date(time_int * 1000);

		var el = $(getTemplate('dashboard1', { time_sec : (time_date).toString().toLowerCase(), time_format : "" }));
		$("#content").html(el);

		head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
		{
			$("span#last-login-time").timeago();
		});
		setup_dashboard(el);
		// loadDynamicTimeline("my-timeline", el);
	},
	
	/**
	 * Fetches all the contacts (persons) and shows as list, if tag_id
	 * and filter_id are not defined, if any one of them is defined then
	 * fetches the contacts related to that particular id (tag_id or
	 * filter_id) and shows as list. Adds tags, charts for tags and
	 * filter views to the contacts list from postRenderCallback of its
	 * Base_Collection_View. Initiates infiniScroll to fetch contacts
	 * (25 in count) step by step on scrolling down instead of fetching
	 * all at once.
	 */
	contacts : function(tag_id, filter_id, grid_view)
	{

		// If contacts are selected then un selects them
		SELECT_ALL = false;

		var max_contacts_count = 20;
		var template_key = "contacts";
		var individual_tag_name = "tr";
		if (grid_view || readCookie("agile_contact_view"))
		{
			template_key = "contacts-grid";
			individual_tag_name = "div";
		}
		// Default url for contacts route
		var url = '/core/api/contacts';
		var collection_is_reverse = false;
		this.tag_id = tag_id;

		if (readCookie('company_filter'))
		{
			eraseCookie('contact_filter');
		}
		// Tags, Search & default browse comes to the same function
		if (tag_id)
		{

			// erase filter cookie
			eraseCookie('contact_filter');
			eraseCookie('company_filter');

			if (this.contactsListView && this.contactsListView.collection)
			{

				if (this.contactsListView.collection.url.indexOf('core/api/tags/' + tag_id) == -1)
				{
					this.contactsListView = undefined;
				}
			}

			if (readCookie("contact_view"))
			{
				this.customView(readCookie("contact_view"), undefined, 'core/api/tags/' + tag_id, tag_id);
				return;
			}

			filter_id = null;

			url = '/core/api/tags/' + tag_id;

			tag_id = unescape(tag_id);
		}
		else
		{
			if (this.contactsListView && this.contactsListView.collection)
			{

				if (this.contactsListView.collection.url.indexOf('core/api/tags/') != -1)
				{
					console.log(window.location.hash = '#contacts');
					this.contactsListView = undefined;
				}
			}
		}

		if (readCookie('company_filter'))
		{
			// Change template to companies - this template is separate
			// from contacts default template
			url = "core/api/contacts/companies";

			if (!grid_view && !readCookie("agile_contact_view"))
				template_key = "companies";
		}

		// If contact-filter cookie is defined set url to fetch
		// respective filter results
		if (filter_id || (filter_id = readCookie('contact_filter')))
		{
			collection_is_reverse = false;
			url = "core/api/filters/query/" + filter_id;
		}

		// If view is set to custom view, load the custom view
		// If Company filter active-don't load any Custom View Show
		// default
		if (!readCookie('company_filter') && readCookie("contact_view"))
		{
			// If there is a filter saved in cookie then show filter
			// results in custom view saved
			if (readCookie('contact_filter'))
			{
				// Then call customview function with filter url
				this.customView(readCookie("contact_view"), undefined, "core/api/filters/query/" + readCookie('contact_filter'), tag_id);
				return;
			}

			// Else call customView function fetches results from
			// default url : "core/api/contacts"
			this.customView(readCookie("contact_view"), undefined);
			return;
		}

		console.log("while creating new base collection view : " + collection_is_reverse);

		/**
		 * If collection is already defined and contacts are fetched the
		 * show results instead of initializing collection again
		 */
		if (CONTACTS_HARD_RELOAD == true)
		{
			this.contactsListView = undefined;
			CONTACTS_HARD_RELOAD = false;
		}

		if (this.contactsListView && this.contactsListView.collection)
		{
			this.contactsListView.collection.url = url;

			$('#content').html(this.contactsListView.render(true).el);

			$(".active").removeClass("active");
			$("#contactsmenu").addClass("active");
			return;
		}

		/*
		 * cursor and page_size options are taken to activate
		 * infiniScroll
		 */
		this.contactsListView = new Base_Collection_View({ url : url, templateKey : template_key, individual_tag_name : individual_tag_name,
			cursor : true, page_size : 25, sort_collection : collection_is_reverse, postRenderCallback : function(el)
			{

				// Contacts are fetched when the app loads in
				// the initialize
				var cel = App_Contacts.contactsListView.el;
				var collection = App_Contacts.contactsListView.collection;

				// To set heading in template
				if (readCookie('company_filter'))
				{
					// $('#contact-heading',el).text('Companies');
				}

				// To set chats and view when contacts are fetch by
				// infiniscroll
				setup_tags(cel);
				pieTags(cel);
				setupViews(cel);

				/*
				 * Show list of filters dropdown in contacts list, If
				 * filter is saved in cookie then show the filter name
				 * on dropdown button
				 */
				setupContactFilterList(cel, tag_id);
				start_tour("contacts", el);
			} });

		// Contacts are fetched when the app loads in the initialize
		this.contactsListView.collection.fetch();

		$('#content').html(this.contactsListView.render().el);

		$(".active").removeClass("active");
		$("#contactsmenu").addClass("active");

	},

	/**
	 * Shows a contact in its detail view by taking the contact from
	 * contacts list view, if list view is defined and contains the
	 * contact, otherwise downloads the contact from server side based
	 * on its id. Loads timeline, widgets, map and stars (to rate) from
	 * postRenderCallback of its Base_Model_View.
	 * 
	 */
	contactDetails : function(id, contact)
	{

		var contact_collection;

		if (!contact && this.contactDetailView && this.contactDetailView.model != null)
		{
			contact_collection = this.contactDetailView;

			if (id == this.contactDetailView.model.toJSON()['id'])
			{
				App_Contacts.contactDetails(id, this.contactDetailView.model);
				return;
			}
		}

		// If user refreshes the contacts detail view page directly - we
		// should load from the model
		if (!contact)
			if (!this.contactsListView || this.contactsListView.collection.length == 0 || this.contactsListView.collection.get(id) == null)
			{

				console.log("Downloading contact");

				// Download
				var contact_details_model = Backbone.Model.extend({ url : function()
				{
					return '/core/api/contacts/' + this.id;
				} });

				var model = new contact_details_model();
				model.id = id;
				model.fetch({ success : function(data)
				{

					// Call Contact Details again
					App_Contacts.contactDetails(id, model);

				} });

				return;
			}

		// If not downloaded fresh during refresh - read from collection
		if (!contact)
		{
			// Set url to core/api/contacts (If filters are loaded
			// contacts url is changed so set it back)

			this.contactsListView.collection.url = "core/api/contacts";
			contact = this.contactsListView.collection.get(id);
			contact_collection = this.contactsListView.collection;

		}

		add_recent_view(contact);

		// If contact is of type company , go to company details page
		if (contact.get('type') == 'COMPANY')
		{
			this.contactDetailView = new Base_Model_View({ model : contact, isNew : true, template : "company-detail",
				postRenderCallback : function(el)
				{

					// Clone contact model, to avoid render and
					// post-render fell in to
					// loop while changing attributes of contact
					var recentViewedTime = new Backbone.Model();
					recentViewedTime.url = "core/api/contacts/viewed-at/" + contact.get('id');
					recentViewedTime.save();

					if (App_Contacts.contactsListView && App_Contacts.contactsListView.collection && App_Contacts.contactsListView.collection.get(id))
						App_Contacts.contactsListView.collection.get(id).attributes = contact.attributes;

					starify(el);
					show_map(el);
					fill_owners(el, contact.toJSON());
					// loadWidgets(el, contact.toJSON());
				} });

			var el = this.contactDetailView.render(true).el;
			$('#content').html(el);
			fill_company_related_contacts(id, 'company-contacts');
			return;
		}

		this.contactDetailView = new Base_Model_View({ model : contact, isNew : true, template : "contact-detail", postRenderCallback : function(el)
		{

			// Clone contact model, to avoid render and post-render fell
			// in to
			// loop while changing attributes of contact
			var recentViewedTime = new Backbone.Model();
			recentViewedTime.url = "core/api/contacts/viewed-at/" + contact.get('id');
			recentViewedTime.save();

			if (App_Contacts.contactsListView && App_Contacts.contactsListView.collection && App_Contacts.contactsListView.collection.get(id))
				App_Contacts.contactsListView.collection.get(id).attributes = contact.attributes;


			load_contact_tab(el, contact.toJSON());

			loadWidgets(el, contact.toJSON());
			
			/*
			 * // To get QR code and download Vcard
			 * $.get('/core/api/VCard/' + contact.toJSON().id,
			 * function(data){ console.log("Vcard string");
			 * console.log(data); var url =
			 * 'https://chart.googleapis.com/chart?cht=qr&chs=180x180&chld=0&choe=UTF-8&chl=' +
			 * encodeURIComponent(data); $("#qrcode", el).html('<img
			 * src="' + url + '" id="qr_code" alt="QR Code"/>');
			 * //$("#qrcode", el).html('<img
			 * style="display:inline-block!important;" src="' + url + '"
			 * id="qr_code" alt="QR Code" data="' + data + '"
			 * onload="qr_load();"/>'); $("#qrcode", el).prepend('<span
			 * style="padding: 8% 0%;margin-right: 2px;float:right;"
			 * id="downloadify"></span>'); });
			 */

			starify(el);

			show_map(el);

			// To navigate between contacts details
			if (contact_collection != null)
				contact_detail_view_navigation(id, contact_collection, el);

			fill_owners(el, contact.toJSON());
			start_tour("contact-details", el);
		} });

		var el = this.contactDetailView.render(true).el;

		$('#content').html(el);
	},

	/**
	 * Takes the contact to continue contact form to edit it. If
	 * attempts to edit a contact without defining contact detail view,
	 * navigates to contacts page. Gets the contact to edit, from its
	 * list view or its custom view, if not found in both downloads from
	 * server side (Contact database).
	 */
	editContact : function(contact)
	{

		// Takes back to contacts if contacts detailview is not defined
		if (!this.contactDetailView || !this.contactDetailView.model.id)
		{
			this.navigate("contacts", { trigger : true });
			return;
		}

		// If contact detail view is defined the get current contact
		// model id
		var id = this.contactDetailView.model.id;

		if (this.contactDetailView && this.contactDetailView.model.id)
		{
			contact = this.contactDetailView.model.toJSON();
		}

		// If contact list is defined the get contact to edit from the
		// list
		else if (this.contactsListView && this.contactsListView.collection && this.contactsListView.collection.get(id))
		{
			contact = this.contactsListView.collection.get(id).toJSON();
		}

		// If contacts list view is not defined happens when in
		// custom-view route or in filter
		// then get contact from contact custom view
		else if (this.contact_custom_view && this.contact_custom_view.collection && this.contact_custom_view.collection.get(id))
		{
			contact = this.contact_custom_view.collection.get(id).toJSON();
		}

		// If contact list view and custom view list is not defined then
		// download contact
		else if (!contact)
		{
			// Download contact for edit since list is not defined
			var contact_details_model = Backbone.Model.extend({ url : function()
			{
				return '/core/api/contacts/' + id;
			} });

			var model = new contact_details_model();

			model.fetch({ success : function(contact)
			{

				// Call Contact edit again with downloaded contact
				// details
				App_Contacts.editContact(contact.toJSON());
			} });

			return;
		}

		// Contact Edit - take him to continue-contact form
		add_custom_fields_to_form(contact, function(contact)
		{

			if (contact.type == 'COMPANY')
				deserialize_contact(contact, 'continue-company');
			else
				deserialize_contact(contact, 'continue-contact');
		}, contact.type);
	},

	/**
	 * Creates a duplicate contact to the existing one. Deletes the
	 * email (as well as it has to be unique) and id (to create new one)
	 * of the existing contact and saves it. Also takes the duplicate
	 * contact to continue contact form to edit it.
	 */
	duplicateContact : function()
	{

		// Takes back to contacts if contacts detail view is not defined
		if (!this.contactDetailView || !this.contactDetailView.model.id || !this.contactsListView || this.contactsListView.collection.length == 0)
		{
			this.navigate("contacts", { trigger : true });
			return;
		}

		// Contact Duplicate
		var contact = this.contactsListView.collection.get(this.contactDetailView.model.id);
		var json = contact.toJSON();

		// Delete email as well as it has to be unique
		json = delete_contact_property(json, 'email');
		delete json.id;

		var contactDuplicate = new Backbone.Model();
		contactDuplicate.url = 'core/api/contacts';
		contactDuplicate.save(json, { success : function(data)
		{
			add_custom_fields_to_form(data.toJSON(), function(contact)
			{

				deserialize_contact(contact, 'continue-contact');

			});
		} });
	},

	/**
	 * Navigates the contact (of type company) to continue company form
	 */
	/*
	 * continueCompany: function () { // commented here to avoid the
	 * creation of multiple entities var model =
	 * serialize_and_save_continue_contact(undefined, 'companyForm',
	 * 'companyModal', true, false, '#continue-company'); },
	 */

	/**
	 * Imports contacts from a csv file and then uploads all the
	 * contacts to database
	 */
	importContacts : function()
	{
		$('#content').html(getTemplate("import-contacts", {}));
	},

	/**
	 * Subscribes a contact to a campaign. Loads the related template
	 * and triggers the custom event "fill_campaigns_contact" to show
	 * the campaigns drop down list.
	 */
	addContactToCampaign : function()
	{
		$("#content").html(getTemplate("contact-detail-campaign", {}));

		$('body').trigger('fill_campaigns_contact');
	},

	/**
	 * Shows a send email form with some prefilled values (email - from,
	 * to and templates etc..). To prefill the fields the function
	 * populate_send_email_details is called from the
	 * postRenderCallback.
	 */
	sendEmail : function(id)
	{
		
		// Takes back to contacts if contacts detail view is not defined
		if (!this.contactDetailView || !this.contactDetailView.model.id)
		{
			this.navigate("contacts", { trigger : true });
			return;
		}
		
		// Show the email form with the email prefilled from the curtrent contact
		var model = this.contactDetailView.model;
		var sendEmailView = new Base_Model_View(
		{
			model : model,
			template : "send-email",
			postRenderCallback : function(el)
			{
				if (id)
					$("#emailForm", el).find('input[name="to"]').val(id);

				// Checks Zoomifier tag for contact
				if (checkTagAgile("Zoomifier"))
				{
					// Appends zoomifier link to attach their documents.
					head.js(LIB_PATH + 'lib/zoomifier.contentpicker.min.js', function()
					{
						$("#emailForm", el).find('textarea[name="body"]').closest(".controls")
								.append('<div><a style="cursor:pointer;" onclick="Javascript:loadZoomifierDocSelector();"><i class="icon-plus-sign"></i> Attach Zoomifier Doc</a></div>');
					});
				}

				// Populate from address and templates
				populate_send_email_details(el);

			}
		});
		$("#content").html(sendEmailView.render().el);
		
		// Setup HTML Editor
		setupTinyMCEEditor('textarea#email-body');
	},
	
	/**
	 * Custom views, its not called through router, but by cookies
	 */
	// Id = custom-view-id, view_data = custom view data if already
	// availabel, url = filter url if there is any filter
	customView : function(id, view_data, url, tag_id)
	{
		SELECT_ALL = false;
		App_Contacts.tag_id = tag_id;

		// If url is not defined set defult url to contacts
		if (!url)
		{
			url = "core/api/contacts";
		}

		if (CONTACTS_HARD_RELOAD == true)
		{
			this.contact_custom_view = undefined;
			CONTACTS_HARD_RELOAD = false;
			view_data = undefined;
		}

		// If id is defined get the respective custom view object
		if (id && !view_data)
		{
			// Once view id fetched we use it without fetching it.
			if (!App_Contacts.contactViewModel)
			{
				var view = new Backbone.Model();
				view.url = 'core/api/contact-view/' + id;
				view.fetch({ success : function(data)
				{
					// If custom view object is empty i.e., custom view
					// is deleted.
					// custom view cookie is eraised and default view is
					// shown
					if ($.isEmptyObject(data.toJSON()))
					{
						// Erase custom_view cookie, since
						// view object with given id is not available
						eraseCookie("contact_view");

						// Loads default contact view
						App_Contacts.contacts();
						return;
					}
					App_Contacts.contactViewModel = data.toJSON();
					App_Contacts.customView(undefined, App_Contacts.contactViewModel, url, tag_id);

				} });
				return;
			}

			view_data = App_Contacts.contactViewModel;

		}

		// If defined
		if (this.contact_custom_view)
		{
			// App_Contacts.contactsListView=this.contact_custom_view;
			if (!(this.contact_custom_view.collection.url == url))
			{
				App_Contacts.contact_custom_view.collection.url = url;
				App_Contacts.contact_custom_view.collection.fetch()
				$('#content').html(App_Contacts.contact_custom_view.render().el);
				return;
			}

			var el = App_Contacts.contact_custom_view.render(true).el;
			$('#content').html(el);

			if (readCookie('company_filter'))
				$('#contact-heading', el).text('Companies');

			setup_tags(el);
			pieTags(el);
			setupViews(el, view_data.name);
			setupContactFilterList(el, tag_id);

			$(".active").removeClass("active"); // Activate Contacts
												// Navbar tab
			$("#contactsmenu").addClass("active");
			return;
		}

		this.contact_custom_view = new Base_Collection_View({ url : url, restKey : "contact", modelData : view_data,
			templateKey : "contacts-custom-view", individual_tag_name : 'tr', cursor : true, page_size : 25, sort_collection : false,
			postRenderCallback : function(el)
			{
				App_Contacts.contactsListView = App_Contacts.contact_custom_view;

				// To set heading in template
				if (readCookie('company_filter'))
					$('#contact-heading', el).text('Companies');

				// To set chats and view when contacts are fetch by
				// infiniscroll
				setup_tags(el);

				pieTags(el);
				setupViews(el, view_data.name);

				// show list of filters dropdown in contacts list
				setupContactFilterList(el, App_Contacts.tag_id);
			} });

		// Defines appendItem for custom view
		this.contact_custom_view.appendItem = contactTableView;

		// Fetch collection
		this.contact_custom_view.collection.fetch();

		$('#content').html(this.contact_custom_view.el);

		// Activate Contacts Navbar tab
		$(".active").removeClass("active");
		$("#contactsmenu").addClass("active");
	},

});
/**
 * Creates backbone router for Deals/Opportunities create, read and update
 * operations
 */
var DealsRouter = Backbone.Router.extend({

	routes : {

	/* Deals/Opportunity */
	"deals" : "deals", },

	/**
	 * Fetches all the opportunities as list and also as milestone lists.
	 * Fetching both makes easy to add/get deal to the list rather than
	 * milestone lists. Based on deal_view cookie it show deals to user. Also
	 * fetches Milestones pie-chart and Details graph if deals exist.
	 */
	deals : function()
	{
		// Depending on cookie shows list or milestone view
		if (!readCookie("agile_deal_view"))
		{
			template_key = "opportunities-by-milestones";
			individual_tag_name = "div";
			url = 'core/api/opportunity/byMilestone';

			// Fetchs deals by milestones list
			this.opportunityMilestoneCollectionView = new Base_Collection_View({ url : url, templateKey : template_key,
				individual_tag_name : individual_tag_name, postRenderCallback : function(el)
				{
					// To show timeago for close date
					includeTimeAgo(el);

					$('#opportunities-by-milestones-model-list > div').addClass("milestone-main");
					// $('.milestone-main
					// :last-child').find("ul").closest('div').css({"border-right":"none"});

					setup_deals_in_milestones();

					// Shows Milestones Pie
					pieMilestones();

					// Shows deals chart
					dealsLineChart();
				} });
			this.opportunityMilestoneCollectionView.collection.fetch();

			// Shows deals as milestone list view
			$('#content').html(this.opportunityMilestoneCollectionView.render().el);
		}
		// Fetches deals as list
		this.opportunityCollectionView = new Base_Collection_View({ url : 'core/api/opportunity', templateKey : "opportunities", individual_tag_name : 'tr',// cursor : true, page_size : 25,
			postRenderCallback : function(el)
			{
				// Showing time ago plugin for close date
				includeTimeAgo(el);
				// Shows Milestones Pie
				pieMilestones();

				// Shows deals chart
				dealsLineChart();
			},
			appendItemCallback : function(el)
			{ 
				// To show timeago for models appended by infini scroll
				includeTimeAgo(el);
			}
			});
		this.opportunityCollectionView.collection.fetch();

		// Shows deals as list view
		if (readCookie("agile_deal_view"))
			$('#content').html(this.opportunityCollectionView.render().el);

		$(".active").removeClass("active");
		$("#dealsmenu").addClass("active");
	}

});
/**
 * Creates backbone router for Documents create, read and update operations
 */
var DocumentsRouter = Backbone.Router.extend({

	routes : {

	/* Documents */
	"documents" : "documents", },

	/**
	 * Fetches all the documents as list. Fetching makes easy to add/get
	 * document to the list.
	 */
	documents : function()
	{
		// Fetches documents as list
		this.DocumentCollectionView = new Base_Collection_View({ url : 'core/api/documents', templateKey : "documents", cursor : true, page_size : 20,
			individual_tag_name : 'tr', postRenderCallback : function(el)
			{
				includeTimeAgo(el);
/*				head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
				{
					$(".document-created-time", el).timeago();
				});*/
			},
			appendItemCallback : function(el)
			{ 
				// To show timeago for models appended by infini scroll
				includeTimeAgo(el);
			} });
		this.DocumentCollectionView.collection.fetch();

		// Shows deals as list view
		$('#content').html(this.DocumentCollectionView.render().el);

		$(".active").removeClass("active");
		$("#documentsmenu").addClass("active");
	} });
/**
 * Creates a backbone router to create, read and update reports
 * 
 * @module Reports
 */
var ReportsRouter = Backbone.Router.extend({

	routes : {

	/* Reports */
	"reports" : "reports", "email-reports" : "emailReports", "report-add" : "reportAdd", "report-edit/:id" : "reportEdit",
		"report-results/:id" : "reportInstantResults", "report-charts/:type" : "reportCharts", "report-funnel/:tags" : "showFunnelReport",
		"report-growth/:tags" : "showGrowthReport", "report-cohorts/:tag1/:tag2" : "showCohortsReport", "report-ratio/:tag1/:tag2" : "showRatioReport" },

	/**
	 * Shows reports categories
	 */
	reports : function()
	{
		$("#content").html(getTemplate('report-categories', {}));
		$(".active").removeClass("active");
		$("#reportsmenu").addClass("active");
	},

	/**
	 * Shows list of reports, with an option to add new report
	 */
	emailReports : function()
	{
		this.reports = new Base_Collection_View({ url : '/core/api/reports', restKey : "reports", templateKey : "report", individual_tag_name : 'tr' });

		this.reports.collection.fetch();
		$("#content").html(this.reports.render().el);

		$(".active").removeClass("active");
		$("#reportsmenu").addClass("active");
	},

	/**
	 * Loads a template to add new report. Populates users drop down list and
	 * loads agile.jquery.chained.min.js to chain conditions and values of input
	 * fields, from postRenderCallback of its Base_Model_View.
	 */
	reportAdd : function()
	{
		var count = 0;
		$("#content").html(LOADING_HTML);
		CUSTOM_FIELDS = undefined;
		var report_add = new Base_Model_View({ url : 'core/api/reports', template : "reports-add", window : "email-reports", isNew : true,
			postRenderCallback : function(el)
			{
				// Counter to set when script is loaded. Used to avoid flash in
				// page
				if (count != 0)
					return;
				fillSelect("custom-fields-optgroup", "core/api/custom-fields/scope?scope=CONTACT", undefined, function()
				{

					head.js(LIB_PATH + 'lib/jquery.multi-select.js', function()
					{

						$('#multipleSelect', el).multiSelect({ selectableOptgroup : true });

						$('.ms-selection', el).children('ul').addClass('multiSelect').attr("name", "fields_set").attr("id", "fields_set").sortable();

						++count;
						if (count > 1)
							$("#content").html(el)
					});
				}, '<option value="custom_{{field_label}}">{{field_label}}</option>', true, el);

				head.js(LIB_PATH + 'lib/jquery-ui.min.js', LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
				{
					scramble_input_names($(el).find('div#report-settings'));
					chainFilters(el, undefined, function()
					{
						++count;
						if (count > 1)
							$("#content").html(el)
					});
				});

			} });

		$("#content").html(LOADING_HTML);
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
		$("#content").html(LOADING_HTML);
		// Counter to set when script is loaded. Used to avoid flash in page
		var count = 0;

		// If reports view is not defined, navigates to reports
		if (!this.reports || !this.reports.collection || this.reports.collection.length == 0 || this.reports.collection.get(id) == null)
		{
			this.navigate("reports", { trigger : true });
			return;
		}

		// Gets a report to edit, from reports collection, based on id
		var report = this.reports.collection.get(id);
		var report_model = new Base_Model_View({ url : 'core/api/reports', change : false, model : report, template : "reports-add", window : "email-reports",
			postRenderCallback : function(el)
			{
				if (count != 0)
					return;
				fillSelect("custom-fields-optgroup", "core/api/custom-fields/scope?scope=CONTACT", undefined, function()
				{

					head.js(LIB_PATH + 'lib/jquery.multi-select.js', function()
					{
						console.log(el);
						console.log(report.toJSON());
						$('#multipleSelect', el).multiSelect({ selectableOptgroup : true });
						++count;
						if (count > 1)
							deserialize_multiselect(report.toJSON(), el);
					})

				}, '<option value="custom_{{field_label}}">{{field_label}}</option>', true, el);

				head.js(LIB_PATH + 'lib/jquery-ui.min.js', LIB_PATH + 'lib/agile.jquery.chained.min.js', LIB_PATH + 'lib/jquery.multi-select.js', function()
				{

					chainFilters(el, report.toJSON(), function()
					{
						++count
						if (count > 1)
							deserialize_multiselect(report.toJSON(), el);
					});
					scramble_input_names($(el).find('div#report-settings'));
				});

			} });

		$("#content").html(LOADING_HTML);
		report_model.render();

	},

	/**
	 * Shows report results. It gets report object from reports list, if it is
	 * list is not available then it fetches report based on report id, send
	 * request to process results, and shows them
	 */
	reportInstantResults : function(id, report)
	{

		if (!report)
			// If reports view is not defined, navigates to reports
			if (!this.reports || !this.reports.collection || this.reports.collection.length == 0 || this.reports.collection.get(id) == null)
			{

				// Shows loading while report is being fetched
				$("#content").html(LOADING_HTML);
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

		// Stores in global variable, as it is required to build custom table
		// headings
		REPORT = report;

		var report_results_view = new Base_Collection_View({ url : "core/api/reports/show-results/" + id, modelData : report, templateKey : "report-search",
			individual_tag_name : 'tr', cursor : true, sort_collection : false, page_size : 15, });// Collection

		// Report built with custom table, as reports should be shown with
		// custom order selected by user
		report_results_view.appendItem = reportsContactTableView;

		report_results_view.collection.fetch();

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

		head.load(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js', CSS_PATH + "css/misc/date-picker.css",  function()
		{
			// Load Reports Template
			$("#content").html(getTemplate("report-funnel", {}));

			// Set the name
			$('#reports-funnel-tags').text(tags);

			initFunnelCharts(function()
			{
				showFunnelGraphs(tags);
			});
		});

		$(".active").removeClass("active");
		$("#reportsmenu").addClass("active");
	},

	/**
	 * Returns growth report based on the tags
	 * 
	 * @param tags -
	 *            comma separated tags
	 */
	showGrowthReport : function(tags)
	{

		head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js',  CSS_PATH + "css/misc/date-picker.css", function()
		{

			// Load Reports Template
			$("#content").html(getTemplate("report-growth", {}));

			// Set the name
			$('#reports-growth-tags').text(tags);

			initFunnelCharts(function()
			{
				showGrowthGraphs(tags);
			});
		});

		$(".active").removeClass("active");
		$("#reportsmenu").addClass("active");
	},

	/**
	 * Returns Cohorts Graphs with two tag1
	 * 
	 * @param id -
	 *            workflow id
	 */
	showCohortsReport : function(tag1, tag2)
	{

		head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js', CSS_PATH + "css/misc/date-picker.css", function()
		{

			// Load Reports Template
			$("#content").html(getTemplate("report-cohorts", {}));

			// Set the name
			$('#reports-cohorts-tags').text(tag1 + " versus " + tag2);

			initFunnelCharts(function()
			{
				showCohortsGraphs(tag1, tag2);
			});
		});

		$(".active").removeClass("active");
		$("#reportsmenu").addClass("active");
	},
	/**
	 * Returns Cohorts Graphs with two tag1
	 * 
	 * @param id -
	 *            workflow id
	 */
	showRatioReport : function(tag1, tag2)
	{

		head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js', CSS_PATH + "css/misc/date-picker.css", function()
		{

			// Load Reports Template
			$("#content").html(getTemplate("report-ratio", {}));

			// Set the name
			$('#reports-ratio-tags').text(tag1 + " versus " + tag2);

			initFunnelCharts(function()
			{
				showRatioGraphs(tag1, tag2);
			});
		});

		$(".active").removeClass("active");
		$("#reportsmenu").addClass("active");
	},

	/**
	 * Shows reports charts of growth or funnel
	 */
	reportCharts : function(type)
	{
		var el = "";
		if (type)
			el = $(getTemplate("report-" + type + "-form", {}));
		else
			el = $(getTemplate("report-growth", {}));

		$("#content").html(el);

		if (type && (type == 'growth' || type == 'funnel'))
		{
			setup_tags_typeahead();
			return;
		}
		$.each($("#tags-reports", el), function(i, element)
		{
			console.log(element);
			addTagsDefaultTypeahead(element);
		});
	}

});
/**
 * Creates backbone router to access preferences of the user (email templates,
 * email (gmail/IMAP), notifications and etc..).
 */
var SettingsRouter = Backbone.Router.extend({

	routes : {
		
			/* Settings */
			"settings" : "settings",

			/* User preferences */
			"user-prefs" : "userPrefs",

			/* Change Password */
			"change-password" : "changePassword",

			/* Email (Gmail / IMAP) */
			"email" : "email",

			/* Social preferences */
			"social-prefs" : "socialPrefs",

			/* Email templates */
			"email-templates" : "emailTemplates", "email-template-add" : "emailTemplateAdd", "email-template/:id" : "emailTemplateEdit",

			/* Notifications */
			"notification-prefs" : "notificationPrefs",
			
			/* contact-us help email */
			"contact-us" : "contactUsEmail",
	},

	/**
	 * Shows all the options to access user's Preferences
	 */
	/*
	 * settings : function() { var html = getTemplate("settings", {});
	 * $('#content').html(html); // Update Menu
	 * $(".active").removeClass("active");
	 * $("#settingsmenu").addClass("active"); },
	 */

	/**
	 * Creates a Model to show and edit Personal Preferences, and sets
	 * HTML Editor. Reloads the page on save success.
	 */
	userPrefs : function()
	{
		$("#content").html(getTemplate("settings"), {});
		var view = new Base_Model_View({ url : '/core/api/user-prefs', template : "settings-user-prefs", reload : true,
			postRenderCallback : function(el)
			{
				// Setup HTML Editor
				setupHTMLEditor($('#WYSItextarea'));
			} });
		$('#prefs-tabs-content').html(view.render().el);
		$('#PrefsTab .active').removeClass('active');
		$('.user-prefs-tab').addClass('active');
		// $('#content').html(view.render().el);
	},

	/**
	 * Creates a Model to show and edit Personal Preferences, and sets
	 * HTML Editor. Reloads the page on save success.
	 */
	changePassword : function()
	{
		$("#content").html(getTemplate("settings"), {});

		$('#prefs-tabs-content').html(getTemplate("settings-change-password"), {});
		$('#PrefsTab .active').removeClass('active');
		$('.user-prefs-tab').addClass('active');

		// Save button action of change password form, If it is out of
		// this router wont navigate properly
		$("#saveNewPassword").on(
				"click",
				function(e)
				{

					e.preventDefault();
					var saveBtn = $(this);

					// Returns, if the save button has disabled
					// attribute
					if ($(saveBtn).attr('disabled'))
						return;

					// Disables save button to prevent multiple click
					// event issues
					disable_save_button($(saveBtn));

					var form_id = $(this).closest('form').attr("id");

					if (!isValidForm('#' + form_id))
					{

						// Removes disabled attribute of save button
						enable_save_button($(saveBtn));
						return false;
					}
					// Returns if same password is given
					if ($("#current_pswd").val() == $("#new_pswd").val())
					{
						$('#changePasswordForm').find('span.save-status').html(
								"<span style='color:red;margin-left:10px;'>Current and New Password can not be the same</span>");
						$('#changePasswordForm').find('span.save-status').find("span").fadeOut(5000);
						enable_save_button($(saveBtn));
						return false;
					}

					// Show loading symbol until model get saved
					$('#changePasswordForm').find('span.save-status').html(LOADING_HTML);

					var json = serializeForm(form_id);

					$.ajax({
						url : '/core/api/user-prefs/changePassword',
						type : 'PUT',
						data : json,
						success : function()
						{
							$('#changePasswordForm').find('span.save-status').html(
									"<span style='color:green;margin-left:10px;'>Password changed successfully</span>").fadeOut(5000);
							enable_save_button($(saveBtn));
							$('#' + form_id).each(function()
							{
								this.reset();
							});
							history.back(-1);
						},
						error : function(response)
						{
							$('#changePasswordForm').find('span.save-status').html("");
							$('#changePasswordForm').find('input[name="current_pswd"]').closest(".controls").append(
									"<span style='color:red;margin-left:10px;'>Incorrect Password</span>");
							$('#changePasswordForm').find('input[name="current_pswd"]').closest(".controls").find("span").fadeOut(5000);
							$('#changePasswordForm').find('input[name="current_pswd"]').focus();
							enable_save_button($(saveBtn));
						} });

				});
	},

	/**
	 * Shows social preferences (LinkedIn and Twitter) to get access.
	 * Loads linkedIn and then appends Twitter to the view
	 */
	socialPrefs : function()
	{
		$("#content").html(getTemplate("settings"), {});
		var data = { "service" : "linkedin" };
		var itemView = new Base_Model_View({ url : '/core/api/social-prefs/LINKEDIN', template : "settings-social-prefs", data : data });

		$('#prefs-tabs-content').html(itemView.render().el);

		data = { "service" : "twitter" };
		var itemView2 = new Base_Model_View({ url : '/core/api/social-prefs/TWITTER', template : "settings-social-prefs", data : data });

		$('#prefs-tabs-content').append(itemView2.render().el);
		$('#PrefsTab .active').removeClass('active');
		$('.social-prefs-tab').addClass('active');
	},

	/**
	 * Shows Gmail and IMAP preferences to get access. Allows to get the
	 * communicated mails between contact and logged in preference.
	 */
	email : function()
	{
		$("#content").html(getTemplate("settings"), {});
		// Gets Social Prefs (Same as Linkedin/Twitter) for Gmail
		var data = { "service" : "Gmail", "return_url" : encodeURIComponent(window.location.href) };
		var itemView = new Base_Model_View({ url : '/core/api/social-prefs/GMAIL', template : "settings-social-prefs", data : data });
		itemView.model.fetch();

		// Adds header
		$('#prefs-tabs-content').html("<div><h3><strong>Link your Email Account</strong></h3><br/></div>");

		// Adds Gmail Prefs
		$('#prefs-tabs-content').append(itemView.render().el);

		// Gets IMAP Prefs
		var itemView2 = new Base_Model_View({ url : '/core/api/imap', template : "settings-imap-prefs", postRenderCallback : function(el){
			itemView2.model.set("password","");
		} });
		
		
		// Appends IMAP
		$('#prefs-tabs-content').append(itemView2.render().el);
		$('#PrefsTab .active').removeClass('active');
		$('.email-tab').addClass('active');
	},

	/**
	 * Shows list of email templates, with an option to add new template
	 */
	emailTemplates : function()
	{
		$("#content").html(getTemplate("settings"), {});
		this.emailTemplatesListView = new Base_Collection_View({ url : '/core/api/email/templates', restKey : "emailTemplates",
			templateKey : "settings-email-templates", individual_tag_name : 'tr' });

		this.emailTemplatesListView.collection.fetch();
		$('#prefs-tabs-content').html(this.emailTemplatesListView.el);
		$('#PrefsTab .active').removeClass('active');
		$('.email-templates-tab').addClass('active');
		// $('#content').html(this.emailTemplatesListView.el);
	},

	/**
	 * Loads a form to add new email-template. Sets HTMLEditor for the
	 * form. Navigates to list of email templates on save success.
	 */
	emailTemplateAdd : function()
	{
		$("#content").html(getTemplate("settings"), {});
		var view = new Base_Model_View({
		    url: '/core/api/email/templates',
		    isNew: true,
		    template: "settings-email-template-add",
		    window: 'email-templates',
		});
		
		$('#prefs-tabs-content').html(view.render().el);
		
		// setup TinyMCE
		setupTinyMCEEditor('textarea#email-template-html');
		
		$('#PrefsTab .active').removeClass('active');
		$('.email-templates-tab').addClass('active');
		// $('#content').html(view.render().el);
	},

	/**
	 * Updates existing email-template. On updation navigates the page
	 * to email-templates list
	 * 
	 * @param id
	 *            EmailTemplate Id
	 */
	emailTemplateEdit : function(id)
	{
		$("#content").html(getTemplate("settings"), {});
		// Navigates to list of email templates, if it is not defined
		if (!this.emailTemplatesListView || this.emailTemplatesListView.collection.length == 0)
		{
			this.navigate("email-templates", { trigger : true });
			return;
		}

		// Gets the template form its collection
		var currentTemplate = this.emailTemplatesListView.collection.get(id);

		var view = new Base_Model_View({
		    url: '/core/api/email/templates',
		    model: currentTemplate,
		    template: "settings-email-template-add",
		    window: 'email-templates'
		});

		var view = view.render();
		$('#prefs-tabs-content').html(view.el);
		
		/** TinyMCE **/
		
		// set up TinyMCE Editor
		setupTinyMCEEditor('textarea#email-template-html');
		
		// Insert content into tinymce
		set_tinymce_content('email-template-html', currentTemplate.toJSON().text);
		
		/**End of TinyMCE**/
		
		$('#PrefsTab .active').removeClass('active');
		$('.email-templates-tab').addClass('active');
		// $("#content").html(view.el);
	},

	/**
	 * Creates a Model to show and edit notification preferences.
	 * Reloads the page on save success.
	 */
	notificationPrefs : function()
	{
		$("#content").html(getTemplate("settings"), {});
		var view = new Base_Model_View({ url : 'core/api/notifications', template : 'settings-notification-prefs', reload : true,
			postRenderCallback : function(el)
			{
				head.load(CSS_PATH + 'css/bootstrap_switch.css', LIB_PATH + 'lib/bootstrapSwitch.js', function()
				{
					showSwitchChanges(el);
					check_browser_notification_settings(el);
				});
				try
				{
					$('#notification-switch', el).bootstrapSwitch();
				}
				catch (err)
				{
					console.log(err);
				}

				// plays notification sounds
				notification_play_button()

				// to show notification-switch in safari properly
				if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1)
					$('#notification-switch').parent().css('margin-top', '-32px');
			} });
		$('#prefs-tabs-content').html(view.render().el);
		$('#PrefsTab .active').removeClass('active');
		$('.notification-prefs-tab').addClass('active');
		// $('#content').html(view.render().el);
	},

	/**
	 * Contact us email
	 */
	contactUsEmail : function()
	{
		$("#content").html(getTemplate("help-mail-form", CURRENT_DOMAIN_USER));
	}

});
// Social suites stream and tweets.
var Streams_List_View;

// Scheduled updates.
var Scheduled_Updates_View;

// Stores tweets on scroll down in stream.
var Past_Tweets = [];

// Base-model to display data in Message modal and save in DB.
var Message_Model;

// Object of pubnub.
var Pubnub = null;

/**
 * Creates backbone router to create and access streams of the user.
 */
var SocialSuiteRouter = Backbone.Router.extend({

	routes : {
	// route : function name

	// First function on click of tab
	"social" : "socialsuite",

	// Streams tab with collection
	"streams" : "streams",

	// Scheduled updates on new page
	"scheduledmessages" : "scheduledmessages" },

	/**
	 * On click on social tab this function is called, to initialize social
	 * suite, it will include js files.
	 */
	socialsuite : function()
	{
		initializeSocialSuite();

		// Makes tab active
		$(".active").removeClass("active");
		$("#socialsuitemenu").addClass("active");

		// Gets template to display.
		$('#content').html(getTemplate('socialsuite-show-streams'), {});

		/* Creates pubnub object and channel dedicated for new user or relogin */
		initToPubNub();

		// Display added streams
		this.streams();
	}, // socialsuite end

	/**
	 * This will create collection and store social suite in that, all streams
	 * and tweets are displayed from this function and publish msg to register.
	 * 
	 * Format : Streams_List_View [streamView (tweetListView [tweet] ) ]
	 */
	streams : function(stream)
	{
		$('#content').html(getTemplate('socialsuite-show-streams'), {});

		// Check scheduled updates.
		checkScheduledUpdates();

		if (!Streams_List_View) // Streams not collected from dB
		{
			console.log("Creating Collection First Time.");
			Streams_List_View = new Base_Collection_View({ url : "/core/social", restKey : "stream", templateKey : "socialsuite-streams",
				individual_tag_name : 'div', className : 'app-content container clearfix', id : 'stream_container',

				postRenderCallback : function(el)
				{
					// User have streams so register all of them on server
					registerAll(0);
				} });

			// Creates new default function of collection
			Streams_List_View.appendItem = this.socialSuiteAppendItem;

			Streams_List_View.collection.fetch();

			$('#socialsuite-tabs-content').append(Streams_List_View.render().el);			

			return;
		}// if end
		if (Streams_List_View) // Streams already collected in collection
		{
			console.log("Collection already defined.");

			// New stream to add in collection.
			if (stream)
				Streams_List_View.collection.add(stream);

			$('#socialsuite-tabs-content').append(Streams_List_View.render(true).el);

			// Creates normal time.
			displayTimeAgo($(".chirp-container"));

			// Check for new tweets and show notification.
			showNotification(null);
		}

		// Remove deleted tweet element from ui
		$('.deleted').remove();

		// Remove waiting icon.
		removeWaiting();
	}, // streams end

	/**
	 * Append Model and Collection with Models in Collection.
	 */
	socialSuiteAppendItem : function(base_model)
	{
		console.log("base_model in append.");

		// Stream model in main collection
		var streamView = new Base_List_View({ model : base_model, "view" : "inline", template : this.options.templateKey + "-model", tagName : 'li',
			className : 'column ui-state-default span4 ' + base_model.get("id"), id : base_model.get("id"), name : base_model.get("column_index"), });

		// Tweet collection in stream model
		var tweetListView = new Base_Collection_View({ data : [], templateKey : 'Column', individual_tag_name : 'div', });

		// Comparator to sort tweets in tweet collection
		tweetListView.collection.comparator = function(model)
		{
			if (model.get('id'))
				return -model.get('id');
		};

		// If model has tweets, need to save them, when user change tab from
		// social
		if (base_model.has("tweetListView"))
		{
			tweetListView.collection.add(base_model.get("tweetListView").toJSON());
			tweetListView.collection.sort();
		}

		// Add new tweetList View as collection in stream model
		base_model.set('tweetListView', tweetListView.collection);

		var el = streamView.render().el;
		$('#stream', el).html(tweetListView.render(true).el);
		$('#socialsuite-streams-model-list', this.el).append(el);
	}, // socialSuiteAppendItem end

	/**
	 * On click on scheduled update time button in socialsuite will display
	 * scheduled updates if user have any.
	 */
	scheduledmessages : function()
	{		
		Scheduled_Updates_View = new Base_Collection_View({ url : "/core/scheduledupdate", restKey : "scheduledUpdate",
			templateKey : "socialsuite-scheduled-updates", individual_tag_name : 'tr', postRenderCallback : function(el)
			{
				// Creates normal time.
				displayTimeAgo($(".is-actionable"));
			}});

		Scheduled_Updates_View.collection.fetch();

		$('#content').html(Scheduled_Updates_View.render(true).el);

		// Makes tab active
		$(".active").removeClass("active");
	} // scheduledmessages end
});

// Global variable to call function from Router.
var socialsuitecall = new SocialSuiteRouter();
/**
 * Creates Backbone Router for subscription operations, defines routes for
 * subscribe, updating creditcard/plan, invoice, invoice detailed view
 * 
 * @module Subscription
 * @author Yaswanth
 */
var SubscribeRouter = Backbone.Router.extend({

	routes : {
	/* Subscription page */
	"subscribe" : "subscribe", "subscribe/:id" : "subscribe",

	/* Updating subscription details */
	"updatecard" : "updateCreditCard", "updateplan" : "updatePlan", "purchase-plan" : "purchasePlan",

	/* Invoices */
	"invoice" : "invoice", "invoice/:id" : "invoiceDetails" },

	/**
	 * Shows the subscription details(If subscribed ) of subscription form, this
	 * function also sets account statistics in the subscription page, using
	 * post render callback of the Base_Model_View
	 */
	subscribe : function(id)
	{
		/*
		 * Creates new view with a render callback to setup expiry dates
		 * field(show dropdown of month and year), countries list and respective
		 * states list using countries.js plugin account stats in subscription
		 * page
		 */
		var subscribe_plan = new Base_Model_View({ url : "core/api/subscription", template : "subscribe-new", window : 'subscribe',
		/*
		 * postRenderCallback : function(el) { // Setup account statistics
		 * set_up_account_stats(el); // Load date and year for card expiry
		 * card_expiry(el); // Load countries and respective states
		 * head.js(LIB_PATH + 'lib/countries.js', function() {
		 * print_country($("#country", el)); }); },
		 */
		postRenderCallback : function(el)
		{
			var data = subscribe_plan.model.toJSON();

			// Setup account statistics
			set_up_account_stats(el);

			if (!$.isEmptyObject(data))
			{
				USER_BILLING_PREFS = data;
				USER_CREDIRCARD_DETAILS = subscribe_plan.model.toJSON().billingData;
				console.log(USER_CREDIRCARD_DETAILS);
				element = setPriceTemplete(data.plan.plan_type, el);
			}

			else
				element = setPriceTemplete("free", el);

			// Show Coupon code input field
			id = (id && id == "coupon") ? id : "";
			showCouponCodeContainer(id);

			head.load(CSS_PATH + 'css/jslider.css', CSS_PATH + "css/misc/agile-plan-upgrade.css", LIB_PATH + 'lib/jquery.slider.min.js', function()
			{
				if ($.isEmptyObject(data))
					setPlan("free");
				else
					setPlan(data);
				load_slider(el);
			});
		} });
		$('#content').html(subscribe_plan.render().el);
	},

	/**
	 * Shows forms to updates Credit card details, loads subscription details
	 * from core/api/subscription to deserailize and show credit card details in
	 * to form, so user can change any details if required render callback sets
	 * the countries and states and card expiry, also deserialized the values.
	 * Update credit card details are sent to core/api/subscription, where if
	 * checks update is for credit card or plan
	 */
	updateCreditCard : function()
	{
		var card_details = new Base_Model_View({ url : "core/api/subscription", template : "subscription-card-detail", window : 'purchase-plan',
			postRenderCallback : function(el)
			{

				// Load date and year for card expiry
				card_expiry(el);

				// To deserialize
				var card_detail_form = el.find('form.card_details'), card_data = card_details.model.toJSON().billingData;

				USER_CREDIRCARD_DETAILS = card_data;
				plan_json.customer = JSON.parse(USER_CREDIRCARD_DETAILS);

				// Load countries and respective states
				head.js(LIB_PATH + 'lib/countries.js', function()
				{
					print_country($("#country", el));

					// Deserialize card details
					if (!$.isEmptyObject(card_data))
					{
						// Deserialize method defined in
						// agile_billing.js
						deserialize_card_details(JSON.parse(card_data), $(card_detail_form));
					}
				});

			} });

		$('#content').html(card_details.render().el);
	},

	/**
	 * Shows form the update plan, uses the same url used to create new
	 * subscription/update credit card of plan, deserializes the current plan
	 */
	updatePlan : function()
	{
		var update_plan = new Base_Model_View({ url : "core/api/subscription", template : "update-plan",  
			
			saveCallback : function(){
				window.navigate("subscribe", { trigger : true });
				showNotyPopUp("information", "You have been upgraded successfully. Please logout and login again for the new changes to apply.", "top");
			}  
			
		});

		$('#content').html(update_plan.render().el);
	},

	/**
	 * Fetches the invoices and displays as list.
	 */
	invoice : function()
	{
		this.invoice = new Base_Collection_View({ url : "core/api/subscription/invoices", templateKey : "invoice", window : 'subscribe',
			individual_tag_name : 'tr' })

		// Fetches the invoice payments
		this.invoice.collection.fetch();

		$('#content').html(this.invoice.el);
	},

	/**
	 * Displays detailed invoice, when selected from the invoice list
	 */
	invoiceDetails : function(id)
	{

		// Checks whether invoice list is defined, if list is not
		// defined get the list of invoices
		if (!this.invoice || !this.invoice.collection || this.invoice.collection == 0 || this.invoice.collection.get(id) == null)
		{
			this.navigate("invoice", { trigger : true });
			return;
		}

		// Gets invoice item from the collection
		var model = this.invoice.collection.get(id);

		// Displays detailed invoice
		var invoice_details = new Base_Model_View({
		// url: "core/api/subscription/invoice",
		model : model, template : "invoice-detail", window : 'invoice', isNew : true });

		$('#content').html(invoice_details.render().el);
	},

	/**
	 * After selecting plan, page is navigated to purchase plan where user enter
	 * his credit card details. It shows a form with countries and states and
	 * fields to enter credit card details
	 */
	purchasePlan : function()
	{
		// If plan is not defined i.e., reloaded, or plan not chosen properly,
		// then page is navigated back to subcription/ choose plan page
		if (!plan_json.plan)
		{
			this.navigate("subscribe", { trigger : true });

			return;
		}

		var window = this;
		// Plan json is posted along with credit card details
		var plan = plan_json

		var upgrade_plan = new Base_Model_View({ url : "core/api/subscription", template : "purchase-plan", isNew : true, data : plan,
			postRenderCallback : function(el)
			{
				// Discount
				showCouponDiscountAmount(plan_json, el);

				card_expiry(el);
				head.js(LIB_PATH + 'lib/countries.js', function()
				{
					print_country($("#country", el));
				});
			},
			saveCallback : function(data)
			{
				window.navigate("subscribe", { trigger : true });
				showNotyPopUp("information", "You have been upgraded successfully. Please logout and login again for the new changes to apply.", "top");
			}
			
		});

		// Prepend Loading
		$('#content').html(upgrade_plan.render().el);
		$(".active").removeClass("active");
		// $("#fat-menu").addClass("active");
	} });
var VisitorsRouter = Backbone.Router.extend({

routes : { "visitors" : "loadGmap" },

initialize : function()
{

},

loadGmap : function()
{
	head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js', CSS_PATH + "css/misc/date-picker.css",  function()
	{

		var view = new Base_Model_View({ model : new BaseModel(), template : "gmap-html-page",
		// gmap main template id path
		isNew : true, postRenderCallback : function(el)
		{

			try
			{
				if (google.maps)
				{
					gmap_initialize(el);
				}
			}
			catch (err)
			{

				gmap_load_script(el);
			}
		} });

		$('#content').html(view.render().el);
	});

}

});
/**
 * Creates backbone router to access preferences of the user (email templates,
 * email (gmail/IMAP), notifications and etc..).
 */
var WebreportsRouter = Backbone.Router.extend({

	routes : {
	/* Settings */
	"web-rules" : "webrules", "webrules-add" : "web_reports_add", "webrule-edit/:id" : "web_reports_edit",
	"shopify-rule-add" : "shopify_rule_add", "shopify-rule-edit/:id" : "shopify_rule_edit", "shopify/:url" : "shopify", "shopify" : "shopify"
		
	},
	webrules : function()
	{
		$(".active").removeClass("active");
		$("#web-rules-menu").addClass("active");
		this.webrules = new Base_Collection_View({ url : '/core/api/webrule', restKey : "webrule", templateKey : "webrule", individual_tag_name : 'tr' });

		this.webrules.collection.fetch();
		$("#content").html(this.webrules.render().el);
	},
	web_reports_add : function()
	{
		var web_reports_add = new Base_Model_View({ url : 'core/api/webrule', template : "webrules-add", window : "web-rules", isNew : true,
			postRenderCallback : function(el)
			{
				head.js('lib/agile.jquery.chained.min.js', function()
				{

					chainFilters(el, undefined, function()
					{
						chainWebRules(el, undefined, true);
						$("#content").html(el);
					}, true);

				})
			} });

		$("#content").html(LOADING_HTML);
		web_reports_add.render();
	},

	web_reports_edit : function(id)
	{

		// If reports view is not defined, navigates to reports
		if (!this.webrules || !this.webrules.collection || this.webrules.collection.length == 0 || this.webrules.collection.get(id) == null)
		{
			this.navigate("webrules", { trigger : true });
			return;
		}

		var count = 0;

		// Gets a report to edit, from reports collection, based on id
		var webrule = this.webrules.collection.get(id);
		
		// Default template is webrule-add. If rule is of type shopify template is changed accordingly
		var template = "webrules-add";
		if(webrule.get("rule_type") == "SHOPIFY_WEB_RULE")
			template = "shopifyrules-add";
		
		var web_reports_add = new Base_Model_View({ url : 'core/api/webrule', model : webrule, template : template, window : "web-rules",
			postRenderCallback : function(el)
			{
				if (count > 0)
					return;
				head.js('lib/agile.jquery.chained.min.js', function()
				{
					chainFilters(el, webrule.toJSON(), function()
					{
						chainWebRules(el, webrule.toJSON(), false, webrule.toJSON()["actions"]);
						$("#content").html(el);
					}, true);

				})
				count++;
			} });

		$("#content").html(LOADING_HTML);
		web_reports_add.render();
	}, 
	shopify_rule_add : function()
	{
		var web_reports_add = new Base_Model_View({ url : 'core/api/webrule', template : "shopifyrules-add", window : "web-rules", isNew : true,
			postRenderCallback : function(el)
			{
				head.js('lib/agile.jquery.chained.min.js', function()
				{

					chainFilters(el, undefined, function()
					{
						chainWebRules(el, undefined, true);
						$("#content").html(el);
					}, true);

				})
			} });

		$("#content").html(LOADING_HTML);
		web_reports_add.render();
	},
	shopify : function(url)
	{
		_agile.add_property(create_contact_custom_field("Shopify shop", url, "CUSTOM"), function(data)
				{
					addTagAgile("Shopify");
				});
		
		$("#content").html(getTemplate("shopify"), {});
	}
});
/**
 * Creates backbone router to access preferences of the user widgets
 */
var WidgetsRouter = Backbone.Router
	.extend({

	    routes : {

	    "add-widget" : "addWidget",

	    "Linkedin" : "Linkedin", "Linkedin/:id" : "Linkedin",

	    "Twitter" : "Twitter", "Twitter/:id" : "Twitter",

	    "Rapleaf" : "Rapleaf", "Rapleaf/:id" : "Rapleaf",

	    "ClickDesk" : "ClickDesk", "ClickDesk/:id" : "ClickDesk",

	    "HelpScout" : "HelpScout", "HelpScout/:id" : "HelpScout",

	    "Zendesk" : "Zendesk", "Zendesk/:id" : "Zendesk",

	    "Sip" : "Sip", "Sip/:id" : "Sip",

	    "Twilio" : "Twilio", "Twilio/:id" : "Twilio",

	    "FreshBooks" : "FreshBooks", "FreshBooks/:id" : "FreshBooks",

	    "Stripe" : "Stripe", "Stripe/:id" : "Stripe",

	    "Custom-widget" : "Custom", "Custom-widget/:id" : "Custom",

	    "Xero" : "Xero", "Xero/:id" : "Xero",

	    "QuickBooks" : "QuickBooks/:id", "QuickBooks" : "QuickBooks",

	    "google-apps" : "contactSync", "google-apps/contacts" : "google_apps_contacts", "google-apps/calendar" : "google_apps_calendar" },

	    /**
	     * Adds social widgets (twitter, linkedIn and RapLeaf) to a contact
	     */
	    addWidget : function()
	    {
		$("#content").html(getTemplate("settings"), {});
		pickWidget();
	    },

	    /**
	     * Manages Linked in widget
	     */
	    Linkedin : function(id)
	    {
		if (!id)
		{
		    show_set_up_widget("Linkedin", 'linkedin-login',
			    '/scribe?service=linkedin&return_url=' + encodeURIComponent(window.location.href) + "/linkedin");
		}
		else
		{
		    if (!isNaN(parseInt(id)))
		    {
			$
				.getJSON(
					"core/api/widgets/social/profile/" + id,
					function(data)
					{
					    set_up_access(
						    "Linkedin",
						    'linkedin-login',
						    data,
						    '/scribe?service=linkedin&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Linkedin/linkedin"));

					}).error(
					function(data)
					{
					    console.log(data);
					    setUpError("Linkedin", "widget-settings-error", data.responseText,
						    window.location.protocol + "//" + window.location.host + "/#Linkedin/linkedin1");

					});
			return;

		    }

		    $
			    .getJSON(
				    "core/api/widgets/Linkedin",
				    function(data1)
				    {
					console.log(data1);

					if (data1)
					{
					    $
						    .getJSON(
							    "core/api/widgets/social/profile/" + data1.id,
							    function(data)
							    {
								set_up_access(
									"Linkedin",
									'linkedin-login',
									data,
									'/scribe?service=linkedin&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Linkedin/linkedin"),
									data1);

							    })
						    .error(
							    function(data)
							    {

								console.log(data);
								setUpError("Linkedin", "widget-settings-error", data.responseText,
									window.location.protocol + "//" + window.location.host + "/#Linkedin/linkedin1", data1);

							    });
					    return;
					}
					else
					{
					    show_set_up_widget("Linkedin", 'linkedin-login',
						    '/scribe?service=linkedin&return_url=' + encodeURIComponent(window.location.href));
					}
				    });

		}

	    },

	    /**
	     * Manages Twitter widget
	     */
	    Twitter : function(id)
	    {

		if (!id)
		{
		    show_set_up_widget("Twitter", 'twitter-login',
			    '/scribe?service=twitter&return_url=' + encodeURIComponent(window.location.href) + "/twitter");
		}
		else
		{
		    if (!isNaN(parseInt(id)))
		    {
			$
				.getJSON(
					"core/api/widgets/social/profile/" + id,
					function(data)
					{
					    set_up_access(
						    "Twitter",
						    'twitter-login',
						    data,
						    '/scribe?service=twitter&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Twitter/twitter"));

					}).error(
					function(data)
					{

					    console.log(data);
					    setUpError("Twitter", "widget-settings-error", data.responseText,
						    window.location.protocol + "//" + window.location.host + "/#Twitter/twitter1");

					});
			return;

		    }

		    $
			    .getJSON(
				    "core/api/widgets/Twitter",
				    function(data1)
				    {
					console.log(data1);

					if (data1)
					{
					    $
						    .getJSON(
							    "core/api/widgets/social/profile/" + data1.id,
							    function(data)
							    {
								set_up_access(
									"Twitter",
									'twitter-login',
									data,
									'/scribe?service=twitter&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Twitter/twitter"),
									data1);

							    }).error(
							    function(data)
							    {
								setUpError("Twitter", "widget-settings-error", data.responseText,
									window.location.protocol + "//" + window.location.host + "/#Twitter/twitter1", data1);
							    });

					    return;

					}
					else
					{
					    show_set_up_widget("Twitter", 'twitter-login',
						    '/scribe?service=twitter&return_url=' + encodeURIComponent(window.location.href));
					}
				    });

		}

	    },

	    /**
	     * Manages Rapleaf widget
	     */
	    Rapleaf : function(id)
	    {
		if (!id)
		    show_set_up_widget("Rapleaf", 'rapleaf-login');
		else
		    fill_form(id, "Rapleaf", 'rapleaf-login');
	    },

	    /**
	     * Manages Clickdesk widget
	     */
	    ClickDesk : function(id)
	    {
		if (!id)
		    show_set_up_widget("ClickDesk", 'clickdesk-login');
		else
		    fill_form(id, "ClickDesk", 'clickdesk-login');

	    },

	    /**
	     * Manage HelpScout Widget.
	     */
	    HelpScout : function(id)
	    {
		if (!id)
		    show_set_up_widget("HelpScout", "helpscout-login");
		else
		    fill_form(id, "HelpScout", 'helpscout-login')
	    },

	    /**
	     * Manages Zendesk widget
	     */
	    Zendesk : function(id)
	    {
		if (!id)
		    show_set_up_widget("Zendesk", 'zendesk-login');
		else
		    fill_form(id, "Zendesk", 'zendesk-login');

	    },

	    /**
	     * Manages Sip widget
	     */
	    Sip : function(id)
	    {
		if (!id)
		    show_set_up_widget("Sip", 'sip-login');
		else
		    fill_form(id, "Sip", 'sip-login');

	    },

	    /**
	     * Manages Twilio widget
	     */
	    Twilio : function(id)
	    {

		if (!id)
		{
		    show_set_up_widget("Twilio", 'twilio-login', encodeURIComponent(window.location.href) + "/twilio");
		}

		else
		{

		    if (!isNaN(parseInt(id)))
		    {
			$.getJSON(
				"/core/api/widgets/twilio/numbers/" + id,
				function(data)
				{
				    // If data is not defined return
				    if (!data)
					return;

				    set_up_access("Twilio", 'twilio-login', data,
					    encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Twilio/twilio"));

				}).error(
				function(data)
				{
				    // Append the url with the random number in
				    // order to differentiate the same action
				    // performed more than once.
				    var flag = Math.floor((Math.random() * 10) + 1);
				    setUpError("Twilio", "widget-settings-error", data.responseText,
					    window.location.protocol + "//" + window.location.host + "/#Twilio/twilio" + flag);
				});

			return;

		    }

		    $.getJSON("core/api/widgets/Twilio", function(data)
		    {
			console.log(data);

			if (data)
			{
			    console.log(data);
			    $.getJSON("/core/api/widgets/twilio/numbers/" + data.id, function(data1)
			    {
				if (!data1)
				    return;

				set_up_access("Twilio", 'twilio-login', data1, encodeURIComponent(window.location.href), data);

			    }).error(
				    function(data)
				    {
					// Append the url with the random number
					// in order to differentiate the same
					// action performed more than once.
					var flag = Math.floor((Math.random() * 10) + 1);

					setUpError("Twilio", "widget-settings-error", data.responseText,
						window.location.protocol + "//" + window.location.host + "/#Twilio/twilio" + flag, data);
				    });

			    return;

			}
			else
			{
			    show_set_up_widget("Twilio", 'twilio-login', encodeURIComponent(window.location.href) + "/twilio");
			}
		    });

		    // window.location.href = "/#add-widget";
		}

	    },

	    /**
	     * Manages FreshBooks widget
	     */
	    FreshBooks : function(id)
	    {
		if (!id)
		    show_set_up_widget("FreshBooks", 'freshbooks-login');
		else
		    fill_form(id, "FreshBooks", 'freshbooks-login');

	    },

	    /**
	     * Manages Stripe widget
	     */
	    Stripe : function(id)
	    {

		if (!id)
		{
		    show_set_up_widget("Stripe", 'stripe-login', '/scribe?service=stripe&return_url=' + encodeURIComponent(window.location.href) + "/stripe");
		}
		else
		{
		    {
			$
				.getJSON(
					"core/api/custom-fields/type/scope?scope=CONTACT&type=TEXT",
					function(data)
					{
					    set_up_access(
						    "Stripe",
						    'stripe-login',
						    data,
						    '/scribe?service=stripe&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Stripe/stripe"));
					});
			return;

		    }

		    $
			    .getJSON(
				    "core/api/widgets/Stripe",
				    function(data1)
				    {
					console.log(data1);

					if (data1)
					{
					    $
						    .getJSON(
							    "core/api/custom-fields/scope?scope=CONTACT&type=TEXT",
							    function(data)
							    {
								set_up_access(
									"stripe",
									'stripe-login',
									data,
									'/scribe?service=stripe&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Stripe/stripe"),
									data1);
							    });
					    return;

					}
					else
					{
					    show_set_up_widget("Stripe", 'stripe-login',
						    '/scribe?service=stripe&return_url=' + encodeURIComponent(window.location.href));
					}
				    });
		}
	    },

	    /**
	     * Manages Xero widget
	     */

	    Xero : function(id)
	    {
		if (!id)
		    show_set_up_widget("Xero", 'xero-login', '/scribe?service=xero&return_url=' + encodeURIComponent(window.location.href) + "/xero");
		else
		// return;
		{
		    {
			$
				.getJSON(
					"core/api/custom-fields",
					function(data)
					{
					    set_up_access(
						    "Xero",
						    'xero-login',
						    data,
						    '/scribe?service=xero&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Xero/xero"));
					});
			return;

		    }
		    $
			    .getJSON(
				    "core/api/widgets/Xero",
				    function(data1)
				    {
					console.log(data1);

					if (data1)
					{
					    $
						    .getJSON(
							    "core/api/custom-fields",
							    function(data)
							    {
								set_up_access(
									"Xero",
									'xero-login',
									data,
									'/scribe?service=xero&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Xero/xero"),
									data1);
							    });
					    return;

					}
					else
					{
					    show_set_up_widget("Xero", 'xero-login',
						    '/scribe?service=xero&return_url=' + encodeURIComponent(window.location.href));
					}
				    });

		    // fill_form(id, "Xero", 'xero-login');

		}

	    },

	    /**
	     * Manages QuickBooks widget
	     */
	    QuickBooks : function(id)
	    {
		if (!id)
		    show_set_up_widget("QuickBooks", 'quickbooks-login',
			    '/OAuthServlet?service=quickbooks&return_url=' + encodeURIComponent(window.location.href) + "/quickbooks");
		else
		{
		}

	    },

	    /**
	     * Manages widget added by user
	     */
	    Custom : function(id)
	    {

	    },

	    /**
	     * Contact synchronization with Google
	     */
	    contactSync : function()
	    {

		$("#content").html(getTemplate("settings"), {});

		$('#PrefsTab .active').removeClass('active');
		$('.contact-sync-tab').addClass('active');
		// Gets Social Prefs (Same as Linkedin/Twitter) for Gmail

		this.contact_sync_google = new Base_Model_View({ url : 'core/api/contactprefs/google', template : 'admin-settings-import-google-contacts', });

		// Adds header
		$('#prefs-tabs-content').html(
			'<div id="contact-prefs" class="span4"></div><div id="calendar-prefs" class="span4"></div><div id="email-prefs" class="span3"></div>');

		// Adds Gmail Prefs
		$('#contact-prefs').append(this.contact_sync_google.render().el);

		this.calendar_sync_google = new Base_Model_View({ url : 'core/api/calendar-prefs/get', template : 'import-google-calendar', });

		// console.log(getTemplate("import-google-contacts", {}));
		$('#calendar-prefs').append(this.calendar_sync_google.render().el);

		var data = { "service" : "Gmail", "return_url" : encodeURIComponent(window.location.href) };
		var itemView = new Base_Model_View({ url : '/core/api/social-prefs/GMAIL', template : "settings-social-prefs", data : data });
		itemView.model.fetch();

		// Adds Gmail Prefs
		$('#email-prefs').html(itemView.render().el);

		// Gets IMAP Prefs
		/*
		 * var itemView2 = new Base_Model_View({ url : '/core/api/imap',
		 * template : "settings-imap-prefs" }); // Appends IMAP
		 * $('#prefs-tabs-content').append(itemView2.render().el);
		 * $('#PrefsTab .active').removeClass('active');
		 * $('.email-tab').addClass('active');
		 */
	    },

	    google_apps_contacts : function()
	    {

		$("#content").html(getTemplate("settings"), {});

		$('#PrefsTab .active').removeClass('active');
		$('.contact-sync-tab').addClass('active');

		var options = { url : "core/api/contactprefs/GOOGLE", template : "admin-settings-import-google-contacts-setup",
		    postRenderCallback : function(el)
		    {
			console.log(el);
			// App_Settings.setup_google_contacts.model =
			// App_Settings.contact_sync_google.model;
		    } };

		var fetch_prefs = true;
		if (this.contact_sync_google && this.contact_sync_google.model)
		{
		    options["model"] = this.contact_sync_google.model;
		    fetch_prefs = false;
		}
		else
		{
		    this.contact_sync_google = new Base_Model_View({ url : 'core/api/contactprefs/google', template : 'import-google-contacts', });
		}

		this.setup_google_contacts = new Base_Model_View(options);

		if (fetch_prefs)
		{
		    $("#prefs-tabs-content").html(this.setup_google_contacts.render().el);
		    return;
		}
		$("#prefs-tabs-content").html(this.setup_google_contacts.render(true).el);
	    },

	    google_apps_calendar : function()
	    {
		$("#content").html(getTemplate("settings"), {});

		$('#PrefsTab .active').removeClass('active');
		$('.contact-sync-tab').addClass('active');

		var options = {

		url : "core/api/calendar-prefs/get", template : "import-google-calendar-setup" };

		var fetch_prefs = true;
		if (this.calendar_sync_google && this.calendar_sync_google.model)
		{
		    options["model"] = this.calendar_sync_google.model;
		    fetch_prefs = false;
		}

		this.setup_google_calendar = new Base_Model_View(options);

		if (fetch_prefs)
		{
		    $("#prefs-tabs-content").html(this.setup_google_calendar.render().el);
		    return;
		}
		$("#prefs-tabs-content").html(this.setup_google_calendar.render(true).el);
	    }

	});
/**
 * workflows.js is a script file having routes for CRU operations of workflows
 * and triggers.
 * 
 * @module Campaigns
 * 
 */
var WorkflowsRouter = Backbone.Router
		.extend({
			routes : {

			/* workflows */
			"workflows" : "workflows", "workflow-add" : "workflowAdd", "workflow/:id" : "workflowEdit",

			/* workflow templates */
			"workflow-templates" : "workflowTemplates", "workflow-add/:c/:t" : "workflowAddTemplate",

			/* Logs */
			"workflows/logs/:id" : "logsToCampaign",

			/* Campaign Stats */
			"campaign-stats" : "campaignStats", "email-reports/:id" : "emailReports",

			/* Triggers */
			"triggers" : "triggers",

			// Appends campaign-id to show selected campaign-name in add trigger
			// form.
			"trigger-add/:id" : "triggerAdd",

			"trigger-add" : "triggerAdd", "trigger/:id" : "triggerEdit",

			/* Subscribers */
			"workflow/all-subscribers/:id" : "allSubscribers", "workflow/active-subscribers/:id" : "activeSubscribers",
				"workflow/completed-subscribers/:id" : "completedSubscribers", "workflow/removed-subscribers/:id" : "removedSubscribers" },

			/**
			 * Gets workflows list.Sets page-size to 10, so that initially
			 * workflows are 10. Cursor is true, when scrolls down , the
			 * workflows list increases.
			 */
			workflows : function()
			{

				this.workflow_list_view = new Base_Collection_View({ url : '/core/api/workflows', restKey : "workflow", templateKey : "workflows",
					individual_tag_name : 'tr', cursor : true, page_size : 20, postRenderCallback : function(el)
					{

						head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
						{
							$("time.campaign-created-time", el).timeago();

						});

						start_tour(undefined, el);

						// If workflows not empty, show triggers
						if (App_Workflows.workflow_list_view && !(App_Workflows.workflow_list_view.collection.length === 0))
							show_triggers_of_each_workflow(el);

					}, appendItemCallback : function(el)
					{
						$("time.campaign-created-time", el).timeago();

						// Shows triggers to workflows appended on scroll
						show_triggers_of_each_workflow(el);

					} });

				this.workflow_list_view.collection.fetch();

				$('#content').html(this.workflow_list_view.el);

				$(".active").removeClass("active");
				$("#workflowsmenu").addClass("active");
			},

			/**
			 * Saves new workflow.After workflow saved,the page should navigate
			 * to workflows list.
			 */
			workflowAdd : function()
			{
				if (!this.workflow_list_view || !this.workflow_list_view.collection)
				{
					this.navigate("workflows", { trigger : true });
					return;
				}

				/* Reset the designer JSON */
				this.workflow_json = undefined;
				this.workflow_model = undefined;

				$('#content').html(getTemplate('workflow-add', { "is_new" : true }));
				initiate_tour("workflows-add", $('#content'));
			},

			/**
			 * Updates existing workflow. After workflow updated, the page
			 * navigates to workflows list
			 * 
			 * @param id
			 *            Workflow Id
			 */
			workflowEdit : function(id, workflow)
			{

				if (!this.workflow_list_view || this.workflow_list_view.collection.length == 0)
				{
					this.navigate("workflows", { trigger : true });
					return;
				}

				/* Set the designer JSON. This will be deserialized */
				if (workflow)
					this.workflow_model = workflow;
				else
					this.workflow_model = this.workflow_list_view.collection.get(id);

				// Download new one if undefined
				if (this.workflow_model === undefined)
				{
					console.log("Downloading workflow.");

					// get count value from first attribute count
					var total_count = this.workflow_list_view.collection.at(0).attributes.count;

					if (this.workflow_list_view.collection.length !== total_count)
					{
						// if not in the collection, download new one.
						var new_workflow_model = Backbone.Model.extend({ url : '/core/api/workflows/' + id });

						var model = new new_workflow_model();
						model.id = id;

						model.fetch({ success : function(data)
						{
							// Call workflowEdit again if not Empty
							if (!$.isEmptyObject(data.toJSON()))
							{
								App_Workflows.workflowEdit(id, model);
								return;
							}
						} });
					}
				}

				if (this.workflow_model === undefined)
					return;

				this.workflow_json = this.workflow_model.get("rules");

				var el = $(getTemplate('workflow-add', {}));
				$('#content').html(el);

				// Set the name
				$('#workflow-name').val(this.workflow_model.get("name"));

				var unsubscribe = this.workflow_model.get("unsubscribe");

				$('#unsubscribe-tag').val(unsubscribe.tag);
				$('#unsubscribe-action').val(unsubscribe.action);
				$('#unsubscribe-action').trigger('change');
			},

			/**
			 * Fetches various default workflow template jsons such as
			 * newsletter etc and build UI to show various templates to select
			 * workflow template.
			 * 
			 */
			workflowTemplates : function()
			{
				if (!this.workflow_list_view || !this.workflow_list_view.collection)
				{
					this.navigate("workflows", { trigger : true });
					return;
				}

				$('#content').html(getTemplate('workflow-categories', {}));
			},

			/**
			 * Shows constructed workflow that matches with the template_name.
			 * 
			 * @param template_name -
			 *            template name.
			 */
			workflowAddTemplate : function(category, template_name)
			{
				if (!this.workflow_list_view || !this.workflow_list_view.collection)
				{
					this.navigate("workflows", { trigger : true });
					return;
				}

				/* Reset the designer JSON */
				this.workflow_json = undefined;
				this.workflow_model = undefined;

				// Get workflow template based on category and template name
				var workflow_template_model = Backbone.Model.extend({

				url : 'core/api/workflow-templates/' + category + '/' + template_name });

				var model = new workflow_template_model();

				var that = this;

				model.fetch({ success : function(data)
				{
					that.workflow_json = data.toJSON()["rules"];
				} });

				$('#content').html(getTemplate('workflow-add', { "is_new" : true }));

			},

			/**
			 * Gets list of logs with respect to campaign.
			 * 
			 * @param id
			 *            Workflow Id
			 */
			logsToCampaign : function(id)
			{

				if (!this.workflow_list_view || this.workflow_list_view.collection.length == 0)
				{
					this.navigate("workflows", { trigger : true });
					return;
				}

				/* Set the designer JSON. This will be deserialized */
				this.workflow_model = this.workflow_list_view.collection.get(id);
				var workflowName = this.workflow_model.get("name");

				var logsListView = new Base_Collection_View({ url : '/core/api/campaigns/logs/' + id, templateKey : "campaign-logs",
					individual_tag_name : 'tr', sortKey : 'time', descending : true, postRenderCallback : function(el)
					{
						head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
						{
							$("time.log-created-time", el).timeago();
						});

						$('#logs-campaign-name').text(workflowName);
					} });

				logsListView.collection.fetch();
				$('#content').html(logsListView.el);
			},

			/** Gets list of campaign-stats * */
			campaignStats : function()
			{

				// Load Reports Template
				$("#content").html(getTemplate("campaign-stats-chart", {}));

				// Show bar graph for campaign stats
				showBar('/core/api/campaign-stats/stats/', 'campaign-stats-chart', 'Campaigns Comparison', 'Email Stats', null);

				$(".active").removeClass("active");
				$("#workflowsmenu").addClass("active");
			},

			/**
			 * Returns campaign stats graphs data for given campaign-id.
			 * 
			 * @param id -
			 *            workflow id
			 */
			emailReports : function(id)
			{

				if (!this.workflow_list_view || this.workflow_list_view.collection.length == 0)
				{
					this.navigate("workflows", { trigger : true });
					return;
				}

				/* Set the designer JSON. This will be deserialized */
				this.workflow_model = this.workflow_list_view.collection.get(id);
				var workflowName = this.workflow_model.get("name");

				head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js', CSS_PATH + "css/misc/date-picker.css", function()
				{
					// Load Reports Template
					$("#content").html(getTemplate("campaign-email-reports", {}));
					
					// Set the name
					$('#reports-campaign-name').text(workflowName);

					initChartsUI(id);
					
					$("#email-table-reports").html(LOADING_HTML);
					
					$.getJSON('core/api/campaign-stats/email/table-reports/'+ id + getOptions(), function(data){
					
						console.log(data);
						
						// Load Reports Template
						$("#email-table-reports").html(getTemplate("campaign-email-table-reports", data));
			
					});
					
				});
				
				$(".active").removeClass("active");
				$("#workflowsmenu").addClass("active");
			},

			/** Gets list of triggers */
			triggers : function()
			{
				this.triggersCollectionView = new Base_Collection_View({

				url : '/core/api/triggers', restKey : "triggers", templateKey : "triggers", individual_tag_name : 'tr' });

				this.triggersCollectionView.collection.fetch();

				$('#content').html(this.triggersCollectionView.el);

				$(".active").removeClass("active");
				$("#workflowsmenu").addClass("active");
			},

			/**
			 * Saves new trigger. Loads jquery.chained.js to link Conditions and
			 * Value of input field.Fills campaign list using fillSelect
			 * function. When + Add is clicked in workflows, fill with selected
			 * campaign-name
			 */
			triggerAdd : function(campaign_id)
			{
				this.triggerModelview = new Base_Model_View({ url : 'core/api/triggers', template : "trigger-add", isNew : true, window : 'triggers',
				/**
				 * Callback after page rendered.
				 * 
				 * @param el
				 *            el property of Backbone.js
				 */
				postRenderCallback : function(el)
				{

					// Loads jquery.chained.min.js
					head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
					{
						var LHS, RHS;

						// Assigning elements with ids LHS
						// and RHS
						// in trigger-add.html
						LHS = $("#LHS", el);
						RHS = $("#RHS", el);

						// Chaining dependencies of input
						// fields
						// with jquery.chained.js
						RHS.chained(LHS);

					});

					var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";

					// fill the selected campaign-id
					if (campaign_id)
					{
						fillSelect('campaign-select', '/core/api/workflows', 'workflow', function(id)
						{
							$('#campaign-select', el).find('option[value=' + campaign_id + ']').attr('selected', 'selected');
						}, optionsTemplate);

					}
					else
					{
						/**
						 * Fills campaign select with existing Campaigns.
						 * 
						 * @param campaign-select -
						 *            Id of select element of Campaign
						 * @param /core/api/workflows -
						 *            Url to get workflows
						 * @param 'workflow' -
						 *            parse key
						 * @param no-callback -
						 *            No callback
						 * @param optionsTemplate-
						 *            to fill options with workflows
						 */
						fillSelect('campaign-select', '/core/api/workflows', 'workflow', 'no-callback', optionsTemplate);
					}
				},

				saveCallback : function()
				{

					// To get newly added trigger in triggers list
					App_Workflows.triggersCollectionView = undefined;
				}

				});

				var view = this.triggerModelview.render();

				$('#content').html(view.el);
			},

			/**
			 * Updates trigger.
			 * 
			 * @param id -
			 *            trigger id
			 */
			triggerEdit : function(id)
			{

				// Send to triggers if the user refreshes it directly
				if (!this.triggersCollectionView || this.triggersCollectionView.collection.length == 0)
				{
					this.navigate("triggers", { trigger : true });
					return;
				}

				// Gets trigger with respect to id
				var currentTrigger = this.triggersCollectionView.collection.get(id);

				var view = new Base_Model_View({ url : 'core/api/triggers', model : currentTrigger, template : "trigger-add", window : 'triggers',
					postRenderCallback : function(el)
					{

						// Loads jquery.chained.min.js
						head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
						{
							var LHS, RHS;

							LHS = $("#LHS", el);
							RHS = $("#RHS", el);

							// Chaining dependencies of input
							// fields
							// with jquery.chained.js
							RHS.chained(LHS);

						});

						/**
						 * Shows given values when trigger selected
						 */

						// To get the input values
						var type = currentTrigger.toJSON()['type'];

						// Shows the Value field with given value
						$('#trigger-type', el).val(type).attr("selected", "selected").trigger('change');

						// Populate milestones list and make obtained milestone
						// selected.
						if (type === 'DEAL_MILESTONE_IS_CHANGED')
						{

							var trigger_deal_milestone_value = currentTrigger.toJSON()['trigger_deal_milestone'];
							populate_milestones_in_trigger($('form#addTriggerForm', el), 'trigger-deal-milestone', trigger_deal_milestone_value);

						}

						// Calls TagsTypeAhead on focus event.
						if (type == 'TAG_IS_ADDED' || type == 'TAG_IS_DELETED')
							$('.trigger-tags', el).live("focus", function(e)
							{
								e.preventDefault();
								addTagsDefaultTypeahead($('form#addTriggerForm').find('div#RHS'));
							});

						var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";

						/**
						 * Fills campaign select drop down with existing
						 * Campaigns and shows previous option as selected.
						 * 
						 * @param campaign-select -
						 *            Id of select element of Campaign
						 * @param /core/api/workflows -
						 *            Url to get workflows
						 * @param 'workflow' -
						 *            parse key
						 * @param callback-function -
						 *            Shows previous option selected
						 * @param optionsTemplate-
						 *            to fill options with workflows
						 */
						fillSelect('campaign-select', '/core/api/workflows', 'workflow', function fillCampaign()
						{
							var value = currentTrigger.toJSON();
							if (value)
							{
								$('#campaign-select', el).find('option[value=' + value.campaign_id + ']').attr('selected', 'selected');
							}
						}, optionsTemplate);
					},

					saveCallback : function()
					{

						// To get newly added trigger in triggers list
						App_Workflows.triggersCollectionView = undefined;
					}

				});

				var view = view.render();

				$("#content").html(view.el);
			},

			/**
			 * Returns all subscribers including active, completed and removed.
			 * 
			 * @param id -
			 *            workflow id.
			 */
			allSubscribers : function(id)
			{
				if (!this.workflow_list_view || this.workflow_list_view.collection.length == 0)
				{
					this.navigate("workflows", { trigger : true });
					return;
				}

				var all_subscribers_collection = get_campaign_subscribers_collection(id, 'core/api/workflows/all-subscribers/' + id,
						'workflow-other-subscribers');
				all_subscribers_collection.collection.fetch({ success : function(collection)
				{
					if (collection.length === 0)
						fill_subscribers_slate('subscribers-slate', "all-subscribers");
				} });
				$("#content").html(all_subscribers_collection.el);
			},

			/**
			 * Returns list of subscribers having campaignStatus
			 * campaignId-ACTIVE
			 * 
			 * @param id -
			 *            workflow id.
			 */
			activeSubscribers : function(id)
			{
				if (!this.workflow_list_view || this.workflow_list_view.collection.length == 0)
				{
					this.navigate("workflows", { trigger : true });
					return;
				}

				this.active_subscribers_collection = get_campaign_subscribers_collection(id, 'core/api/workflows/active-subscribers/' + id,
						'workflow-active-contacts');

				this.active_subscribers_collection.collection.fetch({ success : function(collection)
				{

					// show pad content
					if (collection.length === 0)
						fill_subscribers_slate('subscribers-slate', "active-subscribers");
				} });

				$("#content").html(this.active_subscribers_collection.el);

			},

			/**
			 * Returns list of completed subscribers of given campaign-id having
			 * campaignStatus campaignId-DONE
			 * 
			 * @param id -
			 *            workflow id.
			 * 
			 */
			completedSubscribers : function(id)
			{

				if (!this.workflow_list_view || this.workflow_list_view.collection.length == 0)
				{
					this.navigate("workflows", { trigger : true });
					return;
				}

				var completed_subscribers_collection = get_campaign_subscribers_collection(id, 'core/api/workflows/completed-subscribers/' + id,
						'workflow-other-subscribers');

				completed_subscribers_collection.collection.fetch({ success : function(collection)
				{

					// show pad content
					if (collection.length === 0)
						fill_subscribers_slate('subscribers-slate', "completed-subscribers");
				} });
				$("#content").html(completed_subscribers_collection.el);
			},

			/**
			 * Returns list of subscribers removed from a campaign.
			 * 
			 * @param id -
			 *            workflow id.
			 */
			removedSubscribers : function(id)
			{
				if (!this.workflow_list_view || this.workflow_list_view.collection.length == 0)
				{
					this.navigate("workflows", { trigger : true });
					return;
				}

				var removed_subscribers_collection = get_campaign_subscribers_collection(id, 'core/api/workflows/removed-subscribers/' + id,
						'workflow-other-subscribers');

				removed_subscribers_collection.collection.fetch({ success : function(collection)
				{

					// show pad content
					if (collection.length === 0)
						fill_subscribers_slate('subscribers-slate', "removed-subscribers");
				} });

				$("#content").html(removed_subscribers_collection.el);
			} });
Backbone.View.prototype.close = function()
{
	this.remove();
	this.unbind();
	if (this.onClose)
	{
		this.onClose();
	}
}

var BaseModel = Backbone.Model.extend({});

/**
 * Defines a backbone collection, which sorts the collection based on the
 * sortkey and parses based on the restKey
 */
var BaseCollection = Backbone.Collection.extend({ model : BaseModel,
/*
 * Initializes the collection sets restKey and sortKey
 */
initialize : function(models, options)
{
	this.restKey = options.restKey;
	if (options.sortKey)
		this.sortKey = options.sortKey;
	if (options.descending)
		this.descending = options.descending;

	// Set false if sorting is not required. Used when order returned
	// from server is to be preserved.
	this.sort_collection = options.sort_collection;
	if (this.sort_collection == false)
		this.comparator = false;
},
/*
 * Sorts the order of the collection based on the sortKey. When models are
 * fetched then comparator gets the value of the softKey in the model and sorts
 * according to it
 */
comparator : function(item)
{
	if (this.sortKey)
	{
		if (this.descending == true)
			return -item.get(this.sortKey);
		// console.log("Sorting on " + this.sortKey);
		return item.get(this.sortKey);
	}
	return item.get('id');
},
/*
 * Gets the corresponding objects based on the key from the response object
 */
parse : function(response)
{
	// console.log("parsing " + this.restKey + " " +
	// response[this.restKey]);

	if (response && response[this.restKey])
		return response[this.restKey];

	return response;
} });

/*
 * Creates an view object on the model, with events click on .delete, .edit,
 * .agile_delete and respective funtionalities are defined and binds to current
 * view.
 */
var Base_List_View = Backbone.View.extend({ events : { "click .delete" : "deleteItem", "click .edit" : "edit", "delete-checked .agile_delete" : "deleteItem",

},
/*
 * Binds events on the model
 */
initialize : function()
{
	_.bindAll(this, 'render', 'deleteItem', 'edit'); // every function
	// that uses 'this'
	// as the current
	// object should be
	// in here
	this.model.bind("destroy", this.close, this);

	this.model.bind("change", this.render, this);
},
/*
 * On click on ".delete" model representing the view is deleted, and removed
 * from the collection
 */
deleteItem : function()
{
	this.model.destroy();
	this.remove();
}, edit : function(e)
{
	/*
	 * console.log(this.model); console.log("Editing " +
	 * this.model.get("edit_template")); // Edit
	 * if(this.model.get("edit_template")) { console.log("Moving to edit"); var
	 * editView = new Base_Model_View({ model: this.model, isNew: true,
	 * template: this.model.get("edit_template") }); var el =
	 * editView.render().el; $('#content').html(el); }
	 */
}, render : function(callback)
{
	var async = false;
	// if(callback && typeof (callback) == "function")
	// async = true;
	if (async)
	{
		var that = this
		// console.log(this.model.toJSON());
		getTemplate(that.options.template, that.model.toJSON(), undefined, function(el)
		{
			$(that.el).html(el);
			$(that.el).data(that.model);
			console.log($(that.el));
			callback(that.el);
		});
		return this;
	}

	$(this.el).html(getTemplate(this.options.template, this.model.toJSON()));
	$(this.el).data(this.model);
	// Add model as data to it's corresponding row

	return this;
} });

/**
 * Base_Collection_view class defines a Backbone view, which binds the list of
 * models (Collections, backbone collection) i.e, defines view for the
 * collection.
 * <p>
 * Adds view to collection and binds sync (calls every time it attempts to read
 * or save a model to the server),
 * <p>
 * Whenever whenever save model operation is done, appendItem method in the
 * Base_Collection_view class is called on current view, since then sync is
 * binded with appendItem method. It appends the new model created to collection
 * and adds in the view
 * <p>
 * In View initialize function, new collection is created based on the options
 * (url, restkey, sortkey), passed while creating a new view. The collection
 * created in initialize is based on the BaseCollection (in base-colleciton.js),
 * which define the comparator and parse based on the restKey (to parse the
 * response) and sortKey (to sort the collection) passed to Base_Collection_View
 * <p>
 * Options to Base_collection_View are :
 * 
 * <pre>
 * 		resetKey :  Used to parse the response.
 * 		sortKey  : 	Used to sort the collection based in the sortkey value
 * 		url		 :	To fetch the collection and to perform CRUD operations on models 
 * 		cursor 	 :  To initialize the infiniscroll
 * </pre>
 */
var Base_Collection_View = Backbone.View
		.extend({

			/**
			 * Initializes the view, creates an empty BaseCollection and options
			 * restKey, sortKey, url and binds sync, reset, error to collection.
			 * Also checks if the collection in this view needs infiniscroll
			 * (checks for cursor option).
			 */
			initialize : function()
			{
				// Binds functions to view
				_.bindAll(this, 'render', 'appendItem', 'appendItemOnAddEvent', 'buildCollectionUI');

				if (this.options.data)
				{
					// Initializes the collection with restKey and sortkey
					this.collection = new BaseCollection(this.options.data, { restKey : this.options.restKey, sortKey : this.options.sortKey,
						descending : this.options.descending, sort_collection : this.options.sort_collection });
				}
				else
				{
					// Initializes the collection with restKey and sortkey
					this.collection = new BaseCollection([], { restKey : this.options.restKey, sortKey : this.options.sortKey,
						descending : this.options.descending, sort_collection : this.options.sort_collection });
				}

				/*
				 * Sets url to the collection to perform CRUD operations on the
				 * collection
				 */
				this.collection.url = this.options.url;

				this.model_list_template = $('<div class="model-list"></div>');

				/*
				 * Binds appendItem function to sync event of the collection
				 * i.e., Gets called every time it attempts to read or save a
				 * model to the server
				 */
				this.collection.bind('sync', this.appendItem);
				this.collection.bind('add', this.appendItemOnAddEvent);

				var that = this;

				/*
				 * Calls render when collection is reset
				 */
				this.collection.bind('reset', function()
				{
					that.render(true)
				});

				/*
				 * Binds error event to collection, so when error occurs the
				 * render is called with parameters force render and error
				 * response text to show in the template
				 */
				this.collection.bind('error', function(collection, response)
				{
					if (response.status == 401)
					{
						var hash = window.location.hash;

						// Unregister all streams on server.
						unregisterAll();

						// Unregister on SIP server.
						sipUnRegister();

						// Firefox do not support window.location.origin, so
						// protocol is explicitly added to host
						window.location.href = window.location.protocol + "//" + window.location.host + "/login" + hash;
						return;
					}
					that.render(true, response.responseText);
				});

				// Commented as it was creating a ripple effect
				// this.collection.bind('add', function(){that.render(true)});

				/*
				 * Calls render before fetching the collection to show loading
				 * image while collection is being fetched.
				 */
				this.render();

				/*
				 * If cursor options are passed when creating a view then
				 * inifiscroll (infiniscroll.js plug in) is initialized on the
				 * collection
				 */
				if (this.options.cursor)
				{
					/*
					 * If page size is not defined then sets page size to 20.
					 */
					this.page_size = this.options.page_size;
					if (!this.page_size)
						this.page_size = 20;

					/*
					 * stores current view object in temp variable, can be used
					 * to call render in infiniscroll, on successful fetch on
					 * scrolling
					 */
					var that = this;

					/**
					 * Initiazlizes the infiniscroll on the collection created
					 * in the view,
					 */
					this.infiniScroll = new Backbone.InfiniScroll(this.collection, { success : function()
					{
						/*
						 * If fetch is success then render is called, so
						 * addition models fetched in collection are show in the
						 * view
						 */
						$(".scroll-loading", that.el).remove();
					}, untilAttr : 'cursor', param : 'cursor', strict : true, pageSize : this.page_size,

					/*
					 * Shows loading on fetch, at the bottom of the table
					 */
					onFetch : function()
					{
						$("table", that.el).after('<div class="scroll-loading" style="margin-left:50%">' + LOADING_ON_CURSOR + '</div>');
					} });

					/*
					 * Adds infiniscroll objects in to a map with current route
					 * as key, to manage the infiniscroll if view changes i.e.,
					 * to disable infiniscroll on different view if not
					 * necessary.
					 */
					addInfiniScrollToRoute(this.infiniScroll);

					// disposePreviousView(this.options.templateKey +
					// '-collection', this);

					// Store in a variable for us to access in the custom fetch
					// as this is different
					var page_size = this.page_size;

					// Set the URL
					this.collection.fetch = function(options)
					{
						options || (options = {})
						options.data || (options.data = {});
						options.data['page_size'] = page_size;
						return Backbone.Collection.prototype.fetch.call(this, options);
					};

					// this.collection.url = this.collection.url + "?page_size="
					// + this.page_size;
				}

			},
			/**
			 * Takes each model and creates a view for each model using model
			 * template and appends it to model-list, This method is called
			 * whenever a model is added or deleted from the collection, since
			 * this method is binded with sync event of collection
			 * 
			 * @param base_model
			 *            backbone model object
			 */
			appendItem : function(base_model, append)
			{

				// This is required when add event is raised, in that case
				// updating document fragment does not update view. And on the
				// other hand, append item should definitely be called from
				// appendItemOnAddEvent because there are many places where
				// appenditem is overridden and that needs to be called on newly
				// added model
				if (append)
				{
					$(this.model_list_element).append(this.createListView(base_model).render().el);
					return;
				}

				this.model_list_element_fragment.appendChild(this.createListView(base_model).render().el);
			},
			createListView : function(base_model)
			{
				// If modelData is set in options of the view then custom data
				// is added to model.
				if (this.options.modelData)
				{
					// console.log("Adding custom data");
					base_model.set(this.options.modelData);
				}

				/*
				 * Creates Base_List_View i.e., view is created for the model in
				 * the collection.
				 */
				var itemView = new Base_List_View({ model : base_model, template : (this.options.templateKey + '-model'),
					tagName : this.options.individual_tag_name });

				return itemView
			}, appendItemOnAddEvent : function(base_model)
			{
				this.appendItem(base_model, true);
				/*
				 * if(this.collection && this.collection.length) {
				 * if(this.collection.at(0).attributes.count)
				 * this.collection.at(0).attributes.count+=1; }
				 */

				// callback for newly added models
				var appendItemCallback = this.options.appendItemCallback;

				if (appendItemCallback && typeof (appendItemCallback) === "function")
					appendItemCallback($(this.el));

				if ($('table', this.el).hasClass('onlySorting'))
					return;

				append_checkboxes(this.model_list_element);

			},
			/**
			 * Renders the collection to a template specified in options, uses
			 * handlebars to populate collection data in to vew
			 * <p>
			 * To use this render, naming of the handlebars template script tags
			 * should be followed
			 * <p>
			 * 
			 * <pre>
			 * 	template-name + model-list :  To append all the models in to list
			 *  template-name + collection :	appends populated model-list to this template
			 *  template-name + model 	 :  Represent each model which is appended to model-list 
			 * </pre>
			 * 
			 * @param force_render
			 *            boolean forces the render to execute, unless it is
			 *            true view is not show and loading image is shown
			 *            instead
			 */
			render : function(force_render, error_message)
			{

				// If collection in not reset then show loading in the content,
				// once collection is fetched, loading is removed by render and
				// view gets populated with fetched collection.
				if (force_render == undefined)
				{
					$(this.el).html(LOADING_HTML);
					return this;
				}

				// Remove loading
				if ($(this.el).html() == LOADING_HTML)
					$(this.el).empty();

				// If error message is defined the append error message to el
				// and return
				if (error_message)
				{
					$(this.el).html('<div style="padding:10px;font-size:14px"><b>' + error_message + '<b></div>');
					return;
				}

				var _this = this;
				var ui_function = this.buildCollectionUI;
				// Populate template with collection and view element is created
				// with content, is used to fill heading of the table
				getTemplate((this.options.templateKey + '-collection'), this.collection.toJSON(), "yes", ui_function);

				if (this.page_size && (this.collection.length < this.page_size))
				{
					console.log("Disabling infini scroll");
					this.infiniScroll.destroy();
				}

				return this;
			}, buildCollectionUI : function(result)
			{
				$(this.el).html(result);
				// If collection is Empty show some help slate
				if (this.collection.models.length == 0)
				{
					// Add element slate element in collection template send
					// collection template to show slate pad
					fill_slate("slate", this.el);
				}

				// Add row-fluid if user prefs are set to fluid
				if (IS_FLUID)
				{
					$(this.el).find('div.row').removeClass('row').addClass('row-fluid');
				}

				// Used to store all elements as document fragment
				this.model_list_element_fragment = document.createDocumentFragment();

				this.model_list_element = $('#' + this.options.templateKey + '-model-list', $(this.el));

				var fragment = document.createDocumentFragment();

				/*
				 * Iterates through each model in the collection and creates a
				 * view for each model and adds it to model-list
				 */
				_(this.collection.models).each(function(item)
				{ // in case collection is not empty

					this.appendItem(item);
				}, this);

				$(this.model_list_element).append(this.model_list_element_fragment);

				/*
				 * Few operations on the view after rendering the view,
				 * operations like adding some alerts, graphs etc after the view
				 * is rendered, so to perform these operations callback is
				 * provided as option when creating an model.
				 */
				var callback = this.options.postRenderCallback;

				/*
				 * If callback is available for the view, callback functions is
				 * called by sending el(current view html element) as parameters
				 */
				if (callback && typeof (callback) === "function")
				{
					// execute the callback, passing parameters as necessary
					callback($(this.el));
				}

				// Add checkboxes to specified tables by triggering view event
				$('body').trigger('agile_collection_loaded', [
					this.el
				]);

				// $(this.el).trigger('agile_collection_loaded', [this.el]);

				// For the first time fetch, disable Scroll bar if results are
				// lesser

				return this;
			}, });
/**
 * Infini scroll utility to control the scroll on all routes,
 * Called from base-collection when page requires infiniscroll function and from app.js when route is initialized
 */

/**
 * Map to store infini scroll object with route name as a key
 */
var INFINI_SCROLL_JSON = {};

/**
 * Adds infini_scroll object to JSON Object with current route as key. Destroys
 * infini scroll if already exists in map and sets new infini scroll object to
 * current route
 * 
 * @param inifni_scroll
 *            infiniscroll object
 */
function addInfiniScrollToRoute(infini_scroll) {
	var current_route = window.location.hash.split("#")[1];

	// Destroys infini scroll
	if (INFINI_SCROLL_JSON[current_route])
		INFINI_SCROLL_JSON[current_route].destroy();

	// Sets new infini scroll object w.r.t current route
	INFINI_SCROLL_JSON[current_route] = infini_scroll;
}

// Activates infiniScroll for routes
/**
 * Activates infiniScroll for current route(if required) and disables scroll in
 * other routes, to solve unnecessary requests on scroll. This method is called
 * when routes are initialized
 */
function activateInfiniScroll() {

	// Gets the current route from the url of the browser, splits at "#" (
	// current route is after "#" ).
	var current_route = window.location.hash.split("#")[1];

	// Disables all infini scrolls in the map
	$.each(INFINI_SCROLL_JSON, function(key, value) {
		value.disableFetch();
	});

	// Enables fetch if current route exists in INFINI_SCROLL_JSON map
	if (INFINI_SCROLL_JSON[current_route])
		INFINI_SCROLL_JSON[current_route].enableFetch();
}/* !JSCore */
/**
 * Base_Model_View represents view specified by backbone js
 * (http://backbonejs.org/#View), It is view backed by a models, Base_Model_View
 * binds events(click on ".save" and ".delete" html elements) which represents
 * view with logical actions i.e., actions can defined to perform on an event.
 * This binds a view backbone model to view's render function on change event of
 * model, model data is show in the view (used handlebars js to fill model data
 * to template), whenever there is a change in model data, view is updated with
 * new data, since change on model is binded to render function of the view.
 * <p>
 * While creating new Base_Model_View options can be passed, so view is
 * initialized based on the options. Options processed are
 * <p>
 * data : Data should be sent in JSON format (backbone model is created based on
 * data sent).
 * <p>
 * <p>
 * model : Backbone model should be sent.
 * <p>
 * <p>
 * url : Represents url property of the model.
 * <p>
 * <p>
 * isNew : To specify model model needs to be downloaded or not.
 * <p>
 * <p>
 * Window : Specifies which window to navigate after saving the form
 * <p>
 * <p>
 * reload : Boolean value, to specify whether to reload the page after save
 * <p>
 * $el represents the html element of view
 * </p>
 */
var Base_Model_View = Backbone.View
		.extend({

			/*
			 * Events defined on the view and related function(defines action to
			 * be performed on event). ".save" and ".delete" represents html
			 * elements in current view
			 */
			events : {
				"click .save" : "save",
				"click .delete" : "deleteItem"
			},

			/**
			 * Sets options to view object(this.options), these options are
			 * passed when creating a view, in initialize function options are
			 * set to current view object. Also binds functions and model data
			 * to views.
			 */
			initialize : function() {
				/*
				 * Binds functions to current view object, every function that
				 * uses current view "this" should be bind to view
				 * object("this").
				 */
				_.bindAll(this, 'render', 'save', 'deleteItem', 'buildModelViewUI');

				/*
				 * If data is passed as an option to create a view, then
				 * backbone model object is created with data sent, data is
				 * represented as backbone model and bind to view.
				 */
				if (this.options.data != undefined)
					this.model = new Backbone.Model(this.options.data);
				/*
				 * If backbone model is passed as option the model is set to
				 * view
				 */
				else if (this.options.model)
					this.model = this.options.model;
				else
					this.model = new Backbone.Model({});

				/*
				 * Binds render function to change event on the view object
				 * which includes model object, whenever model is changed render
				 * is called to update the view.
				 */
				this.model.bind("change", this.onChange, this);
				
				this.model.bind('error', function(model, response){

					if(response.status == 401)
					{
						var hash = window.location.hash;

						// Unregister all streams on server.
						unregisterAll();
						
						// Unregister on SIP server.
						sipUnRegister();
						
						// Firefox do not support window.location.origin, so protocol is explicitly added to host
						window.location.href = window.location.protocol + "//" + window.location.host+"/login"+hash;
						return;
					}
				});

				/*
				 * Sets URL to backbone model, if url is passed when creating a
				 * view. URL specified is used to fetch, save the model
				 */
				if (this.options.url) {
					this.model.url = this.options.url;
				}

				/*
				 * If "isNew" in options is true, model is not downloaded. which
				 * represents no model data needs to be shown in the view, but
				 * can be used to save data in url set for model. If isNew is
				 * not true and model is empty data needs to be fetched
				 */
				if ((!this.options.isNew)
						&& $.isEmptyObject(this.model.toJSON())) {
					console.log("to fetch");
					/*
					 * Stores view object in temp variable, to be used in
					 * success back for fetch to call render
					 */
					var that = this;

					/*
					 * Fetches model from the url property set, on success
					 * forces render to execute to show the data fetched in
					 * view.
					 */
					this.model.fetch({
						success : function(data) {
							/*
							 * Used true argument to render (forcing render to
							 * execute and show view.), which represent data is
							 * downloaded from server, If render called out
							 * "true" argument then loading image is show
							 * instead of showing data (because Showing view
							 * without downloading data causes flash effect on
							 * page, since on change in model i.e., data fetched
							 * render is called again)
							 */
							that.render(true);
						}
					});
				}
			},

			/**
			 * Defines action for click event on html element with class
			 * ".delete" in current view object, which sends delete request to
			 * server(to URL set to model in initialize function)
			 */
			deleteItem : function(e) {
				e.preventDefault();
				if(!confirm("Are you sure you want to delete?"))
		    		return;
				/*
				 * Sends delete request, and reloads view on success
				 */
				this.model.destroy({
					success : function(model, response) {
						location.reload(true);
					}
				});
				
			},
			/**
			 * Defines action to be performed for click event on HTML element
			 * with class ".save" in current view/template, this can be used to
			 * save the model data in the view representing a form i.e., saveS
			 * the data in form, to the URL set in model.
			 */
			save : function(e) {
				e.preventDefault();
				
				// Saves tinymce content back to 
				// textarea before form serialization
				trigger_tinymce_save();

				/*
				 * Gets the form id from the view, this.el represents html
				 * element of the view.
				 */
				var formId = $(this.el).find('form').attr('id');
				
				var saveCallback = this.options.saveCallback;
				
				// Represents form element
				var $form = $('#' + formId);
				
				// Returns, if the save button has disabled attribute 
				if($form.find('.save').attr('disabled'))
					return;
				
								
				// Disables save button to prevent multiple click event issues
				disable_save_button($(e.currentTarget));
				
				
				// Represents validations result of the form, and json
				// represents serialized data in the form
				var isValid, json;

				/**
				 * If view contains multiple forms, then data are all the forms
				 * in the view are serialized in to a JSON object, each form
				 * data is added to json object with key name attribute of the
				 * form as follows
				 * 
				 * <pre>
				 * 		{
				 * 			primary : {key:value ....} // Data of form with name &quot;primary&quot;
				 * 			secondary : {key : value} // Data for 2nd for with name secondary
				 * 			key1 : value1 // For forms with out a name, values 
				 * 						  //are set directly in JSON with field name
				 * 		}
				 * </pre>
				 */
				if ($(this.el).find('form').length > 1) {
					// Initialize variable json as a map
					json = {};

					/*
					 * Iterates through the forms in the view (this.el), each
					 * form is validated, if a form is not valid, isValid
					 * variable is set and returned. If form is valid then form
					 * data is serialized, and set in the JSON object with key
					 * as name of the form
					 */
					$.each($(this.el).find('form'),
							function(index, formelement) {

								/*
								 * If any form in multiple forms are not valid
								 * then returns, setting a flag form data is
								 * invalid
								 */
								if (!isValidForm($(formelement))) {
									isValid = false;
									return;
								}

								/*
								 * Form id and Mame of the form is read,
								 * required to serialize and set in JSON
								 */
								var form_id = $(formelement).attr('id');
								var name = $(formelement).attr('name');

								/*
								 * If name of the form is defined, set the
								 * serialized data in to JSON object with form
								 * name as key
								 */
								if (name) {
									json[name] = serializeForm(form_id);
								}
								/*
								 * If form name is not defined the set the
								 * serialized values to json, with filed names
								 * as key for the value
								 */
								else {
									$.each(serializeForm(form_id), function(
											key, value) {
										json[key] = value;
									});
								}
							});
				}

				/*
				 * Check isValid flag for validity(which is set in processing
				 * multiple forms), or checks validity of single form
				 */
				if (isValid == false || !isValidForm($form)) {
					
					// Removes disabled attribute of save button
					enable_save_button($(e.currentTarget));
					
					return;
				}

				// Clears all the fields in the form before saving
				this.model.clear({
					silent : true
				});

				/*
				 * If variable json is not defined i.e., view does not contacts
				 * multiple forms, so read data from single form
				 */
				if (!json)
					json = serializeForm(formId);

				/*
				 * Saves model data, (silent : true} as argument do not trigger
				 * change view so view is not reset.
				 */
				this.model.set(json, {
					silent : true
				});

				var window = this.options.window;
				var reload = this.options.reload;

				// Store Modal Id
				var modal = this.options.modal;

				// Loading while saving
				//$save_info = $('<div style="display:inline-block"><img src="img/1-0.gif" height="15px" width="15px"></img></div>');
				//$(".form-actions", this.el).append($save_info);
				//$save_info.show();

				// Calls save on the model
				this.model
						.save(
								[],
								{
									/*
									 * Wait for the server before setting the
									 * new attributes on the model, to trigger
									 * change
									 */
									wait : true,
									/*
									 * On save success, performs the actions as
									 * specified in the options set when
									 * creating an view
									 */
									success : function(model, response) 
									{	
										// Removes disabled attribute of save button
										enable_save_button($(e.currentTarget));
										
										if (saveCallback && typeof (saveCallback) === "function") {
											console.log(response)
											// execute the callback, passing parameters as necessary
											saveCallback(response);
										}
										// Reload the current page
										if (reload)
											location.reload(true);
										else if (window) 
										{
											/*
											 * If window option is 'back'
											 * navigate to previews page
											 */
											if (window == 'back') history.back(-1);
											
											// Else navigate to page set in
											// window attribute
											else Backbone.history.navigate( window, { trigger : true });
											

											// Reset each element
											$form.each(function() {
												this.reset();
											});

											// Hide modal if enabled
											if (modal) $(modal).modal('hide');
										}
										else {
											/* Hide loading on error
											if($save_info)
												$save_info.hide();

											/*
											 * Appends success message to form
											 * actions block in form, if window
											 * option is not set for view
											 *
											 *
											$save_info = $('<div style="display:inline-block"><small><p class="text-success"><i>Saved Successfully</i></p></small></div>');
											$(".form-actions", this.el).append($save_info);
											$save_info.show().delay(3000).hide(1);	
											*/
										}
									},

									/*
									 * If error occurs in saving a model, error
									 * message in response object is shown in
									 * the form
									 */
									error : function(model, response) {
										
										// Removes disabled attribute of save button
										enable_save_button($(e.currentTarget));
										console.log(response);
										// Hide loading on error
										//$save_info.hide();

										// Show cause of error in saving
										$save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>'
												+ response.responseText
												+ '</i></p></small></div>');

										// Appends error info to form actions
										// block.
										$(".form-actions", this.el).append(
												$save_info);

										// Hides the error message after 3
										// seconds
										if(response.status != 406)
											$save_info.show().delay(3000).hide(1);
									}
								}, { silent : true });
			},
			/**
			 * Render function, renders the view object with the model binded
			 * and show the view with model data filled in it. Render function
			 * shows loading image in the page if model is not download(if
			 * download is required). It is called whenever attributes of the
			 * model are changed, of when fetch is called on the model binded
			 * with current view.
			 * <p>
			 * And there are other cases when render should show to view in
			 * page.
			 * <p>
			 * 
			 * @param isFetched
			 *            Boolean, force render to show the view called with
			 *            'true' when model is download
			 */
			render : function(isFetched) {

				
				
				/**
				 * Renders and returns the html element of view with model data,
				 * few conditions are checked render the view according to
				 * requirement and to avoid unwanted rendering of view.
				 * conditions are
				 * <p>
				 * !this.model.isNew() = model is fetched from the server/ Sent
				 * to edit the model
				 * <p>
				 * <p>
				 * this.options.isNew = If model download form the server is not
				 * required
				 * <p>
				 * <p>
				 * !$.isEmptyObject(this.model.toJSON()) = if model is empty
				 * <p>
				 * isFetched = Force call to execute render(when fetch is
				 * success full render is called successfully)
				 * <p>
				 */
				if (!this.model.isNew() || this.options.isNew
						|| !$.isEmptyObject(this.model.toJSON()) || isFetched) {

					$(this.el).html(LOADING_HTML);
					/*
					 * Uses handlebars js to fill the model data in the template
					 */
					getTemplate(this.options.template, this.model
							.toJSON(), "yes", this.buildModelViewUI);

					
				}
				// Shows loading in the view, if render conditions are
				// satisfied
				else {
					$(this.el).html(LOADING_HTML);
				}

				// Returns view object
				return this;
			}, 
			onChange: function()
			{
				if(this.options.change == false)
					return;
				

				this.render(true);
			}, 
			buildModelViewUI : function(content)
			{
				$(this.el).on('DOMNodeInserted', function(e) {
					//alert("triggered");
					//$('form', this).focus_first();
					$(this).trigger('view_loaded');
				 });
			
				$(this.el).html(content);
				
				/*
				 * Few operations on the view after rendering the view,
				 * operations like adding some alerts, graphs etc after the
				 * view is rendered, so to perform these operations callback
				 * is provided as option when creating an model.
				 */
				var callback = this.options.postRenderCallback;
				
				/*
				 * If callback is available for the view, callback functions
				 * is called by sending el(current view html element) as
				 * parameters
				 */
				if (callback && typeof (callback) === "function") {
					// execute the callback, passing parameters as necessary
					callback($(this.el));
				}

				// If isNew is not true, then serialize the form data
				if (this.options.isNew != true) {
					// If el have more than 1 form de serialize all forms
					if ($(this.el).find('form').length > 1)
						deserializeMultipleForms(this.model.toJSON(), $(
								this.el).find('form'));

					// If el have one form
					else if ($(this.el).find('form').length == 1)
						deserializeForm(this.model.toJSON(), $(this.el)
								.find('form'));
				}
				
				
				
				// Add row-fluid if user prefs are set to fluid
				if (IS_FLUID)
				{
					$(this.el).find('div.row').removeClass('row').addClass(
							'row-fluid');
				}
				
				$(this.el).trigger('agile_model_loaded');
			}
		});

/**
 * Functions Which take JQuery button elements and enable disable them.
 * 
 * Disable by setting original text in data-save-text attribute and adding disabled:disabled attribute,
 * Also set min width to current width so button can't collapse, but can expand if necessary
 * 
 * Enable by reverse of the above
 * 
 * @param elem - jQuery element corresponding to the button.
 */
function disable_save_button(elem)
{
	elem.css('min-width',elem.width()+'px')
		.attr('disabled', 'disabled')
		.attr('data-save-text',elem.html())
		.text('Saving...');
}

/**
 * Enables save button.
 * @param elem
 */
function enable_save_button(elem)
{
	elem.html(elem.attr('data-save-text')).removeAttr('disabled data-save-text');
}
/**
 * email-pic.js contains functions which fetch the picture
 * if its a valid email and get the picture by the email
 * 
 * @module jscore
 */
$(function()
{
	//prevent default focusout of email
	$('#email').live('focusout', function(e)
	{
		e.preventDefault();

		// If length of email is 0, do not display picture
		var val = $("#email").val();
		if (val.length == 0)
		{
			$('#pic').css("display", "none");
			changeProperty();
			return;
		}
		
		// If picture is not null and undefined, display it by given width, else display none
		var pic = getPicByEmail(val, 45);
		if (pic != undefined && pic != null)
		{
			var el = $('<img class="imgholder thumbnail person-img" onload="changeProperty()" style="display: inline;"  src="' + pic + '"></img>');
			$('#pic').html(el).show();
			$("img").error(function()
			{
				$('#pic').css("display", "none");
				changeProperty();
				
			});
		}
	});
});

function getPicByEmail(email, width)
{
	//get picture by email from gravatar.com
	if (email)
	{
		return 'https://secure.gravatar.com/avatar/' + Agile_MD5(email) + '.jpg?s=' + width + '&d=404';
	}
}
/**
 * Loads the "google map API" by appending the url as script to html document
 * body and displays the map (using callback of url) based on the address of the
 * contact. If the google map is already loaded, just displays the map.
 * 
 * Geocoder is used to get the latitude and longitude of the given address
 * 
 * @method show_map
 * @param {object}
 *            el html object of the contact detail view
 * @param {Object}
 *            contact going to be shown in detail
 */
function show_map(el) {
	var contact = App_Contacts.contactDetailView.model.toJSON();
	var address = getPropertyValue(contact.properties, "address");

	// Return, if no address is found 
	if (!address) 
		return;
	
	try
	{
		address = JSON.parse(address);
	}
	catch (err)
	{
		return;
	}
	
	

	// If all the address fields are empty, just return.
	if (!address.address && !address.city && !address.state
			&& !address.country)
		return;

	// If google map is already loaded display the map else load the
	// "google maps api"
	try {
		if (google.maps) {
			display_google_map();
		}
	} catch (err) {

		load_gmap_script();
	}
}

/**
 * Loads "google maps api", by appending the related url (with a callback
 * function to display map) as script element to html document body
 */
function load_gmap_script() {
	
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "https://maps.googleapis.com/maps/api/js?&sensor=false&callback=display_google_map";
	document.body.appendChild(script);
}

/**
 * Displays related map of the given contact address.
 * 
 * Validates the status code returned by the geocoder, if it is ok proceeds
 * further to display the map using latitude and longitude of results object.
 * 
 */
function display_google_map() {

	var contact = App_Contacts.contactDetailView.model.toJSON();
	var address = JSON.parse(getPropertyValue(contact.properties, "address"));

	// Gets the location (latitude and longitude) from the address
	var geocoder = new google.maps.Geocoder();

	// Latitude and longitude were not saved to the contact (chances to update the address)
	
	if(!address.address)address.address="";
	if(!address.city)address.city="";
	if(!address.state)address.state="";
	if(!address.country)address.country="";
	if(!address.zip)address.zip="";
	
	geocoder.geocode({
		'address' : '"' + address.address + ', ' + address.city + ', '
				+ address.state + ', ' + address.country + ', ' + address.zip + '"'
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {

			// Displays map portion
			$("#map").css('display', 'block');
			
			var myOptions = {
				zoom : 8,
				center : results[0].geometry.location,
				mapTypeId : google.maps.MapTypeId.ROADMAP
			}

			var map = new google.maps.Map(document.getElementById("map"),
					myOptions);
			
			var marker = new google.maps.Marker({
				map : map,
				position : results[0].geometry.location
			});
		}
	});
}
/**
 * contactTableView is customized function (customization of appendedItem

 * function in Base_Collection_View), when custom view is selected, this
 * function is called whenever a new contact is added or contact list is fetched
 * (called on each contact model from Base_collection_View render function) .
 * when a custom view is selected then collection view is initialized with
 * modelData option for view is "custom view" object, since model data is custom
 * view object, it includes fields_set which defines the order of the files
 * (first_name, last_name, job title, organization..etc). This function iterates
 * through fields_set in CustomView object and loads the template according to
 * the field (Template are set for each field with name 'contacts-custom-view-' +
 * field name) and creates a view model template which is appended to collection
 * template.
 * 
 * @param base_model
 */
var CURRENT_VIEW_OBJECT;
function contactTableView(base_model) {

	// Creates list view for
	var itemView = new Base_List_View({
		model : base_model,
		template : 'contacts-custom-view-model',
		tagName : this.options.individual_tag_name
	});

	// Reads the modelData (customView object)
	var modelData = this.options.modelData;

	// Reads fields_set from modelData
	var fields = modelData['fields_set'];

	// Converts base_model (contact) in to JSON
	var contact = base_model.toJSON();
	var el = itemView.el;
	// Clears the template, because all the fields are appended, has to be reset
	// for each contact
	// $('#contacts-custom-view-model-template').empty();
	
	// Iterates through, each field name and appends the field according to
	// order of the fields
	$.each(fields, function(index, field_name) {
		if(field_name.indexOf("CUSTOM_") != -1)
		{
			field_name = field_name.split("CUSTOM_")[1]; 			
			var property = getProperty(contact.properties, field_name);
			if(!property)
			{
				$(el).append(getTemplate('contacts-custom-view-custom', {}));
				return;
			}
			
			$(el).append(getTemplate('contacts-custom-view-custom', property));
			return;
		}
		
/*		$('#contacts-custom-view-model-template').append(
				getTemplate('contacts-custom-view-' + field_name, contact));*/
		$(el).append(getTemplate('contacts-custom-view-' + field_name, contact));
	});

	// Appends model to model-list template in collection template
	$(('#contacts-custom-view-model-list'), this.el).append(el);

	// Sets data to tr
	$(('#contacts-custom-view-model-list'), this.el).find('tr:last').data(
			base_model);

}

/**
 * Gets the list of custom fields saved by the user, and shown in the Html
 * element with "view-list" in the Html element sent to this method. It fetches
 * the list of custom fields and on rendering the collection unordered list of
 * created and appended in view-list element in contacts page. If custom view
 * selected from the list, this function is called with button name from the
 * customView function, which is set on the list button.
 * 
 * @param cel
 *            html element
 * @param button_name
 *            name of the button (name of the view)
 */
function setupViews(cel, button_name) {

	// Creates a view for custom views
	
	var customView = new Base_Collection_View({
		url : 'core/api/contact-view',
		restKey : "contactView",
		templateKey : "contact-view",
		individual_tag_name : 'li',
		id : 'view-list',
		postRenderCallback : function(el) {

			// If button_name is defined, then view is selected then the name of
			// the view is show in the custom view button.
			if (button_name)
				$(el).find('.custom_view').append(button_name);
		}
	});

	// Fetches the list of custom fields, and shows is the the contact page
	customView.collection.fetch({
		success : function() {
			$("#view-list", cel).html(customView.el);
			
			if(readCookie('company_filter'))
			{
				$('#contact-view-model-list>li').css('display','none');
				$('#contact-view-model-list>li:first').css('display','list-item');
			}
		}
	})
}

/**
 * Init function to define actions on events on the custom view list
 * 
 */
$(function() {

	/*
	 * If any custom view is selected, sets the cookie saves the id of the
	 * custom view, to show custom view even after refreshing. Also Load the
	 * contacts with custom view by reading the custom view id from the element
	 * which is selected and calls customView function is called to to custom
	 * view of contacts
	 */
	$('.ContactView').die().live('click', function(e) {

				e.preventDefault();
				
				if(App_Contacts.contactViewModel)
					App_Contacts.contactViewModel = undefined;

				if(App_Contacts.contact_custom_view)
					App_Contacts.contact_custom_view = undefined;
				
				// Gets id of the view
				var id = $(this).attr('id');

				// Saves contact_view id as cookie, so on refreshing shows the
				// custom view based on the cookie, and cookie deleted if
				// default view is selected
				createCookie("contact_view", id);

				/*
				 * Even when custom view is selected, have to check if user sets
				 * any filter so custom view should be shown on the filter
				 * results instead of showing view on default contacts, so if
				 * contact_filter cookie is set the sets the url to filter with
				 * filter id from cookie, then results are fetched from custom
				 * views
				 */
				if (filter_id = readCookie('contact_filter')) {
					App_Contacts.customView(id, undefined,
							'core/api/filters/query/' + filter_id);
					return;
				}
				
				if(readCookie('company_filter'))
      			{
					//App_Contacts.customView(readCookie("contact_view"), undefined, "core/api/contacts/companies")
      				App_Contacts.contacts();
					return;
      			}

				// If filter is not set then show view on the default contacts
				// list
				if(!App_Contacts.tag_id)
				{
					App_Contacts.customView(id);
					return;
				}
				
				// If tag filter is applied send tags fetch url and tag_id, which is tobe shown on contacts table.
				App_Contacts.customView(id, undefined, 'core/api/tags/' + App_Contacts.tag_id, App_Contacts.tag_id);
				
			});

	// If default view is selected, contacts are loaded with default view and
	// removes the view cookie set when view is selected
	$('.DefaultView').die().live('click', function(e) {
		e.preventDefault();

		// Erases the cookie
		eraseCookie("contact_view");
		eraseCookie("agile_contact_view");
		
		// Undefines current global view object
		if(App_Contacts.contactViewModel)
		App_Contacts.contactViewModel = undefined;

		if(App_Contacts.contactsListView)
			App_Contacts.contactsListView = undefined;
		
		// If filter is not set then show view on the default contacts
		// list
		if(!App_Contacts.tag_id)
		{
			App_Contacts.contacts();
			return;
		}
		
		// If tag filter is applied send tags fetch url and tag_id, which is tobe shown on contacts table.
		App_Contacts.contacts(App_Contacts.tag_id);

	});
	
	// If grid view is selected, contacts are loaded with grid view and
	// creates the grid view cookie 
	$('.GridView').die().live('click', function(e) {
		e.preventDefault();
		
		// Erases the cookie
		eraseCookie("contact_view");
		// Creates the cookie
		createCookie("agile_contact_view", "grid_view");
		
		if(App_Contacts.contactsListView)
			App_Contacts.contactsListView = undefined;

		// Loads the contacts
		App_Contacts.contacts(undefined, undefined, true);

	});
});
BLOB_KEY = undefined;
$(function()
{

	// Cancels import, removes the contacts uploaded in to
	// table, still calls
	// fileUploadInit,
	// so user can upload again if required
	$('#import-cancel').die().live('click', function(e)
	{

		// Sends empty JSON to remove
		// contact uploaded
		$('#content').html(getTemplate("import-contacts", {}));
	});

	$("#upload_contacts").die().live('click', function(e)
	{
		e.preventDefault();
		var newwindow = window.open("upload-contacts.jsp?id=upload_contacts", 'name', 'height=310,width=500');
		if (window.focus)
		{
			newwindow.focus();
		}
		return false;
	})

	$('#import-contacts')
			.die()
			.live(
					'click',
					function(e)
					{
						
						if($(this).attr('disabled'))
							return;
						
						var upload_valudation_errors = {
							"first_name_missing" : { "error_message" : "First Name is mandatory. Please select first name." },
							"last_name_missing" : { "error_message" : "Last Name is mandatory. Please select last name." },
							"email_missing" : { "error_message" : "Email is mandatory. Please select Email." },
							"first_name_duplicate" : { "error_message" : " You have assigned First Name to more than one element. Please ensure that first name is assigned to only one element. " },
							"last_name_duplicate" : { "error_message" : "You have assigned Last Name to more than one element. Please ensure that last name is assigned to only one element." },
							"company_duplicate" : { "error_message" : "You have assigned Company to more than one element. Please ensure that company is assigned to only one element." },
							"job_title_duplicate" : { "error_message" : "You have assigned job description to more than one element. Please ensure that job description is assigned to only one element." } }

						var models = [];

						// Hide the alerts
						$(".import_contact_error").hide();

						// Headings validation Rammohan: 10-09-12
						/*
						 * Reads all the table heading set after importing
						 * contacts list from CSV and ensures that first_name
						 * and last_name fields are set, which are mandatory
						 * fields. Checks if duplicate table headings are set.
						 * If validations failed the error alerts a explaining
						 * the cause are shown
						 */

						var fist_name_count = 0, last_name_count = 0, emails_count = 0, company_count = 0, job_title_count = 0;
						$(".import-select").each(function(index, element)
						{
							var value = $(element).val()
							if (value == "properties_first_name")
								fist_name_count += 1;
							else if (value == "properties_last_name")
								last_name_count += 1;
							else if (value == "properties_company")
								company_count += 0;
							else if (value.indexOf("-email") != -1)
								emails_count += 1;
							else if (value == "properties_title")
								job_title_count += 1;
						})

						if (fist_name_count == 0)
						{
							$("#import-validation-error").html(getTemplate("import-contacts-validation-message", upload_valudation_errors.first_name_missing));
							return false;
						}
						else if (emails_count == 0)
						{
							$("#import-validation-error").html(getTemplate("import-contacts-validation-message", upload_valudation_errors.email_missing));
							return false;
						}
						/*
						 * else if(lastNameCount.length == 0) {
						 * $("#import-validation-error").html(getTemplate("import-contacts-validation-message",
						 * upload_valudation_errors.last_name_missing)); return
						 * false; }
						 */
						else if (fist_name_count > 1)
						{
							$("#import-validation-error")
									.html(getTemplate("import-contacts-validation-message", upload_valudation_errors.first_name_duplicate));
							return false;
						}
						else if (last_name_count > 1)
						{
							$("#import-validation-error").html(getTemplate("import-contacts-validation-message", upload_valudation_errors.last_name_duplicate));
							return false;
						}
						else if (company_count > 1)
						{
							$("#import-validation-error").html(getTemplate("import-contacts-validation-message", upload_valudation_errors.company_duplicate));
							return false;
						}
						else if (job_title_count > 1)
						{
							$("#import-validation-error").html(getTemplate("import-contacts-validation-message", upload_valudation_errors.job_title_duplicate));
							return false;
						}
						
						$(this).attr('disabled', true);

						/*
						 * After validation checks are passed then loading is
						 * shown
						 */
						$waiting = $('<div style="display:inline-block;padding-left:5px"><small><p class="text-success"><i><span id="status-message">Please wait</span></i></p></small></div>');
						$waiting.insertAfter($('#import-cancel'));

						var properties = [];

						/*
						 * Iterates through all tbody tr's and reads the table
						 * heading from the table, push the table name as
						 * property name and value as property value as
						 * ContactField properties.
						 */
						var model = {};

						// Add Tags
						var tags = get_tags('import-contact-tags');
						console.log(tags)
						if (tags != undefined)
						{
							$.each(tags[0].value, function(index, value)
							{
								if (!model.tags)
									model.tags = [];

								console.log(model);

								model.tags.push(value);
							});
						}

						$('td.import-contact-fields').each(function(index, element)
						{

							console.log(this);
							console.log(index);
							// Empty property map (Represents
							// ContactField in contact.java)

							var property = {};

							// Read the name of the property from
							// table heading
							var select = $(this).find('select');
							console.log(select);
							var name = $(select).val();
							var type = $(select).find(":selected").attr('class') == 'CUSTOM' ? 'CUSTOM' : 'SYSTEM';
							console.log("name :" + name +", type" + type);

							if (name.indexOf("properties_") != -1)
							{
								name = name.split("properties_")[1];
								property["type"] = type;
								if(name.indexOf('address-') != -1)
								{
									var splits = name.split("-");
									name = "address";
									property["subtype"] = "home";
									property["type"] = type;
									console.log(splits);
									// Set the value and name fields
									property["value"] = splits[1];
								}
								
								// Reads the sub type of the fields
								else if (name.indexOf("-") != -1)
								{
									var splits = name.split("-");
									name = splits[1];
									var subType = splits[0];
									property["subtype"] = subType;
									console.log($(select).attr('class'));
									property["type"] = type;
								}
								
								
								// Set the value and name fields
								if(!property["value"])
								property["value"] = name;
								
								property["name"] = name;
								console.log(property);
								if (name.indexOf("_ignore_") != -1)
									property = {};
							}
							else
							{
								property["name"] = name;
							}

							// Push in to properties array (represents
							// ContactField array)
							properties.push(property);

						});

						model.properties = properties;
						model.type = "PERSON";

						// Shows Updating
						$waiting.find('#status-message').html(LOADING_HTML);

						// Represents prototype of contact, which specifies the
						// order of properties
						var contact = model;

						console.log(contact);

						// Sends request to save the contacts uploaded from csv,
						// present in the blobstore. Contact is sent to save
						// each row in csv file in to a contact
						$.ajax({ type : 'POST', url : "/core/api/upload/save?key=" + BLOB_KEY, data : JSON.stringify(contact),
							contentType : "application/json", success : function(data)
							{								
									// Navigate to contacts page
									// Sends empty JSON to remove
									// contact uploaded
									$('#content').html(getTemplate("import-contacts", {}));
									showNotyPopUp('information', "Contacts are now being imported. You will be notified on email when it is done", "top", 5000);

									addTagAgile(IMPORT_TAG);
								// Calls vefiryUploadStatus with data returned
								// from the url i.e., key of the memcache
								// verifyUploadStatus(data);
							}, });

					})
});

/**
 * Receives blobkey from the CSV upload popup after storing in blobstore, and
 * request is set to process the CSV and return first 10 contacts where user can
 * set the fields
 * 
 * @param key
 */
function parseCSV(key)
{

	BLOB_KEY = key;
	$("#upload_contacts").after(LOADING_HTML);
	$.getJSON('core/api/upload/process?blob-key=' + key, function(data)
	{
		console.log(data);
		if (data == undefined)
			return;
		constructCustomfieldOptions(function(fields, el)
		{
			/*
			 * $('#custom_fields', template).each(function(index, element) {
			 * $(element).html(el); });
			 */
			data["custom_fields"] = fields.toJSON();
			var template = $(getTemplate("import-contacts-2", data));

			$('#content').html(template);
			setup_tags_typeahead();
		})

	}).error(function(response)
	{
		// Show cause of error in saving
		$save_info = $('<div style="display:inline-block;margin-left:5px"><small><p style="color:#B94A48; font-size:14px"><i>'
				+ response.responseText
				+ '</i></p></small></div>');

		$(".loading").remove();
		// block.
		$("#upload_contacts").after($save_info);

		// Hides the error message after 3
		// seconds
		$save_info.show().delay(3500).hide(1);
	})
}

/**
 * Loads custom fields available and creates options
 * 
 * @param callback
 */
function constructCustomfieldOptions(callback)
{

	var custom_fields = Backbone.Collection.extend({ url : 'core/api/custom-fields' });

	new custom_fields().fetch({ success : function(data)
	{
		var el = "";
		$.each(data.toJSON(), function(index, field)
		{
			el = el + '<option value ="' + field.field_label + '" id="' + field.field_type + '">' + field.field_label + '</option>'
		})
		if (callback && typeof (callback) === "function")
			callback(data, el);
	} });

}
/**
 * custom-field.js is a script file to deal with the UI of the custom fields,
 * and also contains a function which adds custom_fields attribute to the
 * desired entity with all the custom fields as values.
 * 
 * @module Custom fields
 * 
 * author: Yaswanth
 */
$(function() {
	/**
	 * Loads the respective modal (Text or Date or List or Check-box modal) based
	 * on the id attribute of the clicked link to save the custom fields.
	 */
	$(".fieldmodal").die().live('click', function(event) {
		event.preventDefault();
		var type = $(this).attr("type");
		
		showCustomFieldModel({"scope" : type});
		
	});
	
	$("#custom-field-type").die().live("change", function(e){
		e.preventDefault();
		var value = $(this).val();
		if(value == "LIST")
		{
			$("#custom-field-data").hide();
			$("input",  $("#custom-field-data")).removeAttr("name");
			$("#custom-field-list-values").show();
			$("input",  $("#custom-field-list-values")).attr("name", "field_data");
		}
		else if(value == "TEXTAREA")
		{
			$("#custom-field-data").show();
			$("input",  $("#custom-field-data")).attr("name", "field_data");
			$("#custom-field-list-values").hide();
			$("input",  $("#custom-field-list-values")).removeAttr("name");
		}
		else
		{
			$("#custom-field-data").hide();
			$("#custom-field-list-values").hide();
		}
		
	})
	
	$('#admin-settings-customfields-model-list > tr > td:not(":first-child")').live('click', function(e) {
		e.preventDefault();
		var custom_field = $(this).closest('tr').data();
		console.log(custom_field);
		showCustomFieldModel(custom_field.toJSON());
	});
});

function showCustomFieldModel(data)
{
	var isNew = false;
	isNew = !data.id;
	// Creating model for bootstrap-modal
	var modelView = new Base_Model_View({
		url : '/core/api/custom-fields',
		template : 'custom-field-add-modal',
	//	window : 'custom-fields',
		data : data,
		//reload : true,
		modal : "#custom-field-add-modal",
		isNew : isNew,
		postRenderCallback : function(el) {
			$('.modal-backdrop').remove();	
			console.log($("#custom-field-add-modal", el));
			
			$("#custom-field-add-modal", el).modal('show');
		},
		saveCallback : function(model)
		{
			console.log(model);
			var custom_field_model_json = App_Admin_Settings.customFieldsListView.collection.get(model.id);
			
			if(custom_field_model_json)
			{
				//App_Admin_Settings.customFieldsListView.collection.remove(custom_field_model_json);
				custom_field_model_json.set(new BaseModel(model),{silent:true});
				App_Admin_Settings.customFieldsListView.render(true);
			}
			
			else
			{
				
				App_Admin_Settings.customFieldsListView.collection.add(model);
				if(App_Admin_Settings.customFieldsListView.collection.length == 1)
					App_Admin_Settings.customFieldsListView.render(true);
			}
			$('.modal-backdrop').remove();	
			$("#custom-field-add-modal").modal('hide');
			$("#custom-field-add-modal").modal('hide');
		}
	});

	$('#custom-field-modal').html(modelView.render(true).el);
	$("#custom-field-type").trigger("change");
}

/**
 * Adds custom fields to the the desired entity and then calls the callback to
 * update the custom fields to that entity.
 * 
 * @method add_custom_fields_to_form
 * @param context
 *            entity to fill up with the custom fields
 * @param callback
 *            will be called with the modified entity as parameter, when it is a
 *            function
 * 
 */
function add_custom_fields_to_form(context, callback, scope) {

	
	if(scope == undefined || scope == "CONTACT")
		$("#content").html(LOADING_HTML);
	var url = "core/api/custom-fields/scope?scope=" + (scope == undefined ? "CONTACT" : scope);
	var custom_fields = Backbone.Model.extend({
		url : url
	});

	new custom_fields().fetch({
		success : function(custom_field_data) {

			var custom_fields_list = [];

			$.each(custom_field_data.toJSON(), function(index, value) {
				custom_fields_list.push(value);
			});

			// var contact = contact.toJSON();

			context['custom_fields'] = custom_fields_list;

			if (callback && typeof (callback) === "function") {

				// execute the callback, passing parameters as necessary
				callback(context);
			}

		}
	});

}

/**
 * Called from handlebars
 * Generates suitable html string for each custom field entity depending upon it's type 
 * and does concatenation. For example, if the type of the field is list then a 'select drop down' 
 * is generated. Similarly, html strings are generated based on other filed types.
 * If the custom field has the attribute is_required as true, then it's associated html
 * string also contains the "required" class. 
 * 
 * @method show_custom_fields_helper
 * @param custom_fields
 * @param properties
 * @returns {String}
 */
function show_custom_fields_helper(custom_fields, properties){
	var el = "";
	
	// Text as default
	var field_type = "text"
		
	// Create Field for each custom field  to insert into the desired form 
	$.each(custom_fields, function(index, field)
	{
		if(!field.field_type)
			return;
		// If field type is list create a select dropdown
		if(field.field_type.toLowerCase() == "list")
		{
			var list_values = [],list_options = '<option value="">Select</option>';
			
			// Split values at ";" to separate values of field_data (list options)
			if(field.field_data)
					list_values = field.field_data.split(";");
				
				// Create options based on list values
				$.each(list_values,function(index, value){
					if(value != "")
						list_options = list_options.concat('<option value="'+value+'">'+value+'</option>');
				});
				
				// Create select drop down by checking it's required nature
				if(field.is_required)
					el = el.concat('<div class="control-group">	<label class="control-label">'
									+field.field_label
									+' <span class="field_req">*</span></label><div class="controls"><select class="'
									+field.field_type.toLowerCase()
									+' custom_field required" id='
									+field.id
									+' name="'
									+field.field_label
									+'">'
									+list_options
									+'</select></div></div>');
				else
					el = el.concat('<div class="control-group">	<label class="control-label">'
									+field.field_label
									+'</label><div class="controls"><select class="'
									+field.field_type.toLowerCase()
									+' custom_field" id='
									+field.id
									+' name="'
									+field.field_label+'">'
									+list_options+'</select></div></div>');
				
			return;
		}
		else if(field.field_type.toLowerCase() == "checkbox")
			{
				field_type = "checkbox";
				if(field.is_required)
					el = el.concat('<div class="control-group">	<label class="control-label">'
								+field.field_label
								+' <span class="field_req">*</span></label><div class="controls"><input type="'
								+field_type
								+'" class="'
								+field.field_type.toLowerCase()
								+'_input custom_field required" id='
								+field.id+' name="'
								+field.field_label
								+'"></div></div>');
				else
					el = el.concat('<div class="control-group">	<label class="control-label">'
								+field.field_label
								+'</label><div class="controls"><input type="'
								+field_type
								+'" class="'
								+field.field_type.toLowerCase()
								+'_input custom_field" id='
								+field.id+' name="'
								+field.field_label
								+'"></div></div>');
				return;
			}
		else if(field.field_type.toLowerCase() == "textarea")
		{
			field_type = "textarea";
			var rows = 3;
			
			if(field.field_data)
				rows = parseInt(field.field_data);
				
			if(field.is_required)
				el = el.concat('<div class="control-group">	<label class="control-label">'
							+field.field_label
							+' <span class="field_req">*</span></label><div class="controls"><textarea style="max-width:420px;" rows="'
							+rows+'" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field required" id='
							+field.id+' name="'
							+field.field_label
							+'"></textarea></div></div>');
			else
				el = el.concat('<div class="control-group">	<label class="control-label">'
							+field.field_label
							+'</label><div class="controls"><textarea style="max-width:420px;" rows="'
							+rows+'" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field" id='
							+field.id+' name="'
							+field.field_label
							+'"></textarea></div></div>');
			return;
		}
		
		// If the field is not of type list or checkbox, create text field (plain text field or date field)
		if(field.is_required)
			el = el.concat('<div class="control-group">	<label class="control-label">'
							+field.field_label
							+' <span class="field_req">*</span></label><div class="controls"><input type="text" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field required" id='
							+field.id+' name="'+field.field_label
							+'"></div></div>');
		else
			el = el.concat('<div class="control-group">	<label class="control-label">'
							+field.field_label
							+'</label><div class="controls"><input type="text" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field" id='
							+field.id+' name="'
							+field.field_label
							+'"></div></div>');
	});

	return el;
}

/**
 * De-serializes custom fields (fills the matched custom field values of the entity 
 * (for list and check-box fields) to the generated html string above) and return 
 * string to handlebars register helper to return as handlebars safestring.
 * 
 * @method fill_custom_field_values
 * @param {String} form 
 * 				html string of custom field values
 * @param {Object} content json object including custom fields
 * @returns {String} prefilled html string with matched custom field values
 */
function fill_custom_field_values(form, content)
{
	console.log(content);
	$.each(content, function(index , property){
		if(property.type == "CUSTOM")
			{
				fill_custom_data(property, form);
			}
			
	});
	return $('<div>').append(form).html();
}

function fill_custom_fields_values_generic(form, content)
{
	$.each(content, function(index , property){
		fill_custom_data(property, form);
	});
	
	return $('<div>').append(form).html();
}

function fill_custom_data(property, form)
{
	var element = $(form).find('*[name="' + property.name + '"]');
	console.log(element);
	// If custom field is deleted or not found with property name return
	if(!element[0])
		{
			return;
		}
	console.log($(element[0]).hasClass("date_input"))
		var tagName = element[0].tagName.toLowerCase();
		var type = element.attr("type");
		 console.log(property.value)
		 console.log($(element[0]));
	if(tagName == "input")
		{
			if(type == "checkbox" && property.value == "on")
				{
					element.attr("checked", "checked"); 
					return;
				}
			else if($(element[0]).hasClass("date_input"))
				{
				try {
					element.attr("value", new Date(property.value * 1000)
							.format('mm/dd/yyyy'));
					return;
				} catch (err) {

				}
				}
			
			element.attr("value", property.value);
			console.log(element.val());
		}
	if(tagName == "textarea")
		{
			element.html(property.value);							
		}
	if(tagName == "select")
		{
			if(property.value)
			element.find('option[value="'+property.value.trim()+'"]').attr("selected", "selected");
		}	
}

function serialize_custom_fields(form)
{
	var custom_field_elements =  $("#" + form).find('.custom_field');
	
	console.log(custom_field_elements.length);
   var arr = [];
    $.each(custom_field_elements, function(index, element){
    	console.log($(element));
    	name = $(element).attr('name');
    	
    	var json = {};
    	json["name"] = name;
        json["value"] = $(element).val();
        console.log(json);
        arr.push(json);
    });
   return arr;
}$(function()
{
	$("#import_salesforce").die().live('click', function(e)
			{
				e.preventDefault();
				var newwindow = window.open("import_salesforce.jsp?id=import_from_salesforce", 'name', 'height=420,width=500');
				if (window.focus)
				{
					newwindow.focus();
				}
				return false;
			})

});/**
 * Defines actions on events on imports contacts element, which does validation
 * on the import template, whether contact have first_name last_name which are
 * mandatory fields. If first naRme and last name are not specified or specified
 * same label for different fields then error message is shown and will not send
 * request to save.
 */
$(function()
{

	$('#google-import').die().live('click', function(e)
	{

		
		// URL to return, after fetching token and secret key from LinkedIn
		var callbackURL = window.location.href + "/contacts";
		console.log(callbackURL);

		// For every request of import, it will ask to grant access
		window.location = "/scribe?service=google&return_url=" + encodeURIComponent(callbackURL);

		// this code is used, if once permission is granted, we refresh the
		// tokens and import without asking for permission again and again
		
		// $.getJSON("/core/api/contactprefs/google", function(data)
		// {
		//		
		// console.log(data);
		// if (!data)
		// {
		// $("#google-delete-import").hide();
		// window.location = "/scribe?service=google&return_url=" +
		// encodeURIComponent(callbackURL);
		// return;
		// }
		//					
		// var url = '/scribe?service_type=google';
		// $("#google-delete-import").show();
		//		
		// $.post(url, function(data)
		// {
		// console.log("in success");
		// }).error(function(data)
		// {
		// console.log(data.responseText);
		// });
		//		
		// }).error(function(data)
		// {
		//					
		// });

	});
	
	$("#google-import-prefs-delete").die().live("click", function(e){
		e.preventDefault();
		var disabled = $(this).attr("disabled");
		if(disabled)
			return;
		
		$(this).attr("disabled", "disabled");
		
		$(this).after(LOADING_HTML);
		
		console.log(App_Widgets.contact_sync_google.model.destroy({success : function(){
			App_Widgets.contact_sync_google.model.clear();
			App_Widgets.contact_sync_google.render(true);
		}}));
	});
	
	$("#sync-type").die().live('change', function(e){
		e.preventDefault();
		var value = $(this).val();
		if(value == "AGILE_TO_CLIENT" || value == "TWO_WAY")
			{
				$("#sync_to_group_controlgroup").show();
				$("#my_contacts_sync_group").show();
				if(value == "AGILE_TO_CLIENT")
				{
					$("#sync_from_group_controlgroup").hide();
					return;
				}
				
				$("#sync_from_group_controlgroup").show();
			}
		else
			{
				$("#sync_from_group_controlgroup").show();
				$("#sync_to_group_controlgroup").hide();
				$("#my_contacts_sync_group").hide();
			}
		
	})
	
	$(".save-contact-prefs").die().live('click', function(e){
		e.preventDefault();
		var disabled = $(this).attr("disabled");
		if(disabled)
			return;
		
		if(!isValidForm("#google-contacts-import-form"))
			{
				return;
			};
				
		$(this).attr("disabled", "disabled");
		
//	return;
		
		App_Widgets.setup_google_contacts.model.set(serializeForm("google-contacts-import-form"));
		console.log(App_Widgets.setup_google_contacts.model.toJSON())
		var url = App_Widgets.setup_google_contacts.model.url;

		$(this).after(LOADING_HTML);
		App_Widgets.setup_google_contacts.model.url = url + "?sync=true"
		App_Widgets.setup_google_contacts.model.save({}, {success : function(data){
		
			App_Widgets.setup_google_contacts.render(true);
			App_Widgets.setup_google_contacts.model.url = url;	
				show_success_message_after_save_button("Sync Initated", App_Widgets.setup_google_contacts.el);
				showNotyPopUp("information", "Contacts sync initated", "top", 1000);
			}});
		
	})
	
});

function show_success_message_after_save_button(message, el)
{
	
	/*
	 * Appends success message to form
	 * actions block in form, if window
	 * option is not set for view
	 *
	 */
	$save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px" class="text-success"><i>'+message+'</i></p></small></div>');
	$(".form-actions", el).append($save_info);
	$save_info.show().delay(3000).hide(1);	
		
}/** The function is commented inorder to implement later. It shows Upgrade message to free users**/
//$(function(){
//
//	var accountprefs = Backbone.Model.extend({
//		url:'core/api/account-prefs'
//	});
//	
//	var accountPrefs = new accountprefs();
//	accountPrefs.fetch({
//		success: function(data)
//		{
//			var json = data.toJSON();
//			
//			console.log(json);
//			
//			// Allow only for free users
//			try{
//				
//				// if json consists of plan, then return
//				if(json.plan)
//					return;	
//				
//			}
//			catch(err){}	
//	
//	// Show the first one after 3 secs
//	setTimeout(function(){
//		showNoty("warning", get_random_message(), "bottom");
//	}, 3000);
//	
////	// Set the periodically
////	setInterval(function(){
////		showNoty("warning", get_random_message(), "bottom");
////	}, 30000);
//	
//		}
//	});
//	
//});

//function showNotyP(type, message, position)
//{
//	// Download the lib
//	head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH + 'lib/noty/layouts/bottom.js', LIB_PATH + 'lib/noty/layouts/top.js', LIB_PATH + 'lib/noty/themes/default.js',
//       		function()
//       		{
//		
//				// Close all
//				$.noty.closeAll()
//		
//				var n = noty({
//		    			 text: message,
//		    			 layout: position,
//		    			 type: type
//		    	});
//				
//			        // Set the handler for click
//				     $('.noty_bar').die().live('click', function(){
//					
//					// Close all
//					$.noty.closeAll();
//					
//					if(n.options.type == "warning"){
//					
//						// Send to upgrade page
//					Backbone.history.navigate('subscribe', {
//						trigger : true
//					});
//					
//					}
//				});
//	   });
//	 
//}

var CONTACTS_HARD_RELOAD = false;

/**
 * Shows noty popup for bulk actions like bulk contacts deletion, 
 * adding bulk contacts to campaign etc.
 * 
 * @param type - 
 *             type of noty. For e.g. noty of information type is blue.
 * @param message -
 *             message to be shown on noty.
 * @param position -
 *             position of noty like bottomRight, top etc.            
 *                     
 */
function bulkActivitiesNoty(type, message, position) {
	CONTACTS_HARD_RELOAD = true;
	
	// if no position, default bottomRight
	if(!position)
	{
		showNotyPopUp(type, message.message, "bottomRight")
		return;
	}
		
	// shows noty in given position
	showNotyPopUp(type, message.message, position)
}

/**
 * Loads files required for noty and calls notySetup to show 
 * noty with the given options.
 *
 * @param type - 
 *             type of noty. For e.g. noty of information type is blue.
 * @param message -
 *             message to be shown on noty.
 * @param position -
 *             position of noty like bottomRight, top etc.
 */
function showNotyPopUp(type, message, position, timeout) {
	
	// for top position
	if(position == "top")
		head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH
		+ 'lib/noty/layouts/top.js', LIB_PATH
		+ 'lib/noty/themes/default.js', function(){
			notySetup(type, message, position, timeout)
		});
	
	// for bottomRight position
	if(position == "bottomRight")
		head.js(LIB_PATH + 'lib/noty/jquery.noty.js',  LIB_PATH
				+ 'lib/noty/layouts/bottom.js', LIB_PATH
				+ 'lib/noty/layouts/bottomRight.js', LIB_PATH
				+ 'lib/noty/themes/default.js', function(){
					notySetup(type, message, position, timeout)
				});
	
	// for bottomLeft position
	if(position == "bottomLeft")
		head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH
				+ 'lib/noty/layouts/bottomLeft.js', LIB_PATH
				+ 'lib/noty/themes/default.js', function(){
						notySetup(type, message, position, timeout)
				});		
}

/**
 * Sets noty popup to show message in the given position and type.
 * 
 * @param type - 
 *             type of noty. For e.g. noty of information type is blue.
 * @param message -
 *             message to be shown on noty.
 * @param position -
 *             position of noty like bottomRight, top etc.*/
function notySetup(type, message, position, noty_timeout) {
		
	    // close all other noty before showing current
	    $.noty.closeAll()

		var n = noty({
			text : message,
			layout : position,
			type : type,
			animation : {
				open : {
					height : 'toggle'
				},
				close : {
					height : 'toggle'
				},
				easing : 'swing',
				speed : 500
				// opening & closing animation speed
			},
			timeout : noty_timeout ? noty_timeout : 20000, // delay for closing event. Set false for sticky
							// notifications
		});
	}

/*function get_random_message() {

	var messages = [ "Thanks for trying Agile CRM.", "You can upgrade here." ];

	var random = Math.floor((Math.random() * messages.length));
	// console.log(random + messages[random]);

	return messages[random];
}*/$(function(){
	
	/**
	 * If default view is selected, deals are loaded with default view and 
	 * removes the view cookie set when view is selected
	 */ 
	$('.deals-list-view').die().live('click', function(e) {
		e.preventDefault();
		
		// Creates the cookie
		createCookie("agile_deal_view", "list_view");
		
		// Loads the deals
		App_Deals.deals();

	});
	
	/**
	 * If Pipelined View is selected, deals are loaded with pipelined view and 
	 * creates the pipelined view cookie
	 */
	$('.deals-pipelined-view').die().live('click', function(e) {
		e.preventDefault();

		// Erases the cookie
		eraseCookie("agile_deal_view");

		// Loads the deals
		App_Deals.deals();

	});

	// Admin Settings milestone list
	/**
	 * To remove the milestone from list.
	 */
	$(".milestone-delete").die().live('click', function(e){
		e.preventDefault();
		$(this).closest('li').css("display", "none");
		fill_ordered_milestone();
	});
	
	/**
	 * Shows input field to add new milestone.
	 */
    $("#show_milestone_field").die().live('click', function(e){
    	e.preventDefault();
    	$(this).css("display","none");
    	$('.show_field').css("display","block");
    	$("#add_new_milestone").focus();
    });
    
	/**
	 * Adds new milestone to the sortable list.
	 */
    $("#add_milestone").die().live('click', function(e){
    	
    	e.preventDefault();
    	$('.show_field').css("display","none");
    	$("#show_milestone_field").css("display","block");
    	
    	var new_milestone = $("#add_new_milestone").val().trim();
    	
    	if(!new_milestone || new_milestone.length <= 0 || (/^\s*$/).test(new_milestone))
		{
			return;
		}

    	// To add a milestone when input is not empty
    	if(new_milestone != "")
    	{
    		e.preventDefault();
    	
    		// Prevents comma (",") as an argument to the input field
    		$("#add_new_milestone").val("");
        	
    		var milestone_list = $(this).closest(".control-group").find('ul.milestone-value-list');
    		var add_milestone = true;
    		
    		// Iterate over already present milestones, to check if this is a new milestone
    		milestone_list.find('li').each(function(index, elem){
    			if($(elem).is( ":visible") && elem.getAttribute('data').toLowerCase() == new_milestone.toLowerCase())
    			{
    				add_milestone = false; // milestone exists, don't add
    				return false;
    			}
    		});
    		
    		if(add_milestone)
    		{
    			milestone_list.append("<li data='" + new_milestone + "'><div><span>" + new_milestone + "</span><a class='milestone-delete right' href='#'>&times</a></div></li>");
    			fill_ordered_milestone();
    		}
    	}
    });
    
});


/** 
 * To perform actions on deals arranged in milestones 
 * using sortable.js when it is dropped in middle or dragged over.
 */
function setup_deals_in_milestones(){
	head.js(LIB_PATH + 'lib/jquery-ui.min.js', function() {
		$('ul.milestones').sortable({
		      connectWith : "ul",
		      cursor : "move",
		      containment : "#opportunities-by-milestones-model-list",
		      scroll : false,
		      // When deal is dragged to adjust the horizontal scroll
		      change : function(event, ui){
		    	  var width = $('#opportunities-by-milestones-model-list > div').width();
		    	  var scrollX = $('#opportunities-by-milestones-model-list > div').scrollLeft();
		    	  if(event.pageX > (width * 0.9))
		    		  $('#opportunities-by-milestones-model-list > div').scrollLeft(scrollX + 10);
		    	  else if(event.pageX < (width * 0.1))
		    		  $('#opportunities-by-milestones-model-list > div').scrollLeft(scrollX - 15);
		      },
		      // When deal is dropped its milestone is changed 
		      update : function(event, ui) {
					var id = ui.item[0].id;
					var DealJSON = App_Deals.opportunityCollectionView.collection.get(id).toJSON();
					var oldMilestone = DealJSON.milestone;
					var newMilestone = ($(this).closest('ul').attr("milestone")).trim();
						// Checks current milestone is different from previous
						if(newMilestone != oldMilestone)
							update_milestone(App_Deals.opportunityMilestoneCollectionView.collection.models[0], id, newMilestone, oldMilestone);
		        }
	    });

	});
}

/** 
 * To change the milestone of the deal when it is 
 * dropped in other milestone columns and saves or updates deal object.
 */
function update_milestone(data, id, newMilestone, oldMilestone){
	// Updates the collection without reloading
	var milestone = data.get(oldMilestone);
	var DealJSON;
	for(var i in milestone)
	{
		if(milestone[i].id == id)
		{
			milestone[i].owner_id = milestone[i].owner.id;
			milestone[i].milestone = newMilestone;
			data.get(newMilestone).push(milestone[i]);
			DealJSON = milestone[i];
			milestone.splice(i, 1);
		}
	}
   // Saving that deal object
	var up_deal = new Backbone.Model();
	up_deal.url = '/core/api/opportunity';
	up_deal.save(DealJSON, {
		// If the milestone is changed, to show that change in edit popup if opened without reloading the app.
		success : function(model, response) {
			App_Deals.opportunityCollectionView.collection.remove(DealJSON);
			App_Deals.opportunityCollectionView.collection.add(model);
			App_Deals.opportunityCollectionView.render(true);
		}
	});

}

/**
 * Sets milestones as sortable list.
 */
function setup_milestones(){
	head.js(LIB_PATH + 'lib/jquery-ui.min.js', function() {
		$('ul.milestone-value-list').sortable({
		      containment : "#milestone-values",
		      // When milestone is dropped its input value is changed 
		      update : function(event, ui) {
		    	  fill_ordered_milestone();
		        }
	    });
	});
}

/**
 * To capitalize and trim the given string 
 */
function capitalize_string(str){
	str = str.trim().replace(/\b[a-z]/g, function(x) {
  		    return x.toUpperCase();
  		});
	return str;
}

/**
 * Edits the value of milestone when sorted or added new or removes milestone.
 */
function fill_ordered_milestone(){
   	var values;
   	$.each($("ul.milestone-value-list").children(), function(index, data) { 
   		if($(data).is( ":visible"))
   		{
   			// To capitalize the string
   	   		if(values != undefined)
   	   			values = values + "," + capitalize_string(($(data).attr("data")).toString());
   	   		else 
   	   			values = capitalize_string(($(data).attr("data")).toString());
   		}
	});
   	
   	// To remove the ending "," if present
   	if(values && values.charAt((values.length)-1) == ",")
   		values = values.slice(0, -1);

   	$("#milestonesForm").find( 'input[name="milestones"]' ).val(values); 
}
$(function(){
	
	/**
	 * Shows deal popup  
	 */
	$('.deals-add').live('click', function(e) {
		e.preventDefault();
		show_deal();
	});
	
	/**
	 * Validates deal and saves
	 */
	$("#opportunity_validate").live('click', function(e){
		e.preventDefault();

    	// To know updated or added deal form names
    	var modal_id = $(this).closest('.opportunity-modal').attr("id");
    	var form_id = $(this).closest('.opportunity-modal').find('form').attr("id");
    	
       	var json = serializeForm(form_id);
       	json["custom_data"] = serialize_custom_fields(form_id);
       	
       	console.log(json);
       	if(form_id == "opportunityForm")
       		saveDeal(form_id, modal_id, this, json, false);
       	else
       		saveDeal(form_id, modal_id, this, json, true);
	});
	
	/**
	 * To avoid showing previous errors of the modal.
	 */
	$('#opportunityModal, #opportunityUpdateModal').on('show', function() {

		// Removes alert message of error related date and time.
		$('#' + this.id).find('.alert').css('display', 'none');

		// Removes error class of input fields
		$('#' + this.id).find('.error').removeClass('error');
	});
	
	$('#opportunityModal, #opportunityUpdateModal').on("shown", function(){
		// Add placeholder and date picker to date custom fields
		$('.date_input').attr("placeholder","MM/DD/YYYY");
    
		$('.date_input').datepicker({
			format: 'mm/dd/yyyy'
		});
	})
    
    
    /**
     * "Hide" event of note modal to remove contacts appended to related to field
     * and validation errors
     */ 
    $('#opportunityModal').on('hidden', function () {
    	
		// Removes appended contacts from related-to field
		$("#opportunityForm").find("li").remove();
		
		// Removes validation error messages
		remove_validation_errors('opportunityModal');

    });
    
    /**
     * "Hide" event of note modal to remove contacts appended to related to field
     * and validation errors
     */ 
    $('#opportunityUpdateModal').on('hidden', function () {
		
    	// Removes appended contacts from related-to field
		$("#opportunityUpdateForm").find("li").remove();
		
		// Removes validation error messages
		remove_validation_errors('opportunityUpdateModal');

    });
    
   /** 
    * Deal list view edit
    */
    $('#opportunities-model-list > tr > td:not(":first-child")').live('click', function(e) {
		e.preventDefault();
		updateDeal($(this).closest('tr').data());
	});
    
    /**
     * Dash board edit
     */
	$('#dashboard-opportunities-model-list > tr').live('click', function(e) {
		e.preventDefault();
		updateDeal($(this).data());
	});
	
	$('.milestones > li').live('mouseenter', function () {
		$(this).find('.deal-options').css("display","inline");
	});
	
	$('.milestones > li').live('mouseleave', function () {
		$(this).find('.deal-options').css("display","none");
	});
	
	/**
	 * Milestone view deal edit
	 */
	$('.deal-edit').live('click', function(e) {
		e.preventDefault();
        var data = $(this).closest('.data').attr('data');
        var currentDeal = App_Deals.opportunityCollectionView.collection.get(data);
		updateDeal(currentDeal);
	});

	/**
	 * Milestone view deal delete
	 */
	$('.deal-delete').live('click', function(e) {
		e.preventDefault();
        if(!confirm("Are you sure you want to delete?"))
			return;
        
        var id = $(this).closest('.data').attr('data');
        var milestone = ($(this).closest('ul').attr("milestone")).trim();
        var id_array = [];
		var id_json = {};
		
		// Create array with entity id.
		id_array.push(id);
		
		// Set entity id array in to json object with key ids, 
		// where ids are read using form param
		id_json.ids = JSON.stringify(id_array);

        var that = this;
		$.ajax({
			url: 'core/api/opportunity/bulk',
			type: 'POST',
			data: id_json,
			success: function() {

				// Checks and deletes the deal from milestone array
				var milestone_array = App_Deals.opportunityMilestoneCollectionView.collection.models[0].get(milestone);
				for(var i in milestone_array)
				{
					if(milestone_array[i].id == id)
						milestone_array.splice(i, 1);
				}
	
				// Removes deal from list
				$(that).closest('li').css("display","none");
				
				// Shows Milestones Pie
				pieMilestones();
	
				// Shows deals chart
				dealsLineChart();
			}
		});
	});
});

/**
 * Show deal popup for editing
 */ 
function updateDeal(ele) {
	
	var value = ele.toJSON();
	
	add_recent_view(new BaseModel(value));
	
	var dealForm = $("#opportunityUpdateForm");
	
	deserializeForm(value, $("#opportunityUpdateForm"));
	
	$("#opportunityUpdateModal").modal('show');
	
	// Call setupTypeAhead to get contacts
	agile_type_ahead("relates_to", dealForm, contacts_typeahead);
	
	// Fills owner select element
	populateUsers("owners-list", dealForm, value, 'owner', function(data) {
				dealForm.find("#owners-list").html(data);
				if (value.owner) {
					$("#owners-list", dealForm).find('option[value=' + value['owner'].id + ']')
							.attr("selected", "selected");
					$("#owners-list", $("#opportunityUpdateForm")).closest('div').find('.loading-img').hide();
				}
	});
	
	// Fills milestone select element
	populateMilestones(dealForm, undefined, value, function(data){
		dealForm.find("#milestone").html(data);
		if (value.milestone) {
			$("#milestone", dealForm).find('option[value=\"'+value.milestone+'\"]')
					.attr("selected", "selected");
		}
		$("#milestone", dealForm).closest('div').find('.loading-img').hide();
	});
	
	add_custom_fields_to_form(value, function(data){
		var el = show_custom_fields_helper(data["custom_fields"], []);
	//	if(!value["custom_data"])  value["custom_data"] = [];
		$("#custom-field-deals", dealForm).html(fill_custom_fields_values_generic($(el), value["custom_data"]));
		
	}, "DEAL")
}

/**
 * Show new deal popup
 */ 
function show_deal(){
	
	var el = $("#opportunityForm");

	$("#opportunityModal").modal('show');
	
	add_custom_fields_to_form({}, function(data){
		var el_custom_fields = show_custom_fields_helper(data["custom_fields"], []);
		$("#custom-field-deals", $("#opportunityModal")).html($(el_custom_fields));
		
	}, "DEAL")
	
	
	
	// Fills owner select element
	populateUsers("owners-list", el, undefined, undefined, function(data){
		
		$("#opportunityForm").find("#owners-list").html(data);
		$("#owners-list", $("#opportunityForm")).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
		$("#owners-list", $("#opportunityForm")).closest('div').find('.loading-img').hide();
	});
	// Contacts type-ahead
	agile_type_ahead("relates_to", el, contacts_typeahead);
	
	// Fills milestone select element
	populateMilestones(el, undefined, undefined, function(data){
		$("#milestone", el).html(data);
		$("#milestone", el).closest('div').find('.loading-img').hide();
	});
	
	

	// Enable the datepicker
	$('#close_date', el).datepicker({
		format : 'mm/dd/yyyy',
	});
}

/**
 * Updates or Saves a deal
 */ 
function saveDeal(formId, modalId, saveBtn, json, isUpdate){
	// Returns, if the save button has disabled attribute
	if ($(saveBtn).attr('disabled'))
		return;

	// Disables save button to prevent multiple click event issues
	disable_save_button($(saveBtn));//$(saveBtn).attr('disabled', 'disabled');
	
	if (!isValidForm('#' + formId)) {
		// Removes disabled attribute of save button
		enable_save_button($(saveBtn));//$(saveBtn).removeAttr('disabled');
		return false;
	}
	
	// Shows loading symbol until model get saved
    // $('#' + modalId).find('span.save-status').html(LOADING_HTML);

	var newDeal = new Backbone.Model();
	newDeal.url = 'core/api/opportunity';
	newDeal.save(json, {
		success : function(data) {

			// Removes disabled attribute of save button
			enable_save_button($(saveBtn));//$(saveBtn).removeAttr('disabled');

			//$('#' + modalId).find('span.save-status img').remove();
			$('#' + modalId).modal('hide');

			$('#' + formId).each(function() {
				this.reset();
			});
			
			var deal = data.toJSON();
			
			add_recent_view(new BaseModel(deal));
			
			// Updates data to timeline
			if (App_Contacts.contactDetailView
					&& Current_Route == "contact/"
							+ App_Contacts.contactDetailView.model.get('id')) {

				// Add model to collection. Disabled sort while adding and called
				// sort explicitly, as sort is not working when it is called by add
				// function
				
				
				/*
				 * Verifies whether the added task is related to the contact in
				 * contact detail view or not
				 */
				$.each(deal.contacts, function(index, contact) {
					
					if (contact.id == App_Contacts.contactDetailView.model
							.get('id')) {
						
						

						if (dealsView && dealsView.collection)
						{
							if(dealsView.collection.get(deal.id))
							{
								dealsView.collection.get(deal.id).set(new BaseModel(deal));
							}
							else
							{
								dealsView.collection.add(new BaseModel(deal), { sort : false });
								dealsView.collection.sort();
							}
						}
						
							// Activates "Timeline" tab and its tab content in
							// contact detail view
							// activate_timeline_tab();
							add_entity_to_timeline(data);
							/*
							 * If timeline is not defined yet, initiates with the
							 * data else inserts
							 */
							return false;
					}
				});
			}
			// When deal is added or updated from Deals route
			else if (Current_Route == 'deals') {

				if(!readCookie("agile_deal_view")) {
					var modelJSON = App_Deals.opportunityMilestoneCollectionView.collection.models[0];
					var newMilestone = json.milestone;
					if (isUpdate)
					{
						var oldDealJSON = App_Deals.opportunityCollectionView.collection.get(json.id).toJSON();
						var oldMilestone = oldDealJSON.milestone;
						var milestone = modelJSON.get(oldMilestone);
						for(var i in milestone)
						{
							if(milestone[i].id == json.id)
							{
								if(newMilestone != oldMilestone)
								{
									milestone[i].owner_id = milestone[i].owner.id;
									//milestone[i].milestone = newMilestone;
									//modelJSON.get(newMilestone).push(milestone[i]);
									modelJSON.get(newMilestone).push(deal);
									milestone.splice(i, 1);
								}
								else 
								{
									deal.owner_id = milestone[i].owner.id;
									milestone.splice(i, 1);
									modelJSON.get(oldMilestone).push(deal);
								}
								
							}
						}
					}
					else
					  modelJSON.get(newMilestone).push(deal);
					
					App_Deals.opportunityMilestoneCollectionView.render(true);
				}
				if (isUpdate)
				 App_Deals.opportunityCollectionView.collection.remove(json);
			
				App_Deals.opportunityCollectionView.collection.add(data);
				App_Deals.opportunityCollectionView.render(true);

			}
			else {
				App_Deals.navigate("deals", {
					trigger : true
				});
			}
		}
	});
}/**
 * opportunity.js is a script file that handles opportunity pop-over,
 * milestones and owner select list.
 * 
 * @module Deals
 * 
 **/
$(function () {
	
	/**
	 * When mouseover on any row of opportunities list, the popover of deal is shown
	 **/
	$('#opportunities-model-list > tr').live('mouseenter', function () {
        var data = $(this).find('.data').attr('data');

        var currentDeal = App_Deals.opportunityCollectionView.collection.get(data);
       
        //console.log(currentDeal.toJSON());
        
        var ele = getTemplate("opportunity-detail-popover", currentDeal.toJSON());
        $(this).attr({
        	"rel" : "popover",
        	"data-placement" : 'right',
        	"data-original-title" : currentDeal.toJSON().name,
        	"data-content" :  ele
        });
       
        /**
         * Checks for last 'tr' and change placement of popover to 'top' inorder
         * to prevent scrolling on last row of list
         **/
        $('#opportunities-model-list > tr:last').attr({
        	"rel" : "popover",
        	"data-placement" : 'top',
        	"data-original-title" : currentDeal.toJSON().name,
        	"data-content" :  ele
        });
        $(this).popover('show');
     });
	
    /**
     * On mouse out on the row hides the popover.
     **/
	$('#opportunities-model-list > tr').live('mouseleave', function(){
    	 $(this).popover('hide');
    });
	
    /**
     * On click on the row hides the popover.
     **/
	$('#opportunities-model-list > tr, .hide-popover').live('click', function(){
    	 $(this).closest('tr').popover('hide');
    });
    
   /**
    * When deal is added from contact-detail by selecting 'Add Opportunity' from actions 
    * and then close button of deal is clicked, it should navigate to contact-detail.
    **/
	$('#close-deal').live('click', function(e){
    	e.preventDefault();
    	window.history.back();
    });

});

/**
 * Populate users in options of owner input field drop-down.
 * When new deal is created,owner select is filled with owners list.When
 * deal is need to edit,the owner select field is filled with previous option.
 *  
 * @param id - Id of select element of Owner
 * @param el - el references the DOM object created in the browser.
 * @param value - Deal object
 * @param key - key name in the value.It is passed during declaration
 **/
function populateUsers(id, el ,value, key, callback) {
		
	// Users set id of agile user to save agileuser key in opportunities
	var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
	
	 /**
      * Fills owner select with existing Users.
      * 
      * @param id - Id of select element of Owner
      * @param /core/api/users - Url to get users
      * @param 'domainUser' - parse key
      * @param function - callback function
      * @param optionsTemplate- to fill options with users
      **/
	fillSelect(id,'/core/api/users', 'domainUser', function fillOwner() {
		
		if(value)
		{
			// If domain user is deleted owner is undefined
			if(value[key])
				// While deserialize set agile user id from user prefs, to save agile user key in opportunity 
				$('#' + id, el).find('option[value='+ value[key].id +']').attr("selected", "selected");
		}
		else
			$('#' + id, el).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
		// If callback is present, it is called to deserialize the select field
		if (callback && typeof (callback) === "function") {
			// execute the callback, passing parameters as necessary
			callback($('#' + id).html());
		}
	}, optionsTemplate); 
	
	
}


/**
 * Populate milestones in options of milestone input field drop-down.
 * When new deal is created,milestone select is filled with milestones list.When
 * deal is need to edit,the milestone select field is filled with previous option.
 * 
 * @param el - el references the DOM object created in the browser.
 * @param dealDetails - dealDetails value
 * @param value - Deal Object
 **/
function populateMilestones(el, dealsDetails, value, callback, defaultSelectOption){

	 // Fill milestones in select options
    var milestone_model = Backbone.Model.extend({
   	 url: '/core/api/milestone'
		});
    
    var model = new milestone_model();
    model.fetch({ 
   			 success: function(data) 
   			 { 
   				 		var jsonModel = data.toJSON();
						var milestones = jsonModel.milestones;
						
						// Split , and trim
						var array = [];
						$.each(milestones.split(","), function(){
							array.push($.trim(this));
						});
						if(dealsDetails)
						{
							fillMilestones('move', array);
							return;
						}
						/**
						 * Fills milestone select with existing milestones.
						 * 
						 * @param 'milestone' - Id of select element of Owner
						 * @param  array - array of milestones
						 * @param function - callback function
						 **/
						fillTokenizedSelect('milestone', array, function(){
														
							// Quotes required for option value because milestone can have spaces in between
							if(value && value.milestone)
								$("#milestone",el).find('option[value=\"'+ value.milestone +'\"]').attr("selected", "selected");
								
							// If callback is present, it is called to deserialize the select field
							if (callback && typeof (callback) === "function") {
								// execute the callback, passing parameters as necessary
								callback($('#milestone').html());
							}
						}, defaultSelectOption);
    			   }
    });
}
/**
 * wysihtml.js is used to embed beautiful html editors to email body. Inserts
 * merge fields into email body. wysihtml makes use of wysihtml5 which is a
 * javascript plugin that makes it easy to create simple, beautiful wysiwyg
 * editors with the help of wysihtml5 and Twitter Bootstrap.
 */
$(function() {

	// Code for Merge fields in Email Template
	$(".merge-field").die().live('click',
			function(e) {

				e.preventDefault();
				// console.log("Merge field");

				// Get Selected Value
				var fieldContent = $(this).attr("name");

				// Get Current HTML
				var val = $('#email-template-html').val();

				// Set New HTML
				var wysihtml5 = $('#email-template-html').data('wysihtml5');
				if (wysihtml5) {
					// console.log("Setting content ");
					// console.log(fieldContent);

					// wysihtml5.editor.setValue(fieldcontent + " " + val,
					// true);
				    editor.focus();
					wysihtml5.editor.composer.commands.exec("insertHTML", '{{'
							+ fieldContent + '}}');
				}
			});
});

/**
 * Sets HTML Editor for UserPrefs, EmailTemplates etc.
 **/
function setupHTMLEditor(selector, data) {
	head.js(LIB_PATH + 'lib/wysihtml5-0.3.0-min.js', LIB_PATH + 'lib/bootstrap-wysihtml5-min.js',
			function() {
				console.log('setting up text');
				console.log(selector.html());
				
				if(!$(selector).data('wysihtml5'))
					selector.wysihtml5();
				
				if(data)
					selector.data("wysihtml5").editor.setValue(data, false);
				
			});
}/**
 * Fetches account prefs and render the template.
 * 
 * @param $account_activity -
 *            settings-account-activity template
 */
function load_admin_account_prefs($account_activity)
{
	var view = new Base_Model_View({ url : '/core/api/account-prefs', template : "admin-settings-account-prefs" });

	$account_activity.find('#admin-account-prefs').html(view.render().el);

}

/**
 * Fetches mandrill subaccount info and render them email activity template.
 * 
 * @param $account_activity -
 *            settings-account-activity template
 */
function load_account_email_activity($account_activity)
{
	// Email Activity
	var emailActivityModelView = new Base_Model_View({ url : 'core/api/emails/email-activity', template : 'admin-settings-email-activity', });

	$account_activity.find('#account-email-activity').html(emailActivityModelView.render().el);

}
function bindAdminChangeAction(el)
{
	$('input[name="is_admin"]', el).die().live('change', function(e){
	var is_admin = $(this).is(":checked");
	if(is_admin == false)
		$("input[type=checkbox]", $('div[name="scopes"]', el)).removeAttr("disabled");
	else
		$("input[type=checkbox]", $('div[name="scopes"]', el)).attr("checked", "checked" ).attr("disabled", "disabled");
	})
}/**
 * Defines a JSON of content to be shown in the respective route when collection
 * is empty. The content respective to each route is used to fill the slate
 * template which is shown when collection is empty, called from
 * base_collection.
 * 
 * Each current route key contacts title, description, learn_more, button_text,
 * route, modal_id, image
 * 
 * <P>
 * "KEY SHOULD BE CURRENT ROUTE"
 * </p>
 */
var CONTENT_JSON = {
	"contacts" : {
		"title" : "You do not have any contacts currently.",
		"description" : "Contacts are your customers or prospects that you interact with using Agile.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add Contacts",
		"route" : "#",
		"modal_id" : "personModal",
		"image" : "/img/clipboard.png"
	},
	"companies" : {
		"title" : "You do not have any companies currently.",
		"description" : "companies are prospects that you interact with using Agile.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add Companies",
		"route" : "#",
		"modal_id" : "companyModal",
		"image" : "/img/clipboard.png"
	},
	"workflows" : {
		"title" : "You do not have any Campaigns currently.",
		"description" : "Campaign or workflow is an intelligent sales and marketing automation process for sending your contacts relevant information at the right time.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add Campaign",
		"route" : "#workflow-templates",
		"image" : "/img/clipboard.png"
	},
	"deals" : {
		"title" : "You do not have any deals currently.",
		"description" : "Deals are sales opportunities you track continuously throughout its lifecycle.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add Deal",
		"route" : "#",
		"modal_id" : "opportunityModal",
		"image" : "/img/clipboard.png"
	},
	"reports" : {
		"title" : "You do not have any reports currently.",
		"description" : "Reports are based on a variety of tags and filters and receive them periodically to constantly be in touch with your sales cycle and pipeline.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add Report",
		"route" : "#report-add",
		"image" : "/img/clipboard.png"
	},
	"contact-filters" : {
		"title" : "You do not have any filters currently.",
		"description" : "Filters are used to sort contacts with a specific criteria to find patterns.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add Filter",
		"route" : "#contact-filter-add",
		"image" : "/img/clipboard.png"
	},
	"contact-views": {
		"title" : "You do not have any custom views currently.",
		"description" : "View is collection of different fields and the order in which you would like them to appear.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add View",
		"route" : "#contact-view-add",
		"image" : "/img/clipboard.png"
	},
	"dashboard" : {
		"contacts" : {
			"title" : "There is no recent activity",
			"description" : "Perhaps, you may want to create a <a href='#' modal_id='personModal' class='modal-form'>new contact</a>.",
			"icon" : "icon-group icon-3x"
		},
		"tasks" : {
			"title" : "You have no tasks due",
			"icon" : "icon-edit icon-3x"
		},
		"deals" : {
			"title" : "No ongoing deals for you",
			"icon" : "icon-money icon-3x"
		},
		"workflows" : {
			"title" : "No campaign activity yet",
			"description" : "Campaigns help you automate your communication with your customers.<br/>You can create a <a href='#workflow-add'>new campaign</a>.",
			"icon" : "icon-sitemap icon-3x"
		}
	},
	"email-templates" : {
		"title" : "You do not have any Email templates currently.",
		"description" : "Personalize and customize email templates for every scenario in the sales cycle.",
		"button_text" : "Add Email Template",
		"route" : "#email-template-add",
		"image" : "/img/clipboard.png"
	},
	
	"web-rules" : {
		
		"title" : "Engage visitors on website",
		"description" : "Define web rules and enagage your website visitors with smart popups, or perform automatic actions when contacts do (or don't do) something in your application or website. Checkout the <documentation ref:https://github.com/agilecrm/agile-popups>.",
		"button_text" : "Add Web Rule",
		"route" : "#webrules-add",
		"image" : "/img/clipboard.png"
	}
	
};

/**
 * Fills the slate with the content respective to the current route in the
 * CONTENT_JSON
 */
function fill_slate(id, el) {

	// If content for current route is available in the CONTENT_JSON, slate
	// template is made with the content related to current route
	if (CONTENT_JSON[Current_Route]){
		if((Current_Route == "contacts") && readCookie('company_filter'))
			$("#" + id, el).html(
					getTemplate("empty-collection-model",
							CONTENT_JSON["companies"]));
		else
			$("#" + id, el).html(
				getTemplate("empty-collection-model",
						CONTENT_JSON[Current_Route]));
	}
}

/**
 * Show modal if add entity form is modal, it is used for contacts (adding new contact)
 */
$(function() {
	
	// Show activity modal
	$('.modal-form').live('click', function(e) {
		e.preventDefault();
		var id = $(this).attr('modal_id');
		if(id == "opportunityModal")
			show_deal();
		else
			$("#" + id).modal('show');
	});
});/**
 * workflows.js is a script file to deal with common UI Handlers for
 * workflows from client side.
 * 
 * @module Campaigns  
 * 
 * 
 */
$(function(){

	// To stop propagation to edit page
	$(".stop-propagation").die().live('click', function(e){
		e.stopPropagation();
	});

	/**
	 * Saves the content of workflow if the form is valid. Verifies for duplicate workflow names.
	 * Separate ids are given for buttons (as IDs are unique in html) but having same functionality, 
	 * so ids are separated by comma in click event.
	 * 
	 **/
	$('#save-workflow-top, #save-workflow-bottom, #duplicate-workflow-top, #duplicate-workflow-bottom').live('click', function (e) {
           e.preventDefault();
           
           // Temporary variable to hold clicked button, either top or bottom. $ is preceded, just to show 
           // it is holding jQuery object
           var $clicked_button = $(this);
           
           if($(this).attr('disabled'))
   			return;
           
    	// Check if the form is valid
    	if (!isValidForm('#workflowform')) {
  		$('#workflowform').find("input.required").focus();
    		return false;
    	}
    	
        // Gets Designer JSON
        var designerJSON = window.frames.designer.serializePhoneSystem();

        var name = $('#workflow-name').val();
        
        var unsubscribe_tag = $('#unsubscribe-tag').val().trim();
        var unsubscribe_action = $('#unsubscribe-action').val();
        
        var unsubscribe_json ={
        		               		"tag":unsubscribe_tag,
        		               		"action":unsubscribe_action
        		               }
        
        // Check for valid name
        if (isNotValid(name)) {
            alert("Name not valid");
            return;
        }

        // Disables save button to prevent multiple save on click event issues
        disable_save_button($(this));
        //$('#workflowform').find('#save-workflow').attr('disabled', 'disabled');
        
        // Load image while saving
		// $save_info = $('<div style="display:inline-block"><img src="img/1-0.gif" height="15px" width="15px"></img></div>');
		// $(".save-workflow-img").html($save_info);
		// $save_info.show();

        var workflowJSON = {};

        // New Workflow or Copy Workflow
        if (App_Workflows.workflow_model === undefined || $(this).attr('id') === 'duplicate-workflow-top' || $(this).attr('id') === 'duplicate-workflow-bottom') 
        {
        	create_new_workflow(name, designerJSON, unsubscribe_json, $clicked_button)
        }
        // Update workflow
        else
        {
            workflowJSON = App_Workflows.workflow_model;
            App_Workflows.workflow_model.set("name", name);
            App_Workflows.workflow_model.set("rules", designerJSON);
            App_Workflows.workflow_model.set("unsubscribe", unsubscribe_json);
            App_Workflows.workflow_model.save({}, {success: function(){
            	
            	enable_save_button($clicked_button);
            	
            	// Adds tag in our domain
            	add_tag_our_domain(CAMPAIGN_TAG);
            	//$('#workflowform').find('#save-workflow').removeAttr('disabled');
               
               //$(".save-workflow-img").remove();
  
            	Backbone.history.navigate("workflows", {
                    trigger: true
                });
            	
            },
            
            error: function(jqXHR, status, errorThrown){ 
              enable_save_button($clicked_button);
              
              // shows Exception message
              alert(status.responseText);
                }
            });        
            
        } 

        /**/
        
        // Since we do save it back in collection, we are reloading the view
       // location.reload(true);

        
    });
	
    /**
     *  Deletes all logs of campaign
     *      
     **/
	$('#delete_campaign_logs').live('click', function (e) {
    	e.preventDefault();
    	
    	// Gets campaign id
    	var campaign_id = $("#logs-table").find("input.campaign").val();
    	
    	if(!campaign_id)
    		return;
    	
    	if(!confirm("Are you sure you want to delete all logs?"))
    		return;
    	
    	// Sends delete request to CampaignsAPI for deletion of logs
    	$.ajax({
    	    url: 'core/api/campaigns/logs/' + campaign_id,
    	    type: 'DELETE',
    	    success: function(){
    	    	location.reload(true);
    	    }
    	});
    });

	/**
	 * Script to show workflow video tutorial in bootstrap modal.
	 **/
	$('#workflow-designer-help').die().live('click', function(e){
		e.preventDefault();

		// Removes if previous modals exist.
		if ($('#workflow-designer-help-modal').size() != 0)
        {
        	$('#workflow-designer-help-modal').remove();
        }

		var workflow_help_modal = $(getTemplate('workflow-designer-help-modal'),{});
		workflow_help_modal.modal('show');

		// Plays video on modal shown
		$(workflow_help_modal).on("shown", function(){
			$(this).children('div.modal-body').find('div#workflow-help-detail').html('<h3 style="margin-left:165px">Easy. Peasy.</h3><iframe width="420" height="345" src="//www.youtube.com/embed/0Z-oqK6mWiE?enablejsapi=10&amp;autoplay=1" frameborder="0" allowfullscreen></iframe>');
		});

		// Stops video on modal hide
		$(workflow_help_modal).on("hide", function(){
			$(this).children('div.modal-body').find("iframe").removeAttr("src");
		});
	});
	
	$('#workflow-unsubscribe-option').die().live('click', function(e){
		e.preventDefault();
		//$(this).css('display','none');
		//$('#workflow-unsubscribe-block').show('slow');
	});
	
	$('#workflow-unsubscribe-block').live('shown', function(){
		$('#workflow-unsubscribe-option').html('<span><i class="icon-minus"></i></span> Manage Unsubscription');
	});
	
	$('#workflow-unsubscribe-block').live('hidden', function(){
		$('#workflow-unsubscribe-option').html('<span><i class="icon-plus"></i></span> Manage Unsubscription');
	});
	
	$('#unsubscribe-action').die().live('change', function(e){
		e.preventDefault();
		
		var all_text = "Contact will not receive any further emails from any campaign (i.e., the 'Send Email' option will not work. However, other actions in" 
			           + " campaign will work as expected)";
		
		var this_text = "Contact will be removed from this campaign";
		
		var ask_text = "Prompts the user with options to either unsubscribe from this campaign or all communication";
		
		var $p_ele = $(this).closest('div.controls').parent().find('small');
		
		if($(this).val() == "UNSUBSCRIBE_FROM_ALL")
			$p_ele.html(all_text);
		
		if($(this).val() == "UNSUBSCRIBE_FROM_THIS_CAMPAIGN")
			$p_ele.html(this_text);
		
		if($(this).val() == "ASK_USER")
			$p_ele.html(ask_text);
		
	});

});

/**
 * Creates a new workflow or Copy existing workflow and add to workflows collection
 * 
 * @param name - workflow name
 * @param designerJSON - campaign workflow in json
 * @param unsubscribe_json - unsubscribe data of workflow
 * @param $clicked_button - jquery object to know clicked button
 **/
function create_new_workflow(name, designerJSON, unsubscribe_json, $clicked_button)
{
	var workflowJSON = {};
	
	workflowJSON.name = name;
    workflowJSON.rules = designerJSON;
    workflowJSON.unsubscribe = unsubscribe_json;
    
    var workflow = new Backbone.Model(workflowJSON);
    App_Workflows.workflow_list_view.collection.create(workflow,{
    	    success:function(){  

    	    	// Removes disabled attribute of save button
    	    	enable_save_button($clicked_button);
    	    	// $('#workflowform').find('#save-workflow').removeAttr('disabled');
    	    	
    	    	// $(".save-workflow-img").remove();
    	    	            	    	
    	    	Backbone.history.navigate("workflows", {
                trigger: true
    	    	
    	    	});
    	    },
            
            error: function(jqXHR, status, errorThrown){ 
              enable_save_button($clicked_button); 
              
              // shows Exception message
              if(status.status != 406)
              {
            	  // Show different message for Copy
            	  if($clicked_button.attr('id') === 'duplicate-workflow-bottom' || $clicked_button.attr('id') === 'duplicate-workflow-top')
            	  {
            		  if(status.responseText === "Please change the given name. Same kind of name already exists.")
            		  {
            			  alert("Please change the name and click on 'Create a Copy' again.");
            			  return;
            		  }
            	  }
            	  
            	  alert(status.responseText);
              }
              else
            	  {
            	  console.log(status);
            		// Show cause of error in saving
					$save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>'
							+ status.responseText
							+ '</i></p></small></div>');

					// Appends error info to form actions
					// block.
					$("#workflow-limit-reached-msg").html(
							$save_info).show();
            	  }
                }
    });
}/**
 * triggers.js is a script file that sets tags typeahead when Tag options are
 * selected
 * 
 * @module Campaigns
 * 
 */
$(function()
{

	// Tag suggestions when 'Tag is added' and 'Tag is deleted' options selected
	$('#trigger-type').live('change', function(e)
	{
		e.preventDefault();

		// Hide trigger milestones div for other trigger conditions.
		if ($(this).val() !== 'DEAL_MILESTONE_IS_CHANGED')
			$('form#addTriggerForm').find('select#trigger-deal-milestone').closest('div.control-group').css('display', 'none');

		// Initialize tags typeahead
		if ($(this).val() == 'TAG_IS_ADDED' || $(this).val() == 'TAG_IS_DELETED')
		{
			// Tags typeahead for tag input field
			addTagsDefaultTypeahead($('form#addTriggerForm').find('div#RHS'));
		}

		// Populate milestones for triggers
		if ($(this).val() == 'DEAL_MILESTONE_IS_CHANGED')
		{
			populate_milestones_in_trigger($('form#addTriggerForm'), 'trigger-deal-milestone');
		}

	});

	// When cancel clicked, take to Back page
	$('#trigger-cancel').die().live('click', function(e)
	{
		e.preventDefault();

		if (history !== undefined)
			history.back(-1);
	});
});

/**
 * Shows hidden trigger-milestones select element and fills with milestones
 * data.
 * 
 * @param trigger_form -
 *            trigger form jQuery object
 * @param milestones_select_id -
 *            trigger milestones select id
 * @param trigger_deal_milestone_value -
 *            trigger milestone value obtained from saved trigger.
 */
function populate_milestones_in_trigger(trigger_form, milestones_select_id, trigger_deal_milestone_value)
{

	// Show milestones select element
	trigger_form.find('select#' + milestones_select_id).closest('div.control-group').css('display', '');

	// Show loading image.
	$('select#' + milestones_select_id).after(LOADING_HTML);

	// Fills milestone select element
	populateMilestones(trigger_form, undefined, undefined, function(data)
	{
		$('.loading').remove();

		// Append obtained option values to select
		trigger_form.find('select#' + milestones_select_id).html(data);

		// Make obtained milestone value selected
		if (trigger_deal_milestone_value !== undefined)
		{
			trigger_form.find('select#' + milestones_select_id).val(trigger_deal_milestone_value).attr('selected', 'selected').trigger('change');
		}
	}, "Select new milestone...");

}

/**
 * Shows triggers for each td in workflows list
 * 
 * @param el -
 *            Backbone el
 * 
 */
function show_triggers_of_each_workflow(el)
{
	// Fetches triggers from collection and appends
	if (App_Workflows.triggersCollectionView != undefined && App_Workflows.triggersCollectionView.collection.length != 0)
	{
		append_triggers_to_workflow(el);
		return;
	}

	App_Workflows.triggersCollectionView = new Base_Collection_View({ url : '/core/api/triggers', restKey : "triggers", templateKey : "triggers",
		individual_tag_name : 'tr' });

	App_Workflows.triggersCollectionView.collection.fetch({ success : function(data)
	{
		// Shows pending triggers content
		if (App_Workflows.triggersCollectionView == undefined || App_Workflows.triggersCollectionView.collection.length == 0)
		{
			$('#triggers-verification', el).css('display', 'block');
			return;
		}

		// Append triggers to workflow
		append_triggers_to_workflow(el);

	} });

}

/**
 * Appends triggers to each workflow in UI
 * 
 * @param el -
 *            Backbone el
 * 
 */
function append_triggers_to_workflow(el)
{

	// Appends triggers to respective workflow
	$('.workflow-triggers', el).each(function(index, td)
	{

		// Returns filtered array of models
		var trigger_models = App_Workflows.triggersCollectionView.collection.where({ campaign_id : parseInt($(td).attr('workflow-id')) });
		var trigger_collection = new BaseCollection(trigger_models, {});

		// show triggers if exists for a workflow
		if (trigger_collection.length !== 0)
			$(td).html(getTemplate('workflow-triggers', { "triggers" : trigger_collection.toJSON() }));

	});
}
$(function()
{

	$("#select-all-active-contacts")
			.die()
			.live(
					'click',
					function(e)
					{
						e.preventDefault();
						SUBSCRIBERS_SELECT_ALL = true;
						$('body')
								.find('#subscribers-bulk-select')
								.css('display', 'block')
								.html(
										'Selected All ' + getAvailableActiveContacts() + ' contacts. <a hrer="#" id="select-all-active-contacts-revert" style="cursor:pointer">Select chosen contacts only</a>');

						// On choosing select all option, all the visible
						// checkboxes in the table should be checked
						$.each($('.tbody_check'), function(index, element)
						{
							$(element).attr('checked', "checked");
						});
					});

	$("#select-all-active-contacts-revert")
			.die()
			.live(
					'click',
					function(e)
					{
						e.preventDefault();
						SUBSCRIBERS_SELECT_ALL = false;
						$('body')
								.find('#subscribers-bulk-select')
								.css('display', 'block')
								.html(
										"Selected " + App_Workflows.active_subscribers_collection.collection.length + " contacts. <a href='#'  id='select-all-active-contacts' >Select all " + getAvailableActiveContacts() + " contacts</a>");
					});
});

/**
 * Shows delete button when thead/tbody checkbox is checked.
 * 
 * @param clicked_ele - 
 * 				clicked checkbox element.
 * 
 * @param isBulk -
 * 				true if .thead is checked, otherwise false
 * 
 */
function toggle_active_contacts_bulk_actions_dropdown(clicked_ele, isBulk)
{
	SUBSCRIBERS_SELECT_ALL = false;
	var total_available_contacts;

	if (clicked_ele)
			total_available_contacts = getAvailableActiveContacts();

	$('body').find('#subscribers-bulk-select').css('display', 'none');

	// When checked show Delete button
	if ($(clicked_ele).attr('checked') == 'checked')
	{
		$('body').find('#remove-active-from-campaign').css('display', 'inline-block');

		// To show subscribers-bulk-select only thead is checked i.e., isBulk is true.
		if (isBulk && total_available_contacts != App_Workflows.active_subscribers_collection.collection.length)
			$('body')
					.find('#subscribers-bulk-select')
					.css('display', 'block')
					.html(
							"Selected " + App_Workflows.active_subscribers_collection.collection.length + " contacts. <a id='select-all-active-contacts' href='#'>Select all " + total_available_contacts + " contacts</a>");

	}
	// When unchecked hide Delete button
	else
	{
		// To hide Delete button when .thead is unchecked
		if (isBulk)
		{
			$('#remove-active-from-campaign').css('display', 'none');
			return;
		}

		// Hide delete button when .tbody is unchecked
		var check_count = 0
		$.each($('.tbody_check'), function(index, element)
		{
			if ($(element).is(':checked'))
			{
				check_count++;
				return false;
			}
		});

		if (check_count == 0)
		{
			$('#remove-active-from-campaign').css('display', 'none');
		}
	}
}

/**
 * Returns total active subscribers count.
 **/
function getAvailableActiveContacts()
{

	if (App_Workflows.active_subscribers_collection.collection.toJSON()[0] && App_Workflows.active_subscribers_collection.collection.toJSON()[0].count)
	{
		var current_active_subscribers_count = App_Workflows.active_subscribers_collection.collection.toJSON()[0].count;
		return current_active_subscribers_count;
	}

	return App_Workflows.active_subscribers_collection.collection.toJSON().length;

}

/**
 * Returns subscribers base collection view object for given params.
 * 
 * @param workflow_id - 
 * 				workflow (or campaign) id
 * @param fetch_url -
 * 				rest url to get subscribers
 * 
 * @param template-key - 
 * 				id of subscribers html template
 * 
 **/
function get_campaign_subscribers_collection(workflow_id, fetch_url, template_key)
{
	/* Set the designer JSON. This will be deserialized */
	var workflow_model = App_Workflows.workflow_list_view.collection.get(workflow_id);
	var workflow_name = workflow_model.get("name");

	var subscribers_collection = new Base_Collection_View({ 
		url : fetch_url, 
		templateKey : template_key,
		individual_tag_name : 'tr', 
		cursor : true,
		page_size : 20,
		postRenderCallback : function(el)
		{
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$("time.campaign-started-time", el).timeago();
				$("time.campaign-completed-time", el).timeago();
			});

			$('#subscribers-campaign-name').text(workflow_name);

		},
		appendItemCallback : function(el)
		{
			$("time.campaign-started-time", el).timeago();
			$("time.campaign-completed-time", el).timeago();
		} });

	return subscribers_collection;
}

/**
 * Fills pad-content for all, active, completed and removed 
 * subscribers when empty json obtains.
 * 
 * @param id -
 *          slate div id.
 * @param type - 
 *          to match with SUBSCRIBERS_PAD_CONTENT json key
 **/
function fill_subscribers_slate(id, type)
{
	var SUBSCRIBERS_PAD_CONTENT = {
		    "active-subscribers": {
		        "title": "Campaign does not have any active subscriber",
		        "description": "You can add subscribers from Contacts tab - using the Bulk Actions option",
		        "button_text" : "Add subscribers",
				"route" : "#contacts",
		        "image": "/img/clipboard.png"
		    },
		    "completed-subscribers": {
		        "title": "No contact assigned to this campaign",
		        "description": "You can add subscribers from Contacts tab - using the Bulk Actions option",
		        "button_text" : "Add subscribers",
				"route" : "#contacts",
		        "image": "/img/clipboard.png"
		    },
		    "removed-subscribers": {
		        "title": "No contact removed from this campaign",
		        "description": "Removed subscribers are the contacts deleted from the active campaign",
		        "image": "/img/clipboard.png"
		    },
		    "all-subscribers": {
		        "title": "No current or past subscribers for this campaign",
		        "description": "You can add subscribers from Contacts tab - using the Bulk Actions option",
		        "button_text" : "Add subscribers",
				"route" : "#contacts",
				"image": "/img/clipboard.png"
		    }
		}

	$("#" + id).html(getTemplate("empty-collection-model", SUBSCRIBERS_PAD_CONTENT[type]));
}
/**
 * validate.js is used to validate the forms in the application, isValidFom
 * method validates the form element
 * 
 * @param form
 * @returns
 */
function isValidForm(form) {

	// Credit card validation to check card is valid for next 3 months
	jQuery.validator.addMethod("atleastThreeMonths", function(value, element) {

			// Gets the exp_month field because expiry should be
			// checked both on month and year
			var month = $(element).siblings('select.exp_month')
					.val(), year = value;

			// date selected
			var date = new Date().setFullYear(year, month - 1);

			// Get number of milliseconds per day
			var one_day = 1000 * 60 * 60 * 24;

			// Calculates number of days left from the current date,
			// if number of days are greater than 90 then returns
			// true
			return this.optional(element)
					|| (((date - new Date().getTime()) / one_day) > 90);
		}, "Card should be atleast 3 months valid");
	
	// Validates multiple emails separated by comma entered in textbox
	jQuery.validator.addMethod("multipleEmails", function(value, element) {
        
		if (this.optional(element)) // return true on optional element
            return true;
        
        var emails = value.split(/[,]+/); // split element by , 
        valid = true;
        
        for (var i in emails) {
            value = emails[i];
            valid = valid &&
                    jQuery.validator.methods.email.call(this, $.trim(value), element);
        }
        
        return valid;
    }, "Please enter valid email each separated by comma.");

	// Internal regex of jQuery validator allows for special characters in e-mails.
	// This regex solves that, overriding 'email'
	jQuery.validator.addMethod("email", function(value, element){
		
		if(this.optional(element))
			return true;
		
		return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/i.test(value);
	}," Please enter a valid email.");
	
	// Phone number validation
	jQuery.validator.addMethod("phone", function(value, element){
		
		if(this.optional(element))
			return true;
		
		//return /^(\()?(\d{3})([\)-\. ])?(\d{3})([-\. ])?(\d{4})$/.test(value);
		return /^[^a-zA-Z]+$/.test(value);
	}," Please enter a valid phone number.");
	
	jQuery.validator.addMethod("multi-tags", function(value, element){
		
		var	tag_input = $(element).val()
		$(element).val("");
		if(tag_input && tag_input.length>=0 && !(/^\s*$/).test(tag_input))
		{
			$(element).closest(".control-group").find('ul.tags').append('<li class="tag" style="display: inline-block;" data="'+tag_input+'">'+tag_input+'<a class="close" id="remove_tag" tag="'+tag_input+'">&times</a></li>');
		}
		
		return $(element).closest(".control-group").find('ul.tags > li').length > 0 ? true : false;
	}," This field is required.");
	
	$(form).validate({
		rules : {
			atleastThreeMonths : true,
			multipleEmails: true,
			email: true,
			phone: true
		},
		debug : true,
		errorElement : 'span',
		errorClass : 'help-inline',

		// Higlights the field and addsClass error if validation failed
		highlight : function(element, errorClass) {
			$(element).closest('.controls').addClass('single-error');
		},

		// Unhiglights and remove error field if validation check passes
		unhighlight : function(element, errorClass) {
			$(element).closest('.controls').removeClass('single-error');
		},
		invalidHandler : function(form, validator) {
			var errors = validator.numberOfInvalids();
		}
	});

	// Return valid of invalid, to stop from saving the data
	return $(form).valid();
}

function isNotValid(value) {
    if (value == undefined) return true;
    if (value.length == 0) return true;
    return false;
}


function isValidField(id) {
    var value = $('#' + id).val();
    return !isNotValid(value);
}/**
 * Serialize.js is used to serialize the forms, It returns a map, with field
 * values in form mapped against field names in the form as keys. It uses jquery
 * serializeArray method to serialize field value, and also provides custom
 * serializations for fields, to get custom values form the fields.
 * 
 * @param form_id
 *            Sends form id to be serialized
 * @returns JSON returns serialized form values
 */

function serializeForm(form_id) {
	var arr = $('#' + form_id).serializeArray(), obj = {};

	/*
	 * Serializes check box, though serialization for check box is available in
	 * SerializeArray which return "on", if checked. Since it is required to
	 * return true, if check box field is checked, so serialization is
	 * customized for checkbox.
	 */
	arr = arr.concat($('#' + form_id + ' input[type=checkbox]').map(function() {
		return {
			"name" : this.name,
			"value" : $(this).is(':checked')
		}
	}).get());

	// Change the dates properly from human readable strings to epoch
	/*
	 * Date fields, fields html elements with class "date" are serialized
	 * returns epoch time.
	 */
	arr = arr.concat($('#' + form_id + ' input.date').map(function() {
		return {
			"name" : this.name,
			"value" : new Date(this.value).getTime() / 1000
		};
	}).get());
	
	arr = arr.concat($('#' + form_id + ' select.multi-select').map(function() {
		console.log($(this).val());
		return {
			"name" : this.name,
			"value" : $(this).val()
		};
	}).get());
	console.log(arr);
	

	// Serialize tags
	arr = arr.concat(get_tags(form_id));


	/*
	 * Multiple select, If field is of type muti select then this returns set of
	 * values selected with the name of the field. To use this multi select,
	 * field element should have a class "multiSelect" and value in ms-value/
	 * Multi select is used for creating a custom view, it uses
	 * jquery.multiselect
	 */
	arr = arr.concat($('#' + form_id + ' .multiSelect').map(function() {
		var fields_set = [];

		// Gets list of options, selected and pushes the field values in to an
		// array fields_set
		$.each($(this).children('li'), function(index, data) {
			fields_set.push(($(data).attr('ms-value')))
		});

		// The array of selected values are mapped with the field name and
		// returned as a key value pair
		return {
			"name" : $(this).attr('name'),
			"value" : fields_set
		};
	}).get());
	
	arr = arr.concat($('#' + form_id + ' .multiple-checkbox').map(function() {
		var fields_set = [];

		$('input:checkbox:checked', this).each(function(index, element_checkbox){
			fields_set.push($(element_checkbox).val());
		});
		
		console.log(fields_set);

		// The array of selected values are mapped with the field name and
		// returned as a key value pair
		return {
			"name" : $(this).attr('name'),
			"value" : fields_set
		};
	}).get());

	/*
	 * Chained select, Chained select is used for filters, which uses logical
	 * input relation, field show have a class name "chained". Iterates through
	 * fields under element with class "chained", finds "div" element in it
	 */
	// Stores build rules based on chained select
	
	var chained_selects = $('#' + form_id + ' .chained-table');
	$.each(chained_selects, function(index, element){
		var json_array = [];
	arr = arr.concat($(element).find('.chained').map(function() {
		
		var json_object = serializeChainedElement(this);
		json_array.push(json_object);
	
		// Maps json array with name "rules"
		return {
			"name" : $(this).attr('name'),
			"value" : json_array
		};

	}).get());
	});

	// Converts array built from the form fields into JSON
	for ( var i = 0; i < arr.length; ++i) {
		obj[arr[i].name] = arr[i].value;
	}

	// obj[ $('#' + form_id + ' select').attr('name') ] = $('#' + form_id + '
	// select').val();
	return obj;
}

function serializeChainedElement(element)
{
	var json_object = {};
	$.each($(element).find('div').children(), function(index, data) {
		
		var tagName = $(data)[0].tagName;
		
		if(!(tagName == "TEXTAREA" || tagName == "INPUT" || tagName == "SELECT"))
			return;
		// Gets the name of the tr
		var name = $(data).parent().attr('name');
		var value;

		// If type of the field is "date" then return epoch time
		if ($(data).hasClass("date")) {
			var date = new Date($(data).val());
			value = getGMTTimeFromDate(date);
		}

		// Value of input/select
		else
			{
			if(!json_object[name])
				value = $(data).val();
			}

		// Set if value of input/select is valid
		if (value != null && value != "")
			json_object[name] = value;
		// Pushes each rule built from chained select in to an JSON array
	});
	return json_object;
}


$(function(){
	//Focus first element
	$.fn.focus_first = function() {
		
		var elem = $(this).find('input:visible').not('.hide').get(0);
		var textarea = $('textarea:visible', this).get(0);
		if (textarea && elem) {
			if (textarea.offsetTop < elem.offsetTop) {
				elem = textarea;
			}
		}
  
		if (elem) {
			$(elem).focus();
		}
		return this;
	}
	
	$('.modal').on('shown', function(event){
		$('form', this).focus_first();
	});
});/**
 * Deserialize.js It deserializes the form with the data, it is used while
 * editing data, it pre fills the form with the data to be edited.
 * 
 * deserializeForm(data, form) function iterates through data and finds the
 * element with respect to the name attribute of the field to fill the basic
 * fields i.e., input field, check box, select filed. This function includes
 * functionalities to deserialize the fields designed with custom functionality.
 * 
 * @param data
 *            data to be filled in form
 * @param form
 *            html form element
 */
function deserializeForm(data, form)
{

	// Iterates through the data(which is to be populated in the form) and finds
	// field elements in the form based on the name of the field and populates
	// it. i represents key of the map, el is the value corresponding to key
	$
			.each(
					data,

					function(i, el)
					{

						// Finds the element with name attribute same as the key
						// in the JSON data
						var fel = form.find('*[name="' + i + '"]'), type = "", tag = "";

						// If Fields exist with the field name, process the
						// fields to fill the data in the form
						if (fel.length > 0)
						{

							// Reads the tag name of the field
							tag = fel[0].tagName.toLowerCase();

							// If tag of the element is of type select of
							// textarea fills the data
							if (tag == "select" || tag == "textarea")
							{ // ...
								$(fel).val(el);
							}

							/*
							 * If tag of the field is input type, checks whether
							 * input field is a date field, to generate date
							 * based on epoch time and fills in the input
							 * field(date fields uses bootstrap datepicker in
							 * the fileds)
							 */
							else if (tag == "input")
							{
								type = $(fel[0]).attr("type");

								/*
								 * If field has class date, calculates the date
								 * and fills in the input field, formats with
								 * datepicker
								 */
								if (fel.hasClass('date'))
								{
									try
									{
										fel.val(new Date(el * 1000).format('mm/dd/yyyy'));
									}
									catch (err)
									{

									}
									fel.datepicker({ format : 'mm/dd/yyyy', });
								}

								/*
								 * If type of the field is text of password or
								 * hidden fills the data
								 */
								else if (type == "text" || type == "password" || type == "hidden" || type == "number")
								{
									fel.val(el);
								}
								else if (tag == "select")
								{
									fel.val(el).trigger('change');
								}

								// Checks the checkbox if value of the filed is
								// true
								else if (type == "checkbox")
								{
									if (el)
									{
										if (el == true)
											fel.attr("checked", "checked");
									}
									else
									{
										fel.removeAttr("checked");
									}
								}

								/*
								 * If type of the field is "radio", then filters
								 * the field based on the value and checks it
								 * accordingly
								 */
								else if (type == "radio")
								{
									fel.filter('[value="' + el + '"]').attr("checked", "checked");
								}
							}

							/*
							 * Deserialize multiselect, select box to select
							 * multiple values, used for contact custom views.
							 * This is for the fields which uses
							 * jquery.multi-select.js, it provides multiSelect()
							 * function to fill the select
							 */
							else if (fel.hasClass('multiSelect') && tag == 'ul')
							{

								/*
								 * Iterates through options of the select and
								 * call multiSelect function to select the
								 * option
								 */
								$.each(el, function(index, option)
								{
									$('#multipleSelect', form).multiSelect('select', option);
								});
							}

							/*
							 * Deserialize tags, tags are represented by list
							 * elements prepended the respective input field. If
							 * field has class tagsinput and tag is ul and
							 * attribute of the field is contacts, then is field
							 * is considered as the tags field, it de-serializes
							 * the contact tags
							 */
							else if (fel.hasClass('tagsinput') && tag == "ul" && fel.hasClass('contacts'))
							{
								// Iterates through contacts to create a tag
								// element for each contact
								$
										.each(
												data.contacts,

												function(index, contact)
												{
													var tag_name;

													/*
													 * tag_id represents
													 * contact.id, values of the
													 * tags(li) are contact ids
													 */
													var tag_id = contact.id;

													/*
													 * tag_name represent the
													 * name of the contact
													 * first_name and last_name
													 */
													tag_name = getContactName(contact);

													/*
													 * Creates a tag for each
													 * contact and appends to
													 * tags input field with
													 * class "tagsinput", tag
													 * value is contact id and
													 * name of li element is
													 * contact full name
													 */
													$('.tagsinput', form)
															.append(
																	'<li class="tag" data="' + tag_id + '" class="tag"  style="display: inline-block; "><a href="#contact/' + contact.id + '">' + tag_name + '</a><a class="close" id="remove_tag">&times</a></li>');
												});
							}

							/*
							 * Deserialize multiselect, select box to select
							 * multiple values, used for contact custom views.
							 * This is for the fields which uses
							 * jquery.multi-select.js, it provides multiSelect()
							 * function to fill the select
							 */
							else if (fel.hasClass('multiSelect') && tag == 'ul')
							{

								/*
								 * Iterates through options of the select and
								 * call multiSelect function to select the
								 * option
								 */
								$.each(el, function(index, option)
								{
									$('#multipleSelect', form).multiSelect('select', option);
								});
							}
							
							/**
							 * Deserialize multiple checkboxes. 
							 */
							else if (fel.hasClass('multiple-checkbox')) {

								/*
								 * Iterates through options of the select and
								 * call multiSelect function to select the
								 * option
								 */
								for(var i=0 ; i < el.length; i++)
								{
									$('input:checkbox[value="'+el[i]+'"]', fel).attr("checked", "checked");
								}
							}

							/*
							 * Deserialize chained select, chained select is
							 * used for creating filters. It is logical chaining
							 * of the input fields, If form contains an element
							 * with class "chainedSelect" the deserializes the
							 * chained select. Chained select fields can be
							 * multiple, if value include multiple rules a
							 * chained select field should is added to the form
							 * and populates with the value
							 */
							else if (fel.hasClass('chainedSelect'))
							{

								// deserializeChainedSelect(form, el);
							}
						}

					});
}

// To deserialize multiple forms in content
/**
 * Desrializes the multiple forms, It calls deserializeForm for each form in the
 * element passed. Called from base-model when there are multiple forms with
 * single save option.
 * 
 * @param data
 *            data to be filled in forms
 * @param form
 *            html element with multiple forms
 */
function deserializeMultipleForms(data, form)
{
	// Iterates through each form element in the form and calls
	// deseriazlie of each form with respective data element
	// based on key(i.e., name of the form)
	$.each(form, function(index, form_element)
	{
		// Reads the name of the form element
		var key = $(form_element).attr('name');

		// If form have attribute name deserializes with particular object
		if (key && data[key])
		{
			deserializeForm(data[key], $(form_element));
		}

		// If data with the key is not available then calls
		// deserialize on the data directly, since form values
		// can be directly available in the JSON object
		else
			deserializeForm(data, $(form_element));
	});
}

function deserializeChainedSelect(form, el, el_self)
{

	// Iterates through JSON array of rules, to fill
	// a chained select
	$.each(el, function(index, data)
	{

		// Finds the rule html element
		var rule_element = ($(form).find('.chained'))[0];

		/*
		 * If more than one rule clones the fields and relate with
		 * jquery.chained.js
		 */
		if (index > 0)
		{
			var parent_element = $(rule_element).parent();

			/*
			 * Gets the Template for input and select fields
			 */
			rule_element = $($(el_self).clone().find('.chained'))[0];

			// Add remove icon for rule
			$(rule_element).find("i.filter-contacts-multiple-remove").css("display", "inline-block");

			var remove_icon = $(rule_element).find("i.filter-contacts-multiple-remove").css("display", "inline-block");

			// Loads jquery chained plugin for chaining
			// the input fields
			// head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js',

			// function ()
			// {

			/*
			 * Chains dependencies of input fields with jquery.chained.js based
			 * on the rule element
			 */
			chainFilters(rule_element, el);

			$(parent_element).append(rule_element);
			deserializeChainedElement(data, rule_element);

			// });

			return;
		}

		deserializeChainedElement(data, rule_element);
	})
}

function deserializeChainedElement(data, rule_element)
{
	$.each(data, function(i, value)
	{
		var input_element = ($(rule_element).find('*[name="' + i + '"]').children())[0];
		if (!input_element)
			return;

		// If input field set is value for input field, checks it chained select
		// elements
		// date fields should be filled with date
		if (input_element.tagName.toLowerCase() == "input")
		{

			// Fills date in to fields and initialize datepicker on the field
			if ($(input_element).hasClass('date'))
			{
				value = getLocalTimeFromGMTMilliseconds(value);

				$(input_element).val(new Date(parseInt(value)).format('mm/dd/yyyy'));

				$(input_element).datepicker({ format : 'mm/dd/yyyy', });

				$(input_element).datepicker('update');

				return;
			}
			$(input_element).val(value);
			return;
		}

		// Gets related select field
		var option_element = $("option", input_element);

		// Iterates through options in select field
		$.each(option_element, function(index, element)
		{
			// Selects the option
			if ($(element).attr('value') == value)
			{
				$(element).attr("selected", "selected");
				var url = $(element).attr("url");
				if (url)
				{
					$(element).attr("data", data.RHS);
					console.log($(element));
				}
				$(input_element).trigger("change");
				return;
			}
		});
	});

}

function deserializeChainedElementWebrule(data, rule_element)
{
	$.each(data, function(i, value)
	{
		if (value.value)
			value = value.value;
		var input_element_set = $(rule_element).find('*[name="' + i + '"]').children();

		var input_element = input_element_set[0];
		if (!input_element)
			return;

		var tag_name = input_element.tagName.toLowerCase();
		if (tag_name != "input" && tag_name != "textarea" && tag_name != "select" && input_element_set.length > 1)
			$.each(input_element_set, function(index, input)
			{
				if (index == 0)
					return;
				tag_name = input.tagName.toLowerCase();
				if (tag_name == "input" || tag_name == "textarea" || tag_name == "select")
				{
					input_element = input;
					return false;
				}

			})

		if (!input_element)
			return;

		// If input field set is value for input field, checks it chained select
		// elements
		// date fields should be filled with date
		if (input_element.tagName.toLowerCase() == "input" || input_element.tagName.toLowerCase() == "textarea")
		{
			$(input_element).val(value);
			if ($(input_element).hasClass('custom_html'))
			{

				if (value.value)
				{
					$(input_element).val(value.value);
				}
				// setupHTMLEditor($(input_element), value.value);
				// }
				// else
				// setupHTMLEditor($(input_element), value);
			}

			return;
		}

		// Gets related select field
		var option_element = $("option", input_element);

		// Iterates through options in select field
		$.each(option_element, function(index, element)
		{
			// Selects the option
			if ($(element).attr('value') == value)
			{
				$(element).attr("selected", "selected");
				$(input_element).trigger("change");
				return;
			}
		});
	});
}

function deserializeChainedSelect1(form, el, element)
{

	var self = $(element).find('.webrule-actions')[0];

	var rule_element_default = $(self).html();

	// Finds the rule html element
	var rule_element = ($(form).find('.webrule-actions'))[0];

	// Iterates through JSON array of rules, to fill
	// a chained select
	$.each(el, function(index, data)
	{

		/*
		 * If more than one rule clones the fields and relate with
		 * jquery.chained.js
		 */
		if (index > 0)
		{

			/*
			 * Gets the Template for input and select fields
			 */

			// Loads jquery chained plugin for chaining
			// the input fields
			// head.js('lib/agile.jquery.chained.min.js',
			// function ()
			// {
			var new_rule_element = $(rule_element_default).clone();

			// Add remove icon for rule
			$(new_rule_element).find("i.webrule-multiple-remove").css("display", "inline-block");

			var actions = [];
			actions.push(data);
			/*
			 * Chains dependencies of input fields with jquery.chained.js based
			 * on the rule element
			 */
			chainWebRules(new_rule_element, el, false, actions);

			deserializeChainedElementWebrule(data, new_rule_element);

			$(rule_element).append(new_rule_element);

			// });
			// return;
			return;
		}

		deserializeChainedElementWebrule(data, rule_element);
	})
}
$(function()
{
	// Collapses the menu on a mobile device
	// Without this, the user has to click the collapsible button to remove the menu
	$('.agile-menu > li').click(function(e){
	    
		console.log("Collapsing before ul");
		$nav_collapse = $(this).closest('.nav-collapse');
		console.log($nav_collapse.attr('class'));
		if($nav_collapse.hasClass('collapse'))
		{
			console.log("Collapsing");
			$nav_collapse.collapse('hide');
		}
	});

	// Scroll to top
	$(window).load(function() {
		$("#top").click(function () {
			$("body, html").animate({
				scrollTop: 0
			}, 300);
			return false;
		}); 
	});
});	

		/**
 * Zoomifier code to show their template in send email template
 */
 function loadZoomifierDocSelector() {
	 var loggedInUser = CURRENT_DOMAIN_USER.email;
	 var selectedContact = getPropertyValue(App_Contacts.contactDetailView.model.attributes.properties, "email");
	 var picker = new Zoomifier.PickerBuilder().
				setPartnerKey('dwqs4rxjksqpldwqklnpes8hs=').
				setCallback(zoomifierDocSelectionCallback).
				setSalesUser(loggedInUser).
				setTargetCustomer(selectedContact).
				build();
  }
 
 /**
  * Appends the data or template fetched from zoomifier
  * @param data
  */
  function zoomifierDocSelectionCallback(data) {
		data = "</br>" + data + "</br>";
		//Fill html editor with template body
		var wysihtml5 = $('#body').data('wysihtml5');
		
		if(wysihtml5){
			editor.focus();
			wysihtml5.editor.composer.commands.exec("insertHTML",data);
		}
  }