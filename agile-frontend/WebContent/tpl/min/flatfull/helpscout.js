<script id="helpscout-login-template" type="text/html">
	<div>
		<form  id="helpscout_login_form" name="helpscout_login_form">
	    	<fieldset>
				<p >Help Scout is a help desk for teams that insist on a delightful customer experience without exposing to ticket To access, </p>
				
				<label>Enter your API key</label>
				<div class="control-group form-group"><div class="controls"><input type="text" id="helpscout_api_key" class="input-medium required form-control" placeholder="API Key" value="" onkeydown="if (event.keyCode == 13) { event.preventDefault(); }"></input></div></div>
				<a href="#add-widget" class="btn btn-default btn-sm">Cancel</a>
				<a href="#" id="save_api_key" class="btn btn-sm btn-primary ml_5">Save</a>
				<p class="p-xs">Don't have an API key? <a href="https://www.helpscout.net" target="_blank" class="text-info"> SignUp </a></p>
     </div>
			</fieldset>
	    </form>
	</div>
</script>

<script id="helpscout-profile-template" type="text/html">
<div class="wrapper-sm">
<div>
	<div class="pull-left">
		{{#if firstName}}
			<a class="text-cap">{{firstName}} {{lastName}}</a>
		{{/if}}
		{{#if jobTitle}}
			<small class="block text-muted">{{jobTitle}}</small>
		{{/if}}
	</div>
</div>
<div class="clearfix"></div>
<div class="clearfix m-t-xs">
	<a  id="add_conv" class="btn btn-xs btn-default">New Conversation</a>
	<p id="helpscout_loading" style="display:none;" >Please wait...</p>
	<p id="helpscout_error" style="display:none;" >Please Try agian.</p>
</div>						
</div>
<div class="clearfix" id="add-conv-error-panel" style="display:none;">
</div>
<div class="wrapper-sm b-t b-light">
	<h4 class="h4 text-sm m-t-none m-b-none">Conversations</h4>
</div>
<ul class="list-group m-b-none text-base" id="all_conv_panel">
	
</ul>
<div class="clearfix" id="conv-error-panel" style="display:none;">
</div>
</script>

<script id="helpscout-conversation-template" type="text/html">

{{#if mailbox}}
	{{#each mailbox}}

{{#isArray conversations}}
	{{#each conversations}}
		<li class="list-group-item r-none b-l-none b-r-none helpscout_ticket_hover"  id="{{id}}">
			<div class="overflow-elipsis" title="{{subject}}">
				<div class="text-flow-ellipsis pull-left" >
					<a href="https://secure.helpscout.net/conversation/{{id}}" target="_blank" >{{subject}}</a>
				</div>
			<div class="label bg-light dk text-tiny pull-right text-flow-ellipsis">{{mailbox.name}}</div>
			</div>
			<div class="m-b-xs">
				<div class="label bg-light dk text-tiny pull-right">{{status}}</div>
				<small class="pull-left text-muted"><i class="fa fa-clock-o m-r-xs text-muted"></i><time class="time-ago" datetime="{{toLocalTimezoneFromUtc createdAt}}">{{toLocalTimezoneFromUtc createdAt}}</time></small>
			</div>
			<div class="clearfix"></div>
		</li>
	{{/each}}
{{/isArray}}

{{/each}}
{{else}}
<div class="widget_content word-break">
{{message}}
</div>
{{/if}}

</script>

<script id="helpscout-message-template" type="text/html">
<div class="modal fade message-modal" id="helpscout_messageModal" aria-hidden="false" style="display: block; padding-left: 17px;">
<div class="modal-backdrop fade" style="height: auto;"></div> 
 <div class="modal-dialog"> 
  <div class="modal-content"> 
	    <div class="modal-header">
	        <button class="close" data-dismiss="modal">x</button>
			{{#if_equals headline "Add Conversation to HelpScout"}}
	        	<h3><i class="icon-plus-sign"></i> {{headline}}</h3>
			{{else}}
				<h3><i class="icon-edit"></i> {{headline}}</h3>
			{{/if_equals}}
	    </div>
	    <div class="modal-body agile-modal-body">
	        <form id="helpscout_messageForm" name="helpscout_messageForm" method="post" class="form-horizontal">
	            <fieldset>
					<div class="m-b-sm" style="display:none;">{{info}}</div>
					<input name="customerId" type="hidden" value="{{customerId}}" />
	                <input name="email" type="hidden" value="{{email}}" />
					<div class="control-group">	           
						<label class="control-label"><b>Mailbox: </b><span class="field_req">*</span></label>         
	                    <div class="controls">
							<select name="mailbox" class="form-control">
							{{#isArray mailboxes}}
								{{#each mailboxes}}
									<option value="{{id}}">{{name}}</option>
								{{/each}}
							{{/isArray}}
							</select>                        
	                    </div>
	                </div>
					<div class="control-group">	      
						<label class="control-label"><b>Type: </b><span class="field_req">*</span></label>	              
	                    <div class="controls">
							<div class="btn-group" data-toggle="buttons">
  								<label class="btn btn-sm btn-primary active">
									<input type="radio" name="type" id="type_email" value="email" style="display:none;"> <i class="icon-envelope" />
								</label>
  								<label class="btn btn-sm btn-primary">
    								<input type="radio" name="type" id="type_ohone" value="phone" style="display:none;"> <i class="icon-phone" />
  								</label>
							</div>
					   </div>
	                </div>

 					<div class="control-group">	                    
						<label class="control-label"><b>Assign to: </b><span class="field_req">*</span></label>	
	                    <div class="controls">
							<select name="assignTo" class="form-control">
							{{#isArray assignees}}
								{{#each assignees}}
									<option value="{{id}}">{{firstName}} {{lastName}}</option>
								{{/each}}
							{{/isArray}}
							</select> 
	                    </div>
	                </div>
				<div class="control-group" id="tags_source_continue_contact">
                    <label class="control-label"><b>Tags: </b></label>
                    <div class="controls">
                        <input name="tags" type="text" id="tags-new-person" class="tags-typeahead form-control" />
                    </div>
               	 </div>


	                <div class="control-group">	                    
						<label class="control-label"><b>Subject: </b><span class="field_req">*</span></label>	
	                    <div class="controls">
							<input type="text" placeholder="Subject" name="subject" id="subject" class="required span4 form-control" onkeydown="if (event.keyCode == 13) { event.preventDefault(); }"/>
	                    </div>
	                </div>
	                <div class="control-group">
	                    <label class="control-label"><b>Message: </b><span class="field_req">*</span></label>
	                    <div class="controls">
							<textarea rows="4" class="input col-md-12 form-control required" placeholder="Detailed Message" name="message" id="message"></textarea>
	                    </div>
	                </div>
	            </fieldset>
	        </form>
	    </div>
	    <div class="modal-footer">
	        <a class="btn btn-sm btn-primary" id="helpscout_send_request">Save</a>
	        <span class="save-status"></span>
	    </div>
	</div>
	</div> 
</div>
</script>
<script id="helpscout-error-template" type="text/html">
	<div class="wrapper-sm text-base" style="line-height:160%;">
		{{message}}
	</div>
</script>