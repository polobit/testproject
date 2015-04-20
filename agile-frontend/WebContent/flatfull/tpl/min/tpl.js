<!-- New (Note) Modal views -->
<script id="infoModal-template" type="text/html">
<div class="modal hide fade infoModal" id="infoModal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-info-sign"></i>&nbsp;Email Info</h3>
    </div>
    <div class="modal-body">

<div style="margin-bottom:5px;"><b>Subject :&nbsp;&nbsp;</b>{{#if custom4}}{{this.custom4}}{{else}}{{this.custom3}}{{/if}}</div>
<div ><b>Message :&nbsp;&nbsp;</b>{{this.custom2}}</div>
       
       
    </div>
    
</div>
</script>
<script id="account-stats-template" type="text/html">
<legend>Account Stats</legend>
<table class="table table-bordered">
    <colgroup>
        <col class="span3" />
        <col class="span7" />
    </colgroup>
    <thead>
        <tr>
            <th>Name</th>
            <th>Details</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Data</td>
            <td>{{bytes}}</td>
        </tr>
        <tr>
            <td>Entities</td>
            <td>{{entities}}</td>
        </tr>
    </tbody>
</table>
{{#check_plan "FREE"}}
	<a href="#" id="cancel-account" align="center" class="btn btn-danger">Cancel My Account</a>
{{else}}
	<a href="#" id="cancel-account-request" align="center" class="btn btn-danger">Cancel My Account</a>
{{/check_plan}}
</script><script id="not-allowed-template" type="text/html">
<h2><strong><i class="fa-exclamation-triangle icon-white"></i>&nbsp;&nbsp; Sorry, you do not have the privileges to access {{entity}}.</strong></h2>
</script>
<script id="others-not-allowed-template" type="text/html">
<h2><strong><i class="fa-exclamation-triangle icon-white"></i>&nbsp;&nbsp; You have no Admin Privileges.</strong></h2>
</script><script id="activity-list-log-collection-template" type="text/html">

{{#unless this.length}}

        <div class="slate">
            <div class="slate-content">
                <div class="box-left">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                
                <div class="box-right">
                    <h3>No activity found</h3>
                    
                </div>
            </div>
        </div>
        {{/unless}}
{{#if this.length}}
<div >
<section class="scroll">
    <form>
      <div class="ref-log">  
            <div id="today-heading" style="display: none" class="ref-head"><b >Today</b>	</div>
            <div id="today-activity" style="display: inline;"></div>
            <div id="tomorrow-heading" style="display: none" class="ref-head"><b >Yesterday</b></div>
            <div id="tomorrow-activity" style="display: inline;"></div>
		<div id="next-week-heading" style="display: none" class="">
            <b id="earllier" style="display:none">Earlier</b>
			</div>
            <div id="next-week-activity" style="display: inline;"></div>
</div>
    </form>
</section>
</div>

	<!--<ul style="margin:0px" id="activity-list-log-model-list" ></ul>-->

{{/if}}
</script>



<script id="activity-list-log-model-template" type="text/html">

	
	<div class="pos-rlt">
	<div style="margin-right:15px;" class="pull-left">
			{{#if this.userPic}}
				<img class="user-img ref-roundedimg" width="20" height="20" alt="" src="{{userPic}}" title="{{this.user.name}}">
			{{else}}
				<img class="user-img ref-roundedimg" width="20" height="20" alt="" src="{{defaultGravatarurl 40}}" title="{{this.user.name}}" >
			{{/if}}
	</div>
<div class="activity-tag">
<div>
{{#if_equals "TASK" entity_type}}
{{#if_equals "TASK_ADD" activity_type}}

Created Task {{#if this.entityObject}}<a href="#task/{{entity_id}}">{{label}}</a>{{else}} '{{label}}'{{/if}} <br/>
<span class="activities_second_line">
{{#if custom2}}
<i class="icon-tasks"></i> {{#unless this.entityObject}}Task deleted later. {{/unless}}Task assigned to {{custom1}} due <span class="time-ago" datetime="{{epochToHumanDate "ddd mmm dd yyyy h:MM TT" entityObject.due}}">{{epochToHumanDate "ddd mmm dd yyyy h:MM TT" custom2}}</span>. {{#if related_contact_ids}}Task related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}}
{{else}}
<i class="icon-tasks"></i> {{#unless this.entityObject}}Task deleted later. {{/unless}}Task assigned to {{entityObject.taskOwner.name}} due <span class="time-ago" datetime="{{epochToHumanDate "ddd mmm dd yyyy h:MM TT" entityObject.due}}">{{epochToHumanDate "ddd mmm dd yyyy h:MM TT" entityObject.due}}</span>. {{#if related_contact_ids}}Task related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}}

{{/if}}
</span>


{{/if_equals}}


{{#if_equals "TASK_COMPLETED" activity_type}}
Completed Task {{#if this.entityObject}}<a href="#task/{{entity_id}}">{{label}}</a>{{else}}'{{label}}'{{/if}}<br/>
<span class="activities_second_line">
 <i class="icon-tasks"></i>{{#if this.entityObject}} Task due {{epochToHumanDate "ddd mmm dd yyyy h:MM TT" entityObject.due}} was completed.{{else}} Task deleted later.{{/if}} {{#if related_contact_ids}}Task related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}} 
	</span>
{{/if_equals}}



{{#if_equals "TASK_DELETE" activity_type}}
 Deleted Task '{{label}}' <br/>
<span class="activities_second_line">
{{#if related_contact_ids}}<i class="icon-tasks"></i> Task related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}. {{/if}} 
</span>
{{/if_equals}}


{{#if_equals "TASK_EDIT" activity_type}}
{{#if this.entityObject}}	
{{#get_event_rescheduled custom3}} 
Changed Due date of Task <a href="#task/{{../entity_id}}" >{{../label}}</a><br/>
<span class="activities_second_line">
<i class="icon-tasks icon-white"></i> Task Due time changed to {{epochToHumanDate "ddd mmm dd yyyy h:MM TT" ../entityObject.due}}.
</span> 
{{else}}
 Modified Task <a href="#task/{{../entity_id}}">{{../label}}</a> <br/>
<span class="activities_second_line">
<i class="icon-tasks icon-white"></i> Task {{displayActivityFieldText ../custom3}} modified.
{{/get_event_rescheduled}}
{{else}}
{{#get_event_rescheduled custom3}} 
Changed Due date of Task '{{../label}}'<br/>
<span class="activities_second_line">
<i class="icon-tasks icon-white"></i> Task deleted later. Task Due time changed to {{#getDueDateOfTask ../custom3  ../custom1}}{{/getDueDateOfTask}}.
</span> 
{{else}}
 Modified Task '{{../label}}'<br/>
<span class="activities_second_line">
<i class="icon-tasks icon-white"></i> Task deleted later. Task {{displayActivityFieldText ../custom3}} modified.
{{/get_event_rescheduled}}
{{/if}}
</span>
<span class="activities_second_line">
 {{#if related_contact_ids}} Task related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}}  
</span>
{{/if_equals}}


{{#if_equals "TASK_OWNER_CHANGE" activity_type}}
Reassigned Task {{#if this.entityObject}}<a href="#task/{{entity_id}}">{{label}}</a>{{else}}'{{label}}'{{/if}} <br/>
<span class="activities_second_line">
<i class="icon-tasks"></i> {{#unless this.entityObject}}Task deleted later.{{/unless}} Task Owner changed to {{custom1}}. {{#if related_contact_ids}}Task related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}} 
</span>	
{{/if_equals}}



{{#if_equals "TASK_RELATED_CONTACTS" activity_type}}
{{#if related_contact_ids}}
{{#if_equals "removed_all_relatedcontacts" custom3}}
Removed Contact(s) from Task {{#if this.entityObject}}<a href="#task/{{entity_id}}">{{label}}</a>{{else}}'{{label}}'{{/if}}<br/>
<span class="activities_second_line">
<i class="icon-tasks"></i> {{#unless this.entityObject}}Task deleted later. {{/unless}}{{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}} removed from Task.
</span>
{{/if_equals}} 
{{#if_equals "removed_relatedcontacts" custom3}}
Removed Contact(s) from Task {{#if this.entityObject}}<a href="#task/{{entity_id}}">{{label}}</a>{{else}}'{{label}}'{{/if}}<br/>
<span class="activities_second_line">
<i class="icon-tasks"></i> {{#unless this.entityObject}}Task deleted later. {{/unless}}{{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}} removed from Task.
</span>
{{/if_equals}} 
{{#if_equals "added_relatedcontacts" custom3}}
Added Contact(s) to Task {{#if this.entityObject}}<a href="#task/{{entity_id}}">{{label}}</a>{{else}}'{{label}}'{{/if}}<br/>
<span class="activities_second_line">
<i class="icon-tasks"></i> {{#unless this.entityObject}}Task deleted later. {{/unless}}{{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}} added to Task. 
{{/if_equals}}
{{else}}
Modified Task. <br/>
<span class="activities_second_line">
<i class="icon-tasks"></i> <a href="#task/{{entity_id}}">{{label}}</a> Modified  
</span>
{{/if}} 
</span>
{{/if_equals}}


{{#if_equals "TASK_PROGRESS_CHANGE" activity_type}}
Changed Progress of Task {{#if this.entityObject}}<a href="#task/{{entity_id}}" >{{label}}</a>{{else}}'{{label}}'{{/if}}  <br/>   
<span class="activities_second_line">
 <i class="icon-tasks"></i> {{#unless this.entityObject}}Task deleted later. {{/unless}}Task Progress changed from {{custom2}}% to {{custom1}}%. {{#if related_contact_ids}}Task related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}} 	
</span>
{{/if_equals}}



{{#if_equals "TASK_STATUS_CHANGE" activity_type}}
Changed Status of Task {{#if this.entityObject}}<a href="#task/{{entity_id}}" >{{label}}</a>{{else}}'{{label}}'{{/if}} <br/>  
<span class="activities_second_line"> 
<i class="icon-tasks"></i> {{#unless this.entityObject}}Task deleted later. {{/unless}}Task Status changed from {{get_normal_name custom2}} to {{get_normal_name custom1}}. {{#if related_contact_ids}}Task related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}}	
</span>
{{/if_equals}}

{{#if_equals "BULK_DELETE" activity_type}}
{{#if_equals "1" custom1}}
  Deleted {{custom1}} Task <br/>
<span class="activities_second_line">  
{{#if custom2}}<i class="icon-tasks"></i> {{custom2}}{{/if}}
</span> 
{{else}} 
	Deleted {{custom1}} Tasks <br/>
<span class="activities_second_line">    
{{#if custom2}}<i class="icon-tasks"></i> {{custom2}}. {{/if}} 
</span>
{{/if_equals}}
{{/if_equals}}
{{/if_equals}}

<!-- starting of deal condition-->

{{#if_equals "DEAL" entity_type}}
 {{#if_equals "DEAL_ADD" activity_type}}
Created Deal {{#if entityObject}}<a href="#deal/{{entity_id}}">{{label}}</a> {{else}}'{{label}}'{{/if}}<br/>
<span class="activities_second_line">
{{#if custom2}}
<i class="icon-money icon-white"></i> {{#unless this.entityObject}}Deal deleted later. {{/unless}}Deal ({{currencySymbol}}{{numberWithCommasForActivities custom2}} - {{custom3}}%) added {{#if entityObject}}to track '{{entityObject.pipeline.name}}'{{/if}}. {{#if related_contact_ids}}Deal related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}}
{{else}}
 <i class="icon-money icon-white"></i>{{#unless this.entityObject}} Deal deleted later.{{/unless}} Deal {{#if this.entityObject}} ({{currencySymbol}}{{numberWithCommas entityObject.expected_value}} - {{entityObject.probability}}%) added to track '{{entityObject.pipeline.name}}'.{{/if}} {{#if related_contact_ids}}Deal related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}} 
{{/if}}	
</span>	
{{/if_equals}}


{{#if_equals "DEAL_ARCHIVE" activity_type}}
 Archived Deal {{#if this.entityObject}}<a href="#deal/{{entity_id}}">{{label}}</a>{{else}}'{{label}}'{{/if}}<br/> 
<span class="activities_second_line">
<i class="icon-money icon-white"></i> {{#unless this.entityObject}}Deal deleted later.{{/unless}} {{#if this.entityObject}} Deal ({{currencySymbol}}{{numberWithCommas entityObject.expected_value}} - {{entityObject.probability}}%) archived.{{/if}} {{#if related_contact_ids}}Deal related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}}
</span>	
{{/if_equals}}

{{#if_equals "DEAL_RESTORE" activity_type}}
 Restored Deal {{#if this.entityObject}}<a href="#deal/{{entity_id}}">{{label}}</a>{{else}}'{{label}}'{{/if}}<br/> 
<span class="activities_second_line">
<i class="icon-money icon-white"></i> {{#unless this.entityObject}}Deal deleted later.{{/unless}} {{#if this.entityObject}} Deal ({{currencySymbol}}{{numberWithCommas entityObject.expected_value}} - {{entityObject.probability}}%) restored.{{/if}} {{#if related_contact_ids}}Deal related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}}
</span>	
{{/if_equals}}



{{#if_equals "DEAL_CLOSE" activity_type}}
 Won Deal {{#if this.entityObject}}<a href="#deal/{{entity_id}}">{{label}}</a>{{else}}'{{label}}'{{/if}}<br/> 
<span class="activities_second_line">
<i class="icon-money icon-white"></i> {{#unless this.entityObject}}Deal deleted later.{{/unless}} {{#if this.entityObject}} Deal ({{currencySymbol}}{{numberWithCommas entityObject.expected_value}} - {{entityObject.probability}}%) Won.{{/if}} {{#if related_contact_ids}}Deal related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}}
</span>	
{{/if_equals}}


{{#if_equals "DEAL_EDIT" activity_type}}
 Modified Deal {{#if this.entityObject}}<a href="#deal/{{entity_id}}" >{{label}}</a>{{else}}'{{label}}'{{/if}}  <br/> 
<span class="activities_second_line">
<i class="icon-money icon-white"></i>{{#unless this.entityObject}} Deal deleted later.{{/unless}} Deal {{#if this.entityObject}} ({{currencySymbol}}{{numberWithCommas entityObject.expected_value}} - {{entityObject.probability}}%){{/if}} {{displayActivityFieldText custom3}} modified. {{#if related_contact_ids}} Deal related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}}
</span>	
{{/if_equals}}



{{#if_equals "DEAL_DELETE" activity_type}}
Deleted Deal '{{label}}' <br/> 
<span class="activities_second_line">
{{#if related_contact_ids}}<i class="icon-money icon-white"></i> Deal related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}} 
</span>
{{/if_equals}}


{{#if_equals "DEAL_RELATED_CONTACTS" activity_type}}

{{#if related_contact_ids}}
{{#if_equals "removed_all_relatedcontacts" custom3}}
Removed Contact(s) from Deal {{#if this.entityObject}}<a href="#deal/{{entity_id}}" >{{label}}</a>{{else}}'{{label}}'{{/if}}<br/> 
<span class="activities_second_line">
<i class="icon-money icon-white"></i> {{#unless this.entityObject}}Deal deleted later. {{/unless}} {{#if related_contact_ids}}{{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}} removed from  Deal {{#if this.entityObject}}({{currencySymbol}}{{numberWithCommas entityObject.expected_value}} - {{entityObject.probability}}%){{/if}}.{{/if}} 
</span>
{{/if_equals}} 
{{#if_equals "removed_relatedcontacts" custom3}}
Removed Contact(s) from Deal {{#if this.entityObject}}<a href="#deal/{{entity_id}}" >{{label}}</a>{{else}}'{{label}}'{{/if}}<br/> 
<span class="activities_second_line">
<i class="icon-money icon-white"></i> {{#unless this.entityObject}}Deal deleted later. {{/unless}}  {{#if related_contact_ids}}{{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}} removed from Deal {{#if this.entityObject}}({{currencySymbol}}{{numberWithCommas entityObject.expected_value}} - {{entityObject.probability}}%){{/if}}.{{/if}}
</span>
{{/if_equals}} 
{{#if_equals "added_relatedcontacts" custom3}}
Added Contact(s) to Deal {{#if this.entityObject}}<a href="#deal/{{entity_id}}" >{{label}}</a>{{else}}{{label}}{{/if}}<br/>
<span class="activities_second_line">
 <i class="icon-money icon-white"></i> {{#unless this.entityObject}}Deal deleted later. {{/unless}}{{#if related_contact_ids}}{{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}} added to Deal {{#if this.entityObject}}({{currencySymbol}}{{numberWithCommas entityObject.expected_value}} - {{entityObject.probability}}%){{/if}}.{{/if}}
</span>
{{/if_equals}}
{{else}}
Modified  Deal {{#if this.entityObject}}<a href="#deal/{{entity_id}}" >{{label}}</a>{{else}}'{{label}}'{{/if}}. <br/>
<span class="activities_second_line">
{{#if related_contact_ids}}related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}{{/if}} 
</span>
{{/if}}	
{{/if_equals}}



{{#if_equals "NOTE_ADD" activity_type}}
Added note to Deal {{#if this.entityObject}}<a href="#deal/{{entity_id}}" >{{label}}</a>{{else}}'{{label}}'{{/if}} <br/>
<span class="activities_second_line">
<i class="icon-pencil"></i> {{#unless this.entityObject}}Deal deleted later. {{/unless}}<span title="{{custom1}}">{{add_dots_end custom1}}</span> {{#if custom2}}- <span title="{{custom2}}">{{add_dots_end custom2}}{{/if}}<br/>
</span>
{{/if_equals}}


{{#if_equals "DEAL_OWNER_CHANGE" activity_type}}
Reassigned Deal {{#if this.entityObject}}<a href="#deal/{{entity_id}}" >{{label}}</a>{{else}}'{{label}}'{{/if}} to {{custom1}}<br/>
<span class="activities_second_line">
<i class="icon-money icon-white"></i> {{#unless entityObject}} Deal deleted later.{{/unless}} Deal{{#if this.entityObject}}({{currencySymbol}}{{numberWithCommas entityObject.expected_value}} - {{entityObject.probability}}%){{/if}} assigned to '{{custom1}}'. {{#if related_contact_ids}}Deal related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}}	
</span>
{{/if_equals}}




{{#if_equals "DEAL_MILESTONE_CHANGE" activity_type}}
Changed Milestone of Deal {{#if this.entityObject}}<a href="#deal/{{entity_id}}" >{{label}}</a>{{else}}'{{label}}'{{/if}} <br/>
<span class="activities_second_line"> 
<i class="icon-money icon-white"></i> {{#unless entityObject}} Deal deleted later.{{/unless}}{{#if this.entityObject}}Deal ({{currencySymbol}}{{numberWithCommas entityObject.expected_value}} - {{entityObject.probability}}%){{/if}} Milestone changed from '{{custom2}}' to '{{custom1}}'. {{#if related_contact_ids}}Deal related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}}
</span>	
{{/if_equals}}

 {{#if_equals "DEAL_IMPORT" activity_type}}
Imported {{custom1}} Deals <br/>	
{{/if_equals}}

{{#if_equals "DEAL_EXPORT" activity_type}}
Exported {{custom1}} Deals <br/>	
{{/if_equals}}


{{#if_equals "DEAL_LOST" activity_type}}
Lost Deal {{#if this.entityObject}}<a href="#deal/{{entity_id}}" >{{label}}</a>{{else}}'{{label}}'{{/if}} <br/>
<span class="activities_second_line">
<i class="icon-money icon-white"></i>{{#unless entityObject}} Deal deleted later.{{/unless}} Deal {{#if this.entityObject}}({{currencySymbol}}{{numberWithCommas entityObject.expected_value}} - {{entityObject.probability}}%) {{/if}} Lost. {{#if related_contact_ids}} Deal related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}}
</span>	
{{/if_equals}}

{{#if_equals "BULK_ACTION" activity_type}}

{{#if_equals "BULK_DEAL_ARCHIVE" custom1}}
Archived {{custom3}} Deals<br/>
{{/if_equals}}


{{#if_equals "BULK_DEAL_RESTORE" custom1}}
 Restored {{custom3}} Deals<br/>

{{/if_equals}}


{{#if_equals "BULK_DEAL_OWNER_CHANGE" custom1}}

{{#if_equals "1" custom3}}
Changed owner for {{custom3}} Deal <br/>
<span class="activities_second_line">
<i class="icon-money icon-white"></i> Deal assigned to {{custom2}}.
</span>
{{else}}
Changed owner for {{custom3}} Deals <br/>
<span class="activities_second_line">
<i class="icon-money icon-white"></i> Deals assigned to {{custom2}}.
</span>
{{/if_equals}}
{{/if_equals}}

{{#if_equals "BULK_DEAL_MILESTONE_CHANGE" custom1}}
{{#getTracksCount}}
{{#if_equals "1" custom3}}
Changed track/milestone for {{custom3}} Deal <br/>
<span class="activities_second_line">
<i class="icon-money icon-white"></i> Deal track/milestone changed to {{custom4}} - {{custom2}}.
</span>
{{else}}
	Changed track/milestone for {{custom3}} Deals <br/>
<span class="activities_second_line">
<i class="icon-money icon-white"></i> Deals track/milestone changed to {{custom4}} - {{custom2}}.
</span>
{{/if_equals}}
{{else}}
{{#if_equals "1" custom3}}
Changed milestone for {{custom3}} Deal <br/>
<span class="activities_second_line">
<i class="icon-money icon-white"></i> Deal milestone changed to {{custom2}}.
</span>
{{else}}
	Changed milestone for {{custom3}} Deals <br/>
<span class="activities_second_line">
<i class="icon-money icon-white"></i> Deals milestone changed to {{custom2}}.
</span>
{{/if_equals}}
{{/getTracksCount}}
{{/if_equals}}
{{/if_equals}}


{{#if_equals "BULK_DELETE" activity_type}}
  {{#if_equals "1" custom1}}
  Deleted {{custom1}} Deal<br/>
<span class="activities_second_line">
  {{#if custom2}}<i class="icon-money icon-white"></i> {{custom2}}.{{/if}}
</span>
{{else}} 
	Deleted {{custom1}} Deals <br/>
<span class="activities_second_line">
 {{#if custom2}}<i class="icon-money icon-white"></i> {{custom2}}.{{/if}}
</span>
{{/if_equals}}
{{/if_equals}}
{{/if_equals}}

<!-- end of deal condition-->	

<!-- starting event condition-->
{{#if_equals "EVENT" entity_type}}
{{#if_equals "EVENT_ADD" activity_type}}
 Created Event {{#if entityObject}}<a href="" data={{entity_id}} class='activity-event-edit'">{{label}}</a>{{else}}'{{label}}'{{/if}} <br/>
<span class="activities_second_line">
{{#if custom2}}
<i class="icon-calendar icon-white"></i> {{#unless this.entityObject}}Event deleted later. {{/unless}}Event starts at {{epochToHumanDate "h:MM TT" custom2}} on {{epochToHumanDate "ddd mmm dd yyyy" custom2}}.{{#if related_contact_ids}} Event related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}}
{{else}}
<i class="icon-calendar icon-white"></i> {{#if this.entityObject}} Event starts at {{epochToHumanDate "h:MM TT" entityObject.start}} on {{epochToHumanDate "ddd mmm dd yyyy" entityObject.start}}.{{else}} Event deleted later.{{/if}}{{#if related_contact_ids}} Event related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}}   
{{/if}}
</span>
{{/if_equals}}



{{#if_equals "EVENT_RELATED_CONTACTS" activity_type}}
{{#if related_contact_ids}}
{{#if_equals "removed_all_relatedcontacts" custom3}}
Removed Contact(s) from Event {{#if entityObject}}<a href="" data={{entity_id}} class='activity-event-edit'">{{label}}</a>{{else}}'{{label}}'{{/if}}<br/> 
<span class="activities_second_line">
<i class="icon-calendar icon-white"></i> {{#unless this.entityObject}}Event deleted later. {{/unless}}{{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}} removed from Event. 
</span>
{{/if_equals}} 
{{#if_equals "removed_relatedcontacts" custom3}}
Removed Contact(s) from Event {{#if entityObject}}<a href="" data={{entity_id}} class='activity-event-edit'">{{label}}</a>{{else}}'{{label}}'{{/if}}<br/> 
<span class="activities_second_line">
<i class="icon-calendar icon-white"></i> {{#unless this.entityObject}}Event deleted later. {{/unless}}{{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}} removed from Event.
{{/if_equals}} 
</span>
{{#if_equals "added_relatedcontacts" custom3}}
Added Contact(s) to Event {{#if entityObject}}<a href="" data={{entity_id}} class='activity-event-edit'">{{label}}</a>{{else}}'{{label}}'{{/if}}<br/> 
<span class="activities_second_line">
<i class="icon-calendar icon-white"></i> {{#unless this.entityObject}}Event deleted later. {{/unless}}{{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}} added to Event.
 {{/if_equals}}
</span>
{{else}}
Modified Event {{#if entityObject}}<a href="" data={{entity_id}} class='activity-event-edit'">{{label}}</a>{{else}}'{{label}}'{{/if}}<br/> 
<span class="activities_second_line">
{{#if related_contact_ids}}
<i class="icon-calendar icon-white"></i>Event related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}}<a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}} 
{{/if}}	
</span>
{{/if_equals}}



{{#if_equals "BULK_DELETE" activity_type}}
 {{#if_equals "1" custom1}}
  Deleted {{custom1}} Event <br/>
{{#if custom2}}
<span class="activities_second_line">
<i class="icon-calendar icon-white"></i> {{custom2}}.
</span>
 {{/if}} 
{{else}} 
	Deleted {{custom1}} Events <br/>
{{#if custom2}}
<span class="activities_second_line">
<i class="icon-calendar icon-white"></i> {{custom2}}.
</span>
 {{/if}} 
{{/if_equals}}
{{/if_equals}}




{{#if_equals "EVENT_DELETE" activity_type}}
Deleted Event '{{label}}'<br/>
<span class="activities_second_line">
 {{#if related_contact_ids}} <i class="icon-calendar icon-white"></i> Event related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}}
</span>
{{/if_equals}}




{{#if_equals "EVENT_EDIT" activity_type}}

{{#if this.entityObject}}	
{{#get_event_rescheduled custom3}} 
Rescheduled Event <a href="" data={{../entity_id}} class='activity-event-edit'">{{../label}}</a><br/>
<span class="activities_second_line">
<i class="icon-calendar icon-white"></i> Event Start time changed to {{epochToHumanDate "ddd mmm dd yyyy h:MM TT" ../entityObject.start}}.
</span> 
{{else}}
Modified Event <a href="" data={{../entity_id}} class='activity-event-edit'">{{../label}}</a> <br/>
<span class="activities_second_line">
<i class="icon-calendar icon-white"></i> Event {{displayActivityFieldText ../custom3}} modified.
{{/get_event_rescheduled}}
{{else}}
{{#get_event_rescheduled custom3}} 
Rescheduled Event '{{../label}}'<br/>
<span class="activities_second_line">
<i class="icon-calendar icon-white"></i> Event deleted later. Event Start time changed to {{#getDueDateOfTask ../custom3  ../custom1}}{{/getDueDateOfTask}}.
</span> 
{{else}}
 Modified Event '{{../label}}' <br/>
<span class="activities_second_line">
<i class="icon-calendar icon-white"></i> Event deleted later. Event {{displayActivityFieldText ../custom3}} modified.
</span>
{{/get_event_rescheduled}}
{{/if}}
<span class="activities_second_line">
 {{#if related_contact_ids}} Event related to {{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}.{{/if}}  
</span>
{{/if_equals}}
{{/if_equals}}


<!-- end event condition-->

<!-- start of contact condition-->
{{#if_equals "CONTACT" entity_type}}

{{#if_equals "CONTACT_CREATE" activity_type}}
Created a new Contact {{#if this.entityObject}}<a href="#contact/{{entity_id}}" >{{label}}</a>{{else}}'{{label}}'{{/if}} <br/>	
<span class="activities_second_line">
 <i class="icon-user"></i>{{#unless this.entityObject}}Contact deleted later. {{/unless}}Contact assigned to {{custom1}}.
</span>  
{{/if_equals}}

{{#if_equals "COMPANY_CREATE" activity_type}}
Created a new Company {{#if this.entityObject}}<a href="#contact/{{entity_id}}" >{{label}}</a>{{else}}'{{label}}'{{/if}} <br/>	
<span class="activities_second_line">
 <i class="icon-user"></i>{{#unless this.entityObject}}Company deleted later. {{/unless}} Company assigned to {{custom1}}.
</span>  
{{/if_equals}}

{{#if_equals "CONTACT_DELETE" activity_type}}
Deleted Contact '{{label}}'
{{/if_equals}}
{{#if_equals "COMPANY_DELETE" activity_type}}
Deleted Company '{{label}}'
{{/if_equals}}

{{#if_equals "CONTACT_IMPORT" activity_type}}
Imported {{custom1}} Contact(s) <br/>	
<span class="activities_second_line">
{{#if custom2}}<i class="icon-user"></i> {{custom2}} contact(s) were updated during the import.{{/if}} 
</span>  
{{/if_equals}}

 {{#if_equals "COMPANY_IMPORT" activity_type}}
Imported {{custom1}} Companies <br/>	
<span class="activities_second_line">
{{#if custom2}}<i class="icon-user"></i> {{custom2}} companies were updated during the import.{{/if}} 
</span>  
{{/if_equals}}

{{#if_equals "CONTACT_EXPORT" activity_type}}
Exported {{custom1}} Contact(s) <br/>	
{{/if_equals}}

{{#if_equals "COMPANY_EXPORT" activity_type}}
{{#if_equals "1" custom1}}
Exported {{custom1}} Company <br/>
{{else}}
Exported {{custom1}} Companies <br/>
{{/if_equals}}	
{{/if_equals}}

{{#if_equals "CONTACT_OWNER_CHANGE" activity_type}}
Changed owner for Contact {{#if this.entityObject}}<a href="#contact/{{entity_id}}" >{{label}}</a>{{else}}'{{label}}'{{/if}} <br/>	
<span class="activities_second_line">
<i class="icon-user icon-white"></i>{{#unless this.entityObject}} Contact deleted later. {{/unless}} Contact assigned to {{custom1}}.
</span>
{{/if_equals}}

  {{#if_equals "NOTE_ADD" activity_type}}
Added note to Contact {{#if this.entityObject}}<a href="#contact/{{entity_id}}" >{{label}}</a>{{else}}'{{label}}'{{/if}} <br/>
<span class="activities_second_line">
 <i class="icon-pencil"></i>{{#unless this.entityObject}} Contact deleted later. {{/unless}} {{custom1}} {{#if custom2}}- {{custom2}}{{/if}}
</span>  
{{/if_equals}}


{{#if_equals "EMAIL_SENT" activity_type}}
Sent email to {{#if this.entityObject}}<a href="#contact/{{entity_id}}" >{{label}}</a>{{else}}'{{label}}'{{/if}} <br/>
<span class="activities_second_line"> 
<i class="icon-envelope-alt"></i>{{#unless this.entityObject}}Contact deleted later. {{/unless}} Email subject - <a href="" class="email-details" data="{{id}}">{{custom3}}</a> 
</span>
{{/if_equals}}

{{#if_equals "BULK_ACTION" activity_type}}

{{#if_equals "ADD_TAG" custom1}}
Added  tag to {{custom3}} Contacts<br/>
<span class="activities_second_line">
<i class="icon-tag"></i> {{removeDoubleCoutes custom2}} added.
</span>
{{/if_equals}}


{{#if_equals "REMOVE_TAG" custom1}}
 Removed tag from {{custom3}} Contacts<br/>
<span class="activities_second_line">
<i class="icon-tag"></i> {{removeDoubleCoutes custom2}} removed.
</span>
{{/if_equals}}


{{#if_equals "ASIGN_WORKFLOW" custom1}}
{{#if_equals "1" custom3}}
		Added {{custom3}} Contact to Campaign<br/>
<span class="activities_second_line">   
<i class="icon-sitemap icon-white"></i> {{custom2}}. 
</span>
{{else}}
Added {{custom3}} Contacts to Campaign <br/>
<span class="activities_second_line">
<i class="icon-sitemap icon-white"></i> {{custom2}}.
</span> 
{{/if_equals}}
{{/if_equals}}

{{#if_equals "SEND_EMAIL" custom1}}

{{#if_equals "contacts" label}}	

{{#if_equals "1" custom3}}	
Sent a email to {{custom3}} Contact<br/>
<span class="activities_second_line">
<i class="icon-envelope-alt"></i> Email subject- <a href="" class="email-details" data={{id}}>{{custom4}}</a>
</span> 
{{else}}
Sent a bulk email to {{custom3}} Contacts<br/>
<span class="activities_second_line">
<i class="icon-envelope-alt"></i> Email subject- <a href="" class="email-details" data={{id}}>{{custom4}}</a> 
</span>
{{/if_equals}}
{{else}}
{{#if_equals "1" custom3}}
Sent a email to {{custom3}} company<br/>
<span class="activities_second_line">
<i class="icon-envelope-alt"></i> Email subject - <a href="" class="email-details" data={{id}}>{{custom4}}</a>
</span>
{{else}}
Sent a bulk email to {{custom3}} Companies<br/>
<span class="activities_second_line">
<i class="icon-envelope-alt"></i> Email subject - <a href="" class="email-details" data={{id}}>{{custom4}}</a>
</span>
{{/if_equals}}
{{/if_equals}}
{{/if_equals}}

{{#if_equals "CHANGE_OWNER" custom1}}

{{#if_equals "contacts" label}}	

{{#if_equals "1" custom3}}
Changed owner for {{custom3}} Contact <br/>
<span class="activities_second_line">
<i class="icon-user icon-white"></i> Contact assigned to {{custom2}}.
</span>
{{else}}
	Changed owner for {{custom3}} Contacts <br/>
<span class="activities_second_line">
<i class="icon-user icon-white"></i> Contacts assigned to {{custom2}}.
</span>
{{/if_equals}}
{{else}}

{{#if_equals "1" custom3}}
Changed owner for {{custom3}} Company <br/>
<span class="activities_second_line">
<i class="icon-user icon-white"></i> Company assigned to {{custom2}}.
</span>
{{else}}
	Changed owner for {{custom3}} Companies <br/>
<span class="activities_second_line">
<i class="icon-user icon-white"></i> Companies assigned to {{custom2}}.
</span>
{{/if_equals}}

{{/if_equals}}
{{/if_equals}}

{{#if_equals "DELETE" custom1}}
	
{{#if_equals "contacts" label}}	

{{#if_equals "1" custom3}}
		Deleted {{custom3}} Contact
{{else}}	
    Deleted {{custom3}} Contacts
{{/if_equals}}
{{else}}
{{#if_equals "1" custom3}}
		Deleted {{custom3}} company
{{else}}	
    Deleted {{custom3}} Companies
{{/if_equals}}
{{/if_equals}}
{{/if_equals}}


{{/if_equals}}


{{#if_equals "CAMPAIGN" activity_type}}
Added {{#if this.entityObject}}<a href="#contact/{{entity_id}}" >{{label}}</a>{{else}}'{{label}}'{{/if}} to Campaign <br/>
<span class="activities_second_line">  
<i class="icon-sitemap icon-white"></i> {{#unless this.entityObject}}Contact deleted later. {{/unless}} {{custom2}}.
</span>
{{/if_equals}}

{{#if_equals "TAG_ADD" activity_type}}
Added a Tag to Contact {{#if this.entityObject}}<a href="#contact/{{entity_id}}" >{{label}}</a>{{else}}'{{label}}'{{/if}}<br/>
<span class="activities_second_line">
<i class="icon-tag icon-white"></i> {{removeDoubleCoutes custom1}} added.{{#unless this.entityObject}} Contact deleted later. {{/unless}}
</span>
{{/if_equals}}

{{#if_equals "TAG_REMOVE" activity_type}}
Removed a Tag from Contact {{#if this.entityObject}}<a href="#contact/{{entity_id}}" >{{label}}</a>{{else}}'{{label}}'{{/if}} <br/>
<span class="activities_second_line">
<i class="icon-tag icon-white"></i> {{removeDoubleCoutes custom1}} removed.{{#unless this.entityObject}} Contact deleted later. {{/unless}}
</span>
{{/if_equals}}

{{#if_equals "CALL" activity_type}}
{{#if_equals "incoming" custom2}}
Call from {{#if entity_id}}<a href="#contact/{{entity_id}}">{{label}}</a>{{else}}'{{label}}'{{/if}}<br/>
<span class="activities_second_line">
<i class="icon-phone"></i> {{callActivityFriendlyStatus custom3 custom2}}{{#if custom4}}{{secondsToFriendlyTime custom4}}{{/if}} (<span style="text-transform: capitalize;">{{custom1}}</span>)
</span>
{{/if_equals}}
{{#if_equals "outgoing" custom2}}	
Called {{#if entity_id}}<a href="#contact/{{entity_id}}">{{label}}</a>{{else}}'{{label}}'{{/if}}<br/>
<span class="activities_second_line">
<i class="icon-phone"></i> {{callActivityFriendlyStatus custom3 custom2}}{{#if custom4}}{{secondsToFriendlyTime custom4}}{{/if}} (<span style="text-transform: capitalize;">{{custom1}}</span>)
</span>
{{/if_equals}}
{{/if_equals}}

{{/if_equals}}
<!-- end of contact-->
<!-- document added startig-->
{{#if_equals "DOCUMENT" entity_type}}
{{#if_equals "DOCUMENT_ADD" activity_type}}
{{#if_equals "1" custom2}}
   Added Contact to Document {{#if entityObject}}<a href="{{custom1}}" target="_blank">{{label}}</a>{{else}}'{{label}}'{{/if}}<br/>
<span class="activities_second_line">   
<i class="icon-file icon-white"></i> {{#unless entityObject}}Document deleted later. {{/unless}}{{#if related_contact_ids}}{{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}} added to Document.{{/if}}
</span>
{{else}} 
{{#if_equals "no related contacts" custom3}}
   Added Document {{#if entityObject}}<a href="{{custom1}}" target="_blank">{{label}}</a>{{else}}'{{label}}'{{/if}}<br/>
<span class="activities_second_line">   
<i class="icon-file icon-white"></i> {{#unless entityObject}}Document deleted later. {{/unless}}{{#if entityObject}}Document type - {{network entityObject.network_type}}{{/if}}
</span>
{{else}}
	 Added Contacts to Document {{#if entityObject}}<a href="{{custom1}}" target="_blank">{{label}}</a>{{else}}'{{label}}'{{/if}} <br/>
<span class="activities_second_line">
<i class="icon-file icon-white"></i> {{#unless entityObject}}Document deleted later. {{/unless}}{{#if related_contact_ids}}{{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}} added to Document.{{/if}}
</span>
{{/if_equals}} 
{{/if_equals}}	
{{/if_equals}}


{{#if_equals "DOCUMENT_REMOVE" activity_type}}

{{#if_equals "1" custom2}}
   Removed Contact from Document {{#if entityObject}}<a href="{{custom1}}" target="_blank">{{label}}</a>{{else}}'{{label}}'{{/if}}<br/>
<span class="activities_second_line"> 
  <i class="icon-file"></i> {{#unless entityObject}}Document deleted later.{{/unless}}{{#if related_contact_ids}}{{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}} removed from Document.{{/if}} 
</span>
{{else}} 
 Removed Contacts from Document {{#if entityObject}}<a href="{{custom1}}" target="_blank">{{label}}</a>{{else}}'{{label}}'{{/if}}<br/>
<span class="activities_second_line">
<i class="icon-file"></i> {{#unless entityObject}}Document deleted later. {{/unless}}{{#if related_contact_ids}}{{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}} <a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}} removed from Document.{{/if}}
</span>
{{/if_equals}}	
{{/if_equals}}


{{#if_equals "BULK_DELETE" activity_type}}
  {{#if_equals "1" custom1}}
  Deleted {{custom1}} Document <br/>
<span class="activities_second_line">
 <i class="icon-file icon-white"></i> {{custom2}}.
</span>
{{else}} 
Deleted  {{custom1}} Documents<br/>
<span class="activities_second_line">
<i class="icon-file icon-white"></i> {{custom2}}.
 </span>
{{/if_equals}}	
{{/if_equals}}
{{/if_equals}}

{{#if_equals "CALL" activity_type}}
{{#unless entity_type}}
{{#if_equals "incoming" custom2}}
Call from {{#if entity_id}}<a href="#contact/{{entity_id}}">{{label}}</a>{{else}}{{label}}{{/if}}<br/>
<span class="activities_second_line">
<i class="icon-phone"></i> {{callActivityFriendlyStatus custom3 custom2}}{{#if custom4}}{{secondsToFriendlyTime custom4}}{{/if}} (<span style="text-transform: capitalize;">{{custom1}}</span>)
</span>
{{/if_equals}}
{{#if_equals "outgoing" custom2}}	
Called {{#if entity_id}}<a href="#contact/{{entity_id}}">{{label}}</a>{{else}}{{label}}{{/if}}<br/>
<span class="activities_second_line">
<i class="icon-phone"></i> {{callActivityFriendlyStatus custom3 custom2}}{{#if custom4}}{{secondsToFriendlyTime custom4}}{{/if}} (<span style="text-transform: capitalize;">{{custom1}}</span>)
</span>
{{/if_equals}}
{{/unless}}
{{/if_equals}}

<!-- starting of campaign status-->

{{#if_equals "CAMPAIGN" entity_type}}

{{#if_equals "CAMPAIGN_CREATE" activity_type}}
Created a Campaign {{#if this.entityObject}} <a href="#workflow/{{entity_id}}">{{label}}</a>{{else}}'{{label}}'{{/if}}<br/>	
<span class="activities_second_line">
 {{#unless this.entityObject}}<i class="icon-sitemap icon-white"></i> Campaign deleted later. {{/unless}}
</span>  

{{/if_equals}}

{{#if_equals "CAMPAIGN_EDIT" activity_type}}
Modified a Campaign {{#if this.entityObject}} <a href="#workflow/{{entity_id}}">{{label}}</a>{{else}}'{{label}}'{{/if}}<br/>	
<span class="activities_second_line">
 {{#unless this.entityObject}}<i class="icon-sitemap icon-white"></i> Campaign deleted later. {{/unless}}
</span>  
{{/if_equals}}


{{#if_equals "CAMPAIGN_DELETE" activity_type}}
Deleted Campaign '{{label}}'
{{/if_equals}}

{{#if_equals "BULK_DELETE" activity_type}}
  {{#if_equals "1" custom1}}
  Deleted {{custom1}} Campaign <br/>
<span class="activities_second_line">
 <i class="icon-sitemap icon-white"></i> Campaign {{custom2}} deleted.
</span>  
{{else}} 
Deleted  {{custom1}} Campaigns<br/>
<span class="activities_second_line">
 <i class="icon-sitemap icon-white"></i> Campaign {{custom2}} deleted.
</span>  
{{/if_equals}}	
{{/if_equals}}

{{/if_equals}}

<!-- ending of campaign-->


	</div>
<div>	
		<small class="edit-hover pull-right activity_time" > 
			<time class="pull-right" datetime="{{epochToHumanDate "" time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy h:MM TT" time}}</time>
		</small>
</div>
</div>
<div class="clearfix"></div>

</script>
<script id="activity-list-header-template" type="text/html">
<div class="row" id="activity_header">
    <div class="span12">
        <div class="page-header">
            <h1 class="activity-heading"><span>Activities</span>&nbsp;<small class="activity-sub-heading" ></small>&nbsp;<small class="activity-user" ></small></h1>
		
		<div class="btn-group pull-right type-task-button" style="cursor:pointer;margin-right:15px;top: -28px;">
                <div class="btn selected_name" id="selectedentity_type">All Activities</div>
                <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                <span class="caret"></span>
                </a>
                <ul class="dropdown-menu" id="entity_type">
					 <li><a href="">All Activities</a></li>
                     <li><a href="TASK">Tasks</a></li>
					{{#hasMenuScope 'DEALS'}}
                     	<li><a href="DEAL">Deals</a></li>
					{{/hasMenuScope}}
					 <li><a href="EVENT">Events</a></li>
					 <li><a href="CONTACT">Contacts</a></li>
					{{#hasMenuScope 'DOCUMENT'}}
 						<li><a href="DOCUMENT">Documents</a></li>
					{{/hasMenuScope}}
					<li><a href="CALL">Calls</a></li>                    
                </ul>
            </div>            
		<div class="btn-group pull-right activity-log-button" style="cursor:pointer;margin-right:15px;top: -28px;">
                <div class="btn selected_name" id="selectedusername">All Users</div>
                <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                <span class="caret"></span>
                </a>
                <ul class="dropdown-menu" id="user-select"></ul>
            </div>

            <div id="activities_date_range" class="btn-group pull-right activity-date-filter" style="cursor:pointer;margin-right:15px;top: -28px;">
               <i class="icon-calendar icon-large"></i>
                <span id="range">Filter by date</span>
                <span class="caret" style="margin-top: 6px; margin-left: 4px;"></span>
              
            </div>
            
            
          

            
        </div>
    </div>

    
</div>

<div class="row" id="activity_model">
<div class="span12">
<div id="activity-list-based-condition"></div>
</div>
</div>
</script><div class="modal hide fade" id="updateActivityModal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-edit"></i>&nbsp;Edit Event</h3>
    </div>
    <div class="modal-body">
        <div id="relatedevent">	 	
            <!--Event form  -->
            <form id="updateActivityForm" name="updateActivityForm" method="post">
                <fieldset>
                    <input name="id" type="hidden" value="{{id}}" /> 
                    <input type="hidden"  name="type" id="type" value="{{type}}"/>
                    <div class="row">
                        <div id="addEvent" class="control-group span3">
                            <label class="control-label"><b>Event Name: </b><span class="field_req">*</span></label>
                            <div class="controls">
                                <input id="title" placeholder="Name of the event" type="text" name="title" class="required" />
                            </div>
                        </div>
                        <div class="span2 control-group">
                            <label for="priority_type" class="control-label"><b>Priority: </b></label>
                            <div class="controls">
                                <span class="input ">
                                    <select name="color" id="color" size="1" class="input-small">
                                        <option value="red">High</option>
                                        <option value="#36C">Normal</option>
                                        <option value="green">Low</option>
                                    </select>
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                       <div class="control-group span3">
							<label class="control-label">Owner<span class="field_req">*</span></label>
							<div class="controls" id="event-owners">
								<select id="event-owners-list" class="required" name="owner_id"></select>
								<img class="loading-img" src="img/21-0.gif"></img>
							</div>
					   </div>
                     </div>
                    
                    <div class="row">
                        <div class="control-group span3">
                            <label class="control-label"><b>Start Date: </b><span class="field_req">*</span></label>
                            <div class="controls">
                                <input type="text" name="start" placeholder="mm/dd/yyyy" id="update-event-date-1" class="required date" />							
                            </div>
                        </div>
                        <div class="control-group span2">
                            <label class="control-label"><b>Start Time: </b><span class="field_req">*</span></label>
                            <div class="controls">
                                <input type="text" name="start_time" class="update-start-timepicker timepicker required" id="update-event-time-1" style="width:65px" placeholder="time" />		
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="control-group span3">
                            <label class="control-label"><b>End Date: </b><span class="field_req">*</span></label>
                            <div class="controls">
                                <input type="text" name="end" placeholder="mm/dd/yyyy" id="update-event-date-2" class="required date" />									
                            </div>
                        </div>
                        <div class="control-group span2">
                            <label class="control-label"><b>End Time: </b><span class="field_req">*</span></label>
                            <div class="controls">							
                                <input type="text" name="end_time" class="update-end-timepicker timepicker required" id="update-event-time-2" style="width:65px" placeholder="time" /><br />		
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="span5 invalid-range">
                        </div>
                    </div>
                    <div class="control-group" style="margin-bottom: 0px;">
                        <div class="controls">
                        	<label class="checkbox" style="display:inline-block; cursor:pointer;">
                            	<input type="checkbox" name="allDay" id="allDay" />						
                            	<div style="display:inline-block;margin-top:1px;">All day event</div>
                        	</label>
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label"><b>Related To</b></label>
                        <div class="controls">
                            <div>
                                <div class="pull-left">
                                    <ul name="contacts" class="contacts tags tagsinput"></ul>
                                </div>
                                <input type="text" id="event_related_to" class="typeahead typeahead_contacts" data-provide="typeahead" data-mode="multiple" size="40" />
                            </div>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>
    </div>
    <div class="modal-footer">
        <a href="#" class="btn btn-danger" id="event_delete">Delete</a>
        <a href="#" class="btn btn-primary" id="update_event_validate">Update</a>&nbsp;
        <span class="save-status"></span>
    </div>
</div><script id="admin-tag-management-collection-template" type="text/html">
<div id='tags'>
	{{#tagslist this}}
	{{/tagslist}}
</div>
</script>

<script id="tag-management-collection-template" type="text/html">
<div class="row">
	<div class='span8 well'>
    		<legend style="margin-bottom:0px;"><div style="display:inline;line-height:43px">Tag Management</div> <div class="right" style="font-size:small"><a href="#" id="add-new-tag" class="btn"><i class="icon-plus-sign" ></i> Add Tag</a></div> <div id="new_tag_field_block" style="display:inline;float:right;display:none"><input id="new_tag" type="text" style="margin-right:10px" placeholder="New Tag"/><a class="btn" style="margin-top:2px;vertical-align:top" id="add_new_tag" href="#">Add</a></div></legend>
			<div class="alert alert-danger m-t" role="alert">
  				Important: We have made some changes to Tag management. Tag names can no longer have special characters except space and underscore. Please go through your tags below and rename them accordingly.
			</div>
    		<div class="control-group">  
{{tagManagementCollectionSetup this}}	 
                    <div id="milestone-values" class="milestone-ul-list1">
						<ul class="tags-management tag-cloud" id="tag-management-model-list" style='padding:1px;list-style:none;'></ul>
                    </div>
<div class="clearfix"></div>
					

    		</div> 
    </div>
</div>
</script>

<script id="tag-management-model-template1" type="text/html">
<span>

<div id="tag-solid-state">
	<span style="white-space: nowrap; text-overflow: ellipsis; ; overflow: hidden; width: 10em; display: inline-block;">

<a class="anchor" href="#tags/{{this.tag}}">{{this.tag}}</a> 

</span>
<span id="actions" class="hide">
	<span><a class="close delete right" href="#">&times</a></span>
	<span><a class="edit right" href="#"><i class="icon-pencil"></i></a></span>
<span>
</div>
<div class="hide" id="editing">
	<input type="text" class="edit-input input-medium" value='{{this.tag}}' >  
	<a class="btn" id="add_milestone" href="#">Add</a>
</div>
</span>
</script>

<script id="tag-management-model-template" type="text/html">
<span>

<div id="tag-solid-state">
<a class="anchor" style="vertical-align:middle;font-size:13px;padding:1px 5px;display:block;white-space: nowrap; text-overflow: ellipsis; overflow: hidden; max-width: 9em; display: inline-block;" href="#tags/{{this.tag}}" >{{this.tag}}</a>  

<span id="actions" class="hide">
<div class="pull-right tag-management-actions">
	<a class="details" href="#"><i class="icon-file-text"></i></a>
	<a class="edit" href="#" ><i class="icon-pencil"></i></a>
	<a class="delete" href="#" ><i class="icon-trash"></i></a>
</div>
<div class="clearfix"></div>
</div>
<div class="hide" id="editing" style="width:200px;padding:0px 20px 5px 9px;float:left">
	<input type="text" class="edit-input " value='{{this.tag}}' style="width:200px;float: left;" >  
	
</div>
</span>
</script>



<script id="tag-cloud-collection-template" type="text/html">
<div class="row">
	<div class='span8 well'>

    		<legend>Tag</legend>
                    <div id="tag-cloud" style="min-height:200px">
						<ul id="tag-cloud-model-list" style='padding:1px;list-style:none;min-height:200px'></ul>
                    </div>
    </div>
</div>
</script>

<script id="tag-cloud-model-template" type="text/html">

<!--
<div id="tag-solid-state" style="width:15em;">
	<a href="#" id="{{tag}}" data-toggle="popover" title="" data-content="And here's some amazing content. It's very engaging. right?" data-original-title="A Title"><span style="white-space: nowrap; text-overflow: ellipsis; ; overflow: hidden; width: 12em; display: inline-block;">{{this.tag}} </span></a>
<span id="actions" class="hide">
	<span><a class="delete right" href="#">&times</a></span>
	<span><a class="edit right" href="#"><i class="icon-pencil"></i></a></span>
<span>
</div>
<div class="hide" id="editing">
	<input type="text" class="edit-input input-medium" value='{{this.tag}}' >  
</div>

-->
<span>
<a href="#" class="tag1" trigger="click" data-toggle="popover" title="" data-content="And here's some amazing content. It's very engaging. right?" data-original-title="A Title"><span style="white-space: nowrap; text-overflow: ellipsis; ; overflow: hidden; width: 12em; display: inline-block" count="{{availableCount}}">{{tag}}</a>
<span id="actions" class="hide">
	<span><a class="delete right" href="#">&times</a></span>
	<span><a class="edit right" href="#"><i class="icon-pencil"></i></a></span>
</span>
</span>
<span>
<div class="hide" id="editing">
	<input type="text" class="edit-input input-medium" value='{{this.tag}}' >  
</div>
</span>  

</script>
<script id="calendar-template" type="text/html">
<div class="row-fluid">
    <div class="span12">
        <div class="page-header">
            <h1>Calendar <small></small></h1>
            <div class="btn-group right" style="position:relative;top:-30px;">
                <a class="btn add-event" data-toggle="modal"><i class="icon-plus-sign"></i> Add Event</a>
                <a class="btn dropdown-toggle" data-toggle="dropdown">
                <span class="caret"></span>
                </a>             
                <ul class="dropdown-menu pull-right" style="cursor:pointer;">
                    <li><a data-toggle="modal" class="add-event">Add Event</a></li>
                    <li><a data-toggle="modal" class="add-task">Add Task</a></li>
                </ul>
            </div>
        	<div class="btn-group right" id=""	style="display: inline; top: -30px;margin-right: 20px;margin-left: 20px;">
					<div class="btn"><i class="icon-list" style="margin-right:3px"></i></div>
					<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
						<span class="caret"></span>
					</a>
					<ul class="dropdown-menu pull-right">
					  <li><a href="#" class="c_list">List</a></li>
						<li><a href="#" class="c_cal">Calendar</a></li>
					</ul>
			</div>
			<div id="event-list-filters" class="btn-group right" style="display: inline; top: -30px;margin-left:20px;">
				 <img class="loading_img" style="padding-right:5px;" height="32px" width="32px" src= "img/21-0.gif"></img>
			</div>
        </div>
    </div>
</div>
<div class="row-fluid">
    <div class="span3">
		<div class="data-block todo-block" style="margin-bottom: 5px;">
        	<div class="data-container" style="padding-bottom: 20px;">
            	<div id="tasks"></div>
        	</div>
		</div><br/><br/>
{{#isAllowedInCurrentPlan "online_appointment"}}
	<div id="appointment-schedular" ><a class="left" href="#scheduler-prefs"  id="show-schedule-url1"><i class="icon-time"></i> Online Appointment Scheduling</a></div><br/>
{{/isAllowedInCurrentPlan}}

<div><a class="left" href="#icalModal" data-toggle="modal" id="subscribe-ical"><i class="icon-calendar"></i> Subscribe to iCalendar Feed</a></div>
		<!--<div>
   			 <a href="#tasks" class="tasks-table" id="tasks-list">All Tasks</a>
    		 <div class="right add-task"><a href="#"><i class="icon-plus" /> Add New</a></div>
		</div>-->
    </div>
    <div class="span9">
        <div id="calendar_event">
           <ul class="nav nav-tabs" id="event_tab">
            <li class="active"><a href="#agile" data-toggle="tab" >Agile Events</a></li>
            <li><a href="#google" data-toggle="tab">Google Events</a></li>
            </ul>
        </div>
           <div class="tab-content">
           <div class="tab-pane active" id="agile"></div>
          <div class="tab-pane" id="google"></div>
          </div>
          <div id="agile_event_list"><h2> Event List</h2>
         <div  id="agile_event" style="margin-top: 6px;"></div>
          </div>

        <br />
        <a class="right" href="#icalModal" data-toggle="modal" id="subscribe-ical" style="display:none;"><i class="icon-calendar"></i> Subscribe to iCalendar Feed</a>
    </div>
</div>


</script>

<script id="event-filter-template" type="text/html">
<div class="widget-box" id="widget-box">
	<div id="event-filters" class="btn-group helpdesk-filters">
		<a id="event-filter-button" class="btn dropdown-toggle" title="Filters">
			<i id="icon-filter" class="icon-filter icon-white"></i>
		</a>
		<div class="dropdown-menu pull-right" id="filter_options"
			style="margin-top: 5px; padding: 0px; background-color: #cad2dd; right:-10px;">
			<div id="filter_list">
				<div class="arrow"></div>
				<div id="popover-content" class="popover-content">
					<div id="popup_header" class="popup_header" style="padding-bottom: 5px;">
						<span id="filters-heading" class="heading" style="font-size: 11px;">Filters</span> <span
							id="clear-event-filters" class="btn btn-small pull-left"
							style="font-size: 9px; font-weight: bold; color: #475b6f; text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5); padding: 2px 6px 2px 6px;">Clear</span>
						<span id="event-filter-validate" class="btn btn-primary btn-small pull-right save"
							style="font-size: 9px; font-weight: bold; color: #fff; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.3); padding: 2px 6px 2px 6px;">Done</span>
					</div>
					<style>
						.ticket-filter-container select, .ticket-filter-container input{
							width: 100%;
							height: 23px;
							font-size: 10px;
						}
						.ticket-filter-container label{
							font-size: 11px;
							width: 170px;
							height: 20px;
							margin-bottom: 0;
						}
						.row-filter{
							padding-top: 4px !important;
						}
					</style>
					<div id="deal-filter-container" class="deal-filter-container inner-box">
		<form id="eventsFilterForm" name="dealsFilterForm" role="form" style="margin-bottom:0px;">
			<fieldset>
				<div class="control-group row-filter">
					<label class="control-label"><b>Owner </b> 
					</label>
					<div class="controls" id="owners">
						<select id="event-owner" name="owner_id">
							<option value="all">Any</option>
						</select>
					</div>
				</div>
				<div class="control-group row-filter calendar-view">
					<label class="control-label"><b>Type </b>
					</label>
					<div class="controls" id="type_div">
						<span><select id="event_type" name="type">
								<option value="">All</option>
								<option value="google">Google</option>
								<option value="agile">Agile</option>
						</select></span>
					</div>
				</div>
				<div class="control-group row-filter list-view">
					<label class="control-label"><b>Time </b>
					</label>
					<div class="controls" id="time_div">
						<span><select id="event_time" name="time">
								<option value="">All Events</option>
								<option value="future">Future Events</option>
						</select></span>
					</div>
				</div>
			</fieldset>
		</form>
		<!-- form id="dealsCustomFilterForm" name="dealsCustomFilterForm" role="form">
			<fieldset></fieldset>
		</form -->
					</div>
					<!-- End of filters-container -->
				</div>
				<!-- popover-content -->
			</div>
		</div>
		<!-- dropdown-menu class div-->
	</div>
</script><!-- Edit cases modal -->
<div class="modal hide fade cases-modal" id="casesUpdateModal">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3><i class="icon-edit"></i> Edit Case</h3>
	</div>
	<div class="modal-body">
		<form id="casesUpdateForm" name="casesUpdateForm" method="post">
			<fieldset>
				<input name="id" type="hidden"/>
				<div class="row-fluid">
					<div class="control-group span5">
						<label class="control-label"><b>Title </b><span
							class="field_req">*</span></label>
						<div class="controls">
							<span><input id="title" name="title" type="text"
								class=" required" placeholder="Title of the Case" /></span>
						</div>
					</div>
					
				</div>
				<div class="row-fluid">
					<div class="control-group span5">
						<label class="control-label"><b>Owner </b><span
							class="field_req">*</span></label>
						<div class="controls" id="owners">
							<select id="owners-list" class="required" name="owner_id"></select>
						</div>
					</div>
					
					<div class="control-group span5"  style="margin-left: 30px;">
						<label class="control-label"><b>Status </b><span class="field_req">*</span></label>
						<div class="controls" id='status'>
							<span>
								<select id="status-list" class="required" name="status">
									<option value='OPEN'>Open</option>
									<option value='CLOSE'>Closed</option>
								</select>
							</span>
						</div>
					</div>
				</div>
								
				<div class="control-group">
					<label class="control-label"><b>Related Contacts </b></label>
					<div class="controls" id="contactTypeAhead">
						<div>
							<div class="pull-left">
								<ul name="related_contacts_id" class="contacts tagsinput tags"></ul>
							</div>
							<input type="text" id="contacts-typeahead-input"
								placeholder="Contact Name" class="typeahead typeahead_contacts"
								data-provide="typeahead" data-mode="multiple" />
						</div>
					</div>
				</div>
				<div id="custom-field-case"></div>
				<div class="control-group">
					<label class="control-label"><b>Description </b></label>
					<div class="controls" style="margin-right:10px;">
						<textarea id="description" name="description" rows="3" style='width:100%;'
							class="input" placeholder="Add Comment.."></textarea>
					</div>
				</div>
			</fieldset>
		</form>
	</div>
	<div class="modal-footer">
		<a href="#" class="btn btn-primary" id="cases_validate">Save
			Changes</a> <span class="save-status"></span>
	</div>
</div>
<!-- end cases edit modal --><script id="choose-avatar-images-modal-template" type="text/html">
		<tr>
			<td><a href="#"><img class="thumbnail" src="https://contactuswidget.appspot.com/images/pic.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/1.png" height="50" width="50" /></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/3.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/4.png" height="50" width="50"/></a></td>
		</tr>
		<tr>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/5.png" height="50" width="50"/></a></td>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/6.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/7.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/8.png" height="50" width="50"/></a></td>
		</tr>
		<tr>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/9.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/10.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/11.png" height="50" width="50"/></a></td>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/12.png" height="50" width="50"/></a></td>
		</tr>
        <tr>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/13.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/14.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/15.png" height="50" width="50"/></a></td>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/16.png" height="50" width="50"/></a></td>
		</tr>
         <tr>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/17.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/18.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/19.png" height="50" width="50"/></a></td>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/20.png" height="50" width="50"/></a></td>
		</tr>
        <tr>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/21.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/22.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/23.png" height="50" width="50"/></a></td>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/24.png" height="50" width="50"/></a></td>
		</tr>
        <tr>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/25.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/26.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/27.png" height="50" width="50"/></a></td>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/28.png" height="50" width="50"/></a></td>
		</tr>
       	<tr>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/29.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/30.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/31.png" height="50" width="50"/></a></td>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/32.png" height="50" width="50"/></a></td>
		</tr>
        <tr>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/33.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/34.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/35.png" height="50" width="50"/></a></td>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/36.png" height="50" width="50"/></a></td>
		</tr>
        <tr>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/37.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/38.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/39.png" height="50" width="50"/></a></td>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/40.png" height="50" width="50"/></a></td>
		</tr>
        <tr>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/41.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/42.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/43.png" height="50" width="50"/></a></td>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/44.png" height="50" width="50"/></a></td>
		</tr>
        <tr>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/45.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/46.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/47.png" height="50" width="50"/></a></td>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/48.png" height="50" width="50"/></a></td>
		</tr>
        <tr>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/49.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/50.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/51.png" height="50" width="50"/></a></td>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/52.png" height="50" width="50"/></a></td>
		</tr>
        <tr>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/53.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/54.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/55.png" height="50" width="50"/></a></td>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/56.png" height="50" width="50"/></a></td>
		</tr>
        <tr>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/57.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/58.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/59.png" height="50" width="50"/></a></td>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/60.png" height="50" width="50"/></a></td>
		</tr>
        <tr>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/61.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/62.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/63.png" height="50" width="50"/></a></td>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/64.png" height="50" width="50"/></a></td>
		</tr>
        <tr>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/65.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/66.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/67.png" height="50" width="50"/></a></td>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/68.png" height="50" width="50"/></a></td>
		</tr>
        <tr>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/69.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/70.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/71.png" height="50" width="50"/></a></td>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/72.png" height="50" width="50"/></a></td>
		</tr>
        <tr>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/73.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/74.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/75.png" height="50" width="50"/></a></td>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/76.png" height="50" width="50"/></a></td>
		</tr>
        <tr>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/77.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/78.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/79.png" height="50" width="50"/></a></td>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/80.png" height="50" width="50"/></a></td>
		</tr>
        <tr>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/81.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/82.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/83.png" height="50" width="50"/></a></td>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/84.png" height="50" width="50"/></a></td>
		</tr>
        <tr>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/85.png" height="50" width="50"/></a></td>
            <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/86.png" height="50" width="50"/></a></td>
			<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/87.png" height="50" width="50"/></a></td>
		    <td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/88.png" height="50" width="50"/></a></td>
		</tr>
</script><script id="chrome-extension-template" type="text/html">
    <div id="chrome_extension" class="chrome-extension-noty">
      <div class="sticky-noty">
       <span id="dismiss" class="close-noty"><a title="dismiss this notification" style="text-decoration:none;">x</a></span>
        Chrome extension for Agile CRM is now available.
        <a id="chrome_install_button" class="btn anchor-link" style="margin-top: -5px;font-weight: 500;">Get It Now</a> 
        <img class="loading" id="loading" style="display: none;height: 23px;" src= "/img/21-0.gif" />
      </div>
 </div>
</script><script id="contact-activity-list-log-collection-template" type="text/html">
{{#if this.length}}
	<section class="scroll">
		<form>
			<div class="ref-log">  
				<div id="today-heading" style="display: none" class="ref-head"><b >Today</b>	</div>
				<div id="today-contact-activity" style="display: inline;"></div>
				<div id="tomorrow-heading" style="display: none" class="ref-head"><b >Yesterday</b></div>
				<div id="tomorrow-contact-activity" style="display: inline;"></div>
				<div id="next-week-heading" style="display: none" class=""></div>
				<div id="next-week-contact-activity" style="display: inline;"></div>
				<div class="span12">
				</div>
			</div>
		</form>
</section>
</div>
<table class="table agile-ellipsis-dynamic onlySorting no-sorting ">
	<col width="0.2px">
	<col width="75%">
	<col width="25%">
	<!--<thead>
		<tr>
			<th></th>
			<th></th>
			<th></th>
		</tr>
	</thead>-->
	<tbody id="contact-activity-list-log-model-list"  class="contacts-model-list" route="contact/" style="overflow: scroll;overflow:hidden;">
	</tbody>
</table>

{{else}}

<div id="slate">
<div class="slate">
    <div class="slate-content">
				<div class="box-left">
 	           		<img alt="Clipboard" src="/img/clipboard.png">
				</div>
				<div class="box-right">
            <h3>No Contact activity recorded yet.</h3>
            <div class="text">Web and Campaign activity of your contacts is shown here.</div>
        </div>
    </div>
</div>
</div>

{{/if}}

</script>

<script id="contact-activity-list-log-model-template" type="text/html">

<td></td>
<td>
<div class="pos-rlt data" data= "{{contact.id}}" >
	<div style="margin-right:15px;" class="pull-left">
		{{#if contact}}
			<img class="thumbnail img-inital" data-name="{{dataNameAvatar contact.properties}}" src="{{gravatarurl contact.properties 40}}"  width="40px" height="40px" style="display:inline; width:40px; height:40px; " />
		{{else}}
			<img class="thumbnail img-inital" data-name="{{dataNameAvatar contact.properties}}" src="https://dpm72z3r2fvl4.cloudfront.net/css/images/user-default.png"  width="40px" height="40px" style="display:inline; width:40px; height:40px; " />
		{{/if}}
	</div>
	<div class="contact-activity-tag" >
		<div class="display:inline  "  >
{{#if_equals "null" log_time}}
	 {{#if contact}} 
		<b>{{getPropertyValue contact.properties "first_name"}} {{getPropertyValue contact.properties "last_name"}} </b>visited your website<br>
	{{else}}
		Someone visited your website<br>
	{{/if}}
	<span class="activities_second_line">  
		<i class="icon-link"></i> {{url}}
		{{#unless contact}}
		<br>
		This contact may have been deleted
		{{/unless}}

{{else}}
	{{#if_equals "EMAIL_OPENED" log_type}}
		{{#if contact}} 
			<b>{{getPropertyValue contact.properties "first_name"}} {{getPropertyValue contact.properties "last_name"}} </b>opened an email<br>
		{{else}}
		Someone opened an email<br>
		{{/if}}
		<span class="activities_second_line">  
		<i class="icon-envelope-alt"></i> {{message}} - {{campaign_name}}
		{{#unless contact}}
		<br>
		This contact may have been deleted
		{{/unless}}
	{{/if_equals}}
					
	{{#if_equals "EMAIL_CLICKED" log_type}}
		{{#if contact}} 
			<b>{{getPropertyValue contact.properties "first_name"}} {{getPropertyValue contact.properties "last_name"}}</b> clicked an email<br>
		{{else}}
			Someone clicked an email<br>
		{{/if}}
		<span class="activities_second_line">  
		<i class="icon-hand-up"></i> Link clicked in campaign {{campaign_name}}
		{{#unless contact}}
		<br>
		This contact may have been deleted
		{{/unless}}
	{{/if_equals}}
					
	{{#if_equals "UNSUBSCRIBED" log_type}}
		{{#if contact}} 
			<b>{{getPropertyValue contact.properties "first_name"}} {{getPropertyValue contact.properties "last_name"}} </b>
		{{else}}
			Someone 
		{{/if}}
		{{#if_equals "Unsubscribed from all campaigns" message}}
			unsubscribed from all campaigns
		{{else}} 
			unsubscribed from a campaign
		{{/if_equals}}<br>
		<span class="activities_second_line">  
		<i class="icon-minus-sign"></i> {{message}} - {{campaign_name}}
		{{#unless contact}}
		<br>
		This contact may have been deleted
		{{/unless}}
	{{/if_equals}}
	
	{{#if_equals "EMAIL_SPAM" log_type}}
		{{#if contact}} 
			<b>{{getPropertyValue contact.properties "first_name"}} {{getPropertyValue contact.properties "last_name"}}</b> marked an email as Spam<br>
		{{else}}
			Someone marked an email as Spam<br>
		{{/if}}
		<span class="activities_second_line">  
		<i class="icon-ban-circle"></i> Email {{get_subject message}}
		{{#unless contact}}
		<br>
		This contact may have been deleted
		{{/unless}}	
	{{/if_equals}}
		
	{{#if_equals "EMAIL_HARD_BOUNCED" log_type}}
		{{#if contact}} 
			<b>{{getPropertyValue contact.properties "first_name"}} {{getPropertyValue contact.properties "last_name"}}</b> - Email bounced<br>
			<span class="activities_second_line">  
			<i class="icon-undo"></i> There was a hard bounce for email  {{getPropertyValue contact.properties "email"}}
		{{else}}
			Someone's Email bounced<br>
			<span class="activities_second_line">  
			This contact may have been deleted
		{{/if}}
	{{/if_equals}}

	{{#if_equals "EMAIL_SOFT_BOUNCED" log_type}}
		{{#if contact}} 
			<b>{{getPropertyValue contact.properties "first_name"}} {{getPropertyValue contact.properties "last_name"}}</b> - Email bounced<br>
			<span class="activities_second_line">  
			<i class="icon-undo"></i> There was a soft bounce for email  {{getPropertyValue contact.properties "email"}}
		{{else}}
			Someone's Email bounced<br>
			<span class="activities_second_line">  
			This contact may have been deleted
		{{/if}}
	{{/if_equals}}
	
	{{#unless log_time}}
	{{#if contact}} 
		<b>{{getPropertyValue contact.properties "first_name"}} {{getPropertyValue contact.properties "last_name"}}</b> visited your website<br>
	{{else}}
		Someone visited your website.<br>
	{{/if}}
	<span class="activities_second_line">  
		<i class="icon-link"></i> {{url}}
	{{#unless contact}}
		<br>
		This contact may have been deleted
	{{/unless}}	

	{{/unless}}
{{/if_equals}}

	</span>
		</div>
	</div>
</div>
</td>
<td>
	<small class="edit-hover"> 
		<time class="pull-right" datetime="{{epochToHumanDate "" time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy h:MM TT" time}}</time>
	</small>
</td>

</script>

<script id="contact-activity-header-template" type="text/html">

<div class="row" id="contact_activity_header">
    <div class="span12">
        <div class="page-header">
            <h1 class="contact-activity-heading"><span>Contact Activities</span>&nbsp;<small class="contact-activity-sub-heading" ></small>&nbsp;<small class="contact-activity-user" ></small></h1>
		
			<div class="btn-group pull-right type-task-button" style="cursor:pointer;margin-right:15px;top: -28px;">
                <div class="btn selected_name" id ="log-filter-title">All Contact Activities</div>
                <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                <span class="caret"></span>
                </a>
                <ul class="dropdown-menu" >
					<li><a href="#contact-activities/All_Activities" >All Activities</a></li> 
					<li><a href="#contact-activities/Page_Views" >Page Views</a></li>
					<li><a href="#contact-activities/Email_Opened" >Email Opened</a></li>
					<li><a href="#contact-activities/Email_Clicked" >Email Clicked</a></li>
					<li><a href="#contact-activities/Unsubscribed">Unsubscribed</a></li>
					<li><a href="#contact-activities/Spam_Reports">Spam Reports</a></li>
					<li><a href="#contact-activities/Email_Hard_Bounced">Email Hard Bounced</a></li>
					<li><a href="#contact-activities/Email_Soft_Bounced">Email Soft Bounced</a></li>              
                </ul>
            </div>            
<!--
            <div id="contact_activities_date_range" class="btn-group pull-right contact-activity-date-filter" style="cursor:pointer;margin-right:15px;top: -28px;">
               <i class="icon-calendar icon-large"></i>
                <span id="range">Filter by date</span>
                <span class="caret" style="margin-top: 6px; margin-left: 4px;"></span>
            </div>
-->
        </div>
    </div>
</div>


<div class="row" id="contact_activity_model">
<div class="span12">
<div id="contact-activity-list-based-condition"></div>
</div>
</div>

</script><script id="send-email-template" type="text/html">
<div class="span10">
    <div class="well">
        <form id='emailForm' name="emailForm" class="form-horizontal" accept-charset="UTF-8">
            <fieldset>
				<legend>Send Email
                	<div style="float: right; line-height: 25px;">
						<select class="emailSelect" id='sendEmailSelect' title="Fill from Template" name="sendEmailSelect">
                			<option class="emailSelectOptions" value=""> - Fill from Template - </option>
                		</select>
                	</div>
                </legend>
                <input type="hidden" class="span4" name="from_name"/>
                <input type="hidden" class="span4" id="from" name="from_email"/>
				<a class="right" {{#isSafariBrowser}} style="margin-top: 5px;" {{else}} style="margin-top: -23px;" {{/isSafariBrowser}} href="#email-template-add">Create New Template</a><div class="clearfix"></div>
                <div id="bulk-count" style="margin-left: 17%; padding-bottom: 5px; display: none;"><p></p></div>
				<div class="control-group" style="display:none;">
                    <label class="control-label">From <span class="field_req">*</span></label>
                    <div class="controls">
                        <input type="text" placeholder="From Email" class="span4 email required" id="from_email" name="from_email" style="width: 210px;" />
                    </div>
                </div>
				<div class="control-group">
                    <div class="controls">
                    	<div style="line-height:0px;">
						<a href="#" id="from_email_link">From</a>
 						</div>
                     </div>
				</div>
				<div class="control-group" style="display: none;">
                    
                    <div class="controls">
                        <input type="text" placeholder="From Name" class="span4" id="from_name" name="from_name" style="width: 210px;" />
                    </div>
                </div>
				
                <div class="control-group">
                    <label class="control-label">To <span class="field_req">*</span></label>
					<div class="controls" class="contactTypeAhead">
						<div>
							<div class="pull-left">
								<ul name="contact_to_ids" class="contacts tagsinput tags"></ul>
							</div>
							<input type="text" id="to" name="to"
								placeholder="Contact Email" class="typeahead typeahead_contacts multipleEmails"
								data-provide="typeahead" data-mode="multiple" /><!--  {{#if properties}} value="{{getPropertyValue properties "email"}}" {{/if}} -->
						</div>
					</div>
                </div>
               
                <div class="control-group" style="display: none;">
                    <label class="control-label">Cc</label>
                    <div class="controls" class="contactTypeAhead">
						<div>
							<div class="pull-left">
								<ul name="contact_cc_ids" class="contacts tagsinput tags"></ul>
							</div>
                        	<input type="text" class="typeahead typeahead_contacts multipleEmails" name="email_cc" id="email_cc" placeholder="Cc" data-provide="typeahead" data-mode="multiple"/>
                    	</div>
					</div>
                </div>
                
                <div class="control-group" style="display: none;">
                    <label class="control-label">Bcc</label>
                    <div class="controls" class="contactTypeAhead">
						<div>
							<div class="pull-left">
								<ul name="contact_bcc_ids" class="contacts tagsinput tags"></ul>
							</div>
                        	<input type="text" class="typeahead typeahead_contacts multipleEmails" name="email_bcc" id="email_bcc" placeholder="Bcc" data-provide="typeahead" data-mode="multiple"/>
						</div>
                    </div>
                </div>

				<div class="control-group">
                    <div class="controls">
                    	<div style="line-height:0px;">
						<a href="#" id="cc-link">Add CC</a>
 						<a href="#" id="bcc-link" style="padding-left: 5px;">Add BCC</a>
                        </div>
                     </div>
				</div>

                <div class="control-group">
                    <label class="control-label">Subject <span class="field_req">*</span></label>
                    <div class="controls">
                        <input type="text" class="span4 required" name="subject" id="subject" placeholder="Subject" />
                    </div>
                </div>
                    
                <div class="control-group">
                    <label class="control-label">Message </label>
                    <div class="controls">
                        <div id="loading-editor"></div>
                        <textarea class="span4 required" name="body" id="email-body" placeholder="Description" style="width: 75%; height: 45%; display: none;"></textarea>
                    </div>
                </div>   
                
               <div class="control-group">
                   <label class="checkbox" style="float:right;">
                       <input type="checkbox" name="track_clicks" checked="checked">
                       Enable Tracking
                   </label> 
               	   <label class="control-label">&nbsp; </label>
                   <div class="controls">
               	       <a href="#" class="add-attachment-select"><i class='icon-plus-sign'/></i> Add Attachment</a>
					   <span class="attachment-document-select" style="display:none;">
							<select id="attachment-select" style="margin-bottom: -1px;" name="document_id">
							</select>
							&nbsp;
                            <a href="#" class="add-attachment-cancel"><i class="icon-remove-circle"></i></a>
                            <span class="attachment-status"></span>
						</span>
				   </div>			
				</div>            

                <input name="signature" type="hidden" value="{{#getCurrentUserPrefs}}{{signature}}{{/getCurrentUserPrefs}}"/>

                <div class="form-actions">          
                    <a href="#"  id="sendEmail" class="btn btn-primary">Send</a>
                    <a href="#contacts" class="btn " id="send-email-close">Close</a>&nbsp;&nbsp;<span id="msg"></span>  
                </div>
            </fieldset>
        </form>
    </div>
</div>
</script><script id="contact-filter-list-collection-template" type="text/html">
<div class="btn-group right" style='position:relative' id="filters-tour-step">
	<button class="btn filter-dropdown "><i class="icon-filter" style="margin-right:3px"></i></button>
	<button class="btn dropdown-toggle" data-toggle="dropdown">
    	<span class="caret"></span>
  	</button>
	<ul id = "contact-filter-list-model-list" class="pull-right dropdown-menu">
		<li>
			<a href="#contacts" class="default_filter">Contacts</a>
		</li>
		<li>
			<a href="#companies" id="companies-filter">Companies</a>
		</li>
		<li class="divider"></li>
		<li>
			<a href='#contact-filters'>Add/Edit Filter</a>
		</li>
		<li class="divider"></li>
		<!--<li><a class="filter" id="system-RECENT" data="Recent" href="#contact-filter/system-RECENT">Recent </a></li>-->
		<li><a class="filter" id="system-CONTACTS"  data="My Contacts" href="#contact-filter/system-CONTACTS">My Contacts</a></li>
		<!--<li><a class="filter" id="system-LEADS"  data="Leads" href="#contact-filter/system-LEADS">Leads</a></li>-->
	</ul>
</div>
</script>

<script id="contact-filter-list-model-template" type="text/html">
<a id='{{id}}' class="filter" data={{name}} filter_type="{{contact_type}}" href="#contact-filter/{{id}}">{{name}}</a>
</script>


<script id="contact-view-collection-template" type="text/html">
	<div class="btn-group right">
        <a href="#personModal" class="btn right" data-toggle="modal" style="margin-left:5px;"><i class="icon-plus-sign"></i> Add Contact</a>
        <a class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
		<ul class="dropdown-menu pull-right">
			<li><a href="#import">Import from CSV</a></li>
	<!--		<li><a href="#import">Import from other CRMs</a></li>	-->
		</ul>
	</div>
	<div class="btn-group right" style="position:relative;margin-left:0px;">
    	<button class="btn custom_view"><i class="icon-list" style="margin-right:3px"></i></button>
    	<button class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>
    	<ul id="contact-view-model-list" class="pull-right dropdown-menu">
        	<li>
            	<a href="#contacts" class="DefaultView">Default</a>
				<a href="#contacts" class="GridView">Grid View</a>
        	</li>
			<li class="divider"></li>
			<li class="dropdown-submenu"><a data-toggle="dropdown" >Sort By</a>
				<ul class="dropdown-menu" id="contact-sort-views">
					<li><a class="sort" id="sort-by-created_time-desc" data="-created_time" href="#">Newest</a></li>
					<li><a class="sort" id="sort-by-created_time-asc" data="created_time" href="#">Oldest</a></li>
					<li><a class="sort" id="sort-by-lead_score-desc" data="-lead_score" href="#">Highest Score</a></li>
					<li><a class="sort" id="sort-by-lead_score-asc" data="lead_score" href="#">Lowest Score</a></li>
					<!--<li><a class="sort" id="sort-by-star_value-desc" data="-star_value" href="#">Star Value Desc</a></li>
					<li><a class="sort" id="sort-by-star_value-asc" data="star_value" href="#">Star Value Asc</a></li>-->
				</ul>
			</li>
        	<li class="divider"></li>
        	<li>
            	<a href="#contact-view-prefs">Add/Remove Columns</a>
        	</li>
    	</ul>
	</div>
</script><script id = "contacts-export-csv-modal-template" type="text/html">
<div class="modal hide fade" id="contacts-export-csv-modal">
	<div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-file-text"></i> Export Contacts in CSV</h3>
    </div>
	<div class="modal-body">
        <div id="contacts-export-csv-detail">
            <p>We will email you the CSV file shortly. Proceed?</p>
        </div>
    </div>
    <div class="modal-footer">
    <span class="contacts-export-csv-message" style="margin-right:5px"></span>
    <a href="#" id="contacts-export-csv-confirm" class="btn btn-primary">Yes</a>
    <a  href="#" class="btn close" data-dismiss="modal" >No</a>
    </div>
</div>
</script>

<script id = "companies-export-csv-modal-template" type="text/html">
<div class="modal hide fade" id="companies-export-csv-modal">
	<div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-file-text"></i> Export Companies in CSV</h3>
    </div>
	<div class="modal-body">
        <div id="companies-export-csv-detail">
            <p>We will email you the CSV file shortly. Proceed?</p>
        </div>
    </div>
    <div class="modal-footer">
    <span class="companies-export-csv-message" style="margin-right:5px"></span>
    <a href="#" id="companies-export-csv-confirm" class="btn btn-primary">Yes</a>
    <a  href="#" class="btn close" data-dismiss="modal" >No</a>
    </div>
</div>
</script>

<script id = "deals-export-csv-modal-template" type="text/html">
<div class="modal hide fade" id="deals-export-csv-modal">
	<div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-file-text"></i> Export Deals in CSV</h3>
    </div>
	<div class="modal-body">
        <div id="deals-export-csv-detail">
            <p>You will receive an email with CSV file shortly. Proceed?</p>
        </div>
    </div>
    <div class="modal-footer">
    <span class="deals-export-csv-message" style="margin-right:5px"></span>
    <a href="#" id="deals-export-csv-confirm" class="btn btn-primary">Yes</a>
    <a  href="#" class="btn close" data-dismiss="modal" >No</a>
    </div>
</div>
</script><script id="contacts-lhs-filters-custom-template" type="text/html">
{{#each this}}
<div class="control-group lhs-row-filter"> 
	<a data-toggle="collapse" id="lhs-filters-header" 
class="c-p text-l-none text-l-none-hover" >
{{field_label}}
<i style="display:inline;position:absolute;right:20px;" class="fa fa-plus-square-o"></i></a>
{{#if_equals_or "CHECKBOX" field_type "TEXT" field_type "TEXTAREA" field_type}}
	<div class="controls hide" id="{{replace_spaces field_label}}_div">
		<div class="lhs-contact-filter-row pos-rlt">
		<input type="hidden" name="LHS" value="{{field_label}}" />
		<select id="{{replace_spaces field_label}}-filters" name="CONDITION" class="f-left w-105p">
			<option value="EQUALS" >is</option>
			<option value="NOTEQUALS" >isn't</option>
		</select>
		<div class="EQUALS NOTEQUALS condition_container">
			<span id="RHS">
				<input type="text" placeholder="Value" prev-val="" class="required w-95p">
			</span>
		</div>
		<div class="pos-abs pos-r-0 pos-b"><a class="hide clear-filter-condition-lhs"><i class="icon-trash text-l-none-hover c-p"></i></a></div>
		</div>
	</div>
	{{/if_equals_or}}
	{{#if_equals "NUMBER" field_type}}
	<div class="controls hide" id="{{replace_spaces field_label}}_number_div">
		<div class="lhs-contact-filter-row pos-rlt">
		<input type="hidden" name="LHS" value="{{field_label}}_number" />
		<select id="between_filter" name="CONDITION" class="f-left w-105p" >
			<option value="EQUALS">equals</option>
			<option value="IS_LESS_THAN">less than</option>
			<option value="IS_GREATER_THAN">greater than</option>
			<option value="BETWEEN">between</option>
		</select>
		<div class="EQUALS IS_GREATER_THAN IS_LESS_THAN condition_container">
			<span id="RHS">
				<input type="number" min="0" placeholder="Value" prev-val="" class="w-95p required">
			</span>
		</div>
		<div class="BETWEEN condition_container hide">
			<div class="clear" />
			<span id="RHS">
				<input type="number" min="0" class="required w-95p" prev-val="" placeholder="Min Value"> 
			</span>
			<span id="RHS_NEW">
				<input type="number" min="0" placeholder="Max Value" prev-val="" class="required w-95p">
			</span>
		</div>
		<div class="pos-abs pos-r-0 pos-b"><a class="hide clear-filter-condition-lhs"><i class="icon-trash text-l-none-hover c-p"></i></a></div>
	</div>
	</div>
	{{/if_equals}}
	{{#if_equals "DATE" field_type}}
	<div class="controls hide" id="{{replace_spaces field_label}}_time_div">
		<div class="lhs-contact-filter-row pos-rlt">
	<input type="hidden" name="LHS" value="{{field_label}}_time" />
	<select id="between_filter" name="CONDITION" class="w-105p f-left">
		<option value="ON">on</option>
		<option value="AFTER">is after</option>
		<option value="BEFORE">is before</option>
		<option value="BETWEEN">is between</option>
		<option value="LAST">in last</option>
		<option value="NEXT">in next</option>
	</select>
	<div class="AFTER BEFORE ON condition_container">
		<span id="RHS">
			<input type="text" placeholder="MM/DD/YYYY" prev-val="" class="date required w-95p" >
		</span>
	</div>
	<div class="LAST NEXT condition_container hide">
		<span id="RHS">
			<input type="number" placeholder="Number of days" prev-val="" class="w-95p required">
		</span>
	</div>
	<div class="BETWEEN condition_container hide">
		<div class="clear" />
		<span id="RHS">
			<input type="text" placeholder="MM/DD/YYYY" prev-val="" class="date required w-95p">
		</span>
		<span id="RHS_NEW">
			<input type="text" placeholder="MM/DD/YYYY" prev-val="" class="date required w-95p">
		</span>
	</div>
	<div class="pos-abs pos-r-0 pos-b"><a class="hide clear-filter-condition-lhs"><i class="icon-trash text-l-none-hover c-p"></i></a></div>
	</div>
	</div>
	{{/if_equals}}
	{{#if_equals "LIST" field_type}}
	<div class="controls hide" id="{{replace_spaces field_label}}_div">
		<div class="lhs-contact-filter-row pos-rlt">
		<input type="hidden" name="LHS" value="{{field_label}}" />
		<select id="{{replace_spaces field_label}}-filters" name="CONDITION" class="f-left w-105p">
			<option value="EQUALS" >is</option>
			<option value="NOTEQUALS" >isn't</option>
		</select>
		<div class="EQUALS NOTEQUALS condition_container">
			<span id="RHS">
				<select id="{{replace_spaces field_label}}-values" prev-val="" class="required w-105p" name="temp">
					<option value="">Select value</option>
					{{{buildOptions field_data}}}
				</select>
			</span>
		</div>
		<div class="pos-abs pos-r-0 pos-b"><a class="hide clear-filter-condition-lhs"><i class="icon-trash text-l-none-hover c-p"></i></a></div>
		</div>
	</div>
	{{/if_equals}}
	</div>
{{/each}}
</script>
<script id="contacts-lhs-filters-template" type="text/html">
<header>
<div>
	<h3 style="margin-left: 3px">
		<span><span>Filter Contacts</span>
		</span>
	</h3>
	<span class="pull-right" style="margin-top: 8px;">
		<a id="clear-lhs-contact-filters" href="#">
			 clear all</i>
		</a>
	</span>
</div>
</header>
<form id="lhs-contact-filter-form" name="lhs-contact-filter-form">
<input type="hidden" name="contact_type" id="contact_type" value="PERSON" />
<div id="tagslist" style="word-wrap: break-word;">
<fieldset>
<div class="control-group lhs-row-filter">
	<a data-toggle="collapse" id="lhs-filters-header" 
		class="c-p text-l-none text-l-none-hover" >
		Tags
		<i style="display:inline;position:absolute;right:20px;" class="fa fa-plus-square-o"></i></a>
	<div class="controls hide" id="tags_div">
		<div id="tags-lhs-filter-table" class="ignore-collection">
				<div class="hide master-tags-add-div pos-rlt">
					<input type="hidden" name="LHS" value="tags" />
					<select id="tags-filter" class="w-105p f-left" name="CONDITION">
						<option value="EQUALS" class="tags">is</option>
						<option value="NOTEQUALS" class="tags">isn't</option>
					</select>
					<div class="EQUALS NOTEQUALS condition_container">
						<span id="RHS">
							<input type="text" placeholder="Value" prev-val="" class="required w-95p">
						</span>
					</div>
					<div class="pos-abs pos-r-0 pos-b"><a><i class="filter-tags-multiple-remove-lhs icon-trash text-l-none-hover c-p"></i></a></div>
				</div>
				<div class="lhs-contact-filter-row pos-rlt">
					<input type="hidden" name="LHS" value="tags" />
					<select id="tags-filter" class="w-105p f-left" name="CONDITION">
						<option value="EQUALS" class="tags">is</option>
						<option value="NOTEQUALS" class="tags">isn't</option>
					</select>
					<div class="EQUALS NOTEQUALS condition_container">
						<span id="RHS">
							<input type="text" placeholder="Value" prev-val="" class="required w-95p">
						</span>
					</div>
					<div class="pos-abs pos-r-0 pos-b"><a><i class="filter-tags-multiple-remove-lhs icon-trash text-l-none-hover c-p"></a></i></div>
				</div>
		</div>
		<a href="#" class="filter-multiple-add-lhs m-t-xs ext-l-none" data-name="tags"><i class="icon-plus"></i> Add</a>
	</div>
</div>
	
<div class="control-group lhs-row-filter" >
	<a data-toggle="collapse" id="lhs-filters-header" 
		class="c-p text-l-none text-l-none-hover" >
		Score
		<i style="display:inline;position:absolute;right:20px;" class="fa fa-plus-square-o"></i></a>
	<div class="controls hide" id="lead_score_div">
		<div class="lhs-contact-filter-row pos-rlt">
		<input type="hidden" name="LHS" value="lead_score" />
		<select id="between_filter" name="CONDITION" class="f-left w-105p" >
			<option value="IS_GREATER_THAN">greater than</option>
			<option value="IS_LESS_THAN">less than</option>
			<option value="BETWEEN">between</option>
		</select>
		<div class="IS_GREATER_THAN IS_LESS_THAN condition_container">
			<span id="RHS">
				<input type="number" min="0" placeholder="Value" prev-val="" class="w-95p required">
			</span>
		</div>
		<div class="BETWEEN condition_container hide">
			<div class="clear" />
			<span id="RHS">
				<input type="number" min="0" class="required w-95p" prev-val="" placeholder="Min Value"> 
			</span>
			<span id="RHS_NEW">
				<input type="number" min="0" placeholder="Max Value" prev-val="" class="required w-95p">
			</span>
		</div>
		<div class="pos-abs pos-r-0 pos-b"><a class="hide clear-filter-condition-lhs"><i class="icon-trash text-l-none-hover c-p"></i></a></div>
		</div>
	</div>
</div>

<div class="control-group lhs-row-filter" >
	<a data-toggle="collapse" id="lhs-filters-header" 
		class="c-p text-l-none text-l-none-hover" >
		Star Value
		<i style="display:inline;position:absolute;right:20px;" class="fa fa-plus-square-o"></i></a>
	<div class="controls hide" id="star_value_div">
		<div class="lhs-contact-filter-row pos-rlt">
		<input type="hidden" name="LHS" value="star_value" />
		<select id="between_filter" name="CONDITION" class="f-left w-105p" >
			<option value="IS_GREATER_THAN">greater than</option>
			<option value="IS_LESS_THAN">less than</option>
			<option value="BETWEEN">between</option>
		</select>
		<div class="IS_GREATER_THAN IS_LESS_THAN condition_container">
			<span id="RHS">
				<input type="number" min="0" max="5" placeholder="Value" prev-val="" class="w-95p required">
			</span>
		</div>
		<div class="BETWEEN condition_container hide">
			<div class="clear" />
			<span id="RHS">
				<input type="number" min="0" max="5" class="required w-95p" prev-val="" placeholder="Min Value"> 
			</span>
			<span id="RHS_NEW">
				<input type="number" min="0" max="5" placeholder="Max Value" prev-val="" class="required w-95p">
			</span>
		</div>
		<div class="pos-abs pos-r-0 pos-b"><a class="hide clear-filter-condition-lhs"><i class="icon-trash text-l-none-hover c-p"></i></a></div>
		</div>
	</div>
</div>
<!--div class="control-group lhs-row-filter" >
	<a data-toggle="collapse" id="lhs-filters-header" 
		class="c-p text-l-none text-l-none-hover" >
		Campaign Status
		<i style="display:inline;position:absolute;right:20px;" class="fa fa-plus-square-o"></i></a>
	<div class="controls hide" id="campaign_status_div">


		<div id="campaign_status-lhs-filter-table" class="ignore-collection">
			<div class="hide master-campaign_status-add-div pos-rlt">
				<input type="hidden" name="LHS" value="campaign_status" />
				<select id="between_filter" name="CONDITION" class="f-left w-105p" >
					<option value="NOT_ADDED">Never Added</option>
					<option value="ACTIVE">Active</option>
					<option value="DONE">Completed</option>
					<option value="REMOVED">Removed</option>
					<option value="BOUNCED">Bounced</option>
					<option value="UNSUBSCRIBED">Unsubscribed</option>
					<option value="SPAM_REPORTED">Reported Spam</option>
				</select>
		
				<div class="NOT_ADDED ACTIVE DONE REMOVED UNSUBSCRIBED BOUNCED SPAM_REPORTED condition_container">
					<span id="RHS">
						<select id="campaign_select" class="required w-105p" name="temp1" prev-val="">
							<option value="">Select value</option>
						</select>
					</span>
				</div>
					<div class="pos-abs pos-r-0 pos-b"><a><i class="filter-tags-multiple-remove-lhs icon-trash text-l-none-hover c-p"></i></a></div>
			</div>
			<div class="lhs-contact-filter-row pos-rlt">
				<input type="hidden" name="LHS" value="campaign_status" />
				<select id="between_filter" name="CONDITION" class="f-left w-105p" >
					<option value="NOT_ADDED">Never Added</option>
					<option value="ACTIVE">Active</option>
					<option value="DONE">Completed</option>
					<option value="REMOVED">Removed</option>
					<option value="BOUNCED">Bounced</option>
					<option value="UNSUBSCRIBED">Unsubscribed</option>
					<option value="SPAM_REPORTED">Reported Spam</option>
				</select>
		
				<div class="NOT_ADDED ACTIVE DONE REMOVED UNSUBSCRIBED BOUNCED SPAM_REPORTED condition_container">
					<span id="RHS">
						<select id="campaign_select" class="required w-105p" name="temp1" prev-val="">
							<option value="">Select value</option>
						</select>
					</span>
				</div>
				<div class="pos-abs pos-r-0 pos-b"><a><i class="filter-tags-multiple-remove-lhs icon-trash text-l-none-hover c-p"></i></a></div>
			</div>
		</div>
		<a href="#" class="filter-multiple-add-lhs m-t-xs ext-l-none" data-name="campaign_status"><i class="icon-plus"></i> Add</a>
	</div>
</div-->
<div class="control-group lhs-row-filter" >
	<a data-toggle="collapse" id="lhs-filters-header" 
		class="c-p text-l-none text-l-none-hover" >
		Owner
		<i style="display:inline;position:absolute;right:20px;" class="fa fa-plus-square-o"></i></a>
	<div class="controls hide" id="owner_id_div">
		<div class="lhs-contact-filter-row pos-rlt">
		<input type="hidden" name="LHS" value="owner_id" />
		<select id="between_filter" name="CONDITION" class="f-left w-105p" >
			<option value="EQUALS" >is</option>
			<option value="NOTEQUALS" >isn't</option>
		</select>
		
		<div class="EQUALS NOTEQUALS condition_container">
			<span id="RHS">
				<select id="owner_select" class="required w-105p" name="temp1" prev-val="">
					<option value="">Select value</option>
					
				</select>
			</span>
		</div>
		<div class="pos-abs pos-r-0 pos-b"><a class="hide clear-filter-condition-lhs"><i class="icon-trash text-l-none-hover c-p"></i></a></div>
		</div>
	</div>
</div>

<div class="control-group lhs-row-filter" >
	<a data-toggle="collapse" id="lhs-filters-header" 
		class="c-p text-l-none text-l-none-hover" >
		Created Date
		<i style="display:inline;position:absolute;right:20px;" class="fa fa-plus-square-o"></i></a>
	<div class="controls hide" id="created_time_div">
		<div class="lhs-contact-filter-row pos-rlt">
		<input type="hidden" name="LHS" value="created_time" />
		<select id="between_filter" name="CONDITION" class="f-left w-105p" >
			<option value="ON">on</option>
			<option value="AFTER">is after</option>
			<option value="BEFORE">is before</option>
			<option value="BETWEEN">is between</option>
			<option value="LAST">in last</option>
			<option value="NEXT">in next</option>
		</select>
		<div class="AFTER BEFORE ON condition_container">
			<span id="RHS">
				<input type="text" data-date-format="mm/dd/yyyy" prev-val="" placeholder="MM/DD/YYYY" class="w-95p required date">
			</span>
		</div>
		<div class="LAST NEXT condition_container hide">
			<span id="RHS">
				<input type="number" placeholder="Number of days" prev-val="" class="w-95p required">
			</span>
		</div>
		<div class="BETWEEN condition_container hide">
			<div class="clear" />
			<span id="RHS">
				<input type="text" data-date-format="mm/dd/yyyy" prev-val="" class="w-95p date required" placeholder="MM/DD/YYYY">
			</span>
			<span id="RHS_NEW"> 
				<input type="text" data-date-format="mm/dd/yyyy" prev-val="" placeholder="MM/DD/YYYY" class="w-95p date required">
			</span>
		</div>
		<div class="pos-abs pos-r-0 pos-b"><a class="hide clear-filter-condition-lhs"><i class="icon-trash text-l-none-hover c-p"></i></a></div>
		</div>
	</div>
</div>
<div id="custom-filter-fields" ></div>
	
</div>

</fieldset>
</div>
</form>
</script>
<script id="companies-lhs-filters-template" type="text/html">
<header>
<div>
	<h3 style="margin-left: 3px">
		<span><span>Filter Companies</span>
		</span>
	</h3>
	<span class="pull-right" style="margin-top: 8px;">
		<a id="clear-lhs-company-filters" href="#">
			 clear all</i>
		</a>
	</span>
</div>
</header>
<form id="lhs-contact-filter-form" name="lhs-contact-filter-form">
<input type="hidden" name="contact_type" id="contact_type" value="COMPANY" />
<div id="tagslist" style="word-wrap: break-word;">
<fieldset>
<div class="control-group lhs-row-filter" >
	<a data-toggle="collapse" id="lhs-filters-header" 
		class="c-p text-l-none text-l-none-hover" >
		Star Value
		<i style="display:inline;position:absolute;right:20px;" class="fa fa-plus-square-o"></i></a>
	<div class="controls hide" id="star_value_div">
		<div class="lhs-contact-filter-row pos-rlt">
		<input type="hidden" name="LHS" value="star_value" />
		<select id="between_filter" name="CONDITION" class="f-left w-105p" >
			<option value="IS_GREATER_THAN">greater than</option>
			<option value="IS_LESS_THAN">less than</option>
			<option value="BETWEEN">between</option>
		</select>
		<div class="IS_GREATER_THAN IS_LESS_THAN condition_container">
			<span id="RHS">
				<input type="number" min="0" max="5" placeholder="Value" prev-val="" class="w-95p required">
			</span>
		</div>
		<div class="BETWEEN condition_container hide">
			<div class="clear" />
			<span id="RHS">
				<input type="number" min="0" max="5" class="required w-95p" prev-val="" placeholder="Min Value"> 
			</span>
			<span id="RHS_NEW">
				<input type="number" min="0" max="5" placeholder="Max Value" prev-val="" class="required w-95p">
			</span>
		</div>
		<div class="pos-abs pos-r-0 pos-b"><a class="hide clear-filter-condition-lhs"><i class="icon-trash text-l-none-hover c-p"></i></a></div>
		</div>
	</div>
</div>
<div class="control-group lhs-row-filter" >
	<a data-toggle="collapse" id="lhs-filters-header" 
		class="c-p text-l-none text-l-none-hover" >
		Owner
		<i style="display:inline;position:absolute;right:20px;" class="fa fa-plus-square-o"></i></a>
	<div class="controls hide" id="owner_id_div">
		<div class="lhs-contact-filter-row pos-rlt">
		<input type="hidden" name="LHS" value="owner_id" />
		<select id="between_filter" name="CONDITION" class="f-left w-105p" >
			<option value="EQUALS" >is</option>
			<option value="NOTEQUALS" >isn't</option>
		</select>
		
		<div class="EQUALS NOTEQUALS condition_container">
			<span id="RHS">
				<select id="owner_select" class="required w-105p" prev-val="" name="temp1">
					<option value="">Select value</option>
					
				</select>
			</span>
		</div>
		<div class="pos-abs pos-r-0 pos-b"><a class="hide clear-filter-condition-lhs"><i class="icon-trash text-l-none-hover c-p"></i></a></div>
		</div>
	</div>
</div>

<div class="control-group lhs-row-filter" >
	<a data-toggle="collapse" id="lhs-filters-header" 
		class="c-p text-l-none text-l-none-hover" >
		Created Date
		<i style="display:inline;position:absolute;right:20px;" class="fa fa-plus-square-o"></i></a>
	<div class="controls hide" id="created_time_div">
		<div class="lhs-contact-filter-row pos-rlt">
		<input type="hidden" name="LHS" value="created_time" />
		<select id="between_filter" name="CONDITION" class="f-left w-105p" >
			<option value="ON">on</option>
			<option value="AFTER">is after</option>
			<option value="BEFORE">is before</option>
			<option value="BETWEEN">is between</option>
			<option value="LAST">in last</option>
			<option value="NEXT">in next</option>
		</select>
		<div class="AFTER BEFORE ON condition_container">
			<span id="RHS">
				<input type="text" data-date-format="mm/dd/yyyy" prev-val="" placeholder="MM/DD/YYYY" class="w-95p required date">
			</span>
		</div>
		<div class="LAST NEXT hide condition_container">
			<span id="RHS">
				<input type="number" placeholder="Number of days" prev-val="" class="w-95p required">
			</span>
		</div>
		<div class="BETWEEN hide condition_container">
			<div class="clear" />
			<span id="RHS">
				<input type="text" data-date-format="mm/dd/yyyy" prev-val="" class="w-95p date required" placeholder="MM/DD/YYYY">
			</span>
			<span id="RHS_NEW"> 
				<input type="text" data-date-format="mm/dd/yyyy" prev-val="" placeholder="MM/DD/YYYY" class="w-95p date required">
			</span>
		</div>
		<div class="pos-abs pos-r-0 pos-b"><a class="hide clear-filter-condition-lhs"><i class="icon-trash text-l-none-hover c-p"></i></a></div>
		</div>
	</div>
</div>
<div class="control-group lhs-row-filter" >
	<a data-toggle="collapse" id="lhs-filters-header" 
		class="c-p text-l-none text-l-none-hover" >
		Name
		<i style="display:inline;position:absolute;right:20px;" class="fa fa-plus-square-o"></i></a>
	<div class="controls hide" id="name_div">
		<div class="lhs-contact-filter-row pos-rlt">
		<input type="hidden" name="LHS" value="name" />
		<select id="between_filter" name="CONDITION" class="f-left w-105p" >
			<option value="EQUALS" >is</option>
			<option value="NOTEQUALS" >isn't</option>
		</select>
		<div class="EQUALS NOTEQUALS condition_container">
			<span id="RHS">
				<input type="text" placeholder="Value" prev-val="" class="w-95p required">
			</span>
		</div>
		<div class="pos-abs pos-r-0 pos-b"><a class="hide clear-filter-condition-lhs"><i class="icon-trash text-l-none-hover c-p"></i></a></div>
		</div>
	</div>
</div>
<div id="custom-filter-fields" ></div>
	
</div>

</fieldset>
</div>
</form>
</script>
<script id="contacts-model-template" type="text/html">
	<td style="cursor:default;" class="select_checkbox">
			<input class="tbody_check" type="checkbox"/>
	</td>
	<td class="data" data="{{id}}">
	<div class="row-fluid">
    	<div style="display:inline;padding-right:5px;height:auto;">
        	{{#if_contact_type "PERSON"}}
        		<img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}"  width="40px" height="40px" style="display:inline; width:40px; height:40px; " />
        	{{/if_contact_type}}
        
			{{#if_contact_type "COMPANY"}}
        		<img class="thumbnail" {{getCompanyImage "40" "display:inline;"}} />
        	{{/if_contact_type}}
    	</div>
    	<div style="height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:70%">
        	{{#if_contact_type "PERSON"}}
        		<b>	{{getPropertyValue properties "first_name"}}
        		{{getPropertyValue properties "last_name"}} </b>
        		<br />
        		{{getPropertyValue properties "email"}}
        	{{/if_contact_type}}
        
			{{#if_contact_type "COMPANY"}}
        		<b>{{getPropertyValue properties "name"}}</b></br>
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
	 <div class="ellipsis-multiline" style="line-height:20px !important; word-break:keep-all;"> 	
		{{#each tags}}
	    	<span class="label">{{this}}</span>	
		{{/each}}
	</div>
	
	</td>
	<td><div>{{lead_score}}</div></td>
</script>

<script id="contacts-table-model-template" type="text/html">
	<td style="cursor:default;" class="select_checkbox">
			<input class="tbody_check" type="checkbox"/>
	</td>
	<td class="data" data="{{id}}">
	<div class="row-fluid">
    	<div style="display:inline;padding-right:5px;height:auto;">
        	{{#if_contact_type "PERSON"}}
        		<img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}"  width="40px" height="40px" style="display:inline; width:40px; height:40px; " />
        	{{/if_contact_type}}
        
			{{#if_contact_type "COMPANY"}}
        		<img class="thumbnail" {{getCompanyImage "40" "display:inline;"}} />
        	{{/if_contact_type}}
    	</div>
    	<div style="height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:70%">
        	{{#if_contact_type "PERSON"}}
        		<b>	{{getPropertyValue properties "first_name"}}
        		{{getPropertyValue properties "last_name"}} </b>
        		<br />
        		{{getPropertyValue properties "email"}}
        	{{/if_contact_type}}
        
			{{#if_contact_type "COMPANY"}}
        		<b>{{getPropertyValue properties "name"}}</b></br>
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
	 <div class="ellipsis-multiline" style="line-height:20px !important; word-break:keep-all;"> 	
		{{#each tags}}
	    	<span class="label">{{this}}</span>	
		{{/each}}
	</div>
	
	</td>
	<td><div>{{lead_score}}</div></td>
</script>


<script id="contacts-collection-template" type="text/html">
<div class="row">
	<div class="span12">
		<div class="page-header">
			<h1><span id="contact-heading">Contacts </span><span id="contacts-count">{{contacts_count}}</span></h1>
			<div class="btn-group right" id="view-list"
				style="top: -29px;"></div>
			<div class="btn-group right" id="filter-list"
				style="top: -29px;margin-right: 5px"></div>
			<div>
			<div class="btn-group pull-left" id="bulk-actions"
				style="display: none; top: -29px;margin-left:26%;">
					<div class="btn">Bulk Actions</div>
					<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
						<span class="caret"></span>
					</a>
					<ul class="dropdown-menu" id="view-actions">
						<li><a href="#" id="bulk-tags">Add Tags</a></li>
						<li><a href="#" id="bulk-tags-remove">Remove Tags</a></li>
                        <li class='divider'></li>  
						<li><a href="#" id="bulk-campaigns">Add to Campaign</a></li>
						<li><a href="#" id="bulk-email">Send Email</a></li>
                        <li class='divider'></li>
						<li><a href="#" id="bulk-owner">Change Owner</a></li>
                        <li><a href="#" id="bulk-contacts-export">Export Contacts as CSV</a></li>
						<li><a href="#" class="delete-checked-contacts">Delete</a></li>
					</ul>
			</div>
			<div  class="btn-group pull-left" style="display: none;top:-25px;left:10px" id="bulk-select"></div>
		</div>
		</div>
	</div>
</div>

<div class="row">
	<div class="span3">
		<div class="data-block">
			<div class="well" id="lhs_filters_conatiner" style="background:none;box-shadow:0 0px 7px 0px #ddd;">
						</div>
		</div>
	</div>
	<div class="span9">
		{{#unless this.length}}
			<div class="filter-criteria">
					
			</div>
			<div id="slate"></div>
	{{/unless}}
		{{#if this.length}}
		<div class="data">
			<div class="data-container"></div>
			<table id="contacts-table" class="table table-striped showCheckboxes agile-ellipsis-dynamic no-sorting"
				url="core/api/bulk/update?action_type=DELETE">
				<col width="30px">
				<col width="41%">
				<col width="24%">
				<col width="24%">
				<col width="12%">
				<div class="filter-criteria"></div>
				<thead>
					<tr>
						<th><input class="thead_check" type="checkbox"></input></th>
						<th>Name</th>
						<th>Work</th>
						<th>Tags</th>
						<th>Lead Score</th>
					</tr>
				</thead>
				<tbody id="contacts-model-list" class="contacts-model-list"
					route="contact/" style="overflow: scroll;overflow:hidden;">
				</tbody>
			</table>
		</div>
	</div>
	{{/if}}
</div>
</script>

<!-- Company Default View 
	Separate HTML template, allows customization of companies list page.
	Also when selecting Companies from filter drop-down, only this will be rendered, no custom view is supported for Companies.
-->
<script id="companies-model-template" type="text/html">
<td style="cursor:default;" class="select_checkbox">
			<input class="tbody_check" type="checkbox"/>
	</td>
	<td class="data" data="{{id}}">
    	<div style="display:inline;padding-right:10px;height:auto;">
        		<img class="thumbnail" {{getCompanyImage "40" "display:inline;"}} />
    	</div>
    	<div style="height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;width:14em;overflow:hidden;">
        		<b>{{getPropertyValue properties "name"}}</b></br>
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

<script id="companies-table-model-template" type="text/html">
<td style="cursor:default;" class="select_checkbox">
			<input class="tbody_check" type="checkbox"/>
	</td>
	<td class="data" data="{{id}}">
    	<div style="display:inline;padding-right:10px;height:auto;">
        		<img class="thumbnail" {{getCompanyImage "40" "display:inline;"}} />
    	</div>
    	<div style="height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;width:14em;overflow:hidden;">
        		<b>{{getPropertyValue properties "name"}}</b></br>
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


<script id="companies-collection-template" type="text/html">
<div class="row">
	<div class="span12">
		<div class="page-header">
			<h1><span id="contact-heading">Companies </span><span id="contacts-count"><small>{{count}}</small></span></h1>
			<div class="btn-group right" id="view-list"
				style="top: -29px;"></div>
			<div class="btn-group right" id="filter-list"
				style="top: -29px;margin-right: 5px"></div>
			<div>
			<div class="btn-group pull-left" id="bulk-actions"
				style="display: none; top: -29px;margin-left:26%;">
					<div class="btn">Bulk Actions</div>
					<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
						<span class="caret"></span>
					</a>
					<ul class="dropdown-menu" id="view-actions">
						<li><a href="#" id="bulk-email">Send Email</a></li>
                        <li class='divider'></li>
						<li><a href="#" id="bulk-owner">Change Owner</a></li>
						<li><a href="#" id="bulk-companies-export">Export Companies as CSV</a></li>
						<li><a href="#" class="delete-checked-contacts">Delete</a></li>
					</ul>
			</div>
			<div  class="btn-group pull-left" style="display: none;top:-25px;left:10px" id="bulk-select"></div>
		</div>
		</div>
	</div>
</div>

<div class="row">
	<div class="span3">
		<div class="data-block">
			<div class="well" id="lhs_filters_conatiner" style="background:none;box-shadow:0 0px 7px 0px #ddd;">
						</div>
		</div>
	</div>
	<div class="span9">
		{{#unless this.length}}
			<div class="filter-criteria">
					
			</div>
			<div id="slate"></div>
	{{/unless}}
		{{#if this.length}}
		<div class="data">
			<div class="data-container"></div>
			<table id="companies" class="table table-striped showCheckboxes"
				url="core/api/bulk/update?action_type=DELETE" style="overflow: scroll">
				<div class="filter-criteria">
					
				</div>
				<thead>
					<tr>
						<th>Name</th>
						<th>Star Value</th>
						<th>Owner</th>
					</tr>
				</thead>
				<tbody id="companies-model-list" class="companies-model-list"
					route="contact/" style="overflow: scroll;">
				</tbody>
			</table>
		</div>
	</div>
	{{/if}}
</div>
</script>
<script id="contacts-table-collection-template" type="text/html">
{{#unless this.length}}
			<div class="filter-criteria">
					
			</div>
			<div id="slate"></div>
	{{/unless}}
		{{#if this.length}}
		<div class="data">
			<div class="data-container"></div>
			<table id="contacts-table" class="table table-striped showCheckboxes agile-ellipsis-dynamic no-sorting"
				url="core/api/bulk/update?action_type=DELETE">
				<col width="30px">
				<col width="41%">
				<col width="24%">
				<col width="24%">
				<col width="12%">
				<div class="filter-criteria"></div>
				<thead>
					<tr>
						<th><input class="thead_check" type="checkbox"></input></th>
						<th>Name</th>
						<th>Work</th>
						<th>Tags</th>
						<th>Lead Score</th>
					</tr>
				</thead>
				<tbody id="contacts-table-model-list" class="contacts-table-model-list"
					route="contact/" style="overflow: scroll;overflow:hidden;">
				</tbody>
			</table>
		</div>
	</div>
	{{/if}}
</script>
<script id="companies-table-collection-template" type="text/html">
{{#unless this.length}}
			<div class="filter-criteria">
					
			</div>
			<div id="slate"></div>
	{{/unless}}
		{{#if this.length}}
		<div class="data">
			<div class="data-container"></div>
			<table id="companies" class="table table-striped showCheckboxes"
				url="core/api/bulk/update?action_type=DELETE" style="overflow: scroll">
				<div class="filter-criteria">
					
				</div>
				<thead>
					<tr>
						<th>Name</th>
						<th>Star Value</th>
						<th>Owner</th>
					</tr>
				</thead>
				<tbody id="companies-table-model-list" class="companies-table-model-list"
					route="contact/" style="overflow: scroll;">
				</tbody>
			</table>
		</div>
	</div>
	{{/if}}

</script><!-- Opportunity template -->
<script id="dashboard-opportunities-collection-template" type="text/html">
<div style="margin-left:0px">
<h2 style="border-bottom:1px solid #f5f5f5; margin-bottom:10px">Ongoing <small>Deals</small></h2>
{{#if this.length}}
<table class="table table-striped no-sorting agile-ellipsis-dynamic">
<colgroup>
	<col width="26%">
	<col width="158px">
	<col width="13%">
	<col width="15%">
	<col width="15%">
</colgroup>          
          			<thead>
                        <tr style="background-color:#EDF3FE;">
                            <th>Opportunity</th>
                            <th>Related To</th>
                            <th>Value</th>
                            <th>Milestone</th>
                            <th>Close Date</th>
                        </tr>
                    </thead>
              <tbody id="dashboard-opportunities-model-list" style="cursor:pointer;">
          </tbody>
	</table>
{{else}}
{{set_up_dashboard_padcontent "deals"}}

{{/if}}
</div>
</script>

<script id="dashboard-opportunities-model-template" type="text/html">
<td data="{{id}}" class="data">
    <div style="height:auto;">
		<b>{{name}}</b>
    </div>
</td>
<td>
	<div style="height:auto;display:inline-block;">
		{{#each contacts}}
        	{{#if_contact_type "PERSON"}}
        		<a href="#contact/{{id}}" class="activate-link"><img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" width="40px" height="40px" style="display:inline; width:40px; height:40px;  "  title="{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}" /></a>
        	{{/if_contact_type}}
			{{#if_contact_type "COMPANY"}}
        		<a href="#contact/{{id}}" class="activate-link"><img class="thumbnail" {{getCompanyImage "40" "display:inline;"}} title="{{getPropertyValue properties "name"}}"/></a>
        	{{/if_contact_type}}
       {{/each}}
	</div>{{#if_greater this.contacts.length "3"}}<span>...</span>{{/if_greater}}
</td>
<td><div style="height:auto;">{{currencySymbol}}{{numberWithCommas expected_value}}</div></td>
<td><div style="height:auto;">{{milestone}}<br />({{probability}}%) </div></td>
<td><div style="height:auto;"><time class="deal-close-time" datetime="{{epochToHumanDate "" close_date}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" close_date}}</time></div></td>
</script>

<!-- Notes Template -->
<script id="dashboard-notes-collection-template" type="text/html">
{{#if this.length}}
<table class="table">
    <thead>
        <tr>
            <th>subject</th>
            <th>description</th>
        </tr>
    </thead>
    <tbody id="dashboard-notes-model-list">
    </tbody>
</table>
{{/if}}
</script>

<script id="dashboard-notes-model-template" type="text/html">
	<td>{{subject}} </td>
	<td>{{note}}</td>
<br />
</script>

<!-- Tasks Template -->
<script id="dashboard1-tasks-collection-template" type="text/html">
<h2 style="border-bottom:1px solid #f5f5f5; margin-bottom:10px">Upcoming <small>Tasks</small></h2>
{{#if this.length}}
<div style="margin-left:0px">
    <div class="data-container">
        <table class="table table-striped no-sorting agile-ellipsis-dynamic" url="core/api/tasks/bulk">
				<colgroup>
					<col width="33%">
				 	<col width="13%">
				 	<col width="13%">
					<col width="13%">
				 	<col width="26%">
				</colgroup>
            <thead>
                <tr style="background-color:#EDF3FE;">
                    <th>Task Name</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Related To</th>
                </tr>
            </thead>
            <tbody id="dashboard1-tasks-model-list" style="cursor:pointer;">
            </tbody>
        </table>
    </div>
</div>
{{else}}
{{set_up_dashboard_padcontent "tasks"}}
{{/if}}
</script>

<script id="dashboard1-tasks-model-template" type="text/html">
<td class="data" data="{{id}}"><div style="height:auto;">{{#is_link subject}}<b class="activate-link">{{else}}<b>{{/is_link}}{{safe_string subject}}</b></div></td>
<td><div style="height: 50px;"><span class="label">{{task_property type}}</span></div></td>
<td><div><span class="label label-{{task_label_color priority_type}}">{{ucfirst priority_type}}</span></div></td>
<td><div><time class="task-due-time" datetime="{{epochToHumanDate "" due}}" style="border-bottom: dotted 1px #999;">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" due}}</time></div></td>
<td>
	<div style="height: auto; display: inline-block;">
		{{#each contacts}} 
			{{#if_contact_type "PERSON"}}
			 	<a href="#contact/{{id}}" class="activate-link">
				<img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" width="40px" height="40px" style="display: inline; width:40px; height:40px; " title="{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}" /></a>
			{{/if_contact_type}}
			{{#if_contact_type "COMPANY"}} 
				<a href="#contact/{{id}}" class="activate-link">
				<img class="thumbnail" {{getCompanyImage "40" "display:inline;"}} title="{{getPropertyValue properties " name"}}"/></a>
			{{/if_contact_type}}
		{{/each}}
	</div> {{#if_greater this.contacts.length "3"}}<span style="margin-right: -14px">...</span>{{/if_greater}}
</td>
</script>


<!-- Contacts Template -->
<script id="dashboard-contacts-model-template" type="text/html">
	<td class="data" data="{{id}}">
	<div class="row-fluid">
    	<div style="display:inline;padding-right:5px;height:auto;">
        	{{#if_contact_type "PERSON"}}
        		<img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" width="40px" height="40px" style="display:inline; width:40px; height:40px; " />
        	{{/if_contact_type}}
        
			{{#if_contact_type "COMPANY"}}
        		<img class="thumbnail" {{getCompanyImage "40" "display:inline;"}} />
        	{{/if_contact_type}}
    	</div>
    	<div style="height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:70%">
        	{{#if_contact_type "PERSON"}}
        		<b>	{{getPropertyValue properties "first_name"}}
        		{{getPropertyValue properties "last_name"}} </b>
        		<br />
        		{{getPropertyValue properties "email"}}
        	{{/if_contact_type}}
        
			{{#if_contact_type "COMPANY"}}
        		<b>{{getPropertyValue properties "name"}}</b></br>
        		{{getPropertyValue properties "url"}}
        	{{/if_contact_type}}
	</div>
	</div>
	</td>
	<td><div style="display:inline-block;vertical-align:top;word-break: break-word;">{{getPropertyValue properties "title"}}<br />
    	{{getPropertyValue properties "company"}}</div>
	</td>
	<td> 
<!-- <div style="height:auto;display:inline-block;vertical-align:top;text-overflow:clip;white-space:nowrap;width:15em;overflow:hidden;"> --> 
	 <div class="ellipsis-multiline" style="line-height:20px !important; word-break:keep-all;"> 	
		{{#each tags}}
	    	<span class="label">{{this}}</span>	
		{{/each}}
	</div>
	
	</td>
	<td><div>{{lead_score}}</div></td>
</script>

<script id="dashboard-contacts-collection-template" type="text/html">
<div style="margin-left:0px">
<h2 style="border-bottom:1px solid #f5f5f5; margin-bottom:10px">Recently Viewed  <small>Contacts</small></h2>
{{#if this.length}}
		<div class="data">
			<div class="data-container">
			<table id="contacts-table" class="table table-striped agile-ellipsis-dynamic no-sorting"
				url="core/api/contacts/bulk" style="overflow: fixed; width:100%;word-break: break-all;table-layout:fixed">
				<colgroup>
				<col width="41%">
				<col width="22%">
				<col width="24%">
				<col width="14%">
				</colgroup>
				<thead>
					<tr style="background-color:#EDF3FE;">
						<th>Name</th>
						<th>Work</th>
						<th>Tags</th>
						<th>Lead Score</th>
					</tr>
				</thead>
				<tbody id="dashboard-contacts-model-list" class="contacts-model-list"  style="cursor:pointer;">
				</tbody>
			</table>
			</div>
			</div>
	</div>
{{else}}
{{set_up_dashboard_padcontent "contacts"}}
{{/if}}
</div>
</script>

<!-- Workflows template-->
<script id="dashboard-workflows-model-template" type="text/html">
	<td class="hide">{{id}}</td>
	<td><a href="#workflow/{{id}}">{{name}}</a></td>
	<td>{{creatorName}}</td>
	<td><a href="#workflows/logs/{{id}}">View Logs</a></td>
    <td><a href="#email-reports/{{id}}">View Stats</a></td>
<br />
</script>

<script id="dashboard-workflows-collection-template" type="text/html">
{{#if this.length}}
<div style="margin-left:0px">
<h2 style="border-bottom:1px solid #f5f5f5; margin-bottom:10px">Workflows</h2>
                <table class="table table-striped onlySorting">
                    <thead>
                       <tr style="background-color:#EDF3FE;">
                            <th class="hide">Id</th>
                            <th>Name</th>
                            <th>Creator</th>
                            <th>Logs</th>
                            <th>Stats</th>
                        </tr>
                    </thead>
                    <tbody id="dashboard-workflows-model-list"> </tbody>
                </table>
</div>
{{else}}
{{set_up_dashboard_padcontent "workflows"}}
{{/if}}
</script>

<script id="dashboard-campaign-logs-collection-template" type="text/html">
<div style="margin-left:0px">
<h2 style="border-bottom:1px solid #f5f5f5; margin-bottom:10px">Recent Campaign <small>Logs
</small></h2>
{{#if this.length}}
    <div class="data">
        <div class="data-container">
            <table class="table table-striped agile-ellipsis-dynamic no-sorting" id="logs-table" url="core/api/campaigns/logs/bulk">
				<colgroup><col width="35%"><col width="20%"><col width="12%"><col width="20%"><col width="13%"></colgroup>
                <thead>
                     <tr style="background-color:#EDF3FE;">
                        <th>Contact</th>
                        <th>Campaign</th>
                        <th>Type</th>
                        <th>Message</th>
                        <th>Time</th>                    
                    </tr>
                </thead>
                <tbody id="dashboard-campaign-logs-model-list" route="contact/">
                </tbody>
            </table>
        </div>
    </div>
{{else}}
{{set_up_dashboard_padcontent "workflows"}}
{{/if}}
</div>
</script>

<script id="dashboard-campaign-logs-model-template" type="text/html">
<input name="id" class="campaign" type="hidden" value="{{campaign_id}}" />
<td class="data" data={{subscriber_id}} style="width:20em;">
	<div style="display:inline;padding-right:10px;height:auto;">
    	<img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl contact.properties 40}}" width="40px" height="40px" style="display:inline; width:40px; height:40px; " />
    </div>
 	<div style="height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;width:12em;overflow:hidden;">
    	<b>	{{getPropertyValue contact.properties "first_name"}} {{getPropertyValue contact.properties "last_name"}} </b>
        <br />
        	{{getPropertyValue contact.properties "email"}}
    </div>
    <div style="float:right"></div>
</td>
<td>{{campaign_name}}</td>
<td>{{titleFromEnums log_type}}</td>
<td style="width: 30%; word-break: break-all;">{{#if_email_sent this "log_type"}} Subject: {{Subject}} {{else}} {{{message}}} {{/if_email_sent}}</td>
<td><small class="edit-hover"> 
		<time class="log-created-time" datetime="{{epochToHumanDate "" time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" time}}</time>
	</small></td>
<br/>
</script><script id="dashboard-template" type="text/html">
 <h1>Dashboard </h1>


<div class="btn-group right" style="top:-29px;position:relative;margin-right:5px">
    <button class="btn"><i class="icon-list" style="margin-right:3px"></i></button>
    <button class="btn dropdown-toggle" data-toggle="dropdown">
    <span class="caret"></span>
    </button>
    <ul id="contact-view-model-list" class="pull-right dropdown-menu">
        <li>
            <a href="#contacts" url="core/api/timeline/contact" class="dashboard-timeline-filter">Contacts</a>
		</li>
		<li>
			<a href="#task" url="core/api/timeline/tasks" class="dashboard-timeline-filter">Task</a>
        </li>
    </ul>
</div>

</div>
<div id="my-timeline"></div>
<div class="span12 row-fluid" style="padding-top:15px; margin-left:0px">
	<div class="span6" style="margin-top: 10px">
     <ul class="nav nav-tabs" id="dashboardTabs" style="list-style: none;">
					<li class="active"><a data-toggle="tab" href="#recentContacts">Recently Viewed</a></li>
                    <li ><a data-toggle="tab" href="#deals">Deals</a></li>
                    <li class=""><a data-toggle="tab" href="#notes">Notes</a></li>
                    <li class=""><a data-toggle="tab" href="#tasks">Tasks</a></li>
                    <li class=""><a data-toggle="tab" href="#campaigns">Campaigns</a></li>
                <!--<li class="active"><a data-toggle="tab" href="#activities">Activity <sup><span class="badge badge-success">3</span></sup> </a></li>-->
                </ul>	
				<div class="tab-content">
				<div class="tab-pane" id="recentContacts">Recent Contacts</div>
				<div class="tab-pane" id="notes">Notes</div>
                <div class="tab-pane" id="tasks">Tasks</div>
                <div class="tab-pane" id="deals">Deals</div>
                <div class="tab-pane" id="campaigns">camaigns</div>
				</div>
	</div>	
	<div class="span6" style="margin-top: 10px" id="subscription-stats">
	
	</div>
	</div>

</div>
</div>
</script>



<script id="user-billing-template" type="text/html">
<div style="background-color: #F8F8B9; margin-bottom:10px;padding: 15px;">
{{#if_equals users_count "2"}}
	<h3 style="font-size: 20px;">Oops. You are out of users.</h3>
<p style="padding-top: 10px;">
		Plan: Free Plan <br/>
		Users: {{users_count}} of 2 &nbsp;<a style="text-decoration: underline;" href="#subscribe">Add User</a><br/><br/>
	</p>
{{else}}
	<h3 style="font-size: 20px;text-decoration:underline;">Account Info</h3>
	<p style="padding-top: 10px;">
		Plan: Free Plan <br/>
		Users: {{users_count}} of 2 &nbsp;<a style="text-decoration: underline;" href="#users-add">Add User</a><br/>
	</p>
{{/if_equals}}
<p>
		<a style="text-decoration: underline;" href="#subscribe">Please
			upgrade your account</a> to create more users. It takes only 10 seconds.
	</p>
</div>
</script>

<script id="dashboard-account-info-template" type="text/html">

<div style="background-color: #F8F8B9; margin-bottom:10px;padding: 15px;">
	<h3 style="font-size: 20px;text-decoration:underline;">Account Info</h3>
	<p style="padding-top: 10px;">
		Plan: {{titleFromEnums plan.plan_type}}<br />
		Users: {{userCount}} of {{plan.quantity}} 
	{{#if_equals userCount plan.quantity}}
	 &nbsp;<a style="text-decoration: underline;" href="#subscribe">Add User</a> <br />
	{{else}}
		 &nbsp;<a style="text-decoration: underline;" href="#users-add">Add User</a> <br />
	{{/if_equals}}
<br />
		<a style="text-decoration: underline;" href="#subscribe">Please
			upgrade your account</a> to create more users. It takes only 10 seconds.
	</p>
</div>
</script>

<script id="profile-meter-template" type="text/html">
<div style="background-color: #F8F8B9; margin-bottom:10px;padding: 15px;">
<div><h3>Get started<h3></div>
<div class="row-fluid" style="margin-top:10px">
<div class="span10">
<div class="progress progress-warning" style="margin-bottom:0px !important;">
  <div class="bar" style="width: {{this.total}}%;"></div>
</div>
</div>
<span style="margin-left:2px"><strong> {{this.total}} %</strong></span>
</div>
<ul>
{{#unless Email}}
<li>Sync your email with Agile <a href="#email">here</a></li>
{{/unless}}
{{#unless User_invited}}
<li>Invite New colleagues to Agile <a href="#users">here</a></li>
{{/unless}}
{{#unless shared}}
<li>
	Spread the love
</li>
{{/unless}}
</ul>
</div>


</script>

<script id="dashboard1-template" type="text/html">
<div class="row">
	<div class="span12">
		<div class="page-header">
			<div id="reportrange" class="pull-right"
				style="padding: 4px 8px; box-shadow: 0 0px 2px rgba(0, 0, 0, .25), inset 0 -1px 0 rgba(0, 0, 0, .1); display: none;">
				<i class="icon-calendar icon-large"></i> <span id="range"></span>
			</div>
			<h1>
			Welcome to Agile CRM
			<div class="pull right">
            <small style="font-size:0.5em; ">Last login :  <time id="last-login-time"  value="{{time_format}}" datetime="{{epochToHumanDate "" time_format}}">{{epochToHumanDate "ddd mmm dd yyyy" time_format}}</time></small>

        	</div>
			</h1>
			<span style="background-color: rgb(249, 237, 190); border: 1px solid rgb(240, 195, 109); border-radius: 2px; display: inline-block; position: absolute; text-align: center; float: right; margin-left: 32%; padding: 3px 16px; margin-top: -69px;">Try the <a href="#portlets" style="color: #222222">new Dashboard</a> (beta).</span>
		</div>
	</div>
</div>
<div class="row">
	<div class="span9">
			<div style="background-color:#f2f5ff;padding-bottom:20px">
				<div style="font-size:14px;height:80px">
					<p style="padding:20px">Agile has all you need - contact management, marketing automation, web analytics, telephony, newsletter management, 2 way emails, real time activity alerts, third-party integrations and lot more.</p>
				</div>
				<div align="center">
					<ul class="dashboard-list">
						<li>
							<a href="#contacts" title="" data-original-title="">
								<div style="padding:20px 13px 10px;">
									<i class="icon-group icon-3x"></i>
								</div>							
									Contacts
							</a>
						</li>
						{{#hasMenuScope "CALENDAR"}}
						<li>
							<a href="#tasks" title="" data-original-title="">
								<div style="padding:20px 10px 10px 16px;">
									<i class="icon-edit icon-3x"></i>
								</div>
									Tasks
							</a>
						</li>
						{{/hasMenuScope}}
						{{#hasMenuScope "DEALS"}}
						<li>
							<a href="#deals" title="" data-original-title="">
								<div style="padding:20px 13px 10px;">
									<i class="icon-money icon-3x"></i>
								</div>
									Deals
							</a>
						</li>
						{{/hasMenuScope}}
						{{#hasMenuScope "CAMPAIGN"}}
						<li>
							<a href="#workflows" title="" data-original-title="">
								<div style="padding:20px 13px 10px;">
									<i class="icon-sitemap icon-3x"></i>
								</div>
								Campaigns
							</a>
						</li>
						{{/hasMenuScope}}
						{{#hasMenuScope "ACTIVITY"}}
						<li>
							<a href="#activities" title="" data-original-title="">
								<div style="padding:20px 13px 10px;">
									<i class="icon-cogs icon-3x"></i>
								</div>							
									Activities
							</a>
						</li>
						{{/hasMenuScope}}
						<li>
							<a href="#user-prefs" title="" data-original-title="">
								<div style="padding:20px 13px 10px;">
									<i class="icon-wrench icon-3x "></i><br/>
								</div>
								<div>
									Settings
								</div>
							</a>
						</li>
					</ul>
</div>
			</div>
</br>
	
<div id="dashboard-entities">
	<div id="recent-contacts" style="margin-top:50px"></div>
	<div id="my-tasks" style="margin-top:50px"></div>
	{{#hasMenuScope 'DEALS'}}
	<div id="my-deals" style="margin-top:50px"></div>
	{{/hasMenuScope}}
	<div id="my-logs" style="margin-top:50px"></div>
</div>
	</div>
	
	
<div class="span3">
		<div id = "profile-meter">
		</div>
        <div id="subscription-stats"></div>
		</br>
		<div class="data-block">
			<div class="well">
				<header>
					<h3 style="margin-left: 3px">
					 <span>Our expert talk </span>
					</h3>
				</header>
				<div id="blog_sync_container"></div>
				<span class="pull-right"><a href="https://www.agilecrm.com/blog" target="_blank">Read More...</a></span>
			</div>
		</div>
		</br>
	</div>	
</div>
</div>
<hr/>
</script>

<script id="sticky-noty-template" type="text/html">
  <div id="notify-container">
      <div id="notify-1-7497345" style="background-color:#ffc;color: black;font-size:16px !important;font-weight:normal !important;">
       <span class="notify-close"><a title="dismiss this notification" style="text-decoration:none;">x</a></span>
		{{#if route}}
       		<a href={{this.route}} style=" text-decoration: none;"><span class="notify-text">{{{this.message}}}</span></a>
			{{else}}
			<span class="notify-text">{{{this.message}}}</span>
		{{/if}}
      </div>
   </div>
</script>

<script id="" type="text/html">
	<div>
		Alpha
	</div>
</script>
<!-- New (Note) Modal views -->
<div class="modal hide fade dealnoteupdatemodal" id="dealnoteupdatemodal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-plus-sign"></i>&nbsp;Edit Note</h3>
    </div>
    <div class="modal-body">
        <form id="dealnoteUpdateForm" name="dealnoteUpdateForm" method="post">
            <fieldset>
                <input name="from_task" id="from_task" type="hidden" value="" />
                <input name="task_form" id="task_form" type="hidden" value="" />
                 <input name="id" id="id" type="hidden" value="{{id}}" />
                 <input name="created_time" id="created_time" type="hidden" value="{{created_time}}" />
                	            
                <div class="control-group">
                    <label class="control-label"><b>Subject</b> <span class="field_req">*</span></label>
                    <div class="controls">
                        <input type="text" placeholder="About" name="subject" id="subject" class="required" />
                    </div>
                </div>
                <div class="row-fluid">
	                <div class="control-group">
	                    <label class="control-label"><b>Description</b></label>
	                    <div class="controls">
	                        <textarea rows="3" class="span8" placeholder="Detailed Note" name="description" id="description" style="max-width:400px;"></textarea> 
	                    </div>
	                </div>
                </div>
                <div class="control-group">
                    <label class="control-label"><b>Related To</b></label>
                    <div class="controls">
                        <div>
                            <div class="pull-left">
                                <ul name="deal_ids" class="contacts tags tagsinput"></ul>
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
    <div class="modal-footer">
        <a href="#" class="btn btn-primary" id="dealnote_update">Save
        </a>
        <span class="save-status"></span>
    </div>
</div>
<!-- End of Modal views --><!-- Edit (Deal) Modal views -->
<div class="modal hide fade opportunity-modal" id="opportunityUpdateModal">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3><i class="icon-edit"></i>&nbsp;Edit Deal</h3>
	</div>
	<div class="modal-body">
		<form id="opportunityUpdateForm" name="opportunityUpdateForm" method="post">
			<fieldset>
				<input name="id" type="hidden"/>
				<input name="created_time" type="hidden"/>
				<input name="won_date" type="hidden"/>
				<div class="row-fluid">
					<div class="control-group span5">
						<label class="control-label"><b>Name </b><span
							class="field_req">*</span></label>
						<div class="controls">
							<span><input id="name" name="name" type="text"
								class=" required" placeholder="Name of Deal" /></span>
						</div>
					</div>
					<div class="control-group span5" style="margin-left: 30px;">
						<label class="control-label"><b>Owner </b><span
							class="field_req">*</span></label>
						<div class="controls" id="owners">
							<select id="owners-list" class="required" name="owner_id"></select>
							<img class="loading-img" src="img/21-0.gif"></img>
						</div>
					</div>
				</div>
				<div class="row-fluid">
					<div class="control-group span5">
						<label class="control-label"><b>Value </b><span
							class="field_req">*</span></label>
						<div class="controls">
							<span><input type="text" name="expected_value"
								class="required  number" max="1000000000000"
								placeholder="Value of Deal" /></span>
						</div>
					</div>
					<div class="control-group span5" style="margin-left: 30px;">
						<label class="control-label"><b>Probability (%) </b><span
							class="field_req">*</span></label>
						<div class="controls">
							<span><input type="text" id="probability"
								name="probability" class=" required digits" max="100"
								placeholder="Probability %" /></span>
						</div>
					</div>
				</div>
				<div class="row-fluid">
					<div class="control-group span5">
						<label class="control-label"><b>Milestone  </b><span
							class="field_req">*</span></label>
						<div class="controls">
							<span><select id="pipeline_milestone" name="pipeline_milestone"
								class="required">
									<option value="">Select..</option>
							</select></span><img class="loading-img" src="img/21-0.gif"></img>
						</div>
					</div>
					<div class="control-group span5" style="margin-left: 30px;">
						<label class="control-label"><b>Close Date </b></label>
						<div class="controls">
							<span><input id="close_date" type="text" name="close_date"
								class="input date" placeholder="MM/DD/YY" /></span>
						</div>
					</div>
					<input id="pipeline" name="pipeline_id" type="hidden"/>
					<input id="milestone" name="milestone" type="hidden"/>
				</div>
				<div class="control-group">
					<label class="control-label"><b>Related To </b></label>
					<div class="controls" id="contactTypeAhead">
						<div>
							<div class="pull-left">
								<ul name="contact_ids" class="contacts tagsinput tags"></ul>
							</div>
							<input type="text" id="relates_to" name="relates_to"
								placeholder="Contact Name" class="typeahead typeahead_contacts"
								data-provide="typeahead" data-mode="multiple" />
						</div>
					</div>
				</div>
				<div class="control-group hidden">	
					<label class="control-label">
					<input type="checkbox" id="archived" class="input" name="archived" style="margin: 0px 5px;">Archive </label>
				</div>
				<div id="custom-field-deals">
				</div>
				<div class="control-group">
					<label class="control-label"><b>Description </b></label>
					<div class="controls">
						<textarea id="description" name="description" rows="3"
							class="input" placeholder="Add Comment"></textarea>
					</div>
				</div>
				<div class="row-fluid">
					    <div class="control-group">
							
							<div id="forNoteForm" class="controls"></div>
							<ul style="display:none;" id="notes" name="notes" class="notes"></ul>
						</div>
				</div>
			</fieldset>
		</form>
	</div>
	<div class="modal-footer">
		<span class="error-status" style="color:red;"></span>
		<a href="#" class="btn" id="opportunity_archive" title="Archive deal">Archive</a>
		<a href="#" class="btn" id="opportunity_unarchive" title="Move Deal from Archive to Active state">Restore</a>
		<a href="#" class="btn btn-primary" id="opportunity_validate">Save
			Changes</a> <span class="save-status"></span>
	</div>
</div>
<!-- End of Modal views -->
<script id="dialpad-template" type="text/html">
<div id="dialpad_btns" class="dialpad_btns" style="display: block;width: 140px;"> 
  <div style="max-width: 100%;background-color: transparent;border-collapse: collapse;border-spacing: 0;display: table;">
   <div style="display: table-row-group;vertical-align: middle;border-color: inherit;"> 
     <div style="display: table-row;vertical-align: inherit;border-color: inherit;">
       <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="1" class="button1" id="button1" onclick="sipSendDTMF('1');"></div>
       <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="2" class="button2" id="button2" onclick="sipSendDTMF('2');"></div>
       <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="3" class="button3" id="button3" onclick="sipSendDTMF('3');"></div>
     </div>
     <div style="display: table-row;vertical-align: inherit;border-color: inherit;">
       <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="4" class="button4" id="button4" onclick="sipSendDTMF('4');"></div>
       <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="5" class="button5" id="button5" onclick="sipSendDTMF('5');"></div>
       <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="6" class="button6" id="button6" onclick="sipSendDTMF('6');"></div>
     </div>
     <div style="display: table-row;vertical-align: inherit;border-color: inherit;">
       <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="7" class="button7" id="button7" onclick="sipSendDTMF('7');"></div>
       <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="8" class="button8" id="button8" onclick="sipSendDTMF('8');"></div>
       <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="9" class="button9" id="button9" onclick="sipSendDTMF('9');"></div>
     </div>
     <div style="display: table-row;vertical-align: inherit;border-color: inherit;">
       <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="*" class="buttonstar" id="buttonstar" style="width:94%;" onclick="sipSendDTMF('*');"></div>
       <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="0" class="button0" id="button0" onclick="sipSendDTMF('0');"></div>
       <div style="display: table-cell;vertical-align: inherit;padding-bottom: 2px;padding-right: 1px;"><input type="button" value="#" class="buttonpound" id="buttonpound" onclick="sipSendDTMF('#');"></div>
     </div>
    </div>
  </div>
</div>
</script><script id="duplicate-contacts-model-template" type="text/html">
	<td style="cursor:default;" class="select_checkbox">
	<input class="tbody_check" type="checkbox"/>
	</td>
	<td class="data" data="{{id}}">
	<div class="row-fluid">
	<div style="display:inline;padding-right:5px;height:auto;">
	{{#if_contact_type "PERSON"}}
	<img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}"  width="40px" height="40px" style="display:inline; width:40px; height:40px; " />
	{{/if_contact_type}}

	{{#if_contact_type "COMPANY"}}
	<img class="thumbnail" {{getCompanyImage "40" "display:inline;"}} />
	{{/if_contact_type}}
	</div>
	<div style="height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:70%">
	{{#if_contact_type "PERSON"}}
	<b>	{{getPropertyValue properties "first_name"}}
	{{getPropertyValue properties "last_name"}} </b>
	<br />
	{{getPropertyValue properties "email"}}
	{{/if_contact_type}}

	{{#if_contact_type "COMPANY"}}
	<b>{{getPropertyValue properties "name"}}</b></br>
	{{getPropertyValue properties "url"}}
	{{/if_contact_type}}
	</div>
	</div>
	</td>
	<td><div style="display:inline-block;vertical-align:top;">{{getPropertyValue properties "title"}}<br />
	{{getPropertyValue properties "company"}}</div>
	</td>
	<td><div>{{getPropertyValue properties "phone"}}</div></td>	
	<td><div>{{epochToHumanDate "mm-dd-yy" created_time}}</div></td>
</script>

<script id="duplicate-contacts-collection-template" type="text/html">
	<div class="row">
	<div class="span12">
	<div class="page-header">
		
	<h1><span id="contact-heading">List of Duplicates</span> <small>{{duplicate_contacts_count}} </small> </h1>
	</div>
	</div>
	</div>
	
	<div class="row">
    <div class="span12">
        {{#unless this.length}}
        <div class="slate">
            <div class="slate-content">
                <div class="box-left">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right">
                    <h3>No duplicate records for this contact.</h3>
                </div>
            </div>
        </div>
        {{/unless}}

	
	{{#if this.length}}
	<div class="data">
	<div class="data-container"></div>
	<table class="table table-striped showCheckboxes noDelete">
	<thead>
	<tr>
	<th><input class="thead_check" type="checkbox"></input></th>
	<th>Name</th>
	<th>Work</th>
	<th>Phone</th>
	<th>Created Time</th>
	</tr>
	</thead>
	<tbody id="duplicate-contacts-model-list">
	</tbody>
	</table>
	<div class="row-fluid">
	<div class="span6  select-none">
	</div>
	</div>
	<a href="#merge-contacts" class="btn left btn-primary" id="duplicate-contacts-checked-grid" style="margin-bottom: 15px;position:relative"> Next</a>
	<a href="#contacts" class="btn" id="duplicate-contacts-cancel" style="margin-bottom: 15px;position:relative"> Cancel</a>
	</div>
	</div>
	{{/if}}
	</div>
</script>
<script type="text/html" id="email-report-categories-template">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h2>Email Reports</h2>
        </div>


<div id="general" class="row-fluid">

<!-- Contact reports -->
<div class="span4">
    <div class="well" style="width:220px; height:200px; text-align: center;">
        <!-- Icon and Title -->
        <div>
            <div style="padding:20px 70px 10px;">
                <i class="icon-group icon-4x"></i>
            </div>
            <b>Contact Reports</b>
        </div>
        <br />
        <!-- Description -->
        <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;margin-bottom: 20px;"  rel="tooltip" title="{{description}}">
            Get periodic email reports with a list of new leads, conversions, or as per your custom criteria.
        </div>
        <!-- Add button -->
        <div style="/*margin: 40px auto;	width: 50%;*/">
            <a class="btn btn-primary" href="#contact-reports">Go</a>
        </div>
    </div>
</div>


<!-- Activity reports -->

<div class="span4">
    <div class="well" style="width:220px; height:200px; text-align: center;">
        <!-- Icon and Title -->
        <div>
            <div style="padding:20px 70px 10px;">
                <i class="icon-cogs icon-4x"></i>
            </div>
            <b>Activity Reports</b>
        </div>
        <br />
        <!-- Description -->
        <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;margin-bottom: 20px;"  rel="tooltip" title="{{description}}">
          	Get a periodic  email digest of various activities by users in Agile.
        </div>
        <!-- Add button -->
        <div style="/*margin: 40px auto;	width: 50%;*/">
            <a class="btn btn-primary" href="#activity-reports">Go</a>
        </div>
    </div>
</div>

</script>

<script id="activity-report-collection-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1>Activity Reports</h1>
            <a href="#activity-report-add" id="addActivityReport" class="btn right" style="top:-28px;position:relative"><span><i class="icon-plus-sign" /></span>  Add Report</a>
        </div>
    </div>
</div>
<div class="row">
    <div class="span9">
		 <div id="slate">
         </div>
        {{#if this.length}}
        <table class="table table-bordered table-striped showCheckboxes" url="core/api/activity-reports/bulk">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Frequency</th>
					<th>Activity</th>
					<th>Users</th>
                </tr>
            </thead>
            <tbody id="activity-report-model-list" route="activity-report-edit/">
            </tbody>
        </table>
		{{/if}}
    </div>
    <div class="span3">
        <div class="well" id="addview">
            <h3>
                What are Activity Reports?
            </h3>
            <br />
            <p> Get a periodic email digest of various activities by users in Agile. This includes activities on Deals, Tasks, Calendar Events and Emails sent.</p>
        </div>
    </div>
</div>
</script>

<script id="activity-report-model-template" type="text/html">
	<td data="{{id}}" class="data" style="cursor:pointer"><a>{{name}}</a></td>
	<td>
    	{{ucfirst frequency}}
	</td>
	<td><div style="width:15em;text-transform:capitalize;">{{#if activity}}{{arrayToCamelcase activity}}{{/if}}</div></td>
	<td>
		{{namesFromObject usersList 'name'}}
	</td>
	<td>
	 	<a  data={{id}} id="activity-reports-email-now" >Send Now</a>
	</td>
<br />
</script>

<script id="activity-reports-add-template" type="text/html">
<div class="span12">
	<div class="well">
		<form id="activityReportsForm" class="form-horizontal">
				<div name="rules" class="formsection chainedSelect">
 					{{#if id}} 
                        <legend class="formheading"> Edit Activity Report</legend>
                      {{else}}
                        <legend class="formheading"><i class="icon-plus-sign"></i> Add Activity Report</legend>
                    {{/if}}
				<fieldset style="margin-left: -20px">
					<div class="control-group">
						<label class="control-label">Name<span class="field_req">*</span></label>
						<div class="controls">
							<input type="text" name="name" class="required" />
						</div>
					</div>

			<div class="control-group">
				<label class="control-label">Activity Type <span class="field_req">*</span></label>
				<div class="controls">
					<span style="margin:5px;display:block;">
						<a href="#" id="activity-type-list-select-all" class="">Select all</a> |
						<a href="#" id="activity-type-list-select-none" class="">Select none</a>
					</span>
					<select id="activity-type-list" name="activity" class="required" multiple="multiple">
						{{#hasMenuScope 'DEALS'}}
						<option value="DEAL">Deals</option>
						{{/hasMenuScope}}
						<option value="TASK">Task</option>
						<option value="EVENT">Event</option>
						<option value="EMAIL">Email</option>
						<option value="NOTES">Notes</option>
						{{#hasMenuScope 'DOCUMENT'}}
						<option value="DOCUMENTS">Documents</option>
						{{/hasMenuScope}}
						<option value="CALL">Calls</option>
					</select>
				</div>
			</div>

			<div class="control-group">
				<label class="control-label">Users <span class="field_req">*</span></label>
				<div class="controls" >
					<span style="margin:5px;display:block;">
						<a href="#" id="users-list-select-all" class="">Select all</a> | 
						<a href="#" id="users-list-select-none" class="">Select none</a>
					</span>
					<select id="users-list" name="user_ids" class="required" multiple="multiple">
					</select>
				</div>
			</div>

			<div class="control-group">
				<label class="control-label">Send Report To<span
					class="field_req">*</span></label>
				<div class="controls">
					<input type="text" name="sendTo" class="required" placeholder="Email addresses separated by comma"/>
				</div>
			</div>
			<div class="control-group ">
				<label class="control-label">Frequency<span
					class="field_req">*</span></label>
				<div class="controls">
					<select class="required" name="frequency" id="frequency">
					<option value="DAILY">Daily</option>
						<option value="WEEKLY">Weekly</option>
						<option value="MONTHLY">Monthly</option>
					</select>
				</div>
			</div>	
			<div class="control-group">
				<label class="control-label" ><a href="" id="activity_advanced" data-toggle="collapse" data-target="#activity-advanced-block"><span><i class="icon-plus"></i></span>&nbsp;Advanced</a></label>
			</div>
			<div class="collapse" id="activity-advanced-block">

<div class="control-group">
						<label class="control-label">Time Zone</label>
						<div class="controls">
							<select name="report_timezone" id="report_timezone">
					         <option value="Africa/Abidjan">
									Africa/Abidjan</option>
								<option value="Africa/Accra"> Africa/Accra</option>
								<option value="Africa/Algiers">
									Africa/Algiers</option>
								<option value="Africa/Addis_Ababa">
									Africa/Addis Ababa</option>
								<option value="Africa/Asmara"> Africa/Asmara</option>
								<option value="Africa/Bamako"> Africa/Bamako</option>
								<option value="Africa/Banjul"> Africa/Banjul</option>
								<option value="Africa/Bissau"> Africa/Bissau</option>
								<option value="Africa/Bangui"> Africa/Bangui</option>
								<option value="Africa/Brazzaville">
									Africa/Brazzaville</option>
								<option value="Africa/Blantyre">
									Africa/Blantyre</option>
								<option value="Africa/Bujumbura">
									Africa/Bujumbura</option>

								<option value="Africa/Conakry">
									Africa/Conakry</option>
								<option value="Africa/Casablanca">
									Africa/Casablanca</option>
								<option value="Africa/Cairo"> Africa/Cairo</option>
								<option value="Africa/Ceuta"> Africa/Ceuta</option>
								<option value="Africa/Dakar"> Africa/Dakar</option>
								<option value="Africa/Douala"> Africa/Douala</option>
								<option value="Africa/Dar_es_Salaam">
									Africa/Dar es Salaam</option>
								<option value="Africa/Djibouti">
									Africa/Djibouti</option>

								<option value="Africa/El_Aaiun"> Africa/El
									Aaiun</option>
								<option value="Africa/Freetown">
									Africa/Freetown</option>
								<option value="Africa/Gaborone">
									Africa/Gaborone</option>
								<option value="Africa/Harare"> Africa/Harare</option>
								<option value="Africa/Johannesburg">
									Africa/Johannesburg</option>
								<option value="Africa/Juba"> Africa/Juba</option>
								<option value="Africa/Kinshasa">
									Africa/Kinshasa</option>
								<option value="Africa/Kigali"> Africa/Kigali</option>
								<option value="Africa/Kampala">
									Africa/Kampala</option>
								<option value="Africa/Khartoum">
									Africa/Khartoum</option>
								<option value="Africa/Lome"> Africa/Lome</option>
								<option value="Africa/Lagos"> Africa/Lagos</option>
								<option value="Africa/Libreville">
									Africa/Libreville</option>
								<option value="Africa/Luanda"> Africa/Luanda</option>
								<option value="Africa/Lubumbashi">
									Africa/Lubumbashi</option>
								<option value="Africa/Lusaka"> Africa/Lusaka</option>

								<option value="Africa/Monrovia">
									Africa/Monrovia</option>
								<option value="Africa/Maputo"> Africa/Maputo</option>
								<option value="Africa/Maseru"> Africa/Maseru</option>
								<option value="Africa/Mbabane">
									Africa/Mbabane</option>
								<option value="Africa/Malabo"> Africa/Malabo</option>
								<option value="Africa/Mogadishu">
									Africa/Mogadishu</option>

								<option value="Africa/Nouakchott">
									Africa/Nouakchott</option>
								<option value="Africa/Ndjamena">
									Africa/Ndjamena</option>
								<option value="Africa/Niamey"> Africa/Niamey</option>
								<option value="Africa/Nairobi">
									Africa/Nairobi</option>
								<option value="Africa/Ouagadougou">
									Africa/Ouagadougou</option>
								<option value="Africa/Porto-Novo">
									Africa/Porto-Novo</option>
								<option value="Africa/Sao_Tome"> Africa/Sao
									Tome</option>
								<option value="Africa/Tunis"> Africa/Tunis</option>
								<option value="Africa/Tripoli">
									Africa/Tripoli</option>
								<option value="Africa/Windhoek">
									Africa/Windhoek</option>



								<option value="America/Adak"> America/Adak</option>
								<option value="America/Anchorage">
									America/Anchorage</option>
								<option value="America/Atikokan">
									America/Atikokan</option>
								<option value="America/Anguilla">
									America/Anguilla</option>
								<option value="America/Antigua">
									America/Antigua</option>
								<option value="America/Aruba"> America/Aruba</option>
								<option value="America/Araguaina">
									America/Araguaina</option>
								<option value="America/Argentina/Buenos_Aires">
									America/Argentina/Buenos Aires</option>
								<option value="America/Argentina/Catamarca">
									America/Argentina/Catamarca</option>
								<option value="America/Argentina/Cordoba">
									America/Argentina/Cordoba</option>
								<option value="America/Argentina/Jujuy">
									America/Argentina/Jujuy</option>
								<option value="America/Argentina/La_Rioja">
									America/Argentina/La Rioja</option>
								<option value="America/Argentina/Mendoza">
									America/Argentina/Mendoza</option>
								<option value="America/Argentina/Rio_Gallegos">
									America/Argentina/Rio Gallegos</option>
								<option value="America/Argentina/Salta">
									America/Argentina/Salta</option>
								<option value="America/Argentina/San_Juan">
									America/Argentina/San Juan</option>
								<option value="America/Argentina/San_Luis">
									America/Argentina/San Luis</option>
								<option value="America/Argentina/Tucuman">
									America/Argentina/Tucuman</option>
								<option value="America/Argentina/Ushuaia">
									America/Argentina/Ushuaia</option>
								<option value="America/Asuncion">
									America/Asuncion</option>
								<option value="America/Boise"> America/Boise</option>
								<option value="America/Bogota">
									America/Bogota</option>
								<option value="America/Bahia_Banderas">
									America/Bahia Banderas</option>
								<option value="America/Belize">
									America/Belize</option>
								<option value="America/Barbados">
									America/Barbados</option>
								<option value="America/Blanc-Sablon">
									America/Blanc-Sablon</option>
								<option value="America/Boa_Vista">
									America/Boa Vista</option>
								<option value="America/Bahia"> America/Bahia</option>
								<option value="America/Belem"> America/Belem</option>
								<option value="America/Cancun">
									America/Cancun</option>
								<option value="America/Chicago">
									America/Chicago</option>
								<option value="America/Costa_Rica">
									America/Costa Rica</option>
								<option value="America/Cambridge_Bay">America/Cambridge
									Bay</option>
								<option value="America/Chihuahua">
									America/Chihuahua</option>
								<option value="America/Creston">
									America/Creston</option>
								<option value="America/Cayman">
									America/Cayman</option>
								<option value="America/Caracas">
									America/Caracas</option>
								<option value="America/Curacao">
									America/Curacao</option>
								<option value="America/Campo_Grande">
									America/Campo Grande</option>
								<option value="America/Cayenne">
									America/Cayenne</option>
								<option value="America/Cuiaba">
									America/Cuiaba</option>
								<option value="America/Dawson_Creek">
									America/Dawson Creek</option>
								<option value="America/Dawson">
									America/Dawson</option>
								<option value="America/Denver">
									America/Denver</option>
								<option value="America/Detroit">
									America/Detroit</option>
								<option value="America/Dominica">
									America/Dominica</option>
								<option value="America/Danmarkshavn">
									America/Danmarkshavn</option>
								<option value="America/Edmonton">
									America/Edmonton</option>
								<option value="America/El_Salvador">
									America/El Salvador</option>
								<option value="America/Eirunepe">
									America/Eirunepe</option>
								<option value="America/Fortaleza">
									America/Fortaleza</option>
								<option value="America/Guatemala">
									America/Guatemala</option>
								<option value="America/Grand_Turk">
									America/Grand Turk</option>
								<option value="America/Guayaquil">
									America/Guayaquil</option>
								<option value="America/Glace_Bay">
									America/Glace Bay</option>
								<option value="America/Goose_Bay">
									America/Goose Bay</option>
								<option value="America/Grenada">
									America/Grenada</option>
								<option value="America/Guadeloupe">
									America/Guadeloupe</option>
								<option value="America/Guyana">
									America/Guyana</option>
								<option value="America/Godthab">
									America/Godthab</option>
								<option value="America/Hermosillo">
									America/Hermosillo</option>
								<option value="America/Havana">
									America/Havana</option>
								<option value="America/Halifax">
									America/Halifax</option>
								<option value="America/Inuvik">
									America/Inuvik</option>
								<option value="America/Indiana/Knox">
									America/Indiana/Knox</option>
								<option value="America/Indiana/Tell_City">
									America/Indiana/Tell City</option>
								<option value="America/Indiana/Indianapolis">
									America/Indiana/Indianapolis</option>
								<option value="America/Indiana/Marengo">
									America/Indiana/Marengo</option>
								<option value="America/Indiana/Petersburg">
									America/Indiana/Petersburg</option>
								<option value="America/Indiana/Vevay">
									America/Indiana/Vevay</option>
								<option value="America/Indiana/Vincennes">
									America/Indiana/Vincennes</option>
								<option value="America/Indiana/Winamac">
									America/Indiana/Winamac</option>
								<option value="America/Iqaluit">
									America/Iqaluit</option>
								<option value="America/Juneau">
									America/Juneau</option>
								<option value="America/Jamaica">
									America/Jamaica</option>
								<option value="America/Kentucky/Louisville">
									America/Kentucky/Louisville</option>
								<option value="America/Kentucky/Monticello">
									America/Kentucky/Monticello</option>
								<option value="America/Kralendijk">
									America/Kralendijk</option>
								<option value="America/Los_Angeles">
									America/Los Angeles</option>
								<option value="America/Lima"> America/Lima</option>
								<option value="America/La_Paz"> America/La
									Paz</option>
								<option value="America/Lower_Princes">
									America/Lower Princes</option>
								<option value="America/Metlakatla">
									America/Metlakatla</option>
								<option value="America/Mazatlan">
									America/Mazatlan</option>
								<option value="America/Managua">
									America/Managua</option>
								<option value="America/Matamoros">
									America/Matamoros</option>
								<option value="America/Menominee">
									America/Menominee</option>
								<option value="America/Merida">
									America/Merida</option>
								<option value="America/Mexico_City">
									America/Mexico City</option>
								<option value="America/Monterrey">
									America/Monterrey</option>
								<option value="America/Montreal">
									America/Montreal</option>
								<option value="America/Maceio">
									America/Maceio</option>
								<option value="America/Miquelon">
									America/Miquelon</option>
								<option value="America/Manaus">
									America/Manaus</option>
								<option value="America/Marigot">
									America/Marigot</option>
								<option value="America/Martinique">
									America/Martinique</option>
								<option value="America/Moncton">
									America/Moncton</option>
								<option value="America/Montserrat">
									America/Montserrat</option>
								<option value="America/Montevideo">
									America/Montevideo</option>
								<option value="America/Nome"> America/Nome</option>
								<option value="America/Noronha">
									America/Noronha</option>
								<option value="America/North_Dakota/Beulah">
									America/North Dakota/Beulah</option>
								<option value="America/North_Dakota/Center">
									America/North Dakota/Center</option>
								<option value="America/North_Dakota/New_Salem">
									America/North Dakota/New Salem</option>
								<option value="America/Nassau">
									America/Nassau</option>
								<option value="America/New_York"> America/New
									York</option>
								<option value="America/Nipigon">
									America/Nipigon</option>
								<option value="America/Ojinaga">
									America/Ojinaga</option>
								<option value="America/Phoenix">
									America/Phoenix</option>
								<option value="America/Panama">
									America/Panama</option>
								<option value="America/Pangnirtung">
									America/Pangnirtung</option>
								<option value="America/Port-au-Prince">
									America/Port-au-Prince</option>
								<option value="America/Port_of_Spain">
									America/Port of Spain</option>
								<option value="America/Porto_Velho">
									America/Porto Velho</option>
								<option value="America/Paramaribo">
									America/Paramaribo</option>
								<option value="America/Puerto_Rico">
									America/Puerto Rico</option>
								<option value="America/Rainy_River">
									America/Rainy River</option>
								<option value="America/Rankin_Inlet">
									America/Rankin Inlet</option>
								<option value="America/Regina">
									America/Regina</option>
								<option value="America/Resolute">
									America/Resolute</option>
								<option value="America/Rio_Branco">
									America/Rio Branco</option>

								<option value="America/Recife">
									America/Recife</option>

								<option value="America/Sitka"> America/Sitka</option>
								<option value="America/Santa_Isabel">
									America/Santa Isabel</option>
								<option value="America/Shiprock">
									America/Shiprock</option>
								<option value="America/Swift_Current">
									America/Swift Current</option>
								<option value="America/Santarem">
									America/Santarem</option>
								<option value="America/Santiago">
									America/Santiago</option>
								<option value="America/Santo_Domingo">
									America/Santo Domingo</option>
								<option value="America/St_Barthelemy">
									America/St Barthelemy</option>
								<option value="America/St_Kitts"> America/St
									Kitts</option>
								<option value="America/St_Lucia"> America/St
									Lucia</option>
								<option value="America/St_Thomas"> America/St
									Thomas</option>
								<option value="America/St_Vincent">
									America/St Vincent</option>
								<option value="America/St_Johns"> America/St
									Johns</option>
								<option value="Atlantic/Stanley">
									Atlantic/Stanley</option>
								<option value="America/Sao_Paulo">
									America/Sao Paulo</option>
								<option value="America/Scoresbysund">
									America/Scoresbysund</option>
								<option value="America/Tijuana">
									America/Tijuana</option>
								<option value="America/Tegucigalpa">
									America/Tegucigalpa</option>
								<option value="America/Thunder_Bay">
									America/Thunder Bay</option>
								<option value="America/Toronto">
									America/Toronto</option>
								<option value="America/Thule"> America/Thule</option>
								<option value="America/Tortola">
									America/Tortola</option>
								<option value="America/Vancouver">
									America/Vancouver</option>
								<option value="America/Yakutat">
									America/Yakutat</option>

								<option value="America/Yellowknife">
									America/Yellowknife</option>
								<option value="America/Whitehorse">
									America/Whitehorse</option>
								<option value="America/Winnipeg">
									America/Winnipeg</option>





								<option value="Antarctica/Davis">
									Antarctica/Davis</option>
								<option value="Antarctica/DumontDUrville">
									Antarctica/DumontDUrville</option>

								<option value="Antarctica/Mawson">Antarctica/Mawson</option>
								<option value="Antarctica/Macquarie">
									Antarctica/Macquarie</option>
								<option value="Antarctica/McMurdo">
									Antarctica/McMurdo</option>
								<option value="Antarctica/Palmer">
									Antarctica/Palmer</option>
								<option value="Antarctica/Rothera">
									Antarctica/Rothera</option>
								<option value="Antarctica/Syowa">
									Antarctica/Syowa</option>
								<option value="Antarctica/South_Pole">
									Antarctica/South Pole</option>
								<option value="Antarctica/Vostok">
									Antarctica/Vostok</option>
                                                                <option value="Antarctica/Casey">
									Antarctica/Casey</option>
                                                                <option value="Antarctica/Palmer">
									Antarctica/Palmer</option>
								<option value="Antarctica/Rothera">
									Antarctica/Rothera</option>

								<option value="Asia/Aden"> Asia/Aden</option>
								<option value="Asia/Amman"> Asia/Amman</option>
								<option value="Asia/Aqtau"> Asia/Aqtau</option>
								<option value="Asia/Aqtobe"> Asia/Aqtobe</option>
								<option value="Asia/Ashgabat"> Asia/Ashgabat</option>
								<option value="Asia/Almaty"> Asia/Almaty</option>
								<option value="Asia/Anadyr"> Asia/Anadyr</option>
								<option value="Asia/Baghdad"> Asia/Baghdad</option>
								<option value="Asia/Bahrain"> Asia/Bahrain</option>
								<option value="Asia/Beirut"> Asia/Beirut</option>
								<option value="Asia/Baku"> Asia/Baku</option>
								<option value="Asia/Bishkek"> Asia/Bishkek</option>
								<option value="Asia/Bangkok"> Asia/Bangkok</option>


								<option value="Asia/Brunei"> Asia/Brunei</option>

								<option value="Asia/Colombo"> Asia/Colombo</option>
								<option value="Asia/Choibalsan">
									Asia/Choibalsan</option>
								<option value="Asia/Chongqing">
									Asia/Chongqing</option>
								<option value="Asia/Damascus"> Asia/Damascus</option>
								<option value="Asia/Dubai"> Asia/Dubai</option>
								<option value="Asia/Dushanbe"> Asia/Dushanbe</option>
								<option value="Asia/Dhaka"> Asia/Dhaka</option>
								<option value="Asia/Dili"> Asia/Dili</option>


								<option value="Asia/Gaza"> Asia/Gaza</option>
								<option value="Asia/Hebron"> Asia/Hebron</option>
								<option value="Asia/Hovd"> Asia/Hovd</option>
								<option value="Asia/Ho_Chi_Minh"> Asia/Ho Chi
									Minh</option>
								<option value="Asia/Harbin"> Asia/Harbin</option>
								<option value="Asia/Hong_Kong"> Asia/Hong
									Kong</option>

								<option value="Asia/Irkutsk"> Asia/Irkutsk</option>

								<option value="Asia/Jerusalem">
									Asia/Jerusalem</option>
								<option value="Asia/Jakarta"> Asia/Jakarta</option>
								<option value="Asia/Jayapura"> Asia/Jayapura</option>
								<option value="Asia/Kuwait"> Asia/Kuwait</option>
								<option value="Asia/Kabul"> Asia/Kabul</option>
								<option value="Asia/Karachi"> Asia/Karachi</option>
								<option value="Asia/Kolkata"> Asia/Kolkata</option>
								<option value="Asia/Kathmandu">
									Asia/Kathmandu</option>
								<option value="Asia/Khandyga"> Asia/Khandyga</option>
								<option value="Asia/Kashgar"> Asia/Kashgar</option>
								<option value="Asia/Krasnoyarsk">
									Asia/Krasnoyarsk</option>
								<option value="Asia/Kuala_Lumpur"> Asia/Kuala
									Lumpur</option>
								<option value="Asia/Kuching"> Asia/Kuching</option>
								<option value="Asia/Kamchatka">
									Asia/Kamchatka</option>
								<option value="Asia/Muscat"> Asia/Muscat</option>
								<option value="Asia/Macau"> Asia/Macau</option>
								<option value="Asia/Makassar"> Asia/Makassar</option>
								<option value="Asia/Manila"> Asia/Manila</option>
								<option value="Asia/Magadan"> Asia/Magadan</option>
								<option value="Asia/Nicosia"> Asia/Nicosia</option>
								<option value="Asia/Novokuznetsk">
									Asia/Novokuznetsk</option>
								<option value="Asia/Novosibirsk">
									Asia/Novosibirsk</option>


								<option value="Asia/Oral"> Asia/Oral</option>
								<option value="Asia/Omsk"> Asia/Omsk</option>
								<option value="Asia/Phnom_Penh"> Asia/Phnom
									Penh</option>
								<option value="Asia/Pontianak">
									Asia/Pontianak</option>
								<option value="Asia/Pyongyang">
									Asia/Pyongyang</option>
								<option value="Asia/Qatar"> Asia/Qatar</option>
								<option value="Asia/Qyzylorda">
									Asia/Qyzylorda</option>
								<option value="Asia/Riyadh"> Asia/Riyadh</option>
								<option value="Asia/Rangoon"> Asia/Rangoon</option>
								<option value="Asia/Samarkand">
									Asia/Samarkand</option>
								<option value="Asia/Shanghai"> Asia/Shanghai</option>
								<option value="Asia/Singapore">
									Asia/Singapore</option>
								<option value="Asia/Seoul"> Asia/Seoul</option>
								<option value="Asia/Sakhalin"> Asia/Sakhalin</option>
								<option value="Asia/Tashkent"> Asia/Tashkent</option>
								<option value="Asia/Tokyo"> Asia/Tokyo</option>
								<option value="Asia/Taipei"> Asia/Taipei</option>

								<option value="Asia/Tbilisi"> Asia/Tbilisi</option>
								<option value="Asia/Tehran"> Asia/Tehran</option>
								<option value="Asia/Thimphu"> Asia/Thimphu</option>
								<option value="Asia/Ulaanbaatar">
									Asia/Ulaanbaatar</option>
								<option value="Asia/Urumqi"> Asia/Urumqi</option>
								<option value="Asia/Ust-Nera"> Asia/Ust-Nera</option>
								<option value="Asia/Vientiane">
									Asia/Vientiane</option>
								<option value="Asia/Vladivostok">
									Asia/Vladivostok</option>

								<option value="Asia/Yerevan"> Asia/Yerevan</option>
								<option value="Asia/Yekaterinburg">
									Asia/Yekaterinburg</option>
								<option value="Asia/Yakutsk"> Asia/Yakutsk</option>
								<option value="Australia/Adelaide">
									Australia/Adelaide</option>
								<option value="Australia/Broken_Hill">
									Australia/Broken Hill</option>
								<option value="Australia/Brisbane">
									Australia/Brisbane</option>
								<option value="Australia/Currie">
									Australia/Currie</option>
								<option value="Australia/Darwin">
									Australia/Darwin</option>
								<option value="Australia/Eucla">
									Australia/Eucla</option>
								<option value="Australia/Hobart">
									Australia/Hobart</option>
								<option value="Australia/Lindeman">
									Australia/Lindeman</option>
								<option value="Australia/Lord_Howe">
									Australia/Lord Howe</option>
								<option value="Australia/Melbourne">
									Australia/Melbourne</option>
								<option value="Australia/Perth">
									Australia/Perth</option>
								<option value="Australia/Sydney">
									Australia/Sydney</option>
								<option value="Atlantic/Azores">
									Atlantic/Azores</option>
								<option value="Atlantic/Bermuda">
									Atlantic/Bermuda</option>
								<option value="Atlantic/Cape_Verde">
									Atlantic/Cape Verde</option>
								<option value="Atlantic/Canary">
									Atlantic/Canary</option>
								<option value="Atlantic/Faroe">
									Atlantic/Faroe</option>
								<option value="Arctic/Longyearbyen">
									Arctic/Longyearbyen</option>
								<option value="Atlantic/Madeira">
									Atlantic/Madeira</option>
								<option value="Atlantic/Reykjavik">
									Atlantic/Reykjavik</option>
								<option value="Atlantic/South_Georgia">
									Atlantic/South Georgia</option>
								<option value="Atlantic/Stanley">
									Atlantic/Stanley</option>

								<option value="Atlantic/St_Helena">
									Atlantic/St Helena</option>
								<option value="Canada/Atlantic">
									Canada/Atlantic</option>
								<option value="Canada/Central">
									Canada/Central</option>

								<option value="Canada/Eastern">
									Canada/Eastern</option>
								<option value="Canada/Mountain">
									Canada/Mountain</option>
								<option value="Canada/Newfoundland">
									Canada/Newfoundland</option>
								<option value="Canada/Pacific">
									Canada/Pacific</option>


								<option value="Europe/Amsterdam">
									Europe/Amsterdam</option>
								<option value="Europe/Andorra">
									Europe/Andorra</option>
								<option value="Europe/Athens"> Europe/Athens</option>
								<option value="Europe/Belgrade">
									Europe/Belgrade</option>
								<option value="Europe/Berlin"> Europe/Berlin</option>
								<option value="Europe/Bratislava">
									Europe/Bratislava</option>
								<option value="Europe/Brussels">
									Europe/Brussels</option>
								<option value="Europe/Budapest">
									Europe/Budapest</option>
								<option value="Europe/Busingen">
									Europe/Busingen</option>
								<option value="Europe/Bucharest">
									Europe/Bucharest</option>
								<option value="Europe/Copenhagen">
									Europe/Copenhagen</option>
								<option value="Europe/Chisinau">
									Europe/Chisinau</option>
								<option value="Europe/Dublin"> Europe/Dublin</option>
								<option value="Europe/Guernsey">
									Europe/Guernsey</option>
								<option value="Europe/Gibraltar">
									Europe/Gibraltar</option>
								<option value="Europe/Helsinki">
									Europe/Helsinki</option>

								<option value="Europe/Isle_of_Man">
									Europe/Isle of Man</option>
								<option value="Europe/Istanbul">
									Europe/Istanbul</option>
								<option value="Europe/Jersey"> Europe/Jersey</option>
								<option value="Europe/Kaliningrad">
									Europe/Kaliningrad</option>
								<option value="Europe/Kiev"> Europe/Kiev</option>
								<option value="Europe/Lisbon"> Europe/Lisbon</option>
								<option value="Europe/London"> Europe/London</option>
								<option value="Europe/Ljubljana">
									Europe/Ljubljana</option>
								<option value="Europe/Luxembourg">
									Europe/Luxembourg</option>
								<option value="Europe/Madrid"> Europe/Madrid</option>
								<option value="Europe/Malta"> Europe/Malta</option>
								<option value="Europe/Monaco"> Europe/Monaco</option>
								<option value="Europe/Mariehamn">
									Europe/Mariehamn</option>
								<option value="Europe/Minsk"> Europe/Minsk</option>
								<option value="Europe/Moscow"> Europe/Moscow</option>
								<option value="Europe/Oslo"> Europe/Oslo</option>
								<option value="Europe/Paris"> Europe/Paris</option>
								<option value="Europe/Podgorica">
									Europe/Podgorica</option>
								<option value="Europe/Prague"> Europe/Prague</option>

								<option value="Europe/Rome"> Europe/Rome</option>
								<option value="Europe/Riga"> Europe/Riga</option>
								<option value="Europe/San_Marino"> Europe/San
									Marino</option>
								<option value="Europe/Sarajevo">
									Europe/Sarajevo</option>
								<option value="Europe/Skopje"> Europe/Skopje</option>
								<option value="Europe/Stockholm">
									Europe/Stockholm</option>
								<option value="Europe/Simferopol">
									Europe/Simferopol</option>
								<option value="Europe/Sofia"> Europe/Sofia</option>
								<option value="Europe/Samara"> Europe/Samara</option>

								<option value="Europe/Tirane"> Europe/Tirane</option>
								<option value="Europe/Tallinn">
									Europe/Tallinn</option>
								<option value="Europe/Uzhgorod">
									Europe/Uzhgorod</option>

								<option value="Europe/Vaduz"> Europe/Vaduz</option>
								<option value="Europe/Vatican">
									Europe/Vatican</option>
								<option value="Europe/Vienna"> Europe/Vienna</option>
								<option value="Europe/Vilnius">
									Europe/Vilnius</option>
								<option value="Europe/Volgograd">
									Europe/Volgograd</option>
								<option value="Europe/Warsaw"> Europe/Warsaw</option>
								<option value="Europe/Zaporozhye">
									Europe/Zaporozhye</option>
								<option value="Europe/Zagreb"> Europe/Zagreb</option>
								<option value="Europe/Zurich"> Europe/Zurich</option>
								<option value="Indian/Antananarivo">
									Indian/Antananarivo</option>
								<option value="Indian/Comoro"> Indian/Comoro</option>
								<option value="Indian/Chagos"> Indian/Chagos</option>
								<option value="Indian/Cocos"> Indian/Cocos</option>
								<option value="Indian/Christmas">
									Indian/Christmas</option>
								

								<option value="Indian/Kerguelen">
									Indian/Kerguelen</option>
								<option value="Indian/Mayotte">
									Indian/Mayotte</option>
								<option value="Indian/Mahe"> Indian/Mahe</option>
								<option value="Indian/Mauritius">
									Indian/Mauritius</option>
								<option value="Indian/Maldives">
									Indian/Maldives</option>
								<option value="Indian/Reunion">
									Indian/Reunion</option>


								<option value="Pacific/Auckland">
									Pacific/Auckland</option>
								<option value="Pacific/Apia"> Pacific/Apia</option>


								<option value="Pacific/Chuuk"> Pacific/Chuuk</option>
								<option value="Pacific/Chatham">
									Pacific/Chatham</option>
								<option value="Pacific/Easter">
									Pacific/Easter</option>
								<option value="Pacific/Efate"> Pacific/Efate</option>
								<option value="Pacific/Enderbury">
									Pacific/Enderbury</option>


								<option value="Pacific/Fiji"> Pacific/Fiji</option>
								<option value="Pacific/Funafuti">
									Pacific/Funafuti</option>
								<option value="Pacific/Fakaofo">
									Pacific/Fakaofo</option>

								<option value="Pacific/Galapagos">
									Pacific/Galapagos</option>
								<option value="Pacific/Gambier">
									Pacific/Gambier</option>
								<option value="Pacific/Guam"> Pacific/Guam</option>
								<option value="Pacific/Guadalcanal">
									Pacific/Guadalcanal</option>
								<option value="Pacific/Honolulu">
									Pacific/Honolulu</option>
								<option value="US/Hawaii"> US/Hawaii</option>
								<option value="Pacific/Johnston">
									Pacific/Johnston</option>
								<option value="Pacific/Kosrae">
									Pacific/Kosrae</option>
								<option value="Pacific/Kwajalein">
									Pacific/Kwajalein</option>
								<option value="Pacific/Kiritimati">
									Pacific/Kiritimati</option>




								<option value="Pacific/Marquesas">
									Pacific/Marquesas</option>
								<option value="Pacific/Midway">
									Pacific/Midway</option>
								<option value="Pacific/Majuro">
									Pacific/Majuro</option>
								<option value="Pacific/Niue"> Pacific/Niue</option>


								<option value="Pacific/Noumea">
									Pacific/Noumea</option>
								<option value="Pacific/Norfolk">
									Pacific/Norfolk</option>
								<option value="Pacific/Nauru"> Pacific/Nauru</option>

								<option value="Pacific/Pitcairn">
									Pacific/Pitcairn</option>
								<option value="Pacific/Pago_Pago">
									Pacific/Pago Pago</option>
								<option value="Pacific/Palau"> Pacific/Palau</option>
								<option value="Pacific/Port_Moresby">
									Pacific/Port Moresby</option>
								<option value="Pacific/Pohnpei">
									Pacific/Pohnpei</option>

								<option value="Pacific/Rarotonga">
									Pacific/Rarotonga</option>
								<option value="Pacific/Saipan">
									Pacific/Saipan</option>
								<option value="Pacific/Tahiti">
									Pacific/Tahiti</option>
								<option value="Pacific/Tarawa">
									Pacific/Tarawa</option>
								<option value="Pacific/Tongatapu">
									Pacific/Tongatapu</option>
								<option value="Pacific/Wake"> Pacific/Wake</option>
								<option value="Pacific/Wallis">
									Pacific/Wallis</option>
								<option value="US/Arizona"> US/Arizona</option>
								<option value="US/Pacific"> US/Pacific</option>
								<option value="US/Central"> US/Central</option>
								<option value="US/Alaska"> US/Alaska</option>
								<option value="US/Mountain"> US/Mountain</option>
								<option value="US/Eastern"> US/Eastern</option>


								<option value="GMT"> GMT</option>
								<option value="UTC"> UTC</option>

							</select>
						</div>
					</div>
            <div class="control-group" id="activity_report_day" style="display:none;">
				<label class="control-label">Day of Month</label>
				<div class="controls">
					<select name="activity_day" > 
                    <option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
					<option value="6">6</option>
					<option value="7">7</option>
					<option value="8">8</option>
					<option value="9">9</option>
					<option value="10">10</option>
					<option value="11">11</option>
					<option value="12">12</option>
					<option value="13">13</option>
					<option value="14">14</option>
					<option value="15">15</option>
					<option value="16">16</option>
					<option value="17">17</option>
					<option value="18">18</option>
					<option value="19">19</option>
					<option value="20">20</option>
					<option value="21">21</option>
					<option value="22">22</option>
					<option value="23">23</option>
					<option value="24">24</option>
					<option value="25">25</option>
					<option value="26">26</option>
					<option value="27">27</option>
					<option value="28">28</option>
					<option value="29">29</option>
					<option value="30">30</option>

				</select>
				</div>
			</div>
            <div class="control-group" id="activity_report_weekday" style="display:none;">
				<label class="control-label">Day</label>
				<div class="controls">
					<select name="activity_weekday"> 
						<option value="2">Monday</option>
					    <option value="3">Tuesday</option>
					    <option value="4">Wednesday</option>
						<option value="5">Thursday</option>
						<option value="6">Friday</option>
						<option value="7">Saturday</option>
                       <option value="1">Sunday</option>
						
                   </select>
				</div>
			</div>	
			<div class="control-group" id="activity_report_time">
				<label class="control-label">Time</label>
				<div class="controls">
					 <input type="text" name="activity_time" class="activity_time_timepicker input-small " id="activity_time"  placeholder="time" />
				</div>
			</div>	
			
			
			</div>			
			{{#if id}} <input type="hidden" name="id" class="hide" value="{{id}}" />
			{{/if}}
			<div class="form-actions">
				<a href="#" type="submit" class="save btn btn-primary"
					id="filtersAdd">Save</a>
				 <a href="#activity-reports" class="btn ">Close</a>
			</div>
			</fieldset>
		</form>
	</div>
</div>
</script>
<script id="empty-collection-model-template" type="text/html">
<div class="slate">
    <div class="slate-content">
        
			{{#if image}}	
				<div class="box-left">
 	           		<img alt="Clipboard" src="{{image}}" />
				</div>
				{{else}}
					{{#if icon}}
						{{#if description}}
							<div class="box-left" style="margin-top:15px">
								<i class="{{icon}}"></i>
							</div>
						{{else}}
							<div class="box-left" style="margin-top:5px">
								<i class="{{icon}}"></i>
							</div>
						{{/if}}
					{{/if}}
			{{/if}}
        
		{{#if icon}}
	        	<div class="box-right" style="margin-left:60px !important">
			{{else}}
				<div class="box-right">
		{{/if}}
            <h3>{{title}}</h3>
            {{#if description}}<div class="text">{{{description}}}</div>{{/if}}
			{{#if learn_more}}
            	<a href="#">{{learn_more}}</a><br />
			{{/if}}
            
            {{#if modal_id}}
            	<a href="{{route}}" modal_id="{{modal_id}}" class="modal-form btn blue btn-slate-action"><i class="icon-plus-sign"></i>  {{button_text}}</a>
            {{else}}
				{{#if button_text}}
            		<a href="{{route}}" class="btn blue btn-slate-action"><i class="icon-plus-sign"></i>  {{button_text}}</a>
				{{/if}}
            {{/if}}
        </div>
    </div>
</div>
</script><script id="future-collection-template" type="text/html">
{{#unless this.length}}
<div class="slate" style="padding:5px 2px;">
    <div class="slate-content" style="text-align:center;">
        <h4>You have no Events</h4>
    </div>
</div>
{{/unless}}
{{#if this.length}}
<div class="future_event_group">
       
        <table class="table hide table-striped " style="overflow:hidden!important">
            <div id="today-heading" style="display: none"><b>Today</b></div>
            
            <tbody id="today-event" style="display: inline;display: table;width: 100%;"></tbody>
        </table>

        <table class="table hide table-striped" style="overflow:hidden!important;">
            <div id="tomorrow-heading" style="display: none"><b>Tomorrow</b></div>
            
            <tbody id="tomorrow-event" style="display: inline;display: table;width: 100%;"></tbody>
        </table>

        <table class="table hide table-striped" style="overflow:hidden!important;">
            <div id="next-week-heading" style="display: none"><b>Later</b></div>
            <tbody id="next-week-event" style="display: inline;display: table;width: 100%;"></tbody>
        </table>

</div>
{{/if}}
</script>

<script id="future-model-template" type="text/html">

<td class="e_owner" style="width:60px;cursor: pointer;" onclick=show_model({{id}})>
    <div>
	{{#if ownerPic}}
        	<img class="thumbnail" src="{{ownerPic}}" width="40px" height="40px" title="{{eventOwner.name}}"/>
	{{else}}
			<img class="thumbnail" src="{{defaultGravatarurl 50}}" width="40px" height="40px" title="{{eventOwner.name}}"/>
	{{/if}}
  </div>
</td>

<td onclick=show_model({{id}}) style="cursor:pointer">
<div class="row" style="margin-left: 1px;">
<div class="span8">
<div class="line-clamp">{{title}}</div></div>

<div class="span4" style="text-align:right">
<div class="ellipsis-multiline" style="line-height:20px !important;height: auto !important; word-break:keep-all;">  
<span class="label" style="background-color:{{color}}">{{event_priority color}}</span></div>
</div>
</div>

<div class="clearfix"></div>

<div class="row" style="margin-left: 1px;">
<div class="span4">{{getCustomDateWithTime start end}}</div>

<div class="span8 contact_text" style="text-align:right;">
{{#if contacts.length}} 
<div class="ctx contact_text">  
        {{#each contacts}}<a  href ="#contact/{{this.id}}">{{#if_contact_type "PERSON"}}
        		{{getPropertyValue properties "first_name"}}
        		{{getPropertyValue properties "last_name"}} 
        		
        	{{/if_contact_type}}{{#if_contact_type "COMPANY"}}{{getPropertyValue properties "name"}}{{/if_contact_type}},</a> {{/each}}  
        
    </div>
{{/if}}
</div>
</div> 

</td>

</script>


<script id="events-collection-template" type="text/html">
{{#unless this.length}}
<div class="slate" style="padding:5px 2px;">
    <div class="slate-content" style="text-align:center;">
        <h4>You have no Events</h4>
    </div>
</div>
{{/unless}}
{{#if this.length}}
        <table class="table hide table-striped" style="overflow:hidden!important;">
            <tbody id="eventAll" style="display: table;width:100%"></tbody>
        </table>
{{/if}}
</script>

<script id="events-model-template" type="text/html">

<td class="e_owner" style="width:60px;cursor: pointer;" onclick=show_model({{id}})>
 <div>
	{{#if ownerPic}}
        	<img class="thumbnail" src="{{ownerPic}}" width="40px" height="40px" title="{{eventOwner.name}}"/>
	{{else}}
			<img class="thumbnail" src="{{defaultGravatarurl 50}}" width="40px" height="40px" title="{{eventOwner.name}}"/>
	{{/if}}
  </div>
</td>
<td style="cursor: pointer;"  onclick=show_model({{id}})>
<div class="row" style="margin-left: 1px;">
<div class="span8">
<div class="line-clamp">{{title}}</div></div>

<div class="span4" style="text-align:right">
<div class="ellipsis-multiline" style="line-height:20px !important;height: auto !important; word-break:keep-all;">  
<span class="label" style="background-color:{{color}}">{{event_priority color}}</span></div>
</div>
</div>

<div class="clearfix"></div>

<div class="row" style="margin-left: 1px;">
<div class="span5"  style="cursor: pointer;">{{getCustomDateWithTime start end}}</div>

<div class="span7" style="text-align:right;">
{{#if contacts.length}} 
<div class="ctx contact_text">  
        {{#each contacts}}<a class="contact_text" href="#contact/{{this.id}}">{{#if_contact_type "PERSON"}}
        		{{getPropertyValue properties "first_name"}}
        		{{getPropertyValue properties "last_name"}} 
        		
        	{{/if_contact_type}}{{#if_contact_type "COMPANY"}}{{getPropertyValue properties "name"}}{{/if_contact_type}}
        
<span>,</span></a> {{/each}}  
        
    </div>
{{/if}}
</div>
</div> 

</td>

</script>




<script id="google-event-collection-template" type="text/html">

{{#unless this.length}}
<div class="slate" style="padding:5px 2px;">
    <div class="slate-content" style="text-align:center;">
        <h4>You have no Events</h4>
    </div>
</div>
{{/unless}}
{{#if this.length}}
        <table class="table hide table-striped" style="overflow:hidden!important;">
            <tbody id="google_event" style="display: table;width:100%"></tbody>
        </table>
{{/if}}
</script>

<script id="google-event-model-template" type="text/html">

<td>
<div class="row" style="height: 23px;margin-left:1px">
<div class="span8" style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden">{{title}}</div>

<div class="span4 pull-right" style="text-align:right">
<div class="ellipsis-multiline" style="line-height:20px !important;height: auto !important; word-break:keep-all;">  
<span class="label">Google Event</span></div>
</div>


</div>
<div class="clearfix"></div>
<div class="row" style="height: 23px;margin-left:1px">
<div class="span4">{{getGoogleEventCustomTime start end}}</div>

<div class="span8 pull-right" style="overflow-x: auto;text-align:right;">
{{#if contacts.length}} 
<div class="ellipsis-multiline contact_text" style="line-height:20px !important; height: auto !important;">  
        {{#each contacts}}<span class="label">{{getContactDisplayValue this}}</span> {{/each}}  
        
    </div>
{{/if}}
</div>

</div>

</td>
</script>


<script id="googleEventCategorization-collection-template" type="text/html">
    
</header>
{{#unless this.length}}
<div class="slate" style="padding:5px 2px;">
    <div class="slate-content" style="text-align:center;">
        <h4>You have no Events</h4>
    </div>
</div>
{{/unless}}
{{#if this.length}}
<div class="future_event_group">
       
        <table class="table hide table-striped" style="overflow:hidden!important">
            <div id="today-heading" style="display: none"><b>Today</b></div>
            
            <tbody id="today-event" style="display: inline;display: table;width: 100%;"></tbody>
        </table>

        <table class="table hide table-striped" style="overflow:hidden!important;">
            <div id="tomorrow-heading" style="display: none"><b>Tomorrow</b></div>
            
            <tbody id="tomorrow-event" style="display: inline;display: table;width: 100%;"></tbody>
        </table>

        <table class="table hide table-striped" style="overflow:hidden!important;">
            <div id="next-week-heading" style="display: none"><b>Later</b></div>
            <tbody id="next-week-event" style="display: inline;display: table;width: 100%;"></tbody>
        </table>

</div>
{{/if}}
</script>

<script id="googleEventCategorization-model-template" type="text/html">
<td>
<div class="row" style="height: 23px;margin-left:1px;">
<div class="span8" style="overflow: hidden;">{{title}}</div>
<div class="span4 pull-right" style="text-align:right;">
<div class="ellipsis-multiline" style="line-height:20px !important;height: auto !important; word-break:keep-all;">  
<span class="label">Google Event</span></div>
</div>

</div>

<div class="clearfix"></div>

<div class="row" style="height: 23px;margin-left:1px;">
<div class="span4">{{getGoogleEventCustomTime start end}}</div>

<div class="span8 pull-right" style="overflow-x: auto;text-align:right;">
{{#if contacts.length}} 
<div class="ellipsis-multiline contact_text" style="line-height:20px !important;height: auto !important; word-break:keep-all;white-space: nowrap;">  
        {{#each contacts}}<span class="label">{{getContactDisplayValue this}}</span> {{/each}}  
        
    </div>
{{/if}}
</div>


</div>

</td>
</script>

<script id="help-mail-form-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1>Email Us</h1>
        </div>
    </div>
</div>
<div class="row">
	<div class="span9">
    	<div class="well clearfix">
        	<form id="helpmailForm" name="helpmailForm" class="form-horizontal" style="margin-top: 20px;">
            	<fieldset>
                	<div class="control-group">
                    	<label class="control-label">To</label>
                    	<div class="controls">
                        	<select class="select-xlarge" name="to">
                            	<option value="care@agilecrm.com">Support</option>
                            	<option value="sales@agilecrm.com">Sales</option>
                        	</select>
                    	</div>
                	</div>
                	<div class="control-group">
                    	<label class="control-label">Subject <span class="field_req">*</span></label>
                    	<div class="controls">
                        	<input type="text" class="input-xlarge required" name="subject" id="subject" placeholder="About" />
                    	</div>
                	</div>
                	<div class="control-group">
                    	<label class="control-label">Message <span class="field_req">*</span></label>
                    	<div class="controls">
                        	<textarea class="input-xlarge required" rows="8" name="body" id="body" placeholder="Description"></textarea>
                    	</div>
                	</div>
                	<div class="form-actions">  
                    	<a href="#" id="helpMail" class="btn btn-primary">Send</a>        
                    	<a onclick="history.back();" style="cursor:pointer;" class="btn">Cancel</a>&nbsp;&nbsp;<span id="msg"></span> 
                	</div>
            	</fieldset>
        	</form>
    	</div>
	</div>
</div>
</script><script id="show-help-template" type="text/html">
	<div id="show-help" class="modal hide" data-backdrop="static">
		<div class="modal-header">
            <button class="close" data-dismiss="modal">x</button>
			<h3>Getting Started with Agile CRM</h3>
		</div>
		<div class="modal-body help-text">

<h4><strong><i class="icon-link icon-white"></i>&nbsp;&nbsp; Set up API on your website</strong></h4>
<p>Start collecting contacts from website and track them using the <a href="#analytics-code" class="hide-modal">API</a>. </p>

<h4><strong><i class="icon-user icon-white"></i>&nbsp;&nbsp; Add contacts</strong></h4> 
<p>You can <a href="#contacts" class="hide-modal">add contacts</a> manually from the Contacts tab. You can also try <a href="#import" class="hide-modal">importing</a> them.</p>

<h4><strong><i class="icon-envelope-alt icon-white"></i>&nbsp;&nbsp; Link your Email</strong></h4>
<p>Enjoy full <a href="#email" class="hide-modal">email synchronization</a> with your Google apps or other mail servers.</p>

<h4><strong><i class="icon-sitemap icon-white"></i>&nbsp;&nbsp; Run Campaigns</strong></h4>
<p>&nbsp;<a href="#workflows" class="hide-modal">Create campaigns</a> with easy drag & drop interface. Put users into campaigns using <a href="#triggers" class="hide-modal">triggers</a>.</p>

<h4><strong><i class="icon-calendar icon-white"></i>&nbsp;&nbsp; Manage your activity</strong></h4>
<p>Need to call a contact? <a href="#calendar" class="hide-modal">Add a task</a>. To schedule a meeting, <a href="#calendar" class="hide-modal">create an event</a>.</p>

<h4><strong><i class="icon-money icon-white"></i>&nbsp;&nbsp; Track sales opportunities</strong></h4>
<p>&nbsp;<a href="#deals" class="hide-modal">Create deals</a> for sales opportunities you want to track. <a href="#milestones" class="hide-modal">Define milestones</a> for deals.</p>

<h4><strong><i class="icon-bar-chart icon-white"></i>&nbsp;&nbsp; Get reports</strong></h4>
<p>&nbsp;<a href="#reports" class="hide-modal">Define reports</a> and receive them periodically via email.</p>

<h4><strong><i class="icon-keyboard icon-white"></i>&nbsp;&nbsp; Keyboard Shortcuts</strong></h4>
<p>&nbsp;Check the <a href="#" data-dismiss="modal" data-toggle="modal" id="keyboard-shortcuts">keyboard shortcuts.</a></p>


		<!--<h4>Add or Import contacts</h4>
		<p>Start adding <a href="#personModal" data-dismiss="modal" data-toggle="modal" id="person">contacts</a> / <a href="#companyModal" data-toggle="modal" data-dismiss="modal" id="company">companies</a>
		  or you can also<a href="#import" class="hide-modal">import</a> them.</p>
		
		<h4>Manage Events and Tasks</h4>
		<p>Add <a href="#" data-dismiss="modal" data-toggle="modal" id="show-activity">events or tasks</a></p>
		
		<h4>Track sales pipeline</h4>
		<p>Add and track <a href="#opportunityModal" class="deals-add" data-dismiss="modal" data-toggle="modal" id="deal">opportunities</a> in your sales pipeline</p>

		<h4>Run Campaigns</h4>
		<p>Create and run automated <a href="#workflow-add" class="hide-modal">campaigns</a> on your contacts.</p>

		<h4>Customize Reports</h4>
		<p>Add <a href="#report-add" class="hide-modal">reports</a> to improve customer retention strategies.</p>
-->
		</div>
		<div class="modal-footer">
			<a href="#" data-dismiss="modal" class="btn btn-primary">Close</a>
		</div>
	</div>
</script><!-- ICAL Modal views -->
<div class="modal hide fade" id="icalModal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-info-sign"></i> iCalendar Feed URL</h3>
    </div>
    <div class="modal-body agile-modal-body" style="max-height:420px !important">
        <form id="icalForm" name="icalForm" method="post">
            <fieldset>
                <div class="control-group">
                    <label class="control-label"><b>Subscribe to your events</b></label>
                        <div class="controls">
                        <a name="ical-feed" id="ical-feed"/></a>
                        </div>
                    </div>
             </fieldset>
         </form>
         <table>
             <tr>
                 <td><b>Adding to Google Calendar:</b></td>
             </tr> 
             <tr>
                 <td><ol>
                         <li>Copy the above iCalendar webcal link.</li>
                         <li>Log into your Google Calendar and select <b>Add by URL</b> from the menu within <b>Other calendars</b>.</li>
                         <li>Paste the Calendar feed URL into the box provided and click on <b>Add Calendar</b></li>
                     </ol>
                 </td>
             </tr>
             <tr>
                 <td><p>Once you have completed these steps it may take few minutes for your events to appear in your Google Calendar.</p></td>
             </tr>
             <tr>
                 <td><b>Adding to Outlook 2007 or Later:</b></td>
             </tr>
             <tr>
                 <td>
                   <ol>
                       <li>Click the link for the Internet Calendar Subscription.</li>
                       <li>At the prompt, click <b>Launch Application</b>.</li>
                       <li>Outlook opens with a prompt, <b>Add this Internet Calendar to Outlook and subscribe to updates</b>, click <b>Yes</b>.</li>
                   </ol>
                 </td>
             </tr>
             <tr>
             <td><p>The Calendar is added to Calendar view under <b>Other Calendars</b>.</p></td>
             </tr>
         </table>
         <a href="#" id="send-ical-email"><i class="icon-envelope-alt"></i> Send Calendar Feed URL via Email</a>
     </div>
</div><script id="import-contacts-template" type="text/html">
<div class="row-fluid">
    <div class="span12">
        <div class="page-header">
            <h1>Import From CSV <small></small>	</h1>
        </div>
    </div>
</div>
<div class="row-fluid">
<div class="span4 well" style="height: 200px;">
    <form id="imap-prefs-form">
        <legend>CSV Contacts Import <!--<span class="label label-important">Beta</span>--></legend>
		<div style="padding-bottom:10px;height:50px;">
			Import upto 10,000 contacts from a CSV file
		</div>
<input type="hidden" id ="type" value="contacts"/>
        <fieldset>
			{{#canSyncContacts}}
           		<div class="btn upload" style="display:inline-block;">Upload CSV file</div>
					{{else}}
           				<span class="btn" style="display:inline-block;" disabled>Upload CSV file</span>
						<span style="margin-left:5px"><i>Needs import privilege.</i></span>
			{{/canSyncContacts}}
           
        </fieldset>
    </form>
</div>


<div class="span4 well" style="height: 200px;">
    <form id="company-import-form">
        <legend>CSV Companies Import <span class="label label-important">Beta</span></legend>
		<div style="padding-bottom:10px;height:50px;">
			Import upto 10,000 companies from a CSV file
		</div>
<input type="hidden" id ="type" value="company"/>
        <fieldset>
			{{#canSyncContacts}}
           		<div class="btn upload" style="display:inline-block;">Upload CSV file</div>
					{{else}}
           				<span class="btn" style="display:inline-block;" disabled>Upload CSV file</span>
						<span style="margin-left:5px"><i>Needs import privilege.</i></span>
			{{/canSyncContacts}}
           
        </fieldset>
    </form>
</div>
</script>

<script id="import-deals-template" type="text/html">
<div class="row-fluid">
    <div class="span12">
        <div class="page-header">
            <h1>Import Deals From CSV <small></small>	</h1>
        </div>
    </div>
</div>
<div class="span4 well" style="height: 200px;">
    <form id="deal-import-form">
        <legend>CSV Deals Import <span class="label label-important">Beta</span></legend>
		<div style="padding-bottom:10px;height:50px;">
			Import upto 10,000 deals from a CSV file
		</div>
<input type="hidden" id ="type" value="deals"/>
        <fieldset>
           		<div class="btn upload" style="display:inline-block;">Upload CSV file</div>
        </fieldset>
    </form>
</div>

</script>

<script id="import-contacts-2-template" type="text/html">
<div class="row-fluid">
    <div class="span12">
        <div class="page-header">
            <h1>CSV Contacts Import <small> Field mapping </small></h1>
        </div>
    </div>
</div>

<div class="row-fluid">
    <div class="span9">
		<div class="span9">
			<table class="table table-bordered table-striped" style="border-collapse: collapse;">
			    <thead id="import-header">
			       <thead>
						<th>
							CSV headings
						</th>
						<th>	
							Fields
						</th>
					</thead>
			 <tbody id="import-tbody">
			    {{#each_with_index1 data}}
				 <tr>
			 		<td>
					{{#is_blank this.value}}
							{{../index}}
						{{else}}
							{{this}}		
					{{/is_blank}}	
			        </td>
					<td class="import-contact-fields">
						{{setupCSVUploadOptions "contacts" this.value ../this}}
					</td>
				 </tr>
				{{/each_with_index1}}           		          
				</tbody>
			</table>
		</div>
		<br/>
		<div class="span12">
			<form id="import-contact-tags" >
			    <div class="control-group">
			        <label class="control-label">Tags (Optional)</label>
			        <div class="pull-left" style="margin-top:0px;">
			            <ul name="tags" class="tagsinput tags"></ul>
			        </div>
			        <div class="controls">
			            <input id="tags-import" class="tags-typeahead" name="tags" type="text" placeholder="Tags should be separated by comma." />
			        </div>
					<p class="help-block">You can optionally add tags to all new contacts being created.</p>
				
			    </div>
			</form>
			
			<div id="import-validation-error"></div>
			<a class="btn btn-primary" id="import-contacts">Import</a>
			<a class="btn" id="import-cancel" style="margin-left:2px">Cancel</a>
		</div>
	</div>
	<div class="span3">
        <div class="data-block">
            <div class="well">
				<h3>
                    Import Help
                </h3>
                <br />
				<ul>
					<li>Email is mandatory for all contacts. If some of your contacts don't have email, please add a dummy email (distinct for each contact) before importing.</li>
					<li>Either of first name or last name is mandatory.</li>
					<li>Define <a href="#custom-fields">custom fields</a> to import some of the columns in your CSV file and map them here.</li>
					<li>Notes can be imported by selecting the 'Note' option.</li>
                    <li>Acceptable date format are 'MM/dd/yyyy' or 'MM-dd-yyyy'</li>
					<li>Tags can be imported with 'Tag' option. If the csv has "abc,xyz" in the column we add 2 tags 'abc' and 'xyz'.</li>
				</ul>
            </div>

        </div>
	</div>
</div>
</script>




<script id="import-companies-template" type="text/html">
<div class="row-fluid">
    <div class="span12">
        <div class="page-header">
            <h1>CSV Companies Import <small> Field mapping </small></h1>
        </div>
    </div>
</div>

<div class="row-fluid">
    <div class="span9">
		<div class="span9">
			<table class="table table-bordered table-striped" style="border-collapse: collapse;">
			    <thead id="import-header">
			       <thead>
						<th>
							CSV headings
						</th>
						<th>	
							Fields
						</th>
					</thead>
			 <tbody id="import-tbody">
			    {{#each_with_index1 data}}
				 <tr>
			 		<td>
					{{#is_blank this.value}}
							{{../index}}
						{{else}}
							{{this}}		
					{{/is_blank}}	
			        </td>
					<td class="import-contact-fields">
						{{setupCSVUploadOptions "company" this.value ../this}}
					</td>
				 </tr>
				{{/each_with_index1}}           		          
				</tbody>
			</table>
		</div>
		<br/>
		<div class="span12">
		
			
			<div id="import-validation-error"></div>
			<a class="btn btn-primary" id="import-comp">Import</a>
			<a class="btn" id="import-cancel" style="margin-left:2px">Cancel</a>
		</div>
	</div>
	<div class="span3">
        <div class="data-block">
            <div class="well">
				<h3>
                    Import Help
                </h3>
                <br />
				<ul>
					<li>Company name is mandatory for import companies</li>
				</ul>
            </div>

        </div>
	</div>
</div>
</script>



<script id="import-deals2-template" type="text/html">
<div class="row-fluid">
    <div class="span12">
        <div class="page-header">
            <h1>Import Deals From CSV <small> Field mapping </small></h1>
        </div>
    </div>
</div>

<div class="row-fluid">
    <div class="span9">
		<div class="span9">
			<table class="table table-bordered table-striped" style="border-collapse: collapse;">
			    <thead id="import-header">
			       <thead>
						<th>
							CSV headings
						</th>
						<th>	
							Fields
						</th>
					</thead>
			 <tbody id="import-tbody">
			    {{#each_with_index1 data}}
				 <tr>
			 		<td>
					{{#is_blank this.value}}
							{{../index}}
						{{else}}
							{{this}}		
					{{/is_blank}}	
			        </td>
					<td class="import-contact-fields">
						{{setupCSVUploadOptions "deals" this.value ../this}}
					</td>
				 </tr>
				{{/each_with_index1}}           		          
				</tbody>
			</table>
		</div>
		<br/>
		<div class="span12">
			<div id="import-validation-error"></div>
			<a class="btn btn-primary" id="import-deals">Import</a>
			<a class="btn" id="deal-cancel" style="margin-left:2px">Cancel</a>
		</div>
	</div>
	<div class="span3">
        <div class="data-block">
            <div class="well">
				<h3>
                    Import Help
                </h3>
                <br />
				<ul>
					<li>Deal Name is mandatory.</li>
					<li>All other fields are optional</li>
					<li>Note that Track and Milestone names in the CSV should match exactly with the ones defined in Agile (including case)</li>
					<li>You can define Tracks and Milestones <here></li>
				</ul>
            </div>

        </div>
	</div>
</div>
</script>




<script id="import-contacts-validation-message-template"
	type="text/html">
<div class="row">
    <div class="span5">
        <div class="alert alert-error import_contact_error">
            <a class="close" data-dismiss="alert" href="#">&times</a>
          {{error_message}}
        </div>
    </div>
</div>
</script>

<script id="import-company-validation-message-template" type="text/html">
<div class="row">
    <div class="span5">
        <div class="alert alert-error import_contact_error">
            <a class="close" data-dismiss="alert" href="#">&times</a>
          {{error_message}}
        </div>
    </div>
</div>
</script>


<script id="import-deal-validation-message-template" type="text/html">
<div class="row">
    <div class="span5">
        <div class="alert alert-error import_contact_error">
            <a class="close" data-dismiss="alert" href="#">&times</a>
          {{error_message}}
        </div>
    </div>
</div>
</script>

<script id="csv_upload_options-template" type="text/html">
<select class="import-select">
<option value="properties__ignore_">-Ignore-</option>
<option value="properties_first_name">First Name</option>
<option value="properties_last_name">Last Name</option>
<option value="properties_company">Company</option>
<option value="tags">Tag</option>
<option value="note">Note</option>
<option value="properties_title">Job Description</option>
<optgroup label="Email">
    <option value="properties_home-email">Email (Personal)</option>
    <option value="properties_work-email">Email (Work)</option>
</optgroup>
<optgroup label="Phone">
    <option value="properties_home-phone">Phone (Home)</option>
    <option value="properties_work-phone">Phone (Work)</option>
    <option value="properties_mobile-phone">Phone (Mobile)</option>
    <option value="properties_main-phone">Phone (Main)</option>
    <option value="properties_home fax-phone">Phone (Home fax)</option>
    <option value="properties_work fax-phone">Phone (Work fax)</option>
    <option value="properties_other-phone">Phone (Other)</option>
</optgroup>
<optgroup label="Website">
    <option value="properties_URL-website">Website</option>
    <option value="properties_SKYPE-website">Skype</option>
    <option value="properties_TWITTER-website">Twitter</option>
    <option value="properties_LINKEDIN-website">LinkedIn</option>
    <option value="properties_FACEBOOK-website">Facebook</option>
    <option value="properties_XING-website">Xing</option>
    <option value="properties_FEED-website">Blog</option>
    <option value="properties_GOOGLE-website">Google+</option>
    <option value="properties_FLICKR-website">Flickr</option>
    <option value="properties_GITHUB-website">GitHub</option>
    <option value="properties_YOUTUBE-website">YouTube</option>
</optgroup>
<optgroup label="Address">
    <option value="properties_address-address">Home</option>
    <option value="properties_address-city">City</option>
    <option value="properties_address-state">State</option>
    <option value="properties_address-zip">Zip</option>
    <option value="properties_address-country">Country</option>
</optgroup>
 {{#if custom_fields}}
<optgroup label="Custom field" id = "custom_fields">
   
		{{#each custom_fields}}
			<option class="CUSTOM" value="properties_{{this.field_label}}">{{this.field_label}}</option>
		{{/each}}
</optgroup>
{{/if}}
</select>


</script>


<script id="csv_companies_upload_options-template" type="text/html">
<select class="import-select">
<option value="properties__ignore_">-Ignore-</option>
<option value="properties_name">Organization</option>
<optgroup label="Email">
    <option value="properties_primary-email">Email (Primary)</option>
    <option value="properties_alternate-email">Email (Alternate)</option>
</optgroup>
<optgroup label="Phone">
    <option value="properties_primary-phone">Phone (Primary)</option>
    <option value="properties_alternate-phone">Phone (Alternate)</option>
    <option value="properties_fax-phone">Phone (Fax)</option>
    <option value="properties_other-phone">Phone (Other)</option>
</optgroup>
<optgroup label="Website">
    <option value="properties_URL-website">Website</option>
	<option value="properties_url">URL</option>
    <option value="properties_SKYPE-website">Skype</option>
    <option value="properties_TWITTER-website">Twitter</option>
    <option value="properties_LINKEDIN-website">LinkedIn</option>
    <option value="properties_FACEBOOK-website">Facebook</option>
    <option value="properties_XING-website">Xing</option>
    <option value="properties_FEED-website">Blog</option>
    <option value="properties_GOOGLE-website">Google+</option>
    <option value="properties_FLICKR-website">Flickr</option>
    <option value="properties_GITHUB-website">GitHub</option>
    <option value="properties_YOUTUBE-website">YouTube</option>
</optgroup>
<optgroup label="Address">
    <option value="properties_address-address">Address</option>
    <option value="properties_address-city">City</option>
    <option value="properties_address-state">State</option>
    <option value="properties_address-zip">Zip</option>
    <option value="properties_address-country">Country</option>
</optgroup>
 {{#if custom_fields}}
<optgroup label="Custom field" id = "custom_fields">
   
		{{#each custom_fields}}
			<option class="CUSTOM" value="properties_{{this.field_type}}-{{this.field_label}}">{{this.field_label}}</option>
		{{/each}}
</optgroup>
{{/if}}
</select>


</script>



<script id="csv_deals_options-template" type="text/html">
<select class="import-select">
<option value="properties__ignore_">-Ignore-</option>
<option value="properties_name">Deal Name</option>
    <option value="properties_value">Value</option>
  <option value="properties_track">Track</option>
  <option value="properties_milestone">Milestone</option>

    <option value="properties_probability">Probability</option>
    <option value="properties_closeDate">Close Date</option>
<option value="properties_relatedTo">Related To</option>
<option value="properties_note">Note</option>
<option value="properties_description">Descriptions</option> 
{{#if custom_fields}}
<optgroup label="Custom field" id = "custom_fields">
   
		{{#each custom_fields}}
			<option class="CUSTOM" value="properties_{{this.field_label}}">{{this.field_label}}</option>
		{{/each}}
</optgroup>
{{/if}}
</select>


</script>

<script id="shortcut-keys-template" type="text/html">
	<div id="shortcut-keys" class="modal hide" data-backdrop="static">
		<div class="modal-header">
            <button class="close" data-dismiss="modal">x</button>
			<h3>Keyboard Shortcuts for Agile CRM</h3>
		</div>
		<div class="modal-body help-text">

<h4><strong>Global Shortcuts</strong></h4>
<br/>
<table>
	<tbody>
		<tr><td>Preferences</td> <td style="padding-left: 20px;">Shift + P </td></tr> 
		<tr><td>New Contact</td> <td style="padding-left: 20px;">Shift + N </td></tr>
		<tr><td>New Task</td> <td style="padding-left: 20px;">Shift + T </td></tr>
		<tr><td>Search</td> <td style="padding-left: 20px;"> / </td></tr>
	</tbody>
</table>
<br/>
<h4><strong>Contextual Shortcuts</strong></h4>
<br/>
<table>
	<tbody>
		<tr><td>Edit Contact (Contact Details Page)</td> <td style="padding-left: 20px;">Shift + E </td></tr> 
		<tr><td>Send Mail to current Contact (Contact Details Page)</td> <td style="padding-left: 20px;">Shift + M </td></tr>
		<tr><td>New Contact (Contacts Page)</td> <td style="padding-left: 20px;"> N </td></tr>
		<tr><td>New Case (Cases Page)</td> <td style="padding-left: 20px;"> N </td></tr>
		<tr><td>New Deal (Deals Page)</td> <td style="padding-left: 20px;"> N </td></tr>
		<tr><td>New Campaign (Campaigns Page)</td> <td style="padding-left: 20px;"> N </td></tr>
		<tr><td>New Report (Reports Page)</td> <td style="padding-left: 20px;"> N </td></tr>
		<tr><td>New Task (Tasks Page)</td> <td style="padding-left: 20px;"> N </td></tr>
        <tr><td>New Event (Calendar Page)</td> <td style="padding-left: 20px;"> N </td></tr>
	</tbody>
</table>
<br/>
		</div>
		<div class="modal-footer">
			<a href="#" data-dismiss="modal" class="btn btn-primary">Close</a>
		</div>
	</div>
</script><script id="merge-contacts-template" type="text/html">
	<div class="row">
	<div class="span12">
	<div class="page-header">
	<h1><span id="contact-heading">Merge Duplicate Contacts</span></h1>
	</div>
	</div>
	</div>
	<table id="merge-contacts-table" width="100%" border="0" cellpadding="4" cellspacing="0" class="mergeTable" table-layout: fixed;>
	<tr>
	<td style="background-color:#f3f3f3"></td>
	{{#each_with_index  contacts}}
	{{#if_equals index "1"}}
	<td style="background-color:#f3f3f3">
	Master Record:
	</td>
	{{else}}
	<td style="background-color:#f3f3f3">
	Duplicate Record: {{get_correct_count index}}
	</td>
	{{/if_equals}}
	{{/each_with_index}}
	</tr>
	<tr>
	<td style="background-color:#f3f3f3">First Name</td>
	{{#each_with_index  contacts}}
	{{#property_is_exists "first_name" properties}}
	{{#if_equals index "1"}}
	<td>
	<input type="radio" name="first_name_radio" data="{{getPropertyValue properties "first_name"}}" field="first_name" checked="checked" oid={{id}}>{{getPropertyValue properties "first_name"}}</b>
	</td>
	{{else}}
	<td>
	<input type="radio" name="first_name_radio" data="{{getPropertyValue properties "first_name"}}" field="first_name" oid={{id}}>{{getPropertyValue properties "first_name"}}</b>
	</td>
	{{/if_equals}}
	{{else}}
	<td></td>
	{{/property_is_exists}}
	{{/each_with_index}}
	</tr>
	<tr>
	<td style="background-color:#f3f3f3">Last Name</td>
	{{#each_with_index  contacts}}
	{{#property_is_exists "last_name" properties}}
	{{#if_equals index "1"}}
	<td>
	<input type="radio" name="last_name_radio" data="{{getPropertyValue properties "last_name"}}" field="last_name" checked="checked" oid={{id}}>{{getPropertyValue properties "last_name"}}</b>
	</td>
	{{else}}
	<td>
	<input type="radio" name="last_name_radio" data="{{getPropertyValue properties "last_name"}}" field="last_name" oid={{id}}>{{getPropertyValue properties "last_name"}}</b>
	</td>
	{{/if_equals}}
	{{else}}
	<td></td>
	{{/property_is_exists}}
	{{/each_with_index}}
	</tr>
	<tr>
	<td style="background-color:#f3f3f3">Title</td>
	{{#each_with_index  contacts}}
	{{#property_is_exists "title" properties}}
	{{#if_equals index "1"}}
	<td>
	<input type="radio" name="title_radio" data="{{getPropertyValue properties "title"}}" field="title" checked="checked" oid={{id}}>{{getPropertyValue properties "title"}}</b>
	</td>
	{{else}}
	<td>
	<input type="radio" name="title_radio" data="{{getPropertyValue properties "title"}}" field="title" oid={{id}}>{{getPropertyValue properties "title"}}</b>
	</td>
	{{/if_equals}}
	{{else}}
	<td></td>
	{{/property_is_exists}}
	{{/each_with_index}}
	</tr>
	<td style="background-color:#f3f3f3">Phone</td>
	{{#each_with_index  contacts}}
	{{#if_equals index "1"}}
	<td>
	{{#getPropertyValueInCheckbox properties "phone" id "checked"}}

	{{/getPropertyValueInCheckbox}}
	</td>
	{{else}}
	<td>
	{{#getPropertyValueInCheckbox properties "phone" id ''}}

	{{/getPropertyValueInCheckbox}}
	</td>
	{{/if_equals}}
	{{/each_with_index}}
	</tr>
	<td style="background-color:#f3f3f3">Company</td>
	{{#each_with_index  contacts}}
	{{#property_is_exists "company" properties}}
	{{#if_equals index "1"}}
	<td>
	<input type="radio" name="company_radio" data="{{getPropertyValue properties "company"}}" field="company" checked="checked" oid={{id}} company_id={{contact_company_id}}>{{getPropertyValue properties "company"}}</b>
	</td>
	{{else}}
	<td>
	<input type="radio" name="company_radio" data="{{getPropertyValue properties "company"}}" field="company" oid={{id}} company_id={{contact_company_id}}>{{getPropertyValue properties "company"}}</b>
	</td>
	{{/if_equals}}
	{{else}}
	<td></td>
	{{/property_is_exists}}
	{{/each_with_index}}
	</tr>
	<tr>
	<td style="background-color:#f3f3f3">Tags</td>
	{{#each_with_index  contacts}}
	{{#if_equals index "1"}}
	<td>
	{{#each tags}}
	<input type="checkbox" name= "tags" field="tags" data="{{this}}" checked="checked" oid={{id}}>{{this}}<br>
	{{/each}}
	</td>
	{{else}}
	<td>
	{{#each tags}}
	<input type="checkbox" name= "tags" field="tags" data="{{this}}" oid={{id}}>{{this}}<br>
	{{/each}}
	</td>
	{{/if_equals}}
	{{/each_with_index}}
	</tr>
	<tr>
	<td style="background-color:#f3f3f3">Address</td>
	{{#each_with_index  contacts}}
	{{#property_is_exists "address" properties}}
	{{#if_equals index "1"}}
	<td>
	<input type="radio" name="address radio" field="address" checked="checked" data="{{getPropertyValue properties "address"}}" oid={{id}}>{{address_Template properties}}</b>
	</td>
	{{else}}
	<td>
	<input type="radio" name="address radio" field="address" data="{{getPropertyValue properties "address"}}" oid={{id}}>{{address_Template properties}}</b>
	</td>
	{{/if_equals}}
	{{else}}
	<td></td>
	{{/property_is_exists}}
	{{/each_with_index}}
	</tr>
	<tr>
	<td style="background-color:#f3f3f3">Website</td><!--  -->
	{{#each_with_index  contacts}}
	{{#if_equals index "1"}}
	<td>
	{{#getPropertyValueInCheckbox properties "website" id "checked"}}

	{{/getPropertyValueInCheckbox}}
	</td>
	{{else}}
	<td>
	{{#getPropertyValueInCheckbox properties "website" id ''}}

	{{/getPropertyValueInCheckbox}}
	</td>
	{{/if_equals}}
	{{/each_with_index}}
	</tr>
	<tr>
	<td style="background-color:#f3f3f3">Email</td>
	{{#each_with_index  contacts}}
	{{#if_equals index "1"}}
	<td>
	{{#getPropertyValueInCheckbox properties "email" id "checked"}}

	{{/getPropertyValueInCheckbox}}
	</td>
	{{else}}
	<td>
	{{#getPropertyValueInCheckbox properties "email" id ''}}

	{{/getPropertyValueInCheckbox}}
	</td>
	{{/if_equals}}
	{{/each_with_index}}
	</tr>
	{{show_custom_fields_for_merge custom_fields contacts}}
	</table>
	<div class="row-fluid">
	<div class="span6  select-none">
	</div>
	</div>
	<a href="#" class="btn btn-primary" id="merge-contacts-model" style="margin-bottom: 15px;position:relative">Merge</a>
	<a href="#" class="btn" id="contact-merge-cancel" style="margin-bottom: 15px" >Cancel</a>
	</div>
</script><!-- New (Activity) Modal views -->
<div class="modal hide fade" id="activityModal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-plus-sign"></i>&nbsp;Add Event</h3>
    </div>
    <div class="modal-body">
        <input type="hidden" value="event" id="hiddentask" /> 
        <div id="relatedEvent">
            <p><i><i class="icon-calendar"></i>&nbsp;Events are time based such as
                meetings. They show up in calendar.</i>
            </p>
            <!--Event form  -->
            <form id="activityForm" name="activityForm" method="post">
                <fieldset>
                    <div class="row">
                        <div id="addEvent" class="control-group span3">
                            <label class="control-label"><b>Event Name </b><span class="field_req">*</span></label>
                            <div class="controls">
                                <input id="title" placeholder="Name of Event" type="text" name="title" class="required" />
                            </div>
                        </div>
                        <div class="span2 control-group">
                            <label for="priority_type" class="control-label"><b>Priority </b></label>
                            <div class="controls">
                                <span class="input ">
                                    <select name="color" id="color" size="1" class="input-small">
                                        <option value="red">High</option>
                                        <option value="#36C" selected="selected">Normal</option>
                                        <option value="green">Low</option>
                                    </select>
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                       <div class="control-group span3">
							<label class="control-label">Owner<span class="field_req">*</span></label>
							<div class="controls" id="event-owners">
								<select id="event-owners-list" class="required" name="owner_id"></select>
								<img class="loading-img" src="img/21-0.gif"></img>
							</div>
					   </div>
                     </div>
                    
                    <div class="row">
                        <div class="control-group span3">
                            <label class="control-label"><b>Start Date </b><span class="field_req">*</span></label>
                            <div class="controls">
                                <input type="text" name="start" placeholder="mm/dd/yyyy" id="event-date-1" class="required date" />							
                            </div>
                        </div>
                        <div class="control-group span2">
                            <label class="control-label"><b>Start Time </b><span class="field_req">*</span></label>
                            <div class="controls">
                                <input type="text" name="start_time" class="start-timepicker required" id="event-time-1" style="width:65px" placeholder="time" />		
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="control-group span3">
                            <label class="control-label"><b>End Date </b><span class="field_req">*</span></label>
                            <div class="controls">
                                <input type="text" name="end" placeholder="mm/dd/yyyy" id="event-date-2" class="required date" />									
                            </div>
                        </div>
                        <div class="control-group span2">
                            <label class="control-label"><b>End Time </b><span class="field_req">*</span></label>
                            <div class="controls">							
                                <input type="text" name="end_time" class="end-timepicker required" id="event-time-2" style="width:65px" placeholder="time" /><br />		
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="span5  invalid-range">
                        </div>
                    </div>
                    <div class="control-group" style="margin-bottom: 0px;">
                        <div class="controls">
                            <label class="checkbox" style="display:inline-block; cursor:pointer;">
                            	<input type="checkbox" name="allDay" id="allDay" />						
                            	<div style="display:inline-block;margin-top:1px;">All day event</div>
                        	</label>
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="control-label"><b>Related To</b></label>
                        <div class="controls">
                            <div>
                                <div class="pull-left">
                                    <ul name="contacts" class="contacts tags tagsinput"></ul>
                                </div>
                                <input type="text" id="event_related_to" class="typeahead typeahead_contacts" data-provide="typeahead" data-mode="multiple" size="40" />
                            </div>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>
    </div>
    <div class="modal-footer">
        <a href="#" class="btn btn-primary" id="task_event_validate">Save </a>
        <span class="save-status"></span>
    </div>
</div>
<!-- End of Modal views -->
<!-- New (Case) Modal views -->
<div class="modal hide fade cases-modal" id="casesModal">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>
			<i class="icon-plus-sign"></i>&nbsp;Add Case
		</h3>
	</div>

	<div class="modal-body">

		<form id="casesForm" name="casesForm" method="post">
			<fieldset>
				<div class="row-fluid">
					<div class="control-group span5">
						<label class="control-label"><b>Title </b><span
							class="field_req">*</span></label>
						<div class="controls" style="margin-right:10px;">
							<span><input id="title" name="title" type="text" width='100%' 
								class=" required" placeholder="Title of the Case" /></span>
						</div>
					</div>
					
				</div>
				<div class="row-fluid">
					<div class="control-group span5">
						<label class="control-label"><b>Owner </b><span
							class="field_req">*</span></label>
						<div class="controls" id="owners">
							<select id="owners-list" class="required" name="owner_id"></select>
						</div>
					</div>
					<div class="control-group span5" style="margin-left: 30px;">
						<label class="control-label"><b>Status </b><span class="field_req">*</span></label>
						<div class="controls" id='status'>
							<span>
								<select id="status-list" class="required" name="status">
									<option value='OPEN'>Open</option>
									<option value='CLOSE'>Closed</option>
								</select>
							</span>
						</div>
					</div>
				</div>

				<div class="control-group">
					<label class="control-label"><b>Related Contacts </b></label>
					<div class="controls" id="contactTypeAhead">
						<div>
							<div class="pull-left">
								<ul name="related_contacts_id" class="contacts tagsinput tags"></ul>
							</div>
							<input type="text" id="contacts-typeahead-input"
								placeholder="Contact Name" class="typeahead typeahead_contacts"
								data-provide="typeahead" data-mode="multiple" />
						</div>
					</div>
				</div>
				<div id="custom-field-case"></div>
				<div class="control-group">
					<label class="control-label"><b>Description </b></label>
					<div class="controls" style="margin-right:10px;">
						<textarea id="description" name="description" rows="3" style="width:100%"
							class="input" placeholder="Add Comment.."></textarea>
					</div>
				</div>
			</fieldset>
		</form>
	</div>
	<div class="modal-footer">
		<a href="#" class="btn btn-primary" id="cases_validate">Save
			Changes</a> <span class="save-status"></span>
	</div>
</div>
<!-- End of Modal views -->

<!-- New (Contact) Modal views -->
<div class="modal hide fade" id="companyModal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-plus-sign"></i>&nbsp;Add Company</h3>
    </div>
    <div class="modal-body" style="max-height:420px !important;">
        <form id="companyForm" name="companyForm" method="post">
            <fieldset>
                <p>
                <div class="control-group">
                    <label class="control-label"><b>Company</b> <span class="field_req">*</span></label>
                    <div class="controls">
                        <input name="name" type="text" field="test company" class="required" id="company_name" placeholder="Company" />

                    </div>
                </div>
                <div class="row">
                    <div class="span5  duplicate-email">
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label"><b>URL</b> </label>
                    <div class="controls">
                        <input class="input-large" name="url" type="text" id="company_url" placeholder="http://www." />
                    </div>
                </div>
                <div  id="custom-field-deals"></div>
                <input type="text" name="type" style="display:none" value="COMPANY" />				
            </fieldset>
        </form>
    </div>
    <div class="modal-footer">
    	<span class="form-action-error"></span>
        <a href="#continue-company" class="btn" id="continue-company">Continue
        Editing</a> 
        <a href="#" class="save btn btn-primary" id="company_validate">Save
        </a>
        <span class="save-status"></span>
    </div>
</div>
<!-- End of Modal views -->
	<!-- New (Deal) Modal views -->
<div class="modal hide fade opportunity-modal" id="opportunityModal">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>
			<i class="icon-plus-sign"></i>&nbsp;Add Deal
		</h3>
	</div>
	<div class="modal-body">
		<form id="opportunityForm" name="opportunityForm" method="post">
			<fieldset>
				<div class="row-fluid">
					<div class="control-group span5">
						<label class="control-label"><b>Name </b><span
							class="field_req">*</span></label>
						<div class="controls">
							<span><input id="name" name="name" type="text"
								class=" required" placeholder="Name of Deal" /></span>
						</div>
					</div>
					<div class="control-group span5" style="margin-left: 30px;">
						<label class="control-label"><b>Owner </b><span
							class="field_req">*</span></label>
						<div class="controls" id="owners">
							<select id="owners-list" class="required" name="owner_id"></select>
							<img class="loading-img" src="img/21-0.gif"></img>
						</div>
					</div>
				</div>
				<div class="row-fluid">
					<div class="control-group span5">
						<label class="control-label"><b>Value </b><span
							class="field_req">*</span></label>
						<div class="controls">
							<span><input type="text" name="expected_value"
								class="required  number" max="1000000000000"
								placeholder="Value of Deal" /></span>
						</div>
					</div>
					<div class="control-group span5" style="margin-left: 30px;">
						<label class="control-label"><b>Probability (%) </b><span
							class="field_req">*</span></label>
						<div class="controls">
							<span><input type="text" id="probability"
								name="probability" class=" required digits" max="100"
								placeholder="Probability %" /></span>
						</div>
					</div>
				</div>
				<div class="row-fluid">
					<div class="control-group span5">
						<label class="control-label"><b>Milestone </b><span
							class="field_req">*</span></label>
						<div class="controls">
							<span><select id="pipeline_milestone" name="pipeline_milestone"
								class="required">
									<option value="">Select..</option>
							</select></span><img class="loading-img" src="img/21-0.gif"></img>
						</div>
					</div>
					<div class="control-group span5" style="margin-left: 30px;">
						<label class="control-label"><b>Close Date </b></label>
						<div class="controls">
							<span><input id="close_date" type="text" name="close_date"
								class="input date" placeholder="MM/DD/YY" /></span>
						</div>
					</div>
					<input id="pipeline" name="pipeline_id" type="hidden"/>
					<input id="milestone" name="milestone" type="hidden"/>
				</div>
				<div class="control-group">
					<label class="control-label"><b>Related To </b></label>
					<div class="controls" id="contactTypeAhead">
						<div>
							<div class="pull-left">
								<ul name="contact_ids" class="contacts tagsinput tags"></ul>
							</div>
							<input type="text" id="relates_to" name="relates_to"
								placeholder="Contact Name" class="typeahead typeahead_contacts"
								data-provide="typeahead" data-mode="multiple" />
						</div>
					</div>
				</div>
				<div class="control-group hidden">	
					<label class="control-label">
					<input type="checkbox" id="archived" class="input" name="archived" style="margin: 0px 5px;">Archive </label>
				</div>
				<div id="custom-field-deals">
				</div>
				<div class="row-fluid">
					<div class="control-group">
						<label class="control-label"><b>Description </b></label>
						<div class="controls">
							<textarea id="description" name="description" rows="3"
								class="input span8" placeholder="Add Comment"></textarea>
						</div>
					</div>
				</div>
			
			</fieldset>
		</form>
	</div>
	<div class="modal-footer">
		<span class="error-status"></span>
		<a href="#" class="btn btn-primary" id="opportunity_validate">Save
			</a> <span class="save-status"></span>
	</div>
</div>
<!-- End of Modal views -->

<!-- FIlter modal -->
<div id="deals-filter" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
    <h3 id="dealsFilterLabel">Deal Filters</h3>
  </div>
  <div class="modal-body">
    <form id="dealsFilterForm" name="dealsFilterForm" class="form-horizontal" method="post">
			<fieldset>
				<div class="control-group">
					<label class="control-label"><input id="filter-owner" type="checkbox" data="owners-list"><b>Owner </b></label>
					<div class="controls" id="owners">
						<select id="owners-list" name="owner_id"></select>
						<img class="loading-img" src="img/21-0.gif"></img>
					</div>
				</div>
				<div class="control-group">
					<label class="control-label"><input id="filter-pipeline" type="checkbox" data="pipeline"><b>Track </b></label>
					<div class="controls">
						<span><select id="pipeline" name="pipeline_id">
								<option value="">Select..</option>
						</select></span><img class="loading-img" src="img/21-0.gif"></img>
					</div>
				</div>
				<div class="control-group">
					<label class="control-label"><input id="filter-milestone" type="checkbox" data="milestone"><b>Milestone </b></label>
					<div class="controls">
						<span><select id="milestone" name="milestone">
								<option value="">Select..</option>
						</select></span><img class="loading-img" src="img/21-0.gif" style="display:none;"></img>
					</div>
				</div>
					
				<div class="control-group">
					<label class="control-label"><input id="filter-related" type="checkbox" data="contact_ids"><b>Related To </b></label>
					<div class="controls" id="contactTypeAhead">
						<div>
							<div class="pull-left">
								<ul name="contact_ids" class="contacts tagsinput tags"></ul>
							</div>
							<input type="text" id="relates_to" name="relates_to"
								placeholder="Contact Name" class="typeahead typeahead_contacts"
								data-provide="typeahead" data-mode="multiple" />
						</div>
					</div>
				</div>
			</fieldset>
		</form>
  </div>
  <div class="modal-footer">
  	<a href="#" class="btn btn-primary" id="deals-filter-validate">Done</a> 
  </div>
</div><!-- New (Note) Modal views -->
<div class="modal hide fade note-modal" id="noteModal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-plus-sign"></i>&nbsp;Add Note</h3>
    </div>
    <div class="modal-body">
        <form id="noteForm" name="noteForm" method="post">
            <fieldset>
                <input name="from_task" id="from_task" type="hidden" value="" />
                <input name="task_form" id="task_form" type="hidden" value="" />
                	            
                <div class="control-group">
                    <label class="control-label"><b>Subject</b> <span class="field_req">*</span></label>
                    <div class="controls">
                        <input type="text" placeholder="About" name="subject" id="subject" class="required" />
                    </div>
                </div>
                <div class="row-fluid">
	                <div class="control-group">
	                    <label class="control-label"><b>Description</b></label>
	                    <div class="controls">
	                        <textarea rows="3" class="span8" placeholder="Detailed Note" name="description" id="description" style="max-width:400px;"></textarea> 
	                    </div>
	                </div>
                </div>
                <div class="control-group">
                    <label class="control-label"><b>Related To</b></label>
                    <div class="controls">
                        <div>
                            <div class="pull-left">
                                <ul name="contact_ids" class="contacts tags tagsinput"></ul>
                            </div>
                            <input type="text" placeholder="Contact Name" id="note_related_to" class="typeahead typeahead_contacts" data-provide="typeahead" data-mode="multiple" size="40" />
                        </div>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
    <div class="modal-footer">
        <a href="#" class="btn btn-primary" id="note_validate">Save
        </a>
        <span class="save-status"></span>
    </div>
</div>
<!-- End of Modal views --><!-- New (Person) Modal views -->
<div class="modal hide fade" id="personModal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-plus-sign"></i>&nbsp;Add Contact</h3>
    </div>
    <div class="modal-body" style="max-height:420px !important;">
        <form id="personForm" name="personForm" method="post">
            <fieldset>            
                <div class="control-group">
	                <label class="control-label"><b>Name</b> <span class="field_req">*</span></label>
	                <div class="row-fluid">
		                 <div class="control-group span5" style="margin-bottom:0px; margin-right:20px;">
		                     <span class="controls">
		                     <input name="first_name" type="text" class="required" id="fname" placeholder="First Name" />
		                     </span>
		                 </div>
		                 <div class="control-group span6" style="margin-bottom:0px;">
		                     <span class="controls">
		                     <input name="last_name" type="text" id="lname" placeholder="Last Name" />
		                     </span>
		                 </div>
	                </div>
                </div>
                 <div class="row-fluid">
	                <div class="control-group span5"  style="margin-right:20px;">
	                    <label class="control-label"><b>Title</b></label>
	                    <div class="controls">
	                        <input name="title" type="text" id="job_title" placeholder="Job Title" />
	                    </div>
	                </div>
	                <div class="control-group span6" id='company_source_person_modal'>
	                    <label class="control-label"><b>Company</b></label>
	                    <div class="controls">
							<div class="pull-left" style="display:inline-block;">
								<ul name="contact_company_id" class="contacts tagsinput tags"></ul>
							</div>
	                        <input type="text" id="contact_company" placeholder="Company Name" />
	                    </div>
	                </div>
                </div>               
                <div class="control-group">
	                <div class="row-fluid">
	                	<div class="span5">
		                    <label class="control-label"><b>Email</b> </label>
		                    <div class="controls">
		                        <span><input name="email" class="email" type="text" id="email" placeholder="Email" /></span>
		                    </div>
	                    </div>
	                    <div class="span2">	                                       
	                    	<span id="pic" style="padding-left:20px;display:none;"></span>
	                    	<input name="image" id="image" type="hidden" />
	                    	<div id="network_handle" class="network-handle">
		                    	<label class="control-label"><b>Twitter</b> </label>
		                    	<div class="controls">
		                        	<span><input name="handle" type="text" id="handle" disabled value=""/></span>
		                    	</div>
	                    	</div>	                    	 
	                    	
	                    	<div class="control-group" >                    
                    		  <div class="controls">
                        		<div class="website multiple-template" style="display:none" data="website">
                                  <input type="text" id="website" name="website"/> 
                                  <select class="website-select" name="website-select">
                                    <option></option>                                
                                    <option value="TWITTER">Twitter</option>
                                    <option value="LINKED_IN">LinkedIn</option>
                                    <option value="FACEBOOK">Facebook</option>
                                  </select>                            
                                </div>
                              </div>
	                    	</div>	                    	
	                    		                    	
	                    </div>
	                </div>
                </div>
                <div class="row-fluid">
	                <div class="control-group span5"  style="margin-right:20px;">
	                    <label class="control-label"><b>Phone</b></label>
	                    <div class="controls">
	                        <input name="phone" class="phone" type="text" id="phone" placeholder="Phone Number" />
	                    </div>
	                </div>
	            </div>

                <div class="row">
                    <div class="span5  duplicate-email"></div>
                </div>
                <div class="row-fluid">                
	                <div class="control-group" id='tags_source_person_modal'>
	                    <label class="control-label"><b>Tags</b></label>
	                    <div class="pull-left">
	                        <ul name="tags" class="tagsinput tags">
	                        </ul>
	                    </div>
	                    <div class="controls pull-left">
	                        <input name="tags" type="text" id="tags-new-person" class="tags-typeahead" />
	                    </div>
	                </div>
	            </div>
	            <div class="row-fluid invalid-tags-person" style="display:none;">
                    <div class="span9" style="margin-top:5px;">
                        <div style="color:red;">Tag name should start with an alphabet and can not contain special characters other than underscore and space.</div>
                    </div>
                </div>
                <div class="row-fluid">
                    <div class="span9" style="margin-top:5px;">
                        <span style="display:inline;"><i class="icon-arrow-right"></i></span>
                        <a href="#import" data-dismiss="modal" id="import-link"> Click here to import your contacts from CSV and other CRMs</a>
                    </div>
                </div> 
            </fieldset>
        </form>
    </div>
    <div class="modal-footer">
    	<span class="form-action-error"></span>
        <a href="#continue-contact" class="btn" id="continue-contact">Continue
        Editing</a> <a href="#" class="save btn btn-primary" id="person_validate">Save
        </a>
        <span class="save-status"></span>
    </div>
</div>
<!-- End of Modal views --><!-- New (Activity) Modal views -->
<div class="modal hide fade" id="activityTaskModal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-plus-sign"></i>&nbsp;Add Task</h3>
    </div>
    <div class="modal-body">
        <input type="hidden" value="task" id="hiddentask" /> 
        <div id="relatedTask">
            <div>
                <p><i><i class="icon-tasks"></i>&nbsp;Tasks are like to-dos. Result
                    oriented. You can assign a category such as call, <br />email etc</i>
                </p>
            </div>
            <!--Task form -->
            <form id="taskForm" name="taskForm" method="post">
                <fieldset>
                    <input name="progress" id="progress" type="hidden" value="">
					<input name="is_complete" id="is_complete" type="hidden" value="">
					                    
                    <div class="row">
                        <div id="addTask" class="span3 control-group">
                            <label for="subject" class="control-label"> <b>Task</b> <span class="field_req">*</span></label>
                            <div class="controls"><span class="input "><input id="subject" type="text" name="subject" size="40" class="required" placeholder="Name of Task"/> </span>
                            </div>
                        </div>
                        <div id="taskCategory" class="span2 control-group">
                            <label for="type" class="control-label"><b> Category </b><span class="field_req">*</span></label>
                            <div class="controls">
                                <span class="input">
                                    <select name="type" id="type" size="1" class="input-medium required">
                                        <option></option>
                                        <option value="CALL">Call</option>
                                        <option value="EMAIL">Email</option>
                                        <option value="FOLLOW_UP">Follow-up</option>
                                        <option value="MEETING">Meeting</option>
                                        <option value="MILESTONE">Milestone</option>
                                        <option value="SEND">Send</option>
                                        <option value="TWEET">Tweet</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="span3 control-group">
                            <label for="due" class="control-label"><b> Date (Due) </b><span class="field_req">*</span></label>
                            <div class="controls">
                                <input type="text" name="due" placeholder="mm/dd/yyyy" id="task-date-1" class="required date" />
                            </div>
                        </div>
                           <div class="span2 control-group">
							<label class="control-label"><b>Time </b><span class="field_req">*</span></label>
                            <div class="controls">							
                               <input type="text" name="task_ending_time" class="new-task-timepicker required" id="task_ending_time" style="width:65px" placeholder="time" />		
                            </div>
						</div>
                    </div>
                    <div class="row">
						<div class="span3 control-group">
							<label class="control-label"><b> Owner </b><span
								class="field_req">*</span></label>
							<div class="controls" id="owners">
								<select id="owners-list" class="required" name="owner_id"></select>
								<img class="loading-img" src="img/21-0.gif"></img>
							</div>
						</div>
						<div class="span2">
							 <label for="priority_type" class="control-label"><b>Priority </b></label>
                            <div class="controls">
                                <span class="input ">
                                    <select name="priority_type" id="priority_type" size="1" class="input-medium">
                                        <option value="HIGH">High</option>
                                        <option value="NORMAL" selected="selected">Normal</option>
                                        <option value="LOW">Low</option>
                                    </select>
                                </span>
                            </div>								
						</div>
					</div>
					<div class="row">
					  <div class="span3 control-group">
						<label for="status" class="control-label"><b>Status </b></label>
                            <div class="controls" style="margin-bottom: 6px;">
                                <span class="input ">
                                    <select name="status" id="status" size="1" class="status">
                                        <option value="YET_TO_START" selected="selected">Yet to Start</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="COMPLETED">Completed</option>                                        
                                    </select>
                                </span>
                            </div>
									
					  </div>
					  <div class="span2">
                            <div class="progress-slider controls progress_slider_width_bottom" title="Progress">
							    <input id="progress_slider" type="slider" class="progress_slider" value="0" />
							</div>								
						</div>	
					</div>	
					<div class="row">
					  <div class="span5 control-group">
						<label class="control-label"><b>Related To</b></label>
						<div class="controls">
							<div>
								<div class="pull-left">
									<ul name="contacts" class="contacts tags tagsinput"></ul>
								</div>
								<input type="text" id="task_related_to"
									class="typeahead typeahead_contacts" data-provide="typeahead"
									data-mode="multiple" size="40" />
							</div>
						</div>
					  </div>	
					</div>					
					<div class="row-fluid hide">
					    <div class="control-group">
							<label for="notes" class="control-label"><b>Notes</b></label>
							<div class="controls pull-right task-add-note">
								<a href="#"><i class="icon-plus" /> Add Note</a>
							</div>
							<div id="forNoteForm" class="controls"></div>
							<ul id="notes" name="notes" class="notes"></ul>
						</div>
					</div>
                </fieldset>
            </form>
        </div>
    </div>
    <div class="modal-footer">
        <a href="#" class="btn btn-primary" id="task_event_validate">Save </a>
        <span class="save-status"></span>
    </div>
</div>
<!-- End of Modal views --><!-- New (Note) Modal views -->
<div class="modal hide fade deal-note-modal" id="deal-note-modal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-plus-sign"></i>&nbsp;Add Note</h3>
    </div>
    <div class="modal-body">
        <form id="dealnoteForm" name="dealnoteForm" method="post">
            <fieldset>
                <input name="from_task" id="from_task" type="hidden" value="" />
                <input name="task_form" id="task_form" type="hidden" value="" />
                	            
                <div class="control-group">
                    <label class="control-label"><b>Subject</b> <span class="field_req">*</span></label>
                    <div class="controls">
                        <input type="text" placeholder="About" name="subject" id="subject" class="required" />
                    </div>
                </div>
                <div class="row-fluid">
	                <div class="control-group">
	                    <label class="control-label"><b>Description</b></label>
	                    <div class="controls">
	                        <textarea rows="3" class="span8" placeholder="Detailed Note" name="description" id="description" style="max-width:400px;"></textarea> 
	                    </div>
	                </div>
                </div>
                <div class="control-group">
                    <label class="control-label"><b>Related To</b></label>
                    <div class="controls">
                        <div>
                            <div class="pull-left">
                                <ul name="deal_ids" class="contacts tags tagsinput"></ul>
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
    <div class="modal-footer">
        <a href="#" class="btn btn-primary" id="dealnote_validate">Save
        </a>
        <span class="save-status"></span>
    </div>
</div>
<!-- End of Modal views --><script id="notes-collection1-template" type="text/html">
 <h2>List of Notes</h2>
<table class="table table-bordered">
    <thead>
        <tr>
            <th></th>
            <th>Id</th>
            <th>subject</th>
            <th>description</th>
        </tr>
    </thead>
    <tbody id="notes-model-list">
    </tbody>
</table>
</script>

<script id="notes-modal-template1" type="text/html">
	<td>
    	<icon class="deleteNote icon-remove-circle"></icon>
	</td>
	<td>{{id}} </td>
	<td>{{subject}} </td>
	<td>{{note}}</td>
<br />
</script><div class="modal hide fade" id="notification-disable-help-modal">
	<div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3>Disable Desktop Notifications</h3>
    </div>
	<div class="modal-body">
        <div id="notification-help-detail">
           <table> 
               <tr>
                   <td><img alt="notification-help" src="/img/notification-help/notification-disable-help.png" width="350px" height="350px"/></td>
                   <td><ul>
                           <li>Click on the small icon to the left of <b>'https'</b> in the location bar.</li>
                           <li>You can view <b>Notifications</b> option under Permissions tab.</li>
                           <li>Click on the right side of <b>Notifications</b> to select <b>Always block on this site.</b></li>
                       </ul>
                   </td>
               </tr>
           </table>
		</div>
    </div>
</div>
<div class="modal hide fade" id="notification-enable-help-modal">
	<div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3>Enable Desktop Notifications</h3>
    </div>
	<div class="modal-body">
        <div id="notification-help-detail">
           <table> 
               <tr>
                   <td><img alt="notification-help" src="/img/notification-help/notification-enable-help.png" width="350px" height="350px"/></td>
                   <td><ul>
                           <li>Click on the small icon to the left of <b>'https'</b> in the location bar.</li>
                           <li>You can view <b>Notifications</b> option under Permissions tab.</li>
                           <li>Click on the right side of <b>Notifications</b> to select <b>Always allow on this site.</b></li>
                       </ul>
                   </td>
               </tr>
           </table>
		</div>
    </div>
</div>
<script id="notify-html-template" type="text/html">
<div> 
<!-- Image urls hidden to show in desktop notifications. First span is for contact image and second span is for company.--> 
<span type="hidden" id={{gravatarurl properties 50}}></span>
<span type="hidden" id="https://www.google.com/s2/favicons?domain={{getPropertyValue properties "url"}}"></span>

   {{#if entity_type}}
       <span><a href="#deals" id="notification-deal-id" style="color:black;font-weight:bold">{{name}}</a></span>
   {{else}}
       {{#if_contact_type "PERSON"}}
           <span style="vertical-align:text-top">
               <a href="#contact/{{id}}" id="notification-contact-id" style="color:black;font-weight:bold;" title=" {{getPropertyValue properties "first_name"}} {{ getPropertyValue properties "last_name"}}">{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}</a>   
       	   </span>
        {{/if_contact_type}}

        {{#if_contact_type "COMPANY"}}
           <span style="vertical-align:text-top">
               <a href="#contact/{{id}}" id="notification-contact-id" style="color:black;font-weight:bold;">{{getPropertyValue properties "name"}}</a>
           </span>  
        {{/if_contact_type}}
   {{/if}} 
    <span style="margin-left:2px" id= "notification-type">{{#if_notification_type}} {{notification}} {{/if_notification_type}}</span>
</div>
</script>

<script id="campaign-notify-template" type="text/html">
<div>
<span type="hidden" id={{gravatarurl properties 50}}></span>
<span style="vertical-align:text-top">
	<a href="#contact/{{id}}" id = "campaign-contact-id" style="color:black;font-weight:bold;" title=" {{getPropertyValue properties "first_name"}} {{ getPropertyValue properties "last_name"}}">{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}</a>
</span>
</br>
<span style="margin-left:2px" id="campaign-notify-text">{{#stringToJSON this "custom_value"}}{{msg}}{{/stringToJSON}}</span>
</div>
</script>

<script id="call-notification-template" type="text/html">
<div>
<span type="hidden" id="{{gravatarurl properties 50}}"></span>
<span style="margin-left:5px" id="call-notification-text">is calling</span>
<span style="float:left;">
	<a href="#contact/{{id}}" id="calling-contact-id" style="color:black;font-weight:bold;" title="{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}">{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}</a>
</span>
</div>
</script>

<script id="unknown-call-notification-template" type="text/html">
<div>
<span type="hidden" id="https://dpm72z3r2fvl4.cloudfront.net/css/images/user-default.png"></span>
<span style="margin-left:5px" id="unknown-call-notification-text">is calling</span>
<span style="float:left;">
	<a href="#contacts/call-lead/{{first_name}}/{{last_name}}" id="unknown-contact-name" style="color:black; font-weight:bold;" title="{{first_name}} {{last_name}}">{{first_name}} {{last_name}}</a>
</span>
</div>
</script>

<script id="event-notification-template" type="text/html">
<div>
<span class="noty_text" id="noty_text">'{{title}}' coming up at {{epochToHumanDate "h:MM TT" start}}</span></div>
</script>
 <script id="onboarding-saas-template" type="text/html">
	<div class="row">
		<div class="span12">
			<div class="page-header">
				<h1>&nbsp;Agile CRM for SaaS Companies</h1>
			</div>
		</div>
	</div><br>
	
	<div  class="row-fluid" style=" position: relative;">
			<div   class="span6" style="text-align: center;"  >  <iframe width="335" height="260" style = "overflow:auto;"
				src="//www.youtube.com/embed/CWMelsl70H4" frameborder="0"
				allowfullscreen></iframe>
			 </div>
    		<div  class="span6" style="position: relative; text-align: center; margin: 0px;" > <iframe src="https://www.slideshare.net/slideshow/embed_code/32115990" width="335" height="260" frameborder="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; max-width: 100%;" allowfullscreen> </iframe> 
			</div>
	</div>
   
	<ul style="width: 60%; margin: 0px 0px 0px 0px;" class="agile-doc-view">
		<div class="row">
			<div class="span12">
				<br><br><h2>&nbsp;Things you need to do</h2>
			</div>
		</div><br>
		<li class="active" style="background-color: #ffff; list-style-type: none;">
			<h3>
				<span class="badge" style="font-size: 16px; font-weight: 700; border-radius: 10px;">1</span>
							 &nbsp;Track Visitors
			</h3>
			<p style="color: #555;  padding-left: 40px;">Track visitors on your website or app and get insights into user activity.
						Setup the following tracking code on your website. 
			</p>
			<div class="clearfix"></div>
			<div style="padding-left:40px;position: relative;">
				<a class="right" id="saas_api_track_code_icon"
							style="margin: 5px 10px 0px 0px; cursor: pointer; position: absolute;right: 3px;"><i
							class="icon-copy"></i>
				</a>
				<pre class="prettyprint" id="saas_api_track_code" style="margin:0px 0px 15px 0px;">&lt;script type="text/javascript" src="https://{{getCurrentDomain}}.agilecrm.com/stats/min/agile-min.js"&gt; 
&lt;/script&gt;
&lt;script type="text/javascript" &gt;
 _agile.set_account('{{api_key}}', '{{getCurrentDomain}}');
 _agile.track_page_view();
&lt;/script&gt;</pre>
				<p style="color: #555;  padding-left: 0px;">Need help? Check the <a id = "documentation" href = "https://github.com/agilecrm/javascript-api#setting-api--analytics/" target="_blank">documentation</a>.</p>
			</div>
		</li><br><br>
		<li style="background-color: #ffff; list-style-type: none;">
			<h3>
				<span class="badge"
					style="font-size: 16px; font-weight: 700; border-radius: 10px;">2</span>
					&nbsp; Sync new Signups
			</h3>
						
			<p style="color: #555; padding-left: 40px;">
				Sync all your customer data into agile automatically along with their activity. Add new signups as contacts and start engaging with them.
				Use our <a id="webToLead" name="webToLead" href="#integrations">web to lead</a>
				 integrations or  <a id="JsApi" name="JsApi" href="https://github.com/agilecrm/javascript-api#2contact" target="_blank">JS API</a> to set up contacts sync.
			</p>
		</li><br><br>
		<li style="background-color: #ffff; list-style-type: none;">
			<h3>
				<span class="badge"
					style="font-size: 16px; font-weight: 700; border-radius: 10px;">3</span>
					&nbsp; Automate Email Messages
			</h3>
			<p style="color: #555;  padding-left: 40px;">Agile can send relevant messages to your users based on what they do (or don’t do) on your site or application. Start engaging your users on email by creating a <a id= "campaign" href = "#workflows">campaign</a>.</p>
			<p style="margin:0px 0px 0px 160px">
				<iframe width="335" height="260" src="//www.youtube.com/embed/RXOqougExkM" frameborder="0" allowfullscreen></iframe>
			</p>
		</li><br><br>
		<li style="background-color: #ffff; list-style-type: none; ">
			<h3>
				<span class="badge"
					style="font-size: 16px; font-weight: 700; border-radius: 10px;">4</span>
							 &nbsp;In-app Messages & Web popups
			</h3>
			<p style="color: #555; padding-left: 40px; ">Engage your visitors on your website or app with timely popups. Suggest them things to do, show signup forms, or promotional offers.
				Start by creating a <a id="web-rules" href="#web-rules">Web Rule</a> or watch the video.
			</p>
			<p style="margin:0px 0px 0px 160px">
				<iframe width="335" height="260" src="//www.youtube.com/embed/XGouq0B_7G8" frameborder="0" allowfullscreen></iframe>
			</p>
						
		</li><br><br>
	</ul>
</script>



<!-- online scheduling Modal views -->
<div class="modal hide fade" id="scheduleModal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3><i class="icon-info-sign"></i> Online Appointment Scheduling</h3>
    </div>
    <div class="modal-body " style="max-height:420px !important">
        <form id="icalForm" name="icalForm" method="post">
            <fieldset>

                     <div class="control-group" style="float:left;">
                       <label class="control-label"><b>Your Personalized Link </b></label>
                        <div class="controls schedule_url_online" id="schedule-url-id" style="width:540px;word-wrap:break-word;display:inline-block;">
                        <a href="" target="_blank" name="scheduleurl" id="scheduleurl"><span id="hrefvalue"></span><span id="schedule_id">{{this.schedule_id}}</span></a>
<div class="" id="edit" style="display:inline;"><a href="" style="margin-top: 3px;" id="edit-schedule-id" class="edit-schedule-id nounderline"><i title="Edit" class="icon-edit" style="margin-left: 30px;"></i></a></div>
                     
 </div>
<div id="specialchar" style="color: red;display:none;">Special characters are not allowed except underscore.</div>
<div id="charlength" style="color: red;display:none;">Please enter at least 4 letters.</div>
<div class="clearfix"></div> 
 <div id="desctiption" style="margin-top: 7px;">
                    <label class="control-label"><b>What is Online Appointment Scheduling?</b></label>
                   <p> Scheduling meetings over email or phone is tedious. Agile allows your customers to schedule a meeting with you directly in just a few clicks. </p> 
               </div>  
<div id="suggestion" >
                    <label class="control-label"><b>How can I define my daily available timeslots?</b></label>
                   <p> Link your Google calendar with Agile from Preferences -> Sync. In your Google Calendar, create an event that covers all your unavailable time, and make it repeat everyday. </p> 
               </div> 
 <div id="tip">
                   <p style="margin:6px 0px 0px"><i class="icon-lightbulb" style="font-size:17px;"></i> Put this link in the signature or in your automated emails</p> 
               </div> 
                    </div>
               
            
         
             </fieldset>
         </form>
  
         <!-- <a href="#" id="send-schedule-url-email"><i class="icon-envelope-alt"></i> Send your schedule URL via Email</a>-->
     </div>
</div>
<script id="new-opportunity-header-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1>Deals <small>Opportunities</small></h1>
			<div class="btn-group right" id="deals-action" style="display: inline; top: -30px;margin-right:20px;">
					<a href="#deals-add" class="deals-add btn right"><i class="icon-plus-sign" /> Add Deal
					</a>
					<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
						<span class="caret"></span>
					</a>
					<ul class="dropdown-menu pull-right">
						<li><a href="#import-deals" >Import from CSV</a></li>
						<li><a href="#" class="deals-export-csv">Export as CSV</a></li>
					</ul>
			</div>
			<div class="btn-group right" id="deals-view" style="display: inline; top: -30px;margin-right:20px;">
					<div class="btn"><i class="icon-list" style="margin-right:3px"></i></div>
					<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
						<span class="caret"></span>
					</a>
					<ul class="dropdown-menu pull-right">
						<li><a href="#" class="deals-list-view">List View</a></li>
						<li class="dropdown-submenu do-onclick-nothing"><a href="#" data-toggle="dropdown" class="deals-pipelined-view">Milestone View</a>
							<ul class="dropdown-menu">
								<li><a href="#" id="deal-milestone-regular">Relaxed</a></li>
								<li><a href="#" id="deal-milestone-compact">Compact</a></li>
								<li><a href="#" id="deal-milestone-fit">Fit</a></li>
							</ul>
						</li>
					</ul>
			</div>
			<div id="deal-list-filters" class="btn-group right" style="display: inline; top: -30px;margin-right:20px;">
				 <img class="loading_img" style="padding-right:5px;" height="32px" width="32px" src= "img/21-0.gif"></img>
			</div>
			<div class="btn-group right" id="deals-tracks"
				style="display: inline; top: -30px;margin-right:20px;">
			</div>
        </div>
    </div>
</div>
<div class="row">
    <div class="span12">
        <div id="new-opportunity-list-paging" class="row-fluid">
			 <img class="loading_img" style="padding-right:5px;" height="32px" width="32px" src= "img/21-0.gif"></img>
			<div id="opportunities-by-milestones-model-list">
			</div>
        </div>
    </div>
</div>

<!-- Archive confirmation-->
<div id="deal_archive_confirm_modal" class="modal hide fade">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
    <h3>Archive Deal</h3>
  </div>
  <div class="modal-body">
    <div id="deal-bulk-confirm">
		<input id="archived-deal-id" name="id" type="hidden" value="{{id}}" />
		<input id="archived-deal-milestone" name="milestone" type="hidden" value="{{milestone}}"/>
		Deals can be archived and will not be shown. You can view them later by selecting 'All' in the filter.  
		<br/> Are you sure to archive this deal?
	</div>
  </div>
  <div class="modal-footer">
    <a href="#" id="deal-quick-archive" class="btn btn-primary">Yes</a>
	<button type="button" class="btn" data-dismiss="modal" aria-hidden="true">No</button>
  </div>
</div>

<!-- Restore confirmation-->
<div id="deal_restore_confirm_modal" class="modal hide fade">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
    <h3>Restore Deal</h3>
  </div>
  <div class="modal-body">
	<input id="restored-deal-id" name="id" type="hidden"/>
	<input id="restored-deal-milestone" name="milestone" type="hidden"/>
    <div id="deal-bulk-confirm">
		Restoring the Deal will make it active again. <br/> Restore this Deal?
	</div>
  </div>
  <div class="modal-footer">
    <a href="#" id="deal-quick-restore" class="btn btn-primary">Yes</a>
	<button type="button" class="btn" data-dismiss="modal" aria-hidden="true">No</button>
  </div>
</div>
</script>

<script id="opportunities-by-paging-collection-template" type="text/html">
<div id="opportunities-by-paging-model-list">
<div class="milestone-main">
				</div>
</div>
</script>
<script id="opportunities-by-paging-model-template" type="text/html">
	<div class='dealtitle-angular'>
		<p class='milestone-heading'> <span class="miltstone-title">{{heading}}</span><span id="{{remove_spaces heading}}_count" class="txt-mute" style="margin-left:5px;vertical-align:top;font-size:80%;"></span><span class="pull-right" style="position: absolute;right: 11px;top: -1px;"><img class="loading_img" src="/img/ajax-loader-cursor.gif" width="12px"></span></p>
		<span></span>
	</div>
	<div id="{{remove_spaces heading}}-list-container" class='milestones' milestone='{{heading}}'>
		
	</div>
</script>

<script id="deals-by-paging-collection-template" type="text/html">
<ul id="deals-by-paging-model-list" class="milestones">
</ul>
</script>

<script id="deals-by-paging-model-template" type="text/html">
<div id={{id}} data="{{milestone}}" class="data agile-overflow-ellipsis">
	<div>
		<b style="max-width: 70%;overflow: hidden;display: inline-block;line-height: 14px;float:left;white-space: normal;word-wrap: break-word;"><a href="#deal/{{id}}">{{name}}</a></b>
		
		<span class="right dealnotes-view" style="margin-top:-3px;">
			{{#if notes}}
             <span class="txt-small note-count" title="Notes" >{{notes.length}}</span><a title="Notes" data-toggle="tooltip" data-placement="top" data-trigger="hover" data-container="No Notes" class="deal-notes deal-edit" style="cursor:pointer;text-decoration:none;"><i class="deal-action icon icon-comment-alt deal-notes" data="{{id}}"></i></a>
              
			{{/if}}
		</span>
		<div class="clearfix"></div>
	</div>
	<div class="agile-overflow-ellipsis" style="white-space:initial;">

		<span>{{currencySymbol}}{{numberWithCommas expected_value}}</span>
	</div>
	{{#if this.contacts}}
	<div class="agile-overflow-ellipsis" style="display:block;margin-top:0px;">
		{{#related_to_one contacts}}{{/related_to_one}}
	</div>
	{{/if}}{{#if_greater this.contacts.length "5"}}<span>,..</span>{{/if_greater}}
	<div class="pull-left">
		<small>
			<time class="deal-close-time" datetime="{{epochToHumanDate "" close_date}}" style="border-bottom:dotted 1px #999;">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" close_date}}</time>
		</small>
	</div>
<div class="pull-right">
<span class="right deal-options" style="visibility:hidden;">
			{{#if_equals archived false}}
			<a title="Archive" class="deal-archive" style="cursor:pointer;text-decoration:none;"> <i style="width: 0.9em!important;" class="icon-archive"></i> </a>
			{{/if_equals}}
			{{#if_equals archived true}}
			<a title="Restore" class="deal-restore" style="cursor:pointer;text-decoration:none;"> <i style="width: 0.9em!important;" class="icon-mail-reply"></i> </a>
			{{/if_equals}}
			{{#if_equals archived false}}
			<a title="Edit" class="deal-edit" style="cursor:pointer;text-decoration:none;"> <i style="width: 0.9em!important;" class="icon-pencil"></i> </a>
            {{/if_equals}}
			<a title="Delete" class="deal-delete" style="cursor:pointer;text-decoration:none;"><i style="width: 0.9em!important;" class="icon-trash"></i></a>
        </span>
</div>
<div class="clearfix"></div>
</div>
</script>

<script id="deals-by-paging-relax-collection-template" type="text/html">
<ul id="deals-by-paging-relax-model-list" class="milestones">
</ul>
</script>

<script id="deals-by-paging-relax-model-template" type="text/html">
<div id={{id}} data="{{milestone}}" class="data agile-overflow-ellipsis">
	<div>
		<b style="max-width: 70%;overflow: hidden;display: inline-block;line-height: 14px;float:left;white-space: normal;word-wrap: break-word;"><a href="#deal/{{id}}">{{name}}</a></b>
		
		<span class="right dealnotes-view" style="margin-top:-3px;">
			{{#if notes}}
             <span class="txt-small note-count" title="Notes" >{{notes.length}}</span><a title="Notes" data-toggle="tooltip" data-placement="top" data-trigger="hover" data-container="No Notes" class="deal-notes deal-edit" style="cursor:pointer;text-decoration:none;"><i class="deal-action icon icon-comment-alt deal-notes" data="{{id}}"></i></a>
              
			{{/if}}
		</span>
		<div class="clearfix"></div>
	</div>
	<div class="agile-overflow-ellipsis" style="white-space:initial;">

		<span>{{currencySymbol}}{{numberWithCommas expected_value}}</span>
		{{#if this.contacts}}
			<span style="margin:0px 5px;border:1px solid #d5d5d5"></span>
			{{#related_to_one contacts}}{{/related_to_one}}
		{{/if}}{{#if_greater this.contacts.length "5"}}<span>,..</span>{{/if_greater}}
	</div>
	<div class="pull-left">
		<small>
			<time class="deal-close-time" datetime="{{epochToHumanDate "" close_date}}" style="border-bottom:dotted 1px #999;">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" close_date}}</time>
		</small>
	</div>
<div class="pull-right">
<span class="right deal-options" style="visibility:hidden;">
			{{#if_equals archived false}}
			<a title="Archive" class="deal-archive" style="cursor:pointer;text-decoration:none;"> <i style="width: 0.9em!important;" class="icon-archive"></i> </a>
			{{/if_equals}}
			{{#if_equals archived true}}
			<a title="Restore" class="deal-restore" style="cursor:pointer;text-decoration:none;"> <i style="width: 0.9em!important;" class="icon-mail-reply"></i> </a>
			{{/if_equals}}
			{{#if_equals archived false}}
			<a title="Edit" class="deal-edit" style="cursor:pointer;text-decoration:none;"> <i style="width: 0.9em!important;" class="icon-pencil"></i> </a>
            {{/if_equals}}
			<a title="Delete" class="deal-delete" style="cursor:pointer;text-decoration:none;"><i style="width: 0.9em!important;" class="icon-trash"></i></a>
        </span>
</div>
<div class="clearfix"></div>
</div>
</script>

<script id="related-to-contacts-template" type="text/html">
	{{#if_contact_type "PERSON"}}	
		<a href="#contact/{{id}}">{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}</a>
    {{/if_contact_type}}
	{{#if_contact_type "COMPANY"}}
     	<a href="#contact/{{id}}">{{getPropertyValue properties "name"}}</a>
    {{/if_contact_type}}
</script>
<script id="opportunity-track-list-collection-template" type="text/html">
<div class="btn-group right" style='position:relative' id="pipeline-tour-step">
	<button class="btn filter-dropdown "><i class="icon-road" style="margin-right:4px"/></button>
	<button class="btn dropdown-toggle" data-toggle="dropdown">
    	<span class="caret"></span>
  	</button>
	<ul id = "opportunity-track-list-model-list" class="pull-right dropdown-menu">
	</ul>
</div>
</script>

<script id="opportunity-track-list-model-template" type="text/html">
{{#if name}}
<a id='{{id}}' class="pipeline" data="{{name}}" style="cursor: pointer;">{{name}}</a>
 {{else}}
<a id='{{id}}' class="pipeline" data="Default" style="cursor: pointer;">Default</a>
{{/if}}
</script>
<script id="opportunities-collection-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1>Deals <small>Opportunities</small></h1>
			<!--a href="#deals-add" class="deals-add btn right" style="top:-30px;position: relative;"><i class="icon-plus-sign" /> Add Deal</a-->
			<div class="btn-group right" id="deals-action"
				style="display: inline; top: -30px;margin-right:20px;">
					<a href="#deals-add" class="deals-add btn right"><i class="icon-plus-sign" /> Add Deal
					</a>
					<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
						<span class="caret"></span>
					</a>
					<ul class="dropdown-menu pull-right">
						<li><a href="#import-deals" >Import from CSV</a></li>
						<li><a href="#" class="deals-export-csv">Export as CSV</a></li>
					</ul>
			</div>
			<div class="btn-group right" id="deals-view"
				style="display: inline; top: -30px;margin-right:20px;">
					<div class="btn"><i class="icon-list" style="margin-right:3px"></i></div>
					<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
						<span class="caret"></span>
					</a>
					<ul class="dropdown-menu pull-right">
						<li><a href="#" class="deals-list-view" onclick="return false;">List View</a></li>
						<li><a href="#" class="deals-pipelined-view">Milestone View</a></li>
					</ul>
			</div>
			<div id="deal-list-filters" class="btn-group right" style="display: inline; top: -30px;margin-right:20px;">
				 <img class="loading_img" style="padding-right:5px;" height="32px" width="32px" src= "img/21-0.gif"></img>
			</div>
			<div class="btn-group right hidden" id="deals-tracks"
				style="display: inline; top: -30px;margin-right:20px;">
			</div>
        </div>
    </div>
</div>
<div class="row">
    <div class="span9">
        <div id="slate">
        </div>
        {{#if this.length}}
        <div id="total-pipeline-chart" style="width:100%; height:300px"></div>
        <br /><br />
        <div class="data-block">
            <div class="data-container" style="overflow-x:auto;">
				<div class="btn-group pull-left" id="bulk-actions" style="display: none;">
					<div class="btn">Bulk Actions</div>
					<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
						<span class="caret"></span>
					</a>
					<ul class="dropdown-menu" id="view-actions">
						<li><a href="#deal_owner_change_modal" data-toggle="modal">Change Owner</a></li>
						<li><a href="#deal_mile_change_modal" data-toggle="modal">Change Milestone/Track</a></li>
						<li><a href="#deal_bulk_archive_modal" data-toggle="modal">Archive</a></li>
						<li><a href="#deal_bulk_restore_modal" data-toggle="modal">Restore</a></li>
						<li><a href="#deal_bulk_delete_modal" data-toggle="modal">Delete</a></li>
					</ul>
			</div>
			<div class="btn-group pull-left" style="display: none;left: 10px;margin-top: 5px;" id="bulk-select"></div>
                <table class="table table-striped showCheckboxes agile-ellipsis-dynamic" url="core/api/opportunity/bulk" id="deal-list" style="table-layout:auto;">
                    <col width="30px"><col width="20%"><col width="27%"><col width="14%"><col width="13%"><col width="15%"><col width="10%">
					<thead>
                        <tr>
                            <th>Opportunity</th>
                            <th>Related To</th>
                            <th>Value</th>
                            <th>Milestone</th>
                            <th>Close Date</th>
                            <th>Owner</th>
                        </tr>
                    </thead>
                    <tbody id="opportunities-model-list" style="cursor:pointer;"><!--route="deals/"-->
                    </tbody>
                </table>
            </div>
        </div>
        {{/if}}
    </div>
    <div class="span3">
        <div class="data-block">
            <div class="well">
                <header>
                    <h3><span><i class="icon-flag"></i></span> Milestones</h3>
                </header>
                <div id="pie-deals-chart" style="width:100%; height:400px"></div>
                <h3 style="margin-top:10px;">
                    What are Milestones?
                </h3>
                <br />
                <p>
                    Milestones are used to define the status of the deal.
                </p>
                <p>
                    e.g. Use 'Won' in case of a successfully completed deal or 'New' for a newly added deal. You can define custom milestones.
                </p>
                <br />
                <h3>
                    What are Deals?
                </h3>
                <br />
                <p>
                    Deals are opportunities you can continuously track throughout its life cycle. You may add contacts related to the deal, add description, monetary value and timelines. You can also setup milestones to constantly track the status of the deal.
                </p>
            </div>
        </div>
    </div>
</div>
<div id="deal_owner_change_modal" class="modal hide fade">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
    <h3>Change Owner</h3>
  </div>
  <div class="modal-body">
    <div class="control-group span5" style="margin-left: 30px;">
		<p style="margin-top:5px;">Changing owner for <span class="count"> </span> Deal(s).</p>
		<label class="control-label"><b>Select Owner </b><span
			class="field_req">*</span></label>
			<div class="controls" id="owners">
				<select id="owners-list-bulk" class="required" name="owner_id"></select>
			</div>
	</div>
  </div>
  <div class="modal-footer">
    <a href="#" id="deal-bulk-owner" class="btn btn-primary">Done</a>
  </div>
</div>
<div id="deal_mile_change_modal" class="modal hide fade">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
    <h3>Change Milestone/Track</h3>
  </div>
  <div class="modal-body">
	<form id="bulk_mile_Form" name="opportunityForm" method="post">
	<p style="margin-left:30px;margin-top:5px;">Changing track/milestone for <span class="count"> </span> Deal(s).</p>
    <div class="control-group span5" style="margin-left: 30px;">
		<label class="control-label"><b>Select Track </b><span
			class="field_req">*</span></label>
			<div class="controls" id="bulk-pipeline">
				<select id="pipeline-list-bulk" class="required" name="pipeline"></select>
			</div>
	</div>
	<div class="control-group span5" style="margin-left: 30px;">
		<label class="control-label"><b>Select Milestone </b><span
			class="field_req">*</span></label>
			<div class="controls" id="bulk-pipeline">
				<select id="milestone-list-bulk" class="required" name="milestone"></select>
			</div>
	</div>
<input type="hidden" id="pipeline-name"  name="pipeline-name"></input>
	</form>
  </div>
  <div class="modal-footer">
    <a href="#" id="deal-bulk-mile" class="btn btn-primary">Done</a>
  </div>
</div>

<!-- Bulk archive confirmation-->
<div id="deal_bulk_archive_modal" class="modal hide fade">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
    <h3>Archive</h3>
  </div>
  <div class="modal-body">
    <div id="deal-bulk-confirm" style="margin-left: 30px;">
		Archive <span class="count"> </span> Deal(s)?
	</div>
  </div>
  <div class="modal-footer">
    <a href="#" id="deal-bulk-archive" class="btn btn-primary">Yes</a>
	<button type="button" class="btn" data-dismiss="modal" aria-hidden="true">No</button>
  </div>
</div>

<!-- Bulk restore confirmation-->
<div id="deal_bulk_restore_modal" class="modal hide fade">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
    <h3>Restore</h3>
  </div>
  <div class="modal-body">
    <div id="deal-bulk-confirm" style="margin-left: 30px;">
		Restore <span class="count"> </span> Deal(s)?
	</div>
  </div>
  <div class="modal-footer">
    <a href="#" id="deal-bulk-restore" class="btn btn-primary">Yes</a>
	<button type="button" class="btn" data-dismiss="modal" aria-hidden="true">No</button>
  </div>
</div>

<!-- Bulk delete confirmation-->
<div id="deal_bulk_delete_modal" class="modal hide fade">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
    <h3>Delete</h3>
  </div>
  <div class="modal-body">
    <div id="deal-bulk-confirm" style="margin-left: 30px;">
		Delete <span class="count"> </span> Deal(s)?
	</div>
  </div>
  <div class="modal-footer">
    <a href="#" id="deal-bulk-delete" class="btn btn-primary">Yes</a>
	<button type="button" class="btn" data-dismiss="modal" aria-hidden="true">No</button>
  </div>
</div>
</script>
<script id="opportunities-model-template" type="text/html">
<td data="{{id}}" class="data">
	<div style="width:10em;text-overflow:ellipsis;">
	<b style="height:auto;display:inline-block;">{{name}}</b>
	</div>
</td>
<td>
	<div style="max-height:50px!important;">
		<div style="max-height:50px!important;display:inline-block;width:158px!important;text-overflow:clip!important;">
		{{#each contacts}}
        	{{#if_contact_type "PERSON"}}
        		<a href="#contact/{{id}}" class="activate-link hide-popover"><img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" width="40px" height="40px" style="display:inline; width:40px; height:40px; "  title="{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}" /></a>
        	{{/if_contact_type}}
			{{#if_contact_type "COMPANY"}}
        		<a href="#contact/{{id}}" class="activate-link hide-popover"><img class="thumbnail" {{getCompanyImage "40" "display:inline;"}} title="{{getPropertyValue properties "name"}}"/></a>
        	{{/if_contact_type}}
       {{/each}}
		</div>{{#if_greater this.contacts.length "4"}}<span>...</span>{{/if_greater}}
	</div>
</td>
<td value="{{expected_value}}"><div>{{currencySymbol}}{{numberWithCommas expected_value}}</div></td>
<td><div style="">{{milestone}} ({{probability}}%) </div></td>
<td><div style="width:8em;"><time class="deal-close-time" value="{{close_date}}" datetime="{{epochToHumanDate "" close_date}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" close_date}}</time></div></td>
<td>
    <div style="height:auto;text-overflow:ellipsis;white-space:nowrap;width:4em;overflow:hidden;">
       {{#if pic}}
        <img class="thumbnail" src="{{pic}}" width="40px" height="40px" title="{{owner.name}}" />
	   {{else}}
		<img class="thumbnail" src="{{defaultGravatarurl 50}}" width="40px" height="40px" title="{{owner.name}}" />
       {{/if}}
    </div>
</td>
</script>

<script id="opportunity-track-list-collection-template" type="text/html">
<div class="btn-group right" style='position:relative' id="filters-tour-step">
	<button class="btn filter-dropdown "><i class="icon-road" style="margin-right:4px"/></button>
	<button class="btn dropdown-toggle" data-toggle="dropdown">
    	<span class="caret"></span>
  	</button>
	<ul id = "opportunity-track-list-model-list" class="pull-right dropdown-menu">
	</ul>
</div>
</script>

<script id="opportunity-track-list-model-template" type="text/html">
{{#if name}}
<a id='{{id}}' class="pipeline" data="{{name}}" style="cursor: pointer;">{{name}}</a>
 {{else}}
<a id='{{id}}' class="pipeline" data="Default" style="cursor: pointer;">Default</a>
{{/if}}
</script>
<script id="opportunity-detail-popover-template" type="text/html">
<div class="row-fluid">
    <div class="span9" style="margin-left:0px;">
        <div>
            <div style="line-height:20px;font-style:italic;margin-bottom:5px;">
                {{description}}
            </div>
            
            <div style="margin:5px;">
                <p><b>Owner : </b>{{owner.name}}</p>
                {{#if contacts}}<p><b>Related To : </b></p>{{/if}}
                <div>
				{{#each contacts}}
                	<div class="span4" style="display:inline-block;margin:5px;margin-left:25px;">
        			{{#if_contact_type "PERSON"}}
        				<img class="thumbnail" src="{{gravatarurl properties 50}}" width="40px" height="40px" style="width:40px; height:40px; "/>
                    	<div style="display:inline-block;text-overflow:ellipsis;white-space:nowrap;width:90px;overflow:hidden;">
                        	{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}
                    	</div>
        			{{/if_contact_type}}
					{{#if_contact_type "COMPANY"}}
        				<img class="thumbnail" {{getCompanyImage "40"}}/>
                    	<div style="display:inline-block;text-overflow:ellipsis;white-space:nowrap;width:90px;overflow:hidden;">
                        	{{getPropertyValue properties "name"}}
                    	</div>
        			{{/if_contact_type}}
                	</div>
                {{/each}}
                </div>
            </div>
        </div>
    </div>
</div>
</script><script id="deal-filter-template" type="text/html">
<div class="widget-box" id="widget-box">
	<div id="deal-filters" class="btn-group helpdesk-filters">
		<a id="show-filter-button" class="btn dropdown-toggle" title="Filters">
			<i id="icon-filter" class="icon-filter icon-white"></i>
		</a>
		<div class="dropdown-menu pull-right" id="filter_options"
			style="margin-top: 5px; padding: 0px; background-color: #cad2dd;right:-10px;">
			<div id="filter_list">
				<div class="arrow"></div>
				<div id="popover-content" class="popover-content">
					<div id="popup_header" class="popup_header" style="padding-bottom: 5px;">
						<span id="filters-heading" class="heading" style="font-size: 11px;">Filters</span> <span
							id="clear-deal-filters" class="btn btn-small pull-left"
							style="font-size: 9px; font-weight: bold; color: #475b6f; text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5); padding: 2px 6px 2px 6px;">Clear</span>
						<span id="deals-filter-validate" class="btn btn-primary btn-small pull-right save"
							style="font-size: 9px; font-weight: bold; color: #fff; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.3); padding: 2px 6px 2px 6px;">Done</span>
					</div>
					<style>
						.ticket-filter-container select, .ticket-filter-container input{
							width: 100%;
							height: 23px;
							font-size: 10px;
						}
						.ticket-filter-container label{
							font-size: 11px;
							width: 170px;
							height: 20px;
							margin-bottom: 0;
						}
						.row-filter{
							padding-top: 4px !important;
						}
					</style>
					<div id="deal-filter-container" class="deal-filter-container inner-box">
		<form id="dealsFilterForm" name="dealsFilterForm" role="form" style="margin-bottom:0px;">
			<fieldset>
				<div class="control-group row-filter">
					<label class="control-label"><b>Owner </b> 
						<a data-toggle="collapse" href="#owners" style="display:inline;position:absolute;right:5px;text-decoration:none;" class="changeIcon"><i class="icon-plus" /></a>
					</label>
					<div class="controls collapse" id="owners">
						<select id="owners-list-filters" name="owner_id"></select>
						<img class="loading-img" src="img/21-0.gif"></img>
					</div>
				</div>
				<div class="control-group row-filter list_view">
					<label class="control-label"><b>Track </b>
						<a data-toggle="collapse" href="#track_div" style="display:inline;position:absolute;right:5px;text-decoration:none;" class="changeIcon"><i class="icon-plus" /></a>
					</label>
					<div class="controls collapse" id="track_div">
						<span><select id="pipeline" name="pipeline_id">
								<option value="">Select..</option>
						</select></span><img class="loading-img" src="img/21-0.gif"></img>
					</div>
				</div>
				<div class="control-group row-filter list_view">
					<label class="control-label"><b>Milestone </b>
						<a data-toggle="collapse" href="#milestone_div" style="display:inline;position:absolute;right:5px;text-decoration:none;" class="changeIcon"><i class="icon-plus" /></a>
					</label>
					<div class="controls collapse" id="milestone_div">
						<span><select id="milestone" name="milestone">
								<option value="">Select..</option>
						</select></span><img class="loading-img" src="img/21-0.gif" style="display:none;"></img>
					</div>
				</div>
					
				<div class="control-group row-filter" id="deal-value-filter">
					<label class="control-label"><b>Value</b>
						<a data-toggle="collapse" href="#value_div" style="display:inline;position:absolute;right:5px;text-decoration:none;" class="changeIcon"><i class="icon-plus" /></a>
					</label>
					<div class="controls collapse" id="value_div">
							<select id="value_filter" name="value_filter" class="filter_type" data="expected_value" style="max-width:90px;">
								<option value="equals">Equals</option>
								<option value="between">Between</option>
							</select>
						<div class="equals">
							<input type="number" id="value" name="value"
								placeholder="Value" class="equals"/>
						</div>
						<div class="between hide">
							<input type="number" id="value_start" name="value_start"
								class="between hide" placeholder="Min Value"/> 
							<input type="number" id="value_end" name="value_end"
								placeholder="Max Value" class="between hide" />
						</div>
					</div>
				</div>
				<div class="control-group row-filter">
					<label class="control-label"><b>State </b>
						<a data-toggle="collapse" href="#archived_div" style="display:inline;position:absolute;right:5px;text-decoration:none;" class="changeIcon"><i class="icon-plus" /></a>
					</label>
					<div class="controls collapse" id="archived_div">
						<span><select id="archived" name="archived">
								<option value="true">Archived</option>
								<option value="false" selected>Active</option>
								<option value="all">All</option>
						</select></span>
					</div>
				</div>
				<!--<div class="control-group row-filter" id="deal-probability-filter">
					<label class="control-label"><b>Probability</b>
						<a data-toggle="collapse" href="#probability_div" style="display:inline;position:absolute;right:5px;text-decoration:none;" class="changeIcon"><i class="icon-plus" /></a>
					</label>
					<div id="probability_div" class="controls collapse">
						<select id="probability_filter" name="probability_filter" class="filter_type" data="probability" style="max-width:90px;">
								<option value="equals">Equals</option>
								<option value="between">Between</option>
						</select>
					<div class="equals" >
							<input type="text" id="probability" name="probability"
								placeholder="Probability %"/>
					</div>
					<div class="between hide" >
							<input type="text" id="probability_start" name="probability_start"
								placeholder="Min Probability %"/>
							<input type="text" id="probability_end" name="probability_end"
								placeholder="Max Probability %"/>
					</div>
					</div>
				</div>
				<div class="control-group row-filter" id="deal-closed-filter">
					<label class="control-label"><b>Deal Closed</b>
						<a data-toggle="collapse" href="#close_date_div" style="display:inline;position:absolute;right:5px;text-decoration:none;" class="changeIcon"><i class="icon-plus" /></a>
					</label>
					<div id="close_date_div" class="controls collapse">
						<select id="close_date_filter" name="close_date_filter" class="filter_type" data="close_date" style="max-width:90px;">
								<option value="equals">Equals</option>
								<option value="between">Between</option>
						</select>
					<div class="equals" >
							<input type="text" id="close_date" name="close_date"
								 placeholder="MM/DD/YYYY" class="date input" />
					</div>
					<div class="between hide" >
							<input type="text" id="close_date_start" name="close_date_start"
								placeholder="MM/DD/YYYY" class="date input" />
							<input type="text" id="close_date_end" name="colse_date_end"
								placeholder="MM/DD/YYYY" class="date input" />
					</div>
					</div>
				</div>
				<div class="control-group row-filter" id="deal-created-filter">
					<label class="control-label"><b>Deal Created</b>
						<a data-toggle="collapse" href="#created_time_div" style="display:inline;position:absolute;right:5px;text-decoration:none;" class="changeIcon"><i class="icon-plus" /></a>
					</label>
					<div id="created_time_div" class="controls collapse">
						<select id="created_time_filter" name="created_time_filter" class="filter_type" data="created_time" style="max-width:90px;">
								<option value="equals">Equals</option>
								<option value="between">Between</option>
						</select>
					<div class="equals" >
							<input type="text" id="created_time" name="created_time"
								placeholder="MM/DD/YYYY" class="date input" />
					</div>
					<div class="between hide" >
							<input type="text" id="created_time_start" name="created_time_start"
								placeholder="MM/DD/YYYY" class="date input" />
							<input type="text" id="created_time_end" name="created_time_end"
								placeholder="MM/DD/YYYY" class="date input" />
					</div>
					</div>
				</div> -->
			</fieldset>
		</form>
		<!-- form id="dealsCustomFilterForm" name="dealsCustomFilterForm" role="form">
			<fieldset></fieldset>
		</form -->
					</div>
					<!-- End of filters-container -->
				</div>
				<!-- popover-content -->
			</div>
		</div>
		<!-- dropdown-menu class div-->
	</div>
</script>

<script id="deal-custom-filter-template" type="text/html">
		{{#each this}}
			{{#if_equals field_type "TEXT"}}
			<div class="control-group row-filter">
				<label class="control-label"><b>{{field_label}}</b></label>
					<div class="controls" >
							<input type="text" id="{{replace_spaces field_label}}" name="{{replace_spaces field_label}}"/>
					</div>
			</div>
			{{/if_equals}}
			{{#if_equals field_type "TEXTAREA"}}
			<div class="control-group row-filter">
				<label class="control-label"><b>{{field_label}}</b></label>
					<div class="controls" >
							<textarea id="{{replace_spaces field_label}}" name="{{replace_spaces field_label}}"/>
					</div>
			</div>
			{{/if_equals}}
			{{#if_equals field_type "CHECKBOX"}}
			<div class="control-group row-filter">
				<label class="control-label"><input type="checkbox" id="{{replace_spaces field_label}}" name="{{replace_spaces field_label}}" style="margin-right:5px;"/><b>{{field_label}}</b></label>
			</div>
			{{/if_equals}}
			{{#if_equals field_type "LIST"}}
			<div class="control-group row-filter">
				<label class="control-label"><b>{{field_label}}</b></label>
					<div class="controls" >
							<select id="{{replace_spaces field_label}}" name="{{replace_spaces field_label}}">
								<option value="">Select..</option>
								{{{buildOptions field_data}}}
							</select>
					</div>
			</div>
			{{/if_equals}}
			{{#if_equals field_type "DATE"}}
			<div class="control-group row-filter" id="deal_{{replace_spaces field_label}}_filter">
				<label class="control-label"><b>{{field_label}}</b><select name="{{replace_spaces field_label}}_filter" class="filter_type" data={{field_label}} style="max-width: 90px;margin-left: 20px;">
								<option value="equals">Equals</option>
								<option value="between">Between</option>
						</select></label>
					<div class="controls equals" >
							<input type="text" id="{{replace_spaces field_label}}" name="{{replace_spaces field_label}}"
								 placeholder="MM/DD/YYYY" class="date input" />
					</div>
					<div class="controls between hide" >
							<input type="text" id="{{replace_spaces field_label}}_start" name="{{replace_spaces field_label}}_start"
								placeholder="MM/DD/YYYY" class="date input" /> to
							<input type="text" id="{{replace_spaces field_label}}_end" name="{{replace_spaces field_label}}_end"
								placeholder="MM/DD/YYYY" class="date input" />
					</div>
			</div>
			{{/if_equals}}
		{{/each}}
</script><div id="refundModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-header">
    <button class="close" data-dismiss="modal">x</button>
    <h3 id="myModalLabel">Refund</h3>
  </div>
 
    <div class="modal-body">
		<form id="CCform" class="form-horizontal card_details">
			<fieldset>

				
				<div class="control-group">
					<label class="control-label"><h3>Amount &nbsp; $</h3></label>
					<div class="controls">
						<div style="margin-top: 3px;"><input type="text" name="amount" id="amount" class="input required number" /></div>
						<div id="errormsg" style="color: red;"></div>
						<input type="hidden" name="hchargeid" id="hchargeid" class="hchargeid" />
						<input type="hidden" name="totamount" id="totamount" class="totamount" />
						
					</div>

				</div>
					
				
			</fieldset>
			
		</form>
		
	</div>
 
 
 
 
 
  <div class="modal-footer">
        <button class="btn btn-primary" data-loading-text="Refund" id="partialrefund">Refund</button>
  </div>
</div>
<div id="portletStreamModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="portletStreamModalLabel" aria-hidden="true" style="display: none;">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3 id="portletStreamModalLabel"><i class="icon-plus-sign"></i> Add Dashlet</h3>			
	</div>
	<div class="modal-body">
		<form id="portletStreamDetail" name="portletStreamDetail" class="form-horizontal">
			<fieldset>
				<div id="portletstreamDetails">
				
				</div>         					   			  
			</fieldset>
		</form>		   	
	</div>
</div><div id="portletsContactsFilterBasedSettingsModal" class="modal hide fade">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>Dashlet Settings</h3>
	</div>
	<div class="modal-body">
		<input type="hidden" id="portlet-type" />
		<input type="hidden" id="portlet-name" />
		<form id="portletsContactsFilterBasedSettingsForm" name="portletsContactsFilterBasedSettingsForm" method="post" >
			<div class="control-group">
				<label class="control-label">Filter</label>
				<div class="controls" id="filterControls">
					<select id="filter" name="filter" class="required">
						
					</select>
					<img class="loading-img" src="img/21-0.gif"></img>
				</div>
			</div>
		</form>
	</div>
	<div class="modal-footer">
		<a id="save-modal" class="portlet-settings-save-modal save-modal btn btn-primary" href="#">Save</a>
		<!--  <a id="cancel-modal" href="#portlets" class="btn" data-dismiss="modal" onclick="hidePortletSettings(this);">Cancel</a>  -->
	</div>
</div>

<div id="portletsContactsEmailsOpenedSettingsModal" class="modal hide fade">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>Dashlet Settings</h3>
	</div>
	<div class="modal-body">
		<input type="hidden" id="portlet-type" />
		<input type="hidden" id="portlet-name" />
		<form id="portletsContactsEmailsOpenedSettingsForm" name="portletsContactsEmailsOpenedSettingsForm" method="post" >
			<div class="control-group">
				<label class="control-label">Duration</label>
				<div class="controls">
					<select id="duration" name="duration" class="required">
						<option value="1-day" >Today</option>
						<option value="yesterday" >Yesterday</option>
						<option value="2-days">Last 2 Days</option>
						<option value="this-week" >This Week</option>
						<option value="1-week">Last 7 Days</option>
						<option value="this-month" >This Month</option>
						<option value="1-month">Last 30 Days</option>
					</select>
				</div>
			</div>
		</form>
	</div>
	<div class="modal-footer">
		<a id="save-modal" class="portlet-settings-save-modal save-modal btn btn-primary" href="#">Save</a>
		<!--  <a id="cancel-modal" href="#portlets" class="btn" data-dismiss="modal" onclick="hidePortletSettings(this);">Cancel</a>  -->
	</div>
</div>

<div id="portletsContactsEmailsSentSettingsModal" class="modal hide fade">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>Dashlet Settings</h3>
	</div>
	<div class="modal-body">
		<input type="hidden" id="portlet-type" />
		<input type="hidden" id="portlet-name" />
		<form id="portletsContactsEmailsSentSettingsForm" name="portletsContactsEmailsSentSettingsForm" method="post" >
			<div class="control-group">
				<label class="control-label">Duration</label>
				<div class="controls">
					<select id="duration" name="duration" class="required">
						<option value="1-day" >Today</option>
						<option value="yesterday" >Yesterday</option>
						<option value="this-week" >This Week</option>
						<option value="2-days">Last 2 Days</option>
						<option value="1-week">Last 7 Days</option>
						<option value="this-month" >This Month</option>
						<option value="1-month">Last 30 Days</option>
					</select>
				</div>
			</div>
		</form>
	</div>
	<div class="modal-footer">
		<a id="save-modal" class="portlet-settings-save-modal save-modal btn btn-primary" href="#">Save</a>
		<!--  <a id="cancel-modal" href="#portlets" class="btn" data-dismiss="modal" onclick="hidePortletSettings(this);">Cancel</a>  -->
	</div>
</div>

<div id="portletsContactsGrowthGraphSettingsModal" class="modal hide fade">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>Dashlet Settings</h3>
	</div>
	<div class="modal-body">
		<input type="hidden" id="portlet-type" />
		<input type="hidden" id="portlet-name" />
		<form id="portletsContactsGrowthGraphSettingsForm" name="portletsContactsGrowthGraphSettingsForm" method="post" >
			<div class="control-group">
				<label class="control-label">Tags <span class="field_req">*</span></label>
				<div class="controls">
					<div class="pull-left" id="portlet-tags">
						<ul id="portlet-ul-tags" name="tags" class= "tagsinput tags"></ul>
					</div>
					<input name="tags" type="text" id="addPortletBulkTags" class="tags-typeahead multi-tags" placeholder="Enter tags separated by comma" onkeyup="hidePortletErrors(this);" />      
				</div>
			</div>
			<div class="control-group">
				<label class="control-label">Frequency</label>
				<div class="controls">
					<select name="frequency" id="frequency" class="required" style="width:100px">
						<option value="daily">Daily</option>
						<option value="weekly">Weekly</option>
						<option value="monthly">Monthly</option>
					</select>
				</div>
			</div>
			<!-- <div class="control-group">
				<label class="control-label">Duration</label>
				<div style="padding:4px 8px;box-shadow: 0 0px 2px rgba(0, 0, 0, .25), inset 0 -1px 0 rgba(0, 0, 0, .1);" class="pull-left" id="portlet-reportrange">
					<i class="icon-calendar icon-large"></i>
					<span id="range"></span>
					<input type="hidden" id="start-date" name="start-date" />
					<input type="hidden" id="end-date" name="end-date" />
				</div>
			</div>  -->
			<div class="control-group">
				<label class="control-label">Duration</label>
				<div class="controls">
					<select id="duration" name="duration" class="required">
						<!-- <option value="today" >Today</option>
						<option value="yesterday">Yesterday</option> -->
						<option value="1-week">Last 7 Days</option>
						<option value="1-month">Last 30 Days</option>
					</select>
				</div>
			</div>
		</form>
	</div>
	<div class="modal-footer">
		<a id="save-modal" class="portlet-settings-save-modal save-modal btn btn-primary" href="#">Save</a>
		<!--  <a id="cancel-modal" href="#portlets" class="btn" data-dismiss="modal" onclick="hidePortletSettings(this);">Cancel</a>  -->
	</div>
</div>

<div id="portletsPendingDealsSettingsModal" class="modal hide fade">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>Dashlet Settings</h3>
	</div>
	<div class="modal-body">
		<input type="hidden" id="portlet-type" />
		<input type="hidden" id="portlet-name" />
		<form id="portletsPendingDealsSettingsForm" name="portletsPendingDealsSettingsForm" method="post" >
			<!-- <input type="text" class="hidden pull-right" /> -->
			<div class="control-group">
				<label class="control-label">Deals</label>
				<div class="controls">
					<select id="deals" name="deals" class="required">
						<option value="all-deals">All Deals</option>
						<option value="my-deals">My Deals</option>
					</select>
				</div>
			</div>
		</form>
	</div>
	<div class="modal-footer">
		<a id="save-modal" class="portlet-settings-save-modal save-modal btn btn-primary" href="#">Save</a>
		<!--  <a id="cancel-modal" href="#portlets" class="btn" data-dismiss="modal" onclick="hidePortletSettings(this);">Cancel</a>  -->
	</div>
</div>

<div id="portletsDealsByMilestoneSettingsModal" class="modal hide fade">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>Dashlet Settings</h3>
	</div>
	<div class="modal-body">
		<input type="hidden" id="portlet-type" />
		<input type="hidden" id="portlet-name" />
		<form id="portletsDealsByMilestoneSettingsForm" name="portletsDealsByMilestoneSettingsForm" method="post" >
			<!-- <input type="text" class="hidden pull-right" /> -->
			<div class="control-group" id="portletsDealsByMilestoneTrack" style="display:none;">
				<label class="control-label">Track</label>
				<div class="controls">
					<select id="track" name="track" class="required">
						
					</select>
					<img class="loading-img" src="img/21-0.gif"></img>
				</div>
			</div>
			<div class="control-group">
				<label class="control-label">Deals</label>
				<div class="controls">
					<select id="deals" name="deals" class="required">
						<option value="all-deals">All Deals</option>
						<option value="my-deals">My Deals</option>
					</select>
				</div>
			</div>
			<!-- <div class="control-group">
				<label class="control-label">Due Date</label>
				<div class="controls">
                    <span><input id="due-date" type="text" name="due-date" class="required date" placeholder="MM/DD/YYYY" /></span>
                </div>
			</div> -->
		</form>
	</div>
	<div class="modal-footer">
		<a id="save-modal" class="portlet-settings-save-modal save-modal btn btn-primary" href="#">Save</a>
		<!--  <a id="cancel-modal" href="#portlets" class="btn" data-dismiss="modal" onclick="hidePortletSettings(this);">Cancel</a>  -->
	</div>
</div>

<div id="portletsDealsClosuresPerPersonSettingsModal" class="modal hide fade">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>Dashlet Settings</h3>
	</div>
	<div class="modal-body">
		<input type="hidden" id="portlet-type" />
		<input type="hidden" id="portlet-name" />
		<form id="portletsDealsClosuresPerPersonSettingsForm" name="portletsDealsClosuresPerPersonSettingsForm" method="post" >
			<input type="text" class="hidden pull-right" />
			<div class="control-group">
				<label class="control-label">Group by</label>
				<div class="controls">
					<select id="group-by" name="group-by" class="required">
						<option value="number-of-deals">No. of Deals</option>
						<option value="deal-value">Deal Value</option>
					</select>
				</div>
			</div>
			<div class="control-group">
				<label class="control-label">Due Date</label>
				<div class="controls">
                    <span><input id="due-date" type="text" name="due-date" class="required date" placeholder="MM/DD/YYYY" /></span>
                </div>
			</div>
		</form>
	</div>
	<div class="modal-footer">
		<a id="save-modal" class="portlet-settings-save-modal save-modal btn btn-primary" href="#">Save</a>
		<!--  <a id="cancel-modal" href="#portlets" class="btn" data-dismiss="modal" onclick="hidePortletSettings(this);">Cancel</a>  -->
	</div>
</div>

<div id="portletsDealsWonSettingsModal" class="modal hide fade">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>Dashlet Settings</h3>
	</div>
	<div class="modal-body">
		<input type="hidden" id="portlet-type" />
		<input type="hidden" id="portlet-name" />
		<form id="portletsDealsWonSettingsForm" name="portletsDealsWonSettingsForm" method="post" >
			<div class="control-group">
				<label class="control-label">Duration</label>
				<div class="controls">
					<select id="duration" name="duration" class="required">
						<option value="1-day" >Today</option>
						<option value="yesterday" >Yesterday</option>
						<option value="this-week" >This Week</option>
						<option value="1-week">Last 7 Days</option>
						<option value="this-month" >This Month</option>
						<option value="1-month">Last 30 Days</option>
						<!-- <option value="3-months">3 Months</option>
						<option value="6-months">6 Months</option>
						<option value="12-months">12 Months</option> -->
					</select>
				</div>
			</div>
		</form>
	</div>
	<div class="modal-footer">
		<a id="save-modal" class="portlet-settings-save-modal save-modal btn btn-primary" href="#">Save</a>
		<!--  <a id="cancel-modal" href="#portlets" class="btn" data-dismiss="modal" onclick="hidePortletSettings(this);">Cancel</a>  -->
	</div>
</div>

<div id="portletsDealsFunnelSettingsModal" class="modal hide fade">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>Dashlet Settings</h3>
	</div>
	<div class="modal-body">
		<input type="hidden" id="portlet-type" />
		<input type="hidden" id="portlet-name" />
		<form id="portletsDealsFunnelSettingsForm" name="portletsDealsFunnelSettingsForm" method="post" >
			<!-- <input type="text" class="hidden pull-right" /> -->
			<div class="control-group" id="portletsDealsFunnelTrack" style="display:none;">
				<label class="control-label">Track</label>
				<div class="controls">
					<select id="track" name="track" class="required">
						
					</select>
					<img class="loading-img" src="img/21-0.gif"></img>
				</div>
			</div>
			<div class="control-group">
				<label class="control-label">Deals</label>
				<div class="controls">
					<select id="deals" name="deals" class="required">
						<option value="all-deals">All Deals</option>
						<option value="my-deals">My Deals</option>
					</select>
				</div>
			</div>
			<!-- <div class="control-group">
				<label class="control-label">Due Date</label>
				<div class="controls">
                    <span><input id="due-date" type="text" name="due-date" class="required date" placeholder="MM/DD/YYYY" /></span>
                </div>
			</div> -->
		</form>
	</div>
	<div class="modal-footer">
		<a id="save-modal" class="portlet-settings-save-modal save-modal btn btn-primary" href="#">Save</a>
		<!--  <a id="cancel-modal" href="#portlets" class="btn" data-dismiss="modal" onclick="hidePortletSettings(this);">Cancel</a>  -->
	</div>
</div>

<div id="portletsDealsAssignedSettingsModal" class="modal hide fade">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>Dashlet Settings</h3>
	</div>
	<div class="modal-body">
		<input type="hidden" id="portlet-type" />
		<input type="hidden" id="portlet-name" />
		<form id="portletsDealsAssignedSettingsForm" name="portletsDealsAssignedSettingsForm" method="post" >
			<div class="control-group">
				<label class="control-label">Duration</label>
				<div class="controls">
					<select id="duration" name="duration" class="required">
						<option value="1-day" >Today</option>
						<option value="yesterday" >Yesterday</option>
						<option value="this-week" >This Week</option>
						<option value="1-week">Last 7 Days</option>
						<option value="this-month" >This Month</option>
						<option value="1-month">Last 30 Days</option>
					</select>
				</div>
			</div>
		</form>
	</div>
	<div class="modal-footer">
		<a id="save-modal" class="portlet-settings-save-modal save-modal btn btn-primary" href="#">Save</a>
		<!--  <a id="cancel-modal" href="#portlets" class="btn" data-dismiss="modal" onclick="hidePortletSettings(this);">Cancel</a>  -->
	</div>
</div>

<div id="portletsCallsPerPersonSettingsModal" class="modal hide fade">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>Dashlet Settings</h3>
	</div>
	<div class="modal-body">
		<input type="hidden" id="portlet-type" />
		<input type="hidden" id="portlet-name" />
		<form id="portletsCallsPerPersonSettingsForm" name="portletsCallsPerPersonSettingsForm" method="post" >
			<div class="control-group">
				<label class="control-label">Duration</label>
				<div class="controls">
					<select id="duration" name="duration" class="required">
						<option value="1-day" >Today</option>
						<option value="yesterday" >Yesterday</option>
						<option value="this-week" >This Week</option>
						<option value="1-week">Last 7 Days</option>
						<option value="this-month" >This Month</option>
						<option value="1-month">Last 30 Days</option>
					</select>
				</div>
			</div>
			<div class="control-group">
				<label class="control-label">Graph on</label>
				<div class="controls">
					<select id="group-by" name="group-by" class="required">
						<option value="number-of-calls" >No. of calls</option>
						<option value="call-duration">Call duration</option>
					</select>
				</div>
			</div>
		</form>
	</div>
	<div class="modal-footer">
		<a id="save-modal" class="portlet-settings-save-modal save-modal btn btn-primary" href="#">Save</a>
		<!--  <a id="cancel-modal" href="#portlets" class="btn" data-dismiss="modal" onclick="hidePortletSettings(this);">Cancel</a>  -->
	</div>
</div>

<div id="portletsTaskReportSettingsModal" class="modal hide fade">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>Dashlet Settings</h3>
	</div>
	<div class="modal-body">
		<input type="hidden" id="portlet-type" />
		<input type="hidden" id="portlet-name" />
		<form id="portletsTaskReportSettingsForm" name="portletsTaskReportSettingsForm" method="post" >
			<div class="control-group">
				<label class="control-label">Group by</label>
				<div class="controls">
					<select id="group-by-task-report" name="group-by" class="required">
						<option value="user">User</option>
						<option value="category">Category</option>
						<option value="status">Status</option>
					</select>
				</div>
			</div>
			<div class="control-group">
				<label class="control-label">Split by</label>
				<div class="controls">
					<select id="split-by-task-report" name="split-by" class="required">
						<option value="user" id="user">User</option>
						<option value="category" id="category">Category</option>
						<option value="status" id="status">Status</option>
					</select>
				</div>
			</div>
			<div class="control-group">
				<label class="control-label">Duration</label>
				<div class="controls">
					<select id="duration" name="duration" class="required">
						<option value="1-day" >Today</option>
						<option value="yesterday" >Yesterday</option>
						<option value="this-week" >This Week</option>
						<option value="1-week">Last 7 Days</option>
						<option value="this-month" >This Month</option>
						<option value="1-month">Last 30 Days</option>
					</select>
				</div>
			</div>
		</form>
	</div>
	<div class="modal-footer">
		<a id="save-modal" class="portlet-settings-save-modal save-modal btn btn-primary" href="#">Save</a>
		<!--  <a id="cancel-modal" href="#portlets" class="btn" data-dismiss="modal" onclick="hidePortletSettings(this);">Cancel</a>  -->
	</div>
</div>

<div id="portletDeleteModal" class="modal hide fade">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>Delete Dashlet</h3>
	</div>
	<div class="modal-body">
		Delete this dashlet?
	</div>
	<div class="modal-footer">
		<a id="" class="portlet-delete-modal save-modal btn btn-primary" href="#">Yes</a>
		<a id="portlet-delete-cancel-modal" href="#" class="btn" data-dismiss="modal">No</a>
	</div>
</div><script id="recent-menu-model-template" type="text/html">
<a data-id="{{id}}" style="cursor: pointer; ">

{{#if_equals entity_type "contact_entity"}}
    	<div style="display:inline;padding-right:5px;height:auto;">
        	{{#if_contact_type "PERSON"}}
        		<img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" width="40px" height="40px" style="display:inline; width:40px; height:40px; " />
        	{{/if_contact_type}}
        
			{{#if_contact_type "COMPANY"}}
        		<img class="thumbnail" {{getCompanyImage "40" "display:inline;"}} />
        	{{/if_contact_type}}
    	</div>
    	<div style="height:4em;display:inline-block;vertical-align:middle;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:80%;margin-left:5px">
        	{{#if_contact_type "PERSON"}}
        		<b>	{{getPropertyValue properties "first_name"}}
        		{{getPropertyValue properties "last_name"}} </b>
        		<br />
        		{{getPropertyValue properties "email"}}
				<br/>
				{{getPropertyValue properties "company"}}
        	{{/if_contact_type}}
        
			{{#if_contact_type "COMPANY"}}
        		<b>{{getPropertyValue properties "name"}}</b></br>
        		{{getPropertyValue properties "url"}}
        	{{/if_contact_type}}
		</div>
{{/if_equals}}

{{#if_equals entity_type "case"}}
	<div style="display: inline;margin-top:10px; height: auto;">
		<!--<i class="icon-folder-close icon-3x" id="minus" style="cursor: pointer; position:relative; top:10px;"></i> -->
		<i class="icon-folder-close icon-3x thumbnail" id="minus" style="cursor: pointer; width:40px; height:40px; "></i>
	</div>
	<div style="height:4em;display:inline-block;vertical-align:middle;text-transform:capitalize;;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:80%;margin-left:5px">
		<b>{{title}}</b><br /> {{description}}
	</div>
{{/if_equals}}

{{#if_equals entity_type "deal"}}
	<div style="display: inline;margin-top:10px; height: auto;">
		<!-- <i class="icon-money icon-3x" id="minus" style="cursor: pointer; position:relative; top:10px;"></i> -->
		<i class="icon-money thumbnail" id="minus" style="cursor: pointer; width:40px; height:38px; padding-top:6px; font-size:2.75em;"></i>
	</div>
	<div style="height:4em;display:inline-block;vertical-align:middle;text-transform:capitalize;;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:80%;margin-left:5px">
		 <b>{{name}}</b><br /> {{description}}
	</div>
{{/if_equals}}

{{#if_equals entity_type "document"}}
<div style="display: inline;margin-top:10px; height: auto;">
		<!-- <i class="icon-file-text icon-3x" id="minus" style="cursor: pointer; position:relative; top:10px;"></i> -->
		<i class="icon-file-text thumbnail" id="minus" style="cursor: pointer; width:40px; height:38px; padding-top:6px; font-size:2.75em;"></i>
	</div>
	<div style="height:4em;display:inline-block;vertical-align:middle;text-transform:capitalize;;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:80%;margin-left:5px">
		 <b>{{name}}</b><br /> {{description}}
	</div>
{{else}}
{{#if network_type}}
<div style="display: inline;margin-top:10px; height: auto;">
		<!-- <i class="fa-file-text icon-3x" id="minus" style="cursor: pointer; position:relative; top:10px;"></i> -->
		<i class="icon-file-text thumbnail" id="minus" style="cursor: pointer; width:40px; height:38px; padding-top:6px; font-size:2.75em;"></i>
	</div>
	<div style="height:4em;display:inline-block;vertical-align:middle;text-transform:capitalize;;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:80%;margin-left:5px">
		 <b>{{name}}</b><br /> 
	</div>
{{/if}}
{{/if_equals}}

</a>
</script>

<script id="recent-menu-collection-template" type="text/html">
	<ul class="dropdown-menu" style="width:25em; right:-11px;" id="recent-menu-model-list">
		<li><a class="disabled" style="color:black;"><b>Recently Viewed ({{this.length}})</b></a></li><li class="divider"></li>
	</ul>
</script>
<script id="referrals-model-template" type="text/html">
<td style="width:13%"><img class="thumbnail" src="https://secure.gravatar.com/avatar/d41d8cd98f00b204e9800998ecf8427e.jpg?s=50&amp;d=https%3A//dpm72z3r2fvl4.cloudfront.net/css/images/user-default.png" width="40px" height="40px" title="{{name}}"></td>
<td><span><b>{{name}}</b></span><br><span>{{email}}</span><br></td>
</script>
<script id="referrals-collection-template" type="text/html">
{{#unless this.length}}
<div class="row">
	<div class="span12">
		<div class="page-header">
			<h1>Referral Program</h1>
			
		</div>
	</div>
</div>
<div class="row">
<div class="span10">
<div class="slate">
<div class="slate-content">
       <div class="box-left">
 	           			<img alt="Clipboard" src="/img/clipboard.png">
					</div>
		<div class="box-right">
			<h3> 
				You have not referred Agile CRM yet to any one
			</h3>
			<div>
				Place this link on your website, in your email newsletter, or give it to someone when you refer them to AgileCRM .
			</div>	
           <div class="prettyprint" style="margin-top:5px">
					<span id="referral_url" style="font-size: 15px; display: inline-block ! important; margin-right: 50px; color: rgb(101, 101, 101);">http://www.agilecrm.com/?utm_source=affiliates&utm_medium=web&utm_campaign={{get_current_domain}}</span>
						<a  id="url_clip_button" style="text-decoration: none;float:right;" data-clipboard-text="http://www.agilecrm.com/?utm_source=affiliates&utm_medium=web&utm_campaign={{get_current_domain}}">
							<i style="font-size: 24px; font-weight: bold; padding-top: 2px; padding-right: 3px;" class="icon-copy copy_email_clipboard_icon" title=""></i> Copy</a>
				</div>



</div>
</div>
</div>
</div>
</div>
        {{/unless}}
{{#if this.length}}

<div class="row">
	<div class="span12">
		<div class="page-header">
			<h1>Referral Program</h1>
			
		</div>
		</div>
		</div>
		
		<div class="row">
<div class="span8">
<h3> Referral Link</h3>
		<div  style="padding-top: 10px; padding-bottom: 5px;">
				Place this link on your website, in your email newsletter, or give it to someone when you refer them to AgileCRM .
			</div>
			<div style="margin-bottom: 20px;" class="data">
			<div class="data-container">
				<div style="padding: 10px;border-radius:5px;border: 1px solid whitesmoke;display: inline-block;">
					<span style="font-size: 15px; display: inline-block ! important; margin-right: 50px; color: rgb(101, 101, 101);" id="referral_url">http://www.agilecrm.com/?utm_source=affiliates&utm_medium=web&utm_campaign={{get_current_domain}} </span>
					<a href="javascript:;" id="url_clip_button" style="text-decoration: none;" data-clipboard-text="http://www.agilecrm.com/?utm_source=affiliates&utm_medium=web&utm_campaign={{get_current_domain}}">
							<i style="font-size: 24px; font-weight: bold; padding-top: 2px; padding-right: 3px;" class="icon-copy copy_email_clipboard_icon" title=""></i> Copy</a>	
				</div>
            </div>
		</div>
			
			
				
           </div>
    
    

				<div id="your_referrals" class="span4" >
						
							<div class="page-header" style="margin: 0px; padding-bottom: 8px;">
								<h2 style="font-size: 20px;">Your Referrals till date {{count}}</h2>
							</div>
							<div class="data">
								<div class="data-container">
									<table id="referrals" class="table">
										<tbody id="referrals-model-list" class="referrals-model-list"
											style="overflow: scroll; cursor: pointer;">
										</tbody>
									</table>
								</div>
							</div>
					
					
					
				</div>
			</div>
{{/if}}	
</script>
<script id="search-model-template" type="text/html">	
	<td></td>
	<td class="data" data="{{id}}" style="white-space: nowrap;">
    	<div style="display: inline; padding-right: 10px; height: auto;">
        	{{#if_contact_type "PERSON"}} <img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" width="40px" height="40px" style="display: inline; width:40px; height:40px; " /> {{/if_contact_type}}
        	{{#if_contact_type "COMPANY"}} <img class="thumbnail" {{getCompanyImage "40" "display:inline;"}} /> {{/if_contact_type}}
    	</div>
    	<div style="height: auto; display: inline-block; vertical-align: top; text-overflow: ellipsis; width: 14em; overflow: hidden;">
        	{{#if_contact_type "PERSON"}} <b> {{getPropertyValue properties
        	"first_name"}} {{getPropertyValue properties "last_name"}} </b> <br />
        	{{getPropertyValue properties "email"}} {{/if_contact_type}}
        	{{#if_contact_type "COMPANY"}} <b>{{getPropertyValue properties
        	"name"}}</b></br> {{getPropertyValue properties "url"}} {{/if_contact_type}}
    	</div>
	</td>
	<td><div style="display:inline-block;vertical-align:top;">
		{{getPropertyValue properties "title"}}<br />
    	{{getPropertyValue properties "company"}}</div>
	</td>
	<td>
		<div class="ellipsis-multiline" style="line-height:20px !important; word-break:keep-all;">
			{{#each tags}}
				<span class="label">{{this}}</span>
			{{/each}}
		</div>
	</td>
	<td style="width:6em;">{{lead_score}}</td>
</script>

<script id="search-collection-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            
            <h1 id="search-query-heading">Search results for "{{query}}"</h1>
            
            <div class="btn-group right" id="view-list" style="top:-29px;position:relative">
            </div>
            <div class="btn-group right" id="filter-list" style="top:-29px;position:relative;margin-right:5px">
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="span9">
        {{#if this.length}}
        <div class="data">
            <div class="data-container">
                <div class="btn-group right" id="bulk-actions" style="position: relative; display: none">
                    <button class="btn">Bulk Actions</button>
                    <button class="btn dropdown-toggle" data-toggle="dropdown" id="view-actions">
                    <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu" id="view-actions">
                        <li><a href="#" id="bulk-owner">Change owner</a></li>
						{{#hasMenuScope 'CAMPAIGN'}}
                        <li><a href="#" id="bulk-campaigns">Add to campaign</a></li>
						{{/hasMenuScope}}
                        <li class="hide"><a href="#" id="bulk-email">Send email</a></li>
                        <li><a href="#" id="bulk-tags">Add tags</a></li>
                    </ul>
                </div>
                <table id="contacts_search" class="table table-striped agile-ellipsis-dynamic onlySorting" url="core/api/bulk/update?action_type=DELETE" style="overflow: scroll">
                    <colgroup><col width="10px"><col width="40%"><col width="20%"><col width="25%"><col width="12%"></colgroup>
					<thead>
                        <tr>
							<th></th>
                            <th>Name</th>
                            <th>Work</th>
                            <th>Tags</th>
                            <th>Lead Score</th>
                        </tr>
                    </thead>
                    <tbody id="search-model-list" class="model-list-cursor" route="contact/" style="overflow: scroll;">
                    </tbody>
                </table>
            </div>
        </div>
        {{/if}}
    </div>
    <div class="span3">
    </div>
</div>
</script><script id="forms-collection-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1>Forms</h1>
			<a href="formbuilder" class="btn right" style="top:-28px;position:relative"><span><i class="icon-plus-sign" /></span> Add Form</a>
        </div>
    </div>
</div>
<div class="row">
 <div class="span9">
	{{#unless this.length}}
	<div style="height: 245px;">
	<div class="slate">
		<div class="slate-content">
			<div class="box-left">
				<img alt="Clipboard" src="/img/clipboard.png" />
			</div>
			<div class="box-right">
				<h3>You do not have any Forms saved.</h3>
				<a href="formbuilder" class="btn blue btn-slate-action"><i class="icon-plus-sign"></i> Add Form</a>
			</div>
		</div>
	</div>
	</div>
	{{/unless}}
	{{#if this.length}}
	<div class="data-block">
		<div class="data-container">
			<table class="table table-bordered table-striped showCheckboxes agile-ellipsis-dynamic" url="core/api/forms/bulk" style="cursor:pointer;">
				<colgroup><col width="50px"><col width="50%"><col width="50%"></colgroup>
				<thead>
					<tr>
						<th>Form Title</th>
						<th>Last Modified</th>
					</tr>
				</thead>
				<tbody id="forms-model-list">
				</tbody>
			</table>
		</div>
	</div>
	{{/if}}
 </div>

<div class="span3">
        <div class="well">
            <h3>
                What are Forms?
            </h3>
            <br>
			<p>
				Forms created using the <a href="formbuilder">Form Builder</a> can be placed on your website or app. These Forms are readily linked to your Agile account. When a visitor fills the form, a Contact is created and subsequent web activity is logged automatically.
			</p>
    </div>
</div>
</script>

<script id="forms-model-template" type="text/html">
	<td><a href="formbuilder?form={{id}}"><span style="display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:100%;">{{formName}}</span></a></td>
    <td>
		<a href="formbuilder?form={{id}}">
			<span style="display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:100%;">
				<small class="edit-hover">
					<time class="form-modified-time" datetime="{{epochToHumanDate "" updated_time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" updated_time}}</time>
				</small>
			</span>
		</a>
	</td>
	</br>
</script><script id="share-by-email-template" type="text/html">
	<div id="share-by-email" class="modal hide fade">
		<div class="modal-header">
            <button class="close" data-dismiss="modal">x</button>
			<h3>Thanks for sharing. We sure appreciate it!</h3>
		</div>
		<div class="modal-body">
		<form id='sharemailForm' name="sharemailForm" class="form-horizontal">
			<fieldset>
				<input type="hidden" name="from" value="{{email}}"/>
				<div class="control-group">
					<label class="control-label">To<span
						class="field_req">*</span></label>
					<div class="controls ">
						<input type="text" class="required input-xlarge" name="to"
							id="to" placeholder="Enter Your Friend's Email Address" value=""/>
					</div>
				</div>
				<div class="control-group">
					<label class="control-label">Subject <span
						class="field_req">*</span></label>
					<div class="controls">
						<input type="text" class="required input-xlarge" name="subject"
							id="subject" placeholder="About" value="I love AgileCRM - I want you to try it"/>
					</div>
				</div>
				<div class="control-group">
					<label class="control-label">Message <span
						class="field_req">*</span></label>
					<div class="controls">
						<textarea class="required input-xlarge" rows="14" name="body" id="body" placeholder="Description">Hi,<br/><br/>I am using Agile CRM - it allows me to easily manage my contacts, track clicks, setup email and twitter campaigns, configure contact-level analytics, call and even receive notifications when a star contact is online.<br/><br/>I thought you would love as much as I do.<br/><br/>You can visit https://www.agilecrm.com/?utm_source=affiliates&utm_medium=web&utm_campaign={{get_current_domain}} to learn more.<br/><br/>- {{#getCurrentUserPrefs}}{{currentDomainUserName}}{{/getCurrentUserPrefs}}.</textarea>
					</div>
				</div>
			</fieldset>
		</form>
        </div>
		<div class="modal-footer">
            <a href="#" id="shareMail" class="save btn btn-primary">Send</a>
			<a href="#" data-dismiss="modal" class="btn">Close</a>&nbsp;&nbsp;<span id="msg"></span>
		</div>
</div>
</script>
<script id="share-ical-by-email-template" type="text/html">
	<div id="share-ical-by-email" class="modal hide fade">
		<div class="modal-header">
            <button class="close" data-dismiss="modal">x</button>
			<h3><i class="icon-envelope-alt"></i> Mail your Calendar Feed URL</h3>
		</div>
		<div class="modal-body">
		<form id='shareIcalMailForm' name="shareIcalMailForm" class="form-horizontal">
			<fieldset>
				<input type="hidden" name="from" value="{{email}}"/>
				<div class="control-group">
					<label class="control-label">To<span
						class="field_req">*</span></label>
					<div class="controls ">
						<input type="text" class="email required input-xlarge" name="to"
							id="to" placeholder="Enter Email Address" value="{{email}}"/>
					</div>
				</div>
				<div class="control-group">
					<label class="control-label">Subject <span
						class="field_req">*</span></label>
					<div class="controls">
						<input type="text" class="required input-xlarge" name="subject"
							id="subject" placeholder="About" value="AgileCRM Calendar Feed URL"/>
					</div>
				</div>
				<div class="control-group">
					<label class="control-label">Message <span
						class="field_req">*</span></label>
					<div class="controls">
						<textarea class="required input-xlarge" rows="14" name="body" id="body" placeholder="Description">Sync your AgileCRM Calendar with Apple iCal, Google Calendar, Microsoft Outlook 2007 (or later) or another application that supports iCalendar format using the url below. <br/><br/>{{ical_url}}</textarea>
					</div>
				</div>
			</fieldset>
		</form>
        </div>
		<div class="modal-footer">
            <a href="#" id="shareIcalMail" class="save btn btn-primary">Send</a>
			<a href="#" data-dismiss="modal" class="btn">Close</a>&nbsp;&nbsp;<span id="msg"></span>
		</div>
</div>
</script><script id="share-schedule-url-by-email-template" type="text/html">
	<div id="share-schedule-url-by-email" class="modal hide fade">
		<div class="modal-header">
            <button class="close" data-dismiss="modal">x</button>
			<h3><i class="icon-envelope-alt"></i> Mail your online schedule URL</h3>
		</div>
		<div class="modal-body">
		<form id='sharescheduleurlmailForm' name="sharescheduleurlmailForm" class="form-horizontal">
			<fieldset>
				<input type="hidden" name="from" value="{{email}}"/>
				<div class="control-group">
					<label class="control-label">To<span
						class="field_req">*</span></label>
					<div class="controls ">
						<input type="text" class="required input-xlarge" name="to"
							id="to" placeholder="Enter Email Address" value=""/>
					</div>
				</div>
				<div class="control-group">
					<label class="control-label">Subject <span
						class="field_req">*</span></label>
					<div class="controls">
						<input type="text" class="required input-xlarge" name="subject"
							id="subject" placeholder="About" value="Online Schedule URL"/>
					</div>
				</div>
				<div class="control-group">
					<label class="control-label">Message <span
						class="field_req">*</span></label>
					<div class="controls">
						<textarea class="required input-xlarge" rows="14" name="body" id="body" placeholder="Description">Hi,<br/><br/>I am using Agile CRM - it allows me to easily manage my contacts, track clicks, setup email and twitter campaigns, configure contact-level analytics, call and even receive notifications when a star contact is online.<br/><br/>I thought you would love as much as I do.<br/><br/>You can visit https://www.agilecrm.com/?utm_source=affiliates&utm_medium=web&utm_campaign={{get_current_domain}} to learn more.<br/><br/>- {{#getCurrentUserPrefs}}{{currentDomainUserName}}{{/getCurrentUserPrefs}}.</textarea>
					</div>
				</div>
			</fieldset>
		</form>
        </div>
		<div class="modal-footer">
            <a href="#" id="share-url-email" class="save btn btn-primary">Send</a>
			<a href="#" data-dismiss="modal" class="btn">Close</a>&nbsp;&nbsp;<span id="msg"></span>
		</div>
</div>
</script>
<script id="shopifyboxes-template" type="text/html">
<div class="span12">
        <div class="page-header">
<h2><span>Engage Customers</span></h2>           
        </div>

<div id="general" class="row-fluid">

<!--  Show Popups -->
<div class="span4">
    <div class="well" style="width:220px; height:200px; text-align: center;">
        <!-- Icon and Title -->
        <div>
            <div style="padding:20px 70px 10px;">
                <i class="icon-comment-alt icon-4x"></i>
            </div>
            <b> Web Engagement</b>
        </div>
        <br />
        <!-- Description -->
        <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;margin-bottom: 20px;"  rel="tooltip" title="{{description}}">
           Combat exit intent with Agile CRM's smart pop-ups. Offer discount coupons and show visitors related products.
        </div>
        <!-- Add button -->
        <div style="/*margin: 40px auto;	width: 50%;*/">
            <a class="btn btn-primary" href="#web-rules">Create a Popup</a>
        </div>
    </div>
</div>


<!-- Email Engagement -->

<div class="span4">
    <div class="well" style="width:220px; height:200px; text-align: center;">
        <!-- Icon and Title -->
        <div>
            <div style="padding:20px 70px 10px;">
                <i class="icon-envelope icon-4x"></i>
            </div>
            <b>Email Engagement</b>
        </div>
        <br />
        <!-- Description -->
        <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;height: 55px !important;margin-bottom: 20px;"  rel="tooltip" title="{{description}}">
          Send automated emails reminding your customers to finish their purchases. Send personalized promotional offers.
        </div>
        <!-- Add button -->
        <div style="/*margin: 40px auto;	width: 50%;*/">
            <a class="btn btn-primary" href="#workflows">Run a Campaign</a>
        </div>
    </div>
</div>


<!-- Sync Customer Data -->
<!--<div class="span4" style="margin-left: 0px;"> 
<div class="well widget-add" style="width:220px;">

    <img class="thumbnail" src="img/crm-plugins/shopify.png" style="width:210px; height:70px;">
	<br>
    <div class="ellipsis-multiline" style="-webkit-line-clamp: 3;word-break: break-word;width: 220px !important;" rel="tooltip">
		Sync customer data and Agile CRM as contacts along with purchase history.
	</div>
   
			

			   <a href="#sync/shopify" class="btn btn-primary" style="display:inline-block;">Enable</a>
			

</div></div>-->


</div>
</div>
</script><script id="shopify-template" type="text/html">
<div class="row">
    <div class="span9">
		<div class="slate">
            <div class="slate-content">
                <div class="box-left">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right">
					{{#if installed}}
					<h3>Your Agile CRM account is already linked to shop.</h3>
					<div class="text">
						Please uninstall Agile CRM app from {{shopurl}} and try again.
					</div>
					{{else}}
                    <h3>Agile CRM's code is successfully installed in your Shopify Store.</h3>
                    <div class="text">
						You can now <a href="#web-rules"> define popups</a> to be shown on your store.
                    </div>
					{{/if}}
                </div>
            </div>
        </div>
	</div>
</div>
</script><script id="support-form-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1 style="display:inline;">Help</h1>
 			<a href="#contact-us" style="margin-left:10px;float:right;" class="btn" id="show_support">Email Us</a>
			<h3 style="float:right;font-size:14px;">Still have questions?</h3>
        </div>
    </div>
</div>
<div class="row">
	<div class="span9">
    	<div class="well clearfix">
			<h3 class="help-title"><i class="icon-youtube-play"></i> Video Tutorial</h3>
			<p style="margin-left:20px;">Watch tutorial videos on various features of Agile.</p>
			<p style="margin-left:20px;">
				<iframe width="650" height="360" src="//www.youtube.com/embed/Tr-iCAZKJVw?list=PLX-eE1qngt6GBdCEwZjxnfEIVbXPNqhWZ" frameborder="0" allowfullscreen></iframe>
			</p>
    	</div>
	</div>
    <div class="span3">
        <div class="">
            <div class="well">
				<h3>
                    FAQs
                </h3>
                <br/>
				<ul>
					<li><a href="#subscribe">Change plan or cancel account</a></li>
					<li><a href="https://github.com/agilecrm/javascript-api" target="_blank">Web Tracking and JS API</a></li>
					<li><a href="https://github.com/agilecrm/agile-popups" target="_blank">Web Rules</a></li>
					<li><a href="#sync">Google Sync</a></li>
					<li><a href="#workflows">Sending newsletters</a></li>
					<li><a href="https://www.agilecrm.com/support.html" target="_blank">Help Videos</a></li>
				</ul>
            </div>
            <div class="well">
				<h3 class="help-title"><i class="icon-comments-alt"></i> Live Chat</h3>
				<!--<p>Chat with our support representative. <a style="cursor:pointer" onclick="clickdesk_show_livechat_popup();">Start chat</a>.</p>
				<p>Chat with our support representative. <a href="javascript: void(0);" id="livilyChatLink" class="livilyChatButton ClickdeskChatLink" onclick="clickdesk_show_livechat_popup();">Start chat</a></p>-->
				<p id="clickdesk_status"><img src="img/21-0.gif" height="25px" width="25px"></img></P>
            </div>
        </div>
    </div>
</div>
</script><script id="tagslist-template" type="text/html">
<div id='tags'>
	{{#tagslist this}}
	{{/tagslist}}
</div>
</script>

<script id="tags-collection-template" type="text/html">
<div id='tags' style="max-height:1400px; overflow-y:scroll;overflow:auto;
margin:10px -20px -20px 0px">
	{{#setupTags this}}
		
	{{/setupTags}}
</div>
<div id="tags-model-list" >
	
</div>
</script>
<script id="tags-model-template" type="text/html">
{{this}}
</script><script id="task-detail-template" type="text/html">
<div class="row-fluid">
       <div class="span12">
            <div style="margin-bottom: 20px; margin-top:25px;">
			<div class="row-fluid" style="margin-bottom: -10px;">
                 <span class="pull-left taskDetail-text" style="margin-bottom: -10px;"> 
                    <h2 style="text-transform: capitalize;">{{#is_link subject}}<span class="activate-link">{{else}}<span>{{/is_link}}{{safe_string subject}}</span></h2>
                  </span>
					<span class="label" style="margin-top: 11px;display: inline-block;margin-left: 10px">{{task_property type}}</span>                  
                    {{#if_not_equals priority_type "NORMAL" }}
                   <span class="label label-{{task_label_color priority_type}}" style="display: inline-block;margin-left: 4px">{{ucfirst priority_type}}</span>
                         {{/if_not_equals}}
                 	<!--  starting rating,edit,owner -->

					<div class="btn-group right">
					   <a class="btn" href="javascript:void(0)" data="{{id}}" id="task_edit" ><i class="icon-edit"></i> Edit</a>
                        <a class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
                    	
								<ul class="dropdown-menu pull-right" role="menu">
									<li><a href="#new-task-modal"  data-toggle="modal"><i class="icon-file"></i>Add Note</a></li>
                                    
									<li><a href='javascript:void(0)'  data="{{id}}" class ="delete_task"><i	class="icon-trash"></i> Delete</a></li>
								</ul>
					 </div>
                 </div>
             </div>
            <!---------- end of row ------------>


  <!--------- task status ---------------->

<div class="row-fluid">
<div class="span10" >
{{#if_equals "IN_PROGRESS" status}}
<div style="width:230px">
<div class="pull-left" style="text-transform: capitalize;width:50%;">{{displayTaskStatus status}} ({{progress}}%)</div>
 <div class="pull-right" style="width:50%;text-align: right;"><time datetime="{{epochToHumanDate "dd mmm yyyy" due}}">(Due {{epochToHumanDate "dd mmm yyyy" due}})</time></div>
<div class="clearfix"></div>
<div   style="width: 100%;height:5px;" class="progress progress-info">
          <div class="bar" style="width: {{progress}}%;"></div>
     </div>
</div>
{{/if_equals}}

{{#if_equals "COMPLETED" status}}
<span class="span4" style="text-transform: capitalize;">{{displayTaskStatus status}}
{{#if task_completed_time}}<time datetime="{{epochToHumanDate "dd mmm yyyy" task_completed_time}}">({{epochToHumanDate "dd mmm yyyy" task_completed_time}})</time>{{/if}}
</span>

{{/if_equals}}

{{#if_equals "YET_TO_START" status}}
<span class="span4" style="text-transform: capitalize;">{{displayTaskStatus status}}
<time datetime="{{epochToHumanDate "dd mmm yyyy" due}}">(Due {{epochToHumanDate "dd mmm yyyy" due}})</time>
</span>
{{/if_equals}}
</div>
<div class="span2">
<div class="pull-right" style="position: relative;width: 100%;">
<div class="contact-owner-position" style="top: 0px;">
<div class="change-owner-succes"></div>
  <span title="Owner" class="contact-owner-view">
      	<span class="contact-owner" id="change-owner-element">
        	<span class="contact-owner-text">Owner:&nbsp;&nbsp;</span>
			{{#if taskOwner}}
        	<span class="contact-owner-pic"><img class="user-img"  alt="" src="{{defaultGravatarurl 40}}" /></span>
			{{else}}
			<span class="contact-owner-pic"><img class="user-img"  alt="" src="{{defaultGravatarurl 40}}" /></span>
            <span class="task-owner-add" style="font-size:13px;"><a style="cursor:pointer;">Assign Owner</a></span>
 			{{/if}}
        	<span id="task-owner" data={{taskOwner.id}} class="task-owner-name contact-owner-name">{{taskOwner.name}}</span>
        
        	{{#canEditContact taskOwner.id}}
        	<div class="btn-group" id="change-task-owner-ul" style="vertical-align: middle; display: none">
        		 <a class="btn dropdown-toggle" data-toggle="dropdown">Change Owner <span class="caret"></span></a>
        		 <ul id='task-detail-owner' class="dropdown-menu pull-right"></ul>
        	</div> 
			{{/canEditContact}}
       </span>
    </span>
</div>
</div>
</div>
</div>

<div class="row-fluid"  style="border-bottom: 1px solid #ddd;margin-bottom: 15px; padding-bottom: 15px;">
<div class="row-fluid" id="task-contact-img" style="margin-top: -8px;">
        	{{#each contacts}}
        		{{#if_contact_type "PERSON"}}
        			<a href="#contact/{{id}}" class="activate-link"><img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" width="40px" height="40px" style="display:inline; width:40px; height:40px; "  title="{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}" /></a>
        		{{/if_contact_type}}
				{{#if_contact_type "COMPANY"}}
        			<a href="#contact/{{id}}" class="activate-link"><img class="thumbnail" {{getCompanyImage "40" "display:inline;"}} title="{{getPropertyValue properties "name"}}"/></a>
        		{{/if_contact_type}}
        	{{/each}}
</div>
</div> 

  </div>
</div>

		<div class="row-fluid">
		<!--  starting time line view -->
       <!-- ending of tabs --->
		<div class="span9">
			<ul class="nav nav-tabs" id="taskDetailsTab">
                <li  class="active"><a data-toggle="tab" href="#activity">Activity</a></li>
				<li><a data-toggle="tab" href="#notes">Notes</a></li>
				<li><a data-toggle="tab" href="#contacts">Related</a></li>
			</ul>
           
			<div class="tab-content" id="task_tab_detail">
                <div class="tab-pane active" id="activity"><img src="img/21-0.gif"></img></div>
				<div class="tab-pane " id="contacts"><img src="img/21-0.gif"></img></div>
				<div class="tab-pane" id="notes"><img src="img/21-0.gif"></img></div>
			</div>
       </div>
    <!-- ending of tabs --->
		</div>
	<!--  ending timeline view -->

	</script>

<script id="task-related-collection-template" type="text/html">
{{#if this.length}}
	<div style='height:30px'>
		<a href="#" class="task-add-contact btn right" style="position:relative;margin-bottom:10px;">
			<span><i class="icon-plus-sign"></i></span> Add Contact
		</a>
	</div>
	<br/>
			<table  class="table table-striped agile-ellipsis-dynamic onlySorting" style="overflow: scroll; border-radius: 5px; -webkit-border-radius: 5px; margin-bottom:0px; border: 1px solid #dddddd; border-collapse: separate;">
				<colgroup><col width="10px"><col width="40%"><col width="20%"><col width="25%"><col width="12%"></colgroup>
				<thead>
					<tr><th></th>
						<th>Name</th>
						<th>Work</th>
						<th>Tags</th>
						<th>Lead Score</th>
					</tr>
				</thead>
				<tbody id="task-related-model-list" class="task-related-model-list agile-edit-row"
					route="contact/" style="overflow: scroll;">
				</tbody>
			</table>

		{{else}}
			<div class="slate">
            	<div class="slate-content">
                	<div class="box-left">
                    	<img alt="Clipboard" src="/img/clipboard.png">
                	</div>
                	<div class="box-right">
                    	<h3>Task is not associated with any person/contact. </h3>
                    	<div class="text">
							All Contacts which are related to this task are shown here.
							<br/>
							<a href="#" class="task-add-contact btn left" style="margin-top:10px; margin-bottom:10px;">
								<i class="icon-plus-sign"></i> Add Contact
							</a>
                    	</div>
                	</div>
            	</div>
        	</div>
		{{/if}}
</script>

<script id="task-related-model-template" type="text/html">
	<td></td>
	<td class="data" data="{{id}}" style="white-space:nowrap;">
    	<div style="display:inline;padding-right:10px;height:auto;">
          {{#if_contact_type "PERSON"}}
        	<img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" width="40px" height="40px" style="display:inline; width:40px; height:40px; "  title="{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}" />
        		
             <div style="height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;width:12em;overflow:hidden;">
        		<b>	{{getPropertyValue properties "first_name"}}
        		{{getPropertyValue properties "last_name"}} </b>
        		<br />
        		{{getPropertyValue properties "email"}}
    	</div>
          {{/if_contact_type}}
				{{#if_contact_type "COMPANY"}}
        	 <img class="thumbnail" {{getCompanyImage "40" "display:inline;"}} title="{{getPropertyValue properties "name"}}"/>
           <div style="height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;width:12em;overflow:hidden;">
        		<b>{{getPropertyValue properties "name"}}
        	
    	</div>
           
        		{{/if_contact_type}}
    	</div>
    	
	</td>
	<td><div style="height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;width:8em;overflow:hidden;">{{getPropertyValue properties "title"}}<br />
    	{{getPropertyValue properties "company"}}</div>
	</td>
	<td> 
<div class="ellipsis-multiline" style="line-height:20px !important; word-break:keep-all;">
	{{#each tags}}
    	<span class="label">{{this}}</span>
    {{/each}}
</div>
	</td>
	<td style="width:6em;"><div>{{lead_score}}</div></td>
</script>



<script id="task-related-activity-collection-template" type="text/html">
{{#unless this.length}}
        <div class="slate">
            <div class="slate-content">
                <div class="box-left">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right">
                    <h3>No Activity Found.</h3>
                </div>
            </div>
        </div>
 {{/unless}}

{{#if this.length}}
<div class="page-header" style="margin-top: 0px !important;padding-bottom: 0px;border-bottom: 0px;"></div>
	<ul id="task-related-activity-model-list" class="ativity-block-ul" style="margin:0px;"></ul>
{{/if}}
</script>

<script id="task-related-activity-model-template" type="text/html">
<div style="display:block;" class="activity">
<div class="activity-text-block" style="background: #f5f5f5;">
	<span class="activity-block-owner">
         {{#if user}}
			{{#if userPic}}
				<img class="user-img thumbnail" width="40" height="40" alt="" src="{{userPic}}" >
			{{else}}
				<img class="user-img thumbnail" width="40" height="40" alt="" src="{{defaultGravatarurl 40}}" >
			{{/if}}
		{{else}}
			<img class="user-img thumbnail" width="40" height="40" alt="" src="{{#getCurrentUserPrefs}}{{#if pic}}{{pic}}{{else}}{{defaultGravatarurl 40}}{{/if}}{{/getCurrentUserPrefs}}" >
		{{/if}}

     <span class="owner-name">{{user.name}}</span>

	</span>
	<h4><b>{{get_normal_activity_type activity_type}}</b></h4>


   {{#if_equals "TASK_EDIT" activity_type}}
	<div style="background:none;border:none;margin-top: 8px;">
         {{displayActivityFieldText custom3}} updated.
	</div>	
     {{/if_equals}}

 {{#if_equals "TASK_ADD" activity_type}}
	<div style="background:none;border:none;margin-top: 8px;">
         Task created for user {{ucfirst custom1}}.
	</div>	
     {{/if_equals}}

 {{#if_equals "TASK_PROGRESS_CHANGE" activity_type}}
	<div style="background:none;border:none;margin-top: 8px;">
         Task progress changed from {{custom2}}% to {{custom1}}%.
	</div>	
     {{/if_equals}}

 {{#if_equals "TASK_OWNER_CHANGE" activity_type}}
	<div style="background:none;border:none;margin-top: 8px;">
      Task  owner changed to {{custom1}}.
	</div>	
     {{/if_equals}}

 {{#if_equals "TASK_STATUS_CHANGE" activity_type}}
	<div style="background:none;border:none;margin-top: 8px;">
        Status changed from {{displayTaskStatus custom2}} to {{displayTaskStatus custom1}}.
	</div>	
     {{/if_equals}}


 {{#if_equals "TASK_COMPLETED" activity_type}}
	<div style="background:none;border:none;margin-top: 8px;">
        Task status changed to completed.
	</div>	
     {{/if_equals}}

 {{#if_equals "TASK_DELETE" activity_type}}
	<div style="background:none;border:none;margin-top: 8px;">
        Task is deleted
	</div>	
     {{/if_equals}}


 {{#if_equals "TASK_RELATED_CONTACTS" activity_type}}
	<div style="background:none;border:none;margin-top: 8px;">
    {{#if related_contact_ids}}{{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}}<a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}}{{/if}} 
    {{#if_equals "added_relatedcontacts" custom3}}
       attached to
      {{else}}
        removed from
     {{/if_equals}}
       the task
    </div>	
  {{/if_equals}}

	<div class="clear">
		<small class="edit-hover" style="margin-right:10px"> 
			<time  datetime="{{epochToHumanDate "" time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "dd mmm yyyy" time}}</time>
		</small>
	</div>

</div>
</script>

<!-- New (Note) Modal views -->
<div class="modal hide fade tasknoteupdatemodal"
	id="tasknoteupdatemodal">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>
			<i class="icon-plus-sign"></i>&nbsp;Edit Note
		</h3>
	</div>
	<div class="modal-body">
		<form id="tasknoteUpdateForm" name="tasknoteUpdateForm" method="post">
			<fieldset>

				<input name="id" id="id" type="hidden" value="{{id}}" /> <input
					name="created_time" id="created_time" type="hidden"
					value="{{created_time}}" />

				<div class="control-group">
					<label class="control-label"><b>Subject</b> <span
						class="field_req">*</span></label>
					<div class="controls">
						<input type="text" placeholder="About" name="subject" id="subject"
							class="required" />
					</div>
				</div>
				<div class="row-fluid">
					<div class="control-group">
						<label class="control-label"><b>Description</b></label>
						<div class="controls">
							<textarea rows="3" class="span8" placeholder="Detailed Note"
								name="description" id="description" style="max-width: 400px;"></textarea>
						</div>
					</div>
				</div>

			</fieldset>
		</form>
	</div>
	<div class="modal-footer">
		<a href="#" class="btn btn-primary" id="task_note_update">Save </a> <span
			class="save-status"></span>
	</div>
</div>
<!-- End of Modal views -->


<!-- New (Note) Modal views -->
<div class="modal hide fade task-note-modal" id="new-task-modal">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3>
			<i class="icon-plus-sign"></i>&nbsp;Add Note
		</h3>
	</div>
	<div class="modal-body">
		<form id="tasknoteForm" name="tasknoteForm" method="post">
			<fieldset>
				<div class="control-group">
					<label class="control-label"><b>Subject</b> <span
						class="field_req">*</span></label>
					<div class="controls">
						<input type="text" placeholder="About" name="subject" id="subject"
							class="required" />
					</div>
				</div>
				<div class="row-fluid">
					<div class="control-group">
						<label class="control-label"><b>Description</b></label>
						<div class="controls">
							<textarea rows="3" class="span8" placeholder="Detailed Note"
								name="description" id="description" style="max-width: 400px;"></textarea>
						</div>
					</div>
				</div>

			</fieldset>
		</form>
	</div>
	<div class="modal-footer">
		<a href="#" class="btn btn-primary" id="tasknote_validate">Save </a> <span
			class="save-status"></span>
	</div>
</div>
<!-- End of Modal views -->

<script id="new-tasks-list-header-template" type="text/html">
<div class="row">
    <div style="margin-left:30px; ">
        <div class="page-header">
            <h1 id="new-task-heading" class="task-heading"><span>My Pending Tasks</span>&nbsp<small class="tasks-count"></small></h1>            
            <div class="btn-group pull-right type-task-button" style="cursor:pointer;top: -28px;">
                <div class="btn selected_name">Due</div>
                <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                <span class="caret"></span>
                </a>
                <ul class="dropdown-menu main-menu" id="new-type-tasks">
                   <li class="dropdown-submenu do-onclick-nothing">
                       <a data-toggle="dropdown">Group By</a>
                       <ul class="dropdown-menu" id="new-type-tasks" style="min-width: 85px;left: -86px;">
                          <li><a href="CATEGORY" class="new-type-task">Category</a></li>
                          <li><a href="OWNER" class="hide-on-pending hide-on-my-task new-type-task">Owner</a></li>
                          <li><a href="DUE" class="new-type-task">Due</a></li>
                          <li><a href="PRIORITY" class="new-type-task">Priority</a></li>
                          <li><a href="STATUS" class="hide-on-pending hide-on-all-pending new-type-task">Status</a></li>
                       </ul>
                   </li>
                   <li><a href="LIST" class="list-view new-type-task">List View</a></li>
                   <li><a href="GroupView" class="group-view" style="display:none;">Group View</a></li>                     
                </ul>
            </div>
            <div class="btn-group pull-right owner-task-button" style="cursor:pointer;margin-right:15px;top: -28px;">
                <div class="btn selected_name">My Pending Tasks</div>
                <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                <span class="caret"></span>
                </a>
                <ul class="dropdown-menu" id="new-owner-tasks">
                    		 
                </ul>
            </div>
        </div>
    </div>
</div>

<div id="new-task-list-based-condition"> 
  <img class="loading_task_img" style="padding-right:5px;" height="32px" width="32px" src= "img/21-0.gif"></img>
</div>
<div id="task-list-based-condition" style="display:none;"></div>
</script>

<script id="new-tasks-lists-collection-template" type="text/html"> 
 <div id="new-tasks-lists-model-list" class="list-area row-fluid">

 </div>
</script>

<script id="new-tasks-lists-model-template" type="text/html">
     <div class="list-header" attr="{{heading}}" ownerID={{owner_id}}> 
         <span style="overflow: hidden;white-space: nowrap;text-overflow:ellipsis;min-width: 10%;max-width: 90%;display: inline-block;">{{get_normal_name heading}}</span>
         <span id="task-count-{{heading}}-{{owner_id}}" class="txt-small txt-mute" style="position: absolute;padding-left: 3px;top: 7px;"></span>
         <div class="pull-right"><img id="task-list-loading-img-{{heading}}-{{owner_id}}" src="img/ajax-loader-cursor.gif"></img></div>                 
     </div>     

     {{#if owner_id}}
      <div id="list-tasks-{{heading}}-{{owner_id}}" class="list-tasks">
     {{else}}
      <div id="list-tasks-{{heading}}" class="list-tasks">
     {{/if}}
        
     </div>  
     <div id="show_loader"></div>      
     <div class="list-bottom left add-task" heading="{{heading}}" ownerID={{owner_id}}><a href="#"><i class="icon-plus" /> Add a task</a></div>     
</script>

<script id="task-collection-template" type="text/html">
<div id="task-model-list" class="task-model-list">
  
</div>
</script>


<script id="task-model-template" type="text/html">
{{#if_equals priority_type "HIGH"}}
 <div class="listed-task red ui-state-default" id="{{id}}">
{{else}}
  {{#if_equals priority_type "LOW"}}
    <div class="listed-task yellow ui-state-default" id="{{id}}">
  {{else}}
    <div class="listed-task ui-state-default" id="{{id}}">
  {{/if_equals}}
{{/if_equals}}

  <div class="task-body">    
    <div class="task-left" >  
<div class="new-task-owner">     
         {{#if ownerPic}}
        	<img src="{{ownerPic}}" width="32" height="32" title="{{taskOwner.name}}"/>
	     {{else}}
			<img src="{{defaultGravatarurl 50}}" width="32" height="32" title="{{taskOwner.name}}"/>
	     {{/if}}
      </div> 
      </div>
<div class="pull-left task-content-view">
<div class="pull-left" style="width:68%">
      {{#if is_complete}}
         {{#is_link subject}}<a href="#task/{{id}}"><span class="new-task-subject activate-link task-completed">{{else}}<a href="#task/{{id}}"><span class="new-task-subject task-completed">{{/is_link}}{{safe_string subject}}</span></a>
      {{else}}
         {{#if_equals status "COMPLETED"}}
           {{#is_link subject}}<a href="#task/{{id}}"><span class="new-task-subject activate-link task-completed">{{else}}<a href="#task/{{id}}"><span class="new-task-subject task-completed">{{/is_link}}{{safe_string subject}}</span></a>
         {{else}}
           {{#is_link subject}}<a href="#task/{{id}}"><span class="new-task-subject activate-link">{{else}}<a href="#task/{{id}}"><span class="new-task-subject">{{/is_link}}{{safe_string subject}}</span></a>
         {{/if_equals}}       
      {{/if}}      
</div>
<div class="task-right">
      <label class="new-task-type label" title="Category">{{get_normal_name type}}</label>
  </div>
    <div class="clearfix"></div>
      {{#if contacts}}  
         <div class="task-related-to" title="Related To">
        	{{#each contacts}}
        		{{#if_contact_type "PERSON"}}
        			<a href="#contact/{{id}}" class="activate-link task-related-contacts">{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}</a>
        		{{/if_contact_type}}
				{{#if_contact_type "COMPANY"}}
        			<a href="#contact/{{id}}" class="activate-link task-related-contacts">{{getPropertyValue properties "name"}}</a>
        		{{/if_contact_type}}
        	{{/each}}
		 </div>
      {{/if}}
</div>
<div class="clearfix"></div>
      {{#if_equals status "IN_PROGRESS"}}
        <label class="label progress-label" title="Progress">{{progress}}%</label>
      {{/if_equals}}
<div class="clearfix"></div>
    </div> <!--task-body--> 

    
<div class="clearfix"></div>
 
   <div class="new-task-footer">
      <time class="new-task-due-time time-ago" data="{{id}}" value="{{due}}" datetime="{{epochToHumanDate "" due}}">{{epochToHumanDate "ddd mmm dd yyyy h:MM TT" due}}</time>
      <div class="task-actions">
           <i class="task-action icon icon-check is-task-complete" data="{{id}}" title="Mark as Complete"></i>
           <i class="task-action icon icon-edit edit-task" data="{{id}}" title="Edit Task"></i>          
          <i class="task-action icon icon-trash delete-task" data="{{id}}" title="Delete Task"></i>
           {{#if notes}} 
             <i class="task-action icon icon-comment notes-task-popover edit-task" data="{{id}}" title="Notes"></i>
             <span class="txt-small note-count" title="Notes">{{notes.length}}</span>
           {{/if}}
      </div>
      {{#if notes}} 
           <div class="task-note-action">
             <i class="task-action icon icon-comment" data="{{id}}" title="Notes"></i>
             <span class="txt-small note-count" title="Notes">{{notes.length}}</span>
           </div>
      {{/if}}
   </div> <!--task-footer-->
</div>
</script>

<script id="notes-for-task-template" type="text/html">
<li class="task-note" data="{{id}}"> 

{{#if domainOwner}}
	{{#if ownerPic}}
		<img class="thumbnail" width="20" height="20" alt="" src="{{ownerPic}}" title="{{domainOwner.name}}">
	{{else}}
		<img class="thumbnail" width="20" height="20" alt="" src="{{defaultGravatarurl 40}}" title="{{domainOwner.name}}">
	{{/if}}
{{else}}
	{{#getCurrentUserPrefs}}<img class="thumbnail" width="20" height="20" alt="" title="{{currentDomainUserName}}" src="{{#if pic}}{{pic}}{{else}}{{defaultGravatarurl 40}}{{/if}}">{{/getCurrentUserPrefs}}
{{/if}}

<div style="border: 1px solid #cccccc;border-radius: 3px;margin-left: 5px;padding-left: 5px;width: 92%;"> 
 <div class="txt-mute">{{description}}</div>
</div>
</li>
</script>

<script id="note-form-template" type="text/html">
   <textarea placeholder="Detailed Note" name="note_description" rows="3" class="input span8" id="note_description"></textarea> 
</script><div class="modal hide fade" id="updateTaskModal" >

	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>

		<h3><i class="icon-edit"></i>&nbsp;Edit Task</h3>
	</div>

	<div class="modal-body">

		<div id="relatedtask">			
			<!--Task form -->
			<form id="updateTaskForm" name="updateTaskForm" method="post">
				<fieldset>
					<input name="id" type="hidden" value="{{id}}" />
					<input name="progress" id="progress" type="hidden" value="">					
					<input name="is_complete" id="is_complete" type="hidden" value="">
					<input name="taskListId" type="hidden" value="{{taskListId}}" /> 
					<input name="taskListOwnerId" type="hidden" value="{{taskListOwnerId}}" />
					
					<div class="row">
						<div id="updateTask" class="span3 control-group">
							<label for="subject" class="control-label"> <b>Task</b>
								<span class="field_req">*</span></label>
							<div class="controls">
								<span class="input "><input id="subject" type="text"
									name="subject" size="40" class="required" />
								</span>
							</div>
						</div>
						<div id="task-category" class="span2 control-group">
							<label for="type" class="control-label"><b> Category</b> 
							<span class="field_req">*</span></label>
							<div class="controls">
								<span class="input"> <select name="type" id="type"
									size="1" class="input-medium required">
										<option></option>
										<option value="CALL">Call</option>
										<option value="EMAIL">Email</option>
										<option value="FOLLOW_UP">Follow-up</option>
										<option value="MEETING">Meeting</option>
										<option value="MILESTONE">Milestone</option>
										<option value="SEND">Send</option>
										<option value="TWEET">Tweet</option>
										<option value="OTHER">Other</option>
								</select>
								</span>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="span3 control-group">
							<label for="due" class="control-label"><b>Date (Due) </b>
							<span class="field_req">*</span></label>
							<div class="controls">
								<input type="text" name="due" placeholder="mm/dd/yyyy"
									id="update-task-date-1" class="required date" />
							</div>
						</div>
						<div class="span2 control-group">
							<label class="control-label"><b>Time </b><span class="field_req">*</span></label>
                            <div class="controls">							
                               <input type="text" name="task_ending_time" class="update-task-timepicker required" id="task_ending_time" style="width:65px" placeholder="time" />		
                            </div>
						</div>
					</div>
					<div class="row">
						<div class="span3 control-group">
							<label class="control-label"><b>Owner </b><span
								class="field_req">*</span></label>
							<div class="controls" id="owners">
								<select id="owners-list" class="required" name="owner_id"></select>
								<img class="loading-img" src="img/21-0.gif"></img>
							</div>
						</div>
						<div class="span2">
							<label for="priority_type" class="control-label"><b>Priority
							</b></label>
							<div class="controls">
								<span class="input "> <select name="priority_type"
									id="priority_type" size="1" class="input-medium">
										<option value="HIGH">High</option>
										<option value="NORMAL" selected="selected">Normal</option>
										<option value="LOW">Low</option>
								</select>
								</span>
							</div>										
						</div>
					</div>
					
					<div class="row">
					 <div class="span3 control-group">
						<label for="status" class="control-label"><b>Status </b></label>
                            <div class="controls" style="margin-bottom: 6px;">
                                <span class="input ">
                                     <select name="status" id="status" size="1" class="status">
                                        <option value="YET_TO_START" selected="selected">Yet to Start</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="COMPLETED">Completed</option>                                        
                                     </select>
                                </span>
                            </div>
					</div>
					 <div class="span2">
                            <div class="progress-slider controls progress_slider_width_bottom" title="Progress">
							    <input id="progress_slider" type="slider" class="progress_slider" value="0" />
							</div>								
						</div>	
				   </div>
					
					<div class="row">
					 <div class="span5 control-group">
						<label class="control-label"><b>Related To</b></label>
						<div class="controls">
							<div>
								<div class="pull-left">
									<ul name="contacts" class="contacts tags tagsinput"></ul>
								</div>
								<input type="text" id="update_task_related_to"
									class="typeahead typeahead_contacts" data-provide="typeahead"
									data-mode="multiple" size="40" />
							</div>
						</div>
					</div>
				   </div>
				   <div class="row-fluid hide">
					    <div class="control-group">
							<label for="notes" class="control-label"><b>Notes</b></label>
							<div class="controls pull-right task-add-note">
								<a href="#"><i class="icon-plus" /> Add Note</a>
							</div>
							<div id="forNoteForm" class="controls"></div>
							<ul id="notes" name="notes" class="notes"></ul>
						</div>
					</div>
				</fieldset>
			</form>
		</div>
	</div>
	<div class="modal-footer">
		<a href="#" class="btn btn-primary" id="update_task_validate">Update</a>&nbsp;
		<span class="save-status"></span>
	</div>
</div>
<script id="task_notes-collection-template" type="text/html">
{{#unless this.length}}
        <div class="slate">
            <div class="slate-content">
                <div class="box-left">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right">
                    <h3>You have no notes for this task.</h3>
                    <div class="text">
                        You can save specific information about task as a Note.
                    </div>
                    <a href="#new-task-modal" data-toggle="modal" class="btn blue btn-slate-action task-add-note"><i class="icon-plus-sign"></i>  Add Note</a>
                </div>
            </div>
        </div>
 {{/unless}}

{{#if this.length}}
<div class="page-header" style="margin-top: 0px !important;border-bottom: 0px;">
   <a href="#new-task-modal" data-toggle="modal" class="btn right tasks-add-note" style="position:relative"><span><i class='icon-plus-sign'/></span> Add Note</a> 
</div>
	<ul id="task_notes-model-list" class="ativity-block-ul" style="margin:0px;"></ul>
{{/if}}
</script>
<script id="task_notes-model-template" type="text/html">
<div style="display:block;" class="activity">

<div class="activity-text-block" style="background: #f5f5f5;">
	<span class="activity-block-owner">
		{{#if domainOwner}}
			{{#if ownerPic}}
				<img class="user-img thumbnail" width="40" height="40" alt="" src="{{ownerPic}}" >
			{{else}}
				<img class="user-img thumbnail" width="40" height="40" alt="" src="{{defaultGravatarurl 40}}" >
			{{/if}}
		{{else}}
			<img class="user-img thumbnail" width="40" height="40" alt="" src="{{#getCurrentUserPrefs}}{{#if pic}}{{pic}}{{else}}{{defaultGravatarurl 40}}{{/if}}{{/getCurrentUserPrefs}}" >
		{{/if}}
		<span class="owner-name">{{#if domainOwner}} {{domainOwner.name}} {{else}} {{#getCurrentUserPrefs}}{{currentDomainUserName}}{{/getCurrentUserPrefs}} {{/if}}</span>
	</span>
	<h4><a style="text-decoration: none"><b>{{subject}}</b></a></h4>
	<div style="background:none;border:none;margin-top: 7px;">
		<pre style="border: none;">{{show_link_in_statement description}}</pre>
	</div>	
	 	<div class="clear">
		<div style="margin-bottom: 16px;">	
		{{#each contacts}}
           	{{#if id}}
				{{#isDuplicateContactProperty properties "email"}}
					{{else}}	
						<a href="#contact/{{id}}">{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}</a>,
				{{/isDuplicateContactProperty}}
           		
           	{{/if}}
       	{{/each}}
		</div>
		<small class="edit-hover" style="margin-right:10px"> 
			<time class="note-created-time" datetime="{{epochToHumanDate "" created_time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time>
		</small>
		<span class="actions pull-right">
<a title="Edit"  data="{{id}}" data-toggle="modal" class="task-note-edit" style="cursor:pointer;text-decoration: none;padding-right:10px"> <i class="icon-pencil"></i> </a>
            <a title="Delete" style="cursor:pointer;text-decoration: none"><span class="activity-delete icon-trash" style="display:inline" id="{{id}}" url="core/api/contacts/notes/bulk"></span></a>
        </span>
	</div>
</div>
</div>
</script>
<script id="tasks-list-collection-template" type="text/html">
{{#unless this.length}}
<div class="slate" style="padding:5px;">
    <div class="slate-content">
		<h3> <icon class="icon-edit"></icon> No tasks found</h3>
	</div>
</div>
{{else}}
<div class="data-block">
    <div class="data-container">
        <table class="table table-striped showCheckboxes no-sorting" url="core/api/tasks/bulk" id="task-list">
            <thead>
                <tr>
					<th>Owner</th>
					<th>Task Name</th>
                    <th>Category</th>
                   	<th>Priority</th>
					<th>Due Date</th>
                    <th>Related To</th>
                </tr>
            </thead>
            <tbody id="tasks-list-model-list" style="cursor:pointer;" route="task/">
            </tbody>
        </table>
		<a href="#" class="btn btn-primary"  style="margin-bottom: 15px;margin-left: 25px;display:none;" id="bulk-complete">Complete</a>
    </div>
</div>
{{/unless}}
</script>

<script id="tasks-list-model-template" type="text/html">
<td class="data" data="{{id}}">  
  <div style="height:auto;text-overflow:ellipsis;white-space:nowrap;max-width:5em;overflow:hidden;">
	{{#if ownerPic}}
        	<img class="thumbnail" src="{{ownerPic}}" width="40px" height="40px" title="{{taskOwner.name}}"/>
	{{else}}
			<img class="thumbnail" src="{{defaultGravatarurl 50}}" width="40px" height="40px" title="{{taskOwner.name}}"/>
	{{/if}}
  </div>
</td>
{{#if is_complete}}
	<td><div style="text-decoration:line-through;text-overflow:ellipsis;text-align:justify;white-space:nowrap;max-width:15em;overflow:hidden;">{{#is_link subject}}<span class="activate-link">{{else}}<span>{{/is_link}}{{safe_string subject}}</span></div></td>
    <td><div style="text-decoration:line-through"><!--<i class="{{icons type}}"></i>&nbsp;--><span class="label">{{task_property type}}</span></div></td>
    <td><div style="text-decoration:line-through"><span class="label label-{{task_label_color priority_type}}">{{ucfirst priority_type}}</span></div></td>
    <td><div style="text-decoration:line-through"><time class="task-due-time" value="{{due}}" datetime="{{epochToHumanDate "" due}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy" due}}</time></div></td>
{{else}}
	<td><div style="overflow:hidden;text-overflow:ellipsis;text-align:justify;white-space:nowrap;max-width:15em;">{{#is_link subject}}<span class="activate-link">{{else}}<span>{{/is_link}}{{safe_string subject}}</span></div></td>
    <td><div><!--<i class="{{icons type}}"></i>&nbsp;-->

          <span class="label">{{task_property type}}</span></div></td>
    <td>	{{#if_equals priority_type "NORMAL"}}{{else}}
					<span style="margin-left:5px;" class="label label-{{task_label_color priority_type}}">{{ucfirst priority_type}}</span>
				{{/if_equals}}</td>
	<td><div><time class="task-due-time" value="{{due}}" datetime="{{epochToHumanDate "" due}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy" due}}</time></div></td>
{{/if}}
	<td>
		<div style="height:auto;text-overflow:ellipsis;white-space:nowrap;width:104px;overflow:hidden;display:inline-block;">
        	{{#each contacts}}
        		{{#if_contact_type "PERSON"}}
        			<a href="#contact/{{id}}" class="activate-link"><img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" width="40px" height="40px" style="display:inline; width:40px; height:40px; "  title="{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}" /></a>
        		{{/if_contact_type}}
				{{#if_contact_type "COMPANY"}}
        			<a href="#contact/{{id}}" class="activate-link"><img class="thumbnail" {{getCompanyImage "40" "display:inline;"}} title="{{getPropertyValue properties "name"}}"/></a>
        		{{/if_contact_type}}
        	{{/each}}
		</div>
       {{#if_greater this.contacts.length "3"}}<span>...</span>{{/if_greater}}
    </td>
</script>
<script id="tasks-list-header-template" type="text/html">
<div class="row">
    <div style="margin-left:30px; ">
        <div class="page-header">
            <h1 class="task-heading"><span>My Pending Tasks</span>&nbsp<small class="tasks-count"></small> <span style="font-size: small;color: #525252;  background-color: rgb(255,255,204);  border: 1px solid rgb(211,211,211);border-radius: 3px;padding: 3px 5px 3px 5px;">Try our <a href="#tasks-new">new look</a></span></h1>
            <div class="btn-group pull-right owner-task-button" style="cursor:pointer;margin-right:15px;top: -28px;">
                <div class="btn selected_name">My Pending Tasks</div>
                <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                <span class="caret"></span>
                </a>
                <ul class="dropdown-menu" id="owner-tasks"></ul>
            </div>
            <div class="btn-group pull-right type-task-button" style="cursor:pointer;margin-right:15px;top: -28px;">
                <div class="btn selected_name">All Categories</div>
                <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                <span class="caret"></span>
                </a>
                <ul class="dropdown-menu" id="type-tasks">
					 <li><a href="">All Categories</a></li>
                     <li><a href="CALL">Call</a></li>
                     <li><a href="EMAIL">Email</a></li>
                     <li><a href="FOLLOW_UP">Follow-up</a></li>
                     <li><a href="MEETING">Meeting</a></li>
                     <li><a href="MILESTONE">Milestone</a></li>
                     <li><a href="SEND">Send</a></li>
                     <li><a href="TWEET">Tweet</a></li>
					 <li><a href="OTHER">Other</a></li>
                </ul>
            </div>
        </div>
    </div>
</div>
<div class="row-fluid span12" style="margin-left:0px; ">
	<div id="task-list-based-condition" class="span9" ></div>
	<div class="span3">
        <div class="data-block">
            <div class="well">
                <header>
                    <h3><span><i class="icon-tasks"></i></span> Tasks</h3>
                </header>
                <div id="pie-tasks-chart" style="width:100%; height:400px"></div>
                <h3 style="margin-top:10px;">
                    What are Tasks?
                </h3>
                <br />
                <p>
                    Tasks are like to-dos. Result oriented. You can assign a category such as call, email etc and add them to your calendar.
                </p>
            </div>
        </div>
	</div>
</div>
</script><script id="tasks-collection-template" type="text/html">
<header>
    <h3 style="margin-left:3px;display:inline-block!important;">
        <!--<span><i class="icon-edit"></i></span>--> 
        My Tasks<small> {{count}}</small>
        <span style="vertical-align:text-top;margin-left:-3px">         
        <img border="0" src="/img/help.png" style="height:6px;vertical-align:top;" rel="popover" data-placement="right" data-content="Tasks are like to-dos. Result oriented. You can assign a category such as call, email etc and add them to your calendar." id="element" data-trigger="hover" />
        </span>
    </h3>
		<span class="right" style="margin-top:6px;">
    		 <span class="add-task" style="margin-right:5px;"><a href="#" style="text-decoration:none!important;" title="Add Task"><i class="icon-plus"/></a></span>
			 <a href="#tasks" style="text-decoration:none!important;" class="tasks-table" title="All Tasks" id="tasks-list"><i class="icon-tasks"/></a>
		</span>
</header>
{{#unless this.length}}
<div class="slate" style="padding:5px 2px;">
    <div class="slate-content" style="text-align:center;">
		<h4>You have no tasks due</h4>
	</div>
</div>
{{/unless}}
{{#if this.length}}
<table style="display:block;overflow:hidden!important;margin-bottom:-20px;"><tbody><tr><td>
<section>
    <form>
        <table class="table hide agile-ellipsis-dynamic" style="overflow:hidden!important;">
            <div id="overdue-heading" style="display: none;"><b >Overdue</b>
			&nbsp<small class="count" count="0">(10)</small></div>
			<colgroup><col width="30px"><col width="99%"></colgroup>
            <tbody id="overdue" style="display: inline;" route="task/" class="agile-edit-row"></tbody>
        </table>
        <table class="table hide agile-ellipsis-dynamic" style="overflow:hidden!important;">
            <div id="today-heading" style="display: none"><b >Today</b>	
			&nbsp<small class="count" count="0">(10)</small></div>
			<colgroup><col width="30px"><col width="99%"></colgroup>
            <tbody id="today" style="display: inline;" route="task/" class="agile-edit-row"></tbody>
        </table>
        <table class="table hide agile-ellipsis-dynamic" style="overflow:hidden!important;">
            <div id="tomorrow-heading" style="display: none"><b >Tomorrow</b>
			&nbsp<small class="count" count="0">(10)</small></div>
			<colgroup><col width="30px"><col width="99%"></colgroup>
            <tbody id="tomorrow" style="display: inline;" route="task/" class="agile-edit-row"></tbody>
        </table>
        <table class="table hide agile-ellipsis-dynamic" style="overflow:hidden!important;">
		<div id="next-week-heading" style="display: none">
            <b >Later</b>
			&nbsp<small class="count" count="0">(10)</small></div>
			<colgroup><col width="30px"><col width="99%"></colgroup>
            <tbody id="next-week" style="display: inline;" route="task/" class="agile-edit-row"></tbody>
        </table>
    </form>
</section>
</td></tr></tbody></table>
{{/if}}
</script>

<script id="tasks-model-template" type="text/html">
	<td style="border-top:1px dotted #DDD;" class="data" data="{{id}}"> <input type="checkbox" data='{{id}}' class='tasks-select'> </td>
	<td style="width:100%!important;">
		<div>
  			<p style="word-break: break-word!important;-ms-word-break: break-all;word-break: break-all;">
              <a href="javascript:void(0)"><span  class="new-task-subject">{{#is_link subject}}<b  style="white-space: normal!important;">{{else}}<b style="white-space: normal!important;">{{/is_link}}{{safe_string subject}}</b></span></a></p>
  			{{#if this.contacts}}
				<p  style="white-space: nowrap;">{{#related_to_one contacts}}{{/related_to_one}}</p>
			{{/if}}
  			<p style="margin:0px 0px 5px 0px;line-height: 20px;"> 
				<span class="label">{{task_property type}}</span>
				{{#if_equals priority_type "NORMAL"}}{{else}}
					<span style="margin-left:5px;" class="label label-{{task_label_color priority_type}}">{{ucfirst priority_type}}</span>
				{{/if_equals}}
			</p>
        	<p>
        		<time class="task-due-time" datetime="{{epochToHumanDate "" due}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy h:MM TT" due}}</time>
	   		</p>
		</div>
	</td>
</script>
<script id="typeahead-contacts-model-template" type="text/html">
<div>
	{{#if_equals type "COMPANY"}}
	<div style="display: inline; padding-right: 10px; height: auto;">
		<img class="thumbnail pull-left" {{getCompanyImage "40"}} /></img>
	</div>
	<div
		style="height: 50px; display: inline-block; vertical-align: -20px; margin-left: 2px; text-overflow: ellipsis; white-space: nowrap; width: 15em; overflow: hidden; vertical-align: top;">
		<b>{{getPropertyValue properties "name"}}</b><br />
		{{getPropertyValue properties "email"}}</br> {{getPropertyValue properties
		"url"}}</br>
	</div>
	{{/if_equals}}
		{{#if_equals type "PERSON"}}
	<div style="display: inline; padding-right: 10px; height: auto;">
		<img class="thumbnail pull-left" src="{{gravatarurl properties 40}}"
			style="width: 40px; height: 40px;" /></img>
	</div>
	<div
		style="height: 55px; display: inline-block; vertical-align: -20px; margin-left: 2px; text-overflow: ellipsis; white-space: nowrap; width: 15em; overflow: hidden; vertical-align: top;">
		<b>{{getPropertyValue properties "first_name"}} {{getPropertyValue
			properties "last_name"}}</b><br /> {{getPropertyValue properties
		"email"}}</br> {{getPropertyValue properties "company"}}
	</div>
	{{/if_equals}} 

<!-- Deals result -->


{{#if_equals entity_type "deal"}}
	<div style="display: inline;margin-top:10px height: auto;">
		<ul style="display: inline-block; list-style-type: none; margin-left: 0px;">								
			<li>
				<!-- <i class="icon-money icon-3x" id="minus" style="height: 10px; cursor: pointer"></i> -->
				<i class="icon-money thumbnail" id="minus" style="cursor: pointer; width:40px; height:38px; padding-top:6px; font-size:2.75em;"></i>
			</li>
		</ul>
	</div>
	<div
		style="height: 55px; display: inline-block; vertical-align: -20px; margin-left: 2px;margin-top:40px text-overflow: ellipsis; white-space: nowrap; width: 15em; overflow: hidden; vertical-align: top;">
		 <b>{{name}}</b><br /> <span>{{currencySymbol}}{{numberWithCommas expected_value}}</span> ({{probability}}%)<br/>{{description}}
	</div>
	{{/if_equals}}

</div>

<!-- Document Result -->
{{#if_equals entity_type "document"}}
<div style="display: inline;margin-top:10px height: auto;">
		<ul style="display: inline-block; list-style-type: none; margin-left: 0px;">								
			<li>
				<!-- <i class="icon-folder-close icon-3x" id="minus" style="height: 10px; cursor: pointer"></i> -->
				<i class="icon-file icon-3x thumbnail" id="minus" style="cursor: pointer; width:40px; height:40px; "></i>
			</li>
		</ul>
	</div>
	<div
		style="height: 55px; display: inline-block; vertical-align: -20px; margin-left: 2px;margin-top:40px text-overflow: ellipsis; white-space: nowrap; width: 15em; overflow: hidden; vertical-align: top;">
		 <b>{{name}}</b><br /> {{network network_type}}
	</div>
	{{/if_equals}}

</div>

<!-- Case Result -->
{{#if_equals entity_type "case"}}
<div style="display: inline;margin-top:10px height: auto;">
		<ul style="display: inline-block; list-style-type: none; margin-left: 0px;">								
			<li>
				<!-- <i class="icon-folder-close icon-3x" id="minus" style="height: 10px; cursor: pointer"></i> -->
				<i class="icon-folder-close icon-3x thumbnail" id="minus" style="cursor: pointer; width:40px; height:40px; "></i>
			</li>
		</ul>
	</div>
	<div
		style="height: 55px; display: inline-block; vertical-align: -20px; margin-left: 2px;margin-top:40px text-overflow: ellipsis; white-space: nowrap; width: 15em; overflow: hidden; vertical-align: top;">
		 <b>{{title}}</b><br /> {{description}}
	</div>
	{{/if_equals}}

</div>

</script>

<script id="typeahead-contacts-collection-template" type="text/html">
<div id="contact-typeahead-heading" style="display:none;margin-left:5px"><b>Contacts</b></div>
	<div id="contact-results">
	</div>
<div id="deal-typeahead-heading" style="display:none;margin-left:5px"><b>Deals</b></div>
	<div id="deals-results">
	</div>
<div id="document-typeahead-heading" style="display:none;margin-left:5px"><b>Documents</b></div>	
	<div id="document-results">
	</div>
<div id="case-typeahead-heading" style="display:none;margin-left:5px"><b>Cases</b></div>	
	<div id="case-results">
	</div>
	<div id="typeahead-contacts-model-list"></div>
</script>

<script id="no-permission-template" type="text/html">
<div id="deal_bulk_archive_modal" class="modal hide fade">
<div class="modal-header">
  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
  <h3>Can't access {{entity}}</h3>
</div>
<div class="modal-body">
  <div id="deal-bulk-confirm">
		<i class="fa-exclamation-triangle icon-white"></i> Sorry, you do not have the privileges to access {{entity}}. Please contact your CRM administrator.
	</div>
</div>
<div class="modal-footer">
	<button type="button" class="btn" data-dismiss="modal" aria-hidden="true">Ok</button>
</div>
</div>
</script>
<!-- Add (Documents) Modal views -->
<div class="modal hide fade upload-document-modal" id="uploadDocumentModal">
<style>
.link {
	padding:2% 5% 5% 5%;
	width: 80px;
	margin-bottom: 10px;
	text-align:center;
}
.link > a > i {
	margin-bottom:5px;
} 
.link:hover {
	background-color: #EDEDED;
}
.link > a:hover {
	text-decoration: none;
}
</style>
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3><i class="icon-plus-sign"></i>&nbsp;Add Document</h3>
	</div>
	<div class="modal-body">
		<form id="uploadDocumentForm" name="uploadDocumentForm" method="post">
			<fieldset>
				<div class="row-fluid">
					<div class="control-group">
						<label class="control-label"><b>Title </b><span
							class="field_req">*</span></label>
						<div class="controls">
							<span><input id="name" name="name" type="text"
								class="required" placeholder="Name of Document" /></span>
						</div>
					</div>
					<!-- <div class="control-group span5" style="margin-left: 30px;">
						<label class="control-label"><b>Owner </b><span
							class="field_req">*</span></label>
						<div class="controls" id="owners">
							<select id="owners-list" class="required" name="owner_id"></select>
							<img class="loading-img" src="img/21-0.gif"></img>
						</div>
					</div> -->
				</div>
				<div class="row-fluid" style="margin-bottom: 9px;">
					<input name="extension" id="extension" type="hidden"/>
					<div class="control-group">
						<label class="control-label"><b>Choose Document </b><span
							class="field_req">*</span></label>
						<div class="controls">
						    <input type="hidden" name="url" id="upload_url" class="required"/>
						    <input type="hidden" name="network_type" id="network_type" class="required"/>
						    <div class="span3" style="margin-left:0px!important;">
								<div class="link thumbnail"><i class="icon-ok" style="display:none;float:right;"></i><br/>
									<a href="#" id="S3"><i class="icon-desktop icon-2x" title="Custom"></i><br/><span>My Computer</span></a>
								</div>
							</div>
							<div class="span3" style="margin-left:0px!important;">
								<div class="link thumbnail"><i class="icon-ok" style="display:none;float:right;"></i><br/>
									<a href="#" id="GOOGLE"><i class="icon-google-plus icon-2x" title="Google"></i><br/><span>Google Drive</span></a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="error"></div>
				<div class="control-group">
					<label class="control-label"><b>Related Contacts </b></label>
					<div class="controls" id="contactTypeAhead">
						<div>
							<div class="pull-left">
								<ul name="contact_ids" class="contacts tagsinput tags"></ul>
							</div>
							<input type="text" id="document_relates_to_contacts" name="related_contacts"
								placeholder="Contact Name" class="typeahead typeahead_contacts"
								data-provide="typeahead" data-mode="multiple" />
						</div>
					</div>
				</div>
				<div class="control-group">
					<label class="control-label"><b>Related Deals </b></label>
					<div class="controls" id="dealTypeAhead">
						<div>
							<div class="pull-left">
								<ul name="deal_ids" class="deals tagsinput deal_tags"></ul>
							</div>
							<input type="text" id="document_relates_to_deals" name="related_deals"
								placeholder="Deal Name" class="typeahead typeahead_deals"
								data-provide="typeahead" data-mode="multiple" />
						</div>
					</div>
				</div>
			</fieldset>
		</form>
	</div>
	<div class="modal-footer">
		<a href="#" class="btn btn-primary" id="document_validate">Save</a> <span class="save-status"></span>
	</div>
</div>
<!-- End of Modal views --><!-- Add (Documents) Modal views -->
<div class="modal hide fade upload-document-modal" id="uploadDocumentUpdateModal">
<style>
.link {
	padding:2% 5% 5% 5%;
	width: 80px;
	margin-bottom: 10px;
	text-align:center;
}
.link > a > i {
	margin-bottom:5px;
} 
.link:hover {
	background-color: #EDEDED;
}
.link > a:hover {
	text-decoration: none;
}
</style>
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3><i class="icon-edit"></i>&nbsp;Edit Document</h3>
	</div>
	<div class="modal-body">
		<form id="uploadDocumentUpdateForm" name="uploadDocumentUpdateForm" method="post">
			<fieldset>
				<input name="id" type="hidden"/>
				<input name="extension" id="extension" type="hidden"/>
				<div class="row-fluid">
					<div class="control-group">
						<label class="control-label"><b>Title </b><span
							class="field_req">*</span></label>
						<div class="controls">
							<span><input id="name" name="name" type="text"
								class="required" placeholder="Name of Document" /></span>
						</div>
					</div>
					<!-- <div class="control-group span5" style="margin-left: 30px;">
						<label class="control-label"><b>Owner </b><span
							class="field_req">*</span></label>
						<div class="controls" id="owners">
							<select id="owners-list" class="required" name="owner_id"></select>
							<img class="loading-img" src="img/21-0.gif"></img>
						</div>
					</div> -->
				</div>
				<div class="row-fluid" style="margin-bottom: 9px;">
					<div class="control-group">
						<label class="control-label"><b>Choose Document </b><span
							class="field_req">*</span></label>
						<div class="controls">
						    <input type="hidden" name="url" id="upload_url" class="required"/>
						    <input type="hidden" name="network_type" id="network_type" class="required"/>
						    <div class="span3" style="margin-left:0px!important;">
								<div class="link thumbnail"><i class="icon-ok" style="display:none;float:right;"></i><br/>
									<a href="#" id="S3"><i class="icon-desktop icon-2x" title="Custom"></i><br/><span>My Computer</span></a>
								</div>
							</div>
							<div class="span3" style="margin-left:0px!important;">
								<div class="link thumbnail"><i class="icon-ok" style="display:none;float:right;"></i><br/>
									<a href="#" id="GOOGLE"><i class="icon-google-plus icon-2x" title="Google"></i><br/><span>Google Drive</span></a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="error"></div>
				<div class="control-group">
					<label class="control-label"><b>Related Contacts </b></label>
					<div class="controls" id="contactTypeAhead">
						<div>
							<div class="pull-left">
								<ul name="contact_ids" class="contacts tagsinput tags"></ul>
							</div>
							<input type="text" id="document_relates_to_contacts" name="related_contacts"
								placeholder="Contact Name" class="typeahead typeahead_contacts"
								data-provide="typeahead" data-mode="multiple" />
						</div>
					</div>
				</div>
				<div class="control-group">
					<label class="control-label"><b>Related Deals </b></label>
					<div class="controls" id="dealTypeAhead">
						<div>
							<div class="pull-left">
								<ul name="deal_ids" class="deals tagsinput deal_tags"></ul>
							</div>
							<input type="text" id="document_relates_to_deals" name="related_deals"
								placeholder="Deal Name" class="typeahead typeahead_deals"
								data-provide="typeahead" data-mode="multiple" />
						</div>
					</div>
				</div>
			</fieldset>
		</form>
	</div>
	<div class="modal-footer">
		<a href="#" class="btn btn-primary" id="document_update_validate">Save
			Changes</a> <span class="save-status"></span>
	</div>
</div>
<!-- End of Modal views --><!-- Add (Voice Mail) Modal views -->
<div class="modal hide fade voice-mail-modal" id="uploadVoiceMailModal">
	<div class="modal-header">
		<button class="close" data-dismiss="modal">x</button>
		<h3><i class="icon-plus-sign"></i>&nbsp;Add Voicemail</h3>
	</div>
	<div class="modal-body">
		<form id="uploadVoiceMaiForm" name="uploadVoiceMaiForm" method="post">
			<fieldset>
				<div class="row-fluid">
					<div class="control-group">
						<label class="control-label"><b>Title </b><span
							class="field_req">*</span></label>
						<div class="controls">
							<span><input id="name" name="name" type="text"
								class="required" placeholder="Name of Voicemail" required/></span>
						</div>
					</div>
				</div>
				<div class="row-fluid" style="margin-bottom: 9px;">
					<input name="extension" id="extension" type="hidden"/>
					<div class="control-group">
						<label class="control-label"><b>Voice File</b><span
							class="field_req">*</span></label>
						<div class="controls">
						    <input type="hidden" name="url" id="upload_url" class="required"/>
						    <input type="hidden" name="network_type" id="network_type" class="required"/>
							<div class="span3" style="margin-left:0px!important;">							
							<div class="addFileLink">
							<a href="#" id="S3"><i class="icon-plus-sign"></i> <span>Add File</span></a>
							</div>
							</div>
						</div>
					</div>
				</div>
				<div id="error"></div>
			</fieldset>
		</form>
	</div>
	<div class="modal-footer">
		<a href="#" class="btn btn-primary" id="voicemail_validate">Save</a> <span class="save-status"></span>
	</div>
</div>
<!-- End of Modal views --><script id="warning-template" type="text/html">
<div id="warning-deletion" class="modal hide">
    <div class="modal-header warning-header" style="background-color:#DA4F49">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3 font-color="background-color:black">Make sure you want to do this</h3>
    </div>
    <div class="modal-body" style="padding:0px">
        <div class="warning-dangerzone">
            <p>
                This is extremely important. If you don't read this, unexpected bad things will most definitely occur.
            </p>
        </div>
        <ul style="padding:10px">
            <li>This action cannot be UNDONE.</li>
            <li>
                Data you used 
                <ul>
                    <li>Data : {{bytes}}</li>
                    <li>Entities : {{entities}}</li>
                </ul>
            </li>
            <li>All data will be DELETED.</li>
        </ul>
    </div>
    <div class="modal-footer">
        <a href="#" class="btn" data-dismiss="modal">Close</a>
        <a href="#" id="confirm-delete-account" class="btn btn-danger ">Delete Account</a>
    </div>
</div>
</script>

<script id="warning-feedback-template" type="text/html">
<div id="warning-deletion-feedback" class="modal hide">
    <div class="modal-header warning-header" style="background-color:#DA4F49">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3 font-color="background-color:black">Make sure you want to do this</h3>
    </div>
    <div class="modal-body">
            <p>
			   <b>Sorry to see you go. Please tell us why?</b>
            </p>
		<form id="cancelation-feedback-form">
       		<ul style="list-style-type:none;">
            	<li style="padding-bottom:4px">
					<label for="Did not like it" style="display:inline">
						<input type="radio" name="cancellation_reason" value="No need"  style="display:inline"/>
				        Was just checking it out. Don't need it.</label>
           		</li>
				<li style="padding-bottom:4px">
						<input type="radio" name="cancellation_reason" value="Overkill" style="display:inline"/>
				        <label for="Overwhelming" style="display:inline">Overwhelming for me</label>
            	</li>
				<li style="padding-bottom:4px">
						<input type="radio" name="cancellation_reason" value="Hard to use"  style="display:inline"/>
				        <label for="Hard to use" style="display:inline">Hard to use</label>
            	</li>
				<li style="padding-bottom:4px">
						<input type="radio" name="cancellation_reason" value="Costly" style="display:inline"/>
				        <label for="Expensive for me" style="display:inline">Expensive for me</label>
            	</li>
				<li style="padding-bottom:4px">
						<input type="radio" name="cancellation_reason" class="extra_info" value="No fit" style="display:inline"/>
				        <label for="No fit" style="display:inline">Doesn't meet my requirements</label>
            	</li>
				<li style="padding-bottom:4px">
						<input type="radio" name="cancellation_reason" value="Other"  checked="checked" class="extra_info" style="display:inline"/>
				        <label for="Other" style="display:inline">Other</label>
            	</li>
        	</ul>
			<div style="padding-left:5%" class="controls">
				<textarea name="account_delete_reason" class="required span4" id="account_delete_reason" rows="6" placeholder="Please give us more details. This will help us a lot."></textarea>
    		</div>
		</form>
	</div>
    <div class="modal-footer">
        <a href="#" class="btn" data-dismiss="modal">Cancel</a>
        <a href="#" id="warning-feedback-save" class="btn btn-danger ">Delete Account</a>
    </div>
</div>
</script>

<script id="send-cancellation-request-template" type="text/html">
<div id="send-cancellation" class="modal hide">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3>Request for cancellation</h3>
    </div>
    <div class="modal-body">
            <p>
			   <b>Sorry to see you go. Please tell us why?</b>
            </p>
		<form id="cancelation-request-form">
			<div class="controls">
				<textarea name="account_cancel_reason" class="required span4" id="account_cancel_reason" rows="3" placeholder="Please give us more details. This will help us a lot."></textarea>
    		</div>
		</form>
	</div>
    <div class="modal-footer">
        <!-- <a href="#" class="btn" data-dismiss="modal">Cancel</a> -->
        <a href="#" id="send-delete-request" class="btn btn-primary ">Send Request</a>
    </div>
</div>
</script>
<script id="welcome-modal-template" type="text/html">
<div id="agileWelcomeModal" class="modal hide"
	style="width: auto !important;">
	<div class="modal-header welcome-header">
		<button type="button" class="close" data-dismiss="modal"
			aria-hidden="true">&times;</button>
		<h3>Take the tour - Your new AgileCRM</h3>
	</div>
	<div class="modal-body" style="padding:20px;width:560px;heigth:450px;">
			<h3>Set up API on your website</h3>
			To start collecting your contacts from website and track them,<br/> you can
			the API JavaScript to your web pages and use the API <br/>calls where
			needed. Check it in Admin Settings option.<br/><br/>
		<div id="1">
			<h3>Add or Import contacts</h3>
			You can also add contacts manually from the Contacts tab.<br/> You can
			also try importing them.
		</div>
		<div id="2">
			<h3>Run Campaigns</h3>
			Create and run automated campaigns on your contacts.<br/>You can
			<create campaigns> with easy drag & drop interface. 
		</div>
		<div id="3">
			<h3>Manage your activities</h3>
			With Events and Tasks, organize and keep track of your work easily.
			Need to call a contact? <br/>Add a task. To scheduel a meeting, create an event
		</div>
		<div id="4">
			<h3>Track sales opportunities</h3>
			Create Deals for sales opportunities you want to track. <br/>Define
			milestores for detals and manage your sales funnel.
		</div>
		<div id="5">
			<h3>Customize Reports</h3>
			Add reports to improve customer retention strategies.<br/>
		</div>


		<!--<img src="" id="1" /> <img src="" id="2" /> <img src="" id="3" /> <img src="" id="4" />-->
	</div>
	<div class="modal-footer">
		<span id="welcome_screen_number" style="margin-right: 10px;">1
			of 4</span> <a href="#" onclick="return false;" class="btn"
			id="welcome_screen_prev_link">Previous</a> <a href="#"
			onclick="return false;" class="btn" id="welcome_screen_next_link">Next</a>
		<a href="#" class="btn btn-primary" data-dismiss="modal"
			id="welcome_screen_close_link">Close</a>
	</div>
</div>
</script>
