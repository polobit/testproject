<script id="socialsuite-social-network-template" type="text/html">
<div class="at-center">
   <label class="font15"><b>Choose your Social Network</b></label> 
   <div class="row-fluid">
     <div class="span7">
       <div id="twitter_option" class="pull-right network-type" value="TWITTER">
 	      <a href="#social">
             <i id="twitter_icon" class="icon-twitter icon-5x network-type-icon" title="Twitter"></i><b>Twitter</b>     
          </a>
       </div>
     </div><!-- /.span5 -->     
  </div>	<!-- /.row -->
</div>
</script>

<script id="twitter-stream-type-template" type="text/html">
<div class="at-center">  
  <div id="account_description" class="row-fluid">
    <div class="span4"> 
       <a style="text-decoration:none;"><i class="icon-twitter-sign icon-5x pull-right" style="padding-top:13px;" title="Selected Social Network is Twitter"></i></a>
    </div>
    <div class="span4">
      <label id="account_description_label"></label>
    </div>
    <div class="span4">
      <img id="twitter_profile_img" name="twitter_profile_img" class="pull-left thumbnail" src="">
    </div>  	 						               						          						        
  </div>  
  <hr>
  <div class="social-stream-types">	
   <label class="font15"><b>Select the Stream</b></label> 
   <div class="row-fluid">
    <div class="span3">
     <div class="stream-type" id="home" value="Home" title="Home">
 	  <a> <i class="icon-home icon-3x"></i><br>Home </a>
     </div>
    </div><!-- /.span3 -->    
    <div class="span3">
     <div class="stream-type" id="retweets" value="Retweets" title="Retweets">
 	  <a> <i class="icon-retweet icon-3x"></i><br>Retweets </a>
     </div>
    </div><!-- /.span3 -->	
	<div class="span3">
     <div class="stream-type" id="sent" value="Sent" title="Sent">
 	  <a> <i class="icon-share-alt icon-3x"></i><br>Sent </a>
     </div> 
    </div><!-- /.span3 -->
    <div class="span3">
     <div class="stream-type" id="mentions" value="Mentions" title="Mentions">				
      <a> <span class="mentions-big-title">@</span><br>Mentions </a>
	 </div>				                
    </div><!-- /.span3 -->		
   </div><!-- /row-->
   <div class="row-fluid">    
    <div class="span3">
     <div class="stream-type" id="dm_inbox" value="DM_Inbox" title="DM Inbox">				
      <a> <i class="icon-download-alt icon-3x"></i><br>DM Inbox </a>
     </div>					                
    </div><!-- /.span3 -->
    <div class="span3">
     <div class="stream-type" id="dm_outbox" value="DM_Outbox" title="DM Outbox"> 
 	  <a> <i class="icon-upload-alt icon-3x"></i><br>DM Outbox </a>
     </div>
    </div><!-- /.span3 -->      
    <div class="span3">	
     <div class="stream-type" id="favorites" value="Favorites" title="Favorites">			
      <a> <i class="icon-star icon-3x"></i><br>Favorites </a>
     </div>					                
    </div><!-- /.span3 -->    
    <div class="span3">
     <div class="stream-type" id="search" value="Search" title="Search">		
      <a> <i class="icon-search icon-3x"></i><br>Search </a>      
     </div>					                
    </div><!-- /.span3 -->    
   </div>	<!-- /.row -->     
  </div>
</div>
</script>

<!-- addStreamModal -->
<div id="addStreamModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="addStreamModalLabel" aria-hidden="true" style="display: none;">
  <div class="modal-header">
	<button class="close" data-dismiss="modal">x</button>
	<h3 id="addStreamModalLabel"><i class="icon-plus-sign"></i> Add Stream</h3>			
  </div>
  <div class="modal-body">
	 <form id="streamDetail" name="streamDetail" class="form-horizontal">
       <fieldset>   
        	<input id="domain_user_id" name="domain_user_id" type="hidden" value=""> 		
            <input id="client_channel" name="client_channel" type="hidden" value="">
        	<input id="twitter_token" name="token" type="hidden" value="">
            <input id="twitter_token_secret" name="secret" type="hidden" value="">    
            <input id="twitter_account" name="screen_name" type="hidden" value="">
            <input id="network_type" name="network_type" type="hidden" value="">
            <input id="stream_type" name="stream_type" type="hidden" value="">
            <img id="twitter_profile_img_url" name="twitter_profile_img_url" onload="onloadProfileImg()" src="">
                	
            <div id="streamDetails" class="stream-details">                   		    							
								
        	</div>  
        	<div id="search_stream_keyword"></div>
        	<label id="stream_description_label" class="txt-mute">  </label>         					   			  
       </fieldset>
    </form>		   	
  </div><!-- modal body -->
  <div class="modal-footer">	 	         
     <a href="#social" id="add_twitter_stream" type="button" class="save-twitter-stream btn btn-primary"> Save </a>                			    
  </div>
</div>
	
	
<script id="socialsuite-twitter-message-template" type="text/html">
<div class="modal hide fade message-modal" id="socialsuite_twitter_messageModal" style="width:400px; left:55%;word-wrap: break-word;">
  <form id="socialsuite_twitter_messageForm" name="socialsuite_twitter_messageForm" method="post">
	 <fieldset>    
         <div class="modal-header">
	        <button class="close" data-dismiss="modal">x</button>
			{{#if_equals headline "Direct Message"}}
	        	<h3><i class="icon-envelope"></i> {{headline}}</h3>
			{{/if_equals}}
			{{#if_equals headline "Tweet"}}
				<h3><i class="icon-twitter"></i> {{headline}}</h3>
			{{/if_equals}}
            {{#if_equals headline "Reply Tweet"}}
				<h3><i class="icon-share"></i> {{headline}}</h3>
			{{/if_equals}}
            {{#if_equals headline "Retweet"}}
				<h3><i class="icon-retweet"></i> {{headline}}</h3>
			{{/if_equals}}
        </div>
        <div class="modal-body agile-modal-body">	      
                    <input name="tweetId" type="hidden" value={{tweetId}} />
                    <input name="tweetOwner" type="hidden" value={{tweetOwner}} />  
                    <input name="streamId" type="hidden" value={{streamId}} />
                    <input name="profileImg" type="hidden" value={{profileImg}} />
                    <input name="headline" type="hidden" value="{{headline}}" />                    
                    <input name="info" type="hidden" value="{{info}}" />
                    <input name="description" type="hidden" value="{{description}}" />
                    <input name="domain_user_id" type="hidden" value="{{domain_user_id}}" />
					<input name="screen_name" type="hidden" value={{screen_name}} />
					<input name="network_type" type="hidden" value={{network_type}} />
					<input name="token" type="hidden" value={{token}} />
                    <input name="secret" type="hidden" value={{secret}} />
                    <input name="schedule" type="hidden" id="schedule" value={{schedule}} />

					<div style="margin-bottom:10px;">
						{{info}}
					</div>	                
	                <div class="control-group">
	                    <label class="control-label"><b>Message: </b><span class="field_req">*</span></label>
	                    <div class="controls span4" style="margin-left:0px;">
                            {{#if message}} <!-- Edit Scheduled Update -->
                              <input name="id" type="hidden" value={{id}} />
							  {{#if_equals headline "Reply Tweet"}}
	                        	<textarea rows="4" class="required span4 twit-tweet-limit" placeholder="Reply Message to {{description}}" name="message" id="twit-tweet" data-provide="limit" data-counter="#counter" style="max-width:500px;">{{message}}</textarea>
							  {{else}} <!-- tweet and direct msg -->
								<textarea rows="4" class="required span4 twit-tweet-limit" placeholder="{{description}}" name="message" id="twit-tweet" data-provide="limit" data-counter="#counter" style="max-width:500px;">{{message}}</textarea>
							  {{/if_equals}}
                            {{else}}
                              {{#if_equals headline "Reply Tweet"}}
	                        	<textarea rows="4" class="required span4 twit-tweet-limit" placeholder="Reply Message to {{description}}" name="message" id="twit-tweet" data-provide="limit" data-counter="#counter" style="max-width:500px;">{{description}}&nbsp</textarea>
							  {{else}} 
                                   {{#if_equals headline "Retweet"}}
                                         <textarea rows="4" class="required span4" style="max-width:500px;" id="twit-retweet" disabled>{{description}}</textarea>                            
                                         <textarea rows="4" class="required span4 twit-tweet-limit" placeholder="RT @{{tweetOwner}}: {{description}}" name="message" id="twit-tweet" data-provide="limit" data-counter="#counter" style="max-width:500px;display:none;">RT @{{tweetOwner}}: {{description}}</textarea>
								   {{else}}<!-- tweet and direct msg -->
                                         <textarea rows="4" class="required span4 twit-tweet-limit" placeholder="{{description}}" name="message" id="twit-tweet" data-provide="limit" data-counter="#counter" style="max-width:500px;"></textarea>
                                   {{/if_equals}}			   	                
							  {{/if_equals}}  
                            {{/if}}
							<div class="right"><small style="font-style: italic;">Characters Left <em id="twitter-counter" style="margin-right:5px;">140</em></small></div>
                        </div>
	                </div>	   
         
                    {{#if_equals headline "Retweet"}}
                      <div id="tweet_scheduling" class="tweet-scheduling" title="Scheduling" style="display:none;">
                    {{else}}
                      <div id="tweet_scheduling" class="tweet-scheduling" title="Scheduling">
                    {{/if_equals}}	
                        <i class="icon-time icon-2x" style="color: gray;"></i>
                      </div>
                      <div id="schedule_controls" class="row" style="display:none;">
                        <div id="schedule_date" class="control-group span3 width-150">
                          <label class="control-label"><b>Date </b></label>
                          <div class="controls">
                            <input id="scheduled_date" class="required width-150 date" type="text" name="scheduled_date" placeholder="mm/dd/yyyy">							
                          </div>
                        </div>
                        <div id="schedule_time" class="control-group span2 width-65">
                          <label class="control-label"><b>Time </b></label>
                          <div class="controls">
                             <input id="scheduled_time" class="required width-65" type="text" name="scheduled_time" placeholder="time">		
                          </div>
                        </div>
                      </div> 
            {{#if_equals headline "Retweet"}}
               <span id="link-text" class="is-actionable right" style="font:menu;margin-right: 5px;display:none;"><a id="add_message" style="color:grey;">Spread the word about Agile CRM</a></span>
            {{else}}
               <span id="link-text" class="is-actionable right" style="font:menu;margin-right: 5px;"><a id="add_message" style="color:grey;">Spread the word about Agile CRM</a></span>
            {{/if_equals}} 
        </div>
	    <div class="modal-footer form-actions" style="margin-top: 0px;">
            {{#if_equals headline "Retweet"}}
                 <a href="#" class="btn" id="edit_retweet">Edit</a>
                 <a href="#" class=" save btn btn-primary" id="send_retweet">Retweet</a>
                 <a href="#" class="save btn btn-primary" id="send_tweet" style="display:none;">Send</a>
            {{else}}       		 
			     <a href="#" class="save btn btn-primary" id="send_tweet">Send</a>
            {{/if_equals}}			
			<span><img src="img/ajax-spinner.gif" id="spinner-modal" style="display:none;"></img></span>
	        <span class="save-status"></span>
	    </div>
     </fieldset> 
  </form>
</div>
</script>
<script id="socialsuite-RT-userlist-template" type="text/html">
<div class="modal hide fade message-modal" id="socialsuite_RT_userlistModal" style="width:400px; left:55%;word-wrap: break-word;">
  <div class="modal-header">
     <button class="close" data-dismiss="modal">x</button>
     <h3>{{retweeted}}</h3>			
  </div>
  <div class="modal-body agile-modal-body" style="padding:0;">	       
     <article class="stream-item">
       <div class="item-box">       
         <div class="tweet">
            <header class="tweet-header" style="padding-bottom: 15px;">        
               <a class="account-link link-complex block" href="https://twitter.com/{{user.screen_name}}" rel="user" target="_blank"> 
                 <div class="obj-left item-img tweet-img">  
	                <img class="tweet-avatar avatar pull-left thumbnail" src={{user.profile_image_url}} width="40" height="40" alt="{{user.screen_name}}'s avatar">   
 		         </div> 
 		         <div class="tweet-user"> 
 		            <span class="account-inline txt-ellipsis"> 
 		 	          <b class="fullname link-complex-target">{{user.name}}</b> 
 			          <span class="username txt-mute"><span class="at">@</span>{{user.screen_name}}</span>  
 		            </span> 
 		         </div> 
    	       </a>  
	        </header> 
	        <div class="tweet-body"> 
               <p class="tweet-text"> {{safe_tweet text}} </p> 
            </div>	
            <footer class="tweet-footer cf">
               <time class="time-ago txt-mute txt-small time-ellipsis" datetime="{{created_at}}">{{created_at}}</time>
	        </footer>  
	     </div>
	   </div>                        
     </article>
     <article stream-id="{{stream_id}}" id="RTuser_list">
            
     </article>	        
   </div>
</div>
</script>

<script id="socialsuite-RT-userlist-collection-template" type="text/html">	
<ul id="socialsuite-RT-userlist-model-list" class="RTuserlist-modal">  
      <img id="spinner-modal" class="pull-right" style="width:20px;height:20px;margin-right: 180px;" src="img/ajax-spinner.gif">
</ul>		
</script>

<script id="socialsuite-RT-userlist-model-template" type="text/html">	
<li id="{{id}}" class="stream-item">
  <div class="item-box">       
     <div class="tweet">
       <header class="tweet-header" style="padding-bottom: 15px;">        
         <a class="account-link link-complex block" href="https://twitter.com/{{user.screenName}}" rel="user" target="_blank"> 
           <div class="obj-left item-img tweet-img">  
	         <img class="tweet-avatar pull-left thumbnail" src={{user.profileImageUrlHttps}} width="30px" height="30px" style="border-radius: 8px;" alt="{{user.screenName}}'s avatar">   
 		   </div> 
 		   <div class="tweet-user"> 
 		     <span class="account-inline txt-ellipsis"> 
 		 	   <b class="fullname link-complex-target">{{user.name}}</b> 
 			   <span class="username txt-mute"><span class="at">@</span>{{user.screenName}}</span>  
 		     </span> 
 		   </div> 
    	 </a>  
	   </header> 
	   <div class="tweet-body"> 
           <p class="tweet-text txt-mute"> {{user.followersCount}} Followers </p> 
       </div>
       <footer class="right" style="margin-top: -28px;">
          <button class="tweet-to-user" tweet-owner="{{user.screenName}}"><i class="icon icon-share" title="Tweet to {{user.screenName}}"></i></button>    	  		   
          <button class="follow-user" tweet-owner="{{user.screenName}}"><i class="icon-twitter"></i> Follow</button>
       </footer>
	 </div>
  </div>                        
</li>
</script>
<!-- initial script which displayes social suite tabs with Add Stream and Added Streams. -->
<script id="socialsuite-scheduled-updates-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1>Scheduled Messages</h1>
        </div>
    </div>
</div>         

<div class="row">
           <div class="span12">              
                <div id="socialsuite-scheduled-updates-content">
                     
                </div>        
            </div><!-- span12 end -->       
</div> <!-- row end -->
<div id="schedule-edit-modal"></div>
</script>    

<script id="socialsuite-scheduled-updates-collection-template" type="text/html">	
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1>Scheduled Messages</h1>
        </div>
    </div>
</div>         

<div class="row">
           <div class="span12">              
                <div id="socialsuite-scheduled-updates-content">
                     
                </div>        
            </div><!-- span12 end -->       
</div> <!-- row end -->
<div id="schedule-edit-modal"></div>

<div class="data-block">
         <div class="data-container">          	
			<table id="schedule-updates" class="table table-striped showCheckboxes agile-ellipsis-dynamic"
				url="core/scheduledupdate/bulk">
                <col width="30px">
				<col width="25%">
				<col width="30%">
				<col width="20%">
				<col width="15%">
                <col width="20%">
				<thead>
					<tr>
						<th class="hide">Id</th>
						<th>User</th>
						<th>Message</th>
						<th>Schedule</th>
						<th>Message Type</th>
                        <th>Recipient</th>
					</tr>
				</thead>
				<tbody id="socialsuite-scheduled-updates-model-list" class="socialsuite-scheduled-updates-model-list"
					style="overflow: scroll;overflow:hidden;">
				</tbody>
			</table>
         </div>
</div>		
</script>

<script id="socialsuite-scheduled-updates-model-template" type="text/html">	
{{#if checkbox}}
	<td><input class="tbody_check" type="checkbox"/></td>
{{/if}}	
<td class='data hide' data='{{id}}'>{{id}}</td>
<td>
   <div class="row-fluid">
      <a class="account-link link-complex block" href="https://twitter.com/{{screen_name}}" rel="user" target="_blank">    
    	<div style="display:inline;padding-right:5px;height:auto;">   
           <img class="tweet-avatar avatar pull-left thumbnail" src="{{profileImg}}" style="width:40px;height:40px;" alt="{{screen_name}}'s avatar" title="{{screen_name}}'s avatar">     	
    	</div>
    	<div style="height:auto;display:inline-block;vertical-align:top;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:70%">
        		<span class="account-inline txt-ellipsis"> 	
                        <b class="link-complex-target"><span class="at">@</span>{{screen_name}}</b>
 		        </span> 
        		<br/>
        		{{network_type}}        	
	    </div>
      </a>
   </div>
</td>
<td class="is-actionable edit-scheduled-update">{{message}}</td>
<td class="is-actionable edit-scheduled-update">
    <time class="time-ago" value="{{schedule}}" datetime="{{epochToHumanDate "" schedule}}" style="border-bottom:dotted 1px #999">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" schedule}}</time>
</td>
<td class="is-actionable edit-scheduled-update">{{headline}}</td>
<td class="is-actionable edit-scheduled-update">
    {{#if_equals tweetOwner "/"}}
         <span style="display:none;"></span>
    {{else}}
         <span>{{tweetOwner}}</span>
    {{/if_equals}}
</td>
</script><!-- initial script which displayes social suite tabs with Add Stream and Added Streams. -->
<script id="socialsuite-show-streams-template" type="text/html">
<div class="row">
    <div class="span12">
        <div class="page-header">
            <h1>Social Suite</h1>
            <a id="add-stream" class="add-stream add-stream-tab btn right" style="top:-30px;position: relative;">
 			  <i class="icon icon-plus-sign"></i> Add Stream
			</a>             
            <div class="right" style="position:relative;margin-right:5px;top:-30px;">       
              <a href="#scheduledmessages" id="show_scheduled_updates" class="btn" style="display:none;"><i class="icon-time icon"></i></a>              
            </div>      
        </div>
    </div>
</div>         

<div class="row">
           <div class="span12">              
                <div id="socialsuite-tabs-content">
                     
                </div>        
            </div><!-- span12 end -->       
</div> <!-- row end -->
</script>    
<!-- main social suite container -->
<script id="socialsuite-streams-collection-template" type="text/html">
{{#unless this.length}}
 <div class="slate">
    <div class="slate-content">
       <div class="box-left">
            <img alt="Clipboard" src="/img/clipboard.png" />
       </div>
       <div class="box-right">
            <h3>You have not associated any social accounts currently.</h3>
            <div class="text">
               	Track relevant conversations and participate. Import prospective customers and run multichannel campaigns.  
            </div>
          		Get started by adding a social stream.<br>
                <a id="add-stream" class="add-stream add-stream-tab btn">
 		          <i class="icon icon-plus-sign"></i> Add Stream
		        </a> 
	   </div>
    </div>
 </div>
{{else}} 
  <ul id="socialsuite-streams-model-list" class="columns row-fluid ui-sortable">  </ul> 
{{/unless}}
</script>

<!-- main column in container -->
<script id="socialsuite-streams-model-template" type="text/html">
<header class="column-header">    
  {{#if profile_img_url}}
     <img src={{profile_img_url}} id={{id}}-profile-img class="user-profile-img pull-left thumbnail" alt="{{screen_name}}'s avatar." title="{{screen_name}}'s avatar.">
  {{/if}}             
  <!-- <small class="pull-right column-index">{{column_index}}</small> -->    
  <span>           
    {{#if_equals network_type "TWITTER"}}                 
        <i class="pull-right margin-hs social-type-icon icon icon-twitter"></i>
    {{else}}
        <i class="margin-hs social-type-icon icon icon-linkedin"></i>
    {{/if_equals}}     

    {{#if_equals stream_type "Mentions"}}
         <p class="stream-type-icon icon mentions-small-title" title="Mentions Stream">@</p>
    {{else}}
         <i class="stream-type-icon icon {{get_stream_icon stream_type}}" title="{{stream_type}} Stream"></i>
    {{/if_equals}}
                 
    <span id="stream-spinner-modal-{{id}}" class="waiting-symbol">
         <img src="img/ajax-loader-cursor.gif"></img>
    </span>
  </span>        
  <h4 class="column-title txt-ellipsis"> 
      {{#if_equals stream_type "All_Updates"}}    
          <span>All Updates</span>
      {{else}} 
        {{#if_equals stream_type "DM_Inbox"}}
           <span>DM Inbox</span>
        {{else}} 
           {{#if_equals stream_type "DM_Outbox"}}
               <span>DM Outbox</span>
           {{else}}
  		       <span>{{stream_type}}</span>
           {{/if_equals}}
        {{/if_equals}}
      {{/if_equals}}
      {{#if_equals stream_type "Search"}}                 
 		 <small>{{keyword}}</small>
      {{/if_equals}}
      <br>
 	  <span class="attribution txt-mute txt-sub-antialiased">@{{screen_name}}</span>
   </h4> 
   <span class="column-header-link is-actionable">
      <i class="pull-right icon icon-trash stream-delete header-action" id={{id}} title="Delete Stream"></i>                     
      {{#if_equals network_type "TWITTER"}} 		 		
          <i class="compose-status icon icon-edit compose-message header-action" stream-id={{id}} title="Compose Message"></i>
	  {{else}}
	      <i class="compose-status icon icon-edit share-update header-action" stream-id={{id}} title="Share an update"></i>
	  {{/if_equals}} 
   </span>	 
</header>
<div id="stream_notifications_{{id}}" class="stream-notifications action-notify" data={{id}} rel=""></div>
<div id="stream" class="column-content">
                      
</div>
</script>

<!-- sub-column as model but collection in main-column  -->
<script id="Column-collection-template" type="text/html">
<div id="Column-model-list" class="chirp-container scroll-v" onscroll="OnScrollDiv(this)" data="0">
   
</div>
</script>

<!-- models for tweets -->
<script id="Column-model-template" type="text/html">
{{#if_equals msg_type "Tweet"}}
 {{#if isNew}}
  <article id={{id}} tweet-id-str="{{id_str}}" stream-id={{stream_id}} class="stream-item is-actionable is-new {{deleted_msg}}" style="display:none;">
 {{else}}
  <article id={{id}} tweet-id-str="{{id_str}}" stream-id={{stream_id}} class="stream-item is-actionable {{deleted_msg}}">
 {{/if}}
    <div class="item-box">       
      <div class="tweet">
           <header class="tweet-header">        
	          <a class="account-link link-complex block" href="https://twitter.com/{{user.screen_name}}" rel="user" target="_blank"> 
		         <div class="obj-left item-img tweet-img">  
			       <img class="tweet-avatar avatar pull-left thumbnail" src={{user.profile_image_url}} width="40" height="40" alt="{{user.screen_name}}'s avatar" title="Klout Score {{klout_score}}">   
 		         </div> 
 		         <div class="tweet-user"> 
 			        <span class="account-inline txt-ellipsis"> 
 						<b class="fullname link-complex-target">{{user.name}}</b> 
 						<span class="username txt-mute"><span class="at">@</span>{{user.screen_name}}</span>  
 		    		</span> 
 				 </div> 
    		  </a>  
		   </header> 
		   <div class="tweet-body"> 
 	          <p class="tweet-text">
                 {{safe_tweet text}}
              </p>                  
 			  <footer class="tweet-footer cf">
              {{#if id_str}}
              {{#if retweeted}}
                 <a class="txt-mute txt-small show-retweet">{{retweeted}}</a><br>
              {{/if}}
              <time class="time-ago txt-mute txt-small time-ellipsis" datetime="{{created_at}}">{{created_at}}</time>
                           
 	    	  <ul class="tweet-actions">
                 {{#if direct_message}}
                    <li> <a class="tweet-action add-twitter-contact" href="#personModal" class="btn right" data-toggle="modal"> 
                            <i class="icon icon-plus-sign" title="Add Contact"></i>                            
                         </a> </li>
                 {{else}}
                    <li> <a class="tweet-action" href="https://twitter.com/{{user.screen_name}}/status/{{id_str}}" rel="url" target="_blank"> 
                            <i class="icon icon-external-link" title="Detail Status"></i>                            
                         </a> </li>	    		
                    <li> <a class="tweet-action add-twitter-contact" href="#personModal" class="btn right" data-toggle="modal"> 
                            <i class="icon icon-plus-sign" title="Add Contact"></i>                            
                         </a> </li>	                 
 		    		<li> <a class="tweet-action" href="#social" rel="reply"> 
                            <i class="icon icon-reply reply-message" title="Reply"></i>                             
                         </a> </li>                    
 		    		<li> <a class="tweet-action" href="#social" rel="retweet">
                         {{#if retweeted_by_user}}
                           <i class="icon icon-retweet undo-retweet-status" title="Retweet" style="color:#00FF40;"></i>
                         {{else}}
                             {{#if tweetowner_not_streamuser}}
                                 <i class="icon icon-retweet retweet-status" title="Retweet"></i>
                             {{/if}}
                         {{/if}}
                         </a> </li>
 		    		<li> <a class="tweet-action" href="#social" rel="favorite"> 
                         {{#if favorited_by_user}}
                            <i class="icon icon-star undo-favorite-status" style="color:orange;" title="Unfavorite from {{user.screen_name}}"></i>                             
                         {{else}}
                            <i class="icon icon-star favorite-status" title="Favorite from {{user.screen_name}}"></i>                             
                         {{/if}}
                         </a> </li>
                 {{/if}}
 		    		<li> 
                         <a id="{{id_str}}_more_options" class="tweet-action more-options" href="#social"> 
                            <i class="icon icon-ellipsis-horizontal" title="More Options"></i> 
                         </a>
    					 <ul id="{{id_str}}_more_options_list" class="pull-right more-options-list dropdown-menu" role="menu">
                                <li role="presentation"><a href="#social" class="reply-message" role="menuitem">Tweet to @{{user.screen_name}}</a></li> 							
                            {{#if deletable_tweet}}
                                <li class="divider"></li>
                                <li role="presentation"><a href="#social" class="delete-tweet" role="menuitem">Delete</a></li>                                
                            {{/if}}
    					 </ul>
                    </li>  
        		</ul>             
              {{/if}}
 			 </footer>  
    	   </div>		   
		</div>
	</div>                        
  </article>

{{else}} 
  {{#if_equals msg_type "NoTweet"}}
   {{#if show}}
	<article id={{id}}_{{stream_id}} class="no-tweet">
       <p>{{text}}</p>              
	</article>
   {{/if}}  
  {{/if_equals}}
{{/if_equals}}
</script>