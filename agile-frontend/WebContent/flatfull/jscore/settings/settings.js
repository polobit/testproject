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


	events: {
		'click .gmail-share-settings-select': 'onGmailShareOptionsSelect',
		'click .gmail-share-settings-cancel': 'onGmailShareOptionsCancel',		
		'click .imap-share-settings-select': 'onImapShareOptionsSelect',		
		'click .imap-share-settings-cancel': 'onImapShareOptionsCancel',	
		'click .imap-folders-settings-click': 'onImapFoldersOptionsSelect',	
		'click .imap-folders-settings-cancel': 'onImapFoldersOptionsCancel',	
		'click .office-share-settings-select': 'onOfficeShareOptionsSelect',	
		'click .office-share-settings-cancel': 'onOfficeShareOptionsCancel',	
	},

});

/**
*  Settings modal event listeners
*/
var Settings_Collection_Events = Base_Collection_View.extend({
	events: {
		'click #gmail-prefs-delete': 'onGmailPrefsDelete',	
		'click #office-prefs-delete,#imap-prefs-delete': 'onImapOfficePrefsDelete',	
	},

	
	onGmailPrefsDelete : function(e){
		e.preventDefault();
		var target_el = $(e.currentTarget);

		var saveBtn = $(target_el);
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
	},

	onImapOfficePrefsDelete : function(e){
		e.preventDefault();
		var target_el = $(e.currentTarget);

		var saveBtn = $(target_el);		
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

	},
});


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

	$("#prefs-tabs-content .widgets_inner ul li").off("click");
	$("#prefs-tabs-content").on("click",".widgets_inner ul li",function(){
		var temp = $(this).find("a").attr("href").split("#");
		_agile_set_prefs('widget_tab', temp[1]);
		Backbone.history.navigate('add-widget', { trigger : true });
	});
	
});


function loadip_access_events()
{
	//To delete IP
	$(".blocked-panel-ip-delete").on('click', function(e) {
        e.preventDefault();

		var data_array = [];
		var checked = false;

		var tableEle = $(this).closest("form").find(".multiple-input");
		$.each($(tableEle).find('input[type="checkbox"]'), function(index, data) {
			if($(data).is(":checked")){
				$(data).closest('tr').on("mouseenter", false);
				data_array.push($(data).closest("tr").attr("data"));
				checked = true;
			}
				
		});

		if(!checked){
			// Show error
			return;
		}

		$.ajax({ url : 'core/api/allowedips/delete_ip?iplist='+JSON.stringify(data_array),
			type : 'DELETE',
			success : function()
		  	{
		  		// Refresh container
		  		App_Admin_Settings.ipaccess();

		  	},error : function(response)
			{
				console.log(response);
				// Show error
			}

		});
    });

	//To add new ip to allow access

    $("#newip-add").on('click',function(e){
		//$("#ipaccess-modal").modal('show');
		$("#ipaccess-modal").html(getTemplate('add-new-ip', {})).modal('show');
			$("#ip-add").on('click',function(e){
				var form = $(this).closest("form");
				if (!isValidForm(form)) {
					return;
				}

				$(".newip").val($("#iplist").val());
				form.trigger("reset");
				$('.newip').closest('form').find('.save').trigger("click");
			});
	});

}

	
