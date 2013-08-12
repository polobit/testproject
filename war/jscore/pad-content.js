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
		"title" : "You do not have any contacts currently.",
		"description" : "Contacts are your customers or prospects that you interact with using Agile.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add Contacts",
		"route" : "#",
		"modal_id" : "personModal",
		"image" : "/img/clipboard.png"
	},
	"companies" : {
		"title" : "You do not have any companies currently.",
		"description" : "compaines are prospects that you interact with using Agile.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add Companies",
		"route" : "#",
		"modal_id" : "companyModal",
		"image" : "/img/clipboard.png"
	},
	"workflows" : {
		"title" : "You do not have any Campaigns currently.",
		"description" : "Campaign or workflow is an intelligent sales and marketing automation process for sending your contacts relevant information at the right time.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add Campaign",
		"route" : "#workflow-add",
		"image" : "/img/clipboard.png"
	},
	"deals" : {
		"title" : "You do not have any deals currently.",
		"description" : "Deals are sales opportunities you track continuously throughout its lifecycle.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add Deal",
		"route" : "#",
		"modal_id" : "opportunityModal",
		"image" : "/img/clipboard.png"
	},
	"reports" : {
		"title" : "You do not have any reports currently.",
		"description" : "Reports are based on a variety of tags and filters and receive them periodically to constantly be in touch with your sales cycle and pipeline.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add Report",
		"route" : "#report-add",
		"image" : "/img/clipboard.png"
	},
	"contact-filters" : {
		"title" : "You do not have any filters currently.",
		"description" : "Filters are used to sort contacts with a specific criteria to find patterns.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add Filter",
		"route" : "#contact-filter-add",
		"image" : "/img/clipboard.png"
	},
	"contact-views": {
		"title" : "You do not have any custom views currently.",
		"description" : "View is collection of different fields and the order in which you would like them to appear.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add View",
		"route" : "#contact-view-add",
		"image" : "/img/clipboard.png"
	},
	"dashboard" : {
		"contacts" : {
			"title" : "There is no recent activity",
			"icon" : "icon-group icon-3x",
			"description" : " Perhaps, you may want to create a ",
			//"learn_more" : "click here to learn more",
			"button_text" : "New Contact",
			"route" : "#",
			"modal_id" : "personModal",
		},
		"tasks" : {
			"title" : "You have no tasks due",
			"icon" : "icon-edit icon-3x"
		},
		"deals" : {
			"title" : "No upcoming deals for you",
			"icon" : "icon-money icon-3x"
		},
		"workflows" : {
			"title" : "No campaign activity yet",
			"description" : "Campaigns help you automate your communication with your customers. You can create a",
			"icon" : "icon-sitemap icon-3x",
			"button_text" : "New Campaign",
			"route" : "#workflow-add"
		}
	},
	"email-templates" : {
		"title" : "You do not have any Email templates currently.",
		"description" : "Personalize and customize email templates for every scenario in the sales cycle.",
		"button_text" : "Add Email Template",
		"route" : "#email-template-add",
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
		if(id == "opportunityModal")
			showDeal();
		else
			$("#" + id).modal('show');
	});
});