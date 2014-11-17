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
		var master_record = App_Contacts.contactDetailView.model.toJSON();
		var contact_id = master_record.id;
	    fillSelect('#attachment-select','core/api/documents/'+contact_id+'/docs', 'documents', function fillNew()
		{

		}, optionsTemplate, false, el); 
	});
	
	/**
	 * To cancel the add attachment request in send-email form
	 */
	$(".add-attachment-cancel").die().live('click', function(e){
		e.preventDefault();
		$('#attachment-select').closest("span").find('.attachment-status').find("span").fadeOut(0);
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
		if(network_type!=='Select'){
			if(network_type.toUpperCase() === 'GOOGLE'){
				$(this).closest("span").find(".attachment-status").html("<span style='color:red;margin-left:10px;'>Select other type</span>");
			}
			else{
				$(this).closest("span").find('.attachment-status').find("span").fadeOut(0);
			}
		}		
	});
    });
	