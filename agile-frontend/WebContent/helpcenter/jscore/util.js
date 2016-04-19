function showTransitionBar()
{
	if ($('.butterbar').hasClass('hide'))
		$('.butterbar').removeClass('hide');
	if (!$('.butterbar').hasClass('animation-active'))
		$('.butterbar').addClass('animation-active');
}
function hideTransitionBar()
{
	setTimeout(function()
	{
		if ($('.butterbar').hasClass('animation-active'))
			$('.butterbar').removeClass('animation-active');
		if (!$('.butterbar').hasClass('hide'))
			$('.butterbar').addClass('hide');
	}, 10);
}
var LOADING_HTML = '<img class="loading" style="padding-left:10px;padding-right:5px;opacity:0.5;" src= "'+updateImageS3Path("/flatfull/img/ajax-loader-cursor.gif")+'"></img>';

/**
 * Set of loading images
 */
LOADING_HTML_IMAGES = [
	LOADING_HTML
]
function getRandomLoadingImg()
{
	var length = LOADING_HTML_IMAGES.length;
	return LOADING_HTML_IMAGES[Math.round(Math.random() * (LOADING_HTML_IMAGES.length - 1))]
}
 function updateImageS3Path(imageUrl){

 if(!imageUrl)
    imageUrl = "";
 
 try{
  if(imageUrl){
   imageUrl = imageUrl.replace("flatfull/", "").replace(/\.{2}/g, '');
     } 
 }catch(e){}
    

 if(!S3_STATIC_IMAGE_PATH)
  S3_STATIC_IMAGE_PATH = "//doxhze3l6s7v9.cloudfront.net/beta/static/";

 return (S3_STATIC_IMAGE_PATH + imageUrl);
}

 /**
 * 
 * Triggers all tinymce editors save. It is used in base-modal to save
 * content back to textarea before form serialization.
 * 
 **/
function trigger_tinymce_save()
{
 try
 {
  if(typeof (tinymce) !== "undefined")
   tinymce.triggerSave();
 }
 catch(err)
 {
  console.log("error occured while triggering tiny save...");
  console.log(err);
 }
}
function get_tags(){
 var json = {};
	return json ;
}
function get_notes(){
 var json = {};
	return json ;
}
function get_related_deals(){
 var json = {};
	return json ;
}
function track_with_save_success_model(){
 var json = {};
	return json ;
}


