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
 
 		h2
 		{
    		padding-left: 90px;
 		}
 
 		hr
 		{
   			margin: 0px 90px 30px 90px;
 		}
 		
 		input.btn
 		{ 
			cursor: pointer; 
		}
	</style>

</head>

<body>

	<div id="theme-preview-container">
		<!-- Container for theme previews -->
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
    	     
    	   // Get label to identify clicked theme in json
    	   var label = $(this).parent().find('input').val();
    	
    	    // load all layouts of clicked theme
    	    $.each(EMAIL_TEMPLATES_JSON["email_templates"], function(index, value){
    			
    	    	// to exit on condition met
    	    	var flag = true;
    	    	
    			$.each(value.themes, function(index, theme){
    				
    				if(theme.label === label){
    				var el = getTemplate('layout-preview', theme);
    				$('#theme-preview-container').html(el);
    				
    				flag = false;
    				return false;
    				
    				}
    			});
    			
    			return flag;
    			
    		});
        });
      
      
      // When any layout is clicked, loads respective html into tinymce editor
      $('li.layout-preview>a').die().live('click', function(e){
    	  e.preventDefault();
    	  
        var url = $(this).parent().attr("data");
    	  
    	var newwindow = window.open('cd_tiny_mce.jsp?url=' + url,'tiny_mce','status=1, height=900,width=800');
   	     
  	 	if (window.focus)
  	 	{
  	 		newwindow.focus();
  	 	}
  	 
      });
      
      // When Back is clicked, render theme previews
      $('#layout-preview-back').die().live('click', function(e){
    	
    	  e.preventDefault();
    	
    	  // Reset container to avoid append
    	  $('#theme-preview-container').html("");
    		
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
 * Render theme-preview-container with theme previews.
 **/
function render_theme_previews()
{
	$.each(EMAIL_TEMPLATES_JSON["email_templates"], function(index, value){

		// Initialize the theme preview container 
		var el = getTemplate('theme-preview', value);
		
		$('#theme-preview-container').append(el);
		
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
		<h2>{{label}}</h2>
		<hr/>
	
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
	<input type="button" class="btn" id="layout-preview-back" value="Back">
</div>

<ul style="list-style: none;">
{{#each layouts}}
	<li class="layout-preview" data="{{url}}">
		<a href="#">
			<img src="/misc/email-templates/{{preview}}" width=250px height=500px alt="Template layout image"/>
		</a>
    	
		<p style="font-style:italic;">{{name}}</p>
	</li>
{{/each}}
</ul>
</script>

</body>
</html>