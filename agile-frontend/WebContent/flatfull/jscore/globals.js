/** Image loader while template render */
var Template_Render_Image_Loader = '<img class="loading" style="padding-right:5px;opacity:0.5;" src= "'+updateImageS3Path("/flatfull/img/ajax-loader-cursor.gif")+'"></img>';


// Count XHR call
var Count_XHR_Call;

var CONTACTS_ACLS_UPDATE_ERROR = "You do not have permission to update this contact.";

var DEALS_CONTACTS_BULK_DELETE_ERROR = "Deals associated to contacts for which you do not have update permissions will not be deleted.<br/><br/> Do you want to proceed?";

var DEALS_CONTACTS_BULK_ARCHIVE_ERROR = "Deals associated to contacts for which you do not have update permissions will not be archived.<br/><br/> Do you want to proceed?";

var DEALS_CONTACTS_BULK_RESTORE_ERROR = "Deals associated to contacts for which you do not have update permissions will not be restored.<br/><br/> Do you want to proceed?";

var DEALS_CONTACTS_BULK_TAGS_ERROR = "Tags will not be added for which you do not have contact update permissions.<br/><br/> Do you want to proceed?";

var DEALS_CONTACTS_BULK_UPDATE_ERROR = "Deals associated to contacts for which you do not have update permissions will not be updated.<br/><br/> Do you want to proceed?";

var DEALS_CONTACTS_BULK_OWNER_CHANGE_ERROR = "Deals associated to contacts for which you do not have update permissions owner will not be changed.<br/><br/> Do you want to proceed?";

var DOCS_CONTACTS_BULK_DELETE_ERROR = "Documents associated to contacts for which you do not have update permissions will not be deleted.<br/><br/> Do you want to proceed?";

var DEALS_ARCHIVE_CONTACT_ACL_ERROR = "Deal cannot be archived because you do not have permission to update associated contact.";

var DEALS_RESTORE_CONTACT_ACL_ERROR = "Deal cannot be restored because you do not have permission to update associated contact.";