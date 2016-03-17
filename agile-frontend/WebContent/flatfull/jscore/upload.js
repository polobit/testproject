$(function(){ 

	$("body").on('click', ".upload_s3", function(e){
		e.preventDefault();
		uploadImage("upload-container");
	});

	//Upload contact image
	$("body").on('click', ".edit-pic", function(e){
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
	var newwindow = window.open("flatfull/upload-flatfull.jsp?id=" + id,'name','height=310,width=500');
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
	$('#' + id).find('.contact-image-view').html('');
	$('#' + id).find('.contact-image-view').html('<img src="' + url + '" class="upload_pic imgholder submit w-full img-circle" style="width:75px;height:75px;" type="submit" />');
	if($(".dropdown-menu .contact-delete-option").length == 0) {
 	$('#' + id).find('.dropdown-menu').append('<li class="divider"></li><li class="contact-delete-option"><a onClick="deleteConfirmation();"><i class="fa fa-trash"></i> Delete Picture</a></li>');	
	}
	// Set the value of selector for input
	$('#' + id).find('#upload_url').val(url);
	agile_crm_update_contact("image", url);
}
function deleteContactImage(){

	var contactId = $('#contact_delete_image').text();
	var url = "/core/api/contacts/deleteContactImage?id="+contactId
	$.ajax({ type : 'PUT', url : url, success : function(){
                
        // Default image
		var img = DEFAULT_GRAVATAR_url;
		var backup_image = "&d=404\" ";
		// backup_image="";
		var initials = '';

		try
		{
			var name = $('#contactName .contactFirstname').text();
			if(name.length >=2)
				initials = name.substring(0,2);
			else
				initials = name ; 
		}
		catch (e)
		{
			console.log(e);
		}

		if (initials.length == 0)
			backup_image = "&d=" + DEFAULT_GRAVATAR_url + "\" ";

		var data_name =  '';
		// if(!isIE())
			data_name = "onLoad=\"image_load(this)\" onError=\"image_error(this)\"_data-name=\"" + initials;
		
		
		var url = 'https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=40' + backup_image + data_name

		var id = "contact-container";
		// Set the media stream
		$('#' + id).find('.contact-image-view').html('');
		$('#' + id).find('.contact-image-view').html('<img src="' + url + '" class="upload_pic imgholder submit w-full img-circle" style="width:75px;height:75px;"/>');
		if($(".dropdown-menu .contact-delete-option").length > 0) {
 		$('#' + id).find('.dropdown-menu').find(".divider").remove();
 		$('#' + id).find('.dropdown-menu').find(".contact-delete-option").remove();
		}

	},error: function() {
     	console.log('An error occurred');
	}
});
}
function deleteConfirmation() {
    var x;
    if (confirm("Are you sure to Delete?") == true) {
        deleteContactImage();
    } 
}