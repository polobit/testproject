$(function(){ 

	$(".upload_s3").live('click', function(e){
		e.preventDefault();
		uploadImage("upload-container");
	});
	
});	

function uploadImage(id)
{
	var newwindow = window.open("upload.jsp?id=" + id,'name','height=310,width=500');
	if (window.focus)
	{
		newwindow.focus();
	}
	return false;
}

function setImageURL(url)
{
	var id = "upload-container";
	
	// Set the media stream
	$('#' + id).find('.imgholder').html('');
	$('#' + id).find('.imgholder').html('<img src="' + url + '" height="100" width="100"/>');
	
	// Set the value of selector for input
	$('#' + id).find('#upload_url').val(url);
}
