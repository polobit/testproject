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
	var merge_fields = window.opener.getMergeFields('send_email');
	
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
        toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
        toolbar2: "print preview media | forecolor backcolor",
        valid_elements: "*[*]",
        extended_valid_elements: "*[*]",
        style_formats: [
                        {
                            title: "Headers",
                            items: [
                                {
                                    title: "Header 1",
                                    format: "h1"
                                },
                                {
                                    title: "Header 2",
                                    format: "h2"
                                },
                                {
                                    title: "Header 3",
                                    format: "h3"
                                },
                                {
                                    title: "Header 4",
                                    format: "h4"
                                },
                                {
                                    title: "Header 5",
                                    format: "h5"
                                },
                                {
                                    title: "Header 6",
                                    format: "h6"
                                }
                            ]
                        },
                        {
                            title: "Inline",
                            items: [
                                {
                                    title: "Bold",
                                    icon: "bold",
                                    format: "bold"
                                },
                                {
                                    title: "Italic",
                                    icon: "italic",
                                    format: "italic"
                                },
                                {
                                    title: "Underline",
                                    icon: "underline",
                                    format: "underline"
                                },
                                {
                                    title: "Strikethrough",
                                    icon: "strikethrough",
                                    format: "strikethrough"
                                },
                                {
                                    title: "Superscript",
                                    icon: "superscript",
                                    format: "superscript"
                                },
                                {
                                    title: "Subscript",
                                    icon: "subscript",
                                    format: "subscript"
                                },
                                {
                                    title: "Code",
                                    icon: "code",
                                    format: "code"
                                }
                            ]
                        },
                        {
                            title: "Blocks",
                            items: [
                                {
                                    title: "Paragraph",
                                    format: "p"
                                },
                                {
                                    title: "Blockquote",
                                    format: "blockquote"
                                },
                                {
                                    title: "Div",
                                    format: "div"
                                },
                                {
                                    title: "Pre",
                                    format: "pre"
                                }
                            ]
                        },
                        {
                            title: "Alignment",
                            items: [
                                {
                                    title: "Left",
                                    icon: "alignleft",
                                    format: "alignleft"
                                },
                                {
                                    title: "Center",
                                    icon: "aligncenter",
                                    format: "aligncenter"
                                },
                                {
                                    title: "Right",
                                    icon: "alignright",
                                    format: "alignright"
                                },
                                {
                                    title: "Justify",
                                    icon: "alignjustify",
                                    format: "alignjustify"
                                }
                            ]
                        },
                        {
                            title: "Font Family",
                            items: [
                                {
                                    title: 'Arial',
                                    inline: 'span',
                                    styles: {
                                        'font-family': 'arial'
                                    }
                                },
                                {
                                    title: 'BookAntiqua',
                                    inline: 'span',
                                    styles: {
                                        'font-family': 'bookantiqua'
                                    }
                                },
                                {
                                    title: 'Comic Sans MS',
                                    inline: 'span',
                                    styles: {
                                        'font-family': 'comic sans ms, sans-serif'
                                    }
                                },
                                {
                                    title: 'Courier New',
                                    inline: 'span',
                                    styles: {
                                        'font-family': 'courier new, monospace'
                                    }
                                },
                                {
                                    title: 'Garamond',
                                    inline: 'span',
                                    styles: {
                                        'font-family': 'garamond, serif'
                                    }
                                },
                                {
                                	title: 'Georgia',
                                    inline: 'span',
                                    styles: {
                                        'font-family': 'georgia, serif'
                                    }
                                }, 
                                {
                                    title: 'Helvetica',
                                    inline: 'span',
                                    styles: {
                                        'font-family': 'helvetica'
                                    }
                                },
                                {
                                    title: 'Impact',
                                    inline: 'span',
                                    styles: {
                                        'font-family': 'impact,chicago'
                                    }
                                },
                                {
                                    title: 'OpenSans',
                                    inline: 'span',
                                    styles: {
                                        'font-family': 'OpenSans'
                                    }
                                },
                                {
                                    title: 'Sans Serif',
                                    inline: 'span',
                                    styles: {
                                        'font-family': 'arial, helvetica, sans-serif'
                                    }
                                },
                                {
                                    title: 'Serif',
                                    inline: 'span',
                                    styles: {
                                        'font-family': 'times new roman, serif'
                                    }
                                },
                                {
                                	title: 'Tahoma',
                                    inline: 'span',
                                    styles: {
                                        'font-family': 'tahoma, sans-serif'
                                    }
                                },
                                {
                                    title: 'Terminal',
                                    inline: 'span',
                                    styles: {
                                        'font-family': 'terminal,monaco'
                                    }
                                },
                                {
                                    title: 'TimesNewRoman',
                                    inline: 'span',
                                    styles: {
                                        'font-family': 'timesnewroman,times'
                                    }
                                },
                                {
                                	title: 'Trebuchet MS',
                                    inline: 'span',
                                    styles: {
                                        'font-family': 'trebuchet ms, sans-serif'
                                    }
                                },
                                {
                                    title: 'Verdana',
                                    inline: 'span',
                                    styles: {
                                        'font-family': 'Verdana'
                                    }
                                }
                            ]
                        },
                        {
                            title: "Font Size",
                            items: [
                                {
                                    title: 'Small',
                                    inline: 'span',
                                    styles: {
                                        fontSize: 'x-small',
                                        'font-size': 'x-small'
                                    }
                                },
                                {
                                    title: 'Normal',
                                    inline: 'span',
                                    styles: {
                                        fontSize: 'small',
                                        'font-size': 'small'
                                    }
                                },
                                {
                                    title: 'Large',
                                    inline: 'span',
                                    styles: {
                                        fontSize: 'large',
                                        'font-size': 'large'
                                    }
                                },
                                {
                                    title: 'Huge',
                                    inline: 'span',
                                    styles: {
                                        fontSize: 'xx-large',
                                        'font-size': 'xx-large'
                                    }
                                }
                            ]
                        }
                    ]
       
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

