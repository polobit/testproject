/**
 * contact-details-tabs.js fetches the contact (which is in contact detail view)
 * related details (notes, tasks, deals, campaigns and mails etc..) and presents
 * in tab content as specified, when the corresponding tab is clicked. Timeline
 * tab is activated by default to show all the details as vertical time-line.
 * 
 * @module deal management
 * @author jagadeesh
 */

var deal_tab_position_cookie_name = "deal_tab_position";
var id;

function initializeDealDetailsListners(el)
{

	/**
	 * Fetches all the notes related to the deal and shows the notes collection
	 * as a table in its tab-content, when "Notes" tab is clicked.
	 */
	$('body').on('click', '#deal-details-tab a[href="#dealnotes"]', function(e)
	{
		e.preventDefault();
		save_deal_tab_position_in_cookie("dealnotes");
		deal_details_tab.load_deal_notes();
	});

	/**
	 * Fetches all the contacts related to the deal and shows the contacts
	 * collection as a table in its tab-content, when "contacts" tab is clicked.
	 */
	$('body').on('click', '#deal-details-tab a[href="#dealrelated"]', function(e)
	{
		e.preventDefault();
		save_deal_tab_position_in_cookie("dealrelated");
		deal_details_tab.loadDealRelatedContactsView();
	});

	/**
	 * Fetches all the notes related to the contact and shows the tasks
	 * collection as a table in its tab-content, when "Tasks" tab is clicked.
	 */
	$('body').on('click', '#deal-details-tab a[href="#dealactivities"]', function(e)
	{
		e.preventDefault();
		save_deal_tab_position_in_cookie("dealactivities");
		deal_details_tab.load_deal_activities();
	});

	/**
	 * Fetches all the docs related to the deal and shows the docs collection as
	 * a table in its tab-content, when "Documents" tab is clicked.
	 */
	$('body').on('click', '#deal-details-tab a[href="#dealdocs"]', function(e)
	{
		e.preventDefault();
		save_deal_tab_position_in_cookie("dealdocs");
		deal_details_tab.load_deal_docs();
	});

	$("#change-owner-element").off('click').on('click', "#deal-owner", function(e)
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

	$("body").on('click', "#opportunity-actions-delete", function(e)
	{
		e.preventDefault();

		if (!confirm("Are you sure you want to delete?"))
			return;

		var id = $(this).closest('.deal_detail_delete').attr('data');

		$.ajax({ url : 'core/api/opportunity/' + id, type : 'DELETE', success : function(data)
		{
			Backbone.history.navigate("#deals", { trigger : true });
		}, error : function(response)
		{
			alert("some exception occured please try again");
		} });
	});

	$('body').on('click', '.deal-edit-note', function(e)
	{

		e.preventDefault();

		var note = dealNotesView.collection.get($(this).attr('data'));
		console.log(note);
		deserializeForm(note.toJSON(), $("#dealnoteUpdateForm", $('#dealnoteupdatemodal')));
		fill_relation_deal($('#dealnoteUpdateForm'));
		$('#dealnoteupdatemodal').modal('show');
	});

	$('body').on('click', '#dealnote_update', function(e)
	{
		e.preventDefault();

		// Returns, if the save button has disabled attribute
		if ($(this).attr('disabled'))
			return;

		// Disables save button to prevent multiple click event issues
		disable_save_button($(this));// $(this).attr('disabled', 'disabled');

		if (!isValidForm('#dealnoteUpdateForm'))
		{

			// Removes disabled attribute of save button
			enable_save_button($(this));
			return;
		}

		// Shows loading symbol until model get saved
		// $('#noteUpdateModal').find('span.save-status').html(getRandomLoadingImg());

		var json = serializeForm("dealnoteUpdateForm");

		saveDealUpdateNote($("#dealnoteUpdateForm"), $("#dealnoteupdatemodal"), this, json);
	});
	/**
	 * Saves note model using "Bcakbone.Model" object, and adds saved data to
	 * time-line if necessary.
	 */
	$('body').on('click', '#dealnote_validate', function(e)
	{

		e.preventDefault();

		// Returns, if the save button has disabled attribute
		if ($(this).attr('disabled'))
			return;

		if (!isValidForm('#dealnoteForm'))
		{
			return;
		}

		disable_save_button($(this));

		// Shows loading symbol until model get saved
		// $('#noteModal').find('span.save-status').html(getRandomLoadingImg());

		var json = serializeForm("dealnoteForm");

		console.log(json);

		saveDealNote($("#dealnoteForm"), $("#deal-note-modal"), this, json);
	});

	/**
	 * Shows note modal and activates contacts typeahead to its related to field
	 */
	$('body').on('click', '#dealshow-note', function(e)
	{
		if (App_Deal_Details.dealDetailView.model.get('archived') == true)
			return;
		e.preventDefault();
		$("#deal-note-modal").modal('show');

		var el = $("#dealnoteForm");

	});

	/**
	 * Changes, owner of the contact, when an option of change owner drop down
	 * is selected.
	 */
	$("#deal-detail-owner").off('click').on('click', ".deal-owner-list", function(e)
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
			Backbone.history.navigate("deal/" + model.toJSON().id, { trigger : true });

		} });

	});

	$("body").on('click', ".deal-add-contact", function(e)
	{
		e.preventDefault();
		console.log(App_Deal_Details.dealDetailView.model.toJSON());
		var currentdeal = App_Deal_Details.dealDetailView.model;
		updateDeal(currentdeal);

		setTimeout(function()
		{
			$('#opportunityUpdateForm').find("input[name='relates_to']").focus();
		}, 800);

	});

	$("body").on('click', ".deal-detail-edit-deal", function(e)
	{
		e.preventDefault();
		console.log(App_Deal_Details.dealDetailView.model.toJSON());
		var currentdeal = App_Deal_Details.dealDetailView.model;
		updateDeal(currentdeal);

	});

	$("body").on('click', ".deal-note", function(e)
	{
		e.preventDefault();

		var el1 = $("#dealnoteForm");

		// Displays contact name, to indicate the note is related to the contact
		fill_relation_deal(el1);
		$('#deal-note-modal').modal('show');
	});

	$("body").on('click', "#dealdetail-archive", function(e)
	{
		e.preventDefault();

		var currentDeal = App_Deal_Details.dealDetailView.model.toJSON();
		$("#archived-deal-id", $("#deal_archive_confirm_modal")).val(currentDeal.id);
		$("#archived-deal-milestone", $("#deal_archive_confirm_modal")).val(currentDeal.milestone);
		$("#deal_archive_confirm_modal").modal('show');

	});

	$("body").on('click', ".deal-restore-detail-view", function(e)
	{
		e.preventDefault();

		var currentDeal = App_Deal_Details.dealDetailView.model.toJSON();

		$("#restored-deal-id", $("#deal_restore_confirm_modal")).val(currentDeal.id);
		$("#restored-deal-milestone", $("#deal_restore_confirm_modal")).val(currentDeal.milestone);
		$("#deal_restore_confirm_modal").modal('show');

	});

}

function save_deal_tab_position_in_cookie(tab_href)
{

	var position = readCookie(deal_tab_position_cookie_name);

	if (position == tab_href)
		return;

	createCookie(deal_tab_position_cookie_name, tab_href);
}

function load_deal_tab(el, dealJSON)
{
	// timeline_collection_view = null;
	var position = readCookie(deal_tab_position_cookie_name);
	if (position)
	{
		if (position == "dealactivities")
		{
			$('#deal-details-tab a[href="#dealactivities"]', el).tab('show');

			deal_details_tab.load_deal_activities();
		}
		else if (position == "dealrelated")
		{
			$('#deal-details-tab a[href="#dealrelated"]', el).tab('show');

			deal_details_tab.loadDealRelatedContactsView();
		}
		else if (position == "dealnotes")
		{
			$('#deal-details-tab a[href="#dealnotes"]', el).tab('show');

			deal_details_tab.load_deal_notes();
		}
		else if (position == "dealdocs")
		{
			$('#deal-details-tab a[href="#dealdocs"]', el).tab('show');

			deal_details_tab.load_deal_docs();
		}
	}
	else
	{

		$('#deal-details-tab a[href="#dealactivities"]', el).tab('show');

		deal_details_tab.load_deal_activities();
	}

}
