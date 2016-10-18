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
	
	$('.collapse').on('show.bs.collapse', function (e) {
		//$("#mails-list").hide();
		$("#compose").hide();
		//$("#mail-details-view").show();
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

	var color=['b-l-info','b-l-primary','b-l-warning','b-l-success',''];
	var j =0;
    $('#mails-list-view ul li').each(function(i){
        $(this).addClass(color[j]);
        if(j == 4)
        	j = 0
        else
        	j++
    });
    $('.read, .unread').unbind('click').click(function() {
	    var dataVal = $(this).attr("data-val");
		var from_email = $('#inbox-email-type-select').attr("from_email");
		var server = $("#inbox-email-type-select").attr("data-server");
		var url ="";

		if(server == "google")
			url = "core/api/social-prefs/getContent?";
		if(server == "imap")
			url ="core/api/imap/getContent?";
		if(server == "exchange")
				url ="core/api/office/getContent?";

		var folder_type = $('#inbox-email-type-select').attr("folder-type");
		if(folder_type == "inbox")
			folder_name = "INBOX";
		else if(folder_type == "sent")
			folder_name = "Sent";
		else if(folder_type == "draft")
			folder_name = "Draft";
		else if(folder_type == "trash")
			folder_name = "Trash";

		url = url+"from_email="+from_email+"&folder_name="+folder_name+"&flag=content&messageid="+dataVal,
		getContent(url,dataVal);
		$(this).css({"font-weight":"normal"});
		$(this).removeClass("unread");
		$(this).addClass("read");
	});
	$(".delete").unbind().click(function() {
		var dataVal = $(this).attr("data-id");
		var from_email = $('#inbox-email-type-select').attr("from_email");
		var server = $("#inbox-email-type-select").attr("data-server");
		var url ="";
		var folder_name = "";

		if(server == "google")
			url = "core/api/social-prefs/setFlags?";
		if(server == "imap")
			url ="core/api/imap/setFlags?";
		if(server == "exchange")
				url ="core/api/office/setFlags?";

		var folder_type = $('#inbox-email-type-select').attr("folder-type");
		if(folder_type == "inbox")
			folder_name = "INBOX";
		else if(folder_type == "sent")
			folder_name = "Sent";
		else if(folder_type == "draft")
			folder_name = "Draft";
		else if(folder_type == "trash")
			folder_name = "Trash";

		url = url+"from_email="+from_email+"&folder_name="+folder_name+"&flag=DELETED&messageid="+dataVal,
		setSeenFlag(url);

		var curr_val = $(".inti-val").text();
		var offset = curr_val.split(" - ")[0].trim();
		offset = parseInt(offset)+10;
		var page_size = curr_val.split(" - ")[1].trim();
		page_size = parseInt(page_size)+1;

		url = $('#inbox-email-type-select').attr("data-url");
		url = url.concat("&folder_name="+folder_name);
		dataVal = dataVal.replace(/[^\w\s]/gi, '-');
		var tot_val = $(".totalcount").text();
		$(".totalcount").text(parseInt(tot_val)-1);
		$("#li"+dataVal).remove();
		$("#"+dataVal).remove();
		globalMailCollectionInstance.remove(dataVal); //.get(dataVal);
		renderToMailList(url,offset,page_size);
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
function getContent(url,dataVal){
	dataVal = dataVal.replace(/[^\w\s]/gi, '-');
	$.ajax({ 
		url :url,
		contentType: "application/json; charset=utf-8",
		success : function(data){
			var html = "";
			getTemplate("mail-message", data, undefined, function(template_ui) {
				if( !template_ui )	return;

				html = template_ui;
			}, '#message'+dataVal);
			/*var source = $('#mail-message-template').html();
	        var template = Handlebars.compile(source);
	        var html = template(data);*/
	        $("#message"+dataVal).html(html);
	        $("#mails-list").hide();
	        $("#mail-details-view").show();
		} 
	});
}
var idcol = []
function initializeInboxListeners(){

	$('.inbox-menu li a').click(function(e) {
        $('.inbox-menu li').removeClass('active');

        var $parent = $(this).parent();
        if (!$parent.hasClass('active')) {
            $parent.addClass('active');
        }
        e.preventDefault();
    });

	$('#inbox-listners').on('click', '#mail-inbox', function(e){
		e.preventDefault();
		
		$('#inbox-email-type-select').attr("folder-type","inbox");
		var url = $('#inbox-email-type-select').attr("data-url");
		url = url.concat("&folder_name=INBOX");
		globalMailCollectionInstance = new globalMailCollection();
		helperFunction();
		renderToMailList(url,1,10);
	});

	$('#inbox-listners').on('click', '#mail-sent', function(e){
		e.preventDefault();
		
		$('#inbox-email-type-select').attr("folder-type","sent");
		var url = $('#inbox-email-type-select').attr("data-url");
		url = url.concat("&folder_name=Sent");
		globalMailCollectionInstance = new globalMailCollection();
		helperFunction();
		renderToMailList(url,1,10);
	});
	$('#inbox-listners').on('click', '#mail-draft', function(e){
		e.preventDefault();
		
		$('#inbox-email-type-select').attr("folder-type","draft");
		var url = $('#inbox-email-type-select').attr("data-url");
		url = url.concat("&folder_name=Draft");
		globalMailCollectionInstance = new globalMailCollection();
		helperFunction();
		renderToMailList(url,1,10);
	});
	$('#inbox-listners').on('click', '#mail-trash', function(e){
		e.preventDefault();
		
		$('#inbox-email-type-select').attr("folder-type","trash");
		var url = $('#inbox-email-type-select').attr("data-url");
		url = url.concat("&folder_name=Trash");
		globalMailCollectionInstance = new globalMailCollection();
		helperFunction();
		renderToMailList(url,1,10);
	});
	$('#inbox-listners').on('click', '.mail-compose', function(e){
		e.preventDefault();
		helperFunction();
		$("#pagination").hide();
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
			if(server == "exchange")
				url ="core/api/office/search-office-emails?";

			url = url+"from_email="+from_email+"&search_content="+search_val;
			helperFunction();
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
				globalMailCollectionInstance.remove(idcol[i]);
			}
			var tot_val = $(".totalcount").text();
			$(".totalcount").text(parseInt(tot_val)-idcol.length);
			$("#operation-menu").hide();
			$("#mark-dropdown").hide();


			var curr_val = $(".inti-val").text();
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
			else if(folder_type == "draft")
					url = url.concat("&folder_name=Draft");
			else if(folder_type == "trash")
					url = url.concat("&folder_name=Trash");

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
		if(offset == page_size){
			page_size = page_size+9;
		}
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

		if(globalMailCollectionInstance.length > 1){
			if(page_size-offset < 9){
				page_size = offset+9;
			}
			$(".inti-val").text(offset+" - "+page_size);
			var html = "";
			getTemplate("mail", globalMailCollectionInstance.toJSON().slice(offset-1,page_size), undefined, function(template_ui) {
				if( !template_ui )	return;

				html = template_ui;
			}, '#mails-list');

			/*var source = $('#mail-template').html();
	        var template = Handlebars.compile(source);
			var html = template(globalMailCollectionInstance.toJSON().slice(offset-1,page_size));*/
			$("#mails-list").html(html);
			$("#mails-list").append("<li style='display:none' class='get-counts' data-cursor='"+offset+"' data-count='"+tot_val+"'></li>");

			var html_view = "";
			getTemplate("mail-message", globalMailCollectionInstance.toJSON().slice(offset-1,page_size), undefined, function(template_ui) {
				if( !template_ui )	return;

				html_view = template_ui;
			}, '#mail-details-view');

			/*var source_view = $('#mail-view-template').html();
	        var template_view = Handlebars.compile(source_view);
			var html_view = template_view(globalMailCollectionInstance.toJSON().slice(offset-1,page_size));*/
			$("#mail-details-view").html(html_view);

			inboxFlagListners();

		}else{
			helperFunction();
			renderToMailList(url,offset,page_size);
		}
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

		if(page_size > tot_val){
			page_size = tot_val;
		}
		if(globalMailCollectionInstance.length > page_size ||  globalMailCollectionInstance.length == page_size ){
			$(".inti-val").text(offset+" - "+page_size);
			var html = "";
			getTemplate("mail", globalMailCollectionInstance.toJSON().slice(offset-1,page_size), undefined, function(template_ui) {
				if( !template_ui )	return;

				html = template_ui;
			}, '#mails-list');
			/*var source = $('#mail-template').html();
	        var template = Handlebars.compile(source);
			var html = template(globalMailCollectionInstance.toJSON().slice(offset-1,page_size));*/
			$("#mails-list").html(html);
			$("#mails-list").append("<li style='display:none' class='get-counts' data-cursor='"+offset+"' data-count='"+tot_val+"'></li>");

			var html_view = "";
			getTemplate("mail-view", globalMailCollectionInstance.toJSON().slice(offset-1,page_size), undefined, function(template_ui) {
				if( !template_ui )	return;

				html_view = template_ui;
			}, '#mail-details-view');
			/*var source_view = $('#mail-view-template').html();
	        var template_view = Handlebars.compile(source_view);
			var html_view = template_view(globalMailCollectionInstance.toJSON().slice(offset-1,page_size));*/
			$("#mail-details-view").html(html_view);

			inboxFlagListners();
		}else{
			helperFunction();
			renderToMailList(url,offset,page_size);
		}

	});
	$(".message_sent_strip_close").unbind().click(function(e) {
		$("#message_sent_alert_info").hide();
	});
	
}
function returnUrl(){
	var url = "";
	var folder_name = "";
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
			if(server == "exchange")
				url ="core/api/office/setFlags?";

			var folder_type = $('#inbox-email-type-select').attr("folder-type");
			if(folder_type == "inbox")
				folder_name = "INBOX";
			else if(folder_type == "sent")
				folder_name = "Sent";
			else if(folder_type == "draft")
				folder_name = "Draft";
			else if(folder_type == "trash")
				folder_name = "Trash";

			url = url+"from_email="+from_email+"&folder_name="+folder_name+"&messageid="+meesageids;
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
		$('.inbox-menu li').removeClass('active');
	    $(".inbox-menu li").first().addClass("active");
		var url = $('#inbox-email-type-select').attr("data-url");
		url = url.concat("&folder_name=INBOX");
		$('#inbox-email-type-select').attr("folder-type","inbox");
		helperFunction();
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
function helperFunction(){
	$("#mails-list").remove();
	$("#mails-list-view").append("<ul class='portlet_body list-group list-group-lg no-radius m-b-none m-t-n-xxs' id='mails-list'></ul>");
	$("#mails-list").css({"max-height":$(window).height()-128,"height":$(window).height()-128, "overflow-y":"scroll", "padding":"0px"});
	$("#mail-details-view").remove();
	$("#mail-detail-view").append("<div class='portlet_body' id='mail-details-view' style='display:none;'></div>");
}

