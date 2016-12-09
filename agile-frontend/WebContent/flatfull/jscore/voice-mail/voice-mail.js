
$(function(){
	
	$('body').on('click', '.voice-mail-add', function(e){
		e.preventDefault();
		$("#draggable_noty div:first-child").css({"z-index":"1000"});
		$("#uploadVoiceMailModal").modal('show');
	});
	
	$('body').on('show.bs.modal', '#uploadVoiceMailModal', function(e) {
		// Removes alert message of error related date and time.
		$('#' + this.id).find('.alert').css('display', 'none');		
		// Removes error class of input fields
		$('#' + this.id).find('.error').removeClass('error');
	});
	
	$('body').on('click', '.addFileLink', function(e) {
		e.preventDefault();
		$(this).closest('form').find('#error').html("");
		var form_id = $(this).closest('form').attr("id");
		var id = $(this).find("a").attr("id");
		if(id && id == "S3")
			var newwindow = window.open("upload-voice-mail.jsp?id="+ form_id +"&t=" + CURRENT_USER_PREFS.template +"&d=" + CURRENT_DOMAIN_USER.domain, 'name','height=310,width=500');
		if (window.focus){
			newwindow.focus();
		}
		return false;
	});
	
	$('body').on('click', '#voicemail_validate', function(e){
 		e.preventDefault();
 		var modal_id = $(this).closest('.voice-mail-modal').attr("id");
    	var form_id = $(this).closest('.voice-mail-modal').find('form').attr("id");
    	
    	if(!isValidForm('#' + form_id))
    		return false;
    			
    	// serialize form.
    	var json = serializeForm(form_id);
    	if(form_id == "uploadVoiceMaiForm")
    		saveVoiceMail(form_id, modal_id, this, json);
	});
    
    $("#uploadVoiceMaiForm").submit(function(e){
    	e.preventDefault();
    });
    
    
    //audio javascript controls
    
	$('body').on('click', '.audioPlay', function(e){
	   e.preventDefault();
//	   alert("audioPlay");
	   audio = $(this).find("audio");
	   $(this).addClass("audioPause");
	   $(this).removeClass("audioPlay");
	   $(this).find("i").removeClass("icon-play");
//	   $(this).find("i").addClass("icon-pause");
	   $(this).find("i").addClass("icon-stop");
	   audio.trigger('play');
	   var that = this;
	   audio.bind('ended', function(){
		   $(that).addClass("audioPlay");
		   $(that).removeClass("audioPause");
		   $(that).find("i").removeClass("icon-stop");
		   $(that).find("i").addClass("icon-play");
		});
   });
   
   $('body').on('click', '.audioPause', function(e){
	   e.preventDefault();
//	   alert("audioPause");
	   audio = $(this).find("audio");
	   $(this).addClass("audioPlay");
	   $(this).removeClass("audioPause");
//	   $(this).find("i").removeClass("icon-pause");
	   $(this).find("i").removeClass("icon-stop");
	   $(this).find("i").addClass("icon-play");
	   audio.trigger('pause');
	   audio.prop("currentTime",0);
   });
	
});//end of function


function saveVoiceMailFileURL(url, network, id)
{
	id = id.split("?id=")[1];
	var form_id = id.split("&")[0];
	
	// Saving extension of document
	var extension = url.split("?");
	if(url.match("audiofiles/"))
	{
		extension = extension[0];
		extension = extension.substring(extension.lastIndexOf("/")+1);
	}
	else 
		extension = "";
	
	$('#' + form_id).find("#extension").val(extension);
	$('#' + form_id).find("#network_type").val(network);
	var newUrl = url.substring(0, url.indexOf("?"));//removing query string
   	$('#' + form_id).find('#upload_url').val(newUrl);
   	$(".addFileLink").empty();
   	if(extension != ""){
   		$(".addFileLink").css({"margin-top":"5px"});
   		$(".addFileLink").html(extension);
   	}
}

function saveVoiceMail(form_id, modal_id, saveBtn, json)
{
	// Returns, if the save button has disabled attribute
	if ($(saveBtn).attr('disabled'))
		return;

	disable_save_button($(saveBtn));
	
	if(form_id)
	{
		if (!isValidForm('#' + form_id)) {
			enable_save_button($(saveBtn));
			return false;
		}
		
		var url = $('#' + form_id).find('#upload_url').val();
		if(url == "")
		{
			$('#' + form_id).find('#error').html('<div class="alert alert-danger">{{agile_lng_translate "calls" "voicemail-uploaded"}}</div>');
			enable_save_button($(saveBtn));
			return;
		}
	}
	
	var newVoiceMail = new Backbone.Model();
	newVoiceMail.url = 'core/api/voicemails';
	newVoiceMail.save(json, {
		success : function(data) {
			var msgType = "success";
			msg = "Voice mail has been saved succesfully";
			showNotyPopUp(msgType , msg, "bottomRight");
		enable_save_button($(saveBtn));
		if(App_VoiceMailRouter.VoiceMailCollectionView){
			App_VoiceMailRouter.VoiceMailCollectionView.collection.add(data);
			App_VoiceMailRouter.VoiceMailCollectionView.render(true);
		}
		if(form_id)
		{
			$('#' + form_id).find("#network_type").val("");
			$('#' + form_id).find("#upload_url").val("");
			$('#' + form_id).find("#extension").val("");
			$('#' + form_id).find(".addFileLink").empty();
			$('#' + form_id).find('#error').empty();
			$('#' + form_id).find(".addFileLink").css({"margin-top":"0px"});
			$('#' + form_id).find(".addFileLink").html('<a href="#" id="S3"><i class="icon-plus-sign"></i> <span>{{agile_lng_translate "documents" "add-file"}}</span></a>');
			$('#' + form_id).each(function() {
				this.reset();
			});
			
			$('#' + modal_id).modal('hide');
		}
		$("#draggable_noty div:first-child").css({"z-index":"10000"});
		/*setTimeout(function(){
			makeDraggableVoicemail();
		}, 30000);*/
	}
	});
	
}

