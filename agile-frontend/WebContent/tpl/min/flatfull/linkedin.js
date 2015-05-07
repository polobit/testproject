<script id="linkedin-profile-template" type="text/html">
<div class="widget_content row-fluid">
	<div class="span3"><img src="{{picture}}" width="36" height="36" alt="" class="img-rounded pull-left"/></div>
	<div class="pull-left span9">
		<p class="title_txt" style="word-wrap:break-word;word-break:normal;">
			<a href="{{url}}" target="_blank" >{{name}}</a>
			<span class="badge badge-info pull-right">{{distance}}</span> 
		</p>
		<p>{{location}}</p>
	</div>
	<div class="clearfix"></div>	
	<p>{{show_link_in_statement summary}}</p>	
	{{#if is_connected}}
		<a href="#message" class="btn btn-sm btn-default pull-left" id="linkedin_message">Send Message</a>
	{{else}}
		<a href="#connect" class="btn btn-sm btn-default pull-left" id="linkedin_connect" name="{{name}}">Connect</a>
	{{/if}}
	<div class="pull-right" style="text-align: right;">
		<b style="color:#0088CC;">{{#if_equals num_connections "500"}}{{num_connections}}+{{else}}{{num_connections}}{{/if_equals}}</b>
		<div style="font-size: 11px;margin-top: -5px;">Connections</div>
	</div>
</div>
<div class="" id="linkedin-error-panel" style="display:none;">
</div>
<ul class="nav nav-tabs text-base" id="myTab">
	<li class="active" style="width:32%; margin-left: 2%; text-align: center;" align="center"><a data-toggle="tab" href="#experience" id="linkedin_experience"><h4>Work</h4><small></small></a></li>
	<li style="width:32%; text-align: center;" align="center"><a data-toggle="tab" href="#updates" id="linkedin_update_tab"><h4>Activity</h4><small></small></a></li>
	<li style="width:32%;text-align: center;" align="center"><a data-toggle="tab" href="#connections" id="linkedin_shared_connections"><h4>Shared</h4><small></small></a></li>
</ul>
<div class="tab-content" id="myTabContent">
	<div id="experience" class="tab-pane fade active in">
		<ul class="widget_tab_content text-base" id="linkedin_experience_panel">
						
		</ul>
	</div>
	<div id="updates" class="tab-pane fade">
		{{#if current_update}}
			<ul class="widget_tab_content linkedin_current_activity text-base" style="display:none">
				<li >	
					{{#is_link current_update}}
	        			<a href="{{url}}" target="_blank" >{{name}}</a> shared a link {{show_link_in_statement current_update}}
					{{else}}
						{{current_update}}
					{{/is_link}}
				</li>
			</ul>
		{{else}}
			<ul class="widget_tab_content linkedin_current_activity text-base" style="display:none">
				<li>	
					No updates available
				</li>
			</ul>
		{{/if}}
		<ul class="widget_tab_content collapse in text-base"  id="linkedin_social_stream">
					
		</ul>
		<div class="clearfix" id="status-error-panel" style="display:none;">
		</div>
		<div class="widget_tab_footer" align="center">
			<a href="#more" class="linkedin_stream" id="linkedin_stream" rel="tooltip" title="Click to see more updates">Show More</a>
			<a href="#less" data-toggle="collapse" data-target="#linkedin_social_stream" id="linkedin_less" style="display:none">Show Less..</a>
			<img src="img/ajax-spinner.gif" id="spinner-status" style="display:none;"></img>
			<a href="#refresh" id="linkedin_refresh_stream" class="icon-refresh pull-right" rel="tooltip" title="Refresh to get current updates" style="display:none"></a>
		</div>
	</div>
	<div id="connections" class="tab-pane fade">
		<ul class="widget_tab_content text-base" id="linkedin_shared_panel">
						
		</ul>
	</div>
	
</div>
</script>


<script id="linkedin-update-stream-template" type="text/html">

{{#if this.length}}	
		{{#each this}}	
			<li id="linkedin_status" update_time="{{created_time}}">	
				<div class="pull-left row-fluid">					
						{{#stringToJSON this "message"}} {{/stringToJSON}}													
						{{#if_equals type "SHARED_ITEM"}}
							{{#stringToJSON this.message "current-share"}} {{/stringToJSON}}
							{{#if message.current-share.content}}
								<div class="span2 mr_5"><a href="{{message.current-share.content.shortenedUrl}}" target="_blank"><img src="{{message.current-share.content.thumbnailUrl}}" width="30" height="30" alt="" class="img-rounded pull-left"/></a></div>
								<div class="pull-left span9" >
									<p class="mb_0" style="word-break:normal; word-wrap:break-word;">
										{{#if message.current-share.content.title}}
											{{#if message.current-share.comment}}									
												{{show_link_in_statement message.current-share.comment}}<br /><a target="_blank" href="{{message.current-share.content.shortenedUrl}}">{{message.current-share.content.title}}</a>									
											{{else}}									
												<a target="_blank" href="{{message.current-share.content.shortenedUrl}}">{{message.current-share.content.title}}</a>
											{{/if}}
										{{else}}
											{{message.current-share.author.firstName}} shared a link {{show_link_in_statement message.current-share.content.shortenedUrl}}
										{{/if}}
									</p>
									<small class="text-muted"><i class="fa fa-clock-o m-r-xs text-muted"></i><time class="time-ago" datetime="{{epochToHumanDate "" created_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time></small>
									<ul class="widget_tab_link text-base">										
										<li><a href="#share" rel="tooltip" title="Share activity in LinkedIn"><i class="linkedin_share icon-share" id="{{id}}"></i></a></li>
									</ul>
								</div>
							{{else}}
								<div class="span2 mr_5"><img src="widgets/linkedin-logo-small.png" width="30" height="30" alt="" class="img-rounded pull-left"/></div>
								<div class="pull-left span9" >
									<p class="mb_0" style="word-break:normal;word-wrap:break-word;">
										{{show_link_in_statement message.current-share.comment}}
									</p>
									<small class-"text-muted"><i class="fa fa-clock-o m-r-xs text-muted"></i><time class="time-ago" datetime="{{epochToHumanDate "" created_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time></small>
								</div>
							{{/if}}							
						{{/if_equals}}
						{{#if_equals type "CONNECTION_ADDED_CONNECTIONS"}}
							<div class="span2 mr_5" ><a href="{{message.publicProfileUrl}}" target="_blank"><img src="{{message.pictureUrl}}" width="30" height="30" alt="" class="img-rounded pull-left"/></a></div>
							<div class="pull-left span9" >
								<p class="mb_0" style="word-break:normal; word-wrap:break-word;">
									Connected to 
									<a href="{{message.publicProfileUrl}}" target="_blank">{{message.firstName}}&nbsp{{message.lastName}}</a>
									{{#if message.headline}}, {{message.headline}}{{/if}}
								</p>
								<small class="text-muted"><i class="fa fa-clock-o m-r-xs text-muted"></i><time class="time-ago" datetime="{{epochToHumanDate "" created_time}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" created_time}}</time></small>
							</div>
						{{/if_equals}}							
				</div>					
			</li>													
		{{/each}}
{{else}}
		<div class="row-fluid" style="padding: 7px 5px 0px 5px;line-height: 140%;color: #999999;">This person does not share his/her updates</div>
{{/if}}

</script>


<script id="linkedin-experience-template" type="text/html">
	{{#each this}}
		<li class="experience_li">
			<div class="row-fluid" >
				<div class="pull-left span9">
					<b>{{title}}</b><br>
					<h4>{{company.name}}</h4>
				</div>
				<div class="span3">
					{{#if company.logoUrl}}
						<img src="{{company.logoUrl}}" width="36" height="36" alt="" class="img-rounded pull-right"/>
					{{/if}}
				</div>
			</div>	
			{{#if summary}}	
				{{#if_overflow summary "36px"}}
					<div class="multiline_ellipsis summary-expand-{{id}}" id="summary-elip-{{id}}" style="word-break:normal;word-wrap:break-word;margin-top: 15px;height:36px;">				
						<p>{{show_link_in_statement summary}}</p>
					</div>
					<div id="summary-expand-{{id}}" class="collapse space_pre_line" style="word-break:normal;word-wrap:break-word;">				
						<p style="margin-bottom:-10px;">{{show_link_in_statement summary}}</p>
					</div>
				{{else}}
					<div style="word-break:normal;word-wrap:break-word;margin-top: 15px;">				
						<p>{{show_link_in_statement summary}}</p>
					</div>
				{{/if_overflow}}
			{{/if}}			
			<div style="margin-top:5px;">
			{{#if summary}}{{#if_overflow summary "36px"}}<a href="#summary-expand-{{id}}" class="right show-summary" id={{id}} hide="false" style="display:none">More</a>{{/if_overflow}}{{/if}}
			<small>
				{{#if startDate}}
					{{#if startDate.month}}{{startDate.month}}, {{/if}}
					{{#if startDate.year}}{{startDate.year}} - {{/if}}
				{{/if}}
				{{#if endDate}}
					{{#if endDate.month}}{{endDate.month}}, {{/if}}
					{{#if endDate.year}}{{endDate.year}}{{/if}}
				{{else}}
					{{#if isCurrent}}
						present
					{{/if}}
				{{/if}}
			</small>
			</div>
		</li>
	{{/each}}
</script>

<script id="linkedin-message-template" type="text/html">
	<!-- New (Note) Modal views -->
	<div class="modal fade message-modal" id="linkedin_messageModal" style="width:400px; left:55%">
	    <div class="modal-header">
	        <button class="close" data-dismiss="modal">x</button>
			{{#if_equals headline "Send Message"}}
	        	<h3><i class="icon-envelope"></i> {{headline}}</h3>
			{{else}}
				<h3><i class="icon-plus-sign"></i> {{headline}}</h3>
			{{/if_equals}}
	    </div>
	    <div class="modal-body agile-modal-body">
	        <form id="linkedin_messageForm" name="linkedin_messageForm" method="post">
	            <fieldset>
					<div style="margin-bottom:10px;">{{info}}</div>
	                <input name="linkedin_id" type="hidden" value="" />
	                <div class="control-group">	                    
	                    <div class="controls">
							{{#if_equals headline "Send Message"}}
								<label class="control-label"><b>Subject: </b><span class="field_req">*</span></label>	                        
								<input type="text" placeholder="About" name="subject" id="subject" class="required form-control span4" maxlength="150" onkeydown="if (event.keyCode == 13) { event.preventDefault(); }"/>
							{{else}}
								<select name="subject" class="required span4 form-control" >
									<option value="Indicated you as friend">Friend</option>
									<option value="Indicated you as colleague">Colleague</option>
									<option value="Indicated you as classmate">Classmate</option>
									<option value="Indicated you as other">Other</option>
								</select>
							{{/if_equals}}
	                    </div>
	                </div>
	                <div class="control-group">
	                    <label class="control-label"><b>Message: </b><span class="field_req">*</span></label>
	                    <div class="controls span4" style="margin-left:0px;">
							{{#if_equals headline "Connect"}}
	                        	<textarea rows="4" class="required span4 linkedin_connect_limit" name="message" id="link-connect" data-provide="limit" data-counter="#counter"  style="max-width:500px;" maxlength="275">{{description}}</textarea>
								<div class="right"><small style="font-style: italic;">Characters Left <em id="linkedin_counter" style="margin-right:5px;">275</em></small></div> 
							{{else}}
	                        	<textarea rows="4" class="required span4 linkedin_message_limit" name="message" id="link-message" style="max-width:500px;" maxlength="7000"></textarea>
							{{/if_equals}} 
	                    </div>
	                </div>
	            </fieldset>
	        </form>
	    </div>
	    <div class="modal-footer">
	        <a href="#" class="btn btn-sm btn-primary" id="send_linked_request">Send</a>
	    </div>
	</div>
</script>

<script id="linkedin-error-panel-template" type="text/html">
{{#if disable_check}}
	<div style="line-height:160%;word-wrap: break-word;padding:10px">
		{{{message}}}
	</div>
{{else}}
	{{#check_length message "140"}}
		<div class="ellipsis-multi-line collapse-25" title="{{message}}" style="height:110px;overflow: hidden;line-height:160%;word-wrap: break-word;padding:10px">
			{{{message}}}
		</div>
	{{else}}
		<div style="line-height:160%;word-wrap: break-word;padding:10px">
			<!-- Commented the code to show the LinkedIn discontinue message due to change in API.
				{{{message}}}
			-->
			We are forced to discontinue LinkedIn widget because of API restrictions from LinkedIn.
			You can read more on this from our 
			<a href="https://www.agilecrm.com/blog/linkedout-agile-crm-forced-to-discontinue-linkedin-intergation/">blog</a>.<br/>
			<a class="btn btn-sm btn-danger" id="delete-widget" widget-name="Linkedin" style="margin-top:5px;">Delete Widget</a>
		</div>
	{{/check_length}}	
{{/if}}
</script>

<script id="linkedin-shared-template" type="text/html">
<a href="{{url}}" target="_blank"><img  rel='popover' data-original-title='LinkedIn Profile' class='linkedinSharedImage thumbnail' id="{{id}}" src ="{{picture}}"
   style='width: 35px;height: 35px; display:inline-block; margin-right:2px; margin-bottom:2px; cursor:pointer;'
   data-content="
		<div class='row-fluid' style='padding-bottom:10px;'>
            <div class='span4' style='padding:0px 10px 0px 10px;'>
              <img style='width:55px;height:55px;' src='{{picture}}'></img>
            </div>
            <div class='span8'>
               <b style='color:#069;font-size:14px;'>{{name}}</b>
		       {{#if distance}}<span class='badge badge-info pull-right'>{{distance}}</span>{{/if}}
			   <p>
					{{#if location}}{{location}}{{/if}}<br/>
					{{#if num_connections}}{{num_connections}} Connections{{/if}}
			   </p>
            </div>		
		</div>
	  <div  class='row-fluid' style='padding-bottom:10px;word-wrap: break-word;'>
		 <p style='font-style: italic;'>{{summary}}</p>
	  </div>
"></img></a>
</script>
<!-- End of Modal views -->

<script id="linkedin-profile-add-template" type="text/html">
<div id="linkedin-image-save-modal" class="modal fade in" >
	<div class="modal-header" >
    	<a href="#" data-dismiss="modal" class="close">&times;</a>
		<h3>Add Profile</h3></div>
        <div class="modal-body" >
		<p>Associate LinkedIn profile to contact?</p>
        <p>
			{{#if image}}
			<label class="i-checks i-checks-sm">
				<input type="checkbox" name="add-image" id="save_linkedin_image"/><i></i></label>
				Add LinkedIn image to contact
			{{/if}}
		</p>
	</div>
	<div class="modal-footer" >
		<a href="#" class="btn btn-sm close save-linkedin-profile" resp="no">No</a>
		<a href="#" class="btn btn-sm btn-primary save-linkedin-profile" resp="yes">Yes</a>
	</div>
</div>
</script>

<script id="linkedin-modified-search-template" type="text/html">
	<div display:inline;  line-height:12px;word-wrap: break-word;">
		<form class="widget_content" style="border-bottom:none;" id="linkedin-search_form" name="linkedin-search_form" method="post">
	    	<fieldset>
				<p><label>Enter search details</label></p>
				<div class="control-group"><div class="controls">
					<input type="text" id="linkedin_keywords" class="input-medium required widget_input_box form-control" style="width:90%" placeholder="Key Words" value="{{keywords}}" name="keywords" onkeydown="if (event.keyCode == 13) { getModifiedLinkedinMatchingProfiles({{plugin_id}}); return false; }"  maxlength="40"></input>
				</div></div>
				<a href="#" id="linkedin_search_btn" class="btn btn-sm btn-default" style="text-decoration:none;">Search</a>
				<span><img src="img/ajax-spinner.gif" id="spinner-linked-search" style="display:none;"></img></span>
				<a href="#" id="linkedin_search_close" class="btn btn-sm btn-default close" style="float:none;margin-left:5px;">Close</a>
			 </fieldset>
	    </form>
	</div>
</script>

<script id="linkedin-login-template" type="text/html">
<div class='widget_content' style='border-bottom:none;line-height: 160%;' >
	Build professional relationships with contacts and keep a tab on their business interests.
	<p style='margin: 10px 0px 5px 0px;' >
		<a class='btn btn-sm btn-default' href="{{url}}" style='text-decoration: none;'>Link Your LinkedIn</a>
	</p>
</div>
</script>


<script id="linkedin-revoke-access-template" type="text/html">
<div class='widget_content' style='border-bottom:none;line-height: 160%;' >
	<div class="row-fluid">
		<div class="span4">
		{{#if profile.picture}}
			<img src="{{profile.picture}}" width="70" height="70" alt="" class="thumbnail"/>
		{{else}}
			<img src="{{defaultGravatarurl 70}}" width="70" height="70" alt="" class="thumbnail"/>
		{{/if}}
		</div>
		<div class="span7">
			<p class="title_txt"><a href="{{profile.url}}" target="_blank" >{{profile.name}}</a></p>
			<p style="margin:0px;">{{profile.location}}</p>
			<p style="word-wrap:break-word;word-break:normal;">{{show_link_in_statement profile.summary}}</p>
		</div>
	</div>
	<div>
		<p style='margin: 10px 0px 5px 0px;' >
			<a class='btn btn-sm btn-danger revoke-widget ml_5' style='text-decoration: none;' widget-name="Linkedin">Revoke Access</a>
			<a href="#add-widget" class='btn btn-default btn-sm ml_5' style='text-decoration: none;' widget-name="Linkedin">Cancel</a>
		</p>
	</div>
</div>
</script><script id="linkedin-search-result-template" type="text/html">
<div style="padding:10px" id="linkedin-search">
{{#if_equals this.keywords ""}}
<p class="a-dotted">Search results. <a href="#" class="linkedin_modify_search">Modify search</a></p>
{{else}}
<p class="a-dotted">Search results for <a href="#" class="linkedin_modify_search">{{this.keywords}}</a></p>
{{/if_equals}}
{{#each this.search_results}}
{{#if picture}}
<img  rel='popover' data-original-title='LinkedIn Profile' class='linkedinImage thumbnail' id="{{id}}" is_gravatar_pic="false" src ="{{picture}}" url="{{url}}"
   summary="{{summary}}" style='width: 35px;height: 35px; display:inline-block; margin-right:2px; margin-bottom:2px; cursor:pointer;'
   data-content="
       
 		<div class='row-fluid' style='padding-bottom:10px;'>
            <div class='span4' style='padding:0px 10px 0px 10px;'>
              <img style='width:55px;height:55px;' src='{{picture}}'></img>
            </div>
            <div class='span8'>
               <b style='color:#069;font-size:14px;'>{{name}}</b><span class='badge badge-info pull-right'>{{distance}}</span> 
			   <p>{{location}}<br/>{{#if_equals num_connections "500"}}{{num_connections}}+ connections{{else}}{{num_connections}} connections{{/if_equals}}</p>
            </div>		
      </div>
	  <div  class='row-fluid' style='padding-bottom:10px;word-wrap: break-word;'>
		 <p style='font-style: italic;'>{{summary}}</p>
	  </div>
"></img>
{{else}}
<img  rel='popover' data-original-title='LinkedIn Profile' class='linkedinImage thumbnail' id="{{id}}" is_gravatar_pic="true" src ="{{defaultGravatarurl 35}}" url="{{url}}"
   summary="{{summary}}" style='width: 35px;height: 35px; display:inline-block; margin-right:2px; margin-bottom:2px; cursor:pointer;'
   data-content="
       
 		<div class='row-fluid' style='padding-bottom:10px;'>
            <div class='span4' style='padding:0px 10px 0px 10px;'>
              <img style='width:55px;height:55px;' src ='{{defaultGravatarurl 35}}'></img>
            </div>
            <div class='span8'>
               <b style='color:#069;font-size:14px;'>{{name}}</b><span class='badge badge-info pull-right'>{{distance}}</span>
			   <p>{{location}}<br/>{{num_connections}} Connections</p>
            </div>		
      </div>
	  <div  class='row-fluid' style='padding-bottom:10px;word-wrap: break-word;'>
		 <p style='font-style: italic;'>{{summary}}</p>
	  </div>
"></img>
{{/if}}
{{/each}}
</div>
</script>  