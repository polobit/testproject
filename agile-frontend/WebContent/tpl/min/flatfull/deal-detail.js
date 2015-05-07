<script id="deal-detail-activities-collection-template" type="text/html">
{{#unless this.length}}
        <div class="wrapper p-t-none">
            <div class="slate-content">
                <div class="box-left pull-left m-r-md">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right pull-left">
                    <h4 class="m-t-none">No activity on this deal yet.</h4>
                </div>
				<div class="clearfix">
				</div>
            </div>
        </div>
 {{/unless}}

{{#if this.length}}
<div class="m-t-none b-b-none"></div>
<section class="scroll">
	<ul id="deal-detail-activities-model-list" class="ativity-block-ul list-group list-group-lg m-b-none"></ul>
</section>
{{/if}}
</script>

<script id="deal-detail-activities-model-template" type="text/html">
<div  class="activity block pos-rlt">
<div class="thumb-xs pull-left m-r-sm b-light b avatar">
		{{#if user}}
			{{#if userPic}}
				<img class="user-img r r-2x"  alt="" src="{{userPic}}" >
			{{else}}
				<img class="user-img r r-2x"  alt="" src="{{defaultGravatarurl 40}}" >
			{{/if}}
		{{else}}
			<img class="user-img r r-2x"  alt="" src="{{#getCurrentUserPrefs}}{{#if pic}}{{pic}}{{else}}{{defaultGravatarurl 40}}{{/if}}{{/getCurrentUserPrefs}}" >
		{{/if}}
<span class="owner-name hide">{{#if user}} {{user.name}} {{else}} {{#getCurrentUserPrefs}}{{currentDomainUserName}}{{/getCurrentUserPrefs}} {{/if}}</span>
		
	</div>
<div class="pull-left rightThumbView pos-rlt">	
<div class="pull-left contact-title-dynamic">
   <a class="text-md text-cap custom-color">{{get_normal_activity_type activity_type}}</a>
   </div>
   <div class="pull-right ">
   	<small class="edit-hover text-muted"> 
			<i class="fa fa-clock-o m-r-xs"></i>
			<time  datetime="{{epochToHumanDate "" time}}"  title="{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" time}}">{{epochToHumanDate "dd mmm yyyy" time}}</time>
		</small>
		</div>
		<div class="clearfix"></div>
	<div>
{{#if_equals "DEAL_ADD" activity_type}}
        <div>Deal created for {{custom1}} ({{currencySymbol}}{{numberWithCommas entityObject.expected_value}}, {{entityObject.probability}}%). </div>
     {{/if_equals}}

{{#if_equals "DEAL_EDIT" activity_type}}
        <div>{{displayActivityFieldText custom3}} modified.</div>
     {{/if_equals}}

{{#if_equals "DEAL_CLOSE" activity_type}}
       <div>Hurray. {{entityObject.owner.name}} has won deal worth {{currencySymbol}}{{numberWithCommas entityObject.expected_value}}. </div>
     {{/if_equals}}
{{#if_equals "DEAL_LOST" activity_type}}
        <div>Alas. {{entityObject.owner.name}} has lost the deal worth {{currencySymbol}}{{numberWithCommas entityObject.expected_value}}.</div>
     {{/if_equals}}

{{#if_equals "DEAL_MILESTONE_CHANGE" activity_type}}
        <div>Milestone changed from {{custom2}} to {{custom1}}. </div>
     {{/if_equals}}

{{#if_equals "DEAL_OWNER_CHANGE" activity_type}}
        <div>Owner changed from {{custom2}} to {{custom1}}. </div>
     {{/if_equals}}

{{#if_equals "DEAL_RELATED_CONTACTS" activity_type}}
         {{#if related_contact_ids}}
{{#if_equals "removed_all_relatedcontacts" custom3}}
<div>{{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}}<a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}} removed from deal. </div>
{{/if_equals}} 
{{#if_equals "removed_relatedcontacts" custom3}}
<div>{{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}}<a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}} removed from deal. </div>
{{/if_equals}} 
{{#if_equals "added_relatedcontacts" custom3}}
<div>{{#stringToJSON this "related_contact_ids"}}{{#toLinkTrigger this}}<a href="#contact/{{this.contactid}}">{{this.contactname}}</a>{{/toLinkTrigger}}{{/stringToJSON}} added to deal. </div> 
{{/if_equals}}
{{else}}
Modified deal.   

{{/if}} 
     {{/if_equals}}

{{#if_equals "NOTE_ADD" activity_type}}
        <div>{{custom1}}<br/>{{custom2}}.  </div>
     {{/if_equals}}
		
	</div>	
<div class="clearfix"></div>
	 

</div>
<div class="clearfix"></div>
</div>
</script><script id="deal-docs-collection-template" type="text/html">
{{#unless this.length}}
        <div class="wrapper p-t-none">
            <div class="slate-content">
                <div class="box-left pull-left m-r-md">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right pull-left">
                    <h4 class="m-t-none">You have no documents for this Deal.</h4>
					{{#hasMenuScope 'DOCUMENT'}}
                    <div class="text">
                        You can add a document related to a Deal.
                    </div>
					<div><a href="#" class="btn btn-default btn-sm add-deal-document-select"><i class='icon-plus-sign'/></i> Add Document</a>
						<span class="deal-document-select" style="display:none;">
							<select class="form-control m-b-sm" id="document-select">
								<option value="">Select...</option>
							</select>
                    		<a href="#" class="btn btn-primary btn-sm add-deal-document-confirm">Add</a> 
                   			<a href="#" class="btn btn-default btn-sm add-deal-document-cancel">Cancel</a>
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
                <div class="clearfix"></div>
            </div>
        </div>
        {{/unless}}
        {{#if this.length}}
	<div  class="m-b-md m-t-md m-r-sm" align="right">
        <!--<div class="btn-group right">
        	<a href="#" class="btn btn-sm btn-default btn-addon  deal-add-document"><i class="icon-plus-sign"></i> Add Document</a>
        	<a class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
			<ul class="dropdown-menu pull-right">
				<li><a href="#" class="document-exist">Existing Document</a></li>
			</ul>
		</div>-->
		{{#hasMenuScope 'DOCUMENT'}}
		<div><a href="#" class="btn btn-sm btn-default btn-addon add-deal-document-select"><i class='icon-plus-sign'/></i> Add Document</a>
			<span class="deal-document-select" style="display:none;">
				<select class="form-control w-xl m-r-sm p-t-xs inline-block" id="document-select">
					<option value="">Select...</option>
				</select>
                <a href="#" class="btn btn-sm btn-primary add-deal-document-confirm">Add</a> 
                <a href="#" class="btn btn-default btn-sm add-deal-document-cancel">Cancel</a>
				<span class="save-status"></span>
			</span>
		</div>
		{{/hasMenuScope}}
	</div>
			<ul id="deal-docs-model-list" class="ativity-block-ul list-group list-group-lg m-b-none""></ul>
		{{/if}} 
</script>
<script id="deal-docs-model-template" type="text/html">
<div class="activity block pos-rlt">
	
	<div class="activity-block-owner thumb-xs pull-left m-r-sm b-light b avatar">
		{{#if ownerPic}}
			<img class="user-img r r-2x" alt="" src="{{ownerPic}}" >
		{{else}}
			<img class="user-img r r-2x"  src="{{defaultGravatarurl 40}}">
		{{/if}}
		<span class="owner-name hide">{{owner.name}}</span>
	</div>
<div class="pull-left rightThumbView pos-rlt">
<div class="pull-left contact-title-dynamic">
<a class="document-title text-md text-cap custom-color">{{name}}</a>
</div>
<div class="pull-right">
 <small class="edit-hover text-muted"> 
			<i class="fa fa-clock-o m-r-xs"></i>
			<time class="document-created-time" datetime="{{epochToHumanDate "" uploaded_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" uploaded_time}}</time>
		</small>
</div>
<div class="clearfix"></div>
 

	<div>
		{{network network_type}}&nbsp;&nbsp;<a href="{{url}}" target="_blank"><i class="icon-external-link" title="Open Document"></i></a>
	</div>
	
		<div>
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
		
		{{#hasMenuScope 'DOCUMENT'}}
	  <div class="pos-abs pos-r-0 pos-b-0">
		<span class="actions">
			<a title="Edit"  data="{{id}}" class="document-edit-deal-tab  m-r-sm"> <i class="icon-pencil"></i> </a>
			<a title="Detach"  data="{{id}}" class="document-unlink-deal-tab"> <i class="icon-unlink"></i> </a>
            <!--<a title="Delete" style="cursor:pointer;text-decoration: none"><span class="activity-delete icon-trash" style="display:inline" id="{{id}}" url="core/api/documents/bulk"><i></i></span></a>-->
        </span>
        </div>
		{{/hasMenuScope}}
	
  </div>
  <div class="clearfix"></div>
</div>
</script>
<script id="deal-detail-edit-template" type="text/html">
<div class="row">
    <div class="container well opportunityEdit col-md-8">
        <form id="opportunityEditForm" name="opportunityEditForm" method="post">
			<fieldset>
				<input name="id" type="hidden"/>
				<div class="row">
					<div class="control-group form-group col-sm-5">
						<label class="control-label"><b>Name </b><span
							class="field_req">*</span></label>
						<div class="controls">
							<span><input id="name" name="name" type="text"
								class="form-control required" placeholder="Name of Deal" /></span>
						</div>
					</div>
					<div class="control-group span5" style="margin-left: 30px;">
						<label class="control-label"><b>Owner </b><span
							class="field_req">*</span></label>
						<div class="controls" id="owners">
							<select id="owners-list" class="required form-control" name="owner_id"></select>
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
								class="required form-control number" max="1000000000000"
								placeholder="Value of Deal" /></span>
						</div>
					</div>
					<div class="control-group span5" style="margin-left: 30px;">
						<label class="control-label"><b>Probability (%) </b><span
							class="field_req">*</span></label>
						<div class="controls">
							<span><input type="text" id="probability"
								name="probability" class="form-control required digits" max="100"
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
								class="required form-control">
									<option value="">Select..</option>
							</select></span><img class="loading-img" src="img/21-0.gif"></img>
						</div>
					</div>
					<div class="control-group span5" style="margin-left: 30px;">
						<label class="control-label"><b>Milestone </b><span
							class="field_req">*</span></label>
						<div class="controls">
							<span><select id="milestone" name="milestone"
								class="required form-control">
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
								class="input form-control date" placeholder="MM/DD/YY" /></span>
						</div>
					</div>
				</div>
				<div class="control-group">
					<label class="control-label"><b>Related To </b></label>
					<div class="controls" id="contactTypeAhead">
						<div>
							<div>
								<ul name="contact_ids" class="contacts tagsinput tags"></ul>
							</div>
							<div class="clearfix"></div>
							<input type="text" id="relates_to" name="relates_to"
								placeholder="Contact Name" class="typeahead form-control typeahead_contacts"
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
		<a href="#" class="btn btn-sm btn-primary" id="opportunity_validate_form">Save
			Changes</a> <span class="save-status"></span>
	</div>
    </div>
    <!-- End of Modal views -->
</div>
</script>
<script id="deal-notes-collection-template" type="text/html">
{{#unless this.length}}
        <div class="wrapper p-t-none">
            <div class="slate-content">
                <div class="box-left pull-left m-r-md">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right pull-left">
                    <h4 class="m-t-none">You have no notes for this Deal.</h4>
                    <div class="text">
                        You can save specific information about Deals as a Note.
                    </div>
                    <a href="#deal-note-modal1" data-toggle="modal" class="btn btn-default btn-sm blue btn-slate-action deal-note m-t-xs"><i class="icon-plus-sign"></i>  Add Note</a>
                </div>
				<div class="clearfix">
				</div>
            </div>
        </div>
        {{/unless}}
{{#if this.length}}
<div class="m-b-md m-t-md m-r-sm" align="right">
   <a href="#deal-note-modal1" data-toggle="modal" class="btn btn-default btn-sm btn-addon  deal-note"><span><i class='icon-plus-sign'/></span> Add Note</a> 
</div>
	<ul id="deal-notes-model-list" class="ativity-block-ul list-group list-group-lg m-b-none"></ul>
{{/if}}
</script>
<script id="deal-notes-model-template" type="text/html">
<div  class="activity block pos-rlt">
<div class="activity-block-owner thumb-xs pull-left m-r-sm b-light b avatar">
		{{#if domainOwner}}
			{{#if ownerPic}}
				<img class="user-img r r-2x"  alt="" src="{{ownerPic}}" >
			{{else}}
				<img class="user-img r r-2x"  alt="" src="{{defaultGravatarurl 40}}" >
			{{/if}}
		{{else}}
			<img class="user-img r r-2x"  alt="" src="{{#getCurrentUserPrefs}}{{#if pic}}{{pic}}{{else}}{{defaultGravatarurl 40}}{{/if}}{{/getCurrentUserPrefs}}" >
		{{/if}}
		<span class="owner-name hide">{{#if domainOwner}} {{domainOwner.name}} {{else}} {{#getCurrentUserPrefs}}{{currentDomainUserName}}{{/getCurrentUserPrefs}} {{/if}}</span>
	</div>
	
	<div class="pull-left rightThumbView pos-rlt">
	<div class="pull-left contact-title-dynamic"><a class="text-md text-cap custom-color">{{subject}}</a></div>
	<div class="pull-right">
	<small class="edit-hover  text-muted"> 
			<i class="fa fa-clock-o m-r-xs "></i>
			<time class="note-created-time" datetime="{{epochToHumanDate "" created_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time>
		</small>
	</div>
	<div class="clearfix"></div>
	
		<div>{{show_link_in_statement description}}</div>
		
	 	<div>
		<div class="m-b-sm">	
		{{#each contacts}}
           	{{#if id}}
				{{#isDuplicateContactProperty properties "email"}}
					{{else}}	
						<a href="#contact/{{id}}">{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}</a>,
				{{/isDuplicateContactProperty}}
           		
           	{{/if}}
       	{{/each}}
		</div>
		<div class="pos-abs pos-r-0 pos-b-0">
		<span class="actions">
<a title="Edit"  data="{{id}}" data-toggle="modal" class="deal-edit-note c-p text-l-none-hover p-r-sm"> <i class="icon-pencil"></i> </a>
            <a title="Delete" class="c-p text-l-none-hover"><span class="activity-delete icon-trash inline"  id="{{id}}" url="core/api/contacts/notes/bulk"></span></a>
        </span>
        </div>
	</div>

</div>
<div class="clearfix"></div>
</div>
</script>
<script id="deal-related-model-template" type="text/html">
<td></td>
<td class="data no-wrap" data="{{id}}">
    <div class="thumb-sm agile-img m-r-sm">
		{{#if_equals type "PERSON"}}        		
			<img class="img-inital r r-2x" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties "40"}}"  />
		{{else}}
			<img class="img-inital r r-2x" {{getCompanyImage "40" "display:inline;"}} title="{{getPropertyValue properties "name"}}"/>
		{{/if_equals}}    	
	</div>
    <div class="h-auto inline-block v-top text-ellipsis" style="width:12em;">
        <a class="text-cap custom-link">{{getPropertyValue properties "first_name"}}
        {{getPropertyValue properties "last_name"}} </a>
        <div><small class="text-muted">{{getPropertyValue properties "name"}}</small></div>
    </div>
</td>
	
<td style="width:6em;"><div>{{#if_equals type "PERSON"}}Contact {{else}} Company{{/if_equals}}</div></td>
<td style="width:6em;"><div>{{lead_score}}</div></td>

	<td style="width:6em;"><div>{{getPropertyValue properties "phone"}}</div></td>
	
</script>

<script id="deal-related-collection-template" type="text/html">

{{#if this.length}}
	<div style='height:30px' align="right">
		<a href="#" class="deal-add-contact btn btn-sm btn-primary  pos-rlt m-b-sm">
			<span><i class="icon-plus-sign"></i></span> Add Contact
		</a>
	</div>
	<br/>
		
			<table id="contacts" class="table table-striped agile-ellipsis-dynamic onlySorting overflow-scroll r-5x m-b-none b b-separate">
				<colgroup><col width="10px"><col width="40%"><col width="20%"><col width="25%"><col width="12%"></colgroup>
				<thead>
					<tr><th></th>
						<th>Name</th>
						<th>Type</th>
						<th>Score</th>
						<th>Phone</th>
					</tr>
				</thead>
				<tbody id="deal-related-model-list" class="deal-related-model-list agile-edit-row overflow-scroll"
					route="contact/" >
				</tbody>
			</table>

		{{else}}
			<div class="wrapper p-t-none">
            	<div class="slate-content">
                	<div class="box-left pull-left m-r-md">
                    	<img alt="Clipboard" src="/img/clipboard.png">
                	</div>
                	<div class="box-right pull-left">
                    	<h4 class="m-t-none">Deal is not associated with any person/contact. </h4>
                    	<div class="text">
							All Contacts which are related to this deal are shown here.
							<br/>
							<a href="#" class="deal-add-contact btn btn-default btn-sm m-t-xs left" style="margin-top:10px; margin-bottom:10px;">
								<i class="icon-plus-sign"></i> Add Contact
							</a>
                    	</div>
                	</div>
					<div class="clearfix">
					</div>
            	</div>
        	</div>
		{{/if}}
</script>
<script id="deal-detail-template" type="text/html">
<div class="app-content-full  h-full dock-view-fixing">
<div class="hbox hbox-auto-xs hbox-auto-sm bg-light">
<div class="col  bg-light lter b-r" style="width:299px">
<div class="vbox">
<div class="row-row">
<div class="wrapper pos-rlt">
<div class="contact-navigation-view hide"><span class="navigation  contact-switching"></span></div>
<div class="h3 font-thin custom-color m-b-xs" style="width:85%">{{#if name}}{{name}}{{/if}}</div>
<div class="m-b-sm h3 font-thin   m-t-sm">{{currencySymbol}}{{numberWithCommas expected_value}}</div>
<div class="m-b-sm text-muted">
{{#if this.archived}}&nbsp;&nbsp;<span  class="deal-task-type bg-light dk  btn btn-xs  m-l-xs" >Archived</span>{{else}}
	
{{#getTracksCount}}<span>{{pipeline.name}} , </span>{{/getTracksCount}}					
						
{{#if_equals milestone "Won"}} <span>{{milestone}}</span>
{{else}}
{{#if_equals milestone "Lost"}} <span>{{milestone}}</span>
{{else}}
<span>{{milestone}}</span>
{{/if_equals}}
{{/if_equals}} 

						
						{{/if}} 
 <span>- {{probability}}%</span></div>


{{#if this.archived}}





<div class="btn-group pos-abs pos-r pos-t">
<a href="#" class="deal-restore-detail-view btn btn-sm btn-default"><i class="icon-mail-reply"></i> Restore</a>
</div>

							
							<div  class="deal-owner-block">
						<div class="change-owner-succes"></div>
     <div title="Owner">
      	<div class="contact-owner" id="change-owner-element">
        	<div><small class="text-xs text-muted"> Owner:&nbsp;&nbsp;</small></div>
		
        	<a href="#"  data={{owner.id}} class="deal-owner-name contact-owner-name c-d">{{owner.name}}</a>
        
        	
       </div>
    </div>
					</div>


                        



{{else}}                       
<div class="pos-abs pos-r pos-t">
								
								
								<a class=" dropdown-toggle" data-toggle="dropdown"><span class="fa fa-angle-down text-lg"></span></a>
								<ul class="dropdown-menu pull-right">
                                    <li><a href="#" class="deal-detail-edit-deal" id="deal_details"><i class="icon-edit"></i> Edit</a></li>
                                    <li class="divider"></li>
									<li><a href='#'  id="dealshow-note" class="deal-note"><i
											class="icon-file"></i> Add Note</a></li>
                                    <li><a href='#'  id="dealdetail-archive" class="deal-detail-archive"><i class="icon-archive"></i> Archive</a></li>
							
									<li><a href='#'  data="{{id}}" class="deal_detail_delete" id='opportunity-actions-delete'><i
											class="icon-trash"></i> Delete</a></li>
								</ul>
</div>
<div  class="deal-owner-position deal-owner-block">
						<div class="change-owner-succes"></div>
     <div title="Owner" class="contact-owner-view">
      	<div class="contact-owner" id="change-owner-element">
        	<div><small class="text-xs text-muted">Owner:&nbsp;&nbsp;</small></div>
		
        	<div id="deal-owner" data={{owner.id}} class="deal-owner-name contact-owner-name c-p">{{owner.name}}</div>
        
        	<div class="btn-group v-middle" id="change-deal-owner-ul" style="display: none">
        		 <a class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown">Change Owner <span class="caret"></span></a>
        		 <ul id='deal-detail-owner' class="dropdown-menu"></ul>
        	</div> 
       </div>
    </div>
	</div>
					
{{/if}}

<div>

                           

<div class="deal-custom-data"> 
								
					
								<div class="l-h">
									
									{{#if custom_data}}
                                      <div class="m-t-sm">
                                      <small class="text-xs text-muted">Custom Data</small>
                                       </div>
									{{#getDealCustomProperties custom_data}}
									{{#each_with_index this}}
                                       
                                   	

                                            <span class="contact-custom-name">
												<span class="text-light" title="{{name}}">{{name}}</span>
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

<div class="m-t-sm">
{{#if contacts}}
<div class="m-b-xs">
        	<small class="text-xs text-muted">Related to</small>
</div>
{{/if}}
		{{#each contacts}}
        	{{#if_contact_type "PERSON"}}
        		<a href="#contact/{{id}}" class="activate-link thumb"><img  data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}"   title="{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}" /></a>
        	{{/if_contact_type}}
			{{#if_contact_type "COMPANY"}}
        		<a href="#contact/{{id}}" class="activate-link thumb"><img  {{getCompanyImage "40" "display:inline;"}} title="{{getPropertyValue properties "name"}}"/></a>
        	{{/if_contact_type}}
        {{/each}}
      </div> 
					</div>






						</div>
					</div>
				</div>
			</div>
			
<div class="col bg-white">
<div class="vbox">
<div class="row-row">			
<div id="deal-details">
	<div class="tab-container">
           <ul class="nav nav-tabs bg-light" id="deal-details-tab">
             <li><a href="#dealactivities" data-toggle="tab" >Activity</a></li>
             <li><a href="#dealnotes" data-toggle="tab" >Notes</a></li>
			 <li><a href="#dealdocs" data-toggle="tab">Documents</a></li>
             <li><a href="#dealrelated" data-toggle="tab">Related</a></li>
           </ul>
	</div>
 	<div class="tab-content panel" id="deal-tab-content">
 		<div class="tab-pane" id="dealactivities"></div>
 		<div class="tab-pane" id="dealnotes"></div>
 		<div class="tab-pane" id="dealdocs"></div>
 		<div class="tab-pane" id="dealrelated"></div>     
 	</div>
</div>
</div>
</div>
</div>
</div>



<!-- Archive confirmation-->
<div id="deal_archive_confirm_modal" class="modal  fade">
<div class="modal-dialog">
    <div class="modal-content">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
    <h3 class="modal-title">Archive Deal</h3>
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
	<button type="button" class="btn btn-sm btn-danger" data-dismiss="modal" aria-hidden="true">No</button>
    <a href="#" id="deal-quick-archive" class="btn btn-sm btn-primary">Yes</a>
  </div>
</div>
</div>
</div>
<!-- End of Archive confirmation-->

<!-- Restore confirmation-->
<div id="deal_restore_confirm_modal" class="modal fade">
<div class="modal-dialog">
    <div class="modal-content">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
    <h3 class="modal-title">Restore Deal</h3>
  </div>
  <div class="modal-body">
	<input id="restored-deal-id" name="id" type="hidden"/>
	<input id="restored-deal-milestone" name="milestone" type="hidden"/>
    <div id="deal-bulk-confirm">
		Restoring the Deal will make it active again. <br/> Restore this Deal?
	</div>
  </div>
  <div class="modal-footer">
	<button type="button" class="btn btn-sm btn-danger" data-dismiss="modal" aria-hidden="true">No</button>
    <a href="#" id="deal-quick-restore" class="btn btn-sm btn-primary">Yes</a>
  </div>
</div>
<!-- End of Restore confirmation-->
</script>
</html>