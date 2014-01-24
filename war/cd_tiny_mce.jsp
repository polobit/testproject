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
</style>

<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="js/designer/tinymce/tinymce.min.js"></script>
<script type="text/javascript">

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

// Inserts selected merge-field into editor
function insertSelectedMergeField(ele,target_id)
{
	var curValue = $(ele).find(':selected').val();
	tinyMCE.execCommand('mceInsertContent', false, curValue);
	return false;
}

// Gets MergeFields
function getMergeFields()
{
	// get merge fields
	var merge_fields = window.opener.getMergeFields();
	
	appendMergeFieldsToSelect(merge_fields);
	
}

// Appends merge fields as options
function appendMergeFieldsToSelect(merge_fields)
{
	$.each(merge_fields, function(key, value) {
		   
		// Append each option to select
		$('#merge_fields').append($("<option/>", {
	        value: value,
	        text: key
	    }));
	});
}

$(function()
{	
try{
		
		// Load HTML into Tiny MCE.
		if(getUrlVars()["id"] !== undefined)
		{
		var initHTML = window.opener.$('#' + getUrlVars()["id"]).val();
		$('#content').val(initHTML);
		
		 // Initialize tinymce editor with content
        init_tinymce();
		
		}
	
	    // Fetches html content and load into Tiny MCE editor
	    if(getUrlVars()["url"] !== undefined){
	    	
	    	// Show Back link for email templates
	    	$('#navigate-back').css('display','inline-block');
	    	
	    	var url = getUrlVars()["url"];
	    	
	    	if(url !== undefined)
	    		{

	    		// Fetch html and fill into tinymce
	    		$.get(location.origin+ '/misc/email-templates/'+url, function(value){
	    			
	    			$('#content').val(value);
	    			
	    			// Initialize tinymce editor after content obtained
                    init_tinymce();
	    			});
	    		}
	    }
	    
	    // Show empty editor if none of templates selected
	    if(getUrlVars()["id"] === undefined && getUrlVars()["url"] === undefined)
	    {
	    	// Show Back link for email templates
	    	$('#navigate-back').css('display','inline-block');
	    	
	    	init_tinymce();
	    }
	}
	catch(err){
		console.log("Error occured");
		console.log(err);
	}
	
	try
	{
		
	// Gets MergeFields and append them to select option.
	getMergeFields();
	
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
		//window.opener.tinyMCECallBack(getUrlVars()["id"], html);
		window.opener.tinyMCECallBack("tinyMCEhtml_email", html);
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
        toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
        toolbar2: "print preview media | forecolor backcolor emoticons"
       
    });
}
</script>

</head>

<body>
<div id="hld" style='padding:10px'>
	<div class="wrapper" style='min-width:450px;'>

	<!-- wrapper begins -->
		<div class="block small" style="width:100%; float:left;background-color: #f5f5f5;padding: 10px 10px;-webkit-box-shadow: inset 0 1px 1px;border: 1px solid rgba(0, 0, 0, 0.05);border-radius: 4px;box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);">
			<div class="block_head">
				<div class="bheadl"></div>
				<div class="bheadr"></div>
				<div class="page-header"><h2>HTML Editor</h2></div>

				<!-- Merge Fields List -->
				<div style="margin-bottom:10px; height: 25px;">

    				<!-- Back link to navigate to history back  -->
					<a href="#" id="navigate-back" style="font-size: 18px; display:none;">Back </a>
	
					<select style="float:right;" onchange='insertSelectedMergeField(this,"content")' name='merge_fields' title='Select required merge field to insert into editor.' id="merge_fields">
    				</select>
				</div>
				<!-- End of Merge Fields list -->
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

