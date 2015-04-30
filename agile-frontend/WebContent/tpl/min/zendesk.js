<script id="zendesk-profile-template" type="text/html">
{{#if_json user_info}}
<div class="widget_content">
<div class="row-fluid">
	{{#if user_info.photo.content_url}}
		<div class="span2"><img src="{{user_info.photo.content_url}}" width="36" height="36" alt="" class="img-rounded pull-left"/></div>
	{{else}}
		<div class="span2"><img src="https://secure.gravatar.com/avatar/51200e80ab8b12eaaae230fcfe7dd1c6?d=https%3A//assets.zendesk.com/images/types/user_sm.png&s=30&r=g" width="36" height="36" alt="" class="img-rounded pull-left"/></div>
	{{/if}}
	<div class="pull-left ml_5 span10">
		{{#if user_info.name}}
			<p class="title_txt">{{user_info.name}}</p>
		{{else}}
			<p class="title_txt">{{user_info.email}}</p>
		{{/if}}
	</div>
</div>
<div class="clearfix" style="margin-top:5px;"><a  id="add_ticket"><i class="icon-plus"></i>New Ticket</a></div>						
</div>
<div class="clearfix" id="add-ticket-error-panel" style="display:none; color:red;">
</div>
<div class="sub_header">
	<h4>Tickets</h4>
</div>
<ul style="margin:0px;" id="all_tickets_panel">
	
</ul>
<div class="clearfix" id="tickets-error-panel" style="display:none;">
</div>
<div class="widget_tab_footer" align="center" style="float:none">
	<a href="#more" id="more_tickets" rel="tooltip" title="Click to see more tickets">Show More</a>
	<img src="img/ajax-spinner.gif" id="spinner-tickets" style="display:none;"></img>
</div>
{{else}}
<div class="widget_content" style="word-wrap:break-word;">
{{user_info}}
</div>
{{/if_json}}
</script>

<script id="zendesk-ticket-stream-template" type="text/html">
{{#isArray this}}
	{{#each this}}
		<li class="sub_header_li zendesk_ticket_hover"  id="{{id}}">
			<div class="overflow-elipsis" title="{{subject}}"><a href="{{url}}" target="_blank" >{{subject}}</a></div>
			<div style="margin-bottom:5px;">
				<div class="label right">{{status}}</div>
				<small><time class="time-ago" datetime="{{created_at}}">{{created_at}}</time></small>
			</div>
			<div class="sub_header_tab_link zendesk_tab_link" style="float:left;margin:0px;display:none;">
				<div><a href="#show" ticket_status="{{status}}" ticket_id="{{id}}" id="ticket_show" rel="tooltip" title="Show more information of ticket" data-attr="{{bindData this}}">Show</a></div>
				<div><a class="l_border" href="#update" update_id="{{id}}" id="ticket_update" rel="tooltip" title="Update ticket in zendesk">Comment</a></div>										
			</div>
			<div class="clearfix"></div>
		</li>
	{{/each}}
{{else}}
	{{#if_equals this "There are no tickets for this user"}}
		<li class="sub_header_li" >No tickets</li>
	{{else}}
		<li class="sub_header_li" style="word-wrap:break-word;">{{this}}</li>
	{{/if_equals}}
{{/isArray}}
</script>

<script id="zendesk-login-template" type="text/html">
	<div display:inline;  line-height:12px;word-wrap: break-word;">
		<form class="widget_content" style="border-bottom:none;" id="zendesk_login_form" name="zendesk_login_form" method="post">
	    	<fieldset>
				<p style='line-height:140%;'>View and respond to support tickets from contact using your Zendesk account.</p>
				<p>
				<label>Enter your Zendesk details </label>
				<div class="control-group" style="margin-bottom:0px"><div class="controls"><input type="url" id="zendesk_url" class="input-medium required widget_input_box" style="width:90%" placeholder="https://yourdomain.zendesk.com" value="" name="url"></input></div></div>
				<div class="control-group" style="margin-bottom:0px"><div class="controls"><input type="text" id="zendesk_username" class="input-medium required widget_input_box" style="width:90%" placeholder="User Name" value="" name="username"></input></div></div>
				<div class="control-group"><div class="controls"><input type="password" id="zendesk_password" class="input-medium required widget_input_box" style="width:90%" placeholder="Password" value="" name="password"></input><br/></div></div>			
				</p>
				<a href="#" id="save_prefs" class="btn btn-primary" style="text-decoration:none;">Save</a>
				<a href="#add-widget" class="btn ml_5" style="text-decoration:none;">Cancel</a>
			 </fieldset>
	    </form>
	</div>
</script>

<script id="zendesk-message-template" type="text/html">
	<!-- New (Note) Modal views -->
	<div class="modal hide fade message-modal" id="zendesk_messageModal" style="width:400px; left:55%">
	    <div class="modal-header">
	        <button class="close" data-dismiss="modal">x</button>
			{{#if_equals headline "Add Ticket"}}
	        	<h3><i class="icon-plus-sign"></i> {{headline}}</h3>
			{{else}}
				<h3><i class="icon-edit"></i> {{headline}}</h3>
			{{/if_equals}}
	    </div>
	    <div class="modal-body agile-modal-body">
	        <form id="zendesk_messageForm" name="zendesk_messageForm" method="post">
	            <fieldset>
					<div style="margin-bottom:10px;">{{info}}</div>
					<input name="name" type="hidden" value="{{name}}" />
	                <input name="email" type="hidden" value="{{email}}" />
	                <div class="control-group">	                    
	                    <div class="controls">
							{{#if_equals headline "Update Ticket"}}	                        
								<input type="hidden" placeholder="Ticket Id" name="ticketNumber" id="ticketNumber" class="required span4" value="{{id}}"/>
							{{else}}
								<label class="control-label"><b>Subject: </b><span class="field_req">*</span></label>	                        
								<input type="text" placeholder="Subject" name="subject" id="subject" class="required span4" onkeydown="if (event.keyCode == 13) { event.preventDefault(); }"/>
							{{/if_equals}}							
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
	        <a href="#" class="btn btn-primary" id="send_request">Send</a>
	        <span class="save-status"></span>
	    </div>
	</div>
</script>


<script id="zendesk-ticket-show-template" type="text/html">
	<div class="modal hide fade message-modal" id="zendesk_showModal" style="width:400px; left:55%">
	    <div class="modal-header">
	        <button class="close" data-dismiss="modal">x</button>
			<h3><i class="icon-info-sign"></i> {{headline}}</h3>			
	    </div>
	    <div class="well" style="margin-bottom:0px;">
	        <table class="row-fluid table table-bordered" style="line-height:13px;margin-bottom:5px;word-wrap: break-word; table-layout:fixed;width:100%;">
					
						<tr><th style="padding: 5px;">Ticket ID</th>
							<td style="padding: 5px;">{{id}}</td>
						</tr>					
						<tr>
							<th style="padding: 5px;">Created At</th>
							<td style="padding: 5px;">{{string_to_date "mm-dd-yyyy" created_at}}</td>
						</tr>
						<tr>
							<th style="padding: 5px;">Updated At</th>
							<td style="padding: 5px;">{{string_to_date "mm-dd-yyyy" updated_at}}</td>
						</tr>
						<tr>
							<th style="padding: 5px;">Status</th>
							<td style="padding: 5px;">{{status}}</td>
						</tr>
						<tr>
							<th style="padding: 5px;">Url</th>
							<td style="padding: 5px; "><a href="{{url}}" target="_blank">{{url}}</a></td>
						</tr>
						<tr>
							<th style="padding: 5px;">Subject</th>
							<td style="padding: 5px;">{{subject}}</td>
						</tr>
						<tr>
							<th style="padding: 5px;">Description</th>
							{{#if desc_len}}	
								<td style="padding: 5px;">
									<div style="height: 140px;overflow-y: scroll;"> 
										{{safe_string description}}
									</div>
								</td>
							{{else}}
								<td style="padding: 5px;">{{safe_string description}}</td>
							{{/if}}
						</tr>		
			</table>
	    </div>
	</div>
</script>

<script id="zendesk-error-template" type="text/html">
{{#check_length message "140"}}
	<div class="ellipsis-multi-line collapse-25" title="{{message}}" style="height:110px;overflow: hidden;line-height:160%;word-wrap: break-word;padding:0px">
		{{message}}
	</div>
{{else}}
	<div style="line-height:160%;word-wrap: break-word;padding:0px">
		{{message}}
	</div>
{{/check_length}}
</script>