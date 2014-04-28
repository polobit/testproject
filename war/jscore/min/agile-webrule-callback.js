var agile_webrule_popup_actions = {

	show_form : function(template_id) {
		// var top = '<div id="popup-header">Great. Just one more thing.
		// </div><div id="popup-content"><div id="popup-subhead">Lets us know a
		// bit about your business. </div><div id="popup-squares"><div
		// class="popup-squares-separator"></div>'
		/*
		 * return top + '<form id="popup-form">' + '<p><label>Size of your
		 * company <select id="company_size">' + '<option value="1-10">1-10</option>' + '<option
		 * value="11-50">11-50</option>' + '<option value="51-500">51-500</option>' + '<option
		 * value="501-5000">501-5000</option>' + '<option value=">5k">> 5k"</option>' + '</select></label></p><br>' + '<input
		 * type="input" id="phone_number" name="phone_number" class="required
		 * popup-text" placeholder="Your phone number"> <input type="submit"
		 * value="Submit"
		 * onClick="agile_webrule_popup_actions.save_form(\'popup-content\',
		 * event);"></form></div></div></div></div>';
		 */

		$("#popup-body").html(
				window.parent.getTemplate("webrule-welcome-dashboard", {}));

		console.log($("#popup-form"));
		console.log($("#popup-body"));

		$("#popup-form")
				.validate(
						{
							submitHandler : function(form) {
								agile_webrule_popup_actions.save_form();
							},
							errorPlacement : function(error, element) {
								console.log(error);
								console.log($(element).closest("p"))
								$("span.error", $(element).closest("p"))
										.remove();

								$(element.closest('p'))
										.append(
												"<span class='error' style='margin-right:-18%; margin-left:10px;color:#df382c'>"
														+ error[0].outerText
														+ "</span>");
							}
						});

	},
	save_form : function(form_id, event) {

		if (event)
			event.preventDefault();

		var phone_number = $("#phone_number").val();
		var company_size = $("#company_size").val();
		window.setTimeout(this.close_modal, 2000);
		window.parent.add_properties_from_popup(phone_number, company_size);
		
		// if()
		$("#popup-header").html("Thanks a lot.");
		$("#popup-content").html("Our representative will get back to you shortly to help you get going with Agile.");

		
	},
	close_modal : function() {
		window.parent._agile_close_modal();
	},
	add_tag : function(tag) {
		window.parent._agile.add_tag(tag, function(data) {
			_agile_contact = data;
		});
	},
	remove_tag : function(tag) {

		window.parent._agile.add_tag(tag, function(data) {
			_agile_contact = data;
		});
	}
};