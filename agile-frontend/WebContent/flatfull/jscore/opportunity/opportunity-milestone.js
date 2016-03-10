// Before selecting proper type array from map, need to fill map with user's detail.
function startGettingDeals(criteria, pending)
{
	console.log('------started-----', pipeline_id);
	var milestoneString = trackListView.collection.get(pipeline_id).toJSON().milestones;
	if (milestoneString.trim().length == 0)
	{
		var html = '<div class="slate" style="margin:0px;"><div class="slate-content"><div class="box-left"><img alt="Clipboard" src="'+updateImageS3Path("/img/clipboard.png")+'"></div><div class="box-right"><h3>You have no milestones defined</h3><br><a href="#milestones" class="btn"><i class="icon icon-plus-sign"></i> Add Milestones</a></div></div></div>';
		$('#new-opportunity-list-paging').html(html);
		return;
	}
	if (_agile_get_prefs('agile_deal_track'))
	{
		if (_agile_get_prefs('agile_deal_track') != pipeline_id)
			_agile_set_prefs('agile_deal_track', pipeline_id);
	}
	var currentTrack = trackListView.collection.get(pipeline_id).toJSON();
	var milestones = currentTrack.milestones.split(',');
	console.log(milestones);
	createDealsNestedCollection(pipeline_id,milestones,currentTrack);
	
}

// Decide which array to pass for creation of collection.
function dealFiltersForCollection(criteria)
{
	if (criteria == "CATEGORY")
		// Sort task list on count of task and then create collection
		getArraySortOnCount(criteria, GROUPING_MAP[criteria].type, pending);
	else
		// Creates nested collection
		createNestedCollection(criteria, GROUPING_MAP[criteria].type, pending);
}

// Creates nested collection
function createDealsNestedCollection(pipeline_id,milestones,currentTrack)
{
	console.log("In createNestedCollection");

	// Initialize nested collection
	initDealListCollection(milestones);

	// Url to call DB
	var initialURL = '/core/api/opportunity/based?pipeline_id=' + pipeline_id + '&order_by=close_date';

	if (_agile_get_prefs('deal-filters'))
	{
		initialURL += '&filters=' + encodeURIComponent(getDealFilters());
	}

	// Creates main collection with deals lists
	for ( var i in milestones)
	{
		var newDealList;

		// Add heading to task list in main collection
			var url = initialURL + "&milestone=" + milestones[i];
			newDealList = { "heading" : milestones[i], "url" : url};
			if(currentTrack.won_milestone == milestones[i])
				newDealList.won_milestone = currentTrack.won_milestone;
			else if(currentTrack.lost_milestone == milestones[i])
				newDealList.lost_milestone = currentTrack.lost_milestone;

		if (!newDealList)
			return;

		// Add task list in main collection
		DEALS_LIST_COLLECTION.collection.add(newDealList);// main-collection
	}

	// Render it
	$('#new-opportunity-list-paging').html(DEALS_LIST_COLLECTION.render(true).el);

}

// Initialize nested collection
function initDealListCollection(milestones)
{
	// Define main collection
	DEALS_LIST_COLLECTION = new Base_Collection_View({ restKey : "deal", templateKey : "opportunities-by-paging", individual_tag_name : 'div',
		sort_collection : false, postRenderCallback : function(el)
		{
			// Remove loding imgs
			$('.loading-img', el).remove();
			$('.loading', el).remove();

			// Adjust Height Of Task List And Scroll as per window size
			var count = milestones.length;
			if (!count)
				return;
			// Setting dynamic auto width
			var width = (100 / count);

			if (_agile_get_prefs('deal-milestone-view'))
			{
				if (_agile_get_prefs('deal-milestone-view') == "compact" && count > 8)
					width = 100 / 8;
			}
			else if (count > 5)
			{
				width = 100 / 5;
			}

			$('#opportunities-by-paging-model-list', el).find('.milestone-column').width(width + "%");
			$('.mark-won, .mark-lost',el).tooltip();
		} });

	// Over write append function
	DEALS_LIST_COLLECTION.appendItem = dealAppend;
}

// Append sub collection and model
function dealAppend(base_model)
{
	milestonesCollectionView(base_model, this.el, function(){
		dealsFetch(base_model);
	});
	
}

// Renders outer view of milestone view
function milestonesCollectionView(base_model, ele, callback)
{
	var dealsListModel = new Base_List_View({ model : base_model, "view" : "inline", template : "opportunities-by-paging-model", tagName : 'div',
		className : "milestone-column panel m-b-none  b-n r-n panel-default", id : base_model.get("heading").replace(/ +/g, '') });

	// Render model in main collection
	var el = dealsListModel.render().el;

	// Append model from main collection in UI
	$('#opportunities-by-paging-model-list > div', ele).append(el);
	return callback();
}


/**
 * Create sub collection, ad to model in main collection, fetch tasks from DB
 * for sub collection and update UI.
 */
function dealsFetch(base_model)
{
	if (!base_model)
		return;

	var dealsTemplate = 'deals-by-paging';

	if (!_agile_get_prefs('deal-milestone-view'))
	{
		dealsTemplate = 'deals-by-paging-relax';
	}

	// Define sub collection
	var dealCollection = new Base_Collection_View({ url : base_model.get("url"), templateKey : dealsTemplate, individual_tag_name : 'li', 
		sort_collection : false, cursor : true, page_size : 20, postRenderCallback : function(el)
		{   
			$(el).find('ul li').each(function(){
				$(this).addClass("deal-color");
				$(this).addClass($(this).find("input").attr("class"));
			});
			

			$('ul.milestones', el).attr('milestone', base_model.get("heading"));

			if (!_agile_get_prefs("agile_deal_view"))
				deal_infi_scroll($('#' + base_model.get("heading").replace(/ +/g, '') + '-list-container')[0], dealCollection);


			includeTimeAgo(el);
			initializeDealsListeners(el);			

		} });

	// Fetch task from DB for sub collection
	dealCollection.collection.fetch({ success : function(data)
	{
		// Add sub collection in model of main collection.
		base_model.set('dealCollection', dealCollection.collection);
		$('#' + base_model.get("heading").replace(/ +/g, '') + '-list-container').html(dealCollection.render(true).el)
		console.log($('#' + base_model.get("heading").replace(/ +/g, '')).find('img.loading_img').length);
		$('#' + base_model.get("heading").replace(/ +/g, '')).find('img.loading_img').hide();
		try
		{
			var count = data.at(0) ? data.at(0).toJSON().count : 0;
			$('#' + base_model.get("heading").replace(/ +/g, '') + '_count').text(data.at(0) ? data.at(0).toJSON().count : 0);
	        var heading =  base_model.get("heading").replace(/ +/g, '');
	        var dealcountarray = data.toArray();
	        var i;
	        var dealcount=0;
            for (i = 0; i < dealcountarray.length; ++i){
            	dealcount = dealcount + dealcountarray[i].get("expected_value");
            }
            $('#' + base_model.get("heading").replace(/ +/g, '') + '_totalvalue').text(portlet_utility.getNumberWithCommasAndDecimalsForPortlets(dealcount));

            var avg_deal_size = 0;
            if(count == 0)
            	avg_deal_size = 0;
            else
            	avg_deal_size = dealcount / count ; 
            var dealTrack = $("#pipeline-tour-step").children('.filter-dropdown').text();
            dealcount = portlet_utility.getNumberWithCommasAndDecimalsForPortlets(dealcount) ;
            var symbol = getCurrencySymbolForCharts();
            avg_deal_size =  portlet_utility.getNumberWithCommasAndDecimalsForPortlets(avg_deal_size);
			var dealdata = {"dealTrack": dealTrack ,"heading": heading ,"dealcount":dealcount ,"avgDeal" : avg_deal_size,"symbol":symbol,"dealNumber":count};
			var dealDataString = JSON.stringify(dealdata) ; 
			$("#"+heading+" .dealtitle-angular").removeAttr("data");
			$("#"+heading+" .dealtitle-angular").attr("data" , dealDataString ); 
            }

		catch (err)
		{
			console.log(err);
		}  
        
        $('a.deal-notes').tooltip();
        	// Counter to fetch next sub collection
		pipeline_count++;
		setup_deals_in_milestones('opportunities-by-paging-model-list');
		
	} });
}

function deal_infi_scroll(element_id, targetCollection)
{
	console.log("initialize_infinite_scrollbar", element_id);

	if (element_id == undefined || element_id == null)
	{
		console.log("no elmnt");
		return;
	}
	console.log(targetCollection);
	targetCollection.infiniScroll = new Backbone.InfiniScroll(targetCollection.collection, {
		target : element_id,
		untilAttr : 'cursor',
		param : 'cursor',
		strict : false,
		pageSize : targetCollection.page_size,
		success : function(colleciton, response)
		{
			console.log('in success');

			if (!colleciton.last().get("cursor"))
			{
				this.strict = true;
				targetCollection.infiniScroll.disableFetch();
			}

			// Remove loading icon
			$(targetCollection.infiniScroll.options.target).find('.scroll-loading').remove();
			includeTimeAgo($(targetCollection.infiniScroll.options.target));
			$('a.deal-notes').tooltip();
		},
		onFetch : function()
		{
			console.log('in fetch');

			// Add loading icon
			$(targetCollection.infiniScroll.options.target).append(
					'<div class="scroll-loading"> <img src="'+updateImageS3Path("/img/ajax-loader-cursor.gif")+'" style="margin-left: 44%;"> </div>');
		} });
}
// show deal pop-over modal

function initializeDealsListeners(el)
{
	$("#opportunity-listners").off('mouseenter','.milestone-column > .dealtitle-angular');
	$("#opportunity-listners").on('mouseenter','.milestone-column > .dealtitle-angular', function(){

		var data = $(this).attr('data');
		var originalHeading = $(this).siblings().find('.milestones').attr('milestone');
		var jsonDealData = JSON.parse(data);
		jsonDealData.heading = originalHeading;
	//  var currentCase = App_Cases.casesCollectionView.collection.get(data);
		var that = this;
		getTemplate('deal-detail-popover', jsonDealData , undefined, function(template_ui){
 		if(!template_ui)
	    		return;
    	var ele = $(template_ui);
		$(that).popover(
					{ "rel" : "popover", "trigger" : "hover", "placement" : 'bottom', "content" : ele,
						"html" : "true"}); 
			$(that).popover('show');
			$(".popover-content").html(ele);
			$(".dealtitle-angular + .popover > .arrow").remove();
			$(".dealtitle-angular + .popover").css("top","35px");
			$(".dealtitle-angular + .popover > .popover-content" ).css("padding","0px");
			$(".dealtitle-angular + .popover ").css("border-radius","0px");
		});

	});

	/**
	 * On mouse out on the row hides the popover.
	 */
	 $('.milestone-column > .dealtitle-angular').off('mouseleave');
	 $('#opportunity-listners').on('mouseleave', '.milestone-column > .dealtitle-angular', function()
	{
		$(this).popover('hide');
	});
}
