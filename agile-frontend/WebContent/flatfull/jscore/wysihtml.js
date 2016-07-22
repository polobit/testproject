/**
 * wysihtml.js is used to embed beautiful html editors to email body. Inserts
 * merge fields into email body. wysihtml makes use of wysihtml5 which is a
 * javascript plugin that makes it easy to create simple, beautiful wysiwyg
 * editors with the help of wysihtml5 and Twitter Bootstrap.
 */
function initializeEmailTemplateAddListeners(){

	// Code for Merge fields in Email Template
	$('#prefs-tabs-content').on('click', '.merge-field', function (e) {
				e.preventDefault();
				// console.log("Merge field");

				// Get Selected Value
				var fieldContent = $(this).attr("name");

				// Get Current HTML
				var val = $('#email-template-html').val();

				// Set New HTML
				var wysihtml5 = $('#email-template-html').data('wysihtml5');
				if (wysihtml5) {
					// console.log("Setting content ");
					// console.log(fieldContent);

					// wysihtml5.editor.setValue(fieldcontent + " " + val,
					// true);
				    editor.focus();
					wysihtml5.editor.composer.commands.exec("insertHTML", '{{'
							+ fieldContent + '}}');
				}
			});

	$('#prefs-tabs-content').on('click', '.add-attachment-select', function(e){
		e.preventDefault();
		var el = $(this).closest("div");
		$(this).css("display", "none");
		el.find(".attachment-document-select").css("display", "inline");
		var optionsTemplate = "<option value='{{id}}' network_type='{{titleFromEnums network_type}}' size='{{size}}'>{{name}}</option>";
        fillSelect('attachment-select','core/api/documents', 'documents',  function fillNew()
		{
			el.find("#attachment-select option:first").after("<option value='new'>"+_agile_get_translated_val('others','upload-new-doc')+"</option>");

		}, optionsTemplate, false, el);
        $('#enable_tracking').css("margin-top", "-7px");
	});
	
	/**
	 * For adding existing document to current contact
	 */
	$('#prefs-tabs-content').on('click', '.add-attachment-confirm', function(e){
		e.preventDefault();		
		var network_type = $('#attachment-select').find(":selected").attr('network_type');
		var document_size = $('#attachment-select').find(":selected").attr('size');
		if(typeof network_type !=='undefined' && network_type.toUpperCase() === 'GOOGLE')
		{
			$(this).closest("span").find(".attachment-status").html("<span style='color:#df382c;margin-top:10px; display:block'>Can not attach Google Drive doc to email. You can add a link instead in the email.</span>");
			$(this).css({'border': '1px solid #df382c','outline': 'none'   });				             	            
		}
		else if(document_size >= 5242880){
			$(this).closest("span").find(".attachment-status").html("<span style='color:#df382c;margin-top:10px; display:block'>Document size exceeds the 5MB limit.</span>");
			$(this).css({'border': '1px solid #df382c','outline': 'none'   });
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
		    	$('#emailForm').find('#attachment_id').find("#attachment_fname").text(docName);
		    	$('#emailForm').find(".attachment-document-select").css('display','none');
		    	$('#emailForm').find('#eattachment_key').attr('name',"document_key");
		    	$('#emailForm').find('#eattachment_key').attr('value',document_id);
		    }
	    }
		$('#enable_tracking').css("margin-top", "-47px");
	});
	
	/**
	 * To cancel the add attachment request in send-email form
	 */
	$('#prefs-tabs-content').on('click', '.add-attachment-cancel', function(e){
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
    	$('#enable_tracking').css("margin-top", "-7px");
	});

	$('#prefs-tabs-content').on("click", ".add-tpl-attachment-confirm", function(e){
		e.preventDefault();
		if($(this).parent().find('select').val()=="new"){
			$('#uploadDocumentModal').modal('show');
			$('#GOOGLE',$('#uploadDocumentModal')).parent().hide();
		}else if($(this).parent().find('select').val()!=""){
			$('#tpl-attachment-select').hide();
			$('#tpl-attachment-name').show();
			$('#attachment_id',$('#tpl-attachment-name')).val($(this).parent().find('select').val());
			//$('#tpl_attachment_fname',$('#tpl-attachment-name')).text($(this).parent().find('option:selected').text());
			$('#tpl_attachment_fname',$('#tpl-attachment-name')).html('<a href='+$(this).parent().find('option:selected').attr('url')+'>'+$(this).parent().find('option:selected').text()+'</a>');
		}else if($(this).parent().find('select').val()==""){
			$('#attachment-select-required').show();
		}
	});

	$('#prefs-tabs-content').on("click", ".add-tpl-attachment-cancel", function(e){
		e.preventDefault();
		$('#tpl-attachment-select').show();
		$('#tpl-attachment-name').hide();
		$('.add-attachment-select').show();
		$('.attachment-document-select').hide();
		$('#attachment_id',$('#tpl-attachment-name')).val("");
	});

	$('#prefs-tabs-content').on("change", "#attachment-select", function(e){
		e.preventDefault();
		if($(this).val()==""){
			$('#attachment-select-required').show();
		}else{
			$('#attachment-select-required').hide();
		}
	});

	$('#uploadDocumentModal').on('hidden.bs.modal', function(e){
		$('#GOOGLE',$('#uploadDocumentModal')).parent().show();
	});
}

/**
 * Sets HTML Editor for UserPrefs, EmailTemplates etc.
 **/
function setupHTMLEditor(selector, data) {
	head.js(LIB_PATH + 'lib/wysihtml5-0.3.0-min.js', LIB_PATH + 'lib/bootstrap-wysihtml5-min.js',
			function() {
				console.log('setting up text');
				console.log(selector.html());
				
				if(!$(selector).data('wysihtml5'))
					selector.wysihtml5();
				
				if(data)
					selector.data("wysihtml5").editor.setValue(data, false);
				
			});
}