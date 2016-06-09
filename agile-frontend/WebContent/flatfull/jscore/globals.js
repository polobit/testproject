/** Image loader while template render */
var Template_Render_Image_Loader = '<img class="loading" style="padding-right:5px;opacity:0.5;" src= "'+updateImageS3Path("/flatfull/img/ajax-loader-cursor.gif")+'"></img>';


// Count XHR call
var Count_XHR_Call;

var CONTACTS_ACLS_UPDATE_ERROR = "You may have some related contacts without update permission for contacts.<br/><br/> Do you want to proceed?";