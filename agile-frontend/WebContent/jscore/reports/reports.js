// Stores report object, so it can be used while creating report table headings
var REPORT;
$(function()
{

	$("#reports-email-now")
			.die()
			.live(
					'click',
					function(e)
					{
						// e.preventDefault();
						e.stopPropagation();

						var id = $(this).attr('data');

						var confirmationModal = $('<div id="report-send-confirmation" class="modal fade in">' + '<div class="modal-header" >' + '<a href="#" data-dismiss="modal" class="close">&times;</a>' + '<h3>Send Report</h3></div>' + '<div class="modal-body">' + '<p>You are about to send report.</p>' + '<p>Do you want to proceed?</p>' + '</div>' + '<div class="modal-footer">' + '<div><span class="report-message" style="margin-right:5px"></span></div>' + '<div>' + '<a href="#" id="report-send-confirm" class="btn btn-primary">Yes</a>' + '<a  href="#" class="btn close" data-dismiss="modal" >No</a>' + '</div>' + '</div>' + '</div>' + '</div>');

						confirmationModal.modal('show');

						$("#report-send-confirm", confirmationModal)
								.click(
										function(event)
										{
											event.preventDefault();

											if ($(this).attr("disabled"))
												return;

											$(this).attr("disabled", "disabled");

											$
													.get(
															'core/api/reports/send/' + id,
															function(data)
															{

																console.log("sending email");
																$save_info = $('<div style="display:inline-block"><small><p class="text-success"><i>Report will be sent shortly</i></p></small></div>');

																$('.report-message').html($save_info);

																$save_info.show();

																setTimeout(function()
																{
																	(confirmationModal).modal('hide');
																}, 2000);

															})
													.fail(
															function(response)
															{
																$save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>' + response.responseText + '</i></p></small></div>');

																$('.report-message').html($save_info);

																$save_info.show();

																setTimeout(function()
																{
																	(confirmationModal).modal('hide');
																}, 2000);

															});
										});
					});
	$("#campaign_id").die().live(
			'click',
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
	$("#report-instant-results").die().live('click', function(e)
	{
		e.stopPropagation();
		var id = $(this).attr('data');
		console.log(id);
		/*
		 * Backbone.history.navigate("report-results/" + id, { trigger: true });
		 */
	});

	$("#frequency").die().live('change', function(e)
	{
		var frequency = $("#frequency").val();
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
	});

	
	/*
	 * author jaagdeesh
	 */
	$("#activity_advanced").die().live('click', function(e)
	{
		e.preventDefault();

	});

	$('#activity-advanced-block').live('shown', function()
	{
		$('#activity_advanced').html('<span><i class="icon-minus"></i></span> Advanced');

	});

	$('#activity-advanced-block').live('hidden', function()
	{
		$('#activity_advanced').html('<span><i class="icon-plus"></i></span> Advanced');
	});
	
	$("#report_advanced").die().live('click', function(e)
			{
				e.preventDefault();

			});

			$('#report-advanced-block').live('shown', function()
			{
				$('#report_advanced').html('<span><i class="icon-minus"></i></span> Advanced');

			});

			$('#report-advanced-block').live('hidden', function()
			{
				$('#report_advanced').html('<span><i class="icon-plus"></i></span> Advanced');
			});
			
			
			$("#duration").die().live('change', function(e)
					{
						var frequency = $("#duration").val();
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
					});

})

function reportsContactTableView(base_model, customDatefields, view)
{
	/*
	 * Old Code : Using this fails on firefox, works on Chrome though
	 *  // Creates list view for var itemView = new Base_List_View({ model :
	 * base_model, template : 'contacts-custom-view-model', tagName :
	 * this.options.individual_tag_name });
	 *  // Reads the modelData (customView object) var modelData =
	 * this.options.modelData;
	 *  // Reads fields_set from modelData var fields = modelData['fields_set'];
	 *  // Converts base_model (contact) in to JSON var contact =
	 * base_model.toJSON();
	 *  // Clears the template, because all the fields are appended, has to be
	 * reset // for each contact
	 * $('#contacts-custom-view-model-template').empty();
	 *  // Iterates through, each field name and appends the field according to //
	 * order of the fields $.each(fields, function(index, field_name) {
	 * if(field_name.indexOf("properties_") != -1) field_name =
	 * field_name.split("properties_")[1];
	 * 
	 * $('#contacts-custom-view-model-template').append(
	 * getTemplate('contacts-custom-view-' + field_name, contact)); });
	 *  // Appends model to model-list template in collection template $(("#" +
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

			if (isDateCustomField(customDatefields, property))
				final_html_content += getTemplate('contacts-custom-view-custom-date', property);
			else
				final_html_content += getTemplate('contacts-custom-view-custom', property);

			return;
		}

		if (field_name.indexOf("properties_") != -1)
			field_name = field_name.split("properties_")[1];

		final_html_content += getTemplate('contacts-custom-view-' + field_name, contact);
	});

	// Appends model to model-list template in collection template
	$(("#" + templateKey + '-model-list'), view.el).append('<' + element_tag + '>' + final_html_content + '</' + element_tag + '>');

	// Sets data to tr
	$(('#' + templateKey + '-model-list'), view.el).find('tr:last').data(base_model);

}

function deserialize_multiselect(data, el)
{
	$("#content").html(el);

	if (!data['fields_set'])
		return;
	$.each(data['fields_set'], function(index, field)
	{
		$('#multipleSelect', el).multiSelect('select', field);
	});

	$('.ms-selection', el).children('ul').addClass('multiSelect').attr("name", "fields_set").attr("id", "fields_set").sortable();
}

function getEpochTimeFromReport(time, day,frequency)
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
		
		if(frequency=="DAILY"){
			var date = new Date();
			
			var day_of_month=date.getDate();
			
			
			date.setDate(day_of_month+1);
			date.setHours(hour);
			date.setMinutes(min);
			return (date.getTime())/1000;
			
		}
		
	if(frequency=="WEEKLY"){
		var date = new Date();
		
		var weekday=date.getDay();
		var day_of_month=date.getDate();
		
		if(day > weekday){
			day_of_month+=(parseInt(day)-weekday);
		}
		else{
			day_of_month=(day_of_month-(weekday-parseInt(day)))+7;
		}
		
		date.setDate(day_of_month);
		date.setHours(hour);
		date.setMinutes(min);
		return (date.getTime())/1000;
		
	}
	
	if(frequency=="MONTHLY"){
		var date = new Date();
		var day_of_month=date.getDate();
		var month_in_year=date.getMonth();
		if(day > day_of_month){
			month_in_year=month_in_year;
		}
		else{
			month_in_year = month_in_year+1;
		}
		date.setMonth(month_in_year);
		date.setDate(day);
		date.setHours(hour);
		date.setMinutes(min);
		return (date.getTime())/1000;
		
	}

}

function getNextMonthEppoch(time,day,month){
	var time_array = new Array();
	var hour, min;
	if (time)
	{
		time_array = time.toString().split(':');
		hour = time_array[0];
		min = time_array[1];
	}
	var date = new Date();
	var day_of_month=date.getDate();
	var month_in_year=date.getMonth();
	if(day > day_of_month){
		month_in_year=month_in_year+1;
	}
	else{
		month_in_year = month_in_year+2;
	}
	date.setMonth(month_in_year);
	date.setDate(day);
	date.setHours(hour);
	date.setMinutes(min);
	return (date.getTime())/1000;
}







