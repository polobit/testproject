<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@page import="java.util.Calendar"%>

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
	
<!-- Bootstrap  -->
<link rel="stylesheet" type="text/css"	href="<%= CSS_PATH%>css/bootstrap-<%=template%>.min.css" />
<link rel="stylesheet" type="text/css"	href="<%= CSS_PATH%>css/bootstrap-responsive.min.css" />

<!-- New UI -->
<link rel="stylesheet" type="text/css" href="flatfull/css/bootstrap.css">
<link rel="stylesheet" type="text/css" href="flatfull/css/app.css">
	
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


$(function()
{	
try{
		
	    var textarea_id = getUrlVars()["id"];
	    var url = getUrlVars()["url"];
	
		// Load HTML into Tiny MCE.
		if(textarea_id !== undefined && url === undefined)
		{
		var initHTML = window.opener.$('#' + textarea_id).val();
		$('#content').val(initHTML);
		if(showwarning(initHTML))
    		$('#inline-css-verification').css('display','inline-block');
		else
			$('#inline-css-verification').css('display','none');
			
		
		 // Initialize tinymce editor with content
        init_tinymce();
		
		}
	
	    // Fetches html content and load into Tiny MCE editor
	    if(textarea_id !== undefined && url !== undefined){
	    	
	    	// Show Back link for email templates
	    	$('#navigate-back').css('display','inline-block');
	    	
	    		// Fetch html and fill into tinymce
	    		$.get(location.origin+url, function(value){
	    			
	    			$('#content').val(value);
	    			
	    			if(showwarning(value))
	    	    		$('#inline-css-verification').css('display','inline-block');
	    			else
	    				$('#inline-css-verification').css('display','none');
	    			
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
	MERGE_FIELDS = getMergeFields();
	
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
		
		
		
		tinyMCE.activeEditor.windowManager.open({
			title: 'CSS Inline Alert',width: 500,
		    height: 200,text:"bhasuri kona",
										body: [
											{type: 'label', name: 'title', text: "Your email's html code contains a  <style> tag. It is likely that it is using embedded CSS. Your email may not render properly in a few browsers. We recommend you to convert the CSS styling to inline using an <a href='http://templates.mailchimp.com/resources/inline-css/' class='block'>online converter</a>"}
										],
										onsubmit: function(e) {
											// Insert content when the window form is submitted
											console.log("success");
											if(showwarning(html))
											{
											// Return Back here
											window.opener.tinyMCECallBack(getUrlVars()["id"], html);
											window.close();
											}
											else{
												alert('in else');
											}
										}
			});
		
		
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

/**
 * Initialize the tinymce editor 
 **/
function init_tinymce()
{
	
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
            "insertdatetime media nonbreaking save table contextmenu directionality",
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
                if(showwarning(tinyMCE.activeEditor.getContent()))
    	    		$('#inline-css-verification').css('display','inline-block');
    			else
    				$('#inline-css-verification').css('display','none');
            });
            
        }
        
    });
}

function showwarning(content)
{
	try{
		if(content.indexOf('https://s3.amazonaws.com/AgileEmailTemplates') >= 0)
			return false;
		if(content.indexOf('http://www.stampready.net') >= 0)
			return false;
		
		var isTrue = false;
		$.each($(content),function(index,attribute){
			var attributeType=$(attribute);
			
			if(attributeType["context"].nodeName == "STYLE" && attributeType[0].nodeName == "STYLE"){
				{
				isTrue= true;
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
                <div id="inline-css-verification" style="display: none;">
           			<div class="alert danger info-block alert-warning text-black">
                		<div>
                			<i class="icon-warning-sign"></i>
							<strong>TBD Inline Styles. 
							<!--<a href="#trigger-add" style="float: right;cursor: pointer;font-weight: normal;">How to add trigger?</a>-->
							</strong>
                			<p>Your email's html code contains a  &lt;style&gt; tag. It is likely that it is using embedded CSS. Your email may not render properly in a few browsers. We recommend you to convert the CSS styling to inline using an <a href="http://templates.mailchimp.com/resources/inline-css/" class="block">online converter</a></p>
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
                    <p><a href="#" id="save_html" class="btn btn-large pull-right" style="font-weight: bold;">Save</a></p>
                </form>
            </div>
        </div>
    </div>
</div>

</body>
</html>

