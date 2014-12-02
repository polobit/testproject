/**
 * task timeline plugin
 * 
 * @auther jitendra
 */

var TaskDetailsRouter = Backbone.Router.extend({ routes : { 'task/:id' : 'taskDetailView' },

taskDetailView : function()
{
				$("#content").html(getTemplate("task-detail"), {});

}

});

$(function()
{

				var id;

				/**
				 * Activates the Timeline tab-content to show the time-line with all
				 * details, which are already added to time-line, when the task is getting
				 * to its detail view.
				 */
				$('#taskDetailsTab a[href="#timeline"]').live('click', function(e)
				{
								e.preventDefault();

								save_task_tab_position_in_cookie("timeline");

								task_details_tab.load_timeline();
				});



				/**
				 * Fetches all the notes related to the contact and shows the notes
				 * collection as a table in its tab-content, when "Notes" tab is clicked.
				 */
				$('#contactDetailsTab a[href="#notes"]').live('click', function(e)
				{
								e.preventDefault();
								save_task_tab_position_in_cookie("notes");
								contact_details_tab.load_notes();
				});

	

				/**
				 * Fetches all the documents related to the contact and shows the documents
				 * collection as a table in its tab-content, when "Documents" tab is
				 * clicked.
				 */
				$('#contactDetailsTab a[href="#documents"]').live('click', function(e)
				{
								e.preventDefault();
								save_task_tab_position_in_cookie("documents");
								task_details_tab.load_documents();
				});



				$('#contactDetailsTab a[href="#company-contacts"]').live('click', function(e)
				{
								e.preventDefault();
								fill_company_related_contacts(App_Contacts.contactDetailView.model.id, 'company-contacts');
				});


				/**
				 * Delete functionality for activity blocks in contact details
				 */
				$('.activity-delete').die().live('click', function(e)
				{
								e.preventDefault();

								var model = $(this).parents('li').data();

								if (model && model.collection)
								{
												model.collection.remove(model);
								}

								// Gets the id of the entity
								var entity_id = $(this).attr('id');

								// Gets the url to which delete request is to be sent
								var entity_url = $(this).attr('url');

								if (!entity_url)
												return;

								var id_array = [];
								var id_json = {};

								// Create array with entity id.
								id_array.push(entity_id);

								// Set entity id array in to json object with key ids,
								// where ids are read using form param
								id_json.ids = JSON.stringify(id_array);
								var that = this;

								// Add loading. Adds loading only if there is no loaded image added
								// already i.e.,
								// to avoid multiple loading images on hitting delete multiple times
								if ($(this).find('.loading').length == 0)
												$(this).prepend($(LOADING_HTML).addClass('pull-left').css('width', "20px"));

								$.ajax({ url : entity_url, type : 'POST', data : id_json, success : function()
								{
												// Removes activity from list
												$(that).parents(".activity").fadeOut(400, function()
												{
																$(this).remove();
												});
												removeItemFromTimeline($("#" + entity_id, $("#timeline")));
								} });
				});


});


/**
 * Returns contact properties in a json
 * 
 * @method get_property_JSON
 * @param {Object}
 *            contactJSON contact as json object
 */  
function get_property_JSON(contactJSON)
{	
	var properties = contactJSON.properties;
    var json = {};
	$.each(properties, function(i, val)
			{
				json[this.name] = this.value;
			});
	console.log(json);
	return json;
}


/**
 * Activates "Timeline" tab and its tab-content in contact details and also
 * deactivates the other activated tabs.
 * 
 * @method activate_timeline_tab
 * 
 * Changed to activate first tab in the list ( on contact-details page , works
 * even on company-details page
 * @modified Chandan
 */
function activate_timeline_tab(){
	$('#contactDetailsTab').find('li.active').removeClass('active');
	$('#contactDetailsTab li:first-child').addClass('active');
	
	$('div.tab-content').find('div.active').removeClass('active');
	$('div.tab-content > div:first-child').addClass('active');
	
	// $('#time-line').addClass('active'); //old original code for flicking
	// timeline
	
	if(App_Contacts.contactDetailView.model.get('type')=='COMPANY')
	{
		fill_company_related_contacts(App_Contacts.contactDetailView.model.id,'company-contacts'); 
	}
}



function save_task_tab_position_in_cookie(tab_href)
{
	
	var position = readCookie(contact_tab_position_cookie_name);
	
	if(position == tab_href)
		return;
	
	createCookie(contact_tab_position_cookie_name, tab_href);
}




