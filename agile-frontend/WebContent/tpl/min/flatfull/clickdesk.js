<script id="clickdesk-login-template" type="text/html">
	<div>
		<form id="clickdesk_login_form" name="clickdesk_login_form" method="post">
	    	<fieldset>
				<p>Convert chat sessions with potential customers into contacts in Agile along with the conversation.</p>
				
				<label>Enter your ClickDesk details </label>
				<div class="control-group form-group"><div class="controls"><input type="text" id="clickdesk_username" class="input-medium required widget_input_box form-control" placeholder="User Name" value="" name="username"></input></div></div>
				<div class="control-group form-group"><div class="controls"><input type="text" id="clickdesk_api_key" class="input-medium required widget_input_box form-control"  placeholder="API Key" value="" name="api_key"></input></div></div>			
				<a href="#add-widget" class=" btn btn-default btn-sm">Cancel</a>
				<a href="#" id="save_clickdesk_prefs" class="btn btn-sm btn-primary ml_5">Save</a>
			 </fieldset>
	    </form>
	</div>
</script>

<script id="clickdesk-profile-template" type="text/html">
<p class="wrapper-sm m-n text-base">Conversations and tickets related to {{getCurrentContactProperty "first_name"}} {{getCurrentContactProperty "last_name"}}</p>
<div class="nav-tabs-alt">
<ul class="nav nav-tabs clickdeskTab text-base" id="myTab">
	<li class="active text-center" style="width:48%; margin-left: 2%;" align="center"><a data-toggle="tab" href="#chats" id="clickdesk_chats"><h4 class="h4 text-base">Chats</h4><small></small></a></li>
	<li class="text-center" style="width:48%;" align="center"><a data-toggle="tab" href="#c_tickets" id="clickdesk_tickets"><h4 class="h4 text-base">Tickets</h4><small></small></a></li>
</ul>
</div>
<div class="tab-content" id="myTabContent">
	<div id="chats" class="tab-pane fade active in">
		<ul class="list-group m-n text-base" id="clickdesk_chats_panel">
						
		</ul>
		<div class="clearfix" id="clickdesk-chats-error-panel" style="display:none;">
		</div>
		<div class="widget_tab_footer" align="center">
			<a class="more_chats_link text-info c-p" id="more_chats_link" rel="tooltip" title="Click to see more chats">Show More</a>
			<a data-toggle="collapse" data-target="#clickdesk_chats_panel" id="less_chats_link" class="c-p" style="display:none;">Show Less..</a>
			<img src="img/ajax-spinner.gif" id="spinner-clickdesk-chats" style="display:none;"></img>
		</div>
	</div>
	<div id="c_tickets" class="tab-pane fade">
		<ul class="list-group m-n text-base" id="clickdesk_tickets_panel">
						
		</ul>
		<div class="clearfix" id="clickdesk-tickets-error-panel" style="display:none;">
		</div>
		<div class="widget_tab_footer" align="center">
			<a class="more_tickets_link c-p text-info" id="more_tickets_link" rel="tooltip" title="Click to see more tickets">Show More</a>
			<a data-toggle="collapse" data-target="#clickdesk_tickets_panel" id="less_tickets_link" class="c-p" style="display:none;">Show Less..</a>
			<img src="img/ajax-spinner.gif" id="spinner-clickdesk-tickets" style="display:none;"></img>
		</div>
	</div>
</div>
<div class="clearfix"></div>
</script>

<script id="clickdesk-chat-stream-template" type="text/html">
	{{#if this}}
		{{#each this}}
			<li class="list-group-item r-none b-l-none b-r-none clickdesk_chat_hover" url="{{chat_history_url}}">
			 <div class="clear">
				<p class="text-flow-ellipsis"><a href="{{chat_history_url}}" target="_blank" >{{user_message}}</a></p>				
				<div class="clickdesk_chat_tab_link m-n" style="float:left;display:none;">
					<a url="{{chat_history_url}}" class="c-p btn btn-xs btn-default" id="clickdesk_chat_show" rel="tooltip" title="Show chat transcript" data-attr="{{bindData this}}">Show</a>
				</div>
			  </div>
              <small class="text-muted"><i class="fa fa-clock-o m-r-xs"></i><time class="time-ago" datetime="{{epochToHumanDate "" start_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" start_time}}</time></small>
			  <small class="label bg-light dk text-tiny right">{{chat_type}}</small>				
			</li>
		{{/each}}
	{{/if}}
</script>

<script id="clickdesk-ticket-stream-template" type="text/html">
	{{#each this}}
		<li class="list-group-item r-none b-l-none b-r-none clickdesk_ticket_hover" url="{{ticket_url}}">
			<div class="clear">
				<p class="text-flow-ellipsis"><a href="{{ticket_url}}" target="_blank">{{subject}}</a></p>
				<div class="clickdesk_ticket_tab_link m-n" style="float:left;display:none;">
					<a url="{{ticket_url}}" id="clickdesk_ticket_show" class="c-p btn btn-xs btn-default" rel="tooltip" title="Show more information of ticket" data-attr="{{bindData this}}">Show</a>
				</div>
			</div>			
			<small class="text-muted"><i class="fa fa-clock-o m-r-xs"></i><time class="time-ago" datetime="{{epochToHumanDate "" received_at}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" received_at}}</time></small>
			<small class="label bg-light dk text-tiny right">{{status}}</small>
		</li>
	{{/each}}
</script>

<script id="clickdesk-error-template" type="text/html">
<div class="wrapper-sm">
{{#check_length message "140"}}
	<div class="ellipsis-multi-line collapse-25 text-base" title="{{message}}" class="word-break p-t-none p-r-none p-l-none p-b-sm overflow-hidden text-base" style="height:110px;line-height:160%;">
		{{{message}}}
	</div>
{{else}}
	<div class="word-break p-t-none p-l-none p-r-none p-b-sm text-base" style="line-height:160%;">
		{{{message}}}
	</div>
{{/check_length}}
</div>
</script>

<script id="clickdesk-show-chat-template" type="text/html">
<div class="modal fade message-modal" id="clickdesk_chat_showModal" aria-hidden="false" style="display: block; padding-left: 17px;">
<div class="modal-backdrop fade" style="height: auto;"></div> 
 <div class="modal-dialog"> 
  <div class="modal-content"> 
	    <div class="modal-header">
	        <button class="close" data-dismiss="modal">x</button>
			<h3><i class="icon-info-sign"></i> Chat Transcript</h3>			
	    </div>
	    <div class="modal-body">
	        <table class="row-fluid table table-bordered l-h-xs m-b-xs word-break w-full" style="table-layout:fixed;">
						<tr><th class="p-xs">Visitor Name</th>
							<td class="p-xs">{{name}}</td>
						</tr>
						<tr><th class="p-xs">Visitor Email</th>
							<td class="p-xs">{{email}}</td>
						</tr>
						<tr>
							<th class="p-xs">First Message</th>
							<td class="p-xs">{{user_message}}</td>
						</tr>
						<tr>
							<th class="p-xs">Chat History URL</th>
							<td class="p-xs"><a href="{{chat_history_url}}" target="_blank">{{chat_history_url}}</a></td>
						</tr>	
						<tr>
							<th class="p-xs">Started At</th>
							<td class="p-xs text-muted"><i class="fa fa-clock-o m-r-xs"></i><time class="time-ago" datetime="{{epochToHumanDate "" start_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" start_time}}</time></td>
						</tr>
						<tr>
							<th class="p-xs">Ended At</th>
							<td class="p-xs text-muted"><i class="fa fa-clock-o m-r-xs"></i><time class="time-ago" datetime="{{epochToHumanDate "" end_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" end_time}}</time></td>
						</tr>	
						<tr>
							<th class="p-xs">Status</th>
							<td class="p-xs">{{status}}</td>
						</tr>
						<tr>
							<th class="p-xs">Initiated Chat Type</th>
							<td class="p-xs">{{initiated_chat_type}}</td>
						</tr>	
						<tr>
							<th class="p-xs">Chat Type</th>
							<td class="p-xs">{{chat_type}}</td>
						</tr>
						<tr>
							<th class="p-xs">IM type</th>
							<td class="p-xs">{{im_type}}</td>
						</tr>
						<tr>
							<th class="p-xs">Closed By</th>
							<td class="p-xs">{{closed_by}}</td>
						</tr>
						<tr>
							<th class="p-xs">Duration</th>
							<td class="p-xs">{{millSecondsToMinutes duration}}</td>
						</tr>
						<tr>
							<th class="p-xs">Chat Length</th>
							<td class="p-xs">{{chat_length}}</td>
						</tr>
						<tr>
							<th class="p-xs">Department Name</th>
							<td class="p-xs">{{widget_name}}</td>
						</tr>
			</table>
	    </div>
	<div class="modal-footer"></div> 
	</div>
</div> 
</div>
</script>

<script id="clickdesk-show-ticket-template" type="text/html">
<div class="modal fade message-modal" id="clickdesk_ticket_showModal" aria-hidden="false" style="display: block; padding-left: 17px;">
<div class="modal-backdrop fade" style="height: auto;"></div> 
 <div class="modal-dialog"> 
  <div class="modal-content"> 
	    <div class="modal-header">
	        <button class="close" data-dismiss="modal">x</button>
			<h3><i class="icon-info-sign"></i> Ticket</h3>			
	    </div>
	    <div class="modal-body">
	        <table class="row-fluid table table-bordered m-b-xs word-break w-full l-h-xs" style="table-layout:fixed;">
						<tr><th class="p-xs">From</th>
							<td class="p-xs">{{from}}</td>
						</tr>
						<tr><th class="p-xs">Created By</th>
							<td class="p-xs">{{from_name}}</td>
						</tr>	
						<tr>
							<th class="p-xs">Subject</th>
							<td class="p-xs">{{subject}}</td>
						</tr>
						<tr>
							<th class="p-xs">Ticket URL</th>
							<td class="p-xs"><a href="{{ticket_url}}" target="_blank">{{ticket_url}}</a></td>
						</tr>
						<tr>
							<th class="p-xs">Priority</th>
							<td class="p-xs">{{priority}}</td>
						</tr>
						<tr>
							<th class="p-xs">Status</th>
							<td class="p-xs">{{status}}</td>
						</tr>				
						<tr>
							<th class="p-xs">Created At</th>
							<td class="p-xs text-muted"><i class="fa fa-clock-o m-r-xs"></i><time class="time-ago" datetime="{{epochToHumanDate "" received_at}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" received_at}}</time></td>
						</tr>
						<tr>
							<th class="p-xs">Updated At</th>
							<td class="p-xs text-muted"><i class="fa fa-clock-o m-r-xs"></i><time class="time-ago" datetime="{{epochToHumanDate "" updated_at}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" updated_at}}</time></td>
						</tr>
						<tr>
							<th class="p-xs">Department</th>
							<td class="p-xs">{{widget_name}}</td>
						</tr>
						<tr>
							<th class="p-xs">Agent Name</th>
							<td class="p-xs">{{agent_name}}</td>
						</tr>
						<tr>
							<th class="p-xs">Asignee Type</th>
							<td class="p-xs">{{assignee_type}}</td>
						</tr>
						<tr>
							<th class="p-xs">Channel</th>
							<td class="p-xs">{{channel}}</td>
						</tr>
			</table>
	    </div>
	 <div class="modal-footer"></div> 
	</div>
</div> 
</div>
</script>
