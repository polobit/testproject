<script id="widgets-add-model-template" type="text/html"> 
<div class="panel wrapper widget-add" >
   {{#if_equals name "Sip"}}  
   <center>  
    <span class="thumbnail m-b-none text-2x thumb-xl text-center  bg-transparent"><span class="block"><i class="icon icon-phone"></i>SIP <span class="label label-danger text-xs"> Beta</span></span></span>
   </center>
   {{else}} 
      {{#if_equals name "CallScript"}}
     <center>    
        <span  class="thumbnail text-2x text-center  bg-transparent m-b-none thumb-xl m-t-sm" style="font-size:21px;"><span class="block"><i class="icon icon-comment m-r-xs"></i>Call Script</span></span>
     </center>  
    {{else}}
      <center> 
        <img class="thumbnail m-b-none img-responsive thumb-xl bg-transparent" src="{{logo_url}}" />
      </center>   
   {{/if_equals}}
   {{/if_equals}}
	<br />
    <div class="text-flow-ellipsis line-clamp line-clamp-3 m-b widget-text" style="height:60px"  rel="tooltip" title="{{description}}">
		{{description}}
	</div>
    <div>
		{{#if_equals widget_type "CUSTOM"}}
			{{#if is_added}}
				{{add_tag "Widgets"}}
				<div class="btn-group inline-block">
        			<a class="btn btn-sm btn-danger" id="delete-widget" widget-name="{{name}}">Delete</a>
        			<a class="btn btn-sm btn-danger dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
					<ul class="dropdown-menu text-base">
						<li><a id="remove-widget" widget-name="{{name}}">Uninstall</a></li>
					</ul>
				</div>
				<!--<a href="#Custom-widget/{{id}}" class="btn btn-sm btn-default inline-block m-t-n-md" id="setting-widget" set-widget-name="{{name}}">Settings</a>-->
    		{{else}}
    			<a class="btn btn-sm btn-default install-custom-widget" href="#Custom-widget" widget-name="{{name}}">Add</a>
				<a class="btn btn-sm btn-danger" id="remove-widget" widget-name="{{name}}">Uninstall</a>    		
			{{/if}}
		{{else}}
			{{#if is_added}}
				{{add_tag "Widgets"}}
    			<a class="btn btn-sm btn-danger" id="delete-widget" widget-name="{{name}}">Delete</a>
                {{#if_equals name "CallScript"}}  
                   <a href="#callscript/{{id}}" class="btn btn-sm btn-default" id="setting-widget" set-widget-name="{{name}}">Settings</a>
                {{else}}{{#if_equals name "Twilio"}}
                           <a></a>
                        {{else}}
				           <a href="#{{name}}/{{id}}" class="btn btn-sm btn-default" id="setting-widget" set-widget-name="{{name}}">Settings</a>
                        {{/if_equals}}
                {{/if_equals}}
    		{{else}}
				{{#check_plan "FREE"}}
					{{#if_equals widget_type "SOCIAL"}}
						<a class="btn btn-sm btn-default add-widget" href="#{{name}}" widget-name="{{name}}">Add</a>
						{{else}}
							{{#if_equals widget_type "CALL"}}
                               {{#if_equals name "CallScript"}}
                                          <a class="btn btn-sm btn-default add-widget" href="#callscript" widget-name="{{name}}">Add</a>
                               {{else}}{{#if_equals name "Twilio"}}
                                            <a></a>
                                       {{else}}
                                            <a class="btn btn-sm btn-default add-widget" href="#{{name}}" widget-name="{{name}}">Add</a>
							           {{/if_equals}}
							   {{/if_equals}}
							{{else}}
								<a class="btn btn-sm btn-default" disabled="disabled">Add</a><span class="m-l-xs"><i>Paid accounts only</i></span>
							{{/if_equals}}
					{{/if_equals}}
					{{else}}
                       {{#if_equals name "CallScript"}}
                          <a class="btn btn-sm btn-default add-widget" href="#callscript" widget-name="{{name}}">Add</a>
                       {{else}}{{#if_equals name "Twilio"}}
                                   <a></a>
                               {{else}}
     				               <a class="btn btn-sm btn-default add-widget" href="#{{name}}" widget-name="{{name}}">Add</a>
                               {{/if_equals}}
                       {{/if_equals}}    	
				{{/check_plan}}
    		{{/if}}
		{{/if_equals}}
	</div>
</div>
</script>

<script id="widgets-add-collection-template" type="text/html">
<div class="row">
<div class="col-md-12">
    <div class="row">
	<div class="col-md-12">
     		<h4 class="m-b"> Social <small>Know your customer social activity</small></h4>
           
       
                <div id="social" class="row">
                </div>
    </div>
	</div>
	<div class="row">
	<div class="col-md-12">
    
            <h4 class="m-b">Customer Support <small>View tickets and chats</small></h4>
      
                <div id="support" class="row">
                </div>
    </div>
	</div>
	<div class="row">
	<div class="col-md-12" style="display:none;">
      
            <h4 class="m-b">Email <small>Send and Receive Email</small></h4>
       
                <div id="email" class="row">
                </div>
    </div>
	</div>
	<div class="row">
    <div class="col-md-12">

            <h4 class="m-b">Calling <small>Make & Receive calls from Agile</small></h4>
        
                <div id="call" class="row">
                </div>
    </div>
	</div>
	<div class="row">
    <div class="col-md-12">
        
            <h4 class="m-b">Billing <small>View and send invoices</small></h4>
      
                <div id="billing" class="row">
                </div>
    </div>
	</div>
	<div class="row">
  <div class="col-md-12">
        
            <h4 class="m-b">Ecommerce <small>View Customer Orders Details</small></h4>
      
                <div id="ecommerce" class="row">
                </div>
    </div>

	</div>
	<div class="row">
	<div class="col-md-12">
	
            <h4 class="m-b">Custom Widgets <small>Add your widgets</small></h4>
       
			<div id="custom" class="row">
				<div class="col-md-4" id="custom-widget" >
					<div class="panel wrapper widget-add">
    					<center><div class="thumbnail m-b-none img-responsive thumb-xl bg-transparent"><i class="icon-puzzle-piece icon-3x"></i></div></center>
    					<h3>Custom widget</h3>
    				
    					<div>
    						<a class="btn btn-sm btn-default m-t-md" id="add-custom-widget">Add custom widget</a>
						</div>
					</div>
				</div>
			</div>
    	</div>
</div>
</div>
</div>
</script>

<script id="add-custom-widget-template" type="text/html">
	<div class="panel panel-default">
	<div class="panel-heading font-bold"><h4 class="h4">Enter custom widget details</h4></div>
	<div class="panel-body">
		<form  id="custom_widget_form" name="custom_widget_login_form" method="post">
	    	<fieldset>
				
				<input type="hidden" id="widget_type" class="input-medium required form-control" value="CUSTOM" name="widget_type"></input>
				<div class="control-group form-group"><div class="controls"><input type="text" id="name" class="input-medium required widget_input_box form-control"  placeholder="Widget name" value="" name="name"></input></div></div>
				<div class="control-group form-group"><div class="controls"><input type="text" id="description" class="input-medium required widget_input_box form-control"  placeholder="Description" value="" name="description"></input></div></div>
				<div class="control-group form-group"><div class="controls">
				<select name="script_type" id="script_type" class="required form-control" >
					<option value="script">HTML</option> 
					<option value="url">URL</option> 
				</select></div></div>
				<div class="control-group form-group"><div class="controls">
					<span id="script_div">
						<span class="help-block">Documentation for <a href="https://github.com/agilecrm/widget-api-html" target="_blank">widget JS API</a></span>
						<textarea rows="4" class="required form-control" name="script" id="script" value="" placeholder="Paste your HTML source of widget. It may contain embedded script that make use of Agile widgets API"></textarea>
					</span>
					<span id="url_div" style="display:none;">
						<span class="help-block">Documentation for <a href="https://github.com/agilecrm/widget-api-backend" target="_blank">widget backend API</a></span>
						<input type="url" id="url" class="input-medium required widget_input_box form-control"  placeholder="Webhook URL" value="" name="url"></input>
					</span>
				</div></div>
				<div class="control-group form-group"><div class="controls"><input type="url" id="logo_url" class="input-medium required widget_input_box form-control"  placeholder="Logo URL" value="" name="logo_url"></input></div></div>
				<div class="control-group form-group"><div class="controls"><input type="url" id="mini_logo_url" class="input-medium required widget_input_box form-control"  placeholder="Mini logo URL" value="" name="mini_logo_url"></input></div></div>
				<div class="form-actions m-t">
					<a type="reset" id="cancel_custom_widget" class="btn btn-default btn-sm">Cancel</a>
               		<a id="save_custom_widget" type="submit" class="save btn btn-sm btn-primary">Install</a>
             	</div>
			 </fieldset>
	    </form>
	</div>
	</div>
</script>

<script id="revoke-access-template" type="text/html">
<div>
	Revoke access to the previous account.
	<p class="m-t" >
		<a class='btn btn-sm btn-danger revoke-widget text-l-none' widget-name="{{name}}">Revoke Access</a> 
	</p>
</div>
</script>

 
<script id="widget-settings-template" type="text/html">
<div class="row">
<div class="col-md-4 col-sm-6 col-xs-12">
<div class="panel wrapper" >
{{#if_equals name "Sip"}}
    <center><span class="thumbnail m-b-none text-2x thumb-xl text-center  bg-transparent"><span class="block"><i class="icon icon-phone m-r"></i>SIP</span></span></center>
{{else}}
    {{#if_equals name "CallScript"}}
        <center><span class="thumbnail text-2x text-center  bg-transparent m-b-none thumb-xl" style="font-size:21px;"><span class="block"><i class="icon icon-comment m-r-xs"></i>Call Script</span></span></center>
    {{else}}
        <center><img class="thumbnail bg-transparent thumb-xl img-responsive" src="{{logo_url}}" /></center>
    {{/if_equals}}
{{/if_equals}}  
	<div  id="widget-settings" widget-name="{{name}}">
	</div>
</div>
</script>

<script id="widget-settings-error-template" type="text/html">
<div>{{show_link_in_statement error_message}}</div>
<a href="{{error_url}}" class"text-l-none" widget-name="{{name}}">Try again</a>
</script>
<script id="custom-widget-settings-template" type="text/html">
<div class="panel panel-heading widget-edit">
	<div class="panel-heading">
		<h4 class="h4">Edit custom widget details</h4>
	</div>
<div class="panel-body">
		<form class="b-b-none m-t-n-sm m-b-none" id="custom_widget_form" name="custom_widget_login_form" method="post">
	    	<fieldset>
				<input type="hidden" id="widget_type" class="input-medium required" style="width:90%" value="CUSTOM" name="widget_type"></input>
				<div class="control-group m-b-none"><div class="controls"><input type="text" id="name" class="input-medium required widget_input_box form-control" style="width:90%" placeholder="Widget name" value={{name}} name="name"></input></div></div>
				<div class="control-group m-b-none"><div class="controls"><input type="text" id="description" class="input-medium required widget_input_box form-control" style="width:90%"  value={{description}} name="description"></input></div></div>
				<div class="control-group m-b-none"><div class="controls">
				<select name="script_type" id="script_type" class="required form-control w-half">
					<option value="script">HTML</option> 
					<option value="url">URL</option> 
				</select></div></div>
				<div class="control-group m-b-none"><div class="controls">
					<span id="script_div">
						<span class="help-block">Documentation for <a href="https://github.com/agilecrm/widget-api-html" target="_blank">widget JS API</a></span>
						<textarea rows="4" class="required" name="script" id="script" value={{script}} placeholder="Paste your HTML source of widget. It may contain embedded script that make use of Agile widgets API"></textarea>
					</span>
					<span id="url_div" style="display:none;">
						<span class="help-block">Documentation for <a href="https://github.com/agilecrm/widget-api-backend" target="_blank">widget backend API</a></span>
						<input type="url" id="url" class="input-medium required widget_input_box form-control" style="width:90%;" placeholder="Webhook URL" value={{url}} name="url"></input>
					</span>
				</div></div>
				<div class="control-group m-b-none"><div class="controls"><input type="url" id="logo_url" class="input-medium required widget_input_box" style="width:90%" placeholder="Logo URL" value={{logo_url}} name="logo_url"></input></div></div>
				<div class="control-group m-b-none"><div class="controls"><input type="url" id="mini_logo_url" class="input-medium required widget_input_box" style="width:90%" placeholder="Mini logo URL" value={{mini_logo_url}} name="mini_logo_url"></input></div></div>
				<div class="form-actions p-t p-r-md p-b-none p-l-md m-t m-b-none">
               		<a id="save_custom_widget" type="submit" class="save btn btn-sm btn-primary">Save</a>
               		<a type="reset" id="cancel_custom_widget" class="btn btn-default btn-sm">Cancel</a>
             	</div>
			 </fieldset>
	    </form>
	</div>
	</div>
</script><script id="widgets-model-template" type="text/html">
{{#if prefs}}
	{{add_tag "Widgets"}}
{{/if}}
     {{#if_equals name "Sip"}}
	  <div class="panel" id="{{remove_spaces name}}-container" style="display:none;">
    {{else}}
      <div class="panel" id="{{remove_spaces name}}-container">       
    {{/if_equals}}
	   <h4 class="widget_header_name font-thin padder m-b-none b-b p-b-sm p-r-none b-light" onmouseover="showIcons(this); return false;" onmouseout="hideIcons(this); return false;">
		{{#if_equals name "Linkedin"}}LinkedIn
        {{else}}{{#if_equals name "GooglePlus"}}Google+
                {{else}}{{#if_equals name "HelpScout"}}Help Scout
                        {{else}}{{#if_equals name "Twilio"}}Twilio Call Log
                                {{else}}{{#if_equals name "TwilioIO"}}Twilio
                                       {{else}}{{#if_equals name "CallScript"}}Call Script
                                               {{else}}{{name}}
                                               {{/if_equals}}
                                       {{/if_equals}}
                               {{/if_equals}}
                        {{/if_equals}}
                {{/if_equals}}
        {{/if_equals}}
			<div class="widget_header_icons pull-right text-base" style="display:none;">
				<ul class="customWidgets text-base">
					<li class="m-t-xs"><i id="{{remove_spaces name}}-move" class="text-muted c-p icon-cursor-move {{remove_spaces name}}-move"></i></li>
					{{#if is_minimized}}
						<li class="m-t-xs"><a href="#"><i widget="{{remove_spaces name}}" class="widget-maximize fa fa-minus text-muted c-p"></i></a></li>
					{{else}}
						<li class="m-t-xs"><a href="#"><i widget="{{remove_spaces name}}" class="widget-minimize text-muted fa fa-minus c-p"></i></a></li>
					{{/if}}
					<li class="m-t-xs">
					{{#if_equals name "Linkedin"}}
						<a id="{{remove_spaces name}}_plugin_delete" rel="tooltip" title="Reset settings"><i class="text-muted icon-wrench c-p"></i></a>
					{{else}}
						{{#if_equals name "Twitter"}}
							<a id="{{remove_spaces name}}_plugin_delete" rel="tooltip" title="Reset settings"><i class="text-muted icon-wrench c-p"></i></a>
						{{else}}
							{{#if_equals name "Facebook"}}
								<a id="{{remove_spaces name}}_plugin_delete" rel="tooltip" title="Reset settings"><i class="text-muted icon-wrench c-p"></i></a>
							{{else}}
							{{#if_equals name "GooglePlus"}}
								<a id="{{remove_spaces name}}_plugin_delete" rel="tooltip" title="Reset settings"><i class="text-muted icon-wrench c-p"></i></a>
							{{else}}
								<a href="#add-widget" rel="tooltip" title="Reset settings"><i class="text-muted icon-wrench c-p"></i></a>
							{{/if_equals}}
						{{/if_equals}}
					{{/if_equals}}
				{{/if_equals}}
					</li>
				</ul>
			</div>
			<div style="width:12%;float:left;">
                {{#if_equals name "CallScript"}}
                   <i class="icon-comment m-l-xs"></i>
                {{else}}
                   <img src="{{mini_logo_url}}" class="pull-left" width="24" height="24" alt=""/> 
                {{/if_equals}} 
            <!-- //not there <i class="{{icons name}}"></i> -->
			</div> 
		</h4>
<div class="clearfix"></div>
{{#if_equals widget_type "CUSTOM"}}
	{{#if is_minimized}}
		<div class="widgets widget-custom" id="{{remove_spaces name}}" aria-expanded="flase" class="collapse" style="height: 0px;">
	{{else}}
		<div class="widgets widget-custom" id="{{remove_spaces name}}" aria-expanded="true" class="collapse in">
	{{/if}}
{{else}}
	{{#if is_minimized}}
		<div id="{{remove_spaces name}}" aria-expanded="flase" class="collapse" style="height: 0px;">
	{{else}}
		<div id="{{remove_spaces name}}" aria-expanded="true" class="collapse in">		
	{{/if}}
{{/if_equals}}

		
			{{#unless is_minimized}}

			<center><img id="widget_load_img" src="img/ajax-loader-cursor.gif" class="m-t-sm m-b"></img></center>
			{{/unless}}
		</div>
		<div class="clearfix"></div>
	</div>
</script>

<script id="widgets-collection-template" type="text/html">
{{#unless this.length}}
	<div class="panel">
		<h4 class="widget_header_name font-thin padder m-b-none b-b p-b-sm p-r-none b-light">
			<i class="icon-puzzle-piece"></i>&nbsp;&nbsp;Try some widgets
		</h4>
		<div class="wrapper-sm text-base">			
			<p>See more information about your contacts with widgets. Choose from a range of widgets - social, communications, customer billing, support and more.</p>
			<div class="clearfix"></div>			
			<a class="btn btn-sm btn-primary m-t-none" href='#add-widget'>Add widgets</a>
			<div class="clearfix"></div>
		</div>
	</div>
{{else}}
 <ul class="widget-sortable p-l-none m-n text-base" id="widgets-model-list"></ul>
 <a class="btn btn-sm btn-primary pull-right" href='#add-widget'><i class="icon-plus-sign"></i>&nbsp;&nbsp;Manage widgets</a>
{{/unless}}
</script>