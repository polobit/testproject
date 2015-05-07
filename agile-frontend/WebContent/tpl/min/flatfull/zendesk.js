<script id="zendesk-profile-template" type="text/html">
{{#if user_info}}
<div class="wrapper-sm">
<a class="thumb pull-left m-r-sm" href="#">
	{{#if user_info.photo.content_url}}
		<img src="{{user_info.photo.content_url}}" width="36" height="36" alt="" class="img-circle"/>
	{{else}}
		<img src="https://secure.gravatar.com/avatar/51200e80ab8b12eaaae230fcfe7dd1c6?d=https%3A//assets.zendesk.com/images/types/user_sm.png&s=30&r=g" alt="" class="img-circle"/>
	{{/if}}
</a>
<div class="clear">
	{{#if user_info.name}}
		<a class="text-cap text-base m-b-xs">{{user_info.name}}</a>
	{{else}}
		<a class="text-cap text-base m-b-xs">{{user_info.email}}</a>
	{{/if}}
</div>
<div class="clearfix"><a  class="btn btn-xs btn-default" id="add_ticket">New Ticket</a></div>						
</div>
<div class="clearfix" id="add-ticket-error-panel" style="display:none; color:red;">
</div>
<div class="wrapper-sm b-t b-light">
	<h4 class="h4 text-sm">Tickets</h4>
</div>
<ul class="list-group m-n text-base" id="all_tickets_panel">
	
</ul>
<div class="clearfix" id="tickets-error-panel" style="display:none;">
</div>
<div class="widget_tab_footer" align="center" style="float:none">
	<a href="#more" class="text-info" id="more_tickets" rel="tooltip" title="Click to see more tickets">Show More</a>
	<img src="img/ajax-spinner.gif" id="spinner-tickets" style="display:none;"></img>
</div>
{{else}}
<div class="wrapper-sm word-break">
{{user_info}}
</div>
{{/if}}
</script>

<script id="zendesk-ticket-stream-template" type="text/html">
{{#isArray this}}
	{{#each this}}
		<li class="list-group-item r-none b-l-none b-r-none zendesk_ticket_hover"  id="{{id}}">
			<div class="text-flow-ellipsis" title="{{subject}}"><a href="{{url}}" target="_blank" >{{subject}}</a></div>
			<div class="m-b-xs">
				<div class="label text-black bg-light dk right">{{status}}</div>
				<small class="text-muted"><i class="fa fa-clock-o m-r-xs"></i><time class="time-ago" datetime="{{created_at}}">{{created_at}}</time></small>
			</div>
			<div class="sub_header_tab_link zendesk_tab_link  m-n" style="float:left;display:none;">
				<div><a href="#show" class="btn btn-xs btn-default" ticket_status="{{status}}" ticket_id="{{id}}" id="ticket_show" rel="tooltip" title="Show more information of ticket" data-attr="{{bindData this}}">Show</a></div>
				<div><a class="l_border btn btn-xs btn-default" href="#update" update_id="{{id}}" id="ticket_update" rel="tooltip" title="Update ticket in zendesk">Comment</a></div>										
			</div>
			<div class="clearfix"></div>
		</li>
	{{/each}}
{{else}}
	{{#if_equals this "There are no tickets for this user"}}
		<li class="list-group-item r-none b-l-none b-r-none" >No tickets</li>
	{{else}}
		<li class="list-group-item r-none b-l-none b-r-none word-break">{{this}}</li>
	{{/if_equals}}
{{/isArray}}
</script>

<script id="zendesk-login-template" type="text/html">
	<div>
		<form  id="zendesk_login_form" name="zendesk_login_form" method="post">
	    	<fieldset>
				<p>View and respond to support tickets from contact using your Zendesk account.</p>
				
				<label>Enter your Zendesk details </label>
				<div class="control-group form-group"><div class="controls"><input type="url" id="zendesk_url" class="input-medium required widget_input_box form-control" placeholder="https://yourdomain.zendesk.com" value="" name="url"></input></div></div>
				<div class="control-group form-group"><div class="controls"><input type="text" id="zendesk_username" class="input-medium required widget_input_box form-control"  placeholder="User Name" value="" name="username"></input></div></div>
				<div class="control-group form-group"><div class="controls"><input type="password" id="zendesk_password" class="input-medium required widget_input_box form-control"  placeholder="Password" value="" name="password"></input></div></div>			
				<a href="#add-widget" class="btn btn-default btn-sm">Cancel</a>
				<a href="#" id="save_prefs" class="btn btn-sm btn-primary ml_5">Save</a>
			 </fieldset>
	    </form>
	</div>
</script>

<script id="zendesk-message-template" type="text/html">
<div class="modal fade message-modal" id="zendesk_messageModal" aria-hidden="false" style="display: block; padding-left: 17px;">
<div class="modal-backdrop fade" style="height: auto;"></div> 
 <div class="modal-dialog">
 <div class="modal-content"> 
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
					<div class="m-b-sm">{{info}}</div>
					<input name="name" type="hidden" value="{{name}}" />
	                <input name="email" type="hidden" value="{{email}}" />
	                <div class="control-group">	                    
	                    <div class="controls">
							{{#if_equals headline "Update Ticket"}}	                        
								<input type="hidden" placeholder="Ticket Id" name="ticketNumber" id="ticketNumber" class="required span4" value="{{id}}"/>
							{{else}}
								<label class="control-label"><b>Subject: </b><span class="field_req">*</span></label>	                        
								<input type="text" placeholder="Subject" name="subject" id="subject" class="required span4 form-control" onkeydown="if (event.keyCode == 13) { event.preventDefault(); }"/>
							{{/if_equals}}							
	                    </div>
	                </div>
	                <div class="control-group">
	                    <label class="control-label"><b>Message: </b><span class="field_req">*</span></label>
	                    <div class="controls">
							<textarea rows="4" class="required span4 form-control" placeholder="Detailed Message" name="message" id="message" ></textarea>
	                    </div>
	                </div>
	            </fieldset>
	        </form>
	    </div>
	    <div class="modal-footer">
	        <a href="#" class="btn btn-sm btn-primary" id="send_request">Send</a>
	        <span class="save-status"></span>
	    </div>
</div>
</div>
</div>
</script>


<script id="zendesk-ticket-show-template" type="text/html">
<div class="modal fade message-modal" aria-hidden="false" id="zendesk_showModal" style="display: block; padding-left: 17px;">
<div class="modal-backdrop fade" style="height: auto;"></div> 
 <div class="modal-dialog"> 
  <div class="modal-content"> 
	    <div class="modal-header">
	        <button class="close" data-dismiss="modal">x</button>
			<h3><i class="icon-info-sign"></i> {{headline}}</h3>			
	    </div>
	    <div class="modal-body"> 
	        <table class="row-fluid table table-bordered m-b-xs word-break l-h-xs w-full" style="table-layout:fixed;">
					
						<tr><th class="p-xs">Ticket ID</th>
							<td class="p-xs">{{id}}</td>
						</tr>					
						<tr>
							<th class="p-xs">Created At</th>
							<td class="p-xs">{{string_to_date "mm-dd-yyyy" created_at}}</td>
						</tr>
						<tr>
							<th class="p-xs">Updated At</th>
							<td class="p-xs">{{string_to_date "mm-dd-yyyy" updated_at}}</td>
						</tr>
						<tr>
							<th class="p-xs">Status</th>
							<td class="p-xs">{{status}}</td>
						</tr>
						<tr>
							<th class="p-xs">Url</th>
							<td class="p-xs"><a href="{{url}}" target="_blank">{{url}}</a></td>
						</tr>
						<tr>
							<th class="p-xs">Subject</th>
							<td class="p-xs">{{subject}}</td>
						</tr>
						<tr>
							<th class="p-xs">Description</th>
							{{#if desc_len}}	
								<td class="p-xs">
									<div style="height: 140px;overflow-y: scroll;"> 
										{{safe_string description}}
									</div>
								</td>
							{{else}}
								<td class="p-xs">{{safe_string description}}</td>
							{{/if}}
						</tr>		
			</table>
	    </div>
  <div class="modal-footer"></div> 
</div>
</div> 
</div>
</script>

<script id="zendesk-error-template" type="text/html">
<div class="wrapper-sm">
{{#check_length message "140"}}
	<div class="ellipsis-multi-line collapse-25 p-xs word-break overflow-hidden text-base" title="{{message}}" style="height:110px;line-height:160%;">
		{{message}}
	</div>
{{else}}
	<div class="word-break p-n text-base" style="line-height:160%;">
		{{message}}
	</div>
{{/check_length}}
</div>
</script>
