/**
 * contact-details-tabs.js fetches the contact (which is in contact detail view) 
 * related details (notes, tasks, deals, campaigns and mails etc..) and presents 
 * in tab content as specified, when the corresponding tab is clicked. 
 * Timeline tab is activated by default to show all the details as vertical time-line.
 * 
 * @module Contact management
 * @author Rammohan
 */

var deal_tab_position_cookie_name = "deal_tab_position_" + CURRENT_DOMAIN_USER.id;


$(function(){ 

	var id;
	

	
	/**
	 * Fetches all the notes related to the deal and shows the notes collection 
	 * as a table in its tab-content, when "Notes" tab is clicked.
	 */ 
	$('#deal-details-tab a[href="#dealnotes"]').live('click', function (e){
		e.preventDefault();
		//save_contact_tab_position_in_cookie("notes");
		deal_details_tab.load_deal_notes();
	});
	
	
	
	/**
	 * Fetches all the contacts related to the deal and shows the contacts collection 
	 * as a table in its tab-content, when "contacts" tab is clicked.
	 */
	$('#deal-details-tab a[href="#dealrelated"]').live('click', function (e){
		e.preventDefault();
		//save_contact_tab_position_in_cookie("documents");
		deal_details_tab.loadDealRelatedContactsView();
	});
	
	/**
	 * Fetches all the notes related to the contact and shows the tasks collection 
	 * as a table in its tab-content, when "Tasks" tab is clicked.
	 */
	$('#deal-details-tab a[href="#dealtimeline"]').live('click', function (e){
		e.preventDefault();
		//save_contact_tab_position_in_cookie("documents");
		deal_details_tab.load_deal_timeline();
	});
	

	$('.activity-delete').die().live('click', function(e){
		e.preventDefault();
		
		var model = $(this).parents('li').data();
		
		if(model && model.collection)
		{
			model.collection.remove(model);
		}

		// Gets the id of the entity
		var entity_id = $(this).attr('id');

		// Gets the url to which delete request is to be sent
		var entity_url = $(this).attr('url');

		if(!entity_url)
			return;
		
		var id_array = [];
		var id_json = {};
		
		// Create array with entity id.
		id_array.push(entity_id);
		
		// Set entity id array in to json object with key ids, 
		// where ids are read using form param
		id_json.ids = JSON.stringify(id_array);
		var that = this;

		// Add loading. Adds loading only if there is no loaded image added already i.e., 
		// to avoid multiple loading images on hitting delete multiple times
		if($(this).find('.loading').length == 0)
			$(this).prepend($(LOADING_HTML).addClass('pull-left').css('width', "20px"));
		
		$.ajax({
			url: entity_url,
			type: 'POST',
			data: id_json,
			success: function() {
				// Removes activity from list
				$(that).parents(".activity").fadeOut(400, function(){ $(this).remove(); });
				removeItemFromTimeline($("#" + entity_id, $("#timeline")));
			}
		});
	});
	
	
	
});




function save_deal_tab_position_in_cookie(tab_href)
{
	
	var position = readCookie(deal_tab_position_cookie_name);
	
	if(position == tab_href)
		return;
	
	createCookie(deal_tab_position_cookie_name, tab_href);
}

function load_deal_tab(el, dealJSON)
{
//	timeline_collection_view = null;
//	var position = readCookie(contact_tab_position_cookie_name);
	
	$('#deal-details-tab a[href="#dealrelated"]', el).tab('show');

	deal_details_tab.loadDealRelatedContactsView();
	
	/*if(!position || position == "timeline")
	{
		activate_timeline_tab()
		contact_details_tab.load_timeline();
		return;
	}
	
	if(contact_details_tab["load_" + position])
	{
		
		
		// Should add active class, tab is not enough as content might not be shown in view.
		$(".tab-content", el).find("#" + position).addClass("active");
		contact_details_tab["load_" + position]();
	}*/
		
}


function load_deal_timeline_details(el, contactId, callback1, noAnimation){
	
		noAnimationBruteForce = true;
		timeline_entity_loader.init(App_Deal_Details.dealDetailView.model.toJSON());


}


