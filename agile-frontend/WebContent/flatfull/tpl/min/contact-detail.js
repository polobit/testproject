<script id="company-detail-template" type="text/html">
<div class="row-fluid"><small class="navigation span9" style="min-height:10px!important;font-size:smaller;line-height:6px;"></small></div>
<div class="row">
	<div class="span9">
		<div style="margin-bottom: 20px;">
			<div style="border: 1px solid beige" class="row-fluid">
				<div class="page-header"
					style="padding: 20px; border: 1px solid #f5f5f5; margin: 0px">
					<div style="display: inline">
						<div style="display: inline">
							<form style='display: inline; padding-right: 10px; height: auto;'
								id="contact-container">
								<a href="#" class="tooltip_info" data-placement="top"
									data-toggle="tooltip"
									title="<i class='icon-edit icon-white icon'></i> Change Picture"
									style='text-decoration: none;'> 
								<img class='thumbnail upload_pic imgholder submit' type="submit"
									{{getCompanyImage "80" "display:inline;"}} />
								</a> <input type="hidden" id="upload_url" name="gravatarurl">
								<a style="display: none;" class="save_img submit" type="submit">Save</a>
							</form>
						</div>
						<div
							style='margin-top: 0%; width: 70%; display: inline-block; vertical-align: middle'>
							<div
								style="height: auto; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;padding-top:3px;font-size: 20px;">

								{{getPropertyValue properties "name"}}
								{{#if_propertyName "url"}}</br>
									<a href="{{getHyperlinkFromURL value}}" target="_blank">{{value}}</a>
								{{/if_propertyName}}
								<br/>
								<br/>
								<div class="span2" style="padding-top: 5px; margin: 0px">
									{{#property_is_exists "website" properties}}
									{{#multiple_Property_Element "website" properties}} {{#each
									this}} {{#if_equals subtype "TWITTER"}} <span
										style="margin-right: 5px"><a target="_blank"
										href="https://twitter.com/{{getTwitterHandleByURL value}}"
										style="text-decoration: none"> <i
											class="{{get_social_icon "
											TWITTER"}}" style="font-size: 1.4em !important"></i>
									</a>
									</span> {{else}}  {{#if_equals subtype "SKYPE"}} <span
										style="margin-right: 5px"><a target="_blank"
										href="{{getSkypeURL value}}"
										style="text-decoration: none"> <i
											class="{{get_social_icon "
											SKYPE"}}" style="font-size: 1.4em !important"></i>
									</a>
									</span>{{else}} <span style="margin-right: 5px"> <a
										target="_blank" href="{{getHyperlinkFromURL value}}" style="text-decoration: none">
											<i class="{{get_social_icon subtype}}"
											style="font-size: 1.4em !important"></i>
									</a>
									</span>{{/if_equals}} {{/if_equals}} {{/each}} {{/multiple_Property_Element}}
									{{/property_is_exists}}
								</div>
							</div>
						</div>
						<div class="right" style='position: relative'>
							<div class="btn-group right" style='position: relative'>
								<div id='star' style='padding-bottom: 13px; width: auto !important'></div>
								<a class="btn" style="border-radius: 4px 0px 0px 4px!important;margin-left: 6px;" href="#contact-edit"><i class="icon-edit"></i> Edit</a> 
								<a class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
								<ul class="dropdown-menu">

									<li><a href='#' class="contact-add-case"><i
											class="icon-folder-close"></i> Add Case</a></li>
									{{#hasMenuScope 'DEALS'}}
									<li><a href='#' class="contact-add-deal"><i class="icon-money"></i>
											Add Opportunity</a></li>
									{{/hasMenuScope}}
									<li class='divider'></li>
									<li><a href='#send-email{{#if_propertyName "email"}}/{{value}}{{/if_propertyName}}' id="contact-send-email"><i
											class="icon-envelope-alt"></i> Send Email</a></li>
									<li class='divider'></li>
									<li><a href='#' id='contact-actions-delete'><i
											class="icon-trash"></i> Delete</a></li>
								</ul>
							</div>
						</div>

					</div>
					<!-- Owner block -->
					<br />
					<div style="float: right; margin-top: -15px;width:36%;">
<div class="change-owner-succes"></div>
     <span title="Owner" class="contact-owner-view">
      	<span class="contact-owner" id="change-owner-element">
        	<span class="contact-owner-text">Owner:&nbsp;&nbsp;</span>
			{{#if owner}}
        	<span class="contact-owner-pic" style="visibility:visible;"><img class="user-img"  alt="" src="img/company.png" /></span>
			{{else}}
			<span class="contact-owner-pic" style="visibility:hidden;"><img class="user-img"  alt="" src="img/company.png" /></span><span class="contact-owner-add" style="font-size:13px;"><a style="cursor:pointer;">Assign Owner</a></span>
 			{{/if}}
        	<span id="contact-owner" data={{owner.id}} style="display:inline-block;max-width:82%;" class="contact-owner-name">{{owner.name}}</span>
        
        	{{#canEditContact owner.id}}
        	<div class="btn-group" id="change-owner-ul" style="vertical-align: middle; display: none">
        		 <a class="btn dropdown-toggle" data-toggle="dropdown">Change owner <span class="caret"></span></a>
        		 <ul id='contact-detail-owner' class="dropdown-menu pull-right"></ul>
        	</div> 
			{{/canEditContact}}
       </span>
    </span>
					</div>
				</div>

			</div>
		</div>
		<div class="">
			<ul class="nav nav-tabs" id="contactDetailsTab">
				<li class="active"><a data-toggle="tab" href="#company-contacts">Contacts</a></li>
				<li class=""><a data-toggle="tab" href="#deals">Deals</a></li>
				<li class=""><a data-toggle="tab" href="#cases">Cases</a></li>
                <li class=""><a data-toggle="tab" href="#notes">Notes</a></li>
                <li class=""><a data-toggle="tab" href="#documents">Documents</a></li>
				
			</ul>
			<div class="tab-content well" id="contact-tab-content">
				<div class="tab-pane active" id="company-contacts">...</div>
				<div class="tab-pane" id="deals">...</div>
				<div class="tab-pane" id="cases">...</div>
                <div class="tab-pane" id="notes"><img src="img/21-0.gif"></img></div>
               <div class="tab-pane" id="documents"><img src="img/21-0.gif"></img></div>
			</div>
		</div>
	</div>
	<!-- Contact Details -->
	<div class="span3">


		{{#property_is_exists "phone" properties}}
			<div class="widget_container" id="{{name}}-container">
				{{else}} 
					{{#property_is_exists "email" properties}}
						<div class="widget_container" id="{{name}}-container">
						{{else}} 
							{{#property_is_exists "address" properties}}
									<div class="widget_container" id="{{name}}-container">
									{{else}}
										{{#getContactCustomProperties properties}}
											<div class="widget_container" id="{{name}}-container">
											{{else}}
												<div class="widget_container hide" id="{{name}}-container">
										{{/getContactCustomProperties }}
							{{/property_is_exists}} 
					{{/property_is_exists}}
		{{/property_is_exists}}
						<div class="widget_header">
							<div class="pull-left"
								style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width: 18em">
								<i class="icon-user "></i> <strong>Contact
									{{getPropertyValue properties "first_name"}}</strong>
							</div>
						</div>
						<!-- <div id="qrcode"><img src="img/1-0.gif"></div> -->
						<div class="clearfix"></div>
						<div style='word-wrap: break-word; padding-top: 10px'>
							{{#property_is_exists "phone" properties}}
							<div class="pull-left row-fluid" style="padding-bottom: 5px;">
								{{#multiple_Property_Element "phone" properties}}
								<div
									style="display: inline-block; vertical-align: top; text-align: right"
									class="span4">
									<span><strong style="color: gray">Phone</strong><span>
								</div>
								<div
									style="padding-right: 10px; display: inline-block; padding-bottom: 2px; line-height: 20px"
									class="span8">
									{{#each this}}
									<div>
                                        <a href='#' class="contact-make-sip-call" style="display:none;"
                                           phone="{{value}}">
                                           {{value}}
                                        </a>            
                                        <a href='#' class="contact-make-twilio-call" style="display:none;"                                           
                                           phone="{{value}}">
                                           {{value}}
                                        </a>
										<a href="tel:{{value}}" class="contact-make-call">{{value}}</a> 
                                        {{#if subtype}}<span class="label">{{subtype}}</span> {{/if}}
									</div>
									{{/each}}
								</div>
								{{/multiple_Property_Element}}
							</div>
							{{/property_is_exists}}
 							{{#property_is_exists "email" properties}}
							<div class="pull-left row-fluid" style="margin-bottom: 5px;">
								{{#multiple_Property_Element "email" properties}}
								<div
									style="display: inline-block; vertical-align: top; text-align: right"
									class="span4">
									<span><strong style="color: gray">Email</strong><span>
								</div>
								{{#property_is_exists "phone" ../properties}}
								<div
									class="span8 contact-detail-entity-list" style="padding-right:0px!important;">
									{{else}}
									<div
										style="padding-right: 10px; display: inline-block; padding-bottom: 2px;"
										class="span8">
										{{/property_is_exists}} 
									{{#each this}}
										<div>
											<a href='#send-email/{{value}}'>{{value}}</a> {{#if subtype}} <span class="label">{{subtype}}</span> {{/if}}
										</div>
									{{/each}}
									</div>
									{{/multiple_Property_Element}}
								</div>
								{{/property_is_exists}} <div class="custom-data"> {{#getContactCustomPropertiesExclusively properties}}
								<div class="pull-left row-fluid">
									{{#each_with_index this}}
									<div class="pull-left row-fluid">
										<div class="span4" style="padding: 4px 0px 5px 2px;text-align:right;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">
											<span><strong style="color: gray" title="{{name}}">{{name}}</strong><span>
										</div>
										{{#if_equals index ../this.length}}
											<div class="span8"
												style="padding:4px 10px 5px 2px; display: inline-block;margin-bottom:5px; border-top: 1px solid whitesmoke;">
											{{#if_equals subtype "DATE"}} <time class="note-created-time" datetime="{{epochToHumanDate "" value}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "dd mmm yyyy" value}}</time>{{else}}{{value}} {{/if_equals}}</div>
										{{else}}
											<div class="span8"
												style="padding:4px 10px 5px 2px; display: inline-block; border-top: 1px solid whitesmoke;">
											{{#if_equals subtype "DATE"}} <time class="note-created-time" datetime="{{epochToHumanDate "" value}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "dd mmm yyyy" value}}</time>{{else}}{{value}} {{/if_equals}}</div>
										{{/if_equals}}
										</div>
										{{/each_with_index}}
									</div>
									{{/getContactCustomPropertiesExclusively}}
									</div>
 									{{#property_is_exists "address" properties}}
										<div class="pull-left row-fluid " style="padding-bottom:5px;margin-top:0px">
											{{#address_Element properties}}{{/address_Element}}</div>

										<div class="pull-left row-fluid">
											<div id="map" style="width: auto; height: 200px; display: none; margin: 10px">
											</div>
										</div>
									{{/property_is_exists}}

								</div>
								<div class="clearfix"></div>
							</div>





							<div id="widgets"></div>
						</div>
					</div>

					</script>
					
<script id="company-contacts-model-template" type="text/html">
	<td></td>
	<td class="data" data="{{id}}" style="white-space:nowrap;">
    	<div style="display:inline;padding-right:10px;height:auto;">
        		<img class="thumbnail img-inital" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" width="40px" height="40px" style="display:inline; width:40px; height:40px; " />
    	</div>
    	<div style="height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;width:12em;overflow:hidden;">
        		<b>	{{getPropertyValue properties "first_name"}}
        		{{getPropertyValue properties "last_name"}} </b>
        		<br />
        		{{getPropertyValue properties "email"}}
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

<script id="company-contacts-collection-template" type="text/html">

{{#if this.length}}
	<div style='height:30px'>
		<a href="#" class="contact-add-contact btn right" style="position:relative;margin-bottom:10px;">
			<span><i class="icon-plus-sign"></i></span> Add Contact
		</a>
	</div>
	<br/>
		
			<table id="contacts" class="table table-striped agile-ellipsis-dynamic onlySorting" style="overflow: scroll; border-radius: 5px; -webkit-border-radius: 5px; margin-bottom:0px; border: 1px solid #dddddd; border-collapse: separate;">
				<colgroup><col width="10px"><col width="40%"><col width="20%"><col width="25%"><col width="12%"></colgroup>
				<thead>
					<tr><th></th>
						<th>Name</th>
						<th>Work</th>
						<th>Tags</th>
						<th>Lead Score</th>
					</tr>
				</thead>
				<tbody id="company-contacts-model-list" class="contacts-model-list"
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
                    	<h3>{{contactShortName}} is not associated with any person/contact. </h3>
                    	<div class="text">
							All Contacts that have this company in the 'Organization' or 'Company' field are shown here.
							<br/>
							<a href="#" class="contact-add-contact btn left" style="margin-top:10px; margin-bottom:10px;">
								<i class="icon-plus-sign"></i> Add Contact
							</a>
                    	</div>
                	</div>
            	</div>
        	</div>
		{{/if}}
</script>
<script id="contact-detail-campaign-template" type="text/html">
<div class="span8">
    <div class="well">
        <form id="contactCampaignForm" class="form-horizontal">
            <fieldset>
                <div class="control-group">         
                    <legend><i class='icon-plus-sign'/></i> Add contact to campaign</legend>    
                    <label class="control-label">Select campaign <span class="field_req">*</span></label>
                    <div class="controls">
                        <select class="campaign-select required" id='campaign-select'>
                            <option value="">Select..</option>
                        </select>
                    </div>
                </div>
                <div class="form-actions">          
                    <a href="#" type="submit" id="subscribe-contact-campaign" class="btn btn-primary">Add</a> 
                    <a href="#" class="btn " id="contact-close-campaign">Close</a>
                    <span class="save-status"></span>
                </div>
            </fieldset>
        </form>
    </div>
</div>
</script>					<script id="campaigns-collection-template" type="text/html">
<div style="margin-bottom:20px">
{{#contact_model}}
	<div>
		 {{#contact_campaigns this "campaignStatus"}}
		 {{!-- Shows Active and Done campaigns like tags --}}
         {{#if this}} 
         
		 {{#if this.done}}
         <div>
           <div style="display: inline-block; margin-right: 5px" class="font-15">Completed Campaigns: </div> <ul class="tagsinput">
                   {{#each this.done}}
						<li class="tag" style="display:inline-block; background-color: gray; border-color: gray;" data="{{campaign_id}}"><span>
						{{#hasMenuScope 'CAMPAIGN'}}
							<a class="anchor" href="#workflow/{{campaign_id}}">{{#if campaign_name}}{{trim_space campaign_name}}{{else}}Done Campaign{{/if}}</a>
						{{else}}
							<span style="color:#888">{{#if campaign_name}}{{trim_space campaign_name}}{{else}}Done Campaign{{/if}}</span>
						{{/hasMenuScope}}
						</span></li> 
					{{/each}}
                    </ul>
         </div>
         <br>
         {{/if}}

         {{#if this.active}}
         <div>
           <div class="font-15" id="contact-active-campaigns" style="display: inline-block; margin-right: 5px;">Active Campaigns: </div> <ul class="tagsinput active-campaigns">
                   {{#each this.active}}
						<li class="tag" style="display:inline-block; background-color: gray; border-color: gray;" data="{{campaign_id}}"><span>
							{{#hasMenuScope 'CAMPAIGN'}}
								<a class="anchor" href="#workflow/{{campaign_id}}">{{#if campaign_name}}{{trim_space campaign_name}}{{else}}Active Campaign{{/if}}</a>
								<a class="close remove-active-campaign" contact_name = "{{contactShortName}}" campaign_name="{{campaign_name}}" title="Remove from Campaign">&times</a>
							{{else}}
								<span style="color:#888">{{#if campaign_name}}{{trim_space campaign_name}}{{else}}Active Campaign{{/if}}</span>
							{{/hasMenuScope}}
						</span></li> 
					{{/each}}
                    </ul>
	{{#canEditCurrentContact "1"}}
		{{#hasMenuScope 'CAMPAIGN'}}
            <a class="add-to-campaign" style="margin-top:1%;" href="#"><i class="icon-plus-sign"></i> Add {{getCurrentContactProperty "first_name"}} to Campaign</a>
		{{/hasMenuScope}}
	{{/canEditCurrentContact}}
            <form id="add-to-campaign-form" class="show_campaigns_list" style="display:none;">
            	<div class="control-group">
                	<div class="controls">
			        	<select id="campaign-select" class="required" name="campaign_id" style="margin-bottom: -1px;">
                        	<option value="">Select...</option>
                      	</select>
				  	  	<span style="margin-left: 5px;"><a class="btn" id="add-to-campaign" href="#">Add</a></span>
                      	<span style="margin-left: 5px;"><a class="btn" id="cancel-to-add-campaign" href="#">Cancel</a></span>
                    </div> 
			   </div>
            </form> 
         </div>
         
         {{else}}
         {{#canEditCurrentContact "1"}}
			{{#hasMenuScope 'CAMPAIGN'}}
        	 <a class="add-to-campaign" style="margin-top:1%;" href="#"><i class="icon-plus-sign"></i> Add {{getCurrentContactProperty "first_name"}} to Campaign</a>
			{{/hasMenuScope}}
		{{/canEditCurrentContact}}
         	<form id="add-to-campaign-form" class="show_campaigns_list" style="display: none;">
				<div class="control-group">
                	<div class="controls">
			        	<select id="campaign-select" class="required" name="campaign_id" style="margin-bottom: -1px;">
                        	<option value="">Select...</option>
                      	</select>
				  	    <span style="margin-left: 5px;"><a class="btn" id="add-to-campaign" href="#">Add</a></span>
                        <span style="margin-left: 5px;"><a class="btn" id="cancel-to-add-campaign" href="#">Cancel</a></span>
                    </div> 
			    </div>
           </form> 
         {{/if}}

         {{/if}}
         {{/contact_campaigns}}
    </div>

{{/contact_model}}

</div>
<div class="clearfix"></div>
		{{#unless this.length}}
        <div class="slate">
            <div class="slate-content">
                <div class="box-left">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right">
                    <h3>No campaign activity for {{contactShortName}}.</h3>
                    <div class="text">
						Contact campaign activity like email opens and link clicks are shown here.
					</div>
                </div>
            </div>
        </div>
        {{/unless}}
        {{#if this.length}}
          <div style="margin-top:10px">
		     
              <div class="font-15">Campaign Log</div>
          </div>
		  <ul id="campaigns-model-list" class="ativity-block-ul"></ul>
		  <table class="m-t-md"></table>
		{{/if}}
</script>

<script id="campaigns-model-template" type="text/html">
<div style="display:block;">

<div class="activity-text-block">
	<span class="activity-block-owner">
		{{#if log_type}}
			<img class="user-img" width="40" height="40" alt="" src="img/campaigns/{{log_type}}.png">
		{{else}}
			<img class="user-img" width="40" height="40" src="https://dpm72z3r2fvl4.cloudfront.net/css/images/user-default.png">
		{{/if}}
	</span>

	<h4><b>{{titleFromEnums log_type}}</b></h4></br>

 	<p>{{#if_email_sent this "log_type"}} Subject: {{Subject}} {{else}} {{{message}}} {{/if_email_sent}}</p>

    <small class="edit-hover">
		<time class="log-created-time" datetime="{{epochToHumanDate "" time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" time}}</time>
        {{#hasMenuScope 'CAMPAIGN'}}
			<a class="pull-right" href="#workflow/{{campaign_id}}"> {{campaign_name}}</a>
		{{else}}
			<p class="pull-right">{{campaign_name}}</p>
		{{/hasMenuScope}}
        <p class="pull-right">Campaign - </p>
	</small>	
</div>
</div>
</script><script id="cases-contact-collection-template" type="text/html">
  {{#unless this.length}}
        <div class="slate">
            <div class="slate-content">
                <div class="box-left">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right">
                    <h3>{{contactShortName}} is not associated with any cases. </h3>
                    <div class="text">
						All Cases that have this contact in the 'Related to' field are shown here.
                    </div>
					{{#hasMenuScope 'CASES'}}
                    <a href="#" class="contact-add-case btn blue btn-slate-action"><i class="icon-plus-sign"></i>  Add Case</a>
					{{/hasMenuScope}}
                </div>
            </div>
        </div>
   {{/unless}}

{{#if this.length}}
<div class="page-header" style="margin-top: 0px !important">
	{{#hasMenuScope 'CASES'}}
   		<a href="#" class="contact-add-case btn right" style="position:relative"><span><i class='icon-plus-sign'/></span> Add Case</a> 
	{{/hasMenuScope}}
</div>
	<ul id="cases-contact-model-list" class="ativity-block-ul"></ul>
{{/if}}
</script>

<script id="cases-contact-model-template" type="text/html"> 
<div style="display:block;" class="activity">
	<div class="activity-text-block">
		<span class="activity-block-owner">
			{{#if ownerPic}}
				<img class="user-img thumbnail" width="40" height="40" alt="" src="{{ownerPic}}" >
			{{else}}
				<img class="user-img thumbnail" width="40" height="40" src="{{defaultGravatarurl 40}}">
			{{/if}}
			<span class="owner-name">{{owner.name}}</span>
		</span>
		<h4 style="margin-bottom: 9px;">
			<a style="text-decoration: none">
				<b>{{title}}</b>
			</a>
			<span style="margin-left:20px;"> ( {{ucfirst status}} )</span>
		</h4>		
    <p>{{description}} &nbsp;</p>
	<div class="clear">
		<small class="edit-hover" style="margin-right:10px">
			<time class="deal-created-time" datetime="{{epochToHumanDate "" created_time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time>
		</small>
		<span class="actions pull-right">
			{{#hasMenuScope 'CASES'}}
			 <a title="Edit"  data="{{id}}" href="#" class="cases-edit-contact-tab" style="cursor:pointer;text-decoration: none;padding-right:10px"> <i class="icon-pencil"></i> </a>
             <a title="Delete" style="cursor:pointer;text-decoration: none"><span class="activity-delete icon-trash" id="{{id}}" url="core/api/cases/bulk"></span></a>
			{{/hasMenuScope}}
        </span>
	</div>
	
</div>
</div>
</script>

<script id="deals-collection-template" type="text/html">
  {{#unless this.length}}
        <div class="slate">
            <div class="slate-content">
                <div class="box-left">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right">
                    <h3>{{contactShortName}} is not associated with any deals. </h3>
                    <div class="text">
						All Deals that have this contact in the 'Related to' field are shown here.
                    </div>
					{{#hasMenuScope 'DEALS'}}
                    <a href="#" class="contact-add-deal btn blue btn-slate-action"><i class="icon-plus-sign"></i>  Add Deal</a>
					{{/hasMenuScope}}
                </div>
            </div>
        </div>
   {{/unless}}

{{#if this.length}}
<div class="page-header" style="margin-top: 0px !important">
	{{#hasMenuScope 'DEALS'}}
   		<a href="#" class="contact-add-deal btn right" style="position:relative"><span><i class='icon-plus-sign'/></span> Add Deal</a> 
	{{/hasMenuScope}}
</div>
	<ul id="deals-model-list" class="ativity-block-ul"></ul>
{{/if}}
</script>

<script id="deals-model-template" type="text/html"> 
<div style="display:block;" class="activity">
	<div class="activity-text-block">
		<span class="activity-block-owner">
			{{#if pic}}
				<img class="user-img thumbnail" width="40" height="40" alt="" src="{{pic}}" >
			{{else}}
				<img class="user-img thumbnail" width="40" height="40" src="{{defaultGravatarurl 40}}">
			{{/if}}
			<span class="owner-name">{{owner.name}}</span>
		</span>
		<h4 style="margin-bottom: 9px;"><a style="text-decoration: none"><b><a href="#deal/{{id}}">{{name}}</a></b></a><span style="margin-left:20px;">{{milestone}} ({{probability}} %)</span></h4>
							
		<p><span style="margin-right: 10px;">Value : </span>
			{{currencySymbol}}{{numberWithCommas expected_value}}
		</p>

    <p>{{description}}</p>
	<div class="clear">
		<div style="margin-bottom: 9px;">	
		{{#each contacts}}
           	{{#if id}}
				{{#isDuplicateContactProperty properties "email"}}

					{{else}}
						{{#if_contact_type "PERSON"}}	
							<a href="#contact/{{id}}">{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}</a>,
        				{{/if_contact_type}}
						{{#if_contact_type "COMPANY"}}
        					<a href="#contact/{{id}}">{{getPropertyValue properties "name"}}</a>,
        				{{/if_contact_type}}
				{{/isDuplicateContactProperty}}
           		
           	{{/if}}
       	{{/each}}
		</div>
		<small class="edit-hover" style="margin-right:10px">
			<time class="deal-created-time" datetime="{{epochToHumanDate "" created_time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time>
		</small>
		<span class="actions pull-right">
			{{#if notes}}
             <a title="Notes" data="{{id}}" data-toggle="tooltip" data-placement="top" data-trigger="hover" data-container="No Notes" class="deal-notes deal-edit-contact-tab" style="cursor:pointer;text-decoration:none;"><i class="deal-action icon icon-comment deal-notes" data="{{id}}" title="Notes"></i></a>
              <span class="txt-small note-count" title="Notes">{{notes.length}}</span>
			{{/if}}
			{{#hasMenuScope 'DEALS'}}
			 <a title="Edit"  data="{{id}}" href="#" class="deal-edit-contact-tab" style="cursor:pointer;text-decoration: none;padding-right:10px"> <i class="icon-pencil"></i> </a>
             <a title="Delete" style="cursor:pointer;text-decoration: none"><span class="activity-delete icon-trash" id="{{id}}" url="core/api/opportunity/delete"></span></a>
      		{{/hasMenuScope}}
	  	</span>
	</div>
</div>
</div>
</script>
<script id="contact-documents-collection-template" type="text/html">
		{{#unless this.length}}
        <div class="slate">
            <div class="slate-content">
                <div class="box-left">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right">
                    <h3>You have no documents for {{contactShortName}}.</h3>
					{{#hasMenuScope 'DOCUMENT'}}
                    <div class="text">
                        You can add a document related to a contact.
                    </div>
					{{/hasMenuScope}}
					<div>{{#hasMenuScope 'DOCUMENT'}}<a href="#" class="add-document-select"><i class='icon-plus-sign'/></i> Add Document</a>{{/hasMenuScope}}
						<span class="contact-document-select" style="display:none;">
							<select id="document-select" style="margin-bottom: -1px;">
								<option value="">Select...</option>
							</select>
                    		<a href="#" class="btn add-document-confirm">Add</a> 
                   			<a href="#" class="btn add-document-cancel">Cancel</a>
							<span class="save-status"></span>
						</span>
					</div>
         			<!--<div class="btn-group" style="margin-top:12px;">
        				<a href="#" class="btn right contact-add-document"><i class="icon-plus-sign"></i> Add Document</a>
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
        	<a href="#" class="btn right contact-add-document"><i class="icon-plus-sign"></i> Add Document</a>
        	<a class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
			<ul class="dropdown-menu pull-right">
				<li><a href="#" class="document-exist">Existing Document</a></li>
			</ul>
		</div>-->
		<div class="right">{{#hasMenuScope 'DOCUMENT'}}<a href="#" class="add-document-select"><i class='icon-plus-sign'/></i> Add Document</a>{{/hasMenuScope}}
			<span class="contact-document-select" style="display:none;">
				<select id="document-select" style="margin-bottom: -1px;">
					<option value="">Select...</option>
				</select>
                <a href="#" class="btn add-document-confirm">Add</a> 
                <a href="#" class="btn add-document-cancel">Cancel</a>
				<span class="save-status"></span>
			</span>
		</div>
	</div>
			<ul id="contact-documents-model-list" class="ativity-block-ul"></ul>
		{{/if}} 
</script>

<script id="contact-documents-model-template" type="text/html">

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
		{{network network_type}}{{#hasMenuScope 'DOCUMENT'}}&nbsp;&nbsp;<a href="{{url}}" target="_blank"><i class="icon-external-link" title="Open Document"></i></a>{{/hasMenuScope}}
	</p>
	<div class="clear">
		<div style="margin-bottom: 9px;">	
		{{#each contacts}}
           	{{#if id}}
				{{#isDuplicateContactProperty properties "email"}}

					{{else}}
						{{#if_contact_type "PERSON"}}	
							<a href="#contact/{{id}}">{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}</a>,
        				{{/if_contact_type}}
						{{#if_contact_type "COMPANY"}}
        					<a href="#contact/{{id}}">{{getPropertyValue properties "name"}}</a>,
        				{{/if_contact_type}}
				{{/isDuplicateContactProperty}}
           		
           	{{/if}}
       	{{/each}}
		{{{getDealNames deals}}}
		</div>
		 <small class="edit-hover" style="margin-right:10px"> 
			<time class="document-created-time" datetime="{{epochToHumanDate "" uploaded_time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" uploaded_time}}</time>
		</small>
		<span class="actions pull-right">
			{{#hasMenuScope 'DOCUMENT'}}
			<a title="Edit"  data="{{id}}" class="document-edit-contact-tab" style="cursor:pointer;text-decoration: none;padding-right:10px"> <i class="icon-pencil"></i> </a>
			<a title="Detach"  data="{{id}}" class="document-unlink-contact-tab" style="cursor:pointer;text-decoration: none;padding-right:10px"> <i class="icon-unlink"></i> </a>
            <!--<a title="Delete" style="cursor:pointer;text-decoration: none"><span class="activity-delete icon-trash" style="display:inline" id="{{id}}" url="core/api/documents/bulk"><i></i></span></a>-->
			{{/hasMenuScope}}
        </span>
	</div>
  </div>
</div>
</div>
</script><script id="email-account-types-template" type="text/html">
	<div class="btn-group right" style='position:relative'>
	<button class="btn filter-dropdown" id="email-type-select">Agile</button>
	<button class="btn dropdown-toggle" id="email-type-select-dropdown" data-toggle="dropdown">
	<span class="caret"></span>
	</button>
	<ul id = "mail-account-type-select" class="pull-right dropdown-menu">
	{{#if agileUserName}}
	<li>
	<a href="" class="agile-emails" email-server="agile" data-url="core/api/emails/agile-emails?e=" email-server-type={{agileUserName}}><i class="icon-cloud" style="margin-right:4px;font-size: 1.2em"></i>Agile</a>
	</li>
	{{/if}}
	{{#if gmailUserName}}
	<li>
	<a href="" class="agile-emails" email-server="google" data-url="core/api/social-prefs/google-emails?from_email=" email-server-type={{gmailUserName}}><i class="icon-google-plus" style="margin-right:4px;font-size: 1.2em"></i>{{gmailUserName}}</a>
	</li>
	{{/if}}
	{{#if imapUserName}}
	<li>
	<a href="" class="agile-emails" email-server="imap" data-url="core/api/imap/imap-emails?from_email=" email-server-type={{imapUserName}}><i class="icon-envelope-alt" style="margin-right:4px;font-size: 1.2em"></i>{{imapUserName}}</a>
	</li>
	{{/if}}
	{{#if exchangeUserName}}
	<li>
	<a href="" class="agile-emails" email-server="exchange" data-url="core/api/office/office365-emails?from_email=" email-server-type={{exchangeUserName}}><i class="icon-windows" style="margin-right:4px;font-size: 1.2em"></i>{{exchangeUserName}}</a>
	</li>
	{{/if}}
	{{#if sharedGmailUserNames}}
	{{#each sharedGmailUserNames}}
	<li>
	<a href="" class="agile-emails" email-server="google" data-url="core/api/social-prefs/google-emails?from_email=" email-server-type={{this}}><i class="icon-google-plus" style="margin-right:4px;font-size: 1.2em"></i>{{this}} (Shared)</a>
	</li>
	{{/each}}
	{{/if}}
	{{#if sharedImapUserNames}}
	{{#each sharedImapUserNames}}
	<li>
	<a href="" class="agile-emails" email-server="imap" data-url="core/api/imap/imap-emails?from_email=" email-server-type={{this}}><i class="icon-envelope-alt" style="margin-right:4px;font-size: 1.2em"></i>{{this}} (Shared)</a>
	</li>
	{{/each}}
	{{/if}}
	{{#if sharedExchangeUserNames}}
	{{#each sharedExchangeUserNames}}
	<li>
	<a href="" class="agile-emails" email-server="exchange" data-url="core/api/office/office365-emails?from_email=" email-server-type={{this}}><i class="icon-windows" style="margin-right:4px;font-size: 1.2em"></i>{{this}} (Shared)</a>
	</li>
	{{/each}}
	{{/if}}
	</ul>
	
	<label id="has_email_configured" style="display:none">{{#if hasEmailAccountsConfigured}}{{hasEmailAccountsConfigured}}{{else}}false{{/if}}</label>
	
	</div>
	</div>
	<div class="clearfix"></div>
</script>
<script id="email-social-collection-template" type="text/html">
{{#unless this.length}}
    <div class="slate" style="margin-top:10px">
            <div class="slate-content">
                <div class="box-left">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right">
                    <h3>You have no emails for {{contactShortName}}.</h3>
                    <div class="text">
                        You have no emails for {{contactShortName}} in {{read_global_var}} account.
                    </div>
                    {{#if_email_type_is_agile "agilecrm"}}
                    <a href="#send-email/{{getCurrentContactProperty "email"}}" class="btn blue btn-slate-action"><i class="icon-plus-sign"></i> Send Email</a>
                    {{/if_email_type_is_agile}}
                </div>
            </div>
        </div>
{{/unless}}
        
{{#if this.length}}
       <ul id="email-prefs-verification" style="margin-top:-5px;display:none;">
            <div class="alert danger info-block" style="color: black;background-color: rgb(255,255,204);border: 1px solid rgb(211,211,211);">
                <div>
                <i class="icon-warning-sign"></i><strong style="">PENDING EMAIL CONFIGURATION.</strong>
                <p>You have not yet configured your email. Please click <a href='#email'>here</a> to get started.</p>
                </div>
            </div>
        </ul>
	<ul id="email-social-model-list" class="ativity-block-ul"></ul>
	<table style="margin-top:18px">
	</table>
{{/if}}
</script>

<!-- Imap-Email model -->
<script id="email-social-model-template" type="text/html">
<div style="display:block;0 1px 2px rgba(0,0,0,0.05)">
	<div class="activity-text-block">
	{{#if errormssg}}
    <span style="color:red;">Error: {{errormssg}}</span>
    {{else}}
    <span class="activity-block-owner">	
			<img class="user-img thumbnail" width="40" height="40" src="{{#extractEmail from}}{{emailGravatarurl 40 this}}{{/extractEmail}}">
	</span>
		<div id="email-reply-div">
        
			<h4>
	{{#containString owner_email from}}
			<i class="icon-reply"></i>
		{{else}}
			<i class="icon-share-alt icon-flip-vertical"></i>
	{{/containString}}

    {{#if trackerId}}
        {{#if_equals "true" is_email_opened}}
            <i class="icon-folder-open-alt" title="Email Opened"></i>
        {{/if_equals}}
    {{/if}}
				<a class="email-subject" id={{id}} style="font-weight:bold" href="#collapse-{{id}}">{{subject}}</a>

			</h4></br>
			<div style="height:70px;margin-bottom:5px" class="ellipsis-multi-line collapse-{{id}}">
				<div>
					<div class="email-body">{{{message}}}</div>
				</div>
      		</div>
			<div id="collapse-{{id}}" class="collapse activity-email-collapse">
				<ul class="email-headers">
                	<li><strong>From:</strong> {{from}}</li> 
						
                	<li>
						<div class="caption to-emails" data-to="{{to}}" id="tl-mail-to-popover" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden" rel="popover" data-placement="right" data-content="message:" data-trigger="hover">
							<strong>To:</strong> {{to}}
						</div>
					</li>
                    {{#if cc}}
                    <li>
                    <div class="caption cc-emails" data-cc="{{cc}}" id="tl-mail-to-popover" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden" rel="popover" data-placement="right" data-content="message:" data-trigger="hover">
                    	<strong>Cc:</strong> {{cc}}
            		</div>
          			</li>
					{{/if}}

                    {{#if bcc}}
                    <li>
            		<div class="caption bcc-emails" data-bcc="{{bcc}}" id="tl-mail-to-popover" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden" rel="popover" data-placement="right" data-content="message:" data-trigger="hover">
              			<strong>Bcc:</strong> {{bcc}}
            		</div>
          			</li>
                    {{/if}}
           		</ul>
       			<div style="margin-top:10px" class="email-body">{{#if message}}{{{message}}}{{/if}}</div>
    		</div>
		<div style="padding-top: 5px;">
		<small class="edit-hover"> 
			<time class="email-sent-time" datetime="{{epochToHumanDate "" date_secs}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" date_secs}}</time>
		</small>

		<a href="#" data-from ="{{#extractEmail from}}{{this}}{{/extractEmail}}" id='email-reply' style="float: right; text-decoration: none; display:none;"><i class="icon-mail-reply-all"></i> Reply</a>
       
{{/if}}
	</div>	
</div>
</script><script id="contact-events-collection-template" type="text/html">
		{{#unless this.length}}
        <div class="slate">
            <div class="slate-content">
                <div class="box-left">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right">
                    <h3>You have no events for {{contactShortName}}.</h3>
                    <div class="text">
                        You can add a event related to a contact.
                    </div>
                    <a href="#" class="btn blue btn-slate-action contact-add-event"><i class="icon-plus-sign"></i>  Add Event</a>
                </div>
            </div>
        </div>
        {{/unless}}
        {{#if this.length}}
	<div class="page-header" style="margin-top: 0px !important">
		<a href="#" class="btn right contact-add-event" style="position:relative"><span><i class='icon-plus-sign'/></span> Add Event</a>
	</div>
			<ul id="contact-events-model-list" class="ativity-block-ul"></ul>
		{{/if}} 
</script>

<script id="contact-events-model-template" type="text/html">

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
	<div style="margin-bottom: 9px;"><h4 class="event-title" style="display:inline;"><b style="margin:0px 20px 20px 0px;">{{title}}</b><span class="label label-{{task_label_color color}}">{{event_priority color}}</span></h4></div>

  <div style="">
	<p>
		<span>StartTime : <time class="event-created-time" datetime="{{epochToHumanDate "" start}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" start}}</time></span>
		{{#if allDay}} ( all day )
		{{else}}
		<span style="margin-left:22px;">EndTime : <time class="event-created-time" datetime="{{epochToHumanDate "" end}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" end}}</time></span>
		{{/if}}
	</p>
	<div class="clear">
		<div style="margin-bottom: 9px;">	
		{{#each contacts}}
           	{{#if id}}
				{{#isDuplicateContactProperty properties "email"}}

					{{else}}
						{{#if_contact_type "PERSON"}}	
							<a href="#contact/{{id}}">{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}</a>,
        				{{/if_contact_type}}
						{{#if_contact_type "COMPANY"}}
        					<a href="#contact/{{id}}">{{getPropertyValue properties "name"}}</a>,
        				{{/if_contact_type}}
				{{/isDuplicateContactProperty}}
           		
           	{{/if}}
       	{{/each}}
		</div>
		 <small class="edit-hover" style="margin-right:10px"> 
			<time class="event-created-time" datetime="{{epochToHumanDate "" created_time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time>
		</small>
		<span class="actions pull-right">
			<a title="Edit"  data="{{id}}" class="event-edit-contact-tab" style="cursor:pointer;text-decoration: none;padding-right:10px"> <i class="icon-pencil"></i> </a>
            <a title="Delete" style="cursor:pointer;text-decoration: none"><span class="activity-delete icon-trash" id="{{id}}" url="core/api/events/bulk"><i></i></span></a>
        </span>
	</div>
  </div>
</div>
</div>

</script><script id="notes-collection-template" type="text/html">
{{#unless this.length}}
        <div class="slate">
            <div class="slate-content">
                <div class="box-left">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right">
                    <h3>You have no notes for {{contactShortName}}.</h3>
                    <div class="text">
                        You can save specific information about contacts as a Note.
                    </div>
                    <a href="#noteModal" data-toggle="modal" class="btn blue btn-slate-action contact-add-note"><i class="icon-plus-sign"></i>  Add Note</a>
                </div>
            </div>
        </div>
        {{/unless}}
{{#if this.length}}
<div class="page-header" style="margin-top: 0px !important">
   <a href="#noteModal" data-toggle="modal" class="btn right contact-add-note" style="position:relative"><span><i class='icon-plus-sign'/></span> Add Note</a> 
</div>
	<ul id="notes-model-list" class="ativity-block-ul"></ul>
{{/if}}
</script>
<script id="notes-model-template" type="text/html">
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
		<pre style="background-color:#fff;margin-bottom:0px;border:none;font-family:'PT Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;">{{show_link_in_statement description}}</pre>
	</div>	
<div class="clearfix"></div>
	 	<div class="clear" style="margin-top:9px">
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
			<a title="Edit"  data="{{id}}" data-toggle="modal" class="edit-note" style="cursor:pointer;text-decoration: none;padding-right:10px"> <i class="icon-pencil"></i> </a>
            <a title="Delete" style="cursor:pointer;text-decoration: none"><span class="activity-delete icon-trash" id="{{id}}" url="core/api/contacts/notes/bulk"></span></a>
        </span>
	</div>
</div>
</div>
</script>
<script id="stats-collection-template" type="text/html">
{{#unless this.length}}
        <div class="slate">
            <div class="slate-content">
                <div class="box-left">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right">
                    <h3>{{contactShortName}} has no web activity.</h3>
                    <div class="text">
						May be {{contactShortName}} did not visit the required page yet.
                    </div>
                </div>
            </div>
        </div>
        {{/unless}}

{{#if this.length}}
<div style="margin-left: 25px">
	<span>
		<h5>
	  	    <a style="text-decoration: none"><b>Initial Referrer URL</b></a><img border="0" src="/img/help.png"
		    style="height: 6px; vertical-align: text-top" rel="popover"
			data-placement="bottom" data-title="Referrer URL"
			data-content="This is the web page from where this contact has come to your website the very first time."
			id="element" data-trigger="hover"> : {{checkOriginalRef "original_ref"}} {{#if this.length}}{{queryWords "original_ref"}}{{/if}}
		</h5>
	</span>	
</div>
	<ul id="stats-model-list" class="ativity-block-ul"></ul>
{{/if}}

</script>

<!-- Web Stats model -->
<script id="stats-model-template" type="text/html">
<div style="display:block;" class="activity">
	<div class="activity-text-block">
		<br>
		<h4 style="display:inline;"><b>Page View Analytics</b></h4>
        {{#if user_agent}}
			{{#stringToJSON this "parsedUserAgent"}}
        	<span style="float:right;">
				{{#if device_type}}
              		<img class="" src="/img/web-stats/devices/{{device_type}}.png" style="display: inline; margin-right: 2px;padding-left: 2px;" title="{{device_type}}">
				{{/if}}
				{{#if os}}
                	<img class="" src="/img/web-stats/os/{{normalize_os os}}.png"  style="display: inline; margin-right: 2px;padding-left: 2px;" title="{{os}}">
				{{/if}}
				{{#if browser_name}}
		      		<img class="" src="/img/web-stats/browsers/{{browser_name}}.png" style="display: inline; margin-right: 2px;" title="{{browser_name}}">
				{{/if}}
        	</span>
       		{{/stringToJSON}}
        {{/if}}
        <br>
        <br>
        <div style="margin-bottom:5px" id="truncated-webstats">
		    <ul style="list-style: none;">
			    <li class="row-fluid">	
					{{#stringToJSON this "urls_with_time_spent"}}
                    <div class="span3"><b>Pages Visited ({{this.length}})</b>
						<div class="pull-right">:</div>
					</div>
							
					{{#if_more_urls this this.length}}		
						<div class="span9 limited-page-urls" style="margin-left: 10px; word-break: break-all;">
                    		{{#each this.urls}}{{url}} - {{convertSecondsToHour time_spent}}<br/>{{/each}}
						</div>

                     {{else}}
						<div class="span9" style="margin-left: 10px; word-break: break-all;">{{#each this}}{{url}} - {{convertSecondsToHour time_spent}}<br/>{{/each}}</div>
                     {{/if_more_urls}}

                    {{/stringToJSON}}
				</li>
             </ul>  
      	</div>

<div id="complete-webstats" style="display:none;">
		<ul style="list-style: none;">
			<li class="row-fluid">	
					{{#stringToJSON this "urls_with_time_spent"}}
                    <div class="span3">
						<b>Pages Visited ({{this.length}}){{/stringToJSON}}</b>
						<div class="pull-right">:</div>
					</div>

					{{#stringToJSON this "urls_with_time_spent"}}	
					<div class="span9" style="margin-left: 10px; word-break: break-all;">
					{{#each this}}{{url}} - {{convertSecondsToHour time_spent}}<br/> {{/each}}
					</div>

                    {{/stringToJSON}}
				</li>  
 
                {{#if ref}}
                <li class="row-fluid">	
					<div class="span3"><b>Referred</b>
						<div class="pull-right">:</div>
					</div>
							
					<div class="span9" style="margin-left: 10px;">
						{{ref}}
					</div>
				</li>
               {{/if}}
               
               {{#if ip}}
				<li class="row-fluid">	
					<div class="span3"><b>IP Address</b>
						<div class="pull-right">:</div>
					</div>		
					<div class="span9" style="margin-left: 10px;">
						{{ip}}
					</div>
				</li>
               {{/if}}

			   {{#if city}}
                <li class="row-fluid">	
					<div class="span3"><b>Location</b>
						<div class="pull-right">:</div>
					</div>		
					<div class="span9" style="margin-left: 10px;">
						{{ucfirst city}}, {{ucfirst region}}, {{getCountryName country}}
					</div>
				</li>
               {{/if}}
		</ul>
</div>
	<div class="clear">
		<small class="edit-hover" style="margin-right:10px">
			<time class="stats-created-time" datetime="{{epochToHumanDate "" created_time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time>
		</small>	
        <a href="#" id="more-page-urls" style="float: right;">More</a>
	</div>
</div>
</div>
</script><script id="contact-tasks-collection-template" type="text/html">
		{{#unless this.length}}
        <div class="slate">
            <div class="slate-content">
                <div class="box-left">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right">
                    <h3>You have no tasks for {{contactShortName}}.</h3>
                    <div class="text">
                        You can add a task related to a contact for calling, email, follow-up etc.
                    </div>
                    <a href="#" class="btn blue btn-slate-action contact-add-task"><i class="icon-plus-sign"></i>  Add Task</a>
                </div>
            </div>
        </div>
        {{/unless}}
        {{#if this.length}}
	<div class="page-header" style="margin-top: 0px !important">
		<a href="#" class="btn right contact-add-task" style="position:relative"><span><i class='icon-plus-sign'/></span> Add Task</a>
	</div>
			<ul id="contact-tasks-model-list" class="ativity-block-ul" url="core/api/notes/bulk"></ul>
		{{/if}} 
</script>

<script id="contact-tasks-model-template" type="text/html">

<div class="activity" style="display:block;">
	{{#if is_complete}}
		<div class="activity-text-block" style="background-color:#FFFAFA">
	{{else}}
		<div class="activity-text-block">
	{{/if}}	
	<span class="activity-block-owner">
		{{#if ownerPic}}
			<img class="user-img thumbnail" width="40" height="40" alt="" src="{{ownerPic}}" >
		{{else}}
			<img class="user-img thumbnail" width="40" height="40" src="{{defaultGravatarurl 40}}">
		{{/if}}
		<span class="owner-name">{{taskOwner.name}}</span>
	</span>
	{{#if is_complete}}
			<div style="margin-bottom: 9px;"><span>&#10004;</span><h4 class="task-subject" style="text-decoration:line-through;display:inline;"><b style="margin:0px 20px 0px 10px;"><a href="#task/{{id}}">{{subject}}</a></b>{{#if_equals priority_type "NORMAL"}}{{else}}
					<span class="label label-{{task_label_color priority_type}}">{{ucfirst priority_type}}</span>
				{{/if_equals}}</h4></div>
		{{else}}
			<div style="margin-bottom: 9px;"><input data="{{id}}" class="complete-task" type="checkbox"/><h4 class="task-subject" style="display:inline;"><b style="margin:0px 20px 0px 10px;"><a href="#task/{{id}}">{{subject}}</a></b>{{#if_equals priority_type "NORMAL"}}{{else}}
					<span class="label label-{{task_label_color priority_type}}">{{ucfirst priority_type}}</span>
				{{/if_equals}}</h4></div>
	{{/if}}
  <div style="margin-left:22px;">
	<p><i class="{{icons type}}"></i>&nbsp;{{ucfirst type}}<span style="margin-left:20px;">Due : <time class="task-created-time" datetime="{{epochToHumanDate "" due}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy h:MM TT" due}}</span></p>
	<div class="clear">
		<div style="margin-bottom: 9px;">	
		{{#each contacts}}
           	{{#if id}}
				{{#isDuplicateContactProperty properties "email"}}

					{{else}}
						{{#if_contact_type "PERSON"}}	
							<a href="#contact/{{id}}">{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}</a>,
        				{{/if_contact_type}}
						{{#if_contact_type "COMPANY"}}
        					<a href="#contact/{{id}}">{{getPropertyValue properties "name"}}</a>,
        				{{/if_contact_type}}
				{{/isDuplicateContactProperty}}
           		
           	{{/if}}
       	{{/each}}
		</div>
		 <small class="edit-hover" style="margin-right:10px"> 
			<time class="task-created-time" datetime="{{epochToHumanDate "" created_time}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time>
		</small>
		<span class="actions pull-right">
			<a title="Edit"  data="{{id}}" class="task-edit-contact-tab" style="cursor:pointer;text-decoration: none;padding-right:10px"> <i class="icon-pencil"></i> </a>
            <a title="Delete" style="cursor:pointer;text-decoration: none"><span class="activity-delete icon-trash" id="{{id}}" url="core/api/tasks/bulk"><i></i></span></a>
        </span>
	</div>
  </div>
</div>
</div>

</script><script id="contact-detail-template" type="text/html">
<!-- previous next actions -->

<!-- ending previous next actions -->
<!--  header span12 row view starting -->
<div class="row">
<div class="span12">
		<div style="margin-bottom:20px;margin-top:25px;">
			<div class="row-fluid" style="border-bottom: 1px solid #ddd;padding-bottom: 10px;">
				<div>
					<div>
					<div class="span10">
<!-- starting profile pic -->
						<div style="float: left;width: 100px;">
							<form style='display: inline; padding-right: 10px; height: auto;'
								id="contact-container">
								<a href="#" class="tooltip_info" data-placement="top"
									data-toggle="tooltip"
									title="<i class='icon-edit icon-white icon'></i> Change Picture"
									style='text-decoration: none;'> <img
									class='upload_pic imgholder submit contact-profpic' type="submit"
									src="{{gravatarurl properties 80}}"
									style='display: inline;' />
								</a> <input type="hidden" id="upload_url" name="gravatarurl">
								<a style="display: none;" class="save_img submit" type="submit">Save</a>
							</form>
						</div>
						<!--  ending profile pic -->
						<!--  starting title, company  -->
						<div style='margin-top:2px;float: left;vertical-align: middle;margin-left: 4px;' class="span10">
							<div>
							<div>	
							<div class="pull-left contact-profile-name mg-r-md">
								{{getPropertyValue properties
										"first_name"}} {{getPropertyValue properties "last_name"}}
								 <!-- {{#if_propertyName "email"}}</br> <a href='#send-email/{{value}}'>{{value}}</a>{{/if_propertyName}} -->
								</div>
								<div class="pull-left mg-r-md">
								<div id='star' class="contact-star"></div>
								</div>
								<!--  starting score -->
						<div class="pull-left unselectable" id="score" unselectable="on"
							onselectstart="return false">
							<div  class="score-view">
								<img src="../../img/flame.png" style="width:13px;height:13px;"> <span style="vertical-align: text-top; margin-left: -5px">
									<img border="0" src="/img/help.png"
									style="height: 6px; vertical-align: middle" rel="popover"
									data-placement="bottom" data-title="Lead Score"
									data-content="Score your leads to get high quality leads to appear on top. Manually assign scores or automate the process based on user behavior using Workflow automation."
									id="element" data-trigger="hover">
								</span>
							
								<span style="display: inline-block; vertical-align: middle">
									{{#if lead_score}} <span id="lead-score">{{lead_score}}</span>&nbsp;
									{{else}} <span id="lead-score">0</span>&nbsp;
									{{/if}}
								</span>
							{{#canEditContact owner.id}}
								<span class="contact-score-control">
									<ul
										style="display: inline-block; list-style-type: none; margin:0px">
										<li style="height: 9px"><i class="icon-sort-up" id="add"
											style="height: 10px; cursor: pointer"></i></li>
										<li style="position:relative,top:-2px;"><i class="icon-sort-down" id="minus"
											style="height: 10px; cursor: pointer"></i></li>
									</ul>
								</span>
							{{/canEditContact}}
							</div>
						</div>
						<!--  ending score -->
								<div class="clearfix"></div>
								<div class="contact-title">
							<div class="contact-job-title contact-overflow-ellipsis">{{#if_propertyName "title"}} {{value}}{{/if_propertyName}}</div>
								<div style="padding:0 4px 0 0px"> {{#comma_in_between_property "title" "company" properties}}{{/comma_in_between_property}}</div>

<div class="contact-company-name contact-overflow-ellipsis">								
{{#if contact_company_id}} 
									<a href="#contact/{{contact_company_id}}" class="contact-overflow-ellipsis">{{getPropertyValue properties "company"}}</a>
								{{else}}
									{{getPropertyValue properties "company"}}
								{{/if}}
</div>
<div class="clearfix"></div>
								</div>
		<div  style="padding-top: 5px; margin: 0px;" class="contact-website">
									{{#property_is_exists "website" properties}}
									{{#multiple_Property_Element "website" properties}} {{#each
									this}} {{#if_equals subtype "TWITTER"}} <span
										style="margin-right: 5px"><a target="_blank"
										href="https://twitter.com/{{getTwitterHandleByURL value}}"
										style="text-decoration: none"> <i
											class="{{get_social_icon "
											TWITTER"}}" style="font-size: 1.4em !important"></i>
									</a>
									</span> {{else}}  {{#if_equals subtype "SKYPE"}} <span
										style="margin-right: 5px"><a target="_blank"
										href="{{getSkypeURL value}}"
										style="text-decoration: none"> <i
											class="{{get_social_icon "
											SKYPE"}}" style="font-size: 1.4em !important"></i>
									</a>
									</span>{{else}} {{#if_equals subtype "FACEBOOK"}} <span
										style="margin-right: 5px"><a target="_blank"
										href="{{buildFacebookProfileURL value}}"
										style="text-decoration: none"> <i
											class="{{get_social_icon "
											FACEBOOK"}}" style="font-size: 1.4em !important"></i>
									</a>
									</span>{{else}}

								{{#if_equals subtype "GOOGLE-PLUS"}} <span
										style="margin-right: 5px"><a target="_blank"
										href="https://plus.google.com/{{getTwitterHandleByURL value}}/"
										style="text-decoration: none"> <i
											class="{{get_social_icon "
											GOOGLE-PLUS"}}" style="font-size: 1.4em !important"></i>
									</a>
									</span>{{else}}
									<span style="margin-right: 5px"> <a
										target="_blank" href="{{getHyperlinkFromURL value}}" style="text-decoration: none">
											<i class="{{get_social_icon subtype}}"
											style="font-size: 1.4em !important"></i>
									</a>
									</span> {{/if_equals}} {{/if_equals}} {{/if_equals}} {{/if_equals}} {{/each}} {{/multiple_Property_Element}}
									{{/property_is_exists}}
								</div>						
							<div class="clearfix"></div>	
								
								<div>
				<div class="contact-tags">
					<ul id="added-tags-ul" class="tagsinput"
						style="display: inline; vertical-align: top; margin-bottom: 10px">
							{{#if tagsWithTime.length}} 
							 {{#canEditContact owner.id}}
								{{#each tagsWithTime}}
										<li style="display: inline-block;" class="tag" data="{{this.tag}}"><span><a
								class="anchor" href="#tags/{{encodeString this.tag}}">{{this.tag}}</a><a
								class="close remove-tags" tag="{{this.tag}}">&times</a></span></li> 
								{{/each}}
								{{else}}
									{{#each tagsWithTime}}
										<li style="display: inline-block;" class="tag" data="{{this.tag}}"><span><a
											class="anchor" href="#tags/{{encodeString this.tag}}">{{this.tag}}</a></span></li> 
									{{/each}}
							 {{/canEditContact}}
							{{/if}}
						 
						
					</ul>
					<div style="display: inline-block; margin-top: 3px;">
						<div id="addTagsForm" style="display: none; margin-bottom: 0px;">
							<div class="control-group save-tag" style="margin-bottom: 0px">
								<input name="" type="text" id="addTags"
									class="tags-typeahead ignore-comma-keydown"
									style="margin-bottom: -1px; width: 60%" placeholder="Enter tag" />
								<span><a href="#" class="btn" id="contact-add-tags"
									style="margin-left: 10px; margin-right: 5px">Add</a></span>
							</div>
						</div>
						{{#canEditContact owner.id}}
			<a href="#" id="add-tags" rel="tooltip"
							data-original-title="addtag" data-placement="top"><i
							class="icon-plus-sign"></i> <span>Add tags</span></a>
						{{/canEditContact}}

						
					</div>
				</div>
			</div>
								
								
							</div>
						</div>
						</div>
						</div>
						<!--  ending title,company -->
						<div class="span2">
						<div class="pull-right" style="width:100%;position:relative;">
<div class="contact-navigation-view"><span class="navigation  contact-switching"></span></div>
<div class="clearfix"></div>
						<!--  starting rating,edit,owner -->
						<div>
							<div class="btn-group right">
								
								<a class="btn" style="border-radius: 4px 0px 0px 4px!important;margin-left: 6px;" href='#contact-edit'><i class="icon-edit"></i> Edit</a>
								<a class="btn dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
								<ul class="dropdown-menu pull-right">

									<li><a href='#' class="contact-add-note"><i
											class="icon-file"></i> Add Note</a></li>
									<li><a href='#' class="contact-add-task"><i
											class="icon-tasks"></i> Add Task</a></li>
									{{#hasMenuScope 'DEALS'}}
									<li><a href='#' class="contact-add-deal"><i class="icon-money"></i>
											Add Deal</a></li>
									{{/hasMenuScope}}
							{{#canEditContact owner.id}}
									<li class='divider'></li>
									{{#hasMenuScope 'CAMPAIGN'}}
									<li><a href='#bulk-campaigns' class="contact-add-campaign"
										id="contact-add-campaign"><i class="icon-sitemap"></i> Add
											to Campaign</a></li>
									{{/hasMenuScope}}
									<li><a href='#send-email{{#if_propertyName "email"}}/{{value}}{{/if_propertyName}}' id="contact-send-email"><i
											class="icon-envelope-alt"></i> Send Email</a></li>

									<li class='divider'></li>
									<li><a href='#contact-duplicate'><i class="icon-copy"></i>
											Duplicate</a></li>
											
									<li><a href='#duplicate-contacts/{{id}}'><i class="icon-code-fork"></i>
											Merge Duplicates</a></li>
											<li class='divider'></li>

							
									<li><a href='#' id='contact-actions-delete'><i
											class="icon-trash"></i> Delete</a></li>
								{{/canEditContact}}
									

                                    {{#property_is_exists "phone" properties}}
                                    <li style="display:none;"><a href='#' class="make-call" style="display:none;" fname="{{getPropertyValue properties
										"first_name"}}" lname="{{getPropertyValue properties "last_name"}}" image="{{getPropertyValue properties
										"image"}}" phone="{{getPropertyValue properties "phone"}}"><i class="icon-phone"></i> Call</a></li>
                                    {{/property_is_exists}}
								</ul>
							</div>
						</div>
						<!--  ending rating,edit,owner -->
						
						<!-- Owner block -->
				<div class="clearfix"></div>
					<div  class="contact-owner-position">
						<div class="change-owner-succes"></div>
     <span title="Owner" class="contact-owner-view">
      	<span class="contact-owner" id="change-owner-element">
        	<span class="contact-owner-text">Owner:&nbsp;&nbsp;</span>
			{{#if owner}}
        	<span class="contact-owner-pic"><img class="user-img"  alt="" src="{{defaultGravatarurl 40}}" /></span>
			{{else}}
			<span class="contact-owner-pic"><img class="user-img"  alt="" src="{{defaultGravatarurl 40}}" /></span><span class="contact-owner-add" style="font-size:13px;"><a style="cursor:pointer;">Assign Owner</a></span>
 			{{/if}}
        	<span id="contact-owner" data={{owner.id}} class="contact-owner-name">{{owner.name}}</span>
        
        	{{#canEditContact owner.id}}
        	<div class="btn-group" id="change-owner-ul" style="vertical-align: middle; display: none">
        		 <a class="btn dropdown-toggle" data-toggle="dropdown">Change Owner <span class="caret"></span></a>
        		 <ul id='contact-detail-owner' class="dropdown-menu pull-right"></ul>
        	</div> 
			{{/canEditContact}}
       </span>
    </span>
					</div>
					</div>
					<!--  ending owner block -->
						
						
</div>
					</div>
<div class="clearfix"></div>
					
					<div class="clearfix"></div>
				</div>

			</div>
			
		</div>
		</div>
		</div>
		<!--  ending top header span12 view -->
		
		<!--  starting middle view row -->
		<div class="row">
		<!--  starting time line view -->
		<div class="span9" id="contacts-inner-tabs">
			<ul class="nav nav-tabs" id="contactDetailsTab">
				<li class=""><a data-toggle="tab" href="#timeline">Timeline</a></li>
				<li class=""><a data-toggle="tab" href="#notes">Notes</a></li>
				<li class=""><a data-toggle="tab" href="#events">Events</a></li>
				<li class=""><a data-toggle="tab" href="#tasks">Tasks</a></li>
				<li class=""><a data-toggle="tab" href="#deals">Deals</a></li>
				<li class=""><a data-toggle="tab" href="#cases">Cases</a></li>
				<li class=""><a data-toggle="tab" href="#campaigns">Campaigns</a></li>
				<li class=""><a data-toggle="tab" href="#stats">Web Stats</a></li>
				<li class=""><a data-toggle="tab" href="#mail">Mail</a></li>
				<li class=""><a data-toggle="tab" href="#documents">Documents</a></li>
			</ul>
			<div class="tab-content" id="contact-tab-content">
				<div class="tab-pane" id="time-line">
					<div class="timeline-loading-img" style="width:35px;max-height:30px;overflow:hidden;">
						<img class="loading-img" src="img/21-0.gif"></img>
						<!-- <img class="loading-img-log" src="img/21-0.gif"></img>
						<img class="loading-img-email" src="img/21-0.gif"></img>
						<img class="loading-img" src="img/21-0.gif"></img>
						<img class="loading-img-stats" src="img/21-0.gif"></img> -->
					</div>

					<div class="slate" id="timeline-slate"
						style="margin-top: 30px; display: none">
						<div class="slate-content">
							<div class="box-left">
								<img alt="Clipboard" src="/img/clipboard.png" />
							</div>
							<div class="box-right">
								<h3>{{getPropertyValue properties "first_name"}} has no
									entities (Notes, Tasks, Deals and etc..) related, to show in
									the Timeline.</h3>
								<div class="text">You can add entities related to it by
									selecting suitable option from the above "actions" drop down
									button.</div>
								<a href="#">Click here to learn more</a> <br />
							</div>
						</div>
					</div>

					<div style="margin: auto; width: 700px">
						<div id="timeline">
							<div id="line-container">
								<div id="line"></div>
							</div>
						</div>
					</div>
				</div>
				<div class="tab-pane" id="notes"><img src="img/21-0.gif"></img></div>
				<div class="tab-pane" id="events"><img src="img/21-0.gif"></img></div>
				<div class="tab-pane" id="tasks"><img src="img/21-0.gif"></img></div>
				<div class="tab-pane" id="deals"><img src="img/21-0.gif"></img></div>
				<div class="tab-pane" id="cases"><img src="img/21-0.gif"></img></div>
				<div class="tab-pane" id="campaigns"><img src="img/21-0.gif"></img></div>
				<div class="tab-pane" id="stats"><img src="img/21-0.gif"></img></div>
				<div class="tab-pane" id="mail" style="min-height: 20em">
					<!-- <img src="img/21-0.gif"></img> -->
					<div id="mail-account-types"  style="display:none"></div>
					<div id="mails"></div>
			    </div>
				<div class="tab-pane" id="documents"><img src="img/21-0.gif"></img></div>
			</div>
		</div>
	<!--  ending timeline view -->

	<!--  starting right panel view -->
	<div class="span3 contact-right-widgetsview" style="padding-left:17px;box-sizing:border-box;border-left:1px solid #ddd;">


		{{#property_is_exists "phone" properties}}
			<div class="widget_container contact-rightpanel" id="{{name}}-container" style="/* padding-bottom:10px; */">
				{{else}} 
					{{#property_is_exists "email" properties}}
						<div class="widget_container contact-rightpanel" id="{{name}}-container">
						{{else}} 
							{{#property_is_exists "address" properties}}
									<div class="widget_container" id="{{name}}-container">
									{{else}}
										{{#getContactCustomProperties properties}}
											<div class="widget_container" id="{{name}}-container">
											{{else}}
												<div class="widget_container hide" id="{{name}}-container">
										{{/getContactCustomProperties }}
							{{/property_is_exists}} 
					{{/property_is_exists}}
		{{/property_is_exists}}
						<div class="widget_header">
							<div class="pull-left"
								style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width: 18em">
								<i class="icon-user " style="font-size:18px"></i>Contact
									<span style="text-transform:capitalize;">{{getPropertyValue properties "first_name"}}</span>
							</div>
						</div>
						<!-- <div id="qrcode"><img src="img/1-0.gif"></div> -->
						<!-- For refreshing the contact in the model list -->
						<div id="refresh_contact" style="display:none;margin:8px 23px 0px;font-size:13px;">This contact has been updated
							<a id="action_refresh_contact" style="cursor:pointer;">
								<i class="icon-refresh" rel="popover" data-placement="top" data-title="Refresh Contact" data-content="Click to get updated contact details." data-trigger="hover"></i>
							</a>
						</div>

						<div class="clearfix"></div>
						<div style='padding-top: 10px'>
							{{#property_is_exists "phone" properties}}
							<div  style="/* padding-bottom: 5px; */">
								{{#multiple_Property_Element "phone" properties}}
								<!-- <div style="display: inline-block; text-align: right" class="span4">
									<span><strong style="color: gray">Phone</strong><span>
								</div> -->
								<div class="contact-phone">
									{{#each this}}
									<div class="pull-left contact-phone-icon">
									<i class="icon icon-phone" style="font-size: 16px;padding-left: 0px;padding-top: 0px;position: relative;top:0px;left:0px;margin-right:7px;"></i>
									</div>
									<div class="pull-left contact-rightpanel-ellipsis" style="font-size:13px;margin-bottom:4px;">
                                        <a href='#' class="contact-make-sip-call" style="display:none;" phone="{{value}}">
                                           {{value}}
                                        </a>            
                                        <a href='#' class="contact-make-twilio-call" style="display:none;"                                           
                                           phone="{{value}}">
                                           {{value}}
                                        </a>    
										<a href="tel:{{remove_spaces value}}" class="contact-make-call">{{value}}</a> 
                                        {{#if subtype}}<span class="label">{{subtype}}</span> {{/if}}
									</div>
									<div class="clearfix"></div>
									{{/each}}
								</div>
								{{/multiple_Property_Element}}
							</div>
							<div class="clearfix"></div>
							{{/property_is_exists}}
 							{{#property_is_exists "email" properties}}
							<div  style="margin-top:3px;">
								{{#multiple_Property_Element "email" properties}}
								<!-- <div style="display: inline-block; text-align: right" class="span4">
									<span><strong style="color: gray">Email</strong></span>
								</div> -->
								
								{{#property_is_exists "phone" ../properties}}
								<div
									 style="padding-right:0px!important;font-size:13px;line-height:20px;">
									
									<div class="contact-email">
									{{else}}
									
									<div  class="contact-email single-mail">
										{{/property_is_exists}} 
									{{#each this}}

<div class="pull-left contact-email-icon" style="margin-right:7px;"><i class="icon icon-envelope" style="font-size:13px;"></i></div>
										<div class="pull-left contact-email-multiline">
											<a href='#send-email/{{value}}'>{{value}}</a> {{#if subtype}} <span class="label">{{subtype}}</span> {{/if}}
										</div>

<div class="clearfix"></div>
									{{/each}}
									</div>
									</div>
								
									{{/multiple_Property_Element}}
								

								{{/property_is_exists}}

<div class="custom-data"> {{#getContactCustomPropertiesExclusively
								properties}}
								<div>
					<div class="contact-custom-icon pull-left" style="width:25px;"><i class="icon icon-info" style="font-size: 13px;margin-left:4px;"></i></div>			
								<div class="pull-left" style="width:90%;line-height:21px;">
									{{#each_with_index this}}


                                            <span class="contact-custom-name">
												<span style="color: gray" title="{{name}}">{{name}}</span>
											</span>

										
										{{#if_equals index ../this.length}}
											<span class="contact-custom-value">
											{{#if_equals subtype "DATE"}} <time class="note-created-time" datetime="{{epochToHumanDateInFormat "" value}}">{{epochToHumanDate "dd mmm yyyy" value}}</time>{{else}}{{value}} {{/if_equals}}</span>
										{{else}}
											<span class="contact-custom-value">
											{{#if_equals subtype "DATE"}} <time class="note-created-time" datetime="{{epochToHumanDateInFormat "" value}}">{{epochToHumanDate "dd mmm yyyy" value}}</time>{{else}}{{value}} {{/if_equals}}</span>
										{{/if_equals}}
										
										
											
<div class="clearfix"></div>
										
										
									{{/each_with_index}}
</div>
									</div>
									{{/getContactCustomPropertiesExclusively}}
									</div>
									<div class="clearfix"></div>

 									{{#property_is_exists "address" properties}}
										<div >{{#address_Element properties}}{{/address_Element}}</div>
                                        <div class="clearfix"></div>
										
                                        <div class="pull-left" style="margin-left:27px;margin-top:12px;width:245px;margin-bottom:7px;">
											<div id="map" style="width:auto; height: 200px; display: none; margin:0px 0px 0px;">
											</div>
                                            <div id="contacts-local-time" style="display:none;font-size: 11px;">                                             
                                               <div class="contacts-time" style="width:89%"></div>                                               
                                            </div>
										</div> 
                           	            <div class="clearfix"></div>                                        
									{{/property_is_exists}}

							

 </div>
							<div class="clearfix"></div>
                            </div>	

                           
							

							<div id="widgets" style="margin-top:15px;"></div>

							


								
							

						</div>
					</div>
					</div>
					</div>
					</div>
					
					<!--  ending mid  right panel view -->
					
					<!--  ending middle view row -->
					</script>  <script id="year-marker-template" type="text/x-handlebars-template">
    <div class="item year-marker">
      <div class="inner">
        <div class="inner2">
          <div class="timestamp">{{timestamp}}</div>
          <div class="year">{{year}}</div>
        </div>
      </div>
    </div>
  </script>

<script id="timeline-template" type="text/x-handlebars-template">
<div class="item post" id={{id}}>
    <div class="inner">
        {{#if_entity "note"}}
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-list-alt"></i></a></span> {{subject}}</h3></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                <pre class="text" style="color: #999999;background:none;border:none;">{{description}}</pre>
            </div>
        {{/if_entity}}

        {{#if_entity "task"}}
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-tasks"></i></a></span> Task</h3></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                <div class="caption" style="margin-top:-8px"><i class="{{icons type}}"></i> ({{type}})</div>         
                <div class="text" style="color: #333333">{{{subject}}}</div>
            </div>
        {{/if_entity}}

        {{#if_entity "contact_entity"}}
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-tasks"></i></a></span> Created</h3></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body" style="padding:5px">
                <div class="text" style="color: #333333" >{{epochToHumanDate "mmmm dd, yyyy 'at' hh:MM tt" created_time}}</div>
            </div>
        {{/if_entity}}
	
	  {{#if_entity "tag"}}
			<div id="{{remove_spaces tag}}-tag-timeline-element"></div>
            <div class="timestamp">{{createdTime}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-tag"></i></a></span> Tag Added - {{tag}}</h3></div>
            <div class="date">{{epochToTaskDate createdTime}}</div>
            <div class="body" style="padding:5px">
                <div class="text" style="color: #333333" >{{epochToHumanDate "mmmm dd, yyyy 'at' hh:MM tt" createdTime}}</div>
            </div>
        {{/if_entity}}

        {{#if_entity "agile_email"}}
            <div class="timestamp">{{createdTime}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-folder-open-alt" title="Email Opened"></i></a></span> Email Opened</h3></div>
            <div class="date">{{epochToTaskDate createdTime}}</div>
            <div class="body">
                <div style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden"><b>Subject:</b> {{subject}}</div>
                <div class="text" style="color: #999999" ><span><em>Sent on</em></span> {{epochToHumanDate "mmmm dd, yyyy 'at' hh:MM tt" trackerId}}</div>
                <div class="text" style="color: #999999" ><span><em>Opened on</em></span> {{epochToHumanDate "mmmm dd, yyyy 'at' hh:MM tt" createdTime}}</div>
            </div>
        {{/if_entity}}

        {{#if_entity "deal"}}
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-money"></i></a></span> Deal</h3></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                <div class="text" style="color: #333333">{{name}}</div>
                <div class="text" style="color: #999999">{{description}}</div>
            </div>
        {{/if_entity}}

		{{#if_entity "case"}}
			
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-folder-close"></i></a></span> Case</h3></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                <div class="text" style="color: #333333">{{title}}</div>
                <div class="text" style="color: #999999">{{description}}</div>
            </div>
        {{/if_entity}}

        {{#if_entity "log"}}
            <div class="timestamp">{{time}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-inbox"></i></a></span> {{titleFromEnums log_type}}</h3></div>
            <div class="date">{{epochToTaskDate time}}</div>
            <div class="body">
                <div class="caption" style="margin-top:-8px">Campaign - {{campaign_name}}</div>

            {{#if message}}
                    <div class="text" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden">{{#if_email_sent this "log_type"}} Subject: {{Subject}} {{else}} {{{message}}} {{/if_email_sent}}
                        <div class="right" data="{{#if_email_sent this "log_type"}} Subject: {{Subject}} {{else}} {{{message}}} {{/if_email_sent}}"><a href="#" id="tl-log-popover"><i class="icon-plus"></i></a></div>
                    </div>   
            {{/if}}        
            </div>
        {{/if_entity}}

        {{#if_entity "date"}}
            <div class="timestamp">{{date_secs}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-envelope"></i>
			{{#if trackerId}}
        		{{#if_equals "true" is_email_opened}}
        	    		<i class="icon-folder-open-alt" title="Email Opened"></i>
        		{{/if_equals}}
    		{{/if}}
            </a>
            </span> {{subject}}</h3></div>
            <div class="date">{{epochToTaskDate date_secs}}</div>
            <div class="body">
                <div class="caption" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden"><b>From:</b> {{from}}</div>
                <div class="caption" id="tl-mail-to-popover" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden" rel="popover" data-placement="right" data-content="message:" data-trigger="hover"><b>To:</b> {{to}}
                </div>
            
            {{#if message}}
                <div class="text"><div class="ellipsis-multi-line" id="autoellipsis" style="height:70px;"><div> <p>{{{message}}}</p></div></div>
                    <div class="right" data="{{message}}"><a href="#" id="tl-mail-popover"><i class="icon-plus"></i></a></div>
                </div> 
            {{/if}}       
            
			</div>
        
        {{/if_entity}}

     {{#if_entity "guid"}}
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-list-alt"></i></a></span> Web</h3></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                <div class="text" style="color: #333333">
                    <div class="ellipsis-multi-line" id="autoellipsis" style="height:70px;">
                        <div>
							<b>Pages Visited {{#stringToJSON this "urls_with_time_spent"}} ({{this.length}}){{/stringToJSON}}
								<span style="float: right;">
									{{#if user_agent}}
										{{#stringToJSON this "parsedUserAgent"}}
										{{#if device_type}}
											<img src="img/web-stats/devices/{{device_type}}.png" title="{{device_type}}">
									    {{/if}}
										{{#if os}}
											<img src="img/web-stats/os/{{normalize_os os}}.png" title="{{os}}">
										{{/if}}
										{{#if browser_name}}
                                        	<img src="img/web-stats/browsers/{{browser_name}}.png" title="{{browser_name}}">
										{{/if}}
                                        {{/stringToJSON}}
									{{/if}}
								</span>
							</b><br> 
                        {{#stringToJSON this "urls_with_time_spent"}}{{/stringToJSON}}
					    {{#each urls_with_time_spent}}{{url}} - {{convertSecondsToHour time_spent}}<br />{{/each}}
                        </div>
                    </div>
                </div>
                {{#if ref}}
                     <div class="text" style="color: #333333"><b>Referred:</b></br> {{ref}}</div>
                {{/if}}

                {{#if city}}
                   <div class="text" style="color: #333333"><b>ADDRESS:</b></br> {{ucfirst city}}, {{ucfirst region}}, {{getCountryName country}}</div>
                {{/if}}

                <div class="right" style="margin-top:-10px;"><a href="#" id="tl-analytics-popover"><i class="icon-plus"></i></a></div>
            </div>
     {{/if_entity}}

{{#if_entity "twilio"}}
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-phone" title="You Called"></i></a></span>{{title}}</h3></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                 <div class="text" style="color: #333333">{{name}}</div>
                <div class="text" style="color: #333333">{{body}}</div>
            </div>
        {{/if_entity}}

{{#if_entity "custom"}}
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-folder-open-alt" title="Email Opened"></i></a></span>{{title}}</h3></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                 <div class="text" style="color: #333333">{{name}}</div>
                <div class="text" style="color: #999999">{{body}}</div>
            </div>
        {{/if_entity}}
	<a href="#" class="open-close"></a>
  </div>
</div>
</script>


<script id="timeline1-template" type="text/x-handlebars-template">

{{#each this}}

<div class="item post" id={{id}}>
    <div class="inner">
        {{#if_entity "note"}}
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-list-alt"></i></a></span> {{subject}}</h3></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                <pre class="text" style="color: #999999;background:none;border:none;">{{description}}</pre>
            </div>
        {{/if_entity}}

        {{#if_entity "task"}}
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-tasks"></i></a></span> Task</h3></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                <div class="caption" style="margin-top:-8px"><i class="{{icons type}}"></i> ({{type}})</div>         
                <div class="text" style="color: #333333">{{{subject}}}</div>
            </div>
        {{/if_entity}}

        {{#if_entity "contact_entity"}}
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-tasks"></i></a></span> Created</h3></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body" style="padding:5px">
                <div class="text" style="color: #333333" >{{epochToHumanDate "mmmm dd, yyyy 'at' hh:MM tt" created_time}}</div>
            </div>
        {{/if_entity}}
	
	  {{#if_entity "tag"}}
			<div id="{{remove_spaces tag}}-tag-timeline-element"></div>
            <div class="timestamp">{{createdTime}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-tag"></i></a></span> Tag Added - {{tag}}</h3></div>
            <div class="date">{{epochToTaskDate createdTime}}</div>
            <div class="body" style="padding:5px">
                <div class="text" style="color: #333333" >{{epochToHumanDate "mmmm dd, yyyy 'at' hh:MM tt" createdTime}}</div>
            </div>
        {{/if_entity}}

        {{#if_entity "agile_email"}}
            <div class="timestamp">{{createdTime}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-folder-open-alt" title="Email Opened"></i></a></span> Email Opened</h3></div>
            <div class="date">{{epochToTaskDate createdTime}}</div>
            <div class="body">
                <div style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden"><b>Subject:</b> {{subject}}</div>
                <div class="text" style="color: #999999" ><span><em>Sent on</em></span> {{epochToHumanDate "mmmm dd, yyyy 'at' hh:MM tt" trackerId}}</div>
                <div class="text" style="color: #999999" ><span><em>Opened on</em></span> {{epochToHumanDate "mmmm dd, yyyy 'at' hh:MM tt" createdTime}}</div>
            </div>
        {{/if_entity}}

        {{#if_entity "deal"}}
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-money"></i></a></span> Deal</h3></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                <div class="text" style="color: #333333">{{name}}</div>
                <div class="text" style="color: #999999">{{description}}</div>
            </div>
        {{/if_entity}}

		{{#if_entity "case"}}
			
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-folder-close"></i></a></span> Case</h3></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                <div class="text" style="color: #333333">{{title}}</div>
                <div class="text" style="color: #999999">{{description}}</div>
            </div>
        {{/if_entity}}

        {{#if_entity "log"}}
            <div class="timestamp">{{time}}</div>
            <div class="title"><h3><span><a class="no-line"><i class={{#if_log_type_equals this "log_type" "EMAIL_SENT"}}"icon-envelope"{{else}} {{#if_log_type_equals this "log_type" "EMAIL_OPENED"}}"icon-folder-open-alt"{{else}}"icon-inbox"{{/if_log_type_equals}}{{/if_log_type_equals}}></i></a></span> {{titleFromEnums log_type}}</h3></div>
            <div class="date">{{epochToTaskDate time}}</div>
            <div class="body">
                <div class="caption" style="margin-top:-8px">Campaign - {{campaign_name}}</div>

            {{#if message}}
                    <div class="text" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden">{{#if_email_sent this "log_type"}} Subject: {{Subject}} {{else}} {{{message}}} {{/if_email_sent}}
                        <div class="right" data="{{#if_email_sent this "log_type"}} Subject: {{Subject}} {{else}} {{{message}}} {{/if_email_sent}}"><a href="#" id="tl-log-popover"><i class="icon-plus"></i></a></div>
                    </div>   
            {{/if}}        
            </div>
        {{/if_entity}}

        {{#if_entity "date"}}
            <div class="timestamp">{{date_secs}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-envelope"></i>
			{{#if trackerId}}
        		{{#if_equals "true" is_email_opened}}
        	    		<i class="icon-folder-open-alt" title="Email Opened"></i>
        		{{/if_equals}}
    		{{/if}}
            </a>
            </span> {{subject}}</h3></div>
            <div class="date">{{epochToTaskDate date_secs}}</div>
            <div class="body">
                <div class="caption" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden"><b>From:</b> {{from}}</div>
                <div class="caption" id="tl-mail-to-popover" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden" rel="popover" data-placement="right" data-content="message:" data-trigger="hover"><b>To:</b> {{to}}
                </div>
            
            {{#if message}}
                <div class="text"><div class="ellipsis-multi-line" id="autoellipsis" style="height:70px;"><div> <p>{{{message}}}</p></div></div>
                    <div class="right" data="{{message}}"><a href="#" id="tl-mail-popover"><i class="icon-plus"></i></a></div>
                </div> 
            {{/if}}       
            
			</div>
        
        {{/if_entity}}

     {{#if_entity "guid"}}
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-list-alt"></i></a></span> Web</h3></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                <div class="text" style="color: #333333">
                    <div class="ellipsis-multi-line" id="autoellipsis" style="height:70px;">
                        <div>
							<b>Pages Visited {{#stringToJSON this "urls_with_time_spent"}} ({{this.length}}){{/stringToJSON}}
								<span style="float: right;">
									{{#if user_agent}}
										{{#stringToJSON this "parsedUserAgent"}}
										{{#if device_type}}
											<img src="img/web-stats/devices/{{device_type}}.png" title="{{device_type}}">
										{{/if}}
										{{#if os}}
											<img src="img/web-stats/os/{{normalize_os os}}.png" title="{{os}}">
										{{/if}}
										{{#if browser_name}}
                                        <img src="img/web-stats/browsers/{{browser_name}}.png" title="{{browser_name}}">
										{{/if}}
                                        {{/stringToJSON}}
									{{/if}}
								</span>
							</b><br> 
                        {{#stringToJSON this "urls_with_time_spent"}}{{/stringToJSON}}
					    {{#each urls_with_time_spent}}{{url}} - {{convertSecondsToHour time_spent}}<br />{{/each}}
                        </div>
                    </div>
                </div>
                {{#if ref}}
                     <div class="text" style="color: #333333"><b>Referred:</b></br> {{ref}}</div>
                {{/if}}

                {{#if city}}
                   <div class="text" style="color: #333333"><b>ADDRESS:</b></br> {{ucfirst city}}, {{ucfirst region}}, {{getCountryName country}}</div>
                {{/if}}

                <div class="right" style="margin-top:-10px;"><a href="#" id="tl-analytics-popover"><i class="icon-plus"></i></a></div>
            </div>
     {{/if_entity}}

{{#if_entity "twilio"}}
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-phone" title="You Called"></i></a></span>{{title}}</h3></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                 <div class="text" style="color: #333333">{{name}}</div>
                <div class="text" style="color: #333333">{{body}}</div>
            </div>
        {{/if_entity}}

{{#if_entity "custom"}}
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><h3><span><a class="no-line"><i class="icon-folder-open-alt" title="Email Opened"></i></a></span>{{title}}</h3></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                 <div class="text" style="color: #333333">{{name}}</div>
                <div class="text" style="color: #999999">{{body}}</div>
            </div>
        {{/if_entity}}
	<a href="#" class="open-close"></a>
  </div>
</div>
{{/each}}
</script><div class="modal hide fade" id="timelineAnalyticsModal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3>Page Views Analytics</h3>
    </div>
    <div class="modal-body">
        <div id="analytics-in-detail"></div>
    </div>
</div><script id="dashboard-timline-template" type="text/html">
test
<div id="my-timeline"></div>	
</script><div class="modal hide fade" id="timelineLogModal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3>Campaign Log Details</h3>
    </div>
    <div class="modal-body">
        <div id="log-in-detail"></div>
    </div>
</div><div class="modal hide fade" id="timelineMailModal">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3>Mail Details</h3>
    </div>
    <div class="modal-body">
        <div id="mail-in-detail"></div>
    </div>
</div>