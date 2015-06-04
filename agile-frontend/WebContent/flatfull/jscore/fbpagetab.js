$(function(){
	$('#facebookPageTabSave').die().live('click', function(e){
		e.preventDefault();
		
		// Checks whether all input fields are given
		if (!isValidForm($("#facebookPageTabSettingForm"))){
			return;
		}
		
		var facebookPageId = $("#facebookTabPage").val();
		var AgileFacebookAppId = $("#AgileFacebookAppId").val();
		
		var formData = "facebookPageID=" + facebookPageId;
		formData += "&facebookPageName=" + $("#facebookTabPage").find('option:selected').text();
		formData += "&facebookPageToken=" + $("#facebookTabPage").find('option:selected').attr("data-token");
		formData += "&formID=" + $("#formToUse").val();
		formData += "&formName=" + $("#formToUse").find('option:selected').text();
		
		$.ajax({
		    url : "fbpage?action=SAVE_DETAILS",
		    type: "POST",
		    data : formData,
		    success: function(data, textStatus, jqXHR){
		       if(data == "true") {
		    	   $('#formToUse').prop('selectedIndex',0);
		    	   $('#facebookTabPage').prop('selectedIndex',0);
		    	   $("#statusMessageHolder").html("Done. Form added to <a target=\"_blank\" href=\"https://www.facebook.com/pages/null/"+facebookPageId+"?sk=app_"+AgileFacebookAppId+"\">your Facebook page.</a><br>");
		       } else {
		    	   $("#statusMessageHolder").html("Something went wrong, please try again.");
		       }
		    },
		    error: function (jqXHR, textStatus, errorThrown){
		    }
		    });		
	});
	
	$(".deleteFacebookLinkedpage").die().live("click", function(e) {
		e.preventDefault();
		var agree = confirm("Are you sure you want to remove Agile form tab ?");
		if(agree) {
			var pageId = $(this).attr("data-pageid");
			var pageToken = $("#facebookTabPage option[value='"+pageId+"']").attr("data-token");
			if(typeof pageToken == "undefined") {
				var isAgreed = confirm("Link your facebook account before removing this form from your facebook page tab.");
				if(isAgreed) {
					var fbLoginLink = $("#AddFormLinkFacebookAccount").attr("href");
					if(typeof fbLoginLink != "undefined") {
						window.location.href = fbLoginLink;
					}
				}
			} else {
				
				var formData = "facebookPageID=" + pageId;
				formData += "&facebookPageToken=" + pageToken;
				
				$.ajax({
				    url : "fbpage?action=DELETE_TAB",
				    type: "POST",
				    data : formData,
				    success: function(data, textStatus, jqXHR){
				       if(data == "true") {
				    	   $("#connectedFormHolder_"+pageId).remove();
				    	   $("#delStatusMessageHolder").html("Done. Removed successfully.<br>");
				       } else {
				    	   $("#delStatusMessageHolder").html("Something went wrong, please try again.");
				       }
				    },
				    error: function (jqXHR, textStatus, errorThrown){
				    }
				    });
			}
		}		
	});
	
	$("#formToUse").die().live("change", function(e) {
		var preSelectedFormId = $("#connectedForm_"+$(this).val()).attr("data-pageid");
		if(typeof preSelectedFormId != "undefined") {
			$("#facebookTabPage").val(preSelectedFormId);
		}
	});
	
});