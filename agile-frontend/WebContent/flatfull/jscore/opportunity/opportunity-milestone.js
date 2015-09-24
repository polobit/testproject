// Before selecting proper type array from map, need to fill map with user's detail.
function startGettingDeals(criteria, pending)
{
	console.log('------started-----', pipeline_id);
	var milestoneString = trackListView.collection.get(pipeline_id).toJSON().milestones;
	if (milestoneString.trim().length == 0)
	{
		var html = '<div class="slate" style="margin:0px;"><div class="slate-content"><div class="box-left"><img alt="Clipboard" src="/img/clipboard.png"></div><div class="box-right"><h3>You have no milestones defined</h3><br><a href="#milestones" class="btn"><i class="icon icon-plus-sign"></i> Add Milestones</a></div></div></div>';
		$('#new-opportunity-list-paging').html(html);
		return;
	}
	if (readCookie('agile_deal_track'))
	{
		if (readCookie('agile_deal_track') != pipeline_id)
			createCookie('agile_deal_track', pipeline_id);
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

	if (readCookie('deal-filters'))
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

	pipeline_count = 0;
	// Fetch tasks from DB for first task list
	fetchForNextDealsList(milestones);
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

			if (readCookie('deal-milestone-view'))
			{
				if (readCookie('deal-milestone-view') == "compact" && count > 8)
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
	var dealsListModel = new Base_List_View({ model : base_model, "view" : "inline", template : "opportunities-by-paging-model", tagName : 'div',
		className : "milestone-column panel m-b-none  b-n r-n panel-default", id : base_model.get("heading").replace(/ +/g, '') });

	// Render model in main collection
	var el = dealsListModel.render().el;

	// Append model from main collection in UI
	$('#opportunities-by-paging-model-list > div', this.el).append(el);
}

/*
 * Compare counter with length of criteria array and call function to Fetch
 * tasks from DB for next task list if available.
 */
function fetchForNextDealsList(milestones)
{
	// is All task list are done?
	if (deal_fetching)
		return;

	// Some task list are pending
	if (pipeline_count < milestones.length)
	{
		// call fetch for next task list.
		dealsFetch(pipeline_count, milestones);
	}

	// All task list are done.
	if (pipeline_count >= milestones.length)
		deal_fetching = true;
}

/**
 * Create sub collection, ad to model in main collection, fetch tasks from DB
 * for sub collection and update UI.
 */
function dealsFetch(index, milestones)
{
	console.log("index: " + index);

	// Get model from main collection
	var base_model = DEALS_LIST_COLLECTION.collection.at(index);

	if (!base_model)
		return;

	var dealsTemplate = 'deals-by-paging';

	if (!readCookie('deal-milestone-view'))
	{
		dealsTemplate = 'deals-by-paging-relax';
	}

	// Define sub collection
	var dealCollection = new Base_Collection_View({ url : base_model.get("url"), templateKey : dealsTemplate, individual_tag_name : 'li',
		sort_collection : false, cursor : true, page_size : 20, postRenderCallback : function(el)
		{
			$('ul.milestones', el).attr('milestone', base_model.get("heading"));

			if (!readCookie("agile_deal_view"))
				deal_infi_scroll($('#' + base_model.get("heading").replace(/ +/g, '') + '-list-container')[0], dealCollection);

			includeTimeAgo(el);
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
		}
		catch (err)
		{
			console.log(err);
		}

		$('a.deal-notes').tooltip();
		// Counter to fetch next sub collection
		pipeline_count++;
		setup_deals_in_milestones('opportunities-by-paging-model-list');
		// Fetch tasks from DB for next task list
		fetchForNextDealsList(milestones);
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
					'<div class="scroll-loading"> <img src="/img/ajax-loader-cursor.gif" style="margin-left: 44%;"> </div>');
		} });
}