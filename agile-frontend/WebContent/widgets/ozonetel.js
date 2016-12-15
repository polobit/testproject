/*
 * This method is called after the sucessful loading of the widget
 * If the pubnub is not connected then it will reenter in timeout function
 * @author - Rajesh
 */

function startOzonetelWidget(contact_id){
	getLogsForOzonetel();

	 OZONETEL_PLUGIN_NAME = "Ozonetel";
	 OZONETEL_UPDATE_LOAD_IMAGE = '<center><img id="knowlarity_load" src=' + '\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

	 var ozonetel_widget = agile_crm_get_widget(OZONETEL_PLUGIN_NAME);
	 var contactDetailsObj = agile_crm_get_contact();

	 KNOWLARITY_Plugin_Id = ozonetel_widget.id; 
	 Email = agile_crm_get_contact_property('email')

	$('body').off('click', '.Ozonetel_call');
	$('body').on('click', '.Ozonetel_call', function(e){
		e.preventDefault();
		e.stopPropagation();
		if($(this).closest(".contact-make-call").hasClass('popover-call')){
			var from;
			var contactPopoverObj = App_Contacts.contact_popover.toJSON();
			callToNumber($(this).closest(".contact-make-call").attr("phone"), from, "Ozonetel",contactPopoverObj, "");
			return;
		}else{
			var contactDetailsObj = agile_crm_get_contact();
			dialFromOzonetel($(this).closest(".contact-make-call").attr("phone"), getContactName(contactDetailsObj),contactDetailsObj);
		}
	});
	$('body').off('click', '.noty_ozonetel_cancel');
	$('body').on('click', '.noty_ozonetel_cancel', function(e){		
		closeCallNoty(true);
	});
}