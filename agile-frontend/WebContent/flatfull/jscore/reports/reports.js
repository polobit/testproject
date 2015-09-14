//Stores report object, so it can be used while creating report table headings
var REPORT;
/**
 * Initializes listener to perform various event function related to contact
 * reports
 */
function initializeReportsListeners(){


	$('#reports-listerners-container')
			.on(
					'click',
					'#reports-email-now',
					function(e)
					{
						// e.preventDefault();
						e.stopPropagation();

						var id = $(this).attr('data');
						var url='core/api/reports/send/' + id;
						$('#report-send-confirmation').modal('show');
						initializeReportSendConfirm(url);
						
					});

	$('#reports-listerners-container').on(
			'click',
			'#campaign_id',
			function(e)
			{
				e.preventDefault();
				e.stopPropagation();
				$.ajax({ url : '/core/api/workflows?page_size=1', type : 'GET', dataType : "json",
					accept : { json : 'application/json', xml : 'application/xml' }, success : function(data)
					{
						if (data[0])
						{
							window.document.location = "#email-reports/" + data[0].id;
							$(window).scrollTop(0);
						}
						else
							window.document.location = "#workflows";

						return;

					}, error : function(response)
					{
						alert("error occured Please try again");
						window.document.location = "#reports";
					} });

			});

	$('#reports-listerners-container').on('click', '#report-instant-results', function(e) 
			{
		e.stopPropagation();
		
	});

	$('#reports-listerners-container').on('change', '#frequency, #duration', function(e) 
			{

		var container = $(this).attr("id") == "duration" ? "contact" : "activity";
		updateWeekDayReportVisibility($(this).val(), container);
	});

	/*
	 * author jaagdeesh
	 */
	$('#reports-listerners-container').on('click', '#report-dashlat-navigate', function(e)
	{
		e.preventDefault();

		Backbone.history.navigate("add-dashlet", { trigger : true });

	});

	$('#reports-listerners-container').on('click', '#activity_advanced', function(e)
	{
		e.preventDefault();
		var el = $("#activity_advanced span i");
		el.toggleClass("fa-minus").toggleClass("fa-plus");

		});


	$('#reports-listerners-container').on('click', '#report_advanced', function(e) 
			{
		e.preventDefault();
		var el = $("#report_advanced span i");
		el.toggleClass("fa-minus").toggleClass("fa-plus");
			});
}

function reportsContactTableView(base_model, customDatefields, view)
{
	/*
	 * Old Code : Using this fails on firefox, works on Chrome though // Creates
	 * list view for var itemView = new Base_List_View({ model : base_model,
	 * template : 'contacts-custom-view-model', tagName :
	 * this.options.individual_tag_name }); // Reads the modelData (customView
	 * object) var modelData = this.options.modelData; // Reads fields_set from
	 * modelData var fields = modelData['fields_set']; // Converts base_model
	 * (contact) in to JSON var contact = base_model.toJSON(); // Clears the
	 * template, because all the fields are appended, has to be reset // for
	 * each contact $('#contacts-custom-view-model-template').empty(); //
	 * Iterates through, each field name and appends the field according to //
	 * order of the fields $.each(fields, function(index, field_name) {
	 * if(field_name.indexOf("properties_") != -1) field_name =
	 * field_name.split("properties_")[1];
	 * 
	 * $('#contacts-custom-view-model-template').append(
	 * getTemplate('contacts-custom-view-' + field_name, contact)); }); //
	 * Appends model to model-list template in collection template $(("#" +
	 * this.options.templateKey + '-model-list'), this.el).append(
	 * itemView.render().el); // ----------- this line fails on Firefox
	 */

	var modelData = view.options.modelData; // Reads the modelData (customView
	// object)
	var fields = modelData['fields_set']; // Reads fields_set from modelData
	var contact = base_model.toJSON(); // Converts base_model (contact) in to
	// JSON
	var final_html_content = "";
	var element_tag = view.options.individual_tag_name;
	var templateKey = view.options.templateKey;

	// Iterates through, each field name and appends the field according to
	// order of the fields
	$.each(fields, function(index, field_name)
	{

		if (field_name.indexOf("custom_") != -1)
		{
			field_name = field_name.split("custom_")[1];
			var property = getProperty(contact.properties, field_name);
			if (!property)
				property = {};

			var template_name = "contacts-custom-view-custom";
			if (isDateCustomField(customDatefields, property))
				template_name = 'contacts-custom-view-custom-date';

			getTemplate(template_name, property, undefined, function(template_ui)
			{
				if (!template_ui)
					return;

				final_html_content += $(template_ui);
			}, null);

			return;
		}

		if (field_name.indexOf("properties_") != -1)
			field_name = field_name.split("properties_")[1];

		getTemplate('contacts-custom-view-' + field_name, contact, undefined, function(template_ui)
		{
			if (!template_ui)
				return;
			final_html_content += $(template_ui);

		}, null);

	});

	// Appends model to model-list template in collection template
	$(("#" + templateKey + '-model-list'), view.el).append('<' + element_tag + '>' + final_html_content + '</' + element_tag + '>');

	// Sets data to tr
	$(('#' + templateKey + '-model-list'), view.el).find('tr:last').data(base_model);

}

function deserialize_multiselect(data, el)
{
	$("#reports-listerners-container").html(el);

	if (!data['fields_set'])
		return;
	$.each(data['fields_set'], function(index, field)
	{
		$('#multipleSelect', el).multiSelect('select', field);
	});

	$('.ms-selection', el).children('ul').addClass('multiSelect').attr("name", "fields_set").attr("id", "fields_set").sortable();
}

function getEpochTimeFromReport(time, day, frequency)
{

	var time_array = new Array();
	var d = new Date();
	var hour, min;
	if (time)
	{
		time_array = time.toString().split(':');
		hour = time_array[0];
		min = time_array[1];
	}

	if (frequency == "DAILY")
	{
		var date = new Date();

		var day_of_month = date.getDate();

		date.setDate(day_of_month + 1);
		date.setHours(hour);
		date.setMinutes(min);
		return (date.getTime()) / 1000;

	}

	if (frequency == "WEEKLY")
	{
		var date = new Date();

		var weekday = date.getDay();
		var day_of_month = date.getDate();

		if (day > weekday)
		{
			day_of_month += (parseInt(day) - weekday);
		}
		else
		{
			day_of_month = (day_of_month - (weekday - parseInt(day))) + 7;
		}

		date.setDate(day_of_month);
		date.setHours(hour);
		date.setMinutes(min);
		return (date.getTime()) / 1000;

	}

	if (frequency == "MONTHLY")
	{
		var date = new Date();
		var day_of_month = date.getDate();
		var month_in_year = date.getMonth();
		if (day > day_of_month)
		{
			month_in_year = month_in_year;
		}
		else
		{
			month_in_year = month_in_year + 1;
		}
		date.setMonth(month_in_year);
		date.setDate(day);
		date.setHours(hour);
		date.setMinutes(min);
		return (date.getTime()) / 1000;

	}

}

function getNextMonthEppoch(time, day, month)
{
	var time_array = new Array();
	var hour, min;
	if (time)
	{
		time_array = time.toString().split(':');
		hour = time_array[0];
		min = time_array[1];
	}
	var date = new Date();
	var day_of_month = date.getDate();
	var month_in_year = date.getMonth();
	if (day > day_of_month)
	{
		month_in_year = month_in_year + 1;
	}
	else
	{
		month_in_year = month_in_year + 2;
	}

	date.setMonth(month_in_year);
	date.setDate(day);
	date.setHours(hour);
	date.setMinutes(min);
	return (date.getTime()) / 1000;
}


function updateWeekDayReportVisibility(report_value, container_id){

		var day_visibility = "none", weekday_visibility = "none", time_visibility = "none";
		if (report_value == "DAILY")
		{
			time_visibility = "block";
		}
		else if (report_value == "WEEKLY")
		{
			weekday_visibility = "block";
			time_visibility = "block";
		}
		else if (report_value == "MONTHLY")
		{
			time_visibility = "block";
			day_visibility = "block";
		}

		$("#" + container_id + "_report_weekday").css("display",weekday_visibility );
		$("#" + container_id + "_report_day").css("display", day_visibility);
		$("#" + container_id + "_report_time").css("display", time_visibility);

}
