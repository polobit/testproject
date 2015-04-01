!function(){var t=Handlebars.template,a=Handlebars.templates=Handlebars.templates||{};a["clickdesk-chat-stream-template"]=t(function(t,a,e,l,s){function n(t,a){var l,s="";return s+="\n		",l=e.each.call(t,t,{hash:{},inverse:p.noop,fn:p.program(2,d,a),data:a}),(l||0===l)&&(s+=l),s+="\n	"}function d(t,a){var l,s,n,d="";return d+='\n			<li class="sub_header_li clickdesk_chat_hover" url="',(s=e.chat_history_url)?l=s.call(t,{hash:{},data:a}):(s=t&&t.chat_history_url,l=typeof s===c?s.call(t,{hash:{},data:a}):s),d+=r(l)+'">\n				<div class="overflow-elipsis" title="',(s=e.user_message)?l=s.call(t,{hash:{},data:a}):(s=t&&t.user_message,l=typeof s===c?s.call(t,{hash:{},data:a}):s),d+=r(l)+'"><a href="',(s=e.chat_history_url)?l=s.call(t,{hash:{},data:a}):(s=t&&t.chat_history_url,l=typeof s===c?s.call(t,{hash:{},data:a}):s),d+=r(l)+'" target="_blank" >',(s=e.user_message)?l=s.call(t,{hash:{},data:a}):(s=t&&t.user_message,l=typeof s===c?s.call(t,{hash:{},data:a}):s),d+=r(l)+'</a></div>\n				<div style="margin-bottom:5px;">\n					<div class="label right">',(s=e.chat_type)?l=s.call(t,{hash:{},data:a}):(s=t&&t.chat_type,l=typeof s===c?s.call(t,{hash:{},data:a}):s),d+=r(l)+'</div>\n					<small><time class="time-ago" datetime="'+r((s=e.epochToHumanDate||t&&t.epochToHumanDate,n={hash:{},data:a},s?s.call(t,"",t&&t.start_time,n):o.call(t,"epochToHumanDate","",t&&t.start_time,n)))+'">'+r((s=e.epochToHumanDate||t&&t.epochToHumanDate,n={hash:{},data:a},s?s.call(t,"ddd mmm dd yyyy HH:MM:ss",t&&t.start_time,n):o.call(t,"epochToHumanDate","ddd mmm dd yyyy HH:MM:ss",t&&t.start_time,n)))+'</time></small>\n				</div>\n				<div class="sub_header_tab_link clickdesk_chat_tab_link" style="float:left;margin:0px;display:none;">\n					<div><a url="',(s=e.chat_history_url)?l=s.call(t,{hash:{},data:a}):(s=t&&t.chat_history_url,l=typeof s===c?s.call(t,{hash:{},data:a}):s),d+=r(l)+'" id="clickdesk_chat_show" style="cursor: pointer;" rel="tooltip" title="Show chat transcript" data-attr="'+r((s=e.bindData||t&&t.bindData,n={hash:{},data:a},s?s.call(t,t,n):o.call(t,"bindData",t,n)))+'">Show</a></div>\n				</div>\n			</li>\n		'}this.compilerInfo=[4,">= 1.0.0"],e=this.merge(e,t.helpers),s=s||{};var i,h="",c="function",r=this.escapeExpression,o=e.helperMissing,p=this;return h+="\n	",i=e["if"].call(a,a,{hash:{},inverse:p.noop,fn:p.program(1,n,s),data:s}),(i||0===i)&&(h+=i),h+="\n\n"}),a["clickdesk-error-template"]=t(function(t,a,e,l,s){function n(t,a){var l,s,n="";return n+='\n	<div class="ellipsis-multi-line collapse-25" title="',(s=e.message)?l=s.call(t,{hash:{},data:a}):(s=t&&t.message,l=typeof s===o?s.call(t,{hash:{},data:a}):s),n+=p(l)+'" style="height:110px;overflow: hidden;line-height:160%;word-wrap: break-word;padding:0px 0px 10px">\n		',(s=e.message)?l=s.call(t,{hash:{},data:a}):(s=t&&t.message,l=typeof s===o?s.call(t,{hash:{},data:a}):s),(l||0===l)&&(n+=l),n+="\n	</div>\n"}function d(t,a){var l,s,n="";return n+='\n	<div style="line-height:160%;word-wrap: break-word;padding:0px 0px 10px">\n		',(s=e.message)?l=s.call(t,{hash:{},data:a}):(s=t&&t.message,l=typeof s===o?s.call(t,{hash:{},data:a}):s),(l||0===l)&&(n+=l),n+="\n	</div>\n"}this.compilerInfo=[4,">= 1.0.0"],e=this.merge(e,t.helpers),s=s||{};var i,h,c,r="",o="function",p=this.escapeExpression,m=this,y=e.helperMissing;return r+="\n",h=e.check_length||a&&a.check_length,c={hash:{},inverse:m.program(3,d,s),fn:m.program(1,n,s),data:s},i=h?h.call(a,a&&a.message,"140",c):y.call(a,"check_length",a&&a.message,"140",c),(i||0===i)&&(r+=i),r+="\n\n"}),a["clickdesk-login-template"]=t(function(t,a,e,l,s){return this.compilerInfo=[4,">= 1.0.0"],e=this.merge(e,t.helpers),s=s||{},'\n	<div display:inline;  line-height:12px;word-wrap: break-word;">\n		<form class="widget_content" style="border-bottom:none;" id="clickdesk_login_form" name="clickdesk_login_form" method="post">\n	    	<fieldset>\n				<p style=\'line-height:140%;\'>Convert chat sessions with potential customers into contacts in Agile along with the conversation.</p>\n				<p>\n				<label>Enter your ClickDesk details </label>\n				<div class="control-group" style="margin-bottom:0px"><div class="controls"><input type="text" id="clickdesk_username" class="input-medium required widget_input_box" style="width:90%" placeholder="User Name" value="" name="username"></input></div></div>\n				<div class="control-group"><div class="controls"><input type="text" id="clickdesk_api_key" class="input-medium required widget_input_box" style="width:90%" placeholder="API Key" value="" name="api_key"></input><br/></div></div>			\n				</p>\n				<a href="#" id="save_clickdesk_prefs" class="btn btn-primary" style="text-decoration:none;cursor:pointer;">Save</a>\n				<a href="#add-widget" class="btn ml_5" style="text-decoration:none;">Cancel</a>\n			 </fieldset>\n	    </form>\n	</div>\n\n'}),a["clickdesk-profile-template"]=t(function(t,a,e,l,s){this.compilerInfo=[4,">= 1.0.0"],e=this.merge(e,t.helpers),s=s||{};var n,d,i="",h=e.helperMissing,c=this.escapeExpression;return i+='\n<p class="widget_content" style="margin:0px 0px 10px 0px;font-size:13px;">Conversations and tickets related to '+c((n=e.getCurrentContactProperty||a&&a.getCurrentContactProperty,d={hash:{},data:s},n?n.call(a,"first_name",d):h.call(a,"getCurrentContactProperty","first_name",d)))+" "+c((n=e.getCurrentContactProperty||a&&a.getCurrentContactProperty,d={hash:{},data:s},n?n.call(a,"last_name",d):h.call(a,"getCurrentContactProperty","last_name",d)))+'</p>\n<ul class="nav nav-tabs clickdeskTab" id="myTab">\n	<li class="active" style="width:48%; margin-left: 2%; text-align: center;" align="center"><a data-toggle="tab" href="#chats" id="clickdesk_chats"><h4>Chats</h4><small></small></a></li>\n	<li style="width:48%;text-align: center;" align="center"><a data-toggle="tab" href="#c_tickets" id="clickdesk_tickets"><h4>Tickets</h4><small></small></a></li>\n</ul>\n<div class="tab-content" id="myTabContent">\n	<div id="chats" class="tab-pane fade active in">\n		<ul class="widget_tab_content clickdesktab-content" id="clickdesk_chats_panel">\n						\n		</ul>\n		<div class="clearfix" id="clickdesk-chats-error-panel" style="display:none;">\n		</div>\n		<div class="widget_tab_footer" align="center">\n			<a class="more_chats_link" id="more_chats_link" style="cursor: pointer;" rel="tooltip" title="Click to see more chats">Show More</a>\n			<a data-toggle="collapse" data-target="#clickdesk_chats_panel" id="less_chats_link" style="display:none;cursor:pointer;">Show Less..</a>\n			<img src="img/ajax-spinner.gif" id="spinner-clickdesk-chats" style="display:none;"></img>\n		</div>\n	</div>\n	<div id="c_tickets" class="tab-pane fade">\n		<ul class="widget_tab_content" id="clickdesk_tickets_panel">\n						\n		</ul>\n		<div class="clearfix" id="clickdesk-tickets-error-panel" style="display:none;">\n		</div>\n		<div class="widget_tab_footer" align="center">\n			<a class="more_tickets_link" id="more_tickets_link" style="cursor: pointer;" rel="tooltip" title="Click to see more tickets">Show More</a>\n			<a data-toggle="collapse" data-target="#clickdesk_tickets_panel" id="less_tickets_link" style="display:none;cursor:pointer;">Show Less..</a>\n			<img src="img/ajax-spinner.gif" id="spinner-clickdesk-tickets" style="display:none;"></img>\n		</div>\n	</div>\n</div>\n\n'}),a["clickdesk-show-chat-template"]=t(function(t,a,e,l,s){this.compilerInfo=[4,">= 1.0.0"],e=this.merge(e,t.helpers),s=s||{};var n,d,i,h="",c="function",r=this.escapeExpression,o=e.helperMissing;return h+='\n	<div class="modal hide fade message-modal" id="clickdesk_chat_showModal" style="width:400px; left:55%">\n	    <div class="modal-header">\n	        <button class="close" data-dismiss="modal">x</button>\n			<h3><i class="icon-info-sign"></i> Chat Transcript</h3>			\n	    </div>\n	    <div class="well" style="margin-bottom:0px;">\n	        <table class="row-fluid table table-bordered" style="line-height:13px;margin-bottom:5px;word-wrap: break-word; table-layout:fixed;width:100%;">\n						<tr><th style="padding: 5px;">Visitor Name</th>\n							<td style="padding: 5px;">',(d=e.name)?n=d.call(a,{hash:{},data:s}):(d=a&&a.name,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+'</td>\n						</tr>\n						<tr><th style="padding: 5px;">Visitor Email</th>\n							<td style="padding: 5px;">',(d=e.email)?n=d.call(a,{hash:{},data:s}):(d=a&&a.email,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+'</td>\n						</tr>\n						<tr>\n							<th style="padding: 5px;">First Message</th>\n							<td style="padding: 5px;">',(d=e.user_message)?n=d.call(a,{hash:{},data:s}):(d=a&&a.user_message,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+'</td>\n						</tr>\n						<tr>\n							<th style="padding: 5px;">Chat History URL</th>\n							<td style="padding: 5px;"><a href="',(d=e.chat_history_url)?n=d.call(a,{hash:{},data:s}):(d=a&&a.chat_history_url,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+'" target="_blank">',(d=e.chat_history_url)?n=d.call(a,{hash:{},data:s}):(d=a&&a.chat_history_url,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+'</a></td>\n						</tr>	\n						<tr>\n							<th style="padding: 5px;">Started At</th>\n							<td style="padding: 5px;"><time class="time-ago" datetime="'+r((d=e.epochToHumanDate||a&&a.epochToHumanDate,i={hash:{},data:s},d?d.call(a,"",a&&a.start_time,i):o.call(a,"epochToHumanDate","",a&&a.start_time,i)))+'">'+r((d=e.epochToHumanDate||a&&a.epochToHumanDate,i={hash:{},data:s},d?d.call(a,"ddd mmm dd yyyy HH:MM:ss",a&&a.start_time,i):o.call(a,"epochToHumanDate","ddd mmm dd yyyy HH:MM:ss",a&&a.start_time,i)))+'</time></td>\n						</tr>\n						<tr>\n							<th style="padding: 5px;">Ended At</th>\n							<td style="padding: 5px;"><time class="time-ago" datetime="'+r((d=e.epochToHumanDate||a&&a.epochToHumanDate,i={hash:{},data:s},d?d.call(a,"",a&&a.end_time,i):o.call(a,"epochToHumanDate","",a&&a.end_time,i)))+'">'+r((d=e.epochToHumanDate||a&&a.epochToHumanDate,i={hash:{},data:s},d?d.call(a,"ddd mmm dd yyyy HH:MM:ss",a&&a.end_time,i):o.call(a,"epochToHumanDate","ddd mmm dd yyyy HH:MM:ss",a&&a.end_time,i)))+'</time></td>\n						</tr>	\n						<tr>\n							<th style="padding: 5px;">Status</th>\n							<td style="padding: 5px;">',(d=e.status)?n=d.call(a,{hash:{},data:s}):(d=a&&a.status,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+'</td>\n						</tr>\n						<tr>\n							<th style="padding: 5px;">Initiated Chat Type</th>\n							<td style="padding: 5px;">',(d=e.initiated_chat_type)?n=d.call(a,{hash:{},data:s}):(d=a&&a.initiated_chat_type,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+'</td>\n						</tr>	\n						<tr>\n							<th style="padding: 5px;">Chat Type</th>\n							<td style="padding: 5px;">',(d=e.chat_type)?n=d.call(a,{hash:{},data:s}):(d=a&&a.chat_type,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+'</td>\n						</tr>\n						<tr>\n							<th style="padding: 5px;">IM type</th>\n							<td style="padding: 5px; ">',(d=e.im_type)?n=d.call(a,{hash:{},data:s}):(d=a&&a.im_type,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+'</td>\n						</tr>\n						<tr>\n							<th style="padding: 5px;">Closed By</th>\n							<td style="padding: 5px;">',(d=e.closed_by)?n=d.call(a,{hash:{},data:s}):(d=a&&a.closed_by,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+'</td>\n						</tr>\n						<tr>\n							<th style="padding: 5px;">Duration</th>\n							<td style="padding: 5px;">'+r((d=e.millSecondsToMinutes||a&&a.millSecondsToMinutes,i={hash:{},data:s},d?d.call(a,a&&a.duration,i):o.call(a,"millSecondsToMinutes",a&&a.duration,i)))+'</td>\n						</tr>\n						<tr>\n							<th style="padding: 5px;">Chat Length</th>\n							<td style="padding: 5px;">',(d=e.chat_length)?n=d.call(a,{hash:{},data:s}):(d=a&&a.chat_length,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+'</td>\n						</tr>\n						<tr>\n							<th style="padding: 5px;">Department Name</th>\n							<td style="padding: 5px;">',(d=e.widget_name)?n=d.call(a,{hash:{},data:s}):(d=a&&a.widget_name,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+"</td>\n						</tr>\n			</table>\n	    </div>\n	</div>\n\n"}),a["clickdesk-show-ticket-template"]=t(function(t,a,e,l,s){this.compilerInfo=[4,">= 1.0.0"],e=this.merge(e,t.helpers),s=s||{};var n,d,i,h="",c="function",r=this.escapeExpression,o=e.helperMissing;return h+='\n	<div class="modal hide fade message-modal" id="clickdesk_ticket_showModal" style="width:400px; left:55%">\n	    <div class="modal-header">\n	        <button class="close" data-dismiss="modal">x</button>\n			<h3><i class="icon-info-sign"></i> Ticket</h3>			\n	    </div>\n	    <div class="well" style="margin-bottom:0px;">\n	        <table class="row-fluid table table-bordered" style="line-height:13px;margin-bottom:5px;word-wrap: break-word; table-layout:fixed;width:100%;">\n						<tr><th style="padding: 5px;">From</th>\n							<td style="padding: 5px;">',(d=e.from)?n=d.call(a,{hash:{},data:s}):(d=a&&a.from,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+'</td>\n						</tr>\n						<tr><th style="padding: 5px;">Created By</th>\n							<td style="padding: 5px;">',(d=e.from_name)?n=d.call(a,{hash:{},data:s}):(d=a&&a.from_name,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+'</td>\n						</tr>	\n						<tr>\n							<th style="padding: 5px;">Subject</th>\n							<td style="padding: 5px;">',(d=e.subject)?n=d.call(a,{hash:{},data:s}):(d=a&&a.subject,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+'</td>\n						</tr>\n						<tr>\n							<th style="padding: 5px;">Ticket URL</th>\n							<td style="padding: 5px; "><a href="',(d=e.ticket_url)?n=d.call(a,{hash:{},data:s}):(d=a&&a.ticket_url,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+'" target="_blank">',(d=e.ticket_url)?n=d.call(a,{hash:{},data:s}):(d=a&&a.ticket_url,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+'</a></td>\n						</tr>\n						<tr>\n							<th style="padding: 5px;">Priority</th>\n							<td style="padding: 5px;">',(d=e.priority)?n=d.call(a,{hash:{},data:s}):(d=a&&a.priority,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+'</td>\n						</tr>\n						<tr>\n							<th style="padding: 5px;">Status</th>\n							<td style="padding: 5px;">',(d=e.status)?n=d.call(a,{hash:{},data:s}):(d=a&&a.status,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+'</td>\n						</tr>				\n						<tr>\n							<th style="padding: 5px;">Created At</th>\n							<td style="padding: 5px;"><time class="time-ago" datetime="'+r((d=e.epochToHumanDate||a&&a.epochToHumanDate,i={hash:{},data:s},d?d.call(a,"",a&&a.received_at,i):o.call(a,"epochToHumanDate","",a&&a.received_at,i)))+'">'+r((d=e.epochToHumanDate||a&&a.epochToHumanDate,i={hash:{},data:s},d?d.call(a,"ddd mmm dd yyyy HH:MM:ss",a&&a.received_at,i):o.call(a,"epochToHumanDate","ddd mmm dd yyyy HH:MM:ss",a&&a.received_at,i)))+'</time></td>\n						</tr>\n						<tr>\n							<th style="padding: 5px;">Updated At</th>\n							<td style="padding: 5px;"><time class="time-ago" datetime="'+r((d=e.epochToHumanDate||a&&a.epochToHumanDate,i={hash:{},data:s},d?d.call(a,"",a&&a.updated_at,i):o.call(a,"epochToHumanDate","",a&&a.updated_at,i)))+'">'+r((d=e.epochToHumanDate||a&&a.epochToHumanDate,i={hash:{},data:s},d?d.call(a,"ddd mmm dd yyyy HH:MM:ss",a&&a.updated_at,i):o.call(a,"epochToHumanDate","ddd mmm dd yyyy HH:MM:ss",a&&a.updated_at,i)))+'</time></td>\n						</tr>\n						<tr>\n							<th style="padding: 5px;">Department</th>\n							<td style="padding: 5px;">',(d=e.widget_name)?n=d.call(a,{hash:{},data:s}):(d=a&&a.widget_name,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+'</td>\n						</tr>\n						<tr>\n							<th style="padding: 5px;">Agent Name</th>\n							<td style="padding: 5px;">',(d=e.agent_name)?n=d.call(a,{hash:{},data:s}):(d=a&&a.agent_name,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+'</td>\n						</tr>\n						<tr>\n							<th style="padding: 5px;">Asignee Type</th>\n							<td style="padding: 5px;">',(d=e.assignee_type)?n=d.call(a,{hash:{},data:s}):(d=a&&a.assignee_type,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+'</td>\n						</tr>\n						<tr>\n							<th style="padding: 5px;">Channel</th>\n							<td style="padding: 5px;">',(d=e.channel)?n=d.call(a,{hash:{},data:s}):(d=a&&a.channel,n=typeof d===c?d.call(a,{hash:{},data:s}):d),h+=r(n)+"</td>\n						</tr>\n			</table>\n	    </div>\n	</div>\n\n"}),a["clickdesk-ticket-stream-template"]=t(function(t,a,e,l,s){function n(t,a){var l,s,n,d="";return d+='\n		<li class="sub_header_li clickdesk_ticket_hover" url="',(s=e.ticket_url)?l=s.call(t,{hash:{},data:a}):(s=t&&t.ticket_url,l=typeof s===h?s.call(t,{hash:{},data:a}):s),d+=c(l)+'">\n			<div class="overflow-elipsis" title="',(s=e.subject)?l=s.call(t,{hash:{},data:a}):(s=t&&t.subject,l=typeof s===h?s.call(t,{hash:{},data:a}):s),d+=c(l)+'"><a href="',(s=e.ticket_url)?l=s.call(t,{hash:{},data:a}):(s=t&&t.ticket_url,l=typeof s===h?s.call(t,{hash:{},data:a}):s),d+=c(l)+'" target="_blank" >',(s=e.subject)?l=s.call(t,{hash:{},data:a}):(s=t&&t.subject,l=typeof s===h?s.call(t,{hash:{},data:a}):s),d+=c(l)+'</a></div>\n			<div style="margin-bottom:5px;">\n				<div class="label right">',(s=e.status)?l=s.call(t,{hash:{},data:a}):(s=t&&t.status,l=typeof s===h?s.call(t,{hash:{},data:a}):s),d+=c(l)+'</div>\n				<small><time class="time-ago" datetime="'+c((s=e.epochToHumanDate||t&&t.epochToHumanDate,n={hash:{},data:a},s?s.call(t,"",t&&t.received_at,n):r.call(t,"epochToHumanDate","",t&&t.received_at,n)))+'">'+c((s=e.epochToHumanDate||t&&t.epochToHumanDate,n={hash:{},data:a},s?s.call(t,"ddd mmm dd yyyy HH:MM:ss",t&&t.received_at,n):r.call(t,"epochToHumanDate","ddd mmm dd yyyy HH:MM:ss",t&&t.received_at,n)))+'</time></small>\n			</div>\n			<div class="sub_header_tab_link clickdesk_ticket_tab_link" style="float:left;margin:0px;display:none;">\n				<div><a url="',(s=e.ticket_url)?l=s.call(t,{hash:{},data:a}):(s=t&&t.ticket_url,l=typeof s===h?s.call(t,{hash:{},data:a}):s),d+=c(l)+'" id="clickdesk_ticket_show" style="cursor: pointer;" rel="tooltip" title="Show more information of ticket" data-attr="'+c((s=e.bindData||t&&t.bindData,n={hash:{},data:a},s?s.call(t,t,n):r.call(t,"bindData",t,n)))+'">Show</a></div>\n			</div>\n		</li>\n	'}this.compilerInfo=[4,">= 1.0.0"],e=this.merge(e,t.helpers),s=s||{};var d,i="",h="function",c=this.escapeExpression,r=e.helperMissing,o=this;return i+="\n	",d=e.each.call(a,a,{hash:{},inverse:o.noop,fn:o.program(1,n,s),data:s}),(d||0===d)&&(i+=d),i+="\n\n"})}();