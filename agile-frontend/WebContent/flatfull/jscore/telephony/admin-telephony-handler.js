/*
telephony action collection view
*/
var Telephony_Status_Collection_View = Base_Collection_View.extend({
    events: {
    	/** call status actions */
    	'click .show_telephony_status_field' : 'showStatusFields',
        'click #add_telephony_status' : 'saveStatusTelephony',
        'click .telephony-status-delete' : 'deleteStatusTelephony',
        'click #telephony-status-delete-confirm' : 'confirmDelete',
    },
    
    showStatusFields : function(e){
    	
		e.preventDefault();
		$(".show_field").show();
		$(e.currentTarget).hide();
		
    },
    
    saveStatusTelephony : function(e){
    	
		e.preventDefault();
		saveTelephonyStatus(e.currentTarget);

    },

    deleteStatusTelephony : function(e){
    	
		e.preventDefault();
		$('#telephony-status-delete-modal').modal('show');
		var id = $(e.currentTarget).attr("id");
		var label = $(e.currentTarget).attr("data");
		$("#delete-telephony-confirm-dialog input[name=id]").val(id);
		$("#delete-telephony-confirm-dialog #telephony-status-name").html(label);

    },

    confirmDelete : function(e){
    	
		e.preventDefault();
		var data = {};
		data.id = $("#delete-telephony-confirm-dialog input[name=id]").val();
		deleteTelephonyStatus(data);
    }


});