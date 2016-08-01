/**
 *Push notification backbone model
*/
 var Push_Notification_Model = new Backbone.Model.extend({ url:"/core/api/push/notification"});


/**
*  Push Notification event view
*/
var Push_Notification_Event_View = Base_Model_View.extend({
		    events: {
		 		'keyup #notification-title' : 'notificationTitleAdd',
		 		'keyup #notification-message' : 'notificationMessageAdd',
		 		'keyup #notification-link' : 'notificationLinkAdd',
		 		'change #uploadIconToS3Btn' : 'uploadNotificationIcon',
		 		'click #prev-notification-icon' : 'changeNotificationIcon',
		 		'change #notification-icon' : 'changeNotificationIcon',
		    },

			// Add notification title in preview
			notificationTitleAdd: function(e)
			{
				$("#prev-notification-title").text($("#notification-title").val());

				if($("#prev-notification-title").text()=="")
					 $("#prev-notification-title").text("Notifiation Title");
			},
			
			notificationMessageAdd: function(e)
			{
				$("#prev-notification-message").text($("#notification-message").val());

				if($("#prev-notification-message").text()=="")
					 $("#prev-notification-message").text("Notification message body should maximum 160 character.");
			},
			
			notificationLinkAdd: function(e)
			{
				$("#prev-notification-link").text($("#notification-link").val());

				if($("#prev-notification-link").text()=="")
					 $("#prev-notification-link").text("https://prashannjeet-dot-sandbox-dot-agilecrmbeta.appspot.com");
				
			},

			uploadNotificationIcon: function(e)
			{
				  e.preventDefault();
				   var fileInput = document.getElementById('uploadIconToS3Btn');
       			  uploadIconToS3ThroughBtn(fileInput.files[0]);
			},

			changeNotificationIcon: function(e)
			{
			   e.preventDefault();
         	  $('#prev-notification-icon').attr('src', $('#notification-icon').val());

         	  if($("#prev-notification-icon").attr("src")=="")
         	  	 $('#prev-notification-icon').attr('src', 'https://media.licdn.com/mpr/mpr/shrink_200_200/AAEAAQAAAAAAAAWJAAAAJDQwNmRhNGNmLTlmNWMtNGZkMC1hZDJhLWI0ODE1NDQxMmNhNA.png');
				
			},


		});

function uploadIconToS3ThroughBtn(file) {
    if(typeof file != "undefined") {
        $("#browseBtn").prop("disabled",true);
        $("#browseBtn").text("uploading...");

        var uploadedFileName = file.name;
        var filename = uploadedFileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        filename = filename + "_" + new Date().getTime() + "." + uploadedFileName.split('.').pop();

        formData = new FormData();
        formData.append('key',  "editor/notification/"+window.parent.CURRENT_DOMAIN_USER.domain+"/"+filename);
        formData.append('AWSAccessKeyId', 'AKIAIBK7MQYG5BPFHSRQ');
        formData.append('acl', 'public-read');
        formData.append('content-type', 'image/png');
        formData.append('policy', 'CnsKICAiZXhwaXJhdGlvbiI6ICIyMDI1LTAxLTAxVDEyOjAwOjAwLjAwMFoiLAogICJjb25kaXRpb25zIjogWwogICAgeyJidWNrZXQiOiAiYWdpbGVjcm0iIH0sCiAgICB7ImFjbCI6ICJwdWJsaWMtcmVhZCIgfSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJGtleSIsICJlZGl0b3IvIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiaW1hZ2UvIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRzdWNjZXNzX2FjdGlvbl9zdGF0dXMiLCAiMjAxIl0sCiAgXQp9');
        formData.append('signature', '59pSO5qgWElDA/pNt+mCxxzYC4g=');
        formData.append('success_action_status', '201');
        formData.append('file', file);

        $.ajax({
            data: formData,
            dataType: 'xml',
            type: "POST",
            cache: false,
            contentType: false,
            processData: false,
            url: "https://agilecrm.s3.amazonaws.com/",
            success: function(data) {
              // getting the url of the file from amazon and insert it into the editor
              var url = $(data).find('Location').text();
              $('#notification-icon').val(decodeURIComponent(url));
              $('#prev-notification-icon').trigger('click');
              $("#browseBtn").prop("disabled",false);
              $("#browseBtn").text("Upload Image");
            }
        });
    }
}
