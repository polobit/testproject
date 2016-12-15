/** Image loader while template render */
var Template_Render_Image_Loader = '<img class="loading" style="padding-right:5px;opacity:0.5;" src= "'+updateImageS3Path("/flatfull/img/ajax-loader-cursor.gif")+'"></img>';


// Count XHR call
var Count_XHR_Call;

var CONTACTS_ACLS_UPDATE_ERROR = "{{agile_lng_translate 'bulk-actions' 'no-pem-to-edit-contacts'}}";

var DEALS_CONTACTS_BULK_DELETE_ERROR = "{{agile_lng_translate 'bulk-actions' 'no-pem-to-edit-deals'}}<br/><br/> {{agile_lng_translate 'deal-view' 'do-you-want-to-proceed'}}";

var DEALS_CONTACTS_BULK_ARCHIVE_ERROR = "{{agile_lng_translate 'bulk-actions' 'no-pem-to-archive-deals'}}<br/><br/> {{agile_lng_translate 'deal-view' 'do-you-want-to-proceed'}}";

var DEALS_CONTACTS_BULK_RESTORE_ERROR = "{{agile_lng_translate 'bulk-actions' 'no-pem-to-restore-deals'}}<br/><br/> {{agile_lng_translate 'deal-view' 'do-you-want-to-proceed'}}";

var DEALS_CONTACTS_BULK_TAGS_ERROR = "{{agile_lng_translate 'bulk-actions' 'no-pem-to-ad-tags'}}<br/><br/> {{agile_lng_translate 'deal-view' 'do-you-want-to-proceed'}}";

var DEALS_CONTACTS_BULK_UPDATE_ERROR = "{{agile_lng_translate 'bulk-actions' 'no-pem-to-update-deals'}}<br/><br/> {{agile_lng_translate 'deal-view' 'do-you-want-to-proceed'}}";

var DEALS_CONTACTS_BULK_OWNER_CHANGE_ERROR = "{{agile_lng_translate 'bulk-actions' 'no-pem-to-update-deal-owners'}}<br/><br/> {{agile_lng_translate 'deal-view' 'do-you-want-to-proceed'}}";

var DOCS_CONTACTS_BULK_DELETE_ERROR = "{{agile_lng_translate 'bulk-actions' 'no-pem-to-delete-documents'}}<br/><br/> {{agile_lng_translate 'deal-view' 'do-you-want-to-proceed'}}";

var DEALS_ARCHIVE_CONTACT_ACL_ERROR = "{{agile_lng_translate 'bulk-actions' 'no-pem-to-archive-deal-contacts'}}";

var DEALS_RESTORE_CONTACT_ACL_ERROR = "{{agile_lng_translate 'bulk-actions' 'no-pem-to-restore-deal-contacts'}}";

var TASKS_CONTACTS_BULK_DELETE_ERROR = "{{agile_lng_translate 'bulk-actions' 'no-pem-to-delete-tasks'}}<br/><br/> {{agile_lng_translate 'deal-view' 'do-you-want-to-proceed'}}";

var CONTACTS_ACTIVITY_ACL_DELETE_ERROR = "{{agile_lng_translate 'bulk-actions' 'no-pem-to-delete-ass-contacts'}}";

var DOC_ACL_DETACH_ERROR = "{{agile_lng_translate 'bulk-actions' 'no-pem-to-delete-ass-documents'}}";

// Google Maps URL
var Google_Maps_URL = "https://maps.googleapis.com/maps/api/js";

/*$(function(){
	if(CURRENT_USER_PREFS.theme == 15){
		Template_Render_Image_Loader = LOADING_HTML = '<img class="loading" style="padding-right:5px;opacity:0.5;width:25px" src= "/flatfull/img/loader.gif"></img>';
		LOADING_HTML_IMAGES = [LOADING_HTML];
	}
});*/