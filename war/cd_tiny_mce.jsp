<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@page import="java.util.Calendar"%>

<html xmlns="http://www.w3.org/1999/xhtml">

<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Agile CRM - HTML Editor</title>

<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=7" /><![endif]-->
<!--[if lt IE 8]><style type="text/css" media="all">@import url("css/ie.css");</style><![endif]-->
<!--[if IE]><script type="text/javascript" src="js/excanvas.js"></script><![endif]-->

<style>
h1,h2,h3,h4,h5,h6{margin:0;font-family:Ubuntu;font-weight:400;color:#525252;text-rendering:optimizelegibility;}
h1{font-size:30px;line-height:36px;}
h2{font-size:24px;line-height:36px;}
h3{font-size:18px;line-height:27px;}

.page-header{padding-bottom:17px;margin:18px 0;border-bottom:1px solid #f5f5f5;}
.well{width:100%; float:left;background-color: #f5f5f5;padding: 10px 10px;-webkit-box-shadow: inset 0 1px 1px;border: 1px solid rgba(0, 0, 0, 0.05);border-radius: 4px;box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);}
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

	$('#save_html').live('click', function(e){
		
		e.preventDefault();
		
		var html = tinyMCE.activeEditor.getContent({format: 'html'});
        html = html.trim();
        
		if(isNotValid(html))
		{
			showError("Please enter a valid html message");
			return;
		}
		
		// Return Back here
		window.opener.tinyMCECallBack(getUrlVars()["id"], html);
		window.close();
	});
	
	// Navigate history back on Back is clicked
	$('#navigate-back').die().live('click', function(e){
		e.preventDefault();
		
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
	tinymce.init({
        mode: "textareas",
		theme: "modern",
        plugins: [
            "advlist autolink lists link image charmap print preview hr anchor pagebreak",
            "searchreplace wordcount visualblocks visualchars code fullscreen fullpage",
            "insertdatetime media nonbreaking save table contextmenu directionality",
            "paste textcolor"
        ],
        toolbar1 : "bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | forecolor backcolor | link image",
		toolbar2 : "formatselect fontselect fontsizeselect | merge_fields | preview",
        valid_elements: "*[*]",
        browser_spellcheck : true,
        gecko_spellcheck: true,
        extended_valid_elements : "*[*]",
        setup: function(editor) {
            editor.addButton('merge_fields', {
                type: 'menubutton',
                text: 'Agile Contact Fields',
                icon: false,
                menu: set_up_merge_fields(editor)
            });
            
        }
        
    });
}

</script>

</head>

<body>
<div id="hld" style='padding:10px'>
	<div class="wrapper" style='min-width:450px;'>

	<!-- wrapper begins -->
		<div class="block small">
			<div class="block_head">
				<div class="bheadl"></div>
				<div class="bheadr"></div>
				
				<!-- Back button -->
				<div style="height: 25px; display:none;" id="navigate-back">
				
    				<!-- Back link to navigate to history back  -->
					<a href="#"> < Back </a>
					
				</div>
				
			</div>
			<!-- .block_head ends -->

			<div class="block_content center">
			<!-- out.println(Util.getHTMLMessageBox("","error", "errormsg")); -->

				<form method="post" action="somepage">
					<textarea name="content" id='content' rows="30" cols="90"></textarea>
 					<br/>
 					<p><input type="submit" id="save_html" class="submit long" style="cursor:pointer;padding: 5px 25px 5px 25px;font-size: 15px;float: right; font-weight: bold;" value="Save"/> &nbsp;</p>
 					</form>
 			</div>
			<!-- .block_content ends -->

			<div class="bendl"></div>
			<div class="bendr"></div>
		</div>
	</div>
<!-- wrapper ends -->
</div>
<!-- #hld ends -->

</body>
</html>

