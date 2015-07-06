<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" /> 
<title>summernote</title>

<script src="//code.jquery.com/jquery-1.9.1.min.js"></script> 

<link rel="stylesheet" type="text/css" href="flatfull/css/bootstrap.css">
<script type="text/javascript" src="//netdna.bootstrapcdn.com/bootstrap/3.0.1/js/bootstrap.min.js"></script>


<link rel="stylesheet" type="text/css" href="flatfull/css/app.css">
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css" />

<link rel="stylesheet" href="js/designer/summernote/summernote.css">
<link rel="stylesheet" href="js/designer/summernote/summernote_custom.css">
<script type="text/javascript" src="js/designer/summernote/summernote.js"></script>
<!-- <script type="text/javascript" src="js/designer/summernote/plugins/customfields.js"></script>
<script type="text/javascript" src="js/designer/summernote/plugins/chart.js"></script> -->
<script>

var MERGE_FIELDS = {};

var CURRENT_DOMAIN_USER = {};

//Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
  var vars = [],
      hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
  }

  return vars;
}

function isNotValid(value)
{
  if(value == undefined)
    return true;
  
  if(value.length == 0)
    return true;
  
  return false;
}


function showError(message)
{
  $('#error p').text(message);
  $('#error').slideDown();
}

//Gets MergeFields
function getMergeFields()
{
  // get merge fields
  return window.opener.getMergeFields('send_email');
}

/**
* Sets merge fields in Editor as menu button and adds click event
* to each option
* @param editor - html editor
**/
function set_up_merge_fields(editor)
{
  var menu = [];
  
  $.each(MERGE_FIELDS, function(key, value){
    
    if(key === "Select Merge Field" || key === "Add Merge Field")
      return;
    
    var menu_item = {}; 
    menu_item["text"]=key;
    menu_item["onclick"]=function(){
      editor.insertContent(value);
    };
    
    menu.push(menu_item);
    
  });
  
  return menu;
}

$(function() {
  
  try{
      
        var textarea_id = getUrlVars()["id"];
        var url = getUrlVars()["url"];
    
      // Load HTML into Tiny MCE.
      if(textarea_id !== undefined && url === undefined)
      {
      var initHTML = window.opener.$('#' + textarea_id).val();
      $('#content').val(initHTML);
      var isWarning = should_warn(initHTML);
      showWarning(isWarning);
       // Initialize tinymce editor with content
          init_tinymce();
      
      }
    
        // Fetches html content and load into Tiny MCE editor
        if(textarea_id !== undefined && url !== undefined){
          
          // Show Back link for email templates
          
            // Fetch html and fill into tinymce
            $.get(location.origin+url, function(value){
              
              $('#content').val(value);
              
              var isWarning = should_warn(value);
              showWarning(isWarning);
              // Initialize tinymce editor after content obtained
                      init_tinymce();
              });
        }
        
        // Show empty editor if none of templates selected
        /* if(window.history.length > 1)
        {
          // Show Back link for email templates
          
        } */
    }
    catch(err){
      console.log("Error occured");
      console.log(err);
    }
    
    try
    {
      
    // Gets MergeFields and append them to select option.
    MERGE_FIELDS = getMergeFields();
    
    }
    catch(err){
      console.log(err);
    } 

      $('body').on('click', function(e){
    	/*  if($('.agile').hasClass('active')) */{
    		 $('.agile').hide();
    		 $('.agile').removeClass('active');
    	} 
    });  
    
    $('#save_html, #top_save_html').on('click', function(e){
      
      e.preventDefault();
      
      var html = $("#content").code();//tinyMCE.activeEditor.getContent({format: 'html'});
          html = html.trim();
          
      if(isNotValid(html))
      {
        showError("Please enter a valid html message");
        return;
      }
      
      window.opener.tinyMCECallBack(getUrlVars()["id"], html);
      window.close();
      
    });
    
    // Navigate history back on Back is clicked
    $('#navigate-back').on('click', function(e){
      e.preventDefault();
      
      // Confirm before going to Templates
        if(!confirm("Your changes will be lost. Are you sure you want to go back to templates?"))
          return;
      
      if(!window.history.back())
    	  window.location.href = window.location.origin +"/templates.jsp?id=tinyMCEhtml_email&t=email"
      
    });
});

function validateInput()
{
  var input = $('#data').val();
  $('#error').hide();
  
  if(isNotValid(input))
  {
    showError("Please enter a valid data.")
    return false; 
  }
  
  return true;
}

/**
 * Initialize the tinymce editor 
 **/
function init_tinymce()
{
  
  // Hide message and show textarea
  $('#loading-msg').hide();
  
  var mergeField = getMergeFields();
  
  

	var options={
		 
		"Name" :{
			"First Name" : "{{first_name}}", 
			"First Name Fix" : "{{first_name_fix}}", 
			"Last Name" : "{{last_name}}", 
			"Last Name Fix" : "{{last_name_fix}}", 
			"Name Fix" : "{{name_fix}}"
		},
		"Properties":{
			"Score" : "{{score}}",
			"Created Date" : "{{created_date}}", 
			"Modified Date" : "{{modified_date}}", 
			"Email" : "{{email}}",
			"Email Work":"{{email_work}}", 
			"Email Personal":"{{email_home}}", 
			"Company" : "{{company}}", 
			"Title" : "{{title}}",
			"Website" : "{{website}}", 
			"Phone" : "{{phone}}",
			"Phone Work" : "{{phone_work}}",
			"Phone Home" : "{{phone_home}}",
			"Phone Mobile" : "{{phone_mobile}}",
			"Phone Main" : "{{phone_main}}",
			"Phone Home fax" : "{{phone_home_fax}}",
			"Phone Work fax" : "{{phone_work_fax}}",
			"Phone Other" : "{{phone_other}}"
		},
		"Custom Fields":{
		},
		"Address":{
			"City" : "{{location.city}}", 
			"State" : "{{location.state}}", 
			"Country" : "{{location.country}}"
		},
		"Web":{
			"Twitter Id" : "{{twitter_id}}", 
			"LinkedIn Id" : "{{linkedin_id}}"
		},
		"Owner":{
			"Owner Name" : "{{owner.name}}", 
			"Owner Email" : "{{owner.email}}" , 
			"Owner calendar URL" : "{{owner.calendar_url}}" , 
			"Owner Signature" : "{{{owner.signature}}}"
		},
		"Misc":{
			"Unsubscribe Link" : "{{{unsubscribe_link}}}",
			"Online Link" : "{{{online_link}}}",
			"Powered by" : "{{{powered_by}}}"
		}
	};

	//Get Custom Fields in template format
	var custom_fields;

	// Cache Contact Custom fields
	if(window.opener._CONTACT_CUSTOM_FIELDS)
		custom_fields = window.opener._CONTACT_CUSTOM_FIELDS;
	else
		{
		    _CONTACT_CUSTOM_FIELDS = window.opener.get_custom_fields();
			custom_fields = _CONTACT_CUSTOM_FIELDS;
		}

	options["Custom Fields"] = custom_fields;
	
	var selectoption='<li data-event="merge" ></li>';

	$.each(options, function(name, option_value) {
		if(typeof(option_value)== 'object')
			{
				var optgroup ="<ul></ul>";
				optgroup = $(optgroup).attr("label",name);
				optgroup = $(optgroup).attr("class","m-l-xs agile-custom-field");
				optgroup = $(optgroup).attr("data-event","merge");
				optgroup = optgroup.append(name);
				$.each(option_value, function(subtype_key, subtype_value) {
					var title=subtype_key;
					if(subtype_key.length>18)
						subtype_key = subtype_key.substr(0,15)+"..." ;
					$(optgroup).append("<li data-event='merge' class='ul-custom-merge-field m-l-l' data-value='" + subtype_value + "' title = '"+title+"'>" + subtype_key + "</option>");
				});
				selectoption = $(selectoption).append(optgroup);
			}
		else
			{
				if(name.indexOf("*") == 0)
					{
						name  = name.substr(1);
						selectoption = $(selectoption).append("<option selected data-value='" + option_value + "' title = '"+name+"'>" + name + "</option>");
					}
				else
					selectoption = $(selectoption).append("<option value='" + option_value + "' title = '"+name+"'>" + name + "</option>");
			}
	});
	
	console.log(selectoption);

  var dropdown =selectoption;
  dropdown = '<ul class = "dropdown-menu note-check ul-custom-scroll agile">' + dropdown.html() + '</ul>' ;
  var tmpl = $.summernote.renderer.getTemplate();
  
  // Initialize tinymce;
   $.summernote.addPlugin({
      buttons : {
    	 
         // "hello"  is button's namespace.      
         "hello" : function(lang, options) {
             // make icon button by template function          
             return tmpl.iconButton('fa fa-music', {
                 // callback function name when button clicked 
                 label : 'hello',
                 event : 'hello',
                 // set data-value property                 
                 value : 'hello',    
                 hide : false,
                 airPopover : true,
                 dropdown : dropdown
             }, "Agile Merge Fields", false);           
         }
      
      }, 
      events : {
    	  event : function(e, editor, layout) {
              alert("adsdasd");             
          },
         "hello" : function(event, modules_editor, layoutInfo, value) {
           console.log("OMG");
           
           if($('.agile').hasClass('active')){
          	 $('.agile').hide();
          	 $('.agile').removeClass('active');
          	// $('.agile').addClass('inactive');
          	$('.agile').prev().addClass('inactive')
          	 
             $('.agile').parent().removeClass('open');
           	 return;
           }
           $('.agile').show();
           $('.agile').addClass('active');
           //$('.agile').removeClass('inactive');
           $('.agile').prev().removeClass('inactive')
           event.stopImmediatePropagation();
         },
         "merge" : function(event, modules_editor, layoutInfo, value) {
             console.log("OMG");
             if(value == undefined){
            	 $('.agile').show();
            	 $('.agile').addClass('active');
            	 $('.agile').prev().removeClass('inactive');
            	 event.stopImmediatePropagation()
            	 return;
             }
             $('.agile').removeAttr("style");
             $('.agile').removeClass('active');
             $('.agile').prev().addClass('inactive')
             var $editable=layoutInfo.editable();
             modules_editor.insertText($editable,value);
         }
      }     
  });
 
  
  $('#content').summernote({
        height: 775,
        enterHtml: '<p><br></p>',
        onImageUpload: function(files, editor, welEditable) {
      //console.log('image upload:', files, editor, welEditable);
      sendFile(files[0],editor,welEditable);
        },
        toolbar : [
                   ['style', ['style']],
                   ['font', ['bold', 'italic', 'underline', 'clear']],
                   // ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
                   ['fontname', ['fontname']],
                   ['fontsize', ['fontsize']],
                   ['color', ['color']],
                   ['para', ['ul', 'ol', 'paragraph']],
                   ['height', ['height']],
                   ['table', ['table']],
                   ['insert', ['link', 'picture', 'hr']],
                   ['view', ['fullscreen', 'codeview']],
                   ['buttons', [ 'hello' ]]
                       ]
    });
  
  $('.note-editor').addClass('bc-w');
  
  // add a button   
    CURRENT_DOMAIN_USER = window.opener.get_domain_user();
  
}

function isValidString(name){
	return !/[~@`!#$%\^\(\)&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(name);
}

function getExtention(name){
	return name.split("/").pop();
}

function sendFile(file,editor,layoutInfo) {
    formData = new FormData();
    var filename = file.name;
    var domain = "";
    
    if(CURRENT_DOMAIN_USER)
    	domain = CURRENT_DOMAIN_USER.domain+"/";
    
    if(!isValidString(file.name)){
    	if(CURRENT_DOMAIN_USER){
    		filename = CURRENT_DOMAIN_USER.domain + (new Date).getTime();
    	}
  			  }
    var extension = getExtention(file.type);				
    formData.append('key',  "editor/"+domain+filename+"."+extension);
    formData.append('AWSAccessKeyId', 'AKIAIBK7MQYG5BPFHSRQ');
    formData.append('acl', 'public-read');
	  formData.append('content-type', file.type);
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
        
       // $('#content').summernote('editor.insertImage', decodeURIComponent(url));
        
       // var $editable = layoutInfo.editable();
//$('#content').summernote('inserImage',decodeURIComponent(url));
         var img = $('<img src="'+ decodeURIComponent(url)+'"/>');
        var editor = $.summernote.eventHandler.getModule();
        editor.insertImage($('.note-editable'),decodeURIComponent(url),$(data).find('Key').text());
        
        /*
        var img = $('<img src="'+url+'" />');
        editor.insertNode($editable, img[0]);
        */
      
      }
    });
    
    
   
	  
  }

function should_warn(content)
{
  try{
    if(content.indexOf('https://s3.amazonaws.com/AgileEmailTemplates') >= 0)
      return false;
    if(content.indexOf('http://www.stampready.net') >= 0)
      return false;
    
    var isStyle = false;
    var isTrue = false;
    $.each($(content),function(index,attribute){
      var attributeType=$(attribute);
      var node_name = attributeType["context"].nodeName;
      var node_name_type = attributeType[0].nodeName;
      if(node_name == "STYLE" && node_name == "STYLE"){
        {
        isTrue= "style";
        isStyle = true;
        return false;
        }
      }
      }); 
    if(!isStyle)
    $.each($(content),function(index,attribute){
      var attributeType=$(attribute);
      var node_name = attributeType["context"].nodeName;
      var node_name_type = attributeType[0].nodeName;
      if(node_name == "LINK" && node_name == "LINK"){
        {
        isTrue= "link";
        return false;
        }
      }
      });
    return isTrue;
  }catch (e)
  {
    console.log("Error while warning for inline css");
    console.log(e);
    return true;
  }
  
}

function showWarning(isWarning)
{
  if(isWarning){
    if(isWarning == 'style'){
      $('#inline-css-verification-link').css('display','none');
      $('#inline-css-verification-css').css('display','inline-block');
    }
    if(isWarning == 'link'){
      $('#inline-css-verification-css').css('display','none');
      $('#inline-css-verification-link').css('display','inline-block');
    }
  }
  else{
    $('#inline-css-verification-link').css('display','none');
    $('#inline-css-verification-css').css('display','none');
  }
    
  
}
</script>
</head>
<body style="background-color:#f0f3f4!important">
<div  >
    <div  >
        <!-- wrapper begins -->
        <div  >
            <div  >
                <!-- Back button style="margin-top: 10px; padding-left: 25px; padding-right: 30px; -->
                <div class = "m-t-sm btn-rounded">
                    <div style="display:inline-block; float: left;" id="navigate-back">
                        <!-- Back link to navigate to history back  -->
                        <a href="#" class="btn btn-default btn-large"> &lt; Back </a>
                    </div>
                    <div style="display: block; float:right;">
                        <a href="#" id="top_save_html" class="btn btn-default btn-large" style="cursor:pointer; font-weight: bold;">Save</a>
                    </div>
                    <div style="clear: both;"></div>
                </div>
                <div id="inline-css-verification-css" style="display: none;">
                <div class="alert danger info-block alert-warning text-black">
                    <div>
                      <i class="icon-warning-sign"></i>
              <strong>Using embedded CSS?
              <!--<a href="#trigger-add" style="float: right;cursor: pointer;font-weight: normal;">How to add trigger?</a>-->
              </strong>
                      <p>Your email appears to be using embedded CSS (as it has a &lt;style&gt;tag defined). Such emails may not render properly in some email clients. We recommend you to convert the CSS styling to Inline styling for better compatibility. Try an  <a style="display:inline" onclick="parent.window.open('http://templates.mailchimp.com/resources/inline-css/')" class="block">online converter</a></p>
                    </div>
                </div>
            </div>
            <div id="inline-css-verification-link" style="display: none;">
                <div class="alert danger info-block alert-warning text-black">
                    <div>
                      <i class="icon-warning-sign"></i>
              <strong>Using external resources?
              <!--<a href="#trigger-add" style="float: right;cursor: pointer;font-weight: normal;">How to add trigger?</a>-->
              </strong>
                      <p>Your email appears to be using some external resources (as it has a &lt;link&gt; tag in it). Such emails may not render properly in some email clients. We recommend removing all external links for CSS or Fonts, for better compatibility.</p>
                    </div>
                </div>
            </div>
            </div>
            <!-- .block_head ends -->
            <div class="block_content center" class="note-editable" contenteditable="true" >
                <!-- out.println(Util.getHTMLMessageBox("","error", "errormsg")); -->
                <form method="post" action="somepage" class ="m-t-sm btn-rounded">
                    <p id="loading-msg">Loading HTML Editor...</p>
                     <textarea name="content" id='content' rows="30" cols="90" style="display:none;margin-left: 25px;background-color:white
                     "></textarea>
                    <br/>
                    <p>
                    <a href="#" id="top_save_html" class="btn btn-default btn-large" style="cursor:pointer; font-weight: bold;float: right;margin-bottom: 10px;">Save</a>
                    </p>
                </form>
            </div>
        </div>
    </div>
</div>

</body>
</html>
