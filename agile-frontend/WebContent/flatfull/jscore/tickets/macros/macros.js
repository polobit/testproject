function initializeTicketMacroListeners(el) {

	$(el).on(
			'click',
			'#save-ticket-macro',
			function(e, trigger_data) {

				e.preventDefault();

				if ($(this).attr('disabled'))
					return;

				// Check if the form is valid
				if (!isValidForm('#ticket-macro-form')) {
					$('#ticket-macro-form').find("span.help-inline").not(
							':hidden').prev('input').focus();
					return;
				}

				var name = $('#macro-name').val();

				// Check for valid name
				if (isNotValid(name)) {
					alert("Name not valid");
					return;
				}

				if (!window.frames.designer.checkWorkflowSize())
					return;

				// Gets Designer JSON
				var designerTaskJSON = window.frames.designer
						.serializePhoneSystem();

				// Update Macro
				$('#macro-actions').val(designerTaskJSON);

				App_Ticket_Macros.macroModelview.save(e);

			});

}