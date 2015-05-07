<script id="socialsuite-social-network-template" type="text/html">
<div class="at-center">
   <label class="font15"><b>Choose your Social Network</b></label> 
   <div class="row">
     <div class="col-md-7 col-sm-7 col-xs-7">
       <div id="twitter_option" class="pull-right network-type text-l-none-hover" value="TWITTER">
 	      <a href="#social">
             <i id="twitter_icon" class="icon-twitter icon-5x network-type-icon text-l-none-hover" title="Twitter" style="text-decoration:none"></i>
<div class="text-l-none-hover"><b>Twitter</b></div>     
          </a>
       </div>
     </div><!-- /.span5 -->     
  </div>	<!-- /.row -->
</div>
</script>

<script id="twitter-stream-type-template" type="text/html">
<div class="at-center">  
  <div id="account_description" class="row">
    <div class="col-md-4 col-sm-4 col-xs-4"> 
       <a style="text-decoration:none;"><i class="icon-twitter-sign icon-5x pull-right"  title="Selected Social Network is Twitter"></i></a>
    </div>
    <div class="col-md-4 col-sm-4 col-xs-4">
      <label id="account_description_label"></label>
    </div>
    <div class="col-md-4 col-sm-4 col-xs-4">
      <img id="twitter_profile_img" name="twitter_profile_img" class="pull-left thumbnail" src="">
    </div>  	 						               						          						        
  </div>  
  <hr>
  <div class="social-stream-types">	
   <label class="font15 m-b-sm"><b>Select the Stream</b></label> 
   <div class="row m-b-sm">
    <div class="col-md-3 col-sm-3 col-xs-3">
     <div class="stream-type" id="home" value="Home" title="Home">
 	  <a> <i class="icon-home icon-3x text-l-none"></i><br>Home </a>
     </div>
    </div><!-- /.col-md-3 -->    
    <div class="col-md-3 col-sm-3 col-xs-3">
     <div class="stream-type" id="retweets" value="Retweets" title="Retweets">
 	  <a> <i class="icon-retweet icon-3x text-l-none"></i><br>Retweets </a>
     </div>
    </div><!-- /.col-md-3 -->	
	<div class="col-md-3 col-sm-3 col-xs-3">
     <div class="stream-type" id="sent" value="Sent" title="Sent">
 	  <a> <i class="icon-share-alt icon-3x text-l-none"></i><br>Sent </a>
     </div> 
    </div><!-- /.col-md-3 -->
    <div class="col-md-3 col-sm-3 col-xs-3">
     <div class="stream-type" id="mentions" value="Mentions" title="Mentions">				
      <a> <span style="font-size:26px">@</span><br>Mentions </a>
	 </div>				                
    </div><!-- /.col-md-3 -->		
   </div><!-- /row-->
   <div class="row">    
    <div class="col-md-3 col-sm-3 col-xs-3">
     <div class="stream-type" id="dm_inbox" value="DM_Inbox" title="DM Inbox">				
      <a> <i class="icon-download-alt icon-3x text-l-none"></i><br>DM Inbox </a>
     </div>					                
    </div><!-- /.col-md-3 -->
    <div class="col-md-3 col-sm-3 col-xs-3">
     <div class="stream-type" id="dm_outbox" value="DM_Outbox" title="DM Outbox"> 
 	  <a> <i class="icon-upload-alt icon-3x text-l-none"></i><br>DM Outbox </a>
     </div>
    </div><!-- /.col-md-3 -->      
    <div class="col-md-3 col-sm-3 col-xs-3">	
     <div class="stream-type" id="favorites" value="Favorites" title="Favorites">			
      <a> <i class="icon-star icon-3x text-l-none"></i><br>Favorites </a>
     </div>					                
    </div><!-- /.col-md-3 -->    
    <div class="col-md-3 col-sm-3 col-xs-3">
     <div class="stream-type" id="search" value="Search" title="Search">		
      <a> <i class="icon-search icon-3x text-l-none"></i><br>Search </a>      
     </div>					                
    </div><!-- /.col-md-3 -->    
   </div>	<!-- /.row -->     
  </div>
</div>
</script>

<!-- addStreamModal -->
<div id="addStreamModal" class="modal fade message-modal" tabindex="-1" role="dialog" aria-labelledby="addStreamModalLabel" aria-hidden="false" style="display: none; padding-left: 17px;">
   <div class="modal-backdrop fade" style="height: auto;"></div>
   <div class="modal-dialog">
    <div class="modal-content">
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
     <a href="#social" id="add_twitter_stream" type="button" class="save-twitter-stream btn btn-sm btn-primary"> Save </a>                			    
  </div>
</div>
	</div>
	</div>
<script id="socialsuite-twitter-message-template" type="text/html">
<div class="modal  fade message-modal" id="socialsuite_twitter_messageModal" >
<div class="modal-dialog">
    <div class="modal-content">
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
	                <div class="control-group form-group">
	                    <label class="control-label"><b>Message: </b><span class="field_req">*</span></label>
	                    <div class="controls" style="margin-left:0px;">
                            {{#if message}} <!-- Edit Scheduled Update -->
                              <input name="id" type="hidden" value={{id}} />
							  {{#if_equals headline "Reply Tweet"}}
	                        	<textarea rows="4" class="required form-control w-full twit-tweet-limit" placeholder="Reply Message to {{description}}" name="message" id="twit-tweet" data-provide="limit" data-counter="#counter" >{{message}}</textarea>
							  {{else}} <!-- tweet and direct msg -->
								<textarea rows="4" class="required form-control w-full twit-tweet-limit" placeholder="{{description}}" name="message" id="twit-tweet" data-provide="limit" data-counter="#counter" >{{message}}</textarea>
							  {{/if_equals}}
                            {{else}}
                              {{#if_equals headline "Reply Tweet"}}
	                        	<textarea rows="4" class="required form-control w-full twit-tweet-limit" placeholder="Reply Message to {{description}}" name="message" id="twit-tweet" data-provide="limit" data-counter="#counter" >{{description}}&nbsp</textarea>
							  {{else}} 
                                   {{#if_equals headline "Retweet"}}
                                         <textarea rows="4" class="required form-control-F-width"  id="twit-retweet" disabled>{{description}}</textarea>                            
                                         <textarea rows="4" class="required form-control w-full twit-tweet-limit" placeholder="RT @{{tweetOwner}}: {{description}}" name="message" id="twit-tweet" data-provide="limit" data-counter="#counter" style="display:none;">RT @{{tweetOwner}}: {{description}}</textarea>
								   {{else}}<!-- tweet and direct msg -->
                                         <textarea rows="4" class="required form-control w-full twit-tweet-limit" placeholder="{{description}}" name="message" id="twit-tweet" data-provide="limit" data-counter="#counter" ></textarea>
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
                        <div id="schedule_date" class="control-group form-group col-md-6">
                          <label class="control-label"><b>Date </b></label>
                          <div class="controls">
                            <input id="scheduled_date" class="required form-control date" type="text" name="scheduled_date" placeholder="mm/dd/yyyy">							
                          </div>
                        </div>
                        <div id="schedule_time" class="control-group form-group col-md-6">
                          <label class="control-label"><b>Time </b></label>
                          <div class="controls">
                             <input id="scheduled_time" class="required form-control" type="text" name="scheduled_time" placeholder="time">		
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
                 <a href="#" class="btn btn-sm btn-primary" id="edit_retweet">Edit</a>
                 <a href="#" class=" save btn btn-sm btn-primary" id="send_retweet">Retweet</a>
                 <a href="#" class="save btn btn-sm btn-primary" id="send_tweet" style="display:none;">Send</a>
            {{else}}       		 
			     <a href="#" class="save btn btn-sm btn-primary" id="send_tweet">Send</a>
            {{/if_equals}}			
			<span><img src="img/ajax-spinner.gif" id="spinner-modal" style="display:none;"></img></span>
	        <span class="save-status"></span>
	    </div>
     </fieldset> 
  </form>
</div>
</div>
</div>
</script>
<script id="socialsuite-RT-userlist-template" type="text/html">
<div class="modal fade message-modal" id="socialsuite_RT_userlistModal">
 <div class="modal-dialog">
    <div class="modal-content">
  <div class="modal-header">
     <button class="close" data-dismiss="modal">x</button>
     <h3 class="modal-title">{{retweeted}}</h3>			
  </div>
  <div class="modal-body agile-modal-body">	       
     <article class="stream-item">
       <div class="item-box">       
         <div class="tweet">
            <header class="tweet-header pull-left p-b">        
               <a class="account-link link-complex block" href="https://twitter.com/{{user.screen_name}}" rel="user" target="_blank"> 
                 <div>  
	                <img class="thumb-md thumb-wrapper" src={{user.profile_image_url}}  alt="{{user.screen_name}}'s avatar">   
 		         </div> 
 		        
    	       </a>  
	        </header> 
	        <div class="pull-left" style="width:calc(100% - 73px)">
 <a class="account-link link-complex block" href="https://twitter.com/{{user.screen_name}}" rel="user" target="_blank">  
 <div class="tweet-user"> 
 		            <span class="account-inline txt-ellipsis"> 
 		 	          <b class="fullname link-complex-target">{{user.name}}</b> 
 			          <span class="username txt-mute"><span class="at">@</span>{{user.screen_name}}</span>  
 		            </span> 
 		         </div> 
</a>
               <p class="tweet-text m-b-xs"> {{safe_tweet text}} </p> 
               <footer class="tweet-footer cf text-muted">
              <i class="fa fa-clock-o text-sm text-muted"></i> <time class="time-ago txt-mute txt-small time-ellipsis" datetime="{{created_at}}">{{created_at}}</time>
	        </footer>  
            </div>	
<div class="clearfix"></div>
            
	     </div>
	   </div>                        
     </article>
     <article stream-id="{{stream_id}}" id="RTuser_list">
            
     </article>	        
   </div>
   <div class="modal-footer">
   </div>
</div>
</div>
</div>
</script>

<script id="socialsuite-RT-userlist-collection-template" type="text/html">	
<ul id="socialsuite-RT-userlist-model-list" class="RTuserlist-modal">  
      <img id="spinner-modal"  style="width:20px;height:20px; margin-left:50%;" src="img/ajax-spinner.gif">
</ul>		
</script>

<script id="socialsuite-RT-userlist-model-template" type="text/html">	
<div id="{{id}}" class="stream-item">
  <div class="item-box p-sm">       
     <div class="tweet">
       <header class="tweet-header pull-left">        
         <a class="account-link link-complex block" href="https://twitter.com/{{user.screenName}}" rel="user" target="_blank"> 
           <div class="obj-left item-img tweet-img">  
	         <img class="thumb r-2x" src={{user.profileImageUrlHttps}}  alt="{{user.screenName}}'s avatar">   
 		   </div> 
 		 
    	 </a>  
	   </header> 
	   <div class="pull-left"> 
<a class="account-link link-complex block" href="https://twitter.com/{{user.screenName}}" rel="user" target="_blank"> 
  <div class="tweet-user"> 
 		     <span class="account-inline txt-ellipsis"> 
 		 	   <b class="fullname link-complex-target">{{user.name}}</b> 
 			   <span class="username txt-mute p-b-xs"><span class="at">@</span>{{user.screenName}}</span>  
 		     </span> 
 		   </div> 
</a>
           <p class="tweet-text text-muted"> {{user.followersCount}} Followers </p> 
       </div>
       <footer class="right">
          <button class="tweet-to-user btn btn-default btn-sm" tweet-owner="{{user.screenName}}"><i class="icon icon-share" title="Tweet to {{user.screenName}}"></i></button>    	  		   
          <button class="follow-user btn btn-default btn-sm" tweet-owner="{{user.screenName}}"><i class="icon-twitter"></i> Follow</button>
       </footer>
<div class="clearfix"></div>
	 </div>
  </div>                        
</div>
</script>
<!-- initial script which displayes social suite tabs with Add Stream and Added Streams. -->
<script id="socialsuite-scheduled-updates-template" type="text/html">
<div class="wrapper-md bg-light lter b-b">
<div class="row">
    <div class="col-md-12">
        
            <h3 class="h3 font-thin ">Scheduled Messages</h3>
        
    </div>
</div>         
</div>


<div class="row">
           <div class="col-md-12">              
                <div id="socialsuite-scheduled-updates-content">
                     
                </div>        
            </div><!-- col-md-12 end -->       
</div> <!-- row end -->

<div id="schedule-edit-modal"></div>

</script>    

<script id="socialsuite-scheduled-updates-collection-template" type="text/html">
<div class="wrapper-md bg-light lter b-b">	
<div class="row">
    <div class="col-md-12">
        
            <h3 class="h3 font-thin ">Scheduled Messages</h3>
        
    </div>
</div>         
</div>


<div class="row">
           <div class="col-md-12">              
                <div id="socialsuite-scheduled-updates-content">
                     
                </div>        
            </div><!-- col-md-12 end -->       
</div> <!-- row end -->

<div id="schedule-edit-modal"></div>
<div class="wrapper-md">
<div class="data-block">
         <div class="data-container"> 
         <div class="panel panel-default">
         <div class="panel-heading">Scheduled Messages List</div>         	
			<table id="schedule-updates" class="table table-striped showCheckboxes m-b-none agile-table panel"
				url="core/scheduledupdate/bulk">
             
				<thead>
					<tr>
						<th class="hide">Id</th>
						<th style="width:30%">User</th>
						<th style="width:25%">Message</th>
						<th style="width:15%">Schedule</th>
						<th style="width:15%">Message Type</th>
                        <th style="width:15%">Recipient</th>
					</tr>
				</thead>
				<tbody id="socialsuite-scheduled-updates-model-list" class="socialsuite-scheduled-updates-model-list">
				</tbody>
			</table>
			</div>
         </div>
</div>	
</div>	
</script>

<script id="socialsuite-scheduled-updates-model-template" type="text/html">	
{{#if checkbox}}
	<td><label class="i-checks i-checks-sm"><input class="tbody_check" type="checkbox"/><i></i></label></td>
{{/if}}	
<td class='data hide' data='{{id}}'>{{id}}</td>
<td>
   <div class="table-resp">
      <a class="account-link link-complex block" href="https://twitter.com/{{screen_name}}" rel="user" target="_blank">    
    	<div class="thumb-sm agile-img m-r-sm">   
           <img class="img-inital r r-2x" src="{{profileImg}}"  alt="{{screen_name}}'s avatar" title="{{screen_name}}'s avatar">     	
    	</div>
    	<div class="agile-thumb agile-thumb-view">
        		 	
                    <a class="text-cap custom-link">@{{screen_name}}</a>
 		         
        		<br/>
        		<small class="text-muted m-t-xs">
        		{{network_type}}        	</small>
	    </div>
      </a>
   </div>
</td>
<td class="is-actionable edit-scheduled-update"><div class="table-resp">{{message}}</div></td>
<td class="is-actionable edit-scheduled-update text-muted">
	<div class="table-resp">
	<i class="fa fa-clock-o m-r-xs"></i>
    <time class="time-ago b-b b-light" value="{{schedule}}" datetime="{{epochToHumanDate "" schedule}}">{{epochToHumanDate "ddd mmm dd yyyy HH:MM:ss" schedule}}</time>
	</div>
</td>
<td class="is-actionable edit-scheduled-update"><div class="table-resp">{{headline}}</div></td>
<td class="is-actionable edit-scheduled-update">
	<div class="table-resp">
    {{#if_equals tweetOwner "/"}}
         <span style="display:none;"></span>
    {{else}}
         <span>{{tweetOwner}}</span>
    {{/if_equals}}
    </div>
</td>
</script><!-- initial script which displayes social suite tabs with Add Stream and Added Streams. -->
<script id="socialsuite-show-streams-template" type="text/html">
<div class="custom-animated custom-fadeInUp">
<div class="wrapper-md bg-light lter b-b">
<div class="row">
    <div class="col-md-12">
        
            <h3 class="pull-left font-thin h3">Social Suite</h3>
<div class="pull-right">
            <div class="m-r-xs inline-block">       
              <a href="#scheduledmessages" id="show_scheduled_updates" class="btn btn-default  btn-sm" style="display:none;"><i class="icon-time icon"></i></a>              
            </div>   
            <a id="add-stream" class="add-stream add-stream-tab btn btn-default btn-addon btn-sm">
 			  <i class="icon icon-plus-sign"></i> Add Stream
			</a>             
               
</div>
<div class="clearfix"></div>
       
    </div>
</div>         
</div>
<div class="wrapper-md">
<div class="row">
           <div class="col-md-12">              
                <div id="socialsuite-tabs-content">
                     
                </div>        
            </div><!-- col12 end -->       
</div> <!-- row end -->
</div>
</div>
</script>    
<!-- main social suite container -->
<script id="socialsuite-streams-collection-template" type="text/html">
{{#unless this.length}}
 <div class="alert-info alert">
    <div class="slate-content">
       <div class="box-left pull-left m-r-md">
            <img alt="Clipboard" src="/img/clipboard.png" />
       </div>
       <div class="box-right pull-left">
            <h4 class="m-t-none">You have not associated any social accounts currently.</h4>
            <div class="text">
               	Track relevant conversations and participate. Import prospective customers and run multichannel campaigns.  
            </div>
          		Get started by adding a social stream.<br>
                <a id="add-stream" class="add-stream add-stream-tab btn btn-default btn-sm m-t-xs">
 		          <i class="icon icon-plus-sign"></i> Add Stream
		        </a> 
	  	</div>
		<div class="clearfix">
		</div>
    </div>
 </div>
{{else}} 
  <ul id="socialsuite-streams-model-list" class="columns row p-l-none ui-sortable">  </ul> 
{{/unless}}
</script>

<!-- main column in container -->
<script id="socialsuite-streams-model-template" type="text/html">
<div class="column panel panel-default">
<header class="column-header panel-heading p-b-xs">    
  {{#if profile_img_url}}
     <img src={{profile_img_url}} id={{id}}-profile-img class="user-profile-img pull-left thumb r-2x m-b-none" alt="{{screen_name}}'s avatar." title="{{screen_name}}'s avatar.">
  {{/if}}             
  <!-- <small class="pull-right column-index">{{column_index}}</small> -->    
  <span class="socialicons-widget-top">           
    {{#if_equals network_type "TWITTER"}}                 
        <i class="pull-right margin-hs social-type-icon icon icon-twitter text-muted"></i>
    {{else}}
        <i class="margin-hs social-type-icon icon icon-linkedin text-muted"></i>
    {{/if_equals}}     

    {{#if_equals stream_type "Mentions"}}
         <p class="stream-type-icon icon mentions-small-title text-muted" title="Mentions Stream">@</p>
    {{else}}
         <i class="stream-type-icon icon {{get_stream_icon stream_type}} text-muted" title="{{stream_type}} Stream"></i>
    {{/if_equals}}
   </span>
<span id="stream-spinner-modal-{{id}}" class="waiting-symbol">
         <img src="img/ajax-loader-cursor.gif"></img>
    </span>        
  <h4 class="column-title txt-ellipsis m-t-none"> 
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
  <article id={{id}} tweet-id-str="{{id_str}}" stream-id={{stream_id}} class="stream-item nav-tabs is-actionable is-new {{deleted_msg}}" style="display:none;">
 {{else}}
  <article id={{id}} tweet-id-str="{{id_str}}" stream-id={{stream_id}} class="stream-item nav-tabs is-actionable {{deleted_msg}}">
 {{/if}}
    <div class="item-box">       
      <div class="tweet">
           <header class="tweet-header">        
	          <a class="account-link link-complex block" href="https://twitter.com/{{user.screen_name}}" rel="user" target="_blank"> 
		         <div class="thumb thumb-wrapper tweet-img">  
			       <img class="r-2x" src={{user.profile_image_url}}  alt="{{user.screen_name}}'s avatar" title="Klout Score {{klout_score}}">   
 		         </div> 
 		         
    		  </a>  
		   </header> 
		   <div class="tweet-body"> 
<a class="account-link link-complex block" href="https://twitter.com/{{user.screen_name}}" rel="user" target="_blank"> 
<div class="tweet-user text-base"> 
 			        <span class="account-inline txt-ellipsis"> 
 						<span class="fullname link-complex-target inline-block" style="padding-bottom:1px">{{user.name}}</span> 
 						<span class="username text-muted"><span class="at">@</span>{{user.screen_name}}</span>  
 		    		</span> 
 				 </div> 
</a>
 	          <p class="tweet-text m-b-xs  text-sm">
                 {{safe_tweet text}}
              </p>                  
 			  <footer class="tweet-footer cf text-muted">
              {{#if id_str}}
              {{#if retweeted}}
                 <a class="txt-mute  txt-small block m-b-xs show-retweet text-info">{{retweeted}}</a>
              {{/if}}
             <i class="fa fa-clock-o text-muted text-xs"></i> <time class="time-ago text-muted text-xs time-ellipsis" datetime="{{created_at}}">{{created_at}}</time>
                           
 	    	  <ul class="tweet-actions">
                 {{#if direct_message}}
                    <li> <a class="tweet-action add-twitter-contact" href="#personModal" class="btn btn-sm btn-default right" data-toggle="modal"> 
                            <i class="icon icon-plus-sign" title="Add Contact"></i>                            
                         </a> </li>
                 {{else}}
                    <li> <a class="tweet-action" href="https://twitter.com/{{user.screen_name}}/status/{{id_str}}" rel="url" target="_blank"> 
                            <i class="icon icon-external-link" title="Detail Status"></i>                            
                         </a> </li>	    		
                    <li> <a class="tweet-action add-twitter-contact" href="#personModal" class="btn btn-sm btn-default right" data-toggle="modal"> 
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
<div class="clearfix"></div>	   
		</div>
	</div>                        
  </article>

{{else}} 
  {{#if_equals msg_type "NoTweet"}}
   {{#if show}}
	<article id={{id}}_{{stream_id}} class="no-tweet">
       <p class="bg-danger">{{text}}</p>              
	</article>
   {{/if}}  
  {{/if_equals}}
{{/if_equals}}
</script>