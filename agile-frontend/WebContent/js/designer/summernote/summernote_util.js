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
          init_summernote();
      
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
                      init_summernote();
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

function generate_dropdown(options)
{
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
	});
	
	return selectoption;
}
/**
 * Initialize the summernote editor 
 **/
function init_summernote()
{
  
  // Hide message and show textarea
  $('#loading-msg').hide();
  
  var mergeField = getMergeFields();
  
  var options= get_default_fields();

	//Get Custom Fields in template format
  var custom_fields = get_custom_fields();

  options["Custom Fields"] = custom_fields;
	
  var selectoption = generate_dropdown(options);
	
  var dropdown =selectoption;
  
  dropdown = '<ul class = "dropdown-menu note-check ul-custom-scroll agile">' + dropdown.html() + '</ul>' ;
  
  var tmpl = $.summernote.renderer.getTemplate();
  
  // Initialize summernote
  $.summernote.addPlugin({
      buttons : {
         // "agile_merge_fields"  is button's namespace.      
         "agile_merge_fields" : function(lang, options) {
             return tmpl.iconButton('fa fa-music', {
                 event : 'agile_merge_fields',
                 value : 'agile_merge_fields',    
                 hide : false,
                 airPopover : true,
                 dropdown : dropdown
             }, "Agile Merge Fields", false);           
         }
      
      }, 
      events : {
         "agile_merge_fields" : function(event, modules_editor, layoutInfo, value) {
           if($('.agile').hasClass('active')){
          	 $('.agile').hide();
          	 make_inactive();
             $('.agile').parent().removeClass('open');
           	 return;
           }
           show_dropdown();
           event.stopImmediatePropagation();
         },
         "merge" : function(event, modules_editor, layoutInfo, value) {
             if(value == undefined){
            	 show_dropdown();
            	 event.stopImmediatePropagation()
            	 return;
             }
             $('.agile').removeAttr("style");
             make_inactive();
             var $editable=layoutInfo.editable();
             modules_editor.insertText($editable,value);
         }
      }     
  });
 
  
  $('#content').summernote({
        height: 775,
        enterHtml: '<p><br></p>',
        
        onChange: function ($editable, sHtml) {
        	
        	  var isWarning = should_warn($editable);
              showWarning(isWarning);
        	},
        onImageUpload: function(files, editor, welEditable) {
        sendFile(files[0],editor,welEditable);
        },
        toolbar : [
                   ['style', ['style']],
                   ['font', ['bold', 'italic', 'underline', 'clear']],
                   ['fontname', ['fontname']],
                   ['fontsize', ['fontsize']],
                   ['color', ['color']],
                   ['para', ['ul', 'ol', 'paragraph']],
                   ['height', ['height']],
                   ['table', ['table']],
                   ['insert', ['link', 'picture', 'hr']],
                   ['view', ['fullscreen', 'codeview']],
                   ['buttons', [ 'agile_merge_fields' ]]
                   ]
    });
  
  $('.note-editor').addClass('bc-w');
  
  CURRENT_DOMAIN_USER = window.opener.get_domain_user();
}

function get_custom_fields()
{
	// Cache Contact Custom fields
	if(window.opener._CONTACT_CUSTOM_FIELDS)
		return window.opener._CONTACT_CUSTOM_FIELDS;
	else
		{
		    _CONTACT_CUSTOM_FIELDS = window.opener.get_custom_fields();
		    return _CONTACT_CUSTOM_FIELDS;
		}	
}
function get_default_fields()
{
	var options ={
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
	return options;

}
function make_inactive(){
	$('.agile').removeClass('active');
    $('.agile').prev().addClass('inactive')
}
function show_dropdown(){
	$('.agile').show();
	$('.agile').addClass('active');
	$('.agile').prev().removeClass('inactive');
}
function isValidString(name){
	return !/[~@`!#$%\^\(\)&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(name);
}

function getExtention(name){
	return name.split("/").pop();
}

function sendFile(file,editor,layoutInfo) {
	formData = new FormData();
    
    var domain = "";
    
    if(CURRENT_DOMAIN_USER)
    	domain = CURRENT_DOMAIN_USER.domain+"/";
    
    var extension = getExtention(file.type);
    
    formData = set_parameters(formData, domain, file, extension);
    
    if($('#load_image').length == 0 ){
    var imgBtn = '<img class="loading loader-gif" src= "/flatfull/img/ajax-loader-cursor.gif" id="load_image"></img>';
    var fileGroup = '<div class="loader f-r m-t-m">' + imgBtn + '</div>';
    $(fileGroup).appendTo($('.note-toolbar'));
    }
    
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
        var img = $('<img src="'+ decodeURIComponent(url)+'"/>');
        $("#content").summernote("insertImage", decodeURIComponent(url),$(data).find('Key').text()); 
      }
    });
  }

function set_parameters(formData, domain, file, extension){
	
	var filename = get_file_name(file);
	
	formData.append('key',  "editor/" + domain + filename + "." + extension);
    formData.append('AWSAccessKeyId', 'AKIAIBK7MQYG5BPFHSRQ');
    formData.append('acl', 'public-read');
	formData.append('content-type', file.type);
    formData.append('policy', 'CnsKICAiZXhwaXJhdGlvbiI6ICIyMDI1LTAxLTAxVDEyOjAwOjAwLjAwMFoiLAogICJjb25kaXRpb25zIjogWwogICAgeyJidWNrZXQiOiAiYWdpbGVjcm0iIH0sCiAgICB7ImFjbCI6ICJwdWJsaWMtcmVhZCIgfSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJGtleSIsICJlZGl0b3IvIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiaW1hZ2UvIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRzdWNjZXNzX2FjdGlvbl9zdGF0dXMiLCAiMjAxIl0sCiAgXQp9');
    formData.append('signature', '59pSO5qgWElDA/pNt+mCxxzYC4g=');
    formData.append('success_action_status', '201');
    formData.append('file', file);
    
    return formData;
}

function get_file_name(file){
	
	if(file == undefined)
		return;
	
	var filename = file.name;
	
	if(!isValidString(file.name)){
    	if(CURRENT_DOMAIN_USER)
    		filename = CURRENT_DOMAIN_USER.domain + (new Date).getTime();
  	}
	
	return filename;
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