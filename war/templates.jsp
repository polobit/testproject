<!DOCTYPE html>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.user.UserPrefs"%>
<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<html lang="en">

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

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
	   // HTML textarea id
	   String id = request.getParameter("id");
	
	   // To differ email templates vs modal templates
	   String type = request.getParameter("t");
	%>
	
	<!-- Bootstrap  -->
	<link rel="stylesheet" type="text/css"	href="<%= CSS_PATH%>css/bootstrap-<%=template%>.min.css" />
	<link rel="stylesheet" type="text/css"	href="<%= CSS_PATH%>css/bootstrap-responsive.min.css" />
	
	<!-- Fancy box -->
	<link rel="stylesheet" type="text/css" href="<%= CSS_PATH%>css/jquery.fancybox.css?v=2.1.5" media="screen" />

	<title>AgileCRM Email Templates</title>

	<script type="text/javascript" src="<%= LIB_PATH%>lib/jquery.min.js"></script>
	<script type="text/javascript" src="<%= LIB_PATH%>lib/handlebars-1.0.0.beta.6-min.js"></script>
	
	<script type="text/javascript" src="<%= LIB_PATH%>lib/bootstrap.min.js"></script>

    <!-- Add fancyBox main JS and CSS files -->
	<script type="text/javascript" src="<%= LIB_PATH%>lib/jquery.fancybox.js?v=2.1.5"></script>
	
	<style>
		 div.theme-preview
 		{
 			display: inline-block;
 			text-align: center; 
 		} 
 
.fancybox-nav span {
    visibility: visible;
    opacity: 0.5;
}

.fancybox-nav:hover span {
    opacity: 1;
}

.fancybox-next {
    right: -60px;
}

.fancybox-prev {
    left: -60px;
}
	</style>

</head>

<body>
<div class="container">
	<div class="row">
		<div id="preview-container" class="span12">
			<!-- Container for theme previews -->
			<div id="preview-container-title" class="page-header"></div>
			<div id="preview-container-content"></div>
		</div>
	</div>
</div>
<script>

// Global variable to reuse obtained email templates json
var TEMPLATES_JSON = undefined;

$(function(){
	
	// textarea id
	var id = '<%=id%>';
	var type = '<%=type%>';
	
	if(id === undefined)
		return;
		
	var url;
	
      if(type === 'email')
      		url='/misc/email-templates/email_templates_structure.js';

      if(type === 'web_rules')
    	  url='/misc/modal-templates/modal_templates_structure.js';
      
    	  
   		// Gets email_templates_structure.js
		get_templates_json(url);
   		
		 // When any theme is clicked, opens respective layouts
		 $('div.theme-preview>a').die().live('click', function(e){
		    
			e.preventDefault();
		     	    
		    // Get label to identify clicked theme in json
		    var title = $(this).parent().find('input').val();
		    var layouts=[];

    	    // load all layouts of clicked theme
    	    $.each(TEMPLATES_JSON["templates"], function(index, value){
    			
    	    	// to exit from nested loops
    	    	var flag = true;
    	    	
    			$.each(value.themes, function(index, theme){
    				
    				if(theme.title === title){

    					layouts = theme.layouts;
    				
    					flag = false;
    					
    					return false;
    				
    				}
    			});
    			
    			return flag;
    			
    		});
    	    
        	// Init fancy on layouts
        	show_fancy_box(layouts);
       });
       
});

/**
 * Fetches email_templates_structure.js and render themes.
 **/
 function get_templates_json(url)
{
		// Fetch email_templates_structure.js and render
		$.getJSON(location.origin + url, function(data){

			// Initialize global variable to reuse data
			TEMPLATES_JSON = data;
			
			// render theme previews
			render_theme_previews();
		
		});
	
}

/**
 * Render preview-container with theme previews.
 **/
function render_theme_previews()
{
	var title = '<h2>Select a Template</h2>';
	var textarea_id = '<%= id%>';
	
	var html_link = '<span style="display:inline; float: right; margin-top: -32px;">'
					+'<a class="btn" href="cd_tiny_mce.jsp?id='+textarea_id+'">'
						+'Create your own'
					+'</a></span>'
	
	$('#preview-container-title').html(title + html_link);
	
	$.each(TEMPLATES_JSON["templates"], function(index, value){

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

function show_fancy_box(content_array)
{
	
	var t_id = '<%=id%>';
	
	  // Shows content array in fancybox
    $.fancybox.open(content_array,{
    	padding     : 10,
        margin      : [20, 60, 20, 60],
        helpers : {
     	        overlay : {
     	            css : {
     	                'background' : 'rgba(58, 42, 45, 0.95)'
     	            }
     	        }
     	    },
     	    beforeLoad: function() {

     	    this.href = location.origin + this.href;
             
            this.title = (this.index + 1) + ' of ' + this.group.length + '<br/> <a style="color: white; text-decoration: underline;" href="cd_tiny_mce.jsp?id='+t_id+'&url='+this.link+'">Load in Editor</a>';
         }
 	}); // End of fancybox
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
	<div class="span12">
		<div class="page-header">
			<h3>{{label}}</h3>
		</div>
	
		<div>
		{{#each themes}}
			<div class="span5">
				<div class="theme-preview">
				<!-- Make image as clickable -->
                <a href="#">
 					<img src="{{theme_preview.theme_small}}" width="226px" height="136px" style="border-radius: 3px;border: 3px solid #e0e5e9;background: #fff;" alt="Template image"/>
				</a>
				<p style="padding-top: 15px;">{{label}} ({{this.layouts.length}})</p>

                <!-- To identify the theme clicked -->
  				<input type="hidden" value="{{title}}">
			</div>
			</div>
		{{/each}}
		</div>
       <br/>
	</div>
{{/if}}
</script>

</body>
</html>