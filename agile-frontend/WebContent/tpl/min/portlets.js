<script id="portlets-add-model-template" type="text/html">
<div style="margin-top:15px">
	<div>
		<div class="pull-left" style="margin-right:10px;margin-bottom:15px;">
			<div id="portlets_main" class="network-type" style="cursor: pointer; color: #8a6086; font-size: 16px;" onclick="javascript:addNewPortlet('{{portlet_type}}','{{remove_spaces name}}');">
			<a>
			<i class="portlets-modal-icon icon {{get_portlet_icon name}}"></i>				
				{{get_portlet_name name}}
			</a>
			</div>
		</div>    
	</div>	
</div>
</script>
<script id="portlets-add-collection-template" type="text/html">
<div class="row-fluid">
	<div class="span10 offset1">
		<h4 class="portlet-head" style="margin-top:10px;">Contacts</h4>
		<div id="contacts"></div><br/>
	</div>
</div>
<div class="row-fluid">
	<div class="span10 offset1">
		<h4 class="portlet-head">Deals</h4>
		<div id="deals" class="row-fluid"></div><br/>
    </div>
</div>
<div class="row-fluid">
	<div class="span10 offset1">
		<h4 class="portlet-head">Calendar</h4>
		<div id="taksAndEvents" class="row-fluid"></div><br/>
	</div>
</div>
<div class="row-fluid">
	<div class="span10 offset1">
		<h4 class="portlet-head">User Activity</h4>
		<div id="userActivity" class="row-fluid"></div><br/>
	</div>
</div>
<div class="row-fluid">
	<div class="span10 offset1">
		<h4 class="portlet-head">RSS Feed</h4>
		<div id="rssFeed" class="row-fluid"></div><br/>
	</div>
</div>
</script><script id="portlets-contacts-model-template" type="text/html">
	<td class="data" data="{{id}}">
	<div class="row-fluid">
        <div style="display:inline;padding-right:1px;height:auto;">
        	{{#if_contact_type "PERSON"}}
        		<img class="portlet-roundimg img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}"  width="40px" height="40px" style="display:inline; width:30px; height:30px; " />
        	{{/if_contact_type}}
        
			{{#if_contact_type "COMPANY"}}
        		<img class="portlet-roundimg" {{getCompanyImage "30" "display:inline;"}} />
        	{{/if_contact_type}}
    	</div>
    	<div style="height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:70%;margin-left:7px;">
        	{{#if_contact_type "PERSON"}}
        		<span class="font-14">	{{getPropertyValue properties "first_name"}}
        		{{getPropertyValue properties "last_name"}} </span>
        		<br />
        		{{getPropertyValue properties "email"}}
        	{{/if_contact_type}}
  
            {{#if_contact_type "COMPANY"}}
        		{{getPropertyValue properties "name"}}</br>
        		{{getPropertyValue properties "url"}}
        	{{/if_contact_type}}
	    </div>
	</div>
	</td>
	<td><div style="display:inline-block;vertical-align:top;">{{getPropertyValue properties "title"}}<br />
    	{{getPropertyValue properties "company"}}</div>
	</td>
	<td> 
<!-- <div style="height:auto;display:inline-block;vertical-align:top;text-overflow:clip;white-space:nowrap;width:15em;overflow:hidden;"> --> 
	 <div class="fieldoverflow-ellipsis" style="text-align:right" > 	
		{{#each tags}}
	    	<span class="label">{{this}}</span>	
		{{/each}}
	</div>
	
	</td>
	<!-- <td><div>{{lead_score}}</div></td> -->
</script>

<script id="portlets-contacts-collection-template" type="text/html">
<!-- <div class="row"> -->
		{{#if this.length}}
		<!-- <div class="data">
			<div class="data-container"></div> -->
			<table id="contacts" class="table agile-ellipsis-dynamic" style="overflow-x: hidden;overflow-y:auto;">
				<col width="45%">
				<col width="20%">
				<col width="24%">
				<!-- <col width="12%"> -->
				<!-- <div class="filter-criteria"></div> -->
				<!-- <thead>
					<tr>
						<th>Name</th>
						<th>Work</th>
						<th>Tags</th> -->
						<!-- <th>Lead Score</th> -->
					<!-- </tr>
				</thead> -->
				<tbody id="portlets-contacts-model-list" class="portlets-contacts-model-list" style="word-break:normal!important;"
					route="contact/">
				</tbody>
			</table>
		<!-- </div>
	</div> -->
    {{else}}
		<div class="portlet-error-message">
       		No Contacts Found
		</div>
	{{/if}}
<!-- </div> -->
</script>

<script id="portlets-contacts-email-opens-model-template" type="text/html">
	<td class="data" data="{{contact_id}}">
	<div class="row-fluid">
        <div class="inline p-r-xxs h-auto">
        	{{#if_contact_type "PERSON"}}
        		<img class="portlet-roundimg img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}"  width="40px" height="40px" style="display:inline; width:30px; height:30px; " />
        	{{/if_contact_type}}
        
			{{#if_contact_type "COMPANY"}}
        		<img class="portlet-roundimg" {{getCompanyImage "30" "display:inline;"}} />
        	{{/if_contact_type}}
    	</div>
    	<div class="h-auto inline-block v-top text-ellipsis" style="width:70%;margin-left:7px;">
        	{{#if_contact_type "PERSON"}}
        		<span class="font-14">	{{getPropertyValue properties "first_name"}}
        		{{getPropertyValue properties "last_name"}} </span>
        		<br />
        		Opened email '{{subject}}'
        	{{/if_contact_type}}
  
            {{#if_contact_type "COMPANY"}}
        		{{getPropertyValue properties "name"}}</br>
        		Opened email '{{subject}}'
        	{{/if_contact_type}}
	    </div>
	</div>
	</td>
	<td>
		<div class="inline-block v-top text-right" style="float:right;">
			<time class="time-ago" datetime="{{epochToHumanDate "" openedTime}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" openedTime}}</time>
		</div>
	</td>
	<!-- <td>
		<div class="fieldoverflow-ellipsis text-right">
			<time class="time-ago" datetime="{{epochToHumanDate "" openedTime}}" style="border-bottom: dotted 1px #999;">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" openedTime}}</time>
		</div> -->
	</td>
</script>

<script id="portlets-contacts-email-opens-collection-template" type="text/html">
{{#if this.length}}
	<table id="contacts" class="table agile-ellipsis-dynamic" style="overflow-x: hidden;overflow-y:auto;">
		<col width="70%">
		<col width="40%">
		<!-- <col width="24%"> -->
		<tbody id="portlets-contacts-email-opens-model-list" class="portlets-contacts-emails-opened-model-list" style="word-break:normal!important;" route="contact/">
		</tbody>
	</table>
{{else}}
	<div class="portlet-error-message">
		No email activity
	</div>
{{/if}}
</script>

<script id="portlets-companies-model-template" type="text/html">
	<td class="data" data="{{id}}">
        <div style="display:inline;padding-right:5px;height:auto;">
        		<img class="portlet-roundimg img-inital" {{getCompanyImage "30" "display:inline;"}} />
    	</div>
    	<div style="height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:60%;">
        		{{getPropertyValue properties "name"}}</br>
        		{{getPropertyValue properties "url"}}
    	</div>
	</td>
	<td>
		<div>{{setupRating star_value}}</div>
	</td>
	<td>
		<div>{{owner.name}}</div>
	</td>
</script>

<script id="portlets-companies-collection-template" type="text/html">
<!-- <div class="row"> -->
		{{#if this.length}}
		<!-- <div class="data">
			<div class="data-container"></div> -->
			<table id="contacts" class="table agile-ellipsis-dynamic">
				<col width="30%">
				<col width="26%">
				<col width="30%">
				<!-- <div class="filter-criteria"></div> -->
				<!-- <thead>
					<tr>
						<th>Name</th>
						<th>Star Value</th>
						<th>Owner</th>
					</tr>
				</thead> -->
				<tbody id="portlets-companies-model-list" class="portlets-companies-model-list"
					route="contact/" style="overflow: scroll;">
				</tbody>
			</table>
		<!-- </div>
	</div> -->
    {{else}}
		<div class="portlet-error-message">
      		No comapnies found
		</div>
	{{/if}}
<!-- </div> -->
</script>
<script id="portlets-opportunities-collection-template" type="text/html">
<div id="dealsWonValue" class="dealsWonValue" style="display:none;font-weight:bold;"></div>
{{#if this.length}}
<table class="table  no-sorting agile-ellipsis-dynamic">
<!-- <colgroup>
	<col width="14%">
	<col width="20%">
	<col width="10%"> 
	<col width="15%"> 
	<col width="15%"> 
</colgroup> -->         
          			<!-- <thead>
                        <tr>
                            <th>Opportunity</th>
                            <th>Related To</th>
                            <th>Value</th> -->
                            <!-- <th>Milestone</th> -->
                            <!-- <th>Close Date</th> -->
                        <!-- </tr>
                    </thead> -->
              <tbody id="portlets-opportunities-model-list" class="portlets-opportunities-model-list" style="cursor:pointer;word-break:normal!important;">
          </tbody>
	</table>
{{else}}
	<div class="portlet-error-message">
      No deals pending
	</div>
{{/if}}
</script>

<script id="portlets-opportunities-model-template" type="text/html">
<td data="{{id}}" class="data">
	<div class="portlet-time-view">
		<div style="width: 70%;float:left;">
			<div style="max-width: 100%;float:left;">{{name}}</div> <!-- <span class="label" style="max-width: 10%;">{{milestone}}</span> -->
		</div>
		<p class="pull-right" style="text-align: right; max-width: 30%; white-space: nowrap;float:right;font-weight:bold;margin-bottom:3px;">
			<span>{{currencySymbol}}{{numberWithCommas expected_value}}</span>
		</p>
		<div class="clearfix"></div>
	</div>
	<div>
		<p style="width: 30%;margin-bottom:3px;" class="pull-left">
			<span>
				<time class="time-ago" datetime="{{epochToHumanDate "" close_date}}" >{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" close_date}}</time>
			</span>
		</p>
		{{#if this.contacts}}
			<p class="activate-link pull-right" style="margin-bottom:3px;">
				{{#related_to_one contacts}}{{/related_to_one}}
			</p>
		{{/if}}
	</div>
</td>
</script>
<script id="portlets-tasks-collection-template" type="text/html">
<!-- <div class="line" style="text-align:centre;"><h3>Tasks</h3></div> -->
{{#if this.length}}
<table class="table no-sorting agile-ellipsis-dynamic">
<colgroup>
	<col width="8%">
    <col width="92%">
</colgroup>         
              <tbody id="portlets-tasks-model-list" style="cursor:pointer;">
          </tbody>
	</table>
{{else}}
		<div class="portlet-error-message">
      		No tasks for today
		</div>
{{/if}}
</script>
<script id="portlets-tasks-model-template" type="text/html">
<td data="{{id}}" class="data"> <input type="checkbox" data='{{id}}' class='portlets-tasks-select' id="tasklist">
<!-- <label for="tasklist" style="overflow:visible;"></label> --> </td>
	<td style="width:100%!important;">
		<div>
  			<p style="width:60%;float:left;margin-bottom:3px;">{{#is_link subject}}<span class="activate-link" style="white-space: normal!important;">{{else}}<span style="white-space: normal!important;">{{/is_link}}{{safe_string subject}}</span></p>
  			<p style="max-width:39%;overflow:visible !important;float:right;margin-bottom:3px;"> 
				{{#if_equals priority_type "NORMAL"}}{{else}}
					<span style="margin-left:5px;" class="label label-{{task_label_color priority_type}}">{{ucfirst priority_type}}</span>
				{{/if_equals}}
				<span class="label">{{task_property type}}</span>
			</p>
		</div>
        <div>
  			{{#if this.contacts}}
				<p class="activate-link" style="white-space: nowrap;margin-bottom:3px;">{{#related_to_one contacts}}{{/related_to_one}}</p>
			{{/if}}
		</div>
	</td>
</script>
<script id="portlets-events-collection-template" type="text/html">
<!-- <div class="line" style="text-align:centre;"><h3>Events</h3></div> -->
{{#if this.length}}
<table class="table no-sorting agile-ellipsis-dynamic">
<!-- <colgroup>
	<col width="14%">
    <col width="14%">
    <col width="30%">
</colgroup> -->         
          			<!-- <thead>
                        <tr>
                            <th>Name</th>
                            <th>Priority</th>
                            <th>End Date</th>
                        </tr>
                    </thead> -->
              <tbody id="portlets-events-model-list" style="cursor:pointer;">
          </tbody>
	</table>
{{else}}
		<div class="portlet-error-message">
      		No calendar events for today
		</div>
{{/if}}
</script>
<script id="portlets-events-model-template" type="text/html">
<td data="{{id}}" class="data">
	<div class="portlet-time-view">
		<div style="width:85%;float:left;">
			<time class="event-start-time" datetime="{{get_AM_PM_format start}}" style="color:#000;font-weight: bold;">{{get_AM_PM_format start}}</time>
			<!-- <span style="vertical-align: top;position: relative;top: -2px;">:</span>
			<time class="event-start-time" datetime="{{epochToHumanDate "HH:MM" start}}" style="color:#000;vertical-align:top;position:relative;top:-1px;">{{epochToHumanDate "MM" start}}</time> -->
			<!-- <span class="times-space"></span> -->
			<time class="event-end-time" datetime="{{epochToHumanDate "HH:MM" end}}" >({{get_duration start end}})</time>
			<!-- <span style="vertical-align: top;position: relative;top: -2px;">:</span>
			<time class="event-end-time" datetime="{{epochToHumanDate "HH:MM" end}}" style="color:#000;vertical-align:top;position:relative;top:-1px;">{{epochToHumanDate "MM" end}}</time> -->
		</div>
		<p class="pull-right" style="margin-bottom:3px;float:right;max-width:15%;overflow:visible!important;">
			{{#if_equals color "#36C"}}{{else}}
				<span class="label label-{{#if_equals color "red"}}{{task_label_color "HIGH"}}{{/if_equals}}{{#if_equals color "green"}}{{task_label_color "LOW"}}{{/if_equals}}">{{#if_equals color "red"}}High{{/if_equals}}{{#if_equals color "green"}}Low{{/if_equals}}</span>
			{{/if_equals}}
		</p>
		<div class="clearfix"></div>
	</div>
	<div>
		<p style="width:100%;margin-bottom:3px;" class="pull-left">
			<span>{{title}}</span>
		</p>
	</div>
	<div>
		{{#if this.contacts}}
			<p class="activate-link" style="width: 100%; white-space: nowrap;float:left;margin-bottom:3px;">
				{{#related_to_one contacts}}{{/related_to_one}}
			</p>
		{{/if}}
	</div>
	<!-- <div style="height:auto;">
		<b>{{title}}</b>
	</div> -->
</td>
<!-- <td><div><span class="label label-{{#if_equals color "red"}}{{task_label_color "HIGH"}}{{/if_equals}}{{#if_equals color "#36C"}}{{task_label_color "NORMAL"}}{{/if_equals}}{{#if_equals color "green"}}{{task_label_color "LOW"}}{{/if_equals}}">{{#if_equals color "red"}}High{{/if_equals}}{{#if_equals color "#36C"}}Normal{{/if_equals}}{{#if_equals color "green"}}Low{{/if_equals}}</span></div></td>
<td><div><time class="event-end-time" datetime="{{epochToHumanDate "" end}}" style="border-bottom: dotted 1px #999;">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" end}}</time></div></td> -->
</script>
<script id="portlets-contacts-filterbased-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="icon-remove {{remove_spaces name}}-close" style="cursor:pointer;" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span>
				<span>
                   {{get_flitered_contact_portlet_header settings.filter}}
                </span>
			</div>
		</div>
        <div class="portlet_body"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>	
</script>

<script id="portlets-contacts-emails-opened-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="icon-remove {{remove_spaces name}}-close" style="cursor:pointer;" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span>
				<span>
					{{#if_equals settings.duration "1-day"}}
						Emails Opened <small>Today</small>
					{{/if_equals}}
					{{#if_equals settings.duration "yesterday"}}
						Emails Opened <small>Yesterday</small>
					{{/if_equals}}
					{{#if_equals settings.duration "2-days"}}
						Emails Opened <small>Last 2 Days</small>
					{{/if_equals}}
					{{#if_equals settings.duration "this-week"}}
						Emails Opened <small>This Week</small>
					{{/if_equals}}
					{{#if_equals settings.duration "1-week"}}
						Emails Opened <small>Last 7 Days</small>
					{{/if_equals}}
					{{#if_equals settings.duration "this-month"}}
						Emails Opened <small>This Month</small>
					{{/if_equals}}
					{{#if_equals settings.duration "1-month"}}
						Emails Opened <small>Last 30 Days</small>
					{{/if_equals}}
                </span>
			</div>
		</div>
        <div class="portlet_body"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>
</script>
<script id="portlets-contacts-emails-sent-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="icon-remove {{remove_spaces name}}-close" style="cursor:pointer;" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span>
				<span>
					{{#if_equals settings.duration "1-day"}}
						Emails Sent <small>Today</small>
					{{/if_equals}}
					{{#if_equals settings.duration "yesterday"}}
						Emails Sent <small>Yesterday</small>
					{{/if_equals}}
					{{#if_equals settings.duration "2-days"}}
						Emails Sent <small>Last 2 Days</small>
					{{/if_equals}}
					{{#if_equals settings.duration "this-week"}}
						Emails Sent <small>This Week</small>
					{{/if_equals}}
					{{#if_equals settings.duration "1-week"}}
						Emails Sent <small>Last 7 Days</small>
					{{/if_equals}}
					{{#if_equals settings.duration "this-month"}}
						Emails Sent <small>This Month</small>
					{{/if_equals}}
					{{#if_equals settings.duration "1-month"}}
						Emails Sent <small>Last 30 Days</small>
					{{/if_equals}}
                </span>
			</div>
		</div>
        <div class="portlet_body"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>
</script>
<script id="portlets-contacts-growth-graph-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="icon-remove {{remove_spaces name}}-close" style="cursor:pointer;" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span>
				<span>
                   Tag Graph
                </span>
			</div>
		</div>
        <div class="portlet_body">
			<div id="plan-limit-error-{{id}}" class="pull-left" style="width:100%;display:none"></div>
        </div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>
</script>
<script id="portlets-deals-pending-deals-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="icon-remove {{remove_spaces name}}-close" style="cursor:pointer;" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span>
				<span>
					{{#if_equals settings.deals "all-deals"}}
						All Pending Deals
					{{/if_equals}}
					{{#if_equals settings.deals "my-deals"}}
						My Pending Deals
					{{/if_equals}}
                </span>
			</div>
		</div>
        <div class="portlet_body"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>
</script>
<script id="portlets-deals-deals-by-milestone-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="icon-remove {{remove_spaces name}}-close" style="cursor:pointer;" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span>
				<span>
					{{#if_equals settings.deals "all-deals"}}
						All Deals by Milestone <font color="#b2b0b1">{{get_deals_funnel_portlet_header settings.track}}</font>
					{{/if_equals}}
					{{#if_equals settings.deals "my-deals"}}
						My Deals by Milestone <font color="#b2b0b1">{{get_deals_funnel_portlet_header settings.track}}</font>
					{{/if_equals}}
                </span>
			</div>
		</div>
        <div class="portlet_body"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>
</script>
<script id="portlets-deals-closures-per-person-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="icon-remove {{remove_spaces name}}-close" style="cursor:pointer;" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span>
				<span>
                   Closures per Person
                </span>
			</div>
		</div>
        <div class="portlet_body"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>
</script>
<script id="portlets-deals-deals-won-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="icon-remove {{remove_spaces name}}-close" style="cursor:pointer;" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span>
				<span>
					{{#if_equals settings.duration "1-day"}}
						Deals Won <small>Today</small>
					{{/if_equals}}
					{{#if_equals settings.duration "yesterday"}}
						Deals Won <small>Yesterday</small>
					{{/if_equals}}
					{{#if_equals settings.duration "this-week"}}
						Deals Won <small>This Week</small>
					{{/if_equals}}
					{{#if_equals settings.duration "1-week"}}
						Deals Won <small>Last 7 Days</small>
					{{/if_equals}}
					{{#if_equals settings.duration "this-month"}}
						Deals Won <small>This Month</small>
					{{/if_equals}}
					{{#if_equals settings.duration "1-month"}}
						Deals Won <small>Last 30 Days</small>
					{{/if_equals}}
					{{#if_equals settings.duration "3-months"}}
						Deals Won <small>Last 3 Months</small>
					{{/if_equals}}
					{{#if_equals settings.duration "6-months"}}
						Deals Won <small>Last 6 Months</small>
					{{/if_equals}}
					{{#if_equals settings.duration "12-months"}}
						Deals Won <small>Last 12 Months</small>
					{{/if_equals}}
                </span>
			</div>
		</div>
        <div class="portlet_body"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>	
</script>
<script id="portlets-deals-deals-funnel-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="icon-remove {{remove_spaces name}}-close" style="cursor:pointer;" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span>
				<span>
					{{#if_equals settings.deals "all-deals"}}
						All Deals Funnel <font color="#b2b0b1">{{get_deals_funnel_portlet_header settings.track}}</font>
					{{/if_equals}}
					{{#if_equals settings.deals "my-deals"}}
						My Deals Funnel <font color="#b2b0b1">{{get_deals_funnel_portlet_header settings.track}}</font>
					{{/if_equals}}
                </span>
			</div>
		</div>
        <div class="portlet_body"></div>

     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>	
</script>
<script id="portlets-deals-deals-assigned-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="icon-remove {{remove_spaces name}}-close" style="cursor:pointer;" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span>
				<span>
					{{#if_equals settings.duration "1-day"}}
						Deals Assigned <small>Today</small>
					{{/if_equals}}
					{{#if_equals settings.duration "yesterday"}}
						Deals Assigned <small>Yesterday</small>
					{{/if_equals}}
					{{#if_equals settings.duration "this-week"}}
						Deals Assigned <small>This Week</small>
					{{/if_equals}}
					{{#if_equals settings.duration "1-week"}}
						Deals Assigned <small>Last 7 Days</small>
					{{/if_equals}}
					{{#if_equals settings.duration "this-month"}}
						Deals Assigned <small>This Month</small>
					{{/if_equals}}
					{{#if_equals settings.duration "1-month"}}
						Deals Assigned <small>Last 30 Days</small>
					{{/if_equals}}
                </span>
			</div>
		</div>
        <div class="portlet_body"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>	
</script>
<script id="portlets-contacts-calls-per-person-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="icon-remove {{remove_spaces name}}-close" style="cursor:pointer;" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span>
				<span>
					{{#if_equals settings.duration "1-day"}}
						Calls <small>Today</small>
					{{/if_equals}}
					{{#if_equals settings.duration "yesterday"}}
						Calls <small>Yesterday</small>
					{{/if_equals}}
					{{#if_equals settings.duration "this-week"}}
						Calls <small>This Week</small>
					{{/if_equals}}
					{{#if_equals settings.duration "1-week"}}
						Calls <small>Last 7 Days</small>
					{{/if_equals}}
					{{#if_equals settings.duration "this-month"}}
						Calls <small>This Month</small>
					{{/if_equals}}
					{{#if_equals settings.duration "1-month"}}
						Calls <small>Last 30 Days</small>
					{{/if_equals}}
                </span>
			</div>
		</div>
        <div class="portlet_body"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>	
</script>
<script id="portlets-tasksandevents-agenda-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><i id="{{id}}-close" class="icon-remove {{remove_spaces name}}-close" style="cursor:pointer;" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span>
				<span>
                   Today's Events
                </span>
			</div>
		</div>
        <div class="portlet_body"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>
</script>
<script id="portlets-tasksandevents-today-tasks-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><i id="{{id}}-close" class="icon-remove {{remove_spaces name}}-close" style="cursor:pointer;" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span>
				<span>
                   Today's Tasks
                </span>
			</div>
		</div>
        <div class="portlet_body"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>	
</script>
<script id="portlets-useractivity-blog-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><i id="{{id}}-close" class="icon-remove {{remove_spaces name}}-close" style="cursor:pointer;" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span>
				<span>
                   Agile CRM Blog
                </span>
			</div>
		</div>
        <div class="portlet_body">
			<div id="portlet_blog_sync_container" style="padding:10px;"></div>
		</div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>	
</script>
<script id="portlets-tasksandevents-task-report-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="icon-remove {{remove_spaces name}}-close" style="cursor:pointer;" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span>
				<span>
					{{#if_equals settings.duration "1-day"}}
						Task Report <small>Today</small>
					{{/if_equals}}
					{{#if_equals settings.duration "yesterday"}}
						Task Report <small>Yesterday</small>
					{{/if_equals}}
					{{#if_equals settings.duration "this-week"}}
						Task Report <small>This Week</small>
					{{/if_equals}}
					{{#if_equals settings.duration "1-week"}}
						Task Report <small>Last 7 Days</small>
					{{/if_equals}}
					{{#if_equals settings.duration "this-month"}}
						Task Report <small>This Month</small>
					{{/if_equals}}
					{{#if_equals settings.duration "1-month"}}
						Task Report <small>Last 30 Days</small>
					{{/if_equals}}
                </span>
			</div>
		</div>
        <div class="portlet_body"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>	
</script>

<script id="portlets-collection-template" type="text/html">
<div class="slate" id="no-portlets" style="display:none">
    <div class="slate-content">
       <div class="box-left">
            <img alt="Clipboard" src="/img/clipboard.png" />
       </div>
       <div class="box-right">
            <h3>You do not have any dashlets currently.</h3>
            <div class="text">
               	Dashlets help you to view different modules data by grouping and manage your dashlets by adding them.  
            </div>
          		Get started by adding a dashlet.<br>
                <a id="add-portlet" class="add-portlet add-stream-tab btn" href="#">
 		          <i class="icon icon-plus-sign"></i> Add Dashlet
		        </a> 
	   </div>
    </div>
</div>
{{#unless this.length}}
  <div class="slate" id="zero-portlets">
    <div class="slate-content">
       <div class="box-left">
            <img alt="Clipboard" src="/img/clipboard.png" />
       </div>
       <div class="box-right">
            <h3>You do not have any dashlets currently.</h3>
            <div class="text">
               	Dashlets help you to view different modules data by grouping and manage your dashlets by adding them.  
            </div>
          		Get started by adding a dashlet.<br>
                <a id="add-portlet" class="add-portlet add-stream-tab btn" href="#">
 		          <i class="icon icon-plus-sign"></i> Add Dashlet
		        </a> 
	   </div>
    </div>
  </div>
{{/unless}}
<div class="gridster row-fluid" id="portlet-res">
     <!-- <div id="col-0" class="portlet-column span4" style="width:30.624%;"></div>
     <div id="col-1" class="portlet-column span4" style="width:30.624%;"></div>
     <div id="col-2" class="portlet-column span4" style="width:30.624%;"></div> -->
	<div style="position: relative;" class="gridster-portlets">
		<!-- <div style="display:none">&nbsp;</div> -->
	</div>
</div>
</script>

<script id="portlets-template" type="text/html">
<div class="line">
	<div class="row">
    	<div class="span12">
        	<div class="page-header">
				<div style="margin:0px auto;width:200px"><span style="background-color: rgb(249, 237, 190); border: 1px solid rgb(240, 195, 109); border-radius: 2px; display: inline-block; position: absolute; text-align: center; padding: 3px 16px; margin-top: -38px;z-index:999">Try Agile's <a href="newui-beta.jsp" target="_blank" style="color: #222222;text-decoration:underline">new look</a> (beta).</span></div>
            	<h1>Welcome to Agile CRM</h1>
				<a id="add-portlet" class="add-portlet add-stream-tab btn right" style="cursor:pointer;top:-30px;position: relative;">
					<i class="icon icon-plus-sign"></i> Add Dashlet
				</a>      
        	</div>
    	</div>
	</div>
	<div class="row">
		<div class="span12">
			<div class="line">
				<div id="portlets">&nbsp;</div>
			</div>
		</div>
	</div>
</div>
</script>

<script id="portlets-contact-filter-list-collection-template" type="text/html">
<select id="filter" name="filter" class="required">
	<option value="">Select...</option>
	<option value="contacts">All Contacts</option>
	<!-- <option value="companies">Companies</option> -->
	<option value="myContacts">My Contacts</option>
	<!-- <option value="leads">Leads</option> -->
	{{#if this.length}}
		{{#each this}}
			<option value="{{this.id}}">{{this.name}}</option>
		{{/each}}
	{{/if}}
</select>
</script>