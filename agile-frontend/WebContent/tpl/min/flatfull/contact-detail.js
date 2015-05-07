  <script id="company-detail-template" type="text/html">
<div class="row hide"><small class="navigation span9" style="min-height:10px!important;font-size:smaller;line-height:6px;"></small></div>
<div class="app-content-full  h-full dock-view-fixing">
<div class="hbox hbox-auto-xs hbox-auto-sm bg-light ">
<div class="col w-xl bg-light lter b-r">
<div class="vbox">
<div class="row-row">
<div class="wrapper">
				<div class="text-center pos-rlt companyLeftView">
				
						
							<form id="contact-container">
								<a href="#" class="tooltip_info" data-placement="top"
									data-toggle="tooltip"
									title="<i class='icon-edit icon-white icon'></i> Change Picture"
									style='text-decoration: none;'> 
								<img class='img-circle upload_pic imgholder submit' style="width:96px;height:96px" type="submit"
									{{getCompanyImage "80" "display:inline;"}} />
								</a> <input type="hidden" id="upload_url" name="gravatarurl">
								<a style="display: none;" class="save_img submit" type="submit">Save</a>
							</form>
<div class="pos-abs pos-r-0 pos-t-0">
<div>
 
								<a class="dropdown-toggle" data-toggle="dropdown"><span class="fa fa-angle-down text-lg"></span></a>
								<ul class="dropdown-menu pull-right">
<li> <a href="#contact-edit"><i class="icon-edit"></i> Edit</a></li>
<li class="divider"></li>
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
						
					
							<div class="text-ellipsis  w-full  m-t-xs  h3 font-thin custom-color">

								{{getPropertyValue properties "name"}}
								{{#if_propertyName "url"}}</br>
									<a href="{{getHyperlinkFromURL value}}" target="_blank">{{value}}</a>
								{{/if_propertyName}}
								
								<div class="text-base text-center m-b-xs text-muted m-t-sm">
									{{#property_is_exists "website" properties}}
									{{#multiple_Property_Element "website" properties}} {{#each
									this}} {{#if_equals subtype "TWITTER"}} <span class="m-r-xs"><a target="_blank"
										href="https://twitter.com/{{getTwitterHandleByURL value}}"
										style="text-decoration: none" class="text-muted"> <i
											class="{{get_social_icon "
											TWITTER"}}" ></i>
									</a>
									</span> {{else}}  {{#if_equals subtype "SKYPE"}} <span
										style="margin-right: 5px"><a target="_blank"
										href="{{getSkypeURL value}}"
										style="text-decoration: none" class="text-muted"> <i
											class="{{get_social_icon "
											SKYPE"}}"></i>
									</a>
									</span>{{else}} <span style="margin-right: 5px"> <a
										target="_blank" href="{{getHyperlinkFromURL value}}" style="text-decoration: none" class="text-muted">
											<i class="{{get_social_icon subtype}}"></i>
									</a>
									</span>{{/if_equals}} {{/if_equals}} {{/each}} {{/multiple_Property_Element}}
									{{/property_is_exists}}
								</div>
							</div>
					
		
							
								<div id='star' style='padding-bottom: 13px; width: auto !important'></div>
								
				
					

					</div>
					<!-- Owner block -->
	<div clas="m-t-sm"><small class="text-muted text-sm">Owner</small></div>				
					<div class="change-owner-succes"></div>
     <div title="Owner" class="contact-owner-view">
      	<div class="contact-owner text-base" id="change-owner-element">
        	
			{{#if owner}}
        	<span class="contact-owner-pic" style="visibility:visible;"><img class="user-img"  alt="" src="img/company.png" /></span>
			{{else}}
			<span class="contact-owner-pic" style="visibility:hidden;"><img class="user-img"  alt="" src="img/company.png" /></span><span class="contact-owner-add" ><a class="c-p">Assign Owner</a></span>
 			{{/if}}
        	<a href="#" id="contact-owner" data={{owner.id}}  class="contact-owner-name">{{owner.name}}</a>
        
        	{{#canEditContact owner.id}}
        	<div class="dropdown" id="change-owner-ul" style="display: none">
        		 <a class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown">Change owner <span class="caret"></span></a>
        		 <ul id='contact-detail-owner' class="dropdown-menu"></ul>
        	</div> 
			{{/canEditContact}}
       </div>
    </div>
					
					
					

<!-- funda for contact details edit -->

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
						<div class="widget_header hide">
							<div class="pull-left"
								style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width: 18em">
								<i class="icon-user "></i> <strong>Contact
									{{getPropertyValue properties "first_name"}}</strong>
							</div>
						</div>
						<!-- <div id="qrcode"><img src="img/1-0.gif"></div> -->
						<div class="clearfix"></div>
						



							{{#property_is_exists "phone" properties}}
<div class="m-t-sm text-left"><small class="text-xs text-muted">Contact Info</small></div>
							<div class="text-left">
								{{#multiple_Property_Element "phone" properties}}
								
								<div class="custom-color text-sm">
									{{#each this}}
									
                                        <a href='#' class="contact-make-sip-call" style="display:none;"
                                           phone="{{value}}">
                                           {{value}}
                                        </a>            
                                        <a href='#' class="contact-make-twilio-call" style="display:none;"                                           
                                           phone="{{value}}">
                                           {{value}}
                                        </a>
										<a href="tel:{{value}}" class="contact-make-call">{{value}}</a> 
                                        {{#if subtype}}<span class="label bg-light dk text-tiny">{{subtype}}</span> {{/if}}
									
									{{/each}}
								</div>
								{{/multiple_Property_Element}}
							</div>
							{{/property_is_exists}}
 							{{#property_is_exists "email" properties}}
							<div class="text-left custom-color">
								{{#multiple_Property_Element "email" properties}}
								
								{{#property_is_exists "phone" ../properties}}
								
									{{else}}
<div class="m-t-sm text-left"><small class="text-xs text-muted">Contact Info</small></div>
									
										{{/property_is_exists}} 
									{{#each this}}
										<div>
											<a href='#send-email/{{value}}'>{{value}}</a> {{#if subtype}} <span class="label bg-light dk text-tiny">{{subtype}}</span> {{/if}}
										</div>
									{{/each}}
									
									{{/multiple_Property_Element}}
								</div>
								{{/property_is_exists}}

 <div class="custom-data"> {{#getContactCustomPropertiesExclusively properties}}
<div class="clearfix"></div>
<div class="m-t-sm text-left"><small class="text-xs text-muted">Custom Info</small></div>

								<div class="text-left">
									{{#each_with_index this}}
									<div class="pull-left">
										<div class="pull-left">
											<span class="text-muted" title="{{name}}">{{name}}<span>
										</div>
										{{#if_equals index ../this.length}}
											<div class="pull-left custom-color">
											{{#if_equals subtype "DATE"}} <i class="fa fa-clock-o m-r-xs"></i><time class="note-created-time" datetime="{{epochToHumanDate "" value}}">{{epochToHumanDate "dd mmm yyyy" value}}</time>{{else}}{{value}} {{/if_equals}}</div>
										{{else}}
											<div class="pull-left custom-color">
											{{#if_equals subtype "DATE"}} <i class="fa fa-clock-o m-r-xs"></i><time class="note-created-time" datetime="{{epochToHumanDate "" value}}">{{epochToHumanDate "dd mmm yyyy" value}}</time>{{else}}{{value}} {{/if_equals}}</div>
										{{/if_equals}}
										</div>
                                        <div class="clearfix"></div>
										{{/each_with_index}}
									</div>
									{{/getContactCustomPropertiesExclusively}}
									</div>



 									{{#property_is_exists "address" properties}}
<div class="m-t-sm text-left"><small class="text-xs text-muted">Location</small></div>
										<div class="pull-left">
											{{#address_Element properties}}{{/address_Element}}</div></div>

										<div class="pull-left">
											<div id="map" style="width: auto; height: 200px; display: none; margin: 10px">
											</div>
										</div>
									{{/property_is_exists}}
<div class="clearfix"></div>
<!-- ending funda for contact detail edit -->
            	</div>
				</div>
				</div>
				</div>
				</div>
		<div class="col  bg-white">
<div class="vbox">
<div class="row-row">
	<div class="tab-container">
			<ul class="nav nav-tabs  bg-light" id="contactDetailsTab">
				<li class="active"><a data-toggle="tab" href="#company-contacts">Contacts</a></li>
				<li class=""><a data-toggle="tab" href="#deals">Deals</a></li>
				<li class=""><a data-toggle="tab" href="#cases">Cases</a></li>
                <li class=""><a data-toggle="tab" href="#notes">Notes</a></li>
                <li class=""><a data-toggle="tab" href="#documents">Documents</a></li>				
			</ul>
			</div>
			<div class="tab-content" id="contact-tab-content">
				<div class="tab-pane active" id="company-contacts">...</div>
				<div class="tab-pane" id="deals">...</div>
				<div class="tab-pane" id="cases">...</div>
                <div class="tab-pane" id="notes"><img src="img/21-0.gif"></img></div>
               <div class="tab-pane" id="documents"><img src="img/21-0.gif"></img></div>
			</div>
		
	</div>
	</div>
	</div>
	
	<!-- Contact Details -->
	<div class="col bg-white hide">

<div id="widgets"></div>
						</div>
					</div>
</div>
					</script>
					
<script id="company-contacts-model-template" type="text/html">
	<td></td>
	<td class="data" data="{{id}}" >
    	<div class="thumb-sm agile-img m-r-xs"> 
        		<img class="img-inital r r-2x" data-name="{{dataNameAvatar properties}}" src="{{gravatarurl properties 40}}" />
    	</div>
    	<div class="agile-thumb agile-thumb-view">
        		<a class="text-cap">	{{getPropertyValue properties "first_name"}}
        		{{getPropertyValue properties "last_name"}} </a>  </br>      		
        		<small class="text-muted">{{getPropertyValue properties "email"}}</small>
    	</div>
	</td>
	<td><div class="text-ellipsis">{{getPropertyValue properties "title"}}<br />
    	{{getPropertyValue properties "company"}}</div>
	</td>
	<td> 
<div class="ellipsis-multiline l-h" style=" word-break:keep-all;">
	{{#each tags}}
    	<span class="label bg-light">{{this}}</span>
    {{/each}}
</div>
	</td>
	<td><div>{{lead_score}}</div></td>
</script>

<script id="company-contacts-collection-template" type="text/html">

{{#if this.length}}
	<div align="right" class="m-b-md m-t-md m-r-sm">
		<a href="#" class="contact-add-contact btn btn-default btn-sm btn-addon">
			<span><i class="icon-plus-sign"></i></span> Add Contact
		</a>
	</div>
	
		
			<table id="contacts" class="table table-striped agile-table onlySorting b-t">
			
				<thead>
					<tr>
<th></th>
						<th style="width:40%">Name</th>
						<th style="width:20%">Work</th>
						<th style="width:20%">Tags</th>
						<th style="width:20%">Lead Score</th>
					</tr>
				</thead>
				<tbody id="company-contacts-model-list" class="contacts-model-list"
					route="contact/" style="overflow: scroll;">
				</tbody>
			</table>

		{{else}}
			<div class="alert-info alert">
            	<div class="slate-content">
                	<div class="box-left pull-left m-r-md">
                    	<img alt="Clipboard" src="/img/clipboard.png">
                	</div>
                	<div class="box-right pull-left">
                    	<h4 class="m-t-none">{{contactShortName}} is not associated with any person/contact. </h4>
                    	<div class="text">
							All Contacts that have this company in the 'Organization' or 'Company' field are shown here.
							<br/>
							<a href="#" class="contact-add-contact btn btn-default btn-sm left m-t-xs" style="margin-top:10px; margin-bottom:10px;">
								<i class="icon-plus-sign"></i> Add Contact
							</a>
                    	</div>
                	</div>
					<div class="clearfix">
					</div>
            	</div>
        	</div>
		{{/if}}
</script><script id="contact-detail-campaign-template" type="text/html">
<div class="bg-light lter b-b wrapper-md">
     <h3 class="formheading h3 font-thin m-n"><i class="icon-plus-sign"></i> Add contact to campaign</h3>
</div>
<div class="wrapper-md">
    <div class="row">
    <div class="col-md-7">
<div class="panel wrapper">
        <form id="contactCampaignForm" class="form-horizontal">
            <fieldset>
             
                <div class="control-group form-group">         
                    
                    <label class="control-label col-sm-3">Select campaign <span class="field_req">*</span></label>
                    <div class="controls col-sm-9">
                        <select class="campaign-select required form-control" id='campaign-select'>
                            <option value="">Select..</option>
                        </select>
                    </div>
                </div>
<div class="line ling-lg b-b"></div>
<div class="row">
                <div class="form-actions col-sm-offset-3 col-sm-9">          					
                    <a href="#" type="submit" id="subscribe-contact-campaign" class="btn btn-sm btn-primary">Add</a>
					<a href="#" class="btn btn-sm btn-danger" id="contact-close-campaign">Close</a> 
                    <span class="save-status"></span>
                </div>
</div>
            </fieldset>
        </form>
    </div>
    </div>
</div>
</div>
</script>									<script id="campaigns-collection-template" type="text/html">
<div class="wrapper p-t-none">
{{#contact_model}}
	<div>
		 {{#contact_campaigns this "campaignStatus"}}
		 {{!-- Shows Active and Done campaigns like tags --}}
         {{#if this}} 
         
		 {{#if this.done}}
         <div>
           <div class="text-md inline-block m-r-xs pull-left">Completed Campaigns: </div> <div class="tagsinput">
                   {{#each this.done}}
						<span class="tag inline-block label bg-light" style="padding:7px 8px" data="{{campaign_id}}"><span>
						{{#hasMenuScope 'CAMPAIGN'}}
							<a class="anchor" href="#workflow/{{campaign_id}}">{{#if campaign_name}}{{trim_space campaign_name}}{{else}}Done Campaign{{/if}}</a>
						{{else}}
							<span style="color:#888">{{#if campaign_name}}{{trim_space campaign_name}}{{else}}Done Campaign{{/if}}</span>
						{{/hasMenuScope}}
						</span></span> 
					{{/each}}
                    </div>
         </div>
         <br>
         {{/if}}

         {{#if this.active}}
         <div>
           <div class="text-md inline-block m-r-sm pull-left" id="contact-active-campaigns">Active Campaigns: </div> <div class="tagsinput active-campaigns">
                   {{#each this.active}}
						<span class="tag inline-block label bg-light" id='active-campaign' data="{{campaign_id}}"><span>
							{{#hasMenuScope 'CAMPAIGN'}}
								<a class="anchor pull-left m-t-xs m-r-xs" href="#workflow/{{campaign_id}}">{{#if campaign_name}}{{trim_space campaign_name}}{{else}}Active Campaign{{/if}}</a>
								<a class="close remove-active-campaign" contact_name = "{{contactShortName}}" campaign_name="{{campaign_name}}" title="Remove from Campaign">&times</a>
							{{else}}
								<span style="color:#888">{{#if campaign_name}}{{trim_space campaign_name}}{{else}}Active Campaign{{/if}}</span>
							{{/hasMenuScope}}
						</span></span> 
					{{/each}}
                    </div>
	{{#canEditCurrentContact "1"}}
		{{#hasMenuScope 'CAMPAIGN'}}
            <a class="add-to-campaign"  href="#"><i class="icon-plus"></i> Add {{getCurrentContactProperty "first_name"}} to Campaign</a>
		{{/hasMenuScope}}
	{{/canEditCurrentContact}}
            <form id="add-to-campaign-form" class="show_campaigns_list" style="display:none;">
            	<div class="control-group form-group">
                	<div class="controls">
			        	<select id="campaign-select" class="required form-control w inline-block" name="campaign_id">
                        	<option value="">Select...</option>
                      	</select>						
				  	  	<span class="m-l-xs"><a class="btn btn-sm btn-primary" id="add-to-campaign" href="#">Add</a></span>
						<span class="m-l-xs"><a class="btn btn-default btn-sm" id="cancel-to-add-campaign" href="#">Cancel</a></span>
                    </div> 
			   </div>
            </form> 
         </div>
         
         {{else}}
         {{#canEditCurrentContact "1"}}
			{{#hasMenuScope 'CAMPAIGN'}}
        	 <a class="add-to-campaign" style="margin-top:1%;" href="#"><i class="icon-plus"></i> Add {{getCurrentContactProperty "first_name"}} to Campaign</a>
			{{/hasMenuScope}}
		{{/canEditCurrentContact}}
         	<form id="add-to-campaign-form" class="show_campaigns_list" style="display: none;">
				<div class="control-group form-group">
                	<div class="controls">
			        	<select id="campaign-select" class="required form-control w inline-block" name="campaign_id">
                        	<option value="">Select...</option>
                      	</select>						
				  	    <span class="m-l-xs"><a class="btn btn-sm btn-primary" id="add-to-campaign" href="#">Add</a></span>
						<span class="m-l-xs"><a class="btn btn-sm btn-default" id="cancel-to-add-campaign" href="#">Cancel</a></span>
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
        <div class="wrapper p-t-none">
            <div class="slate-content">
                <div class="box-left pull-left m-r-md">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right pull-left">
                    <h4 class="m-t-none">No campaign activity for {{contactShortName}}.</h4>
                    <div class="text">
						Contact campaign activity like email opens and link clicks are shown here.
					</div>
                </div>
				<div class="clearfix">
				</div>
            </div>
        </div>
        {{/unless}}
        {{#if this.length}}
          <div class="wrapper p-t-none">
		     
              <div class="text-md">Campaign Log</div>
          </div>                                
		  <ul id="campaigns-model-list" class="ativity-block-ul list-group list-group-lg no-radius m-b-none m-t-n-xxs  "></ul>
		  <table class="m-t-md"></table>
		{{/if}}
</script>



<script id="campaigns-model-template" type="text/html">
<div class="activity-text-block">
	<div class="activity-block-owner thumb-xs pull-left m-r-sm b-light b avatar">
		{{#if log_type}}
			<img class="user-img r-2x"  alt="" src="img/campaigns/{{log_type}}.png">
		{{else}}
			<img class="user-img r-2x"  src="https://dpm72z3r2fvl4.cloudfront.net/css/images/user-default.png">
		{{/if}}
	</div>
<div class="pull-left rightThumbView pos-rlt">
	<div class="m-t-none text-cap text-md custom-color contact-title-dynamic pull-left">{{titleFromEnums log_type}}</div>
    <div class="pull-right"><i class="fa fa-clock-o m-r-xs text-muted"></i>
		<time class="log-created-time text-muted" datetime="{{epochToHumanDate "" time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" time}}</time>
</div>
<div class="clearfix"></div>
 	<div>{{#if_email_sent this "log_type"}} Subject: {{Subject}} {{else}} {{{message}}} {{/if_email_sent}}</div>

    <div class="edit-hover">
		<div class="pull-right">
        <span>Campaign - </span>
         {{#hasMenuScope 'CAMPAIGN'}}
			<a  href="#workflow/{{campaign_id}}"> {{campaign_name}}</a>
		{{else}}
			<p>{{campaign_name}}</p>
		{{/hasMenuScope}}
        
        </div>
        <div class="clearfix"></div>
	</div>	
</div>
<div class="clearfix"></div>
</div>
</script><script id="cases-contact-collection-template" type="text/html">
  {{#unless this.length}}
        <div class="wrapper p-t-none">
            <div class="slate-content">
                <div class="box-left pull-left m-r-md">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right pull-left">
                    <h4 class="m-t-none">{{contactShortName}} is not associated with any cases. </h4>
                    <div class="text">
						All Cases that have this contact in the 'Related to' field are shown here.
                    </div>
					{{#hasMenuScope 'CASES'}}
                    <a href="#" class="contact-add-case btn btn-default btn-addon btn-sm blue btn-slate-action"><i class="icon-plus-sign"></i>  Add Case</a>
					{{/hasMenuScope}}
                </div>
				<div class="clearfix">
				</div>
            </div>
        </div>
   {{/unless}}

{{#if this.length}}
<div class="m-b-md m-t-md m-r-sm" align="right">
{{#hasMenuScope 'CASES'}}
   		<a href="#" class="contact-add-case btn btn-default btn-sm  btn-addon"><span><i class='icon-plus-sign'/></span> Add Case</a> 
	{{/hasMenuScope}}
</div>
	<ul id="cases-contact-model-list" class="ativity-block-ul list-group list-group-lg no-radius m-b-none m-t-n-xxs"></ul>
{{/if}}
</script>

<script id="cases-contact-model-template" type="text/html"> 
<div  class="activity block pos-rlt">
	
		<div class="activity-block-owner thumb-xs pull-left m-r-sm avatar">
			{{#if ownerPic}}
				<img class="user-img r r-2x" alt="" src="{{ownerPic}}" >
			{{else}}
				<img class="user-img r r-2x" src="{{defaultGravatarurl 40}}">
			{{/if}}
			<span class="owner-name hide">{{owner.name}}</span>
		</div>
		<div class="pull-left rightThumbView">
		<div class="pull-left contact-title-dynamic">
		<div class="text-cap text-md custom-color">
		{{title}}
<div>
		<span class="label bg-light">{{ucfirst status}}</span>
</div>
		</div>
		</div>	
       <div class="pull-right">
		<small class="edit-hover text-muted">
		<i class="fa fa-clock-o m-r-xs"></i><time class="deal-created-time  text-sm" datetime="{{epochToHumanDate "" created_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time>
		</small>
		</div>	
<div class="clearfix"></div>
<div class="contact-desc-dynamic hide">
    {{description}} &nbsp;
</div>
<div class="clearfix"></div>
	
		<div class="pull-right pos-abs pos-r-0 pos-b-0">
		<span class="actions">
             {{#hasMenuScope 'CASES'}}
			 <a title="Edit"  data="{{id}}" href="#" class="cases-edit-contact-tab c-p text-l-none p-r-sm" > <i class="icon-pencil"></i> </a>
             <a title="Delete" class="c-p"><span class="activity-delete icon-trash" id="{{id}}" url="core/api/cases/bulk"></span></a>
             {{/hasMenuScope}}
        </span>
        </div>
        <div class="clearfix"></div>
	

</div>
<div class="clearfix"></div>
</div>

</script>

<script id="deals-collection-template" type="text/html">
  {{#unless this.length}}
        <div class="wrapper p-t-none">
            <div class="slate-content">
                <div class="box-left pull-left m-r-md">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right pull-left">
                    <h4 class="m-t-none">{{contactShortName}} is not associated with any deals. </h4>
                    <div class="text">
						All Deals that have this contact in the 'Related to' field are shown here.
                    </div>
                    {{#hasMenuScope 'DEALS'}}
                    <a href="#" class="contact-add-deal btn-default btn-sm btn blue btn-slate-action m-t-xs"><i class="icon-plus-sign"></i>  Add Deal</a>
                    {{/hasMenuScope}}
                </div>
				<div class="clearfix">
				</div>
            </div>
        </div>
   {{/unless}}

{{#if this.length}}
<div class="m-b-md m-t-md m-r-sm" align="right">
{{#hasMenuScope 'DEALS'}}
   <a href="#" class="contact-add-deal btn btn-sm btn-default pos-rlt btn-addon"><span><i class='icon-plus-sign'/></span> Add Deal</a> 
{{/hasMenuScope}}
</div>
	<ul id="deals-model-list" class="ativity-block-ul list-group list-group-lg no-radius m-b-none m-t-n-xxs"></ul>
{{/if}}
</script>

<script id="deals-model-template" type="text/html">
<div  class="activity block pos-rlt">
	<div>
		<div class="activity-block-owner  thumb-xs pull-left m-r-sm avatar">
			{{#if pic}}
				<img class="user-img r r-2x" alt="" src="{{pic}}" >
			{{else}}
				<img class="user-img r r-2x" src="{{defaultGravatarurl 40}}">
			{{/if}}
			<span class="owner-name hide">{{owner.name}}</span>
		</div>
		
<div class="pull-left rightThumbView">			
		<div class="pull-left contact-title-dynamic"><a class="text-md text-cap custom-color" href="#deal/{{id}}"><div class="text-md text-cap custom-color">{{name}}</div></a></div>
		<div class="pull-right">
		<small class="edit-hover m-r-sm text-muted">
         <i class="fa fa-clock-o text-muted m-r-xs"></i>
			<time class="deal-created-time text-base" datetime="{{epochToHumanDate "" created_time}}" >{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time>
		</small>
		</div>
		<div class="clearfix"></div>
		<div class="contact-desc-dynamic">
        
		<div><span class="m-r-xs hide">Value : </span>
			{{currencySymbol}}{{numberWithCommas expected_value}}  <span class="m-l-sm text-muted">{{milestone}} ({{probability}} %)</span>
		</div>
         {{#if description}}
          <div>{{description}}</div>
          {{/if}}
<div class="clearfix"></div>
       
       <div>	
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
      
		</div>
		<div class="actions pull-right pos-abs pos-r-0 pos-b-0">
			{{#if notes}}
             <a title="Notes" data="{{id}}" data-toggle="tooltip" data-placement="top" data-trigger="hover" data-container="No Notes" class="deal-notes deal-edit-contact-tab c-p text-l-none"><i class="deal-action icon icon-comment deal-notes" data="{{id}}" title="Notes"></i></a>
              <span class="txt-small note-count" title="Notes">{{notes.length}}</span>
			{{/if}}
			{{#hasMenuScope 'DEALS'}}
			 <a title="Edit"  data="{{id}}" href="#" class="deal-edit-contact-tab c-p text-l-none p-r-sm"> <i class="icon-pencil"></i> </a>
             <a title="Delete" class="c-p text-l-none"><span class="activity-delete icon-trash" id="{{id}}" url="core/api/opportunity/delete"></span></a>
      		{{/hasMenuScope}}
	</div>
	<div class="clearfix"></div>
</div>
<div class="clearfix"></div>
</div>
</div>
</script>
<script id="contact-documents-collection-template" type="text/html">
		{{#unless this.length}}
        <div class="wrapper p-t-none">
            <div class="slate-content">
                <div class="box-left pull-left m-r-md">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right pull-left">
                    <h4 class="m-t-none">You have no documents for {{contactShortName}}.</h4>
                  {{#hasMenuScope 'DOCUMENT'}}  
                  <div class="text">
                        You can add a document related to a contact.
                    </div>
                    {{/hasMenuScope}}
					<div>{{#hasMenuScope 'DOCUMENT'}}<a href="#" class="btn btn-default btn-sm add-document-select m-t-xs"><i class='icon-plus-sign'/></i> Add Document</a>{{/hasMenuScope}}
						<span class="contact-document-select" style="display:none;">
							<select id="document-select" class="form-control inline-block">
								<option value="">Select...</option>
							</select>
 					<div class="m-t-sm">
							<a href="#" class="btn btn-default btn-sm add-document-cancel m-r-sm">Cancel</a>
                    		<a href="#" class="btn btn-sm btn-primary add-document-confirm">Add</a> 
							<span class="save-status"></span>
						</span>
					</div>
					</div>
         			<!--<div class="btn-group" style="margin-top:12px;">
        				<a href="#" class="btn btn-default btn-sm right contact-add-document"><i class="icon-plus-sign"></i> Add Document</a>
        				<a class="btn btn-sm dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
						<ul class="dropdown-menu" style="text-shadow:0px 0px;">
							<li><a href="#" class="document-exist">Existing Document</a></li>
						</ul>
					</div>-->
                </div>
				<div class="clearfix">
				</div>
            </div>
        </div>
        {{/unless}}
        {{#if this.length}}
	<div class="m-b-md m-t-md m-r-sm" align="right">
        <!--<div class="btn-group right">
        	<a href="#" class="btn btn-sm btn-default right contact-add-document"><i class="icon-plus-sign"></i> Add Document</a>
        	<a class="btn btn-sm dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>
			<ul class="dropdown-menu pull-right">
				<li><a href="#" class="document-exist">Existing Document</a></li>
			</ul>
		</div>-->
		<div>{{#hasMenuScope 'DOCUMENT'}}<a href="#" class="add-document-select btn btn-default btn-sm btn-addon"><i class='icon-plus-sign'/></i> Add Document</a>{{/hasMenuScope}}
			<span class="contact-document-select" style="display:none;">
				<select id="document-select" class="form-control inline-block m-r-sm p-t-xs w-xl">
					<option value="">Select...</option>
				</select>
                <a href="#" class="btn btn-sm btn-primary add-document-confirm">Add</a> 
                <a href="#" class="btn btn-default btn-sm add-document-cancel">Cancel</a>
				<span class="save-status"></span>
			</span>
		</div>
	</div>
			<ul id="contact-documents-model-list" class="ativity-block-ul list-group list-group-lg no-radius m-b-none m-t-n-xxs"></ul>
		{{/if}} 
</script>


<script id="contact-documents-model-template" type="text/html">
<div class="activity block pos-rlt">
	
	<div class="activity-block-owner  thumb-xs pull-left m-r-sm avatar">
		{{#if ownerPic}}
			<img class="user-img r r-2x"  alt="" src="{{ownerPic}}" >
		{{else}}
			<img class="user-img r r-2x"  src="{{defaultGravatarurl 40}}">
		{{/if}}
		<span class="owner-name hide">{{owner.name}}</span>
	</div>
	<div class="pull-left rightThumbView">
	<div class="document-title text-md text-cap pull-left contact-title-dynamic custom-color">{{name}}</div>
	<div class="pull-right">	
		 <small class="edit-hover text-muted"> 
		 <i class="fa fa-clock-o m-r-xs"></i>
			<time class="document-created-time  text-base" datetime="{{epochToHumanDate "" uploaded_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" uploaded_time}}</time>
		</small>
		</div>
		<div class="clearfix"></div>
    <div>
		{{network network_type}}{{#hasMenuScope 'DOCUMENT'}}&nbsp;&nbsp;<a href="{{url}}" target="_blank"><i class="icon-external-link" title="Open Document"></i></a>{{/hasMenuScope}}
	</div>
<div class="clearfix"></div>
	
		<div class="agile-thumb">	
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
	
		
		<div class="actions pull-right pos-abs pos-r-0 pos-b-0">
            {{#hasMenuScope 'DOCUMENT'}}
			<a title="Edit"  data="{{id}}" class="document-edit-contact-tab c-p text-l-none p-r-sm"> <i class="icon-pencil"></i> </a>
			<a title="Detach"  data="{{id}}" class="document-unlink-contact-tab c-p text-l-none p-r-sm"> <i class="icon-unlink"></i> </a>
            <!--<a title="Delete" style="cursor:pointer;text-decoration: none"><span class="activity-delete icon-trash" style="display:inline" id="{{id}}" url="core/api/documents/bulk"><i></i></span></a>-->
			{{/hasMenuScope}}
        </div>
        <div class="clearfix"></div>
	</div>
<div class="clearfix"></div>
</script><script id="email-account-types-template" type="text/html">
    <div  class="m-b-md m-t-md m-r-sm" align="right">
	<div class="btn-group pos-rlt">
	<button class="btn btn-sm btn-default filter-dropdown" id="email-type-select">Agile</button>
	<button class="btn btn-sm btn-default dropdown-toggle" id="email-type-select-dropdown" data-toggle="dropdown">
	<span class="caret"></span>
	</button>
	<ul id = "mail-account-type-select" class="pull-right dropdown-menu">
	{{#if agileUserName}}
	<li>
	<a href="" class="agile-emails" email-server="agile" data-url="core/api/emails/agile-emails?e=" email-server-type={{agileUserName}}><i class="icon-cloud m-r-xs text-md"></i>Agile</a>
	</li>
	{{/if}}
	{{#if gmailUserName}}
	<li>
	<a href="" class="agile-emails" email-server="google" data-url="core/api/social-prefs/google-emails?from_email=" email-server-type={{gmailUserName}}><i class="icon-google-plus m-r-xs text-md"></i>{{gmailUserName}}</a>
	</li>
	{{/if}}
	{{#if imapUserName}}
	<li>
	<a href="" class="agile-emails" email-server="imap" data-url="core/api/imap/imap-emails?from_email=" email-server-type={{imapUserName}}><i class="icon-envelope-alt  m-r-xs text-md"></i>{{imapUserName}}</a>
	</li>
	{{/if}}
	{{#if exchangeUserName}}
	<li>
	<a href="" class="agile-emails" email-server="exchange" data-url="core/api/office/office365-emails?from_email=" email-server-type={{exchangeUserName}}><i class="icon-windows  m-r-xs text-md"></i>{{exchangeUserName}}</a>
	</li>
	{{/if}}
	{{#if sharedGmailUserNames}}
	{{#each sharedGmailUserNames}}
	<li>
	<a href="" class="agile-emails" email-server="google" data-url="core/api/social-prefs/google-emails?from_email=" email-server-type={{this}}><i class="icon-google-plus  m-r-xs text-md"></i>{{this}} (Shared)</a>
	</li>
	{{/each}}
	{{/if}}
	{{#if sharedImapUserNames}}
	{{#each sharedImapUserNames}}
	<li>
	<a href="" class="agile-emails" email-server="imap" data-url="core/api/imap/imap-emails?from_email=" email-server-type={{this}}><i class="icon-envelope-alt  m-r-xs text-md"></i>{{this}} (Shared)</a>
	</li>
	{{/each}}
	{{/if}}
	{{#if sharedExchangeUserNames}}
	{{#each sharedExchangeUserNames}}
	<li>
	<a href="" class="agile-emails" email-server="exchange" data-url="core/api/office/office365-emails?from_email=" email-server-type={{this}}><i class="icon-windows  m-r-xs text-md"></i>{{this}} (Shared)</a>
	</li>
	{{/each}}
	{{/if}}
	</ul>
	
	<label id="has_email_configured" style="display:none">{{#if hasEmailAccountsConfigured}}{{hasEmailAccountsConfigured}}{{else}}false{{/if}}</label>
	
	</div>
	</div>
	
</script>
<script id="email-social-collection-template" type="text/html">
{{#unless this.length}}
    <div class="wrapper p-t-none">
            <div class="slate-content">
                <div class="box-left pull-left m-r-md">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right pull-left">
                    <h4 class="m-t-none">You have no emails for {{contactShortName}}.</h4>
                    <div class="text">
                        You have no emails for {{contactShortName}} in {{read_global_var}} account.
                    </div>
                    {{#if_email_type_is_agile "agilecrm"}}
                    <a href="#send-email/{{getCurrentContactProperty "email"}}" class="btn btn-default btn-sm blue btn-slate-action m-t-xs"><i class="icon-plus-sign"></i> Send Email</a>
                    {{/if_email_type_is_agile}}
                </div>
				<div class="clearfix">
				</div>
            </div>
        </div>
{{/unless}}
        
{{#if this.length}}
       <ul id="email-prefs-verification" class="p-n m-t-n-xs" style="display:none;">
            <div class="alert alert-warning info-block b">
                <div>
                <i class="icon-warning-sign"></i><strong style="">PENDING EMAIL CONFIGURATION.</strong>
                <p>You have not yet configured your email. Please click <a href='#email'>here</a> to get started.</p>
                </div>
            </div>
        </ul>
	<ul id="email-social-model-list" class="ativity-block-ul list-group list-group-lg no-radius m-b-none m-t-n-xxs"></ul>
	<table class="m-t-md">
	</table>
{{/if}}
</script>

<!-- Imap-Email model -->
<script id="email-social-model-template" type="text/html">
<div class="block pos-rlt">
	{{#if errormssg}}
    <span class="text-dark">Error: {{errormssg}}</span>
    {{else}}
    <div class="activity-block-owner thumb-xs m-r-sm avatar pull-left">	
			<img class="user-img r r-2x" src="{{#extractEmail from}}{{emailGravatarurl 40 this}}{{/extractEmail}}">
	</div>
	<div id="email-reply-div" class="pull-left rightThumbView">
        
			<div class="pull-left text-cap text-md custom-color contact-title-dynamic">
<a class="email-subject" id={{id}}  href="#collapse-{{id}}">{{subject}}</a>
	{{#containString owner_email from}}
			<i class="icon-reply text-muted"></i>
		{{else}}
			<i class="icon-share-alt icon-flip-vertical"></i>
	{{/containString}}

    {{#if trackerId}}
        {{#if_equals "true" is_email_opened}}
            <i class="icon-folder-open-alt" title="Email Opened"></i>
        {{/if_equals}}
    {{/if}}
				

			</div>
			<div class="pull-right">
		<small class="edit-hover text-muted"> 
<i class="fa fa-clock-o"></i>
			<time class="email-sent-time" datetime="{{epochToHumanDate "" date_secs}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" date_secs}}</time>
		</small>
</div>
		<div class="clearfix"></div>	

			<div class="m-b-xs ellipsis-multi-line collapse-{{id}}" style="height:70px">
				<div>
					<div class="email-body">{{{message}}}</div>
				</div>
      		</div>
			<div id="collapse-{{id}}" class="collapse activity-email-collapse">
				<ul class="email-headers p-n">
                	<li class="b-n-imp p-n m-t-xs"><strong>From:</strong> {{from}}</li> 
						
                	<li class="b-n-imp p-n m-t-xs">
						<div class="caption to-emails text-ellipsis" data-to="{{to}}" id="tl-mail-to-popover"  rel="popover" data-placement="right" data-content="message:" data-trigger="hover">
							<strong>To:</strong> {{to}}
						</div>
					</li>
                    {{#if cc}}
                    <li class="b-n-imp p-n m-t-xs">
                    <div class="caption cc-emails text-ellipsis" data-cc="{{cc}}" id="tl-mail-to-popover"  rel="popover" data-placement="right" data-content="message:" data-trigger="hover">
                    	<strong>Cc:</strong> {{cc}}
            		</div>
          			</li>
					{{/if}}

                    {{#if bcc}}
                    <li class="b-n-imp p-n m-t-xs">
            		<div class="caption bcc-emails text-ellipsis" data-bcc="{{bcc}}" id="tl-mail-to-popover"  rel="popover" data-placement="right" data-content="message:" data-trigger="hover">
              			<strong>Bcc:</strong> {{bcc}}
            		</div>
          			</li>
                    {{/if}}
           		</ul>
       			<div  class="email-body m-t-sm">{{#if message}}{{{message}}}{{/if}}</div>
    		</div>
		<div class="m-t-xs">

<div class="pull-right pos-abs pos-r-0 pos-b-0">
		<a href="#"  data-from ="{{#extractEmail from}}{{this}}{{/extractEmail}}" id='email-reply' style="display:none;"><i class="icon-mail-reply-all"></i> Reply</a>
 </div>
<div class="clearfix"></div>      
{{/if}}

	</div>	
</div>
<div class="clearfix"></div>
</div>
</script><script id="contact-events-collection-template" type="text/html">
		{{#unless this.length}}
        <div class="wrapper p-t-none">
            <div class="slate-content">
                <div class="box-left pull-left m-r-md">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right pull-left">
                    <h4 class="m-t-none">You have no events for {{contactShortName}}.</h4>
                    <div class="text">
                        You can add a event related to a contact.
                    </div>
                    <a href="#" class="btn blue btn-slate-action btn-default btn-sm m-t-xs contact-add-event"><i class="icon-plus-sign"></i>  Add Event</a>
                </div>
				<div class="clearfix">
				</div>
            </div>
        </div>
        {{/unless}}
        {{#if this.length}}
	<div class="m-b-md m-t-md m-r-sm" align="right">
		<a href="#" class="btn btn-sm btn-default contact-add-event pos-rlt btn-addon"><span><i class='icon-plus-sign'/></span> Add Event</a>
	</div>
			<ul id="contact-events-model-list" class="ativity-block-ul list-group list-group-lg no-radius m-b-none m-t-n-xxs"></ul>
		{{/if}} 
</script>

<script id="contact-events-model-template" type="text/html">
<div class="activity block pos-rlt">
	
	<div class="activity-block-owner  thumb-xs pull-left m-r-sm avatar">
			{{#if ownerPic}}
				<img class="user-img r r-2x"  alt="" src="{{ownerPic}}" >
			{{else}}
				<img class="user-img r r-2x" src="{{defaultGravatarurl 40}}">
			{{/if}}
			<span class="owner-name hidden">{{owner.name}}</span>
	</div>
<div class="pull-left rightThumbView">	
	<div class="event-title pull-left text-md text-cap contact-title-dynamic custom-color">{{title}} <span class="hidden label label-{{task_label_color color}}">{{event_priority color}}</span></div><div class="pull-right"><span class="text-muted"><i class="fa fa-clock-o"></i> <time class="event-created-time">{{epochToHumanDate "dd mmm yyyy' - 'hh:MM tt" start}}</time></span></div>
<div class="clearfix"></div>
<!-- <div class="m-b-xs">
	<span>StartTime : <i class="fa fa-clock-o m-r-xs text-muted"></i><time class="event-created-time text-muted" datetime="{{epochToHumanDate "" start}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" start}}</time></span>
		{{#if allDay}} ( all day )
		{{else}}
		<span class="m-l-md">EndTime :<i class="fa fa-clock-o m-r-xs text-muted"></i> <time class="event-created-time text-muted" datetime="{{epochToHumanDate "" end}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" end}}</time></span>
		{{/if}}
</div> -->
<div>	
		{{#each contacts}}
           	{{#if id}}
				{{#isDuplicateContactProperty properties "email"}}

					{{else}}
						{{#if_contact_type "PERSON"}}	
							<a class="text-info" href="#contact/{{id}}">{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}</a>,
        				{{/if_contact_type}}
						{{#if_contact_type "COMPANY"}}
        					<a href="#contact/{{id}}">{{getPropertyValue properties "name"}}</a>,
        				{{/if_contact_type}}
				{{/isDuplicateContactProperty}}
           		
           	{{/if}}
       	{{/each}}
		</div>
		</div>
<div class="clearfix"></div>
	<div class="m-t-xs">
		<div class="pull-left hide">
		 <small class="edit-hover m-l-xxl text-muted"> 
			<i class="fa fa-clock-o m-r-xs"></i> <time class="event-created-time text-base" datetime="{{epochToHumanDate "" created_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time>
		</small>
		</div>
		<div class="pull-right pos-abs pos-r-0 pos-b-0 m-r-xs">
		<span class="actions">
			<a title="Edit"  data="{{id}}" class="c-p text-l-none event-edit-contact-tab p-r-sm"> <i class="icon-pencil"></i> </a>
            <a title="Delete" class="c-p text-l-none"><span class="activity-delete icon-trash" id="{{id}}" url="core/api/events/bulk"><i></i></span></a>
        </span>
        </div>        
	</div>
	<div class="clearfix"></div>
<div class="clearfix"></div>
</div>
<div class="priority_type hidden">{{event_priority color}}</div>
</script><script id="notes-collection-template" type="text/html">
{{#unless this.length}}
        <div class="wrapper p-t-none">
            <div class="slate-content">
                <div class="box-left pull-left m-r-md">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right pull-left">
                    <h4 class="m-t-none">You have no notes for {{contactShortName}}.</h4>
                    <div class="text">
                        You can save specific information about contacts as a Note.
                    </div>
                    <a href="#noteModal" data-toggle="modal" class="btn btn-sm btn-default m-t-xs blue btn-slate-action contact-add-note"><i class="icon-plus-sign"></i>  Add Note</a>
                </div>
				<div class="clearfix">
				</div>
            </div>
        </div>
        {{/unless}}
{{#if this.length}}
<div class="m-b-md m-t-md m-r-sm" align="right">
   <a href="#noteModal" data-toggle="modal" class="btn btn-sm btn-default contact-add-note pos-rlt btn-addon"><span><i class='icon-plus-sign'/></span> Add Note</a> 
</div>
	<ul id="notes-model-list" class="ativity-block-ul list-group list-group-lg m-b-none"></ul>
{{/if}}
</script>
<script id="notes-model-template" type="text/html">
<div  class="activity block pos-rlt">
<div class="thumb-xs pull-left m-r-sm b-light b avatar">
{{#if domainOwner}}
			{{#if ownerPic}}
				<img class="user-img r r-2x"  alt="" src="{{ownerPic}}" >
			{{else}}
				<img class="user-img r r-2x"  alt="" src="{{defaultGravatarurl 40}}" >
			{{/if}}
		{{else}}
			<img class="user-img r r-2x"  alt="" src="{{#getCurrentUserPrefs}}{{#if pic}}{{pic}}{{else}}{{defaultGravatarurl 40}}{{/if}}{{/getCurrentUserPrefs}}" >
		{{/if}}
</div>
<div class="pull-left rightThumbView pos-rlt">

	<span class="activity-block-owner hidden">
<span class="owner-name">{{#if domainOwner}} {{domainOwner.name}} {{else}} {{#getCurrentUserPrefs}}{{currentDomainUserName}}{{/getCurrentUserPrefs}} {{/if}}</span>
	</span>
	<div class="pull-left contact-title-dynamic"><a class="text-md text-cap custom-color">{{subject}}</a></div>
	<div class="pull-right"><small class="edit-hover text-muted"> 
			<i class="fa fa-clock-o m-r-xs"></i><time class="note-created-time text-sm" datetime="{{epochToHumanDate "" created_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time>
		</small></div>
		<div class="clearfix"></div>
		<div class="contact-desc-dynamic">
	<div>
{{show_link_in_statement description}}
	</div>	
	 	
			
		{{#each contacts}}

           	{{#if id}}
				{{#isDuplicateContactProperty properties "email"}}
					{{else}}	
<div class="inline-block">
						<a class="text-info" href="#contact/{{id}}">{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}</a>,
</div>
				{{/isDuplicateContactProperty}}
           		
           	{{/if}}
       	{{/each}}
	
</div>
<div align="right" class="pos-abs pos-r-0 pos-b-0">
	<span class="actions ">
			<a title="Edit"  data="{{id}}" data-toggle="modal" class="edit-note c-p text-l-none p-r-sm"> <i class="icon-pencil"></i> </a>
            <a title="Delete" class="c-p text-l-none"><span class="activity-delete icon-trash" id="{{id}}" url="core/api/contacts/notes/bulk"></span></a>
        </span>
</div>
</div>
<div class="clearfix"></div>
</div>
</script>
<script id="stats-collection-template" type="text/html">
{{#unless this.length}}
        <div class="wrapper p-t-none">
            <div class="slate-content">
                <div class="box-left pull-left m-r-md">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right pull-left">
                    <h4 class="m-t-none">{{contactShortName}} has no web activity.</h4>
                    <div class="text">
						May be {{contactShortName}} did not visit the required page yet.
                    </div>
                </div>
				<div class="clearfix">
				</div>
            </div>
        </div>
        {{/unless}}

{{#if this.length}}

<div class="m-l">
	<span>
		<h5 class="m-t-none">
	  	    <a class="text-l-none"><b>Initial Referrer URL</b></a><img border="0" src="/img/help.png"
		    style="height: 6px; vertical-align: text-top" rel="popover"
			data-placement="bottom" data-title="Referrer URL"
			data-content="This is the web page from where this contact has come to your website the very first time."
			id="element" data-trigger="hover"> : {{checkOriginalRef "original_ref"}} {{#if this.length}}{{queryWords "original_ref"}}{{/if}}
		</h5>
	</span>	
</div>
	<ul id="stats-model-list" class="ativity-block-ul list-group list-group-lg no-radius m-b-none m-t-n-xxs"></ul>
{{/if}}

</script>

<!-- Web Stats model -->
<script id="stats-model-template" type="text/html">
<div  class="activity block">
	<div class="activity-text-block">
		
		<h4 class="inline hide"><b>Page View Analytics</b></h4>

<div class="pull-right">
		<small class="edit-hover text-muted">
			<i class="fa fa-clock-o m-r-xs"></i><time class="stats-created-time" datetime="{{epochToHumanDate "" created_time}}" >{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time>
		</small>	
        
	</div>

        <div class="m-b-xs"  id="truncated-webstats">
		    <div class="list-none p-n">
			    <div>	
					{{#stringToJSON this "urls_with_time_spent"}}
                    <div class="text-md text-cap custom-color"><a id="show-page-views" href="#">Pages Visited ({{this.length}}) </a></div>
							
					{{!-- {{#if_more_urls this this.length}}		
						<div class="limited-page-urls word-break-all">
                    		{{#each this.urls}}{{url}} - {{convertSecondsToHour time_spent}}<br/>{{/each}}
						</div>

                     {{else}}
						<div class="word-break-all">{{#each this}}{{url}} - {{convertSecondsToHour time_spent}}<br/>{{/each}}</div>
                     {{/if_more_urls}}--}}

                    {{/stringToJSON}}
				</div>
             </div>  
      	</div>

<div id="complete-webstats" style="display:none;">
		<div class="list-none p-n">
			<div>	
					{{#stringToJSON this "urls_with_time_spent"}}
                    <!--<div  class="text-md text-cap custom-color">
						Pages Visited ({{this.length}}){{/stringToJSON}}
					
					</div>-->

					{{#stringToJSON this "urls_with_time_spent"}}	
					<div>
					{{#each this}}{{url}} - {{convertSecondsToHour time_spent}}<br/> {{/each}}
					</div>

                    {{/stringToJSON}}
				</div>  
 
                {{#if ref}}
                <div class="m-t-xs">	
					<span>Referred -- </span>
							
					<span>
						{{ref}}
					</span>
				</div>
               {{/if}}
               
               {{#if ip}}
				<div class="m-t-xs">	
					<span>IP Address -- </span>		
					<span>
						{{ip}}
					</span>
				</div>
               {{/if}}

			   {{#if city}}
                <div class="m-t-xs">	
					<span>Location -- </span>		
					<span>
						{{ucfirst city}}, {{ucfirst region}}, {{getCountryName country}}
					</span>
				</div>
               {{/if}}
		</div>
<div class="pull-left">
{{#if user_agent}}
			{{#stringToJSON this "parsedUserAgent"}}
        	<div>
				{{#if device_type}}
              		<img class="inline m-r-xs r r-2x" src="/img/web-stats/devices/{{device_type}}.png"  title="{{device_type}}">
				{{/if}}
				{{#if os}}
                	<img class="inline m-r-xs r r-2x" src="/img/web-stats/os/{{normalize_os os}}.png" title="{{os}}">
				{{/if}}
				{{#if browser_name}}
		      		<img class="inline m-r-xs r r-2x" src="/img/web-stats/browsers/{{browser_name}}.png"  title="{{browser_name}}">
				{{/if}}
        	</div>
       		{{/stringToJSON}}
        {{/if}}
</div>
</div>
	<div class="clearfix"></div>
<!--<div class="pull-right">
<a href="#" id="more-page-urls">More</a>
</div>-->
<div class="clearfix"></div>	
</div>
</div>
</script><script id="contact-tasks-collection-template" type="text/html">
		{{#unless this.length}}
        <div class="wrapper p-t-none">
            <div class="slate-content">
                <div class="box-left pull-left m-r-md">
                    <img alt="Clipboard" src="/img/clipboard.png" />
                </div>
                <div class="box-right pull-left">
                    <h4 class="m-t-none">You have no tasks for {{contactShortName}}.</h4>
                    <div class="text">
                        You can add a task related to a contact for calling, email, follow-up etc.
                    </div>
                    <a href="#" class="btn blue btn-slate-action btn-default btn-sm contact-add-task m-t-xs"><i class="icon-plus-sign"></i>  Add Task</a>
                </div>
				<div class="clearfix">
				</div>
            </div>
        </div>
        {{/unless}}
        {{#if this.length}}
	<div class="m-b-md m-t-md m-r-sm" align="right">
		<a href="#" class="btn btn-default btn-sm contact-add-task pos-rlt m-t-xs btn-addon"><span><i class='icon-plus-sign'/></span> Add Task</a>
	</div>
			<ul id="contact-tasks-model-list" class="ativity-block-ul list-group list-group-lg no-radius m-b-none m-t-n-xxs" url="core/api/notes/bulk"></ul>
		{{/if}} 
</script>


<script id="contact-tasks-model-template" type="text/html">
<div class="activity block pos-rlt">
	{{#if is_complete}}
		<div>
	{{else}}
		<div>
	{{/if}}	
	<div class="activity-block-owner thumb-xs pull-right avatar">
		{{#if ownerPic}}
			<img class="user-img r r-2x" alt="" src="{{ownerPic}}" >
		{{else}}
			<img class="user-img r r-2x" src="{{defaultGravatarurl 40}}">
		{{/if}}
	</div>
<span class="hidden">{{taskOwner.name}}</span>
<div class="pull-left rightThumbView">
<div class="pull-left  text-md text-cap">
    {{#if is_complete}}
			<div><span><i class="fa fa-check"></i></span><div class="task-subject inline" style="margin-left:9px"><a  href="#task/{{id}}">{{subject}}</a></div>{{#if_equals priority_type "NORMAL"}}{{else}}
					<span class="label hidden label-{{task_label_color priority_type}}">{{ucfirst priority_type}}</span>{{/if_equals}}
                   <span><label class="label bg-light text-tiny"><i class="fa {{icons type}} hide"></i>&nbsp;{{ucfirst type}}</label></span>
				</div>
		{{else}}
			<div><label class="i-checks i-checks-sm"><input data="{{id}}" class="complete-task form-control" type="checkbox"/><i></i></label><div class="task-subject inline"><a  href="#task/{{id}}">{{subject}}</a></div>{{#if_equals priority_type "NORMAL"}}{{else}}
					<span class="label hidden label-{{task_label_color priority_type}}">{{ucfirst priority_type}}</span>{{/if_equals}}
                    <span><label class="label bg-light text-tiny"><i class="fa {{icons type}}"></i>&nbsp;{{ucfirst type}}</label></span>
				</div>
	{{/if}}
</div>
    
     <div class="clearfix"></div>
 
	<div><span class="m-l-md p-l-xs">Due : <i class="fa fa-clock-o m-r-xs hide"></i><time class="task-created-time" datetime="{{epochToHumanDate "" due}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" due}}</span></div>
    <div class="m-l-md p-l-xs">	
		{{#each contacts}}
           	{{#if id}}
				{{#isDuplicateContactProperty properties "email"}}

					{{else}}
						{{#if_contact_type "PERSON"}}	
							<a  href="#contact/{{id}}" >{{getPropertyValue properties "first_name"}} {{getPropertyValue properties "last_name"}}</a>,
        				{{/if_contact_type}}
						{{#if_contact_type "COMPANY"}}
        					<a  href="#contact/{{id}}">{{getPropertyValue properties "name"}}</a>,
        				{{/if_contact_type}}
				{{/isDuplicateContactProperty}}
           		
           	{{/if}}
       	{{/each}}
		</div>
		</div>
		<div class="clearfix"></div>
 <div class="pull-left">
     <small class="edit-hover text-muted m-l-md p-l-xs"> 
          <i class="fa fa-clock-o m-r-xs"></i>
			<time class="task-created-time" datetime="{{epochToHumanDate "" created_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time>
		</small>
     </div>
<div class="pull-right">
		<span class="actions">
			<a title="Edit"  data="{{id}}" class="task-edit-contact-tab c-p text-l-none p-r-sm"> <i class="icon-pencil"></i> </a>
            <a title="Delete" class="c-p text-l-none"><span class="activity-delete icon-trash" id="{{id}}" url="core/api/tasks/bulk"><i></i></span></a>
        </span>
        </div>
<div class="clearfix"></div>
 
</div>
</div>
<div class="priority_type hidden">{{priority_type}}</div>
</script><script id="contact-detail-template" type="text/html">
<!-- previous next actions -->

<!-- ending previous next actions -->
<!--  header  row view starting -->


<div class="app-content-full  h-full dock-view-fixing">
<div class="hbox hbox-auto-xs hbox-auto-sm bg-light" >
  
  <div class="col bg-light lter b-r" style="width:299px">
  <div class="vbox">
  <div class="row-row">
  <div>
  <div>
    <div class="wrapper contactView p-t-sm" style="width:299px">
	<div class="pos-rlt w-full">
<div class="contact-navigation-view"><span class="navigation  contact-switching"></span></div>
<div class="clearfix"></div>
     </div>

<!-- starting section one -->
                        <div class="text-center   pos-rlt">
						<div class="thumb-lg">
							<form id="contact-container">
								<a href="#" class="tooltip_info" data-placement="top"
									data-toggle="tooltip"
									title="<i class='icon-edit icon-white icon'></i> Change Picture"> 
									<img class='upload_pic imgholder submit w-full img-circle' style="width:96px;height:96px;" type="submit"
									src="{{gravatarurl properties 80}}" /></a> 
									<input type="hidden" id="upload_url" name="gravatarurl">
								<a style="display: none;" class="save_img submit" type="submit">Save</a>
							</form>
						</div>
						 <div class="pos-abs pos-r-0 m-t-sm">
						<div>
								
								
								<a class="dropdown-toggle" data-toggle="dropdown"><span class="fa fa-angle-down text-lg"></span></a>
								<ul class="dropdown-menu pull-right">
                                    <li><a href='#contact-edit'><i class="icon-edit"></i> Edit </a></li>
<li class="divider"></li>
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
						
						
                           
						
						<div class="w-full  m-t-xs  h3 font-thin custom-color" style="padding-bottom:1px;width:95%;">
								{{getPropertyValue properties
										"first_name"}} {{getPropertyValue properties "last_name"}}
								 <!-- {{#if_propertyName "email"}}</br> <a href='#send-email/{{value}}'>{{value}}</a>{{/if_propertyName}} -->
								</div>
							<div class="text-md m-b-xs text-cap">	
						<div class="contact-job-title  text-center font-thin custom-color">{{#if_propertyName "title"}} {{value}}{{/if_propertyName}}   {{#if contact_company_id}}

									<a href="#contact/{{contact_company_id}}">{{getPropertyValue properties "company"}}</a>
								{{else}}
									{{getPropertyValue properties "company"}}
								{{/if}}</div>
								
								
							<div class="clearfix"></div>	
								
								
						<!-- <div class="contact-company-name text-ellipsis pull-left w-half font-thin">
														
                         {{#if contact_company_id}} 
									<a href="#contact/{{contact_company_id}}">{{getPropertyValue properties "company"}}</a>
								{{else}}
									{{getPropertyValue properties "company"}}
								{{/if}}
                         </div> -->
                         <div class="clearfix"></div>
                         </div>
						</div>
	<!-- ending section one -->					
						
						
	
	<div class="clearfix"></div>
	<div class="contact-website   text-base text-center m-b-xs">
					
                                    
						            {{#property_is_exists "website" properties}}
									{{#multiple_Property_Element "website" properties}} {{#each
									this}} {{#if_equals subtype "TWITTER"}}
									
									 <span class="m-r-xs"><a target="_blank"
										href="https://twitter.com/{{getTwitterHandleByURL value}}"
										style="text-decoration: none"> <i
											class="{{get_social_icon "
											TWITTER"}}    text-base text-muted"></i>
									</a>
									</span> {{else}}  {{#if_equals subtype "SKYPE"}} <span
										class="m-r-xs"><a class="text-l-none" target="_blank"
										href="{{getSkypeURL value}}"> <i
											class="{{get_social_icon "
											SKYPE"}}   text-base text-muted"></i>
									</a>
									</span>{{else}} {{#if_equals subtype "FACEBOOK"}} <span
										class="m-r-xs"><a target="_blank" class="text-l-none"
										href="{{buildFacebookProfileURL value}}"> <i
											class="{{get_social_icon "
											FACEBOOK"}}   text-base text-muted"></i>
									</a>
									</span>{{else}}

								{{#if_equals subtype "GOOGLE-PLUS"}} <span
										class="m-r-xs"><a target="_blank"
										href="https://plus.google.com/{{getTwitterHandleByURL value}}/" class="text-l-none"> <i
											class="{{get_social_icon "
											GOOGLE-PLUS"}} text-base text-muted"></i>
									</a>
									</span>{{else}}
									<span class="m-r-xs"> <a
										target="_blank" href="{{getHyperlinkFromURL value}}" class="text-l-none">
											<i class="{{get_social_icon subtype}} text-base text-muted"></i>
									</a>
									</span>
								
									 {{/if_equals}} {{/if_equals}} {{/if_equals}} {{/if_equals}} {{/each}} {{/multiple_Property_Element}}
									{{/property_is_exists}}
									</div>
											
							<div class="clearfix"></div>
						
						<!--  starting section 3  -->
                     
<div class="btn-group btn-group-justified m-b hide"> <a class="btn btn-primary btn-rounded" data-toggle="button"> <span class="text"> <i class="fa fa-phone"></i> Call </span> </a> <a class="btn btn-info btn-rounded"> <i class="fa fa-envelope-o"></i> Email </a> </div>
                    <div class="panel wrapper">	
					<div class="row">
					<div class="col-xs-6">			
					 <div id='star' class="contact-star"></div>
					</div>
					<div class="col-xs-6 text-right">		
								<!--  starting score -->
						<div class="unselectable m-t-n-xs" id="score" unselectable="on" onselectstart="return false">
							<div  class="text-lg score-view">
								<img src="../../img/flame.png" style="width:13px;"> <span class="m-l-n-xs pos-rlt" style="top:-3px">
									<img border="0" src="/img/help.png"
									style="height: 6px; vertical-align: middle" rel="popover"
									data-placement="bottom" data-title="Lead Score"
									data-content="Score your leads to get high quality leads to appear on top. Manually assign scores or automate the process based on user behavior using Workflow automation."
									id="element" data-trigger="hover">
								</span>
							
								<span class="inline-block v-middle">
									{{#if lead_score}} <span id="lead-score">{{lead_score}}</span>&nbsp;
									{{else}} <span id="lead-score">0</span>&nbsp;
									{{/if}}
								</span>
							{{#canEditContact owner.id}}
								<span class="contact-score-control m-l-xs">
									<ul class="inline-block list-none m-n p-n">
										<li style="height: 9px"><i class="icon-sort-up c-p" id="add"
											style="height: 10px;"></i></li>
										<li><i class="icon-sort-down c-p" id="minus"
											style="height: 10px;"></i></li>
									</ul>
								</span>
							{{/canEditContact}}
							</div>
						</div>
						</div>
						</div>
						</div>
						
						<!--  ending section 3 -->
								
<div class="text-md ">
<div class="p-t-none p-r-xs p-b-none p-l-xs" style="display:none;"> {{#comma_in_between_property "title" "company" properties}}{{/comma_in_between_property}}</div>
<div class="clearfix"></div>
</div>

	<div clas="m-t-sm"><small class="text-muted text-sm">Owner</small></div>
	<div class="change-owner-succes"></div>
     <div title="Owner">
      	<div class="contact-owner text-base" id="change-owner-element">
        	
			{{#if owner}}
        	<span class="contact-owner-pic"><img class="user-img"  alt="" src="{{defaultGravatarurl 40}}" /></span>
			{{else}}
			<span class="contact-owner-pic"><img class="user-img"  alt="" src="{{defaultGravatarurl 40}}" /></span><span class="contact-owner-add"><a class="c-p">Assign Owner</a></span>
 			{{/if}}
        	<a id="contact-owner" class="custom-color" data={{owner.id}}>{{owner.name}}</a>
        
        	{{#canEditContact owner.id}}
        	<div class="dropdown" id="change-owner-ul"  style="display: none">
        		 <a class="btn btn-sm dropdown-toggle btn-default" data-toggle="dropdown">Change Owner <span class="caret"></span></a>
        		 <ul id='contact-detail-owner' class="dropdown-menu"></ul>
        	</div> 
			{{/canEditContact}}
       </div>
    </div>

<div class="m-t-sm"><small class="text-muted text-sm">Tags</small></div>
						<div class="contact-tags m-b-xs m-t-xs">
					<ul id="added-tags-ul" class="tagsinput inline v-top m-b-sm p-n">
							{{#if tagsWithTime.length}} 
							 {{#canEditContact owner.id}}
								{{#each tagsWithTime}}
										<li class="inline-block tag btn btn-xs btn-default m-r-xs m-b-xs" data="{{this.tag}}"><span><a
								class="anchor m-r-xs custom-color" style="color:#363f44" href="#tags/{{encodeString this.tag}}">{{this.tag}}</a><a
								class="close remove-tags" tag="{{this.tag}}">&times</a></span></li> 
								{{/each}}
								{{else}}
									{{#each tagsWithTime}}
										<li class="inline-block tag btn btn-xs btn-default m-r-xs m-b-xs" data="{{this.tag}}"><span><a
											class="anchor" style="color:#363f44" href="#tags/{{encodeString this.tag}}">{{this.tag}}</a></span></li> 
									{{/each}}
							 {{/canEditContact}}
							{{/if}}
						 
						
					</ul>
					<div class="inline-block m-t-xs">
						<div id="addTagsForm" style="display: none;" class="m-b-none">
							<div class="control-group save-tag m-b-none">
								<input name="" type="text" id="addTags"
									class="tags-typeahead ignore-comma-keydown form-control inline-block"
									style="width: 60%" placeholder="Enter tag" />
								<span><a href="#" class="btn btn-sm btn-default m-l-sm m-r-xs" id="contact-add-tags">Add</a></span>
							</div>
						</div>
						{{#canEditContact owner.id}}
			<a href="#" id="add-tags" rel="tooltip"
							data-original-title="addtag" data-placement="top" class="text-xs text-muted"><i
							class="icon-plus"></i> <span >Add</span></a>
						{{/canEditContact}}

						
					</div>
				</div>	

						
				<!--  starting section 5 -->		
						
			 {{#property_is_exists "phone" properties}}
			<div class="widget_container contact-rightpanel phone m-t-sm" id="{{name}}-container">
				{{else}} 
					{{#property_is_exists "email" properties}}
						<div class="widget_container contact-rightpanel email m-t-sm" id="{{name}}-container">
						{{else}} 
							{{#property_is_exists "address" properties}}
									<div class="widget_container contact-right-panel address m-t-sm" id="{{name}}-container">
									{{else}}
										{{#getContactCustomProperties properties}}
											<div class="widget_container contact-right  customfiled m-t-sm" id="{{name}}-container">
											{{else}}
												<div class="widget_container hide m-t-sm" id="{{name}}-container">
										{{/getContactCustomProperties }}
							{{/property_is_exists}} 
					{{/property_is_exists}}
		{{/property_is_exists}}
						<h4 class="m-t-xs m-b-xs hide">
							
							<i class="icon-user text-lg"></i>Contact
									<span class="text-cap">{{getPropertyValue properties "first_name"}}</span>
							
						</h4>
						<!-- <div id="qrcode"><img src="img/1-0.gif"></div>
						For refreshing the contact in the model list -->
						<div id="refresh_contact" class="m-t-sm m-r-md m-l-md text-sm" style="display:none;">This contact has been updated
							<a id="action_refresh_contact" class="c-p">
								<i class="icon-refresh" rel="popover" data-placement="top" data-title="Refresh Contact" data-content="Click to get updated contact details." data-trigger="hover"></i>
							</a>
						</div>

						<div class="clearfix"></div>
					
	
						
						
						
						
						
							{{#property_is_exists "phone" properties}}
							<div>
								{{#multiple_Property_Element "phone" properties}}
								  
								<!-- <div style="display: inline-block; text-align: right" class="span4">
									<span><strong style="color: gray">Phone</strong><span>
								</div> -->
						
				<div class="m-t-sm"><small class="text-muted text-xs">Contact Info</small></div>				
								<div class="contact-phone">
									{{#each this}}
									<div class="pull-left contact-phone-icon hide">
									<i class="icon icon-call-end text-sm m-r-xs v-middle"></i>
									</div>
									<div class="text-sm">
                                        <a href='#' class="contact-make-sip-call" style="display:none;" phone="{{value}}">
                                           {{value}}
                                        </a>            
                                        <a href='#' class="contact-make-twilio-call" style="display:none;"                                           
                                           phone="{{value}}">
                                           {{value}}
                                        </a>    
										<a href="tel:{{remove_spaces value}}" class="contact-make-call">{{value}}</a> 
                                        {{#if subtype}}<span class="label bg-light dk text-tiny">{{subtype}}</span> {{/if}}
									</div>
									<div class="clearfix"></div>
									{{/each}}
								</div>
								{{/multiple_Property_Element}}
							</div>
							<div class="clearfix"></div>
							{{/property_is_exists}}
 							{{#property_is_exists "email" properties}}
							
								{{#multiple_Property_Element "email" properties}}
								<!--  <div style="display: inline-block; text-align: right" class="span4">
									<span><strong style="color: gray">Email</strong></span>
								</div> -->
							
									
									
								{{#property_is_exists "phone" ../properties}}
								
									{{else}}
									<div class="m-t-sm"><small class="text-muted text-xs">Contact Info</small></div>
									
										{{/property_is_exists}}
										<div class="contact-email text-sm l-h"> 
									{{#each this}}

<div class="pull-left contact-email-icon m-r-xs hide"><i class="icon icon-envelope text-sm v-middle"></i></div>
										<div class="text-ellipsis">
											<a href='#send-email/{{value}}'>{{value}}</a> {{#if subtype}} <span class="label bg-light dk text-tiny">{{subtype}}</span> {{/if}}
										</div>

<div class="clearfix"></div>
									{{/each}}
									</div>
									
									
								
									{{/multiple_Property_Element}}
								

								{{/property_is_exists}}

 {{#getContactCustomPropertiesExclusively
								properties}}
								<div class="custom-data">
<div class="m-t-sm"><small class="text-xs text-muted">Custom Info</small></div>
								<div>
					<div class="contact-custom-icon pull-left hide" style="width:19px;"><i class="icon icon-info text-sm"></i></div>			
								<div class="l-h">
									{{#each_with_index this}}


                                            <span class="contact-custom-name custom-color">
												<span class="text-light" title="{{name}}">{{name}}</span>
											</span>

										
										{{#if_equals index ../this.length}}
											<span class="contact-custom-value text-sm word-break custom-color">
											{{#if_equals subtype "DATE"}} <i class="fa fa-clock-o m-r-xs"></i><time class="note-created-time" datetime="{{epochToHumanDate "" value}}">{{epochToHumanDate "dd mmm yyyy" value}}</time>{{else}}{{value}} {{/if_equals}}</span>
										{{else}}
											<span class="contact-custom-value text-sm word-break custom-color">
											{{#if_equals subtype "DATE"}} <i class="fa fa-clock-o m-r-xs"></i><time class="note-created-time" datetime="{{epochToHumanDate "" value}}">{{epochToHumanDate "dd mmm yyyy" value}}</time>{{else}}{{value}} {{/if_equals}}</span>
										{{/if_equals}}
										
										
											
<div class="clearfix"></div>
										
										
									{{/each_with_index}}
</div>
									</div>
									</div>
									{{/getContactCustomPropertiesExclusively}}
									
									<div class="clearfix"></div>
									{{#property_is_exists "address" properties}}
<div class="m-t-sm"><small class="text-xs text-muted">Location</small></div>
										<div >{{#address_Element properties}}{{/address_Element}}</div>
                                        <div class="clearfix"></div>
										
										
										
                                        <div class="pull-left m-t-sm m-b-sm w-full">
											<div id="map" class="w-auto m-n" style="height: 200px; display: none;">
											</div>
                                            <div id="contacts-local-time" class="text-xs" style="display:none;">                                             
                                               <div class="contacts-time" style="width:89%"></div>                                               
                                            </div>
										</div> 
                           	            <div class="clearfix"></div> 
                                     </div>                                       
									{{/property_is_exists}}

							


							<div class="clearfix"></div>
                            </div>	

                    
							
				<!-- ending section 5 -->	
					


</div>
</div>
</div>
</div>
</div>
</div>
		<!--  ending top header  view -->
<div class="col bg-white">
 <div class="vbox" style="display:block">
  <div class="row-row" style="display:block">
  <div>
  <div>	
		
		<!--  starting middle view col -->
		
		<!--  starting time line view -->
		<div  id="contacts-inner-tabs">
        <div class="tab-container">
<div class="pull-left p-sm bg-light text-xs text-muted" id="prev"><i class="fa fa-chevron-left"></i></div>
			<ul class="nav nav-tabs bg-light pull-left b-n" id="contactDetailsTab">
				<li class=""><a data-toggle="tab" href="#timeline">Timeline</a></li>
				<li class=""><a data-toggle="tab" href="#notes">Notes</a></li>
				<li class=""><a data-toggle="tab" href="#events">Events</a></li>
				<li class=""><a data-toggle="tab" href="#tasks">Tasks</a></li>
				<li class=""><a data-toggle="tab" href="#deals">Deals</a></li>
				<li class=""><a data-toggle="tab" href="#cases">Cases</a></li>
				<li class=""><a data-toggle="tab" href="#campaigns">Campaigns</a></li>
				<li class=""><a data-toggle="tab" href="#stats">Web Stats</a></li>
				<li class=""><a data-toggle="tab" href="#mail">Mail</a></li>
				<li id="custom-contact-document" class=""><a data-toggle="tab" href="#documents">Documents</a></li>
              <!--  <li role="presentation" class="dropdown custom-contact-menu">
        <a id="drop6" href="#" class="dropdown-toggle" data-toggle="dropdown">
          
          <span class="caret"></span>
        </a>
        <ul  class="dropdown-menu" role="menu">
         <li id="contact-webstats"><a data-toggle="tab" href="#stats">Web Stats</a></li>
		<li id="contact-mail"><a data-toggle="tab" href="#mail">Mail</a></li>
		<li class=""><a data-toggle="tab" href="#documents">Documents</a></li>
         </ul> 
         </li>  -->
			</ul> 
<div class="pull-left p-sm bg-light text-xs text-muted" id="next"><i class="fa fa-chevron-right"></i></div>
<div class="clearfix"></div>
           </div>
			<div class="tab-content no-tab-cell" id="contact-tab-content">
				<div class="tab-pane" id="time-line">
					<div class="timeline-loading-img overflow-hidden" style="width:35px;max-height:30px;">
						<img class="loading-img" src="img/21-0.gif"></img>
						<!-- <img class="loading-img-log" src="img/21-0.gif"></img>
						<img class="loading-img-email" src="img/21-0.gif"></img>
						<img class="loading-img" src="img/21-0.gif"></img>
						<img class="loading-img-stats" src="img/21-0.gif"></img> -->
					</div>

					<div class="alert-info alert" id="timeline-slate"
						style="display: none">
						<div class="slate-content">
							<div class="box-left pull-left m-r-md">
								<img alt="Clipboard" src="/img/clipboard.png" />
							</div>
							<div class="box-right pull-left">
								<h4 class="m-t-none">{{getPropertyValue properties "first_name"}} has no
									entities (Notes, Tasks, Deals and etc..) related, to show in
									the Timeline.</h4>
								<div class="text">You can add entities related to it by
									selecting suitable option from the above "actions" drop down
									button.</div>
								<a href="#">Click here to learn more</a> <br />
							</div>
							<div class="clearfix">
							</div>
						</div>
					</div>

					<div class="m-auto">
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
</div>
</div>
 </div>
  </div>
  </div>
	<!--  starting right panel view -->
	<div class="contact-right-widgetsview box-border b-l col w-lg bg-light lter b-l bg-auto">
	 <div class="vbox">
  <div class="row-row">
  <div>
  <div>	
		
<div class="wrapper">

	
                           
						

				<div id="widgets"></div>

							


								
							

						</div>
					</div>
					</div>
					</div>
					</div>
					</div>
					</div>
					</div>
					</div>
                    </div>
					<!--  ending middle view row -->
					
					
					</script><script id="year-marker-template" type="text/x-handlebars-template">
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
            <div class="title"><div class="text-base"><span><a class="no-line"><i class="icon-list-alt text-muted"></i></a></span> {{subject}}</div></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                <span class="text-xs">{{description}}</span>
            </div>
        {{/if_entity}}
        {{#if_entity "task"}}
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><div class="text-base"><span><a class="no-line"><i class="icon-tasks text-muted"></i></a></span> Task</div></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                <div class="text-xs text-ellipsis" style="margin-top:-8px"><i class="{{icons type}}"></i> ({{type}})</div>         
                <div class="text-xs text-ellipsis">{{{subject}}}</div>
            </div>
        {{/if_entity}}

        {{#if_entity "contact_entity"}}
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><div class="text-base"><span><a class="no-line"><i class="icon-tasks text-muted"></i></a></span> Created</div></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body" style="padding:5px">
                <div class="text-base ">{{epochToHumanDate "mmmm dd, yyyy 'at' hh:MM tt" created_time}}</div>
            </div>
        {{/if_entity}}
	
	  {{#if_entity "tag"}}
			<div id="{{remove_spaces tag}}-tag-timeline-element"></div>
            <div class="timestamp">{{createdTime}}</div>
            <div class="title"><div class="text-base"><span><a class="no-line"><i class="icon-tag text-muted"></i></a></span> Tag Added - {{tag}}</div></div>
            <div class="date">{{epochToTaskDate createdTime}}</div>
            <div class="body" style="padding:5px">
                <div class="text-base ">{{epochToHumanDate "mmmm dd, yyyy 'at' hh:MM tt" createdTime}}</div>
            </div>
        {{/if_entity}}

        {{#if_entity "agile_email"}}
            <div class="timestamp">{{createdTime}}</div>
            <div class="title"><div class="text-base"><span><a class="no-line"><i class="icon-folder-open-alt text-muted" title="Email Opened"></i></a></span> Email Opened</div></div>
            <div class="date">{{epochToTaskDate createdTime}}</div>
            <div class="body">
                <div style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden"><b>Subject:</b> {{subject}}</div>
                <div class="text-xs"><span><em>Sent on</em></span> {{epochToHumanDate "mmmm dd, yyyy 'at' hh:MM tt" trackerId}}</div>
                <div class="text-xs"><span><em>Opened on</em></span> {{epochToHumanDate "mmmm dd, yyyy 'at' hh:MM tt" createdTime}}</div>
            </div>
        {{/if_entity}}

        {{#if_entity "deal"}}
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><div class="text-base"><span><a class="no-line"><i class="icon-money text-muted"></i></a></span> Deal</div></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                <div class="text-xs ">{{name}}</div>
                <div class="text-xs ">{{description}}</div>
            </div>
        {{/if_entity}}

		{{#if_entity "case"}}
			
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><div class="text-base"><span><a class="no-line"><i class="icon-folder-close text-muted"></i></a></span> Case</div></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                <div class="text-xs ">{{title}}</div>
                <div class="text-xs ">{{description}}</div>
            </div>
        {{/if_entity}}

        {{#if_entity "log"}}
            <div class="timestamp">{{time}}</div>
            <div class="title"><div class="text-base"><span><a class="no-line"><i class="icon-inbox text-muted"></i></a></span> {{titleFromEnums log_type}}</div></div>
            <div class="date">{{epochToTaskDate time}}</div>
            <div class="body">
                <div class="caption" style="margin-top:-8px">Campaign - {{campaign_name}}</div>

            {{#if message}}
                    <div class="text-xs text-ellipsis">{{#if_email_sent this "log_type"}} Subject: {{Subject}} {{else}} {{{message}}} {{/if_email_sent}}
                        <div class="right" data="{{#if_email_sent this "log_type"}} Subject: {{Subject}} {{else}} {{{message}}} {{/if_email_sent}}"><a href="#" id="tl-log-popover"><i class="glyphicon glyphicon-plus-sign"></i></a></div>
                    </div>   
            {{/if}}        
            </div>
        {{/if_entity}}

        {{#if_entity "date"}}
            <div class="timestamp">{{date_secs}}</div>
            <div class="title"><div class="text-base"><span><a class="no-line"><i class="icon-envelope text-muted"></i>
			{{#if trackerId}}
        		{{#if_equals "true" is_email_opened}}r
        	    		<i class="icon-folder-open-alt" title="Email Opened"></i>
        		{{/if_equals}}
    		{{/if}}
            </a>
            </span> {{subject}}</div></div>
            <div class="date">{{epochToTaskDate date_secs}}</div>
            <div class="body">
                <div class="text-xs text-ellipsis"><b>From:</b> {{from}}</div>
                <div class="text-xs text-ellipsis" id="tl-mail-to-popover" rel="popover" data-placement="right" data-content="message:" data-trigger="hover"><b>To:</b> {{to}}
                </div>            
            {{#if message}}
                <div class="text-xs"><div class="ellipsis-multi-line" id="autoellipsis" style="height:70px;"><div> <p>{{{message}}}</p></div></div>
                    <div class="right" data="{{message}}"><a href="#" id="tl-mail-popover"><i class="glyphicon glyphicon-plus-sign"></i></a></div>
                </div> 
            {{/if}}       
            
			</div>
        
        {{/if_entity}}

     {{#if_entity "guid"}}
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><div class="text-base"><span><a class="no-line"><i class="icon-list-alt text-muted"></i></a></span> Web</div></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                <div class="text-base ">
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
                     <div class="text-base "><b>Referred:</b></br> {{ref}}</div>
                {{/if}}

                {{#if city}}
                   <div class="text-base "><b>ADDRESS:</b></br> {{ucfirst city}}, {{ucfirst region}}, {{getCountryName country}}</div>
                {{/if}}

                <div class="right" style="margin-top:-10px;"><a href="#" id="tl-analytics-popover"><i class="glyphicon glyphicon-plus-sign"></i></a></div>
            </div>
     {{/if_entity}}

{{#if_entity "twilio"}}
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><div class="text-base"><span><a class="no-line"><i class="icon-phone text-muted" title="You Called"></i></a></span>{{title}}</div></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                 <div class="text-xs ">{{name}}</div>
                <div class="text-xs ">{{body}}</div>
            </div>
        {{/if_entity}}

{{#if_entity "custom"}}
            <div class="timestamp">{{created_time}}</div>
            <div class="title"><div class="text-base"><span><a class="no-line"><i class="icon-folder-open-alt text-muted" title="Email Opened"></i></a></span>{{title}}</div></div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                 <div class="text-xs ">{{name}}</div>
                <div class="text-xs ">{{body}}</div>
            </div>
        {{/if_entity}}
	<a href="#" class="open-close"></a>
  </div>
</div>
</script>


<script id="timeline1-template" type="text/x-handlebars-template">

{{#each this}}
{{#if id}}
<div class="item post" id={{id}}>
{{else}}
<div class="item post" id="id-{{@index}}">
{{/if}}
    <div class="inner">
        {{#if_entity "note"}}
            <div class="timestamp">{{created_time}}</div>
            <!-- <div class="title"><div class="text-base"><span><a class="no-line"><i class="icon-list-alt"></i></a></span> {{subject}}</div></div> -->
			<div class="text-md text-cap">	
				<div class="contact-job-title text-base custom-color">
					<i class="icon-list-alt text-muted p-r-xs"></i>{{subject}}
				</div>
			</div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                <span class="text-xs">{{description}}</span>
            </div>
        {{/if_entity}}

        {{#if_entity "task"}}
            <div class="timestamp">{{created_time}}</div>
            <!-- <div class="title"><div class="text-base"><span><a class="no-line"><i class="icon-tasks"></i></a></span> Task Added</div></div> -->
			<div class="text-md text-cap">	
				<div class="contact-job-title text-base custom-color">
					<i class="icon-tasks text-muted p-r-xs"></i>Task Added
				</div>
			</div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                <!-- <div class="caption" style="margin-top:-8px"><i class="{{icons type}}"></i> ({{type}})</div> -->         
                <div class="text-xs ">{{{subject}}} <span>({{task_property type}})</span></div>
            </div>
        {{/if_entity}}

        {{#if_entity "contact_entity"}}
            <div class="timestamp">{{created_time}}</div>
            <!-- <div class="title"><div class="text-base"><span><a class="no-line"><i class="icon-tasks"></i></a></span> Created</div></div> -->
			<div class="text-md text-cap">	
				<div class="contact-job-title text-base custom-color">
					<i class="icon-tasks text-muted p-r-xs"></i>Created
				</div>
			</div>
            <div class="date" title="{{epochToHumanDate "mmmm dd, yyyy 'at' hh:MM tt" created_time}}">{{epochToTaskDate created_time}}</div>
            <!-- <div class="body" style="padding:5px">
                <div class="text-base ">{{epochToHumanDate "mmmm dd, yyyy 'at' hh:MM tt" created_time}}</div>
            </div> -->
        {{/if_entity}}
	
	  {{#if_entity "tag"}}
			<div id="{{remove_spaces tag}}-tag-timeline-element"></div>
            <div class="timestamp">{{createdTime}}</div>
            <!-- <div class="title"><div class="text-base"><span><a class="no-line"><i class="icon-tag"></i></a></span> Tag Added</div> - {{tag}}</div> -->
			<div class="text-md text-cap">	
				<div class="contact-job-title text-base custom-color">
					<i class="icon-tag text-muted p-r-xs"></i>Tag Added - {{tag}}
				</div>
			</div>
            <div class="date" title="{{epochToHumanDate "mmmm dd, yyyy 'at' hh:MM tt" createdTime}}">{{epochToTaskDate createdTime}}</div>
            <!-- <div class="body">
                <div class="text-base ">{{epochToHumanDate "mmmm dd, yyyy 'at' hh:MM tt" createdTime}}</div>
            </div> -->
        {{/if_entity}}

        {{#if_entity "agile_email"}}
            <div class="timestamp">{{createdTime}}</div>
            <!-- <div class="title"><div class="text-base"><span><a class="no-line"><i class="icon-folder-open-alt" title="Email Opened"></i></a></span> Email Opened</div></div> -->
			<div class="text-md text-cap">	
				<div class="contact-job-title text-base custom-color">
					<i class="icon-folder-open-alt text-muted p-r-xs"></i>Email Opened
				</div>
			</div>
            <div class="date">{{epochToTaskDate createdTime}}</div>
            <div class="body">
                <div style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden"><b>Subject:</b> {{subject}}</div>
                <div class="text-xs"><span><em>Sent on</em></span> {{epochToHumanDate "mmmm dd, yyyy 'at' hh:MM tt" trackerId}}</div>
                <div class="text-xs"><span><em>Opened on</em></span> {{epochToHumanDate "mmmm dd, yyyy 'at' hh:MM tt" createdTime}}</div>
            </div>
        {{/if_entity}}

        {{#if_entity "deal"}}
            <div class="timestamp">{{created_time}}</div>
            <!-- <div class="title"><div class="text-base"><span><a class="no-line"><i class="icon-money"></i></a></span> Deal Added</div></div> -->
			<div class="text-md text-cap">	
				<div class="contact-job-title text-base custom-color">
					<i class="icon-money text-muted p-r-xs"></i>Deal Added
				</div>
			</div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                <div class="text-xs ">{{name}}</div>
                <div class="text-xs ">{{description}}</div>
            </div>
        {{/if_entity}}

		{{#if_entity "case"}}
			
            <div class="timestamp">{{created_time}}</div>
            <!-- <div class="title"><div class="text-base"><span><a class="no-line"><i class="icon-folder-close"></i></a></span> Case Added</div></div> -->
			<div class="text-md text-cap">	
				<div class="contact-job-title text-base custom-color">
					<i class="icon-folder-close text-muted p-r-xs"></i>Case Added
				</div>
			</div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                <div class="text-xs ">{{title}}</div>
                <div class="text-xs ">{{description}}</div>
            </div>
        {{/if_entity}}

        {{#if_entity "log"}}
            <div class="timestamp">{{time}}</div>
            <!-- <div class="title"><h3><span><a class="no-line"><i class={{#if_log_type_equals this "log_type" "EMAIL_SENT"}}"icon-envelope"{{else}} {{#if_log_type_equals this "log_type" "EMAIL_OPENED"}}"icon-folder-open-alt"{{else}}"icon-inbox"{{/if_log_type_equals}}{{/if_log_type_equals}}></i></a></span> {{titleFromEnums log_type}}</h3></div> -->
			<div class="text-md text-cap">	
				<div class="contact-job-title text-base custom-color">
					<i class={{#if_log_type_equals this "log_type" "EMAIL_SENT"}}"icon-envelope text-muted p-r-xs"{{else}} {{#if_log_type_equals this "log_type" "EMAIL_OPENED"}}"icon-folder-open-alt text-muted p-r-xs"{{else}}"icon-inbox text-muted p-r-xs"{{/if_log_type_equals}}{{/if_log_type_equals}}></i>{{titleFromEnums log_type}}
				</div>
			</div>
            <div class="date">{{epochToTaskDate time}}</div>
            <div class="body">
                <div class="text-xs text-ellipsis" style="margin-top:-8px">Campaign - {{campaign_name}}</div>

            {{#if message}}
                    <div class="text-xs text-ellipsis">{{#if_email_sent this "log_type"}} Subject: {{Subject}} {{else}} {{{message}}} {{/if_email_sent}}
                        <div class="right" data="{{#if_email_sent this "log_type"}} Subject: {{Subject}} {{else}} {{{message}}} {{/if_email_sent}}"><a href="#" id="tl-log-popover"><i class="glyphicon glyphicon-plus-sign"></i></a></div>
                    </div>   
            {{/if}}        
            </div>
        {{/if_entity}}

        {{#if_entity "date"}}
            <div class="timestamp">{{date_secs}}</div>
            <!-- <div class="title"><h3><span><a class="no-line"><i class="icon-envelope"></i>
			{{#if trackerId}}
        		{{#if_equals "true" is_email_opened}}
        	    		<i class="icon-folder-open-alt" title="Email Opened"></i>
        		{{/if_equals}}
    		{{/if}}
            </a>
            </span> {{subject}}</h3></div> -->
			<div class="text-md text-cap">	
				<div class="contact-job-title text-base custom-color">
					<i class="icon-envelope text-muted p-r-xs"></i>
					{{#if trackerId}}
        				{{#if_equals "true" is_email_opened}}
        	    			<i class="icon-folder-open-alt text-muted p-r-xs" title="Email Opened"></i>
        				{{/if_equals}}
					{{/if}}
					{{subject}}
				</div>
			</div>
            <div class="date">{{epochToTaskDate date_secs}}</div>
            <div class="body">
                <div class="text-xs text-ellipsis" ><b>From:</b> {{from}}</div>
                <div class="text-xs text-ellipsis" id="tl-mail-to-popover" rel="popover" data-placement="right" data-content="message:" data-trigger="hover"><b>To:</b> {{to}}
                </div>
            
            {{#if message}}
                <div class="text-xs"><div class="ellipsis-multi-line" id="autoellipsis" style="height:70px;"><div> <p>{{{message}}}</p></div></div>
                    <div class="right m-t-n" data="{{message}}"><a href="#" id="tl-mail-popover"><i class="glyphicon glyphicon-plus-sign"></i></a></div>
                </div> 
            {{/if}}       
            
			</div>
        
        {{/if_entity}}

     {{#if_entity "guid"}}
            <div class="timestamp">{{created_time}}</div>
            <!-- <div class="title"><h3><span><a class="no-line"><i class="icon-list-alt"></i></a></span> Web</h3></div> -->
			<div class="text-md text-cap">	
				<div class="contact-job-title text-base custom-color">
					<i class="icon-list-alt text-muted p-r-xs"></i>Web
				</div>
			</div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                <div class="text-base ">
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
                     <div class="text-base "><b>Referred:</b></br> {{ref}}</div>
                {{/if}}

                {{#if city}}
                   <div class="text-base "><b>ADDRESS:</b></br> {{ucfirst city}}, {{ucfirst region}}, {{getCountryName country}}</div>
                {{/if}}

                <div class="right" style="margin-top:-10px;"><a href="#" id="tl-analytics-popover"><i class="glyphicon glyphicon-plus-sign"></i></a></div>
            </div>
     {{/if_entity}}

{{#if_entity "twilio"}}
            <div class="timestamp">{{created_time}}</div>
            <!-- <div class="title"><h3><span><a class="no-line"><i class="icon-phone" title="You Called"></i></a></span>{{title}}</h3></div> -->
			<div class="text-md text-cap">	
				<div class="contact-job-title text-base custom-color">
					<i class="icon-phone text-muted p-r-xs" title="You Called"></i>{{title}}
				</div>
			</div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                 <div class="text-xs ">{{name}}</div>
                <div class="text-xs ">{{body}}</div>
            </div>
        {{/if_entity}}

{{#if_entity "custom"}}
            <div class="timestamp">{{created_time}}</div>
            <!-- <div class="title"><h3><span><a class="no-line"><i class="icon-folder-open-alt" title="Email Opened"></i></a></span>{{title}}</h3></div> -->
			<div class="text-md text-cap">	
				<div class="contact-job-title text-base custom-color">
					<i class="icon-folder-open-alt text-muted p-r-xs" title="Email Opened"></i>{{title}}
				</div>
			</div>
            <div class="date">{{epochToTaskDate created_time}}</div>
            <div class="body">
                 <div class="text-xs ">{{name}}</div>
                <div class="text-xs ">{{body}}</div>
            </div>
        {{/if_entity}}
	<!-- <a href="#" class="open-close"></a> -->
  </div>
</div>
{{/each}}
</script><div class="modal fade in" id="timelineAnalyticsModal">
 <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3 class="modal-title">Page Views Analytics</h3>
    </div>
    <div class="modal-body">
        <div id="analytics-in-detail"></div>
    </div>
    </div>
    </div>
</div><script id="dashboard-timline-template" type="text/html">
test
<div id="my-timeline"></div>	
</script><div class="modal fade in" id="timelineLogModal">
 <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3 class="modal-title">Campaign Log Details</h3>
    </div>
    <div class="modal-body">
        <div id="log-in-detail"></div>
    </div>
    </div>
    </div>
</div><div class="modal fade" id="timelineMailModal">
 <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
        <button class="close" data-dismiss="modal">x</button>
        <h3 class="modal-title">Mail Details</h3>
    </div>
    <div class="modal-body">
        <div id="mail-in-detail"></div>
    </div>
    </div>
    </div>
</div>