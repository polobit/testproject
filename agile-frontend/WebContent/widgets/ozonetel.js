/*
 * This method is called after the sucessful loading of the widget
 * If the pubnub is not connected then it will reenter in timeout function
 * @author - Rajesh
 */
 function startOzonetelWidget(){
 	getLogsForOzonetel();
 	$("#Ozonetel-container").css({"display":"none"});
 }
$(function(){
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
});