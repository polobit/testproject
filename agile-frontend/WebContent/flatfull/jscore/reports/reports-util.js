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
} };

/* Loads libraries needed for reporting * */
function initReportLibs(callback)
{

	head.load(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js', function()
	{
		callback();

	});
}

function loadActivityReportLibs(callback)
{

	head.js(LIB_PATH + 'lib/jquery.multi-select.js', CSS_PATH + 'css/businesshours/jquerytimepicker.css', LIB_PATH + 'lib/businesshours/jquerytimepicker.js',
			function()
			{
				callback();
			});

}
