<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@page import="java.util.Calendar"%>
<%@page import="org.json.JSONObject"%>
<%@page import="org.json.JSONException"%>
<%@page import="org.codehaus.jackson.map.ObjectMapper"%>
<%@page import="java.net.URLEncoder"%>
<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Agile CRM - HTML Editor</title>

<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=7" /><![endif]-->
<!--[if lt IE 8]><style type="text/css" media="all">@import url("css/ie.css");</style><![endif]-->
<!--[if IE]><script type="text/javascript" src="js/excanvas.js"></script><![endif]-->

<%
	String	template = "pink";
%>
	
<%
	String CSS_PATH = "/";
		//String CSS_PATH = "//dpm72z3r2fvl4.cloudfront.net/";
%> 
	 
<%
		//String LIB_PATH = "//dpm72z3r2fvl4.cloudfront.net/js/";
	String LIB_PATH = "/";
%>
	
<%
String template_json = request.getParameter("data");

if(template_json != null){
	
try
{
	JSONObject template_object = new JSONObject(template_json);

	if (template_object.has("text")){
		template_json  = template_object.get("text").toString();
		
		template_json = template_json.replaceAll("(<script|<SCRIPT)", "<!--<script").replaceAll(
			"(</script>|</SCRIPT>)", "<script>-->");
	}

}
catch (JSONException e)
{
	System.out.println("Exception while commenting scripts in template: "+ e.getMessage());
}

}
ObjectMapper mapper = new ObjectMapper();

System.out.println("Request parameter in tinymce: "+template_json); 

%>
<!-- Bootstrap  -->
<link rel="stylesheet" type="text/css"	href="<%= CSS_PATH%>css/bootstrap-<%=template%>.min.css" />

<!-- New UI 
<link rel="stylesheet" type="text/css" href="flatfull/css/bootstrap.css"> -->
<link rel="stylesheet" type="text/css" href="flatfull/css/app.css">  

<style type="text/css">
 .alert-warning {
    color: #8a6d3b;
    background-color: #fcf8e3;
    border-color: #faebcc;
}
.alert {
    padding: 15px;
    margin-bottom: 20px;
    border: 1px solid transparent;
    border-radius: 4px;
}

.btn {
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 1px;
}

div[role="presentation"] { 
}
</style>
	
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="js/designer/tinymce/tinymce.min.js"></script>
<script type="text/javascript">

var MERGE_FIELDS = {}

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

// Gets MergeFields
/*function getMergeFields()
{
	// get merge fields
    return window.opener.getMergeFields('send_email');
}*/

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

function setTinyMCEImageUploadURL(url){
	
	var elem = $('input')[0];
	
    $(elem).val(url).trigger("change");
    
}


$(function()
{	
try{
		var templateJSON = <%= mapper.writeValueAsString(template_json)%>;
		
	    var textarea_id = getUrlVars()["id"];
	    var url = getUrlVars()["url"];
	
		// Load HTML into Tiny MCE.
		if(textarea_id !== undefined && url === undefined)
		{
			var initHTML;
			if(templateJSON){
				initHTML = (templateJSON);
				//initHTML = templateJSON.text;
			}
			else
			initHTML = window.opener.$('#' + textarea_id).val();
		if(window.opener.location.hash != "#webrules-add")
		initHTML = remove_script_tags(initHTML);
		$('#content').val(initHTML);
		var isWarning = should_warn(initHTML);
		showWarning(isWarning);
		 // Initialize tinymce editor with content
        init_tinymce();
		
		}
	
	    // Fetches html content and load into Tiny MCE editor
	    if(textarea_id !== undefined && url !== undefined){
	    	
	    	// Show Back link for email templates
	    	$('#navigate-back').css('display','inline-block');
	    	
	    		// Fetch html and fill into tinymce
	    		$.get(location.origin+url, function(value){
	    			if(window.opener.location.hash != "#webrules-add")
	    			value = remove_script_tags(value);
	    			$('#content').val(value);
	    			
	    			var isWarning = should_warn(value);
	    			showWarning(isWarning);
	    			// Initialize tinymce editor after content obtained
                    init_tinymce();
	    			});
	    }
	    
	    // Show empty editor if none of templates selected
	    if(window.history.length > 1)
	    {
	    	// Show Back link for email templates
	    	$('#navigate-back').css('display','inline-block');
	    	
	    }
	}
	catch(err){
		console.log("Error occured");
		console.log(err);
	}
	
	try
	{
		
	// Gets MergeFields and append them to select option.
	MERGE_FIELDS = window.opener.getMergeFields();
	
	}
	catch(err){
		console.log(err);
	} 

	$('#save_html, #top_save_html').live('click', function(e){
		
		e.preventDefault();
		
		var html = tinyMCE.activeEditor.getContent({format: 'html'});
        html = html.trim();
        
		if(isNotValid(html))
		{
			showError("Please enter a valid html message");
			return;
		}
		if(window.opener.location.hash != "#webrules-add")
		html = remove_script_tags(html);
		window.opener.tinyMCECallBack(getUrlVars()["id"], html);
		window.close();
		
	});
	
	// Navigate history back on Back is clicked
	$('#navigate-back').die().live('click', function(e){
		e.preventDefault();
		
		// Confirm before going to Templates
    	if(!confirm("Your changes will be lost. Are you sure you want to go back to templates?"))
    		return;
		
		window.history.back();
		
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

function initialize_tinymce_editor(){
	// Hide message and show textarea
	$('#loading-msg').hide();
	$('textarea#content').show();
	
	// Initialize tinymce
	tinymce.init({
        mode: "textareas",
		theme: "modern",
        plugins: [
            "advlist autolink lists link image charmap print preview hr anchor pagebreak",
            "searchreplace wordcount visualblocks visualchars code fullscreen fullpage",
            "insertdatetime nonbreaking save table contextmenu directionality",
            "paste textcolor"
        ],
        toolbar1 : "bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | forecolor backcolor | link image | preview",
		toolbar2 : "formatselect fontselect fontsizeselect | merge_fields | templates",
        valid_elements: "*[*]",
        browser_spellcheck : true,
        gecko_spellcheck: true,
        relative_urls : false,
		convert_urls : false,
		forced_root_block : false,
        extended_valid_elements : "*[*]",
        setup: function(editor) {
            
        	// Agile Merge Fields
            editor.addButton('merge_fields', {
                type: 'menubutton',
                text: 'Agile Contact Fields',
                icon: false,
                menu: set_up_merge_fields(editor)
            });
            
            // Templates button
            editor.addButton('templates', {
                text: 'Templates',
                icon: false,
                onclick: function() { 
                	
                	// Confirm before going to Templates
                	if(!confirm("Your changes will be lost. Are you sure you want to go back to templates?"))
                		return;
                	
                	var type= 'email';

                	// When loaded from templates page
                	if(window.opener == null)
                	{
                		window.history.back();
                		return;
                	}
                	
                	// For Webrules templates, open Webrules
                	if(window.opener.location.hash.indexOf('webrule') != -1)
                		type= 'web_rules';
                	
                	window.location = '/templates.jsp?id=tinyMCEhtml_email&t='+type;
                }
            }); 
            
            editor.on('change', function(e) {
            	
            	var editor_contents = tinyMCE.activeEditor.getContent();
            	// if(window.opener.location.hash != "#webrules-add"){
            	// editor_contents = remove_script_tags(editor_contents);
            	// tinyMCE.activeEditor.setContent(editor_contents)
            	// }
                var isWarning = should_warn(editor_contents);
                showWarning(isWarning);
            });
            
        }
        
    });
}

/**
 * Initialize the tinymce editor 
 **/
function init_tinymce()
{
	
	if(!MERGE_FIELDS || !Object.keys(MERGE_FIELDS).length){
		window.opener.getMergeFields('send_email', function(fields){
			MERGE_FIELDS =  fields;
			initialize_tinymce_editor();
		});
	} else {
		initialize_tinymce_editor();
	}
	
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

function remove_script_tags(content)
{
	try{
		return content.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm,'');
	}
	catch(err){
		console.log(err);
		return content;
	}
}


</script>

</head>

<body>
<div style='padding:10px'>
    <div style='min-width:450px;'>
        <!-- wrapper begins -->
        <div class="block small">
            <div class="block_head">
                <!-- Back button -->
                <div style="margin: 0 0 10px 0">
                    <div style="display:none; float: left;" id="navigate-back">
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
            <div class="block_content center">
                <!-- out.println(Util.getHTMLMessageBox("","error", "errormsg")); -->
                <form method="post" action="somepage">
                    <p id="loading-msg">Loading HTML Editor...</p>
                    <textarea name="content" id='content' rows="30" cols="90" style="display:none;"></textarea>
                    <br/>
                    <p style="text-align: right;"><a href="#" id="save_html" class="btn btn-default btn-large" style="font-weight: bold;">Save</a></p>
                </form>
            </div>
        </div>
    </div>
</div>

</body>
</html>
