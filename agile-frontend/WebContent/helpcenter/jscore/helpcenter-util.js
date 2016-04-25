var Helpcenter_Util = {

	setBreadcrumbPath: function(template_name, data){

		if(!template_name)
		{	
			$('#breadcrumb').html('');
			return;
		}

		$('#breadcrumb').html(getTemplate(template_name, data));
	}
};

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

/**
 * Loading spinner shown while loading
 */
var LOADING_HTML = '<img class="loading" style="padding-left:10px;padding-right:5px;opacity:0.5;" src= "'+updateImageS3Path("/flatfull/img/ajax-loader-cursor.gif")+'"></img>';

/**
 * Set of loading images
 */
LOADING_HTML_IMAGES = [
	LOADING_HTML
]

/**
 * Returns random loading images
 * 
 * @returns
 */
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