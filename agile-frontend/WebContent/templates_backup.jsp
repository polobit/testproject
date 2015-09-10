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
	<script type="text/javascript" src="<%= LIB_PATH%>flatfull/lib/jquery-new/jquery.redirect.js"></script>
	
	<script type="text/javascript" src="moment.js"></script>
	<script type="text/javascript" src="<%= LIB_PATH%>lib/handlebars-1.0.0.beta.6-min.js"></script>
	
	<script type="text/javascript" src="<%= LIB_PATH%>lib/bootstrap.min.js"></script>

    <!-- Add fancyBox main JS and CSS files -->
	<script type="text/javascript" src="<%= LIB_PATH%>lib/jquery.fancybox.js?v=2.1.5"></script>
	<link rel="stylesheet" type="text/css" href="/css/agilecrm.css?_=sandbox.1">
	
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

.custom-title
{
	margin: 0 0 15px 0px;
}

.custom-title > h3 
{
  font-size:16.5px;
  color: white;
  text-decoration: underline;
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
var CAMPAIGN_EMAIL_NODES = {};
var USER_TEMPLATES_JSON = {};
var CAMPAIGN_EMAIL_NODES1 = [];
var CAMPAIGN_EMAIL_NODES2 = {};

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
   		
		
		$('.tablerows_clicked').die().live('click', function(e){
			console.log("bhasuri");
			var element = e.currentTarget;
			load_in_editor($(element).attr("data"),"campaign_template");
		});
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
	 var textarea_id = '<%= id%>';
	 if(textarea_id == 'tinyMCEhtml_email')
		 show_email_templates();
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
        width : 100,
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
         },
         afterLoad: function()
         {
        	 // Title on top
        	 $('.fancybox-wrap').prepend("<div class='custom-title'><h3>Select a color theme/layout</h3></div>")
         }
 	}); // End of fancybox
}

function show_email_templates(){
	
	//get list of workflows
	$.getJSON(location.origin + '/core/api/workflows', function(workflows){
		
		var email_nodes = get_email_nodes(workflows);
		if(CAMPAIGN_EMAIL_NODES){
			var el = getTemplate('campaign_templates', CAMPAIGN_EMAIL_NODES2);
			
			$('#preview-container-content').prepend(el);
			
			var el1 = getTemplate('campaign_templates1', CAMPAIGN_EMAIL_NODES2);
			
			$('#preview-container-content').prepend(el1);
		}
		
		$.getJSON(location.origin + '/core/api/email/templates', function(templates){
			
			USER_TEMPLATES_JSON = get_email_templates(templates);
			
			var el1 = getTemplate('user_templates',templates)

			$('#preview-container-content').prepend(el1);
		});
		
	});
}

function get_email_nodes(workflows){
	
	$.each(workflows,function(id,workflow){
		
		var campaign_name = workflow.name;
		var created_time = workflow.created_time;
		var current_node = {};
		var hasEmail = false;
		var nodes = (JSON.parse(workflow.rules)).nodes;
		
		$.each(nodes,function(node_id,node){
			
			
			if(node.NodeDefinition["category"] == 'Email'){
				var json_values =  node.JsonValues;
				
				$.each(json_values,function(node_name,node_value){
					if(node_value.name == "subject")
						node["subject"] = node_value.value;
					else if(node_value.name == "html_email"){
						if(!node_value.value)
							return false;
						node["text"] = node_value.value;
					}
					else if(node_value.name == "nodename")
						node["node_name"] = node_value.value;
					});
				if(!node["text"])
					return true;
				CAMPAIGN_EMAIL_NODES1.push(node);
				node["campaign_name"] = campaign_name;
				node["created_time"] = created_time;
				CAMPAIGN_EMAIL_NODES[node.id]=node;	
		}
		});
		CAMPAIGN_EMAIL_NODES2[workflow.id]=CAMPAIGN_EMAIL_NODES1;
		CAMPAIGN_EMAIL_NODES1 = [];
		
	});
	return CAMPAIGN_EMAIL_NODES;
}

function get_email_templates(templates){
	
	$.each(templates,function(id,template){
		USER_TEMPLATES_JSON[template.id] = template;
	});
	return USER_TEMPLATES_JSON;
}

function load_in_editor(id,template_type){
	var subtype = {};
	if(template_type == 'campaign_template') 
		subtype = CAMPAIGN_EMAIL_NODES;
	
	else
		subtype = USER_TEMPLATES_JSON;
		
		
	
	$.redirect("cd_tiny_mce.jsp?id=tinyMCEhtml_email",{'data':JSON.stringify(subtype[id])})
}

Date.prototype.format=function(e){var t="";var n=Date.replaceChars;for(var r=0;r<e.length;r++){var i=e.charAt(r);if(r-1>=0&&e.charAt(r-1)=="\\"){t+=i}else if(n[i]){t+=n[i].call(this)}else if(i!="\\"){t+=i}}return t};Date.replaceChars={shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longMonths:["January","February","March","April","May","June","July","August","September","October","November","December"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longDays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],d:function(){return(this.getDate()<10?"0":"")+this.getDate()},D:function(){return Date.replaceChars.shortDays[this.getDay()]},j:function(){return this.getDate()},l:function(){return Date.replaceChars.longDays[this.getDay()]},N:function(){return this.getDay()+1},S:function(){return this.getDate()%10==1&&this.getDate()!=11?"st":this.getDate()%10==2&&this.getDate()!=12?"nd":this.getDate()%10==3&&this.getDate()!=13?"rd":"th"},w:function(){return this.getDay()},z:function(){var e=new Date(this.getFullYear(),0,1);return Math.ceil((this-e)/864e5)},W:function(){var e=new Date(this.getFullYear(),0,1);return Math.ceil(((this-e)/864e5+e.getDay()+1)/7)},F:function(){return Date.replaceChars.longMonths[this.getMonth()]},m:function(){return(this.getMonth()<9?"0":"")+(this.getMonth()+1)},M:function(){return Date.replaceChars.shortMonths[this.getMonth()]},n:function(){return this.getMonth()+1},t:function(){var e=new Date;return(new Date(e.getFullYear(),e.getMonth(),0)).getDate()},L:function(){var e=this.getFullYear();return e%400==0||e%100!=0&&e%4==0},o:function(){var e=new Date(this.valueOf());e.setDate(e.getDate()-(this.getDay()+6)%7+3);return e.getFullYear()},Y:function(){return this.getFullYear()},y:function(){return(""+this.getFullYear()).substr(2)},a:function(){return this.getHours()<12?"am":"pm"},A:function(){return this.getHours()<12?"AM":"PM"},B:function(){return Math.floor(((this.getUTCHours()+1)%24+this.getUTCMinutes()/60+this.getUTCSeconds()/3600)*1e3/24)},g:function(){return this.getHours()%12||12},G:function(){return this.getHours()},h:function(){return((this.getHours()%12||12)<10?"0":"")+(this.getHours()%12||12)},H:function(){return(this.getHours()<10?"0":"")+this.getHours()},i:function(){return(this.getMinutes()<10?"0":"")+this.getMinutes()},s:function(){return(this.getSeconds()<10?"0":"")+this.getSeconds()},u:function(){var e=this.getMilliseconds();return(e<10?"00":e<100?"0":"")+e},e:function(){return"Not Yet Supported"},I:function(){var e=null;for(var t=0;t<12;++t){var n=new Date(this.getFullYear(),t,1);var r=n.getTimezoneOffset();if(e===null)e=r;else if(r<e){e=r;break}else if(r>e)break}return this.getTimezoneOffset()==e|0},O:function(){return(-this.getTimezoneOffset()<0?"-":"+")+(Math.abs(this.getTimezoneOffset()/60)<10?"0":"")+Math.abs(this.getTimezoneOffset()/60)+"00"},P:function(){return(-this.getTimezoneOffset()<0?"-":"+")+(Math.abs(this.getTimezoneOffset()/60)<10?"0":"")+Math.abs(this.getTimezoneOffset()/60)+":00"},T:function(){var e=this.getMonth();this.setMonth(0);var t=this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/,"$1");this.setMonth(e);return t},Z:function(){return-this.getTimezoneOffset()*60},c:function(){return this.format("Y-m-d\\TH:i:sP")},r:function(){return this.toString()},U:function(){return this.getTime()/1e3}}

Handlebars.registerHelper('epochToHumanDate', function(format, date, value)
		{
			if(value.length){
				var campaign_details = value[0];
				date = campaign_details.created_time;	
			}
				

			if (!format)
				format = "mmm dd yyyy HH:MM:ss";

			if (!date)
				return;

			if ((date / 100000000000) > 1)
			{
				console.log(new Date(parseInt(date)).format(format));
				return new Date(parseInt(date)).format(format, 0);
			}
			// date form milliseconds
			var d = jQuery.timeago(new Date(parseInt(date)*1000));
			return d

			// return $.datepicker.formatDate(format , new Date( parseInt(date) *
			// 1000));
		});

Handlebars.registerHelper('epochToHumanDate_eachkeys', function(format, value){
	var campaign_details = value[0];
	value = campaign_details.created_time;
	
	 var source = '{{epochToHumanDate "" created_time}}';
	    var context = {created_time:value};
	    var html = Handlebars.compile(source)(context);
	    return new Handlebars.SafeString(html);
});

	Handlebars.registerHelper('eachkeys', function(context, options)
		{
			var fn = options.fn, inverse = options.inverse;
			var ret = "";

			var empty = true;
			for (key in context)
			{
				empty = false;
				break;
			}

			if (!empty)
			{
				for (key in context)
				{
					ret = ret + fn({ 'key' : key, 'value' : context[key] });
				}
			}
			else
			{
				ret = inverse(this);
			}
			return ret;
		});
	
	Handlebars.registerHelper('if_greater', function(value, campare_with, options){
		if(campare_with < value ) return options.fn(this);
		return options.inverse(this);
		
	});
	Handlebars.registerHelper('get_campaign_name', function(value, campare_with, options){
		var campaign_details = value[0];
		if(campaign_details)
		return campaign_details.campaign_name;
		else 
			return "";
		
	})

	Handlebars.registerHelper('get_node_name', function(value, campare_with, options){
		var campaign_details = value[0];
		return campaign_details.node_name;
		
	})
	
	Handlebars.registerHelper('get_created_time', function(value, campare_with, options){
		var campaign_details = value[0];
		return campaign_details.created_time;
		
	})
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

<script id="user_templates-template" type="text/x-handlebars-template">
<div class="span12"><div class="page-header">
<h3>User Email templates</h3>
</div>
<div>
<div id="preview-container-content">
<table class="table table-striped showCheckboxes panel agile-table" url="">
<thead>
    <tr>
		<th class="hide header">Id</th>                    
		<th style="width:30%;" class="header">Name</th>
        <th style="width:30%;" class="header">Subject</th>
        <th style="width:40%;" class="header"></th>
    </tr>

</thead>
<tbody id="settings-email-templates-model-list" route="email-template/" class="agile-edit-row">
{{#each this}}
<tr onClick = 'load_in_editor("{{id}}","user_template")' style="cursor:pointer">
<td class='data hide' data='{{id}}'>{{id}}</td>
<td>
		<div class="table-resp">
    		{{name}}
    	</div>
    </td> 
    <td>
    	<div class="table-resp">
    		{{subject}}
    	</div>
    </td>   
    <td class="text-muted" style="color: #b2b0b1;">
       {{#if created_time}}
          <div class="text-muted table-resp text-xs"> <i class="fa fa-clock-o m-r-xs"></i>
    	       Created <time class="created_time time-ago" value="{{created_time}}" datetime="{{epochToHumanDate "" created_time}}">{{epochToHumanDate "ddd mmm dd yyyy" created_time}}</time>
          </div>
       {{/if}}
    </td>
</tr>

{{/each}}
</tbody>
</table>
</div>
</div>
</script>

<script id="campaign_templates1-template" type="text/x-handlebars-template">
<div class="span12"><div class="page-header">
<h3>Campaign Templates</h3>
</div>
<div>
<div id="preview-container-content">
<table class="table table-striped showCheckboxes panel agile-table" url="">
<thead>
    <tr>
		<th class="hide header">Id</th>                    
		<th style="width:30%;" class="header">Campaign Name</th>
        <th style="width:30%;" class="header">Subject</th>
        <th style="width:40%;" class="header"></th>
    </tr>

</thead>
<tbody id="settings-email-templates-model-list" route="email-template/" class="agile-edit-row">
{{#eachkeys this}}

<tr onClick = 'load_in_editor("{{key}}","user_template")' style="cursor:pointer">


{{#if_greater value.length "1"}}
<td class='data hide' data='{{value.id}}'>{{value.id}}</td>
<td>
		<div class="table-resp">
    		{{get_campaign_name value}}
    		<a href="#" style="float: right;" class="multiple-add"><i class="icon-plus"></i></a>
    	</div>
    	</div>
    </td> 
    <td>
    </td>   
    <td class="text-muted" style="color: #b2b0b1;">
          <div class="text-muted table-resp text-xs"> <i class="fa fa-clock-o m-r-xs"></i>
    	       Created <time class="created_time time-ago" value="{{get_created_time value}}" datetime="{{epochToHumanDate_eachkeys "ddd mmm dd yyyy" value}}">{{epochToHumanDate_eachkeys "ddd mmm dd yyyy" value}}</time>
          </div>
    </td>



{{else}}

{{#eachkeys value}}
<td class='data hide' data='{{key}}'>{{key}}</td>
<td>
		<div class="table-resp">
    		{{value.campaign_name}}
    	</div>
    </td> 
    <td>
    	<div class="table-resp">
    		{{value.subject}}
    	</div>
    </td>   
    <td class="text-muted" style="color: #b2b0b1;">
       {{#if value.created_time}}
          <div class="text-muted table-resp text-xs"> <i class="fa fa-clock-o m-r-xs"></i>
    	       Created <time class="created_time time-ago" value="{{value.created_time}}" datetime="{{epochToHumanDate "" value.created_time}}">{{epochToHumanDate "ddd mmm dd yyyy" value.created_time}}</time>
          </div>
       {{/if}}
    </td>

{{/eachkeys}}
{{/if_greater}}


</tr>

{{/eachkeys}}
</tbody>
</table>
</div>
</div>
</script>

<script id="campaign_templates-template" type="text/x-handlebars-template">
<div class="span12">
	<div class="page-header">
		<h3>Campaign templates</h3>
	</div>

	<div>
		<div id="preview-container-content">
			<div class="accordion" id="campaigns-accordion">alfkjd
				<div id="campaign-names-list1">
					{{#eachkeys this}}
						<div>
							<form id="campaign_form_{{key}}" class="form-horizontal m-t-sm m-b-none pipeline" method=post>
								<div id="{{key}}-campaign-email-subject" class="accordion-group overflow-hidden m-b-xs"  >
									<div class="accordion-heading" style="background:#f5f5f5;">ddd
										<h4>
											<div>
											{{get_campaign_name value}}sss
											<a class="accordion-toggle collapsed pull-left text-l-none-hover" style="width:90%" data-toggle="collapse" data-parent="#campaigns-accordion" href="#campaign-name-{{key}}-accordion">
											<i class="icon-plus" style="float: right;margin-right: -58px;"></i>
											</a>
											</div>
										</h4>
										<div class="clearfix"></div>
									</div>
									<div class="collapse" id="campaign-name-{{key}}-accordion">
										<fieldset>
    										<div class="control-group m-b-none">  	 
												<div id ="email-subject-{{key}}">
													<table class="table table-bordered agile-ellipsis-dynamic custom-fields-table m-b-xxs" >
														<colgroup><col width="50%"><col width="3%"></colgroup>
														<tbody class="campaigns-tbody ui-sortable">
															{{#eachkeys value}}
																<tr class="tablerows_clicked" style="display: table-row;"  data="{{value.id}}">
																	<td>
																		<div class="p-l-sm inline-block v-top text-ellipsis" style="width:80%">{{value.subject}}</div>
																	</td>
																	<td class="p-r-none">
																		<div class="m-b-n-xs" style="display:none;"></div>
																	</td>
																</tr>
															{{/eachkeys}}
														</tbody>
													</table>
												</div>
    										</div> 
    									</fieldset>
    	 							</div>
								</div>
							</form>
						</div>
					{{/eachkeys}}
				</div>
			</div>
		</div>
	</div>
</div>

</div>
</script>

</body>
</html>








<div class="span11">
	<div class="page-header">
		<h3>Campaign templates</h3>
	</div>

	<div>
		<div id="preview-container-content">
			<div class="accordion" id="campaigns-accordion">
				<div id="campaign-names-list">
					{{#eachkeys this}}
						<div>
							<form id="campaign_form_{{key}}" class="form-horizontal m-t-sm m-b-none pipeline" method=post>
								<div id="{{key}}-campaign-email-subject" class="accordion-group overflow-hidden m-b-xs"  >
									<div class="accordion-heading" style="background:#f5f5f5;">
										<h4><a class="accordion-toggle collapsed pull-left text-l-none-hover" style="width:90%" data-toggle="collapse" data-parent="#campaigns-accordion" href="#campaign-name-{{key}}-accordion">{{get_campaign_name value}}</a>
										</h4>
										<div class="clearfix"></div>
									</div>
									<div class="collapse" id="campaign-name-{{key}}-accordion">
										<fieldset>
    										<div class="control-group m-b-none">  	 
												<div id ="email-subject-{{key}}">
													<table class="table table-bordered agile-ellipsis-dynamic custom-fields-table m-b-xxs" >
														<colgroup><col width="50%"><col width="3%"></colgroup>
														<tbody class="campaigns-tbody ui-sortable">
															{{#eachkeys value}}
																<tr class="tablerows_clicked" style="display: table-row;"  data="{{value.id}}">
																	<td>
																		<div class="p-l-sm inline-block v-top text-ellipsis" style="width:80%">{{value.subject}}</div>
																	</td>
																	<td class="p-r-none">
																		<div class="m-b-n-xs" style="display:none;"></div>
																	</td>
																</tr>
															{{/eachkeys}}
														</tbody>
													</table>
												</div>
    										</div> 
    									</fieldset>
    	 							</div>
								</div>
							</form>
						</div>
					{{/eachkeys}}
				</div>
			</div>
		</div>
	</div>
</div>

</div>
