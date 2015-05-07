<script id="portlets-add-model-template" type="text/html">
<div class="m-t">
	<div>
		<div class="pull-left m-r-sm m-b">
			<div id="portlets_main" class="network-type c-p text-md" style="color: #8a6086;" onclick="javascript:addNewPortlet('{{portlet_type}}','{{remove_spaces name}}');">
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
<div class="row">
	<div class="col-md-10 col-md-offset-1">
		<h4 class="portlet-head m-t-sm">Contacts</h4>
		<div id="contacts"></div><br/>
	</div>
</div>
<div class="row">
	<div class="col-md-10 col-md-offset-1">
		<h4 class="portlet-head">Deals</h4>
		<div id="deals"></div><br/>
    </div>
</div>
<div class="row">
	<div class="col-md-10 col-md-offset-1">
		<h4 class="portlet-head">Calendar</h4>
		<div id="taksAndEvents"></div><br/>
	</div>
</div>
<div class="row">
	<div class="col-md-10 col-md-offset-1">
		<h4 class="portlet-head">Activity</h4>
		<div id="userActivity"></div><br/>
	</div>
</div>
<div class="row">
	<div class="col-md-10 col-md-offset-1">
		<h4 class="portlet-head">RSS Feed</h4>
		<div id="rssFeed"></div><br/>
	</div>
</div>
</script><script id="portlets-contacts-model-template" type="text/html">
<td class="data v-middle" data="{{id}}" style="width:70px;" class="p-r-xs">
	<div class="table-resp">
		<div class="thumb-sm agile-img m-r-sm">
			<img class="img-inital r-2x" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}"/>
		</div>
	</div>
</td>
<td style="width:calc(65%-70px);" class="p-l-none">
	<div class="table-resp m-l-n-xs">
		{{#if_contact_type "PERSON"}}
        	<a class="text-cap custom-link">	{{getPropertyValue properties "first_name"}}
        	{{getPropertyValue properties "last_name"}} </a>
        	<div>
				<small class="text-muted m-t-xs">{{#if_propertyName "title"}}{{value}}, {{/if_propertyName}}{{getPropertyValue properties "company"}}</small>
			</div>
        {{/if_contact_type}}
		{{#if_contact_type "COMPANY"}}
			<a class="text-cap custom-link">{{getPropertyValue properties "name"}}</a>
		{{/if_contact_type}}
	</div>
</td>
<td style="width:35%">
	<div class="table-resp text-right p-b-xs">
		{{#each tags}}
    		<span class="label bg-light dk text-tiny">{{this}}</span>	
		{{/each}}
	</div>
</td>
</script>

<script id="portlets-contacts-collection-template" type="text/html">
{{#if this.length}}
	<div class="">
		<table id="contacts-portlets" class="table agile-table" style="overflow-x: hidden;overflow-y:auto;">
			<tbody id="portlets-contacts-model-list" class="portlets-contacts-model-list" style="word-break:normal!important;" route="contact/"></tbody>
		</table>
	</div>
{{else}}
	<div class="portlet-error-message">
		No Contacts Found
	</div>
{{/if}}
</script>

<script id="portlets-contacts-email-opens-model-template" type="text/html">
<td class="data" data="{{contact_id}}" style="width:50%">
	<div class="table-resp">
		<div class="thumb-xs agile-img">
			<img class="img-inital r-2x" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}"/>
		</div>
		<div class="agile-thumb-view agile-thumb-xs">
			{{#if_contact_type "PERSON"}}
        		<span class="text-base">	{{getPropertyValue properties "first_name"}}
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
<td class="text-muted" style="width:50%">
	<div class="table-resp text-right">
		<i class="fa fa-clock-o m-r-xs"></i>
		<time class="time-ago" datetime="{{epochToHumanDate "" openedTime}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" openedTime}}</time>
	</div>
</td>
</script>

<script id="portlets-contacts-email-opens-collection-template" type="text/html">
{{#if this.length}}
	<div style="border-bottom:1px solid #eee"></div>
	<table id="contacts" class="table agile-table" style="overflow-x: hidden;overflow-y:auto;">
		<tbody id="portlets-contacts-email-opens-model-list" class="portlets-contacts-emails-opened-model-list" style="word-break:normal!important;" route="contact/"></tbody>
	</table>
{{else}}
	<!-- <div class="portlet-error-message">
		No email activity
	</div> -->
{{/if}}
</script>

<script id="portlets-companies-model-template" type="text/html">
	<td class="data" data="{{id}}">
        <div class="p-r-xs h-auto inline">
        		<img class="portlet-roundimg img-inital thumb-xs" {{getCompanyImage "30" "display:inline;"}} />
    	</div>
    	<div class="h-auto inline-block v-top text-ellipsis w-half">
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
				<tbody id="portlets-companies-model-list" class="portlets-companies-model-list overflow-scroll"
					route="contact/">
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
<div id="dealsWonValue" class="dealsWonValue font-bold" style="display:none;"></div>
{{#if this.length}}
	<table class="table agile-table-ellipsis">
		<tbody id="portlets-opportunities-model-list" class="portlets-opportunities-model-list c-p" style="word-break:normal!important;"></tbody>
	</table>
{{else}}
	<div class="portlet-error-message">
      No deals pending
	</div>
{{/if}}
</script>

<script id="portlets-opportunities-model-template" type="text/html">
<td data="{{id}}" class="data">
	<div class="portlet-time-view no-inherit">
		<div class="pull-left" style="width: 70%;">
			<div class="w-full pull-left text-ellipsis text-cap custom-link">{{name}}</div> <!-- <span class="label" style="max-width: 10%;">{{milestone}}</span> -->
		</div>
		<div class="pull-right text-right font-bold m-b-xs text-ellipsis" style="width: 30%; white-space: nowrap;">
			<span>{{currencySymbol}}{{numberWithCommas expected_value}}</span>
		</div>
		<!-- <div class="clearfix"></div> -->
	</div>
	<div class="no-inherit">
		<div style="width: 30%;" class="pull-left">
			<div class="text-ellipsis text-muted">
				{{#if close_date}}
					<i class="fa fa-clock-o m-r-xs"></i>
					<time class="time-ago" datetime="{{epochToHumanDate "" close_date}}" >{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" close_date}}</time>
				{{else}}
					&nbsp;
				{{/if}}
			</div>
		</div>
		{{#if this.contacts}}
			<div class="activate-link text-right text-ellipsis" style="width: 70%;">
				{{#related_to_one contacts}}{{/related_to_one}}
			</div>
		{{/if}}
	</div>
</td>
</script>
<script id="portlets-tasks-collection-template" type="text/html">
{{#if this.length}}
<div class="">
	<table class="table agile-table-ellipsis">      
		<tbody id="portlets-tasks-model-list" class="c-p"></tbody>
	</table>
</div>
{{else}}
<div class="portlet-error-message">
	No tasks for today
</div>
{{/if}}
</script>
<script id="portlets-tasks-model-template" type="text/html">
	<td data="{{id}}" class="data" style="width:30px;border-left:3px solid {{#if_equals priority_type "NORMAL"}}#fad733{{else}}{{#if_equals priority_type "HIGH"}}#f05050{{else}}#edf1f2{{/if_equals}}{{/if_equals}}"><label class="i-checks i-checks-sm"><input type="checkbox" data='{{id}}' class='portlets-tasks-select' id="tasklist"><i></i></label></td>
	<td style="width:calc(100%-30px)">
		<div class="no-inherit">
  			<div class="pull-left text-ellipsis" style="width:70%;">
				<span>{{safe_string subject}}</span>
			</div>
  			<div class="m-b-xs pull-right text-right" style="width:30%;"> 
				<!-- {{#if_equals priority_type "NORMAL"}}
					<span class="m-l-xs label bg-info">{{ucfirst priority_type}}</span>
					{{else}}
						{{#if_equals priority_type "HIGH"}}
							<span class="m-l-xs label bg-danger">{{ucfirst priority_type}}</span>
						{{else}}
							<span class="m-l-xs label bg-green">{{ucfirst priority_type}}</span>
						{{/if_equals}} 
				{{/if_equals}} -->
				<span class="text-ellipsis label bg-light">{{task_property type}}</span>
			</div>
		</div>
        <div class="pull-left w-full">
  			{{#if this.contacts}}
				<div class="text-ellipsis">{{#related_to_one contacts}}{{/related_to_one}}</div>
			{{/if}}
		</div>
	</td>
</script>
<script id="portlets-events-collection-template" type="text/html">
{{#if this.length}}
<div class="">
	<table class="table no-sorting t-l-fix agile-table-ellipsis">
		<tbody id="portlets-events-model-list" style="cursor:pointer;"></tbody>
	</table>
</div>
{{else}}
	<div class="portlet-error-message">
		No calendar events for today
	</div>
{{/if}}
</script>
<script id="portlets-events-model-template" type="text/html">
<td data="{{id}}" class="data">
	<div class="portlet-time-view no-inherit">
		<div style="width: 73%;" class="pull-left m-b-xs">
			<span class="label p-l-xs p-r-xxs text-base pos-rlt m-r event-start-time font-bold bg-{{event_label_color color}}" datetime="{{get_AM_PM_format start}}">
				<i class="arrow right arrow-{{event_label_color color}}" style="right:-8px;"></i>
				{{get_AM_PM_format start}}
			</span>
			<a class="text-ellipsis" style="width:60%;">{{title}}</a>
		</div>
		<div class="text-right m-b-xs  text-ellipsis text-muted" style="width: 27%;">
		<i class="fa fa-clock-o m-r-xs"></i>	
		<time class="event-end-time" datetime="{{epochToHumanDate "HH:MM" end}}" >{{get_duration start end}}</time>
		</div>
		{{#if this.contacts}}
			<div class="w-full m-b-xxs text-ellipsis" style="padding-left:70px;">
				{{#related_to_one contacts}}{{/related_to_one}}
			</div>
		{{/if}}
	</div>
</td>
</script>

<script id="portlets-status-count-report-model-template" type="text/html">
<div class="row row-sm text-center">
	<div class="col-xs-6">
		<div class="panel padder-v item m-l-none c-p overflow-hidden">
			<div class="h1 text-info font-thin h1">{{numberWithCommasForActivities newContactsCount}}</div>
			<span class="text-muted text-xs">New contacts</span>
			<div class="top text-right w-full">
				<!-- <i class="fa fa-caret-down text-warning m-r-sm"></i> -->
			</div>
		</div>
	</div>     
	<div class="col-xs-6">
		<div class="block panel padder-v bg-primary item m-l-none p-t-none c-p stats-report-settings pos-rlt overflow-hidden">
			<div class="clearfix"></div>
			<span class="text-white font-thin h1 block p-t">{{currencySymbol}}{{numberWithCommasForActivities wonDealValue}}</span>
			<span class="text-muted text-xs">Won from {{numberWithCommasForActivities wonDealsCount}} deals</span>
			<span class="bottom text-right w-full">
				<!-- <i class="fa fa-cloud-upload text-muted m-r-sm"></i> -->
			</span>
		</div>
	</div>
	<div class="col-xs-6">
		<div class="block panel padder-v bg-info item m-l-none c-p overflow-hidden">
			<span class="text-white font-thin h1 block">{{numberWithCommasForActivities emailsSentCount}}</span>
			<span class="text-muted text-xs">Campaign emails sent</span>
			<span class="top text-left">
				<!-- <i class="fa fa-caret-up text-warning m-l-sm m-l-none"></i> -->
			</span>
		</div>
	</div>
	<div class="col-xs-6">
		<div class="panel padder-v item m-l-none c-p overflow-hidden">
			<div class="font-thin h1">{{numberWithCommasForActivities newDealsCount}}</div>
			<span class="text-muted text-xs">New deals worth {{currencySymbol}}{{numberWithCommasForActivities newDealValue}}</span>
			<div class="bottom text-left">
				<!-- <i class="fa fa-caret-up text-warning m-l-sm"></i> -->
			</div>
		</div>
	</div>
</div>
</script>

<script id="portlets-contacts-filterbased-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons panel-heading" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="c-p icon-close {{remove_spaces name}}-close" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <!-- <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span> -->
				<span class="inline-block">
					<h4 class="font-thin m-t-none text-muted h4">
						{{get_flitered_contact_portlet_header settings.filter}}
					</h4>
                </span>
			</div>
		</div>
        <div class="portlet_body panel-body p-n  b-n"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>	
</script>

<script id="portlets-contacts-emails-opened-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons panel-heading b-b-none" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="c-p icon-close {{remove_spaces name}}-close" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <!-- <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span> -->
				<span class="inline-block"><h4 class="font-thin m-t-none text-muted h4">
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
					{{/if_equals}}</h4>
                </span>
			</div>
		</div>
        <div class="portlet_body panel-body p-n  b-n">
			<div id="emails-opened-pie-chart" class="emails-opened-pie-chart" style="height:155px;"></div>
			<div id="emails-opened-contacts-list" class="emails-opened-contacts-list"></div>
		</div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>
</script>
<script id="portlets-contacts-emails-sent-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons panel-heading" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="c-p icon-close {{remove_spaces name}}-close" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <!-- <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span> -->
				<span class="inline-block"><h4 class="font-thin m-t-none text-muted h4">
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
					{{/if_equals}}</h4>
                </span>
			</div>
		</div>
        <div class="portlet_body panel-body p-n  b-n"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>
</script>
<script id="portlets-contacts-growth-graph-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons panel-heading b-b-none" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="c-p icon-close {{remove_spaces name}}-close" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <!-- <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span> -->
				<span class="inline-block"><h4 class="font-thin m-t-none text-muted h4">
                   Tag Graph</h4>
                </span>
			</div>
		</div>
        <div class="portlet_body panel-body p-n b-n">
			<div id="plan-limit-error-{{id}}" class="pull-left w-full" style="display:none"></div>
        </div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>
</script>
<script id="portlets-deals-pending-deals-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons panel-heading" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="icon-close {{remove_spaces name}}-close" style="cursor:pointer;" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <!-- <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span> -->
				<span class="inline-block"><h4 class="font-thin m-t-none text-muted h4">
					{{#if_equals settings.deals "all-deals"}}
						All Pending Deals
					{{/if_equals}}
					{{#if_equals settings.deals "my-deals"}}
						My Pending Deals
					{{/if_equals}}</h4>
                </span>
			</div>
		</div>
        <div class="portlet_body panel-body p-n b-n"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>
</script>
<script id="portlets-deals-deals-by-milestone-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons panel-heading b-b-none" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="c-p icon-close {{remove_spaces name}}-close" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <!-- <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span> -->
				<span class="inline-block"><h4 class="font-thin m-t-none text-muted h4">
					{{#if_equals settings.deals "all-deals"}}
						All Deals by Milestone <small>{{get_deals_funnel_portlet_header settings.track}}</small>
					{{/if_equals}}
					{{#if_equals settings.deals "my-deals"}}
						My Deals by Milestone <small>{{get_deals_funnel_portlet_header settings.track}}</small>
					{{/if_equals}}</h4>
                </span>
			</div>
		</div>
        <div class="portlet_body panel-body p-n b-n deals-by-milestone-portlet-body"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>
</script>
<script id="portlets-deals-closures-per-person-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons panel-heading" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="c-p icon-close {{remove_spaces name}}-close" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <!-- <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span> -->
				<span class="inline-block"><h4 class="font-thin m-t-none text-muted h4">
                   Closures per Person</h4>
                </span>
			</div>
		</div>
        <div class="portlet_body panel-body p-n b-n"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>
</script>
<script id="portlets-deals-deals-won-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons panel-heading" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="c-p icon-close {{remove_spaces name}}-close" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <!-- <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span> -->
				<span class="inline-block"><h4 class="font-thin m-t-none text-muted h4">
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
					{{/if_equals}}</h4>
                </span>
			</div>
		</div>
        <div class="portlet_body panel-body p-n b-n"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>	
</script>
<script id="portlets-deals-deals-funnel-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons panel-heading b-b-none" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="c-p icon-close {{remove_spaces name}}-close" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <!-- <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span> -->
				<span class="inline-block"><h4 class="font-thin m-t-none text-muted h4">
					{{#if_equals settings.deals "all-deals"}}
						All Deals Funnel <small>{{get_deals_funnel_portlet_header settings.track}}</small>
					{{/if_equals}}
					{{#if_equals settings.deals "my-deals"}}
						My Deals Funnel <small>{{get_deals_funnel_portlet_header settings.track}}</small>
					{{/if_equals}}</h4>
                </span>
			</div>
		</div>
        <div class="portlet_body panel-body p-n b-n"></div>

     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>	
</script>
<script id="portlets-deals-deals-assigned-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons panel-heading" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="c-p icon-close {{remove_spaces name}}-close" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <!-- <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span> -->
				<span class="inline-block"><h4 class="font-thin m-t-none text-muted h4">
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
					{{/if_equals}}</h4>
                </span>
			</div>
		</div>
        <div class="portlet_body panel-body p-n b-n"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>	
</script>
<script id="portlets-contacts-calls-per-person-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons panel-heading b-b-none" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="c-p icon-close {{remove_spaces name}}-close" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <!-- <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span> -->
				<span class="inline-block"><h4 class="font-thin m-t-none text-muted h4">
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
					{{/if_equals}}</h4>
                </span>
			</div>
		</div>
        <div class="portlet_body panel-body p-n b-n"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>	
</script>
<script id="portlets-tasksandevents-agenda-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons panel-heading" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><i id="{{id}}-close" class="c-p icon-close {{remove_spaces name}}-close" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <!-- <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span> -->
				<span class="inline-block"><h4 class="font-thin m-t-none text-muted h4">
                   Today's Events</h4>
                </span>
			</div>
		</div>
        <div class="portlet_body panel-body p-n b-n"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>
</script>
<script id="portlets-tasksandevents-today-tasks-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons panel-heading" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><i id="{{id}}-close" class="c-p icon-close {{remove_spaces name}}-close" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <!-- <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span> -->
				<span class="inline-block"><h4 class="font-thin m-t-none text-muted h4">
                   Today's Tasks</h4>
                </span>
			</div>
		</div>
        <div class="portlet_body panel-body p-n b-n"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>	
</script>
<script id="portlets-useractivity-blog-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons panel-heading" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><i id="{{id}}-close" class="c-p icon-close {{remove_spaces name}}-close" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <!-- <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span> -->
				<span class="inline-block"><h4 class="font-thin m-t-none text-muted h4">
                   Agile CRM Blog</h4>
                </span>
			</div>
		</div>
        <div class="portlet_body panel-body p-n b-n">
			<div id="portlet_blog_sync_container" class="p-sm"></div>
		</div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>	
</script>
<script id="portlets-tasksandevents-task-report-model-template" type="text/html">
		<div class="portlet_header portlet_edit_icons panel-heading b-b-none" onmouseover="showPortletIcons(this); return false;" onmouseout="hidePortletIcons(this); return false;">
			<div class="portlet_header_icons pull-right clear-fix" style="display:none;">
				<ul class="portlet_header_control">
					<!-- {{#if is_minimized}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-maximize icon-plus"></i></a></li>
					{{else}}
						<li><a href="#"><i id="{{id}}-collapse" class="portlet-minimize icon-minus"></i></a></li>
					{{/if}} -->
                    <li><a href="#" id="{{id}}-settings" class="portlet-settings icon-wrench" data-toggle="modal"></a></li>
                    <li><i id="{{id}}-close" class="icon-close {{remove_spaces name}}-close" style="cursor:pointer;" onclick="deletePortlet(this);"></i></li>
				</ul>
			</div>
			<div class="portlet_header_name">
                <!-- <i class="{{get_portlet_icon name}} icon-1x"></i>
                <span class="portlet-icon-divider"></span> -->
				<span class="inline-block"><h4 class="font-thin m-t-none text-muted h4">
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
					{{/if_equals}}</h4>
                </span>
			</div>
		</div>
        <div class="portlet_body"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>	
</script>

<script id="portlets-status-report-model-template" type="text/html">	
     <div class="stats_report_portlet_body panel-body p-n b-n" style="cursor:move"></div>
     <div class="portlets" id="{{id}}">&nbsp;</div>
     <div class="column_position" style="display:none">{{column_position}}</div>
     <div class="row_position" style="display:none">{{row_position}}</div>	
</script>

<script id="portlets-collection-template" type="text/html">
<div class="alert-info alert" id="no-portlets" style="display:none">
    <div class="slate-content">
       <div class="box-left pull-left m-r-md">
            <img alt="Clipboard" src="/img/clipboard.png" />
       </div>
       <div class="box-right pull-left">
            <h4 class="m-t-none">You do not have any dashlets currently.</h4>
            <div class="text">
               	Dashlets help you to view different modules data by grouping and manage your dashlets by adding them.  
            </div>
          		Get started by adding a dashlet.<br>
                <a id="add-portlet" class="add-portlet add-stream-tab btn btn-default btn-sm m-t-xs">
 		          <i class="icon icon-plus-sign"></i> Add Dashlet
		        </a> 
	   </div>
	   <div class="clearfix">
	   </div>
    </div>
</div>
{{#unless this.length}}
  <div class="alert-info alert" id="zero-portlets">
    <div class="slate-content">
       <div class="box-left pull-left m-r-md">
            <img alt="Clipboard" src="/img/clipboard.png" />
       </div>
       <div class="box-right pull-left">
            <h4 class="m-t-none">You do not have any dashlets currently.</h4>
            <div class="text">
               	Dashlets help you to view different modules data by grouping and manage your dashlets by adding them.  
            </div>
          		Get started by adding a dashlet.<br>
                <a id="add-portlet" class="add-portlet add-stream-tab btn btn-default btn-sm m-t-xs">
 		          <i class="icon icon-plus-sign"></i> Add Dashlet
		        </a> 
	   </div>
	   <div class="clearfix">
	   </div>
    </div>
  </div>
{{/unless}}
<div class="gridster" id="portlet-res">
     <!-- <div id="col-0" class="portlet-column col-md-4" style="width:30.624%;"></div>
     <div id="col-1" class="portlet-column col-md-4" style="width:30.624%;"></div>
     <div id="col-2" class="portlet-column col-md-4" style="width:30.624%;"></div> -->
    
	<div class="gridster-portlets pos-rlt">
		<!-- <div style="display:none">&nbsp;</div> -->
	</div>
    
</div>
</script>

<script id="portlets-template" type="text/html">
<div class="custom-animated custom-fadeInUp">
	<div class="wrapper-md bg-light lter b-b">
	<div class="row">
    	<div class="col-md-12">
			<div class="pull-left">
				<h1 class="m-n font-thin h3 text-black">Dashboard</h1>
				<small class="text-muted">Welcome to Agile CRM</small>
			</div>
			<div class="pull-right">
				<a id="add-portlet" class="btn btn-default btn-sm btn-addon add-portlet add-stream-tab right pos-rlt">
					<i class="icon icon-plus-sign"></i> Add Dashlet
				</a> 
			</div>
			<div class="clearfix"></div>      	
    	</div>
	</div>
	</div>
	<div class="wrapper-md">
	<div class="row">
		<div class="col-md-12">
			<div>
				<div id="portlets">&nbsp;</div>
			</div>
		</div>
	</div>
	</div>
</div>
</div>
</script>

<script id="portlets-contact-filter-list-collection-template" type="text/html">
<select id="filter" name="filter" class="required form-control">
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