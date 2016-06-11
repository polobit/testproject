/** Image loader while template render */
var Template_Render_Image_Loader = '<img class="loading" style="padding-right:5px;opacity:0.5;" src= "'+updateImageS3Path("/flatfull/img/ajax-loader-cursor.gif")+'"></img>';


// Count XHR call
var Count_XHR_Call;

var CONTACTS_ACLS_UPDATE_ERROR = "You do not have permission to update this contact.";

var DEALS_CONTACTS_BULK_DELETE_ERROR = "Deals will not be deleted for contacts for which you do not have update permissions.<br/><br/> Do you want to proceed?";

var DEALS_CONTACTS_BULK_ARCHIVE_ERROR = "Deals will not be archived for contacts for which you do not have update permissions.<br/><br/> Do you want to proceed?";

var DEALS_CONTACTS_BULK_RESTORE_ERROR = "Deals  will not be restored for contacts for which you do not have update permissions.<br/><br/> Do you want to proceed?";

var DEALS_CONTACTS_BULK_TAGS_ERROR = "Tags will not be added for contacts for which you do not have update permissions.<br/><br/> Do you want to proceed?";

var DEALS_CONTACTS_BULK_UPDATE_ERROR = "Deals will not be updated for contacts for which you do not have update permissions.<br/><br/> Do you want to proceed?";

var DEALS_CONTACTS_BULK_OWNER_CHANGE_ERROR = "Owner for deals will not be changed for contacts for which you do not have update permissions.<br/><br/> Do you want to proceed?";

var DOCS_CONTACTS_BULK_DELETE_ERROR = "Documents will not be deleted for contacts for which you do not have update permissions(s).<br/><br/> Do you want to proceed?";

var DEALS_ARCHIVE_CONTACT_ACL_ERROR = "Deal cannot be archived because you do not have permission to update associated contact(s).";

var DEALS_RESTORE_CONTACT_ACL_ERROR = "Deal cannot be restored because you do not have permission to update associated contact(s).";

var TASKS_CONTACTS_BULK_DELETE_ERROR = "Tasks will not be deleted for contacts for which you do not have update permissions.<br/><br/> Do you want to proceed?";

var CONTACTS_ACTIVITY_ACL_DELETE_ERROR = "cannot be deleted because you do not have permission to update associated contact(s).";