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
	//For getting custom fields
	if(App_Deals.customFieldsList == null || App_Deals.customFieldsList == undefined)
	{
		App_Deals.customFieldsList = new Base_Collection_View({ url : '/core/api/custom-fields/scope/position?scope=DEAL', sort_collection : false, 
			restKey : "customFieldDefs", templateKey : "admin-settings-customfields", individual_tag_name : 'tr' });
		App_Deals.customFieldsList.collection.fetch();
	}
	
	this.dealDetailView = new Base_Model_View({ url : '/core/api/opportunity/' + id, template : "deal-detail", postRenderCallback : function(el)
	{
		/**
		 * gets the tracks count when user comes to deals page and stores in global variable
		 */
		if(!DEAL_TRACKS_COUNT)
		DEAL_TRACKS_COUNT=getTracksCount();
		load_deal_tab(el, "");
		var deal_collection;
		if(App_Deals.opportunityCollectionView && App_Deals.opportunityCollectionView.collection)
			deal_collection = App_Deals.opportunityCollectionView.collection;

		if (deal_collection != null && readCookie("agile_deal_view"))
			deal_detail_view_navigation(id, deal_collection, el);
		
			
		
	} });

	var ele = this.dealDetailView.render(true).el;
	$("#content").html(getRandomLoadingImg());
	$('#content').html(ele);

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
 * Validates deal edit form and saves
 */
$("body").on('click','#opportunity_validate_form', function(e)
{
	e.preventDefault();

	// To know updated or added deal form names
	var modal_id = $(this).closest('.container').attr("id");
	var form_id = $(this).closest('.container').find('form').attr("id");

	var json = serializeForm(form_id);
	json["custom_data"] = serialize_custom_fields(form_id);

	console.log(json);
	if (form_id == "opportunityForm1")
		saveDeal(form_id, modal_id, this, json, false);
	else
		saveDeal(form_id, modal_id, this, json, false);
});

$("body").on('click','#deal-owner', function(e)
{
	e.preventDefault();
	fill_deal_owners(undefined, undefined, function()
	{

		$('#deal-owner').css('display', 'none');

		$('#change-deal-owner-ul').css('display', 'inline-block');

		if ($('#change-deal-owner-ul').css('display') == 'inline-block')
			$("#change-owner-element").find(".loading").remove();

	});

});

$("body").on('click','#opportunity-actions-delete', function(e)
{
	e.preventDefault();
	
	  if(!confirm("Are you sure you want to delete?"))
			return;
	  
      
      var id = $(this).closest('.deal_detail_delete').attr('data');
	
	$.ajax({ url : 'core/api/opportunity/' + id, type : 'DELETE', success : function(data)
	{
		Backbone.history.navigate("#deals", {
            trigger: true
        });
	}, error : function(response)
	{
		alert("some exception occured please try again");
	} });
});

/**
 * Shows all the domain users names as ul drop down list to change the owner of
 * a contact
 */
function fill_deal_owners(el, data, callback)
{
	var optionsTemplate = "<li><a class='deal-owner-list' data='{{id}}'>{{name}}</a></li>";
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
function deal_detail_view_navigation(id, deal_collection, el){
	console.log("collection >>>>>>>>>>>>>>>>");
	console.log(deal_collection);
	
	var collection_length = deal_collection.length;
    var current_index = deal_collection.indexOf(deal_collection.get(id));
    var previous_deal_id;
    var next_deal_id;

    if (collection_length > 1 && current_index < collection_length && deal_collection.at(current_index + 1) && deal_collection.at(current_index + 1).has("id")) {
     
    	next_deal_id = deal_collection.at(current_index + 1).id
    }

    if (collection_length > 0 && current_index != 0 && deal_collection.at(current_index - 1) && deal_collection.at(current_index - 1).has("id")) {

    	previous_deal_id = deal_collection.at(current_index - 1).id
    }

    if(previous_deal_id != null)
    	$('.navigation', el).append('<a style="float:left;" href="#deal/' + previous_deal_id + '" class=""><i class="icon icon-chevron-left"></i></a>');
    if(next_deal_id != null)
    	$('.navigation', el).append('<a style="float:right;" href="#deal/'+ next_deal_id + '" class=""><i class="icon icon-chevron-right"></i></a>');
	
}

/**
 * Changes, owner of the contact, when an option of change owner drop down is
 * selected.
 */
$("body").on('click','.deal-owner-list', function()
{

	$('#change-deal-owner-ul').css('display', 'none');

	// Reads the owner id from the selected option
	var new_owner_id = $(this).attr('data');
	var new_owner_name = $(this).text();
	var current_owner_id = $('#deal-owner').attr('data');
	// Returns, if same owner is selected again
	if (new_owner_id == current_owner_id)
	{
		// Showing updated owner
		show_deal_owner();
		return;
	}

	var dealModel = new BaseModel();
	dealModel.url = '/core/api/opportunity/change-owner/' + new_owner_id + "/" + App_Deal_Details.dealDetailView.model.get('id');
	dealModel.save(App_Deal_Details.dealDetailView.model.toJSON(), { success : function(model)
	{

		$('#deal-owner').text(new_owner_name);
		$('#deal-owner').attr('data', new_owner_id);

		// Showing updated owner
		show_deal_owner();
		App_Deal_Details.dealDetailView.model = model;
		App_Deal_Details.dealDetailView.render(true)
		Backbone.history.navigate("deal/"+model.toJSON().id , {
            trigger: true
        });

	} });

});

$("body").on('click','.deal-add-contact', function(e)
{
	e.preventDefault();
	console.log(App_Deal_Details.dealDetailView.model.toJSON());
	var currentdeal = App_Deal_Details.dealDetailView.model;
	updateDeal(currentdeal);
	
	setTimeout(function() {
		$('#opportunityUpdateForm').find("input[name='relates_to']").focus();
	}, 800);

});

$("body").on('click','.deal-detail-edit-deal', function(e)
		{
			e.preventDefault();
			console.log(App_Deal_Details.dealDetailView.model.toJSON());
			var currentdeal = App_Deal_Details.dealDetailView.model;
			updateDeal(currentdeal);
			

		});

$("body").on('click','.deal-note', function(e)
{
	e.preventDefault();
	

	var el = $("#dealnoteForm");

	// Displays contact name, to indicate the note is related to the contact
	fill_relation_deal(el);
	$('#deal-note-modal').modal('show');
});

/**
 * Displays note modal, to add a note related to the contact in contact detail
 * view. Also prepends the contact name to related to field of activity modal.
 */

function fill_relation_deal(el)
{

	var json = App_Deal_Details.dealDetailView.model.toJSON();
	var deal_name = json.name;
	$('.tags', el).html(
			'<li class="tag"  style="display: inline-block; vertical-align: middle; margin-right:3px;" data="' + json.id + '">' + deal_name + '</li>');

}

function deserialize_deal(value, template)
{
	value = value.toJSON();

	// Loads the form based on template value
	var dealForm = $("#content").html(getTemplate(template, value));

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
	$('#close_date', dealForm).datepicker({ format : 'mm/dd/yyyy', });

	add_custom_fields_to_form(value, function(data)
	{
		var el = show_custom_fields_helper(data["custom_fields"], []);
		$("#custom-field-deals", dealForm).html(fill_custom_fields_values_generic($(el), value["custom_data"]));
		$('.date_input', dealForm).datepicker({ format : 'mm/dd/yyyy', });

	}, "DEAL")

}

$("body").on('click','#dealdetail-archive', function(e){
	e.preventDefault();
 
    var currentDeal=App_Deal_Details.dealDetailView.model.toJSON();
    $("#archived-deal-id",$("#deal_archive_confirm_modal")).val(currentDeal.id);
	$("#archived-deal-milestone",$("#deal_archive_confirm_modal")).val(currentDeal.milestone);
	$("#deal_archive_confirm_modal").modal('show');
    
});

$("body").on('click','.deal-restore-detail-view', function(e){
	e.preventDefault();

	var currentDeal = App_Deal_Details.dealDetailView.model.toJSON();
	
	$("#restored-deal-id",$("#deal_restore_confirm_modal")).val(currentDeal.id);
	$("#restored-deal-milestone",$("#deal_restore_confirm_modal")).val(currentDeal.milestone);
	$("#deal_restore_confirm_modal").modal('show');
	
});



/**
 * 
 * @returns due tasks count upto today
 */
function getTracksCount(){
	var msg = $.ajax({ type : "GET", url :'core/api/milestone/tracks/count', async : false, dataType : 'json' }).responseText;

	if(!isNaN(msg)){
		return msg;
	}
return 0;
}
