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
		    	   	$('#fbFormsHolder').html('<p class="font-bold">Current Facebook Pages</p><table class="table" id="fbFormsTable"><tbody></tbody></table><div id="delStatusMessageHolder"></div>');
		    	   }

		    	   var tableRowHtml = '<tr id="connectedFormHolder_'+facebookPageId+'"><td colspan="3" style="padding-left:0px;"><a target="_blank" href="/form.jsp?id='+selectedFormId+'" class="text-info">'+selectedFormName+'</a> form has been added to<br><a target="_blank" href="https://www.facebook.com/pages/null/'+facebookPageId+'?sk=app_'+AgileFacebookAppId+'" class="text-info">'+facebookPageName+'</a> page</td><td style="padding-top:18px;"><a href="#" data-pageid="'+facebookPageId+'" id="connectedForm_'+selectedFormId+'" class="deleteFacebookLinkedpage"><i class="icon-trash"></i></a></td></tr>';
		    	   
		    	   var statusMessageNote = "has been added to";
		    	   if($('#connectedFormHolder_'+facebookPageId).length != 0) {
		    	   	$('#connectedFormHolder_'+facebookPageId).remove();
		    	   	statusMessageNote = "updated in";
		    	   }

		    	   $('#fbFormsTable > tbody:last-child').append(tableRowHtml);

		    	   var sucMessage = "Form "+statusMessageNote+" <a target=\"_blank\" class=\"text-info\" href=\"https://www.facebook.com/pages/null/"+facebookPageId+"?sk=app_"+AgileFacebookAppId+"\">your Facebook page.</a><br>";
		    	   $("#statusMessageHolder").html(sucMessage).show().fadeOut(10000);
		    	   $("#facebookFormAddHolder").toggle();

		       } else {
		    	   $("#statusMessageHolder").html("Something went wrong, please try again.");
		       }
		    },
		    error: function (jqXHR, textStatus, errorThrown){
		    }
		    });		
	});
	
	$("#fbPageTab-listners").on('click', '.deleteFacebookLinkedpage', function(e){
		e.preventDefault();
		var agree = confirm("Are you sure you want to delete this Form from your Facebook page?");
		if(agree) {
			var pageId = $(this).attr("data-pageid");
			var pageToken = $("#facebookTabPage option[value='"+pageId+"']").attr("data-token");
			if(typeof pageToken == "undefined") {
				var isAgreed = confirm("To delete the Form from Page, Link your Facebook account which is associated to the Page.");
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
				    	   $("#delStatusMessageHolder").html("Deleted successfully.<br>").show().fadeOut(8000);
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
	
	$("#fbPageTab-listners").on('change', '#formToUse', function(e){
		var preSelectedFormId = $("#connectedForm_"+$(this).val()).attr("data-pageid");
		if(typeof preSelectedFormId != "undefined") {
			$("#facebookTabPage").val(preSelectedFormId);
		}
	});

	$("#fbPageTab-listners").on('click', '#addFacebookFormLink', function(e){
		e.preventDefault();
		$("#facebookFormAddHolder").toggle();
	});

	$("#fbPageTab-listners").on('click', '#unlinkFacebookAccount', function(e) {
		e.preventDefault();
		if(!confirm("Are you sure you want to unlink your Facebook account ?")) {
			return;
		}
		$.post( "fbpage?action=UNLINK_ACCOUNT", function(data) {
			window.location.reload();
		});
	});
}