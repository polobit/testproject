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

$(function()
{

	var id;

	/**
	 * Fetches all the notes related to the deal and shows the notes collection
	 * as a table in its tab-content, when "Notes" tab is clicked.
	 */
	$('#deal-details-tab a[href="#dealnotes"]').live('click', function(e)
	{
		e.preventDefault();
		save_deal_tab_position_in_cookie("dealnotes");
		deal_details_tab.load_deal_notes();
	});

	/**
	 * Fetches all the contacts related to the deal and shows the contacts
	 * collection as a table in its tab-content, when "contacts" tab is clicked.
	 */
	$('#deal-details-tab a[href="#dealrelated"]').live('click', function(e)
	{
		e.preventDefault();
		save_deal_tab_position_in_cookie("dealrelated");
		deal_details_tab.loadDealRelatedContactsView();
	});

	/**
	 * Fetches all the notes related to the contact and shows the tasks
	 * collection as a table in its tab-content, when "Tasks" tab is clicked.
	 */
	$('#deal-details-tab a[href="#dealactivities"]').live('click', function(e)
	{
		e.preventDefault();
		save_deal_tab_position_in_cookie("dealactivities");
		deal_details_tab.load_deal_activities();
	});

	/**
	 * Fetches all the docs related to the deal and shows the docs collection as
	 * a table in its tab-content, when "Documents" tab is clicked.
	 */
	$('#deal-details-tab a[href="#dealdocs"]').live('click', function(e)
	{
		e.preventDefault();
		save_deal_tab_position_in_cookie("dealdocs");
		deal_details_tab.load_deal_docs();
	});

});

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
