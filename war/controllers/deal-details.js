/**
 * calendar.js is a script file having a route to show calendar
 * 
 * @module Activities
 */
var DealDetailsRouter = Backbone.Router.extend({

routes : {
/* Shows page */
"deal/:id" : "dealdetails", "dealEdit/:id" : "dealEdit" },

dealdetails : function(id, deal)
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
			App_Deal_Details.dealdetails(id, model);

		}, error : function(data, response)
		{
			if (response && response.status == '403')
				$("#content").html(response.responseText);
		} });

		return;
	}

	this.dealDetailView = new Base_Model_View({ model : deal, isNew : true, template : "deal-detail", postRenderCallback : function(el)
	{

		deal_details_tab.load_deal_notes();

	} });

	var el = this.dealDetailView.render(true).el;

	$('#content').html(el);

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
$("#opportunity_validate_form").live('click', function(e)
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

$('#deal-owner').live('click', function(e)
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

$('#deal_detail_edit').live('click', function(e)
{
	e.preventDefault();
	updateDeal(CURRENT_DEAL, true);

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
 * Changes, owner of the contact, when an option of change owner drop down is
 * selected.
 */
$('.deal-owner-list').live('click', function()
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

	} });

});

$('.deal-add-contact').live('click', function(e)
{
	e.preventDefault();
 console.log(App_Deal_Details.dealDetailView.model.toJSON());
	var currentdeal = App_Deal_Details.dealDetailView.model;
	updateDeal(currentdeal);

});

$('#deal_related_delete').live('click', function(e)
{
	e.preventDefault();
	var dealid = "5968973749288960";
	var contactid = $(this).attr("contactid");
	
	$.ajax({ url : 'core/api/opportunity/removeRelatedTo/' + contactid + '/' + dealid, type : 'GET', success : function(data)
	{

	}, error : function(response)
	{
		alert("some exception occured please try again");
	} });

});

$('.deal-note').live('click', function(e)
{
	e.preventDefault();
	var el = $("#dealnoteForm");

	// Displays contact name, to indicate the note is related to the contact
	fill_relation_deal(el);
	$('#deal-note-modal').modal('show');
	agile_type_ahead("notes_related_to", el, deals_typeahead, false, "", "", "core/api/search/deals", false, true);
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
   value=value.toJSON();
   
 
	// Loads the form based on template value
	var dealForm = $("#content").html(getTemplate(template,value));
	
	deserializeForm(value, dealForm);
	
	// Call setupTypeAhead to get contacts
	agile_type_ahead("relates_to", dealForm, contacts_typeahead);
	
	// Fills owner select element
	populateUsers("owners-list", dealForm, value, 'owner', function(data) {
				dealForm.find("#owners-list").html(data);
				if (value.owner) {
					$("#owners-list", dealForm).find('option[value=' + value['owner'].id + ']')
							.attr("selected", "selected");
					$("#owners-list", dealForm).closest('div').find('.loading-img').hide();
				}
	});
	
	// Fills the pipelines list in the select menu.
	populateTracks(dealForm, undefined, value, function(pipelinesList){

		// Fills milestone select element
		populateMilestones(dealForm, undefined, value.pipeline_id, value, function(data){
			dealForm.find("#milestone").html(data);
			if (value.milestone) {
				$("#milestone", dealForm).find('option[value=\"'+value.milestone+'\"]')
						.attr("selected", "selected");
			}
			$("#milestone", dealForm).closest('div').find('.loading-img').hide();
		});
	});
	
	// Enable the datepicker
	$('#close_date', dealForm).datepicker({
		format : 'mm/dd/yyyy',
	});
	
	
	add_custom_fields_to_form(value, function(data){
		var el = show_custom_fields_helper(data["custom_fields"], []);
		$("#custom-field-deals", dealForm).html(fill_custom_fields_values_generic($(el), value["custom_data"]));
		$('.date_input', dealForm).datepicker({
			format : 'mm/dd/yyyy',
		});
		
	}, "DEAL")
	
	


}
