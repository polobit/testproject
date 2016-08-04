
var CONTENT_JSON = {
	"articles" : {
		"title" : "You do not have any contacts currently.",
		"description" : "Contacts are your customers or prospects that you interact with using Agile.",
		//"learn_more" : "click here to learn more",
		"button_text" : "Add Contacts",
		"route" : "#",
		"modal_id" : "personModal",
		"image" : updateImageS3Path("/img/clipboard.png")
	}
};

var Helpcenter_Util = {

	setBreadcrumbPath: function(template_name, data){

		if(!template_name)
		{	
			$('#breadcrumb').html('');
			return;
		}

		$('#breadcrumb').html(getTemplate(template_name, data));
	},

	searchArticles: function(){

		if(!$('#hc_query').val())
			return;

		App_Helpcenter.searchArticle($('#hc_query').val());
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
function trigger_tinymce_save(){
return;
}
function get_tags(){
var values = [];
return values;
}
function get_notes(){
var values = [];
return values;
}
function get_related_deals(){
var values = [];
return values;
}

function track_with_save_success_model(){
	return;
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

		if((route_path == "contacts") && readCookie('company_filter')){
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
		
		
		
	}
}