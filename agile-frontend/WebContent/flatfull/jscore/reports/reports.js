//Stores report object, so it can be used while creating report table headings
var REPORT;

$(function()
{
  $('body').on('mouseover','.highcharts-container',function(e){
      $(this).find('.highcharts-button').show();
  });
  $('body').on('mouseout','.highcharts-container',function(e){
      $(this).find('.highcharts-button').hide();
  });
  $('body').on('click','.maintab',function(e){
     if($(this).hasClass("reportsliElement"))
     	return ; 
     $(this).find(".sub-nav-tab>li:first").trigger('click')
  });
});
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
						$("#report-send-confirmation").find('input').attr("data",url);
						$('#report-send-confirmation').modal('show');
						initializeReportSendConfirm();
						
					});
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
						$("#report-send-confirmation").find('input').attr("data",url);
						$('#report-send-confirmation').modal('show');
						initializeReportSendConfirm();
						
					});

	$('#reports-listerners-container')
			.on(
					'click',
					'#reports-campaign-email-now',
					function(e)
					{
						// e.preventDefault();
						e.stopPropagation();

						var id = $(this).attr('data');
						var url='core/api/campaignReports/send/' + id;
						$("#report-send-confirmation").find('input').attr("data",url);
						$('#report-send-confirmation').modal('show');
						initializeReportSendConfirm();
						
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
						showAlertModal("retry", undefined, function(){
							window.document.location = "#reports";
						});
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

		$('.col-md-3')
			.on(
					"mouseenter",
					'.show_screenshot',
					function(e) {

						$('.show_screenshot').popover();
					});
			$('.tab-pane')
			.on(
					"click",
					'.report-go',
					function(e) {

						var tab_id=$(this).parents('.tab-pane').attr('id');
						tab_id=$('a[href="#'+tab_id+'"]').parents('.maintab').find('a').attr("href").substring(1);
						_agile_set_prefs('reports_tab', tab_id);
						return;
					
					});
			$('#reports-listerners-container')
			.off(
					"click",'#reports-tab-container>div>ul>li');
			$('#reports-listerners-container')
			.on(
					"click",'#reports-tab-container>div>ul>li',function(e){

						var flag=$(this).find('.sub-nav-tab').is(":visible");
						if($('.reports_tab_content').is(":visible"))
							$('.reports_tab_content').hide();
						$('.sub-nav-tab').hide();
						if(flag){
							//$("i", this).first().removeClass("fa-minus").addClass("fa-plus");
							$(this).find('.sub-nav-tab').hide();
						}
							
						else{
							//$("i", this).first().removeClass("fa-plus").addClass("fa-minus");
							$(this).find('.sub-nav-tab').show();
						}
						//$('.reports_tab_content').show();
					});

		$('#reports-listerners-container')
			.off("mouseenter",'.sub-nav-tab');
			$('#reports-listerners-container')
			.on("mouseenter",'.sub-nav-tab',function(e){
					$('.reports_tab_content').show();
					var top= $(this).offset().top;top = top-130;
					$('.reports_tab_content').css('top',top+'px')
				});

			$('#reports-listerners-container')
			.off("mouseleave",'#reports-tab-container');
			$('#reports-listerners-container')
			.on("mouseleave",'#reports-tab-container',function(e){
					$('.reports_tab_content').hide();
					$('.nav-tabs .active').removeClass('active');
				});
				$('#reports-listerners-container')
			.off("mouseover",'.reports_tab_content');
			$('#reports-listerners-container')
			.on("mouseover",'.reports_tab_content',function(e){
					$('.reports_tab_content').hide();				});


			$('#reports-listerners-container')
			.off(
					"mouseover",
					'.sub-nav-tab a');
			$('#reports-listerners-container')
			.on(
					"mouseover",
					'.sub-nav-tab a',
					function(e) {
						var tab_id = $(this).attr('href').substring(1);

		$('.sub-nav-tab a').removeClass('active');
		$('.tab-pane').removeClass('active');

		$(this).addClass('active');
		$("#"+tab_id).addClass('active');
					});

			$('#reports-listerners-container')
			.off(
					"click",
					'.sub-nav-tab li');
			$('#reports-listerners-container')
			.on(
					"click",
					'.sub-nav-tab li',
					function(e) {
						e.preventDefault();
						e.stopPropagation();

						var tab_id=$('a',$(this)).attr('href').substring(1);
						//$('._upgrade','#'+tab_id).trigger('click');
						var upgrade_id=$('._upgrade','#'+tab_id).attr('id');
						var upgrade_span=$('.'+upgrade_id,'#'+tab_id);
						if(upgrade_span.length!=0)
						{$('#reportsUpgradeModal').html(getTemplate('upgradeModal'));
					var cloned_upgrade=upgrade_span.clone();
							$('.modal-body','#reportsUpgradeModal').html(cloned_upgrade);
							$(cloned_upgrade,'.modal-body').show();
							$('.text-info',cloned_upgrade).addClass('upgrade_close');
									$('#reportsUpgradeModal').modal('show');
								}
						var url=($("#"+tab_id).find('a:not(.text-info)').attr('href') || $("#"+tab_id).find('a#call-activity-link').attr('id'))
						if(url!=undefined)
						{
							$("#"+tab_id).find('a').trigger('click');
							if(url=='call-activity-link' || url=='#')
								return;
							url=url.substring(1);
						Backbone.history.navigate(url,{trigger:true});
					}
					});
			$('#reportsUpgradeModal').on('click','.upgrade_close',function(e){
					$('#reportsUpgradeModal').modal('hide');
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

	getTemplate('contacts-custom-view-custom', {}, undefined, function(ui){

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



	 }, null);

}


function deserialize_multiselect(data, el, flag)
{
	$("#reports-listerners-container").html(el);

	if (!data['fields_set'])
		return;
	$.each(data['fields_set'], function(index, field)
	{
	  if(flag !==true)
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
/**This is being invoked from call category -call logs under reports:where it should redirect to activities with calls as a entity type*/
$(function()
		{
	
	$("body").on("click","a#call-activity-link", function(e){
	var entitytype = "Calls";
	var entity_attribute = "CALL";
	buildActivityFilters(entitytype,entity_attribute,"entityDropDown");
	//ActivitylogRouter.activities("id");
	App_Activity_log.navigate("activities", { trigger : true });
	
});
	
		});
