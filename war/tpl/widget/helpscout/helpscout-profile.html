<script id="helpscout-login-template" type="text/html">
	<div display:inline;  line-height:12px;word-wrap: break-word;">
		<form class="widget_content" style="border-bottom:none;margin-bottom:0px;" id="helpscout_login_form" name="helpscout_login_form">
	    	<fieldset>
				<p >Help Scout is a help desk for teams that insist on a delightful customer experience without exposing to ticket To access, </p>
				<p>
				<label>Enter your API key</label>
				<div class="control-group" style="margin-bottom:0px;"><div class="controls"><input type="text" id="helpscout_api_key" class="input-medium required" placeholder="API Key" value="" onkeydown="if (event.keyCode == 13) { event.preventDefault(); }"></input></div></div>
				</p>
				<a href="#" id="save_api_key" class="btn btn-primary" style="text-decoration:none;">Save</a>
				<a href="#add-widget" class="btn ml_5" style="text-decoration:none;">Cancel</a>
				<p style="line-height: 25px;padding:5px;">Don't have an API key? <a href="https://www.helpscout.net" target="_blank"> SignUp </a></p></div>
			</fieldset>
	    </form>
	</div>
</script>

<script id="helpscout-profile-template" type="text/html">
<div class="widget_content">
<div>
	<div class="pull-left">
		{{#if firstName}}
			<p class="title_txt">{{firstName}} {{lastName}}</p>
		{{/if}}
		{{#if jobTitle}}
			<p class="title_txt">{{jobTitle}}</p>
		{{/if}}
	</div>
</div>
<div class="clearfix"></div>
<div class="clearfix" style="margin-top:5px;">
	<a  id="add_conv"><i class="icon-plus"></i>New Conversation</a>
	<p id="helpscout_loading" style="display:none;" >Please wait...</p>
	<p id="helpscout_error" style="display:none;" >Please Try agian.</p>
</div>						
</div>
<div class="clearfix" id="add-conv-error-panel" style="display:none;">
</div>
<div class="sub_header">
	<h4>Conversations</h4>
</div>
<ul style="margin:0px;" id="all_conv_panel">
	
</ul>
<div class="clearfix" id="conv-error-panel" style="display:none;">
</div>
</script>

<script id="helpscout-conversation-template" type="text/html">

{{#if mailbox}}
	{{#each mailbox}}

{{#isArray conversations}}
	{{#each conversations}}
		<li class="sub_header_li helpscout_ticket_hover"  id="{{id}}">
			<div class="overflow-elipsis" title="{{subject}}">
				<div style="float:left;overflow: hidden; width: 150px; text-overflow: ellipsis;">
					<a href="https://secure.helpscout.net/conversation/{{id}}" target="_blank" >{{subject}}</a>
				</div>
			<div class="label right" style="width: 50px; overflow:hidden; text-overflow: ellipsis;">{{mailbox.name}}</div>
			</div>
			<div style="margin-bottom:5px;">
				<div class="label right">{{status}}</div>
				<small><time class="time-ago" datetime="{{toLocalTimezoneFromUtc createdAt}}">{{toLocalTimezoneFromUtc createdAt}}</time></small>
			</div>
			<div class="clearfix"></div>
		</li>
	{{/each}}
{{/isArray}}

{{/each}}
{{else}}
<div class="widget_content" style="word-wrap:break-word;">
{{message}}
</div>
{{/if}}

</script>

<script id="helpscout-message-template" type="text/html">
	<div class="modal hide fade message-modal" id="helpscout_messageModal" style="width:600px; left:50%">
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
					<div style="margin-bottom:10px; display:none;">{{info}}</div>
					<input name="customerId" type="hidden" value="{{customerId}}" />
	                <input name="email" type="hidden" value="{{email}}" />
					<div class="control-group">	           
						<label class="control-label"><b>Mailbox: </b><span class="field_req">*</span></label>         
	                    <div class="controls">
							<select name="mailbox">
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
  								<label class="btn btn-primary active">
									<input type="radio" name="type" id="type_email" value="email" style="display:none;"> <i class="icon-envelope" />
								</label>
  								<label class="btn btn-primary">
    								<input type="radio" name="type" id="type_ohone" value="phone" style="display:none;"> <i class="icon-phone" />
  								</label>
							</div>
					   </div>
	                </div>

 					<div class="control-group">	                    
						<label class="control-label"><b>Assign to: </b><span class="field_req">*</span></label>	
	                    <div class="controls">
							<select name="assignTo">
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
                        <input name="tags" type="text" id="tags-new-person" class="tags-typeahead" />
                    </div>
               	 </div>


	                <div class="control-group">	                    
						<label class="control-label"><b>Subject: </b><span class="field_req">*</span></label>	
	                    <div class="controls">
							<input type="text" placeholder="Subject" name="subject" id="subject" class="required span4" onkeydown="if (event.keyCode == 13) { event.preventDefault(); }"/>
	                    </div>
	                </div>
	                <div class="control-group">
	                    <label class="control-label"><b>Message: </b><span class="field_req">*</span></label>
	                    <div class="controls">
							<textarea rows="4" class="required span4" placeholder="Detailed Message" name="message" id="message" style="max-width:500px;"></textarea>
	                    </div>
	                </div>
	            </fieldset>
	        </form>
	    </div>
	    <div class="modal-footer">
	        <a class="btn btn-primary" id="helpscout_send_request">Save</a>
	        <span class="save-status"></span>
	    </div>
	</div>
</script>

<script id="helpscout-error-template" type="text/html">
	<div style="line-height:160%;word-wrap: break-word;padding:0px;font-size:13px;">
		{{message}}
	</div>
</script>