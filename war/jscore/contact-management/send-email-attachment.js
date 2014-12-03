/**
 * 
 */
	/**
	 * For showing existing documents for attaching as attachments in the send-email form 
	 */
    $(function(){
	$(".add-attachment-select").die().live('click', function(e){
		e.preventDefault();
		 //activity-text-blocksendEmail
		var el = $(this).closest("div");
		$(this).css("display", "none");
		el.find(".attachment-document-select").css("display", "inline");
		var optionsTemplate = "<option value='{{id}}' network_type='{{titleFromEnums network_type}}'>{{name}}</option>";
	    fillSelect('#attachment-select','core/api/documents/', 'documents', function fillNew()
		{
	    	
		}, optionsTemplate, false, el); 
	});
	
	/**
	 * To cancel the add attachment request in send-email form
	 */
	$(".add-attachment-cancel").die().live('click', function(e){
		e.preventDefault();
		$('#attachment-select').closest("span").find('.attachment-status').find("span").fadeOut(0);
		$('#attachment-select').css({"border":"1px solid #bbb"});	 
		$('#attachment-select').find('option:first').attr('selected', 'selected');
		var el = $(this).closest("div");
		el.find(".attachment-document-select").css("display", "none");
		el.find(".add-attachment-select").css("display", "inline");
	});
	
	/**
	 * 
	 */
	$('#attachment-select').live('change',function(e){
		e.preventDefault();
		var network_type = $(this).find(":selected").attr('network_type');
		if(network_type){
			if(network_type.toUpperCase() === 'GOOGLE'){
				$(this).closest("span").find(".attachment-status").html("<span style='color:#df382c;margin-top:10px; display:block'>Can not attach Google Drive doc to email. You can add a link instead in the email.</span>");
				$(this).css({'border': '1px solid #df382c',
					         'outline': 'none'
					         });		            
			}
			else{
				$(this).closest("span").find('.attachment-status').find("span").fadeOut(0);
				$(this).css({"border":"1px solid #bbb"});	 
			}
		}
		else{
			$(this).closest("span").find('.attachment-status').find("span").fadeOut(0);
			$(this).css({"border":"1px solid #bbb"});	 
		}
	});
    });
	