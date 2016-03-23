/**
 * calendar.js is a script file having a route to show calendar
 * 
 * @module Activities
 */
var DEAL_TRACKS_COUNT;
var DealDetailsRouter = Backbone.Router.extend({

	routes : {
	/* Shows page */
	"deal/:id" : "dealdetails", "dealEdit/:id" : "dealEdit" },

	dealdetails : function(id)
	{
		$("#content").html("<div id='deal-detail-page'></div>")
		// For getting custom fields
		if (App_Deals.customFieldsList == null || App_Deals.customFieldsList == undefined)
		{
			App_Deals.customFieldsList = new Base_Collection_View({ url : '/core/api/custom-fields/scope/position?scope=DEAL', sort_collection : false,
				restKey : "customFieldDefs", templateKey : "admin-settings-customfields", individual_tag_name : 'tr' });
			App_Deals.customFieldsList.collection.fetch();
		}

		this.dealDetailView = new Deal_Modal_Event_View({ url : '/core/api/opportunity/' + id, template : "deal-detail", postRenderCallback : function(el)
		{

			$('.content-tabs',el).tabCollapse();
			

			/**
			 * gets the tracks count when user comes to deals page and stores in
			 * global variable
			 */
			if (!DEAL_TRACKS_COUNT){

				getTracksCount(function(count){
						DEAL_TRACKS_COUNT = count;
					initializeDealTabWithCount(id, el);
				});
			} else {
				initializeDealTabWithCount(id, el);
			}

		} });
		var that = this;
		this.dealDetailView.model.fetch({success : function(data){
			var ele = that.dealDetailView.render(true).el;
			$("#deal-detail-page").html(getRandomLoadingImg());
			$('#deal-detail-page').html(ele);
		},error : function(data, response){
			hideTransitionBar();
			if(response && response.status == '403')
				$('#deal-detail-page').html('<h2 class="p-l-md"><strong><i class="fa-exclamation-triangle icon-white"></i>&nbsp;&nbsp; '+response.responseText+'</strong></h2>');
		} })

	},

	dealEdit : function(id, deal)
	{

		// If user refreshes the contacts detail view page directly - we
		// should load from the model
		if (!deal)
		{

			console.log("Downloading deal");

			// Download
			var deal_details_model = Backbone.Model.extend({ url : function()
			{
				return '/core/api/opportunity/' + this.id;
			} });

			var model = new deal_details_model();
			model.id = id;
			model.fetch({ success : function(data)
			{

				// Call deal Details again
				App_Deal_Details.dealEdit(id, data);

			}, error : function(data, response)
			{
				if (response && response.status == '403')
					$("#content").html(response.responseText);
			} });

			return;
		}

		add_custom_fields_to_form(deal, function(deal)
		{

			deserialize_deal(deal, 'deal-detail-edit');

		}, "DEAL");

	}

});


/**
 * Shows all the domain users names as ul drop down list to change the owner of
 * a contact
 */
function fill_deal_owners(el, data, callback)
{
	var optionsTemplate = "<li><a href='javascript:void(0);' class='deal-owner-list' data='{{id}}'>{{name}}</a></li>";
	fillSelect('deal-detail-owner', '/core/api/users', 'domainUsers', callback, optionsTemplate, true);
}

/**
 * To show owner on change
 */
function show_deal_owner()
{
	$('#deal-owner').css('display', 'inline-block');
}

/**
 * To navigate from one deal detail view to other
 */
function deal_detail_view_navigation(id, deal_collection, el)
{
	console.log("collection >>>>>>>>>>>>>>>>");
	console.log(deal_collection);

	var collection_length = deal_collection.length;
	var current_index = deal_collection.indexOf(deal_collection.get(id));
	var previous_deal_id;
	var next_deal_id;

	if (collection_length > 1 && current_index < collection_length && deal_collection.at(current_index + 1) && deal_collection.at(current_index + 1).has("id"))
	{

		next_deal_id = deal_collection.at(current_index + 1).id
	}

	if (collection_length > 0 && current_index != 0 && deal_collection.at(current_index - 1) && deal_collection.at(current_index - 1).has("id"))
	{

		previous_deal_id = deal_collection.at(current_index - 1).id
	}

	if (previous_deal_id != null)
		$('.navigation', el).append('<a style="float:left;" href="#deal/' + previous_deal_id + '" class=""><i class="icon icon-chevron-left"></i></a>');
	if (next_deal_id != null)
		$('.navigation', el).append('<a style="float:right;" href="#deal/' + next_deal_id + '" class=""><i class="icon icon-chevron-right"></i></a>');

}

/**
 * Displays note modal, to add a note related to the contact in contact detail
 * view. Also prepends the contact name to related to field of activity modal.
 */

function fill_relation_deal(el)
{

	var json = App_Deal_Details.dealDetailView.model.toJSON();
	var deal_name = json.name;

	var template = Handlebars.compile('<li class="tag inline-block v-middle m-r-xs btn btn-xs btn-primary" data="{{id}}">{{name}}</li>');
  
 	// Adds contact name to tags ul as li element
 	$('.tags',el).html(template({name : deal_name, id : json.id}));
}

function deserialize_deal(value, template)
{
	value = value.toJSON();

	// Loads the form based on template value

	getTemplate(template, value, undefined, function(template_ui){
		if(!template_ui)
			  return;
		var dealForm = $('#content').html($(template_ui));	

		deserializeForm(value, dealForm);

		// Call setupTypeAhead to get contacts
		agile_type_ahead("relates_to", dealForm, contacts_typeahead);

		// Fills owner select element
		populateUsers("owners-list", dealForm, value, 'owner', function(data)
		{
			dealForm.find("#owners-list").html(data);
			if (value.owner)
			{
				$("#owners-list", dealForm).find('option[value=' + value['owner'].id + ']').attr("selected", "selected");
				$("#owners-list", dealForm).closest('div').find('.loading-img').hide();
			}
		});

		// Fills the pipelines list in the select menu.
		populateTracks(dealForm, undefined, value, function(pipelinesList)
		{

			// Fills milestone select element
			populateMilestones(dealForm, undefined, value.pipeline_id, value, function(data)
			{
				dealForm.find("#milestone").html(data);
				if (value.milestone)
				{
					$("#milestone", dealForm).find('option[value=\"' + value.milestone + '\"]').attr("selected", "selected");
				}
				$("#milestone", dealForm).closest('div').find('.loading-img').hide();
			});
		});

		// Enable the datepicker
		$('#close_date', dealForm).datepicker({ format : CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY});

		add_custom_fields_to_form(value, function(data)
		{
			var el = show_custom_fields_helper(data["custom_fields"], []);
			$("#custom-field-deals", dealForm).html(fill_custom_fields_values_generic($(el), value["custom_data"]));
			$('.date_input', dealForm).datepicker({ format : CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY});

		}, "DEAL")

	}, "#content");
}

/**
 * 
 * @returns due tasks count upto today
 */
function getTracksCount(callback)
{
	accessUrlUsingAjax('core/api/milestone/tracks/count', function(data){

			if (!isNaN(data))
			{
				return callback(data);
			}

			return callback(0);

	});
}

/**
*
*/
function initializeDealTabWithCount(id, el){
	
	load_deal_tab(el, "");
	var deal_collection;
	if (App_Deals.opportunityCollectionView && App_Deals.opportunityCollectionView.collection)
		deal_collection = App_Deals.opportunityCollectionView.collection;

	if (deal_collection != null && _agile_get_prefs("agile_deal_view"))
		deal_detail_view_navigation(id, deal_collection, el);

}

/**
 * Displays task modal, to add a deal related to the task in deal detail
 * view. Also prepends the deal name to related deal to field of activity modal.
 */
function fill_relation_deal_task(el)
{

	var json = App_Deal_Details.dealDetailView.model.toJSON();
	var deal_name = json.name;

	var template = Handlebars.compile('<li class="tag inline-block v-middle m-r-xs btn btn-xs btn-primary" data="{{id}}">{{name}}</li>');

 	// Adds contact name to tags ul as li element
 	$('.deal_tags',el).html(template({name : deal_name, id : json.id}));
	
}
