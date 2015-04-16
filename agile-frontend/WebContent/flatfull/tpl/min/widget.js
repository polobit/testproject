<script id="widgets-add-model-template" type="text/html"> 
<div class="well widget-add" style="width:220px; height:200px;">
   {{#if_equals name "Sip"}}    
    <span style="font-size: 55px;width: 210px;height: 70px; text-align:center;" class="thumbnail"><span style="margin-top: 7px;display: block;"><i class="icon icon-phone"></i>SIP <span class="label label-important">Beta</span></span></span>
   {{else}} 
      {{#if_equals name "CallScript"}}    
        <span style="font-size: 34px;width: 210px;height: 70px; text-align:center;" class="thumbnail"><span style="margin-top: 12px;display: block;"><i class="icon icon-comment" style="margin-right: 4px;"></i>Call Script</span></span>
      {{else}} 
        <img class="thumbnail" src="{{logo_url}}" style="width:210px; height:70px;" />
      {{/if_equals}}
   {{/if_equals}}
	<br />
    <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;margin-bottom: 20px;"  rel="tooltip" title="{{description}}">
		{{description}}
	</div>
    <div>
		{{#if_equals widget_type "CUSTOM"}}
			{{#if is_added}}
				{{add_tag "Widgets"}}
				<div class="btn-group" style="display:inline-block;">
        			<a class="btn btn-danger" id="delete-widget" widget-name="{{name}}">Delete</a>
        			<a class="btn btn-danger dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
					<ul class="dropdown-menu">
						<li><a id="remove-widget" widget-name="{{name}}">Uninstall</a></li>
					</ul>
				</div>
				<!--<a href="#Custom-widget/{{id}}" class="btn" style="display:inline-block;margin-top:-22px;" id="setting-widget" set-widget-name="{{name}}">Settings</a>-->
    		{{else}}
    			<a class="btn btn-primary install-custom-widget" href="#Custom-widget" widget-name="{{name}}"><i class="icon-plus" style="margin-right:5px"></i>Add</a>
				<a class="btn btn-danger" id="remove-widget" widget-name="{{name}}">Uninstall</a>    		
			{{/if}}
		{{else}}
			{{#if is_added}}
				{{add_tag "Widgets"}}
    			<a class="btn btn-danger" id="delete-widget" widget-name="{{name}}">Delete</a>
                {{#if_equals name "CallScript"}}  
                   <a href="#callscript/{{id}}" class="btn" id="setting-widget" set-widget-name="{{name}}">Settings</a>
                {{else}}{{#if_equals name "Twilio"}}
                           <a></a>
                        {{else}}
				           <a href="#{{name}}/{{id}}" class="btn" id="setting-widget" set-widget-name="{{name}}">Settings</a>
                        {{/if_equals}}
                {{/if_equals}}
    		{{else}}
			{{#if allowedToAdd}}
					{{#if_equals widget_type "SOCIAL"}}
						<a class="btn btn-primary add-widget" href="#{{name}}" widget-name="{{name}}"><i class="icon-plus" style="margin-right:5px"></i>Add</a>
						{{else}}
                               {{#if_equals name "CallScript"}}
								   <a class="btn btn-primary add-widget" href="#callscript" widget-name="{{name}}"><i class="icon-plus" style="margin-right:5px"></i>Add</a>
                               {{else}}{{#if_equals name "Twilio"}}
                                            <a></a>
                                       {{else}}
                                            <a class="btn btn-primary add-widget" href="#{{name}}" widget-name="{{name}}"><i class="icon-plus" style="margin-right:5px"></i>Add</a>
							           {{/if_equals}}
							   {{/if_equals}}
					{{/if_equals}}
				{{else}}
			<div style="/*margin: 40px auto;	width: 50%;*/ display:inline;float:left">
							<a class="btn btn-primary _upgrade" id="{{#is_blank name}}{{getRandomNumber}}{{else}}{{this}}{{/is_blank}}-upgrade"><i class="icon-plus" style="margin-right:5px"></i>Add</a>
				</div>
				{{type}}
				{{#if_equals widget_type "CALL"}}
					<div style="display:inline;float:right;display:none; max-width:135px;" class="text-right {{#is_blank name}}{{getRandomNumber}}{{else}}{{this}}{{/is_blank}}-upgrade" ><p><i>Requires Regular or<br/>Pro plan. <a href="#subscribe">Upgrade</a></i><p></div>
					{{else}}
				 <div style="display:inline;float:right;display:none; max-width:135px" class="text-right {{name}}-upgrade" ><p><i>Please <a href="#subscribe">upgrade</a> <br/> to add more widgets</i><p></div>
				{{/if_equals}}
			{{/if}}
    		{{/if}}
		{{/if_equals}}
	</div>
</div>
</script>

<script id="widgets-add-collection-template" type="text/html">
<div class="row-fluid">
    
	<div class="span11" style="margin-left:0px;">
     
            <h2 class="widget-head" style="margin-top:10px;">Social <small>Know your customer social activity</small></h2>
       
                <div id="social" class="row-fluid">
                </div><br/>
    </div>
	<div class="span11" style="margin-left:0px;">
    
            <h2 class="widget-head">Customer Support <small>View tickets and chats</small></h2>
      
                <div id="support" class="row-fluid">
                </div><br/>
    </div>
	<div class="span11" style="display:none;margin-left:0px;">
      
            <h2 class="widget-head">Email <small>Send and Receive Email</small></h2>
       
                <div id="email" class="row-fluid">
                </div><br/>
    </div>
    <div class="span11" style="margin-left:0px;">

            <h2 class="widget-head">Calling <small>Make & Receive calls from Agile</small></h2>
        
                <div id="call" class="row-fluid">
                </div><br/>
    </div>
    <div class="span11" style="margin-left:0px;">
        
            <h2 class="widget-head">Billing <small>View and send invoices</small></h2>
      
                <div id="billing" class="row-fluid">
                </div><br/>
    </div>

  <div class="span11" style="margin-left:0px;">
        
            <h2 class="widget-head">Ecommerce <small>View Customer Orders Details</small></h2>
      
                <div id="ecommerce" class="row-fluid">
                </div><br/>
    </div>


	<div class="span11" style="margin-left:0px;">
	
            <h2 class="widget-head">Custom Widgets <small>Add your widgets</small></h2>
       
			<div id="custom" class="row-fluid">
				<div class="span4" id="custom-widget" >
					<div class="well widget-add" style="width:220px; height:200px;">
    					<center><i class="icon-puzzle-piece icon-3x thumbnail" style="padding:19px;"></i></center>
						<br />
    					<h1>Custom widget</h1>
    					<br />
    					<div>
							{{#isAllowedInCurrentPlan "is_custom_widget"}}
									<a class="btn btn-primary" id="add-custom-widget" style="margin-top:20px;"><i class="icon-plus" style="margin-right:5px"></i>Add custom widget</a>
								{{else}}
									<div style="/*margin: 40px auto;	width: 50%;*/ display:inline;float:left">
											<a class="btn btn-primary _upgrade" id="custom-widget-upgrade"><i class="icon-plus" style="margin-right:5px"></i>Add</a>
									</div>
									<div style="display:inline;float:right;display:none; max-width:135px" class="text-right custom-widget-upgrade" ><p><i>Required Pro plan. <a href="#subscribe">upgrade</a></i><p></div>
							{{/isAllowedInCurrentPlan}}
						</div>
					</div>
				</div>
			</div>
    	</div>
</div>
</script>

<script id="add-custom-widget-template" type="text/html">
	<div class="well widget-add" style="width:220px;">
		<form style="border-bottom:none;margin-top:-10px;margin-bottom: 0px;" id="custom_widget_form" name="custom_widget_login_form" method="post">
	    	<fieldset>
				<legend style="margin-bottom: 16px;font-size: 16px;line-height: 30px;">Enter custom widget details </legend>
				<input type="hidden" id="widget_type" class="input-medium required" style="width:90%" value="CUSTOM" name="widget_type"></input>
				<div class="control-group" style="margin-bottom:0px"><div class="controls"><input type="text" id="name" class="input-medium required widget_input_box" style="width:90%" placeholder="Widget name" value="" name="name"></input></div></div>
				<div class="control-group" style="margin-bottom:0px"><div class="controls"><input type="text" id="description" class="input-medium required widget_input_box" style="width:90%" placeholder="Description" value="" name="description"></input></div></div>
				<div class="control-group" style="margin-bottom:0px"><div class="controls">
				<select name="script_type" id="script_type" class="required" style="width:50%" >
					<option value="script">HTML</option> 
					<option value="url">URL</option> 
				</select></div></div>
				<div class="control-group" style="margin-bottom:0px"><div class="controls">
					<span id="script_div">
						<span class="help-block">Documentation for <a href="https://github.com/agilecrm/widget-api-html" target="_blank">widget JS API</a></span>
						<textarea rows="4" class="required" name="script" id="script" value="" style="" placeholder="Paste your HTML source of widget. It may contain embedded script that make use of Agile widgets API"></textarea>
					</span>
					<span id="url_div" style="display:none;">
						<span class="help-block">Documentation for <a href="https://github.com/agilecrm/widget-api-backend" target="_blank">widget backend API</a></span>
						<input type="url" id="url" class="input-medium required widget_input_box" style="width:90%;" placeholder="Webhook URL" value="" name="url"></input>
					</span>
				</div></div>
				<div class="control-group" style="margin-bottom:0px"><div class="controls"><input type="url" id="logo_url" class="input-medium required widget_input_box" style="width:90%" placeholder="Logo URL" value="" name="logo_url"></input></div></div>
				<div class="control-group" style="margin-bottom:0px"><div class="controls"><input type="url" id="mini_logo_url" class="input-medium required widget_input_box" style="width:90%" placeholder="Mini logo URL" value="" name="mini_logo_url"></input></div></div>
				<div class="form-actions" style="padding: 15px 20px 0px;margin-top: 14px;margin-bottom: 0px;">
               		<a id="save_custom_widget" type="submit" class="save btn btn-primary">Install</a>
               		<a type="reset" id="cancel_custom_widget" class="btn">Cancel</a>
             	</div>
			 </fieldset>
	    </form>
	</div>
</script>

<script id="revoke-access-template" type="text/html">
<div class='widget_content' style='border-bottom:none;line-height: 160%;' >
	Revoke access to the previous account.
	<p style='margin: 10px 0px 5px 0px;' >
		<a class='btn revoke-widget' style='text-decoration: none;' widget-name="{{name}}">Revoke Access</a> 
	</p>
</div>
</script>

 
<script id="widget-settings-template" type="text/html">
<div class="well" style="width:300px;">
{{#if_equals name "Sip"}}
    <center><span style="font-size: 55px;text-align:center;width: 210px;height: 70px;" class="thumbnail"><span style="margin-top:7px;display:block"><i class="icon icon-phone"></i>SIP</span></span></center>
{{else}}
    {{#if_equals name "CallScript"}}
        <center><span style="font-size: 38px;width: 210px;height: 70px; text-align:center;" class="thumbnail"><span style="margin-top: 12px;display: block;"><i class="icon icon-comment" style="margin-right: 4px;"></i>Call Script</span></span></center>
    {{else}}
        <center><img class="thumbnail" src="{{logo_url}}" style="width:210px; height:70px;" /></center>
    {{/if_equals}}
{{/if_equals}}  
	<div class='widget_content' id="widget-settings" style='border-bottom:none;line-height: 160%;' widget-name="{{name}}">
	</div>
</div>
</script>

<script id="widget-settings-error-template" type="text/html">
<div>{{show_link_in_statement error_message}}</div>
<a href="{{error_url}}" style="text-decoration: none;" widget-name="{{name}}">Try again</a>
</script>




<script id="custom-widget-settings-template" type="text/html">
<div class="well widget-edit" style="width:220px;">
		<form style="border-bottom:none;margin-top:-10px;margin-bottom: 0px;" id="custom_widget_form" name="custom_widget_login_form" method="post">
	    	<fieldset>
				<legend style="margin-bottom: 16px;font-size: 16px;line-height: 30px;">Edit custom widget details </legend>
				<input type="hidden" id="widget_type" class="input-medium required" style="width:90%" value="CUSTOM" name="widget_type"></input>
				<div class="control-group" style="margin-bottom:0px"><div class="controls"><input type="text" id="name" class="input-medium required widget_input_box" style="width:90%" placeholder="Widget name" value={{name}} name="name"></input></div></div>
				<div class="control-group" style="margin-bottom:0px"><div class="controls"><input type="text" id="description" class="input-medium required widget_input_box" style="width:90%"  value={{description}} name="description"></input></div></div>
				<div class="control-group" style="margin-bottom:0px"><div class="controls">
				<select name="script_type" id="script_type" class="required" style="width:50%" >
					<option value="script">HTML</option> 
					<option value="url">URL</option> 
				</select></div></div>
				<div class="control-group" style="margin-bottom:0px"><div class="controls">
					<span id="script_div">
						<span class="help-block">Documentation for <a href="https://github.com/agilecrm/widget-api-html" target="_blank">widget JS API</a></span>
						<textarea rows="4" class="required" name="script" id="script" value={{script}} style="" placeholder="Paste your HTML source of widget. It may contain embedded script that make use of Agile widgets API"></textarea>
					</span>
					<span id="url_div" style="display:none;">
						<span class="help-block">Documentation for <a href="https://github.com/agilecrm/widget-api-backend" target="_blank">widget backend API</a></span>
						<input type="url" id="url" class="input-medium required widget_input_box" style="width:90%;" placeholder="Webhook URL" value={{url}} name="url"></input>
					</span>
				</div></div>
				<div class="control-group" style="margin-bottom:0px"><div class="controls"><input type="url" id="logo_url" class="input-medium required widget_input_box" style="width:90%" placeholder="Logo URL" value={{logo_url}} name="logo_url"></input></div></div>
				<div class="control-group" style="margin-bottom:0px"><div class="controls"><input type="url" id="mini_logo_url" class="input-medium required widget_input_box" style="width:90%" placeholder="Mini logo URL" value={{mini_logo_url}} name="mini_logo_url"></input></div></div>
				<div class="form-actions" style="padding: 15px 20px 0px;margin-top: 14px;margin-bottom: 0px;">
               		<a id="save_custom_widget" type="submit" class="save btn btn-primary">Save</a>
               		<a type="reset" id="cancel_custom_widget" class="btn">Cancel</a>
             	</div>
			 </fieldset>
	    </form>
	</div>
</script><script id="widgets-model-template" type="text/html">
{{#if prefs}}
	{{add_tag "Widgets"}}
{{/if}}
     {{#if_equals name "Sip"}}
	  <div class="widget_container" id="{{remove_spaces name}}-container" style="display:none;">
    {{else}}
      <div class="widget_container" id="{{remove_spaces name}}-container">       
    {{/if_equals}}
		<div class="widget_header widget_edit_icons" onmouseover="showIcons(this); return false;" onmouseout="hideIcons(this); return false;">
			<div class="widget_header_icons pull-right clear-fix" style="display:none;">
				<ul class="widget_header_control">
					<li><i id="{{remove_spaces name}}-move" class="icon-move {{remove_spaces name}}-move"></i></li>
					{{#if is_minimized}}
						<li><a href="#"><i widget="{{remove_spaces name}}" class="widget-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i widget="{{remove_spaces name}}" class="widget-minimize icon-minus"></i></a></li>
					{{/if}}
					<li>
					{{#if_equals name "Linkedin"}}
						<a id="{{remove_spaces name}}_plugin_delete" rel="tooltip" title="Reset settings"><i class="icon-wrench" style="font-size:1.12em;cursor:pointer;"></i></a>
					{{else}}
						{{#if_equals name "Twitter"}}
							<a id="{{remove_spaces name}}_plugin_delete" rel="tooltip" title="Reset settings"><i class="icon-wrench" style="font-size:1.12em;cursor:pointer;"></i></a>
						{{else}}
							{{#if_equals name "Facebook"}}
								<a id="{{remove_spaces name}}_plugin_delete" rel="tooltip" title="Reset settings"><i class="icon-wrench" style="font-size:1.12em;cursor:pointer;"></i></a>
							{{else}}
							{{#if_equals name "GooglePlus"}}
								<a id="{{remove_spaces name}}_plugin_delete" rel="tooltip" title="Reset settings"><i class="icon-wrench" style="font-size:1.12em;cursor:pointer;"></i></a>
							{{else}}
								<a href="#add-widget" rel="tooltip" title="Reset settings"><i class="icon-wrench" style="font-size:1.12em;cursor:pointer;"></i></a>
							{{/if_equals}}
						{{/if_equals}}
					{{/if_equals}}
				{{/if_equals}}
					</li>
				</ul>
			</div>
			<div style="width:9%;float:left;">
                {{#if_equals name "CallScript"}}
                   <i class="icon-comment" style="font-size:1.12em;"></i>
                {{else}}
                   <img src="{{mini_logo_url}}" class="pull-left" width="24" height="24" alt=""/>
                {{/if_equals}} 
                <!-- <i class="{{icons name}}"></i> -->
			</div>
			<div class="widget_header_name overflow-elipsis" style="width:80%;padding:0px 0 0 5px;">

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

			</div>
<div class="clearfix"></div>
		</div>
{{#if_equals widget_type "CUSTOM"}}
		<div class="widgets widget-custom" id="{{remove_spaces name}}">
	{{else}}
		<div class="widgets" id="{{remove_spaces name}}">
{{/if_equals}}

		
			{{#unless is_minimized}}

			<center><img id="widget_load_img" src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center>
			{{/unless}}
		</div>
	</div>
</script>

<script id="widgets-collection-template" type="text/html">
{{#unless this.length}}
	<div class="widget_container">
		<div class="widget_header">
			<div class="pull-left">
				<strong><i class="icon-puzzle-piece"></i>&nbsp;&nbsp;Try some widgets</strong>
			</div></div>
		<div class="widgets">
			<div style="margin:10px;">
				<p>See more information about your contacts with widgets. Choose from a range of widgets - social, communications, customer billing, support and more.</p>
				<div class="clearfix"></div>
			</div>
			<a class="btn btn-primary" href='#add-widget' style="margin:0px 10px 10px;"><i class="icon-plus-sign"></i>&nbsp;&nbsp;Add widgets</a>
			<div class="clearfix"></div>
		</div>
	</div>
{{else}}
 <ul class="widget-sortable" id="widgets-model-list" style="margin:0px 0px"></ul>
 <a class="btn btn-primary pull-right" href='#add-widget'><i class="icon-plus-sign"></i>&nbsp;&nbsp;Manage widgets</a>
{{/unless}}
</script>