function load_imap_folders(el, model) {
	var id = model.id;
	var optionsTemplate = "<option {{selected}}>{{name}}</option>";
	fillSelect('imap-folders-multi-select', '/core/api/imap/' + id
			+ '/imap-folders', 'folders', function fillNew() {
		$("#imap-folders-multi-select .default-select", el).remove();

	}, optionsTemplate, false, el);
	var el2 = $(".imap-folders-settings-click", el).closest("div");
	$(".imap-folders-settings-click", el).css("display", "none");
	el2.find(".imap-folders-settings-txt").css("display", "none");
	el2.find(".imap-folders-select").css("display", "inline");
}

function load_gmail_widgets(limit) {
	// Gets Social Prefs (Same as Linkedin/Twitter) for Gmail
	gmailListView1 = new Base_Collection_View({
		url : 'core/api/social-prefs/GMAIL/list',
		templateKey : "settings-social-prefs",
		individual_tag_name : 'div',
		postRenderCallback : function(el) {
			var gmail_count = gmailListView1.collection.length;
			if ((gmail_count < limit && !HAS_EMAIL_ACCOUNT_LIMIT_REACHED)
					|| gmail_count === 0) {
				var data1 = {
					"service" : "Gmail",
					"return_url" : encodeURIComponent(window.location.href)
				};

				getTemplate("settings-social-prefs-model", data1, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#prefs-tabs-content').find("#social-prefs").append($(template_ui));
				}, null);
			}
			updateTimeOut();
		}
	});
	gmailListView1.collection.fetch();
	App_Settings.gmailListView = gmailListView1;
	$('#prefs-tabs-content').find("#social-prefs").html(App_Settings.gmailListView.el);
			
}
function load_imap_widgets(limit) {
	// Gets imap prefs
	imapListView1 = new Base_Collection_View({
		url : 'core/api/imap/',
		templateKey : "settings-imap-access",
		individual_tag_name : 'div',
		postRenderCallback : function(el) {
			var imap_count = imapListView1.collection.length;
			if ((imap_count < limit && !HAS_EMAIL_ACCOUNT_LIMIT_REACHED)
					|| imap_count === 0) {
				var data1 = {};

				getTemplate("settings-imap-access-model", data1, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#prefs-tabs-content').find("#imap-prefs").append($(template_ui));
				}, null);
			}
			updateTimeOut();
		}
	});
	imapListView1.collection.fetch();
	App_Settings.imapListView = imapListView1;
	$('#prefs-tabs-content').find("#imap-prefs").html(App_Settings.imapListView.el);
}

function load_office365_widgets(limit) {
	// Gets office prefs list
	officeListView1 = new Base_Collection_View({
		url : 'core/api/office/',
		templateKey : "settings-office-access",
		individual_tag_name : 'div',
		postRenderCallback : function(el) {
			var office_count = officeListView1.collection.length;
			if ((office_count < limit && !HAS_EMAIL_ACCOUNT_LIMIT_REACHED)
					|| office_count === 0) {
				var data1 = {};

				getTemplate("settings-office-access-model", data1, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#prefs-tabs-content').find("#office-prefs").append($(template_ui));
				}, null);
			}
			updateTimeOut();
		}
	});
	officeListView1.collection.fetch();
	App_Settings.officeListView = officeListView1;
	$('#prefs-tabs-content').find("#office-prefs").html(App_Settings.officeListView.el);
}

function updateTimeOut(widget_height) {
	setTimeout(function() {
		$('#all-email-settings-prefs .col-md-4 .panel').each(function() {	
			if($(this).height() > EMAIL_PREFS_WIDGET_SIZE)
				EMAIL_PREFS_WIDGET_SIZE = $(this).height();
		});
		$('#all-email-settings-prefs .col-md-4 .panel').each(function() {
			$(this).height(EMAIL_PREFS_WIDGET_SIZE);
		});
	},1000);
}

function load_imap_properties(model, el) {
	var id = model.id;
	var optionsTemplate1 = "<option value='{{id}}' {{selected}}>{{name}}</option>";
	var el1 = $('.imap-share-settings-select', el).closest("div");
	fillSelect('imap-share-user-select', 'core/api/imap/shared-to-users?id='
			+ id, 'users', function fillNew() {
		$("#imap-share-user-select .default-select", el).remove();
		$(".imap-share-select .loading", el).hide();
	}, optionsTemplate1, false, el1);

	var el2 = $('.imap-folders-settings-click', el).closest("div");
	var optionsTemplate2 = "<option {{selected}}>{{name}}</option>";
	fillSelect('imap-folders-multi-select', 'core/api/imap/' + id
			+ '/imap-folders', 'folders', function fillNew() {
		$("#imap-folders-multi-select .default-select", el).remove();

	}, optionsTemplate2, false, el2);
}


function initializeSettingsListeners(){

	$('#prefs-tabs-content').on('click', '.gmail-share-settings-select', function(e)
	{
						e.preventDefault();
						var id = $(this).attr("oid");
						var el = $(this).closest("div");
						$(this).css("display", "none");
						el.find(".gmail-share-select").css("display", "inline");
						el.find(".gmail-share-settings-txt").css("display",
								"none");
						var optionsTemplate = "<option value='{{id}}' {{selected}}>{{name}}</option>";
						fillSelect(
								'gmail-share-user-select',
								'core/api/social-prefs/shared-to-users?id='
										+ id,
								'users',
								function fillNew() {
									$(
											"#gmail-share-user-select .default-select",
											el).remove();
								}, optionsTemplate, false, el);
					});
	/**
	 * To cancel the imap share settings event
	 */
	$('#prefs-tabs-content').on('click', '.gmail-share-settings-cancel', function(e){
		e.preventDefault();
		var el = $(this).closest("div");
		var name = $(this).attr('name');
		el.find(".gmail-share-select").css("display", "none");
		el.find(".gmail-share-settings-select").css("display", "inline");
		el.find(".gmail-share-settings-txt").css("display", "inline");
	});

	/**
	 * Share imap settings with othe users
	 */
	$('#prefs-tabs-content').on('click', '.imap-share-settings-select', function(e){
						e.preventDefault();
						var id = $(this).attr("oid");
						var el = $(this).closest("div");
						$(this).css("display", "none");
						el.find(".imap-share-settings-txt").css("display",
								"none");
						el.find(".imap-share-select").css("display", "inline");
						var optionsTemplate = "<option value='{{id}}' {{selected}}>{{name}}</option>";
						fillSelect(
								'imap-share-user-select',
								'core/api/imap/shared-to-users?id=' + id,
								'users',
								function fillNew() {
									$(
											"#imap-share-user-select .default-select",
											el).remove();
								}, optionsTemplate, false, el);
					});

	/**
	 * To cancel the imap share settings event
	 */
	$('#prefs-tabs-content').on('click', '.imap-share-settings-cancel', function(e){
		e.preventDefault();
		var el = $(this).closest("div");
		var name = $(this).attr('name');
		el.find("#imap-share-user-select").empty();
		el.find(".imap-share-select").css("display", "none");
		el.find(".imap-share-settings-select").css("display", "inline");
		el.find(".imap-share-settings-txt").css("display", "inline");
	});

	/**
	 * Select imap server folder, will fetch mails from these folders
	 */
	$('#prefs-tabs-content').on('click', '.imap-folders-settings-click', function(e){
				e.preventDefault();
				var el = $(this).closest("div");
				var id = $(this).attr("oid");
				$(this).css("display", "none");
				el.find(".imap-folders-select").css("display", "inline");
				var optionsTemplate = "<option {{selected}}>{{name}}</option>";
				fillSelect('imap-folders-multi-select', 'core/api/imap/' + id
						+ '/imap-folders', 'folders', function fillNew() {
					$("#imap-folders-multi-select .default-select", el)
							.remove();
				}, optionsTemplate, false, el);
			});

	/**
	 * To cancel the imap folder settings
	 */
	$('#prefs-tabs-content').on('click', '.imap-folders-settings-cancel', function(e){
		e.preventDefault();
		var el = $(this).closest("div");
		el.find('#imap-folders-multi-select').empty();
		el.find(".imap-folders-select").css("display", "none");
		el.find(".imap-folders-settings-click").css("display", "inline");
	});

	/**
	 * Share office settings with other users
	 */
	$('#prefs-tabs-content').on('click', '.office-share-settings-select', function(e){
						e.preventDefault();
						var el = $(this).closest("div");
						$(this).css("display", "none");
						var id = $(this).attr("oid");
						el.find(".office-share-settings-txt").css("display",
								"none");
						el.find(".office-share-select")
								.css("display", "inline");
						var optionsTemplate = "<option value='{{id}}' {{selected}}>{{name}}</option>";
						fillSelect(
								'office-share-user-select',
								'core/api/office/shared-to-users?id=' + id,
								'users',
								function fillNew() {
									$(
											"#office-share-user-select .default-select",
											el).remove();
								}, optionsTemplate, false, el);
					});

	/**
	 * To cancel the imap share settings event
	 */
	$('#prefs-tabs-content').on('click', '.office-share-settings-cancel', function(e){
		e.preventDefault();
		var el = $(this).closest("div");
		var name = $(this).attr('name');
		el.find(".office-share-select").css("display", "none");
		el.find(".office-share-settings-select").css("display", "inline");
		el.find(".office-share-settings-txt").css("display", "inline");
	});

	$('#prefs-tabs-content').on('click', '#gmail-prefs-delete', function(e){

		e.preventDefault();

		var saveBtn = $(this);

		var id = $(saveBtn).attr("oid");

		// Returns, if the save button has disabled attribute
		if ($(saveBtn).attr('disabled'))
			return;

		if (!confirm("Are you sure you want to delete this?"))
			return false;

		// Disables save button to prevent multiple click event issues
		disable_save_button($(saveBtn));

		$.ajax({
			url : '/core/api/social-prefs/delete' + "/" + id,
			type : 'DELETE',
			success : function() {
				enable_save_button($(saveBtn));
				App_Settings.email();
				return;
			}
		});
	});
	
	$('#prefs-tabs-content').on('click', '#office-prefs-delete, #imap-prefs-delete', function(e){

		e.preventDefault();
		
		var saveBtn = $(this);
		
		var id = $(saveBtn).attr("oid");

		// Returns, if the save button has disabled attribute
		if ($(saveBtn).attr('disabled'))
			return;
		
		if(!confirm("Are you sure you want to delete?"))
    		return false;
		
		// Disables save button to prevent multiple click event issues
		disable_save_button($(saveBtn));

		var button_id = $(saveBtn).attr("name");

		$.ajax({
			url : '/core/api/' + button_id + "/delete/" + id,
			type : 'DELETE',
			success : function()
			{
				enable_save_button($(saveBtn));
				App_Settings.email();
				return;
			}
		});
	});

	$("#prefs-tabs-content .widgets_inner ul li").off("click");
	$("#prefs-tabs-content").on("click",".widgets_inner ul li",function(){
		var temp = $(this).find("a").attr("href").split("#");
		if(islocalStorageHasSpace())
			localStorage.setItem('widget_tab', temp[1]);
		Backbone.history.navigate('add-widget', { trigger : true });
	});

}

function initializeAdminSettingsListeners(){

	 $('#upload-container .upload_s3').off('click');
	 $('#upload-container').on('click', '.upload_s3', function (e) {
		e.preventDefault();
		uploadImage("upload-container");
	});

	ACCOUNT_DELETE_REASON_JSON = undefined;
	/**
	 * If user clicks on confirm delete the modal is hidden and
	 * delete request is sent to "core/api/delete/account"
	 */
		
	// Cancellation for free users
	$('#accountPrefs #cancel-account').off('click');
	$('#accountPrefs').on('click', '#cancel-account', function(e) {
	
			e.preventDefault();
			
			$("#warning-deletion-feedback").remove();
			// Shows account stats warning template with stats(data used)
			
			getTemplate("warning-feedback", {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				var el = $(template_ui);

				// Appends to content, warning is modal can call show if
				// appended in content
				$('#content').append(el);

				// Shows warning modal
				$("#warning-deletion-feedback").modal('show');

				// Undefines delete reason, if use chose not to delete account in delete process
				$("#warning-deletion-feedback").on('hidden.bs.modal', function(){
					ACCOUNT_DELETE_REASON_JSON = undefined;
				});

				$('body').on('click', '#warning-feedback-save', function(e) {
					e.preventDefault();
					
					var form = $("#cancelation-feedback-form");
					
					if(!isValidForm(form))
					{
						return;
					}
					
					var input =  $("input[name=cancellation_reason]:checked");
				
					ACCOUNT_DELETE_REASON_JSON = {};
					ACCOUNT_DELETE_REASON_JSON["reason"] = $(input).val();
					ACCOUNT_DELETE_REASON_JSON["reason_info"] = $("#account_delete_reason").val();
					$(".modal-body").html(getRandomLoadingImg());
					var delete_step1_el = "";
					if(ACCOUNT_STATS){
						getTemplate('warning', ACCOUNT_STATS, undefined, function(template_ui1){
					 		if(!template_ui1)
					    		return;
					    	delete_step1_el = $(template_ui1);
							
						}, null);

					}
					else
						{
							set_up_account_stats(el, function(data){
								getTemplate('warning', data, undefined, function(template_ui){
							 		if(!template_ui)
							    		return;
							    	delete_step1_el = $(template_ui);
									$('#content').html($(template_ui)); 
									$(".modal-body").css("padding", 0 ).html($(".modal-body", $(delete_step1_el)));
									$(".modal-footer").html($(".modal-footer", $(delete_step1_el)).html());
								}, null);

							})
							return;
						}
						 
					$(".modal-body").css("padding", 0 ).html($(".modal-body", $(delete_step1_el)));
					$(".modal-footer").html($(".modal-footer", $(delete_step1_el)).html());
					
				});
			}, null);
	});
	
	// Cancellation for paid users
	$('#accountPrefs #cancel-account-request').off('click');
	$('#accountPrefs').on('click', '#cancel-account-request', function(e) {
	
			e.preventDefault();
			
			$("#send-cancellation").remove();
			
			// Shows cancellation modal
			getTemplate('send-cancellation-request', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				var el = $(template_ui);	
				$('#content').append(el);
				$("#send-cancellation").modal('show');
			
				// Undefines delete reason, if use chose not to delete account in delete process
				$("#send-cancellation").on('hidden.bs.modal', function(){
					$("#account_cancel_reason").val()
				});

				$('body').on('click', '#send-delete-request', function(e) {

						e.preventDefault();

						if($(this).attr('disabled'))
					   	     return;
						
						// If not a valid form return else serialize form data to parse
						if(!isValidForm($("#cancelation-request-form")))
							return;
						
						// Disables send button and change text to Sending...
						disable_send_button($(this));
						
						var json = serializeForm("cancelation-request-form");
						
						var info = json.account_cancel_reason;
						
						// Replace \r\n with <br> tags as email is sent as text/html
						var reason = info.replace(/\r\n/g,"<br/>");
						
						// Build url
						var url =  'core/api/emails/send-email?from=' + encodeURIComponent(CURRENT_DOMAIN_USER.email) + '&to=' + 
						encodeURIComponent("care@agilecrm.com") + '&subject=' + encodeURIComponent("Cancellation Request") + '&body=' + 
						encodeURIComponent(reason);

						$.post(url,function(){

							// Reset form fields after sending email
							$("#cancelation-request-form").each(function () {
								this.reset();
							});
							
							// Adds "Cancellation Request" tag in "Our" domain
							add_tag_our_domain("Cancellation Request");
							
							// Adds note in "Our" domain
							var note = {};
							note.subject = "Cancellation Request";
							note.description = info;
							
							agile_addNote(note,'', CURRENT_DOMAIN_USER.email);
							
							$("#send-cancellation .modal-title").html($("#send-delete-request-step2 .modal-title").html());		    
						    $("#send-cancellation .modal-body").html($("#send-delete-request-step2 .modal-body").html());
							$("#send-cancellation .modal-footer").html($("#send-delete-request-step2 .modal-footer").html());
							
							// Enables Send Email button.
							enable_send_button($('#send-delete-request'));
						});
						
					});

			}, null);

			
	});

}

$(function(){

	$("#content").on("click", '#email-gateway-delete', function(e) {
		e.preventDefault();
		
		if(!confirm("Are you sure you want to delete?"))
    		return false;
		
		$.ajax({
			url: 'core/api/email-gateway',
			type: 'DELETE',
			success: function(){
				
				if(App_Admin_Settings.email_gateway && App_Admin_Settings.email_gateway.model)
			     {
			    	 var data = App_Admin_Settings.email_gateway.model.toJSON();
			    	 
			    	 if(data.email_api == "MANDRILL")
			    	 {
			    		 	// Delete mandrill webhook
							$.getJSON("core/api/email-gateway/delete-webhook?api_key="+ data.api_key+"&type="+data.email_api, function(data){
								
								console.log(data);
								
							});
			    	 }
			     }	
				
				location.reload(true);
			}
		});
	});

	$("#content").on('click', '#sms-gateway-delete', function(e){ 
		e.preventDefault();
		
		if(!confirm("Are you sure you want to delete?"))
    		return false;
		var id=$(this).attr('data');
		$.ajax({
			url: 'core/api/widgets/integrations/'+id,
			type: 'DELETE',
			success: function(){
				location.reload(true);
			}
		});
	});

});



	