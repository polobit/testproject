/**
 * author:Ramesh
 */
	/**
	 * For showing existing documents and Add new doc option
	 * to attach in send-email form 
	 */
	function sendEmailAttachmentListeners(listener_container_id){
     	
	if(!listener_container_id)
		  listener_container_id = "send-email-listener-container";

	$('#' + listener_container_id).on('click', '.add-attachment-select', function(e){
		e.preventDefault();
		var el = $(this).closest("div");
		$(this).css("display", "none");
		el.find(".attachment-document-select").css("display", "inline");
		var optionsTemplate = "<option value='{{id}}' network_type='{{titleFromEnums network_type}}' size='{{size}}' url='{{url}}'>{{name}}</option>";
        fillSelect('attachment-select','core/api/documents', 'documents',  function fillNew()
		{
			el.find("#attachment-select option:first").after("<option value='new'>Upload new doc</option>");

		}, optionsTemplate, false, el); 
	});
	
	/**
	 * For adding existing document to current contact
	 */
	$('#' + listener_container_id).on('click', '.add-attachment-confirm', function(e){
		e.preventDefault();		
		var network_type = $('#attachment-select').find(":selected").attr('network_type');
		var document_size = $('#attachment-select').find(":selected").attr('size');
		if(typeof network_type !=='undefined' && network_type.toUpperCase() === 'GOOGLE')
		{
			$(this).closest("span").find(".attachment-status").html("<span style='color:#df382c;margin-top:10px; display:block'>Can not attach Google Drive doc to email. You can add a link instead in the email.</span>");
			//$(this).css({'border': '1px solid #df382c','outline': 'none'   });				             	            
		}
		else if(document_size >= 5242880){
			$(this).closest("span").find(".attachment-status").html("<span style='color:#df382c;margin-top:10px; display:block'>Document size exceeds the 5MB limit.</span>");
			//$(this).css({'border': '1px solid #df382c','outline': 'none'   });
		}
		else
		{
			$('#attachment-select').closest("span").find('.attachment-status').find("span").fadeOut(0);
			$('#attachment-select').css({"border":"1px solid #bbb"});
		    var document_id = $(this).closest(".attachment-document-select").find("#attachment-select").val();
		    var saveBtn = $(this);
			
	  		// To check whether the document is selected or not
		    if(document_id == "")
		    {
		    	saveBtn.closest("span").find(".save-status").html("<span style='color:red;margin-left:10px;'>This field is required.</span>");
		    	saveBtn.closest("span").find('span.save-status').find("span").fadeOut(5000);
		    	return;
		    }	    	
		    else if(document_id == "new")
		    {	
		    	e.preventDefault();
				$(this).closest('form').find('#error').html("");
				var form_id = $(this).closest('form').attr("id");
				var id = $(this).find("a").attr("id");
				
				var newwindow = window.open("upload-attachment.jsp?id="+ form_id +"&t=" + CURRENT_USER_PREFS.template +"&d=" + CURRENT_DOMAIN_USER.domain, 'name','height=310,width=500');
				
				if (window.focus)
				{
					newwindow.focus();
				}
		    }
		    else if(document_id != undefined && document_id != null)
		    {
		    	var docName = $( "#attachment-select option:selected").text();
		    	$('#emailForm').find('#eattachment').css('display','block');
		    	$('#emailForm').find('#attachment_id').find("#attachment_fname").html('<a href='+$( "#attachment-select option:selected").attr('url')+'>'+docName+'</a>');
		    	$('#emailForm').find(".attachment-document-select").css('display','none');
		    	$('#emailForm').find('#eattachment_key').attr('name',"document_key");
		    	$('#emailForm').find('#eattachment_key').attr('value',document_id);
		    }
	    }
	});
	
	/**
	 * To cancel the add attachment request in send-email form
	 */
	$('#' + listener_container_id).on('click', '.add-attachment-cancel', function(e){
		e.preventDefault();
		var blobKey = $('#emailForm').find('#attachment_id').attr('name');
		if(typeof blobKey !== typeof undefined)
	    {
			if(blobKey.toLowerCase() === 'blob_key')
			{
				var blobKeyValue = $('#emailForm').find('#eattachment_key').attr("value");
				deleteBlob(blobKeyValue);
			}
	    }
		$('#attachment-select').closest("span").find('.attachment-status').find("span").fadeOut(0);
		$('#attachment-select').css({"border":"1px solid #bbb"});	 
		$('#attachment-select').find('option:first').attr('selected', 'selected');
		var el = $(this).closest("div");
		$('#emailForm').find('.attachment-document-select').css('display','none');
		$('#emailForm').find('#eattachment').css('display','none');
		$('#emailForm').find(".add-attachment-select").css("display", "inline");
		$('#emailForm').find('#eattachment_key').attr("name","name");
    	$('#emailForm').find('#eattachment_key').attr("value","value");
	});
	
	}
    
    function deleteBlob(blob_key)
    {
    	$.ajax({url : '/core/api/emails/send-email/delete-blob/'+blob_key,
    		type : 'GET',
    		async : false,
    		success : function()
    		{
    		},
    		error : function(response)
    		{
    		} 
    	});
    }

	