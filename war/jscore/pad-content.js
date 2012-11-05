// Key should be current route
var CONTENT_JSON = {
		"contacts": {
			"title": "You dont have any contacts yet",
			"description" : "You can add your contact details.......etc...etc",
			"learn_more" : "click here to learn more",
			"button_text":"Add Contacts",
			"route":"#",
			"modal_id":"personModal"
		},
		"workflows": {
			"title": "You dont have any workflows yet",
			"description" : "You can add your workflows details.......etc...etc",
			"learn_more" : "click here to learn more",
			"button_text":"Add Workflows",
			"route":"#workflow-add"
		},
		"deals": {
			"title": "You dont have any deals yet",
			"description" : "You can add your deal details.......etc...etc",
			"learn_more" : "click here to learn more",
			"button_text":"Add deal",
			"route":"#deals-add"
		}
};

// Fill the slate if contacts are empty
function fillSlate(id, el)
{
	if(CONTENT_JSON[Current_Route])
		$("#" + id, el).html(getTemplate("empty-collection-model", CONTENT_JSON[Current_Route]));
	
	
}

// Show modal if add entity form is modal
$(function(){
	    	// Show activity modal
		$('.modal-form').live('click', function (e) {
			e.preventDefault();
			var id = $(this).attr('modal_id');
			$("#" + id).modal('show');
		});
});