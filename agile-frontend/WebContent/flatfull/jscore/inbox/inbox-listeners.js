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
				$("#pagination").show();
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
	if(SHOW_TOTALCOUNT){
		$(".totalcount").text(totalcount);
	}
	$('.collapse').on('show.bs.collapse', function (e) {
		//$("#mails-list").hide();
		$("#compose").hide();
		//$("#mail-details-view").show();
	    $('.collapse').not(e.target).removeClass('in').attr("aria-expanded","false");
	});
	$('.collapse').on('hide.bs.collapse', function (e) {
	  e.preventDefault();
	})
	$(document).on('click','.back-to-inbox',function(e) {
		$("#mails-list").show();
		$("#mail-details-view").hide();
		$("#compose").hide();
		$(".inbox-reply-view").html("");
		$(".ng-show").show();
	});
	$("div.unread").css({"font-weight":"bold"});

	/*var color=['b-l-info','b-l-primary','b-l-warning','b-l-success',''];
	var j =0;
    $('#mails-list-view ul li').each(function(i){
        $(this).addClass(color[j]);
        if(j == 4)
        	j = 0
        else
        	j++
    });*/
    $('.read, .unread').unbind('click').click(function(e) {
	    var dataVal = $(this).attr("data-val");
		var from_email = $('#inbox-email-type-select').attr("from_email");
		var server = $("#inbox-email-type-select").attr("data-server");
		var url ="";

		if(server == "google")
			url = "core/api/social-prefs/getContent?";
		if(server == "imap")
			url ="core/api/imap/getContent?";
		if(server == "exchange")
				url ="core/api/office/getContent";

		var folder_type = $('#inbox-email-type-select').attr("folder-type");
		if(folder_type == "inbox")
			folder_name = "INBOX";
		else if(folder_type == "sent")
			folder_name = "Sent";
		else if(folder_type == "draft")
			folder_name = "Draft";
		else if(folder_type == "trash")
			folder_name = "Trash";

   		if(!$(this).hasClass( "pending" ) ) {
   			$(this).addClass("pending");
			if(server == "exchange"){
				getExchangeContent(url,from_email,folder_name,dataVal);
			}else{
				var getfoldername = $(this).attr("data-folder");
				if(getfoldername)
					folder_name = getfoldername;

				url = url+"from_email="+from_email+"&folder_name="+folder_name+"&flag=content&messageid="+dataVal;
				getContent(url,dataVal);
			}
		}
		/*var model = globalMailCollectionInstance.get(dataVal);
		model.set({flags: 'read'});*/
		$(this).css({"font-weight":"normal"});
		$(this).removeClass("unread");
		$(this).addClass("read");
	});
	$(".delete").unbind().click(function() {
		var dataVal = $(this).attr("data-id");
		var msg_ele = "";
		var folder_type = $('#inbox-email-type-select').attr("folder-type");
		if(folder_type == "trash"){
			msg_ele = "delete_trash_mail"
		}else{
			msg_ele = "delete_mail"
		}
		showAlertModal(msg_ele, "confirm", function(){
			
			var from_email = $('#inbox-email-type-select').attr("from_email");
			var server = $("#inbox-email-type-select").attr("data-server");
			var url ="";
			var folder_name = "";

			if(server == "agile")
				url = "core/api/emails/setFlags?";
			if(server == "google")
				url = "core/api/social-prefs/setFlags?";
			if(server == "imap")
				url ="core/api/imap/setFlags?";
			if(server == "exchange")
					url ="core/api/office/setFlags";

			
			if(folder_type == "inbox")
				folder_name = "INBOX";
			else if(folder_type == "sent")
				folder_name = "Sent";
			else if(folder_type == "draft")
				folder_name = "Draft";
			else if(folder_type == "trash")
				folder_name = "Trash";

			if(server == "exchange"){
				setExchangeFlag(url,from_email,folder_name,'DELETED',dataVal);
			}else{
				if(server != "agile"){
					url = url+"from_email="+from_email+"&folder_name="+folder_name+"&flag=DELETED&messageid="+dataVal;
				}else{
					url = url+"folder_name="+folder_name+"&messageid="+dataVal;
				}
				setSeenFlag(url);
			}

			var curr_val = $(".inti-val").text();
			var offset = curr_val.split(" - ")[0].trim();
			offset = parseInt(offset)+10;
			var page_size = curr_val.split(" - ")[1].trim();
			page_size = parseInt(page_size)+1;

			url = $('#inbox-email-type-select').attr("data-url");
			url = url.concat("&folder_name="+folder_name);
			
			var dataVal_new = dataVal.replace(/[^\w\s]/gi, '-');
			var tot_val = $(".totalcount").text();
			var remain_count = parseInt(tot_val)-1;
			if(remain_count <= 10){
				$(".inti-val").text("1 - "+remain_count);
			}
			if(remain_count == 0){
				$("#pagination").hide();
				displayNoEmailTemplate();
			}
			$(".totalcount").text(parseInt(tot_val)-1);
			$("#li"+dataVal_new).remove();
			$("#"+dataVal_new).remove();
			globalMailCollectionInstance.remove(dataVal); //.get(dataVal);
			if(server != "exchange"){
				SHOW_TOTALCOUNT = false;
				if(tot_val > 10){
					renderToMailList(url,offset,page_size);
				}
			}
			$("#mails-list").show();
			$("#mail-details-view").hide();
			$(".inbox-reply-view").html("");
			$(".ng-show").show();
			$('.inbox-all').prop('checked', false);
		},"Delete Mail");
	});
	$('input[name="mailcheck"]').on('change', function(e) {
		var len = $('input[name="mailcheck"]:checked').length
		if(len == 0){
			$('.inbox-all').prop('checked', false);
			$("#operation-menu").hide();
			$("#mark-dropdown").hide();
		}else{
			if(len < 10){
				$('.inbox-all').prop('checked', false);
			}else{
				$('.inbox-all').prop('checked', true);
			}
			$("#operation-menu").show();
			$("#mark-dropdown").show();
		}
	});
	$(".showtoaddress").unbind().click(function() {
		if($(".toaddress").is(":visible")){
			$(".toaddress").hide();
		}else{
			$(".toaddress").show();
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
	var server = $("#inbox-email-type-select").attr("data-server");
	var folder_type_draft = $("#inbox-email-type-select").attr("folder-type");
	if(server != "agile"){
		$.ajax({ 
			url :url,
			success : function(data){
				if(folder_type_draft == 'draft'){
					composeView(data);
					//displayReplyView(data);
				}else{
					dataVal = dataVal.replace(/[^\w\s]/gi, '-');
					$("#flag"+dataVal).removeClass("pending");
					var html = "";
					getTemplate("mail-message", data, undefined, function(template_ui) {
						if( !template_ui )	return;

						html = template_ui;
					}, '#message'+dataVal);
					$("#message"+dataVal).html(html);
			        $("#mails-list").hide();
			        $("#mail-details-view").show();
			        $(".toaddress").hide();
			        $("#message"+dataVal).find("a").attr("target", "_blank");
			        $("#message"+dataVal).find("div").removeClass("column");
			        $("#message"+dataVal).find(".column").removeClass("column");
			        $("#message"+dataVal).find("table").removeClass("container");
			        $("#message"+dataVal).find("a").css({"color": "#15c","text-decoration":"underline"});
			        $("#message"+dataVal).css({"background-color":"white"});
		    	}
			} 
		});
	}else{
		$.ajax({ 
			url :"core/api/emails/setFlags?flag=READ&messageid="+dataVal,
			success : function(data){
				
		    }
		});
		$("#flag"+dataVal).removeClass("pending");
		dataVal = dataVal.replace(/[^\w\s]/gi, '-');
		$("#mails-list").hide();
        $("#mail-details-view").show();
	}
}

function getExchangeContent(url,from_email,folder_name,messageid){
	var requestesData = {"from_email":from_email,"folder_name":folder_name,"flag":"content","messageid":messageid};
	$.ajax({ 
		url :url,
		method:"POST",
		data:requestesData,
		success : function(data){
			$("#flag"+dataVal).removeClass("pending");
			var dataVal = messageid.replace(/[^\w\s]/gi, '-');
			var html = "";
			getTemplate("mail-message", data, undefined, function(template_ui) {
				if( !template_ui )	return;

				html = template_ui;
			}, '#message'+dataVal);
			
	        $("#message"+dataVal).html(html);
	        $("#mails-list").hide();
	        $("#mail-details-view").show();
	        $("#message"+dataVal).find("a").attr("target", "_blank");
	        $("#message"+dataVal).find("div").removeClass("column");
	        $("#message"+dataVal).find(".column").removeClass("column");
		    $("#message"+dataVal).find("table").removeClass("container");
	        $("#message"+dataVal).find("a").css({"color": "#15c","text-decoration":"underline"});
	        $("#message"+dataVal).css({"background-color":"white"});
		} 
	});
}
function setExchangeFlag(url,from_email,folder_name,flag,messageid){
	var requestesData = {"from_email":from_email,"folder_name":folder_name,"flag":flag,"messageid":messageid};
	$.ajax({ 
		url :url,
		method:"POST",
		data:requestesData,
		success : function(data){
			if(flag == "DELETED"){
				var curr_val = $(".inti-val").text();
				var offset = curr_val.split(" - ")[0].trim();
				offset = parseInt(offset)+10;
				var page_size = curr_val.split(" - ")[1].trim();
				page_size = parseInt(page_size)+1;
				var folder_type = $('#inbox-email-type-select').attr("folder-type");
				if(folder_type == "inbox")
					folder_name = "INBOX";
				else if(folder_type == "sent")
					folder_name = "Sent";
				else if(folder_type == "draft")
					folder_name = "Draft";
				else if(folder_type == "trash")
					folder_name = "Trash";
		
				url = $('#inbox-email-type-select').attr("data-url");
				url = url.concat("&folder_name="+folder_name);
				SHOW_TOTALCOUNT = false;
				renderToMailList(url,offset,page_size);
			}
		} 
	});
}
var idcol = []
function initializeInboxListeners(){

	/*$('.inbox-menu li a').click(function(e) {
        $('.inbox-menu li').removeClass('active');

        var $parent = $(this).parent();
        if (!$parent.hasClass('active')) {
            $parent.addClass('active');
        }
        e.preventDefault();
    });*/

	$('#inbox-listners').on('click', '#mail-inbox', function(e){
		e.preventDefault();
		$("#search-mail").val("");
		var server = $("#inbox-email-type-select").attr("data-server");
		$('#inbox-email-type-select').attr("folder-type","inbox");
		var url = $('#inbox-email-type-select').attr("data-url");
		url = url.concat("&folder_name=INBOX");
		globalMailCollectionInstance = new globalMailCollection();
		helperFunction();
		SHOW_TOTALCOUNT = true;
		if(server != "agile"){
			if(!$(this).hasClass( "pending" ) ) {
	   			$(this).addClass("pending");
	   			$('.folder-link').bind('click', false);
				renderToMailList(url,1,10,$(e.currentTarget).attr("id"));
			}
		}else{
			displayNoEmailTemplate();
		}
		$(".ng-scope").removeClass("active");
		$(this).parent("li").addClass("active");
	});

	$('#inbox-listners').on('click', '#mail-sent', function(e){
		e.preventDefault();
		$("#search-mail").val("");
		$('#inbox-email-type-select').attr("folder-type","sent");
		var url = $('#inbox-email-type-select').attr("data-url");
		url = url.concat("&folder_name=Sent");
		globalMailCollectionInstance = new globalMailCollection();
		helperFunction();
		SHOW_TOTALCOUNT = true;
		if(!$(this).hasClass( "pending" ) ) {
   			$(this).addClass("pending");
   			$('.folder-link').bind('click', false);
			renderToMailList(url,1,10,$(e.currentTarget).attr("id"));
		}
		$(".ng-scope").removeClass("active");
		$(this).parent("li").addClass("active");
	});
	$('#inbox-listners').on('click', '#mail-draft', function(e){
		e.preventDefault();
		$("#search-mail").val("");
		var server = $("#inbox-email-type-select").attr("data-server");
		$('#inbox-email-type-select').attr("folder-type","draft");
		var url = $('#inbox-email-type-select').attr("data-url");
		url = url.concat("&folder_name=Draft");
		globalMailCollectionInstance = new globalMailCollection();
		helperFunction();
		SHOW_TOTALCOUNT = true;
		if(server != "agile"){
			if(!$(this).hasClass( "pending" ) ) {
	   			$(this).addClass("pending");
	   			$('.folder-link').bind('click', false);
				renderToMailList(url,1,10,$(e.currentTarget).attr("id"));
			}
		}else{
			displayNoEmailTemplate();
		}
		$(".ng-scope").removeClass("active");
		$(this).parent("li").addClass("active");
	});
	$('#inbox-listners').on('click', '#mail-trash', function(e){
		e.preventDefault();
		$("#search-mail").val("");
		var server = $("#inbox-email-type-select").attr("data-server");
		$('#inbox-email-type-select').attr("folder-type","trash");
		var url = $('#inbox-email-type-select').attr("data-url");
		url = url.concat("&folder_name=Trash");
		globalMailCollectionInstance = new globalMailCollection();
		helperFunction();
		SHOW_TOTALCOUNT = true;
		//if(server != "agile")
		if(!$(this).hasClass( "pending" )) {
   			$(this).addClass("pending");
   			$('.folder-link').bind('click', false);
			renderToMailList(url,1,10,$(e.currentTarget).attr("id"));
		}
		//else
			//displayNoEmailTemplate();
		$(".ng-scope").removeClass("active");
		$(this).parent("li").addClass("active");
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
		globalMailCollectionInstance = new globalMailCollection();
		searchEmails(1,10);
	});
	function searchEmails(offset,count){
		var search_val = document.getElementById('search-mail').value;
		if(search_val){
			$(".ng-scope").removeClass("active");
			var from_email = $('#inbox-email-type-select').text();
			var server = $("#inbox-email-type-select").attr("data-server");
			var url ="";

			
			if(server == "google")
				url = "core/api/social-prefs/search-google-emails?";
			if(server == "imap")
				url ="core/api/imap/search-imap-emails?";
			if(server == "exchange")
				url ="core/api/office/search-office-emails?";

			url = url+"from_email="+from_email+"&search_content="+search_val+"&folder_name=INBOX";
			helperFunction();
			renderToMailList(url,offset,count);
		}
	}
	//$('#inbox-listners').on('click', '.button-check', function(e){
	$(".button-check").unbind().click(function(e) {
		var $ele = $(e.currentTarget).parents("div").parent();
		if($ele.hasClass("open")){
			$ele.removeClass("open");
		}
		$ele.toggleClass("open");
		if($ele.find("input").is(":checked")){
			$ele.find("input").prop("checked", false);
			$(".mark-read").hide();
			$(".mark-unread").hide();
			$('.mail_check').prop('checked', true);
			deSelectCheckBoxes("mail_check");
		}else{
			$ele.find("input").prop("checked", true);
			$(".mark-read").show();
			$(".mark-unread").show();
			$('.mail_check').prop('checked', false);
			selectCheckBoxes("mail_check");
		}
	});
	$(".select-mails").unbind().click(function(e) {
		var dataVal = $(this).attr("data-val");
		if(dataVal == "All"){
			$(".mark-read").show();
			$(".mark-unread").show();
			$('.inbox-all').prop('checked', true);
			$('.mail_check').prop('checked', false);
			selectCheckBoxes("mail_check")
		}else if(dataVal == "None"){
			$("#operation-menu").hide();
			$("#mark-dropdown").hide();
			$('.inbox-all').prop('checked', false);
			$('.mail_check').prop('checked', false);
		}else if(dataVal == "Read"){
			$(".mark-read").hide();
			$(".mark-unread").show();
			$('.inbox-all').prop('checked', false);
			$('.mail-unread').prop('checked', false);
			selectCheckBoxes("mail-read")
		}else if(dataVal == "Unread"){
			$(".mark-unread").hide();
			$(".mark-read").show();
			$('.inbox-all').prop('checked', false);
			$('.mail-read').prop('checked', false);
			selectCheckBoxes("mail-unread")
		}
	});
	$(".bulk-delete").off("click");
	$(".bulk-delete").bind().click(function(e) {
		idcol = [];
		var msg_ele = "";
		var folder_type = $('#inbox-email-type-select').attr("folder-type");
		if(folder_type == "trash"){
			msg_ele = "delete_trash_mail"
		}else{
			msg_ele = "delete_mail"
		}
		showAlertModal(msg_ele, "confirm", function(){
			var urlval = returnUrl();
			if(urlval){
				urlval = urlval+"&flag=DELETED&folder_name=INBOX";
				var server_type = $("#inbox-email-type-select").attr("data-server");
				if(server_type == "exchange"){
					var url_exchange = "core/api/office/setFlags";
					var folder_name_exchange = "";
					
					if(folder_type == "inbox")
						folder_name_exchange = "INBOX";
					else if(folder_type == "sent")
						folder_name_exchange = "Sent";
					else if(folder_type == "draft")
						folder_name_exchange = "Draft";
					else if(folder_type == "trash")
						folder_name_exchange = "Trash";

					var meesageids_exchange  = null;
			        $.each($("input[name='mailcheck']:checked"), function(){    
				        if(meesageids_exchange == null){
				            meesageids_exchange = $(this).val();
				        }else{
				        	meesageids_exchange = meesageids_exchange+','+$(this).val();
				        }
			        });
					var from_email_exchange = $('#inbox-email-type-select').attr("from_email");
					setExchangeFlag(url_exchange,from_email_exchange,folder_name_exchange,'DELETED',meesageids_exchange);
				}else{
					setSeenFlag(urlval);
				}
				for(var i=0;i<idcol.length;i++){
					var dataVal = idcol[i].replace(/[^\w\s]/gi, '-');
					$("#li"+dataVal).remove();
					$("#"+dataVal).remove();
					globalMailCollectionInstance.remove(idcol[i]);
				}
				
				var tot_val = $(".totalcount").text();
				var remain_count = parseInt(tot_val)-idcol.length;
				if(remain_count <= 10){
					$(".inti-val").text("1 - "+remain_count);
				}
				if(remain_count == 0){
					$("#pagination").hide();
					displayNoEmailTemplate();
				}
				$(".totalcount").text(parseInt(tot_val)-idcol.length);
				$("#operation-menu").hide();
				$("#mark-dropdown").hide();
				$('.inbox-all').prop('checked', false);
				var updateCount = parseInt(tot_val)-idcol.length;
				for(var i=0;i<globalMailCollectionInstance.length;i++){
					var model = globalMailCollectionInstance.at(globalMailCollectionInstance.length-1-i);
					model.set({count: updateCount});
					i+=9;
				}
				var curr_val = $(".inti-val").text();
				var offset = curr_val.split(" - ")[0].trim();
				offset = parseInt(offset)+10;
				var page_size = curr_val.split(" - ")[1].trim();
				page_size = parseInt(page_size)+idcol.length;

				var url = $('#inbox-email-type-select').attr("data-url");
				
				if(folder_type == "inbox")
					url = url.concat("&folder_name=INBOX");
				else if(folder_type == "sent")
						url = url.concat("&folder_name=Sent");
				else if(folder_type == "draft")
						url = url.concat("&folder_name=Draft");
				else if(folder_type == "trash")
						url = url.concat("&folder_name=Trash");

				if(server_type != "exchange"){
					SHOW_TOTALCOUNT = false;
					if(tot_val > 10){
						renderToMailList(url,offset,page_size);
					}
				}
			}	
		});	
	});

	$(".mark-read").unbind().click(function(e) {
		idcol = [];
		var urlval = returnUrl();
		if(urlval){
			urlval = urlval+"&flag=SEEN";
			var server_type = $("#inbox-email-type-select").attr("data-server");
			if(server_type == "exchange"){
				var url_exchange = "core/api/office/setFlags";
				var folder_name_exchange = "";
				var folder_type_exchange = $('#inbox-email-type-select').attr("folder-type");
				if(folder_type_exchange == "inbox")
					folder_name_exchange = "INBOX";
				else if(folder_type_exchange == "sent")
					folder_name_exchange = "Sent";
				else if(folder_type_exchange == "draft")
					folder_name_exchange = "Draft";
				else if(folder_type_exchange == "trash")
					folder_name_exchange = "Trash";

				var meesageids_exchange  = null;
		        $.each($("input[name='mailcheck']:checked"), function(){    
			        if(meesageids_exchange == null){
			            meesageids_exchange = $(this).val();
			        }else{
			        	meesageids_exchange = meesageids_exchange+','+$(this).val();
			        }
		        });
				var from_email_exchange = $('#inbox-email-type-select').attr("from_email");
				setExchangeFlag(url_exchange,from_email_exchange,folder_name_exchange,'SEEN',meesageids_exchange);
			}else{
				setSeenFlag(urlval);
			}
			for(var i=0;i<idcol.length;i++){
				var model = globalMailCollectionInstance.get(idcol[i]);
				model.set({flags: 'read'});
				
				var dataVal = idcol[i].replace(/[^\w\s]/gi, '-');
				$("#flag"+dataVal).removeClass("unread");
				$("#flag"+dataVal).addClass("read");
				$(".read").css({"font-weight":"normal"});
				$("#check-"+dataVal).removeClass("mail-unread");
				$("#check-"+dataVal).addClass("mail-read");
			}
		}		
	});

	$(".mark-unread").unbind().click(function(e) {
		idcol = [];
		var urlval = returnUrl();
		if(urlval){
			urlval = urlval+"&flag=UNREAD";
			var server_type = $("#inbox-email-type-select").attr("data-server");
			if(server_type == "exchange"){
				var url_exchange = "core/api/office/setFlags";
				var folder_name_exchange = "";
				var folder_type_exchange = $('#inbox-email-type-select').attr("folder-type");
				if(folder_type_exchange == "inbox")
					folder_name_exchange = "INBOX";
				else if(folder_type_exchange == "sent")
					folder_name_exchange = "Sent";
				else if(folder_type_exchange == "draft")
					folder_name_exchange = "Draft";
				else if(folder_type_exchange == "trash")
					folder_name_exchange = "Trash";

				var meesageids_exchange  = null;
		        $.each($("input[name='mailcheck']:checked"), function(){    
			        if(meesageids_exchange == null){
			            meesageids_exchange = $(this).val();
			        }else{
			        	meesageids_exchange = meesageids_exchange+','+$(this).val();
			        }
		        });
				var from_email_exchange = $('#inbox-email-type-select').attr("from_email");
				setExchangeFlag(url_exchange,from_email_exchange,folder_name_exchange,'UNREAD',meesageids_exchange);
			}else{
				setSeenFlag(urlval);
			}
			for(var i=0;i<idcol.length;i++){
				var model = globalMailCollectionInstance.get(idcol[i]);
				model.set({flags: 'unread'});

				var dataVal = idcol[i].replace(/[^\w\s]/gi, '-');
				$("#flag"+dataVal).removeClass("read");
				$("#flag"+dataVal).addClass("unread");
				$(".unread").css({"font-weight":"bold"});
				$("#check-"+dataVal).removeClass("mail-read");
				$("#check-"+dataVal).addClass("mail-unread");
			}
		}		
	});

	$(".previous").unbind().click(function(e) {
		$("#mails-list").show();
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

			$("#mails-list").html(html);
			$(".get-counts").remove();
			$("#mails-list").append("<li style='display:none' class='get-counts' data-cursor='"+offset+"' data-count='"+tot_val+"'></li>");

			var html_view = "";
			getTemplate("mail-view", globalMailCollectionInstance.toJSON().slice(offset-1,page_size), undefined, function(template_ui) {
				if( !template_ui )	return;

				html_view = template_ui;
			}, '#mail-details-view');
			$("#mail-details-view").html(html_view);

			inboxFlagListners();

		}else{
			SHOW_TOTALCOUNT = true;
			helperFunction();
			var search_val = document.getElementById('search-mail').value;
			if(search_val){
				searchEmails(offset,page_size)
			}else{
				renderToMailList(url,offset,page_size);
			}
		}
		$('.inbox-all').prop('checked', false);
	});

	$(".next").unbind().click(function(e) {
		$(".next").prop("disabled",true);
		$("#mails-list").show();
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

			$("#mails-list").html(html);
			$(".get-counts").remove();
			$("#mails-list").append("<li style='display:none' class='get-counts' data-cursor='"+offset+"' data-count='"+tot_val+"'></li>");

			var html_view = "";
			getTemplate("mail-view", globalMailCollectionInstance.toJSON().slice(offset-1,page_size), undefined, function(template_ui) {
				if( !template_ui )	return;

				html_view = template_ui;
			}, '#mail-details-view');
			$("#mail-details-view").html(html_view);

			inboxFlagListners();
		}else{
			helperFunction();
			SHOW_TOTALCOUNT = true;
			var search_val = document.getElementById('search-mail').value;
			if(search_val){
				searchEmails(offset,page_size)
			}else{
				renderToMailList(url,offset,page_size);
			}
		}
		$('.inbox-all').prop('checked', false);

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

			if(server == "agile")
				url = "core/api/emails/setFlags?";
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

			if(server != "agile"){
				url = url+"from_email="+from_email+"&folder_name="+folder_name+"&messageid="+meesageids;
			}else{
				url = url+"folder_name="+folder_name+"&messageid="+meesageids;
			}
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
	$("#mails-list-view").append("<ul class='portlet_body portlet_width list-group list-group-lg no-radius m-b-none m-t-n-xxs' id='mails-list'></ul>");
	$("#mails-list").css({"max-height":$(window).height()-128,"height":$(window).height()-128, "overflow-y":"scroll", "padding":"0px"});
	$("#mail-details-view").remove();
	$("#mail-detail-view").append("<div class='portlet_body portlet_width' id='mail-details-view' style='display:none;'></div>");
}
function deSelectCheckBoxes(classname){
	if($('.'+classname).is(':visible')) {
		$("#operation-menu").hide();
		$("#mark-dropdown").hide();
	}
	checkboxes = document.getElementsByClassName(classname)
	var checkboxeslength = checkboxes.length;
	if(checkboxeslength > 0){
		if(checkboxeslength > 20){
			checkboxeslength = 20;
		}
	    for (var i = 0; i < checkboxeslength; i++) {
	       checkboxes[i].checked = false;
	    }
	}else{
		$("#operation-menu").hide();
		$("#mark-dropdown").hide();
	}
}
