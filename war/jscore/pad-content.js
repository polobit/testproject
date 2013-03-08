/**
 * Defines a JSON of content to be shown in the respective route when collection
 * is empty. The content respective to each route is used to fill the slate
 * template which is shown when collection is empty, called from
 * base_collection.
 * 
 * Each current route key contacts title, description, learn_more, button_text,
 * route, modal_id, image
 * 
 * <P>
 * "KEY SHOULD BE CURRENT ROUTE"
 * </p>
 */
var CONTENT_JSON = {
	"contacts" : {
		"title" : "You dont have any contacts",
		"description" : "You can add your contact details.......etc...etc",
		"learn_more" : "click here to learn more",
		"button_text" : "Add Contacts",
		"route" : "#",
		"modal_id" : "personModal",
		"image" : "/img/clipboard.png"
	},
	"companies" : {
		"title" : "You dont have any companies",
		"description" : "You can add your company details.......etc...etc",
		"learn_more" : "click here to learn more",
		"button_text" : "Add Companies",
		"route" : "#",
		"modal_id" : "companyModal",
		"image" : "/img/clipboard.png"
	},
	"workflows" : {
		"title" : "You dont have any workflows",
		"description" : "You can add your workflows details.......etc...etc",
		"learn_more" : "click here to learn more",
		"button_text" : "Add Workflows",
		"route" : "#workflow-add",
		"image" : "/img/clipboard.png"
	},
	"deals" : {
		"title" : "You dont have any deals",
		"description" : "You can add your deal details.......etc...etc",
		"learn_more" : "click here to learn more",
		"button_text" : "Add deal",
		"route" : "#deals-add",
		"image" : "/img/clipboard.png"
	},
	"reports" : {
		"title" : "You dont have any reports",
		"description" : "You can add your report details.......etc...etc",
		"learn_more" : "click here to learn more",
		"button_text" : "Add Report",
		"route" : "#report-add",
		"image" : "/img/clipboard.png"
	},
	"contact-filters" : {
		"title" : "You dont have any filter",
		"description" : "You can add your filters details.......etc...etc",
		"learn_more" : "click here to learn more",
		"button_text" : "Add filter",
		"route" : "#contact-filter-add",
		"image" : "/img/clipboard.png"
	},
	"contact-views": {
		"title" : "You dont have any custom views",
		"description" : "You can add your custom view details.......etc...etc",
		"learn_more" : "click here to learn more",
		"button_text" : "Add view",
		"route" : "#contact-view-add",
		"image" : "/img/clipboard.png"
	}
	
};

/**
 * Fills the slate with the content respective to the current route in the
 * CONTENT_JSON
 */
function fillSlate(id, el) {

	// If content for current route is available in the CONTENT_JSON, slate
	// template is made with the content related to current route
	if (CONTENT_JSON[Current_Route]){
		if((Current_Route == "contacts") && readCookie('company_filter'))
			$("#" + id, el).html(
					getTemplate("empty-collection-model",
							CONTENT_JSON["companies"]));
		else
			$("#" + id, el).html(
				getTemplate("empty-collection-model",
						CONTENT_JSON[Current_Route]));
	}

}

/**
 * Show modal if add entity form is modal, it is used for contacts (adding new contact)
 */
$(function() {
	
	// Show activity modal
	$('.modal-form').live('click', function(e) {
		e.preventDefault();
		var id = $(this).attr('modal_id');
		$("#" + id).modal('show');
	});
});