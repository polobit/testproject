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

function load_office_folders(el, model) {

	var id = model.id;
	var optionsTemplate1 = "<option value='{{id}}' {{selected}}>{{name}}</option>";
	var el1 = $('.office-share-settings-select', el).closest("div");
	fillSelect('office-share-user-select', 'core/api/office/shared-to-users?id='
			+ id, 'users', function fillNew() {
		$("#office-share-user-select .default-select", el).remove();
		$(".office-share-select .loading", el).hide();
	}, optionsTemplate1, false, el1);

	var el2 = $('.office-folders-settings-click', el).closest("div");
	var optionsTemplate2 = "<option {{selected}}>{{name}}</option>";
	fillSelect('office-folders-multi-select', 'core/api/office/folders/' + id,
		 'folders', function fillNew() {
		$("#office-folders-multi-select .default-select", el).remove();

	}, optionsTemplate2, false, el2);
	
	var el3 = $('.office-folders-settings-click', el).closest("div");
	el3.find(".office-folders-settings-click").removeClass("text-info").removeAttr("style").addClass("m-b-md");
	el3.find("#icon_id").removeClass("icon-plus-sign").addClass("icon-minus-sign");
	el3.find(".office-folders-select").show();
	el3.find(".office-folders-select").css("display", "inline");
}


function load_gmail_widgets(limit) {
	// Gets Social Prefs (Same as Linkedin/Twitter) for Gmail
	gmailListView1 = new Settings_Collection_Events({
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
	imapListView1 = new Settings_Collection_Events({
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
	officeListView1 = new Settings_Collection_Events({
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

function load_smtp_widgets() {
	// Gets smtp prefs
	smtpListView1 = new Settings_Collection_Events({
		url : 'core/api/smtp/',
		templateKey : "settings-smtp-access",
		individual_tag_name : 'div',
		postRenderCallback : function(el) {
			$("#loadingImgHolder").hide();
			var smtp_count = smtpListView1.collection.length;
			
			if ((smtp_count < SMTP_ACCOUNT_LIMIT) || smtp_count === 0) {
				var data1 = {};

				getTemplate("settings-smtp-access-model", data1, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#prefs-tabs-content').find("#smtp-prefs").append($(template_ui));
				}, null);
			}
			updateTimeOut();
		}
	});
	smtpListView1.collection.fetch();
	App_Settings.smtpListView = smtpListView1;
	$('#prefs-tabs-content').find("#smtp-prefs").html(App_Settings.smtpListView.el);
}

function load_gmail_send_widgets() {
	// Gets GmailSend Prefs 
	gmailSendListView1 = new Settings_Collection_Events({
		url : 'core/api/email-send',
		templateKey : "settings-gmail-send",
		individual_tag_name : 'div',
		postRenderCallback : function(el) {
			var gmail_count = gmailSendListView1.collection.length;
			if ((gmail_count < OAUTH_GMAIL_SEND_LIMIT) || gmail_count === 0) {
				var data1 = {
					"service" : "gmail_send",
					"return_url" : encodeURIComponent(window.location.href)
				};

				getTemplate("settings-gmail-send-model", data1, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#prefs-tabs-content').find("#gmail-send").append($(template_ui));
				}, null);
			}
			updateTimeOut();
		}
	});
	gmailSendListView1.collection.fetch();
	App_Settings.gmailSendListView = gmailSendListView1;
	$('#prefs-tabs-content').find("#gmail-send").html(App_Settings.gmailSendListView.el);			
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

function load_office_properties(model, el) {
	var id = model.id;
	var optionsTemplate1 = "<option value='{{id}}' {{selected}}>{{name}}</option>";
	var el1 = $('.office-share-settings-select', el).closest("div");
	fillSelect('office-share-user-select', 'core/api/office/shared-to-users?id='
			+ id, 'users', function fillNew() {
		$("#office-share-user-select .default-select", el).remove();
		$(".office-share-select .loading", el).hide();
	}, optionsTemplate1, false, el1);

	var el2 = $('.office-folders-settings-click', el).closest("div");
	var optionsTemplate2 = "<option {{selected}}>{{name}}</option>";
	fillSelect('office-folders-multi-select', 'core/api/office/folders/' + id,
		 'folders', function fillNew() {
		$("#office-folders-multi-select .default-select", el).remove();

	}, optionsTemplate2, false, el2);
}

/**
*  Settings modal event listeners
*/
var Settings_Modal_Events = Base_Model_View.extend({

	/**
	 * For adding new document
	 */
	onGmailShareOptionsSelect: function(e){
		e.preventDefault();
		var target_el = $(e.currentTarget);

		var id = $(target_el).attr("oid");
		var el = $(target_el).closest("div");

		$(target_el).css("display", "none");
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
	},

	 /**
	 * To cancel the imap share settings event
	 */
	onGmailShareOptionsCancel : function(e){

		if(e.target.parentElement.attributes[0].name!="href" && e.target.parentElement.attributes[1].name!="href"){
     		e.preventDefault();
     		var target_el = $(e.currentTarget);

     	 	var el = $(target_el).closest("div");
			var name = $(target_el).attr('name');
			el.find(".gmail-share-select").css("display", "none");
			el.find(".gmail-share-settings-select").css("display", "inline");
			el.find(".gmail-share-settings-txt").css("display", "inline");
	     }
	},

	/**
	 * Share imap settings with othe users
	 */
	onImapShareOptionsSelect : function(e){
		e.preventDefault();
		var target_el = $(e.currentTarget);

		var id = $(target_el).attr("oid");
		var el = $(target_el).closest("div");
		$(target_el).css("display", "none");
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
	},

	/**
	 * To cancel the imap share settings event
	 */
	onImapShareOptionsCancel : function(e){
		e.preventDefault();
		var target_el = $(e.currentTarget);

		var el = $(target_el).closest("div");
		var name = $(target_el).attr('name');
		el.find("#imap-share-user-select").empty();
		el.find(".imap-share-select").css("display", "none");
		el.find(".imap-share-settings-select").css("display", "inline");
		el.find(".imap-share-settings-txt").css("display", "inline");
	},

	/**
	 * Select imap server folder, will fetch mails from these folders
	 */
	onImapFoldersOptionsSelect :  function(e){
		e.preventDefault();
		var target_el = $(e.currentTarget);

		var el = $(target_el).closest("div");
		var id = $(target_el).attr("oid");
		$(target_el).css("display", "none");
		el.find(".imap-folders-select").css("display", "inline");
		var optionsTemplate = "<option {{selected}}>{{name}}</option>";
		fillSelect('imap-folders-multi-select', 'core/api/imap/' + id
				+ '/imap-folders', 'folders', function fillNew() {
			$("#imap-folders-multi-select .default-select", el)
					.remove();
		}, optionsTemplate, false, el);
	},


	/**
	 * To cancel the imap folder settings
	 */
	onImapFoldersOptionsCancel :  function(e){
		e.preventDefault();
		var target_el = $(e.currentTarget);

		var el = $(target_el).closest("div");
		el.find('#imap-folders-multi-select').empty();
		el.find(".imap-folders-select").css("display", "none");
		el.find(".imap-folders-settings-click").css("display", "inline");
	},


	/**
	 * Share office settings with other users
	 */
	onOfficeShareOptionsSelect : function(e){
		e.preventDefault();
		var target_el = $(e.currentTarget);

		var el = $(target_el).closest("div");
		$(target_el).css("display", "none");
		var id = $(target_el).attr("oid");
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
	},

	/**
	 * To cancel the imap share settings event
	 */
	onOfficeShareOptionsCancel : function(e){
		e.preventDefault();
		var target_el = $(e.currentTarget);

		var el = $(target_el).closest("div");
		var name = $(target_el).attr('name');
		el.find(".office-share-select").css("display", "none");
		el.find(".office-share-settings-select").css("display", "inline");
		el.find(".office-share-settings-txt").css("display", "inline");
	},

	/**
	 * Select Office folder, will fetch mails from these folders
	 */
	onOfficeFoldersOptionsSelect :  function(e){
		e.preventDefault();
		var target_el = $(e.currentTarget);
		if($(target_el).hasClass("text-info")){
			$(target_el).removeClass("text-info").removeAttr("style").addClass("m-b-md");
			$(target_el).find("i").removeClass("icon-plus-sign").addClass("icon-minus-sign");
			$(".office-folders-select").show();

		}else{
			$(target_el).removeClass("m-b-md").addClass("text-info").css("color", "#23b7e5");
			$(target_el).find("i").removeClass("icon-minus-sign").addClass("icon-plus-sign");
			$(".office-folders-select").hide();
		}

	},


	events: {
		'click .gmail-share-settings-select': 'onGmailShareOptionsSelect',
		'click .gmail-share-settings-cancel': 'onGmailShareOptionsCancel',		
		'click .imap-share-settings-select': 'onImapShareOptionsSelect',		
		'click .imap-share-settings-cancel': 'onImapShareOptionsCancel',	
		'click .imap-folders-settings-click': 'onImapFoldersOptionsSelect',	
		'click .imap-folders-settings-cancel': 'onImapFoldersOptionsCancel',	
		'click .office-share-settings-select': 'onOfficeShareOptionsSelect',	
		'click .office-share-settings-cancel': 'onOfficeShareOptionsCancel',
		'click .office-folders-settings-click': 'onOfficeFoldersOptionsSelect',	
	},

});

/**
*  Settings modal event listeners
*/
var Settings_Collection_Events = Base_Collection_View.extend({
	events: {
		'click #gmail-prefs-delete': 'onGmailPrefsDelete',
		'click #office-prefs-delete,#imap-prefs-delete': 'onImapOfficePrefsDelete',
		'click #gmailsend-prefs-delete': 'onGmailSendPrefsDelete',
		'click #smtp-prefs-delete': 'onSmtpPrefsDelete',
	},

	
	onGmailPrefsDelete : function(e){
		e.preventDefault();
		var target_el = $(e.currentTarget);

		var saveBtn = $(target_el);
		var id = $(saveBtn).attr("oid");

		// Returns, if the save button has disabled attribute
		if ($(saveBtn).attr('disabled'))
			return;

		showAlertModal("delete", "confirm", function(){
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
	},

	onImapOfficePrefsDelete : function(e){
		e.preventDefault();
		var target_el = $(e.currentTarget);

		var saveBtn = $(target_el);		
		var id = $(saveBtn).attr("oid");

		// Returns, if the save button has disabled attribute
		if ($(saveBtn).attr('disabled'))
			return;
		
		showAlertModal("delete", "confirm", function(){
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

	},

	onGmailSendPrefsDelete : function(e){
		e.preventDefault();
		var target_el = $(e.currentTarget);

		var saveBtn = $(target_el);
		var id = $(saveBtn).attr("oid");

		// Returns, if the save button has disabled attribute
		if ($(saveBtn).attr('disabled'))
			return;

		showAlertModal("delete", "confirm", function(){
			// Disables save button to prevent multiple click event issues
			disable_save_button($(saveBtn));

			$.ajax({
				url : '/core/api/email-send/delete' + "/" + id,
				type : 'DELETE',
				success : function() {
					enable_save_button($(saveBtn));
					App_Settings.email();
					return;
				}
			});
		});
	},

	onSmtpPrefsDelete : function(e){
		e.preventDefault();
		var target_el = $(e.currentTarget);

		var saveBtn = $(target_el);		
		var id = $(saveBtn).attr("oid");

		// Returns, if the save button has disabled attribute
		if ($(saveBtn).attr('disabled'))
			return;
		
		showAlertModal("delete", "confirm", function(){
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
	},

});


$(function(){
	
	$('#content').on("change", "#server_host", function(e){
		$("#server_url").val($(this).val());
		
		// make server_url readonly for given server host
		if($("#server_url").val() != "")
			$("#server_url").attr("readonly", "readonly");
		else
			$("#server_url").removeAttr("readonly");


		// Hide checkbox for Outlook SMTP 
		if($(this).val() == "smtp.live.com" || $(this).val() == "smtp.office365.com") {
			$("#useSSLCheckboxHolder").hide();
		} 
		else {
			$("#useSSLCheckboxHolder").show();
		}
	});

	$("#content").on("click", '#email-gateway-delete', function(e) {
		e.preventDefault();
		
    	showAlertModal("delete", "confirm", function(){
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
				   else if(data.email_api === "MAILGUN")
			    	 {
			    		 	// Delete mailgun webhook
							$.getJSON("core/api/email-gateway/delete-webhook?api_key="+ data.api_key+"&type="+data.email_api+"&api_user="+data.api_user, function(data){
								console.log(data);
							});
			    	 }
				     }	
					
					location.reload(true);
				}
			});
		});
		
		
	});

	$("#content").on('click', '#sms-gateway-delete', function(e){ 
		e.preventDefault();
		var id=$(this).attr('data');
    	showAlertModal("delete", "confirm", function(){
    		$.ajax({
				url: 'core/api/widgets/integrations/'+id,
				type: 'DELETE',
				success: function(){
					location.reload(true);
				}
			});
		});
	});

	$("#content").on('click', '#recaptcha-gateway-delete', function(e){ 
		e.preventDefault();
		var id=$(this).attr('data');
    	showAlertModal("delete", "confirm", function(){
    		$.ajax({
				url: 'core/api/recaptcha-gateway',
				type: 'DELETE',
				success: function(){
					location.reload(true);
				}
			});
		});
	});

	$("#prefs-tabs-content .widgets_inner ul li").off("click");
	$("#prefs-tabs-content").on("click",".widgets_inner ul li",function(){
		var temp = $(this).find("a").attr("href").split("#");
		_agile_set_prefs('widget_tab', temp[1]);
		Backbone.history.navigate('add-widget', { trigger : true });
	});
	
});


function loadip_access_events()
{
	$(".blocked-panel-ip-delete").on('click', function(e) {
         e.preventDefault();
         var formId = $(this).closest('form');
 
         var ip = $(this).closest("tr").find('input').val();
         var id = $(this).closest("form").find('input[name="id"]').val();
         var $that = $(this);
		showAlertModal("delete", "confirm", function(){
			$.ajax({ url : 'core/api/allowedips/delete_ip?id='+id+'&ip='+ip,
		 			type : 'DELETE',
			 		success : function()
			 		{
			 			$that.closest("tr").remove(); 
			 
			 		},error : function(response)
		 			{
		 
		 				console.log(response);
		 			}
			 
	 		});
		});
          
     });

	//To add new ip to allow access
    $(".upsert-ip").on('click',function(e){
    	var obj = {};
    	if(element_has_attr($(this), "data-position")){
    		obj.position = $(this).attr("data-position");
    		obj.ip = $(this).closest("tr").find("input").val();
    	}

		$("#ipaccess-modal").html(getTemplate('add-new-ip', obj)).modal('show');
		$("#ip-add").on('click',function(e){
			
			var form = $(this).closest("form");
			if (!isValidForm(form)) {
				return;
			}
            
            // Get ip new value
            var userEnteredIp = $("#iplist").val();

            // Set add/edit field value
            if(element_has_attr($(this), "data-position")){
				 var trIndex = $(this).attr("data-position");
				 $(".iptable tbody tr").eq(trIndex).find("input").val(userEnteredIp);
			}else {
				$(".newip").val(userEnteredIp);	
			}            

			form.trigger("reset");
			$('.newip').closest('form').find('.save').trigger("click");
			$("#ipaccess-modal").html(getTemplate('add-new-ip', {})).modal('hide');
		});
	});


}

function element_has_attr(ele, attr_name){
	var attr = $(ele).attr(attr_name);

	// For some browsers, `attr` is undefined; for others,
	// `attr` is false.  Check for both.
	return (typeof attr !== typeof undefined && attr !== false);
}

	
