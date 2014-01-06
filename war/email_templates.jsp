<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<title>AgileCRM Email Templates</title>

<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=7" /><![endif]-->
<!--[if lt IE 8]><style type="text/css" media="all">@import url("css/ie.css");</style><![endif]-->
<!--[if IE]><script type="text/javascript" src="js/excanvas.js"></script><![endif]-->

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
</style>

</head>

<body>
<div id="header">
	<select id="template-selector">
		<option value="">Select email template</option>
	</select>
</div>

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
      $('li.theme-preview').die().live('click', function(e){
    	    e.preventDefault();
    	     
    	   // Get label to identify clicked theme in json
    	   var label = $(this).find('p').text();
    	
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
      $('li.layout-preview').die().live('click', function(e){
    	  e.preventDefault();
    	  
    	  var url = $(this).attr("data");
    	  
    	var newwindow = window.open('cd_tiny_mce.jsp?url=' + url,'tinymce','status=1, height=900,width=800');
   	     
  	 	if (window.focus)
  	 	{
  	 		newwindow.focus();
  	 	}
  	 
      });
      
      // Shows respective theme previews based on selected category.
      $('#template-selector').die().live('change', function(e){
    	  e.preventDefault();
    	  
    	  var category =  $(this).val();
    	  
    	  if(category === '')
    	  {
    		var el = getTemplate('theme-preview', undefined);
			$('#theme-preview-container').html(el);
			
			return;
    	  }
    	  
    	 $.each(EMAIL_TEMPLATES_JSON["email_templates"], function(index, value){
    		 
    		 if(value["category"] === category){
    			
    			var el = getTemplate('theme-preview', value);
 				$('#theme-preview-container').html(el);
    	    	
 				return false;
       	      }
    		 
    	 }); 
    	  
      });
      
});

/**
 * Fetches email_templates_structure.js and fills select element with categories.
 **/
 function get_email_templates_json()
{
	$.getJSON(location.origin+'/misc/email-templates/email_templates_structure.js', function(data){

		// Initialize global variable to reuse data
		EMAIL_TEMPLATES_JSON = data;
		
		$.each(EMAIL_TEMPLATES_JSON["email_templates"], function(index, value){

			$('#template-selector').append('<option value='+value.category+'>'+ value.label+'</option>');
     		
			// Initialize the theme preview container 
			var el = getTemplate('theme-preview', undefined);
			$('#theme-preview-container').html(el);
			
		});
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

<script id="theme-preview-template" type="text/x-handlebars-template">
{{#unless this}}
<div style="text-align:center;">
<img src="img/empty-email-template.png" alt="Empty image template" style="margin-top:10%">
<p style="font-style:italic;">No email template selected.</p>
</div>
{{/unless}}

{{#if this}}
<ul style="list-style: none;">
{{#each themes}}
<li class="theme-preview">
	<a href="#">
	<img src="/misc/email-templates/{{theme_preview}}" width=250px height=500px alt="Email template image"/>
	</a>
    <p style="font-style:italic;">{{label}}</p>
</li>
{{/each}}
</ul>
{{/if}}
</script>

<script id="layout-preview-template" type="text/x-handlebars-template">
<ul style="list-style: none;">
{{#each layouts}}
<li class="layout-preview" data="{{url}}">
	<a href="#">
	<img src="/misc/email-templates/{{preview}}" width=250px height=500px alt="Template layout image"/>
	</a>
</li>
{{/each}}
</script>

</body>
</html>