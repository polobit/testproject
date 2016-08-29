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
		"title" : "{{agile_lng_translate 'portlets' 'no-contacts-pad-content'}}",
		"description" : "{{agile_lng_translate 'portlets' 'no-contacts-pad-content-title'}}",
		//"learn_more" : "click here to learn more",
		"button_text" : "{{agile_lng_translate 'portlets' 'contacts-btn-text'}}",
		"route" : "#",
		"modal_id" : "personModal",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"filter_results" : {
		"title" : "{{agile_lng_translate 'portlets' 'contacts-filter-results-title'}}",
		//"learn_more" : "click here to learn more",
		//"button_text" : "Add Contacts",
		"route" : "#",
		//"modal_id" : "personModal",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"filter_results_segments" : {
		"title" : "{{agile_lng_translate 'portlets' 'filter-results-segments-pad-content-title'}}",
		"route" : "#",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"filter_results_companies" : {
		"title" : "{{agile_lng_translate 'portlets' 'filter-results-companies-pad-content-title'}}",
		//"learn_more" : "click here to learn more",
		//"button_text" : "Add Contacts",
		"route" : "#",
		//"modal_id" : "personModal",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"tag_results" : {
		"title" : "{{agile_lng_translate 'admin-settings-tags' 'no-contacts-available-with-this-tag'}}",
		//"learn_more" : "click here to learn more",
		//"button_text" : "Add Contacts",
		"route" : "#",
		//"modal_id" : "personModal",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"companies" : {
		"title" : "{{agile_lng_translate 'portlets' 'companies-pad-content-title'}}",
		"description" : "{{agile_lng_translate 'report-chart-forms' 'companies-are-prospects-that-you-interact-with-using-agile'}}",
		//"learn_more" : "click here to learn more",
		"button_text" : "{{agile_lng_translate 'companies-view' 'add-companies'}}",
		"route" : "#",
		"modal_id" : "companyModal",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"workflows" : {
		"title" : "{{agile_lng_translate 'portlets' 'workflows-pad-content-title'}}",
		"description" : "{{agile_lng_translate 'campaigns' 'no-campaigns-desc'}}",
		//"learn_more" : "click here to learn more",
		"button_text" : "{{agile_lng_translate 'campaigns' 'add-campaign'}}",
		"route" : "#workflow-templates",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"deals" : {
		"title" : "{{agile_lng_translate 'portlets' 'no-deals-found'}}.",
		"description" : "{{agile_lng_translate 'portlets' 'deals-pad-content-desc'}}<br/> {{agile_lng_translate 'portlets' 'deals-pad-content-desc-2'}}",
		//"learn_more" : "click here to learn more",
		"button_text" : "{{agile_lng_translate 'portlets' 'deals-btn-text'}}",
		"route" : "#",
		"modal_id" : "opportunityModal",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"reports" : {
		"title" : "{{agile_lng_translate 'portlets' 'reports-pad-content-title'}}",
		"description" : "{{agile_lng_translate 'portlets' 'reports-pad-content-desc'}}",
		//"learn_more" : "click here to learn more",
		"button_text" : "{{agile_lng_translate 'report-view' 'add-report'}}",
		"route" : "#report-add",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"activity-reports" : {
		"title" : "{{agile_lng_translate 'portlets' 'activity-reports-pad-content-title'}}",
		"description" : "{{agile_lng_translate 'portlets' 'activity-reports-pad-content-desc'}}",
		//"learn_more" : "click here to learn more",
		"button_text" : "{{agile_lng_translate 'report-view' 'add-report'}}",
		"route" : "#activity-report-add",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"campaign-reports" : {
		"title" : "{{agile_lng_translate 'campaigns' 'not-having-reports'}}",
		"description" : "{{agile_lng_translate 'campaigns' 'periodic-reports'}}",
		//"learn_more" : "click here to learn more",
		"button_text" : "{{agile_lng_translate 'report-view' 'add-report'}}",
		"route" : "#campaign-report-add",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-filters" : {
		"title" : "{{agile_lng_translate 'portlets' 'deal-filters-pad-content-title'}}",
		"description" : "{{agile_lng_translate 'portlets' 'contact-filters-pad-content-desc'}}",
		//"learn_more" : "click here to learn more",
		"button_text" : "{{agile_lng_translate 'portlets' 'deal-filters-btn-text'}}",
		"route" : "#contact-filter-add",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-views": {
		"title" : "{{agile_lng_translate 'portlets' 'contact-views-pad-content-title'}}",
		"description" : "{{agile_lng_translate 'portlets' 'contact-views-pad-content-desc'}}",
		//"learn_more" : "click here to learn more",
		"button_text" : "{{agile_lng_translate 'contacts-view' 'add-view'}}",
		"route" : "#contact-view-add",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"no-tickets" : {
		"title" : "{{agile_lng_translate 'portlets' 'no-tickets-pad-content-title'}}",
		"description" : "{{agile_lng_translate 'portlets' 'no-tickets-pad-content-desc'}}",
		"button_text" : "{{agile_lng_translate 'portlets' 'no-tickets-btn-text'}}",
		"route" : "#ticket-groups",
		"image" : "/img/clipboard.png"
	},
	"no-ticket-filters" : {
		"title" : "{{agile_lng_translate 'portlets' 'no-ticket-filters-pad-content-title'}}",
		"description" : "{{agile_lng_translate 'portlets' 'no-ticket-filters-pad-content-desc'}}",
		"image" : "/img/clipboard.png"
	},
	"dashboard" : {
		"contacts" : {
			"title" : "{{agile_lng_translate 'portlets' 'dashboard-contacts-title'}}",
			"description" : "Perhaps, you may want to create a <a href='#' modal_id='personModal' class='modal-form'>new contact</a>.",
			"icon" : "icon-group icon-3x"
		},
		"tasks" : {
			"title" : "{{agile_lng_translate 'portlets' 'dashboard-tasks-title'}}",
			"icon" : "icon-edit icon-3x"
		},
		"deals" : {
			"title" : "{{agile_lng_translate 'portlets' 'dashboard-deals-title'}}",
			"icon" : "icon-money icon-3x"
		},
		"workflows" : {
			"title" : "{{agile_lng_translate 'portlets' 'dashboard-workflows-title'}}",
			"description" : "Campaigns help you automate your communication with your customers.<br/>You can create a <a href='#workflow-add'>new campaign</a>.",
			"icon" : "icon-sitemap icon-3x"
		}
	},
	"email-templates" : {
		"title" : "{{agile_lng_translate 'portlets' 'email-templates-pad-content-title'}}",
		"description" : "{{agile_lng_translate 'prefs-email-templates' 'no-email-tpl-desc'}}",
		"button_text" : "{{agile_lng_translate 'portlets' 'email-templates-btn-text'}}",
		"route" : "#emailbuilder-templates",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-activities" : {
		"title" : "{{agile_lng_translate 'portlets' 'contact-activities-pad-content-title'}}",
		"description" : "{{agile_lng_translate 'portlets' 'contact-activities-all-activities-pad-content-desc'}}",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-activities/All_Activities" : {
		"title" : "{{agile_lng_translate 'portlets' 'contact-activities-pad-content-title'}}",
		"description" : "{{agile_lng_translate 'portlets' 'contact-activities-all-activities-pad-content-desc'}}",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-activities/Page_Views" : {
		"title" : "{{agile_lng_translate 'portlets' 'contact-activities-page-views-pad-content-title'}}",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-activities/Email_Opened" : {
		"title" : "{{agile_lng_translate 'portlets' 'contact-activities-page-views-pad-content-desc'}}",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-activities/Email_Clicked" : {
		"title" : "{{agile_lng_translate 'portlets' 'contact-activities-email-clicked-pad-content-title'}}",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-activities/Unsubscribed" : {
		"title" : "{{agile_lng_translate 'portlets' 'contact-activities-unsubscribed-pad-content-title'}}",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-activities/Spam_Reports" : {
		"title" : "{{agile_lng_translate 'portlets' 'contact-activities-spam-reports-pad-content-title'}}",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-activities/Email_Hard_Bounced" : {
		"title" : "{{agile_lng_translate 'campaigns' 'email-no-hard-bounces'}}",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"contact-activities/Email_Soft_Bounced" : {
		"title" : "{{agile_lng_translate 'portlets' 'contact-activities-email-soft-bounced-pad-content-title'}}",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"webpages" : {
		"title" : "{{agile_lng_translate 'portlets' 'webpages-pad-content-title'}}",
		"description" : "{{agile_lng_translate 'portlets' 'webpages-pad-content-desc'}}",
		"button_text" : "{{agile_lng_translate 'portlets' 'webpages-btn-text'}}",
		"route" : "#webpage-add",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"deal-filters" : {
		"title" : "{{agile_lng_translate 'portlets' 'deal-filters-pad-content-title'}}",
		"description" : "{{agile_lng_translate 'portlets' 'deal-filters-pad-content-desc'}}",
		//"learn_more" : "click here to learn more",
		"button_text" : "{{agile_lng_translate 'portlets' 'deal-filters-btn-text'}}",
		"route" : "#deal-filter-add",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"dashboards" : {
		"title" : "{{agile_lng_translate 'portlets' 'user-defined-dashboards'}}",
		"description" : "{{agile_lng_translate 'portlets' 'no-user-defined-dashboards-desc'}}",
		//"learn_more" : "click here to learn more",
		"button_text" : "{{agile_lng_translate 'portlets' 'add-dashboard'}}",
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
	"leads" : {
		"title" : "{{agile_lng_translate 'leads' 'no-leads-pad-content'}}",
		"description" : "{{agile_lng_translate 'leads' 'no-leads-pad-content-title'}}",
		"button_text" : "{{agile_lng_translate 'leads' 'leads-btn-text'}}",
		"route" : "#add-lead",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"filter_results_leads" : {
		"title" : "{{agile_lng_translate 'leads' 'leads-filter-results-title'}}",
		"route" : "#",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	"lead-filters" : {
		"title" : "{{agile_lng_translate 'portlets' 'deal-filters-pad-content-title'}}",
		"description" : "{{agile_lng_translate 'leads' 'lead-filters-pad-content-desc'}}",
		"button_text" : "{{agile_lng_translate 'portlets' 'deal-filters-btn-text'}}",
		"route" : "#lead-filter-add",
		"image" : updateImageS3Path("/img/clipboard.png")
	},
	
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

function getSegmentPadcontentKey(url)
{
	if(!url)
		return;
	
	return "filter_results_segments";
		
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

function getLeadPadcontentKey(url)
{
	if(!url)
		return;
	
	if(url.indexOf('tag') > 0)
		return "tag_results";
	
	if(url.indexOf('filter') > 0)
		return "filter_results_leads";
	
	return "leads";
		
}
