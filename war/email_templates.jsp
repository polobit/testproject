<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

	<title>AgileCRM Email Templates</title>

	<script type="text/javascript" src="lib/jquery.min.js"></script>
	<script type="text/javascript" src="lib/handlebars-1.0.0.beta.6-min.js"></script>

	<style>
		li.theme-preview, li.layout-preview
 		{
 			width: 350px;
 			height: 600px;
 			display: inline-block;
 			text-align: center; 
 		}
 
 
 		hr
 		{
   			margin: 0px 90px 30px 90px;
 		}
 		
 		h1,h2,h3,h4,h5,h6{margin:0;font-family:Ubuntu;font-weight:400;color:#525252;text-rendering:optimizelegibility;}
		h1{font-size:30px;line-height:36px;}
		h2{font-size:24px;line-height:36px;}
		h3{font-size:18px;line-height:27px;}
 		
 		.page-header{padding-bottom:17px;margin:18px 0;border-bottom:1px solid #f5f5f5;}
	</style>

</head>

<body>

	<div id="preview-container">
		<!-- Container for theme previews -->
		<div id="preview-container-title" class="page-header" style="margin-left:85px;"></div>
		<div id="preview-container-content"></div>
	</div>

<script>

// Global variable to reuse obtained email templates json
var EMAIL_TEMPLATES_JSON = undefined;

$(function(){

      // Gets email_templates_structure.js and fills select field with categories
      get_email_templates_json();
      
      // When any theme is clicked, opens respective layouts
      $('li.theme-preview>a').die().live('click', function(e){
    	    e.preventDefault();
    	    
    	    var title = '<h2>Select a Layout/Color Template</h2>';
    		$('#preview-container-title').html(title);
    	     
    	   // Get label to identify clicked theme in json
    	   var label = $(this).parent().find('input').val();
    	
    	    // load all layouts of clicked theme
    	    $.each(EMAIL_TEMPLATES_JSON["email_templates"], function(index, value){
    			
    	    	// to exit on condition met
    	    	var flag = true;
    	    	
    			$.each(value.themes, function(index, theme){
    				
    				if(theme.label === label){
    				var el = getTemplate('layout-preview', theme);
    				$('#preview-container-content').html(el);
    				
    				flag = false;
    				return false;
    				
    				}
    			});
    			
    			return flag;
    			
    		});
        });
      
      
      // When Back is clicked, render theme previews
      $('#layout-preview-back').die().live('click', function(e){
    	
    	  e.preventDefault();
    	
    	  // Reset container to avoid append
    	  $('#preview-container-title, #preview-container-content').html("");
    		
    	  // render theme previews
    	  render_theme_previews();
    	  
      });
      
});

/**
 * Fetches email_templates_structure.js and render themes.
 **/
 function get_email_templates_json()
{
		// Fetch email_templates_structure.js and render
		$.getJSON(location.origin+'/misc/email-templates/email_templates_structure.js', function(data){

			// Initialize global variable to reuse data
			EMAIL_TEMPLATES_JSON = data;
			
			// render theme previews
			render_theme_previews();
		
		});
	
}

/**
 * Render preview-container with theme previews.
 **/
function render_theme_previews()
{
	var title = '<h2>Select a Theme</h2>';
	
	$('#preview-container-title').html(title);
	
	$.each(EMAIL_TEMPLATES_JSON["email_templates"], function(index, value){

		// Initialize the theme preview container 
		var el = getTemplate('theme-preview', value);
		
		$('#preview-container-content').append(el);
		
	});
}

/**
 * Compiles handlebar template with the given context and 
 * returns the template.
 *
 * @param template_id - template id.
 * @param context - json 
 **/
 function getTemplate(template_id, context){
	var source   = $("#"+template_id+'-template').html();
	var template = Handlebars.compile(source); 
	return template(context);
}

/**
 * Callback to load html into HTML textarea of SendEmail node.
 *
 * @param id - textarea id.
 * @param html - html content
 **/
 function tinyMCECallBack(id, html){
	window.opener.tinyMCECallBack(id, html);
	window.close();
}

/**
 * Fetches merge fields to embed into template.
 */
function getMergeFields(){
	var merge_fields = window.opener.getMergeFields();
	return merge_fields;
}
</script>

<!-- Preview Templates  -->
<script id="theme-preview-template" type="text/x-handlebars-template">
{{#unless this}}
<div style="text-align:center;">
	<img src="img/21-0.gif" alt="Empty image template" style="margin-top:10%">
	<p style="font-style:italic;">Loading...</p>
</div>
{{/unless}}

{{#if this}}
	<div>
		<div class="page-header" style="margin-left: 85px;">
			<h3>{{label}}</h3>
		</div>
	
		<ul style="list-style: none;">
		{{#each themes}}
			<li class="theme-preview">
				<!-- Make image as clickable -->
				<a href="#">
					<img src="/misc/email-templates/{{theme_preview}}" width=250px height=500px alt="Email template image"/>
				</a>
    			
				<p style="font-style:italic;">{{label}} ({{this.layouts.length}})</p>
    			
				<!-- To identify the theme clicked -->
 				<input type="hidden" value="{{label}}">
			</li>
		{{/each}}
		</ul>
	</div>
{{/if}}
</script>

<script id="layout-preview-template" type="text/x-handlebars-template">
<!-- To navigate to theme previews -->
<div>
	<a href="#" id="layout-preview-back" style="margin-left:90px; font-size: 18px;"><< Back</a>
</div>

<ul style="list-style: none;">
{{#each layouts}}
	<li class="layout-preview">
		<a href="cd_tiny_mce.jsp?url={{url}}">
			<img src="/misc/email-templates/{{preview}}" width=250px height=500px alt="Template layout image"/>
		</a>
    	
		<p style="font-style:italic;">{{name}}</p>
	</li>
{{/each}}
</ul>
</script>

</body>
</html>