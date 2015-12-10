/**
 * Zoomifier code to show their template in send email template
 */
 function loadZoomifierDocSelector() {
	 var loggedInUser = CURRENT_DOMAIN_USER.email;
	 var selectedContact = getPropertyValue(App_Contacts.contactDetailView.model.attributes.properties, "email");
	 var picker = new Zoomifier.PickerBuilder().
				setPartnerKey('dwqs4rxjksqpldwqklnpes8hs=').
				setCallback(zoomifierDocSelectionCallback).
				setSalesUser(loggedInUser).
				setTargetCustomer(selectedContact).
				build();
  }
 
 /**
  * Appends the data or template fetched from zoomifier
  * @param data
  */
  function zoomifierDocSelectionCallback(data) {
		data = "</br>" + data + "</br>";
		//Fill html editor with template body
		var wysihtml5 = $('#body').data('wysihtml5');
		
		if(wysihtml5){
			editor.focus();
			wysihtml5.editor.composer.commands.exec("insertHTML",data);
		}
  }