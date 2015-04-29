/**
 * contact-details-tabs.js fetches the contact (which is in contact detail view) 
 * related details (notes, tasks, deals, campaigns and mails etc..) and presents 
 * in tab content as specified, when the corresponding tab is clicked. 
 * Timeline tab is activated by default to show all the details as vertical time-line.
 * 
 * @module Contact management
 * @author Rammohan
 */

var deal_tab_position_cookie_name = "deal_tab_position";


$(function(){ 

	var id;
	

	
	/**
	 * Fetches all the notes related to the deal and shows the notes collection 
	 * as a table in its tab-content, when "Notes" tab is clicked.
	 */ 
	$('#deal-details-tab a[href="#dealnotes"]').live('click', function (e){
		e.preventDefault();
		save_deal_tab_position_in_cookie("dealnotes");
		deal_details_tab.load_deal_notes();
	});
	
	
	
	/**
	 * Fetches all the contacts related to the deal and shows the contacts collection 
	 * as a table in its tab-content, when "contacts" tab is clicked.
	 */
	$('#deal-details-tab a[href="#dealrelated"]').live('click', function (e){
		e.preventDefault();
		save_deal_tab_position_in_cookie("dealrelated");
		deal_details_tab.loadDealRelatedContactsView();
	});
	
	/**
	 * Fetches all the notes related to the contact and shows the tasks collection 
	 * as a table in its tab-content, when "Tasks" tab is clicked.
	 */
	$('#deal-details-tab a[href="#dealactivities"]').live('click', function (e){
		e.preventDefault();
		save_deal_tab_position_in_cookie("dealactivities");
		deal_details_tab.load_deal_activities();
	});
	
	/**
	 * Fetches all the docs related to the deal and shows the docs collection 
	 * as a table in its tab-content, when "Documents" tab is clicked.
	 */
	$('#deal-details-tab a[href="#dealdocs"]').live('click', function (e){
		e.preventDefault();
		save_deal_tab_position_in_cookie("dealdocs");
		deal_details_tab.load_deal_docs();
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
	var position = readCookie(deal_tab_position_cookie_name);
	if(position){
		if(position=="dealactivities"){
			$('#deal-details-tab a[href="#dealactivities"]', el).tab('show');

			deal_details_tab.load_deal_activities();
		}
		else if(position=="dealrelated"){
			$('#deal-details-tab a[href="#dealrelated"]', el).tab('show');

			deal_details_tab.loadDealRelatedContactsView();
		}
		else if(position=="dealnotes"){
			$('#deal-details-tab a[href="#dealnotes"]', el).tab('show');

			deal_details_tab.load_deal_notes();
		}
		else if(position=="dealdocs"){
			$('#deal-details-tab a[href="#dealdocs"]', el).tab('show');

			deal_details_tab.load_deal_docs();
		}
	}
	else{
	
	$('#deal-details-tab a[href="#dealactivities"]', el).tab('show');

	deal_details_tab.load_deal_activities();
	}
	
		
}



