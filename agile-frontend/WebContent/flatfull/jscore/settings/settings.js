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
				$('#prefs-tabs-content').find("#social-prefs").append(
						$(getTemplate("settings-social-prefs-model", data1)));
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
				$('#prefs-tabs-content').find("#imap-prefs").append(
						$(getTemplate("settings-imap-access-model", data1)));
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
				$('#prefs-tabs-content').find("#office-prefs").append(
						$(getTemplate("settings-office-access-model", data1)));
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

$(function() {
	$("#saveTheme").die().live("click", function(e) {
		e.preventDefault();
		$(".theme-save-status").css("display","none");
		var saveBtn = $(this);

		// Returns, if the save button has disabled
		// attribute
		if ($(saveBtn).attr('disabled'))
			return;

		// Disables save button to prevent multiple click
		// event issues
		disable_save_button($(saveBtn));
		var form_id = $(this).closest('form').attr("id");

		if (!isValidForm('#' + form_id)) {
			// Removes disabled attribute of save button
			enable_save_button($(saveBtn));
			return false;
		}
		var json = serializeForm(form_id);
		console.log("theme_info" + json);
		$.ajax({
			url : '/core/api/user-prefs/saveTheme',
			type : 'PUT',
			data : json,
			success : function() {
				enable_save_button($(saveBtn));
			},
			error : function() {
				enable_save_button($(saveBtn));
			}
		});
	});

	$(".gmail-share-settings-select")
			.die()
			.live(
					'click',
					function(e) {
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
	$(".gmail-share-settings-cancel").die().live('click', function(e) {
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
	$(".imap-share-settings-select")
			.die()
			.live(
					'click',
					function(e) {
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
	$(".imap-share-settings-cancel").die().live('click', function(e) {
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
	$(".imap-folders-settings-click").die().live(
			'click',
			function(e) {
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
	$(".imap-folders-settings-cancel").die().live('click', function(e) {
		e.preventDefault();
		var el = $(this).closest("div");
		el.find('#imap-folders-multi-select').empty();
		el.find(".imap-folders-select").css("display", "none");
		el.find(".imap-folders-settings-click").css("display", "inline");
	});

	/**
	 * Share office settings with other users
	 */
	$(".office-share-settings-select")
			.die()
			.live(
					'click',
					function(e) {
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
	$(".office-share-settings-cancel").die().live('click', function(e) {
		e.preventDefault();
		var el = $(this).closest("div");
		var name = $(this).attr('name');
		el.find(".office-share-select").css("display", "none");
		el.find(".office-share-settings-select").css("display", "inline");
		el.find(".office-share-settings-txt").css("display", "inline");
	});

	$("#gmail-prefs-delete").live("click", function(e) {

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
	
	$("#office-prefs-delete, #imap-prefs-delete").live("click", function(e) {

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
});	