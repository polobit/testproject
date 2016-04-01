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
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"filter_results" : {
		"title" : "No contacts matching this criteria.",
		//"learn_more" : "click here to learn more",
		//"button_text" : "Add Contacts",
		"route" : "#",
		//"modal_id" : "personModal",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"filter_results_companies" : {
		"title" : "No companies matching this criteria.",
		//"learn_more" : "click here to learn more",
		//"button_text" : "Add Contacts",
		"route" : "#",
		//"modal_id" : "personModal",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"tag_results" : {
		"title" : "No contacts available with this tag.",
		//"learn_more" : "click here to learn more",
		//"button_text" : "Add Contacts",
		"route" : "#",
		//"modal_id" : "personModal",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"companies" : {
		"title" : "You do not have any companies currently.",
		"description" : "companies are prospects that you interact with using Agile.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add Companies",
		"route" : "#",
		"modal_id" : "companyModal",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"workflows" : {
		"title" : "You do not have any Campaigns currently.",
		"description" : "Campaign or workflow is an intelligent sales and marketing automation process for sending your contacts relevant information at the right time.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add Campaign",
		"route" : "#workflow-templates",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"deals" : {
		"title" : "No deals found.",
		"description" : "You either do not have any deals currently, or there are none matching the filter conditions. <br/>Deals are sales opportunities you track continuously throughout its lifecycle.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add Deal",
		"route" : "#",
		"modal_id" : "opportunityModal",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"reports" : {
		"title" : "You do not have any reports currently.",
		"description" : "Reports are based on a variety of tags and filters and receive them periodically to constantly be in touch with your sales cycle and pipeline.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add Report",
		"route" : "#report-add",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"activity-reports" : {
		"title" : "You do not have any activity reports currently.",
		"description" : "Get a periodic  email digest of various activities by users in Agile.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add Report",
		"route" : "#activity-report-add",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-filters" : {
		"title" : "You do not have any filters currently.",
		"description" : "Filters are used to sort contacts with a specific criteria to find patterns.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add Filter",
		"route" : "#contact-filter-add",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-views": {
		"title" : "You do not have any custom views currently.",
		"description" : "View is collection of different fields and the order in which you would like them to appear.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add View",
		"route" : "#contact-view-add",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"no-tickets" : {
		"title" : "You do not have any Tickets currently.",
		"description" : "Tickets can be problem, incident, question or task escalated by your customers. Set up email forwarding to receive tickets.",
		"button_text" : "Set up forwarding",
		"route" : "#ticket-groups",
		"image" : "/img/clipboard.png"
	},
	"no-ticket-filters" : {
		"title" : "You do not have any Tickets Filters currently.",
		"description" : "Tickets Filters are set of conditions to view Tickets which satisfies conditions.",
		"image" : "/img/clipboard.png"
	},
	"dashboard" : {
		"contacts" : {
			"title" : "There is no recent activity",
			"description" : "Perhaps, you may want to create a <a href='#' modal_id='personModal' class='modal-form'>new contact</a>.",
			"icon" : "icon-group icon-3x"
		},
		"tasks" : {
			"title" : "You have no tasks due",
			"icon" : "icon-edit icon-3x"
		},
		"deals" : {
			"title" : "No ongoing deals for you",
			"icon" : "icon-money icon-3x"
		},
		"workflows" : {
			"title" : "No campaign activity yet",
			"description" : "Campaigns help you automate your communication with your customers.<br/>You can create a <a href='#workflow-add'>new campaign</a>.",
			"icon" : "icon-sitemap icon-3x"
		}
	},
	"email-templates" : {
		"title" : "You do not have any Email templates currently.",
		"description" : "Personalize and customize email templates for every scenario in the sales cycle.",
		"button_text" : "Add Email Template",
		"route" : "#emailbuilder-templates",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-activities" : {
		"title" : "No Contact activity recorded yet.",
		"description" : "Web and Campaign activity of your contacts is shown here.",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-activities/All_Activities" : {
		"title" : "No Contact activity recorded yet.",
		"description" : "Web and Campaign activity of your contacts is shown here.",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-activities/Page_Views" : {
		"title" : "No web activity recorded yet.",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-activities/Email_Opened" : {
		"title" : "No email opens recorded yet.",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-activities/Email_Clicked" : {
		"title" : "No email clicks recorded yet.",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-activities/Unsubscribed" : {
		"title" : "No unsubscriptions recorded yet.",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-activities/Spam_Reports" : {
		"title" : "No spam reports recorded yet.",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-activities/Email_Hard_Bounced" : {
		"title" : "No hard bouces recorded yet.",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-activities/Email_Soft_Bounced" : {
		"title" : "No soft bounces recorded yet.",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"webpages" : {
		"title" : "You do not have any Webpages currently.",
		"description" : "You can create a page easily by using our smart builder.",
		"button_text" : "Add Webpage",
		"route" : "#webpage-add",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"deal-filters" : {
		"title" : "You do not have any filters currently.",
		"description" : "Filters are used to sort deals with a specific criteria to find patterns.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add Filter",
		"route" : "#deal-filter-add",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"dashboards" : {
		"title" : "You do not have any dashboards currently.",
		"description" : "Dashboards are used to configure different type of dashlets.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add Dashboard",
		"route" : "#add-dashboard",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	/*"web-rules" : {/All_Activities
		
		"title" : "Engage visitors on website",
		"description" : "Define web rules and engage your website visitors with smart popups, or perform automatic actions when contacts do (or don't do) something in your application or website. Checkout the <a href='https://github.com/agilecrm/agile-popups'>documentation</a>",
		"button_text" : "Add Web Rule",
		"route" : "#webrules-add",
		"image" : updateImageS3Path("/img/clipboard.png")
	}*/
	
};

/**
 * Fills the slate with the content respective to the current route in the
 * CONTENT_JSON
 */
function fill_slate(id, el, key) {
	var route_path = key;
	
	if(!route_path)
	{
		route_path = window.location.hash.split("#")[1];
	}

	// If content for current route is available in the CONTENT_JSON, slate
	// template is made with the content related to current route
	if (CONTENT_JSON[route_path]){

		var template_name = "", json = {};

		if((route_path == "contacts") && _agile_get_prefs('company_filter')){
			template_name = "empty-collection-model";
			json = CONTENT_JSON["companies"];
		} 	
		else if((route_path == "filter_results") && company_util.isCompany()){
			template_name = "empty-collection-model";
			json = CONTENT_JSON["filter_results_companies"];
		}
			
		else{
			template_name = "empty-collection-model";
			json = CONTENT_JSON[route_path];
		}
		
		getTemplate(template_name, json, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$("#" + id, el).html($(template_ui));	
		}, $("#" + id, el));
		
	}
}

function getContactPadcontentKey(url)
{
	if(!url)
		return;
	
	if(url.indexOf('tag') > 0)
		return "tag_results";
	
	if(url.indexOf('filter') > 0)
		return "filter_results";
	
	return "contacts";
		
}

function getCompanyPadcontentKey(url)
{
	if(!url)
		return;
	
	if(url.indexOf('tag') > 0)
		return "tag_results";
	
	if(url.indexOf('filter') > 0)
		return "filter_results";
	
	return "companies";
		
}

/**
 * Show modal if add entity form is modal, it is used for contacts (adding new contact)
 */
$(function() {
	
	// Show activity modal
	$("body").on("click", ".modal-form", function(e) {
		e.preventDefault();
		var id = $(this).attr('modal_id');
		if(id == "opportunityModal")
			show_deal();
		else if(id == "personModal")
			addContactBasedOnCustomfields();
		else 
			$("#" + id).modal('show');
	});
});