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
			$("#mail-inbox").css({"font-weight":"bold","color":"white","background-color": "#23b7e5"});
			$("#mail-sent").css({"font-weight":"normal","color":"inherit","background-color": "#inherit"});
			
			syncContacts();
			initializeInboxListeners();
		}, '#inbox-listners');
		
		$(".active").removeClass("active");
		$("#inboxmenu").addClass("active");
		$('[data-toggle="tooltip"]').tooltip();
	},
	compose:function(id, subject, body, cc, bcc){
		$('#content').html("<div id='inbox-listners'>&nbsp;</div>");
		getTemplate("inbox", {}, undefined, function(template_ui) {
			if( !template_ui )	return;

			$('#inbox-listners').html($(template_ui));
			$("#mail-inbox").css({"font-weight":"bold","color":"white","background-color": "#23b7e5"});
			syncContacts();
			var model = {};
			var that=this;
			$(document).on('click','.mail-compose',function(e) {
				$("#mails-list").hide();
				$("#mail-details-view").hide();
				$("#compose").show();
			});
			$("#mails-list").hide();
			$("#mail-details-view").hide();
			$("#compose").show();
			var el = $("#compose").html('<div id="send-email-listener-container"></div>').find('#send-email-listener-container').html(getTemplate("inbox-compose", model));
			agile_type_ahead("to", el, contacts_typeahead, null, null, "email-search", null, true, null, true);
			$("#compose").html('<div id="send-email-listener-container"></div>');
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
				sendEmailAttachmentListeners("send-email-listener-container");
			}, "#compose"); 
		}, '#inbox-listners');
		hideTransitionBar();
		$(".active").removeClass("active");
		$("#inboxmenu").addClass("active");
		$('[data-toggle="tooltip"]').tooltip();
	}
});
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
				url = url.concat(email_server_type);;
				$('#inbox-email-type-select').attr("data-url",url);
				$('#inbox-email-type-select').attr("from_email",email_server_type);
				$('#inbox-email-type-select').attr("data-server",email_server);
				url = url+"&folder_name=INBOX";
			}
			$("#mails-list").show();
			$("#mail-details-view").hide();
			$("#compose").hide();
			$("#mails-list").remove();
			$("#mails-list-view").append("<ul class='portlet_body list-group list-group-lg no-radius m-b-none m-t-n-xxs' id='mails-list'></ul>");
			$("#mails-list").css({"max-height":$(window).height()-128,"height":$(window).height()-128, "overflow-y":"scroll", "padding":"0px"});
			$("#mail-details-view").remove();
			$("#mail-detail-view").append("<div class='portlet_body' id='mail-details-view' style='display:none;'></div>");
			$("#mail-inbox").css({"font-weight":"bold","color":"white","background-color": "#23b7e5"});
			$("#mail-draft").css({"font-weight":"normal","color":"inherit","background-color": "transparent"});
			$("#mail-trash").css({"font-weight":"normal","color":"inherit","background-color": "transparent"});
			$("#mail-sent").css({"font-weight":"normal","color":"inherit","background-color": "transparent"});
			renderToMailList(url,1,10);
		}
	});
	var syncedcontactitem = new syncedContactItem();
}
function renderToMailList(url,offset_val,page_size_val){
	/*$("#mails-list").empty();
	$("#mail-details-view").html('');*/
	var fetchurl= '';
	fetchurl = url;

	var mailCollection = Backbone.Collection.extend({
				url:function () { 
					return fetchurl+'&cursor='+this.offset+'&page_size='+this.page_size
				},
				offset: offset_val,
    			page_size: page_size_val,
			});
			
	var mailListItem = Backbone.View.extend({
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
					
					$('.collapse').on('show.bs.collapse', function (e) {
						$("#mails-list").hide();
						$("#compose").hide();
						$("#mail-details-view").show();
					    $('.collapse').not(e.target).removeClass('in');
					});
					$(document).on('click','.back-to-inbox',function(e) {
						$("#mails-list").show();
						$("#mail-details-view").hide();
						$("#compose").hide();
						$(".inbox-reply-view").html("");
						$(".ng-show").show();
					});
					$("div.unread").css({"font-weight":"bold"});
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

			$("#mail-inbox").css({"font-weight":"bold","color":"white","background-color": "#23b7e5"});
			$("#mail-sent").css({"font-weight":"normal","color":"inherit","background-color": "transparent"});
			var url = $('#inbox-email-type-select').attr("data-url");
			url = url.concat("&folder_name=INBOX");
			$("#mails-list").remove();
			$("#mails-list-view").append("<ul class='portlet_body list-group list-group-lg no-radius m-b-none m-t-n-xxs' id='mails-list'></ul>");
			$("#mails-list").css({"max-height":$(window).height()-128,"height":$(window).height()-128, "overflow-y":"scroll", "padding":"0px"});
			$("#mail-details-view").remove();
			$("#mail-detail-view").append("<div class='portlet_body' id='mail-details-view' style='display:none;'></div>");
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
function inboxFlagListners(){

	var cursor = $(".get-counts").attr("data-cursor");
	var totalcount = $(".get-counts").attr("data-count");

	if(parseInt(totalcount) > 10){
		$("#pagination").show();
	}
	if(parseInt(cursor) > 10 && parseInt(totalcount) > parseInt(cursor)+9){
		$(".previous").prop("disabled",false);
		$(".next").prop("disabled",false);
		var to_val = parseInt(cursor)+9;
		if(cursor){
			$(".inti-val").text(cursor+" - "+to_val);
		}else{
			$("#pagination").hide();
		}
	}else{
		if(parseInt(totalcount) < 10 ){
			$(".previous").prop("disabled",true);
			$(".next").prop("disabled",true);
			if(cursor){
				$(".inti-val").text(cursor+" - "+totalcount);
			}else{
				$("#pagination").hide();
			}
		}else{
			var to_val = parseInt(cursor)+9;
			if(to_val  >= totalcount){
				to_val = totalcount;
				$(".next").prop("disabled",true);
				$(".previous").prop("disabled",false);
			}else{
				$(".previous").prop("disabled",true);
				$(".next").prop("disabled",false);
			}
			if(cursor){
				$(".inti-val").text(cursor+" - "+ to_val);
			}else{
				$("#pagination").hide();
			}
		}
	}
	$(".totalcount").text(totalcount);
	
	

	var color=['b-l-info','b-l-primary','b-l-warning','b-l-success',''];
	var j =0;
    $('#mails-list-view ul li').each(function(i){
        $(this).addClass(color[j]);
        if(j == 4)
        	j = 0
        else
        	j++
    });

	$(".unread").unbind().click(function() {
		//var attrid = $(this).attr("id");
		var dataVal = $(this).attr("data-val");
		var from_email = $('#inbox-email-type-select').attr("from_email");
		var server = $("#inbox-email-type-select").attr("data-server");
		var url ="";

		if(server == "google")
			url = "core/api/social-prefs/setFlags?";
		if(server == "imap")
			url ="core/api/imap/setFlags?";

		url = url+"from_email="+from_email+"&folder_name=INBOX&flag=SEEN&messageid="+dataVal,
		setSeenFlag(url);
		$(this).css({"font-weight":"normal"});
		$(this).removeClass("unread");
		$(this).addClass("read");
	});
	$(".delete").unbind().click(function() {
		var dataVal = $(this).attr("data-id");
		var from_email = $('#inbox-email-type-select').attr("from_email");
		var server = $("#inbox-email-type-select").attr("data-server");
		var url ="";

		if(server == "google")
			url = "core/api/social-prefs/setFlags?";
		if(server == "imap")
			url ="core/api/imap/setFlags?";

		url = url+"from_email="+from_email+"&folder_name=INBOX&flag=DELETED&messageid="+dataVal,
		setSeenFlag(url);

		$("#li"+dataVal).remove();
		$("#"+dataVal).remove();
		$("#mails-list").show();
		$("#mail-details-view").hide();
		$(".inbox-reply-view").html("");
		$(".ng-show").show();
	});
	$('input[name="mailcheck"]').on('change', function(e) {
		var len = $('input[name="mailcheck"]:checked').length
		if(len == 0){
			$("#operation-menu").hide();
			$("#mark-dropdown").hide();
		}else{
			$("#operation-menu").show();
			$("#mark-dropdown").show();
		}
	});
}
function setSeenFlag(url,dataVal, attrid){
	$.ajax({ 
		url :url,
		success : function(data){} 
	});
}
var idcol = []
function initializeInboxListeners(){

	$('#inbox-listners').on('click', '#mail-inbox', function(e){
		e.preventDefault();
		$("#mail-inbox").css({"font-weight":"bold","color":"white","background-color": "#23b7e5"});
		$("#mail-sent").css({"font-weight":"normal","color":"inherit","background-color": "transparent"});
		$("#mail-trash").css({"font-weight":"normal","color":"inherit","background-color": "transparent"});
		$('#inbox-email-type-select').attr("folder-type","inbox");
		var url = $('#inbox-email-type-select').attr("data-url");
		url = url.concat("&folder_name=INBOX");
		$("#mails-list").remove();
		$("#mails-list-view").append("<ul class='portlet_body list-group list-group-lg no-radius m-b-none m-t-n-xxs' id='mails-list'></ul>");
		$("#mails-list").css({"max-height":$(window).height()-128,"height":$(window).height()-128, "overflow-y":"scroll", "padding":"0px"});
		$("#mail-details-view").remove();
		$("#mail-detail-view").append("<div class='portlet_body' id='mail-details-view' style='display:none;'></div>");
		renderToMailList(url,1,10);
	});

	$('#inbox-listners').on('click', '#mail-sent', function(e){
		e.preventDefault();
		$("#mail-inbox").css({"font-weight":"normal","color":"inherit","background-color": "transparent"});
		$("#mail-draft").css({"font-weight":"normal","color":"inherit","background-color": "transparent"});
		$("#mail-trash").css({"font-weight":"normal","color":"inherit","background-color": "transparent"});
		$("#mail-sent").css({"font-weight":"bold","color":"white","background-color": "#23b7e5"});
		$('#inbox-email-type-select').attr("folder-type","sent");
		var url = $('#inbox-email-type-select').attr("data-url");
		url = url.concat("&folder_name=Sent");
		$("#mails-list").remove();
		$("#mails-list-view").append("<ul class='portlet_body list-group list-group-lg no-radius m-b-none m-t-n-xxs' id='mails-list'></ul>");
		$("#mails-list").css({"max-height":$(window).height()-128,"height":$(window).height()-128, "overflow-y":"scroll", "padding":"0px"});
		$("#mail-details-view").remove();
		$("#mail-detail-view").append("<div class='portlet_body' id='mail-details-view' style='display:none;'></div>");
		renderToMailList(url,1,10);
	});
	$('#inbox-listners').on('click', '#mail-draft', function(e){
		e.preventDefault();
		$("#mail-inbox").css({"font-weight":"normal","color":"inherit","background-color": "transparent"});
		$("#mail-sent").css({"font-weight":"normal","color":"inherit","background-color": "transparent"});
		$("#mail-draft").css({"font-weight":"normal","color":"inherit","background-color": "transparent"});
		$("#mail-trash").css({"font-weight":"normal","color":"inherit","background-color": "transparent"});
		$("#mail-draft").css({"font-weight":"bold","color":"white","background-color": "#23b7e5"});
		$('#inbox-email-type-select').attr("folder-type","draft");
		var url = $('#inbox-email-type-select').attr("data-url");
		url = url.concat("&folder_name=Draft");
		$("#mails-list").remove();
		$("#mails-list-view").append("<ul class='portlet_body list-group list-group-lg no-radius m-b-none m-t-n-xxs' id='mails-list'></ul>");
		$("#mails-list").css({"max-height":$(window).height()-128,"height":$(window).height()-128, "overflow-y":"scroll", "padding":"0px"});
		$("#mail-details-view").remove();
		$("#mail-detail-view").append("<div class='portlet_body' id='mail-details-view' style='display:none;'></div>");
		renderToMailList(url,1,10);
	});
	$('#inbox-listners').on('click', '#mail-trash', function(e){
		e.preventDefault();
		$("#mail-inbox").css({"font-weight":"normal","color":"inherit","background-color": "transparent"});
		$("#mail-sent").css({"font-weight":"normal","color":"inherit","background-color": "transparent"});
		$("#mail-draft").css({"font-weight":"normal","color":"inherit","background-color": "transparent"});
		$("#mail-trash").css({"font-weight":"bold","color":"white","background-color": "#23b7e5"});
		$('#inbox-email-type-select').attr("folder-type","trash");
		var url = $('#inbox-email-type-select').attr("data-url");
		url = url.concat("&folder_name=Trash");
		$("#mails-list").remove();
		$("#mails-list-view").append("<ul class='portlet_body list-group list-group-lg no-radius m-b-none m-t-n-xxs' id='mails-list'></ul>");
		$("#mails-list").css({"max-height":$(window).height()-128,"height":$(window).height()-128, "overflow-y":"scroll", "padding":"0px"});
		$("#mail-details-view").remove();
		$("#mail-detail-view").append("<div class='portlet_body' id='mail-details-view' style='display:none;'></div>");
		renderToMailList(url,1,10);
	});
	$('#inbox-listners').on('click', '.mail-compose', function(e){
		e.preventDefault();
		$("#mails-list").remove();
		$("#mails-list-view").append("<ul class='portlet_body list-group list-group-lg no-radius m-b-none m-t-n-xxs' id='mails-list'></ul>");
		$("#mails-list").css({"max-height":$(window).height()-128,"height":$(window).height()-128, "overflow-y":"scroll", "padding":"0px"});
		$("#mail-details-view").remove();
		$("#mail-detail-view").append("<div class='portlet_body' id='mail-details-view' style='display:none;'></div>");
		$("#mails-list").append(LOADING_HTML);
		composeView();
		$(".loading").hide();
	});

	$('#inbox-listners').on('click', '#search_email', function(e){
		var search_val = document.getElementById('search-mail').value;
		if(search_val){
			var from_email = $('#inbox-email-type-select').text();
			var server = $("#inbox-email-type-select").attr("data-server");
			var url ="";

			if(server == "google")
				url = "core/api/social-prefs/search-google-emails?";
			if(server == "imap")
				url ="core/api/imap/search-imap-emails?";

			url = url+"from_email="+from_email+"&search_content="+search_val;
			$("#mails-list").remove();
			$("#mails-list-view").append("<ul class='portlet_body list-group list-group-lg no-radius m-b-none m-t-n-xxs' id='mails-list'></ul>");
			$("#mails-list").css({"max-height":$(window).height()-128,"height":$(window).height()-128, "overflow-y":"scroll", "padding":"0px"});
			$("#mail-details-view").remove();
			$("#mail-detail-view").append("<div class='portlet_body' id='mail-details-view' style='display:none;'></div>");
			renderToMailList(url,1,10);
		}
	});

	$(".select-mails").unbind().click(function(e) {
		var dataVal = $(this).attr("data-val");
		if(dataVal == "All"){
			$(".mark-read").show();
			$(".mark-unread").show();
			$('.mail_check').prop('checked', false);
			selectCheckBoxes("mail_check")
		}else if(dataVal == "None"){
			$("#operation-menu").hide();
			$("#mark-dropdown").hide();
			$('.mail_check').prop('checked', false);
		}else if(dataVal == "Read"){
			$(".mark-read").hide();
			$(".mark-unread").show();
			$('.mail-unread').prop('checked', false);
			selectCheckBoxes("mail-read")
		}else if(dataVal == "Unread"){
			$(".mark-unread").hide();
			$(".mark-read").show();
			$('.mail-read').prop('checked', false);
			selectCheckBoxes("mail-unread")
		}
	});
	$(".bulk-delete").unbind().click(function(e) {
		idcol = [];
		var urlval = returnUrl();
		if(urlval){
			urlval = urlval+"&flag=DELETED";
			setSeenFlag(urlval);
			for(var i=0;i<idcol.length;i++){
				$("#li"+idcol[i]).remove();
				$("#"+idcol[i]).remove();
			}
			$("#operation-menu").hide();
			$("#mark-dropdown").hide();


			var curr_val = $(".inti-val").text();
			var tot_val = $(".totalcount").text();
			var offset = curr_val.split(" - ")[0].trim();
			offset = parseInt(offset)+10;
			var page_size = curr_val.split(" - ")[1].trim();
			page_size = parseInt(page_size)+idcol.length;

			var url = $('#inbox-email-type-select').attr("data-url");
			var folder_type = $('#inbox-email-type-select').attr("folder-type");
			if(folder_type == "inbox")
				url = url.concat("&folder_name=INBOX");
			else if(folder_type == "sent")
					url = url.concat("&folder_name=Sent");

			renderToMailList(url,offset,page_size);
		}		
	});

	$(".mark-read").unbind().click(function(e) {
		idcol = [];
		var urlval = returnUrl();
		if(urlval){
			urlval = urlval+"&flag=SEEN";
			setSeenFlag(urlval);
			for(var i=0;i<idcol.length;i++){
				$("#flag"+idcol[i]).removeClass("unread");
				$("#flag"+idcol[i]).addClass("read");
				$(".read").css({"font-weight":"normal"});
				$("#check-"+idcol[i]).removeClass("mail-unread");
				$("#check-"+idcol[i]).addClass("mail-read");
			}
		}		
	});

	$(".mark-unread").unbind().click(function(e) {
		idcol = [];
		var urlval = returnUrl();
		if(urlval){
			urlval = urlval+"&flag=UNREAD";
			setSeenFlag(urlval);
			for(var i=0;i<idcol.length;i++){
				$("#flag"+idcol[i]).removeClass("read");
				$("#flag"+idcol[i]).addClass("unread");
				$(".unread").css({"font-weight":"bold"});
				$("#check-"+idcol[i]).removeClass("mail-read");
				$("#check-"+idcol[i]).addClass("mail-unread");
			}
		}		
	});

	$(".previous").unbind().click(function(e) {
		var curr_val = $(".inti-val").text();
		var tot_val = $(".totalcount").text();
		var offset = curr_val.split(" - ")[0].trim();
		offset = parseInt(offset)-10;
		var page_size = curr_val.split(" - ")[1].trim();
		page_size = parseInt(page_size)-10;
		if(page_size < 10)
			page_size = 10;

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

		$("#mails-list").remove();
		$("#mails-list-view").append("<ul class='portlet_body list-group list-group-lg no-radius m-b-none m-t-n-xxs' id='mails-list'></ul>");
		$("#mails-list").css({"max-height":$(window).height()-128,"height":$(window).height()-128, "overflow-y":"scroll", "padding":"0px"});
		$("#mail-details-view").remove();
		$("#mail-detail-view").append("<div class='portlet_body' id='mail-details-view' style='display:none;'></div>");
		renderToMailList(url,offset,page_size);
	});

	$(".next").unbind().click(function(e) {
		var curr_val = $(".inti-val").text();
		var tot_val = $(".totalcount").text();
		var offset = curr_val.split(" - ")[0].trim();
		offset = parseInt(offset)+10;
		var page_size = curr_val.split(" - ")[1].trim();
		page_size = parseInt(page_size)+10;

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

		$("#mails-list").remove();
		$("#mails-list-view").append("<ul class='portlet_body list-group list-group-lg no-radius m-b-none m-t-n-xxs' id='mails-list'></ul>");
		$("#mails-list").css({"max-height":$(window).height()-128,"height":$(window).height()-128, "overflow-y":"scroll", "padding":"0px"});
		$("#mail-details-view").remove();
		$("#mail-detail-view").append("<div class='portlet_body' id='mail-details-view' style='display:none;'></div>");
		renderToMailList(url,offset,page_size);

	});
	
}
function returnUrl(){
	var url = "";
	var meesageids  = null;
        $.each($("input[name='mailcheck']:checked"), function(){    
	        if(meesageids == null){
	            meesageids = $(this).val();
	        }else{
	        	meesageids = meesageids+','+$(this).val();
	        }
	        idcol.push($(this).val());
        });
        if(meesageids){
			var from_email = $('#inbox-email-type-select').attr("from_email");
			var server = $("#inbox-email-type-select").attr("data-server");

			if(server == "google")
				url = "core/api/social-prefs/setFlags?";
			if(server == "imap")
				url ="core/api/imap/setFlags?";

			url = url+"from_email="+from_email+"&folder_name=INBOX&messageid="+meesageids;
			return url;
		}else{
			return null;
		}
	
}
function selectCheckBoxes(classname){
	if($('.'+classname).is(':visible')) {
		$("#operation-menu").show();
		$("#mark-dropdown").show();
	}
	checkboxes = document.getElementsByClassName(classname)
	var checkboxeslength = checkboxes.length;
	if(checkboxeslength > 0){
		if(checkboxeslength > 20){
			checkboxeslength = 20;
		}
	    for (var i = 0; i < checkboxeslength; i++) {
	       checkboxes[i].checked = true;
	    }
	}else{
		$("#operation-menu").hide();
		$("#mark-dropdown").hide();
	}
}
function initializeInboxSendEmailListeners(){
	$('#send-email-listener-container').on('click', '#inbox-send-email-close', function(e){
		e.preventDefault();
		$(".ng-show").show();
		$(".ng-hide").html("");
	});
	$('#send-email-listener-container').on('click', '#sendEmailInbox', function(e){
		e.preventDefault();
		if ($(this).attr('disabled'))
			return;
		var $form = $('#emailForm');
		// Is valid
		if (!isValidForm($form))
			return;

		var network_type = $('#attachment-select').find(":selected").attr('network_type');
		// checking email attachment type , email doesn't allow
		// google drive documents as attachments
		if (network_type)
		{
			if (network_type.toUpperCase() === 'GOOGLE')
				return;
		}

		// Saves tinymce content to textarea
		save_content_to_textarea('email-body');

		// serialize form.
		var json = serializeForm("emailForm");
		
		json.from = $(".email").find(":selected").val();
		if ((json.contact_to_ids).join())
			json.to += ((json.to != "") ? "," : "") + (json.contact_to_ids).join();

		if ((json.contact_cc_ids).join())
			json.cc += ((json.cc != "") ? "," : "") + (json.contact_cc_ids).join();

		if ((json.contact_bcc_ids).join())
			json.bcc += ((json.bcc != "") ? "," : "") + (json.contact_bcc_ids).join();

		if (json.to == "" || json.to == null || json.to == undefined)
		{
			// Appends error info to form actions block.
			$save_info = $('<span style="display:inline-block;color:#df382c;">'+_agile_get_translated_val('validation-msgs','required')+'</span>');
			$('#emailForm').find("#to").closest(".controls > div").append($save_info);
			$('#emailForm').find("#to").focus();
			// Hides the error message after 3 seconds
			$save_info.show().delay(3000).hide(1);

			enable_send_button($('#sendEmailInbox'));
			return;
		}

		// Is valid
		if (!isValidForm($('#emailForm')))
			return;

		try
		{
			var emails_length = json.to.split(',').length;
			var MAX_EMAILS_LIMIT = 10;

			if(json.cc)
				emails_length = json.cc.split(',').length + emails_length;

			if(json.bcc)
				emails_length = json.bcc.split(',').length + emails_length;

			if(emails_length > MAX_EMAILS_LIMIT)
			{
				showAlertModal("Maximum limit of sending emails at once exceeded.", undefined, function(){},
					function(){},
					"Alert");
				return;
			}
		}
		catch(err)
		{
			
		}
		
		var that =$(this);

		if(hasScope("EDIT_CONTACT"))
		{
			inboxreplySend(that,json);
		}
		else
		{
			showModalConfirmation(_agile_get_translated_val('contact-details','send-email'), 
				_agile_get_translated_val('campaigns','no-perm-send-emails') + "<br/><br/> " + _agile_get_translated_val('deal-view','do-you-want-to-proceed'),
				function (){
					inboxreplySend(that,json);
				},
				function(){
					return;
				},
				function(){
	
				});
		}

	});
}
function initializeComposeEmailListeners(){
	$('#send-email-listener-container').on('click', '#inbox-send-email-close', function(e){
		e.preventDefault();
		$("#mail-inbox").css({"font-weight":"bold","color":"white","background-color": "#23b7e5"});
		$("#mail-sent").css({"font-weight":"normal","color":"inherit","background-color": "transparent"});
		var url = $('#inbox-email-type-select').attr("data-url");
		url = url.concat("&folder_name=INBOX");
		$("#mails-list").remove();
		$("#mails-list-view").append("<ul class='portlet_body list-group list-group-lg no-radius m-b-none m-t-n-xxs' id='mails-list'></ul>");
		$("#mails-list").css({"max-height":$(window).height()-128,"height":$(window).height()-128, "overflow-y":"scroll", "padding":"0px"});
		$("#mail-details-view").remove();
		$("#mail-detail-view").append("<div class='portlet_body' id='mail-details-view' style='display:none;'></div>");
		renderToMailList(url,1,10);
	});

	$('#send-email-listener-container').on('click', '#sendEmailInbox', function(e){
		e.preventDefault();
		if ($(this).attr('disabled'))
			return;
		var $form = $('#emailForm');
		// Is valid
		if (!isValidForm($form))
			return;

		var network_type = $('#attachment-select').find(":selected").attr('network_type');
		// checking email attachment type , email doesn't allow
		// google drive documents as attachments
		if (network_type)
		{
			if (network_type.toUpperCase() === 'GOOGLE')
				return;
		}

		// Saves tinymce content to textarea
		save_content_to_textarea('email-body');

		// serialize form.
		var json = serializeForm("emailForm");
		
		json.from = $(".email").find(":selected").val();
		if ((json.contact_to_ids).join())
			json.to += ((json.to != "") ? "," : "") + (json.contact_to_ids).join();

		if ((json.contact_cc_ids).join())
			json.cc += ((json.cc != "") ? "," : "") + (json.contact_cc_ids).join();

		if ((json.contact_bcc_ids).join())
			json.bcc += ((json.bcc != "") ? "," : "") + (json.contact_bcc_ids).join();

		if (json.to == "" || json.to == null || json.to == undefined)
		{
			// Appends error info to form actions block.
			$save_info = $('<span style="display:inline-block;color:#df382c;">'+_agile_get_translated_val('validation-msgs','required')+'</span>');
			$('#emailForm').find("#to").closest(".controls > div").append($save_info);
			$('#emailForm').find("#to").focus();
			// Hides the error message after 3 seconds
			$save_info.show().delay(3000).hide(1);

			enable_send_button($('#sendEmailInbox'));
			return;
		}

		// Is valid
		if (!isValidForm($('#emailForm')))
			return;

		try
		{
			var emails_length = json.to.split(',').length;
			var MAX_EMAILS_LIMIT = 10;

			if(json.cc)
				emails_length = json.cc.split(',').length + emails_length;

			if(json.bcc)
				emails_length = json.bcc.split(',').length + emails_length;

			if(emails_length > MAX_EMAILS_LIMIT)
			{
				showAlertModal("Maximum limit of sending emails at once exceeded.", undefined, function(){},
					function(){},
					"Alert");
				return;
			}
		}
		catch(err)
		{
			
		}
		
		var that =$(this);

		if(hasScope("EDIT_CONTACT"))
		{
			inboxEmailSend(that,json);
		}
		else
		{
			showModalConfirmation(_agile_get_translated_val('contact-details','send-email'), 
				_agile_get_translated_val('campaigns','no-perm-send-emails') + "<br/><br/> " + _agile_get_translated_val('deal-view','do-you-want-to-proceed'),
				function (){
					inboxEmailSend(that,json);
				},
				function(){
					return;
				},
				function(){
	
				});
		}

	});
}
