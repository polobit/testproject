var inboxMailListView;
var SHOW_TOTALCOUNT = true;
var InboxRouter = Backbone.Router.extend({
	routes : {
		/* inbox*/
		"inbox" : "inbox"
	},
	inbox: function(){
		$('#content').html("<div id='inbox-listners'>&nbsp;</div>");
		showTransitionBar();
		getTemplate("inbox", {}, undefined, function(template_ui) {
			if( !template_ui )	return;

			$('#inbox-listners').html($(template_ui));
			$( document ).ready(function() {
				syncContacts();
				initializeInboxListeners();
			});
		}, '#inbox-listners');
		$("#agile-menu-navigation-container .nav li").removeClass("active");
		$("#inboxmenu").addClass("active");
		$('[data-toggle="tooltip"]').tooltip();
	}
});
var globalMailCollection = Backbone.Collection.extend({

});
var globalMailCollectionInstance = null;
var mailListItem = null;

function syncContacts(){
	var syncedContacts = Backbone.Collection.extend({
		url:"core/api/emails/synced-accounts"
	});
	var syncedContactItem = Backbone.View.extend({
		el:'#filter-options',
		events: {
			'click .inbox-emails' : 'getEmails'
		},
		initialize:function(){
			_.bindAll(this,'render')
			var self = this;
			this.syncedContactsInstance = new syncedContacts();
			this.syncedContactsInstance.fetch({
				success: function(data,response,xhr) {
					self.render(data);
				},
				error: function (errorResponse) {
					console.log(errorResponse)
				}
			});	
		},
		render:function(data){
			getTemplate("account-types", data.toJSON(), undefined, function(template_ui) {
				if( !template_ui )	return;

				$("#filter-options").html(template_ui);
			}, '#filter-options');
			var inbox_has_email_configured = $("#inbox_has_email_configured").attr( "data-val" );
			if(inbox_has_email_configured === 'true'){
				$("#mails-list").css({"max-height":$(window).height()-128,"height":$(window).height()-128, "overflow-y":"scroll", "padding":"0px"});
				//$("#mail-view").css({"max-height":$(window).height()-128,"height":$(window).height()-128, "overflow-y":"scroll"});
				if(_agile_get_prefs("inbox_url")){
					url = _agile_get_prefs('inbox_url');
					$('#inbox-email-type-select').attr("data-url",url);
					url = url+"&folder_name=INBOX";
					$('#inbox-email-type-select').attr("from_email",_agile_get_prefs('inbox_email_server_type'));
					$('#inbox-email-type-select').attr("data-server",_agile_get_prefs('inbox_email_server'));
					$('#inbox-email-type-select').attr("folder-type","inbox");
					$('#inbox-email-type-select').html(_agile_get_prefs('inbox_from_email'));
					$('#inbox-email-type-select').attr("folder-type","inbox");
					globalMailCollectionInstance = new globalMailCollection();
					if(_agile_get_prefs('inbox_email_server') != 'agile')
						renderToMailList(url,1,10);
					else
						displayNoEmailTemplate();
				}else{
					url = "core/api/emails/all-agile-emails?";
					$('#inbox-email-type-select').attr("data-url",url);
					displayNoEmailTemplate();
				}
			}else{
				$("#inbox-prefs-verification").css({"display":"block"});
				displayNoEmailTemplate();
				hideTransitionBar();
			}
		},
		getEmails: function(e){
			e.preventDefault();
			//remove all data from cookies
			_agile_delete_prefs('inbox_data_inbox');
			_agile_delete_prefs('inbox_data_sent');
			_agile_delete_prefs('inbox_data_draft');
			_agile_delete_prefs('inbox_data_trash');
			$("#pagination").hide();
			var targetEl = $(e.currentTarget);
			var email_server = $(targetEl).attr('email-server');
			var url = $(targetEl).attr('data-url');
			$('#inbox-email-type-select').html($(targetEl).html());
			_agile_set_prefs('inbox_from_email', $(targetEl).html());
			// Here email_server_type means email/username of mail account
			email_server_type = $(targetEl).attr('email-server-type');
			if (email_server && url && (email_server != 'agile')){
				url = url.concat(email_server_type);
				_agile_set_prefs('inbox_url', url);
				$('#inbox-email-type-select').attr("data-url",url);
				$('#inbox-email-type-select').attr("from_email",email_server_type);
				$('#inbox-email-type-select').attr("data-server",email_server);
				url = url+"&folder_name=INBOX";
			}else{
				url = url.concat(email_server_type);
				_agile_set_prefs('inbox_url', url);
				$('#inbox-email-type-select').attr("data-server",email_server);
				$('#inbox-email-type-select').attr("data-url",url);
			}
			helperFunction();
			$('.inbox-menu li').removeClass('active');
			$(".inbox-menu li").first().addClass("active");
			$('#inbox-email-type-select').attr("folder-type","inbox");

			_agile_set_prefs('inbox_email_server_type', email_server_type);
			_agile_set_prefs('inbox_email_server', email_server);
			_agile_set_prefs('inbox_folder_type', "inbox");

			globalMailCollectionInstance = new globalMailCollection();
			if(email_server != 'agile'){
				renderToMailList(url,1,10);
			}else{
				displayNoEmailTemplate();
			}

		}
	});
	var syncedcontactitem = new syncedContactItem();
}
function renderToMailList(url,offset_val,page_size_val, folder_id){
	var fetchurl= '';
	fetchurl = url;
	var folder_id= $("#inbox-email-type-select").attr("folder-type");
	//var folder_id= $("#inbox-email-type-select").attr("folder-type");
	var mailCollection = Backbone.Collection.extend({
		url:function () { 
			return fetchurl+'&cursor='+this.offset+'&page_size='+this.page_size
		},
		offset: offset_val,
		page_size: page_size_val,
	});

	mailListItem = Backbone.View.extend({
		el:'#mails-list',
		// This will simply listen for scroll events on the current el
		events: {
	      //'scroll': 'checkScroll'
	  },
	  initialize:function(){
			//_.bindAll(this,'cleanUp')
			//var self = this;
			this.isLoading = false;
			this.mailCollectionInstance = new mailCollection();
			this.loadResults();
		},
		loadResults: function () {
			//var divhtml=$('<div style="width: 82%;height:100%;-webkit-box-pack: center;justify-content: center;/* -webkit-box-align: center; */align-items: center;top: 0;/* background-color: gray; */position: fixed;/* z-index: 10000; */display:flex;/* align-items: center; */" class="text-center">'+LOADING_HTML+'</div>');
			//if((("#mails-list").children().size())>1)
			
			$("#mails-list").append(LOADING_HTML);
		    
			$("#operation-menu").hide();
			$("#mark-dropdown").hide();
			var that = this;
			if(_agile_get_prefs("inbox_data_"+folder_id) && offset_val && offset_val == 1)
			{
				that.render(JSON.parse(_agile_get_prefs("inbox_data_"+folder_id)));
				renderToMailView(JSON.parse(_agile_get_prefs("inbox_data_"+folder_id)));
				inboxFlagListners();
			}
	        // we are starting a new load of results so set isLoading to true
	        this.isLoading = true;
	        // fetch is Backbone.js native function for calling and parsing the collection url
	        this.mailCollectionInstance.fetch({
	        	success: function(data,response,xhr) {
	        		that.render(data.toJSON());
	        		renderToMailView(data.toJSON());
	        		_agile_set_prefs("inbox_data_"+folder_id, JSON.stringify(data.toJSON()));
	        		if(data.toJSON().indexOf("errormssg") < 0 && data.toJSON().indexOf("error")){
	        			globalMailCollectionInstance.add(data.toJSON());
	        		}
	        		inboxFlagListners();
	        		hideTransitionBar();
	        		$(".pending").removeClass("pending");
	        		$('.folder-link').unbind('click', false);
	        		$(".loading").hide();
	        		$(".icon-spinner").hide();
	        		$(".sr-only").hide();
	        	},
	        	error: function (errorResponse) {
	        		console.log(errorResponse)
	        	}
	        });	 
	       // this.mailCollectionInstance.reset();
	    },
	    render:function(data){
	    	var html ="";
	    	getTemplate("mail", data, undefined, function(template_ui) {
	    		if( !template_ui )	return;

	    		html = template_ui;
	    	}, '#mails-list');
	    	if(this.mailCollectionInstance.offset == 1){
	    		if(data.length == 0){
	    			getTemplate("no-mail", data, undefined, function(template_ui) {
	    				if( !template_ui )	return;

	    				html = template_ui;
	    			}, '#mails-list');
	    		}
	    		this.$el.html(html);
	    	}else{
	    		this.$el.append(html);
	    	}
	    	this.isLoading = false;
	    },
	    checkScroll: function () {
	        var triggerPoint = 100; // 100px from the bottom
	        var scrolltop = $("#mails-list").scrollTop();
	        var scrollheight = $("#mails-list").height();
	        var totalheight = $("#mails-list").prop("scrollHeight");

	        if( !this.isLoading && scrolltop + scrollheight + triggerPoint > totalheight) {
	          this.mailCollectionInstance.offset += 10; // Load next page
	          this.mailCollectionInstance.page_size += 10;
	          this.loadResults();
	      }
	  }
	});
	var maillistitem = new mailListItem();
}
function renderToMailView(data){
	var dataVal = data;
	var mailViewItem = Backbone.View.extend({
		el:'#mail-details-view',
		events: {
			'click .inbox-reply':'displayReplyView'
		},
		initialize:function(){
			_.bindAll(this,'render')
			this.render();
			$('.collapse').on('show.bs.collapse', function (e) {
				$('.collapse').not(e.target).removeClass('in');
			});
			hideTransitionBar();
		},
		render:function(){
			var html= "";
			getTemplate("mail-view", data, undefined, function(template_ui) {
				if( !template_ui )	return;

				html = template_ui;
				//$("#mails-list").html(template_ui);
			}, '#mail-details-view');
			this.$el.append(html);
		},
		displayReplyView
		:function(e){
			var targetEl = $(e.currentTarget);
			var attrid = $(targetEl).attr('data-val');
			
			var $parent_element = $(targetEl).closest('#inbox-reply-div');
			//var from_email = $('#inbox-email-type-select').attr("from_email");
			var from_emails = $parent_element.find('.to-emails').data('from');
			var to_emails = "";

			var folder_type = $('#inbox-email-type-select').attr("folder-type");

			if(folder_type == "sent")
				to_emails = $parent_element.find('.to-emails').data('to');
			else
				to_emails = $parent_element.find('.to-emails').data('from');
			
			var subject = $parent_element.find('.subject').html();
			var body = '<p class="showreply"></p><blockquote id="show'+attrid+'" style="margin:0 0 0 .8ex;border-left:1px #ccc solid;padding-left:1ex;">'+$parent_element.find('.to-emails').html()+'</blockquote>';
			to_emails = to_emails.replace(/(, $)/g, "");
			
			var model = {};
			var that=this;
			$("#compose").html("");
			$("#"+attrid).html("");
			var el = $("#"+attrid).html('<div id="send-email-listener-container"></div>').find('#send-email-listener-container').html(getTemplate("inbox-compose", model));

			agile_type_ahead("to", el, contacts_typeahead, null, null, "email-search", null, true, null, true);

			$("#"+attrid).html('<div id="send-email-listener-container"></div>');
			getTemplate("inbox-compose", model, undefined, function(template_ui){
				if(!template_ui)
					return;
				var el = $("#send-email-listener-container").html($(template_ui));
				// Call setupTypeAhead to get contacts
				agile_type_ahead("to", el, contacts_typeahead, null, null, "email-search", null, true, null, true);
				agile_type_ahead("email_cc", el, contacts_typeahead, null, null, "email-search", null, true, null, true);
				agile_type_ahead("email_bcc", el, contacts_typeahead, null, null, "email-search", null, true, null, true);


				$("#emailForm", el).find('input[name="to"]').val(extractEmails(to_emails));
				$("#emailForm",el).find('input[name="subject"]').val("Re: "+subject);
				setupTinyMCEEditor('textarea#email-body', false, undefined, function(){

					if(!body)
						body = '';
					
					set_tinymce_content('email-body', body);
					register_focus_on_tinymce('email-body');
					$("textarea#email-body").css({"display":"none"});
				});
				initializeSendEmailListeners();
				initializeInboxSendEmailListeners();
				sendEmailAttachmentListeners("send-email-listener-container");

				var options = {};
				options[_agile_get_translated_val('others','add-new')] = "verify_email";
				fetchAndFillSelect(
					'core/api/account-prefs/verified-emails/all',
					"email",
					"email",
					undefined,
					options,
					$('#from_email'),
					"prepend",
					function($select, data) {

						if($select.find('option').size()===1){
							$select.find("option:first").before("<option value='NOEMAIL'>- No Verified Email -</option>");
							$select.find('option[value ="NOEMAIL"]').attr("selected", "selected");
						}
						else
							$select.val($select.find('option')[0].value);
						rearrange_from_email_options($select, data);
					});
			}, "#"+attrid);
			var sync_email = $('#inbox-email-type-select').attr("from_email");
			if(!sync_email){
				sync_email = CURRENT_AGILE_USER.domainUser.email;
			}
			$("#from_name").val(CURRENT_AGILE_USER.domainUser.name);
			$("#from_email").find('option[value ="'+sync_email+'"]').attr("selected", "selected");
			$(".ng-show").hide();
		}
	});
var mailviewitem = new mailViewItem();
}
function composeView(mail_message){
	var model = {};
	var that=this;
	var body = null;
	//var to_emails = "";

	var el = $("#mails-list").html('<div id="send-email-listener-container"></div>').find('#send-email-listener-container').html(getTemplate("inbox-compose", model));
	agile_type_ahead("to", el, contacts_typeahead, null, null, "email-search", null, true, null, true);
	$("#mails-list").html('<div id="send-email-listener-container"></div>');
	getTemplate("inbox-compose", model, undefined, function(template_ui){
		if(!template_ui)
			return;

		var el = $("#send-email-listener-container").html($(template_ui));
		agile_type_ahead("to", el, contacts_typeahead, null, null, "email-search", null, true, null, true);
		agile_type_ahead("email_cc", el, contacts_typeahead, null, null, "email-search", null, true, null, true);
		agile_type_ahead("email_bcc", el, contacts_typeahead, null, null, "email-search", null, true, null, true);
        /*var targetEl = $(el.currentTarget);
		var $parent_element = $(targetEl).closest('#inbox-reply-div');
		to_emails = $parent_element.find('.to-emails').data('from');

		$("#emailForm", el).find('input[name="to"]').val(to_emails);
		$("#emailForm",el).find('input[name="subject"]').val("Re: "+subject);*/
        $("#emailForm", el).find('.to-emails').data('from');

		if(mail_message){
			//body=mail_message[0].message;
			$.each(mail_message, function(k, arrayItem) {
				body = arrayItem.message;
			});
		}
		setupTinyMCEEditor('textarea#email-body', true, undefined, function(){

			if(!body)
				body = '';

			set_tinymce_content('email-body', body);
			register_focus_on_tinymce('email-body')
		});
		initializeSendEmailListeners();
		initializeComposeEmailListeners();
		sendEmailAttachmentListeners("send-email-listener-container");
		var options = {};
		options[_agile_get_translated_val('others','add-new')] = "verify_email";

		fetchAndFillSelect(
			'core/api/account-prefs/verified-emails/all',
			"email",
			"email",
			undefined,
			options,
			$('#from_email'),
			"prepend",
			function($select, data) {

				if($select.find('option').size()===1){
					$select.find("option:first").before("<option value='NOEMAIL'>- No Verified Email -</option>");
					$select.find('option[value ="NOEMAIL"]').attr("selected", "selected");
				}
				else
					$select.val($select.find('option')[0].value);
				rearrange_from_email_options($select, data);
			});
		var sync_email = $('#inbox-email-type-select').attr("from_email");
		$("#from_name").val(CURRENT_AGILE_USER.domainUser.name);
		$("#from_email").find('option[value ="'+sync_email+'"]').attr("selected", "selected");
	}, "#mails-list"); 
}
function inboxEmailSend(ele,json){
	// Disables send button and change text to Sending...
	disable_send_button(ele);

	// Navigates to previous page on sending email
	$.ajax({
		type : 'POST',
		data : JSON.stringify(json),
		dataType: 'json',
		contentType: "application/json",
		url : 'core/api/emails/contact/send-email',
		success : function(){
			// Enables Send Email button.
			enable_send_button($('#sendEmailInbox'));

			var url = $('#inbox-email-type-select').attr("data-url");
			url = url.concat("&folder_name=INBOX");
			helperFunction();
			$("#message_sent_alert_info").show();
			setTimeout(function(){
				$("#message_sent_alert_info").hide();
			}, 5000);
			renderToMailList(url,1,10);
		},
		error : function(response){
			enable_send_button($('#sendEmailInbox'));
			// Show cause of error in saving
			$save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>' + response.responseText + '</i></p></small></div>');
			// Appends error info to form actions
			// block.
			$($('#sendEmailInbox')).closest(".form-actions", this.el).append($save_info);
			// Hides the error message after 3
			// seconds
			if (response.status != 406)
				$save_info.show().delay(10000).hide(1);
		} 
	});
}
function inboxreplySend(ele,json){
	// Disables send button and change text to Sending...
	disable_send_button(ele);
	// Navigates to previous page on sending email
	$.ajax({
		type : 'POST',
		data : JSON.stringify(json),
		dataType: 'json',
		contentType: "application/json",
		url : 'core/api/emails/contact/send-email',
		success : function(){
			// Enables Send Email button.
			enable_send_button($('#sendEmailInbox'));
			$(".ng-show").show();
			$(".ng-hide").html("");
			$("#message_sent_alert_info").show();
			setTimeout(function(){
				$("#message_sent_alert_info").hide();
			}, 5000);
		},
		error : function(response){
			enable_send_button($('#sendEmailInbox'));
			// Show cause of error in saving
			$save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>' + response.responseText + '</i></p></small></div>');
			// Appends error info to form actions
			// block.
			$($('#sendEmailInbox')).closest(".form-actions", this.el).append($save_info);
			// Hides the error message after 3
			// seconds
			if (response.status != 406)
				$save_info.show().delay(10000).hide(1);
		} 
	});
}
function extractEmails(toEmails){
	var returnVal = null;
	var emails = toEmails.split(",");
	for(var i=0;i<emails.length;i++){
		var email = "";

		if(emails[i].indexOf("<") > -1){
			email = emails[i].split("<")[1].split(">")[0];
		}else{
			if(emails[i].indexOf("@") > -1)
				email = emails[i];
		}
		
		if(returnVal == null)
			returnVal = email;
		else
			returnVal= returnVal+','+email;
		
	}

	return returnVal;
}
function refreshInbox(){
	$("#search-mail").val("");
	var url = $('#inbox-email-type-select').attr("data-url");
	var folder_type = $('#inbox-email-type-select').attr("folder-type");
	if(folder_type == "inbox")
		url = url.concat("&folder_name=INBOX");
	else if(folder_type == "sent")
		url = url.concat("&folder_name=Sent");
	else if(folder_type == "draft")
		url = url.concat("&folder_name=Draft");
	else if(folder_type == "trash")
		url = url.concat("&folder_name=Trash");

	globalMailCollectionInstance = new globalMailCollection();
	helperFunction();
	SHOW_TOTALCOUNT = true;
	renderToMailList(url,1,10,folder_type);
}
function displayNoEmailTemplate(){
	var html ="";
	getTemplate("no-mail", null, undefined, function(template_ui) {
		if( !template_ui )	return;

		html = template_ui;
	}, '#mails-list');
	$("#mails-list").css({"overflow-y":"hidden"});
	$("#mails-list").html(html);
	hideTransitionBar();
}