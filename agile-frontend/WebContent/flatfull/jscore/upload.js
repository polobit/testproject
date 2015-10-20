$(function(){ 

	$("body").on('click', ".upload_s3", function(e){
		e.preventDefault();
		uploadImage("upload-container");
	});

	//Upload contact image
	$("body").on('click', ".upload_pic", function(e){
		e.preventDefault();
		uploadImage("contact-container");
	});
	
	//Upload personal prefs
	$("body").on('click', ".upload_prefs_s3", function(e){
		e.preventDefault();
		uploadImage("upload-in-modal");
	});
	
});	

function uploadImage(id)
{
	var newwindow = window.open("upload-flatfull.jsp?id=" + id,'name','height=310,width=500');
	if (window.focus)
	{
		newwindow.focus();
	}
	return false;
}

function setImageURLInModal(url)
{
	var id = "upload-in-modal";
	// Set the media stream
	$('#' + id).find('.imgholder').html('');
	$('#' + id).find('.imgholder').html('<img class="m-b-none avatar-thumb" src="' + url + '" style="height:58px;width:58px;"/>');
	
	var  modalId = $('#' + id).closest(".modal").attr("id");
	
	// Set the value of selector for input
	$("#" + modalId).find(".modal-body input[type='hidden']").val(url);
	
	$("#" + modalId).closest('.modal').modal('hide');
	$("#" + modalId).trigger('choose-image');
	
}

function setImageURL(url)
{
	var id = "upload-container";
	// Set the media stream
	$('#' + id).find('.imgholder').html('');
	$('#' + id).find('.imgholder').html('<img class="w-full" src="' + url + '"/>');
	
	// Set the value of selector for input
	$('#' + id).find('#upload_url').val(url);
}

//Saving contact image
function setContactImageURL(url)
{
	var id = "contact-container";
	// Set the media stream
	$('#' + id).find('.imgholder').html('');
	$('#' + id).find('.imgholder').html('<img src="' + url + '" height="50" width="50"/>');
	
	// Set the value of selector for input
	$('#' + id).find('#upload_url').val(url);
	agile_crm_update_contact("image", url);
}
