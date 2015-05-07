<script id="settings-change-password-template" type="text/html">
<div class="panel panel-default">
	<div class="panel-heading"><h4 class="h4">Change Password</h4></div>
	<div class="panel-body">
    	<form id="changePasswordForm" class="form-horizontal">
        	<fieldset>
            	
            	
                    <div class="control-group form-group">
                        <label class="control-label col-md-3 col-sm-4">Current Password <span class="field_req">*</span></label>
                        <div class="controls col-md-4  col-sm-6">
                            <input name="current_pswd" id="current_pswd" type="password" class="required form-control" autocapitalize="off" minlength="4" maxlength="20" placeholder="Enter Current Password"/>
                        </div>
                    </div>
                    <div class="control-group form-group">
                        <label class="control-label col-md-3 col-sm-4">New Password <span class="field_req">*</span></label> 
                        <div class="controls col-md-4  col-sm-6">
                            <input name="new_pswd" id="new_pswd" type="password" class="required form-control" autocapitalize="off" maxlength="20" minlength="4" placeholder="Enter New Password" />
                        </div>
                    </div>
                    <div class="control-group form-group">
                        <label class="control-label col-md-3 col-sm-4">Confirm New Password <span class="field_req">*</span></label> 
                        <div class="controls col-md-4  col-sm-6">
                            <input name="confirm_pswd" type="password" class="required form-control" autocapitalize="off" maxlength="20" minlength="4" equalto="#new_pswd" placeholder="Confirm New Password" />
                        </div>
                    </div>
               
                
<div class="line  b-b line-lg"></div>
            	<div class="form-group">
<div class="col-md-offset-3 col-sm-offset-4 col-sm-8">
               		<a href="#user-prefs" class="btn btn-default btn-sm">Cancel</a>
					<a href="#" type="submit" id="saveNewPassword" class="save btn btn-sm btn-primary">Change Password</a>
					<span class="save-status"></span>
            	</div>
</div>
        	</fieldset>
    	</form>
	</div>
</div>

</script><script id="settings-email-prefs-template" type="text/html">
<div class="row">
	<div class="col-md-12">
<div class="row">
        <div id="social-prefs" class="col-md-4 col-sm-6 col-xs-12"></div>
		<div id="imap-prefs" class="col-md-4 col-sm-6 col-xs-12"></div>
		<div id="office-prefs" class="col-md-4 col-sm-6 col-xs-12"></div>
    </div>
</div>
</div>
</script>

<script id="settings-imap-access-template" type="text/html">
<div>
	<div class="panel wrapper" >
		<center>
			<img class="thumbnail m-b-none thumb-transparent img-responsive thumb-xl" src="/img/email-prefs/imap.jpg"/>
		</center>
		<br />
    	<div class="ellipsis-multiline m-b-md" rel="tooltip" title="Just link your IMAP account and Agile will show emails below a contact from your Inbox.">
			Just link your IMAP account and Agile will show emails below a contact from your Inbox and Sent folders.
		</div>
		<div>
			{{#if id}}
				<a class="btn btn-sm btn-danger" href="#" id="imap-prefs-delete" name="imap">Disable</a>
				<a class="btn btn-sm btn-default" href="#imap">Settings</a>
			{{else}}
				<a class="btn btn-sm btn-default" href="#imap">Enable</a>
			{{/if}}
		</div>
	</div>
</div>
</script>

<script id="settings-office-access-template" type="text/html">
<div>
	<div class="panel wrapper" >
		<center>
			<img class="thumbnail m-b-none thumb-transparent img-responsive thumb-xl" src="/img/email-prefs/office365.jpg"/>
		</center>
		<br />
    	<div class="ellipsis-multiline m-b-md"  rel="tooltip" title="See all emails related to a contact from your Office365 account.">
			See all emails related to a contact from your Office365 account.
		</div>
		<div>
			{{#if id}}
				<a class="btn btn-sm btn-danger" href="#" id="office-prefs-delete" name="office">Disable</a>
				<a class="btn btn-sm btn-default" href="#office">Settings</a>
			{{else}}
				<a class="btn btn-sm btn-default" href="#office">Enable</a>
			{{/if}}
		</div>
	</div>
</div>
</script> <script id="settings-email-template-add-template" type="text/html">
<div class="panel panel-default">
	<div class="panel-heading">
	<h4 class="h4">
	{{#if id}}
      Edit Email Template
    {{else}}
       New Email Template
   	{{/if}}
	</h4>
	</div>
	<div class="panel-body">



	
	    <form id="templatePrefs" class="form-horizontal">
         <fieldset>
			{{#if id}}
               <input name="id" type="hidden" value="{{id}}" />
              
            {{else}}
             
   			{{/if}}
      <!--   <ul class="nav right">
                <li class="dropdown" id="menu2">
                    <a href="#merge-fields-add" class="dropdown-toggle btn btn-sm btn-default right" data-toggle="dropdown" style="position:relative;">
                    <span><i class="icon-plus-sign" /></span> Add Merge Field</a>
                    <ul class="dropdown-menu pull-right" style="top:28px">
                    <li><a href="#" name="first_name" class="merge-field">&nbsp;First Name</a></li>
					<li><a href="#" name="last_name" class="merge-field">&nbsp;Last Name</a></li>
					<li><a href="#" name="email" class="merge-field">&nbsp;Email</a></li>
					<li><a href="#" name="company" class="merge-field">&nbsp;Company</a></li>
                    </ul>
                </li>
            </ul> -->
        <div class="control-group form-group ">
	    <label class="control-label col-sm-2">Name <span class="field_req">*</span></label>
	        <div class="controls col-sm-5">
	        	<input type="text" class="required input-xlarge form-control" name="name" placeholder="Enter Name"/>
            </div>
	    </div>
        <div class="control-group form-group">
	    <label class="control-label col-sm-2">Subject <span class="field_req">*</span></label>
	        <div class="controls col-sm-5">
	        	<input type="text" class="required input-xlarge form-control" name="subject" placeholder="Enter Subject"/>
            </div>
	    </div>
	    <div class="control-group form-group">
	    <label class="control-label col-sm-2">Text <span class="field_req">*</span></label>
	        <div class="controls col-sm-9">
			<div id="loading-editor"></div>
	        <textarea class="col-md-6 required" style="width: 75%; height: 45%; display: none;" name="text" id="email-template-html" placeholder="Email template html"></textarea>
	        </div>
	    </div>
<hr>
<div class="row">
	    
<div class="col-sm-offset-2 col-sm-9">
			<a href="#email-templates" class="btn btn-default btn-sm">Cancel</a>
            <a href="#" type="submit" class="save btn btn-sm btn-primary">{{#if id}}Save Changes {{else}}Save {{/if}}</a> 
		</div>

         </fieldset>
		</form>
    


</div>
</div>
</script><script id="settings-email-templates-collection-template" type="text/html">
    <div class="col">
	<div class="hbox h-auto m-b-lg">
    <div class="panel panel-default">
        <div class="panel-heading">
            <div class="pull-left m-t-xs">Email Templates</div>
			<div class="pull-right">
            	<a href="#email-template-add" class="btn btn-default btn-sm btn-addon" id="addEmailTemplate">
           		 <span><i class="icon-plus-sign" /></span> New</a>
			</div>
			<div class="clearfix"></div>
        </div>
   
	<div id="slate"></div>
	{{#if this.length}}
    <div class="table-responsive">
        <table class="table table-bordered table-striped showCheckboxes panel agile-table" url="core/api/email/templates/bulk" >
           
            <thead>
                <tr>
                    <th class="hide">Id</th>                    
					<th style="width:30%;">Name</th>
                    <th style="width:30%;">Subject</th>
                    <th style="width:40%;"></th>
                </tr>
            </thead>
            <tbody id="settings-email-templates-model-list" route="email-template/">
            </tbody>
        </table>
     </div>
	{{/if}}
	
    </div>
</div>
</div>
    <div class="col w-md">
        <div class="data-block">
        <div class="p-l p-r">
            <h4 class="m-t-none">
                Email Templates
            </h4>
            
            <p>
                Personalize and customize email templates for every scenario in the sales cycle. Make sure you send a great looking email every single time.
            </p>
            <p>
                You can create custom email template for every sales scenario.
            </p>
           </div>
        </div>
    </div>

</script>

 <script id="settings-email-templates-model-template" type="text/html">
    <td class='data hide' data='{{id}}'>{{id}}</td>
    <td>
		<div class="table-resp">
    		{{name}}
    	</div>
    </td>
    <td>
    	<div class="table-resp">
    		{{subject}}
    	</div>
    </td>   
    <td class="text-muted" style="color: #b2b0b1;">
       {{#if created_time}}
          <div class="text-muted table-resp text-xs"> <i class="fa fa-clock-o m-r-xs"></i>
    	       Created <time class="created_time time-ago" value="{{created_time}}" datetime="{{epochToHumanDate "" created_time}}">{{epochToHumanDate "ddd mmm dd yyyy" created_time}}</time> by {{emailTemplateOwner.name}}
          </div>
       {{/if}}
    </td>
</script><script id="settings-gmail-prefs-share-template" type="text/html">
{{#if id}}
<div class="row">
<div class="col-md-4 col-sm-6 col-xs-12 ">
<div class="panel panel-default">
	<div class="panel-heading font-bold"><h4 class="h4">Gmail</h4></div>
    <div class="panel-body">
    <form id="gmail-prefs-share-form">
        
        <fieldset>
            <!-- {{#if id}}
			{{add_tag "Email"}}
            <input name="id" type="hidden" value="{{id}}" /> 
            {{/if}} -->
            <div>
				{{#if picture}} 
					<i class="media-grid thumb thumb-wrapper"> 
						{{#if_equals picture "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg"}}
							<img  src="{{emailGravatarurl 75 email}}"  /> 
						{{else}} 
							<img  src="{{picture}}" /> 
						{{/if_equals}}
					</i>
				{{else}} 
					<i class="media-grid"> <img class="thumbnail m-b-none thumb" src="{{emailGravatarurl 50 email}}" /> </i>
			   	{{/if}}
			   	<label>{{name}}</label>
			</div>
            <div class="control-group form-group m-t">
	            <div class="controls">
	                <a href="#" class="gmail-share-settings-select"><i class='icon-plus-sign'/></i> Sharing settings</a>
	                <span class ="gmail-share-settings-txt" style="vertical-align:text-top;margin-left:-3px">         
       				 <img border="0" src="/img/help.png" style="height:6px;vertical-align:top;" rel="popover" data-placement="right" data-content="You can share this email integration with other users. This allows them to see emails you have exchanged with a Contact. The shared users will see your email account in the Mail tab when they open a Contact." id="element-title" data-trigger="hover" data-original-title="Email Account Sharing">
        			</span>
				    <span class="gmail-share-select" style="display:none;">
				   	<a href="#" class="gmail-share-settings-cancel" name = "gmail" style="margin-bottom:20px"><i class='icon-minus-sign'/></i> Sharing settings</a>
				   	<span style="vertical-align:text-top;margin-left:-3px">         
       				 <img border="0" src="/img/help.png" style="height:6px;vertical-align:top;" rel="popover" data-placement="right" data-content="You can share this email integration with other users. This allows them to see emails you have exchanged with a Contact. The shared users will see your email account in the Mail tab when they open a Contact." id="element-title" data-trigger="hover" data-original-title="Email Account Sharing">
        			</span>
				   	<label class="control-label m-t-sm">Select users to share with</label>
					<select name="shared_with_users_ids" multiple id="gmail-share-user-select" class = "multi-select form-control w-full" style="margin-bottom: 5px; overflow: auto">
					</select>
	             	<span class="gmail-share-status"></span>
					</span>
			   </div>
			</div>
            
            <div class="form-actions"> 
				<a href="#email" class="btn btn-default btn-sm">Cancel</a>
                <a href="#" class="save btn btn-sm btn-primary">Save </a>
            </div>
        </fieldset>
        
    </form>
</div>
</div>
</div>
</div>
    {{/if}}

</script><script id="import-google-calendar-template" type="text/html">
	<div class="panel wrapper widget-add" >
    <center>
    <img class="thumbnail m-b-none thumb-xl bg-transparent" src="/img/icons/google-calendar-sync.png" />
    </center>
   <div class="line-clamp-6 m-t">
{{#if id}}
	You have successfully associated your Google Calendar with Agile. Your events will be popped up automatically in the <a href="#calendar">calendar</a>.
{{else}}
		By enabling access to your Google Calendar, we'll automatically sync your events in your Google Calendar with Agile <a href="#calendar">calendar</a>.
{{/if}}
<br/>
<div>You can also <a href="#icalModal" data-toggle="modal" id="subscribe-ical" >setup Agile calendar inside Google</a></div> 

	</div>
    <div class="m-t-md">
			{{#if id}}
    			<a class="btn btn-sm btn-danger" id="sync-google-calendar-delete">Disable</a>
    		{{else}}
    				<a class="btn btn-sm btn-default" id="sync-google-calendar">Enable</a>
    		{{/if}}
	</div>
</div>
</script>


<script id="import-google-calendar-setup-template" type="text/html">
	<div class="well">
 	<!-- <legend>Contacts <span class="label label-important">Beta</span>{{#if id}}<span class="text-base" style="float:right" title="Sync Contacts" title="Sync Contacts"><a class="icon-refresh save-contact-prefs c-p text-l-none" href="#" sync = "true" id="google-import-sync"></a></span>{{/if}}</legend> -->
   <center> <img class="thumbnail m-b-none img-responsive thumb-xl bg-transparent" src="/img/icons/google-calendar-sync.png"  /></center>
	<br />
    <div class="m-b-md">
		{{#if id}}
			<p class="p-t-xs">By enabling access to your Google Calendar, we'll automatically sync your events in your Google Calendar with Agile.</p>
			{{else}}
			<p class="p-t-xs">You have successfully associated your Google Calendar with Agile. Your events will be popped up automatically in the calendar.</p>
				
		{{/if}}
	</div>
sdfsdfsdfsfdf
<hr/>
<div align="center">
	{{#if id}}
			<a class="btn btn-sm btn-danger" href="#sync">Close</a>
		{{else}}		
			<a class="btn btn-sm btn-primary" id="sync-google-calendar">Enable</a>
		</div>
	{{/if}}
</div>
</div>
</div>
</script><script id="settings-imap-prefs-template" type="text/html">
<div class="row">
<div class="col-md-4 col-sm-6">
<div class="panel panel-default">
<div class="panel-heading font-bold"><h4 class="h4">IMAP</h4></div>
    <div class="panel-body">
    <form id="imap-prefs-form">
        
        <fieldset>
            {{#if id}}
			{{add_tag "Email"}}
            <input name="id" type="hidden" value="{{id}}" /> 
            {{/if}}
            <!--<div class="control-group form-group">
                <label class="control-label">Email <span class="field_req">*</span></label>
                <div class="controls">
                    <input name="email" type="text" class="email required form-control" placeholder="Email" value="{{email}}" autocapitalize="off" />
                </div>
            </div>-->
            <div class="control-group form-group">
                <label class="control-label">Server (Host) <span class="field_req">*</span></label>
                <div class="controls">
                    <input name="server_name" type="text" class="required form-control" placeholder="Server Name" value="{{server_name}}" autocapitalize="off" />
                </div>
            </div>
            <div class="control-group form-group">
                <label class="control-label">User Name <span class="field_req">*</span></label>
                <div class="controls">
                    <input name="user_name" type="text" class="required form-control" placeholder="User Name" value="{{user_name}}" autocapitalize="off" />
                </div>
            </div>
            <div class="control-group form-group">
                <label class="control-label">Password <span class="field_req">*</span></label>
                <div class="controls">
                    <input name="password" id="imap-password" type="password" class="required form-control" placeholder="Password" autocapitalize="off" />
                </div>
            </div>
            <div class="control-group form-group">
                <div class="controls">
                    <div class="checkbox">
<label class="i-checks i-checks-sm">
                    <input name="is_secure" type="checkbox" value="{{is_secure}}" checked/><i></i>
                    Use SSL (Secure communication)
                    </label>
</div>
                </div>
            </div>
             <div class="control-group form-group m-t-md">
	            <div class="controls">
	                <a href="#" class="imap-share-settings-select"><i class='icon-plus-sign'/></i> Sharing settings</a>
	                <span class ="imap-share-settings-txt" style="vertical-align:text-top;margin-left:-3px">         
       				 <img border="0" src="/img/help.png" style="height:6px;vertical-align:top;" rel="popover" data-placement="right" data-content="You can share this email integration with other users. This allows them to see emails you have exchanged with a Contact. The shared users will see your email account in the Mail tab when they open a Contact." id="element-title" data-trigger="hover" data-original-title="Email Account Sharing">
        			</span>
				    <span class="imap-share-select" style="display:none;">
				   	<a href="#" class="imap-share-settings-cancel" name = "imap" style="margin-bottom:20px"><i class='icon-minus-sign'/></i> Sharing settings</a>
				   	<span style="vertical-align:text-top;margin-left:-3px">         
       				 <img border="0" src="/img/help.png" style="height:6px;vertical-align:top;" rel="popover" data-placement="right" data-content="You can share this email integration with other users. This allows them to see emails you have exchanged with a Contact. The shared users will see your email account in the Mail tab when they open a Contact." id="element-title" data-trigger="hover" data-original-title="Email Account Sharing">
        			</span>
				   	<label class="control-label" style="margin-top:10px">Select users to share with</label>
					<select name="shared_with_users_ids" multiple id="imap-share-user-select" class = "multi-select  form-control" style="margin-bottom: 5px; overflow: auto">
					</select>
	             	<span class="imap-share-status"></span>
					</span>
			     </div>
			  </div>
			   {{#if id}}
			   <div id="imap-folders" class="control-group form-group m-t-sm">
	            <div class="controls">
	                <a href="#" class="imap-folders-settings-click"><i class='icon-plus-sign'/></i> Email folders</a>
				    <span class="imap-folders-select" style="display:none;">
				   	<a href="#" class="imap-folders-settings-cancel m-b-md" name = "imap"><i class='icon-minus-sign'/></i> Email folders</a>
				   	<label class="control-label m-t-sm">Select a maximum of 3 folders</label>
					<select name="folders" multiple id="imap-folders-multi-select" class = "multi-select form-control" limit = "3" style="margin-bottom: 5px; overflow: auto">
					</select>
	             	<span class="imap-folders-settings-status"></span>
					</span>
			   </div>
			</div>
			{{/if}}
            <div class="form-group m-t-sm"> 
				<a href="#email" class="btn btn-default btn-sm">Cancel</a>
                <button type="submit" class="save btn btn-sm btn-primary">Save </button>
            </div>
        </fieldset>
    </form>
</div>
</div>
</div>
</div>
</script><script id="settings-notification-prefs-template" type="text/html">
    <div class="col">
	<div class="hbox h-auto m-b-lg">
        <div class="panel panel-default">
       
            <form id="notificationsForm" name="notificationsForm" class="form-horizontal">
                <fieldset>
                <div class="panel-heading">
					<span class="pull-left m-r-sm m-t-xs text-head-black">Notifications</span>
					<div class="pull-left">                                          
                        <div id="notification-switch">
							<label class="i-switch m-t-xs m-r">
                          		{{#if control_notifications}}
                          			<input type="checkbox" id="control_notifications" class="left"  name="control_notifications" checked="checked">
                         	 	{{else}}
                          				<input type="checkbox" id="control_notifications" class="left"  name="control_notifications">
                         		 {{/if}}
						  		 <i></i>
							</label>
                        </div>                                           
                    {{#if control_notifications}}
                    </div>
                    <div class="pull-right">
                    <span id="desktop-notification-content" class="right text-base"></span>
                    <a href="#notification-prefs" class="btn pull-right btn-sm btn-default btn-addon" id="set-desktop-notification"><i class="icon-bullhorn"></i> Set Desktop Notifications</a>
                    {{/if}}
                    <input name="id" type="hidden" value="{{id}}" /> 
                    </div>
                    <div class="clearfix"></div>
                    </div>
                    <div class="panel-body">
                  {{#if control_notifications}}
                  
                    <div class="control-group form-group">
                        <label class="control-label col-sm-3">Browsing</label>
                        <div class="controls col-sm-8">
                            <select id="browsing" name="browsing" class="form-control">
                                <option value="ANY_CONTACT">Any Contact</option>
                                <option value="CONTACT_ASSIGNED">Contact assigned to me</option>
                                <option value="CONTACT_ASSIGNED_AND_STARRED">Contact assigned to me & starred</option>
                            </select>
<p class="help-block m-b-none">Get notified when a contact is browsing your website.</p>
                        </div>
                        
                    </div>
                   
                    
                    <div class="control-group form-group">
                        <label class="control-label col-sm-3">Email Opened</label>
                        <div class="controls col-sm-8">
                            <select id="email-opened" name="email_opened" class="form-control">
                                <option value="ANY_CONTACT">Any Contact</option>
                                <option value="CONTACT_ASSIGNED">Contact assigned to me</option>
                                <option value="CONTACT_ASSIGNED_AND_STARRED">Contact assigned to me & starred</option>
                            </select>
 <p class="help-block m-b-none">Get notified when a contact opens the email sent.</p>
                        </div>
                       
                    </div>
                   
                  
                    <div class="control-group form-group">
                        <label class="control-label col-sm-3">Link Clicked</label>
                        <div class="controls col-sm-8">
                            <select id="link-clicked" name="link_clicked" class="form-control">
                                <option value="ANY_CONTACT">Any Contact</option>
                                <option value="CONTACT_ASSIGNED">Contact assigned to me</option>
                                <option value="CONTACT_ASSIGNED_AND_STARRED">Contact assigned to me & starred</option>
                            </select>
<p class="help-block m-b-none">Get notified when a contact clicks a link in email (via a campaign).</p>
                        </div>
                        
                    </div>
                    <div class="control-group form-group">
                        <label class="control-label col-sm-3">Deal</label>
                        <div class="controls col-sm-8">
                            <div class="checkbox">
<label class="i-checks i-checks-sm">
                            <input type="checkbox" id="deal_created" name="deal_created" value="true" /><i></i> 
                            Deal is created
                            </label>
</div>
                            <div class="checkbox">
<label class="i-checks i-checks-sm">
                            <input type="checkbox" id="deal_closed" name="deal_closed" value="true" /><i></i> 
                            Deal is closed
                            </label>
</div>
                        </div>
                    </div>
                    <div class="control-group form-group">
                        <label class="control-label col-sm-3">Tag</label>
                        <div class="controls col-sm-8">
                            <div class="checkbox"><label class="i-checks i-checks-sm">
                            <input type="checkbox" id="tag_added" name="tag_added" value="true" /><i></i> 
                            Tag is created
                            </label>
</div>
                            <div class="checkbox"><label class="i-checks i-checks-sm">
                            <input type="checkbox" id="tag_deleted" name="tag_deleted" value="true" /><i></i> 
                            Tag is deleted
                            </label>
</div>
                        </div>
                    </div>
                    <div class="control-group form-group">
                        <label class="control-label col-sm-3">Contact</label>
                        <div class="controls col-sm-8">
                            <div class="checkbox"><label class="i-checks i-checks-sm">
                            <input type="checkbox" id="contact_added" name="contact_added" value="true" /><i></i> 
                            Contact is created
                            </label>
</div>
                            <div class="checkbox"><label class="i-checks i-checks-sm">
                            <input type="checkbox" id="contact_deleted" name="contact_deleted" value="true" /><i></i> 
                            Contact is deleted
                            </label>
</div>
                        </div>
                    </div>
                    <div class="control-group form-group">
                        <label class="control-label col-sm-3">Call</label>
                        <div class="controls col-sm-8">
                            <div class="checkbox"><label class="i-checks i-checks-sm">
                            <input type="checkbox" id="call" name="call" value="true"/><i></i> 
                            Incoming call
                            </label>
</div>
                        </div>
                    </div>

                   {{else}}

                    <div class="control-group form-group">
                        <label class="control-label col-sm-3">Browsing</label>
                        <div class="controls col-sm-8">
                            <select id="browsing" name="browsing" disabled="disabled" class="form-control">
                                <option value="ANY_CONTACT">Any Contact</option>
                                <option value="CONTACT_ASSIGNED">Contact assigned to me</option>
                                <option value="CONTACT_ASSIGNED_AND_STARRED">Contact assigned to me & starred</option>
                            </select>
<p class="help-block m-b-none">Get notified when a contact is browsing your website.</p>
                        </div>
                        
                    </div>
                    <div class="control-group form-group">
                        <label class="control-label col-sm-3">Email Opened</label>
                        <div class="controls col-sm-8">
                            <select id="email-opened" name="email_opened" disabled="disabled" class="form-control">
                                <option value="ANY_CONTACT">Any Contact</option>
                                <option value="CONTACT_ASSIGNED">Contact assigned to me</option>
                                <option value="CONTACT_ASSIGNED_AND_STARRED">Contact assigned to me & starred</option>
                            </select>
<p class="help-block m-b-none">Get notified when a contact opens the email sent.</p>
                        </div>
                    
                    </div>
                    <div class="control-group form-group">
                        <label class="control-label col-sm-3">Link Clicked</label>
                        <div class="controls col-sm-8">
                            <select id="link-clicked" name="link_clicked" disabled="disabled" class="form-control">
                                <option value="ANY_CONTACT">Any Contact</option>
                                <option value="CONTACT_ASSIGNED">Contact assigned to me</option>
                                <option value="CONTACT_ASSIGNED_AND_STARRED">Contact assigned to me & starred</option>
                            </select>
<p class="help-block m-b-none">Get notified when a contact clicks a link in email (via a campaign).</p>
                        </div>
                        
                    </div>
                    <div class="control-group form-group">
                        <label class="control-label col-sm-3">Deal</label>
                        <div class="controls col-sm-8">
                            <div class="checkbox"><label class="i-checks i-checks-sm">
                            <input type="checkbox" id="deal_created" name="deal_created" value="true" disabled="disabled"/><i></i> 
                            Deal is created
                            </label>
</div>
                            <div class="checkbox"><label class="i-checks i-checks-sm">
                            <input type="checkbox" id="deal_closed" name="deal_closed" value="true" disabled="disabled"/><i></i> 
                            Deal is closed
                            </label>
</div>
                        </div>
                    </div>
                    <div class="control-group form-group">
                        <label class="control-label col-sm-3">Tag</label>
                        <div class="controls col-sm-8">
                            <div class="checkbox"><label class="i-checks i-checks-sm">
                            <input type="checkbox" id="tag_added" name="tag_added" value="true" disabled="disabled"/><i></i> 
                            Tag is created
                            </label>
</div>
                            <div class="checkbox"><label class="i-checks i-checks-sm">
                            <input type="checkbox" id="tag_deleted" name="tag_deleted" value="true" disabled="disabled"/><i></i> 
                            Tag is deleted
                            </label>
</div>
                        </div>
                    </div>
                    <div class="control-group form-group">
                        <label class="control-label col-sm-3">Contact</label>
                        <div class="controls col-sm-8">
                            <div class="checkbox"><label class="i-checks i-checks-sm">
                            <input type="checkbox" id="contact_added" name="contact_added" value="true" disabled="disabled"/><i></i> 
                            Contact is created
                            </label>
</div>
                            <div class="checkbox"><label class="i-checks i-checks-sm">
                            <input type="checkbox" id="contact_deleted" name="contact_deleted" value="true" disabled="disabled"/><i></i> 
                            Contact is deleted
                            </label>
</div>
                        </div>
                    </div>
                    <div class="control-group form-group">
                        <label class="control-label col-sm-3">Call</label>
                        <div class="controls col-sm-8">
                            <div class="checkbox"><label class="i-checks i-checks-sm">
                            <input type="checkbox" id="call" name="call" value="true" disabled="disabled"/><i></i> 
                            Incoming call
                            </label>
</div>
                        </div>
                    </div>
                    {{/if}}
                    <div class="control-group form-group">
                        <label class="control-label col-sm-3">Notification Sounds</label>
                        <div class="controls col-sm-8" >
                                    <select id="notification_sound" name="notification_sound" class="form-control inline-block" style="width:75%;">
                                        <option value="alert_1">Notes</option>
                                        <option value="alert_2">Twinkle</option>
                                        <option value="alert_3">Bubble</option>
                                        <option value="alert_4">Triple Tone</option>
                                        <option value="alert_5">Chime</option>
                                        <option value="no_sound">Silent</option>
                                    </select>
                        <button class="btn btn-default  m-l-sm inline-block" id="notification-sound-play"><i class="icon-play"></i></button>
                        </div>
                    </div>
<div class="line line-lg b-b"></div>
                  <div class="row">
                    <div class="col-sm-offset-3 col-sm-8">                      
                        <button type="submit" class="save btn btn-sm btn-primary">Save Changes</button>
                        <!--<a href="#settings" class="btn btn-sm btn-default">Cancel</a>-->
                    </div>
                    </div>
                    </div>
                </fieldset>
            </form>
        </div>
		</div>
    </div>
    
	<div class="col w-md">
       <div class="data-block b-l">
		<div class="p-l p-r">
			<h4 class="m-t-none">What are Notifications?</h4>
            <p>Notifications are pop-up alerts shown to you as soon as an event occurs. </p>
            <p>These events can be a contact opening an email you sent, or browsing your website, or a new deal or tag being created in your crm.</p>
	        <br/>

            <h4 class="m-t-none">Notification pop-up</h4>
            <p>Normal Notification</p>
            <div><img src="img/sample-notification.png"/ class="img-responsive"></div><br/>
            <p>Desktop Notification</p>
            <div><img src="img/sample-html-notification.png"/ class="img-responsive"></div>
            <br/>
            <p><em style="font-size:12px;">Please note that all browsers do not support desktop notifications.</em></p>    
	</div>  
</div>		
	</div>

</script><script id="settings-office-prefs-template" type="text/html">
<div class="row">
<div class="col-md-4 col-sm-6">
<div class="panel panel-default">
<div class="panel-heading font-bold"><h4 class="h4">Office 365</h4></div>
    <div class="panel-body">
    <form id="office-prefs-form">
        
        <fieldset>
            {{#if id}}
			{{add_tag "Email"}}
            <input name="id" type="hidden" value="{{id}}" /> 
            {{/if}}
            <div class="control-group form-group">
                <label class="control-label">Server (Host) <span class="field_req">*</span>
					<span style="vertical-align:text-top;margin-left:-3px">         
       				 <img border="0" src="/img/help.png" style="height:6px;vertical-align:top;" rel="popover" data-placement="right" data-content="In your Office365 web interface, click the Gear icon on the top right corner and select 'Options'.  Select the 'Account' tab from the right pane.  Scroll down the page and go to 'Settings for POP or IMAP access'. Under the IMAP category, copy the server name given and paste it here below." id="element-title" data-trigger="hover" data-original-title="How do I get this?">
        			</span>
				</label>
                <div class="controls">
                    <input name="server_url" type="text" class="required form-control" placeholder="Server URL" value="{{server_url}}" autocapitalize="off" />
                </div>
            </div>
            <div class="control-group form-group">
                <label class="control-label">User Name <span class="field_req">*</span></label>
                <div class="controls">
                    <input name="user_name" type="text" class="required form-control" placeholder="User Name" value="{{user_name}}" autocapitalize="off" />
                </div>
            </div>
            <div class="control-group form-group">
                <label class="control-label">Password <span class="field_req">*</span></label>
                <div class="controls">
                    <input name="password" id="office-password" type="password" class="required form-control" placeholder="Password" autocapitalize="off" />
                </div>
            </div>
            <div class="control-group form-group">
                <div class="controls">
                    <div class="checkbox">
<label class="i-checks i-checks-sm">
                    <input name="is_secure" type="checkbox" value="{{is_secure}}" checked/><i></i>
                    Use SSL (Secure communication)
                    </label>
</div>
                </div>
            </div>
            <div class="control-group form-group m-t-sm" >
	            <div class="controls">
	                <a href="#" class="office-share-settings-select"><i class='icon-plus-sign'/></i> Sharing settings</a>
	                <span class ="office-share-settings-txt" style="vertical-align:text-top;margin-left:-3px">         
       				 <img border="0" src="/img/help.png" style="height:6px;vertical-align:top;" rel="popover" data-placement="right" data-content="You can share this email integration with other users. This allows them to see emails you have exchanged with a Contact. The shared users will see your email account in the Mail tab when they open a Contact." id="element-title" data-trigger="hover" data-original-title="Email Account Sharing">
        			</span>
				    <span class="office-share-select" style="display:none;">
				   	<a href="#" class="office-share-settings-cancel" style="margin-bottom:20px"><i class='icon-minus-sign'/></i> Sharing settings</a>
				   	<span style="vertical-align:text-top;margin-left:-3px">         
       				 <img border="0" src="/img/help.png" style="height:6px;vertical-align:top;" rel="popover" data-placement="right" data-content="You can share this email integration with other users. This allows them to see emails you have exchanged with a Contact. The shared users will see your email account in the Mail tab when they open a Contact." id="element-title" data-trigger="hover" data-original-title="Email Account Sharing">
        			</span>
                    <div class="clearfix"></div>
				   	<label class="control-label" style="margin-top:10px">Select users to share with</label>
					<select name="shared_with_users_ids" multiple id="office-share-user-select" class = "multi-select form-control" style="margin-bottom: 5px; overflow: auto">
					</select>
	             	<span class="office-share-status"></span>
					</span>
			    </div>
			</div>
            <div class="form-group"> 
				<a href="#email" class="btn btn-default btn-sm">Cancel</a>
                <button type="submit" class="save btn btn-sm btn-primary">Save </button>
            </div>
        </fieldset>
    </form>
</div>
</div>
</div>
</div>
</script><!-- online scheduling Modal views -->
<script id="settings-business-prefs-template" type="text/html">
	<div class="col" id="schedule-preferences">
<div class="hbox h-auto m-b-lg">
<div class="panel panel-default">
<div class="panel-heading">Online Calendar</div>
    	
<div class="panel-body">
<form id="scheduleid" name="scheduleid" method="post" action="" class="form-horizontal">
    			<fieldset>

    			<div class="row control-group form-group">
    			<label class="control-label col-sm-3"><b>Scheduling URL </b></label>
<div class="col-sm-9">

                        <div class="controls schedule_url_online pos-rlt  word-break p-t-xs" id="schedule-url-id">
                        <a href="" target="_blank" name="scheduleurl" id="scheduleurl" class="text-info"><span id="hrefvalue" class="v-top"></span><span id="schedule_id" class="inline-block word-break">{{this.schedule_id}}</span></a>
<div class="inline" id="edit"><a href=""  id="edit-schedule-id" class="edit-schedule-id nounderline m-t-xs m-l-sm"><i title="Edit" class="icon-edit"></i></a></div>
 </div>
<div id="specialchar" class="m-t-xs text-danger" style="display:none;">Special characters are not allowed except underscore.</div>
<div id="charlength" class="m-t-xs text-danger" style="display:none;">Please enter at least 4 letters.</div>
<div id="schedule_error_message" class="m-t-xs text-danger"  style="display:none;"></div>
<div class="clearfix"></div> 
<div class="tip"><p class="text-muted"><i class="icon-lightbulb text-md"></i> Put this link in the signature or in your automated emails</p></div>
</div>
</div>

    			</fieldset>
    		</form>

    

    		<form id="scheduleform" name="scheduleform" method="post" action="" class="form-horizontal">
    			<fieldset>
<input type="text" name="id" class="hide form-control" value="{{id}}" >

          <div class="control-group form-group">
          
    					<label class="control-label col-sm-3" for="cname">Meeting Type </label> 
                   		<div class="controls col-sm-9">
    						<input class="input-xlarge form-control" type="text"  id="meeting_types" name="meeting_types"  value="{{meeting_types}}"  placeholder="Enter comma separated meeting types"  autocapitalize="off"/>
            <div id="meeting_type_error" class="text-danger" style="display:none;">Speacial characters are not allowed except comma</div>
    					</div>
    				</div> 



 
    			</fieldset>
    		</form>


<form  id="meeting_durations" name="meeting_durations"  class="form-horizontal">
    			<fieldset>

{{#stringToJSON this "meeting_durations"}}
<div class="control-group form-group">
    					<label class="control-label col-sm-3" for="cname">Meeting Duration</label> 
                   		  
							<div class="controls col-sm-9">
                            <label class="block">
                            15 Mins &nbsp;<input type="text" class="form-control inline-block" id="15mins" name="15mins"   value="{{15mins}}"/> 
                            </label>
                            <label class="block">
                            30 Mins &nbsp;<input type="text" class="form-control inline-block"  id="30mins" name="30mins" value="{{30mins}}"/> 
                            </label>
                           <label class="block">
                            60 Mins &nbsp;<input type="text" class="form-control inline-block"  id="60mins" name="60mins" value="{{60mins}}"/> 
                            </label>
{{/stringToJSON}}
<div id="meeting_duration_message" class="text-danger" style="display:none;"> Please enable at least one option by mentioning a short text for it.</div>
                        </div>

    				</div> 
</fieldset>
    		</form>

    
    		

    		<form  class="form-horizontal">
    			<fieldset>
<div class="control-group form-group">
<label class="control-label col-sm-3" for="cname" >Business Hours</label>
                   		<div class="controls col-sm-9">
    						<div id="define-business-hours"></div>
    					</div>
    				</div> 
<div class="line line-lg b-b"></div>
<div class="control-group form-group">
    				<div class="col-sm-offset-3 col-sm-9">
               			<button type="submit" class="btnSerialize btn-sm btn btn-primary no-outline" id="btnSerialize">Save</button><span class="m-l-sm text-danger" id="error_message"></span>
             			</div>
                      </div>

					

				</fieldset>
			</form>
		</div>
		</div>
		</div>
	</div>
	<div class="col w-md">
		<div class="data-block">
		<div class="p-l p-r">
			<h4 class="m-t-none">What is Online Appointment Scheduling?</h4>
			
			<p>Scheduling meetings over email or phone is tedious. Agile
				allows your customers to schedule a meeting with you directly in
				just a few clicks.</p>
		</div>	
		</div>
	</div>

</script><script id="settings-social-prefs-template" type="text/html">
<div>
	<div class="panel wrapper" >
		{{#if id}} 
			{{add_tag "Email"}} 
            <center>
			<img class="thumbnail m-b-none thumb-transparent thumb-xl" src="/img/icons/google-mail-sync.png"> <br>
			</center>
            <div class="p-b-xs">
				{{#if picture}} 
					<i class="media-grid thumb thumb-wrapper"> 
						{{#if_equals picture "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg"}}
							<img  src="{{emailGravatarurl 75 email}}"  /> 
						{{else}} 
							<img  src="{{picture}}" /> 
						{{/if_equals}}
					</i>
				{{else}} 
					<i class="media-grid"> <img class="thumbnail m-b-none thumb-transparent img-responsive square-thumb" src="{{emailGravatarurl 50 email}}"  /> </i>
			   	{{/if}}
			   	<label  class="m-t-xs m-b-xs">{{name}}</label> 
<div class="clearfix"></div>
<div class="m-t-lg">
			   	<a href="#social-prefs" class="btn btn-sm btn-danger delete">Disable</a>
			   	<a class="btn btn-sm btn-default" href="#gmail/{{id}}">Settings</a>
</div>
			</div>
		{{else}} 
           <center>
			<img class="thumbnail m-b-none thumb-transparent thumb-xl" src="/img/icons/google-mail-sync.png">
			</center>
           <!--<div align="center">
				<br/> <img class="thumbnail" src="img/{{service}}-logo-small.png" />
			</div>--><br/>
    		<div class="ellipsis-multiline m-b-sm" rel="tooltip" title="See all emails related to a contact from your Gmail account.">
				See all emails related to a contact from your Gmail account.
			</div>
			<div> <a href="/scribe?service={{service}}&amp;return_url={{return_url}}" class="btn btn-sm btn-default m-t-sm">Enable</a></div>
		{{/if}}
	</div>
</div>
</script>
  <script id="settings-user-prefs-template" type="text/html">
<!--  Contact View Detail in Detailed mode - when only one contact is shown -->
<div class="panel panel-default">
<div class="panel-heading">Personal Settings</div>
<div class="panel-body">
    <form id="userPrefs" class="form-horizontal" role="form">
        <fieldset>
            <input name="id" type="hidden" value="{{id}}" /> 		
            <!-- <legend>Personal Settings</legend> -->
            <div class="row">
                <div class="col-md-6 col-sm-6 col-xs-6">
                    <div class="control-group form-group">
                        <label class="control-label col-sm-4">Name <span class="field_req">*</span></label>
                        <div class="controls col-sm-8">
                            <input name="name" type="text" class="required form-control" value="{{currentDomainUserName}}" autocapitalize="off" />
                        </div>
                    </div>
                    <div class="control-group form-group hidden">
                        <label class="control-label col-sm-4">Color Theme <span class="field_req">*</span></label> 
                        <div class="controls col-sm-8">
                            <select name="template" id="userPrefsTemplate" class="required form-control">
								<option value="pink">Purple</option>
                                <option value="blue">Blue</option>
                                <option value="green">Green</option>
                                <option value="brown">Brown</option>
                            </select>
                        </div>
                    </div>
                    <div class="control-group form-group hidden">
                        <label class="control-label col-sm-4">Width</label> 
                        <div class="controls col-sm-8">
                            <select name="width" id="userPrefsWidth" class="form-control">
                                <option value="">Fixed</option>
                                <option value="-fluid">Fluid</option>
                            </select>
                        </div>
                    </div>

<div class="control-group form-group">
						<label class="control-label col-sm-4">Time Zone</label>
						<div class="controls col-sm-8">
							<select name="timezone" id="timezone" class="form-control">
								   <option value="Africa/Abidjan">Africa/Abidjan</option>
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
            <div class="control-group form-group">
                <label class="control-label col-sm-4">Currency</label>
                <div class="controls col-sm-8">
                    <select id="target_list" name="currency" class="form-control">
                        <option value="USD-$" selected="1">United States Dollar</option>
                        <option value="EUR-&euro;">Euro</option>
                        <option value="DZD-DA">Algerian Dinar</option>
                        <option value="ARS-$">Argentina Peso</option>
                        <option value="AUD-$">Australian Dollar</option>
                        <option value="BHD-BD">Bahraini Dinar</option>
                        <option value="BOB-$b">Bolivian Boliviano</option>
                        <option value="BWP-P">Botswanan Pula</option>
                        <option value="BRL-R$">Brazilian Real</option>
                        <option value="GBP-&pound;">British Pound Sterling</option>
                        <option value="BND-$">Brunei Dollar</option>
                        <option value="BGN-&#1083;&#1074;">Bulgarian Lev</option>
                        <option value="CAD-$">Canadian Dollar</option>
                        <option value="KYD-$">Cayman Islands Dollar</option>
                        <option value="XOF-CFAF">CFA Franc BCEAO</option>
                        <option value="CLP-$">Chilean Peso</option>
                        <option value="CNY-&yen;">Chinese Yuan</option>
                        <option value="COP-$">Colombian Peso</option>
                        <option value="CRC-&#8353;">Costa Rican Colon</option>
                        <option value="HRK-kn">Croatian Kuna</option>
                        <option value="CZK-K&#269;">Czech Republic Koruna</option>
                        <option value="DKK-kr">Danish Krone</option>
                        <option value="DOP-RD$">Dominican Peso</option>
                        <option value="EGP-&pound;">Egyptian Pound</option>
                        <option value="EEK-kr">Estonian Kroon</option>
                        <option value="FJD-$">Fijian Dollar</option>
                        <option value="HNL-L">Honduran Lempira</option>
                        <option value="HKD-$">Hong Kong Dollar</option>
                        <option value="HUF-Ft">Hungarian Forint</option>
                        <option value="INR-Rs">Indian Rupee</option>
                        <option value="IDR-Rp">Indonesian Rupiah</option>
                        <option value="ILS-&#8362;">Israeli New Sheqel</option>
                        <option value="JMD-J$">Jamaican Dollar</option>
                        <option value="JPY-&yen;">Japanese Yen</option>
                        <option value="JOD-JOD">Jordanian Dinar</option>
                        <option value="KZT-&#1083;&#1074;">Kazakhstani Tenge</option>
                        <option value="KES-KSh">Kenyan Shilling</option>
                        <option value="KWD-KD">Kuwaiti Dinar</option>
                        <option value="LVL-Ls">Latvian Lats</option>
                        <option value="LBP-&pound;">Lebanese Pound</option>
						<option value="LYD-LD">Libyan Dinar</option>
                        <option value="LTL-Lt">Lithuanian Litas</option>
                        <option value="MKD-&#1076;&#1077;&#1085;">Macedonian Denar</option>
                        <option value="MYR-RM">Malaysian Ringgit</option>
                        <option value="MUR-&#8360;">Mauritian Rupee</option>
                        <option value="MXN-$">Mexican Peso</option>
                        <option value="MDL-MDL">Moldovan Leu</option>
                        <option value="MAD-DH">Moroccan Dirham</option>
                        <option value="NAD-$">Namibian Dollar</option>
                        <option value="NPR-&#8360;">Nepalese Rupee</option>
                        <option value="ANG-&fnof;">Netherlands Antillean Guilder</option>
                        <option value="TWD-NT$">New Taiwan Dollar</option>
                        <option value="NZD-$">New Zealand Dollar</option>
                        <option value="NIO-C$">Nicaraguan Cordoba</option>
                        <option value="NGN-&#8358;">Nigerian Naira</option>
                        <option value="NOK-kr">Norwegian Krone</option>
                        <option value="OMR-RO">Omani Rial</option>
                        <option value="PKR-&#8360;">Pakistani Rupee</option>
                        <option value="PGK-K">Papua New Guinean Kina</option>
                        <option value="PYG-Gs">Paraguayan Guarani</option>
                        <option value="PEN-S/.">Peruvian Nuevo Sol</option>
                        <option value="PHP-&#8369;">Philippine Peso</option>
                        <option value="PLN-z&#322;">Polish Zloty</option>
                        <option value="QAR-QR">Qatari Rial</option>
                        <option value="RON-lei">Romanian Leu</option>
                        <option value="RUB-&#1088;&#1091;&#1073;">Russian Ruble</option>
                        <option value="SVC-&#8353;">Salvadoran Colon</option>
                        <option value="SAR-SR">Saudi Riyal</option>
                        <option value="RSD-&#1044;&#1080;&#1085;.">Serbian Dinar</option>
                        <option value="SCR-&#8360;">Seychellois Rupee</option>
                        <option value="SLL-Le">Sierra Leonean Leone</option>
                        <option value="SGD-$">Singapore Dollar</option>
                        <option value="SKK-Sk">Slovak Koruna</option>
                        <option value="ZAR-R">South African Rand</option>
                        <option value="KRW-&#8361;">South Korean Won</option>
                        <option value="LKR-&#8360;">Sri Lankan Rupee</option>
                        <option value="SEK-kr">Swedish Krona</option>
                        <option value="CHF-CHF">Swiss Franc</option>
                        <option value="TZS-TSh">Tanzanian Shilling</option>
                        <option value="THB-&#3647;">Thai Baht</option>
                        <option value="TTD-TT$">Trinidad and Tobago Dollar</option>
                        <option value="TND-TD">Tunisian Dinar</option>
                        <option value="TRY-YTL">Turkish Lira</option>
                        <option value="UGX-USh">Ugandan Shilling</option>
                        <option value="UAH-UAH">Ukrainian Hryvnia</option>
                        <option value="AED-Dh">United Arab Emirates Dirham</option>
                        <option value="UYU-$U">Uruguayan Peso</option>
                        <option value="UZS-&#1083;&#1074;">Uzbekistan Som</option>
                        <option value="VND-&#8363;">Vietnamese Dong</option>
                        <option value="YER-YER">Yemeni Rial</option>
                        <option value="ZMK-ZK">Zambian Kwacha</option>
                    </select>
                </div>
            </div>
                </div>
                <div class="col-md-3 col-sm-3 col-xs-3">
                    
                        <div id="upload-container" messg="User image has been uploaded">
                            <div class="clearfix"><a href="#choose-avatar-modal" data-toggle="modal">
								<div class="imgholder thumb-lg thumb-wrapper">
                                  {{#if pic}}
                                    <img class="w-full"  src="{{pic}}"  />
                                  {{else}}
                                    <img class="w-full"  src="https://contactuswidget.appspot.com/images/pic.png"  />
                                  {{/if}}
								</div></a>												
                                <p>
									<input type="hidden" id="upload_url" name="pic"/>  
                                    <!--<input style="margin: 10px 0px 0px;" class="upload_s3 btn" type="button" id="user_prefs_image" value="Upload"/>-->
									<a href="#choose-avatar-modal" class="text-info" data-toggle="modal">Change Avatar</a>
                                </p>
                            </div>
                        
                    </div>
                </div>
            </div>
            <div class="row">
<div class="col-md-12">
            <div class="control-group form-group">
                <label class="control-label col-sm-2">Signature</label> 
                <div class="controls col-sm-9">
					<div id="loading-editor"></div>
                    <textarea class="col-md-12 form-control" id="WYSItextarea" rows="10" name="signature" style="display: none;" placeholder="Enter text ..."></textarea>
                </div>
            </div>
            </div>
</div>
<div class="row">
<div class="col-md-12">            

	  <div class="control-group form-group">
                <label class="control-label col-sm-2">Task Reminders</label>
                <div class="controls col-sm-9">
<div class="checkbox">
                    <label class="i-checks i-checks-sm">
                    <input id="task_remainder" type="checkbox" name="task_reminder" value="true" /><i></i>
                    Send a daily email reminder when tasks are due 
                    </label>
</div>       
                </div>
            </div>
<div class="control-group form-group">
                <label class="control-label col-sm-2">Event Reminder</label>
                <div class="controls col-sm-9">
                    <div class="checkbox">
<label class="i-checks i-checks-sm">
                    <input id="event_remainder" type="checkbox" name="event_reminder" value="true" /><i></i>
                    Send email reminder 10 minutes before a calendar event
                    </label>
</div>       
                </div>
            </div>
                <div class="control-group form-group">
                <label class="control-label col-sm-2">Shortcuts</label>
                <div class="controls col-sm-9">
                    <div class="checkbox">
<label class="i-checks i-checks-sm">
                    <input id="keyboard_shotcuts" type="checkbox" name="keyboard_shotcuts" /><i></i>
                    Enable keyboard shortcuts <a href="#" data-dismiss="modal" class="t-l-none data-toggle="modal" id="keyboard-shortcuts"><i class="icon-info-sign"></i></a>
                    </label> 
</div>      
                </div>
            </div>
            <div class="control-group form-group">
<label class="col-sm-2">&nbsp;</label>
                <div class="controls col-sm-9">
					<a href="#change-password" class="text-info">Change Password</a>      
                </div>
            </div>
</div>
</div>
<div class="line  b-b line-lg"></div>
<div class="row">
<div class="col-md-12">
<div class="form-group">
            <div class="col-sm-offset-2 col-sm-9">
                <a href="#" type="submit" class="save btn btn-sm btn-primary">Save Changes</a>
                <!--<a href="#settings" class="btn btn-default btn-sm ">Cancel</a>-->
            </div>
</div>
</div>
            </div>
            
        </fieldset>
    </form>
</div>
</div>

<div id="choose-avatar-test" class="modal fade responsive-ui-modal">
<div class="modal-dialog">
<div class="modal-content">

	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal">&times;</button>
		<h3 class="modal-title">Avatars</h3>
	</div>
	<div class="modal-body choose-avatars">
		<table>
		 	<tbody>
                   <input type="hidden" name="custom-avatar" value="{{#getCurrentUserPrefs}}{{#if pic}}{{pic}}{{/if}}{{/getCurrentUserPrefs}}">
                   <tr>
                     <!--<td><a href="#"><img class="thumbnail" src="https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/pic.png" style="width:58px;height:58px;"/></a>
                         <p class="help-block" style="color:#999;padding-top:5px;opacity:0">For</p>
                     </td>-->
                     <td colspan="3">
                      	 <div id="upload-in-modal" messg="User image has been uploaded">
							<a href="#" class="imgholder m-none inline-block thumb-md thumb-wrapper">
	                         	<img class="preview-avatar avatar-thumb m-b-none" src="{{#getCurrentUserPrefs}}{{#if pic}}{{pic}}{{/if}}{{/getCurrentUserPrefs}}" width="58" height="58"/>
                          	</a>
                          	<div class="m-l-xs inline-block">
                                  <input class="upload_prefs_s3 submit btn btn-sm  btn-default m-t-lg" type="submit" id="user_prefs_image" value="Upload"/>
                          	</div>
                         </div>
                         <p class="help-block p-t-xs">Recommended image size: 50px*50px.</p>
                     </td>
		 		  </tr>
				  {{{get_avatars_template}}}
		 	</tbody>
		</table>		   
	</div>
</div>
</div>
</div>
</script>

 <script id="settings-template" type="text/html"> 
<div class="">
<div class="bg-light lter b-b wrapper-md">
<h1 class="m-n font-thin h3">Preferences <small></small></h1>
</div>
   
    <!-- <div class="app-content-full  h-full enable-full-height"> -->  
    <div>
	<div class="hbox hbox-auto-xs hbox-auto-sm bg-light">
	<div class="col w b-r">
    <div class="vbox">
      <div class="row-row">
		<div id="PrefsTab" class="list-group list-group-lg no-radius no-border no-bg m-b-none">
		
			<a href="#user-prefs" class="user-prefs-tab list-group-item  select">Personal Settings</a>
			<a href="#email" class="email-tab list-group-item ">Email</a>
			<a href="#email-templates" class="email-templates-tab list-group-item ">Email Templates</a>
			<a href="#notification-prefs" class="notification-prefs-tab list-group-item ">Notifications</a>
			<a href="#add-widget" class="add-widget-prefs-tab list-group-item ">Widgets</a>
			<a href="#sync" class="contact-sync-tab list-group-item ">Data Sync</a>
            <a href="#scheduler-prefs" class="scheduler-prefs-tab list-group-item ">Online Calendar</a>
		
		</div>
		</div>
		</div>
		</div>
		<div class="tab-content wrapper-md">
		
    	  
			<div class="tabs" id="prefs-tabs-content"></div>
		</div>
		
	
</div>
</div>
</div>
</script>
