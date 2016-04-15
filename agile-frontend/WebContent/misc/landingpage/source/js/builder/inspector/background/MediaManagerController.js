angular.module('builder.inspector')

.controller('MediaManagerController', ['$rootScope', '$scope', '$upload', '$http', '$translate', 'inspector', function($rootScope, $scope, $upload, $http, $translate, inspector) {

		$scope.modal = $('#images-modal');

		$scope.sorting = { prop: 'created_at', reverse: false };

		//upload files to filesystem
        $scope.onFileSelect = function($files, replace) {

          $rootScope.$$phase || $rootScope.$apply();

          var file = $files[0];

          var uploadedFileName = file.name;
          var filename = uploadedFileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
          filename = filename + "_" + new Date().getTime() + "." + uploadedFileName.split('.').pop();

          formData = new FormData();
          formData.append('key',  "editor/"+window.parent.CURRENT_DOMAIN_USER.domain+"/"+filename);
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
              // getting the url of the file from amazon
              var url = $(data).find('Location').text();
              var data = decodeURIComponent(url);
              if (replace === 'src') {
                $scope.selected.node.src = data;
              }

              if (replace === 'bg') {
                inspector.applyCss('background-image', 'url("'+data+'")', $scope.selected.getStyle('background-image'));
              }
            },
            error: function (xhr, ajaxOptions, thrownError) {
              alertify.error("Error ! Try again.", 3000);
            }
          });
		};	

		$scope.useImage = function() {
			if ($('#images-modal').data('type') == 'background') {
				$scope.setAsBackground();
			} else {
				$scope.setAsSource();
			}

			$scope.modal.modal('hide');
		};

		$scope.activeTab = 'my-images';
}])