<script id="automation-add-template" type="text/html">
<div class="row">
    <div class="col-md-12">
        <div class="col-md-8">
            <div class="well">
                <form id="addAutomationForm" name="addAutomationForm" class="form-horizontal">
                   {{#if id}}
                        <legend>Edit Automation</legend>
                        <input name="id" type="hidden" value="{{id}}" />
                    {{else}}
                        <legend><i class="icon-plus-sign"></i> Add Automation</legend>
                    {{/if}} 
                   <fieldset>
                        <div class="control-group">
                            <label class="control-label w">Name <span class="field_req">*</span></label>
                            <div class="controls" style="margin-left:220px!important;">
                                <input type="text" id="name" class="required form-control" name="name" />
                            </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label w">Select Filter type <span class="field_req">*</span></label>
                                <div class="controls" style="margin-left:220px!important;">
                                    <select id="filter-select" name="contactFilter_id" class="required form-control"> 
                                    <option value="">Select...</option>
                                    </select>
                                </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label w">Run this Campaign on the Contacts<span class="field_req">*</span></label>
                            <div class="controls" style="margin-left:220px!important;">
                                <select id="campaign-select" name="campaign_id" class="required form-control">
                                    <option value="">Select...</option>
                                </select>
                            </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label w">Select period <span class="field_req">*</span></label>
                                  <div class="controls" style="margin-left:220px!important;">
                                    <select id="period-type" name="durationType" class="required form-control">
				        				<option value="">Select...</option>
                                        <option value="DAILY">Daily</option>
                                        <option value="WEEKLY">Weekly</option>
                                        <option value="MONTHLY">Monthly</option>
                                    </select>
                                </div>
                        </div>
                        <div class="form-actions">          							 
                            <a href="#automations" id="automation-save" class="save btn btn-sm btn-primary">Save</a>
							<a href="#automations" id="automation-cancel" class="btn btn-default btn-sm">Cancel</a>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    </div>
</div>
</script>
<script id="automations-model-template" type="text/html">
	<td class="data" data="{{id}}">{{name}}</td>
    <td>{{titleFromEnums durationType}}</td>
    <td>{{contactFilter}}</td>
	<td>{{campaign}}</td>
	<br />
</script>
<script id="automations-collection-template" type="text/html">
<div class="wrapper-md lter bg-light b-b">
<div class="row">
    <div class="col-md-12">
        
            <h3 class="font-thin h3">List of Automations</h3>
            <a href="#automation-add" class="btn btn-sm btn-default right m-t-n-lg pos-rlt" id="addAutomation">
				<i class="icon-plus-sign"></i> Add Automation
			</a>
        
    </div>
</div>
</div>
<div class="row">
    <div class="col-md-9">
        {{#unless this.length}}
        <div class="alert-info alert">
            <div class="slate-content">
                <div class="box-left pull-left m-r-md">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right pull-left">
                    <h4 class="m-t-none">You do not have any Automations currently.</h4>
                    <div class="text">
                        You can define a automations to start execution of a campaign. But please make sure to create atleast one campaign before creating automation.
                    </div>
                    <a href="#automation-add" class="btn btn-default btn-sm blue btn-slate-action m-t-xs">
						<i class="icon-plus-sign"></i>  Add Automation 
					</a>
                </div>
				<div class="clearfix">
				</div>
            </div>
        </div>
        {{/unless}}
        {{#if this.length}}
        <div class="data-block">
            <div class="data-container">
                <table class="table table-striped showCheckboxes" url="core/api/automations/bulk">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Period</th>
                            <th>Contact Filter</th>
                            <th>Campaign</th>
                        </tr>
                    </thead>
                    <tbody id="automations-model-list" route="automation/"> </tbody>
                </table>
            </div>
        </div>
        {{/if}}
    </div>
    <div class="col-md-3">
        <div class="well">
            <h3>
                What are Automations?
            </h3>
            <br />
            <p>
                Automations are pre-defined conditions set up by you. If the condition is satisfied, you can choose an action to follow using workflow automation.
            </p>
            <p>
                e.g. If a user registers on your website, you can automate the workflow to send a welcome email. The user registering on site is the trigger.
            </p>
        </div>
    </div>
</div>
</script><script id="campaign-analysis-template" type="text/html">
<div class="wrapper-md lter bg-light b-b">
<div class="row">
    <div class="col-md-12">
        
            <h3 class="pull-left font-thin h3">Campaign <small>analysis</small></h3>
            <div class="right">
        		<select id="campaign-reports-select" class="required form-control">
        			<option value="">Select...</option>
        		</select>
			</div>
            <div class="clearfix"></div>
       
    </div>
</div>
</div>
<div id="campaign-analysis-tabs"></div>
</script>

<script id="campaign-analysis-tabs-template" type="text/html">

	<div class="hbox hbox-auto-xs hbox-auto-sm bg-light">	
		<div class="col w b-r">
   		<div class="vbox">
     	<div class="row-row">
		<div id="campaign-tabs" class="list-group list-group-lg no-radius no-border no-bg m-b-none">
			<a href="#email-reports/{{id}}" class="campaign-stats-tab list-group-item select" data-campaign-tab-active="STATS">Reports</a>
			<a href="#workflow/all-subscribers/{{id}}" class="campaign-subscribers-tab list-group-item" data-campaign-tab-active="SUBSCRIBERS">Subscribers</a>
			<a href="#workflows/logs/{{id}}" class="campaign-logs-tab list-group-item" data-campaign-tab-active="LOGS">Logs</a>
		</div>
		</div>
		</div>
		</div>
		<div class="col overflow-visible">
			<div class="tabs wrapper-md" id="campaign-analysis-tabs-content"></div>
		</div>
	</div>

</script><script id="campaign-email-reports-template" type="text/html">
<div id="campaign-email-report">
<div id="reportrange" class="pull-right m-r-xs p-t-xs p-b-xs p-l-sm p-r-sm m-b" style="box-shadow: 0 0px 2px rgba(0, 0, 0, .25), inset 0 -1px 0 rgba(0, 0, 0, .1);">
     <i class="icon-calendar icon-large"></i>
     <span id="range">{{date-range "today" "-6"}}</span>
</div>
<div class="clearfix"></div>
<div class="row">
<div class="col-md-12">		
	<!-- Email Reports -->
	<div id="email-reports">
		<div class="row">
			<div class="col-md-12">
			<div class="panel panel-default">
				<div class="panel-heading">Email Reports</div>
			<div class="panel-body">	
			<div id="email-table-reports" class="p-t-xxl m-l-lg"></div>
			</div>
			</div>
			</div>
		</div>
		
		
		<div class="row">
		<div class="col-md-12">
		<div class="panel panel-default">
			<div class="panel-heading">Daily</div>
			<div class="panel-body">
				<div id="line-daily-chart" class="p-t-xxl m-l-lg" style="height:300px;"></div>
			</div>
		</div>
		</div>
		</div>
		
		<div class="row">
		<div class="col-md-12">
		<div class="panel panel-default">
			<div class="panel-heading">Hourly</div>
			<div class="panel-body">
				<div id="line-hourly-chart" class="p-t-xxl m-l-lg" style="height:300px;"></div>
			</div>
		</div>
		</div>
		</div>
		
		<div class="row">
		<div class="col-md-12">
		<div class="panel panel-default">
				<div class="panel-heading">Weekly<small>(From <span id="week-range">{{date-range "today" "-6"}}</span>)</span></small></div>
			<div class="panel-body">
			<div id="line-weekly-chart" class="p-t-xxl m-l-lg" style="height:300px;"></div>
			</div>
		</div>
		</div>
		</div>
		
		
	</div>
	<!-- End of Email Reports -->  
	</div>
   </div>
</div>
</div>
</script><script id="campaign-email-table-reports-template" type="text/html">
<div>  
	<table class="table table-bordered">
		<tbody>
			<tr>
				<th>Emails Sent</th>
				<th>Emails Opened<span
							style="vertical-align: text-top; margin-left: -3px"> <img
							border="0" src="/img/help.png"
							style="height: 6px; vertical-align: top" rel="popover"
							data-placement="right"
							data-title:" data-content="Total email opens recorded & unique opens."
							id="element" data-trigger="hover" />
						</span></th>
				<th>Clicks<span
							style="vertical-align: text-top; margin-left: -3px"> <img
							border="0" src="/img/help.png"
							style="height: 6px; vertical-align: top" rel="popover"
							data-placement="right"
							data-title:" data-content="Total email link clicks recorded & unique clicks"
							id="element" data-trigger="hover" /></th>
				<th>Unsubscriptions</th>
				<th>Hard Bounces 
					<span class="v-top m-l-n-xs">
						<img border="0" src="/img/help.png"	class="v-top" style="height: 6px;" rel="popover"
							data-placement="right" data-title:" data-content="A hard bounce occurs when the recipient's email is invalid."
							id="element" data-trigger="hover" />
					</span>
				</th>
				<th>Soft Bounces 
					<span class="v-top m-l-n-xs"> 
						<img border="0" src="/img/help.png" class="v-top" style="height: 6px;" rel="popover"
							data-placement="right" data-title:" data-content="A soft bounce occurs when the sender's email box is full or for other reasons."
							id="element" data-trigger="hover" />
					</span>
				</th>
				<th>Spam Complaints</th>
			</tr>
            <tr>
				<td>{{#if sent}}{{sent}}{{else}} - {{/if}}</td>
				<td>{{#if opened}}{{opened}} ({{unique_opened}}) {{else}} - {{/if}}</td>
				<td>{{#if clicks}} {{clicks}} ({{unique_clicks}}) {{else}} - {{/if}}</td>
				<td>{{#if unsubscribed}}{{unsubscribed}} {{else}} - {{/if}}</td>
				<td>{{#if hard_bounce}}{{hard_bounce}} {{else}} - {{/if}}</td>
				<td>{{#if soft_bounce}}{{soft_bounce}} {{else}} - {{/if}}</td>
                <td>{{#if spam}}{{spam}} {{else}} - {{/if}}</td>
			</tr>
		</tbody>
	</table>
</div>
</script>
<script id="campaign-logs-collection-template" type="text/html">
<div class="row">
    <div class="col-md-12">
        
            <h4 class="pull-left font-thin">Logs 
				<!--<small>for <span id="logs-campaign-name"></span></small>-->
			</h4>
            <div class="pull-right">
            <div class="inline-block p-r-xs">
				<div class="btn-group">
  				<button class="btn btn-sm btn-default"><span id="log-filter-title">All</span></button>
  				<button class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown">
    				<span class="caret"></span>
  				</button>
  				<ul class="dropdown-menu">
                    <li><a href="#" data-log-type="ALL" data-campaign-id="{{get_id_from_hash}}" class="log-filters">All</a></li> 
    				<li><a href="#" data-log-type="EMAIL_SENT" data-campaign-id="{{get_id_from_hash}}" class="log-filters">Sent</a></li>
					<li><a href="#" data-log-type="EMAIL_OPENED" data-campaign-id="{{get_id_from_hash}}" class="log-filters">Opened</a></li>
					<li><a href="#" data-log-type="EMAIL_CLICKED" data-campaign-id="{{get_id_from_hash}}" class="log-filters">Clicked</a></li>
					<li><a href="#" data-log-type="UNSUBSCRIBED" data-campaign-id="{{get_id_from_hash}}" class="log-filters">Unsubscribed</a></li>
                    <li><a href="#" data-log-type="EMAIL_HARD_BOUNCED" data-campaign-id="{{get_id_from_hash}}" class="log-filters">Hard Bounced</a></li>
					<li><a href="#" data-log-type="EMAIL_SOFT_BOUNCED" data-campaign-id="{{get_id_from_hash}}" class="log-filters">Soft Bounced</a></li>
                    <li><a href="#" data-log-type="EMAIL_SPAM" data-campaign-id="{{get_id_from_hash}}" class="log-filters">Spam Reported</a></li>
  				</ul>
			</div>
			</div>
            <a href="#" class="btn btn-sm btn-danger inline-block" id="delete_campaign_logs">Delete All Logs</a>
			</div>
        <div class="clearfix"></div>
       
    </div>
</div>

<div class="row">
	<div class="col-md-12">
    {{#unless this.length}}
	<div id="logs-slate"></div>
    {{/unless}}

    {{#if this.length}}
    <div class="data">
        <div class="data-container">
        <div class="table-responsive">
            <table class="table table-striped onlySorting panel" id="logs-table" url="core/api/campaigns/logs/bulk">
                <thead>
                    <tr>
                        <th></th>
                        <th style="width:35%" class="header">Contact</th>
                        <th style="width:20%" class="header">Log Type</th>
                        <th style="width:25%" class="header">Message</th>
                        <th style="width:20%" class="header">Time</th>                    
                    </tr>
                </thead>
                <tbody id="campaign-logs-model-list" route="contact/">
                </tbody>
            </table>
        </div>
        </div>
    </div>
    {{/if}}
</div>
</div>
</script>
<script id="campaign-logs-model-template" type="text/html">
{{#if contact}}
<input name="id" class="campaign" type="hidden" value="{{campaign_id}}" />
<td></td>
<td class="data no-wrap" data={{subscriber_id}}>
	<div>
	<span class="thumb">
    	<img class="img-inital r r-2x" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl contact.properties 40}}" width="40px" height="40px"/>
    </span>
 	<span class="inline-block">
		<span class="text-info">{{contact_name contact.properties contact.type}}</span>
        <br>
        	{{getPropertyValue contact.properties "email"}}
    </span>
	</div>
</td>
<td>{{titleFromEnums log_type}}</td>
<td class="ellipsis-multi-line" id="autoellipsis" ">{{#if_email_sent this "log_type"}} Subject: {{Subject}} {{else}} {{{message}}} {{/if_email_sent}}</td>
<td class="text-muted"><small class="edit-hover"> 
		<i class="fa fa-clock-o m-r-xs"></i>
		<time class="log-created-time b-b-dotted" datetime="{{epochToHumanDate "" time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" time}}</time>
	</small></td>
<br/>
{{/if}}
</script><script id="campaign-stats-chart-template" type="text/html">
<div class="custom-animated custom-fadeInUp">
<div class="wrapper-md lter bg-light b-b">
<div class="row">
<div class="col-sm-12 col-md-12">
    <h3 class="pull-left font-thin h3">Campaigns Comparison</h3>
	<div class="clearfix"></div>
</div>
</div>
</div>
<div class="wrapper-md panel">
	<div class="row">
   	 <div class="col-md-12">     
       <div id="campaign-stats-chart" style="height:300px" class="w-full"></div>
  	 </div>
	</div>
</div>
</div>
</script><script id="trigger-add-template" type="text/html">
<div class="wrapper-md bg-light lter b-b">

  {{#if id}}
                       <h3 class="h3 font-thin">Edit Trigger</h3>
                    {{else}}
                        <h3 class="h3 font-thin"><i class="icon-plus-sign"></i> Add Trigger</h3>
                    {{/if}} 
</div>
<div class="wrapper-md">
<div class="row">
    
        <div class="col-md-9">
            <div class="panel wrapper">
                <form id="addTriggerForm" name="addTriggerForm" class="form-horizontal">
                    {{#if id}}
					   <input name="id" type="hidden" value="{{id}}" />
					{{/if}}
                    <fieldset>
                        <div class="control-group form-group">
                            <label class="control-label col-sm-4">Name 
								<span class="field_req">*</span>
							</label>
                            <div class="controls col-sm-8">
                                <input type="text" id="name" class="required form-control w-md" name="name" />
                            </div>
                        </div>
                        <div class="control-group form-group">
                            <label class="control-label col-sm-4">When this happens <span class="field_req">*</span></label>
                            <div id="LHS" name="LHS" class="col-sm-8">
                                  <div class="controls">
                                    <select id="trigger-type" name="type" class="required form-control w-md">		
 										<option></option>
                                        <optgroup label="Tag">
										<option value="TAG_IS_ADDED">Tag is added</option>
                                        <option value="TAG_IS_DELETED">Tag is deleted</option>
										<optgroup label="Contact">
                                        <option value="CONTACT_IS_ADDED">Contact is added</option>
                                        <option value="ADD_SCORE" id="add-score">Contact Score (>=)</option>
                                        <optgroup label="Deal">
                                        <option value="DEAL_IS_ADDED">Deal is added</option>
                                        <option value="DEAL_IS_DELETED">Deal is deleted</option>
                                        <option value="DEAL_MILESTONE_IS_CHANGED">Deal milestone is changed</option>
										<optgroup label="Timer">
										<option value="RUNS_DAILY">Daily</option>
                                        <option value="RUNS_WEEKLY">Weekly</option>
                                        <option value="RUNS_MONTHLY">Monthly</option>
										<optgroup label="Payments">
										<option value="STRIPE_CHARGE_EVENT" id="stripe-charge-event">Stripe Event</option>
										<optgroup label="Email Bounces">
										<option value="SOFT_BOUNCE">Soft Bounce</option>
										<option value="HARD_BOUNCE">Hard Bounce</option>
										<optgroup label="Email Event">
										<option value="INBOUND_MAIL_EVENT" id="inbound-mail-event">New Email</option>
										<option value="EMAIL_OPENED">Email Opened</option>
										<option value="EMAIL_LINK_CLICKED">Email Link Clicked</option>
										<option value="UNSUBSCRIBED">Unsubscribed</option>
										<optgroup label="Calendar">
										<option value="EVENT_IS_ADDED">Event is added</option>
										<optgroup label="Call">
										<option value="INBOUND_CALL">Inbound Call</option>
										<option value="OUTBOUND_CALL">Outbound Call</option>
										<optgroup label="Ecommerce">
										<option value="SHOPIFY_EVENT" id="shopify-event">Shopify Event</option>
										<optgroup label="Form">
										<option value="FORM_SUBMIT" id="form-event">Form Submit</option>
									</select>
                                </div>
                            </div>
                        </div>
						
						<div class="control-group form-group" style="display:none;">
							<div class="controls col-sm-offset-4 col-sm-8">
                            <select id="contact-filter" name="contact_filter_id" class="required form-control w-md">
                                    <option value="">Select...</option>
                                </select>
							</div>
                        </div>
							
                        <div class="control-group form-group" style="display:none;">
                            <div id="RHS" name="RHS">
                                <label class="control-label TAG_IS_ADDED TAG_IS_DELETED ADD_SCORE EMAIL_OPENED col-sm-4"></label>
                                <div class="controls col-sm-8">
                                    <input type="text" value="{{custom_tags}}" id="trigger-custom-tags" name="custom_tags" class="required trigger-tags TAG_IS_ADDED TAG_IS_DELETED form-control m-b-n-xxs w-md" placeholder="Enter tag" style ="width:100%!imp" />
                                    <input type="text" placeholder="Enter Score" {{#if custom_score}} value="{{this.custom_score}}" {{/if}} id="trigger-custom-score" name="custom_score" class="ADD_SCORE required custom-value digits form-control w-md" />
                                </div>
                            </div>
                        </div>
						
						<!--Call Inbound and Outbound -->
						<div class="control-group form-group" style="display: none;">
							<div id="CALL">
								<label class="control-label INBOUND_CALL OUTBOUND_CALL"></label>
								<div class="controls col-sm-offset-4 col-sm-8">	
									<select name="call_disposition" class="required form-control w-md">
										<option value="" class="INBOUND_CALL OUTBOUND_CALL">Select call status</option>
										<option value="ALL" class="INBOUND_CALL OUTBOUND_CALL">All</option>			
										<option value="answered" class="INBOUND_CALL OUTBOUND_CALL">Answered</option>
										<!--<option value="no-answer" class="INBOUND_CALL OUTBOUND_CALL">No Answer</option>-->
										<option value="busy" class="INBOUND_CALL OUTBOUND_CALL">Busy</option>
										<option value="failed" class="OUTBOUND_CALL">Failed</option>
										<option value="voicemail" class="OUTBOUND_CALL">Voicemail</option>
									</select>
								</div>
							</div>
						</div>
                        
						<div class="control-group form-group" style="display:none;">
							<div class="controls col-sm-offset-4 col-sm-8">
                            <select id="trigger-deal-milestone" name="trigger_deal_milestone" class="required form-control w-md">
                                    <option value="">Select...</option>
                                </select>
							</div>
                        </div>
						<!-- Calendar Event -->
						 <div class="control-group form-group" style="display:none;">
							<div class="controls col-sm-offset-4 col-sm-8">
                            <select id="event-type" name="event_type" class="required form-control w-md">
									<option value="">Select Event Type</option>
                                    <option value="ANY">Any Event</option>
									<option value="WEB_APPOINTMENT">Online Appointment</option>
                                </select>
							</div>
                        </div>
						 <div class="control-group form-group" style="display:none;">
							<div class="controls col-sm-offset-4 col-sm-8">
                            <select id="event-owner-id" name="event_owner_id" class="required form-control w-md">
                                    <option value="">Select...</option>
                                </select>
							</div>
                        </div>
						<div class="control-group form-group" style="display:none;">
							<div class="controls col-sm-offset-4 col-sm-8">
							<select id="trigger-stripe-event" name="trigger_stripe_event" class="required form-control w-md">
									<option value="">Select Stripe Event</option>
									<option value="CHARGE_SUCCEEDED" id="charge-succeeded">Charge succeeded</option>
									<option value="CHARGE_FAILED" id="charge-failed">Charge failed</option>
									<option value="CHARGE_REFUNDED" id="charge-refunded">Charge refunded</option>
									<option value="CHARGE_CAPTURED" id="charge-captured">Charge captured</option>
									<option value="CHARGE_UPDATED" id="charge-updated">Charge updated</option>
									<option value="CUSTOMER_DELETED" id="customer-deleted">Customer deleted</option>
							</select>
							<div class="m-t-xs">
							<small>You need to <a href="https://stripe.com/docs/webhooks#configuring-your-webhook-settings" target="_blank" class="text-info">setup webhooks</a> in your stripe account for this</small>
							</div>
							</div>
						</div>
                        <!--Email Clicked and Opened-->
						<div class="control-group form-group" style="display:none;">
							<div class="controls col-sm-offset-4 col-sm-8">
									<select id="email-tracking-type" name="email_tracking_type" class="required form-control w-md">
										<option value="ANY">Personal or Campaign emails</option>
										<option value="PERSONAL">Personal emails only</option>
										<option value="CAMPAIGNS">Campaign emails only</option>
									</select>
							</div>
						</div>
						<div class="control-group form-group" style="display:none;">
                            <label class="control-label col-sm-4" ></label>
                            <div class="controls col-sm-8">
                                <select id="email-tracking-campaign-id" name="email_tracking_campaign_id" class="required form-control w-md">
                                    <option value="">Select...</option>
                                </select>
                            </div>
                        </div>
						 <div class="control-group form-group" style="display:none;">
                            <div>
                                <label class="control-label col-sm-4"></label>
                                <div class="controls col-sm-8">
                                    <input type="text" id="custom-link-clicked" value="{{custom_link_clicked}}" name="custom_link_clicked" class="required EMAIL_LINK_CLICKED form-control m-b-n-xxs w-md" placeholder="Link URL contains" />
                                </div>
                            </div>
                        </div>
						<div class="control-group form-group" style="display:none;">
							<div class="controls col-sm-offset-4 col-sm-8">
							<select id="trigger-shopify-event" name="trigger_shopify_event" class="required form-control w-md">
									<option value="">Select Shopify Event</option>
									<option value="CUSTOMERS_CREATE">Customer created</option>
									<option value="CUSTOMERS_UPDATE">Customer updated</option>
									<option value="ORDERS_CREATE">Order created</option>
									<option value="ORDERS_UPDATED">Order updated</option>
									<option value="ORDERS_PAID">Order payment</option>
									<option value="ORDERS_DELETE">Order deleted</option>
									<option value="ORDERS_FULFILLED">Order fulfilled</option>
									<option value="ORDERS_CANCELLED">Order cancelled</option>
									<option value="CHECKOUTS_CREATE">Checkout created</option>
									<option value="CHECKOUTS_UPDATE">Checkout updated</option>
									<option value="CHECKOUTS_DELETE">Checkout deleted</option>
							</select>
							<div class="m-t">
								<small><i class="icon-info-sign"></i> You need to setup Webhooks in your Shopify account for this. In your stores Admin panel, go to Settings, Notifications, Webhooks, and create a webhook for the desired event with the below URL. <br> <a class="inbound-help-text">{{shopifyWebhook}}</a></small>
							</div>
							</div>	
						</div>
						<div class="control-group form-group" style="display:none;">
							<div class="controls col-sm-offset-4 col-sm-8">
							<select id="trigger-form-event" name="trigger_form_event" class="required form-control w-md">
								<option value="">Select...</option>
							</select>
							</div>
						</div>
						<div id="trigger-inbound-mail-event" style="display:none;">
						<div class="control-group form-group">
							<div class="controls col-sm-offset-4 col-sm-8">
								<small><i class="icon-info-sign"></i> For Agile CRM to recognize your emails, please setup <a class="inbound-help-text">{{inboundMail}}</a> as forwarding email at your email server. When there is a new email to this address, the From address will be added to your Contacts and to the Campaign (in case it is a new Contact).</small>								
							</div>
                		</div>
						</div>
                       <div id="trigger-run-on-new-contacts" style="display:none;">
							<div class="control-group form-group">
								<div class="controls col-sm-offset-4 col-sm-8">
                                <div class="checkbox">
                              <label class="i-checks i-checks-sm">
                               <input type="checkbox"  name="trigger_run_on_new_contacts"><i></i>
	                            Run only on new Contacts</label>
                               </div>
								</div>
							</div>
						</div>
						<div id="new-mail-trigger-run-on-new-contacts" style="display:none;">
							<div class="control-group form-group">
								<div class="controls col-sm-offset-4 col-sm-8">
                                <div class="checkbox">
                                 <label class="i-checks i-checks-sm">
									<input type="checkbox"  name="new_email_trigger_run_on_new_contacts" checked="true"><i></i>
									Run only for new Contacts</label>
                                  </div>
								</div>
							</div>
						</div>
                        <div id="trigger-filter-condition" style="display:none;"></div>
                        <div class="control-group form-group">
                            <label class="control-label col-sm-4">Run this Campaign on the Contact <span class="field_req">*</span></label>
                            <div class="controls col-sm-8">
                                <select id="campaign-select" name="campaign_id" class="required form-control w-md">
                                    <option value="">Select...</option>
                                </select>
                            </div>
                        </div>
						<div class="line line-bg b-b"></div>
                        <div class="form-actions col-sm-offset-4 col-sm-8">          							
                            <a href="#triggers" id="trigger-save" class="save btn btn-sm btn-primary">Save</a>
							<a href="#" id="trigger-cancel" class="btn btn-default btn-sm">Cancel</a>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
        <div class="col-md-3">
            <div class="wrapper">
                <h4 class="m-t-none font-thin">
                    Triggers
                </h4>
                
                <p> Give your trigger a name and choose a condition to be satisfied. Immediately link your trigger to the appropriate campaign, for an action to follow.</p>
            </div>
        </div>
    </div>
</div>
</script><script id="triggers-model-template" type="text/html">		
	<td class="data" data="{{id}}">
		<div class="table-resp">
			<a href="#trigger/{{id}}" class="stop-propagation">{{name}}</a>
		</div>
	</td>        
	<td><div class="table-resp">{{triggerType type}}</div></td>
	<td><div class="table-resp">{{#if custom_score}}{{custom_score}} {{/if}} {{#if custom_tags}}{{custom_tags}}{{/if}} {{#if trigger_deal_milestone}}{{trigger_deal_milestone}}{{/if}} {{#if trigger_stripe_event}}{{trigger_stripe_event}}{{/if}}{{#if trigger_shopify_event}}{{trigger_shopify_event}}{{/if}} {{#if contactFilter}}{{contactFilter}}{{/if}}{{#if trigger_form_event}}{{getFormNameFromId trigger_form_event}}{{/if}}</div></td>
	<td><div class="table-resp">{{campaign}}</div></td>
	<br />
</script>
<script id="triggers-collection-template" type="text/html">
<div class="wrapper-md lter bg-light b-b">
<div class="row">
    <div class="col-sm-12 col-md-12">
        
			
            	<h3 class="pull-left font-thin h3">List of Triggers</h3>
			
			<div class="pull-right">
            	<a href="#trigger-add" class="btn right btn-default btn-sm btn-addon" id="addTrigger">
					<i class="icon-plus-sign"></i> Add Trigger
				</a>
			</div>
           <div class="clearfix"></div>
       
    </div>
</div>
</div>
<div class="wrapper-md">
<div class="row">
        {{#unless this.length}}
		<div class="col-md-9 col-sm-9 table-responsive">
        <div class="alert-info alert">
            <div class="slate-content">
                <div class="box-left pull-left m-r-md">
                    <img alt="Clipboard" src="/img/clipboard.png">
                </div>
                <div class="box-right pull-left">
                    <h4 class="h4 m-t-none">You do not have any triggers currently.</h4>
                    <p class="m-b-none">
                        You can define a trigger to start execution of a campaign. But please make sure to create atleast one campaign before creating triggers.
                    </p>
                    <a href="#trigger-add" class="btn btn-slate-action btn-default btn-sm m-t-xs">
						<i class="icon-plus-sign"></i>  Add trigger 
					</a>
                </div>
				<div class="clearfix">
				</div>
            </div>
        </div>
		</div>
        {{/unless}}
        {{#if this.length}}
            <div class="col-md-9 col-sm-9 table-responsive">
				<div class="panel panel-default">
			    <div class="panel-heading">Triggers List</div>
                <table class="table table-striped showCheckboxes m-b-none agile-table panel" url="core/api/triggers/bulk">
                    <thead>
                        <tr>
                            <th style="width:25%">Name</th>
                            <th style="width:25%">Condition</th>
                            <th style="width:25%">Value</th>
                            <th style="width:25%">Campaign</th>
                        </tr>
                    </thead>
                    <tbody id="triggers-model-list" route="trigger/"> </tbody>
                </table>
				</div>
            </div>
        {{/if}}
    <div class="col-sm-3 col-md-3 p-none">
        <div class="wrapper-sm">
            <h4 class="m-t-none h4 m-b-sm">
                What are Triggers?
            </h4>
            
            <p>
                Triggers are pre-defined conditions set up by you. If the condition is satisfied, you can choose an action to follow using workflow automation.
            </p>
            <p>
                e.g. If a user registers on your website, you can automate the workflow to send a welcome email. The user registering on site is the trigger.
            </p>
        </div>
    </div>
</div>
</div>
</script><script id="workflow-active-contacts-collection-template" type="text/html">

<div class="row">
    <div class="col-md-12">
        
			<h4 class="pull-left font-light h4">Active Subscribers
				<!-- <small> - <span id="subscribers-campaign-name"></span></small>--> 
				<span class="badge bg-primary">{{subscribers_count}}</span>
			</h3>
            <div class="pull-right m-b-sm">
				<div class="btn-group">
  					<a class="btn btn-sm btn-default m-l-xs">{{get_subscribers_type_from_hash}} Subscribers</a>
  					<a class="btn btn-sm dropdown-toggle btn-default" data-toggle="dropdown">
    					<span class="caret"></span>
  					</a>
  					<ul class="dropdown-menu" role="menu">
    					<li><a href="#workflow/all-subscribers/{{get_id_from_hash}}">All</a></li>
						<li><a href="#workflow/active-subscribers/{{get_id_from_hash}}">Active</a></li>
						<li><a href="#workflow/completed-subscribers/{{get_id_from_hash}}">Completed</a></li>
                        <li><a href="#workflow/removed-subscribers/{{get_id_from_hash}}">Removed</a></li>
                        <li><a href="#workflow/unsubscribed-subscribers/{{get_id_from_hash}}">Unsubscribed</a></li>
                        <li><a href="#workflow/hardbounced-subscribers/{{get_id_from_hash}}">Hard Bounced</a></li>
						<li><a href="#workflow/softbounced-subscribers/{{get_id_from_hash}}">Soft Bounced</a></li>
						<li><a href="#workflow/spam-reported-subscribers/{{get_id_from_hash}}">Spam Reported</a></li>
					</ul>
				</div>
			</div>
			<div class="clearfix"></div>
        
    </div>
</div>

{{!-- Shows pad-content if active subscribers are empty --}}
{{#unless this.length}}
<div id="subscribers-slate"></div>
{{/unless}}

{{#if this.length}}
<div class="row">
	<div class="col-md-12">
 		<div class="data">
        	<div class="data-container">
		    	<div class="btn btn-sm btn-default delete-checked-contacts" id="remove-active-from-campaign m-t-n-sm" style="display: none;"> Delete</div>
            	
            	<!-- Shows selected contacts list and offer to select all if current list is more than the page-size -->
                <div class="pos-rlt m-t-md block"  style="left: 70px;" id="subscribers-bulk-select"></div>
            	<div class="table-responsive">
            	<div class="panel panel-default">
            	<div class="panel-heading">Active Subscribers List</div>
            	<table class="table table-striped  panel agile-table showCheckboxes" url="core/api/bulk/update?workflow_id={{get_id_from_hash}}&action_type=REMOVE_ACTIVE_SUBSCRIBERS" id="active-campaign">
                	<thead>
                    	<tr>
                        	<th style="width:40%;" class="header">Contact</th>
                        	<th style="width:25%;" class="header">Campaign Date</th>
                        	<th style="width:30%;" class="header">Campaigns</th>
                    	</tr>
                	</thead>
                	<tbody id="workflow-active-contacts-model-list" route="contact/">
                	</tbody>
            	</table>
            	</div>
            	</div>
        	</div>
    	</div>
	</div>
</div>
{{/if}}
</script>
<script id="workflow-active-contacts-model-template" type="text/html">
<td class="data" data={{id}}>
	<div class="table-resp">
	<div class="thumb-sm agile-img">
    	<a href="#contact/{{id}}" class="activate-link">
			<img class="img-inital r r-2x" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties }}" title="{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}" />
		</a>
    </div>
    
 	<span>
    	<span><a class="text-cap">	{{contact_name properties type}} </a></span><br>
        <small>
        	{{getPropertyValue properties "email"}}</small>
    </span>
    </div>
</td>
<td>
    <div class="table-resp">
        <small class="edit-hover text-muted"> 
		    <span>Started&nbsp;</span>
                {{!-- Gets started time of current campaign from campaignStatus array having same campaign-id --}}

                {{#if_same_campaign this "campaignStatus"}}
				<i class="fa fa-clock-o m-r-xs"></i>
                <time class="campaign-started-time b-b-dotted" datetime="{{epochToHumanDate "" start_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" start_time}}</time>
                {{/if_same_campaign}}
        </small>
    </div>
</td>
<td>
    <div class="table-resp word-break-all">
		{{#if_other_active_campaigns this "campaignStatus"}}           
         {{!-- Shows Active campaigns separated by comma --}}
         {{#if this.active}} 
         <div class="text-ellipsis" style="width: 30em;">
           Active - {{#toLinkTrigger this.active}}<a href="#workflow/{{campaign_id}}" class="stop-propagation">{{#if campaign_name}}{{campaign_name}}{{else}} Active Campaign {{/if}}</a>{{/toLinkTrigger}}
         </div>
         {{/if}}
         {{#if this.done}}
         <div class="text-ellipsis" style="width: 30em;">
         	Done - {{#toLinkTrigger this.done}}<a href="#workflow/{{campaign_id}}" class="stop-propagation">{{#if campaign_name}}{{campaign_name}}{{else}} Done Campaign {{/if}}</a>{{/toLinkTrigger}}
         </div>
         {{/if}} 
   
        {{/if_other_active_campaigns}}
	</div>
</td>
</script><script id="workflow-add-template" type="text/html">
<div class="custom-animated custom-fadeInUp hide-rainbow">
<div class="wrapper-md">
<div class="row">
    <div class="col-md-12">
        <div class="panel wrapper">
            <form id="workflowform">
                <fieldset>
                    <div class="control-group form-group">
                        <label class="control-label"><b>Name of campaign:</b> <span class="field_req">*</span></label>
                        <div class="controls">
							<div class="row">
								<div class="col-md-5 col-sm-4 col-xs-4">
									<input name="workflow-name" type="text" id="workflow-name" class="col-md-3 form-control required w-md" placeholder="Name of campaign" />
								</div>
								<div class="col-md-3 col-sm-3 col-xs-4">
									<span id="workflow-msg" class="text-center"></span>
								</div>
								<div class="col-md-4 col-sm-5 col-xs-4">
									<a data-toggle="modal" id="workflow-designer-help" class="right m-t-n-md c-p text-xs text-info" style="clear:both;">Need help? Watch our tutorial.</a>
									{{#if is_new}}
										<button class="btn btn-primary btn-sm  right pos-rlt m-r-xs" id="save-workflow-top">Save Campaign</button>
									{{else}}
										<div class="btn-group right m-r-xs">
											<button class="btn btn-primary btn-sm btn-addon" id="save-workflow-top"><i class="icon-plus-sign"></i> Save Campaign</button>
                            				<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false"> 
            									<span class="caret"></span>
											</button>
											<ul class="dropdown-menu">
												<li>
													<a href="#" id="duplicate-workflow-top">
														<i class="icon-copy"></i> Create a Copy
													</a>
												</li>
											</ul>
                           				</div>
                            		{{/if}}
								</div>
                           		<div class="save-workflow-img right m-r-xs m-t-sm pos-rlt inline-block"></div>
							</div>
						</div>
                    </div>
					<div id="designer-tour">
                    <IFRAME SRC="designer.html" id="designer" frameBorder="0" name="designer" WIDTH="100%" HEIGHT="900px"></IFRAME>
                    </div>
					<br />
                    <br />
                    <div>
						<a href="#" class="text-info" id="workflow-unsubscribe-option" data-toggle="collapse" data-target="#workflow-unsubscribe-block">
							<span><i class="icon-plus"></i></span> Manage Unsubscription
						</a>
					</div>
					<br/>
					<div class="collapse" id="workflow-unsubscribe-block">
                    	<div class="text-sm text-light">Agile can unsubscribe your contacts from either the current campaign or all campaigns (ongoing and future)</div>
						<div class="row">
                         <div class="control-group form-group">
							<label class="control-label col-sm-2">
								<b>Unsubscribe Action:</b>
							</label>
							<div class="controls col-sm-4">
								<select name="action" id="unsubscribe-action" class="form-control">
									<option value="ASK_USER">Prompt User (Recommended)</option>
									<option value="UNSUBSCRIBE_FROM_ALL">All Campaigns</option>
                                    <option value="UNSUBSCRIBE_FROM_THIS_CAMPAIGN">Current Campaign only</option>
								</select>
							</div>
                    	</div>
                        </div>
                        <br/>
                        <br>
                        <div class="text-sm text-light">Agile can add the tags automatically when your contact unsubscribes. You can run more campaigns against this tag in future.</div>
                    	<div class="row">
                         <div class="control-group form-group">
							<label class="control-label col-sm-2">
								<b>Tags:</b>
							</label>
							<div class="controls col-sm-4">
								<input type="text" name="tag" id="unsubscribe-tag" placeholder="Separate tags with comma" class="form-control">
							</div>
                    	</div>
                        </div>
                        <br/>
                        <br>
                        <small>Unsubscribed contacts are not sent any further emails or tweets but other actions such as lead scoring will still continue to execute.</small>
					</div>
                 
                    <br />
                    <br />
                    {{#if is_new}}
						<button class="btn btn-sm btn-primary" id="save-workflow-bottom">Save Campaign</button>
					{{else}}
						<div class="btn-group inline-block">
                           	<button class="btn btn-primary btn-sm btn-addon" id="save-workflow-bottom"><i class="icon-plus-sign"></i> Save Campaign</button>
            				<button class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>
							<ul class="dropdown-menu">
								<li><a href="#" id="duplicate-workflow-bottom"><i class="icon-copy"></i> Create a Copy</a></li>
							</ul>
                         </div>
                    {{/if}}
                    <div class="save-workflow-img inline-block"></div>
                    <br />
                </fieldset>
            </form>
        </div>
    </div>
</div>
</div>
</div>
</script><script id = "campaign-node-limit-modal-template" type="text/html">
<div class="modal fade" id="campaign-node-limit-modal">
<div class="modal-dialog">
    <div class="modal-content">
	<div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-file-text"></i> Campaign Node Limit Reached</h3>
    </div>
	<div class="modal-body">
        <div id="limit-alert-details">
            <p>You have reached the limit of {{campaignNodesLimit}} nodes in your current plan {{planName}}. Please consider upgrading or splitting the campaign and use the 'Transfer' option.</p>
        </div>
    </div>
    <div class="modal-footer">
    <span class="contacts-export-csv-message m-r-xs"></span>
    <a href="#" class="btn btn-sm btn-primary" data-dismiss="modal">OK</a>
    </div>
</div>
</div>
</div>
</script>

<script id = "SMSGateway-integration-alert-modal-template" type="text/html">
	<div class="modal  fade" id="SMSGateway-integration-alert">
<div class="modal-dialog">
    <div class="modal-content">
		<div class="modal-header">
			<button class="close" data-dismiss="modal">x</button>
			<h3 class="modal-title"><i class="icon-file-text"></i> {{title}} </h3>
		</div>
		<div class="modal-body">
			{{#if_equals "SMS Gateway not Configured" title}} 
				<div id="Twilio-Gateway-not-Configured-details">
					<p>{{message}}</p>
				</div>
			{{/if_equals}}
			{{#if_equals "No Twilio Number" title}} 
				<div id="No-Twilio-Number-details">
					<p>{{message}}</p>
				</div>
			{{/if_equals}}
		</div>
		<div class="modal-footer">
			<span class="contacts-export-csv-message m-r-xs"></span>
			<a href="#" class="btn btn-sm btn-primary" data-dismiss="modal">OK</a>
		</div>
	</div>
</div>
</div>
</script>
<script id = workflow-designer-help-modal-template type="text/html">
<div class="modal  fade" id="workflow-designer-help-modal">
 <div class="modal-dialog">
    <div class="modal-content">
	<div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3 class="modal-title"><i class="icon-play-sign"></i> Workflow Tutorial</h3>
    </div>
	<div class="modal-body">
        <div id="workflow-help-detail" class="m-l-xxl">
		</div>
    </div>
</div>
</div>
</div>
</script><script id="workflow-other-subscribers-collection-template" type="text/html">
<div class="row">
    <div class="col-md-12">
        
<h4 class="pull-left font-light">{{get_subscribers_type_from_hash}} Subscribers<!--<small> - <span id="subscribers-campaign-name"></span></small>--> <span class="badge bg-primary">{{subscribers_count}}</span></h4>
            <div class="pull-right">
				<div class="btn-group">
					<a class="btn btn-sm btn-default m-l-xs">{{get_subscribers_type_from_hash}} Subscribers</a>
  					<a class="btn btn-sm dropdown-toggle btn-default" data-toggle="dropdown">
    					<span class="caret"></span>
  					</a>
  					<ul class="dropdown-menu" role="menu">
    					<li><a href="#workflow/all-subscribers/{{get_id_from_hash}}">All</a></li>
						<li><a href="#workflow/active-subscribers/{{get_id_from_hash}}">Active</a></li>
						<li><a href="#workflow/completed-subscribers/{{get_id_from_hash}}">Completed</a></li>
                        <li><a href="#workflow/removed-subscribers/{{get_id_from_hash}}">Removed</a></li>
                        <li><a href="#workflow/unsubscribed-subscribers/{{get_id_from_hash}}">Unsubscribed</a></li>
                        <li><a href="#workflow/hardbounced-subscribers/{{get_id_from_hash}}">Hard Bounced</a></li>
						<li><a href="#workflow/softbounced-subscribers/{{get_id_from_hash}}">Soft Bounced</a></li>
						<li><a href="#workflow/spam-reported-subscribers/{{get_id_from_hash}}">Spam Reported</a></li>
					</ul>
				</div>
			</div>
			<div class="clearfix"></div>
        
    </div>
</div>

{{!-- Shows pad-content if subscribers are empty --}}
{{#unless this.length}}
<div class="row">
<div class="col-md-12">
<div id="subscribers-slate"></div>
</div>
</div>
{{/unless}}

{{#if this.length}}
<div class="row">
	<div class="col-md-12"
		<div class="data">
        	<div class="data-container">
				<div class="table-responsive">
				<div class="panel panel-default">
			    <div class="panel-heading">All Subscribers List</div>
            	<table class="table table-striped onlySorting panel agile-table">
                	<thead>
                    	<tr>
							<th></th>
                        	<th style="width:40%;" class="header">Contact</th>
                        	<th style="width:30%;" class="header">Campaign Date</th>
							<!--<th>Status</th>-->
							<th style="width:30%;" class="header">Campaigns</th>
                    	</tr>
                	</thead>
                	<tbody id="workflow-other-subscribers-model-list" route="contact/">
                	</tbody>
            	</table>
				</div>
			</div>
        	</div>
    	</div>
	</div>
</div>
{{/if}}
</script>
<script id="workflow-other-subscribers-model-template" type="text/html">
<td></td>
<td class="data" data={{id}}>
	<div class="table-resp">
		<div class="thumb-sm agile-img">
    	<a href="#contact/{{id}}" class="activate-link">
			<img class="img-inital r r-2x" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" title="{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}" />
		</a>
		</div>
    	<span>
 		<span>
			<a class="text-cap">
    		{{contact_name properties type}}</a> </span>
        <br>
        	<small>{{getPropertyValue properties "email"}}</small>
    	</span>
	</div>
</td>
<td>
    <div class="table-resp">
        <small class="edit-hover text-muted"> 
		    <span>Started&nbsp;</span>
                {{#if_same_campaign this "campaignStatus"}}
				<i class="fa fa-clock-o m-r-xs"></i>
                <time class="campaign-started-time b-b-dotted" datetime="{{epochToHumanDate "" start_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" start_time}}</time>
                </br>
				{{#if this.end_time}}
				<span><em>Completed</em>&nbsp;</span>
				<i class="fa fa-clock-o m-r-xs"></i>
                <time class="campaign-completed-time b-b-dotted" datetime="{{epochToHumanDate "" end_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" end_time}}</time>
                {{/if}}
				{{/if_same_campaign}}
        </small>
    </div>
</td>
<!--<td>
 {{#if_same_campaign this "campaignStatus"}} {{#if this.end_time}}Completed{{else}} Active{{/if}} {{/if_same_campaign}}
</td> -->
<td>
    <div class="table-resp word-break-all">
		{{#if_other_active_campaigns this "campaignStatus"}}
           
         {{!-- Shows Active campaigns separated by comma --}}
         {{#if this.active}} 
         <div class="text-ellipsis" style="width: 30em;">
           Active - {{#toLinkTrigger this.active}}<a href="#workflow/{{campaign_id}}" class="stop-propagation">{{#if campaign_name}}{{campaign_name}}{{else}} Active Campaign {{/if}}</a>{{/toLinkTrigger}}
         </div>
         {{/if}}
         {{#if this.done}}
         <div class="text-ellipsis " style="width: 30em;">
         	Done - {{#toLinkTrigger this.done}}<a href="#workflow/{{campaign_id}}" class="stop-propagation">{{#if campaign_name}}{{campaign_name}}{{else}} Done Campaign {{/if}}</a>{{/toLinkTrigger}}
         </div>
         {{/if}} 
   
        {{/if_other_active_campaigns}}
	</div>
</td>
</script><script type="text/html" id="workflow-categories-template">
<div class="custom-animated custom-fadeInUp">
<div class="wrapper-md lter bg-light b-b">
<div class="row">
    <div class="col-md-12">
       <h3 class="pull-left font-light h3">Select a template <small> New Campaign</small></h3>
	   <div class="pull-right"> 
           <a href="#workflow-add" class="btn btn-default btn-sm btn-addon" title="Start with an empty campaign">I'm Pro</a>
	   </div>
	   <div class="clearfix"></div>
     </div>
</div>
</div>

<div class="wrapper-md  p-t-none">
<div class="row">    
    <div class="col-md-12">
    	<h4>General</h4>
	</div>
</div>
<div id="general" class="row">
	<div class="col-md-3 col-sm-6 col-xs-12">
    	<div class="panel wrapper text-center">
        <!-- Icon and Title -->
        <div>
           <div class="p-b-sm p-l-none p-r-none">
                <i class="icon-file-text icon-4x"></i>
            		</div>
            		<b>Newsletter</b>
        			</div>
        			<br>
        			<!-- Description -->
        			<div class="ellipsis-multiline m-b-md" rel="tooltip" title="Send a newsletter and see reports on opens and clicks">
            			Send a newsletter and see reports on opens and clicks
        			</div>
        		<!-- Add button -->
        		<div>
            	<a class="btn btn-sm btn-primary workflow-template-add" href="#workflow-add/general/newsletter">Go</a>
        	</div>
    </div>
	</div>
   <div class="col-md-3 col-sm-6 col-xs-12">
	<div class="panel wrapper text-center">
        			<!-- Icon and Title -->
        			<div>
            			<div class="p-b-sm p-l-none p-r-none">
                			<i class="icon-time icon-4x"></i>
            			</div>
            			<b>Autoresponder</b>
        			</div>
        			<br>
        			<!-- Description -->
        		<div class="ellipsis-multiline m-b-md" rel="tooltip" title="Send emails and follow-up automatically after a specified duration">
            		Send emails and follow-up automatically after a specified duration
        		</div>
        		<!-- Add button -->
        	<div>
            	<a class="btn btn-sm btn-primary workflow-template-add" href="#workflow-add/general/auto_responder">Go</a>
        	</div>
    </div>
	</div>
</div>

<div class="row">    
    <div class="col-md-12">
    	<h4>Marketing Automation</h4>
	</div>
</div>
<div id="marketing-automation" class="row">
	<div class="col-md-3 col-sm-6 col-xs-12">
    	<div class="panel wrapper text-center">
        <!-- Icon and Title -->
        <div>
            <div class="p-t-md p-l-none p-r-none p-b-sm">
                <i class="icon-star-half-full icon-4x"></i>
            </div>
            <b>Lead Scoring</b>
        </div>
        <br>
        <!-- Description -->
        <div class="ellipsis-multiline m-b-md" rel="tooltip" title="Score your leads when they click email links and browse the website">
            Score your leads when they click email links and browse the website
        </div>
        <!-- Add button -->
        <div>
            <a class="btn btn-sm btn-primary workflow-template-add" href="#workflow-add/marketing-automation/lead_scoring">Go</a>
        </div>
    </div>
	</div>
   <div class="col-md-3 col-sm-6 col-xs-12">
	<div class="panel wrapper text-center">
        <!-- Icon and Title -->
        <div>
            <div class="p-t-md p-l-none p-r-none p-b-sm">
                <i class="icon-twitter icon-4x"></i>
            </div>
            <b>Social Campaign</b>
        </div>
        <br>
        <!-- Description -->
        <div class="ellipsis-multiline m-b-md" rel="tooltip" title="Reach out to prospects on social media. Send automated Tweets">
            Reach out to prospects on social media. Send automated Tweets
        </div>
        <!-- Add button -->
        <div>
            <a class="btn btn-sm btn-primary workflow-template-add" href="#workflow-add/marketing-automation/social_campaign">Go</a>
        </div>
    </div>
	</div>
	<div class="col-md-3 col-sm-6 col-xs-12">
		<div class="panel wrapper text-center">
        <!-- Icon and Title -->
        <div>
            <div class="p-t-md p-l-none p-r-none p-b-sm">
                <i class="icon-beaker icon-4x"></i>
            </div>
            <b>A/B Test</b>
        </div>
        <br>
        <!-- Description -->
        <div class="ellipsis-multiline m-b-md" rel="tooltip" title="A/B test your emails. Compare results and optimize messages">
            A/B test your emails. Compare results and optimize messages
        </div>
        <!-- Add button -->
        <div>
            <a class="btn btn-sm btn-primary workflow-template-add" href="#workflow-add/marketing-automation/ab_testing">Go</a>
        </div>
    </div>
	</div>
</div>


<div class="row">    
    <div class="col-md-12">
    	<h4>SaaS</h4>
	</div>
</div>
<div id="saas" class="row">
	<div class="col-md-3 col-sm-6 col-xs-12">
    	 <div class="panel wrapper text-center">
        <!-- Icon and Title -->
        <div>
            <div class="p-t-md p-l-none p-r-none p-b-sm">
                <i class="icon-gift icon-4x"></i>
            </div>
            <b>Signup Welcome</b>
        </div>
        <br>
        <!-- Description -->
        <div class="ellipsis-multiline m-b-md" rel="tooltip" title="Send a welcome email after users signup">
            Send a welcome email after users signup
        </div>
        <!-- Add button -->
        <div>
            <a class="btn btn-sm btn-primary workflow-template-add" href="#workflow-add/saas/signup_welcome">Go</a>
        </div>
    </div>
	</div>
    <div class="col-md-3 col-sm-6 col-xs-12">
		 <div class="panel wrapper text-center">
        <!-- Icon and Title -->
        <div>
            <div class="p-t-md p-l-none p-r-none p-b-sm">
                <i class="icon-plane icon-4x"></i>
            </div>
            <b>User Onboarding</b>
        </div>
        <br>
        <!-- Description -->
        <div class="ellipsis-multiline m-b-md" rel="tooltip" title="Help your users with timely communication to bring them onboard and improve retention">
            Help your users with timely communication to bring them onboard and improve retention
        </div>
        <!-- Add button -->
        <div>
            <a class="btn btn-sm btn-primary workflow-template-add" href="#workflow-add/saas/user_onboarding">Go</a>
        </div>
    </div>
	</div>
	<div class="col-md-3 col-sm-6 col-xs-12">
		<div class="panel wrapper text-center">
        <!-- Icon and Title -->
        <div>
            <div class="p-t-md p-l-none p-r-none p-b-sm">
                <i class="icon-level-up icon-4x"></i>
            </div>
            <b>Trial Conversion</b>
        </div>
        <br>
        <!-- Description -->
        <div class="ellipsis-multiline m-b-md" rel="tooltip" title="Identify who among your free/trial users are ready to convert and reach out to them">
            Identify who among your free/trial users are ready to convert and reach out to them
        </div>
        <!-- Add button -->
        <div>
            <a class="btn btn-sm btn-primary workflow-template-add" href="#workflow-add/saas/trial_conversion">Go</a>
        </div>
    </div>
	</div>
</div>


<div class="row">    
    <div class="col-md-12">
    	<h4>E-commerce</h4>
	</div>
</div>
<div id="ecommerce" class="row">
	<div class="col-md-3 col-sm-6 col-xs-12">
    	<div class="panel wrapper text-center">
        <!-- Icon and Title -->
        <div>
            <div class="p-t-md p-l-none p-r-none p-b-sm">
                <i class="icon-shopping-cart icon-4x"></i>
            </div>
            <b>Cart Abandonment</b>
        </div>
        <br>
        <!-- Description -->
        <div class="ellipsis-multiline m-b-md" rel="tooltip" title="Detect when your users abandon cart and send them relavent communication">
            Detect when your users abandon cart and send them relavent communication
        </div>
        <!-- Add button -->
        <div>
            <a class="btn btn-sm btn-primary workflow-template-add" href="#workflow-add/ecommerce/cart_abandonment">Go</a>
        </div>
    </div>
	</div>
   <div class="col-md-3 col-sm-6 col-xs-12">
		 <div class="panel wrapper text-center">
        <!-- Icon and Title -->
        <div>
            <div class="p-t-md p-l-none p-r-none p-b-sm">
                <i class="icon-bullseye icon-4x"></i>
            </div>
            <b>Targeted Promo</b>
        </div>
        <br>
        <!-- Description -->
        <div class="ellipsis-multiline m-b-md" rel="tooltip" title="Send relevant and timely promotional communication to users based on their interests and actions">
            Send relevant and timely promotional communication to users based on their interests and actions
        </div>
        <!-- Add button -->
        <div>
            <a class="btn btn-sm btn-primary workflow-template-add" href="#workflow-add/ecommerce/targeted_promo">Go</a>
        </div>
    </div>
	</div>
</div>
</div>
</script><script id="workflow-triggers-template" type="text/html">

{{!-- Shows triggers of each workflow --}}
{{#toLinkTrigger triggers}} <a href="#trigger/{{id}}" class="stop-propagation">{{name}}</a>{{/toLinkTrigger}}

</script><script id="workflows-model-template" type="text/html">
	<td class="hide data" data="{{id}}">{{id}}</td>
	<td><div class="table-resp"><a class="text-cap">{{name}}</a></div></td>

    <td class="workflow-triggers" workflow-id={{id}}>
		<div class="table-resp">
			<a href="#trigger-add/{{id}}" class="stop-propagation">
				<i class="icon-plus text-xs" style="margin-right:3px"></i>Add
			</a>
		</div>	
	</td>

    <td>
		<div class="table-resp">
			<a href="#email-reports/{{id}}" class="stop-propagation">Reports</a></td>
		</div>    
	<td> 
        {{#if updated_time}}
        <div class="table-resp">
            <small class="edit-hover text-muted"> 
				<i class="fa fa-clock-o m-r-xs"></i>
		        <span><em>Modified</em>&nbsp;</span>
                <time class="campaign-created-time b-b-dotted" datetime="{{epochToHumanDate "" updated_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" updated_time}}</time>
            </small>
        </div>
        {{else}}
        <div>
            <small class="edit-hover text-muted"> 
				<i class="fa fa-clock-o m-r-xs"></i>
		       <span><em>Created</em>&nbsp;</span>
               <time class="campaign-created-time b-b-dotted" datetime="{{epochToHumanDate "" created_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time>
         	</small>
        </div>
        {{/if}}
    </td>  
<br />
</script>
<script id="workflows-collection-template" type="text/html">
<div class="custom-animated custom-fadeInUp">
<div class="wrapper-md lter bg-light b-b">
<div class="row">
    <div class="col-sm-12 col-md-12">
        
			
            	<h3 class="pull-left font-thin h3">Campaigns <small>{{#campaigns_heading this}}{{/campaigns_heading}}</small></h3>
			
			<div class="pull-right">
				<div class="btn-group right pos-rlt pull-right">
            		<a href="#workflow-templates" class="btn btn-default btn-sm" id="addWorkflow"><i class="icon-plus-sign"></i> Add Campaign</a>
            		<a id="campaign-stats" class="btn dropdown-toggle btn-sm btn-default" data-toggle="dropdown"><span class="caret"></span></a>
					<ul class="dropdown-menu pull-right">
						<li><a href="#campaign-stats" id="campaign-stats"><i class="icon-bar-chart"></i> Compare Campaigns</a></li>
					</ul>
				</div>
            	<a href="#triggers" class="btn right btn-default btn-sm pos-rlt m-r-sm pull-right btn-addon" id="add-trigger"><i class="icon-cog"></i> Manage Triggers</a>
			</div>
			<div class="clearfix"></div>
        
    </div>
</div>
</div>
<div class="wrapper-md">
<div class="row">
      <!-- Pending Triggers Content -->
        <div id="triggers-verification" class="m-t-n-sm" style="display:none;">
            <div class="alert danger info-block alert-warning text-black">
                <div>
                	<i class="icon-warning-sign"></i>
					<strong>PENDING TRIGGERS. 
						<!--<a href="#trigger-add" style="float: right;cursor: pointer;font-weight: normal;">How to add trigger?</a>-->
					</strong>
                	<p>You have at least one campaign but no triggers yet. <br></p>
                	<p>Campaigns can be manually run on contact(s) or you can setup a trigger to run the campaign automatically based on certain conditions. <a href="#trigger-add" class="block">Setup a new trigger.</a></p>
                </div>
            </div>
        </div>
        <!-- End of Pending Triggers Content -->

        {{#unless this.length}}
		<div class="col-md-9 col-sm-9">
        	<div id="slate">
		</div>
        </div>
        {{/unless}}
        {{#if this.length}}
			{{add_tag "Campaigns"}}
            <div class="col-md-9 col-sm-9 table-responsive">
			<div class="panel panel-default">
			    <div class="panel-heading">Campaigns List</div>
                <table class="table table-striped showCheckboxes m-b-none agile-table panel" url="core/api/workflows/bulk" id="workflows-tour-step">
                    <thead>
                        <tr>
                            <th class="hide">Id</th>
                            <th style="width:35%">Name</th>
                            <th style="width:25%">Triggers</th>
							<th style="width:15%">&nbsp;</th>
							<th style="width:25%">&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody id="workflows-model-list" route="workflow/" class="c-p"> </tbody>
                </table>
				</div>
            </div>
        {{/if}}
    <div class="col-md-3 col-sm-3" id="learn-workflows">
        
            <h4 class="m-t-none h4 m-b-sm">
                What is Workflow Automation?
            </h4>
            
            <p>
                Workflow is an intelligent sales and marketing automation process for sending your contacts relevant information at the right time.Use it to automate most of your follow-up activities.
            </p>
            <p>
                e.g. You can send an email to all users who have signed up on your site. And then based on their behavior in the control panel, you can send them targeted messages periodically.
            </p>
            <br>
            <h4 class="m-t-none h4 m-b-sm">
                What are Triggers?
            </h4>
            
            <p>
                Triggers are pre-defined conditions set up by you. If the condition is satisfied, you can choose an action to follow using workflow automation.
            </p>
            <p>
                e.g. If a user registers on your website, you can automate the workflow to send a welcome email. The user registering on site is the trigger.
            </p>
        
    </div>
</div>
</div>
</div>
</script>