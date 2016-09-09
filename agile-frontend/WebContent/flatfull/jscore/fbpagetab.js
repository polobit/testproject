$(function(){
	
	
});

function initializeFbPageTabListners(el){

	$("#fbPageTab-listners").on('click', '#facebookPageTabSave', function(e){
		e.preventDefault();
		
		// Checks whether all input fields are given
		if (!isValidForm($("#facebookPageTabSettingForm"))){
			return;
		}
		
		var facebookPageId = $("#facebookTabPage").val();
		var facebookPageName = $("#facebookTabPage").find('option:selected').text();
		var AgileFacebookAppId = $("#AgileFacebookAppId").val();
		var selectedFormId = $("#formToUse").val();
		var selectedFormName = $("#formToUse").find('option:selected').text();

		if($('#connectedFormHolder_'+facebookPageId).length != 0) {
			if(!confirm("Are you sure you want to update?")) {
				return;
			}
		}
		
		var formData = "facebookPageID=" + facebookPageId;
		formData += "&facebookPageName=" + facebookPageName;
		formData += "&facebookPageToken=" + $("#facebookTabPage").find('option:selected').attr("data-token");
		formData += "&formID=" + selectedFormId;
		formData += "&formName=" + selectedFormName;
		
		$.ajax({
		    url : "fbpage?action=SAVE_DETAILS",
		    type: "POST",
		    data : formData,
		    success: function(data, textStatus, jqXHR){
		       if(data == "true") {
		    	   $('#formToUse').prop('selectedIndex',0);
		    	   $('#facebookTabPage').prop('selectedIndex',0);

		    	   if($('#fbFormsTable').length == 0) {
		    	   	$('#fbFormsHolder').html('<p class="font-bold">'+_agile_get_translated_val('admin-settings-integrations','current-facebook-pages')+'</p><table class="table" id="fbFormsTable"><tbody></tbody></table><div id="delStatusMessageHolder"></div>');
		    	   }

		    	   var tableRowHtml = '<tr id="connectedFormHolder_'+facebookPageId+'"><td colspan="3" style="padding-left:0px;"><a target="_blank" href="/form.jsp?id='+selectedFormId+'" class="text-info">'+selectedFormName+'</a> '+_agile_get_translated_val('admin-settings-integrations','form-has-been-added-to')+'<br><a target="_blank" href="https://www.facebook.com/pages/null/'+facebookPageId+'?sk=app_'+AgileFacebookAppId+'" class="text-info">'+facebookPageName+'</a> '+_agile_get_translated_val('admin-settings-integrations','page')+'</td><td style="padding-top:18px;"><a href="#" data-pageid="'+facebookPageId+'" id="connectedForm_'+selectedFormId+'" class="deleteFacebookLinkedpage"><i class="icon-trash"></i></a></td></tr>';
		    	   
		    	   var statusMessageNote = _agile_get_translated_val('contacts-view','has-been-added-to');
		    	   if($('#connectedFormHolder_'+facebookPageId).length != 0) {
		    	   	$('#connectedFormHolder_'+facebookPageId).remove();
		    	   	statusMessageNote = _agile_get_translated_val('admin-settings-integrations','updated_in');
		    	   }

		    	   $('#fbFormsTable > tbody:last-child').append(tableRowHtml);

		    	   var sucMessage = _agile_get_translated_val('campaigns','form') + " "+statusMessageNote+" <a target=\"_blank\" class=\"text-info\" href=\"https://www.facebook.com/pages/null/"+facebookPageId+"?sk=app_"+AgileFacebookAppId+"\">"+_agile_get_translated_val('admin-settings-integrations','you-fb-page')+"</a><br>";
		    	   $("#statusMessageHolder").html(sucMessage).show().fadeOut(10000);
		    	   $("#facebookFormAddHolder").hide();
		    	   $("#addFacebookFormLink").show();

		       } else {
		    	   $("#statusMessageHolder").html(_agile_get_translated_val('admin-settings-integrations','try-again'));
		       }
		    },
		    error: function (jqXHR, textStatus, errorThrown){
		    }
		    });		
	});
	
	$("#fbPageTab-listners").on('click', '.deleteFacebookLinkedpage', function(e){
		e.preventDefault();
		var $that = $(this);
		showAlertModal("delete_facebook_linked_page", "confirm", function(){
			var pageId = $that.attr("data-pageid");
			var pageToken = $("#facebookTabPage option[value='"+pageId+"']").attr("data-token");
			if(typeof pageToken == "undefined") {
				setTimeout(function(){
					showAlertModal("delete_facebook_linked_page_error", undefined, function(){
						var fbLoginLink = $("#AddFormLinkFacebookAccount").attr("href");
						if(typeof fbLoginLink != "undefined") {
							window.location.href = fbLoginLink;
						}
					});
				},1000);
			}else{
				var formData = "facebookPageID=" + pageId;
				formData += "&facebookPageToken=" + pageToken;
				
				$.ajax({
				    url : "fbpage?action=DELETE_TAB",
				    type: "POST",
				    data : formData,
				    success: function(data, textStatus, jqXHR){
				       if(data == "true") {
				    	   $("#connectedFormHolder_"+pageId).remove();
				    	   $("#delStatusMessageHolder").html(_agile_get_translated_val('admin-settings-integrations','deleted-success') + "<br>").show().fadeOut(8000);
				       } else {
				    	   $("#delStatusMessageHolder").html(_agile_get_translated_val('admin-settings-integrations','try-again'));
				       }
				    },
				    error: function (jqXHR, textStatus, errorThrown){
				    }
				    });
			}
		});	
	});
	
	$("#fbPageTab-listners").on('change', '#formToUse', function(e){
		var preSelectedFormId = $("#connectedForm_"+$(this).val()).attr("data-pageid");
		if(typeof preSelectedFormId != "undefined") {
			$("#facebookTabPage").val(preSelectedFormId);
		}
	});

	$("#fbPageTab-listners").on('click', '#addFacebookFormLink', function(e){
		e.preventDefault();
		$("#facebookFormAddHolder").show();
		$(this).hide();
	});

	$("#fbPageTab-listners").on('click', '#unlinkFacebookAccount', function(e) {
		e.preventDefault();
		showAlertModal("unlink_facebook", "confirm", function(){
			$.post( "fbpage?action=UNLINK_ACCOUNT", function(data) {
				window.location.reload();
			});
		});
	});
}