angular.module('app', ['ngImgCrop'])
      .controller('Ctrl', function($scope) {
        $scope.myImage='';
        $scope.myCroppedImage='';
        $scope.cropType="square";

        var handleFileSelect=function(evt) {

          if(!enabledToCropImage)
               return;

          $("div.cropAreaContainer").show();
          window.resizeTo(600, 670);

          var file=evt.currentTarget.files[0];
          var reader = new FileReader();
          reader.onload = function (evt) {
            $scope.$apply(function($scope){
              $scope.myImage=evt.target.result;
            });
          };
          reader.readAsDataURL(file);
        };
        angular.element(document.querySelector('#fileextension')).on('change',handleFileSelect);
      });

$(function(){
  $("[name='upload']").click(function(e){
        e.preventDefault();
        if(!isValid())
          return;

      var data_url = $("div#preview img").attr("ng-src");
      Cd_Add_Wesite_Screenshot.add_to_amazon_cloud(data_url, function(){
      });
      disableSave();
    });
});
    
var Cd_Add_Wesite_Screenshot = {
  add_to_amazon_cloud : function(dataURL, callback) {

    if (!dataURL)
      return false;

    // Create a blob from dataURL
    var blob = this.dataURItoBlob(dataURL);
    
    var file = {};
    file.file_resource = $("[name='key']").val();
    file.success_callback = "upload_success_callback";
    
    // Create form with data
    var formdata = ClickDesk_File_Upload.construct_form_data(file);
    formdata.append("file", blob);
    file.size = blob.size;
    file.name = "website-screenshot.png";

    // Send form
    ClickDesk_File_Upload.upload_to_amazon(formdata, file);

  },

  dataURItoBlob : function(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for ( var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ ab ], {
      type : 'image/png'
    });

  }
};

var ClickDesk_File_Upload = {
  /**
   * Constructs Form Data with amazon keys for given file object to send
   * request to amazon
   * 
   * @param file -
   *            file object
   */
  construct_form_data : function(file) {

    var fd = new FormData();

    // Construct post data
    fd.append('key', file.file_resource);
    fd.append('acl', 'public-read');
    fd.append('AWSAccessKeyId', 'AKIAJ62OAFOKCJTDANVA');
    fd
        .append(
            'policy',
            'ewogICJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMTI6MDA6MDAuMDAwWiIsCiAgImNvbmRpdGlvbnMiOiBbCiAgICB7ImJ1Y2tldCI6ICJhZ2lsZWNybSIgfSwKICAgIHsiYWNsIjogInB1YmxpYy1yZWFkIiB9LAogICAgWyJzdGFydHMtd2l0aCIsICIka2V5IiwgImNkLXVwbG9hZGVkLWZpbGVzLyJdLApbICJjb250ZW50LWxlbmd0aC1yYW5nZSIsIDEwMCwgNTI0Mjg4MCBdCiAgXQp9')
    fd.append('signature', 'SbN7sZH26/j3+2GO4U7ZQRmLFc4=');

    return fd;
  },


  /**
   * Sends XMLHttpRequest to amazon server to upload file
   * 
   * @param form_data -
   *            form data with amazon keys
   * @param file -
   *            file object
   */
  upload_to_amazon : function(form_data, file) {

    // Construct http request for post request
    var xhr = new window.XMLHttpRequest();
    xhr.upload.addEventListener("progress", function(evt) {
      ClickDesk_File_Upload.progress(evt, file);
    }, false);
    xhr.addEventListener("load", function(evt) {
      ClickDesk_File_Upload.complete(evt, file);
    }, false);
    xhr.addEventListener("error", function(evt) {
      ClickDesk_File_Upload.failed(evt, file);
    }, false);
    xhr.addEventListener("abort", function(evt) {
      ClickDesk_File_Upload.canceled(evt, file);
    }, false);

    // Must be last line before send
    xhr.open('POST', 'https://agilecrm.s3.amazonaws.com/', true);
    xhr.send(form_data);

  },
  progress : function(event, file){
    disableSave();
    console.log("progress");
  },

  complete : function(event, file){
    
    url = "https://s3.amazonaws.com/agilecrm/" + unescape(file.file_resource) + "?id=" + unescape(getUrlVars()["id"]);
    returnBack();
  },

  failed : function(event, file){
    reenableSave();
    console.log("failed");
  },
  canceled : function(event, file){
    reenableSave();
    console.log("canceled");
  }
};

function disableSave(){
     $("[name='upload']").attr("disabled", "disabled").val("Uploading...");
}

function reenableSave(){
  $("[name='upload']").removeAttr("disabled").val("Upload");
}

function upload_success_callback(){
  console.log("upload_success_callback");
}  