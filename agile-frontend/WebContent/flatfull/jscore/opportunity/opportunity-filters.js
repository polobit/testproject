/**
 * opportunity-filters.js is a script file that handles opportunity filters like
 * pipeline, milestones and owner select list.
 * 
 * @module Deals
 * 
 */
function setupDealFilters(callback)
{
	App_Deals.deal_filters = new Deals_Filter_Change_Events_Collection_View({url : '/core/api/deal/filters', templateKey : "deal-filter-list", 
		sort_collection : false, individual_tag_name : 'li', postRenderCallback : function(el){
			
		} 
	});
	App_Deals.deal_filters.collection.fetch({
		success : function(data){
			if(callback){
				return callback(data);
			}else{
				setNewDealFilters(data);
			}
		}
	});
}
function setNewDealFilters(data){
	if($('#deal-list-filters', $("#opportunity-listners")).find("li").length == 0)
	{
		$('#deal-list-filters', $("#opportunity-listners")).html(App_Deals.deal_filters.render(true).el);
	}

	var cookie_filter_id = _agile_get_prefs("deal-filter-name");
	var report_filter_id = _agile_get_prefs("report_filter_name");
	
	if(report_filter_id){
		$('#opportunity-listners').find('.remove_deal_filter').parent().remove();
		$('#opportunity-listners').find('h3').after('<div class="inline-block tag btn-xs btn-primary m-l-xs"><span class="inline-block m-r-xs v-middle pull-left">'+report_filter_id.replace(/[, ]+/g,"")+'</span><a class="close remove_deal_filter" style="position: relative;top: -3px;">×</a></div>');
		return;
	}

	if(cookie_filter_id && cookie_filter_id != 'my-deals' && data.get(cookie_filter_id) && data.get(cookie_filter_id).get('name')){
		$('#opportunity-listners').find('.remove_deal_filter').parent().remove();
		$('#opportunity-listners').find('h3').after('<div class="inline-block tag btn-xs btn-primary m-l-xs"><span class="inline-block m-r-xs v-middle pull-left">'+data.get(cookie_filter_id).get("name")+'</span><a class="close remove_deal_filter">×</a></div>');
		return;
	}

	if(cookie_filter_id && cookie_filter_id == 'my-deals'){
		$('#opportunity-listners').find('.remove_deal_filter').parent().remove();
		$('#opportunity-listners').find('h3').after('<div class="inline-block tag btn-xs btn-primary m-l-xs"><span class="inline-block m-r-xs v-middle pull-left">{{agile_lng_translate "portlets" "my-deals"}}</span><a class="close remove_deal_filter">×</a></div>');
		return;
	}

	$('#opportunity-listners').find('.remove_deal_filter').parent().remove();
	setupDefaultDealFilters();
}

/**
 * Sets default deal filters in the cookie.
 * 
 */
function setupDefaultDealFilters(){
	var deal_filter_json = {};
	deal_filter_json['owner_id'] = "";
	deal_filter_json['pipeline_id'] = _agile_get_prefs('agile_deal_track');
	deal_filter_json['milestone'] = "";
	deal_filter_json['archived'] = "false";
	deal_filter_json['value_filter'] = "equals";
	_agile_set_prefs('deal-filters', JSON.stringify(deal_filter_json));
}

/**
 * Get the deal filters in the cookie.
 * 
 * @returns
 */
function getDealFilters()
{
	var filterJSON = {};
	if (_agile_get_prefs('deal-filter-name'))
	{
		var cookie_filter_id = _agile_get_prefs('deal-filter-name');
		if(cookie_filter_id == 'my-deals'){
			filterJSON = $.parseJSON(_agile_get_prefs('deal-filters'));
		}else{
			var filterModel = App_Deals.deal_filters.collection.get(cookie_filter_id);
			if(filterModel){
				filterJSON = filterModel.toJSON();
			}
			
			if(filterJSON){
				if((filterJSON.close_date_filter == "LAST" || filterJSON.close_date_filter == "NEXT") && filterJSON.close_date_value ){
					var condays = filterJSON.close_date_value ;
					var date = new Date();
					var eDateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
					if(filterJSON.close_date_filter == "LAST"){
						filterJSON.close_date_end = eDateStart.getTime() / 1000 ;
						filterJSON.close_date_start =(eDateStart.getTime() - ((condays-1)*24 * 60 * 60 * 1000)) / 1000 ;

					}
					else if(filterJSON.close_date_filter == "NEXT"){
						filterJSON.close_date_start = eDateStart.getTime() / 1000 ;
						filterJSON.close_date_end = (eDateStart.getTime() + (condays*24 * 60 * 60 * 1000)) / 1000 ;
					}
				}
				filterJSON.filterOwner = {};
			}
		}
		// Remove the milestone field in the filters if it is milestone view.
		if (filterJSON && !_agile_get_prefs("agile_deal_view")){ 
			var json = filterJSON;
			//if (!json.pipeline_id)
			json.pipeline_id = _agile_get_prefs('agile_deal_track');
			json.milestone = '';
			return JSON.stringify(json);
		}
		if (filterJSON && _agile_get_prefs("agile_deal_view")){
			return JSON.stringify(filterJSON);
		}
		if(!filterJSON && !_agile_get_prefs("agile_deal_view")){
			var json = {};
			json.pipeline_id = _agile_get_prefs('agile_deal_track');
			return JSON.stringify(json);
		}
		return '';
	}else{
		if (!_agile_get_prefs("agile_deal_view")){
			var json = {};
			json.pipeline_id = _agile_get_prefs('agile_deal_track');
			json.value_filter = "equals";
			json.archived = "false";
			return JSON.stringify(json);
		}
		if(_agile_get_prefs("agile_deal_view")){
			var json = {};
			json.value_filter = "equals";
			json.archived = "false";
			return JSON.stringify(json);
		}
		return '';
	}
}

function percentCountAndAmount(total_count,total_amount)
{
	$('.Count_goal').text(getNumberWithCommasForCharts(total_count));
	$('.Amount_goal').text(numberWithCommasAsDouble(total_amount));
	var user_Percent;
	$('#deal-sources-table').find('td').each(function(index){
			var count=$(this).find('.count').val();
			var amount=$(this).find('.amount').val();

			if(count!="" && count!=0)
			{
				user_Percent=Math.round((parseInt(count)*100)/(parseInt(total_count)));
				$(this).find('.count_percent').html(user_Percent+'%');
			}
			else{
				if($(this).find('.count_percent').html()!="")
					$(this).find('.count_percent').html("");
			}
			if(amount!="" && amount!=0)
			{
				user_Percent=Math.round((parseInt(amount)*100)/(parseInt(total_amount)));
				$(this).find('.amount_percent').html(user_Percent+'%');
			}
			else{
				if($(this).find('.amount_percent').html()!="")
					$(this).find('.amount_percent').html("");
			}
	});

}

function numberWithCommasAsDouble(value)
{
	if (value == 0)
			return value;

		if (value)
		{
			return value.toFixed(2).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",").replace('.00', '');
		}
}

function dealSourcesSorting()
{
	head.js(LIB_PATH + 'lib/jquery-ui.min.js', function(){
		$('.admin-settings-deal-sources-model-list').sortable({
			axis: "y" ,
			containment: '.admin-settings-deal-sources-model-list',
			scroll: false,
			items:'tr',
			helper: function(e, tr){
			    var $originals = tr.children();
			    var $helper = tr.clone();
			    $helper.children().each(function(index)
			    {
			      // Set helper cell sizes to match the original sizes
			      $(this).width($originals.eq(index).width()+50);
			      $(this).css("background","#f5f5f5");
			      $(this).css("border-bottom","1px solid #ddd");
			      $(this).css("max-width",($originals.eq(index).width()+50)+"px");
			      $(this).height($originals.eq(index).height());
			    });
			    return $helper;
			},
			sort: function(event, ui){
				ui.placeholder.height(ui.helper.height());
			},
			forceHelperSize:true,
			placeholder:'<tr></tr>',
			forcePlaceholderSize:true,
			handle: ".icon-move",
			cursor: "move",
			tolerance: "pointer"
		});
		
		/*
		 * This event is called after sorting stops to save new positions of
		 * deal sources
		 */
		$('.admin-settings-deal-sources-model-list',$('#deal-sources-table')).on("sortstop",function(event, ui){
			var sourceIds = [];
			$('#admin-settings-deal-sources-model-list > tr').each(function(column){
				sourceIds[column] = $(this).data().id;
			});
			// Saves new positions in server
			$.ajax({ type : 'POST', url : '/core/api/categories/position', data : JSON.stringify(sourceIds),
				contentType : "application/json; charset=utf-8", dataType : 'json', success : function(data){
					$.each(sourceIds, function(index, val){
						$('#dealSourcesForm_'+val).find('input[name="order"]').val(index);
					});
				} });
		});
	});
}

/**
 * Get the deal sort filters in the cookie.
 * 
 */
function getDealSortFilter()
{
	var sortFilter = "-created_time";
	if (_agile_get_prefs("deal_sort_field"))
	{
		sortFilter = _agile_get_prefs("deal_sort_field");
	}

	return sortFilter;
}

var DEAL_CUSTOM_SORT_VIEW = undefined;
function setUpDealSortFilters(el)
{
	if(DEAL_CUSTOM_SORT_VIEW)
	{
		$("#deal-sorter", el).html(DEAL_CUSTOM_SORT_VIEW.render(true).el);
		return;	
	}

	var view = DEAL_SORT_FIELDS_VIEW.view();
	DEAL_CUSTOM_SORT_VIEW = new view ({
		data : sort_deal_configuration.getDealSortableFields(),
		templateKey : "contact-view-sort",
		sortPrefsName : "deal_sort_field",
		individual_tag_name : "li",
		sort_collection : false,
		postRenderCallback: function(el)
		{
			DEAL_CUSTOM_SORT_VIEW.postProcess();
		}
	});

	
	DEAL_CUSTOM_SORT_VIEW.init();
	$("#deal-sorter", el).html(DEAL_CUSTOM_SORT_VIEW.render(true).el);
	
}

/**
 * Chains fields using jquery.chained library. It deserialzed data into form
 * 
 * @param el
 */
function chainDealFilters(el, data, callback)
{
	if(!OPPORTUNITY_CUSTOM_FIELDS)
	{			
		fillOpportunityCustomFieldsInFilters(el, function(){
			show_chained_fields(el, data, true);
			if (callback && typeof (callback) === "function")
			{
				// execute the callback, passing parameters as necessary
				callback();
			}
		})
		return;
	}
	
	fillCustomFields(OPPORTUNITY_CUSTOM_FIELDS, el, undefined, false)
	
	show_chained_fields(el, data);
	if (callback && typeof (callback) === "function")
	{
		// execute the callback, passing parameters as necessary
		callback();
	}
	
}

function fillOpportunityCustomFieldsInFilters(el, callback)
{
	$.getJSON("core/api/custom-fields/searchable/scope?scope=DEAL", function(fields){
		console.log(fields);
		OPPORTUNITY_CUSTOM_FIELDS = fields;
		fillCustomFields(fields, el, callback, false);
	});
}

function chainFiltersForOpportunity(el, data, callback) {
	if(data) {
		chainDealFilters($(el).find('.chained-table.opportunity.and_rules'), data.rules, undefined);
		chainDealFilters($(el).find('.chained-table.opportunity.or_rules'), data.or_rules, callback);
	} else {
		chainDealFilters($(el).find('.chained-table.opportunity.and_rules'), undefined, undefined);
		chainDealFilters($(el).find('.chained-table.opportunity.or_rules'), undefined, callback);
	}
}