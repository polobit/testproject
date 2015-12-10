/**
 * Set image URL in tinymce upload editor
 * @param url
 */
function setTinyMCEImageUploadURL(url){
	
	var elem = $(".mce-abs-layout").find("input")[0];
    $(elem).val(url).trigger("change");
    
}