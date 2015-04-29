<script id="deal-detail-activities-collection-template" type="text/html">
{{#unless this.length}}
        <div class="slate">
            <div class="slate-content">
                <div class="box-left">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right">
                    <h3>No activity on this deal yet.</h3>
                </div>
            </div>
        </div>
 {{/unless}}

{{#if this.length}}
<div class="page-header" style="margin-top: 0px !important;border-bottom: 0px;"></div>
<section class="scroll">
	<ul id="deal-detail-activities-model-list" class="ativity-block-ul" style="margin:0px;"></ul>
</section>
{{/if}}
</script>

<script id="deal-detail-activities-model-template" type="text/html">
<div style="display:block;" class="activity">

<div class="activity-text-block">
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
<span class="owner-name">{{#if user}} {{user.name}} {{else}} {{#getCurrentUserPrefs}}{{currentDomainUserName}}{{/getCurrentUserPrefs}} {{/if}}</span>
		
	</span>
	<h4><a style="text-decoration: none"><b>{{get_normal_activity_type activity_type}}</b></a></h4><br/>
	<div style="background:none;border:none;">
{{#if_equals "DEAL_ADD" activity_type}}
        <pre style="background-color:#fff;border:none;font-family:'PT Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;">Deal created for {{custom1}} ({{currencySymbol}}{{numberWithCommas entityObject.expected_value}}, {{entityObject.probability}}%). </pre>
     {{/if_equals}}

{{#if_equals "DEAL_EDIT" activity_type}}
        <pre style="background-color:#fff;border:none;font-family:'PT Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;">{{displayActivityFieldText custom3}} modified. </pre>
     {{/if_equals}}

{{#if_equals "DEAL_CLOSE" activity_type}}
        <pre style="background-color:#fff;border:none;font-family:'PT Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;">Hurray. {{entityObject.owner.name}} has won deal worth {{currencySymbol}}{{numberWithCommas entityObject.expected_value}}. </pre>
     {{/if_equals}}
{{#if_equals "DEAL_LOST" activity_type}}
        <pre style="background-color:#fff;border:none;font-family:'PT Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;">Alas. {{entityObject.owner.name}} has lost the deal worth {{currencySymbol}}{{numberWithCommas entityObject.expected_value}}.</pre>
     {{/if_equals}}

{{#if_equals "DEAL_MILESTONE_CHANGE" activity_type}}
        <pre style="background-color:#fff;border:none;font-family:'PT Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;">Milestone changed from {{custom2}} to {{custom1}}. </pre>
     {{/if_equals}}

{{#if_equals "DEAL_OWNER_CHANGE" activity_type}}
        <pre style="background-color:#fff;border:none;font-family:'PT Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;">Owner changed from {{custom2}} to {{custom1}}. </pre>
     {{/if_equals}}

{{#if_equals "DEAL_RELATED_CONTACTS" activity_type}}
         {{#if related_contact_ids}}
{{#if_equals "removed_all_relatedcontacts" custom3}}
<pre style="background-color:#fff;border:none;font-family:'PT Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;">{{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}}<a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}} removed from deal.</pre>
{{/if_equals}} 
{{#if_equals "removed_relatedcontacts" custom3}}
<pre style="background-color:#fff;border:none;font-family:'PT Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;">{{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}}<a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}} removed from deal.</pre>
{{/if_equals}} 
{{#if_equals "added_relatedcontacts" custom3}}
<pre style="background-color:#fff;border:none;font-family:'PT Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;">{{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}}<a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}} added to deal.</pre>  
{{/if_equals}}
{{else}}
Modified deal.   

{{/if}} 
     {{/if_equals}}

{{#if_equals "NOTE_ADD" activity_type}}
        <pre style="background-color:#fff;border:none;font-family:'PT Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;">{{custom1}}<br/>{{custom2}}. </pre>
     {{/if_equals}}
		
	</div>	
<div class="clearfix"></div>
	 	<div class="clear">
		
		<small class="edit-hover" style="margin-right:10px"> 
			<time  datetime="{{epochToHumanDate "" time}}" style="border-bottom:dotted 1px #999" title="{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" time}}">{{epochToHumanDate "dd mmm yyyy" time}}</time>
		</small>

	</div>
</div>
</div>
</script><script id="deal-docs-collection-template" type="text/html">
{{#unless this.length}}
        <div class="slate">
            <div class="slate-content">
                <div class="box-left">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right">
                    <h3>You have no documents for this Deal.</h3>
					{{#hasMenuScope 'DOCUMENT'}}
                    <div class="text">
                        You can add a document related to a Deal.
                    </div>
					<div><a href="#" class="add-deal-document-select"><i class='icon-plus-sign'/></i> Add Document</a>
						<span class="deal-document-select" style="display:none;">
							<select id="document-select" style="margin-bottom: -1px;">
								<option value="">Select...</option>
							</select>
                    		<a href="#" class="btn add-deal-document-confirm">Add</a> 
                   			<a href="#" class="btn add-deal-document-cancel">Cancel</a>
							<span class="save-status"></span>
						</span>
					</div>
					{{/hasMenuScope}}
         			<!--<div class="btn-group" style="margin-top:12px;">
        				<a href="#" class="btn right deal-add-document"><i class="icon-plus-sign"></i> Add Document</a>
        				<a class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
						<ul class="dropdown-menu" style="text-shadow:0px 0px;">
							<li><a href="#" class="document-exist">Existing Document</a></li>
						</ul>
					</div>-->
                </div>
            </div>
        </div>
        {{/unless}}
        {{#if this.length}}
	<div class="page-header" style="margin-top: 0px !important">
        <!--<div class="btn-group right">
        	<a href="#" class="btn right deal-add-document"><i class="icon-plus-sign"></i> Add Document</a>
        	<a class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
			<ul class="dropdown-menu pull-right">
				<li><a href="#" class="document-exist">Existing Document</a></li>
			</ul>
		</div>-->
		{{#hasMenuScope 'DOCUMENT'}}
		<div class="right"><a href="#" class="add-deal-document-select"><i class='icon-plus-sign'/></i> Add Document</a>
			<span class="deal-document-select" style="display:none;">
				<select id="document-select" style="margin-bottom: -1px;">
					<option value="">Select...</option>
				</select>
                <a href="#" class="btn add-deal-document-confirm">Add</a> 
                <a href="#" class="btn add-deal-document-cancel">Cancel</a>
				<span class="save-status"></span>
			</span>
		</div>
		{{/hasMenuScope}}
	</div>
			<ul id="deal-docs-model-list" class="ativity-block-ul"></ul>
		{{/if}} 
</script>
<script id="deal-docs-model-template" type="text/html">
<div class="activity" style="display:block;">
	<div class="activity-text-block">
	<span class="activity-block-owner">
		{{#if ownerPic}}
			<img class="user-img thumbnail" width="40" height="40" alt="" src="{{ownerPic}}" >
		{{else}}
			<img class="user-img thumbnail" width="40" height="40" src="{{defaultGravatarurl 40}}">
		{{/if}}
		<span class="owner-name">{{owner.name}}</span>
	</span>
	<div style="margin-bottom: 9px;"><h4 class="document-title" style="display:inline;"><b style="margin:0px 20px 20px 0px;">{{name}}</b></h4></div>

  <div style="">

	<p>
		{{network network_type}}&nbsp;&nbsp;<a href="{{url}}" target="_blank"><i class="icon-external-link" title="Open Document"></i></a>
	</p>
	<div class="clear">
		<div style="margin-bottom: 9px;">
		{{#each contacts}}
           	{{#if id}}
						{{#if_contact_type "PERSON"}}	
							<a href="#contact/{{id}}">{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}</a>,
        				{{/if_contact_type}}
						{{#if_contact_type "COMPANY"}}
        					<a href="#contact/{{id}}">{{getPropertyValue properties "name"}}</a>,
        				{{/if_contact_type}}
           		
           	{{/if}}
       	{{/each}}
		{{{getDealNames deals}}}
		</div>
		 <small class="edit-hover" style="margin-right:10px"> 
			<time class="document-created-time" datetime="{{epochToHumanDate "" uploaded_time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" uploaded_time}}</time>
		</small>
		{{#hasMenuScope 'DOCUMENT'}}
		<span class="actions pull-right">
			<a title="Edit"  data="{{id}}" class="document-edit-deal-tab" style="cursor:pointer;text-decoration: none;padding-right:10px"> <i class="icon-pencil"></i> </a>
			<a title="Detach"  data="{{id}}" class="document-unlink-deal-tab" style="cursor:pointer;text-decoration: none;padding-right:10px"> <i class="icon-unlink"></i> </a>
            <!--<a title="Delete" style="cursor:pointer;text-decoration: none"><span class="activity-delete icon-trash" style="display:inline" id="{{id}}" url="core/api/documents/bulk"><i></i></span></a>-->
        </span>
		{{/hasMenuScope}}
	</div>
  </div>
</div>
</div>
</script>
<script id="deal-detail-edit-template" type="text/html">
<div class="row">
    <div class="container well opportunityEdit span8">
        <form id="opportunityEditForm" name="opportunityEditForm" method="post">
			<fieldset>
				<input name="id" type="hidden"/>
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
						<label class="control-label"><b>Track </b><span
							class="field_req">*</span></label>
						<div class="controls">
							<span><select id="pipeline" name="pipeline_id"
								class="required">
									<option value="">Select..</option>
							</select></span><img class="loading-img" src="img/21-0.gif"></img>
						</div>
					</div>
					<div class="control-group span5" style="margin-left: 30px;">
						<label class="control-label"><b>Milestone </b><span
							class="field_req">*</span></label>
						<div class="controls">
							<span><select id="milestone" name="milestone"
								class="required">
									<option value="">Select..</option>
							</select></span><img class="loading-img" src="img/21-0.gif"></img>
						</div>
					</div>
				</div>
				<div class="row-fluid">
					<div class="control-group span5">
						<label class="control-label"><b>Close Date </b></label>
						<div class="controls">
							<span><input id="close_date" type="text" name="close_date"
								class="input date" placeholder="MM/DD/YY" /></span>
						</div>
					</div>
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
				<div id="custom-field-deals">
				</div>
				<div class="control-group">
					<label class="control-label"><b>Description </b></label>
					<div class="controls">
						<textarea id="description" name="description" rows="3"
							class="input" placeholder="Add Comment"></textarea>
					</div>
				</div>
			
			</fieldset>
		</form>
	</div>
	<div class="form-actons">
		<a href="#" class="btn btn-primary" id="opportunity_validate_form">Save
			Changes</a> <span class="save-status"></span>
	</div>
    </div>
    <!-- End of Modal views -->
</div>
</script>
html><script id="deal-notes-collection-template" type="text/html">
{{#unless this.length}}
        <div class="slate">
            <div class="slate-content">
                <div class="box-left">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right">
                    <h3>You have no notes for this Deal.</h3>
                    <div class="text">
                        You can save specific information about Deals as a Note.
                    </div>
                    <a href="#deal-note-modal1" data-toggle="modal" class="btn blue btn-slate-action deal-note"><i class="icon-plus-sign"></i>  Add Note</a>
                </div>
            </div>
        </div>
        {{/unless}}
{{#if this.length}}
<div class="page-header" style="margin-top: 0px !important">
   <a href="#deal-note-modal1" data-toggle="modal" class="btn right deal-note" style="position:relative"><span><i class='icon-plus-sign'/></span> Add Note</a> 
</div>
	<ul id="deal-notes-model-list" class="ativity-block-ul"></ul>
{{/if}}
</script>
<script id="deal-notes-model-template" type="text/html">
<div style="display:block;" class="activity">

<div class="activity-text-block">
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
	<br/>
	<div style="background:none;border:none;">
		<pre style="background-color:#fff;border:none;font-family:'PT Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;">{{show_link_in_statement description}}</pre>
	</div>	
	 	<div class="clear">
		<div style="margin-bottom: 9px;">	
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
<a title="Edit"  data="{{id}}" data-toggle="modal" class="deal-edit-note" style="cursor:pointer;text-decoration: none;padding-right:10px"> <i class="icon-pencil"></i> </a>
            <a title="Delete" style="cursor:pointer;text-decoration: none"><span class="activity-delete icon-trash" style="display:inline" id="{{id}}" url="core/api/contacts/notes/bulk"></span></a>
        </span>
	</div>
</div>
</div>
</script>
<script id="deal-related-model-template" type="text/html">
	<td></td>
	<td class="data" data="{{id}}" style="white-space:nowrap;">
    	<div style="display:inline;padding-right:10px;height:auto;">
{{#if_equals type "PERSON"}}        		
<img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" width="40px" height="40px" style="display:inline; width:40px; height:40px; " />
{{else}}
<img class="thumbnail" {{getCompanyImage "40" "display:inline;"}} width="40px" height="40px" style="display:inline; width:40px; height:40px; "  title="{{getPropertyValue properties "name"}}"/>
{{/if_equals}}    	
</div>
    	<div style="height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;width:12em;overflow:hidden;">
        		<b>	{{getPropertyValue properties "first_name"}}
        		{{getPropertyValue properties "last_name"}} </b>
        		<b>{{getPropertyValue properties "name"}}</b>
    	</div>
	</td>
	
<td style="width:6em;"><div>{{#if_equals type "PERSON"}}Contact {{else}} Company{{/if_equals}}</div></td>
<td style="width:6em;"><div>{{lead_score}}</div></td>

	<td style="width:6em;"><div>{{getPropertyValue properties "phone"}}</div></td>
	
</script>

<script id="deal-related-collection-template" type="text/html">

{{#if this.length}}
	<div style='height:30px'>
		<a href="#" class="deal-add-contact btn right" style="position:relative;margin-bottom:10px;">
			<span><i class="icon-plus-sign"></i></span> Add Contact
		</a>
	</div>
	<br/>
		
			<table id="contacts" class="table table-striped agile-ellipsis-dynamic onlySorting" style="overflow: scroll; border-radius: 5px; -webkit-border-radius: 5px; margin-bottom:0px; border: 1px solid #dddddd; border-collapse: separate;">
				<colgroup><col width="10px"><col width="40%"><col width="20%"><col width="25%"><col width="12%"></colgroup>
				<thead>
					<tr><th></th>
						<th>Name</th>
						<th>Type</th>
						<th>Score</th>
						<th>Phone</th>
					</tr>
				</thead>
				<tbody id="deal-related-model-list" class="deal-related-model-list agile-edit-row"
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
                    	<h3>Deal is not associated with any person/contact. </h3>
                    	<div class="text">
							All Contacts which are related to this deal are shown here.
							<br/>
							<a href="#" class="deal-add-contact btn left" style="margin-top:10px; margin-bottom:10px;">
								<i class="icon-plus-sign"></i> Add Contact
							</a>
                    	</div>
                	</div>
            	</div>
        	</div>
		{{/if}}
</script>
<!-- previous next actions -->

<!-- ending previous next actions -->
<!--  header span12 row view starting -->
<script id="deal-detail-template" type="text/html">
<div class="row">
	<div class="span12">
		<div style="margin-bottom: 20px; margin-top:25px;"">
			<div class="row-fluid"
				style="border-bottom: 1px solid #ddd; padding-bottom: 20px;">
				<div>
					<div>
						<div class="span10 ">

						<div class="contact-profile-name mg-r-md" style="margin-bottom:-10px;">{{#if name}}{{name}}{{/if}}{{#if this.archived}}&nbsp;&nbsp;<span style="position: relative;top: -2px;cursor: default;" class="deal-task-type label label-default" >Archived</span>{{else}}
						
						
						{{#if_equals milestone "Won"}} <span style="position: relative;top: -2px;cursor: default;" class="deal-task-type label label-success">{{milestone}}</span>
{{else}}
{{#if_equals milestone "Lost"}} <span style="position: relative;top: -2px;cursor: default;" class="deal-task-type label label-important">{{milestone}}</span>
{{else}}
<span style="position: relative;top: -2px;cursor: default;" class="deal-task-type label label-default">{{milestone}}</span>
{{/if_equals}}
{{/if_equals}} 
{{#getTracksCount}}<span style="position: relative;top: -2px;cursor: default;" class="deal-task-type label label-default" >{{pipeline.name}}</span>{{/getTracksCount}}
						
						{{/if}} </div><br/>
<div style="margin-bottom:4px;"> <span class="contact-profile-name mg-r-md" style="vertical-align:top;">{{currencySymbol}}{{numberWithCommas expected_value}}</span> <span style="margin-left:-14px;color: grey;">({{probability}}%)</span></div>
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
 {{#if this.archived}}
<div class="span2">
<div style="width:100%;position:relative;">
<div class="contact-navigation-view"><span class="navigation  contact-switching"></span></div></div>
<div class="clearfix"></div>
							

<div class="btn-group right">
								
								<a href="#" class="deal-restore-detail-view btn"  style="border-radius: 4px 4px 4px 4px!important;margin-left: 6px;" ><i class="icon-mail-reply"></i> Restore</a>
								
							</div>

						<div style="position:relative;">	
							<div  class="deal-owner-position deal-owner-block">
						<div class="change-owner-succes"></div>
     <span title="Owner" class="contact-owner-view">
      	<span class="contact-owner" id="change-owner-element">
        	<span class="contact-owner-text">Owner:&nbsp;&nbsp;</span>
			{{#if owner}}
        	<span class="contact-owner-pic" style="margin-top:10px;"><img class="user-img"  alt="" src="{{defaultGravatarurl 40}}" /></span>
			{{else}}
			<span class="contact-owner-pic" style="margin-top:19px;"><img class="user-img"  alt="" src="{{defaultGravatarurl 40}}" /></span>
 			{{/if}}
        	<span  data={{owner.id}} class="deal-owner-name contact-owner-name" style="cursor: default;">{{owner.name}}</span>
        
        	
       </span>
    </span>
					</div>

</div><!-- position relative if condition -->
                        </div>



{{else}}                       
<div class="span2">
<div style="width:100%;position:relative;">
<div class="contact-navigation-view"><span class="navigation  contact-switching"></span></div></div>
<div class="clearfix"></div>
							

<div class="btn-group right">
								
								<a href="#" class="deal-detail-edit-deal btn" id="deal_details" style="border-radius: 4px 0px 0px 4px!important;margin-left: 6px;" ><i class="icon-edit"></i> Edit</a>
								<a class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
								<ul class="dropdown-menu pull-right">

									<li><a href='#'  id="dealshow-note" class="deal-note"><i
											class="icon-file"></i> Add Note</a></li>
                                    <li><a href='#'  id="dealdetail-archive" class="deal-detail-archive"><i class="icon-archive"></i> Archive</a></li>
							
									<li><a href='#'  data="{{id}}" class="deal_detail_delete" id='opportunity-actions-delete'><i
											class="icon-trash"></i> Delete</a></li>
								</ul>
							</div>

						<div style="position:relative;">	
							<div  class="deal-owner-position deal-owner-block">
						<div class="change-owner-succes"></div>
     <span title="Owner" class="contact-owner-view">
      	<span class="contact-owner" id="change-owner-element">
        	<span class="contact-owner-text">Owner:&nbsp;&nbsp;</span>
			{{#if owner}}
        	<span class="contact-owner-pic" style="margin-top:10px;"><img class="user-img"  alt="" src="{{defaultGravatarurl 40}}" /></span>
			{{else}}
			<span class="contact-owner-pic" style="margin-top:19px;"><img class="user-img"  alt="" src="{{defaultGravatarurl 40}}" /></span>
 			{{/if}}
        	<span id="deal-owner" data={{owner.id}} class="deal-owner-name contact-owner-name">{{owner.name}}</span>
        
        	<div class="btn-group" id="change-deal-owner-ul" style="vertical-align: middle; display: none">
        		 <a class="btn dropdown-toggle" data-toggle="dropdown">Change Owner <span class="caret"></span></a>
        		 <ul id='deal-detail-owner' class="dropdown-menu pull-right"></ul>
        	</div> 
       </span>
    </span>
					</div>

</div><!-- position relative -->
                        </div>
{{/if}}
						</div>
					</div>
				</div>
			</div>
		</div>
<div class="clearfix"></div>
	</div>

	



<!--  ending top header span12 view -->

<!--  starting middle view row -->
<div class="row">
	<!--  starting time line view -->
	  <div class="span9">
        <div id="deal-details">
           <ul class="nav nav-tabs" id="deal-details-tab">
             <li><a href="#dealactivities" data-toggle="tab" >Activity</a></li>
             <li><a href="#dealnotes" data-toggle="tab" >Notes</a></li>
			<li><a href="#dealdocs" data-toggle="tab">Documents</a></li>
            <li><a href="#dealrelated" data-toggle="tab">Related</a></li>
           
            
            </ul>
        </div>
           <div class="tab-content" id="deal-tab-content">
           <div class="tab-pane " id="dealactivities"></div>
           <div class="tab-pane " id="dealnotes"></div>
			<div class="tab-pane " id="dealdocs"></div>
           <div class="tab-pane " id="dealrelated"></div>
          
          </div>
	</div>
{{#if custom_data}}
<div class="span3 contact-right-widgetsview" style="padding-left:17px;box-sizing:border-box;border-left:1px solid #ddd;min-height: 200px;">
			

						<div style='padding-top: 10px'>
						
							
							<div  style="margin-top:3px;">
								
								<div style="padding-right:0px!important;font-size:13px;line-height:20px;">
								<div class="pull-left" style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width: 18em;margin-top:-15px;font-size: 16px;">
								<i class="icon icon-info" style="font-size: 13px;margin-left:4px;"></i>Custom Data
									
							</div>	
                           {{/if}}

<div class="deal-custom-data"> 
								
					<div class="contact-custom-icon pull-left" style="width:25px;"></div>			
								<div class="pull-left" style="width:90%;line-height:21px;">
									
									{{#if custom_data}}
									{{#getDealCustomProperties custom_data}}
									{{#each_with_index this}}


                                            <span class="contact-custom-name">
												<span style="color: gray" title="{{name}}">{{name}}</span>
											</span>

										
											<span class="contact-custom-value">
											<span class="note-created-time" title="{{value}}">{{value}}</span>
                                             </span><br/> 
										{{/each_with_index}}
									{{/getDealCustomProperties}}
                                    {{/if}}
											
                               <div class="clearfix"></div>
                            </div>	

						
					</div>
					</div>
					</div>
					</div>
					</div>
					</div>
					



<!--  ending mid  right panel view -->

<!--  ending middle view row -->

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
<!-- End of Archive confirmation-->

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
<!-- End of Restore confirmation-->
</script>
</html>