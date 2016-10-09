var inboxMailListView;
var InboxRouter = Backbone.Router.extend({

	routes : {
		/* inbox*/
		"inbox" : "inbox"
		//"sent" : "sent",
		//"compose":"compose"
	},

	inbox: function(){
		$('#content').html("<div id='inbox-listners'>&nbsp;</div>");
		showTransitionBar();
		getTemplate("inbox", {}, undefined, function(template_ui) {
			if( !template_ui )	return;

			$('#inbox-listners').html($(template_ui));
			syncContacts();
			initializeInboxListeners();
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
			var source = $('#account-types-template').html();
	        var template = Handlebars.compile(source);
	        var html = template(data.toJSON());
	        this.$el.html(html);
			var inbox_has_email_configured = $("#inbox_has_email_configured").attr( "data-val" );
			if(inbox_has_email_configured === 'true'){
				$("#mails-list").css({"max-height":$(window).height()-128,"height":$(window).height()-128, "overflow-y":"scroll", "padding":"0px"});
				//$("#mail-view").css({"max-height":$(window).height()-128,"height":$(window).height()-128, "overflow-y":"scroll"});

				url = "core/api/emails/all-agile-emails?";
				$('#inbox-email-type-select').attr("folder-type","inbox");
				$('#inbox-email-type-select').attr("data-url",url);
				renderToMailList(url,1,10);
	        }else{
	        	$("#inbox-prefs-verification").css({"display":"block"});
	        	hideTransitionBar();
	        }
		},
		getEmails: function(e){
			e.preventDefault();
			var targetEl = $(e.currentTarget);
			var email_server = $(targetEl).attr('email-server');
			var url = $(targetEl).attr('data-url');
			$('#inbox-email-type-select').html($(targetEl).html());
			// Here email_server_type means email/username of mail account
			email_server_type = $(targetEl).attr('email-server-type');
			if (email_server && url && (email_server != 'agile')){
				url = url.concat(email_server_type);
				$('#inbox-email-type-select').attr("data-url",url);
				$('#inbox-email-type-select').attr("from_email",email_server_type);
				$('#inbox-email-type-select').attr("data-server",email_server);
				url = url+"&folder_name=INBOX";
			}else{
				url = url.concat(email_server_type);
				$('#inbox-email-type-select').attr("data-server",email_server);
				$('#inbox-email-type-select').attr("data-url",url);
			}
			helperFunction();
			$('.inbox-menu li').removeClass('active');
	        $(".inbox-menu li").first().addClass("active");
	        $('#inbox-email-type-select').attr("folder-type","inbox");
	        globalMailCollectionInstance = new globalMailCollection();
			renderToMailList(url,1,10);
		}
	});
	var syncedcontactitem = new syncedContactItem();
}
function renderToMailList(url,offset_val,page_size_val){
	var fetchurl= '';
	fetchurl = url;

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
			$("#mails-list").append(LOADING_HTML);
			$("#operation-menu").hide();
			$("#mark-dropdown").hide();
	        var that = this;
	        // we are starting a new load of results so set isLoading to true
	        this.isLoading = true;
	        // fetch is Backbone.js native function for calling and parsing the collection url
	        this.mailCollectionInstance.fetch({
				success: function(data,response,xhr) {
					that.render(data);
					renderToMailView(data);
					if(data.toJSON().indexOf("errormssg") < 0){
						globalMailCollectionInstance.add(data.toJSON());
					}
					inboxFlagListners();
					hideTransitionBar();
					$(".loading").hide();
				},
				error: function (errorResponse) {
					console.log(errorResponse)
				}
			});	 
			this.mailCollectionInstance.reset();
	    },
		render:function(data){
			var source = $('#mail-template').html();
	        var template = Handlebars.compile(source);
	        var html = template(data.toJSON());
	        if(this.mailCollectionInstance.offset == 1){
	        	if(data.length == 0){
		        	source = $('#no-mail-template').html();
			        template = Handlebars.compile(source);
			        html = template(data.toJSON());
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
			var source = $('#mail-view-template').html();
	        var template = Handlebars.compile(source);
	        var html = template(dataVal.toJSON());
	        this.$el.append(html);
		},
		displayReplyView:function(e){
			var targetEl = $(e.currentTarget);
			var attrid = $(targetEl).attr('data-val');
			
			var $parent_element = $(targetEl).closest('#inbox-reply-div');
			var to_emails = $parent_element.find('.to-emails').data('to');
			var subject = $parent_element.find('.subject').html();
			var body = '<p></p><blockquote style="margin:0 0 0 .8ex;border-left:1px #ccc solid;padding-left:1ex;">'+$parent_element.find('.to-emails').html()+'</blockquote>';
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
						

				$("#emailForm", el).find('input[name="to"]').val(to_emails);
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
			$(".ng-show").hide();
		}
	});
	var mailviewitem = new mailViewItem();
}
function composeView(){
	var model = {};
	var that=this;
	var body = null;

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
		},
		error : function(response){
			enable_send_button($('#sendEmailInbox'));
			$("#message_sent_alert_info").show();
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